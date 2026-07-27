# Cut the Smart Pro S top-bar rails

This candidate uses **4,242 mm** of finished extrusion—**962 mm less** than
the qualified gantry chassis. Finished dimensions are aluminum lengths; do
not add connector caps or kerf to a requested length.

![Front view of the top-bar candidate](../../../assets/generated/test-node-chassis/topbar/layout-front.png)

## Finished-piece inventory

| Label family | Quantity | Finished length | Use |
| --- | ---: | ---: | --- |
| `POST-*` | 4 | 360 mm | Outer vertical posts |
| `DEPTH-*` | 4 | 318 mm | Operator-to-device outer rails |
| `WIDTH-*` | 4 | 306 mm | Left-to-right outer rails |
| `TOPBAR` | 1 | 306 mm | Continuous movable fixture support |

There are no 164 mm upright halves, second fixture crossbar, or spliced
fixture rails in this layout.

## Use qualifying scrap first

Before opening another stick, look for a straight, undamaged 2020 offcut at
least **309.2 mm** long: 306 mm finished length plus the conservative 3.2 mm
kerf allowance. The **356.4 mm** offcut retained by the qualified six-stick
plan is ideal. It yields one top bar and leaves 47.2 mm.

With that offcut, buy or cut only four fresh 1 m sticks. Each fresh stick
packs:

`360 mm post + 318 mm depth rail + 306 mm width rail + three 3.2 mm kerfs`

That consumes 993.6 mm and leaves 6.4 mm per stick.

## If all stock is new

Four sticks still supply the outer frame using the packing above. The fifth
stick has two useful choices:

- single-node fallback: cut one 306 mm top bar; 309.2 mm is consumed and
  690.8 mm remains; or
- preferred batch route: cut **three** 306 mm top bars; 927.6 mm is consumed
  and **72.4 mm** remains. Use one now and label two for the next chassis
  builds.

The generated source plan reserves 13 kerfs, or 41.6 mm total, and leaves
716.4 mm across five fresh sticks in the single-node fallback.

[Download the generated top-bar cut list](../../../assets/generated/test-node-chassis/topbar/cut-list.generated.txt)
or its [machine-readable CSV](../../../assets/generated/test-node-chassis/topbar/cut-list.csv).

## Cut and label

Use the same saw-safety, waste-side marking, witnessed first cut, deburring,
and measurement procedure as the [qualified cut guide](../cut.md#cut-procedure).
Keep its outer-frame tape labels. Add `TOPBAR` to the continuous fixture bar.

!!! warning "Never splice the top bar"
    Use one straight 306 mm piece. A butt joint, printed collar, or hidden
    splice would put the fixture load into an unqualified interface.

## Cut gate

- [ ] 4 × 360 mm posts.
- [ ] 4 × 318 mm depth rails.
- [ ] 4 × 306 mm width rails.
- [ ] 1 × continuous 306 mm `TOPBAR`.
- [ ] No gantry upright halves or second fixture crossbar were cut.
- [ ] Every cut is square, deburred, measured, and labeled.
- [ ] Remaining pieces long enough for another top bar are labeled and
      retained.

Next: [generate and print the candidate pack](print.md).
