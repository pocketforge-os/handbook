# Input bring-up & calibration

Bring-up doesn't end when Linux boots. A new handheld's controls — face
buttons, D-pad, sticks, triggers, shoulder buttons — reach the kernel as raw
events from evdev, a UART microcontroller, LRADC, or GPIO, and PocketForge
still has to learn which physical control produces which event before any app
sees a coherent gamepad. That learning is what the **on-device input bring-up
and calibration app** does.

Run it **after Linux boots and the device's input decoder is present**, not as
a first step. It renders a generic gamepad face on the device's own screen,
walks you through pressing each control in turn, and writes a candidate
[`capabilities.toml`](../reference/glossary.md) for the new device from what it
actually observed. The same tool re-runs later to verify buttons still work and
stick ranges haven't drifted.

!!! note "Where this fits in the bring-up flow"
    This is a **mid-stream** step in the
    [⭐ bring-up checklist](../bring-up-checklist.md), positioned after
    [flashing the image](../build-flash/flashing-ladder.md) and confirming the
    device boots to a shell. It replaces the older CLI-dumper flow (running
    `evdev-probe.py` over SSH) with an on-panel guided wizard.

## When to run it

Run the app once, on a freshly-bootstrapped unit, as soon as **all** of these
are true:

- [ ] The device boots to userspace on the flashed image (the boot-and-verify
      step of the [flashing ladder](../build-flash/flashing-ladder.md) passed).
- [ ] The device's input decoder is in place — for evdev-native handhelds this
      is automatic; for a handheld whose pad is a UART microcontroller (the
      A133 base unit is one) the decoder daemon must already be running and
      exposing an `/dev/input/eventN` node for the pad.
- [ ] You have physical access to the device's screen and controls, or
      remote-desktop equivalent — the wizard prompts on-panel and expects the
      user to press each control in turn.

Re-run it later at any time to verify controls after a hardware repair, to
re-calibrate drifted sticks, or to confirm nothing has regressed after a
kernel/firmware bump.

## What the app does

The app is a small statically-linked Rust binary that renders directly to
`/dev/fb0`. It does three jobs; this page focuses on the first (initial
bring-up). The other two are covered by re-runs of the same tool.

1. **Standardization shim.** Interpret each handheld's raw input — evdev, UART
    MCU frames, LRADC, or GPIO — as one canonical gamepad model, honouring
    quirks. The most common quirk on our A133 handhelds is a trigger reported
    over an analog range (e.g. `EV_ABS`/`ABS_Z`, 0–128) that is *physically*
    binary; the shim re-emits it as a button.
2. **Guided ground-truth collection.** Show a generic gamepad face on the
    device's screen, highlight the control the wizard wants pressed, prompt
    the user, and record the raw event(s) produced by that press. When every
    prompt has been answered, emit a candidate `capabilities.toml` describing
    the new device.
3. **Verify / calibration re-run.** Re-drive the same prompt sequence against
    an existing descriptor and flag any control that doesn't respond, any
    stick range that has drifted outside its calibrated deadzone, or any
    button that has stopped registering.

## Prerequisites

You'll drive the deploy from the laptop; the app runs on the DUT.

- A booted device on the network (base A133: `tsp-base-dut.lan`) with SSH
  reachable — see [SSH etiquette](../reference/troubleshooting.md) if the
  first connect fails.
- A brokered [labgrid place](../lab/labgrid.md) hold on the DUT for the
  duration of the session. On the bench base A133 the place is held
  continuously by the bench session; request a window from its coordinator
  before deploying.
- The `pf-app-deploy` script from
  [`pocketforge-automation`](https://github.com/pocketforge-os/pocketforge-automation),
  which pushes a static aarch64 binary to `/opt/pocketforge/bin/` and
  optionally installs a systemd unit.

!!! tip "The deployed binary is ephemeral"
    `pf-app-deploy` writes into a tmpfs-adjacent path on the running rootfs
    that a full reflash wipes. Re-deploy the app after any full-image flash;
    once the flow is settled the app is baked into the image and this step
    goes away.

## Deploy and launch

Deploy the app to the live DUT with `pf-app-deploy.sh` from the laptop, then
start it on-device. The exact CLI is being finalized alongside the app itself
and is not yet the merged form; the shape is stable, the flags are not.

!!! warning "🚧 Command details being finalized"
    The exact `pf-collect-ui` invocation, its systemd unit name, and the
    `--mode`/`--dump-dir` flag names are being finalized in tsp-bwrg.3
    (guided-collection on-panel UI). Treat the commands below as **shape,
    not exact syntax** — they will be updated on this page once tsp-bwrg.3
    merges. The `pf-app-deploy.sh` invocation itself is stable
    (`pf-app-deploy.sh <binary> [--unit <name>.service] [--start|--restart]`).

=== "Base (A133)"

    ```bash
    # From the laptop, holding the tsp-base place (brokered — see above).
    pf-app-deploy.sh \
      /path/to/pf-collect-ui \
      --unit pf-collect-ui.service \
      --start
    ```

    The unit is authored to `Conflicts=` whichever other unit currently owns
    `/dev/fb0` (typically the menu), so starting it takes the panel over
    cleanly and stopping it hands control back.

=== "Pro S (A523)"

    !!! warning "🚧 Not yet supported"
        The A133 base unit is the first target. Bring-up support for other
        handhelds (A523 Pro S included) follows once the A133 flow is proven
        end-to-end. This page will grow a Pro S tab when that work lands.

Confirm the panel shows the gamepad face and the wizard prompt.
[Check the screen](../reference/troubleshooting.md) if it doesn't.

## Walk the guided prompts

On the panel you'll see a generic gamepad face with one control highlighted in
yellow and a prompt naming the control ("Press A", "Push LEFT stick fully
right", …). For each prompt:

- [ ] Read which control is highlighted and named.
- [ ] Press or move that control on the physical device.
- [ ] Confirm the prompt advances — the highlight moves to the next control.
- [ ] For a stick, sweep it fully in the direction named; the wizard needs to
      observe the endpoints to record the analog range.

The wizard walks the full canonical control list (face buttons, D-pad, both
sticks, both triggers, shoulder buttons, start/select/menu). A control the
device physically lacks (e.g. the base A133 has no L3/R3 or Home) is skipped
via the wizard's "not present" affordance so the emitted descriptor doesn't
falsely claim it.

If you press the wrong control by mistake, back up one prompt and press
again — the wizard commits a recording only when the current prompt advances.

## What you get out of it

When the wizard reaches the end it emits a **candidate `capabilities.toml`**
describing the new device: the identity block, one `[[inputs]]` row per
recorded control (with `ev_type`/`code`/`range` filled in from what it saw),
and — critically — the `semantics="binary"` / `semantics="analog"` flag on
each trigger, derived from whether that trigger reported only endpoint values
during the sweep or intermediate travel.

The candidate file is the starting point for the device's real descriptor
under `platform/devices/<board>/capabilities.toml`. It typically needs a
human pass to fill in the `skin_part` fields (which visual on the device skin
each input maps to) and to review the sensor/actuator sections, but the input
table it produces from observation is the load-bearing part and the most
tedious to author by hand.

!!! example "Validation gate"
    On the base A133 the app-collected map is cross-checked against the
    manually-captured ground truth from `tsp-ozbp.2` before the descriptor is
    accepted — every mismatch is investigated and explained, so a wrong
    reading (from the app, from the manual capture, or from a decoder bug)
    can't silently ship. This gate is the epic's proof that the app itself is
    correct.

## Verify and re-calibrate later

The same tool re-runs against an existing descriptor to verify a device still
matches its recorded map — the "job #3" mode above.

Run it after:

- A hardware repair (a button replacement, a stick swap) — to confirm the new
  part maps to the expected event codes.
- A user report of a stuck or dead button.
- A kernel or firmware bump that could have moved input event codes.

The verify pass drives the same prompt sequence but compares each observed
event to the descriptor rather than authoring one, and flags any control that
doesn't respond or any stick whose range has drifted outside its calibrated
deadzone.

## Where this fits in the whole flow

```mermaid
flowchart LR
  A[pf build image] --> B[Flash the DUT]
  B --> C[Boot and verify]
  C --> D[<b>Input bring-up<br/>& calibration</b>]
  D --> E[Candidate capabilities.toml]
  E --> F[Merge descriptor + release]
```

Building the image ([pf build](../build-flash/pf-build.md)) and getting it
onto the DUT (the [flashing ladder](../build-flash/flashing-ladder.md)) come
first; this section replaces the historical "log in over SSH and dump events
by hand" gap between *boots to a shell* and *has a descriptor* with a
guided on-panel run.
