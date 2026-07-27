# Build the Smart Pro S top-bar chassis

Use this route for device slug **`trimui-smart-pro-s`**. Its registered
`chassis-topbar-v1` layout replaces the complete two-upright gantry with one
continuous 306 mm top bar and four printed suspension pieces.

!!! warning "Candidate—not a production-qualified layout"
    The source and normalized mesh fingerprints are frozen so every prototype
    is repeatable, but the physical suspension still awaits fit, loaded-sag,
    racking, and camera checks under `tsp-t1zd.2`. Generate it only with the
    explicit non-production override. Do not publish or install it as a
    production layout until that acceptance record is complete.

![Complete Smart Pro S top-bar candidate chassis](../../../assets/generated/test-node-chassis/topbar/layout-assembly.png)

## What changes

| Interface | Qualified Smart Pro gantry | Smart Pro S top-bar candidate |
| --- | --- | --- |
| Device slug | `trimui-smart-pro` | `trimui-smart-pro-s` |
| Registered layout | `chassis-core-v1` | `chassis-topbar-v1` |
| Fixture aluminum | Four 164 mm upright halves and two 306 mm crossbars | One continuous 306 mm top bar |
| Printed suspension | Splice bars, collars, joint plates, and four plate spacers | Two keyed upper hangers and two lower backstays |
| Concealed L-connectors | Four | Two |
| Finished extrusion | 5,204 mm | 4,242 mm |
| Status | Physically qualified and frozen | Candidate awaiting physical acceptance |

The outer 346 × 358 × approximately 368 mm frame, DUT-holder interface,
fixture plate, camera relationship, placard, power-strip mounts, stacking
tabs, and wire anchors are unchanged. Do not dismantle or convert a working
Smart Pro chassis.

## Why this is a separate route

The device-pack builder selects a chassis layout from the canonical device
slug. A caller cannot silently map the Smart Pro S to the old gantry or map
the base Smart Pro to this candidate. That separation lets the qualified
19-step build remain frozen while new layouts evolve independently.

Routine STLs are generated, not committed. OpenSCAD source, layout records,
expected normalized fingerprints, tests, and these instructions are committed.
The handbook's review images and cut data are regenerated from its exact
`cad/test-node-hw` Git revision. The full candidate pack renders its own STLs
and records their source hashes and fingerprints in `manifest.json`.
The published
[top-bar provenance record](../../../assets/generated/test-node-chassis/topbar/provenance.json)
binds these views to that revision, device registry, candidate layout, and
source-input hashes.

## Follow this route

1. [Cut the material-reduced rail set](cut.md).
2. [Generate, verify, and print the candidate pack](print.md).
3. [Assemble the top-bar delta](assemble.md).
4. [Run and record the physical candidate checks](verify.md).
5. Continue to the shared [wire-management guide](../wire-management.md) only
   after the complete node is de-energized and the harness design exists.

For `trimui-smart-pro`, stop here and use the
[qualified gantry route](../parts.md) instead.

Next: [cut the Smart Pro S rail set](cut.md).
