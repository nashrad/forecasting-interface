# Pharma UX Implementation Checklist
## Requirements for Compliant Configuration Interface

Use this checklist during design and implementation to ensure compliance and user trust.

---

## Phase 1: Design (Before Building)

### Configuration Architecture
- [ ] Define hierarchical structure (study → cohort → parameter)
- [ ] Design sidebar navigation for hierarchy
- [ ] Plan read-only config view + edit modal
- [ ] Design version history display
- [ ] Define role-based access (modeler, reviewer, approver, viewer)
- [ ] Plan configuration states (draft, submitted, approved, active, superseded)

### Change Control Workflow
- [ ] Map out approval process (who approves what?)
- [ ] Design "Reason for Change" capture (dropdown + text field)
- [ ] Plan notification flow (when does reviewer get notified?)
- [ ] Define escalation (what if reviewer doesn't respond in 5 days?)
- [ ] Design comments/feedback mechanism

### Validation Strategy
- [ ] List all real-time validation rules (non-blocking)
- [ ] List all batch validation rules (blocking on save)
- [ ] Design validation error messages (explain why, not just "invalid")
- [ ] Plan dependency visualization (what changes when user modifies parameter X?)

### Audit Trail Design
- [ ] What fields get logged? (parameter, old value, new value, reason, timestamp, user ID)
- [ ] How is timestamp stored? (UTC? Include timezone?)
- [ ] Who can view audit logs? (everyone? only admins?)
- [ ] Can audit logs be searched? (by user, date, parameter, reason)
- [ ] How are logs exported? (PDF? JSON? CSV?)

### Forecast Presentation
- [ ] Show forecast results with point estimate + 90% confidence intervals
- [ ] Include sensitivity analysis (what-if scenarios)
- [ ] Display assumptions that drive forecast
- [ ] Show source documentation for assumptions
- [ ] Label preview vs. locked forecast clearly

### Configuration Export
- [ ] Design PDF report structure
- [ ] Design JSON export structure
- [ ] Include version info, audit trail summary, approvals
- [ ] Test that exported config can be re-imported (if applicable)

---

## Phase 2: Implementation (Architecture & Database)

### Versioning System
- [ ] Design config version table (id, version_number, status, created_by, created_at, etc.)
- [ ] Implement immutable version creation (never edit existing version)
- [ ] Store version relationships (current → prior → earlier)
- [ ] Design "activate version" operation (switch active version without recreating)
- [ ] Plan version retention (how long to keep archived versions?)

### Audit Trail System
- [ ] Design audit_log table (timestamp, user_id, action, field_name, old_value, new_value, reason, ip_address)
- [ ] Make audit logs immutable (append-only; never delete)
- [ ] Add indexes on (user_id, timestamp, field_name) for searchability
- [ ] Implement batch insert for audit logs (performance)
- [ ] Plan log retention policy (7-10 years minimum)

### Change Control Workflow System
- [ ] Design workflow status table (draft, submitted, in_review, approved, active)
- [ ] Implement approval_chain table (who reviews, who approves, timestamps)
- [ ] Create notification system (when config is submitted, when approval needed, etc.)
- [ ] Design comments/feedback system (linked to specific configs or parameters)
- [ ] Implement escalation logic (auto-notify if pending >5 days)

### Role-Based Access Control
- [ ] Design roles table (modeler, reviewer, approver, viewer)
- [ ] Map roles to permissions (who can create, edit, approve, view?)
- [ ] Implement role assignment (user → role mapping)
- [ ] Enforce permissions at API level (not just UI)
- [ ] Plan audit logging of access (who accessed what config, when?)

### Data Integrity
- [ ] Validate all configuration parameters before save
- [ ] Check for circular dependencies (if applicable)
- [ ] Ensure forecast results match configuration version
- [ ] Version-lock forecasts (forecast must reference config version)
- [ ] Test rollback (can you revert to old config without losing new data?)

---

## Phase 3: User Interface

### Configuration View (Read-Only)
- [ ] Display current active configuration prominently
- [ ] Show version number + status
- [ ] Show who approved it + when
- [ ] Display all parameters in table format
- [ ] Include "Edit" button → launches edit modal
- [ ] Include "View History" button → shows version history

### Edit Modal/Form
- [ ] Display current value + proposed new value
- [ ] Show units clearly
- [ ] Include help text (what is this parameter? why does it matter?)
- [ ] Include range/validation info (acceptable values?)
- [ ] Show sources (where did current value come from?)
- [ ] Real-time validation feedback (non-blocking)
- [ ] Preview impact on forecast (live updating, labeled as preview)
- [ ] Require "Reason for Change" before save
- [ ] Save button creates new version (don't overwrite)

### Change Reason Capture
- [ ] Dropdown: Regulatory, Data, Protocol, Other
- [ ] Text field: Detailed explanation
- [ ] Optional: Attach source document (FDA guidance, monitoring data, etc.)
- [ ] Validation: Ensure reason is filled before save

### Version History View
- [ ] List all versions (newest first)
- [ ] Show: version number, status, created by, created date, changes
- [ ] Show approval chain (who approved, when)
- [ ] Show change summary (what changed from prior version)
- [ ] Action buttons: View, Activate (if not current), Clone, Revert

### Audit Trail View
- [ ] List all changes chronologically
- [ ] Filterable by: user, date range, parameter, reason
- [ ] Searchable (find specific changes)
- [ ] Exportable to PDF/CSV
- [ ] Read-only (no editing)
- [ ] Timestamps are clear (UTC or explicit timezone)

### Forecast Display
- [ ] Point estimate (e.g., "250 patients")
- [ ] Confidence interval (e.g., "90% CI: [240-260]")
- [ ] Confidence level (e.g., "High" based on 3 comparable studies)
- [ ] Assumptions listed (what values drove this forecast?)
- [ ] Sensitivity analysis (table or sliders: "if X changes, then Y changes")
- [ ] Last modified date (when was config last changed?)
- [ ] Approval info (approved by, date)
- [ ] Status: Draft vs. Locked (VERY clear)

### Multi-User Collaboration
- [ ] Submission workflow: Modeler → Reviewer selection → Submit
- [ ] Review interface: Show config, allow approve/reject, require comments if rejecting
- [ ] Approval interface: Final sign-off (signature, if required)
- [ ] Notification badges (reviews pending, approvals pending)
- [ ] Activity log (who did what, when)

### Export/Download
- [ ] "Export as PDF" button → downloads configuration snapshot
- [ ] "Export as JSON" button → downloads machine-readable config
- [ ] PDF includes: parameters, forecast, assumptions, audit summary
- [ ] JSON includes: all metadata, version info, full audit trail

---

## Phase 4: Testing & Validation

### Audit Trail Testing
- [ ] Verify every change creates audit log entry
- [ ] Verify timestamps are consistent (not user-modifiable)
- [ ] Verify user ID is captured correctly
- [ ] Verify reason is captured
- [ ] Test audit log search (by user, date, parameter, reason)
- [ ] Test audit log export (PDF readable, JSON parseable)
- [ ] Verify audit logs cannot be deleted or modified
- [ ] Test log retention (old logs still accessible after 6 months)

### Version Testing
- [ ] Create config v1
- [ ] Modify → creates v2
- [ ] Verify v1 is archived (not deleted)
- [ ] Activate v1 → verify current version switches
- [ ] Verify forecast generated from correct version
- [ ] Test version comparison (v1 vs v2 differences)
- [ ] Test rollback (revert to v1, create v3 with v1 values)

### Change Control Workflow Testing
- [ ] Modeler creates config (draft)
- [ ] Modeler submits for review (becomes read-only)
- [ ] Reviewer reviews + approves
- [ ] Config becomes active
- [ ] Verify modeler cannot edit after submission
- [ ] Verify reviewer has correct access
- [ ] Test rejection flow (reviewer rejects; goes back to modeler)
- [ ] Test multi-step approval (reviewer → approver)

### Role-Based Access Testing
- [ ] Modeler can create/edit configs; cannot approve
- [ ] Reviewer can review/approve; cannot edit
- [ ] Approver can final-approve; cannot edit
- [ ] Viewer can view only; cannot edit/approve
- [ ] Admin can manage users/roles
- [ ] Test API-level enforcement (not just UI)

### Validation Testing
- [ ] Real-time validation: format checks work
- [ ] Real-time validation: warnings appear but don't block
- [ ] Batch validation: cross-parameter checks work
- [ ] Batch validation: blocks save if critical rule fails
- [ ] Test error messages (clear, actionable)
- [ ] Test dependency tracking (change A → warns about impact on B)

### Forecast Testing
- [ ] Forecast updates live during preview (clearly labeled draft)
- [ ] Forecast is read-only after config is locked
- [ ] Confidence intervals calculated correctly
- [ ] Sensitivity analysis shows correct ranges
- [ ] Assumptions match config (not outdated)
- [ ] Forecast linked to config version (can trace which assumptions were used)

### Data Integrity Testing
- [ ] Cannot modify locked config
- [ ] Cannot delete archived versions
- [ ] Audit trail matches actual changes (no gaps)
- [ ] Forecast matches config assumptions (spot check calculations)
- [ ] Export files are accurate (PDF + JSON match config)

---

## Phase 5: Compliance Validation

### Regulatory Requirements
- [ ] ALCOA: Attributable — every change logged with user/reason ✓
- [ ] ALCOA: Legible — audit trail readable without proprietary tools ✓
- [ ] ALCOA: Contemporaneous — changes logged at time of action ✓
- [ ] ALCOA: Original — no deletion/modification of audit logs ✓
- [ ] ALCOA: Accurate — all values match system state ✓

### 21 CFR Part 11 Compliance
- [ ] Audit trails record all changes (§11.10(e)) ✓
- [ ] Access control prevents unauthorized access (§11.100) ✓
- [ ] System validation documented ✓
- [ ] Data integrity maintained (§11.100(b)) ✓
- [ ] Electronic signatures (if applicable) follow requirements ✓

### GxP Compliance
- [ ] Change control: All changes require review ✓
- [ ] Documentation: Reasons captured + searchable ✓
- [ ] Reproducibility: Same config → same forecast ✓
- [ ] Traceability: Can trace forecast back to config version ✓

### Documentation
- [ ] Design document completed
- [ ] Validation protocol written
- [ ] Test cases documented
- [ ] Configuration management plan written
- [ ] Audit trail retention policy documented
- [ ] User roles & responsibilities documented

---

## Phase 6: Launch & Monitoring

### User Training
- [ ] Train modelers on configuration editing
- [ ] Train reviewers on approval workflow
- [ ] Train users on audit trail searching
- [ ] Train admins on user/role management
- [ ] Create user documentation (help texts in app)
- [ ] Create FAQ (common questions)

### Monitoring & Support
- [ ] Monitor audit log size (is it growing too fast?)
- [ ] Monitor workflow latency (are approvals slow?)
- [ ] Monitor error rates (are validations working?)
- [ ] Set up alerts (if audit logs unreachable, if version corrupted)
- [ ] Plan support process (what if user accidentally submits wrong config?)

### Post-Launch Validation
- [ ] Audit a few configurations (spot-check audit trails)
- [ ] Verify workflow adoption (are users following approval process?)
- [ ] Measure user satisfaction (is UI usable?)
- [ ] Validate forecasts against known results (accuracy check)
- [ ] Review change logs for patterns (are users following policy?)

---

## Quick Scoring

Before launch, you should be able to answer "Yes" to these:

### Audit Trail
- [ ] Every configuration change is logged with: user, timestamp, what changed, why
- [ ] Audit logs are searchable (by user, date, parameter)
- [ ] Audit logs are exportable (PDF or JSON)
- [ ] Audit logs are immutable (cannot be deleted/modified)
- [ ] Audit logs are retained for 7-10 years

### Versioning
- [ ] Each change creates a new version (v1 → v2 → v3)
- [ ] Versions are named clearly (v3.2-FDA-Feedback [2026-06-05])
- [ ] Current active version is obvious
- [ ] Users can revert to prior versions (explicit, auditable operation)
- [ ] Free undo is not available

### Change Control
- [ ] Configuration must be reviewed before going active
- [ ] Reason for change is mandatory
- [ ] Approval workflow is clear (who approves what?)
- [ ] Workflow cannot be bypassed
- [ ] Rejected configs go back to modeler (not deleted)

### Transparency
- [ ] Forecast shows formula/assumptions (not black-box)
- [ ] Confidence intervals and sensitivity analysis included
- [ ] Parameter sources are documented
- [ ] Users can explain why each parameter was chosen
- [ ] All logic is traceable to requirements/regulations

### Export
- [ ] Configuration can be exported to PDF
- [ ] PDF includes all parameters, forecast, audit trail summary
- [ ] Configuration can be exported to JSON
- [ ] JSON is machine-readable (can be parsed programmatically)

### Role-Based Access
- [ ] Users are assigned roles (modeler, reviewer, approver, viewer)
- [ ] Roles cannot be self-assigned
- [ ] Permissions match roles (enforced at API level)
- [ ] Access is logged (who accessed what, when)

---

## Red Flags (Stop & Reconsider)

If any of these are true, stop and redesign:

- 🚫 Users can undo changes freely (audit trail becomes confusing)
- 🚫 Configuration can be edited after forecast is generated (coupling problem)
- 🚫 Audit trail shows keystroke-level changes (too much noise)
- 🚫 No approval required for major changes (single-person control)
- 🚫 Forecast is black-box (no assumptions shown)
- 🚫 Cannot export configuration (tool becomes black box to regulators)
- 🚫 Version history is unclear (is v1 or v2 active?)
- 🚫 Reason for change is optional (ALCOA requires attribution)
- 🚫 Audit logs deleted after 30 days (retention too short)
- 🚫 No role-based access (everyone can do everything)

---

## Timeline Estimate

| Phase | Task | Estimated Time |
|-------|------|---|
| Design | Configuration architecture, workflows, UI designs | 2-3 weeks |
| Implementation | Versioning, audit trails, RBAC | 4-6 weeks |
| Testing | Audit, workflow, validation, compliance | 2-3 weeks |
| Compliance Review | Regulatory validation, documentation | 1-2 weeks |
| Launch | User training, monitoring setup | 1 week |
| **Total** | | **10-15 weeks** |

(Assumes 2-3 developers; may vary based on team size & complexity)

---

## Final Checklist: Launch Readiness

- [ ] All audit trail requirements met
- [ ] All version control requirements met
- [ ] All workflow requirements met
- [ ] All transparency requirements met
- [ ] Export functionality tested
- [ ] Role-based access tested
- [ ] Compliance validation completed
- [ ] User training completed
- [ ] Monitoring & support plan in place
- [ ] Documentation archived (for regulators)

---

**When all items are checked, you're ready to launch a pharma-compliant configuration interface.**

