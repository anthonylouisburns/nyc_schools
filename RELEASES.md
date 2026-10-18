# Website releases

Live guide: https://anthonylouisburns.github.io/nyc_schools/family.html

Release tags identify recoverable versions of the website. GitHub Pages publishes `main`; tags preserve checkpoints and do not deploy by themselves. Dates below use New York time.

| Version | Date | Website changes | Checkpoint |
| --- | --- | --- | --- |
| 2026-10-18.3 | October 18, 2026 | Add release history, recovery guidance and ongoing publishing instructions. Website behavior unchanged from .2. | `release-2026-10-18.3` |
| 2026-10-18.2 | October 18, 2026 | Two neighborhood top-ten pages, navigation beneath the middle-school tab, school-detail deep links and video watch lists. | `release-2026-10-18.2` · `0684baf` |
| 2026-10-18.1 | October 18, 2026 | Middle-school InsideSchools summaries, dated Quality Snapshot figures and 2026 survey scores with response rates. | `release-2026-10-18.1` · `ae6fd8f` |

Earlier recoverable commits:

- `8cb9836`: remove the intersection methodology sentence.
- `5fbe63b`: signed-in MySchools high-school offer estimates, with eligibility qualifications.
- `2b43d5d`: multiple district selections and shared Considering filter.
- `f1bf260`: remembered browser access and additional requested schools.

## Publishing each change

1. Update this history with a new version, the final changes, relevant checks and any limitation.
2. Build all encrypted family pages together; keep personal material and access keys out of plaintext commits.
3. Check the affected pages, commit and push to `main`, then create and push an annotated release tag.
4. Verify GitHub Pages serves the released files before reporting the release as live.

Validation for 2026-10-18.2: both pages show ten unique schools and matching watch-list entries; remembered access works; school links open the correct expanded entry and notes; navigation sits beneath the middle-school button. All three encrypted pages were synchronized and matched the live deployment. Existing saved notes and choices were not modified.

## Rolling back safely

Prefer a new commit that reverts the faulty website change, followed by a normal push. Keep history intact: do not reset the shared branch or force-push it. Inspect the selected release tag and later changes before choosing what to revert; dependent releases may need to be reverted together. Record the rollback as a new release and verify the deployed pages.

A website rollback does not require restoring or deleting the shared notes database. Notes and consideration choices live separately in Convex. Preserve school identifiers and the current access configuration; do not deploy an older backend, change its schema, rotate access keys or restore database backups as part of a routine website rollback. Older frontend versions must be checked for compatibility with the current notes service before release.

Revert all affected encrypted pages together. A failed or incomplete build must never be published. Release notes must not contain private family assessments, credentials or access keys.
