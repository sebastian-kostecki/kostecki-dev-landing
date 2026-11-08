# kostecki.dev — critical audit (2026-11-08)

Purpose: a backlog of findings about the live site and this repo, written for future
changes and for AI agents working on the project. Each item states the problem, the
evidence, and the intended direction. Check items off (or delete them) as they are fixed.

Method: source review of this repo, live site checks (HTTP headers, link status,
bundle contents), headless Chromium screenshots at 1440px and 390px for `/`, `/projects`,
`/skills`, `/contact`. Browser console and runtime interactions were not inspected.

## Verdict

The site is technically clean and clearly positioned ("Backend Developer / Laravel",
PanelAlpha as flagship), but in 2026 it does not differentiate. It looks like a
template-generated AI portfolio and it proves nothing: every claim is a declaration,
there is no writing, no case study, no measurable outcome, and the AI angle is one
sentence. The design is fine and should not be the focus. The content and
machine-readability are.

## What works (keep)

- Clear positioning in hero and `<title>`; employer and role visible on commercial work.
- Content hierarchy: commercial before personal, PanelAlpha responsibilities listed,
  five WHMCS modules with explicit authorship note.
- Content-driven architecture (`src/content/pl.json`, `src/content/en.json`,
  `src/types/content.ts`) — copy changes do not require template changes.
- Small bundle (~148 KB JS raw / ~53 KB compressed, ~44 KB CSS), responsive layout.
- Accessibility basics: skip link, aria labels, `prefers-reduced-motion`, focus rings.
- OG / Twitter meta, canonical, OG image present and loading.
- All external links resolve (demo, GitHub repos, PanelAlpha, blog).
- Copy is concrete, no marketing filler.

## Findings

### A. Content and positioning (highest impact)

- [ ] **A1. No proof, only claims.** WHMCS modules have no links, screenshots, or
  problem/solution context. PanelAlpha has no scale (instances, integrations, traffic),
  no technical decision, no challenge described.
  Direction: replace project list with 2–3 short case studies (problem, constraints,
  decision, what went wrong, measurable result).
- [ ] **A2. No writing.** No blog, notes, or articles. Writing is the strongest signal of
  reasoning and communication, which is what separates a mid-level engineer from a code
  generator.
  Direction: add a `/notes` or `/blog` section; 4–6 short posts/year on the hosting niche
  (Plesk/cPanel integration pitfalls, WHMCS module gotchas, multi-tenant Laravel).
- [ ] **A3. AI workflow reduced to one sentence** ("I use Cursor"). No evidence of working
  with agents, reviewing generated code, or building with LLMs. Ironically this repo's
  `docs/superpowers/` contains spec-and-plan documents produced with agents and the site
  does not mention it.
  Direction: add a "How I work with AI" section grounded in real workflow (spec → plan →
  agent → review → tests); link this repo and `docs/superpowers/` as a worked example.
  Menu Maker (has an "AI" tag) could be a concrete LLM-in-product example.
- [ ] **A4. Generic "AI template" look.** Dark background, red accent, mono font,
  numbered sections, tag chips. No photo, nothing personal, so it does not build trust
  in a person.
  Direction: keep the design system, add a photo and one personal line near the top.
  Do not redesign.
- [ ] **A5. No CV.** `cv.href` is empty in both locales, so the "Download CV" button is
  hidden. `public/cv/README.md` describes the intended files.
  Direction: add `public/cv/sebastian-kostecki-{pl,en}.pdf` and set `cv.href`.
- [ ] **A6. Hardcoded durations age.** "4 lata" / "4 years", "3,5+ roku" / "3.5+ years",
  "~6 miesięcy" are literals in content JSON. Last content change: 2026-08-12.
  Direction: compute from a start date, or at minimum add a review reminder.
- [ ] **A7. Old brand leaks.** Ogarniam Portfel demo lives on
  `budget.sebastian-kostecki.profesjonalnyprogramista.pl`.
  Direction: move the demo to a `kostecki.dev` subdomain.

### B. Machine readability / SEO (crawlers, AI scrapers, recruiter parsers)

- [ ] **B1. Pure client-side SPA.** Every URL (`/`, `/projects`, `/skills`, `/contact`,
  unknown paths) returns the identical 2.4 KB HTML with home-page meta. Titles and
  descriptions are swapped in `App.vue` after hydration. Crawlers that do not execute JS
  see an empty page.
  Direction: prerender or SSG (vite-ssg, Nuxt, or a post-build prerender step).
- [ ] **B2. Locale is not in the URL.** `useLocale.ts` picks language from
  `localStorage` / `navigator.language`. No `/en/...` routes, no `hreflang`, OG tags
  always Polish regardless of what the visitor would see.
  Direction: URL-based locale (`/en/...`), `hreflang` alternates, per-locale OG.
- [ ] **B3. Sitemap lists only `/`** with `lastmod 2026-05-31`; subpages missing.
- [ ] **B4. Unknown paths return HTTP 200** (SPA fallback). Should be 404 for the
  not-found view (needs prerendering or server-side route list in nginx).
- [ ] **B5. No structured data.** No JSON-LD (`Person`, `WebSite`), no `llms.txt`.
- [ ] **B6. OG locale alternates duplicated**: `og:locale:alternate` lists both `en_US`
  and `pl_PL` while `og:locale` is already `pl_PL`.

### C. UX

- [ ] **C1. Header hidden on home until scroll (desktop).** `SiteHeader.vue` only shows
  the fixed header after 80px scroll on `/`. First-time visitors see no navigation and no
  language switcher above the fold.
  Direction: show the header immediately; keep the blur/border transition on scroll.
- [ ] **C2. Project screenshots are not rendered.** Content JSON has `image` per
  personal project and files exist in `public/assets/projects/`, but `ProjectCard.vue`
  never renders them. `keep-wallet.png` is 815 KB and unused.
  Direction: render thumbnails (optimised WebP/AVIF, ≤100 KB each) or remove the field.
- [ ] **C3. Skills page is a tag wall.** Tags without context (which were used where,
  for how long). Consider linking tags to the project that used them.
- [ ] **C4. Contact page has no form.** Only LinkedIn / GitHub / mailto. Acceptable, but
  a lightweight form (or Cal.com-style booking link) lowers friction for recruiters.

### D. Technical / infra

- [ ] **D1. Icons fetched at runtime** from `api.iconify.design` (`@iconify/vue`
  default). Icons disappear with ad blockers or offline; adds a third-party request.
  Direction: bundle the used `simple-icons` set locally or inline SVGs.
- [ ] **D2. Google Fonts loaded from Google.** Privacy (EU) and extra DNS/TLS round
  trips. Direction: self-host JetBrains Mono and Work Sans (woff2, subset).
- [ ] **D3. No security headers.** Live response has no `Strict-Transport-Security`,
  `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`. Add in `docker/nginx.conf` (or Cloudflare).
- [ ] **D4. No analytics / no way to learn what visitors do.** Consider a privacy-
  friendly counter (Plausible/Umami) if measurement is wanted.
- [ ] **D5. Repo hygiene.** `README.md` is still the Vite scaffold text; no CLAUDE.md /
  AGENTS.md describes content conventions for agents (this file partly fills that gap).
  Direction: replace the README with project-specific notes and link this audit.

## Suggested order of work

1. A1 case studies (biggest lever; content only).
2. A3 "How I work with AI" section + A5 CV.
3. B1 prerender/SSG, then B2–B5 follow naturally.
4. C1, C2, D1, D2, D3 as a single "quick wins" pass.
5. A2 writing as an ongoing habit; A4 photo whenever available.

## Notes for AI agents

- Content lives in `src/content/{pl,en}.json`; both locales must change together and
  `src/types/content.ts` must be updated for new fields.
- Keep the existing design tokens in `src/assets/main.css`; the audit does not call for
  a redesign.
- Do not add marketing filler to copy. Prefer concrete nouns, numbers, and links.
- When a finding above is resolved, tick it here and reference this file in the commit.
