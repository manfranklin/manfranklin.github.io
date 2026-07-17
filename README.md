# Manuel Franklin Website

This repository contains the source for my personal website, built as a multilingual Jekyll site and published on GitHub Pages.

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

### Prerequisites

Before running the site locally, make sure you have:

- [Ruby](https://www.ruby-lang.org/) (recommended version 3.2)
- [Bundler](https://bundler.io/)
- [Node.js](https://nodejs.org/) (optional, mainly for local tooling support)

### Local development

Install dependencies and run the site locally:

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000 in your browser.

### Production build

To generate the production build locally:

```bash
bundle exec jekyll build
```

## Hosting and deployment

The site is deployed to GitHub Pages from this repository. Changes pushed to the main branch trigger a Jekyll build and publish the generated site.

### Secure environment variables for GitHub Pages

Use GitHub-managed secrets and variables rather than committing credentials to the repository.

1. Open your repository settings and go to Secrets and variables → Actions.
2. Add these as repository or environment-scoped values:
   - Secret: TINA_TOKEN
   - Variable: TINA_CLIENT_ID
   - Variable: TINA_BRANCH (optional, usually main)
3. If you use the GitHub Pages deployment environment, add the same values under Environments → github-pages for tighter scoping.
4. For local development, create a local file named .env.local (ignored by Git) with the same variable names.

A safe example file is included as .env.example.

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
