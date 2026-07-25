# Per-DUT test node

!!! warning "🚧 Stub — content authored separately"
    This page is a scaffold placeholder created in infra-261 Phase A. See
    [how to add a page](../contributing/add-a-page.md).

**What this page will cover:** the per-DUT BPI test node — the wired harness
(serial console via the ESP32 bridge, FEL recovery, relay power, and the
inspection webcam) that fronts exactly one DUT.

The reusable mechanical platform is documented separately. Complete
[the test-node chassis build](test-node-chassis/index.md) before following the
future electrical integration procedure on this page. Once that procedure
defines a working harness, use the chassis
[wire-management guide](test-node-chassis/wire-management.md) to hold the
cables against exposed rail faces without imposing one fixed layout on every
DUT.
