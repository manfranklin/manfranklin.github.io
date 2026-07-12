import { defineConfig } from "tinacms";

const branch = process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  client: { skip: true },
  build: {
    outputDir: "admin",
    publicDir: "",
  },
  media: {
    tina: {
      mediaRoot: "images",
      targetPath: "/images",
    },
  },
  schema: {
    collections: [
      {
        label: "Blog Posts",
        name: "posts",
        path: "_posts",
        format: "md",
        ui: {
          router: ({ document }) => {
            const slug = document._sys?.filename || "blog";
            return `/blog/${slug}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "layout",
            label: "Layout",
            ui: {
              component: "hidden",
            },
            defaultValue: "post",
          },
          {
            type: "string",
            name: "language",
            label: "Language",
            options: ["en", "pt"],
            description: "Content language",
            required: true,
            defaultValue: "en",
          },
          {
            type: "string",
            name: "date",
            label: "Publish Date",
            ui: {
              component: "datetime",
            },
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            description: "Post author",
            defaultValue: "Manuel Franklin",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
            description: "Short summary for previews and excerpts",
          },
          {
            type: "string",
            name: "image",
            label: "Featured Image",
            ui: {
              component: "image",
            },
          },
          {
            type: "string",
            name: "permalink",
            label: "Permalink",
            description: "Optional custom URL for this post",
          },
          {
            type: "string",
            name: "categories",
            label: "Categories",
            list: true,
            ui: {
              component: "tags",
            },
            description: "Use one category per item",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "boolean",
            name: "comments",
            label: "Enable Comments",
            description: "Allow readers to comment on this post",
            defaultValue: true,
          },
          {
            type: "boolean",
            name: "published",
            label: "Published",
            description: "Whether to publish this post",
            defaultValue: true,
          },
          {
            type: "string",
            name: "translation_key",
            label: "Translation Key",
            description: "Shared key for translated versions of this post",
          },
          {
            type: "string",
            name: "translation_url_en",
            label: "English Translation URL",
          },
          {
            type: "string",
            name: "translation_url_pt",
            label: "Portuguese Translation URL",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        defaultItem: () => ({
          title: "New Post",
          language: "en",
          date: new Date().toISOString(),
          layout: "post",
          author: "Manuel Franklin",
          published: true,
          comments: true,
        }),
      },
      {
        label: "Resources",
        name: "resources",
        path: "_data/resources",
        format: "yml",
        ui: {
          allowedActions: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
        fields: [
          {
            type: "object",
            list: true,
            name: "items",
            label: "Resources",
            ui: {
              itemProps: (item) => ({
                label: item?.title,
              }),
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
                required: true,
                description: "Unique identifier (use kebab-case)",
              },
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "category",
                label: "Category",
                options: [
                  "learning",
                  "books",
                  "courses",
                  "tools",
                  "websites",
                  "ai",
                  "development",
                ],
              },
              {
                type: "string",
                name: "url",
                label: "URL",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                list: true,
                name: "tags",
                label: "Tags",
                ui: {
                  itemProps: (item) => ({
                    label: item,
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "tag",
                    label: "Tag",
                  },
                ],
              },
              {
                type: "string",
                name: "language",
                label: "Language",
                options: ["en", "pt"],
              },
              {
                type: "boolean",
                name: "featured",
                label: "Featured",
                description: "Show this resource in featured section",
              },
            ],
          },
        ],
      },
      {
        label: "Showcase Items",
        name: "showcase",
        path: "_showcase",
        format: "md",
        ui: {
          router: ({ document }) => {
            return `/showcase/${document._sys.filename}`;
          },
        },
        fields: [
          {
            type: "object",
            list: false,
            name: "frontmatter",
            label: "Front Matter",
            ui: {
              itemProps: (item) => ({
                label: item?.title,
              }),
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "category",
                label: "Category",
                options: ["dogs", "travel", "projects", "misc"],
              },
              {
                type: "string",
                name: "image",
                label: "Featured Image",
                ui: {
                  component: "image",
                },
              },
              {
                type: "object",
                list: true,
                name: "images",
                label: "Gallery Images",
                description: "Additional images for gallery",
                ui: {
                  itemProps: (item) => ({
                    label: item?.url,
                  }),
                },
                fields: [
                  {
                    type: "image",
                    name: "url",
                    label: "Image",
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text",
                  },
                  {
                    type: "string",
                    name: "caption",
                    label: "Caption",
                  },
                ],
              },
              {
                type: "string",
                name: "date",
                label: "Date",
                ui: {
                  component: "datetime",
                },
              },
              {
                type: "boolean",
                name: "featured",
                label: "Featured",
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        label: "Pages",
        name: "pages",
        path: "_pages",
        format: "md",
        ui: {
          router: ({ document }) => {
            return `/pages/${document._sys.filename}`;
          },
        },
        fields: [
          {
            type: "object",
            list: false,
            name: "frontmatter",
            label: "Front Matter",
            ui: {
              itemProps: (item) => ({
                label: item?.title,
              }),
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "layout",
                label: "Layout",
                options: ["page", "default"],
              },
              {
                type: "string",
                name: "permalink",
                label: "Permalink",
                description: "/page-name/",
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        label: "Site Settings",
        name: "settings",
        path: "_data",
        format: "yml",
        uiFormat: "toml",
        ui: {
          allowedActions: {
            create: false,
            read: true,
            update: true,
            delete: false,
          },
        },
        match: {
          include: "site-config",
        },
        fields: [
          {
            type: "object",
            name: "owner",
            label: "Site Owner",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
              },
              {
                type: "string",
                name: "email",
                label: "Email",
              },
              {
                type: "string",
                name: "bio",
                label: "Bio",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "location",
                label: "Location",
              },
              {
                type: "image",
                name: "avatar_url",
                label: "Avatar",
              },
            ],
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              {
                type: "string",
                name: "twitter",
                label: "Twitter Handle",
              },
              {
                type: "string",
                name: "github",
                label: "GitHub Username",
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn Profile",
              },
              {
                type: "string",
                name: "instagram",
                label: "Instagram Handle",
              },
            ],
          },
          {
            type: "object",
            name: "branding",
            label: "Branding",
            fields: [
              {
                type: "string",
                name: "site_name",
                label: "Site Name",
              },
              {
                type: "string",
                name: "tagline",
                label: "Tagline",
              },
              {
                type: "string",
                name: "description",
                label: "Site Description",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
        ],
      },
    ],
  },
});
