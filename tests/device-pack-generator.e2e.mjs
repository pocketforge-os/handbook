import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

import {
  cableAnchorBoundsWithinEnvelope,
} from "../docs/assets/cable-anchor-customizer-core.mjs";
import { inspectStl } from "../docs/assets/device-pack-generator-core.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(repoRoot, "site");
const artifactRoot = path.join(repoRoot, "test-artifacts");
const catalog = JSON.parse(
  await readFile(
    path.join(
      siteRoot,
      "assets/generated/test-node-chassis/browser/catalog.json",
    ),
    "utf8",
  ),
);
const baselineBytes = await readFile(
  path.join(siteRoot, "assets/device-pack-browser-baselines.json"),
);
const baselineLock = JSON.parse(baselineBytes.toString("utf8"));

async function browserExecutable() {
  const candidates = [
    process.env.PF_CHROME,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Try the next standard path.
    }
  }
  throw new Error("No Chrome or Chromium executable found for browser E2E.");
}

function contentType(filePath) {
  return (
    {
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".mjs": "text/javascript; charset=utf-8",
      ".png": "image/png",
      ".scad": "text/plain; charset=utf-8",
      ".ttf": "font/ttf",
      ".wasm": "application/wasm",
    }[path.extname(filePath)] || "application/octet-stream"
  );
}

function startSiteServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://handbook.local");
      let requestPath = decodeURIComponent(url.pathname);
      if (requestPath.endsWith("/")) {
        requestPath += "index.html";
      }
      const filePath = path.resolve(siteRoot, `.${requestPath}`);
      if (!filePath.startsWith(`${siteRoot}${path.sep}`)) {
        response.writeHead(403).end();
        return;
      }
      const bytes = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": contentType(filePath),
        "Cache-Control": "no-store",
      });
      response.end(bytes);
    } catch {
      response.writeHead(404).end();
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function parseStoredZip(bytes) {
  const entries = new Map();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder();
  let offset = 0;
  while (offset + 4 <= bytes.byteLength) {
    const signature = view.getUint32(offset, true);
    if (signature !== 0x04034b50) {
      break;
    }
    const flags = view.getUint16(offset + 6, true);
    const method = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const uncompressedSize = view.getUint32(offset + 22, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    assert.equal(flags, 0x0800, "ZIP entry flags changed");
    assert.equal(method, 0, "browser ZIP must use deterministic stored entries");
    assert.equal(compressedSize, uncompressedSize);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = decoder.decode(bytes.subarray(nameStart, nameStart + nameLength));
    assert.match(name, /^[A-Za-z0-9][A-Za-z0-9._/-]*$/);
    assert.equal(name.includes(".."), false, `unsafe ZIP path: ${name}`);
    assert.equal(entries.has(name), false, `duplicate ZIP path: ${name}`);
    entries.set(name, bytes.slice(dataStart, dataStart + uncompressedSize));
    offset = dataStart + uncompressedSize;
  }
  assert.ok(entries.size > 0, "downloaded ZIP has no local entries");
  assert.equal(view.getUint32(offset, true), 0x02014b50);
  return entries;
}

function recipeKey(artifact) {
  return JSON.stringify({
    source: artifact.source,
    definitions: artifact.definitions,
  });
}

async function verifyPack(downloadPath, device) {
  const bytes = await readFile(downloadPath);
  const entries = parseStoredZip(bytes);
  const root = `device-pack-${device.slug}-full`;
  const manifestPath = `${root}/manifest.json`;
  const checksumsPath = `${root}/SHA256SUMS`;
  assert.ok(entries.has(manifestPath));
  assert.ok(entries.has(checksumsPath));
  const manifest = JSON.parse(entries.get(manifestPath).toString("utf8"));
  await writeFile(
    path.join(artifactRoot, `device-pack-${device.slug}-manifest.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  assert.equal(manifest.schema, "pocketforge-browser-generated-device-pack-v1");
  assert.equal(manifest.source.commit, catalog.source.commit);
  assert.equal(manifest.source.dirty, false);
  assert.equal(manifest.device.slug, device.slug);
  assert.equal(manifest.mode, "full");
  assert.equal(
    manifest.production_eligible,
    device.modes.full.production_eligible,
  );
  assert.deepEqual(
    manifest.nonproduction_reasons,
    device.modes.full.nonproduction_reasons,
  );
  assert.deepEqual(manifest.generator, {
    backend: "Manifold",
    browser_baseline_sha256: sha256(baselineBytes),
    canonicalizer: "pocketforge-browser-canonical-stl-v1",
    engine: "OpenSCAD WebAssembly",
    engine_version: baselineLock.runtime.version,
    environment: "browser",
    generated_locally: true,
  });
  assert.deepEqual(
    manifest.artifacts.map((artifact) => artifact.path),
    device.modes.full.artifacts.map((artifact) => artifact.output),
  );

  const checksumRecords = new Map(
    entries
      .get(checksumsPath)
      .toString("utf8")
      .trim()
      .split("\n")
      .map((line) => {
        const match = /^([0-9a-f]{64})  (.+)$/.exec(line);
        assert.ok(match, `invalid ZIP checksum line: ${line}`);
        return [match[2], match[1]];
      }),
  );
  assert.equal(checksumRecords.size, manifest.artifacts.length + 1);
  for (const [relativeName, expectedHash] of checksumRecords) {
    const entry = entries.get(`${root}/${relativeName}`);
    assert.ok(entry, `checksums name missing ZIP entry: ${relativeName}`);
    assert.equal(sha256(entry), expectedHash);
  }

  let triangles = 0;
  for (const artifact of manifest.artifacts) {
    const entry = entries.get(`${root}/${artifact.path}`);
    assert.ok(entry, `manifest names missing ZIP entry: ${artifact.path}`);
    assert.equal(entry.byteLength, artifact.bytes);
    assert.equal(sha256(entry), artifact.raw_sha256);
    const metrics = await inspectStl(entry);
    assert.equal(metrics.normalized_sha256, artifact.normalized_sha256);
    assert.equal(
      metrics.normalized_sha256,
      artifact.browser_baseline_normalized_sha256,
    );
    if (artifact.expected_normalized_sha256) {
      assert.equal(
        artifact.source_normalized_sha256,
        artifact.expected_normalized_sha256,
      );
    }
    triangles += metrics.triangle_count;
  }
  assert.equal(entries.size, manifest.artifacts.length + 2);
  return { bytes: bytes.byteLength, triangles };
}

const configuredBaseUrl = process.env.PF_HANDBOOK_BASE_URL?.replace(/\/+$/, "");
const server = configuredBaseUrl ? undefined : await startSiteServer();
const address = server?.address();
const baseUrl = configuredBaseUrl || `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({
  executablePath: await browserExecutable(),
  headless: true,
  args: ["--no-sandbox"],
});

try {
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 1000 },
  });
  const page = await context.newPage();
  const requests = [];
  const pageErrors = [];
  page.on("request", (request) => requests.push(new URL(request.url()).pathname));
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  await page.goto(
    `${baseUrl}/hardware/test-node-chassis/devices/trimui-smart-pro-s/print/`,
    { waitUntil: "networkidle" },
  );

  const generator = page.locator("[data-device-pack-generator]");
  const deviceSelect = page.locator("[data-pack-device]");
  const modeSelect = page.locator("[data-pack-mode]");
  const status = page.locator("[data-pack-status]");
  const inventory = page.locator("[data-pack-inventory]");
  const packDownload = page.locator("[data-pack-download]");
  await generator.waitFor({ state: "visible" });
  await deviceSelect.waitFor({ state: "visible" });
  assert.equal(
    await generator.getByRole("heading", {
      name: "Generate a device print pack",
    }).count(),
    1,
  );
  assert.match(
    await deviceSelect.evaluate((select) => select.labels[0]?.textContent || ""),
    /Handheld · locked by build sheet/,
  );
  assert.match(
    await modeSelect.evaluate((select) => select.labels[0]?.textContent || ""),
    /^\s*Build\s*/,
  );
  try {
    await page.waitForFunction(
      (expected) =>
        document.querySelector("[data-pack-device]")?.options.length === expected,
      catalog.devices.length,
    );
  } catch (error) {
    throw new Error(
      `device catalog did not load: status=${JSON.stringify(await status.textContent())} ` +
        `page_errors=${JSON.stringify(pageErrors)}`,
      { cause: error },
    );
  }

  assert.deepEqual(
    await deviceSelect.locator("option").evaluateAll((options) =>
      options.map((option) => ({
        value: option.value,
        text: option.textContent,
      }))),
    catalog.devices.map((device) => ({
      value: device.slug,
      text: device.display_name,
    })),
  );
  assert.deepEqual(await modeSelect.locator("option").allTextContents(), [
    "Fit coupon · 1 file",
    "Device retrofit · 6 files",
    "Complete chassis · device-selected files",
  ]);
  assert.equal(await deviceSelect.isDisabled(), true);
  assert.equal(await deviceSelect.inputValue(), "trimui-smart-pro-s");
  assert.equal(
    await generator.getAttribute("data-locked-device"),
    "trimui-smart-pro-s",
  );
  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.wasm")),
    false,
    "OpenSCAD WASM must be lazy",
  );
  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.js")),
    false,
    "OpenSCAD JavaScript must be lazy",
  );

  const defaultDevice = catalog.devices.find(
    (device) => device.slug === "trimui-smart-pro-s",
  );
  for (const mode of catalog.modes) {
    await modeSelect.selectOption(mode);
    assert.equal(
      await inventory.locator("[data-artifact-id]").count(),
      defaultDevice.modes[mode].artifacts.length,
    );
  }
  await modeSelect.selectOption("full");
  assert.equal(
    (await inventory
      .locator("[data-pack-generate-one]")
      .allTextContents())
      .every((label) => label.trim() === "Generate"),
    true,
  );
  assert.equal(await generator.getAttribute("data-state"), "qualified");
  assert.match(
    await page.locator("[data-pack-qualification]").textContent(),
    /production-qualified pack.*tsp-t1zd\.2/is,
  );

  await page.route(/\/browser\/sources\/.*\.scad$/, async (route) => {
    const response = await route.fetch();
    const original = await response.body();
    await route.fulfill({
      response,
      body: Buffer.concat([original, Buffer.from("\n// tampered\n")]),
    });
  });
  await modeSelect.selectOption("coupon");
  await inventory.locator("[data-pack-generate-one]").click();
  await status.locator("xpath=self::*[@data-state='error']").waitFor({
    timeout: 30_000,
  });
  assert.match(await status.textContent(), /source (size|hash) changed/i);
  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.wasm")),
    false,
    "source tampering must fail before loading OpenSCAD",
  );
  await page.unroute(/\/browser\/sources\/.*\.scad$/);

  await page.route("**/device-pack-browser-baselines.json", async (route) => {
    const response = await route.fetch();
    const body = JSON.parse((await response.body()).toString("utf8"));
    body.source.commit = "0".repeat(40);
    await route.fulfill({ response, json: body });
  });
  await inventory.locator("[data-pack-generate-one]").click();
  await status.locator("xpath=self::*[@data-state='error']").waitFor({
    timeout: 30_000,
  });
  assert.match(await status.textContent(), /pinned source revision/i);
  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.wasm")),
    false,
    "baseline tampering must fail before loading OpenSCAD",
  );
  await page.unroute("**/device-pack-browser-baselines.json");

  await inventory.locator("[data-pack-generate-one]").click();
  await page.locator("[data-pack-cancel]").waitFor({ state: "visible" });
  await page.locator("[data-pack-cancel]").click();
  await status.filter({ hasText: /cancelled/i }).waitFor();
  assert.equal(await generator.getAttribute("aria-busy"), "false");

  await inventory.locator("[data-pack-generate-one]").click();
  const artifactDownload = inventory.locator(
    "[data-pack-artifact-download]",
  );
  await artifactDownload.waitFor({ state: "visible", timeout: 120_000 });
  assert.match(await status.textContent(), /passed geometry verification/i);
  const artifactDownloadPromise = page.waitForEvent("download");
  await artifactDownload.click();
  const artifactFile = await artifactDownloadPromise;
  assert.equal(
    artifactFile.suggestedFilename(),
    "pocketforge-trimui-smart-pro-s-coupon-holder-fit-coupon.stl",
  );
  const artifactPath = await artifactFile.path();
  assert.ok(artifactPath);
  const artifactMetrics = await inspectStl(await readFile(artifactPath));
  assert.equal(
    artifactMetrics.normalized_sha256,
    baselineLock.artifacts[
      "trimui-smart-pro-s/holder_fit_coupon"
    ].browser_normalized_sha256,
  );

  const anchorCustomizer = page.locator("[data-cable-anchor-customizer]");
  const anchorFastener = page.locator("[data-anchor-fastener]");
  const anchorHardware = page.locator("[data-anchor-hardware]");
  const anchorStatus = page.locator("[data-anchor-status]");
  const anchorDownload = page.locator("[data-anchor-download]");
  const anchorPreview = page.locator("[data-anchor-preview]");
  await anchorCustomizer.waitFor({ state: "visible" });
  assert.match(
    await anchorPreview.evaluate((preview) => preview.src),
    /cable-anchor-m5\.glb$/,
  );
  assert.match(
    await anchorPreview.evaluate((preview) => preview.poster),
    /cable-anchor-m5\.png$/,
  );
  assert.match(
    await anchorHardware.textContent(),
    /M5 drop-in T-nut.*10 mm OD/i,
  );

  async function generateAnchor(fastener) {
    await anchorFastener.selectOption(fastener);
    assert.match(
      await anchorPreview.evaluate((preview) => preview.src),
      new RegExp(`cable-anchor-${fastener.toLowerCase()}\\.glb$`),
    );
    assert.match(
      await anchorPreview.evaluate((preview) => preview.poster),
      new RegExp(`cable-anchor-${fastener.toLowerCase()}\\.png$`),
    );
    await page.locator("[data-anchor-generate]").click();
    await page.waitForFunction(
      () => {
        const node = document.querySelector("[data-anchor-status]");
        return ["ready", "error"].includes(node?.dataset.state);
      },
      undefined,
      { timeout: 120_000 },
    );
    if ((await anchorStatus.getAttribute("data-state")) === "error") {
      throw new Error(
        `browser cable-anchor generation failed for ${fastener}: ` +
          `${await anchorStatus.textContent()}`,
      );
    }
    await anchorDownload.waitFor({ state: "visible" });
    assert.equal(await anchorStatus.getAttribute("data-state"), "ready");
    assert.match(
      await anchorStatus.textContent(),
      new RegExp(`closed ${fastener} anchor.*32 × 18 × 8\\.8 mm`, "i"),
    );
    const downloadPromise = page.waitForEvent("download");
    await anchorDownload.click();
    const download = await downloadPromise;
    assert.equal(
      download.suggestedFilename(),
      `pocketforge-rail-cable-anchor-${fastener.toLowerCase()}.stl`,
    );
    const downloadPath = await download.path();
    assert.ok(downloadPath);
    const metrics = await inspectStl(await readFile(downloadPath));
    assert.equal(metrics.component_count, 1);
    assert.equal(cableAnchorBoundsWithinEnvelope(metrics.bounds_mm), true);
    return metrics;
  }

  const m3AnchorMetrics = await generateAnchor("M3");
  assert.match(
    await anchorHardware.textContent(),
    /M3 drop-in T-nut.*7 mm OD/i,
  );
  assert.equal(
    m3AnchorMetrics.normalized_sha256,
    "a0cf2279a77c02356afbbfeb739be939808e370e8437becf92a50c7a09eba193",
  );
  const m5AnchorMetrics = await generateAnchor("M5");
  assert.equal(
    m5AnchorMetrics.normalized_sha256,
    "3b249814d8e78d4467591edf94b51be9f4ef450aad258bb58d3f0b55b54d9678",
  );
  assert.notEqual(
    m3AnchorMetrics.normalized_sha256,
    m5AnchorMetrics.normalized_sha256,
  );

  await mkdir(artifactRoot, { recursive: true });
  const printPreviews = page.locator(".pf-print-preview-grid");
  assert.equal(
    await printPreviews.locator(".pf-print-preview").count(),
    7,
    "the print page must expose all seven interactive print-bed previews",
  );
  assert.deepEqual(
    await printPreviews
      .locator("model-viewer")
      .evaluateAll((previews) => previews.map((preview) => preview.alt)),
    [
      "Interactive preview of the optional chassis calibration bed",
      "Interactive preview of 28 compact channel bars",
      "Interactive preview of four keyed fixture links and four printed crossbar-joint plates",
      "Interactive preview of the frame hardware print bed",
      "Interactive preview of the reusable placard holder",
      "Interactive preview of the two-color device nameplate bed",
      "Interactive preview of eight rail-mounted cable and zip-tie anchors",
    ],
  );
  await anchorCustomizer.screenshot({
    path: path.join(artifactRoot, "cable-anchor-customizer-light.png"),
  });
  await printPreviews.screenshot({
    path: path.join(artifactRoot, "print-bed-previews-light.png"),
  });
  await modeSelect.selectOption("full");
  await generator.screenshot({
    path: path.join(artifactRoot, "device-pack-generator-light.png"),
  });
  await page.locator("body").evaluate((body) => {
    body.dataset.mdColorScheme = "slate";
  });
  await generator.screenshot({
    path: path.join(artifactRoot, "device-pack-generator-dark.png"),
  });
  await page.locator("body").evaluate((body) => {
    body.dataset.mdColorScheme = "default";
  });

  const totals = { bytes: 0, triangles: 0, packs: 0 };
  const printRoutes = new Map([
    [
      "trimui-brick",
      "/hardware/test-node-chassis/devices/trimui-brick/print/",
    ],
    [
      "trimui-smart-pro",
      "/hardware/test-node-chassis/devices/trimui-smart-pro/print/",
    ],
    [
      "trimui-smart-pro-s",
      "/hardware/test-node-chassis/devices/trimui-smart-pro-s/print/",
    ],
  ]);
  for (const device of catalog.devices) {
    await page.goto(`${baseUrl}${printRoutes.get(device.slug)}`, {
      waitUntil: "networkidle",
    });
    await page.waitForFunction(
      (expected) =>
        document.querySelector("[data-pack-device]")?.options.length === expected,
      catalog.devices.length,
    );
    assert.equal(await deviceSelect.isDisabled(), true);
    assert.equal(await deviceSelect.inputValue(), device.slug);
    assert.equal(
      await generator.getAttribute("data-locked-device"),
      device.slug,
    );
    await modeSelect.selectOption("full");
    const expectedCount = device.modes.full.artifacts.length;
    assert.equal(
      await inventory.locator("[data-artifact-id]").count(),
      expectedCount,
    );
    await page.locator("[data-pack-generate-all]").click();
    await page.waitForFunction(
      () => {
        const download = document.querySelector("[data-pack-download]");
        const statusNode = document.querySelector("[data-pack-status]");
        return !download?.hidden || statusNode?.dataset.state === "error";
      },
      undefined,
      { timeout: 900_000 },
    );
    if ((await status.getAttribute("data-state")) === "error") {
      throw new Error(
        `browser pack generation failed for ${device.slug}: ` +
          `${await status.textContent()} ` +
          `(progress=${await page.locator("[data-pack-progress]").getAttribute("value")}, ` +
          `generated=${await inventory.locator('[data-generated="true"]').count()})`,
      );
    }
    assert.match(
      await status.textContent(),
      new RegExp(`${expectedCount} verified STL files`, "i"),
    );
    assert.equal(
      await inventory.locator('[data-generated="true"]').count(),
      expectedCount,
    );
    assert.equal(
      await inventory.locator("[data-pack-artifact-download]:visible").count(),
      expectedCount,
    );
    const downloadPromise = page.waitForEvent("download");
    await packDownload.click();
    const download = await downloadPromise;
    assert.equal(
      download.suggestedFilename(),
      `device-pack-${device.slug}-full.zip`,
    );
    const downloadPath = await download.path();
    assert.ok(downloadPath);
    const packStat = await stat(downloadPath);
    assert.ok(packStat.size > 100_000);
    const result = await verifyPack(downloadPath, device);
    totals.bytes += result.bytes;
    totals.triangles += result.triangles;
    totals.packs += 1;
  }

  const allRecipes = new Set(
    catalog.devices.flatMap((device) =>
      catalog.modes.flatMap((mode) =>
        device.modes[mode].artifacts.map(recipeKey),
      ),
    ),
  );
  const fullRecipes = new Set(
    catalog.devices.flatMap((device) =>
      device.modes.full.artifacts.map(recipeKey),
    ),
  );
  assert.deepEqual(fullRecipes, allRecipes);

  await page.setViewportSize({ width: 390, height: 844 });
  await modeSelect.selectOption("full");
  await generator.screenshot({
    path: path.join(artifactRoot, "device-pack-generator-mobile.png"),
  });
  await anchorCustomizer.screenshot({
    path: path.join(artifactRoot, "cable-anchor-customizer-mobile.png"),
  });
  await printPreviews.screenshot({
    path: path.join(artifactRoot, "print-bed-previews-mobile.png"),
  });
  for (const surface of [generator, anchorCustomizer, printPreviews]) {
    assert.equal(
      await surface.evaluate((node) => node.scrollWidth <= node.clientWidth),
      true,
      "print controls and previews must not overflow a narrow viewport",
    );
  }
  assert.deepEqual(pageErrors, []);

  console.log(
    `device_pack_e2e=pass devices=${catalog.devices.length} ` +
      `recipes=${allRecipes.size} packs=${totals.packs} ` +
      `bytes=${totals.bytes} triangles=${totals.triangles} ` +
      `anchor_m3=${m3AnchorMetrics.normalized_sha256} ` +
      `anchor_m5=${m5AnchorMetrics.normalized_sha256}`,
  );
} finally {
  await browser.close();
  if (server) {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}
