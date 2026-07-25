import {
  DEFAULT_LABEL,
  MAX_LABEL_LENGTH,
  nameplateFilename,
  normalizeLabel,
  validateLabel,
} from "./nameplate-customizer-core.mjs";

function initializeCustomizer(root) {
  const form = root.querySelector("[data-nameplate-form]");
  const input = root.querySelector("[data-nameplate-input]");
  const button = root.querySelector("[data-nameplate-submit]");
  const count = root.querySelector("[data-nameplate-count]");
  const preview = root.querySelector("[data-nameplate-preview]");
  const status = root.querySelector("[data-nameplate-status]");
  const download = root.querySelector("[data-nameplate-download]");
  const workerUrl = new URL(root.dataset.workerUrl, document.baseURI);
  let objectUrl;
  let activeWorker;

  function updateInputPresentation() {
    const label = normalizeLabel(input.value);
    const length = Array.from(label).length;
    count.value = String(length);
    preview.textContent = label || DEFAULT_LABEL;
    preview.style.setProperty(
      "--pf-nameplate-font-size",
      `${Math.max(0.78, Math.min(1.4, 25 / Math.max(length, 1)))}rem`,
    );
    input.removeAttribute("aria-invalid");
  }

  function showError(message) {
    status.textContent = message;
    status.dataset.state = "error";
    input.setAttribute("aria-invalid", "true");
    input.focus();
  }

  function resetDownload() {
    download.hidden = true;
    download.removeAttribute("href");
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = undefined;
    }
  }

  input.maxLength = MAX_LABEL_LENGTH;
  updateInputPresentation();
  input.addEventListener("input", updateInputPresentation);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const validation = validateLabel(input.value);
    resetDownload();
    if (!validation.ok) {
      showError(validation.message);
      return;
    }

    input.value = validation.label;
    updateInputPresentation();
    button.disabled = true;
    button.textContent = "Generating…";
    status.dataset.state = "working";
    status.textContent =
      "Starting OpenSCAD locally. The first build downloads about 10 MB.";

    activeWorker?.terminate();
    activeWorker = new Worker(workerUrl, { type: "module" });
    activeWorker.addEventListener("message", (messageEvent) => {
      const message = messageEvent.data;
      if (message?.type === "status") {
        status.textContent = message.message;
        return;
      }
      if (message?.type === "error") {
        showError(message.message);
        button.disabled = false;
        button.textContent = "Generate personalized STL";
        activeWorker.terminate();
        activeWorker = undefined;
        return;
      }
      if (message?.type === "result") {
        const blob = new Blob([message.bytes], { type: "model/stl" });
        objectUrl = URL.createObjectURL(blob);
        download.href = objectUrl;
        download.download = nameplateFilename(validation.label);
        download.textContent = `Download “${validation.label}” STL`;
        download.hidden = false;
        status.dataset.state = "ready";
        status.textContent =
          "Ready. Slice at 100% and change from white to black at Z = 2.4 mm.";
        button.disabled = false;
        button.textContent = "Generate again";
        download.focus();
        activeWorker.terminate();
        activeWorker = undefined;
      }
    });
    activeWorker.addEventListener("error", () => {
      showError(
        "The browser could not start OpenSCAD. Use the canonical STL or the advanced source instructions below.",
      );
      button.disabled = false;
      button.textContent = "Generate personalized STL";
      activeWorker?.terminate();
      activeWorker = undefined;
    });
    activeWorker.postMessage({ type: "generate", label: validation.label });
  });
}

document
  .querySelectorAll("[data-nameplate-customizer]")
  .forEach(initializeCustomizer);
