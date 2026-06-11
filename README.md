# Slidedown — the Presenter language

Slidedown is a small, deterministic markdown dialect for building presentations.
You write one `.md` file (the **source of truth**); the compiler turns it into a
themed HTML deck. Same md in, same html out — **every time**. The html is always
generated, never edited by hand.

```
you edit deck.md  ──►  node compiler/compile.js deck.md  ──►  output/<slug>/
                                                              ├─ index.html
                                                              ├─ style.css
                                                              └─ shared/   (runtime + speaker remote)
```

- Scaffold a deck by briefing the **presenter skill** (`/presenter <brief>`); it
  writes the Slidedown md for you and compiles it.
- Edit the md yourself, then ask **`/presenter sync`** (or run the compiler) to
  rebuild. The build fails with a clear message rather than guessing.
- Working examples: [`examples/purple-demo.md`](examples/purple-demo.md) and
  [`examples/zastrpay-demo.md`](examples/zastrpay-demo.md) — each uses every
  element of its theme.

## Compile

```bash
node <skill-folder>/compiler/compile.js deck.md            # → ./output/<deck>/
node <skill-folder>/compiler/compile.js deck.md --out dir  # explicit output dir
```

## Front-matter

```markdown
---
title: Coverage initiative — what moved and what's next
theme: purple                  # purple | zastrpay  (required)
brand: Acme Quality            # purple: top-left brand · zastrpay: topbar tag
quote: We bring cash to the digital world.   # zastrpay closing slide only
output: output/coverage-dev/   # optional; default output/<md-filename>/
audience: Development Team     # metadata for the skill, not rendered
duration: 30                   # metadata for the skill, not rendered
---
```

## Slides

A slide starts with `##`. Optional `{flags}` at the end of the title line:

```markdown
## The slide title {flags}
Eyebrow: Architecture · 01
Body text becomes the slide's lead/sub paragraph.
Notes: speaker notes — shown in the S panel, the remote, and print.
```

| Flag | Meaning | Themes |
|---|---|---|
| `title` | opening-slide layout (h1, lead; zastrpay adds logo hero + `meta`) | both |
| `closing` | closing layout (zastrpay: dark, logo, `quote`, "Thank you.") | both |
| `dark` `pure` `glow` | slide surface (default `light`) | zastrpay |

A two-column slide needs no flag — a top-level `---` line inside the slide
splits it (see "Two-column slides" below).

Per-slide fields (plain lines, not blocks):

- `Eyebrow: text` — the small uppercase kicker above the title.
- `Notes: text` — speaker notes; repeatable, lines are joined.

## Inline marks

| You write | You get |
|---|---|
| `**bold**` | emphasis |
| `==text==` | gradient headline text (theme accent) |
| `++text++` | underline accent (zastrpay) / bold (purple) |
| `` `code` `` | literal code styling |
| `<br>` | manual line break (titles included) |
| `[[ instruction ]]` | a **directive** — see below; never rendered |

## Elements

Elements are fenced blocks. Items are `- ` lines; fields are separated by
`␣|␣` (space-pipe-space). `-*` marks the highlighted item.

```markdown
::: flow
- ① | Edit | deck.md
-* ② | Compile | deterministic
- ③ | Present | with remote
:::
```

### Availability matrix

| Element | Purple | Zastrpay | What it renders |
|---|---|---|---|
| *(plain text)* | ✓ | ✓ | lead / sub paragraph |
| *(top-level `- ` bullets)* | ✓ | ✓ | clean points list |
| `chips` | ✓ | ✓ | small highlight pills |
| `flow` | ✓ | ✓ | left-to-right diagram with arrows |
| `callout` | ✓ | ✓ | one highlighted statement (purple "moon" / zastrpay note box) |
| `html` | ✓ | ✓ | raw HTML escape hatch (custom SVG diagrams etc.) |
| `bars` | ✓ | — | labelled progress bars |
| `split` | ✓ | — | covered-vs-uncovered split bars |
| `badge` | ✓ | — | one big number badge |
| `formula` | ✓ | — | dark math card (`^{2}` → superscript, `**x**` → accent) |
| `example` | ✓ | — | monospace example line |
| `table` | ✓ | — | report table (markdown table syntax) |
| `compare` | ✓ | — | comparison table (`*row` = chosen, `y`/`n` cells → ✓/✗) |
| `cards` | — | ✓ | icon cards (`-*` winner, `-?` planned; arg `2/3/4` = columns) |
| `steps` | — | ✓ | numbered step list |
| `checks` | — | ✓ | ✓-list; 4+ items auto-split into two columns |
| `panels` | — | ✓ | two dark panels (groups split by `---`) |
| `metrics` | — | ✓ | big-value stat tiles |
| `meta` | — | ✓ | title-slide meta line (`**Label** · value`) |
| `cta` | — | ✓ | closing call-to-action box |

Using an element in a theme that lacks it is a **build error** that names the
alternatives — nothing is silently dropped.

### Element syntax reference

```markdown
::: chips                     # purple: [color:icon] prefix, color ∈ purple|pink|green|blue
- [green:✓] Tested end to end # zastrpay ignores the prefix (arrow pills)
- [purple:◆] Event-driven
:::

::: flow                      # icon | label | sub · "-*" = highlighted node
- ① | Edit | deck.md
-* ② | Compile | deterministic
:::

::: callout
One highlighted sentence, **bold** allowed.
:::

::: bars                      # label | percent (0–100)
- Line coverage | 73
:::

::: split                     # label | covered-percent
- Branch coverage | 46
:::

::: badge                     # value | label — one item
- 42 | services · migrated
:::

::: formula
risk = impact^{2} × (1 − **coverage**)^{3}
:::

::: example
covered / total = **73%**
:::

::: table                     # markdown table; first column = row name
| Component | Coverage | Risk |
| compiler.js | 73% | low |
:::

::: compare                   # "*" = chosen row · y/n cells → ✓/✗
| Option | Fast | Verdict | Chosen |
| *RabbitMQ | y | Fits the event flow | y |
| Polling | n | Too slow | n |
:::

::: cards 3                   # icon | title | body | [pill text] · -* win · -? soon
- ◆ | Instant | Settles in under a minute.
-* ▲ | Recommended | The chosen path. | New
-? ● | Later | On the roadmap.
:::

::: steps                     # title | sub — numbered automatically
- Brief the skill | Audience, duration, theme, subject.
:::

::: checks                    # title | sub — 4+ items become two columns
- Speaker notes | In the remote and print.
:::

::: panels                    # groups split by --- · first line: label | heading
Today | What we have
- Two themes
---
Next | What we add
- More elements
:::

::: metrics                   # value | label
- <1 min | settlement
:::

::: meta                      # title slide only — raw inline content
- **Author** · Presenter skill
:::

::: cta
The closing message in a highlighted box.
:::

::: html                      # escape hatch — raw HTML, e.g. an inline SVG diagram
<svg viewBox="0 0 100 40">…</svg>
:::
```

### Two-column slides

A top-level `---` line splits a slide: content above goes left, below goes
right. In Purple this is the classic text-left / card-right layout (the right
column auto-wraps `bars`/`split`/`table` in a card, centers a `badge`).

```markdown
## Coverage moved
Eyebrow: Results · 01
The lead paragraph on the left.
---
::: bars
- Line coverage | 73
:::
```

## Directives — `[[ ... ]]`

A directive is an instruction **to the presenter skill**, not content:

```markdown
The rollout took [[ look up the real number in the repo ]] weeks.
[[ make this slide a 3-node flow instead of text ]]
```

On `/presenter sync`, the skill first **resolves each directive by editing the
md** (replacing it with real content), then compiles. The compiler refuses to
build while any `[[ ]]` remains, listing them — so a forgotten directive can
never leak into a deck.

## Determinism guarantee

- The compiler is plain Node, zero dependencies, no network, no timestamps.
- Identical md + identical skill version ⇒ **byte-identical** `index.html`.
- All styling comes from `themes/<theme>.css` (copied to `style.css`); all
  behavior from `shared/` (copied verbatim). Decks never get hand-tuned css/js.

## Project layout

```
presenter-skill/
├─ README.md            ← this language manual
├─ SKILL.md             ← how the presenter skill drives all of this
├─ compiler/compile.js  ← the Slidedown compiler (node, no deps)
├─ themes/              ← purple.css · zastrpay.css · zastrpay-logo.html
├─ shared/              ← deck runtime + speaker remote (copied into builds)
├─ examples/            ← one full demo deck per theme
└─ purple-theme.html / zastrpay-theme.html  ← visual reference decks
```

## Presenting

- **S** — speaker-notes panel on the deck · **F** — fullscreen · **R** — the
  speaker remote (separate window: notes, slide list, prev/next, fullscreen).
- Print the deck to get a handout with notes under each slide.
