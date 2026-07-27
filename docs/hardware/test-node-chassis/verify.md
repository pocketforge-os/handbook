# Verify the build

!!! info "Qualified Smart Pro gantry route"
    This checklist verifies `trimui-smart-pro` / `chassis-core-v1`. Use the
    [top-bar candidate checklist](pro-s-topbar/verify.md) for
    `trimui-smart-pro-s`.

Run every gate with the DUT, power strip, and test-node electronics unpowered.
Correct a failed mechanical gate before wiring anything.

## 1. Inventory and preload

- [ ] Eight metal three-way connectors are installed.
- [ ] Four concealed metal L-connectors secure the camera-frame crossbars.
- [ ] Two splice collars bridge two fully butted 164 mm halves each.
- [ ] Every collar has four aligned screws; no screw bears on aluminum.
- [ ] All 22 use-now compact 18 mm sliding nut carriers are accounted for.
- [ ] Six replacement bars are lightly parked under screws and wide washers.
- [ ] No loose nut or printed bar rattles inside an aluminum rail.

## 2. Frame geometry

- [ ] Outside width is 346 mm.
- [ ] Outside depth is 358 mm.
- [ ] Outside height is approximately 368 mm.
- [ ] Lower-rectangle diagonals match within 2 mm.
- [ ] Upper-rectangle diagonals match within 2 mm.
- [ ] All four posts are plumb.
- [ ] Every horizontal rail is flush against its adjacent post face.
- [ ] The chassis sits without rocking on a flat surface.

If the outside height varies slightly because of connector-cap casting, accept
it only when all four posts match and both rings remain parallel.

## 3. Camera-frame movement

Test one axis at a time:

1. Loosen the eight camera-frame joint screws. Confirm the complete camera
   frame slides along Y without binding, then return its centerline to 75 mm.
2. Retighten the joint screws by hand.
3. Loosen the concealed L-connectors. Confirm both crossbars can move in Z,
   then restore the plate to a flat, untwisted position.
4. Retighten the metal connectors.
5. Loosen the four fixture screws. Confirm the plate can adjust in X, then
   recenter and tighten it.

- [ ] Every axis moves only when its fasteners are loosened.
- [ ] The camera frame stays square through its practical adjustment range.
- [ ] Printed keys remain seated and show no split layers or whitening.

## 4. DUT carrier

- [ ] The carrier is centered at X = 173 mm.
- [ ] Its hooks and device face point toward the operator.
- [ ] Two upper and two lower links all sit flat.
- [ ] The plate cannot swing or rack under gentle hand pressure.
- [ ] The installed device sits clear of rear triggers and ventilation openings.
- [ ] No hook obscures the display.

## 5. Camera framing

Connect only the Logitech C270 to a safe viewing computer if needed; the DUT
itself remains unpowered.

- [ ] The complete handheld body is visible.
- [ ] There is visible space around all four body edges.
- [ ] The screen is centered and not keystoned by a twisted fixture or carrier.
- [ ] The camera mount and cable do not touch the DUT carrier.

The carrier's printed `TOP` and `BOTTOM` orientation text may crop. Complete
DUT visibility with margin is the requirement.

If framing fails, move the complete camera frame in Y first. Use X and Z plate
adjustment only to restore centering.

## 6. Placard, power-strip mount, and stacking

- [ ] The placard reads from the operator side and its cartridge can be
      replaced without removing the holder.
- [ ] The unplugged power strip hangs inside the lower operator rail.
- [ ] Its enclosure is undamaged and no supplied screw bottoms against
      aluminum.
- [ ] It clears the fixture plate and the camera sight line.
- [ ] Two 18 × 92 × 4 mm registration tabs are installed at every upper
      corner, eight total.
- [ ] Every tab is centered on its 20 mm rail face, extends 32 mm above the
      lower chassis, and uses both lower fasteners.
- [ ] The tapered guides accept a second empty chassis without forcing.
- [ ] Aluminum top and bottom faces meet directly when stacked.
- [ ] When two chassis are joined, all eight round upper holes contain one M5
      locking set into the upper chassis's bottom rails.

!!! danger "Provisional stacking limit"
    Until a populated load test establishes a rated stack count, stack no more
    than two populated nodes. Place them on a stable surface and positively
    restrain the stack against tipping. Printed tabs provide lateral
    registration; aluminum carries vertical load.

## 7. Record acceptance

Record:

- the `test-node-hw` source revision used for the STLs;
- printer, nozzle, ABS, layer height, and dimensional compensation;
- measured outside dimensions and paired diagonals;
- one operator-side photo;
- one device-side photo;
- one camera-framing image;
- any deviation from the standard cut list or fastener lengths.

The chassis is ready for the separate electrical test-node integration guide
only after a second person or project owner reviews those records and explicitly
accepts the mechanical build.

Once the harness is defined and the complete node can be disconnected from
every power and data source, continue to
[manage the harness wiring](wire-management.md).
