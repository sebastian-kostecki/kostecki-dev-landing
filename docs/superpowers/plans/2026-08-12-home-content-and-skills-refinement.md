# Home Content and Skills Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove repeated commercial-experience content from Home, move employment context into Projects, and replace the undifferentiated Skills inventory with competency groups and supporting tags.

**Architecture:** Keep JSON-driven bilingual content as the source of truth. Extend commercial project records with explicit employment metadata, add Home-specific project-preview copy, and replace skill-item categories with a focused competency-card model. Home and route views remain composition layers with no title matching or array-position inference.

**Tech Stack:** Vue 3, TypeScript, Vue Router, Tailwind CSS v4, JSON content, Iconify, Lucide, Prettier, ESLint, oxlint, vue-tsc, Vite.

## Global Constraints

- Preserve bilingual Polish and English content with equivalent object structures.
- Preserve the current crimson pixel-perch visual system.
- Keep the existing “How I work” content unchanged in both languages.
- Home must follow this order: Hero, How I work, Selected commercial work, Core stack, Contact CTA.
- Home must show only PHP, Laravel, MySQL, Docker, and Vue.js as skills.
- Commercial employment context belongs on `/projects`; do not add a separate employment timeline.
- PanelAlpha links only to `https://panelalpha.com`.
- ModulesGarden module entries remain non-clickable.
- Cursor remains visible as evidence of an LLM-assisted development workflow, not as a peer of PHP or Laravel.
- Generated code, identifiers, comments, and logs must be written in English.
- Do not add dependencies or a test framework.

---

## File Map

- `src/types/content.ts` — defines employment metadata, Home preview copy, and competency-group content contracts; removes obsolete experience and metric contracts.
- `src/content/pl.json` — supplies approved Polish Home, Projects, Skills, and CTA copy.
- `src/content/en.json` — supplies natural English equivalents with the same structure as Polish.
- `src/components/ui/PanelAlphaFeature.vue` — displays employment context in full mode.
- `src/components/ui/CommercialProjectGroup.vue` — displays employment context in full mode.
- `src/components/ui/SkillCompetencyCard.vue` — renders one competency description and its supporting tags.
- `src/views/HomeView.vue` — implements the approved five-section Home hierarchy.
- `src/views/SkillsView.vue` — composes the core stack and competency cards.
- `src/components/ui/AtAGlancePanel.vue` — delete after removing the only consumer.
- `src/components/ui/ExperienceCard.vue` — delete after removing the only consumer.

---

### Task 1: Put employment context inside commercial projects

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/content/pl.json`
- Modify: `src/content/en.json`
- Modify: `src/components/ui/PanelAlphaFeature.vue`
- Modify: `src/components/ui/CommercialProjectGroup.vue`

**Interfaces:**
- Produces: `CommercialWorkContext`
- Extends: `FeaturedProject.context: CommercialWorkContext`
- Extends: `CommercialProjectGroup.context: CommercialWorkContext`
- Preserves: `PanelAlphaFeature` and `CommercialProjectGroup` props and compact/full modes.

- [ ] **Step 1: Add the required project-context fields to the TypeScript contract**

Add this interface immediately before `FeaturedProject`:

```ts
export interface CommercialWorkContext {
  employer: string
  role: string
  period: string
}
```

Add `context: CommercialWorkContext` after `title` in both `FeaturedProject` and `CommercialProjectGroup`.

- [ ] **Step 2: Run a content assertion to prove both locales are missing the new fields**

Run:

```bash
node --input-type=module -e "import pl from './src/content/pl.json' with { type: 'json' }; import en from './src/content/en.json' with { type: 'json' }; for (const content of [pl,en]) { if (!content.projects.featured.context || !content.projects.commercialGroup.context) throw new Error('Commercial project context missing'); }"
```

Expected: FAIL with `Commercial project context missing`.

- [ ] **Step 3: Add exact bilingual employment metadata**

In `src/content/pl.json`, add to `projects.featured`:

```json
"context": {
  "employer": "ModulesGarden",
  "role": "Backend Developer",
  "period": "3,5+ roku"
},
```

Add to `projects.commercialGroup`:

```json
"context": {
  "employer": "ModulesGarden",
  "role": "PHP Developer",
  "period": "~6 miesięcy"
},
```

In `src/content/en.json`, add to `projects.featured`:

```json
"context": {
  "employer": "ModulesGarden",
  "role": "Backend Developer",
  "period": "3.5+ years"
},
```

Add to `projects.commercialGroup`:

```json
"context": {
  "employer": "ModulesGarden",
  "role": "PHP Developer",
  "period": "~6 months"
},
```

- [ ] **Step 4: Render context in the full PanelAlpha feature**

In `PanelAlphaFeature.vue`, insert this block after the project title. Keep it hidden in compact mode:

```vue
<div
  v-if="!compact"
  class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground"
>
  <span>{{ project.context.employer }}</span>
  <span aria-hidden="true" class="text-primary">/</span>
  <span>{{ project.context.role }}</span>
  <span aria-hidden="true" class="text-primary">/</span>
  <span>{{ project.context.period }}</span>
</div>
```

- [ ] **Step 5: Render context in the full WHMCS group**

In `CommercialProjectGroup.vue`, insert this block after the group title and before the description:

```vue
<div
  v-if="!compact"
  class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground"
>
  <span>{{ group.context.employer }}</span>
  <span aria-hidden="true" class="text-primary">/</span>
  <span>{{ group.context.role }}</span>
  <span aria-hidden="true" class="text-primary">/</span>
  <span>{{ group.context.period }}</span>
</div>
```

Change the existing description margin from `mt-3` to `mt-4` so context and description remain visually distinct.

- [ ] **Step 6: Verify project context and compact-mode boundaries**

Run:

```bash
npx prettier --write src/types/content.ts src/content/pl.json src/content/en.json src/components/ui/PanelAlphaFeature.vue src/components/ui/CommercialProjectGroup.vue
npm run type-check
node --input-type=module -e "import pl from './src/content/pl.json' with { type: 'json' }; import en from './src/content/en.json' with { type: 'json' }; for (const content of [pl,en]) { for (const project of [content.projects.featured,content.projects.commercialGroup]) { if (!project.context?.employer || !project.context?.role || !project.context?.period) throw new Error('Commercial project context incomplete'); } } console.log('commercial context ok')"
```

Expected: all commands PASS and Node prints `commercial context ok`. Static review must confirm context is guarded by `v-if="!compact"` in both components.

- [ ] **Step 7: Commit the project-context change**

```bash
git add src/types/content.ts src/content/pl.json src/content/en.json src/components/ui/PanelAlphaFeature.vue src/components/ui/CommercialProjectGroup.vue
git commit -m "feat: show employment context with commercial projects"
```

---

### Task 2: Simplify Home and remove obsolete experience components

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/content/pl.json`
- Modify: `src/content/en.json`
- Modify: `src/views/HomeView.vue`
- Delete: `src/components/ui/AtAGlancePanel.vue`
- Delete: `src/components/ui/ExperienceCard.vue`

**Interfaces:**
- Produces: `projects.homePreview: { index: string; title: string; subtitle: string }`
- Removes: `MetricItem`, `ExperienceEntry`, `ui.atAGlance`, `hero.metrics`, `hero.techTags`, and `experience`.
- Preserves: `about.paragraphs`, `skills.core`, compact project-component contracts, and contact methods.

- [ ] **Step 1: Update Home template before removing obsolete content fields**

In `HomeView.vue`:

1. Remove imports for `AtAGlancePanel` and `ExperienceCard`.
2. Remove `experienceIndex`.
3. Replace the hero layout’s opening wrapper:

```vue
<div class="grid gap-12 lg:grid-cols-12 lg:gap-8">
```

with:

```vue
<div class="max-w-3xl">
```

Remove the `<div class="lg:col-span-7">` wrapper while preserving its children, then remove the complete sibling `<div class="lg:col-span-5">` that contains `AtAGlancePanel`. Keep one closing `</div>` for the new `max-w-3xl` wrapper.

4. Delete the entire section that reads from `content.experience`.
5. Change the Projects `SectionHeading` bindings to:

```vue
<SectionHeading
  :index="content.projects.homePreview.index"
  :title="content.projects.homePreview.title"
  :subtitle="content.projects.homePreview.subtitle"
/>
```

Do not alter the current About paragraphs or core-skill loop.

- [ ] **Step 2: Run type-check to expose the missing Home preview contract**

Run:

```bash
npm run type-check
```

Expected: FAIL because `projects.homePreview` is not defined in `SiteContent`.

- [ ] **Step 3: Replace obsolete types with the Home preview contract**

In `src/types/content.ts`:

1. Delete `MetricItem` and `ExperienceEntry`.
2. Delete `ui.atAGlance`.
3. Delete `metrics` and `techTags` from `hero`.
4. Delete the entire `experience` property from `SiteContent`.
5. Add this property at the start of `projects`:

```ts
homePreview: {
  index: string
  title: string
  subtitle: string
}
```

- [ ] **Step 4: Apply exact Polish Home content changes**

In `src/content/pl.json`:

1. Delete `ui.atAGlance`.
2. Replace `hero.subtitle` with:

```json
"subtitle": "Rozwijam platformy B2B, integracje API oraz automatyzację infrastruktury i WordPress.",
```

3. Delete `hero.metrics` and `hero.techTags`.
4. Delete the complete top-level `experience` object.
5. Change `skills.index` to:

```json
"index": "03 / Umiejętności",
```

6. Add at the start of `projects`:

```json
"homePreview": {
  "index": "02 / Projekty",
  "title": "Wybrane realizacje komercyjne",
  "subtitle": "PanelAlpha oraz pięć samodzielnie zaimplementowanych modułów WHMCS."
},
```

7. Scope Projects-page numbering by changing:

```json
"index": "01 / Projekty",
```

and `projects.personal.index` to:

```json
"index": "02 / Projekty własne",
```

8. Replace `contact.ctaHeadline` with:

```json
"ctaHeadline": "Porozmawiajmy o współpracy"
```

Do not edit `about.paragraphs`.

- [ ] **Step 5: Apply natural English equivalents**

In `src/content/en.json`:

1. Delete `ui.atAGlance`.
2. Replace `hero.subtitle` with:

```json
"subtitle": "I develop B2B platforms, API integrations, and infrastructure and WordPress automation.",
```

3. Delete `hero.metrics`, `hero.techTags`, and the complete top-level `experience` object.
4. Keep `skills.index` as `"03 / Skills"`.
5. Add at the start of `projects`:

```json
"homePreview": {
  "index": "02 / Projects",
  "title": "Selected commercial work",
  "subtitle": "PanelAlpha and five independently implemented WHMCS modules."
},
```

6. Change `projects.index` to `"01 / Projects"` and `projects.personal.index` to `"02 / Personal projects"`.
7. Replace `contact.ctaHeadline` with:

```json
"ctaHeadline": "Let's talk about working together"
```

Do not edit `about.paragraphs`.

- [ ] **Step 6: Delete components that no longer have consumers**

Delete:

```text
src/components/ui/AtAGlancePanel.vue
src/components/ui/ExperienceCard.vue
```

- [ ] **Step 7: Verify removed content and Home structure**

Run:

```bash
npx prettier --write src/types/content.ts src/content/pl.json src/content/en.json src/views/HomeView.vue
npm run type-check
rg "AtAGlancePanel|ExperienceCard|content\\.experience|hero\\.metrics|hero\\.techTags|atAGlance" src
```

Expected:
- Prettier and type-check PASS.
- `rg` exits with code 1 and prints no matches.
- Static template order is Hero → About → Projects → Skills → Contact CTA.

- [ ] **Step 8: Commit the focused Home hierarchy**

```bash
git add src/types/content.ts src/content/pl.json src/content/en.json src/views/HomeView.vue src/components/ui/AtAGlancePanel.vue src/components/ui/ExperienceCard.vue
git commit -m "refactor: focus home on projects and core stack"
```

---

### Task 3: Replace skill inventory with competency groups

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/content/pl.json`
- Modify: `src/content/en.json`
- Create: `src/components/ui/SkillCompetencyCard.vue`
- Modify: `src/views/SkillsView.vue`

**Interfaces:**
- Replaces: `SkillCategory.items: SkillItem[]`
- Produces: `SkillCategory { name: string; description: string; tags: string[] }`
- Produces: `skills.competenciesLabel: string`
- Produces: `SkillCompetencyCard` prop `category: SkillCategory`
- Preserves: `skills.core: SkillItem[]` and `SkillBadge` for core skills.

- [ ] **Step 1: Change the skill-category contract**

Replace `SkillCategory` with:

```ts
export interface SkillCategory {
  name: string
  description: string
  tags: string[]
}
```

Add this field after `coreDescription` in `SiteContent.skills`:

```ts
competenciesLabel: string
```

- [ ] **Step 2: Run type-check to verify existing locale categories fail**

Run:

```bash
npm run type-check
```

Expected: FAIL because `SkillsView.vue` still reads `category.items`, which no longer exists in `SkillCategory`.

- [ ] **Step 3: Replace Polish categories with competency-oriented content**

Replace `skills.categories` in `src/content/pl.json` with:

```json
"categories": [
  {
    "name": "Integracje infrastrukturalne",
    "description": "Integruję panele hostingowe, usługi DNS, automatyzację SSL oraz infrastrukturę e-mail.",
    "tags": [
      "cPanel",
      "Plesk",
      "DirectAdmin",
      "PowerDNS",
      "Cloudflare",
      "Bunny DNS",
      "Let's Encrypt",
      "mailcow"
    ]
  },
  {
    "name": "Automatyzacja WordPress",
    "description": "Rozwijam cykl życia instancji WordPress, obsługę Git, onboarding oraz procesy backupu.",
    "tags": ["WordPress", "WP Cloud", "S3"]
  },
  {
    "name": "Billing i WHMCS",
    "description": "Tworzę moduły rozszerzające billing, automatyzację i operacyjne procesy WHMCS.",
    "tags": ["WHMCS", "Smarty", "JavaScript", "jQuery"]
  },
  {
    "name": "Frontend uzupełniający",
    "description": "Implementuję warstwę UI, gdy funkcja obejmuje zmiany po stronie backendu i frontendu.",
    "tags": ["Vue.js", "Vuetify", "Tailwind CSS"]
  },
  {
    "name": "Narzędzia i workflow",
    "description": "Korzystam z Git oraz narzędzi LLM jako wsparcia przy implementacji i refaktoryzacji.",
    "tags": ["Git", "Cursor", "LLM"]
  }
]
```

Add this field after `coreDescription`:

```json
"competenciesLabel": "Kompetencje",
```

Keep `skills.core` unchanged.

- [ ] **Step 4: Replace English categories with equivalent content**

Replace `skills.categories` in `src/content/en.json` with:

```json
"categories": [
  {
    "name": "Infrastructure integrations",
    "description": "I integrate hosting panels, DNS services, SSL automation, and e-mail infrastructure.",
    "tags": [
      "cPanel",
      "Plesk",
      "DirectAdmin",
      "PowerDNS",
      "Cloudflare",
      "Bunny DNS",
      "Let's Encrypt",
      "mailcow"
    ]
  },
  {
    "name": "WordPress automation",
    "description": "I develop WordPress instance lifecycle, Git support, onboarding, and backup workflows.",
    "tags": ["WordPress", "WP Cloud", "S3"]
  },
  {
    "name": "Billing and WHMCS",
    "description": "I build modules that extend billing, automation, and operational workflows in WHMCS.",
    "tags": ["WHMCS", "Smarty", "JavaScript", "jQuery"]
  },
  {
    "name": "Supporting frontend",
    "description": "I implement UI work when a feature spans both backend and frontend changes.",
    "tags": ["Vue.js", "Vuetify", "Tailwind CSS"]
  },
  {
    "name": "Tools and workflow",
    "description": "I use Git and LLM tools to support implementation and refactoring.",
    "tags": ["Git", "Cursor", "LLM"]
  }
]
```

Add this field after `coreDescription`:

```json
"competenciesLabel": "Competencies",
```

Keep `skills.core` unchanged.

- [ ] **Step 5: Create the competency card**

Create `src/components/ui/SkillCompetencyCard.vue`:

```vue
<script setup lang="ts">
import type { SkillCategory } from '@/types/content'

defineProps<{
  category: SkillCategory
}>()
</script>

<template>
  <article class="panel rounded-md p-5 sm:p-6">
    <h3 class="font-mono text-base font-semibold text-card-foreground">
      {{ category.name }}
    </h3>
    <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
      {{ category.description }}
    </p>
    <ul class="mt-5 flex flex-wrap gap-2" :aria-label="category.name">
      <li
        v-for="tag in category.tags"
        :key="tag"
        class="rounded-sm border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-secondary-foreground"
      >
        {{ tag }}
      </li>
    </ul>
  </article>
</template>
```

- [ ] **Step 6: Compose competency cards on Skills**

Import the component in `SkillsView.vue`:

```ts
import SkillCompetencyCard from '@/components/ui/SkillCompetencyCard.vue'
```

Preserve the current core-stack section without changes. Replace the complete `section v-for="category in content.skills.categories"` block with:

```vue
<section :aria-label="content.skills.competenciesLabel">
  <div class="grid gap-5 md:grid-cols-2">
    <SkillCompetencyCard
      v-for="category in content.skills.categories"
      :key="category.name"
      :category="category"
    />
  </div>
</section>
```

The localized `competenciesLabel` ensures the section landmark has a meaningful accessible name in both languages.

- [ ] **Step 7: Verify taxonomy, removed standalone cards, and LLM visibility**

Run:

```bash
npx prettier --write src/types/content.ts src/content/pl.json src/content/en.json src/components/ui/SkillCompetencyCard.vue src/views/SkillsView.vue
npm run type-check
node --input-type=module -e "import pl from './src/content/pl.json' with { type: 'json' }; import en from './src/content/en.json' with { type: 'json' }; const blocked = ['FTP','SFTP','FTPS','Google Analytics','AWStats','Extendify','TenWeb','Ionic','Inertia.js']; for (const content of [pl,en]) { if (content.skills.core.length !== 5) throw new Error('Core stack must contain five items'); if (!content.skills.categories.some(({ tags }) => tags.includes('Cursor') && tags.includes('LLM'))) throw new Error('Cursor/LLM workflow missing'); if (content.skills.categories.some(({ tags }) => tags.some((tag) => blocked.includes(tag)))) throw new Error('Removed standalone technology found'); } console.log('skills content ok')"
```

Expected:
- Prettier and type-check PASS.
- Node prints `skills content ok`.

- [ ] **Step 8: Commit the competency-based Skills page**

```bash
git add src/types/content.ts src/content/pl.json src/content/en.json src/components/ui/SkillCompetencyCard.vue src/views/SkillsView.vue
git commit -m "refactor: organize skills around practical competencies"
```

---

### Task 4: Run final content, quality, and responsive verification

**Files:**
- Verify: `src/types/content.ts`
- Verify: `src/content/pl.json`
- Verify: `src/content/en.json`
- Verify: `src/views/HomeView.vue`
- Verify: `src/views/ProjectsView.vue`
- Verify: `src/views/SkillsView.vue`
- Verify: `src/components/ui/PanelAlphaFeature.vue`
- Verify: `src/components/ui/CommercialProjectGroup.vue`
- Verify: `src/components/ui/SkillCompetencyCard.vue`

**Interfaces:**
- Consumes all outputs from Tasks 1–3.
- Produces no new runtime interface.

- [ ] **Step 1: Format every changed source file**

Run:

```bash
npx prettier --write src/types/content.ts src/content/pl.json src/content/en.json src/views/HomeView.vue src/views/ProjectsView.vue src/views/SkillsView.vue src/components/ui/PanelAlphaFeature.vue src/components/ui/CommercialProjectGroup.vue src/components/ui/SkillCompetencyCard.vue
```

Expected: exit code 0.

- [ ] **Step 2: Run all automated repository gates**

Run:

```bash
npm run lint
npm run type-check
npm run build
```

Expected: all commands exit 0; Vite writes a production bundle to `dist/`.

- [ ] **Step 3: Verify bilingual structural parity and protected About copy**

Run:

```bash
node --input-type=module -e "import pl from './src/content/pl.json' with { type: 'json' }; import en from './src/content/en.json' with { type: 'json' }; const shape = (value) => Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value; if (JSON.stringify(shape(pl)) !== JSON.stringify(shape(en))) throw new Error('Locale shapes differ'); if (pl.about.paragraphs.length !== 3 || en.about.paragraphs.length !== 3) throw new Error('About copy changed unexpectedly'); console.log('locale parity ok')"
```

Expected: prints `locale parity ok`.

- [ ] **Step 4: Verify hierarchy and link constraints statically**

Run:

```bash
rg -n "content\\.projects\\.homePreview|content\\.projects\\.featured|content\\.projects\\.commercialGroup|content\\.skills\\.core|content\\.contact\\.ctaHeadline" src/views/HomeView.vue
rg -n "context\\.(employer|role|period)" src/components/ui/PanelAlphaFeature.vue src/components/ui/CommercialProjectGroup.vue
rg -n "href|RouterLink|<a" src/components/ui/CommercialProjectItem.vue
```

Expected:
- Home matches the approved section order by ascending line number.
- Both commercial components render employer, role, and period.
- The final `rg` prints no matches and exits 1 because module entries remain non-clickable.

- [ ] **Step 5: Perform responsive browser checks**

Start:

```bash
npm run dev -- --host 0.0.0.0
```

Inspect `/`, `/projects`, and `/skills` in Polish and English at approximately:

- 375 px width,
- 768 px width,
- 1440 px width.

Confirm:

- Hero uses the available width and has no empty right column.
- Home order is Hero → How I work → Selected commercial work → Core stack → Contact.
- Home has no At-a-glance or commercial timeline section.
- Project employment metadata wraps without collisions.
- Skill tags wrap inside their cards.
- Cursor and LLM are visible under Tools and workflow.
- Focus states, external links, and mobile navigation still work.

Stop the development server after inspection.

- [ ] **Step 6: Inspect the final diff**

Run:

```bash
git status --short
git diff --check
git diff --stat HEAD~3..HEAD
```

Expected: no unexpected generated files, no whitespace errors, and only files listed in this plan changed.

- [ ] **Step 7: Commit formatting fixes only if verification changed files**

If `npm run lint` or formatting changed tracked files:

```bash
git add src
git commit -m "chore: finalize home and skills refinement"
```

If the worktree is clean, do not create an empty commit.
