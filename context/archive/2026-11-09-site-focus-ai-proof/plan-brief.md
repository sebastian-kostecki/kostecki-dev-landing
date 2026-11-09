# Sekcja „Praca z agentami AI” z dowodami z archiwów — Plan Brief

> Full plan: `context/changes/site-focus-ai-proof/plan.md`

## What & Why

Tech lead, który poświęca stronie 3 minuty, ma zobaczyć dowód procesu pracy z agentami, a nie deklarację (`site-focus.md` p. 1, 3.2, 4). Sekcja AI dostaje pięć ręcznie wybranych zmian z archiwów Root Keepera i Skarbnika (każda z jednym zdaniem „co pokazuje” i linkiem) oraz licznik wszystkich zarchiwizowanych zmian, liczony przy buildzie, żeby żadna liczba w treści się nie starzała.

## Starting Point

`AiWorkflowSection.vue` pokazuje dziś nagłówek, cztery kroki i zamknięcie, treść jest w `aiWorkflow` w `pl.json`/`en.json`. Na `development` nie ma skryptów build-time ani `src/generated/`. Wzór (`fetch-activity.mjs`) jest na `design/hero-variants`. Archiwa mają 71 + 50 = 121 folderów. Research ma 75 z nich, przegląd 105, plan 114.

## Desired End State

Sekcja pokazuje kolejno: lead, pięć zmian z etykietą bez daty i linkiem, licznik (liczba z buildu plus linki do obu archiwów), cztery kroki i zamknięcie, w PL i EN. Build pobiera liczbę z GitHub API. Bez sieci używa ostatniego wyniku albo śledzonego fallbacku i głośno to loguje. Przerywa się, gdy link do wybranej zmiany prowadziłby do nieistniejącego folderu.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| --- | --- | --- |
| Wybór 5 zmian | Lista z p. 7, para backup to jedna pozycja z linkiem do `restore-from-backup` | Każda pozycja to inny rodzaj dowodu (dane prod, odtwarzanie, autoryzacja, CI, domena), a `restore-from-backup` ma test odtwarzania w CI. |
| Brzmienie leadu i licznika | Prawdziwe: „folder z dokumentacją”, licznik „Zarchiwizowane zmiany w dwóch publicznych repozytoriach”, poprawione też zdanie w kroku 2 | „Każda ma research, plan i przegląd” nie wytrzymuje kliknięcia (research 75/121, dwie z wybranych mają tylko plan). |
| Snapshot vs `git pull` na VPS | Wynik gitignorowany, śledzony `archive.fallback.json`, kolejność: świeży → poprzedni lokalny → fallback | Build nie brudzi drzewa, więc deploy (`git pull` → `pnpm build`) nie wywróci się, a repo infra zostaje bez zmian. |
| Brakujący wybrany folder | Przerwanie builda (tylko gdy pobranie się udało) | Martwy link do dowodu nie trafi na produkcję. |
| Forma licznika | Etykieta plus liczba zamiast zdania z liczbą | Omija polską odmianę (121 zmian / 122 zmiany) bez kluczy plural w obu locale. |
| Etykieta bez daty | Wyprowadzona z URL (odcięty `YYYY-MM-DD-`) | Etykieta i link nie mogą się rozjechać. |

## Scope

**In scope:**
- `scripts/lib/archive-count.mjs` i `scripts/fetch-archive-count.mjs` z testami
- fallback i `.gitignore`, wpięcie w `dev`/`build`, nota w README
- typy, treść PL+EN (lead, 5 pozycji, licznik, korekta zdania w kroku 2)
- blok w `AiWorkflowSection.vue`, testy treści

**Out of scope:**
- liczenie tylko „pełnych” folderów, daty w etykietach i przy liczniku
- `CommitLog`/`useActivity` z `hero-variants`
- zmiany w repo infra, prerender, E2E
- zmiany kroków 1, 3, 4, zamknięcia i tokenów

## Architecture / Approach

`fetch-archive-count.mjs` (build-time, Node) najpierw parsuje wybrane URL-e z `pl.json`/`en.json`. Błąd treści to `exit 1`. Potem pobiera `contents/context/archive` obu repo („wszystko albo nic”), liczy katalogi, sprawdza wybrane foldery i zapisuje `src/generated/archive.json`. Komponent importuje `total` z tego pliku, a pięć pozycji i etykiety czyta z treści. `archiveFolderLabel()` to czysta funkcja w `src/content/archive-proof.ts`.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Licznik archiwum i strażnik linków (test-first) | Testowana logika, skrypt z fallbackami, wpięcie w build | Pomylenie błędu treści z błędem sieci, które dałoby cichy fallback zamiast przerwania |
| 2. Sekcja w UI i treść | Pięć zmian, licznik i poprawiony krok 2 na `/` w PL i EN | Kopia „co pokazuje” przesadzająca względem zawartości folderu |

**Prerequisites:** sieć do GitHub API przy implementacji (fallback generowany z żywych danych). Oba repo publiczne, token nie jest potrzebny.
**Estimated effort:** ~1 sesja, 2 fazy.

## Open Risks & Assumptions

- Zakładamy, że archiwa w Root Keeperze i Skarbniku są niezmienne. Zmiana nazwy folderu zablokuje deploy landingu do czasu poprawki treści (świadoma decyzja).
- Samodzielne `pnpm type-check` na świeżym clonie wymaga wcześniej `pnpm generate:archive` (nota w README).
- Gdy GitHub zwróci 404 dla przeniesionego archiwum, build przejdzie na fallback z ostrzeżeniem. Liczba przestanie rosnąć, ale nie zniknie.

## Success Criteria (Summary)

- Tech lead w PL i EN widzi pięć klikalnych zmian bez dat i aktualny licznik, a każde zdanie sekcji zgadza się z zawartością folderów.
- `pnpm build` działa bez sieci, a na martwym linku do dowodu się przerywa.
- Deploy na VPS nie zostawia zmienionych śledzonych plików.
