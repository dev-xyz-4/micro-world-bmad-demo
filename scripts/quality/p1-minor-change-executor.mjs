#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const stop = (stopReason, nextHumanAction) => ({
  status: "stopped",
  stop_reason: stopReason,
  next_human_action: nextHumanAction,
});

const validateExecutorInput = (executorInput) => {
  if (!isObject(executorInput)) {
    return "executor input must be an object";
  }

  if (executorInput.result_type !== "route-result") {
    return "executor input must be a route-result";
  }

  if (executorInput.primary_path !== "P1") {
    return "executor input must resolve primary_path P1";
  }

  if (executorInput.workflow_route !== "Minor Change") {
    return "executor input must resolve workflow_route Minor Change";
  }

  if (!isObject(executorInput.action_contract)) {
    return "executor input must include action_contract";
  }

  if (executorInput.action_contract.contract_type !== "p1_docs_only_minor_change") {
    return "executor input must include the p1_docs_only_minor_change contract";
  }

  return null;
};

const resolveWriteTarget = (actionContract) => {
  const targetResolution = actionContract?.target_resolution;

  if (!isObject(targetResolution)) {
    throw new Error("target_resolution must be an object");
  }

  const targetRoot = targetResolution.target_root;
  const targetPathHint = targetResolution.target_path_hint;

  if (!isNonEmptyString(targetRoot) || !isNonEmptyString(targetPathHint)) {
    throw new Error("target root and target path hint must be non-empty strings");
  }

  const normalizedRoot = path.normalize(targetRoot);
  const normalizedPathHint = path.normalize(targetPathHint);

  if (path.isAbsolute(normalizedRoot) || path.isAbsolute(normalizedPathHint)) {
    throw new Error("target resolution must remain repo-relative");
  }

  const repoRoot = process.cwd();
  const rootAbs = path.resolve(repoRoot, normalizedRoot);
  const targetAbs = path.resolve(repoRoot, normalizedPathHint);

  if (!rootAbs.startsWith(path.resolve(repoRoot, "docs"))) {
    throw new Error("resolved target root must remain inside docs-only surfaces");
  }

  if (!targetAbs.startsWith(rootAbs)) {
    throw new Error("resolved target path must remain inside the docs-only target root");
  }

  return {
    rootAbs,
    targetAbs,
    targetPathHint: normalizedPathHint,
  };
};

const buildSimpleArtifactContent = (executorInput) => {
  const contract = executorInput.action_contract;
  const requiredInputs = contract.required_inputs || {};
  const targetResolution = contract.target_resolution || {};

  return [
    "# P1 Minimal Write Artifact",
    "",
    `Goal: ${String(requiredInputs.change_goal || "").trim()}`,
    `Mode: ${String(targetResolution.mode || "").trim()}`,
    `Scope: ${String(requiredInputs.target_doc_scope || "").trim()}`,
    "",
    "Status: first bounded executor-side write proof.",
    "",
  ].join("\n");
};

export const executeP1MinorChangeWrite = (executorInput, branchConfirmation) => {
  const validationError = validateExecutorInput(executorInput);
  if (validationError) {
    return stop(validationError, "Provide a valid emitted P1 / Minor Change contract packet.");
  }

  if (branchConfirmation !== "yes" && branchConfirmation !== "no") {
    return stop(
      "branch confirmation must be yes or no",
      "Answer the mandatory branch gate with yes or no."
    );
  }

  if (branchConfirmation === "no") {
    return stop(
      "branch-confirmed execution is required before repo-tracked writes",
      "Create or switch to a valid branch context before retrying."
    );
  }

  let target;
  try {
    target = resolveWriteTarget(executorInput.action_contract);
  } catch (error) {
    return stop(
      String(error.message || error),
      "Resolve a docs-only target that stays inside the bounded contract surface."
    );
  }

  try {
    fs.mkdirSync(path.dirname(target.targetAbs), { recursive: true });
    fs.writeFileSync(target.targetAbs, buildSimpleArtifactContent(executorInput), "utf8");
  } catch (error) {
    return stop(
      `docs write failed: ${String(error.message || error)}`,
      "Fix the bounded write target or file-system preconditions before retrying."
    );
  }

  return {
    status: "completed",
    written_path: target.targetPathHint,
    next_human_action: "Review the written docs artifact and continue the governed docs workflow.",
  };
};
