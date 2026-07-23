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
if lock.get("schema") != 1:
    raise SystemExit("unsupported CAD asset lock schema")
for key in ("repository", "revision", "project"):
    value = lock.get(key)
    if not isinstance(value, str) or not value:
        raise SystemExit(f"CAD asset lock is missing {key}")
    print(value)
PY
)

source_repository=${lock_values[0]}
source_revision=${lock_values[1]}
project_path=${lock_values[2]}
temporary_root=

cleanup() {
  if [[ -n "${temporary_root}" && -d "${temporary_root}" ]]; then
    find "${temporary_root}" -depth -delete
  fi
}
trap cleanup EXIT

if [[ -n "${CAD_SOURCE_DIR:-}" ]]; then
  source_root=$(realpath "${CAD_SOURCE_DIR}")
  if [[ "${ALLOW_DIRTY_CAD:-0}" != "1" ]]; then
    actual_revision=$(git -C "${source_root}" rev-parse HEAD)
    [[ "${actual_revision}" == "${source_revision}" ]] || {
      echo "CAD revision mismatch: ${actual_revision} != ${source_revision}" >&2
      exit 1
    }
    [[ -z "$(git -C "${source_root}" status --porcelain)" ]] || {
      echo "refusing to publish assets from a dirty CAD worktree" >&2
      exit 1
    }
  fi
else
  [[ "${source_revision}" != PENDING_* ]] || {
    echo "cad-assets.lock.json still has an unmerged placeholder revision" >&2
    exit 1
  }
  temporary_root=$(mktemp -d)
  source_root="${temporary_root}/test-node-hw"
  git init --quiet "${source_root}"
  git -C "${source_root}" remote add origin "${source_repository}"
  git -C "${source_root}" fetch --quiet --depth=1 origin "${source_revision}"
  git -C "${source_root}" checkout --quiet --detach FETCH_HEAD
fi

project_dir="${source_root}/${project_path}"
[[ -f "${project_dir}/Makefile" ]] || {
  echo "locked CAD project does not exist: ${project_dir}" >&2
  exit 1
}

if [[ -z "${temporary_root}" ]]; then
  build_root=$(mktemp -d)
  temporary_root=${build_root}
fi
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

mkdir -p "${asset_dir}"
find "${asset_dir}" -mindepth 1 -maxdepth 1 -type f -delete

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

required_assets=(
  production-batch-00-calibration.stl
  production-batch-01-ironed-interfaces.stl
  production-batch-02-splice-collars.stl
  production-batch-03-movable-mounts.stl
  production-batch-04-frame-hardware.stl
  production-batch-05-identification.stl
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
  batch-05-identification.png
  batch-00-calibration.glb
  batch-01-ironed-interfaces.glb
  batch-02-splice-collars.glb
  batch-03-movable-mounts.glb
  batch-04-frame-hardware.glb
  batch-05-identification.glb
  preload-channel-bar.png
  preload-map.png
  pocketforge-test-node.glb
  pocketforge-test-node.provenance.json
  cut-list.csv
  cut-list.generated.txt
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
if len(provenance["semantic_layers"]) != 18:
    raise SystemExit("generated model semantic layer count changed")
if "placard-labels" not in provenance["semantic_layers"]:
    raise SystemExit("generated model is missing the placard-labels layer")
PY

(
  cd "${asset_dir}"
  find . -maxdepth 1 -type f ! -name SHA256SUMS -print0 |
    sort -z |
    xargs -0 sha256sum > SHA256SUMS
)

if find "${asset_dir}" -maxdepth 1 -type f -name '*print-group*' | grep -q .; then
  echo "historical print-group artifact leaked into canonical handbook assets" >&2
  exit 1
fi

echo "cad_assets=pass revision=$(git -C "${source_root}" rev-parse HEAD) destination=${asset_dir}"
