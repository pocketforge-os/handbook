# Cut the aluminum rails

The current chassis uses **4,242 mm** of finished 2020 extrusion. Finished
dimensions are aluminum lengths; do not add connector caps or blade kerf to a
requested length.

## Finished-piece inventory

| Label family | Quantity | Finished length | Use |
| --- | ---: | ---: | --- |
| `POST-*` | 4 | 360 mm | Outer vertical posts |
| `DEPTH-*` | 4 | 318 mm | Operator-to-device outer rails |
| `WIDTH-*` | 4 | 306 mm | Left-to-right outer rails |
| `TOPBAR` | 1 | 306 mm | Continuous fixture-support rail |

[Download the generated machine-readable cut list](../../assets/generated/test-node-chassis/topbar/cut-list.csv).

## Use qualifying scrap first

Look for one straight, undamaged 2020 offcut at least **309.2 mm** long:
306 mm finished length plus the conservative 3.2 mm kerf allowance. Use it for
`TOPBAR`. Four fresh 1 m sticks then supply the complete outer frame.

Each fresh outer-frame stick packs:

`360 mm post + 318 mm depth rail + 306 mm width rail + three 3.2 mm kerfs`

That consumes 993.6 mm and leaves 6.4 mm.

## If all stock is new

Use four sticks for the outer frame. On the fifth stick, choose one of:

- **single build:** cut one 306 mm top bar, consuming 309.2 mm and leaving
  690.8 mm; or
- **batch builds:** cut three 306 mm top bars, consuming 927.6 mm and leaving
  **72.4 mm**. Use one now and label two for the next chassis builds.

The five-stick single-build plan reserves 13 kerfs, or 41.6 mm total, and
leaves 716.4 mm across all five sticks.

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
| Fixture-support rail | `TOPBAR` |

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

!!! warning "The top bar is continuous"
    Use one straight 306 mm piece. Do not join two shorter offcuts or place a
    printed connector in the fixture load path.

## Cut gate

- [ ] 4 × 360 mm posts.
- [ ] 4 × 318 mm depth rails.
- [ ] 4 × 306 mm width rails.
- [ ] 1 × continuous 306 mm `TOPBAR`.
- [ ] Every cut is square, deburred, measured, and labeled.
- [ ] Extra 306 mm top bars and any useful offcuts are labeled and retained.

Next: [assemble the chassis](assemble/index.md).
