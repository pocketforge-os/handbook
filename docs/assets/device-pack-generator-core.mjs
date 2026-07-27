export const CATALOG_SCHEMA =
  "pocketforge-browser-device-pack-catalog-v1";
export const BROWSER_BASELINE_SCHEMA =
  "pocketforge-browser-device-pack-baselines-v1";
export const BROWSER_MANIFEST_SCHEMA =
  "pocketforge-browser-generated-device-pack-v1";
export const PACK_MODES = ["coupon", "retrofit", "full"];

const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const DEVICE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFINITION_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
const encoder = new TextEncoder();

function assert(condition, message) {
  if (!condition) {
    throw new TypeError(message);
  }
}

export function safeRelativePath(value, label = "path") {
  assert(typeof value === "string" && value.length > 0, `${label} is empty.`);
  assert(!value.includes("\\"), `${label} must use forward slashes.`);
  assert(!value.startsWith("/"), `${label} must be relative.`);
  const parts = value.split("/");
  assert(
    parts.every((part) => part && part !== "." && part !== ".."),
    `${label} contains an unsafe segment.`,
  );
  return value;
}

function validateQualification(value, label) {
  assert(value && typeof value === "object", `${label} is missing.`);
  assert(
    ["candidate", "physically_qualified"].includes(value.status),
    `${label}.status is invalid.`,
  );
  assert(
    typeof value.acceptance_ref === "string" && value.acceptance_ref,
    `${label}.acceptance_ref is missing.`,
  );
}

function validateArtifact(artifact, sourcePaths, label) {
  assert(artifact && typeof artifact === "object", `${label} is invalid.`);
  assert(
    typeof artifact.id === "string" && /^[a-z][a-z0-9_]*$/.test(artifact.id),
    `${label}.id is invalid.`,
  );
  safeRelativePath(artifact.output, `${label}.output`);
  assert(artifact.output.endsWith(".stl"), `${label}.output is not an STL.`);
  safeRelativePath(artifact.source, `${label}.source`);
  assert(sourcePaths.has(artifact.source), `${label}.source is not bundled.`);
  assert(
    typeof artifact.role === "string" && artifact.role,
    `${label}.role is missing.`,
  );
  assert(
    ["calibration", "common", "device"].includes(artifact.scope),
    `${label}.scope is invalid.`,
  );
  assert(
    Array.isArray(artifact.definitions) && artifact.definitions.length > 0,
    `${label}.definitions is empty.`,
  );
  const names = artifact.definitions.map((definition, index) => {
    assert(
      definition && typeof definition === "object",
      `${label}.definitions[${index}] is invalid.`,
    );
    assert(
      typeof definition.name === "string" &&
        DEFINITION_PATTERN.test(definition.name),
      `${label}.definitions[${index}].name is invalid.`,
    );
    assert(
      typeof definition.literal === "string" &&
        !/[\r\n\0]/.test(definition.literal),
      `${label}.definitions[${index}].literal is invalid.`,
    );
    return definition.name;
  });
  assert(
    names.join("\0") === [...names].sort().join("\0"),
    `${label}.definitions is not sorted.`,
  );
  assert(new Set(names).size === names.length, `${label} repeats a definition.`);
  assert(names.includes("PART"), `${label} does not select a PART.`);
  assert(
    artifact.print &&
      typeof artifact.print === "object" &&
      typeof artifact.print.material === "string" &&
      artifact.print.scale_percent === 100 &&
      artifact.print.supports === false &&
      artifact.print.auto_orient === false &&
      Array.isArray(artifact.print.notes),
    `${label}.print is invalid.`,
  );
  assert(
    artifact.expected_normalized_sha256 === null ||
      (typeof artifact.expected_normalized_sha256 === "string" &&
        SHA256_PATTERN.test(artifact.expected_normalized_sha256)),
    `${label}.expected_normalized_sha256 is invalid.`,
  );
}

export function validateCatalog(catalog) {
  assert(catalog && typeof catalog === "object", "Catalog is not an object.");
  assert(catalog.schema === CATALOG_SCHEMA, "Catalog schema is unsupported.");
  assert(
    catalog.bundle_schema === "pocketforge-browser-device-pack-bundle-v1",
    "Bundle schema is unsupported.",
  );
  assert(
    catalog.source &&
      catalog.source.repository ===
        "https://github.com/pocketforge-os/test-node-hw" &&
      /^[0-9a-f]{40}$/.test(catalog.source.commit) &&
      catalog.source.dirty === false,
    "Catalog is not pinned to a clean PocketForge source revision.",
  );
  assert(
    JSON.stringify(catalog.modes) === JSON.stringify(PACK_MODES),
    "Catalog pack modes changed.",
  );
  assert(
    Array.isArray(catalog.sources) && catalog.sources.length > 0,
    "Catalog has no OpenSCAD source closure.",
  );

  const sourcePaths = new Set();
  const bundlePaths = new Set();
  for (const [index, source] of catalog.sources.entries()) {
    const label = `sources[${index}]`;
    assert(source && typeof source === "object", `${label} is invalid.`);
    safeRelativePath(source.path, `${label}.path`);
    safeRelativePath(source.bundle_path, `${label}.bundle_path`);
    assert(
      source.bundle_path === `sources/${source.path}`,
      `${label}.bundle_path is inconsistent.`,
    );
    assert(source.path.endsWith(".scad"), `${label} is not OpenSCAD source.`);
    assert(
      typeof source.sha256 === "string" && SHA256_PATTERN.test(source.sha256),
      `${label}.sha256 is invalid.`,
    );
    assert(
      Number.isSafeInteger(source.size_bytes) && source.size_bytes > 0,
      `${label}.size_bytes is invalid.`,
    );
    assert(!sourcePaths.has(source.path), `${label}.path is duplicated.`);
    assert(!bundlePaths.has(source.bundle_path), `${label}.bundle_path is duplicated.`);
    sourcePaths.add(source.path);
    bundlePaths.add(source.bundle_path);
  }

  assert(
    Array.isArray(catalog.devices) && catalog.devices.length > 0,
    "Catalog has no devices.",
  );
  const deviceSlugs = new Set();
  for (const [deviceIndex, device] of catalog.devices.entries()) {
    const label = `devices[${deviceIndex}]`;
    assert(
      device &&
        typeof device === "object" &&
        typeof device.slug === "string" &&
        DEVICE_PATTERN.test(device.slug),
      `${label}.slug is invalid.`,
    );
    assert(!deviceSlugs.has(device.slug), `${label}.slug is duplicated.`);
    deviceSlugs.add(device.slug);
    assert(
      typeof device.display_name === "string" && device.display_name,
      `${label}.display_name is missing.`,
    );
    assert(
      device.profile &&
        typeof device.profile.id === "string" &&
        device.profile.id,
      `${label}.profile is invalid.`,
    );
    validateQualification(
      device.profile.qualification,
      `${label}.profile.qualification`,
    );
    assert(
      device.layout && typeof device.layout.id === "string" && device.layout.id,
      `${label}.layout is invalid.`,
    );
    validateQualification(
      device.layout.qualification,
      `${label}.layout.qualification`,
    );
    assert(
      device.modes &&
        typeof device.modes === "object" &&
        PACK_MODES.every((mode) => Object.hasOwn(device.modes, mode)) &&
        Object.keys(device.modes).length === PACK_MODES.length,
      `${label}.modes is invalid.`,
    );
    for (const mode of PACK_MODES) {
      const modeRecord = device.modes[mode];
      const modeLabel = `${label}.modes.${mode}`;
      assert(
        modeRecord && typeof modeRecord === "object",
        `${modeLabel} is invalid.`,
      );
      assert(
        typeof modeRecord.production_eligible === "boolean" &&
          Array.isArray(modeRecord.nonproduction_reasons) &&
          Array.isArray(modeRecord.required_overrides) &&
          Array.isArray(modeRecord.artifacts),
        `${modeLabel} policy is invalid.`,
      );
      const expectedCount = { coupon: 1, retrofit: 6, full: 12 }[mode];
      assert(
        modeRecord.artifacts.length === expectedCount,
        `${modeLabel} must contain ${expectedCount} artifacts.`,
      );
      const ids = new Set();
      const outputs = new Set();
      modeRecord.artifacts.forEach((artifact, artifactIndex) => {
        const artifactLabel = `${modeLabel}.artifacts[${artifactIndex}]`;
        validateArtifact(artifact, sourcePaths, artifactLabel);
        assert(!ids.has(artifact.id), `${artifactLabel}.id is duplicated.`);
        assert(!outputs.has(artifact.output), `${artifactLabel}.output is duplicated.`);
        ids.add(artifact.id);
        outputs.add(artifact.output);
      });
    }
  }
  return catalog;
}

export function parseSha256Sums(text) {
  const records = new Map();
  for (const [index, rawLine] of String(text).split(/\r?\n/).entries()) {
    if (!rawLine) {
      continue;
    }
    const match = /^([0-9a-f]{64})  (.+)$/.exec(rawLine);
    assert(match, `SHA256SUMS line ${index + 1} is invalid.`);
    const path = safeRelativePath(match[2], `SHA256SUMS line ${index + 1}`);
    assert(!records.has(path), `SHA256SUMS repeats ${path}.`);
    records.set(path, match[1]);
  }
  assert(records.size > 0, "SHA256SUMS is empty.");
  return records;
}

export async function sha256Hex(value) {
  const bytes =
    value instanceof Uint8Array
      ? value
      : value instanceof ArrayBuffer
        ? new Uint8Array(value)
        : encoder.encode(String(value));
  const digest = await crypto.subtle.digest(
    "SHA-256",
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchRequired(url, fetchImpl) {
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Could not load ${new URL(url).pathname} (${response.status}).`);
  }
  return response;
}

export async function loadVerifiedCatalog(
  catalogUrl,
  checksumsUrl,
  fetchImpl = fetch,
) {
  const [catalogResponse, checksumsResponse] = await Promise.all([
    fetchRequired(catalogUrl, fetchImpl),
    fetchRequired(checksumsUrl, fetchImpl),
  ]);
  const [catalogBytes, checksumsText] = await Promise.all([
    catalogResponse.arrayBuffer(),
    checksumsResponse.text(),
  ]);
  const sums = parseSha256Sums(checksumsText);
  const expected = sums.get("catalog.json");
  assert(expected, "SHA256SUMS does not cover catalog.json.");
  const actual = await sha256Hex(catalogBytes);
  assert(actual === expected, "Browser device-pack catalog hash changed.");
  let catalog;
  try {
    catalog = JSON.parse(new TextDecoder().decode(catalogBytes));
  } catch (error) {
    throw new TypeError(`Browser device-pack catalog is invalid JSON: ${error}`);
  }
  return validateCatalog(catalog);
}

export function selectDeviceMode(catalog, deviceSlug, mode) {
  validateCatalog(catalog);
  assert(PACK_MODES.includes(mode), `Unsupported pack mode: ${mode}`);
  const device = catalog.devices.find((candidate) => candidate.slug === deviceSlug);
  assert(device, `Unknown registered device: ${deviceSlug}`);
  return { device, mode: device.modes[mode] };
}

export function validateBrowserBaselines(baselines, catalog) {
  validateCatalog(catalog);
  assert(
    baselines && typeof baselines === "object",
    "Browser baseline lock is not an object.",
  );
  assert(
    baselines.schema === BROWSER_BASELINE_SCHEMA,
    "Browser baseline schema is unsupported.",
  );
  assert(
    baselines.source?.repository === catalog.source.repository &&
      baselines.source?.commit === catalog.source.commit &&
      baselines.source?.dirty === catalog.source.dirty,
    "Browser baselines do not match the pinned source revision.",
  );
  assert(
    baselines.generation_contract?.backend === "Manifold" &&
      baselines.generation_contract?.canonicalizer ===
        "pocketforge-browser-canonical-stl-v1" &&
      JSON.stringify(baselines.generation_contract?.fingerprint) ===
        JSON.stringify(catalog.fingerprint_contract),
    "Browser baseline generation contract changed.",
  );
  assert(
    /^[0-9a-f]{64}$/.test(baselines.runtime?.javascript_sha256 ?? "") &&
      /^[0-9a-f]{64}$/.test(baselines.runtime?.wasm_sha256 ?? "") &&
      /^[0-9a-f]{40}$/.test(baselines.runtime?.source_revision ?? "") &&
      typeof baselines.runtime?.version === "string",
    "Browser baseline runtime provenance is invalid.",
  );
  assert(
    baselines.equivalence_gate?.maximum_bounds_delta_mm === 0.001 &&
      baselines.equivalence_gate
        ?.maximum_absolute_volume_delta_percent === 0.02 &&
      baselines.equivalence_gate?.observed_maximum_bounds_delta_mm <=
        0.001 &&
      baselines.equivalence_gate
        ?.observed_maximum_absolute_volume_delta_percent <= 0.02,
    "Browser/source equivalence gate changed.",
  );
  const expectedKeys = new Set();
  for (const device of catalog.devices) {
    for (const artifact of device.modes.full.artifacts) {
      const key = `${device.slug}/${artifact.id}`;
      expectedKeys.add(key);
      const baseline = baselines.artifacts?.[key];
      assert(baseline && typeof baseline === "object", `Missing ${key} baseline.`);
      assert(
        baseline.output === artifact.output &&
          SHA256_PATTERN.test(baseline.browser_normalized_sha256) &&
          SHA256_PATTERN.test(baseline.source_normalized_sha256) &&
          (
            artifact.expected_normalized_sha256 === null ||
            artifact.expected_normalized_sha256 ===
              baseline.source_normalized_sha256
          ),
        `Browser baseline changed for ${key}.`,
      );
    }
  }
  assert(
    baselines.artifacts &&
      Object.keys(baselines.artifacts).length === expectedKeys.size &&
      Object.keys(baselines.artifacts).every((key) => expectedKeys.has(key)),
    "Browser baseline coverage differs from the registered device catalog.",
  );
  return baselines;
}

export async function loadBrowserBaselines(
  baselineUrl,
  catalog,
  fetchImpl = fetch,
) {
  const response = await fetchRequired(baselineUrl, fetchImpl);
  let baselines;
  try {
    baselines = await response.json();
  } catch (error) {
    throw new TypeError(`Browser baseline lock is invalid JSON: ${error}`);
  }
  return validateBrowserBaselines(baselines, catalog);
}

export function buildOpenScadArguments(artifact, output = "/output.stl") {
  safeRelativePath(artifact.source, "artifact.source");
  assert(
    typeof output === "string" && output.startsWith("/") && !/[\r\n\0]/.test(output),
    "OpenSCAD output path is invalid.",
  );
  const args = [
    "--backend=Manifold",
    "--check-parameters=true",
    "--check-parameter-ranges=true",
    "-o",
    output,
  ];
  for (const definition of artifact.definitions) {
    assert(
      DEFINITION_PATTERN.test(definition.name) &&
        typeof definition.literal === "string" &&
        !/[\r\n\0]/.test(definition.literal),
      "OpenSCAD definition is invalid.",
    );
    args.push("-D", `${definition.name}=${definition.literal}`);
  }
  args.push(`/work/${artifact.source}`);
  return args;
}

function parseStl(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const binaryCount = data.byteLength >= 84 ? view.getUint32(80, true) : 0;
  const triangles = [];
  if (84 + binaryCount * 50 === data.byteLength && binaryCount > 0) {
    for (let triangleIndex = 0; triangleIndex < binaryCount; triangleIndex += 1) {
      const triangle = [];
      const base = 84 + triangleIndex * 50 + 12;
      for (let vertex = 0; vertex < 3; vertex += 1) {
        const offset = base + vertex * 12;
        triangle.push([
          view.getFloat32(offset, true),
          view.getFloat32(offset + 4, true),
          view.getFloat32(offset + 8, true),
        ]);
      }
      triangles.push(triangle);
    }
    return triangles;
  }

  let text;
  try {
    text = new TextDecoder("ascii", { fatal: true }).decode(data);
  } catch (error) {
    throw new TypeError(`STL is neither binary nor ASCII: ${error}`);
  }
  const vertices = [...text.matchAll(
    /^\s*vertex\s+(\S+)\s+(\S+)\s+(\S+)\s*$/gm,
  )].map((match) => match.slice(1).map(Number));
  assert(vertices.length > 0 && vertices.length % 3 === 0, "ASCII STL is incomplete.");
  assert(
    vertices.every((point) => point.every(Number.isFinite)),
    "ASCII STL has a non-finite coordinate.",
  );
  for (let index = 0; index < vertices.length; index += 3) {
    triangles.push(vertices.slice(index, index + 3));
  }
  return triangles;
}

function roundHalfEven(value) {
  const floor = Math.floor(value);
  const fraction = value - floor;
  if (Math.abs(fraction - 0.5) < 1e-10) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  return Math.round(value);
}

function comparePoint(left, right) {
  for (let axis = 0; axis < 3; axis += 1) {
    if (left[axis] !== right[axis]) {
      return left[axis] - right[axis];
    }
  }
  return 0;
}

function compareTriangle(left, right) {
  for (let vertex = 0; vertex < 3; vertex += 1) {
    const comparison = comparePoint(left[vertex], right[vertex]);
    if (comparison) {
      return comparison;
    }
  }
  return 0;
}

function quantizePoint(point, places) {
  const multiplier = 10 ** places;
  return point.map((coordinate) => roundHalfEven(coordinate * multiplier));
}

export function canonicalizeGeneratedStl(value) {
  const triangles = parseStl(value);
  const canonical = [];
  let removedDegenerateFacets = 0;
  for (const triangle of triangles) {
    const topologyTriangle = triangle.map((point) => quantizePoint(point, 6));
    if (
      new Set(topologyTriangle.map((point) => point.join(","))).size !== 3
    ) {
      removedDegenerateFacets += 1;
      continue;
    }
    const rotations = [
      triangle,
      [triangle[1], triangle[2], triangle[0]],
      [triangle[2], triangle[0], triangle[1]],
    ];
    rotations.sort(compareTriangle);
    canonical.push(rotations[0]);
  }
  assert(canonical.length > 0, "OpenSCAD returned no non-degenerate facets.");
  canonical.sort(compareTriangle);

  const bytes = new Uint8Array(84 + canonical.length * 50);
  bytes.set(encoder.encode("PocketForge browser canonical STL").slice(0, 80));
  const view = new DataView(bytes.buffer);
  view.setUint32(80, canonical.length, true);
  canonical.forEach((triangle, triangleIndex) => {
    let offset = 84 + triangleIndex * 50 + 12;
    for (const point of triangle) {
      for (const coordinate of point) {
        assert(Number.isFinite(coordinate), "STL has a non-finite coordinate.");
        view.setFloat32(offset, coordinate, true);
        offset += 4;
      }
    }
  });
  return { bytes, removed_degenerate_facets: removedDegenerateFacets };
}

async function normalizedFingerprint(triangles) {
  const canonical = triangles
    .map((triangle) => [...triangle].sort(comparePoint))
    .sort(compareTriangle);
  const magic = encoder.encode(
    "PocketForge normalized STL\0" +
      "version=1\0" +
      "coordinate-quantum-mm=0.0001\0",
  );
  const bytes = new Uint8Array(magic.byteLength + 8 + canonical.length * 72);
  bytes.set(magic);
  const view = new DataView(bytes.buffer);
  let offset = magic.byteLength;
  view.setBigUint64(offset, BigInt(canonical.length), false);
  offset += 8;
  for (const triangle of canonical) {
    for (const point of triangle) {
      for (const coordinate of point) {
        view.setBigInt64(offset, BigInt(coordinate), false);
        offset += 8;
      }
    }
  }
  return sha256Hex(bytes);
}

export async function inspectStl(value) {
  const triangles = parseStl(value);
  assert(triangles.length > 0, "OpenSCAD returned an empty STL.");
  const bounds = [
    [Infinity, -Infinity],
    [Infinity, -Infinity],
    [Infinity, -Infinity],
  ];
  const quantized = [];
  const edges = new Map();
  const vertexOwner = new Map();
  const parents = triangles.map((_, index) => index);
  const find = (item) => {
    let cursor = item;
    while (parents[cursor] !== cursor) {
      parents[cursor] = parents[parents[cursor]];
      cursor = parents[cursor];
    }
    return cursor;
  };
  const union = (left, right) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) {
      parents[rightRoot] = leftRoot;
    }
  };
  let degenerateFacets = 0;
  let surfaceArea = 0;
  let signedVolume = 0;
  const pointKey = (point) => point.join(",");
  for (const [triangleIndex, triangle] of triangles.entries()) {
    const normalized = triangle.map((point) =>
      point.map((coordinate, axis) => {
        bounds[axis][0] = Math.min(bounds[axis][0], coordinate);
        bounds[axis][1] = Math.max(bounds[axis][1], coordinate);
        return roundHalfEven(coordinate * 10000);
      }),
    );
    quantized.push(normalized);
    const topologyTriangle = triangle.map((point) => quantizePoint(point, 6));
    if (new Set(topologyTriangle.map(pointKey)).size !== 3) {
      degenerateFacets += 1;
    }
    for (const point of topologyTriangle) {
      const key = pointKey(point);
      if (vertexOwner.has(key)) {
        union(triangleIndex, vertexOwner.get(key));
      } else {
        vertexOwner.set(key, triangleIndex);
      }
    }
    for (const [leftIndex, rightIndex] of [[0, 1], [1, 2], [2, 0]]) {
      const edge = [
        pointKey(topologyTriangle[leftIndex]),
        pointKey(topologyTriangle[rightIndex]),
      ].sort().join("|");
      edges.set(edge, (edges.get(edge) ?? 0) + 1);
    }
    const [left, middle, right] = triangle;
    const edgeA = middle.map((coordinate, axis) => coordinate - left[axis]);
    const edgeB = right.map((coordinate, axis) => coordinate - left[axis]);
    const cross = [
      edgeA[1] * edgeB[2] - edgeA[2] * edgeB[1],
      edgeA[2] * edgeB[0] - edgeA[0] * edgeB[2],
      edgeA[0] * edgeB[1] - edgeA[1] * edgeB[0],
    ];
    surfaceArea += 0.5 * Math.hypot(...cross);
    signedVolume +=
      (left[0] * (middle[1] * right[2] - middle[2] * right[1]) -
        left[1] * (middle[0] * right[2] - middle[2] * right[0]) +
        left[2] * (middle[0] * right[1] - middle[1] * right[0])) / 6;
  }
  const invalidEdges = [...edges.values()].filter((count) => count !== 2).length;
  assert(degenerateFacets === 0, `STL has ${degenerateFacets} degenerate facets.`);
  assert(invalidEdges === 0, `STL is not closed edge-manifold (${invalidEdges} edges).`);
  return {
    triangle_count: triangles.length,
    edge_count: edges.size,
    component_count: new Set(parents.map((_, index) => find(index))).size,
    bounds_mm: bounds,
    surface_area_mm2: surfaceArea,
    volume_mm3: Math.abs(signedVolume),
    normalized_sha256: await normalizedFingerprint(quantized),
  };
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function concatBytes(parts) {
  const output = new Uint8Array(
    parts.reduce((total, part) => total + part.byteLength, 0),
  );
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.byteLength;
  }
  return output;
}

export function createStoredZip(entries) {
  assert(Array.isArray(entries) && entries.length > 0, "ZIP has no entries.");
  const names = new Set();
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  for (const entry of entries) {
    const name = safeRelativePath(entry.name, "ZIP entry");
    assert(!names.has(name), `ZIP repeats ${name}.`);
    names.add(name);
    const nameBytes = encoder.encode(name);
    const data = entry.bytes instanceof Uint8Array
      ? entry.bytes
      : new Uint8Array(entry.bytes);
    assert(data.byteLength <= 0xffffffff, `ZIP entry ${name} is too large.`);
    const checksum = crc32(data);
    const local = new Uint8Array(30);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, 0, true);
    localView.setUint16(12, 33, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, data.byteLength, true);
    localView.setUint32(22, data.byteLength, true);
    localView.setUint16(26, nameBytes.byteLength, true);
    localView.setUint16(28, 0, true);
    localParts.push(local, nameBytes, data);

    const central = new Uint8Array(46);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, 0, true);
    centralView.setUint16(14, 33, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, data.byteLength, true);
    centralView.setUint32(24, data.byteLength, true);
    centralView.setUint16(28, nameBytes.byteLength, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, localOffset, true);
    centralParts.push(central, nameBytes);
    localOffset += local.byteLength + nameBytes.byteLength + data.byteLength;
  }
  assert(entries.length <= 0xffff, "ZIP has too many entries.");
  const centralBytes = concatBytes(centralParts);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralBytes.byteLength, true);
  endView.setUint32(16, localOffset, true);
  return concatBytes([...localParts, centralBytes, end]);
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

export function stableJson(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

export async function createPackArchive(
  catalog,
  deviceSlug,
  modeName,
  generated,
) {
  const { device, mode } = selectDeviceMode(catalog, deviceSlug, modeName);
  assert(generated instanceof Map, "Generated artifacts must be a Map.");
  assert(
    mode.artifacts.every((artifact) => generated.has(artifact.id)) &&
      generated.size === mode.artifacts.length,
    "Generated artifact set does not match the catalog.",
  );
  const firstMetrics = generated.get(mode.artifacts[0].id).metrics;
  assert(
    typeof firstMetrics.browser_runtime_version === "string" &&
      firstMetrics.browser_runtime_version &&
      SHA256_PATTERN.test(firstMetrics.browser_baseline_sha256) &&
      mode.artifacts.every((artifact) => {
        const metrics = generated.get(artifact.id).metrics;
        return (
          metrics.browser_runtime_version ===
            firstMetrics.browser_runtime_version &&
          metrics.browser_baseline_sha256 ===
            firstMetrics.browser_baseline_sha256
        );
      }),
    "Generated artifacts do not share one pinned browser runtime.",
  );
  const root = `device-pack-${device.slug}-${modeName}`;
  const manifestArtifacts = [];
  const zipEntries = [];
  for (const artifact of mode.artifacts) {
    const result = generated.get(artifact.id);
    const bytes = result.bytes instanceof Uint8Array
      ? result.bytes
      : new Uint8Array(result.bytes);
    const digest = await sha256Hex(bytes);
    const path = `${root}/${artifact.output}`;
    zipEntries.push({ name: path, bytes });
    manifestArtifacts.push({
      id: artifact.id,
      path: artifact.output,
      role: artifact.role,
      scope: artifact.scope,
      print: artifact.print,
      bytes: bytes.byteLength,
      raw_sha256: digest,
      normalized_sha256: result.metrics.normalized_sha256,
      browser_baseline_normalized_sha256:
        result.metrics.browser_baseline_normalized_sha256,
      source_normalized_sha256:
        result.metrics.source_normalized_sha256,
      expected_normalized_sha256: artifact.expected_normalized_sha256,
      triangle_count: result.metrics.triangle_count,
      component_count: result.metrics.component_count,
      bounds_mm: result.metrics.bounds_mm,
      surface_area_mm2: result.metrics.surface_area_mm2,
      volume_mm3: result.metrics.volume_mm3,
      removed_degenerate_facets:
        result.metrics.removed_degenerate_facets ?? 0,
    });
  }
  const manifest = {
    schema: BROWSER_MANIFEST_SCHEMA,
    source: catalog.source,
    catalog_schema: catalog.schema,
    fingerprint_contract: catalog.fingerprint_contract,
    device: { slug: device.slug, display_name: device.display_name },
    profile: device.profile,
    layout: device.layout,
    mode: modeName,
    production_eligible: mode.production_eligible,
    nonproduction_reasons: mode.nonproduction_reasons,
    generator: {
      environment: "browser",
      engine: "OpenSCAD WebAssembly",
      engine_version: firstMetrics.browser_runtime_version,
      backend: "Manifold",
      canonicalizer: "pocketforge-browser-canonical-stl-v1",
      browser_baseline_sha256: firstMetrics.browser_baseline_sha256,
      generated_locally: true,
    },
    artifacts: manifestArtifacts,
  };
  const manifestBytes = encoder.encode(stableJson(manifest));
  zipEntries.push({ name: `${root}/manifest.json`, bytes: manifestBytes });
  const checksums = [];
  for (const entry of [...zipEntries].sort((left, right) =>
    left.name.localeCompare(right.name))) {
    checksums.push(`${await sha256Hex(entry.bytes)}  ${entry.name.slice(root.length + 1)}`);
  }
  zipEntries.push({
    name: `${root}/SHA256SUMS`,
    bytes: encoder.encode(`${checksums.join("\n")}\n`),
  });
  return {
    bytes: createStoredZip(zipEntries),
    filename: `${root}.zip`,
    manifest,
  };
}
