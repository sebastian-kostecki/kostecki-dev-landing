# Projects Section — Design Spec

Date: 2026-07-01

## Goal

Polish personal projects copy (what it does + tech stack), fix i18n for card labels, add WIP badge for Menu Maker, and align action buttons to the bottom of project cards regardless of subtitle length.

## Decisions (from brainstorming)

| Topic | Decision |
|-------|----------|
| Content goal | D — full-stack proof + named technologies |
| Label | i18n via `ui.projectCardLabel`; remove "Side project" from subtitles |
| WIP | Optional `badge: "wip"` on Menu Maker only; `ui.wipBadge` |
| O Nią & O Niego | Prayer app for a future spouse — Ionic, Vue |
| Card layout | `flex h-full flex-col` + `mt-auto` on link row |
| Grid | `[&>*]:h-full` so cards stretch to equal height per row |

## Scope

### In scope

- `ui.projectCardLabel`, `ui.wipBadge`, `ui.projectScreenshotAlt` in PL/EN JSON
- `projects.items` subtitles; `badge` on Menu Maker
- `Project.badge?` in types
- `ProjectCard.vue`, `ProjectsSection.vue`

### Out of scope

- New projects, URL changes, Play Store link
- Projects section title change

## Approved Copy

See `src/content/pl.json` and `src/content/en.json` — `projects.items` and new `ui` keys.

## Success Criteria

- Buttons align at bottom when subtitles differ in length.
- PL locale shows "Projekt własny", not English "side project".
- Menu Maker shows WIP badge; subtitle has no "(WIP)" prefix.
- All three subtitles describe purpose + stack.
- `pnpm build` passes.
