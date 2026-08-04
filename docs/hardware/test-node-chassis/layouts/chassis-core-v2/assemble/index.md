# Assemble the chassis

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro" data-layout-id="chassis-core-v2"><strong>Compatible DUT:</strong> TrimUI Smart Pro <span>·</span> <code>chassis-core-v2</code> <span>·</span> 19 steps</p>

Use this chapter at the workbench. It replaces one long assembly page with one
small physical job per page. Open the current step, collect only the parts it
names, compare your work with the picture, and pass the green check before
moving on.

<div class="pf-chapter-meta">
  <span>19 bench steps</span>
  <span>Moderate difficulty</span>
  <span>Mechanical work only</span>
  <span>First-time builder friendly</span>
</div>

!!! danger "Keep the entire build unpowered"
    Leave the power strip unplugged. Do not connect a programmable supply, DUT,
    USB power, battery emulator, or mains input during this chapter.

## See the destination

<figure class="pf-layout-hero">
  <img src="../../../../../assets/generated/test-node-chassis/legacy/qualified-gantry-complete.png" alt="Complete Smart Pro gantry chassis with the inner fixture frame, holder, fixture board, placard, power strip, and stacking tabs visible">
  <figcaption>The static drawings use this operator-side reference: the operator side is closest to you and the device side is farthest away.</figcaption>
</figure>

## Five names you need

You do not need prior experience with aluminum framing. These are the only
special names used in the chapter:

- **Aluminum rail:** one cut length of the 20 mm square material. Suppliers
  often call it *2020 aluminum extrusion*; this guide says *rail*.
- **Long groove:** one channel running along a rail face. Hardware slides
  inside it. A supplier may call it a *T-slot*.
- **Cut end:** either open end of a rail. A sliding nut bar enters through this
  end; it cannot enter through the narrow opening on the rail face.
- **Sliding nut bar:** the orange printed piece with a metal M3 nut already
  installed. The source files call it an *M3 channel bar*.
- **Camera frame:** the smaller movable rectangle inside the outer chassis. The
  CAD source calls it a *gantry*.

The tape labels made in [Cut the aluminum rails](../cut.md) remain on the parts
until assembly is complete. Instructions always give the plain name first and
the short tape code second.

## Read the colors

The drawings and instructions use a small, consistent visual language:

<div class="pf-visual-key">
  <div><span class="pf-key pf-key--orange" aria-hidden="true"></span><span><strong>Orange:</strong> the part being added or positioned now.</span></div>
  <div><span class="pf-key pf-key--blue" aria-hidden="true"></span><span><strong>Blue:</strong> movement, insertion, or a measurement direction.</span></div>
  <div><span class="pf-key pf-key--green" aria-hidden="true"></span><span><strong>Green:</strong> the condition that must be correct before continuing.</span></div>
  <div><span class="pf-key pf-key--black" aria-hidden="true"></span><span><strong>Dark gray:</strong> metal connectors or work already completed.</span></div>
</div>

Color is never the only cue: every colored mark is also named in the adjacent
instruction or caption.

## Before Step 1

- [ ] The complete verified Smart Pro production pack passed the
      [print gate](../../../devices/trimui-smart-pro/print.md#print-gate).
- [ ] All rail pieces passed the [cut gate](../cut.md#cut-gate) and still have
      their plain-language tape labels.
- [ ] The ordinary M3 nuts are already seated in all 28 short sliding nut bars
      and all four long splice bars.
- [ ] The power strip and every source of DUT power are physically separate
      from the work area.
- [ ] A ruler or tape measure, square, and the required hex drivers are within
      reach.

## The 19-step path

<ol class="pf-step-list">
  <li><a href="01-learn-the-rail/"><strong>Learn the rail and nut bar</strong><small>Practice the only hidden interface before loading real frame parts.</small></a></li>
  <li><a href="02-load-width-rails/"><strong>Load the four width rails</strong><small>Place six holder and placard bars in the left-to-right rails.</small></a></li>
  <li><a href="03-load-depth-rails/"><strong>Load the four depth rails</strong><small>Add four gantry bars, four power-strip bars, and four parked spares.</small></a></li>
  <li><a href="04-splice-uprights/"><strong>Splice the camera-frame uprights</strong><small>Join each pair of 164 mm halves into one straight rail.</small></a></li>
  <li><a href="05-load-camera-frame/"><strong>Load the camera-frame rails</strong><small>Add the final 10 bars and account for all 28.</small></a></li>
  <li><a href="06-build-camera-frame/"><strong>Build the camera frame</strong><small>Join the smaller adjustable rectangle while it lies flat.</small></a></li>
  <li><a href="07-lay-out-lower-frame/"><strong>Lay out the lower frame</strong><small>Resolve operator, device, left, and right before adding connectors.</small></a></li>
  <li><a href="08-add-posts/"><strong>Add the four posts</strong><small>Build the open outer frame and leave its top off.</small></a></li>
  <li><a href="09-lower-camera-frame/"><strong>Lower the camera frame inside</strong><small>Capture the complete inner frame before the outer top closes.</small></a></li>
  <li><a href="10-set-camera-frame/"><strong>Seat and position the camera frame</strong><small>Engage both lower joint plates and set the 75 mm datum.</small></a></li>
  <li><a href="11-close-outer-frame/"><strong>Close the outer frame</strong><small>Assemble and lower the complete top ring without forcing a corner.</small></a></li>
  <li><a href="12-square-frame/"><strong>Square and tighten the frame</strong><small>Match both pairs of diagonals before final tightening.</small></a></li>
  <li><a href="13-mount-dut-holder/"><strong>Mount the DUT holder</strong><small>Keep the short upper and long lower links in the right places.</small></a></li>
  <li><a href="14-mount-electronics-plate/"><strong>Mount the electronics plate</strong><small>Use all four spacers and keep the plate untwisted.</small></a></li>
  <li><a href="15-aim-camera/"><strong>Aim the camera toward the DUT</strong><small>Check the optical direction without powering the DUT.</small></a></li>
  <li><a href="16-add-placard/"><strong>Add the node placard</strong><small>Mount the holder where the operator can read and service it.</small></a></li>
  <li><a href="17-mount-power-strip/"><strong>Mount the unplugged power strip</strong><small>Fit its wall-mount keyholes without drilling the enclosure.</small></a></li>
  <li><a href="18-add-stacking-tabs/"><strong>Add the stacking tabs</strong><small>Install two guides at every upper corner.</small></a></li>
  <li><a href="19-final-check/"><strong>Compare the finished chassis</strong><small>Catch a missing part or reversed assembly before formal verification.</small></a></li>
</ol>

After Step 19, continue to the [formal build verification](../verify.md).

<nav class="pf-step-nav" aria-label="Assembly chapter navigation">
  <a href="../cut/">← Back: Cut the rails</a>
  <span>Assembly · 19 steps</span>
  <a href="01-learn-the-rail/">Begin Step 1 →</a>
</nav>
