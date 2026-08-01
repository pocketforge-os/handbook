# Manage the harness wiring

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1"><strong>Selected build:</strong> TrimUI Smart Pro S <span>·</span> <code>chassis-dualbar-v1</code></p>

Use the eight-anchor starter set to keep a completed DUT harness against
exposed chassis rails. Anchor positions are deliberately chosen at the bench:
different devices put their USB, serial, power, relay, and camera connections
in different places, so there is **no fixed anchor map**.

Need another anchor? [Generate one M3 or M5 replacement in your
browser](../../devices/trimui-smart-pro-s/print.md#generate-one-cable-anchor).
The complete pack still includes
the default eight-piece M5 starter bed.

!!! danger "Work only on a fully de-energized harness"
    Shut the node down. Unplug the power strip and disconnect bench-supply,
    USB, relay, and other power or data sources at their source ends before
    moving a cable. Do not add, tighten, or cut a zip tie around a live harness.

<div class="pf-step-layout" markdown="1">
<div class="pf-step-visual">
  <figure>
    <img src="../../../../../assets/generated/test-node-chassis/wire-management-anchor.png" alt="Two-panel cable-anchor instruction drawing: at left a silver M5 drop-in nut sits in the top groove of a gray 2020 rail while an orange printed anchor, silver washer, and button-head screw move downward along a blue arrow; at right the installed orange anchor supports a three-cable bundle while a blue zip tie passes through one transverse tunnel and wraps loosely around the bundle">
    <figcaption>Left: the default M5 hardware face-loads into the rail. The individually generated M3 anchor installs the same way with matching M3 hardware. Right: pass one zip tie through either tunnel and around the cable bundle. <a href="../../../../../assets/generated/test-node-chassis/wire-management-anchor.png">Open the drawing full size.</a></figcaption>
  </figure>
</div>
<div class="pf-step-copy" markdown="1">

## Get these parts

For each location:

<ul class="pf-part-list">
  <li><span class="pf-part-tag pf-part-tag--printed">Printed</span><span><strong>1 × rail-mounted cable anchor</strong><small>Batch 07 · 32 × 18 × 8.8 mm · the starter bed contains eight</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--fastener">M3/M5</span><span><strong>1 × face-loaded drop-in T-nut matching the generated hole</strong><small>It enters through the open rail groove; no rail end needs to be opened</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--fastener">M3/M5</span><span><strong>1 × matching low-profile button-head screw and flat washer</strong><small>Washer outside diameter: no larger than 7 mm for M3 or 10 mm for M5</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--fastener">Tie</span><span><strong>1 × zip tie, normally</strong><small>Up to 4.8 mm wide × 1.6 mm thick · a second tie may use the other tunnel</small></span></li>
  <li><span class="pf-part-tag pf-part-tag--tool">Tools</span><span><strong>Matching hex driver and flush cutters</strong><small>Hand-tighten the screw and cut every tie tail flush</small></span></li>
</ul>

<div class="pf-picture-key" role="group" aria-label="Cable anchor picture annotations">
  <p class="pf-picture-key__title">Read the picture</p>
  <ul>
    <li><span class="pf-cue pf-cue--orange">Orange anchor</span><span>This is the printed Batch 07 part. Its broad flat face touches the rail; its two raised bridges contain the zip-tie tunnels.</span></li>
    <li><span class="pf-cue pf-cue--silver">Silver / gray</span><span>The long shape is the aluminum rail. The small silver pieces show the default M5 nut, washer, and button-head screw; use the matching M3 set with an M3 anchor.</span></li>
    <li><span class="pf-cue pf-cue--blue">Blue arrow and loop</span><span>The arrow shows the fastener assembly direction. The blue loop is the zip tie passing through one tunnel and around the bundle.</span></li>
    <li><span class="pf-cue pf-cue--charcoal">Three cable colors</span><span>They identify the cable bundle only; they do not prescribe a port, voltage, or cable type.</span></li>
  </ul>
</div>

</div>
</div>

## Choose each location

Start with the side rails nearest the cable run. Use only as many of the eight
anchors as the current harness needs and keep the rest as spares.

1. Trace one cable from connector to connector before bundling it.
2. Leave a relaxed service loop at every connector so cable movement is not
   transferred into the plug or circuit board.
3. Choose an exposed long groove where the bundle will not block a DUT
   control, connector, vent, placard, camera view, or power-strip switch.
4. Keep the bundle clear of sharp rail ends, both movable fixture bars, and the
   suspended fixture board. If a cable must reach the moving assembly, leave
   enough free loop for its full adjustment range.
5. Use another anchor where the bundle would otherwise sag into the DUT,
   camera sight line, or work area. Eight is a starter quantity, not a required
   count or spacing rule.

## Install one anchor

1. Push the selected M3 or M5 drop-in T-nut through the open face of the
   chosen rail groove. Hold its threaded hole approximately where the anchor
   will sit.
2. Put the anchor's broad flat face against the rail. Point its 32 mm length
   along the intended cable run; the two tie tunnels then cross that run.
3. Put the matching washer on the low-profile button-head screw. Pass the
   screw through the center hole and turn it into the drop-in nut by hand for
   two or three turns.
4. Slide the loose assembly to its final position. Tighten the screw by hand
   only until the anchor no longer slides or rotates. Do not crush the printed
   base or use the anchor as a structural clamp.
5. Feed one zip tie through either raised tunnel. Bring it around the cable
   bundle and start the locking head.
6. Close the tie only until it contains the cables. Each cable should still
   move slightly under a fingertip; the jacket must remain round and unmarked.
7. For a wider bundle, use the second tunnel and a second tie. Do not use extra
   ties to force an overfilled bundle onto one anchor.
8. Turn the locking head away from hands and neighboring cables, then cut the
   tail flush.

## Before reconnecting anything

- [ ] Every anchor sits flat on the rail and stays put under gentle finger
      pressure.
- [ ] Every cable retains a service loop and its connector carries no side
      load.
- [ ] Zip ties contain the bundle without flattening or marking cable jackets.
- [ ] No cut tail, printed edge, or aluminum edge can rub a cable.
- [ ] Both fixture bars and the fixture board still reach their required
      adjustment range.
- [ ] DUT controls, vents, ports, the placard, camera view, and power switch
      remain accessible.

!!! warning "Routing aid, not strain relief"
    The printed anchor organizes a loose bundle. It is not connector strain
    relief, a lifting point, a structural fastener, or a way to restrain a
    damaged cable. Fix the harness or add device-appropriate strain relief if
    a connector still carries cable load.

To revise the route later, de-energize the node again, cut only the zip tie,
and loosen the center screw. The face-loaded nut lets the anchor move or leave
the rail without reopening the chassis.

The electrical connection order and functional retest remain specific to the
[per-DUT test-node procedure](../../../test-node.md).
