# Manhattan family school guide

GitHub Pages serves the public directory at the root. Family reviews and profiles are encrypted in `family.html` and unlocked in the browser with the shared password. The password and notes-access key are never stored in plaintext in Git.

## Shared notes

Notes and Considering/Not considering choices are saved in the Convex production project `nyc-schools-notes` under the personal `anthonylouisburns` team. A random family access key, contained only in the encrypted family payload, authorizes the HTTP routes. The backend stores only a verification hash. Notes are append-only; retries are idempotent; consideration changes retain an audit history. No browser-local note is presented as successfully saved to the family. Drafts remain on the local device until successful confirmation.

Remember this browser stores a non-exportable browser cryptographic key in IndexedDB after a successful unlock; the plaintext password is not stored. Select Lock guide to clear it. Anyone using a remembered browser can open the guide.

Rank arrows remain browser-local. Notes and consideration choices are shared across devices after unlocking. Refresh notes to see the latest saved entries.

Deploy backend: `npx convex deploy`. Typecheck: `npx tsc --noEmit`. Publish frontend by pushing to main; GitHub Pages serves the repository root. Private source files and environment secrets are ignored. Never publish `.env.local` or `source-private/`.

Middle-school expanded details include InsideSchools reviews, the 2024–25 NYC School Quality Snapshot, and official 2026 NYC School Survey scores. Records show source links, review/report dates, respondent counts and response rates. Survey scores are composites out of 100, not individual-question percentages; 2026 student results establish a new baseline. Public reports may cover several grades and do not establish individual service suitability. Private schools are marked outside the NYC public-school reporting system.

Teddy’s Upper West Side and Tribeca recommendation pages use the same encrypted family payload and remembered browser access. The private build refreshes `family.html`, `teddy-upper-west-side.html`, and `teddy-tribeca.html` together after verification. Neighborhood rankings are editorial tour priorities, separate from saved family rankings; hypothetical address priorities are explicitly distinguished from the current profile.
