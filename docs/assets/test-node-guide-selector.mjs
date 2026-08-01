import {
  deviceOptions,
  resolveDeviceGuide,
} from "./test-node-guide-selector-core.mjs";

function element(tagName, attributes = {}, text = "") {
  const node = document.createElement(tagName);
  for (const [name, value] of Object.entries(attributes)) {
    if (name === "class") {
      node.className = value;
    } else if (name.startsWith("data-")) {
      node.setAttribute(name, value);
    } else {
      node[name] = value;
    }
  }
  if (text) {
    node.textContent = text;
  }
  return node;
}

function qualificationLabel(status) {
  if (status === "physically_qualified") {
    return "PHYSICALLY QUALIFIED";
  }
  if (status === "candidate") {
    return "CANDIDATE · OWNER GATE REQUIRED";
  }
  return status.replaceAll("_", " ").toUpperCase();
}

function dimensionsLabel(envelope) {
  return `${envelope.width} W × ${envelope.depth} D × approximately ${envelope.height} H mm`;
}

function routeLink(stage, siteRoot) {
  const link = element(
    "a",
    { href: new URL(stage.route, siteRoot).href },
    stage.label,
  );
  const summary = element("small", {}, stage.summary);
  const wrapper = element("div", { class: "pf-guide-route__copy" });
  wrapper.append(link, summary);
  return wrapper;
}

function renderGuide(panel, guide, siteRoot) {
  const header = element("header", { class: "pf-guide-result__header" });
  header.append(
    element(
      "span",
      {
        class: "pf-guide-result__qualification",
        "data-guide-qualification": guide.qualificationStatus,
      },
      qualificationLabel(guide.qualificationStatus),
    ),
    element("h2", { "data-guide-heading": "" }, `${guide.displayName} build guide`),
    element(
      "p",
      {},
      `${guide.layoutName} · ${dimensionsLabel(guide.outsideEnvelope)}`,
    ),
  );

  const metadata = element("dl", { class: "pf-guide-result__metadata" });
  for (const [term, description] of [
    ["DUT", guide.displayName],
    ["Holder", `${guide.familyName} · ${guide.holderProfile}`],
    ["Chassis", `${guide.layoutName} · ${guide.layoutId}`],
    ["Integration", `${guide.integrationName} · ${guide.integrationStatus}`],
  ]) {
    metadata.append(element("dt", {}, term), element("dd", {}, description));
  }

  const routeHeading = element("h3", {}, "Your generated instruction path");
  const route = element("ol", {
    class: "pf-guide-route",
    "data-guide-route": "",
  });
  for (const stage of guide.stages) {
    const item = element("li", { "data-guide-stage": stage.id });
    item.append(routeLink(stage, siteRoot));
    if (stage.id === "assemble") {
      const details = element("details", { class: "pf-guide-assembly" });
      details.append(
        element(
          "summary",
          {},
          `Show all ${guide.assemblySteps.length} assembly steps`,
        ),
      );
      const steps = element("ol", {
        class: "pf-step-list pf-guide-assembly__steps",
        "data-guide-assembly-steps": "",
      });
      for (const step of guide.assemblySteps) {
        const stepItem = element("li", {
          "data-guide-step": step.slug,
        });
        const link = element("a", {
          href: new URL(step.route, siteRoot).href,
        });
        link.append(element("strong", {}, step.title));
        stepItem.append(link);
        steps.append(stepItem);
      }
      details.append(steps);
      item.append(details);
    }
    route.append(item);
  }

  panel.replaceChildren(header, metadata, routeHeading, route);
  panel.hidden = false;
}

async function initialize(root) {
  const select = root.querySelector("[data-guide-device-select]");
  const status = root.querySelector("[data-guide-status]");
  const panel = root.querySelector("[data-guide-result]");
  if (!(select instanceof HTMLSelectElement) || !status || !panel) {
    throw new Error("Test-node guide selector markup is incomplete.");
  }

  const profilesUrl = new URL(root.dataset.profilesUrl, document.baseURI);
  const siteRoot = new URL("../", profilesUrl);
  const response = await fetch(profilesUrl);
  if (!response.ok) {
    throw new Error(`Guide profiles returned HTTP ${response.status}.`);
  }
  const profiles = await response.json();
  for (const option of deviceOptions(profiles)) {
    select.append(element("option", { value: option.slug }, option.displayName));
  }
  select.disabled = false;

  const choose = (deviceSlug, updateUrl) => {
    if (!deviceSlug) {
      panel.hidden = true;
      panel.replaceChildren();
      status.textContent = "Choose the DUT to generate its exact build path.";
      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.delete("device");
        window.history.replaceState({}, "", url);
      }
      return;
    }
    const guide = resolveDeviceGuide(profiles, deviceSlug);
    renderGuide(panel, guide, siteRoot);
    status.textContent =
      `${guide.displayName} selected: ${guide.assemblySteps.length} assembly steps generated.`;
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("device", deviceSlug);
      window.history.replaceState({}, "", url);
    }
  };

  select.addEventListener("change", () => choose(select.value, true));
  const requestedDevice = new URL(window.location.href).searchParams.get("device");
  if (requestedDevice && [...select.options].some(({ value }) => value === requestedDevice)) {
    select.value = requestedDevice;
    choose(requestedDevice, false);
  } else {
    choose("", false);
  }
}

for (const root of document.querySelectorAll("[data-test-node-guide-selector]")) {
  initialize(root).catch((error) => {
    const status = root.querySelector("[data-guide-status]");
    if (status) {
      status.textContent = `The guide selector could not load: ${error.message}`;
      status.dataset.state = "error";
    }
  });
}
