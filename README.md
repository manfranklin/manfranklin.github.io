# Manuel Franklin Website

Personal website source built as a multilingual Jekyll site with TinaCMS support and GitHub Pages deployment.

## Quick start

Clone the repository and install prerequisites manually using their official installers (recommended):

```bash
git clone https://github.com/manfranklin/manfranklin.github.io.git
cd manfranklin.github.io
```

Prerequisites (visit the official pages for installers and platform-specific instructions):

- Ruby — https://www.ruby-lang.org/
- Bundler (Ruby gem) — https://bundler.io/ (`gem install bundler`)
- Node.js (LTS 18 or 20 recommended) — https://nodejs.org/
- npm (bundled with Node.js)

After installing prerequisites, install project dependencies and build:

```bash
# Install Ruby gems
bundle install

# Install Node modules
npm install

# Validate build
JEKYLL_ENV=production bundle exec jekyll build
```

If you use `nvm`, you can switch to a supported Node version with `nvm install 20` and `nvm use 20`.

## Stack and architecture

- Static site generator: [Jekyll](https://jekyllrb.com/)
- Theme: a customized [Reverie](https://github.com/amitmerchant1990/reverie)-based theme with [Sass](https://sass-lang.com/) styling and [Liquid](https://shopify.github.io/liquid/) templates
- Hosting: [GitHub Pages](https://pages.github.com/)
- Analytics: [Umami](https://umami.is/) (privacy-friendly web analytics)
- Search: [Pagefind](https://pagefind.app/)
- Content management: [TinaCMS](https://tina.io/)-ready structure with content organized under the Jekyll content folders
- Styling: [Sass](https://sass-lang.com/) with syntax highlighting and responsive layouts

## How the site is built

The site is generated from plain Markdown, YAML data files, and Liquid templates.

### Main structure

- `_config.yml` — site configuration, URLs, language settings, plugins, and build defaults
- `_layouts/` — page and post layout templates
- `_includes/` — reusable partials such as navigation, metadata, analytics, and SVG icons
- `_posts/` — blog posts written in Markdown
- `_pages/` — standalone pages like About, Blog, Search, and Resources
- `_data/` — localized UI strings and reusable content data
- `assets/` — Sass, JavaScript, and static assets
- `tina/` — TinaCMS configuration for future content editing workflows


### Environment setup

During the install process, `.env.example` is copied to `.env.local` automatically if it does not already exist.

Update `.env.local` before using TinaCMS to provide values such as:

- `TINA_CLIENT_ID`
- `TINA_TOKEN`
- `TINA_BRANCH`
- `UMAMI_DOMAIN`
- `UMAMI_CLIENT_ID`

<!-- The automated installer was removed; follow the manual steps above to prepare your environment. -->

### Local development

Run the site locally:

```bash
bundle exec jekyll serve
```

The site will be available at http://localhost:4000

**Optional:** For TinaCMS content editing interface (requires TINA_TOKEN):
```bash
npm run dev
```
Then access Tina CMS at http://localhost:3000

### Production build

To generate the production build locally:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

## Troubleshooting

### Gem native extension build errors

**Error:** `Gem::Ext::BuildError: Failed to build gem native extension`

**Solution:** Install build tools for your platform (see Prerequisites section above).

After installing build tools, run:
```bash
bundle install
```

### Port already in use (Jekyll)

If port 4000 is busy:
```bash
bundle exec jekyll serve --port 4001
```

### Port already in use (Tina CMS)

If port 3000 is busy:
```bash
PORT=3001 npm run dev
```

### Node modules not found

If you see module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Bundle not working

Clear Bundler cache and reinstall:
```bash
bundle clean --force
bundle install
```

## Hosting and deployment

The site is deployed to GitHub Pages from this repository. Changes pushed to the main branch trigger a Jekyll build and publish the generated site.

### Local development with environment variables

For local development with TinaCMS features, create a `.env.local` file (ignored by Git):

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `TINA_CLIENT_ID` — your TinaCMS client ID
- `TINA_TOKEN` — your TinaCMS content token (optional for local testing)
- `TINA_BRANCH` — git branch to sync (default: main)
- Other optional analytics and service credentials

**Never commit `.env.local` to the repository.**

### GitHub Actions deployment

For automated deployment, set these in your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Add as **Secrets** (encrypted):
   - `TINA_TOKEN`
3. Add as **Variables** (public):
   - `TINA_CLIENT_ID`
   - `TINA_BRANCH`
4. For tighter scoping, add the same values under **Environments → github-pages**

The default GitHub Pages workflow will automatically build and deploy on push.

## Analytics

The site uses Umami for privacy-conscious analytics. The tracking configuration is managed in the site config and analytics includes.

## Content workflow

- Blog posts go in `_posts/`
- Static pages go in `_pages/`
- Language-specific content and UI copy are organized in `_data/`
- Images and media live under `images/` and related asset folders

## Search and performance

The site includes client-side search powered by Pagefind and uses optimized assets, responsive images, and a progressively enhanced JavaScript layer.

## Notes

This project is designed to remain simple, maintainable, and GitHub Pages compatible while still supporting modern static-site features such as multilingual content, search, and future CMS integration.

## License

MIT
