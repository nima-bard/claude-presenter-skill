# Live demos

Pre-compiled decks straight from this repo's [`samples/`](https://github.com/nima-bard/slidedown/tree/master/samples)
— open any one to see Slidedown running in your browser. Same `.sd` source, different
theme in the front-matter, completely different look.

Each deck opens as the real, presentable HTML output (zero dependencies, served as a
static asset). Navigate with `←` / `→`, `S` for speaker notes, `F` for fullscreen, and
`R` to pop out the speaker remote.

## The "every component" deck

Source: [`samples/demo/demo.sd`](https://github.com/nima-bard/slidedown/tree/master/samples/demo/demo.sd)
— exercises every bundled component, recompiled once per theme.

| Theme | Open the deck |
|---|---|
| `aurora` | [Open `demo` · aurora ↗](decks/demo-aurora/){target="_blank"} |
| `verde` | [Open `demo` · verde ↗](decks/demo-verde/){target="_blank"} |
| `falling-star` | [Open `demo` · falling-star ↗](decks/demo-falling-star/){target="_blank"} |
| `neo` | [Open `demo` · neo ↗](decks/demo-neo/){target="_blank"} |

## NovaPay × GlobalFreight Connect

Source: [`samples/novapay/deck-and-output/novapay-partnership.sd`](https://github.com/nima-bard/slidedown/tree/master/samples/novapay/deck-and-output/novapay-partnership.sd)
— a realistic 15-minute partnership pitch built end-to-end from the
[NovaPay context brief](https://github.com/nima-bard/slidedown/tree/master/samples/novapay/context.md).

| Theme | Open the deck |
|---|---|
| `neo` | [Open `novapay` · neo ↗](decks/novapay-neo/){target="_blank"} |

---

Want to add a theme to these demos? Drop a theme folder under
[`slidedown/themes/`](https://github.com/nima-bard/slidedown/tree/master/slidedown/themes),
recompile `demo.sd` with that theme in the front-matter, commit the resulting
`samples/demo/output-<theme>/` directory, and the next docs deploy will list it here.
