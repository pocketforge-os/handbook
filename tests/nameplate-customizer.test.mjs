import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_LABEL_LENGTH,
  buildOpenScadArguments,
  encodeOpenScadString,
  nameplateFilename,
  normalizeLabel,
  validateLabel,
} from "../docs/assets/nameplate-customizer-core.mjs";

test("normalizes surrounding and repeated whitespace", () => {
  assert.equal(normalizeLabel("  Anbernic   RG35XX  "), "Anbernic RG35XX");
});

test("accepts representative device names", () => {
  for (const label of [
    "TrimUI Smart Pro",
    "Anbernic RG35XX",
    "RG35XX-H",
    "Retroid Pocket 4+",
    "Owner's DUT_2",
  ]) {
    assert.deepEqual(validateLabel(label).ok, true, label);
  }
});

test("rejects empty, control, expression, and overlong inputs", () => {
  for (const label of [
    "",
    " \n ",
    'DUT"; cube(10); //',
    "DUT\\name",
    "x".repeat(MAX_LABEL_LENGTH + 1),
  ]) {
    assert.deepEqual(validateLabel(label).ok, false, label);
  }
});

test("encodes a validated label as one OpenSCAD string expression", () => {
  assert.equal(encodeOpenScadString("Anbernic RG35XX"), '"Anbernic RG35XX"');
  assert.throws(() => encodeOpenScadString('DUT"; cube(10); //'), TypeError);
});

test("builds fixed production-module arguments without a shell", () => {
  const args = buildOpenScadArguments("Anbernic RG35XX");
  assert.deepEqual(args, [
    "--enable=manifold",
    "-o",
    "/output.stl",
    "-D",
    'PART="production_batch_06_device_nameplate"',
    "-D",
    'DEVICE_LABEL="Anbernic RG35XX"',
    "/work/pocketforge-node-chassis.scad",
  ]);
});

test("creates a stable filesystem-safe STL filename", () => {
  assert.equal(
    nameplateFilename("Retroid Pocket 4+"),
    "pocketforge-nameplate-retroid-pocket-4-plus.stl",
  );
  assert.equal(
    nameplateFilename("A & B"),
    "pocketforge-nameplate-a-and-b.stl",
  );
});
