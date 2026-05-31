# Landing Page Content Redesign — Design Spec

**Date:** 2026-05-31  
**Status:** Approved (brainstorming)  
**Scope:** Content and structure of kostecki.dev landing page (`src/content/pl.json` + related UI)

## Goals

| Priority | Goal |
|---|---|
| Primary (B) | Portfolio for recruitment — backend Laravel roles |
| Secondary (C) | Personal business card — professional but not sales-driven |

**Target role:** Backend developer (PHP/Laravel), with frontend (Vue.js) as supplementary skill.

**Tone:** Partnership-oriented. No "actively looking for work" badge. CTA style: "Porozmawiajmy".

## Job Title Strategy

| Location | Title |
|---|---|
| Hero, meta title | **Backend Developer** · PHP · Laravel |
| Experience section | **PHP Developer** · ModulesGarden (official contract title) |

Rationale: hero attracts backend recruiters; experience section matches CV/contract without hiding backend focus in the description.

## Page Structure

```
Hero → O mnie → Doświadczenie → Umiejętności → Projekty własne → Kontakt
```

Navigation adds `{ "id": "experience", "label": "Doświadczenie" }` after "O mnie".

## Content — Section by Section

### Meta (`pl.json` + `index.html`)

| Field | Value |
|---|---|
| `meta.title` | `Sebastian Kostecki — Backend Developer (Laravel)` |
| `meta.description` | `Backend developer w ModulesGarden. Laravel w PanelAlpha — integracje hostingowe, provisioning WordPress, backupy, API. 4 lata komercyjnie.` |
| `meta.lang` | `pl` |

Wire `meta.title` and `meta.description` into the page at runtime (currently only `index.html` static tags exist — implementation should sync both).

### Hero

| Field | Value |
|---|---|
| `hero.name` | Sebastian Kostecki |
| `hero.tagline` | Backend Developer · PHP · Laravel |
| `hero.subtitle` *(new field)* | 4 lata w ModulesGarden · backend PanelAlpha — platforma do zarządzania WordPressami dla hosterów |
| `hero.ctaPrimary.label` | Porozmawiajmy |
| `hero.ctaPrimary.href` | `https://www.linkedin.com/in/kostecki-sebastian` |
| `hero.ctaSecondary.label` | Doświadczenie |
| `hero.ctaSecondary.href` | `#experience` |

### O mnie

**Title:** O mnie

**Paragraphs:**

1. Od 4 lat pracuję w ModulesGarden — firmie tworzącej oprogramowanie dla branży hostingowej. Zacząłem od customowych modułów WHMCS (PHP, JavaScript), a obecnie rozwijam backend PanelAlpha — self-hosted platformy, która hosterom umożliwia provisionowanie i zarządzanie instalacjami WordPress klientów.

2. Na co dzień dodaję nowe funkcje backendowe — m.in. integracje z serwerami (cPanel, Plesk, DirectAdmin, WP Cloud, TenWeb), DNS (PowerDNS, Cloudflare), serwerami mailowymi, Let's Encrypt, analityką (Google Analytics, AWStats), Extendify, import instancji, backupy (lokalne i zdalne, np. S3) oraz obsługę Git dla WordPressów. Gdy trzeba, wprowadzam też zmiany we frontendzie (Vue.js, Vuetify).

3. Poza pracą — czas z rodziną i rozwój w IT.

External links in copy (ModulesGarden, PanelAlpha) should be clickable where rendered.

### Doświadczenie *(new section)*

**Title:** Doświadczenie

**Entries:**

#### Entry 1 — PanelAlpha (primary)

| Field | Value |
|---|---|
| `company` | ModulesGarden |
| `companyUrl` | `https://modulesgarden.com` |
| `role` | PHP Developer |
| `period` | 4 lata |
| `project` | PanelAlpha |
| `projectUrl` | `https://panelalpha.com` |
| `summary` | Backend aplikacji Laravel — self-hosted platforma B2B do automatyzacji WordPress dla hosterów. Integracje billingowe (WHMCS), API, Dockerowy provisioning. |

**Highlights (bullet list):**

- Integracje z panelami hostingowymi: cPanel, Plesk, DirectAdmin, WP Cloud, TenWeb
- Integracje DNS: PowerDNS, Cloudflare
- Serwery mailowe
- Let's Encrypt — automatyzacja certyfikatów SSL
- Analityka: Google Analytics, AWStats
- Extendify — integracja onboardingu WordPress
- Import i zarządzanie instancjami WordPress
- Backupy lokalne i zdalne (S3)
- Obsługa Git dla WordPressów (obecny obszar pracy)
- Frontend (Vue.js, Vuetify) — gdy feature wymaga zmian po obu stronach

#### Entry 2 — WHMCS modules (secondary, shorter)

| Field | Value |
|---|---|
| `role` | PHP Developer |
| `period` | ~6 miesięcy |
| `project` | Moduły WHMCS |
| `summary` | Customowe moduły i integracje dla platformy billingowej hosterów (PHP, JavaScript, Smarty). |

Note: Entry 2 is a sub-period within the same ModulesGarden employment — present visually as nested or chronologically preceding PanelAlpha under the same company header.

### Umiejętności

**Title:** Umiejętności

| Group | Description | Items |
|---|---|---|
| Backend | Logika biznesowa, nowe feature'y, integracje z systemami zewnętrznymi | PHP, Laravel |
| Integracje | Serwery hostingowe, DNS, SSL, storage, analityka, billing | cPanel, Plesk, DirectAdmin, WP Cloud, TenWeb, PowerDNS, Cloudflare, Let's Encrypt, S3, Google Analytics, AWStats, Extendify, WHMCS |
| Bazy danych | Modele, migracje, zapytania w aplikacji produkcyjnej | MySQL |
| Infrastruktura | Konteneryzacja, provisioning WordPress | Docker |
| Frontend (uzupełnienie) | Zmiany UI w ramach feature'ów end-to-end | Vue.js, Vuetify, JavaScript |
| Narzędzia | — | Git |

**Removed from current content:**

- Symfony "w planach"
- Vue 2 / "poznaję Vue 3"
- PhpStorm as a standalone skill group
- Empty one-liner descriptions ("Pracuję na bazie danych MySQL")

Integrations group may use a compact tag/chip layout rather than individual icons for every integration (implementation detail — keep readable on mobile).

### Projekty własne

**Title:** Projekty własne *(was: "Moje Projekty")*

Positioned as supplementary side projects, not primary proof of competence.

#### Ogarniam Portfel

- **Subtitle:** Side project — aplikacja do zarządzania domowym budżetem.
- **Stack note (in subtitle or separate field):** Laravel, MySQL
- **Links:** unchanged (demo + GitHub)

#### O Nią & O Niego

- **Subtitle:** Side project — aplikacja mobilna (Ionic) dostępna w Google Play.
- **Links:** unchanged (Play Store + GitHub)

### Kontakt

| Field | Value |
|---|---|
| `contact.title` | Porozmawiajmy |
| `contact.subtitle` | Zainteresowany współpracą lub rozmową o backendzie? Napisz do mnie. |
| `contact.ctaHeadline` | Chcesz dowiedzieć się więcej o moim doświadczeniu? |
| `contact.ctaPrimary.label` | LinkedIn |
| `contact.ctaPrimary.href` | `https://www.linkedin.com/in/kostecki-sebastian` |
| `contact.ctaSecondary.label` | GitHub |
| `contact.ctaSecondary.href` | `https://github.com/sebastian-kostecki` |

**Contact methods order:** LinkedIn first, then email, then phone (optional — keep phone unless user removes later).

Existing contact data unchanged:

- Email: sebastian.kostecki@gmail.com
- Phone: +48 502 321 934
- LinkedIn: in/kostecki-sebastian

**Removed:** "Czekasz na idealnego developera?" headline.

### Stopka

| Field | Value |
|---|---|
| `footer.servicesTitle` | Specjalizacja |
| `footer.services` | `["Backend Laravel w aplikacjach produkcyjnych", "Integracje z systemami hostingowymi i infrastrukturalnymi"]` |
| `footer.mediaTitle` | Profile |
| `footer.social` | unchanged (LinkedIn, GitHub) |
| `footer.copyright` | Wszystkie prawa zastrzeżone |

## Data Model Changes

Extend `SiteContent` in `src/types/content.ts`:

```typescript
interface ExperienceEntry {
  company: string
  companyUrl?: string
  role: string
  period: string
  project?: string
  projectUrl?: string
  summary: string
  highlights?: string[]
}

interface SiteContent {
  // ...
  hero: {
    name: string
    tagline: string
    subtitle?: string  // NEW
    ctaPrimary: CtaLink
    ctaSecondary: CtaLink
  }
  experience: {         // NEW section
    title: string
    entries: ExperienceEntry[]
  }
  // ...
}
```

## UI Components (implementation reference)

| Component | Action |
|---|---|
| `HeroSection.vue` | Render `hero.subtitle` below tagline |
| `ExperienceSection.vue` | **New** — company header, role, period, highlights list |
| `SkillsSection.vue` | No structural change; content from JSON |
| `ProjectsSection.vue` | Title from JSON only |
| `ContactSection.vue` | No structural change; content from JSON |
| `SiteHeader.vue` / nav | Add "Doświadczenie" link |
| `App.vue` | Insert `<ExperienceSection />` after About, before Skills |
| `index.html` / meta sync | Align title and description with `pl.json` meta |

## Content Not in Scope

- English language version (`en.json`)
- Open Graph / Twitter Card meta tags
- Email address change to `@kostecki.dev`
- Removing phone number from contact
- New side projects beyond existing two

## Self-Review Checklist

- [x] No TBD / TODO placeholders
- [x] Architecture (content sections) matches feature descriptions
- [x] Scope fits a single implementation plan
- [x] Job title strategy explicit (Backend in hero, PHP Developer in experience)
- [x] All user-confirmed integrations included (TenWeb, Extendify, GA, AWStats, Let's Encrypt)
- [x] NDA-safe: public product/partner names only, no internal metrics or roadmap details
- [x] PanelAlpha described as self-hosted B2B platform (not SaaS)
