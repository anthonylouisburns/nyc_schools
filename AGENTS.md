# Publishing this family school guide

- The user requests ongoing commits and pushes as work is completed. Publish authorized website changes to `main` after appropriate checks.
- Maintain `RELEASES.md` for every release, create and push an annotated release tag, and verify GitHub Pages before calling a release live.
- Keep rollback checkpoints. Prefer new revert commits; never rewrite shared history or force-push.
- Preserve saved notes and consideration choices in Convex. Routine frontend rollback must not roll back, delete or migrate their database, change school identifiers, or replace access configuration without checking compatibility.
- Personal profiles, tailored assessments and access keys belong only in the encrypted family payload. Never commit `source-private/`, private research, environment secrets or plaintext credentials.
- Build and verify `family.html`, `teddy-upper-west-side.html` and `teddy-tribeca.html` together. See `README.md` and `RELEASES.md` for deployment and recovery guidance.
