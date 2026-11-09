<!-- PLAN-REVIEW-REPORT -->
# Plan Review: Hero i panel „W skrócie” dla rekrutera

- **Plan**: context/changes/site-focus-hero/plan.md
- **Mode**: Deep
- **Date**: 2026-11-09
- **Verdict**: REVISE → SOUND (po triage)
- **Findings**: 1 critical, 1 warning, 2 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| End-State Alignment | PASS |
| Lean Execution | PASS |
| Architectural Fitness | WARNING |
| Blind Spots | FAIL |
| Plan Completeness | PASS |

## Grounding
13/13 paths ✓, 9/9 symbols ✓ (`yearsSince`, `formatDuration`, `resolveDurations`, `careerSince`, `hasCv`, `viewMyWork`, `siteSource`, `routeMeta`, `ctaPrimary`), brief↔plan ✓, Progress↔Phase ✓

Potwierdzone w kodzie: tabela przypadków staży (przeliczona), `CvView` 1:1 (wszystkie pola istnieją lub są dodawane), zakresy linii `HeroIntro` (38-47, 63-66), dwa literały staży na locale, `vitest@5.1.0` z peer `vite ^8`, brak `composite` w `@vue/tsconfig`.

## Findings

### F1 — `/cv` koliduje z katalogiem `public/cv/` na nginx

- **Severity**: ❌ CRITICAL
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Blind Spots
- **Location**: Faza 3 — §3 Widok i trasa („Serwer bez zmian”), kryterium 3.9
- **Detail**: Śledzony `public/cv/README.md` trafia do `dist/cv/`; `try_files $uri $uri/ /index.html` (`docker/nginx.conf:6-7`) dopasowuje `$uri/` do katalogu bez `index.html` → bezpośrednie wejście na `/cv` na produkcji daje 301 → `/cv/` → 403. RouterLink w aplikacji działa, a 3.9 sprawdza `pnpm preview`, nie nginx — błąd mógł przejść niezauważony. README opisuje też nieaktualne `cv.href` jako PDF.
- **Fix A ⭐ Recommended**: Usunąć `public/cv/README.md` w fazie 3 + automatyczne `pnpm build && test ! -e dist/cv`
  - Strength: Usuwa przyczynę i nieaktualną dokumentację; nginx zostaje bez zmian.
  - Tradeoff: Chroni tylko ten jeden katalog.
  - Confidence: HIGH — standardowe zachowanie `try_files $uri/`.
  - Blind spot: Nie sprawdzono montowań docker-compose pod `/cv`.
- **Fix B**: Dodatkowo `try_files $uri /index.html` w nginx
  - Strength: Eliminuje całą klasę kolizji trasa/katalog.
  - Tradeoff: Zmiana serwera, nakłada się na `site-audit-tech-fixes`.
  - Confidence: MEDIUM — wpływ na inne pliki statyczne niesprawdzony.
  - Blind spot: Wymaga testu na obrazie docker.
- **Decision**: FIXED (Fix A) — §3 fazy 3 usuwa `public/cv/README.md`; nowe kryterium 3.10.

### F2 — `about.index = "01"` łamie konwencję etykiet sekcji

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Architectural Fitness
- **Location**: Faza 2 — §2 Treść, kryterium 2.11
- **Detail**: Pozostałe sekcje mają „NN / Kategoria” + opisowy tytuł („02 / Projekty” + „Wybrane realizacje komercyjne”, „03 / Umiejętności” + „Umiejętności i narzędzia”, „04 / Kontakt” + „Porozmawiajmy”); goły „01” wyróżniałby O mnie.
- **Fix A ⭐ Recommended**: Index bez zmian „01 / O mnie” / „01 / About”, tytuł opisowy inny niż „Jak pracuję”
  - Strength: Spójne z trzema sekcjami; p. 5 podaje „O mnie” tylko jako propozycję.
  - Tradeoff: Trzeba ustalić brzmienie tytułu.
  - Confidence: HIGH — wzorzec widoczny w locale.
  - Blind spot: None significant.
- **Fix B**: Zostawić „01” i zapisać niespójność jako decyzję
  - Strength: Bez zmiany copy.
  - Tradeoff: Niespójne etykiety.
  - Confidence: HIGH.
  - Blind spot: None significant.
- **Decision**: FIXED (Fix A) — tytuł „Kim jestem” / „Who I am”; zaktualizowane end state, tabela §2, 2.11, plan-brief.

### F3 — `CvView` filtruje wiersze panelu po `href` (niejawny kontrakt)

- **Severity**: OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Faza 2 §1 (`SummaryItem`), Faza 3 §3
- **Detail**: `CvView.vue:8` — `summary.items.filter((item) => !item.href)`; przyszły wiersz z linkiem zniknąłby z CV bez sygnału.
- **Fix**: JSDoc na `SummaryItem.href` w kontrakcie typów.
- **Decision**: FIXED

### F4 — Strażnik tokenów nie łapie literówki w formie

- **Severity**: OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Faza 1 §3 — `locales.spec.ts` (b)
- **Detail**: `/\{(years|since):\w+\}/` przepuszcza `{year:modulesGarden}`; treść nie ma dziś żadnego wzorca `{słowo:słowo}`.
- **Fix**: Regex `/\{\w+:\w+\}/`.
- **Decision**: FIXED
