---
hide:
  - toc
---

# Build sheet · TrimUI Smart Pro S

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1"><strong>Selected DUT:</strong> TrimUI Smart Pro S <span>·</span> <strong>Layout:</strong> <code>chassis-dualbar-v1</code></p>

This sheet is the only safe entrance to a new Smart Pro S chassis build. Keep
this device selection for the printed pack, rail cuts, all 17 assembly steps,
and candidate verification.

## Resolved build profile

| Module | Selected value |
| --- | --- |
| Device slug | `trimui-smart-pro-s` |
| Device family | `trimui-smart-pro-family` |
| Holder profile | `trimui-smart-pro-family` · shared with Smart Pro |
| Integration route | `trimui-smart-pro-family-v1` · shared family route for later side-board, harness, and I/O instructions |
| Integration status | `structure_only` · component-level wiring recipe still pending |
| Chassis layout | `chassis-dualbar-v1` · continuous fixture bars on four printed crossbar-joint plates |
| Qualification | `candidate` · non-production until owner gate `tsp-px73.23` passes |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| Assembly sequence | 17 page-per-job bench steps |
| Carrier links | 91.5 mm upper / 108.5 mm lower · 1 mm inside the stack planes |

!!! warning "Candidate mechanical layout"
    Generate this full pack only with the explicit non-production override.
    The browser and command-line manifests must report
    `production_eligible=false` and `layout_unqualified`. Publishing these
    instructions does not qualify the layout.

## Follow this path in order

1. [Review the dual-bar candidate layout](../../layouts/chassis-dualbar-v1/index.md).
2. [Collect its parts and tools](../../layouts/chassis-dualbar-v1/parts.md).
3. [Generate and print the Smart Pro S pack](print.md).
4. [Cut and label the dual-bar rail set](../../layouts/chassis-dualbar-v1/cut.md).
5. [Assemble it in 17 workbench steps](../../layouts/chassis-dualbar-v1/assemble/index.md).
6. [Run and record candidate verification](../../layouts/chassis-dualbar-v1/verify.md).
7. [Route the de-energized harness](../../layouts/chassis-dualbar-v1/wire-management.md).
8. Continue to the [family integration route](../../../test-node.md).

Do not substitute the original Smart Pro gantry parts or 19-step assembly
chapter.

[← Change the selected device](../../index.md)
