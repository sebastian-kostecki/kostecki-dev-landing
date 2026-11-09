---
date: 2026-11-09T10:34:34+01:00
researcher: Claude Code (Sonnet 5.5)
git_commit: 5ecc004b4a2c2e47b821f27ab7c2223346ac0a85
branch: development
repository: kostecki-dev-landing
topic: "Porównanie development z design/hero-variants dla zakresu zmiany site-focus-hero"
tags: [research, codebase, SummaryPanel, career, DuotonePhoto, CvView, content-types, locale]
status: complete
last_updated: 2026-11-09
last_updated_by: Claude Code (Sonnet 5.5)
---

# Research: development vs design/hero-variants dla `site-focus-hero`

**Date**: 2026-11-09T10:34:34+01:00
**Researcher**: Claude Code (Sonnet 5.5)
**Git Commit**: 5ecc004 (HEAD `development`); gałąź `design/hero-variants` = 423456f
**Branch**: development
**Repository**: kostecki-dev-landing

## Research Question

Porównaj `development` z `design/hero-variants` dla plików z zakresu zmiany. Wypisz, co przenosimy
jeden do jednego, co wymaga adaptacji i jakie pola trzeba dodać w `src/types/content.ts` oraz
w obu plikach locale. Zakres zmiany: `context/foundation/site-focus.md` p. 4, 5, 7 oraz
`context/changes/site-focus-hero/change.md` (SummaryPanel, `career.ts`, DuotonePhoto, CvView, trasa
`/cv`, tytuł sekcji O mnie, link „Źródło” w stopce; bez CommitLog i skrótów klawiszowych).

## Summary

- Gałąź `design/hero-variants` to **jeden commit (423456f) na wierzchu obecnego `development`**
  (`git merge-base` = 5ecc004 = HEAD; `development` jest przodkiem gałęzi). Różnice są więc czyste,
  bez konfliktów historii; przenosimy wybrane pliki przez `git checkout design/hero-variants -- <plik>`
  albo ręcznie, nie przez merge (merge wciągnąłby 46 plików, w tym CommitLog i skróty).
- **Jeden do jednego (4 pliki + 1 trasa):** `src/content/career.ts`, `src/composables/useDuration.ts`
  (zależność `career.ts`), `src/components/ui/SummaryPanel.vue`, `src/components/hero/DuotonePhoto.vue`.
  `src/views/CvView.vue` także bez zmian kodu, ale z warunkiem: wymaga nowych pól typów i locale
  (poniżej).
- **Adaptacja (nie kopiować w całości):** `useContent.ts`, `router/index.ts`, `App.vue`,
  `SiteHeader.vue`, `SiteFooter.vue`, `ContactView.vue`, `HomeView.vue`, `HeroIntro.vue`, `main.css`,
  `types/content.ts`, `pl.json`, `en.json`.
- **Nie przenosimy:** `CommitLog.vue`, `useActivity.ts`, `activity.json`, `fetch-activity.mjs`,
  `useNavShortcuts.ts`, `ProductionStatus.vue`, `ProductTeaser.vue`, `SourceRef.vue`, zmiany
  `nav[].index` `"01"`→`"1"`, `<kbd>` w nagłówku, `hero.personal` oraz cała reszta z p. 6 spoza
  tej zmiany (fonty, ikony, sitemap, JSON-LD, nginx, `usedIn`, `highlightSources` itd.).
- **Link „Źródło” już istnieje** na `development` w stopce (`SiteFooter.vue:51-58`, etykieta
  `ui.siteSource` = „Kod strony”). Gałąź go nie zmienia (diff stopki to tylko `print:hidden`).
  Zmiana sprowadza się do zmiany etykiety w locale; nie ma potrzeby nowego pola ani komponentu.
- **Tytuł sekcji O mnie:** gałąź go **nie** zmienia (`"Jak pracuję"` także tam, `pl.json:126`
  na gałęzi). To nowa edycja, nie przeniesienie.

## Detailed Findings

### 1. Relacja gałęzi

- `git log development..design/hero-variants` zwraca dokładnie jeden commit:
  `423456f feat: recruiter-focused redesign with live commit log, CV page and audit fixes`.
- `git diff --stat development design/hero-variants` = 46 plików, +1779/−254 (stan sprawdzony 2026-11-09).
- `git status` na `development` pokazuje tylko untracked `context/`, `.claude/`, `CLAUDE.md`,
  `.10x-cli.json`; żadnych zmian w śledzonych plikach, więc `checkout <branch> -- <plik>` nie
  nadpisze niezatwierdzonej pracy w `src/`.

### 2. Przenosimy jeden do jednego

| Plik (gałąź → development) | Uwagi / zależności |
| --- | --- |
| `src/content/career.ts` (nowy, 8 linii) | `careerSince = { modulesGarden: '2022-11', panelAlpha: '2023-05' }`. Spójne z `site-focus.md` p. 7 (`{years:modulesGarden}`, `{years:panelAlpha}`). |
| `src/composables/useDuration.ts` (nowy, 54 l.) | Nie wymieniony wprost w zakresie, ale `career.ts` bez niego nie ma konsumenta: tokeny `{years:…}`/`{since:…}` rozwiązuje `resolveDurations`. Zależy tylko od `career.ts` i typu `Locale` z `useLocale` (istnieje). |
| `src/components/ui/SummaryPanel.vue` (nowy, 29 l.) | Czyta `content.summary.title` i `content.summary.items[]` (`label`, `value`, `href?`). Używa klas `.panel` (istnieje w `main.css:94`), `text-primary`, `text-muted-foreground`. Żadnych nowych klas CSS. |
| `src/components/hero/DuotonePhoto.vue` (nowy, 50 l.) | Wymaga **nowych klas CSS** `.duotone-img`, `.duotone-tint`, `.duotone-scan` z `main.css` gałęzi (tego samego bloku `@layer`). Bez `src` renderuje placeholder SVG (`id="duo-ph"`), z `src` zdjęcie. Props: `src?`, `alt?`, `placeholderLabel?`, `shape?`. |
| `src/views/CvView.vue` (nowy, 165 l.) | Kod 1:1, ale zależy od: nowych klas CSS (`.cv-section`, `.cv-heading`, `.cv-avoid-break`, `.cv-sheet` + blok `@media print`), pól `content.cv.*`, `content.summary.items`, `routes.cv` oraz `print:hidden` w nagłówku i stopce. Pozostałe pola, z których czyta (`projects.featured/openSource.context`, `projects.commercialGroup`, `projects.personal.items[].featured/highlights/links/tags`, `skills.core/categories`, `about.paragraphs`, `contact.methods`) **istnieją** na `development` (typy i oba locale; sprawdzone w `types/content.ts:28-80` i w pl/en). |

### 3. Wymaga adaptacji

- **`src/composables/useContent.ts`** (branch: +`resolveDurations` na `pl`/`en` przy ładowaniu modułu).
  Zmiana 1:1 jest bezpieczna; to ona uruchamia tokeny. Rozwiązanie następuje raz na załadowanie strony
  (komentarz w pliku gałęzi), nie przy zmianie dnia.
- **`src/router/index.ts`**: dodać import `CvView` i trasę `{ path: '/cv', name: 'cv', component: CvView }`
  przed `not-found` (2 linie, jak na gałęzi). Serwer: `docker/nginx.conf:6-7` na `development` ma
  `try_files … /index.html`, więc `/cv` działa bez zmian nginx (dowolna ścieżka w tym SPA dostaje
  `index.html`; prawdziwe 404 to osobny punkt p. 6 poza zakresem).
- **`src/App.vue`**: dodać gałąź `if (name === 'cv') return content.value.routes.cv` w `routeMeta`
  (`App.vue:~22`). **Nie** dodawać `useNavShortcuts` (import i wywołanie z gałęzi pominąć).
  Bez tej gałęzi `/cv` dostałby meta strony głównej (fallback `routes.home`).
- **`src/components/layout/SiteHeader.vue`**: na `development` link CV to `<a :href target="_blank">`
  w dwóch miejscach (desktop `:114`, mobile `:157`). Po ustawieniu `cv.href = "/cv"` otworzyłby trasę
  SPA w nowej karcie z pełnym przeładowaniem. Adaptacja: zamienić oba na `<RouterLink :to>` (jak gałąź)
  i (mobile) `@click="open = false"`; ikona `FileText` opcjonalna. **Pominąć** resztę diffu nagłówka:
  `<kbd>`, `aria-keyshortcuts`, `title` ze skrótem oraz zmianę `headerVisible`→`headerSolid` (audyt C1,
  osobna zmiana wg p. 6 — poza zakresem).
- **`src/views/ContactView.vue:33-40`**: ten sam problem (`<a :href target="_blank">` do `content.cv.href`).
  Gałąź tego pliku zmienia szerzej (przycisk kopiowania, `responseNote`); do tej zmiany wystarczy
  przestawić ten jeden link na `RouterLink`. Kopiowania e-maila **nie** przenosimy (kontakt = osobna zmiana,
  p. 10 pkt 3).
- **`src/components/layout/SiteFooter.vue`**: przenieść tylko `print:hidden` na `<footer>` (potrzebne dla
  druku `/cv`). Link „Źródło” już jest (patrz Summary).
- **`src/views/HomeView.vue`**: gałąź przebudowuje hero pod dwie kolumny (`HeroIntro` + `CommitLog`).
  Bez CommitLog drugiej kolumny nie ma. Do wzięcia: (a) wstawienie `<SummaryPanel />` w kontenerze pod
  sekcją hero (`px-4 sm:px-6 lg:px-8` → `mx-auto max-w-6xl`); (b) `DuotonePhoto` w `lg:col-span-4`
  sekcji O mnie, w `div.corner-frame mx-3 max-w-[11rem] sm:max-w-[15rem]` pod `SectionHeading`.
  Do pominięcia: `CommitLog`, `ProductTeaser`/`ownProducts` (zmiana `site-focus-experience`),
  przycisk CV w końcowym CTA (opcjonalny, nie wynika z p. 4/5/7).
- **`src/components/hero/HeroIntro.vue`** (nowy na gałęzi): wyodrębnia hero z `HomeView`. Nie jest na liście
  w `change.md`, ale hero ma się zmienić (p. 7), więc wybór: (A) przenieść `HeroIntro.vue` i usunąć z niego
  blok `<kbd>` (linie 63-66 gałęzi) oraz blok `hero.personal` (38-47); (B) zostawić hero inline w
  `HomeView`. Rekomendacja: (A), bo `HomeView` robi się krótszy, a plik jest niewielki. Do ustalenia
  w planie; patrz Open Questions.
  - Układ: grid gałęzi `lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]` bez drugiej kolumny jest zbędny.
    Wystarczy kontener `max-w-3xl` jak na `development` (`HomeView.vue:20`).
  - Przyciski: gałąź ma 3 (kontakt, projekty, CV); `site-focus.md` p. 7 podaje 2 CTA
    („Porozmawiajmy” `/contact`, „CV” `/cv`). Do decyzji, czy zostaje „Zobacz projekty”.
- **`src/assets/main.css`**: przenieść wybiórczo bloki: `.duotone-img`, `.duotone-tint`, `.duotone-scan`,
  `.corner-frame` (+ `::before/::after`), `.cv-section`, `.cv-heading` oraz końcowy `@media print`
  (`@page`, `body`, `.cv-sheet …`, `.cv-avoid-break`). **Pominąć**: `.kbd`, `.source-ref`, zmiany
  `--font-*` (fonty lokalne, p. 6/D1).
- **`index.html`**: bez zmian w tej zmianie (JSON-LD, fonty, `og:locale` = osobna zmiana).
- **`public/sitemap.xml`**: na `development` ma tylko `/` (`:4`); dodanie `/cv` należy do pracy nad sitemapą
  (p. 6/B3), poza zakresem — zapisać w planie jako świadomie pominięte.

### 4. Pola do dodania w `src/types/content.ts`

Zakres wymagany przez przenoszone pliki (kopiować z diffu gałęzi, ale tylko te):

1. `export interface SummaryItem { label: string; value: string; href?: string }`
2. `export interface CvCopy { title; intro; print; printHint; summaryTitle; experienceTitle; productsTitle; skillsTitle; contactTitle; generated }` (wszystkie `string`).
   - Uwaga: `cv.contactTitle` jest zdefiniowane na gałęzi, ale `CvView.vue` go **nie** używa
     (sprawdzone: brak odwołania w pliku). Można je pominąć w typie i w locale, albo zostawić
     dla spójności z gałęzią. Rekomendacja: pominąć (nie utrzymujemy martwego pola).
3. `SiteContent.routes.cv: RouteMetaCopy`.
4. `SiteContent.summary: { title: string; items: SummaryItem[] }`.
5. `SiteContent.cv`: z `{ href: string }` na `{ href: string } & CvCopy`.
6. `SiteContent.ui.photoPlaceholder: string` (potrzebne tylko dopóki zdjęcia nie ma; patrz Open Questions).

Pola z gałęzi, **których nie dodajemy**: `SkillItem.usedIn`, `Project.highlightSources`, `Project.ciRepo`,
`FeaturedProject.responsibilitySources`, `ui.sourceLabel/sourceTitle/ciLabel`, `ui.shortcutsHint/shortcutKey`,
`ui.log*`, `ui.status*`, `ui.copyEmail/copied`, `hero.personal`, `contact.responseNote`.

Ewentualne pole nowe (nie z gałęzi): tekst alternatywny zdjęcia, np. `about.photoAlt` — dopiero gdy będzie plik.

### 5. Zmiany w `src/content/pl.json` i `en.json` (oba pliki, wspólnie)

Zasada z `site-focus.md` p. 8: oba locale zmieniają się razem. Obecny stan `development` (sprawdzony):
`cv: { href: "" }`, brak `summary` i `routes.cv`, `ui.downloadCv` = „Pobierz CV”/„Download CV”,
`ui.siteSource` = „Kod strony”/„Site source”, `about.title` = „Jak pracuję”/„How I work”,
`about.index` = „01 / O mnie”/„01 / About”, `hero.label` = „Backend Developer / Laravel”.

| Klucz | Zmiana | Źródło treści |
| --- | --- | --- |
| `routes.cv.{title,description}` | dodać | gałąź (`pl.json` +27…): „CV — Sebastian Kostecki”, opis z „Wersja do druku i PDF” |
| `cv.href` | `""` → `"/cv"` | gałąź; włącza `hasCv` w `SiteHeader.vue:16` i `ContactView.vue:8` |
| `cv.{title,intro,print,printHint,summaryTitle,experienceTitle,productsTitle,skillsTitle,generated}` | dodać | gałąź, tekst 1:1 (PL i EN) |
| `ui.downloadCv` | „Pobierz CV”→„CV”; „Download CV”→„CV” | `site-focus.md` p. 7 (CTA „CV”); gałąź ma to samo |
| `ui.photoPlaceholder` | dodać „Zdjęcie” / „Photo” | gałąź |
| `summary.title` + `summary.items[6]` | dodać | gałąź jako baza, **ale z korektą wg p. 7** (tabela niżej) |
| `about.paragraphs[0]` | „Od 4 lat” → „Od {since:modulesGarden}” (EN: „For {years:modulesGarden}”) | gałąź; wymaga `useDuration` |
| `projects.featured.context.period` | „3,5+ roku” → `{years:panelAlpha}` (EN j.w.) | gałąź |
| `about.title` | „Jak pracuję” → „O mnie” (EN: „About me”) | `site-focus.md` p. 5 pkt 2; **nie** z gałęzi |
| `ui.siteSource` | „Kod strony” → „Źródło” (EN: „Source”) | `change.md`, `site-focus.md` p. 4/5/7; **nie** z gałęzi |
| `hero.label`, `hero.valueProp`, `hero.valuePropAccent`, `hero.subtitle` | przepisać wg p. 7 (PL; EN po zatwierdzeniu PL) | `site-focus.md` p. 7; gałąź **nie** zmienia tych pól (identyczne z `development`) |

Panel „W skrócie”: gałąź vs `site-focus.md` p. 7 (do rozstrzygnięcia w planie, bo to język rekrutera):

| Wiersz | Gałąź (PL) | `site-focus.md` p. 7 |
| --- | --- | --- |
| Rola | „Backend Developer (PHP / Laravel), ModulesGarden” | identycznie |
| Doświadczenie | „{years:modulesGarden} komercyjnie, w tym {years:panelAlpha} przy PanelAlpha” | identycznie |
| Stack | „PHP 8.5 · Laravel 13 · PostgreSQL / MySQL · Vue / React · Docker” | identycznie |
| Na produkcji | „…2 własne produkty na **moim** VPS-ie” | „…na **własnym** VPS-ie” |
| Praca z AI | „Claude Code i MCP w procesie **z kursu 10xDevs**” | „Claude Code i MCP, proces **z testami i review**” |
| Kontakt | `kontakt@kostecki.dev` + `mailto:` | identycznie (e-mail bez linku w tabeli, link w danych gałęzi — to zgodne) |

Rozbieżność w „Pracy z AI” jest merytoryczna: p. 7 i p. 8 mówią, że hero/panel używają języka
rekrutera, a „kurs 10xDevs” to język procesu. Rekomendacja: brać brzmienie z p. 7.

`hero.personal` (zdanie o księgach parafialnych) jest na gałęzi, ale `site-focus.md` p. 4 mówi
„Hero = tekst + panel + zdjęcie” i umieszcza zdanie osobiste w O mnie (p. 5 pkt 2; trzeci akapit
O mnie już je zawiera). Rekomendacja: nie przenosić `hero.personal`.

### 6. Zachowanie liczonych staży (sprawdzone obliczeniem)

Dla daty 2026-11-09 funkcja `yearsSince` z `useDuration.ts:5-10` daje:
`modulesGarden` (2022-11): 48 miesięcy → 4, `more=false` → PL „4 lata”, EN „4 years”;
`panelAlpha` (2023-05): 42 miesiące → 3,5, `more=false` → PL „3,5 roku”, EN „3.5 years”.
Zatem po przeniesieniu „3,5+ roku” (literał na `development`) zmienia się na „3,5 roku” (bez plusa),
bo plus pojawia się tylko gdy `more` jest prawdą **i** wartość nie jest całkowita
(`useDuration.ts:27`). Dla wartości całkowitych plus nie jest nigdy dodawany, np. 4 lata i 3 miesiące
pokaże „4 lata”. Jest to założenie kodu gałęzi, nie błąd tej zmiany, ale wpływa na test
regresji liczonych staży (patrz Open Questions).

## Code References

- `src/components/layout/SiteFooter.vue:51-58` (development) — istniejący link do repo landing, etykieta `ui.siteSource`.
- `src/components/layout/SiteHeader.vue:16,112-120,154-163` (development) — `hasCv` i `<a target=_blank>` do `cv.href`.
- `src/views/ContactView.vue:8,33-40` (development) — j.w.
- `src/views/HomeView.vue:15-43,60-68` (development) — hero inline i sekcja O mnie bez zdjęcia.
- `src/composables/useContent.ts:6-9` (development) — brak `resolveDurations`.
- `src/types/content.ts:136,151,161-171` (development) — `downloadCv`, `siteSource`, `hero`, `cv: { href }`.
- `src/App.vue:~19-25` (development) — `routeMeta` bez `cv`.
- `src/router/index.ts` (development) — brak trasy `/cv`; `docker/nginx.conf:6-7` ma SPA fallback.
- `design/hero-variants:src/components/ui/SummaryPanel.vue:1-29`, `…/hero/DuotonePhoto.vue:1-50`,
  `…/views/CvView.vue:1-165`, `…/composables/useDuration.ts:1-54`, `…/content/career.ts:1-8`.
- `design/hero-variants:src/assets/main.css` — bloki `.duotone-*`, `.corner-frame`, `.cv-*` i `@media print`.
- `design/hero-variants:src/content/pl.json` — `summary`, `cv`, `routes.cv`, `ui.photoPlaceholder`.

## Architecture Insights

- Treść jest statycznym JSON-em wybieranym po locale (`useContent`), typowanym jednym interfejsem
  `SiteContent`; nowe pola wymagają równoległej zmiany typu i obu JSON-ów, tak jak mówi
  `site-focus.md` p. 8. Wymuszenia przy buildzie: `vue-tsc --build` w `pnpm build` (cast `pl as SiteContent`
  w `useContent.ts` **nie** wykryje brakującego pola w JSON, bo `as` jest rzutowaniem — brakujące klucze
  wychwyci dopiero użycie w szablonie lub test).
- `/cv` czyta wyłącznie istniejące dane (bez własnej treści), dzięki czemu nie ma drugiego źródła prawdy.
- Projekt nie ma frameworka testowego (`package.json` na `development`: brak `vitest`/`playwright`,
  skrypty tylko `type-check`, `lint`, `format`). Pierwszy test regresji dla staży/tokenów
  wymaga wprowadzenia runnera (decyzja do planu; `CLAUDE.md` żąda testu najpierw przy bugfixach,
  ta zmiana jest funkcją, ale `yearsSince`/`polishYears` to czysta logika nadająca się do testu).

## Historical Context (from prior changes)

- `context/foundation/site-focus.md` p. 6 wskazuje dokładnie te elementy do przeniesienia i listę
  „nie przenosimy” (`CommitLog.vue`, `useNavShortcuts.ts`, `ProductionStatus.vue`); wynik tego researchu
  jest z nią zgodny.
- `context/site-audit-2026-11.md` (A5, A6): CV jako strona do druku i liczone staże — cele przenoszonych
  elementów. Nie czytano go w tym badaniu poza odwołaniami z `site-focus.md`; nie weryfikowano treści audytu.
- `context/changes/`: tylko ta zmiana; `context/archive/`: nie przeglądano pod kątem wcześniejszych decyzji
  o hero (brak potrzeby: zakres określa `site-focus.md`).

## Related Research

Brak innych `research.md` w `context/changes/**` (jedyna zmiana to `site-focus-hero`).

## Open Questions

1. **Tytuł O mnie:** `about.index` to już „01 / O mnie”; tytuł „O mnie” (propozycja z p. 5) zduplikuje
   etykietę. Zostawić propozycję czy dobrać inny (np. EN „About me” vs index „01 / About”)? Decyzja
   treściowa dla planu.
2. **`HeroIntro.vue` osobno czy inline** (rekomendacja: osobno, bez `<kbd>` i `personal`).
3. **Liczba CTA w hero:** 2 wg p. 7 czy 3 jak na gałęzi.
4. **Zdjęcie:** pliku nie ma (p. 9). Z `src` puste `DuotonePhoto` pokazuje na produkcji sylwetkę
   i podpis „Zdjęcie”. Czy wdrażać placeholder, czy ukryć slot do czasu dostarczenia pliku? Jeśli
   zdjęcie przyjdzie w tej zmianie: potrzebny `alt` (nowe pole) i plik w `public/assets/`.
5. **Treść panelu „Praca z AI”** i „własnym”/„moim” VPS-ie (tabela w p. 5): potwierdzić brzmienie z p. 7.
6. **Plus przy stażu** (p. 6): zostawić zachowanie `useDuration` czy dodać plus także dla wartości
   całkowitych; wpływa na to, co ma sprawdzać test.
7. **Test staży:** wprowadzić `vitest` w tej zmianie, czy zmiana kończy się weryfikacją
   `type-check` + `lint` + ręcznie `/cv`? (`CLAUDE.md` wymaga czerwonego testu przy bugach; tu nowa funkcja.)
8. **Repo landing publiczne?** Link „Źródło” ma sens tylko dla publicznego repo; nie udało się tego
   zweryfikować (`gh repo view --json visibility` zwróciło „Unknown JSON field”). Do sprawdzenia ręcznie
   (`gh repo view sebastian-kostecki/kostecki-dev-landing`) przed wdrożeniem.
9. **Sitemap `/cv`** i `llms.txt`: poza zakresem; zapisać w planie jako świadome pominięcie.
