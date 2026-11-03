# Shared parser treats day-first tenant dates as month first

**Reports covered: 379 unique report IDs** in the 2026-10-04 knowledge-base export, originally merged into #4471. Reviewed 2026-11-03. This is an export snapshot, not a current live-queue total.

## Problem

The shared parser reads dates month first for tenants whose locale writes the day first. An ambiguous date can swap its month and day. This path differs from the booking-v3 form-hint defect and needs its own engineering work.

For example, R-41200 (Harbour Dental, en-GB, app) describes a 7 April reminder sent for 4 July. The tenant locale, form version and channel determine the supplied classifier's result; browser locale, intake tag and subject alone do not.

## Scope and counting

- Deduplicate overlapping export pages by report ID before filtering #4471.
- Use the unchanged `causeOf` and `groupByCause` functions in `src/lib/kb/causes.ts` and the tenant directory.
- All 379 report IDs are listed in `evidence/parser-report-ids.txt`.
- Of these reports, intake tagged 356 as parser and 23 as hint. The intake tag is not a cause classification.
- The classifier includes the five desk-noted possible one-day moves: R-41202, R-41209, R-41236, R-41344 and R-41620. Keep them visible for investigation; their wording does not prove a month/day swap or a timezone cause. Do not silently subtract them or claim their root cause is established.

## Expected behavior and verification

Interpret dates consistently with the tenant's locale throughout the shared parsing path. Verify ambiguous day/month pairs as well as unambiguous dates and confirm the booking, invite and reminder agree. Inspect the original booking, invite, timezone and delivery records for the five flagged anomalies before deciding whether to split them into another issue.

## Evidence

- [Signed KB review source](https://github.com/gawarz/mega-s01e03-what-it-shows/blob/main/src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered KB review](https://github.com/gawarz/mega-s01e03-what-it-shows/blob/main/rendered/kb/incidents/4471-review/index.html)
- [Computed analysis and report-ID manifests](https://github.com/gawarz/mega-s01e03-what-it-shows/tree/main/evidence)

The July merge spike records the desk's backlog processing, not the beginning of the customer problem. Recompute this count from unique IDs when a newer export arrives.
