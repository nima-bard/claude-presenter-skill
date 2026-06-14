# AGENTS.md — Slidedown

Instructions for AI coding agents (Codex CLI and any AGENTS-aware tool) working in
this repo. Claude Code reads the equivalent skill at
`.claude/skills/slidedown/SKILL.md`; keep the two in step.

This repo is **Slidedown** — a Markdown dialect for presentations plus a deterministic
compiler (`slidedown/compiler/slidedown.js`) that turns a `.sd` document into a static
HTML deck. Two jobs come up: **authoring decks** for a user, and **extending the engine**.

## Authoring a presentation (the common request)

When the user asks to build slides / a deck / a talk / a readout, or to "present" or
"explain to the team" something:

1. **Learn the language first — every time.** Read, in full:
   `slidedown/MANIFESTO.md` (the language), `slidedown/COMPONENTS.md` (every component,
   its exact props/children/aliases), and `slidedown/README.md`. The language evolves —
   never author from memory. Discover what's installed: `ls slidedown/themes/`,
   `ls slidedown/components/`, and the valid icon names in `slidedown/icons/*.yaml`.
   Skim `samples/demo/demo.sd` for real syntax and density.

2. **Understand the subject.** Read the repo/docs behind it; pull real data, names and
   numbers. Find the one message, the audience, and the arc.

3. **Gather the two essentials from the user** (ask in chat):
   - **theme** — one of the installed themes (`ls slidedown/themes/`).
   - **duration** — minutes, 5 → 60 (sets the slide budget: ~5–7 slides for 5 min,
     ~12–16 for 15, ~18–26 for 30, up to ~34–46 for 60).
   Do **not** ask for a logo or brand colour — pull those from context if present
   (a logo image → front-matter `logo:`; a brand hex → `accent: "#…"`). If none is
   found, proceed and note at the end that they'd improve the design.

4. **Conceptualize, UI-first.** One idea per slide; speaker detail goes in `[@note]`.
   Prefer components over prose — a three-sentence slide is almost always one component
   (cards, flow, metrics, steps, compare, timeline…). Mix components for rhythm and use
   `dark` / `glow` / `title` / `closing` surfaces for pacing.

5. **Write the deck** in a self-contained folder so assets resolve:
   `decks/<slug>/<slug>.sd` with a `decks/<slug>/assets/` for any images.
   Front-matter keys are only those defined in the MANIFESTO. Rules the build enforces:
   colours are token names (or the optional `accent:` override), icon names must exist
   in the active pack, every component is closed, props are documented, and **no
   `[@instruction]` may remain** (it fails the build — resolve every one).

6. **Compile, and guarantee a clean build:**
   ```
   node slidedown/compiler/slidedown.js decks/<slug>/<slug>.sd --out decks/<slug>/build
   ```
   (or the `slidedown` CLI if installed). The compiler reports errors with nearest-match
   suggestions and notes for broken icons/missing assets. Loop — fix the `.sd`, recompile
   — until it ends with `built N slides` at **exit 0, no errors, no actionable notes**.
   Never finish on a failing or warning build.

7. **Report**: the source `.sd`, the compiled `decks/<slug>/build/index.html`, a one-line
   per-slide outline, and the logo/accent note if relevant.

## Extending the engine

- **Components are data:** one `slidedown/components/<name>/component.yaml` (props +
  logicless Mustache-subset template + CSS). Adding one is a drop-in folder.
- **Themes are token value-sets:** `slidedown/themes/<name>/tokens.yaml` (+ optional
  `theme.css` and `assets/`). **Tokens are the contract** (`slidedown/tokens/schema.yaml`).
- **Determinism is a hard invariant:** same `.sd` + theme ⇒ byte-identical output (sorted
  keys, no timestamps/hashes). Preserve it.
- After any change, rebuild `samples/demo/demo.sd` and confirm a clean build; keep
  `MANIFESTO.md` / `COMPONENTS.md` in sync.

## Conventions
- Don't edit compiled output (`**/output/`, `**/build/`) by hand — it's generated.
- The compiler is zero-dependency plain Node; keep it that way.
