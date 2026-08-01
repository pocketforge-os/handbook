---
hide:
  - toc
---

# 17. Align and compare the finished chassis

<p class="pf-step-count">Assembly · Step 17 of 17</p>

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1"><strong>Compatible DUT:</strong> TrimUI Smart Pro S <span>·</span> <code>chassis-dualbar-v1</code></p>

Stop turning frame screws. Align the camera view, disconnect it again, and
compare the complete mechanical build with the source-owned reference before
formal verification.

<div class="pf-step-layout" markdown="1">
<div class="pf-step-visual">
  <figure>
    <img src="../../../../../../assets/generated/test-node-chassis/assembly/assembly-17-final.png" alt="Complete Smart Pro S dual-bar test-node chassis with populated fixture board, DUT holder, placard, lower-right power strip, and eight upper stacking tabs">
    <figcaption>Operator-side reference: fixture board and placard face you, the DUT holder is across the frame, and the unplugged strip runs along the inside right depth rail.</figcaption>
  </figure>
</div>
<div class="pf-step-copy" markdown="1">

## Get these parts

<ul class="pf-part-list">
  <li><span class="pf-part-tag pf-part-tag--assembled">Assembled</span><span><strong>The complete unpowered chassis</strong><small>No new mechanical hardware is added in this step</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--tool">Measure</span><span><strong>Tape measure and square</strong><small>Recheck dimensions, diagonals, post plumb, and fixture-bar datum</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--check">Optional view</span><span><strong>Safe viewing computer for the Logitech C270 only</strong><small>Do not energize the DUT, fixture board, strip, or programmable supply</small></span></li>
</ul>

<div class="pf-picture-key" role="group" aria-label="Finished-chassis picture annotations">
  <p class="pf-picture-key__title">Read the picture</p>
  <ul>
    <li><span class="pf-cue pf-cue--orange">Orange hardware</span><span>Compare the holder, four fixture links, placard supports, power blocks, and eight tabs.</span></li>
    <li><span class="pf-cue pf-cue--charcoal">Installed assemblies</span><span>The populated board, camera, DUT holder, placard, and power strip match the reference orientation.</span></li>
    <li><span class="pf-cue pf-cue--silver">Silver frame</span><span>Four posts, eight outer rails, and two fixture bars are flush, square, and continuous.</span></li>
  </ul>
</div>

## Do this

1. Confirm the upper and lower fixture-bar centerlines remain at the same 75 mm
   operator-side datum and the fixture board lies flat.
2. If operator-to-device adjustment is needed, loosen all four metal
   L-connectors. Move both fixture bars to the same new recorded datum without
   skewing either bar, then square and retighten all four connectors.
3. Use the fixture-board slots only for final left/right centering. Keep every
   printed link flat and every key fully seated.
4. If needed, connect **only** the Logitech C270 to a safe viewing computer.
5. Confirm the complete unpowered Smart Pro S is visible with margin on all
   four sides and its display is not keystoned by a twisted board.
6. Disconnect the camera again and keep every power source separate.

## Compare the build

- [ ] Frame: 4 × 360 mm posts, 4 × 306 mm width rails, and 4 × 318 mm depth
      rails are present and flush.
- [ ] Support: 2 continuous 306 mm fixture bars share one recorded datum and
      use all 4 concealed metal L-connectors.
- [ ] Preload: all 14 active and 6 parked channel bars are accounted for; all
      six parked screws retain blue tags.
- [ ] Geometry: lower and upper diagonal pairs each differ by no more than
      2 mm; all posts are plumb and the chassis does not rock.
- [ ] DUT: the Smart Pro S holder faces the operator, is centered at X =
      173 mm, and uses two correctly marked upper plus two lower links.
- [ ] Fixture: all 4 identical 71.5 mm links are seated and all 4 board slots
      are clamped without a component or cable collision.
- [ ] Accessories: the placard is readable and removable; the unplugged strip
      runs front-to-back inside `DEPTH-R-L`; 8 stacking tabs project 32 mm.
- [ ] Power: the DUT, fixture board, programmable supply, power strip, USB
      power, and all other sources remain disconnected.

</div>
</div>

<div class="pf-step-check" markdown="1">

**Before you continue:** every comparison item matches the reference, both
diagonal pairs pass, the camera is disconnected, and the entire chassis
remains de-energized. The assembly chapter is complete; continue to the formal
candidate gates.

</div>

<nav class="pf-step-nav" aria-label="Assembly step navigation">
  <a href="../16-add-stacking-tabs/">← Stacking tabs</a>
  <span>Step 17 of 17</span>
  <a href="../../verify/">Verify the build →</a>
</nav>
