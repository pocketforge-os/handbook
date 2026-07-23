# Hardware

PocketForge separates the replaceable handheld from the reusable lab hardware
around it:

- The **device under test (DUT)** is the handheld being developed.
- The **test-node chassis** is the stackable aluminum frame, camera/electronics
  gantry, carrier, and mechanical mounting hardware.
- The **test node** is the completed chassis after its power, USB, console,
  camera, and control electronics are installed.

Start with the **[test-node chassis build](test-node-chassis/index.md)**. It is
safe to fabricate while a handheld is still in transit and establishes the
physical platform used by the later wiring and bring-up procedures.

- [Build the test-node chassis](test-node-chassis/index.md) — cut, print,
  preload, assemble, and inspect the reusable mechanical frame.
- [Per-DUT test node](test-node.md) — add the wired
  serial/FEL/power/camera harness.
- [Bill of materials](bom.md) — project-wide parts and sourcing.
