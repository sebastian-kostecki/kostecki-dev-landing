# Poprawki techniczne z audytu (C1, D1, D2, D3, B6, D5) — Plan Brief

> Full plan: `context/changes/site-audit-tech-fixes/plan.md`

## What & Why

Gałąź `design/hero-variants` (commit `423456f`) zawiera poprawki techniczne z audytu, ale razem z redesignem, którego `development` nie przejmuje (`context/foundation/site-focus.md`). Przenosimy same poprawki: widoczny header, brak zależności od zewnętrznych hostów (iconify, Google Fonts), nagłówki bezpieczeństwa, poprawne OG locale i prawdziwe README. Treść strony się nie zmienia.

## Starting Point

`development` ma już prerender i prawdziwe 404 (B4, zmiana `site-prerender`), więc nginx z gałęzi designu nie nadaje się do skopiowania — zepsułby `404.html`. Header na `/` jest ukryty (także w prerenderowanym HTML, z `aria-hidden`), ikony i fonty idą z zewnętrznych API, nginx nie wysyła żadnych nagłówków bezpieczeństwa, `index.html` ma zduplikowany `og:locale:alternate`, README to szablon Vite.

## Desired End State

Header widać od pierwszej klatki, przezroczysty nad hero. Strona nie wysyła żadnego żądania poza własną domenę. Każda odpowiedź nginx (200, 404, pliki) ma sześć nagłówków z CSP, a konsola nie pokazuje naruszeń. `og:locale:alternate` jest jeden i zawsze przeciwny do `og:locale`. README opisuje projekt, audyt ma odhaczone pozycje.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| --- | --- | --- |
| Ikony (D1) | Port `build-icons` → `scripts/lib/icons.mjs` + CLI; `src/generated/icons.json` w git; test pokrycia | Minimalna zmiana w komponentach, type-check działa na świeżym klonie, test łapie ikonę dodaną bez regeneracji. |
| Ikony w HTML z SSR | Nie (bez propsa `ssr`) | `@iconify/vue` bez `ssr` renderuje na serwerze pusty `<svg>`; włączenie grozi niezgodnością hydracji. |
| Fonty (D2) | `@fontsource-variable/*`, import w `main.ts` | Sprawdzone na gałęzi designu; zmienne fonty pokrywają wagi 400–700. |
| Zakres nginx (D3) | 6 nagłówków na poziomie `server`, CSP wymuszane, bez cache `/assets/` | Bloki `location` z `add_header` gubią nagłówki (błąd na gałęzi designu); cache to osobny temat. |
| CSP | `connect-src 'self'`, `style-src 'self' 'unsafe-inline'`, bez Report-Only | `development` nie ma runtime fetch; inline style ustawiają Vue/iconify. |
| HSTS | `max-age=31536000`, bez `includeSubDomains` | Subdomeny projektów są poza tym repo. |
| OG locale (B6) | `ogLocaleAlternate` w `PageMeta`, podmieniane w `injectPage` i `App.vue`, objęte `assertOnce` | Alternate nigdy nie równa się `og:locale`, także po przełączeniu języka; duplikat w szablonie wywala build. |
| Weryfikacja nginx | `scripts/check-nginx.sh` na `nginx:alpine` (+ `pnpm check:nginx`) | Powtarzalne, sprawdza zachowanie, nie tekst, i przy okazji pilnuje B4. |

## Scope

**In scope:**
- C1 header, B6 OG locale, D1 ikony, D2 fonty, D3 nagłówki/CSP, D5 README
- Odhaczenie B4, B6, C1, D1, D2, D3, D5 w `context/site-audit-2026-11.md`
- `pnpm-workspace.yaml` (sharp) tylko jeśli `pnpm add` pod pnpm 11 tego wymaga

**Out of scope:**
- Treść, commit log, skróty 1–4, ikona przy CV, WebP (C2), JSON-LD w `index.html`
- Zmiany w konfiguracji 404 (B4), cache `/assets/`, HSTS preload, CSP Report-Only
- URL-owe locale i `hreflang` (B2), deploy

## Architecture / Approach

Kolejność narzuca CSP: najpierw strona przestaje sięgać do zewnętrznych hostów (faza 2), dopiero potem nginx dostaje `connect-src`/`font-src 'self'` (faza 3). Fazy 1–2 testowane vitestem na HTML z SSR, `injectPage` i rejestrze ikon; faza 3 skryptem na realnym nginx. Kod ikon idzie wzorcem `scripts/lib/*.mjs` + spec, jak `archive-count`.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Header i OG locale (C1, B6) | Header widoczny od razu; jeden, poprawny `og:locale:alternate` | Header przezroczysty nad hero może wyglądać słabo przy krótkim hero na mobile |
| 2. Ikony i fonty lokalnie (D1, D2) | Zero żądań do iconify i Google | `pnpm add` pod pnpm 11 blokuje się na `sharp`; rendering fontów różni się od Google |
| 3. Nagłówki bezpieczeństwa (D3) | 6 nagłówków na każdej odpowiedzi + skrypt sprawdzający | Zbyt ostre CSP psuje coś niewidocznego w testach — stąd ręczny przegląd konsoli |
| 4. README i audyt (D5) | README projektu, audyt odhaczony | Fakty w README rozjadą się z `package.json` |

**Prerequisites:** Docker lokalnie (faza 3), dostęp do sieci dla `pnpm add` (faza 2).
**Estimated effort:** ~1 sesja, 4 małe fazy.

## Open Risks & Assumptions

- Zakładamy, że Traefik nie dodaje ani nie usuwa nagłówków — sprawdza to `curl -sI` po deployu (3.5).
- Nowy zewnętrzny zasób w przyszłości (obraz, fetch) wymaga zmiany CSP; README to opisze.
- Brakująca ikona w `icons.json` po deployu skończy się żądaniem do iconify zablokowanym przez CSP — widocznym w konsoli, a w CI łapie to test pokrycia.

## Success Criteria (Summary)

- Odwiedzający od razu widzi nawigację i przełącznik języka na `/`.
- DevTools Network i konsola: zero żądań poza `kostecki.dev`, zero naruszeń CSP; `curl -sI` pokazuje sześć nagłówków na 200 i 404.
- `pnpm test`, `pnpm build` i `pnpm check:nginx` przechodzą.
