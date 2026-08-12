# Commercial Projects Hierarchy — Design Spec

Date: 2026-08-12

## Goal

Rework the Projects presentation so recruiters immediately recognize commercial production work as the strongest part of the portfolio. PanelAlpha becomes the flagship project, the independently delivered ModulesGarden WHMCS modules become a grouped commercial realization, and personal projects remain visible as supporting work.

## Decisions

- Keep the navigation label **Projects** and route `/projects`.
- Optimize the page primarily for recruiters and prospective employers.
- Present PanelAlpha as the flagship commercial project and link only to `https://panelalpha.com`.
- Present the five ModulesGarden products as one grouped realization rather than five equivalent case studies.
- State clearly that the WHMCS modules were implemented independently as part of work for ModulesGarden.
- Do not link the ModulesGarden modules because their former product pages are no longer available.
- Keep personal projects, but give them lower visual and editorial priority.
- Keep all content bilingual through the existing `pl.json` and `en.json` system.

## Scope

In scope:

- Reorganize the Home Projects section and `/projects`.
- Add dedicated presentation components for the PanelAlpha feature and grouped WHMCS modules.
- Restructure project content data into explicit commercial and personal categories.
- Rewrite route metadata and section copy to emphasize commercial work.
- Preserve working demo and repository links for personal projects.

Out of scope:

- New routes or navigation labels.
- New screenshots, unverifiable performance metrics, or confidential implementation details.
- Links to unavailable ModulesGarden module pages.
- Changes to the Experience section beyond avoiding unnecessary duplicate copy.
- Changes to the current palette or overall pixel-perch visual system.

## Information Architecture

### Home

The Home Projects section becomes a concise commercial-work preview:

1. A prominent PanelAlpha feature.
2. A compact ModulesGarden summary stating that five WHMCS modules were independently delivered.
3. A link to the complete `/projects` page.

Personal projects do not appear in the Home preview. This keeps the first portfolio impression aligned with the commercial backend positioning established by the Hero and Experience sections.

### Projects page

The page retains the title **Projects** and uses three levels of hierarchy:

1. **PanelAlpha — flagship commercial project**
2. **WHMCS modules for ModulesGarden — grouped commercial realization**
3. **Personal projects — supporting portfolio work**

The route introduction describes production and commercial work rather than personal experiments.

## PanelAlpha Feature

PanelAlpha uses a wide featured panel rather than a standard project card. It contains:

- A label equivalent to “Flagship commercial project”.
- Product name and a concise explanation of the B2B WordPress automation platform.
- A clearly labeled “My contribution” area.
- Selected responsibility areas:
  - Laravel backend and platform API development.
  - Hosting, DNS, email, SSL, onboarding, backup, and storage integrations.
  - WordPress instance lifecycle and Git support.
  - WHMCS integration and related billing logic.
  - Vue.js and Vuetify work when features span backend and UI.
- Relevant technology tags.
- A single external CTA to `https://panelalpha.com`, opening in a new tab with safe link attributes.

The copy describes areas of responsibility without inventing ownership of the entire product or introducing unsupported metrics.

## ModulesGarden WHMCS Group

ModulesGarden appears as one commercial-work panel with:

- The heading “WHMCS modules for ModulesGarden”.
- A statement that the modules were independently implemented while working for ModulesGarden.
- One shared technology list: PHP, HTML, CSS, JavaScript, jQuery, Smarty, and WHMCS.
- Five compact module entries:
  - **Domain Data From Plesk** — exposes Plesk domain data in the WHMCS workflow.
  - **Invoice Sub Status** — adds more granular invoice status handling.
  - **Automated Refunds** — automates refund processing in WHMCS.
  - **Auto Upgrade For Early Payments For WHMCS** — automates the configured upgrade flow for early payments.
  - **BulkUpdater** — supports bulk updates of WHMCS records.

Each module entry contains only its name and one functional sentence. There are no buttons, screenshots, or external links. The shared stack is not repeated on every entry.

## Personal Projects

The existing personal projects remain on `/projects`:

- Ogarniam Portfel
- O Nią & O Niego
- Menu Maker

They continue to use the current card treatment and preserve available demo and GitHub links. Their section is placed after commercial work and uses a quieter heading and layout so it remains valuable without competing with the flagship content.

## Components and Boundaries

The presentation uses focused components with separate responsibilities:

- `PanelAlphaFeature` renders the flagship product, contribution areas, tags, and optional product link.
- `CommercialProjectGroup` renders the ModulesGarden context, shared stack, and module list.
- `CommercialProjectItem` renders one non-clickable WHMCS module entry.
- The existing `ProjectCard` remains responsible for personal projects.

Home and Projects views compose these components but do not encode project-specific content or infer project types from array positions.

## Content Model and i18n

The `projects` content shape is divided explicitly:

- `featured`: PanelAlpha content, responsibilities, tags, and optional link.
- `commercialGroup`: ModulesGarden context, authorship statement, shared tags, and module entries.
- `personal`: the existing personal-project section copy and project array.

Both locale files use the same structure. Project type and presentation are determined by the schema, not title matching or item order. UI labels required by the new components are localized.

The `/projects` metadata in both languages is updated to describe selected commercial and personal work. It must no longer characterize the route as personal projects only.

## Error and Edge Handling

- Optional links render only when a non-empty URL exists.
- ModulesGarden entries remain intentionally non-clickable.
- Missing optional artwork or logos do not leave blank media containers; text content expands into the available space.
- External links use `target="_blank"` with `rel="noopener noreferrer"`.
- Locale switching preserves the route and section structure.

## Verification

- Verify the hierarchy at mobile, tablet, and desktop widths.
- Verify that PanelAlpha is visually dominant and its link resolves correctly.
- Verify that all five WHMCS modules render with no empty or dead CTAs.
- Verify that the independent-delivery statement and common stack appear in PL and EN.
- Verify that personal-project demo and repository links still work.
- Verify that Home contains only the commercial preview and links to `/projects`.
- Verify localized `/projects` titles and descriptions.
- Run the repository's available format, lint, type-check, test, and production-build commands.

## Success Criteria

A recruiter scanning the portfolio should be able to identify, in order:

1. PanelAlpha as the primary production product.
2. The candidate's concrete responsibility areas within PanelAlpha.
3. Five independently delivered WHMCS modules as a grouped commercial body of work.
4. Personal projects as supporting evidence of initiative and broader technical exploration.

The page must communicate this hierarchy without implying unavailable product links, unsupported metrics, or ownership beyond the stated contribution.
