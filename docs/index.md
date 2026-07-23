# PocketForge Handbook

Welcome to the **PocketForge Handbook** — the developer and operator onboarding
guide for [PocketForge OS](https://github.com/pocketforge-os). This is *not* an
end-user manual; it is the read-me-first documentation for people who want to
**get involved**: build a device, stand up a lab, or replicate the setup.

!!! info "Scaffolding in progress"
    This site is a freshly-stood-up framework (infra-261 Phase A). The
    navigation is complete, but most pages are visibly-marked **🚧 stubs**
    whose content is authored separately. See
    [Contributing to the docs](contributing/index.md) for how pages get filled in.

## Who this guide is for

- **Contributors** who want to understand the org layout and start hacking on
  PocketForge OS.
- **Hardware builders** who want to fabricate the reusable test-node chassis
  and integrate a device under test (DUT).
- **Lab replicators** who want to stand up the same build/flash/serial/power
  automation that PocketForge runs.

## The spine: bring up a device end to end

The whole handbook is shaped like one task — **[bring up a new PocketForge
device](bring-up-checklist.md)**. Each section feeds that end-to-end checklist,
so the guide grows page-by-page into a complete, checkbox-driven bring-up
procedure rather than an unstructured pile of docs.

```mermaid
flowchart LR
  HW[Hardware<br/>build the test-node chassis] --> LAB[Lab &amp; infra<br/>test node, power, net]
  LAB --> BF[Build &amp; flash<br/>pf build → OTA/SD/FEL]
  BF --> BU[⭐ Bring-up<br/>checklist]
```

## Map of the guide

| Section | What's there |
| --- | --- |
| [Contributor onboarding](onboarding/index.md) | Org/repo layout, dev environment, the agent/beads workflow |
| [Hardware](hardware/index.md) | Build the test-node chassis, add the DUT-specific carrier, and integrate the test node |
| [Lab & infrastructure](lab/index.md) | labgrid coordinator, relay power, networking |
| [Build & flash](build-flash/index.md) | The `pf build` pipeline, the OTA→SD→FEL flashing ladder |
| [⭐ Bring up a device](bring-up-checklist.md) | The end-to-end master checklist |
| [Reference](reference/index.md) | Glossary, troubleshooting, recovery runbooks |
| [Contributing](contributing/index.md) | Doc style guide, how to add a page |

## Public / private repo map

PocketForge documentation lives in two homes, split by audience:

- **`pocketforge-os/handbook`** (public — *this site*) — developer/operator
  onboarding, host-setup and recovery guides, the bring-up checklist.
- **`pocketforge-os/mission-control`** (private) — internal coordination: the
  planning docs, the beads issue database, and the agent operating doctrine.

Everything you can read here is public by design.
