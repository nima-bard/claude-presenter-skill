# Slidedown — the engine

A small Markdown dialect for presentations and a **deterministic, zero-dependency
compiler** that turns a `.sd` document into a static HTML deck. Everything the compiler
needs lives in this folder; the same `.sd` plus the same theme produces **byte-identical**
output (no network, no timestamps).

```
you write deck.sd  ──►  node slidedown/compiler/slidedown.js deck.sd  ──►  output/<deck>/
                                                                            ├─ index.html
                                                                            ├─ styles.css
                                                                            └─ viewer/
```

## Use it locally

Needs only Node.js. From the repo root:

```bash
node slidedown/compiler/slidedown.js slidedown/examples/demo.sd     # → slidedown/examples/output/demo/
node slidedown/compiler/slidedown.js my-deck.sd --out build/        # explicit output dir
# or, after ./scripts/install.sh cli :
slidedown my-deck.sd --out build/
```

Open the resulting `index.html`. Keys: `←/→` navigate · `S` notes · `F` fullscreen ·
`R` speaker remote.

## What's here

```
slidedown/
├─ compiler/slidedown.js   ← the five-stage compiler (register · parse+lint · render · bundle · publish)
├─ tokens/schema.yaml      ← the token contract (token → type)
├─ themes/<name>/          ← tokens.yaml (+ optional theme.css, assets/) — one value-set per theme
├─ components/<name>/component.yaml   ← one manifest per component: props, children, template, styles
├─ icons/<pack>.yaml       ← icon packs (Heroicons-style)
├─ base.css                ← structural + typographic layer
└─ viewer/                 ← the player runtime (nav, transitions, notes, remote), copied into every deck
```

Sample decks live in [`../samples/`](../samples/) — e.g. `demo/demo.sd`, which exercises every component.

Two ideas make it work: **tokens are the contract** (documents reference a colour by name,
e.g. `accent`, never a raw value, so swapping the theme restyles everything), and
**components are data** (each is a drop-in folder the compiler discovers at build time).

## Learn the language

- [`MANIFESTO.md`](MANIFESTO.md) — the full language: document anatomy, directives, slides, components, tokens, the compiler.
- [`COMPONENTS.md`](COMPONENTS.md) — every component with its exact props and children.

> A richer, well-designed docs site is planned. For now these two files are the reference.
