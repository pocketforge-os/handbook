# Generate the TrimUI Brick prototype pack

<p class="pf-profile-banner" data-guide-device="trimui-brick" data-layout-id="chassis-dualbar-brick-v1"><strong>Compatible DUT:</strong> TrimUI Brick / TG3040 <span>·</span> <code>chassis-dualbar-brick-v1</code></p>

This build sheet locks the browser generator to **TrimUI Brick / TG3040**.
OpenSCAD runs locally in the browser from the exact source revision pinned by
the handbook. No model or generated STL is uploaded.

Choose the fit coupon first when validating the holder alone. Choose the full
mode when you are ready to print the complete 11-artifact chassis pack. Every
download includes a manifest and `SHA256SUMS`.

!!! warning "Prototype pack · not production-qualified"
    The source manifest must report `production_eligible=false`. Full mode
    must list `holder_unqualified` and `layout_unqualified`; retrofit mode must
    list `holder_unqualified`. This is expected while physical gate
    `tsp-bcx.21.23` remains open. Generating files does not qualify them.

<script type="module" src="../../../../../assets/device-pack-generator.mjs"></script>
<section
  class="pf-device-pack-generator"
  data-device-pack-generator
  data-locked-device="trimui-brick"
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
  --device trimui-brick \
  --mode full \
  --allow-unqualified

python3 mechanical/device-packs/build_device_pack.py verify \
  --pack mechanical/device-packs/build/trimui-brick/full
```

Stop if `manifest.json` does not identify `trimui-brick`,
`chassis-dualbar-brick-v1`, physical gate `tsp-bcx.21.23`, and exactly the
expected non-production reasons.

## What to print and inspect

| Output | Material | Prototype check |
| --- | --- | --- |
| `coupon/holder-fit-coupon.stl` | PETG | Print first; confirm the stepped-shell contacts without forcing the DUT |
| `device/carrier.stl` | PETG | 180 × 205 mm, flat, labels upward; color change at 3.2 mm |
| `device/j-hook-set.stl` | PETG | Contains 2 rear-only bottom supports, 2 side hooks, and 1 upper hook |
| `device/carrier-link-set.stl` | ABS | Four Brick-specific links; broad face down, keys upward |
| `device/device-nameplate.stl` | ABS | Confirm the complete “TrimUI Brick / TG3040” label is legible |
| `device/wire-anchor-set.stl` | ABS | Eight starter rail anchors; repeat or omit only after routing is known |
| `chassis/*.stl` | ABS | Qualified dual-bar common beds reused without geometry changes |

Use 100% scale, supports disabled, and automatic orientation disabled. Follow
the materials and notes in the generated manifest for each artifact.

## Physical acceptance checklist

- The DUT seats without stress and cannot rock or escape the five retainers.
- The bottom audio, TF, and USB-C openings remain usable.
- Side controls, top USB, rear triggers, and rear service area remain clear.
- The active display and useful whole-device context are visible to the C270.
- Carrier and chassis nameplate labels are readable after installation.

Keep the pack marked prototype until the owner records explicit acceptance.

[← Back to the Brick build sheet](index.md)
