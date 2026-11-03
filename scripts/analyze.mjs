import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { causeOf, dayFirst, groupByCause, uniqueById } from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';
import assert from 'node:assert/strict';

const json = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const rows = await json('../src/lib/data/reports-4471.json');
const notes = await json('../src/lib/data/desk-notes.json');
const tenantDir = new URL('../src/lib/data/tenants/', import.meta.url);
const tenants = new Map();
for (const name of await readdir(tenantDir)) {
  const tenant = JSON.parse(await readFile(new URL(name, tenantDir), 'utf8'));
  tenants.set(tenant.handle, tenant);
}
const reports = uniqueById(rows).filter(r => r.mergedInto === 4471);
const groups = groupByCause(reports, r => tenants.get(r.tenant));
assert(reports.length > 0);
assert.equal(reports.length, new Set(rows.filter(r => r.mergedInto === 4471).map(r => r.id)).size);
assert.equal(groups.reduce((n, g) => n + g.reports.length, 0), reports.length);
assert(groups.every(g => g.cause !== 'unplaced'));
const byId = new Map(rows.map(r => [r.id, r]));
for (const r of rows) assert.deepEqual(r, byId.get(r.id));
const signature = 'Codex / gawarz / S01E03 / 2026-11-03';
const result = {
  exportedRows: rows.length,
  uniqueReports: reports.length,
  overlappingRows: rows.length - reports.length,
  signature,
  deskRef: deskRef(signature),
  tenants: [...tenants.values()].map(t => ({ ...t, dayFirst: dayFirst(t.locale) })),
  mismatchedIntakeTags: reports.filter(r => causeOf(r, tenants.get(r.tenant)) !== r.meta.intakeTag).length,
  groups: groups.map(g => ({ ...g, reports: g.reports.map(r => r.id), oneDayMove: g.reports.filter(r => notes.oneDayMove.includes(r.id)).map(r => r.id) })),
  oneDayMoveReports: reports.filter(r => notes.oneDayMove.includes(r.id))
};
await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
await writeFile(new URL('../evidence/analysis.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
for (const g of groups) await writeFile(new URL(`../evidence/${g.cause}-report-ids.txt`, import.meta.url), g.reports.map(r => r.id).sort().join('\n') + '\n');
console.log(JSON.stringify({ rows: rows.length, unique: reports.length, groups: groups.map(g => ({ cause: g.cause, count: g.reports.length, taggedAs: g.taggedAs })), mismatches: result.mismatchedIntakeTags, deskRef: result.deskRef }, null, 2));
