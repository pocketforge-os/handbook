# Reuse a holder mechanism

Create a strict holder profile when an existing named mechanism can satisfy
the new device's fixture contract. The TrimUI Smart Pro family is a worked
accepted example, not a source of dimensions for another handheld.

Run these commands from the root of a clean, claimed `test-node-hw` worktree.
Replace every angle-bracket value; do not leave TrimUI slugs or coordinates in
a new profile.

```bash
device_slug="<device-slug>"
profile_id="<profile-id>"
profile="profiles/${profile_id}.json"
platform_root="/absolute/path/to/platform"
```

## 1. Pin and verify manufacturing input

For an automation-created fixture candidate, validate every discovered receipt
and then verify the exact one you are consuming:

```bash
python3 mechanical/dut-cradle-v1/scripts/fixture_dependency_intake.py \
  validate-candidates

python3 mechanical/dut-cradle-v1/scripts/fixture_dependency_intake.py \
  verify-source \
  --receipt "qualification/fixture-updates/<receipt-id>.json" \
  --platform-root "$platform_root"
```

Success exits zero and reports the exact platform revision and raw contract
hashes. Stop on a stale source revision, changed raw hash, alias mismatch,
malformed receipt, or candidate collision.

A brand-new device may not have an intake receipt. In that case, add a
versioned active fixture lock in the design PR. It must still pin a full
platform Git SHA, raw fixture-contract hashes, shared-chassis aliases, and the
resolved interface hash. Never edit an older lock retained by accepted
qualification history.

## 2. Select contacts from the fixture contract

Review the envelope, local contact depths, safe contact intervals, keep-outs,
rear/service opening, trigger and cable clearance, camera target, and
tolerances.

For every proposed contact:

1. select a named fixture contact;
2. place its coordinate inside the locked safe interval;
3. use the contract's local depth and surface role;
4. keep clear of controls, ports, seams, vents, speakers, labels, and cables;
5. preserve an insertion and removal path; and
6. test the worst permitted tolerance, not only the nominal device.

Prefer `perimeter_j_hook_v1` only when all contacts and clearances fit its
declarative parameter contract. More hooks are not automatically safer; an
extra contact can overconstrain a tolerance stack.

## 3. Author the unqualified profile

Add `mechanical/dut-cradle-v1/profiles/<profile-id>.json`. Use a nearby file
to learn the schema, not to copy device dimensions.

The profile must:

- name the versioned fixture lock;
- start with `qualification.status = "unqualified"`;
- select one supported named mechanism;
- record contact IDs and exact poses inside their safe intervals;
- separate presentation labels from fit-bearing parameters;
- map every `device_slugs` entry to exactly one labeled production carrier;
- define explicit review artifacts, including `fit_coupon`; and
- keep production qualification links empty until the later acceptance PR.

For an existing qualified profile whose fixture or fit is changing, preserve
the old profile inputs and manifest byte-for-byte. Add a new lock and an
append-only `awaiting_physical_acceptance` change record as described in
[Qualify and release](qualify-and-release.md).

## 4. Validate and inspect the compiler output

Run the repo-owned skill preflight:

```bash
python3 .agents/skills/design-dut-holder/scripts/\
validate_holder_workflow.py repository \
  --profile "$profile" \
  --platform-root "$platform_root"
```

Then validate the profile directly and inspect the exact OpenSCAD argument
vector before rendering:

```bash
python3 mechanical/dut-cradle-v1/scripts/holder_profiles.py validate \
  --profile "$profile"

python3 mechanical/dut-cradle-v1/scripts/holder_profiles.py print-command \
  --profile "$profile" \
  --artifact fit_coupon \
  --output "/tmp/${profile_id}-fit-coupon.stl"
```

The command must name committed profile data and source-owned OpenSCAD. It
must not select an STL from an old build directory.

## 5. Generate the cheapest physical proof first

Build and verify a coupon pack:

```bash
coupon_output="/tmp/${device_slug}-coupon"

python3 mechanical/device-packs/build_device_pack.py build \
  --device "$device_slug" \
  --mode coupon \
  --output "$coupon_output"

python3 mechanical/device-packs/build_device_pack.py verify \
  --pack "$coupon_output"
```

While the profile is unqualified, the manifest correctly marks this output
non-production. Print using the material, scale, orientation, layer, support,
and other process settings recorded in that manifest.

Check the least-certain contact geometry first:

- hook throat, lip, support, and shell-depth relationship;
- fastener, nut pocket, keyway, and adjustment travel;
- insertion, retention, rocking, and deliberate removal;
- control, port, vent, cable, rear/service, and camera clearances; and
- the worst device and print-process tolerances.

If local coupons cannot expose interaction between contacts, print the
carrier before accepting the design.

## 6. Iterate on committed candidates

Keep the profile unqualified while changing contact positions, designed play,
hook throat, service clearances, mechanism parameters, or print process.
Commit the candidate before printing the acceptance part and record that exact
Git revision.

Any later fit-bearing source, profile, fixture input, or toolchain change makes
the trial stale. Print again instead of carrying an old "looks good" decision
forward.

Next: [qualify the exact candidate and generate production packs](qualify-and-release.md).
