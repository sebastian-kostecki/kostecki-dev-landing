# Rebranding kostecki.dev — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the developer landing page into a bilingual (PL/EN), scan-first "Crimson Engineer" dossier optimized to attract recruiters, with CV download, a metrics bar, exposed GitHub, and tiered skills.

**Architecture:** Single-page Vue 3 app. Content stays JSON-driven but becomes bilingual: `pl.json` + new `en.json` selected by a reactive locale composable (no i18n library). All section components are restyled; new building blocks (language switcher, metrics bar, command-style headings, collapsible skill categories, experience timeline) are added. Existing accessibility safeguards and the scroll-reveal pattern are preserved.

**Tech Stack:** Vue 3 (`<script setup>`, TS), Tailwind CSS v4, `@iconify/vue`, `@lucide/vue`, Vite. No new runtime dependencies (JetBrains Mono added via the existing Google Fonts link).

---

## Verification model (read first)

This project has **no test framework** (none installed; adding one is out of scope — YAGNI for a static landing redesign). Each task is verified with:

- `pnpm type-check` → expected: no TS errors.
- `pnpm lint` → expected: completes (auto-fix) with no errors.
- A manual visual check on `pnpm dev` (http://localhost:5173) — what to look for is stated per task.

The build (`pnpm build`) is run once at the end.

Commit after each task. Use Conventional Commits, matching the repo style (e.g. `feat:`, `refactor:`, `style:`, `chore:`).

---

## File Structure

**Create:**
- `src/content/en.json` — English mirror of `pl.json` (new bilingual schema).
- `src/composables/useLocale.ts` — reactive locale state + switch + persistence.
- `src/components/ui/LanguageSwitcher.vue` — PL/EN toggle.
- `src/components/ui/MetricBar.vue` — hero metrics row.
- `src/components/ui/SkillCategory.vue` — collapsible category of skills (replaces the per-group card logic of `SkillGroup.vue` for the integrations tier).
- `public/cv/README.md` — documents expected CV filenames for the user.

**Modify:**
- `src/types/content.ts` — new bilingual content schema (metrics, cv, command labels, tiered skills, ui strings, github).
- `src/content/pl.json` — migrate to the new schema + tightened copy.
- `src/composables/useContent.ts` — return reactive content for the active locale.
- `src/assets/main.css` — mono font token, blueprint grid, command label, tech-tag, metric, timeline utilities.
- `index.html` — add JetBrains Mono to the fonts link.
- `src/App.vue` — react to locale (title/description/`<html lang>`), skip-link label from content.
- `src/components/ui/SectionHeading.vue` — optional `command` prop.
- `src/components/layout/SiteHeader.vue` — nav + language switcher + CV button.
- `src/components/sections/HeroSection.vue` — label, value prop, metrics, CTAs (incl. CV), blueprint grid.
- `src/components/sections/AboutSection.vue` — command heading + tighter layout.
- `src/components/sections/ExperienceSection.vue` — timeline + collapsible highlights.
- `src/components/sections/SkillsSection.vue` — tiered: core row + collapsible categories.
- `src/components/ui/SkillGroup.vue` — repurpose into the "core" tier renderer (or delete if fully replaced; see Task 8).
- `src/components/sections/ProjectsSection.vue` + `src/components/ui/ProjectCard.vue` — command heading + mono accents.
- `src/components/sections/ContactSection.vue` + `src/components/ui/ContactCard.vue` — command heading, exposed GitHub, CV buttons.
- `src/components/layout/SiteFooter.vue` — mono accents (minor).

**Removed concept:** the old `skills.groups[]` array (with `layout` per group) is replaced by `skills.core[]` + `skills.categories[]`.

---

## Task 1: Bilingual content schema (types)

**Files:**
- Modify: `src/types/content.ts`

- [ ] **Step 1: Replace the content types with the bilingual schema**

Replace the entire contents of `src/types/content.ts` with:

```ts
export interface NavItem {
  id: string
  label: string
}

export interface CtaLink {
  label: string
  href: string
}

export interface MetricItem {
  value: string
  label: string
}

export interface SkillItem {
  name: string
  icon?: string
  image?: string
}

export interface SkillCategory {
  name: string
  items: SkillItem[]
}

export interface ExperienceEntry {
  company: string
  companyUrl?: string
  logo?: string
  role: string
  period: string
  project?: string
  projectUrl?: string
  summary: string
  highlights?: string[]
}

export interface ProjectLink {
  title: string
  url: string
  primary?: boolean
}

export interface Project {
  title: string
  subtitle: string
  image: string | null
  placeholderIndex?: number
  links: ProjectLink[]
}

export interface ContactMethod {
  type: 'email' | 'phone' | 'linkedin' | 'github'
  label: string
  value: string
  href: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface SiteContent {
  meta: {
    title: string
    description: string
    lang: string
  }
  ui: {
    skipToContent: string
    languageLabel: string
    downloadCv: string
    expand: string
    collapse: string
    homeLabel: string
    navLabel: string
  }
  nav: NavItem[]
  hero: {
    label: string
    name: string
    valueProp: string
    subtitle?: string
    metrics: MetricItem[]
    ctaPrimary: CtaLink
  }
  cv: {
    // Empty href => CV buttons are hidden (graceful handling until the file exists).
    href: string
  }
  about: {
    command: string
    title: string
    paragraphs: string[]
  }
  experience: {
    command: string
    title: string
    entries: ExperienceEntry[]
  }
  skills: {
    command: string
    title: string
    coreDescription: string
    core: SkillItem[]
    categories: SkillCategory[]
  }
  projects: {
    command: string
    title: string
    items: Project[]
  }
  contact: {
    command: string
    title: string
    subtitle: string
    methods: ContactMethod[]
    ctaHeadline: string
    github: {
      label: string
      handle: string
      href: string
    }
  }
  footer: {
    servicesTitle: string
    services: string[]
    mediaTitle: string
    social: SocialLink[]
    copyright: string
  }
}
```

Notes:
- `hero.ctaSecondary` is removed; the secondary hero CTA becomes the CV button driven by `cv.href`.
- `contact.ctaPrimary`/`ctaSecondary` are removed; contact CTAs are derived from `contact.methods` + `contact.github` + `cv`.

- [ ] **Step 2: Type-check (expected to FAIL until JSON is migrated)**

Run: `pnpm type-check`
Expected: errors in `useContent.ts` / JSON import shape. This is expected; fixed in Task 2. Do not commit yet — continue to Task 2 and commit them together.

---

## Task 2: Migrate `pl.json` + create `en.json` to the new schema

**Files:**
- Modify: `src/content/pl.json`
- Create: `src/content/en.json`

- [ ] **Step 1: Rewrite `src/content/pl.json` to the new schema**

Use this structure (tightened PL copy; keep existing project/experience facts). Full file:

```json
{
  "meta": {
    "title": "Sebastian Kostecki — Backend Developer (Laravel)",
    "description": "Backend Developer (Laravel). Buduję i integruję produkcyjne platformy hostingowe — API, provisioning WordPress, integracje infrastrukturalne. 4 lata komercyjnie.",
    "lang": "pl"
  },
  "ui": {
    "skipToContent": "Przejdź do treści",
    "languageLabel": "Język",
    "downloadCv": "Pobierz CV",
    "expand": "Rozwiń",
    "collapse": "Zwiń",
    "homeLabel": "Strona główna",
    "navLabel": "Główna nawigacja"
  },
  "nav": [
    { "id": "about", "label": "O mnie" },
    { "id": "experience", "label": "Doświadczenie" },
    { "id": "skills", "label": "Umiejętności" },
    { "id": "projects", "label": "Projekty" },
    { "id": "contact", "label": "Kontakt" }
  ],
  "hero": {
    "label": "// BACKEND ENGINEER · LARAVEL",
    "name": "Sebastian Kostecki",
    "valueProp": "Buduję i integruję produkcyjne platformy hostingowe na Laravel.",
    "subtitle": "Backend Developer z 4-letnim komercyjnym doświadczeniem. Specjalizacja: integracje infrastrukturalne, API i automatyzacja WordPress.",
    "metrics": [
      { "value": "4 lata", "label": "komercyjnie" },
      { "value": "15+", "label": "integracji infra" },
      { "value": "PanelAlpha", "label": "produkt B2B" }
    ],
    "ctaPrimary": {
      "label": "Porozmawiajmy",
      "href": "https://www.linkedin.com/in/kostecki-sebastian"
    }
  },
  "cv": {
    "href": ""
  },
  "about": {
    "command": "$ cat about.md",
    "title": "O mnie",
    "paragraphs": [
      "Od 4 lat tworzę backend w ModulesGarden — firmie budującej oprogramowanie dla branży hostingowej. Obecnie rozwijam PanelAlpha: self-hosted platformę B2B, która hosterom umożliwia provisioning i zarządzanie instalacjami WordPress klientów.",
      "Mój fokus to warstwa backendowa — nowe feature'y, integracje z infrastrukturą hostingową i logika zarządzania instancjami WordPress (m.in. obsługa Git dla WordPressów). Gdy feature tego wymaga, wchodzę też we frontend (Vue.js, Vuetify).",
      "W codziennej pracy korzystam z narzędzi AI (m.in. Cursor) przy implementacji, refaktoryzacji i analizie kodu. Poza pracą — rodzina i rozwój w IT."
    ]
  },
  "experience": {
    "command": "$ git log --experience",
    "title": "Doświadczenie",
    "entries": [
      {
        "company": "PanelAlpha",
        "companyUrl": "https://panelalpha.com",
        "logo": "/assets/experience/panelalpha.svg",
        "role": "Backend Developer",
        "period": "3,5+ roku",
        "summary": "Backend aplikacji Laravel — self-hosted platforma B2B do automatyzacji WordPress dla hosterów. Integracje billingowe (WHMCS), API, Dockerowy provisioning.",
        "highlights": [
          "Integracje z panelami hostingowymi: cPanel, Plesk, DirectAdmin, WP Cloud",
          "Integracje DNS: PowerDNS, Cloudflare, Bunny DNS",
          "Integracje z serwerami email: mailcow",
          "Let's Encrypt — automatyzacja certyfikatów SSL",
          "Analityka: Google Analytics, AWStats",
          "Integracja onboardingu WordPress: Extendify, 10Web",
          "Import i zarządzanie instancjami WordPress",
          "Backupy lokalne i zdalne (S3, FTP, SFTP, FTPS)",
          "Obsługa Git dla WordPressów",
          "Frontend (Vue.js, Vuetify) — gdy feature wymaga zmian po obu stronach"
        ]
      },
      {
        "company": "ModulesGarden",
        "companyUrl": "https://modulesgarden.com",
        "logo": "/assets/experience/mg.jpeg",
        "role": "PHP Developer",
        "period": "~6 miesięcy",
        "project": "Moduły WHMCS",
        "summary": "Customowe moduły i integracje dla platformy billingowej hosterów (PHP, JavaScript, Smarty)."
      }
    ]
  },
  "skills": {
    "command": "$ ls skills/",
    "title": "Umiejętności",
    "coreDescription": "Trzon mojej pracy: logika biznesowa, nowe feature'y i integracje produkcyjne.",
    "core": [
      { "name": "PHP", "icon": "simple-icons:php" },
      { "name": "Laravel", "icon": "simple-icons:laravel" },
      { "name": "MySQL", "icon": "simple-icons:mysql" },
      { "name": "Docker", "icon": "simple-icons:docker" }
    ],
    "categories": [
      {
        "name": "Panele hostingowe",
        "items": [
          { "name": "cPanel", "icon": "simple-icons:cpanel" },
          { "name": "Plesk", "icon": "simple-icons:plesk" },
          { "name": "DirectAdmin", "image": "/assets/skills/directadmin.svg" },
          { "name": "WP Cloud", "image": "/assets/skills/wp-cloud.svg" }
        ]
      },
      {
        "name": "DNS",
        "items": [
          { "name": "PowerDNS", "image": "/assets/skills/powerdns.svg" },
          { "name": "Cloudflare", "icon": "simple-icons:cloudflare" },
          { "name": "Bunny DNS", "icon": "simple-icons:bunnydotnet" }
        ]
      },
      {
        "name": "Storage i backup",
        "items": [
          { "name": "S3", "icon": "simple-icons:amazons3" },
          { "name": "FTP", "icon": "mdi:folder-upload" },
          { "name": "SFTP", "icon": "mdi:folder-lock" },
          { "name": "FTPS", "icon": "mdi:folder-key" }
        ]
      },
      {
        "name": "Email i SSL",
        "items": [
          { "name": "Let's Encrypt", "icon": "simple-icons:letsencrypt" },
          { "name": "mailcow", "icon": "mdi:email-cog" }
        ]
      },
      {
        "name": "Analityka i billing",
        "items": [
          { "name": "Google Analytics", "icon": "simple-icons:googleanalytics" },
          { "name": "AWStats", "image": "/assets/skills/awstats.svg" },
          { "name": "WHMCS", "image": "/assets/skills/whmcs.svg" },
          { "name": "Extendify", "image": "/assets/skills/extendify.svg" },
          { "name": "TenWeb", "image": "/assets/skills/tenweb.svg" }
        ]
      },
      {
        "name": "Frontend",
        "items": [
          { "name": "Vue.js", "icon": "simple-icons:vuedotjs" },
          { "name": "Vuetify", "icon": "simple-icons:vuetify" },
          { "name": "Tailwind CSS", "icon": "simple-icons:tailwindcss" },
          { "name": "JavaScript", "icon": "simple-icons:javascript" },
          { "name": "Ionic", "icon": "simple-icons:ionic" },
          { "name": "Inertia.js", "icon": "simple-icons:inertia" }
        ]
      },
      {
        "name": "Narzędzia i AI",
        "items": [
          { "name": "Git", "icon": "simple-icons:git" },
          { "name": "Cursor", "icon": "simple-icons:cursor" }
        ]
      }
    ]
  },
  "projects": {
    "command": "$ ls projects/",
    "title": "Projekty własne",
    "items": [
      {
        "title": "Ogarniam Portfel",
        "subtitle": "Side project — aplikacja do zarządzania domowym budżetem",
        "image": "/assets/projects/keep-wallet.png",
        "links": [
          { "title": "Strona", "url": "https://budget.sebastian-kostecki.profesjonalnyprogramista.pl/", "primary": true },
          { "title": "GitHub", "url": "https://github.com/sebastian-kostecki/keep-wallet" }
        ]
      },
      {
        "title": "O Nią & O Niego",
        "subtitle": "Side project — aplikacja mobilna (Ionic)",
        "image": "/assets/projects/o-nia-o-niego.jpg",
        "links": [
          { "title": "GitHub", "url": "https://github.com/sebastian-kostecki/o-nia-o-niego", "primary": true }
        ]
      },
      {
        "title": "Menu Maker",
        "subtitle": "Side project (WIP) — planowanie tygodniowych posiłków z AI, skalowaniem składników i eksportem PDF",
        "image": "/assets/projects/menu-maker.png",
        "placeholderIndex": 2,
        "links": [
          { "title": "GitHub", "url": "https://github.com/sebastian-kostecki/menu-maker", "primary": true }
        ]
      }
    ]
  },
  "contact": {
    "command": "$ ./contact.sh",
    "title": "Porozmawiajmy",
    "subtitle": "Zainteresowany współpracą lub rozmową o backendzie? Napisz do mnie.",
    "methods": [
      { "type": "linkedin", "label": "LinkedIn", "value": "in/kostecki-sebastian", "href": "https://www.linkedin.com/in/kostecki-sebastian" },
      { "type": "email", "label": "E-mail", "value": "sebastian.kostecki@gmail.com", "href": "mailto:sebastian.kostecki@gmail.com" }
    ],
    "ctaHeadline": "Chcesz dowiedzieć się więcej o moim doświadczeniu?",
    "github": {
      "label": "Kod i projekty",
      "handle": "@sebastian-kostecki",
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
      { "name": "LinkedIn", "url": "https://www.linkedin.com/in/kostecki-sebastian", "icon": "simple-icons:linkedin" },
      { "name": "GitHub", "url": "https://github.com/sebastian-kostecki", "icon": "simple-icons:github" }
    ],
    "copyright": "Wszystkie prawa zastrzeżone"
  }
}
```

Note the typo fix: `Exendify` → `Extendify`.

- [ ] **Step 2: Create `src/content/en.json` (natural technical English, same structure)**

```json
{
  "meta": {
    "title": "Sebastian Kostecki — Backend Developer (Laravel)",
    "description": "Backend Developer (Laravel). I build and integrate production hosting platforms — APIs, WordPress provisioning, infrastructure integrations. 4 years commercial experience.",
    "lang": "en"
  },
  "ui": {
    "skipToContent": "Skip to content",
    "languageLabel": "Language",
    "downloadCv": "Download CV",
    "expand": "Expand",
    "collapse": "Collapse",
    "homeLabel": "Home",
    "navLabel": "Main navigation"
  },
  "nav": [
    { "id": "about", "label": "About" },
    { "id": "experience", "label": "Experience" },
    { "id": "skills", "label": "Skills" },
    { "id": "projects", "label": "Projects" },
    { "id": "contact", "label": "Contact" }
  ],
  "hero": {
    "label": "// BACKEND ENGINEER · LARAVEL",
    "name": "Sebastian Kostecki",
    "valueProp": "I build and integrate production hosting platforms with Laravel.",
    "subtitle": "Backend Developer with 4 years of commercial experience. Focus: infrastructure integrations, APIs, and WordPress automation.",
    "metrics": [
      { "value": "4 years", "label": "commercial" },
      { "value": "15+", "label": "infra integrations" },
      { "value": "PanelAlpha", "label": "B2B product" }
    ],
    "ctaPrimary": {
      "label": "Let's talk",
      "href": "https://www.linkedin.com/in/kostecki-sebastian"
    }
  },
  "cv": {
    "href": ""
  },
  "about": {
    "command": "$ cat about.md",
    "title": "About me",
    "paragraphs": [
      "For 4 years I've been building backend systems at ModulesGarden, a company creating software for the hosting industry. I currently develop PanelAlpha: a self-hosted B2B platform that lets hosting providers provision and manage their customers' WordPress installations.",
      "My focus is the backend layer — new features, integrations with hosting infrastructure, and the logic for managing WordPress instances (including Git support for WordPress sites). When a feature requires it, I also work on the frontend (Vue.js, Vuetify).",
      "In my daily work I use AI tools (such as Cursor) for implementation, refactoring, and code analysis. Outside of work — family and growing in IT."
    ]
  },
  "experience": {
    "command": "$ git log --experience",
    "title": "Experience",
    "entries": [
      {
        "company": "PanelAlpha",
        "companyUrl": "https://panelalpha.com",
        "logo": "/assets/experience/panelalpha.svg",
        "role": "Backend Developer",
        "period": "3.5+ years",
        "summary": "Backend of a Laravel application — a self-hosted B2B platform for WordPress automation for hosting providers. Billing integrations (WHMCS), APIs, Docker-based provisioning.",
        "highlights": [
          "Hosting panel integrations: cPanel, Plesk, DirectAdmin, WP Cloud",
          "DNS integrations: PowerDNS, Cloudflare, Bunny DNS",
          "Email server integrations: mailcow",
          "Let's Encrypt — automated SSL certificates",
          "Analytics: Google Analytics, AWStats",
          "WordPress onboarding integrations: Extendify, 10Web",
          "Importing and managing WordPress instances",
          "Local and remote backups (S3, FTP, SFTP, FTPS)",
          "Git support for WordPress sites",
          "Frontend (Vue.js, Vuetify) — when a feature requires changes on both sides"
        ]
      },
      {
        "company": "ModulesGarden",
        "companyUrl": "https://modulesgarden.com",
        "logo": "/assets/experience/mg.jpeg",
        "role": "PHP Developer",
        "period": "~6 months",
        "project": "WHMCS modules",
        "summary": "Custom modules and integrations for the hosting providers' billing platform (PHP, JavaScript, Smarty)."
      }
    ]
  },
  "skills": {
    "command": "$ ls skills/",
    "title": "Skills",
    "coreDescription": "The core of my work: business logic, new features, and production integrations.",
    "core": [
      { "name": "PHP", "icon": "simple-icons:php" },
      { "name": "Laravel", "icon": "simple-icons:laravel" },
      { "name": "MySQL", "icon": "simple-icons:mysql" },
      { "name": "Docker", "icon": "simple-icons:docker" }
    ],
    "categories": [
      {
        "name": "Hosting panels",
        "items": [
          { "name": "cPanel", "icon": "simple-icons:cpanel" },
          { "name": "Plesk", "icon": "simple-icons:plesk" },
          { "name": "DirectAdmin", "image": "/assets/skills/directadmin.svg" },
          { "name": "WP Cloud", "image": "/assets/skills/wp-cloud.svg" }
        ]
      },
      {
        "name": "DNS",
        "items": [
          { "name": "PowerDNS", "image": "/assets/skills/powerdns.svg" },
          { "name": "Cloudflare", "icon": "simple-icons:cloudflare" },
          { "name": "Bunny DNS", "icon": "simple-icons:bunnydotnet" }
        ]
      },
      {
        "name": "Storage and backup",
        "items": [
          { "name": "S3", "icon": "simple-icons:amazons3" },
          { "name": "FTP", "icon": "mdi:folder-upload" },
          { "name": "SFTP", "icon": "mdi:folder-lock" },
          { "name": "FTPS", "icon": "mdi:folder-key" }
        ]
      },
      {
        "name": "Email and SSL",
        "items": [
          { "name": "Let's Encrypt", "icon": "simple-icons:letsencrypt" },
          { "name": "mailcow", "icon": "mdi:email-cog" }
        ]
      },
      {
        "name": "Analytics and billing",
        "items": [
          { "name": "Google Analytics", "icon": "simple-icons:googleanalytics" },
          { "name": "AWStats", "image": "/assets/skills/awstats.svg" },
          { "name": "WHMCS", "image": "/assets/skills/whmcs.svg" },
          { "name": "Extendify", "image": "/assets/skills/extendify.svg" },
          { "name": "TenWeb", "image": "/assets/skills/tenweb.svg" }
        ]
      },
      {
        "name": "Frontend",
        "items": [
          { "name": "Vue.js", "icon": "simple-icons:vuedotjs" },
          { "name": "Vuetify", "icon": "simple-icons:vuetify" },
          { "name": "Tailwind CSS", "icon": "simple-icons:tailwindcss" },
          { "name": "JavaScript", "icon": "simple-icons:javascript" },
          { "name": "Ionic", "icon": "simple-icons:ionic" },
          { "name": "Inertia.js", "icon": "simple-icons:inertia" }
        ]
      },
      {
        "name": "Tools and AI",
        "items": [
          { "name": "Git", "icon": "simple-icons:git" },
          { "name": "Cursor", "icon": "simple-icons:cursor" }
        ]
      }
    ]
  },
  "projects": {
    "command": "$ ls projects/",
    "title": "Personal projects",
    "items": [
      {
        "title": "Ogarniam Portfel",
        "subtitle": "Side project — a household budget management app",
        "image": "/assets/projects/keep-wallet.png",
        "links": [
          { "title": "Website", "url": "https://budget.sebastian-kostecki.profesjonalnyprogramista.pl/", "primary": true },
          { "title": "GitHub", "url": "https://github.com/sebastian-kostecki/keep-wallet" }
        ]
      },
      {
        "title": "O Nią & O Niego",
        "subtitle": "Side project — a mobile app (Ionic)",
        "image": "/assets/projects/o-nia-o-niego.jpg",
        "links": [
          { "title": "GitHub", "url": "https://github.com/sebastian-kostecki/o-nia-o-niego", "primary": true }
        ]
      },
      {
        "title": "Menu Maker",
        "subtitle": "Side project (WIP) — weekly meal planning with AI, ingredient scaling, and PDF export",
        "image": "/assets/projects/menu-maker.png",
        "placeholderIndex": 2,
        "links": [
          { "title": "GitHub", "url": "https://github.com/sebastian-kostecki/menu-maker", "primary": true }
        ]
      }
    ]
  },
  "contact": {
    "command": "$ ./contact.sh",
    "title": "Let's talk",
    "subtitle": "Interested in working together or chatting about backend? Get in touch.",
    "methods": [
      { "type": "linkedin", "label": "LinkedIn", "value": "in/kostecki-sebastian", "href": "https://www.linkedin.com/in/kostecki-sebastian" },
      { "type": "email", "label": "E-mail", "value": "sebastian.kostecki@gmail.com", "href": "mailto:sebastian.kostecki@gmail.com" }
    ],
    "ctaHeadline": "Want to learn more about my experience?",
    "github": {
      "label": "Code and projects",
      "handle": "@sebastian-kostecki",
      "href": "https://github.com/sebastian-kostecki"
    }
  },
  "footer": {
    "servicesTitle": "Specialization",
    "services": [
      "Laravel backend in production applications",
      "Integrations with hosting and infrastructure systems"
    ],
    "mediaTitle": "Profiles",
    "social": [
      { "name": "LinkedIn", "url": "https://www.linkedin.com/in/kostecki-sebastian", "icon": "simple-icons:linkedin" },
      { "name": "GitHub", "url": "https://github.com/sebastian-kostecki", "icon": "simple-icons:github" }
    ],
    "copyright": "All rights reserved"
  }
}
```

- [ ] **Step 3: Commit (with Task 1 types)**

```bash
git add src/types/content.ts src/content/pl.json src/content/en.json
git commit -m "feat: add bilingual content schema (PL/EN) with metrics, cv, tiered skills"
```

(Type-check will still fail until Task 3 updates `useContent`; that's fine — the commit groups the data layer.)

---

## Task 2 follow-up note

Do not run `pnpm type-check` as a gate here — `useContent.ts` is updated in Task 3. Proceed.

---

## Task 3: Reactive locale + content composables

**Files:**
- Create: `src/composables/useLocale.ts`
- Modify: `src/composables/useContent.ts`

- [ ] **Step 1: Create `src/composables/useLocale.ts`**

```ts
import { ref } from 'vue'

export type Locale = 'pl' | 'en'

const STORAGE_KEY = 'kostecki-locale'

function detectInitial(): Locale {
  if (typeof window === 'undefined') return 'pl'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'pl' || stored === 'en') return stored
  const browser = window.navigator.language?.toLowerCase() ?? ''
  return browser.startsWith('en') ? 'en' : 'pl'
}

// Module-level singleton so every component shares the same locale state.
const locale = ref<Locale>(detectInitial())

export function useLocale() {
  function setLocale(next: Locale) {
    locale.value = next
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    }
  }
  return { locale, setLocale }
}
```

- [ ] **Step 2: Rewrite `src/composables/useContent.ts` to be reactive**

```ts
import { computed, type ComputedRef } from 'vue'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import type { SiteContent } from '@/types/content'
import { useLocale, type Locale } from '@/composables/useLocale'

const dictionaries: Record<Locale, SiteContent> = {
  pl: pl as SiteContent,
  en: en as SiteContent,
}

// Returns a ComputedRef. In templates the ref auto-unwraps, so
// `content.hero.name` works directly; in <script> use `content.value`.
export function useContent(): ComputedRef<SiteContent> {
  const { locale } = useLocale()
  return computed(() => dictionaries[locale.value])
}
```

**Important consumer-pattern change:** every component currently does `const { hero } = useContent()`. That destructuring no longer works. Each consumer becomes:

```ts
const content = useContent()
```

and the template uses `content.hero...`, `content.nav`, etc. Script-side computed/logic uses `content.value...`. This change is applied per component in the tasks below.

- [ ] **Step 3: Type-check**

Run: `pnpm type-check`
Expected: errors now only in the **components** that still destructure `useContent()` (App.vue, SiteHeader, SiteFooter, all sections, SkillsSection). These are fixed in Tasks 5–12. The composables themselves should type-check cleanly.

- [ ] **Step 4: Commit**

```bash
git add src/composables/useLocale.ts src/composables/useContent.ts
git commit -m "feat: make content reactive to a persisted PL/EN locale"
```

---

## Task 4: Design system — fonts and CSS utilities

**Files:**
- Modify: `index.html`
- Modify: `src/assets/main.css`

- [ ] **Step 1: Add JetBrains Mono to the fonts link in `index.html`**

Replace the existing fonts `<link href="https://fonts.googleapis.com/css2?...">` line with:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add the mono font token in `@theme` in `src/assets/main.css`**

Add inside the existing `@theme { ... }` block (after `--font-body`):

```css
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
```

- [ ] **Step 3: Add new utilities in the `@layer utilities` block of `src/assets/main.css`**

Append these utilities inside `@layer utilities { ... }`:

```css
  .blueprint-grid {
    background-image:
      linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .cmd-label {
    @apply font-mono text-xs font-medium tracking-wide text-accent;
  }

  .mono-label {
    @apply font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted;
  }

  .tech-tag {
    @apply inline-flex items-center gap-2 rounded-lg border border-border bg-white/5 px-3 py-1.5 font-mono text-xs font-medium text-white/90 transition-colors hover:border-accent/50 hover:bg-white/10;
  }

  .metric-value {
    @apply font-display text-2xl font-extrabold text-white sm:text-3xl;
  }

  .metric-label {
    @apply font-mono text-[0.7rem] uppercase tracking-wide text-muted;
  }
```

- [ ] **Step 4: Verify (lint + dev)**

Run: `pnpm lint`
Expected: completes with no errors.
On `pnpm dev`, confirm the page still renders (components broken from Task 3 will be fixed next; fonts load without console errors).

- [ ] **Step 5: Commit**

```bash
git add index.html src/assets/main.css
git commit -m "style: add mono font and Crimson Engineer utility classes"
```

---

## Task 5: `SectionHeading` — optional command prop

**Files:**
- Modify: `src/components/ui/SectionHeading.vue`

- [ ] **Step 1: Replace `SectionHeading.vue` with the command-aware version**

```vue
<script setup lang="ts">
defineProps<{
  id?: string
  title: string
  command?: string
  light?: boolean
  centered?: boolean
}>()
</script>

<template>
  <div :class="centered ? 'text-center' : 'text-center lg:text-left'">
    <p v-if="command" class="cmd-label">{{ command }}</p>
    <h2
      :id="id"
      class="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
    >
      {{ title }}
    </h2>
  </div>
</template>
```

Note: the `light` prop is kept for API compatibility (callers still pass it) but no longer changes color — text is always white on the dark theme. Leaving the prop avoids touching every call site's attribute list.

- [ ] **Step 2: Type-check + lint**

Run: `pnpm type-check` (heading file itself should be clean) and `pnpm lint`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SectionHeading.vue
git commit -m "feat: support terminal-style command label in SectionHeading"
```

---

## Task 6: Language switcher component

**Files:**
- Create: `src/components/ui/LanguageSwitcher.vue`

- [ ] **Step 1: Create `src/components/ui/LanguageSwitcher.vue`**

```vue
<script setup lang="ts">
import { useLocale, type Locale } from '@/composables/useLocale'
import { useContent } from '@/composables/useContent'

const { locale, setLocale } = useLocale()
const content = useContent()

const locales: Locale[] = ['pl', 'en']
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-lg border border-border bg-white/5 p-0.5 font-mono text-xs"
    role="group"
    :aria-label="content.ui.languageLabel"
  >
    <button
      v-for="code in locales"
      :key="code"
      type="button"
      class="rounded-md px-2 py-1 font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      :class="
        locale === code
          ? 'bg-accent text-white'
          : 'text-muted hover:text-white'
      "
      :aria-pressed="locale === code"
      @click="setLocale(code)"
    >
      {{ code }}
    </button>
  </div>
</template>
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm type-check && pnpm lint`. The switcher should be clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/LanguageSwitcher.vue
git commit -m "feat: add PL/EN language switcher"
```

---

## Task 7: App shell — react to locale + skip link

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Replace `src/App.vue`**

```vue
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import { useContent } from '@/composables/useContent'
import { useLocale } from '@/composables/useLocale'

const content = useContent()
const { locale } = useLocale()

function applyMeta() {
  const { meta } = content.value
  document.title = meta.title
  document.documentElement.lang = meta.lang
  const description = document.querySelector('meta[name="description"]')
  if (description) description.setAttribute('content', meta.description)
}

onMounted(applyMeta)
watch(locale, applyMeta)
</script>

<template>
  <a href="#about" class="skip-link">{{ content.ui.skipToContent }}</a>
  <SiteHeader />
  <HeroSection />
  <main id="main-content">
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm type-check && pnpm lint`. App.vue should be clean (sections still error until their tasks).

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: update document meta and html lang on locale change"
```

---

## Task 8: Sticky header — nav + language switcher + CV button

**Files:**
- Modify: `src/components/layout/SiteHeader.vue`

- [ ] **Step 1: Replace `src/components/layout/SiteHeader.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useScrollPosition } from '@/composables/useScrollReveal'
import { useContent } from '@/composables/useContent'

const content = useContent()
const { scrollY } = useScrollPosition()

const isVisible = computed(() => scrollY.value > 80)
const hasCv = computed(() => content.value.cv.href.length > 0)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="[
      isVisible
        ? 'translate-y-0 border-b border-border bg-bg/80 opacity-100 backdrop-blur-lg'
        : '-translate-y-full opacity-0 pointer-events-none',
    ]"
    :aria-label="content.ui.navLabel"
  >
    <div class="container mx-auto flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
      <a
        href="#"
        class="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        :aria-label="content.ui.homeLabel"
      >
        <BrandMark :size="28" decorative />
      </a>

      <nav aria-label="Sekcje strony">
        <ul class="hidden items-center gap-6 md:flex">
          <li v-for="item in content.nav" :key="item.id">
            <a :href="`#${item.id}`" class="nav-link font-mono">{{ item.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <LanguageSwitcher />
        <a
          v-if="hasCv"
          :href="content.cv.href"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary hidden text-xs md:inline-flex md:px-4 md:py-2"
        >
          {{ content.ui.downloadCv }}
        </a>
      </div>
    </div>
  </header>
</template>
```

- [ ] **Step 2: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On `pnpm dev`, scroll down: header appears with nav, PL/EN switch toggles labels live, CV button hidden (empty href). Switching locale updates nav labels.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SiteHeader.vue
git commit -m "feat: header with language switcher and CV button"
```

---

## Task 9: Metric bar component

**Files:**
- Create: `src/components/ui/MetricBar.vue`

- [ ] **Step 1: Create `src/components/ui/MetricBar.vue`**

```vue
<script setup lang="ts">
import type { MetricItem } from '@/types/content'

defineProps<{
  metrics: MetricItem[]
}>()
</script>

<template>
  <dl class="flex flex-wrap gap-x-8 gap-y-4">
    <div v-for="metric in metrics" :key="metric.label" class="flex flex-col">
      <dt class="order-2 metric-label">{{ metric.label }}</dt>
      <dd class="order-1 metric-value">{{ metric.value }}</dd>
    </div>
  </dl>
</template>
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm type-check && pnpm lint`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/MetricBar.vue
git commit -m "feat: add hero metric bar component"
```

---

## Task 10: Hero redesign

**Files:**
- Modify: `src/components/sections/HeroSection.vue`

- [ ] **Step 1: Replace `src/components/sections/HeroSection.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import MetricBar from '@/components/ui/MetricBar.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const hasCv = computed(() => content.value.cv.href.length > 0)
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-screen flex-col overflow-hidden"
    aria-label="Hero"
  >
    <div
      class="pointer-events-none absolute inset-0 blueprint-grid opacity-60"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.16)_0%,_transparent_55%)]"
      aria-hidden="true"
    />

    <div class="container relative mx-auto flex flex-1 flex-col justify-center px-4 py-24 lg:px-8">
      <div class="max-w-3xl">
        <p class="cmd-label">{{ content.hero.label }}</p>
        <h1 class="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
          {{ content.hero.name }}
        </h1>
        <p class="mt-5 max-w-2xl font-display text-xl font-semibold text-white/90 sm:text-2xl">
          {{ content.hero.valueProp }}
        </p>
        <p v-if="content.hero.subtitle" class="mt-4 max-w-2xl text-base text-muted sm:text-lg">
          {{ content.hero.subtitle }}
        </p>

        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            :href="content.hero.ctaPrimary.href"
            class="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ content.hero.ctaPrimary.label }}
          </a>
          <a
            v-if="hasCv"
            :href="content.cv.href"
            class="btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ content.ui.downloadCv }}
          </a>
        </div>

        <div class="mt-12 border-t border-border pt-8">
          <MetricBar :metrics="content.hero.metrics" />
        </div>
      </div>
    </div>
  </section>
</template>
```

Note: the in-hero `<nav>` is removed (navigation now lives in the sticky header, which appears on scroll). The hero anchor links are still reachable via the header.

- [ ] **Step 2: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On `pnpm dev`: hero shows mono label, name, value prop, CTAs, metric bar over a blueprint grid. Switching to EN updates all hero copy.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSection.vue
git commit -m "feat: redesign hero with value prop, metrics, and blueprint grid"
```

---

## Task 11: About section redesign

**Files:**
- Modify: `src/components/sections/AboutSection.vue`

- [ ] **Step 1: Replace `src/components/sections/AboutSection.vue`**

```vue
<script setup lang="ts">
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
</script>

<template>
  <section id="about" class="py-20 lg:py-28" aria-labelledby="about-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading
          id="about-heading"
          :command="content.about.command"
          :title="content.about.title"
        />
      </RevealOnScroll>
      <div class="mt-10 grid gap-6 lg:max-w-4xl lg:gap-8">
        <RevealOnScroll v-for="(paragraph, index) in content.about.paragraphs" :key="index">
          <p class="text-base leading-relaxed text-muted lg:text-lg">{{ paragraph }}</p>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On dev: command label `$ cat about.md` over the title; paragraphs render; EN switch works.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AboutSection.vue
git commit -m "feat: redesign about section with command heading"
```

---

## Task 12: Experience timeline + collapsible highlights

**Files:**
- Modify: `src/components/sections/ExperienceSection.vue`

- [ ] **Step 1: Replace `src/components/sections/ExperienceSection.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()

// Track which entries have highlights expanded (keyed by index). First entry open by default.
const expanded = ref<Record<number, boolean>>({ 0: true })

function toggle(index: number) {
  expanded.value[index] = !expanded.value[index]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <section id="experience" class="bg-surface py-20 lg:py-28" aria-labelledby="experience-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading
          id="experience-heading"
          :command="content.experience.command"
          :title="content.experience.title"
        />
      </RevealOnScroll>

      <div class="mt-12 space-y-6 border-l border-border pl-6 lg:pl-8">
        <RevealOnScroll
          v-for="(entry, index) in content.experience.entries"
          :key="`${entry.company}-${index}`"
        >
          <article class="relative surface-card p-6 lg:p-8">
            <span
              class="absolute -left-[1.85rem] top-8 h-3 w-3 rounded-full border-2 border-bg bg-accent lg:-left-[2.35rem]"
              aria-hidden="true"
            />
            <div class="flex gap-4 lg:gap-6">
              <div
                class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white/5 lg:h-16 lg:w-16"
                aria-hidden="true"
              >
                <img
                  v-if="entry.logo"
                  :src="entry.logo"
                  :alt="`Logo ${entry.company}`"
                  class="h-full w-full object-contain p-2"
                />
                <span v-else class="font-display text-lg font-bold text-white/60">
                  {{ getInitials(entry.company) }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <header>
                  <a
                    v-if="entry.companyUrl"
                    :href="entry.companyUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-display text-xl font-bold text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    {{ entry.company }}
                  </a>
                  <h3 v-else class="font-display text-xl font-bold text-white">{{ entry.company }}</h3>
                </header>
                <p class="mt-2 font-mono text-sm font-medium text-white">
                  {{ entry.role }}<span class="text-muted"> · {{ entry.period }}</span>
                </p>
                <p v-if="entry.project" class="mt-1 text-sm text-muted">{{ entry.project }}</p>
                <p class="mt-4 text-base leading-relaxed text-muted">{{ entry.summary }}</p>

                <template v-if="entry.highlights?.length">
                  <button
                    type="button"
                    class="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                    :aria-expanded="!!expanded[index]"
                    :aria-controls="`exp-highlights-${index}`"
                    @click="toggle(index)"
                  >
                    {{ expanded[index] ? content.ui.collapse : content.ui.expand }}
                    <span aria-hidden="true">{{ expanded[index] ? '−' : '+' }}</span>
                  </button>
                  <ul
                    v-show="expanded[index]"
                    :id="`exp-highlights-${index}`"
                    class="mt-4 space-y-2 text-sm leading-relaxed text-muted"
                  >
                    <li
                      v-for="highlight in entry.highlights"
                      :key="highlight"
                      class="border-l-2 border-accent/60 pl-3"
                    >
                      {{ highlight }}
                    </li>
                  </ul>
                </template>
              </div>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On dev: timeline rail with accent dots; PanelAlpha highlights expanded by default, toggle collapses/expands; keyboard: Tab to the toggle, Enter/Space toggles, `aria-expanded` flips.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ExperienceSection.vue
git commit -m "feat: experience timeline with collapsible highlights"
```

---

## Task 13: Tiered skills — core row + collapsible categories

**Files:**
- Create: `src/components/ui/SkillCategory.vue`
- Modify: `src/components/sections/SkillsSection.vue`
- Delete: `src/components/ui/SkillGroup.vue` (replaced)

- [ ] **Step 1: Create `src/components/ui/SkillCategory.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SkillIcon from '@/components/ui/SkillIcon.vue'
import type { SkillCategory } from '@/types/content'
import { useContent } from '@/composables/useContent'

const props = defineProps<{
  category: SkillCategory
  index: number
}>()

const content = useContent()
const open = ref(false)
const panelId = `skill-cat-${props.index}`
</script>

<template>
  <div class="surface-card overflow-hidden">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent lg:p-5"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <span class="flex items-center gap-3">
        <span class="font-mono text-sm text-muted">▸</span>
        <span class="font-display font-semibold text-white">{{ category.name }}</span>
        <span class="font-mono text-xs text-muted">{{ category.items.length }}</span>
      </span>
      <span class="font-mono text-sm text-accent" aria-hidden="true">{{ open ? '−' : '+' }}</span>
    </button>
    <div v-show="open" :id="panelId" class="flex flex-wrap gap-2 px-4 pb-5 lg:px-5">
      <span v-for="item in category.items" :key="item.name" class="tech-tag">
        <SkillIcon :item="item" size-class="h-4 w-4" />
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
```

(`content` is imported for parity/future i18n labels; if linthe flags it as unused, remove the import and `useContent()` call. The `useContent` import is optional here.)

- [ ] **Step 2: Replace `src/components/sections/SkillsSection.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SkillIcon from '@/components/ui/SkillIcon.vue'
import SkillCategory from '@/components/ui/SkillCategory.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = sectionRef.value
  if (!el) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cards = el.querySelectorAll('.reveal')
  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add('reveal-visible'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  )
  cards.forEach((card) => observer.observe(card))
})
</script>

<template>
  <section id="skills" ref="sectionRef" class="py-20 lg:py-28" aria-labelledby="skills-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <SectionHeading
        id="skills-heading"
        :command="content.skills.command"
        :title="content.skills.title"
      />

      <div class="mt-10 reveal">
        <div class="flex flex-wrap gap-3">
          <span v-for="item in content.skills.core" :key="item.name" class="tech-tag !px-4 !py-2 !text-sm">
            <SkillIcon :item="item" size-class="h-5 w-5" />
            {{ item.name }}
          </span>
        </div>
        <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          {{ content.skills.coreDescription }}
        </p>
      </div>

      <div class="mt-8 grid gap-3 reveal md:grid-cols-2">
        <SkillCategory
          v-for="(category, index) in content.skills.categories"
          :key="category.name"
          :category="category"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Delete the obsolete `SkillGroup.vue`**

```bash
git rm src/components/ui/SkillGroup.vue
```

- [ ] **Step 4: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On dev: core stack as prominent tags; categories collapsed, click expands to show tagged tech; counts show per category; keyboard accessible (`aria-expanded`/`aria-controls`).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SkillCategory.vue src/components/sections/SkillsSection.vue
git commit -m "feat: tiered skills with core stack and collapsible categories"
```

---

## Task 14: Projects restyle

**Files:**
- Modify: `src/components/sections/ProjectsSection.vue`
- Modify: `src/components/ui/ProjectCard.vue`

- [ ] **Step 1: Update the heading in `ProjectsSection.vue`**

In `src/components/sections/ProjectsSection.vue`:
- Change `const { projects } = useContent()` to `const content = useContent()`.
- Replace the `<SectionHeading ... :title="projects.title" light />` line with:

```vue
        <SectionHeading
          id="projects-heading"
          :command="content.projects.command"
          :title="content.projects.title"
        />
```

- Replace the `v-for="(project, index) in projects.items"` with `v-for="(project, index) in content.projects.items"`.
- Bump section padding `py-16 lg:py-24` → `py-20 lg:py-28` for rhythm consistency.

- [ ] **Step 2: Add a mono accent to `ProjectCard.vue`**

In `src/components/ui/ProjectCard.vue`, inside the `<div class="p-6">` block, add a mono label directly above the `<h3>`:

```vue
      <p class="mono-label">side project</p>
      <h3 class="mt-1 font-display text-xl font-bold text-white">{{ project.title }}</h3>
```

(Keep the rest of the card as-is. The image alt text remains in Polish; acceptable as it is decorative-ish and consistent. Optionally localize later.)

- [ ] **Step 3: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On dev: command heading `$ ls projects/`; cards show mono label; links work; EN switch updates title.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ProjectsSection.vue src/components/ui/ProjectCard.vue
git commit -m "feat: restyle projects section with command heading and mono accents"
```

---

## Task 15: Contact restyle + exposed GitHub + CV

**Files:**
- Modify: `src/components/sections/ContactSection.vue`

- [ ] **Step 1: Replace `src/components/sections/ContactSection.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ContactCard from '@/components/ui/ContactCard.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const sectionRef = ref<HTMLElement | null>(null)
const hasCv = computed(() => content.value.cv.href.length > 0)

onMounted(() => {
  const el = sectionRef.value
  if (!el) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cards = el.querySelectorAll('.reveal')
  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add('reveal-visible'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  )
  cards.forEach((card) => observer.observe(card))
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="bg-surface py-20 lg:py-28" aria-labelledby="contact-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading
          id="contact-heading"
          :command="content.contact.command"
          :title="content.contact.title"
          centered
        />
        <p class="mt-4 text-center text-muted">{{ content.contact.subtitle }}</p>
      </RevealOnScroll>

      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-2xl">
        <ContactCard
          v-for="(method, index) in content.contact.methods"
          :key="method.type"
          :method="method"
          :index="index"
        />
      </div>

      <RevealOnScroll>
        <a
          :href="content.contact.github.href"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-border bg-white/5 p-5 transition-colors hover:border-accent/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:mx-auto lg:max-w-2xl"
        >
          <Icon icon="simple-icons:github" class="h-6 w-6 text-white" aria-hidden="true" />
          <span class="font-display font-semibold text-white">{{ content.contact.github.label }}</span>
          <span class="font-mono text-sm text-muted">{{ content.contact.github.handle }}</span>
        </a>
      </RevealOnScroll>

      <RevealOnScroll>
        <div class="mt-12 rounded-2xl border border-border bg-white/5 p-8 text-center lg:p-12">
          <h3 class="font-display text-2xl font-bold text-white lg:text-3xl">
            {{ content.contact.ctaHeadline }}
          </h3>
          <div class="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              :href="content.hero.ctaPrimary.href"
              class="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ content.hero.ctaPrimary.label }}
            </a>
            <a
              v-if="hasCv"
              :href="content.cv.href"
              class="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ content.ui.downloadCv }}
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On dev: command heading; LinkedIn/email cards; exposed GitHub card; CTA block (CV hidden until href set); EN switch updates all copy.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ContactSection.vue
git commit -m "feat: restyle contact with exposed GitHub and CV CTA"
```

---

## Task 16: Footer mono accents

**Files:**
- Modify: `src/components/layout/SiteFooter.vue`

- [ ] **Step 1: Update `SiteFooter.vue` consumer pattern + minor styling**

In `src/components/layout/SiteFooter.vue`:
- Change `const { footer } = useContent()` to `const content = useContent()`.
- Replace every `footer.` reference in the template with `content.footer.`.
- Add `font-mono` to the copyright `<p>` class (the line containing `{{ content.footer.copyright }}`).

Resulting script block:

```ts
import { Icon } from '@iconify/vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const year = new Date().getFullYear()
```

- [ ] **Step 2: Type-check + lint + visual**

Run: `pnpm type-check && pnpm lint`. On dev: footer renders, EN switch updates titles/services.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SiteFooter.vue
git commit -m "refactor: footer uses reactive content and mono copyright"
```

---

## Task 17: CV asset folder + documentation

**Files:**
- Create: `public/cv/README.md`

- [ ] **Step 1: Create `public/cv/README.md`**

```markdown
# CV files

Place the CV PDFs here and set `cv.href` in the content JSON to point at them.

Suggested filenames:
- `public/cv/sebastian-kostecki-pl.pdf` → set `cv.href` in `src/content/pl.json` to `/cv/sebastian-kostecki-pl.pdf`
- `public/cv/sebastian-kostecki-en.pdf` → set `cv.href` in `src/content/en.json` to `/cv/sebastian-kostecki-en.pdf`

While `cv.href` is an empty string, the "Download CV" buttons are hidden automatically (no broken links).
```

- [ ] **Step 2: Commit**

```bash
git add public/cv/README.md
git commit -m "docs: document CV asset location and graceful empty-href behavior"
```

---

## Task 18: Final verification + cleanup

**Files:** none (verification only)

- [ ] **Step 1: Full type-check**

Run: `pnpm type-check`
Expected: PASS, no errors.

- [ ] **Step 2: Full lint**

Run: `pnpm lint`
Expected: completes with no errors.

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: build succeeds, no type errors.

- [ ] **Step 4: Manual smoke check on `pnpm dev`**

Verify:
- Hero: label, name, value prop, subtitle, primary CTA, metric bar, blueprint grid.
- Header appears on scroll; nav anchors jump to sections; PL/EN switch flips all visible copy and persists across reload (localStorage); `<html lang>` updates (check DevTools Elements).
- About / Experience / Skills / Projects / Contact all render with command headings.
- Experience highlights collapse/expand; skill categories collapse/expand; both keyboard-operable.
- GitHub card and contact methods link out correctly.
- CV buttons are hidden (empty `cv.href`). Temporarily set a dummy `cv.href` in `pl.json` to confirm the button appears, then revert.
- Reduced-motion: with OS "reduce motion" on, reveal elements are immediately visible.

- [ ] **Step 5: Update README if needed**

If `README.md` describes content/structure that changed, update it. Otherwise skip.

- [ ] **Step 6: Final commit (if any cleanup changes)**

```bash
git add -A
git commit -m "chore: final rebranding verification and cleanup"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Bilingual PL/EN + switcher → Tasks 1–3, 6, 7, 8. ✓
- Crimson Engineer visual (palette kept, mono, blueprint, command headings) → Tasks 4, 5, 10–16. ✓
- Recruiter elements: CV (PL+EN, follows language, graceful when missing) → `cv.href` per JSON + `hasCv` guards (Tasks 8, 10, 15, 17); metrics → Tasks 9–10; exposed GitHub → Task 15. ✓
- Tiered skills → Task 13. ✓
- Scan-first structure (sticky header, hero metrics, command sections, timeline) → Tasks 8, 10, 12, 13. ✓
- EN natural copy → Task 2. ✓

**Placeholder scan:** No TBD/TODO; every code step contains full content. The only intentionally empty value is `cv.href: ""`, which is the documented graceful-missing mechanism.

**Type consistency:** `useContent()` returns `ComputedRef<SiteContent>`; all consumers use `const content = useContent()` + `content.value` in script / `content.x` in template. `SkillCategory`/`SkillItem`/`MetricItem` names match `types/content.ts`. Removed `hero.ctaSecondary` and `contact.ctaPrimary/ctaSecondary` from both the type and all consumers (hero/contact now derive CTAs from `ctaPrimary` + `cv`). `SkillGroup` type/component removed and replaced by `SkillCategory`.

**CV "follows language":** achieved by `cv.href` living in each locale's JSON, so switching locale swaps the CV link automatically.
