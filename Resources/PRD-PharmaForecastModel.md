# Product Requirements Document
## Universal Pharmaceutical Forecast Model — Web App MVP

| | |
|---|---|
| **Version** | 1.0 (Draft for review) |
| **Date** | 11 June 2026 |
| **Author** | Prepared with Claude |
| **Source brief** | `Brief/PharmaForecastModel_DesignBrief.docx` |
| **Status** | For review by author → then handed to Claude Code to build |
| **Audience for the built product** | Senior UXD Lead (design review / concept demo) |

---

## 0. How to read this document

This PRD describes an **MVP web app** that reimagines an existing Excel-based pharmaceutical forecasting tool as an intuitive interface. It is written to be:

1. **Reviewed first** by the author, then
2. **Fed to Claude Code** to build an interactive web app that illustrates the user flows.

It is a *concept demonstrator*, not a market-ready product. Its job is to show a senior UXD lead how an analyst could interact with a redesigned tool — and to prove that the redesign solves the most painful problems of the current Excel model. Where a feature is included to *show the interaction* rather than to *function fully*, this is stated explicitly.

---

## 1. Background & problem statement

### 1.1 What exists today
The current tool is `UniversalForecastModel.xlsm` — an Excel workbook with ~2,400 named shapes and 19 ActiveX dropdowns. It lets an analyst configure a **patient funnel diagram** (total disease population → patients on a specific drug) by toggling dropdowns that show/hide shapes on a canvas.

### 1.2 The core problem
The tool is a **forecast *structure* builder, not a forecast *calculator***. It draws the shape of a forecast but contains no numbers, no formulas, and no quantitative output. The actual numbers live in a separate model; the presentation lives in a separate PowerPoint. Three unlinked artefacts drift apart constantly.

On top of that, the *interaction itself* is error-prone and lossy:
- Changing a parent dropdown silently wipes all child configuration (no warning, no undo).
- The model's routing logic (bypass paths) is invisible in the UI.
- Nothing can be labelled below the segment level; output isn't presentation-ready without manual work.
- There is no way to save, name, or compare scenarios.

### 1.3 What this MVP explores
How the Excel sheet could become an **intuitive web interface** that:
- Separates the three cognitive tasks the Excel tool conflates — **structure, meaning, numbers**.
- Makes the dangerous interactions (cascade resets, bypass routing) **safe and visible**.
- Produces a **polished, presentation-ready funnel diagram**.
- Demonstrates the *shape* of scenario management and persistence, even where those aren't fully wired up.

---

## 2. Goals & non-goals

### 2.1 Goals (what the MVP must achieve)
- **G1** — Demonstrate the **three-step model** (Structure → Labelling → Numbers) as a guided, intuitive flow.
- **G2** — Eliminate the **silent cascade reset** problem: structural changes that would destroy work must be visible, warned, and confirmable.
- **G3** — Make **bypass routing visible** at all times: the user always knows which funnel architecture is active.
- **G4** — Produce an **aesthetic, presentation-ready funnel diagram** that updates live as the configuration changes.
- **G5** — Support **full labelling** at every hierarchy level (segment, sub-segment, LOT, class, product).
- **G6** — Show the **scenario management and save** experience (UI present; persistence non-functional for MVP — see §6.5).
- **G7** — Be **anchored to a real worked example (NSCLC oncology)** so the UXD lead can evaluate real flows, while keeping the universal engine intact.

### 2.2 Non-goals (explicitly out of scope for this MVP)
- **N1** — Not a market-ready or client-deployable product. This is a design exploration to show the UXD lead.
- **N2** — No real backend, database, authentication, or multi-user collaboration. Persistence is illustrated, not implemented (§6.5).
- **N3** — No real epidemiology data sourcing, no live integration with IQVIA / GLOBOCAN / ClinicalTrials.gov.
- **N4** — No node-level access control / confidentiality features (flagged in the brief as a *future* enterprise concern).
- **N5** — Not a validated clinical or financial calculator. Calculations exist to demonstrate the *live-update interaction*, not to be relied upon as a real forecast.
- **N6** — No PowerPoint/Excel file generation. "Export" is demonstrated as an on-screen, presentation-ready view and/or image export (§6.4), not a `.pptx`/`.xlsm` pipeline.

---

## 3. Success metrics

This is a concept demonstrator, so success is judged qualitatively by the UXD lead plus a few directional indicators. Metrics are framed against the current Excel baseline.

| # | Metric | Current baseline | MVP target / signal of success |
|---|---|---|---|
| **M1** | **Time to configure** a basic funnel structure | Unknown; "must know which cells to fill," no guided flow | A first-time user can build a labelled NSCLC-style funnel in a single guided sitting without instructions |
| **M2** | **Lost-work events** (destructive changes with no warning) | Frequent; "single most common source of lost work" | Zero *silent* destructive changes — every destructive action is warned and confirmable |
| **M3** | **Routing clarity** | Bypass logic invisible | A user can always state which bypass paths are active from on-screen cues alone |
| **M4** | **Output polish** | Manual screenshot; placeholder labels | Diagram is presentation-ready on screen with full labels, no manual cleanup |
| **M5** | **Revision friction** | 3–8 cycles, each overwriting prior state | The flow demonstrates non-destructive iteration and scenario comparison (even if persistence is mocked) |
| **M6** | **UXD lead verdict** | — | The lead understands the concept and sees the path from Excel → intuitive interface |

> Note on M1/M5: precise quantitative targets (e.g. "under 10 minutes," "reduce cycles to 2") are deliberately not fixed for the MVP — there's no instrumented baseline to measure against. They're stated directionally and can be hardened once the concept is validated.

---

## 4. Target users

Carried directly from the brief. The MVP is designed for the **primary** user; the others define what the *output* must withstand.

| User | Role | Relationship to the MVP |
|---|---|---|
| **Primary: Analyst / Forecaster** | Market intelligence, commercial insights, strategic planning | **The user we design every screen for.** Power user, works under deadline pressure, owns the output. |
| **Secondary: Reviewer / Decision-maker** | VP Commercial, Head of Market Access, BD director | Never opens the tool. Sees the diagram in a deck. May request changes on the fly → drives the need for fast, non-destructive revision. |
| **Tertiary: External audience** | Payers, regulators, investors | Judge the credibility of the logic chain. Drives the need for labelled, documented, defensible output. |

---

## 5. The domain model (what the app is actually manipulating)

Everything in the app operates on one underlying object: a **funnel configuration**. The funnel is a hierarchy of layers; each layer filters the patient population further.

```
Population pool  (Prevalence / Incidence / Prevalence + Incidence)
        │
        ▼
   Diagnosis        (on/off · N segments · M sub-segments per segment)
        │
        ▼
   Treatment        (mirrors Diagnosis segment structure)
        │
        ▼
   Line of Therapy  (on/off · N lines · sub-segments)        ── can be BYPASSED
        │
        ▼
   Drug Class       (on/off · N classes · sub-segments)       ── can be BYPASSED
        │
        ▼
   Products         (N approved + M pipeline)   ← terminal layer
```

### 5.1 Bypass routing (the four architectures)
The LOT and Class layers can each be toggled off, producing four distinct funnel architectures. The app must make the *active* one unmistakable.

| LOT | Class | Routing behaviour |
|---|---|---|
| YES | YES | Full-depth: Products → Class → LOT → Treatment |
| YES | NO | Products connect after LOT, bypassing Class |
| NO | YES | Class connects to Treatment, bypassing LOT |
| NO | NO | Products connect straight to Treatment (simplest) |

### 5.2 Key structural rules
- **Sub-segment count is configurable *per segment*** (the current Excel tool forces a uniform count — this MVP fixes that; brief §5.5).
- **Every node is labellable** at every level (brief §5.6).
- **Products have a type**: *Approved* (has real-world share) or *Pipeline* (estimated, carries a development-stage attribute: Phase I/II/III/Pre-registration; brief §5.8).
- **The data layer and structural layer are one model** — there is no HOME-vs-Forecast split that can drift (brief §5.7). Counts defined once propagate everywhere.

---

## 6. Scope & functional requirements (MVP)

The app is organised as the **three steps** from the brief, presented as a guided but revisitable flow (the user can move between steps freely; they are stages, not a locked wizard).

### 6.1 Step 1 — Structural configuration (the skeleton)

**Purpose:** the analyst defines the *shape* of the funnel — which layers exist, in what order, how many nodes at each level. No disease-specific labels, no numbers.

**Requirements:**
- **S1.1** Select **pool model type**: Prevalence / Incidence (Diagnosed) / Prevalence + Incidence. Each option has an inline explanation/tooltip of when to use it (brief §3.1 — currently has *no* guidance).
- **S1.2** For each layer (Diagnosis, Treatment, LOT, Class, Products): an **include? (YES/NO)** control.
- **S1.3** For included layers: set **node count** (1–5 for segments/lines/classes; approved + pipeline counts for products).
- **S1.4** Set **sub-segment count per segment** individually — not globally uniform.
- **S1.5** As the structure changes, an **unlabelled funnel diagram** updates live (placeholder node names, correct connections).
- **S1.6** **Active bypass routes are clearly indicated** on the diagram and in a persistent routing summary (see §6.6).

**Cascade safety (G2 — critical):**
- **S1.7** Any structural change that would destroy downstream configuration (e.g. Diagnosis YES→NO, reducing segment count 3→2) must:
  - show a **warning describing exactly what will be lost** (which nodes, which labels, which numbers),
  - require **explicit confirmation**, and
  - **never apply silently**.
- **S1.8** Offer **undo** on structural changes (at minimum within the session).
- **S1.9** *Stretch:* if a structure is reduced and then restored, offer to **recover** the previously entered data for those nodes.

### 6.2 Step 2 — Definition & labelling (the meaning layer)

**Purpose:** give every node a disease-specific identity. Transforms the generic skeleton into a model about a specific disease.

**Requirements:**
- **S2.1** Choose the **segmentation dimension** per segmentation level (Geography / Disease stage / Biomarker / Care setting / Patient demographics / Other-freetext). This is a first-class decision, not an afterthought (brief §4 Step 2).
- **S2.2** **Free-text label every node** — segment, sub-segment, LOT, class, product. Sub-segment labelling must work (the current tool cannot do this at all; brief §5.6).
- **S2.3** Optional **rationale field** per segmentation decision ("why this segmentation?") — supports defensibility for payers/regulators.
- **S2.4** Labels propagate **live** to the diagram.
- **S2.5** **Validation:** warn on empty labels and on duplicate labels at the same level before the output is treated as presentation-ready (brief §2.2 Step B — typos currently propagate silently).

### 6.3 Step 3 — Numeric population (the numbers)

**Purpose:** populate nodes with counts, rates, and shares that turn the diagram into a quantitative forecast. *In scope for this MVP, but framed as a demonstration of the live-update interaction (N5).*

**Requirements:**
- **S3.1** Enter **total population** (prevalence and/or incidence) with a **source citation + year** field.
- **S3.2** Enter **per-segment rates**: diagnosis rate, treatment rate.
- **S3.3** Enter **LOT attrition** between lines.
- **S3.4** Enter **drug class share** and **product market share** (observed for approved; projected peak + time-to-peak for pipeline).
- **S3.5** **Live calculation:** changing any assumption updates all downstream patient counts **and the diagram simultaneously** (brief §4 — "the live connection that does not exist today"). This is the headline interaction of Step 3.
- **S3.6** Each numeric field carries an optional **source**, **date**, and **confidence rating** (brief §5.4). These compile into an **assumptions log** view.
- **S3.7** **Pipeline products** display their development stage and convey **uncertainty visually** (e.g. distinct styling / confidence band) vs approved products (brief §5.8).

### 6.4 Output & export

- **S4.1** A **presentation-ready diagram view** — clean, polished, the thing an analyst would put in a slide (G4, M4). Aesthetics are a first-class requirement, not decoration.
- **S4.2** Toggle the diagram between **structure-only**, **labelled**, and **labelled + numbers** views.
- **S4.3** **Export as image** (PNG/SVG) of the diagram for pasting into a deck. *(No native PowerPoint generation — N6.)*
- **S4.4** *Stretch:* export the **assumptions log** as a standalone view/printable.

### 6.5 Scenario management & persistence (UI present, non-functional)

> **Per the MVP decision:** the save/scenario experience is **designed and clickable**, but does **not** truly persist. It demonstrates the *interaction model* the full product will need (named scenarios, variations, editing saved versions — brief §5.3).

- **S5.1** A **scenario switcher** UI: name a scenario, see a list (e.g. "Base case," "2L positioning," "Upside"), switch between them.
- **S5.2** "**Save**," "**Save as new variation**," and "**Edit saved version**" controls are present and visually responsive.
- **S5.3** A **scenario comparison** view that *shows the concept* of two configurations side by side.
- **S5.4** It must be **honest in the demo**: mocked persistence should be clearly a demo (e.g. seeded example scenarios), not implying a real backend. *(Implementation note: in-session/local state is acceptable to make the clicks feel real; surviving a hard refresh is not required.)*

### 6.6 Cross-cutting: the persistent routing & state summary

- **S6.1** A **persistent panel** (always visible) summarising the **active funnel architecture**: which layers are on/off, which bypass routes are active, current node counts (G3, M3, brief §5.2).
- **S6.2** Updates live as toggles change. The user should never be uncertain which architecture is active.

---

## 7. The NSCLC worked example (seed content)

The app ships **seeded with a non-small-cell lung cancer (NSCLC) oncology funnel** as default content, with the **generic engine intact underneath** and a **"Start blank / Reset to empty"** action.

**Why NSCLC:** it exercises *every* layer the design must handle — biomarker segmentation (EGFR, ALK+, KRAS, PD-L1), deep lines of therapy (1L→3L+), drug classes (PD-1/PD-L1 checkpoint inhibitors, etc.), and a realistic mix of approved + pipeline products. It is the most complete stress-test of the UI and makes flows tangible for the UXD lead.

**Requirements:**
- **E1** Default state loads a coherent NSCLC funnel: prevalence+incidence pool, biomarker-based segments, LOT depth, at least one drug class, and both approved and pipeline products.
- **E2** Labels, counts, and example numbers are realistic enough to be legible to someone who knows oncology, but are clearly illustrative (not represented as validated data).
- **E3** "**Reset to blank**" returns the app to the generic placeholder state (Segment 1–N), proving the universal template.
- **E4** Seed content lives in **one editable data structure** so it's easy to swap or extend to another therapy area later.

---

## 8. UX principles

These guide every screen and resolve ambiguity during the build.

1. **Structure, meaning, and numbers are separate concerns** — never collapse them into one undifferentiated interaction (the original tool's core mistake; brief §4).
2. **No silent destruction** — every action that loses work is visible, warned, reversible.
3. **The model's logic is always visible** — especially routing/bypass. Nothing important is hidden in invisible state.
4. **The diagram is the hero** — it's live, central, and always presentation-quality.
5. **Guided, not gated** — steps orient a first-timer but never trap a power user; movement between steps is free.
6. **Tangible over abstract** — real NSCLC content by default; genericness is provable on demand, not the default experience.
7. **Honest fidelity** — mocked features (persistence, calculations) look real enough to evaluate but never pretend to be production.

---

## 9. Pain point → solution traceability

Every pain point from brief §5, mapped to where this MVP addresses it. Prioritised by the user's criterion: **improves experience, reduces errors/lost work, increases adoption.**

| # | Pain point (brief) | Severity | MVP response | Priority |
|---|---|---|---|---|
| 5.1 | Silent cascade resets | Highest | S1.7–S1.9 warnings, confirmation, undo, recovery | **P0** |
| 5.2 | Invisible bypass routing | High | S1.6 + §6.6 persistent routing summary & diagram overlay | **P0** |
| 5.6 | Sub-segment labelling impossible | High | S2.2 full labelling at every level | **P0** |
| 5.7 | HOME / Forecast decoupled | High | §5.2 single unified data model — no drift possible | **P0** |
| 5.5 | Uniform sub-segment count | Medium | S1.4 per-segment sub-segment count | **P1** |
| 5.3 | No scenario management | Medium | §6.5 scenario UI (present, non-functional persistence) | **P1** |
| 5.4 | No assumption documentation | Medium | S3.1, S3.6 source/date/confidence + assumptions log | **P1** |
| 5.8 | No pipeline confidence differentiation | Medium | S3.7 development-stage attribute + visual uncertainty | **P2** |

> **P0 = must demonstrate convincingly** (these are the adoption-and-error-reduction core). **P1 = strongly desired.** **P2 = include if it doesn't slow the P0/P1 story.**

---

## 10. Technical guidance for the build

Direction for Claude Code. Intentionally lightweight — favour the simplest stack that produces a polished, clickable web app.

- **Type:** single-page web app, runs locally in a browser. No server required.
- **Suggested stack:** React + TypeScript, a modern build tool (Vite). Styling via a utility framework (e.g. Tailwind) or a clean component library — polish matters (G4).
- **Diagram rendering:** SVG-based for crispness and image export. A graph/flow library (e.g. React Flow) is acceptable for the funnel, or hand-rolled SVG if it yields a more controlled, presentation-grade result. The diagram must look designed, not auto-generated.
- **State:** in-memory app state (e.g. a single funnel-config store) is sufficient. Local storage is acceptable to make "save" feel real, but real persistence is **not** required (N2, S5.4).
- **Data model first:** implement the funnel config (§5) as one well-typed structure that all three steps read from and write to — this is what guarantees no HOME/Forecast drift.
- **Seed data:** ship the NSCLC example as a default config object; "Reset to blank" swaps to an empty config.
- **No external API calls.**

---

## 11. Open questions & future scope

Captured for the post-MVP conversation; **not** part of this build.

- **Real persistence & multi-scenario diffing** — the full product needs genuine save/load, named variations, and editing saved versions (the brief's §5.3 requirement; mocked here).
- **Live PowerPoint / Excel export** — native deck generation to kill version drift between file and presentation.
- **Node-level access control** — structural collaborators see the diagram but not confidential numbers (brief §4 scope note).
- **Real data integration** — IQVIA / GLOBOCAN / ClinicalTrials.gov.
- **Hardened success metrics** — instrument time-to-configure and revision counts once there's a baseline (M1, M5).
- **Validated calculation engine** — turning the demonstrative calculations (N5) into a defensible quantitative model.

---

## 12. Appendix — glossary

Condensed from the brief for the build team.

| Term | Meaning |
|---|---|
| **Patient funnel** | The core diagram: total disease population filtered down through layers to patients on a specific product. |
| **Prevalence** | People currently living with the disease at a point in time. |
| **Incidence** | New cases per year — the annual flow into the pool. |
| **Diagnosis rate** | Proportion of the population formally diagnosed. |
| **Treatment rate** | Proportion of diagnosed patients receiving pharmacological therapy. |
| **Line of Therapy (LOT)** | Position in the treatment sequence (1L, 2L, 3L…). Each line has ~40–50% fewer patients than the prior. |
| **LOT attrition** | Patient drop-off between lines (death, palliative transition, loss to follow-up). |
| **Drug class / MoA** | Group of drugs sharing a mechanism of action; direct competitors. |
| **Approved product** | On-market drug with real-world sales data and known share. |
| **Pipeline product** | Drug in development (Phase I/II/III) or awaiting approval; share is estimated and uncertain. |
| **Market share** | Proportion of eligible patients treated with a specific drug. |
| **Peak patient forecast** | Max patients on a drug across the horizon — the primary commercial output. |
| **Bypass routing** | Alternative connection paths when LOT and/or Class layers are excluded (set to NO). |
| **Scenario** | One forecast case = a specific structural config + numeric assumptions (base / upside / downside / 1L vs 2L). |

---

*End of PRD v1.0 (Draft for review).*
