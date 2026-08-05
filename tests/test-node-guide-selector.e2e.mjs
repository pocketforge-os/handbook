import assert from "node:assert/strict";
import { access, mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const siteRoot = path.join(root, "site");
const artifactRoot = path.join(root, "test-artifacts");

async function browserExecutable() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next system browser.
    }
  }
  throw new Error("No Chromium executable is available for guide-selector E2E.");
}

function contentType(filename) {
  return (
    {
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".mjs": "text/javascript; charset=utf-8",
      ".svg": "image/svg+xml",
    }[path.extname(filename)] || "application/octet-stream"
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
      const filename = path.resolve(siteRoot, `.${requestPath}`);
      if (!filename.startsWith(`${siteRoot}${path.sep}`)) {
        response.writeHead(403).end();
        return;
      }
      response.writeHead(200, {
        "Content-Type": contentType(filename),
        "Cache-Control": "no-store",
      });
      response.end(await readFile(filename));
    } catch {
      response.writeHead(404).end();
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
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
  await mkdir(artifactRoot, { recursive: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseUrl}/hardware/test-node-chassis/`, {
    waitUntil: "networkidle",
  });

  const selector = page.locator("[data-test-node-guide-selector]");
  const device = selector.locator("[data-guide-device-select]");
  const status = selector.locator("[data-guide-status]");
  await device.waitFor({ state: "visible" });
  assert.equal(await device.isEnabled(), true);
  assert.deepEqual(
    await device.locator("option").evaluateAll((options) =>
      options.map((option) => [option.value, option.textContent]),
    ),
    [
      ["", "Choose a DUT…"],
      ["powkiddy-x55", "Powkiddy X55"],
      ["trimui-brick", "TrimUI Brick / TG3040"],
      ["trimui-smart-pro", "TrimUI Smart Pro / TG5040"],
      ["trimui-smart-pro-s", "TrimUI Smart Pro S / TG5050"],
    ],
  );
  assert.equal(await page.locator("[data-guide-result]").isHidden(), true);

  for (const selection of [
    {
      slug: "powkiddy-x55",
      layout: "chassis-core-v2",
      steps: 19,
      lastStep: "19-final-check",
    },
    {
      slug: "trimui-brick",
      layout: "chassis-dualbar-v1",
      steps: 17,
      lastStep: "17-final-check",
    },
    {
      slug: "trimui-smart-pro",
      layout: "chassis-core-v2",
      steps: 19,
      lastStep: "19-final-check",
    },
    {
      slug: "trimui-smart-pro-s",
      layout: "chassis-dualbar-v1",
      steps: 17,
      lastStep: "17-final-check",
    },
  ]) {
    await device.selectOption(selection.slug);
    await page.waitForURL(new RegExp(`device=${selection.slug}$`));
    assert.match(await status.textContent(), new RegExp(`${selection.steps} assembly steps`));
    assert.equal(await selector.locator("[data-guide-stage]").count(), 9);
    assert.equal(await selector.locator("[data-guide-step]").count(), selection.steps);
    assert.match(
      await selector
        .locator(`[data-guide-step="${selection.lastStep}"] a`)
        .getAttribute("href"),
      new RegExp(
        `/hardware/test-node-chassis/layouts/${selection.layout}/assemble/${selection.lastStep}/$`,
      ),
    );
  }

  assert.equal(
    await page
      .locator(".md-sidebar--primary")
      .getByText("Learn the rail", { exact: false })
      .count(),
    0,
  );
  assert.ok(
    (await page
      .locator(".md-sidebar--primary")
      .getByText("Test-node chassis", { exact: true })
      .count()) >= 1,
  );

  await page.goto(
    `${baseUrl}/hardware/test-node-chassis/?device=trimui-smart-pro-s`,
    { waitUntil: "networkidle" },
  );
  assert.equal(await device.inputValue(), "trimui-smart-pro-s");
  assert.equal(await selector.locator("[data-guide-step]").count(), 17);
  await selector.locator(".pf-guide-assembly").evaluate((details) => {
    details.open = true;
  });
  await selector.screenshot({
    path: path.join(artifactRoot, "test-node-guide-selector.png"),
  });

  const noScriptContext = await browser.newContext({ javaScriptEnabled: false });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto(`${baseUrl}/hardware/test-node-chassis/`);
  for (const slug of [
    "powkiddy-x55",
    "trimui-brick",
    "trimui-smart-pro",
    "trimui-smart-pro-s",
  ]) {
    assert.equal(
      await noScriptPage.locator(`article a[href$="devices/${slug}/"]`).count(),
      1,
    );
  }
  await noScriptContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(
    `${baseUrl}/hardware/test-node-chassis/?device=trimui-smart-pro-s`,
    { waitUntil: "networkidle" },
  );
  const mobileSelector = mobilePage.locator("[data-test-node-guide-selector]");
  await mobileSelector.locator(".pf-guide-assembly").evaluate((details) => {
    details.open = true;
  });
  const [firstStep, secondStep] = await Promise.all([
    mobileSelector.locator("[data-guide-step]").nth(0).boundingBox(),
    mobileSelector.locator("[data-guide-step]").nth(1).boundingBox(),
  ]);
  assert.ok(firstStep && secondStep && secondStep.y > firstStep.y);
  assert.equal(
    await mobilePage.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await mobileSelector.screenshot({
    path: path.join(artifactRoot, "test-node-guide-selector-mobile.png"),
  });
  await mobileContext.close();

  await context.close();
  console.log(
    "test_node_guide_selector_e2e=pass devices=4 steps=19,17,19,17 nav_entries=1 responsive=pass",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server?.close(resolve) ?? resolve());
}
