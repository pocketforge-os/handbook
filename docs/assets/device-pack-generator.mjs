import {
  createPackArchive,
  loadVerifiedCatalog,
  selectDeviceMode,
} from "./device-pack-generator-core.mjs";

const MODE_LABELS = {
  coupon: "Fit coupon · 1 file",
  retrofit: "Device retrofit · 6 files",
  full: "Complete chassis · 12 files",
};

function initializeGenerator(root) {
  const deviceSelect = root.querySelector("[data-pack-device]");
  const modeSelect = root.querySelector("[data-pack-mode]");
  const qualification = root.querySelector("[data-pack-qualification]");
  const inventory = root.querySelector("[data-pack-inventory]");
  const status = root.querySelector("[data-pack-status]");
  const progress = root.querySelector("[data-pack-progress]");
  const generateAll = root.querySelector("[data-pack-generate-all]");
  const cancel = root.querySelector("[data-pack-cancel]");
  const packDownload = root.querySelector("[data-pack-download]");
  const catalogUrl = new URL(root.dataset.catalogUrl, document.baseURI);
  const checksumsUrl = new URL(root.dataset.checksumsUrl, document.baseURI);
  const baselineUrl = new URL(root.dataset.baselineUrl, document.baseURI);
  const workerUrl = new URL(root.dataset.workerUrl, document.baseURI);
  const runtimeUrl = new URL(root.dataset.runtimeUrl, document.baseURI);
  const fontUrl = new URL(root.dataset.fontUrl, document.baseURI);
  const fontConfigUrl = new URL(root.dataset.fontConfigUrl, document.baseURI);
  const objectUrls = new Set();
  let catalog;
  let activeWorker;
  let activeSelection;
  let generated = new Map();

  function setStatus(message, state = "") {
    status.textContent = message;
    if (state) {
      status.dataset.state = state;
    } else {
      delete status.dataset.state;
    }
  }

  function releaseObjectUrls() {
    for (const url of objectUrls) {
      URL.revokeObjectURL(url);
    }
    objectUrls.clear();
  }

  function resetDownloads() {
    releaseObjectUrls();
    generated = new Map();
    packDownload.hidden = true;
    packDownload.removeAttribute("href");
  }

  function setBusy(busy) {
    deviceSelect.disabled = busy;
    modeSelect.disabled = busy;
    generateAll.disabled = busy;
    inventory
      .querySelectorAll("[data-pack-generate-one]")
      .forEach((button) => {
        button.disabled = busy;
      });
    cancel.hidden = !busy;
    progress.hidden = !busy;
    root.setAttribute("aria-busy", String(busy));
  }

  function artifactFilename(artifact) {
    return `pocketforge-${activeSelection.device.slug}-${artifact.output.replaceAll("/", "-")}`;
  }

  function showArtifactDownload(artifact, bytes) {
    const row = inventory.querySelector(
      `[data-artifact-id="${CSS.escape(artifact.id)}"]`,
    );
    const link = row.querySelector("[data-pack-artifact-download]");
    const url = URL.createObjectURL(new Blob([bytes], { type: "model/stl" }));
    objectUrls.add(url);
    link.href = url;
    link.download = artifactFilename(artifact);
    link.hidden = false;
    link.textContent = "Download STL";
    row.dataset.generated = "true";
  }

  function qualificationMessage(device, modeName, mode) {
    const layout = device.layout;
    if (modeName === "coupon") {
      return {
        state: "coupon",
        heading: "Fit-check output",
        copy:
          "This one-file coupon is intentionally non-production. Print it before " +
          "committing to the carrier and hook set.",
      };
    }
    if (mode.production_eligible) {
      return {
        state: "qualified",
        heading: "Physically qualified pack",
        copy:
          `${device.profile.id} and ${layout.id} are qualified. ` +
          `Acceptance: ${layout.qualification.acceptance_ref}.`,
      };
    }
    return {
      state: "candidate",
      heading: "Prototype pack · not production-qualified",
      copy:
        `The source marks this output ${mode.nonproduction_reasons.join(", ")}. ` +
        `Physical acceptance remains tracked by ` +
        `${layout.qualification.acceptance_ref}; generating files here does not ` +
        "qualify them.",
    };
  }

  function renderSelection() {
    resetDownloads();
    const selection = selectDeviceMode(
      catalog,
      deviceSelect.value,
      modeSelect.value,
    );
    activeSelection = {
      ...selection,
      modeName: modeSelect.value,
    };
    const notice = qualificationMessage(
      selection.device,
      modeSelect.value,
      selection.mode,
    );
    qualification.dataset.state = notice.state;
    qualification.replaceChildren();
    const heading = document.createElement("strong");
    heading.textContent = notice.heading;
    const copy = document.createElement("span");
    copy.textContent = notice.copy;
    qualification.append(heading, copy);

    inventory.replaceChildren();
    for (const artifact of selection.mode.artifacts) {
      const row = document.createElement("article");
      row.className = "pf-pack-artifact";
      row.dataset.artifactId = artifact.id;

      const copyBlock = document.createElement("div");
      const title = document.createElement("h4");
      title.textContent = artifact.role;
      const path = document.createElement("code");
      path.textContent = artifact.output;
      const print = document.createElement("p");
      print.textContent =
        `${artifact.print.material} · 100% · supports off` +
        (artifact.print.notes.length
          ? ` · ${artifact.print.notes.join(" ")}`
          : "");
      copyBlock.append(title, path, print);

      const actions = document.createElement("div");
      actions.className = "pf-pack-artifact__actions";
      const generate = document.createElement("button");
      generate.type = "button";
      generate.dataset.packGenerateOne = "";
      generate.textContent = "Generate";
      generate.addEventListener("click", () =>
        startGeneration([artifact.id], false));
      const download = document.createElement("a");
      download.dataset.packArtifactDownload = "";
      download.hidden = true;
      actions.append(generate, download);
      row.append(copyBlock, actions);
      inventory.append(row);
    }

    const count = selection.mode.artifacts.length;
    generateAll.textContent =
      count === 1 ? "Generate coupon ZIP" : `Generate all ${count} files`;
    setStatus(
      "Ready. OpenSCAD loads only when you generate a part or pack.",
    );
    root.dataset.state = notice.state;
  }

  async function finishGeneration(wholePack) {
    if (wholePack) {
      setStatus("Writing the deterministic ZIP and checksums…", "working");
      const archive = await createPackArchive(
        catalog,
        activeSelection.device.slug,
        activeSelection.modeName,
        generated,
      );
      const url = URL.createObjectURL(
        new Blob([archive.bytes], { type: "application/zip" }),
      );
      objectUrls.add(url);
      packDownload.href = url;
      packDownload.download = archive.filename;
      packDownload.textContent = `Download ${archive.filename}`;
      packDownload.hidden = false;
      packDownload.focus();
      setStatus(
        `Ready: ${generated.size} verified STL files, manifest, and checksums.`,
        "ready",
      );
    } else {
      setStatus("Ready. The generated STL passed geometry verification.", "ready");
    }
  }

  function stopWorker() {
    activeWorker?.terminate();
    activeWorker = undefined;
    setBusy(false);
  }

  function failGeneration(message) {
    stopWorker();
    setStatus(message, "error");
  }

  function startGeneration(artifactIds, wholePack) {
    if (activeWorker) {
      return;
    }
    resetDownloads();
    progress.max = artifactIds.length;
    progress.value = 0;
    setBusy(true);
    setStatus(
      "Loading the local CAD engine and verifying source hashes…",
      "working",
    );
    const artifacts = new Map(
      activeSelection.mode.artifacts.map((artifact) => [artifact.id, artifact]),
    );
    activeWorker = new Worker(workerUrl, { type: "module" });
    activeWorker.addEventListener("message", async (event) => {
      const message = event.data;
      try {
        if (message?.type === "status") {
          setStatus(message.message, "working");
          if (Number.isInteger(message.current)) {
            progress.value = message.current - 1;
          }
          return;
        }
        if (message?.type === "artifact") {
          const artifact = artifacts.get(message.artifactId);
          if (!artifact) {
            throw new Error("The worker returned an unexpected artifact.");
          }
          const bytes = new Uint8Array(message.bytes);
          generated.set(artifact.id, {
            artifact,
            bytes,
            metrics: message.metrics,
          });
          showArtifactDownload(artifact, bytes);
          progress.value = generated.size;
          return;
        }
        if (message?.type === "error") {
          failGeneration(message.message);
          return;
        }
        if (message?.type === "done") {
          stopWorker();
          await finishGeneration(wholePack);
        }
      } catch (error) {
        failGeneration(
          error instanceof Error ? error.message : "Could not finish the pack.",
        );
      }
    });
    activeWorker.addEventListener("error", () => {
      failGeneration(
        "The browser could not run OpenSCAD. Retry, or use the command-line " +
          "fallback below.",
      );
    });
    activeWorker.postMessage({
      type: "generate",
      catalogUrl: catalogUrl.href,
      checksumsUrl: checksumsUrl.href,
      baselineUrl: baselineUrl.href,
      runtimeUrl: runtimeUrl.href,
      fontUrl: fontUrl.href,
      fontConfigUrl: fontConfigUrl.href,
      deviceSlug: activeSelection.device.slug,
      mode: activeSelection.modeName,
      artifactIds,
    });
  }

  async function load() {
    try {
      catalog = await loadVerifiedCatalog(catalogUrl, checksumsUrl);
      deviceSelect.replaceChildren();
      modeSelect.replaceChildren();
      for (const device of catalog.devices) {
        const option = document.createElement("option");
        option.value = device.slug;
        option.textContent = device.display_name;
        deviceSelect.append(option);
      }
      for (const mode of catalog.modes) {
        const option = document.createElement("option");
        option.value = mode;
        option.textContent = MODE_LABELS[mode];
        modeSelect.append(option);
      }
      const requestedDevice = root.dataset.defaultDevice;
      deviceSelect.value = catalog.devices.some(
        (device) => device.slug === requestedDevice,
      )
        ? requestedDevice
        : catalog.devices[0].slug;
      modeSelect.value = "full";
      deviceSelect.disabled = false;
      modeSelect.disabled = false;
      generateAll.disabled = false;
      deviceSelect.addEventListener("change", renderSelection);
      modeSelect.addEventListener("change", renderSelection);
      generateAll.addEventListener("click", () =>
        startGeneration(
          activeSelection.mode.artifacts.map((artifact) => artifact.id),
          true,
        ));
      cancel.addEventListener("click", () => {
        stopWorker();
        setStatus(
          generated.size
            ? `Cancelled after ${generated.size} file(s); completed downloads remain available.`
            : "Generation cancelled.",
        );
      });
      renderSelection();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not load the device-pack catalog.",
        "error",
      );
      root.dataset.state = "error";
    }
  }

  window.addEventListener("pagehide", () => {
    activeWorker?.terminate();
    releaseObjectUrls();
  });
  load();
}

document
  .querySelectorAll("[data-device-pack-generator]")
  .forEach(initializeGenerator);
