import { defineConfig } from 'tinacms';

type RouterOptions = { document: any };

type ResourceTag = { tag: string };

type ResourceItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  url: string;
  tags?: ResourceTag[];
  language?: string;
  featured?: boolean;
};

const getEnvValue = (...keys: Array<string | undefined>): string =>
  keys.find((value) => value?.trim())?.trim() || '';

const buildPostRouter = ({ document }: RouterOptions): string => {
  const filename = document._sys?.filename || 'post';
  const dateValue = document._values?.date;
  const date = dateValue ? new Date(dateValue) : null;

  if (date && !Number.isNaN(date.getTime())) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `/blog/${year}/${month}/${day}/${filename}`;
  }

  return `/blog/${filename}`;
};

const buildPageRouter = ({ document }: RouterOptions): string => {
  const permalink = document._values?.permalink;
  return permalink || `/${document._sys?.filename}`;
};

const createResourceField = () => ({
  type: 'object' as const,
  list: true,
  name: 'items',
  label: 'Resources',
  ui: {
    itemProps: (item: any) => ({ label: item?.title }),
  },
  fields: [
    { type: 'string' as const, name: 'id', label: 'ID', required: true, description: 'Unique identifier (use kebab-case)' },
    { type: 'string' as const, name: 'title', label: 'Title', required: true },
    { type: 'string' as const, name: 'description', label: 'Description', ui: { component: 'textarea' } },
    { type: 'string' as const, name: 'category', label: 'Category', options: ['learning', 'books', 'courses', 'tools', 'websites', 'ai', 'development'] },
    { type: 'string' as const, name: 'url', label: 'URL', required: true, ui: { component: 'textarea' } },
    {
      type: 'object' as const,
      list: true,
      name: 'tags',
      label: 'Tags',
      ui: {
        itemProps: (item: any) => ({ label: item }),
      },
      fields: [{ type: 'string' as const, name: 'tag', label: 'Tag' }],
    },
    { type: 'string' as const, name: 'language', label: 'Language', options: ['en', 'pt'] },
    { type: 'boolean' as const, name: 'featured', label: 'Featured', description: 'Show this resource in featured section' },
  ],
});

const defaultPostItem = () => ({
  title: 'New Post',
  language: 'en',
  date: new Date().toISOString(),
  layout: 'post',
  author: 'Manuel Franklin',
  published: true,
  comments: true,
});

export default defineConfig({
  branch: getEnvValue(process.env.TINA_BRANCH, process.env.GITHUB_REF_NAME) || 'main',
  clientId: getEnvValue(process.env.PUBLIC_TINA_CLIENT_ID, process.env.TINA_CLIENT_ID),
  token: getEnvValue(process.env.TINA_TOKEN, process.env.TINA_TOKEN_CONTENT, process.env.TINA_TOKEN_SEARCH),
  client: { skip: true },
  build: { outputFolder: 'admin', publicFolder: '' },
  media: { tina: { mediaRoot: 'images', publicFolder: '' } },
  schema: {
    collections: [
      {
        label: 'Blog Posts',
        name: 'posts',
        path: '_posts',
        format: 'md',
        ui: { router: buildPostRouter },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'layout', label: 'Layout', ui: { component: 'hidden' }, defaultValue: 'post' },
          { type: 'string', name: 'language', label: 'Language', options: ['en', 'pt'], description: 'Content language', required: true, defaultValue: 'en' },
          { type: 'string', name: 'date', label: 'Publish Date', ui: { component: 'datetime' }, required: true },
          { type: 'string', name: 'author', label: 'Author', description: 'Post author', defaultValue: 'Manuel Franklin' },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' }, description: 'Short summary for previews and excerpts' },
          { type: 'string', name: 'image', label: 'Featured Image', ui: { component: 'image' } },
          { type: 'string', name: 'permalink', label: 'Permalink', description: 'Optional custom URL for this post' },
          { type: 'string', name: 'categories', label: 'Categories', list: true, ui: { component: 'tags' }, description: 'Use one category per item' },
          { type: 'string', name: 'tags', label: 'Tags', list: true, ui: { component: 'tags' } },
          { type: 'boolean', name: 'comments', label: 'Enable Comments', description: 'Allow readers to comment on this post', defaultValue: true },
          { type: 'boolean', name: 'published', label: 'Published', description: 'Whether to publish this post', defaultValue: true },
          { type: 'string', name: 'translation_key', label: 'Translation Key', description: 'Shared key for translated versions of this post' },
          { type: 'string', name: 'translation_url_en', label: 'English Translation URL' },
          { type: 'string', name: 'translation_url_pt', label: 'Portuguese Translation URL' },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
        defaultItem: defaultPostItem,
      },
      {
        label: 'Pages',
        name: 'pages',
        path: '_pages',
        format: 'md',
        ui: { router: buildPageRouter },
        fields: [
          {
            type: 'object',
            list: false,
            name: 'frontmatter',
            label: 'Front Matter',
            ui: { itemProps: (item: any) => ({ label: item?.title }) },
            fields: [
              { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
              { type: 'string', name: 'layout', label: 'Layout', options: ['page', 'default'] },
              { type: 'string', name: 'permalink', label: 'Permalink', description: '/page-name/' },
              { type: 'string', name: 'language', label: 'Language', options: ['en', 'pt'], required: true },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
            ],
          },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        label: 'Resources',
        name: 'resources',
        path: '_data/resources',
        format: 'yml',
        ui: { allowedActions: { create: true, read: true, update: true, delete: true } },
        fields: [createResourceField()],
      },
      {
        label: 'Site Settings',
        name: 'settings',
        path: '_data',
        format: 'yml',
        ui: { allowedActions: { create: false, read: true, update: true, delete: false } },
        match: { include: 'site-config' },
        fields: [
          {
            type: 'object',
            name: 'owner',
            label: 'Site Owner',
            fields: [
              { type: 'string', name: 'name', label: 'Name' },
              { type: 'string', name: 'email', label: 'Email' },
              { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
              { type: 'string', name: 'location', label: 'Location' },
              { type: 'string', name: 'avatar_url', label: 'Avatar' },
              { type: 'string', name: 'website_url', label: 'Website URL' },
            ],
          },
          {
            type: 'object',
            name: 'social',
            label: 'Social Links',
            fields: [
              { type: 'string', name: 'twitter', label: 'Twitter Handle' },
              { type: 'string', name: 'github', label: 'GitHub Username' },
              { type: 'string', name: 'linkedin', label: 'LinkedIn Profile' },
              { type: 'string', name: 'instagram', label: 'Instagram Handle' },
              { type: 'string', name: 'mastodon', label: 'Mastodon Handle' },
              { type: 'string', name: 'email', label: 'Email' },
            ],
          },
          {
            type: 'object',
            name: 'branding',
            label: 'Branding',
            fields: [
              { type: 'string', name: 'site_name', label: 'Site Name' },
              { type: 'string', name: 'tagline', label: 'Tagline' },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
              { type: 'string', name: 'logo_url', label: 'Logo URL' },
              { type: 'string', name: 'favicon_url', label: 'Favicon URL' },
              { type: 'string', name: 'og_image', label: 'Open Graph Image' },
            ],
          },
          {
            type: 'object',
            name: 'blog',
            label: 'Blog Settings',
            fields: [
              { type: 'number', name: 'posts_per_page', label: 'Posts per Page' },
              { type: 'number', name: 'excerpt_length', label: 'Excerpt Length' },
              { type: 'boolean', name: 'show_author', label: 'Show Author' },
              { type: 'boolean', name: 'show_date', label: 'Show Date' },
              { type: 'boolean', name: 'show_reading_time', label: 'Show Reading Time' },
              { type: 'boolean', name: 'show_categories', label: 'Show Categories' },
              { type: 'boolean', name: 'show_tags', label: 'Show Tags' },
              { type: 'boolean', name: 'enable_comments', label: 'Enable Comments' },
            ],
          },
          {
            type: 'object',
            name: 'resources',
            label: 'Resources Settings',
            fields: [
              { type: 'number', name: 'items_per_page', label: 'Items per Page' },
              {
                type: 'object',
                list: true,
                name: 'categories',
                label: 'Categories',
                ui: { itemProps: (item: any) => ({ label: item }) },
                fields: [{ type: 'string', name: 'category', label: 'Category' }],
              },
              { type: 'boolean', name: 'show_featured', label: 'Show Featured' },
            ],
          },
          {
            type: 'object',
            name: 'showcase',
            label: 'Showcase Settings',
            fields: [
              { type: 'number', name: 'items_per_page', label: 'Items per Page' },
              {
                type: 'object',
                list: true,
                name: 'categories',
                label: 'Categories',
                ui: { itemProps: (item: any) => ({ label: item }) },
                fields: [{ type: 'string', name: 'category', label: 'Category' }],
              },
              { type: 'boolean', name: 'enable_lightbox', label: 'Enable Lightbox' },
              { type: 'boolean', name: 'lazy_loading', label: 'Lazy Loading' },
            ],
          },
          {
            type: 'object',
            name: 'search',
            label: 'Search Settings',
            fields: [
              { type: 'boolean', name: 'enabled', label: 'Enabled' },
              { type: 'string', name: 'engine', label: 'Search Engine', options: ['pagefind', 'lunr'] },
              { type: 'boolean', name: 'show_search_input', label: 'Show Search Input' },
              { type: 'number', name: 'results_per_page', label: 'Results per Page' },
            ],
          },
          {
            type: 'object',
            name: 'comments',
            label: 'Comments Settings',
            fields: [
              { type: 'boolean', name: 'enabled', label: 'Enabled' },
              { type: 'string', name: 'system', label: 'System' },
              { type: 'boolean', name: 'moderation_required', label: 'Moderation Required' },
            ],
          },
          {
            type: 'object',
            name: 'analytics',
            label: 'Analytics Settings',
            fields: [
              { type: 'boolean', name: 'enabled', label: 'Enabled' },
              {
                type: 'object',
                name: 'umami',
                label: 'Umami',
                fields: [
                  { type: 'string', name: 'site_id', label: 'Site ID' },
                  { type: 'string', name: 'domain', label: 'Domain' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'seo',
            label: 'SEO Settings',
            fields: [
              { type: 'boolean', name: 'enable_sitemap', label: 'Enable Sitemap' },
              { type: 'boolean', name: 'enable_robots', label: 'Enable Robots' },
              { type: 'boolean', name: 'enable_og_tags', label: 'Enable OG Tags' },
              { type: 'boolean', name: 'enable_twitter_cards', label: 'Enable Twitter Cards' },
              { type: 'boolean', name: 'enable_json_ld', label: 'Enable JSON-LD' },
              { type: 'boolean', name: 'enable_canonical_urls', label: 'Enable Canonical URLs' },
              { type: 'boolean', name: 'enable_hreflang', label: 'Enable Hreflang' },
            ],
          },
          {
            type: 'object',
            name: 'performance',
            label: 'Performance Settings',
            fields: [
              { type: 'boolean', name: 'minify_css', label: 'Minify CSS' },
              { type: 'boolean', name: 'minify_js', label: 'Minify JS' },
              { type: 'boolean', name: 'lazy_load_images', label: 'Lazy Load Images' },
              { type: 'boolean', name: 'optimize_images', label: 'Optimize Images' },
              { type: 'boolean', name: 'serve_webp', label: 'Serve WebP' },
            ],
          },
          {
            type: 'object',
            name: 'build',
            label: 'Build Settings',
            fields: [
              { type: 'boolean', name: 'increment', label: 'Incremental Build' },
              { type: 'boolean', name: 'watch', label: 'Watch' },
              { type: 'boolean', name: 'strict_front_matter', label: 'Strict Front Matter' },
              { type: 'string', name: 'timezone', label: 'Timezone' },
            ],
          },
          {
            type: 'object',
            name: 'languages',
            label: 'Languages',
            fields: [
              { type: 'string', name: 'default', label: 'Default Language' },
              {
                type: 'object',
                list: true,
                name: 'supported',
                label: 'Supported Languages',
                ui: { itemProps: (item: any) => ({ label: item?.name || item?.code }) },
                fields: [
                  { type: 'string', name: 'code', label: 'Code' },
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'native_name', label: 'Native Name' },
                  { type: 'string', name: 'direction', label: 'Direction' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'features',
            label: 'Feature Flags',
            fields: [
              { type: 'boolean', name: 'bilingual_support', label: 'Bilingual Support' },
              { type: 'boolean', name: 'search', label: 'Search' },
              { type: 'boolean', name: 'comments', label: 'Comments' },
              { type: 'boolean', name: 'analytics', label: 'Analytics' },
              { type: 'boolean', name: 'lightbox_gallery', label: 'Lightbox Gallery' },
              { type: 'boolean', name: 'related_posts', label: 'Related Posts' },
              { type: 'boolean', name: 'social_sharing', label: 'Social Sharing' },
              { type: 'boolean', name: 'email_subscription', label: 'Email Subscription' },
              { type: 'boolean', name: 'dark_mode', label: 'Dark Mode' },
            ],
          },
          {
            type: 'object',
            name: 'archive',
            label: 'Archive Settings',
            fields: [
              { type: 'string', name: 'group_by', label: 'Group By', options: ['year', 'month', 'category'] },
              { type: 'boolean', name: 'show_count', label: 'Show Count' },
            ],
          },
          {
            type: 'object',
            name: 'external_services',
            label: 'External Services',
            fields: [
              { type: 'string', name: 'github_username', label: 'GitHub Username' },
              { type: 'string', name: 'github_repo', label: 'GitHub Repo' },
              { type: 'string', name: 'staticman_api', label: 'Staticman API Endpoint' },
              { type: 'string', name: 'staticman_repo', label: 'Staticman Repository' },
            ],
          },
          {
            type: 'object',
            name: 'contact_form',
            label: 'Contact Form',
            fields: [
              { type: 'boolean', name: 'enabled', label: 'Enabled' },
              { type: 'string', name: 'method', label: 'Method', options: ['formspree', 'staticman', 'email'] },
              { type: 'string', name: 'email', label: 'Email' },
            ],
          },
          {
            type: 'object',
            name: 'cookie_consent',
            label: 'Cookie Consent',
            fields: [
              { type: 'boolean', name: 'enabled', label: 'Enabled' },
              { type: 'string', name: 'message', label: 'Message', ui: { component: 'textarea' } },
              { type: 'string', name: 'dismiss_text', label: 'Dismiss Text' },
              { type: 'string', name: 'learn_more_text', label: 'Learn More Text' },
            ],
          },
          { type: 'boolean', name: 'maintenance_mode', label: 'Maintenance Mode' },
          { type: 'string', name: 'maintenance_message', label: 'Maintenance Message', ui: { component: 'textarea' } },
        ],
      },
    ],
  },
});
