---
hide:
  - toc
---

# Build sheet · TrimUI Smart Pro

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro" data-layout-id="chassis-core-v1"><strong>Selected DUT:</strong> TrimUI Smart Pro <span>·</span> <strong>Layout:</strong> <code>chassis-core-v1</code></p>

This sheet is the only safe entrance to a new Smart Pro chassis build. Keep
this device selection for the printed pack, rail cuts, all 19 assembly steps,
and verification.

## Resolved build profile

| Module | Selected value |
| --- | --- |
| Device slug | `trimui-smart-pro` |
| Device family | `trimui-smart-pro-family` |
| Holder profile | `trimui-smart-pro-family` · shared with Smart Pro S |
| Integration route | `trimui-smart-pro-family-v1` · shared family route for later side-board, harness, and I/O instructions |
| Integration status | `structure_only` · component-level wiring recipe still pending |
| Chassis layout | `chassis-core-v1` · qualified gantry chassis |
| Qualification | `physically_qualified` · accepted baseline recorded by the source layout |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| Assembly sequence | 19 page-per-job bench steps |

!!! note "Shared device family does not erase layout history"
    Smart Pro and Smart Pro S use the same holder family and integration route.
    The original Smart Pro's immutable qualified print pack still selects the
    two-upright gantry chassis, so this build sheet follows that source mapping.

## Follow this path in order

1. [Review the qualified chassis layout](../../layouts/chassis-core-v1/index.md).
2. [Collect its parts and tools](../../layouts/chassis-core-v1/parts.md).
3. [Generate and print the Smart Pro pack](print.md).
4. [Cut and label the qualified rail set](../../layouts/chassis-core-v1/cut.md).
5. [Assemble it in 19 workbench steps](../../layouts/chassis-core-v1/assemble/index.md).
6. [Verify the qualified mechanical build](../../layouts/chassis-core-v1/verify.md).
7. [Route the de-energized harness](../../layouts/chassis-core-v1/wire-management.md).
8. Continue to the [family integration route](../../../test-node.md).

Do not use the dual-bar cut list or 17-step Smart Pro S chapter with this
qualified pack.

[← Change the selected device](../../index.md)
