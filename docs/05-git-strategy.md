# 05-git-strategy.md

# Git Strategy

## Purpose

This document defines the Git workflow and repository management strategy used within this engineering framework.

Git workflows exist to preserve:

* operational stability
* implementation isolation
* review quality
* recoverability
* system continuity
* AI implementation safety

Version control is treated as an operational engineering system, not merely source storage.

---

# Core Principle

Repositories should preserve understandable and recoverable system history.

Git workflows should optimize for:

* safe iteration
* controlled change
* stable collaboration
* reviewable implementation
* operational continuity

---

# 1. Stable Branches Represent Operational Truth

Stable branches should represent the current stable operational state of the system.

Stable branches should remain:

* runnable
* reviewable
* understandable
* recoverable
* operationally stable

Avoid leaving stable branches in broken or experimental states.

---

# 2. Prefer Short-Lived Branches

Branches should remain:

* focused
* isolated
* short-lived
* reviewable

Long-running branches increase:

* merge complexity
* architectural drift
* operational divergence

Prefer incremental integration.

---

# 3. Branches Should Have Clear Intent

Each branch should represent one clear operational purpose.

Recommended categories include:

* feature/*
* fix/*
* refactor/*
* docs/*
* infra/*
* experiment/*

Avoid mixing unrelated concerns inside the same branch.

---

# 4. Scope Must Remain Controlled

A branch should contain only changes relevant to its intended purpose.

Avoid combining:

* feature work
* dependency upgrades
* architecture rewrites
* unrelated refactors
* formatting-only changes

inside the same branch whenever possible.

---

# 5. Preserve Reviewability

Changes should remain easy to review.

Prefer:

* isolated commits
* understandable history
* explicit intent
* small predictable diffs

Large uncontrolled changes reduce review quality and operational safety.

---

# 6. Documentation Should Evolve With Implementation

Relevant documentation should evolve alongside implementation changes.

Examples include:

* requirements
* design
* tasks
* workflows
* operational notes

Implementation and documentation should not diverge long-term.

---

# 7. Prefer Incremental Merges

Prefer smaller stable merges over large infrequent merges.

Incremental integration improves:

* recoverability
* review quality
* operational stability
* implementation traceability

---

# 8. Experimental Work Must Remain Isolated

Experimental implementation should remain isolated from stable operational workflows.

Use dedicated branches for:

* prototypes
* architecture experiments
* migration exploration
* tooling evaluation

Experimental work should not destabilize operational branches.

---

# 9. Avoid Rewrite-Oriented Workflows

Prefer incremental evolution over large rewrite branches.

Large rewrites increase risk of:

* architectural drift
* lost operational knowledge
* merge instability
* review failure
* hidden regressions

Rewrite only when operationally justified.

---

# 10. Commits Should Preserve Intent

Commits should communicate operational meaning clearly.

Prefer commits that explain:

* what changed
* why it changed
* intended operational effect

Avoid ambiguous or meaningless commit history.

---

# 11. Repository Structure Should Remain Predictable

Repository structure should remain:

* understandable
* stable
* intentionally organized
* operationally navigable

Avoid chaotic repository evolution.

---

# 12. Monorepos Are Preferred By Default

Monorepos are preferred unless operational constraints justify separation.

Monorepos improve:

* shared operational context
* dependency visibility
* workflow consistency
* implementation coordination
* operational continuity

Repository boundaries should be intentional.

---

# 13. AI-Generated Changes Must Be Reviewed

AI-generated implementation should never bypass review workflows.

All AI-generated changes should be inspected for:

* correctness
* unintended side effects
* architectural alignment
* maintainability
* operational stability

AI speed must not bypass engineering discipline.

---

# 14. Preserve Recoverability

Repositories should remain operationally recoverable.

Avoid workflows that create:

* unclear history
* unstable integration states
* hidden dependency changes
* difficult rollback scenarios

Operational recovery matters.

---

# 15. Stable Velocity Over Maximum Velocity

Git workflows should optimize for sustainable engineering throughput.

The objective is not maximum merge speed.

The objective is:

* stable iteration
* safe delivery
* maintainable systems
* operational continuity

---

# Recommended Branch Naming

Recommended naming conventions:

* feature/*
* fix/*
* refactor/*
* docs/*
* infra/*
* experiment/*

Examples:

* feature/auth-refresh-flow
* fix/login-validation
* refactor/api-boundaries
* docs/workflow-update
* infra/docker-cleanup

Naming should communicate operational intent clearly.

---

# Recommended Workflow

Recommended engineering workflow:

idea
→ architecture discussion
→ documentation context
→ scoped branch
→ AI implementation
→ review
→ validation
→ documentation synchronization
→ merge into stable branch
→ stable operational snapshot

---

# Prefer Recoverable Checkpoints

Prefer creating stable recoverable checkpoints during major implementation phases.

Checkpoints improve:

* rollback safety
* experimentation confidence
* operational recovery
* AI iteration safety

Recoverable progress is preferred over fragile rapid progress.

---

# Avoid Mixed Operational Sessions

Avoid combining unrelated implementation objectives inside the same operational session or branch.

Mixed AI implementation sessions increase:

* implementation drift
* review difficulty
* hidden side effects
* operational ambiguity

---

# Final Principle

Git workflows exist to preserve:

* stable engineering workflows
* implementation clarity
* recoverability
* reviewability
* long-term operational continuity

through disciplined human and AI collaboration.