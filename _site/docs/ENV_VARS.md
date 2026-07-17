Required environment variables for GitHub Pages deployment

Set the following repository variables/secrets in GitHub (Repository Settings → Secrets & variables):

- UMAMI_CLIENT_ID: Umami website id (used by analytics include)
- UMAMI_DOMAIN: Umami host (default: cloud.umami.is)

Notes:
- Locally you can define the same variables in a `.env` file at the project root. See `.env.example` for names.
