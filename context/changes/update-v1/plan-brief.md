# update-v1: spójność kostecki.dev z LinkedInem — Plan Brief

> Full plan: `context/changes/update-v1/plan.md`
> Przegląd briefu (pełni rolę frame + research): `context/changes/update-v1/design-review.md`

## What & Why

LinkedIn (24.11.2026) i README na GitHubie mówią już: Full-stack Developer (PHP / Laravel + Vue),
ModulesGarden od 07.2022, PanelAlpha jako hosting projektów z Gita z open-source'owym Engine
i Single Server Edition, Claude Code i Claude Design, trzy własne produkty na produkcji.
Strona mówi rzeczy przeciwne: Backend Developer, Cursor, 2 produkty, Menu Maker WIP, „automatyzacja
WordPressa”, daty od 11.2022. Rekruter, który porówna stronę z profilem, zobaczy rozjazd.

## Starting Point

Produkcja buduje się z `origin/master`. Lokalna gałąź jest 15 commitów w tyle, więc pracujemy na
nowej gałęzi. Treść to `src/content/{pl,en}.json`, staże są liczone z `src/content/career.ts`,
a `/cv` jest ukryte. Strażnicy treści (`positioning`, `collaboration`, `experience`, `products`)
pilnują niszy w meta, zakazu usług hostingowych, literałów skali i dwóch wyróżnionych produktów.

## Desired End State

`/`, `/projects`, `/skills` i `/contact` w PL i EN pokazują rolę full-stack, staż od 07.2022 bez
powtórzenia, PanelAlpha z nowym opisem i linkami do repo Engine i SSE, Claude Design zamiast
Cursora, trzy produkty z Menu Makerem live. W `dist/` nie ma „Cursor” ani „Backend Developer”.
JSON-LD, meta i obraz OG mówią „Full-stack Developer”.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Baza pracy | Nowa gałąź `feat/update-v1` od `origin/master` | Brief był pisany pod nieaktualną gałąź. | Research |
| `/cv` i plik CV | Bez zmian, `/cv` ukryte, punkt 7 briefu wypada | Decyzja Sebastiana „nie dodawaj CV”. | Frame |
| Opis migracji Vue 3 + TS | Pokazujemy | Zgoda ModulesGarden potwierdzona 2026-11-25. | Frame |
| Linki open source | Linki do repo Engine i SSE w karcie PanelAlpha (nowe pole `links`) | SSE to jedyny publiczny dowód pracy full-stack w produkcie. | Plan |
| Formuła „Laravel + Vue” | Tylko w etykiecie hero, roli w „W skrócie” i meta; gdzie indziej naturalnie | Pięć powtórzeń na ekranie brzmi jak upychanie słów kluczowych. | Plan |
| Claude Design | Jako narzędzie: „Agenci (Claude Code, Claude Design)” | Zdanie „projektuję interfejsy” nie ma linku do dowodu. | Plan |
| Staż w „W skrócie” | „4 lata komercyjnie w ModulesGarden, głównie przy PanelAlpha” | Oba staże dają „4 lata”, więc powtórzenie wyglądałoby jak błąd. | Plan |
| „Mój wkład” | 5 punktów + blok open source (Engine i SSE razem) | Karta jest czytelna, a open source ma jedno miejsce z dowodami. | Plan |
| Meta description | Nowy tekst zachowuje cPanel, Plesk, DirectAdmin | Wymaga tego `positioning.spec.ts`, a asercji nie osłabiamy. | Research |
| Okres WHMCS | „07–11.2022” zamiast „~6 miesięcy” | Zakres historyczny się nie starzeje. | Research |
| Kategoria frontend | „Frontend (Vue 3 + TypeScript)” zamiast „uzupełniający” | Stara nazwa przeczy roli full-stack. | Research |
| Obraz OG | „Full-stack Developer · PHP · Vue” | Wersja z „Laravel” nie mieści się na karcie. | Research |
| Menu Maker | Live, bez WIP, bez `featured` | Na stronie głównej zostają dwa teasery i test `products`. | Frame |

## Scope

**In scope:** `site-focus.md`, `career.ts`, `OpenSourceContribution.links` + `PanelAlphaFeature.vue`,
treść PL/EN (hero, „W skrócie”, O mnie, PanelAlpha, WHMCS, skills, AI, Współpraca, kontakt, stopka,
meta, projekty), `index.html`, obraz OG, nowy test `linkedin-consistency.spec.ts`, strażnik
`index-html.spec.ts`.

**Out of scope:** `/cv` i `context/cv/*`, poziom angielskiego, trzeci teaser na stronie głównej,
zmiany układu hero i tokenów, konto demo dla aplikacji za logowaniem, liczby o skali PanelAlpha.

## Architecture / Approach

Zmiana jest prawie w całości treścią w dwóch słownikach JSON, które czytają komponenty, SEO
(`jobTitle` z `hero.label`, `llms.txt` z `meta.description`) i prerender. Jedyna zmiana kodu to
opcjonalne pole `links: ProjectLink[]` w bloku open source i jego render. Najpierw czerwony test
z faktami z LinkedIna, potem treść w dwóch porcjach, na końcu build z grepem w `dist/`.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Fundament i testy strażnicy | Gałąź, `site-focus.md`, czerwony `linkedin-consistency.spec.ts` | Test opisuje teksty zamiast faktów i blokuje przyszłe redakcje |
| 2. Daty i karta PanelAlpha | `career.ts`, linki OSS, nowy opis i 5 punktów, WHMCS 07–11.2022 | Literał skali w tekście OSS (np. „Apache 2.0”) łamie `experience.spec.ts` |
| 3. Rola i teksty w całym serwisie | Hero, „W skrócie”, O mnie, skills, AI, Współpraca, stopka, meta, projekty | Słowo „hosting” w Współpracy łamie `collaboration.spec.ts` |
| 4. OG, build i weryfikacja | Nowy obraz OG, zielony build, czysty `dist/` | Prerender pokazuje coś innego niż testy JSON-ów |

**Prerequisites:** `pnpm install` na nowej gałęzi; dostęp do GitHub API przy buildzie (licznik
archiwum ma fallback).
**Estimated effort:** jedna sesja, 4 fazy, każda z krótkim ręcznym przeglądem.

## Open Risks & Assumptions

- Zakładamy, że „projekty interfejsu w Claude Design” w zakresie pracy przy PanelAlpha mieszczą
  się w zgodzie pracodawcy razem z migracją.
- Staż „4 lata” dla obu dat to stan na 11.2026. Od 01.2027 ModulesGarden pokaże „4,5 roku”,
  a nowy wiersz „W skrócie” jest na to odporny.
- Single Server Edition jest w becie. Link prowadzi do repo, więc status bety widać tam.

## Success Criteria (Summary)

- Rekruter porównujący stronę z LinkedInem widzi tę samą rolę, daty, produkty i narzędzia.
- Każde nowe twierdzenie (frontend w PanelAlpha, SSE, Menu Maker na produkcji) ma link do dowodu.
- `pnpm test`, `lint` i `build` są zielone, a w `dist/` nie ma „Cursor” ani „Backend Developer”.
