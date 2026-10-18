# Publishing this family school guide

- The user requests ongoing commits and pushes as work is completed. Publish authorized website changes to `main` after appropriate checks.
- Maintain `RELEASES.md` for every release, create and push an annotated release tag, and verify GitHub Pages before calling a release live.
- Keep rollback checkpoints. Prefer new revert commits; never rewrite shared history or force-push.
- Preserve saved notes and consideration choices in Convex. Routine frontend rollback must not roll back, delete or migrate their database, change school identifiers, or replace access configuration without checking compatibility.
- Personal profiles, tailored assessments and access keys belong only in the encrypted family payload. Never commit `source-private/`, private research, environment secrets or plaintext credentials.
- Build and verify encrypted `family.html` and both `teddy-recommendations.html` and `edith-recommendations.html` together; preserve `teddy-upper-west-side.html` and `teddy-tribeca.html` as neighborhood/anchor-preserving redirects. See `README.md` and `RELEASES.md` for deployment and recovery guidance.

- Maintain `sources.html` and `data/sources.json` as the research source summary/register. Add newly used public sources as research changes; distinguish evidence years and unverified family feedback. Never place private account/profile/notes URLs, credentials or personal assessment text in the public register.
- The combined recommendation page currently lists 30 schools with a neighborhood toggle; keep numbered maps and verified video watch lists aligned with their contents. Preserve every saved family consideration choice when revising a shortlist.

- Before revising family recommendations, read current shared notes and consideration choices. Attribute unverified family concerns as feedback, preserve original notes, and do not silently omit previously selected schools. Keep the video watch lists aligned and check new links when changing their content.
