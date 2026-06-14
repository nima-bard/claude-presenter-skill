# Contributing to Slidedown

Thanks for helping! Slidedown is built so the common contributions — **a new component, a
new theme, a new icon** — are *data*, not compiler changes. You usually just add a folder.

## The one hard rule: determinism

The same `.sd` + theme must always produce **byte-identical** output (the compiler sorts
keys, ships all CSS, and uses no timestamps or hashes). Any change must preserve this. The
compiler stays **zero-dependency plain Node** — no packages.

## Add a component

1. Create `slidedown/components/<name>/component.yaml` — `name`, optional `aliases`, a
   `content` mode, `props`, `children`, a logicless `template`, and `styles` (CSS that
   reads token custom properties like `var(--color-accent)`; namespace your classes).
2. Add it to `samples/demo/demo.sd` and document it in `slidedown/COMPONENTS.md`.
3. Rebuild and check both a light and a `dark` slide.

Read a few existing manifests first — `cards`, `flow`, `callout` are good models.

## Add a theme

Drop `slidedown/themes/<name>/tokens.yaml` providing every token in
`slidedown/tokens/schema.yaml` (top-level + `light:`, with `dark:` overrides). Optional
`theme.css` for structural flourishes and an `assets/` folder for bundled fonts/images.

## Build & test

```bash
node slidedown/compiler/slidedown.js samples/demo/demo.sd
```

The build must finish with `built N slides` at **exit 0, no errors, and no actionable
notes** (e.g. unknown icons or missing assets). `samples/demo/demo.sd` exercises every
component, so it doubles as the regression check.

## Docs

The documentation site lives in `docs/` (built with MkDocs Material) and is published to
GitHub Pages on every push to `master`. The **Language**, **Components** and **Contributing**
pages are generated from `slidedown/MANIFESTO.md`, `slidedown/COMPONENTS.md` and this file —
edit those, not the stubs under `docs/`. Preview locally with `./scripts/docs.sh`.

## Pull requests

- Keep changes focused; update `MANIFESTO.md` / `COMPONENTS.md` when behaviour changes.
- Don't commit generated output (`**/output/`, `**/build/`).
- Describe what you changed and confirm the demo builds clean.

By contributing you agree your work is licensed under [Apache-2.0](LICENSE).
