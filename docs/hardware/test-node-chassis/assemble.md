# Assemble the chassis

Read this page once before turning a screw. The channel bars enter only through
an open extrusion end. After the metal corner connectors close the frame, a
missing bar requires partial disassembly.

!!! danger "Keep the assembly unpowered"
    The power strip remains unplugged. Do not connect a programmable supply,
    DUT, USB power, battery emulator, or mains input during this procedure.

## Inspect the finished chassis

Rotate and zoom the finished assembly before starting. Use it to resolve an
orientation question or inspect where a rail, gantry, carrier, or accessory
lands from another angle.

<script type="module" src="../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<div class="chassis-model-shell">
  <model-viewer
    src="../../../assets/generated/test-node-chassis/pocketforge-test-node.glb"
    poster="../../../assets/generated/test-node-chassis/hero.png"
    alt="Interactive model of the complete PocketForge test-node chassis"
    camera-controls
    touch-action="pan-y"
    shadow-intensity="0.7"
    shadow-softness="0.8"
    exposure="1.0"
    camera-orbit="35deg 68deg 1.05m"
    min-camera-orbit="auto auto 0.55m"
    max-camera-orbit="auto auto 1.7m">
  </model-viewer>
  <span class="chassis-model-help">drag to rotate · scroll to zoom</span>
</div>
<noscript>
  <img
    class="pf-step-render"
    src="../../../assets/generated/test-node-chassis/hero.png"
    alt="Static finished view of the complete PocketForge test-node chassis">
</noscript>

The static finished view remains visible while the model loads or when
interactive 3D is unavailable. The detailed panels below use the same
operator-side and device-side orientation as this model.

Each numbered section begins with its completed state. The close-up panels then
show the interface, direction, or measurement that matters for the next
operation:

- **orange** marks the printed part or assembly being installed;
- **gray** marks aluminum that is already in place;
- **blue arrows** show movement or a measurement direction; and
- **translucent parts** reveal a hidden interface or show where the next
  assembly will land.

## Load the captive channel bars first

The orange part below is one **short channel bar** from Print Batch 01. It can
enter only through an open cut end of the aluminum. Slide it in the arrow
direction before a metal end connector blocks that opening.

![Short channel bar aligned with an open 2020 rail end](../../assets/generated/test-node-chassis/preload-channel-bar.png){ .pf-step-render }

The bar has two deliberately different faces:

- the broad, solid face points outward, toward the slot opening you can see;
- the open pocket and its captured metal M3 nut point inward, toward the
  center of the extrusion.

Thread an M3 screw and wide washer into the nut by one turn while positioning
the bar. The loose screw is a handle and prevents the bar from disappearing
down the channel.

### Read the whole-frame map { #preload-map }

Stand on the operator side and look toward the device side. In the overview
below the rail is translucent and each marker is drawn just outside its slot
so it remains visible. The real channel bars stay inside the aluminum.

![Color-coded whole-frame channel-bar preload map](../../assets/generated/test-node-chassis/preload-map.png){ .pf-step-render }

- <span class="pf-map-swatch pf-map-active"></span> **Orange:** a bar that
  receives a mount screw during this build.
- <span class="pf-map-swatch pf-map-spare"></span> **Blue:** a replacement bar
  parked in that same rail for future service.

A **slot face** means one complete side of a rail—the side whose long slot
opening you can see. It does not mean the left or right internal wall inside
that slot.

Load this exact inventory before installing an end connector:

| Rail | Slot face to load | Use now | Parked spare | What the use-now bars hold |
| --- | --- | ---: | ---: | --- |
| `WIDTH-O-L` | Device-facing/inboard | 4 | 0 | Two power-strip blocks |
| `WIDTH-O-U` | Operator-facing/outboard | 2 | 0 | Placard risers |
| `WIDTH-D-L` | Operator-facing/inboard | 2 | 0 | Lower DUT-carrier links |
| `WIDTH-D-U` | Operator-facing/inboard | 2 | 0 | Upper DUT-carrier links |
| `DEPTH-L-L` | Chassis-interior-facing | 1 | 1 | Lower-left gantry joint |
| `DEPTH-L-U` | Chassis-interior-facing | 1 | 1 | Upper-left gantry joint |
| `DEPTH-R-L` | Chassis-interior-facing | 1 | 1 | Lower-right gantry joint |
| `DEPTH-R-U` | Chassis-interior-facing | 1 | 1 | Upper-right gantry joint |
| Left gantry upright | Right/interior-facing | 2 | 0 | Upper and lower gantry joints |
| Right gantry upright | Left/interior-facing | 2 | 0 | Upper and lower gantry joints |
| `GANTRY-CROSS-L` | Operator-facing | 2 | 1 | Fixture plate |
| `GANTRY-CROSS-U` | Operator-facing | 2 | 1 | Fixture plate |

### Park the six blue spares

The six spares are not extra loose parts. They are deliberately stored inside
rails that would otherwise require frame disassembly to reload:

1. Slide one spare toward the device-side end of each of the four depth rails.
   Leave visible clearance between the bar and the metal connector tongue.
2. Slide one spare to the far left of the upper gantry crossbar.
3. Slide one spare to the far right of the lower gantry crossbar.
4. Put an otherwise unused M3 screw and wide washer into each spare and tighten
   only until the washer keeps it from sliding or rattling.

Before closing the first rail end, count **28 short bars total**:

- **22 use-now bars** at the orange positions; and
- **6 parked replacement bars** at the blue positions.

If the total is not 28, stop. A missing bar is easy to correct now and requires
partial disassembly after the frame is closed.

## 1. Splice the two gantry uprights

![Two spliced gantry uprights](../../assets/generated/test-node-chassis/step-01-splice-uprights.png){ .pf-step-render }

<div class="pf-build-panels">
  <figure class="pf-build-panel pf-build-panel--wide">
    <img src="../../../assets/generated/test-node-chassis/detail-01-splice-xray.png" alt="Transparent x-ray of a gantry splice with opposed captive bars bridging the aluminum butt seam">
    <figcaption><strong>Correct hidden layout.</strong> The two 164 mm rail halves butt at the center. One orange double-nut bar occupies each of two opposed channels, and the blue collar bridges the same seam. After sliding the collar, 40 mm of every splice part lies on each side of the joint.</figcaption>
  </figure>
</div>

Repeat this sequence for the left and right uprights:

1. Select two labeled 164 mm halves, one collar, and two long double-nut bars.
2. Slide the collar completely onto the first half. Its internal pusher-key end
   points into that rail; the opposite collar end finishes flush with the
   future aluminum butt seam.
3. At the open seam, insert one long bar into each of the two opposed keyed
   channels. Insert the **unmarked 12.8 mm end first**.
4. Push each bar until it stops against the collar pusher. Its
   **one-scallop 16 mm end** now finishes at the seam.
5. Butt the second 164 mm half squarely against the first.
6. Slide the collar 40 mm across the seam. Its pusher moves both internal bars,
   centering the collar and bars 40 mm into each half.
7. Confirm all four collar holes align with captive nuts before inserting a
   screw.
8. Install four M3 × 12 mm screws and wide washers. Tighten evenly by hand.
9. Confirm the two cuts remain fully butted and the completed upright is
   straight.

Do not drive a screw into aluminum or use a screw long enough to bottom against
the extrusion web.

## 2. Build the movable gantry flat

![Complete movable gantry](../../assets/generated/test-node-chassis/step-02-build-gantry.png){ .pf-step-render }

<div class="pf-build-panels">
  <figure class="pf-build-panel pf-build-panel--wide">
    <img src="../../../assets/generated/test-node-chassis/detail-02-crossbar-corner.png" alt="Transparent gantry corner exposing the concealed metal L connector">
    <figcaption><strong>One of four identical corners.</strong> The black metal L-connector is concealed inside the upright and crossbar. The populated long slot of each crossbar must face the operator before this joint is tightened.</figcaption>
  </figure>
</div>

1. Preload two use-now short bars into the interior-facing slot of each completed
   upright.
2. Preload two use-now bars and one parked spare into the operator-facing slot
   of each 306 mm crossbar.
3. Insert the four concealed metal L-connectors while the rail ends remain
   open.
4. Join the lower and upper crossbars between the two uprights.
5. Orient each crossbar's populated slot toward the operator.
6. Keep the connector screws loose enough that the crossbars can still slide
   vertically.
7. Loosely attach one printed gantry joint plate at each upright end. Its
   vertical key enters the upright slot; its perpendicular key will later
   enter an outer depth-rail slot.
8. Check the gantry is rectangular and can be adjusted without binding.

## 3. Preload the outer rails and open the frame

![Lower frame and four posts](../../assets/generated/test-node-chassis/step-03-open-frame.png){ .pf-step-render }

<div class="pf-build-panels">
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-03-lower-frame-layout.png" alt="Top-down lower frame map with operator, device, left, and right rail names">
    <figcaption><strong>Lay out the lower rectangle first.</strong> Stand at the blue <em>OPERATOR</em> edge and look toward <em>DEVICE / WALL</em>. The rail names in this view are the names used below and in the preload map.</figcaption>
  </figure>
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-03-flush-corner.png" alt="Close-up of two lower rails butting flush against adjacent faces of a vertical post">
    <figcaption><strong>Every outer corner uses this topology.</strong> Each horizontal rail ends flush against one face of the post. The two horizontal rails never overlap one another.</figcaption>
  </figure>
</div>

1. Load all 14 use-now outer-frame bars and all four depth-rail spares exactly
   as shown in the [preload map](#preload-map).
2. Thread a screw and washer one turn into every bar so none can escape or
   silently change position.
3. Arrange the lower rectangle:
   `WIDTH-O-L`, `DEPTH-L-L`, `WIDTH-D-L`, `DEPTH-R-L`.
4. Confirm the operator/device and left/right labels before installing
   connectors.
5. Install the four lower three-way connectors and four posts according to the
   connector manufacturer's mechanical interface.
6. Bring the lower rails flush to their adjacent post faces. The width and
   depth rails meet the post; they do not overlap one another.
7. Snug the metal connector screws, but leave final squaring for Step 5.

## 4. Put the gantry inside the open frame

![Movable gantry inside the open frame](../../assets/generated/test-node-chassis/step-04-install-gantry.png){ .pf-step-render }

The top must still be open.

<div class="pf-build-panels">
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-04-lower-gantry.png" alt="Complete movable gantry lowering between four open frame posts">
    <figcaption><strong>Lower the complete gantry as one unit.</strong> The four posts are already installed, but the upper ring is still absent. The gantry cannot be inserted after that ring closes the frame.</figcaption>
  </figure>
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-04-joint-plate.png" alt="Transparent close-up showing a keyed gantry joint plate between a depth rail and gantry upright">
    <figcaption><strong>Seat both keys.</strong> One orange key enters the vertical gantry-upright slot; the perpendicular key enters the outer depth-rail slot. The plate lies flat only when both are engaged.</figcaption>
  </figure>
  <figure class="pf-build-panel pf-build-panel--wide">
    <img src="../../../assets/generated/test-node-chassis/detail-04-gantry-position.png" alt="Top-down dimension from the operator frame plane to the movable gantry centerline">
    <figcaption><strong>Set the initial gantry datum.</strong> Measure 75 mm inward from the operator-side outside frame plane to the centerline of either gantry upright. The gantry may move later during optical alignment.</figcaption>
  </figure>
</div>

1. Lower the complete gantry between the four posts.
2. Align the lower gantry-joint keys with the interior-facing slots of
   `DEPTH-L-L` and `DEPTH-R-L`.
3. Align each plate's outer-rail hole with the use-now channel bar preloaded in
   that depth rail.
4. Install the two lower outer-rail screws and washers loosely.
5. Move the gantry to **Y = 75 mm**, measured from the operator-side outside
   frame plane to the gantry upright centerline.
6. Slide the upper joint plates near the future top-rail height. Keep them
   loose.

The gantry must already be captive inside the four posts before the top ring is
installed.

## 5. Close and square the frame

![Closed frame with installed gantry](../../assets/generated/test-node-chassis/step-05-close-frame.png){ .pf-step-render }

<div class="pf-build-panels">
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-05-lower-top-ring.png" alt="Assembled upper ring lowering onto four vertical frame posts">
    <figcaption><strong>Close the frame with one assembled ring.</strong> Keep the gantry captive below it, align all four post ends together, then lower the ring without forcing a corner.</figcaption>
  </figure>
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-05-square-diagonals.png" alt="Top-down frame with two crossing corner-to-corner diagonal measurements">
    <figcaption><strong>Square by comparing diagonals.</strong> Measure corner to opposite corner along A and B. Shift the loose frame until the values differ by no more than 2 mm, then tighten in a cross pattern.</figcaption>
  </figure>
</div>

1. Arrange the upper rails:
   `WIDTH-O-U`, `DEPTH-L-U`, `WIDTH-D-U`, `DEPTH-R-U`.
2. Confirm their preloaded bars are still in the specified slot faces.
3. Install the four upper three-way connectors and lower the upper ring onto
   the posts.
4. Bring every horizontal rail flush to its adjacent post face.
5. Align and loosely fasten the two upper gantry joint plates to their use-now
   depth-rail bars.
6. Verify the nominal outside envelope:
   346 mm wide × 358 mm deep × approximately 368 mm tall.
7. Measure both diagonals on the lower rectangle. Adjust until the two values
   match within 2 mm.
8. Repeat for the upper rectangle.
9. Confirm all four posts are plumb with a square.
10. Tighten opposite corners in a cross pattern, returning to recheck the
    diagonals after each pass.
11. Tighten the eight gantry-joint screws by hand. The printed plates position
    the gantry; they are not the stacking load path.

## 6. Mount the DUT carrier

![DUT carrier on the device-side rails](../../assets/generated/test-node-chassis/step-06-mount-carrier.png){ .pf-step-render }

<div class="pf-build-panels">
  <figure class="pf-build-panel pf-build-panel--wide">
    <img src="../../../assets/generated/test-node-chassis/detail-06-carrier-link-lengths.png" alt="Upper and lower DUT carrier links shown separately with their lengths">
    <figcaption><strong>Do not swap the links.</strong> Use the two shorter 97.5 mm links at the upper rail and the two longer 114.5 mm links at the lower rail. The round keyed hole goes to the aluminum; the adjustable slot goes to the carrier.</figcaption>
  </figure>
</div>

1. Identify the two 97.5 mm upper links and two 114.5 mm lower links.
2. Loosely attach the slotted end of each link to the matching corner slot in
   the device-specific carrier.
3. Face the carrier's hooks and DUT toward the operator side.
4. Present the carrier to the operator-facing slots of `WIDTH-D-U` and
   `WIDTH-D-L`.
5. Align each keyed rail end with one of the four active preloaded bars.
6. Fasten the upper links to `WIDTH-D-U` and lower links to `WIDTH-D-L`.
7. Center the carrier at **X = 173 mm**.
8. Adjust the link slots until the carrier sits flat and its screen center lies
   on the chassis optical axis.
9. Tighten the four rail screws and four carrier-joint screws evenly by hand.

## 7. Mount the electronics fixture

![Electronics and webcam fixture on the gantry](../../assets/generated/test-node-chassis/step-07-mount-fixture.png){ .pf-step-render }

<div class="pf-build-panels">
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-07-fixture-spacers.png" alt="Exploded electronics fixture plate with four keyed spacers between the plate and gantry crossbars">
    <figcaption><strong>Use all four 5 mm spacers.</strong> One keyed orange spacer sits between each fixture-plate corner slot and its gantry crossbar. Its key enters the aluminum slot; its flat face supports the plate.</figcaption>
  </figure>
  <figure class="pf-build-panel">
    <img src="../../../assets/generated/test-node-chassis/detail-07-optical-axis.png" alt="Webcam field of view traveling from the electronics fixture to the DUT carrier">
    <figcaption><strong>Point the camera toward the DUT.</strong> The C270 lens starts at the electronics fixture, and the blue field-of-view cone must terminate around the complete device—not the back of its carrier.</figcaption>
  </figure>
</div>

1. Face the component side of the fixture plate toward the operator.
2. Confirm the Logitech C270 lens points through the frame toward the DUT.
3. Place one 5 mm keyed spacer between each fixture slot and crossbar.
4. Align the four active crossbar bars with the plate's corner mounting slots.
5. Install four M3 × 12 mm screws and wide washers loosely.
6. Slide the crossbars vertically until all four spacers sit flat and the
   fixture is not twisted.
7. Center the fixture in X, then tighten its four screws.
8. Reconfirm the gantry centerline remains at Y = 75 mm.

Do not route power or USB cables yet.

## 8. Add the frame hardware

![Complete mechanical chassis](../../assets/generated/test-node-chassis/step-08-complete.png){ .pf-step-render }

### Placard

<div class="pf-build-panels">
  <figure class="pf-build-panel pf-build-panel--wide">
    <img src="../../../assets/generated/test-node-chassis/detail-08-placard.png" alt="Device-name cartridge sliding from the right into a placard holder below the upper operator rail">
    <figcaption><strong>Mount below the operator-side upper rail.</strong> The dark-blue holder hangs from two orange risers. Slide the yellow name cartridge from the right, in the blue-arrow direction, until its stop reaches the holder.</figcaption>
  </figure>
</div>

1. Use the two use-now bars in the operator-facing slot of `WIDTH-O-U`.
2. Install the keyed spacers against the rail and the two risers below it.
3. Fasten the 230 mm holder to the risers with its countersunk holes toward the
   cartridge.
4. Slide the device-name cartridge in from the right until it reaches the stop.
5. Confirm the label faces the operator and hangs below the top rail.

### Power strip

<div class="pf-build-panels">
  <figure class="pf-build-panel pf-build-panel--wide">
    <img src="../../../assets/generated/test-node-chassis/detail-08-power-strip.png" alt="Power strip approaching two orange mounting blocks on the inside of the lower operator rail">
    <figcaption><strong>The blocks stay; the strip hangs onto them.</strong> Fasten both orange blocks to the inside face of the lower operator rail. Match their spacing to the real strip, then move the unplugged strip toward the protruding supplied screw heads.</figcaption>
  </figure>
</div>

1. Confirm the strip is unplugged.
2. Use the four use-now bars in the device-facing slot of `WIDTH-O-L`.
3. Mount both printed blocks inside the frame with four M3 × 30 mm flat-head
   screws. Leave them loose enough to slide in X.
4. Match their separation to the real strip's wall-mount keyholes.
5. Use the printed 2 mm blind holes only as drill starts. If needed, remove a
   block and enlarge its pilots to the root diameter of the supplied screw.
6. Drive the four supplied screws into printed ABS only. Never drill or drive
   into the power-strip enclosure or aluminum.
7. Set the screw heads to the keyhole-retention gap, hang the strip, then
   tighten the block-to-rail screws.
8. Confirm the strip sits inside the frame and below the fixture plate.

### Stacking registration

<div class="pf-build-panels">
  <figure class="pf-build-panel pf-build-panel--wide">
    <img src="../../../assets/generated/test-node-chassis/detail-08-stacking-corner.png" alt="Upper frame corner with two orange registration tabs and a translucent second chassis lowering onto it">
    <figcaption><strong>Install two tabs at every upper corner.</strong> The perpendicular orange tabs locate the translucent chassis descending from above. Stop when broad aluminum faces meet; the printed tabs prevent sideways movement and do not carry vertical weight.</figcaption>
  </figure>
</div>

1. Install two registration tabs at each upper corner—one on each exterior post
   face—for eight total.
2. Use both lower slots in every tab with metal M5 T-nuts, screws, and washers.
3. Leave the optional upper locking hole empty until a second chassis is
   stacked.
4. Confirm the broad aluminum faces, not the printed tabs, will carry vertical
   stack load.

The mechanical assembly is complete. Continue directly to the
[unpowered verification](verify.md); do not energize it.
