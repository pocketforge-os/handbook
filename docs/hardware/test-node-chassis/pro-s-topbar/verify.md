# Verify the Smart Pro S top-bar candidate

Keep the DUT, fixture electronics, programmable supply, and power strip
unpowered. Connecting only the Logitech C270 to a safe viewing computer is
permitted for the camera-framing gate.

## 1. Source and inventory

- [ ] The pack verifies against the clean source revision recorded in its
      manifest.
- [ ] The manifest says `production_eligible=false` and
      `nonproduction_reasons=["layout_unqualified"]`.
- [ ] One continuous 306 mm top bar and exactly two metal L-connectors are
      installed.
- [ ] Two upper hangers and two lower backstays are installed.
- [ ] All 12 active and six parked channel bars are accounted for.
- [ ] No legacy upright, splice, collar, gantry plate, fixture spacer, or
      second crossbar entered this build.

## 2. Joint fit and fasteners

- [ ] Both 16 × 6.43 mm hanger keys seat fully without forcing or slot-mouth
      wobble.
- [ ] Every captive M3 nut remains flat and every hanger screw has full metal
      thread engagement.
- [ ] Each upper joint is a flat 2.5 + 2.5 mm complementary lap through the
      unchanged upper plate slot.
- [ ] Both lower joints use the unchanged lower plate slots.
- [ ] All four through-fasteners fully engage their metal locknuts; washers
      bear on printed material without crushing it.
- [ ] No printed joint shows whitening, cracking, lifted layers, or forced
      misalignment.

## 3. Loaded stability

Install the real, unpowered fixture-board load. Record its mass and measure
the same plate datum before loading, immediately after loading, and after the
agreed observation interval.

| Record | Value |
| --- | --- |
| Source commit and pack manifest SHA-256 | |
| Fixture-board load | |
| Unloaded plate datum | |
| Initial loaded datum / sag | |
| End-of-interval datum / residual movement | |
| Observation interval | |

- [ ] Both hangers remain seated and both locknuts remain tight.
- [ ] Gentle operator-to-device pressure does not produce unacceptable
      swing, racking, or a persistent twist.
- [ ] Removing the load leaves no unexpected residual displacement.
- [ ] No joint shows creep, layer separation, cracking, or whitening.

This candidate deliberately has no invented fleet tolerance. Record the
measurements and obtain the owner's explicit fit/rigidity decision under
`tsp-t1zd.2`.

## 4. Adjustment and service clearance

1. Mark the accepted 75 mm top-bar position.
2. Loosen both metal L-connectors.
3. Move the complete bar through the required Y adjustment range without
   skewing it.
4. Restore the mark, square the bar, and retighten both connectors.

- [ ] The bar moves only when loosened and locks squarely.
- [ ] Hangers, backstays, and fasteners clear every fixture component and
      connector.
- [ ] Harness service corridors, DUT-holder access, placard, power-strip
      mount, and stacking hardware remain unobstructed.

## 5. Camera framing

- [ ] The complete Smart Pro S body is visible with margin on all four sides.
- [ ] The screen is centered and not keystoned by a twisted plate.
- [ ] The camera mount and cable do not touch the DUT holder.
- [ ] Returning the top bar to its recorded position reproduces the framing.

## 6. Acceptance and later promotion

Record operator-side, device-side, suspension-detail, and camera-framing
images with the exact source commit and candidate normalized fingerprints.
The owner must explicitly accept fit, thread engagement, loaded stability,
service clearance, adjustment, and camera framing.

Only a later reviewed change may update `chassis-topbar-v1` from candidate to
physically qualified, and that promotion may name only the exact accepted
fingerprints. It must create a new versioned print-pack release lane. Never
rewrite or republish immutable `print-pack-trimui-smart-pro-family-v1`.

Until that change merges, this chassis remains a repeatable prototype—not a
production-qualified test node.

Back: [Smart Pro S top-bar route](index.md).
