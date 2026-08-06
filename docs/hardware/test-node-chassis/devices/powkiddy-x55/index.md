---
hide:
  - toc
---

# Prototype build sheet · Powkiddy X55

<p class="pf-profile-banner" data-guide-device="powkiddy-x55" data-layout-id="chassis-dualbar-powkiddy-x55-v2"><strong>Selected DUT:</strong> Powkiddy X55 <span>·</span> <strong>Layout:</strong> <code>chassis-dualbar-powkiddy-x55-v2</code></p>

This is the device-selected entrance to the first Powkiddy X55 test-node
chassis. It uses the fleet-standard continuous lower and upper fixture bars,
adds the side-clear crossbar plates, and supplies an X55-specific 247 × 175 mm
carrier and six-contact holder. The pack is intentionally a prototype until the local
shell depths and printed fit are checked on the real DUT.

<figure>
  <img src="../../../../assets/generated/test-node-chassis/device-examples/powkiddy_x55/layout-assembly.png" alt="Powkiddy X55 carrier and dual USB-C interrupter holder installed on the continuous-bar test-node chassis">
  <figcaption>Device-specific assembly reference generated from the same pinned source as this pack.</figcaption>
</figure>

## Resolved build profile

| Module | Selected value |
| --- | --- |
| Device slug | `powkiddy-x55` |
| Device family | `powkiddy-x55` |
| Holder profile | `powkiddy-x55` · three-depth custom OpenSCAD prototype |
| Integration route | `powkiddy-x55-v1` · harness and I/O structure placeholder |
| Integration status | `structure_only` · electrical routing is not qualified here |
| Chassis layout | `chassis-dualbar-powkiddy-x55-v2` · side-clear continuous bars plus X55 carrier links and the dual USB-C interrupter holder |
| Qualification | `candidate` · caliper gate `tsp-bcx.21.28`, continuous-bar pack gate `tsp-bcx.21.40`, and four-plate gate `tsp-bcx.21.38` remain open |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| DUT carrier | 247 × 175 mm · display-center optical datum |
| Retention set | 2 bottom supports + 2 loose side datums + 2 shallow top retainers |
| Assembly sequence | 18 continuous-bar page-per-job bench steps |

!!! warning "Prototype pack · print the coupon first"
    Automated source, fixture-pin, manifold, dimensional, deterministic-build,
    and browser checks passed. The 14.4 mm bottom, 13.8 mm top, and 14.6 mm
    side contact depths are still photo-derived. Confirm those dimensions,
    then print and accept the fit coupon before committing to the full carrier.

    Full acceptance also covers retention, the dual-microSD opening, every top
    connector and control, rear service access, webcam composition, and the
    four 38.4 mm side-clear crossbar plates.

## Follow this path in order

1. [Review the shared continuous-bar frame](../../layouts/chassis-dualbar-v1/index.md).
2. [Collect the continuous-bar parts and tools](../../layouts/chassis-dualbar-v1/parts.md).
3. [Generate the X55 coupon or prototype pack](print.md).
4. [Cut and label the continuous-bar rail set](../../layouts/chassis-dualbar-v1/cut.md).
5. [Assemble it in 18 workbench steps](../../layouts/chassis-dualbar-v1/assemble/index.md).
6. [Run the continuous-bar checks plus the X55 gates above](../../layouts/chassis-dualbar-v1/verify.md).
7. [Route the de-energized harness](../../layouts/chassis-dualbar-v1/wire-management.md).
8. Continue to the current [structure-only integration guide](../../../test-node.md).

Do not substitute a Smart Pro or Brick carrier. The X55 holder deliberately
uses different bottom, side, and top contact depths, and its six contacts avoid
the measured top controls and 58 mm dual-TF keep-out. Use one unspliced 306 mm
lower fixture bar and one unspliced 306 mm upper fixture bar; the active pack
contains no upright splice bars or collars.

[← Change the selected device](../../index.md)
