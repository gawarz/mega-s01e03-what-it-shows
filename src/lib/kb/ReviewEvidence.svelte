<script lang="ts">
  import rows from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const reports = uniqueById(rows as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const mismatches = reports.filter(r => causeOf(r, tenantOf(r)) !== r.meta.intakeTag);
  const anomalies = reports.filter(r => notes.oneDayMove.includes(r.id));
  const earliestMerge = reports.map(r => r.mergedAt!).sort()[0];
  const initialDay = earliestMerge.slice(0, 10);
  const initialBatch = reports.filter(r => r.mergedAt?.startsWith(initialDay));
  const oldInBatch = initialBatch.filter(r => r.receivedAt.slice(0, 10) < initialDay);
  const latest = reports.map(r => r.receivedAt).sort().at(-1)!;
</script>

<p>
  The export contains <strong>{rows.length}</strong> rows but <strong>{reports.length}</strong>
  distinct report IDs for #4471. The <strong>{rows.length - reports.length}</strong> overlapping rows
  are not additional reports. Latest received report: <time>{latest}</time>.
</p>
<p>
  The tenant directory, its locale and booking-form version, and the report channel determine
  the supplied classifier's result. Browser intake tags disagree on
  <strong>{mismatches.length}</strong> reports. Subject wording does not establish a shared cause.
</p>
<table>
  <caption>Intake-tag errors, checked against the supplied classifier</caption>
  <thead><tr><th>classified cause</th><th>intake tagged differently</th></tr></thead>
  <tbody>
    {#each groups as group}
      <tr><td>{group.cause}</td><td>{group.reports.filter(r => r.meta.intakeTag !== group.cause).length}</td></tr>
    {/each}
  </tbody>
</table>

<style>
  td { vertical-align: top; }
  td:first-child, td:nth-child(2) { white-space: nowrap; }
</style>

<h2>What the queue chart measures</h2>
<p>
  The first merges occur on <strong>{initialDay}</strong>:
  <strong>{initialBatch.length}</strong> reports were merged that day, including
  <strong>{oldInBatch.length}</strong> received on earlier dates. A merge-time spike records desk
  activity; it does not date the start of the customer problem. Use the separate received series
  to describe when customers reported it. Timestamps retain their exported offsets.
</p>

<h2>{anomalies.length} reports need a separate check</h2>
<p>
  The desk notes flag <strong>{anomalies.length}</strong> reports as possible one-day moves.
  The current classifier files them under <code>parser</code>, so they remain in that ticket's
  count. Their bodies do not establish a month/day swap or prove a timezone cause. Check the
  original booking, invite, timezone and delivery records before moving them or opening a
  separate cause ticket. Do not silently lose them in the majority category.
</p>
<table>
  <thead><tr><th>report</th><th>received</th><th>what the customer said</th></tr></thead>
  <tbody>
    {#each anomalies as report}
      <tr><td><code>{report.id}</code></td><td>{report.receivedAt.slice(0, 10)}</td><td>{report.body}</td></tr>
    {/each}
  </tbody>
</table>
