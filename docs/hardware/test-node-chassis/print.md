# Generate and print the chassis pack

Choose a device and what you are building. OpenSCAD runs locally in this
browser: the device list, part recipes, qualification state, and source files
come from the same pinned registry as the command-line pack builder. No model
is uploaded, and the handbook neither stores nor serves a pre-rendered STL.

The first build downloads the approximately 10 MB CAD engine. Generate one
part for a replacement, or generate the complete pack to receive one ZIP with
every STL, a manifest, and `SHA256SUMS`.

Before a download is offered, the browser rejects open meshes and checks the
normalized geometry against a runtime-specific baseline. That baseline was
cross-checked against the pinned source toolchain within 0.001 mm at the
bounds and 0.02% by volume; a source, runtime, or geometry change stops here
until its baseline is deliberately re-qualified.

<script type="module" src="../../../assets/device-pack-generator.mjs"></script>
<section
  class="pf-device-pack-generator"
  data-device-pack-generator
  data-default-device="trimui-smart-pro-s"
  data-catalog-url="../../../assets/generated/test-node-chassis/browser/catalog.json"
  data-checksums-url="../../../assets/generated/test-node-chassis/browser/SHA256SUMS"
  data-baseline-url="../../../assets/device-pack-browser-baselines.json"
  data-worker-url="../../../assets/device-pack-worker.mjs"
  data-runtime-url="../../../assets/vendor/openscad/openscad.js"
  data-font-url="../../../assets/vendor/openscad/fonts/LiberationSans-Bold.ttf"
  data-font-config-url="../../../assets/vendor/openscad/fonts/fonts.conf"
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
      <span>Handheld</span>
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

## Command-line alternative

For automation or independent source verification, generate the same
device-selected plan from a clean `pocketforge-os/test-node-hw` checkout:

```sh
python3 mechanical/device-packs/build_device_pack.py build \
  --device trimui-smart-pro-s \
  --mode full \
  --allow-unqualified

python3 mechanical/device-packs/build_device_pack.py verify \
  --pack mechanical/device-packs/build/trimui-smart-pro-s/full
```

The device slug selects `chassis-topbar-v1`. The explicit override permits
candidate generation; it does not qualify the layout. Before slicing, inspect
`manifest.json` and confirm:

- `production_eligible` is `false`;
- `nonproduction_reasons` is exactly `["layout_unqualified"]`;
- the selected layout is `chassis-topbar-v1`; and
- `layout.qualification.acceptance_ref` is `tsp-t1zd.2`.

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
    The 244 mm backstay axis intentionally uses almost all of the 247 mm
    validated X envelope. Confirm every object remains inside the slicer's
    usable area.

## Inspect the generated chassis beds

| Pack output | Expected contents | Special handling |
| --- | --- | --- |
| `calibration/chassis-process-calibration.stl` | Rail-key, channel-bar, and placard coupons | Conditional after a process or interface change |
| `chassis/core-01-ironed-interfaces.stl` | 18 compact M3 channel bars | Iron topmost channel-contact surfaces |
| `chassis/core-02-upper-hangers.stl` | Two keyed upper hangers | Keep the exported keyed faces upward |
| `chassis/core-03-lower-backstays.stl` | Two 244 mm lower backstays | Keep the 244 mm axis on the long bed axis |
| `chassis/core-04-frame-hardware.stl` | Stacking, placard, and power-strip hardware | Inspect every slot and through-hole |
| `chassis/core-05-placard-holder.stl` | One reusable placard holder | Check the slide channel before installing it |

![Two upper hangers in their support-free exported orientation](../../assets/generated/test-node-chassis/topbar/layout-upper-hangers.png)

![Two 244 mm lower backstays aligned to the long bed axis](../../assets/generated/test-node-chassis/topbar/layout-lower-backstays.png)

The same manifest selects the Smart Pro S holder, six J-hooks, holder fit
coupon, four carrier links, device nameplate, and eight starter wire anchors.
Use every device-specific piece from this one verified pack.

## Seat and account for all 18 channel-bar nuts

A channel bar is the compact orange 18 mm carrier with one ordinary metal M3
nut seated in its hex pocket. The metal nut supplies the thread; the printed
carrier keeps it aligned inside the rail.

1. Put one carrier on the bench with its hex pocket facing up.
2. Set one M3 nut flat in the pocket.
3. From the smooth side, pass a spare M3 screw through a wide washer and the
   carrier, then turn it into the nut by hand.
4. Tighten only until the nut reaches the bottom of the pocket.
5. Remove the screw and washer. Confirm the nut lies flat and cannot rotate.
6. Repeat for all 18 carriers. Do not glue, hammer, melt, or encapsulate a nut.

![Top-bar channel-bar preload map](../../assets/generated/test-node-chassis/topbar/layout-preload.png)

The exact inventory is **12 active + 6 parked = 18**:

| Destination | Active | Parked with removable blue tape |
| --- | ---: | ---: |
| Four outer width rails | 10 | 0 |
| Four outer depth rails | 0 | 4 |
| Continuous top bar | 2 | 2 |
| **Total** | **12** | **6** |

Parked bars are identical service spares. Blue tape marks the retaining screw;
there is no separately printed blue part. Keep each parked screw only tight
enough to prevent rattling.

## Customize the device name

The nameplate generator below runs OpenSCAD entirely in this browser. The name
is not uploaded, and the approximately 10 MB CAD runtime loads only after you
press **Generate personalized STL**.

<script type="module" src="../../../assets/nameplate-customizer.mjs"></script>
<div
  class="pf-nameplate-customizer"
  data-nameplate-customizer
  data-worker-url="../../../assets/nameplate-worker.mjs">
  <div class="pf-nameplate-customizer__controls">
    <form data-nameplate-form novalidate>
      <label for="device-nameplate-label"><strong>Device name</strong></label>
      <div class="pf-nameplate-customizer__input-row">
        <input
          id="device-nameplate-label"
          data-nameplate-input
          name="device-name"
          type="text"
          value="TrimUI Smart Pro S"
          maxlength="29"
          autocomplete="off"
          spellcheck="false"
          aria-describedby="device-nameplate-help device-nameplate-count">
        <span id="device-nameplate-count" class="pf-nameplate-customizer__count">
          <output data-nameplate-count>18</output>/29
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
    <strong data-nameplate-preview>TrimUI Smart Pro S</strong>
    <small>white body · black from Z = 2.4 mm</small>
  </div>
</div>

Advanced users can download the exact
[pinned OpenSCAD chassis source](../../assets/generated/test-node-chassis/customizer/pocketforge-node-chassis.scad)
and its
[2020-profile library](../../assets/generated/test-node-chassis/customizer/lib/pf-2020.scad).
Keep the library under `lib/`, override `DEVICE_LABEL`, and export
`production_batch_06_device_nameplate`.

Print the 2.4 mm nameplate body in white ABS. Add a filament change at
**Z = 2.4 mm**, load black ABS, and resume for the raised device name.

## Print gate

- [ ] Pack verification passes against the clean source revision in its
      manifest.
- [ ] The manifest remains non-production with only `layout_unqualified`.
- [ ] Every bed stayed at 100% scale in its exported support-free orientation.
- [ ] Core 01 contains exactly 18 compact channel bars.
- [ ] Core 02 contains exactly two keyed upper hangers.
- [ ] Core 03 contains exactly two undamaged 244 mm backstays.
- [ ] All 18 captive nuts sit flat and cannot rotate.
- [ ] The preload count balances to 12 active and 6 blue-tagged parked bars.
- [ ] The holder, J-hooks, carrier links, and nameplate all come from the same
      verified device pack.
- [ ] Every stacking-tab hole, hanger key, backstay hole, and zip-tie tunnel
      is open and undamaged.

Next: [cut the aluminum rails](cut.md).
