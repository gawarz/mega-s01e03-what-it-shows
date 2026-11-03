# Booking-v3 date hint conflicts with parsing for day-first tenants

**Reports covered: 33 unique report IDs** in the 2026-10-04 knowledge-base export, originally merged into #4471. Reviewed 2026-11-03. This is an export snapshot, not a current live-queue total.

## Problem

Booking-v3 prints `MM/DD/YYYY` under its date field while the form interprets the entry in the tenant's day-first order. A user who follows that hint can get the wrong date. This is a distinct input-path defect; fixing the shared month-first parser does not establish that the form's visible instructions and interpretation agree.

The affected form reports belong to Alder Physio (de-DE), Copper Studio (es-ES) and Pale Harbour (pt-PT), which run booking-v3. R-41230 (Copper Studio, form) describes 6 January becoming 1 June. R-41241 (Alder Physio, form) describes a 6 August booking appearing on 8 June.

## Scope and counting

- Deduplicate the export by report ID, filter #4471, then use `causeOf` with the tenant directory.
- This group requires a day-first tenant, channel `form`, and the month-first hint printed by booking-v3.
- All 33 report IDs are listed in `evidence/hint-report-ids.txt`.
- Intake tagged 18 as hint and 15 as parser. Counting tags alone would incorrectly report 41 hint reports across the whole ticket.

## Expected behavior and verification

Make the displayed date format and the form's parsing contract agree for the tenant. Verify an ambiguous day/month example for each affected locale and confirm the accepted booking date matches the form's instructions. Retain separate checks for the shared-parser path. Do not merge this issue into the parser issue merely because their subjects or final symptoms match.

## Evidence

- [Signed KB review source](https://github.com/gawarz/mega-s01e03-what-it-shows/blob/main/src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered KB review](https://github.com/gawarz/mega-s01e03-what-it-shows/blob/main/rendered/kb/incidents/4471-review/index.html)
- [Computed analysis and report-ID manifests](https://github.com/gawarz/mega-s01e03-what-it-shows/tree/main/evidence)

The accepted historical subject-only decision remains intact. The new review documents its conflict with the cause-based explorer and recommends a replacement decision. Recompute the report count when a newer export arrives.
