# How to add a page

Adding a page is **one Markdown file + one nav line**. This page is the
step-by-step; for conventions on *what* to write, see the
[doc style guide](style-guide.md).

## Steps

1. **Create the file** under `docs/`, in the section it belongs to. Use a short,
   kebab-case filename that matches the topic:

   ```bash
   $EDITOR docs/lab/sd-mux.md
   ```

2. **Write the page.** Start from the template below. A brand-new topic that
   isn't ready yet ships as a [🚧 stub](style-guide.md#the-stub-convention);
   otherwise write the real content.

3. **Add it to the nav** in `mkdocs.yml`. Find the right section under `nav:` and
   add one line — the label a reader sees, then the path relative to `docs/`:

   ```yaml
     - Lab & infrastructure:
         - lab/index.md
         - labgrid coordinator: lab/labgrid.md
         - Relay power: lab/power.md
         - Networking: lab/networking.md
         - SD mux: lab/sd-mux.md      # ← your new line
   ```

    !!! note "Every page must be in the nav"
        `mkdocs build --strict` fails on a page that exists on disk but is not
        referenced by `nav:` (and on a `nav:` entry pointing at a missing file).
        Add the line in the same PR as the file.

4. **Preview** and **build strict**:

   ```bash
   mkdocs serve                 # live preview at http://127.0.0.1:8000
   mkdocs build --strict        # must exit 0 with no warnings — this is the CI gate
   ```

5. **Open a PR** into `handbook@main`. Fill in the three required sections
   (`## Summary`, `## Test plan`, `## Related PRs`) from the repo's PR template.
   CI re-runs `mkdocs build --strict` on the PR; fix any warnings it reports.

## Page template

Copy this into a new file and replace the placeholders:

```markdown
# Page title

A one- or two-sentence framing of what this page is and who needs it.

## First section

Prose, steps, or a checklist:

- [ ] First step
- [ ] Second step

!!! tip
    A helpful callout.
```

## Filling in a stub

To turn a [🚧 stub](style-guide.md#the-stub-convention) into a real page: keep
the `# H1`, delete the stub `warning` admonition and the "What this page will
cover" line, and write the content in their place. No `mkdocs.yml` change is
needed — the page is already in the nav.

!!! warning "Generated CAD assets are not hand-edited"
    The renders and downloads in the
    [test-node chassis guide](../hardware/test-node-chassis/index.md) come from
    a pinned `test-node-hw` OpenSCAD revision. Update the source model and its
    asset lock instead of patching a generated image or STL.
