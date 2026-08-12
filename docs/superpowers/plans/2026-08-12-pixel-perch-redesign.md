# Pixel-perch Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild kostecki.dev as a multi-page Vue SPA that faithfully mirrors project-pixel-perch’s layout and components, while keeping the Crimson palette, PL/EN JSON content, real portfolio data, CV download, and mailto to `kontakt@kostecki.dev`.

**Architecture:** Vue 3 + Vue Router (new routes `/`, `/projects`, `/skills`, `/contact`). Content stays JSON-driven via `useContent` / `useLocale`. Pixel-perch React components are ported to Vue SFCs; CSS utilities (`gradient-hero`, `grid-lines`, `panel`, etc.) are recreated with crimson tokens. Old single-page section chrome is replaced.

**Tech Stack:** Vue 3 (`<script setup>`, TS), Vue Router 5, Tailwind CSS v4, `@iconify/vue`, `@lucide/vue`, Vite. No new runtime dependencies for mail. Fonts: JetBrains Mono + Work Sans.

## Global Constraints

- Keep Crimson colors from the design spec (`#0c0c0e`, `#141416`, `#e63946`, `#ff4d5a`, `#ff6b75`, `#a1a1aa`).
- Keep bilingual `pl.json` / `en.json` + `useLocale` / `useContent`.
- Contact email must be `kontakt@kostecki.dev` via `mailto:` only (no form).
- Header brand: `</>` + `kostecki.dev`; keep CV button when `cv.href` is non-empty.
- Hero must include `hero.name` as a brand-level signal (not value-prop-only like pixel-perch).
- Faithful visual port of pixel-perch (including crimson glow on `panel-hover`).
- Do not migrate to React / TanStack Start.
- Spec: `docs/superpowers/specs/2026-08-12-pixel-perch-redesign-design.md`
- Reference clone (if available): `/tmp/project-pixel-perch` or https://github.com/sebastian-kostecki/project-pixel-perch

---

## Verification model (read first)

This project has **no test framework** (none installed; adding one is out of scope — YAGNI for a static landing redesign). Each task is verified with:

- `pnpm type-check` → expected: no TS errors.
- `pnpm lint` → expected: completes with no errors (use `--fix` if the project scripts auto-fix).
- A manual visual check on `pnpm dev` — what to look for is stated per task.

Run `pnpm build` once at the end (Task 10).

Commit after each task. Use Conventional Commits (`feat:`, `refactor:`, `style:`, `chore:`).

---

## File Structure

**Create:**
- `src/views/HomeView.vue` — home page (hero → about → experience → featured projects → core stack → contact CTA)
- `src/views/ProjectsView.vue` — full projects grid
- `src/views/SkillsView.vue` — full skills by category
- `src/views/ContactView.vue` — social mailto rows + CV
- `src/views/NotFoundView.vue` — bilingual 404
- `src/components/ui/AtAGlancePanel.vue` — hero stats panel
- `src/components/ui/ExperienceCard.vue` — timeline experience card (pixel-perch port)
- `src/components/ui/SkillBadge.vue` — skill row with Iconify/image
- `src/components/ui/SocialLinkRow.vue` — contact social row (name avoids clash with `SocialLink` type)

**Modify:**
- `src/types/content.ts` — multi-page nav, route meta, remove `command`, add `valuePropAccent`, project `tags`, UI strings
- `src/content/pl.json` / `src/content/en.json` — match new schema; email; GitHub contact method; tags
- `src/assets/main.css` — crimson × pixel-perch tokens + utilities; drop Outfit/Plus Jakarta
- `index.html` — Work Sans + JetBrains Mono only
- `src/router/index.ts` — define routes
- `src/main.ts` — `app.use(router)`
- `src/App.vue` — shell with `<RouterView />`, meta from route + locale
- `src/components/layout/SiteHeader.vue` — pixel-perch header port
- `src/components/layout/SiteFooter.vue` — pixel-perch footer port
- `src/components/ui/SectionHeading.vue` — index / title / subtitle / centered
- `src/components/ui/ProjectCard.vue` — panel card port
- `src/components/ui/LanguageSwitcher.vue` — restyle to match header (keep behavior)

**Delete after nothing imports them:**
- `src/components/sections/*.vue` (Hero, About, Experience, Skills, Projects, Contact)
- `src/components/ui/BrandMark.vue`, `MetricBar.vue`, `ContactCard.vue`, `SkillCategory.vue`, `SkillIcon.vue` (if unused)
- Dead utilities tied only to Crimson Engineer terminal chrome (`cmd-label`, old `blueprint-grid` if replaced by `grid-lines`)

---

### Task 1: Content schema + JSON

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/content/pl.json`
- Modify: `src/content/en.json`

**Interfaces:**
- Produces: updated `SiteContent` used by all later views

- [ ] **Step 1: Replace `src/types/content.ts` with:**

```ts
export interface NavItem {
  to: string
  label: string
  index: string
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
  level?: string
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
  badge?: 'wip'
  tags: string[]
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

export interface RouteMetaCopy {
  title: string
  description: string
}

export interface SiteContent {
  meta: {
    title: string
    description: string
    lang: string
  }
  routes: {
    home: RouteMetaCopy
    projects: RouteMetaCopy
    skills: RouteMetaCopy
    contact: RouteMetaCopy
    notFound: RouteMetaCopy
  }
  ui: {
    skipToContent: string
    languageLabel: string
    downloadCv: string
    expand: string
    collapse: string
    homeLabel: string
    navLabel: string
    projectCardLabel: string
    wipBadge: string
    projectScreenshotAlt: string
    openMenu: string
    closeMenu: string
    atAGlance: string
    seeAllProjects: string
    exploreAllSkills: string
    viewMyWork: string
    liveDemo: string
    sourceCode: string
    backHome: string
    notFoundTitle: string
    notFoundBody: string
    brandName: string
    footerTagline: string
    footerStack: string
  }
  nav: NavItem[]
  hero: {
    label: string
    name: string
    valueProp: string
    valuePropAccent: string
    subtitle?: string
    metrics: MetricItem[]
    ctaPrimary: CtaLink
    techTags: string[]
  }
  cv: {
    href: string
  }
  about: {
    index: string
    title: string
    paragraphs: string[]
  }
  experience: {
    index: string
    title: string
    subtitle: string
    entries: ExperienceEntry[]
  }
  skills: {
    index: string
    title: string
    subtitle: string
    coreTitle: string
    coreDescription: string
    core: SkillItem[]
    categories: SkillCategory[]
  }
  projects: {
    index: string
    title: string
    subtitle: string
    items: Project[]
  }
  contact: {
    index: string
    title: string
    subtitle: string
    methods: ContactMethod[]
    ctaHeadline: string
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

- [ ] **Step 2: Update both JSON files to match**

Key content changes (apply to PL and EN mirrors):

1. Replace `nav` with route-based items:
   - PL: `{ "to": "/", "label": "Start", "index": "01" }`, Projects `02`, Skills `03`, Contact `04`
   - EN: Home / Projects / Skills / Contact with same indexes
2. Add `routes.*` meta titles/descriptions for home, projects, skills, contact, notFound.
3. Hero: add `valuePropAccent` (EN: `"production PHP backends."`; PL: `"produkcyjne aplikacje backendowe w PHP."`) and keep `valueProp` as the leading clause (EN: `"I build and maintain"`; PL: `"Buduję i rozwijam"`). Add `techTags`: `["PHP","Laravel","MySQL","Docker","Vue.js"]`.
4. Change `ctaPrimary.href` to `/contact` (in-app path; label stays “Porozmawiajmy” / “Let's talk”).
5. Remove all `command` fields; add `index` / `subtitle` on about, experience, skills, projects, contact (e.g. about index `"01 / About"` / `"01 / O mnie"`).
6. Add optional `level` on core skills if useful (can omit; SkillBadge supports optional level).
7. Add `tags` to each project (derive from existing copy), e.g.:
   - Ogarniam Portfel: `["Laravel","MySQL","Reports"]`
   - O Nią & O Niego: `["Ionic","Vue","Capacitor"]`
   - Menu Maker: `["Laravel","Vue","Inertia.js","AI"]`
8. Contact methods: LinkedIn, GitHub (`https://github.com/sebastian-kostecki`, value `github.com/sebastian-kostecki`), Email `kontakt@kostecki.dev` / `mailto:kontakt@kostecki.dev`.
9. UI strings: `atAGlance`, `seeAllProjects`, `exploreAllSkills`, `viewMyWork`, `liveDemo`, `sourceCode`, `backHome`, `notFoundTitle`, `notFoundBody`, `brandName` (`kostecki.dev`), `footerTagline`, `footerStack` (`Laravel · PHP · Docker`).
10. Keep substantive paragraphs, experience entries, skill lists, footer services/social unchanged aside from schema renames.

- [ ] **Step 3: Verify**

Run: `pnpm type-check`  
Expected: FAIL or PASS depending on components still expecting old shape — if components break type-check, that is OK only if you immediately continue; prefer fixing types first so Task 1 ends with either clean type-check after temporarily casting unused old components, or accept that Task 2+ will rewrite them. **Target for Task 1:** JSON and types aligned; if `vue-tsc` fails on old SFCs, proceed to Task 2 without committing broken types — instead finish Task 1 commit only when types+JSON parse and `useContent` still compiles (old SFCs may error until later tasks).

Practical approach: after JSON/types update, run `pnpm type-check`. If old sections fail, leave them for Task 7–9 deletion; commit types+JSON when JSON is valid and `content.ts` matches. Do not leave `as any` permanently.

- [ ] **Step 4: Commit**

```bash
git add src/types/content.ts src/content/pl.json src/content/en.json
git commit -m "$(cat <<'EOF'
feat: extend content schema for multi-page pixel-perch redesign

EOF
)"
```

---

### Task 2: Design tokens, fonts, CSS utilities

**Files:**
- Modify: `src/assets/main.css`
- Modify: `index.html`

**Interfaces:**
- Produces: Tailwind tokens `bg-background`, `text-primary`, utilities `gradient-hero`, `grid-lines`, `panel`, `panel-hover`, `text-gradient`, `rule-accent`

- [ ] **Step 1: Update Google Fonts link in `index.html`**

Replace the fonts `<link href=...>` with:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Replace `src/assets/main.css` with crimson × pixel-perch tokens**

```css
@import 'tailwindcss';

@theme {
  --color-background: #0c0c0e;
  --color-foreground: #ffffff;
  --color-card: #141416;
  --color-card-foreground: #ffffff;
  --color-primary: #e63946;
  --color-primary-foreground: #ffffff;
  --color-primary-glow: #ff6b75;
  --color-secondary: #1a1a1e;
  --color-secondary-foreground: #ffffff;
  --color-muted: #1a1a1e;
  --color-muted-foreground: #a1a1aa;
  --color-accent: #e63946;
  --color-accent-hover: #ff4d5a;
  --color-border: rgb(255 255 255 / 0.1);
  --color-bg: #0c0c0e;
  --font-sans: 'Work Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-body: 'Work Sans', ui-sans-serif, system-ui, sans-serif;
  --radius: 0.25rem;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  body {
    @apply bg-background font-sans text-foreground antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-mono);
    letter-spacing: -0.02em;
  }

  ::selection {
    @apply bg-primary/30 text-foreground;
  }
}

@utility gradient-hero {
  background:
    radial-gradient(ellipse 70% 55% at 15% -10%, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent 70%),
    radial-gradient(ellipse 60% 50% at 90% 10%, color-mix(in oklab, var(--color-primary-glow) 16%, transparent), transparent 70%);
}

@utility grid-lines {
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent 85%);
}

@utility panel {
  background: linear-gradient(
    160deg,
    color-mix(in oklab, var(--color-card) 92%, var(--color-primary) 8%),
    var(--color-card)
  );
  border: 1px solid var(--color-border);
  box-shadow: inset 0 1px 0 0 color-mix(in oklab, var(--color-foreground) 6%, transparent);
}

@utility panel-hover {
  transition:
    border-color 200ms ease,
    box-shadow 250ms ease,
    transform 250ms ease;
  &:hover {
    border-color: color-mix(in oklab, var(--color-primary) 45%, transparent);
    box-shadow: 0 20px 60px -25px color-mix(in oklab, var(--color-primary) 65%, transparent);
    transform: translateY(-2px);
  }
}

@utility text-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-glow));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@utility rule-accent {
  background: linear-gradient(
    to right,
    color-mix(in oklab, var(--color-primary) 70%, transparent),
    transparent
  );
}

@layer utilities {
  .container {
    @apply mx-auto w-full max-w-6xl;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 rounded-sm border border-border px-6 py-3 font-mono text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background;
  }

  .skip-link {
    @apply sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-semibold focus:text-primary-foreground;
  }
}
```

If `@utility` is unsupported in this Tailwind setup, convert those blocks to `@layer utilities { .gradient-hero { ... } }` equivalents with the same CSS bodies.

- [ ] **Step 3: Verify**

Run: `pnpm type-check` and `pnpm lint`  
Manual: `pnpm dev` — body uses Work Sans; no missing-font flash for Outfit.

- [ ] **Step 4: Commit**

```bash
git add index.html src/assets/main.css
git commit -m "$(cat <<'EOF'
style: adopt crimson pixel-perch design tokens and fonts

EOF
)"
```

---

### Task 3: Router + App shell

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/main.ts`
- Modify: `src/App.vue`
- Create stub views: `src/views/HomeView.vue`, `ProjectsView.vue`, `SkillsView.vue`, `ContactView.vue`, `NotFoundView.vue` (minimal placeholders OK)

**Interfaces:**
- Produces: named routes `home`, `projects`, `skills`, `contact`; App applies meta from `content.routes[name]`

- [ ] **Step 1: Create minimal view stubs**

Each stub:

```vue
<script setup lang="ts">
import { useContent } from '@/composables/useContent'
const content = useContent()
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-24">
    <h1 class="font-mono text-3xl font-bold">{{ /* page title from content */ }}</h1>
  </div>
</template>
```

Use the appropriate `content.routes.*.title` or section title per view. NotFound uses `content.routes.notFound` + `ui.backHome` linking to `/`.

- [ ] **Step 2: Wire `src/router/index.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import SkillsView from '@/views/SkillsView.vue'
import ContactView from '@/views/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/skills', name: 'skills', component: SkillsView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
```

- [ ] **Step 3: Register router in `src/main.ts`**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 4: Rewrite `src/App.vue` shell**

```vue
<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import { useContent } from '@/composables/useContent'
import { useLocale } from '@/composables/useLocale'

const content = useContent()
const { locale } = useLocale()
const route = useRoute()

function setMetaContent(selector: string, value: string) {
  const element = document.querySelector(selector)
  if (element) element.setAttribute('content', value)
}

const routeMeta = computed(() => {
  const name = route.name
  if (name === 'projects') return content.value.routes.projects
  if (name === 'skills') return content.value.routes.skills
  if (name === 'contact') return content.value.routes.contact
  if (name === 'not-found') return content.value.routes.notFound
  return content.value.routes.home
})

function applyMeta() {
  const { meta } = content.value
  const page = routeMeta.value
  const ogLocale = meta.lang === 'pl' ? 'pl_PL' : 'en_US'
  const title = page.title
  const description = page.description

  document.title = title
  document.documentElement.lang = meta.lang
  setMetaContent('meta[name="description"]', description)
  setMetaContent('meta[property="og:title"]', title)
  setMetaContent('meta[property="og:description"]', description)
  setMetaContent('meta[property="og:locale"]', ogLocale)
  setMetaContent('meta[name="twitter:title"]', title)
  setMetaContent('meta[name="twitter:description"]', description)
}

onMounted(applyMeta)
watch([locale, routeMeta], applyMeta)
</script>

<template>
  <a href="#main-content" class="skip-link">{{ content.ui.skipToContent }}</a>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main id="main-content" class="flex-1">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
```

Temporarily keep old `SiteHeader`/`SiteFooter` compiling (they may still use hash nav). If they break type-check due to `nav.id`, patch them minimally to compile (e.g. empty header) — full rewrite is Task 4.

- [ ] **Step 5: Verify**

Run: `pnpm type-check`, `pnpm lint`  
Manual: visit `/`, `/projects`, `/skills`, `/contact`, `/nope` — stubs render; title changes.

- [ ] **Step 6: Commit**

```bash
git add src/router/index.ts src/main.ts src/App.vue src/views
git commit -m "$(cat <<'EOF'
feat: add multi-page vue router shell

EOF
)"
```

---

### Task 4: Header, Footer, SectionHeading, LanguageSwitcher

**Files:**
- Modify: `src/components/layout/SiteHeader.vue`
- Modify: `src/components/layout/SiteFooter.vue`
- Modify: `src/components/ui/SectionHeading.vue`
- Modify: `src/components/ui/LanguageSwitcher.vue`

**Interfaces:**
- Consumes: `content.nav`, `content.ui`, `content.cv`, `content.footer`
- Produces: chrome matching pixel-perch Header/Footer + indexed SectionHeading

- [ ] **Step 1: Rewrite `SectionHeading.vue`**

Props: `title: string`, `subtitle?: string`, `index?: string`, `centered?: boolean`, optional `headingId?: string`.

Port markup from `/tmp/project-pixel-perch/src/components/SectionHeading.tsx` (index + `rule-accent` + mono `h2` + subtitle). Use `text-primary`, `text-muted-foreground`, `font-mono`.

- [ ] **Step 2: Rewrite `SiteHeader.vue`**

Port from pixel-perch `Header.tsx`:

- Sticky, `border-b border-border/60 bg-background/70 backdrop-blur-xl`
- Brand link to `/`: box with `</>` + `content.ui.brandName`
- Desktop nav: `RouterLink` for each `content.nav` item with `index` + `label`; active state from `useRoute().path`
- `LanguageSwitcher` + CV `<a>` when `content.cv.href` non-empty (`target="_blank"`, label `content.ui.downloadCv`)
- Mobile menu button using `content.ui.openMenu` / `closeMenu`; panel with same links

Do **not** use BrandMark.

- [ ] **Step 3: Restyle `LanguageSwitcher.vue`**

Keep locale toggle behavior; visual: mono, compact, fits header (`rounded-sm border border-border`).

- [ ] **Step 4: Rewrite `SiteFooter.vue`**

Port pixel-perch Footer:

- Brand + `content.ui.footerTagline` (or first footer service line)
- Nav links from `content.nav`
- Social icon buttons from `content.footer.social` (Iconify icons already in data)
- Copyright year + `content.footer.copyright`; `content.ui.footerStack`

- [ ] **Step 5: Verify**

Manual: nav highlights per route; PL/EN switch; mobile menu; CV hidden when `cv.href === ""`.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/SiteHeader.vue src/components/layout/SiteFooter.vue src/components/ui/SectionHeading.vue src/components/ui/LanguageSwitcher.vue
git commit -m "$(cat <<'EOF'
feat: port pixel-perch header, footer, and section heading

EOF
)"
```

---

### Task 5: Shared cards (Experience, Project, Skill, Social, AtAGlance)

**Files:**
- Create: `src/components/ui/AtAGlancePanel.vue`
- Create: `src/components/ui/ExperienceCard.vue`
- Create: `src/components/ui/SkillBadge.vue`
- Create: `src/components/ui/SocialLinkRow.vue`
- Modify: `src/components/ui/ProjectCard.vue`

**Interfaces:**
- `AtAGlancePanel`: props `{ metrics: MetricItem[]; techTags: string[]; label: string }`
- `ExperienceCard`: props matching experience entry + `index: string` (e.g. `"01"`)
- `ProjectCard`: props from `Project` + `index: string` + UI labels for demo/source/wip
- `SkillBadge`: `{ name: string; icon?: string; image?: string; level?: string }`
- `SocialLinkRow`: `{ href: string; label: string; value: string; type: ContactMethod['type'] }`

- [ ] **Step 1: Implement each component** by porting the corresponding pixel-perch TSX (`ExperienceCard`, `ProjectCard`, `SkillBadge`, `SocialLink`) to Vue.

Notes:
- Map `text-muted-foreground` → available token; `primary-glow` hover → `text-primary-glow` or `hover:text-[#ff6b75]` if needed.
- `ProjectCard`: derive `demoUrl` from link whose title is Strona/Website/Live (or `primary` non-GitHub); `repoUrl` from GitHub link; `status` from `badge === 'wip'` → `content.ui.wipBadge`.
- `SkillBadge`: render Iconify `<Icon :icon="icon" />` or `<img :src="image">` inside the primary icon box.
- `SocialLinkRow`: map type → Lucide `Linkedin` | `Github` | `Mail` (and Phone if ever used).
- `AtAGlancePanel`: port hero right panel (`panel`, metrics `dl`, tech tags).

- [ ] **Step 2: Verify**

`pnpm type-check` + `pnpm lint`. Smoke-import components in a stub if needed.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/AtAGlancePanel.vue src/components/ui/ExperienceCard.vue src/components/ui/SkillBadge.vue src/components/ui/SocialLinkRow.vue src/components/ui/ProjectCard.vue
git commit -m "$(cat <<'EOF'
feat: add pixel-perch card components in vue

EOF
)"
```

---

### Task 6: HomeView (full)

**Files:**
- Modify: `src/views/HomeView.vue`

**Interfaces:**
- Consumes: all home-related content + components from Tasks 4–5

- [ ] **Step 1: Implement HomeView** mirroring `/tmp/project-pixel-perch/src/routes/index.tsx` structure with these differences from the reference:

1. Hero H1 stack: `hero.name` (brand) then line with `hero.valueProp` + `<span class="text-gradient">{{ hero.valuePropAccent }}</span>`
2. Primary CTA: `RouterLink` to `/contact` with `hero.ctaPrimary.label`
3. Secondary CTA: `RouterLink` to `/projects` with `ui.viewMyWork`
4. `AtAGlancePanel` with metrics + techTags + `ui.atAGlance`
5. About / Experience / Projects / Stack / Contact CTA sections with indexes from content
6. Featured projects: all `projects.items` (3) or `.slice(0, 3)`
7. Core stack: `skills.core` via `SkillBadge`
8. Contact CTA uses `contact.ctaHeadline` + button to `/contact`

Use `border-t border-border/60`, `gradient-hero`, `grid-lines` as in the reference.

- [ ] **Step 2: Verify**

Manual on `/`: composition matches pixel-perch; name visible; crimson glow/gradient; CTAs navigate.

- [ ] **Step 3: Commit**

```bash
git add src/views/HomeView.vue
git commit -m "$(cat <<'EOF'
feat: implement pixel-perch home page

EOF
)"
```

---

### Task 7: ProjectsView + SkillsView

**Files:**
- Modify: `src/views/ProjectsView.vue`
- Modify: `src/views/SkillsView.vue`

- [ ] **Step 1: ProjectsView**

- Top `gradient-hero` band
- `SectionHeading` with `projects.index/title/subtitle`
- Grid of `ProjectCard` for each `projects.items`
- Do **not** invent commercial-work cards (not in JSON; YAGNI vs pixel-perch sample)

- [ ] **Step 2: SkillsView**

- Top `gradient-hero` band
- Page `SectionHeading` with `skills.index/title/subtitle`
- First block: `skills.coreTitle` + core `SkillBadge` grid
- Then each `skills.categories[]` with category title + count + `SkillBadge` grid (pixel-perch skills page pattern)

- [ ] **Step 3: Verify**

Manual `/projects` and `/skills` in PL and EN; all skills from JSON visible.

- [ ] **Step 4: Commit**

```bash
git add src/views/ProjectsView.vue src/views/SkillsView.vue
git commit -m "$(cat <<'EOF'
feat: implement projects and skills pages

EOF
)"
```

---

### Task 8: ContactView + NotFoundView

**Files:**
- Modify: `src/views/ContactView.vue`
- Modify: `src/views/NotFoundView.vue`

- [ ] **Step 1: ContactView**

Port pixel-perch contact page:

- `gradient-hero` + `grid-lines` top
- Centered `SectionHeading` (`contact.index/title/subtitle`)
- Stack of `SocialLinkRow` for each `contact.methods`
- CV button below when `cv.href` set

Confirm email row shows `kontakt@kostecki.dev` and `href` is `mailto:kontakt@kostecki.dev`.

- [ ] **Step 2: NotFoundView**

Centered mono `404`, `ui.notFoundTitle`, `ui.notFoundBody`, `RouterLink` home with `ui.backHome`.

- [ ] **Step 3: Verify**

Manual: mailto opens; LinkedIn/GitHub work; `/missing` 404 in both locales.

- [ ] **Step 4: Commit**

```bash
git add src/views/ContactView.vue src/views/NotFoundView.vue
git commit -m "$(cat <<'EOF'
feat: implement contact mailto page and 404

EOF
)"
```

---

### Task 9: Delete dead Crimson Engineer components

**Files:**
- Delete unused: `src/components/sections/*`, and unused UI (`BrandMark.vue`, `MetricBar.vue`, `ContactCard.vue`, `SkillCategory.vue`, `SkillIcon.vue`, `RevealOnScroll.vue` if unused)
- Remove unused composables only if nothing imports them (`useScrollReveal.ts`)
- Grep for leftover imports of removed files

- [ ] **Step 1: Grep and delete**

```bash
rg -n "sections/|BrandMark|MetricBar|ContactCard|SkillCategory|SkillIcon|RevealOnScroll|useScrollReveal|cmd-label|blueprint-grid|font-display" src
```

Delete files with zero references. Fix any stragglers.

- [ ] **Step 2: Verify**

`pnpm type-check` && `pnpm lint` — clean.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor: remove obsolete single-page section components

EOF
)"
```

---

### Task 10: Final verification

- [ ] **Step 1: Full checks**

```bash
pnpm type-check
pnpm lint
pnpm build
```

Expected: all succeed; `dist/` emitted.

- [ ] **Step 2: Manual QA checklist**

- `/` hero: name + accent gradient + at-a-glance + CTAs
- `/projects`, `/skills`, `/contact` match pixel-perch structure with crimson
- Header `</>` + `kostecki.dev`; nav indexes; mobile menu
- PL ↔ EN on every route; document title updates
- Email is `kontakt@kostecki.dev` mailto
- CV button hidden with empty `cv.href`
- 404 page works
- Reduced motion: no broken layout (spot-check)

- [ ] **Step 3: Commit only if Step 1–2 caused fixes**; otherwise done.

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Multi-page IA `/` `/projects` `/skills` `/contact` | 3, 6–8 |
| Crimson palette + pixel-perch utilities/glow | 2 |
| JetBrains Mono + Work Sans | 2 |
| `</>` + kostecki.dev header + CV | 4 |
| Hero name brand signal + value prop accent | 6 |
| About / Experience / featured projects / core stack / CTA on home | 6 |
| Full projects & skills pages | 7 |
| Mailto kontakt@kostecki.dev + GitHub + LinkedIn | 1, 8 |
| PL/EN content + per-route meta | 1, 3 |
| 404 bilingual | 8 |
| Remove dead old UI | 9 |
| type-check / lint / build | 10 |
