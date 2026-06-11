# Project Brief — Pharma Forecasting Web Module

## What this is

A web-based forecasting interface for a pharmaceutical manufacturer. It converts an existing Excel-based epidemiology-driven patient funnel model into a desktop browser experience. Phase 1 scope is the configuration interface only.

---

## Background

The existing tool is a `.xlsm` file with two sheets. The HOME sheet is the configuration interface — a left panel with dropdowns and input fields that drive a live patient funnel flowchart on the right. The Forecast Model sheet runs the actual model logic. The web tool replicates and improves on what the HOME sheet currently does.

The Excel version has a known problem: the flowchart arrows are static and don't update dynamically when configuration changes. The web version needs to fix this — the diagram should respond live to inputs.

---

## The people involved

**Configurator (primary user):** One pharma executive, 30+ years of Excel experience. Configures the model repeatedly — this is not a one-time setup. Deeply familiar with Excel conventions and resistant to interfaces that feel unfamiliar.

**Viewers (output consumers):** Multiple users who consume the forecast output. Not relevant for Phase 1 — the configuration interface is what's being designed now.

**Design team:** Darshan (UX/product designer) — ideation and Figma wireframing. Senior designer — takes Figma files and builds via Claude Code. Darshan does not write or work with code directly.

---

## Domain model — how the funnel works

The forecasting model is an epidemiology-driven patient funnel. The configurator defines the structure of the model by setting up the following hierarchy, top to bottom:

1. **Population** — total patient pool; can be split by age group
2. **Prevalence / Incidence / Mortality** — rates that determine the effective patient pool year over year
3. **Segments** — up to 5 disease segments, each with up to 5 sub-segments
4. **Diagnosis levels** — D1, D2, D3 (increasing severity/specificity)
5. **Treatment levels** — T1, T2, T3
6. **Line of Treatment (LOT)** — L1, L2, L3, L4 (higher = smaller, more severe patient group)
7. **Classes** — drug classes within a LOT
8. **Products** — marketed products and pipeline products within each class

Each level narrows the patient pool further. The configurator's inputs define which levels exist, how many segments/sub-segments there are, and which products are included.

---

## Key inputs in the current Excel model

The left panel contains the following controls:

- Split by age group — YES/NO toggle
- Number of groups — numeric input
- Select the Model — dropdown (Prevalence Pool / Diagnosed Pool / Treated Pool)
- Select Data Model — dropdown (Prevalence / Incidence / Prevalence & Incidence)
- Diagnosis — YES/NO toggle + number of segments + number of sub-segments
- Treatment — YES/NO toggle + number of segments + number of sub-segments
- LOT — YES/NO toggle + number of segments
- Class — YES/NO toggle + number of marketed products + number of pipeline products
- Product — YES/NO toggle + number of marketed products + number of pipeline products

---

## Design constraints

- Desktop browser only
- Repeated use — the configurator returns to this regularly to tweak and re-run
- The interface should feel familiar to a 30+ year Excel user — the specific conventions worth preserving in a web context are still to be determined through research
- The flowchart must update dynamically as inputs change — this is a core improvement over the Excel version

---

## The central design tension

The Excel mental model likely prioritises simultaneous visibility and direct access, but the exact conventions worth preserving in a web interface haven't been researched yet. The funnel's top-to-bottom sequence (Population → Product) stands as a structural reality of the domain. How these two things interact in the interface is an open design question, not a resolved one.

---

## What's been decided

- Phase 1 = configuration interface only
- Desktop browser only
- Repeated use
- One configurator, multiple viewers — viewers are out of scope for Phase 1
- Figma is the design deliverable; Claude Code is used for implementation by the senior designer

---

## What's still open

- Which Excel UX conventions are actually worth preserving in a web interface, and which ones don't translate — needs research before becoming a constraint
- Exact screen structure and navigation — not yet mapped
- Whether the configuration panel and flowchart live on one screen or across multiple
- How the user moves between sections if there are multiple screens
- Visual design direction — not started, not yet relevant
