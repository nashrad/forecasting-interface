# Research Index — All Findings

This index tracks all research conducted, findings, and open questions. Agents reference this before conducting new research to avoid duplication and build on prior work.

---

## Phase 1: Assumptions

| Topic | Finding (1-line) | File | Status | Confidence | Open Questions |
|-------|-----------------|------|--------|-----------|-----------------|
| Value Risk | [TBD after research] | `research/assumptions/assumption-mapping-findings.md` | Pending | — | — |
| Usability Risk | [TBD] | `research/assumptions/assumption-mapping-findings.md` | Pending | — | — |
| Feasibility Risk | [TBD] | `research/assumptions/assumption-mapping-findings.md` | Pending | — | — |

---

## Phase 2: Deep Research

### Excel Conventions & Power User Mental Models

| Topic | Finding | File | Status | Confidence | Details |
|-------|---------|------|--------|-----------|---------|
| Why Excel is intuitive | Power users value spreadsheet thinking (spatial grids, transparent logic, immediate feedback) not just the product | `research/excel-conventions/excel-mental-model.md` | Complete | High | 8 core conventions identified; case studies provided |
| Grid-based thinking | Row/column spatial logic is foundational mental model; translates to web via master-detail or tree patterns | `research/excel-conventions/excel-mental-model.md` | Complete | High | Essential to preserve for familiarity |
| Simultaneous visibility | Critical but challenging at 8-level depth; requires master-detail or progressive disclosure pattern | `research/excel-conventions/excel-mental-model.md` | Complete | High | Golden rule: users must see what they're doing + see results |
| Immediate feedback | <500ms response time is expected; delays >300ms are noticed and resented by power users | `research/excel-conventions/excel-mental-model.md` | Complete | High | Technical requirement, non-negotiable |
| Familiarity barriers | Airtable failure shows "looks like Excel" isn't enough; must preserve mental model not just aesthetics | `research/excel-conventions/excel-mental-model.md` | Complete | Medium-High | Formula transparency especially critical in pharma context |

### Configuration Interface Patterns (Competitors & Industry)

| Competitor/Tool | IA Pattern | Screen Layout | Navigation | Hierarchy Handling | File | Confidence |
|-----------------|-----------|---------------|------------|-------------------|------|------------|
| [Tool 1 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/configuration-patterns/competitor-analysis.md` | Pending |
| [Tool 2 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/configuration-patterns/competitor-analysis.md` | Pending |
| [Tool 3 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/configuration-patterns/competitor-analysis.md` | Pending |
| [Tool 4 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/configuration-patterns/competitor-analysis.md` | Pending |
| [Tool 5 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/configuration-patterns/competitor-analysis.md` | Pending |

**Key Questions for Competitor Analysis:**
- How do they visualize hierarchical structure? (tree view, accordion, stepper, tabs?)
- How do they handle inputs + preview simultaneously?
- What happens when user changes a top-level setting? Does everything update live?
- How do they help users understand the hierarchy?

### Pharma/Medical Software UX Standards

| Topic | Finding | File | Status | Confidence | Implications |
|-------|---------|------|--------|-----------|-------------|
| Regulatory constraints | FDA 21 CFR Part 11 + GxP/ALCOA require auditability, reproducibility, transparency, control, documentation | `research/pharma-ux/pharma-standards.md` | Complete | Very High | Every modification must be logged, searchable; show formulas/assumptions (no black boxes) |
| Documentation requirements | Immutable, exportable audit trails (7-10yr retention); config export as PDF + JSON for regulatory submission | `research/pharma-ux/pharma-standards.md` | Complete | Very High | Export feature is non-negotiable; audit trail UI must be searchable/filterable |
| Power user expectations | Trust built via transparency + auditability + control, NOT simplicity; versioning preferred over free undo | `research/pharma-ux/pharma-standards.md` | Complete | High | Replace Ctrl+Z with explicit version revert (e.g., "Revert to v3.1" creates new v3.3); multi-user approval workflow (Modeler→Reviewer→Approver) expected |
| Clinical/trial software patterns | Medidata Rave (config locking + change control), SimCYP (full parameter transparency), Veeva Vault (modern UX + compliance coexist) | `research/pharma-ux/pharma-standards.md` | Complete | High | Sidebar nav + center editing + live "DRAFT/Not Validated" preview is a proven, familiar layout; modern UX and compliance are NOT mutually exclusive |

**Also available:** `decision-framework.md` (quick yes/no design guide) and `implementation-checklist.md` (build/compliance checklist) — both salvaged as useful supporting references.

**Key principle (Bottom Line):** "Pharma software succeeds by building trust through transparency, auditability, and control." A web tool can be MORE compliant than Excel if these patterns are built in from the start.

---

## Phase 3: Trends

| Trend | Description | Timeline | Strategic Impact | Risk/Opportunity | File | Confidence |
|-------|-------------|----------|------------------|-----------------|------|-----------|
| [Trend 1 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/trends/emerging-trends.md` | Pending |
| [Trend 2 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/trends/emerging-trends.md` | Pending |
| [Trend 3 - TBD] | [TBD] | [TBD] | [TBD] | [TBD] | `research/trends/emerging-trends.md` | Pending |

---

## Phase 4: Strategy Synthesis

| Decision | Recommendation | Rationale | File | Status |
|----------|-----------------|-----------|------|--------|
| Information Architecture | [TBD - 2-3 options] | [TBD] | `documents/PRODUCT_STRATEGY.md` | Pending |
| Single Screen vs. Multi | [TBD] | [TBD] | `documents/PRODUCT_STRATEGY.md` | Pending |
| Navigation Pattern | [TBD] | [TBD] | `documents/PRODUCT_STRATEGY.md` | Pending |
| Design Principles | [TBD] | [TBD] | `documents/PRODUCT_STRATEGY.md` | Pending |
| Hierarchy Configuration | [TBD] | [TBD] | `documents/PRODUCT_STRATEGY.md` | Pending |

---

## How to Use This Index

**Before conducting research:** Check this index to see what's already been researched  
**After research:** Add 1-2 sentence summary in the appropriate section  
**When synthesizing:** Product manager reviews entire index to create strategy  
**For Figma design:** Darshan references Product Strategy + relevant research files

---

## Status Legend

- **Pending** = Not yet started
- **In Progress** = Agent currently researching
- **Complete** = Research finished, findings documented
- **Referenced** = Used in subsequent research phase

---

## Confidence Levels

- **High (90%+)** = Multiple sources, consensus, or expert validation
- **Medium (70-89%)** = 2-3 good sources, minor disagreement
- **Low (50-69%)** = Single source, needs validation
- **Pending** = Not yet researched

---

**Last Updated:** June 7, 2026  
**Next Update:** After assumption-mapping completes
