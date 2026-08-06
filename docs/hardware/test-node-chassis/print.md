# Choose a device before generating prints

This former unscoped print URL is now a safety stop. The exact DUT must select
its source layout, qualification state, printable artifacts, and matching
assembly chapter before the browser generator runs.

Start at [Choose the device for this test node](index.md), open its build
sheet, and use the profile-specific print page linked there.

## Common fixture prints in every complete pack

Every device-selected **Complete chassis** pack contains these three common
outputs in addition to its device holder and other chassis beds:

| Output | Material and process | Purpose / hardware |
| --- | --- | --- |
| `fixture/dut-fixture-fit-coupon.stl` | PETG; follow the manifest | Print first to verify the printer-specific pilot holes, tie slots, frame slot, and camera opening |
| `fixture/dut-fixture-plate.stl` | PETG; follow the manifest | The canonical unpopulated electronics mounting tray |
| `chassis/dual-usb-c-interrupter-rail-bracket.stl` | ABS chassis process; broad rail-contact face down; 100% infill; supports off; automatic orientation off | One holder for two interrupter boards; supply four M1.7 × 6 mm self-tappers plus two M3 screws and drop-in T-nuts |

The plate STL contains mounting geometry only. The BPI, USB hubs,
relay/interrupter, DP100, camera, wiring, cable ties, screws, and other
fasteners are separately supplied hardware; they are not embedded in the
print. Coupon and retrofit packs assume that an existing fixture and
interrupter holder stay in service, so they do not duplicate these three
full-build outputs.
