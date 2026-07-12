#!/usr/bin/env bash
set -euo pipefail

branch="${1:-${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)}}"

if [[ -z "$branch" ]]; then
  echo "Unable to determine the current branch."
  exit 1
fi

case "$branch" in
  main)
    required_file=".env.production"
    forbidden_file=".env.development"
    ;;
  dev)
    required_file=".env.development"
    forbidden_file=".env.production"
    ;;
  *)
    echo "No env-file policy is enforced for branch '$branch'."
    exit 0
    ;;
esac

if [[ ! -f "$required_file" ]]; then
  echo "ERROR: Missing required env file '$required_file' for branch '$branch'."
  exit 1
fi

if [[ ! -s "$required_file" ]]; then
  echo "ERROR: Required env file '$required_file' must not be empty."
  exit 1
fi

if [[ -f "$forbidden_file" ]]; then
  echo "ERROR: Forbidden env file '$forbidden_file' is present on branch '$branch'."
  exit 1
fi

if ! grep -Eq '^[A-Za-z_][A-Za-z0-9_]*=' "$required_file"; then
  echo "ERROR: '$required_file' must contain at least one KEY=VALUE entry."
  exit 1
fi

echo "Env branch policy passed for '$branch': using '$required_file'."
