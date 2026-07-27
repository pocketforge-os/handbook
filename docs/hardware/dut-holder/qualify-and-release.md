# Qualify and release a DUT holder

Physical qualification is deliberately a two-PR process. The first PR exposes
and invalidates changed geometry. The later PR records explicit acceptance of
an unchanged committed candidate.

## PR 1: declare and inspect the change

For a new profile, add an `awaiting_physical_acceptance` change record with no
accepted base. For a changed qualified profile:

1. keep every accepted fixture lock, manifest, release, and older change
   record byte-identical;
2. add a new versioned fixture or toolchain lock when that input changed;
3. set the profile to `unqualified`;
4. clear production qualification links;
5. add an append-only change record that names the old immutable base, reason,
   tracking reference, affected scopes, and candidate inputs; and
6. leave all generated STL and diff output uncommitted.

CI compares the PR head with its exact base. To produce the same review
surface locally, point `base_root` at an extracted PR-base cradle tree:

```bash
profile_id="<profile-id>"
base_root="/path/to/pr-base/mechanical/dut-cradle-v1"
review_output="mechanical/dut-cradle-v1/build/qualification-ci/${profile_id}"

python3 mechanical/dut-cradle-v1/scripts/qualification_ci.py plan \
  --base-root "$base_root" \
  --output /tmp/holder-qualification-plan.json

python3 mechanical/dut-cradle-v1/scripts/qualification_ci.py check \
  --base-root "$base_root" \
  --profile-id "$profile_id" \
  --output "$review_output"
```

Review every candidate STL and `geometry-diff.json`. The report covers added,
removed, and changed artifacts; renaming a hook or carrier does not hide it.
A failed normalized-geometry comparison is evidence to investigate, never an
instruction to refresh a golden.

## Print and accept one exact candidate

Print from a clean committed candidate. Record:

- candidate Git revision and profile, fixture, and toolchain hashes;
- exact retail model, hardware revision, and measured unit;
- printer, nozzle, material, layer height, compensation, and orientation;
- named caliper results and tolerance criteria;
- insertion, retention, rocking, and removal checks;
- control, port, vent, cable, service, rear, and camera clearances;
- evidence locations without committing private original photos; and
- explicit owner acceptance reference and date.

!!! warning "Tests cannot grant physical acceptance"
    A clean render, matching normalized fingerprint, photo, or CI result cannot
    set `physically_accepted`. Obtain an explicit owner decision tied to the
    exact committed candidate.

If any fit-bearing source, profile data, fixture input, toolchain, or print
process changes after the trial, the decision is stale. Return to PR 1 and
print again.

## PR 2: bind acceptance without changing the candidate

In a later PR:

1. rerender the unchanged candidate;
2. complete the retained change record as `physically_accepted`;
3. add a new immutable versioned qualification manifest;
4. bind the acceptance reference, date, candidate revision, fixture lock,
   toolchain, process, artifact set, and normalized fingerprints;
5. restore the profile to `physically_qualified`; and
6. let CI compare both the PR-base candidate and proposed accepted candidate.

The artifact names and normalized metrics must match. Do not combine
invalidation and renewed qualification into one PR. Do not delete the pending
record to restart history.

## Understand the regression signals

| Signal | Protects | Does not prove |
| --- | --- | --- |
| Raw STL SHA-256 | Exact distributed bytes | Physical fit |
| Normalized mesh fingerprint | Fit geometry across harmless STL serialization differences | Correct material, print process, or real-device fit |
| Chassis layout regression lock | Established reusable batch geometry | Device-holder qualification |
| Holder qualification manifest | Geometry and provenance explicitly accepted for one process/candidate | Future changed inputs |
| Explicit physical gate | Measured fit and access on the named unit | Unreviewed later revisions |

A visual-only platform change with the same resolved fixture interface is a
holder no-op. A changed contact, keep-out, profile, mechanism, toolchain, or
fit-bearing mesh invalidates the old qualification and enters the two-PR
path.

## Build deterministic production packs

After `physically_qualified`, generate and verify the mode needed by the bench.
Use `retrofit` for an existing reusable chassis and `full` for a complete new
node.

```bash
device_slug="<device-slug>"

retrofit_output="/tmp/${device_slug}-retrofit"
python3 mechanical/device-packs/build_device_pack.py build \
  --device "$device_slug" \
  --mode retrofit \
  --output "$retrofit_output"
python3 mechanical/device-packs/build_device_pack.py verify \
  --pack "$retrofit_output"

full_output="/tmp/${device_slug}-full"
python3 mechanical/device-packs/build_device_pack.py build \
  --device "$device_slug" \
  --mode full \
  --output "$full_output"
python3 mechanical/device-packs/build_device_pack.py verify \
  --pack "$full_output"
```

Never hand-pick a holder, hook set, carrier link, nameplate, or chassis bed
from an older build directory. The pack manifest owns the exact contents and
print settings.

## Archive accepted production output

One immutable release belongs to one versioned physical-qualification
manifest and contains every device variant covered by that profile.

Inspect the deterministic identity and build a local release candidate:

```bash
profile_id="<profile-id>"
release_output="/tmp/${profile_id}-release"

python3 mechanical/device-packs/release_print_pack.py identity \
  --profile-id "$profile_id"

python3 mechanical/device-packs/release_print_pack.py build \
  --profile-id "$profile_id" \
  --output "$release_output"

python3 mechanical/device-packs/release_print_pack.py verify \
  --bundle "$release_output"
```

Publication belongs to the protected main-only release workflow. It creates a
new versioned tag; it never overwrites an existing tag, ZIP, manifest, or
checksum file.

Download by exact qualification tag, not the moving "latest" badge:

```bash
tag="print-pack-<profile-id>-v<qualification-version>"

gh release download "$tag" \
  --repo pocketforge-os/test-node-hw \
  --dir "$tag"

(cd "$tag" && sha256sum --check SHA256SUMS)
```

For source-aware verification, check out the `test-node-hw` commit recorded in
`release-manifest.json` and run `release_print_pack.py verify` on the download
directory.

## Let CI propagate source changes

Routine STLs are generated, not committed.

- Pull-request CI validates schemas, renders qualified geometry against the
  exact base, and publishes candidate meshes and diffs as ephemeral artifacts.
- Relevant pushed revisions build the dynamically discovered qualified device
  packs and all three mechanical projects.
- A successful exact-current-main artifact run authorizes a one-path handbook
  gitlink PR.
- The handbook PR regenerates its pinned CAD assets, runs strict MkDocs and
  built-site checks, and receives peer review.
- After merge, the production Pages workflow repeats the build and deploys the
  exact handbook revision.

If a model or holder input changes, follow its state transition and let these
jobs rebuild downstream output. Do not patch generated handbook assets or
commit replacement STLs.

## Hand off to device integration

The qualified `full` pack finishes the mechanical holder/chassis boundary. A
separate device integration profile, keyed by the same device slug, must later
define DUT boards, pigtails, rail modules, power/serial/USB topology, labgrid
resources, per-node bindings, and physical harness evidence.

Do not infer wiring or live-power settings from the holder profile.

Next: [print the qualified device pack and reusable chassis](../test-node-chassis/print.md).
