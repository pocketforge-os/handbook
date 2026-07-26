# Refine and accept the model

Use the physical handheld to replace fit-critical estimates, then finish the
fixed-view visual loop and deterministic proof. This gate turns a useful
photo-derived model into the accepted source for device-specific mechanical
work.

## 1. Measure the fit-critical geometry

Use calipers and perpendicular photographs. Record the measurement datum and
tool resolution, not only the number.

Measure first:

- maximum width, height, depth, clear-edge depth, and grip/endcap bulges;
- screen recess/glass/active-area bounds and corner radii;
- control centers, crown/cap sizes, recesses, bezels, LED rings, and heights;
- shoulder and trigger projection;
- port, switch, reset, microphone, speaker, and ventilation openings;
- seams, screw heads, feet, rear protrusions, and any surface a holder may
  contact;
- keep-outs needed to press a button, insert a cable, exhaust heat, or remove
  the DUT.

Do not measure a soft grip, cap, or curved end at one arbitrary point and call
it the maximum envelope. Sweep the caliper contact or use a perpendicular ruler
view to find the limiting surface.

Update the README provenance table immediately. Direct measurements normally
become **High** confidence; inherited or photographic details keep their lower
confidence until separately proven.

## 2. Iterate with precise visual feedback

Review in this order:

1. silhouette and envelope;
2. screen;
3. primary controls;
4. lower/system controls and speakers;
5. edge ports and controls;
6. labels and identity;
7. rear topology;
8. semantic highlights.

Describe the compared edges and direction. Prefer:

> Move Menu right until its outer bezel’s right edge equals the left stick
> LED-ring right edge.

Avoid:

> Move that button over a bit.

The agent should translate the feedback into a named coordinate or algebraic
constraint, change one relationship, rerender the fixed view, and preserve
approved areas. Record final coordinates in the README when they resolve a
visible or mechanical ambiguity.

## 3. Run the full proof

Close the OpenSCAD GUI if it contends with off-screen rendering, then run:

```bash
python3 .agents/skills/model-handheld-device/scripts/validate_model_package.py \
  device-models/<slug> \
  --photos /path/outside/git/to/private-reference-directory
```

Success includes:

```text
model_validation=PASS mode=full ... views=6
semantic=PASS controls=<count> atlas=pairwise-disjoint ...
comparison=PASS images=<count> metadata_chunks=0
```

Without private photographs, omit `--photos`; the deterministic and semantic
proof still runs. When runtime assets are part of a separate integration
change, also run:

```bash
python3 device-models/check-skin-drift.py
python3 device-models/<slug>/render.py --check
```

`render.py --check` is the canonical-host fidelity check and may expose
font/GPU differences on another host. Do not weaken it to make a noncanonical
machine green; record the host limitation and run it where the accepted assets
were generated.

## 4. Request explicit owner acceptance

Present:

- a committed candidate revision and its exact OpenSCAD source;
- front, rear, top, bottom, left, and right fixed views;
- useful close-ups and private comparison boards;
- semantic-control count and descriptor parity;
- deterministic view result and rectangle-overlap result;
- unresolved low-confidence or manufacturing-grade measurement gaps.

Do not infer approval from “close,” “looks better,” or silence. The work order’s
visual gate passes only when the owner explicitly approves that candidate
revision. Any later geometry or camera change reopens the gate.

## 5. Merge the source model

After approval:

1. rerun validation on the approved head;
2. confirm validation did not modify the approved source, then push the task
   branch;
3. open a PR with the required Summary, checked Test plan, and Related PRs;
4. satisfy repository CI and automated review;
5. merge through the required PR flow;
6. verify the approved commit is on `origin/main`;
7. remove the clean worktree, close the source-model Bead, and sync Beads.

## 6. Hand the accepted model downstream

| Consumer | Handoff |
| --- | --- |
| Device-specific DUT holder | Accepted fit envelope, contact surfaces, port/button/thermal keep-outs, orientation datums, and remaining tolerance risks |
| Runtime skin / virtual device | Semantic IDs, neutral/lit atlases, display rectangle, alternate views, and render metadata |
| Button visualizer or future actuator | Physical control centers, interactive crown/cap edges, travel/height measurements where available, and semantic IDs |
| Camera and fixture planning | Screen bounds, full silhouette, reflective surfaces, ports, vents, and service clearances |

Create separate tracked tasks for these consumers. A source-model approval does
not silently authorize printable holder geometry or runtime descriptor changes.

## Before fabricating the DUT holder

- [ ] The maximum shell/contact envelope is caliper-backed.
- [ ] Buttons, ports, vents, triggers, and cable paths have explicit keep-outs.
- [ ] The model README names every remaining fit uncertainty.
- [ ] Full deterministic and semantic validation passes.
- [ ] Private comparison output contains no copied metadata.
- [ ] The owner explicitly approved the exact merged source revision.
- [ ] The holder task consumes that merged revision rather than a working-tree
      copy.

Continue to [Build the test-node chassis](../test-node-chassis/index.md).
