<!-- PLAN-REVIEW-REPORT -->
# Plan Review: Prerender tras, sitemap, JSON-LD i llms.txt

- **Plan**: context/changes/site-prerender/plan.md
- **Mode**: Deep
- **Date**: 2026-11-09
- **Verdict**: SOUND
- **Findings**: 0 critical, 2 warnings, 4 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| End-State Alignment | PASS |
| Lean Execution | PASS |
| Architectural Fitness | PASS |
| Blind Spots | WARNING |
| Plan Completeness | WARNING |

## Grounding
12/12 paths ✓, 12/12 symbols ✓, brief↔plan ✓, Progress↔Faza ✓. Zweryfikowane: SSR-safe (window/document tylko w onMounted/handlerach/za `typeof window`; nie-immediate `watch` w SiteHeader jest no-opem w SSR), `mount` czyści kontener (`@vue/runtime-dom` esm-bundler:1916), `dist-ssr` w `globalIgnores` (`eslint.config.ts:18`) i `.gitignore`, `tsconfig.vitest.json` obejmuje `src/__tests__`. Brak `context/foundation/lessons.md` i `docs/reference/contract-surfaces.md`.

## Findings

### F1 — 404: elementy head usuwane statycznie, a klient zakłada, że są

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Faza 1 §3 vs Faza 2 §1
- **Detail**: Faza 1 zakładała, że elementy canonical/og:url zostają przy 404, a Faza 2 usuwa je z `dist/404.html` i dodaje `noindex`. Przejście 404 → „wróć” dawało home bez canonical/og:url (`setMetaContent` w `App.vue:13-16` nie tworzy elementów) i z pozostawionym `noindex`.
- **Fix**: `applyMeta` robi upsert `link[rel=canonical]` i `meta[property=og:url]` oraz usuwa `meta[name=robots]` poza `not-found`; kontrola ręczna 2.9 rozszerzona o tę ścieżkę.
- **Decision**: FIXED

### F2 — Brak źródła dla URL-a repo strony w llms.txt

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Faza 3 §3
- **Detail**: URL repo jest wpisany na sztywno w `SiteFooter.vue:52`, a plan nie przewidywał jego wydzielenia, więc implementator musiałby powielić literał.
- **Fix**: `SITE_REPO_URL` obok `SITE_URL` w `src/seo/page-meta.ts`, używany w `SiteFooter.vue` i `llms.ts`; `SiteFooter.vue` dopisany do plików Fazy 3 §3.
- **Decision**: FIXED

### F3 — Reguła canonical i mapowanie ścieżka→trasa w trzech modułach

- **Severity**: 🔍 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Architectural Fitness
- **Location**: Faza 1 §2–3, Faza 3 §1, §3
- **Detail**: `pageMeta` brał nazwę trasy, a sitemap i llms ścieżki, bez wspólnego helpera, więc reguła ukośnika i lookup nazwy powstałyby trzy razy.
- **Fix**: `canonicalUrl(path)` w `page-meta.ts` i `staticRoutes` w `routes.ts`; `buildSitemap(paths)` i `buildLlmsTxt(content, staticRoutes)` z nich korzystają.
- **Decision**: FIXED

### F4 — Googlebot renderuje JS i zobaczy wersję EN

- **Severity**: 🔍 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: What We're NOT Doing / Open Risks (brief)
- **Detail**: Crawlery renderujące JS (prawdopodobnie `en-US`) przechodzą `detectInitial()` → `en` (`useLocale.ts:11`) i indeksują EN pod canonical bez locale. To nie jest regresja. Pewność MED.
- **Fix**: Notka w planie (hydracja) i w briefie (Open Risks) z odesłaniem do B2.
- **Decision**: FIXED

### F5 — injectPage a wzorce `$` w String.replace

- **Severity**: 🔍 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Faza 2 §1
- **Detail**: `replace(str, str)` interpretuje `$&`/`$'`/`` $` `` w treści; dziś w JSON-ach brak `$`.
- **Fix**: Replacer jako funkcja; test z `$&` w description i `appHtml`.
- **Decision**: FIXED

### F6 — Drobne nieścisłości w komendach weryfikacji

- **Severity**: 🔍 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Faza 2 (2.4, 2.5), Faza 3 (3.4, 3.6), Faza 4 (4.2)
- **Detail**: `grep -o` zwraca prefiks `<title>`; `grep -c` z wynikiem 0 kończy się kodem 1; kontener z 4.2 bez nazwy i bez zatrzymania.
- **Fix**: Poprawiony oczekiwany wynik 2.4, `|| true` przy `grep -c` oczekujących `0`, `--name prerender-check` + `docker stop prerender-check`.
- **Decision**: FIXED
