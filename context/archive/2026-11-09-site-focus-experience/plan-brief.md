# Doświadczenie, własne produkty i skills „gdzie użyte” — Plan Brief

> Full plan: `context/changes/site-focus-experience/plan.md`
> Research: `context/changes/site-focus-experience/research.md`

## What & Why

Trzecia zmiana z łańcucha `site-focus.md` p. 10. Strona główna ma pokazać trzy dowody w kolejności z p. 5: doświadczenie komercyjne (zakres pracy przy PanelAlpha, w tym wkład w PanelAlpha Engine), proces z agentami AI i własne produkty na produkcji. Dziś zakres PanelAlpha jest ukryty, Engine udaje osobny projekt, produktów na home nie ma, a karty zawierają literały liczbowe, których p. 8 zakazuje.

## Starting Point

Home: O mnie → AI → „Wybrane realizacje komercyjne” (PanelAlpha, Engine i WHMCS w trybie `compact`, bez listy zakresu) → Skills. Engine (`projects.openSource`) jest osobną kartą na home, `/projects` i `/cv`. Skarbnik twierdzi „Repozytorium prywatne”, choć repo jest publiczne. Gałąź `design/hero-variants` ma gotowe `usedIn` i szkic `ProductTeaser`.

## Desired End State

Home: hero → „01 / O mnie” → „02 / Doświadczenie” (pełna karta PanelAlpha z Engine jako ostatnim punktem i linkiem „Commity skostecki · konto firmowe”, kompaktowa grupa WHMCS) → AI → „03 / Własne produkty” (dwa teasery: stack, „Udowadnia: …”, live + GitHub) → kontakt. Engine nie jest kartą nigdzie. Karty produktów i CV są bez literałów skali, co pilnuje test. `/skills` pokazuje „gdzie użyte” dla 7 pozycji stacku.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Skills na home | Usunięte; „gdzie użyte” tylko na `/skills` | p. 5 nie przewiduje Skills, a stack jest już w panelu „W skrócie”. | Plan |
| Zasięg usunięcia Engine | Usunięty `openSource` z home, `/projects` i `/cv`; Engine to pole `openSourceContribution` w PanelAlpha | Jedno źródło prawdy, zgodnie z p. 4 („nie jest osobną kartą”) na każdej stronie. | Plan |
| Link Engine | Jeden link do `commits?author=skostecki` z dopiskiem „konto firmowe”, bez `SourceRef` | p. 7 wymaga jednego linku, nie linku przy każdym punkcie. | Research |
| Punkt o integracjach | „…(cPanel, Plesk, DirectAdmin) i PowerDNS oraz usługami e-mail, SSL, backup i storage” | Nazwy, które rekruter rozpozna, bez utraty dzisiejszego zakresu. | Plan |
| Literały w kartach i CV | Przepisane teraz + test strażnika `scaleLiterals` (wersje stacku dozwolone) | Domyka naruszenie p. 8 na `/projects` i `/cv` i nie pozwala mu wrócić. | Plan |
| Linki teasera, Skarbnik | Live + GitHub; Skarbnik bez notatki „prywatne”, z linkiem do repo | Tech lead dostaje kod jednym kliknięciem; usuwa fałszywe twierdzenie. | Plan |
| Forma `usedIn` | Tekst z gałęzi, z wpisami PanelAlpha/WHMCS | Tani port; każdy nazwany projekt ma już na stronie swoje linki. | Plan |
| Migracja client area | Pominięta | Zgoda pracodawcy wciąż otwarta (p. 9). | Research |
| Testy | Testy treści per locale (wzorzec `ai-proof.spec.ts`), najpierw czerwone | Brak infrastruktury testów komponentów; treść niesie ryzyko. | Plan |

## Scope

**In scope:**
- Sekcje Doświadczenie i Własne produkty na home, usunięcie Skills z home
- Usunięcie `projects.openSource`, pole `openSourceContribution`, zmiany w `PanelAlphaFeature`, `ProjectsView`, `CvView`
- `ProductTeaser.vue` z `proves`, przepisane highlights, link GitHub Skarbnika
- `usedIn` na `/skills`, aktualizacja `site-focus.md` p. 7 i p. 11

**Out of scope:**
- Migracja client area, `SourceRef` i linki przy każdym punkcie, `usedIn` jako linki lub na home
- Kategorie skills (tag wall), opisy meta, sekcja AI, hero, stopka, tokeny CSS
- Testy komponentów i E2E, prerender

## Architecture / Approach

Treść to JSON per locale typowany przez `SiteContent`. Każda faza: test treści (czerwony) → typ → oba JSON-y → komponenty → zielony test i `vue-tsc`. Engine to osobne opcjonalne pole na `FeaturedProject`, więc `responsibilities` zostaje `string[]`. Strażnik literałów to czysta funkcja w `src/content/content-rules.ts`: usuwa wersje stacku (`Laravel 13`, `PHP 8.5`…), potem szuka cyfr.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Doświadczenie: Engine jako punkt PanelAlpha | Sekcja Doświadczenie przed AI; Engine bez karty na home, `/projects`, `/cv`; strażnik literałów | Usunięcie klucza łamie trzy widoki naraz; musi wejść w jednej fazie |
| 2. Własne produkty: teasery i czysta treść | Teasery po AI zamiast Skills; highlights bez liczb; Skarbnik z GitHubem | Przepisane highlights tracą konkret; teaser przy 375 px |
| 3. Skills „gdzie użyte” i domknięcie foundation | `usedIn` na `/skills`; `site-focus.md` zgodny z wdrożeniem | Wartości EN z gałęzi nieaktualne względem PL |

**Prerequisites:** gałąź `development` na `fddb4ae` lub nowszym; dostęp do `design/hero-variants` (lokalnie).
**Estimated effort:** ~1 sesja, 3 fazy.

## Open Risks & Assumptions

- „Konto firmowe” przy `skostecki` to deklaracja autora; API GitHub pokazuje konto typu `User` bez firmy.
- Wpisy `usedIn` dla PanelAlpha i modułów WHMCS nie mają publicznego dowodu (kod komercyjny). Ten sam fakt jest już na stronie w tagach PanelAlpha.
- Pełna karta PanelAlpha na home jest wyższa niż dzisiejsza kompaktowa i wydłuża drogę do sekcji AI.

## Success Criteria (Summary)

- Rekruter na home widzi zakres pracy przy PanelAlpha (z Engine i WHMCS), zanim dojdzie do sekcji AI.
- Tech lead z teasera lub punktu Engine trafia jednym kliknięciem do kodu.
- Na żadnej stronie (home, `/projects`, `/cv`) nie ma literału skali ani karty Engine, a testy tego pilnują.
