# Smart Pro stack-clear gantry chassis

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro" data-layout-id="chassis-core-v2"><strong>Compatible DUT:</strong> TrimUI Smart Pro <span>·</span> <strong>Layout:</strong> <code>chassis-core-v2</code> <span>·</span> physically qualified</p>

Build the current source-registered chassis for the original TrimUI Smart Pro.
It preserves the proven outer frame and movable two-upright fixture gantry,
while its four DUT-holder links stop 1 mm inside both chassis stack planes.
Those stack-clear links and the resulting layout are physically qualified
under `tsp-t1zd.2`; the former <code>chassis-core-v1</code> record remains an
immutable qualified baseline for reproducing older builds.

!!! info "Choose the device first"
    Enter this lane only from the
    [TrimUI Smart Pro build sheet](../../devices/trimui-smart-pro/index.md). The Smart
    Pro S print pack selects a different layout and must use its 17-step
    dual-bar chapter.

!!! danger "Keep fabrication de-energized"
    Leave the power strip unplugged and disconnect DUT, USB, relay, bench
    supply, and battery-emulator power throughout fabrication. Electrical
    integration comes only after mechanical verification.

## See the destination

<figure class="pf-layout-hero">
  <img src="../../../../assets/generated/test-node-chassis/legacy/qualified-gantry-complete.png" alt="Complete Smart Pro gantry chassis viewed from the operator side with outer frame, inner fixture gantry, DUT holder, fixture board, power strip, placard, and stacking tabs">
  <figcaption>The <code>chassis-core-v2</code> gantry reference. The only changed printable relative to the frozen v1 layout is the stack-clear carrier-link set.</figcaption>
</figure>

## Resolved mechanical profile

| Property | Selected value |
| --- | ---: |
| Registered device | `trimui-smart-pro` |
| Registered chassis layout | `chassis-core-v2` |
| Qualification | `physically_qualified` · accepted production layout under `tsp-t1zd.2` |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| Outer frame | 4 × 360 mm posts, 4 × 318 mm depth rails, 4 × 306 mm width rails |
| Fixture gantry | 4 × 164 mm upright halves and 2 × 306 mm crossbars |
| Finished extrusion | 5,204 mm from six nominal 1 m sticks |
| Hidden channel bars | 28 short bars: 22 active and 6 parked, plus 4 long splice bars |
| Assembly | 19 page-per-job workbench steps |

The outer envelope and Smart Pro family holder are shared with the current
Smart Pro S example. The inner fixture suspension is not: this lane preserves
the original spliced-upright gantry and its matching printed parts.

## Build path

1. [Collect the parts and tools](parts.md).
2. [Generate and print the Smart Pro pack](../../devices/trimui-smart-pro/print.md).
3. [Cut and label the six-stick rail plan](cut.md).
4. [Assemble the chassis in 19 steps](assemble/index.md).
5. [Verify the mechanical build](verify.md).
6. [Route the de-energized harness](wire-management.md).

## Source of truth

Geometry and pack qualification remain owned by
[`pocketforge-os/test-node-hw`](https://github.com/pocketforge-os/test-node-hw/tree/main/mechanical/dut-chassis-2020-v1).
The handbook regenerates every assembly image from its pinned revision and
cross-checks this guide against the published device-pack catalog. Production
eligibility is bound to the exact v2 layout and carrier-link fingerprints
accepted under `tsp-t1zd.2`.

Next: [collect the parts and tools](parts.md).

[← Back to the Smart Pro build sheet](../../devices/trimui-smart-pro/index.md)
