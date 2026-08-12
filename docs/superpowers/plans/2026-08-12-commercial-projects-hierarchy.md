# Commercial Projects Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make PanelAlpha and five independently implemented ModulesGarden WHMCS modules the primary portfolio work while retaining personal projects as supporting content.

**Architecture:** Replace the flat projects array with explicit `featured`, `commercialGroup`, and `personal` content branches shared by both locales. Add focused Vue presentation components for the flagship project and grouped modules, then compose compact variants on Home and full variants on `/projects`; the existing `ProjectCard` remains unchanged for personal work.

**Tech Stack:** Vue 3 Composition API, TypeScript, Vue Router, Tailwind CSS v4, JSON-driven PL/EN content, Lucide Vue icons.

## Global Constraints

- Keep the navigation label **Projects** and route `/projects`.
- Optimize the content hierarchy for recruiters and prospective employers.
- Link PanelAlpha only to `https://panelalpha.com`.
- Do not add links, screenshots, unsupported metrics, or confidential details for ModulesGarden modules.
- State that the five WHMCS modules were independently implemented while working for ModulesGarden; do not claim ownership of ModulesGarden or its entire platform.
- Use one shared module stack: PHP, HTML, CSS, JavaScript, jQuery, Smarty, and WHMCS.
- Keep personal-project demo and GitHub links unchanged.
- Keep PL and EN content structures identical.
- Preserve the current crimson pixel-perch visual system and existing routes.
- Generated code, identifiers, comments, and logs must be in English.

## File Map

- Modify `src/types/content.ts` — define the commercial-project content contract.
- Modify `src/content/pl.json` — add Polish commercial-project content and metadata.
- Modify `src/content/en.json` — add equivalent English content and metadata.
- Create `src/components/ui/PanelAlphaFeature.vue` — render PanelAlpha in compact and full modes.
- Create `src/components/ui/CommercialProjectItem.vue` — render one non-clickable WHMCS module.
- Create `src/components/ui/CommercialProjectGroup.vue` — render the ModulesGarden summary or full module list.
- Modify `src/views/HomeView.vue` — replace personal cards with the compact commercial preview.
- Modify `src/views/ProjectsView.vue` — compose full commercial work followed by personal projects.
- Keep `src/components/ui/ProjectCard.vue` unchanged — continue rendering personal projects only.

---

### Task 1: Introduce the project content contract and bilingual data

**Files:**
- Modify: `src/types/content.ts:41-55,148-153`
- Modify: `src/content/pl.json:12-15,192-228`
- Modify: `src/content/en.json:12-15,192-228`
- Modify: `src/views/HomeView.vue:121-127`
- Modify: `src/views/ProjectsView.vue:22-28`

**Interfaces:**
- Produces: `FeaturedProject`, `CommercialProjectItem`, `CommercialProjectGroup`, and `PersonalProjects`.
- Produces: `SiteContent['projects']` with `featured`, `commercialGroup`, and `personal`.
- Preserves: the existing `Project` and `ProjectLink` interfaces for personal project cards.

- [ ] **Step 1: Verify the current type-check baseline**

Run:

```bash
npm run type-check
```

Expected: exit code 0.

- [ ] **Step 2: Add explicit project content interfaces**

In `src/types/content.ts`, retain `ProjectLink` and `Project`, then add:

```ts
export interface FeaturedProject {
  eyebrow: string
  title: string
  description: string
  contributionTitle: string
  responsibilities: string[]
  tags: string[]
  link?: ProjectLink
}

export interface CommercialProjectItem {
  title: string
  description: string
}

export interface CommercialProjectGroup {
  eyebrow: string
  title: string
  description: string
  authorship: string
  compactLabel: string
  tags: string[]
  items: CommercialProjectItem[]
}

export interface PersonalProjects {
  index: string
  title: string
  subtitle: string
  items: Project[]
}
```

Replace the `projects` branch of `SiteContent` with:

```ts
  projects: {
    index: string
    title: string
    subtitle: string
    featured: FeaturedProject
    commercialGroup: CommercialProjectGroup
    personal: PersonalProjects
  }
```

- [ ] **Step 3: Replace the Polish route metadata and projects content**

In `src/content/pl.json`, set `routes.projects.description` to:

```json
"Wybrane realizacje komercyjne: PanelAlpha, autorskie moduły WHMCS dla ModulesGarden oraz projekty własne."
```

Replace the complete `projects` object with:

```json
"projects": {
  "index": "03 / Projekty",
  "title": "Wybrane projekty",
  "subtitle": "Produkty i narzędzia, które rozwijałem komercyjnie — uzupełnione wybranymi projektami własnymi.",
  "featured": {
    "eyebrow": "Główny projekt komercyjny",
    "title": "PanelAlpha",
    "description": "Produkcyjna platforma B2B do automatyzacji zarządzania WordPress dla firm hostingowych i agencji.",
    "contributionTitle": "Mój wkład",
    "responsibilities": [
      "Backend Laravel i rozwój API platformy",
      "Integracje hostingowe, DNS, e-mail, SSL, backup i storage",
      "Cykl życia instancji WordPress oraz obsługa Git",
      "Integracja WHMCS i powiązana logika billingowa",
      "Vue.js i Vuetify przy funkcjach obejmujących backend oraz UI"
    ],
    "tags": ["PHP", "Laravel", "MySQL", "Vue.js", "Vuetify", "WHMCS"],
    "link": {
      "title": "Zobacz PanelAlpha",
      "url": "https://panelalpha.com",
      "primary": true
    }
  },
  "commercialGroup": {
    "eyebrow": "Realizacje komercyjne",
    "title": "Moduły WHMCS dla ModulesGarden",
    "description": "Narzędzia rozszerzające billing, automatyzację i obsługę infrastruktury w WHMCS.",
    "authorship": "Każdy z poniższych modułów zaimplementowałem samodzielnie w ramach pracy dla ModulesGarden.",
    "compactLabel": "samodzielnie zaimplementowanych modułów WHMCS",
    "tags": ["PHP", "HTML", "CSS", "JavaScript", "jQuery", "Smarty", "WHMCS"],
    "items": [
      {
        "title": "Domain Data From Plesk",
        "description": "Udostępnia dane domen z Plesk w procesach obsługiwanych przez WHMCS."
      },
      {
        "title": "Invoice Sub Status",
        "description": "Rozszerza obsługę faktur o bardziej szczegółowe statusy."
      },
      {
        "title": "Automated Refunds",
        "description": "Automatyzuje obsługę zwrotów w WHMCS."
      },
      {
        "title": "Auto Upgrade For Early Payments For WHMCS",
        "description": "Automatyzuje skonfigurowany proces podniesienia pakietu przy wcześniejszej płatności."
      },
      {
        "title": "BulkUpdater",
        "description": "Umożliwia masowe aktualizowanie rekordów w WHMCS."
      }
    ]
  },
  "personal": {
    "index": "03.3 / Projekty własne",
    "title": "Projekty własne",
    "subtitle": "Mniejsze produkty, w których rozwijam pomysły i sprawdzam narzędzia poza pracą komercyjną.",
    "items": [
      {
        "title": "Ogarniam Portfel",
        "subtitle": "Aplikacja do zarządzania domowym budżetem — kategorie wydatków i raporty. Laravel, MySQL; działająca wersja demo online.",
        "image": "/assets/projects/keep-wallet.png",
        "tags": ["Laravel", "MySQL", "Reports"],
        "links": [
          {
            "title": "Strona",
            "url": "https://budget.sebastian-kostecki.profesjonalnyprogramista.pl/",
            "primary": true
          },
          {
            "title": "GitHub",
            "url": "https://github.com/sebastian-kostecki/keep-wallet"
          }
        ]
      },
      {
        "title": "O Nią & O Niego",
        "subtitle": "Mobilna aplikacja wspierająca modlitwę o przyszłego męża lub żonę — treści i narzędzia duchowe w jednym miejscu. Ionic, Vue.",
        "image": "/assets/projects/o-nia-o-niego.jpg",
        "tags": ["Ionic", "Vue", "Capacitor"],
        "links": [
          {
            "title": "GitHub",
            "url": "https://github.com/sebastian-kostecki/o-nia-o-niego",
            "primary": true
          }
        ]
      },
      {
        "title": "Menu Maker",
        "subtitle": "Planowanie tygodniowych posiłków z AI, skalowaniem składników i eksportem PDF. Laravel, Vue, Inertia.",
        "image": "/assets/projects/menu-maker.png",
        "placeholderIndex": 2,
        "badge": "wip",
        "tags": ["Laravel", "Vue", "Inertia.js", "AI"],
        "links": [
          {
            "title": "GitHub",
            "url": "https://github.com/sebastian-kostecki/menu-maker",
            "primary": true
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 4: Add the equivalent English metadata and content**

In `src/content/en.json`, set `routes.projects.description` to:

```json
"Selected commercial work: PanelAlpha, independently built WHMCS modules for ModulesGarden, and personal projects."
```

Replace the complete `projects` object with the same keys and arrays as Polish, using:

```json
"projects": {
  "index": "03 / Projects",
  "title": "Selected projects",
  "subtitle": "Products and tools I have developed commercially, supported by selected personal projects.",
  "featured": {
    "eyebrow": "Flagship commercial project",
    "title": "PanelAlpha",
    "description": "A production B2B platform that automates WordPress management for hosting companies and agencies.",
    "contributionTitle": "My contribution",
    "responsibilities": [
      "Laravel backend and platform API development",
      "Hosting, DNS, email, SSL, backup, and storage integrations",
      "WordPress instance lifecycle and Git support",
      "WHMCS integration and related billing logic",
      "Vue.js and Vuetify for features spanning backend and UI"
    ],
    "tags": ["PHP", "Laravel", "MySQL", "Vue.js", "Vuetify", "WHMCS"],
    "link": {
      "title": "View PanelAlpha",
      "url": "https://panelalpha.com",
      "primary": true
    }
  },
  "commercialGroup": {
    "eyebrow": "Commercial work",
    "title": "WHMCS modules for ModulesGarden",
    "description": "Tools extending billing, automation, and infrastructure workflows in WHMCS.",
    "authorship": "I independently implemented each module below while working for ModulesGarden.",
    "compactLabel": "independently implemented WHMCS modules",
    "tags": ["PHP", "HTML", "CSS", "JavaScript", "jQuery", "Smarty", "WHMCS"],
    "items": [
      {
        "title": "Domain Data From Plesk",
        "description": "Exposes Plesk domain data in workflows handled through WHMCS."
      },
      {
        "title": "Invoice Sub Status",
        "description": "Extends invoice handling with more granular statuses."
      },
      {
        "title": "Automated Refunds",
        "description": "Automates refund processing in WHMCS."
      },
      {
        "title": "Auto Upgrade For Early Payments For WHMCS",
        "description": "Automates the configured upgrade flow for early payments."
      },
      {
        "title": "BulkUpdater",
        "description": "Supports bulk updates of records in WHMCS."
      }
    ]
  },
  "personal": {
    "index": "03.3 / Personal projects",
    "title": "Personal projects",
    "subtitle": "Smaller products where I develop ideas and explore tools outside commercial work.",
    "items": [
      {
        "title": "Ogarniam Portfel",
        "subtitle": "A household budget app with spending categories and reports. Laravel, MySQL — live demo online.",
        "image": "/assets/projects/keep-wallet.png",
        "tags": ["Laravel", "MySQL", "Reports"],
        "links": [
          {
            "title": "Website",
            "url": "https://budget.sebastian-kostecki.profesjonalnyprogramista.pl/",
            "primary": true
          },
          {
            "title": "GitHub",
            "url": "https://github.com/sebastian-kostecki/keep-wallet"
          }
        ]
      },
      {
        "title": "O Nią & O Niego",
        "subtitle": "A mobile app that supports prayer for a future spouse — spiritual content and tools in one place. Ionic, Vue.",
        "image": "/assets/projects/o-nia-o-niego.jpg",
        "tags": ["Ionic", "Vue", "Capacitor"],
        "links": [
          {
            "title": "GitHub",
            "url": "https://github.com/sebastian-kostecki/o-nia-o-niego",
            "primary": true
          }
        ]
      },
      {
        "title": "Menu Maker",
        "subtitle": "Weekly meal planning with AI, ingredient scaling, and PDF export. Laravel, Vue, Inertia.",
        "image": "/assets/projects/menu-maker.png",
        "placeholderIndex": 2,
        "badge": "wip",
        "tags": ["Laravel", "Vue", "Inertia.js", "AI"],
        "links": [
          {
            "title": "GitHub",
            "url": "https://github.com/sebastian-kostecki/menu-maker",
            "primary": true
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 5: Keep both views compiling during the schema migration**

In both `src/views/HomeView.vue` and `src/views/ProjectsView.vue`, temporarily replace:

```vue
content.projects.items
```

with:

```vue
content.projects.personal.items
```

This is an intermediate compatibility change; Task 4 replaces the Home personal-project loop completely and adds the personal section heading on `/projects`.

- [ ] **Step 6: Verify the bilingual contract**

Run:

```bash
npm run type-check
```

Expected: exit code 0 with no missing `projects.items` property errors.

- [ ] **Step 7: Commit the content migration**

```bash
git add src/types/content.ts src/content/pl.json src/content/en.json src/views/HomeView.vue src/views/ProjectsView.vue
git commit -m "feat: restructure portfolio project content"
```

---

### Task 2: Build the PanelAlpha flagship component

**Files:**
- Create: `src/components/ui/PanelAlphaFeature.vue`

**Interfaces:**
- Consumes: `FeaturedProject` from `@/types/content`.
- Props: `{ project: FeaturedProject; compact?: boolean }`.
- Behavior: full mode renders contribution areas; compact mode omits them while preserving the product summary, tags, and link.

- [ ] **Step 1: Create the component**

Create `src/components/ui/PanelAlphaFeature.vue`:

```vue
<script setup lang="ts">
import { ArrowUpRight, Check } from '@lucide/vue'
import type { FeaturedProject } from '@/types/content'

withDefaults(
  defineProps<{
    project: FeaturedProject
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)
</script>

<template>
  <article class="panel panel-hover relative overflow-hidden rounded-md p-6 sm:p-8">
    <div
      aria-hidden="true"
      class="absolute top-0 right-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
    />

    <div class="relative">
      <p class="font-mono text-xs tracking-[0.25em] text-primary uppercase">
        {{ project.eyebrow }}
      </p>

      <div class="mt-4 grid gap-8" :class="compact ? '' : 'lg:grid-cols-[1fr_1.15fr]'">
        <div>
          <h3 class="font-mono text-2xl font-bold text-card-foreground sm:text-3xl">
            {{ project.title }}
          </h3>
          <p class="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            {{ project.description }}
          </p>

          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="rounded-sm border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-secondary-foreground"
            >
              {{ tag }}
            </span>
          </div>

          <a
            v-if="project.link?.url"
            :href="project.link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary mt-7"
          >
            {{ project.link.title }}
            <ArrowUpRight class="h-4 w-4" />
          </a>
        </div>

        <div v-if="!compact">
          <p class="font-mono text-sm font-semibold text-foreground">
            {{ project.contributionTitle }}
          </p>
          <ul class="mt-4 grid gap-3">
            <li
              v-for="responsibility in project.responsibilities"
              :key="responsibility"
              class="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <Check class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{{ responsibility }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>
```

- [ ] **Step 2: Format and type-check the component**

Run:

```bash
npx prettier --write src/components/ui/PanelAlphaFeature.vue
npm run type-check
```

Expected: Prettier reports the file as formatted and type-check exits 0.

- [ ] **Step 3: Commit the flagship component**

```bash
git add src/components/ui/PanelAlphaFeature.vue
git commit -m "feat: add PanelAlpha flagship project component"
```

---

### Task 3: Build the grouped WHMCS module components

**Files:**
- Create: `src/components/ui/CommercialProjectItem.vue`
- Create: `src/components/ui/CommercialProjectGroup.vue`

**Interfaces:**
- `CommercialProjectItem.vue` consumes `{ item: CommercialProjectItem; index: string }`.
- `CommercialProjectGroup.vue` consumes `{ group: CommercialProjectGroup; compact?: boolean }`.
- Full mode delegates every item to `CommercialProjectItem`; compact mode shows only module count, shared context, authorship, and shared tags.

- [ ] **Step 1: Create the leaf module component**

Create `src/components/ui/CommercialProjectItem.vue`:

```vue
<script setup lang="ts">
import type { CommercialProjectItem } from '@/types/content'

defineProps<{
  item: CommercialProjectItem
  index: string
}>()
</script>

<template>
  <article class="rounded-md border border-border/70 bg-secondary/30 p-4">
    <div class="flex items-start gap-3">
      <span class="mt-0.5 font-mono text-xs tracking-[0.15em] text-primary">{{ index }}</span>
      <div>
        <h4 class="font-mono text-sm font-semibold text-card-foreground">{{ item.title }}</h4>
        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ item.description }}</p>
      </div>
    </div>
  </article>
</template>
```

- [ ] **Step 2: Create the grouped commercial component**

Create `src/components/ui/CommercialProjectGroup.vue`:

```vue
<script setup lang="ts">
import CommercialProjectItem from '@/components/ui/CommercialProjectItem.vue'
import type { CommercialProjectGroup } from '@/types/content'

withDefaults(
  defineProps<{
    group: CommercialProjectGroup
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

function itemIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <section class="panel rounded-md p-6 sm:p-8">
    <p class="font-mono text-xs tracking-[0.25em] text-primary uppercase">
      {{ group.eyebrow }}
    </p>

    <div class="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div class="max-w-2xl">
        <h3 class="font-mono text-xl font-bold text-card-foreground sm:text-2xl">
          {{ group.title }}
        </h3>
        <p class="mt-3 leading-relaxed text-muted-foreground">{{ group.description }}</p>
        <p class="mt-4 text-sm font-medium text-foreground">{{ group.authorship }}</p>
      </div>

      <div v-if="compact" class="shrink-0 border-l-2 border-primary pl-4">
        <p class="font-mono text-3xl font-bold text-primary">{{ group.items.length }}</p>
        <p class="mt-1 max-w-52 text-sm text-muted-foreground">{{ group.compactLabel }}</p>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <span
        v-for="tag in group.tags"
        :key="tag"
        class="rounded-sm border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-secondary-foreground"
      >
        {{ tag }}
      </span>
    </div>

    <div v-if="!compact" class="mt-7 grid gap-3 md:grid-cols-2">
      <CommercialProjectItem
        v-for="(item, index) in group.items"
        :key="item.title"
        :item="item"
        :index="itemIndex(index)"
      />
    </div>
  </section>
</template>
```

- [ ] **Step 3: Format and type-check both components**

Run:

```bash
npx prettier --write src/components/ui/CommercialProjectItem.vue src/components/ui/CommercialProjectGroup.vue
npm run type-check
```

Expected: both files are formatted and type-check exits 0.

- [ ] **Step 4: Commit the grouped module presentation**

```bash
git add src/components/ui/CommercialProjectItem.vue src/components/ui/CommercialProjectGroup.vue
git commit -m "feat: add grouped WHMCS project presentation"
```

---

### Task 4: Compose the commercial hierarchy on Home and Projects

**Files:**
- Modify: `src/views/HomeView.vue:1-18,114-139`
- Modify: `src/views/ProjectsView.vue:1-32`

**Interfaces:**
- Consumes: `content.projects.featured`, `content.projects.commercialGroup`, and `content.projects.personal`.
- Home uses `compact` on both commercial components.
- Projects uses full commercial components and passes only `personal.items` to `ProjectCard`.

- [ ] **Step 1: Replace Home imports and remove personal-project indexing**

At the top of `src/views/HomeView.vue`, remove:

```ts
import ProjectCard from '@/components/ui/ProjectCard.vue'
```

Add:

```ts
import PanelAlphaFeature from '@/components/ui/PanelAlphaFeature.vue'
import CommercialProjectGroup from '@/components/ui/CommercialProjectGroup.vue'
```

Delete:

```ts
function projectIndex(i: number) {
  return String(i + 1).padStart(2, '0')
}
```

- [ ] **Step 2: Replace the Home project-card grid with the commercial preview**

In the Projects section of `src/views/HomeView.vue`, keep the existing `SectionHeading` and “See all projects” link, but replace the personal-project grid with:

```vue
<div class="space-y-5">
  <PanelAlphaFeature :project="content.projects.featured" compact />
  <CommercialProjectGroup :group="content.projects.commercialGroup" compact />
</div>
```

The complete section body between `SectionHeading` and the existing link is now the two-component commercial preview. There must be no `ProjectCard` loop on Home.

- [ ] **Step 3: Compose the complete Projects page**

Replace `src/views/ProjectsView.vue` with:

```vue
<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import PanelAlphaFeature from '@/components/ui/PanelAlphaFeature.vue'
import CommercialProjectGroup from '@/components/ui/CommercialProjectGroup.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()

function projectIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="gradient-hero absolute inset-x-0 top-0 h-80" />
    <div class="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        :index="content.projects.index"
        :title="content.projects.title"
        :subtitle="content.projects.subtitle"
      />

      <div class="space-y-6">
        <PanelAlphaFeature :project="content.projects.featured" />
        <CommercialProjectGroup :group="content.projects.commercialGroup" />
      </div>

      <section class="mt-24" aria-labelledby="personal-projects-heading">
        <SectionHeading
          heading-id="personal-projects-heading"
          :index="content.projects.personal.index"
          :title="content.projects.personal.title"
          :subtitle="content.projects.personal.subtitle"
        />

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            v-for="(project, index) in content.projects.personal.items"
            :key="project.title"
            :project="project"
            :index="projectIndex(index)"
          />
        </div>
      </section>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Format and type-check both views**

Run:

```bash
npx prettier --write src/views/HomeView.vue src/views/ProjectsView.vue
npm run type-check
```

Expected: both views are formatted; type-check exits 0; no references to `content.projects.items` remain.

- [ ] **Step 5: Verify obsolete flat-project access is gone**

Run:

```bash
rg "content\\.projects\\.items" src
```

Expected: no matches.

- [ ] **Step 6: Commit the page composition**

```bash
git add src/views/HomeView.vue src/views/ProjectsView.vue
git commit -m "feat: prioritize commercial work across portfolio pages"
```

---

### Task 5: Run final automated and responsive verification

**Files:**
- Verify: `src/types/content.ts`
- Verify: `src/content/pl.json`
- Verify: `src/content/en.json`
- Verify: `src/components/ui/PanelAlphaFeature.vue`
- Verify: `src/components/ui/CommercialProjectItem.vue`
- Verify: `src/components/ui/CommercialProjectGroup.vue`
- Verify: `src/views/HomeView.vue`
- Verify: `src/views/ProjectsView.vue`

**Interfaces:**
- Verifies the complete PL/EN project hierarchy and production build.
- Produces no new runtime interface.

- [ ] **Step 1: Format all changed source files**

Run:

```bash
npx prettier --write src/types/content.ts src/content/pl.json src/content/en.json src/components/ui/PanelAlphaFeature.vue src/components/ui/CommercialProjectItem.vue src/components/ui/CommercialProjectGroup.vue src/views/HomeView.vue src/views/ProjectsView.vue
```

Expected: Prettier completes without errors.

- [ ] **Step 2: Run lint, type-check, and production build**

Run:

```bash
npm run lint
npm run type-check
npm run build
```

Expected: all three commands exit 0; Vite emits the production bundle to `dist/`.

- [ ] **Step 3: Start the preview for manual verification**

Run:

```bash
npm run dev -- --host 0.0.0.0
```

Expected: Vite reports a local development URL and remains running.

- [ ] **Step 4: Verify Polish Home and Projects**

At the reported URL:

- Home shows PanelAlpha first, then a compact ModulesGarden panel with the number `5`.
- Home does not show Ogarniam Portfel, O Nią & O Niego, or Menu Maker.
- `/projects` shows the full PanelAlpha contribution list.
- `/projects` shows exactly five non-clickable WHMCS module entries.
- Personal projects appear below commercial work with their original links.
- The PanelAlpha CTA opens `https://panelalpha.com` in a new tab.
- No empty image container or CTA appears in either commercial panel.

- [ ] **Step 5: Verify English and responsive behavior**

Switch to EN and verify:

- The route stays `/projects`.
- All commercial and personal headings and descriptions change to English.
- The hierarchy and module count remain unchanged.
- At approximately 375 px width, text and buttons do not overflow.
- At approximately 768 px width, module entries use two columns where space permits.
- At approximately 1280 px width, PanelAlpha remains visually dominant and contribution content is readable.

- [ ] **Step 6: Review the final diff and commit formatting fixes if any**

Run:

```bash
git status --short
git diff --check
git diff
```

Expected: `git diff --check` produces no output. If formatting or lint changed tracked source files after Task 4, commit only those verified changes:

```bash
git add src/types/content.ts src/content/pl.json src/content/en.json src/components/ui/PanelAlphaFeature.vue src/components/ui/CommercialProjectItem.vue src/components/ui/CommercialProjectGroup.vue src/views/HomeView.vue src/views/ProjectsView.vue
git commit -m "chore: finalize commercial projects presentation"
```

If `git status --short` is empty, do not create an empty commit.
