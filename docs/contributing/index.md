# Contributing to the docs

This handbook is a [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
site built from plain Markdown in the [`pocketforge-os/handbook`](https://github.com/pocketforge-os/handbook)
repo. Anyone — human or agent — can add or improve a page by editing Markdown
and opening a PR. No JavaScript, MDX, or special authoring tools required.

## The two-minute version

1. **Add or edit** a `.md` file under `docs/`.
2. **Wire it into the nav** by adding one line to `nav:` in `mkdocs.yml` (unless
   you edited an existing page).
3. **Preview locally** with `mkdocs serve` (see below).
4. **Open a PR.** CI runs `mkdocs build --strict`; a broken link or an
   unreferenced nav entry fails the check.

## Preview locally

```bash
# From the repo root, one time:
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt

# Live-reloading preview at http://127.0.0.1:8000
mkdocs serve

# What CI runs — must pass with zero warnings:
mkdocs build --strict
```

The dependency versions in [`requirements.txt`](https://github.com/pocketforge-os/handbook/blob/main/requirements.txt)
are pinned exactly (infra-261 D6), so your local build matches CI.

## Where to go next

- **[Doc style guide](style-guide.md)** — voice, headings, admonitions,
  checklists, diagrams, and the 🚧 stub convention.
- **[How to add a page](add-a-page.md)** — the exact steps, with a copy-paste
  page template.
