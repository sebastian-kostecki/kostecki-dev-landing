# Pixel-perch redesign — Design Spec

Date: 2026-08-12

## Goal

Redesign `kostecki.dev` to match the visual language and multi-page information architecture of [project-pixel-perch](https://github.com/sebastian-kostecki/project-pixel-perch), while keeping the existing Crimson palette, PL/EN bilingual content system, and real portfolio data. Add contact via `mailto:kontakt@kostecki.dev` (no form). Keep CV download in the header and on the contact page.

## Decisions (from brainstorming)

- **IA**: Multi-page like pixel-perch — `/`, `/projects`, `/skills`, `/contact`. About and Experience live on Home only.
- **Contact**: Mailto only — display and link `kontakt@kostecki.dev` (replace gmail). No contact form / backend mail.
- **CV**: Keep download button in header and on `/contact` (locale-aware; hide if file missing).
- **Brand chrome**: Pixel-perch style mark `</>` + `kostecki.dev` (not the existing BrandMark wordmark treatment).
- **Approach**: Faithful visual port of pixel-perch layouts/components into Vue, with indigo tokens swapped to Crimson.
- **Stack**: Stay on Vue 3 + Vue Router + Tailwind v4 + JSON-driven i18n. No React/TanStack migration.

## Scope

In scope:

- Multi-route Vue SPA matching pixel-perch page structure.
- Full visual restyle: typography, utilities (`gradient-hero`, `grid-lines`, `panel`, `panel-hover`, `text-gradient`, `rule-accent`), numbered section headings, hero “At a glance” panel, sticky indexed nav.
- Port/adapt pixel-perch components to Vue.
- Wire existing `pl.json` / `en.json` data; extend only for multi-page UI strings and per-route meta.
- Contact email → `kontakt@kostecki.dev`; include GitHub alongside LinkedIn and email on `/contact`.
- Header: `</>` + `kostecki.dev`, PL/EN switcher, CV button, mobile menu.

Out of scope:

- Contact form or transactional email API.
- Changing brand colors or rewriting substantive copy (beyond UI strings and the email address).
- Migrating to React / Lovable / TanStack Start.
- Separate localized URLs + `hreflang` (client-side locale switch remains).
- Infra/deploy changes beyond ensuring SPA fallback for new client routes (already expected for Vue SPA).

## Visual system — Crimson × pixel-perch

### Palette (kept from kostecki.dev, mapped to pixel-perch token roles)

| Role | Value |
|------|--------|
| Background | `#0c0c0e` |
| Surface / card | `#141416` (and hover `#1a1a1e`) |
| Border | `rgb(255 255 255 / 0.1)` |
| Primary / accent | `#e63946` |
| Primary hover / glow | `#ff4d5a` |
| Gradient glow stop | `#ff6b75` |
| Muted text | `#a1a1aa` |
| Foreground | `#ffffff` |

Implement pixel-perch-style CSS utilities with crimson substituted for indigo: `gradient-hero`, `grid-lines`, `panel`, `panel-hover` (including crimson `shadow-glow`), `text-gradient`, `rule-accent`.

### Typography (from pixel-perch)

- **JetBrains Mono** — headings, brand, nav, CTAs, tags, indexes.
- **Work Sans** — body copy.
- Remove Outfit and Plus Jakarta Sans.

### Layout signatures

- Low radius base (`~0.25rem`), `rounded-sm` buttons — not large rounded-2xl pills.
- Sticky header with backdrop blur; nav items with mono indexes (`01`…`04`) and underline accent.
- Hero: ambient gradient + masked blueprint grid; 7/5 grid (copy | “At a glance” panel).
- Sections separated by hairline borders; numbered headings (`01 / About`) instead of terminal `$ command` labels.
- Cards use `panel` + hover lift/glow.

### Accessibility

- AA contrast for text on dark surfaces.
- `focus-visible` rings on interactive controls.
- Honor `prefers-reduced-motion` (existing pattern).
- Keyboard-accessible mobile menu and language switcher.
- Semantic landmarks; skip link retained.

## Information architecture

| Route | Content |
|-------|---------|
| `/` | Hero → About → Experience → featured Projects → core Stack → Contact CTA |
| `/projects` | Full projects list from content JSON |
| `/skills` | Full skills (core + categories from existing data) |
| `/contact` | Social links (LinkedIn, GitHub, email mailto) + CV |

Shared chrome on all routes: sticky Header + Footer.

Nav labels (localized): Home, Projects, Skills, Contact — with indexes matching pixel-perch.

## Pages

### Home

1. **Hero** — mono label from `hero.label`; **name** from `hero.name` as the primary hero-level brand signal (required so the first viewport still reads as kostecki.dev without relying only on the nav); value proposition from `hero.valueProp` with a crimson `text-gradient` fragment (split via an optional `valuePropAccent` string in JSON, or the trailing clause of `valueProp` if no split field); subtitle; primary CTA → `/contact`; secondary → `/projects`; “At a glance” panel from `hero.metrics` + core tech tags.
2. **About** — `01 / About` + `about.paragraphs`.
3. **Experience** — `02 / Experience` + cards from `experience.entries` (company, role, period, summary, highlights; logos optional if they fit the card layout without fighting the panel style).
4. **Projects (featured)** — `03 / Projects`; up to 3 projects + “See all” → `/projects`.
5. **Core stack** — `04 / Stack`; abbreviated core skills + link → `/skills`.
6. **Contact CTA** — centered block with gradient backdrop; CTA → `/contact`.

### Projects

Full grid of `ProjectCard` (index, title, description, tags, WIP badge, demo/repo links) driven by existing project data.

### Skills

Core stack + remaining categories from existing skills JSON (hosting panels, DNS, storage, etc.). Prefer SkillBadge-style presentation over the old collapsible Crimson Engineer grouping, while preserving all skill entries.

### Contact

Section heading + `SocialLink` rows for LinkedIn, GitHub, and E-mail (`kontakt@kostecki.dev`). CV button when `cv.href` is non-empty.

## Components

New or rewritten Vue components aligned to pixel-perch:

- `Header` (mark `</>`, brand text, indexed nav, locale switcher, CV, mobile menu)
- `Footer`
- `SectionHeading` (index + title + optional subtitle; centered variant)
- `ExperienceCard`
- `ProjectCard`
- `SkillBadge`
- `SocialLink`
- `LanguageSwitcher` (reuse/adapt)
- `AtAGlancePanel` (hero stats + tech tags; may live as its own SFC or be inlined in the Home hero — same markup either way)

Retire unused Crimson Engineer-specific UI (terminal command headings as primary pattern, old card utilities) once replaced. Do not leave dead components if nothing imports them.

## Data & i18n

- Keep `useContent` / `useLocale` / `pl.json` / `en.json`.
- Extend content for: multi-page nav labels + indexes; “At a glance” label; “See all projects” / “Explore all skills”; per-route `meta` (title, description) for `/`, `/projects`, `/skills`, `/contact`.
- Update contact email method to `kontakt@kostecki.dev` / `mailto:kontakt@kostecki.dev`.
- Add GitHub to contact methods (value/href from existing footer social).
- Remove unused `command` fields from types/UI (YAGNI); content copy itself stays.
- Persist locale in `localStorage`; update `document.documentElement.lang` and document title/meta on locale and route change.

## Technical notes

- Vue Router routes: `/`, `/projects`, `/skills`, `/contact`.
- Fonts loaded in `index.html` (JetBrains Mono + Work Sans).
- Utilities live in `src/assets/main.css` under Tailwind v4 `@theme` / `@utility` (or equivalent project patterns).
- Icons: Lucide for chrome/social and any hard-coded skill accents; keep Iconify for skills whose JSON already stores `mdi:` icon ids.
- No new runtime dependencies for mail.
- SPA history fallback remains an infra concern; no app-side server required.

## Error handling & empty states

- Missing CV file / empty `cv.href`: hide CV button (no broken link).
- Missing optional project demo URL: show only available links.
- Unknown route: simple 404 page in site chrome (mono heading + link home), bilingual.

## Testing / verification

- Manual: each route in PL and EN; mailto opens; CV visible/hidden correctly; mobile nav; focus order; reduced motion.
- `pnpm type-check`, `pnpm lint`, `pnpm build`.

## Success criteria

- First viewport and inner pages read as pixel-perch composition, with Crimson branding instead of indigo; hero includes `Sebastian Kostecki` as a brand-level signal plus the value proposition.
- Brand signal in header is `</>` + `kostecki.dev`.
- All existing substantive data remains available across Home + detail routes.
- Contact email is `kontakt@kostecki.dev` via mailto.
- PL/EN switcher works on every route; CV download remains available when files exist.
