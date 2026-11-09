<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Sekcja „Praca z agentami AI” z dowodami z archiwów

- **Plan**: context/changes/site-focus-ai-proof/plan.md
- **Scope**: Full plan
- **Reviewed phases**: 1, 2
- **Date**: 2026-11-09
- **Verdict**: APPROVED
- **Findings**: 0 critical, 2 warnings, 4 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | PASS |
| Scope Discipline | PASS |
| Safety & Quality | WARNING |
| Architecture | PASS |
| Pattern Consistency | PASS |
| Success Criteria | PASS |

## Findings

### F1 — Uszkodzony `archive.json` przerywa łańcuch fallbacków

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: scripts/fetch-archive-count.mjs:69-84, 101
- **Detail**: `JSON.parse(existing).generatedAt` (l.72) i `JSON.parse(fallback)` (l.82) są poza try/catch. Obcięty `archive.json` (zapis `writeFile` w l.101 nie jest atomowy; zabity build lub pełny dysk) kończy skrypt nieobsłużonym `SyntaxError` zamiast przejść na śledzony fallback. Na VPS plik jest gitignorowany i przetrwa deploye, więc każdy kolejny build offline pada, dopóki ktoś go nie usunie. Plik o poprawnym JSON-ie, ale bez `total`, trafiłby na stronę jako `NaN`. Weryfikacja subagenta: `{bad` w `archive.json` + `ARCHIVE_GITHUB_API=http://127.0.0.1:9` → uncaught SyntaxError.
- **Fix**: Helper `readValidResult(path)` (parsuje, sprawdza `typeof total === 'number'` i `Array.isArray(repos)`; przy błędzie loguje `console.warn` z przyczyną i zwraca `null`, więc łańcuch idzie dalej), a zapis przez `archive.json.tmp` + `rename`.
  - Strength: Domyka łańcuch „świeży → istniejący → fallback → exit 1” z planu i nie ukrywa przyczyny.
  - Tradeoff: Kilkanaście linii w skrypcie, brak testu skryptu (logika walidacji można wynieść do `lib` i przetestować).
  - Confidence: HIGH — awaria odtworzona przez subagenta.
  - Blind spot: Nie sprawdzono zachowania `rename` na wolumenie VPS (ten sam katalog, więc nie powinno być problemu).
- **Decision**: FIXED via Fix (parseArchiveResult w lib + 6 testów, readResult/writeResult z atomowym zapisem w skrypcie; zweryfikowane symulacją uszkodzonego pliku offline i przebiegiem online)

### F2 — `github()` gubi treść i nagłówki limitu przy błędzie HTTP

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: scripts/fetch-archive-count.mjs:31-37
- **Detail**: Błąd to tylko `GitHub <path> answered 403 Forbidden`. „API rate limit exceeded” (limit 60/h bez tokena) jest nie do odróżnienia od złego tokena lub abuse detection, a ostrzeżenie o fallbacku jest jedynym śladem na VPS. Narusza zasadę „nie porzucaj przyczyn błędów”.
- **Fix**: Dołączyć do komunikatu pierwsze ~200 znaków `message` z body oraz `x-ratelimit-remaining` i `x-ratelimit-reset` (bez nagłówków z tokenem).
- **Decision**: FIXED via Fix (github() dołącza 200 znaków body i x-ratelimit-remaining/reset; zweryfikowane mockiem 403)

### F3 — Twierdzenie o `production-data-safety` jest naciągnięte

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: src/content/pl.json:154, src/content/en.json:154
- **Detail**: Kopia mówi, że zasady zostały „ustalone, zanim powstał pierwszy feature” / „set before the first feature existed”. Plan tego folderu mówi: „zanim na produkcję trafi prawdziwe drzewo”, a backupy z nocnych przebiegów od pierwszego deployu zawierają dane testowe. To „przed prawdziwymi danymi”, nie „przed pierwszym featurem”. Plan zmiany wymaga, by twierdzenia pozostały prawdziwe (tech lead kliknie w dowód).
- **Fix**: Zmienić na „…ustalone, zanim na produkcję trafiły prawdziwe dane” / „…set before real data reached production” w obu locale oraz w `site-focus.md` p. 7, jeśli cytuje to samo zdanie.
- **Decision**: FIXED via Fix (pl.json, en.json i site-focus.md p. 7: „…zanim na produkcję trafiły prawdziwe dane” / „…before real data reached production”)

### F4 — Mylący komunikat, gdy odpowiedź API nie jest tablicą

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: scripts/fetch-archive-count.mjs:92-97, scripts/lib/archive-count.mjs:59
- **Detail**: `missingFolders` działa przed `countArchiveFolders`. Dla `200 {"message":"x"}` build pada (exit 1, słusznie) z `TypeError: (listings[repo] ?? []).some is not a function`, a opisowy błąd „Expected the archive listing to be an array” nie pojawia się.
- **Fix**: Wywołać `countArchiveFolders` (walidacja kształtu) przed `missingFolders`.
- **Decision**: FIXED via Fix (countArchiveFolders przed missingFolders; zweryfikowane mockiem 200 z obiektem: exit 1 z opisowym błędem)

### F5 — Regex adresu folderu zduplikowany i przepuszcza `?` oraz `#`

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: src/content/archive-proof.ts:6-7, scripts/lib/archive-count.mjs:15
- **Detail**: Duplikacja jest świadoma (plan, nagłówek pliku), ale nic nie wiąże obu wzorców. Oba używają `[^/]+$`, więc przepuszczają `folder?plain=1` i `folder#x`; `archiveFolderLabel` pokazałby wtedy `x?plain=1`. Online strażnik zgłosi „folder not found”, offline i w testach nie ma sygnału.
- **Fix**: Zawęzić segment folderu do `[\w.-]+` w obu regexach i dodać w `ai-proof.spec.ts` przypadki odrzucane (`?`, `#`, ukośnik końcowy).
- **Decision**: FIXED via Fix (segment folderu `[\w.-]+` w obu regexach + testy odrzucające `?`, `#`, końcowy `/`, obce repo; strażnik nadal przechodzi dla 5 prawdziwych folderów)

### F6 — Linki zewnętrzne w nowym bloku bez sygnału dla czytników ekranu

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: src/components/ui/AiWorkflowSection.vue:44-52, 67-72
- **Detail**: Jedyną wskazówką otwarcia w nowej karcie jest ikona `ArrowUpRight` bez `aria-hidden`; licznik to dwa gołe `span`-y. Spójne z istniejącymi linkami kroków, więc to dług całej sekcji, nie regres.
- **Fix**: Dodać `aria-hidden="true"` do ikon w nowym bloku (reszta sekcji bez zmian, żeby nie rozszerzać zakresu).
- **Decision**: FIXED via Fix (aria-hidden na dwóch ikonach ArrowUpRight w nowym bloku)

## Notes (not findings)

- Zweryfikowane: `pnpm test` (46 testów), `pnpm type-check`, `pnpm lint` zielone; `generate:archive` online (121 = 71 + 50), offline z istniejącym plikiem i z samym fallbackiem, 403 z mocka, odpowiedź nie-tablica i brakujące foldery (exit 1 z nazwami), `pnpm build --mode development` przekazuje argumenty.
- Punkty ręczne 2.6-2.9 (przegląd w przeglądarce, kliknięcie linków) oznaczone `[x]` w Progress; w diffie brak artefaktów do ich weryfikacji, uznane na słowo.
- Do świadomości, bez ustaleń: brak paginacji (limit 1000 wpisów, dziś 71 i 50), brak retry, stale dane przy braku sieci na VPS to zamierzone „warn only”, samodzielny `type-check`/`build:app` na świeżym clonie wymaga `generate:archive` (opisane w README).
