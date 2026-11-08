# Proposal: GitHub-driven changes to kostecki.dev (2026-11-08) — DRAFT, awaiting approval

Companion to `site-audit-2026-11.md` (findings A–E). This file turns the GitHub review,
including private repositories, into a concrete change set. Nothing here is implemented yet.

## 1. Repository visibility decisions

| Repo | Today | Proposal | Why / prerequisites |
|---|---|---|---|
| `household-treasurer` (Domowy Skarbnik) | private | **make public, feature on site** | Strongest project: Laravel 13, PHP 8.5, PostgreSQL, Vue 3 + TS, Inertia 3, Pest; 713 commits, 41 PRs, 134 test files, CI green, CHANGELOG 1.3.1 (Keep a Changelog), glossary, 14 ADRs, PRD, roadmap, design system, `AGENTS.md` + `.ai/rules`. Live at treasurer.kostecki.dev. Prereqs: run `gitleaks detect` on full history; add LICENSE (MIT); add a short English summary at the top of the Polish README; description + topics. `.mcp.json` and `.env.prod.example` checked: no secrets. |
| `root-keeper` (genealogy) | private | **make public, feature on site** | Second flagship with a different frontend: Laravel 13, Inertia 3, React 19, TypeScript 7, Tailwind 4, Pest 5, Larastan level 7, Vite+; 601 commits, 31 PRs, 98 test files, 4 CI workflows (lint, static-analysis, tests, e2e Playwright). Live at genealog.kostecki.dev. Prereqs: **write a README (none exists)**; gitleaks; confirm seeds/fixtures contain no real family data; LICENSE; description + topics. |
| `kostecki-dev-infa` | private | **make public** | Only evidence of DevOps skills: Traefik, Docker Compose, restic backups, systemd timers, deploy scripts with a tested bash lib, Cloudflare. Prereqs: gitleaks; scrub VPS IP, SSH user and hostnames from docs; rename to `kostecki-dev-infra` (typo). |
| `kostecki-dev-landing` | private | **make public** | Shows how the site itself was built with spec/plan docs in `docs/superpowers/`; low risk (`.spacefast/claim.token` is gitignored). Link it from the footer ("source"). |
| `kostecki-dev-vaultwarden` | private | optional public | 4 files; harmless but low value. Fine either way. |
| `client-area-next` | private | **keep private, never publish** | PanelAlpha client-area migration = employer IP (ModulesGarden). Also verify with the employer that keeping it on a personal account is allowed. May be *described* on the site as commercial work only with employer consent. |
| `my-gen-tree` | private | keep private | Family research notes with personal data. The *method* (agents with "never fabricate, every fact has a source" rules) is a blog-post topic. |
| `ogarniam-portfel` (2025) | private | archive | Superseded by wallet-master → household-treasurer; default Laravel README. |
| `listmonk-vercel` | private | delete | Unmodified copy of upstream listmonk, one commit. |
| `HomeBudgetApp`, `BudgetAppOnline` | private | archive | 2021–22 learning projects. |
| `keep-wallet`, `o-nia-o-niego`, `BudgetApp`, `PingPong` | public | archive (GitHub "Archive repository") | Learning-era projects; archived repos are visibly read-only and stop looking like current work. |
| `project-pixel-perch`, `test-static-page` | public | make private or delete | Test/scaffold repos (see audit E5). |
| `wallet-master` | public | keep public, not featured | Predecessor of Skarbnik; referenced inside the Skarbnik case study as "v1, what changed and why". |
| `menu-maker`, `rozgadana-jana`, `focus-bloker` | public | keep, add description/topics | `rozgadana-jana`: slim to theme + mu-plugin (audit E8). `focus-bloker`: add one-line English summary. |

## 2. Site content changes (`src/content/pl.json` + `en.json`)

### 2.1 Personal projects — new list and order

1. **Domowy Skarbnik** (featured personal project, new card variant with screenshot)
   Copy (PL): "Roczny budżet domowy: plan kontra wykonanie, płynność na kontach i lokatach,
   import wyciągów CSV/XLSX z mBanku i BNP Paribas. Kwoty w jednostkach minor units, 14 ADR,
   CHANGELOG, 130+ plików testów Pest, CI na GitHub Actions."
   Tags: Laravel 13, PHP 8.5, PostgreSQL, Vue 3, TypeScript, Inertia, Pest.
   Links: Live (treasurer.kostecki.dev), GitHub.
2. **Root Keeper**
   Copy (PL): "Drzewo genealogiczne, w którym każdy fakt ma źródło (akt, sygnaturę).
   Laravel 13 + Inertia 3 + React 19 + TypeScript; cztery pipeline'y CI: lint, analiza
   statyczna (Larastan 7), testy, e2e Playwright."
   Tags: Laravel, React 19, TypeScript, Inertia, Playwright, Larastan.
   Links: Live (genealog.kostecki.dev, login), GitHub.
3. **Menu Maker** — keep; copy unchanged; add "Pest + Playwright" to tags; keep WIP badge.
4. **Rozgadana Jana** — keep; GitHub link only after the repo is slimmed to theme + plugin.
5. **FocusBlocker** (new, small "tooling" card)
   Copy (PL): "Blokada rozpraszających stron w godzinach pracy na Windows: PowerShell,
   plik hosts, Harmonogram zadań i rozszerzenie Chrome/Edge z lokalnym serwerem statusu.
   Blokady nie da się wyłączyć, tylko przedłużyć."
   Tags: PowerShell, Windows, Browser extension.
   Links: GitHub.
6. **Remove**: Ogarniam Portfel (`keep-wallet`, 2022) and O Nią & O Niego (2023).
   Wallet Master is mentioned inside the Skarbnik case study instead of as a card.

### 2.2 New section "Jak pracuję z AI" (replaces about paragraph 3)

Home, between About and Projects, 4 short steps with one evidence link each:
- **Spec i słownik** — glossary + PRD + ADR w `context/foundation/` (household-treasurer).
- **Plan i agent** — `AGENTS.md`, `.ai/rules`, `CLAUDE.md`; Claude Code i Cursor.
- **Bramki jakości** — CI: lint, Larastan, Pest, Playwright e2e (root-keeper, 4 workflows).
- **Review i changelog** — 41 PR-ów, Keep a Changelog, `/impl-review` przed merge.
Closing line: "Agent pisze dużo kodu. Testy, ADR i review decydują, co z tego trafia na produkcję."
Requires new content type `aiWorkflow: { index, title, steps: {title, body, href}[] }`.

### 2.3 Skills — reflect what the repos actually prove

- Core: add **PostgreSQL** (Skarbnik, Root Keeper) next to MySQL; add **TypeScript**.
- New category **"Jakość i testy"**: Pest, PHPUnit, Larastan/PHPStan, Playwright, GitHub Actions.
- New category **"Infrastruktura własna"**: Traefik, Docker Compose, restic, systemd, Cloudflare,
  VPS (evidence: kostecki-dev-infa, vaultwarden, deploy scripts).
- "Frontend uzupełniający": add React, Inertia, shadcn-vue; keep Vuetify, Tailwind.
- "Narzędzia i workflow": Cursor → **Claude Code, Cursor, PhpStorm, Laravel Boost (MCP)**.

### 2.4 Commercial section (only with employer consent)

Add to PanelAlpha responsibilities: "Migracja client area z Vue 2 / Vuetify 2 do Vue 3 /
Vuetify 4 / TypeScript, widok po widoku, z bramkami parity i testami Playwright." No link,
no repo. Skip entirely if consent is not given.

### 2.5 Meta, footer, about

- Meta description (PL): "Backend Developer (Laravel). Produkcyjne aplikacje PHP: PanelAlpha,
  integracje hostingowe i WHMCS, własne produkty na Laravel 13 + PostgreSQL + Inertia."
- Footer: add "Źródło strony" link to the landing repo once public.
- About paragraph 2: mention "poza pracą rozwijam dwa produkty na produkcji
  (treasurer.kostecki.dev, genealog.kostecki.dev) z CI, ADR i changelogiem".

### 2.7 PanelAlpha Engine — open-source co-authorship (added 2026-11-08)

Public repo `panelalpha/panelalpha-engine` (Apache 2.0, ~36 stars, releases v2.1–v2.2,
"287 MCP tools"): self-hosting platform that an AI agent operates over MCP. Sebastian is
a contributor from the work profile `skostecki`; public commits (history is partly
squashed, so they under-count the work):
- git push redeploys the project automatically (webhook-driven auto deploy),
- project file manager: move, download, permission changes,
- PHP directives per domain managed by the engine,
- transfer and visitor statistics computed from existing logs; transfer counting fix.

Site changes:
- New card in the commercial section, right after PanelAlpha, reusing the featured-project
  component: eyebrow "Open source", title "PanelAlpha Engine", context
  "ModulesGarden / współautor / 2026", contribution list as above, tags PHP, Docker, MCP,
  AI agents, links: repo + "Moje commity" (`commits?author=skostecki`).
- Home preview subtitle mentions it; it is the only public, verifiable commercial code.
- It also strengthens the AI story: the product exists to be driven by AI agents.

GitHub: cross-link the two profiles (personal profile README → `skostecki`; set a bio on
`skostecki` pointing to `sebastian-kostecki` and kostecki.dev).

### 2.8 10xDevs course (added 2026-11-08)

Sebastian is taking the 10xDevs course (AI-assisted software development). Its conventions
are already visible in his repos: `context/foundation|changes|archive`, 10x-cli skills in
`CLAUDE.md`, research → plan → implementation review per change.

Site changes:
- "Jak pracuję z AI" section: one line that the workflow is being refined in 10xDevs,
  and that each change goes through research, plan and review (evidence: root-keeper
  `context/`).
- Skills → "Narzędzia i workflow": add Claude Code, Laravel Boost (MCP), 10xDevs workflow.
- Do not present the course as a credential; present the artefacts it produced.

### 2.6 Component / schema changes needed

- `Project` type: add `status: 'live' | 'wip' | 'archived'` (replaces `badge`), optional
  `featured: boolean`, keep `image` and **render it** in `ProjectCard.vue` (audit C2).
- New `AiWorkflowSection.vue` + type (2.2).
- Screenshots to produce: Skarbnik dashboard, Root Keeper tree, FocusBlocker block page
  (WebP ≤ 100 KB each) into `public/assets/projects/`.

## 3. GitHub profile changes (no code)

- Bio: "Backend Developer (Laravel) at ModulesGarden — PanelAlpha, hosting & WHMCS
  integrations. Side projects: Domowy Skarbnik, Root Keeper." Website: https://kostecki.dev.
  Company: ModulesGarden. Add LinkedIn as social account.
- Profile README `sebastian-kostecki/sebastian-kostecki`: 6 lines + 3 featured repos.
- Pin: household-treasurer, root-keeper, menu-maker, kostecki-dev-infra, focus-bloker,
  rozgadana-jana.
- Description + topics on every public repo; LICENSE files where MIT is claimed.
- Settings → "Include private contributions on my profile".

## 4. Open questions for Sebastian

1. Publish `household-treasurer`, `root-keeper`, `kostecki-dev-infa`, `kostecki-dev-landing`? (recommended: yes, after gitleaks)
2. Drop `keep-wallet` and `o-nia-o-niego` from the site, or keep in an "Archive" row?
3. Mention client-area migration under PanelAlpha? Needs employer consent first.
4. Polish-only READMEs in Skarbnik/Root Keeper: add an English summary, or keep Polish?
5. Order of work: GitHub hygiene (3) → publish repos (1) → content (2.1, 2.3, 2.5) → new
   AI-workflow section (2.2, 2.6) → screenshots.
