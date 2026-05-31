# Brand Mark & Favicon — Design Spec

**Date:** 2026-05-31  
**Status:** Approved (variant 2)  
**Scope:** Site icon, favicon, header/footer logo for kostecki.dev

## Goals

| Priority | Goal |
|---|---|
| Primary | Recognizable tab/bookmark icon aligned with dark landing theme |
| Secondary | Replace text initials (`SK`) in header/footer with a consistent mark |
| Tertiary | Single master asset usable for future OG/social images |

## Decision Summary (Brainstorming)

| Topic | Choice |
|---|---|
| Identity | Code-related mark; **not** literal readable `SK` monogram |
| Motif | Angle-bracket / chevron language (API, HTML) |
| **Selected variant** | **2 — overlapping chevrons** (abstract cross) |
| Color | **A** — dark tile `#0c0c0e`, accent `#e63946`, white detail |
| Placement | **C** — favicon, header, footer, future OG |

### Trade-off (explicit)

Variant 2 prioritizes **legibility at 16px** and a minimal “dev” symbol over readable initials. The mark is **abstract** (crossed chevrons + center point), not typographic `SK`. This supersedes earlier preference for geometric `SK` (variant 1).

Reference mockup: `docs/superpowers/mockups/brand-mark-variants.html` (variant 2 card).

## Visual Specification

### Canvas

- `viewBox="0 0 32 32"`
- Background: rounded rect `width="32" height="32" rx="6" fill="#0c0c0e"`

### Mark geometry (variant 2)

| Layer | Description |
|---|---|
| Chevrons | Two diagonal strokes forming an X (suggested `<` `>` intersection) |
| Center | White focal point — `circle` at `(16, 16)` for ≥32px; at 16px optional minimal dash or dot per legibility test |

**Chevron paths (32px reference):**

- Line A: `(7, 5) → (25, 27)`
- Line B: `(25, 5) → (7, 27)`
- Stroke: `#e63946`, `stroke-width="2.6"`, `stroke-linecap="round"`, no fill

**Center (≥32px):**

- `circle cx="16" cy="16" r="2" fill="#ffffff"`

**16px note:** Same geometry; stroke may increase slightly (~3) if needed after visual QA. Center dot may be omitted or reduced to 1px if it clutters — prefer keeping dot if still crisp.

### Color tokens (match `src/assets/main.css`)

| Token | Hex |
|---|---|
| Background | `#0c0c0e` |
| Accent (chevrons) | `#e63946` |
| Detail (center) | `#ffffff` |

No light-mode alternate in scope (YAGNI).

## Asset & File Plan

| Asset | Path | Size / notes |
|---|---|---|
| Master SVG | `public/favicon.svg` | 32×32 viewBox, scalable |
| Favicon ICO | `public/favicon.ico` | 32×32 (multi-size optional: 16+32) |
| Apple touch | `public/apple-touch-icon.png` | 180×180 PNG from SVG |
| Vue component | `src/components/ui/BrandMark.vue` | Props: `size` (px), optional `class` |

`index.html` already references these paths; missing `.ico` / `.png` will be added at implementation.

**Generation:** Export raster from master SVG (script with `sharp`/`resvg`, or one-time manual export). Document command in implementation plan.

## UI Integration

| Location | Change |
|---|---|
| `SiteHeader.vue` | Replace `{{ initials }}` text with `<BrandMark :size="28" />` inside home link |
| `SiteFooter.vue` | Add small `BrandMark` (20–24px) near copyright row for brand consistency |
| `index.html` | Optional `meta name="theme-color" content="#0c0c0e"` |

### Accessibility

- Home link keeps `aria-label="Strona główna"`.
- `BrandMark` uses `role="img"` and `aria-label="Sebastian Kostecki"` when not decorative; when inside labeled link, use `aria-hidden="true"` on mark.

## Out of Scope

- Open Graph image template (1200×630) — noted for future; same palette and mark
- Separate simplified SVG for 16px (variant 2 does not require dual assets)
- Light-theme favicon variant
- Animated logo

## Testing / Acceptance

- [ ] `favicon.svg` renders clearly at 16px and 32px in Chrome/Firefox tab
- [ ] `favicon.ico` and `apple-touch-icon.png` exist and load (no 404)
- [ ] Header/footer show mark at intended sizes on mobile and desktop
- [ ] Mark colors match `--color-bg` and `--color-accent`
- [ ] `pnpm build` succeeds; no layout shift in sticky header

## Mockup → Production

The HTML mockup is directional. Implementation must refine:

- Symmetric stroke endpoints with equal padding inside `rx="6"` tile
- Crisp PNG export (no blurry rasterization)
- Final decision on center dot at 16px after browser check
