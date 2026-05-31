# Landing Page Content Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic portfolio copy with backend-focused recruitment content, add Experience section, update skills/contact/footer, and sync meta tags.

**Architecture:** All copy lives in `src/content/pl.json`. Extend `SiteContent` types, add `ExperienceSection.vue`, extend `SkillGroup` with a tag layout for the large Integrations group, wire meta from JSON in `App.vue`. No new dependencies.

**Tech Stack:** Vue 3, TypeScript, Vite, Tailwind CSS 4, Iconify, Lucide

**Spec reference:** `docs/superpowers/specs/2026-05-31-landing-content-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `src/types/content.ts` | Extended interfaces (`ExperienceEntry`, `hero.subtitle`, `SkillGroup.layout`) |
| `src/content/pl.json` | All page copy (single source of truth) |
| `src/components/sections/ExperienceSection.vue` | **New** — work history with highlights |
| `src/components/sections/HeroSection.vue` | Render `hero.subtitle` |
| `src/components/ui/SkillGroup.vue` | Support `layout: 'tags'` for integrations |
| `src/components/sections/ContactSection.vue` | Grid tweak for 2 contact cards |
| `src/App.vue` | Insert ExperienceSection, sync document meta |
| `index.html` | Fallback meta (match pl.json) |

---

### Task 1: Extend content types

**Files:**
- Modify: `src/types/content.ts`

- [ ] **Step 1: Add new interfaces and fields**

```typescript
export interface ExperienceEntry {
  company: string
  companyUrl?: string
  role: string
  period: string
  project?: string
  projectUrl?: string
  summary: string
  highlights?: string[]
}

export interface SkillGroup {
  description: string
  items: SkillItem[]
  layout?: 'icons' | 'tags'
}

export interface SiteContent {
  // ...
  hero: {
    name: string
    tagline: string
    subtitle?: string
    ctaPrimary: CtaLink
    ctaSecondary: CtaLink
  }
  experience: {
    title: string
    entries: ExperienceEntry[]
  }
  // ...
}
```

- [ ] **Step 2: Verify types compile**

Run: `pnpm type-check`
Expected: PASS (may fail until pl.json updated — that's OK for this step)

- [ ] **Step 3: Commit**

```bash
git add src/types/content.ts
git commit -m "feat: extend content types for experience section and hero subtitle"
```

---

### Task 2: Replace pl.json content

**Files:**
- Modify: `src/content/pl.json`

- [ ] **Step 1: Replace entire file with approved content**

```json
{
  "meta": {
    "title": "Sebastian Kostecki — Backend Developer (Laravel)",
    "description": "Backend developer w ModulesGarden. Laravel w PanelAlpha — integracje hostingowe, provisioning WordPress, backupy, API. 4 lata komercyjnie.",
    "lang": "pl"
  },
  "nav": [
    { "id": "about", "label": "O mnie" },
    { "id": "experience", "label": "Doświadczenie" },
    { "id": "skills", "label": "Umiejętności" },
    { "id": "projects", "label": "Projekty" },
    { "id": "contact", "label": "Kontakt" }
  ],
  "hero": {
    "name": "Sebastian Kostecki",
    "tagline": "Backend Developer · PHP · Laravel",
    "subtitle": "4 lata w ModulesGarden · backend PanelAlpha — platforma do zarządzania WordPressami dla hosterów",
    "ctaPrimary": {
      "label": "Porozmawiajmy",
      "href": "https://www.linkedin.com/in/kostecki-sebastian"
    },
    "ctaSecondary": {
      "label": "Doświadczenie",
      "href": "#experience"
    }
  },
  "about": {
    "title": "O mnie",
    "paragraphs": [
      "Od 4 lat pracuję w ModulesGarden — firmie tworzącej oprogramowanie dla branży hostingowej. Zacząłem od customowych modułów WHMCS (PHP, JavaScript), a obecnie rozwijam backend PanelAlpha — self-hosted platformy, która hosterom umożliwia provisionowanie i zarządzanie instalacjami WordPress klientów.",
      "Skupiam się na warstwie backendowej — nowe feature'y, integracje z infrastrukturą hostingową oraz logika zarządzania instancjami WordPress. Obecnie rozwijam m.in. obsługę Git dla WordPressów. Gdy feature tego wymaga, wprowadzam też zmiany we frontendzie (Vue.js, Vuetify). Konkretne integracje i obszary pracy opisuję w sekcji Doświadczenie.",
      "W codziennej pracy korzystam z narzędzi wspieranych AI — m.in. Cursor — przy implementacji, refaktoryzacji i analizie kodu.",
      "Poza pracą — czas z rodziną i rozwój w IT."
    ]
  },
  "experience": {
    "title": "Doświadczenie",
    "entries": [
      {
        "company": "ModulesGarden",
        "companyUrl": "https://modulesgarden.com",
        "role": "PHP Developer",
        "period": "4 lata",
        "project": "PanelAlpha",
        "projectUrl": "https://panelalpha.com",
        "summary": "Backend aplikacji Laravel — self-hosted platforma B2B do automatyzacji WordPress dla hosterów. Integracje billingowe (WHMCS), API, Dockerowy provisioning.",
        "highlights": [
          "Integracje z panelami hostingowymi: cPanel, Plesk, DirectAdmin, WP Cloud, TenWeb",
          "Integracje DNS: PowerDNS, Cloudflare, Bunny DNS",
          "Serwery mailowe",
          "Let's Encrypt — automatyzacja certyfikatów SSL",
          "Analityka: Google Analytics, AWStats",
          "Extendify — integracja onboardingu WordPress",
          "Import i zarządzanie instancjami WordPress",
          "Backupy lokalne i zdalne (S3, FTP, SFTP, FTPS)",
          "Obsługa Git dla WordPressów (obecny obszar pracy)",
          "Frontend (Vue.js, Vuetify) — gdy feature wymaga zmian po obu stronach"
        ]
      },
      {
        "company": "ModulesGarden",
        "companyUrl": "https://modulesgarden.com",
        "role": "PHP Developer",
        "period": "~6 miesięcy",
        "project": "Moduły WHMCS",
        "summary": "Customowe moduły i integracje dla platformy billingowej hosterów (PHP, JavaScript, Smarty)."
      }
    ]
  },
  "skills": {
    "title": "Umiejętności",
    "groups": [
      {
        "description": "Logika biznesowa, nowe feature'y, integracje z systemami zewnętrznymi.",
        "items": [
          { "name": "PHP", "icon": "simple-icons:php" },
          { "name": "Laravel", "icon": "simple-icons:laravel" }
        ]
      },
      {
        "description": "Serwery hostingowe, DNS, SSL, storage, analityka, billing.",
        "layout": "tags",
        "items": [
          { "name": "cPanel", "icon": "simple-icons:cpanel" },
          { "name": "Plesk", "icon": "simple-icons:plesk" },
          { "name": "DirectAdmin", "icon": "simple-icons:directadmin" },
          { "name": "WP Cloud", "icon": "simple-icons:wordpress" },
          { "name": "TenWeb", "icon": "simple-icons:wordpress" },
          { "name": "PowerDNS", "icon": "simple-icons:powerdns" },
          { "name": "Cloudflare", "icon": "simple-icons:cloudflare" },
          { "name": "Bunny DNS", "icon": "simple-icons:bunnydotnet" },
          { "name": "Let's Encrypt", "icon": "simple-icons:letsencrypt" },
          { "name": "S3", "icon": "simple-icons:amazons3" },
          { "name": "FTP", "icon": "simple-icons:filezilla" },
          { "name": "SFTP", "icon": "simple-icons:filezilla" },
          { "name": "FTPS", "icon": "simple-icons:filezilla" },
          { "name": "Google Analytics", "icon": "simple-icons:googleanalytics" },
          { "name": "AWStats", "icon": "simple-icons:google" },
          { "name": "Extendify", "icon": "simple-icons:wordpress" },
          { "name": "WHMCS", "icon": "simple-icons:whmcs" }
        ]
      },
      {
        "description": "Modele, migracje, zapytania w aplikacji produkcyjnej.",
        "items": [
          { "name": "MySQL", "icon": "simple-icons:mysql" }
        ]
      },
      {
        "description": "Konteneryzacja, provisioning WordPress.",
        "items": [
          { "name": "Docker", "icon": "simple-icons:docker" }
        ]
      },
      {
        "description": "Zmiany UI w ramach feature'ów end-to-end.",
        "items": [
          { "name": "Vue.js", "icon": "simple-icons:vuedotjs" },
          { "name": "Vuetify", "icon": "simple-icons:vuetify" },
          { "name": "JavaScript", "icon": "simple-icons:javascript" }
        ]
      },
      {
        "description": "Kontrola wersji, środowisko developerskie.",
        "items": [
          { "name": "Git", "icon": "simple-icons:git" }
        ]
      },
      {
        "description": "Narzędzia AI w codziennym procesie developmentu — implementacja, refaktoryzacja, analiza kodu.",
        "items": [
          { "name": "Cursor", "icon": "simple-icons:cursor" }
        ]
      }
    ]
  },
  "projects": {
    "title": "Projekty własne",
    "items": [
      {
        "title": "Ogarniam Portfel",
        "subtitle": "Side project — aplikacja do zarządzania domowym budżetem (Laravel, MySQL).",
        "image": "/assets/projects/keep-wallet.png",
        "links": [
          {
            "title": "Przejdź do strony",
            "url": "https://budget.sebastian-kostecki.profesjonalnyprogramista.pl/",
            "primary": true
          },
          {
            "title": "Przejdź do GitHub",
            "url": "https://github.com/sebastian-kostecki/keep-wallet"
          }
        ]
      },
      {
        "title": "O Nią & O Niego",
        "subtitle": "Side project — aplikacja mobilna (Ionic) dostępna w Google Play.",
        "image": "/assets/projects/o-nia-o-niego.jpg",
        "links": [
          {
            "title": "Przejdź do aplikacji",
            "url": "https://play.google.com/store/apps/details?id=kostecki.sebastian.oniaoniego",
            "primary": true
          },
          {
            "title": "Przejdź do GitHub",
            "url": "https://github.com/sebastian-kostecki/o-nia-o-niego"
          }
        ]
      }
    ]
  },
  "contact": {
    "title": "Porozmawiajmy",
    "subtitle": "Zainteresowany współpracą lub rozmową o backendzie? Napisz do mnie.",
    "methods": [
      {
        "type": "linkedin",
        "label": "LinkedIn",
        "value": "in/kostecki-sebastian",
        "href": "https://www.linkedin.com/in/kostecki-sebastian"
      },
      {
        "type": "email",
        "label": "E-mail",
        "value": "sebastian.kostecki@gmail.com",
        "href": "mailto:sebastian.kostecki@gmail.com"
      }
    ],
    "ctaHeadline": "Chcesz dowiedzieć się więcej o moim doświadczeniu?",
    "ctaPrimary": {
      "label": "LinkedIn",
      "href": "https://www.linkedin.com/in/kostecki-sebastian"
    },
    "ctaSecondary": {
      "label": "GitHub",
      "href": "https://github.com/sebastian-kostecki"
    }
  },
  "footer": {
    "servicesTitle": "Specjalizacja",
    "services": [
      "Backend Laravel w aplikacjach produkcyjnych",
      "Integracje z systemami hostingowymi i infrastrukturalnymi"
    ],
    "mediaTitle": "Profile",
    "social": [
      {
        "name": "LinkedIn",
        "url": "https://www.linkedin.com/in/kostecki-sebastian",
        "icon": "simple-icons:linkedin"
      },
      {
        "name": "GitHub",
        "url": "https://github.com/sebastian-kostecki",
        "icon": "simple-icons:github"
      }
    ],
    "copyright": "Wszystkie prawa zastrzeżone"
  }
}
```

Note: Integration icons use best-available Simple Icons matches; tags layout shows names primarily — icons are secondary.

- [ ] **Step 2: Run type-check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/content/pl.json
git commit -m "feat: update landing page content for backend recruitment focus"
```

---

### Task 3: Hero subtitle

**Files:**
- Modify: `src/components/sections/HeroSection.vue`

- [ ] **Step 1: Render subtitle below tagline**

Add after the tagline `<p>`:

```vue
<p v-if="hero.subtitle" class="mt-3 text-base text-muted sm:text-lg lg:max-w-2xl">
  {{ hero.subtitle }}
</p>
```

Adjust CTA wrapper `mt-8` — keep as is.

Update hero primary/secondary links: primary CTA now opens LinkedIn externally — add `target="_blank"` and `rel="noopener noreferrer"` when `href` starts with `http`.

- [ ] **Step 2: Verify visually**

Run: `pnpm dev`
Check: subtitle visible, LinkedIn CTA opens in new tab.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSection.vue
git commit -m "feat: show hero subtitle and external CTA links"
```

---

### Task 4: Experience section component

**Files:**
- Create: `src/components/sections/ExperienceSection.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create ExperienceSection.vue**

Follow `AboutSection.vue` patterns (`RevealOnScroll`, `SectionHeading`). Structure per entry:

- Company name as external link (if `companyUrl`)
- Role · period on one line
- Project name as link (if `projectUrl`)
- Summary paragraph
- `<ul>` of highlights (if present)

Group both entries under ModulesGarden visually — second entry (WHMCS) renders without duplicate company header if same company as previous entry (compare `company` field).

```vue
<script setup lang="ts">
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const { experience } = useContent()
</script>

<template>
  <section id="experience" class="py-16 lg:py-24" aria-labelledby="experience-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading id="experience-heading" :title="experience.title" />
      </RevealOnScroll>
      <div class="mt-10 space-y-10">
        <RevealOnScroll
          v-for="(entry, index) in experience.entries"
          :key="`${entry.project ?? entry.role}-${index}`"
        >
          <article class="surface-card p-6 lg:p-8">
            <!-- company header (skip if same as previous) -->
            <!-- role, period, project link, summary, highlights ul -->
          </article>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
```

Implement full template with proper typography classes matching `AboutSection` (`text-muted`, `text-base leading-relaxed`).

- [ ] **Step 2: Register in App.vue**

```vue
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
```

Insert after `<AboutSection />`, before `<SkillsSection />`.

- [ ] **Step 3: Verify**

Run: `pnpm dev`
Check: `#experience` in nav scrolls correctly; highlights list renders; company/project links work.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ExperienceSection.vue src/App.vue
git commit -m "feat: add experience section with work history and highlights"
```

---

### Task 5: SkillGroup tag layout for integrations

**Files:**
- Modify: `src/components/ui/SkillGroup.vue`

- [ ] **Step 1: Add conditional layout**

When `group.layout === 'tags'`, render items as compact chips (name only, no large icons):

```vue
<div v-if="group.layout === 'tags'" class="flex flex-wrap justify-center gap-2 lg:justify-start">
  <span
    v-for="item in group.items"
    :key="item.name"
    class="rounded-lg border border-border bg-white/5 px-3 py-1.5 text-xs font-medium text-muted"
  >
    {{ item.name }}
  </span>
</div>
<div v-else class="flex flex-wrap ...">
  <!-- existing icon grid -->
</div>
```

Keep description paragraph below both layouts.

- [ ] **Step 2: Verify**

Run: `pnpm dev`
Check: Integrations group shows readable tag chips on mobile; other groups unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SkillGroup.vue
git commit -m "feat: add tag layout for integration skills group"
```

---

### Task 6: Contact section grid + external CTAs

**Files:**
- Modify: `src/components/sections/ContactSection.vue`

- [ ] **Step 1: Adjust grid for 2 cards**

Change grid classes from `sm:grid-cols-2 lg:grid-cols-3` to `sm:grid-cols-2 lg:max-w-2xl lg:mx-auto` (centered 2-column layout).

- [ ] **Step 2: External link attrs on CTAs**

Add `target="_blank"` and `rel="noopener noreferrer"` on CTA links when href starts with `http`.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ContactSection.vue
git commit -m "fix: adjust contact layout for two methods and external CTAs"
```

---

### Task 7: Sync document meta from pl.json

**Files:**
- Modify: `src/App.vue`
- Modify: `index.html`

- [ ] **Step 1: Add meta sync in App.vue**

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useContent } from '@/composables/useContent'
// ... existing imports

const { meta } = useContent()

onMounted(() => {
  document.title = meta.title
  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.setAttribute('content', meta.description)
  }
})
</script>
```

- [ ] **Step 2: Update index.html fallback**

```html
<title>Sebastian Kostecki — Backend Developer (Laravel)</title>
<meta name="description" content="Backend developer w ModulesGarden. Laravel w PanelAlpha — integracje hostingowe, provisioning WordPress, backupy, API. 4 lata komercyjnie.">
```

- [ ] **Step 3: Commit**

```bash
git add src/App.vue index.html
git commit -m "feat: sync page meta title and description from content"
```

---

### Task 8: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Type-check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: PASS (fix any issues)

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: PASS, no errors

- [ ] **Step 4: Manual smoke test**

Run: `pnpm preview`
Checklist:
- [ ] Nav includes Doświadczenie, all anchor links work
- [ ] Hero subtitle + LinkedIn CTA
- [ ] About: 4 paragraphs, no wall of integrations
- [ ] Experience: Bunny DNS, FTP/SFTP/FTPS in highlights
- [ ] Skills: AI/Cursor group, integrations as tags
- [ ] Projects titled „Projekty własne"
- [ ] Contact: LinkedIn + email only, no phone
- [ ] Footer: Specjalizacja + Profile

- [ ] **Step 5: Commit any lint fixes**

```bash
git add -A
git commit -m "chore: lint fixes after content redesign"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Hero backend focus + subtitle | Task 2, 3 |
| O mnie rewritten (4 paragraphs) | Task 2 |
| Experience section with integrations | Task 2, 4 |
| Bunny DNS, FTP/SFTP/FTPS | Task 2 |
| Skills incl. AI/Cursor, tags for integrations | Task 2, 5 |
| Projects własne | Task 2 |
| Contact: no phone, new CTAs | Task 2, 6 |
| Footer Specjalizacja/Profile | Task 2 |
| Meta sync | Task 7 |
| Nav experience link | Task 2 |

## Out of Scope (per spec)

- English version, Open Graph tags, `@kostecki.dev` email
