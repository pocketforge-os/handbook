# Assemble the Smart Pro S top-bar delta

This page replaces only the gantry-specific portions of the qualified 19-step
route. Keep the entire build unpowered.

![Installed top-bar suspension detail](../../../assets/generated/test-node-chassis/topbar/layout-suspension-detail.png)

## Variant hardware

Collect:

- one continuous 306 mm `TOPBAR`;
- two accepted 26 × 26 × 9.5 mm concealed metal L-connectors and their
  supplied set screws;
- two keyed upper hangers and two lower backstays;
- 18 short channel bars with seated metal M3 nuts;
- two M3 × 12 mm hanger-to-rail screws with wide washers; and
- four M3 through-fasteners, eight wide washers, and four metal locknuts for
  the two upper and two lower plate joints.

For each through-joint, use the shortest stocked M3 screw that fully engages
the locknut without colliding with electronics or cables. Record that length
during physical qualification; do not force a too-short screw or leave a
loose joint.

Do not collect gantry upright halves, long splice bars, splice collars,
camera-frame joint plates, four plate spacers, or a second fixture crossbar.

## 1. Preload before closing rail ends

1. Use the qualified [rail practice](../assemble/01-learn-the-rail.md).
2. Load the 10 width-rail bars exactly as shown in
   [Step 2](../assemble/02-load-width-rails.md).
3. Put one blue-tagged parked bar in the inward groove of each 318 mm depth
   rail: four parked bars total. There is no loose camera-frame bar beside it.
4. Orient the top bar left to right with its loaded groove facing the
   operator. Load two active bars at the fixture plate's upper-slot X
   positions and park one blue-tagged spare near each end.
5. Count all 18 bars before any three-way or L-connector blocks a cut end:
   10 active width, 2 active top-bar, 4 parked depth, and 2 parked top-bar.

## 2. Build the unchanged outer frame

Follow qualified Steps [7](../assemble/07-lay-out-lower-frame.md) and
[8](../assemble/08-add-posts.md). Skip Steps 4–6 and 9–10; they build and
install the retired inner gantry.

Assemble the upper outer ring as in
[Step 11](../assemble/11-close-outer-frame.md), but add the top bar before
lowering the ring onto the posts:

1. Place one concealed L-connector at each end of the top bar, using the lower
   grooves of the top bar and upper depth rails.
2. Keep the bar continuous and square between the two upper depth rails.
3. Set its centerline **75 mm from the operator-side outside plane**.
4. Confirm the loaded groove faces the operator and both active hanger bars
   remain accessible.
5. Tighten the two metal connectors evenly. They carry the bar; no printed
   part joins it to the outer frame.
6. Close the outer frame, then complete
   [Step 12](../assemble/12-square-frame.md).

## 3. Install the unchanged DUT holder

Install the verified Smart Pro S holder pack using
[Step 13](../assemble/13-mount-dut-holder.md). The carrier links and shared
optical axis are unchanged.

## 4. Hang and brace the fixture plate

At each left/right side:

1. Turn the fixture plate so its components face the operator and the Logitech
   C270 lens points toward the DUT.
2. Seat one upper hanger's 16 × 6.43 mm key in the top bar's operator-facing
   groove. Move an active captive bar under its round hole and clamp it with
   an M3 × 12 mm screw and wide washer.
3. Bring the hanger's reduced **2.5 mm lower lap** against the plate's existing
   upper slot.
4. Flip one lower backstay from its print orientation. Put its reduced
   **2.5 mm upper lap** on the rail-side half of that same upper joint.
5. Clamp the hanger lap, unchanged plate slot, and complementary backstay lap
   with one through-fastener, wide washers, and a metal locknut. The two
   printed halves must reconstruct one flat **2.5 + 2.5 mm = 5 mm** strap.
6. Clamp the backstay's lower round hole through the plate's existing lower
   slot with the same washer-and-locknut arrangement.
7. Repeat on the other side. Leave all four plate joints just loose enough to
   remove twist, then tighten them evenly by hand.

Both upper hangers carry the plate. Both lower backstays must be installed;
they turn the two upper pivots into full-height straps and prevent swing and
racking.

## 5. Align and finish the shared chassis

1. Confirm the top-bar centerline remains at 75 mm and the plate lies flat on
   the unchanged fixture plane.
2. Loosen both metal L-connectors together to adjust the complete top bar in Y.
   Retighten it square; never twist one side ahead of the other.
3. Use the plate slots only for final centering. Keep every lap flat and every
   key seated.
4. Add the shared placard, unplugged power strip, and stacking tabs with
   qualified Steps [16](../assemble/16-add-placard.md),
   [17](../assemble/17-mount-power-strip.md), and
   [18](../assemble/18-add-stacking-tabs.md).
5. Compare the result with the candidate assembly image at the top of this
   route—not the qualified gantry's Step 19 image.

!!! warning "Do not route around a collision"
    A backstay, fastener, or top bar must not press on a fixture component,
    connector, camera cable, DUT holder, placard, or stacking interface.
    Correct the mechanical position before adding harness wiring.

Next: [verify and record the candidate](verify.md).
