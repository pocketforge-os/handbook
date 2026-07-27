document.querySelectorAll("[data-full-chassis-model]").forEach((viewer) => {
  const shell = viewer.closest(".chassis-model-shell");
  const toggle = shell?.querySelector("[data-chassis-label-toggle]");
  if (!toggle) {
    return;
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const labelsVisible = viewer.dataset.labelsVisible !== "true";
    viewer.dataset.labelsVisible = String(labelsVisible);
    toggle.setAttribute("aria-pressed", String(labelsVisible));
    toggle.textContent = labelsVisible ? "Hide labels" : "Show labels";
  });
});
