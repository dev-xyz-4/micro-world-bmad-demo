#!/usr/bin/env node

import fs from "node:fs";

const EDB_MODE_FILE = ".planning/EDB_MODE";

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const detectActiveMode = () => {
  if (process.env.EDB_MODE === "1" || fs.existsSync(EDB_MODE_FILE)) {
    return {
      label: "EDB Mode",
      targetRoot: "docs/_edb-development-history/",
      targetPathHint: "docs/_edb-development-history/EDB_MINOR_CHANGE_LOG.md",
    };
  }

  return {
    label: "Project Mode",
    targetRoot: "docs/",
    targetPathHint: "docs/bmad/notes/minor-change-log.md",
  };
};

const inferTargetDocScope = (goal) => {
  const signal = normalizeText(goal);

  if (signal.includes("orchestration index")) {
    return "entry/orchestration guidance";
  }

  if (signal.includes("readme")) {
    return "project/readme";
  }

  if (signal.includes("version")) {
    return "engineering/versioning guidance";
  }

  if (signal.includes("policy") || signal.includes("workflow")) {
    return "workflow/policy-adjacent docs scope";
  }

  return "docs-only clarification scope";
};

const buildSteps = () => ([
  {
    step_id: "resolve_target_surface",
    required: true,
    status: "completed",
    output_hint: "target surface resolved",
  },
  {
    step_id: "prepare_docs_prompt_artifact",
    required: true,
    status: "completed",
    output_hint: "docs-only prompt/spec artifact prepared",
  },
  {
    step_id: "save_prompt_artifact",
    required: true,
    confirm_gate: "gate_save",
    status: "awaiting_confirmation",
  },
  {
    step_id: "execute_docs_change",
    required: true,
    confirm_gate: "gate_execute",
    status: "blocked_by_gate",
  },
  {
    step_id: "review_result",
    required: false,
    confirm_gate: "gate_review",
    status: "not_ready",
  },
]);

export const buildP1MinorChangeContract = ({ goal }) => {
  const mode = detectActiveMode();

  if (!mode.targetRoot.startsWith("docs/")) {
    throw new Error("Resolved target root must remain inside docs-only surfaces.");
  }

  return {
    contract_type: "p1_docs_only_minor_change",
    execution_mode: "human_confirmed_sequence",
    target_resolution: {
      mode: mode.label,
      target_kind: "minor_change_docs_target",
      target_root: mode.targetRoot,
      target_path_hint: mode.targetPathHint,
    },
    required_inputs: {
      change_goal: goal,
      active_mode: mode.label,
      target_doc_scope: inferTargetDocScope(goal),
    },
    constraints: [
      "no code changes",
      "no hidden branch creation",
      "no routing/policy/governance changes without reclassification",
    ],
    steps: buildSteps(),
    confirm_gates: {
      active_gate: "gate_save",
      entries: [
        {
          gate_id: "gate_save",
          state: "pending",
          allowed_responses: ["yes", "no", "cancel"],
        },
      ],
    },
    validation: {
      required: [
        "git diff --check",
        "docs-only boundary check",
        "target path sanity",
      ],
      optional: [],
    },
  };
};
