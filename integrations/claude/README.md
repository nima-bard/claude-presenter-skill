# Slidedown for Claude Code

Generate a presentation from a topic and your repo, in plain English — Claude reads the
Slidedown language, writes an editable `.sd` deck, compiles it, and fixes until the build
is error-free.

The skill itself lives at [`../../.claude/skills/slidedown/SKILL.md`](../../.claude/skills/slidedown/SKILL.md)
(the conventional location Claude Code discovers).

## Use it in this repo (no install)

Open Claude Code anywhere inside a clone and the project skill is picked up automatically:

```
/slidedown a 15-minute deck about ./services/auth for the dev team
```

Claude will ask for the **theme** and **duration**, pull any logo/brand colour from the
context you point it at, build `decks/<slug>/<slug>.sd`, compile it, and report the source
plus the compiled `decks/<slug>/build/index.html`.

## Use it from anywhere (global install)

```bash
./scripts/install.sh claude     # registers ~/.claude/skills/slidedown/ pointing at this clone
```

This installs a small global skill that points Claude at this clone's engine and docs, so
you can run `/slidedown` from any project. (It compiles with the `slidedown` CLI — install
that too with `./scripts/install.sh cli`, or run `./scripts/install.sh` to do everything.)

## How it works

The skill is a thin entry point; the source of truth is the language itself. On each run it
reads [`slidedown/MANIFESTO.md`](../../slidedown/MANIFESTO.md) and
[`slidedown/COMPONENTS.md`](../../slidedown/COMPONENTS.md), discovers the installed themes /
components / icons, conceptualizes your material into UI-rich slides (components over walls
of text), then compiles with
`node slidedown/compiler/slidedown.js …` and loops until the build is clean.

To tweak the behaviour, edit
[`../../.claude/skills/slidedown/SKILL.md`](../../.claude/skills/slidedown/SKILL.md).

## Requirements

- [Claude Code](https://claude.com/claude-code)
- Node.js (for the compiler)
