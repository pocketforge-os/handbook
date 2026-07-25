#!/usr/bin/env bash
set -euo pipefail

script_dir=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(CDPATH= cd -- "${script_dir}/.." && pwd)
vendor_dir="${repo_root}/docs/assets/vendor/openscad"

openscad_version="2025.03.25.wasm24456"
openscad_revision="ce5039f8a9545ad5a8cf197b3ca11c0939bc67f1"
openscad_archive_url="https://files.openscad.org/playground/OpenSCAD-2025.03.25.wasm24456-WebAssembly-web.zip"
openscad_archive_sha256="0968af31b9c9b3bba68d9031de1695ccae51c32231a1aab4ef27b18c86379f3b"
openscad_copying_url="https://raw.githubusercontent.com/openscad/openscad/${openscad_revision}/COPYING"

font_archive_url="https://ochafik.com/openscad2/libraries/fonts.zip"
font_archive_sha256="7b0731569b3b815a144fe350b60aa52c12d0b97b3dbfeff0d72a5012f16622f0"

declare -A expected_sha256=(
  ["openscad.js"]="904a47f29e63afb597bedef747da3b457d8ea17cc793c462c6c8b444e918a62e"
  ["openscad.wasm"]="f72ce246c02c0e501990837102be383326b153fd761774ebfacce5c80c5ecf26"
  ["COPYING.txt"]="1805a29c3bccbc0428ce0048a1dfdeb9b1867677410e99c89c3c30932ae8c7d5"
  ["fonts/LiberationSans-Bold.ttf"]="d723d5a272970aedf296ef6fc628180df6074bce7769701ea9e0d222c052668c"
  ["fonts/fonts.conf"]="8b8c23ea9fc123db3f758872f76dbf841191bf751ddb7ef73a11a1eb3a1a25de"
  ["fonts/LICENSE.txt"]="93fed46019c38bbe566b479d22148e2e8a1e85ada614accb0211c37b2c61c19b"
  ["fonts/AUTHORS.txt"]="d640bd6acfd5f7558507851f3e8936857b390bbe7e10c662241161dd83dbe830"
)

verify_file() {
  local relative_path=$1
  local expected=${expected_sha256["${relative_path}"]}
  local path="${vendor_dir}/${relative_path}"
  [[ -f "${path}" ]] || {
    echo "missing vendored OpenSCAD asset: ${path}" >&2
    return 1
  }
  printf '%s  %s\n' "${expected}" "${path}" | sha256sum --check --status || {
    echo "vendored OpenSCAD checksum mismatch: ${path}" >&2
    return 1
  }
}

verify_all() {
  local relative_path
  for relative_path in "${!expected_sha256[@]}"; do
    verify_file "${relative_path}"
  done

  python3 - \
    "${vendor_dir}/PROVENANCE.json" \
    "${openscad_version}" \
    "${openscad_revision}" \
    "${openscad_archive_sha256}" \
    "${font_archive_sha256}" <<'PY'
import json
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
if not path.is_file():
    raise SystemExit(f"missing OpenSCAD provenance: {path}")
data = json.loads(path.read_text(encoding="utf-8"))
expected = {
    "schema": 1,
    "openscad_version": sys.argv[2],
    "openscad_source_revision": sys.argv[3],
    "openscad_archive_sha256": sys.argv[4],
    "font_archive_sha256": sys.argv[5],
}
actual = {
    "schema": data.get("schema"),
    "openscad_version": data.get("openscad", {}).get("version"),
    "openscad_source_revision": data.get("openscad", {}).get("source_revision"),
    "openscad_archive_sha256": data.get("openscad", {}).get("archive_sha256"),
    "font_archive_sha256": data.get("liberation_sans", {}).get("archive_sha256"),
}
if actual != expected:
    raise SystemExit(
        f"OpenSCAD provenance changed: {actual!r} != {expected!r}"
    )
PY

  echo "nameplate_runtime=pass version=${openscad_version}"
}

case "${1:-refresh}" in
  --verify)
    verify_all
    exit 0
    ;;
  refresh)
    ;;
  *)
    echo "usage: $0 [refresh|--verify]" >&2
    exit 2
    ;;
esac

temporary_root=$(mktemp -d)
cleanup() {
  if [[ -d "${temporary_root}" ]]; then
    find "${temporary_root}" -depth -delete
  fi
}
trap cleanup EXIT

curl --fail --location --silent --show-error \
  "${openscad_archive_url}" \
  --output "${temporary_root}/openscad.zip"
printf '%s  %s\n' \
  "${openscad_archive_sha256}" \
  "${temporary_root}/openscad.zip" |
  sha256sum --check --status

curl --fail --location --silent --show-error \
  "${font_archive_url}" \
  --output "${temporary_root}/fonts.zip"
printf '%s  %s\n' \
  "${font_archive_sha256}" \
  "${temporary_root}/fonts.zip" |
  sha256sum --check --status

mkdir -p "${temporary_root}/openscad" "${temporary_root}/fonts"
unzip -q "${temporary_root}/openscad.zip" -d "${temporary_root}/openscad"
unzip -q "${temporary_root}/fonts.zip" \
  LiberationSans-Bold.ttf fonts.conf LICENSE AUTHORS \
  -d "${temporary_root}/fonts"
curl --fail --location --silent --show-error \
  "${openscad_copying_url}" \
  --output "${temporary_root}/COPYING.txt"

mkdir -p "${vendor_dir}/fonts"
install -m 0644 \
  "${temporary_root}/openscad/openscad.js" \
  "${vendor_dir}/openscad.js"
install -m 0644 \
  "${temporary_root}/openscad/openscad.wasm" \
  "${vendor_dir}/openscad.wasm"
install -m 0644 \
  "${temporary_root}/COPYING.txt" \
  "${vendor_dir}/COPYING.txt"
install -m 0644 \
  "${temporary_root}/fonts/LiberationSans-Bold.ttf" \
  "${vendor_dir}/fonts/LiberationSans-Bold.ttf"
install -m 0644 \
  "${temporary_root}/fonts/fonts.conf" \
  "${vendor_dir}/fonts/fonts.conf"
install -m 0644 \
  "${temporary_root}/fonts/LICENSE" \
  "${vendor_dir}/fonts/LICENSE.txt"
install -m 0644 \
  "${temporary_root}/fonts/AUTHORS" \
  "${vendor_dir}/fonts/AUTHORS.txt"

verify_all
