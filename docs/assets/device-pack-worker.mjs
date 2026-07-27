/*
 * PocketForge's browser pack worker is distributed under GPL-2.0-or-later.
 * It is source code for the GPL OpenSCAD WebAssembly module it imports.
 */

import {
  buildOpenScadArguments,
  canonicalizeGeneratedStl,
  inspectStl,
  loadBrowserBaselines,
  loadVerifiedCatalog,
  selectDeviceMode,
  sha256Hex,
  stableJson,
} from "./device-pack-generator-core.mjs";

function report(message, detail = {}) {
  self.postMessage({ type: "status", message, ...detail });
}

function openScadDiagnostic(stderr) {
  return (
    stderr.find((line) => line.includes("ERROR:")) ||
    stderr.slice(-8).join(" ").trim()
  );
}

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${new URL(url).pathname} (${response.status}).`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${new URL(url).pathname} (${response.status}).`);
  }
  return response.text();
}

function makeDirectory(fs, path) {
  if (fs.analyzePath(path).exists) {
    return;
  }
  fs.mkdir(path);
}

function makeDirectoryTree(fs, path) {
  const parts = path.split("/").filter(Boolean);
  let cursor = "";
  for (const part of parts) {
    cursor += `/${part}`;
    makeDirectory(fs, cursor);
  }
}

async function loadEngineInputs(request, catalog, baselines) {
  report("Verifying the pinned OpenSCAD source bundle…");
  const catalogBase = new URL("./", request.catalogUrl);
  const sourceFiles = await Promise.all(
    catalog.sources.map(async (record) => {
      const bytes = await fetchBytes(new URL(record.bundle_path, catalogBase));
      if (bytes.byteLength !== record.size_bytes) {
        throw new Error(`Source size changed: ${record.path}`);
      }
      if ((await sha256Hex(bytes)) !== record.sha256) {
        throw new Error(`Source hash changed: ${record.path}`);
      }
      return { path: record.path, bytes };
    }),
  );
  const [runtimeSourceBytes, runtimeBytes, font, fontConfig] =
    await Promise.all([
      fetchBytes(request.runtimeUrl),
      fetchBytes(new URL("openscad.wasm", request.runtimeUrl)),
      fetchBytes(request.fontUrl),
      fetchText(request.fontConfigUrl),
    ]);
  if (
    (await sha256Hex(runtimeSourceBytes)) !==
      baselines.runtime.javascript_sha256 ||
    (await sha256Hex(runtimeBytes)) !== baselines.runtime.wasm_sha256
  ) {
    throw new Error("The pinned browser OpenSCAD runtime hash changed.");
  }
  const runtimeModule = await import(request.runtimeUrl);
  return { sourceFiles, runtimeModule, runtimeBytes, font, fontConfig };
}

async function initializeEngine(request, inputs) {
  const stderr = [];
  const instance = await inputs.runtimeModule.default({
    noInitialRun: true,
    wasmBinary: inputs.runtimeBytes,
    locateFile: (path) => new URL(path, request.runtimeUrl).href,
    print: () => {},
    printErr: (message) => stderr.push(String(message)),
  });
  makeDirectoryTree(instance.FS, "/work/fonts");
  makeDirectory(instance.FS, "/outputs");
  makeDirectory(instance.FS, "/cache");
  makeDirectory(instance.FS, "/locale");
  for (const source of inputs.sourceFiles) {
    const destination = `/work/${source.path}`;
    makeDirectoryTree(
      instance.FS,
      destination.slice(0, destination.lastIndexOf("/")),
    );
    instance.FS.writeFile(destination, source.bytes);
  }
  instance.FS.writeFile(
    "/work/fonts/LiberationSans-Bold.ttf",
    inputs.font,
  );
  instance.FS.writeFile("/work/fonts/fonts.conf", inputs.fontConfig);
  instance.FS.chdir("/work");
  return { instance, stderr };
}

async function render(request) {
  const catalog = await loadVerifiedCatalog(
    request.catalogUrl,
    request.checksumsUrl,
  );
  const baselines = await loadBrowserBaselines(
    request.baselineUrl,
    catalog,
  );
  const baselineSha256 = await sha256Hex(stableJson(baselines));
  const selection = selectDeviceMode(catalog, request.deviceSlug, request.mode);
  if (!Array.isArray(request.artifactIds)) {
    throw new TypeError("Requested artifact IDs must be an array.");
  }
  const requestedIds = new Set(request.artifactIds);
  if (requestedIds.size !== request.artifactIds.length) {
    throw new TypeError("Requested artifact IDs are invalid or duplicated.");
  }
  const artifacts = selection.mode.artifacts.filter((artifact) =>
    requestedIds.has(artifact.id));
  if (artifacts.length !== requestedIds.size) {
    throw new TypeError("Requested artifact is not in the selected pack.");
  }

  const inputs = await loadEngineInputs(request, catalog, baselines);
  for (const [index, artifact] of artifacts.entries()) {
    report(`Building ${index + 1} of ${artifacts.length}: ${artifact.role}`, {
      current: index + 1,
      total: artifacts.length,
      artifactId: artifact.id,
    });
    const { instance, stderr } = await initializeEngine(request, inputs);
    const output = `/outputs/artifact-${index}.stl`;
    let exitCode;
    try {
      exitCode = instance.callMain(buildOpenScadArguments(artifact, output));
    } catch (error) {
      const diagnostic = openScadDiagnostic(stderr);
      throw new Error(
        diagnostic || `OpenSCAD could not build ${artifact.output}: ${error}`,
      );
    }
    const errorDiagnostic = stderr.find((line) => line.includes("ERROR:"));
    if ((exitCode !== undefined && exitCode !== 0) || errorDiagnostic) {
      throw new Error(
        errorDiagnostic || `OpenSCAD stopped with exit code ${exitCode}.`,
      );
    }
    const rawOutputBytes = instance.FS.readFile(output).slice();
    instance.FS.unlink(output);
    if (rawOutputBytes.byteLength < 84) {
      throw new Error(`OpenSCAD returned a truncated STL for ${artifact.output}.`);
    }
    const canonical = canonicalizeGeneratedStl(rawOutputBytes);
    const outputBytes = canonical.bytes;
    const metrics = await inspectStl(outputBytes);
    const baseline = baselines.artifacts[
      `${selection.device.slug}/${artifact.id}`
    ];
    if (metrics.normalized_sha256 !== baseline.browser_normalized_sha256) {
      throw new Error(
        `Browser geometry drifted for ${artifact.output}: ` +
          `${metrics.normalized_sha256} != ` +
          baseline.browser_normalized_sha256,
      );
    }
    const transfer = outputBytes.buffer;
    self.postMessage(
      {
        type: "artifact",
        artifactId: artifact.id,
        bytes: transfer,
        metrics: {
          ...metrics,
          browser_baseline_normalized_sha256:
            baseline.browser_normalized_sha256,
          browser_baseline_sha256: baselineSha256,
          browser_runtime_version: baselines.runtime.version,
          source_normalized_sha256:
            baseline.source_normalized_sha256,
          removed_degenerate_facets: canonical.removed_degenerate_facets,
        },
      },
      [transfer],
    );
  }
  self.postMessage({ type: "done" });
}

self.addEventListener("message", async (event) => {
  if (event.data?.type !== "generate") {
    return;
  }
  try {
    await render(event.data);
  } catch (error) {
    self.postMessage({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Browser device-pack generation failed.",
    });
  }
});
