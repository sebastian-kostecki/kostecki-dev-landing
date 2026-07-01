# Skills Section — Design Spec

Date: 2026-07-01

## Goal

Rework the **Skills** section so the core stack (PHP, Laravel, etc.) feels integrated with the rest of the page narrative, reorganize integration categories to align with Experience responsibility areas, and fix the visual bug where expanded category panels lack top spacing (chip hover bleeds into the button area).

## Decisions (from brainstorming)

| Topic | Decision |
|-------|----------|
| Core presentation | D — `surface-card` wrapper + Vue.js added to core row |
| Categories | B — merge 7 categories into 5, mapped to experience areas |
| Category split | Infrastruktura, Storage i backup, WordPress i billing, Frontend, Narzędzia |
| Core copy | New `coreTitle` + rewritten `coreDescription` with bridge to Experience |
| Panel visual fix | `border-t border-border pt-4` on expanded panel in `SkillCategory.vue` |
| Collapsible categories | Kept — no change to interaction model |

## Scope

### In scope

- `skills.coreTitle`, `skills.coreDescription`, `skills.core`, `skills.categories` in `pl.json` and `en.json`
- `skills.coreTitle` added to `Content` type in `src/types/content.ts`
- `SkillsSection.vue` — wrap core block in `surface-card`, render `coreTitle`
- `SkillCategory.vue` — top padding/separator on expanded panel

### Out of scope

- New skill items not already on the page
- Changes to `SkillIcon.vue`, Projects, Contact
- Collapsed-by-default behaviour change
- Skills category count other than 5

## Approved Content

### Core — Polish

- `coreTitle`: `Stack podstawowy`
- `coreDescription`: `Stack, w którym buduję i utrzymuję produkcyjny backend — oraz frontend, gdy feature tego wymaga. Kategorie integracji poniżej odpowiadają obszarom z mojego doświadczenia.`
- `core`: PHP, Laravel, MySQL, Docker, Vue.js (Vue.js moved from Frontend category)

### Core — English

- `coreTitle`: `Core stack`
- `coreDescription`: `The stack I use to build and maintain production backends — and frontend when a feature requires it. The integration categories below mirror the areas from my experience.`
- `core`: PHP, Laravel, MySQL, Docker, Vue.js

### Categories — Polish

1. **Infrastruktura** — cPanel, Plesk, DirectAdmin, WP Cloud, PowerDNS, Cloudflare, Bunny DNS, Let's Encrypt, mailcow
2. **Storage i backup** — S3, FTP, SFTP, FTPS
3. **WordPress i billing** — Google Analytics, AWStats, WHMCS, Extendify, TenWeb
4. **Frontend** — Vuetify, Tailwind CSS, JavaScript, Ionic, Inertia.js
5. **Narzędzia** — Git, Cursor

### Categories — English

1. **Infrastructure** — same items
2. **Storage and backup** — same items
3. **WordPress and billing** — same items
4. **Frontend** — same items
5. **Tools** — same items

## Component Changes

### `SkillsSection.vue`

Replace the flat core chip row with:

```html
<div class="surface-card p-5 lg:p-6">
  <h3 class="font-display text-lg font-semibold text-white">{{ content.skills.coreTitle }}</h3>
  <div class="mt-4 flex flex-wrap gap-3">
    <!-- tech-tag chips for core items -->
  </div>
  <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
    {{ content.skills.coreDescription }}
  </p>
</div>
```

### `SkillCategory.vue`

Change expanded panel classes from:
`flex flex-wrap gap-2 px-4 pb-5 lg:px-5`

To:
`flex flex-wrap gap-2 border-t border-border px-4 pt-4 pb-5 lg:px-5`

## Rationale

**Before:** Core skills were orphan chips with a generic description; seven narrow categories duplicated Experience as a flat tech catalog; expanded panels had no top spacing causing hover clipping on `overflow-hidden` cards.

**After:** Core sits in a card with narrative bridge text; five categories mirror Experience responsibility areas; Vue.js is visible in core matching About/Experience full-stack story; panel separator fixes the visual bug.

## Success Criteria

- Core stack displayed inside `surface-card` with title and bridge description.
- Exactly 5 categories in PL and EN with items as specified.
- Vue.js in `core`, not in Frontend category.
- Expanded category panel has visible top spacing; chip hover does not clip at panel top.
- `pnpm build` passes; both locales render correctly.

## Implementation Notes

- Update `Content` interface before JSON files (TypeScript will catch missing `coreTitle`).
- Reorder `categories` array in JSON — no schema change beyond `coreTitle`.
- Manual check: expand each category, hover top-row chips.
