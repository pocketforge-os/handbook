import {
  cableAnchorFilename,
  validateCableAnchorFastener,
} from "./cable-anchor-customizer-core.mjs";

function initializeCableAnchorCustomizer(root) {
  const fastenerSelect = root.querySelector("[data-anchor-fastener]");
  const generate = root.querySelector("[data-anchor-generate]");
  const status = root.querySelector("[data-anchor-status]");
  const download = root.querySelector("[data-anchor-download]");
  const preview = root.querySelector("[data-anchor-preview]");
  const hardware = root.querySelector("[data-anchor-hardware]");
  const workerUrl = new URL(root.dataset.workerUrl, document.baseURI);
  let objectUrl;
  let worker;

  function resetDownload() {
    download.hidden = true;
    download.removeAttribute("href");
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = undefined;
    }
  }

  function updateSelection() {
    const fastener = validateCableAnchorFastener(fastenerSelect.value);
    const key = fastener.toLowerCase();
    preview.src = preview.dataset[`${key}Model`];
    preview.poster = preview.dataset[`${key}Poster`];
    preview.alt =
      `Interactive preview of one rail cable anchor with a ${fastener} center hole`;
    hardware.textContent =
      fastener === "M5"
        ? "Use an M5 drop-in T-nut, low-profile M5 screw, and a flat washer no larger than 10 mm OD."
        : "Use an M3 drop-in T-nut, low-profile M3 screw, and a flat washer no larger than 7 mm OD.";
    resetDownload();
    status.textContent = `Ready to generate one ${fastener} anchor.`;
    delete status.dataset.state;
  }

  fastenerSelect.addEventListener("change", updateSelection);
  generate.addEventListener("click", () => {
    const fastener = validateCableAnchorFastener(fastenerSelect.value);
    resetDownload();
    fastenerSelect.disabled = true;
    generate.disabled = true;
    generate.textContent = "Generating…";
    status.dataset.state = "working";
    status.textContent =
      "Starting OpenSCAD locally. The first build downloads about 10 MB.";

    worker?.terminate();
    worker = new Worker(workerUrl, { type: "module" });
    worker.addEventListener("message", (event) => {
      const message = event.data;
      if (message?.type === "status") {
        status.textContent = message.message;
        return;
      }
      if (message?.type === "error") {
        status.dataset.state = "error";
        status.textContent = message.message;
        fastenerSelect.disabled = false;
        generate.disabled = false;
        generate.textContent = "Generate one anchor";
        worker.terminate();
        worker = undefined;
        return;
      }
      if (message?.type === "result") {
        objectUrl = URL.createObjectURL(
          new Blob([message.bytes], { type: "model/stl" }),
        );
        download.href = objectUrl;
        download.download = cableAnchorFilename(message.fastener);
        download.textContent = `Download one ${message.fastener} cable-anchor STL`;
        download.hidden = false;
        status.dataset.state = "ready";
        status.textContent =
          `Ready: one closed ${message.fastener} anchor, ` +
          "32 × 18 × 8.8 mm, support-free.";
        fastenerSelect.disabled = false;
        generate.disabled = false;
        generate.textContent = "Generate again";
        download.focus();
        worker.terminate();
        worker = undefined;
      }
    });
    worker.addEventListener("error", () => {
      status.dataset.state = "error";
      status.textContent =
        "The browser could not run OpenSCAD. Retry or use the command-line source.";
      fastenerSelect.disabled = false;
      generate.disabled = false;
      generate.textContent = "Generate one anchor";
      worker?.terminate();
      worker = undefined;
    });
    worker.postMessage({ type: "generate", fastener });
  });

  window.addEventListener("pagehide", () => {
    worker?.terminate();
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  });
  updateSelection();
}

document
  .querySelectorAll("[data-cable-anchor-customizer]")
  .forEach(initializeCableAnchorCustomizer);
