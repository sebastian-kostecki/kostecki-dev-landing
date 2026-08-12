# About Section Copy — Design Spec

Date: 2026-07-01

## Goal

Rewrite the **About me** section (`about.paragraphs` in PL/EN content JSON) so it complements the refined hero copy. The section should communicate who Sebastian is as a developer and why he is worth talking to (B), with a lightly personal closing paragraph (C) — without duplicating the Experience or Skills sections.

## Decisions (from brainstorming)

| Topic | Decision |
|-------|----------|
| Primary purpose | B + C — differentiators + human side, with brief professional context |
| Audience | General backend recruiters (aligned with `2026-07-01-hero-copy-design.md`) |
| Structure | 3 paragraphs: context → differentiators → personal |
| Paragraph 2 focus | D — self-sufficiency end-to-end (backend + Vue when needed) + production responsibility |
| Paragraph 3 tone | B — lightly personal: AI tools, growth in IT, family, outdoor rest |
| Copy style | Narrative flow (option 1) — natural prose, ~80–100 words total per locale |
| Integrations detail | Out of scope for About — lives in Experience and Skills |

## Scope

### In scope

- `about.paragraphs` (3 strings) in `src/content/pl.json`
- `about.paragraphs` (3 strings) in `src/content/en.json`

### Out of scope

- `about.command`, `about.title` (unchanged)
- `AboutSection.vue` component or layout
- Experience, Skills, Hero, meta tags
- OG image script

## Approved Copy

### Polish (`pl.json` → `about.paragraphs`)

1. `Od 4 lat buduję backend w PHP — głównie Laravel — w produkcyjnym produkcie B2B. Pracuję w ModulesGarden nad platformą PanelAlpha, która firmom usługowym umożliwia automatyzację zarządzania WordPress.`

2. `Lubię przejąć feature i dowieźć go od warstwy backendowej po działającą logikę — a gdy potrzeba, wchodzę we frontend (Vue.js). Pracuję na żywym produkcie, więc liczy się dla mnie kod, który faktycznie działa u klientów.`

3. `Na co dzień korzystam z narzędzi AI (m.in. Cursor) jako wsparcia przy implementacji i refaktoryzacji. Poza kodem — rodzina, wypoczynek na świeżym powietrzu i ciągły rozwój w IT.`

### English (`en.json` → `about.paragraphs`)

Natural technical English — not a literal translation of PL.

1. `For 4 years I've been building PHP backends — mostly Laravel — on a production B2B product. At ModulesGarden I work on PanelAlpha, a platform that helps service companies automate WordPress management.`

2. `I like owning a feature from the backend layer through to working business logic — and when needed, I pick up the frontend (Vue.js). I work on a live product, so I care about code that actually works for customers.`

3. `Day to day I use AI tools (including Cursor) to support implementation and refactoring. Outside of code — family, time outdoors, and keeping up with the industry.`

## Rationale

**Before:** About opened with hosting-industry jargon (hosters, provisioning) and repeated PanelAlpha/integration details already covered in Experience. Paragraph 3 mixed AI and family without the outdoor-rest detail the user wanted.

**After:** Paragraph 1 gives minimal company/product context in recruiter-friendly language. Paragraph 2 leads with ownership and production quality (not integrations). Paragraph 3 adds a human note — family and fresh-air rest — while staying professional.

## Consistency with Hero

| Hero (post-refinement) | About |
|------------------------|-------|
| PHP backends in value prop | PHP/Laravel named in paragraph 1 |
| Niche in subtitle (`m.in.`) | WordPress/B2B explained in one sentence |
| PanelAlpha in metrics bar | PanelAlpha named once for context |

## Success Criteria

- Recruiter understands who Sebastian is and how he works after reading About alone (with hero as prior context).
- No significant overlap with Experience bullet lists (panels, WHMCS, Docker, etc.).
- PL and EN convey the same messaging; EN reads as natural technical prose.
- Third paragraph includes family and outdoor rest without feeling informal or off-brand.

## Implementation Notes

- Content-only change in two JSON files.
- Verify JSON validity after edit (`node -e "JSON.parse(...)"`).
- Manual check: both locales on `pnpm dev`, scroll to About section.
