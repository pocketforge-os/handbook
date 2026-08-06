---
hide:
  - toc
---

# Build sheet · TrimUI Smart Pro

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro" data-layout-id="chassis-dualbar-smart-pro-v2"><strong>Selected DUT:</strong> TrimUI Smart Pro / TG5040 <span>·</span> <strong>Layout:</strong> <code>chassis-dualbar-smart-pro-v2</code></p>

This sheet is the only safe entrance to a new Smart Pro chassis build. Keep
this device selection for the printed pack, rail cuts, all 18 assembly steps,
and verification.

<figure>
  <img src="../../../../assets/generated/test-node-chassis/device-examples/smart_pro/layout-assembly.png" alt="TrimUI Smart Pro carrier and dual USB-C interrupter holder installed on the continuous-bar test-node chassis">
  <figcaption>Device-specific assembly reference generated from the same pinned source as this pack.</figcaption>
</figure>

## Resolved build profile

| Module | Selected value |
| --- | --- |
| Device slug | `trimui-smart-pro` |
| Device family | `trimui-smart-pro-family` |
| Holder profile | `trimui-smart-pro-family` · shared with Smart Pro S |
| Integration route | `trimui-smart-pro-family-v1` · shared family route for later side-board, harness, and I/O instructions |
| Integration status | `structure_only` · component-level wiring recipe still pending |
| Chassis layout | `chassis-dualbar-smart-pro-v2` · side-clear continuous-bar chassis with the dual USB-C interrupter holder |
| Qualification | `candidate` · predecessor `chassis-core-v2` remains qualified; continuous-bar installed gate `tsp-bcx.21.40` remains open |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| Assembly sequence | 18 page-per-job bench steps |
| Carrier links | 91.5 mm upper / 108.5 mm lower · 1 mm inside the stack planes |

!!! note "The qualified predecessor remains frozen"
    Smart Pro and Smart Pro S use the same holder family and integration route.
    `chassis-core-v2` remains the immutable record of the accepted original
    Smart Pro. New packs select the Pro S-style topology: one continuous 306 mm
    lower fixture bar and one continuous 306 mm upper fixture bar, plus four
    38.4 mm side-clear joint plates.

## Follow this path in order

1. [Review the shared continuous-bar topology](../../layouts/chassis-dualbar-v1/index.md).
2. [Collect its parts and tools](../../layouts/chassis-dualbar-v1/parts.md).
3. [Generate and print the Smart Pro pack](print.md).
4. [Cut and label the continuous-bar rail set](../../layouts/chassis-dualbar-v1/cut.md).
5. [Assemble it in 18 workbench steps](../../layouts/chassis-dualbar-v1/assemble/index.md).
6. [Verify the mechanical build](../../layouts/chassis-dualbar-v1/verify.md).
7. [Route the de-energized harness](../../layouts/chassis-dualbar-v1/wire-management.md).
8. Continue to the [family integration route](../../../test-node.md).

Do not splice either fixture bar. The active pack contains no long gantry
splice bars, splice collars, or movable gantry mounts.

[← Change the selected device](../../index.md)
