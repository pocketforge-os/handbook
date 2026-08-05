# Generate the side-clear Smart Pro / TG5040 pack

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro" data-layout-id="chassis-core-v3"><strong>Compatible DUT:</strong> TrimUI Smart Pro / TG5040 <span>·</span> <code>chassis-core-v3</code></p>

This build sheet locks the generator to **TrimUI Smart Pro / TG5040**. For an
existing chassis, choose **Retrofit** and generate only
`chassis/side-clear-crossbar-joint-plate-set.stl`; that one bed contains all
four replacement plates. Choose **Complete chassis** for a new build. OpenSCAD
runs locally in this browser from the pinned source catalog; the handbook
stores no pre-rendered production STL.

<script type="module" src="../../../../../assets/device-pack-generator.mjs"></script>
<section
  class="pf-device-pack-generator"
  data-device-pack-generator
  data-locked-device="trimui-smart-pro"
  data-catalog-url="../../../../../assets/generated/test-node-chassis/browser/catalog.json"
  data-checksums-url="../../../../../assets/generated/test-node-chassis/browser/SHA256SUMS"
  data-baseline-url="../../../../../assets/device-pack-browser-baselines.json"
  data-worker-url="../../../../../assets/device-pack-worker.mjs"
  data-runtime-url="../../../../../assets/vendor/openscad/openscad.js"
  data-font-url="../../../../../assets/vendor/openscad/fonts/LiberationSans-Bold.ttf"
  data-regular-font-url="../../../../../assets/vendor/openscad/fonts/LiberationSans-Regular.ttf"
  data-font-config-url="../../../../../assets/vendor/openscad/fonts/fonts.conf"
  aria-labelledby="smart-pro-pack-generator-title"
  aria-busy="false">
  <div class="pf-device-pack-generator__heading">
    <div>
      <span class="pf-device-pack-generator__eyebrow">LOCAL CAD WORKBENCH</span>
      <h2 id="smart-pro-pack-generator-title">Generate the side-clear candidate pack</h2>
    </div>
    <span class="pf-device-pack-generator__privacy">runs on this device</span>
  </div>
  <div class="pf-device-pack-generator__selectors">
    <label><span>Handheld · locked by build sheet</span><select data-pack-device disabled><option>Loading registered devices…</option></select></label>
    <label><span>Build</span><select data-pack-mode disabled><option>Loading pack modes…</option></select></label>
  </div>
  <aside class="pf-device-pack-generator__qualification" data-pack-qualification aria-live="polite"><strong>Verifying the source catalog…</strong></aside>
  <div class="pf-device-pack-generator__toolbar">
    <button type="button" data-pack-generate-all disabled>Generate complete pack</button>
    <button type="button" data-pack-cancel hidden>Cancel</button>
    <a data-pack-download hidden>Download generated pack</a>
  </div>
  <progress data-pack-progress value="0" max="1" hidden></progress>
  <p class="pf-device-pack-generator__status" data-pack-status role="status" aria-live="polite">Loading the pinned device catalog…</p>
  <div class="pf-device-pack-generator__inventory" data-pack-inventory></div>
</section>

<noscript>Browser generation requires JavaScript. Use the command-line path below.</noscript>

The qualification panel must identify `trimui-smart-pro-family` with
`chassis-core-v3` and say **Prototype pack · not production-qualified**. It
must list `layout_unqualified`; this remains expected until the four installed
plates pass `tsp-bcx.21.38`. Stop if it names the dual-bar layout.

## Command-line alternative

```sh
python3 mechanical/device-packs/build_device_pack.py build \
  --device trimui-smart-pro \
  --mode retrofit \
  --allow-unqualified

python3 mechanical/device-packs/build_device_pack.py verify \
  --pack mechanical/device-packs/build/trimui-smart-pro/retrofit
```

Inspect `manifest.json` and confirm `production_eligible=false`, reason
`layout_unqualified`, device `trimui-smart-pro`, layout `chassis-core-v3`, and
acceptance reference `tsp-bcx.21.38` before slicing.

## Slicer contract

| Setting | Value |
| --- | --- |
| Material | ABS for chassis hardware; follow the holder artifact's manifest |
| Nozzle | 0.8 mm for the accepted chassis process |
| Layer height | 0.4 mm |
| Perimeters | At least 3 |
| Top/bottom solid layers | At least 4 |
| Infill | 20–30%; gyroid or grid |
| Scale | 100% |
| Supports | Disabled |
| Automatic orientation / arrangement | Disabled |

Use the exported orientation. Re-run the calibration artifact after changing
rail supplier, printer, nozzle, material, slicer compensation, or placard
fit.

## Identify the chassis artifacts

The verified full pack includes these gantry chassis groups in addition
to the selected Smart Pro holder, hooks, carrier links, nameplate, and wire
anchors:

- Core 01: 28 short channel bars and four long double-nut splice bars;
- Core 02: two full-wrap upright splice collars;
- Core 03: four fixture spacers;
- Core 04: the frozen v1 frame-hardware bed;
- Core 05: the reusable placard holder; and
- Side-clear joints: four dedicated 38.4 mm crossbar-joint plates; and
- the conditional process-calibration bed.

The device group contains two 91.5 mm upper links and two 108.5 mm lower links.
Those remain unchanged from `chassis-core-v2`; the dedicated four-plate bed is
the only `chassis-core-v3` geometry change.

![Gantry preload inventory](../../../../assets/generated/test-node-chassis/legacy/prep-captive-nut-count.png)

Seat one ordinary M3 nut in each of the 28 short bars and two in each of the
four long bars. Pull each nut flat with a spare screw and washer, then remove
the temporary hardware. Do not glue, hammer, melt, or encapsulate a nut.

## Generate one cable anchor

The full pack contains eight M5 starter anchors. For one M3 or M5 replacement,
use the same source-owned browser customizer:

<script type="module" src="../../../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<script type="module" src="../../../../../assets/cable-anchor-customizer.mjs"></script>
<section class="pf-cable-anchor-customizer" data-cable-anchor-customizer data-worker-url="../../../../../assets/cable-anchor-worker.mjs" aria-labelledby="legacy-anchor-title">
  <div class="pf-cable-anchor-customizer__controls">
    <h3 id="legacy-anchor-title">One rail cable / zip-tie anchor</h3>
    <label><span>Drop-in T-nut and screw</span><select data-anchor-fastener><option value="M5">M5 · default</option><option value="M3">M3 · smaller hardware</option></select></label>
    <p data-anchor-hardware></p>
    <button type="button" data-anchor-generate>Generate one anchor</button>
    <p data-anchor-status role="status" aria-live="polite"></p>
    <a data-anchor-download hidden>Download cable-anchor STL</a>
  </div>
  <div class="pf-cable-anchor-customizer__preview">
    <model-viewer data-anchor-preview data-m5-model="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.glb" data-m5-poster="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.png" data-m3-model="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m3.glb" data-m3-poster="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m3.png" src="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.glb" poster="../../../../../assets/generated/test-node-chassis/print-batches/cable-anchor-m5.png" alt="Interactive preview of one rail cable anchor with an M5 center hole" camera-controls touch-action="pan-y"></model-viewer>
  </div>
</section>

## Print gate

- [ ] Device and layout are `trimui-smart-pro` / `chassis-core-v3`.
- [ ] Manifest verification passes with `production_eligible=false` and
      `layout_unqualified` while `tsp-bcx.21.38` remains open.
- [ ] Every artifact stayed at 100% scale in its exported orientation.
- [ ] Count 28 short channel bars, four long splice bars, and 36 seated nuts.
- [ ] Both splice collars, all movable mounts, the holder pack, placard, and
      wire anchors come from this same verified pack.
- [ ] Both 91.5 mm upper links and both 108.5 mm lower links end 1 mm inside
      their corresponding chassis stack planes.
- [ ] All four side-clear plates end 0.8 mm inside the two outward extrusion
      planes after installation.
- [ ] No interface, slot, key, or through-hole is blocked or damaged.

Next: [cut and label the unchanged gantry rails](../../layouts/chassis-core-v2/cut.md).
