# Parts and tools

This inventory covers the `chassis-topbar-v1` mechanical candidate, its
mounts, and the starter wire anchors. The SBC, relay board, programmable
supply, cabling, and device-specific electrical connections belong to the
per-DUT integration procedure.

## Aluminum and connectors

| Item | Quantity | Requirement |
| --- | ---: | --- |
| 20 mm square aluminum rail | 5 × 1 m maximum | 20.00 mm face-to-face with nominal 6 mm long grooves; four sticks plus one straight offcut at least 309.2 mm long are sufficient |
| Metal three-way end connectors | 8 | Cap-flush, side-butt type for 2020/slot-6; [BLCCLOY B08C9Q2TGW](https://www.amazon.com/dp/B08C9Q2TGW) or dimensionally equivalent, with supplied set screws |
| Concealed metal L-connectors | 2 | 26 × 26 × 9.5 mm for 2020/slot-6; [BLCCLOY B08D6T9CGN](https://www.amazon.com/dp/B08D6T9CGN) or dimensionally equivalent, with supplied set screws |

The finished frame uses four 360 mm posts, four 318 mm depth rails, four
306 mm width rails, and one continuous 306 mm top bar.

## Printed and fastener sets

Generate one verified `full` device pack. For the Smart Pro S example it
contains:

- 18 compact 18 mm M3 channel bars;
- two keyed upper fixture hangers;
- two 244 mm lower fixture backstays;
- eight 18 × 92 × 4 mm stacking-registration tabs;
- two placard risers, two keyed placard spacers, two power-strip blocks, and
  one reusable placard holder;
- one Smart Pro S holder, six J-hooks, a fit coupon, two upper and two lower
  carrier links, and one device-name cartridge; and
- eight rail-mounted cable anchors.

The calibration bed is conditional. Print it after any rail supplier, printer,
nozzle, material, slicer compensation, or placard-slide change.

| Fastener group | Quantity | Use |
| --- | ---: | --- |
| Ordinary M3 nuts | 18 | One seated in every compact channel bar |
| M3 × 12 mm screws and wide washers | 18 sets | Twelve active rail joints and six lightly retained parked bars |
| M3 suspension through-fasteners | 4 | Join the two upper and two lower fixture-board slots |
| M3 metal locknuts | 4 | One per suspension through-fastener |
| M3 wide washers for suspension | 8 | One on each side of every printed-to-plate through-joint |
| DUT-holder link hardware | 4 sets | Use the screw, washer, and metal-nut lengths recorded by the verified holder pack |
| Placard-holder hardware | 2 sets | M3 flat-head screws with wide washers and metal nuts |
| Power-strip wall-mount screws | 4 | Supplied with the selected strip; they drive only into the printed blocks |
| Stacking-tab M5 drop-in T-nuts, M5 × 10 mm button-head screws, and flat washers | 16 sets | Two lower sets per registration tab; washer outside diameter no larger than 10 mm |
| Additional stacking-tab M5 hardware | 8 sets per stacked joint | One upper lock per tab after the aluminum faces meet |
| Cable-anchor M5 drop-in T-nuts, M5 × 10 mm button-head screws, and flat washers | 8 sets | One face-loaded set per cable anchor |
| Zip ties | 8 minimum | Up to 4.8 mm wide × 1.6 mm thick |

For each fixture-board through-joint, use the shortest stocked M3 screw that
fully engages its metal locknut without contacting a component or cable.
Record that length during physical qualification. Do not crush printed laps
to compensate for a poor fastener choice.

!!! note "Why a printed channel bar contains a metal nut"
    The calibrated ABS carrier travels inside the aluminum groove, prevents
    nut rotation, and spreads a light clamp load. The ordinary metal M3 nut
    supplies the thread. The printed carrier is not a structural frame
    connector.

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
- [ ] The top bar is one straight piece; no joint will interrupt its 306 mm
      span.
- [ ] All power hardware is unplugged and physically separate from the work
      area.

Next: [generate, verify, and print the device pack](print.md).
