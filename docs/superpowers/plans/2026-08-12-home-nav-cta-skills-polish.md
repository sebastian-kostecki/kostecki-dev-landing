# Home Nav Reveal, CTA Background, and Skills Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the site header on Home until the user scrolls, align the Home CTA background with other sections, and update Skills competency copy/tags in Polish and English.

**Architecture:** Keep JSON as the bilingual content source of truth. Header reveal is local UI state in `SiteHeader.vue` (route + scroll threshold). CTA and Skills changes are template/content edits only — no new types, routes, or dependencies.

**Tech Stack:** Vue 3, TypeScript, Vue Router, Tailwind CSS v4, JSON content, Prettier, vue-tsc, Vite.

## Global Constraints

- Home-only header hide/reveal; all other routes keep a always-visible header.
- Scroll threshold ≈ 32px; transition ≈ 200ms; respect `prefers-reduced-motion`.
- If the mobile menu is open on Home, keep the header visible until closed.
- Preserve skip-to-content, focus order, and sticky `z-50`.
- Remove Home CTA `gradient-hero`; keep headline/subtitle/CTA copy unchanged.
- Preserve bilingual Polish and English content with equivalent object structures.
- Generated code, identifiers, comments, and logs must be written in English.
- Do not add dependencies or a test framework.

---

## File Map

- `src/components/layout/SiteHeader.vue` — Home scroll reveal for the sticky header.
- `src/views/HomeView.vue` — remove CTA section gradient overlay.
- `src/content/pl.json` — Polish skills competency updates.
- `src/content/en.json` — English skills competency updates.

---

### Task 1: Home-only header reveal on scroll

**Files:**
- Modify: `src/components/layout/SiteHeader.vue`

**Interfaces:**
- Consumes: `useRoute()` (`route.path`), existing `open` mobile menu ref
- Produces: `headerVisible` computed visibility used by the root `<header>` classes
- Preserves: sticky header, nav links, language switcher, CV button, mobile menu

- [ ] **Step 1: Replace the script setup with scroll-aware visibility**

Replace the entire `<script setup lang="ts">` block in `src/components/layout/SiteHeader.vue` with:

```ts
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X } from '@lucide/vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useContent } from '@/composables/useContent'

const SCROLL_THRESHOLD_PX = 32

const content = useContent()
const route = useRoute()
const open = ref(false)
const scrolledPastThreshold = ref(false)

const hasCv = computed(() => content.value.cv.href.length > 0)
const isHome = computed(() => route.path === '/')
const headerVisible = computed(() => {
  if (!isHome.value) return true
  if (open.value) return true
  return scrolledPastThreshold.value
})

function isActive(to: string) {
  return route.path === to
}

function updateScrollState() {
  scrolledPastThreshold.value = window.scrollY > SCROLL_THRESHOLD_PX
}

watch(
  () => route.path,
  () => {
    open.value = false
    updateScrollState()
  },
)

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
})
```

Keep a single surrounding `<script setup lang="ts">` … `</script>` pair — replace only the script body contents.

- [ ] **Step 2: Bind visibility classes on the root header**

Replace the root `<header>` opening tag:

```vue
  <header class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
```

with:

```vue
  <header
    class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
    :class="
      headerVisible
        ? 'translate-y-0 opacity-100'
        : 'pointer-events-none -translate-y-full opacity-0'
    "
  >
```

- [ ] **Step 3: Format and type-check**

Run:

```bash
npx prettier --write src/components/layout/SiteHeader.vue
npm run type-check
```

Expected: Prettier rewrites the file if needed; `vue-tsc` exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/SiteHeader.vue
git commit -m "$(cat <<'EOF'
feat: reveal home header after scroll

EOF
)"
```

---

### Task 2: Align Home CTA background with other sections

**Files:**
- Modify: `src/views/HomeView.vue`

**Interfaces:**
- Consumes: `content.contact.ctaHeadline`, `content.contact.subtitle`, `content.hero.ctaPrimary.label`
- Produces: unchanged CTA copy; section chrome matching About / projects / skills sections
- Preserves: CTA link to `/contact`

- [ ] **Step 1: Remove the gradient overlay from the CTA section**

Replace the final Home section block:

```vue
    <section class="relative overflow-hidden border-t border-border/60 px-4 py-24 sm:px-6 lg:px-8">
      <div aria-hidden="true" class="gradient-hero absolute inset-0 opacity-70" />
      <div class="relative mx-auto max-w-3xl text-center">
        <h2 class="font-mono text-3xl font-bold text-foreground sm:text-4xl">
          {{ content.contact.ctaHeadline }}
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-muted-foreground">{{ content.contact.subtitle }}</p>
        <RouterLink to="/contact" class="btn-primary mt-8">
          {{ content.hero.ctaPrimary.label }}
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </section>
```

with:

```vue
    <section class="border-t border-border/60 px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="font-mono text-3xl font-bold text-foreground sm:text-4xl">
          {{ content.contact.ctaHeadline }}
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-muted-foreground">{{ content.contact.subtitle }}</p>
        <RouterLink to="/contact" class="btn-primary mt-8">
          {{ content.hero.ctaPrimary.label }}
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </section>
```

- [ ] **Step 2: Assert the CTA section no longer references gradient-hero**

Run:

```bash
rg -n "gradient-hero" src/views/HomeView.vue
```

Expected: a single match on the hero section only (near the top of the file), not in the CTA section. Specifically, no match should appear after the skills section.

- [ ] **Step 3: Format and commit**

```bash
npx prettier --write src/views/HomeView.vue
git add src/views/HomeView.vue
git commit -m "$(cat <<'EOF'
fix: match home CTA background to page sections

EOF
)"
```

---

### Task 3: Update Skills competencies (PL + EN)

**Files:**
- Modify: `src/content/pl.json`
- Modify: `src/content/en.json`

**Interfaces:**
- Consumes: existing `skills.categories: SkillCategory[]` (`name`, `description`, `tags`)
- Produces: updated category copy/tags listed below
- Preserves: `skills.core` and Skills view composition

- [ ] **Step 1: Replace Polish `skills.categories`**

In `src/content/pl.json`, replace the entire `"categories"` array under `"skills"` with:

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
          "mailcow",
          "Fastly",
          "Admin Bolt"
        ]
      },
      {
        "name": "WordPress",
        "description": "Ogarniam WordPressy — WP Cloud, backupy, themes i plugins.",
        "tags": ["WordPress", "WP Cloud", "Backups", "Themes", "Plugins"]
      },
      {
        "name": "Billing",
        "description": "Tworzę moduły rozszerzające billing, automatyzację i operacyjne procesy WHMCS, w tym Stripe.",
        "tags": ["WHMCS", "Stripe"]
      },
      {
        "name": "Frontend uzupełniający",
        "description": "Implementuję warstwę UI, gdy funkcja obejmuje zmiany po stronie backendu i frontendu.",
        "tags": ["Vue.js", "Vuetify", "Tailwind CSS"]
      },
      {
        "name": "Narzędzia i workflow",
        "description": "Korzystam z Git, Cursor i PhpStorm przy implementacji i refaktoryzacji.",
        "tags": ["Git", "Cursor", "PhpStorm"]
      }
    ]
```

- [ ] **Step 2: Replace English `skills.categories`**

In `src/content/en.json`, replace the entire `"categories"` array under `"skills"` with:

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
          "mailcow",
          "Fastly",
          "Admin Bolt"
        ]
      },
      {
        "name": "WordPress",
        "description": "I handle WordPress sites — WP Cloud, backups, themes, and plugins.",
        "tags": ["WordPress", "WP Cloud", "Backups", "Themes", "Plugins"]
      },
      {
        "name": "Billing",
        "description": "I build modules that extend billing, automation, and operational workflows in WHMCS, including Stripe.",
        "tags": ["WHMCS", "Stripe"]
      },
      {
        "name": "Supporting frontend",
        "description": "I implement UI work when a feature spans both backend and frontend changes.",
        "tags": ["Vue.js", "Vuetify", "Tailwind CSS"]
      },
      {
        "name": "Tools and workflow",
        "description": "I use Git, Cursor, and PhpStorm for implementation and refactoring.",
        "tags": ["Git", "Cursor", "PhpStorm"]
      }
    ]
```

- [ ] **Step 3: Assert content contracts for both locales**

Run:

```bash
node --input-type=module -e "
import pl from './src/content/pl.json' with { type: 'json' };
import en from './src/content/en.json' with { type: 'json' };

for (const [locale, content] of [['pl', pl], ['en', en]]) {
  const cats = content.skills.categories;
  if (cats.length !== 5) throw new Error(locale + ': expected 5 categories');

  const byName = Object.fromEntries(cats.map((c) => [c.name, c]));

  const integrations = byName[locale === 'pl' ? 'Integracje infrastrukturalne' : 'Infrastructure integrations'];
  if (!integrations?.tags.includes('Fastly') || !integrations.tags.includes('Admin Bolt')) {
    throw new Error(locale + ': Fastly/Admin Bolt missing');
  }

  const wp = byName.WordPress;
  if (!wp) throw new Error(locale + ': WordPress category missing');
  for (const tag of ['WordPress', 'WP Cloud', 'Backups', 'Themes', 'Plugins']) {
    if (!wp.tags.includes(tag)) throw new Error(locale + ': WordPress missing ' + tag);
  }
  if (wp.tags.includes('S3')) throw new Error(locale + ': S3 should be removed');

  const billing = byName.Billing;
  if (!billing) throw new Error(locale + ': Billing category missing');
  if (JSON.stringify(billing.tags) !== JSON.stringify(['WHMCS', 'Stripe'])) {
    throw new Error(locale + ': Billing tags must be WHMCS, Stripe');
  }
  for (const blocked of ['Smarty', 'JavaScript', 'jQuery']) {
    if (billing.tags.includes(blocked)) throw new Error(locale + ': blocked tag ' + blocked);
  }

  const tools = byName[locale === 'pl' ? 'Narzędzia i workflow' : 'Tools and workflow'];
  if (!tools) throw new Error(locale + ': tools category missing');
  if (JSON.stringify(tools.tags) !== JSON.stringify(['Git', 'Cursor', 'PhpStorm'])) {
    throw new Error(locale + ': tools tags must be Git, Cursor, PhpStorm');
  }
  if (tools.tags.includes('LLM')) throw new Error(locale + ': LLM must be removed');
}

console.log('skills polish content ok');
"
```

Expected: prints `skills polish content ok`.

- [ ] **Step 4: Format and commit**

```bash
npx prettier --write src/content/pl.json src/content/en.json
git add src/content/pl.json src/content/en.json
git commit -m "$(cat <<'EOF'
content: refresh skills competencies and tags

EOF
)"
```

---

### Task 4: Verify build and acceptance criteria

**Files:**
- Verify: `src/components/layout/SiteHeader.vue`
- Verify: `src/views/HomeView.vue`
- Verify: `src/content/pl.json`
- Verify: `src/content/en.json`

**Interfaces:**
- Consumes: outputs of Tasks 1–3
- Produces: green type-check/build and manual acceptance checklist

- [ ] **Step 1: Run type-check and production build**

```bash
npm run type-check
npm run build-only
```

Expected: both commands exit 0.

- [ ] **Step 2: Manual acceptance checklist**

With `npm run dev`:

1. Open `/` at the top — header not visible.
2. Scroll down past ~32px — header appears; scroll back to top — header hides again.
3. Open `/skills`, `/projects`, `/contact` — header visible immediately.
4. On Home, open the mobile menu near the top — header stays visible while open.
5. Home CTA section background matches About / projects / skills sections (no gradient cut-off).
6. `/skills` shows Fastly + Admin Bolt; WordPress group renamed; Billing with WHMCS + Stripe; Tools with PhpStorm and without LLM.
7. Toggle PL/EN — structures stay aligned.

- [ ] **Step 3: Final commit only if Step 2 required fixups**

If Step 2 found issues, fix them, then:

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
fix: polish home nav reveal and skills acceptance

EOF
)"
```

If no fixups were needed, skip this commit.

---

## Spec coverage (self-review)

| Spec requirement | Task |
| --- | --- |
| Home-only header hide until scroll | Task 1 |
| Scroll back to top hides again | Task 1 |
| Other routes always visible | Task 1 |
| Mobile menu keeps header visible | Task 1 |
| Reduced motion / transition | Task 1 classes |
| Remove CTA gradient-hero | Task 2 |
| Integrations + Fastly / Admin Bolt | Task 3 |
| WordPress rename + copy/tags | Task 3 |
| Billing rename + Stripe; drop Smarty/JS/jQuery | Task 3 |
| Tools: PhpStorm; drop LLM | Task 3 |
| PL/EN parity + acceptance | Tasks 3–4 |
