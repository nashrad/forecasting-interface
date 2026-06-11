# Research Execution — Complete Workflow

Run these steps sequentially in Claude Code. Copy each prompt and paste into the chat.

---

## STEP 3: Excel Conventions Research (Phase 2.1)

**Copy this prompt into Claude Code:**

```
Use the research-analyst agent.

Read these files first:
- reference/PROJECT_BRIEF.md
- reference/RESEARCH_PLAN.md
- research/assumptions/assumption-mapping-findings.md

Your task: Research Excel user experience conventions that make spreadsheets intuitive for power users. This directly validates assumption #2 (specific Excel conventions matter).

Focus on:

1. WHY POWER USERS LOVE EXCEL — what mental models, advantages, patterns do they rely on?
   - Grid-based thinking and hierarchical display
   - Simultaneous visibility (inputs + results visible at once)
   - Cell-based input (direct editing vs. forms)
   - Immediate feedback (change = instant recalculation)
   - Copy/paste efficiency
   - Formula transparency (see how calculations work)
   - Undo/redo
   - Keyboard efficiency (arrow keys, tab, shortcuts)

2. KEY EXCEL CONVENTIONS — For each convention, explain:
   - What it is
   - Why power users rely on it
   - Whether it translates to web and how

3. WHAT TRANSLATES TO WEB and what doesn't — Be specific with examples

4. CASE STUDIES — Power users transitioning from Excel to web tools:
   - What worked (successful migrations)
   - What failed (rejections)
   - What they missed most

5. RESEARCH SOURCES to consult:
   - Academic spreadsheet cognition research
   - UX case studies of Excel-to-web migrations (finance, consulting, data teams)
   - Power user communities (Reddit, forums, case studies)
   - Why Excel remains dominant despite newer alternatives
   - Excel-like tools that succeeded (Notion, AirTable, etc.) — what did they preserve?

Deliverable:
- Executive summary (1 page): "What Makes Excel Intuitive"
- Detailed breakdown of 5-8 core Excel conventions with translation guidance
- Framework: "What to Preserve vs. What Can Improve in Web" with decision rules
- Case study examples (2-3 successful transitions)
- Key findings with confidence levels and citations

Save to: research/excel-conventions/excel-mental-model.md
```

**Expected time:** 2-3 days  
**Next:** After this completes, move to STEP 4

---

## STEP 4: Configuration Interface Patterns (Phase 2.2)

**Copy this prompt into Claude Code (after STEP 3 completes):**

```
Use the research-analyst agent.

Read these files first:
- reference/PROJECT_BRIEF.md
- reference/RESEARCH_PLAN.md
- research/assumptions/assumption-mapping-findings.md
- research/excel-conventions/excel-mental-model.md (from STEP 3)

Your task: Research web-based configuration interfaces for hierarchical/complex data. This validates assumption #3 & #5 (8-level hierarchy can fit on one screen with simultaneous visibility).

Identify and deeply analyze 5-7 real tools/products:

1. FINANCIAL TOOLS (for hierarchical modeling):
   - Bloomberg Terminal alternatives
   - CapitalIQ, Refinitiv, other financial modeling interfaces
   - How do they configure complex financial models with nested parameters?

2. PHARMA/CLINICAL TOOLS (similar domain):
   - Clinical trial management (Medidata, etc.)
   - Patient flow modeling tools
   - Epidemiology/disease modeling interfaces

3. ADMIN DASHBOARDS (deep nesting):
   - Stripe, Shopify, Intercom config UIs
   - How do they handle 5+ nested configuration levels?

4. DATA WAREHOUSE TOOLS:
   - Looker, Mode, Tableau, Qlik
   - How do they configure complex hierarchical dimensions/measures?

5. OTHER HIERARCHICAL UI PATTERNS:
   - Org chart tools
   - Permission/role systems
   - Tree-based editors (IDEs, design tools)

For EACH tool, document:
- Information Architecture (IA pattern used):
  - Single screen or multi-screen?
  - Tree view, accordion, stepper, tabs, master-detail?
  - How are hierarchy levels shown/navigated?
  
- Screen Layout:
  - Where are inputs? Where is preview/output?
  - Can you see structure + edit detail simultaneously?
  - Responsive to screen size?
  
- Navigation Pattern:
  - How do users move between hierarchy levels?
  - Breadcrumbs, sidebar, tabs, sequential?
  - Can you jump to any level or must follow a path?
  
- Input Methods:
  - Forms, inline editing, drag-drop, dropdowns?
  - How does it handle 5+ nested levels of inputs?
  
- Preview/Feedback:
  - Does diagram/preview update live as you change inputs?
  - Lag tolerance (instant, sub-second, loads)?
  
- Simultaneous Visibility:
  - Can you see inputs + output together?
  - How does it balance screen real estate for deep nesting?
  
- Usability Patterns:
  - What works well? What's confusing?
  - How do power users interact with it?
  - Keyboard shortcuts, pro-user affordances?

Analyze patterns across all 5-7 tools:
- What IA patterns emerge? (Which are most common?)
- Which patterns work best for 5-8 nested levels?
- How do successful tools solve "simultaneous visibility" with deep nesting?
- Single screen vs. multi-screen — when is each appropriate?
- How do they handle dynamic updates (live preview)?
- What can we adapt for our 8-level patient funnel?

Competitive Analysis Table:
| Tool | IA Pattern | Layout | Navigation | Hierarchy Handling | Strengths | Weaknesses |
(fill for each of 5-7 tools)

Pattern Synthesis:
- Pattern A: "Tree nav on left + detail panel on right + live canvas" (used by: [tools])
  - Works well for: deep nesting
  - Pros: simultaneous visibility, easy navigation
  - Cons: requires wider screen, scrolling in detail panel
  - Relevant for us? Why/why not?

- Pattern B: "Sequential stepper through levels + summary preview"
  - Works well for: guided workflows, mobile
  - Pros: focused input, clear progress
  - Cons: breaks simultaneous visibility
  - Relevant for us? Why/why not?

(Continue for 3-5 patterns)

Final Recommendations:
- Which patterns could work for our 8-level hierarchy?
- Which are proven at similar depths?
- What should we NOT try (what failed)?
- Which pattern best balances Excel familiarity + modern UX?

Save to: research/configuration-patterns/competitor-analysis.md
```

**Expected time:** 2-3 days  
**Next:** After this completes, move to STEP 5

---

## STEP 5: Pharma UX Standards (Phase 2.3)

**Copy this prompt into Claude Code (after STEP 4 completes):**

```
Use the research-analyst agent.

Read these files first:
- reference/PROJECT_BRIEF.md
- reference/RESEARCH_PLAN.md
- research/assumptions/assumption-mapping-findings.md
- research/excel-conventions/excel-mental-model.md (from STEP 3)
- research/configuration-patterns/competitor-analysis.md (from STEP 4)

Your task: Research pharma and medical software UX conventions, standards, and constraints. This validates assumptions around domain-specific design requirements.

Focus on:

1. REGULATORY/COMPLIANCE CONSTRAINTS:
   - FDA regulations (21 CFR Part 11, GxP, etc.)
   - What limits interface design?
   - Documentation and audit trail requirements
   - Validation requirements (how does tool prove config is correct?)
   - Version control and change management requirements
   - Traceability (who changed what, when, why)

2. HOW MEDICAL SOFTWARE APPROACHES CONFIGURATION:
   - Clinical trial management systems (Medidata, Veeva, etc.)
   - Pharmacokinetic modeling tools
   - Epidemiology/disease modeling tools
   - How do these handle complex nested configuration?
   - What UX patterns do they use for safety-critical settings?

3. POWER USER EXPECTATIONS IN REGULATED INDUSTRIES:
   - What do epidemiologists, statisticians, pharmacists expect?
   - How familiar are they with web vs. desktop tools?
   - What builds trust in medical software?
   - Transparency vs. simplicity trade-offs
   - Control and reproducibility expectations

4. CASE STUDIES — Real pharma/medical tools:
   - Successful examples (good UX + regulatory compliance)
   - Failed examples (poor adoption despite good design)
   - Lessons learned (what worked, what didn't)
   - Specific examples: Medidata Rave, SimCYP, Veeva, etc.

5. ACCESSIBILITY & SAFETY STANDARDS:
   - WCAG compliance expectations
   - Domain-specific accessibility needs
   - Human factors/safety considerations
   - Error prevention patterns

6. INTERACTION PATTERNS SPECIFIC TO PHARMA:
   - How do versioning/change control work?
   - Approval workflows?
   - Audit logging and reporting?
   - Configuration lock-down (preventing accidental changes)?
   - Reproducibility enforcement (same config → same results)?

Deliverable:
- Executive summary: "Pharma/Medical Software UX Standards"
- Regulatory constraints checklist (what must we do/avoid/ensure)
- UX conventions document (what pharma users expect)
- Case studies with lessons (2-3 detailed examples)
- Design principles for this domain (e.g., "transparency > aesthetics," "version all configs," "require change reasons")
- Recommendations for integrating pharma-compliant patterns into our tool
- Risk assessment: What pharma-specific requirements could impact our IA?

Save to: research/pharma-ux/pharma-standards.md
```

**Expected time:** 1-2 days  
**Next:** After this completes, move to STEP 6

---

## STEP 6: Emerging Trends Analysis (Phase 3)

**Copy this prompt into Claude Code (after STEP 5 completes):**

```
Use the trend-analyst agent.

Read these files first:
- reference/PROJECT_BRIEF.md
- reference/RESEARCH_PLAN.md
- research/assumptions/assumption-mapping-findings.md
- research/excel-conventions/excel-mental-model.md (from STEP 3)
- research/configuration-patterns/competitor-analysis.md (from STEP 4)
- research/pharma-ux/pharma-standards.md (from STEP 5)

Your task: Analyze emerging trends in configuration interfaces and power-user tools. Identify what's coming that should influence our design strategy.

Focus on:

1. AI/ML-POWERED CONFIGURATION:
   - Smart defaults and auto-complete suggestions
   - Predictive field population
   - AI suggesting likely next configuration step
   - Maturity level: experimental vs. mainstream?
   - Relevant for epidemiology modeling? (could AI predict likely segments/LOTs?)

2. REAL-TIME COLLABORATION IN CONFIG TOOLS:
   - Multiple users configuring simultaneously
   - Conflict resolution
   - Change proposals/approval workflows
   - Is this relevant for our single-user pharma scenario? (Phase 1 vs. Phase 2 question)

3. NATURAL LANGUAGE INTERFACES:
   - "Show me patient segments where age > 65 AND diagnosis = D2"
   - Voice-driven config
   - Maturity: prototype vs. production?
   - Too experimental for regulated pharma context?

4. NO-CODE/LOW-CODE EVOLUTION:
   - How are modern no-code tools (Airtable, Notion, Retool) approaching config?
   - What UX patterns are they pioneering?
   - Any learnings for our hierarchical model?

5. LIVE CODE/OBSERVABLE-LIKE PATTERNS:
   - Real-time preview as you type (like Observable notebooks)
   - "Show-as-you-configure" live feedback
   - Could work for showing live flowchart as user toggles settings?

6. GENERATIVE AI FOR WORKFLOWS:
   - Auto-generating configuration from description ("set up a typical pharma 4-segment model")
   - Maturity and regulatory concerns?

7. ACCESSIBILITY TRENDS:
   - Voice control / screen reader optimization
   - Cognitive load reduction patterns
   - Any relevant for our power-user audience?

Analysis for each trend:

- **Maturity:** Experimental (5% adoption), Emerging (10-30%), Mainstream (40%+), Mature (standard practice)
- **Timeline:** When does it become mainstream? (6 months, 1-2 years, 3+ years?)
- **Strategic impact:** High / Medium / Low
- **For our tool:** Adopt now / Watch closely / Defer to Phase 2 / Ignore (not relevant)
- **Risk:** What could go wrong if we adopt? (regulatory, complexity, user resistance)
- **Opportunity:** How could this improve our tool?

Deliverable:
- Trend summary table: Trend | Description | Maturity | Timeline | Strategic Impact
- Deep dive on 3-5 most relevant trends
- For each: Should we adopt, watch, or defer? Why?
- Risk/opportunity assessment
- Strategic recommendation: How do trends inform our IA decisions?
- Example: "Real-time flowchart preview is mainstream in web tools; we should design for instant visual feedback" (validates assumption #10 about responsiveness expectations)

Save to: research/trends/emerging-trends.md
```

**Expected time:** 1-2 days  
**Next:** After this completes, move to STEP 7

---

## STEP 7: Product Strategy Synthesis (Phase 4)

**Copy this prompt into Claude Code (after STEP 6 completes):**

```
Use the product-manager agent.

Read ALL of these files:
- reference/PROJECT_BRIEF.md
- reference/RESEARCH_PLAN.md
- research/assumptions/assumption-mapping-findings.md (from STEP 2)
- research/excel-conventions/excel-mental-model.md (from STEP 3)
- research/configuration-patterns/competitor-analysis.md (from STEP 4)
- research/pharma-ux/pharma-standards.md (from STEP 5)
- research/trends/emerging-trends.md (from STEP 6)

Your task: Synthesize ALL research into a complete product strategy for the pharma forecasting configuration interface.

You're the final synthesizer. Take 4 weeks of research and turn it into actionable decisions. 

DELIVERABLES (in order of importance):

## 1. INFORMATION ARCHITECTURE (IA) RECOMMENDATIONS

Propose 2-3 distinct IA options for configuring the 8-level hierarchy:

For EACH option:
- **Name:** e.g., "Left Panel Config + Right Panel Flowchart"
- **Description:** How does it work?
- **Screen Layout:** Sketch/describe the arrangement
  - Where are inputs for each level?
  - Where is the live flowchart?
  - How much of each is visible?
  
- **Hierarchy Navigation:** How do users move between levels?
  - Can they see all levels at once?
  - Do they navigate sequentially or non-sequentially?
  
- **How It Preserves Excel Familiarity:**
  - Which Excel conventions does it keep?
  - Why would a 30-year Excel user feel comfortable?
  
- **How It Improves on Excel:**
  - What's better than the static `.xlsm` HOME sheet?
  - Especially: how does it fix the broken flowchart problem?
  
- **Pros and Cons:**
  - Advantages
  - Disadvantages
  - When this pattern works best / worst
  
- **Pharma Compliance Fit:**
  - Does it support audit trails?
  - Change tracking?
  - Configuration versioning?
  
- **Responsiveness/Performance:**
  - How does live flowchart update?
  - Can you achieve Excel-like instant feedback?

Example IA options to consider:
- Option A: "Split Screen" (left panel: accordion-style level config | right panel: live flowchart)
- Option B: "Progressive Disclosure" (top bar: high-level toggles | main area: detailed config for selected level | persistent mini flowchart)
- Option C: "Stepper Flow" (sequential screens for each level with persistent preview of flowchart impact)
- Option D: Other option based on research findings

### FINAL IA RECOMMENDATION:
- Which IA is best?
- Why this one? (evidence from research)
- What trade-offs did we accept?
- How does it score against assumptions?

---

## 2. INTERACTION PATTERNS — LEVEL BY LEVEL

Define HOW to configure EACH of the 8 levels. For each level:

**Population:**
- How does user set initial patient pool?
- How do they enable/disable age-group splitting?
- How do they set number of age groups?
- Visual example / wireframe

**Prevalence / Incidence / Mortality:**
- How do they input rates?
- Can they see what % of patients survive each year?
- Can they edit rates live and see flowchart update?

**Segments:**
- Add/remove segments (up to 5)?
- Add/remove sub-segments (up to 5 per segment)?
- How do they understand the hierarchy?
- Visual indication of nesting?

**Diagnosis (D1, D2, D3):**
- Toggle diagnosis on/off?
- Set prevalence per diagnosis level?
- How does this cascade down the funnel?

**Treatment (T1, T2, T3):**
- Similar pattern to diagnosis?
- How are treatment segments defined?

**Line of Treatment (LOT):**
- Up to 4 LOT levels?
- How do users distinguish LOT1 vs LOT2 vs LOT3 vs LOT4?
- How do they set LOT-specific parameters?

**Classes:**
- Add/remove drug classes per LOT?
- Market vs. pipeline products toggle?

**Products:**
- Add/remove specific products?
- Marketed vs. pipeline classification?
- Tie to forecasting?

For EACH level:
- Input method (form field? dropdown? toggle? inline edit?)
- Validation (what can't they do?)
- Feedback (what happens immediately after they change this?)
- Pharma compliance (any audit/version requirements?)
- Excel precedent (how did they do this in `.xlsm`?)

---

## 3. DESIGN PRINCIPLES — DECISION FRAMEWORK

Create a "decision framework" that guides all future design choices:

**Principle 1: Preserve vs. Improve**
- Rule: When to PRESERVE an Excel convention vs. when to IMPROVE
- Examples:
  - PRESERVE: Grid-like hierarchy display (power users expect this)
  - IMPROVE: Real-time dynamic flowchart (Excel has static arrows)
  - PRESERVE: Keyboard navigation (Excel power users use heavily)
  - IMPROVE: Clear labeling/help text (Excel columns can be cryptic)
  - PRESERVE: Immediate feedback on changes (users expect this)
  - IMPROVE: Visual clarity of dependencies (spreadsheet formulas can be hard to trace)

**Principle 2: Pharma Compliance vs. Simplicity**
- Rule: When regulatory requirements override UX simplicity
- Examples:
  - "Versioning > Undo" (regulatory requires change history, not undo)
  - "Transparency > Aesthetics" (users must see/audit formulas/logic)
  - "Change reason tracking > Speed" (must document why config changed)
  - "Reproducibility > Innovation" (same config = same results, always)

**Principle 3: Power User Expectations**
- Rules for interactions that respect the user's 30-year Excel mental model
- Examples:
  - "Instant feedback" (no spinners, no debounce)
  - "Direct manipulation" (click to edit, not modal forms)
  - "Keyboard efficiency" (tab/arrow keys work everywhere)
  - "Undo/redo" (Ctrl+Z works, but respects audit trail)

**Principle 4: Simultaneous Visibility**
- Rule: How deep can we go before "simultaneous visibility" breaks?
- When to use: progressive disclosure, folding, multi-screen, etc.
- Examples from research: what did competitors do at similar depths?

**Principle 5: Dynamic Flowchart Responsiveness**
- Rule: Latency budget
- Excel benchmark: sub-second (from `.xlsm` analysis)
- Web expectation: should match or beat Excel
- When to accept lag: [describe conditions]

---

## 4. SINGLE SCREEN vs. MULTI-SCREEN RECOMMENDATION

- **Recommendation:** Which approach is better?
- **Strong evidence:** What research supports this?
- **Trade-offs:** What are you giving up? What are you gaining?
- **Condition:** When might you switch (if Phase 2 adds features)?

---

## 5. NAVIGATION STRATEGY

- How does user move between the 8 hierarchy levels?
- Restricted sequential flow or free jump?
- How does this preserve Excel users' mental models?
- Breadcrumbs? Sidebar? Tabs? Tree?
- Mobile considerations? (Probably not for Phase 1, but note)

---

## 6. PROTOTYPE & TESTING PLAN

- How will we validate the IA before Figma design?
- Can we create an interactive Figma prototype?
- What should we test with reference users (if available later)?
- Success metrics: Time to configure | Error rate | User confidence | NPS
- Hypothesis: "If IA follows [pattern from competitor], then configuration time should match or beat Excel"

---

## 7. RISK ASSESSMENT & MITIGATION

- What could go wrong with this IA?
- Pharma compliance risks?
- User adoption risks?
- Technical feasibility risks?
- How do we mitigate each?

---

## 8. NEXT STEPS FOR FIGMA DESIGN

- What should Darshan know before starting Figma wireframes?
- Which design principles matter most?
- Which research findings should guide visual design?
- Any constraints (pharma audit trails, version management, etc.)?

---

## SUMMARY

1-page executive summary:
- Recommended IA
- Why (strongest evidence)
- Key trade-offs
- Ready to proceed to Figma? Yes/No. Why?

Save to: documents/PRODUCT_STRATEGY.md
```

**Expected time:** 1-2 days  
**Next:** After this completes, move to STEP 8

---

## STEP 8: Update Research Index

After all research is complete, open `reference/RESEARCH_INDEX.md` and fill in:

- Summary of each finding (1-2 sentences)
- Confidence levels (High/Medium/Low)
- Any open questions remaining

---

## Summary

| Step | Agent | Phase | Time | Status |
|------|-------|-------|------|--------|
| 2 | assumption-mapping | Assumptions | 2-3 hrs | ✅ COMPLETE |
| 3 | research-analyst | Excel Conventions | 2-3 days | ⏳ READY |
| 4 | research-analyst | Config Patterns | 2-3 days | ⏳ READY |
| 5 | research-analyst | Pharma UX | 1-2 days | ⏳ READY |
| 6 | trend-analyst | Trends | 1-2 days | ⏳ READY |
| 7 | product-manager | Strategy | 1-2 days | ⏳ READY |
| 8 | — | Index Update | 1 hour | ⏳ READY |

**Total time:** ~2 weeks (can run steps in parallel if desired)

---

**Ready to start STEP 3?**

Copy the STEP 3 prompt above and paste it in Claude Code. After it completes, come back and run STEP 4.

You're all set! 🚀
