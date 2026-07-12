#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$repo_root/.git/hooks"

cat > "$repo_root/.git/hooks/pre-commit" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
if [[ -z "$branch" ]]; then
  exit 0
fi

if [[ "$branch" == "main" || "$branch" == "dev" ]]; then
  bash scripts/validate-env-branch-policy.sh "$branch"
fi
EOF

chmod +x "$repo_root/.git/hooks/pre-commit"
echo "Git pre-commit hook installed."
