# The Slidedown language

> The Slidedown language and its compiler. Everything lives under `slidedown/`
> and references nothing outside it. Component details are in the companion spec,
> [`COMPONENTS.md`](COMPONENTS.md); build mechanics in [`README.md`](README.md).

---

## 0. Premise

Slidedown is **Markdown for slides**. Four kinds of thing make up a document:

- **Markdown & text** — the natural content layer; every Markdown document is
  already valid Slidedown.
- **Components** — `[name props] … [/name]`, the themed building blocks.
- **Directives** — `[@name props] …`, structural/tool instructions (slides,
  subtitles, speaker notes, build hints). The `@` prefix marks them.
- **Tokens** — the design vocabulary (colour, font, spacing…) every theme and
  component speaks. **Documents never go beyond the tokens**: a colour is
  `accent`, never `#7c3aed`.

The compiler is deterministic (same source + same theme ⇒ byte-identical HTML),
self-contained (zero dependencies, no network, no timestamps), and forgiving
(names resolve through aliases + nearest-match; an unresolved name stops the
build and suggests the closest match).

---

## 1. Anatomy of a document

```slidedown
---                              ← document header (presentation attributes, YAML)
title: Payment links — what shipped
theme: aurora
transition: slide
---

[@slide title] Payment links              ← a slide. [@slide] opens it; the rest of the line is the TITLE
[@subtitle] One link, any channel          ← [@subtitle] sets the subtitle

One link, any channel — the customer pays in two taps.   ← Markdown body

[callout tone:tip] Tokens are the contract. [/callout]   ← a component

[@slide transition:fade] How a link flows  ← next slide; props go inside [@slide …]
...
```

A document is **one header followed by one or more slides**. Each slide runs from
its `[@slide]` directive to the next `[@slide]` (or end of file). Text before the
first slide is preamble and is not rendered.

---

## 2. Document header

A single `---` YAML block at the very top sets presentation-wide defaults.

A **theme** supplies the deck's look — colours, fonts, surfaces and the styling
of every component, in a **light and a dark mode**. A slide is light by default
and switches with the `dark` flag (§3.2), which swaps the whole palette (surface,
cards, text) at once. The language never names a specific theme: which themes
exist, and the structure each one styles, is the compiler's concern.

```yaml
---
title:       Payment links — what shipped   # presentation title (browser tab + title slide)
theme:       aurora                          # a theme name under themes/
accent:      "#45f3a6"                       # optional — override the theme's accent colour (quote the hex)
transition:  slide                           # default slide entrance — fade | slide
duration:    30                              # talk length in minutes (planning)
font:        Inter                            # optional typeface override
icons:       heroicons-outline                # icon pack from the shared icon resource
brand:       Acme Pay                         # brand wordmark / corner tag
logo:                                          # logo image(s) — single path, or light/dark variants:
  light:     ./assets/logo.svg                 #   shown on light slides + the corner
  dark:      ./assets/logo-dark.svg            #   shown on dark slides
author:      Platform Team                    # byline for the title slide
---
```

| Key | Meaning | Default |
|---|---|---|
| `title` | presentation title | filename |
| `theme` | the deck's theme — colours, fonts, component styling | first theme found |
| `accent` | **optional** override of the theme's accent colour — any CSS colour (`"#45f3a6"`, `"rgb(...)"`, a name). Recolours the whole accent system: the accent, a derived secondary, the gradient, and (for a light accent) the on-accent text. Add `accent2` to set the gradient's second tone. **Quote the value** (`accent: "#45f3a6"`) — unquoted `# ` reads as a YAML comment. | theme's accent |
| `transition` | default slide entrance — `fade` or `slide` | `fade` |
| `duration` | intended length, in minutes | — |
| `font` | typeface override | theme's font |
| `icons` | icon pack from the shared icon resource | theme default |
| `brand` | brand text / wordmark | — |
| `logo` | logo image — a single path, or `light:`/`dark:` variants; copied into `assets/`, shown mode-aware in the corner and reused by `[logo]` | — |
| `author` | byline for the title slide | — |

Unknown keys are kept as metadata, never rendered on their own.

---

## 3. Slides & directives

Directives are `[@name props]` instructions interpreted by the compiler — never
rendered as a themed box.

| Directive | Form | Effect |
|---|---|---|
| `[@slide props] Title` | boundary | opens a slide; the rest of the line is the title |
| `[@subtitle] Subtitle` | boundary | sets the current slide's subtitle |
| `[@note] … [/@note]` | block | hidden speaker notes (panel, remote, print) — not on the slide |
| `[@instruction] … [/@instruction]` | block | a build-time note to the author; the build refuses to finish while any remain |

### 3.1 Slide props

Props go **inside** the `[@slide …]` directive:

```slidedown
[@slide transition:fade align:center] The one number that matters
[@subtitle] What the room will remember
```

### 3.2 Roles & surfaces

Written as bare keywords inside `[@slide]` (they resolve to a role or surface):

| Keyword | Effect |
|---|---|
| `title` (`cover`, `opening`) | opening / title-slide layout |
| `closing` (`end`, `thanks`) | closing-slide layout |
| `dark` | **dark mode** — swaps the slide to the theme's dark palette (surface, cards, text) |
| `pure` | clean, high-contrast surface (light mode) |
| `glow` | accent glow backdrop |

```slidedown
[@slide title glow] Welcome
[@slide dark] What is already covered
[@slide closing] Thank you
```

---

## 4. Components

A component is a **name**, optional **props**, and **content**.

```slidedown
[callout tone:tip] Keep one idea per slide — the rest goes in the notes. [/callout]
```

- **Props** are space-separated `key:value` (quote spaces: `title:"first month"`);
  a bare word is a boolean flag (`focal`).
- **Content** is everything up to the matching `[/name]` — Markdown and other
  components.
- **Void** components self-close: `[image src:./flow.png alt:"flow" /]`.
- **Content mode** (set by each component): `parse` (Markdown + components,
  default), `verbatim` (escaped code), `raw` (untouched HTML), `none` (void).

### 4.1 Sub-components

There is **no** general list/field syntax. A component that groups repeated
parts is built from **its own child components**, each a normal closed tag with
its own props:

```slidedown
[flow]
  [node icon:pencil title:Create] in the portal [/node]
  [node icon:share title:Share focal] any channel [/node]
  [node icon:check title:Paid] settled in <1 min [/node]
[/flow]
```

Which children a component accepts, and what props they take, is defined by that
component (see [`COMPONENTS.md`](COMPONENTS.md)). Child tags are closed like any
component. What used to be item markers (highlight, planned) are now ordinary
child props (`focal`, `state:soon`).

---

## 5. Text & inline formatting

Markdown covers `**bold**`, `*italic*`, `` `code` ``, `[links](url)`, lists. For
any *visual* formatting beyond that, wrap the run in `[text]` — the only such
mechanism (no `==…==`/`++…++` shorthands).

```slidedown
This shipped [text color:accent weight:semibold]ahead of schedule[/text].
```

| Prop | Values |
|---|---|
| `color` | a **token** name — `accent`, `ink`, `muted`, `ok`, `warn`, `danger`, … |
| `filled` | a token name (background) |
| `align` | `left` · `center` · `right` |
| `border` | `none` · `thin` · `thick` · `accent` |
| `weight` | `regular` · `medium` · `semibold` · `bold` |
| `gradient` | paint with the theme gradient (flag) |
| `underline` | accent underline (flag) |

Colours are token names, never raw hex — that is the "documents don't go beyond
tokens" rule in practice.

---

## 6. Shared props

`size:WxH` (percent of the 100×100 slide), `align`, `valign`, `color`, `filled`,
`border`, `mode` are the shared vocabulary.

- **Placement — `size`, `align`, `valign`** apply to *any* component: the
  compiler wraps it in a box (`width:W%`, `height:Hvh`, centred/aligned). Use `*`
  to keep an intrinsic dimension (`size:40x*`). `[column]` sizes itself and opts
  out of the wrapper.
- **Styling — `color`, `filled`, `border`** are honoured by text-like
  components (`[text]`, and any template that reads them).
- **Mode — `mode:dark` / `mode:light`** forces *any* component to the theme's
  dark or light palette regardless of the slide's mode. The compiler wraps it in a
  `display:contents` layer that re-scopes the colour tokens, so only the colours
  change — placement and layout are untouched.

---

## 7. Columns

Divide a slide into vertical columns with `[columns]`; **the number of
`[column]` children is the number of columns.** Each column self-sizes with
`size` (its width share) and aligns with `align`.

```slidedown
[columns]
  [column size:55] The lead paragraph on the left. [/column]
  [column size:45]
    [bars]
      [bar value:73] Line coverage [/bar]
    [/bars]
  [/column]
[/columns]
```

---

## 8. The escape hatch

`[html] … [/html]` emits its content verbatim — for a hand-drawn SVG or a special
embed. It bypasses theming; use sparingly.

---

## 9. The compiler

A multi-stage build (run `node compiler/slidedown.js deck.sd`):

1. **register** — load the token schema, discover `themes/` and `components/`,
   validate each theme against the schema and each component manifest.
2. **parse + lint** — `.sd` → AST; check syntax, unknown names (suggest nearest),
   unclosed tags, unresolved `[@instruction]`.
3. **render** — AST → HTML via each component's logicless template.
4. **bundle** — emit theme tokens as `:root` custom properties; ship **all**
   component CSS + `base.css` into one `styles.css`.
5. **publish** — write the deterministic output folder.

Everything is data:

- **Tokens** — `tokens/schema.yaml` is the contract (token → type). A theme
  (`themes/<name>/tokens.yaml`) supplies the values: mode-invariant tokens at the
  top level, plus `light:` and `dark:` blocks for the per-mode colours/shadows
  (surface, ink, card…). The compiler emits the light set at `:root` and the dark
  set scoped to dark-mode slides (and the chrome while one is active), so
  `[@slide … dark]` swaps the whole palette. Optional `themes/<name>/theme.css`
  adds theme-specific styling, and `themes/<name>/assets/` bundles fonts or
  backdrop images the compiler copies into the deck — so a theme can ship a
  custom font and a full-bleed painting and still be offline + deterministic
  (`falling-star` does; `verde` uses theme.css for bordered cards and glows).
- **Components** — `components/<name>/component.yaml`: a uniform manifest with
  `name`, `aliases`, `props`, `children`, `content` mode, a logicless `template`,
  and `styles`. Extension is a drop-in: add a folder.
- **Templates** are logicless (Mustache subset): `{{prop}}`, `{{{raw}}}`,
  `{{#flag}}…{{/flag}}`, `{{^flag}}…{{/flag}}`, `{{{content}}}`. A child of an
  `indexed` parent also gets `{{i}}` / `{{n}}` / `{{i1}}` (its position and the
  sibling count) — that is how `pyramid` widths and `cycle` angles are computed
  without bespoke compiler code.

Output is deterministic — stable ordering, sorted tokens/components, no
timestamps, no content hashes:

```
output/<deck>/
├─ index.html
├─ styles.css        (:root tokens + base + all component CSS)
├─ assets/           (images + bundled theme fonts/backdrops, when present)
└─ viewer/           (the player runtime, copied verbatim)
```

---

## 10. A complete deck

```slidedown
---
title: Slidedown, rebuilt
theme: aurora
transition: slide
brand: Slidedown
---

[@slide title glow] Slidedown
[@subtitle] Markdown for slides — compiler-driven, deterministic
[@note] Open with the throughline. [/@note]

A [text color:accent weight:semibold]forgiving[/text] language: write `.sd`, compile, present.

[@slide] How a deck builds

[flow]
  [node icon:pencil title:Author] write the .sd [/node]
  [node icon:cog title:Compile focal] five deterministic stages [/node]
  [node icon:play title:Present] static index.html [/node]
[/flow]

[callout tone:tip] Tokens are the contract — documents never go beyond them. [/callout]

[@slide closing] Thank you

[cta] Edit · compile · present. [/cta]
```

---

## 11. Status & open questions

Implemented: the five-stage compiler; the token schema + four themes — `aurora`,
`verde`, `falling-star` (a painterly night/dawn theme with a bundled backdrop image
and handwriting font), and `neo` (a soft "silk" theme on a bundled pastel backdrop
image — pink→lavender→periwinkle on light slides, a deep-indigo gradient on dark)
— each with **light & dark modes**; all 46 components
(see [`COMPONENTS.md`](COMPONENTS.md)); the directives
`@slide`/`@subtitle`/`@note`/`@instruction`; the shared props `size`/`align`/`valign`
plus `mode:dark|light` (flip one component to the other palette); an `animated` flag
for `card`/`bar`/`phase`/`pie-chart`/`bar-chart`/`line-chart`/`milestones`/`delta`/`plan`
(charts grow from zero on slide render; others run looping effects); an embedded Heroicons
pack (outline + `…-solid` filled variants, 580+ glyphs) with `[icon]`; image +
theme-asset (font/backdrop) bundling; the viewer; and a sample deck
(`examples/demo.sd`) that exercises every component — all under `slidedown/`,
byte-deterministic.

Open:

1. **`valign`** is wired (`align-self`) but only bites inside a flex context like
   `[columns]`; general vertical placement needs a sized track.
