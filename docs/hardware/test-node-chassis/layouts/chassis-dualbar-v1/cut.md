# Cut the aluminum rails

<p class="pf-profile-banner" data-guide-device="trimui-smart-pro-s" data-layout-id="chassis-dualbar-v1"><strong>Compatible DUT:</strong> TrimUI Smart Pro S <span>·</span> <code>chassis-dualbar-v1</code></p>

The current chassis uses **4,548 mm** of finished 2020 extrusion. Finished
dimensions are aluminum lengths; do not add connector caps or blade kerf to a
requested length.

## Finished-piece inventory

| Label family | Quantity | Finished length | Use |
| --- | ---: | ---: | --- |
| `POST-*` | 4 | 360 mm | Outer vertical posts |
| `DEPTH-*` | 4 | 318 mm | Operator-to-device outer rails |
| `WIDTH-*` | 4 | 306 mm | Left-to-right outer rails |
| `FIXTURE-L`, `FIXTURE-U` | 2 | 306 mm | Continuous lower and upper fixture-support rails |

[Download the generated machine-readable cut list](../../../../assets/generated/test-node-chassis/dualbar/cut-list.csv).

## Five-stick cut plan

<div class="pf-cut-plan-scroll" role="region"
     aria-label="Five-stick cut-plan diagram; scroll horizontally on a narrow screen"
     tabindex="0">
  <img class="pf-cut-plan-image"
       src="../../../../../assets/test-node-chassis-cut-plan.svg"
       alt="Five 1000 mm aluminum bars divided into four labeled outer-frame sets and one lower-and-upper fixture-bar pair, with 3.2 mm kerfs and every remainder shown to scale">
</div>
<p class="pf-cut-plan-scroll-hint">Swipe sideways to inspect every scaled segment.</p>

Bars 1–4 make the outer frame. Bar 5 makes both fixture-support rails and
leaves a straight **381.6 mm** offcut that is long enough to become one
fixture bar on a later chassis.

| Stock bar | Cuts, in order | Conservative remainder |
| ---: | --- | ---: |
| 1 | `POST-OL` 360, `DEPTH-L-L` 318, `WIDTH-O-L` 306 mm | 6.4 mm |
| 2 | `POST-OR` 360, `DEPTH-R-L` 318, `WIDTH-O-U` 306 mm | 6.4 mm |
| 3 | `POST-DL` 360, `DEPTH-L-U` 318, `WIDTH-D-L` 306 mm | 6.4 mm |
| 4 | `POST-DR` 360, `DEPTH-R-U` 318, `WIDTH-D-U` 306 mm | 6.4 mm |
| 5 | `FIXTURE-L` 306, `FIXTURE-U` 306 mm | 381.6 mm |

The four frame sticks are already 99.36% allocated: their four 6.4 mm
remainders total only **25.6 mm**. They cannot supply a fixture bar.

## Use qualifying scrap first

Each fixture bar needs one straight, undamaged 2020 offcut at least
**309.2 mm** long: 306 mm finished length plus the conservative 3.2 mm kerf
allowance.

- With **two qualifying offcuts**, make `FIXTURE-L` and `FIXTURE-U` from
  scrap. Four fresh sticks then supply the complete outer frame; Bar 5 is not
  needed.
- With **one qualifying offcut**, use it. A fifth fresh stick is still needed
  for the second fixture bar, but cutting only one 306 mm piece preserves a
  **690.8 mm** remainder.
- The known 356.4 mm retained offcut makes one fixture bar and leaves 47.2 mm.
  It cannot make the matched pair by itself.

Each fresh outer-frame stick packs:

`360 mm post + 318 mm depth rail + 306 mm width rail + three 3.2 mm kerfs`

That consumes 993.6 mm and leaves 6.4 mm.

## If all stock is new

Use four sticks for the outer frame. On the fifth stick:

- **one chassis:** cut two 306 mm fixture bars, consuming 618.4 mm including
  kerfs and leaving the reusable **381.6 mm** offcut shown above; or
- **batch work:** cut three 306 mm fixture bars, consuming 927.6 mm and
  leaving **72.4 mm**. Use two now and label the third as the first fixture
  bar for the next chassis.

The one-chassis plan reserves 14 kerfs, or 44.8 mm total, and leaves
**407.2 mm** across all five sticks.

## Mark before cutting

Use removable tape or a fine marker:

| Finished part | Label |
| --- | --- |
| Operator lower / upper width rails | `WIDTH-O-L`, `WIDTH-O-U` |
| Device lower / upper width rails | `WIDTH-D-L`, `WIDTH-D-U` |
| Left lower / upper depth rails | `DEPTH-L-L`, `DEPTH-L-U` |
| Right lower / upper depth rails | `DEPTH-R-L`, `DEPTH-R-U` |
| Operator-left / operator-right posts | `POST-OL`, `POST-OR` |
| Device-left / device-right posts | `POST-DL`, `POST-DR` |
| Lower / upper fixture-support rails | `FIXTURE-L`, `FIXTURE-U` |

## Cut procedure

1. Measure the actual stock and choose one square factory end as the datum.
2. Mark every finished piece and its identity before starting the saw.
3. Clamp the aluminum rail and align the blade on the waste side of the mark.
4. Make one witnessed cut and measure it before batch cutting.
5. Measure each next piece from the new clean end.
6. Deburr the cut and all slot openings immediately.
7. Verify the finished length and label before placing the part in the
   completed pile.

Kerf is the material removed by the blade. Do not add it to the finished
dimension: mark 360 mm, put the blade on the waste side, then verify that the
resulting post is 360 mm. The stock plan's 3.2 mm allowance protects only the
packing calculation.

!!! warning "Both fixture bars are continuous"
    Use two straight 306 mm pieces. Do not join shorter offcuts or place a
    printed connector in either fixture load path.

## Cut gate

- [ ] 4 × 360 mm posts.
- [ ] 4 × 318 mm depth rails.
- [ ] 4 × 306 mm width rails.
- [ ] 1 × continuous 306 mm `FIXTURE-L`.
- [ ] 1 × continuous 306 mm `FIXTURE-U`.
- [ ] Every cut is square, deburred, measured, and labeled.
- [ ] Every reusable offcut or extra fixture bar is labeled and retained.

Next: [assemble the chassis](assemble/index.md).
