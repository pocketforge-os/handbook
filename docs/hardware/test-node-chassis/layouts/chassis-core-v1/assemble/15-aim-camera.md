---
hide:
  - toc
---

# 15. Aim the camera toward the DUT

<p class="pf-step-count">Assembly · Step 15 of 19</p>

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro" data-layout-id="chassis-core-v1"><strong>Compatible DUT:</strong> TrimUI Smart Pro <span>·</span> <code>chassis-core-v1</code></p>

Use the mechanical centerlines to catch a reversed or badly offset camera
before wiring. The DUT remains unpowered.

<div class="pf-step-layout" markdown="1">
<div class="pf-step-visual">
  <figure>
    <img src="../../../../../../assets/generated/test-node-chassis/legacy/detail-07-optical-axis.png" alt="Blue webcam field-of-view cone extending from the electronics plate to surround the complete DUT on the opposite holder">
    <figcaption>The lens starts at the electronics fixture. The blue field-of-view cone must end around the complete device—not at the back of its holder.</figcaption>
  </figure>
</div>
<div class="pf-step-copy" markdown="1">

## Get these parts

<ul class="pf-part-list">
  <li><span class="pf-key pf-key--black" aria-hidden="true"></span><span><strong>No new hardware</strong><small>Use the installed camera, fixture plate, and DUT holder</small></span></li>
  <li><span class="pf-key pf-key--blue" aria-hidden="true"></span><span><strong>Ruler or tape measure</strong><small>For the X and Y centerline checks</small></span></li>
</ul>

## Do this

1. Stand on the operator side and look through the chassis.
2. Confirm the camera lens faces the DUT holder, not the operator.
3. Confirm the DUT holder's hooks face the camera and operator.
4. Measure the DUT holder center: it should remain at **X = 173 mm**.
5. Confirm the electronics plate is centered on that same left-to-right line.
6. Measure the camera-frame upright centerline: it should remain **75 mm** from
   the operator-side outside face.
7. Sight from the camera lens toward the center of the holder. Correct any
   obvious left/right or up/down offset by loosening only the appropriate
   mechanical adjustment.
8. Retighten the adjusted fasteners and confirm the fixture plate remains flat.

!!! note "Live framing happens in verification"
    The formal camera image check connects only the Logitech C270 to a safe
    viewing computer. Do not power the DUT to aim the camera.

</div>
</div>

<div class="pf-step-check" markdown="1">

**Before you continue:** the camera, fixture center, and DUT-holder center share
one sight line; the lens faces the device; and no cable, plate, or rail blocks
that line.

</div>

<nav class="pf-step-nav" aria-label="Assembly step navigation">
  <a href="../14-mount-electronics-plate/">← Electronics plate</a>
  <span>Step 15 of 19</span>
  <a href="../16-add-placard/">Next: Node placard →</a>
</nav>
