/*
 * PocketForge's browser cable-anchor worker is distributed under
 * GPL-2.0-or-later. It is source code for the GPL OpenSCAD WebAssembly
 * module it imports.
 */

import {
  CABLE_ANCHOR_NORMALIZED_SHA256,
  buildCableAnchorOpenScadArguments,
  cableAnchorBoundsWithinEnvelope,
  validateCableAnchorFastener,
} from "./cable-anchor-customizer-core.mjs";
import {
  canonicalizeGeneratedStl,
  inspectStl,
  sha256Hex,
} from "./device-pack-generator-core.mjs";

const runtimeUrl = new URL("./vendor/openscad/openscad.js", import.meta.url);
const sourceRoot = new URL(
  "./generated/test-node-chassis/customizer/",
  import.meta.url,
);
const sourceUrl = new URL("pocketforge-node-chassis.scad", sourceRoot);
const libraryUrl = new URL("lib/pf-2020.scad", sourceRoot);
const usbCInterrupterLibraryUrl = new URL(
  "lib/usb-c-interrupter-bracket.scad",
  sourceRoot,
);
const provenanceUrl = new URL("customizer-provenance.json", sourceRoot);

function reportStatus(message) {
  self.postMessage({ type: "status", message });
}

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url.pathname} (${response.status}).`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url.pathname} (${response.status}).`);
  }
  return response.json();
}

function makeDirectory(fs, path) {
  if (!fs.analyzePath(path).exists) {
    fs.mkdir(path);
  }
}

async function verifiedSource() {
  const [provenance, source, library, usbCInterrupterLibrary] =
    await Promise.all([
      fetchJson(provenanceUrl),
      fetchBytes(sourceUrl),
      fetchBytes(libraryUrl),
      fetchBytes(usbCInterrupterLibraryUrl),
    ]);
  if (
    provenance?.schema !== 1 ||
    provenance.source_dirty !== false ||
    provenance.cable_anchor?.part !== "cable_tie_anchor" ||
    JSON.stringify(provenance.cable_anchor?.fasteners) !==
      JSON.stringify(["M5", "M3"])
  ) {
    throw new Error("Cable-anchor source provenance changed.");
  }
  for (const [path, bytes] of [
    ["pocketforge-node-chassis.scad", source],
    ["lib/pf-2020.scad", library],
    ["lib/usb-c-interrupter-bracket.scad", usbCInterrupterLibrary],
  ]) {
    if ((await sha256Hex(bytes)) !== provenance.files?.[path]) {
      throw new Error(`Cable-anchor source hash changed: ${path}`);
    }
  }
  return { source, library, usbCInterrupterLibrary };
}

async function generateCableAnchor(value) {
  const fastener = validateCableAnchorFastener(value);
  reportStatus("Verifying the pinned cable-anchor source…");
  const [{ default: OpenSCAD }, inputs] = await Promise.all([
    import(runtimeUrl.href),
    verifiedSource(),
  ]);

  const stderr = [];
  const instance = await OpenSCAD({
    noInitialRun: true,
    locateFile: (path) => new URL(path, runtimeUrl).href,
    print: () => {},
    printErr: (message) => stderr.push(String(message)),
  });
  for (const directory of ["/work", "/work/lib", "/cache", "/locale"]) {
    makeDirectory(instance.FS, directory);
  }
  instance.FS.writeFile(
    "/work/pocketforge-node-chassis.scad",
    inputs.source,
  );
  instance.FS.writeFile("/work/lib/pf-2020.scad", inputs.library);
  instance.FS.writeFile(
    "/work/lib/usb-c-interrupter-bracket.scad",
    inputs.usbCInterrupterLibrary,
  );
  instance.FS.chdir("/work");

  reportStatus(`Building one ${fastener} rail cable anchor…`);
  let exitCode;
  try {
    exitCode = instance.callMain(
      buildCableAnchorOpenScadArguments(fastener),
    );
  } catch (error) {
    throw new Error(
      stderr.find((line) => line.includes("ERROR:")) ||
        `OpenSCAD could not build this cable anchor: ${error}`,
    );
  }
  const diagnostic = stderr.find((line) => line.includes("ERROR:"));
  if ((exitCode !== undefined && exitCode !== 0) || diagnostic) {
    throw new Error(
      diagnostic || `OpenSCAD stopped with exit code ${exitCode}.`,
    );
  }
  const raw = instance.FS.readFile("/output.stl").slice();
  if (raw.byteLength < 84) {
    throw new Error("OpenSCAD returned an empty or truncated cable anchor.");
  }
  const canonical = canonicalizeGeneratedStl(raw);
  const metrics = await inspectStl(canonical.bytes);
  if (
    metrics.component_count !== 1 ||
    !cableAnchorBoundsWithinEnvelope(metrics.bounds_mm) ||
    metrics.normalized_sha256 !== CABLE_ANCHOR_NORMALIZED_SHA256[fastener]
  ) {
    throw new Error(
      "Generated cable-anchor geometry differs from its qualified baseline.",
    );
  }
  return {
    bytes: canonical.bytes.buffer,
    fastener,
    metrics,
  };
}

self.addEventListener("message", async (event) => {
  if (event.data?.type !== "generate") {
    return;
  }
  try {
    const result = await generateCableAnchor(event.data.fastener);
    self.postMessage({ type: "result", ...result }, [result.bytes]);
  } catch (error) {
    self.postMessage({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Cable-anchor generation failed.",
    });
  }
});
