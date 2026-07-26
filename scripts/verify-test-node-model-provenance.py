#!/usr/bin/env python3
"""Verify the generated test-node model provenance and semantic layer contract."""

from __future__ import annotations

import argparse
import json
import pathlib
from collections.abc import Sequence


PRE_BPI_REVISIONS = {
    "c53312769ec9542e3b5293a96e13b978fac69f78",
    "ef69746be01561e1d709ce1a9929f3acb75d6721",
}

# This is the immutable source pin on handbook main while the ESP32 consumer
# contract lands. Every later/unlisted revision must publish the ESP32 layers.
BPI_ONLY_REVISIONS = {
    "4dd6dc261466249d4aed4f73ee690e3f9d8f8da6",
}

BASE_LAYERS = {
    "aluminum",
    "connectors",
    "printed-hardware",
    "fixture-plate",
    "fixture-components",
    "fixture-labels",
    "carrier-body",
    "carrier-labels",
    "carrier-hooks",
    "device-shell",
    "device-controls",
    "device-screen",
    "webcam",
    "power-strip",
    "placard-holder",
    "placard-insert",
    "placard-labels",
    "camera-frustum",
}

BPI_LAYERS = {
    "fixture-bpi-pcb",
    "fixture-bpi-dark",
    "fixture-bpi-metal",
    "fixture-bpi-gold",
    "fixture-bpi-silkscreen",
}

ESP32_LAYERS = {
    "fixture-esp32-pcb",
    "fixture-esp32-dark",
    "fixture-esp32-metal",
    "fixture-esp32-gold",
    "fixture-esp32-antenna",
    "fixture-esp32-silkscreen",
}


def expected_layers(revision: str) -> set[str]:
    """Return the exact semantic layer contract for a source revision."""
    if revision in PRE_BPI_REVISIONS:
        return BASE_LAYERS
    if revision in BPI_ONLY_REVISIONS:
        return BASE_LAYERS | BPI_LAYERS
    return BASE_LAYERS | BPI_LAYERS | ESP32_LAYERS


def verify_provenance(
    provenance: object,
    expected_revision: str,
    *,
    allow_dirty: bool = False,
) -> None:
    """Raise SystemExit when provenance violates the publication contract."""
    if not isinstance(provenance, dict):
        raise SystemExit("generated model provenance is not an object")
    if provenance.get("source_revision") != expected_revision:
        raise SystemExit("generated model provenance names the wrong revision")
    if provenance.get("source_dirty") and not allow_dirty:
        raise SystemExit("generated model provenance is dirty")

    semantic_layers = provenance.get("semantic_layers")
    if (
        not isinstance(semantic_layers, Sequence)
        or isinstance(semantic_layers, (str, bytes))
        or not all(isinstance(layer, str) for layer in semantic_layers)
    ):
        raise SystemExit("generated model semantic_layers is not a string list")

    actual_layers = set(semantic_layers)
    if len(actual_layers) != len(semantic_layers):
        raise SystemExit("generated model has duplicate semantic layers")

    required_layers = expected_layers(expected_revision)
    missing_layers = required_layers - actual_layers
    unexpected_layers = actual_layers - required_layers
    if missing_layers or unexpected_layers:
        details = []
        if missing_layers:
            details.append("missing: " + ", ".join(sorted(missing_layers)))
        if unexpected_layers:
            details.append("unexpected: " + ", ".join(sorted(unexpected_layers)))
        raise SystemExit(
            "generated model semantic layer contract changed (" + "; ".join(details) + ")"
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("provenance", type=pathlib.Path)
    parser.add_argument("expected_revision")
    parser.add_argument("--allow-dirty", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    provenance = json.loads(args.provenance.read_text(encoding="utf-8"))
    verify_provenance(
        provenance,
        args.expected_revision,
        allow_dirty=args.allow_dirty,
    )


if __name__ == "__main__":
    main()
