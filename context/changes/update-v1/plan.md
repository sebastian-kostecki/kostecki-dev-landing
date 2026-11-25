# update-v1: spójność kostecki.dev z LinkedInem — plan implementacji

## Overview

Strona ma mówić to samo co zaktualizowany 24.11.2026 LinkedIn i README na GitHubie: rola
Full-stack Developer (PHP / Laravel + Vue), daty od 07.2022, PanelAlpha jako hosting projektów
z Gita z open-source'owym Engine i Single Server Edition, Claude Code i Claude Design zamiast
Cursora oraz trzy własne produkty na produkcji. Źródła: brief wklejony 2026-11-25 (opisany
w `change.md`) i przegląd `design-review.md` w tym folderze.

## Current State Analysis

Produkcja buduje się z `origin/master` (CI publikuje na gałąź `site`). Lokalna gałąź
`feat/site-niche-and-collaboration` jest 15 commitów w tyle, więc pracujemy na nowej gałęzi
od `origin/master`.

Na `origin/master`:

- `src/content/career.ts:3-6`: `modulesGarden: '2022-11'`, `panelAlpha: '2023-05'`.
- `src/content/{pl,en}.json`: rola „Backend Developer” w `hero.label`, `summary`,
  `projects.featured.context.role`, `meta`/`routes.home`/`routes.cv`, `ui.footerTagline`.
  „Cursor” w `aiWorkflow.subtitle` i w grupie narzędzi `skills`. „2 własne produkty”, „Dwa
  z nich”. Menu Maker z `badge: "wip"` i tylko z linkiem do GitHuba. PanelAlpha opisana jako
  „automatyzacja zarządzania WordPress”. Karta modułów WHMCS ma `period: "~6 miesięcy"`.
- `index.html:10,15,23`: trzy meta description z rolą Backend Developer.
- `scripts/generate-og-image.mjs:22`: „Backend Developer · PHP · Laravel”.
- `/cv` jest ukryte (`cv.href` pusty, `src/router/routes.ts:15`) i takie zostaje.

### Key Discoveries:

- `yearsSince` (`src/composables/useDuration.ts:5-9`) zaokrągla w dół do pół roku. Daty
  2022-07 i 2022-11 dadzą dziś oba „4 lata”, więc wiersz „W skrócie”
  `{years:modulesGarden} komercyjnie, w tym {years:panelAlpha} przy PanelAlpha` pokazałby
  powtórzenie.
- `OpenSourceContribution` (`src/types/content.ts:56-59`) ma tylko `text` i `context`.
  Renderuje go `src/components/ui/PanelAlphaFeature.vue:77-88`. `CvView.vue:89` czyta tylko
  `text`, więc nowe pole go nie dotyczy.
- `ProjectLink` (`src/types/content.ts:26-30`) to `{ title, url, primary? }` i można go użyć
  dla linków open source.
- `jobTitle` w JSON-LD pochodzi z `content.hero.label` (`src/seo/structured-data.ts:19`), a
  `llms.ts:29` bierze `content.meta.description`. W `src/seo/` nie ma żadnych literałów do
  zmiany.
- `positioning.spec.ts` wymaga w `meta.description` nazw cPanel, Plesk, DirectAdmin, WHMCS,
  PowerDNS i Laravel. `collaboration.spec.ts` zabrania słowa „hosting” w usługach i wymaga
  jednego zdania w `outcome`. `experience.spec.ts` wymaga tej samej liczby punktów
  `responsibilities` w PL i EN oraz braku literałów skali w `text` i `context` bloku open
  source. „Apache 2.0” by tę regułę złamało (`content-rules.ts`: `2.0` to liczba).
  `products.spec.ts` wymaga dokładnie dwóch wyróżnionych produktów.
- Na karcie OG (start x=340, czcionka mono 36 px, prawa krawędź 1120) zmieści się
  „Full-stack Developer · PHP · Vue” (~690 px). Z dodanym „Laravel” tekst by się nie zmieścił.
- Repo `github.com/panelalpha/panelalpha-engine` i `github.com/panelalpha/panelalpha-single-server`
  są publiczne (HTTP 200, sprawdzone 2026-11-25).

## Desired End State

Strona główna, `/projects`, `/skills` i `/contact` w PL i EN pokazują rolę full-stack, staż
liczony od 07.2022 bez powtórzenia, PanelAlpha jako hosting projektów z Gita z linkami do
repo Engine i Single Server Edition, Claude Code i Claude Design zamiast Cursora oraz trzy
produkty na produkcji, w tym Menu Maker z linkiem live. W zbudowanym `dist/` nie ma słów
„Cursor” ani „Backend Developer”. Metadane, JSON-LD i obraz OG mówią „Full-stack Developer”.
`site-focus.md` opisuje nowe pozycjonowanie i decyzje z 2026-11-25. Weryfikacja: testy z Fazy 1
zmieniają kolor z czerwonego na zielony, a `pnpm test`, `pnpm lint` i `pnpm build` przechodzą.

## What We're NOT Doing

- Nie publikujemy `/cv` (`cv.href` zostaje pusty) i nie zmieniamy `context/cv/*`. Punkt 7
  briefu wypada (decyzja Sebastiana 2026-11-25), razem z poziomem angielskiego.
- Menu Maker nie dostaje `featured: true`. Na stronie głównej zostają dwa teasery.
- Nie zmieniamy hero poza tekstami (bez nowych elementów, bez zmiany układu) ani tokenów
  w `src/assets/main.css`.
- Nie dodajemy konta demo ani publicznego podglądu aplikacji za logowaniem (uwaga z przeglądu,
  osobna zmiana).
- Nie dodajemy liczb o skali PanelAlpha.
- Nie zmieniamy `meta.title` PL („Laravel: panele hostingowe, WHMCS, PowerDNS”).
- Nie zmieniamy `proves` Root Keepera („Ten sam backend z innym frontendem”).
- Nie zmieniamy wiersza „Praca z AI” w panelu „W skrócie”.

## Implementation Approach

Najpierw testy strażnicy opisujące stan zgodny z LinkedInem (czerwone), potem treść w dwóch
porcjach: karta PanelAlpha z datami (jedyna zmiana kodu: pole `links`) i reszta tekstów.
Na końcu obraz OG i build z kontrolą wygenerowanego HTML.

Zasady redakcyjne ustalone w planowaniu:

- Pełna formuła „Laravel + Vue” pojawia się w trzech miejscach: etykieta hero, wiersz „Rola”
  w panelu „W skrócie” i metadane. W pozostałych tekstach (O mnie, Współpraca, stopka,
  umiejętności) piszemy naturalnie: „backend w Laravelu, interfejs w Vue”.
- Claude Design to narzędzie, a nie twierdzenie o projektowaniu: „Agenci (Claude Code, Claude
  Design)”.
- PL i EN zmieniają się w tym samym commicie, a struktura kluczy zostaje identyczna.

## Faza 1: Fundament i testy strażnicy

### Overview

Nowa gałąź, zaktualizowany dokument fundamentowy i testy, które dziś nie przechodzą, bo
opisują stan zgodny z LinkedInem.

### Changes Required:

#### 1. Gałąź

**Intent**: Pracujemy od tego, co jest na produkcji. Untracked folder `context/changes/update-v1/`
przechodzi na nową gałąź razem z working tree.

**Contract**: `git fetch origin && git switch -c feat/update-v1 origin/master`.

#### 2. Dokument fundamentowy

**File**: `context/foundation/site-focus.md`

**Intent**: Pozycjonowanie zmienia się przed treścią, bo każda zmiana treści ma być zgodna
z tym dokumentem.

**Contract**:
- p. 1, „Cel zawodowy”: „rola full-stack (Laravel + Vue) w firmie produktowej, z backendem
  jako najmocniejszą stroną”.
- p. 2, teza: „Full-stack developer PHP/Laravel + Vue z 4 latami w produkcyjnym produkcie
  (PanelAlpha, ModulesGarden). Kod pisze z agentami AI w udokumentowanym procesie, który ma
  publiczne, weryfikowalne dowody.” Bez „B2B”.
- p. 3.3: „Trzy, na własnym VPS-ie” (Domowy Skarbnik, Root Keeper, Menu Maker).
- p. 4, nowe wiersze z datą 2026-11-25:
  - rola full-stack spójna z LinkedInem (24.11) i GitHubem, bo Sebastian odpowiada też za
    frontend PanelAlpha (migracja na Vue 3 + TypeScript, panel Single Server Edition);
  - zgoda ModulesGarden na opis migracji jest;
  - blok open source w karcie PanelAlpha linkuje do repo Engine i SSE (rewizja wiersza
    „PanelAlpha Engine”: nadal bez osobnej karty i bez linku do commitów);
  - formuła „Laravel + Vue” tylko w trzech miejscach;
  - `/cv` nadal ukryte.
- p. 9: przekreślić punkt o zgodzie na opis migracji, z dopiskiem „2026-11-25: jest”.
  Część o `client-area-next` zostaje otwarta.
- p. 11: wpis „2026-11-25, zmiana `update-v1`” z listą powyższego.

#### 3. Testy strażnicy

**File**: `src/content/__tests__/linkedin-consistency.spec.ts` (nowy)

**Intent**: Zapisuje w testach fakty z LinkedIna, żeby kolejna zmiana treści ich nie cofnęła.
Każda asercja ma dziś nie przechodzić.

**Contract** (dla obu locale, chyba że zaznaczono inaczej):
- `careerSince` równa się `{ modulesGarden: '2022-07', panelAlpha: '2022-11' }`.
- `JSON.stringify(content)` nie zawiera `Cursor` i nie pasuje do `/backend developer/i`.
- `hero.label` zaczyna się od `Full-stack Developer`.
- Wiersz doświadczenia w `hero.summary` (w aktualnej strukturze to pozycja z
  `{years:modulesGarden}`) nie zawiera `{years:panelAlpha}`. Wiersz produkcji nie zawiera `B2B`.
- `aiWorkflow.subtitle` zawiera `Claude Design`. Grupa narzędzi w `skills.categories`
  zawiera tag `Claude Design`.
- Menu Maker w `projects.personal.items`: brak `badge`, pierwszy link
  `https://menu.kostecki.dev` z `primary: true`, jest też link do GitHuba bez `primary`.
- `projects.featured.openSourceContribution.links` ma URL-e
  `https://github.com/panelalpha/panelalpha-engine` i
  `https://github.com/panelalpha/panelalpha-single-server`, takie same w PL i EN.
- `projects.featured.description` nie zawiera `WordPress management` ani `zarządzania WordPress`,
  ale zawiera `Git`.

**File**: `src/__tests__/index-html.spec.ts`

**Intent**: Statyczne meta w `index.html` muszą być tym samym tekstem co `pl.meta.description`,
bo inaczej przy następnej zmianie roli rozjadą się z JSON-em.

**Contract**: nowy przypadek: każdy z `meta[name=description]`, `og:description` i
`twitter:description` w `index.html` równa się `pl.meta.description`. Ten test dziś przechodzi.
Jest to strażnik, nie czerwony test.

### Success Criteria:

#### Automated Verification:

- Nowe asercje w `linkedin-consistency.spec.ts` nie przechodzą z powodu treści, a nie błędu
  składni: `pnpm test linkedin-consistency`
- Pozostałe testy przechodzą: `pnpm test --exclude '**/linkedin-consistency.spec.ts'`
- `pnpm lint` przechodzi

#### Manual Verification:

- `site-focus.md` p. 1, 2, 3, 4, 9 i 11 opisują decyzje z 2026-11-25 i nie przeczą sobie

**Implementation Note**: Po automatycznej weryfikacji zatrzymaj się na ręczne potwierdzenie
Sebastiana.

---

## Faza 2: Daty i karta PanelAlpha

### Overview

Nowe daty, linki open source w modelu i komponencie oraz nowy opis i zakres pracy przy
PanelAlpha.

### Changes Required:

#### 1. Daty

**File**: `src/content/career.ts`

**Intent**: Staże w hero, „W skrócie”, O mnie i na karcie PanelAlpha przeliczają się z tych dat.

**Contract**: `careerSince = { modulesGarden: '2022-07', panelAlpha: '2022-11' }`. Komentarz
z przykładami („4 lata”, „3,5 roku”) może zostać. Sprawdź, czy
`src/composables/__tests__/useDuration.spec.ts` nie zakłada starych dat.

#### 2. Linki open source

**Files**: `src/types/content.ts`, `src/components/ui/PanelAlphaFeature.vue`

**Intent**: Twierdzenie o pracy przy Engine i SSE dostaje dowód w postaci linków do publicznych
repo (zasada p. 8 site-focus).

**Contract**: `OpenSourceContribution` dostaje opcjonalne `links?: ProjectLink[]`.
`PanelAlphaFeature.vue` renderuje je pod `context` w bloku open source, tak samo jak inne linki
zewnętrzne w komponentach (`target="_blank"`, `rel="noopener noreferrer"`, ikona linku
zewnętrznego). To małe linki tekstowe, nie przyciski. `CvView.vue` bez zmian.

#### 3. Treść karty PanelAlpha (PL i EN)

**Files**: `src/content/pl.json`, `src/content/en.json` (`projects.featured`,
`projects.commercialGroup`)

**Intent**: Opis produktu zgodny z dzisiejszym PanelAlpha i zakres pracy pokazujący frontend,
w pięciu punktach i jednym bloku open source.

**Contract**:
- `context.role`: `Full-stack Developer`.
- `description`, PL: „Platforma do hostingu i zarządzania projektami na własnych serwerach,
  od WordPressa po dowolne aplikacje z Gita.” EN: „A platform for hosting and managing projects
  on your own servers, from WordPress to any app from Git.”
- `responsibilities` (5, ta sama kolejność w EN):
  1. PL „Backend Laravel i rozwój API platformy” (bez zmian).
  2. PL „Integracje z panelami hostingowymi (cPanel, Plesk, DirectAdmin), WP Cloud i DNS
     (PowerDNS, Cloudflare, Bunny DNS) oraz usługami e-mail, SSL, backup i storage”.
     EN „Integrations with hosting panels (cPanel, Plesk, DirectAdmin), WP Cloud and DNS
     (PowerDNS, Cloudflare, Bunny DNS), plus email, SSL, backup, and storage services”.
  3. PL „Hosting projektów z Gita i WordPressa: cykl życia instancji”. EN „Hosting projects
     from Git and WordPress: instance lifecycle”.
  4. PL „Integracja WHMCS i powiązana logika billingowa” (bez zmian).
  5. PL „Frontend platformy w Vue.js: migracja na Vue 3 i TypeScript, projekty interfejsu
     w Claude Design”. EN „Platform frontend in Vue.js: migration to Vue 3 and TypeScript,
     interface designs in Claude Design”.
- `tags`: dodaj `TypeScript` po `Vue.js`. `Vuetify` zostaje.
- `openSourceContribution`:
  - `text`, PL: „Wkład w open-source'owy PanelAlpha Engine (auto-deploy po git push, menedżer
    plików, dyrektywy PHP per domena, statystyki transferu) oraz PanelAlpha Single Server
    Edition: backend i frontend panelu hostingowego na własny VPS, działającego na API Engine.”
    EN: „Contributions to the open-source PanelAlpha Engine (auto-deploy on git push, file
    manager, per-domain PHP directives, transfer statistics) and PanelAlpha Single Server
    Edition: backend and frontend of a hosting panel for your own VPS, built on the Engine API.”
  - `context`, PL: „Engine obsługują też agenci AI przez MCP.” EN: „AI agents can operate
    Engine over MCP.” (bez „Apache 2.0”, bo test traktuje „2.0” jako literał skali, i bez
    powtarzania opisu produktu).
  - `links`: `{ title: "PanelAlpha Engine", url: "https://github.com/panelalpha/panelalpha-engine" }`,
    `{ title: "Single Server Edition", url: "https://github.com/panelalpha/panelalpha-single-server" }`.
    Te same tytuły w obu językach.
- `projects.commercialGroup.context.period`: `07–11.2022` w obu locale, zamiast „~6 miesięcy”.
  To zakres historyczny, który się nie starzeje, więc reguła „liczby tylko z buildu” go
  dopuszcza (tak jak czas trwania w przykładzie z sekcji AI).

### Success Criteria:

#### Automated Verification:

- Asercje dat, opisu PanelAlpha i linków open source w `linkedin-consistency.spec.ts`
  przechodzą: `pnpm test linkedin-consistency`
- `experience.spec.ts`, `products.spec.ts`, `locales.spec.ts` i `useDuration.spec.ts`
  przechodzą: `pnpm test`
- Typy przechodzą: `pnpm type-check`
- `pnpm lint` przechodzi

#### Manual Verification:

- Karta PanelAlpha na `/` i `/projects` (`pnpm dev`) ma pięć punktów, blok open source z dwoma
  linkami otwieranymi w nowej karcie i okres „4 lata”
- Karta modułów WHMCS na `/projects` pokazuje „07–11.2022”

**Implementation Note**: Po automatycznej weryfikacji zatrzymaj się na ręczne potwierdzenie.

---

## Faza 3: Rola i teksty w całym serwisie

### Overview

Wszystkie pozostałe miejsca, w których strona się przedstawia, w PL i EN.

### Changes Required:

#### 1. Hero i panel „W skrócie”

**Files**: `src/content/pl.json`, `src/content/en.json` (`hero`)

**Contract**:
- `label`: `Full-stack Developer / PHP · Laravel · Vue` (oba locale).
- `valueProp` / `valuePropAccent`, PL: „Aplikacje w Laravelu i Vue,” / „które działają na
  produkcji.” EN: „Laravel and Vue applications” / „that run in production.”
- `subtitle`: fragment „po działającą logikę u klienta” **zastąp** fragmentem „po interfejs
  w Vue” (EN: „to logic running for customers” → „to the Vue interface”). Długość tekstu
  zostaje bez zmian.
- `summary`, Rola: „Full-stack Developer (PHP / Laravel + Vue), PanelAlpha”.
- `summary`, Doświadczenie, PL: „{years:modulesGarden} komercyjnie w ModulesGarden, głównie przy
  PanelAlpha”. EN: „{years:modulesGarden} commercially at ModulesGarden, mostly on PanelAlpha”.
- `summary`, Na produkcji, PL: „PanelAlpha oraz 3 własne produkty na własnym VPS-ie”. EN:
  „PanelAlpha and 3 products of my own on my own VPS”.

#### 2. O mnie

**Contract** (`about.paragraphs`):
- [0], PL: „Od {since:modulesGarden} buduję aplikacje w PHP i Laravelu, a interfejsy w Vue.
  Rozwijam PanelAlpha, platformę do hostingu projektów na własnych serwerach, od WordPressa po
  dowolne aplikacje z Gita.” Dalej bez zmian, od „Najbliżej mi do integracji…”. EN analogicznie.
- [1]: „…od warstwy backendowej po działającą logikę — a gdy potrzeba, wchodzę we frontend
  (Vue.js)” → „…od warstwy backendowej po interfejs w Vue; ostatnio migruję frontend PanelAlpha
  na Vue 3 i TypeScript”. Reszta akapitu zostaje. EN analogicznie.
- [2]: „dwa własne produkty … Domowy Skarbnik i Root Keeper” → „trzy własne produkty …
  Domowy Skarbnik, Root Keeper i Menu Maker”. EN: „two products” → „three products”, dopisz
  Menu Maker.

#### 3. Umiejętności

**Contract** (`skills`):
- `subtitle`, PL: „Stack, w którym buduję i utrzymuję produkcyjne aplikacje: backend
  w Laravelu i frontend w Vue — oraz kompetencje uzupełniające z pracy komercyjnej.” EN
  analogicznie.
- `coreDescription`, PL: „Stack, w którym buduję i utrzymuję produkcyjne aplikacje: backend
  w Laravelu i frontend w Vue.” EN analogicznie.
- `core`, Vue.js `level`: „Interfejsy produktu” / „Product interfaces”. Laravel „Backend
  produkcyjny” i TypeScript „Vue i React” zostają.
- `categories`:
  - Integracje infrastrukturalne: dodaj tag `WP Cloud` (Cloudflare i Bunny DNS już są). Grupa
    WordPress bez zmian.
  - „Frontend uzupełniający” / „Supporting frontend” → „Frontend (Vue 3 + TypeScript)” w obu
    locale. Opis PL: „Buduję i migruję interfejsy w Vue 3 i TypeScript, także przy funkcjach
    obejmujących backend.” EN: „I build and migrate interfaces in Vue 3 and TypeScript,
    including features that span the backend.”
  - Narzędzia i workflow: tag `Cursor` → `Claude Design`, na tej samej pozycji.

#### 4. Sekcja AI

**Contract**: `aiWorkflow.subtitle`: „Agenci (Claude Code, Cursor)” → „Agenci (Claude Code,
Claude Design)”. EN: „Agents (Claude Code, Cursor)” → „Agents (Claude Code, Claude Design)”.
Reszta zdania bez zmian.

#### 5. Współpraca, kontakt, stopka

**Contract**:
- `collaboration.services[0]`, PL: tytuł „Backend i interfejs dla produktu”, scope „Od modelu
  danych po interfejs w Vue i wdrożenie.”, outcome „Dostajesz aplikację, która działa na
  produkcji, z testami w CI, opisanymi decyzjami i powtarzalnym wdrożeniem.” EN: „Backend and
  interface for your product” / „From the data model through the Vue interface to deployment.” /
  „You get an application that runs in production, with tests in CI, documented decisions and
  a repeatable deploy.” (bez słowa „hosting”, jedno zdanie).
- `contact.subtitle` i `routes.contact.description`: „rozmową o backendzie” → „rozmową
  o Laravelu i Vue”. EN: „chatting about backend” → „chatting about Laravel and Vue”.
- `ui.footerTagline`, PL: „Full-stack Developer — API, integracje i interfejsy w Laravelu i Vue.”
  EN: „Full-stack developer — APIs, integrations and interfaces in Laravel and Vue.”
- `footer.services`, PL: [„Produkcyjne aplikacje: backend w Laravelu, interfejs w Vue”, „API,
  integracje zewnętrzne i hosting projektów”]. EN: [„Production apps: Laravel backend, Vue
  interface”, „APIs, external integrations, and project hosting”].

#### 6. Metadane

**Files**: `src/content/pl.json`, `src/content/en.json`, `index.html`

**Contract**:
- `meta.description` = `routes.home.description`, PL: „Full-stack Developer (Laravel + Vue):
  integracje z panelami hostingowymi (cPanel, Plesk, DirectAdmin), WHMCS i PowerDNS, hosting
  projektów z Gita. PanelAlpha i własne produkty.” EN: „Full-stack Laravel + Vue developer:
  hosting control panel integrations (cPanel, Plesk, DirectAdmin), WHMCS and PowerDNS, hosting
  projects from Git. PanelAlpha and my own products.”
- EN `meta.title` = `routes.home.title`: „Sebastian Kostecki — Laravel + Vue developer: hosting
  panels, WHMCS, PowerDNS”. PL tytuł bez zmian.
- `routes.cv.description`: „Backend Developera (Laravel)” → „Full-stack Developera (Laravel +
  Vue)”. EN analogicznie. Trasa dalej wyłączona.
- `index.html`: trzy meta description = nowy PL `meta.description`.

#### 7. Projekty własne

**Contract** (`projects.personal`):
- `subtitle`: „Dwa z nich” → „Trzy z nich”. EN „Two of them” → „Three of them”.
- Menu Maker: usuń `badge`. `links` = [`{ title: "Wersja live" | "Live app", url:
  "https://menu.kostecki.dev", primary: true }`, `{ title: "GitHub", url: …menu-maker }`]
  (GitHub bez `primary`), według wzoru Domowego Skarbnika. Bez `featured`.

### Success Criteria:

#### Automated Verification:

- Cały `linkedin-consistency.spec.ts` przechodzi: `pnpm test linkedin-consistency`
- Cały zestaw przechodzi, w tym `positioning`, `collaboration`, `products`, `skills`, `locales`
  i `index-html`: `pnpm test`
- `pnpm type-check` i `pnpm lint` przechodzą

#### Manual Verification:

- Hero na desktopie i mobile (`pnpm dev`): valueProp łamie się na dwie linie, akcent jest na
  drugiej, a podtytuł nie jest dłuższy niż dziś
- Teksty PL i EN czytają się naturalnie, a „Laravel + Vue” pojawia się tylko w etykiecie
  hero, wierszu „Rola” w „W skrócie” i metadanych (`routes.cv.description` jest
  niewidoczne, bo trasa jest wyłączona)

**Implementation Note**: Po automatycznej weryfikacji zatrzymaj się na ręczne potwierdzenie.

---

## Faza 4: Obraz OG, build i weryfikacja

### Overview

Obraz OG z nową rolą i kontrola tego, co naprawdę trafi na produkcję.

### Changes Required:

#### 1. Obraz OG

**File**: `scripts/generate-og-image.mjs:22`, `public/og-image.png`

**Intent**: Podgląd linku na LinkedInie i w komunikatorach mówi to samo co strona.

**Contract**: tekst `Full-stack Developer · PHP · Vue` (mieści się na karcie, wersja
z „Laravel” nie). Potem `pnpm generate:og-image` i commit wygenerowanego PNG.

#### 2. Kontrola builda

**Intent**: Prerenderowany HTML to jedyne, co widzą ATS i crawlery, więc to jego sprawdzamy.

**Contract**: po `pnpm build` w `dist/`:
- `grep -ri "cursor" dist/ --include='*.html' --include='*.txt'` nie zwraca nic;
- `grep -ri "backend developer" dist/` nie zwraca nic;
- `dist/index.html` zawiera „Full-stack Developer” w `jobTitle` JSON-LD i w meta description;
- „W skrócie” w `dist/index.html` zawiera „3 własne produkty”, a staż to „4 lata”;
- `dist/llms.txt` ma nowy opis;
- `dist/cv` nie istnieje.

### Success Criteria:

#### Automated Verification:

- `pnpm test`, `pnpm lint` i `pnpm build` przechodzą
- Grep w `dist/` według listy wyżej nie znajduje „Cursor” ani „backend developer”
- `dist/index.html` zawiera `"jobTitle":"Full-stack Developer / PHP · Laravel · Vue"` (lub
  odpowiednik z escapowaniem) i nową meta description
- `dist/cv/` nie istnieje

#### Manual Verification:

- `public/og-image.png` wygląda poprawnie, tekst nie wychodzi poza kartę
- `/`, `/projects`, `/skills` i `/contact` w PL i EN (`pnpm preview`): linki live prowadzą do
  budget.kostecki.dev, genealogy.kostecki.dev i menu.kostecki.dev, a linki Engine i SSE do
  GitHuba
- Na `/projects` Menu Maker nie ma odznaki WIP, a podtytuł mówi „Trzy z nich”

**Implementation Note**: Archiwizacja zmiany (`/10x-archive update-v1`) po merge'u, jak przy
poprzednich zmianach.

---

## Testing Strategy

### Unit Tests:

- `linkedin-consistency.spec.ts`: daty, brak „Cursor” i „backend developer”, rola, wiersze
  „W skrócie”, Claude Design, Menu Maker, linki open source, opis PanelAlpha.
- `index-html.spec.ts`: statyczne meta równe `pl.meta.description`.
- Istniejące strażniki bez osłabiania asercji: `positioning`, `collaboration`, `experience`,
  `products`, `skills`, `locales`, `useDuration`.

### Integration Tests:

- `pnpm build` z prerenderem i grep w `dist/` (Faza 4).

### Manual Testing Steps:

1. `pnpm dev`, `/` w PL: etykieta, valueProp, „W skrócie” (staż bez powtórzenia, 3 produkty).
2. Przełącz na EN i powtórz.
3. `/projects`: karta PanelAlpha (5 punktów, dwa linki OSS), WHMCS „07–11.2022”, Menu Maker live.
4. `/skills`: „Frontend (Vue 3 + TypeScript)”, Claude Design zamiast Cursora, WP Cloud
   w integracjach.
5. Mobile (375 px): hero i blok open source bez przepełnień.

## Performance Considerations

Brak. Zmiany tekstu i dwa linki.

## Migration Notes

Brak danych do migracji. Wycofanie przez revert PR-a. Obraz OG jest w repo, więc revert
przywraca i jego.

## References

- Brief: `context/changes/update-v1/change.md` (notatki) i rozmowa 2026-11-25
- Przegląd: `context/changes/update-v1/design-review.md`
- Fundament: `context/foundation/site-focus.md`
- Wzór karty z linkami: `src/content/pl.json` `projects.personal.items[0].links`
- Poprzednia zmiana treści: `context/archive/2026-11-09-site-focus-experience/plan.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Fundament i testy strażnicy

#### Automated

- [x] 1.1 Nowe asercje w linkedin-consistency.spec.ts nie przechodzą z powodu treści — aae165e
- [x] 1.2 Pozostałe testy przechodzą — aae165e
- [x] 1.3 pnpm lint przechodzi — aae165e

#### Manual

- [ ] 1.4 site-focus.md opisuje decyzje z 2026-11-25 bez sprzeczności

### Phase 2: Daty i karta PanelAlpha

#### Automated

- [x] 2.1 Asercje dat, opisu PanelAlpha i linków OSS przechodzą — 42b4ba6
- [x] 2.2 experience, products, locales i useDuration przechodzą — 42b4ba6
- [x] 2.3 pnpm type-check przechodzi — 42b4ba6
- [x] 2.4 pnpm lint przechodzi — 42b4ba6

#### Manual

- [ ] 2.5 Karta PanelAlpha: pięć punktów, dwa linki OSS, okres 4 lata
- [ ] 2.6 Karta WHMCS pokazuje 07–11.2022

### Phase 3: Rola i teksty w całym serwisie

#### Automated

- [x] 3.1 Cały linkedin-consistency.spec.ts przechodzi
- [x] 3.2 Cały zestaw testów przechodzi
- [x] 3.3 pnpm type-check i pnpm lint przechodzą

#### Manual

- [ ] 3.4 Hero na desktopie i mobile bez zmian w układzie
- [ ] 3.5 Teksty PL i EN naturalne, formuła Laravel + Vue tylko w ustalonych miejscach

### Phase 4: Obraz OG, build i weryfikacja

#### Automated

- [ ] 4.1 pnpm test, pnpm lint i pnpm build przechodzą
- [ ] 4.2 Grep w dist nie znajduje Cursor ani backend developer
- [ ] 4.3 dist/index.html ma jobTitle Full-stack Developer i nową meta description
- [ ] 4.4 dist/cv nie istnieje

#### Manual

- [ ] 4.5 og-image.png poprawny, tekst w karcie
- [ ] 4.6 Strony w PL i EN z poprawnymi linkami live i OSS
- [ ] 4.7 Menu Maker bez WIP, podtytuł Trzy z nich
