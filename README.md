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
