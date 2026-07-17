Required environment variables for GitHub Pages deployment

Set the following repository variables/secrets in GitHub (Repository Settings → Secrets & variables):

- TINA_CLIENT_ID: TinaCMS public client id
- TINA_TOKEN_CONTENT: (secret) Tina content write token (will be used if `TINA_TOKEN` is not set)
- TINA_TOKEN_SEARCH: (secret) Tina search token (fallback)
- UMAMI_CLIENT_ID: Umami website id (used by analytics include)
- UMAMI_DOMAIN: Umami host (default: cloud.umami.is)

Notes:
- The GitHub Actions workflow will pick the first available Tina token from `TINA_TOKEN`, `TINA_TOKEN_CONTENT`, or `TINA_TOKEN_SEARCH`.
- Locally you can define the same variables in a `.env` file at the project root. See `.env.example` for names.
