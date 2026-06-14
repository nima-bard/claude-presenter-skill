# Getting started

Slidedown needs only **[Node.js](https://nodejs.org)** — the compiler is plain Node with no
dependencies, no `npm install`.

## 1. Get the repo

```bash
git clone https://github.com/nima-bard/slidedown.git
cd slidedown
```

## 2. (Optional) install the `slidedown` command

```bash
./scripts/install.sh cli      # adds a `slidedown` command to ~/.local/bin
```

This lets you run `slidedown <deck.sd>` from any directory. Without it, call the compiler
directly: `node slidedown/compiler/slidedown.js <deck.sd>`.

## 3. Compile a deck

Try the sample, which exercises every component:

```bash
slidedown slidedown/examples/demo.sd
# → slidedown/examples/output/demo/index.html
```

Or your own file, to an explicit output directory:

```bash
slidedown my-deck.sd --out build/
```

Open the resulting `index.html` in any browser. While presenting:

| Key | Action |
|---|---|
| `←` / `→` | previous / next slide |
| `S` | toggle speaker notes |
| `F` | fullscreen |
| `R` | open the speaker remote (a second window) |

## 4. Write your own

A minimal deck:

```slidedown
---
title: My first deck
theme: aurora
---

[@slide title] Hello, Slidedown
[@subtitle] One idea per slide.

[@slide] What it gives you

[cards cols:3]
  [card icon:bolt title:Fast] one command [/card]
  [card icon:check title:Deterministic state:win] same in, same out [/card]
  [card icon:sparkles title:Themed] swap a word [/card]
[/cards]
```

A document is one front-matter block followed by slides; each slide starts at `[@slide]`.
For the full language, see **[the manifesto](reference/manifesto.md)**; for every building
block and its props, see **[components](reference/components.md)**.

Prefer not to write it yourself? Let an **[AI agent](agents.md)** draft the deck from a
topic and your repo.
