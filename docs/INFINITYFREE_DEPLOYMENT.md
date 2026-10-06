# InfinityFree deployment

The `Validate and deploy to InfinityFree` GitHub Actions workflow publishes the
production Vite build to `https://lingolanka.page.gd` after every push to
`main`. It can also be started manually from the repository's Actions page.

## Required repository secrets

Configure these encrypted GitHub Actions secrets:

- `INFINITYFREE_FTP_HOST`: the InfinityFree FTP hostname
- `INFINITYFREE_FTP_USERNAME`: the hosting account FTP username
- `INFINITYFREE_FTP_PASSWORD`: the hosting account password

Never add the password to a tracked file, workflow log, issue or pull request.

## What the workflow does

1. Installs dependencies with `npm ci`.
2. Runs linting, strict TypeScript checks and the complete test suite.
3. Builds the PWA with Vite using the InfinityFree domain-root base path.
4. Mirrors only `dist/` into `/lingolanka.page.gd/htdocs/` over passive FTP
   without unsupported permission changes. The run fails if that folder does
   not already exist, rather than creating it.

The remote mirror uses `--delete`, so stale generated files are removed from
`/lingolanka.page.gd/htdocs/`. Nothing outside that folder is touched.

## Which folder serves the domain

The FTP account hosts more than one domain. `lingolanka.page.gd` is an addon
domain and serves its own folder, `/lingolanka.page.gd/htdocs/`. The
account-level `/htdocs/` belongs to the account's main domain, not to this site.

Until 2026-10-06 the workflow mirrored into `/htdocs/`. Every run reported
success while the live site kept serving a build uploaded by hand on 2026-08-27.
A green run proves the upload finished, not that the domain serves it: after a
deploy, open the site in a browser and check that the `assets/index-*.js` named
in its HTML is the one this run built. (Command-line tools are stopped by
InfinityFree's browser check.)

## Recovery

If a deployment fails, inspect the failed Actions step without printing secret
values. Fix the source or hosting connection, then use **Run workflow** to retry
the same revision.
