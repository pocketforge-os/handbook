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
print-bed STLs, a cut list, six interactive print-bed models, and a semantic
interactive full-chassis model generated from `pocketforge-os/test-node-hw`.
The immutable source revision is recorded in `cad-assets.lock.json`.

Regenerate the ignored local assets from that revision:

```sh
scripts/sync-test-node-chassis-assets.sh
```

While developing both repositories together, an explicitly dirty local source
may be used for preview only:

```sh
ALLOW_DIRTY_CAD=1 \
CAD_SOURCE_DIR=/path/to/test-node-hw \
scripts/sync-test-node-chassis-assets.sh
```

CI never sets that escape hatch. Publication fails when the lock is pending,
the source revision differs, the CAD worktree is dirty, the semantic web model
changes shape unexpectedly, or a noncanonical artifact leaks into the
contributor downloads. After a strict build, verify the rendered local
references, downloads, checksums, and interactive model with:

```sh
python3 scripts/verify-built-site.py site
```
