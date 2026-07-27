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

The test-node chassis guide consumes focused instruction renders, current
top-bar cut data, and one semantic interactive full-chassis model generated
from `pocketforge-os/test-node-hw`. The model contains the selected handheld,
its holder and J-hooks, the populated DUT test board, camera and field of view,
printed suspension, and aluminum frame as named layers. Routine STLs are not
published by the handbook. The asset sync exports a hashed, source-only
device catalog so the print page can render any registered device pack
locally in the browser. The command-line builder remains the independent
source path. The exact source revision is the `cad/test-node-hw` gitlink;
metadata and the project path are recorded in `cad-assets.lock.json`.

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
downloads. A mechanical change merged to `test-node-hw/main` immediately opens
or updates a normal handbook CAD-refresh PR; Dependabot's daily scan is the
reconciliation fallback. That PR exercises the same regeneration, strict
build, review, merge, and Pages deployment path.
After a strict build, verify the rendered local references, downloads,
checksums, and interactive model with:

```sh
python3 scripts/verify-built-site.py site
```

## Browser CAD generators

The print page can generate one device-pack part, a complete ZIP, or a
personalized device-nameplate STL without a local CAD installation. It
lazy-loads a self-hosted, revision-pinned OpenSCAD WebAssembly runtime in Web
Workers and compiles the same hashed SCAD closure copied from the pinned
`cad/test-node-hw` submodule. Geometry never leaves the browser.

`device-pack-browser-baselines.json` regression-locks every registered
full-pack recipe to this browser runtime. Its refresh script accepts only
browser meshes that remain within 0.001 mm at the bounds and 0.02% by volume
of fresh source-toolchain builds. A source revision, runtime, catalog, or
normalized-mesh change therefore fails CI instead of silently changing a
download.

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

After a deliberate source or runtime change, rebuild every desktop reference,
run the browser suite, and regenerate the metadata lock:

```sh
desktop_root=$(mktemp -d)
while read -r device; do
  python3 cad/test-node-hw/mechanical/device-packs/build_device_pack.py build \
    --device "${device}" \
    --mode full \
    --allow-unqualified \
    --output "${desktop_root}/${device}"
done < <(
  jq -r '.devices[].slug' \
    docs/assets/generated/test-node-chassis/browser/catalog.json
)

npm run test:e2e
node scripts/build-device-pack-browser-baselines.mjs \
  --desktop-root "${desktop_root}" \
  --browser-root test-artifacts \
  --output docs/assets/device-pack-browser-baselines.json
```

Review the baseline diff; it captures fingerprints and comparison evidence,
never STL bytes.
