# Manhattan family school guide

GitHub Pages serves the public directory at the root. Family reviews and profiles are encrypted in `family.html` and unlocked in the browser with the shared password. The password and notes-access key are never stored in plaintext in Git.

## Shared notes

Notes and Considering/Not considering choices are saved in the Convex production project `nyc-schools-notes` under the personal `anthonylouisburns` team. A random family access key, contained only in the encrypted family payload, authorizes the HTTP routes. The backend stores only a verification hash. Notes are append-only; retries are idempotent; consideration changes retain an audit history. No browser-local note is presented as successfully saved to the family. Drafts remain on the local device until successful confirmation.

Remember this browser stores a non-exportable browser cryptographic key in IndexedDB after a successful unlock; the plaintext password is not stored. Select Lock guide to clear it. Anyone using a remembered browser can open the guide.

Rank arrows remain browser-local. Notes and consideration choices are shared across devices after unlocking. Refresh notes to see the latest saved entries.

Deploy backend: `npx convex deploy`. Typecheck: `npx tsc --noEmit`. Publish frontend by pushing to main; GitHub Pages serves the repository root. Private source files and environment secrets are ignored. Never publish `.env.local` or `source-private/`.

Middle-school expanded details include InsideSchools reviews, the 2024–25 NYC School Quality Snapshot, and official 2026 NYC School Survey scores. Records show source links, review/report dates, respondent counts and response rates. Survey scores are composites out of 100, not individual-question percentages; 2026 student results establish a new baseline. Public reports may cover several grades and do not establish individual service suitability. Private schools are marked outside the NYC public-school reporting system.

Release history and rollback guidance: [RELEASES.md](RELEASES.md). Each published version has an annotated `release-YYYY-MM-DD.N` Git tag. Frontend recovery preserves the separately stored shared notes and consideration history.

Sources summary and searchable public bibliography: [sources.html](sources.html). The family directory places Considering schools first while preserving saved order within groups. Public bibliographic records contain no private account links or family feedback.

The current recommendation page is `teddy-recommendations.html`: one set of 30 schools with an Upper West Side / Tribeca toggle that changes commute assumptions and editorial tour order. Existing neighborhood URLs redirect there and retain anchors. The current private build refreshes the encrypted family guide and combined page, then writes the two legacy redirects. Notes and consideration controls stay attached to each school across toggles.

Edith’s matching `edith-recommendations.html` page includes 30 schools, the two commute views, existing shared notes/choices and a watch list. Colors use the saved signed-in MySchools estimates where available, with the check date shown; SHSAT, private and assessment-dependent options remain unassessed. Both children’s recommendation pages are rebuilt alongside the encrypted family guide.

The encrypted `screened-brooklyn.html` and `screened-manhattan.html` directories use the same password and remembered-browser access as the family guide. They retain all 25 Brooklyn / 24 Manhattan schools returned by the October 26, 2026 Screened search and all programs shown at each matching school. Their personalized program estimates belong only in the encrypted payload. Rebuild all five encrypted entry pages together. The separate public `screened-assessments.html` page contains only public admissions requirements.

The encrypted `open-edopt-manhattan.html` directory lists 10 Open and 56 Educational Option school matches, with displayed programs, personalized bars, Niche links and addresses. It orders High first, then other estimates, using MySchools distance order within each group as rough proximity from Tribeca. Rebuild all six encrypted entry pages together; the private supplemental renderer/build merges page content while preserving original profiles and notes access.

The nine-page compact PDF is generated privately under `output/pdf/` and embedded only in the encrypted family payload. Unlocked pages create a browser-local PDF download link. The public assessment page links to the family unlock page; never commit the plaintext PDF or render previews. OSIS identifiers are likewise added only by the private encrypted-payload build.
