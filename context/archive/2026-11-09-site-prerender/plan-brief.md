# Prerender tras, sitemap, JSON-LD i llms.txt — Plan Brief

> Full plan: `context/changes/site-prerender/plan.md`
> Research: `context/changes/site-prerender/research.md`

## What & Why

Każdy URL strony ma po buildzie zwracać własny HTML z treścią i własnymi meta, a nie ten sam pusty `index.html` z meta strony głównej (audyt B1). Odbiorca 3 z `site-focus.md` §1 (ATS, crawler, scraper AI) czyta HTML bez JavaScriptu i dziś widzi pustą stronę. Dopiero prerender nadaje sens sitemapie, JSON-LD `Person` i `llms.txt` (B3, B5), a przy okazji pozwala zwracać prawdziwe 404 (B4).

## Starting Point

Czysta SPA Vue: `createApp().mount('#app')`, 5 tras statycznych + catch-all w `src/router/index.ts`. Meta per trasa ustawia `App.vue` dopiero w `onMounted`, canonical i `og:url` zawsze wskazują `/`. `public/sitemap.xml` ma jeden URL, nginx odpowiada 200 z home na każdą ścieżkę. Treść to statyczny JSON w `src/content/`.

## Desired End State

`pnpm build` tworzy `dist/<trasa>/index.html` dla `/`, `/projects`, `/skills`, `/contact`, `/cv` (treść po polsku, własny title, description, og, canonical, JSON-LD) i `dist/404.html` (`noindex`, bez canonical). Do tego `sitemap.xml` z 5 URL-ami i `llms.txt`, oba wygenerowane z tej samej listy tras i treści. nginx serwuje pliki tras i zwraca 404 dla nieznanych ścieżek. W przeglądarce aplikacja startuje jak dziś.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Mechanizm prerenderu | Własny skrypt na `vue/server-renderer` + spike w fazie 1 | Zero nowych zależności; atuty vite-ssg (stan, dane) są tu nieużywane | Research / Plan |
| Start klienta | `createApp().mount`, bez hydracji | Brak całej klasy niezgodności (locale, staże, rok); świadomie akceptujemy podmianę PL→EN dla `en` | Plan |
| nginx / B4 | W zakresie: `try_files $uri $uri/index.html =404` + `error_page 404 /404.html` | Bez tego `404.html` jest martwy, a każda zła ścieżka daje 200 | Plan |
| Canonical / `og:url` | Per trasa; 404 bez canonical | Inaczej podstrony deklarują się jako kopia home i crawler je pomija | Plan |
| Źródło JSON-LD i llms.txt | Generowane z `pl.json` / `en.json`, tras i `career.ts` | Jedno źródło prawdy; reguła „liczby tylko z buildu” | Plan |
| Sitemap | Tylko `<loc>`, bez `lastmod`/`changefreq`/`priority` | Nic, co się zestarzeje lub zmienia przy każdym buildzie | Plan |
| Lista tras | Tablica `routes` w `src/router/routes.ts`, `staticPaths` wyliczane | Router, prerender, sitemap i llms.txt czytają jedno źródło | Research |
| Strażnik | Test vitest renderu + kontrola po buildzie w skrypcie (exit 1) | Brak CI w repo; build sam musi wyłapać regresję | Plan |
| Ikony Iconify | Puste `<span>` w prerenderze, akceptowane | D1 należy do `site-audit-tech-fixes`; linki mają `aria-label` | Research / Plan |

## Scope

**In scope:**
- Entry SSR, wydzielenie tras i meta z `App.vue`, prerender 5 tras + `404.html`
- Per-trasowe title, description, og, twitter, canonical, `og:url`; 404 z `noindex`
- Generowane `sitemap.xml`, JSON-LD `Person` + `WebSite`, `llms.txt`
- `docker/nginx.conf`: serwowanie plików tras i prawdziwe 404

**Out of scope:**
- Hydracja, locale w URL i `hreflang` (B2), vite-ssg, prerender przeglądarką
- Ikony offline (D1), dedup `og:locale` (B6), nagłówki bezpieczeństwa (D3)
- Zmiany treści w `src/content/*.json`, deploy na produkcję

## Architecture / Approach

`vite build` (klient → `dist/`) → `vite build --ssr src/entry-server.ts` (→ `dist-ssr/`) → `node scripts/prerender.mjs`. Skrypt czyta `dist/index.html` jako szablon (placeholder `#app` musi być dokładnie jeden), dla każdej ścieżki woła `render(path)` z bundla SSR i zapisuje pliki. Cała logika (meta, wstrzyknięcie, sitemap, JSON-LD, llms) siedzi w czystych modułach `src/seo/` z testami vitest; skrypt robi tylko I/O i końcową kontrolę.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Render SSR trasy (spike + TDD) | `routes.ts`, `pageMeta`, `entry-server.ts`, test B1 czerwony → zielony | SSR na Vite 8 / vue-router 5 / Iconify wymaga obejść → powrót do decyzji A/B |
| 2. Prerender do dist/ i build | `injectPage`, `scripts/prerender.mjs`, 5 plików tras + `404.html` | Kolejność buildu i podwójne wstrzyknięcie do szablonu |
| 3. Artefakty dla maszyn | `sitemap.xml`, JSON-LD, `llms.txt` z treści; usunięty `public/sitemap.xml` | Treść generowana z JSON-a brzmi sztywno w `llms.txt` |
| 4. nginx — prawdziwe 404 | `try_files … =404`, `error_page 404 /404.html`, curl na `nginx:alpine` | Conf wymaga deployu przez repo infra |

**Prerequisites:** zakończone `site-focus-hero`, `-ai-proof`, `-experience` (są w archiwum); Docker lokalnie do fazy 4.
**Estimated effort:** ~2–3 sesje w 4 fazach.

## Open Risks & Assumptions

- Rekomendacja „własny skrypt” to osąd bez prototypu; faza 1 jest spike'iem i zatrzymuje się, jeśli potrzebne są obejścia większe niż `ssr.noExternal`.
- Odwiedzający z `en` zobaczą krótką podmianę PL → EN przy starcie (świadomy kompromis do czasu B2). Crawlery renderujące JS (Googlebot, prawdopodobnie `en-US`) zindeksują wersję EN; polski prerender trafia tylko do czytników bez JS.
- Staże i rok w stopce w statycznym HTML pochodzą z dnia buildu; klient przelicza je przy starcie.
- Do deployu `dist/` ze starym confem nginx strona działa, ale nieznane ścieżki dalej dają 200.

## Success Criteria (Summary)

- `curl https://kostecki.dev/projects` bez JS zwraca treść projektów i tytuł „Projekty — Sebastian Kostecki” z canonical na `/projects`.
- `/nie-ma` zwraca HTTP 404 ze stroną 404; sitemap ma 5 URL-i; JSON-LD i `llms.txt` zgadzają się z treścią strony.
- `pnpm build` wykłada się z czytelnym komunikatem, gdy którejś trasy nie da się wyrenderować.
