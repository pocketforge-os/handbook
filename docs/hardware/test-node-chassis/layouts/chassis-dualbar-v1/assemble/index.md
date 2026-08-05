# Assemble the dual-bar chassis

<p class="pf-profile-banner" data-layout-id="chassis-dualbar-v1"><strong>Compatible topology:</strong> Current registered device packs <span>·</span> <code>chassis-dualbar-v1</code> <span>·</span> 17 steps</p>

Use this chapter at the workbench after the verified device pack is printed
and all 14 aluminum pieces pass the cut gate. Each page is one small physical
job: collect its parts, match the picture, follow the numbered actions, and
pass the green check before moving on.

<div class="pf-chapter-meta">
  <span>17 bench steps</span>
  <span>Mechanical work only</span>
  <span>First-time builder friendly</span>
  <span>Phone-friendly step pages</span>
</div>

!!! danger "Keep the entire build unpowered"
    Leave the power strip unplugged. Do not connect a programmable supply, DUT,
    USB power, battery emulator, relay supply, or mains input during this
    chapter.

## See the destination

<script type="module" src="../../../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<script type="module" src="../../../../../assets/chassis-model.mjs"></script>
<div class="chassis-model-shell">
  <button
    class="chassis-model-label-toggle"
    type="button"
    data-chassis-label-toggle
    aria-controls="assembly-chassis-model"
    aria-pressed="true"
    hidden>
    Hide labels
  </button>
  <model-viewer
    id="assembly-chassis-model"
    data-full-chassis-model
    data-labels-visible="true"
    src="../../../../../assets/generated/test-node-chassis/pocketforge-test-node.glb"
    poster="../../../../../assets/generated/test-node-chassis/hero.png"
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
    src="../../../../../assets/generated/test-node-chassis/hero.png"
    alt="Static fallback view of the Smart Pro S dual-bar test-node chassis">
</noscript>

The outside envelope is 346 mm wide, 358 mm deep, and approximately 368 mm
high. Stand at the **operator side**: width rails run left to right, depth
rails run away from you, and the Smart Pro S holder sits on the far device
side.

## Five names you need

- **Aluminum rail:** one labeled cut length of the 20 mm square material.
- **Long groove:** a channel along a rail face. Printed channel bars and metal
  fasteners slide behind its narrow opening.
- **Cut end:** either open end of a rail. A channel bar enters here; it cannot
  pass through the long groove opening.
- **M3 channel bar:** the compact 18 mm printed carrier with an ordinary metal
  M3 nut seated inside. A loose screw and wide washer make a temporary handle.
- **Fixture bar:** either continuous 306 mm support rail (`FIXTURE-L` or
  `FIXTURE-U`) that holds the populated fixture board.

Keep the tape labels from [Cut the aluminum rails](../cut.md) on every part
until assembly is complete. Instructions give the tape code whenever
orientation matters.

## Read the drawings

The pictures use instruction colors rather than literal finish colors. Every
step repeats the local meaning beside its drawing.

<div class="pf-visual-key">
  <div><span class="pf-cue pf-cue--orange">Orange highlight</span><span>The part, hardware, or position being added or handled now.</span></div>
  <div><span class="pf-cue pf-cue--blue">Blue cue</span><span>An insertion arrow, movement direction, measurement, or parked-spare tag.</span></div>
  <div><span class="pf-cue pf-cue--silver">Silver / gray</span><span>Aluminum or work that is already assembled.</span></div>
  <div><span class="pf-cue pf-cue--charcoal">Charcoal</span><span>A metal connector or installed component named by the step.</span></div>
  <div><span class="pf-cue pf-cue--green">Green check</span><span>The condition that must be true before continuing.</span></div>
</div>

Part markers also carry words such as **Aluminum**, **Printed**, **M3**,
**Tool**, or **Assembled**. Color is never the only way to identify a part or
an action.

## Before Step 1

- [ ] The complete pack for the selected DUT passed its print gate; return to
      the [device selector](../../../index.md) if the device identity is not
      still visible on the verified manifest.
- [ ] Four 360 mm posts, four 318 mm depth rails, four 306 mm width rails, and
      two continuous 306 mm fixture bars passed the [cut gate](../cut.md#cut-gate).
- [ ] One ordinary M3 nut is fully seated in each of the 28 compact channel
      bars.
- [ ] The 8 outer-frame metal three-way connectors are present.
- [ ] Four identical 71.5 mm fixture links, four printed crossbar-joint
      plates, all holder parts, placard parts, power-strip blocks, and eight
      stacking tabs are present.
- [ ] The power strip and every source of DUT power are physically separate
      from the work area.
- [ ] A tape measure, square, and the required M3/M5 hex drivers are within
      reach.

The preload steps account for **22 active + 6 parked = 28** channel bars before
any cut end is closed.

## The 17-step path

<ol class="pf-step-list">
  <li><a href="01-learn-the-rail/"><strong>Learn the rail and channel bar</strong><small>Practice the only hidden interface before loading labeled frame parts.</small></a></li>
  <li><a href="02-load-width-rails/"><strong>Load the four width rails</strong><small>Put six active bars in their exact labeled rails and grooves.</small></a></li>
  <li><a href="03-load-depth-rails/"><strong>Load the four depth rails</strong><small>Add four printed-joint bars, four power-strip bars, and four blue-tagged parked spares.</small></a></li>
  <li><a href="04-load-fixture-bars/"><strong>Load both fixture bars</strong><small>Add four link bars, four joint bars, and two parked spares; count all 28.</small></a></li>
  <li><a href="05-lay-out-lower-frame/"><strong>Lay out the lower frame</strong><small>Resolve operator, device, left, and right while the frame is flat.</small></a></li>
  <li><a href="06-install-lower-fixture-bar/"><strong>Install the lower fixture bar</strong><small>Set the continuous lower support at the 75 mm datum before posts rise.</small></a></li>
  <li><a href="07-add-posts/"><strong>Add the four posts</strong><small>Raise the open frame while every joint remains adjustable.</small></a></li>
  <li><a href="08-build-upper-ring/"><strong>Build the upper ring flat</strong><small>Join its four labeled rails without placing it on the posts yet.</small></a></li>
  <li><a href="09-install-upper-fixture-bar/"><strong>Install the upper fixture bar</strong><small>Match the lower bar's 75 mm datum while the ring is on the bench.</small></a></li>
  <li><a href="10-close-outer-frame/"><strong>Close the outer frame</strong><small>Lower the complete upper ring evenly onto all four posts.</small></a></li>
  <li><a href="11-square-frame/"><strong>Square and tighten the frame</strong><small>Match both diagonal pairs within 2 mm before final torque.</small></a></li>
  <li><a href="12-mount-dut-holder/"><strong>Mount the Smart Pro S holder</strong><small>Keep the marked upper and lower links in their correct positions.</small></a></li>
  <li><a href="13-mount-fixture-board/"><strong>Mount the populated fixture board</strong><small>Use all four identical links and all four board slots.</small></a></li>
  <li><a href="14-add-placard/"><strong>Add the node placard</strong><small>Keep its readable cartridge removable from the operator side.</small></a></li>
  <li><a href="15-mount-power-strip/"><strong>Mount the unplugged power strip</strong><small>Run it front-to-back inside the lower operator-right depth rail.</small></a></li>
  <li><a href="16-add-stacking-tabs/"><strong>Add the stacking tabs</strong><small>Install two narrow registration guides at each upper corner.</small></a></li>
  <li><a href="17-final-check/"><strong>Align and compare the finished chassis</strong><small>Catch a missing part, skew, or unsafe power state before formal verification.</small></a></li>
</ol>

After Step 17, continue to the [formal build verification](../verify.md).

<nav class="pf-step-nav" aria-label="Assembly chapter navigation">
  <a href="../cut/">← Back: Cut the rails</a>
  <span>Assembly · 17 steps</span>
  <a href="01-learn-the-rail/">Begin Step 1 →</a>
</nav>
