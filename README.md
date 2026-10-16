# Manhattan family school guide

GitHub Pages serves the public directory at the root. Family reviews and profiles are encrypted in `family.html` and unlocked in the browser with the shared password. The password and notes-access key are never stored in plaintext in Git.

## Shared notes

Notes and Considering/Not considering choices are saved in the Convex production project `nyc-schools-notes` under the personal `anthonylouisburns` team. A random family access key, contained only in the encrypted family payload, authorizes the HTTP routes. The backend stores only a verification hash. Notes are append-only; retries are idempotent; consideration changes retain an audit history. No browser-local note is presented as successfully saved to the family. Drafts remain on the local device until successful confirmation.

Rank arrows remain browser-local. Notes and consideration choices are shared across devices after unlocking. Refresh notes to see the latest saved entries.

Deploy backend: `npx convex deploy`. Typecheck: `npx tsc --noEmit`. Publish frontend by pushing to main; GitHub Pages serves the repository root. Private source files and environment secrets are ignored. Never publish `.env.local` or `source-private/`.
