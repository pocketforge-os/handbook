# PocketForge Handbook

Read-me-first contributor and operator documentation for PocketForge OS. This
repository publishes the public handbook at
[pocketforge-os.github.io/handbook](https://pocketforge-os.github.io/handbook/)
while the `pocketforge.com/docs/` route is prepared.

## Local build

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve
```

`mkdocs build --strict` is the documentation gate.

## Generated mechanical assets

The test-node chassis guide consumes static instruction renders, canonical
print-bed STLs, a cut list, eight interactive print-bed models, and a semantic
interactive full-chassis model generated from `pocketforge-os/test-node-hw`.
The exact source revision is the `cad/test-node-hw` gitlink; metadata and the
project path are recorded in `cad-assets.lock.json`.

Initialize the pinned source and regenerate the ignored local assets:

```sh
git submodule update --init
scripts/sync-test-node-chassis-assets.sh
```

While developing both repositories together, an explicitly dirty local source
may be used for preview only:

```sh
ALLOW_DIRTY_CAD=1 \
CAD_SOURCE_DIR=/path/to/test-node-hw \
scripts/sync-test-node-chassis-assets.sh
```

CI never sets that escape hatch. Publication fails when the submodule is
missing, dirty, on the wrong origin or revision, the semantic web model changes
shape unexpectedly, or a noncanonical artifact leaks into the contributor
downloads. Dependabot checks the public `test-node-hw` submodule hourly and
opens a normal handbook PR when its `main` commit advances; that PR exercises
the same regeneration, strict build, review, merge, and Pages deployment path.
After a strict build, verify the rendered local references, downloads,
checksums, and interactive model with:

```sh
python3 scripts/verify-built-site.py site
```

## Browser nameplate customizer

The Batch 06 print section can generate a personalized device-nameplate STL
without a local CAD installation. It lazy-loads a self-hosted, revision-pinned
OpenSCAD WebAssembly runtime in a Web Worker and compiles the same chassis SCAD
source copied from the pinned `cad/test-node-hw` submodule. The device name
never leaves the browser.

The OpenSCAD runtime and Liberation Sans font are preserved under
`docs/assets/vendor/openscad/` with checksums, upstream revisions, and license
files in `PROVENANCE.json`. Verify the committed copies without network access:

```sh
scripts/sync-nameplate-customizer-runtime.sh --verify
```

Refresh those vendored files only as a deliberate dependency update:

```sh
scripts/sync-nameplate-customizer-runtime.sh
```

Run the JavaScript unit and real-browser generation tests after the strict
MkDocs build:

```sh
npm ci
npm test
npm run test:e2e
```
