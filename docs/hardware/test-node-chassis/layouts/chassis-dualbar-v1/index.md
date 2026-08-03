# Smart Pro S dual-bar chassis

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1"><strong>Compatible DUT:</strong> TrimUI Smart Pro S <span>·</span> <strong>Layout:</strong> <code>chassis-dualbar-v1</code> <span>·</span> physically qualified</p>

Build the reusable aluminum frame that holds one PocketForge device, its
inspection camera, and its populated DUT test board. New chassis builds use one
continuous upper bar and one continuous lower bar to suspend the fixture
board. The Smart Pro S is the worked example and selects the registered
`chassis-dualbar-v1` layout.

!!! info "Model the DUT first"
    Complete the
    [remote-evidence model gate](../../../model-handheld/index.md#finish-two-acceptance-gates)
    before fabrication. Before printing the device-specific holder, complete
    the in-hand model gate and
    [qualify the DUT holder](../../../dut-holder/index.md).

!!! success "Production-qualified mechanical layout"
    `chassis-dualbar-v1` passed the physical fit, loaded-stability, racking,
    service, and camera gates. Its production record is bound to the exact
    accepted fingerprints under `tsp-t1zd.2`.

## Explore the complete assembly

<script type="module" src="../../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<script type="module" src="../../../../assets/chassis-model.mjs"></script>
<div class="chassis-model-shell">
  <button
    class="chassis-model-label-toggle"
    type="button"
    data-chassis-label-toggle
    aria-controls="overview-chassis-model"
    aria-pressed="true"
    hidden>
    Hide labels
  </button>
  <model-viewer
    id="overview-chassis-model"
    data-full-chassis-model
    data-labels-visible="true"
    src="../../../../assets/generated/test-node-chassis/pocketforge-test-node.glb"
    poster="../../../../assets/generated/test-node-chassis/hero.png"
    alt="Interactive Smart Pro S dual-bar test-node chassis with modeled handheld, populated DUT test board, camera, carrier, and frame"
    camera-controls
    touch-action="pan-y"
    shadow-intensity="0.7"
    shadow-softness="0.8"
    exposure="1.0"
    camera-orbit="35deg 68deg 1.05m"
    min-camera-orbit="auto auto 0.55m"
    max-camera-orbit="auto auto 1.7m">
    <span
      class="pf-model-hotspot pf-model-hotspot--operator"
      slot="hotspot-operator"
      data-position="0.173m 0.045m 0.030m"
      data-normal="0 1 0">
      <strong>OPERATOR SIDE</strong>
      <span>fixture board and controls</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--device"
      slot="hotspot-device"
      data-position="0.173m 0.205m -0.333m"
      data-normal="0 0 -1">
      <strong>DEVICE / WALL SIDE</strong>
      <span>DUT holder mounts here</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--post"
      slot="hotspot-post"
      data-position="0.010m 0.200m 0.012m"
      data-normal="0 0 1">
      <strong>POST · 360 mm</strong>
      <span>4 vertical pieces</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--width"
      slot="hotspot-width"
      data-position="0.173m 0.358m 0.012m"
      data-normal="0 1 0">
      <strong>WIDTH · 306 mm</strong>
      <span>4 left-to-right rails</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--depth"
      slot="hotspot-depth"
      data-position="0.010m 0.358m -0.179m"
      data-normal="0 1 0">
      <strong>DEPTH · 318 mm</strong>
      <span>4 operator-to-device rails</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--fixture-bar"
      slot="hotspot-upper-fixture-bar"
      data-position="0.173m 0.358m -0.075m"
      data-normal="0 1 0">
      <strong>UPPER FIXTURE BAR · 306 mm</strong>
      <span>1 continuous support rail</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--fixture-bar"
      slot="hotspot-lower-fixture-bar"
      data-position="0.173m 0.010m -0.075m"
      data-normal="0 -1 0">
      <strong>LOWER FIXTURE BAR · 306 mm</strong>
      <span>1 continuous support rail</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--fixture"
      slot="hotspot-fixture"
      data-position="0.189m 0.184m -0.045m"
      data-normal="0 0 1">
      <strong>DUT TEST BOARD</strong>
      <span>populated fixture assembly</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--handheld"
      slot="hotspot-handheld"
      data-position="0.173m 0.205m -0.315m"
      data-normal="0 0 -1">
      <strong>MODELED HANDHELD</strong>
      <span>Smart Pro S worked example</span>
    </span>
  </model-viewer>
  <span class="chassis-model-help">drag to rotate · scroll to zoom</span>
</div>
<noscript>
  <img
    class="pf-step-render"
    src="../../../../assets/generated/test-node-chassis/hero.png"
    alt="Static fallback view of the Smart Pro S dual-bar test-node chassis">
</noscript>

Use **Hide labels** for an unobstructed view. The model is not a generic
placeholder: separate semantic layers preserve the Smart Pro S shell,
controls, and screen; the carrier and J-hooks; the populated fixture plate and
its relay, supply, controller, hubs, and antenna; the C270 and its field of
view; and every current suspension and frame part.

## What you will build

| Property | Current value |
| --- | ---: |
| Registered device example | `trimui-smart-pro-s` |
| Registered chassis layout | `chassis-dualbar-v1` |
| Outside envelope | 346 W × 358 D × approximately 368 H mm |
| Clear inside envelope | 306 W × 318 D × 328 H mm |
| Aluminum | 20 × 20 mm square slot-6 extrusion |
| Finished extrusion | 4,548 mm |
| Fresh stock | Five nominal 1 m sticks, or four plus two qualifying offcuts |
| Fixture support | Two continuous 306 mm bars |
| Printed suspension | Four identical 71.5 mm keyed fixture links + four keyed crossbar-joint plates |
| DUT carrier | Stack-clear 91.5 mm upper / 108.5 mm lower links on the device-side rails |
| Stacking | Eight 18 × 92 × 4 mm registration tabs |
| Wire management | Eight repositionable M5 rail anchors to start; individual M3 or M5 replacements |

Routine STLs are generated, not committed. The repository commits semantic
OpenSCAD source, device/layout records, normalized geometry locks, tests, and
instructions. A device-pack build renders the selected artifacts and records
their source hashes and geometry fingerprints in `manifest.json`.

## Learn the orientation once

Never translate these directions to “front” and “back”—those words reverse
depending on where someone stands.

<div class="pf-orientation">
  <div><strong>Operator side</strong><br>Closest to the human. It carries the
  placard, populated fixture board, and power strip.</div>
  <div><strong>Device side</strong><br>Closest to the wall. It carries the DUT
  holder and handheld.</div>
  <div><strong>Left</strong><br>Your left while standing on the operator side
  and looking through the chassis.</div>
  <div><strong>Right</strong><br>Your right from that same position.</div>
</div>

!!! danger "Keep fabrication de-energized"
    Leave the power strip unplugged and disconnect DUT, USB, relay, bench
    supply, and battery-emulator power throughout fabrication. Electrical
    integration belongs in the per-DUT procedure.

## Build path

1. [Collect the parts and tools](parts.md).
2. [Generate, verify, and print the Smart Pro S
   pack](../../devices/trimui-smart-pro-s/print.md).
3. [Use scrap first and cut the 14 rails](cut.md).
4. [Assemble the complete dual-bar chassis](assemble/index.md).
5. [Run and record the build checks](verify.md).
6. [Secure the finished harness to the rails](wire-management.md) only after
   the mechanical layout is accepted and every source is disconnected.

## Source of truth

The parametric design, generated cut list, printable parts, focused review
scenes, and semantic model builder live in
[`pocketforge-os/test-node-hw`](https://github.com/pocketforge-os/test-node-hw/tree/main/mechanical/dut-chassis-2020-v1).
The handbook pins one immutable source revision and regenerates its GLB,
poster, focused images, cut data, and checksums. Publication fails if the source
is dirty, the device/layout identity changes, a semantic layer disappears, or
a full-chassis page diverges from this interactive model.

Next: [collect the parts and tools](parts.md).

[← Back to the Smart Pro S build sheet](../../devices/trimui-smart-pro-s/index.md)
