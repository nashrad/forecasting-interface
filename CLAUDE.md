# PharmaForecast — Project Context

**Last updated:** 12 June 2026  
**Current version:** v0.1.0-mvp (tagged on GitHub)  
**Status:** Polish phase **underway**. Branches 1, 2, 3a/3b + pool-first build flow are built and in PRs (#1–#3 on GitHub). Being built as a **wireframe to validate concept and layout before Figma polish** — judge the work on interaction/layout, not visual finish.

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
│   │   │   ├── diagram/           # FunnelDiagram.tsx (SVG: nodes, ghosts, callouts)
│   │   │   ├── shared/            # CascadeWarningModal, RoutingPanel, ScenarioSidebar,
│   │   │   │                      #   LayerInfoModal, ScenarioPanel (old, unmounted)
│   │   │   └── steps/             # Step1Structure, Step2Labels, Step3Numbers, StepNav
│   │   ├── data/                  # nsclcSeed.ts (sample), layerMeta.ts (build copy), limits.ts (node caps)
│   │   ├── store/                 # funnelStore.ts (Zustand state)
│   │   ├── types/                 # funnel.ts (TypeScript domain model)
│   │   ├── utils/                 # calculations.ts (live patient count computation)
│   │   ├── App.tsx                # Three-column layout: config | canvas | scenarios
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
- PNG export (shelved per UX review, still wired)
- Deployed on Vercel

> **Note (12 June):** the polish phase has since changed runtime behaviour — the app now boots into an **empty progressive build**, not NSCLC. NSCLC is retained as a sample scenario. The old in-left scenario switcher was replaced by the right-hand placeholder column. See "Polish-Phase Decisions" below.

### Version Control
- `main` branch = stable, v0.1.0-mvp tagged
- GitHub repo is clean (Resources/ removed, .claude/ excluded)
- No long-lived `dev` branch (using GitHub Flow + feature branches for polish)

---

## UX Lead Review — Key Decisions (11 June 2026)

Meeting with **Ayat Tayebulla** (UX Lead). These decisions override the original MVP scope:

### Scope shift
- **Step 1 (structural configuration) is the immediate stakeholder deliverable.** Steps 2 and 3 are built but will not be shown until a later review. Do not remove them — just deprioritise them in demos.
- **Export is shelved entirely for now.** PowerPoint, PNG, Excel — all deferred. Do not prioritise.
- **Slide-fit idea (focus + icon nodes)** — also shelved until export becomes a deliverable.

### New action items from the call
1. **Scenario redesign** — Scenarios must become **top-level navigation** (like ChatGPT conversation list), not a sidebar widget. Needs Figma exploration before code. Research how base/upside/downside scenarios should be classified first.
2. **GitHub-style versioning** — Explore version history and change tracking for the flowchart.
3. **Excel export** — When export is revisited, it should target Excel (not PowerPoint). Users want to reuse the visualization in existing Excel workflows. These are meaningfully different: Excel implies live data; PowerPoint implies static snapshot.
4. **Taxonomy clarification** — Revisit the Excel sheet and orientation document to clarify: drug class vs product, marketed vs pipeline. The current model hierarchy may be wrong.
5. **Diagram visual polish** — Node widths and padding need adjustment. Patient pool node should NOT span the full canvas width. Ideate in Figma first.
6. **Configuration panel UX** — Make it intuitive enough for a first-time user to complete setup in under 5 minutes.

### Conceptual clarifications (from the call)
- **Prevalence** = currently diagnosed cases (not total population with the disease)
- **Incidence** = new cases per year; separate from prevalence, visualised separately
- **Diagnosis layer** = filters the undiagnosed fraction out of prevalence
- **Drug class** = mechanism of action grouping (e.g. PD-1/PD-L1 inhibitors, CDK4/6 inhibitors)
- **Line of therapy** = treatment sequence by intensity; 1L has the most patients, 3L+ progressively fewer

---

## Next Phase: Polish

### Workflow agreed
- Each group of related changes = one **feature branch** (GitHub Flow)
- Branch planning files stored in `Resources/branches/feature-[name].md` — one file per branch, acts as design brief for that branch
- Two parallel tracks once branches are scoped:
  - **Track A** — features that don't need visual design: implement immediately
  - **Track B** — features that need Figma first: design → send mockup → implement
- Never work two branches that touch the same files simultaneously (merge conflict risk)

### Branches built this phase (planning files in `Resources/branches/`)
- **Branch 1 (`feature/canvas-layout`, PR #1, merged)** — centre diagram; Step 1 compact nodes; sub-segments stacked vertically; config panel restructured into nested per-layer cards.
- **Branch 2 (`feature/scenario-panel`, PR #2, merged)** — three-column shell (config | canvas | scenarios); right scenario panel is a **placeholder** (no CRUD yet).
- **Branch 3 (`feature/interactive-canvas-building`, PR #3, merged)** — ghost nodes (3a), progressive layer building (3b), the pool-first flow, compact-hug + responsive-scaling layout fix. See "Progressive Canvas Building" below.
- **Canvas node editing (`feature/canvas-node-editing`, PR #4, merged)** — add/delete segment & sub-segment on the canvas with config sync; fixed Treatment so the toggle renders a node; made `CascadeWarning` copy overridable (skip reads "you can add it back").
- **All-layer node editing (`feature/canvas-node-editing-all-layers`, PR #5, open)** — add/delete buttons on **every** layer (treatment, LOT, drug class, products); Treatment is now a **multi-node** layer (`TreatmentNode[]`); shared `data/limits.ts` so config & canvas caps agree (was: canvas uncapped vs config max 5). Sub-segment add stays Diagnosis-only.

### Still open / deferred
- **Branch 4 (`feature/config-panel-mapping`)** — bidirectional hover-highlight (node ↔ config section) + focus button on section headers. *Not built yet; the last item on the polish list.*
- **Pool Incidence/Mortality sub-nodes** — **parked for the Figma pass.** Data-model part is trivial; the open question is the visual grammar for inflow/outflow nodes against a downward funnel (design brief p.6).
- Still Figma-track (not started): full diagram visual polish, scenario CRUD/classification, versioning UI, taxonomy fix.

---

## Polish-Phase Decisions (12 June 2026)

These were decided in-session and **override** earlier open questions. Don't relitigate.

### Three-step model: kept
- Guided vs Freestyle modes were considered and **rejected** — the three-step wizard stays the single model.
- **Node behaviour by step:** Step 1 (Structure) nodes are compact and show only an initial+index (`P`, `S1`, `SS1.1`, `L1`, `DC1`, `Pr1`), hugging their text. Steps 2/3 expand the node. Node content model = **heading + subheading + a KPI-style value** (the earlier "tag" field was dropped).
- Step 3 is built but **deferred** in demos until stakeholders approve Steps 1–2.

### Scenarios: decided
- Forecast scenarios with **locked structure, varying numbers, user-named**. A scenario is a numeric snapshot over a shared structure (not a structural copy). UI is a right-hand column; CRUD waits until Step 3 numbers are in scope.

### Progressive Canvas Building (the headline new architecture)
- The app **boots into an empty build** (`poolSet: false`, all middle layers pending). NSCLC is kept as a sample scenario, no longer the default active one. "New blank" header button re-enters the flow.
- **Pool first:** the canvas shows a pool-model callout (3 options); nothing else renders until one is chosen. The config panel is **disabled-but-visible** until then.
- Then a **sequential Add/Skip callout** walks each buildable layer in order: **diagnosis → lot → drugClass → products**. Only the first undecided layer shows a callout; layers below stay hidden until reached.
- **Add** opens `LayerInfoModal` (explanation + "don't show again", controlled by `showLayerTips`) then includes the layer; **Skip** → confirm → renders a dashed **ghost node** with a `+` to re-add. Skipped layers make bypass routing visible in the funnel itself.
- State model (`types/funnel.ts`): `poolSet`, `pendingLayers: BuildableLayer[]` (`diagnosis|lot|drugClass|products`), and `products.included`. A layer is *included* / *skipped* / *pending*. Canvas and config both write the same store — neither is primary.
- Node editing: every layer row has canvas add (`+`) / delete (`×`) controls (gated to Step 1); sub-segment add is Diagnosis-only. Treatment is a multi-node layer (`TreatmentNode[]`). Node-count caps live in `data/limits.ts` and are shared by config and canvas.
- Rejected mapping ideas (do not build): horizontal layer-row alignment, mini-flowchart legend in config. Drag-and-drop reorder also rejected.

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

- **Flowchart slide-fit idea:** User's concept for fitting large funnels into PPT slides via focus+icon-node approach (smaller minified context nodes for out-of-focus sections). **SHELVED** — revisit only when export becomes a deliverable. Critique this idea at that point (PRD §6.4).
- **Branch planning:** User has a list of polish changes ready to share at the start of the next session. First task in that session: group into feature branches, prioritise, create `Resources/branches/` files.

---

*This file is the single source of truth for project context. Update it when major decisions are made or architecture changes.*
