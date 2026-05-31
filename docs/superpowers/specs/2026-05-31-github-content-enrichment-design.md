# GitHub Content Enrichment — Design Spec

**Date:** 2026-05-31  
**Status:** Approved  
**Scope:** Enrich landing page content (`src/content/pl.json`) based on audit of public GitHub repositories at `github.com/sebastian-kostecki`

## Goals

| Priority | Goal |
|---|---|
| Primary | Strengthen recruitment portfolio for backend Laravel roles using real side-project evidence from GitHub |
| Secondary | Keep page curated — not a mirror of all public repos |

**Target role:** Backend developer (PHP/Laravel), with frontend (Vue.js) as supplementary skill.

**Tone:** Unchanged from existing landing spec — partnership-oriented, no "actively looking" badge.

## Decisions (Brainstorming Outcomes)

| Question | Decision |
|---|---|
| Scope of update | Projects + Skills (not About) |
| WIP projects | Include only if repo has meaningful README and real code |
| Menu Maker image | Placeholder now; asset slot documented for future screenshot |
| Skills expansion | Moderate — Ionic, Inertia.js, Pest, Redis |
| About section | **No changes** |
| Implementation approach | Content-only update to `pl.json` (Approach B) — no GitHub API integration, no component changes |

## GitHub Audit Summary

10 public repositories reviewed (sorted by last push):

| Repository | Language | Last push | Portfolio decision |
|---|---|---|---|
| kostecki-dev-landing | Vue | 2026-05-31 | Exclude — this site |
| kostecki-dev-infa | Shell | 2026-05-31 | Exclude — deploy infra |
| home-help-center | Blade/PHP | 2026-02-04 | Exclude — empty Laravel skeleton (User + default migrations only) |
| work-helper | — | 2025-11-16 | Exclude — empty repo |
| menu-maker | Vue/PHP | 2025-08-19 | **Include** — real MVP codebase + detailed README |
| my-api | PHP | 2025-08-19 | Exclude — substantial code but default Laravel README only |
| o-nia-o-niego | JavaScript | 2023-04-18 | Already on site |
| keep-wallet | HTML | 2023-01-10 | Already on site |
| BudgetApp | C++ | 2022-05-13 | Exclude — not aligned with Laravel/backend narrative |
| PingPong | C++ | 2022-05-12 | Exclude — not aligned with Laravel/backend narrative |

## Out of Scope

- Changes to Hero, About, Experience, Contact, Footer, meta tags
- Vue/component or layout changes
- GitHub API sync script or build-time automation
- Adding Playwright, Larastan, or other tooling-only entries to Skills
- Live demo URL for Menu Maker (MVP in development, no deployment)

## Content Changes

### Projects (`projects.items`)

**Existing entries:** unchanged (Ogarniam Portfel, O Nią & O Niego).

**New entry — Menu Maker:**

| Field | Value |
|---|---|
| `title` | `Menu Maker` |
| `subtitle` | `Side project (WIP) — planowanie tygodniowych posiłków z AI, skalowaniem składników i eksportem PDF (Laravel, Vue, Inertia).` |
| `image` | `null` (renders gradient placeholder via `ProjectCard`) |
| `placeholderIndex` | `2` (third gradient variant — distinct from index 0 and 1) |
| `links` | Single link: `{ "title": "Przejdź do GitHub", "url": "https://github.com/sebastian-kostecki/menu-maker", "primary": true }` |

**Rationale:** Menu Maker demonstrates Laravel 12, Vue 3, Inertia, AI integration, Pest, Redis — directly supporting backend Laravel positioning. WIP status is explicit in subtitle; GitHub link is sufficient without live demo.

**Future asset slot:**

| Item | Value |
|---|---|
| File path | `public/assets/projects/menu-maker.png` |
| Recommended size | 640×360 (matches `ProjectCard` aspect-video) |
| JSON update when ready | Set `"image": "/assets/projects/menu-maker.png"`, remove `placeholderIndex` |

### Skills (`skills.groups`)

Add four items across existing groups — no new groups, no schema changes.

**Frontend group** (`description`: „Zmiany UI w ramach feature'ów end-to-end.”):

| Name | Icon |
|---|---|
| Ionic | `simple-icons:ionic` |
| Inertia.js | `simple-icons:inertia` |

**Backend group** (`description`: „Logika biznesowa, nowe feature'y, integracje z systemami zewnętrznymi.”):

| Name | Icon |
|---|---|
| Pest | `simple-icons:pest` |
| Redis | `simple-icons:redis` |

**Explicitly excluded from Skills:**

| Technology | Reason |
|---|---|
| Playwright | E2E tooling — too narrow for recruitment landing |
| Larastan | Static analysis tooling — same |
| TypeScript | Minor footprint in menu-maker; not part of stated positioning |
| Shadcn-vue | UI library detail — covered by Vue/Tailwind |

### About (`about`)

**No changes.** Side projects remain discoverable only via the Projects section.

## Implementation Notes

- **Single file change:** `src/content/pl.json`
- **Types:** No changes to `src/types/content.ts` — existing `Project` and `SkillItem` interfaces support all fields
- **Layout:** Existing `md:grid-cols-2` grid in `ProjectsSection.vue` handles three cards without modification (third card wraps to second row)
- **Icon availability:** Verify `simple-icons:ionic`, `simple-icons:inertia`, `simple-icons:pest`, `simple-icons:redis` render via Iconify at implementation time; fall back to tag layout or alternative icon if missing

## Success Criteria

1. Projects section shows three curated side projects with Menu Maker as WIP
2. Skills section reflects technologies demonstrably used in GitHub repos without bloating
3. About section text is identical to pre-change content
4. No new runtime dependencies or build steps
5. Page builds and lints cleanly after content update

## JSON Snippets (Reference)

### Menu Maker project entry

```json
{
  "title": "Menu Maker",
  "subtitle": "Side project (WIP) — planowanie tygodniowych posiłków z AI, skalowaniem składników i eksportem PDF (Laravel, Vue, Inertia).",
  "image": null,
  "placeholderIndex": 2,
  "links": [
    {
      "title": "Przejdź do GitHub",
      "url": "https://github.com/sebastian-kostecki/menu-maker",
      "primary": true
    }
  ]
}
```

### Skills additions (merge into existing groups)

Frontend group — append to `items`:

```json
{ "name": "Ionic", "icon": "simple-icons:ionic" },
{ "name": "Inertia.js", "icon": "simple-icons:inertia" }
```

Backend group — append to `items`:

```json
{ "name": "Pest", "icon": "simple-icons:pest" },
{ "name": "Redis", "icon": "simple-icons:redis" }
```
