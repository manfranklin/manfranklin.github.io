#!/usr/bin/env bash
set -euo pipefail

# Search for hardcoded UMAMI_CLIENT_ID values in the repository (excluding _site and .git)
# Returns non-zero if any are found.

dir="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

matches=$(grep -RIn --exclude-dir=_site --exclude-dir=.git --exclude=".env.example" "UMAMI_CLIENT_ID" "$dir" || true)
if [ -z "$matches" ]; then
  echo "No UMAMI_CLIENT_ID entries found in repository files."
  exit 0
fi

# Filter any commented examples (lines starting with #) and empty assignments
bad=$(echo "$matches" | grep -vE "^[[:space:]]*#" | grep -vE "UMAMI_CLIENT_ID:\s*$|UMAMI_CLIENT_ID=\s*$" || true)

if [ -n "$bad" ]; then
  echo "Found hardcoded UMAMI_CLIENT_ID occurrences:" >&2
  echo "$bad" >&2
  exit 1
fi

echo "Only example or commented UMAMI_CLIENT_ID entries found."
exit 0
