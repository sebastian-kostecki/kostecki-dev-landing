# Hero i panel „W skrócie” dla rekrutera — plan implementacji

## Overview

Przebudowa hero strony głównej pod rekrutera (`context/foundation/site-focus.md` p. 4, 5, 7):
nowa treść hero z liczonym stażem, dwa CTA (kontakt + CV), panel „W skrócie” w prawej kolumnie
hero, duotone'owe zdjęcie (na razie placeholder) w sekcji O mnie, strona `/cv` do druku z tych
samych danych, tytuł sekcji O mnie bez kolizji z sekcją AI i etykieta „Źródło” w stopce.
Elementy przenosimy wybiórczo z gałęzi `design/hero-variants` (commit 423456f), bez CommitLog
i skrótów klawiszowych. Logika staży i spójność locale dostają testy Vitest.

## Current State Analysis

- Hero jest inline w `src/views/HomeView.vue:15-60`: etykieta, `h1` z imieniem, `valueProp` +
  `valuePropAccent`, `subtitle`, dwa przyciski (kontakt, „Zobacz projekty”). Treść hero
  (`src/content/pl.json:78-88`) mówi „Buduję i rozwijam produkcyjne aplikacje backendowe w PHP”,
  bez stażu, produktu i pracodawcy — sprzeczne z p. 4/7.
- Staże to literały: `about.paragraphs[0]` („Od 4 lat” / „For 4 years”) i
  `projects.featured.context.period` („3,5+ roku” / „3.5+ years”) w obu locale (jedyne dwa
  wystąpienia; sprawdzone grepem). Literały starzeją się (p. 8, audyt A6).
- `cv.href` = `""`, więc przyciski CV w `SiteHeader.vue:112-120,155-163` i
  `ContactView.vue:32-41` są ukryte; gdy dostaną wartość, otworzą się jako `<a target="_blank">`.
- Tytuł sekcji O mnie = „Jak pracuję” (zderza się z sekcją AI, p. 5), index „01 / O mnie”.
- Link do repo w stopce istnieje (`SiteFooter.vue:51-58`), etykieta `ui.siteSource` = „Kod strony”.
  Repo `sebastian-kostecki/kostecki-dev-landing` jest publiczne (`gh api … --jq .private` → `false`).
- Brak runnera testów (`package.json`: tylko `type-check`, `lint`, `format`). Szkielet create-vue
  jest gotowy: `tsconfig.app.json` wyklucza `src/**/__tests__/*`, `tsconfig.node.json` już
  obejmuje `vitest.config.*`.
- Klucze `pl.json` i `en.json` są dziś identyczne (sprawdzone skryptem: zero różnic ścieżek).
- Gałąź `design/hero-variants` jest jednym commitem na wierzchu `development`; pełna mapa
  plików „1:1 / adaptacja / nie przenosimy” w `research.md` p. 2-5.

## Desired End State

- Hero (desktop): po lewej etykieta „Backend Developer / PHP · Laravel”, imię, nagłówek
  „Od 4 lat rozwijam produkcyjny produkt B2B: **PanelAlpha w ModulesGarden.**”, podtytuł z p. 7,
  CTA „Porozmawiajmy” i „CV”; po prawej panel „W skrócie” z sześcioma wierszami z p. 7.
  Na mobile panel pod tekstem.
- Staże w hero, panelu, O mnie i karcie PanelAlpha liczone z `src/content/career.ts`
  przy ładowaniu strony, zawsze zaokrąglone w dół do pół roku, bez „+”.
- Sekcja O mnie: index „01 / O mnie” / „01 / About” (bez zmian, konwencja „NN / Kategoria” jak
  pozostałe sekcje), tytuł „Kim jestem” / „Who I am” (nie „Jak pracuję”), duotone'owy placeholder zdjęcia
  z podpisem „Zdjęcie” / „Photo” pod nagłówkiem.
- `/cv` renderuje stronę CV z danych serwisu; druk (Ctrl+P) pokazuje tylko arkusz CV, bez
  nagłówka i stopki. Linki CV w nagłówku, kontakcie i hero prowadzą do `/cv` w tej samej karcie.
- Stopka: „Źródło” / „Source”.
- `pnpm test` przechodzi: testy staży, spójności kluczy locale i braku nierozwiązanych tokenów.

### Key Discoveries:

- `design/hero-variants:src/composables/useDuration.ts:5-10` — `yearsSince` liczy miesiące z
  dokładnością do miesiąca (dzień ignorowany) i zaokrągla w dół do pół roku; `:26-31` dokleja „+”
  tylko dla niecałkowitych wartości — tę regułę usuwamy (decyzja planu).
- `polishYears` dla dopełniacza (`{since:…}`) daje „4 lat”, „roku”, „3,5 roku” — dlatego nagłówek
  hero używa `{since:modulesGarden}`, a nie `{years:…}` jak w szkicu p. 7 („Od 4 lat”, nie „Od 4 lata”).
- `vite.config.ts:9` eksportuje funkcję `({ command }) => …`, więc `mergeConfig` z nią wymaga
  wywołania; prościej, by `vitest.config.ts` sam definiował alias `@`.
- `useContent.ts:7-10` rzutuje JSON przez `as SiteContent` — brakujący klucz w jednym locale
  nie zostanie wykryty przez `vue-tsc`; stąd test spójności kluczy.
- `design/hero-variants:src/components/ui/SummaryPanel.vue:12` ma `lg:grid-cols-3`, za ciasne w
  kolumnie 30rem; w hero potrzebna jedna kolumna na `lg`.
- `ui.viewMyWork` używane tylko w hero (`HomeView.vue:55`) — po usunięciu trzeciego CTA staje się
  martwym polem.
- `CvView.vue` z gałęzi nie odwołuje się do `cv.contactTitle` — pole pomijamy.

## What We're NOT Doing

- `CommitLog.vue`, `useActivity.ts`, `activity.json`, `fetch-activity.mjs` (licznik archiwum to `site-focus-ai-proof`).
- Skróty klawiszowe (`useNavShortcuts.ts`, `<kbd>`, `ui.shortcutsHint`), zmiana `nav[].index` `"01"`→`"1"`.
- `hero.personal` (zdanie osobiste zostaje w O mnie, p. 5).
- Trzeci CTA „Zobacz projekty” w hero.
- Prawdziwe zdjęcie i pole na `src`/`alt` zdjęcia — dojdą, gdy będzie plik (p. 9); teraz placeholder.
- `ProductTeaser`, `ProductionStatus`, `SourceRef`, `usedIn`, `highlightSources`, `ciRepo`,
  `responsibilitySources` (`site-focus-experience`).
- Kopiowanie e-maila i `contact.responseNote` w kontakcie.
- `headerVisible`→`headerSolid` (audyt C1), fonty/ikony lokalnie, `--font-*`, `.kbd`, `.source-ref`.
- `/cv` w `public/sitemap.xml`, JSON-LD, `llms.txt`, `og:locale` (zmiany `site-prerender` / `site-audit-tech-fixes`).
- Prerender — parser ATS dalej widzi pustą stronę do zmiany `site-prerender`.
- Merge gałęzi `design/hero-variants` (wciągnąłby 46 plików).
- Zmiany design tokens w `main.css` (p. 8).

## Implementation Approach

Trzy fazy, każda zostawia działającą stronę. Faza 1 to czysta logika, pisana test-first: najpierw
runner i nieprzechodzące testy, potem pliki z gałęzi (z usuniętym „+”). Faza 2 zmienia to, co
widać na stronie głównej; przycisk CV jest już w kodzie, ale ukryty, bo `cv.href` zostaje `""`.
Faza 3 dodaje `/cv` i dopiero wtedy ustawia `cv.href = "/cv"`, co włącza wszystkie przyciski CV
naraz. Pliki z gałęzi bierzemy przez `git show design/hero-variants:<plik>` i ręczną adaptację,
nigdy przez merge. Każda faza zmienia oba locale i `src/types/content.ts` razem (p. 8).

## Critical Implementation Details

**Timing & lifecycle** — `resolveDurations` uruchamia się raz, przy imporcie `useContent.ts`
(na poziomie modułu, przed budową `dictionaries`), a nie w `computed`. Testy `formatDuration`
nie mogą polegać na module-level stanie: ustawiają czas przez `vi.useFakeTimers()` +
`vi.setSystemTime(...)` przed wywołaniem i przywracają go po teście.

## Faza 1: Liczone staże, test-first

### Overview

Wprowadza Vitest, testy logiki staży i treści, a następnie `career.ts` + `useDuration.ts`
z gałęzi (bez „+”) i podpina rozwiązywanie tokenów w `useContent`. Dwa literały staży stają się
tokenami.

### Changes Required:

#### 1. Runner testów

**File**: `package.json`, `vitest.config.ts` (nowy), `tsconfig.vitest.json` (nowy), `tsconfig.json`

**Intent**: Dodać Vitest jako dev dependency i skrypt `test`, w środowisku `node` (testowana jest
czysta logika, bez DOM), tak by `vue-tsc --build` sprawdzał też pliki testów.

**Contract**: `pnpm test` = `vitest run`. `vitest.config.ts` definiuje alias `@` → `./src`
(jak `vite.config.ts:17-20`) i `test.include: ['src/**/__tests__/*.spec.ts']`. Wersja Vitest
musi akceptować `vite@^8` w peer dependencies. `tsconfig.vitest.json` rozszerza
`tsconfig.app.json`, nadpisuje `include` na `src/**/__tests__/*`, `exclude: []`, `types: ["node"]`,
własny `tsBuildInfoFile`; dodany do `references` w `tsconfig.json`. Testy importują `describe/it/expect/vi`
jawnie z `vitest` (bez globals).

#### 2. Testy staży (najpierw czerwone)

**File**: `src/composables/__tests__/useDuration.spec.ts` (nowy)

**Intent**: Opisać oczekiwane zachowanie staży przed dodaniem kodu; test pada, bo moduł nie istnieje,
a po skopiowaniu pliku z gałęzi pada na przypadkach z „+”, dopóki reguła nie zostanie usunięta.

**Contract**: Przypadki (czas ustawiany `vi.setSystemTime`, `careerSince` = MG `2022-11`, PA `2023-05`):

| Data „teraz” | Wywołanie | Oczekiwane |
| --- | --- | --- |
| 2026-11-09 | `formatDuration('modulesGarden','pl','years')` / `'since'` / `'en'` | „4 lata” / „4 lat” / „4 years” |
| 2026-11-09 | `formatDuration('panelAlpha','pl','years')` / `'en'` | „3,5 roku” / „3.5 years” |
| 2027-02-15 | PA pl years (45 mies.) | „3,5 roku” (bez „+”; gałąź dawała „3,5+ roku”) |
| 2027-05-10 | MG pl years / since; PA pl years / since | „4,5 roku” / „4,5 roku”; „4 lata” / „4 lat” |
| 2027-11-01 | MG pl years | „5 lat” |
| 2023-11-15 | MG pl years / since / en; PA pl years / en | „1 rok” / „roku” / „1 year”; „0,5 roku” / „0.5 years” |
| 2034-11-01 / 2044-11-01 | MG pl years | „12 lat” / „22 lata” |

Plus: `yearsSince('2022-11', new Date(2027, 1, 15))` = `4` (liczba, nie obiekt);
`fillDurations('Od {since:modulesGarden} …', 'pl')` podstawia; `{years:unknown}` zostaje bez zmian;
tekst bez tokenów bez zmian; `resolveDurations` zachowuje strukturę zagnieżdżonych obiektów/tablic
i nie-stringi (`null`, liczby, boolean) oraz nie mutuje wejścia.

#### 3. Testy treści

**File**: `src/content/__tests__/locales.spec.ts` (nowy)

**Intent**: Strażnik dwóch rzeczy, których nie łapie `as SiteContent`: rozjazd kluczy między locale
i literówka w kluczu tokena. Oba testy przechodzą od razu (stan wyjściowy jest spójny) — chronią
fazy 2 i 3.

**Contract**: (a) zbiór ścieżek kluczy (rekurencyjnie, z indeksami tablic) `pl.json` = `en.json`;
(b) `JSON.stringify(resolveDurations(pl,'pl'))` i analogicznie EN nie zawierają dopasowania
`/\{\w+:\w+\}/` (szerzej niż `TOKEN`, by złapać też literówkę w formie, np. `{year:modulesGarden}`;
dziś treść nie ma żadnego wzorca `{słowo:słowo}`).

#### 4. Logika staży

**File**: `src/content/career.ts` (nowy), `src/composables/useDuration.ts` (nowy)

**Intent**: Przenieść oba pliki z gałęzi; w `useDuration.ts` usunąć regułę „+”, bo zaokrąglenie
w dół już znaczy „co najmniej”, a jedna reguła jest spójna (decyzja planu).

**Contract**: `career.ts` 1:1 (`careerSince`, `CareerKey`). `useDuration.ts`: `yearsSince(since, now?)`
zwraca `number` (pole `more` znika — nie ma konsumenta); `formatDuration` bez `plus` i bez
`replace(/ roku$/, '+ roku')`; aktualizacja komentarza JSDoc (bez „3,5+ roku”). `fillDurations`,
`resolveDurations`, `TOKEN` bez zmian.

#### 5. Podpięcie tokenów

**File**: `src/composables/useContent.ts`

**Intent**: Rozwiązywać tokeny raz przy ładowaniu modułu, jak na gałęzi.

**Contract**: `dictionaries.pl = resolveDurations(pl, 'pl') as SiteContent`, analogicznie `en`.

#### 6. Tokeny w treści

**File**: `src/content/pl.json`, `src/content/en.json`

**Intent**: Zastąpić dwa literały staży tokenami.

**Contract**: `about.paragraphs[0]`: „Od 4 lat” → „Od {since:modulesGarden}”; EN „For 4 years” →
„For {years:modulesGarden}”. `projects.featured.context.period`: „3,5+ roku” / „3.5+ years” →
„{years:panelAlpha}”.

### Success Criteria:

#### Automated Verification:

- Testy staży i treści przechodzą: `pnpm test`
- Type-check przechodzi (łącznie z plikami testów): `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- Build przechodzi: `pnpm build`

#### Manual Verification:

- Strona główna (PL i EN) pokazuje w O mnie „Od 4 lat” / „For 4 years”, a karta PanelAlpha „3,5 roku” / „3.5 years”

**Implementation Note**: Po zielonych kontrolach automatycznych zatrzymaj się na ręczne potwierdzenie przed fazą 2.

---

## Faza 2: Hero, panel „W skrócie”, O mnie, stopka

### Overview

Nowa treść i układ hero (dwie kolumny, dwa CTA), panel „W skrócie”, placeholder zdjęcia
w O mnie, nowy tytuł O mnie i etykieta „Źródło”. Przycisk CV jest w kodzie, ale niewidoczny
(`cv.href` = `""` do fazy 3).

### Changes Required:

#### 1. Typy

**File**: `src/types/content.ts`

**Intent**: Dodać pola panelu i placeholdera; usunąć martwe `ui.viewMyWork`.

**Contract**: `export interface SummaryItem { label: string; value: string; href?: string }`, z JSDoc na `href`:
„Wiersz z linkiem jest pomijany na `/cv` (`CvView` filtruje `!item.href`; kontakt pokazuje osobno)”;
`SiteContent.summary: { title: string; items: SummaryItem[] }`; `ui.photoPlaceholder: string`;
usunięte `ui.viewMyWork`. Typ `hero` bez zmian.

#### 2. Treść (oba locale)

**File**: `src/content/pl.json`, `src/content/en.json`

**Intent**: Treść hero i panelu wg p. 7 (język rekrutera), tytuł O mnie wg decyzji planu, etykiety UI.

**Contract**:

| Klucz | PL | EN |
| --- | --- | --- |
| `hero.label` | `Backend Developer / PHP · Laravel` | `Backend Developer / PHP · Laravel` |
| `hero.valueProp` | `Od {since:modulesGarden} rozwijam produkcyjny produkt B2B:` | `For {years:modulesGarden} I've been building a production B2B product:` |
| `hero.valuePropAccent` | `PanelAlpha w ModulesGarden.` | `PanelAlpha at ModulesGarden.` |
| `hero.subtitle` | `Integracje z panelami hostingowymi, moduły WHMCS, feature od modelu danych po działającą logikę u klienta. Kod piszę z agentami AI, w procesie z testami i review, który ma publiczne dowody.` | `Hosting control panel integrations, WHMCS modules, features from the data model to logic running for customers. I write code with AI agents, in a process with tests and review that leaves public evidence.` |
| `summary.title` | `W skrócie` | `At a glance` |
| `summary.items[0]` Rola / Role | `Backend Developer (PHP / Laravel), ModulesGarden` | `Backend Developer (PHP / Laravel), ModulesGarden` |
| `summary.items[1]` Doświadczenie / Experience | `{years:modulesGarden} komercyjnie, w tym {years:panelAlpha} przy PanelAlpha` | `{years:modulesGarden} commercially, {years:panelAlpha} of it on PanelAlpha` |
| `summary.items[2]` Stack | `PHP 8.5 · Laravel 13 · PostgreSQL / MySQL · Vue / React · Docker` | j.w. |
| `summary.items[3]` Na produkcji / In production | `PanelAlpha (B2B) oraz 2 własne produkty na własnym VPS-ie` | `PanelAlpha (B2B) and 2 products of my own on my own VPS` |
| `summary.items[4]` Praca z AI / AI workflow | `Claude Code i MCP, proces z testami i review` | `Claude Code and MCP, a process with tests and review` |
| `summary.items[5]` Kontakt / Contact | `kontakt@kostecki.dev`, `href: mailto:kontakt@kostecki.dev` | j.w. |
| `about.index` | bez zmian (`01 / O mnie`) | bez zmian (`01 / About`) |
| `about.title` | `Kim jestem` | `Who I am` |
| `ui.downloadCv` | `CV` | `CV` |
| `ui.siteSource` | `Źródło` | `Source` |
| `ui.photoPlaceholder` | `Zdjęcie` | `Photo` |
| `ui.viewMyWork` | usunąć | usunąć |

#### 3. Hero jako komponent

**File**: `src/components/hero/HeroIntro.vue` (nowy, z gałęzi), `src/views/HomeView.vue`

**Intent**: Wyodrębnić hero do `HeroIntro` (wersja z gałęzi) i ułożyć sekcję hero w dwie kolumny:
tekst po lewej, panel po prawej w miejscu, które na gałęzi zajmował CommitLog.

**Contract**: `HeroIntro.vue` = plik z gałęzi bez bloku `hero.personal` (gałąź :38-47), bez bloku
`<kbd>`/`shortcutsHint` (:63-66) i bez linku „Zobacz projekty”; zostają `RouterLink to="/contact"`
(`btn-primary`) i `RouterLink v-if="content.cv.href" :to="content.cv.href"` (`btn-secondary`, ikona
`FileText`, etykieta `ui.downloadCv`). `HomeView.vue`: kontener hero z gałęzi
(`grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]`) z `<HeroIntro />`
i `<SummaryPanel />`; usunąć inline hero.

#### 4. Panel „W skrócie”

**File**: `src/components/ui/SummaryPanel.vue` (nowy, z gałęzi)

**Intent**: Przenieść panel; dopasować siatkę do wąskiej kolumny hero.

**Contract**: Plik z gałęzi z siatką `sm:grid-cols-2 lg:grid-cols-1` zamiast `sm:grid-cols-2 lg:grid-cols-3`.

#### 5. Zdjęcie w O mnie

**File**: `src/components/hero/DuotonePhoto.vue` (nowy, z gałęzi), `src/views/HomeView.vue`, `src/assets/main.css`

**Intent**: Pokazać duotone'owy placeholder pod nagłówkiem sekcji O mnie (decyzja: placeholder na produkcji do czasu pliku).

**Contract**: `DuotonePhoto.vue` 1:1. W `HomeView.vue`, w `lg:col-span-4` sekcji O mnie, pod `SectionHeading`:
`<div class="corner-frame mx-3 max-w-[11rem] sm:max-w-[15rem]"><DuotonePhoto :placeholder-label="content.ui.photoPlaceholder" /></div>`.
`main.css`: przenieść z gałęzi bloki `.duotone-img`, `.duotone-tint`, `.duotone-scan`, `.corner-frame`,
`.corner-frame::before`, `.corner-frame::after` do tego samego `@layer`, co na gałęzi; bez `.kbd`, `.source-ref`, `--font-*`.

### Success Criteria:

#### Automated Verification:

- Testy (w tym spójność kluczy i brak nierozwiązanych tokenów po dodaniu `summary` i hero): `pnpm test`
- Type-check przechodzi: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- Build przechodzi: `pnpm build`
- Brak odwołań do usuniętego pola: `grep -rn viewMyWork src` nic nie zwraca

#### Manual Verification:

- Desktop (≥1024 px): hero w dwóch kolumnach, panel po prawej, sześć wierszy w jednej kolumnie, nagłówek łamie się czytelnie
- Mobile (375 px): panel pod tekstem hero, wiersze w jednej kolumnie, bez poziomego scrolla
- Hero PL: „Od 4 lat rozwijam produkcyjny produkt B2B: PanelAlpha w ModulesGarden.”; EN: „For 4 years I've been building…”
- W hero widoczny tylko przycisk „Porozmawiajmy” (CV ukryte do fazy 3)
- Panel: wiersz Kontakt jest linkiem `mailto:`, Doświadczenie pokazuje „4 lata komercyjnie, w tym 3,5 roku przy PanelAlpha”
- O mnie: index „01 / O mnie” / „01 / About”, tytuł „Kim jestem” / „Who I am”, placeholder z podpisem „Zdjęcie” / „Photo” w ramce
- Stopka: „Źródło” / „Source” prowadzi do publicznego repo

**Implementation Note**: Po zielonych kontrolach automatycznych zatrzymaj się na ręczne potwierdzenie przed fazą 3.

---

## Faza 3: Strona `/cv`

### Overview

Strona CV do druku z danych serwisu, trasa i meta, styl druku, ukrycie nagłówka i stopki
przy druku, włączenie linków CV (`cv.href = "/cv"`) jako nawigacji SPA.

### Changes Required:

#### 1. Typy

**File**: `src/types/content.ts`

**Intent**: Dodać treść strony CV i meta trasy.

**Contract**: `export interface CvCopy { title; intro; print; printHint; summaryTitle; experienceTitle; productsTitle; skillsTitle; generated: string }`
(bez `contactTitle` — `CvView` go nie używa); `SiteContent.cv: { href: string } & CvCopy`;
`SiteContent.routes.cv: RouteMetaCopy`.

#### 2. Treść (oba locale)

**File**: `src/content/pl.json`, `src/content/en.json`

**Intent**: Treść CV i meta z gałęzi 1:1; włączyć przyciski CV.

**Contract**: `routes.cv.{title,description}` i `cv.{title,intro,print,printHint,summaryTitle,experienceTitle,productsTitle,skillsTitle,generated}`
z gałęzi (PL i EN, tekst 1:1, bez `contactTitle`); `cv.href`: `""` → `"/cv"`.

#### 3. Widok i trasa

**File**: `src/views/CvView.vue` (nowy, z gałęzi), `src/router/index.ts`, `src/App.vue`, `public/cv/README.md` (usunąć)

**Intent**: Dodać stronę CV z poprawnymi meta.

**Contract**: `CvView.vue` 1:1. Router: `{ path: '/cv', name: 'cv', component: CvView }` przed `not-found`.
`App.vue` `routeMeta`: `if (name === 'cv') return content.value.routes.cv` (bez `useNavShortcuts`).
Usunąć `public/cv/README.md` (jedyny plik w `public/cv/`; opisuje nieaktualne `cv.href` jako ścieżkę do PDF):
Vite kopiuje go do `dist/cv/`, a `try_files $uri $uri/ /index.html` (`docker/nginx.conf:6-7`) dopasowałby
`$uri/` do katalogu i zwrócił 301 → `/cv/` → 403 zamiast SPA przy bezpośrednim wejściu na `/cv`.
Po usunięciu nginx bez zmian.

#### 4. Styl druku

**File**: `src/assets/main.css`, `src/components/layout/SiteHeader.vue`, `src/components/layout/SiteFooter.vue`

**Intent**: Arkusz CV czytelny na ekranie i w druku; nagłówek i stopka znikają przy druku.

**Contract**: Z gałęzi: `.cv-section`, `.cv-heading` (w `@layer`) i końcowy blok `@media print`
(`@page`, `body`, `.cv-sheet …`, `.cv-avoid-break`). `print:hidden` dodane do klasy `<header>`
w `SiteHeader.vue` i `<footer>` w `SiteFooter.vue`; reszta diffu nagłówka z gałęzi pominięta.

#### 5. Linki CV jako nawigacja SPA

**File**: `src/components/layout/SiteHeader.vue`, `src/views/ContactView.vue`

**Intent**: `/cv` to trasa SPA, więc linki nie mogą otwierać nowej karty z pełnym przeładowaniem.

**Contract**: Trzy `<a :href="content.cv.href" target="_blank" rel=…>` (nagłówek desktop
`:112-120`, mobile `:155-163`, kontakt `:33-40`) → `<RouterLink :to="content.cv.href">` z tymi
samymi klasami; w menu mobilnym `@click="open = false"` (jak inne linki tego menu). Warunki
`v-if="hasCv"` bez zmian.

### Success Criteria:

#### Automated Verification:

- Testy przechodzą (spójność kluczy po dodaniu `cv.*`, `routes.cv`): `pnpm test`
- Type-check przechodzi: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- Build przechodzi: `pnpm build`
- Żaden link CV nie otwiera nowej karty: `grep -n 'cv.href' src/components/layout/SiteHeader.vue src/views/ContactView.vue` pokazuje tylko `RouterLink`/`:to`
- Build nie tworzy katalogu kolidującego z trasą `/cv`: `pnpm build && test ! -e dist/cv`

#### Manual Verification:

- `/cv` (PL i EN) renderuje imię, etykietę, profil z panelu (bez wiersza kontaktu), doświadczenie, produkty, umiejętności, kontakt; tytuł karty „CV — Sebastian Kostecki”
- Podgląd druku (Ctrl+P) na `/cv`: tylko arkusz CV, bez nagłówka i stopki, czytelne kolory na białym tle; przycisk „Zapisz jako PDF” otwiera okno druku
- Przycisk „CV” w hero, nagłówku (desktop i mobile) i kontakcie prowadzi do `/cv` w tej samej karcie bez przeładowania; menu mobilne zamyka się po kliknięciu
- Bezpośrednie wejście na `/cv` (odświeżenie) działa w `pnpm preview`

---

## Testing Strategy

### Unit Tests:

- `useDuration.spec.ts`: tabela przypadków z fazy 1 (granice pół roku, polska odmiana 1 / 2-4 / 5+ / 12-14 / 22, dopełniacz, EN, brak „+”), `fillDurations` z nieznanym kluczem, `resolveDurations` na strukturach zagnieżdżonych bez mutacji wejścia.
- `locales.spec.ts`: identyczne ścieżki kluczy PL/EN; brak nierozwiązanych tokenów po `resolveDurations`.

### Integration Tests:

- Brak — weryfikacja wiringu (`useContent`, trasa, druk) ręczna; E2E poza zakresem (projekt nie ma Playwrighta).

### Manual Testing Steps:

1. `pnpm dev`, strona główna PL: hero, panel, O mnie, stopka wg kryteriów fazy 2; przełączyć na EN i powtórzyć.
2. Zwęzić okno do 375 px: kolejność tekst → panel, brak poziomego scrolla.
3. Kliknąć „CV” w hero, nagłówku, menu mobilnym, kontakcie: `/cv` w tej samej karcie.
4. Na `/cv` Ctrl+P: podgląd druku tylko z arkuszem CV.
5. `pnpm build && pnpm preview`, wejść bezpośrednio na `/cv`.

## Performance Considerations

`resolveDurations` przechodzi raz po obu słownikach przy imporcie modułu (kilka KB JSON) — pomijalne. Placeholder zdjęcia to inline SVG, bez dodatkowego żądania.

## Migration Notes

Brak danych do migracji. Wycofanie: revert commitów faz; fazy są niezależnie odwracalne (faza 3 → przyciski CV znów ukryte przez `cv.href = ""`).

## References

- Research: `context/changes/site-focus-hero/research.md`
- Foundation: `context/foundation/site-focus.md` p. 4, 5, 6, 7, 8
- Źródło plików: gałąź `design/hero-variants` (423456f) — `src/content/career.ts`, `src/composables/useDuration.ts`, `src/components/ui/SummaryPanel.vue`, `src/components/hero/{HeroIntro,DuotonePhoto}.vue`, `src/views/CvView.vue`, `src/assets/main.css`
- Obecny kod: `src/views/HomeView.vue:15-71`, `src/components/layout/SiteHeader.vue:112-120,155-163`, `src/views/ContactView.vue:32-41`, `src/components/layout/SiteFooter.vue:51-58`, `src/App.vue:18-25`, `src/composables/useContent.ts:7-10`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Liczone staże, test-first

#### Automated

- [x] 1.1 Testy staży i treści przechodzą: `pnpm test` — f65297f
- [x] 1.2 Type-check przechodzi (łącznie z plikami testów): `pnpm type-check` — f65297f
- [x] 1.3 Lint przechodzi: `pnpm lint` — f65297f
- [x] 1.4 Build przechodzi: `pnpm build` — f65297f

#### Manual

- [x] 1.5 Strona główna (PL i EN) pokazuje w O mnie „Od 4 lat” / „For 4 years”, a karta PanelAlpha „3,5 roku” / „3.5 years” — f65297f

### Phase 2: Hero, panel „W skrócie”, O mnie, stopka

#### Automated

- [x] 2.1 Testy (w tym spójność kluczy i brak nierozwiązanych tokenów po dodaniu `summary` i hero): `pnpm test`
- [x] 2.2 Type-check przechodzi: `pnpm type-check`
- [x] 2.3 Lint przechodzi: `pnpm lint`
- [x] 2.4 Build przechodzi: `pnpm build`
- [x] 2.5 Brak odwołań do usuniętego pola: `grep -rn viewMyWork src` nic nie zwraca

#### Manual

- [x] 2.6 Desktop (≥1024 px): hero w dwóch kolumnach, panel po prawej, sześć wierszy w jednej kolumnie, nagłówek łamie się czytelnie
- [x] 2.7 Mobile (375 px): panel pod tekstem hero, wiersze w jednej kolumnie, bez poziomego scrolla
- [x] 2.8 Hero PL: „Od 4 lat rozwijam produkcyjny produkt B2B: PanelAlpha w ModulesGarden.”; EN: „For 4 years I've been building…”
- [x] 2.9 W hero widoczny tylko przycisk „Porozmawiajmy” (CV ukryte do fazy 3)
- [x] 2.10 Panel: wiersz Kontakt jest linkiem `mailto:`, Doświadczenie pokazuje „4 lata komercyjnie, w tym 3,5 roku przy PanelAlpha”
- [x] 2.11 O mnie: index „01 / O mnie” / „01 / About”, tytuł „Kim jestem” / „Who I am”, placeholder z podpisem „Zdjęcie” / „Photo” w ramce
- [x] 2.12 Stopka: „Źródło” / „Source” prowadzi do publicznego repo

### Phase 3: Strona `/cv`

#### Automated

- [ ] 3.1 Testy przechodzą (spójność kluczy po dodaniu `cv.*`, `routes.cv`): `pnpm test`
- [ ] 3.2 Type-check przechodzi: `pnpm type-check`
- [ ] 3.3 Lint przechodzi: `pnpm lint`
- [ ] 3.4 Build przechodzi: `pnpm build`
- [ ] 3.5 Żaden link CV nie otwiera nowej karty: `grep -n 'cv.href' src/components/layout/SiteHeader.vue src/views/ContactView.vue` pokazuje tylko `RouterLink`/`:to`
- [ ] 3.10 Build nie tworzy katalogu kolidującego z trasą `/cv`: `pnpm build && test ! -e dist/cv`

#### Manual

- [ ] 3.6 `/cv` (PL i EN) renderuje imię, etykietę, profil z panelu (bez wiersza kontaktu), doświadczenie, produkty, umiejętności, kontakt; tytuł karty „CV — Sebastian Kostecki”
- [ ] 3.7 Podgląd druku (Ctrl+P) na `/cv`: tylko arkusz CV, bez nagłówka i stopki, czytelne kolory na białym tle; przycisk „Zapisz jako PDF” otwiera okno druku
- [ ] 3.8 Przycisk „CV” w hero, nagłówku (desktop i mobile) i kontakcie prowadzi do `/cv` w tej samej karcie bez przeładowania; menu mobilne zamyka się po kliknięciu
- [ ] 3.9 Bezpośrednie wejście na `/cv` (odświeżenie) działa w `pnpm preview`
