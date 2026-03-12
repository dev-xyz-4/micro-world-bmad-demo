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
    expect(
      firstPayload.result_type === secondPayload.result_type &&
        firstPayload.primary_path === secondPayload.primary_path &&
        firstPayload.workflow_route === secondPayload.workflow_route &&
        firstPayload.next_step_direction === secondPayload.next_step_direction,
      "deterministic repeat should produce materially same route classification and direction"
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
