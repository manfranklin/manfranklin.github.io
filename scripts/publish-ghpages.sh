#!/usr/bin/env bash
set -euo pipefail

# Publish the locally-built Jekyll site to the `gh-pages` branch.
# Usage: ./scripts/publish-ghpages.sh [branch]
# Default branch: gh-pages

BRANCH=${1:-gh-pages}

# Ensure we are in a git repo and have a remote
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || true)
if [ -z "$ROOT_DIR" ]; then
  echo "Error: not inside a git repository. Run this from the project root." >&2
  exit 1
fi

REMOTE_URL=$(git -C "$ROOT_DIR" config --get remote.origin.url || true)
if [ -z "$REMOTE_URL" ]; then
  echo "Error: no remote.origin URL found. Please set a remote named 'origin'." >&2
  exit 1
fi

echo "Building site (npm run build)..."
npm run build

SITE_DIR="$ROOT_DIR/_site"
if [ ! -d "$SITE_DIR" ]; then
  echo "Error: built site not found at $SITE_DIR" >&2
  exit 1
fi

TMPDIR=$(mktemp -d)
echo "Preparing temporary worktree at $TMPDIR"

# Initialize a temporary git repo and populate with _site contents
git init "$TMPDIR/repo"
cd "$TMPDIR/repo"
git remote add origin "$REMOTE_URL"

# Create orphan branch to ensure a clean history for gh-pages
git checkout --orphan "$BRANCH"
git rm -rf . >/dev/null 2>&1 || true

echo "Copying generated site into temp repo..."
cp -a "$SITE_DIR/." .

git add -A
git commit -m "chore: publish site (manual deploy)"

echo "Pushing to $BRANCH (force)..."
git push -f origin "$BRANCH"

echo "Publish complete. Cleaning up..."
cd - >/dev/null 2>&1 || true
rm -rf "$TMPDIR"

echo "Done."
