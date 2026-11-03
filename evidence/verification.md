# Local verification · 2026-11-03

- Built the actual Svelte/mdsvex project successfully with the pinned dependency lockfile.
- Inspected the production HTML in Chrome at `/kb/incidents/4471-review/`.
- The rendered table shows 412 unique reports: parser 379, hint 33.
- The rendered signature stamp is `DR-RVZA-AYCX`, matching the source `deskRef` function.
- The page distinguishes 427 export rows from 412 reports and computes 38 intake-tag mismatches.
- The timeline explanation computes 184 merges on 2026-07-02, 183 received on earlier dates.
- The five desk-noted one-day reports remain visible, with uncertain root cause stated.
- Changed report A's channel from form to app: the explorer changed from different causes to the shared parser cause, confirming hydration and interaction.
- The accepted decision 0001 and the original incident/triage pages were preserved.

To repeat the data checks, run `pnpm analyze`. Assertions check unique-ID counting, complete
cause partitions, available tenant classification, and equality of overlapping rows.

After the course required its issued ticket as the signature, rebuilt the page and checked
that its rendered stamp matches the reference computed from that exact frontmatter value.
