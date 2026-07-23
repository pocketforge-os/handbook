# Assemble the chassis

Use this chapter at the workbench. It replaces one long assembly page with one
small physical job per page. Open the current step, collect only the parts it
names, compare your work with the picture, and pass the green check before
moving on.

<div class="pf-chapter-meta">
  <span>19 bench steps</span>
  <span>Moderate difficulty</span>
  <span>Mechanical work only</span>
  <span>First-time builder friendly</span>
</div>

!!! danger "Keep the entire build unpowered"
    Leave the power strip unplugged. Do not connect a programmable supply, DUT,
    USB power, battery emulator, or mains input during this chapter.

## See the destination

<script type="module" src="../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<script type="module">
  const viewer = document.querySelector("#assembly-chassis-model");
  const toggle = document.querySelector("[data-chassis-label-toggle]");
  if (viewer && toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      const labelsVisible = viewer.dataset.labelsVisible !== "true";
      viewer.dataset.labelsVisible = String(labelsVisible);
      toggle.setAttribute("aria-pressed", String(labelsVisible));
      toggle.textContent = labelsVisible ? "Hide labels" : "Show labels";
    });
  }
</script>
<div class="chassis-model-shell" data-chassis-labeled-model>
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
    src="../../../assets/generated/test-node-chassis/pocketforge-test-node.glb"
    poster="../../../assets/generated/test-node-chassis/hero.png"
    alt="Interactive model of the complete PocketForge test-node chassis"
    data-labels-visible="true"
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
      <span>stand here</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--device"
      slot="hotspot-device"
      data-position="0.173m 0.340m -0.375m"
      data-normal="0 1 0">
      <strong>DEVICE / WALL SIDE</strong>
      <span>DUT mounts here</span>
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
      class="pf-model-hotspot pf-model-hotspot--camera-frame"
      slot="hotspot-camera-frame"
      data-position="0.336m 0.205m -0.075m"
      data-normal="0 0 1">
      <strong>CAMERA FRAME</strong>
      <span>uprights: 164 + 164 mm · crossbars: 306 mm</span>
    </span>
  </model-viewer>
  <span class="chassis-model-help">drag to rotate · scroll to zoom</span>
</div>
<noscript>
  <img
    class="pf-step-render"
    src="../../../assets/generated/test-node-chassis/hero.png"
    alt="Static finished view of the complete PocketForge test-node chassis">
</noscript>

Use **Show labels** whenever an orientation is unclear. The four **360 mm
posts** stand vertically, the four **318 mm depth rails** run from operator to
device, and the **306 mm width rails** run left to right. Each camera-frame
upright joins two 164 mm halves; its two crossbars are also 306 mm. The static
drawings use this same viewpoint: the **operator side** is closest to you and
the **device / wall side** is farthest from you.

## Five names you need

You do not need prior experience with aluminum framing. These are the only
special names used in the chapter:

- **Aluminum rail:** one cut length of the 20 mm square material. Suppliers
  often call it *2020 aluminum extrusion*; this guide says *rail*.
- **Long groove:** one channel running along a rail face. Hardware slides
  inside it. A supplier may call it a *T-slot*.
- **Cut end:** either open end of a rail. A sliding nut bar enters through this
  end; it cannot enter through the narrow opening on the rail face.
- **Sliding nut bar:** the orange printed piece with a metal M3 nut already
  installed. The source files call it an *M3 channel bar*.
- **Camera frame:** the smaller movable rectangle inside the outer chassis. The
  CAD source calls it a *gantry*.

The tape labels made in [Cut the aluminum rails](../cut.md) remain on the parts
until assembly is complete. Instructions always give the plain name first and
the short tape code second.

## Read the drawings

The drawings use instruction colors rather than literal finish colors. Every
step repeats the exact local meaning in a **Read the picture** box beside the
drawing:

<div class="pf-visual-key">
  <div><span class="pf-cue pf-cue--orange">Orange highlight</span><span>The active geometry in focused views; finished references use orange for printed frame hardware. The local key distinguishes them.</span></div>
  <div><span class="pf-cue pf-cue--blue">Blue cue</span><span>An arrow, measurement, orientation label, or tape tag on an orange parked replacement. The step names which one.</span></div>
  <div><span class="pf-cue pf-cue--silver">Silver / gray</span><span>Aluminum or already-assembled context. It always sits on a light drawing panel, including in dark mode.</span></div>
  <div><span class="pf-cue pf-cue--charcoal">Charcoal</span><span>A concealed metal connector or installed component named by the step.</span></div>
  <div><span class="pf-cue pf-cue--green">Green check</span><span>The visible condition that must be correct before continuing.</span></div>
</div>

In **Get these parts**, the marker itself also carries a word such as
**Aluminum**, **Printed**, **M3**, **Tool**, or **Assembled**. Color is therefore
never the only way to identify either a bench part or a drawing instruction.

## Before Step 1

- [ ] All six production print beds passed the [print gate](../print.md#print-gate).
- [ ] All rail pieces passed the [cut gate](../cut.md#cut-gate) and still have
      their plain-language tape labels.
- [ ] The ordinary M3 nuts are already seated in all 28 short sliding nut bars
      and all four long splice bars.
- [ ] The power strip and every source of DUT power are physically separate
      from the work area.
- [ ] A ruler or tape measure, square, and the required hex drivers are within
      reach.

## The 19-step path

<ol class="pf-step-list">
  <li><a href="01-learn-the-rail/"><strong>Learn the rail and nut bar</strong><small>Practice the only hidden interface before loading real frame parts.</small></a></li>
  <li><a href="02-load-width-rails/"><strong>Load the four width rails</strong><small>Place the first 10 sliding nut bars in the left-to-right rails.</small></a></li>
  <li><a href="03-load-depth-rails/"><strong>Load the four depth rails</strong><small>Put two identical orange bars in each rail; tag and park one.</small></a></li>
  <li><a href="04-splice-uprights/"><strong>Splice the camera-frame uprights</strong><small>Join each pair of 164 mm halves into one straight rail.</small></a></li>
  <li><a href="05-load-camera-frame/"><strong>Load the camera-frame rails</strong><small>Add the final 10 bars and account for all 28.</small></a></li>
  <li><a href="06-build-camera-frame/"><strong>Build the camera frame</strong><small>Join the smaller adjustable rectangle while it lies flat.</small></a></li>
  <li><a href="07-lay-out-lower-frame/"><strong>Lay out the lower frame</strong><small>Resolve operator, device, left, and right before adding connectors.</small></a></li>
  <li><a href="08-add-posts/"><strong>Add the four posts</strong><small>Build the open outer frame and leave its top off.</small></a></li>
  <li><a href="09-lower-camera-frame/"><strong>Lower the camera frame inside</strong><small>Capture the complete inner frame before the outer top closes.</small></a></li>
  <li><a href="10-set-camera-frame/"><strong>Seat and position the camera frame</strong><small>Engage both lower joint plates and set the 75 mm datum.</small></a></li>
  <li><a href="11-close-outer-frame/"><strong>Close the outer frame</strong><small>Assemble and lower the complete top ring without forcing a corner.</small></a></li>
  <li><a href="12-square-frame/"><strong>Square and tighten the frame</strong><small>Match both pairs of diagonals before final tightening.</small></a></li>
  <li><a href="13-mount-dut-holder/"><strong>Mount the DUT holder</strong><small>Keep the short upper and long lower links in the right places.</small></a></li>
  <li><a href="14-mount-electronics-plate/"><strong>Mount the electronics plate</strong><small>Use all four spacers and keep the plate untwisted.</small></a></li>
  <li><a href="15-aim-camera/"><strong>Aim the camera toward the DUT</strong><small>Check the optical direction without powering the DUT.</small></a></li>
  <li><a href="16-add-placard/"><strong>Add the node placard</strong><small>Mount the holder where the operator can read and service it.</small></a></li>
  <li><a href="17-mount-power-strip/"><strong>Mount the unplugged power strip</strong><small>Fit its wall-mount keyholes without drilling the enclosure.</small></a></li>
  <li><a href="18-add-stacking-tabs/"><strong>Add the stacking tabs</strong><small>Install two guides at every upper corner.</small></a></li>
  <li><a href="19-final-check/"><strong>Compare the finished chassis</strong><small>Catch a missing part or reversed assembly before formal verification.</small></a></li>
</ol>

<nav class="pf-step-nav" aria-label="Assembly chapter navigation">
  <a href="../cut/">← Back: Cut the rails</a>
  <span>Assembly · 19 steps</span>
  <a href="01-learn-the-rail/">Begin Step 1 →</a>
</nav>
