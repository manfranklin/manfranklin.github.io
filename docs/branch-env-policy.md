# Branch-specific environment file policy

This repository enforces a simple branch policy for environment files:

- Main branch: keep the production file named .env.production.
- Dev branch: keep the development file named .env.development.

The policy is validated locally and in CI through scripts/validate-env-branch-policy.sh.

## Local setup

Run the following once to enable the repository Git hook:

```bash
bash scripts/install-git-hooks.sh
```

## Manual validation

```bash
bash scripts/validate-env-branch-policy.sh main
bash scripts/validate-env-branch-policy.sh dev
```
