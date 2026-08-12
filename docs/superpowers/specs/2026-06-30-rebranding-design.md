# Rebranding kostecki.dev — Design Spec

Date: 2026-06-30

## Goal

Redesign the developer landing page (`kostecki.dev`) so it works as a business card aimed at recruiters and potential employers. The page must be readable, easy to understand, and attractive, with the primary objective of attracting a new employer and clearly communicating who Sebastian Kostecki is as a developer. Full freedom over code, design, and content was granted to serve that goal.

## Decisions (from brainstorming)

- **Audience & language**: Bilingual PL/EN with a language switcher. Positioning stays focused: **Backend Developer (Laravel)**.
- **Tone**: Bold and technical — engineering vibe, monospace/terminal accents.
- **Visual direction**: "Crimson Engineer" — keep the existing dark base and red accent, add a blueprint grid, monospace labels, and a strong sans for the name.
- **Recruiter-oriented elements**: CV (PDF) download, key metrics bar, prominently exposed GitHub.
- **Skills presentation**: Tiered — core stack on top, hosting/infra integrations grouped into collapsible categories.
- **Structure approach**: "Scan-first dossier" optimized for a 30-second recruiter scan, with terminal accents living in the details (not as a barrier).

## Scope

In scope:
- Full visual redesign of all sections within the existing Vue 3 + Tailwind v4 stack.
- Bilingual content (PL + new EN) driven by JSON.
- New components: language switcher, sticky header with CTA, metrics bar, collapsible skill categories, experience timeline.
- Content rewrite (PL tightened, full natural EN).

Out of scope (possible later steps):
- Separate localized URLs + `hreflang` (client-side switch only for now).
- Live GitHub stats via API (static, exposed link/card for now).
- The actual CV PDF files (provided by the user; we wire up links and handle a missing file gracefully).

## Visual System — "Crimson Engineer"

- **Palette** (unchanged from current brand for consistency with logo/favicon/OG):
  - `--color-bg: #0c0c0e`, `--color-surface: #141416`, `--color-surface-hover: #1a1a1e`
  - `--color-border: rgb(255 255 255 / 0.1)`
  - `--color-accent: #e63946`, `--color-accent-hover: #ff4d5a`
  - `--color-muted: #a1a1aa`, text `#ffffff`
- **Typography**:
  - `Outfit` — headings / name (display).
  - `Plus Jakarta Sans` — body copy.
  - **New: `JetBrains Mono`** — labels, "commands", numbers/metrics, technology tags. Used sparingly; never for paragraph copy (recruiter readability).
- **Signature treatments**:
  - Blueprint grid background accent in hero (subtle).
  - Section headings rendered optionally as terminal commands (e.g. `$ cat about.md`).
  - Technology tags as mono chips; metric cards; experience cards with a left accent border.
- **Accessibility**: AA contrast, `focus-visible` (existing), `prefers-reduced-motion` (existing), keyboard navigation for collapsible sections and the language switcher, semantic HTML.

## Information Architecture (top → bottom)

1. **Sticky header** — brand mark + section nav + **PL/EN switcher** + **CV ↓** button.
2. **Hero** — mono label (`// BACKEND ENGINEER · LARAVEL`), name in strong sans, one-line value proposition + subtitle, two CTAs (primary "Let's talk", secondary "Download CV"), and a **metrics bar** (e.g. *4 years commercial*, *15+ infra integrations*, *PanelAlpha — B2B product*).
3. **About** (`$ cat about.md`) — 2–3 tight paragraphs emphasizing the unique strength: deep backend specialization + hosting integrations.
4. **Experience** (`$ git log --experience`) — timeline: PanelAlpha (grouped/collapsible highlights so the long list does not overwhelm) + ModulesGarden (concise).
5. **Skills** (`$ ls skills/`) — tiered: core stack on top (PHP, Laravel, MySQL, Docker); integrations grouped into collapsible categories: Hosting panels, DNS, Storage/backup, Email/SSL, Analytics/billing, Frontend, Tools/AI.
6. **Projects** (`$ ls projects/`) — restyled cards, existing live/GitHub links preserved.
7. **Contact** (`$ ./contact.sh`) — clear CTAs (LinkedIn, e-mail), exposed GitHub, CV buttons.
8. **Footer** — restyled, existing content.

## Bilingual (i18n) Approach

- `en.json` alongside `pl.json` with identical structure (including `meta`, experience highlights, project descriptions).
- Extend `useContent` composable with reactive `locale` state; **PL/EN switcher** in the header.
- Persist choice in `localStorage`; initial choice from browser language (fallback PL).
- On language change update `<html lang>`, `document.title`, and `meta description` for the active locale.
- No library (no `vue-i18n`); JSON-driven, consistent with the existing pattern.
- EN content written as natural technical English, not a literal translation.

## Technical Implementation

- Stack unchanged: Vue 3 + Tailwind v4. **No new runtime dependencies** (mono font added like existing fonts).
- Reuse and restyle existing components: `SectionHeading` (add optional `command` prop), `ProjectCard`, `SkillGroup`, `RevealOnScroll`, `BrandMark`.
- New components: language switcher, sticky header with CTA, metrics bar, collapsible skill categories, experience timeline.
- **CV (PDF)**: button in header + contact section. Two versions — separate PL and EN PDF; the button follows the active language. Files live in `public/cv/` and are provided by the user; handle a missing file gracefully (no broken UI).
- **GitHub**: static, prominently exposed link/profile card (no live API).
- **Metrics**: static values stored in content JSON, maintained manually.
- **Animations**: subtle scroll reveal (existing `useScrollReveal`) + light terminal/cursor accents; nothing excessive.
- Remove/replace outdated sections and copy per the decisions above.

## Content Rewrite Plan

- **Hero value proposition**: one strong positioning sentence + subtitle (PL/EN variants refined during implementation), e.g. "Backend Developer (Laravel) — I build and integrate production hosting platforms."
- **Metrics bar**: 3 quick-scan numbers (e.g. 4 years commercial, 15+ infra integrations, PanelAlpha B2B product). Values confirmed/maintained by the user.
- **About**: tightened to 2–3 concise paragraphs, stronger emphasis on the unique strength.
- **Experience**: timeline; PanelAlpha highlights grouped/collapsible; ModulesGarden concise.
- **Skills**: tiered as above.
- **Projects**: no content changes, new card styling, links preserved.
- **Contact**: clear CTAs, exposed GitHub, CV buttons.
- **Full EN version**: natural technical English.

## Success Criteria

- A recruiter can grasp who Sebastian is and his core value within ~30 seconds (hero + metrics + section scan).
- Page is bilingual with a working, persistent PL/EN switch and correct `<html lang>`/meta updates.
- Visual identity reads as bold/technical ("Crimson Engineer") while remaining clean and readable.
- CV download and GitHub are easy to find. CV links degrade gracefully if files are absent.
- No new runtime dependencies; existing accessibility safeguards preserved or improved.

## Dependencies / Open Items

- User to provide CV PDFs (PL + EN) for `public/cv/`.
- User to confirm/maintain the exact metric values.
