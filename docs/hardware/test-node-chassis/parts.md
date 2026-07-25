# Parts and tools

This list covers the reusable mechanical chassis, its mounts, and the printed
anchors used to organize a completed harness. It does not yet specify the SBC,
relay board, programmable supply, cable types, or DUT-specific electrical
connections.

## Chassis materials

| Item | Quantity | Requirement |
| --- | ---: | --- |
| 20 mm square aluminum rail (2020 extrusion) | 6 × 1 m | 20.00 mm face-to-face with nominal 6 mm long grooves; the accepted design was calibrated against [SeekLiny B0DY7FKKMT](https://www.amazon.com/dp/B0DY7FKKMT) |
| Metal three-way end connectors | 8 | Cap-flush, side-butt type for 2020/slot-6; [BLCCLOY B08C9Q2TGW](https://www.amazon.com/dp/B08C9Q2TGW) or dimensionally equivalent, with supplied set screws |
| Concealed metal L-connectors | 4 | 26 × 26 × 9.5 mm for 2020/slot-6; [BLCCLOY B08D6T9CGN](https://www.amazon.com/dp/B08D6T9CGN) or equivalent, with eight supplied set screws |
| ABS filament | Reserve 500 g | The seven production beds total 423.8 cm³ of solid-model volume (about 441 g if printed completely solid); ordinary infill leaves reserve for calibration and failed starts |
| Ordinary M3 hex nuts | 42 | 36 populate the sliding/splice nut bars, four join the DUT-holder links, and two join the placard holder; the accepted nuts measure 5.36 mm across flats × 2.30 mm thick |
| M3 × 12 mm screws | 38 | Socket/button head for general mounts; use two flat-head screws at the placard-holder joint |
| M3 × 30 mm flat-head screws | 4 | Power-strip blocks; choose the shortest stocked length that fully engages the captive nut without bottoming |
| M3 wide flat washers | 42 | Spread clamp load on printed parts and lightly retain the six tagged parked replacements |
| Stacking-tab M5 drop-in T-nuts, M5 × 10 mm button-head screws, and flat washers | 16 sets | Two lower sets fasten each stacking tab to its vertical post; washer outside diameter must be no larger than 10 mm |
| Additional matching stacking-tab M5 hardware | 8 sets per stacked joint | One upper set per tab locks the lower chassis to the bottom rail of the chassis above after the aluminum faces meet |
| Cable-anchor M5 drop-in T-nuts, M5 × 10 mm button-head screws, and flat washers | 8 sets | One face-loaded set per cable anchor; washer outside diameter must be no larger than 10 mm |
| Zip ties | 8 minimum | Up to 4.8 mm wide × 1.6 mm thick; use one per anchor normally and keep extras for wider bundles |
| Power strip wall-mount screws | 4 | Supplied with the selected strip; they drive only into printed ABS blocks |

!!! note "Why both printed carriers and metal nuts?"
    The compact printed carriers match the measured groove inside the aluminum
    rail, prevent rotation, and spread a light clamp load. An ordinary metal
    nut supplies the thread. The printed carriers are not structural frame
    connectors.

## Printed sets

The canonical beds produce:

- 28 identical orange **18 mm** short M3 sliding nut carriers: 22 use-now
  mount positions plus six parked replacements identified by blue tape on
  their screws;
- four long double-nut splice bars;
- two full-wrap upright splice collars;
- four camera-frame joint plates;
- four fixture spacers;
- two upper and two lower carrier links;
- eight **18 × 92 × 4 mm** stacking-registration tabs;
- eight rail-mounted cable anchors;
- two placard risers and two placard rail spacers;
- two power-strip blocks;
- one reusable placard holder and one device-name cartridge.

The device carrier and its six clamp hooks are device-specific outputs. For the
example build, use the TrimUI Smart Pro family carrier from the same hardware
repository. They are shown in the assembly model but are not duplicated in the
chassis print beds.

## Fabrication tools

- enclosed FDM printer with at least a 247 × 207 mm usable bed;
- 0.8 mm nozzle and a known-good ABS profile;
- aluminum-rated saw blade, securely mounted saw, and clamps;
- tape measure or calipers, machinist square, and fine marker;
- deburring tool or fine file;
- M3, M4, and M5 hex drivers appropriate to the selected screws;
- one spare M3 screw and washer for pulling nuts into printed pockets;
- drill and bits for adapting the power-strip block pilots to the root
  diameter of the strip's supplied screws;
- flush cutters for trimming zip-tie tails;
- eye and hearing protection;
- ventilation suitable for ABS printing.

!!! danger "Saw safety"
    Clamp the aluminum rail. Wear eye and hearing protection. Keep gloves, loose
    sleeves, and hands away from a spinning blade. Let the blade stop before
    reaching near the cut. Deburr every cut before handling or assembly.

## Before starting

- [ ] Confirm the aluminum rail is 20 mm face-to-face.
- [ ] Confirm the opening of each long groove is close to 6.73 mm.
- [ ] Confirm the printer, nozzle, ABS, and dimensional compensation match the
      previously accepted process—or plan to print Batch 00.
- [ ] Confirm all power hardware is unplugged and physically separate from the
      work area.
- [ ] Read the [assembly start page](assemble/index.md) and Steps
      [2](assemble/02-load-width-rails.md), [3](assemble/03-load-depth-rails.md),
      and [5](assemble/05-load-camera-frame.md) before closing a single rail
      end.
