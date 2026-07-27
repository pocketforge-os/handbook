# Generate and print the Smart Pro S candidate

Generate the complete device-selected pack from a clean
`pocketforge-os/test-node-hw` checkout. Do not download loose STLs from a
previous build directory or substitute the qualified gantry's Batches 01–03.

```sh
python3 mechanical/device-packs/build_device_pack.py build \
  --device trimui-smart-pro-s \
  --mode full \
  --allow-unqualified

python3 mechanical/device-packs/build_device_pack.py verify \
  --pack mechanical/device-packs/build/trimui-smart-pro-s/full
```

The device slug automatically selects `chassis-topbar-v1`. The explicit
override permits prototype generation; it does not qualify the result. Before
slicing, inspect `manifest.json` and confirm:

- `production_eligible` is `false`;
- `nonproduction_reasons` is exactly `["layout_unqualified"]`;
- the selected layout is `chassis-topbar-v1`; and
- `layout.qualification.acceptance_ref` is `tsp-t1zd.2`.

Stop if any value differs.

## Candidate chassis beds

Use the [shared ABS slicer contract](../print.md#slicer-contract): 100% scale,
supports disabled, and automatic orientation/arrangement disabled.

| Pack output | Expected chassis contents | Special handling |
| --- | --- | --- |
| `calibration/chassis-process-calibration.stl` | Rail-key, channel-bar, and placard coupons | Conditional after process, printer, material, nozzle, or extrusion changes |
| `chassis/core-01-ironed-interfaces.stl` | 18 short M3 channel bars | Iron topmost surfaces |
| `chassis/core-02-upper-hangers.stl` | Two keyed upper hangers | Print exported keyed faces upward |
| `chassis/core-03-lower-backstays.stl` | Two 244 mm lower backstays | Keep the exported 244 mm axis on the 247 mm bed axis |
| `chassis/core-04-frame-hardware.stl` | Shared stacking, placard, and power-strip hardware | Identical normalized geometry to the qualified layout |
| `chassis/core-05-placard-holder.stl` | Shared reusable placard holder | Identical normalized geometry to the qualified layout |

![Two upper hangers in their support-free exported orientation](../../../assets/generated/test-node-chassis/topbar/layout-upper-hangers.png)

![Two 244 mm lower backstays aligned to the long bed axis](../../../assets/generated/test-node-chassis/topbar/layout-lower-backstays.png)

The same verified pack also contains the selected Smart Pro S carrier, six
J-hooks, fit coupon, four carrier links, device nameplate, and eight starter
wire anchors. Print only the fit-bearing holder geometry already accepted for
the Smart Pro family; the chassis layout remains the candidate in this pack.

## Prepare and account for all 18 channel bars

Seat one ordinary metal M3 nut in every short bar using the pull-tool method
from [Prepare the captive nuts](../print.md#prepare-the-captive-nuts). Do not
glue, hammer, melt, or encapsulate a nut.

![Top-bar preload map](../../../assets/generated/test-node-chassis/topbar/layout-preload.png)

The exact inventory is **12 active + 6 parked = 18**:

| Destination | Active | Parked with blue tape |
| --- | ---: | ---: |
| Four outer width rails | 10 | 0 |
| Four outer depth rails | 0 | 4 |
| Continuous top bar | 2 | 2 |
| **Total** | **12** | **6** |

Load the 10 width-rail bars with the exact
[qualified width-rail map](../assemble/02-load-width-rails.md#load-this-exact-count).
Put one blue-tagged parked spare in the inward groove of each depth rail; do
not add the qualified gantry route's four untagged camera-frame bars. Load two
active and two blue-tagged parked bars into the top bar's operator-facing
groove before either cut end is blocked.

## Print gate

- [ ] Pack verification passes against the same clean source checkout.
- [ ] The manifest remains non-production with only `layout_unqualified`.
- [ ] Every bed stayed at 100% scale in its exported support-free orientation.
- [ ] Batch 01 contains 18 short bars and no long splice bars.
- [ ] Batch 02 contains exactly two keyed upper hangers.
- [ ] Batch 03 contains exactly two undamaged 244 mm backstays.
- [ ] All 18 captive nuts sit flat and cannot rotate.
- [ ] The preload count balances to 12 active and 6 blue-tagged parked bars.
- [ ] No splice collar, gantry joint plate, or fixture spacer was substituted.

Next: [assemble the top-bar delta](assemble.md).
