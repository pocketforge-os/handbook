# Hardware

PocketForge separates the replaceable handheld from the reusable lab hardware
around it:

- The **device under test (DUT)** is the handheld being developed.
- The **semantic device model** is the source-owned OpenSCAD representation of
  the DUT’s envelope, screen, controls, ports, and stable input IDs.
- The **fixture contract** is the versioned manufacturing interface derived
  from evidence and in-hand measurements: datums, safe contacts, keep-outs,
  tolerances, and unresolved fit values.
- The **test-node chassis** is the stackable aluminum frame, matched lower
  and upper fixture-bar suspension, carrier, and mechanical mounting hardware.
- The **test node** is the completed chassis after its power, USB, console,
  camera, and control electronics are installed.

Start with **[Model a handheld](model-handheld/index.md)**. Public drawings and
multi-view photography are enough for a reviewable first pass while the device
ships. Refine the fit-critical envelope with calipers when it arrives, then use
the accepted fixture contract to design the device-specific DUT holder.

1. [Model the handheld](model-handheld/index.md) — research, build, validate,
   and accept the shared semantic/physical source.
2. [Design and qualify the DUT holder](dut-holder/index.md) — turn the
   manufacturing fixture contract into source-owned retention geometry and an
   immutable device print pack.
3. [Choose the DUT and build its test-node chassis](test-node-chassis/index.md)
   — resolve the device family, integration route, chassis size, parts, cut
   list, and assembly chapter before fabrication.
4. [Integrate the per-DUT test node](test-node.md) — add the wired
   serial/FEL/power/camera harness.
5. [Use the bill of materials](bom.md) for project-wide parts and sourcing.
