#!/usr/bin/env bash
set -euo pipefail

script_dir=$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(CDPATH='' cd -- "${script_dir}/.." && pwd)
lock_file="${repo_root}/cad-assets.lock.json"
asset_dir="${repo_root}/docs/assets/generated/test-node-chassis"

readarray -t lock_values < <(
  python3 - "${lock_file}" <<'PY'
import json
import pathlib
import sys

lock = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
if lock.get("schema") != 2:
    raise SystemExit("unsupported CAD asset lock schema")
for key in ("repository", "source_path", "project"):
    value = lock.get(key)
    if not isinstance(value, str) or not value:
        raise SystemExit(f"CAD asset lock is missing {key}")
    print(value)
PY
)

source_repository=${lock_values[0]}
source_path=${lock_values[1]}
project_path=${lock_values[2]}
temporary_root=$(mktemp -d)

cleanup() {
  if [[ -n "${temporary_root}" && -d "${temporary_root}" ]]; then
    find "${temporary_root}" -depth -delete
  fi
}
trap cleanup EXIT

expected_revision=$(
  git -C "${repo_root}" ls-files --stage -- "${source_path}" |
    awk '$1 == "160000" { print $2 }'
)
[[ -n "${expected_revision}" ]] || {
  echo "CAD source path is not an indexed git submodule: ${source_path}" >&2
  exit 1
}

if [[ -n "${CAD_SOURCE_DIR:-}" ]]; then
  source_root=$(realpath "${CAD_SOURCE_DIR}")
else
  source_root="${repo_root}/${source_path}"
  [[ -e "${source_root}/.git" ]] || {
    echo "CAD submodule is not initialized; run: git submodule update --init" >&2
    exit 1
  }
fi

actual_revision=$(git -C "${source_root}" rev-parse HEAD)
actual_repository=$(git -C "${source_root}" remote get-url origin)
[[ "${actual_repository}" == "${source_repository}" ]] || {
  echo "CAD repository mismatch: ${actual_repository} != ${source_repository}" >&2
  exit 1
}
if [[ "${ALLOW_DIRTY_CAD:-0}" != "1" ]]; then
  [[ "${actual_revision}" == "${expected_revision}" ]] || {
    echo "CAD gitlink mismatch: ${actual_revision} != ${expected_revision}" >&2
    exit 1
  }
  [[ -z "$(git -C "${source_root}" status --porcelain)" ]] || {
    echo "refusing to publish assets from a dirty CAD worktree" >&2
    exit 1
  }
fi

project_dir="${source_root}/${project_path}"
[[ -f "${project_dir}/Makefile" ]] || {
  echo "locked CAD project does not exist: ${project_dir}" >&2
  exit 1
}

openscad_command=${OPENSCAD:-openscad}
accepted_label="12345678901234567890123456789"
rejected_label="${accepted_label}0"
"${openscad_command}" \
  --hardwarnings \
  --check-parameters=true \
  --check-parameter-ranges=true \
  -o "${temporary_root}/accepted-nameplate.stl" \
  -D 'PART="production_batch_06_device_nameplate"' \
  -D "DEVICE_LABEL=\"${accepted_label}\"" \
  "${project_dir}/pocketforge-node-chassis.scad" \
  >"${temporary_root}/accepted-nameplate.stdout" \
  2>"${temporary_root}/accepted-nameplate.stderr"
[[ -s "${temporary_root}/accepted-nameplate.stl" ]] || {
  echo "the browser customizer's 29-character label contract no longer exports" >&2
  exit 1
}
if "${openscad_command}" \
  --hardwarnings \
  --check-parameters=true \
  --check-parameter-ranges=true \
  -o "${temporary_root}/rejected-nameplate.stl" \
  -D 'PART="production_batch_06_device_nameplate"' \
  -D "DEVICE_LABEL=\"${rejected_label}\"" \
  "${project_dir}/pocketforge-node-chassis.scad" \
  >"${temporary_root}/rejected-nameplate.stdout" \
  2>"${temporary_root}/rejected-nameplate.stderr"; then
  echo "the browser customizer's 30-character rejection contract changed" >&2
  exit 1
fi
grep -q "Device label is too long" \
  "${temporary_root}/rejected-nameplate.stderr" || {
  echo "the browser customizer's overlong-label assertion changed" >&2
  exit 1
}

python_env="${temporary_root}/asset-python"
python3 -m venv "${python_env}"
"${python_env}/bin/pip" install \
  --disable-pip-version-check --quiet \
  -r "${project_dir}/scripts/handbook-model-requirements.txt"

# Source-built artifacts use reproducible mtimes, so filesystem freshness
# cannot prove that a cached render belongs to the pinned git revision.
make_command=(
  make
  --always-make
  -C "${project_dir}"
  "PYTHON=${python_env}/bin/python"
  guide-model
  guide-static
  dualbar-preview
  device-example-previews
  dualbar-cutlist
  guide-batch-models
  build/handbook/hero.png
  build/handbook/wire-management-anchor.png
  build/handbook/batch-00-calibration.png
  build/handbook/batch-01-ironed-interfaces.png
  build/handbook/batch-02-fixture-links.png
  build/handbook/batch-04-frame-hardware.png
  build/handbook/batch-05-placard-holder.png
  build/handbook/batch-06-device-nameplate.png
  build/handbook/batch-07-wire-management.png
  build/handbook/cable-anchor-m5.png
  build/handbook/cable-anchor-m3.png
)
if command -v xvfb-run >/dev/null 2>&1; then
  xvfb-run --auto-servernum "${make_command[@]}"
else
  QT_QPA_PLATFORM=offscreen "${make_command[@]}"
fi

browser_bundle="${temporary_root}/browser-device-packs"
browser_build_command=(
  python3
  "${source_root}/mechanical/device-packs/export_browser_bundle.py"
  --root "${source_root}"
  build
  --output "${browser_bundle}"
)
if [[ "${ALLOW_DIRTY_CAD:-0}" == "1" ]]; then
  browser_build_command+=(--allow-dirty)
fi
"${browser_build_command[@]}"
python3 \
  "${source_root}/mechanical/device-packs/export_browser_bundle.py" \
  --root "${source_root}" \
  verify \
  --bundle "${browser_bundle}"

if [[ -d "${asset_dir}" ]]; then
  find "${asset_dir}" -mindepth 1 -depth -delete
fi
mkdir -p \
  "${asset_dir}/assembly" \
  "${asset_dir}/browser" \
  "${asset_dir}/customizer/lib" \
  "${asset_dir}/device-examples" \
  "${asset_dir}/dualbar" \
  "${asset_dir}/legacy" \
  "${asset_dir}/print-batches"

install -m 0644 \
  "${project_dir}/build/handbook/hero.png" \
  "${project_dir}/build/handbook/wire-management-anchor.png" \
  "${project_dir}/build/handbook/model/pocketforge-test-node.glb" \
  "${project_dir}/build/handbook/model/pocketforge-test-node.provenance.json" \
  "${asset_dir}/"
install -m 0644 \
  "${project_dir}/build/dualbar/layout-preload.png" \
  "${project_dir}/build/dualbar/layout-suspension-detail.png" \
  "${project_dir}/build/dualbar/cut-list.csv" \
  "${asset_dir}/dualbar/"
cp -a \
  "${project_dir}/build/device-examples/." \
  "${asset_dir}/device-examples/"
install -m 0644 \
  "${project_dir}"/build/handbook/assembly-*.png \
  "${asset_dir}/assembly/"
install -m 0644 \
  "${project_dir}"/build/handbook/prep-*.png \
  "${project_dir}"/build/handbook/preload-*.png \
  "${project_dir}"/build/handbook/step-0[1-7]-*.png \
  "${project_dir}"/build/handbook/detail-*.png \
  "${asset_dir}/legacy/"
install -m 0644 \
  "${project_dir}/build/handbook/step-08-complete.png" \
  "${asset_dir}/legacy/qualified-gantry-complete.png"
install -m 0644 \
  "${project_dir}"/build/handbook/batch-*.png \
  "${project_dir}"/build/handbook/batch-*.glb \
  "${project_dir}"/build/handbook/cable-anchor-*.png \
  "${project_dir}"/build/handbook/cable-anchor-*.glb \
  "${asset_dir}/print-batches/"

cut_plan_mode=--check
if [[ "${UPDATE_CUT_PLAN:-0}" == "1" ]]; then
  cut_plan_mode=--write
fi
python3 \
  "${script_dir}/render-test-node-cut-plan.py" \
  --plan "${repo_root}/docs/assets/test-node-chassis-cut-plan.json" \
  --cut-list "${asset_dir}/dualbar/cut-list.csv" \
  --output "${repo_root}/docs/assets/test-node-chassis-cut-plan.svg" \
  "${cut_plan_mode}"

install -m 0644 \
  "${project_dir}/pocketforge-node-chassis.scad" \
  "${asset_dir}/customizer/pocketforge-node-chassis.scad"
install -m 0644 \
  "${project_dir}/lib/pf-2020.scad" \
  "${asset_dir}/customizer/lib/pf-2020.scad"
install -m 0644 \
  "${project_dir}/lib/usb-c-interrupter-bracket.scad" \
  "${asset_dir}/customizer/lib/usb-c-interrupter-bracket.scad"
cp -a "${browser_bundle}/." "${asset_dir}/browser/"

python3 - \
  "${asset_dir}/customizer/customizer-provenance.json" \
  "${asset_dir}/customizer/pocketforge-node-chassis.scad" \
  "${asset_dir}/customizer/lib/pf-2020.scad" \
  "${asset_dir}/customizer/lib/usb-c-interrupter-bracket.scad" \
  "${actual_revision}" \
  "${ALLOW_DIRTY_CAD:-0}" <<'PY'
import hashlib
import json
import pathlib
import sys

output = pathlib.Path(sys.argv[1])
source = pathlib.Path(sys.argv[2])
library = pathlib.Path(sys.argv[3])
usb_c_interrupter_library = pathlib.Path(sys.argv[4])
data = {
    "schema": 1,
    "source_revision": sys.argv[5],
    "source_dirty": sys.argv[6] == "1",
    "entrypoint": source.name,
    "library": f"lib/{library.name}",
    "part": "production_batch_06_device_nameplate",
    "parameter": "DEVICE_LABEL",
    "maximum_label_characters": 29,
    "cable_anchor": {
        "part": "cable_tie_anchor",
        "fasteners": ["M5", "M3"],
    },
    "files": {
        source.name: hashlib.sha256(source.read_bytes()).hexdigest(),
        f"lib/{library.name}": hashlib.sha256(library.read_bytes()).hexdigest(),
        f"lib/{usb_c_interrupter_library.name}": hashlib.sha256(
            usb_c_interrupter_library.read_bytes()
        ).hexdigest(),
    },
}
output.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
PY

required_assets=(
  hero.png
  wire-management-anchor.png
  pocketforge-test-node.glb
  pocketforge-test-node.provenance.json
  dualbar/layout-preload.png
  dualbar/layout-suspension-detail.png
  dualbar/cut-list.csv
  assembly/assembly-01-channel-bar.png
  assembly/assembly-02-width-rails.png
  assembly/assembly-03-depth-rails.png
  assembly/assembly-04-fixture-bars.png
  assembly/assembly-05-lower-frame.png
  assembly/assembly-06-lower-fixture-bar.png
  assembly/assembly-07-posts.png
  assembly/assembly-08-upper-ring.png
  assembly/assembly-09-upper-fixture-bar.png
  assembly/assembly-10-close-frame.png
  assembly/assembly-11-square-frame.png
  assembly/assembly-12-dut-holder.png
  assembly/assembly-13-fixture-board.png
  assembly/assembly-14-usb-c-interrupter.png
  assembly/assembly-15-placard.png
  assembly/assembly-16-power-strip.png
  assembly/assembly-17-stacking-tabs.png
  assembly/assembly-18-final.png
  device-examples/smart_pro/layout-assembly.png
  device-examples/smart_pro/layout-front.png
  device-examples/smart_pro/layout-device-side.png
  device-examples/smart_pro_s/layout-assembly.png
  device-examples/smart_pro_s/layout-front.png
  device-examples/smart_pro_s/layout-device-side.png
  device-examples/trimui_brick/layout-assembly.png
  device-examples/trimui_brick/layout-front.png
  device-examples/trimui_brick/layout-device-side.png
  device-examples/powkiddy_x55/layout-assembly.png
  device-examples/powkiddy_x55/layout-front.png
  device-examples/powkiddy_x55/layout-device-side.png
  legacy/prep-captive-nut.png
  legacy/prep-captive-nut-count.png
  legacy/preload-channel-bar.png
  legacy/preload-map.png
  legacy/preload-width-rails.png
  legacy/preload-parked-replacement.png
  legacy/preload-depth-rails.png
  legacy/preload-camera-frame.png
  legacy/step-01-splice-uprights.png
  legacy/step-02-build-gantry.png
  legacy/step-03-open-frame.png
  legacy/step-04-install-gantry.png
  legacy/step-05-close-frame.png
  legacy/step-06-mount-carrier.png
  legacy/step-07-mount-fixture.png
  legacy/qualified-gantry-complete.png
  legacy/detail-01-splice-xray.png
  legacy/detail-02-crossbar-corner.png
  legacy/detail-03-lower-frame-layout.png
  legacy/detail-03-flush-corner.png
  legacy/detail-04-lower-gantry.png
  legacy/detail-04-joint-plate.png
  legacy/detail-04-gantry-position.png
  legacy/detail-05-lower-top-ring.png
  legacy/detail-05-square-diagonals.png
  legacy/detail-06-carrier-link-lengths.png
  legacy/detail-06-carrier-link-lengths-stack-clear.png
  legacy/detail-07-fixture-spacers.png
  legacy/detail-07-optical-axis.png
  legacy/detail-08-placard.png
  legacy/detail-08-power-strip.png
  legacy/detail-08-stacking-corner.png
  print-batches/batch-00-calibration.png
  print-batches/batch-00-calibration.glb
  print-batches/batch-01-ironed-interfaces.png
  print-batches/batch-01-ironed-interfaces.glb
  print-batches/batch-02-fixture-links.png
  print-batches/batch-02-fixture-links.glb
  print-batches/batch-04-frame-hardware.png
  print-batches/batch-04-frame-hardware.glb
  print-batches/batch-05-placard-holder.png
  print-batches/batch-05-placard-holder.glb
  print-batches/batch-06-device-nameplate.png
  print-batches/batch-06-device-nameplate.glb
  print-batches/batch-07-wire-management.png
  print-batches/batch-07-wire-management.glb
  print-batches/cable-anchor-m5.png
  print-batches/cable-anchor-m5.glb
  print-batches/cable-anchor-m3.png
  print-batches/cable-anchor-m3.glb
  browser/catalog.json
  browser/SHA256SUMS
  customizer/pocketforge-node-chassis.scad
  customizer/lib/pf-2020.scad
  customizer/lib/usb-c-interrupter-bracket.scad
  customizer/customizer-provenance.json
)
for required_asset in "${required_assets[@]}"; do
  [[ -s "${asset_dir}/${required_asset}" ]] || {
    echo "missing or empty generated asset: ${required_asset}" >&2
    exit 1
  }
done

python3 - \
  "${asset_dir}/browser/catalog.json" \
  "${asset_dir}/browser" \
  "${ALLOW_DIRTY_CAD:-0}" <<'PY'
import hashlib
import json
import pathlib
import sys

catalog_path = pathlib.Path(sys.argv[1])
browser_root = pathlib.Path(sys.argv[2])
catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
if catalog.get("schema") != "pocketforge-browser-device-pack-catalog-v1":
    raise SystemExit("browser device-pack catalog schema changed")
expected_dirty = sys.argv[3] == "1"
if catalog.get("source", {}).get("dirty") is not expected_dirty:
    raise SystemExit("browser device-pack catalog dirty state changed")
for record in catalog.get("sources", []):
    path = browser_root / record["bundle_path"]
    if not path.is_file():
        raise SystemExit(f"missing browser OpenSCAD source: {path}")
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != record["sha256"]:
        raise SystemExit(f"browser OpenSCAD source hash changed: {path}")
PY

if find "${asset_dir}" -type f -name '*.stl' | grep -q .; then
  echo "candidate STL leaked into the handbook publication" >&2
  exit 1
fi
for retired_asset in \
  layout-assembly.png \
  layout-front.png \
  step-08-complete.png; do
  if find "${asset_dir}" -type f -name "${retired_asset}" \
      ! -path "${asset_dir}/device-examples/*" | grep -q .; then
    echo "standalone full-chassis still leaked into publication: ${retired_asset}" >&2
    exit 1
  fi
done

provenance_args=(
  "${asset_dir}/pocketforge-test-node.provenance.json"
  "${actual_revision}"
  --model
  "${asset_dir}/pocketforge-test-node.glb"
)
if [[ "${ALLOW_DIRTY_CAD:-0}" == "1" ]]; then
  provenance_args+=(--allow-dirty)
fi
python3 \
  "${script_dir}/verify-test-node-model-provenance.py" \
  "${provenance_args[@]}"

(
  cd "${asset_dir}"
  find . -type f ! -path ./SHA256SUMS -print0 |
    sort -z |
    xargs -0 sha256sum >"${temporary_root}/SHA256SUMS"
)
install -m 0644 "${temporary_root}/SHA256SUMS" "${asset_dir}/SHA256SUMS"

echo "cad_assets=pass revision=${actual_revision} destination=${asset_dir}"
