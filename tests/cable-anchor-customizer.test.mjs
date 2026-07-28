import assert from "node:assert/strict";
import test from "node:test";

import {
  CABLE_ANCHOR_BOUNDS_MM,
  CABLE_ANCHOR_FASTENERS,
  CABLE_ANCHOR_NORMALIZED_SHA256,
  buildCableAnchorOpenScadArguments,
  cableAnchorBoundsWithinEnvelope,
  cableAnchorFilename,
  validateCableAnchorFastener,
} from "../docs/assets/cable-anchor-customizer-core.mjs";

test("accepts exactly the source-owned M5 and M3 variants", () => {
  assert.deepEqual(CABLE_ANCHOR_FASTENERS, ["M5", "M3"]);
  assert.deepEqual(CABLE_ANCHOR_NORMALIZED_SHA256, {
    M5: "3b249814d8e78d4467591edf94b51be9f4ef450aad258bb58d3f0b55b54d9678",
    M3: "a0cf2279a77c02356afbbfeb739be939808e370e8437becf92a50c7a09eba193",
  });
  assert.equal(validateCableAnchorFastener("m5"), "M5");
  assert.equal(validateCableAnchorFastener(" M3 "), "M3");
  assert.throws(() => validateCableAnchorFastener("M4"), /M5 or M3/);
});

test("builds fixed cable-anchor arguments without a shell", () => {
  assert.deepEqual(buildCableAnchorOpenScadArguments("M3"), [
    "--backend=Manifold",
    "--check-parameters=true",
    "--check-parameter-ranges=true",
    "-o",
    "/output.stl",
    "-D",
    'PART="cable_tie_anchor"',
    "-D",
    'CABLE_ANCHOR_FASTENER="M3"',
    "/work/pocketforge-node-chassis.scad",
  ]);
});

test("uses a stable variant-specific download name", () => {
  assert.equal(
    cableAnchorFilename("M5"),
    "pocketforge-rail-cable-anchor-m5.stl",
  );
  assert.equal(
    cableAnchorFilename("m3"),
    "pocketforge-rail-cable-anchor-m3.stl",
  );
});

test("accepts only the nominal cable-anchor envelope within 0.001 mm", () => {
  assert.deepEqual(CABLE_ANCHOR_BOUNDS_MM, [
    [-16, 16],
    [-9, 9],
    [0, 8.8],
  ]);
  assert.equal(
    cableAnchorBoundsWithinEnvelope([
      [-15.999999, 15.999999],
      [-9, 9],
      [0, 8.8000002],
    ]),
    true,
  );
  assert.equal(
    cableAnchorBoundsWithinEnvelope([
      [-15.998, 16],
      [-9, 9],
      [0, 8.8],
    ]),
    false,
  );
  assert.equal(cableAnchorBoundsWithinEnvelope(null), false);
});
