---
hide:
  - toc
---

# Prototype build sheet · TrimUI Brick / TG3040

<p class="pf-profile-banner" data-guide-device="trimui-brick" data-layout-id="chassis-dualbar-brick-v3"><strong>Selected DUT:</strong> TrimUI Brick / TG3040 <span>·</span> <strong>Layout:</strong> <code>chassis-dualbar-brick-v3</code></p>

This is the device-selected entrance to the first TrimUI Brick chassis build.
The aluminum frame reuses the qualified dual-bar topology, while the holder,
carrier links, optical placement, and complete pack remain a prototype until
the printed hardware is checked on the real DUT.

<figure>
  <img src="../../../../assets/generated/test-node-chassis/device-examples/trimui_brick/layout-assembly.png" alt="TrimUI Brick carrier and dual USB-C interrupter holder installed on the dual-bar test-node chassis">
  <figcaption>Device-specific assembly reference generated from the same pinned source as this pack.</figcaption>
</figure>

## Resolved build profile

| Module | Selected value |
| --- | --- |
| Device slug | `trimui-brick` |
| Device family | `trimui-brick` |
| Holder profile | `trimui-brick` · stepped-shell prototype |
| Integration route | `trimui-brick-v1` · harness and I/O structure placeholder |
| Integration status | `structure_only` · electrical routing is not qualified here |
| Chassis layout | `chassis-dualbar-brick-v3` · side-clear dual-bar core plus Brick-specific carrier links and the dual USB-C interrupter holder |
| Qualification | `candidate` · holder gate `tsp-bcx.21.23` and four-plate installed gate `tsp-bcx.21.38` remain open |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| DUT carrier | 180 × 205 mm · screen-center optical datum |
| Retention set | 2 rear-only bottom supports + 2 side hooks + 1 upper hook |
| Assembly sequence | 18 dual-bar page-per-job bench steps |

!!! warning "Prototype pack · physical acceptance required"
    Automated source, manifold, dimensional, deterministic-build, and browser
    checks passed. Before this pack can be called production-qualified, verify
    coupon fit; device retention and stability; bottom I/O, side controls, top
    USB, and rear-trigger clearance; webcam composition; and both labels on the
    assembled chassis. Record the result against `tsp-bcx.21.23`.

    The four 38.4 mm side-clear crossbar-joint plates also require the adjacent
    chassis clearance check tracked under `tsp-bcx.21.38`.

## Follow this path in order

1. [Review the shared dual-bar frame](../../layouts/chassis-dualbar-v1/index.md).
2. [Collect the dual-bar parts and tools](../../layouts/chassis-dualbar-v1/parts.md).
3. [Generate the Brick coupon or prototype pack](print.md).
4. [Cut and label the unchanged dual-bar rail set](../../layouts/chassis-dualbar-v1/cut.md).
5. [Assemble it in 18 workbench steps](../../layouts/chassis-dualbar-v1/assemble/index.md).
6. [Run the dual-bar checks plus the Brick gates above](../../layouts/chassis-dualbar-v1/verify.md).
7. [Route the de-energized harness](../../layouts/chassis-dualbar-v1/wire-management.md).
8. Continue to the current [structure-only integration guide](../../../test-node.md).

Do not substitute the Smart Pro family carrier or its six J-hooks. The Brick's
stepped 20/12 mm shell requires the five-part retention set generated from this
device profile. The linked dual-bar chapter describes the unchanged predecessor
topology; substitute the dedicated four-piece side-clear plate set for the old
joint plates.

[← Change the selected device](../../index.md)
