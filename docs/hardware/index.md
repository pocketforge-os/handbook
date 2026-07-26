# Hardware

PocketForge separates the replaceable handheld from the reusable lab hardware
around it:

- The **device under test (DUT)** is the handheld being developed.
- The **semantic device model** is the source-owned OpenSCAD representation of
  the DUT’s envelope, screen, controls, ports, and stable input IDs.
- The **test-node chassis** is the stackable aluminum frame, camera/electronics
  gantry, carrier, and mechanical mounting hardware.
- The **test node** is the completed chassis after its power, USB, console,
  camera, and control electronics are installed.

Start with **[Model a handheld](model-handheld/index.md)**. Public drawings and
multi-view photography are enough for a reviewable first pass while the device
ships. Refine the fit-critical envelope with calipers when it arrives, then use
the accepted model to generate the device-specific DUT holder.

1. [Model the handheld](model-handheld/index.md) — research, build, validate,
   and accept the shared semantic/physical source.
2. [Build the test-node chassis](test-node-chassis/index.md) — cut, print,
   preload, assemble, and inspect the reusable frame plus accepted DUT holder.
3. [Integrate the per-DUT test node](test-node.md) — add the wired
   serial/FEL/power/camera harness.
4. [Use the bill of materials](bom.md) for project-wide parts and sourcing.
