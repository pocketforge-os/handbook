#!/usr/bin/env python3
"""Verify the generated test-node chassis handbook surface."""

from __future__ import annotations

import argparse
import hashlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse


class LocalReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[tuple[str, str]] = []
        self.model_viewers: list[dict[str, str]] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        attributes = {key: value or "" for key, value in attrs}
        if tag in {"a", "link"} and attributes.get("href"):
            self.references.append((tag, attributes["href"]))
        if tag in {"img", "script", "source", "model-viewer"} and attributes.get(
            "src"
        ):
            self.references.append((tag, attributes["src"]))
        if tag == "model-viewer":
            self.model_viewers.append(attributes)
            if attributes.get("poster"):
                self.references.append((tag, attributes["poster"]))


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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("site", type=Path)
    args = parser.parse_args()
    site = args.site.resolve()

    guide_root = site / "hardware" / "test-node-chassis"
    page_names = ("index", "parts", "print", "cut", "assemble", "verify")
    pages = [
        guide_root / "index.html"
        if name == "index"
        else guide_root / name / "index.html"
        for name in page_names
    ]
    for page in pages:
        if not page.is_file():
            raise SystemExit(f"missing chassis guide page: {page}")

    missing: list[str] = []
    viewer_count = 0
    viewer_sources: set[str] = set()
    for page in pages:
        page_parser = LocalReferenceParser()
        page_parser.feed(page.read_text(encoding="utf-8"))
        for tag, reference in page_parser.references:
            target = resolve_reference(site, page, reference)
            if target is not None and not target.exists():
                missing.append(f"{page.relative_to(site)}: <{tag}> {reference}")
        for viewer in page_parser.model_viewers:
            viewer_count += 1
            for required_attribute in ("src", "poster", "alt", "camera-controls"):
                if required_attribute not in viewer:
                    raise SystemExit(
                        f"model-viewer is missing {required_attribute}"
                    )
            viewer_sources.add(Path(urlparse(viewer["src"]).path).name)

    if missing:
        raise SystemExit("unresolved local references:\n" + "\n".join(missing))
    expected_viewer_sources = {
        "pocketforge-test-node.glb",
        "batch-00-calibration.glb",
        "batch-01-ironed-interfaces.glb",
        "batch-02-splice-collars.glb",
        "batch-03-movable-mounts.glb",
        "batch-04-frame-hardware.glb",
        "batch-05-identification.glb",
    }
    if viewer_count != len(expected_viewer_sources):
        raise SystemExit(
            "expected "
            f"{len(expected_viewer_sources)} interactive models, "
            f"found {viewer_count}"
        )
    if viewer_sources != expected_viewer_sources:
        raise SystemExit(
            "interactive model source set changed: "
            f"{sorted(viewer_sources)} != {sorted(expected_viewer_sources)}"
        )

    asset_dir = site / "assets" / "generated" / "test-node-chassis"
    batches = sorted(asset_dir.glob("production-batch-*.stl"))
    if len(batches) != 6:
        raise SystemExit(f"expected six canonical STL beds, found {len(batches)}")
    if any("print-group" in path.name for path in asset_dir.iterdir()):
        raise SystemExit("development print-group artifact reached the handbook")

    for model_name in expected_viewer_sources:
        model = asset_dir / model_name
        if model.read_bytes()[:4] != b"glTF":
            raise SystemExit(
                f"interactive model is not a binary glTF file: {model}"
            )

    checksums = verify_hashes(asset_dir)
    guide_text = "\n".join(page.read_text(encoding="utf-8") for page in pages)
    if "build-a-dut" in guide_text.lower():
        raise SystemExit("retired build-a-dut terminology remains in the guide")

    print(
        "handbook_surface=pass "
        f"pages={len(pages)} local_links=resolved batches={len(batches)} "
        f"checksums={checksums} interactive_models={viewer_count}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
