# Slidedown

**Markdown for slides.** Write a `.sd` document in a small, readable dialect and a
zero-dependency compiler turns it into a polished, self-contained HTML deck — themed,
animated, presentable. Same input always produces the same output.

📖 **Documentation:** <https://nima-bard.github.io/slidedown/>

```slidedown
---
title: Payment links — what shipped
theme: neo
---

[@slide title] One link, any channel
[@subtitle] The customer pays in two taps.

[@slide] How a link flows

[flow]
  [node icon:pencil title:Create] in the portal [/node]
  [node icon:share title:Share focal] any channel [/node]
  [node icon:check title:Paid] settled in <1 min [/node]
[/flow]

[callout tone:tip] Tokens are the contract — documents never go beyond them. [/callout]
```

You can write decks by hand, or let an AI agent (Claude Code, Codex) build them for you
from a topic and your repo.

## Use it locally

Needs only **Node.js** (no npm install, no dependencies).

```bash
git clone https://github.com/nima-bard/slidedown.git && cd slidedown
./scripts/install.sh cli            # adds a `slidedown` command (optional)

slidedown slidedown/examples/demo.sd          # → slidedown/examples/output/demo/
# or, without installing:
node slidedown/compiler/slidedown.js my-deck.sd --out build/
```

Open the resulting `index.html` in a browser. Navigate with `←/→`, `S` for speaker
notes, `F` fullscreen, `R` for the speaker remote.

The language itself lives in [`slidedown/`](slidedown/) — see its
[`README`](slidedown/README.md), the [`MANIFESTO`](slidedown/MANIFESTO.md) (the language)
and [`COMPONENTS`](slidedown/COMPONENTS.md) (every building block).

## Generate decks with an AI agent

Slidedown ships an integration for each agent so you can say *"build a 15-minute deck
about X for the team"* and get an editable `.sd` plus a compiled deck, error-free.

- **Claude Code** → [`integrations/claude/`](integrations/claude/README.md). Works in a
  clone out of the box (`.claude/skills/slidedown/`); invoke with `/slidedown`.
- **Codex CLI** → [`integrations/codex/`](integrations/codex/README.md). Works in a clone
  via `AGENTS.md`; or register a global `/slidedown` prompt.

Install both for the whole machine in one go:

```bash
./scripts/install.sh                # `slidedown` CLI + Claude skill + Codex prompt
```

## Contributing

Components and themes are **data** — adding one is usually a drop-in folder, no compiler
changes. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the patterns, the build/test loop,
and the one hard rule (determinism). Issues and PRs welcome.

## License

[Apache-2.0](LICENSE) — free to use, modify, and distribute.
