<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Doświadczenie, własne produkty i skills „gdzie użyte”

- **Plan**: context/changes/site-focus-experience/plan.md
- **Scope**: Full plan
- **Reviewed phases**: 1, 2, 3
- **Date**: 2026-11-09
- **Verdict**: APPROVED
- **Findings**: 0 critical, 2 warnings, 1 observation

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | WARNING |
| Scope Discipline | PASS |
| Safety & Quality | PASS |
| Architecture | PASS |
| Pattern Consistency | PASS |
| Success Criteria | WARNING |

Weryfikacja automatyczna (uruchomiona w przeglądzie): `pnpm test` 101/101, `pnpm type-check`, `pnpm lint`, `pnpm build` — OK; grep usuniętych kluczy zwraca tylko `openSourceContribution`.

## Findings

### F1 — Link do commitów Engine i „konto firmowe” usunięte wbrew planowi, plan nieaktualny

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Plan Adherence
- **Location**: plan.md (Overview, Desired End State, Faza 1 pkt 2–5, Progress 1.8); commit 687fcaa
- **Detail**: Plan wymagał `openSourceContribution.link` + `linkNote` i linku „Commity skostecki · konto firmowe”. Commit 687fcaa celowo je usunął (typ, JSON, komponent, CV, test). Kod i `site-focus.md` p. 4 są spójne z tą decyzją, ale `plan.md` nadal opisuje link, a Progress 1.8 jest `[x]` dla kryterium, którego już nie ma. Odbiorca 2 (tech lead) nie dostaje linku do kodu Engine.
- **Fix**: Dopisz do plan.md addendum (decyzja z 687fcaa: Engine bez linku) i zmień 1.8 na „Ostatni punkt zakresu to Engine (tekst + kontekst MCP, bez linku)”.
  - Strength: Źródło prawdy zgodne z kodem przed archiwizacją.
  - Tradeoff: Plan pozostaje „ruchomy”.
  - Confidence: HIGH — tak samo zrobiono w poprzednich zmianach.
  - Blind spot: Czy brak linku to decyzja trwała, czy do odwrócenia.
- **Decision**: FIXED — addendum w plan.md, przeformułowane 1.8

### F2 — `site-focus.md` wewnętrznie sprzeczny co do linku Engine

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: context/foundation/site-focus.md:124-126
- **Detail**: p. 4 mówi „bez osobnego linku do commitów”, p. 7 nadal „Link „Commity skostecki” z dopiskiem „konto firmowe””. Kryterium 3.7 („p. 7 i p. 11 zgadzają się z tym, co widać na stronie”) jest odhaczone, a p. 7 nie zgadza się ze stroną.
- **Fix**: Usuń z p. 7 zdanie o linku i dopisku „konto firmowe”.
- **Decision**: FIXED — usunięto zdanie o linku z p. 7

### F3 — `isRepo` dopasowuje podciąg `github.com`

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: src/content/links.ts:12
- **Detail**: `url.includes('github.com')` rozpozna też `notgithub.com` lub URL z `github.com` w query. Logika przeniesiona 1:1, treść jest kontrolowana przez autora, więc ryzyko praktyczne zerowe.
- **Fix**: Użyj `new URL(url).host === 'github.com'` z obsługą błędu jak w `hostOf`.
- **Decision**: FIXED — isRepo porównuje host przez hostOf
