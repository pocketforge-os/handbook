#!/usr/bin/env python3
"""Validate device-first handbook routing against a browser pack catalog."""

from __future__ import annotations

import argparse
import json
from pathlib import Path, PurePosixPath
import re


SCHEMA = "pocketforge-test-node-guide-profiles-v1"
STEP_RE = re.compile(r"[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+)*")


class GuideProfileError(ValueError):
    """The published device-to-guide contract is unsafe or incomplete."""


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise GuideProfileError(f"cannot read {path}: {error}") from error
    if not isinstance(value, dict):
        raise GuideProfileError(f"{path} must contain a JSON object")
    return value


def safe_route(value: object) -> bool:
    if not isinstance(value, str) or not value.endswith("/"):
        return False
    route = PurePosixPath(value)
    return (
        not route.is_absolute()
        and ".." not in route.parts
        and all(part not in {"", "."} for part in route.parts)
    )


def route_page(site: Path, route: str) -> Path:
    return site / route / "index.html"


def verify_guide_profiles(
    profiles: dict,
    catalog: dict,
    site: Path | None = None,
) -> dict:
    if profiles.get("schema") != SCHEMA:
        raise GuideProfileError("guide profile schema changed")
    if catalog.get("schema") != "pocketforge-browser-device-pack-catalog-v1":
        raise GuideProfileError("browser device-pack catalog schema changed")

    devices = profiles.get("devices")
    families = profiles.get("families")
    integration_profiles = profiles.get("integration_profiles")
    layouts = profiles.get("layouts")
    if not all(
        isinstance(value, dict) and value
        for value in (devices, families, integration_profiles, layouts)
    ):
        raise GuideProfileError(
            "guide profiles need devices, families, integration profiles, "
            "and layouts"
        )

    catalog_devices: dict[str, dict] = {}
    for record in catalog.get("devices", []):
        slug = record.get("slug")
        if not isinstance(slug, str) or not slug or slug in catalog_devices:
            raise GuideProfileError("catalog contains an invalid or duplicate device slug")
        catalog_devices[slug] = record
    if set(devices) != set(catalog_devices):
        raise GuideProfileError(
            "guide device set differs from the pinned source catalog "
            f"(guide={sorted(devices)!r}, catalog={sorted(catalog_devices)!r})"
        )

    catalog_layouts: dict[str, dict] = {}
    for record in catalog_devices.values():
        layout = record.get("layout", {})
        layout_id = layout.get("id")
        if not isinstance(layout_id, str) or not layout_id:
            raise GuideProfileError("catalog device has no layout id")
        previous = catalog_layouts.setdefault(layout_id, layout)
        if previous != layout:
            raise GuideProfileError(f"catalog layout metadata differs for {layout_id}")
    if set(layouts) != set(catalog_layouts):
        raise GuideProfileError(
            "guide layout set differs from the pinned source catalog "
            f"(guide={sorted(layouts)!r}, catalog={sorted(catalog_layouts)!r})"
        )

    family_members: dict[str, set[str]] = {family: set() for family in families}
    integration_members: dict[str, set[str]] = {
        profile: set() for profile in integration_profiles
    }
    for slug, guide_device in devices.items():
        catalog_device = catalog_devices[slug]
        family_id = guide_device.get("family")
        integration_id = guide_device.get("integration_profile")
        layout_id = guide_device.get("layout")
        build_route = guide_device.get("build_sheet_route")
        print_route = guide_device.get("print_route")
        if family_id not in families:
            raise GuideProfileError(f"{slug} selects unknown family {family_id!r}")
        family_members[family_id].add(slug)
        if integration_id not in integration_profiles:
            raise GuideProfileError(
                f"{slug} selects unknown integration profile {integration_id!r}"
            )
        integration_members[integration_id].add(slug)
        if layout_id != catalog_device.get("layout", {}).get("id"):
            raise GuideProfileError(
                f"{slug} guide layout {layout_id!r} differs from source catalog "
                f"{catalog_device.get('layout', {}).get('id')!r}"
            )
        if guide_device.get("display_name") != catalog_device.get("display_name"):
            raise GuideProfileError(f"{slug} display name differs from source catalog")
        source_holder = catalog_device.get("profile", {}).get("id")
        if families[family_id].get("holder_profile") != source_holder:
            raise GuideProfileError(
                f"{slug} holder profile differs from source catalog"
            )
        if not safe_route(build_route):
            raise GuideProfileError(f"{slug} has an unsafe build-sheet route")
        if not safe_route(print_route):
            raise GuideProfileError(f"{slug} has an unsafe print route")
        if site is not None and not route_page(site, build_route).is_file():
            raise GuideProfileError(f"{slug} build sheet is missing from the site")
        if site is not None and not route_page(site, print_route).is_file():
            raise GuideProfileError(f"{slug} print page is missing from the site")

    for family_id, family in families.items():
        declared = family.get("devices")
        if not isinstance(declared, list) or len(declared) != len(set(declared)):
            raise GuideProfileError(f"{family_id} has an invalid device list")
        if set(declared) != family_members[family_id]:
            raise GuideProfileError(f"{family_id} device membership is inconsistent")
        for field in ("display_name", "holder_profile"):
            if not isinstance(family.get(field), str) or not family[field]:
                raise GuideProfileError(f"{family_id} is missing {field}")

    for profile_id, profile in integration_profiles.items():
        declared = profile.get("devices")
        if not isinstance(declared, list) or len(declared) != len(set(declared)):
            raise GuideProfileError(f"{profile_id} has an invalid device list")
        if set(declared) != integration_members[profile_id]:
            raise GuideProfileError(
                f"{profile_id} device membership is inconsistent"
            )
        for field in ("display_name", "status"):
            if not isinstance(profile.get(field), str) or not profile[field]:
                raise GuideProfileError(f"{profile_id} is missing {field}")
        guide_route = profile.get("guide_route")
        if not safe_route(guide_route):
            raise GuideProfileError(f"{profile_id} has an unsafe guide route")
        if site is not None and not route_page(site, guide_route).is_file():
            raise GuideProfileError(
                f"{profile_id} integration guide is missing from the site"
            )

    for layout_id, guide_layout in layouts.items():
        catalog_layout = catalog_layouts[layout_id]
        qualification = catalog_layout.get("qualification", {}).get("status")
        if guide_layout.get("qualification_status") != qualification:
            raise GuideProfileError(
                f"{layout_id} qualification differs from source catalog"
            )
        guide_route = guide_layout.get("guide_route")
        if not safe_route(guide_route):
            raise GuideProfileError(f"{layout_id} has an unsafe guide route")
        for envelope_name in ("outside_envelope_mm", "inside_envelope_mm"):
            envelope = guide_layout.get(envelope_name)
            if (
                not isinstance(envelope, dict)
                or set(envelope) != {"width", "depth", "height"}
                or any(
                    not isinstance(value, int) or value <= 0
                    for value in envelope.values()
                )
            ):
                raise GuideProfileError(f"{layout_id} has an invalid {envelope_name}")
        steps = guide_layout.get("assembly_steps")
        if (
            not isinstance(steps, list)
            or not steps
            or len(steps) != len(set(steps))
            or any(
                not isinstance(step, str) or STEP_RE.fullmatch(step) is None
                for step in steps
            )
        ):
            raise GuideProfileError(f"{layout_id} has an invalid assembly sequence")
        if site is not None:
            required_routes = [
                guide_route,
                *(
                    f"{guide_route}{name}/"
                    for name in (
                        "parts",
                        "cut",
                        "assemble",
                        "verify",
                        "wire-management",
                    )
                ),
                *(f"{guide_route}assemble/{step}/" for step in steps),
            ]
            missing = [
                route
                for route in required_routes
                if not route_page(site, route).is_file()
            ]
            if missing:
                raise GuideProfileError(
                    f"{layout_id} guide routes are missing: {missing!r}"
                )

    return {
        "devices": len(devices),
        "families": len(families),
        "integration_profiles": len(integration_profiles),
        "layouts": len(layouts),
        "assembly_steps": sum(
            len(layout["assembly_steps"]) for layout in layouts.values()
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--profiles", required=True, type=Path)
    parser.add_argument("--catalog", required=True, type=Path)
    parser.add_argument("--site", type=Path)
    arguments = parser.parse_args()
    try:
        result = verify_guide_profiles(
            load_json(arguments.profiles),
            load_json(arguments.catalog),
            arguments.site.resolve() if arguments.site else None,
        )
    except GuideProfileError as error:
        print(f"guide_profiles=fail reason={error}")
        return 1
    print(
        "guide_profiles=pass "
        + " ".join(f"{key}={value}" for key, value in result.items())
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
