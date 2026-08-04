import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verifier = join(root, "scripts", "verify_test_node_guide_profiles.py");
const profilesPath = join(
  root,
  "docs",
  "assets",
  "test-node-guide-profiles.json",
);
const catalogPath = join(
  root,
  "docs",
  "assets",
  "generated",
  "test-node-chassis",
  "browser",
  "catalog.json",
);

function verify(profiles) {
  return spawnSync(
    "python3",
    [verifier, "--profiles", profiles, "--catalog", catalogPath],
    { encoding: "utf8" },
  );
}

test("device-first guide profiles match the pinned source catalog", () => {
  const result = verify(profilesPath);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(
    result.stdout,
    /guide_profiles=pass devices=3 families=2 integration_profiles=2 layouts=3/,
  );
});

test("rejects a device routed to the wrong chassis layout", async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "pf-guide-profiles-"));
  try {
    const profiles = JSON.parse(await readFile(profilesPath, "utf8"));
    profiles.devices["trimui-smart-pro"].layout = "chassis-dualbar-v1";
    const mutatedPath = join(temporaryDirectory, "wrong-layout.json");
    await writeFile(mutatedPath, `${JSON.stringify(profiles, null, 2)}\n`);

    const result = verify(mutatedPath);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /guide_profiles=fail/);
    assert.match(result.stdout, /differs from source catalog/);
  } finally {
    await rm(temporaryDirectory, { recursive: true });
  }
});

test("rejects a holder family that differs from the source catalog", async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "pf-guide-profiles-"));
  try {
    const profiles = JSON.parse(await readFile(profilesPath, "utf8"));
    profiles.families["trimui-smart-pro-family"].holder_profile =
      "wrong-holder-family";
    const mutatedPath = join(temporaryDirectory, "wrong-holder.json");
    await writeFile(mutatedPath, `${JSON.stringify(profiles, null, 2)}\n`);

    const result = verify(mutatedPath);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /guide_profiles=fail/);
    assert.match(result.stdout, /holder profile differs from source catalog/);
  } finally {
    await rm(temporaryDirectory, { recursive: true });
  }
});

test("rejects a device with an unknown component integration profile", async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "pf-guide-profiles-"));
  try {
    const profiles = JSON.parse(await readFile(profilesPath, "utf8"));
    profiles.devices["trimui-smart-pro-s"].integration_profile =
      "unregistered-side-board-profile";
    const mutatedPath = join(temporaryDirectory, "wrong-integration.json");
    await writeFile(mutatedPath, `${JSON.stringify(profiles, null, 2)}\n`);

    const result = verify(mutatedPath);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /guide_profiles=fail/);
    assert.match(result.stdout, /unknown integration profile/);
  } finally {
    await rm(temporaryDirectory, { recursive: true });
  }
});
