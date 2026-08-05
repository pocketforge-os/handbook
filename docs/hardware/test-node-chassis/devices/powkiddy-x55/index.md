---
hide:
  - toc
---

# Prototype build sheet · Powkiddy X55

<p class="pf-profile-banner" data-guide-device="powkiddy-x55" data-layout-id="chassis-core-powkiddy-x55-v1"><strong>Selected DUT:</strong> Powkiddy X55 <span>·</span> <strong>Layout:</strong> <code>chassis-core-powkiddy-x55-v1</code></p>

This is the device-selected entrance to the first Powkiddy X55 test-node
chassis. It reuses the accepted core aluminum topology, adds the side-clear
crossbar plates, and supplies an X55-specific 247 × 175 mm carrier and
six-contact holder. The pack is intentionally a prototype until the local
shell depths and printed fit are checked on the real DUT.

## Resolved build profile

| Module | Selected value |
| --- | --- |
| Device slug | `powkiddy-x55` |
| Device family | `powkiddy-x55` |
| Holder profile | `powkiddy-x55` · three-depth custom OpenSCAD prototype |
| Integration route | `powkiddy-x55-v1` · harness and I/O structure placeholder |
| Integration status | `structure_only` · electrical routing is not qualified here |
| Chassis layout | `chassis-core-powkiddy-x55-v1` · side-clear core plus X55 carrier links |
| Qualification | `candidate` · caliper gate `tsp-bcx.21.28`, pack gate `tsp-bcx.21.39`, and four-plate gate `tsp-bcx.21.38` remain open |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| DUT carrier | 247 × 175 mm · display-center optical datum |
| Retention set | 2 bottom supports + 2 loose side datums + 2 shallow top retainers |
| Assembly sequence | 19 core page-per-job bench steps |

!!! warning "Prototype pack · print the coupon first"
    Automated source, fixture-pin, manifold, dimensional, deterministic-build,
    and browser checks passed. The 14.4 mm bottom, 13.8 mm top, and 14.6 mm
    side contact depths are still photo-derived. Confirm those dimensions,
    then print and accept the fit coupon before committing to the full carrier.

    Full acceptance also covers retention, the dual-microSD opening, every top
    connector and control, rear service access, webcam composition, and the
    four 38.4 mm side-clear crossbar plates.

## Follow this path in order

1. [Review the shared core frame](../../layouts/chassis-core-v2/index.md).
2. [Collect the core parts and tools](../../layouts/chassis-core-v2/parts.md).
3. [Generate the X55 coupon or prototype pack](print.md).
4. [Cut and label the unchanged core rail set](../../layouts/chassis-core-v2/cut.md).
5. [Assemble it in 19 workbench steps](../../layouts/chassis-core-v2/assemble/index.md).
6. [Run the core checks plus the X55 gates above](../../layouts/chassis-core-v2/verify.md).
7. [Route the de-energized harness](../../layouts/chassis-core-v2/wire-management.md).
8. Continue to the current [structure-only integration guide](../../../test-node.md).

Do not substitute a Smart Pro or Brick carrier. The X55 holder deliberately
uses different bottom, side, and top contact depths, and its six contacts avoid
the measured top controls and 58 mm dual-TF keep-out. The linked core chapter
describes the accepted predecessor topology; substitute the generated
four-piece side-clear plate set for its older joint plates.

[← Change the selected device](../../index.md)
