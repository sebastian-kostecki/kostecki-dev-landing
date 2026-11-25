# update-v1: przegląd briefu „zmiany po aktualizacji LinkedIna” (2026-11-25)

Przegląd z perspektywy projektanta strony i rekrutera. Brief zestawiony z: wersją na żywo
(kostecki.dev, pobrana 2026-11-25), `origin/master` (z tego buduje się produkcja) i
`context/foundation/site-focus.md`. Zrzutów ekranu brak (rozszerzenie Chrome nie odpowiedziało),
ocena układu opiera się na tekście z prerenderowanego HTML.

## Werdykt

Kierunek jest dobry i przeważnie konieczny. Strona dziś mówi rzeczy nieprawdziwe w stosunku
do LinkedIna: Cursor, „2 produkty”, Menu Maker jako WIP, PanelAlpha jako „automatyzacja
WordPressa”, daty od 11.2022. To trzeba poprawić bez dyskusji.

Brief ma jednak trzy problemy blokujące i kilka luk. Bez ich rozwiązania `pnpm test` nie
przejdzie albo strona pokaże nowy błąd.

## Blokujące

### B1. Brief jest pisany pod starą gałąź

Lokalna gałąź `feat/site-niche-and-collaboration` jest 15 commitów za `origin/master`.
Na masterze i na produkcji już są linki budget.kostecki.dev i genealogy.kostecki.dev oraz
licznik archiwum z trzech repo (z Menu Makerem). Zmianę zaczynamy od świeżego `origin/master`,
nie od bieżącej gałęzi.

### B2. Nowy `meta.description` łamie `positioning.spec.ts`

Test wymaga w opisie: cPanel, Plesk, DirectAdmin, WHMCS, PowerDNS, Laravel. Propozycja
z briefu („integracje z panelami hostingowymi, WHMCS, PowerDNS i hosting projektów z Gita”)
gubi trzy nazwy paneli. Brief sam mówi, żeby nie osłabiać asercji, więc zmieniamy tekst:

> PL: „Full-stack Developer (Laravel + Vue): integracje z panelami hostingowymi (cPanel, Plesk,
> DirectAdmin), WHMCS i PowerDNS, hosting projektów z Gita. PanelAlpha i własne produkty.”

Ma ok. 175 znaków, czyli o kilka więcej, niż Google pokaże w wyniku. Ucina się końcówka
o produktach, a nisza zostaje. Akceptowalne.

### B3. Strona `/cv` jest wyłączona

`cv.href` jest pusty, więc trasa `/cv` nie istnieje (na produkcji 404), a w hero nie ma
przycisku CV. Krok 3 sprawdzenia („otwórz `/cv` w obu językach”) się nie uda. Punkt 7 briefu
dotyczy tylko `context/cv/*.md`, które strona nie czyta.

**Rozstrzygnięte 2026-11-25:** Sebastian zdecydował „nie dodawaj CV”. `/cv` zostaje
ukryte (`cv.href` pusty), z kroku 3 sprawdzenia znika `/cv`, a punkt 7 briefu (plik
`context/cv/*`) wypada z tej zmiany. Z tego powodu sprawa poziomu angielskiego (D3) też nie
dotyczy tej zmiany. Teksty w `routes.cv.description` aktualizujemy razem z resztą, żeby nie
zostawić „Backend Developera” w treści, ale trasy nie włączamy.

Pierwotne pytanie: czy ta zmiana publikuje CV (ustawia `cv.href`, wraca przycisk w hero i nagłówku),
czy tylko aktualizuje plik źródłowy. Przy okazji: `context/cv/sebastian-kostecki-pl.md` ma
stare domeny (treasurer., genealog.), czego brief nie wymienia. Po zmianie trzeba też
przegenerować `.html` i `.pdf` obok.

## Do potwierdzenia przed planem

### D1. Zgoda na opis migracji Vue 3 + TypeScript

**Rozstrzygnięte 2026-11-25:** Sebastian potwierdził, że jest zgoda ModulesGarden. Plan zapisuje
ją w tabeli decyzji `site-focus.md` (p. 4) i zamyka tę część p. 9.

`site-focus.md` p. 7 i 9: punkt o migracji client area pokazujemy „tylko po zgodzie pracodawcy”,
a zgoda czeka. Brief wpisuje migrację w czterech miejscach (about, skills, responsibilities, CV).
Jeśli LinkedIn i README już to mówią, zgoda pewnie jest. Wtedy trzeba ją zapisać w tabeli
decyzji i zamknąć p. 9. Inaczej punkt 0 zmienia rolę, a strona łamie własną zasadę.

To samo dotyczy „projektów interfejsu w Claude Design” w zakresie pracy przy PanelAlpha.
To informacja o wewnętrznym procesie pracodawcy.

### D2. Linki do Engine i Single Server Edition

Brief mówi „dodaj drugi link”. Dziś `openSourceContribution` nie ma żadnego linku, celowo
(decyzja z p. 4: „bez osobnego linku do commitów”). Mimo to rekomenduję dodać oba linki do repo
(nie do commitów). Single Server Edition, w którym robiłeś backend i frontend, to jedyny
**publiczny** dowód tezy „full-stack w produkcie komercyjnym”. Zasada p. 8 („każde twierdzenie
ma link do dowodu”) wręcz tego wymaga. Koszt: nowe pole w `src/types/content.ts` i zmiana
komponentu. Trzeba to dopisać do tabeli decyzji jako zmianę p. 4.

### D3. Poziom angielskiego

To Twoja decyzja. Uwaga od strony rekrutera: „średniozaawansowany” na LinkedInie i A2 w CV to
sprzeczność, którą ktoś zauważy. Wybierz jedną wartość i wpisz ją w obu miejscach.

## Luki: rzeczy, których brief nie widzi

1. **„4 lata komercyjnie, w tym 4 lata przy PanelAlpha”.** Po zmianie dat oba staże w panelu
   „W skrócie” dadzą ten sam wynik (2022-07 → 4 lata, 2022-11 → 4 lata, zaokrąglenie do pół roku
   w dół). Wiersz będzie wyglądał jak błąd. Proponuję
   „{years:modulesGarden} komercyjnie w ModulesGarden, od {since:panelAlpha} przy PanelAlpha”
   albo pominięcie drugiej części. Ta sama powtórka pojawi się w karcie PanelAlpha („4 lata”)
   i w O mnie.
2. **Stopka, drugi punkt specjalizacji:** „API, integracje zewnętrzne i automatyzacja WordPress”.
   Brief zmienia tylko pierwszy, a drugi ma ten sam stary opis PanelAlpha. Propozycja:
   „API, integracje zewnętrzne i hosting projektów”.
3. **Kategoria umiejętności „Frontend uzupełniający”** i poziom „Frontend feature'ów” w stacku
   podstawowym. Brief zmienia opis, ale nazwa „uzupełniający” zaprzecza roli full-stack.
   Propozycje: „Frontend (Vue 3 + TypeScript)” i poziom „Interfejsy produktu”.
4. **Punkt 6 (integracje) jest prawie pusty.** Cloudflare i Bunny DNS już są w grupie integracji,
   a WP Cloud jest w grupie WordPress. Do zrobienia zostaje najwyżej przeniesienie WP Cloud.
5. **Punkt 8 (SEO) nie wymaga zmian w kodzie.** `structured-data.ts` bierze `jobTitle`
   z `hero.label`, a `llms.ts` bierze opis z `meta.description`. Literałów do poprawy w tych
   plikach nie ma. Wystarczą JSON-y i `index.html`.
6. **Powtórzenie w karcie PanelAlpha.** Nowy opis („hosting projektów na własnych serwerach…”)
   i dotychczasowy kontekst Engine („platforma do self-hostingu projektów…”) mówią prawie to samo,
   jedno pod drugim. Kontekst Engine skróć do części o MCP i agentach.
7. **Lista „Mój wkład” rośnie do 6 punktów, plus Engine, plus SSE.** To za dużo jak na kartę,
   którą się skanuje. Proponuję połączyć „Cykl życia instancji WordPress oraz obsługa Git”
   z nowym opisem produktu („Hosting projektów z Gita i WordPressa: cykl życia instancji”),
   a SSE dać jako drugi element bloku open source, nie jako punkt listy. Pamiętaj, że test
   wymaga tej samej liczby punktów w PL i EN.

8. **Wpisany na sztywno staż modułów WHMCS.** Na `/projects` karta ma `period: "~6 miesięcy"`
   (EN „~6 months”, `pl.json`/`en.json` linia 400). Po zmianie dat (07–11.2022) to około
   4 miesiące. Brief każe szukać takich literałów („sprawdź, czy żaden tekst nie ma wpisanej na
   sztywno daty”), ale tego nie wymienia. Rola na tej karcie („PHP Developer”) zgadza się już
   z LinkedInem. Proponuję liczyć okres z dat albo wpisać zakres „07–11.2022”, bo zakres się nie
   starzeje.

## Widok przez Exa (2026-11-25)

Strona pobrana przez Exa (`web_fetch_exa`: `/`, `/projects`, `/skills`) pokazuje tę samą treść
co prerenderowany HTML, z tymi samymi nieaktualnymi miejscami. Z tego widoku wyszła luka 8.
Exa pomija niektóre elementy (etykietę hero, nazwę produktu w teaserze, listę wybranych zmian),
ale HTML jest semantyczny (`h3`, `ul`, `article`). To ograniczenie ekstraktora, a nie błąd
strony, więc nic tu nie zmieniamy.

## Uwagi projektowe do samych tekstów

- **Hero.** 16.11 hero wróciło do krótszej wersji, bo było „za dużo tekstu”. Fragment
  „…od modelu danych po interfejs w Vue…” ma **zastąpić** „…po działającą logikę u klienta”,
  a nie zostać dopisany obok. Wtedy długość się nie zmienia. Nowe valueProp
  („Aplikacje w Laravelu i Vue, / które działają na produkcji.”) łamie się w tym samym miejscu
  co stare, więc akcent zostaje na drugiej linii. Dobrze.
- **„Laravel + Vue” wszędzie.** Etykieta, tytuł, opis, stopka, CV, usługa… Spójność
  z LinkedInem jest ważna, ale ten sam zwrot pięć razy na jednym ekranie brzmi jak wypełniacz
  słów kluczowych. Pełna formuła wystarczy w etykiecie hero, w „W skrócie” i w meta. W tekstach
  ciągłych (O mnie, Współpraca) lepiej pisać naturalnie: „backend i interfejs”.
- **„Interfejsy projektuję w Claude Design” w sekcji AI.** To twierdzenie o projektowaniu
  bez dowodu, a zasada p. 8 mówi: link albo nic. Albo pokaż efekt (np. design system Skarbnika),
  albo napisz to jako narzędzie: „Agenci (Claude Code, Claude Design)”.
- **Menu Maker „Wersja live”.** menu.kostecki.dev przekierowuje na `/dashboard`, a
  genealogy.kostecki.dev na `/login`. Rekruter klika „live” i trafia na ekran logowania. To nie
  należy do tej zmiany, ale warto rozważyć konto demo albo publiczny podgląd. To dziś
  najsłabszy moment ścieżki „dowód → klik”.
- **Usunięcie „B2B” z „Na produkcji”** jest słuszne. Zostanie jeszcze „B2B” w tezie
  `site-focus.md` p. 2, a brief to już poprawia.
- **Dwa wyróżnione produkty zamiast trzech.** Zgadzam się z briefem. Trzy teasery rozbijają
  siatkę dwukolumnową, a Menu Maker jest najmłodszy.

## Kolejność wykonania (wejście do `/10x-plan`)

1. Gałąź od `origin/master`.
2. `site-focus.md`: rola, teza, decyzje D1–D2, zamknięcie p. 9.
3. Najpierw testy: daty (`useDuration`/career), panel „W skrócie” bez powtórzenia stażu,
   meta z sześcioma nazwami z niszy, brak „Cursor” i „backend developer” w zbudowanym HTML
   (z jawną listą wyjątków).
4. Treść PL+EN, `index.html`, skrypt OG + przegenerowanie obrazu.
5. CV (plik źródłowy, decyzja B3).
6. Build, sprawdzenie dist, archiwum zmiany.
