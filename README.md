# kostecki-dev-landing

Personal landing page and portfolio of Sebastian Kostecki at [kostecki.dev](https://kostecki.dev). Bilingual (Polish default, English), dark monospace look, prerendered to static HTML.

Stack: Vue 3, TypeScript, Vite, vue-router, vitest, oxlint + ESLint. Package manager: pnpm.

Infrastructure and deploy: [kostecki-dev-infra](https://github.com/sebastian-kostecki/kostecki-dev-infra) (`docs/LANDING.md`). The build produces one HTML file per route plus `404.html`, so `docker/nginx.conf` must be deployed to the server together with the build. nginx serves `www/`, a copy of `dist/` that the infra scripts sync after a successful build, so a running build never takes the site down. Values derived from the date (years of experience, footer year) are frozen into the prerendered HTML and `llms.txt` at build time, so a rebuild and deploy refreshes them for crawlers without JavaScript; the browser recomputes them on load.

## Commands

```sh
pnpm install
pnpm dev               # generate archive counter, then Vite dev server
pnpm build             # generate icons + archive counter, type-check, client + SSR build, prerender
pnpm preview           # serve the built dist/ locally
pnpm test              # vitest run
pnpm lint              # oxlint + ESLint (with --fix)
pnpm type-check        # vue-tsc --build
pnpm check:nginx       # after pnpm build: nginx -t, HTTP statuses, security headers (needs Docker)
pnpm generate:icons    # rebuild src/generated/icons.json
```

## Content

All copy lives in `src/content/pl.json` and `src/content/en.json`; the shape is defined in `src/types/content.ts`. Keep both files and the type in sync. Experience durations and similar values are computed from dates at runtime (and at build time for prerendered HTML), not stored as text.

## Prerender and deploy

`pnpm build` runs the client build, an SSR build (`src/entry-server.ts`) and `scripts/prerender.mjs`, which writes static HTML per route into `dist/`. The server is nginx using `docker/nginx.conf` (see the paragraph at the top about deploying it with `dist/`).

## Archive counter

`pnpm dev` and `pnpm build` first run `pnpm generate:archive`, which writes the gitignored `src/generated/archive.json`; on a fresh clone run it once before a standalone `pnpm type-check`. Without network it keeps the existing result or the tracked `src/generated/archive.fallback.json` and warns loudly. With `ARCHIVE_STRICT=1` it skips that fallback and exits 1 instead; the daily refresh on the VPS (`scripts/refresh-landing.sh` in kostecki-dev-infra) runs in that mode, so a GitHub outage fails the job visibly and the site keeps its last published build.

## Icons

Icons are not fetched at runtime. `pnpm generate:icons` (`scripts/build-icons.mjs`, also run by `pnpm build`) collects the icons used by the site into `src/generated/icons.json`. Commit that file. Coverage is checked by `scripts/__tests__/icons.spec.ts`, so adding an icon without regenerating fails the tests.

## Fonts

JetBrains Mono and Work Sans are self-hosted through `@fontsource-variable/*` packages; there are no requests to Google Fonts.

## Security headers and CSP

`docker/nginx.conf` sets Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy and a Content-Security-Policy. Rules:

- Any new external resource (script, font, image, API) requires a CSP change in `docker/nginx.conf`.
- Use `add_header` only at server level: an `add_header` inside a `location` block discards all inherited ones.
- `pnpm check:nginx` (`scripts/check-nginx.sh`) verifies the configuration.

## Notes for agents

- `CLAUDE.md` — project instructions for coding agents.
- `context/foundation/site-focus.md` — what the site is for and what it should emphasise.
- `context/site-audit-2026-11.md` — site audit with findings and their status.
