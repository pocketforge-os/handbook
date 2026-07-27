# Assemble the top-bar chassis

Use this page at the workbench after the verified device pack is printed and
all 13 aluminum pieces pass the cut gate. Keep every power source physically
disconnected.

<div class="pf-chapter-meta">
  <span>8 bench stages</span>
  <span>Mechanical work only</span>
  <span>Two-person lift recommended</span>
  <span>Candidate acceptance required</span>
</div>

## Keep the destination visible

<script type="module" src="../../../assets/vendor/model-viewer/model-viewer.min.js"></script>
<script type="module" src="../../../assets/chassis-model.mjs"></script>
<div class="chassis-model-shell">
  <button
    class="chassis-model-label-toggle"
    type="button"
    data-chassis-label-toggle
    aria-controls="assembly-chassis-model"
    aria-pressed="true"
    hidden>
    Hide labels
  </button>
  <model-viewer
    id="assembly-chassis-model"
    data-full-chassis-model
    data-labels-visible="true"
    src="../../../assets/generated/test-node-chassis/pocketforge-test-node.glb"
    poster="../../../assets/generated/test-node-chassis/hero.png"
    alt="Interactive Smart Pro S top-bar test-node chassis with modeled handheld, populated DUT test board, camera, carrier, and frame"
    camera-controls
    touch-action="pan-y"
    shadow-intensity="0.7"
    shadow-softness="0.8"
    exposure="1.0"
    camera-orbit="35deg 68deg 1.05m"
    min-camera-orbit="auto auto 0.55m"
    max-camera-orbit="auto auto 1.7m">
    <span
      class="pf-model-hotspot pf-model-hotspot--operator"
      slot="hotspot-operator"
      data-position="0.173m 0.045m 0.030m"
      data-normal="0 1 0">
      <strong>OPERATOR SIDE</strong>
      <span>fixture board and controls</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--device"
      slot="hotspot-device"
      data-position="0.173m 0.205m -0.333m"
      data-normal="0 0 -1">
      <strong>DEVICE / WALL SIDE</strong>
      <span>DUT holder mounts here</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--post"
      slot="hotspot-post"
      data-position="0.010m 0.200m 0.012m"
      data-normal="0 0 1">
      <strong>POST · 360 mm</strong>
      <span>4 vertical pieces</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--width"
      slot="hotspot-width"
      data-position="0.173m 0.358m 0.012m"
      data-normal="0 1 0">
      <strong>WIDTH · 306 mm</strong>
      <span>4 left-to-right rails</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--depth"
      slot="hotspot-depth"
      data-position="0.010m 0.358m -0.179m"
      data-normal="0 1 0">
      <strong>DEPTH · 318 mm</strong>
      <span>4 operator-to-device rails</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--topbar"
      slot="hotspot-topbar"
      data-position="0.173m 0.358m -0.075m"
      data-normal="0 1 0">
      <strong>TOP BAR · 306 mm</strong>
      <span>1 fixture-support rail</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--fixture"
      slot="hotspot-fixture"
      data-position="0.189m 0.184m -0.045m"
      data-normal="0 0 1">
      <strong>DUT TEST BOARD</strong>
      <span>populated fixture assembly</span>
    </span>
    <span
      class="pf-model-hotspot pf-model-hotspot--handheld"
      slot="hotspot-handheld"
      data-position="0.173m 0.205m -0.315m"
      data-normal="0 0 -1">
      <strong>MODELED HANDHELD</strong>
      <span>Smart Pro S worked example</span>
    </span>
  </model-viewer>
  <span class="chassis-model-help">drag to rotate · scroll to zoom</span>
</div>
<noscript>
  <img
    class="pf-step-render"
    src="../../../assets/generated/test-node-chassis/hero.png"
    alt="Static fallback view of the Smart Pro S top-bar test-node chassis">
</noscript>

The outer frame is 346 mm wide, 358 mm deep, and approximately 368 mm high.
Stand at the operator side: width rails run left to right, depth rails run away
from you, and the Smart Pro S holder sits on the device side.

!!! danger "No power during assembly"
    Leave the power strip unplugged. Do not connect a programmable supply, DUT,
    USB power, battery emulator, relay supply, or mains input.

## 1. Preload every rail before closing its cut ends

A channel bar enters through an open cut end; it cannot pass through the narrow
slot mouth. Put an M3 × 12 mm screw and wide washer one turn into each bar as a
temporary handle.

Load the four width rails:

| Rail | Loaded groove faces | Active bars |
| --- | --- | ---: |
| `WIDTH-O-L` | Device / inside | 4 |
| `WIDTH-O-U` | Operator / outside | 2 |
| `WIDTH-D-L` | Operator / inside | 2 |
| `WIDTH-D-U` | Operator / inside | 2 |

Then:

1. Put one blue-tape-tagged parked bar in the inward groove of each 318 mm
   depth rail: four parked bars total.
2. Orient `TOPBAR` left to right with its loaded groove facing the operator.
3. Load two active bars at the fixture plate's upper-slot X positions.
4. Park one blue-tape-tagged bar near each top-bar end.
5. Count **10 active width + 4 parked depth + 2 active top-bar + 2 parked
   top-bar = 18** before installing any metal connector.

Parked screws remain only finger-snug. All active bars stay loose until their
mounting part is installed.

## 2. Build the lower outer frame and add the posts

On a flat bench, stand at the operator edge and arrange:

- `WIDTH-O-L` nearest you;
- `WIDTH-D-L` parallel on the device side;
- `DEPTH-L-L` and `DEPTH-R-L` between them; and
- one labeled 360 mm post at each corner.

At each corner, install one metal three-way connector so the width rail butts
against one post face and the depth rail butts against the adjacent face.
Neither horizontal rail crosses the other. Raise all four posts, keep every
joint finger-snug, and confirm:

- the operator width rail's four-bar groove faces the chassis interior;
- the device width rail's two-bar groove faces the operator;
- each depth rail's parked-bar groove faces the interior; and
- all four post tops remain open.

## 3. Build the upper ring with the top bar

Arrange `WIDTH-O-U`, `WIDTH-D-U`, `DEPTH-L-U`, and `DEPTH-R-U` as a flat upper
rectangle. Install its four three-way connectors loosely.

Before placing the ring on the posts:

1. Put one concealed metal L-connector at each end of `TOPBAR`, using the
   lower grooves of the top bar and upper depth rails.
2. Keep the top bar continuous and square between the depth rails.
3. Set its centerline **75 mm from the operator-side outside plane**.
4. Confirm its loaded groove faces the operator and both active hanger bars
   remain accessible.
5. Tighten the two metal L-connectors evenly. These connectors carry the top
   bar.
6. With a helper if available, lower the complete upper ring evenly onto all
   four posts. Stop and realign if one corner resists.

Bring every upper rail flush to its adjacent post face. Do not apply final
torque yet.

## 4. Square and tighten the outer frame

1. Measure both corner-to-corner diagonals of the lower rectangle.
2. Shift the loose frame until the diagonals differ by no more than 2 mm.
3. Repeat on the upper rectangle.
4. Use a machinist square to make all four posts plumb.
5. Tighten opposite corners in a cross pattern, rechecking both diagonal pairs
   after every pass.
6. Confirm the chassis sits without rocking and the top bar remains at the
   75 mm datum.

## 5. Mount the verified DUT holder

Use the Smart Pro S holder, J-hooks, four carrier links, and fasteners from the
same verified device pack.

1. Put the shorter pair of links at the device-side upper width rail and the
   longer pair at the device-side lower width rail, matching the pack's
   `TOP`/`BOTTOM` markings.
2. Move the four active channel bars under the link holes and fasten each link
   flat to its rail.
3. Attach the holder to all four links without twisting it.
4. Confirm the holder faces the operator and is centered at X = 173 mm.
5. Install the unpowered Smart Pro S only for fit inspection. Every J-hook
   must clear its controls, ports, speakers, vents, triggers, and screen.
6. Remove the handheld again if later work could drop hardware onto it.

## 6. Hang and brace the populated fixture board

![Installed top-bar fixture suspension detail](../../../assets/generated/test-node-chassis/topbar/layout-suspension-detail.png)

Turn the fixture board so its components face the operator and the Logitech
C270 lens points toward the DUT. At each left/right side:

1. Seat one upper hanger's 16 × 6.43 mm key in the top bar's operator-facing
   groove.
2. Move an active channel bar under its round hole and clamp it with an
   M3 × 12 mm screw and wide washer.
3. Bring the hanger's **2.5 mm lower lap** against the board's upper slot.
4. Flip one lower backstay from its print orientation. Put its **2.5 mm upper
   lap** on the rail-side half of the same upper joint.
5. Clamp the hanger lap, fixture-board slot, and complementary backstay lap
   with one through-fastener, wide washers, and a metal locknut. The printed
   halves form one flat **2.5 + 2.5 mm = 5 mm** strap.
6. Clamp the backstay's lower round hole through the board's lower slot with
   the same washer-and-locknut arrangement.
7. Repeat on the other side. Leave all four board joints just loose enough to
   remove twist, then tighten them evenly by hand.

Both hangers carry the board. Both backstays are required to prevent swing and
racking. No printed lap, fastener, or rail may touch a fixture component,
connector, or cable.

## 7. Add the placard, power-strip mounts, and stacking tabs

- Mount the reusable placard holder below the operator upper width rail with
  its two risers/spacers and flat-head M3 fasteners. The name cartridge must
  slide out without disturbing the fixture board.
- Keep the power strip unplugged. Move the four active channel bars in the
  operator lower width rail under the two mounting holes in each printed
  block, then clamp the blocks with four M3 × 12 mm screws and wide washers.
  Use the strip's supplied wall-mount screws only between the strip and the
  printed blocks. A supplied screw must not bottom against aluminum or pierce
  the enclosure.
- Install two 18 × 92 × 4 mm registration tabs at every upper corner: eight
  tabs total. Each tab engages 60 mm below the top aluminum surface, extends
  32 mm above it, and uses two lower M5 fastener sets.
- When joining two chassis, let aluminum touch aluminum at all four corners,
  then add one upper M5 locking set through each tab's round hole.

!!! warning "Provisional two-chassis limit"
    Until a populated load test establishes a rated stack count, stack no more
    than two populated nodes. Registration tabs resist lateral motion;
    aluminum carries the vertical load.

## 8. Align the camera and finish the mechanical build

1. Confirm the top-bar centerline remains at 75 mm and the fixture board lies
   flat.
2. To adjust operator-to-device position, loosen both metal L-connectors,
   move the complete top bar without skewing it, then retighten both sides.
3. Use the fixture-board slots only for final left/right centering. Keep every
   printed lap flat and every key seated.
4. Connect only the Logitech C270 to a safe viewing computer if needed.
5. Confirm the complete unpowered handheld is visible with margin on all four
   sides and the screen is not keystoned.
6. Disconnect the camera and compare the physical assembly with the
   interactive model above.

Before leaving the bench:

- [ ] all 18 channel bars are accounted for;
- [ ] every outer-frame joint is flush, square, and tight;
- [ ] the continuous top bar is square and locked at its recorded datum;
- [ ] two hangers and two backstays are installed without fixture collisions;
- [ ] the DUT holder is centered, correctly oriented, and unobstructed;
- [ ] placard, power-strip switch, service corridors, and stacking interfaces
      remain accessible; and
- [ ] the chassis is still fully de-energized.

Next: [verify and record the candidate](../verify.md).
