# Assumption Mapping — Pharma Forecasting Configuration Interface

**Agent:** assumption-mapping
**Framework:** VUBF (Value / Usability / Business Viability / Feasibility), adapted for a single-user internal enterprise tool
**Constraint honored:** No direct access to the primary user — all proposed validation methods rely on secondary research, heuristic review, analogical/competitive research, parsing the existing `.xlsm`, and proxy/stakeholder review of low-fidelity artifacts.

---

## 1. Assumption Table

| # | Assumption | Category | Importance | Evidence | Priority |
|---|---|---|---|---|---|
| 1 | The user will accept *any* web interface in place of the Excel tool they've used for years, regardless of how well it's designed | Value | H | L | **Test immediately** |
| 2 | "Familiarity with Excel conventions" is what actually drives this user's comfort — not just raw years-of-use, but specific patterns (grid layout, simultaneous visibility, keyboard-driven navigation, cell-level editing) that we can name and replicate | Usability | H | L | **Test immediately** |
| 3 | A live/dynamic flowchart is the single most valuable improvement we could make — i.e., it's worth being "the core differentiator" rather than a nice-to-have polish item | Value | H | M | Monitor |
| 4 | The 8-level patient-funnel hierarchy can be represented and configured through a *non-spreadsheet* UI (cards, trees, panels, etc.) without the user losing their sense of "where am I in the structure" | Usability | H | L | **Test immediately** |
| 5 | "Simultaneous visibility" of inputs and outputs (a defining Excel/HOME-sheet trait) can be preserved on a single web screen at this level of nesting depth (8 levels × up to 5 segments × 5 sub-segments × …) without overwhelming the layout | Usability | H | L | **Test immediately** |
| 6 | The existing `.xlsm` file's structure, formulas, named ranges, and conditional formatting encode enough of the user's real mental model and workflow that we can reverse-engineer behavioral intent from it (a substitute for direct observation) | Feasibility / Usability | H | M | Monitor |
| 7 | Configuration-only scope (Phase 1, no viewers/output) is a coherent, demoable unit of value on its own — i.e., the user will find a tool that lets them configure but not yet see forecast outputs worth adopting/using repeatedly | Business | H | L | **Test immediately** |
| 8 | The organization (sponsor/stakeholders) will continue to fund Phase 2 (viewers) even if Phase 1 alone doesn't fully replace the Excel workflow — i.e., Phase 1 won't be judged as "incomplete" and shelved | Business | M | L | Test eventually |
| 9 | A live-updating flowchart driven by ~8 nested levels of configuration can be computed and rendered client-side fast enough to feel "instant" (no perceptible lag) on a standard desktop browser | Feasibility | H | M | Monitor |
| 10 | The performance/responsiveness bar the user expects is "Excel-like" (near-instantaneous recalculation), not "modern web app" (loading spinners, debounce, async refresh are tolerable) | Usability / Feasibility | H | L | **Test immediately** |
| 11 | A single power user, used regularly, generates enough ongoing value to justify the engineering and design investment (vs. simply patching the Excel flowchart problem with VBA/macros) | Business | H | M | Monitor |
| 12 | The user's resistance to "unfamiliar interfaces" is about interaction patterns/visual paradigm — not about distrust of the underlying model, change-management fatigue, or loss-of-control concerns that no amount of Excel-like UI will resolve | Value | H | L | **Test immediately** |
| 13 | We can infer enough about navigation needs (how the user currently moves between the 8 levels — tabs, scrolling, named ranges, "go to" boxes) by inspecting the `.xlsm` file's sheet structure, named ranges, hyperlinks, and macros | Feasibility | M | M | Test eventually |
| 14 | Desktop-browser-only is an acceptable and final constraint — the user won't expect/require the tool to also run inside Excel itself (e.g., as an Office Add-in/Excel Online) given 30 years of Excel-based workflow | Feasibility / Value | M | M | Test eventually |
| 15 | Pharma/medical software UX conventions (validation, audit trails, compliance-driven UI patterns) materially shape what "good" looks like for this internal config tool, even though it's not a regulated clinical system itself | Business / Usability | M | L | Test eventually |
| 16 | The configuration logic (YES/NO toggles + counts cascading down 8 levels with dependencies, e.g., "Diagnosis YES" unlocking D1–D3 fields) can be modeled as clean, generalizable UI state without replicating Excel's free-form cell-reference flexibility | Feasibility | H | M | Monitor |
| 17 | Maintaining this tool long-term (post-Phase-1) is realistically lower-cost / lower-risk than maintaining the existing `.xlsm` macro-driven workbook — i.e., the web rebuild is a net maintenance win, not a new maintenance burden layered on top of the old one | Business | M | L | Test eventually |
| 18 | "Improving the experience" (the stated goal alongside familiarity) won't itself become a source of resistance — i.e., the user wants *some* things to change (the broken flowchart) but will tolerate other incidental changes that come with a full UI rebuild | Value | M | M | Test eventually |
| 19 | One Figma prototype reviewed by internal stakeholders/proxies (not the actual user) will produce feedback that's a reliable enough proxy for the real user's reaction to justify moving to implementation | Business / Usability | M | M | Test eventually |
| 20 | The hierarchy depth and branching (5 segments × 5 sub-segments × 3 diagnosis × 3 treatment × 4 LOT × classes × products) is fixed/bounded enough that a generalized UI pattern (not custom screens per level) will hold up across all real configurations the user creates | Feasibility | M | M | Test eventually |

---

## 2. Top 5 Assumptions to Research/Validate First

These are pulled from the **Test immediately** quadrant (High importance × Weak evidence), prioritized by how foundational they are to downstream IA/design decisions.

### 1. (#1) "The user will accept any web tool, if designed well, as a replacement for 30 years of Excel habit"

**Riskiest failure mode:** We invest weeks designing and building a polished, Excel-flavored web interface, and the user simply keeps using the `.xlsm` file (or asks IT to "just fix the flowchart in Excel"), because the switching cost — relearning *any* new tool, however familiar-feeling — outweighs the benefit of a live flowchart. The whole project becomes shelfware.

**Cheapest validation approach (no user access):**
- **Analogical/literature research**: Search for documented case studies, UX research, and practitioner write-ups on "Excel power users migrating to web tools" (e.g., finance/ops teams moving from Excel models to internal web apps, "Excel refugees," enterprise tool-adoption post-mortems). Look specifically for what made migrations succeed vs. fail — was it feature parity, performance, control/auditability, or something else?
- **Parse the `.xlsm` for "investment signals"**: Examine how heavily customized the workbook is (macros, custom named ranges, conditional formatting, manual workarounds). A heavily personalized file suggests high switching cost and stronger resistance; a relatively "vanilla" structured workbook suggests lower attachment and higher openness to migration.
- **Stakeholder/sponsor interview substitute**: Ask whoever championed this project (the internal sponsor, not the end user) *why* they believe a web tool is wanted/needed — what's the stated trigger (the broken flowchart, IT policy, succession planning, scaling to other users)? Their answer is itself evidence about whether adoption is likely to be voluntary or mandated.

---

### 2. (#2) "Familiarity = specific, nameable Excel conventions we can replicate (grid input, simultaneous visibility, immediate feedback) — not just 'looks like Excel'"

**Riskiest failure mode:** We build something that superficially resembles Excel (gridlines, spreadsheet-like styling) but misses the *behavioral* conventions that actually matter (e.g., tab/arrow-key navigation, type-to-edit-in-place, instant recalculation, copy-paste across cells, undo via Ctrl+Z). The user perceives it as "a worse, fake Excel" rather than "a familiar tool that's also better" — the worst of both worlds.

**Cheapest validation approach (no user access):**
- **Direct artifact inspection**: Open the `.xlsm` HOME sheet and Forecast Model sheet and catalog *exactly* which Excel mechanics are in active use — manual cell entry vs. dropdowns/data validation, conditional formatting, frozen panes, named ranges, macros/buttons, cross-sheet references. This is the single richest source of "what this user actually relies on" available to us without interviews.
- **Expert heuristic review**: Have the research-analyst sprint (Sprint 2.1 — Excel Conventions) explicitly catalog the *general* literature on "why Excel feels intuitive to power users" (e.g., Nielsen Norman Group, spreadsheet-cognition research, "spreadsheet as universal interface" essays) and cross-reference against what's actually present in this specific `.xlsm`. The overlap is our highest-confidence "preserve" list.
- **Build a tiny interactive Figma/prototype "convention test"**: Mock up 2–3 alternative input patterns (e.g., grid-style table input vs. card-based form vs. accordion) for just ONE level (e.g., Segments) and have internal proxies (designer, sponsor, anyone with Excel-power-user traits) react to "which feels closest to how a spreadsheet works." Cheap, fast, and generates comparative signal pre-build.

---

### 3. (#4 + #5) "The 8-level hierarchy can be configured AND simultaneously visible without overwhelming a single screen"

**Riskiest failure mode:** We design a single-screen "config + live flowchart" layout (mirroring the HOME sheet's left/right split) that works fine for 2–3 levels in a demo, but collapses under real complexity — 5 segments × 5 sub-segments × cascading D/T/LOT/Class/Product fields — forcing constant scrolling, modal stacking, or screen-switching that *breaks* the very "simultaneous visibility" we were trying to preserve, leaving the user more lost than in Excel (where they could at least see everything in cells/sheets at once).

**Cheapest validation approach (no user access):**
<br>
- **Quantify the real configuration surface from the `.xlsm`**: Count actual cells/inputs/visible rows on the HOME sheet for a *realistic* configuration (not the theoretical max of 5×5×3×3×4...). The user likely doesn't max out every branch every time — the file will show us the realistic footprint we need to design for.
- **Competitive/analogical pattern research (Sprint 2.2)**: Specifically look at how tools handling comparably deep nested configuration solve "see structure + edit detail" simultaneously — e.g., file-tree + detail-pane patterns (IDEs, design tools), master-detail layouts (email clients, CRM record editors), collapsible tree + canvas (org-chart tools, Figma's own layer panel + canvas). Document 5-7 concrete IA patterns and how they manage depth without overwhelming the screen.
- **Low-fidelity layout test via proxy review**: Sketch 2-3 wireframe options (e.g., "tree nav + detail panel + live flowchart," "tabs per level + persistent flowchart," "single scrolling canvas with collapsible sections") and walk a stakeholder/proxy through each with a *realistic* (not maximal) configuration scenario, asking "could you find your place and make a change here without getting lost?" This is a cheap heuristic-walkthrough substitute for usability testing.

---

### 4. (#7) "Configuration-only (Phase 1) is a coherent slice of value the user will actually adopt and use repeatedly — even without seeing outputs"

**Riskiest failure mode:** The user configures the model in the new web tool... and then has to flip back to Excel (or wait for Phase 2) to actually *see* what the configuration produces. This breaks their workflow loop (configure → see result → adjust), making the new tool feel like extra work bolted onto the old one rather than a replacement — so they default back to doing everything in Excel, and Phase 1 never becomes the primary tool it was meant to be.

**Cheapest validation approach (no user access):**
- **Map the actual workflow loop from the `.xlsm`**: Determine how tightly coupled "configure" and "see results" are in current practice — does the user typically set the full configuration once and then run/view many times (favoring a config-only Phase 1), or do they iterate rapidly between tweaking inputs and checking the flowchart/outputs in the same sitting (which would make a config-only tool feel incomplete)? The frequency of HOME-sheet edits vs. Forecast-Model-sheet views (if inferable from file metadata, version history, or macro logs) is a useful proxy.
- **Sponsor/stakeholder framing check**: Ask the internal sponsor directly: "If we ship configuration-only first, would [user] actually switch to it, or wait for the full thing?" This is a stakeholder-proxy question, not a user interview, and it surfaces whether Phase 1 was scoped based on engineering convenience or genuine workflow understanding.
- **Competitive/analogical research**: Look for examples of tools/products that successfully shipped a "config-only" or "setup-only" MVP ahead of full functionality (common in admin-panel and workflow-tool products) and what made users adopt (or reject) the partial tool — this tells us what conditions make a config-only slice "enough."

---

### 5. (#10) "The user expects Excel-like instantaneous responsiveness, not modern-web-app levels of latency"

**Riskiest failure mode:** We build a technically solid web app with typical web-app latencies (a few hundred ms of recompute/render lag when toggling a YES/NO or changing a segment count), and to a 30-year Excel power user — accustomed to F9-instant recalculation — this reads as "broken" or "slow," reinforcing their resistance to "unfamiliar [and inferior-feeling] interfaces" regardless of how good the IA is.

**Cheapest validation approach (no user access):**
- **Benchmark Excel's own recalculation behavior in the `.xlsm`**: Open the file, toggle configuration inputs, and literally time/observe how fast the flowchart-adjacent cells and any conditional formatting respond. This sets a concrete, evidence-based performance bar (rather than guessing "Excel = instant").
- **Feasibility desk-research**: Have the research/feasibility check assess what's achievable client-side (e.g., React state-driven re-render of an SVG/canvas flowchart with ~8 levels of nested state) vs. what would require server round-trips — and stress-test whether a "feels instant" client-side architecture is realistic given the hierarchy's branching factor. This is pure technical literature/prototyping research, not user-dependent.
- **Build a throwaway interactive prototype of just the flowchart re-render** (e.g., a Figma interactive prototype or a quick coded spike) driven by toggling 2-3 config inputs, and have a proxy/stakeholder compare its perceived speed to the `.xlsm` HOME sheet side-by-side. Cheap, fast, directly comparative, and doesn't require the real user.

---

## 3. Decision Rules

### 1. "User will accept any well-designed web tool" (#1)
- **Validates if:** Analogical research turns up a consistent pattern that power-user migrations succeed when (a) the new tool removes a known pain point (here: the broken flowchart) AND (b) switching cost is minimized through familiar patterns — *and* the sponsor confirms the user has expressed any appetite for a better tool (even indirectly, e.g., complaining about the flowchart). → **Then:** Proceed with the Excel-familiarity-first IA strategy as planned, and treat "fixing the flowchart" as the primary adoption lever to foreground in the design.
- **Invalidates if:** Migration literature consistently shows power users reject *any* replacement of a deeply personalized tool regardless of design quality, or the sponsor reveals the user has shown no interest in change (the project is purely IT/leadership-driven). → **Pivot:** Reframe the IA strategy around *minimum-disruption coexistence* rather than replacement — e.g., design the web tool to run alongside Excel, perhaps even exportable/importable to `.xlsm` format, positioning it as "an option," not "the new way," to lower the adoption bar and reduce shelf-risk.

### 2. "Familiarity = specific Excel conventions we can name and replicate" (#2)
- **Validates if:** Cataloging the `.xlsm` reveals a clear, finite set of conventions in active use (e.g., dropdown-driven cell input, conditional formatting cues, frozen-pane navigation) that map cleanly onto known web equivalents, AND general Excel-cognition literature corroborates that these specific mechanics (not just "spreadsheet look") are what power users rely on. → **Then:** Build a "Preserve list" of named conventions into the design-principles doc (Phase 3) and design every input pattern against that explicit checklist.
- **Invalidates if:** The `.xlsm` shows heavy reliance on free-form, ad hoc Excel behaviors (arbitrary cell references, manual formula edits, unstructured layout) that have no clean web equivalent, or literature suggests "familiarity" for power users is really about *control and transparency* (seeing/editing the underlying logic) rather than surface interaction patterns. → **Pivot:** Shift the design emphasis from "replicate Excel interactions" to "preserve Excel's sense of transparency and control" — e.g., expose the configuration "logic" visibly (labels, dependencies, live previews of what each toggle affects) rather than trying to mimic grid mechanics, which may be a losing and costly imitation game.

### 3. "8-level hierarchy can be configured + simultaneously visible on one screen" (#4/#5)
- **Validates if:** The realistic configuration footprint extracted from the `.xlsm` (not the theoretical max) is modest enough that a master-detail or tree+canvas pattern (found in competitive research) comfortably fits a single desktop viewport, and proxy walkthroughs of low-fi wireframes show reviewers can navigate the realistic scenario without confusion. → **Then:** Commit to a single-screen "config + live flowchart" IA as the primary recommendation for Phase 3, modeled on the strongest-performing competitive pattern identified.
- **Invalidates if:** The realistic footprint is large/deep enough that every layout option in proxy walkthroughs produces "I'm lost" or "too much scrolling" reactions. → **Pivot:** Recommend a **multi-screen / progressive-disclosure IA** instead — e.g., a persistent mini-flowchart "map" plus level-by-level configuration screens (breadcrumb or wizard-like navigation) — explicitly trading strict "simultaneous visibility" for manageable focus, while keeping a always-visible structural overview as the familiarity anchor.

### 4. "Config-only Phase 1 is a coherent, adoptable slice of value" (#7)
- **Validates if:** Evidence from the `.xlsm` workflow (e.g., configuration is typically set up once per cycle and outputs are checked separately/later) and/or sponsor confirmation indicates the user's real workflow has a natural "configure, then later review" separation — meaning a config-only tool fits an existing behavioral seam. → **Then:** Proceed with Phase 1 as scoped, but explicitly design the "hand-off" moment (e.g., an export/summary view, or a clear "your configuration is ready — view results in Excel for now" bridge) to soften the Phase 1→2 gap.
- **Invalidates if:** Evidence suggests configuration and output-review are tightly interleaved in a single sitting (rapid iterate-and-check cycles), making a config-only tool feel incomplete. → **Pivot:** Escalate to the sponsor that Phase 1 scope carries real adoption risk, and recommend either (a) pulling a *lightweight* preview/output element into Phase 1 scope (even a simplified, non-authoritative summary), or (b) explicitly planning Phase 1 as an internal/design-validation milestone rather than a user-facing release — resetting expectations about when "real" adoption can be measured.

### 5. "User expects Excel-like instant responsiveness" (#10)
- **Validates if:** Benchmarking the `.xlsm` shows near-instant recalculation (sub-second, no visible lag) on configuration changes, AND feasibility research confirms a client-side architecture can match that for the live flowchart at realistic hierarchy depths. → **Then:** Set "near-instant, no loading states for config changes" as a hard, non-negotiable performance requirement in the design-principles and engineering handoff — this becomes a headline success metric for Phase 1.
- **Invalidates if:** Either (a) the `.xlsm` itself shows noticeable recalculation lag at full complexity (meaning the user's actual bar is more forgiving than "instant"), or (b) feasibility research shows true Excel-speed client-side rendering at full hierarchy depth is unrealistic on standard desktop browsers. → **Pivot:** If (a) — relax the performance requirement to "match or beat current Excel lag," removing an artificially aggressive engineering constraint. If (b) — design *around* the limitation: introduce deliberate, well-crafted micro-interactions (smooth transitions, progressive rendering of the flowchart level-by-level) that make perceptible latency feel intentional and "alive" rather than broken — turning a technical constraint into a designed feature of the "live flowchart" differentiator.
