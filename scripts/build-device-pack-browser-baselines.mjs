#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { stableJson } from "../docs/assets/device-pack-generator-core.mjs";

const BOUNDS_TOLERANCE_MM = 0.001;
const VOLUME_TOLERANCE_PERCENT = 0.02;

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (
      !["--desktop-root", "--browser-root", "--output"].includes(flag) ||
      !value
    ) {
      fail(
        "usage: build-device-pack-browser-baselines.mjs " +
          "--desktop-root DIR --browser-root DIR --output FILE",
      );
    }
    values.set(flag, path.resolve(value));
  }
  for (const flag of ["--desktop-root", "--browser-root", "--output"]) {
    if (!values.has(flag)) {
      fail(`missing required argument: ${flag}`);
    }
  }
  return {
    desktopRoot: values.get("--desktop-root"),
    browserRoot: values.get("--browser-root"),
    output: values.get("--output"),
  };
}

async function readJson(filename) {
  return JSON.parse(await readFile(filename, "utf8"));
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function rounded(value) {
  return Number(Number(value).toFixed(6));
}

function sourceBounds(artifact) {
  const bounds = artifact.normalized.bounds_mm;
  return bounds.min.map((minimum, axis) => [
    Number(minimum),
    Number(bounds.max[axis]),
  ]);
}

function maximumBoundsDelta(left, right) {
  return Math.max(
    ...left.flatMap((axis, axisIndex) =>
      axis.map((value, side) => Math.abs(value - right[axisIndex][side])),
    ),
  );
}

const args = parseArguments(process.argv.slice(2));
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const catalog = await readJson(
  path.join(
    repoRoot,
    "docs/assets/generated/test-node-chassis/browser/catalog.json",
  ),
);
const runtimeProvenance = await readJson(
  path.join(repoRoot, "docs/assets/vendor/openscad/PROVENANCE.json"),
);
const runtimeJs = await readFile(
  path.join(repoRoot, "docs/assets/vendor/openscad/openscad.js"),
);
const runtimeWasm = await readFile(
  path.join(repoRoot, "docs/assets/vendor/openscad/openscad.wasm"),
);

const records = {};
let observedBoundsDelta = 0;
let observedAbsoluteVolumeDeltaPercent = 0;
for (const device of catalog.devices) {
  const desktop = await readJson(
    path.join(args.desktopRoot, device.slug, "manifest.json"),
  );
  const browser = await readJson(
    path.join(
      args.browserRoot,
      `device-pack-${device.slug}-manifest.json`,
    ),
  );
  if (
    desktop.source.commit !== catalog.source.commit ||
    browser.source.commit !== catalog.source.commit ||
    desktop.device.slug !== device.slug ||
    browser.device.slug !== device.slug ||
    desktop.mode !== "full" ||
    browser.mode !== "full"
  ) {
    fail(`manifest provenance changed for ${device.slug}`);
  }
  const desktopArtifacts = new Map(
    desktop.artifacts.map((artifact) => [artifact.id, artifact]),
  );
  const browserArtifacts = new Map(
    browser.artifacts.map((artifact) => [artifact.id, artifact]),
  );
  for (const planArtifact of device.modes.full.artifacts) {
    const sourceArtifact = desktopArtifacts.get(planArtifact.id);
    const browserArtifact = browserArtifacts.get(planArtifact.id);
    if (
      !sourceArtifact ||
      !browserArtifact ||
      sourceArtifact.path !== planArtifact.output ||
      browserArtifact.path !== planArtifact.output
    ) {
      fail(`artifact coverage changed: ${device.slug}/${planArtifact.id}`);
    }
    const sourceMetricBounds = sourceBounds(sourceArtifact);
    const browserMetricBounds = browserArtifact.bounds_mm;
    const boundsDelta = maximumBoundsDelta(
      sourceMetricBounds,
      browserMetricBounds,
    );
    const sourceVolume = Number(sourceArtifact.normalized.volume_mm3);
    const browserVolume = Number(browserArtifact.volume_mm3);
    const volumeDeltaPercent =
      ((browserVolume - sourceVolume) / sourceVolume) * 100;
    if (
      boundsDelta > BOUNDS_TOLERANCE_MM ||
      Math.abs(volumeDeltaPercent) > VOLUME_TOLERANCE_PERCENT
    ) {
      fail(
        `cross-toolchain geometry changed for ${device.slug}/${planArtifact.id}: ` +
          `bounds_delta_mm=${boundsDelta} ` +
          `volume_delta_percent=${volumeDeltaPercent}`,
      );
    }
    observedBoundsDelta = Math.max(observedBoundsDelta, boundsDelta);
    observedAbsoluteVolumeDeltaPercent = Math.max(
      observedAbsoluteVolumeDeltaPercent,
      Math.abs(volumeDeltaPercent),
    );
    records[`${device.slug}/${planArtifact.id}`] = {
      output: planArtifact.output,
      source_normalized_sha256:
        sourceArtifact.normalized.fingerprint.sha256,
      browser_normalized_sha256: browserArtifact.normalized_sha256,
    };
  }
}

const output = {
  schema: "pocketforge-browser-device-pack-baselines-v1",
  source: catalog.source,
  generation_contract: {
    backend: "Manifold",
    canonicalizer: "pocketforge-browser-canonical-stl-v1",
    fingerprint: catalog.fingerprint_contract,
  },
  runtime: {
    version: runtimeProvenance.openscad.version,
    source_revision: runtimeProvenance.openscad.source_revision,
    javascript_sha256: sha256(runtimeJs),
    wasm_sha256: sha256(runtimeWasm),
  },
  equivalence_gate: {
    maximum_bounds_delta_mm: BOUNDS_TOLERANCE_MM,
    maximum_absolute_volume_delta_percent: VOLUME_TOLERANCE_PERCENT,
    observed_maximum_bounds_delta_mm: rounded(observedBoundsDelta),
    observed_maximum_absolute_volume_delta_percent: rounded(
      observedAbsoluteVolumeDeltaPercent,
    ),
    source_toolchain: "OpenSCAD 2021.01 with Manifold",
  },
  artifacts: records,
};
await writeFile(args.output, stableJson(output));
console.log(
  `browser_baselines=pass artifacts=${Object.keys(records).length} ` +
    `source=${catalog.source.commit} output=${args.output}`,
);
