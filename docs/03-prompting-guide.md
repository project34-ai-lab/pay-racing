# 03-prompting-guide.md

# Prompting Guide

## Purpose

This document defines the prompting standards used within this engineering framework.

Prompting is treated as an engineering activity, not casual interaction.

The purpose of prompting is to produce:

* predictable implementation
* stable architectural alignment
* reduced AI drift
* maintainable outputs
* reviewable changes
* operational consistency

All prompts should align with these principles.

---

# 1. Prompts Must Be Scoped

Prompts should focus on one clear operational objective.

Avoid combining unrelated tasks into a single prompt.

Prefer:

* isolated implementation tasks
* isolated fixes
* isolated refactors
* isolated reviews

Smaller scoped prompts improve implementation stability and reviewability.

---

# 2. Architecture Must Exist Before Prompting

Do not ask AI systems to invent architecture during implementation.

Architecture should already be defined through:

* requirements
* design documents
* system boundaries
* operational direction

Prompts should implement architecture, not discover it.

---

# 3. Provide Operational Context

AI implementation should operate within explicit context.

Relevant context may include:

* requirements
* design constraints
* folder structure
* contracts
* existing patterns
* operational expectations

Provide only relevant context.

Avoid excessive unrelated information.

---

# 4. Constraints Must Be Explicit

Prompts should define constraints explicitly.

Examples include:

* preserve existing behavior
* avoid breaking API changes
* avoid unrelated refactors
* follow existing structure
* preserve architecture boundaries
* minimize file changes

Do not assume AI systems will infer constraints automatically.

---

# 5. Prefer Incremental Changes

Prefer prompts that create:

* isolated changes
* predictable diffs
* reviewable outputs
* small operational steps

Avoid broad rewrite prompts whenever possible.

---

# 6. Avoid Open-Ended Refactor Requests

Avoid prompts such as:

* improve everything
* optimize the architecture
* rewrite this system
* clean up the codebase

These prompts increase instability and architectural drift.

Refactors should always remain:

* scoped
* intentional
* reviewable
* operationally justified

---

# 7. Preserve Existing System Identity

AI implementation must preserve:

* product direction
* UX meaning
* architecture boundaries
* operational workflows
* domain language

AI should not redefine the product during implementation.

---

# 8. Prefer Explicit Deliverables

Prompts should define expected outputs clearly.

Examples:

* implement API endpoint
* add validation
* refactor module
* create DTO
* add loading state
* fix boundary violation

Avoid ambiguous implementation goals.

---

# 9. One Responsibility Per Prompt

A prompt should preferably produce one category of outcome.

Avoid combining:

* feature implementation
* architecture redesign
* dependency upgrades
* refactors
* UI redesign

inside a single request.

---

# 10. File Targets Should Be Clear

Whenever possible, prompts should specify:

* affected modules
* intended folders
* target files
* architectural boundaries

This reduces implementation ambiguity.

---

# 11. AI Output Must Be Reviewed

AI-generated implementation is never assumed correct by default.

Review should validate:

* correctness
* architectural alignment
* maintainability
* unintended side effects
* hidden complexity
* operational impact

Human review remains mandatory.

---

# 12. Avoid Prompting Through Emotion

Prompt quality should remain:

* explicit
* structured
* operational
* deterministic

Avoid prompting through frustration, urgency, or vague intent.

Operational clarity produces more stable engineering outcomes.

---

# 13. Documentation Is Part Of Prompting

Documentation acts as persistent operational context for AI systems.

Well-structured documentation reduces:

* prompt size
* ambiguity
* implementation drift
* repeated explanation

Documentation and prompting should operate together as one system.

---

# 14. AI Should Operate Within Existing Patterns

Prefer extending existing patterns over introducing new patterns unnecessarily.

Avoid prompting AI systems to create architectural inconsistency without operational justification.

Consistency improves:

* maintainability
* predictability
* reviewability
* long-term engineering velocity

---

# 15. Prefer Reviewable Engineering Velocity

The objective of prompting is not maximum code generation speed.

The objective is:

* stable delivery
* maintainable implementation
* predictable iteration
* operational continuity
* scalable engineering throughput

Fast unstable implementation reduces long-term velocity.

---

# 16. Preserve Human Ownership

AI assists implementation and reasoning.

Human remains responsible for:

* intent
* architecture
* operational direction
* acceptance decisions
* product meaning

AI should amplify engineering capability, not replace engineering judgment.

---

# Recommended Prompt Structure

A strong engineering prompt usually contains:

1. Context
2. Goal
3. Constraints
4. Target Scope
5. Expected Outcome
6. Validation Expectations

---

# Example Prompt Shape

Role:
Senior engineer working inside an existing architecture.

Context:
Relevant project and system context.

Goal:
One clear implementation objective.

Constraints:
Explicit operational and architectural constraints.

Files:
Relevant modules or folders.

Expected Outcome:
Clear implementation target.

Validation:
How correctness should be verified.

---

# Prefer Existing System Patterns

Before introducing new implementation approaches, AI systems should first inspect and reuse existing project patterns whenever operationally appropriate.

Prefer consistency with:

* existing modules
* existing UI patterns
* existing API flows
* existing architectural conventions

Avoid introducing parallel implementation styles unnecessarily.

---

# Success Criteria Should Be Explicit

Prompts should define what successful completion looks like.

Examples include:

* tests passing
* build succeeding
* no type errors
* API response matching contract
* UI behavior matching requirement

Clear success criteria improve implementation predictability.

---

# Final Principle

Prompting is treated as operational engineering orchestration.

The objective is not maximum AI activity.

The objective is creating:

* stable systems
* maintainable systems
* reviewable systems
* continuously evolving systems

through structured collaboration between human engineering judgment and AI implementation capability.
