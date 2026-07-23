# Verify the build

Run every gate with the DUT, power strip, and test-node electronics unpowered.
Correct a failed mechanical gate before wiring anything.

## 1. Inventory and preload

- [ ] Eight metal three-way connectors are installed.
- [ ] Four concealed metal L-connectors secure the gantry crossbars.
- [ ] Two splice collars bridge two fully butted 164 mm halves each.
- [ ] Every collar has four aligned screws; no screw bears on aluminum.
- [ ] All 22 use-now short channel bars are accounted for.
- [ ] Six replacement bars are lightly parked under screws and wide washers.
- [ ] No loose nut or printed bar rattles inside an extrusion.

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

## 3. Gantry movement

Test one axis at a time:

1. Loosen the eight gantry-joint screws. Confirm the complete gantry slides
   along Y without binding, then return its centerline to 75 mm.
2. Retighten the joint screws by hand.
3. Loosen the concealed L-connectors. Confirm both crossbars can move in Z,
   then restore the plate to a flat, untwisted position.
4. Retighten the metal connectors.
5. Loosen the four fixture screws. Confirm the plate can adjust in X, then
   recenter and tighten it.

- [ ] Every axis moves only when its fasteners are loosened.
- [ ] The gantry stays square through its practical adjustment range.
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

If framing fails, move the complete gantry in Y first. Use X and Z plate
adjustment only to restore centering.

## 6. Placard, power-strip mount, and stacking

- [ ] The placard reads from the operator side and its cartridge can be
      replaced without removing the holder.
- [ ] The unplugged power strip hangs inside the lower operator rail.
- [ ] Its enclosure is undamaged and no supplied screw bottoms against
      aluminum.
- [ ] It clears the fixture plate and the camera sight line.
- [ ] Two registration tabs are installed at every upper corner.
- [ ] Their broad lead-ins accept a second empty chassis without forcing.
- [ ] Aluminum top and bottom faces meet directly when stacked.

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
