import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  appendFile,
  copyFile,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const renderer = join(root, "scripts", "render-test-node-cut-plan.py");
const planPath = join(
  root,
  "docs",
  "assets",
  "test-node-chassis-cut-plan.json",
);
const cutListPath = join(
  root,
  "docs",
  "assets",
  "generated",
  "test-node-chassis",
  "topbar",
  "cut-list.csv",
);
const svgPath = join(
  root,
  "docs",
  "assets",
  "test-node-chassis-cut-plan.svg",
);

function render(plan, cutList, output, mode) {
  return spawnSync(
    "python3",
    [
      renderer,
      "--plan",
      plan,
      "--cut-list",
      cutList,
      "--output",
      output,
      mode,
    ],
    { encoding: "utf8" },
  );
}

test("current stock plan regenerates byte-for-byte", async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "pf-cut-plan-"));
  try {
    const output = join(temporaryDirectory, "cut-plan.svg");
    const generated = render(
      planPath,
      cutListPath,
      output,
      "--write",
    );
    assert.equal(generated.status, 0, generated.stderr);
    assert.deepEqual(await readFile(output), await readFile(svgPath));

    const checked = render(planPath, cutListPath, svgPath, "--check");
    assert.equal(checked.status, 0, checked.stderr);
  } finally {
    await rm(temporaryDirectory, { recursive: true });
  }
});

test("rejects inventory drift, stock overrun, and stale SVG output", async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "pf-cut-plan-"));
  try {
    const plan = JSON.parse(await readFile(planPath, "utf8"));
    const missingPlan = structuredClone(plan);
    missingPlan.bars[0].pieces.shift();
    const missingPath = join(temporaryDirectory, "missing.json");
    await writeFile(missingPath, JSON.stringify(missingPlan));
    const missing = render(
      missingPath,
      cutListPath,
      svgPath,
      "--check",
    );
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /active inventory differs/);

    const duplicatePlan = structuredClone(plan);
    duplicatePlan.bars[1].pieces[0].label =
      duplicatePlan.bars[0].pieces[0].label;
    const duplicatePath = join(temporaryDirectory, "duplicate.json");
    await writeFile(duplicatePath, JSON.stringify(duplicatePlan));
    const duplicate = render(
      duplicatePath,
      cutListPath,
      svgPath,
      "--check",
    );
    assert.equal(duplicate.status, 1);
    assert.match(duplicate.stderr, /duplicate active piece label/);

    const overrunPlan = structuredClone(plan);
    overrunPlan.bars[4].pieces[1].length_mm = 800;
    const overrunPath = join(temporaryDirectory, "overrun.json");
    await writeFile(overrunPath, JSON.stringify(overrunPlan));
    const overrun = render(
      overrunPath,
      cutListPath,
      svgPath,
      "--check",
    );
    assert.equal(overrun.status, 1);
    assert.match(overrun.stderr, /overruns stock/);

    const staleSvg = join(temporaryDirectory, "stale.svg");
    await copyFile(svgPath, staleSvg);
    await appendFile(staleSvg, "<!-- stale -->\n");
    const stale = render(
      planPath,
      cutListPath,
      staleSvg,
      "--check",
    );
    assert.equal(stale.status, 1);
    assert.match(stale.stderr, /rendered SVG is stale/);
  } finally {
    await rm(temporaryDirectory, { recursive: true });
  }
});
