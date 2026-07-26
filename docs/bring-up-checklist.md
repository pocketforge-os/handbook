# ⭐ Bring up a new PocketForge device

!!! warning "🚧 Stub — content authored separately"
    This is the **spine** of the handbook — a scaffold placeholder created in
    infra-261 Phase A. The end-to-end, checkbox-driven procedure is stitched
    together from the Hardware, Lab & infrastructure, and Build & flash sections
    as those pages are authored. See
    [how to add a page](contributing/add-a-page.md).

**What this page will cover:** the single ordered, checkbox-driven procedure to
take a new PocketForge unit from parts to a booted, flashed, verified device —
the artifact the whole guide exists to produce.

The eventual checklist will read like this (illustrative shape only — **not** the
real steps):

- [ ] [Model and accept the handheld](hardware/model-handheld/index.md)
- [ ] Generate the device-specific DUT holder from the accepted model
- [ ] [Build and verify the test-node chassis](hardware/test-node-chassis/index.md)
- [ ] Wire it into a [per-DUT test node](hardware/test-node.md)
- [ ] Confirm [relay power](lab/power.md) and [serial](hardware/test-node.md) control
- [ ] Acquire the device [place](lab/labgrid.md)
- [ ] [Build an image](build-flash/pf-build.md)
- [ ] [Flash it](build-flash/flashing-ladder.md) onto the DUT
- [ ] Boot and verify

Each item links out to the section that documents it, so this page stays a thin
ordered index over the substantive procedures.
