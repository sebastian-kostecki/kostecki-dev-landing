---
date: 2026-11-09T12:58:00+01:00
researcher: Claude Code (Sonnet 5.5)
git_commit: fddb4aee9cc52eb9323166745e0c29b9bc0eeb1a
branch: development
repository: kostecki-dev-landing
topic: "Stan wyjściowy dla zmiany site-focus-experience: Doświadczenie, teasery produktów, skills „gdzie użyte”"
tags: [research, codebase, HomeView, PanelAlphaFeature, ProductTeaser, SkillBadge, CvView, content-types, locale]
status: complete
last_updated: 2026-11-09
last_updated_by: Claude Code (Sonnet 5.5)
---

# Research: stan wyjściowy dla `site-focus-experience`

**Date**: 2026-11-09T12:58:00+01:00
**Researcher**: Claude Code (Sonnet 5.5)
**Git Commit**: fddb4ae (HEAD `development`); gałąź `design/hero-variants` = 423456f
**Branch**: development
**Repository**: kostecki-dev-landing

Zakres sprawdzony: pliki `src/` na `development` (czytane w całości: `HomeView`, `ProjectsView`,
`SkillsView`, `CvView`, `PanelAlphaFeature`, `CommercialProjectGroup`, `SkillBadge`,
`AiWorkflowSection`, `types/content.ts`, `pl.json` od linii 1 do 60 i od 140 do końca, oba testy
w `src/content/__tests__/`), diff `development...design/hero-variants` dla widoków, komponentów
i typów, treść `pl.json`/`en.json` z gałęzi (przez `git show`), `context/foundation/site-focus.md`
w całości oraz fragmenty `context/site-audit-2026-11.md` i `context/proposal-2026-11-github-driven-changes.md`.
Zewnętrznie: GitHub API (`gh`) dla widoczności repo, commitów Engine i manifestów
(`composer.json`, `package.json`, `.env.example`). Nie uruchamiano buildu ani testów. Nie czytano
`en.json` na `development` poza porównaniem kluczy przez `locales.spec.ts`. Nie ma
`context/foundation/lessons.md`.

## Research Question

Co jest dziś na `development` w obszarze zmiany `site-focus-experience` (zakres PanelAlpha z Engine
jako punktem, teasery Skarbnika i Root Keepera z linią „co udowadnia”, skills „gdzie użyte”
z `design/hero-variants`), co z gałęzi nadaje się do przeniesienia, co koliduje z `site-focus.md`
p. 4, 5, 7, 8 i jakie decyzje trzeba podjąć w planie.

## Summary

- **Home dziś nie ma sekcji „Doświadczenie” ani „Własne produkty”.** Na `development` strona główna
  ma kolejno: hero, O mnie, Praca z agentami AI, jedną sekcję „Wybrane realizacje komercyjne”
  (PanelAlpha, Engine, moduły WHMCS, wszystko w trybie `compact`), Umiejętności, Kontakt
  (`src/views/HomeView.vue:18-110`). Własne produkty (Skarbnik, Root Keeper) występują wyłącznie
  na `/projects` jako pełne karty (`src/views/ProjectsView.vue:40-64`). Kolejność z `site-focus.md`
  p. 5 (Doświadczenie przed AI, Własne produkty po AI) wymaga przestawienia sekcji.
- **Tryb `compact` ukrywa zakres odpowiedzialności.** `PanelAlphaFeature` w `compact` nie renderuje
  listy `responsibilities` ani kontekstu pracodawcy (`PanelAlphaFeature.vue:34`, `:84`). Sekcja
  „Doświadczenie” z zakresem PanelAlpha (p. 7) nie może więc użyć obecnego `compact` na home.
- **Engine jest dziś osobną kartą** (`projects.openSource`, `pl.json:359-385`) na home
  (`HomeView.vue:55`), na `/projects` (`ProjectsView.vue:36`) i w CV jako druga pozycja
  doświadczenia (`CvView.vue:9-12`). `site-focus.md` p. 4 mówi: „Nie jest osobną kartą”. Usunięcie
  `openSource` zmienia więc trzy konsumentów, nie jedną sekcję.
- **Gałąź `design/hero-variants` dostarcza gotowe: `usedIn` w `SkillBadge`/`SkillsView`/typach/obu
  locale, `ProductTeaser.vue`, `SourceRef.vue`.** Nic z tego nie istnieje na `development`
  (`grep usedIn|ProductTeaser|SourceRef src` zwraca 0 trafień). `ProductTeaser` z gałęzi nie ma linii
  „co udowadnia” ani tagów stacku; wyświetla `subtitle` projektu, więc wymaga adaptacji.
- **Dane Engine z gałęzi mają jeden błędny link:** czwarty punkt („Statystyki transferu i odwiedzin
  liczone z istniejących logów”) wskazuje na `ba43ac7` (fix), a commit funkcji to `3cceed2`.
- **Sprzeczność poza zakresem wprost, ale blokująca teaser Skarbnika:** karta Skarbnika na `/projects`
  mówi „Repozytorium prywatne” (`pl.json:438`) i nie ma linku do GitHuba, a repo
  `sebastian-kostecki/household-treasurer` jest publiczne (GitHub API, 2026-11-09), i sekcja AI
  już linkuje do jego archiwum (`pl.json:173`).
- **Literały liczbowe w pełnych kartach `/projects` i w CV łamią p. 4/p. 8** (np. „14 decyzji
  architektonicznych”, „Ponad 130 plików testów”, „ponad 600 commitów”). Polecenie zmiany dotyczy
  teaserów „bez liczb”; czy czyścić pełne karty, to decyzja do planu.

## Detailed Findings

### 1. Struktura strony głównej dziś

- Hero + `SummaryPanel`: `HomeView.vue:18-28`. O mnie ze zdjęciem: `:30-42`. `AiWorkflowSection`: `:44`.
- Sekcja „Projekty” na home: `:46-68`. Zawiera `PanelAlphaFeature compact` dla `featured` i `openSource`
  oraz `CommercialProjectGroup compact` (`:54-56`) i link `/projects` (`:58-66`). Nagłówek bierze
  `projects.homePreview` (`index` „02 / Projekty”, `title` „Wybrane realizacje komercyjne”, subtitle
  wymienia Engine i „pięć … modułów WHMCS”) (`pl.json:327-331`).
- Skills na home: siatka 7 `SkillBadge` z `skills.core` i link `/skills` (`HomeView.vue:70-97`).
  Skills **nie występują** w kolejności sekcji z `site-focus.md` p. 5 (sekcje 1-7: hero, O mnie,
  Doświadczenie, AI, Własne produkty, Kontakt, Stopka). Czy sekcja skills zostaje na home, plik nie
  rozstrzyga.
- Numeracja w nagłówkach jest tekstem w JSON: „01 / O mnie” (`pl.json:136`, `about.index`),
  „AI / Workflow” (`:145`), „02 / Projekty” (`:328`), „03 / Umiejętności” (`:226`), „04 / Kontakt”
  (`:530`). Przestawienie lub dodanie sekcji wymaga ręcznej korekty tych `index` w obu locale;
  numeracji nie generuje kod.

### 2. Zakres PanelAlpha i Engine w danych

- `projects.featured` (PanelAlpha): 5 punktów `responsibilities`, opis, tagi, link do panelalpha.com
  (`pl.json:335-358`). Okres to token `{years:panelAlpha}` (`:341`), liczony przez `useDuration`,
  zgodny z p. 4 („tylko liczone przy buildzie”). Żaden punkt nie zawiera liczby. Punkt o integracjach
  wymienia „hostingowe, DNS, e-mail, SSL, backup i storage” (`:347`), a nie nazwy paneli
  z p. 7 (cPanel, Plesk, DirectAdmin, PowerDNS).
- `projects.openSource` (Engine): 4 punkty, `link` do repo, `secondaryLink` „Moje commity” →
  `commits?author=skostecki` (`pl.json:359-385`). **Brakuje dopisku „konto firmowe”** w całym
  `pl.json` dla tego linku. Opis Engine zawiera zdanie o agencie AI i MCP (`:367`), czyli „jedno
  zdanie kontekstu” z p. 7 już istnieje.
- Commity autora `skostecki` w `panelalpha/panelalpha-engine`: **5 commitów** na GitHub API
  (2026-11-09, `per_page=100`, wynik 5): `3cceed2` (statistics), `0ba4fa7` (php directives),
  `3e7adfa` (git push redeploy), `de1c6e8` (files), `ba43ac7` (fix: transfer counts every request).
  Cztery punkty z karty odpowiadają kolejno `3e7adfa`, `de1c6e8`, `0ba4fa7` i **`3cceed2`**.
  Gałąź `design/hero-variants` mapuje czwarty punkt na `ba43ac7` (`responsibilitySources` w jej
  `pl.json`), czyli na commit naprawczy, nie na commit funkcji.
- Czy `skostecki` to „konto firmowe”: GitHub API zwraca dla `users/skostecki` `type: User`,
  `company: null`, 3 publiczne repozytoria. Konto firmowe wynika więc z deklaracji autora
  (`site-focus.md:55`, treść polecenia), nie z danych API. Traktuję to jako fakt podany przez
  użytkownika, bez weryfikacji zewnętrznej.
- Moduły WHMCS: `commercialGroup`, 5 pozycji, `compactLabel` „samodzielnie zaimplementowanych modułów
  WHMCS” i wyświetlana liczba `group.items.length` (`pl.json:386-420`, `CommercialProjectGroup.vue:49-53`).
  `site-focus.md` p. 7 mówi „pięć, z notą o autorstwie, jak dziś”, co zgadza się z obecną liczbą z tablicy.
- Wymóg zgody pracodawcy: punkt o migracji client area (Vue 2 → Vue 3) jest w p. 7 oznaczony
  „tylko po zgodzie pracodawcy”, a zgoda wciąż jest w „Otwarte” (`site-focus.md:171-172`). Na
  `development` takiego punktu nie ma (`pl.json:345-351`).

### 3. Konsumenci `projects.openSource` i `projects.featured`

- `HomeView.vue:54-55` (karty compact), `ProjectsView.vue:35-36` (karty pełne), `CvView.vue:9-12`
  (`experience`, renderowane jako role + opis + lista `responsibilities`, `CvView.vue:86-101`).
- Teksty meta wspominają Engine: `meta.description` i `routes.home.description` (`pl.json:4`, `:10`),
  `routes.projects.description` (`:14`), `projects.homePreview.subtitle` (`:330`). Po zmianie Engine
  na punkt w zakresie te zdania trzeba sprawdzić pod kątem spójności (nie muszą się zmienić:
  „open-source'owy PanelAlpha Engine” nadal jest prawdziwe).
- Test jakości locale: `locales.spec.ts:20-30` wymaga identycznych ścieżek kluczy `pl.json` i
  `en.json` oraz braku nierozwiązanych tokenów `{years:…}`. Każde nowe pole (np. `proves`, `usedIn`,
  nagłówki sekcji) musi trafić do obu plików, inaczej test pada.

### 4. Teasery produktów: dziś vs gałąź

- Dziś: `personal.items` ma 5 projektów, z czego `featured: true` mają Skarbnik i Root Keeper
  (`pl.json:431`, `:453`); `ProjectsView.vue:12-17` dzieli je na `featuredPersonal` i `otherPersonal`.
  `FeaturedProjectCard` renderuje `highlights` jako listę z „Check” (`FeaturedProjectCard.vue:30-45`).
- Literały w `highlights`: Skarbnik „14 decyzji architektonicznych (ADR)” i „Ponad 130 plików testów
  Pest, … ponad 40 PR-ów” (`pl.json:434-435`); Root Keeper „4 workflowy CI … ponad 600 commitów”
  (`:458`, czwarty punkt). `CvView.vue:135` wypisuje `project.highlights?.slice(0, 3)`, czyli
  pierwsze trzy punkty każdego produktu. Dla Skarbnika oba literały (indeksy 1 i 2: „14 decyzji”,
  „Ponad 130 plików testów … ponad 40 PR-ów”) trafiają więc do CV. Literał Root Keepera
  („4 workflowy CI … ponad 600 commitów”) jest czwartym punktem i do CV **nie** trafia.
- Gałąź: `ProductTeaser.vue` (50 linii) pokazuje obraz, etykietę `ui.featuredProjectLabel`, tytuł,
  `project.subtitle` i link do hosta wersji live. Nie ma tagów, nie ma pola „co udowadnia”, a link
  do GitHuba jest pomijany (bierze tylko `links.find(primary)`). Użyta w `HomeView` gałęzi jako
  `grid md:grid-cols-2` **między** PanelAlpha a Engine, czyli układ „Realizacje komercyjne + produkty
  własne w jednej sekcji”, nie osobna sekcja z p. 5.
- Linie „co udowadnia” z p. 7 (`site-focus.md:151-154`) nie istnieją w żadnym `pl.json`
  (ani na `development`, ani na gałęzi): trzeba dodać pole do typu `Project` (np. `proves`) i oba
  locale. Teksty z p. 7 są bez liczb, ale zawierają wersje: „Laravel 13 + PostgreSQL + Inertia”,
  „React 19 + TypeScript”, „Larastan” itd. To nazwy stacku, nie literały skali, i są
  weryfikowalne w manifestach (patrz p. 6 niżej).
- Etykieta karty: `ui.featuredProjectLabel` = „Projekt własny na produkcji” (`pl.json:57`).

### 5. Skills „gdzie użyte”

- Dziś `SkillItem` ma `name, icon?, image?, level?` (`types/content.ts:12-17`), `SkillBadge` wyświetla
  `name` i `level` (`SkillBadge.vue:21-24`), `SkillsView` przekazuje cztery propsy (`:32-39`), a home
  także (`HomeView.vue:78-85`).
- Gałąź dodaje opcjonalne `usedIn` do `SkillItem`, prop `usedIn` w `SkillBadge` (dodatkowy `<p>`
  pod `level`), `:used-in` w `SkillsView` i siedem wartości w `skills.core` obu locale. **Home
  na gałęzi nie przekazuje `usedIn`** (diff `HomeView` nie dotyka `SkillBadge`), więc „gdzie użyte”
  jest tam tylko na `/skills`. Polecenie nie precyzuje, czy ma być też na home.
- Pokrycie: `usedIn` na gałęzi dotyczy tylko 7 pozycji `skills.core`. 7 `categories` z tagami
  (np. „Integracje infrastrukturalne”) pozostaje „tag wallem” (audyt C3 dotyczy całej strony, `site-audit-2026-11.md:102-103`).
  Zmiana z gałęzi domyka więc C3 częściowo.
- Weryfikacja treści `usedIn` względem publicznych dowodów (GitHub API, manifesty, 2026-11-09):

  | Wartość z gałęzi | Dowód publiczny |
  | --- | --- |
  | PHP: PanelAlpha, moduły WHMCS, Root Keeper, Skarbnik | RK `php ^8.5`, Skarbnik `php ^8.4.1`; PanelAlpha i moduły WHMCS bez publicznego dowodu (kod komercyjny) |
  | Laravel: PanelAlpha, RK, Skarbnik, Menu Maker | RK i Skarbnik `laravel/framework ^13.17`; Menu Maker `^12.0` (Laravel, ale **12**, nie 13) |
  | PostgreSQL: RK, Skarbnik | oba `.env.example` mają `DB_CONNECTION=pgsql` |
  | MySQL: PanelAlpha | tylko deklaracja (już jest w tagach `featured`, `pl.json:352`) |
  | TypeScript: RK (React), Skarbnik (Vue), ta strona | RK `typescript ^7.0.2` + `react ^19.2.0`; Skarbnik `typescript ^5.2.2` + `vue ^3.5.44`; landing `typescript ~6.0.0` |
  | Docker: PanelAlpha Engine, deploy na VPS | Engine ma `dockerfiles/` i `docker-compose.yml*`; repo `kostecki-dev-infra` jest publiczne |
  | Vue.js: PanelAlpha, Skarbnik, ta strona | Skarbnik `vue ^3.5.44`, landing `vue ^3.5.32`; PanelAlpha tylko deklaracja (tag Vue.js/Vuetify w `featured`) |

  Wniosek: dla wpisów dotyczących PanelAlpha i modułów WHMCS nie ma publicznego linku, a p. 8
  (`site-focus.md:158`) wymaga „linku do dowodu albo nie wchodzi”. Te wpisy są już na stronie jako
  tagi `featured`, więc nie dodają nowego twierdzenia, ale nie mają dowodu linkowanego. Do decyzji
  w planie, czy `usedIn` ma być tekstem (jak na gałęzi) czy linkami do sekcji/projektów.
- Para `level` + `usedIn` bywa redundantna: np. „MySQL / Produkt komercyjny” i `usedIn` „PanelAlpha”
  (`pl.json:248-252` + gałąź).

### 6. `SourceRef` i linki do dowodów w punktach

- Gałąź dodaje `responsibilitySources` (FeaturedProject) i `highlightSources` (Project), komponent
  `SourceRef` renderujący `[źr.]` przy punkcie, klasę `.source-ref` w `main.css` oraz klucze
  `ui.sourceLabel/sourceTitle`. W `HomeView` gałęzi `compact` nadal ukrywa te listy.
- `site-focus.md` p. 7 (Engine) wymaga **jednego** linku do commitów autora z dopiskiem, a nie linku
  przy każdym punkcie. Link per punkt jest opcją z gałęzi, nie wymogiem. `highlightSources` dla
  Root Keepera na gałęzi wskazują na stałe SHA `b4c2b4a` (stabilne) i dotyczą pełnych kart `/projects`,
  nie teaserów.

### 7. Wzorce i bramki w repozytorium

- Wzorzec testów treści: `ai-proof.spec.ts` sprawdza liczbę pozycji, format URL (`ARCHIVE_FOLDER_URL`
  w `src/content/archive-proof.ts`), tożsamość URL-i w obu locale. Analogiczna ochrona dla
  `usedIn`/`proves` i linków Engine jest naturalnym rozszerzeniem, ale nie istnieje.
- Skrypty: `test` = `vitest run`, `type-check` = `vue-tsc --build`, `lint` = oxlint + eslint, `build`
  najpierw uruchamia `generate:archive` (`package.json:6-22`). W tej sesji żadnego z nich nie uruchamiano.
- Strona `/cv` budowana z tych samych danych (`CvView.vue`), więc zmiana struktury `projects.*`
  musi zachować `featured`, `commercialGroup`, `personal.items[].highlights`.

## Code References

- `src/views/HomeView.vue:44-68` - kolejność sekcji AI i „Projekty” (PanelAlpha, Engine, WHMCS compact)
- `src/views/HomeView.vue:70-97` - sekcja Skills na home (bez `usedIn`)
- `src/views/ProjectsView.vue:34-38,40-64` - pełne karty komercyjne i własne produkty
- `src/components/ui/PanelAlphaFeature.vue:34,84` - `compact` ukrywa kontekst i `responsibilities`
- `src/components/ui/CommercialProjectGroup.vue:49-53` - liczba z `items.length` w trybie compact
- `src/views/CvView.vue:9-15,135` - konsumenci `featured`, `openSource`, `highlights`
- `src/types/content.ts:12-17,31-45,53-63` - `SkillItem`, `Project`, `FeaturedProject`
- `src/content/pl.json:327-331,335-358,359-385,386-420,421-527` - homePreview, featured, openSource, WHMCS, personal
- `src/content/pl.json:434-435,438,458` - literały liczbowe i „Repozytorium prywatne”
- `src/content/pl.json:136,145,226,328,530` - ręcznie wpisane `index` nagłówków sekcji
- `src/content/__tests__/locales.spec.ts:20-30` - parytet kluczy pl/en
- `context/foundation/site-focus.md:55-56,64-74,117-126,149-154,156-166` - decyzje i szkic treści
- gałąź `design/hero-variants`: `src/components/ui/ProductTeaser.vue`, `SourceRef.vue`, `SkillBadge.vue` (`usedIn`), `SkillsView.vue`, `types/content.ts`, `pl.json`/`en.json` (`skills.core[].usedIn`, `openSource.responsibilitySources`)

## Architecture Insights

- Treść to jeden słownik JSON na locale + typ `SiteContent`; widoki czytają go przez `useContent()`;
  duration tokeny rozwiązywane przy ładowaniu (`useContent.ts`). Nowa treść = typ + oba JSON-y + test parytetu.
- `compact` to flaga komponentów, nie osobny widok; home i `/projects` współdzielą dane i komponenty.
  Sekcję „Doświadczenie” z zakresem najprościej zbudować przez niekompaktowy wariant (bez
  duplikowania treści), ale to wybór projektowy planu.
- `site-focus-hero` przenosiło elementy z gałęzi przez kopiowanie lub adaptację plików, nie przez merge
  (`context/archive/2026-11-09-site-focus-hero/research.md`, Summary). Dla `site-focus-ai-proof` nie
  sprawdzano, czy korzystało z gałęzi (brak `research.md`).

## Historical Context (from prior changes)

- `context/archive/2026-11-09-site-focus-hero/research.md` - porównanie `development` z gałęzią;
  gałąź to jeden commit nad `development`, przenosiny plik po pliku (dla bieżącej zmiany gałąź
  nadal jest jednym commitem 423456f nad starym `development`; `git diff development...design/hero-variants`
  pokazuje 46 plików, z czego część już przeniesiono w hero i ai-proof).
- `context/archive/2026-11-09-site-focus-ai-proof/` - sekcja AI i test linków (`ai-proof.spec.ts`);
  wprowadził wzorzec testu dla treści z linkami. Dane archiwum w `src/generated/`.
- Szkic w `site-focus.md` p. 7 został zaktualizowany po `ai-proof` (dziennik rewizji, p. 11);
  szkic doświadczenia i produktów **nie** był jeszcze weryfikowany względem kodu przed tym badaniem.

## Related Research

- `context/archive/2026-11-09-site-focus-hero/research.md` (jedyny research w archiwum; `ai-proof`
  nie ma `research.md`).

## Open Questions

Decyzje do podjęcia w `/10x-plan` (nie rozstrzygam ich tutaj):

1. **Struktura home.** Czy powstają dwie nowe sekcje (Doświadczenie, Własne produkty) zgodnie
   z p. 5, a obecna „Wybrane realizacje komercyjne” znika? Co z sekcją Skills na home (brak w p. 5)
   i z numeracją `index` w nagłówkach?
2. **Zakres „Doświadczenia” na home.** Pełny `PanelAlphaFeature` (z listą zakresu) zamiast `compact`;
   czy punkt o cPanel/Plesk/DirectAdmin/PowerDNS z p. 7 zastępuje obecne sformułowanie z `:347`?
3. **Engine.** Usunąć `projects.openSource` całkiem (i przepisać `CvView`, `ProjectsView`,
   `homePreview`), czy zostawić kartę na `/projects`? Jeden link „commity `skostecki` (konto firmowe)”
   czy per punkt (`SourceRef`)? Jeśli per punkt, popraw czwarty link na `3cceed2`.
4. **Teasery.** Nowe pole `proves` w `Project` i obu locale; stack (tagi) w teaserze czy tylko
   nazwa + linia; czy teaser Skarbnika linkuje też do GitHuba, skoro repo jest publiczne.
5. **Skarbnik: „Repozytorium prywatne”.** Poprawić notę i dodać link do repo w tej zmianie czy osobno
   (stan faktyczny: repo publiczne, `pl.json:438`).
6. **Literały liczbowe** w pełnych kartach i w CV (`pl.json:434-435,458`): czyścić w tej zmianie czy zostawić
   poza zakresem.
7. **`usedIn`:** tekst czy linki; co z wpisami bez publicznego dowodu (PanelAlpha, moduły WHMCS);
   czy `usedIn` także na home; czy poprawić Menu Maker (Laravel 12).
8. **Migracja client area** (p. 7, wymaga zgody pracodawcy): domyślnie pomijamy, zgoda nadal otwarta.
9. **„Konto firmowe”**: dopisek tylko z deklaracji autora, bez potwierdzenia w API GitHub.
