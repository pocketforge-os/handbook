import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  deviceOptions,
  humanizeAssemblyStep,
  resolveDeviceGuide,
} from "../docs/assets/test-node-guide-selector-core.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const profiles = JSON.parse(
  await readFile(
    join(root, "docs", "assets", "test-node-guide-profiles.json"),
    "utf8",
  ),
);

test("offers every registered DUT without a second option list", () => {
  assert.deepEqual(deviceOptions(profiles), [
    { slug: "trimui-brick", displayName: "TrimUI Brick / TG3040" },
    { slug: "trimui-smart-pro", displayName: "TrimUI Smart Pro" },
    { slug: "trimui-smart-pro-s", displayName: "TrimUI Smart Pro S" },
  ]);
});

test("resolves the Brick candidate onto the shared dual-bar guide", () => {
  const guide = resolveDeviceGuide(profiles, "trimui-brick");
  assert.equal(guide.holderProfile, "trimui-brick");
  assert.equal(guide.layoutId, "chassis-dualbar-brick-v1");
  assert.equal(guide.qualificationStatus, "candidate");
  assert.equal(guide.assemblySteps.length, 17);
  assert.equal(
    guide.stages.find(({ id }) => id === "print").route,
    "hardware/test-node-chassis/devices/trimui-brick/print/",
  );
  assert.equal(
    guide.stages.find(({ id }) => id === "layout").route,
    "hardware/test-node-chassis/layouts/chassis-dualbar-v1/",
  );
});

test("resolves the qualified stack-clear Smart Pro layout and all 19 steps", () => {
  const guide = resolveDeviceGuide(profiles, "trimui-smart-pro");
  assert.equal(guide.layoutId, "chassis-core-v2");
  assert.equal(guide.qualificationStatus, "physically_qualified");
  assert.equal(guide.assemblySteps.length, 19);
  assert.deepEqual(guide.assemblySteps[0], {
    number: 1,
    title: "Learn the rail",
    slug: "01-learn-the-rail",
    route:
      "hardware/test-node-chassis/layouts/chassis-core-v2/assemble/01-learn-the-rail/",
  });
  assert.equal(guide.assemblySteps.at(-1).slug, "19-final-check");
  assert.deepEqual(
    guide.stages.map(({ id }) => id),
    [
      "build-sheet",
      "layout",
      "parts",
      "print",
      "cut",
      "assemble",
      "verify",
      "wire-management",
      "integration",
    ],
  );
});

test("resolves the Smart Pro S route and all 17 dual-bar steps", () => {
  const guide = resolveDeviceGuide(profiles, "trimui-smart-pro-s");
  assert.equal(guide.layoutId, "chassis-dualbar-v1");
  assert.equal(guide.qualificationStatus, "physically_qualified");
  assert.equal(guide.assemblySteps.length, 17);
  assert.equal(guide.assemblySteps[15].slug, "16-add-stacking-tabs");
  assert.equal(
    guide.stages.find(({ id }) => id === "print").route,
    "hardware/test-node-chassis/devices/trimui-smart-pro-s/print/",
  );
});

test("humanizes only contiguous, safe assembly step slugs", () => {
  assert.deepEqual(humanizeAssemblyStep("09-install-upper-fixture-bar"), {
    number: 9,
    title: "Install upper fixture bar",
  });
  assert.equal(humanizeAssemblyStep("12-mount-dut-holder").title, "Mount DUT holder");
  assert.throws(() => humanizeAssemblyStep("../wrong"), /Invalid assembly step/);

  const changed = structuredClone(profiles);
  changed.layouts["chassis-dualbar-v1"].assembly_steps[1] =
    "04-skip-a-step";
  assert.throws(
    () => resolveDeviceGuide(changed, "trimui-smart-pro-s"),
    /assembly step numbers are not contiguous/,
  );
});

test("rejects unknown devices and unsafe registered routes", () => {
  assert.throws(
    () => resolveDeviceGuide(profiles, "unknown-device"),
    /Unknown guide device/,
  );
  const changed = structuredClone(profiles);
  changed.devices["trimui-smart-pro"].print_route = "../outside/";
  assert.throws(
    () => resolveDeviceGuide(changed, "trimui-smart-pro"),
    /not a safe site route/,
  );
});

test("keeps the persistent MkDocs nav to one chassis selector entry", async () => {
  const configuration = await readFile(join(root, "mkdocs.yml"), "utf8");
  assert.match(
    configuration,
    /- Test-node chassis: hardware\/test-node-chassis\/index\.md/,
  );
  assert.match(configuration, /not_in_nav:[\s\S]*test-node-chassis\/\*\*/);
  for (const removedEntry of [
    "Device build sheets:",
    "Assemble in 19 steps:",
    "Assemble in 17 steps:",
    "1. Learn the rail:",
  ]) {
    assert.equal(configuration.includes(removedEntry), false);
  }
});
