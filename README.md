# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review

The original export remains intact. Added review material:

- [Signed review source](src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered review HTML](rendered/kb/incidents/4471-review/index.html)
- [Computed counts and report IDs](evidence/analysis.json)
- [Parser issue draft](issues/parser.md) and [form-hint issue draft](issues/hint.md)

The supplied classifier groups 412 unique report IDs into 379 parser reports and 33 form-hint
reports. These are counts for the exported snapshot. Fifteen overlapping rows are removed by
ID. Five one-day-move reports remain visible with their classification limits explained.
The review's numeric tables and charts compute from the supplied data and functions.

The review's frontmatter carries the exact course-issued ticket as its signature. The supplied
`deskRef` function derives the rendered stamp from that signature; the analysis script reads
the signature from the page rather than defining another one. No accepted decision record
was edited.

### Reproduce

Use Node 22.18 or newer (the analysis script imports TypeScript) and pnpm 10.17.1:

```sh
pnpm install --frozen-lockfile --registry=https://registry.npmjs.org
pnpm analyze
pnpm build
python3 -m http.server 4173 --bind 127.0.0.1 --directory rendered
```

Open `http://127.0.0.1:4173/kb/incidents/4471-review/`. The static build includes working
client-side explorer controls and all original KB pages. The Rollup WebAssembly package
avoids a native-module signing conflict with the Node runtime bundled in the desktop app.
All build dependencies and their exact resolutions are recorded in `pnpm-lock.yaml`.
