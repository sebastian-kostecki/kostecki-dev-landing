<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Prerender tras, sitemap, JSON-LD i llms.txt

- **Plan**: context/changes/site-prerender/plan.md
- **Scope**: Full plan (ukończone fazy 1–3; faza 4 ma otwarty punkt 4.6 — deploy — więc poza zakresem)
- **Reviewed phases**: 1, 2, 3
- **Date**: 2026-11-09
- **Verdict**: NEEDS ATTENTION
- **Findings**: 0 critical, 3 warnings, 5 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | WARNING |
| Scope Discipline | PASS |
| Safety & Quality | WARNING |
| Architecture | PASS |
| Pattern Consistency | WARNING |
| Success Criteria | PASS |

Weryfikacja automatyczna (uruchomiona w tym przeglądzie): `pnpm test` 152/152, `pnpm type-check` czysto, `pnpm lint` 0 błędów, `pnpm build` exit 0 (8 plików wyjściowych). Tytuł `dist/projects` = `Projekty — Sebastian Kostecki`, canonical `dist/cv` = `https://kostecki.dev/cv`, brak canonical w `404.html`, 5×`<loc>`, 0×`lastmod`, `public/sitemap.xml` nie istnieje, JSON-LD w 5 stronach i 0 w 404, `llms.txt` bez „commit”, ponowny `pnpm prerender` → exit 1 z komunikatem o placeholderze. Wszystkie punkty Manual z faz 1–3 są odhaczone z SHA commitów.

## Findings

### F1 — Start klienta na chwilę nadpisuje meta strony i zdejmuje `noindex` z 404

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: src/App.vue:65 (oraz :46, :28-31)
- **Detail**: `onMounted(applyMeta)` odpala się synchronicznie w `mount()`. Początkowa nawigacja vue-router jest asynchroniczna, więc w tym momencie `route.name` jest `undefined` (`path '/'`). `pageMeta('')` wpada w `default` i zwraca meta home z canonical `https://kostecki.dev/`. Skutki: (a) wejście bezpośrednio na `/projects` na chwilę nadpisuje poprawny prerender tytułem, canonical i `og:url` strony głównej — naprawia to dopiero `watch` po nawigacji; (b) na `404.html` krok pośredni wywołuje `applyCanonical('…/')`, które robi `document.querySelector('meta[name="robots"]')?.remove()`, a po dojściu do `not-found` `applyCanonical(null)` nie przywraca `noindex`. Klient wykonujący JS widzi 404 bez `noindex` (status HTTP 404 nadal poprawny). Wniosek oparty na kodzie vue-router i teście w node; nie sprawdzony w przeglądarce.
- **Fix**: W `applyMeta` wyjdź wcześnie, dopóki trasa nie jest rozwiązana (`if (route.name === undefined) return`), i niech `applyCanonical(null)` ustawia `meta[name=robots]=noindex` zamiast tylko czyścić atrybuty.
  - Strength: Usuwa oba objawy u źródła w jednym pliku; `watch` i tak odpali `applyMeta` po nawigacji.
  - Tradeoff: Krok manualny 2.9 („wejście na /nie-ma i wróć”) trzeba powtórzyć w przeglądarce.
  - Confidence: HIGH — mechanizm potwierdzony w kodzie (`App.vue:49,65`, `main.ts`).
  - Blind spot: Nie uruchomiono w przeglądarce; brak testu komponentu (vitest bez jsdom).
- **Decision**: FIXED — Fix now (guard `route.name === undefined` w `applyMeta` + upsert `meta[name=robots]=noindex` w `applyCanonical(null)`, src/App.vue)

### F2 — `router.push` w SSR ignoruje porażkę nawigacji, `?? 'home'` ją maskuje

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: src/entry-server.ts:23-26
- **Detail**: `await router.push(path)` bez sprawdzenia `NavigationFailure`, potem `String(router.currentRoute.value.name ?? 'home')`. Nieudana nawigacja (guard, redirect) zostawia `START_LOCATION`, który jest po cichu podpisany jako `home` i renderowany bez widoku. Łamie zasadę „nigdy nie ukrywaj dowodów”.
- **Fix**: `const failure = await router.push(path); if (failure) throw new Error(\`render(${path}): navigation failed\`, { cause: failure })` oraz rzucaj błąd, gdy `name` jest `undefined`, zamiast `?? 'home'`.
- **Decision**: FIXED — Fix now (throw z `cause` przy `NavigationFailure` i przy braku `name`, src/entry-server.ts)

### F3 — `routeCopy` po cichu mapuje każdą nieznaną nazwę trasy na home

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: src/seo/page-meta.ts:33-34 (oraz src/seo/llms.ts:7, src/seo/__tests__/page-meta.spec.ts)
- **Detail**: `default: return content.routes.home`. Nowa trasa bez wpisu dostanie meta home bez błędu i logu (F1 pokazuje realny skutek). Test „falls back to home meta for an unknown route name” utrwala to zachowanie. Mapowanie nazwa trasy → klucz `content.routes` jest zdublowane w `page-meta.ts:21-36` i `llms.ts:7`. Plan świadomie przejął fallback z `App.vue:24`, więc to także uwaga do planu.
- **Fix A ⭐ Recommended**: Jedna tabela `Record<RouteName, keyof SiteContent['routes']>` używana przez `pageMeta` i `llms.ts`; nieznana nazwa → `throw` z nazwą trasy.
  - Strength: Kompilator wymusza kompletność przy nowej trasie; usuwa dublowanie; prerender wywala build zamiast publikować złe meta.
  - Tradeoff: Klient musi najpierw przejść F1 (guard na `undefined`), inaczej `onMounted` rzuci błąd; test fallbacku trzeba zmienić na test błędu (zmiana wymagania, nie obejście asercji).
  - Confidence: HIGH — typ `RouteName` już istnieje w `routes.ts`.
  - Blind spot: Czy po stronie klienta wolimy `console.error` + fallback zamiast `throw` (nie wywalać strony użytkownika).
- **Fix B**: Zostaw fallback, ale loguj `console.error` z nazwą trasy i przenieś tabelę do jednego miejsca.
  - Strength: Mniejsza zmiana, klient nigdy nie pada.
  - Tradeoff: Prerender nadal nie wywali buildu dla trasy bez wpisu.
  - Confidence: MEDIUM — zależy od tego, czy W/F2 wystarczy do wykrycia na buildzie.
  - Blind spot: Brak.
- **Decision**: FIXED — Fix A (tabela `Record<RouteName, …>` + `routeCopy` rzucający błąd dla nieznanej nazwy, użyta w page-meta.ts i llms.ts; test fallbacku zamieniony na test błędu — zmiana wymagania)

### F4 — nginx: `/404.html` dostępny wprost z 200, brak `charset` dla `llms.txt` (faza 4, informacyjnie)

- **Severity**: 💬 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: docker/nginx.conf:4-9
- **Detail**: Brak `location = /404.html { internal; }`, więc `GET /404.html` zwraca 200 (z `noindex`, poza sitemapą). Brak `charset utf-8;` — `llms.txt` zawiera „—” i polskie znaki, a `text/plain` bez charsetu bywa czytany jako Latin-1. Faza 4 jest poza zakresem tego przeglądu (4.6 otwarte), uwaga z czytania, nginx nie był uruchamiany przez recenzentów.
- **Fix**: Dodać `charset utf-8;` oraz `location = /404.html { internal; }`.
- **Decision**: FIXED — Fix now (`charset utf-8;` + `location = /404.html { internal; }`; zweryfikowane w kontenerze nginx:alpine: nginx -t OK, 200 dla tras/sitemap/llms (text/plain; charset=utf-8), 404 dla /nie-ma z treścią 404.html i dla bezpośredniego /404.html)

### F5 — `scripts/prerender.mjs`: zdublowany `escapeText`, nieatomowy zapis, błąd bez nazwy trasy

- **Severity**: 💬 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: scripts/prerender.mjs:15-19, 47-66, 68-88
- **Detail**: `escapeText` skopiowane z `src/seo/html-template.ts`, więc weryfikacja używa tej samej logiki co generator i nie wykryje błędu escapowania. Plan mówi, że testowalna logika ma siedzieć w `src/seo/`; sąsiednie skrypty trzymają logikę w `scripts/lib/*.mjs` z testami. Błąd `render(routePath)` nie jest owinięty nazwą trasy. Pliki są zapisywane przed kontrolą, więc przy błędzie `dist/` zostaje częściowy (build i tak się zatrzymuje). Kontrola nie sprawdza canonical/`og:url`/`robots` per plik.
- **Fix**: Wyeksportować `escapeText` z `html-template.ts` i użyć go w skrypcie; owinąć render w `try/catch` z `new Error(\`render ${routePath}\`, { cause })`.
- **Decision**: FIXED — Fix now (`escapeText` wyeksportowany z html-template.ts i re-eksportowany z entry-server.ts; `renderRoute` owija błąd renderu nazwą trasy i `cause`, scripts/prerender.mjs)

### F6 — Sitemap nie escapuje `&` w `<loc>`

- **Severity**: 💬 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: src/seo/sitemap.ts:4
- **Detail**: `canonicalUrl(path)` trafia do XML bez `&amp;`. Dziś ścieżki są stałe i bez `&`, wygenerowany XML jest poprawny; ryzyko dotyczy tylko przyszłych tras.
- **Fix**: Dodać `escapeXml` w `buildSitemap` i test z `&` w ścieżce.
- **Decision**: FIXED — Fix now (`escapeXml` w `buildSitemap` + test z `&` w ścieżce)

### F7 — Daty i staże zamrożone na dzień builda w prerenderze i `llms.txt`

- **Severity**: 💬 OBSERVATION
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Architecture
- **Location**: src/composables/useContent.ts:8-11, src/components/layout/SiteFooter.vue:7
- **Detail**: `resolveDurations` przy ładowaniu modułu i `new Date().getFullYear()` zapisują staże i rok stopki do statycznego HTML i `llms.txt` na dzień builda. Klient przelicza je po mount, więc użytkownik tego nie widzi; boty bez JS i `llms.txt` widzą stan z ostatniego deployu. Znana konsekwencja decyzji o prerenderze (plan: Current State).
- **Fix**: Zaakceptować i zapisać w README, że deploy/rebuild odświeża staże (lub dodać cykliczny rebuild po stronie infra).
- **Decision**: ACCEPTED + documented — ryzyko zaakceptowane, notka o zamrożonych datach/stażach dopisana do README.md (bez zmian w kodzie)

### F8 — Brak zapisanego dowodu czerwonego testu (krok 1.1)

- **Severity**: 💬 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: commit 5422b51
- **Detail**: Kryterium 1.1 wymaga czerwonego stanu „zapisanego w commicie lub w opisie fazy”. Commit 5422b51 zawiera test razem z implementacją i nie wspomina o stanie czerwonym; CLAUDE.md wymaga najpierw nieprzechodzącego testu. Nie da się już tego odtworzyć bez przepisywania historii.
- **Fix**: Dopisać adnotację do planu/kroku 1.1 (np. w follow-up), że czerwony stan nie został utrwalony; nie przepisywać historii.
- **Decision**: FIXED — Fix now (adnotacja pod krokiem 1.1 w plan.md; historia niezmieniona)
