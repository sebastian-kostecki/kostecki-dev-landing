# Home Nav Reveal, CTA Background, and Skills Polish — Design Spec

## Goal

Polish three areas of the landing site after the home/skills refinement: hide the site header on the Home top viewport until the user scrolls, remove the visually cut-off CTA background treatment, and update Skills competency copy and tags to match current practice.

## Scope

In scope:

- Home-only sticky header reveal on scroll
- Home contact CTA background alignment with other sections
- Skills competency content updates in Polish and English JSON

Out of scope:

- Navigation structure, routes, or labels
- Core stack skills on Home or Skills
- Projects page content
- New components beyond header behavior

## Navigation (Home only)

### Behavior

- On route `/` (Home): the full site header starts hidden when the page is at the top.
- After the user scrolls past a small threshold (~32px), the header slides/fades in and stays sticky.
- Scrolling back to the top hides the header again.
- On all other routes (`/projects`, `/skills`, `/contact`, 404): the header is always visible, matching today’s behavior.
- Leaving Home resets to the always-visible state for the destination route.
- If the mobile menu is open while scrolling on Home, keep the header visible until the menu is closed (avoid trapping the user without a close control).

### Implementation notes

- Logic lives in `SiteHeader.vue` (route check + passive scroll listener).
- Use a short CSS transition (~200ms). Respect `prefers-reduced-motion` (instant show/hide, no motion).
- Do not break skip-to-content, focus order, or sticky stacking (`z-50`).
- Preferred approach: scroll threshold + `translate-y` / opacity, not IntersectionObserver or CSS-only tricks.

## Home CTA background

The final Home section (“Porozmawiajmy o współpracy” / English equivalent) currently uses `gradient-hero`, which visually separates from the flat sections above.

Change:

- Remove the `gradient-hero` overlay from that section.
- Keep the same section chrome as About / Projects / Skills previews: page background + top border + padding.
- Keep headline, subtitle, and primary CTA link unchanged.

## Skills content

Update `src/content/pl.json` and `src/content/en.json` competency categories as follows. No type or view structure changes are required unless copy keys already cover name/description/tags (they do).

### Infrastructure integrations

- Keep existing tags.
- Add: `Fastly`, `Admin Bolt`.

### WordPress

Replace the former “Automatyzacja WordPress” / “WordPress automation” group. Drop the previous `S3` tag; backups are stated in the description (and may appear as the `Backups` tag).

Polish:

- Name: `WordPress`
- Description: conveys handling WordPress sites, WP Cloud, backups, themes, and plugins (e.g. “Ogarniam WordPressy — WP Cloud, backupy, themes i plugins.”).
- Tags: `WordPress`, `WP Cloud`, `Backups`, `Themes`, `Plugins`

English:

- Name: `WordPress`
- Description: natural equivalent (e.g. managing WordPress sites, WP Cloud, backups, themes, and plugins).
- Tags: `WordPress`, `WP Cloud`, `Backups`, `Themes`, `Plugins`

### Billing

Polish:

- Name: `Billing` (drop “i WHMCS” from the title)
- Description: keep the sense of building billing modules / WHMCS workflows; may mention Stripe where natural.
- Tags: `WHMCS`, `Stripe`
- Remove: `Smarty`, `JavaScript`, `jQuery`

English:

- Name: `Billing`
- Description: natural equivalent
- Tags: `WHMCS`, `Stripe`
- Remove: `Smarty`, `JavaScript`, `jQuery`

### Tools and workflow

Polish:

- Description: Git, Cursor, and PhpStorm as the daily workflow (no LLM framing).
- Tags: `Git`, `Cursor`, `PhpStorm`
- Remove: `LLM`

English:

- Same tag set and equivalent description.

## Files expected to change

- `src/components/layout/SiteHeader.vue` — Home scroll reveal
- `src/views/HomeView.vue` — CTA section background
- `src/content/pl.json` — skills categories copy/tags
- `src/content/en.json` — skills categories copy/tags

## Acceptance criteria

- On Home at scroll position 0, the header is not visible; after scrolling down past the threshold, it appears; returning to top hides it again.
- On non-Home routes, the header is visible immediately.
- Home CTA section background matches neighboring sections (no gradient cut-off).
- Skills page shows Fastly and Admin Bolt under integrations; WordPress renamed and reworded; Billing named Billing with WHMCS + Stripe; Tools include PhpStorm and exclude LLM.
- Polish and English stay in sync structurally.
