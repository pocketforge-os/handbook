# Integrate the selected per-DUT test node

<p class="pf-profile-banner" data-integration-profile="powkiddy-x55-v1"><strong>Integration profile:</strong> <code>powkiddy-x55-v1</code> <span>·</span> <code>structure_only</code> <span>·</span> Powkiddy X55 harness and I/O</p>

<p class="pf-profile-banner" data-integration-profile="trimui-smart-pro-family-v1"><strong>Integration profile:</strong> <code>trimui-smart-pro-family-v1</code> <span>·</span> <code>structure_only</code> <span>·</span> TrimUI Smart Pro family harness and I/O</p>

<p class="pf-profile-banner" data-integration-profile="trimui-brick-v1"><strong>Integration profile:</strong> <code>trimui-brick-v1</code> <span>·</span> <code>structure_only</code> <span>·</span> TrimUI Brick harness and I/O</p>

Electrical and harness integration begins only after the exact DUT has been
selected and has passed its mechanical chassis verifier. Return to the
[device-first chassis selector](test-node-chassis/index.md) if the device is
not already fixed for this node.

## Current integration routes

| Device | Family integration route | Mechanical build sheet |
| --- | --- | --- |
| Powkiddy X55 | `powkiddy-x55-v1` | [Prototype core build](test-node-chassis/devices/powkiddy-x55/index.md) |
| TrimUI Brick / TG3040 | `trimui-brick-v1` | [Prototype dual-bar build](test-node-chassis/devices/trimui-brick/index.md) |
| TrimUI Smart Pro | `trimui-smart-pro-family-v1` | [Qualified gantry build](test-node-chassis/devices/trimui-smart-pro/index.md) |
| TrimUI Smart Pro S | `trimui-smart-pro-family-v1` | [Qualified dual-bar build](test-node-chassis/devices/trimui-smart-pro-s/index.md) |

The two Smart Pro DUTs share the same family-level input/output route. The
Brick and X55 each have their own structural integration identities because
their boards, holders, and harness routes differ. None of that makes the mechanical lanes
interchangeable: each build sheet still owns its registered rail plan,
printable chassis artifacts, assembly order, and qualification state.

## What a device integration profile owns

A released profile must name, rather than imply:

- fixture-board and side-board variants;
- DUT power, USB, serial, FEL, relay, and camera connections;
- cable and adapter inventory;
- port orientation and service loops;
- rail-anchor locations or keep-out rules; and
- the de-energized mechanical-to-electrical handoff plus functional retest.

New devices receive a new integration profile when any of those differ. The
device build sheet is the routing surface that joins that profile to the
correct holder and chassis layout, including a larger frame when required.

!!! warning "Profile structure is not an electrical recipe"
    `powkiddy-x55-v1`, `trimui-smart-pro-family-v1`, and `trimui-brick-v1` are structural routing
    identities. Do not invent or substitute side boards, voltages, cables, or
    connection order from this page. Component-level integration instructions
    must be released from their source-owned profile before wiring proceeds.

Until that component-level recipe is published, finish with the selected
layout's de-energized wire-management page and keep the DUT, fixture board,
programmable supply, relay, USB, and mains disconnected.
