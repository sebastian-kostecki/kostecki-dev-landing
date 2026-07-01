# Hero Copy Refinement — Design Spec

Date: 2026-07-01

## Goal

Refine the hero section and related first-impression copy on `kostecki.dev` so it accurately describes Sebastian Kostecki while optimizing for **general backend recruiters** (Laravel/PHP) who may not know the hosting industry. The niche (hosting, WordPress, infrastructure integrations) remains visible but secondary.

## Decisions (from brainstorming)

| Topic | Decision |
|-------|----------|
| Primary audience | General backend recruiters (not hosting-industry specialists) |
| Hero hook | PHP backend in production — business applications first (Laravel stays in label/title, not value prop) |
| Niche placement | Light mention in subtitle (`m.in. …`) + metrics bar (PanelAlpha stays) |
| Role title | **Backend Developer** consistently (label + subtitle) |
| Approach | Option 1 — Laravel-first |
| Metrics bar | Unchanged: 4 years commercial · 15+ infra integrations · PanelAlpha B2B product |

## Scope

### In scope

- `hero.label`, `hero.valueProp`, `hero.subtitle` in `src/content/pl.json` and `src/content/en.json`
- `meta.description` in both locale JSON files (align with new hero messaging)
- `index.html` default meta description and OG/Twitter descriptions (Polish defaults; keep in sync with `pl.json` meta)

### Out of scope

- About, Experience, Skills, Projects, Contact sections (hosting niche stays there)
- Visual/layout changes to `HeroSection.vue`
- Metrics bar values or labels (except no change needed — PanelAlpha retained by user choice)
- OG image script text (`scripts/generate-og-image.mjs`) — optional follow-up

## Approved Copy

### Polish (`pl.json`)

| Field | New value |
|-------|-----------|
| `hero.label` | `// BACKEND DEVELOPER · LARAVEL` |
| `hero.valueProp` | `Buduję i rozwijam produkcyjne aplikacje backendowe w PHP.` |
| `hero.subtitle` | `Backend Developer z 4-letnim komercyjnym doświadczeniem — m.in. integracje API, infrastruktura i automatyzacja WordPress w B2B SaaS.` |
| `meta.description` | `Backend Developer (Laravel). Buduję i rozwijam produkcyjne aplikacje backendowe w PHP — m.in. integracje API, infrastruktura i automatyzacja WordPress. 4 lata komercyjnie.` |

`meta.title` stays: `Sebastian Kostecki — Backend Developer (Laravel)`

### English (`en.json`)

| Field | New value |
|-------|-----------|
| `hero.label` | `// BACKEND DEVELOPER · LARAVEL` |
| `hero.valueProp` | `I build and maintain production PHP backends.` |
| `hero.subtitle` | `Backend Developer with 4 years of commercial experience — including API integrations, infrastructure, and WordPress automation in B2B SaaS.` |
| `meta.description` | `Backend Developer (Laravel). I build and maintain production PHP backends — including API integrations, infrastructure, and WordPress automation. 4 years commercial experience.` |

`meta.title` stays: `Sebastian Kostecki — Backend Developer (Laravel)`

### HTML defaults (`index.html`)

Update the static `meta description`, `og:description`, and `twitter:description` to match the new Polish `meta.description` above.

## Rationale

**Before:** Hero led with "production hosting platforms" — accurate for PanelAlpha work but opaque to general recruiters; label said ENGINEER while subtitle said Developer.

**After:** First sentence positions Sebastian as a production PHP backend developer (broader than Laravel-only). Laravel remains in the label and page title for SEO and recruiter filtering. Subtitle uses `m.in.` / `including` to signal breadth without leading with hosting jargon. PanelAlpha in the metrics bar provides concrete product proof for recruiters who scroll slightly deeper.

## Success Criteria

- A general Laravel recruiter understands the core positioning within ~5 seconds of reading the hero.
- Copy remains factually accurate (PanelAlpha, integrations, WordPress automation).
- PL and EN hero + meta descriptions are aligned in messaging (not literal word-for-word translation).
- No inconsistency between ENGINEER and Developer in the hero block.

## Implementation Notes

- Single-file content changes in `pl.json`, `en.json`, and `index.html`.
- No component or dependency changes required.
- Verify hero renders correctly in both locales via language switcher.
