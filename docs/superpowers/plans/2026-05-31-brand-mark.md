# Brand Mark & Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship variant 2 brand mark (overlapping chevrons) as favicon, raster icons, and a reusable `BrandMark` component in header and footer.

**Architecture:** One master SVG in `public/favicon.svg` matches inline SVG in `BrandMark.vue`. A small Node script (`sharp` + `to-ico`) generates `favicon.ico` and `apple-touch-icon.png` from the SVG at build/dev time. Header/footer import the Vue component with `aria-hidden` inside labeled links.

**Tech Stack:** Vue 3, TypeScript, Vite, Tailwind CSS 4, Node `sharp`, `to-ico`

**Spec reference:** `docs/superpowers/specs/2026-05-31-brand-mark-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `public/favicon.svg` | Master favicon (variant 2 geometry) |
| `public/favicon.ico` | Generated 16+32 multi-size ICO |
| `public/apple-touch-icon.png` | Generated 180×180 PNG |
| `scripts/generate-favicons.mjs` | Raster export from SVG |
| `src/components/ui/BrandMark.vue` | **New** — inline SVG mark, `size` prop |
| `src/components/layout/SiteHeader.vue` | Replace text initials with `BrandMark` |
| `src/components/layout/SiteFooter.vue` | Add mark beside copyright |
| `index.html` | Add `theme-color` meta |
| `package.json` | `generate:favicons` script + devDependencies |

---

### Task 1: Replace favicon.svg with variant 2

**Files:**
- Modify: `public/favicon.svg`

- [ ] **Step 1: Write production SVG**

Replace entire file with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Sebastian Kostecki">
  <rect width="32" height="32" rx="6" fill="#0c0c0e"/>
  <path
    d="M7 5 L25 27 M25 5 L7 27"
    fill="none"
    stroke="#e63946"
    stroke-width="2.6"
    stroke-linecap="round"
  />
  <circle cx="16" cy="16" r="2" fill="#ffffff"/>
</svg>
```

- [ ] **Step 2: Preview in browser**

Run: `pnpm dev`  
Open: `http://localhost:5173/favicon.svg`  
Expected: dark rounded tile, red X chevrons, white center dot

- [ ] **Step 3: Commit**

```bash
git add public/favicon.svg
git commit -m "feat: update favicon to overlapping chevrons mark"
```

---

### Task 2: Favicon raster generation script

**Files:**
- Create: `scripts/generate-favicons.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add dev dependencies**

```bash
pnpm add -D sharp to-ico
```

- [ ] **Step 2: Create generation script**

```javascript
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import toIco from 'to-ico'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = join(root, 'public', 'favicon.svg')
const svg = await readFile(svgPath)

const png16 = await sharp(svg).resize(16, 16).png().toBuffer()
const png32 = await sharp(svg).resize(32, 32).png().toBuffer()
const png180 = await sharp(svg).resize(180, 180).png().toBuffer()

await writeFile(join(root, 'public', 'favicon.ico'), await toIco([png16, png32]))
await writeFile(join(root, 'public', 'apple-touch-icon.png'), png180)

console.log('Generated public/favicon.ico and public/apple-touch-icon.png')
```

- [ ] **Step 3: Add npm script**

In `package.json` `scripts`:

```json
"generate:favicons": "node scripts/generate-favicons.mjs"
```

- [ ] **Step 4: Run generator**

Run: `pnpm generate:favicons`  
Expected: console log success; new files in `public/`

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-favicons.mjs package.json pnpm-lock.yaml public/favicon.ico public/apple-touch-icon.png
git commit -m "chore: add favicon raster generation script"
```

---

### Task 3: BrandMark Vue component

**Files:**
- Create: `src/components/ui/BrandMark.vue`

- [ ] **Step 1: Create component**

```vue
<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    decorative?: boolean
  }>(),
  {
    size: 32,
    decorative: true,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    :role="decorative ? undefined : 'img'"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : 'Sebastian Kostecki'"
    class="shrink-0"
  >
    <rect width="32" height="32" rx="6" fill="#0c0c0e" />
    <path
      d="M7 5 L25 27 M25 5 L7 27"
      fill="none"
      stroke="#e63946"
      stroke-width="2.6"
      stroke-linecap="round"
    />
    <circle cx="16" cy="16" r="2" fill="#ffffff" />
  </svg>
</template>
```

- [ ] **Step 2: Type-check**

Run: `pnpm type-check`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/BrandMark.vue
git commit -m "feat: add BrandMark component for site logo"
```

---

### Task 4: Integrate mark in SiteHeader

**Files:**
- Modify: `src/components/layout/SiteHeader.vue`

- [ ] **Step 1: Replace initials with BrandMark**

Remove `getInitials`, `hero` import for initials, and `initials` computed.

Add import:

```typescript
import BrandMark from '@/components/ui/BrandMark.vue'
```

Replace link content `{{ initials }}` with:

```vue
<BrandMark :size="28" decorative />
```

Full header logo link:

```vue
<a
  href="#"
  class="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
  aria-label="Strona główna"
>
  <BrandMark :size="28" decorative />
</a>
```

- [ ] **Step 2: Visual check**

Run: `pnpm dev`  
Scroll page — sticky header shows chevron mark at ~28px, no layout jump

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SiteHeader.vue
git commit -m "feat: use BrandMark in site header"
```

---

### Task 5: Integrate mark in SiteFooter

**Files:**
- Modify: `src/components/layout/SiteFooter.vue`

- [ ] **Step 1: Add mark to copyright row**

Add import:

```typescript
import BrandMark from '@/components/ui/BrandMark.vue'
```

Replace copyright row opening block:

```vue
<div
  class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row"
>
  <div class="flex items-center gap-3">
    <a
      href="#"
      class="inline-flex shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
      aria-label="Strona główna"
    >
      <BrandMark :size="22" decorative />
    </a>
    <p class="text-center text-sm text-muted md:text-left">
      {{ footer.copyright }} &copy; {{ year }}
    </p>
  </div>
  <div class="flex gap-4">
```

(Keep existing social icon links unchanged.)

- [ ] **Step 2: Visual check**

Run: `pnpm dev`  
Footer shows 22px mark left of copyright on mobile and desktop

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SiteFooter.vue
git commit -m "feat: use BrandMark in site footer"
```

---

### Task 6: index.html theme-color

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add theme-color meta**

Inside `<head>`, after charset:

```html
<meta name="theme-color" content="#0c0c0e">
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "chore: set theme-color for mobile browser chrome"
```

---

### Task 7: Final verification

**Files:** (none — verification only)

- [ ] **Step 1: Regenerate rasters if SVG changed**

Run: `pnpm generate:favicons`

- [ ] **Step 2: Production build**

Run: `pnpm build`  
Expected: PASS, no errors

- [ ] **Step 3: Lint**

Run: `pnpm lint`  
Expected: PASS (or only pre-existing issues)

- [ ] **Step 4: Manual acceptance (spec checklist)**

- Tab favicon visible at 16px (Chrome/Firefox)
- Network tab: `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png` return 200
- Header + footer marks match SVG colors
- No 404 for icon assets on `pnpm preview`

- [ ] **Step 5: Optional final commit** (only if raster files regenerated)

```bash
git add public/favicon.ico public/apple-touch-icon.png
git commit -m "chore: regenerate favicon rasters"
```

---

## Spec Coverage (self-review)

| Spec requirement | Task |
|---|---|
| Variant 2 geometry | Task 1, 3 |
| Colors `#0c0c0e` / `#e63946` / `#fff` | Task 1, 3 |
| `favicon.svg` | Task 1 |
| `favicon.ico` + `apple-touch-icon.png` | Task 2 |
| `BrandMark.vue` with `size` | Task 3 |
| Header integration | Task 4 |
| Footer integration | Task 5 |
| `theme-color` | Task 6 |
| Accessibility (decorative in links) | Task 3–5 |
| Build verification | Task 7 |
| OG image | Out of scope (spec) |

## 16px center dot QA

If the white dot clutters at 16px in browser testing, bump chevron `stroke-width` to `3` in **both** `public/favicon.svg` and `BrandMark.vue`, re-run `pnpm generate:favicons`. Only remove the circle if still cluttered after stroke bump.
