# Slidedown

**Markdown for slides.** Write a `.sd` document in a small, readable dialect and a
deterministic, **zero-dependency** compiler turns it into a polished, self-contained HTML
deck — themed, animated, presentable. The same input always produces the same output.

**🎬 [Live demos](demos.md) — see every theme running in your browser.**

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

## Why Slidedown

- **Readable source.** A deck is a text file you can diff, review, and version.
- **Deterministic.** Same `.sd` + theme ⇒ byte-identical HTML. No surprises.
- **Self-contained.** Zero dependencies, no network, no build toolchain — just Node.
- **Themeable.** Swap one word in the front-matter to restyle every slide.
- **Agent-friendly.** Let Claude Code or Codex draft a deck from a topic and your repo.

## Next steps

<div class="grid cards" markdown>

- :material-rocket-launch: **[Getting started](getting-started.md)** — install and compile your first deck.
- :material-play-circle: **[Live demos](demos.md)** — every theme, every component, in your browser.
- :material-book-open-variant: **[The language](reference/manifesto.md)** — document anatomy, slides, components, tokens.
- :material-shape: **[Components](reference/components.md)** — every building block and its props.
- :material-palette: **[Themes](themes.md)** — the bundled looks and the accent override.
- :material-robot: **[AI agents](agents.md)** — generate decks with Claude Code or Codex.
- :material-hand-heart: **[Contributing](contributing.md)** — add a component or theme.

</div>

Slidedown is open source under the [Apache-2.0 license](https://github.com/nima-bard/slidedown/blob/master/LICENSE).
