# kostecki.dev — focus strony (konkluzja z brainstormu 2026-11-09)

Dokument fundamentowy. Odpowiada na pytanie „co ta strona ma przekazać i komu”, zanim
ktokolwiek zmieni treść lub layout. Każda zmiana w `src/content/*.json` i każda nowa sekcja
ma być zgodna z tym dokumentem. Źródła: `context/site-audit-2026-11.md`,
`context/proposal-2026-11-github-driven-changes.md`, rozmowa z Sebastianem 2026-11-09,
przegląd własnych decyzji tego samego dnia (p. 11).

## 1. Cel i odbiorca

- **Cel zawodowy (12 mies.):** rola backend / senior Laravel w firmie produktowej.
  Nie rola „AI engineer”. AI jest sposobem pracy, nie tożsamością.
- **Odbiorca 1 (15 sekund):** rekruter. Szuka: rola, lata, stack, obecny pracodawca,
  CV, kontakt. Obsługuje go hero i panel „W skrócie”. Język tych dwóch elementów jest
  językiem ogłoszenia o pracę, nie językiem procesu.
- **Odbiorca 2 (3 minuty):** tech lead / hiring manager. Szuka: czy dowozi, czy czyta kod,
  który commituje, jak testuje. Obsługują go sekcja „Praca z agentami AI” i dowody w repo.
- **Odbiorca 3 (0 sekund):** parser ATS, crawler, scraper AI. Czyta HTML bez JavaScriptu.
  Dziś widzi pustą stronę (audyt B1). Obsługuje go prerender.

## 2. Teza strony (jedno zdanie)

> Backend developer PHP/Laravel z 4 latami w produkcyjnym produkcie B2B (PanelAlpha,
> ModulesGarden). Kod pisze z agentami AI w udokumentowanym procesie, który ma publiczne,
> weryfikowalne dowody.

## 3. Co wyróżnia, w kolejności ważności

1. **Doświadczenie komercyjne.** PanelAlpha w ModulesGarden: integracje z panelami
   hostingowymi, moduły WHMCS, migracja client area, wkład w open-source'owy PanelAlpha
   Engine. Bez liczb o skali (brak zgody pracodawcy); pokazujemy zakres odpowiedzialności.
2. **Udokumentowany proces pracy z agentami.** Każda zmiana w dwóch publicznych repo
   (Root Keeper, Domowy Skarbnik) ma folder z dokumentacją, a licznik zarchiwizowanych
   zmian jest liczony przy buildzie. CI z lintem, Larastanem 7, Pest i Playwright. Uwaga:
   liczba sama się nie obroni, bo ok. połowa zmian w Skarbniku to przebiegi UI i kontrakty
   design systemu z 5–6 listopada. Dowodem jest **wybór** reprezentatywnych zmian (p. 4),
   liczba jest tłem.
3. **Własne produkty na produkcji.** Dwa, na własnym VPS-ie, z CI, ADR i changelogiem.
   Potwierdzają stack z hero (Laravel 13, PostgreSQL, Inertia) od zera do produkcji.

Co **nie** wyróżnia i nie ma być headline'em: „używam Claude Code / Cursora” (w 2026 to
standard), nisza hostingowa (zawęża rynek; nie wchodzi do pierwszego zdania hero), same
projekty poboczne (pisane z agentami, pokazują proces, nie talent do kodowania).

## 4. Decyzje (2026-11-09, zrewidowane tego samego dnia)

| Temat | Decyzja |
| --- | --- |
| Pierwsze zdanie hero | Rola, staż, nazwa produktu i pracodawcy. Bez branży. AI dopiero w drugim zdaniu. |
| Elementy „żywe” w hero | Brak. Hero = tekst + panel „W skrócie” + zdjęcie. Commit log z gałęzi `design/hero-variants` **nie** wchodzi. |
| Główny dowód w sekcji AI | 3–5 **ręcznie wybranych** zmian z archiwów, każda z jednym zdaniem „co pokazuje” i linkiem do folderu. Etykiety bez dat. Pod nimi licznik wszystkich zarchiwizowanych zmian pobierany przy buildzie. Cztery kroki procesu zostają. |
| Lista „ostatnich zmian” | **Nie.** Nazwy folderów zaczynają się datą, więc po przerwie lista pokazuje to samo, co pusty commit log. |
| Liczby w treści | Tylko liczone przy buildzie (staże, licznik archiwum) albo wcale. Żadnych literałów typu „14 ADR”, „130+ testów”. |
| Własne projekty na home | Teasery: nazwa, stack, jedno zdanie „co udowadnia” bez liczb. Pełne karty tylko na `/projects`. |
| PanelAlpha Engine | Nie jest osobną kartą. To punkt w zakresie pracy przy PanelAlpha, bez osobnego linku do commitów. |
| Liczby z PanelAlpha | Żadnych. Tylko zakres odpowiedzialności. |
| Zdjęcie | Tak, w sekcji „O mnie”, duotone w stylu strony. |
| Pisanie / blog | Nie teraz. Żadnej sekcji „notes” bez pierwszego tekstu. |
| Źródło strony | Link „Źródło” w stopce do publicznego repo landing. Najtańszy autentyczny artefakt. |
| Prerender | Tak, osobna zmiana. Treść jest statycznym JSON-em, więc prerender po buildzie jest tani i odblokowuje sens JSON-LD, sitemapy i `llms.txt`. |
| Baza prac | Od `development`. Z `design/hero-variants` przenosimy wybrane elementy (p. 6). |
| Redesign | Nie. Zostaje dark / mono / czerwony akcent. Wyróżniają autentyczne artefakty, nie layout. |

## 5. Kolejność sekcji na stronie głównej

1. **Hero** (rekruter): rola, staż, produkt i pracodawca, jedno zdanie o AI, CTA kontakt + CV,
   panel „W skrócie”.
2. **O mnie** (zaufanie): zdjęcie, trzy akapity, jedno zdanie osobiste. Tytuł sekcji nie
   może brzmieć „Jak pracuję”, bo zderza się z sekcją AI. Propozycja: „O mnie”.
3. **Doświadczenie** (dowód 1): PanelAlpha z zakresem, w tym Engine; moduły WHMCS.
4. **Praca z agentami AI** (dowód 2): wybrane zmiany, licznik archiwum, cztery kroki.
5. **Własne produkty** (dowód 3): dwa teasery z linią „co udowadnia”, link do `/projects`.
6. **Kontakt**: e-mail pierwszy, kopiowanie, LinkedIn, GitHub.
7. **Stopka**: link „Źródło” do repo landing.

## 6. Co przenieść z `design/hero-variants`

- Panel „W skrócie” i staże liczone z dat startu (`src/content/career.ts`). Sedno hero
  dla rekrutera, zamyka audyt A6.
- Strona `/cv` do druku z tych samych danych. Zamyka A5 bez PDF-a do utrzymania.
- Poprawki techniczne audytu: header widoczny od razu (C1), fonty i ikony lokalnie
  (D1, D2), nagłówki bezpieczeństwa i prawdziwe 404 (D3, B4), sitemap (B3), JSON-LD i
  `llms.txt` (B5), OG locale (B6), README (D5).
- Slot na zdjęcie (`DuotonePhoto.vue`).
- Skills „gdzie użyte” (C3): tania zmiana, zamienia tag wall w dowód.
- Kontakt z e-mailem na pierwszym miejscu i przyciskiem kopiowania.
- Wzór skryptu `scripts/fetch-activity.mjs` (GitHub API przy buildzie + zapisany fallback
  w `src/generated/`) jako podstawa licznika archiwum. Sam commit log nie.

Nie przenosimy: `CommitLog.vue` (zastępuje go licznik + wybrane zmiany), skrótów
klawiszowych 1-4 (`useNavShortcuts.ts`), `ProductionStatus.vue` w hero (status CI zostaje
tylko jako mały badge na karcie Root Keepera).

Spoza gałęzi, nowe: prerender (B1). Lokalizacja w URL i `hreflang` (B2) odłożone.

## 7. Szkic treści (PL, do dopracowania w zmianie; EN po zatwierdzeniu PL)

### Hero

- Etykieta: `Backend Developer / PHP · Laravel`
- Nagłówek: „Od {years:modulesGarden} rozwijam produkcyjny produkt B2B: PanelAlpha
  w ModulesGarden.”
- Podtytuł: „Integracje z panelami hostingowymi, moduły WHMCS, feature od modelu danych po
  działającą logikę u klienta. Kod piszę z agentami AI, w procesie z testami i review, który
  ma publiczne dowody.”
- CTA: „Porozmawiajmy” (`/contact`), „CV” (`/cv`).

### Panel „W skrócie” (język rekrutera, bez liczb procesowych)

| Rola | Backend Developer (PHP / Laravel), ModulesGarden |
| Doświadczenie | {years:modulesGarden} komercyjnie, w tym {years:panelAlpha} przy PanelAlpha |
| Stack | PHP 8.5 · Laravel 13 · PostgreSQL / MySQL · Vue / React · Docker |
| Na produkcji | PanelAlpha (B2B) oraz 2 własne produkty na własnym VPS-ie |
| Praca z AI | Claude Code i MCP, proces z testami i review |
| Kontakt | kontakt@kostecki.dev |

### Doświadczenie: PanelAlpha (zakres, bez liczb)

- Integracje z panelami hostingowymi (cPanel, Plesk, DirectAdmin) i PowerDNS oraz usługami e-mail, SSL, backup i storage.
- Moduły WHMCS (pięć, z notą o autorstwie, jak dziś).
- Migracja client area z Vue 2 / Vuetify 2 do Vue 3 / Vuetify 4 / TypeScript
  **(tylko po zgodzie pracodawcy; inaczej pomijamy).** Zgoda nadal czeka (p. 9), więc
  punkt nie jest pokazywany.
- Wkład w open-source'owy PanelAlpha Engine: auto-deploy z git push, menedżer plików,
  dyrektywy PHP per domena, statystyki transferu. Bez osobnego linku do commitów (p. 4).
  Jedno zdanie kontekstu: platforma, którą agenci AI operują przez MCP.

### Praca z agentami AI

- Lead: „Każda zmiana zostawia w repozytorium folder z dokumentacją. Kilka, które
  pokazują, jak to działa:”
- Wybrane zmiany (wdrożone w `site-focus-ai-proof`; etykiety bez dat):
  - Root Keeper `production-data-safety`: co pokazuje: zasady pracy na danych produkcyjnych
    (szyfrowane kopie, backup przed migracją) ustalone, zanim na produkcję trafiły prawdziwe dane.
  - Root Keeper `restore-from-backup`: co pokazuje: odtwarzanie z kopii jako przepływ
    testowany w CI, nie skrypt w szufladzie.
  - Root Keeper `testing-ownership-boundaries`: co pokazuje: granice własności danych
    między kontami sprawdzane testami.
  - Root Keeper `e2e-in-ci`: co pokazuje: Playwright wpięty w pipeline przy każdym PR,
    nie odpalany ręcznie.
  - Skarbnik `import-category-suggestions`: co pokazuje: podpowiedzi kategorii przy
    imporcie jako logika domenowa (model, ADR, testy), nie tylko UI.
- Pod listą: liczba + „Zarchiwizowane zmiany w dwóch publicznych repozytoriach” z linkami
  do obu archiwów. Liczba z buildu, fallback w `src/generated/`.
- Cztery kroki jak dziś (kontekst, research → plan → wdrożenie, reguły, bramki jakości).
- Zamknięcie jak dziś: „Agent przyspiesza pisanie. Kontekst, testy i review decydują,
  co z tego zostaje.”

### Własne produkty: linia „co udowadnia” (bez liczb)

- **Domowy Skarbnik.** Udowadnia: Laravel 13 + PostgreSQL + Inertia od zera do
  produkcji, z ADR, changelogiem i testami Pest w CI.
- **Root Keeper.** Udowadnia: ten sam backend z innym frontendem (React 19 + TypeScript),
  pipeline'y CI: lint, Larastan, Pest, Playwright e2e.

## 8. Zasady treści (obowiązują każdą zmianę)

- Każde twierdzenie ma link do dowodu albo nie wchodzi na stronę.
- Liczby tylko liczone przy buildzie albo wcale. Żadnych literałów, które się starzeją.
  Żadnych liczb o PanelAlpha bez zgody pracodawcy.
- Żadnych elementów, które z czasem pokazują „pustkę” albo datę ostatniej aktywności
  (commit log, wykres aktywności, lista „ostatnich” zmian z datami).
- Hero i panel „W skrócie” mówią językiem rekrutera. Język procesu (research, plan, review,
  ADR) zaczyna się od sekcji AI.
- Oba locale zmieniają się razem; `src/types/content.ts` aktualizowany przy nowych polach.
- Design tokens z `src/assets/main.css` bez zmian.

## 9. Otwarte

- Plik ze zdjęciem (Sebastian dostarcza).
- Zgoda ModulesGarden na opis migracji client area **oraz** potwierdzenie, że repo
  `client-area-next` może pozostać na prywatnym koncie (audyt, proposal p. 1).
- ~~Ostateczny wybór 3–5 zmian do sekcji AI~~ — zamknięte: zmiana `site-focus-ai-proof` (pięć pozycji, p. 7).
- Sposób prerenderu: post-build (np. prerender ścieżek z `src/router`) albo `vite-ssg`.
  Do rozstrzygnięcia w researchu zmiany.

## 10. Następny krok

0. **Higiena GitHub, bez kodu (godzina).** Bio, strona i firma w profilu są już ustawione.
   Zostaje: przypięcie repo (dziś 0 pinów: household-treasurer, root-keeper, menu-maker,
   kostecki-dev-landing), profil README (szkic: `context/github-profile-README.md`),
   „Include private contributions”. Strona linkuje do GitHuba, więc łańcuch dowodów
   zaczyna się tam.

Łańcuch zmian, po kolei:

1. `/10x-new site-focus-hero` — hero, panel „W skrócie”, liczone staże, zdjęcie, `/cv`,
   tytuł sekcji O mnie, link „Źródło” w stopce.
2. `/10x-new site-focus-ai-proof` — wybrane zmiany + licznik archiwum z buildu.
3. `/10x-new site-focus-experience` — zakres PanelAlpha z Engine, teasery produktów,
   skills „gdzie użyte”.
4. `/10x-new site-prerender` — prerender tras (B1), potem sitemap, JSON-LD, `llms.txt`
   mają sens.
5. `/10x-new site-audit-tech-fixes` — pozostałe poprawki techniczne z p. 6.

Każda zmiana cytuje ten dokument w `change.md`.

## 11. Dziennik rewizji

- **2026-11-09, przegląd własnych decyzji.** Zmieniono: lista „ostatnich zmian” →
  ręcznie wybrane zmiany bez dat (lista z datami pokazywałaby przerwy jak commit log;
  Root Keeper ma ostatnią zmianę z 2026-10-22, w Skarbniku 24 z 49 zmian to przebiegi UI);
  liczby w teaserach usunięte (literały starzeją się, sprzeczność z A6); branża hostingowa
  wyjęta z pierwszego zdania hero na rzecz nazwy produktu i pracodawcy; wiersz „Praca z AI”
  w panelu bez liczby zmian; dodano prerender (B1) jako osobną zmianę; dodano higienę
  GitHub jako krok 0; dopisek „konto firmowe” przy commitach Engine; link „Źródło”
  w stopce; tytuł sekcji O mnie; pytanie o `client-area-next` w otwartych.
- **2026-11-09, wdrożenie `site-focus-ai-proof`.** Sekcja AI pokazuje pięć wybranych zmian
  i licznik archiwum liczony przy buildzie. Zmieniono: p. 3.2 bez literału liczby i bez
  „każda z researchem, planem i przeglądem” (dane: plan w 114 ze 121 folderów, przegląd
  w 105); p. 7 lead i pozycja Skarbnika zgodne z wdrożoną kopią; para backup to jedna
  pozycja (`restore-from-backup`); krok 2 sekcji skorygowany; p. 9 zamknięty.
- **2026-11-09, wdrożenie `site-focus-experience`.** Engine nie ma osobnej karty na stronie
  głównej, w `/projects` ani w `/cv` (jest punktem w Doświadczeniu PanelAlpha). Skills tylko
  na `/skills`, z linią „gdzie użyte” przy każdej pozycji stacku podstawowego. Literały skali
  usunięte z kart produktów i CV, z testem strażnika. Skarbnik linkuje do publicznego repo.
