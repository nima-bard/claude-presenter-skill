# Slidedown for Codex

Generate a presentation from a topic and your repo with the [Codex CLI](https://github.com/openai/codex)
— Codex reads the Slidedown language, writes an editable `.sd` deck, compiles it, and fixes
until the build is error-free.

Codex (and other AGENTS-aware agents) load instructions from `AGENTS.md`. The Slidedown
guidance lives in this repo's root [`AGENTS.md`](../../AGENTS.md).

## Use it in this repo (no install)

Open Codex inside a clone and ask:

```
codex
> build a 15-minute deck about ./services/auth for the dev team
```

Codex picks up `AGENTS.md` automatically. It will ask for the **theme** and **duration**,
pull any logo/brand colour from the context, write `decks/<slug>/<slug>.sd`, compile it,
and loop until the build is clean — reporting the source and the compiled
`decks/<slug>/build/index.html`.

## Use it from anywhere (global prompt)

```bash
./scripts/install.sh codex      # registers ~/.codex/prompts/slidedown.md pointing at this clone
```

Then, in any Codex session:

```
/slidedown a deck about our Q3 results for leadership
```

The global prompt points Codex at this clone's engine and language docs. Install the
`slidedown` CLI too (`./scripts/install.sh cli`) so it can compile from anywhere, or run
`./scripts/install.sh` to set up everything at once.

## How it works

`AGENTS.md` is the entry point; the source of truth is the language itself. Codex reads
[`slidedown/MANIFESTO.md`](../../slidedown/MANIFESTO.md) and
[`slidedown/COMPONENTS.md`](../../slidedown/COMPONENTS.md), discovers installed
themes/components/icons, builds UI-rich slides, then compiles with
`node slidedown/compiler/slidedown.js …` and loops until the build is clean.

To tweak the behaviour, edit [`../../AGENTS.md`](../../AGENTS.md).

## Requirements

- [Codex CLI](https://github.com/openai/codex) (or another agent that reads `AGENTS.md`)
- Node.js (for the compiler)
