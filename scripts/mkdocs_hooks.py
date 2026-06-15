"""MkDocs build hook — include canonical Markdown into the docs site, with link fixes,
and stage the precompiled sample decks under ``site/demos/decks/`` so the live-demos page
can link to them. Local ``mkdocs build`` and the GitHub Pages workflow share this hook.

The Language, Components and Contributing pages are *generated* from the repository's
single sources of truth (slidedown/MANIFESTO.md, slidedown/COMPONENTS.md, CONTRIBUTING.md).
Those files use links that resolve when viewed on GitHub (e.g. `[COMPONENTS.md](COMPONENTS.md)`)
but not inside the docs site, so we rewrite just those links to the matching docs pages.
Editing happens in the canonical files; the docs pages stay thin stubs.
"""

import os
import shutil

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

# (sample dir, output prefix in samples/, dest slug prefix under site/demos/decks/)
# Every ``<sample_dir>/<output_prefix><theme>`` becomes ``site/demos/decks/<slug>-<theme>``.
_DEMOS = [
    ("samples/demo", "output-", "demo"),
    ("samples/novapay/deck-and-output", "output-", "novapay"),
]


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


def _ignore_hidden(_src, names):
    return [n for n in names if n.startswith(".")]


def on_post_build(config):
    """Copy each ``samples/.../output-<theme>/`` deck into ``site/demos/decks/<slug>-<theme>/``."""
    root = os.path.dirname(os.path.abspath(config["config_file_path"]))
    site_dir = config["site_dir"]
    dest_root = os.path.join(site_dir, "demos", "decks")
    os.makedirs(dest_root, exist_ok=True)
    for sample_dir, prefix, slug in _DEMOS:
        src_root = os.path.join(root, sample_dir)
        if not os.path.isdir(src_root):
            continue
        for entry in sorted(os.listdir(src_root)):
            if not entry.startswith(prefix):
                continue
            theme = entry[len(prefix):]
            src = os.path.join(src_root, entry)
            if not os.path.isdir(src):
                continue
            dest = os.path.join(dest_root, f"{slug}-{theme}")
            shutil.copytree(src, dest, dirs_exist_ok=True, ignore=_ignore_hidden)
