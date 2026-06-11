---
title: Slidedown demo — every Zastrpay element
theme: zastrpay
brand: Slidedown · Demo
quote: We bring cash to the digital world.
audience: Company-Wide
duration: 15
---

# Slidedown demo — every Zastrpay element

## One language,<br>built into ==zastrpay== decks. {title}
Eyebrow: Demo · Zastrpay · Elements
Edit the md, sync, present — **deterministic**, **diffable**, **plain text**.

::: meta
- **Author** · Presenter skill
- **Theme** · Zastrpay
- **Status** · demo
:::
Notes: This deck shows every element the Zastrpay theme supports.

## What the language gives you
Eyebrow: Elements · Cards
Three element families: layout, content, and emphasis.

::: cards
- ◆ | Deterministic | Same md in, same html out — every time.
- ● | Plain text | Diffable, reviewable, editable in any editor.
-* ▲ | Theme-aware | One vocabulary, rendered per theme. | New
:::

::: callout
**Tip:** the starred card renders as the highlighted winner.
:::
Notes: One sentence per card. Transition: the steps.

## From idea to deck in four steps
Eyebrow: Elements · Steps

::: steps
- Brief the presenter skill | Audience, duration, theme, subject.
- It writes the Slidedown md | Your content, in the language.
- The compiler builds the html | `node compiler/compile.js deck.md`
- You edit and sync | The md stays the source of truth.
:::
Notes: Walk steps 1 to 4; step 3 is the deterministic part.

## What is already covered {dark glow}
Eyebrow: Elements · Checks

::: checks
- Speaker notes | Hidden on screen, in the remote and print.
- Remote control | Separate window, R to open.
- Fullscreen | F on the deck, button on the remote.
- Slide list | Jump to any slide from the remote.
- Dots and counter | Wired automatically per theme.
- Print handout | Notes included under each slide.
:::
Notes: Pick two checks to talk through; the rest are on the handout.

## Today vs next {dark}
Eyebrow: Elements · Panels

::: panels
Today | What you have
- Two themes
- Eleven elements each
- One shared runtime
---
Next | What can come
- Image-inspired themes
- More elements on demand
- Your ideas here
:::
Notes: Left panel is today, right panel is next. Transition: the flow.

## How a sync run flows {pure}
Eyebrow: Elements · Flow

::: flow
- ① | Edit | deck.md
- ② | Sync | /presenter sync
-* ③ | Compile | deterministic
- ④ | Reload | browser
-* ✓ | Present | with remote
:::

::: callout
**Reminder:** unresolved directives (double-bracket notes) block the build until resolved.
:::
Notes: Trace one edit through the five nodes; highlight the green ones.

## The numbers
Eyebrow: Elements · Metrics

::: metrics
- 2 | themes
- 11 | elements each
- 1 | shared runtime
- 0 | dependencies
- 100% | plain text
:::

::: chips
- Edit anywhere
- Diff in reviews
- Build in one command
:::
Notes: Anchor on zero dependencies. Transition: plain points.

## When a slide is just points
Eyebrow: Elements · Points

- Top-level bullets become a clean arrow list
- Use `code` for literal identifiers
- Use **bold** for emphasis and ++underline++ for accents
Notes: Close the loop: the same bullets work in both themes.

## One language,<br>— ==for presentations only==. {closing}
Eyebrow: Wrap-up

::: cta
Edit the md, run sync, present with the remote — the html is always generated, never written.
:::
Notes: Repeat the throughline, thank the room, invite questions.
