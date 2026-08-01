import assert from "node:assert/strict";
import { createServer } from "node:http";
import { access, mkdir, readFile, stat } from "node:fs/promises";
import { constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(repoRoot, "site");
const artifactRoot = path.join(repoRoot, "test-artifacts");

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
  throw new Error("No Chrome or Chromium executable found for browser smoke test.");
}

function contentType(filePath) {
  return (
    {
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".mjs": "text/javascript; charset=utf-8",
      ".glb": "model/gltf-binary",
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

function inspectStl(bytes) {
  const triangles = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const binaryTriangleCount = bytes.length >= 84 ? view.getUint32(80, true) : 0;
  if (84 + binaryTriangleCount * 50 === bytes.length) {
    for (let triangle = 0; triangle < binaryTriangleCount; triangle += 1) {
      const vertices = [];
      const triangleOffset = 84 + triangle * 50;
      for (let vertex = 0; vertex < 3; vertex += 1) {
        const offset = triangleOffset + 12 + vertex * 12;
        vertices.push([
          view.getFloat32(offset, true),
          view.getFloat32(offset + 4, true),
          view.getFloat32(offset + 8, true),
        ]);
      }
      triangles.push(vertices);
    }
  } else {
    const vertices = [...bytes.toString("utf8").matchAll(
      /^\s*vertex\s+(\S+)\s+(\S+)\s+(\S+)\s*$/gm,
    )].map((match) => match.slice(1).map(Number));
    assert.equal(
      vertices.length % 3,
      0,
      "generated ASCII STL has an incomplete triangle",
    );
    for (let index = 0; index < vertices.length; index += 3) {
      triangles.push(vertices.slice(index, index + 3));
    }
  }

  const triangleCount = triangles.length;
  assert.ok(triangleCount > 500, "generated STL has too few triangles");

  const bounds = [
    [Infinity, -Infinity],
    [Infinity, -Infinity],
    [Infinity, -Infinity],
  ];
  const edgeCounts = new Map();
  const vertexKey = (vertex) =>
    vertex.map((coordinate) => coordinate.toFixed(4)).join(",");
  const addEdge = (left, right) => {
    const edge = [vertexKey(left), vertexKey(right)].sort().join("|");
    edgeCounts.set(edge, (edgeCounts.get(edge) ?? 0) + 1);
  };

  for (const vertices of triangles) {
    for (const point of vertices) {
      point.forEach((coordinate, axis) => {
        bounds[axis][0] = Math.min(bounds[axis][0], coordinate);
        bounds[axis][1] = Math.max(bounds[axis][1], coordinate);
      });
    }
    addEdge(vertices[0], vertices[1]);
    addEdge(vertices[1], vertices[2]);
    addEdge(vertices[2], vertices[0]);
  }

  const openEdges = [...edgeCounts.values()].filter((count) => count !== 2);
  assert.equal(openEdges.length, 0, "generated STL is not a closed manifold");
  const expectedBounds = [
    [1.4, 229.8],
    [7.5, 36.5],
    [0.0, 3.6],
  ];
  bounds.forEach((axisBounds, axis) =>
    axisBounds.forEach((coordinate, side) =>
      assert.ok(
        Math.abs(coordinate - expectedBounds[axis][side]) < 0.02,
        `generated STL bound changed on axis ${axis}: ${bounds[axis]}`,
      ),
    ),
  );
  return triangleCount;
}

const configuredBaseUrl = process.env.PF_HANDBOOK_BASE_URL?.replace(/\/+$/, "");
const server = configuredBaseUrl ? undefined : await startSiteServer();
const address = server?.address();
const baseUrl =
  configuredBaseUrl || `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({
  executablePath: await browserExecutable(),
  headless: true,
  args: ["--no-sandbox"],
});

try {
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const requests = [];
  page.on("request", (request) => requests.push(new URL(request.url()).pathname));

  await mkdir(artifactRoot, { recursive: true });
  for (const [route, viewerId, screenshotName] of [
    [
      "/hardware/test-node-chassis/layouts/chassis-dualbar-v1/",
      "overview-chassis-model",
      "chassis-model-overview.png",
    ],
    [
      "/hardware/test-node-chassis/layouts/chassis-dualbar-v1/assemble/",
      "assembly-chassis-model",
      "chassis-model-assembly.png",
    ],
  ]) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const viewer = page.locator(`#${viewerId}`);
    await viewer.waitFor({ state: "visible" });
    await page.waitForFunction(
      (selector) => document.querySelector(selector)?.loaded === true,
      `#${viewerId}`,
      { timeout: 120_000 },
    );
    await page.waitForFunction(
      (selector) => document.querySelector(selector)?.modelIsVisible === true,
      `#${viewerId}`,
      { timeout: 120_000 },
    );
    await viewer.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    const expectedHotspots = [
      "hotspot-operator",
      "hotspot-device",
      "hotspot-post",
      "hotspot-width",
      "hotspot-depth",
      "hotspot-upper-fixture-bar",
      "hotspot-lower-fixture-bar",
      "hotspot-fixture",
      "hotspot-handheld",
    ];
    assert.deepEqual(
      await viewer
        .locator('[slot^="hotspot-"]')
        .evaluateAll((hotspots) => hotspots.map((hotspot) => hotspot.slot)),
      expectedHotspots,
      `${route} must expose every current chassis label in a stable order`,
    );
    assert.equal(
      await viewer.getAttribute("data-labels-visible"),
      "true",
      `${route} must show chassis labels initially`,
    );
    const labelToggle = page.locator("[data-chassis-label-toggle]");
    await labelToggle.waitFor({ state: "visible" });
    await labelToggle.click();
    assert.equal(
      await viewer.getAttribute("data-labels-visible"),
      "false",
      `${route} label toggle did not hide labels`,
    );
    assert.equal(await labelToggle.textContent(), "Show labels");
    assert.equal(
      await viewer
        .locator('[slot="hotspot-post"]')
        .evaluate((hotspot) => getComputedStyle(hotspot).display),
      "none",
      `${route} label toggle did not visually hide hotspots`,
    );
    await labelToggle.click();
    assert.equal(
      await viewer.getAttribute("data-labels-visible"),
      "true",
      `${route} label toggle did not restore labels`,
    );
    assert.equal(
      await viewer
        .locator('[slot="hotspot-post"]')
        .evaluate((hotspot) => getComputedStyle(hotspot).display),
      "flex",
      `${route} label toggle did not visually restore hotspots`,
    );
    await viewer.screenshot({
      path: path.join(artifactRoot, screenshotName),
    });
  }
  assert.equal(
    requests.some((requestPath) =>
      requestPath.endsWith("/pocketforge-test-node.glb")
    ),
    true,
    "the full-chassis pages must load the canonical GLB",
  );

  await page.goto(
    `${baseUrl}/hardware/test-node-chassis/devices/trimui-smart-pro-s/print/`,
    {
      waitUntil: "networkidle",
    },
  );
  await page.locator("[data-nameplate-customizer]").waitFor({
    state: "visible",
  });
  assert.equal(
    await page.locator("noscript").count(),
    1,
    "the no-JavaScript fallback must remain in the built page",
  );
  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.wasm")),
    false,
    "OpenSCAD WASM must remain lazy before the form is submitted",
  );
  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.js")),
    false,
    "OpenSCAD JavaScript must remain lazy before the form is submitted",
  );

  await page.locator("[data-nameplate-input]").fill('DUT"; cube(10)');
  await page.locator("[data-nameplate-submit]").click();
  await page.locator('[data-nameplate-status][data-state="error"]').waitFor();
  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.wasm")),
    false,
    "invalid input must be rejected before loading OpenSCAD",
  );

  await page.route("**/openscad.wasm", (route) => route.abort("failed"));
  await page.locator("[data-nameplate-input]").fill("Anbernic RG35XX");
  await page.locator("[data-nameplate-submit]").click();
  await page.locator('[data-nameplate-status][data-state="error"]').waitFor({
    timeout: 30_000,
  });
  assert.match(
    await page.locator("[data-nameplate-status]").textContent(),
    /could not|failed|OpenSCAD/i,
    "runtime failure must produce a readable status",
  );
  await page.unroute("**/openscad.wasm");

  await page.locator("[data-nameplate-input]").fill("Anbernic RG35XX");
  await page.locator("[data-nameplate-submit]").click();
  const downloadLink = page.locator("[data-nameplate-download]");
  await downloadLink.waitFor({ state: "visible", timeout: 120_000 });

  assert.equal(
    requests.some((requestPath) => requestPath.endsWith("/openscad.wasm")),
    true,
    "form submission must load the self-hosted OpenSCAD runtime",
  );
  assert.match(
    await downloadLink.getAttribute("download"),
    /^pocketforge-nameplate-anbernic-rg35xx\.stl$/,
  );

  const downloadPromise = page.waitForEvent("download");
  await downloadLink.click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  assert.ok(downloadPath, "browser did not preserve the generated STL");
  const downloadStat = await stat(downloadPath);
  assert.ok(downloadStat.size > 100_000, "generated STL is unexpectedly small");
  const triangleCount = inspectStl(await readFile(downloadPath));

  const customizer = page.locator("[data-nameplate-customizer]");
  await page.emulateMedia({ colorScheme: "light" });
  await customizer.screenshot({
    path: path.join(artifactRoot, "nameplate-customizer-light.png"),
  });
  await page.locator("body").evaluate((body) => {
    body.dataset.mdColorScheme = "slate";
  });
  await customizer.screenshot({
    path: path.join(artifactRoot, "nameplate-customizer-dark.png"),
  });
  await page.locator("body").evaluate((body) => {
    body.dataset.mdColorScheme = "default";
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await downloadLink.evaluate((link) => getComputedStyle(link).color),
    "rgb(255, 255, 255)",
    "the focused download control must keep its readable white label",
  );
  await customizer.screenshot({
    path: path.join(artifactRoot, "nameplate-customizer-mobile.png"),
  });

  console.log(
    `nameplate_e2e=pass label=Anbernic_RG35XX bytes=${downloadStat.size} ` +
      `triangles=${triangleCount} ` +
      `runtime_requests=${requests.filter((item) => item.endsWith("/openscad.wasm")).length}`,
  );
} finally {
  await browser.close();
  if (server) {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}
