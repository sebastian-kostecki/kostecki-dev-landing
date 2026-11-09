# Hero i panel „W skrócie” dla rekrutera — Plan Brief

> Full plan: `context/changes/site-focus-hero/plan.md`
> Research: `context/changes/site-focus-hero/research.md`

## What & Why

Rekruter ma 15 sekund: rola, staż, stack, pracodawca, CV, kontakt (`site-focus.md` p. 1).
Dzisiejsze hero mówi „Buduję i rozwijam produkcyjne aplikacje backendowe w PHP” — bez stażu,
produktu i pracodawcy, bez CV. Zmiana daje hero i panel „W skrócie” w języku ogłoszenia o pracę,
staże liczone z dat (koniec literałów, audyt A6) i stronę `/cv` do druku (audyt A5).

## Starting Point

Hero inline w `HomeView.vue`, dwa literały staży w obu locale, `cv.href = ""` (przyciski CV ukryte),
tytuł O mnie „Jak pracuję”, brak runnera testów. Gałąź `design/hero-variants` (jeden commit nad
`development`) ma gotowe `SummaryPanel`, `career.ts` + `useDuration.ts`, `DuotonePhoto`, `CvView` —
przenosimy je wybiórczo, bez merge.

## Desired End State

Hero w dwóch kolumnach: „Od 4 lat rozwijam produkcyjny produkt B2B: PanelAlpha w ModulesGarden.”,
podtytuł z p. 7, CTA „Porozmawiajmy” i „CV”, obok panel z sześcioma wierszami. O mnie z tytułem
„Kim jestem” i duotone'owym placeholderem zdjęcia. `/cv` drukuje się jako czysty arkusz. Stopka:
„Źródło”. `pnpm test` pilnuje staży i spójności locale.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Co przenieść z gałęzi | SummaryPanel, career/useDuration, DuotonePhoto, HeroIntro, CvView; bez CommitLog, skrótów, `hero.personal` | Zgodne z p. 4/6; reszta gałęzi należy do innych zmian | Research |
| Brzmienie panelu | Wg p. 7 („własnym VPS-ie”, „proces z testami i review”) | Hero i panel mówią językiem rekrutera, nie kursu (p. 8) | Research |
| Token w nagłówku | `{since:modulesGarden}` zamiast `{years:…}` ze szkicu p. 7 | Po „Od” potrzebny dopełniacz: „Od 4 lat” | Plan |
| CTA w hero | Dwa: „Porozmawiajmy”, „CV” | Dokładnie p. 7; projekty zostają w nawigacji | Plan |
| Miejsce panelu | Prawa kolumna hero (desktop), pod tekstem (mobile) | Panel widoczny bez scrolla w 15-sekundowym skanie | Plan |
| Zdjęcie | Placeholder duotone na produkcji do czasu pliku | Wybór użytkownika: układ finalny od razu | Plan |
| Tytuł O mnie | Index bez zmian „01 / O mnie”, tytuł „Kim jestem” / „Who I am” | Konwencja „NN / Kategoria” + opisowy tytuł jak w pozostałych sekcjach, bez duplikatu i bez kolizji z sekcją AI | Plan review F2 |
| „+” przy stażu | Nigdy | Zaokrąglenie w dół już znaczy „co najmniej”; jedna spójna reguła | Plan |
| Testy | Vitest: staże + spójność kluczy PL/EN + brak nierozwiązanych tokenów | `as SiteContent` nie łapie brakującego klucza ani literówki tokena | Plan |
| `ui.viewMyWork` | Usunąć z typów i locale | Bez trzeciego CTA nie ma konsumenta | Plan |
| `cv.contactTitle` | Pominąć | `CvView` go nie używa | Research |

## Scope

**In scope:**
- Vitest, `career.ts`, `useDuration.ts` (bez „+”), tokeny staży w treści
- Nowa treść hero PL + EN, `HeroIntro`, układ dwukolumnowy, `SummaryPanel`
- `DuotonePhoto` (placeholder) w O mnie, tytuł O mnie, etykieta „Źródło”
- `/cv`: widok, trasa, meta, styl druku, `print:hidden`, linki CV jako `RouterLink`

**Out of scope:**
- CommitLog, skróty klawiszowe, `hero.personal`, trzeci CTA
- Prawdziwe zdjęcie i pole `src`/`alt`
- Teasery produktów, `usedIn`, źródła, kopiowanie e-maila (`site-focus-experience`)
- Sitemap, JSON-LD, `llms.txt`, prerender, `headerSolid`, fonty lokalne

## Architecture / Approach

Treść to statyczny JSON per locale typowany `SiteContent`. Tokeny `{years:key}` / `{since:key}`
rozwiązuje `resolveDurations` raz przy imporcie `useContent` na podstawie dat z `career.ts`.
`/cv` czyta wyłącznie istniejące dane (panel, projekty, skills, kontakt) — jedno źródło prawdy.
Przyciski CV istnieją od fazy 2, ale włącza je dopiero `cv.href = "/cv"` w fazie 3.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Liczone staże, test-first | Vitest, logika staży, tokeny w treści | Zgodność wersji Vitest z Vite 8 |
| 2. Hero, panel, O mnie, stopka | Nowe hero dla rekrutera, panel, placeholder zdjęcia | Długi nagłówek w węższej kolumnie |
| 3. Strona `/cv` | CV do druku, linki CV w SPA | Styl druku w różnych przeglądarkach |

**Prerequisites:** gałąź `design/hero-variants` dostępna lokalnie; czyste drzewo w `src/`.
**Estimated effort:** ~1-2 sesje, 3 fazy.

## Open Risks & Assumptions

- Tekst EN hero i panelu to tłumaczenie z planu; p. 7 zakładał EN po zatwierdzeniu PL — do przejrzenia przy fazie 2.
- Placeholder z podpisem „Zdjęcie” będzie widoczny na produkcji, dopóki nie przyjdzie plik (świadomy wybór).
- Staż rozwiązywany przy ładowaniu strony z dokładnością do miesiąca; bez prerenderu parser ATS go nie zobaczy.

## Success Criteria (Summary)

- Rekruter widzi rolę, staż, produkt, pracodawcę, stack, kontakt i CV bez scrollowania (desktop).
- Na stronie nie ma żadnego literału stażu; testy pilnują odmiany i spójności locale.
- `/cv` drukuje się do PDF jako czysty arkusz, a linki CV działają w tej samej karcie.
