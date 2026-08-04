# Bring up a BPI test node

Use this runbook to turn a fresh Banana Pi M2 Zero into a PocketForge test-node
host. It records the configuration proven during `tsp-h1se`, `tsp-h1se.3`,
`tsp-h1se.4`, and the reboot-survival check in `tsp-mf4k`.

This is host provisioning, not DUT bring-up. Keep the DUT unpowered while making
or changing physical connections. Once the node is enrolled, acquire its
labgrid place before operating DUT power or recovery automation.

## Before provisioning

### Assemble and inspect the node

- Seat the BPI-M2-Zero's microSD card fully before applying node power.
- Connect the Terminus (`1a40:0101`) and Huasheng (`214b:7260`) USB hubs.
- Connect the ESP32-S3 console/FEL bridge (`303a:1001`), DP100 PSU
  (`2e3c:af01`), and C270 webcam (`046d:0825`).
- Connect the optional RTL8152 adapter when the node uses wired Ethernet.
- With the DUT de-energized, connect the bridge's FEL strap to the DUT according
  to the released DUT wiring profile.

!!! danger "The FEL strap needs an external pull-up"
    Do not assume that the bridge or DUT supplies a suitable pull-up, and do not
    drive the FEL line directly from an unverified GPIO. Preserve the external
    pull-up specified by the `tsp-fel-strap` wiring record, verify the rail and
    logic level with the DUT unpowered, and only then connect the strap. If the
    released wiring profile does not name that pull-up, stop and repair the
    profile instead of guessing a value or rail.

Record `lsusb` before provisioning. Bus and device numbers will vary; the
vendor/product IDs are the stable identifiers:

```console
$ lsusb
... ID 1a40:0101 ...
... ID 214b:7260 ...
... ID 303a:1001 ...
... ID 2e3c:af01 ...
... ID 046d:0825 ...
... ID 0bda:8152 ...  # optional RTL8152
```

Do not continue if a required ID is absent. Reseat the affected peripheral or
hub while the DUT remains unpowered and repeat the inventory.

## Provision the host

From a current `pocketforge-automation` checkout on the node, run the idempotent
provisioner:

```bash
bash test-node-farm/provision-pf-node.sh
```

The provisioned node uses the standardized Armbian kernel and headers pair:

```text
6.18.41-current-sunxi trunk.11
```

Keep both kernel and matching headers on apt hold. Do not independently upgrade
one half of the pair: doing so can leave the out-of-tree camera module missing
after reboot. The provisioner also installs the DKMS-managed `uvcvideo-pf`
package. Its `pf_mjpeg_cap` parameter caps MJPEG payload negotiation at 1600 so
the dual-C270 topology does not overcommit the Dell node's shared USB bandwidth
(the failure and rationale are recorded in the
`dell-dual-c270-usb-bandwidth` memory linked from `tsp-h1se`).

Provisioning installs and enables these node services:

| Unit | Responsibility |
| --- | --- |
| `pf-console-ops` | Console and FEL bridge operations |
| `pf-camstream` | DUT camera stream |
| `pf-powerd` | Named, policy-bounded DUT power operations |
| `pf-psud` | DP100 PSU discovery and control |

Reboot the node after provisioning so the held kernel, DKMS module, device
rules, and enabled services are exercised together.

## Verify after provisioning

Run the checks below after that reboot and after every kernel/package
maintenance window.

1. Confirm the standardized kernel and apt holds:

    ```bash
    uname -r
    apt-mark showhold
    ```

    `uname -r` must report `6.18.41-current-sunxi`. The hold list must include
    the installed `current-sunxi` kernel image and headers packages at
    `trunk.11`; investigate any missing hold before package maintenance.

2. Confirm the expected USB inventory (the RTL8152 line remains optional):

    ```bash
    lsusb
    ```

    The output must contain `1a40:0101`, `214b:7260`, `303a:1001`,
    `2e3c:af01`, and `046d:0825`.

3. Confirm every PocketForge unit is active:

    ```bash
    systemctl --no-pager --full status \
      pf-console-ops pf-camstream pf-powerd pf-psud
    ```

    Each unit must report `Active: active (running)` without a restart loop.

4. Confirm the patched camera module and its bandwidth cap:

    ```console
    $ cat /sys/module/uvcvideo/parameters/pf_mjpeg_cap
    1600
    ```

5. Use the sanctioned PSU client to query the DP100 without changing its
   output:

    ```bash
    pf-psu status
    ```

    The command must identify a responsive DP100. A missing or unresponsive PSU
    is a failed health check; do not bypass `pf-psud` with a raw USB command.

!!! success "Reboot-survival baseline"
    `tsp-mf4k` accepted this configuration after **10 of 10 consecutive clean
    reboots**. A newly provisioned node should reproduce the checks above after
    each reboot; one successful boot is not evidence that DKMS and USB discovery
    survive restart.

## Recover a DUT without moving its storage

Image loading is OTA first and FEL otherwise. There is no SD-card swap recovery
step: a wedged, bricked, offline, or newly provisioned DUT is recovered
hands-free through its node.

1. Acquire the DUT's labgrid place.
2. From the `pocketforge-automation` checkout, invoke the released
   `node-recover.sh` automation for that DUT and image.
3. Consume its concise `PASS`, `WARN`, or `FAIL` result. On failure, follow the
   reported `reason` and `hint`; do not replace the automation with raw flashing
   commands or a partial write.
4. Release the place when recovery and the post-flash health check finish.

The exact arguments are owned by the script and its `--help` output, so use the
version checked out for the deployment rather than copying an old invocation
from a ticket. See the [flashing ladder](../build-flash/flashing-ladder.md) for
the broader image-loading flow.

## Quick acceptance checklist

- [ ] SD card is seated and the required USB IDs are present.
- [ ] Kernel and matching headers are `6.18.41-current-sunxi trunk.11` and held.
- [ ] DKMS installed `uvcvideo-pf`; `pf_mjpeg_cap` reads `1600`.
- [ ] `pf-console-ops`, `pf-camstream`, `pf-powerd`, and `pf-psud` are active.
- [ ] `pf-psu status` reports a responsive DP100.
- [ ] The same checks pass after reboot.
- [ ] FEL recovery uses `node-recover.sh`, never an SD-card swap.
