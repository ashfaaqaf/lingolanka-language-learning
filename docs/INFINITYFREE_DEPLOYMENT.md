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
3. Builds the PWA with Vite.
4. Mirrors only `dist/` into `/htdocs/` over passive FTP without unsupported
   permission changes.

The remote mirror uses `--delete`, so stale generated files are removed from
`/htdocs/`. Files outside `/htdocs/`, including account-level configuration,
are not touched.

## Recovery

If a deployment fails, inspect the failed Actions step without printing secret
values. Fix the source or hosting connection, then use **Run workflow** to retry
the same revision.
