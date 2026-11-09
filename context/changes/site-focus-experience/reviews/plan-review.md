<!-- PLAN-REVIEW-REPORT -->
# Plan Review: Doświadczenie, własne produkty i skills „gdzie użyte”

- **Plan**: context/changes/site-focus-experience/plan.md
- **Mode**: Deep
- **Date**: 2026-11-09
- **Verdict**: REVISE → SOUND (po poprawkach)
- **Findings**: 1 critical, 2 warnings, 3 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| End-State Alignment | PASS |
| Lean Execution | PASS |
| Architectural Fitness | PASS |
| Blind Spots | FAIL |
| Plan Completeness | WARNING |

## Grounding
9/9 paths ✓ (2 nowe pliki zgodnie z oczekiwaniem nie istnieją), konsumenci openSource/homePreview/secondaryLink/exploreAllSkills/compact zgodni z planem 4/4 ✓, źródła z gałęzi (ProductTeaser, SkillBadge, usedIn PL/EN) ✓, brief↔plan ✓, Progress↔Faza ✓; 3 nieaktualne odwołania do linii (F6). Weryfikacja kodu (Krok 3) wykonana inline, bez sub-agenta.

## Findings

### F1 — Strażnik odrzuca „e2e” z treści, którą plan sam wpisuje

- **Severity**: ❌ CRITICAL
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Faza 1 §1 (kontrakt scaleLiterals) × Faza 2 §3 (treść)
- **Detail**: Kontrakt usuwał tylko „<nazwa z ALLOWED_VERSIONED> + liczba”, a każdą pozostałą cyfrę uznawał za zakazaną. `proves` Root Keepera („…Playwright e2e.”, z site-focus.md p. 7) i `highlights[3]` („…e2e w Playwright”) zawierają „2”, więc products.spec.ts nie mógł przejść na treści przepisanej przez plan.
- **Fix**: Dodać `ALLOWED_TERMS` (`e2e`, całe słowo) usuwane przed szukaniem cyfr i przypadek „pipeline'y CI: lint, Larastan, Pest, Playwright e2e” na liście „przepuszcza”.
- **Decision**: FIXED

### F2 — Kryterium 1.6 (grep) nie przejdzie z założenia

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Faza 1 — Success Criteria / Progress 1.6
- **Detail**: experience.spec.ts sprawdza brak klucza `openSource`, więc sam plik testu zawiera ten ciąg i grep zawsze go znajdzie.
- **Fix**: `--exclude-dir=__tests__` w kryterium i w Progress 1.6.
- **Decision**: FIXED

### F3 — `pnpm test -- <nazwa>` nie filtruje testów

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Progress 1.1, 2.1, 3.1
- **Detail**: Sprawdzone: `pnpm test -- locales` uruchomił 4 pliki / 60 testów, `pnpm test locales` — 1 plik / 2 testy.
- **Fix**: `pnpm test experience|products|skills` bez `--` w kryteriach i Progress.
- **Decision**: FIXED

### F4 — Strażnik nie obejmuje `subtitle` produktów

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Faza 2 §1
- **Detail**: Brief obiecuje, że testy pilnują braku literałów na każdej stronie, a `subtitle` produktów (renderowane na /projects i /cv) nie był sprawdzany.
- **Fix**: `scaleLiterals` także dla `subtitle` w products.spec.ts.
- **Decision**: FIXED

### F5 — Trzecia kopia hostOf / isRepo

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Architectural Fitness
- **Location**: Faza 2 §4
- **Detail**: ProductTeaser powielałby `hostOf` z CvView.vue:18 i `isRepo` z FeaturedProjectCard.vue:13.
- **Fix**: Nowy `src/content/links.ts` z `hostOf` i `isRepo` (Faza 2 §4), importowany w CvView, FeaturedProjectCard i ProductTeaser; test `describe('links')` w products.spec.ts.
- **Decision**: FIXED

### F6 — Nieaktualne odwołania do linii + urwane zdanie

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Key Discoveries, Faza 1 §5, Faza 2 §1, §5, References
- **Detail**: FeaturedProjectCard.vue ma 84 linie (`:388` → `:62`, `:365-373` → `:39-47`); AiWorkflowSection `:23-45` wskazywało początek sekcji (linki: `:64-70`); urwane zdanie „`skills` nie zawiera, a `ui` nie ma klucza `exploreAllSkills`”.
- **Fix**: Poprawione numery linii i zdanie.
- **Decision**: FIXED
