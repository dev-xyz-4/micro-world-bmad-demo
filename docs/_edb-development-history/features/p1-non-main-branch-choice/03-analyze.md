# Analyze — p1-non-main-branch-choice

## 1) Options Considered
### Option A: Keep `continue_on_current_branch` unchanged and add one separate bounded `open_new_branch_from_current_non_main` path
- Summary:
  - Preserve the already-implemented `continue_on_current_branch` behavior on safe non-`main` exactly as it is, and add one new bounded path that accepts an explicit target branch name to create and switch to one additional new branch from that current non-`main` context.
- Pros:
  - Smallest credible extension of the existing executor baseline.
  - Preserves the already-implemented safe non-`main` continuation path without reworking it.
  - Keeps the first non-`main` branch-choice slice tightly aligned with the already-existing bounded decision surface.
  - Minimizes decision-model churn while still adding the missing capability.
- Cons:
  - The bounded operator-intent shape is slightly asymmetric because current-branch continuation remains simpler than the new-branch path.
- Risks:
  - Later follow-ups may still want a more unified choice model once more non-`main` branch-management behaviors exist.
- Complexity:
  - Low

### Option B: Reshape the safe non-`main` decision model into a new explicit branch-choice envelope immediately
- Summary:
  - Introduce one new explicit branch-choice intent shape that always forces a bounded choice between current-branch continuation and opening one additional new branch from safe non-`main`.
- Pros:
  - Produces a cleaner and more uniform conceptual model for the safe non-`main` context.
  - May make later non-`main` follow-ups easier to add.
- Cons:
  - Reworks an already-valid and already-implemented path before it is necessary.
  - Broadens the first slice from “add one capability” into “add one capability plus reshape an existing intent model.”
  - Increases regression risk on the completed `continue_on_current_branch` path.
- Risks:
  - The slice starts drifting toward a wider executor-decision redesign instead of the smallest missing capability.
- Complexity:
  - Medium

### Option C (optional): Defer the new-branch option and keep safe non-`main` limited to current-branch continuation for now
- Summary:
  - Do not add the new bounded non-`main` branch-opening option yet; keep the current safe non-`main` behavior unchanged until a larger branch-management pass is ready.
- Pros:
  - Avoids immediate executor surface growth.
- Cons:
  - Leaves the requested non-`main` capability gap unresolved.
  - Wastes the already-opened and well-bounded follow-up path.
  - Pushes pressure into a later slice that may become too broad.
- Risks:
  - The next slice may accumulate both non-`main` branch choice and broader branch-management concerns at once.
- Complexity:
  - Low, but mis-sequenced

---

## 2) Decision
- Chosen option:
  - **Option A**
- Rationale (short):
  - The thinnest credible next step is to preserve the existing `continue_on_current_branch` behavior on safe non-`main` exactly as-is and add one separate bounded new-branch path from that same safe context. That closes the specific requested gap while avoiding unnecessary redesign of an already-working executor-decision path.
- Assumptions (explicit):
  - The current safe non-`main` continuation path is already acceptable and should not be reshaped in the first follow-up.
  - One explicit target branch name remains sufficient for the first additional-new-branch path.
  - A richer unified branch-choice model can safely remain deferred until later bounded follow-ups, if ever needed.
- Out-of-scope impacts:
  - No redesign of the completed `continue_on_current_branch` path in this first slice.
  - No blocked-`main` redesign.
  - No generalized Git workflow orchestration.
  - No target-resolution redesign.

---

## 3) Risk Register (minimal)
- Risk:
  - The asymmetric shape between current-branch continuation and new-branch creation may feel slightly less elegant than a unified choice model.
  - Likelihood:
    - Medium
  - Impact:
    - Low
  - Mitigation:
    - Keep the first-slice contract explicit: the goal is the smallest missing capability, not immediate model unification.

- Risk:
  - The new-branch path from safe non-`main` could drift toward broader branch-management behavior.
  - Likelihood:
    - Low
  - Impact:
    - High
  - Mitigation:
    - Limit the first slice to one explicit target branch name, one additional new branch, and explicit stop behavior only.

- Risk:
  - The implementation may accidentally weaken the existing `continue_on_current_branch` path.
  - Likelihood:
    - Low
  - Impact:
    - High
  - Mitigation:
    - Preserve the current safe non-`main` continuation path unchanged and treat the new-branch path as additive only.

---

## 4) Rejected Approaches (if any)
- Approach:
  - Option B
  - Why rejected:
    - It broadens the first non-`main` branch-choice slice from “add one missing capability” into “add one capability plus reshape the existing safe non-`main` decision model,” which is unnecessary at this stage.

- Approach:
  - Option C
  - Why rejected:
    - It leaves the requested non-`main` capability gap unresolved and increases the chance that a later follow-up becomes wider than necessary.
