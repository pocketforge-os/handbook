# Choose the device for this test node

Choose the exact handheld **before** collecting parts, generating prints, or
cutting aluminum. The choice resolves a complete build sheet: holder family,
integration route, chassis layout and size, printed pack, cut list, assembly
chapter, and verification gate.

!!! danger "One device choice for the whole build"
    Do not switch the device in the print generator and then continue with a
    different chassis chapter. Return here and start from the matching build
    sheet whenever the DUT changes.

## Select the DUT

<div class="pf-device-grid">
  <a class="pf-device-card" href="devices/trimui-smart-pro/" data-device-slug="trimui-smart-pro" data-layout-id="chassis-core-v1">
    <span class="pf-device-card__eyebrow">PHYSICALLY QUALIFIED</span>
    <strong>TrimUI Smart Pro</strong>
    <span>Smart Pro family holder and integration route</span>
    <small>Qualified gantry chassis · <code>chassis-core-v1</code></small>
  </a>
  <a class="pf-device-card" href="devices/trimui-smart-pro-s/" data-device-slug="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1">
    <span class="pf-device-card__eyebrow">CANDIDATE · OWNER GATE REQUIRED</span>
    <strong>TrimUI Smart Pro S</strong>
    <span>Smart Pro family holder and integration route</span>
    <small>Dual-bar chassis · <code>chassis-dualbar-v1</code></small>
  </a>
</div>

The two current devices are close relatives and share the
`trimui-smart-pro-family` holder mechanism and
`trimui-smart-pro-family-v1` integration route. Their registered chassis
layouts still differ today: the original Smart Pro pack remains frozen at its
qualified gantry geometry, while the Smart Pro S dual-bar layout remains a
candidate until the physical gate in `tsp-t1zd.2` passes.

Holder family, integration profile, and chassis layout are independent
selections in the registry. A future DUT can reuse the same holder or frame
while selecting a different side-board/harness route; a physically larger DUT
can select a new chassis layout without duplicating its electrical profile.

## What the choice controls

```mermaid
flowchart LR
  D[Exact DUT] --> B[Device build sheet]
  B --> H[Holder and fixture pack]
  B --> C[Chassis size, parts, and cut list]
  B --> A[Layout-specific assembly steps]
  B --> I[Side boards, harness, and I/O route]
```

| Build module | Smart Pro family today | What a future device may change |
| --- | --- | --- |
| DUT holder | Shared family carrier and hooks | Contact geometry, keep-outs, links, or retention mechanism |
| Chassis | 346 × 358 × approximately 368 mm outside | Width, depth, height, rail inventory, fixture suspension, or stacking details |
| Printed pack | Selected by exact device slug and registered layout | Chassis beds, holder, placard, cable anchors, and device-specific fixtures |
| Integration route | Shared family routing ID | Side boards, power/USB/serial/FEL topology, cables, and service access |
| Assembly | One route per registered layout | Different step count, order, images, and verification gates |

## Source of truth

The published routing contract is
[`test-node-guide-profiles.json`](../../assets/test-node-guide-profiles.json).
The site build cross-checks every device and layout in that file against the
pinned source-owned device-pack catalog. A missing device page, mismatched
layout, stale qualification state, or absent assembly route fails publication.

Adding a future DUT means adding a registered device build sheet. A genuinely
larger chassis gets a new layout namespace and its own parts, cut, assembly,
and verification pages; it does not alter these two build histories.
