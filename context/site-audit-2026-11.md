# kostecki.dev — critical audit (2026-11-08)

Purpose: a backlog of findings about the live site and this repo, written for future
changes and for AI agents working on the project. Each item states the problem, the
evidence, and the intended direction. Check items off (or delete them) as they are fixed.

Method: source review of this repo, live site checks (HTTP headers, link status,
bundle contents), headless Chromium screenshots at 1440px and 390px for `/`, `/projects`,
`/skills`, `/contact`, and a `gh`-based review of the GitHub profile and repositories
(section E). Browser console and runtime interactions were not inspected.

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
- [x] **A3. AI workflow reduced to one sentence** *Done 2026-11-08: home section
  "Working with AI agents" with four evidence-linked steps (root-keeper context, archive,
  CLAUDE.md, CI) and the 10xDevs course.* ("I use Cursor"). No evidence of working
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
- [x] **B4. Unknown paths return HTTP 200** (SPA fallback). Should be 404 for the
  not-found view (needs prerendering or server-side route list in nginx).
  *Done 2026-11-09 (change `site-prerender`): nginx serves prerendered routes with 200 and everything else with 404 and the app's not-found view; checked by `scripts/check-nginx.sh`.*
- [ ] **B5. No structured data.** No JSON-LD (`Person`, `WebSite`), no `llms.txt`.
- [x] **B6. OG locale alternates duplicated**: `og:locale:alternate` lists both `en_US`
  and `pl_PL` while `og:locale` is already `pl_PL`.
  *Done 2026-11-09: single `og:locale:alternate` generated from pageMeta.*

### C. UX

- [x] **C1. Header hidden on home until scroll (desktop).** *Done 2026-11-09: header visible on `/` from first paint, becomes solid after 80px scroll.* `SiteHeader.vue` only shows
  the fixed header after 80px scroll on `/`. First-time visitors see no navigation and no
  language switcher above the fold.
  Direction: show the header immediately; keep the blur/border transition on scroll.
- [x] **C2. Project screenshots are not rendered.** *Partly done 2026-11-08: featured
  personal projects render a WebP screenshot (Domowy Skarbnik, 58 KB); unused PNG/JPG
  removed. Regular cards stay text-only.* Content JSON has `image` per
  personal project and files exist in `public/assets/projects/`, but `ProjectCard.vue`
  never renders them. `keep-wallet.png` is 815 KB and unused.
  Direction: render thumbnails (optimised WebP/AVIF, ≤100 KB each) or remove the field.
- [ ] **C3. Skills page is a tag wall.** Tags without context (which were used where,
  for how long). Consider linking tags to the project that used them.
- [ ] **C4. Contact page has no form.** Only LinkedIn / GitHub / mailto. Acceptable, but
  a lightweight form (or Cal.com-style booking link) lowers friction for recruiters.

### D. Technical / infra

- [x] **D1. Icons fetched at runtime** from `api.iconify.design` (`@iconify/vue`
  default). Icons disappear with ad blockers or offline; adds a third-party request.
  Direction: bundle the used `simple-icons` set locally or inline SVGs.
  *Done 2026-11-09: icons come from `src/generated/icons.json`, no requests to api.iconify.design.*
- [x] **D2. Google Fonts loaded from Google.** *Done 2026-11-09: `@fontsource-variable` fonts self-hosted.* Privacy (EU) and extra DNS/TLS round
  trips. Direction: self-host JetBrains Mono and Work Sans (woff2, subset).
- [x] **D3. No security headers.** *Done 2026-11-09: six security headers incl. CSP in `docker/nginx.conf`, verified by `scripts/check-nginx.sh`.* Live response has no `Strict-Transport-Security`,
  `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`. Add in `docker/nginx.conf` (or Cloudflare).
- [ ] **D4. No analytics / no way to learn what visitors do.** Consider a privacy-
  friendly counter (Plausible/Umami) if measurement is wanted.
- [x] **D5. Repo hygiene.** *Done 2026-11-09: README rewritten for this project.* `README.md` is still the Vite scaffold text; no CLAUDE.md /
  AGENTS.md describes content conventions for agents (this file partly fills that gap).
  Direction: replace the README with project-specific notes and link this audit.

### E. GitHub profile (github.com/sebastian-kostecki) — the site links here, so it is part of the business card

Checked 2026-11-08 via `gh`: profile fields, 20 repos (9 public), pinned items,
contribution calendar, READMEs, CI, tests, external contributions.

- [x] **E1. The strongest personal project is not on the site.** *Done 2026-11-08:
  Domowy Skarbnik (successor of wallet-master) is the featured personal project, Root
  Keeper and FocusBlocker added, keep-wallet and o-nia-o-niego removed. PanelAlpha Engine
  added as open-source commercial work (E13 site part).* `wallet-master`
  (public, Laravel 13 / PHP 8.5 / Inertia / Vue, 496 commits, 188 test files, Pest,
  Larastan, Pint, GitHub Actions lint+tests green, `AGENTS.md`, `.ai/` + `.cursor/`
  rules, Docker prod compose) is by far the most convincing repo. The site instead links
  "Ogarniam Portfel" to `keep-wallet`: vanilla PHP from 2022 with no framework, no tests,
  last commit 2023. A recruiter who clicks lands on the weakest possible repo.
  Direction: make `wallet-master` the featured personal project (it is also the real
  "household budget" successor); demote or drop `keep-wallet`; link the live demo once it
  exists on a `kostecki.dev` subdomain.
- [ ] **E2. Profile bio is a liability.** Current bio: "I'm very ambitious person, who
  want change my life. I'm looking for new challanges for my professional life. I like
  learning new stuff." Grammar errors, junior tone, and it contradicts the site's
  "4 years production backend" positioning. `blog`/website field is empty, no social
  accounts linked, `company` empty, status "Working from home".
  Direction: one-line bio matching the hero ("Backend Developer (Laravel) at
  ModulesGarden — PanelAlpha, hosting/WHMCS integrations"), set website to
  https://kostecki.dev, add LinkedIn as a social account, set company.
- [ ] **E3. No profile README, no pinned repositories.** Visitors see an unordered
  list of repos with `BudgetApp`/`PingPong` (C++ learning projects from 2021) mixed in.
  Direction: create the `sebastian-kostecki/sebastian-kostecki` profile README (short:
  who, stack, 3 featured repos with one line each, link to site). Pin `wallet-master`,
  `menu-maker`, `rozgadana-jana`, and the landing repo if it goes public.
- [x] **E4. Zero repo descriptions, topics, or homepage URLs on all 20 repos.**
  *Done 2026-11-08: descriptions and topics on every repo, homepage on landing and
  rozgadana-jana, MIT LICENSE files added to menu-maker and wallet-master.* Every
  public repo shows a blank description in listings and search. Only `menu-maker` and
  `wallet-master` declare a license (via README badge, not GitHub's license field).
  Direction: one-sentence description + topics (`laravel`, `php`, `inertia`, `whmcs`…)
  + homepage URL per public repo; add LICENSE files where MIT is claimed.
- [x] **E5. Test and scaffold repos are public.** *Done 2026-11-08: both made private;
  keep-wallet, o-nia-o-niego, BudgetApp, PingPong, ogarniam-portfel, HomeBudgetApp and
  BudgetAppOnline archived.* `project-pixel-perch` is a Lovable
  scaffold whose README says "I would like to make my porfolio page (I'm Php
  developer)", contains `test.txt`, and its last 10 commits are "test: auto-deploy
  check 4", "test: real GitHub webhook (retry)". `test-static-page` is a one-commit
  "Nexus Labs" demo. Both appear on the profile next to real work.
  Direction: make private, archive, or delete. Keep the profile to repos you would
  show in an interview.
- [ ] **E6. Contribution graph looks empty.** Last 12 months: 414 contributions, all
  in Jun/Aug/Sep 2026; Nov 2025–May 2026 and Oct–Nov 2026 show zero. Private
  contributions are hidden (`restrictedContributionsCount = 0`) even though private
  repos (`household-treasurer`, `client-area-next`, `root-keeper`) were pushed this
  month. Commercial work is on the employer's account, so the public graph
  under-represents real activity.
  Direction: enable "Include private contributions on my profile"; consider moving
  reusable, non-sensitive side work to public repos.
- [ ] **E7. No external footprint.** 0 pull requests or issues in other people's
  repositories, 0 gists, 1 star, 1 follower, no organisations. For a developer who
  integrates cPanel, Plesk, DirectAdmin, PowerDNS, WHMCS daily this is a missed signal.
  Direction: one or two small upstream PRs or well-written issues per quarter in the
  libraries actually used (Laravel packages, WHMCS SDKs, DNS clients) are worth more
  than another personal repo.
- [ ] **E8. Repo quality is uneven and the site does not signal which is which.**
  `rozgadana-jana` is a full WordPress core dump (28 MB, default `readme.html` as the
  README, 5 commits) rather than just the theme and mu-plugin; `o-nia-o-niego` has no
  README at all; `keep-wallet` README still points to the old
  `profesjonalnyprogramista.pl` domain.
  Direction: `rozgadana-jana` → repo containing only `wp-content/themes/<theme>` and
  `wp-content/mu-plugins/<plugin>` with a README; add a README to `o-nia-o-niego` or
  archive it; fix the demo URL in `keep-wallet` or archive it in favour of
  `wallet-master`.
- [ ] **E9. The AI-workflow evidence exists but is invisible.** `wallet-master` and
  `menu-maker` carry `.ai/`, `.cursor/`, `AGENTS.md` (Laravel Boost guidelines), docs
  folders, PHPStan baselines and Playwright/Pest suites. This is exactly the material
  for finding A3 ("How I work with AI") and nothing on the site or profile points to it.
  Direction: in the case study for wallet-master, link the `AGENTS.md`, the `.ai/`
  rules and the CI config as proof of an agent-assisted but test-gated workflow.

- [ ] **E10. household-treasurer cannot be published as-is.** Secret scan of full
  history (2026-11-08) found no keys, tokens or committed `.env` files in
  household-treasurer, root-keeper, kostecki-dev-infa or kostecki-dev-landing. But
  `tests/Fixtures/mbank-basic.csv` and `tests/Fixtures/bnp-paribas-basic.xlsx` are only
  partly anonymised: names are replaced, yet they keep a real-looking mBank IBAN, a Play
  (P4) customer ID with invoice number, a kindergarten name, Lublin merchants, a masked
  card number and real spending. Two versions of each are in history.
  Direction: replace fixtures with fully synthetic data, then either rewrite history
  (`git filter-repo --path tests/Fixtures/ --invert-paths` and re-add) or publish a fresh
  repo with squashed history. Screenshots in `context/` use seeded "Test User" data.
- [ ] **E13. Work profile is disconnected.** Commercial open source lives under the work
  account `skostecki` (contributor to `panelalpha/panelalpha-engine`), which has no bio
  and no link to the personal profile or the site. Neither the site nor the personal
  profile mentions the engine.
  Direction: add the engine to the site (proposal 2.7) and cross-link both profiles.
- [x] **E12. Publish clean repos.** *Done 2026-11-08: kostecki-dev-landing,
  kostecki-dev-infa and root-keeper are public after the history scan. root-keeper still
  needs a README (see E11). household-treasurer stays private until E10 is fixed.*
- [ ] **E11. Still to do by hand** (token lacks `user` scope; creating new public repos
  was blocked in auto mode): profile bio/website/company, LinkedIn social account,
  profile README repo (draft: `context/github-profile-README.md`), pinning, "Include
  private contributions", root-keeper README (draft: `context/root-keeper-README-draft.md`).

## Suggested order of work

1. GitHub hygiene, one evening, no code: E2 bio + website, E3 profile README + pins,
   E4 descriptions/topics, E5 hide test repos, E6 private contributions toggle.
2. E1 swap the featured personal project to `wallet-master` in `src/content/*.json`.
3. A1 case studies (biggest lever; content only), using E9 material for the AI angle.
4. A3 "How I work with AI" section + A5 CV.
5. B1 prerender/SSG, then B2–B5 follow naturally.
6. C1, C2, D1, D2, D3 as a single "quick wins" pass.
7. A2 writing and E7 upstream contributions as ongoing habits; A4 photo when available.

## Notes for AI agents

- Content lives in `src/content/{pl,en}.json`; both locales must change together and
  `src/types/content.ts` must be updated for new fields.
- Keep the existing design tokens in `src/assets/main.css`; the audit does not call for
  a redesign.
- Do not add marketing filler to copy. Prefer concrete nouns, numbers, and links.
- When a finding above is resolved, tick it here and reference this file in the commit.
