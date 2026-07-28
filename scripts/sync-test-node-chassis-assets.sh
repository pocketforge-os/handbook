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

make_command=(
  make
  -C "${project_dir}"
  "PYTHON=${python_env}/bin/python"
  guide-model
  topbar-preview
  topbar-cutlist
  build/handbook/hero.png
  build/handbook/wire-management-anchor.png
)
if command -v xvfb-run >/dev/null 2>&1; then
  xvfb-run --auto-servernum "${make_command[@]}"
else
  QT_QPA_PLATFORM=offscreen "${make_command[@]}"
fi

browser_bundle="${temporary_root}/browser-device-packs"
python3 \
  "${source_root}/mechanical/device-packs/export_browser_bundle.py" \
  --root "${source_root}" \
  build \
  --output "${browser_bundle}"
python3 \
  "${source_root}/mechanical/device-packs/export_browser_bundle.py" \
  --root "${source_root}" \
  verify \
  --bundle "${browser_bundle}"

if [[ -d "${asset_dir}" ]]; then
  find "${asset_dir}" -mindepth 1 -depth -delete
fi
mkdir -p \
  "${asset_dir}/browser" \
  "${asset_dir}/customizer/lib" \
  "${asset_dir}/topbar"

install -m 0644 \
  "${project_dir}/build/handbook/hero.png" \
  "${project_dir}/build/handbook/wire-management-anchor.png" \
  "${project_dir}/build/handbook/model/pocketforge-test-node.glb" \
  "${project_dir}/build/handbook/model/pocketforge-test-node.provenance.json" \
  "${asset_dir}/"
install -m 0644 \
  "${project_dir}/build/topbar/layout-lower-backstays.png" \
  "${project_dir}/build/topbar/layout-preload.png" \
  "${project_dir}/build/topbar/layout-suspension-detail.png" \
  "${project_dir}/build/topbar/layout-upper-hangers.png" \
  "${project_dir}/build/topbar/cut-list.csv" \
  "${asset_dir}/topbar/"

cut_plan_mode=--check
if [[ "${UPDATE_CUT_PLAN:-0}" == "1" ]]; then
  cut_plan_mode=--write
fi
python3 \
  "${script_dir}/render-test-node-cut-plan.py" \
  --plan "${repo_root}/docs/assets/test-node-chassis-cut-plan.json" \
  --cut-list "${asset_dir}/topbar/cut-list.csv" \
  --output "${repo_root}/docs/assets/test-node-chassis-cut-plan.svg" \
  "${cut_plan_mode}"

install -m 0644 \
  "${project_dir}/pocketforge-node-chassis.scad" \
  "${asset_dir}/customizer/pocketforge-node-chassis.scad"
install -m 0644 \
  "${project_dir}/lib/pf-2020.scad" \
  "${asset_dir}/customizer/lib/pf-2020.scad"
cp -a "${browser_bundle}/." "${asset_dir}/browser/"

python3 - \
  "${asset_dir}/customizer/customizer-provenance.json" \
  "${asset_dir}/customizer/pocketforge-node-chassis.scad" \
  "${asset_dir}/customizer/lib/pf-2020.scad" \
  "${actual_revision}" \
  "${ALLOW_DIRTY_CAD:-0}" <<'PY'
import hashlib
import json
import pathlib
import sys

output = pathlib.Path(sys.argv[1])
source = pathlib.Path(sys.argv[2])
library = pathlib.Path(sys.argv[3])
data = {
    "schema": 1,
    "source_revision": sys.argv[4],
    "source_dirty": sys.argv[5] == "1",
    "entrypoint": source.name,
    "library": f"lib/{library.name}",
    "part": "production_batch_06_device_nameplate",
    "parameter": "DEVICE_LABEL",
    "maximum_label_characters": 29,
    "files": {
        source.name: hashlib.sha256(source.read_bytes()).hexdigest(),
        f"lib/{library.name}": hashlib.sha256(library.read_bytes()).hexdigest(),
    },
}
output.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
PY

required_assets=(
  hero.png
  wire-management-anchor.png
  pocketforge-test-node.glb
  pocketforge-test-node.provenance.json
  topbar/layout-lower-backstays.png
  topbar/layout-preload.png
  topbar/layout-suspension-detail.png
  topbar/layout-upper-hangers.png
  topbar/cut-list.csv
  browser/catalog.json
  browser/SHA256SUMS
  customizer/pocketforge-node-chassis.scad
  customizer/lib/pf-2020.scad
  customizer/customizer-provenance.json
)
for required_asset in "${required_assets[@]}"; do
  [[ -s "${asset_dir}/${required_asset}" ]] || {
    echo "missing or empty generated asset: ${required_asset}" >&2
    exit 1
  }
done

python3 - "${asset_dir}/browser/catalog.json" "${asset_dir}/browser" <<'PY'
import hashlib
import json
import pathlib
import sys

catalog_path = pathlib.Path(sys.argv[1])
browser_root = pathlib.Path(sys.argv[2])
catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
if catalog.get("schema") != "pocketforge-browser-device-pack-catalog-v1":
    raise SystemExit("browser device-pack catalog schema changed")
if catalog.get("source", {}).get("dirty") is not False:
    raise SystemExit("browser device-pack catalog was exported from dirty source")
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
  if find "${asset_dir}" -type f -name "${retired_asset}" | grep -q .; then
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
