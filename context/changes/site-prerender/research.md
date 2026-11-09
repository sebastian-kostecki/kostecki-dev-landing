---
date: 2026-11-09T13:57:30+01:00
researcher: Claude (Sonnet 5.5)
git_commit: 6701dcf701622ac8a8507b0a642312e84ef03fed
branch: development
repository: kostecki-dev-landing
topic: "Prerender wszystkich tras po buildzie: post-build prerender vs vite-ssg; sitemap, JSON-LD Person, llms.txt z design/hero-variants"
tags: [research, prerender, vite-ssg, ssr, sitemap, json-ld, llms-txt, nginx]
status: complete
last_updated: 2026-11-09
last_updated_by: Claude (Sonnet 5.5)
---

# Research: prerender tras + sitemap, JSON-LD, llms.txt

**Date**: 2026-11-09T13:57:30+01:00
**Branch**: development @ 6701dcf (drzewo robocze z niezatwierdzonymi `context/`, kod aplikacji bez zmian)
**Repository**: kostecki-dev-landing

## Research Question

Jak prerenderować wszystkie trasy z `src/router` po buildzie (audyt B1), które podejście jest tańsze dla treści będącej statycznym JSON-em: post-build prerender czy `vite-ssg`; co z gałęzi `design/hero-variants` (sitemap, JSON-LD `Person`, `llms.txt`) przenieść po prerenderze.

## Summary

- Na `development` każda trasa dostaje ten sam `index.html` z meta strony głównej; tytuł i opisy są podmieniane dopiero w `App.vue` w `onMounted`/`watch` (`src/App.vue:35-45`), a `dist/` zawiera tylko `index.html` (sprawdzony katalog `dist/` z ostatniego buildu).
- Router ma 6 tras: 5 statycznych (`/`, `/projects`, `/skills`, `/contact`, `/cv`) i catch-all `/:pathMatch(.*)*` (`src/router/index.ts:11-19`). Prerender dotyczy pięciu statycznych; strona 404 wymaga osobnego, ręcznego wyjścia (catch-all ma parametr).
- Kod jest w większości gotowy na SSR: jedyne odwołania do `window`/`document` na ścieżce renderowania są za `typeof window` (`useLocale.ts:8`) albo w `onMounted` (`SiteHeader.vue:48`, `App.vue:45`); `window.print()` jest w handlerze (`CvView.vue:17`). To wynik grepa po `src/` na `development`, nie uruchomienia SSR.
- Trzy przeszkody wspólne dla obu podejść: (1) meta per trasa jest ustawiane tylko po stronie klienta, (2) locale na serwerze to zawsze `pl` (`useLocale.ts:8`), więc użytkownik z `en` przy hydracji dostanie niezgodność, (3) ikony `@iconify/vue` w prerenderze będą pustymi `<span>` (patrz niżej).
- **Rekomendacja (osąd, bez prototypu): własny skrypt post-build na `vue/server-renderer`, nie `vite-ssg`.** Powód: treść to statyczny JSON, więc zalety vite-ssg (stan początkowy, pobieranie danych, `useHead`) nie są używane, a koszt to 7 nowych zależności bezpośrednich (w tym `jsdom`) i przebudowa `main.ts`. Pierwszy krok planu powinien być spike'em potwierdzającym ten wybór (patrz Open Questions).
- Z `design/hero-variants` przenosimy tylko trzy artefakty: `public/llms.txt`, blok JSON-LD z `index.html`, `public/sitemap.xml` (jako wzór; lepiej generowany). Nie przenosimy commit logu ani reszty gałęzi — `context/foundation/site-focus.md` §4 wyklucza commit log z hero.

## Detailed Findings

### Stan obecny (development)

- Router: `createWebHistory(import.meta.env.BASE_URL)`, 5 tras statycznych + catch-all, `scrollBehavior` (`src/router/index.ts:9-24`).
- `main.ts` to 4 linie: `createApp(App).use(router).mount('#app')` (`src/main.ts`). Brak eksportu fabryki aplikacji, więc SSR wymaga wydzielenia `createApp`.
- `vite.config.ts` ma pluginy `tailwindcss`, `vue`, devtools tylko przy `serve`; brak konfiguracji SSR.
- Skrypty: `build` = `generate:archive` → `type-check` ‖ `vite build` (`package.json` scripts). `generate:archive` zapisuje `src/generated/archive.json` i wymaga sieci (GitHub API) z fallbackiem (`scripts/fetch-archive-count.mjs:1-30`).
- `index.html` zawiera statyczne `og:*`, `twitter:*`, canonical `https://kostecki.dev/`, description; `og:locale:alternate` jest zduplikowany (B6, poza zakresem).
- `public/sitemap.xml` ma jeden URL (`/`, `lastmod 2026-05-31`); `public/robots.txt` wskazuje sitemapę.
- Serwowanie: `docker/nginx.conf` na `development` to `try_files $uri $uri/ /index.html` — każda nieznana ścieżka daje 200 z home (B4). Pliki `projects/index.html` z prerenderu zadziałałyby przez gałąź `$uri/`; układ `projects.html` (flat) nie, bez zmiany nginx.

### Co robi `App.vue` z meta i co trzeba z tym zrobić

`routeMeta` wybiera `content.routes.<nazwa>` (`App.vue:18-25`), `applyMeta` ustawia `document.title`, `lang`, description, `og:title/description/locale`, `twitter:*` przez `querySelector` (`App.vue:27-43`). Wykonuje się tylko w `onMounted`/`watch` (`App.vue:45-46`), czyli nigdy podczas renderowania do stringa. Oba podejścia wymagają, by meta per trasa trafiały do HTML: vite-ssg przez `useHead` (`@unhead/vue`), skrypt własny przez wspólną funkcję `routeMeta(name, locale)` wydzieloną z `App.vue` i podmianę w szablonie. Jednocześnie `og:url`/canonical są dziś stałe dla `/` (`index.html`); prerender per trasa powinien je ustawiać per URL (kandydat do planu, nie ustalone w audycie B1).

### Locale a hydracja

`detectInitial()` zwraca `'pl'` bez `window` (`useLocale.ts:7-8`), a w przeglądarce czyta `localStorage` i `navigator.language` (`useLocale.ts:9-13`). Prerender da zatem wyłącznie HTML po polsku. Dla odwiedzającego z `en` hydracja (`createSSRApp(...).mount`) da niezgodność DOM; `createApp(...).mount('#app')` po prostu zastąpi zawartość (krótki błysk PL → EN). `vite-ssg` hydratuje domyślnie, skrypt własny może wybrać oba. URL-owe locale to B2 i jest poza tą zmianą; trzeba tylko świadomie wybrać zachowanie w planie.

### Opcja A: vite-ssg

- Najnowsza wersja w npm: 28.3.0 (zmodyfikowana 2026-02-05). Peer deps jawnie obejmują `vite ... ^8.0.0-0` i `vue-router ^4.0.1 || ^5.0.0-0` (`npm view vite-ssg peerDependencies`). Repo ma `vite ^8.0.8` i `vue-router ^5.0.4` (`package.json`), więc deklarowana kompatybilność jest. Nie uruchamiałem builda; brak potwierdzenia w praktyce w tym repo.
- Zależności runtime: `@unhead/dom`, `@unhead/vue`, `ansis`, `cac`, `html-minifier-terser`, `html5parser`, `jsdom` (`npm view vite-ssg dependencies`); opcjonalne peers `beasties` (krytyczny CSS) i `prettier` (już jest).
- Zmiany w aplikacji: `main.ts` → `export const createApp = ViteSSG(App, { routes }, setup)` (wg README vite-ssg), router jest tworzony przez bibliotekę z przekazanych `routes`, więc `src/router/index.ts` trzeba rozbić na eksport samej tablicy tras; `build-only` → `vite-ssg build`; meta → `useHead`.
- Zalety: popularne, udokumentowane, `includedRoutes` do sterowania listą tras, obsługa stanu początkowego. Wady dla tego repo: dwa z trzech dużych atutów (stan, dane) nieużywane przy statycznym JSON-ie; `jsdom` w łańcuchu buildu; catch-all i tak wymaga ręcznego `404.html`.

### Opcja B: własny skrypt post-build (zalecana)

- Mechanizm (projekt, niezweryfikowany prototypem): `vite build --ssr src/entry-server.ts` → w Node `createSSRApp`/`createApp` z `createMemoryHistory`, `router.push(path)`, `renderToString` z `vue/server-renderer` (zależność `@vue/server-renderer` 3.5.35 jest już w `node_modules/vue/package.json:99`), wstawienie wyniku w `<div id="app">` z `dist/index.html` i zapis `dist/<trasa>/index.html`. Lista tras z tablicy tras w routerze (bez catch-all) plus jawne `404.html` z `NotFoundView`.
- Nowe zależności: brak (poza ewentualnym drugim wywołaniem `vite build`). Własny kod: skrypt + entry-server + wydzielona funkcja meta; rząd kilkudziesięciu linii (szacunek, nie pomiar).
- Wady: własny kod do utrzymania; trzeba samemu podmienić `<title>`/meta/canonical w szablonie i zadbać o kolejność z hashowanymi assetami (szablon bierzemy z `dist/index.html` po buildzie klienta, więc linki do assetów są już poprawne).

### Opcja C: prerender przeglądarką (odrzucona)

Narzędzia uruchamiające headless Chromium (np. Playwright/Puppeteer) nie są zależnościami repo (nie znaleziono ich w `node_modules/.pnpm`; sprawdzone grepem po nazwie `playwright|puppeteer`). Dodałyby Chromium do CI/buildu dla pięciu stron statycznego JSON-a. Zaletą byłby brak zmian w kodzie aplikacji i wierne wyrenderowanie ikon Iconify. Odrzucona kosztowo, nie technicznie.

### Ikony @iconify/vue

`Icon` używany w `SiteFooter.vue`, `SocialLinkRow.vue`, `ProjectCard.vue`, `FeaturedProjectCard.vue`, `ProductTeaser.vue` z identyfikatorami typu `simple-icons:github`. Komponent renderuje `h('span', ...)` (`node_modules/@iconify/vue/dist/iconify.mjs:1657`), a ładowanie ikon ma `onMounted` (import `onMounted` w `iconify.mjs:1`); wniosek: w SSR ikony nie zostaną zrenderowane, w HTML pojawią się puste `<span>`. Na `design/hero-variants` jest rozwiązanie (`scripts/build-icons.mjs` + `src/generated/icons.json`, rejestracja w `main.ts`; audyt D1), którego ta zmiana nie obejmuje. Pustym ikonom w prerenderze nie szkodzi to ATS/crawlerom (tekst jest), ale to świadoma luka.

### Artefakty z design/hero-variants (git show, brak checkoutu)

- `public/llms.txt`: nagłówek, blockquote, stack, kontakt, linki, lista stron, kod publiczny. Uwaga: linia „Home: summary, recent commits, AI workflow" opisuje commit log, który `site-focus.md` §4 wyklucza; wymaga edycji przed wejściem. Zdanie o współautorstwie PanelAlpha Engine trzeba porównać z decyzją „Engine to punkt w zakresie pracy" (`site-focus.md` §4) i bieżącym `pl.json` (nie sprawdzone).
- JSON-LD w `index.html`: `@graph` z `Person` (`@id .../#person`, `jobTitle "Backend Developer (PHP / Laravel)"`, `worksFor ModulesGarden`, `knowsAbout`, `sameAs` LinkedIn/GitHub, `email`) i `WebSite` (`inLanguage ["pl","en"]`). `jobTitle` różni się od `<title>` z `index.html` ("Backend Developer (Laravel)"); `knowsAbout` i staże trzeba zgodzić z treścią (decyzja „liczby tylko liczone przy buildzie albo wcale", `site-focus.md` §4).
- `public/sitemap.xml`: 5 URL-i z `lastmod 2026-11-09` wpisanym na sztywno. Lepiej generować w skrypcie prerenderu z tej samej listy tras (jedno źródło prawdy), z `lastmod` z daty buildu lub commitu.
- `docker/nginx.conf`: regex `^/(projects|skills|contact|cv)?/?$` z `try_files $uri /index.html` oraz `error_page 404 /index.html`. Po prerenderze trzeba zmienić na serwowanie `$uri/index.html` i 404 z `404.html` (rozwiązuje B4; czy to wchodzi do tej zmiany — pytanie otwarte).

### Wspólne ryzyka buildu

- `generate:archive` w `build` wymaga sieci albo fallbacku (`fetch-archive-count.mjs:1-30`); prerender uruchamia się po nim, więc nie dodaje nowej zależności sieciowej, ale `AiWorkflowSection` wczytuje `archive.json` (`AiWorkflowSection.vue:8`) — licznik trafi do statycznego HTML jako wartość z momentu buildu.
- `type-check` biegnie równolegle z `build-only` (`package.json`); nowy entry-server musi przejść `vue-tsc --build` (tsconfig obejmuje `src`), jeśli trafi do `src/`.
- Testy: `vitest` ma środowisko `node` i wzorce `src/**/__tests__/*.spec.ts`, `scripts/__tests__/*.spec.ts` (`vitest.config.ts:11-14`) — skrypt prerenderu można testować tym samym mechanizmem (np. lista tras ⊆ router, sitemap == lista tras).

## Code References

- `src/router/index.ts:9-24` - 5 tras statycznych + catch-all, `createWebHistory`
- `src/main.ts` - `createApp(App).use(router).mount('#app')`, brak fabryki
- `src/App.vue:18-46` - meta per trasa ustawiane tylko po stronie klienta
- `src/composables/useLocale.ts:7-13` - `'pl'` bez `window`, inaczej `localStorage`/`navigator.language`
- `src/components/layout/SiteHeader.vue:48` - dostęp do `window` w `onMounted`
- `package.json` scripts - łańcuch `build`
- `docker/nginx.conf` - fallback SPA na `development`
- `public/sitemap.xml`, `public/robots.txt` - jeden URL w sitemap
- `design/hero-variants:public/llms.txt`, `:index.html` (JSON-LD), `:public/sitemap.xml`, `:docker/nginx.conf`
- `context/site-audit-2026-11.md:74-86` - B1, B3, B4, B5
- `context/foundation/site-focus.md` §1, §4 - prerender jako osobna zmiana; commit log wykluczony

## Architecture Insights

- Treść jest w `src/content/{pl,en}.json` wybierana przez `useContent()` po locale singletonie; to dobry kształt dla SSR (brak asynchronicznych danych), ale singleton na poziomie modułu oznacza, że jedno wywołanie renderowania w Node współdzieli stan locale — przy renderowaniu tylko `pl` nie szkodzi.
- Źródłem prawdy listy tras powinna być tablica tras; sitemap, prerender i test spójności powinny z niej korzystać.

## Historical Context (from prior changes)

- `context/foundation/site-focus.md` §4 - „Prerender: Tak, osobna zmiana ... odblokowuje sens JSON-LD, sitemapy i llms.txt"; §1 - ATS/crawler widzi dziś pustą stronę (B1).
- `context/archive/2026-11-09-site-focus-hero/plan.md:77-78` - jawnie wyłącza `/cv` w sitemap, JSON-LD, `llms.txt`, `og:locale` oraz prerender i kieruje je do `site-prerender` / `site-audit-tech-fixes`.
- `context/archive/2026-11-09-site-focus-ai-proof/plan.md:54` - „Nie dodajemy prerenderu ani testów E2E (osobne zmiany z p. 10)."

## Related Research

- `context/archive/2026-11-09-site-focus-experience/research.md`, `context/archive/2026-11-09-site-focus-hero/research.md` - nie dotyczą prerenderu (nie czytane w całości; wyszukiwanie `prerender` trafiło tylko w pliki plan.md wymienione wyżej).

## Open Questions

1. **Spike potwierdzający wybór A/B** (rekomendacja B jest osądem): czy skrypt SSR przechodzi bez hydracji problemów i czy `vite-ssg build` przechodzi na Vite 8 + vue-router 5 w tym repo? Do zrobienia jako pierwszy krok planu.
2. **Locale w prerenderze**: `createApp().mount` (zastąpienie, błysk PL→EN) czy hydracja (ostrzeżenia przy `en`)? B2 (URL-owe locale) zostaje poza zakresem?
3. **nginx / B4**: czy zmiana układu serwowania (`$uri/index.html`, `404.html`) wchodzi do `site-prerender`, czy do `site-audit-tech-fixes`? Bez niej prerendered pliki działają tylko przez gałąź `$uri/` obecnego fallbacku.
4. **Ikony**: czy rejestracja ikon offline (D1 z hero-variants) ma wejść razem, czy pustych `<span>` w HTML tolerujemy?
5. **Treść artefaktów**: linia „recent commits" w `llms.txt`, `jobTitle` w JSON-LD i `knowsAbout` wymagają zgodności z `site-focus.md`; `og:url`/canonical per trasa.
6. **Sitemap**: `lastmod` z daty buildu, z `git log` per plik, czy stała? `changefreq`/`priority` pomijamy czy zostawiamy jak w gałęzi?
