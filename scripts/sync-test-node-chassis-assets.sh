#!/usr/bin/env bash
set -euo pipefail

script_dir=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(CDPATH= cd -- "${script_dir}/.." && pwd)
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
  handbook-assets
)
if command -v xvfb-run >/dev/null 2>&1; then
  xvfb-run --auto-servernum "${make_command[@]}"
else
  "${make_command[@]}"
fi

if [[ -d "${asset_dir}" ]]; then
  find "${asset_dir}" -mindepth 1 -depth -delete
fi
mkdir -p "${asset_dir}/customizer/lib"

install -m 0644 "${project_dir}"/build/handbook/*.png "${asset_dir}/"
install -m 0644 "${project_dir}"/build/handbook/batch-*.glb "${asset_dir}/"
install -m 0644 \
  "${project_dir}/build/handbook/model/pocketforge-test-node.glb" \
  "${project_dir}/build/handbook/model/pocketforge-test-node.provenance.json" \
  "${asset_dir}/"
install -m 0644 \
  "${project_dir}"/build/production-batch-*.stl \
  "${asset_dir}/"
install -m 0644 \
  "${project_dir}/build/cut-list.csv" \
  "${asset_dir}/"
install -m 0644 \
  "${project_dir}/build/cut-list.md" \
  "${asset_dir}/cut-list.generated.txt"
install -m 0644 \
  "${project_dir}/pocketforge-node-chassis.scad" \
  "${asset_dir}/customizer/pocketforge-node-chassis.scad"
install -m 0644 \
  "${project_dir}/lib/pf-2020.scad" \
  "${asset_dir}/customizer/lib/pf-2020.scad"

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
  production-batch-00-calibration.stl
  production-batch-01-ironed-interfaces.stl
  production-batch-02-splice-collars.stl
  production-batch-03-movable-mounts.stl
  production-batch-04-frame-hardware.stl
  production-batch-05-placard-holder.stl
  production-batch-06-device-nameplate.stl
  hero.png
  step-01-splice-uprights.png
  step-02-build-gantry.png
  step-03-open-frame.png
  step-04-install-gantry.png
  step-05-close-frame.png
  step-06-mount-carrier.png
  step-07-mount-fixture.png
  step-08-complete.png
  detail-01-splice-xray.png
  detail-02-crossbar-corner.png
  detail-03-lower-frame-layout.png
  detail-03-flush-corner.png
  detail-04-lower-gantry.png
  detail-04-joint-plate.png
  detail-04-gantry-position.png
  detail-05-lower-top-ring.png
  detail-05-square-diagonals.png
  detail-06-carrier-link-lengths.png
  detail-07-fixture-spacers.png
  detail-07-optical-axis.png
  detail-08-placard.png
  detail-08-power-strip.png
  detail-08-stacking-corner.png
  batch-00-calibration.png
  batch-01-ironed-interfaces.png
  batch-02-splice-collars.png
  batch-03-movable-mounts.png
  batch-04-frame-hardware.png
  batch-05-placard-holder.png
  batch-06-device-nameplate.png
  batch-00-calibration.glb
  batch-01-ironed-interfaces.glb
  batch-02-splice-collars.glb
  batch-03-movable-mounts.glb
  batch-04-frame-hardware.glb
  batch-05-placard-holder.glb
  batch-06-device-nameplate.glb
  prep-captive-nut.png
  prep-captive-nut-count.png
  preload-channel-bar.png
  preload-map.png
  preload-width-rails.png
  preload-parked-replacement.png
  preload-depth-rails.png
  preload-camera-frame.png
  pocketforge-test-node.glb
  pocketforge-test-node.provenance.json
  cut-list.csv
  cut-list.generated.txt
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

python3 - \
  "${asset_dir}/pocketforge-test-node.provenance.json" \
  "$(git -C "${source_root}" rev-parse HEAD)" \
  "${ALLOW_DIRTY_CAD:-0}" <<'PY'
import json
import pathlib
import sys

provenance = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
expected_revision = sys.argv[2]
allow_dirty = sys.argv[3] == "1"
if provenance["source_revision"] != expected_revision:
    raise SystemExit("generated model provenance names the wrong revision")
if provenance["source_dirty"] and not allow_dirty:
    raise SystemExit("generated model provenance is dirty")
semantic_layers = provenance["semantic_layers"]
# Permit the immutable pre-BPI pins while this consumer gate lands first. Every
# other source revision must publish the complete 23-layer model.
legacy_model_revisions = {
    "c53312769ec9542e3b5293a96e13b978fac69f78",
    "ef69746be01561e1d709ce1a9929f3acb75d6721",
}
is_legacy_model = expected_revision in legacy_model_revisions
expected_layer_count = 18 if is_legacy_model else 23
if len(semantic_layers) != expected_layer_count:
    raise SystemExit("generated model semantic layer count changed")
expected_bpi_layers = {
    "fixture-bpi-pcb",
    "fixture-bpi-dark",
    "fixture-bpi-metal",
    "fixture-bpi-gold",
    "fixture-bpi-silkscreen",
}
missing_bpi_layers = (
    set()
    if is_legacy_model
    else expected_bpi_layers.difference(semantic_layers)
)
if missing_bpi_layers:
    raise SystemExit(
        "generated model is missing Banana Pi semantic layers: "
        + ", ".join(sorted(missing_bpi_layers))
    )
if "placard-labels" not in semantic_layers:
    raise SystemExit("generated model is missing the placard-labels layer")
PY

(
  cd "${asset_dir}"
  find . -type f ! -name SHA256SUMS -print0 |
    sort -z |
    xargs -0 sha256sum > SHA256SUMS
)

if find "${asset_dir}" -maxdepth 1 -type f -name '*print-group*' | grep -q .; then
  echo "historical print-group artifact leaked into canonical handbook assets" >&2
  exit 1
fi

echo "cad_assets=pass revision=$(git -C "${source_root}" rev-parse HEAD) destination=${asset_dir}"
