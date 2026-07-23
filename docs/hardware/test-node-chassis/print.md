# Print the hardware

<script type="module" src="../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<script type="module">
  document.querySelectorAll("model-viewer[data-click-to-load]").forEach((viewer) => {
    viewer.addEventListener("click", () => viewer.dismissPoster(), { once: true });
  });
</script>

Use the canonical beds below. Do not scale, auto-orient, or auto-arrange
these STLs.

## Slicer contract

| Setting | Value |
| --- | --- |
| Material | ABS |
| Nozzle | 0.8 mm |
| Layer height | 0.4 mm |
| Perimeters | At least 3 |
| Top/bottom solid layers | At least 4 |
| Infill | 20–30%; gyroid or grid |
| Scale | 100% |
| Supports | Disabled for every canonical bed |
| Brim | Disabled on the validated process; add only if your own adhesion requires it |
| Automatic orientation | Disabled |

Retain the temperature, cooling, enclosure, and first-layer values from your
known-good ABS profile. Geometry is already exported in its intended
support-free orientation.

!!! warning "Bed size is intentional"
    The largest production bed is 240 × 150 mm. All beds fit the conservative
    247 × 207 mm usable envelope of the PocketForge Prusa i3 MK3S profile, but
    some leave little X-axis margin. Confirm the slicer reports every object
    inside the printable area.

## Batch 00 — calibration (conditional)

Print this bed only after changing the aluminum-rail supplier, printer, nozzle,
material, slicer compensation, or placard-slide geometry.

<div class="pf-batch-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/batch-00-calibration.glb"
    poster="../../../assets/generated/test-node-chassis/batch-00-calibration.png"
    alt="Interactive model of the Batch 00 calibration print bed"
    camera-controls
    touch-action="pan-y"
    loading="lazy"
    reveal="manual"
    data-click-to-load
    shadow-intensity="0.7"
    shadow-softness="0.8">
  </model-viewer>
  <span class="pf-model-help">click to load · drag to rotate · scroll to zoom</span>
</div>

[Download Batch 00 STL](../../assets/generated/test-node-chassis/production-batch-00-calibration.stl){ .pf-download download="production-batch-00-calibration.stl" }

The bed contains the rail-key coupon, two M3 channel-bar candidates, and the
placard-slide coupon.

- [ ] The 6.43 mm rail key slides without force and does not wobble out of the
      slot mouth.
- [ ] Select the two-scallop sliding nut bar. It must travel freely end-to-end
      and remain captured when pulled toward the slot mouth.
- [ ] The placard coupon inserts from the right, stays retained when horizontal,
      and can still be removed by hand.

Stop here if any check fails. Compensation belongs in the parametric source;
do not scale one production bed independently.

## Batch 01 — ironed channel interfaces

This is the only production bed that requires ironing. Enable ironing on
topmost surfaces only. If the slicer cannot iron, print normally and wet-sand
only the channel-contact surfaces until they move smoothly.

<div class="pf-batch-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/batch-01-ironed-interfaces.glb"
    poster="../../../assets/generated/test-node-chassis/batch-01-ironed-interfaces.png"
    alt="Interactive model of the Batch 01 ironed channel-interface print bed"
    camera-controls
    touch-action="pan-y"
    loading="lazy"
    reveal="manual"
    data-click-to-load
    shadow-intensity="0.7"
    shadow-softness="0.8">
  </model-viewer>
  <span class="pf-model-help">click to load · drag to rotate · scroll to zoom</span>
</div>

[Download Batch 01 STL](../../assets/generated/test-node-chassis/production-batch-01-ironed-interfaces.stl){ .pf-download download="production-batch-01-ironed-interfaces.stl" }

Expected output:

- 28 short, single-nut M3 sliding nut bars;
- four long, double-nut upright-splice bars.

## Batch 02 — upright splice collars

Print both collars standing on their indexed open ends, exactly as exported.
No supports are required.

<div class="pf-batch-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/batch-02-splice-collars.glb"
    poster="../../../assets/generated/test-node-chassis/batch-02-splice-collars.png"
    alt="Interactive model of the Batch 02 upright-splice-collar print bed"
    camera-controls
    touch-action="pan-y"
    loading="lazy"
    reveal="manual"
    data-click-to-load
    shadow-intensity="0.7"
    shadow-softness="0.8">
  </model-viewer>
  <span class="pf-model-help">click to load · drag to rotate · scroll to zoom</span>
</div>

[Download Batch 02 STL](../../assets/generated/test-node-chassis/production-batch-02-splice-collars.stl){ .pf-download download="production-batch-02-splice-collars.stl" }

Expected output: two identical full-wrap collars.

## Batch 03 — movable mounts

<div class="pf-batch-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/batch-03-movable-mounts.glb"
    poster="../../../assets/generated/test-node-chassis/batch-03-movable-mounts.png"
    alt="Interactive model of the Batch 03 movable-mount print bed"
    camera-controls
    touch-action="pan-y"
    loading="lazy"
    reveal="manual"
    data-click-to-load
    shadow-intensity="0.7"
    shadow-softness="0.8">
  </model-viewer>
  <span class="pf-model-help">click to load · drag to rotate · scroll to zoom</span>
</div>

[Download Batch 03 STL](../../assets/generated/test-node-chassis/production-batch-03-movable-mounts.stl){ .pf-download download="production-batch-03-movable-mounts.stl" }

Expected output:

- four keyed camera-frame joint plates;
- four 5 mm fixture-plate spacers;
- two upper and two lower DUT-carrier links.

## Batch 04 — frame hardware

<div class="pf-batch-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/batch-04-frame-hardware.glb"
    poster="../../../assets/generated/test-node-chassis/batch-04-frame-hardware.png"
    alt="Interactive model of the Batch 04 frame-hardware print bed"
    camera-controls
    touch-action="pan-y"
    loading="lazy"
    reveal="manual"
    data-click-to-load
    shadow-intensity="0.7"
    shadow-softness="0.8">
  </model-viewer>
  <span class="pf-model-help">click to load · drag to rotate · scroll to zoom</span>
</div>

[Download Batch 04 STL](../../assets/generated/test-node-chassis/production-batch-04-frame-hardware.stl){ .pf-download download="production-batch-04-frame-hardware.stl" }

Expected output:

- eight stacking-registration tabs;
- two placard risers and two keyed placard spacers;
- two identical power-strip mount blocks.

## Batch 05 — placard holder

<div class="pf-batch-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/batch-05-placard-holder.glb"
    poster="../../../assets/generated/test-node-chassis/batch-05-placard-holder.png"
    alt="Interactive model of the single Batch 05 reusable placard holder"
    camera-controls
    touch-action="pan-y"
    loading="lazy"
    reveal="manual"
    data-click-to-load
    shadow-intensity="0.7"
    shadow-softness="0.8">
  </model-viewer>
  <span class="pf-model-help">click to load · drag to rotate · scroll to zoom</span>
</div>

[Download Batch 05 STL](../../assets/generated/test-node-chassis/production-batch-05-placard-holder.stl){ .pf-download download="production-batch-05-placard-holder.stl" }

Expected output: one reusable fleet-width placard holder.

## Batch 06 — device nameplate

This bed contains only the nameplate so the filament change cannot recolor
another part.

<div class="pf-batch-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/batch-06-device-nameplate.glb"
    poster="../../../assets/generated/test-node-chassis/batch-06-device-nameplate.png"
    alt="Interactive model of the Batch 06 white device nameplate with black raised TrimUI Smart Pro text"
    camera-controls
    touch-action="pan-y"
    loading="lazy"
    reveal="manual"
    data-click-to-load
    shadow-intensity="0.7"
    shadow-softness="0.8">
  </model-viewer>
  <span class="pf-model-help">click to load · drag to rotate · scroll to zoom</span>
</div>

[Download Batch 06 STL](../../assets/generated/test-node-chassis/production-batch-06-device-nameplate.stl){ .pf-download download="production-batch-06-device-nameplate.stl" }

1. Load **white ABS** and slice the bed with the standard settings above.
2. Add a filament/color change at **Z = 2.4 mm**, before the first raised-text
   layer begins.
3. Print the 2.4 mm nameplate body in white.
4. At the pause, unload white and load **black ABS**.
5. Resume to print the raised device name in black.

Expected output: one replaceable white device-name cartridge with black raised
text. The default cartridge says `TrimUI Smart Pro`. Longer names shrink within
the same standard holder instead of changing its mounting geometry.

## Prepare the captive nuts

Do this at the bench before bringing over any aluminum rails.

A **captive nut** is just an ordinary metal M3 nut held in a hex-shaped
pocket. The metal nut supplies the screw thread; the orange printed bar keeps
the nut from turning. The screw and washer shown below are a temporary pull
tool—remove them after seating each nut.

<div class="pf-step-layout" markdown="1">
<div class="pf-step-visual">
  <figure>
    <img src="../../../assets/generated/test-node-chassis/prep-captive-nut.png" alt="At left, an exploded orange short nut bar with a dark M3 hex nut above its pocket and a silver screw and washer entering from below beside a blue upward arrow; at right, the screw is removed and a green check marks the nut seated flat in the bar">
    <figcaption>Left: pull the nut into the hex pocket from the smooth side. Right: remove the screw and keep the finished bar.</figcaption>
  </figure>
  <figure>
    <img src="../../../assets/generated/test-node-chassis/prep-captive-nut-count.png" alt="Four rows of seven orange short bars with one dark nut each beside four long orange splice bars with two dark nuts each, labeled 36 metal M3 nuts total">
    <figcaption>Finish all 28 short bars and all four long bars now. <a href="../../../assets/generated/test-node-chassis/prep-captive-nut-count.png">Open the count drawing full size.</a></figcaption>
  </figure>
</div>
<div class="pf-step-copy" markdown="1">

### Get these parts

<ul class="pf-part-list">
  <li><span class="pf-part-tag pf-part-tag--printed">Printed</span><span><strong>28 × short sliding nut bars</strong><small>Batch 01 · one hex pocket per bar</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--printed">Printed</span><span><strong>4 × long splice bars</strong><small>Batch 01 · two hex pockets per bar</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--fastener">M3</span><span><strong>36 × ordinary M3 hex nuts</strong><small>28 for the short bars + 8 for the long bars</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--tool">Tool</span><span><strong>1 × M3 screw, wide washer, and 2.5 mm hex key</strong><small>Reuse the same screw and washer as the pull tool</small></span></li>
</ul>

<div class="pf-picture-key" role="group" aria-label="Captive nut picture annotations">
  <p class="pf-picture-key__title">Read the picture</p>
  <ul>
    <li><span class="pf-cue pf-cue--orange">Orange bar</span><span>The printed carrier has a hex-shaped pocket on one face and a smooth screw hole on the other.</span></li>
    <li><span class="pf-cue pf-cue--charcoal">Dark hex</span><span>This is the ordinary metal M3 nut. It belongs in the hex pocket, not on the smooth face.</span></li>
    <li><span class="pf-cue pf-cue--silver">Silver hardware</span><span>The screw and wide washer pull from the smooth side and come back out when the nut is seated.</span></li>
    <li><span class="pf-cue pf-cue--blue">Blue arrow</span><span>Thread the screw upward into the nut by hand; never hammer or press the nut from above.</span></li>
    <li><span class="pf-cue pf-cue--green">Green check</span><span>The finished nut sits flat in its pocket and cannot turn.</span></li>
  </ul>
</div>

</div>
</div>

### Seat one nut

1. Put one short orange bar on the bench with its **hex-shaped pocket facing
   up**.
2. Set one ordinary M3 nut flat in that pocket.
3. Hold the nut in place. From the smooth side underneath, pass the M3 screw
   through a wide washer and through the bar.
4. Turn the screw into the nut **by hand for two or three turns**. Stop and
   realign it if the screw does not turn freely.
5. Use the hex key only until the nut is pulled squarely to the bottom of the
   pocket. This is seating pressure, not final fastener torque.
6. Remove the screw and washer.
7. Check from the pocket side: all six nut corners are inside the hex recess,
   the nut lies flat, and a fingertip cannot rotate it.

### Repeat the exact count

- Seat **one nut in each of the 28 short bars**: 28 nuts.
- Seat **two nuts in each of the four long splice bars**: 8 nuts.
- Final total: **28 short bars + 4 long bars + 36 seated nuts**.

<div class="pf-step-check" markdown="1">

**Before you continue:** count four complete rows of seven short bars and four
long bars. Every short bar shows one flat metal nut; every long bar shows two.
The temporary screw and washer have been removed from all 32 printed bars.

</div>

!!! warning "No glue, heat, or hammering"
    Do not glue the nuts, melt them in, hammer them, or pause a print to
    encapsulate them. The open pockets are the calibrated production
    interface and let a damaged nut be replaced.

!!! tip "Identify the splice-bar ends now"
    On every long bar, the **unmarked 12.8 mm end** enters the first rail and
    touches the collar's internal pusher. The **one-scallop 16 mm end** finishes
    at the aluminum butt seam. Mark the unnotched end with removable tape if
    that makes the distinction faster during assembly.

## Print gate

- [ ] All six production beds completed without supports.
- [ ] Batch 06 has a white 2.4 mm body and black raised text.
- [ ] Batch 01 channel surfaces are smooth and dimensionally unchanged.
- [ ] Count: 28 short bars, four long bars, two collars.
- [ ] All 36 captive nuts are square and fully seated.
- [ ] No split layers, lifted corners, or damaged screw holes are visible.
- [ ] Every batch stayed at 100% scale and in its exported orientation.

Next: [cut and label the aluminum rails](cut.md).
