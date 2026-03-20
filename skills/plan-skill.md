---
name: planning
description: >
  Create structured, actionable plans for projects and technical work. Use this skill
  whenever the user asks for a plan, roadmap, milestone breakdown, sprint plan, technical
  architecture plan, deployment plan, project timeline, or any kind of structured
  strategy document. Also trigger for: "how do I approach X", "help me plan Y",
  "break this down into steps", "what's the timeline for Z", "how should we structure
  this project", "create a roadmap", "what are the phases", "help me prioritize",
  "give me a sprint plan", or any request where the user wants to turn a goal or idea
  into an organized, step-by-step execution plan. If the user mentions a goal, deadline,
  or deliverable — use this skill to help them structure it, even if they don't say "plan".
---

# Planning Skill

A comprehensive guide for creating clear, structured, and actionable plans — from
high-level project roadmaps to granular technical execution plans.

---

## Quick Decision Tree

Identify the plan type first, then jump to the matching section:

| What the user needs | Plan type | Jump to |
|---|---|---|
| Product / feature roadmap | Project Plan | [Section 1](#1-project-plan--roadmap) |
| Timeline with milestones | Milestone Plan | [Section 2](#2-milestone--timeline-plan) |
| Software architecture | Technical Architecture Plan | [Section 3](#3-technical-architecture-plan) |
| Sprint / iteration planning | Sprint Plan | [Section 4](#4-sprint--iteration-plan) |
| Deployment / release plan | Deployment Plan | [Section 5](#5-deployment--release-plan) |
| Risk, dependencies, assumptions | Risk & Dependency Map | [Section 6](#6-risk--dependency-map) |
| Any plan — general structure | Universal Planning Rules | [Section 7](#7-universal-planning-rules) |

---

## Before Writing Any Plan

Always clarify these 5 things before drafting. If the user hasn't provided them, ask:

```
1. GOAL     — What does success look like? What's the end state?
2. SCOPE    — What's in? What's explicitly out?
3. DEADLINE — Is there a hard date, or is this flexible?
4. TEAM     — Who is involved? What are their roles/capacity?
5. CONSTRAINTS — Budget, tech stack, dependencies, or blockers?
```

If the user can't answer all 5, still produce the plan — but call out assumptions
explicitly at the top using the Assumptions block (see Section 7).

---

## 1. Project Plan / Roadmap

Use for: product roadmaps, feature planning, initiative planning, quarterly goals.

### Output Template

```markdown
# Project Plan: [Project Name]

**Goal:** [One sentence — what this project achieves and why it matters]
**Owner:** [Name or team]
**Start Date:** [Date]
**Target Completion:** [Date]
**Status:** [Not Started | In Progress | On Hold | Complete]

---

## Assumptions
- [List any assumptions made due to missing information]

## Out of Scope
- [Explicitly list what this plan does NOT cover]

---

## Phases Overview

| Phase | Description | Duration | Status |
|---|---|---|---|
| Phase 1 | [Name] | [X weeks] | [ ] |
| Phase 2 | [Name] | [X weeks] | [ ] |
| Phase 3 | [Name] | [X weeks] | [ ] |

---

## Phase 1: [Name]

**Goal:** [What this phase delivers]
**Duration:** [Start → End]
**Owner:** [Team or person]

### Deliverables
- [ ] [Deliverable 1] — [Owner] — Due: [Date]
- [ ] [Deliverable 2] — [Owner] — Due: [Date]

### Key Tasks
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

### Exit Criteria
> This phase is complete when: [specific, measurable condition]

---

## Phase 2: [Name]
[Repeat structure]

---

## Phase 3: [Name]
[Repeat structure]

---

## Dependencies
- [Phase 2] depends on [Phase 1 Exit Criteria]
- [Task X] depends on [external team / vendor / approval]

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk 1] | High/Med/Low | High/Med/Low | [Mitigation action] |

## Success Metrics
- [Measurable KPI 1]
- [Measurable KPI 2]
```

### Rules for Project Plans
- Each phase must have clear **Exit Criteria** — not "done" but a measurable condition
- Deliverables must be concrete nouns, not verbs ("API documentation", not "document the API")
- Always include an "Out of Scope" section — this prevents scope creep
- Phases should not overlap unless explicitly intended (mark parallelism clearly)

---

## 2. Milestone / Timeline Plan

Use for: deadline-driven work, client deliverables, launch timelines.

### Output Template

```markdown
# Timeline: [Project Name]

**Final Deadline:** [Date]
**Total Duration:** [X weeks / months]

---

## Milestones

### M1 — [Milestone Name]
**Due:** [Date]
**Description:** [What is delivered / achieved]
**Owner:** [Name]

Deliverables:
- [ ] [Item 1]
- [ ] [Item 2]

---

### M2 — [Milestone Name]
**Due:** [Date]
**Description:** [What is delivered / achieved]
**Owner:** [Name]

Deliverables:
- [ ] [Item 1]
- [ ] [Item 2]

---

### M3 — [Milestone Name] ← Final
**Due:** [Date = Final Deadline]
**Description:** [Launch / handoff / sign-off]

---

## Timeline Summary

```
Week 1-2   ████░░░░░░░░  M1: [Name]
Week 3-5   ░░░████░░░░░  M2: [Name]
Week 6-8   ░░░░░░░████░  M3: [Name] ← Launch
```

## Buffer
- Built-in buffer: [X days/weeks] before final deadline
- Buffer location: [Between M2 and M3]
```

### Rules for Milestone Plans
- Work backwards from the deadline — place the final milestone first, then fill in preceding ones
- Build in at least 10–15% buffer before the hard deadline
- Each milestone must be independently verifiable — a stakeholder should be able to confirm it's done
- Avoid milestones that are purely internal and invisible to the outcome (e.g., "had meetings")

---

## 3. Technical Architecture Plan

Use for: new system design, major refactors, infrastructure decisions, API design.

### Output Template

```markdown
# Technical Architecture Plan: [System / Feature Name]

**Author:** [Name]
**Date:** [Date]
**Status:** [Draft | Review | Approved]
**Reviewers:** [Names]

---

## Problem Statement
[1–3 sentences: what problem does this architecture solve?]

## Goals
- [Technical goal 1]
- [Technical goal 2]

## Non-Goals
- [What this design explicitly does NOT address]

---

## Proposed Architecture

### Overview
[High-level description of the system. Include a simple ASCII diagram or describe
the components and their relationships clearly.]

```
[Client] → [API Gateway] → [Service A] → [Database]
                        ↘ [Service B] → [Cache]
```

### Components

#### [Component 1 Name]
- **Responsibility:** [What it does]
- **Technology:** [Stack / language / service]
- **Interfaces:** [What it exposes / consumes]
- **Scaling:** [Horizontal / vertical / stateless]

#### [Component 2 Name]
- **Responsibility:** [What it does]
- **Technology:** [Stack / language / service]
- **Interfaces:** [What it exposes / consumes]

### Data Flow
1. [Step 1: User triggers X]
2. [Step 2: Request goes to Y]
3. [Step 3: Y calls Z]
4. [Step 4: Response returns to user]

### Data Model (if applicable)
```
[Entity]: [fields]
[Entity]: [fields]
Relationships: [describe]
```

---

## Alternatives Considered

| Option | Pros | Cons | Decision |
|---|---|---|---|
| [Option A — Chosen] | [Pros] | [Cons] | ✅ Chosen |
| [Option B] | [Pros] | [Cons] | ❌ Rejected |
| [Option C] | [Pros] | [Cons] | ❌ Rejected |

---

## Implementation Phases

### Phase 1: Foundation [Week 1–2]
- [ ] [Task: set up X]
- [ ] [Task: implement Y]

### Phase 2: Core Features [Week 3–5]
- [ ] [Task]
- [ ] [Task]

### Phase 3: Hardening [Week 6–7]
- [ ] Tests (unit, integration, e2e)
- [ ] Performance benchmarks
- [ ] Security review
- [ ] Documentation

---

## Risks & Open Questions

| Item | Type | Owner | Resolution |
|---|---|---|---|
| [Risk/Question 1] | Risk / Question | [Name] | [Status or plan] |

## Security Considerations
- [Auth/authz approach]
- [Data sensitivity / encryption]
- [Attack surface / mitigations]

## Performance Targets
- [Latency target: e.g., p99 < 200ms]
- [Throughput target: e.g., 1000 req/s]
- [Availability target: e.g., 99.9%]

## Observability
- Logging: [approach]
- Metrics: [what to measure]
- Alerts: [thresholds and owners]
```

### Rules for Architecture Plans
- Always document **alternatives considered** — it shows due diligence and prevents re-litigating decisions
- Separate **what** from **how** — the architecture section describes structure, the implementation phases describe execution
- Include non-goals explicitly — they prevent architecture from being blamed for problems it wasn't designed to solve
- Every component must have a single clear responsibility

---

## 4. Sprint / Iteration Plan

Use for: agile sprints, weekly iterations, team planning cycles.

### Output Template

```markdown
# Sprint [N] Plan

**Sprint Goal:** [One sentence — what this sprint achieves]
**Duration:** [Start Date] → [End Date] ([X days])
**Team:** [Names or team name]
**Capacity:** [X story points / X person-days available]

---

## Sprint Goal
> [Repeat the goal prominently. Every task should trace back to this.]

---

## Backlog Items

### Must Have (committed)

| ID | Title | Owner | Estimate | Status |
|---|---|---|---|---|
| #[N] | [Task title] | [Name] | [Xh / Xpts] | [ ] Todo |
| #[N] | [Task title] | [Name] | [Xh / Xpts] | [ ] Todo |

**Total committed:** [X pts / X hrs]

### Should Have (stretch goals)

| ID | Title | Owner | Estimate |
|---|---|---|---|
| #[N] | [Task title] | [Name] | [Xh] |

---

## Daily Focus

| Day | Focus Area | Who |
|---|---|---|
| Monday | [e.g., DB schema + API scaffold] | [Name] |
| Tuesday | [e.g., Core feature implementation] | [Name] |
| Wednesday | [e.g., Integration + review] | [Name] |
| Thursday | [e.g., Tests + bug fixes] | [Name] |
| Friday | [e.g., Demo prep + retrospective] | [Name] |

---

## Dependencies & Blockers
- [Dependency 1: waiting on X from Y team]
- [Blocker: environment not set up — owner: Z]

## Definition of Done
A task is done when:
- [ ] Code is written and reviewed (PR approved)
- [ ] Tests pass (unit + integration)
- [ ] Deployed to staging
- [ ] Acceptance criteria met
- [ ] Documentation updated (if applicable)

## Sprint Retrospective Notes (fill at end)
**What went well:**
- 

**What to improve:**
- 

**Action items for next sprint:**
- 
```

### Rules for Sprint Plans
- Sprint goal must be a single sentence — if you need more, the sprint is unfocused
- Never commit more than 70–80% of team capacity (leave room for bugs, meetings, the unexpected)
- Blockers go at the top — they need the most urgent attention
- Definition of Done must be agreed upon before the sprint starts, not at review time

---

## 5. Deployment / Release Plan

Use for: software releases, infrastructure rollouts, major changes to production.

### Output Template

```markdown
# Deployment Plan: [Feature / Release Name]

**Version:** [v1.2.3]
**Deploy Date:** [Date + Time + Timezone]
**Deploy Owner:** [Name]
**On-call During Deploy:** [Name + contact]
**Estimated Duration:** [X minutes]

---

## Pre-Deployment Checklist

### 48 Hours Before
- [ ] All PRs merged to main / release branch
- [ ] CI/CD pipeline passing (all checks green)
- [ ] Staging environment tested and signed off by QA
- [ ] Database migration scripts reviewed and tested on staging
- [ ] Feature flags configured
- [ ] Rollback plan documented (see below)
- [ ] Stakeholders notified of maintenance window

### 1 Hour Before
- [ ] Create DB backup / snapshot
- [ ] Verify monitoring dashboards are live
- [ ] Alert thresholds confirmed
- [ ] On-call engineer confirmed and available
- [ ] Rollback commands ready to paste (not to look up)

---

## Deployment Steps

### Step 1: [e.g., Run database migrations]
```bash
[exact command]
```
**Expected output:** [what success looks like]
**If it fails:** [exact action to take]

### Step 2: [e.g., Deploy backend service]
```bash
[exact command]
```
**Expected output:** [what success looks like]
**If it fails:** [exact action to take]

### Step 3: [e.g., Deploy frontend]
```bash
[exact command]
```
**Expected output:** [what success looks like]
**If it fails:** [exact action to take]

### Step 4: Smoke Tests
- [ ] [Test: homepage loads]
- [ ] [Test: login works]
- [ ] [Test: [critical user flow] works end-to-end]
- [ ] [Test: no error spike in logs]

---

## Rollback Plan

**Trigger rollback if:**
- Error rate exceeds [X%] within [Y minutes] of deploy
- [Critical feature] is broken
- Any smoke test fails

**Rollback steps:**
```bash
# Step 1: Revert service
[exact rollback command]

# Step 2: Revert DB migration (if applicable)
[exact rollback command]
```

**Rollback owner:** [Name]
**Estimated rollback time:** [X minutes]

---

## Post-Deployment

### First 30 Minutes
- [ ] Monitor error rates in [tool]
- [ ] Monitor latency in [tool]
- [ ] Check [key business metric] is normal
- [ ] Confirm feature flags enabled for target users

### Next 24 Hours
- [ ] Review logs for anomalies
- [ ] Check support tickets for new issues
- [ ] Confirm analytics are tracking correctly

---

## Communication

| Event | Channel | Owner |
|---|---|---|
| Deploy started | [Slack #deploys] | [Name] |
| Deploy complete | [Slack #deploys + #product] | [Name] |
| Issues found | [Incident channel] | On-call |
| All clear | [Slack #deploys] | [Name] |
```

### Rules for Deployment Plans
- Write rollback commands **before** the deploy — never look them up under pressure
- Every step must have "if it fails" instructions — ambiguity is the enemy during incidents
- Smoke tests must cover the **critical user path**, not just "does the server start"
- Define the rollback trigger threshold in advance — don't make that call under stress

---

## 6. Risk & Dependency Map

Add this section to any plan when complexity or uncertainty is high.

### Output Template

```markdown
## Risk Register

| ID | Risk | Category | Likelihood | Impact | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|---|
| R1 | [Risk description] | Technical/People/External | H/M/L | H/M/L | [H×H=9] | [Action] | [Name] |
| R2 | [Risk description] | | | | | | |

**Score = Likelihood × Impact (H=3, M=2, L=1)**
- 7–9: Critical — address immediately
- 4–6: High — mitigation plan required
- 1–3: Low — monitor only

---

## Dependency Map

| Dependency | Type | Blocking? | Owner | Due | Status |
|---|---|---|---|---|---|
| [What we need] | Internal / External / Technical | Yes / No | [Team] | [Date] | [Status] |

---

## Assumptions Log

| Assumption | If Wrong... | Validation Plan |
|---|---|---|
| [We assumed X] | [Impact if X is false] | [How/when we'll confirm X] |
```

---

## 7. Universal Planning Rules

Apply these to **every plan**, regardless of type:

### Structure Rules
- Start with **goal and success criteria** — every other element serves these
- Include **Out of Scope** in every plan — this is as important as what's in scope
- Use **concrete, measurable deliverables** — not activities (not "work on X", but "ship X")
- Date every plan and note the **author / owner**
- Mark the plan's **status** clearly (Draft / Review / Approved / Active / Done)

### Estimation Rules
- Always provide estimates as **ranges**, not single points (`3–5 days`, not `4 days`)
- Add **buffer** of 20–30% for unknowns on any estimate longer than 1 week
- Distinguish **effort** (person-hours) from **calendar time** (days with meetings, reviews, blockers)
- Call out **assumptions behind estimates** — estimates are wrong when assumptions are wrong

### Prioritization Framework

When scope needs to be cut, apply **MoSCoW**:

```
Must Have   — Non-negotiable. Plan fails without this.
Should Have — High value, but workarounds exist.
Could Have  — Nice to have. Cut first if time is short.
Won't Have  — Explicitly out of scope for this version.
```

### Communication Rules
- Every plan must have a **single owner** — committees own nothing
- Include a **review / approval date** so the plan doesn't become stale
- Link the plan to its **source of truth** (Jira board, GitHub project, Notion page)
- Plans are living documents — version them or date-stamp updates

### The Planning Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Fix |
|---|---|---|
| Planning at day-level granularity 3 months out | False precision — the future changes | Plan in weeks for anything >1 month out |
| No exit criteria per phase | Phases never "end" officially | Write measurable conditions for phase completion |
| Tasks assigned to teams, not people | Everyone's responsible = no one is | Every task has exactly one DRI (Directly Responsible Individual) |
| Omitting dependencies | Unblocks become surprises | Explicitly map what each phase needs from others |
| No buffer | First delay cascades into everything | Reserve 15–20% of timeline as buffer |
| Plan is only in someone's head | Bus factor = 1 | Always write it down, even imperfectly |

---

## Output Quality Checklist

Before finalizing any plan, verify:

- [ ] Goal is stated in one sentence and measurable
- [ ] Out of Scope is explicitly listed
- [ ] Every deliverable is a concrete noun, not a verb phrase
- [ ] Every task has exactly one owner
- [ ] Every phase/milestone has a clear exit criterion
- [ ] Risks are identified with mitigations
- [ ] Dependencies are mapped
- [ ] Assumptions are documented
- [ ] Buffer is built in
- [ ] Plan has a review/expiry date
