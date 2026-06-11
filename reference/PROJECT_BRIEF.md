# Forecasting Interface - Project Brief

## What This Is

A **web-based configuration interface** for a pharmaceutical manufacturer's epidemiology-driven patient funnel model. We're converting an existing Excel-based tool (`.xlsm` file) into a desktop browser experience. **Phase 1 = configuration interface only.**

---

## Background

**Current state (Excel):**
- HOME sheet: Configuration panel (left) + static flowchart (right)
- Forecast Model sheet: Runs the actual model logic
- **Problem**: Flowchart arrows don't update dynamically when configuration changes

**Target state (Web):**
- Replicate and improve the configuration interface
- **Key improvement**: Flowchart must respond LIVE to user inputs
- Configuration interface only (Phase 1) — viewers/output consumers are out of scope

---

## The User

**Primary user:** One pharma executive
- 30+ years of Excel experience
- **Repeated use** — configures the model regularly (not one-time setup)
- Deeply familiar with Excel conventions
- **Resistant to unfamiliar interfaces**
- Expert at understanding complex hierarchies through spreadsheets

**Key insight:** User's mental model is shaped by Excel. We need to understand which Excel conventions feel intuitive and which can be improved while maintaining that familiarity.

---

## Domain Model — Patient Funnel Hierarchy

The model is hierarchical, top-to-bottom (each level narrows the patient pool):

1. **Population** — total patient pool; can split by age group
2. **Prevalence / Incidence / Mortality** — rates that filter the pool year-over-year
3. **Segments** — up to 5 disease segments, each with up to 5 sub-segments
4. **Diagnosis levels** — D1, D2, D3 (increasing severity/specificity)
5. **Treatment levels** — T1, T2, T3
6. **Line of Treatment (LOT)** — L1, L2, L3, L4 (higher = smaller, more severe groups)
7. **Classes** — drug classes within each LOT
8. **Products** — marketed + pipeline products within each class

**Configuration inputs** (in current Excel):
- Split by age group (YES/NO + number of groups)
- Model type (Prevalence Pool / Diagnosed Pool / Treated Pool)
- Data model (Prevalence / Incidence / Both)
- Diagnosis (YES/NO + # segments + # sub-segments)
- Treatment (YES/NO + # segments + # sub-segments)
- LOT (YES/NO + # segments)
- Class (YES/NO + # marketed + # pipeline)
- Product (YES/NO + # marketed + # pipeline)

---

## Design Constraints

- **Desktop browser only**
- **Repeated use** — user returns regularly to reconfigure and re-run
- **Familiarity** — interface should feel familiar to an experienced Excel user
- **Dynamic visualization** — flowchart updates as inputs change (core differentiator)

---

## The Central Design Question

**How do we translate Excel's mental model to web while improving the experience?**

Specifically:
- Which Excel UX conventions matter to this user? Which don't translate?
- How do we preserve "simultaneous visibility" (seeing inputs + flowchart at once) in a web context?
- Single screen vs. multiple screens?
- How do users navigate between the 8 hierarchy levels?
- What interaction patterns feel natural for configuring a complex nested structure?

---

## What's Been Decided

✅ Phase 1 = configuration interface only  
✅ Desktop browser  
✅ Repeated-use workflow  
✅ Figma design deliverable; Claude Code for implementation  
✅ No direct user interviews available — secondary research only

---

## What's Open (Needs Research)

❓ Which Excel conventions are worth preserving in web, and which don't translate?  
❓ Screen structure and information architecture (IA)  
❓ Configuration panel + flowchart on one screen or multiple?  
❓ Navigation patterns between sections  
❓ Visual design direction  
❓ Interaction patterns for configuring hierarchical structures  

---

## Research Objectives

1. **Understand Excel conventions** — why do experienced Excel users find spreadsheets intuitive? What patterns work?
2. **Research configuration interface patterns** — how do modern tools (web, desktop) handle complex hierarchical configuration?
3. **Pharma/medical UX research** — domain-specific conventions, compliance considerations, how pharma tools approach this
4. **Understand power users** — what makes a 30+ year Excel user resistant to new interfaces? What preserves familiarity?
5. **Emerging trends** — what's new in configuration UI/UX? Where is this space evolving?
6. **Synthesize into strategy** — translate findings into IA, interaction patterns, and design principles

---

## Research Scope

**IN SCOPE:**
- Excel UX conventions and why they work
- Web-based configuration interface patterns (financial tools, medical software, admin dashboards)
- Pharma/medical software UX standards and compliance
- How power users transition from desktop to web tools
- Hierarchical data visualization and configuration patterns
- Real-time updating interfaces (dashboards, flow diagrams)

**OUT OF SCOPE:**
- The actual forecasting model logic
- Viewers/output consumers (Phase 2)
- Visual design direction (comes after IA/patterns are defined)
- Code implementation specifics

---

## Timeline

- **Week 1**: Assumption mapping + deep research (configuration patterns, Excel conventions, pharma UX)
- **Week 2**: Trend analysis + synthesis
- **Week 3**: Product strategy + IA definition + interaction patterns
- **Week 4+**: Figma wireframing (Darshan) + implementation (Senior Designer)

---

## Success Metrics for Research

- ✅ Clear understanding of which Excel patterns matter to power users
- ✅ 3-5 proven IA patterns from competitors/industry
- ✅ Pharma UX standards documented
- ✅ Interaction patterns for configuring the 8-level hierarchy defined
- ✅ Decision framework: when to preserve Excel convention vs. when to improve
- ✅ High confidence that proposed IA will feel familiar to a 30+ year Excel user

---

**Owner:** Darshan  
**Last Updated:** June 7, 2026
