# Verify the dual-bar chassis build

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1"><strong>Compatible DUT:</strong> TrimUI Smart Pro S <span>·</span> <code>chassis-dualbar-v1</code></p>

Keep the DUT, fixture electronics, programmable supply, and power strip
unpowered. Connecting only the Logitech C270 to a safe viewing computer is
permitted for the camera-framing gate.

## 1. Source and inventory

- [ ] The pack verifies against the clean source revision recorded in
      `manifest.json`.
- [ ] The manifest says `production_eligible=true` with no non-production
      reasons.
- [ ] It selects device `trimui-smart-pro-s` and layout
      `chassis-dualbar-v1`.
- [ ] Two continuous 306 mm fixture bars and exactly four printed
      crossbar-joint plates are installed.
- [ ] Four identical keyed fixture links are installed.
- [ ] All 22 active and six parked channel bars are accounted for.
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
- [ ] Both fixture-bar centerlines are recorded at the same accepted
      operator-side datum.

## 3. Suspension fit and fasteners

- [ ] All four 16 × 6.43 mm link keys seat fully without forcing or slot-mouth
      wobble.
- [ ] Every captive M3 nut remains flat and every link screw has full metal
      thread engagement.
- [ ] Both upper links clamp through the board's upper slots.
- [ ] Both lower links clamp through the board's lower slots.
- [ ] All four through-fasteners fully engage their metal locknuts.
- [ ] Washers bear flat without crushing printed material.
- [ ] No printed joint shows whitening, cracking, lifted layers, or forced
      misalignment.
- [ ] Links, rails, and fasteners clear every fixture component,
      connector, and cable corridor.
- [ ] Each crossbar-joint plate lies on the clear interior horizontal faces:
      lower plates above the lower rails and upper plates below the upper
      rails, with both perpendicular keys fully seated.

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

- [ ] All four links remain seated and all eight crossbar-joint plate screws
      remain tight.
- [ ] Gentle operator-to-device pressure does not produce unacceptable swing,
      racking, or persistent twist.
- [ ] Removing the load leaves no unexpected residual displacement.
- [ ] No joint shows creep, layer separation, cracking, or whitening.

The qualified source deliberately has no invented fleet tolerance. Record the
measurements for this individual build and stop if loaded stability is not
acceptable.

## 5. Adjustment and service clearance

1. Mark the accepted position of both fixture bars.
2. Loosen all eight crossbar-joint plate screws.
3. Move the matched upper/lower pair through the required operator-to-device
   adjustment range without skewing or separating their datums.
4. Restore both marks, square both bars, and retighten all eight plate screws.

- [ ] The bars move only when loosened and lock squarely at one shared datum.
- [ ] All four printed plates return flat with both keys fully seated and no
      whitening, cracking, or crushed material.
- [ ] The fixture-board slots provide the required final centering.
- [ ] Harness service corridors and DUT-holder access remain unobstructed.
- [ ] The placard cartridge, power-strip switch, and stacking hardware remain
      accessible.

## 6. DUT holder and camera framing

- [ ] The holder is centered at X = 173 mm and faces the operator.
- [ ] Two upper and two lower links sit flat.
- [ ] The two upper links measure 91.5 mm, the two lower links measure
      108.5 mm, and all four end 1 mm inside the chassis stack planes.
- [ ] Every J-hook clears controls, ports, vents, speakers, triggers, and the
      display.
- [ ] Gentle hand pressure does not make the holder swing or rack.
- [ ] The complete Smart Pro S body is visible with margin on all four sides.
- [ ] The screen is centered and not keystoned by a twisted fixture board.
- [ ] The C270 mount and cable do not touch the DUT holder.
- [ ] Returning both fixture bars to their recorded positions reproduces the
      framing.

## 7. Placard, power strip, and stacking

- [ ] The placard reads from the operator side and its cartridge remains
      replaceable.
- [ ] The unplugged power strip runs front-to-back inside the lower
      operator-right depth rail without enclosure damage or a bottomed screw.
- [ ] Two 18 × 92 × 4 mm registration tabs are installed at every upper
      corner, eight total.
- [ ] Every tab engages 60 mm below the top aluminum surface, extends 32 mm
      above it, and uses both lower fasteners.
- [ ] Every upper round-hole center sits 17 mm above the top aluminum surface,
      7 mm above the former datum, and clears the metal corner intrusion.
- [ ] A second empty chassis enters the guides without forcing.
- [ ] Aluminum top and bottom faces meet directly when stacked.
- [ ] All eight upper locking sets are installed for a joined pair.

!!! danger "Provisional stacking limit"
    Stack no more than two populated nodes until a populated load test records
    a higher rated count. Put the pair on a stable surface and restrain it
    against tipping.

## 8. Record build verification

Record:

- the exact `test-node-hw` source revision and manifest SHA-256;
- printer, nozzle, ABS, layer height, and dimensional compensation;
- frame dimensions and both paired diagonal measurements;
- fixture-link fastener lengths and thread engagement;
- loaded-sag and residual-movement measurements;
- operator-side, device-side, suspension-detail, and camera-framing images;
  and
- any deviation from the generated cut list or device pack.

The exact source fingerprints were physically accepted under `tsp-t1zd.2`.
Qualification does not waive inspection of a newly printed and assembled
chassis: every check above must pass before it is put into service.

After verification and while the node is fully disconnected, continue to
[manage the harness wiring](wire-management.md).
