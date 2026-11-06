# Sloučení PR #49 a ověření – 6. 11. 2026

Výchozí větev PR: `4082fb6` (`uklid-codebase`). Připojený `main`: `ea12f68` (uzavření registrace Za linií). Pracovní adresář už při zahájení obsahoval rozpracovaný merge těchto větví; jeho původní soubory a index byly před úpravami zazálohovány mimo repozitář.

## Jak se vyřešily konflikty

- Novější kalendář z `main` je přenesen do `scripts/kalendar/kalendar-data.js`: Za linií, jeho termín, obrázek chalupy, místní odkaz a text místa. Poslední ortel zůstává druhou kartou.
- Starý `larphlavni/index.html` zůstává přesměrováním na `kalendar-akci/index.html`. Novější texty a fotografie všech čtyř profilů z původního kalendáře jsou ve sdílené komponentě organizátorů; chybná adresa Kvidova portrétu je nahrazena místním souborem.
- Nová stránka `za-linii/za-linii.html` používá `<site-header>` s vnořeným `<site-menu>`, jeden import motivu, klasický `scripts/obecny.js` a `<organizator-popover>`. Staré menu, iframe motivu a neexistující skripty jsou odstraněné. Informační karty i názvy ikon odpovídají současným sdíleným stylům a souborům.
- Za linií zachovává uzavřenou registraci, ceny, vybavení, celý program a osm fotek ubytování. K původně nefunkčnímu tlačítku mapy je doplněn iframe a ovládání podle existujících detailů. Opravené jsou neuzavřené či nadbytečné HTML značky.
- Přesun fotografií provedený v `main` se uplatnil i na WebP náhledy z PR: všech 13 JPEG a 13 WebP je v `assets/per-foto/`. Katalog odkazuje na nové umístění. `usedOnSite`, pořadí, popisy a rozměry zůstávají stejné; nevznikly duplicitní fotografie ani nové veřejné položky galerie.
- Odstraněné `css/style2.css`, `css/kalendar-akci-mobil.css` a stará složka dat se nevracejí. Styl obrázku přidaný v `main` už je v současném `css/kalendar-akci.css`; `style2.css` nemělo v HTML na `main` žádného uživatele.

## Kontroly zdrojů

- `node --check` všech 13 JS souborů v `scripts/` a `components/` prošel.
- `git diff --check` a `git diff --cached --check` prošly; žádné nevyřešené konflikty.
- Jednorázová kontrola ověřila 218 místních statických URL v HTML, CSS a importech JS, včetně velikosti písmen. Nebyla nalezena chybějící cesta. Pozadí z CSS proměnných se vyhodnocovalo v místě použití v `menu.css`.
- Všech 118 cest `src` a `original` katalogu existuje, soubory se dekódují a rozměry odpovídají každému záznamu. Počty: OS1 17/17, OS2 29/29, PER 13/5 (celkem/zveřejněné).
- Všech 13 přesunutých JPEG je bajtově shodných s originály v `main`, všech 13 WebP s náhledy ve výchozí větvi PR.
- Všech 13 stránek s hlavičkou má právě jednu komponentu a jeden import motivu, s načtením hlavičky před motivem. Obě varianty ikon nového detailu existují.
- Porovnání textů HTML proti `main`, po vynechání společné navigace, skriptů, skrytých profilů a lightboxu, potvrdilo zachování textu Za linií a ostatních detailů. Zbývající obsahové rozdíly výchozího PR jsou níže.

Tyto jednorázové kontroly nepřidaly žádnou sadu testů ani závislost projektu. Kontrola cest a syntaxe sama neprokazuje běh v prohlížeči.

## Prohlížeč

Průzkum produkce a místního náhledu prováděl subagent Luna přes Chrome CUA. Náhled běžel pod `http://127.0.0.1:8050/Chynicky_LARP/`; produkce pod `https://burthgulash.github.io/Chynicky_LARP/`. První sandboxovaný server nebyl pro prohlížeč dosažitelný; uvedené výsledky jsou z funkčního druhého serveru.

- Široký kalendář zachovává dvě karty, jejich obrázky, názvy a termíny. Pozorované rozdíly rozměrů karet byly v jednotkách pixelů.
- Detail Za linií zachovává datum i obsah; načetlo se všech osm fotografií Per6 až Per13 a sedm sekčních ikon v obou motivech.
- Mapa se po stisknutí tlačítka zobrazila. Profil Kvida se otevřel; Escape zavřel profil i menu. Podnabídka kalendáře se otevřela.

- Světlý motiv se zachoval při přechodu z kalendáře na detail Za linií.
- Archiv zachoval pět karet a odkaz Přes hřebeny vede na vlastní detail. Na něm se načetlo všech pět fotek Per9 až Per13 s odkazy na JPEG originály; menu a Escape fungovaly.
- Samostatná galerie: filtry PER/OS1/OS2 zobrazily 5/17/29 náhledů bez rozbitých obrázků. Lightbox PER otevřel `Per9.jpg`, další šipka přešla na Per10 a Escape zavřel dialog. Tyto kontroly doběhly před upřesněním autora, že samostatná galerie není veřejná a nemusí se dále řešit.
- Úzký viewport a změna šířky nebyly ověřeny: CUA neposkytlo přímé nastavení okna a při pokusu o nativní Chrome UI zastavilo práci kvůli nejistotě při určení aktuální URL. Nešlo o odmítnutí schválení. Toto omezení se neobcházelo.

## Rozdíly a zbývající obsah k rozhodnutí autora

- **Rozpor termínu byl už v produkci:** kalendář má 2.–4. 11. 2026, detail Za linií 2.–4. 10. 2026. Bez podkladu se žádná hodnota neměnila.
- **Vizuální rozdíly už obsažené v PR:** hlavička používá nové rozložení a měřené odsazení, kalendář má mezeru `1em` mezi popisem a obrázkem i spodní mezeru `4px` u jmen organizátorů, karty lidí na O nás nově mají zaoblení `15px` a při šířce 501–650 px dva sloupce. Tyto styly při vyřešení merge nebyly přepisovány.
- **Fotografie:** PR používá dříve připravené ztrátově komprimované WebP náhledy. Také osm fotek ubytování na novém detailu používá tyto náhledy ve stejném rozlišení; JPEG originály se zachovaly. Nejde o záruku shodných pixelů s produkčními JPEG.
- **Další obsahové změny výchozího PR:** návody používají své popisky a „Zatím neuvedeno“ místo starých ukázkových dat; filtr galerie doplňuje Přes hřebeny a sjednocuje pravopis Ozvěn stínů; z detailu Ozvěn 2 zmizela ojedinělá nadbytečná uzavírací závorka. Nejde o obsah nově změněný při řešení konfliktů.
- **Opravené chování:** odkaz Přes hřebeny z archivu už vede na správný detail. Světlá ikona jídla se na novém detailu načítá; v produkci byla rozbitá. Aktualizované profily z hlavního kalendáře jsou nyní společné i pro ostatní stránky používající komponentu.
- **Známý nedostatek:** „a další“ v kalendáři stále nemá cílový profil. Menu nadále obsahuje původní výběr odkazů; nové stránky jsou přístupné z kalendáře, nikoli automatickým rozšířením nabídky.

Neověřuje se shoda každého pixelu všech stránek, Safari, Firefox ani fyzický dotyk. Produkční vydání po sloučení není tímto předběžným náhledem ověřené. Hosting a jeho propojení s Gitem se neměnily; přímý upload zdrojů ani sestaveného výstupu se nepoužil.
