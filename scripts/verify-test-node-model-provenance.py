#!/usr/bin/env python3
"""Verify the generated test-node model provenance and semantic layer contract."""

from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import struct
from collections.abc import Sequence


PRE_BPI_REVISIONS = {
    "c53312769ec9542e3b5293a96e13b978fac69f78",
    "ef69746be01561e1d709ce1a9929f3acb75d6721",
}

# This is the immutable source pin on handbook main while the ESP32 consumer
# contract lands.
BPI_ONLY_REVISIONS = {
    "4dd6dc261466249d4aed4f73ee690e3f9d8f8da6",
}

# This is the immutable source pin on handbook main while the C270 consumer
# contract lands. Every later/unlisted revision must publish the exact C270
# material layers instead of the historical webcam proxy.
ESP32_ONLY_REVISIONS = {
    "4425ef39a40ab53a426693cd0bf07df6b6c53b66",
}

# This is the immutable source pin on handbook main while the ELEGOO relay
# consumer contract lands. Every later/unlisted revision must publish the
# six exact relay material layers instead of the historical relay proxy.
C270_ONLY_REVISIONS = {
    "e05824d27773f7ee495b597d297839d3b2c54b44",
}

# This is the immutable source pin on handbook main while the HiLetgo XL6009
# consumer contract lands. Every later/unlisted revision must publish the
# five exact boost-module material layers instead of the historical proxy.
RELAY_ONLY_REVISIONS = {
    "f9cad6f9987eb298546033111698fbcf5192eb10",
}

# This is the immutable source pin on handbook main while the ALIENTEK DP100
# consumer contract lands. Every later/unlisted revision must publish the
# seven exact DP100 material layers instead of the historical proxy.
BOOST_ONLY_REVISIONS = {
    "36e1b40a368f974a1fb445abf17d425b4e54d79d",
}

# This is the immutable source pin on handbook main while the Ceksezx
# MTSD001 consumer contract lands. Every later/unlisted revision must publish
# the six exact MOSFET-module material layers instead of the historical proxy.
DP100_ONLY_REVISIONS = {
    "291203fadee59c268e83772676212505f0a65d2d",
    "d2b526a48f90fe625eba3f31d186fdb08cf1a85c",
}

# These are the immutable MTSD001-era source revisions on handbook main while
# the final antenna and dual USB-hub consumer contract lands. Every
# later/unlisted revision must publish the 13 exact final-component material
# layers instead of the historical antenna and hub proxies.
MOSFET_ONLY_REVISIONS = {
    "5f3bb2d5c51cda7157befea43fd782bf0759aa7e",
    "0ac32466887ff00950748c2fb8983a31b1409bb6",
}

FINAL_COMPONENT_REVISIONS = {
    "ad29d37a787cba645b3e7f56338d6d603b6992f3",
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

C270_LAYERS = {
    "webcam-shell",
    "webcam-dark",
    "webcam-glass",
    "webcam-led",
    "webcam-labels",
}

RELAY_LAYERS = {
    "fixture-relay-pcb",
    "fixture-relay-blue",
    "fixture-relay-dark",
    "fixture-relay-metal",
    "fixture-relay-led",
    "fixture-relay-silkscreen",
}

BOOST_LAYERS = {
    "fixture-boost-pcb",
    "fixture-boost-dark",
    "fixture-boost-adjuster",
    "fixture-boost-metal",
    "fixture-boost-silkscreen",
}

DP100_LAYERS = {
    "fixture-dp100-shell",
    "fixture-dp100-dark",
    "fixture-dp100-controls",
    "fixture-dp100-screen",
    "fixture-dp100-accent",
    "fixture-dp100-metal",
    "fixture-dp100-markings",
}

MOSFET_LAYERS = {
    "fixture-mosfet-pcb",
    "fixture-mosfet-blue",
    "fixture-mosfet-dark",
    "fixture-mosfet-metal",
    "fixture-mosfet-led",
    "fixture-mosfet-silkscreen",
}

FINAL_COMPONENT_LAYERS = {
    "fixture-antenna-dark",
    "fixture-antenna-metal",
    "fixture-antenna-markings",
    "fixture-vienon-shell",
    "fixture-vienon-dark",
    "fixture-vienon-metal",
    "fixture-vienon-blue",
    "fixture-vienon-led",
    "fixture-smays-shell",
    "fixture-smays-dark",
    "fixture-smays-metal",
    "fixture-smays-led",
    "fixture-smays-markings",
}

HISTORICAL_SCHEMA1_REVISIONS = (
    PRE_BPI_REVISIONS
    | BPI_ONLY_REVISIONS
    | ESP32_ONLY_REVISIONS
    | C270_ONLY_REVISIONS
    | RELAY_ONLY_REVISIONS
    | BOOST_ONLY_REVISIONS
    | DP100_ONLY_REVISIONS
    | MOSFET_ONLY_REVISIONS
    | FINAL_COMPONENT_REVISIONS
)

CURRENT_SCENE = {
    "device_slug": "trimui-smart-pro-s",
    "chassis_variant": "dualbar_v1",
    "layout_id": "chassis-dualbar-v1",
    "layout_record": "mechanical/device-packs/layouts/chassis-dualbar-v1.json",
    "device_registry": "mechanical/device-packs/device-layouts.json",
    "qualification": {
        "status": "physically_qualified",
        "acceptance_ref": "tsp-t1zd.2",
    },
}

DEVICE_MODEL_COMMIT = "80662c40bd7d878a19127899760bdafb1f149173"
DEVICE_MODEL_SHA256 = (
    "0d5c8153639537d5e70941492ad2cc930f5fb1c93f3694e9a160f5770693224d"
)
DEVICE_MODEL_URL = (
    "https://raw.githubusercontent.com/pocketforge-os/platform/"
    f"{DEVICE_MODEL_COMMIT}/device-models/trimui-smart-pro-s/"
    "trimui-smart-pro-s.scad"
)


def expected_layers(revision: str) -> set[str]:
    """Return the exact semantic layer contract for a source revision."""
    if revision in PRE_BPI_REVISIONS:
        return BASE_LAYERS
    if revision in BPI_ONLY_REVISIONS:
        return BASE_LAYERS | BPI_LAYERS
    if revision in ESP32_ONLY_REVISIONS:
        return BASE_LAYERS | BPI_LAYERS | ESP32_LAYERS
    c270_layers = (
        (BASE_LAYERS - {"webcam"})
        | BPI_LAYERS
        | ESP32_LAYERS
        | C270_LAYERS
    )
    if revision in C270_ONLY_REVISIONS:
        return c270_layers
    relay_layers = c270_layers | RELAY_LAYERS
    if revision in RELAY_ONLY_REVISIONS:
        return relay_layers
    boost_layers = relay_layers | BOOST_LAYERS
    if revision in BOOST_ONLY_REVISIONS:
        return boost_layers
    dp100_layers = boost_layers | DP100_LAYERS
    if revision in DP100_ONLY_REVISIONS:
        return dp100_layers
    mosfet_layers = dp100_layers | MOSFET_LAYERS
    if revision in MOSFET_ONLY_REVISIONS:
        return mosfet_layers
    return mosfet_layers | FINAL_COMPONENT_LAYERS


def valid_sha256(value: object) -> bool:
    return (
        isinstance(value, str)
        and len(value) == 64
        and all(character in "0123456789abcdef" for character in value)
    )


def verify_current_scene(provenance: dict, actual_layers: set[str]) -> None:
    if provenance.get("schema") != 2:
        raise SystemExit("current generated model provenance must use schema 2")
    if (
        provenance.get("source_repository")
        != "https://github.com/pocketforge-os/test-node-hw"
        or provenance.get("coordinate_transform")
        != "OpenSCAD mm Z-up -> glTF m Y-up"
    ):
        raise SystemExit("current generated model source contract changed")

    scene = provenance.get("scene")
    if not isinstance(scene, dict):
        raise SystemExit("current generated model has no scene contract")
    for key, expected_value in CURRENT_SCENE.items():
        if scene.get(key) != expected_value:
            raise SystemExit(
                f"current generated model scene {key} changed: "
                f"{scene.get(key)!r} != {expected_value!r}"
            )
    for digest_name in ("layout_sha256", "device_registry_sha256"):
        if not valid_sha256(scene.get(digest_name)):
            raise SystemExit(
                f"current generated model has invalid {digest_name}"
            )

    expected_device_model = {
        "source_repository": DEVICE_MODEL_URL,
        "source_commit": DEVICE_MODEL_COMMIT,
        "source_sha256": DEVICE_MODEL_SHA256,
    }
    if scene.get("device_model") != expected_device_model:
        raise SystemExit("current generated model device-model pin changed")

    layer_hashes = provenance.get("layer_sha256")
    if not isinstance(layer_hashes, dict) or set(layer_hashes) != actual_layers:
        raise SystemExit("current generated model layer hashes changed shape")
    if not all(valid_sha256(value) for value in layer_hashes.values()):
        raise SystemExit("current generated model has an invalid layer hash")
    if not valid_sha256(provenance.get("model_sha256")):
        raise SystemExit("current generated model has an invalid model hash")

    extents = provenance.get("model_extents_metres")
    if (
        not isinstance(extents, list)
        or len(extents) != 3
        or not all(
            isinstance(value, (int, float)) and 0.05 < value < 1.0
            for value in extents
        )
    ):
        raise SystemExit("current generated model has invalid metre extents")


def read_glb_json(path: pathlib.Path) -> dict:
    data = path.read_bytes()
    if len(data) < 20:
        raise SystemExit("generated model GLB is truncated")
    magic, version, declared_length = struct.unpack_from("<4sII", data)
    if magic != b"glTF" or version != 2 or declared_length != len(data):
        raise SystemExit("generated model GLB header changed")
    chunk_length, chunk_type = struct.unpack_from("<I4s", data, 12)
    if chunk_type != b"JSON":
        raise SystemExit("generated model GLB has no leading JSON chunk")
    chunk = data[20 : 20 + chunk_length].rstrip(b" \x00")
    return json.loads(chunk.decode("utf-8"))


def verify_glb(
    model: pathlib.Path,
    provenance: dict,
    actual_layers: set[str],
) -> None:
    model_digest = hashlib.sha256(model.read_bytes()).hexdigest()
    if model_digest != provenance.get("model_sha256"):
        raise SystemExit("generated model GLB hash does not match provenance")

    gltf = read_glb_json(model)
    node_names = {
        node.get("name")
        for node in gltf.get("nodes", [])
        if isinstance(node.get("name"), str)
    }
    expected_node_names = actual_layers | {"world"}
    if node_names != expected_node_names:
        missing = sorted(expected_node_names - node_names)
        unexpected = sorted(node_names - expected_node_names)
        raise SystemExit(
            "generated model GLB semantic nodes changed "
            f"(missing={missing!r}, unexpected={unexpected!r})"
        )
    nodes = gltf.get("nodes", [])
    world_nodes = [
        (index, node)
        for index, node in enumerate(nodes)
        if node.get("name") == "world"
    ]
    if (
        len(world_nodes) != 1
        or world_nodes[0][0] != 0
        or set(world_nodes[0][1]) != {"name", "children"}
        or world_nodes[0][1]["children"] != list(range(1, len(nodes)))
        or gltf.get("scene") != 0
        or gltf.get("scenes") != [{"nodes": [0]}]
    ):
        raise SystemExit("generated model GLB root hierarchy changed")
    if len(gltf.get("meshes", [])) != len(actual_layers):
        raise SystemExit("generated model GLB mesh count changed")

    material_names = {
        material.get("name") for material in gltf.get("materials", [])
    }
    required_materials = {
        "Aluminum extrusion",
        "Printed chassis hardware",
        "Fixture plate",
        "ELEGOO relay blue PCB",
        "ALIENTEK DP100 enclosure",
        "DUT carrier",
        "DUT shell",
        "DUT controls",
        "DUT screen",
        "Logitech C270 shell and articulated clip",
        "Camera field of view",
    }
    if not required_materials.issubset(material_names):
        raise SystemExit(
            "generated model GLB is missing semantic materials: "
            + ", ".join(sorted(required_materials - material_names))
        )


def verify_provenance(
    provenance: object,
    expected_revision: str,
    *,
    allow_dirty: bool = False,
    model: pathlib.Path | None = None,
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

    if expected_revision not in HISTORICAL_SCHEMA1_REVISIONS:
        verify_current_scene(provenance, actual_layers)
        if model is not None:
            verify_glb(model, provenance, actual_layers)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("provenance", type=pathlib.Path)
    parser.add_argument("expected_revision")
    parser.add_argument("--allow-dirty", action="store_true")
    parser.add_argument("--model", type=pathlib.Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    provenance = json.loads(args.provenance.read_text(encoding="utf-8"))
    verify_provenance(
        provenance,
        args.expected_revision,
        allow_dirty=args.allow_dirty,
        model=args.model,
    )


if __name__ == "__main__":
    main()
