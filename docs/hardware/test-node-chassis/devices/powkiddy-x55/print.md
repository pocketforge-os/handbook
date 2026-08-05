# Generate the Powkiddy X55 prototype pack

<p class="pf-profile-banner" data-guide-device="powkiddy-x55" data-layout-id="chassis-dualbar-powkiddy-x55-v1"><strong>Compatible DUT:</strong> Powkiddy X55 <span>·</span> <code>chassis-dualbar-powkiddy-x55-v1</code></p>

This build sheet locks the browser generator to **Powkiddy X55**. OpenSCAD
runs locally in the browser from the exact source revision pinned by the
handbook. No model or generated STL is uploaded.

Choose the fit coupon first. It reproduces the production bottom-contact
spacing while using only one low-filament bed. Use retrofit mode only when an
existing continuous-bar chassis needs the X55 device parts and side-clear joint plates;
use full mode for a conversion or the complete 12-artifact prototype pack. Every download
includes a manifest and `SHA256SUMS`.

!!! warning "Prototype pack · not production-qualified"
    The source manifest must report `production_eligible=false`. Full and
    retrofit modes must list `holder_unqualified` and `layout_unqualified`.
    This is expected while physical gates `tsp-bcx.21.28`, `tsp-bcx.21.40`,
    and `tsp-bcx.21.38` remain open. Generating files does not qualify them.

<script type="module" src="../../../../../assets/device-pack-generator.mjs"></script>
<section
  class="pf-device-pack-generator"
  data-device-pack-generator
  data-locked-device="powkiddy-x55"
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
  <div class="pf-device-pack-generator__inventory" data-pack-inventory></div>
</section>

<noscript>
  Browser generation requires JavaScript. Use the command-line path below.
</noscript>

## Command-line alternative

From a clean `pocketforge-os/test-node-hw` checkout at the handbook's pinned
revision:

```sh
python3 mechanical/device-packs/build_device_pack.py build \
  --device powkiddy-x55 \
  --mode coupon \
  --allow-unqualified

python3 mechanical/device-packs/build_device_pack.py verify \
  --pack mechanical/device-packs/build/powkiddy-x55/coupon
```

Stop if `manifest.json` does not identify `powkiddy-x55`,
`chassis-dualbar-powkiddy-x55-v1`, the expected physical gates, and exactly the
expected non-production reasons.

## What to print and inspect

| Output | Material | Prototype check |
| --- | --- | --- |
| `coupon/holder-fit-coupon.stl` | PETG | Print first; confirm bottom spacing, shelf depth, throat play, and nut capture without forcing the DUT |
| `device/carrier.stl` | PETG | 247 × 175 mm, flat, labels upward; color change at 3.2 mm |
| `device/j-hook-set.stl` | PETG | Contains 2 bottom, 2 side, and 2 top contacts; do not substitute a single-depth hook |
| `device/carrier-link-set.stl` | ABS | Four X55-specific stack-clear links; broad face down, keys upward |
| `device/device-nameplate.stl` | ABS | Confirm the complete “Powkiddy X55” label is legible |
| `device/wire-anchor-set.stl` | ABS | Eight starter rail anchors; repeat or omit only after routing is known |
| `chassis/side-clear-crossbar-joint-plate-set.stl` | ABS | Four 38.4 mm plates; confirm each ends inside the outward extrusion planes |
| Other `chassis/*.stl` | ABS | Continuous-bar common beds; no splice-bar or splice-collar bed is present |

Use 100% scale, supports disabled, and automatic orientation disabled. Follow
the material and orientation notes in the generated manifest.

## Physical acceptance checklist

- Calipers replace the provisional bottom, top, and side contact depths.
- The coupon seats without stress and confirms the production bottom spacing.
- The DUT cannot rock or escape all six retainers after full-carrier assembly.
- Both microSD slots, every top connector/control, shoulders, speakers, display,
  and rear service area remain accessible.
- The useful whole-device view is visible to the C270.
- Carrier and chassis nameplate labels are readable after installation.

Keep the pack marked prototype until the owner records explicit acceptance.

[← Back to the X55 build sheet](index.md)
