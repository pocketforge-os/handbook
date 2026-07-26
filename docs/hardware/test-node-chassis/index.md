# Build the test-node chassis

Build the reusable, stackable mechanical frame that holds one PocketForge
device, its inspection camera, and its control electronics. The result is a
**test-node chassis**. The handheld installed in it is the **device under test
(DUT)**.

!!! info "Model the DUT first"
    Complete the
    [remote-evidence model gate](../model-handheld/index.md#finish-two-acceptance-gates)
    before starting this fabrication flow. The reusable aluminum frame can
    then be built while the handheld ships, but generate and print its
    device-specific DUT holder only from the
    [in-hand accepted model](../model-handheld/refine-and-accept.md).

<script type="module" src="../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<div class="chassis-model-shell">
  <model-viewer
    src="../../assets/generated/test-node-chassis/pocketforge-test-node.glb"
    poster="../../assets/generated/test-node-chassis/hero.png"
    alt="Interactive model of the complete PocketForge test-node chassis"
    camera-controls
    touch-action="pan-y"
    shadow-intensity="0.7"
    shadow-softness="0.8"
    exposure="1.0"
    camera-orbit="35deg 68deg 1.05m"
    min-camera-orbit="auto auto 0.55m"
    max-camera-orbit="auto auto 1.7m">
  </model-viewer>
  <span class="chassis-model-help">drag to rotate · scroll to zoom</span>
</div>

The model above is generated from the same OpenSCAD assembly that generates
the printable files. It includes the current fixture board, Logitech C270
camera envelope and field of view, TrimUI Smart Pro carrier, power strip, and
replaceable node placard.

## What you will build

| Property | Standard value |
| --- | ---: |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| Aluminum | 20 × 20 mm square rail, also sold as 2020 slot-6 extrusion |
| Stock consumed | Six nominal 1 m sticks |
| Printed material | ABS, designed around a 0.8 mm nozzle |
| Adjustment | Movable camera frame adjusts in X, Y, and Z |
| DUT carrier | Fixed to the device-side frame on the shared optical axis |
| Stacking | Eight 18 × 92 × 4 mm registration tabs; aluminum-on-aluminum vertical load path |
| Wire management | Eight repositionable M5 rail anchors for ordinary zip ties |

!!! warning "Keep fabrication and cable work de-energized"
    This guide never energizes a DUT or the test node. Keep the power strip
    unplugged and all device/power wiring disconnected throughout fabrication.
    The final wire-management page organizes an already defined harness only
    after every source has been disconnected; electrical integration belongs
    in the per-DUT test-node procedure.

## Learn the orientation once

Never translate these directions to “front” and “back”—those words reverse
depending on where someone stands.

<div class="pf-orientation">
  <div><strong>Operator side</strong><br>Closest to the human. It carries the
  placard, electronics fixture, and power strip.</div>
  <div><strong>Device side</strong><br>Closest to the wall. It carries the DUT
  carrier and handheld.</div>
  <div><strong>Left</strong><br>Your left while standing on the operator side
  and looking through the chassis.</div>
  <div><strong>Right</strong><br>Your right from that same position.</div>
</div>

Orange parts in the assembly drawings are the parts added in that step.
Completed aluminum rails turn gray; metal corner and crossbar connectors stay
dark.

## Build path

1. [Collect the parts and tools](parts.md).
2. [Print the seven canonical production beds](print.md).
3. [Cut and label the aluminum rails](cut.md).
4. [Assemble the chassis in 19 bench-sized steps](assemble/index.md).
5. [Run the unpowered verification gates](verify.md).
6. [Secure the finished harness to the rails](wire-management.md).

!!! tip "Parallelize after the first model gate"
    Once the remote-evidence model establishes the DUT’s nominal envelope, the
    standard chassis, movable camera frame, power-strip mount, and
    identification holder can be fabricated while the handheld ships. Hold the
    fitted DUT holder for the in-hand model gate.

## Source of truth

The parametric design, generated cut list, printable replacements, instruction
scenes, and interactive model builder live in
[`pocketforge-os/test-node-hw`](https://github.com/pocketforge-os/test-node-hw/tree/main/mechanical/dut-chassis-2020-v1).
The handbook build pins one immutable source revision and regenerates these
assets; a stale or dirty publication is rejected.
