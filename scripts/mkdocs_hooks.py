"""MkDocs build hook — include canonical Markdown into the docs site, with link fixes.

The Language, Components and Contributing pages are *generated* from the repository's
single sources of truth (slidedown/MANIFESTO.md, slidedown/COMPONENTS.md, CONTRIBUTING.md).
Those files use links that resolve when viewed on GitHub (e.g. `[COMPONENTS.md](COMPONENTS.md)`)
but not inside the docs site, so we rewrite just those links to the matching docs pages.
Editing happens in the canonical files; the docs pages stay thin stubs.
"""

import os

GH = "https://github.com/nima-bard/slidedown/blob/master"

# docs page src_uri -> (repo-relative source file, {markdown link target: replacement})
_INCLUDES = {
    "reference/manifesto.md": (
        "slidedown/MANIFESTO.md",
        {"COMPONENTS.md": "components.md", "README.md": f"{GH}/slidedown/README.md"},
    ),
    "reference/components.md": (
        "slidedown/COMPONENTS.md",
        {"MANIFESTO.md": "manifesto.md"},
    ),
    "contributing.md": (
        "CONTRIBUTING.md",
        {"LICENSE": f"{GH}/LICENSE"},
    ),
}


def on_page_markdown(markdown, page, config, files):
    spec = _INCLUDES.get(page.file.src_uri)
    if not spec:
        return markdown
    rel, rewrites = spec
    root = os.path.dirname(os.path.abspath(config["config_file_path"]))
    with open(os.path.join(root, rel), encoding="utf-8") as fh:
        content = fh.read()
    for target, replacement in rewrites.items():
        content = content.replace(f"]({target})", f"]({replacement})")
    # canonical content first, then whatever the stub page adds (e.g. an addendum)
    return content + "\n\n" + markdown
