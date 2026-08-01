const PROFILE_SCHEMA = "pocketforge-test-node-guide-profiles-v1";
const STEP_PATTERN = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function assert(condition, message) {
  if (!condition) {
    throw new TypeError(message);
  }
}

function safeRoute(route, label) {
  assert(
    typeof route === "string" &&
      /^(?:[a-z0-9][a-z0-9-]*\/)+$/.test(route),
    `${label} is not a safe site route.`,
  );
  return route;
}

function sentenceCase(words) {
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
}

function guideWord(word) {
  return { dut: "DUT", io: "I/O", usb: "USB" }[word] ?? word;
}

export function humanizeAssemblyStep(step) {
  const match = STEP_PATTERN.exec(step);
  assert(match, `Invalid assembly step ${JSON.stringify(step)}.`);
  return {
    number: Number.parseInt(match[1], 10),
    title: sentenceCase(match[2].split("-").map(guideWord).join(" ")),
  };
}

export function deviceOptions(profiles) {
  assert(profiles?.schema === PROFILE_SCHEMA, "Guide profile schema changed.");
  assert(
    profiles.devices && typeof profiles.devices === "object",
    "Guide profiles have no devices.",
  );
  return Object.entries(profiles.devices).map(([slug, device]) => {
    assert(
      typeof device?.display_name === "string" && device.display_name,
      `${slug} has no display name.`,
    );
    return { slug, displayName: device.display_name };
  });
}

export function resolveDeviceGuide(profiles, deviceSlug) {
  const options = deviceOptions(profiles);
  assert(
    options.some((option) => option.slug === deviceSlug),
    `Unknown guide device ${JSON.stringify(deviceSlug)}.`,
  );
  const device = profiles.devices[deviceSlug];
  const family = profiles.families?.[device.family];
  const layout = profiles.layouts?.[device.layout];
  const integration = profiles.integration_profiles?.[
    device.integration_profile
  ];
  assert(family, `${deviceSlug} selects an unknown family.`);
  assert(layout, `${deviceSlug} selects an unknown chassis layout.`);
  assert(integration, `${deviceSlug} selects an unknown integration profile.`);

  const layoutRoute = safeRoute(layout.guide_route, `${device.layout} guide route`);
  const stepSlugs = layout.assembly_steps;
  assert(
    Array.isArray(stepSlugs) &&
      stepSlugs.length > 0 &&
      new Set(stepSlugs).size === stepSlugs.length,
    `${device.layout} has an invalid assembly sequence.`,
  );
  const assemblySteps = stepSlugs.map((slug, index) => {
    const step = humanizeAssemblyStep(slug);
    assert(
      step.number === index + 1,
      `${device.layout} assembly step numbers are not contiguous.`,
    );
    return {
      ...step,
      slug,
      route: `${layoutRoute}assemble/${slug}/`,
    };
  });

  const stages = [
    {
      id: "build-sheet",
      label: "Open the resolved build sheet",
      summary: "Confirm the selected holder, layout, qualification, and route.",
      route: safeRoute(device.build_sheet_route, `${deviceSlug} build-sheet route`),
    },
    {
      id: "layout",
      label: "Review the chassis layout",
      summary: "See the finished frame, datums, and layout-specific constraints.",
      route: layoutRoute,
    },
    {
      id: "parts",
      label: "Collect parts and tools",
      summary: "Use the inventory for this exact chassis layout.",
      route: `${layoutRoute}parts/`,
    },
    {
      id: "print",
      label: "Generate and print the selected device pack",
      summary: "Build the registered holder and chassis print beds in the browser.",
      route: safeRoute(device.print_route, `${deviceSlug} print route`),
    },
    {
      id: "cut",
      label: "Cut and label the aluminum",
      summary: "Follow the cut list and tape labels for this layout.",
      route: `${layoutRoute}cut/`,
    },
    {
      id: "assemble",
      label: `Assemble the chassis in ${assemblySteps.length} steps`,
      summary: "Work through the generated ordered step sequence.",
      route: `${layoutRoute}assemble/`,
    },
    {
      id: "verify",
      label: "Verify the finished mechanical build",
      summary: "Record the qualification checks required by this layout.",
      route: `${layoutRoute}verify/`,
    },
    {
      id: "wire-management",
      label: "Route the de-energized harness",
      summary: "Manage wiring only after the frame passes mechanical verification.",
      route: `${layoutRoute}wire-management/`,
    },
    {
      id: "integration",
      label: "Continue to device integration",
      summary: "Follow the registered harness and I/O route for this device family.",
      route: safeRoute(
        integration.guide_route,
        `${device.integration_profile} integration route`,
      ),
    },
  ];

  return {
    deviceSlug,
    displayName: device.display_name,
    familyName: family.display_name,
    holderProfile: family.holder_profile,
    layoutId: device.layout,
    layoutName: layout.display_name,
    qualificationStatus: layout.qualification_status,
    outsideEnvelope: layout.outside_envelope_mm,
    integrationName: integration.display_name,
    integrationStatus: integration.status,
    stages,
    assemblySteps,
  };
}
