import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  BROWSER_MANIFEST_SCHEMA,
  buildOpenScadArguments,
  canonicalizeGeneratedStl,
  createPackArchive,
  createStoredZip,
  inspectStl,
  loadVerifiedCatalog,
  safeRelativePath,
  selectDeviceMode,
  validateBrowserBaselines,
  validateCatalog,
} from "../docs/assets/device-pack-generator-core.mjs";

const catalogPath =
  "docs/assets/generated/test-node-chassis/browser/catalog.json";
const checksumsPath =
  "docs/assets/generated/test-node-chassis/browser/SHA256SUMS";
const catalog = validateCatalog(
  JSON.parse(await readFile(catalogPath, "utf8")),
);
const baselines = JSON.parse(
  await readFile("docs/assets/device-pack-browser-baselines.json", "utf8"),
);

const tetraStl = new TextEncoder().encode(`solid tetra
facet normal 0 0 0
outer loop
vertex 0 0 0
vertex 1 0 0
vertex 0 1 0
endloop
endfacet
facet normal 0 0 0
outer loop
vertex 0 0 0
vertex 0 0 1
vertex 1 0 0
endloop
endfacet
facet normal 0 0 0
outer loop
vertex 0 0 0
vertex 0 1 0
vertex 0 0 1
endloop
endfacet
facet normal 0 0 0
outer loop
vertex 1 0 0
vertex 0 0 1
vertex 0 1 0
endloop
endfacet
endsolid tetra
`);

function localZipNames(bytes) {
  const names = [];
  const decoder = new TextDecoder();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  while (view.getUint32(offset, true) === 0x04034b50) {
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    names.push(decoder.decode(bytes.slice(nameStart, nameStart + nameLength)));
    offset = nameStart + nameLength + extraLength + size;
  }
  return names;
}

test("catalog exposes every mode and a complete source-only inventory", () => {
  assert.equal(catalog.devices.length, 4);
  assert.deepEqual(catalog.modes, ["coupon", "retrofit", "full"]);
  assert.equal(new Set(catalog.devices.map((device) => device.slug)).size,
    catalog.devices.length);
  assert.equal(catalog.sources.every((source) => source.path.endsWith(".scad")),
    true);
  for (const device of catalog.devices) {
    assert.equal(device.modes.coupon.artifacts.length, 1);
    assert.equal(device.modes.retrofit.artifacts.length, 7);
    assert.ok(device.modes.full.artifacts.length > 7);
    const fullIds = new Set(
      device.modes.full.artifacts.map((artifact) => artifact.id),
    );
    assert.equal(
      device.modes.retrofit.artifacts.every((artifact) =>
        fullIds.has(artifact.id)),
      true,
    );
  }
});

test("Brick remains an explicitly unqualified prototype", () => {
  const brick = catalog.devices.find(
    (device) => device.slug === "trimui-brick",
  );
  assert.ok(brick);
  assert.equal(brick.profile.qualification.status, "unqualified");
  assert.equal(brick.profile.qualification.acceptance_ref, null);
  assert.equal(brick.layout.qualification.status, "candidate");
  assert.equal(brick.layout.qualification.acceptance_ref, "tsp-bcx.21.38");
  assert.equal(brick.modes.full.production_eligible, false);
  assert.deepEqual(brick.modes.full.nonproduction_reasons, [
    "holder_unqualified",
    "layout_unqualified",
  ]);
  assert.deepEqual(brick.modes.full.required_overrides, [
    "allow_unqualified",
  ]);
  assert.deepEqual(brick.modes.retrofit.nonproduction_reasons, [
    "holder_unqualified",
    "layout_unqualified",
  ]);

  for (const device of catalog.devices) {
    assert.equal(device.layout.qualification.status, "candidate");
    assert.equal(device.modes.retrofit.production_eligible, false);
    assert.equal(
      device.modes.retrofit.nonproduction_reasons.includes(
        "layout_unqualified",
      ),
      true,
    );
  }

  const invalid = structuredClone(catalog);
  invalid.devices.find(
    (device) => device.slug === "trimui-brick",
  ).profile.qualification.acceptance_ref = "premature-acceptance";
  assert.throws(
    () => validateCatalog(invalid),
    /must stay null before qualification/i,
  );
});

test("Powkiddy X55 remains coupon-first and explicitly unqualified", () => {
  const x55 = catalog.devices.find(
    (device) => device.slug === "powkiddy-x55",
  );
  assert.ok(x55);
  assert.equal(x55.profile.qualification.status, "unqualified");
  assert.equal(x55.profile.qualification.acceptance_ref, null);
  assert.equal(x55.layout.qualification.status, "candidate");
  assert.equal(x55.layout.qualification.acceptance_ref, "tsp-bcx.21.40");
  assert.equal(x55.modes.coupon.artifacts.length, 1);
  assert.equal(x55.modes.retrofit.artifacts.length, 7);
  assert.equal(x55.modes.full.artifacts.length, 12);
  assert.deepEqual(x55.modes.coupon.nonproduction_reasons, [
    "coupon_only",
    "holder_unqualified",
  ]);
  assert.deepEqual(x55.modes.full.nonproduction_reasons, [
    "holder_unqualified",
    "layout_unqualified",
  ]);
  assert.deepEqual(x55.modes.full.required_overrides, [
    "allow_unqualified",
  ]);
});

test("browser baseline lock covers every registered full-pack artifact", () => {
  assert.equal(validateBrowserBaselines(baselines, catalog), baselines);
  assert.equal(
    Object.keys(baselines.artifacts).length,
    catalog.devices.reduce(
      (total, device) => total + device.modes.full.artifacts.length,
      0,
    ),
  );
  assert.throws(
    () =>
      validateBrowserBaselines(
        {
          ...structuredClone(baselines),
          source: { ...baselines.source, commit: "0".repeat(40) },
        },
        catalog,
      ),
    /pinned source revision/i,
  );
  const tampered = structuredClone(baselines);
  const firstKey = Object.keys(tampered.artifacts)[0];
  tampered.artifacts[firstKey].browser_normalized_sha256 = "0".repeat(63);
  assert.throws(
    () => validateBrowserBaselines(tampered, catalog),
    /baseline changed/i,
  );
});

test("desktop font overlay resolves from the pinned CAD checkout", async () => {
  const config = await readFile(
    "docs/assets/device-pack-desktop-fonts.conf",
    "utf8",
  );
  assert.match(
    config,
    /<dir prefix="cwd">\.\.\/\.\.\/docs\/assets\/vendor\/openscad\/fonts<\/dir>/,
  );
});

test("catalog checksum is verified before its JSON is accepted", async () => {
  const catalogBytes = await readFile(catalogPath);
  const checksums = await readFile(checksumsPath);
  let servedCatalog = catalogBytes;
  const fetchImpl = async (url) =>
    String(url).endsWith("/catalog.json")
      ? new Response(servedCatalog)
      : new Response(checksums);
  const loaded = await loadVerifiedCatalog(
    "https://example.test/catalog.json",
    "https://example.test/SHA256SUMS",
    fetchImpl,
  );
  assert.deepEqual(loaded, catalog);

  const tampered = new Uint8Array(catalogBytes);
  tampered[tampered.length - 2] ^= 1;
  servedCatalog = tampered;
  await assert.rejects(
    loadVerifiedCatalog(
      "https://example.test/catalog.json",
      "https://example.test/SHA256SUMS",
      fetchImpl,
    ),
    /catalog hash changed/i,
  );
});

test("OpenSCAD arguments preserve the catalog's ordered definitions", () => {
  const { mode } = selectDeviceMode(
    catalog,
    "trimui-smart-pro-s",
    "full",
  );
  const artifact = mode.artifacts.find(
    (candidate) => candidate.id === "device_carrier",
  );
  const args = buildOpenScadArguments(artifact);
  assert.deepEqual(args.slice(0, 6), [
    "--backend=Manifold",
    "--check-parameters=true",
    "--check-parameter-ranges=true",
    "-o",
    "/output.stl",
    "-D",
  ]);
  assert.equal(args.at(-1), `/work/${artifact.source}`);
  assert.equal(
    args.filter((argument) => argument === "-D").length,
    artifact.definitions.length,
  );
});

test("browser STL inspection matches the source normalized fingerprint", async () => {
  const metrics = await inspectStl(tetraStl);
  assert.equal(metrics.triangle_count, 4);
  assert.equal(metrics.edge_count, 6);
  assert.equal(metrics.component_count, 1);
  assert.deepEqual(metrics.bounds_mm, [[0, 1], [0, 1], [0, 1]]);
  assert.ok(Math.abs(metrics.surface_area_mm2 - 2.3660254038) < 1e-9);
  assert.ok(Math.abs(metrics.volume_mm3 - (1 / 6)) < 1e-9);
  assert.equal(
    metrics.normalized_sha256,
    "f1aeee57127f2e104836045851b9a65d0f90756b3121950caa15777562159541",
  );
  await assert.rejects(
    inspectStl(new TextEncoder().encode(
      "solid open\nfacet normal 0 0 0\nouter loop\n" +
        "vertex 0 0 0\nvertex 1 0 0\nvertex 0 1 0\n" +
        "endloop\nendfacet\nendsolid open\n",
    )),
    /not closed edge-manifold/i,
  );

  const degenerateStl = new TextEncoder().encode(
    new TextDecoder().decode(tetraStl).replace(
      "endsolid tetra",
      "facet normal 0 0 0\nouter loop\n" +
        "vertex 0 0 0\nvertex 0 0 0\nvertex 0 0 0\n" +
        "endloop\nendfacet\nendsolid tetra",
    ),
  );
  const canonical = canonicalizeGeneratedStl(degenerateStl);
  assert.equal(canonical.removed_degenerate_facets, 1);
  assert.equal(
    (await inspectStl(canonical.bytes)).normalized_sha256,
    metrics.normalized_sha256,
  );
});

test("complete pack archive is deterministic and self-describing", async () => {
  const { mode } = selectDeviceMode(catalog, "trimui-smart-pro", "coupon");
  const metrics = await inspectStl(tetraStl);
  metrics.browser_runtime_version = "test-runtime";
  metrics.browser_baseline_sha256 = "a".repeat(64);
  const generated = new Map([
    [
      mode.artifacts[0].id,
      { bytes: tetraStl, metrics },
    ],
  ]);
  const first = await createPackArchive(
    catalog,
    "trimui-smart-pro",
    "coupon",
    generated,
  );
  const second = await createPackArchive(
    catalog,
    "trimui-smart-pro",
    "coupon",
    generated,
  );
  assert.deepEqual(first.bytes, second.bytes);
  assert.equal(first.manifest.schema, BROWSER_MANIFEST_SCHEMA);
  assert.equal(first.manifest.artifacts.length, 1);
  assert.deepEqual(first.manifest.generator, {
    backend: "Manifold",
    browser_baseline_sha256: "a".repeat(64),
    canonicalizer: "pocketforge-browser-canonical-stl-v1",
    engine: "OpenSCAD WebAssembly",
    engine_version: "test-runtime",
    environment: "browser",
    generated_locally: true,
  });
  assert.deepEqual(localZipNames(first.bytes), [
    "device-pack-trimui-smart-pro-coupon/coupon/holder-fit-coupon.stl",
    "device-pack-trimui-smart-pro-coupon/manifest.json",
    "device-pack-trimui-smart-pro-coupon/SHA256SUMS",
  ]);
});

test("ZIP and path helpers reject traversal and duplicate entries", () => {
  assert.throws(() => safeRelativePath("../escape.stl"), /unsafe segment/);
  assert.throws(
    () => createStoredZip([
      { name: "same.stl", bytes: tetraStl },
      { name: "same.stl", bytes: tetraStl },
    ]),
    /repeats same\.stl/,
  );
});
