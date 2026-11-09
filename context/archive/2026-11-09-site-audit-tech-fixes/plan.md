# Poprawki techniczne z audytu (C1, D1, D2, D3, B6, D5) — plan implementacji

## Overview

Przenosimy na `development` techniczne poprawki z audytu, które powstały na gałęzi `design/hero-variants` (commit `423456f`), ale bez reszty tamtej gałęzi (commit log, skróty klawiszowe, nowe sekcje, zmiany treści). Zakres: header widoczny od razu na `/` (C1), ikony z lokalnego bundla zamiast `api.iconify.design` (D1), fonty self-hosted zamiast Google Fonts (D2), nagłówki bezpieczeństwa i CSP w `docker/nginx.conf` (D3), poprawne `og:locale:alternate` (B6) i README opisujące projekt (D5). Treść w `src/content/*.json` się nie zmienia. Każda poprawka zaczyna się od testu, który bez niej nie przechodzi.

## Current State Analysis

- **B4 jest już zrobione** przez zmianę `site-prerender` (`fdbb8be`): `docker/nginx.conf` ma `error_page 404 /404.html`, `location = /404.html { internal; }` i `try_files $uri $uri/index.html =404`; prerender zapisuje `dist/<trasa>/index.html` i `dist/404.html`. Wersja nginx z `design/hero-variants` (`error_page 404 /index.html`, regex tras, `try_files $uri /index.html`) jest starsza i **zepsułaby** prerender, więc nie przenosimy jej 1:1.
- **C1:** `src/components/layout/SiteHeader.vue:18-23` — na `/` header jest ukryty (`-translate-y-full opacity-0 pointer-events-none`, `aria-hidden="true"`), dopóki `scrollY <= 80` i nie jest mobile. W SSR (`src/entry-server.ts`) `isMobile` i `scrolledPastThreshold` są `false`, więc prerenderowany `dist/index.html` zawiera ukryty header z `aria-hidden`. Hero ma `pt-24 sm:pt-32 lg:pt-40` (`src/views/HomeView.vue:28`), więc header `h-16` nie zasłoni treści.
- **D1:** `@iconify/vue` w 6 komponentach (`SiteFooter`, `FeaturedProjectCard`, `ProjectCard`, `ProductTeaser`, `SocialLinkRow`, `SkillBadge`). 11 ikon (`simple-icons`: docker, github, laravel, linkedin, mysql, php, postgresql, typescript, vuedotjs; `lucide`: mail, phone), wszystkie jako literalne ciągi `prefix:name` w `.vue`/`.ts`/`src/content/*.json` (`SocialLinkRow.vue:14-26` wybiera nazwę przez `switch`, nie składa jej dynamicznie). Bez danych w pamięci `Icon` po `onMounted` pobiera ikonę z `api.iconify.design` (`node_modules/@iconify/vue/dist/iconify.mjs:1741-1830`).
- **D2:** `index.html:27-29` — dwa `preconnect` i stylesheet z `fonts.googleapis.com`. Tokeny fontów w `src/assets/main.css:19-21` (`--font-sans`, `--font-mono`, `--font-body`).
- **D3:** `docker/nginx.conf` nie ma żadnych `add_header`. W repo nie ma runtime `fetch` (`grep fetch( src` pusty; licznik archiwum liczony jest przy buildzie), obrazy są lokalne (`/assets/projects/*`), więc CSP może mieć `connect-src 'self'`. `index.html` dostaje z prerenderu inline `<script type="application/ld+json">` (`src/seo/html-template.ts:96-100`) — to blok danych, którego `script-src` nie blokuje.
- **B6:** `index.html:17-18` ma `og:locale:alternate` dwa razy (`en_US` i `pl_PL`) przy `og:locale = pl_PL`. `injectPage` (`src/seo/html-template.ts:12-23`) i `App.vue:56-72` (`applyMeta`) aktualizują tylko `og:locale`; po przełączeniu na EN klient ustawia `og:locale = en_US`, a alternate też jest `en_US`.
- **D5:** `README.md` ma dwa akapity z wcześniejszych zmian (deploy/prerender, licznik archiwum), reszta to szablon Vite.
- **Testy:** vitest (`vitest.config.ts`, `environment: 'node'`, `src/**/__tests__/*.spec.ts`, `scripts/__tests__/*.spec.ts`). `render(path)` z `@/entry-server` zwraca HTML SSR (`src/__tests__/entry-server.spec.ts`). Logika skryptów żyje w `scripts/lib/*.mjs` i jest testowana z `scripts/__tests__` (wzorzec `archive-count`).
- **Środowisko:** pnpm 11.5.0, Docker 29 dostępny lokalnie. `sharp` jest w devDependencies; na `design/hero-variants` `pnpm install` pod pnpm 11 wymagał `pnpm-workspace.yaml` z `allowBuilds: { sharp: false }`.

## Desired End State

- Na `/` header jest widoczny od pierwszej klatki (także w prerenderowanym HTML, bez `aria-hidden`), przezroczysty nad hero, a po przewinięciu > 80 px dostaje tło, blur i border. Na pozostałych trasach wygląda jak dziś.
- Strona nie wysyła żadnego żądania do `api.iconify.design`, `fonts.googleapis.com` ani `fonts.gstatic.com`. Ikony pochodzą z `src/generated/icons.json`, fonty z `dist/assets/*.woff2`.
- Każda odpowiedź nginx (200, 404, pliki statyczne) ma `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` i `Content-Security-Policy`; konsola przeglądarki nie pokazuje naruszeń CSP; statusy z B4 bez zmian.
- `og:locale:alternate` występuje dokładnie raz i zawsze jest przeciwny do `og:locale` — w prerenderze i po przełączeniu języka w przeglądarce.
- README opisuje projekt, komendy i konwencje; pozycje B4, B6, C1, D1, D2, D3, D5 w `context/site-audit-2026-11.md` są odhaczone.
- Weryfikacja: `pnpm test`, `pnpm type-check`, `pnpm lint`, `pnpm build`, `scripts/check-nginx.sh` przechodzą.

### Key Discoveries:

- `src/seo/html-template.ts:12-23` — `META_LINE('property', 'og:locale')` dopasowuje `property="og:locale" content=` i nie łapie `og:locale:alternate`, więc nowy wpis w `TAGS` nie koliduje z istniejącym.
- `src/seo/html-template.ts:62-64` — `assertOnce` wymaga, by każdy tag z `TAGS` był w szablonie dokładnie raz. Po dodaniu alternate do `TAGS` prerender wywali build, jeśli `index.html` znowu dostanie duplikat — to jest strażnik B6.
- `src/seo/__tests__/html-template.spec.ts:5-23` — szablon testowy ma już `og:locale = en_US` i jeden `og:locale:alternate = pl_PL`, a `meta.ogLocale = pl_PL`; dziś `injectPage` produkuje z tego `og:locale = pl_PL` i alternate `pl_PL` — gotowy przypadek na czerwony test.
- `@iconify/vue` bez propsa `ssr` renderuje na serwerze pusty `<svg>` i dopiero po `onMounted` wstawia ikonę (`iconify.mjs:1741`, `1822-1830`), więc rejestracja kolekcji tylko w `main.ts` nie zmienia HTML z SSR i nie grozi niezgodnością hydracji.
- `docker/nginx.conf` — `add_header` w bloku `location` nadpisuje wszystkie `add_header` z poziomu `server`. Wersja z `design/hero-variants` miała ten błąd w `location /assets/` (powtórzyła 2 z 6 nagłówków).

## What We're NOT Doing

- Żadnych zmian w `src/content/*.json` ani w tekstach komponentów.
- Nic z `design/hero-variants` poza C1/D1/D2/D3/B6/D5: bez commit logu, `useNavShortcuts`/`<kbd>`, ikony przy CV w headerze, `ProductionStatus`, JSON-LD w `index.html` (prerender już go wstrzykuje), WebP dla `menu-maker`/`rozgadana-jana` (C2).
- Bez zmian w B4 — konfiguracja 404 z `site-prerender` zostaje; skrypt tylko ją sprawdza.
- Bez `Cache-Control` dla `/assets/` i bez nowych bloków `location` (decyzja: tylko nagłówki).
- Bez `includeSubDomains`/`preload` w HSTS (subdomeny projektów są poza tym repo).
- Bez CSP w trybie Report-Only i bez endpointu raportów.
- Bez renderowania ikon w HTML z SSR (props `ssr` w `@iconify/vue`) — osobna decyzja, bo grozi niezgodnością hydracji.
- Bez URL-owego locale i `hreflang` (B2).
- Bez odhaczania B1/B3/B5 w audycie — zamknęła je zmiana `site-prerender`; odhaczenie zostaje dla właściciela audytu.
- Bez deployu — `docker/nginx.conf` trafia na serwer przez repo infra.

## Implementation Approach

Kolejność wynika z CSP: zanim nginx dostanie `connect-src 'self'` i `font-src 'self'`, strona musi przestać pobierać ikony i fonty z zewnątrz, inaczej faza 3 zepsułaby produkcję. Faza 1 to czysta logika SSR/meta testowana vitestem, faza 2 usuwa zależności zewnętrzne, faza 3 zakłada nagłówki i zostawia w repo skrypt, który sprawdza je razem z B4, faza 4 dokumentuje. Kod ikon portujemy z `design/hero-variants:scripts/build-icons.mjs`, ale rozdzielamy na `scripts/lib/icons.mjs` (testowalna logika) i cienki CLI, zgodnie z wzorcem `archive-count`.

## Critical Implementation Details

- **Dziedziczenie `add_header`:** wszystkie nagłówki bezpieczeństwa muszą być na poziomie `server` i żaden blok `location` nie może mieć własnego `add_header` — w przeciwnym razie odpowiedzi z tego bloku tracą wszystkie nagłówki. Zostaw w `nginx.conf` komentarz z tą regułą. `always` jest wymagane, żeby nagłówki trafiły też na 404 z `error_page`.
- **pnpm 11 i `sharp`:** jeśli `pnpm add` w fazie 2 kończy się błędem o niezatwierdzonym skrypcie budującym `sharp`, dodaj `pnpm-workspace.yaml` z `design/hero-variants` (`allowBuilds: { sharp: false }` z komentarzem). Jeśli instalacja przechodzi bez niego, pliku nie dodawaj.

## Phase 1: Header i OG locale (C1, B6)

### Overview

Header na `/` jest widoczny od razu, a `og:locale:alternate` zawsze wskazuje drugi język. Obie zmiany najpierw dostają czerwony test na HTML z SSR / `injectPage`.

### Changes Required:

#### 1. Test regresji C1

**File**: `src/__tests__/entry-server.spec.ts`

**Intent**: Dodaj test, który renderuje `/` i sprawdza, że otwierający tag `<header>` nie ma `aria-hidden` ani klas ukrywających (`-translate-y-full`, `opacity-0`, `pointer-events-none`). Dziś nie przechodzi.

**Contract**: Wyciągnięcie tagu przez `/<header[^>]*>/` z `render('/').html`; asercje na brak tych ciągów. Drugi przypadek: `render('/projects')` — header z tłem (`bg-background/70`), żeby zablokować regresję na podstronach.

#### 2. Header zawsze widoczny

**File**: `src/components/layout/SiteHeader.vue`

**Intent**: Zastąp `headerVisible` stanem „solid” (tło + blur + border): na podstronach zawsze, na `/` po przewinięciu > 80 px lub przy otwartym menu mobilnym; w przeciwnym razie przezroczysty z `border-transparent`. Usuń `aria-hidden`, `pointer-events-none`, translację i `opacity-0`; przejście zawęź do kolorów (`transition-colors`, z `motion-reduce:transition-none`).

**Contract**: Computed `headerSolid` (nazwa jak na `design/hero-variants`) bez gałęzi `isMobile`; `isMobile` + `updateIsMobile` zostają tylko do zamykania menu przy przejściu na desktop. Nawigacja, LanguageSwitcher i CV bez zmian w treści i strukturze.

#### 3. Test regresji B6

**File**: `src/seo/__tests__/html-template.spec.ts`, `src/seo/__tests__/page-meta.spec.ts`

**Intent**: W `html-template.spec` dodaj test, że po `injectPage` z `ogLocale: 'pl_PL'` wynik ma dokładnie jeden `og:locale:alternate` i jest on `en_US` (i odwrotnie dla `en_US`), oraz że szablon z dwoma alternate rzuca błędem. W `page-meta.spec` — `pageMeta` zwraca `ogLocaleAlternate` przeciwny do `ogLocale` dla obu słowników.

**Contract**: Obiekt `meta` w specu dostaje pole `ogLocaleAlternate`; to nowe wymaganie, nie zmiana starej asercji.

#### 4. Alternate z jednego źródła

**File**: `src/seo/page-meta.ts`, `src/seo/html-template.ts`, `src/App.vue`, `index.html`

**Intent**: `PageMeta` dostaje `ogLocaleAlternate` liczone w `pageMeta` obok `ogLocale` (`pl` → `en_US`, inaczej `pl_PL`). `injectPage` podmienia linię `og:locale:alternate` tak jak `og:locale`. `App.vue` `applyMeta` ustawia `meta[property="og:locale:alternate"]`. Z `index.html` usuń duplikat `pl_PL` (linia 18).

**Contract**: `PageMeta.ogLocaleAlternate: string`; nowy wpis `'og:locale:alternate': META_LINE('property', 'og:locale:alternate')` w `TAGS` (objęty `assertOnce`). `index.html` ma dokładnie jedną linię `og:locale:alternate` (`en_US`).

### Success Criteria:

#### Automated Verification:

- Nowe testy C1 i B6 nie przechodzą przed zmianą w komponentach/SEO i przechodzą po niej: `pnpm test`
- Type checking passes: `pnpm type-check`
- Linting passes: `pnpm lint`
- Build z prerenderem przechodzi: `pnpm build`
- `dist/index.html` ma jeden `og:locale:alternate` z `en_US`, a otwierający `<header>` nie zawiera `aria-hidden`: `grep -c 'og:locale:alternate' dist/index.html` = 1, `grep -o '<header[^>]*>' dist/index.html`

#### Manual Verification:

- `pnpm preview`, `/` na 1440 px: header widoczny od razu, przezroczysty nad hero, po przewinięciu dostaje tło i border; nie zasłania treści hero
- `/` na 390 px: header i przycisk menu widoczne, menu otwiera się z tłem
- Po przełączeniu na EN w DevTools: `og:locale = en_US`, `og:locale:alternate = pl_PL`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Ikony i fonty lokalnie (D1, D2)

### Overview

Strona przestaje pobierać cokolwiek z zewnętrznych hostów: ikony z wygenerowanego `src/generated/icons.json`, fonty z pakietów `@fontsource-variable`.

### Changes Required:

#### 1. Test regresji D1

**File**: `scripts/__tests__/icons.spec.ts`

**Intent**: Test zbiera wszystkie nazwy `prefix:name` z `src/` (przez `collectIconNames` z `scripts/lib/icons.mjs`) i sprawdza, że po `registerIcons()` z `@/icons` każda z nich jest załadowana (`iconLoaded` z `@iconify/vue`). Drugi przypadek: `buildIconCollections` rzuca błędem dla nieistniejącej ikony. Dziś nie przechodzi (brak modułów i pliku).

**Contract**: Test pilnuje, że zacommitowany `icons.json` pokrywa każdą ikonę w kodzie — dodanie ikony bez `pnpm generate:icons` czerwieni `pnpm test`.

#### 2. Logika i CLI ikon

**File**: `scripts/lib/icons.mjs`, `scripts/build-icons.mjs`, `src/generated/icons.json`, `package.json`

**Intent**: Przenieś logikę z `design/hero-variants:scripts/build-icons.mjs` do `scripts/lib/icons.mjs`; CLI tylko ją wywołuje i zapisuje JSON. Błędy (brak ikony w zestawie, brak pakietu) kończą CLI kodem 1 z przyczyną, jak `scripts/prerender.mjs:117-123`. Wygeneruj i zacommituj `src/generated/icons.json`.

**Contract**: `scripts/lib/icons.mjs` eksportuje `ICON_SETS` (`simple-icons`, `lucide` → ścieżka `@iconify-json/*/icons.json`), `collectIconNames(srcDir): Promise<Map<prefix, string[]>>` (pomija `src/generated/`, czyta `.vue`/`.ts`/`.json`) i `buildIconCollections(names, rootDir): Promise<IconifyJSON[]>` (rzuca na brakujące ikony). `package.json`: devDependencies `@iconify/utils`, `@iconify-json/simple-icons`, `@iconify-json/lucide`; skrypt `generate:icons`; `build` uruchamia `generate:icons` przed `build:app` (obok `generate:archive`).

#### 3. Rejestracja w aplikacji

**File**: `src/icons.ts`, `src/main.ts`

**Intent**: `registerIcons()` dodaje każdą kolekcję z `icons.json` przez `addCollection` i rzuca błędem, jeśli `addCollection` zwróci `false` (bez cichego pominięcia). `main.ts` wywołuje ją przed `mount`.

**Contract**: `export function registerIcons(): void` w `src/icons.ts`. Komponenty z `<Icon icon="…">` bez zmian.

#### 4. Test regresji D2

**File**: `src/__tests__/index-html.spec.ts`

**Intent**: Test czyta `index.html` i sprawdza, że każdy `<link href>` i `<script src>` jest lokalny (ścieżka względna/absolutna od `/`) albo wskazuje `https://kostecki.dev` (canonical). Dziś nie przechodzi przez `fonts.googleapis.com` i `fonts.gstatic.com`.

**Contract**: Zakres to tylko tagi ładujące zasoby; `og:image`/`twitter:image` (meta) nie są objęte.

#### 5. Fonty self-hosted

**File**: `package.json`, `src/main.ts`, `src/assets/main.css`, `index.html`

**Intent**: Dodaj zależności `@fontsource-variable/jetbrains-mono` i `@fontsource-variable/work-sans`, zaimportuj je w `main.ts`, w tokenach `--font-sans`/`--font-mono`/`--font-body` wstaw rodziny `… Variable` przed obecnymi nazwami. Usuń z `index.html` dwa `preconnect` i stylesheet Google Fonts.

**Contract**: `--font-sans: 'Work Sans Variable', 'Work Sans', ui-sans-serif, …` itd. jak na `design/hero-variants:src/assets/main.css`; reszta tokenów bez zmian.

### Success Criteria:

#### Automated Verification:

- Testy D1 i D2 nie przechodzą przed zmianą i przechodzą po niej: `pnpm test`
- `pnpm generate:icons` kończy się sukcesem, a `git diff --exit-code src/generated/icons.json` po nim jest pusty
- Type checking passes: `pnpm type-check`
- Linting passes: `pnpm lint`
- Build z prerenderem przechodzi: `pnpm build`
- W `dist/` nie ma odwołań do Google Fonts: `grep -rE 'googleapis|gstatic' dist` nic nie zwraca; do `api.iconify.design` strona nie wysyła żądań (domyślny provider `@iconify/vue` zostaje w bundlu jako ciąg znaków, ale `registerIcons()` podmienia moduł API — pilnuje tego `scripts/__tests__/icons.spec.ts`)
- W `dist/assets/` są pliki `.woff2`: `ls dist/assets/*.woff2`

#### Manual Verification:

- `pnpm preview`, DevTools → Network z wyczyszczonym cache: brak żądań do `api.iconify.design`, `fonts.googleapis.com`, `fonts.gstatic.com`; ikony w stopce, na `/skills`, `/projects` i `/contact` widoczne
- Fonty wyglądają jak przed zmianą (JetBrains Mono w nagłówkach/nawigacji, Work Sans w treści, polskie znaki poprawne)
- Ikony widoczne z włączonym blokerem reklam

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Nagłówki bezpieczeństwa (D3)

### Overview

`docker/nginx.conf` dostaje sześć nagłówków bezpieczeństwa z CSP na poziomie `server`, a repo dostaje skrypt, który sprawdza je razem ze statusami z B4 na lokalnym `nginx:alpine`.

### Changes Required:

#### 1. Skrypt sprawdzający (czerwony przed zmianą)

**File**: `scripts/check-nginx.sh`, `package.json`

**Intent**: Skrypt sprawdza zbudowane `dist/` z `docker/nginx.conf` na `nginx:alpine`: `nginx -t`, statusy B4 i obecność nagłówków. Każdy brak wypisuje z nazwą ścieżki i nagłówka, a na końcu kończy się kodem 1, jeśli cokolwiek nie przeszło. Kontener sprząta `trap`, także przy błędzie. Przed zmianą w nginx skrypt nie przechodzi na nagłówkach.

**Contract**: `set -euo pipefail`; wymaga `dist/index.html` (inaczej błąd z podpowiedzią `pnpm build`); port z `CHECK_NGINX_PORT` (domyślnie 8080); czeka na gotowość kontenera pętlą z limitem. Statusy: `200` dla `/`, `/projects`, `/projects/`, `/cv`, `/sitemap.xml`, `/llms.txt`, `/favicon.svg`; `404` dla `/nie-ma`; `/projects` bez przekierowania. Nagłówki (wszystkie sześć) na `/`, `/projects`, `/nie-ma` i `/favicon.svg`; CSP zawiera `default-src 'self'` i `connect-src 'self'`. Skrypt `check:nginx` w `package.json`.

#### 2. Nagłówki w nginx

**File**: `docker/nginx.conf`

**Intent**: Dodaj nagłówki na poziomie `server` z `always`, z komentarzem o dziedziczeniu `add_header` i o tym, że TLS kończy Traefik. Konfiguracja 404 z `site-prerender` bez zmian.

**Contract**:

```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
```

`style-src 'unsafe-inline'` zostaje, bo `@iconify/vue` i Vue ustawiają atrybuty `style` w DOM; bloki `location` nie dostają żadnego `add_header`.

### Success Criteria:

#### Automated Verification:

- `scripts/check-nginx.sh` nie przechodzi przed zmianą w `docker/nginx.conf` (brak nagłówków) i przechodzi po niej: `pnpm build && pnpm check:nginx`
- Linting passes: `pnpm lint`
- Testy dalej przechodzą: `pnpm test`

#### Manual Verification:

- Na kontenerze z `check-nginx.sh` (lub tym samym `docker run`) w przeglądarce: `/`, `/projects`, `/skills`, `/contact`, `/cv`, `/nie-ma` — konsola bez naruszeń CSP, ikony, fonty i style działają, przełącznik języka działa
- Po deployu przez repo infra: `curl -sI https://kostecki.dev/` i `curl -sI https://kostecki.dev/nie-ma` pokazują sześć nagłówków; securityheaders.com daje co najmniej A

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: README i audyt (D5)

### Overview

README opisuje ten projekt zamiast szablonu Vite, a audyt pokazuje, co zostało zamknięte.

### Changes Required:

#### 1. README

**File**: `README.md`

**Intent**: Napisz README projektu po angielsku (jak obecny): czym jest strona, stack, komendy (`dev`, `build`, `test`, `lint`, `type-check`, `preview`, `check:nginx`, `generate:icons`), jak działa treść (`src/content/{pl,en}.json` + `src/types/content.ts`, staże z dat), prerender i deploy (zachowaj obecny akapit o `nginx.conf` deployowanym razem z `dist/` i zamrożonych wartościach), licznik archiwum (zachowaj obecny akapit), ikony (`generate:icons`, test pokrycia, commit `icons.json`), fonty self-hosted, nagłówki/CSP (przy nowych zewnętrznych zasobach trzeba zmienić CSP) oraz wskazówki dla agentów (`CLAUDE.md`, `context/foundation/site-focus.md`, `context/site-audit-2026-11.md`). Usuń sekcje szablonu Vite (IDE, browser devtools, Volar, Vite config).

**Contract**: Fakty w README zgadzają się z `package.json` i kodem — każda wymieniona komenda istnieje w `scripts`, każda ścieżka istnieje. Bez treści marketingowej.

#### 2. Audyt

**File**: `context/site-audit-2026-11.md`

**Intent**: Odhacz B4, B6, C1, D1, D2, D3, D5 z krótką adnotacją z datą i tym, co zrobiono (styl jak w adnotacjach z `design/hero-variants`, np. *Done 2026-11-09: …*). B4 z odwołaniem do zmiany `site-prerender`.

**Contract**: Tylko te siedem pozycji; reszta pliku bez zmian.

### Success Criteria:

#### Automated Verification:

- Każda komenda `pnpm <x>` z README istnieje w `package.json` (`scripts`)
- Każda ścieżka plików z README istnieje w repo
- Pozycje B4, B6, C1, D1, D2, D3, D5 w `context/site-audit-2026-11.md` są `[x]`: `grep -E '\*\*(B4|B6|C1|D1|D2|D3|D5)\.' context/site-audit-2026-11.md`

#### Manual Verification:

- README czyta się jako opis tego projektu; nowa osoba (lub agent) wie z niego, jak zbudować, przetestować i sprawdzić nginx

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- `entry-server.spec`: header na `/` bez `aria-hidden` i klas ukrywających; na `/projects` z tłem.
- `html-template.spec`: dokładnie jeden `og:locale:alternate`, przeciwny do `og:locale` (oba kierunki); szablon z duplikatem rzuca błędem.
- `page-meta.spec`: `ogLocaleAlternate` dla obu słowników.
- `scripts/__tests__/icons.spec`: każda ikona z `src/` załadowana po `registerIcons()`; brakująca ikona → błąd z `buildIconCollections`.
- `index-html.spec`: `<link>`/`<script>` w `index.html` bez zewnętrznych hostów.

### Integration Tests:

- `pnpm build` (prerender z `assertOnce` na `og:locale:alternate`).
- `scripts/check-nginx.sh`: statusy B4 i nagłówki D3 na realnym `nginx:alpine` z `dist/`.

### Manual Testing Steps:

1. `pnpm preview`, `/` na 1440 px i 390 px: header od razu widoczny, przewijanie zmienia tło.
2. DevTools Network: zero żądań do iconify/Google Fonts; ikony i fonty widoczne, także z blokerem reklam.
3. Kontener z nginx: konsola bez naruszeń CSP na wszystkich trasach i 404.
4. Przełączenie na EN: `og:locale`/`og:locale:alternate` zamieniają się miejscami.

## Performance Considerations

Fonty z własnej domeny usuwają dwa połączenia DNS/TLS do Google. Pakiety `@fontsource-variable` z `unicode-range` dają przeglądarce pobrać tylko potrzebne podzbiory (latin, latin-ext). `icons.json` zawiera tylko 11 ikon (kilka KB w bundlu).

## Migration Notes

`docker/nginx.conf` jest montowany przez `docker-compose.yml` i wdrażany razem z `dist/` przez repo infra; po deployu sprawdź nagłówki `curl -sI`. Wycofanie D3: przywrócenie poprzedniego `nginx.conf` i `nginx -s reload`, bez rebuildu.

## References

- Implementacja referencyjna: `design/hero-variants` commit `423456f` (`scripts/build-icons.mjs`, `src/main.ts`, `src/assets/main.css:16-23`, `src/components/layout/SiteHeader.vue`, `docker/nginx.conf`, `README.md`)
- Audyt: `context/site-audit-2026-11.md` (B4, B6, C1, D1, D2, D3, D5)
- Prerender i B4: `context/archive/2026-11-09-site-prerender/plan.md` (faza 4, wzorzec weryfikacji `docker run` + `curl`)
- Wzorzec lib + spec dla skryptów: `scripts/lib/archive-count.mjs`, `scripts/__tests__/archive-count.spec.ts`
- Obsługa błędów CLI: `scripts/prerender.mjs:117-123`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Header i OG locale (C1, B6)

#### Automated

- [x] 1.1 Nowe testy C1 i B6 nie przechodzą przed zmianą w komponentach/SEO i przechodzą po niej: `pnpm test` — d440113
- [x] 1.2 Type checking passes: `pnpm type-check` — d440113
- [x] 1.3 Linting passes: `pnpm lint` — d440113
- [x] 1.4 Build z prerenderem przechodzi: `pnpm build` — d440113
- [x] 1.5 `dist/index.html` ma jeden `og:locale:alternate` z `en_US`, a otwierający `<header>` nie zawiera `aria-hidden` — d440113

#### Manual

- [x] 1.6 `/` na 1440 px: header widoczny od razu, przezroczysty nad hero, po przewinięciu dostaje tło i border; nie zasłania treści hero — d440113
- [x] 1.7 `/` na 390 px: header i przycisk menu widoczne, menu otwiera się z tłem — d440113
- [x] 1.8 Po przełączeniu na EN: `og:locale = en_US`, `og:locale:alternate = pl_PL` — d440113

### Phase 2: Ikony i fonty lokalnie (D1, D2)

#### Automated

- [x] 2.1 Testy D1 i D2 nie przechodzą przed zmianą i przechodzą po niej: `pnpm test` — 91b1cef
- [x] 2.2 `pnpm generate:icons` kończy się sukcesem, a `git diff --exit-code src/generated/icons.json` po nim jest pusty — 91b1cef
- [x] 2.3 Type checking passes: `pnpm type-check` — 91b1cef
- [x] 2.4 Linting passes: `pnpm lint` — 91b1cef
- [x] 2.5 Build z prerenderem przechodzi: `pnpm build` — 91b1cef
- [x] 2.6 W `dist/` nie ma odwołań do zewnętrznych hostów ikon i fontów — 91b1cef
- [x] 2.7 W `dist/assets/` są pliki `.woff2` — 91b1cef

#### Manual

- [x] 2.8 DevTools Network: brak żądań do `api.iconify.design`, `fonts.googleapis.com`, `fonts.gstatic.com`; ikony w stopce, na `/skills`, `/projects` i `/contact` widoczne — 91b1cef
- [x] 2.9 Fonty wyglądają jak przed zmianą, polskie znaki poprawne — 91b1cef
- [x] 2.10 Ikony widoczne z włączonym blokerem reklam — 91b1cef

### Phase 3: Nagłówki bezpieczeństwa (D3)

#### Automated

- [x] 3.1 `scripts/check-nginx.sh` nie przechodzi przed zmianą w `docker/nginx.conf` i przechodzi po niej: `pnpm build && pnpm check:nginx` — e62ead4
- [x] 3.2 Linting passes: `pnpm lint` — e62ead4
- [x] 3.3 Testy dalej przechodzą: `pnpm test` — e62ead4

#### Manual

- [x] 3.4 Na kontenerze lokalnym: wszystkie trasy i `/nie-ma` bez naruszeń CSP w konsoli; ikony, fonty, style i przełącznik języka działają — e62ead4
- [ ] 3.5 Po deployu przez repo infra: `curl -sI` na `/` i `/nie-ma` pokazuje sześć nagłówków; securityheaders.com co najmniej A

### Phase 4: README i audyt (D5)

#### Automated

- [x] 4.1 Każda komenda `pnpm <x>` z README istnieje w `package.json` — 540145c
- [x] 4.2 Każda ścieżka plików z README istnieje w repo — 540145c
- [x] 4.3 Pozycje B4, B6, C1, D1, D2, D3, D5 w audycie są `[x]` — 540145c

#### Manual

- [x] 4.4 README czyta się jako opis tego projektu; wiadomo z niego, jak zbudować, przetestować i sprawdzić nginx — 540145c
