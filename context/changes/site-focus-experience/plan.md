# Doświadczenie, własne produkty i skills „gdzie użyte” — plan implementacji

## Overview

Strona główna dostaje kolejność sekcji z `site-focus.md` p. 5: **Doświadczenie** (PanelAlpha z zakresem odpowiedzialności, PanelAlpha Engine jako punkt w tym zakresie, moduły WHMCS) przed sekcją AI, a **Własne produkty** (dwa teasery z linią „co udowadnia”) po niej. Sekcja Skills znika z home. Engine przestaje być osobną kartą na wszystkich stronach (home, `/projects`, `/cv`). Literały liczbowe znikają z pełnych kart produktów, a Skarbnik dostaje prawdziwy link do publicznego repo. Na `/skills` każda pozycja stacku podstawowego mówi, gdzie jest użyta. Zmiana obsługuje odbiorcę 1 (rekruter widzi zakres pracy) i 2 (tech lead dostaje linki do kodu), zgodnie z p. 4, 7 i 8.

## Current State Analysis

- `src/views/HomeView.vue:44-97`: kolejność to O mnie → `AiWorkflowSection` → „Wybrane realizacje komercyjne” (`PanelAlphaFeature compact` dla `featured` i `openSource`, `CommercialProjectGroup compact`, link `/projects`) → Skills (7 `SkillBadge`, link `/skills`) → CTA kontakt. Własnych produktów na home nie ma.
- `src/components/ui/PanelAlphaFeature.vue:34,84`: `compact` ukrywa kontekst pracodawcy i listę `responsibilities`, więc zakres PanelAlpha jest dziś niewidoczny na home.
- `projects.openSource` (Engine, `pl.json:359-385`) ma trzech konsumentów: `HomeView.vue:55`, `ProjectsView.vue:36`, `CvView.vue:9-12`. Tylko on używa `secondaryLink` („Moje commity” → `commits?author=skostecki`). Brakuje dopisku „konto firmowe”.
- `projects.featured.responsibilities[1]` = „Integracje hostingowe, DNS, e-mail, SSL, backup i storage” (`pl.json:347`), bez nazw paneli z p. 7.
- `projects.personal.items`: Skarbnik i Root Keeper mają `featured: true`. Literały: Skarbnik `highlights[1]` „14 decyzji architektonicznych (ADR)…”, `highlights[2]` „Ponad 130 plików testów Pest… ponad 40 PR-ów” (oba trafiają do `/cv` przez `CvView.vue:135`, `slice(0, 3)`); Root Keeper `highlights[3]` „4 workflowy CI… ponad 600 commitów”.
- Skarbnik ma `note` „Repozytorium prywatne, kod pokażę na rozmowie” (`pl.json:438`) i brak linku do GitHuba, a `sebastian-kostecki/household-treasurer` jest publiczne (`gh api` 2026-11-09: `visibility: public`).
- `SkillItem` (`types/content.ts:12-17`) nie ma `usedIn`. Gałąź `design/hero-variants` dodaje `usedIn?: string` w typie, prop w `SkillBadge` (jeden `<p class="mt-1.5 text-xs leading-snug text-foreground/70">` pod `level`), `:used-in` w `SkillsView` i siedem wartości w obu locale.
- Gałąź ma `ProductTeaser.vue` (obraz 16:9, etykieta, tytuł, `subtitle`, link do hosta live). Brak w nim stacku, linii „co udowadnia” i linku do GitHuba.
- Numeracja sekcji to tekst w JSON (`about.index` „01 / O mnie”, `aiWorkflow.index` „AI / Workflow”, `projects.homePreview.index` „02 / Projekty”).
- `ui.exploreAllSkills` używa tylko sekcja Skills na home (`HomeView.vue:92`).
- Testy: Vitest w środowisku `node`, tylko `src/**/__tests__/*.spec.ts`. `locales.spec.ts` wymaga identycznych ścieżek kluczy PL/EN i braku nierozwiązanych tokenów. `ai-proof.spec.ts` to wzorzec testu treści (oba locale, `describe.each`, tożsamość URL-i). Brak testów komponentów.
- Opisy meta (`pl.json:4,10,14` i EN) mówią „open-source'owy PanelAlpha Engine”. To zostaje prawdą i nie wymaga zmiany.

## Desired End State

Na `/` sekcje idą kolejno: hero, „01 / O mnie”, „02 / Doświadczenie”, „AI / Workflow”, „03 / Własne produkty”, CTA kontakt. Sekcji Skills na home nie ma.

- **Doświadczenie:** pełna karta PanelAlpha (pracodawca, rola, okres, opis, tagi, link, lista zakresu). Punkt o integracjach brzmi: „Integracje z panelami hostingowymi (cPanel, Plesk, DirectAdmin) i PowerDNS oraz usługami e-mail, SSL, backup i storage”. Ostatni punkt to Engine: „Wkład w open-source'owy PanelAlpha Engine: auto-deploy po git push, menedżer plików, dyrektywy PHP per domena, statystyki transferu.”, zdanie kontekstu o MCP i link „Commity skostecki” z dopiskiem „konto firmowe”. Pod kartą zostaje kompaktowa grupa WHMCS (liczba 5 z tablicy + etykieta o autorstwie).
- **Własne produkty:** dwa teasery (Skarbnik, Root Keeper): zrzut ekranu, etykieta, nazwa, tagi stacku, „Udowadnia: …” bez liczb, linki do wersji live i GitHuba. Pod nimi link do `/projects`.
- `/projects`: pełna karta PanelAlpha z punktem Engine, pełna grupa WHMCS, projekty własne. Karty Engine brak. Skarbnik ma link GitHub i nie ma notatki „prywatne”. Żaden highlight nie zawiera literału skali.
- `/cv`: jedna pozycja PanelAlpha z punktem Engine (tekst + link z dopiskiem), WHMCS jak dziś, produkty bez literałów.
- `/skills`: każda z 7 pozycji `skills.core` ma linię „gdzie użyte”.
- Oba locale mają te same klucze. `site-focus.md` p. 7 i p. 11 odzwierciedlają wdrożenie.

Weryfikacja: `pnpm test`, `pnpm type-check`, `pnpm lint`, `pnpm build`, ręczny przegląd `/`, `/projects`, `/cv` (z podglądem wydruku) i `/skills` na desktopie i przy 375 px.

### Key Discoveries:

- `AiWorkflowSection.vue:64-70`: wzorzec linku zewnętrznego (`target="_blank"`, `rel="noopener noreferrer"`, `ArrowUpRight`, `font-mono text-xs text-primary`). Używamy go dla linku Engine i linków w teaserze.
- `src/content/archive-proof.ts` + `ai-proof.spec.ts`: logika pomocnicza treści żyje w `src/content/*.ts`, a testy treści importują oba JSON-y. Nowy helper strażnika literałów idzie tym samym wzorem.
- `useContent()` rozwiązuje tokeny `{years:…}` dla całego słownika, więc nowe teksty mogą ich używać, ale nie muszą. Nowe nagłówki sekcji tokenów nie używają.
- `FeaturedProjectCard.vue:62` renderuje `project.note` tylko gdy istnieje, więc usunięcie `note` ze Skarbnika nie wymaga zmian w komponencie.
- `CvView.vue:127` wypisuje hosty tylko z linków `primary`, więc dodanie linku GitHub (bez `primary`) do Skarbnika nie zmienia nagłówka produktu w CV.
- Wersje w nazwach stacku („Laravel 13”, „React 19”, „Larastan 7”, „PHP 8.5”, „Vue 3”) są dozwolone przez p. 8 (nie są liczbami skali). Strażnik musi je przepuszczać.

## What We're NOT Doing

- Nie dodajemy punktu o migracji client area (Vue 2 → Vue 3). Zgoda pracodawcy wciąż jest w `site-focus.md` p. 9 „Otwarte”.
- Nie przenosimy `SourceRef.vue`, `responsibilitySources` ani `highlightSources` z gałęzi. p. 7 wymaga jednego linku do commitów Engine, nie linku przy każdym punkcie.
- Nie zamieniamy `usedIn` na linki ani nie usuwamy wpisów PanelAlpha/WHMCS bez publicznego dowodu. Zostaje tekst z gałęzi.
- Nie pokazujemy `usedIn` na home (sekcja Skills znika z home).
- Nie zmieniamy `skills.categories` (tag wall kategorii zostaje; audyt C3 domykamy dla stacku podstawowego).
- Nie zmieniamy opisów meta ani okresu WHMCS „~6 miesięcy” (zamknięty okres historyczny, nie starzeje się).
- Nie zmieniamy sekcji AI, hero, panelu „W skrócie”, stopki ani tokenów w `main.css`.
- Nie dodajemy testów komponentów ani E2E (brak infrastruktury; osobne zmiany).
- Nie weryfikujemy „konto firmowe” przez API GitHuba. To deklaracja autora (`site-focus.md` p. 4).

## Implementation Approach

Każda faza zaczyna się od testu treści, który najpierw nie przechodzi (stan `development` łamie p. 4/p. 8), potem zmienia typy, oba locale i komponenty, aż test przejdzie przy zielonym `type-check`. Fazy są pionowe: po każdej strona działa i jest spójna.

Engine wchodzi do `FeaturedProject` jako osobne opcjonalne pole `openSourceContribution`, a nie jako unia w `responsibilities`. Dzięki temu `responsibilities` zostaje `string[]`, `CvView` i `PanelAlphaFeature` renderują punkt Engine jawnie, a test może sprawdzić link po ścieżce. Strażnik literałów to czysta funkcja w `src/content/content-rules.ts` używana przez testy faz 1 i 2.

## Critical Implementation Details

- **Kolejność w fazie 1:** usunięcie `projects.openSource` z typu `SiteContent` łamie `type-check` w trzech widokach naraz. Typ, oba JSON-y, `HomeView`, `ProjectsView` i `CvView` muszą zmienić się w tej samej fazie, inaczej `pnpm build` (który uruchamia `vue-tsc`) pada.
- **Strażnik literałów:** usuwa najpierw dozwolone wersje stacku (nazwa technologii + liczba, np. `Laravel 13`, `PHP 8.5`) i dozwolone terminy z cyfrą (`e2e`, występuje w `proves` i `highlights[3]` Root Keepera), dopiero potem szuka cyfr. Proste „brak cyfr” odrzuciłoby linie „co udowadnia” z p. 7.

## Faza 1: Doświadczenie — Engine jako punkt PanelAlpha

### Overview

Home dostaje sekcję „Doświadczenie” przed sekcją AI z pełną kartą PanelAlpha. Engine znika jako karta i staje się ostatnim punktem zakresu PanelAlpha na home, `/projects` i `/cv`. Strażnik literałów powstaje i chroni zakres PanelAlpha.

### Changes Required:

#### 1. Strażnik literałów liczbowych

**File**: `src/content/content-rules.ts` (nowy)

**Intent**: Jedna funkcja, która mówi, czy tekst zawiera liczbę skali zakazaną przez p. 8, przepuszczając wersje stacku. Używana przez testy treści tej i następnej fazy.

**Contract**: `export function scaleLiterals(text: string): string[]` zwraca znalezione fragmenty z cyframi (pusta tablica = tekst czysty). Przed szukaniem cyfr usuwa dopasowania listy dozwolonych wersji: nazwa z `ALLOWED_VERSIONED` (`PHP`, `Laravel`, `React`, `Vue`, `Vuetify`, `TypeScript`, `Larastan`, `Inertia`) + spacja + `\d+(\.\d+)?`, oraz całe słowa z `ALLOWED_TERMS` (`e2e`, dopasowanie `\b…\b`). Zakazane: każda pozostała cyfra (np. „14 decyzji”, „130+”, „ponad 40”, „4 workflowy”, „600 commitów”).

#### 2. Test treści doświadczenia (najpierw czerwony)

**File**: `src/content/__tests__/experience.spec.ts` (nowy)

**Intent**: Zamienia p. 4 i p. 7 w asercje dla obu locale, zanim zmieni się treść.

**Contract**: `describe.each(['pl','en'])`, jak w `ai-proof.spec.ts`:
- `projects` nie ma klucza `openSource`;
- `projects.featured.openSourceContribution.link.url === 'https://github.com/panelalpha/panelalpha-engine/commits?author=skostecki'`;
- `openSourceContribution.text`, `.context`, `.linkNote` niepuste;
- `scaleLiterals` zwraca `[]` dla każdego `featured.responsibilities[i]`, dla `openSourceContribution.text` i `.context` oraz dla `homeExperience.subtitle`;
- across locales: ten sam URL linku Engine, ta sama liczba `responsibilities`.
Osobny `describe('scaleLiterals')`: przepuszcza „Laravel 13 + PostgreSQL + Inertia”, „React 19 + TypeScript”, „lint, Larastan 7, Pest”, „PHP 8.5”, „pipeline'y CI: lint, Larastan, Pest, Playwright e2e”; odrzuca „14 decyzji architektonicznych (ADR)”, „Ponad 130 plików testów Pest”, „ponad 40 PR-ów”, „4 workflowy CI”, „ponad 600 commitów” i ich odpowiedniki EN z obecnego `en.json`.

#### 3. Typy

**File**: `src/types/content.ts`

**Intent**: Engine jako pole PanelAlpha zamiast osobnego projektu; nagłówek sekcji Doświadczenie zamiast `homePreview`.

**Contract**:
- nowy `export interface OpenSourceContribution { text: string; context: string; link: ProjectLink; linkNote: string }`;
- `FeaturedProject`: dodane `openSourceContribution?: OpenSourceContribution`, usunięte `secondaryLink` (jedynym użytkownikiem był Engine);
- `SiteContent.projects`: usunięte `openSource`, `homePreview` zastąpione przez `homeExperience: { index: string; title: string; subtitle: string }`.

#### 4. Treść PL i EN

**File**: `src/content/pl.json`, `src/content/en.json`

**Intent**: Treść z p. 7 i decyzji planu, w obu locale.

**Contract**:
- usunięty cały obiekt `projects.openSource`;
- `projects.homePreview` → `projects.homeExperience`: PL `index` „02 / Doświadczenie”, `title` „Doświadczenie”, `subtitle` „Zakres mojej pracy przy PanelAlpha w ModulesGarden, w tym wkład w open-source'owy PanelAlpha Engine, oraz moduły WHMCS.” (EN analogicznie, „02 / Experience”);
- `projects.featured.responsibilities[1]` PL: „Integracje z panelami hostingowymi (cPanel, Plesk, DirectAdmin) i PowerDNS oraz usługami e-mail, SSL, backup i storage” (EN odpowiednik);
- `projects.featured.openSourceContribution` PL: `text` „Wkład w open-source'owy PanelAlpha Engine: auto-deploy po git push, menedżer plików, dyrektywy PHP per domena, statystyki transferu.”, `context` „Platforma do self-hostingu projektów, którą agenci AI obsługują przez MCP.”, `link` `{ "title": "Commity skostecki", "url": "https://github.com/panelalpha/panelalpha-engine/commits?author=skostecki" }`, `linkNote` „konto firmowe”. EN: „Contributions to the open-source PanelAlpha Engine: …”, `linkNote` „company account”.

#### 5. Karta PanelAlpha

**File**: `src/components/ui/PanelAlphaFeature.vue`

**Intent**: Renderuje punkt Engine jako ostatni element listy zakresu; tryb `compact` i `secondaryLink` przestają być potrzebne (home i `/projects` używają pełnej karty).

**Contract**: prop `compact` usunięty wraz z gałęziami `v-if="!compact"`/`:class`; blok `secondaryLink` usunięty. Gdy `project.openSourceContribution` istnieje, lista kończy się `<li>` z ikoną `Check`: `text`, pod nim `context` (wyciszony), pod nim link zewnętrzny według wzorca z `AiWorkflowSection.vue:64-70` z `link.title` i dopiskiem `linkNote` (np. „Commity skostecki · konto firmowe”).

#### 6. Home: sekcja Doświadczenie przed AI

**File**: `src/views/HomeView.vue`

**Intent**: Kolejność z p. 5: O mnie → Doświadczenie → AI. Sekcja „Wybrane realizacje komercyjne” znika.

**Contract**: nowa sekcja (ten sam kontener `px-4 py-24 …`, `max-w-6xl`) z `SectionHeading` z `content.projects.homeExperience`, potem `PanelAlphaFeature :project="content.projects.featured"` (bez `compact`) i `CommercialProjectGroup … compact`. Sekcja stoi przed `<AiWorkflowSection />`. Stara sekcja „Projekty” (z kartą Engine i linkiem `/projects`) usunięta; link `/projects` wraca w fazie 2 pod teaserami.

#### 7. `/projects` i `/cv`

**File**: `src/views/ProjectsView.vue`, `src/views/CvView.vue`

**Intent**: Bez karty Engine; Engine widoczny jako punkt PanelAlpha.

**Contract**:
- `ProjectsView`: usunięty `PanelAlphaFeature` dla `openSource` (pełna karta PanelAlpha pokazuje już punkt Engine).
- `CvView`: `experience` = tylko `projects.featured` (computed z jednym elementem albo bezpośrednie użycie). Po liście `responsibilities` dodatkowy `<li>` z `openSourceContribution.text` i linkiem `link.title` (`linkNote`). Pozycja WHMCS bez zmian.

### Success Criteria:

#### Automated Verification:

- Test treści doświadczenia nie przechodzi przed zmianą treści i przechodzi po niej: `pnpm test experience`
- Wszystkie testy przechodzą, w tym parytet locale: `pnpm test`
- Sprawdzenie typów przechodzi: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- Build przechodzi: `pnpm build`
- Brak odwołań do usuniętych kluczy: `grep -rn --exclude-dir=__tests__ -e openSource -e homePreview -e secondaryLink src` zwraca tylko `openSourceContribution`

#### Manual Verification:

- Na `/` sekcja „02 / Doświadczenie” stoi między O mnie a sekcją AI i pokazuje pełną kartę PanelAlpha z listą zakresu oraz grupę WHMCS z liczbą 5
- Ostatni punkt zakresu to Engine z linkiem „Commity skostecki · konto firmowe”, który otwiera listę commitów `skostecki` w nowej karcie
- `/projects` nie ma osobnej karty Engine; `/cv` ma jedną pozycję PanelAlpha z punktem Engine, także w podglądzie wydruku
- Układ czytelny przy 375 px (pełna karta PanelAlpha bez poziomego scrolla)

**Implementation Note**: Po fazie i zielonej weryfikacji automatycznej zatrzymaj się na ręczne potwierdzenie przed fazą 2.

---

## Faza 2: Własne produkty — teasery i czysta treść

### Overview

Home dostaje sekcję „Własne produkty” po sekcji AI z dwoma teaserami, a sekcja Skills znika z home. Pełne karty tracą literały liczbowe, Skarbnik dostaje link do publicznego repo.

### Changes Required:

#### 1. Test treści produktów (najpierw czerwony)

**File**: `src/content/__tests__/products.spec.ts` (nowy)

**Intent**: p. 4 („teasery: nazwa, stack, jedno zdanie co udowadnia bez liczb”) i p. 8 (brak literałów) jako asercje dla obu locale.

**Contract**: `describe.each(['pl','en'])` po `personal.items.filter(featured)`:
- dokładnie 2 produkty, każdy z niepustym `proves`;
- `scaleLiterals` zwraca `[]` dla `proves`, `subtitle` i każdego `highlights[i]`;
- każdy ma link `primary` (live) i link na `https://github.com/sebastian-kostecki/…`;
- żaden nie ma `note`;
- `homeProducts.subtitle` bez literałów;
- `ui` nie ma klucza `exploreAllSkills`.
Across locales: te same URL-e linków w tej samej kolejności.
Osobny `describe('links')`: `hostOf` zwraca host dla poprawnego URL-a, a dla błędnego zwraca wejście i loguje błąd (`vi.spyOn(console, 'error')`); `isRepo` rozpoznaje `github.com`.

#### 2. Typy

**File**: `src/types/content.ts`

**Intent**: Linia „co udowadnia” jako dane projektu; nagłówek sekcji produktów; etykieta.

**Contract**: `Project.proves?: string` (z komentarzem: jedno zdanie bez liczb, renderowane w teaserze na home); `SiteContent.projects.homeProducts: { index: string; title: string; subtitle: string }`; `ui.provesLabel: string`; usunięte `ui.exploreAllSkills`.

#### 3. Treść PL i EN

**File**: `src/content/pl.json`, `src/content/en.json`

**Intent**: Linie z p. 7, przepisane literały, prawdziwy stan repo Skarbnika.

**Contract**:
- Skarbnik `proves` PL: „Laravel 13 + PostgreSQL + Inertia od zera do produkcji, z ADR, changelogiem i testami Pest w CI.”; Root Keeper `proves` PL: „Ten sam backend z innym frontendem (React 19 + TypeScript), pipeline'y CI: lint, Larastan, Pest, Playwright e2e.” (EN odpowiedniki);
- Skarbnik `highlights[1]` → „Decyzje architektoniczne (ADR), słownik domeny i CHANGELOG”; `highlights[2]` → „Testy Pest uruchamiane w CI na GitHub Actions”; Root Keeper `highlights[3]` → „Workflowy CI: lint, Larastan 7, testy Pest i e2e w Playwright” (EN odpowiedniki bez liczb);
- Skarbnik: usunięte `note`, dodany link `{ "title": "GitHub", "url": "https://github.com/sebastian-kostecki/household-treasurer" }` po linku live;
- `projects.homeProducts` PL: `index` „03 / Własne produkty”, `title` „Własne produkty na produkcji”, `subtitle` „Produkty, które buduję po godzinach i utrzymuję na własnym VPS-ie. Pełne opisy na stronie projektów.”;
- `ui.provesLabel` PL „Udowadnia”, EN „Proves”; usunięte `ui.exploreAllSkills`.

#### 4. Pomocnik linków

**File**: `src/content/links.ts` (nowy), `src/views/CvView.vue`, `src/components/ui/FeaturedProjectCard.vue`

**Intent**: Jedno miejsce dla logiki linków zamiast trzeciej kopii w teaserze.

**Contract**: `export function hostOf(url: string): string` (przeniesione z `CvView.vue:18-25`: `new URL(url).host`, przy błędzie `console.error` z URL-em i przyczyną + fallback na `url`) i `export function isRepo(url: string): boolean` (przeniesione z `FeaturedProjectCard.vue:13-15`). `CvView` i `FeaturedProjectCard` importują je zamiast lokalnych funkcji.

#### 5. Teaser produktu

**File**: `src/components/ui/ProductTeaser.vue` (nowy, adaptacja z `design/hero-variants`)

**Intent**: Karta z p. 4: nazwa, stack, „co udowadnia”, linki do live i kodu.

**Contract**: prop `project: Project`. Zachowuje z gałęzi obraz 16:9 (`loading="lazy"`, `width/height`), etykietę `ui.featuredProjectLabel` i tytuł. Zamiast `subtitle`: linia `ui.provesLabel` + `project.proves`. Tagi stacku w stylu z `FeaturedProjectCard.vue:39-47`. Linki: host linku `primary` (jak na gałęzi) oraz link GitHub (`isRepo`) z ikoną `simple-icons:github`, oba według wzorca linku zewnętrznego. Host liczony przez `hostOf` z `src/content/links.ts` (log + fallback na URL), nie przez gołe `new URL` z gałęzi.

#### 6. Home: Własne produkty zamiast Skills

**File**: `src/views/HomeView.vue`

**Intent**: Kolejność z p. 5: AI → Własne produkty → Kontakt. Sekcja Skills znika z home.

**Contract**: nowa sekcja po `<AiWorkflowSection />` z `SectionHeading` z `content.projects.homeProducts`, siatką `grid gap-5 md:grid-cols-2` z `ProductTeaser` dla `personal.items.filter(featured)` (computed jak w `ProjectsView.vue:12-14`) i linkiem `ui.seeAllProjects` → `/projects` (wzorzec z obecnego `HomeView.vue:58-66`). Sekcja Skills (`HomeView.vue:70-97`) i import `SkillBadge` usunięte.

### Success Criteria:

#### Automated Verification:

- Test treści produktów nie przechodzi przed zmianą treści i przechodzi po niej: `pnpm test products`
- Wszystkie testy przechodzą: `pnpm test`
- Sprawdzenie typów przechodzi: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- Build przechodzi: `pnpm build`

#### Manual Verification:

- Na `/` po sekcji AI są dwa teasery (zrzut, nazwa, tagi, „Udowadnia: …”, link do hosta live i GitHub) i link do `/projects`; sekcji Skills na home nie ma
- Na `/projects` karta Skarbnika ma przycisk GitHub prowadzący do publicznego repo i nie ma notatki „Repozytorium prywatne”; żaden punkt kart produktów nie zawiera liczby skali
- `/cv` w sekcji produktów nie pokazuje „14 decyzji” ani „130 plików”
- Teasery czytelne przy 375 px (jedna kolumna, linki nie wychodzą poza kartę)

**Implementation Note**: Po fazie i zielonej weryfikacji automatycznej zatrzymaj się na ręczne potwierdzenie przed fazą 3.

---

## Faza 3: Skills „gdzie użyte” i domknięcie foundation

### Overview

Na `/skills` każda pozycja stacku podstawowego mówi, gdzie jest użyta (port z gałęzi). `site-focus.md` dostaje wdrożone brzmienie i wpis w dzienniku.

### Changes Required:

#### 1. Test treści skills (najpierw czerwony)

**File**: `src/content/__tests__/skills.spec.ts` (nowy)

**Intent**: C3 z audytu dla stacku podstawowego: żadna pozycja bez „gdzie użyte”.

**Contract**: `describe.each(['pl','en'])`: każdy element `skills.core` ma niepuste `usedIn`; across locales ta sama liczba pozycji i te same `name` w tej samej kolejności.

#### 2. Typ, komponent, widok

**File**: `src/types/content.ts`, `src/components/ui/SkillBadge.vue`, `src/views/SkillsView.vue`

**Intent**: Przeniesienie 1:1 z `design/hero-variants`.

**Contract**: `SkillItem.usedIn?: string`; `SkillBadge` prop `usedIn?: string` renderowany jako `<p v-if="usedIn" class="mt-1.5 text-xs leading-snug text-foreground/70">` pod `level`; `SkillsView` przekazuje `:used-in="skill.usedIn"`.

#### 3. Treść PL i EN

**File**: `src/content/pl.json`, `src/content/en.json`

**Intent**: Siedem wartości z gałęzi (zweryfikowanych w researchu względem manifestów).

**Contract**: `skills.core[].usedIn` PL kolejno: PHP „PanelAlpha, moduły WHMCS, Root Keeper, Domowy Skarbnik”; Laravel „PanelAlpha, Root Keeper, Domowy Skarbnik, Menu Maker”; PostgreSQL „Root Keeper, Domowy Skarbnik”; MySQL „PanelAlpha”; TypeScript „Root Keeper (React), Domowy Skarbnik (Vue), ta strona”; Docker „PanelAlpha Engine, deploy na własnym VPS-ie”; Vue.js „PanelAlpha, Domowy Skarbnik, ta strona”. EN z `git show design/hero-variants:src/content/en.json`.

#### 4. Dokument fundamentowy

**File**: `context/foundation/site-focus.md`

**Intent**: Dokument zgodny z wdrożonym stanem, jak po `site-focus-ai-proof`.

**Contract**: p. 7 „Doświadczenie: PanelAlpha”: pierwszy punkt w wdrożonym brzmieniu (z e-mail, SSL, backup i storage), punkt Engine z „konto firmowe” i informacją, że migracja client area nadal czeka na zgodę. p. 11: wpis „2026-11-09, wdrożenie `site-focus-experience`” (Engine bez osobnej karty na home, `/projects` i `/cv`; Skills tylko na `/skills` z „gdzie użyte”; literały usunięte z kart produktów i CV, z testem strażnika; Skarbnik linkuje do publicznego repo).

### Success Criteria:

#### Automated Verification:

- Test treści skills nie przechodzi przed dodaniem `usedIn` i przechodzi po nim: `pnpm test skills`
- Wszystkie testy przechodzą: `pnpm test`
- Sprawdzenie typów przechodzi: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- Build przechodzi: `pnpm build`

#### Manual Verification:

- Na `/skills` każda z 7 pozycji stacku podstawowego pokazuje linię „gdzie użyte” pod poziomem, w PL i EN
- `site-focus.md` p. 7 i p. 11 zgadzają się z tym, co widać na stronie

---

## Testing Strategy

### Unit Tests:

- `scaleLiterals`: przepuszcza wersje stacku i `e2e` z p. 7, odrzuca każdy literał obecny dziś w `pl.json` i `en.json`.
- Testy treści per locale (`experience`, `products`, `skills`): brak `openSource`, link Engine, brak literałów, `proves`, linki GitHub, brak `note`, `usedIn`.
- Parytet kluczy PL/EN przez istniejący `locales.spec.ts`.

### Integration Tests:

- `pnpm build` (z `vue-tsc`) jako dowód, że trzy widoki konsumujące `projects.*` nadal kompilują się z nowym typem.

### Manual Testing Steps:

1. `pnpm dev`, `/`: kolejność hero → O mnie → Doświadczenie → AI → Własne produkty → kontakt; brak Skills.
2. Kliknąć link Engine i oba linki teaserów; sprawdzić nowe karty i docelowe strony.
3. `/projects`: brak karty Engine, Skarbnik z GitHubem, brak liczb skali.
4. `/cv` + podgląd wydruku: jedna pozycja PanelAlpha z punktem Engine, produkty bez literałów.
5. `/skills`: linie „gdzie użyte”.
6. Przełączyć na EN i powtórzyć 1–5. DevTools przy 375 px dla `/` i `/projects`.

## Performance Considerations

Dwa dodatkowe zrzuty ekranu na home ładowane `loading="lazy"` (te same pliki co na `/projects`). Usunięcie sekcji Skills skraca stronę. Bez innych skutków.

## Migration Notes

Nie dotyczy (statyczna treść, brak danych użytkowników). Wycofanie = revert commitów faz.

## References

- Research: `context/changes/site-focus-experience/research.md`
- Foundation: `context/foundation/site-focus.md` p. 4, 5, 7, 8, 9, 11
- Poprzednia zmiana (wzorzec testu treści i domknięcia foundation): `context/archive/2026-11-09-site-focus-ai-proof/plan.md`
- Wzorzec testu: `src/content/__tests__/ai-proof.spec.ts`
- Wzorzec linku: `src/components/ui/AiWorkflowSection.vue:64-70`
- Źródła z gałęzi: `design/hero-variants`: `src/components/ui/ProductTeaser.vue`, `SkillBadge.vue`, `src/views/SkillsView.vue`, `src/content/{pl,en}.json` (`skills.core[].usedIn`)

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Doświadczenie — Engine jako punkt PanelAlpha

#### Automated

- [x] 1.1 Test treści doświadczenia nie przechodzi przed zmianą treści i przechodzi po niej: `pnpm test experience` — 90ef5f8
- [x] 1.2 Wszystkie testy przechodzą, w tym parytet locale: `pnpm test` — 90ef5f8
- [x] 1.3 Sprawdzenie typów przechodzi: `pnpm type-check` — 90ef5f8
- [x] 1.4 Lint przechodzi: `pnpm lint` — 90ef5f8
- [x] 1.5 Build przechodzi: `pnpm build` — 90ef5f8
- [x] 1.6 Brak odwołań do usuniętych kluczy: `grep -rn --exclude-dir=__tests__ -e openSource -e homePreview -e secondaryLink src` zwraca tylko `openSourceContribution` — 90ef5f8

#### Manual

- [x] 1.7 Na `/` sekcja „02 / Doświadczenie” stoi między O mnie a sekcją AI i pokazuje pełną kartę PanelAlpha z listą zakresu oraz grupę WHMCS z liczbą 5
- [x] 1.8 Ostatni punkt zakresu to Engine z linkiem „Commity skostecki · konto firmowe”, który otwiera listę commitów `skostecki` w nowej karcie
- [x] 1.9 `/projects` nie ma osobnej karty Engine; `/cv` ma jedną pozycję PanelAlpha z punktem Engine, także w podglądzie wydruku — 90ef5f8
- [x] 1.10 Układ czytelny przy 375 px (pełna karta PanelAlpha bez poziomego scrolla) — 90ef5f8

### Phase 2: Własne produkty — teasery i czysta treść

#### Automated

- [x] 2.1 Test treści produktów nie przechodzi przed zmianą treści i przechodzi po niej: `pnpm test products`
- [x] 2.2 Wszystkie testy przechodzą: `pnpm test`
- [x] 2.3 Sprawdzenie typów przechodzi: `pnpm type-check`
- [x] 2.4 Lint przechodzi: `pnpm lint`
- [x] 2.5 Build przechodzi: `pnpm build`

#### Manual

- [x] 2.6 Na `/` po sekcji AI są dwa teasery (zrzut, nazwa, tagi, „Udowadnia: …”, link do hosta live i GitHub) i link do `/projects`; sekcji Skills na home nie ma
- [x] 2.7 Na `/projects` karta Skarbnika ma przycisk GitHub prowadzący do publicznego repo i nie ma notatki „Repozytorium prywatne”; żaden punkt kart produktów nie zawiera liczby skali
- [x] 2.8 `/cv` w sekcji produktów nie pokazuje „14 decyzji” ani „130 plików”
- [x] 2.9 Teasery czytelne przy 375 px (jedna kolumna, linki nie wychodzą poza kartę)

### Phase 3: Skills „gdzie użyte” i domknięcie foundation

#### Automated

- [ ] 3.1 Test treści skills nie przechodzi przed dodaniem `usedIn` i przechodzi po nim: `pnpm test skills`
- [ ] 3.2 Wszystkie testy przechodzą: `pnpm test`
- [ ] 3.3 Sprawdzenie typów przechodzi: `pnpm type-check`
- [ ] 3.4 Lint przechodzi: `pnpm lint`
- [ ] 3.5 Build przechodzi: `pnpm build`

#### Manual

- [ ] 3.6 Na `/skills` każda z 7 pozycji stacku podstawowego pokazuje linię „gdzie użyte” pod poziomem, w PL i EN
- [ ] 3.7 `site-focus.md` p. 7 i p. 11 zgadzają się z tym, co widać na stronie
