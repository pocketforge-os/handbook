export const CABLE_ANCHOR_FASTENERS = Object.freeze(["M5", "M3"]);
export const CABLE_ANCHOR_BOUNDS_MM = Object.freeze([
  Object.freeze([-16, 16]),
  Object.freeze([-9, 9]),
  Object.freeze([0, 8.8]),
]);
export const CABLE_ANCHOR_NORMALIZED_SHA256 = Object.freeze({
  M5: "3b249814d8e78d4467591edf94b51be9f4ef450aad258bb58d3f0b55b54d9678",
  M3: "a0cf2279a77c02356afbbfeb739be939808e370e8437becf92a50c7a09eba193",
});

export function validateCableAnchorFastener(value) {
  const fastener = String(value ?? "").trim().toUpperCase();
  if (!CABLE_ANCHOR_FASTENERS.includes(fastener)) {
    throw new TypeError("Choose either the M5 or M3 cable-anchor hole.");
  }
  return fastener;
}

export function cableAnchorFilename(value) {
  const fastener = validateCableAnchorFastener(value).toLowerCase();
  return `pocketforge-rail-cable-anchor-${fastener}.stl`;
}

export function cableAnchorBoundsWithinEnvelope(
  bounds,
  toleranceMm = 0.001,
) {
  return (
    Array.isArray(bounds) &&
    bounds.length === CABLE_ANCHOR_BOUNDS_MM.length &&
    Number.isFinite(toleranceMm) &&
    toleranceMm >= 0 &&
    bounds.every(
      (axis, axisIndex) =>
        Array.isArray(axis) &&
        axis.length === 2 &&
        axis.every(
          (value, side) =>
            Number.isFinite(value) &&
            Math.abs(value - CABLE_ANCHOR_BOUNDS_MM[axisIndex][side]) <=
              toleranceMm,
        ),
    )
  );
}

export function buildCableAnchorOpenScadArguments(value) {
  const fastener = validateCableAnchorFastener(value);
  return [
    "--backend=Manifold",
    "--check-parameters=true",
    "--check-parameter-ranges=true",
    "-o",
    "/output.stl",
    "-D",
    'PART="cable_tie_anchor"',
    "-D",
    `CABLE_ANCHOR_FASTENER="${fastener}"`,
    "/work/pocketforge-node-chassis.scad",
  ];
}
