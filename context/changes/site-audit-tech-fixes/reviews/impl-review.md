<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Poprawki techniczne z audytu strony (C1, D1, D2, D3, B6, D5)

- **Plan**: context/changes/site-audit-tech-fixes/plan.md
- **Scope**: Full plan (Phase 3 reviewed although 3.5 is pending — a post-deploy check outside this repo)
- **Reviewed phases**: 1, 2, 3, 4
- **Date**: 2026-11-09
- **Verdict**: NEEDS ATTENTION
- **Findings**: 0 critical 4 warnings 3 observations

## Verification run

- `pnpm test` — 15 files / 165 tests passed
- `pnpm type-check`, `pnpm lint` — clean (no tracked files changed by `--fix`)
- `pnpm build` — OK; `dist/index.html`: 1× `og:locale:alternate`, opening `<header>` has no `aria-hidden`; 8 `.woff2` in `dist/assets/`
- `pnpm generate:icons` + `git diff --exit-code src/generated/icons.json` — clean
- `CHECK_NGINX_PORT=18080 pnpm check:nginx` — all ok (default port 8080 was occupied locally)
- `grep -rE 'googleapis|gstatic|api\.iconify\.design' dist` — **returns a hit** (see F1)
- Manual items 1.6–1.8, 2.8–2.10, 3.4, 4.4 are ticked; not re-run. 3.5 (post-deploy `curl -sI`) is pending, as expected.

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | PASS |
| Scope Discipline | PASS |
| Safety & Quality | WARNING |
| Architecture | PASS |
| Pattern Consistency | WARNING |
| Success Criteria | WARNING |

## Findings

### F1 — Success criterion 2.6 fails literally; unregistered icon fails silently

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Success Criteria
- **Location**: src/icons.ts:1-12, dist/assets/index-*.js
- **Detail**: Plan criterion 2.6 (`grep -rE 'googleapis|gstatic|api\.iconify\.design' dist` returns nothing) is ticked `[x]`, but the grep matches `resources:["https://api.iconify.design"]` — the `@iconify/vue` default provider baked into the bundle. No request is made while every icon is registered, but an icon not found by the static scanner (dynamic name, e.g. built in a computed) would make Iconify call the API; CSP `connect-src 'self'` then blocks it and the icon silently disappears — the same failure as audit D1, only quieter. `icons.spec` only checks names found by the same regex.
- **Fix**: In `registerIcons()` call `addAPIProvider('', { resources: [] })` so a missing icon never touches the network, and correct criterion 2.6 in the plan to say what is actually guaranteed (no runtime request) rather than a grep that cannot pass.
  - Strength: Removes the third-party default at the source; test can assert `getAPIConfig('')?.resources` is empty.
  - Tradeoff: Library default string stays in the bundle anyway, so the grep criterion still has to be reworded.
  - Confidence: MED — believed to be the documented way to disable the API, not yet tried here.
  - Blind spot: Behaviour of `@iconify/vue` with empty `resources` on a missing icon (should log/no-op, not throw) is unverified.
- **Decision**: FIXED via Fix (variant) — `addAPIProvider('', {resources: []})` proved a no-op (returns false); instead `registerIcons()` replaces the API module via `_api.setAPIModule` so a missing icon logs `[icons] … run pnpm generate:icons` and never calls the network; test added to icons.spec; plan criterion 2.6 reworded.

### F2 — check-nginx.sh can exit silently or hang on curl failure

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: scripts/check-nginx.sh:48, 67-68, 80, 87
- **Detail**: `curl -s` without `-S`/`--max-time` inside `$(…)` under `set -euo pipefail`: if the container dies mid-run curl exits non-zero and the script ends through the trap with no message; a hung connection stalls forever. Also `curl -sI … | grep -qi` under `pipefail` can false-negative on SIGPIPE (line 80). Cleanup `docker rm -f … || true` drops its error silently.
- **Fix**: Use `curl -sS --max-time 5`, call `fail` with the curl error, capture the header response into a variable before grepping, and warn when cleanup fails.
- **Decision**: FIXED — `curl -sS --max-time 5` everywhere with failures routed through `fail`, headers captured before grepping, cleanup warns instead of swallowing.

### F3 — check-nginx.sh asserts presence, not values, and does not prove the 404 body

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: scripts/check-nginx.sh:67-76, 86-105; context/site-audit-2026-11.md (B4/D3 notes)
- **Detail**: Only the *presence* of the six headers is checked (CSP: just `default-src 'self'` and `connect-src 'self'`, only on `/`). `script-src 'unsafe-inline'`, missing `frame-ancestors`, or `X-Frame-Options: SAMEORIGIN` would pass. `/nie-ma` is only checked for status 404, not that the body is the prerendered `404.html`, so the audit note "checked by check-nginx.sh" overstates it; `/skills` and `/contact` are not in the status list. (Verified locally: `/assets/` → 404, `/projects/` → 200, so the directory-URL concern raised in review does not materialise.)
- **Fix A ⭐ Recommended**: Assert exact expected values for `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and the key CSP directives (`script-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`); assert the `/nie-ma` body contains the not-found title; add `/skills`, `/contact`.
  - Strength: Turns the script into a real regression guard for the exact config the plan specifies.
  - Tradeoff: Script now duplicates header values from `nginx.conf`; a deliberate CSP change needs two edits.
  - Confidence: HIGH — straightforward string assertions.
  - Blind spot: None significant.
- **Fix B**: Compare the full header values extracted from `docker/nginx.conf` against the response
  - Strength: Single source of truth.
  - Tradeoff: Parsing nginx.conf in bash is brittle.
  - Confidence: MED — depends on keeping the `add_header` format stable.
  - Blind spot: Multi-line or reformatted directives.
- **Decision**: FIXED via Fix A — exact values for X-Frame-Options/X-Content-Type-Options/Referrer-Policy, whole-directive CSP match on all 4 paths, `/nie-ma` body must be prerendered 404.html, `/skills` and `/contact` added. Verified red when SAMEORIGIN / script-src 'unsafe-inline' injected.

### F4 — build-icons CLI drops stack trace and deeper causes

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: scripts/build-icons.mjs:22-24
- **Detail**: The catch prints `error.message` and one level of `cause`. Unwrapped failures (readdir/readFile in `collectIconNames`, a throw in `getIcons`, write failure) lose the stack. Project rule: don't discard error causes; `scripts/prerender.mjs:93-96` (the plan's cited pattern) prints message, stack and cause.
- **Fix**: Replace with `console.error(error)` (or mirror the `prerender.mjs` block) and keep `process.exit(1)`.
- **Decision**: FIXED — `console.error('[icons] failed:', error)` prints stack and whole cause chain, exit 1 kept.

### F5 — Audit annotations jumble original sentences; README links untracked CLAUDE.md

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: context/site-audit-2026-11.md:84, 87, 109, 112, 114, 119; README.md:53
- **Detail**: The `*Done 2026-11-09: …*` note was inserted right after the bold title, splitting the sentence (e.g. B4: "…checked by `scripts/check-nginx.sh`.* (SPA fallback). Should be 404…"; D1: "**…runtime** *Done…* from `api.iconify.design`…"); B-items also changed "lists" to "listed". Separately, README "Notes for agents" links `CLAUDE.md`, which is still untracked (`?? CLAUDE.md`), so the link dangles until it is committed. B3/B5 remain `[ ]` although sitemap/JSON-LD/`llms.txt` now exist — out of scope per plan (owner's call).
- **Fix**: Move each note to the end of its item's original text; commit `CLAUDE.md` (or drop the README line).
- **Decision**: FIXED (audit part) — B4, B6, D1 restored to original wording with the Done note after it (C1/D2/D3/D5 keep the established note-after-title style, as in C2). README still links untracked CLAUDE.md — left for you to commit.

### F6 — icons.json ordering depends on readdir order

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: scripts/lib/icons.mjs:36-42, 48
- **Detail**: Prefix order in the output map follows the first file where each prefix appears (`readdir` order, not guaranteed across filesystems), so the committed `icons.json` can churn between machines — `pnpm build` rewrites it every time and `generate:icons` is checked with `git diff --exit-code`.
- **Fix**: Sort prefixes: `[...used].sort(([a], [b]) => a.localeCompare(b))`.
- **Decision**: FIXED — prefixes sorted in `collectIconNames`; `icons.json` regenerated (pure reorder: lucide before simple-icons).

### F7 — Prerendered HTML contains empty placeholder icons (known plan decision)

- **Severity**: 💡 OBSERVATION
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Scope Discipline
- **Location**: src/entry-server.ts (no registerIcons), dist/index.html
- **Detail**: Verified: SSR emits `<svg … viewBox="0 0 16 16" class="h-3.5 w-3.5">` with no body for every Iconify icon; client uses `createApp().mount()` (no hydration), so no mismatch. Crawlers, no-JS clients and the pre-JS paint see blank GitHub/social icons. The plan explicitly deferred this ("Bez renderowania ikon w HTML z SSR — osobna decyzja"), so this is a tracked follow-up, not drift.
- **Fix**: Leave as is; if wanted later, call `registerIcons()` in `entry-server.ts` as a separate change (icons are decorative, text labels carry the meaning).
- **Decision**: SKIPPED — matches the plan's explicit deferral of SSR icons.
