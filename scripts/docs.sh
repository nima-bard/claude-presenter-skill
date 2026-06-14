#!/usr/bin/env bash
# Preview the docs site locally. Creates a throwaway Python venv with MkDocs Material,
# then serves the site with live reload at http://127.0.0.1:8000
#
#   ./scripts/docs.sh            # serve with live reload
#   ./scripts/docs.sh build      # one-off static build into ./site
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"   # mkdocs + snippet includes resolve from the repo root

# Silence mkdocs-material's "MkDocs 2.0" advisory banner (the package's own opt-out).
export NO_MKDOCS_2_WARNING=1

if ! command -v python3 >/dev/null 2>&1; then
  echo "docs: Python 3 is required (https://python.org)." >&2
  exit 1
fi

VENV="$REPO_ROOT/.venv-docs"
if [ ! -d "$VENV" ]; then
  echo "· creating docs venv ($VENV) …"
  python3 -m venv "$VENV"
fi
# shellcheck disable=SC1091
source "$VENV/bin/activate"
pip install --quiet --upgrade pip
pip install --quiet -r "$REPO_ROOT/requirements.txt"

case "${1:-serve}" in
  build) mkdocs build ;;
  serve|*) mkdocs serve ;;
esac
