#!/usr/bin/env node

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
    expect(payload.result_type === "stop-result", "unresolved ambiguity should emit stop-result");
    expect(typeof payload.clarify_attempt_count === "number", "stop-result should include clarify-attempt count");
    const packet = payload.clarify_packet || {};
    expect(typeof packet.trigger === "string" && packet.trigger.length > 0, "clarify_packet.trigger missing");
    expect(
      typeof packet.missing_conflicting_input === "string" && packet.missing_conflicting_input.length > 0,
      "clarify_packet.missing_conflicting_input missing"
    );
    expect(Array.isArray(packet.valid_options) && packet.valid_options.length >= 1 && packet.valid_options.length <= 3,
      "clarify_packet.valid_options must contain 1-3 options"
    );
    expect(
      typeof packet.recommendation === "string" && packet.recommendation.length > 0,
      "clarify_packet.recommendation missing"
    );
    expect(
      typeof packet.next_action_decider === "string" && packet.next_action_decider.length > 0,
      "clarify_packet.next_action_decider missing"
    );
    expect(
      typeof packet.blocker_pointer === "string" && packet.blocker_pointer.length > 0,
      "clarify_packet.blocker_pointer missing"
    );
  }
}

// 4) docs-only goal -> (P1, Minor Change)
{
  const result = runCli(["--goal", "draft a docs-only clarification update"]);
  expect(result.status === 0, "docs-only goal should exit zero");
  const payload = parseJsonStdout(result, "docs-only goal");
  if (payload) {
    expect(payload.result_type === "route-result", "docs-only goal should emit route-result");
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
    expect(payload.result_type === "route-result", "small code-change goal should emit route-result");
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
    expect(payload.result_type === "route-result", "BMAD-feature goal should emit route-result");
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
    expect(payload.result_type === "route-result", "normalization case should emit route-result");
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
