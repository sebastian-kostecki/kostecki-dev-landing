# Production Readiness & Visual Audit — Design Spec

**Date:** 2026-05-31  
**Status:** Approved  
**Scope:** Hero layout fix, responsive audit, technical production gate for kostecki.dev landing

## Goals

| Priority | Goal |
|----------|------|
| Primary | Fix hero CTA ↔ section nav overlap on mobile (confirmed via screenshot) |
| Secondary | Systematic responsive audit at key breakpoints |
| Tertiary | Production gate: meta/OG, Lighthouse thresholds, prod build hygiene, assets |

**Success definition:** Page deployable to kostecki.dev with no layout overlap, passing Lighthouse thresholds on mobile, valid share previews, clean production bundle.

## Out of Scope (YAGNI)

- Analytics integration
- CI/CD pipeline
- English i18n / CMS
- Hamburger menu / sticky mobile nav (documented as known limitation — option 3a)
- Light-theme favicon variant

## Problem Statement

### Hero overlap (blocker)

On narrow/mobile viewports, hero CTA buttons ("Porozmawiajmy", "Doświadczenie") overlap section navigation links ("O mnie", "Doświadczenie", "Umiejętności") because:

- Section uses `min-h-screen` + `items-center` vertically centering content
- Nav uses `absolute bottom-8` inside the same container as CTAs
- Two distinct "Doświadczenie" elements (CTA secondary button vs `#experience` nav link) occupy the same vertical band

**Evidence:** `docs/superpowers/mockups/Zrzut ekranu 2026-05-31 220639.png`

## Solution: Hero Layout Refactor

**Approach:** Flex column layout (recommended approach 1). No `absolute` positioning for nav.

### Structure

```
<section min-h-screen flex flex-col>
  <div container flex-1 flex flex-col justify-between py-12>
    <div flex-1 flex flex-col justify-center>   ← h1, tagline, subtitle, CTAs
    <nav shrink-0 pt-10>                        ← section links in normal flow
  </div>
</section>
```

### Changes in `HeroSection.vue`

| Element | Before | After |
|---------|--------|-------|
| Section | `flex min-h-screen items-center` | `flex min-h-screen flex-col` |
| Container | `relative` + absolute nav | `flex flex-1 flex-col justify-between` with vertical padding |
| Content block | centered in full viewport | `flex flex-1 flex-col justify-center` |
| Nav | `absolute bottom-8 left-1/2 -translate-x-1/2` | `shrink-0` in flow; `pt-10` (min 40–48px gap from CTAs) |
| Desktop `lg+` | nav bottom-left | preserve: `lg:items-start`, content `lg:text-left` |

### Acceptance criteria (hero)

- [ ] At 375×667 (and 320px width): visible gap between CTA group and first nav link "O mnie"
- [ ] No text/button overlap at any tested breakpoint
- [ ] CTA secondary "Doświadczenie" and nav link "Doświadczenie" are vertically separated
- [ ] Natural vertical scroll allowed if content exceeds viewport (no overlap)

## Responsive Audit

### Breakpoints

| Width | Context |
|-------|---------|
| 320px | Minimum mobile |
| 375px | Standard phone (screenshot reference) |
| 390px | Modern iPhone |
| 768px | `md` breakpoint |
| 1024px | `lg` desktop hero |
| 1280px+ | Full container width |

### Per-breakpoint checklist

- [ ] No horizontal overflow (`overflow-x`)
- [ ] No overlapping interactive elements
- [ ] Readable body text (≥14px effective)
- [ ] Experience cards: logo + text flex layout intact
- [ ] Skills: compact/tags/grid wraps without overflow
- [ ] Projects: single column mobile, two columns `md+`
- [ ] Contact: cards and CTA block spacing OK
- [ ] Footer: grid and copyright row OK

### Method

**Hybrid audit (approach C):** Manual DevTools checklist at each breakpoint + optional Playwright screenshot of hero at 375px post-fix for regression guard.

## Mobile Navigation (Known Limitation — 3a)

**Current behavior:** Below `md`, sticky header shows logo only after scroll; nav links and "Kontakt" button hidden. Primary mobile nav is hero bottom links only.

**Decision:** Accept for this release (3a). Document in implementation plan; do not block deploy.

**Future options (not in scope):** 3b compact header nav scroll; 3c hamburger drawer.

## Technical Production Gate

### Lighthouse (mobile, on `vite preview` after production build)

| Category | Minimum score |
|----------|---------------|
| Performance | 90 |
| Accessibility | 95 |
| SEO | 95 |
| Best Practices | 95 |

**Remediation if below threshold (in order):**

1. Performance: font loading (`display=swap`), reduce font weights loaded
2. SEO: ensure meta/OG/canonical present
3. A11y: fix contrast or missing labels flagged by audit

### Open Graph & Twitter

Add to `index.html` (static for crawlers):

| Tag | Value source |
|-----|--------------|
| `og:title` | Match `meta.title` from `pl.json` |
| `og:description` | Match `meta.description` |
| `og:type` | `website` |
| `og:url` | `https://kostecki.dev/` |
| `og:locale` | `pl_PL` |
| `og:image` | `https://kostecki.dev/og-image.png` (new 1200×630 asset) |
| `twitter:card` | `summary_large_image` |
| `twitter:title`, `twitter:description`, `twitter:image` | Mirror OG |
| `link rel="canonical"` | `https://kostecki.dev/` |

Runtime `App.vue` continues to set `document.title` and `meta[name="description"]`.

### OG image asset

- **File:** `public/og-image.png`
- **Size:** 1200×630 px
- **Content:** Dark background (`#0c0c0e`), accent `#e63946`, name + tagline (minimal, on-brand)
- Generate via script or design tool; commit to repo

### Production build

- **Change:** `vite.config.ts` — include `vueDevTools()` only in development (`command === 'serve'` or explicit dev check)
- **Verify:** Production bundle does not include vue-devtools; `pnpm build` and `pnpm type-check` pass

### Static files

| File | Content |
|------|---------|
| `public/robots.txt` | Allow all; optional `Sitemap: https://kostecki.dev/sitemap.xml` |
| `public/sitemap.xml` | Single URL `https://kostecki.dev/` |

### Accessibility

- No critical/serious Lighthouse or axe violations
- Existing skip-link, `focus-visible` rings, `prefers-reduced-motion` preserved
- Verify `text-muted` (#a1a1aa) on `bg-bg` (#0c0c0e) meets WCAG AA for body text

### Asset verification

All paths referenced in `src/content/pl.json` (logos, skill icons via Iconify, experience SVGs) return 200 when served from `dist/` after build.

### Existing assets (no change expected)

- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`
- `theme-color` in `index.html`
- `BrandMark` in header/footer

## Files to Touch (Implementation Preview)

| File | Change |
|------|--------|
| `src/components/sections/HeroSection.vue` | Flex layout refactor |
| `index.html` | OG, Twitter, canonical |
| `vite.config.ts` | Dev-only vue-devtools |
| `public/og-image.png` | New |
| `public/robots.txt` | New |
| `public/sitemap.xml` | New (optional) |
| `docs/...` | Audit results log (optional, in plan) |

## Verification Checklist (Release)

- [ ] Hero overlap fixed at 320, 375, 390 px
- [ ] Full responsive checklist passed
- [ ] Lighthouse mobile thresholds met on preview build
- [ ] OG tags valid (Facebook Sharing Debugger or similar)
- [ ] Favicons load (no 404)
- [ ] `pnpm build` + `pnpm type-check` green
- [ ] No vue-devtools in production bundle
- [ ] All content assets resolve

## References

- Landing content spec: `docs/superpowers/specs/2026-05-31-landing-content-design.md`
- Brand mark spec: `docs/superpowers/specs/2026-05-31-brand-mark-design.md`
- Screenshot: `docs/superpowers/mockups/Zrzut ekranu 2026-05-31 220639.png`
