# Production Readiness Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix hero CTA/nav overlap, pass responsive audit at key breakpoints, and ship production-ready SEO/build assets for kostecki.dev.

**Architecture:** Hero becomes a flex column (content + nav in document flow, no absolute positioning). Static OG/SEO tags live in `index.html`; OG image generated via Node `sharp` script (same toolchain as favicons). `vue-devtools` plugin gated to dev serve only. Final gate: manual breakpoint checklist + Lighthouse on `vite preview`.

**Tech Stack:** Vue 3, TypeScript, Vite 8, Tailwind CSS 4, sharp, pnpm

**Spec reference:** `docs/superpowers/specs/2026-05-31-production-readiness-audit-design.md`

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/components/sections/HeroSection.vue` | Flex layout — fix overlap |
| `vite.config.ts` | Dev-only `vueDevTools()` |
| `index.html` | OG, Twitter, canonical meta |
| `scripts/generate-og-image.mjs` | **New** — 1200×630 PNG from SVG |
| `public/og-image.png` | Generated share image |
| `public/robots.txt` | **New** — crawler rules |
| `public/sitemap.xml` | **New** — single-URL sitemap |
| `package.json` | `generate:og-image` script |

**Known limitation (no code change):** Mobile sticky header has no nav links below `md` — hero nav only (spec 3a).

---

### Task 1: Fix hero layout overlap

**Files:**
- Modify: `src/components/sections/HeroSection.vue`

- [ ] **Step 1: Replace template with flex column layout**

Replace the entire `<template>` block with:

```vue
<template>
  <section
    id="hero"
    class="relative flex min-h-screen flex-col overflow-hidden"
    aria-label="Hero"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.15)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1)_0%,_transparent_50%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')"
      aria-hidden="true"
    />

    <div
      class="container relative mx-auto flex flex-1 flex-col justify-between px-4 py-12 lg:px-8 lg:py-24"
    >
      <div class="flex flex-1 flex-col justify-center">
        <div class="max-w-3xl text-center lg:text-left">
          <h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            <span class="text-gradient">{{ hero.name }}</span>
          </h1>
          <p class="mt-4 text-lg text-muted sm:text-xl lg:text-2xl">{{ hero.tagline }}</p>
          <p v-if="hero.subtitle" class="mt-3 text-base text-muted sm:text-lg lg:max-w-2xl">
            {{ hero.subtitle }}
          </p>
          <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              :href="hero.ctaPrimary.href"
              class="btn-primary"
              :target="hero.ctaPrimary.href.startsWith('http') ? '_blank' : undefined"
              :rel="hero.ctaPrimary.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            >
              {{ hero.ctaPrimary.label }}
            </a>
            <a
              :href="hero.ctaSecondary.href"
              class="btn-secondary"
              :target="hero.ctaSecondary.href.startsWith('http') ? '_blank' : undefined"
              :rel="hero.ctaSecondary.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            >
              {{ hero.ctaSecondary.label }}
            </a>
          </div>
        </div>
      </div>

      <nav class="shrink-0 pt-10 lg:pt-12" aria-label="Główna nawigacja">
        <ul
          class="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 lg:items-start lg:justify-start"
        >
          <li v-for="item in nav" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="nav-link text-base font-medium text-white/80 hover:text-white"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>
```

`<script setup>` block stays unchanged.

- [ ] **Step 2: Verify at 375px width**

Run: `pnpm dev`  
Chrome DevTools → device 375×667 (iPhone SE) → hero section  
Expected:
- Visible gap between CTA buttons and first nav link "O mnie"
- No overlap between "Porozmawiajmy" and "O mnie"
- No overlap between secondary "Doświadczenie" button and "Umiejętności"

- [ ] **Step 3: Run build**

Run: `pnpm build`  
Expected: exit 0, no TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HeroSection.vue
git commit -m "fix: prevent hero CTA and nav overlap on mobile"
```

---

### Task 2: OG image generation script

**Files:**
- Create: `scripts/generate-og-image.mjs`
- Modify: `package.json`
- Create (generated): `public/og-image.png`

- [ ] **Step 1: Create generation script**

Create `scripts/generate-og-image.mjs`:

```javascript
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'public', 'og-image.png')

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0c0c0e"/>
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="#141416" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
  <path d="M120 200 L280 430 M280 200 L120 430" fill="none" stroke="#e63946" stroke-width="12" stroke-linecap="round"/>
  <circle cx="200" cy="315" r="14" fill="#ffffff"/>
  <text x="340" y="280" fill="#ffffff" font-family="system-ui, sans-serif" font-size="64" font-weight="800">Sebastian Kostecki</text>
  <text x="340" y="360" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="36" font-weight="500">Backend Developer · PHP · Laravel</text>
  <text x="340" y="430" fill="#e63946" font-family="system-ui, sans-serif" font-size="28" font-weight="600">kostecki.dev</text>
</svg>
`

await sharp(Buffer.from(svg)).png().toFile(outPath)
console.log('Generated public/og-image.png')
```

- [ ] **Step 2: Add npm script**

In `package.json` `scripts`, add after `generate:favicons`:

```json
"generate:og-image": "node scripts/generate-og-image.mjs"
```

- [ ] **Step 3: Generate PNG**

Run: `pnpm generate:og-image`  
Expected: `Generated public/og-image.png`  
Verify file exists: `ls -la public/og-image.png` (approx. 50–150 KB)

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-og-image.mjs package.json public/og-image.png
git commit -m "chore: add OG image generation script and asset"
```

---

### Task 3: SEO meta, robots, sitemap

**Files:**
- Modify: `index.html`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] **Step 1: Add meta tags to index.html**

After the existing `<meta name="description" ...>` line, insert:

```html
    <link rel="canonical" href="https://kostecki.dev/">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://kostecki.dev/">
    <meta property="og:title" content="Sebastian Kostecki — Backend Developer (Laravel)">
    <meta property="og:description" content="Backend developer specjalizujący się w Laravel. Integracje hostingowe, provisioning WordPress, API. 4 lata komercyjnie.">
    <meta property="og:locale" content="pl_PL">
    <meta property="og:image" content="https://kostecki.dev/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Sebastian Kostecki — Backend Developer (Laravel)">
    <meta name="twitter:description" content="Backend developer specjalizujący się w Laravel. Integracje hostingowe, provisioning WordPress, API. 4 lata komercyjnie.">
    <meta name="twitter:image" content="https://kostecki.dev/og-image.png">
```

Values must match `src/content/pl.json` `meta.title` and `meta.description`.

- [ ] **Step 2: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://kostecki.dev/sitemap.xml
```

- [ ] **Step 3: Create sitemap.xml**

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kostecki.dev/</loc>
    <lastmod>2026-05-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Verify in preview**

Run: `pnpm build && pnpm preview`  
Open Network tab — confirm 200 for `/robots.txt`, `/sitemap.xml`, `/og-image.png`

- [ ] **Step 5: Commit**

```bash
git add index.html public/robots.txt public/sitemap.xml
git commit -m "feat: add Open Graph, Twitter, canonical, robots and sitemap"
```

---

### Task 4: Dev-only vue-devtools in Vite

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Gate plugin to dev serve**

Replace `vite.config.ts` with:

```typescript
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    vue(),
    ...(command === 'serve' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
```

- [ ] **Step 2: Confirm devtools absent from prod bundle**

Run: `pnpm build`  
Run: `grep -r "devtools" dist/assets/*.js || echo "No devtools string in bundle"`  
Expected: `No devtools string in bundle` (or no meaningful devtools imports)

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "chore: load vue-devtools only during dev serve"
```

---

### Task 5: Responsive audit (manual)

**Files:** none (verification only)

- [ ] **Step 1: Start preview server**

Run: `pnpm build && pnpm preview`  
Note the URL (default `http://localhost:4173`)

- [ ] **Step 2: Run breakpoint checklist**

Chrome DevTools → Toggle device toolbar. For each width **320, 375, 390, 768, 1024, 1280**, scroll full page and confirm:

| Check | Pass criteria |
|-------|---------------|
| Horizontal scroll | None (`document.documentElement.scrollWidth === window.innerWidth`) |
| Hero | No overlapping buttons/links |
| About | Paragraphs readable, no overflow |
| Experience | Logo + text side-by-side; bullets wrap |
| Skills | Icon grid wraps; tags wrap |
| Projects | 1 col mobile, 2 col ≥768px |
| Contact | Cards stack; CTA block OK |
| Footer | Text centered mobile; 2-col ≥768px |

Record failures in a comment on the PR or skip if all pass.

- [ ] **Step 3: Fix any layout issues found**

If overlap or overflow found: fix the relevant component, re-run Step 2 for failed breakpoints only.

- [ ] **Step 4: Commit fixes (if any)**

```bash
git add -A
git commit -m "fix: responsive layout issues from production audit"
```

Skip commit if no changes.

---

### Task 6: Lighthouse production gate

**Files:** none (verification; optional font tweak in `index.html` if Performance < 90)

- [ ] **Step 1: Run Lighthouse mobile**

With `pnpm preview` running, Chrome DevTools → Lighthouse → Mobile → categories: Performance, Accessibility, Best Practices, SEO → Analyze

**Minimum scores:**

| Category | Min |
|----------|-----|
| Performance | 90 |
| Accessibility | 95 |
| SEO | 95 |
| Best Practices | 95 |

- [ ] **Step 2: Remediate Performance if below 90**

If Performance < 90, update Google Fonts URL in `index.html` to load fewer weights. Replace line 14 with:

```html
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

Re-run Lighthouse. If still below 90, document actual score in commit message and proceed only if user accepts (otherwise investigate render-blocking resources).

- [ ] **Step 3: Remediate SEO if below 95**

Usually fixed by Task 3 OG tags. Re-run after meta added.

- [ ] **Step 4: Remediate Accessibility if below 95**

Common fix: ensure all images have `alt`, links have discernible names. Fix flagged items from Lighthouse report.

- [ ] **Step 5: Commit remediations (if any)**

```bash
git add -A
git commit -m "fix: address Lighthouse audit findings for production gate"
```

---

### Task 7: Content asset verification

**Files:** none

- [ ] **Step 1: Verify local asset paths**

With `pnpm preview` running, open DevTools Network, hard refresh, filter Img/Fetch. Confirm 200 for:

- `/assets/experience/panelalpha.svg`
- `/assets/experience/modulesgarden.svg`
- Each `/assets/skills/*.svg` referenced in `pl.json` with `logo` field

Iconify icons load from CDN — spot-check one skill icon renders in Skills section.

- [ ] **Step 2: Verify favicons**

Confirm 200: `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`

- [ ] **Step 3: Final build check**

Run: `pnpm run build`  
Run: `pnpm run type-check` (or full `pnpm build` which includes type-check)  
Expected: both exit 0

---

## Release Checklist (copy before deploy)

- [ ] Hero overlap fixed at 320, 375, 390 px
- [ ] Responsive audit passed (Task 5)
- [ ] Lighthouse mobile thresholds met (Task 6)
- [ ] OG image + meta present; share preview OK
- [ ] `robots.txt`, `sitemap.xml` deployed
- [ ] Production bundle has no vue-devtools
- [ ] `pnpm build` green
- [ ] All content assets 200

---

## Spec Coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Hero flex layout fix | Task 1 |
| Breakpoint audit | Task 5 |
| Mobile nav 3a (document only) | File Map note |
| OG/Twitter/canonical | Task 3 |
| og-image.png 1200×630 | Task 2 |
| Dev-only vue-devtools | Task 4 |
| robots.txt, sitemap.xml | Task 3 |
| Lighthouse thresholds | Task 6 |
| Asset verification | Task 7 |
| Favicons unchanged | Task 7 Step 2 |
