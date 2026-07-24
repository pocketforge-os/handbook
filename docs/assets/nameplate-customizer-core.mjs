export const MAX_LABEL_LENGTH = 29;
export const DEFAULT_LABEL = "TrimUI Smart Pro";
export const LABEL_CHARACTERS =
  "letters, numbers, spaces, and . , - _ / + & ( ) or apostrophes";

const labelPattern = /^[A-Za-z0-9][A-Za-z0-9 .,_/+&()'-]*$/;

export function normalizeLabel(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

export function validateLabel(value) {
  const label = normalizeLabel(value);
  const length = Array.from(label).length;

  if (length === 0) {
    return { ok: false, label, length, message: "Enter a device name." };
  }
  if (length > MAX_LABEL_LENGTH) {
    return {
      ok: false,
      label,
      length,
      message: `Use ${MAX_LABEL_LENGTH} characters or fewer.`,
    };
  }
  if (!labelPattern.test(label)) {
    return {
      ok: false,
      label,
      length,
      message: `Use only ${LABEL_CHARACTERS}.`,
    };
  }
  return { ok: true, label, length, message: "" };
}

export function encodeOpenScadString(value) {
  const validation = validateLabel(value);
  if (!validation.ok) {
    throw new TypeError(validation.message);
  }
  return JSON.stringify(validation.label);
}

export function nameplateFilename(value) {
  const validation = validateLabel(value);
  if (!validation.ok) {
    throw new TypeError(validation.message);
  }
  const slug = validation.label
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `pocketforge-nameplate-${slug || "device"}.stl`;
}

export function buildOpenScadArguments(value) {
  return [
    "--enable=manifold",
    "-o",
    "/output.stl",
    "-D",
    'PART="production_batch_06_device_nameplate"',
    "-D",
    `DEVICE_LABEL=${encodeOpenScadString(value)}`,
    "/work/pocketforge-node-chassis.scad",
  ];
}
