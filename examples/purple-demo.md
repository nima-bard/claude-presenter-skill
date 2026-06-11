---
title: Slidedown demo — every Purple element
theme: purple
brand: Slidedown
audience: Development Team
duration: 15
---

# Slidedown demo — every Purple element

## Slidedown {title}
Eyebrow: Demo · Purple · Elements
A ==deterministic language== for decks — edit the md, sync, done.
Notes: This deck shows every element the Purple theme supports. Keep one idea per slide in real decks.

::: chips
- [purple:◆] Deterministic build
- [pink:●] Plain markdown
- [green:▲] Speaker remote
- [blue:■] One shared runtime
:::

## How a deck is built
Eyebrow: Pipeline
You edit the **md**, the compiler does the rest — same input, same output.

::: flow
- ① | Edit | deck.md
-* ② | Compile | compile.js
- ③ | Present | index.html
:::

::: callout
◆ The md file is the **source of truth** — html is never edited by hand.
:::
Notes: Walk the flow left to right; dwell on the compile step. Transition: progress bars.

## Progress bars
Eyebrow: Elements · 01
The `bars` element renders labelled progress bars, **clamped to 0–100**.
---
::: bars
- Slides covered | 73
- Elements demoed | 84
- Coffee left | 38
:::
Notes: Lead with the 84 bar. Transition: split bars.

## Split bars and examples
Eyebrow: Elements · 02
The `split` element shows covered vs uncovered in one bar.

::: example
covered / total = **73%**
:::
---
::: split
- Branch coverage | 46
- Line coverage | 73
:::
Notes: Explain covered vs uncovered with the example. Transition: the badge.

## One big number
Eyebrow: Elements · 03
The `badge` element is for the **one number** the room should remember.
---
::: badge
- 42 | elements · demoed
:::
Notes: Pause on the number. Transition: the formula.

## Formulas
Eyebrow: Elements · 04
The `formula` element renders a dark math card, with `^{...}` for exponents.

::: formula
risk = impact^{2} × (1 − **coverage**)^{3}
:::

::: chips
- [green:✓] Accent with **bold**
- [purple:◆] Superscripts
:::
Notes: Read the formula once in plain words. Transition: tables.

## Report tables
Eyebrow: Elements · 05
The `table` element renders the report style — first column is the row name.

::: table
| Component | Coverage | Risk |
| compiler.js | 73% | low |
| presenter.js | 83% | low |
| remote.js | 24% | high |
:::
Notes: Point at the high-risk row only. Transition: comparison tables.

## Comparison tables
Eyebrow: Elements · 06

::: compare
| Option | Fast | Verdict | Chosen |
| *Slidedown | y | Deterministic, plain text | y |
| Hand-written HTML | n | Slow to edit | n |
| Slide app exports | y | Not diffable | n |
:::
Notes: Explain why the starred row won. Transition: plain lists.

## Plain points
Eyebrow: Elements · 07
Top-level bullets become a clean list — for when a slide really is just points.

- One idea per slide
- `code` for literal identifiers
- ==gradient== for the headline word
- **bold** for emphasis
Notes: Close by repeating the throughline: edit md, sync, present.
