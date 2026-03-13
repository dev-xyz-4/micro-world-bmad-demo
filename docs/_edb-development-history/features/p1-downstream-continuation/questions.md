# Questions — p1-downstream-continuation

## Open

- None at this stage.

## Resolved

- Documentation-only planning for this break and model/analyze steps has `no SemVer change`.
- The first bounded slice remains limited to `P1 / Minor Change`.
- The three-gate model (`gate_save`, `gate_execute`, `gate_review`) remains part of the active contract basis.
- Branch handling stays deferred and optional, not mandatory in the first slice.
- The first executable `action_contract` packet should be emitted immediately in the existing `route-result` for `P1 / Minor Change`, not deferred to a distinct confirmed continuation step after routing.
- The Entry remains the place where the first bounded `P1 / Minor Change` contract is selected/loaded and emitted.
- The `P1 / Minor Change` contract definition itself follows the accepted placement rule and lives outside the Entry on a consistent contract surface.
- Real downstream execution remains outside the Entry and outside this first bounded slice.
