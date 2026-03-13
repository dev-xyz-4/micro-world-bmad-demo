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

if (failures.length > 0) {
  console.error(`SMOKE FAIL: ${failures.length} failure(s) across ${checksRun} checks.`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`SMOKE PASS: ${checksRun} checks passed.`);
