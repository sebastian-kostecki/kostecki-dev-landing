# Sekcja „Praca z agentami AI” z dowodami z archiwów — plan implementacji

## Overview

Sekcja AI na stronie głównej dostaje główny dowód z `site-focus.md` p. 4 i 7: pięć ręcznie wybranych zmian z archiwów Root Keepera i Domowego Skarbnika (etykieta bez daty, jedno zdanie „co pokazuje”, link do folderu) oraz licznik wszystkich zarchiwizowanych zmian w obu repo, liczony przy buildzie z fallbackiem. Cztery kroki procesu i zamknięcie zostają. Obsługuje odbiorcę 2 (tech lead, 3 minuty): każde twierdzenie ma klikalny dowód.

## Current State Analysis

- `src/components/ui/AiWorkflowSection.vue:13-51` renderuje `SectionHeading` (index/title/subtitle), listę 4 kroków i zdanie zamknięcia. Komponent jest wpięty w `src/views/HomeView.vue:44`.
- Treść jest w `aiWorkflow` w `src/content/pl.json:144-183` i `src/content/en.json` (te same klucze). Typy są w `src/types/content.ts:65-77` (`AiWorkflowStep`, `AiWorkflow`).
- `src/content/__tests__/locales.spec.ts` wymaga identycznych ścieżek kluczy w PL i EN. Vitest (`vitest.config.ts`) zbiera tylko `src/**/__tests__/*.spec.ts`, środowisko `node`.
- Na `development` nie ma `scripts/fetch-*` ani `src/generated/`. Wzór jest na gałęzi `design/hero-variants`: `scripts/fetch-activity.mjs` (GitHub API, timeout 15 s, opcjonalny `GITHUB_TOKEN`, zapis JSON, przy błędzie zostawia snapshot, bez snapshotu `exit 1`). W `package.json` tej gałęzi `build` = `run-s generate:… "build:app {@}" --`.
- Deploy (`kostecki-dev-infra/scripts/deploy-landing.sh`) robi kolejno `git pull` i `pnpm install --frozen-lockfile && pnpm build` na VPS, z `set -euo pipefail`. Śledzony plik nadpisywany przez build brudzi drzewo na VPS, a następny `git pull` padnie, gdy ten plik zmieni się w repo.
- Archiwa (stan 2026-11-09, oba repo publiczne, gałąź `main`): Root Keeper ma 71 folderów, Skarbnik 50, razem 121. Plus `README.md` w każdym archiwum. Zawartość: `plan.md` w 114 ze 121, `reviews/` w 105, `research.md` w 75.
- Kandydaci z p. 7: `production-data-safety` i `e2e-in-ci` mają tylko `change.md`, `plan-brief.md`, `plan.md`. `restore-from-backup`, `testing-backup-restore`, `testing-ownership-boundaries` i `import-category-suggestions` mają research i przeglądy.
- Krok 2 sekcji („Każda zmiana ma własny folder z researchem, planem i przeglądem implementacji”) twierdzi coś, czego dane nie potwierdzają.

## Desired End State

Na `/` sekcja „Praca z agentami AI” pokazuje kolejno:
1. nagłówek i podtytuł jak dziś,
2. lead,
3. listę pięciu zmian (etykieta `Projekt / slug-bez-daty` jako link do folderu na GitHubie, pod nią zdanie „co pokazuje”),
4. licznik: duża liczba z buildu plus etykieta i linki do obu archiwów,
5. cztery kroki (krok 2 z poprawionym zdaniem),
6. zamknięcie.

Oba locale wyglądają tak samo, liczba jest ta sama.

Build:
- `pnpm build` (i `pnpm dev`) najpierw uruchamia `scripts/fetch-archive-count.mjs`. Skrypt zapisuje gitignorowany `src/generated/archive.json`.
- Bez sieci build przechodzi na ostatnim lokalnym wyniku albo na śledzonym `src/generated/archive.fallback.json` i głośno to loguje.
- Gdy pobranie się udało, a któryś wybrany folder nie istnieje w archiwum, build kończy się błędem z nazwą folderu.

Weryfikacja: `pnpm test`, `pnpm type-check`, `pnpm lint`, `pnpm build`, ręczny przegląd w przeglądarce, symulacja braku sieci.

### Key Discoveries:

- `AiWorkflowSection.vue:23-45`: wzorzec linku zewnętrznego (`target="_blank"`, `rel="noopener noreferrer"`, `ArrowUpRight`, klasy `font-mono text-xs text-primary`). Używamy go dla linków w nowym bloku.
- `src/content/career.ts` i `useDuration.ts`: dane niezależne od języka trzymamy w TS, tekst w locale JSON. Liczba z buildu jest danymi, więc nie wchodzi do JSON-ów treści.
- `tsconfig.app.json` ma `resolveJsonModule`, więc import `@/generated/archive.json` jest typowany z kształtu pliku. Plik musi istnieć przed `vue-tsc`.
- `tsconfig.node.json` obejmuje tylko pliki configów. Skrypty `.mjs` nie są dziś sprawdzane typami.
- `engines.node` to `^20.19.0 || >=22.12.0`, więc skrypt musi być czystym JS (bez type-strippingu TS).
- Etykiety bez daty: nazwy folderów mają prefiks `YYYY-MM-DD-`. Etykieta wyprowadzona z URL nie rozjedzie się z linkiem.
- Licznik w formie „etykieta + liczba” omija polską odmianę („121 zmian” / „122 zmiany”), więc nie trzeba `Intl.PluralRules` ani kluczy plural, które w EN byłyby sztucznymi duplikatami.

## What We're NOT Doing

- Nie liczymy tylko „pełnych” folderów (z planem i przeglądem). Licznik obejmuje wszystkie foldery w `context/archive`.
- Nie pokazujemy dat: ani w etykietach, ani daty snapshotu licznika (p. 4, p. 8).
- Nie przenosimy `CommitLog.vue`, `useActivity.ts` ani `fetch-activity.mjs` z `design/hero-variants`, bierzemy tylko wzorzec.
- Nie zmieniamy repo infra ani `deploy-landing.sh`.
- Nie zmieniamy pozostałych kroków (1, 3, 4), zamknięcia, podtytułu ani tokenów w `main.css`.
- Nie dodajemy prerenderu ani testów E2E (osobne zmiany z p. 10).
- Nie pokazujemy `testing-backup-restore` jako osobnej pozycji. Para backup to jedna pozycja z linkiem do `restore-from-backup`.

## Implementation Approach

Faza 1 test-first buduje czystą logikę (liczenie, wyciąganie wybranych folderów z treści, wykrywanie braków), a na niej skrypt z kolejnością fallbacków i wpięciem w `dev`/`build`. Bez wybranych pozycji w treści strażnik nie ma czego sprawdzać, więc faza 1 działa samodzielnie. Faza 2 dodaje typy, treść w obu locale, blok w komponencie i testy treści. Strażnik od razu sprawdza te pięć linków przy pierwszym buildzie.

## Critical Implementation Details

- **Błąd treści ≠ błąd sieci.** Wybrane foldery z `pl.json`/`en.json` parsuj **przed** blokiem pobrania i poza jego `catch`. Nieprawidłowy URL w treści albo rozbieżność PL/EN musi przerwać build. Nie może skończyć się cichym przejściem na fallback.
- **Wszystko albo nic.** Jeśli jedno z dwóch repo nie odpowie, nie zapisuj częściowej sumy. Całe pobranie traktuj jako nieudane i przejdź na fallback.
- **Kolejność fallbacków:** świeży wynik → istniejący `src/generated/archive.json` (np. z poprzedniego buildu na VPS) → kopia `archive.fallback.json` → `exit 1`. Każde przejście na fallback loguje `console.warn` z oryginalnym błędem (zasada „nigdy nie ukrywaj dowodów”). Bez sieci strażnik linków jest pomijany z ostrzeżeniem.
- **Świeży clone:** `vue-tsc` wymaga istnienia `src/generated/archive.json`. `build` i `dev` uruchamiają skrypt jako pierwszy krok. Samodzielne `pnpm type-check` na świeżym clonie wymaga wcześniej `pnpm generate:archive` (dopisać do README).

## Faza 1: Licznik archiwum i strażnik linków (test-first)

### Overview

Czysta logika z testami (najpierw czerwonymi), potem skrypt build-time z fallbackami, gitignore, śledzony fallback i wpięcie w skrypty `package.json`.

### Changes Required:

#### 1. Testy logiki (najpierw czerwone)

**File**: `scripts/__tests__/archive-count.spec.ts`

**Intent**: Zapisuje zachowanie logiki, zanim powstanie implementacja. Test musi być czerwony przed punktem 2.

**Contract**: Przypadki:
- `countArchiveFolders`: liczy tylko wpisy `type: "dir"` (ignoruje `README.md` i inne pliki). Rzuca błąd, gdy odpowiedź nie jest tablicą (np. API zwróciło obiekt pliku albo komunikat błędu).
- `selectedArchiveFolders(content)`: z `aiWorkflow.proof.items[].url` zwraca `{ repo, folder }`. Rzuca błąd dla URL-a, który nie pasuje do `https://github.com/<owner>/<repo>/tree/main/context/archive/<folder>` albo wskazuje repo spoza listy archiwów. Dla treści bez `proof` zwraca `[]`.
- `missingFolders(selected, listings)`: zwraca wybrane pozycje, których folderu nie ma w listingu danego repo, a dla kompletu pustą listę.
- Rozbieżność wybranych folderów między PL i EN to błąd (osobna funkcja albo przypadek w `selectedArchiveFolders` na obu słownikach, do wyboru przy implementacji).

#### 2. Czysta logika

**File**: `scripts/lib/archive-count.mjs`

**Intent**: Funkcje z punktu 1 bez I/O, z JSDoc, oraz stała `ARCHIVE_REPOS = ['sebastian-kostecki/root-keeper', 'sebastian-kostecki/household-treasurer']`.

**Contract**: Eksporty `ARCHIVE_REPOS`, `countArchiveFolders`, `selectedArchiveFolders`, `missingFolders` (plus ewentualnie funkcja porównania PL/EN). Czysty ESM bez zależności.

#### 3. Skrypt build-time

**File**: `scripts/fetch-archive-count.mjs`

**Intent**: Wzorem `fetch-activity.mjs` (helper `github()` z nagłówkami, `User-Agent: kostecki-dev-build`, opcjonalnym `GITHUB_TOKEN`, `AbortSignal.timeout(15000)`) pobiera `GET /repos/<repo>/contents/context/archive` dla obu repo, liczy foldery, sprawdza wybrane foldery i zapisuje wynik. Kolejność i rozdzielenie błędów są opisane w „Critical Implementation Details”.

**Contract**:
- Wyjście `src/generated/archive.json`: `{ "generatedAt": ISO, "total": number, "repos": [{ "repo": "owner/name", "count": number }] }`.
- Zmienna `ARCHIVE_GITHUB_API` (domyślnie `https://api.github.com`) pozwala zasymulować brak sieci w weryfikacji ręcznej.
- Kody wyjścia: `0` dla sukcesu i fallbacku, `1` dla brakującego wybranego folderu, błędnej treści albo braku jakiegokolwiek źródła liczby.

#### 4. Fallback i gitignore

**Files**: `src/generated/archive.fallback.json`, `.gitignore`

**Intent**: Śledzony fallback w tym samym kształcie co wynik, wygenerowany skryptem w dniu implementacji, z liczbą z tego dnia. `src/generated/archive.json` trafia do `.gitignore`, żeby build nie brudził drzewa (problem `git pull` na VPS).

**Contract**: `.gitignore` ignoruje tylko `src/generated/archive.json`, a fallback jest śledzony.

#### 5. Skrypty npm, konfiguracja testów i typów, README

**Files**: `package.json`, `vitest.config.ts`, `tsconfig.node.json`, `README.md`

**Intent**:
- `package.json`: `generate:archive` = `node scripts/fetch-archive-count.mjs`. `build` uruchamia go przed obecnym `run-p type-check build-only` (wzór z `hero-variants`: `build` = `run-s generate:archive "build:app {@}" --`, a `build:app` to dzisiejsza treść `build`). `dev` = `run-s generate:archive "dev:app {@}" --`, a `dev:app` = `vite` (argumenty typu `pnpm dev --host` przechodzą dalej). Strażnik blokuje też `dev` (ten sam kontrakt co build: literówka w URL-u wybranej zmiany przy działającej sieci kończy się `exit 1`).
- Vitest zbiera też `scripts/__tests__/*.spec.ts`.
- Testy i `scripts/lib/*.mjs` są objęte `vue-tsc --build`. Proponowany sposób: dopisać je do `include` w `tsconfig.node.json` z `allowJs`/`checkJs`. Ważny jest efekt: `pnpm type-check` jest zielony i obejmuje nowe pliki.
- README: jedno zdanie o `pnpm generate:archive` przed samodzielnym `type-check` na świeżym clonie i o tym, że build bez sieci używa fallbacku.

**Contract**: `pnpm build` = generate → (type-check ∥ vite build). Nie polegamy na hookach `pre*` w pnpm, tylko na jawnym łańcuchu.

### Success Criteria:

#### Automated Verification:

- Testy logiki licznika są czerwone przed implementacją i zielone po niej: `pnpm test`
- Type-check przechodzi i obejmuje `scripts/lib` oraz `scripts/__tests__`: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- `pnpm generate:archive` zapisuje `src/generated/archive.json` z `total` równym sumie folderów obu archiwów
- `git status` po `pnpm build` nie pokazuje zmienionych plików w `src/generated/`

#### Manual Verification:

- `ARCHIVE_GITHUB_API=http://127.0.0.1:9 pnpm generate:archive` z istniejącym `archive.json` loguje ostrzeżenie z przyczyną i zostawia plik bez zmian (exit 0)
- To samo po usunięciu `src/generated/archive.json` kopiuje fallback i loguje ostrzeżenie (exit 0)
- `pnpm dev` po usunięciu `src/generated/archive.json` (stan świeżego clone'a) startuje bez ręcznego `generate:archive`, a `pnpm dev --host` przekazuje argument do `vite`

**Implementation Note**: Po przejściu weryfikacji automatycznej zatrzymaj się na potwierdzenie testów ręcznych przed fazą 2.

---

## Faza 2: Sekcja w UI i treść

### Overview

Typy, treść w obu locale (lead, pięć pozycji, licznik, korekta kroku 2), blok w `AiWorkflowSection.vue` i testy treści. Po tej fazie strażnik z fazy 1 sprawdza pięć prawdziwych linków przy każdym buildzie.

### Changes Required:

#### 1. Testy treści (najpierw czerwone)

**File**: `src/content/__tests__/ai-proof.spec.ts`

**Intent**: Pilnuje kontraktu sekcji niezależnie od kopii.

**Contract**:
- W obu locale `aiWorkflow.proof.items` ma dokładnie 5 pozycji.
- URL-e są identyczne w PL i EN, w tej samej kolejności.
- Każdy URL pasuje do wzorca folderu archiwum jednego z dwóch repo.
- `archiveFolderLabel(url)` zwraca slug bez prefiksu daty (np. `…/2026-10-01-restore-from-backup` → `restore-from-backup`), a żadna wyprowadzona etykieta nie zaczyna się od `\d{4}-`.
- `archiveLinks` w obu locale wskazują dwa archiwa.

`locales.spec.ts` bez zmian pilnuje parytetu kluczy.

#### 2. Typy

**File**: `src/types/content.ts`

**Intent**: Nowe pole `proof` w `AiWorkflow`.

**Contract**: `AiProofItem { project: string; url: string; shows: string }`. `AiProof { lead: string; items: AiProofItem[]; counterLabel: string; archiveLinks: ProjectLink[] }`. `AiWorkflow.proof: AiProof`.

#### 3. Etykieta z URL

**File**: `src/content/archive-proof.ts`

**Intent**: Czysta funkcja `archiveFolderLabel(url: string): string`, która bierze ostatni segment ścieżki i odcina prefiks `YYYY-MM-DD-`. Moduł nie importuje `src/generated/archive.json`, żeby testy działały bez uruchomionego skryptu.

**Contract**: Eksporty `archiveFolderLabel` i `ARCHIVE_FOLDER_URL` (regex folderu archiwum jednego z dwóch repo). `ai-proof.spec.ts` sprawdza wzorzec URL przez `ARCHIVE_FOLDER_URL`, bez własnej kopii regexu. Druga kopia w `scripts/lib/archive-count.mjs` jest świadoma: `tsconfig.vitest.json`/`tsconfig.app.json` nie mają `allowJs`, więc kod w `src/` nie importuje `.mjs`.

#### 4. Treść (oba locale)

**Files**: `src/content/pl.json`, `src/content/en.json`

**Intent**: Nowe `aiWorkflow.proof` plus korekta jednego zdania w kroku 2. EN to wierne tłumaczenie PL (oba locale zmieniają się razem, p. 8). Kopia poniżej to szkic do dopracowania przy implementacji. Twierdzenia muszą zostać prawdziwe względem folderów.

**Contract**: PL:
- `lead`: „Każda zmiana zostawia w repozytorium folder z dokumentacją. Kilka, które pokazują, jak to działa:”
- `items` (kolejność, `project`, folder, „co pokazuje”):
  1. Root Keeper, `2026-09-22-production-data-safety`: zasady pracy na danych produkcyjnych (szyfrowane kopie, backup przed migracją) ustalone, zanim powstał pierwszy feature.
  2. Root Keeper, `2026-10-01-restore-from-backup`: odtwarzanie z kopii jako przepływ testowany w CI, nie skrypt w szufladzie.
  3. Root Keeper, `2026-10-02-testing-ownership-boundaries`: granice własności danych między kontami sprawdzane testami.
  4. Root Keeper, `2026-10-22-e2e-in-ci`: Playwright wpięty w pipeline przy każdym PR, nie odpalany ręcznie.
  5. Domowy Skarbnik, `2026-11-04-import-category-suggestions`: podpowiedzi kategorii przy imporcie jako logika domenowa (model, ADR, testy), nie tylko UI. (Folder nie buduje samego importu, tylko dokłada podpowiedzi do istniejącego podglądu.)
- URL: `https://github.com/sebastian-kostecki/<repo>/tree/main/context/archive/<folder>`.
- `counterLabel`: „Zarchiwizowane zmiany w dwóch publicznych repozytoriach”.
- `archiveLinks`: „Root Keeper: archiwum” → `…/root-keeper/tree/main/context/archive`, „Domowy Skarbnik: archiwum” → `…/household-treasurer/tree/main/context/archive`.
- Krok 2 `body`: „Zmiana dostaje własny folder z dokumentacją: najczęściej plan, przy większych także research i przegląd implementacji. Po wdrożeniu trafia do archiwum.” Link kroku 2 („Archiwum zmian” → archiwum Root Keepera) zostaje mimo tego samego URL-a w `archiveLinks`. To świadoma decyzja, każdy krok ma swój dowód.

#### 5. Blok w sekcji

**File**: `src/components/ui/AiWorkflowSection.vue`

**Intent**: Między `SectionHeading` a listą kroków dochodzi:
- lead,
- lista `<ul>` pięciu pozycji: etykieta mono `project / archiveFolderLabel(url)` jako link zewnętrzny wg istniejącego wzorca, pod nią `shows`,
- licznik: liczba z `@/generated/archive.json` (`total`, sformatowana `Intl.NumberFormat` wg locale), `counterLabel` i oba `archiveLinks`.

Bez daty snapshotu. Kroki i zamknięcie bez zmian. Styl z istniejących klas (`panel`, `font-mono`, `text-primary`, `text-muted-foreground`), bez nowych tokenów.

**Contract**: Komponent czyta `content.aiWorkflow.proof` i `total` z wygenerowanego JSON-a. Lista jest semantyczna (`ul`/`li`), a linki mają `rel="noopener noreferrer"`.

#### 6. Dokument fundamentowy

**File**: `context/foundation/site-focus.md`

**Intent**: Dokument nie może przeczyć wdrożonej treści, bo kolejne zmiany z łańcucha (p. 10) z niego kopiują.

**Contract**:
- p. 3.2: bez literału liczby i bez „każda z researchem, planem i przeglądem”. Zamiast tego opis zgodny z danymi: każda zmiana ma folder z dokumentacją, licznik liczony przy buildzie.
- p. 7 „Praca z agentami AI”: lead i zdanie pozycji Skarbnika zgodne z wdrożoną kopią.
- p. 9: punkt „Ostateczny wybór 3–5 zmian” zamknięty z odesłaniem do tej zmiany.
- p. 11: wpis w dzienniku rewizji z datą wdrożenia.

### Success Criteria:

#### Automated Verification:

- Testy treści i parytet locale przechodzą: `pnpm test`
- Type-check przechodzi: `pnpm type-check`
- Lint przechodzi: `pnpm lint`
- `pnpm build` przechodzi, a strażnik nie zgłasza brakujących folderów dla pięciu pozycji
- Celowa literówka w jednym URL-u w `pl.json` i `en.json` przerywa `pnpm generate:archive` z nazwą folderu (exit 1, potem cofnąć)

#### Manual Verification:

- Na `/` w PL i EN sekcja pokazuje kolejno: lead, 5 pozycji bez dat, licznik z linkami do obu archiwów, 4 kroki, zamknięcie
- Każdy z 5 linków i oba linki archiwów otwierają właściwy folder na GitHubie
- Układ czytelny na szerokości telefonu i desktopu, bez poziomego scrolla, spójny z ciemnym motywem
- Licznik zgadza się z liczbą folderów widoczną na GitHubie

**Implementation Note**: Po przejściu weryfikacji automatycznej zatrzymaj się na potwierdzenie testów ręcznych.

---

## Testing Strategy

### Unit Tests:

- Logika licznika: tylko katalogi, odpowiedź nie-tablica, parsowanie URL-i (poprawny, obce repo, zły format), brak `proof`, brakujące foldery, rozbieżność PL/EN.
- Treść: 5 pozycji, identyczne URL-e PL/EN, wzorzec URL, etykiety bez dat, dwa linki archiwów.

### Integration Tests:

- `pnpm generate:archive` na żywym API (wynik zgodny z GitHubem) i z `ARCHIVE_GITHUB_API` wskazującym na martwy adres (ścieżki fallbacku).

### Manual Testing Steps:

1. `pnpm dev`, otwórz `/`, przełącz PL/EN i porównaj sekcję.
2. Kliknij każdy z 7 linków (5 pozycji i 2 archiwa).
3. Zasymuluj brak sieci z i bez `src/generated/archive.json`, sprawdź logi i exit code.
4. Celowa literówka w URL-u, `pnpm build` ma paść z nazwą folderu.

## Performance Considerations

Dwa żądania do GitHub API na build, bez tokena mieści się w limicie 60/h. Na stronie liczba jest statyczna, bez żądań w runtime.

## Migration Notes

Brak danych do migracji. Pierwszy deploy po zmianie: `git pull` na VPS przyniesie `.gitignore` i fallback, a build zapisze nieśledzony `archive.json`. Repo infra bez zmian.

## References

- Dokument fundamentowy: `context/foundation/site-focus.md` (p. 3.2, 4, 5, 7, 8)
- Wzorzec skryptu: `git show design/hero-variants:scripts/fetch-activity.mjs`, `git show design/hero-variants:package.json`
- Sekcja dziś: `src/components/ui/AiWorkflowSection.vue:13-51`, `src/content/pl.json:144-183`, `src/types/content.ts:65-77`
- Deploy: `kostecki-dev-infra/scripts/deploy-landing.sh`
- Poprzednia zmiana: `context/archive/2026-11-09-site-focus-hero/plan.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Licznik archiwum i strażnik linków (test-first)

#### Automated

- [x] 1.1 Testy logiki licznika są czerwone przed implementacją i zielone po niej: `pnpm test` — 788ab55
- [x] 1.2 Type-check przechodzi i obejmuje `scripts/lib` oraz `scripts/__tests__`: `pnpm type-check` — 788ab55
- [x] 1.3 Lint przechodzi: `pnpm lint` — 788ab55
- [x] 1.4 `pnpm generate:archive` zapisuje `src/generated/archive.json` z `total` równym sumie folderów obu archiwów — 788ab55
- [x] 1.5 `git status` po `pnpm build` nie pokazuje zmienionych plików w `src/generated/` — 788ab55

#### Manual

- [x] 1.6 Symulacja braku sieci z istniejącym `archive.json` zostawia plik i loguje ostrzeżenie z przyczyną — 788ab55
- [x] 1.7 Symulacja braku sieci bez `archive.json` kopiuje fallback i loguje ostrzeżenie — 788ab55
- [x] 1.8 `pnpm dev` na świeżym clonie startuje bez ręcznego `generate:archive` i przekazuje argumenty do `vite` — 788ab55

### Phase 2: Sekcja w UI i treść

#### Automated

- [x] 2.1 Testy treści i parytet locale przechodzą: `pnpm test`
- [x] 2.2 Type-check przechodzi: `pnpm type-check`
- [x] 2.3 Lint przechodzi: `pnpm lint`
- [x] 2.4 `pnpm build` przechodzi, a strażnik nie zgłasza brakujących folderów dla pięciu pozycji
- [x] 2.5 Celowa literówka w URL-u przerywa `pnpm generate:archive` z nazwą folderu

#### Manual

- [x] 2.6 Na `/` w PL i EN sekcja pokazuje lead, 5 pozycji bez dat, licznik z linkami, 4 kroki, zamknięcie
- [x] 2.7 Każdy z 5 linków i oba linki archiwów otwierają właściwy folder na GitHubie
- [x] 2.8 Układ czytelny na telefonie i desktopie, bez poziomego scrolla, spójny z ciemnym motywem
- [x] 2.9 Licznik zgadza się z liczbą folderów widoczną na GitHubie
