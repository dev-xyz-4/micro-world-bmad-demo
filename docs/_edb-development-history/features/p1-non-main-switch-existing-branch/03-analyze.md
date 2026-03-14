# Analyze — p1-non-main-switch-existing-branch

## 1) Options Considered
### Option A: Preserve the existing safe non-`main` paths and add one separate bounded switch-existing path
- Summary:
  - Keep the already-implemented `continue_on_current_branch` behavior and the completed safe non-`main` additional-new-branch behavior conceptually as they are, and add one new bounded path that switches to one already-existing safe non-`main` branch from that same already-safe non-`main` context.
- Pros:
  - Smallest credible extension of the current executor baseline.
  - Preserves two already-implemented safe non-`main` paths without reopening them.
  - Stays tightly aligned with the Phase-4 sequencing: hardening first, blocked-`main` mutation follow-ups next, safe non-`main` additional-new-branch next, and then one additive safe non-`main` switch-existing follow-up.
  - Minimizes decision-model churn while still closing the specific remaining gap named in `WU-023`.
- Cons:
  - The operator-facing shape remains somewhat asymmetric because the safe non-`main` context is still represented by preserved prior paths plus one new bounded path, rather than one newly unified envelope.
- Risks:
  - Later follow-ups may still prefer a more uniform safe non-`main` choice envelope once more branch-management behavior exists.
- Complexity:
  - Low

### Option B: Introduce one new explicit three-option branch-choice envelope immediately
- Summary:
  - Replace the preserved safe non-`main` branch-choice surface with one newly explicit decision/result shape that always forces a bounded three-way choice among current-branch continuation, additional-new-branch, and switch-existing.
- Pros:
  - Produces a cleaner and more uniform conceptual shape for the safe non-`main` context.
  - Could make later safe non-`main` follow-ups feel more structurally consistent.
- Cons:
  - Reworks two already-valid and already-implemented safe non-`main` paths before that redesign is necessary.
  - Broadens the first slice from “add one missing capability” into “add one missing capability plus reshape the surrounding choice model.”
  - Increases regression risk on the completed `continue_on_current_branch` and additional-new-branch paths.
- Risks:
  - The slice drifts from a bounded follow-up into a broader executor-decision redesign.
- Complexity:
  - Medium

### Option C (optional): Defer safe non-`main` switch-existing until a later broader branch-management pass
- Summary:
  - Do not add the safe non-`main` switch-existing path yet; keep the completed safe non-`main` baseline unchanged until a wider branch-choice redesign is ready.
- Pros:
  - Avoids immediate growth of the safe non-`main` choice surface.
- Cons:
  - Leaves the specific follow-up opened by `WU-023` unresolved.
  - Wastes the existing bounded continuity path established by the completed branch-hardening and branch-choice baselines.
  - Pushes more pressure into a later slice that may become wider than necessary.
- Risks:
  - The next safe non-`main` follow-up may accumulate both the missing capability and a wider redesign at the same time.
- Complexity:
  - Low, but mis-sequenced

---

## 2) Decision
- Chosen option:
  - **Option A**
- Rationale (short):
  - The thinnest credible next step is to preserve the completed safe non-`main` continuation path and the completed safe non-`main` additional-new-branch path as-is, and add one separate bounded switch-existing path from that same already-safe non-`main` context. That closes the specific remaining capability gap identified by `WU-023` while avoiding unnecessary redesign of already-implemented safe non-`main` behavior.
- Assumptions (explicit):
  - The current safe non-`main` continuation path is already acceptable and should not be reshaped in this first follow-up.
  - The completed safe non-`main` additional-new-branch path is already acceptable and should not be reshaped in this first follow-up.
  - The first safe non-`main` switch-existing path can remain conceptually path-additive rather than requiring a newly unified three-option envelope.
  - Existing target-branch input handling remains sufficient for the first safe non-`main` switch-existing path; no richer intent structure is required in this slice.
- Out-of-scope impacts:
  - No immediate redesign of the safe non-`main` choice model into a new uniform envelope.
  - No blocked-`main` redesign.
  - No safe non-`main` create-and-switch redesign.
  - No generalized Git workflow orchestration.
  - No target-resolution redesign.

---

## 3) Risk Register (minimal)
- Risk:
  - The preserved-plus-additive shape may feel less elegant than a newly unified three-option envelope.
  - Likelihood:
    - Medium
  - Impact:
    - Low
  - Mitigation:
    - Keep the first-slice contract explicit: the goal is the smallest missing capability, not immediate shape unification.

- Risk:
  - The new safe non-`main` switch-existing path could drift toward a broader safe non-`main` choice redesign.
  - Likelihood:
    - Low
  - Impact:
    - High
  - Mitigation:
    - Limit the first slice to one additive existing-branch switch path while preserving the completed continuation and additional-new-branch baselines unchanged.

- Risk:
  - The implementation could accidentally weaken one of the completed safe non-`main` paths while adding the new existing-branch switch path.
  - Likelihood:
    - Low
  - Impact:
    - High
  - Mitigation:
    - Treat the current safe non-`main` continuation path and the completed additional-new-branch path as preserved baselines and validate that the new switch-existing path is additive only.

---

## 4) Rejected Approaches (if any)
- Approach:
  - Option B
  - Why rejected:
    - It broadens the first safe non-`main` switch-existing slice from “add one missing capability” into “add one capability plus reshape the surrounding safe non-`main` choice model,” which is unnecessary at this stage.

- Approach:
  - Option C
  - Why rejected:
    - It leaves the requested safe non-`main` capability gap unresolved and increases the chance that a later follow-up becomes wider than necessary.
