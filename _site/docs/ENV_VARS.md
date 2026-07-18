Required environment variables for GitHub Pages deployment

Set the following repository variables/secrets in GitHub (Repository Settings → Secrets & variables):


- Locally you can define the same variables in a `.env` file at the project root. See `.env.example` for names.

Do NOT hardcode values in `_config.yml`:

- Remove any `UMAMI_CLIENT_ID` entries from `_config.yml` before committing. Storing the real website ID or other secrets in tracked files risks accidental leakage. Use repository secrets or environment variables instead.
Umami setup guidance:

- `UMAMI_CLIENT_ID` must be the exact website ID shown in your Umami dashboard. If the ID is incorrect the Umami gateway will return HTTP 400 errors.
- Ensure the site domain configured in your Umami dashboard matches the production hostname (the site `url`), otherwise tracking requests may be rejected. Localhost builds are excluded by default.

GitHub Actions / Pages (CI) guidance:

- Add the following repository-level secrets or environment variables so production builds on GitHub Actions receive the correct Umami values:

	- `UMAMI_CLIENT_ID` — set to your Umami website ID (e.g. `1b2c3ac0-...`).
	- `UMAMI_DOMAIN` — usually `cloud.umami.is` for Umami Cloud, or your self-hosted domain.
	- `UMAMI_ENABLED` — `true` to enable Umami for production builds.

- Where to set them:

	- Repository secrets: Settings → Secrets & variables → Actions → New repository secret.
	- Or add them as Environment variables under the `github-pages` Environment (Settings → Environments → github-pages → Variables) if you prefer environment-scoped variables for Pages deployments.

- Note: The sample workflow `.github/workflows/jekyll-gh-pages.yml` does not explicitly export Umami env vars; GitHub Actions will expose repository secrets and environment variables automatically to build steps. Make sure the values are present in the repository settings so the `jekyll build` step can read them.

Example: configuring secrets via the repo UI will make `UMAMI_CLIENT_ID` available during the Jekyll build, and the site generator will inject the correct script tag into the generated pages.
