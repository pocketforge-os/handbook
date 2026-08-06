---
hide:
  - toc
---

# Build sheet · TrimUI Smart Pro S

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v3"><strong>Selected DUT:</strong> TrimUI Smart Pro S / TG5050 <span>·</span> <strong>Layout:</strong> <code>chassis-dualbar-v3</code></p>

This sheet is the only safe entrance to a new Smart Pro S chassis build. Keep
this device selection for the printed pack, rail cuts, all 18 assembly steps,
and build verification.

<figure>
  <img src="../../../../assets/generated/test-node-chassis/device-examples/smart_pro_s/layout-assembly.png" alt="TrimUI Smart Pro S carrier and dual USB-C interrupter holder installed on the dual-bar test-node chassis">
  <figcaption>Device-specific assembly reference generated from the same pinned source as this pack.</figcaption>
</figure>

## Resolved build profile

| Module | Selected value |
| --- | --- |
| Device slug | `trimui-smart-pro-s` |
| Device family | `trimui-smart-pro-family` |
| Holder profile | `trimui-smart-pro-family` · shared with Smart Pro |
| Integration route | `trimui-smart-pro-family-v1` · shared family route for later side-board, harness, and I/O instructions |
| Integration status | `structure_only` · component-level wiring recipe still pending |
| Chassis layout | `chassis-dualbar-v3` · continuous fixture bars, four side-clear crossbar-joint plates, and the dual USB-C interrupter holder |
| Qualification | `candidate` · predecessor `chassis-dualbar-v1` is qualified; four-plate installed gate `tsp-bcx.21.38` remains open |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| Assembly sequence | 18 page-per-job bench steps |
| Carrier links | 91.5 mm upper / 108.5 mm lower · 1 mm inside the stack planes |

!!! warning "Side-clear candidate · physical acceptance required"
    The aluminum topology, fixture links, holder, and carrier links remain the
    qualified `chassis-dualbar-v1` parts. Only the four crossbar-joint plates
    change: 38.4 mm long and 0.8 mm inside both outward extrusion planes.
    Keep the revision non-production until its installed side-by-side gate is
    recorded under `tsp-bcx.21.38`.

## Follow this path in order

1. [Review the qualified predecessor topology](../../layouts/chassis-dualbar-v1/index.md).
2. [Collect its parts and tools](../../layouts/chassis-dualbar-v1/parts.md).
3. [Generate and print the Smart Pro S pack](print.md).
4. [Cut and label the dual-bar rail set](../../layouts/chassis-dualbar-v1/cut.md).
5. [Assemble it in 18 workbench steps](../../layouts/chassis-dualbar-v1/assemble/index.md).
6. [Run and record build verification](../../layouts/chassis-dualbar-v1/verify.md).
7. [Route the de-energized harness](../../layouts/chassis-dualbar-v1/wire-management.md).
8. Continue to the [family integration route](../../../test-node.md).

The linked assembly chapter describes the unchanged `chassis-dualbar-v1`
topology. For `chassis-dualbar-v3`, substitute the dedicated four-piece
`chassis/side-clear-crossbar-joint-plate-set.stl` for the old joint plates. Do
not substitute the original Smart Pro gantry parts or 19-step chapter.

[← Change the selected device](../../index.md)
