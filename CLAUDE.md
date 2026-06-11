# PharmaForecast — Project Context

**Last updated:** June 2026  
**Current version:** v0.1.0-mvp (tagged on GitHub)  
**Status:** MVP complete; entering polish phase

---

## Project Overview

**PharmaForecast** is a web app redesign of an existing Excel-based pharmaceutical patient-flow forecasting tool. It lets analysts configure and visualize a **patient funnel diagram** — from total disease population down to patients on a specific drug — as a presentation-ready flowchart.

**Key insight:** The current tool is a forecast *structure* builder, not a forecast *calculator*. It draws the shape of a forecast; numbers come from a separate model.

---

## Core Problem Being Solved

The Excel tool has 8 critical pain points:

1. **Silent cascade resets** — changing a parent dropdown wipes all child config with no warning (lost work)
2. **Invisible bypass routing** — routing logic (when LOT/Class layers are excluded) is hidden in the UI
3. **No sub-segment labelling** — can't name sub-segments at all
4. **Decoupled data layers** — HOME and Forecast sheets can drift apart
5. **Uniform sub-segment counts** — can't give different segments different sub-segment counts
6. **No scenario management** — no way to save or compare variations
7. **No assumption documentation** — no links between numbers and data sources
8. **No pipeline confidence differentiation** — Phase I and Phase III assets look identical

**MVP prioritized pain points 1, 2, 3, 4** (the biggest UX/error-reduction issues).

---

## MVP Architecture

### Three-Step Model (Cognitive Separation)

The redesign explicitly separates structure, meaning, and numbers into three guided steps:

- **Step 1: Structural configuration** — Define the shape (pool model, which layers exist, node counts). No labels, no numbers.
- **Step 2: Definition & labelling** — Give every node a disease-specific identity. Segmentation dimension, labels, rationale.
- **Step 3: Numeric population** — Enter rates, shares, population data. Patient counts cascade live through the diagram.

### Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** Zustand (in-memory store)
- **Diagram:** Custom SVG (no external graph library)
- **Export:** html-to-image (PNG only)
- **Deployment:** Vercel (auto-deploys from `main`)

### File Structure

```
forecasting-interface/
├── app/                           # React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── diagram/           # FunnelDiagram.tsx (SVG rendering)
│   │   │   ├── shared/            # CascadeWarningModal, RoutingPanel, ScenarioPanel
│   │   │   └── steps/             # Step1Structure, Step2Labels, Step3Numbers, StepNav
│   │   ├── data/                  # nsclcSeed.ts (NSCLC worked example)
│   │   ├── store/                 # funnelStore.ts (Zustand state)
│   │   ├── types/                 # funnel.ts (TypeScript domain model)
│   │   ├── utils/                 # calculations.ts (live patient count computation)
│   │   ├── App.tsx                # Main layout (header, left panel, diagram)
│   │   └── main.tsx + index.css
│   ├── package.json, tsconfig.json, vite.config.ts
│   └── .gitignore                 # Excludes node_modules, dist
├── vercel.json                    # Build config (cd app && npm run build)
├── .gitignore                     # Excludes .vercel, Resources/, .DS_Store, .claude/
├── v0.1.0-mvp (git tag)          # Permanent checkpoint
└── Resources/ (local only)        # Research, brief, Excel sheets (not in GitHub)
```

---

## NSCLC Worked Example

The MVP ships with a **realistic NSCLC (non-small-cell lung cancer) funnel** as default content:

- **Pool:** Prevalence + Incidence (realistic for a major chronic disease)
- **Segments:** 4 biomarker-based (EGFR+, ALK+, KRAS G12C, Other/Wild-type)
- **Sub-segments:** 2–3 per segment (variant or PD-L1 stratification)
- **LOT:** 3 lines (1L, 2L, 3L+) with realistic attrition rates
- **Classes:** 3 (Checkpoint inhibitors, Targeted therapy, Chemotherapy)
- **Products:** 3 approved + 2 pipeline (with development stage labels)

**Why:** Oncology exercises every layer and is the most complete test of the UI. Users can also "Reset to blank" to prove the tool is universal.

---

## Key Design Decisions

### 1. SVG Diagram (not React Flow)
- Hand-rolled SVG gives total control over layout, styling, and aesthetics
- No external library bloat
- Diagram is a polished, presentation-grade visual (not auto-generated)

### 2. In-Memory State (Zustand)
- Scenarios persist during the session but not across browser refresh
- Full persistence (to backend/localStorage) is out of MVP scope
- Good enough to demo the interaction model

### 3. Cascade Warnings (not silent destruction)
- Any structural change that would lose data triggers an explicit modal
- Shows exactly what will be lost
- User must confirm
- This is the headline fix for pain point #1

### 4. Routing Summary Panel
- Always-visible display of which LOT/Class bypass is active
- Updates live as user toggles
- Fixes pain point #2 (invisible routing)

### 5. Live Patient Count Calculation
- Step 3 computes patient counts live as rates/shares are entered
- Counts appear as badges on diagram nodes (Step 3 view only)
- Formula: pool × diagnosis rate × treatment rate × LOT attrition × class share × product share
- Demonstrative (not validated; N5 in PRD)

---

## Current State

### MVP Complete ✅
- All three steps fully functional
- Cascade warning modal works
- Routing summary visible
- Live diagram updates on all changes
- Scenario switcher UI (in-session only)
- PNG export
- NSCLC seed data loaded by default
- Deployed on Vercel

### Version Control
- `main` branch = stable, v0.1.0-mvp tagged
- GitHub repo is clean (Resources/ removed, .claude/ excluded)
- No long-lived `dev` branch (using GitHub Flow + feature branches for polish)

---

## Next Phase: Polish

User is planning to redesign/improve:

1. **Diagram visuals** — New design in Figma, then recreate in code
2. **Toolbar UX** — Better section differentiation, clearer hierarchy
3. **Editable diagram** — Make the canvas itself clickable/editable (scope TBD)
4. **Version management UI** — Dedicated window for scenario history, better layout
5. **Overall layout** — Global reorganization and responsive improvements

**Workflow:** Each group of related changes = one feature branch (e.g., `feature/diagram-visuals`, `feature/toolbar-redesign`). One at a time, design in Figma first, then code.

---

## Important Constraints & Notes

### No Real Persistence (MVP)
- Save/scenario UI is present and clickable but doesn't survive a page refresh
- Scope for v0.2.0+

### No Real Calculations (MVP)
- Patient counts are demonstrative, not validated against actual epidemiology
- The flow is real; the numbers are illustrative
- Real validation engine is out of scope

### Sub-segment Count is Per-Segment
- Fix for Excel pain point #5: each segment can have a different number of sub-segments
- Implemented in Zustand store

### Full Labelling Support
- Every node at every level can be named (fixes pain point #3)
- Sub-segments now have text input fields (was impossible in Excel)

### Bypass Routing Visible
- When LOT = NO or Class = NO, the diagram shows dashed edges and the routing panel flags it
- Fixes pain point #2

---

## References & Resources

- **PRD:** `/Resources/PRD-PharmaForecastModel.md` (local, describes MVP in detail)
- **Design Brief:** `/Resources/Brief/PharmaForecastModel_DesignBrief.docx` (analysis of Excel tool and pain points)
- **Excel source:** `/Resources/Data/UniversalForecastModel.xlsm` (original tool for reference)

---

## How to Run Locally

```bash
cd app
npm install
npm run dev
```

Opens on `http://localhost:5173`

---

## How to Build & Deploy

```bash
git checkout -b feature/your-change
# Make changes
git push origin feature/your-change
# Create PR on GitHub, review, merge
# Vercel auto-deploys from main
```

---

## Key Memories / Design Ideas to Revisit

- **Flowchart slide-fit idea:** User's concept for fitting large funnels into PPT slides via focus+icon-node approach (smaller minified context nodes for out-of-focus sections). Mark for critique when revisiting export/diagram scaling (PRD §6.4).

---

*This file is the single source of truth for project context. Update it when major decisions are made or architecture changes.*
