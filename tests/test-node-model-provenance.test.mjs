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
const c270MigrationRevision = "e05824d27773f7ee495b597d297839d3b2c54b44";
const relayMigrationRevision = "f9cad6f9987eb298546033111698fbcf5192eb10";
const boostMigrationRevision = "36e1b40a368f974a1fb445abf17d425b4e54d79d";
const dp100MigrationRevision = "291203fadee59c268e83772676212505f0a65d2d";

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

const c270Layers = [
  "webcam-shell",
  "webcam-dark",
  "webcam-glass",
  "webcam-led",
  "webcam-labels",
];

const relayLayers = [
  "fixture-relay-pcb",
  "fixture-relay-blue",
  "fixture-relay-dark",
  "fixture-relay-metal",
  "fixture-relay-led",
  "fixture-relay-silkscreen",
];

const boostLayers = [
  "fixture-boost-pcb",
  "fixture-boost-dark",
  "fixture-boost-adjuster",
  "fixture-boost-metal",
  "fixture-boost-silkscreen",
];

const dp100Layers = [
  "fixture-dp100-shell",
  "fixture-dp100-dark",
  "fixture-dp100-controls",
  "fixture-dp100-screen",
  "fixture-dp100-accent",
  "fixture-dp100-metal",
  "fixture-dp100-markings",
];

const c270EraLayers = [
  ...baseLayers.filter((layer) => layer !== "webcam"),
  ...bpiLayers,
  ...esp32Layers,
  ...c270Layers,
];

const relayEraLayers = [...c270EraLayers, ...relayLayers];
const boostEraLayers = [...relayEraLayers, ...boostLayers];
const dp100EraLayers = [...boostEraLayers, ...dp100Layers];

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
    [c270MigrationRevision, c270EraLayers],
    [relayMigrationRevision, relayEraLayers],
    [boostMigrationRevision, boostEraLayers],
    [dp100MigrationRevision, dp100EraLayers],
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

test("requires all five exact C270 semantic layers", async () => {
  const missing = await verify(
    c270MigrationRevision,
    c270EraLayers.filter((layer) => layer !== "webcam-led"),
  );
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /missing: webcam-led/);

  const extra = await verify(c270MigrationRevision, [
    ...c270EraLayers,
    "webcam-mount",
  ]);
  assert.equal(extra.status, 1);
  assert.match(extra.stderr, /unexpected: webcam-mount/);

  const misnamed = await verify(
    c270MigrationRevision,
    c270EraLayers.map((layer) =>
      layer === "webcam-labels" ? "webcam-label" : layer,
    ),
  );
  assert.equal(misnamed.status, 1);
  assert.match(misnamed.stderr, /missing: webcam-labels/);
  assert.match(misnamed.stderr, /unexpected: webcam-label/);

  const legacyProxy = await verify(c270MigrationRevision, [
    ...c270EraLayers,
    "webcam",
  ]);
  assert.equal(legacyProxy.status, 1);
  assert.match(legacyProxy.stderr, /unexpected: webcam/);
});

test("requires all six exact relay semantic layers", async () => {
  assert.equal(c270EraLayers.length, 33);
  assert.equal(relayEraLayers.length, 39);

  const missing = await verify(
    relayMigrationRevision,
    relayEraLayers.filter((layer) => layer !== "fixture-relay-led"),
  );
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /missing: fixture-relay-led/);

  const extra = await verify(relayMigrationRevision, [
    ...relayEraLayers,
    "fixture-relay-copper",
  ]);
  assert.equal(extra.status, 1);
  assert.match(extra.stderr, /unexpected: fixture-relay-copper/);

  const misnamed = await verify(
    relayMigrationRevision,
    relayEraLayers.map((layer) =>
      layer === "fixture-relay-silkscreen"
        ? "fixture-relay-silkscren"
        : layer,
    ),
  );
  assert.equal(misnamed.status, 1);
  assert.match(misnamed.stderr, /missing: fixture-relay-silkscreen/);
  assert.match(misnamed.stderr, /unexpected: fixture-relay-silkscren/);

  const duplicate = await verify(relayMigrationRevision, [
    ...relayEraLayers,
    "fixture-relay-led",
  ]);
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /duplicate semantic layers/);
});

test("requires all five exact boost semantic layers", async () => {
  assert.equal(relayEraLayers.length, 39);
  assert.equal(boostEraLayers.length, 44);

  const missing = await verify(
    boostMigrationRevision,
    boostEraLayers.filter((layer) => layer !== "fixture-boost-adjuster"),
  );
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /missing: fixture-boost-adjuster/);

  const extra = await verify(boostMigrationRevision, [
    ...boostEraLayers,
    "fixture-boost-copper",
  ]);
  assert.equal(extra.status, 1);
  assert.match(extra.stderr, /unexpected: fixture-boost-copper/);

  const misnamed = await verify(
    boostMigrationRevision,
    boostEraLayers.map((layer) =>
      layer === "fixture-boost-silkscreen"
        ? "fixture-boost-silkscren"
        : layer,
    ),
  );
  assert.equal(misnamed.status, 1);
  assert.match(misnamed.stderr, /missing: fixture-boost-silkscreen/);
  assert.match(misnamed.stderr, /unexpected: fixture-boost-silkscren/);

  const duplicate = await verify(boostMigrationRevision, [
    ...boostEraLayers,
    "fixture-boost-metal",
  ]);
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /duplicate semantic layers/);
});

test("requires all seven exact DP100 semantic layers", async () => {
  assert.equal(boostEraLayers.length, 44);
  assert.equal(dp100EraLayers.length, 51);

  const missing = await verify(
    dp100MigrationRevision,
    dp100EraLayers.filter((layer) => layer !== "fixture-dp100-controls"),
  );
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /missing: fixture-dp100-controls/);

  const extra = await verify(dp100MigrationRevision, [
    ...dp100EraLayers,
    "fixture-dp100-copper",
  ]);
  assert.equal(extra.status, 1);
  assert.match(extra.stderr, /unexpected: fixture-dp100-copper/);

  const misnamed = await verify(
    dp100MigrationRevision,
    dp100EraLayers.map((layer) =>
      layer === "fixture-dp100-markings"
        ? "fixture-dp100-marking"
        : layer,
    ),
  );
  assert.equal(misnamed.status, 1);
  assert.match(misnamed.stderr, /missing: fixture-dp100-markings/);
  assert.match(misnamed.stderr, /unexpected: fixture-dp100-marking/);

  const duplicate = await verify(dp100MigrationRevision, [
    ...dp100EraLayers,
    "fixture-dp100-metal",
  ]);
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /duplicate semantic layers/);
});

test("rejects DP100 layers before the DP100-era pin", async () => {
  const result = await verify(boostMigrationRevision, [
    ...boostEraLayers,
    "fixture-dp100-shell",
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unexpected: fixture-dp100-shell/);
});

test("rejects boost layers before the boost-era pin", async () => {
  const result = await verify(relayMigrationRevision, [
    ...relayEraLayers,
    "fixture-boost-pcb",
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unexpected: fixture-boost-pcb/);
});

test("rejects relay layers before the relay-era pin", async () => {
  const result = await verify(c270MigrationRevision, [
    ...c270EraLayers,
    "fixture-relay-pcb",
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unexpected: fixture-relay-pcb/);
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
  const wrongRevision = await verify(c270MigrationRevision, c270EraLayers, {
    expectedRevision: "0000000000000000000000000000000000000000",
  });
  assert.equal(wrongRevision.status, 1);
  assert.match(wrongRevision.stderr, /names the wrong revision/);

  const dirty = await verify(c270MigrationRevision, c270EraLayers, {
    dirty: true,
  });
  assert.equal(dirty.status, 1);
  assert.match(dirty.stderr, /provenance is dirty/);

  const allowedDirty = await verify(c270MigrationRevision, c270EraLayers, {
    dirty: true,
    allowDirty: true,
  });
  assert.equal(allowedDirty.status, 0, allowedDirty.stderr);
});
