Required environment variables for GitHub Pages deployment

Set the following repository variables/secrets in GitHub (Repository Settings → Secrets & variables):

- UMAMI_ENABLED: Set to true to enable Umami only for production builds (defaults to false for local/test/preview)
- UMAMI_CLIENT_ID: Umami website id (used by analytics include)
- UMAMI_DOMAIN: Umami host (default: cloud.umami.is)

Notes:
- Locally you can define the same variables in a `.env` file at the project root. See `.env.example` for names.
