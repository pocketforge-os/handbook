/*
 * PocketForge's OpenSCAD worker is distributed under GPL-2.0-or-later.
 * It is source code for the GPL OpenSCAD WebAssembly module it imports.
 */

import { buildOpenScadArguments, validateLabel } from "./nameplate-customizer-core.mjs";

const runtimeUrl = new URL("./vendor/openscad/openscad.js", import.meta.url);
const fontUrl = new URL(
  "./vendor/openscad/fonts/LiberationSans-Bold.ttf",
  import.meta.url,
);
const fontConfigUrl = new URL(
  "./vendor/openscad/fonts/fonts.conf",
  import.meta.url,
);
const sourceUrl = new URL(
  "./generated/test-node-chassis/customizer/pocketforge-node-chassis.scad",
  import.meta.url,
);
const libraryUrl = new URL(
  "./generated/test-node-chassis/customizer/lib/pf-2020.scad",
  import.meta.url,
);
const usbCInterrupterLibraryUrl = new URL(
  "./generated/test-node-chassis/customizer/lib/usb-c-interrupter-bracket.scad",
  import.meta.url,
);

function reportStatus(message) {
  self.postMessage({ type: "status", message });
}

async function fetchRequired(url, responseType = "text") {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url.pathname} (${response.status}).`);
  }
  return responseType === "arrayBuffer"
    ? new Uint8Array(await response.arrayBuffer())
    : response.text();
}

function makeDirectory(fs, path) {
  try {
    fs.mkdir(path);
  } catch (error) {
    if (!String(error).includes("File exists")) {
      throw error;
    }
  }
}

async function generateNameplate(label) {
  const validation = validateLabel(label);
  if (!validation.ok) {
    throw new TypeError(validation.message);
  }

  reportStatus("Loading the local OpenSCAD engine…");
  const [
    { default: OpenSCAD },
    source,
    library,
    usbCInterrupterLibrary,
    font,
    fontConfig,
  ] =
    await Promise.all([
      import(runtimeUrl.href),
      fetchRequired(sourceUrl),
      fetchRequired(libraryUrl),
      fetchRequired(usbCInterrupterLibraryUrl),
      fetchRequired(fontUrl, "arrayBuffer"),
      fetchRequired(fontConfigUrl),
    ]);

  const stderr = [];
  const instance = await OpenSCAD({
    noInitialRun: true,
    locateFile: (path) => new URL(path, runtimeUrl).href,
    print: () => {},
    printErr: (message) => stderr.push(String(message)),
  });

  makeDirectory(instance.FS, "/work");
  makeDirectory(instance.FS, "/work/lib");
  makeDirectory(instance.FS, "/work/fonts");
  makeDirectory(instance.FS, "/cache");
  makeDirectory(instance.FS, "/locale");
  instance.FS.writeFile("/work/pocketforge-node-chassis.scad", source);
  instance.FS.writeFile("/work/lib/pf-2020.scad", library);
  instance.FS.writeFile(
    "/work/lib/usb-c-interrupter-bracket.scad",
    usbCInterrupterLibrary,
  );
  instance.FS.writeFile("/work/fonts/LiberationSans-Bold.ttf", font);
  instance.FS.writeFile("/work/fonts/fonts.conf", fontConfig);
  instance.FS.chdir("/work");

  reportStatus(`Building “${validation.label}”…`);
  let exitCode;
  try {
    exitCode = instance.callMain(buildOpenScadArguments(validation.label));
  } catch (error) {
    throw new Error(
      stderr.find((line) => line.includes("ERROR:")) ||
        `OpenSCAD could not build this nameplate: ${error}`,
    );
  }
  if (exitCode !== 0) {
    throw new Error(
      stderr.find((line) => line.includes("ERROR:")) ||
        `OpenSCAD stopped with exit code ${exitCode}.`,
    );
  }

  const output = instance.FS.readFile("/output.stl");
  if (output.byteLength < 1000) {
    throw new Error("OpenSCAD returned an empty or truncated STL.");
  }
  return output.slice().buffer;
}

self.addEventListener("message", async (event) => {
  if (event.data?.type !== "generate") {
    return;
  }
  try {
    const bytes = await generateNameplate(event.data.label);
    self.postMessage({ type: "result", bytes }, [bytes]);
  } catch (error) {
    self.postMessage({
      type: "error",
      message:
        error instanceof Error ? error.message : "Nameplate generation failed.",
    });
  }
});
