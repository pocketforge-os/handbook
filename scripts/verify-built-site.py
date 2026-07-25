#!/usr/bin/env python3
"""Verify the generated test-node chassis handbook surface."""

from __future__ import annotations

import argparse
import hashlib
import json
import struct
from collections import Counter
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

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
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
            self.images.append(attributes)


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

    count = 0
    for line in manifest.read_text(encoding="utf-8").splitlines():
        digest, relative_name = line.split(maxsplit=1)
        asset = asset_dir / relative_name.removeprefix("./")
        if not asset.is_file():
            raise SystemExit(f"checksum names missing asset: {asset}")
        actual = hashlib.sha256(asset.read_bytes()).hexdigest()
        if actual != digest:
            raise SystemExit(f"checksum mismatch: {asset}")
        count += 1
    return count


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


def verify_customizer_sources(asset_dir: Path) -> None:
    customizer_dir = asset_dir / "customizer"
    provenance_path = customizer_dir / "customizer-provenance.json"
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if (
        provenance.get("schema") != 1
        or provenance.get("part")
        != "production_batch_06_device_nameplate"
        or provenance.get("parameter") != "DEVICE_LABEL"
        or provenance.get("maximum_label_characters") != 29
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
        "module production_batch_06_device_nameplate()",
    ):
        if contract not in main_source:
            raise SystemExit(
                f"browser customizer source is missing {contract!r}"
            )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("site", type=Path)
    args = parser.parse_args()
    site = args.site.resolve()

    guide_root = site / "hardware" / "test-node-chassis"
    base_page_names = (
        "index",
        "parts",
        "print",
        "cut",
        "verify",
        "wire-management",
    )
    base_pages = [
        guide_root / "index.html"
        if name == "index"
        else guide_root / name / "index.html"
        for name in base_page_names
    ]
    assembly_root = guide_root / "assemble"
    assembly_page = assembly_root / "index.html"
    assembly_step_names = (
        "01-learn-the-rail",
        "02-load-width-rails",
        "03-load-depth-rails",
        "04-splice-uprights",
        "05-load-camera-frame",
        "06-build-camera-frame",
        "07-lay-out-lower-frame",
        "08-add-posts",
        "09-lower-camera-frame",
        "10-set-camera-frame",
        "11-close-outer-frame",
        "12-square-frame",
        "13-mount-dut-holder",
        "14-mount-electronics-plate",
        "15-aim-camera",
        "16-add-placard",
        "17-mount-power-strip",
        "18-add-stacking-tabs",
        "19-final-check",
    )
    assembly_steps = [
        assembly_root / step_name / "index.html"
        for step_name in assembly_step_names
    ]
    pages = [*base_pages, assembly_page, *assembly_steps]
    for page in pages:
        if not page.is_file():
            raise SystemExit(f"missing chassis guide page: {page}")

    missing: list[str] = []
    viewer_sources: Counter[str] = Counter()
    page_viewer_sources: dict[Path, list[str]] = {}
    page_references: dict[Path, LocalReferenceParser] = {}
    for page in pages:
        page_parser = LocalReferenceParser()
        page_parser.feed(page.read_text(encoding="utf-8"))
        page_references[page] = page_parser
        page_sources: list[str] = []
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
                        f"model-viewer is missing {required_attribute}"
                    )
            reveal = viewer.get("reveal", "auto")
            if reveal not in {"auto", "manual"}:
                raise SystemExit(
                    f"model-viewer uses unsupported reveal value {reveal!r}: "
                    f"{page.relative_to(site)}"
                )
            source_name = Path(urlparse(viewer["src"]).path).name
            viewer_sources[source_name] += 1
            page_sources.append(source_name)
        page_viewer_sources[page] = page_sources

    if missing:
        raise SystemExit("unresolved local references:\n" + "\n".join(missing))
    expected_viewer_counts = Counter(
        {
            "pocketforge-test-node.glb": 2,
            "batch-00-calibration.glb": 1,
            "batch-01-ironed-interfaces.glb": 1,
            "batch-02-splice-collars.glb": 1,
            "batch-03-movable-mounts.glb": 1,
            "batch-04-frame-hardware.glb": 1,
            "batch-05-placard-holder.glb": 1,
            "batch-06-device-nameplate.glb": 1,
            "batch-07-wire-management.glb": 1,
        }
    )
    if viewer_sources != expected_viewer_counts:
        raise SystemExit(
            "interactive model counts changed: "
            f"{dict(sorted(viewer_sources.items()))} != "
            f"{dict(sorted(expected_viewer_counts.items()))}"
        )

    print_page = guide_root / "print" / "index.html"
    print_viewers = page_references[print_page].model_viewers
    for viewer in print_viewers:
        if (
            viewer.get("reveal") != "manual"
            or "data-click-to-load" not in viewer
        ):
            raise SystemExit(
                "print-bed model-viewer is missing manual click-to-load wiring"
            )
    print_html = print_page.read_text(encoding="utf-8")
    normalized_print_html = " ".join(print_html.split())
    for required_fragment in (
        "prep-captive-nut.png",
        "prep-captive-nut-count.png",
        "36 seated nuts",
        "28 short 18 mm bars + 4 long bars",
        "The short carrier is 18 mm—not 30 mm",
        "6 mm of plastic from each end",
        "eight identical cable anchors",
        "two open tie tunnels each",
        "Customize the device name",
        "data-nameplate-customizer",
        "nameplate-worker.mjs",
        "Generate personalized STL",
        "name is not uploaded",
        "Z = 2.4 mm",
        "pinned OpenSCAD chassis source",
    ):
        if required_fragment not in normalized_print_html:
            raise SystemExit(
                "print page is missing captive-nut preparation detail: "
                f"{required_fragment!r}"
            )
    for customizer_asset in (
        "assets/nameplate-customizer.mjs",
        "assets/nameplate-customizer-core.mjs",
        "assets/nameplate-worker.mjs",
    ):
        if not (site / customizer_asset).is_file():
            raise SystemExit(
                f"missing browser nameplate customizer asset: {customizer_asset}"
            )
    if "openscad.wasm" in print_html or "openscad.js" in print_html:
        raise SystemExit(
            "print page eagerly references the lazy OpenSCAD runtime"
        )
    if "<noscript>" not in print_html:
        raise SystemExit("print page is missing the nameplate no-JavaScript fallback")
    if (
        'model-viewer[data-click-to-load]' not in print_html
        or "viewer.dismissPoster()" not in print_html
    ):
        raise SystemExit(
            "print page is missing the click handler that dismisses model posters"
        )
    if "Do not scale, auto-orient, or auto-arrange" not in print_html:
        raise SystemExit("print page is missing the canonical no-transform warning")
    if "auto-orient, split" in print_html:
        raise SystemExit("print page still prohibits splitting canonical beds")
    print_downloads = page_references[print_page].downloads
    if len(print_downloads) != 8:
        raise SystemExit(
            f"expected eight print-bed downloads, found {len(print_downloads)}"
        )
    for download in print_downloads:
        linked_name = Path(urlparse(download.get("href", "")).path).name
        download_name = download.get("download", "")
        if download_name != linked_name:
            raise SystemExit(
                "print-bed download filename does not match its linked asset: "
                f"{download_name!r} != {linked_name!r}"
            )

    if page_viewer_sources[assembly_page] != ["pocketforge-test-node.glb"]:
        raise SystemExit(
            "assembly start page must contain exactly one finished chassis model"
        )
    assembly_html = assembly_page.read_text(encoding="utf-8")
    if "assets/vendor/model-viewer/model-viewer.min.js" not in assembly_html:
        raise SystemExit(
            "assembly start page is missing the pinned local model-viewer script"
        )
    if "<noscript>" not in assembly_html:
        raise SystemExit(
            "assembly start page is missing the static no-JavaScript fallback"
        )
    required_hotspot_slots = {
        "hotspot-operator",
        "hotspot-device",
        "hotspot-post",
        "hotspot-width",
        "hotspot-depth",
        "hotspot-camera-frame",
    }
    assembly_hotspots = page_references[assembly_page].model_hotspots
    actual_hotspot_slots = {
        hotspot.get("slot", "") for hotspot in assembly_hotspots
    }
    if actual_hotspot_slots != required_hotspot_slots:
        raise SystemExit(
            "assembly model hotspot labels changed: "
            f"{sorted(actual_hotspot_slots)} != {sorted(required_hotspot_slots)}"
        )
    for hotspot in assembly_hotspots:
        for required_attribute in ("data-position", "data-normal"):
            if not hotspot.get(required_attribute):
                raise SystemExit(
                    "assembly model hotspot is missing "
                    f"{required_attribute}: {hotspot.get('slot', '')}"
                )
    for required_fragment in (
        "data-chassis-label-toggle",
        'aria-controls="assembly-chassis-model"',
        'aria-pressed="true"',
        'data-labels-visible="true"',
        "POST · 360 mm",
        "WIDTH · 306 mm",
        "DEPTH · 318 mm",
        "DEVICE / WALL SIDE",
        "toggle.addEventListener",
    ):
        if required_fragment not in assembly_html:
            raise SystemExit(
                "assembly model label interface is missing "
                f"{required_fragment!r}"
            )
    if 'class="pf-step-list"' not in assembly_html:
        raise SystemExit("assembly start page is missing the ordered step list")

    wire_page = guide_root / "wire-management" / "index.html"
    wire_html = wire_page.read_text(encoding="utf-8")
    normalized_wire_html = " ".join(wire_html.split())
    for required_fragment in (
        "wire-management-anchor.png",
        "no fixed anchor map",
        "fully de-energized harness",
        "M5 × 10 mm",
        "Eight is a starter quantity",
        "Routing aid, not strain relief",
        "cut the tail flush",
    ):
        if required_fragment not in normalized_wire_html:
            raise SystemExit(
                "wire-management page is missing its installation contract: "
                f"{required_fragment!r}"
            )
    if page_viewer_sources[wire_page]:
        raise SystemExit(
            "wire-management page should use the generated annotated still, "
            "not an unlabeled interactive model"
        )

    verify_page = guide_root / "verify" / "index.html"
    dedicated_preload_visuals = {
        2: ("preload-width-rails.png",),
        3: (
            "preload-parked-replacement.png",
            "preload-depth-rails.png",
        ),
        5: ("preload-camera-frame.png",),
    }
    step_count = len(assembly_steps)
    for index, step_page in enumerate(assembly_steps):
        step_number = index + 1
        step_html = step_page.read_text(encoding="utf-8")
        required_fragments = (
            f"Step {step_number} of {step_count}",
            'class="pf-step-layout"',
            'class="pf-part-list"',
            'class="pf-part-tag ',
            'class="pf-picture-key"',
            'class="pf-step-check"',
            'class="pf-step-nav"',
        )
        for fragment in required_fragments:
            if fragment not in step_html:
                raise SystemExit(
                    f"assembly step {step_number} is missing {fragment!r}"
                )

        if step_html.count('class="pf-cue ') < 2:
            raise SystemExit(
                f"assembly step {step_number} needs at least two named "
                "picture cues"
            )

        step_parser = page_references[step_page]
        generated_pngs = [
            image.get("src", "")
            for image in step_parser.images
            if "generated/test-node-chassis/" in image.get("src", "")
            and image.get("src", "").endswith(".png")
        ]
        if not generated_pngs:
            raise SystemExit(
                f"assembly step {step_number} has no generated CAD visual"
            )
        for dedicated_visual in dedicated_preload_visuals.get(
            step_number, ()
        ):
            if not any(
                Path(urlparse(source).path).name == dedicated_visual
                for source in generated_pngs
            ):
                raise SystemExit(
                    f"assembly step {step_number} is missing its dedicated "
                    f"preload visual {dedicated_visual}"
                )

        if step_number == 3:
            normalized_step_html = " ".join(step_html.split())
            for explanation in (
                "no separate blue printed part",
                "It attaches to <strong>nothing during this build</strong>",
                "Why the 18 mm length matters here",
                "superseded 30 mm carrier",
                "8 orange bars",
                "blue tape on 4 of them",
            ):
                if explanation not in normalized_step_html:
                    raise SystemExit(
                        "assembly step 3 is missing the parked-replacement "
                        f"explanation {explanation!r}"
                    )

        if step_number == 6:
            normalized_step_html = " ".join(step_html.split())
            for continuity_instruction in (
                "Leave all 10 loaded nut bars in their pictured grooves",
                "upper crossbar, point both L connectors down",
                "10 Step 5 nut bars are still visible",
                "including two with blue tape",
            ):
                if continuity_instruction not in normalized_step_html:
                    raise SystemExit(
                        "assembly step 6 is missing the loaded-state "
                        f"continuity instruction {continuity_instruction!r}"
                    )

        resolved_links = {
            target
            for tag, reference in step_parser.references
            if tag == "a"
            and (target := resolve_reference(site, step_page, reference))
            is not None
        }
        expected_previous = (
            assembly_page if index == 0 else assembly_steps[index - 1]
        )
        expected_next = (
            verify_page if index == step_count - 1 else assembly_steps[index + 1]
        )
        for direction, expected in (
            ("previous", expected_previous),
            ("next", expected_next),
        ):
            if expected not in resolved_links:
                raise SystemExit(
                    f"assembly step {step_number} is missing its {direction} "
                    f"link to {expected.relative_to(site)}"
                )

    expected_viewer_sources = {
        model_name for model_name in expected_viewer_counts
    }

    asset_dir = site / "assets" / "generated" / "test-node-chassis"
    batches = sorted(asset_dir.glob("production-batch-*.stl"))
    if len(batches) != 8:
        raise SystemExit(f"expected eight canonical STL beds, found {len(batches)}")
    if any("print-group" in path.name for path in asset_dir.iterdir()):
        raise SystemExit("development print-group artifact reached the handbook")

    for model_name in expected_viewer_sources:
        model = asset_dir / model_name
        if model.read_bytes()[:4] != b"glTF":
            raise SystemExit(
                f"interactive model is not a binary glTF file: {model}"
            )

    nameplate_model = read_glb_json(
        asset_dir / "batch-06-device-nameplate.glb"
    )
    expected_nameplate_materials = {
        "White nameplate body": [0.9607843137254902, 0.9607843137254902,
                                 0.9294117647058824, 1.0],
        "Black raised labels": [0.0196078431372549, 0.0196078431372549,
                                0.0196078431372549, 1.0],
    }
    actual_nameplate_materials = {
        material.get("name"): material.get("pbrMetallicRoughness", {}).get(
            "baseColorFactor"
        )
        for material in nameplate_model.get("materials", [])
    }
    if actual_nameplate_materials != expected_nameplate_materials:
        raise SystemExit(
            "Batch 06 GLB material contract changed: "
            f"{actual_nameplate_materials!r}"
        )
    material_indices = {
        primitive.get("material")
        for mesh in nameplate_model.get("meshes", [])
        for primitive in mesh.get("primitives", [])
    }
    if material_indices != {0, 1}:
        raise SystemExit(
            f"Batch 06 GLB does not use both nameplate materials: {material_indices}"
        )

    checksums = verify_hashes(asset_dir)
    verify_customizer_sources(asset_dir)
    verify_nameplate_runtime(site)
    guide_text = "\n".join(page.read_text(encoding="utf-8") for page in pages)
    if "build-a-dut" in guide_text.lower():
        raise SystemExit("retired build-a-dut terminology remains in the guide")
    if 'class="pf-key' in guide_text:
        raise SystemExit(
            "legacy unlabeled color swatch remains in the chassis guide"
        )

    print(
        "handbook_surface=pass "
        f"pages={len(pages)} local_links=resolved batches={len(batches)} "
        f"checksums={checksums} "
        f"assembly_steps={len(assembly_steps)} "
        f"interactive_models={sum(viewer_sources.values())}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
