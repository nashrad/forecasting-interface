# Research Plan — Pharma Forecasting Interface

## Overview

We cannot interview our user directly, so we'll use **deep secondary research** to understand:
1. What makes Excel intuitive for power users
2. How modern tools handle hierarchical configuration
3. Pharma/medical UX standards and patterns
4. Emerging trends in configuration interfaces

Research findings will feed directly into information architecture and interaction pattern decisions.

---

## Research Phases

### Phase 1: Assumption Mapping (Before Deep Research)

**Agent:** `assumption-mapping`

**Purpose:** Identify risky assumptions about what will work for a 30+ year Excel user transitioning to web.

**Input to agent:**
```
"Map all assumptions about our pharma forecasting configuration interface. 
User: 30+ year Excel expert, power user, resistant to unfamiliar interfaces.
Goal: Create web version that feels familiar while improving the experience.
Domain: 8-level hierarchical patient funnel model.
Constraint: Phase 1 is configuration interface only (no viewers)."
```

**What we expect back:**
- VUBF analysis (Value/Usability/Business/Feasibility risks)
- Top assumptions by risk level
- Experiments we could run (without direct user access)
- Success metrics for each assumption

**Example assumptions to surface:**
- Value: "Power Excel users will accept a web interface if core patterns feel familiar"
- Usability: "The 8-level hierarchy can be configured intuitively without the spreadsheet layout"
- Feasibility: "A dynamic flowchart can update fast enough to feel real-time"
- Business: "Phase 1 (config interface only) delivers enough value for adoption"

---

### Phase 2: Deep Research — Configuration Patterns & Excel Conventions

**Agent:** `research-analyst`

**Purpose:** Deep dive into how configuration interfaces work across industries, and what makes Excel intuitive.

**Input to agent (split into 3 research sprints):**

**Sprint 2.1 — Excel Conventions:**
```
"Research Excel user experience conventions that make spreadsheets intuitive for power users. 
Focus on:
1. Why power users love Excel (mental models, advantages, patterns they rely on)
2. Key Excel conventions: simultaneous visibility, cell-based input, immediate feedback, grid logic
3. What translations to web and what doesn't
4. Case studies: power users transitioning from Excel to web tools — what worked, what failed

Deliverable: Report on 'Excel Mental Model' — which conventions matter, which translate"
```

**Sprint 2.2 — Configuration Interface Patterns:**
```
"Research web-based configuration interfaces for hierarchical/complex data. 
Focus on:
1. Financial/pharma tools (Bloomberg Terminal alternatives, CapitalIQ, clinical trial management)
2. Admin dashboards handling 5+ nested configuration levels
3. Data warehouse configuration tools (Looker, Mode, Tableau)
4. How they handle: simultaneous visibility, navigation between levels, dynamic previews

Look for: screen layouts, IA patterns, interaction models. Compare 5-7 tools."
```

**Sprint 2.3 — Pharma/Medical Software UX:**
```
"Research pharma and medical software UX conventions. 
Focus on:
1. Regulatory/compliance constraints (FDA, GxP, documentation requirements)
2. How medical software approaches configuration and modeling
3. Case studies: clinical trial management systems, pharmacokinetic modeling tools
4. Power user expectations in regulated industries

Deliverable: Pharma UX Standards document"
```

**What we expect back:**
- Synthesis report: "What Makes Excel Intuitive"
- Competitive analysis: 5-7 configuration tools with IA/pattern breakdown
- Pharma UX standards guide
- "Worth preserving vs. can improve" framework

---

### Phase 3: Trend Analysis — Emerging Patterns & Future-Proofing

**Agent:** `trend-analyst`

**Purpose:** Identify emerging trends in configuration UX, hierarchical data visualization, and power-user tools.

**Input to agent:**
```
"Analyze emerging trends in configuration interfaces and power-user tools. 
Focus on:
1. AI/ML-powered configuration suggestions (auto-complete, smart defaults)
2. Real-time collaboration in configuration tools
3. Natural language interfaces for complex configuration
4. No-code/low-code tools and how they approach UX
5. Mobile-first hierarchical data interaction (if applicable)
6. Observable/Observable-like live code execution (real-time preview)

Time horizon: What's emerging in 12-24 months that should influence our design?
Question: Which trends should we design for, and which are still too immature?

Deliverable: Trend report with strategic implications for our IA decisions"
```

**What we expect back:**
- 3-5 emerging trends in configuration UX
- Timeline for mainstream adoption
- Strategic implications (should we design for these?)
- Risk/opportunity assessment

---

### Phase 4: Product Strategy & Synthesis

**Agent:** `product-manager`

**Purpose:** Synthesize all research into information architecture, interaction patterns, and design principles.

**Input to agent:**
```
"Synthesize research findings into product strategy for our pharma forecasting config interface.
You'll receive:
1. Assumption mapping results (risky assumptions identified)
2. Research report: Excel conventions + configuration patterns + pharma standards
3. Trend analysis: emerging patterns to consider

Your task:
1. Create an IA (Information Architecture) framework for the 8-level hierarchy
2. Define interaction patterns that preserve Excel familiarity while improving UX
3. Create design principles (when to preserve Excel, when to improve)
4. Recommend: single screen vs. multi-screen, navigation strategy
5. Define success metrics and prototype testing plan

Deliverable: Product Strategy document with IA, interaction patterns, design principles, and prototype plan"
```

**What we expect back:**
- Proposed information architecture (screen layout options, 2-3 variants)
- Interaction patterns for configuring each level
- Design principles (decision framework)
- Single screen vs. multi-screen recommendation with rationale
- Prototype testing plan (how to validate IA before Figma design)
- Success metrics

---

## Research Artifacts & Organization

### Folder Structure

```
forecasting-interface/
├── reference/
│   ├── PROJECT_BRIEF.md (this document)
│   ├── RESEARCH_PLAN.md
│   └── RESEARCH_INDEX.md (tracks findings)
├── research/
│   ├── assumptions/
│   │   └── assumption-mapping-findings.md
│   ├── excel-conventions/
│   │   └── excel-mental-model.md
│   ├── configuration-patterns/
│   │   └── competitor-analysis.md
│   ├── pharma-ux/
│   │   └── pharma-standards.md
│   └── trends/
│       └── emerging-trends.md
└── documents/
    └── PRODUCT_STRATEGY.md
```

---

## Research Index

As findings accumulate, we'll update the Research Index so agents can reference prior work.

**Index tracks:**
- ✅ What's been researched
- ✅ Key findings (1-sentence summary)
- ✅ File location for full details
- ✅ Confidence level
- ✅ Still-open questions

---

## Success Criteria for Complete Research

- ✅ Risky assumptions identified and prioritized
- ✅ Clear understanding of Excel conventions that matter to power users
- ✅ 5+ configuration interface patterns documented (with IA details)
- ✅ Pharma/medical UX standards synthesized
- ✅ 3-5 emerging trends identified with strategic implications
- ✅ Information architecture defined (2-3 options with rationale)
- ✅ Interaction patterns for all 8 hierarchy levels
- ✅ Design principles decision framework (preserve vs. improve)
- ✅ Clear recommendation: single screen vs. multi-screen approach
- ✅ Prototype testing plan ready for validation

---

## Timeline

| Week | Phase | Agents | Deliverable |
|------|-------|--------|-------------|
| 1 | Assumptions + Research Sprints | assumption-mapping, research-analyst | Assumptions doc + 3 research reports |
| 2 | Trends + Synthesis | trend-analyst, product-manager | Trend report + Product Strategy |
| 3 | Validation/Polish | — | Final IA framework, design principles |
| 4+ | Figma Design | Darshan | Wireframes based on IA |

---

## How to Invoke Agents

### Agent 1: assumption-mapping
**When:** Immediately, before deep research  
**Where:** `/forecasting-interface/agents/assumption-mapping.md`  
**Invoke in Claude Code with:** Project brief + domain model  
**Output location:** `research/assumptions/assumption-mapping-findings.md`

### Agent 2: research-analyst
**When:** Weeks 1-2, in 3 parallel sprints  
**Where:** `/forecasting-interface/agents/research-analyst.md`  
**Invoke 3 times for:** Excel conventions, configuration patterns, pharma UX  
**Output locations:**
- `research/excel-conventions/excel-mental-model.md`
- `research/configuration-patterns/competitor-analysis.md`
- `research/pharma-ux/pharma-standards.md`

### Agent 3: trend-analyst
**When:** Week 2, after initial research  
**Where:** `/forecasting-interface/agents/trend-analyst.md`  
**Invoke with:** Assumptions + initial research findings  
**Output location:** `research/trends/emerging-trends.md`

### Agent 4: product-manager
**When:** Week 2-3, after all research complete  
**Where:** `/forecasting-interface/agents/product-manager.md`  
**Invoke with:** All 4 research reports above  
**Output location:** `documents/PRODUCT_STRATEGY.md`

---

**Ready to start?** → Move to Step 1: Run assumption-mapping

---

**Last Updated:** June 7, 2026  
**Owner:** Darshan
