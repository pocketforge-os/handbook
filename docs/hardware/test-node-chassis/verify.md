# Verify the top-bar chassis candidate

Keep the DUT, fixture electronics, programmable supply, and power strip
unpowered. Connecting only the Logitech C270 to a safe viewing computer is
permitted for the camera-framing gate.

## 1. Source and inventory

- [ ] The pack verifies against the clean source revision recorded in
      `manifest.json`.
- [ ] The manifest says `production_eligible=false` and
      `nonproduction_reasons=["layout_unqualified"]`.
- [ ] It selects device `trimui-smart-pro-s` and layout
      `chassis-topbar-v1`.
- [ ] One continuous 306 mm top bar and exactly two metal L-connectors are
      installed.
- [ ] Two upper hangers and two lower backstays are installed.
- [ ] All 12 active and six parked channel bars are accounted for.
- [ ] Holder, J-hooks, carrier links, and nameplate trace to the same verified
      device pack.

## 2. Frame geometry

- [ ] Outside width is 346 mm.
- [ ] Outside depth is 358 mm.
- [ ] Outside height is approximately 368 mm.
- [ ] Lower-rectangle diagonals differ by no more than 2 mm.
- [ ] Upper-rectangle diagonals differ by no more than 2 mm.
- [ ] All four posts are plumb.
- [ ] Every horizontal rail is flush against its adjacent post face.
- [ ] The chassis sits without rocking on a flat surface.
- [ ] The top-bar centerline is recorded at the accepted operator-side datum.

## 3. Suspension fit and fasteners

- [ ] Both 16 × 6.43 mm hanger keys seat fully without forcing or slot-mouth
      wobble.
- [ ] Every captive M3 nut remains flat and every hanger screw has full metal
      thread engagement.
- [ ] Each upper joint is a flat 2.5 + 2.5 mm complementary lap through the
      fixture board's upper slot.
- [ ] Both lower joints pass through the board's lower slots.
- [ ] All four through-fasteners fully engage their metal locknuts.
- [ ] Washers bear flat without crushing printed material.
- [ ] No printed joint shows whitening, cracking, lifted layers, or forced
      misalignment.
- [ ] Hangers, backstays, rails, and fasteners clear every fixture component,
      connector, and cable corridor.

## 4. Loaded stability

Install the real, unpowered populated fixture-board load. Record its mass and
measure the same board datum before loading, immediately after loading, and
after the agreed observation interval.

| Record | Value |
| --- | --- |
| Source commit and pack manifest SHA-256 | |
| Fixture-board load | |
| Unloaded board datum | |
| Initial loaded datum / sag | |
| End-of-interval datum / residual movement | |
| Observation interval | |

- [ ] Both hangers remain seated and both top-bar connectors remain tight.
- [ ] Gentle operator-to-device pressure does not produce unacceptable swing,
      racking, or persistent twist.
- [ ] Removing the load leaves no unexpected residual displacement.
- [ ] No joint shows creep, layer separation, cracking, or whitening.

This candidate deliberately has no invented fleet tolerance. Record the
measurements and obtain the owner's explicit fit/rigidity decision under
`tsp-t1zd.2`.

## 5. Adjustment and service clearance

1. Mark the accepted top-bar position.
2. Loosen both metal L-connectors.
3. Move the complete bar through the required operator-to-device adjustment
   range without skewing it.
4. Restore the mark, square the bar, and retighten both connectors.

- [ ] The bar moves only when loosened and locks squarely.
- [ ] The fixture-board slots provide the required final centering.
- [ ] Harness service corridors and DUT-holder access remain unobstructed.
- [ ] The placard cartridge, power-strip switch, and stacking hardware remain
      accessible.

## 6. DUT holder and camera framing

- [ ] The holder is centered at X = 173 mm and faces the operator.
- [ ] Two upper and two lower links sit flat.
- [ ] Every J-hook clears controls, ports, vents, speakers, triggers, and the
      display.
- [ ] Gentle hand pressure does not make the holder swing or rack.
- [ ] The complete Smart Pro S body is visible with margin on all four sides.
- [ ] The screen is centered and not keystoned by a twisted fixture board.
- [ ] The C270 mount and cable do not touch the DUT holder.
- [ ] Returning the top bar to its recorded position reproduces the framing.

## 7. Placard, power strip, and stacking

- [ ] The placard reads from the operator side and its cartridge remains
      replaceable.
- [ ] The unplugged power strip hangs inside the operator lower rail without
      enclosure damage or a bottomed screw.
- [ ] Two 18 × 92 × 4 mm registration tabs are installed at every upper
      corner, eight total.
- [ ] Every tab engages 60 mm below the top aluminum surface, extends 32 mm
      above it, and uses both lower fasteners.
- [ ] A second empty chassis enters the guides without forcing.
- [ ] Aluminum top and bottom faces meet directly when stacked.
- [ ] All eight upper locking sets are installed for a joined pair.

!!! danger "Provisional stacking limit"
    Stack no more than two populated nodes until a populated load test records
    a higher rated count. Put the pair on a stable surface and restrain it
    against tipping.

## 8. Record acceptance

Record:

- the exact `test-node-hw` source revision and manifest SHA-256;
- printer, nozzle, ABS, layer height, and dimensional compensation;
- frame dimensions and both paired diagonal measurements;
- hanger/backstay fastener lengths and thread engagement;
- loaded-sag and residual-movement measurements;
- operator-side, device-side, suspension-detail, and camera-framing images;
  and
- any deviation from the generated cut list or device pack.

The owner must explicitly accept fit, thread engagement, loaded stability,
service clearance, adjustment, and camera framing under `tsp-t1zd.2`.
Only a reviewed source change may then promote the exact accepted normalized
fingerprints to a production-qualified layout.

After acceptance and while the node is fully disconnected, continue to
[manage the harness wiring](wire-management.md).
