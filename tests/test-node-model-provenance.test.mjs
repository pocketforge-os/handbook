import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const verifier = new URL(
  "../scripts/verify-test-node-model-provenance.py",
  import.meta.url,
);

const preBpiRevision = "c53312769ec9542e3b5293a96e13b978fac69f78";
const bpiOnlyRevision = "4dd6dc261466249d4aed4f73ee690e3f9d8f8da6";
const esp32MigrationRevision = "4425ef39a40ab53a426693cd0bf07df6b6c53b66";

const baseLayers = [
  "aluminum",
  "connectors",
  "printed-hardware",
  "fixture-plate",
  "fixture-components",
  "fixture-labels",
  "carrier-body",
  "carrier-labels",
  "carrier-hooks",
  "device-shell",
  "device-controls",
  "device-screen",
  "webcam",
  "power-strip",
  "placard-holder",
  "placard-insert",
  "placard-labels",
  "camera-frustum",
];

const bpiLayers = [
  "fixture-bpi-pcb",
  "fixture-bpi-dark",
  "fixture-bpi-metal",
  "fixture-bpi-gold",
  "fixture-bpi-silkscreen",
];

const esp32Layers = [
  "fixture-esp32-pcb",
  "fixture-esp32-dark",
  "fixture-esp32-metal",
  "fixture-esp32-gold",
  "fixture-esp32-antenna",
  "fixture-esp32-silkscreen",
];

async function verify(revision, semanticLayers, options = {}) {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), "test-node-provenance-"),
  );
  const provenancePath = join(temporaryDirectory, "provenance.json");
  await writeFile(
    provenancePath,
    JSON.stringify({
      source_revision: revision,
      source_dirty: options.dirty ?? false,
      semantic_layers: semanticLayers,
    }),
  );
  const args = [
    verifier.pathname,
    provenancePath,
    options.expectedRevision ?? revision,
  ];
  if (options.allowDirty) {
    args.push("--allow-dirty");
  }
  const result = spawnSync("python3", args, { encoding: "utf8" });
  await rm(temporaryDirectory, { recursive: true });
  return result;
}

test("accepts each immutable semantic-layer era", async () => {
  for (const [revision, layers] of [
    [preBpiRevision, baseLayers],
    [bpiOnlyRevision, [...baseLayers, ...bpiLayers]],
    [
      esp32MigrationRevision,
      [...baseLayers, ...bpiLayers, ...esp32Layers],
    ],
  ]) {
    const result = await verify(revision, layers);
    assert.equal(result.status, 0, result.stderr);
  }
});

test("requires all six exact ESP32 semantic layers", async () => {
  const layers = [...baseLayers, ...bpiLayers, ...esp32Layers];

  const missing = await verify(
    esp32MigrationRevision,
    layers.filter((layer) => layer !== "fixture-esp32-antenna"),
  );
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /missing: fixture-esp32-antenna/);

  const extra = await verify(esp32MigrationRevision, [
    ...layers,
    "fixture-esp32-copper",
  ]);
  assert.equal(extra.status, 1);
  assert.match(extra.stderr, /unexpected: fixture-esp32-copper/);

  const misnamed = await verify(
    esp32MigrationRevision,
    layers.map((layer) =>
      layer === "fixture-esp32-silkscreen"
        ? "fixture-esp32-silkscren"
        : layer,
    ),
  );
  assert.equal(misnamed.status, 1);
  assert.match(misnamed.stderr, /missing: fixture-esp32-silkscreen/);
  assert.match(misnamed.stderr, /unexpected: fixture-esp32-silkscren/);
});

test("rejects an ESP32 layer on the BPI-only pin", async () => {
  const result = await verify(bpiOnlyRevision, [
    ...baseLayers,
    ...bpiLayers,
    "fixture-esp32-pcb",
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unexpected: fixture-esp32-pcb/);
});

test("enforces revision and clean-source provenance", async () => {
  const layers = [...baseLayers, ...bpiLayers, ...esp32Layers];
  const wrongRevision = await verify(esp32MigrationRevision, layers, {
    expectedRevision: "0000000000000000000000000000000000000000",
  });
  assert.equal(wrongRevision.status, 1);
  assert.match(wrongRevision.stderr, /names the wrong revision/);

  const dirty = await verify(esp32MigrationRevision, layers, { dirty: true });
  assert.equal(dirty.status, 1);
  assert.match(dirty.stderr, /provenance is dirty/);

  const allowedDirty = await verify(esp32MigrationRevision, layers, {
    dirty: true,
    allowDirty: true,
  });
  assert.equal(allowedDirty.status, 0, allowedDirty.stderr);
});
