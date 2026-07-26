# Gather model evidence

Build the strongest useful evidence set available now. Do not wait for the
device to arrive before making a reviewable first pass, and do not hide missing
measurements behind precise-looking millimetre values.

## 1. Lock the identity

Record all of these in the work order:

- manufacturer and exact product name;
- printed model number, regulatory ID, and hardware revision when known;
- colorway when it changes visible materials or markings;
- proposed PocketForge device ID and descriptor path;
- whether the requested output is source model only or also runtime skin
  integration.

Treat similarly named revisions as different devices until evidence proves
they share a chassis. A new processor in an unchanged shell may be a derivative;
a revised cooling system, Home key, port, or control layout still needs an
explicit visible delta.

## 2. Search the accepted library first

From the `platform` repository root:

```bash
rg --files device-models devices skins
rg -n "CONTROL_IDS|PART=|HIGHLIGHT|MODEL_RENDERERS" device-models skins
```

Choose the baseline in this order:

1. the same chassis or a documented hardware revision;
2. a sibling product with the same enclosure and controls;
3. the closest accepted semantic model;
4. a clean model built from measurements and references.

When a shared chassis exists, derive from it. Preserve accepted dimensions,
cameras, and semantic behavior; model only the proven differences. This makes
review easier and prevents two approximations of the same shell from drifting.

## 3. Research public evidence

Prefer sources in this order:

| Priority | Evidence | Typical use |
| ---: | --- | --- |
| 1 | Official mechanical drawing, manual, specification, or product page | Nominal envelope, screen, controls, ports |
| 2 | Regulatory filing | Perpendicular exterior and internal/rear views |
| 3 | Teardown or manufacturer multi-view photography | Seams, vents, controls, hidden faces |
| 4 | Reputable retailer photography | Visual corroboration and color/marking variants |
| 5 | Community measurements or licensed public model | Cross-checking only unless scale, provenance, and license are sound |
| 6 | Perspective-photo ratios | Temporary low-confidence estimates |

Save the source URL, retrieval date, named feature, and redistribution license
where applicable. Do not import a public mesh merely because it looks close.
Use unlicensed or uncertain models only as visual corroboration.

## 4. Assemble the view set

Collect:

- near-orthographic front and rear views;
- top, bottom, left, and right edge views;
- close-ups of the screen, D-pad, sticks, face and system buttons;
- shoulder/trigger, speaker, vent, screw, foot, label, port, switch, pinhole,
  and reset-key details;
- at least one trustworthy physical dimension that can scale each photographed
  plane.

Phone photographs are most useful when the lens is centered on the face, the
sensor plane is parallel to it, and the device fills the frame without
wide-angle distortion. Include a ruler in a separate perpendicular frame when
calipers cannot reach a feature.

## 5. Keep owner references private

Store original owner photographs outside the worktree and repository. Record
only non-sensitive filenames or a task-local external directory. The model
renderer must never read those photographs.

The comparison tool may:

- apply EXIF orientation while decoding;
- read RGB pixels from the external directory;
- write newly encoded PNG comparison boards.

It must not commit an original, crop, transformed copy, texture, EXIF block,
XMP/IPTC data, PNG text/comment chunk, or sensitive absolute path.

## 6. Record confidence while measuring

Begin the model README’s provenance table before editing geometry:

| Feature | Value used | Evidence | Confidence |
| --- | ---: | --- | --- |
| Overall envelope | 188 × 80 × 17 mm | Official specification | High as nominal; fit depth still unmeasured |
| Stick center | 0.125 × device width | Two perpendicular product views | Medium |
| Rear vent pitch | Visual estimate | One oblique retailer image | Low |

Use **High**, **Medium-high**, **Medium**, or **Low** consistently. Say which
edge or datum a value describes. “Aligned to the stick” is ambiguous;
“button-bezel right edge equals stick LED-ring right edge” is reviewable.

## 7. Write the source-model work order

The Bead must name:

- exact identity and descriptor;
- selected baseline and why it is valid;
- public sources and external private-reference location;
- paths under `platform/device-models/<slug>/`;
- expected semantic controls;
- remote-evidence and in-hand acceptance gates;
- validation commands and explicit owner visual approval;
- a separate downstream runtime-skin task.

Use an `exec` worker tier for a bounded, well-specified modeling implementation.
Leave unattended autonomy unset because visual acceptance contains an owner
judgment. Claim the Bead before creating its worktree.

## Remote-evidence gate

- [ ] Identity, device ID, semantic controls, and scope are fixed.
- [ ] Existing accepted models were checked before choosing a baseline.
- [ ] Every public source has provenance and usable licensing notes.
- [ ] Six exterior directions and the important close-ups are represented, or
      each missing view is called out.
- [ ] The initial provenance table distinguishes measured, published,
      inherited, and photo-derived dimensions.
- [ ] Private originals remain outside git.

Continue to [Build the semantic model](build-model.md).
