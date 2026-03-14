#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const stop = (stopReason, nextHumanAction) => ({
  status: "stopped",
  stop_reason: stopReason,
  next_human_action: nextHumanAction,
});

const BRANCH_ACTIONS = new Set(["continue_on_current_branch", "request_branch_change", "stop"]);

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

const detectBranchState = (repoRoot) => {
  const result = spawnSync("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return {
      branch_name: null,
      branch_class: "branch_state_unknown",
    };
  }

  const branchName = String(result.stdout || "").trim();
  if (!isNonEmptyString(branchName) || branchName === "HEAD") {
    return {
      branch_name: isNonEmptyString(branchName) ? branchName : null,
      branch_class: "branch_state_unknown",
    };
  }

  return {
    branch_name: branchName,
    branch_class: branchName === "main" ? "on_main" : "on_non_main_branch",
  };
};

const buildBranchDecisionResult = (selectedAction, resultingExecutorState, nextHumanAction) => ({
  selected_action: selectedAction,
  resulting_executor_state: resultingExecutorState,
  next_human_action: nextHumanAction,
});

const buildBranchMutationResult = (
  selectedMutationAction,
  resultingExecutorState,
  nextHumanAction,
  targetBranchName
) => ({
  selected_mutation_action: selectedMutationAction,
  resulting_executor_state: resultingExecutorState,
  next_human_action: nextHumanAction,
  target_branch_name: targetBranchName,
});

const stopWithBranchContext = (branchState, branchDecisionResult, stopReason, nextHumanAction) => ({
  ...stop(stopReason, nextHumanAction),
  branch_state: branchState,
  branch_decision_result: branchDecisionResult,
});

const stopWithBranchAndMutationContext = (
  branchState,
  branchDecisionResult,
  branchMutationResult,
  stopReason,
  nextHumanAction
) => ({
  ...stopWithBranchContext(branchState, branchDecisionResult, stopReason, nextHumanAction),
  branch_mutation_result: branchMutationResult,
});

const validateTargetBranchName = (repoRoot, targetBranchName) => {
  if (!isNonEmptyString(targetBranchName)) {
    return "target branch name must be a non-empty string";
  }

  if (targetBranchName === "main") {
    return "target branch name must not be main";
  }

  const result = spawnSync("git", ["check-ref-format", "--branch", targetBranchName], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  return result.status === 0 ? null : "target branch name is malformed or unsupported";
};

const branchAlreadyExists = (repoRoot, targetBranchName) => {
  const result = spawnSync("git", ["show-ref", "--verify", "--quiet", `refs/heads/${targetBranchName}`], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  return result.status === 0;
};

const switchToExistingBranch = (repoRoot, targetBranchName) => {
  const result = spawnSync("git", ["checkout", targetBranchName], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return {
      status: "stopped",
      stop_reason: `branch switch failed: ${String(result.stderr || result.stdout || "").trim() || "git checkout returned non-zero status"}`,
      next_human_action: "Resolve the bounded branch-switch failure before retrying.",
    };
  }

  const branchState = detectBranchState(repoRoot);
  if (branchState.branch_class !== "on_non_main_branch" || branchState.branch_name !== targetBranchName) {
    return {
      status: "stopped",
      stop_reason: "switch-existing did not establish the requested non-main branch safely",
      next_human_action: "Resolve the branch state before retrying the bounded switch-existing path.",
    };
  }

  return {
    status: "completed",
    branch_state: branchState,
    branch_mutation_result: buildBranchMutationResult(
      "switch_to_existing_branch",
      "branch_mutation_applied",
      "Continue the bounded P1 write path on the existing non-main branch.",
      targetBranchName
    ),
  };
};

const createAndSwitchToNewBranch = (repoRoot, targetBranchName) => {
  const result = spawnSync("git", ["checkout", "-b", targetBranchName], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return {
      status: "stopped",
      stop_reason: `branch creation/switch failed: ${String(result.stderr || result.stdout || "").trim() || "git checkout -b returned non-zero status"}`,
      next_human_action: "Resolve the bounded branch-creation failure before retrying.",
    };
  }

  const branchState = detectBranchState(repoRoot);
  if (branchState.branch_class !== "on_non_main_branch" || branchState.branch_name !== targetBranchName) {
    return {
      status: "stopped",
      stop_reason: "branch mutation did not establish the requested non-main branch safely",
      next_human_action: "Resolve the branch state before retrying the bounded mutation path.",
    };
  }

  return {
    status: "completed",
    branch_state: branchState,
    branch_mutation_result: buildBranchMutationResult(
      "create_and_switch_to_new_branch",
      "branch_mutation_applied",
      "Continue the bounded P1 write path on the newly created non-main branch.",
      targetBranchName
    ),
  };
};

const isBlockedMainBranchMutationPath = (branchState, operatorDecision) =>
  branchState.branch_class === "on_main" && operatorDecision === "request_branch_change";

const isSafeNonMainAdditionalNewBranchPath = (branchState, operatorDecision) =>
  branchState.branch_class === "on_non_main_branch" && operatorDecision === "request_branch_change";

const resolveBranchDecision = (branchState, operatorDecision) => {
  if (!BRANCH_ACTIONS.has(operatorDecision)) {
    return stopWithBranchContext(
      branchState,
      null,
      "branch decision must be continue_on_current_branch, request_branch_change, or stop",
      "Choose a bounded branch action before retrying."
    );
  }

  if (branchState.branch_class === "branch_state_unknown") {
    return stopWithBranchContext(
      branchState,
      buildBranchDecisionResult(
        "stop",
        "stopped",
        "Resolve the current Git branch state before retrying the repo-tracked P1 write."
      ),
      "git branch state could not be determined safely",
      "Resolve the current Git branch state before retrying the repo-tracked P1 write."
    );
  }

  if (branchState.branch_class === "on_main") {
    if (operatorDecision === "request_branch_change") {
      return stopWithBranchContext(
        branchState,
        buildBranchDecisionResult(
          "request_branch_change",
          "awaiting_branch_change",
          "Create or switch to a non-main branch before retrying."
        ),
        "repo-tracked P1 writes cannot continue directly on main",
        "Create or switch to a non-main branch before retrying."
      );
    }

    return stopWithBranchContext(
      branchState,
      buildBranchDecisionResult("stop", "stopped", "Stop the current sequence or request branch change."),
      "repo-tracked P1 writes cannot continue directly on main",
      "Stop the current sequence or request branch change."
    );
  }

  if (operatorDecision === "continue_on_current_branch") {
    return {
      branch_state: branchState,
      branch_decision_result: buildBranchDecisionResult(
        "continue_on_current_branch",
        "branch_safe_continue",
        "Continue the bounded P1 write path on the current non-main branch."
      ),
    };
  }

  if (operatorDecision === "request_branch_change") {
    return stopWithBranchContext(
      branchState,
      buildBranchDecisionResult(
        "request_branch_change",
        "awaiting_branch_change",
        "Create or switch to the intended branch before retrying."
      ),
      "branch change requested before repo-tracked P1 write continuation",
      "Create or switch to the intended branch before retrying."
    );
  }

  return stopWithBranchContext(
    branchState,
    buildBranchDecisionResult("stop", "stopped", "Stop the current sequence."),
    "operator selected stop",
    "Stop the current sequence."
  );
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

export const executeP1MinorChangeWrite = (executorInput, operatorDecision, targetBranchName = null) => {
  const validationError = validateExecutorInput(executorInput);
  if (validationError) {
    return stop(validationError, "Provide a valid emitted P1 / Minor Change contract packet.");
  }

  const repoRoot = process.cwd();
  const branchState = detectBranchState(repoRoot);
  let branchDecisionOutcome;

  const isSupportedTargetBranchPath = isBlockedMainBranchMutationPath(branchState, operatorDecision) ||
    isSafeNonMainAdditionalNewBranchPath(branchState, operatorDecision);

  if (isNonEmptyString(targetBranchName) && !isSupportedTargetBranchPath) {
    return stopWithBranchAndMutationContext(
      branchState,
      buildBranchDecisionResult(
        BRANCH_ACTIONS.has(operatorDecision) ? operatorDecision : "stop",
        "stopped",
        "Use the bounded target branch name input only with request_branch_change on main or on a safe non-main branch."
      ),
      buildBranchMutationResult(
        "create_and_switch_to_new_branch",
        "stopped",
        "Use the bounded target branch name input only with request_branch_change on main or on a safe non-main branch.",
        targetBranchName
      ),
      "target branch name is only supported for the bounded branch-mutation paths on main or safe non-main",
      "Use the bounded target branch name input only with request_branch_change on main or on a safe non-main branch."
    );
  }

  if (isBlockedMainBranchMutationPath(branchState, operatorDecision)) {
    const awaitingBranchChangeDecision = buildBranchDecisionResult(
      "request_branch_change",
      "awaiting_branch_change",
      "Provide a target branch name and retry the bounded branch-mutation path."
    );

    if (!isNonEmptyString(targetBranchName)) {
      return stopWithBranchContext(
        branchState,
        awaitingBranchChangeDecision,
        "target branch name is required for the bounded create-and-switch path on main",
        "Provide a target branch name and retry the bounded branch-mutation path."
      );
    }

    const targetBranchNameError = validateTargetBranchName(repoRoot, targetBranchName);
    if (targetBranchNameError) {
      return stopWithBranchAndMutationContext(
        branchState,
        awaitingBranchChangeDecision,
        buildBranchMutationResult(
          branchAlreadyExists(repoRoot, targetBranchName)
            ? "switch_to_existing_branch"
            : "create_and_switch_to_new_branch",
          "stopped",
          "Provide a valid non-main target branch name before retrying.",
          targetBranchName
        ),
        targetBranchNameError,
        "Provide a valid non-main target branch name before retrying."
      );
    }

    const branchMutationOutcome = branchAlreadyExists(repoRoot, targetBranchName)
      ? switchToExistingBranch(repoRoot, targetBranchName)
      : createAndSwitchToNewBranch(repoRoot, targetBranchName);
    if (branchMutationOutcome.status === "stopped") {
      return stopWithBranchAndMutationContext(
        branchState,
        awaitingBranchChangeDecision,
        buildBranchMutationResult(
          branchAlreadyExists(repoRoot, targetBranchName)
            ? "switch_to_existing_branch"
            : "create_and_switch_to_new_branch",
          "stopped",
          branchMutationOutcome.next_human_action,
          targetBranchName
        ),
        branchMutationOutcome.stop_reason,
        branchMutationOutcome.next_human_action
      );
    }

    branchDecisionOutcome = {
      branch_state: branchMutationOutcome.branch_state,
      branch_decision_result: buildBranchDecisionResult(
        "request_branch_change",
        "branch_safe_continue",
        "Continue the bounded P1 write path on the newly created non-main branch."
      ),
      branch_mutation_result: branchMutationOutcome.branch_mutation_result,
    };
  } else if (isSafeNonMainAdditionalNewBranchPath(branchState, operatorDecision)) {
    const awaitingBranchChoiceDecision = buildBranchDecisionResult(
      "request_branch_change",
      "awaiting_branch_change",
      "Provide a new target branch name and retry the bounded additional-new-branch path."
    );

    if (!isNonEmptyString(targetBranchName)) {
      return stopWithBranchContext(
        branchState,
        awaitingBranchChoiceDecision,
        "target branch name is required for the bounded additional-new-branch path on a safe non-main branch",
        "Provide a new target branch name and retry the bounded additional-new-branch path."
      );
    }

    const targetBranchNameError = validateTargetBranchName(repoRoot, targetBranchName);
    if (targetBranchNameError) {
      return stopWithBranchAndMutationContext(
        branchState,
        awaitingBranchChoiceDecision,
        buildBranchMutationResult(
          "create_and_switch_to_new_branch",
          "stopped",
          "Provide a valid new non-main target branch name before retrying.",
          targetBranchName
        ),
        targetBranchNameError,
        "Provide a valid new non-main target branch name before retrying."
      );
    }

    if (branchAlreadyExists(repoRoot, targetBranchName)) {
      return stopWithBranchAndMutationContext(
        branchState,
        awaitingBranchChoiceDecision,
        buildBranchMutationResult(
          "create_and_switch_to_new_branch",
          "stopped",
          "Provide a new target branch name that does not already exist before retrying.",
          targetBranchName
        ),
        "target branch already exists; the bounded safe non-main path only supports creating one additional new branch",
        "Provide a new target branch name that does not already exist before retrying."
      );
    }

    const branchMutationOutcome = createAndSwitchToNewBranch(repoRoot, targetBranchName);
    if (branchMutationOutcome.status === "stopped") {
      return stopWithBranchAndMutationContext(
        branchState,
        awaitingBranchChoiceDecision,
        buildBranchMutationResult(
          "create_and_switch_to_new_branch",
          "stopped",
          branchMutationOutcome.next_human_action,
          targetBranchName
        ),
        branchMutationOutcome.stop_reason,
        branchMutationOutcome.next_human_action
      );
    }

    branchDecisionOutcome = {
      branch_state: branchMutationOutcome.branch_state,
      branch_decision_result: buildBranchDecisionResult(
        "request_branch_change",
        "branch_safe_continue",
        "Continue the bounded P1 write path on the newly created non-main branch."
      ),
      branch_mutation_result: branchMutationOutcome.branch_mutation_result,
    };
  } else {
    branchDecisionOutcome = resolveBranchDecision(branchState, operatorDecision);
    if (branchDecisionOutcome.status === "stopped") {
      return branchDecisionOutcome;
    }
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
    branch_state: branchDecisionOutcome.branch_state,
    branch_decision_result: branchDecisionOutcome.branch_decision_result,
    ...(branchDecisionOutcome.branch_mutation_result
      ? { branch_mutation_result: branchDecisionOutcome.branch_mutation_result }
      : {}),
    written_path: target.targetPathHint,
    next_human_action: "Review the written docs artifact and continue the governed docs workflow.",
  };
};
