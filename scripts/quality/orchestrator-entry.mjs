#!/usr/bin/env node
/**
 * Orchestrator Entry CLI.
 *
 * Emits structured JSON results to stdout.
 * Result classes:
 * - route-result
 * - stop-result
 *
 * Contract validation lives in:
 * scripts/quality/tests/orchestrator-entry.smoke.mjs
 */

const args = process.argv.slice(2);

const usage = [
  "Usage:",
  '  node scripts/quality/orchestrator-entry.mjs --goal "<raw free-text goal>" [--clarify-response "<value>"]...',
  "",
  "Required:",
  "  --goal               Raw free-text goal input",
  "",
  "Optional:",
  "  --clarify-response   Clarification response (repeatable, max 2)",
  "  --help               Show this usage text",
].join("\n");

const fail = (message, details = []) => {
  console.error("RESULT: failure");
  console.error(`ERROR: ${message}`);
  for (const detail of details) {
    console.error(detail);
  }
  process.exit(1);
};

const emitJson = (payload) => {
  console.log(JSON.stringify(payload, null, 2));
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const hasAnyPhrase = (text, phrases) => phrases.some((phrase) => text.includes(phrase));

const classifyHints = (signal) => {
  const docsOnlyExplicit = hasAnyPhrase(signal, ["docs only", "docs-only", "documentation only", "documentation-only"]);
  const docsHint = hasAnyPhrase(signal, [
    "docs",
    "documentation",
    "readme",
    "guide",
    "wording",
    "markdown",
    "typo",
    "clarification",
  ]);
  const smallCodeHint = hasAnyPhrase(signal, [
    "small code",
    "bounded code",
    "small change",
    "small fix",
    "bugfix",
    "fix",
    "refactor",
    "cleanup",
    "chore",
  ]);
  const codeHint = smallCodeHint || hasAnyPhrase(signal, [
    "code",
    "script",
    "function",
    "module",
    "implement",
    "implementation",
    "cli",
    "test",
  ]);
  const featureCapabilityHint = hasAnyPhrase(signal, [
    "new feature",
    "feature capability",
    "new capability",
    "feature implementation",
    "p3",
    "entry mvp",
    "orchestrator entry",
  ]);
  const bmadWorkflowHint = hasAnyPhrase(signal, [
    "bmad",
    "bmad feature",
    "feature workflow",
    "deliver spec",
    "break model analyze deliver",
  ]) || featureCapabilityHint;

  return {
    docsOnlyExplicit,
    docsHint,
    codeHint,
    smallCodeHint,
    featureCapabilityHint,
    bmadWorkflowHint,
  };
};

const resolvePrimaryPath = (hints) => {
  if (hints.docsOnlyExplicit && !hints.codeHint) {
    return "P1";
  }

  if (hints.docsHint && !hints.codeHint) {
    return "P1";
  }

  if (hints.docsHint && hints.codeHint && !hints.smallCodeHint && !hints.featureCapabilityHint) {
    return null;
  }

  if (hints.smallCodeHint) {
    return "P2";
  }

  if (hints.featureCapabilityHint) {
    return "P3";
  }

  if (hints.codeHint) {
    return "P2";
  }

  return null;
};

const resolveWorkflowRoute = (hints) => (hints.bmadWorkflowHint ? "BMAD Feature" : "Minor Change");

const makeClarifyPacket = () => ({
  trigger: "ambiguous-goal-routing",
  missing_conflicting_input: "Goal signal does not deterministically resolve the required routing fields.",
  valid_options: [
    "Docs-only clarification update -> (P1, Minor Change)",
    "Bounded small code change -> (P2, Minor Change)",
    "BMAD feature capability -> (P3, BMAD Feature)",
  ],
  recommendation:
    "Provide one clarify response that explicitly states docs-only, small code change, or BMAD feature capability.",
  next_action_decider: "Operator provides clarification and reruns this CLI.",
  blocker_pointer: "docs/_edb-development-history/features/orchestrator-entry-mvp/questions.md",
});

const normalizePairIfNeeded = (primaryPath, workflowRoute) => {
  if (primaryPath === "P2" && workflowRoute === "BMAD Feature") {
    return {
      primaryPath: "P3",
      workflowRoute,
      normalizationNote:
        "Normalized invalid steady-state pair (P2, BMAD Feature) to (P3, BMAD Feature) before final emission.",
    };
  }

  return {
    primaryPath,
    workflowRoute,
    normalizationNote: null,
  };
};

const nextStepDirection = (primaryPath, workflowRoute) => {
  const key = `${primaryPath}|${workflowRoute}`;
  const mapping = {
    "P1|Minor Change":
      "Minor Change docs-only next step: continue with docs-only Minor Change flow; keep governed Git-/PR path unchanged.",
    "P1|BMAD Feature":
      "BMAD Feature docs-planning next step: continue BMAD artifact workflow at the mode-aware feature root resolved via CODEX_ENTRY.md.",
    "P2|Minor Change":
      "Minor Change small-code next step: continue bounded code-change workflow; keep governed Git-/PR path unchanged.",
    "P3|BMAD Feature":
      "BMAD Feature implementation next step: continue P3 BMAD flow; flow-contract-starter.mjs may be used only as a downstream primitive where applicable.",
  };

  return mapping[key] || null;
};

const parseCli = () => {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage);
    process.exit(0);
  }

  let goal = "";
  const clarifyResponses = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--goal") {
      const value = args[i + 1];
      if (!value || value.startsWith("--")) {
        fail("Missing value for --goal.", [usage]);
      }
      goal = value.trim();
      i += 1;
      continue;
    }

    if (arg === "--clarify-response") {
      const value = args[i + 1];
      if (!value || value.startsWith("--")) {
        fail("Missing value for --clarify-response.", [usage]);
      }
      clarifyResponses.push(value.trim());
      i += 1;
      continue;
    }

    fail(`Unknown argument: ${arg}`, [usage]);
  }

  if (!goal) {
    fail("Missing required argument: --goal.", [usage]);
  }

  if (clarifyResponses.length > 2) {
    fail("Too many --clarify-response values. Maximum allowed is 2.");
  }

  return { goal, clarifyResponses };
};

const main = () => {
  // 1) Parse and validate CLI input.
  const { goal, clarifyResponses } = parseCli();

  // 2) Establish bounded clarify state from supplied goal / clarify responses.
  const clarifyState = {
    max_prompts: 2,
    clarify_attempt_count: clarifyResponses.length,
    goal,
    clarify_responses: clarifyResponses,
  };

  const signal = normalizeText([goal, ...clarifyResponses].join(" "));
  const hints = classifyHints(signal);

  // 3) Resolve internal primary_path.
  const primaryPath = resolvePrimaryPath(hints);
  if (!primaryPath) {
    emitJson({
      result_type: "stop-result",
      unresolved_ambiguity: "Unable to deterministically resolve primary_path from the provided input.",
      clarify_attempt_count: clarifyState.clarify_attempt_count,
      clarify_packet: makeClarifyPacket(),
      next_action: "Provide up to 2 clarify responses and rerun the command.",
    });
    process.exit(1);
  }

  // 4) Resolve visible workflow_route.
  const workflowRoute = resolveWorkflowRoute(hints);

  // 5) Normalize invalid (P2, BMAD Feature) to (P3, BMAD Feature) before emission.
  const normalized = normalizePairIfNeeded(primaryPath, workflowRoute);

  // 6) Emit either route-result or stop-result.
  const direction = nextStepDirection(normalized.primaryPath, normalized.workflowRoute);
  if (!direction) {
    fail(
      `Unsupported steady-state output pair: (${normalized.primaryPath}, ${normalized.workflowRoute}).`
    );
  }

  const routeResult = {
    result_type: "route-result",
    primary_path: normalized.primaryPath,
    workflow_route: normalized.workflowRoute,
    next_step_direction: direction,
  };

  if (normalized.normalizationNote) {
    routeResult.normalization_note = normalized.normalizationNote;
  }

  emitJson(routeResult);
};

main();
