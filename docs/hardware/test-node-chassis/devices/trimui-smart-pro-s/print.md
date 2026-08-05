# Generate and print the chassis pack

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v2"><strong>Compatible DUT:</strong> TrimUI Smart Pro S / TG5050 <span>·</span> <code>chassis-dualbar-v2</code></p>

This build sheet locks the generator to **TrimUI Smart Pro S / TG5050**. For an
existing chassis, choose **Retrofit** and generate only
`chassis/side-clear-crossbar-joint-plate-set.stl`; that one bed contains all
four replacements. Choose **Complete chassis** for a new build. OpenSCAD runs
locally in this browser: part recipes,
qualification state, and source files come from the same pinned registry as
the command-line pack builder. No model is uploaded, and the handbook neither
stores nor serves a pre-rendered STL.

The first build downloads the approximately 10 MB CAD engine. Generate one
part for a replacement, or generate the complete pack to receive one ZIP with
every STL, a manifest, and `SHA256SUMS`.

Before a download is offered, the browser rejects open meshes and checks the
normalized geometry against a runtime-specific baseline. That baseline was
cross-checked against the pinned source toolchain within 0.001 mm at the
bounds and 0.02% by volume; a source, runtime, or geometry change stops here
until its baseline is deliberately re-qualified.

!!! warning "Side-clear candidate · not production-qualified"
    The dedicated plate bed replaces the four 44.0 mm predecessor joints with
    four 38.4 mm joints. Each installed plate ends 0.8 mm inside both outward
    extrusion planes. The manifest must retain `layout_unqualified` until the
    installed side-by-side gate passes under `tsp-bcx.21.38`.

<script type="module" src="../../../../../assets/device-pack-generator.mjs"></script>
<section
  class="pf-device-pack-generator"
  data-device-pack-generator
  data-locked-device="trimui-smart-pro-s"
  data-catalog-url="../../../../../assets/generated/test-node-chassis/browser/catalog.json"
  data-checksums-url="../../../../../assets/generated/test-node-chassis/browser/SHA256SUMS"
  data-baseline-url="../../../../../assets/device-pack-browser-baselines.json"
  data-worker-url="../../../../../assets/device-pack-worker.mjs"
  data-runtime-url="../../../../../assets/vendor/openscad/openscad.js"
  data-font-url="../../../../../assets/vendor/openscad/fonts/LiberationSans-Bold.ttf"
  data-regular-font-url="../../../../../assets/vendor/openscad/fonts/LiberationSans-Regular.ttf"
  data-font-config-url="../../../../../assets/vendor/openscad/fonts/fonts.conf"
  aria-labelledby="device-pack-generator-title"
  aria-busy="false">
  <div class="pf-device-pack-generator__heading">
    <div>
      <span class="pf-device-pack-generator__eyebrow">LOCAL CAD WORKBENCH</span>
      <h2 id="device-pack-generator-title">Generate a device print pack</h2>
    </div>
    <span class="pf-device-pack-generator__privacy">runs on this device</span>
  </div>
  <div class="pf-device-pack-generator__selectors">
    <label>
      <span>Handheld · locked by build sheet</span>
      <select data-pack-device disabled>
        <option>Loading registered devices…</option>
      </select>
    </label>
    <label>
      <span>Build</span>
      <select data-pack-mode disabled>
        <option>Loading pack modes…</option>
      </select>
    </label>
  </div>
  <aside
    class="pf-device-pack-generator__qualification"
    data-pack-qualification
    aria-live="polite">
    <strong>Verifying the source catalog…</strong>
  </aside>
  <div class="pf-device-pack-generator__toolbar">
    <button type="button" data-pack-generate-all disabled>
      Generate complete pack
    </button>
    <button type="button" data-pack-cancel hidden>Cancel</button>
    <a data-pack-download hidden>Download generated pack</a>
  </div>
  <progress data-pack-progress value="0" max="1" hidden></progress>
  <p
    class="pf-device-pack-generator__status"
    data-pack-status
    role="status"
    aria-live="polite">
    Loading the pinned device catalog…
  </p>
  <div
    class="pf-device-pack-generator__inventory"
    data-pack-inventory>
  </div>
</section>

<noscript>
  Browser generation requires JavaScript. Use the command-line path below.
</noscript>

## Generate one cable anchor

The complete pack includes eight default M5 rail anchors. Use this control
when you need one replacement or prefer an M3 drop-in T-nut. Only the center
clearance changes; the 32 × 18 × 8.8 mm body and both zip-tie tunnels remain
the same.

<script type="module" src="../../../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<script type="module" src="../../../../../assets/cable-anchor-customizer.mjs"></script>
<section
  class="pf-cable-anchor-customizer"
  data-cable-anchor-customizer
  data-worker-url="../../../../../assets/cable-anchor-worker.mjs"
  aria-labelledby="cable-anchor-customizer-title">
  <div class="pf-cable-anchor-customizer__controls">
    <h3 id="cable-anchor-customizer-title">One rail cable / zip-tie anchor</h3>
    <label>
      <span>Drop-in T-nut and screw</span>
      <select data-anchor-fastener>
        <option value="M5">M5 · default starter-pack hardware</option>
        <option value="M3">M3 · smaller drop-in hardware</option>
      </select>
    </label>
    <p data-anchor-hardware></p>
    <button type="button" data-anchor-generate>Generate one anchor</button>
    <p data-anchor-status role="status" aria-live="polite"></p>
    <a data-anchor-download hidden>Download cable-anchor STL</a>
  </div>
  <div class="pf-cable-anchor-customizer__preview">
    <model-viewer
      data-anchor-preview
      data-m5-model="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.glb"
      data-m5-poster="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.png"
      data-m3-model="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m3.glb"
      data-m3-poster="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m3.png"
      src="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.glb"
      poster="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.png"
      alt="Interactive preview of one rail cable anchor with an M5 center hole"
      camera-controls
      touch-action="pan-y"
      shadow-intensity="0.6"
      camera-orbit="35deg 60deg 0.12m">
    </model-viewer>
    <span class="pf-model-help">drag to rotate · scroll to zoom</span>
  </div>
</section>

The generated part prints broad rail-contact face down in ABS, at 100% scale,
with supports disabled. Pair it with the selected M3 or M5 hardware; do not
drill one variant into the other.

## Command-line alternative

For automation or independent source verification, generate the same
device-selected plan from a clean `pocketforge-os/test-node-hw` checkout:

```sh
python3 mechanical/device-packs/build_device_pack.py build \
  --device trimui-smart-pro-s \
  --mode retrofit \
  --allow-unqualified

python3 mechanical/device-packs/build_device_pack.py verify \
  --pack mechanical/device-packs/build/trimui-smart-pro-s/retrofit
```

The device slug selects the candidate `chassis-dualbar-v2` layout.
Before slicing, inspect `manifest.json` and confirm:

- `production_eligible` is `false`;
- `nonproduction_reasons` contains `layout_unqualified`;
- the selected layout is `chassis-dualbar-v2`; and
- `layout.qualification.acceptance_ref` is `tsp-bcx.21.38`.

Stop if any value differs.

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
| Supports | Disabled |
| Brim | Disabled on the validated process; add only if your adhesion requires it |
| Automatic orientation | Disabled |
| Automatic arrangement | Disabled |

Retain the temperature, cooling, enclosure, and first-layer values from the
known-good ABS profile. Do not scale, auto-orient, or auto-arrange these beds.
The exported placement is part of the geometry contract.

!!! warning "Check the usable bed, not the advertised bed"
    Confirm every exported object remains inside the validated 247 × 207 mm
    usable area. Do not let a slicer move, rotate, or scale an object to match
    a different advertised envelope.

## Inspect the generated chassis beds

| Pack output | Expected contents | Special handling |
| --- | --- | --- |
| `calibration/chassis-process-calibration.stl` | Rail-key, channel-bar, and placard coupons | Conditional after a process or interface change |
| `chassis/core-01-ironed-interfaces.stl` | 28 compact M3 channel bars | Iron topmost channel-contact surfaces |
| `chassis/core-02-fixture-links.stl` | Four identical 71.5 mm keyed links | Keep every exported broad face on the bed and every key upward |
| `chassis/side-clear-crossbar-joint-plate-set.stl` | Four identical 38.4 mm side-clear joint plates | Print once per chassis; broad face down, with supports disabled |
| `chassis/core-04-frame-hardware.stl` | Stacking, placard, and power-strip hardware | Inspect every slot and through-hole |
| `chassis/core-05-placard-holder.stl` | One reusable placard holder | Check the slide channel before installing it |

### Interactive print-bed previews

Each poster is generated from the same pinned OpenSCAD source as the browser
recipe. Select or drag a preview to inspect the actual exported arrangement;
no STL is stored on the site.

<div class="pf-print-preview-grid">
  <figure class="pf-print-preview">
    <model-viewer src="../../../../../assets/generated/test-node-chassis/print-batches/batch-00-calibration.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/batch-00-calibration.png" alt="Interactive preview of the optional chassis calibration bed" camera-controls touch-action="pan-y" reveal="interaction"></model-viewer>
    <figcaption><strong>Calibration</strong><span>Conditional interface coupons</span></figcaption>
  </figure>
  <figure class="pf-print-preview">
    <model-viewer src="../../../../../assets/generated/test-node-chassis/print-batches/batch-01-ironed-interfaces.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/batch-01-ironed-interfaces.png" alt="Interactive preview of 28 compact channel bars" camera-controls touch-action="pan-y" reveal="interaction"></model-viewer>
    <figcaption><strong>Core 01</strong><span>28 ironed channel bars</span></figcaption>
  </figure>
  <figure class="pf-print-preview">
    <model-viewer src="../../../../../assets/generated/test-node-chassis/print-batches/batch-02-fixture-links.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/batch-02-fixture-links.png" alt="Interactive preview of four keyed fixture links" camera-controls touch-action="pan-y" reveal="interaction"></model-viewer>
    <figcaption><strong>Core 02</strong><span>4 fixture links</span></figcaption>
  </figure>
  <figure class="pf-print-preview">
    <model-viewer src="../../../../../assets/generated/test-node-chassis/print-batches/batch-04-frame-hardware.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/batch-04-frame-hardware.png" alt="Interactive preview of the frame hardware print bed" camera-controls touch-action="pan-y" reveal="interaction"></model-viewer>
    <figcaption><strong>Core 04</strong><span>Frame completion hardware</span></figcaption>
  </figure>
  <figure class="pf-print-preview">
    <model-viewer src="../../../../../assets/generated/test-node-chassis/print-batches/batch-05-placard-holder.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/batch-05-placard-holder.png" alt="Interactive preview of the reusable placard holder" camera-controls touch-action="pan-y" reveal="interaction"></model-viewer>
    <figcaption><strong>Core 05</strong><span>Reusable placard holder</span></figcaption>
  </figure>
  <figure class="pf-print-preview">
    <model-viewer src="../../../../../assets/generated/test-node-chassis/print-batches/batch-06-device-nameplate.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/batch-06-device-nameplate.png" alt="Interactive preview of the two-color device nameplate bed" camera-controls touch-action="pan-y" reveal="interaction"></model-viewer>
    <figcaption><strong>Device 06</strong><span>Two-color nameplate</span></figcaption>
  </figure>
  <figure class="pf-print-preview">
    <model-viewer src="../../../../../assets/generated/test-node-chassis/print-batches/batch-07-wire-management.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/batch-07-wire-management.png" alt="Interactive preview of eight rail-mounted cable and zip-tie anchors" camera-controls touch-action="pan-y" reveal="interaction"></model-viewer>
    <figcaption><strong>Device 07</strong><span>8 cable / zip-tie anchors</span></figcaption>
  </figure>
</div>

The same manifest selects the Smart Pro S holder, six J-hooks, holder fit
coupon, two 91.5 mm upper carrier links, two 108.5 mm lower carrier links,
device nameplate, and eight starter wire anchors. Use every device-specific
piece from this one verified pack.

## Seat and account for all 28 channel-bar nuts

A channel bar is the compact orange 18 mm carrier with one ordinary metal M3
nut seated in its hex pocket. The metal nut supplies the thread; the printed
carrier keeps it aligned inside the rail.

1. Put one carrier on the bench with its hex pocket facing up.
2. Set one M3 nut flat in the pocket.
3. From the smooth side, pass a spare M3 screw through a wide washer and the
   carrier, then turn it into the nut by hand.
4. Tighten only until the nut reaches the bottom of the pocket.
5. Remove the screw and washer. Confirm the nut lies flat and cannot rotate.
6. Repeat for all 28 carriers. Do not glue, hammer, melt, or encapsulate a nut.

![Dual-bar channel-bar preload map](../../../../assets/generated/test-node-chassis/dualbar/layout-preload.png)

The exact inventory is **22 active + 6 parked = 28**:

| Destination | Active | Parked with removable blue tape |
| --- | ---: | ---: |
| Four outer width rails | 6 | 0 |
| Four outer depth rails | 8 | 4 |
| Lower and upper fixture bars | 8 | 2 |
| **Total** | **22** | **6** |

Parked bars are identical service spares. Blue tape marks the retaining screw;
there is no separately printed blue part. Keep each parked screw only tight
enough to prevent rattling.

## Customize the device name

The nameplate generator below runs OpenSCAD entirely in this browser. The name
is not uploaded, and the approximately 10 MB CAD runtime loads only after you
press **Generate personalized STL**.

<script type="module" src="../../../../../assets/nameplate-customizer.mjs"></script>
<div
  class="pf-nameplate-customizer"
  data-nameplate-customizer
  data-worker-url="../../../../../assets/nameplate-worker.mjs">
  <div class="pf-nameplate-customizer__controls">
    <form data-nameplate-form novalidate>
      <label for="device-nameplate-label"><strong>Device name</strong></label>
      <div class="pf-nameplate-customizer__input-row">
        <input
          id="device-nameplate-label"
          data-nameplate-input
          name="device-name"
          type="text"
          value="TrimUI Smart Pro S / TG5050"
          maxlength="29"
          autocomplete="off"
          spellcheck="false"
          aria-describedby="device-nameplate-help device-nameplate-count">
        <span id="device-nameplate-count" class="pf-nameplate-customizer__count">
          <output data-nameplate-count>27</output>/29
        </span>
      </div>
      <p id="device-nameplate-help" class="pf-nameplate-customizer__help">
        Use letters, numbers, spaces, and
        <code>. , - _ / + &amp; ( ) '</code>. Longer names shrink automatically.
      </p>
      <button
        class="pf-nameplate-customizer__button"
        data-nameplate-submit
        type="submit">
        Generate personalized STL
      </button>
    </form>
    <p
      class="pf-nameplate-customizer__status"
      data-nameplate-status
      role="status"
      aria-live="polite">
      Ready. The CAD engine loads only after you press Generate.
    </p>
    <a
      class="pf-nameplate-customizer__download"
      data-nameplate-download
      hidden>
      Download personalized STL
    </a>
  </div>
  <div class="pf-nameplate-customizer__preview" aria-hidden="true">
    <span>NAME PREVIEW</span>
    <strong data-nameplate-preview>TrimUI Smart Pro S / TG5050</strong>
    <small>white body · black from Z = 2.4 mm</small>
  </div>
</div>

Advanced users can download the exact
[pinned OpenSCAD chassis source](../../../../assets/generated/test-node-chassis/customizer/pocketforge-node-chassis.scad)
and its
[2020-profile library](../../../../assets/generated/test-node-chassis/customizer/lib/pf-2020.scad).
Keep the library under `lib/`, override `DEVICE_LABEL`, and export
`production_batch_06_device_nameplate`.

Print the 2.4 mm nameplate body in white ABS. Add a filament change at
**Z = 2.4 mm**, load black ABS, and resume for the raised device name.

## Print gate

- [ ] Pack verification passes against the clean source revision in its
      manifest.
- [ ] The manifest is non-production with `layout_unqualified` while
      `tsp-bcx.21.38` remains open.
- [ ] Every bed stayed at 100% scale in its exported support-free orientation.
- [ ] Core 01 contains exactly 28 compact channel bars.
- [ ] Core 02 contains four identical keyed fixture links.
- [ ] The dedicated side-clear bed contains four identical 38.4 mm joint
      plates.
- [ ] All 28 captive nuts sit flat and cannot rotate.
- [ ] The preload count balances to 22 active and 6 blue-tagged parked bars.
- [ ] The holder, J-hooks, carrier links, and nameplate all come from the same
      verified device pack.
- [ ] Every stacking-tab hole, fixture-link key, joint-plate key, carrier-link
      hole, and zip-tie tunnel is open and undamaged.

Next: [cut the aluminum rails](../../layouts/chassis-dualbar-v1/cut.md).
