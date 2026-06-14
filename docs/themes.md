# Themes

A **theme** supplies a deck's whole look — colours, fonts, surfaces, and the styling of
every component — in a **light and a dark mode**. Pick one in the front-matter:

```slidedown
---
title: My deck
theme: neo
---
```

## Bundled themes

| Theme | Feel |
|---|---|
| `aurora` | Clean violet, modern (light + dark). |
| `verde` | Brand green with hairline-bordered cards. |
| `falling-star` | Painterly Van Gogh night/dawn, full-bleed, handwriting font. |
| `neo` | Soft pastel "silk" backdrop image (light) / deep indigo (dark). |

The current set is whatever lives under `slidedown/themes/` — run `ls slidedown/themes/`.

## Override the accent

The theme sets the accent colour, but any deck can override it from the front-matter —
it recolours the whole accent system (the accent, a derived secondary, and the gradient):

```slidedown
---
theme: aurora
accent: "#45f3a6"     # quote the hex — an unquoted # is a YAML comment
---
```

It's optional; omit it to use the theme's own accent. A light accent automatically flips
on-accent text to dark for legibility.

## Dark mode per slide

Any slide can switch to the theme's dark palette with the `dark` flag:

```slidedown
[@slide dark] A dark slide
```

## Making a theme

Themes are **data**: a `slidedown/themes/<name>/tokens.yaml` value-set (mode-invariant
tokens plus `light:` / `dark:` blocks), an optional `theme.css` for structural flourishes,
and an optional `assets/` folder for bundled fonts or backdrop images. See
[Contributing](contributing.md) and the [token schema](reference/manifesto.md) for the
contract every theme satisfies.
