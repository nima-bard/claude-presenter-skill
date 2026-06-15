# Component reference

Every Slidedown component, with its props and children. The compiler defines each
component's **structure**; the active **theme** supplies its **look** (colours, fonts,
surfaces). For the language itself — slides, directives, tokens, composition — see the
[Language guide](MANIFESTO.md).

### How to read an entry

Each component below lists, where relevant:

- **Aliases** — other names for the same component (use whichever reads best).
- **Props** — `key:value` attributes on the opening tag. A bare word is a boolean **flag**
  (e.g. `animated`). Quote values with spaces: `title:"first month"`.
- **Children** — the nested tags a grouping component is built from, each with its own props.
- **Content** — what goes between the opening and closing tags (Markdown, unless noted).

Composition is the whole model: a grouping component (`cards`, `flow`, `timeline`…) is built
from its **own child components** — there is no `|`-field syntax. Every component also accepts
the [shared props](#shared-props).

> All 48 components are implemented (one `components/<name>/component.yaml` each), plus the
> `@slide` / `@subtitle` / `@note` / `@instruction` directives. `samples/demo/demo.sd` exercises
> every one, and all four themes (`aurora`, `verde`, `falling-star`, `neo`) render them from
> token values alone.

---

## Shared props

Accepted by **every** component:

| Prop | Values | Meaning |
|---|---|---|
| `size` | `WxH` in slide-percent — `20x50`, `40x*`, `*x30`, `40` | size as a share of the 100×100 slide (`*` = intrinsic) |
| `align` | `left` · `center` · `right` | horizontal placement + inner text alignment |
| `valign` | `top` · `middle` · `bottom` | vertical placement within its area |
| `color` | `accent` · `ink` · `muted` · *named token* · `#hex` | foreground / accent colour |
| `filled` | `none` · `paper` · `dark` · `accent` · `muted` · `#hex` | background fill |
| `border` | `none` · `thin` · `thick` · `accent` | border weight / colour |
| `mode` | `dark` · `light` | force just this component to the theme's dark/light palette |
| `id` | slug | optional anchor for linking |

**Icons.** Any `icon:` prop (on `node`, `card`, `chip`, `callout`…) names a glyph in the
deck's icon pack (default `heroicons-outline`, 580+ glyphs). Append `-solid` for the filled
variant — `star` is the outline, `star-solid` the fill.

---

## Text & emphasis

### text

A styled span or box — the universal "extra formatting" primitive, and the *only* one (no
punctuation shorthands). Inline when short; a block when it wraps block content.

- **Content:** the run of Markdown to style.
- **Props:** `color` (token) · `filled` (token background) · `weight` (`regular` / `medium` / `semibold` / `bold`) · `case` (`normal` / `upper` / `small-caps`) · `align` (`left` / `center` / `right`) · `border` (`none` / `thin` / `thick` / `accent`) · `gradient` (flag) · `underline` (flag)

```slidedown
Shipped [text color:accent weight:semibold]ahead of schedule[/text].
```

---

## Callouts & statements

### callout

One highlighted statement — a tinted note bar.

- **Aliases:** `note` · `important`
- **Content:** one statement.
- **Props:** `tone` (`info` / `tip` / `warn` / `key` — default `key`, the accent gradient) · `color` (tints the bar) · `icon` (leading glyph)

```slidedown
[callout tone:warn] Refunds older than 90 days need a manager's approval. [/callout]
```

### quote

A large quote card with a quotation mark and attribution.

- **Aliases:** `quotation` · `testimonial`
- **Content:** the quotation.
- **Props:** `by` (attribution, shown below the quote)

```slidedown
[quote by:"Leonardo da Vinci"]
Simplicity is the ultimate sophistication.
[/quote]
```

### chips

A row of small pills.

- **Aliases:** `pills` · `tags`
- **Children:** `chip` — a pill; content is the label. Props: `color` (a palette hue / `#hex`), `icon`.

```slidedown
[chips]
  [chip color:accent icon:check]Tested end to end[/chip]
  [chip icon:bolt]Event-driven[/chip]
[/chips]
```

### cta

The closing message box — a bold, accent-filled panel.

- **Aliases:** `takeaway` · `call-to-action`
- **Content:** one or two lines.

```slidedown
[cta] Edit the deck, compile, present. [/cta]
```

### statement

One oversized, centred sentence — the slide that is a single idea.

- **Aliases:** `hero` · `big-idea`
- **Content:** the sentence (use `[text]` inside to accent words).
- **Props:** `kicker` (eyebrow above) · `by` (attribution below) · `gradient` (flag — paint the text with the theme gradient)

```slidedown
[statement kicker:"Why Slidedown" gradient]
Decks should be written, not dragged.
[/statement]
```

### eyebrow

A small category pill above the slide title — the section label and an optional index, like
`● THE PROBLEM · 01`. Place it as the first body element of the slide; it lifts itself above
the title automatically (the slide's inner column flips to flex layout only when an eyebrow
is present, so other slides are untouched).

- **Aliases:** `kicker` · `category`
- **Content:** the label (e.g. `The problem`).
- **Props:** `index` (the trailing figure, e.g. `01`) · `dot` (flag — show a leading accent dot) · `tone` (`accent` default / `ink`)

```slidedown
[@slide] Two pains, every branch switch

[eyebrow dot index:01] The problem [/eyebrow]
```

---

## Process & flow

### flow

A left-to-right diagram of nodes joined by arrows.

- **Aliases:** `pipeline` · `process`
- **Props:** `scale` (`1` default / `2` / `3` — larger nodes)
- **Children:** `node` — content is the sub-text. Props: `icon`, `title`, `focal` (flag — the highlighted node).

```slidedown
[flow]
  [node icon:pencil-square title:Edit] deck.sd [/node]
  [node icon:cog title:Compile focal] deterministic [/node]
  [node icon:play title:Present] index.html [/node]
[/flow]
```

### steps

An auto-numbered vertical list (numbered by order).

- **Aliases:** `instructions` · `how-to` · `agenda`
- **Children:** `step` — content is the detail. Props: `title`.

```slidedown
[steps]
  [step title:"Brief the skill"] Audience, duration, theme, subject. [/step]
  [step title:"It writes the deck"] Your content, in the language. [/step]
[/steps]
```

### numbered

An auto-numbered **horizontal** row of cards — each item has a giant accent numeral on the
left and a title + body on the right. The horizontal companion to `steps`; pair with `cards`
when the items should read in order (1, 2, 3) rather than as parallel options.

- **Aliases:** `numbered-row` · `ordered-cards`
- **Props:** `cols` (`2` default / `3` / `4`)
- **Children:** `item` (aliases `point`, `entry`) — content is the body (Markdown). Props: `title`.

```slidedown
[numbered cols:2]
  [item title:"Branch switch → redeploy everything"]
    Which services changed? **Nobody knows** — so it's deploy all, every time.
  [/item]
  [item title:"What is running right now?"]
    Image tags trace back to a commit, but nothing answers it **branch-wise**.
  [/item]
[/numbered]
```

### cycle

A circular process — stages around a ring with a looping centre icon. Positions are computed
by index (best 3–6); list stages clockwise from the top.

- **Aliases:** `loop` · `circular`
- **Props:** `icon` (centre glyph, default `arrow-path`)
- **Children:** `stage` (aliases `step`, `phase`) — content is the sub-text. Props: `title`.

```slidedown
[cycle]
  [stage title:Author] write .sd [/stage]
  [stage title:Compile] five stages [/stage]
[/cycle]
```

### timeline

Horizontal milestones on a single track.

- **Aliases:** `roadmap` · `phases` · `journey`
- **Children:** `phase` (alias `milestone`) — content is the sub-text. Props: `when`, `title`, `state` (`current` highlighted / `future` dashed & muted), `animated` (flag — the dot pulses).

```slidedown
[timeline]
  [phase when:Q1 title:Discovery] scope agreed [/phase]
  [phase when:Q2 title:Build state:current] we are here [/phase]
  [phase when:Q3 title:Rollout state:future] all merchants [/phase]
[/timeline]
```

### milestones

An alternating timeline — labelled cards above and below the track, each tied to a node.
(For a simpler single-row track, use `timeline`.)

- **Aliases:** `chronology` · `milestone-track`
- **Children:** `milestone` (aliases `stop`, `point`) — content is the description. Props: `label`, `current` (flag — highlights its node + card), `animated` (flag — shine sweep).

```slidedown
[milestones]
  [milestone label:"Day 1"] Draft the deck in plain .sd [/milestone]
  [milestone label:"Day 2" current animated] Compile — five deterministic stages [/milestone]
  [milestone label:"Day 3"] Present in the browser [/milestone]
[/milestones]
```

---

## Grids, groups & comparison

### cards

A grid of icon cards.

- **Aliases:** `boxes` · `features` · `options`
- **Props:** `cols` (`2` / `3` / `4`, default `3`)
- **Children:** `card` — content is the body. Props: `icon`, `title`, `pill` (corner tag), `state` (`win` highlighted / `soon` planned & dashed), `animated` (flag — a sweeping shine).

```slidedown
[cards cols:3]
  [card icon:bolt title:Instant] Settles in under a minute. [/card]
  [card icon:star title:Recommended pill:New state:win] The chosen path. [/card]
  [card icon:clock title:Later state:soon] On the roadmap. [/card]
[/cards]
```

### panels

Grouped dark panels, each with a label, heading and its own content.

- **Aliases:** `groups`
- **Children:** `panel` — content is Markdown (typically a bullet list). Props: `label`, `title`.

```slidedown
[panels]
  [panel label:Today title:"What we have"]
    - Four themes
  [/panel]
  [panel label:Next title:"What we add"]
    - More components
  [/panel]
[/panels]
```

### checks

A tick list. Four or more items flow into two columns.

- **Aliases:** `checklist` · `benefits`
- **Children:** `check` — content is the detail. Props: `title`, `icon` (default `check`).

```slidedown
[checks]
  [check title:"Speaker notes"] In the remote and print. [/check]
  [check title:Fullscreen] F on the deck. [/check]
[/checks]
```

### versus

A vs B, with an arrow badge between the two sides.

- **Aliases:** `vs` · `before-after`
- **Props:** `icon` (the centre-badge glyph, default `arrow-right`)
- **Children:** `side` (two of them) — content is Markdown (bullets). Props: `label`, `title`, `prefer` (flag — the highlighted side).

```slidedown
[versus]
  [side label:Before title:"Manual checks"]
    - slow
  [/side]
  [side label:After title:Automated prefer]
    - instant
  [/side]
[/versus]
```

### pricing

Side-by-side pricing plans for a slide — each a card with a name, price and feature list (no
CTA buttons; it's a deck, not a landing page).

- **Aliases:** `plans` · `tiers`
- **Children:** `plan` (aliases `tier`, `pkg`) — content is the feature list (bullets render as ticks). Props: `name`, `price`, `period`, `badge` (corner tag), `featured` (flag — lifts the plan), `animated` (flag — shine sweep).

```slidedown
[pricing]
  [plan name:Starter price:Free]
    - One theme
    - All components
  [/plan]
  [plan name:Team price:"$12" period:"/mo" featured animated badge:Popular]
    - All four themes
    - Speaker remote
  [/plan]
[/pricing]
```

### pyramid

A layered pyramid — list layers apex-first (top, narrowest) down to the base (widest); each
width is computed from its position.

- **Aliases:** `hierarchy` · `layers`
- **Children:** `layer` (aliases `level`, `tier`) — content is the sub-text. Props: `title`.

```slidedown
[pyramid]
  [layer title:Vision] why we build [/layer]
  [layer title:Foundation] tokens & compiler [/layer]
[/pyramid]
```

### architecture

A layered architecture — tiers stacked top to bottom, each a row of boxes with an optional
side label. (For free-form boxes + arrows, use `[html]`.)

- **Aliases:** `tiers` · `stack`
- **Children:** `tier` (aliases `layer`, `row`) — props: `label`. Holds **`box`** children (aliases `node`, `service`) — content is the box label, prop: `icon`.

```slidedown
[architecture]
  [tier label:Build]
    [box icon:cog] compiler [/box]
    [box icon:swatch] themes [/box]
  [/tier]
[/architecture]
```

---

## People & FAQ

### team

People cards with an avatar.

- **Aliases:** `people` · `owners`
- **Children:** `person` — content is the name. Props: `avatar` (initials or glyph), `role`, `note`.

```slidedown
[team]
  [person avatar:AL role:Engineering note:reviewer] Ada Lovelace [/person]
[/team]
```

### faq

A question / answer list.

- **Aliases:** `q&a` · `questions`
- **Children:** `qa` — content is the answer. Props: `q` (the question).

```slidedown
[faq]
  [qa q:"Is it deterministic?"] Yes — same .sd, same HTML. [/qa]
[/faq]
```

---

## Numbers & metrics

### metrics

A row of big-value stat tiles.

- **Aliases:** `stats` · `kpis`
- **Children:** `metric` — content is the label. Props: `value`.

```slidedown
[metrics]
  [metric value:"<1 min"] settlement [/metric]
  [metric value:0] dependencies [/metric]
[/metrics]
```

### bars

Labelled progress bars, clamped to 0–100.

- **Aliases:** `progress`
- **Children:** `bar` — content is the label. Props: `value` (0–100), `animated` (flag — sweeping shine on the fill).

```slidedown
[bars]
  [bar value:73] Line coverage [/bar]
[/bars]
```

### split

Covered-vs-uncovered shown in one two-tone bar — the remainder of `value` renders as the
uncovered share.

- **Aliases:** `coverage`
- **Children:** `bar` — content is the label. Props: `value` (covered share, 0–100).

```slidedown
[split]
  [bar value:46] Branch coverage [/bar]
[/split]
```

### badge

One big number — the figure the room should remember.

- **Aliases:** `big-number`
- **Props:** `value`
- **Content:** the label under the number.

```slidedown
[badge value:42] services · migrated [/badge]
```

### gauge

Donut percentage(s) — one or two.

- **Aliases:** `donut` · `ring` · `dial`
- **Children:** `dial` — content is the caption. Props: `value` (0–100).

```slidedown
[gauge]
  [dial value:73] line coverage [/dial]
[/gauge]
```

### delta

One big number with its movement — an up / down / flat arrow and a change figure, coloured by
direction (up = ok, down = danger) or an explicit `tone`. For a single headline metric; for a
grid use `scorecard`.

- **Aliases:** `trend` · `movement`
- **Content:** an optional note.
- **Props:** `value` · `change` · `dir` (`up` / `down` / `flat`) · `tone` (`ok` / `warn` / `danger` / `accent` — overrides the pill colour) · `label` · `accent` (flag — fill the card with the theme gradient) · `animated` (flag — shine sweep)

```slidedown
[delta value:"+34%" change:"vs last quarter" dir:up label:Adoption accent animated] growth across teams [/delta]
```

### scorecard

A grid of KPI tiles — value, optional target, and a movement (like a compact dashboard). For
one headline number use `delta`; for plain figures use `metrics`.

- **Aliases:** `kpis` · `scoreboard`
- **Children:** `kpi` (aliases `stat`, `score`) — props: `value`, `label`, `target`, `change`, `dir`, `tone`.

```slidedown
[scorecard]
  [kpi value:"$1.2M" label:ARR change:"+18%" dir:up]
  [kpi value:"4.7%" label:Churn change:"-0.6pt" dir:down tone:ok]
[/scorecard]
```

### status

Red / amber / green status rows — a coloured state pill, a name, a note and an optional owner.

- **Aliases:** `health` · `rag`
- **Children:** `item` (aliases `row`, `line`) — content is the note. Props: `state` (`ok` / `done` green · `warn` amber · `risk` / `blocked` red · `info` blue), `title`, `owner`.

```slidedown
[status]
  [item state:ok title:Compiler] all green [/item]
  [item state:risk title:Docs owner:DX] behind [/item]
[/status]
```

---

## Charts

All charts are inline SVG (no library; colours follow the theme + mode) and honour the shared
`size` prop — `size:96` renders at 96% of the content width; pair with `align:center`.

### bar-chart

A themed bar chart; each bar takes a distinct token colour (the palette the pie cycles).

- **Aliases:** `barchart` · `column-chart`
- **Props:** `animated` (flag — the bars grow from the baseline, 0 → value, staggered, **once when the slide renders**; not a continuous loop)
- **Children:** `point` (alias `datum`) — props: `label`, `value`.

```slidedown
[bar-chart animated]
  [point label:Q1 value:30]
  [point label:Q2 value:52]
  [point label:Q3 value:46]
[/bar-chart]
```

### line-chart

A themed line chart — a line, dots and a soft area fill.

- **Aliases:** `linechart` · `trend`
- **Props:** `animated` (flag — the line, area and dots rise from the baseline, 0 → value, **once when the slide renders**)
- **Children:** `point` (alias `datum`) — props: `label`, `value`.

```slidedown
[line-chart animated]
  [point label:Jan value:12]
  [point label:Feb value:30]
  [point label:Mar value:24]
[/line-chart]
```

### pie-chart

A themed pie chart with a coloured side legend — a distinct token colour per slice.

- **Aliases:** `piechart` · `pie`
- **Props:** `animated` (flag — a looping spotlight: each slice pops out while its legend row brightens, in turn, cycling forever)
- **Children:** `point` (alias `datum`) — props: `label`, `value`.

```slidedown
[pie-chart animated size:70]
  [point label:Writing value:45]
  [point label:Reviewing value:25]
  [point label:Design value:20]
[/pie-chart]
```

### heatmap

A grid of intensity cells (level 0–4 on the accent scale) in labelled rows — calendars,
cohorts, value matrices.

- **Aliases:** `matrix` · `gridmap`
- **Children:** `hrow` (alias `row`) — props: `label`. Holds **`cell`** children — props: `level` (0–4), `value` (optional, shown in the cell).

```slidedown
[heatmap]
  [hrow label:Mon][cell level:1][cell level:4][cell level:2][/hrow]
  [hrow label:Tue][cell level:3][cell level:0][cell level:4][/hrow]
[/heatmap]
```

---

## Tables, code & evidence

### table

A report table. The first column is the row name; a risk word (`low` / `mid` / `high`) in the
last column is colour-coded.

- **Aliases:** `report`
- **Content:** a Markdown table.
- **Props:** `head` (header colour — a token, e.g. `accent` / `ink`)

```slidedown
[table]
| Component | Coverage | Risk |
| compiler.js | 73% | low |
[/table]
```

### compare

A comparison table. A row whose name starts with `*` is the **chosen** row; `y` / `n` cells
render as ✓ / ✗.

- **Aliases:** `comparison`
- **Content:** a Markdown table.
- **Props:** `head` (header colour token)

```slidedown
[compare]
| Option | Fast | Verdict | Chosen |
| *RabbitMQ | y | Fits the event flow | y |
| Polling | n | Too slow | n |
[/compare]
```

### code

A code window with a title bar.

- **Aliases:** `snippet` · `terminal`
- **Content:** verbatim code.
- **Props:** `lang`, `title`

```slidedown
[code lang:bash title:build]
node slidedown/compiler/slidedown.js deck.sd
[/code]
```

### formula

A dark maths card. `^{…}` renders a superscript; `**bold**` is the accent.

- **Aliases:** `math`
- **Content:** one line of Markdown maths.

```slidedown
[formula] risk = impact^{2} × (1 − **coverage**)^{3} [/formula]
```

### example

A single line of monospace example text.

- **Content:** one inline line; `**bold**` highlights.

```slidedown
[example] covered / total = **73%** [/example]
```

### api

A list of API endpoints — a colour-coded method chip, a monospace path, a description.
GET (blue) · POST (green) · PUT/PATCH (amber) · DELETE (red).

- **Aliases:** `endpoints` · `routes`
- **Children:** `endpoint` (aliases `route`, `ep`) — content is the description. Props: `method`, `path`.

```slidedown
[api]
  [endpoint method:GET path:"/decks"] list decks [/endpoint]
  [endpoint method:POST path:"/compile"] build a deck [/endpoint]
[/api]
```

---

## Media

### image

A framed image; local files are copied into the deck on build. Void — may self-close.

- **Aliases:** `img` · `picture`
- **Props:** `src`, `alt`, `caption`

```slidedown
[image src:./architecture.png caption:"The event flow today" /]
```

### logo

The deck logo placed on a slide. Void — self-closes. With no `src` it uses the front-matter
`logo:` (light + dark) and shows the variant matching the slide's mode.

- **Aliases:** `wordmark` · `brandmark`
- **Props:** `src` (a single override for both modes; defaults to the front-matter `logo:`), `alt`, plus shared `size` / `align`

```slidedown
[logo size:20x* align:left /]
```

### icon

A named icon from the deck's pack. Void — self-closes; inherits the surrounding text colour
unless `color:` is set.

- **Aliases:** `heroicon` · `glyph`
- **Props:** `name` (e.g. `cog`, `bolt`, `check-circle`; add `-solid` for the filled variant), `size` (px, default `28`), `color` (token)

```slidedown
[icon name:cog size:40 color:accent /]
```

### html

The escape hatch — content is emitted verbatim, untouched by the theme. Use sparingly.

- **Content:** raw HTML (e.g. an inline SVG).

```slidedown
[html]
<svg viewBox="0 0 100 40">…</svg>
[/html]
```

---

## Layout & spacing

### columns

Divides the slide into vertical columns. **The number of `[column]` children is the number of
columns.**

- **Aliases:** `cols`
- **Children:** `column` (alias `col`) — content is anything (Markdown / components). Props: shared `size` (its width share) and `align`; a column with no `size` takes an equal share of the remainder.

```slidedown
[columns]
  [column size:55 align:left]
    The lead paragraph on the left.
  [/column]
  [column size:45]
    [bars]
      [bar value:73] Line coverage [/bar]
    [/bars]
  [/column]
[/columns]
```

### group

A layout wrapper that stacks and aligns any components together — use it instead of a
per-component `align` when a whole group should be centred or right-aligned.

- **Aliases:** `box` · `stack`
- **Props:** `align` (`left` / `center` / `right`), `gap` (px)
- **Children:** any components.

```slidedown
[group align:center]
  [chips]
    [chip]One[/chip]
    [chip]Two[/chip]
  [/chips]
[/group]
```

### void

A vertical spacer — pure empty space between elements, for breathing room or to push content
down. Void — self-closes.

- **Aliases:** `spacer` · `space` · `vspace`
- **Props:** `scale` (how many lines of blank space — `1`, `2`, `3`…; default `1`, where one line ≈ one body text line). Ignores the shared placement props.

```slidedown
A line of intro.

[void scale:2 /]

[cards cols:3]
  [card icon:bolt title:One] … [/card]
[/cards]
```

---

## Directives & meta

### meta

The title-slide byline row.

- **Content:** a Markdown list; each item is one entry (e.g. `- **Label** · value`).

```slidedown
[meta]
- **Author** · Platform Team
- **Date** · Q2 review
[/meta]
```

### @note

Hidden speaker notes for the current slide — shown in the speaker panel, remote and print
handout, never on the slide. The `@` marks it as a tool directive, not rendered content.

- **Aliases:** `@notes` · `@speaker-notes`
- **Content:** Markdown.

```slidedown
[@note] Lead with the 84% bar; 38% is the gap to close. [/@note]
```

### @instruction

A directive to the authoring tool — never rendered. The build **refuses to finish** while any
`@instruction` remains, so a forgotten note can't leak into a deck.

- **Content:** the instruction text.

```slidedown
[@instruction] use the real first-month number from the repo [/@instruction]
```

---

## Quick index

| Group | Components | Children |
|---|---|---|
| Text & emphasis | `text` | — |
| Callouts & statements | `callout` · `quote` · `chips` · `cta` · `statement` · `eyebrow` | `chip` |
| Process & flow | `flow` · `steps` · `numbered` · `cycle` · `timeline` · `milestones` | `node` · `step` · `item` · `stage` · `phase` · `milestone` |
| Grids, groups & comparison | `cards` · `panels` · `checks` · `versus` · `pricing` · `pyramid` · `architecture` | `card` · `panel` · `check` · `side` · `plan` · `layer` · `tier` · `box` |
| People & FAQ | `team` · `faq` | `person` · `qa` |
| Numbers & metrics | `metrics` · `bars` · `split` · `badge` · `gauge` · `delta` · `scorecard` · `status` | `metric` · `bar` · `dial` · `kpi` · `item` |
| Charts | `bar-chart` · `line-chart` · `pie-chart` · `heatmap` | `point` · `hrow` · `cell` |
| Tables, code & evidence | `table` · `compare` · `code` · `formula` · `example` · `api` | `endpoint` |
| Media | `image` · `logo` · `icon` · `html` | — |
| Layout & spacing | `columns` · `group` · `void` | `column` |
| Directives & meta | `meta` · `@note` · `@instruction` | — |
