# Prerender tras, sitemap, JSON-LD i llms.txt — plan implementacji

## Overview

Każdy z pięciu statycznych URL-i (`/`, `/projects`, `/skills`, `/contact`, `/cv`) dostaje po buildzie własny plik HTML z wyrenderowaną treścią, własnym `<title>`, opisem, `og:*`/`twitter:*` i canonical. Nieznane ścieżki dostają prawdziwe 404 z `404.html`. Na tej podstawie build generuje `sitemap.xml` ze wszystkimi trasami, blok JSON-LD `Person` + `WebSite` i `llms.txt`, wszystko z treści w `src/content/`, bez drugiej kopii faktów. Zmiana obsługuje odbiorcę 3 z `context/foundation/site-focus.md` §1 (ATS, crawler, scraper AI czytający HTML bez JS) i zamyka audyt B1, B3, B4, B5.

## Current State Analysis

- `src/main.ts`: `createApp(App).use(router).mount('#app')`. Brak fabryki i entry SSR.
- `src/router/index.ts:9-24`: 5 tras statycznych z `name` + catch-all `/:pathMatch(.*)*` (`not-found`), `createWebHistory(import.meta.env.BASE_URL)`, `scrollBehavior`. Tablica tras nie jest eksportowana.
- `src/App.vue:18-46`: `routeMeta` (wybór `content.routes.<nazwa>`) i `applyMeta` (title, `lang`, description, `og:title/description/locale`, `twitter:*` przez `querySelector`) działają tylko w `onMounted`/`watch`. Przy `renderToString` meta nie powstają. Canonical i `og:url` nie są aktualizowane wcale.
- `index.html`: statyczne meta strony głównej, canonical i `og:url` = `https://kostecki.dev/` na każdej stronie, pusty `<div id="app"></div>`.
- `src/composables/useLocale.ts:7-8`: bez `window` locale = `pl`. `src/composables/useContent.ts:8-11`: słowniki z rozwiązanymi stażami powstają przy ładowaniu modułu (`yearsSince(..., new Date())`, `useDuration.ts:5`). `SiteFooter.vue:6`: rok z `new Date()`. W prerenderze to wartości z dnia buildu.
- Odwołania do `window`/`document` na ścieżce renderu są za `typeof window` albo w `onMounted` (`SiteHeader.vue:48-58`, `App.vue:45`). `window.print()` jest w handlerze (`CvView.vue:17`).
- `@iconify/vue` w SSR renderuje pusty `<span>` (ładowanie w `onMounted`). Linki z samą ikoną mają `aria-label` (`SiteFooter.vue:36`), więc tekst dla crawlera jest.
- `package.json`: `build` = `generate:archive` → `run-p type-check build-only`, `build-only` = `vite build`. `vitest.config.ts` bez pluginu `vue`, środowisko `node`, wzorce `src/**/__tests__/*.spec.ts`, `scripts/__tests__/*.spec.ts`.
- `public/sitemap.xml`: jeden URL z `lastmod 2026-05-31`. `public/robots.txt` wskazuje sitemapę. Brak `llms.txt` i JSON-LD.
- `docker/nginx.conf`: `try_files $uri $uri/ /index.html` → każda ścieżka 200 z home (B4). `docker-compose.yml` montuje `./dist` i `docker/nginx.conf` do `nginx:alpine`; deploy idzie przez repo `kostecki-dev-infra`. W tym repo nie ma CI.
- `dist` i `dist-ssr` są w `.gitignore` (`.gitignore:12-13`).

## Desired End State

Po `pnpm build`:

- `dist/index.html`, `dist/projects/index.html`, `dist/skills/index.html`, `dist/contact/index.html`, `dist/cv/index.html` zawierają w `#app` wyrenderowaną po polsku treść danej trasy, a w `<head>` jej `title` i `description` z `pl.json` `routes.<nazwa>`, zgodne `og:title`/`og:description`/`twitter:*`, `canonical` i `og:url` równe `https://kostecki.dev<ścieżka>` (dla home `https://kostecki.dev/`) oraz blok `<script type="application/ld+json">` z `Person` + `WebSite`.
- `dist/404.html` zawiera wyrenderowany `NotFoundView`, `title`/`description` z `routes.notFound`, `<meta name="robots" content="noindex">`, bez `canonical`, `og:url` i JSON-LD.
- `dist/sitemap.xml` ma dokładnie pięć `<url><loc>` (z tej samej listy tras), bez `lastmod`, `changefreq`, `priority`.
- `dist/llms.txt` jest wygenerowany z `en.json`: nagłówek z imieniem i rolą, opis, kontakt, lista stron z opisami, publiczny kod. Bez „commits”, bez literałów skali.
- Przeglądarka startuje jak dziś (`createApp().mount` zastępuje statyczny markup), więc odwiedzający z `en` widzi krótką podmianę PL → EN. Przy nawigacji po stronie klient aktualizuje też canonical i `og:url`.
- nginx: `/projects` i `/projects/` → 200 z `projects/index.html`, `/nie-ma` → 404 z treścią `404.html`.
- Build wykłada się z czytelnym komunikatem, jeśli którejś trasy nie da się wyrenderować, w szablonie brakuje oczekiwanego tagu albo placeholder `#app` nie występuje dokładnie raz.

### Key Discoveries:

- `vue/server-renderer` jest już w zależnościach Vue (`node_modules/vue/package.json:99`); prerender nie wymaga nowych pakietów.
- `createApp().mount()` z `runtime-dom` czyści zawartość kontenera przed renderem, więc „plain mount” nie wymaga zmian w `src/main.ts`.
- Treść dla JSON-LD istnieje w polach: `hero.name`, `hero.label` (jobTitle), `contact.methods` (email, LinkedIn, GitHub → `sameAs`), `skills.core[].name` (`knowsAbout`). Brakuje struktury pracodawcy; `src/content/career.ts` już trzyma fakty o ModulesGarden (`careerSince`).
- `scaleLiterals()` w `src/content/content-rules.ts` jest gotowym strażnikiem reguły „liczby tylko z buildu” (`site-focus.md` §4, §8).
- Wzorzec testów treści: `src/content/__tests__/ai-proof.spec.ts` (`describe.each` po locale).
- Publiczne repo produktów: `projects.personal.items[].links[]` z URL-ami `github.com/...` (`isRepo()` w `src/content/links.ts`).

## What We're NOT Doing

- Hydracji (`createSSRApp` po stronie klienta). Zostaje `createApp().mount`; świadomie akceptujemy podmianę PL → EN dla odwiedzających z `en`. Dotyczy to też crawlerów renderujących JS (Googlebot, prawdopodobnie `en-US`): zindeksują wersję EN pod canonical bez locale, a polski prerender trafi tylko do czytników bez JS. To nie jest regresja (dziś też widzą EN); rozwiązuje to dopiero B2.
- Locale w URL i `hreflang` (B2). Prerender jest tylko po polsku.
- `vite-ssg`, `@unhead/vue`, prerenderu przeglądarką (Playwright/Puppeteer).
- Ikon offline (D1, `scripts/build-icons.mjs` z `design/hero-variants`). W prerenderze ikony zostają pustymi `<span>`; należy to do `site-audit-tech-fixes`.
- Deduplikacji `og:locale:alternate` (B6) i nagłówków bezpieczeństwa w nginx (D3). Należą do `site-audit-tech-fixes`.
- `lastmod`, `changefreq`, `priority` w sitemapie.
- Ręcznie pisanego `llms.txt` ani statycznego JSON-LD w `index.html`. Wersji z `design/hero-variants` używamy tylko jako wzoru struktury.
- Zmian treści w `src/content/*.json` poza dodaniem danych pracodawcy w `career.ts`.
- Deployu na produkcję. Zmiana `docker/nginx.conf` trafia na serwer przez repo infra, osobnym krokiem właściciela.

## Implementation Approach

Dwa buildy Vite: klient do `dist/` (jak dziś) i SSR `src/entry-server.ts` do `dist-ssr/`. Skrypt Node `scripts/prerender.mjs` importuje bundle SSR, czyta `dist/index.html` jako szablon, renderuje każdą trasę i zapisuje pliki, a potem sprawdza wynik. Cała logika, którą da się testować (lista tras, meta trasy, wstrzyknięcie do szablonu, sitemap, JSON-LD, llms.txt), siedzi w czystych modułach TS w `src/seo/`. Entry SSR je re-eksportuje, a skrypt zajmuje się tylko plikami. Dzięki temu testy vitest sprawdzają to samo, co produkuje build, a lista tras ma jedno źródło prawdy: tablicę tras.

Faza 1 zaczyna się od testu, który nie przechodzi (`render('/projects')` nie zawiera treści `/projects`). Jest też spike'iem: jeśli SSR na Vite 8 / vue-router 5 / `@iconify/vue` nie daje się uruchomić bez obejść większych niż `ssr.noExternal`, implementacja staje i decyzja A/B wraca do użytkownika.

## Critical Implementation Details

**Kolejność w buildzie i szablon.** Prerender musi biec po `vite build` klienta (hashowane assety są już w `dist/index.html`) i przeczytać szablon raz, przed nadpisaniem `dist/index.html` wynikiem dla `/`. Skrypt wymaga, by `<div id="app"></div>` wystąpił w szablonie dokładnie raz, i wykłada się w przeciwnym razie. To chroni przed podwójnym wstrzyknięciem przy ponownym uruchomieniu na już wyrenderowanym `dist/`.

**`type-check` biegnie równolegle z buildem.** `build:app` to `run-p type-check build-only`, więc nowy `src/entry-server.ts` i `src/seo/*.ts` muszą przejść `vue-tsc --build` (są w `tsconfig.app.json`). `scripts/prerender.mjs` nie jest w `tsconfig.node.json` (tam są tylko `scripts/lib/*.mjs`); jeśli skrypt ma czystą logikę, trafia ona do `src/seo/`, nie do skryptu.

**Singleton locale w Node.** `useLocale` to stan na poziomie modułu. Wszystkie trasy renderują się w jednym procesie po polsku, więc współdzielenie nie szkodzi, ale entry SSR nie może wywoływać `setLocale`.

## Faza 1: Render SSR trasy (spike + TDD)

### Overview

Tablica tras i meta trasy stają się czystymi modułami wspólnymi dla klienta i serwera. `src/entry-server.ts` renderuje dowolną ścieżkę do HTML-a. Regresja B1 staje się testem vitest: najpierw czerwonym, potem zielonym.

### Changes Required:

#### 1. Test regresji (najpierw, czerwony)

**File**: `src/__tests__/entry-server.spec.ts`, `vitest.config.ts`

**Intent**: Zapisać błąd B1 jako test: wyrenderowany HTML `/projects` ma zawierać tytuł sekcji projektów z `pl.json` i nazwę trasy `projects`, a `/nie-ma-takiej` ma dać `not-found`. Test nie przechodzi, bo entry SSR nie istnieje. Żeby vitest mógł importować `.vue`, do `vitest.config.ts` dochodzi plugin `@vitejs/plugin-vue`.

**Contract**: `render(path: string): Promise<{ html: string; routeName: string }>` z `@/entry-server`. Asercje: `html` zawiera `pl.projects.title`, `routeName === 'projects'`; dla każdej ścieżki ze `staticPaths` `html` jest niepusty; dla nieznanej ścieżki `routeName === 'not-found'` i `html` zawiera `pl.ui.notFoundTitle`. Test nie sprawdza ikon.

#### 2. Tablica tras jako jedno źródło prawdy

**File**: `src/router/routes.ts` (nowy), `src/router/index.ts`

**Intent**: Wydzielić tablicę tras z `index.ts`, żeby korzystały z niej router klienta, entry SSR, prerender i sitemap. `index.ts` zachowuje `createWebHistory` i `scrollBehavior`.

**Contract**: `export const routes: RouteRecordRaw[]` (te same 6 rekordów, nazwy bez zmian) i `export const staticPaths: string[]` = ścieżki rekordów bez parametrów (`/`, `/projects`, `/skills`, `/contact`, `/cv`), wyliczone z `routes`, nie wpisane ręcznie. `export const staticRoutes: { path: string; name: RouteName }[]` z tych samych rekordów (z niego wyliczane jest `staticPaths`), żeby sitemap i `llms.txt` mapowały ścieżkę na nazwę bez własnego lookupu. `RouteName` jako typ unii nazw.

#### 3. Meta trasy poza `App.vue`

**File**: `src/seo/page-meta.ts` (nowy), `src/App.vue`

**Intent**: Przenieść `routeMeta` i budowę wartości meta do czystej funkcji, z której korzysta `App.vue` (klient) i prerender (serwer). `applyMeta` w `App.vue` dodatkowo ustawia `link[rel=canonical]` `href` i `og:url`, żeby nawigacja po stronie nie zostawiała canonical poprzedniej trasy.

**Contract**: `SITE_URL = 'https://kostecki.dev'`; `pageMeta(routeName: string, content: SiteContent, path: string): { title; description; lang; ogLocale; canonical: string | null }`. Dla `not-found` `canonical: null`, w pozostałych przypadkach `canonicalUrl(path)`: eksportowana funkcja, jedyne miejsce reguły (dla `/` `https://kostecki.dev/`, dla pozostałych `SITE_URL + path` bez końcowego ukośnika), z której korzystają też sitemap i `llms.txt`. Nieznana nazwa → meta home (jak dziś `App.vue:24`). Gdy `canonical` jest `null`, klient usuwa atrybut `href` z `link[rel=canonical]` i atrybut `content` z `og:url`, więc widok 404 nie dziedziczy canonical poprzedniej trasy. Gdy `canonical` nie jest `null`, `applyMeta` tworzy brakujący `link[rel=canonical]` i `meta[property=og:url]` (upsert), bo `dist/404.html` ich nie ma, a poza `not-found` usuwa `meta[name=robots]`. Dzięki temu wejście na 404 i nawigacja „wróć” daje home z canonical i bez `noindex`.

#### 4. Entry SSR

**File**: `src/entry-server.ts` (nowy), `vite.config.ts` (tylko jeśli spike tego wymaga)

**Intent**: Zbudować świeżą aplikację na każde wywołanie: `createSSRApp(App)`, router z `createMemoryHistory()` i `routes`, `router.push(path)`, `await router.isReady()`, `renderToString`. Zwrócić HTML, nazwę dopasowanej trasy i meta z `pageMeta`. Re-eksportować to, czego potrzebuje skrypt: `staticPaths`, słownik `pl`/`en` z `useContent` oraz (od faz 2–3) buildery z `src/seo/`. `main.css` nie jest importowany w entry SSR.

**Contract**: `render(path) → { html, routeName, meta }`. Jeśli `@iconify/vue` lub inna zależność nie ładuje się w Node, dopuszczalne jest `ssr.noExternal` w `vite.config.ts`. Każde większe obejście (shim `window`, jsdom, zmiany w komponentach poza `App.vue`) zatrzymuje fazę i wraca do decyzji A/B z użytkownikiem.

#### 5. Testy meta

**File**: `src/seo/__tests__/page-meta.spec.ts`

**Intent**: Zabezpieczyć kontrakt `pageMeta`: każda nazwa z `routes` mapuje się na wpis `content.routes`, canonical per ścieżka, `null` dla 404, `ogLocale` `pl_PL`/`en_US`.

**Contract**: `describe.each` po `pl`/`en` jak w `ai-proof.spec.ts`.

### Success Criteria:

#### Automated Verification:

- Test `src/__tests__/entry-server.spec.ts` nie przechodzi przed dodaniem `src/entry-server.ts` (czerwony zapisany w commicie lub w opisie fazy)
- Testy przechodzą: `pnpm test`
- Type check przechodzi: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- Build klienta nadal przechodzi: `pnpm build`

#### Manual Verification:

- `pnpm dev`: nawigacja `/` → `/projects` → `/cv` zmienia `<title>`, description i canonical w DevTools (Elements → `<head>`)
- Przełączenie języka nadal zmienia tytuł i treść bez przeładowania

**Implementation Note**: Po fazie i zielonych testach automatycznych zatrzymaj się na ręczne potwierdzenie przed fazą 2.

---

## Faza 2: Prerender do dist/ i podpięcie w build

### Overview

Czysta funkcja wstrzykuje wynik renderu i meta do szablonu. Skrypt zapisuje pliki tras i `404.html`, sprawdza wynik i jest częścią `pnpm build`.

### Changes Required:

#### 1. Wstrzyknięcie do szablonu

**File**: `src/seo/html-template.ts` (nowy), `src/seo/__tests__/html-template.spec.ts`

**Intent**: Z szablonu `dist/index.html` i wyniku `render` zbudować gotowy dokument: treść w `#app`, podmienione `<title>`, `meta[name=description]`, `og:title`, `og:description`, `og:url`, `og:locale`, `twitter:title`, `twitter:description`, `link[rel=canonical]`; opcjonalnie blok JSON-LD przed `</head>`; dla 404 usunięcie `canonical` i `og:url` oraz dodanie `robots noindex`. Każdy oczekiwany tag musi wystąpić w szablonie dokładnie raz, inaczej funkcja rzuca błąd z nazwą tagu. Wartości są escapowane jako atrybuty HTML; JSON-LD jest serializowany tak, by `</` nie zamykało skryptu.

**Contract**: `injectPage(template: string, page: { appHtml: string; meta: PageMeta; jsonLd?: object; noindex?: boolean }): string`. Wstawianie przez `replace` używa funkcji jako replacera (nie stringa), żeby `$&`, `$'` i `` $` `` w treści nie były interpretowane jako wzorce. Testy: każda podmiana, escapowanie `"`/`&`/`<` w description, `$&` w description i w `appHtml` trafia do wyniku dosłownie, błąd przy braku tagu i przy podwójnym `<div id="app"></div>`, wariant 404.

#### 2. Skrypt prerenderu

**File**: `scripts/prerender.mjs` (nowy)

**Intent**: Zaimportować `dist-ssr/entry-server.js`, przeczytać szablon raz, dla każdej ścieżki ze `staticPaths` wyrenderować, wstrzyknąć i zapisać `dist/index.html` (dla `/`) albo `dist/<ścieżka>/index.html`; wyrenderować ścieżkę spoza tras do `dist/404.html` z `noindex`. Na końcu sprawdzić każdy zapisany plik: zawiera swój `title` z `pl.json`, `#app` nie jest pusty. Błąd renderu lub kontroli kończy proces kodem 1 z komunikatem `[prerender]` i przyczyną (zgodnie z zasadą „nigdy nie ukrywaj dowodów”). Na sukces wypisuje listę zapisanych plików.

**Contract**: Wejście: `dist/index.html`, `dist-ssr/entry-server.js`. Wyjście: 5 plików tras + `dist/404.html` (w fazie 3 także `sitemap.xml`, `llms.txt`). Bez sieci.

#### 3. Skrypty build

**File**: `package.json`

**Intent**: Wpiąć build SSR i prerender po buildzie klienta, zachowując przekazywanie argumentów `{@}` i równoległy `type-check`.

**Contract**: `build-only` = `run-s "build:client {@}" build:ssr prerender --`; `build:client` = `vite build`; `build:ssr` = `vite build --ssr src/entry-server.ts --outDir dist-ssr`; `prerender` = `node scripts/prerender.mjs`. Nazwy `build`, `build:app` i `preview` bez zmian.

### Success Criteria:

#### Automated Verification:

- Testy przechodzą: `pnpm test`
- Type check i lint przechodzą: `pnpm type-check && pnpm lint`
- Build przechodzi i tworzy pliki: `pnpm build && ls dist/index.html dist/projects/index.html dist/skills/index.html dist/contact/index.html dist/cv/index.html dist/404.html`
- Każdy plik ma własny tytuł: `grep -o '<title>[^<]*' dist/projects/index.html` zwraca `<title>Projekty — Sebastian Kostecki`
- Canonical per trasa: `grep 'rel="canonical"' dist/cv/index.html` zawiera `https://kostecki.dev/cv`; `grep -c 'rel="canonical"' dist/404.html || true` zwraca `0`
- Ponowne `pnpm prerender` na już wyrenderowanym `dist/` kończy się kodem 1 z komunikatem o placeholderze `#app`

#### Manual Verification:

- `pnpm preview`, `curl -s http://localhost:4173/skills/ | head -c 3000` pokazuje treść `/skills` w HTML (bez JS)
- W przeglądarce z wyłączonym JS `/projects` pokazuje listę projektów
- Z włączonym JS strona działa jak przed zmianą (nawigacja, przełącznik języka, `/cv` drukowanie, wejście na `/nie-ma` i „wróć” daje home z canonical i bez `meta[name=robots]`), w konsoli brak błędów

**Implementation Note**: Po fazie i zielonych testach automatycznych zatrzymaj się na ręczne potwierdzenie przed fazą 3.

---

## Faza 3: Artefakty dla maszyn z treści

### Overview

Sitemap, JSON-LD i `llms.txt` powstają w prerenderze z tej samej listy tras i treści co strona. `public/sitemap.xml` znika, żeby nie było dwóch źródeł.

### Changes Required:

#### 1. Sitemap

**File**: `src/seo/sitemap.ts`, `src/seo/__tests__/sitemap.spec.ts`, `public/sitemap.xml` (usunięty)

**Intent**: Zbudować `sitemap.xml` ze `staticPaths`, tylko z `<loc>`. Każdy `<loc>` = `canonicalUrl(path)` z `page-meta.ts` (bez własnej reguły ukośnika).

**Contract**: `buildSitemap(paths: string[]): string`. Test: liczba `<loc>` = `staticPaths.length`, zbiór `<loc>` = canonical z `pageMeta` dla każdej ścieżki, brak `lastmod`/`changefreq`/`priority`. `public/robots.txt` bez zmian.

#### 2. JSON-LD Person + WebSite

**File**: `src/seo/structured-data.ts`, `src/seo/__tests__/structured-data.spec.ts`, `src/content/career.ts`

**Intent**: Zbudować `@graph` z `Person` (`@id` `https://kostecki.dev/#person`) i `WebSite` (`@id` `https://kostecki.dev/#website`, `inLanguage` `["pl","en"]`, `author` → person) z polskiej treści, wzorem struktury z `design/hero-variants:index.html`. Dane pracodawcy dochodzą do `career.ts` jako jedno miejsce faktów o ModulesGarden. JSON-LD trafia na pięć stron tras, nie na 404.

**Contract**: `buildJsonLd(content: SiteContent): object`. Mapowanie: `name` ← `hero.name`; `jobTitle` ← `hero.label`; `url` ← `SITE_URL + '/'`; `email` ← `mailto:` z `contact.methods` typu `email`; `sameAs` ← `href` metod `linkedin` i `github`; `knowsAbout` ← `skills.core[].name`; `worksFor` ← `employer` z `career.ts` (`{ name: 'ModulesGarden', url: 'https://www.modulesgarden.com' }`). Testy: każde pole równe swojemu źródłu w `pl.json`, `scaleLiterals` na zserializowanym JSON-ie (poza URL-ami) zwraca `[]`.

#### 3. llms.txt

**File**: `src/seo/llms.ts`, `src/seo/__tests__/llms.spec.ts`, `src/seo/page-meta.ts`, `src/components/layout/SiteFooter.vue`

**Intent**: Zbudować `llms.txt` z angielskiej treści, wzorem struktury z `design/hero-variants:public/llms.txt`, bez linii o commitach: `# {hero.name} — {hero.label}`, blockquote z `meta.description`, lista kontaktu z `contact.methods`, sekcja `## Pages` (każdy wpis ze `staticRoutes`: `[routes.<name>.title](canonicalUrl(path)): routes.<name>.description`), sekcja `## Public code` (linki GitHub z `projects.personal.items` z `featured: true` oraz repo strony). URL repo strony trafia jako `SITE_REPO_URL` obok `SITE_URL` w `src/seo/page-meta.ts`; `SiteFooter.vue:52` zamienia wpisany na sztywno `href` na tę stałą, żeby stopka i `llms.txt` miały jedno źródło.

**Contract**: `buildLlmsTxt(content: SiteContent, routes: typeof staticRoutes): string`. Testy: liczba linków w `## Pages` = `staticPaths.length`, brak słowa `commit` (bez rozróżniania wielkości liter), `scaleLiterals(text)` po usunięciu URL-i zwraca `[]`, brak nierozwiązanych tokenów `{years:`/`{since:`.

#### 4. Podpięcie w prerenderze

**File**: `src/entry-server.ts`, `scripts/prerender.mjs`

**Intent**: Re-eksportować buildery, przekazać JSON-LD do `injectPage` dla tras, zapisać `dist/sitemap.xml` i `dist/llms.txt`. Kontrola po buildzie obejmuje też obecność obu plików i bloku `application/ld+json` w pięciu stronach.

**Contract**: Bez zmian w interfejsie `render`.

### Success Criteria:

#### Automated Verification:

- Testy przechodzą: `pnpm test`
- Type check i lint przechodzą: `pnpm type-check && pnpm lint`
- Build przechodzi: `pnpm build`
- Sitemap ma 5 URL-i: `grep -c '<loc>' dist/sitemap.xml` zwraca `5`, `grep -c lastmod dist/sitemap.xml || true` zwraca `0`
- `public/sitemap.xml` nie istnieje: `test ! -e public/sitemap.xml`
- JSON-LD na stronach tras, nie na 404: `grep -l 'application/ld+json' dist/index.html dist/*/index.html | wc -l` zwraca `5`, `grep -c 'application/ld+json' dist/404.html || true` zwraca `0`
- `dist/llms.txt` istnieje i nie zawiera „commit”: `test -s dist/llms.txt && ! grep -qi commit dist/llms.txt`

#### Manual Verification:

- JSON-LD z `dist/index.html` przechodzi walidator schema.org (validator.schema.org) bez błędów
- Treść `dist/llms.txt` czyta się poprawnie i zgadza się ze stroną (rola, kontakt, strony, repo)

**Implementation Note**: Po fazie i zielonych testach automatycznych zatrzymaj się na ręczne potwierdzenie przed fazą 4.

---

## Faza 4: nginx — prawdziwe 404 (B4)

### Overview

nginx serwuje wyrenderowane pliki tras i zwraca 404 z `404.html` dla nieznanych ścieżek. Zmienia się tylko routing; nagłówki bezpieczeństwa zostają do `site-audit-tech-fixes`.

### Changes Required:

#### 1. Konfiguracja nginx

**File**: `docker/nginx.conf`

**Intent**: Zastąpić fallback SPA serwowaniem plików: `/projects` i `/projects/` → `projects/index.html`, nieznana ścieżka → 404 z treścią `404.html`.

**Contract**: `location / { try_files $uri $uri/index.html =404; }` i `error_page 404 /404.html;`. `root`, `index`, `listen` bez zmian.

#### 2. Notka o deployu

**File**: `README.md`

**Intent**: Jedno zdanie przy sekcji o infrastrukturze: build produkuje plik HTML na trasę i `404.html`, a `docker/nginx.conf` musi trafić na serwer razem z `dist/`.

**Contract**: Sekcja z linkiem do `kostecki-dev-infra`.

### Success Criteria:

#### Automated Verification:

- Konfiguracja jest poprawna: `docker run --rm -v "$PWD/docker/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t`
- Statusy na lokalnym kontenerze (`docker run -d --rm --name prerender-check -p 8080:80 -v "$PWD/dist:/usr/share/nginx/html:ro" -v "$PWD/docker/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine`): `curl -s -o /dev/null -w '%{http_code}'` zwraca `200` dla `/`, `/projects`, `/projects/`, `/cv`, `/sitemap.xml`, `/llms.txt` i `404` dla `/nie-ma`
- `curl -s http://localhost:8080/nie-ma` zawiera tytuł z `pl.routes.notFound.title`
- `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' http://localhost:8080/projects` nie jest przekierowaniem (`200`, pusty `redirect_url`). Po kontroli `docker stop prerender-check`.

#### Manual Verification:

- Na kontenerze lokalnym: wejście na `/nie-ma` pokazuje stronę 404 w przeglądarce, a link „wróć” prowadzi do `/`
- Po deployu przez repo infra: `curl -sI https://kostecki.dev/nie-ma` zwraca 404, `https://kostecki.dev/projects` zwraca 200 z treścią w HTML

**Implementation Note**: Deploy na produkcję wykonuje właściciel przez repo infra; po nim potwierdź ostatni punkt ręczny.

---

## Testing Strategy

### Unit Tests:

- `page-meta`: mapowanie każdej nazwy trasy na `content.routes`, canonical per ścieżka, `null` dla 404, oba locale.
- `html-template`: każda podmiana tagu, escapowanie, błąd przy brakującym tagu i podwójnym placeholderze, wariant 404 (`noindex`, bez canonical/`og:url`/JSON-LD).
- `sitemap`: zbiór `<loc>` = canonical ze `staticPaths`, brak pól daty i priorytetu.
- `structured-data`: każde pole z treści, brak literałów skali.
- `llms`: strony = `staticPaths`, brak „commit”, brak literałów i tokenów.

### Integration Tests:

- `src/__tests__/entry-server.spec.ts`: realny render SFC w Node dla każdej ścieżki ze `staticPaths` i nieznanej ścieżki (regresja B1).
- Kontrola wewnątrz `scripts/prerender.mjs` po każdym `pnpm build` (tytuł per plik, niepusty `#app`, sitemap, llms, JSON-LD).

### Manual Testing Steps:

1. `pnpm build && pnpm preview`; `curl -s localhost:4173/cv/` pokazuje treść CV w HTML.
2. Przeglądarka z wyłączonym JS: każda z pięciu tras ma treść i własny tytuł karty.
3. Z JS: przełącznik PL/EN, nawigacja, drukowanie `/cv` działają; w konsoli brak błędów.
4. Kontener nginx lokalnie: `/nie-ma` → 404 ze stroną 404.

## Performance Considerations

Pięć tras renderowanych w jednym procesie Node to sekundy; build SSR dodaje jedno wywołanie `vite build`. HTML rośnie o wyrenderowaną treść (kilkadziesiąt KB na stronę), co jest akceptowalne. Brak hydracji oznacza jedną dodatkową podmianę DOM przy starcie, bez wpływu na treść dla crawlera.

## Migration Notes

`public/sitemap.xml` znika z repo, a zastępuje go plik generowany w `dist/`. `docker/nginx.conf` wymaga ponownego deployu razem z nowym `dist/`. Wdrożenie samego `dist/` ze starym confem działa: `$uri/` obsłuży katalogi tras, ale nieznane ścieżki dalej dostaną 200. Wycofanie: przywrócenie poprzedniego `dist/` i confu; nic nie migruje danych.

## References

- Research: `context/changes/site-prerender/research.md`
- Foundation: `context/foundation/site-focus.md` §1 (odbiorca 3), §4 (prerender, liczby), §6 (co przenieść), §8 (zasady treści)
- Audyt: `context/site-audit-2026-11.md` B1, B3, B4, B5
- Wzorce z gałęzi: `design/hero-variants:public/llms.txt`, `design/hero-variants:index.html` (JSON-LD), `design/hero-variants:docker/nginx.conf`
- Meta po stronie klienta: `src/App.vue:18-46`
- Wzorzec testów treści: `src/content/__tests__/ai-proof.spec.ts`
- Strażnik literałów: `src/content/content-rules.ts`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Render SSR trasy (spike + TDD)

#### Automated

- [x] 1.1 Test `src/__tests__/entry-server.spec.ts` nie przechodzi przed dodaniem `src/entry-server.ts` (czerwony zapisany w commicie lub w opisie fazy) — 5422b51
- [x] 1.2 Testy przechodzą: `pnpm test` — 5422b51
- [x] 1.3 Type check przechodzi: `pnpm type-check` — 5422b51
- [x] 1.4 Lint przechodzi: `pnpm lint` — 5422b51
- [x] 1.5 Build klienta nadal przechodzi: `pnpm build` — 5422b51

#### Manual

- [x] 1.6 `pnpm dev`: nawigacja `/` → `/projects` → `/cv` zmienia `<title>`, description i canonical w DevTools — 5422b51
- [x] 1.7 Przełączenie języka nadal zmienia tytuł i treść bez przeładowania — 5422b51

### Phase 2: Prerender do dist/ i podpięcie w build

#### Automated

- [x] 2.1 Testy przechodzą: `pnpm test`
- [x] 2.2 Type check i lint przechodzą: `pnpm type-check && pnpm lint`
- [x] 2.3 Build przechodzi i tworzy 5 plików tras oraz `dist/404.html`
- [x] 2.4 Każdy plik ma własny tytuł (`dist/projects/index.html` → `Projekty — Sebastian Kostecki`)
- [x] 2.5 Canonical per trasa w `dist/cv/index.html`, brak canonical w `dist/404.html`
- [x] 2.6 Ponowne `pnpm prerender` na wyrenderowanym `dist/` kończy się kodem 1 z komunikatem o placeholderze `#app`

#### Manual

- [x] 2.7 `pnpm preview` + `curl` pokazuje treść `/skills` w HTML bez JS
- [x] 2.8 Przeglądarka z wyłączonym JS: `/projects` pokazuje listę projektów
- [x] 2.9 Z włączonym JS strona działa jak przed zmianą, w konsoli brak błędów

### Phase 3: Artefakty dla maszyn z treści

#### Automated

- [ ] 3.1 Testy przechodzą: `pnpm test`
- [ ] 3.2 Type check i lint przechodzą: `pnpm type-check && pnpm lint`
- [ ] 3.3 Build przechodzi: `pnpm build`
- [ ] 3.4 Sitemap ma 5 URL-i i brak `lastmod`
- [ ] 3.5 `public/sitemap.xml` nie istnieje
- [ ] 3.6 JSON-LD na 5 stronach tras, brak na `dist/404.html`
- [ ] 3.7 `dist/llms.txt` istnieje i nie zawiera „commit”

#### Manual

- [ ] 3.8 JSON-LD z `dist/index.html` przechodzi walidator schema.org bez błędów
- [ ] 3.9 Treść `dist/llms.txt` czyta się poprawnie i zgadza się ze stroną

### Phase 4: nginx — prawdziwe 404 (B4)

#### Automated

- [ ] 4.1 Konfiguracja jest poprawna: `nginx -t` w kontenerze `nginx:alpine`
- [ ] 4.2 Statusy na lokalnym kontenerze: 200 dla tras, `/sitemap.xml`, `/llms.txt`; 404 dla `/nie-ma`
- [ ] 4.3 `/nie-ma` zawiera tytuł z `pl.routes.notFound.title`
- [ ] 4.4 `/projects` nie jest przekierowaniem

#### Manual

- [ ] 4.5 Na kontenerze lokalnym `/nie-ma` pokazuje stronę 404, link „wróć” prowadzi do `/`
- [ ] 4.6 Po deployu przez repo infra: `/nie-ma` zwraca 404, `/projects` zwraca 200 z treścią w HTML
