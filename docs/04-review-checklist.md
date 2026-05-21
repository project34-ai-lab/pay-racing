# 04-review-checklist.md

# Review Checklist

## Purpose

This document defines the review standards used within this engineering framework.

Reviews exist to preserve:

* correctness
* maintainability
* architectural integrity
* operational stability
* implementation consistency
* long-term system continuity

All implementation should be reviewed before acceptance or merge.

---

# Core Review Principle

The purpose of review is not criticism.

The purpose of review is to:

* detect risk
* preserve system quality
* reduce operational instability
* prevent architectural drift
* maintain engineering continuity

AI-generated implementation must never bypass review discipline.

---

# 1. Requirement Alignment

Verify that implementation matches the intended requirement.

Check:

* requested behavior exists
* expected workflows behave correctly
* implementation scope matches the task
* edge behavior is acceptable

Avoid accepting partially aligned implementation.

---

# 2. Architectural Alignment

Verify that implementation follows established architecture.

Check for:

* boundary violations
* misplaced business logic
* coupling problems
* dependency direction violations
* inconsistent patterns

Implementation should preserve architectural consistency.

---

# 3. Scope Control

Verify that changes remain within intended scope.

Check for:

* unrelated refactors
* hidden architectural changes
* unexpected behavior changes
* unnecessary file modifications

Small predictable changes are preferred.

---

# 4. Maintainability

Verify that implementation remains understandable and maintainable.

Check for:

* readability
* explicit logic
* unnecessary complexity
* hidden behavior
* confusing abstractions

Systems should remain operationally understandable.

---

# 5. Simplicity

Verify that implementation solves the problem without unnecessary complexity.

Check for:

* over-engineering
* speculative flexibility
* premature abstraction
* unnecessary indirection

Prefer simpler operationally correct solutions.

---

# 6. Strong Boundaries

Verify that system boundaries remain clear.

Check that:

* presentation layers do not contain business logic
* infrastructure does not define domain meaning
* persistence concerns remain isolated
* modules preserve responsibility separation

Avoid cross-layer leakage.

---

# 7. Explicitness

Verify that behavior remains explicit and understandable.

Check for:

* explicit contracts
* explicit naming
* explicit ownership
* predictable data flow

Avoid hidden assumptions whenever possible.

---

# 8. Type Safety

Verify that typing remains strong and intentional.

Check for:

* weak typing
* implicit contracts
* unsafe assumptions
* avoidable type ambiguity

Strong contracts improve maintainability and implementation stability.

---

# 9. Error Handling

Verify that failure scenarios are handled appropriately.

Check for:

* missing validation
* missing failure handling
* unsafe assumptions
* silent failure behavior

Operational systems should fail predictably.

---

# 10. Operational Stability

Verify that implementation preserves runtime stability.

Check for:

* unintended side effects
* unstable behavior
* state inconsistencies
* dangerous runtime assumptions

Systems should remain recoverable and observable.

---

# 11. Observability

Verify that systems remain operationally inspectable.

Check for:

* logging opportunities
* debugging visibility
* traceability
* inspectable behavior

Avoid implementation that obscures runtime behavior.

---

# 12. Existing Behavior Preservation

Verify that unrelated behavior has not changed unintentionally.

Check for:

* regressions
* altered workflows
* broken assumptions
* hidden UX changes

Preserve continuity unless intentional change is explicitly required.

---

# 13. Consistency

Verify that implementation follows existing system conventions.

Check for consistency in:

* naming
* structure
* architectural patterns
* module organization
* design direction

Avoid introducing unnecessary inconsistency.

---

# 14. AI Drift Detection

Verify that AI implementation did not introduce:

* speculative features
* unrelated redesigns
* architectural inventions
* hidden abstractions
* unnecessary dependencies

AI systems should operate within defined intent and constraints.

---

# 15. Dependency Review

Verify that new dependencies are operationally justified.

Check for:

* unnecessary packages
* duplicate tooling
* dependency bloat
* ecosystem instability

---

# 16. Realtime Regression Gate

For changes touching realtime/shared state/trip lifecycle, reviewers must verify:

* join/rejoin behavior remains correct for same trip vs new trip links
* shared expense create/delete converges across clients
* owner-only delete rules still hold
* trip deletion flow still evacuates all members safely
* previously fixed loop/crash regressions are not reintroduced

Prefer operational simplicity.

---

# 16. Documentation Alignment

Verify that documentation remains aligned with implementation.

Check whether updates are needed for:

* requirements
* design
* tasks
* workflows
* operational notes

Documentation should reflect system reality.

---

# 17. Reviewability

Verify that implementation remains reviewable.

Check for:

* excessively large diffs
* mixed concerns
* unclear intent
* difficult-to-follow changes

Prefer isolated and understandable modifications.

---

# 18. Production Thinking

Verify that implementation reflects production-oriented thinking.

Check for:

* validation
* recoverability
* operational safety
* maintainability
* observability

Production-oriented thinking should exist even in small systems.

---

# Pre-Merge Questions

Before merge, reviewers should be able to answer:

* Does this solve the intended problem?
* Is the architecture still clean?
* Is the implementation understandable?
* Are boundaries preserved?
* Is complexity justified?
* Is operational behavior stable?
* Is the system easier or harder to maintain after this change?

If uncertainty remains high, the implementation should be revised before merge.

---

# Rollback Awareness

Verify that changes remain recoverable if operational issues occur.

Check for:

* isolated changes
* reversible behavior
* controlled migration paths
* operational fallback safety

Systems should remain safely recoverable during failure scenarios.

---

# Complexity Drift Detection

Verify that implementation complexity remains proportional to the operational problem.

Check for:

* abstraction inflation
* unnecessary indirection
* speculative flexibility
* over-structured implementation

Complexity should solve operational problems, not theoretical possibilities.

---

# Final Principle

Reviews exist to preserve engineering integrity during long-term continuous development.

The objective is not maximum implementation speed.

The objective is stable, maintainable, production-oriented systems that evolve safely through structured human and AI collaboration.
