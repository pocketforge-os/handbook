# Choose a device before generating prints

This former unscoped print URL is now a safety stop. The exact DUT must select
its source layout, qualification state, printable artifacts, and matching
assembly chapter before the browser generator runs.

Start at [Choose the device for this test node](index.md), open its build
sheet, and use the profile-specific print page linked there.

## Common fixture prints in every complete pack

Every device-selected **Complete chassis** pack contains these two common
PETG fixture outputs in addition to its holder and chassis beds:

| Output | Purpose |
| --- | --- |
| `fixture/dut-fixture-fit-coupon.stl` | Print first to verify the printer-specific pilot holes, tie slots, frame slot, and camera opening |
| `fixture/dut-fixture-plate.stl` | The canonical unpopulated electronics mounting tray |

The plate STL contains mounting geometry only. The BPI, USB hubs,
relay/interrupter, DP100, camera, wiring, cable ties, screws, and other
fasteners are separately supplied hardware; they are not embedded in the
print. Coupon and retrofit packs assume that an existing fixture stays in
service, so they do not duplicate these two full-build outputs.
