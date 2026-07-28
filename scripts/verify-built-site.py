#!/usr/bin/env python3
"""Verify the generated mechanical-onboarding handbook surface."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import struct
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse


class LocalReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[tuple[str, str]] = []
        self.model_viewers: list[dict[str, str]] = []
        self.model_hotspots: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.downloads: list[dict[str, str]] = []
        self._noscript_depth = 0

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        if tag == "noscript":
            self._noscript_depth += 1
        attributes = {key: value or "" for key, value in attrs}
        if tag in {"a", "link"} and attributes.get("href"):
            self.references.append((tag, attributes["href"]))
        if tag == "a" and "pf-download" in attributes.get("class", "").split():
            self.downloads.append(attributes)
        if tag in {"img", "script", "source", "model-viewer"} and attributes.get(
            "src"
        ):
            self.references.append((tag, attributes["src"]))
        if tag == "model-viewer":
            self.model_viewers.append(attributes)
            if attributes.get("poster"):
                self.references.append((tag, attributes["poster"]))
        if attributes.get("slot", "").startswith("hotspot-"):
            self.model_hotspots.append(attributes)
        if tag == "img":
            attributes["_inside_noscript"] = str(
                self._noscript_depth > 0
            ).lower()
            self.images.append(attributes)

    def handle_endtag(self, tag: str) -> None:
        if tag == "noscript":
            self._noscript_depth = max(0, self._noscript_depth - 1)


def resolve_reference(site: Path, page: Path, reference: str) -> Path | None:
    parsed = urlparse(reference)
    if parsed.scheme or parsed.netloc or reference.startswith(("#", "mailto:")):
        return None

    page_url = f"https://handbook.local/{page.relative_to(site).as_posix()}"
    resolved_url = urljoin(page_url, reference)
    resolved_path = unquote(urlparse(resolved_url).path).lstrip("/")
    candidate = site / resolved_path
    if resolved_url.endswith("/"):
        candidate /= "index.html"
    return candidate


def verify_hashes(asset_dir: Path) -> int:
    manifest = asset_dir / "SHA256SUMS"
    if not manifest.is_file():
        raise SystemExit(f"missing checksum manifest: {manifest}")

    manifest_names: set[str] = set()
    for line in manifest.read_text(encoding="utf-8").splitlines():
        digest, relative_name = line.split(maxsplit=1)
        normalized_name = relative_name.removeprefix("./")
        if normalized_name in manifest_names:
            raise SystemExit(
                f"checksum manifest repeats asset: {normalized_name}"
            )
        manifest_names.add(normalized_name)
        asset = asset_dir / normalized_name
        if not asset.is_file():
            raise SystemExit(f"checksum names missing asset: {asset}")
        actual = hashlib.sha256(asset.read_bytes()).hexdigest()
        if actual != digest:
            raise SystemExit(f"checksum mismatch: {asset}")

    actual_names = {
        path.relative_to(asset_dir).as_posix()
        for path in asset_dir.rglob("*")
        if path.is_file() and path != manifest
    }
    if manifest_names != actual_names:
        missing = sorted(actual_names - manifest_names)
        unexpected = sorted(manifest_names - actual_names)
        raise SystemExit(
            "checksum manifest coverage changed "
            f"(missing={missing!r}, unexpected={unexpected!r})"
        )
    return len(manifest_names)


def read_glb_json(path: Path) -> dict:
    data = path.read_bytes()
    if len(data) < 20:
        raise SystemExit(f"interactive model is truncated: {path}")
    magic, version, declared_length = struct.unpack_from("<4sII", data)
    if magic != b"glTF" or version != 2 or declared_length != len(data):
        raise SystemExit(f"interactive model has an invalid GLB header: {path}")
    chunk_length, chunk_type = struct.unpack_from("<I4s", data, 12)
    if chunk_type != b"JSON":
        raise SystemExit(f"interactive model has no leading JSON chunk: {path}")
    chunk = data[20 : 20 + chunk_length].rstrip(b" \x00")
    return json.loads(chunk.decode("utf-8"))


def verify_nameplate_runtime(site: Path) -> None:
    vendor_dir = site / "assets" / "vendor" / "openscad"
    expected_hashes = {
        "openscad.js": "904a47f29e63afb597bedef747da3b457"
        "d8ea17cc793c462c6c8b444e918a62e",
        "openscad.wasm": "f72ce246c02c0e501990837102be38332"
        "6b153fd761774ebfacce5c80c5ecf26",
        "COPYING.txt": "1805a29c3bccbc0428ce0048a1dfdeb9"
        "b1867677410e99c89c3c30932ae8c7d5",
        "fonts/LiberationSans-Bold.ttf":
            "d723d5a272970aedf296ef6fc628180df"
            "6074bce7769701ea9e0d222c052668c",
        "fonts/fonts.conf": "8b8c23ea9fc123db3f758872f76dbf84"
        "1191bf751ddb7ef73a11a1eb3a1a25de",
        "fonts/LICENSE.txt": "93fed46019c38bbe566b479d22148e2e8"
        "a1e85ada614accb0211c37b2c61c19b",
        "fonts/AUTHORS.txt": "d640bd6acfd5f7558507851f3e893685"
        "7b390bbe7e10c662241161dd83dbe830",
    }
    for relative_name, expected_hash in expected_hashes.items():
        path = vendor_dir / relative_name
        if not path.is_file():
            raise SystemExit(f"missing vendored OpenSCAD runtime file: {path}")
        actual_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual_hash != expected_hash:
            raise SystemExit(
                f"vendored OpenSCAD runtime checksum changed: {path}"
            )

    provenance_path = vendor_dir / "PROVENANCE.json"
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if (
        provenance.get("schema") != 1
        or provenance.get("openscad", {}).get("version")
        != "2025.03.25.wasm24456"
        or provenance.get("openscad", {}).get("source_revision")
        != "ce5039f8a9545ad5a8cf197b3ca11c0939bc67f1"
        or provenance.get("liberation_sans", {}).get("license") != "OFL-1.1"
    ):
        raise SystemExit("vendored OpenSCAD runtime provenance changed")


def verify_customizer_sources(asset_dir: Path) -> dict:
    customizer_dir = asset_dir / "customizer"
    provenance_path = customizer_dir / "customizer-provenance.json"
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if (
        provenance.get("schema") != 1
        or provenance.get("part")
        != "production_batch_06_device_nameplate"
        or provenance.get("parameter") != "DEVICE_LABEL"
        or provenance.get("maximum_label_characters") != 29
        or provenance.get("cable_anchor")
        != {"part": "cable_tie_anchor", "fasteners": ["M5", "M3"]}
        or provenance.get("source_dirty")
    ):
        raise SystemExit("browser customizer source contract changed")
    for relative_name, expected_hash in provenance.get("files", {}).items():
        source = customizer_dir / relative_name
        if not source.is_file():
            raise SystemExit(f"missing browser customizer CAD source: {source}")
        if hashlib.sha256(source.read_bytes()).hexdigest() != expected_hash:
            raise SystemExit(f"browser customizer CAD source hash changed: {source}")

    main_source = (
        customizer_dir / provenance["entrypoint"]
    ).read_text(encoding="utf-8")
    for contract in (
        'PART = "assembly"',
        "DEVICE_LABEL =",
        "CABLE_ANCHOR_FASTENER =",
        "module production_batch_06_device_nameplate()",
        "module cable_tie_anchor()",
    ):
        if contract not in main_source:
            raise SystemExit(
                f"browser customizer source is missing {contract!r}"
            )
    return provenance


def is_safe_relative_path(value: object) -> bool:
    if not isinstance(value, str) or not value or "\\" in value:
        return False
    path = Path(value)
    return (
        not path.is_absolute()
        and all(part not in {"", ".", ".."} for part in value.split("/"))
    )


def verify_browser_pack_sources(asset_dir: Path) -> dict:
    browser_dir = asset_dir / "browser"
    catalog_path = browser_dir / "catalog.json"
    checksums_path = browser_dir / "SHA256SUMS"
    if not catalog_path.is_file() or not checksums_path.is_file():
        raise SystemExit("browser device-pack publication is incomplete")

    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    if (
        catalog.get("schema")
        != "pocketforge-browser-device-pack-catalog-v1"
        or catalog.get("bundle_schema")
        != "pocketforge-browser-device-pack-bundle-v1"
        or catalog.get("modes") != ["coupon", "retrofit", "full"]
        or catalog.get("fingerprint_contract")
        != {
            "algorithm": "pocketforge-normalized-stl-v1",
            "coordinate_quantum_mm": "0.0001",
        }
    ):
        raise SystemExit("browser device-pack catalog contract changed")
    source = catalog.get("source", {})
    if (
        source.get("repository")
        != "https://github.com/pocketforge-os/test-node-hw"
        or not re.fullmatch(r"[0-9a-f]{40}", source.get("commit", ""))
        or source.get("dirty") is not False
    ):
        raise SystemExit("browser catalog lacks clean pinned source provenance")

    source_paths: set[str] = set()
    bundle_paths: set[str] = set()
    for record in catalog.get("sources", []):
        source_path = record.get("path")
        bundle_path = record.get("bundle_path")
        if (
            not is_safe_relative_path(source_path)
            or not str(source_path).endswith(".scad")
            or not is_safe_relative_path(bundle_path)
            or bundle_path != f"sources/{source_path}"
            or source_path in source_paths
            or bundle_path in bundle_paths
            or not re.fullmatch(r"[0-9a-f]{64}", record.get("sha256", ""))
            or not isinstance(record.get("size_bytes"), int)
            or record["size_bytes"] <= 0
        ):
            raise SystemExit("browser catalog has an invalid source record")
        path = browser_dir / bundle_path
        if (
            not path.is_file()
            or path.stat().st_size != record["size_bytes"]
            or hashlib.sha256(path.read_bytes()).hexdigest()
            != record["sha256"]
        ):
            raise SystemExit(f"browser OpenSCAD source changed: {path}")
        source_paths.add(source_path)
        bundle_paths.add(bundle_path)
    if not source_paths:
        raise SystemExit("browser catalog has no OpenSCAD source closure")

    devices = catalog.get("devices")
    if not isinstance(devices, list) or not devices:
        raise SystemExit("browser catalog has no registered devices")
    slugs: set[str] = set()
    expected_counts_by_slug = {
        "trimui-smart-pro": {"coupon": 1, "retrofit": 6, "full": 12},
        "trimui-smart-pro-s": {"coupon": 1, "retrofit": 6, "full": 11},
    }
    for device in devices:
        slug = device.get("slug")
        expected_counts = expected_counts_by_slug.get(slug)
        if (
            not isinstance(slug, str)
            or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug)
            or slug in slugs
            or not device.get("display_name")
            or expected_counts is None
        ):
            raise SystemExit("browser catalog has an invalid device record")
        slugs.add(slug)
        for owner in ("profile", "layout"):
            qualification = device.get(owner, {}).get("qualification", {})
            if (
                not device.get(owner, {}).get("id")
                or qualification.get("status")
                not in {"candidate", "physically_qualified"}
                or not qualification.get("acceptance_ref")
            ):
                raise SystemExit(
                    f"browser catalog has invalid {owner} qualification: {slug}"
                )
        modes = device.get("modes", {})
        if set(modes) != set(expected_counts):
            raise SystemExit(f"browser catalog modes changed: {slug}")
        for mode_name, expected_count in expected_counts.items():
            mode = modes[mode_name]
            artifacts = mode.get("artifacts")
            if (
                not isinstance(mode.get("production_eligible"), bool)
                or not isinstance(mode.get("nonproduction_reasons"), list)
                or not isinstance(mode.get("required_overrides"), list)
                or not isinstance(artifacts, list)
                or len(artifacts) != expected_count
            ):
                raise SystemExit(
                    f"browser catalog mode policy changed: {slug}/{mode_name}"
                )
            artifact_ids: set[str] = set()
            outputs: set[str] = set()
            for artifact in artifacts:
                artifact_id = artifact.get("id")
                output = artifact.get("output")
                definitions = artifact.get("definitions")
                definition_names = [
                    definition.get("name")
                    for definition in definitions or []
                ]
                fingerprint = artifact.get("expected_normalized_sha256")
                if (
                    not isinstance(artifact_id, str)
                    or artifact_id in artifact_ids
                    or not is_safe_relative_path(output)
                    or not str(output).endswith(".stl")
                    or output in outputs
                    or artifact.get("source") not in source_paths
                    or not definitions
                    or definition_names != sorted(definition_names)
                    or len(definition_names) != len(set(definition_names))
                    or "PART" not in definition_names
                    or (
                        fingerprint is not None
                        and not re.fullmatch(r"[0-9a-f]{64}", fingerprint)
                    )
                ):
                    raise SystemExit(
                        "browser catalog artifact contract changed: "
                        f"{slug}/{mode_name}/{artifact_id}"
                    )
                artifact_ids.add(artifact_id)
                outputs.add(output)
    if slugs != set(expected_counts_by_slug):
        raise SystemExit(f"browser catalog device set changed: {sorted(slugs)!r}")

    checksum_records: dict[str, str] = {}
    for line in checksums_path.read_text(encoding="utf-8").splitlines():
        match = re.fullmatch(r"([0-9a-f]{64})  (.+)", line)
        if (
            not match
            or not is_safe_relative_path(match.group(2))
            or match.group(2) in checksum_records
        ):
            raise SystemExit("browser bundle SHA256SUMS is invalid")
        checksum_records[match.group(2)] = match.group(1)
    expected_names = {"catalog.json", *bundle_paths}
    if set(checksum_records) != expected_names:
        raise SystemExit("browser bundle checksum coverage changed")
    for relative_name, expected_hash in checksum_records.items():
        path = browser_dir / relative_name
        if (
            not path.is_file()
            or hashlib.sha256(path.read_bytes()).hexdigest() != expected_hash
        ):
            raise SystemExit(f"browser bundle checksum mismatch: {path}")
    actual_names = {
        path.relative_to(browser_dir).as_posix()
        for path in browser_dir.rglob("*")
        if path.is_file() and path != checksums_path
    }
    if actual_names != expected_names:
        raise SystemExit("browser device-pack source closure changed")
    if any(path.suffix.lower() == ".stl" for path in browser_dir.rglob("*")):
        raise SystemExit("browser bundle contains a pre-rendered STL")
    return catalog


def verify_browser_pack_baselines(site: Path, catalog: dict) -> dict:
    baseline_path = site / "assets" / "device-pack-browser-baselines.json"
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    if (
        baseline.get("schema")
        != "pocketforge-browser-device-pack-baselines-v1"
        or baseline.get("source") != catalog.get("source")
        or baseline.get("generation_contract")
        != {
            "backend": "Manifold",
            "canonicalizer": "pocketforge-browser-canonical-stl-v1",
            "fingerprint": catalog.get("fingerprint_contract"),
        }
    ):
        raise SystemExit("browser device-pack baseline contract changed")
    equivalence = baseline.get("equivalence_gate", {})
    if (
        equivalence.get("maximum_bounds_delta_mm") != 0.001
        or equivalence.get("maximum_absolute_volume_delta_percent") != 0.02
        or equivalence.get("observed_maximum_bounds_delta_mm", 1) > 0.001
        or equivalence.get(
            "observed_maximum_absolute_volume_delta_percent", 1
        )
        > 0.02
    ):
        raise SystemExit("browser/source mesh equivalence gate changed")

    runtime_dir = site / "assets" / "vendor" / "openscad"
    runtime_provenance = json.loads(
        (runtime_dir / "PROVENANCE.json").read_text(encoding="utf-8")
    )["openscad"]
    runtime = baseline.get("runtime", {})
    if (
        runtime.get("version") != runtime_provenance.get("version")
        or runtime.get("source_revision")
        != runtime_provenance.get("source_revision")
        or runtime.get("javascript_sha256")
        != hashlib.sha256(
            (runtime_dir / "openscad.js").read_bytes()
        ).hexdigest()
        or runtime.get("wasm_sha256")
        != hashlib.sha256(
            (runtime_dir / "openscad.wasm").read_bytes()
        ).hexdigest()
    ):
        raise SystemExit("browser baseline OpenSCAD runtime pin changed")

    expected_artifacts: dict[str, dict] = {}
    for device in catalog["devices"]:
        for artifact in device["modes"]["full"]["artifacts"]:
            expected_artifacts[f"{device['slug']}/{artifact['id']}"] = artifact
    records = baseline.get("artifacts", {})
    if set(records) != set(expected_artifacts):
        raise SystemExit("browser baseline coverage differs from the catalog")
    for key, artifact in expected_artifacts.items():
        record = records[key]
        expected_source_hash = artifact["expected_normalized_sha256"]
        if (
            record.get("output") != artifact["output"]
            or not re.fullmatch(
                r"[0-9a-f]{64}",
                record.get("browser_normalized_sha256", ""),
            )
            or not re.fullmatch(
                r"[0-9a-f]{64}",
                record.get("source_normalized_sha256", ""),
            )
            or (
                expected_source_hash is not None
                and record.get("source_normalized_sha256")
                != expected_source_hash
            )
        ):
            raise SystemExit(f"browser baseline record changed: {key}")
    return baseline


def verify_chassis_assets(asset_dir: Path) -> tuple[dict, dict]:
    expected_files = {
        "hero.png",
        "wire-management-anchor.png",
        "pocketforge-test-node.glb",
        "pocketforge-test-node.provenance.json",
        "dualbar/cut-list.csv",
        "dualbar/layout-preload.png",
        "dualbar/layout-suspension-detail.png",
        "print-batches/batch-00-calibration.png",
        "print-batches/batch-00-calibration.glb",
        "print-batches/batch-01-ironed-interfaces.png",
        "print-batches/batch-01-ironed-interfaces.glb",
        "print-batches/batch-02-fixture-links.png",
        "print-batches/batch-02-fixture-links.glb",
        "print-batches/batch-04-frame-hardware.png",
        "print-batches/batch-04-frame-hardware.glb",
        "print-batches/batch-05-placard-holder.png",
        "print-batches/batch-05-placard-holder.glb",
        "print-batches/batch-06-device-nameplate.png",
        "print-batches/batch-06-device-nameplate.glb",
        "print-batches/batch-07-wire-management.png",
        "print-batches/batch-07-wire-management.glb",
        "print-batches/cable-anchor-m5.png",
        "print-batches/cable-anchor-m5.glb",
        "print-batches/cable-anchor-m3.png",
        "print-batches/cable-anchor-m3.glb",
        "customizer/pocketforge-node-chassis.scad",
        "customizer/lib/pf-2020.scad",
        "customizer/customizer-provenance.json",
    }
    actual_files = {
        path.relative_to(asset_dir).as_posix()
        for path in asset_dir.rglob("*")
        if (
            path.is_file()
            and path.name != "SHA256SUMS"
            and path.relative_to(asset_dir).parts[0] != "browser"
        )
    }
    if actual_files != expected_files:
        raise SystemExit(
            "current chassis asset set changed "
            f"(missing={sorted(expected_files - actual_files)!r}, "
            f"unexpected={sorted(actual_files - expected_files)!r})"
        )
    if any(path.suffix.lower() == ".stl" for path in asset_dir.rglob("*")):
        raise SystemExit("candidate STL leaked into handbook assets")

    with (asset_dir / "dualbar" / "cut-list.csv").open(
        encoding="utf-8", newline=""
    ) as stream:
        rows = list(csv.DictReader(stream))
    expected_cut_rows = [
        ("outer_vertical_rail", "4", "360.00", "1440.00"),
        ("outer_width_rail", "4", "306.00", "1224.00"),
        ("outer_depth_rail", "4", "318.00", "1272.00"),
        ("fixture_support_bar", "2", "306.00", "612.00"),
    ]
    actual_cut_rows = [
        (
            row["part"],
            row["quantity"],
            row["finished_length_mm"],
            row["total_mm"],
        )
        for row in rows
    ]
    if actual_cut_rows != expected_cut_rows:
        raise SystemExit(
            f"current chassis cut rows changed: {actual_cut_rows!r}"
        )

    provenance = json.loads(
        (
            asset_dir / "pocketforge-test-node.provenance.json"
        ).read_text(encoding="utf-8")
    )
    scene = provenance.get("scene", {})
    if (
        provenance.get("schema") != 2
        or provenance.get("source_dirty")
        or scene.get("device_slug") != "trimui-smart-pro-s"
        or scene.get("layout_id") != "chassis-dualbar-v1"
        or scene.get("chassis_variant") != "dualbar_v1"
        or scene.get("qualification")
        != {"status": "candidate", "acceptance_ref": "tsp-t1zd.2"}
        or len(provenance.get("semantic_layers", [])) != 70
    ):
        raise SystemExit("current chassis model provenance changed")

    model_path = asset_dir / "pocketforge-test-node.glb"
    if (
        hashlib.sha256(model_path.read_bytes()).hexdigest()
        != provenance.get("model_sha256")
    ):
        raise SystemExit("current chassis GLB hash does not match provenance")
    gltf = read_glb_json(model_path)
    layer_names = set(provenance["semantic_layers"])
    node_names = {
        node.get("name")
        for node in gltf.get("nodes", [])
        if isinstance(node.get("name"), str)
    }
    if node_names != layer_names | {"world"}:
        raise SystemExit("current chassis GLB nodes do not match provenance")
    nodes = gltf.get("nodes", [])
    if (
        not nodes
        or nodes[0]
        != {"name": "world", "children": list(range(1, len(nodes)))}
        or gltf.get("scene") != 0
        or gltf.get("scenes") != [{"nodes": [0]}]
    ):
        raise SystemExit("current chassis GLB root hierarchy changed")
    for required_node in (
        "aluminum",
        "printed-hardware",
        "fixture-plate",
        "fixture-relay-pcb",
        "fixture-dp100-shell",
        "fixture-bpi-pcb",
        "fixture-esp32-pcb",
        "carrier-body",
        "carrier-hooks",
        "device-shell",
        "device-controls",
        "device-screen",
        "webcam-shell",
        "camera-frustum",
    ):
        if required_node not in node_names:
            raise SystemExit(
                f"current chassis GLB is missing semantic node {required_node}"
            )
    return provenance, gltf


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("site", type=Path)
    args = parser.parse_args()
    site = args.site.resolve()

    holder_root = site / "hardware" / "dut-holder"
    holder_pages = [
        holder_root / "index.html",
        holder_root / "existing-mechanism" / "index.html",
        holder_root / "new-mechanism" / "index.html",
        holder_root / "qualify-and-release" / "index.html",
    ]

    guide_root = site / "hardware" / "test-node-chassis"
    overview_page = guide_root / "index.html"
    parts_page = guide_root / "parts" / "index.html"
    print_page = guide_root / "print" / "index.html"
    cut_page = guide_root / "cut" / "index.html"
    assembly_page = guide_root / "assemble" / "index.html"
    verify_page = guide_root / "verify" / "index.html"
    wire_page = guide_root / "wire-management" / "index.html"
    chassis_pages = [
        overview_page,
        parts_page,
        print_page,
        cut_page,
        assembly_page,
        verify_page,
        wire_page,
    ]
    pages = [*holder_pages, *chassis_pages]
    for page in pages:
        if not page.is_file():
            raise SystemExit(f"missing mechanical onboarding page: {page}")

    removed_routes = [
        path
        for path in (guide_root / "assemble").iterdir()
        if path.is_dir()
    ]
    if any(path.exists() for path in removed_routes):
        raise SystemExit(
            "removed chassis route reached the built site: "
            + ", ".join(
                str(path.relative_to(site))
                for path in removed_routes
                if path.exists()
            )
        )

    missing: list[str] = []
    page_references: dict[Path, LocalReferenceParser] = {}
    for page in pages:
        page_parser = LocalReferenceParser()
        page_parser.feed(page.read_text(encoding="utf-8"))
        page_references[page] = page_parser
        for tag, reference in page_parser.references:
            target = resolve_reference(site, page, reference)
            if target is not None and not target.exists():
                missing.append(f"{page.relative_to(site)}: <{tag}> {reference}")
        for image in page_parser.images:
            if not image.get("alt", "").strip():
                raise SystemExit(
                    f"image is missing useful alt text: {page.relative_to(site)}"
                )
        for viewer in page_parser.model_viewers:
            for required_attribute in ("src", "poster", "alt", "camera-controls"):
                if required_attribute not in viewer:
                    raise SystemExit(
                        f"model-viewer is missing {required_attribute}: "
                        f"{page.relative_to(site)}"
                    )
    if missing:
        raise SystemExit("unresolved local references:\n" + "\n".join(missing))

    holder_html = " ".join(
        page.read_text(encoding="utf-8") for page in holder_pages
    )
    for required_fragment in (
        "awaiting_holder_design",
        "awaiting_physical_acceptance",
        "physically_accepted",
        "physically_qualified",
        "perimeter_j_hook_v1",
        "custom_openscad",
        "normalized mesh fingerprint",
        "Raw STL SHA-256",
        "fixture_dependency_intake.py",
        "build_device_pack.py",
        "Routine STLs are generated, not committed",
        "device integration profile",
    ):
        if required_fragment not in holder_html:
            raise SystemExit(
                "DUT-holder chapter is missing its workflow contract: "
                f"{required_fragment!r}"
            )

    chassis_html = " ".join(
        page.read_text(encoding="utf-8") for page in chassis_pages
    )
    normalized_chassis_html = " ".join(chassis_html.split())
    for required_fragment in (
        "trimui-smart-pro-s",
        "chassis-dualbar-v1",
        "--allow-unqualified",
        "production_eligible",
        "layout_unqualified",
        "tsp-t1zd.2",
        "Routine STLs are generated, not committed",
        "4,548 mm",
        "309.2 mm",
        "927.6 mm",
        "72.4 mm",
        "381.6 mm",
        "Five-stick cut plan",
        "14 active + 6 parked = 20",
        "Two continuous 306 mm fixture bars",
        "four metal L-connectors",
        "Four identical 71.5 mm keyed links",
        "Move the four active channel bars",
    ):
        if required_fragment not in normalized_chassis_html:
            raise SystemExit(
                f"current chassis route is missing {required_fragment!r}"
            )

    retired_patterns = (
        r"\bgantry\b",
        r"\blegacy\b",
        r"\bretired\b",
        r"chassis-core-v1",
        r"camera[- ]frame",
        r"splice collar",
    )
    for pattern in retired_patterns:
        if re.search(pattern, chassis_html, flags=re.IGNORECASE):
            raise SystemExit(
                f"removed chassis terminology remains in built HTML: {pattern!r}"
            )

    for current_page, next_page in zip(chassis_pages, chassis_pages[1:]):
        resolved_links = {
            target
            for tag, reference in page_references[current_page].references
            if tag == "a"
            and (target := resolve_reference(site, current_page, reference))
            is not None
        }
        if next_page not in resolved_links:
            raise SystemExit(
                f"{current_page.relative_to(site)} does not link to "
                f"{next_page.relative_to(site)}"
            )

    full_chassis_pages = {overview_page, assembly_page}
    required_hotspot_slots = {
        "hotspot-operator",
        "hotspot-device",
        "hotspot-post",
        "hotspot-width",
        "hotspot-depth",
        "hotspot-upper-fixture-bar",
        "hotspot-lower-fixture-bar",
        "hotspot-fixture",
        "hotspot-handheld",
    }
    viewer_count = 0
    full_still_names = {
        "hero.png",
        "layout-assembly.png",
        "layout-front.png",
        "step-08-complete.png",
    }
    for page in chassis_pages:
        page_parser = page_references[page]
        viewers = page_parser.model_viewers
        if page in full_chassis_pages:
            if len(viewers) != 1:
                raise SystemExit(
                    f"{page.relative_to(site)} must contain one full chassis model"
                )
            viewer = viewers[0]
            viewer_count += 1
            if (
                "data-full-chassis-model" not in viewer
                or viewer.get("data-labels-visible") != "true"
                or Path(urlparse(viewer.get("src", "")).path).name
                != "pocketforge-test-node.glb"
                or Path(urlparse(viewer.get("poster", "")).path).name
                != "hero.png"
            ):
                raise SystemExit(
                    f"{page.relative_to(site)} diverges from the canonical viewer"
                )
            actual_slots = {
                hotspot.get("slot", "")
                for hotspot in page_parser.model_hotspots
            }
            if actual_slots != required_hotspot_slots:
                raise SystemExit(
                    f"{page.relative_to(site)} hotspot contract changed: "
                    f"{sorted(actual_slots)!r}"
                )
            for hotspot in page_parser.model_hotspots:
                for attribute in ("data-position", "data-normal"):
                    if not hotspot.get(attribute):
                        raise SystemExit(
                            f"{hotspot.get('slot')} is missing {attribute}"
                        )
            page_html = page.read_text(encoding="utf-8")
            for fragment in (
                "data-chassis-label-toggle",
                'aria-pressed="true"',
                "assets/chassis-model.mjs",
                "assets/vendor/model-viewer/model-viewer.min.js",
                "POST · 360 mm",
                "WIDTH · 306 mm",
                "DEPTH · 318 mm",
                "UPPER FIXTURE BAR · 306 mm",
                "LOWER FIXTURE BAR · 306 mm",
                "DUT TEST BOARD",
                "MODELED HANDHELD",
            ):
                if fragment not in page_html:
                    raise SystemExit(
                        f"{page.relative_to(site)} is missing {fragment!r}"
                    )
        elif page == print_page:
            if len(viewers) != 8:
                raise SystemExit(
                    f"{page.relative_to(site)} must contain eight print previews"
                )
        elif viewers:
            raise SystemExit(
                f"unexpected full model on {page.relative_to(site)}"
            )

        for image in page_parser.images:
            image_name = Path(urlparse(image.get("src", "")).path).name
            if (
                image_name in full_still_names
                and image.get("_inside_noscript") != "true"
            ):
                raise SystemExit(
                    "standalone full-chassis still remains on "
                    f"{page.relative_to(site)}: {image_name}"
                )
    if viewer_count != 2:
        raise SystemExit(f"expected two canonical chassis viewers, found {viewer_count}")

    print_html = print_page.read_text(encoding="utf-8")
    normalized_print_html = " ".join(print_html.split()).casefold()
    for required_fragment in (
        "data-device-pack-generator",
        "device-pack-generator.mjs",
        "browser/catalog.json",
        "device-pack-browser-baselines.json",
        "generate a device print pack",
        "generate complete pack",
        "no model is uploaded",
        "neither stores nor serves a pre-rendered stl",
        "data-nameplate-customizer",
        "nameplate-worker.mjs",
        "generate personalized stl",
        "name is not uploaded",
        "z = 2.4 mm",
        "pinned openscad chassis source",
        "20 compact m3 channel bars",
        "four identical 71.5 mm keyed links",
        "interactive print-bed previews",
        "data-cable-anchor-customizer",
        "cable-anchor-worker.mjs",
        "generate one cable anchor",
        "m3 · smaller drop-in hardware",
        "print-batches/batch-07-wire-management.glb",
        "do not scale, auto-orient, or auto-arrange",
    ):
        if required_fragment not in normalized_print_html:
            raise SystemExit(
                f"print page is missing {required_fragment!r}"
            )
    expected_print_previews = {
        ("batch-00-calibration.glb", "batch-00-calibration.png"),
        (
            "batch-01-ironed-interfaces.glb",
            "batch-01-ironed-interfaces.png",
        ),
        ("batch-02-fixture-links.glb", "batch-02-fixture-links.png"),
        ("batch-04-frame-hardware.glb", "batch-04-frame-hardware.png"),
        ("batch-05-placard-holder.glb", "batch-05-placard-holder.png"),
        ("batch-06-device-nameplate.glb", "batch-06-device-nameplate.png"),
        ("batch-07-wire-management.glb", "batch-07-wire-management.png"),
        ("cable-anchor-m5.glb", "cable-anchor-m5.png"),
    }
    actual_print_previews = {
        (
            Path(urlparse(viewer["src"]).path).name,
            Path(urlparse(viewer["poster"]).path).name,
        )
        for viewer in page_references[print_page].model_viewers
    }
    if actual_print_previews != expected_print_previews:
        raise SystemExit(
            f"print preview set changed: {sorted(actual_print_previews)!r}"
        )
    anchor_viewer = next(
        viewer
        for viewer in page_references[print_page].model_viewers
        if Path(urlparse(viewer["src"]).path).name == "cable-anchor-m5.glb"
    )
    expected_anchor_variants = {
        "data-m5-model": "cable-anchor-m5.glb",
        "data-m5-poster": "cable-anchor-m5.png",
        "data-m3-model": "cable-anchor-m3.glb",
        "data-m3-poster": "cable-anchor-m3.png",
    }
    if any(
        Path(urlparse(anchor_viewer.get(attribute, "")).path).name
        != expected_name
        for attribute, expected_name in expected_anchor_variants.items()
    ):
        raise SystemExit("cable-anchor preview variants changed")
    for customizer_asset in (
        "assets/device-pack-generator.mjs",
        "assets/device-pack-generator-core.mjs",
        "assets/device-pack-browser-baselines.json",
        "assets/device-pack-worker.mjs",
        "assets/nameplate-customizer.mjs",
        "assets/nameplate-customizer-core.mjs",
        "assets/nameplate-worker.mjs",
        "assets/cable-anchor-customizer.mjs",
        "assets/cable-anchor-customizer-core.mjs",
        "assets/cable-anchor-worker.mjs",
    ):
        if not (site / customizer_asset).is_file():
            raise SystemExit(
                f"missing browser nameplate customizer asset: {customizer_asset}"
            )
    generator_source = (
        site / "assets" / "device-pack-generator.mjs"
    ).read_text(encoding="utf-8")
    for required_fragment in (
        'coupon: "Fit coupon · 1 file"',
        'retrofit: "Device retrofit · 6 files"',
        'full: "Complete chassis · device-selected files"',
        "catalog.devices",
        "mode.artifacts",
        "createPackArchive",
        "new Worker(workerUrl",
    ):
        if required_fragment not in generator_source:
            raise SystemExit(
                f"browser pack generator is missing {required_fragment!r}"
            )
    script_sources = {
        reference
        for tag, reference in page_references[print_page].references
        if tag == "script"
    }
    if any(
        source.endswith(("openscad.wasm", "openscad.js"))
        for source in script_sources
    ):
        raise SystemExit("print page eagerly loads the OpenSCAD runtime")
    if print_html.count("<noscript>") != 1:
        raise SystemExit("print page must have one no-JavaScript fallback")
    if page_references[print_page].downloads:
        raise SystemExit("unverified static STL download remains on print page")

    wire_html = " ".join(
        wire_page.read_text(encoding="utf-8").split()
    )
    for required_fragment in (
        "wire-management-anchor.png",
        "no fixed anchor map",
        "fully de-energized harness",
        "Generate one M3 or M5 replacement",
        "M3/M5",
        "no larger than 7 mm for M3 or 10 mm for M5",
        "Eight is a starter quantity",
        "Routing aid, not strain relief",
        "cut the tail flush",
    ):
        if required_fragment not in wire_html:
            raise SystemExit(
                f"wire-management page is missing {required_fragment!r}"
            )

    asset_dir = site / "assets" / "generated" / "test-node-chassis"
    provenance, gltf = verify_chassis_assets(asset_dir)
    browser_catalog = verify_browser_pack_sources(asset_dir)
    browser_baselines = verify_browser_pack_baselines(site, browser_catalog)
    customizer_provenance = verify_customizer_sources(asset_dir)
    if (
        customizer_provenance.get("source_revision")
        != provenance.get("source_revision")
        or browser_catalog.get("source", {}).get("commit")
        != provenance.get("source_revision")
    ):
        raise SystemExit("browser, customizer, and chassis source pins diverged")
    if len(gltf.get("materials", [])) != 70:
        raise SystemExit("current chassis GLB material count changed")

    checksums = verify_hashes(asset_dir)
    verify_nameplate_runtime(site)
    if "build-a-dut" in chassis_html.lower():
        raise SystemExit("retired build-a-dut terminology remains in the guide")
    if 'class="pf-key' in chassis_html:
        raise SystemExit("unlabeled color swatch remains in the chassis guide")

    print(
        "handbook_surface=pass "
        f"pages={len(pages)} local_links=resolved "
        f"checksums={checksums} holder_pages={len(holder_pages)} "
        f"chassis_pages={len(chassis_pages)} "
        f"interactive_models={viewer_count} semantic_layers=70 "
        f"browser_devices={len(browser_catalog['devices'])} "
        f"browser_baselines={len(browser_baselines['artifacts'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
