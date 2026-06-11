# Pharma UX Decision Framework
## Quick Reference for Configuration Interface Design

**Purpose:** Fast decision-making guide for design choices. Reference the detailed standards document for deep-dives.

---

## Configuration Visibility: In-Place Editing vs. Versioning

### Question: Can users edit configuration directly, or must they create versions?

| Choice | Pros | Cons | Pharma Verdict |
|--------|------|------|---|
| **In-Place Editing** (Edit modal updates live) | Fast for power users; familiar Excel-like | Audit trail complex (keystroke logs); users can undo/redo; version history unclear | ❌ Avoid |
| **Versioning** (Each edit creates new version) | Clean audit trail; explicit history; familiar (Rave pattern) | Slower iteration; extra clicks | ✅ Recommended |

**Decision Rule:** Use **versioning**. Create new version on each save; archive old versions. Users can "revert" by activating a prior version.

---

## Live Forecast Preview

### Question: Should users see live-updating forecasts while editing configuration?

| Choice | Pros | Cons | Pharma Verdict |
|--------|------|------|---|
| **No Preview** (Forecast only after "Finalize") | Safe; clear separation of draft/locked | Users fly blind; can't see impact until final step | ⚠️ Conservative |
| **Read-Only Preview** (Live update, clearly labeled "Draft") | Helps users understand impact; modern UX | Users might be confused about whether it's locked | ✅ Acceptable |
| **Editable Preview** (Live update, changes are committed) | Simplest UX | Violates audit trail clarity; users get confused | ❌ Avoid |

**Decision Rule:** Show **live preview during drafting**, clearly labeled "Preview - Do Not Use for Decisions." Lock and finalize when user clicks "Validate Configuration."

---

## Validation: Real-Time vs. Batch

### Question: When should validation errors block users?

| Approach | When to Use | Example |
|----------|------------|---------|
| **Real-time (non-blocking)** | Format checks, range warnings, basic logic | "Enrollment rate is above typical; confirm intentional?" |
| **Batch (on finalize)** | Complex cross-parameter checks, model convergence | "Total allocation ≠ 100%; fix before saving" |
| **Staged** (real-time warnings + batch blocking) | Best for pharma | Real-time guides; batch prevents invalid saves |

**Decision Rule:** Use **staged validation**. Real-time warnings are helpful but non-blocking. Batch validation blocks save if critical rules fail.

---

## Change Control Workflow

### Question: How many approval steps before configuration goes active?

| Model | Complexity | Overhead | Pharma Verdict |
|-------|-----------|----------|---|
| **No Approval** (User creates, config auto-activates) | Minimal | Zero | ❌ Too risky |
| **Single Review** (Tech review only; auto-activates on approval) | Moderate | 1 step | ✅ Minimum |
| **Reviewer + Approver** (Tech review + authority sign-off) | High | 2 steps | ✅ Standard |
| **Reviewer + Approver + Legal** (3+ steps) | Very High | 3+ steps | ⚠️ Over-compliance |

**Decision Rule:** Start with **single reviewer**. If this is high-stakes (patient safety, high cost), add **final approver** step. No more than 2 approval roles.

---

## Undo & Revert

### Question: Should users be able to undo changes?

| Approach | Audit Trail Impact | Pharma Verdict |
|----------|-------------------|---|
| **Free Undo** (Ctrl+Z reverts changes) | Unclear (is change undone or redone?); audit trail confusing | ❌ Avoid |
| **Explicit Revert** (User navigates to prior version, clicks "revert") | Clear (revert is a discrete action); audit trail shows explicit reversion | ✅ Recommended |
| **No Revert** (Only create new config) | Very safe but rigid | ⚠️ Too defensive |

**Decision Rule:** Use **explicit versioning revert**. "Undo" is replaced by "View Version History → Activate Prior Version."

---

## Reason for Change Capture

### Question: Should every configuration change require a "reason"?

| Approach | Friction | Audit Value | Pharma Verdict |
|----------|----------|-------------|---|
| **Optional** (User can skip) | Low | Minimal (many entries have no reason) | ❌ Ineffective |
| **Mandatory** (Required for save) | High | High (every change is explained) | ✅ Required |
| **Context-Aware** (Mandatory only for major changes) | Moderate | Good (covers high-risk changes) | ✅ Acceptable |

**Decision Rule:** Mandatory "reason for change" on **every modification** to parameters. Can be simple (dropdown: regulatory, data, protocol, other).

---

## Configuration Lock/Freeze

### Question: Can locked configurations be edited?

| Approach | Flexibility | Compliance | Pharma Verdict |
|----------|------------|-----------|---|
| **Never** (Locked = immutable) | Low (must create new config to change) | High (no ambiguity) | ✓ Recommended |
| **With Change Control** (Locked but editable if approved) | Moderate | Good (changes tracked) | ✓ Acceptable |
| **Free Edit** (No locking) | High (easy iteration) | Low (audit trail unclear) | ✗ Avoid |

**Decision Rule:** Locked configurations should be **immutable**. Changes → create new version → go through review cycle again.

---

## Multi-User Collaboration

### Question: Can multiple users edit the same configuration simultaneously?

| Approach | Usability | Compliance Risk | Pharma Verdict |
|----------|-----------|-----------------|---|
| **Sequential Locks** (Only one user can edit) | Low (queuing) | Very safe | ✓ Conservative |
| **Concurrent Editing with Conflict Resolution** (Modern, like Google Docs) | High | Medium (conflicts unclear) | ⚠️ Risky |
| **Draft + Formal Handoff** (One user at a time; explicit "pass to reviewer") | Moderate | High (clear ownership) | ✓ Recommended |

**Decision Rule:** Use **draft + handoff pattern**. One user owns the draft. When submitted for review, it becomes read-only. Next user (reviewer) has explicit ownership.

---

## Export & Documentation

### Question: Should the tool export configuration for archiving?

| Format | Use Case | Pharma Value | Implementation |
|--------|----------|-------------|---|
| **PDF Report** | Regulatory submission, archiving | High (human-readable, locked format) | ✓ Essential |
| **JSON/XML** | Re-import, comparison, version control | High (machine-readable, portable) | ✓ Essential |
| **Excel/CSV** | Power users want to analyze further | Medium (familiar but risky) | ✓ Nice-to-have |

**Decision Rule:** Export **PDF + JSON** as minimum. Allow PDF generation on-demand; JSON export for deep analysis.

---

## Audit Trail Retention

### Question: How long should audit logs be retained?

| Duration | Use Case | Pharma Standard |
|----------|----------|---|
| **90 days** | Quick reference | Too short |
| **1 year** | Typical financial audit | Still short for pharma |
| **7-10 years** | Study lifecycle | ✓ Standard for Phase III trials |
| **Indefinite** | Published studies | ✓ Recommended |

**Decision Rule:** Retain audit logs for **minimum 7 years** (or study closure +7 years, whichever is longer). Preferably indefinite.

---

## Role-Based Access

### Question: What roles should the system support?

| Role | Capabilities | Required? |
|------|-------------|-----------|
| **Modeler** | Create/edit configurations (draft) | Yes |
| **Reviewer** | Review and provide feedback | Yes (for oversight) |
| **Approver** | Final sign-off; activate configuration | Yes (for authority) |
| **Viewer** | Read-only access (auditors, compliance) | Yes (for audit) |
| **Admin** | Manage users, retention policies | Yes (for operations) |

**Decision Rule:** Implement at least **modeler, reviewer, approver** roles. Add **viewer** for compliance. Admin is backend only.

---

## Sensitivity Analysis & Uncertainty

### Question: Should forecasts include confidence intervals or sensitivity ranges?

| Approach | User Understanding | Transparency | Pharma Verdict |
|----------|-------------------|------------|---|
| **Point Estimate Only** ("Enrollment = 250") | Simple but misleading | Low | ❌ Avoid |
| **Confidence Intervals** ("250 ± 20 patients") | Better | Better | ✓ Recommended |
| **Sensitivity Analysis** ("If enrollment ↓20%, result = 200") | Best | Excellent | ✓ Essential |
| **All Three** (Point + CI + Sensitivity) | Comprehensive but complex | Excellent | ✓ Ideal |

**Decision Rule:** Include **confidence intervals + sensitivity analysis**. Show assumptions that drive largest variance.

---

## Transparency on Forecasting Logic

### Question: How much of the forecasting algorithm should be visible?

| Approach | Trust | Auditability | Pharma Verdict |
|----------|-------|-------------|---|
| **Black Box** ("Our proprietary model predicts...") | Low | Impossible | ❌ Avoid |
| **Transparent Formula** (Show equation; explain parameters) | High | Easy | ✓ Recommended |
| **Full Code + Derivation** (GitHub + paper) | Very High | Complete | ✓ Ideal (if possible) |

**Decision Rule:** **Always show the formula**. If using statistical models, explain assumptions. If using ML, provide sensitivity analysis and explainability tools.

---

## Version Naming & Clarity

### Question: How should configuration versions be named?

| Scheme | Example | Pharma Verdict |
|--------|---------|---|
| **Timestamps** (2026-06-05-14-32) | Precise but hard to remember | ⚠️ Okay |
| **Semantic Versioning** (v1.0, v1.1, v2.0) | Familiar but vague | ✓ Good |
| **Descriptive** (v3.2-FDA-Feedback) | Clear; intent obvious | ✓ Excellent |
| **Hybrid** (v3.2-FDA-Feedback [2026-06-05]) | Best of all | ✓ Recommended |

**Decision Rule:** Use **hybrid naming**: `v{major}.{minor}-{descriptor} [{date}]`
Example: `v3.2-FDA-Feedback [2026-06-05]`

---

## Web vs. Desktop

### Question: Should this be a web app or desktop software?

| Platform | Compliance Risk | User Expectations | Pharma Verdict |
|----------|-----------------|------------------|---|
| **Web (cloud)** | Requires rigorous audit trails, HIPAA/GDPR | Modern, familiar, collaborative | ✓ Acceptable (with rigor) |
| **Desktop** | Easier to lock down locally | Older user base; less collaboration | ✓ Safe |
| **Hybrid** (Web + offline export) | Best of both | Portable + collaborative | ✓ Ideal |

**Decision Rule:** **Web is acceptable** if audit trails are rigorous. Bias toward web (modern UX). Offer export for local analysis.

---

## Quick Decision Tree

```
Designing a config feature?

1. Is it a configuration change?
   → Requires audit log entry (who, what, when, why)
   → If yes, continue to 2

2. Can users make this change freely?
   → No → Add approval workflow
   → Yes → Add optional reason capture

3. Will this change affect forecasts?
   → Yes → Lock forecast; mark as "superseded"
   → No → OK to remain editable

4. Can users undo this change?
   → Use explicit version revert (not Ctrl+Z)
   → Never free undo

5. Should this change go live immediately?
   → No → Create draft version first
   → Yes (if approved) → Activate version

6. Must this be auditable?
   → Mandatory for everything in pharma
   → Non-negotiable
```

---

## Common Anti-Patterns: Yes/No Checklist

- ❌ In-place editing without versioning
- ❌ Free undo/redo without audit clarity
- ❌ Black-box forecasting (no formula shown)
- ❌ Reason for change is optional
- ❌ Audit logs deleted after 30 days
- ❌ No approval workflow
- ❌ Configuration can be edited after forecast is generated
- ❌ Users can't export configuration
- ❌ Forecast shown without assumptions
- ❌ Version history is unclear (is v1 or v2 active?)

---

## Confidence Levels for This Framework

| Topic | Confidence | Why |
|-------|-----------|-----|
| FDA 21 CFR Part 11 requirements | Very High | Regulation is public; well-documented |
| GxP principles (ALCOA, etc.) | Very High | Industry-standard; FDA endorsed |
| Medidata Rave patterns | High | Public case studies; industry knowledge |
| SimCYP/PK-Sim patterns | High | Public documentation; user communities |
| Veeva patterns | High | Public documentation; case studies |
| General pharma UX conventions | High | Consistent across tools; regulatory guidance |
| Specific compliance details (proprietary implementations) | Moderate | Some tools keep implementation details private |

---

## When to Deviate from This Framework

You might deviate if:

1. **Your users are internal domain experts** — Accept higher complexity; skip oversimplification
2. **This is a low-stakes forecasting tool** — May not need full approval workflows
3. **Your organization has stricter standards** — This is a minimum baseline, not a ceiling
4. **You have regulatory guidance specific to your study** — Follow regulatory guidance first; this framework second

You should NOT deviate if:

1. **Audit trails are critical** — Non-negotiable in regulated contexts
2. **Multiple users will touch configurations** — Collaboration requires rigor
3. **Forecasts will drive clinical decisions** — Stakes are too high for shortcuts
4. **There's any regulatory submission involved** — Compliance is non-negotiable

---

**End of Decision Framework**
