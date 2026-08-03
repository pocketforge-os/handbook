# Parts and tools

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1"><strong>Compatible DUT:</strong> TrimUI Smart Pro S <span>·</span> <code>chassis-dualbar-v1</code></p>

This inventory covers the qualified `chassis-dualbar-v1` mechanical layout, its
mounts, and the starter wire anchors. The SBC, relay board, programmable
supply, cabling, and device-specific electrical connections belong to the
per-DUT integration procedure.

## Aluminum and connectors

| Item | Quantity | Requirement |
| --- | ---: | --- |
| 20 mm square aluminum rail | 5 × 1 m maximum | 20.00 mm face-to-face with nominal 6 mm long grooves; four sticks plus two straight offcuts at least 309.2 mm long are sufficient |
| Metal three-way end connectors | 8 | Cap-flush, side-butt type for 2020/slot-6; [BLCCLOY B08C9Q2TGW](https://www.amazon.com/dp/B08C9Q2TGW) or dimensionally equivalent, with supplied set screws |

The finished frame uses four 360 mm posts, four 318 mm depth rails, four
306 mm width rails, and two continuous 306 mm fixture bars.

## Printed and fastener sets

Generate one verified `full` device pack. For the Smart Pro S example it
contains:

- 28 compact 18 mm M3 channel bars;
- four identical 71.5 mm keyed fixture links and four printed crossbar-joint
  plates;
- eight 18 × 92 × 4 mm stacking-registration tabs;
- two placard risers, two keyed placard spacers, two power-strip blocks, and
  one reusable placard holder;
- one Smart Pro S holder, six J-hooks, a fit coupon, two 91.5 mm upper and two
  108.5 mm lower stack-clear carrier links, and one device-name cartridge; and
- eight rail-mounted cable anchors.

The calibration bed is conditional. Print it after any rail supplier, printer,
nozzle, material, slicer compensation, or placard-slide change.

| Fastener group | Quantity | Use |
| --- | ---: | --- |
| Ordinary M3 nuts | 28 | One seated in every compact channel bar |
| M3 × 12 mm screws and wide washers | 28 sets | Twenty-two active rail joints and six lightly retained parked bars; eight active sets clamp the four printed crossbar joints |
| M3 suspension through-fasteners | 4 | Join the four fixture links to the two upper and two lower fixture-board slots |
| M3 metal locknuts | 4 | One per suspension through-fastener |
| M3 wide washers for suspension | 8 | One on each side of every printed-to-plate through-joint |
| DUT-holder link hardware | 4 sets | Use the screw, washer, and metal-nut lengths recorded by the verified holder pack |
| Placard-holder hardware | 2 sets | M3 flat-head screws with wide washers and metal nuts |
| Power-strip wall-mount screws | 4 | Supplied with the selected strip; they drive only into the printed blocks |
| Stacking-tab M5 drop-in T-nuts, M5 × 10 mm button-head screws, and flat washers | 16 sets | Two lower sets per registration tab; washer outside diameter no larger than 10 mm |
| Additional stacking-tab M5 hardware | 8 sets per stacked joint | One upper lock per tab after the aluminum faces meet |
| Cable-anchor drop-in T-nuts, matching low-profile screws, and flat washers | 8 sets | The starter bed is M5; an individually generated anchor may use M5 with a washer no larger than 10 mm OD or M3 with a washer no larger than 7 mm OD |
| Zip ties | 8 minimum | Up to 4.8 mm wide × 1.6 mm thick |

For each fixture-board through-joint, use the shortest stocked M3 screw that
fully engages its metal locknut without contacting a component or cable.
Record that length during build verification. Do not crush printed laps
to compensate for a poor fastener choice.

!!! note "Why a printed channel bar contains a metal nut"
    The calibrated ABS carrier travels inside the aluminum groove, prevents
    nut rotation, and spreads a light clamp load. The ordinary metal M3 nut
    supplies the thread. The printed carrier is not a structural frame
    connector.

!!! note "Printed fixture-bar joints"
    The four printed crossbar-joint plates replace the former concealed metal
    elbows. Each plate keys into one fixture bar and one depth rail and uses
    one active channel bar in each rail. Lower plates install above the lower
    rails; upper plates install below the upper rails. They index the fixture
    support and do not carry the outer-frame stacking load.

## Fabrication tools

- enclosed FDM printer with at least a 247 × 207 mm usable bed;
- 0.8 mm nozzle, ABS, and a known-good enclosed-printer profile;
- aluminum-rated saw blade, securely mounted saw, and clamps;
- tape measure or calipers, machinist square, and fine marker;
- deburring tool or fine file;
- M3 and M5 hex drivers appropriate to the selected screws;
- one spare M3 screw and washer for pulling nuts into printed pockets;
- drill and bits for adapting the power-strip block pilots to the root
  diameter of the strip's supplied screws;
- flush cutters for trimming zip-tie tails;
- eye and hearing protection; and
- ventilation suitable for ABS printing.

!!! danger "Saw safety"
    Clamp the aluminum rail. Wear eye and hearing protection. Keep gloves,
    loose sleeves, and hands away from a spinning blade. Let the blade stop
    before reaching near the cut, and deburr every cut before handling it.

## Before starting

- [ ] The device model passed its remote-evidence gate.
- [ ] The Smart Pro S holder model and fixture dependency intake are complete.
- [ ] The rail measures 20 mm face-to-face and its groove opening is close to
      6.73 mm.
- [ ] The printer, nozzle, ABS, and dimensional compensation match an accepted
      process, or the calibration bed is included.
- [ ] Both fixture bars are straight 306 mm pieces; no joint interrupts
      either span.
- [ ] All power hardware is unplugged and physically separate from the work
      area.

Next: [generate, verify, and print the Smart Pro S
pack](../../devices/trimui-smart-pro-s/print.md).
