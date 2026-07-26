# Build the semantic model

Use the repository skill to turn the evidence set into one reviewable,
source-owned OpenSCAD package. Work from the `platform` repository root so
Codex discovers the checked-in skill.

## 1. Enter the task worktree

Follow the PocketForge Beads and worktree workflow:

```bash
bd dolt pull
bd show <bead-id>
bd update <bead-id> --claim
pf-wt create <bead-id> --repos platform
cd ~/wt/<bead-id>/platform
```

Success is a clean branch named for the Bead, rooted at current `origin/main`.
Never build a model in the shared checkout.

## 2. Give the agent a complete prompt

Replace every bracketed field:

```text
Use $model-handheld-device to build the source-owned semantic OpenSCAD model
for [manufacturer, product name, exact model/revision] as PocketForge device
ID [id].

Evidence:
- Public sources: [URLs and what each proves]
- Private owner photos: [external directory outside git, or "not available yet"]
- Measured values: [values and datums]
- Missing in-hand measurements: [explicit list]

Baseline: [accepted device-model package, or "new chassis"]. Preserve accepted
shared geometry unless evidence proves a visible difference.

Semantic controls: [descriptor path and expected drawable IDs].
Scope this task to the source model, README, deterministic renderer, and
privacy-safe comparison tool. Do not wire runtime skins in this task.

Create the six fixed evidence views, run the skill validator in quick mode,
open the exact worktree SCAD in OpenSCAD for review, and keep the owner visual
gate open until I explicitly approve it.
```

Codex will load
`.agents/skills/model-handheld-device/SKILL.md`, its evidence checklist, its
PocketForge contract, and the validator. For an agent that does not discover
repo skills automatically, tell it to read those files before editing.

## 3. Keep the package shape stable

Create:

```text
device-models/<slug>/
├── <slug>.scad
├── README.md
├── render.py
└── compare.py
```

| File | Owns |
| --- | --- |
| `<slug>.scad` | Millimetre geometry, materials, assembly/shell/control selectors, semantic highlights |
| `README.md` | Identity, lineage, coordinate system, evidence, dimensions, confidence, commands, limits |
| `render.py` | Fixed cameras, six evidence views, neutral/lit semantic atlases and metadata |
| `compare.py` | External-photo decoding and newly encoded metadata-free comparisons |

Do not put private images, evidence output, downloaded meshes, or process notes
inside this package.

## 4. Preserve the semantic OpenSCAD contract

Unless an accepted baseline documents otherwise, use X left-to-right, Y
bottom-to-top, and Z rear-to-front. Support:

```text
PART="assembly"                 complete colored device
PART="shell"                    non-interactive geometry
PART="controls"                 all semantic controls
PART="control" CONTROL_ID="…"  one semantic control
HIGHLIGHT="" | "*" | "…"       neutral, all, or one control
QUALITY="draft" | "render"      preview or final tessellation
```

Model a button crown separately from its recess, bezel, or LED ring when those
edges carry different alignment or clearance meaning. Decorative logos,
legends, speakers, vents, and ports are not semantic controls.

`render.py`’s `CONTROL_IDS`, derived metadata controls, and the descriptor’s
`[skin.parts]` keys must agree. A logical L3/R3 input may reuse the visible
`stick_l` or `stick_r` part when the hardware and descriptor intentionally do
so; do not invent a second invisible visual control.

## 5. Build in review order

Implement and review one coherent relationship at a time:

1. measured or published shell silhouette and depth;
2. screen recess, glass, active area, and bezel;
3. D-pad, sticks, LED rings, and face buttons;
4. menu, guide, Home, Select, Start, speakers, and status marks;
5. top, bottom, left, and right ports, keys, switches, and legends;
6. rear vents, screws, feet, seams, and identity;
7. semantic highlighting and alternate clickable views.

Express alignments as relationships instead of unrelated magic numbers. Keep
already accepted geometry fixed while changing a new-device delta.

## 6. Run the quick proof

From the platform root:

```bash
python3 .agents/skills/model-handheld-device/scripts/validate_model_package.py \
  device-models/<slug> --quick
```

Success ends with:

```text
model_validation=PASS mode=quick ... views=6
```

The quick pass compile-checks the Python tools, runs OpenSCAD with hard
warnings, and generates all six evidence views. Also render a retained review
set outside the repository:

```bash
python3 device-models/<slug>/render.py \
  --views /tmp/<slug>-evidence
```

Open `device-models/<slug>/<slug>.scad` in OpenSCAD and use the fixed evidence
views for comparison. The perspective viewport alone is not an alignment test.

## First-pass review gate

- [ ] The silhouette and nominal envelope agree with the strongest evidence.
- [ ] The screen and interactive edges are distinguishable from decorative
      rings and recesses.
- [ ] All expected physical controls can render independently.
- [ ] Six fixed views render without hard warnings.
- [ ] The README lists every provisional or missing in-hand measurement.
- [ ] The exact worktree source is open for owner review.

If the device has not arrived, stop here with a documented remote-evidence
first pass. Resume at [Refine and accept the model](refine-and-accept.md).
