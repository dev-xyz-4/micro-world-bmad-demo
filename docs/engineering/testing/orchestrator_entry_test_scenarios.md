# Phase 4 — Orchestrator Entry Test Scenarios
Status: engineering validation document  
Scope: Orchestrator Entry MVP behavior verification

Purpose: Stress-test the Orchestrator Entry MVP to validate routing, clarify behavior, and boundary rules under realistic conditions.

Context:
- Entry surface: `scripts/quality/orchestrator-entry.mjs`
- Bounded clarify loop: max 2 prompts
- Supported internal paths: `P1`, `P2`, `P3`
- Visible workflow families: `Minor Change`, `BMAD Feature`
- Result packets: `route-result` or `stop-result`
- Normalization rule: (`P2`, `BMAD Feature`) → (`P3`, `BMAD Feature`)

---

## Test 1 — Ambiguous Goal Stress
Status: PASS

Goal example:
"make the system better"

Expected behavior:
- Entry attempts clarify prompts.
- After two unresolved clarifications → emit `stop-result`.
- `stop-result` must include a structured `clarify_packet` with:
  - trigger
  - missing/conflicting input
  - valid options
  - recommendation
  - next action / decider

Failure indicator:
- Entry guesses a path instead of stopping.

---

## Test 2 — Path / Workflow Separation
Status: PASS

Goal example:
"update documentation for routing explanation"

Expected outcome:
```
primary_path: P1
workflow_route: Minor Change
```

Verify:
- Output contains **both fields separately**.
- Labels are not collapsed into a single routing label.

Failure indicator:
- Entry emits only one label (e.g. `Minor Change`) without `primary_path`.

---

## Test 3 — Invalid Pair Normalization
Status: PASS

Goal example:
"small code change for BMAD feature routing"

Expected internal decision:
```
(P2, BMAD Feature)
```

Expected emitted result:
```
(P3, BMAD Feature)
```

Verify:
- Result includes normalization note.
- No unsupported pair is emitted.

Failure indicator:
- `(P2, BMAD Feature)` appears in final output.

---

## Test 4 — Determinism Check
Status: PASS

Run the same command twice:

```
node scripts/quality/orchestrator-entry.mjs --goal "add CSV export"
```

Expected behavior:
- Same `primary_path`
- Same `workflow_route`
- Same result class (`route-result` or `stop-result`)

Failure indicator:
- Different outcomes across identical runs.

---

## Test 5 — Boundary Violation Test
Status: PASS

Goal example:
"design a new UI dashboard for orchestration"

Expected behavior:
- Entry recognizes request as outside v1 scope.
- Emits `stop-result` requesting clarification or deferring scope.

Verify:
- No UI workflow suggested.
- No new path families introduced.

Failure indicator:
- Entry implicitly accepts UI/Vite expansion.

---

## Test 6 — Downstream Primitive Check
Status: PASS

### Routing heuristic note

The Entry router treats explicit **"feature"** intent in the goal text as a strong routing signal.

Goals containing the word **"feature"** are therefore expected to route to:
primary_path: P3
workflow_route: BMAD Feature


This heuristic was introduced to prevent feature requests from being incorrectly classified as `P2 / Minor Change` when the intent is clearly to implement a new capability.

The heuristic does **not override stronger signals** such as explicit documentation-only or small-fix wording.


Goal example:
"implement new orchestrator feature"

Expected behavior:
- primary_path: P3
workflow_route: BMAD Feature

Verify:
- Next-step direction references:
- scripts/quality/flow-contract-starter.mjs

Failure indicator:
- Entry generates feature artifacts directly.
- Entry becomes routing + artifact generator simultaneously.

---

## Test 7 — CLI Robustness
Status: PASS

Cases to verify:

1. Missing `--goal`
2. More than two `--clarify-response`
3. Invalid CLI argument combination

Expected behavior:
- Non-zero exit
- Explicit usage or error message

---

## Suggested Local Test Layout

Example sandbox:

```
docs/_edb-development-history/

   orchestrator-tests/
      routing-p1-project/
      routing-p2-project/
      routing-p3-project/
      ambiguity-tests/
```

Feature artifacts created by tests should be prefixed with:

```
test_*
```

These can be locally ignored using:

```
.git/info/exclude
```

---

## Success Criteria

The Orchestrator Entry MVP is considered stable when:

- All tests pass deterministically.
- STOP/Clarify behavior is consistent.
- No unsupported routing pairs are emitted.
- No governance boundary violations occur.
