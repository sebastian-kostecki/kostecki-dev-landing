# Experience Section Copy — Design Spec

Date: 2026-07-01

## Goal

Polish the **Experience** section text (`experience.entries` in PL/EN content JSON) while keeping the existing visual layout and component structure unchanged. Copy should read as **achievements grouped by responsibility** (not a flat integration catalog), aligned with the recruiter-friendly positioning from hero and about sections.

## Decisions (from brainstorming)

| Topic | Decision |
|-------|----------|
| Primary goal | D — achievements + fewer, better-grouped bullets |
| PanelAlpha bullets | 5 (option A: strongest differentiators only) |
| Grouping | C — by area of responsibility |
| PanelAlpha summary | D — one sentence product context + one sentence scope (max 2 sentences) |
| ModulesGarden period | A — keep `~6 months` as initial company stage; WHMCS modules as early work within MG |
| ModulesGarden detail | User-provided WHMCS modules grouped into 3 highlight bullets |
| Analytics (GA, AWStats) | Omitted from highlights — covered in Skills |
| Visual / component | No changes to `ExperienceSection.vue` |

## Scope

### In scope

- `experience.entries[0]` (PanelAlpha): `summary`, `highlights` in `pl.json` and `en.json`
- `experience.entries[1]` (ModulesGarden): `summary`, `highlights` (new field) in `pl.json` and `en.json`
- `role`, `period`, `project`, URLs, logos — unchanged unless noted

### Out of scope

- `ExperienceSection.vue` — already supports optional `highlights` on any entry
- Skills section content
- Hero, About, Projects, Contact
- Employment period change for ModulesGarden (stays `~6 miesięcy` / equivalent EN)

## Approved Copy

### PanelAlpha — Polish

**summary:**
`Rozwijam backend Laravel w produkcyjnej platformie B2B do automatyzacji WordPress dla firm usługowych. Odpowiadam za API, integracje z zewnętrzną infrastrukturą i logikę zarządzania instancjami WordPress.`

**highlights** (5 items):
1. `Integracje infrastrukturalne — panele hostingowe (cPanel, Plesk, DirectAdmin, WP Cloud), DNS (PowerDNS, Cloudflare, Bunny), serwery email (mailcow) i automatyzacja certyfikatów SSL (Let's Encrypt)`
2. `Cykl życia WordPress — import i zarządzanie instancjami, obsługa Git, onboarding (Extendify, 10Web)`
3. `Backup i storage — lokalne i zdalne kopie zapasowe (S3, FTP, SFTP, FTPS)`
4. `Billing i API — integracje z WHMCS i rozwój warstwy API platformy`
5. `Full-stack gdy trzeba — frontend (Vue.js, Vuetify) przy feature'ach wymagających zmian po stronie backendu i UI`

### PanelAlpha — English

**summary:**
`I develop the Laravel backend of a production B2B platform that automates WordPress management for service companies. I'm responsible for APIs, integrations with external infrastructure, and the logic for managing WordPress instances.`

**highlights** (5 items):
1. `Infrastructure integrations — hosting panels (cPanel, Plesk, DirectAdmin, WP Cloud), DNS (PowerDNS, Cloudflare, Bunny), mail servers (mailcow), and SSL certificate automation (Let's Encrypt)`
2. `WordPress lifecycle — instance import and management, Git support, onboarding (Extendify, 10Web)`
3. `Backup and storage — local and remote backups (S3, FTP, SFTP, FTPS)`
4. `Billing and API — WHMCS integrations and platform API development`
5. `Full-stack when needed — frontend (Vue.js, Vuetify) for features that span backend and UI`

### ModulesGarden — Polish

**summary:**
`Tworzyłem autorskie moduły WHMCS dla platformy billingowej hosterów — logika biznesowa, integracje i narzędzia operacyjne (PHP, JavaScript, Smarty).`

**highlights** (3 items — new):
1. `Automatyzacja billingu — m.in. Invoice Sub Status, AutomatedRefuncs, auto-upgrade przy wcześniejszej płatności, opłaty admin przy zmianie produktu`
2. `Integracje — Domain data from Plesk, Docker S3 Container`
3. `Narzędzia operacyjne — BulkUpdater do masowych aktualizacji w WHMCS`

`project` field stays: `Moduły WHMCS`

### ModulesGarden — English

**summary:**
`I built custom WHMCS modules for a hosting billing platform — business logic, integrations, and operational tooling (PHP, JavaScript, Smarty).`

**highlights** (3 items — new):
1. `Billing automation — including Invoice Sub Status, AutomatedRefuncs, auto-upgrade on early payment, admin fees on product changes`
2. `Integrations — Domain data from Plesk, Docker S3 Container`
3. `Operational tooling — BulkUpdater for bulk updates in WHMCS`

`project` field stays: `WHMCS modules`

## Rationale

**Before:** PanelAlpha had 10 bullets prefixed with “Integracje z…”, largely duplicating Skills. Summary used hosting jargon (“dla hosterów”). ModulesGarden was a single generic sentence with no mention of the user's actual WHMCS modules.

**After:** Five responsibility-based bullets show scope and ownership. Technologies appear as examples inside each bullet, not as the primary structure. ModulesGarden highlights name real shipped modules grouped by billing, integrations, and tooling. Period stays `~6 months` per user — early MG stage; longer module timeline is implicit continuation within the same employer context (PanelAlpha path).

## Consistency with other sections

| Section | Relationship |
|---------|--------------|
| Hero | General PHP/backend positioning; Experience provides technical depth |
| About | Product context and work style; Experience provides responsibility areas |
| Skills | Technology list; Experience shows what was built with them |

## Success Criteria

- PanelAlpha has exactly 5 highlights; ModulesGarden has exactly 3 highlights.
- No bullet starts with repetitive “Integracje z…” pattern.
- Summary texts are at most 2 sentences per entry.
- PL and EN convey the same structure and messaging; EN is natural technical prose.
- `ExperienceSection.vue` renders without code changes (ModulesGarden gains collapsible highlights like PanelAlpha).

## Implementation Notes

- Update `experience.entries` in `src/content/pl.json` and `src/content/en.json`.
- Add `highlights` array to ModulesGarden entry (component already supports it).
- Verify JSON validity and `pnpm build`.
- Manual check: both entries, expand/collapse on ModulesGarden highlights.
