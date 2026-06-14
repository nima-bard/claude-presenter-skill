# Generate decks with an AI agent

Slidedown ships an integration for popular coding agents, so you can describe a
presentation in plain English and get an **editable `.sd` deck plus a compiled deck**,
built error-free. The agent reads the language, conceptualizes your material into UI-rich
slides, writes the `.sd`, compiles it, and fixes until the build is clean.

## Claude Code

Works in a clone out of the box — the project skill lives at
`.claude/skills/slidedown/SKILL.md`. Open Claude Code in the repo and:

```
/slidedown a 15-minute deck about ./services/auth for the dev team
```

It asks for the **theme** and **duration**, pulls any logo/brand colour from the context,
and reports the source `.sd` plus the compiled `index.html`.

Install it globally with `./scripts/install.sh claude`. Full details:
[integrations/claude](https://github.com/nima-bard/slidedown/blob/master/integrations/claude/README.md).

## Codex CLI

Codex (and other agents that read `AGENTS.md`) pick up the guidance from the repo's root
[`AGENTS.md`](https://github.com/nima-bard/slidedown/blob/master/AGENTS.md).
Open Codex in the repo and ask it to build a deck. Register a global `/slidedown` prompt
with `./scripts/install.sh codex`. Full details:
[integrations/codex](https://github.com/nima-bard/slidedown/blob/master/integrations/codex/README.md).

## Install everything

```bash
./scripts/install.sh        # the `slidedown` CLI + Claude skill + Codex prompt
```

## How it works

Each integration is a thin entry point; the source of truth is the language itself. On
every run the agent reads the [manifesto](reference/manifesto.md) and
[components](reference/components.md), discovers the installed themes/components/icons,
builds the slides, then compiles and loops until the build is clean. To change the
behaviour, edit the skill (`.claude/skills/slidedown/SKILL.md`) or `AGENTS.md`.
