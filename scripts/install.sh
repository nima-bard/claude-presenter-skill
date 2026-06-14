#!/usr/bin/env bash
# Slidedown installer — set up the `slidedown` command and the agent integrations
# (Claude Code skill + Codex prompt) for the current user.
#
#   ./scripts/install.sh                 # install everything (cli + claude + codex)
#   ./scripts/install.sh cli             # only the `slidedown` command
#   ./scripts/install.sh claude          # only the Claude Code skill
#   ./scripts/install.sh codex           # only the Codex prompt
#   ./scripts/install.sh --uninstall     # remove what this script installs
#
# In-repo use needs no install: the project ships .claude/skills/slidedown/SKILL.md
# and AGENTS.md, so Claude Code and Codex pick Slidedown up automatically when you
# work inside a clone. This script adds a global `slidedown` CLI and registers the
# skill/prompt so you can drive it from anywhere.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

BIN_DIR="${SLIDEDOWN_BIN_DIR:-$HOME/.local/bin}"
CLAUDE_SKILL_DIR="$HOME/.claude/skills/slidedown"
CODEX_PROMPT_DIR="$HOME/.codex/prompts"

c_green=$'\033[32m'; c_dim=$'\033[2m'; c_bold=$'\033[1m'; c_reset=$'\033[0m'
ok()   { echo "  ${c_green}✓${c_reset} $*"; }
info() { echo "  ${c_dim}·${c_reset} $*"; }

require_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "${c_bold}Node.js is required${c_reset} (the compiler runs on plain Node)." >&2
    echo "Install it from https://nodejs.org and re-run this script." >&2
    exit 1
  fi
}

install_cli() {
  require_node
  mkdir -p "$BIN_DIR"
  ln -sf "$REPO_ROOT/scripts/compile.sh" "$BIN_DIR/slidedown"
  chmod +x "$REPO_ROOT/scripts/compile.sh"
  ok "installed the ${c_bold}slidedown${c_reset} command → $BIN_DIR/slidedown"
  case ":$PATH:" in
    *":$BIN_DIR:"*) ;;
    *) info "add $BIN_DIR to your PATH:  export PATH=\"$BIN_DIR:\$PATH\"" ;;
  esac
}

# A small global skill/prompt that points at this clone (absolute paths), so the
# agent can find the engine + language docs from any project.
pointer_body() {
  cat <<EOF
Slidedown — generate a presentation as a \`.sd\` deck and compile it to static HTML.

This is the global entry point. The engine and the full authoring guide live in a
clone of the Slidedown repo at:

    SLIDEDOWN_HOME = $REPO_ROOT

To author a deck, follow the workflow and rules documented in:
  - $REPO_ROOT/.claude/skills/slidedown/SKILL.md   (the full step-by-step skill)
  - $REPO_ROOT/slidedown/MANIFESTO.md              (the language)
  - $REPO_ROOT/slidedown/COMPONENTS.md             (every component + props)

In short: read those docs, gather theme + duration from the user, pull any logo/brand
colour from context, conceptualize the material into UI-rich slides, write the \`.sd\`,
then compile it and fix until the build is clean:

    slidedown <deck.sd> --out <dir>        # the installed CLI, or:
    node $REPO_ROOT/slidedown/compiler/slidedown.js <deck.sd> --out <dir>

Finish only on a clean build (exit 0, no errors, no unresolved notes).
EOF
}

install_claude() {
  mkdir -p "$CLAUDE_SKILL_DIR"
  { echo "---"; echo "name: slidedown"; \
    echo "description: Generate a presentation as a Slidedown (.sd) deck and compile it to a static HTML deck using the engine at $REPO_ROOT. Use when asked to build slides, a deck, a talk, a readout, or to 'present' something."; \
    echo "---"; echo; pointer_body; } > "$CLAUDE_SKILL_DIR/SKILL.md"
  ok "registered the Claude Code skill → $CLAUDE_SKILL_DIR/SKILL.md  ${c_dim}(invoke with /slidedown)${c_reset}"
}

install_codex() {
  mkdir -p "$CODEX_PROMPT_DIR"
  pointer_body > "$CODEX_PROMPT_DIR/slidedown.md"
  ok "registered the Codex prompt → $CODEX_PROMPT_DIR/slidedown.md  ${c_dim}(invoke with /slidedown)${c_reset}"
}

uninstall() {
  rm -f "$BIN_DIR/slidedown" && info "removed $BIN_DIR/slidedown" || true
  rm -rf "$CLAUDE_SKILL_DIR" && info "removed $CLAUDE_SKILL_DIR" || true
  rm -f "$CODEX_PROMPT_DIR/slidedown.md" && info "removed $CODEX_PROMPT_DIR/slidedown.md" || true
  echo "${c_green}Uninstalled.${c_reset}"
  exit 0
}

echo "${c_bold}Slidedown${c_reset}  ${c_dim}($REPO_ROOT)${c_reset}"

do_cli=0; do_claude=0; do_codex=0
if [ "$#" -eq 0 ]; then
  do_cli=1; do_claude=1; do_codex=1
else
  for arg in "$@"; do
    case "$arg" in
      cli)         do_cli=1 ;;
      claude)      do_claude=1 ;;
      codex)       do_codex=1 ;;
      all)         do_cli=1; do_claude=1; do_codex=1 ;;
      --uninstall) uninstall ;;
      -h|--help)
        sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
        exit 0 ;;
      *) echo "unknown argument: $arg  (try: cli | claude | codex | --uninstall | --help)" >&2; exit 1 ;;
    esac
  done
fi

[ "$do_cli" = 1 ]    && install_cli
[ "$do_claude" = 1 ] && install_claude
[ "$do_codex" = 1 ]  && install_codex

echo "${c_green}Done.${c_reset}  Try:  ${c_bold}slidedown $REPO_ROOT/samples/demo/demo.sd${c_reset}"
