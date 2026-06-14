#!/usr/bin/env bash
# Compile a Slidedown deck (.sd) to a static HTML deck.
#
#   compile.sh <deck.sd> [--out <dir>]
#
# Resolves the engine by its own location, so it works from any directory
# (this is what the installed `slidedown` command points at).
set -euo pipefail

# Follow symlinks to the real script: the installed `slidedown` is a symlink
# into the repo (~/.local/bin/slidedown), so BASH_SOURCE must be resolved or
# REPO_ROOT lands next to the symlink instead of in the clone.
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$(cd "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  case "$SOURCE" in /*) ;; *) SOURCE="$DIR/$SOURCE" ;; esac  # relative → absolute
done
SCRIPT_DIR="$(cd "$(dirname "$SOURCE")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMPILER="$REPO_ROOT/slidedown/compiler/slidedown.js"

if ! command -v node >/dev/null 2>&1; then
  echo "slidedown: Node.js is required but was not found on PATH." >&2
  echo "           Install it from https://nodejs.org and try again." >&2
  exit 1
fi

if [ ! -f "$COMPILER" ]; then
  echo "slidedown: compiler not found at $COMPILER" >&2
  exit 1
fi

if [ "$#" -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  echo "usage: slidedown <deck.sd> [--out <dir>]"
  echo "  Compiles a Slidedown document to a static HTML deck."
  echo "  Default output: <deck-dir>/output/<deck-name>/"
  exit 0
fi

exec node "$COMPILER" "$@"
