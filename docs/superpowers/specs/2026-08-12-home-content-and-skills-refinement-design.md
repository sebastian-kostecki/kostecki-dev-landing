# Home Content and Skills Refinement — Design Spec

Date: 2026-08-12

## Goal

Make the home page a concise recruiter-facing introduction that leads to focused subpages instead of repeating them. Commercial experience will be presented through concrete work on the Projects page, while Skills will distinguish the core stack from broader competencies and supporting technologies.

## Decisions

- Remove the “At a glance” panel from the Home hero.
- Remove the entire “Commercial work” / experience section from Home.
- Keep the current “How I work” content unchanged.
- Keep a compact commercial-project preview on Home.
- Keep only the existing core stack preview on Home and link to the complete Skills page.
- Present employment context within commercial realizations on the Projects page.
- Organize the Skills page around competencies, with individual products and providers shown as supporting tags.
- Keep Cursor and explicitly communicate LLM-assisted development as part of the development workflow.
- Preserve bilingual PL/EN content and the current crimson pixel-perch visual system.

## Home Information Architecture

The Home page uses this order:

1. Hero
2. How I work
3. Selected commercial work
4. Core stack
5. Contact CTA

The “At a glance” panel and commercial-experience timeline are removed. This eliminates metrics and responsibility lists that repeat content presented later on the same page or on dedicated routes.

### Hero

The hero retains:

- role label,
- name,
- primary value proposition,
- contact CTA,
- Projects CTA.

The right-side “At a glance” panel is removed. The text column may use the available width rather than leaving an empty grid column.

Polish value proposition remains:

> Buduję i rozwijam produkcyjne aplikacje backendowe w PHP.

The Polish supporting sentence becomes:

> Rozwijam platformy B2B, integracje API oraz automatyzację infrastruktury i WordPress.

The English version must convey the same meaning naturally rather than mirror Polish word order.

### How I Work

The existing three paragraphs remain unchanged in both languages, including the mention of using Cursor to support implementation and refactoring.

### Selected Commercial Work

Home shows only:

- a compact PanelAlpha feature,
- a compact summary of five independently implemented WHMCS modules,
- a link to `/projects`.

Home uses route-specific preview copy rather than reusing the broader Projects-page introduction.

Polish:

- Title: “Wybrane realizacje komercyjne”
- Subtitle: “PanelAlpha oraz pięć samodzielnie zaimplementowanych modułów WHMCS.”

English copy should communicate “Selected commercial work” and the same authorship scope.

The preview must remain concise. Detailed responsibilities, module descriptions, employment context, and personal projects belong on `/projects`.

### Core Stack

Home keeps the current core stack:

- PHP
- Laravel
- MySQL
- Docker
- Vue.js

It retains the link to `/skills`. No secondary competency groups or provider lists appear on Home.

### Contact CTA

The final CTA headline becomes “Porozmawiajmy o współpracy” in Polish, with a natural English equivalent. Existing contact methods and the dedicated Contact page remain unchanged.

## Projects as Commercial Experience

The Projects page becomes the only detailed presentation of commercial experience. It does not add a separate employment timeline.

### PanelAlpha

The PanelAlpha feature includes:

- employment context: ModulesGarden,
- role: Backend Developer,
- period: 3.5+ years,
- product description,
- contribution areas,
- technology tags,
- external link to `https://panelalpha.com`.

The description explains the product. The contribution list describes the candidate’s work and must not repeat the product description.

### WHMCS Modules

The ModulesGarden group includes:

- employer: ModulesGarden,
- role: PHP Developer,
- period: approximately six months,
- independent-implementation statement,
- shared technology stack,
- five non-clickable module entries.

The wording must not imply ownership of ModulesGarden or link to unavailable product pages.

### Personal Projects

Personal projects remain below commercial work with their existing secondary visual priority and available links.

## Skills Page

The Skills page begins with the unchanged core stack, followed by competency-oriented groups. Supporting technologies appear as tags or secondary labels rather than equal-sized primary skill cards.

### Infrastructure Integrations

Communicates experience integrating:

- hosting panels,
- DNS providers,
- SSL automation,
- e-mail infrastructure.

Relevant providers such as cPanel, Plesk, DirectAdmin, WP Cloud, PowerDNS, Cloudflare, Bunny DNS, Let’s Encrypt, and mailcow may appear as supporting tags.

### WordPress Automation

Communicates:

- WordPress instance lifecycle,
- Git support,
- onboarding integrations,
- backup workflows.

Vendor-specific onboarding products do not need standalone skill cards.

### Billing and WHMCS

Communicates commercial WHMCS module development and related web technologies. WHMCS, Smarty, JavaScript, and jQuery may appear as supporting tags.

### Supporting Frontend

Communicates the ability to implement UI portions of backend-led features. Vue.js, Vuetify, and Tailwind CSS are retained. Personal-project technologies such as Ionic and Inertia.js remain attached to those projects rather than the main Skills taxonomy.

### Tools and Workflow

Communicates:

- Git,
- LLM-assisted development,
- Cursor as the currently used tool.

Cursor is not presented as equivalent to a programming language or framework. It is evidence of an AI-assisted development workflow.

### Removed Standalone Items

The following no longer render as separate primary skills:

- FTP, SFTP, and FTPS,
- Google Analytics,
- AWStats,
- Extendify,
- TenWeb,
- Ionic,
- Inertia.js.

These may remain in project content or as contextual supporting tags where they provide useful evidence.

## Content Model

The bilingual content model should separate:

- Home project-preview headings from Projects-page headings,
- commercial-project employment metadata from project descriptions,
- core skills from competency groups and their supporting tags,
- AI-assisted workflow wording from the Cursor tool label.

Views must consume explicit fields and must not infer presentation from names, array positions, or locale-specific text.

## Consistency and Numbering

- Home section indices follow the final visible order and contain no duplicate numbers.
- Subpage indices are scoped to their own page hierarchy and do not need to continue Home numbering.
- Polish and English files retain equivalent structures.
- Route metadata continues to describe the content actually visible on each route.

## Accessibility and Responsive Behavior

- Removing the hero-side panel must not leave an empty layout column.
- Skill competency groups remain readable without relying on icons alone.
- Supporting tags wrap correctly at mobile widths.
- Existing focus states, heading hierarchy, safe external-link attributes, and responsive spacing are preserved.

## Verification

- Confirm “At a glance” and Home commercial-experience timeline no longer render.
- Confirm Home follows the approved five-section order.
- Confirm Home project copy describes only commercial work.
- Confirm `/projects` shows employer, role, and period for both commercial realizations.
- Confirm project descriptions and responsibility lists do not duplicate each other.
- Confirm Home shows only the five core-stack skills.
- Confirm `/skills` uses competency groups and retains Cursor/LLM-assisted workflow.
- Confirm removed technologies do not render as standalone primary skills.
- Confirm Polish and English structures and meanings match.
- Check mobile, tablet, and desktop layouts.
- Run formatting, lint, type-check, and production build commands.

## Success Criteria

A recruiter scanning Home should quickly understand the candidate’s specialization, working style, strongest commercial work, core stack, and contact path without reading the same experience twice. Detailed commercial experience should be discoverable through projects, and the Skills page should communicate coherent capabilities rather than an undifferentiated inventory of tools.
