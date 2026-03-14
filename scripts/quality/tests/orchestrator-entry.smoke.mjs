#!/usr/bin/env node
/**
 * Smoke test for the Orchestrator Entry CLI JSON output contract.
 *
 * Validates the structured stdout contract emitted by:
 * scripts/quality/orchestrator-entry.mjs
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { executeP1MinorChangeWrite } from "../p1-minor-change-executor.mjs";

const repoRoot = process.cwd();
const cliPath = path.join(repoRoot, "scripts/quality/orchestrator-entry.mjs");

const failures = [];
let checksRun = 0;

const shQuote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;

const runCli = (args) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "orchestrator-entry-smoke-"));
  const outPath = path.join(tempDir, "stdout.txt");
  const errPath = path.join(tempDir, "stderr.txt");
  const statusPath = path.join(tempDir, "status.txt");

  const command = [
    shQuote(process.execPath),
    shQuote(cliPath),
    ...args.map(shQuote),
    ">",
    shQuote(outPath),
    "2>",
    shQuote(errPath),
    ";",
    "printf",
    "'%s'",
    "$?",
    ">",
    shQuote(statusPath),
  ].join(" ");

  // Note: in this environment, spawnSync may report EPERM while still running the child.
  spawnSync("/bin/sh", ["-lc", command], { encoding: "utf8" });

  const stdout = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
  const stderr = fs.existsSync(errPath) ? fs.readFileSync(errPath, "utf8") : "";
  const rawStatus = fs.existsSync(statusPath) ? fs.readFileSync(statusPath, "utf8").trim() : "";
  const status = rawStatus === "" ? 1 : Number.parseInt(rawStatus, 10);

  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {
    // best-effort cleanup only
  }

  return { status, stdout, stderr };
};

const expect = (condition, message) => {
  checksRun += 1;
  if (!condition) {
    failures.push(message);
  }
};

const parseJsonStdout = (result, label) => {
  try {
    return JSON.parse((result.stdout || "").trim());
  } catch (error) {
    failures.push(`${label}: expected JSON stdout but failed to parse (${String(error)})`);
    return null;
  }
};

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isAllowedBranchClass = (value) =>
  value === "on_main" || value === "on_non_main_branch" || value === "branch_state_unknown";
const isAllowedBranchAction = (value) =>
  value === "continue_on_current_branch" || value === "request_branch_change" || value === "stop";
const isAllowedExecutorState = (value) =>
  value === "branch_safe_continue" || value === "awaiting_branch_change" || value === "stopped";
const isAllowedBranchMutationState = (value) => value === "branch_mutation_applied" || value === "stopped";
const isAllowedBranchMutationAction = (value) =>
  value === "create_and_switch_to_new_branch" || value === "switch_to_existing_branch";

const expectNonEmptyStringField = (object, field, label) => {
  expect(isNonEmptyString(object?.[field]), `${label}: expected non-empty string field "${field}"`);
};

const expectRouteResultShape = (payload, label, { requireNormalizationNote = false } = {}) => {
  expect(payload.result_type === "route-result", `${label}: expected result_type=route-result`);
  expectNonEmptyStringField(payload, "primary_path", label);
  expectNonEmptyStringField(payload, "workflow_route", label);
  expectNonEmptyStringField(payload, "next_step_direction", label);

  if (requireNormalizationNote) {
    expectNonEmptyStringField(payload, "normalization_note", label);
  } else if (payload.normalization_note !== undefined) {
    expectNonEmptyStringField(payload, "normalization_note", label);
  }
};

const expectStopResultShape = (payload, label) => {
  expect(payload.result_type === "stop-result", `${label}: expected result_type=stop-result`);
  expectNonEmptyStringField(payload, "unresolved_ambiguity", label);
  expect(typeof payload.clarify_attempt_count === "number", `${label}: expected numeric clarify_attempt_count`);
  expectNonEmptyStringField(payload, "next_action", label);
  expect(isObject(payload.clarify_packet), `${label}: expected clarify_packet object`);

  const packet = payload.clarify_packet || {};
  expectNonEmptyStringField(packet, "trigger", `${label} clarify_packet`);
  expectNonEmptyStringField(packet, "missing_conflicting_input", `${label} clarify_packet`);
  expect(
    Array.isArray(packet.valid_options) && packet.valid_options.length >= 1 && packet.valid_options.length <= 3,
    `${label} clarify_packet: expected valid_options array length 1..3`
  );
  expectNonEmptyStringField(packet, "recommendation", `${label} clarify_packet`);
  expectNonEmptyStringField(packet, "next_action_decider", `${label} clarify_packet`);
  expectNonEmptyStringField(packet, "blocker_pointer", `${label} clarify_packet`);
};

const expectP1ActionContractShape = (payload, label) => {
  expect(isObject(payload.action_contract), `${label}: expected action_contract object`);

  const contract = payload.action_contract || {};
  expect(contract.contract_type === "p1_docs_only_minor_change", `${label}: expected P1 contract_type`);
  expect(
    contract.execution_mode === "human_confirmed_sequence",
    `${label}: expected human_confirmed_sequence execution_mode`
  );
  expect(isObject(contract.target_resolution), `${label}: expected target_resolution object`);
  expect(isObject(contract.required_inputs), `${label}: expected required_inputs object`);
  expect(Array.isArray(contract.constraints), `${label}: expected constraints array`);
  expect(Array.isArray(contract.steps), `${label}: expected steps array`);
  expect(isObject(contract.confirm_gates), `${label}: expected confirm_gates object`);
  expect(isObject(contract.validation), `${label}: expected validation object`);

  const targetResolution = contract.target_resolution || {};
  expectNonEmptyStringField(targetResolution, "mode", `${label} target_resolution`);
  expectNonEmptyStringField(targetResolution, "target_kind", `${label} target_resolution`);
  expectNonEmptyStringField(targetResolution, "target_root", `${label} target_resolution`);
  expectNonEmptyStringField(targetResolution, "target_path_hint", `${label} target_resolution`);

  const requiredInputs = contract.required_inputs || {};
  expectNonEmptyStringField(requiredInputs, "change_goal", `${label} required_inputs`);
  expectNonEmptyStringField(requiredInputs, "active_mode", `${label} required_inputs`);
  expectNonEmptyStringField(requiredInputs, "target_doc_scope", `${label} required_inputs`);

  expect(
    contract.constraints.includes("no code changes"),
    `${label}: expected docs-only no-code constraint`
  );

  const stepIds = Array.isArray(contract.steps) ? contract.steps.map((step) => step.step_id) : [];
  expect(
    JSON.stringify(stepIds) ===
      JSON.stringify([
        "resolve_target_surface",
        "prepare_docs_prompt_artifact",
        "save_prompt_artifact",
        "execute_docs_change",
        "review_result",
      ]),
    `${label}: expected bounded P1 step sequence`
  );

  const saveStep = Array.isArray(contract.steps)
    ? contract.steps.find((step) => step.step_id === "save_prompt_artifact")
    : null;
  const executeStep = Array.isArray(contract.steps)
    ? contract.steps.find((step) => step.step_id === "execute_docs_change")
    : null;
  const reviewStep = Array.isArray(contract.steps)
    ? contract.steps.find((step) => step.step_id === "review_result")
    : null;

  expect(saveStep?.confirm_gate === "gate_save", `${label}: expected gate_save on save step`);
  expect(saveStep?.status === "awaiting_confirmation", `${label}: expected awaiting_confirmation on save step`);
  expect(executeStep?.confirm_gate === "gate_execute", `${label}: expected gate_execute on execute step`);
  expect(executeStep?.status === "blocked_by_gate", `${label}: expected blocked_by_gate on execute step`);
  expect(reviewStep?.confirm_gate === "gate_review", `${label}: expected gate_review on review step`);
  expect(reviewStep?.required === false, `${label}: expected optional review step`);

  const confirmGates = contract.confirm_gates || {};
  expect(confirmGates.active_gate === "gate_save", `${label}: expected active gate_save`);
  expect(
    Array.isArray(confirmGates.entries) && confirmGates.entries.length === 1,
    `${label}: expected one confirm_gates entry`
  );
  const gateEntry = Array.isArray(confirmGates.entries) ? confirmGates.entries[0] : null;
  expect(gateEntry?.gate_id === "gate_save", `${label}: expected gate_save entry`);
  expect(gateEntry?.state === "pending", `${label}: expected pending gate state`);
  expect(
    JSON.stringify(gateEntry?.allowed_responses) === JSON.stringify(["yes", "no", "cancel"]),
    `${label}: expected yes/no/cancel allowed responses`
  );

  const validation = contract.validation || {};
  expect(
    Array.isArray(validation.required) &&
      validation.required.includes("git diff --check") &&
      validation.required.includes("docs-only boundary check") &&
      validation.required.includes("target path sanity"),
    `${label}: expected required validation checks`
  );
  expect(
    Array.isArray(validation.optional) && validation.optional.length === 0,
    `${label}: expected empty optional validation list`
  );
};

const expectBranchStateShape = (object, label) => {
  expect(isObject(object), `${label}: expected branch_state object`);
  expect(
    isAllowedBranchClass(object?.branch_class),
    `${label}: expected allowed branch_class on_main|on_non_main_branch|branch_state_unknown`
  );
  if (object?.branch_class === "branch_state_unknown") {
    expect(
      object.branch_name === null || object.branch_name === "HEAD" || isNonEmptyString(object.branch_name),
      `${label}: expected nullable or explicit branch_name for unknown state`
    );
  } else {
    expectNonEmptyStringField(object, "branch_name", label);
  }
};

const expectBranchDecisionResultShape = (object, label) => {
  expect(isObject(object), `${label}: expected branch_decision_result object`);
  expect(
    isAllowedBranchAction(object?.selected_action),
    `${label}: expected allowed selected_action`
  );
  expect(
    isAllowedExecutorState(object?.resulting_executor_state),
    `${label}: expected allowed resulting_executor_state`
  );
  expectNonEmptyStringField(object, "next_human_action", label);
};

const expectBranchMutationResultShape = (object, label, expectedAction = null) => {
  expect(isObject(object), `${label}: expected branch_mutation_result object`);
  expect(
    expectedAction ? object?.selected_mutation_action === expectedAction : isAllowedBranchMutationAction(object?.selected_mutation_action),
    expectedAction
      ? `${label}: expected selected_mutation_action=${expectedAction}`
      : `${label}: expected allowed selected_mutation_action`
  );
  expect(
    isAllowedBranchMutationState(object?.resulting_executor_state),
    `${label}: expected allowed branch mutation resulting state`
  );
  expectNonEmptyStringField(object, "next_human_action", label);
  expectNonEmptyStringField(object, "target_branch_name", label);
};

const initGitRepoWithBranch = (repoRoot, branchName) => {
  const initResult = spawnSync("git", ["init", "-q"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  expect(initResult.status === 0, `git init should succeed for smoke temp repo (${branchName})`);

  const symbolicRefResult = spawnSync("git", ["symbolic-ref", "HEAD", `refs/heads/${branchName}`], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  expect(
    symbolicRefResult.status === 0,
    `git symbolic-ref should succeed for smoke temp repo (${branchName})`
  );

  const commitResult = spawnSync(
    "git",
    ["-c", "user.name=Smoke Test", "-c", "user.email=smoke@example.com", "commit", "--allow-empty", "-m", "init", "-q"],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );
  expect(commitResult.status === 0, `git commit should succeed for smoke temp repo (${branchName})`);
};

const createLocalBranch = (repoRoot, branchName) => {
  const branchResult = spawnSync("git", ["branch", branchName], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  expect(branchResult.status === 0, `git branch should succeed for smoke temp repo (${branchName})`);
};

const gitCommitAll = (repoRoot, message) => {
  const commitResult = spawnSync(
    "git",
    ["-c", "user.name=Smoke Test", "-c", "user.email=smoke@example.com", "add", "-A"],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );
  expect(commitResult.status === 0, `git add should succeed for smoke temp repo (${message})`);

  const finalizeResult = spawnSync(
    "git",
    ["-c", "user.name=Smoke Test", "-c", "user.email=smoke@example.com", "commit", "-m", message, "-q"],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );
  expect(finalizeResult.status === 0, `git commit should succeed for smoke temp repo (${message})`);
};

const withTempRepoRoot = (fn) => {
  const originalCwd = process.cwd();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "p1-executor-smoke-"));

  try {
    process.chdir(tempRoot);
    return fn(tempRoot);
  } finally {
    process.chdir(originalCwd);
    try {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    } catch {
      // best-effort cleanup only
    }
  }
};

// 1) missing --goal
{
  const result = runCli([]);
  const text = `${result.stdout}\n${result.stderr}`;
  expect(result.status !== 0, "missing --goal should exit non-zero");
  expect(text.includes("Missing required argument: --goal."), "missing --goal should emit explicit error text");
  expect(text.includes("Usage:"), "missing --goal should emit usage text");
}

// 2) clarify overflow (>2)
{
  const result = runCli([
    "--goal",
    "unknown",
    "--clarify-response",
    "a",
    "--clarify-response",
    "b",
    "--clarify-response",
    "c",
  ]);
  expect(result.status !== 0, "clarify overflow should exit non-zero");
}

// 3) unresolved ambiguity after bounded clarify
{
  const result = runCli([
    "--goal",
    "make this better",
    "--clarify-response",
    "not sure",
    "--clarify-response",
    "still unclear",
  ]);
  expect(result.status !== 0, "unresolved ambiguity should exit non-zero");
  const payload = parseJsonStdout(result, "unresolved ambiguity");
  if (payload) {
    expectStopResultShape(payload, "unresolved ambiguity");
  }
}

// 4) docs-only goal -> (P1, Minor Change)
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "docs-only goal should exit zero");
  const payload = parseJsonStdout(result, "docs-only goal");
  if (payload) {
    expectRouteResultShape(payload, "docs-only goal");
    expect(payload.primary_path === "P1", "docs-only goal should resolve P1");
    expect(payload.workflow_route === "Minor Change", "docs-only goal should resolve Minor Change");
    expectP1ActionContractShape(payload, "docs-only goal");
  }
}

// 5) bounded small code-change -> (P2, Minor Change)
{
  const result = runCli(["--goal", "apply a small code fix to the validation helper"]);
  expect(result.status === 0, "small code-change goal should exit zero");
  const payload = parseJsonStdout(result, "small code-change goal");
  if (payload) {
    expectRouteResultShape(payload, "small code-change goal");
    expect(payload.primary_path === "P2", "small code-change goal should resolve P2");
    expect(payload.workflow_route === "Minor Change", "small code-change goal should resolve Minor Change");
    expect(payload.action_contract === undefined, "small code-change goal should not emit action_contract");
  }
}

// 6) BMAD-feature goal -> (P3, BMAD Feature)
{
  const result = runCli(["--goal", "implement a new BMAD feature capability for orchestrator routing"]);
  expect(result.status === 0, "BMAD-feature goal should exit zero");
  const payload = parseJsonStdout(result, "BMAD-feature goal");
  if (payload) {
    expectRouteResultShape(payload, "BMAD-feature goal");
    expect(payload.primary_path === "P3", "BMAD-feature goal should resolve P3");
    expect(payload.workflow_route === "BMAD Feature", "BMAD-feature goal should resolve BMAD Feature");
    expect(payload.action_contract === undefined, "BMAD-feature goal should not emit action_contract");
  }
}

// 7) normalization case (P2 + BMAD -> P3 + BMAD)
{
  const result = runCli(["--goal", "small code change for bmad feature routing"]);
  expect(result.status === 0, "normalization case should exit zero");
  const payload = parseJsonStdout(result, "normalization case");
  if (payload) {
    expectRouteResultShape(payload, "normalization case", { requireNormalizationNote: true });
    expect(payload.primary_path === "P3", "normalization case should normalize to P3");
    expect(payload.workflow_route === "BMAD Feature", "normalization case should remain BMAD Feature");
    expect(payload.action_contract === undefined, "normalization case should not emit action_contract");
    expect(
      typeof payload.normalization_note === "string" &&
        payload.normalization_note.includes("Normalized invalid steady-state pair (P2, BMAD Feature) to (P3, BMAD Feature)"),
      "normalization case should include explicit normalization note"
    );
  }
}

// 8) deterministic repeat
{
  const args = ["--goal", "draft a docs-only clarification update"];
  const first = runCli(args);
  const second = runCli(args);
  expect(first.status === 0 && second.status === 0, "deterministic repeat should exit zero both times");
  const firstPayload = parseJsonStdout(first, "deterministic repeat (first)");
  const secondPayload = parseJsonStdout(second, "deterministic repeat (second)");
  if (firstPayload && secondPayload) {
    expectRouteResultShape(firstPayload, "deterministic repeat (first)");
    expectRouteResultShape(secondPayload, "deterministic repeat (second)");
    expectP1ActionContractShape(firstPayload, "deterministic repeat (first)");
    expectP1ActionContractShape(secondPayload, "deterministic repeat (second)");
    expect(
      firstPayload.result_type === secondPayload.result_type &&
        firstPayload.primary_path === secondPayload.primary_path &&
        firstPayload.workflow_route === secondPayload.workflow_route &&
        firstPayload.next_step_direction === secondPayload.next_step_direction &&
        JSON.stringify(firstPayload.action_contract) === JSON.stringify(secondPayload.action_contract),
      "deterministic repeat should produce materially same route classification, direction, and P1 action_contract"
    );
  }
}

// 9) executor detects on_main and requires branch-change intent
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor on_main setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor on_main setup");
  if (payload) {
    expectP1ActionContractShape(payload, "executor on_main setup");
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "main");
      const executorResult = executeP1MinorChangeWrite(payload, "request_branch_change");
      expect(executorResult.status === "stopped", "executor should stop on on_main branch state");
      expectNonEmptyStringField(executorResult, "stop_reason", "executor on_main");
      expectNonEmptyStringField(executorResult, "next_human_action", "executor on_main");
      expectBranchStateShape(executorResult.branch_state, "executor on_main branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor on_main branch_decision_result"
      );
      expect(
        executorResult.branch_state?.branch_class === "on_main",
        "executor should classify main branch as on_main"
      );
      expect(
        executorResult.branch_decision_result?.selected_action === "request_branch_change",
        "executor on_main should preserve request_branch_change action"
      );
      expect(
        executorResult.branch_decision_result?.resulting_executor_state === "awaiting_branch_change",
        "executor on_main should return awaiting_branch_change"
      );

      const targetHint = payload.action_contract?.target_resolution?.target_path_hint;
      const targetPath = path.resolve(tempRoot, targetHint || "");
      expect(!fs.existsSync(targetPath), "executor on_main should not write any docs artifact");
    });
  }
}

// 10) executor allows bounded continuation on non-main branch
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor non-main setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor non-main setup");
  if (payload) {
    expectP1ActionContractShape(payload, "executor non-main setup");
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "feature/test");
      const executorResult = executeP1MinorChangeWrite(payload, "continue_on_current_branch");
      expect(executorResult.status === "completed", "executor should complete on non-main continue");
      expect(
        executorResult.written_path === payload.action_contract?.target_resolution?.target_path_hint,
        "executor should write to the contract target_path_hint"
      );
      expectNonEmptyStringField(executorResult, "next_human_action", "executor non-main");
      expectBranchStateShape(executorResult.branch_state, "executor non-main branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor non-main branch_decision_result"
      );
      expect(
        executorResult.branch_state?.branch_class === "on_non_main_branch",
        "executor should classify feature branch as on_non_main_branch"
      );
      expect(
        executorResult.branch_decision_result?.selected_action === "continue_on_current_branch",
        "executor non-main should preserve continue_on_current_branch action"
      );
      expect(
        executorResult.branch_decision_result?.resulting_executor_state === "branch_safe_continue",
        "executor non-main should produce branch_safe_continue"
      );

      const targetPath = path.resolve(tempRoot, executorResult.written_path || "");
      expect(fs.existsSync(targetPath), "executor non-main should write one docs artifact");
      const writtenContent = fs.readFileSync(targetPath, "utf8");
      expect(
        writtenContent.includes("# P1 Minimal Write Artifact"),
        "executor should write the bounded markdown artifact heading"
      );
      expect(
        writtenContent.includes("draft a docs-only clarification update"),
        "executor should include the contract goal in the written artifact"
      );
    });
  }
}

// 11) executor creates and switches from main with explicit target branch name
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor mutation-success setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor mutation-success setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "main");
      const executorResult = executeP1MinorChangeWrite(
        payload,
        "request_branch_change",
        "feature/generated-branch"
      );
      expect(
        executorResult.status === "completed",
        "executor should complete after bounded create-and-switch from main"
      );
      expectBranchStateShape(executorResult.branch_state, "executor mutation-success branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor mutation-success branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor mutation-success branch_mutation_result",
        "create_and_switch_to_new_branch"
      );
      expect(
        executorResult.branch_state?.branch_class === "on_non_main_branch",
        "executor mutation-success should end on a non-main branch"
      );
      expect(
        executorResult.branch_state?.branch_name === "feature/generated-branch",
        "executor mutation-success should switch to the requested target branch"
      );
      expect(
        executorResult.branch_decision_result?.selected_action === "request_branch_change",
        "executor mutation-success should preserve request_branch_change action"
      );
      expect(
        executorResult.branch_decision_result?.resulting_executor_state === "branch_safe_continue",
        "executor mutation-success should return branch_safe_continue"
      );
      expect(
        executorResult.branch_mutation_result?.resulting_executor_state === "branch_mutation_applied",
        "executor mutation-success should mark branch mutation as applied"
      );

      const targetPath = path.resolve(tempRoot, executorResult.written_path || "");
      expect(fs.existsSync(targetPath), "executor mutation-success should write one docs artifact");

      const headResult = spawnSync("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], {
        cwd: tempRoot,
        encoding: "utf8",
      });
      expect(headResult.status === 0, "executor mutation-success should leave the repo on a named branch");
      expect(
        String(headResult.stdout || "").trim() === "feature/generated-branch",
        "executor mutation-success should leave HEAD on the requested target branch"
      );
    });
  }
}

// 12) executor switches to an already-existing non-main branch from blocked main
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor switch-existing setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor switch-existing setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "main");
      createLocalBranch(tempRoot, "feature/already-exists");
      const executorResult = executeP1MinorChangeWrite(
        payload,
        "request_branch_change",
        "feature/already-exists"
      );
      expect(
        executorResult.status === "completed",
        "executor should complete when switching to an already-existing non-main branch from main"
      );
      expectBranchStateShape(executorResult.branch_state, "executor switch-existing branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor switch-existing branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor switch-existing branch_mutation_result",
        "switch_to_existing_branch"
      );
      expect(
        executorResult.branch_state?.branch_name === "feature/already-exists",
        "executor switch-existing should leave HEAD on the requested existing branch"
      );

      const targetPath = path.resolve(tempRoot, executorResult.written_path || "");
      expect(fs.existsSync(targetPath), "executor switch-existing should write one docs artifact");
    });
  }
}

// 13) executor creates and switches to one additional new branch from a safe non-main branch
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor non-main additional-branch setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor non-main additional-branch setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "feature/current");
      const executorResult = executeP1MinorChangeWrite(
        payload,
        "request_branch_change",
        "feature/additional-branch"
      );
      expect(
        executorResult.status === "completed",
        "executor should complete when creating one additional new branch from a safe non-main branch"
      );
      expectBranchStateShape(executorResult.branch_state, "executor non-main additional-branch branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor non-main additional-branch branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor non-main additional-branch branch_mutation_result",
        "create_and_switch_to_new_branch"
      );
      expect(
        executorResult.branch_state?.branch_name === "feature/additional-branch",
        "executor non-main additional-branch should leave HEAD on the requested new branch"
      );

      const targetPath = path.resolve(tempRoot, executorResult.written_path || "");
      expect(fs.existsSync(targetPath), "executor non-main additional-branch should write one docs artifact");
    });
  }
}

// 14) executor stops when target branch resolves to main / unsafe context
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor unsafe-target setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor unsafe-target setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "main");
      const executorResult = executeP1MinorChangeWrite(payload, "request_branch_change", "main");
      expect(
        executorResult.status === "stopped",
        "executor should stop when the requested target branch resolves to main"
      );
      expectNonEmptyStringField(executorResult, "stop_reason", "executor unsafe-target");
      expectBranchStateShape(
        executorResult.branch_state,
        "executor unsafe-target branch_state"
      );
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor unsafe-target branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor unsafe-target branch_mutation_result",
        "switch_to_existing_branch"
      );
      expect(
        executorResult.stop_reason.includes("must not be main"),
        "executor unsafe-target should explain that main is not a safe target branch"
      );
    });
  }
}

// 15) executor stops when branch switching to an existing branch fails
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor switch-failure setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor switch-failure setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "main");
      createLocalBranch(tempRoot, "feature/conflict");

      const checkoutFeature = spawnSync("git", ["checkout", "feature/conflict"], {
        cwd: tempRoot,
        encoding: "utf8",
      });
      expect(checkoutFeature.status === 0, "executor switch-failure setup should checkout feature/conflict");

      const trackedPath = path.join(tempRoot, "docs", "conflict.md");
      fs.mkdirSync(path.dirname(trackedPath), { recursive: true });
      fs.writeFileSync(trackedPath, "branch version\n", "utf8");
      gitCommitAll(tempRoot, "add conflict file on existing branch");

      const checkoutMain = spawnSync("git", ["checkout", "main"], {
        cwd: tempRoot,
        encoding: "utf8",
      });
      expect(checkoutMain.status === 0, "executor switch-failure setup should return to main");

      fs.mkdirSync(path.dirname(trackedPath), { recursive: true });
      fs.writeFileSync(trackedPath, "untracked local version\n", "utf8");

      const executorResult = executeP1MinorChangeWrite(payload, "request_branch_change", "feature/conflict");
      expect(
        executorResult.status === "stopped",
        "executor should stop when switching to an existing branch fails"
      );
      expectNonEmptyStringField(executorResult, "stop_reason", "executor switch-failure");
      expectBranchStateShape(executorResult.branch_state, "executor switch-failure branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor switch-failure branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor switch-failure branch_mutation_result",
        "switch_to_existing_branch"
      );
      expect(
        executorResult.stop_reason.includes("branch switch failed"),
        "executor switch-failure should explain the checkout failure"
      );
    });
  }
}

// 16) executor switches to an already-existing safe non-main branch from a safe non-main branch
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor existing-target-non-main setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor existing-target-non-main setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "feature/current");
      createLocalBranch(tempRoot, "feature/another-branch");
      const executorResult = executeP1MinorChangeWrite(
        payload,
        "request_branch_change",
        "feature/another-branch"
      );
      expect(
        executorResult.status === "completed",
        "executor should complete when switching to an already-existing safe non-main branch from safe non-main"
      );
      expectBranchStateShape(
        executorResult.branch_state,
        "executor existing-target-non-main branch_state"
      );
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor existing-target-non-main branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor existing-target-non-main branch_mutation_result",
        "switch_to_existing_branch"
      );
      expect(
        executorResult.branch_state?.branch_name === "feature/another-branch",
        "executor existing-target-non-main should leave HEAD on the requested existing branch"
      );

      const targetPath = path.resolve(tempRoot, executorResult.written_path || "");
      expect(fs.existsSync(targetPath), "executor existing-target-non-main should write one docs artifact");
    });
  }
}

// 17) executor stops when switching to an existing safe non-main branch fails
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor non-main switch-failure setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor non-main switch-failure setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "feature/current");
      createLocalBranch(tempRoot, "feature/conflict");

      const checkoutFeature = spawnSync("git", ["checkout", "feature/conflict"], {
        cwd: tempRoot,
        encoding: "utf8",
      });
      expect(checkoutFeature.status === 0, "executor non-main switch-failure setup should checkout feature/conflict");

      const trackedPath = path.join(tempRoot, "docs", "conflict.md");
      fs.mkdirSync(path.dirname(trackedPath), { recursive: true });
      fs.writeFileSync(trackedPath, "branch version\n", "utf8");
      gitCommitAll(tempRoot, "add conflict file on existing non-main branch");

      const checkoutCurrent = spawnSync("git", ["checkout", "feature/current"], {
        cwd: tempRoot,
        encoding: "utf8",
      });
      expect(checkoutCurrent.status === 0, "executor non-main switch-failure setup should return to feature/current");

      fs.mkdirSync(path.dirname(trackedPath), { recursive: true });
      fs.writeFileSync(trackedPath, "untracked local version\n", "utf8");

      const executorResult = executeP1MinorChangeWrite(
        payload,
        "request_branch_change",
        "feature/conflict"
      );
      expect(
        executorResult.status === "stopped",
        "executor should stop when switching to an existing safe non-main branch fails"
      );
      expectNonEmptyStringField(executorResult, "stop_reason", "executor non-main switch-failure");
      expectBranchStateShape(executorResult.branch_state, "executor non-main switch-failure branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor non-main switch-failure branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor non-main switch-failure branch_mutation_result",
        "switch_to_existing_branch"
      );
      expect(
        executorResult.stop_reason.includes("branch switch failed"),
        "executor non-main switch-failure should explain the checkout failure"
      );
    });
  }
}

// 18) executor stops when safe non-main branch creation fails
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor non-main create-failure setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor non-main create-failure setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "feature/current");
      createLocalBranch(tempRoot, "topic");
      const executorResult = executeP1MinorChangeWrite(
        payload,
        "request_branch_change",
        "topic/child"
      );
      expect(
        executorResult.status === "stopped",
        "executor should stop when creating one additional new branch from safe non-main fails"
      );
      expectNonEmptyStringField(executorResult, "stop_reason", "executor non-main create-failure");
      expectBranchStateShape(executorResult.branch_state, "executor non-main create-failure branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor non-main create-failure branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor non-main create-failure branch_mutation_result",
        "create_and_switch_to_new_branch"
      );
      expect(
        executorResult.stop_reason.includes("branch creation/switch failed"),
        "executor non-main create-failure should explain the bounded branch creation failure"
      );
    });
  }
}

// 19) executor stops when target branch name is used outside the bounded branch-mutation paths
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor unsupported-mutation-path setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor unsupported-mutation-path setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "feature/current");
      const executorResult = executeP1MinorChangeWrite(
        payload,
        "continue_on_current_branch",
        "feature/another-branch"
      );
      expect(
        executorResult.status === "stopped",
        "executor should stop when target branch input is used outside the bounded branch-mutation paths"
      );
      expectNonEmptyStringField(executorResult, "stop_reason", "executor unsupported-mutation-path");
      expectBranchStateShape(
        executorResult.branch_state,
        "executor unsupported-mutation-path branch_state"
      );
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor unsupported-mutation-path branch_decision_result"
      );
      expectBranchMutationResultShape(
        executorResult.branch_mutation_result,
        "executor unsupported-mutation-path branch_mutation_result",
        "create_and_switch_to_new_branch"
      );
      expect(
        executorResult.stop_reason.includes("only supported"),
        "executor unsupported-mutation-path should explain that target input is bounded to explicit mutation paths"
      );
    });
  }
}

// 20) executor stops on unknown branch state
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor unknown-branch setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor unknown-branch setup");
  if (payload) {
    expectP1ActionContractShape(payload, "executor unknown-branch setup");
    withTempRepoRoot((tempRoot) => {
      const executorResult = executeP1MinorChangeWrite(payload, "continue_on_current_branch");
      expect(executorResult.status === "stopped", "executor should stop on unknown branch state");
      expectNonEmptyStringField(executorResult, "stop_reason", "executor unknown-branch");
      expectNonEmptyStringField(executorResult, "next_human_action", "executor unknown-branch");
      expectBranchStateShape(executorResult.branch_state, "executor unknown-branch branch_state");
      expectBranchDecisionResultShape(
        executorResult.branch_decision_result,
        "executor unknown-branch branch_decision_result"
      );
      expect(
        executorResult.branch_state?.branch_class === "branch_state_unknown",
        "executor should classify missing git context as branch_state_unknown"
      );
      expect(
        executorResult.branch_decision_result?.selected_action === "stop",
        "executor unknown-branch should force stop"
      );
      expect(
        executorResult.branch_decision_result?.resulting_executor_state === "stopped",
        "executor unknown-branch should remain stopped"
      );
    });
  }
}

// 21) executor stops on malformed decision shape
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "executor malformed-decision setup should resolve a valid P1 route result");
  const payload = parseJsonStdout(result, "executor malformed-decision setup");
  if (payload) {
    withTempRepoRoot((tempRoot) => {
      initGitRepoWithBranch(tempRoot, "feature/test");
      const executorResult = executeP1MinorChangeWrite(payload, "yes");
      expect(executorResult.status === "stopped", "executor should stop on malformed decision shape");
      expectNonEmptyStringField(executorResult, "stop_reason", "executor malformed-decision");
      expectNonEmptyStringField(executorResult, "next_human_action", "executor malformed-decision");
      expectBranchStateShape(executorResult.branch_state, "executor malformed-decision branch_state");
      expect(
        executorResult.branch_state?.branch_class === "on_non_main_branch",
        "executor malformed-decision should still detect current non-main branch state"
      );
    });
  }
}

// 22) executor rejects non-P1 contract packets
{
  const result = runCli(["--goal", "apply a small code fix to the validation helper"]);
  expect(result.status === 0, "executor invalid-input setup should resolve a valid non-P1 route result");
  const payload = parseJsonStdout(result, "executor invalid-input setup");
  if (payload) {
    withTempRepoRoot(() => {
      const executorResult = executeP1MinorChangeWrite(payload, "yes");
      expect(executorResult.status === "stopped", "executor should stop on non-P1 input");
      expectNonEmptyStringField(executorResult, "stop_reason", "executor invalid-input");
      expectNonEmptyStringField(executorResult, "next_human_action", "executor invalid-input");
    });
  }
}

if (failures.length > 0) {
  console.error(`SMOKE FAIL: ${failures.length} failure(s) across ${checksRun} checks.`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`SMOKE PASS: ${checksRun} checks passed.`);
