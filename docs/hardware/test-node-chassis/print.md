# Generate and print the chassis pack

Generate the complete device-selected pack from a clean
`pocketforge-os/test-node-hw` checkout. Routine STLs are generated, not
committed, so the verified manifest—not a loose download directory—is the
manufacturing handoff.

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
    <noscript>
      <p>
        Browser customization requires JavaScript. Use the generated device
        pack's nameplate, or export one with the pinned source linked below.
      </p>
    </noscript>
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
