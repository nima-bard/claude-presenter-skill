<!--
  The Contributing guide above is included at build time from the repo-root CONTRIBUTING.md
  (the source of truth) by scripts/mkdocs_hooks.py. Edit that file. The addendum below is
  specific to the docs site and lives here.
-->

---

## Editing these docs

This site is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) from
the `docs/` folder. To add or change a page:

1. Edit (or add) a Markdown file under `docs/` and list it in the `nav:` of `mkdocs.yml`.
2. Preview locally:

    ```bash
    ./scripts/docs.sh        # sets up MkDocs in a local venv, then serves at http://127.0.0.1:8000
    ```

3. Open a PR. On merge to `master`, the site redeploys to GitHub Pages automatically.

The **Language**, **Components** and this **Contributing** page are generated from
`slidedown/MANIFESTO.md`, `slidedown/COMPONENTS.md` and the root `CONTRIBUTING.md` — edit
those files, not the stubs under `docs/`.
