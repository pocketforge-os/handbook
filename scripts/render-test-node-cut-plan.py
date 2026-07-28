#!/usr/bin/env python3
"""Render and verify the current test-node 1 m extrusion cut plan."""

from __future__ import annotations

import argparse
import csv
from collections import defaultdict
from decimal import Decimal
from html import escape
import json
from pathlib import Path
import sys


PART_PRESENTATION = {
    "outer_vertical_rail": ("post", "vertical post"),
    "outer_depth_rail": ("depth", "depth rail"),
    "outer_width_rail": ("width", "width rail"),
    "fixture_topbar": ("topbar", "fixture top bar"),
}
DISPOSITIONS = {"use-now", "reserve"}
ZERO = Decimal("0")


class CutPlanError(ValueError):
    """A deterministic cut-plan contract failure."""


def decimal_text(value: Decimal) -> str:
    text = format(value, "f")
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text


def load_plan(path: Path) -> dict:
    try:
        return json.loads(
            path.read_text(encoding="utf-8"),
            parse_float=Decimal,
            parse_int=Decimal,
        )
    except (OSError, json.JSONDecodeError) as error:
        raise CutPlanError(f"cannot read plan {path}: {error}") from error


def load_cut_list(path: Path) -> dict[str, tuple[int, Decimal]]:
    try:
        with path.open(encoding="utf-8", newline="") as stream:
            rows = list(csv.DictReader(stream))
    except OSError as error:
        raise CutPlanError(f"cannot read cut list {path}: {error}") from error

    expected_fields = {
        "part",
        "quantity",
        "finished_length_mm",
        "total_mm",
        "note",
    }
    if not rows or set(rows[0]) != expected_fields:
        raise CutPlanError("cut-list CSV fields changed")

    result: dict[str, tuple[int, Decimal]] = {}
    for row in rows:
        part = row["part"]
        if part in result:
            raise CutPlanError(f"duplicate cut-list part: {part}")
        try:
            quantity = int(row["quantity"])
            length = Decimal(row["finished_length_mm"])
            total = Decimal(row["total_mm"])
        except (ValueError, ArithmeticError) as error:
            raise CutPlanError(f"invalid cut-list row for {part}") from error
        if quantity <= 0 or length <= ZERO:
            raise CutPlanError(f"non-positive cut-list row for {part}")
        if total != quantity * length:
            raise CutPlanError(f"cut-list total drift for {part}")
        result[part] = (quantity, length)
    return result


def validate_plan(
    plan: dict, cut_list: dict[str, tuple[int, Decimal]]
) -> list[dict]:
    if plan.get("schema") != Decimal(1):
        raise CutPlanError("unsupported cut-plan schema")

    stock_length = plan.get("stock_length_mm")
    kerf = plan.get("kerf_mm")
    if not isinstance(stock_length, Decimal) or stock_length <= ZERO:
        raise CutPlanError("stock_length_mm must be positive")
    if not isinstance(kerf, Decimal) or kerf <= ZERO:
        raise CutPlanError("kerf_mm must be positive")

    bars = plan.get("bars")
    if not isinstance(bars, list) or not bars:
        raise CutPlanError("bars must be a non-empty list")

    active: dict[str, list[Decimal]] = defaultdict(list)
    active_labels: set[str] = set()
    normalized: list[dict] = []
    seen_numbers: set[int] = set()
    for raw_bar in bars:
        if not isinstance(raw_bar, dict):
            raise CutPlanError("each stock bar must be an object")
        raw_number = raw_bar.get("number")
        if not isinstance(raw_number, Decimal) or raw_number != int(raw_number):
            raise CutPlanError("stock bar number must be an integer")
        number = int(raw_number)
        if number <= 0 or number in seen_numbers:
            raise CutPlanError(f"invalid or duplicate stock bar number: {number}")
        seen_numbers.add(number)

        pieces = raw_bar.get("pieces")
        if not isinstance(pieces, list) or not pieces:
            raise CutPlanError(f"bar {number} has no pieces")

        consumed = ZERO
        normalized_pieces: list[dict] = []
        for index, raw_piece in enumerate(pieces, start=1):
            if not isinstance(raw_piece, dict):
                raise CutPlanError(f"bar {number} piece {index} is not an object")
            part = raw_piece.get("part")
            label = raw_piece.get("label")
            length = raw_piece.get("length_mm")
            disposition = raw_piece.get("disposition")
            if part not in PART_PRESENTATION:
                raise CutPlanError(f"unsupported part on bar {number}: {part!r}")
            if not isinstance(label, str) or not label.strip():
                raise CutPlanError(f"bar {number} piece {index} has no label")
            if not isinstance(length, Decimal) or length <= ZERO:
                raise CutPlanError(
                    f"bar {number} piece {index} has non-positive length"
                )
            if disposition not in DISPOSITIONS:
                raise CutPlanError(
                    f"bar {number} piece {index} has invalid disposition"
                )
            consumed += length + kerf
            if disposition == "use-now":
                if label.strip() in active_labels:
                    raise CutPlanError(
                        f"duplicate active piece label: {label.strip()}"
                    )
                active_labels.add(label.strip())
                active[part].append(length)
            normalized_pieces.append(
                {
                    "part": part,
                    "label": label.strip(),
                    "length": length,
                    "disposition": disposition,
                }
            )

        remainder = stock_length - consumed
        if remainder < ZERO:
            raise CutPlanError(
                f"bar {number} overruns stock by {decimal_text(-remainder)} mm"
            )
        normalized.append(
            {
                "number": number,
                "pieces": normalized_pieces,
                "remainder": remainder,
            }
        )

    if seen_numbers != set(range(1, len(bars) + 1)):
        raise CutPlanError("stock bar numbers must be consecutive from 1")

    actual_inventory = {
        part: (len(lengths), lengths[0])
        for part, lengths in active.items()
        if lengths
    }
    for part, lengths in active.items():
        if any(length != lengths[0] for length in lengths):
            raise CutPlanError(f"active piece lengths differ for {part}")
    if actual_inventory != cut_list:
        raise CutPlanError(
            "active inventory differs from authoritative cut list "
            f"(plan={actual_inventory!r}, cut_list={cut_list!r})"
        )
    return normalized


def svg_number(value: float) -> str:
    return f"{value:.3f}".rstrip("0").rstrip(".")


def render_svg(plan: dict, bars: list[dict]) -> str:
    stock_length: Decimal = plan["stock_length_mm"]
    kerf: Decimal = plan["kerf_mm"]
    canvas_width = 1120
    bar_x = 105.0
    bar_width = 900.0
    remainder_x = 1065.0
    row_height = 55.0
    first_row_y = 72.0
    bar_height = 40.0
    canvas_height = int(first_row_y + len(bars) * row_height + 116)
    scale = bar_width / float(stock_length)

    active_count = sum(
        piece["disposition"] == "use-now"
        for bar in bars
        for piece in bar["pieces"]
    )
    reserve_count = sum(
        piece["disposition"] == "reserve"
        for bar in bars
        for piece in bar["pieces"]
    )
    title = "Five-stick test-node chassis batch cut plan"
    description = (
        f"Five 1000 millimetre extrusion bars. Bars one through four each "
        "yield one 360 millimetre post, one 318 millimetre depth rail, and "
        "one 306 millimetre width rail, leaving 6.4 millimetres. Bar five "
        "yields one 306 millimetre top bar for this chassis and two reserved "
        "top bars, leaving 72.4 millimetres."
    )

    lines = [
        (
            f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'viewBox="0 0 {canvas_width} {canvas_height}" role="img" '
            'aria-labelledby="cut-plan-title cut-plan-desc">'
        ),
        f'  <title id="cut-plan-title">{escape(title)}</title>',
        f'  <desc id="cut-plan-desc">{escape(description)}</desc>',
        "  <style>",
        (
            "    text { font-family: ui-monospace, SFMono-Regular, Consolas, "
            "monospace; fill: #17212b; }"
        ),
        "    .stock { fill: #f5f3e8; stroke: #17212b; stroke-width: 2; }",
        "    .post { fill: #c95508; }",
        "    .depth { fill: #2f6f91; }",
        "    .width { fill: #4f8057; }",
        "    .topbar { fill: #694b94; }",
        "    .reserve { fill: #baa8d1; }",
        "    .kerf { fill: #17212b; }",
        "    .offcut { fill: #d8d8d2; }",
        (
            "    .piece-label { fill: white; font-size: 16px; font-weight: "
            "700; text-anchor: middle; }"
        ),
        "    .reserve-label { fill: #17212b; }",
        (
            "    .bar-label { font-size: 17px; font-weight: 700; "
            "text-anchor: end; dominant-baseline: middle; }"
        ),
        (
            "    .remainder-label { font-size: 14px; text-anchor: middle; "
            "dominant-baseline: middle; }"
        ),
        "    .legend { font-size: 15px; dominant-baseline: middle; }",
        "  </style>",
        (
            f'  <rect x="1" y="1" width="{canvas_width - 2}" '
            f'height="{canvas_height - 2}" rx="10" fill="#fbfaf2" '
            'stroke="#d5d8dc" stroke-width="2"/>'
        ),
        (
            '  <text x="105" y="28" font-size="22" font-weight="700">'
            "Current five-stick batch plan · every bar is 1000 mm</text>"
        ),
        (
            f'  <text x="105" y="50" font-size="15">Finished lengths; each '
            f'narrow black divider reserves {escape(decimal_text(kerf))} mm '
            "of saw kerf</text>"
        ),
    ]

    for row, bar in enumerate(bars):
        y = first_row_y + row * row_height
        lines.extend(
            [
                (
                    f'  <g class="stock-bar" data-stock-bar="{bar["number"]}" '
                    f'data-stock-length-mm="{escape(decimal_text(stock_length))}">'
                ),
                (
                    f'    <text class="bar-label" x="{svg_number(bar_x - 12)}" '
                    f'y="{svg_number(y + bar_height / 2)}">Bar '
                    f'{bar["number"]}</text>'
                ),
                (
                    f'    <rect class="stock" x="{svg_number(bar_x)}" '
                    f'y="{svg_number(y)}" width="{svg_number(bar_width)}" '
                    f'height="{svg_number(bar_height)}" rx="3"/>'
                ),
            ]
        )
        x = bar_x
        for piece in bar["pieces"]:
            piece_width = float(piece["length"]) * scale
            presentation_class = PART_PRESENTATION[piece["part"]][0]
            reserve_class = (
                " reserve" if piece["disposition"] == "reserve" else ""
            )
            label_class = (
                "piece-label reserve-label"
                if piece["disposition"] == "reserve"
                else "piece-label"
            )
            disposition_label = (
                decimal_text(piece["length"]) + " mm · RESERVE"
                if piece["disposition"] == "reserve"
                else decimal_text(piece["length"]) + " mm · USE NOW"
                if piece["part"] == "fixture_topbar"
                else decimal_text(piece["length"]) + " mm"
            )
            lines.extend(
                [
                    (
                        f'    <rect class="{presentation_class}{reserve_class}" '
                        f'x="{svg_number(x)}" y="{svg_number(y)}" '
                        f'width="{svg_number(piece_width)}" '
                        f'height="{svg_number(bar_height)}" '
                        f'data-part="{escape(piece["part"])}" '
                        f'data-label="{escape(piece["label"])}" '
                        f'data-disposition="{escape(piece["disposition"])}" '
                        f'data-length-mm="'
                        f'{escape(decimal_text(piece["length"]))}"/>'
                    ),
                    (
                        f'    <text class="{label_class}" '
                        f'x="{svg_number(x + piece_width / 2)}" '
                        f'y="{svg_number(y + 16)}">'
                        f'<tspan x="{svg_number(x + piece_width / 2)}">'
                        f'{escape(piece["label"])}</tspan>'
                        f'<tspan x="{svg_number(x + piece_width / 2)}" dy="16">'
                        f'{escape(disposition_label)}</tspan></text>'
                    ),
                ]
            )
            x += piece_width
            kerf_width = float(kerf) * scale
            lines.append(
                (
                    f'    <rect class="kerf" x="{svg_number(x)}" '
                    f'y="{svg_number(y)}" width="{svg_number(kerf_width)}" '
                    f'height="{svg_number(bar_height)}" data-kind="kerf" '
                    f'data-length-mm="{escape(decimal_text(kerf))}"/>'
                )
            )
            x += kerf_width

        remainder_width = float(bar["remainder"]) * scale
        lines.extend(
            [
                (
                    f'    <rect class="offcut" x="{svg_number(x)}" '
                    f'y="{svg_number(y)}" width="{svg_number(remainder_width)}" '
                    f'height="{svg_number(bar_height)}" data-kind="offcut" '
                    f'data-length-mm="'
                    f'{escape(decimal_text(bar["remainder"]))}"/>'
                ),
                (
                    f'    <text class="remainder-label" '
                    f'x="{svg_number(remainder_x)}" '
                    f'y="{svg_number(y + bar_height / 2)}">'
                    f'{escape(decimal_text(bar["remainder"]))} mm scrap</text>'
                ),
                "  </g>",
            ]
        )

    legend_y = first_row_y + len(bars) * row_height + 8
    legend_items = [
        ("post", "vertical post"),
        ("depth", "depth rail"),
        ("width", "width rail"),
        ("topbar", "top bar · use now"),
        ("reserve", "top bar · reserve"),
        ("offcut", "scrap"),
    ]
    legend_x = 105.0
    for css_class, label in legend_items:
        lines.extend(
            [
                (
                    f'  <rect class="{css_class}" x="{svg_number(legend_x)}" '
                    f'y="{svg_number(legend_y)}" width="16" height="16"/>'
                ),
                (
                    f'  <text class="legend" x="{svg_number(legend_x + 23)}" '
                    f'y="{svg_number(legend_y + 8)}">{escape(label)}</text>'
                ),
            ]
        )
        legend_x += 152.0 if css_class != "reserve" else 170.0

    footer_y = legend_y + 42
    lines.extend(
        [
            (
                f'  <text x="105" y="{svg_number(footer_y)}" font-size="15" '
                f'font-weight="700">{active_count} pieces build this chassis; '
                f'{reserve_count} top bars are labeled for later nodes.</text>'
            ),
            (
                f'  <text x="105" y="{svg_number(footer_y + 21)}" '
                'font-size="15">Already have one straight offcut at least '
                "309.2 mm long? Use it for TOPBAR and omit Bar 5.</text>"
            ),
            "</svg>",
            "",
        ]
    )
    return "\n".join(lines)


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--cut-list", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--write", action="store_true")
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    try:
        plan = load_plan(arguments.plan)
        cut_list = load_cut_list(arguments.cut_list)
        bars = validate_plan(plan, cut_list)
        rendered = render_svg(plan, bars)
        if arguments.check:
            try:
                current = arguments.output.read_text(encoding="utf-8")
            except OSError as error:
                raise CutPlanError(
                    f"cannot read rendered SVG {arguments.output}: {error}"
                ) from error
            if current != rendered:
                raise CutPlanError(
                    "rendered SVG is stale; rerun with --write and review the diff"
                )
        else:
            arguments.output.parent.mkdir(parents=True, exist_ok=True)
            arguments.output.write_text(rendered, encoding="utf-8")
    except CutPlanError as error:
        print(f"cut_plan=fail reason={error}", file=sys.stderr)
        return 1

    print(
        f"cut_plan=pass mode={'check' if arguments.check else 'write'} "
        f"bars={len(bars)} active_parts={sum(row[0] for row in cut_list.values())}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
