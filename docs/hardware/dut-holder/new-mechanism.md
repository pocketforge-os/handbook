# Create a reusable holder mechanism

Use this lane only when no existing named mechanism can retain the device
safely. The goal is not a one-off mesh. The goal is a reusable parameterized
mechanism family that another device can select through strict profile data.

## Prove that a new retention class is necessary

Document why the existing families fail. Examples include:

- the safe contact surface is curved or stepped;
- insertion requires a sliding or rotating motion;
- a perimeter hook would load a seam, control, or fragile lip;
- a required service opening intersects every supported hook pose; or
- the tolerance stack needs controlled compliance.

Do not create a new mechanism merely to move dimensions already owned by a
profile.

## Prototype only while unqualified

An agent or LLM may help explore the first parameterized OpenSCAD shape. Keep
that work on a claimed branch and set:

```text
implementation.kind = "custom_openscad"
qualification.status = "unqualified"
```

The custom implementation also needs a concrete rationale and a tracked
follow-up for extracting the reusable family. It cannot emit a production
device pack or claim physical qualification.

During prototyping:

- use fixture-contract contacts, depths, datums, keep-outs, and tolerances;
- isolate fit parameters from labels and presentation;
- preserve an explicit insertion and release motion;
- render only to ignored or temporary output paths;
- print the smallest coupon that can disprove the idea; and
- record which real measurement resolves every photo-derived uncertainty.

Render an explicit review artifact without committing it:

```bash
profile="profiles/<profile-id>.json"

python3 mechanical/dut-cradle-v1/scripts/holder_profiles.py validate \
  --profile "$profile"

python3 mechanical/dut-cradle-v1/scripts/holder_profiles.py render \
  --profile "$profile" \
  --artifact fit_coupon \
  --output "/tmp/<profile-id>-fit-coupon.stl"
```

## Extract the mechanism before qualification

Once the geometry works:

1. move the reusable shape into a named OpenSCAD module/family;
2. define its declarative parameter and contact contract;
3. add compiler validation instead of branching on a device slug;
4. migrate the profile away from `custom_openscad`;
5. add tests for valid ranges, invalid contacts, deterministic serialization,
   and output-path safety;
6. add a mutation test that changes a real fit-bearing parameter and proves
   the normalized mesh fingerprint changes; and
7. rerun every already qualified profile against the shared-library change.

The named family is the product. The custom prototype is design evidence.

Run the shared source and contract suites:

```bash
python3 -m unittest discover \
  -s mechanical/dut-cradle-v1/scripts \
  -p 'test_*.py' \
  -v

scripts/lint-openscad.sh
```

Then run the skill preflight and inspect the compiled coupon command exactly as
in the [existing-mechanism lane](existing-mechanism.md#4-validate-and-inspect-the-compiler-output).

## Keep the LLM out of regeneration

The design phase may require spatial judgment and several agent-assisted
iterations. The merged endpoint must contain everything needed to rebuild:

- fixture lock and strict profile data;
- named parameterized OpenSCAD source;
- compiler/schema validation;
- regression and mutation tests;
- candidate and qualification provenance; and
- pinned CAD/print-process toolchain data.

An accepted holder must regenerate in CI from those committed inputs without a
prompt, remembered conversation, hand-edited STL, or agent-selected old part.

## Enter the normal physical gate

After migration to the named family, build the coupon, print and measure the
exact committed candidate, and follow the same two-PR process as every other
holder.

Next: [qualify and release the exact candidate](qualify-and-release.md).
