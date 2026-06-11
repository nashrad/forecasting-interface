# Sprint 2.3: Pharma UX Standards Research — Summary
## Quick Overview for Team

---

## What We Researched

Comprehensive study of **regulatory compliance, configuration patterns, and power user expectations** in pharmaceutical software. Focus: How to build a configuration interface that is both **compliant and usable**.

---

## Key Findings at a Glance

### Finding 1: Web-Based Tools Can Be More Compliant Than Excel ✓

**If designed with:**
- Rigorous audit trails (who/what/when/why)
- Immutable configuration versions
- Multi-user review/approval workflows
- Mandatory change reasons
- Searchable, exportable audit logs (7-10 year retention)

**Implication:** Our forecasting tool should be web-based (modern UX). Just ensure audit trails are non-negotiable.

---

### Finding 2: Regulatory Reality (FDA 21 CFR Part 11 + GxP)

**What regulators actually care about:**

| Requirement | Why It Matters | UI Impact |
|------------|---------------|---------| 
| **Auditability** | Track every change | Every modification logged + searchable |
| **Reproducibility** | Forecast with same inputs = same outputs | Config versioning essential |
| **Transparency** | Justify decisions | Show formulas + assumptions; no black boxes |
| **Control** | Power users set assumptions | Don't use ML defaults; users choose parameters |
| **Documentation** | Regulatory submissions require proof | Config export (PDF + JSON) required |

**Key Acronym:** ALCOA (Attributable, Legible, Contemporaneous, Original, Accurate)
- Your audit trail must prove who changed what, when, and why
- Timestamps must be unambiguous (always UTC or explicit timezone)
- Records are immutable (append-only; never delete/modify)

---

### Finding 3: Pharma Users Prefer Versioning Over Undo

**Why this matters:**

| Approach | Audit Clarity | User Intent | Pharma Verdict |
|----------|---------------|-----------|---|
| Free Undo (Ctrl+Z) | Confusing (did they undo or redo?) | Unclear | ❌ Avoid |
| Explicit Version Revert | Crystal clear (reverted to v3.1) | Intentional | ✓ Use This |

**Pattern:**
```
Configuration History
├─ v3.2 (Active) — Created 2026-06-05, Approved by Dr. Johnson
├─ v3.1 (Approved) — Created 2026-05-20, Rejected: "needs update"
└─ v3.0 (Archived) — Created 2026-05-10
```

User clicks "Revert to v3.1" → New version created (v3.3) that matches v3.1 → Goes through review → Activated. Simple, auditable, familiar to Rave/Veeva users.

---

### Finding 4: Multi-User Workflows Are Non-Negotiable

**Regulatory expectation:** Single person should NOT have unilateral control over configuration.

**Pattern (Minimum):**
1. **Modeler** creates/edits configuration (draft)
2. **Reviewer** reviews parameters, approves
3. Configuration goes active

**Pattern (Full):**
1. **Modeler** creates/edits
2. **Reviewer (Tech)** checks statistical assumptions
3. **Approver (Authority)** final sign-off
4. Configuration goes active

**UI Implication:** Configuration has statuses: Draft → Submitted → Approved → Active → Superseded

---

### Finding 5: Configuration Export Is Essential

**What to export:**
- **PDF Report:** All parameters, assumptions, audit trail (for archiving)
- **JSON:** Machine-readable for re-import, comparison, version control

**Why:** Pharma teams submit configurations to regulators. Without export, the tool becomes a black box regulators won't accept.

---

### Finding 6: Live Preview During Configuration is OK (With Caveats)

**Safe approach:**
- Show live-updating forecast while user edits config (modern UX)
- Label it clearly: "ⓘ PREVIEW (Not Validated) — Do Not Use for Decisions"
- Lock forecast only after configuration is validated/approved

**Unsafe approach:**
- User sees live forecast and thinks it's locked
- Forecast used for decisions before configuration is approved
- Audit trail doesn't match which config was actually used

**Implication:** Live preview is fine. Just make sure users understand it's "draft until approved."

---

### Finding 7: Black-Box Forecasting Fails Audits

**Regulators will NOT accept:**
- "Our proprietary algorithm predicts X" (no visibility)
- Forecast with no confidence intervals
- Assumptions buried in the tool; not visible to user

**Regulators WILL accept:**
- "Based on enrollment rate (7/wk) + dropout rate (15%), we forecast 250 patients"
- Confidence intervals: 90% CI [240, 260]
- Sensitivity: "If enrollment ↓20%, forecast extends to 65 weeks"
- Source documentation: "Enrollment rate from FDA feedback call 2026-06-04"

**Implication:** Always show the formula. Transparency is a feature, not a liability.

---

### Finding 8: Real-Time Validation (Non-Blocking) + Batch Validation (Blocking)

**During configuration (real-time, non-blocking):**
- Format checks ("Must be numeric")
- Range warnings ("This is above typical; confirm?")
- Dependency hints ("If you change this, X also changes")

**On save/finalize (batch, blocking):**
- Cross-parameter validation ("Total allocation must = 100%")
- Model convergence ("Forecast algorithm succeeded or failed?")
- Regulatory checks ("If GCP study, these fields are mandatory")

**Result:** Users get guidance without frustration. Critical errors block save.

---

## Real-World Examples (3 Case Studies)

### Case Study 1: Medidata Rave (Clinical Trial EDC)
**Gold standard for compliance**
- Study config created in wizard; locked once patient enrollment starts
- Post-freeze changes require formal change control
- Audit trail exported to XML for regulatory submission
- Industry-wide standard; most regulators know it

**Lesson:** Configuration locking works. Users understand it.

---

### Case Study 2: SimCYP (Pharmacokinetic Modeling)
**Power users want transparency**
- All assumptions documented with sources
- Sensitivity analysis shows which inputs drive outputs most
- Confidence intervals and model-fit metrics shown
- Users accept black-box pharmacokinetic equations because parameters are fully transparent

**Lesson:** Hide the math if needed, but never hide the inputs. Power users trust control over simplicity.

---

### Case Study 3: Veeva Vault Clinical (Modern Alternative to Rave)
**Cloud-native, modern UX + compliance**
- Real-time collaboration with staged change control
- Live preview of results during configuration
- Workflow: Modeler → Reviewer → Approver → Active
- Proves modern UX and compliance aren't mutually exclusive

**Lesson:** You don't need to choose between "good UX" and "compliant." Just get the audit trails right.

---

## Specific Recommendations for Our Tool

### 1. Configuration Interface Structure

```
Left: Sidebar Navigation    │ Center: Parameter Editing    │ Right: Live Preview
                            │                              │
Study Config (Tree)         │ Study Configuration          │ ⓘ PREVIEW (Not Validated)
├─ Setup                    │                              │ ───────────────────────
├─ Cohorts                  │ Study Duration:              │ Enrollment Forecast:
│ ├─ Cohort A              │ Start: [2026-06-01]         │ 250 patients
│ ├─ Cohort B              │ End:   [2027-06-01]         │ 90% CI: [240-260]
│ └─ Cohort C              │                              │ Duration: 52 weeks
├─ Enrollment              │ [Save Draft] [Submit Review] │
├─ Dropouts                │                              │
└─ Approvals               │                              │
```

**Why:** Familiar sidebar (Rave pattern) + form-based editing (modern) + preview (helpful feedback)

---

### 2. Version History & Change Control

```
Configuration: Enrollment-Forecast
v3.2 (Active since 2026-06-05)
├─ Created: Dr. Smith, 2026-06-04
├─ Submitted: Dr. Smith, 2026-06-05
├─ Approved: Dr. Johnson, 2026-06-05
└─ [View] [Deactivate] [Clone for v3.3]

v3.1 (Approved)
├─ Created: Dr. Smith, 2026-05-20
├─ Rejected: Dr. Johnson, 2026-06-01
│  Feedback: "Needs update based on FDA guidance"
└─ [View] [Activate]
```

**Why:** Clear ownership + decision history. Users understand why config exists.

---

### 3. Audit Trail

```
Audit Trail (searchable, exportable)

2026-06-05 14:32:45
APPROVED: Configuration v3.2
Dr. Johnson (Study Manager)
└─ Comment: "Approved for activation"

2026-06-04 16:45:30
CHANGED: Enrollment Rate (5 → 7 /week)
Dr. Smith (Biostatistician)
├─ Source: FDA feedback call 2026-06-04
├─ Reason: "Site monitoring data reviewed"
└─ Impact: Forecast duration 52 weeks → 37 weeks

[Filter] [Export PDF] [Show More]
```

**Why:** Searchable + exportable. Regulators can audit. Users understand impact.

---

### 4. Configuration Export

**On-demand PDF + JSON export:**

**PDF includes:**
- All parameters (current values + sources)
- Forecast results (point estimate + confidence intervals + sensitivity)
- Audit trail (summary of changes)
- Approval signatures (who approved, when)

**JSON includes:**
- Raw data (machine-readable for re-import)
- Versioning metadata
- All assumptions explicitly named
- Regulatory-ready format

---

### 5. Role-Based Access

- **Modeler:** Create/edit configs (draft mode)
- **Reviewer:** Review + approve (technical review)
- **Approver:** Final sign-off (optional, for high-stakes)
- **Viewer:** Read-only (audit, compliance teams)

---

## Design Principles (Decision Framework)

When you face trade-offs:

1. **Proportional Friction** — Friction matches risk (commenting: easy; locking config: hard)
2. **Transparency > Simplicity** — Show formulas; don't hide complexity
3. **Versioning > Undo** — Use explicit versions; free undo is forbidden
4. **Staged Commitment** — Draft ≠ locked (changes aren't committed until "save")
5. **Explainability by Default** — Users should explain why config exists
6. **Multi-User as Feature** — Oversight workflows are baseline
7. **Auditability by Design** — Changes logged automatically
8. **Openness to Guidance** — Tool guides toward compliance; doesn't force it

---

## Anti-Patterns to Avoid ❌

- ❌ Free undo/redo (audit trail ambiguous)
- ❌ Black-box forecasting (no formula shown)
- ❌ Optional change reasons (make mandatory)
- ❌ Short audit retention (minimum 7 years)
- ❌ No approval workflow (oversight required)
- ❌ Editing locked configs (lock means lock)
- ❌ No export (regulators need records)
- ❌ Forecast without context (show assumptions)
- ❌ Version ambiguity (which version is active?)
- ❌ In-place editing without versioning

---

## Confidence Levels

| Finding | Confidence | Why |
|---------|-----------|-----|
| FDA 21 CFR Part 11 requirements | Very High | Public regulation |
| GxP/ALCOA principles | Very High | FDA guidance |
| Rave/Veeva patterns | High | Public case studies |
| SimCYP patterns | High | Public documentation |
| General pharma UX conventions | High | Consistent across tools |

---

## Files in This Research Package

1. **`pharma-standards.md`** — Full research report (15,000 words)
   - Regulatory landscape (FDA, GxP, ALCOA)
   - 3 real case studies (Rave, SimCYP, Veeva)
   - Detailed patterns & best practices
   - Configuration template

2. **`decision-framework.md`** — Quick reference (3,000 words)
   - Yes/no questions for design choices
   - Comparison tables
   - Decision trees
   - Quick checklist

3. **`README.md`** — Navigation guide

---

## Next Steps

### For Product Manager
1. Review findings summary (this document)
2. Use decision framework for design approvals
3. Reference specific case studies when justifying choices

### For UX Designer
1. Start with decision framework for quick answers
2. Reference pharma-standards.md for detailed patterns
3. Use configuration template as starting point for wireframes

### For Engineering
1. Build audit trails first (non-negotiable)
2. Implement versioning system (not undo)
3. Design role-based access control
4. Add configuration export (PDF + JSON)

### For Compliance Review
1. Share regulatory landscape section
2. Reference ALCOA principles in audit design
3. Show multi-user workflow examples
4. Validate against 21 CFR Part 11 before build

---

## Key Success Metrics (From Sprint Brief)

✅ **Clear understanding of FDA/GxP impact on UX** — Yes. Audit trails, change control, transparency are core.
✅ **2-3 real pharma tools analyzed** — Yes. Rave, SimCYP, Veeva with detailed patterns.
✅ **Decision framework** — Yes. Quick reference for common design choices.
✅ **Confidence that web version won't raise red flags** — Yes. Web is acceptable if audit trails are rigorous.
✅ **Specific recommendations for audit trails, change control, validation** — Yes. Detailed patterns provided.

---

## The Bottom Line

**Pharma software succeeds by building trust through transparency, auditability, and control.**

Users accept (or even prefer) tools that:
- Show the formula
- Log every change
- Require approval for major changes
- Allow export for regulatory submission
- Version configurations instead of editing in-place

Users distrust (and avoid) tools that:
- Hide complexity
- Don't log changes
- Allow single-person control
- Can't be exported
- Use free undo

**Your web-based forecasting tool can be MORE compliant than Excel by getting these patterns right.**

---

**Research Completed:** June 2026
**Sprint:** 2.3
**Status:** Ready for Design & Implementation Phases

For questions, reference the full research document or decision framework.
