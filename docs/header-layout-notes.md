# Jak funguje společná hlavička a menu

Aktualizováno 13. 10. 2026 porovnáním s místním kódem a HTML. Tento dokument doplňuje [README](../README.md) podrobnostmi pro úpravy hlavičky. Popis kódu, návrhy na další úklid a historické záznamy kontrol jsou oddělené.

## Rozdělení práce

| Soubor | Úloha |
| --- | --- |
| `components/site-header.js` | Definuje `<site-header>`, vytvoří hlavičku, tlačítko `.menu-toggle` a `<site-menu id="sideMenu">`, měří výšku hlavičky. |
| `css/sdilene/menu/menu.css` | Rozložení hlavičky, obrázek menu, vysouvání panelu a podnabídky. |
| `css/sdilene/obecne-sdilene.css` | Odsazení obsahu pod pevnou hlavičkou a proměnné pro témata. |
| `scripts/generace-menu.js` | ES modul definující `<site-menu>`; sestaví DOM bez `innerHTML` a spravuje panel i podnabídky. |
| `scripts/obecny.js` | Globální `toggleMenu()` delegující na komponentu, volitelná minimapa a easter egg. |
| `scripts/light-modV2.js` | Importuje menu a přepíná téma, obrázky ikon i komunikaci s iframe. |
| `light-mod-cloud-web/light-mod-cloud-web.html` | Pomocná stránka v iframe; ukládá klíč `theme` do `localStorage` originu, ze kterého se načte. Současné stránky načítají její produkční verzi. |

Hlavičku nyní používá 12 HTML stránek: kalendář, O nás, Příběhy, Návody, samostatná galerie, archiv a šest detailů akcí (Hraniční tvrz, Návrat mocného, obě Ozvěny stínů, Přes hřebeny a Z Popelu Kalicha). Každá má právě jeden `<site-header>`, jeden iframe `#theme-sync` a jeden import modulu motivu. Komponenta používá běžný DOM bez Shadow DOM; společné CSS přímo styluje její obsah.

## Vložení do stránky

```html
<site-header
  title="Název stránky"
  subtitle="Volitelný podnadpis"
  image="../kvido html-img/foto/Nav.panel/tri mece final final.png"
></site-header>
```

`title` je text; při prázdné hodnotě se použije `LARP`. Prázdný `subtitle` se skryje. Podnadpis podporuje HTML odkazy, které některé stránky používají pro související akce. HTML se v atributu zapisuje s `&lt;` a `&gt;` a má pocházet pouze od autora stránky. `image` je počáteční obrázek menu; modul tématu ho následně přepíše podle vzhledu.

Na konec `<body>` nové stránky vlož následující blok. Počet `../` uprav podle umístění souboru:

```html
<iframe id="theme-sync"
  src="https://burthgulash.github.io/Chynicky_LARP/light-mod-cloud-web/light-mod-cloud-web.html"
  style="display:none;"></iframe>
<script src="../components/site-header.js"></script>
<script src="../scripts/obecny.js"></script>
<script type="module" src="../scripts/generace-menu.js"></script>
<script type="module" src="../scripts/light-modV2.js"></script>
```

Hlavička musí běžet před registrací menu, aby existovalo `<site-menu id="sideMenu">`. Modul tématu importuje `generace-menu.js` jako závislost, aby při jeho spuštění existovalo tlačítko `#button-theme-switch`; potřebuje také iframe. `obecny.js` ponech jako klasický skript: inline `onclick="toggleMenu()"` na tlačítku `.menu-toggle` hledá globální funkci. Obrázek `.menu-btn` zůstává uvnitř tlačítka. Spouštěč má do připojení komponenty `disabled` a globální delegace bezpečně snese i volání před její registrací. Samotný `obecny.js` může běžet před komponentou, protože menu hledá až při kliknutí.

Všech 12 stránek se společnou hlavičkou nyní používá pořadí výše. Přes hřebeny má také jediný iframe a import motivu. `LALOK/`, pomocná stránka motivu, prázdná stránka míst a přesměrování ze starých vstupních a mobilních adres společné menu nepoužívají.

## Rozložení a změny velikosti

Hlavička je pevná nahoře a má `max-width: 100vw`. Nemá breakpoint pro mobil a počítač. Obrázek menu má vždy 70 × 70 CSS pixelů a od textu zbývá nejméně 12 px.

```css
grid-template-columns:
  minmax(0, 1fr)
  minmax(0, max-content)
  minmax(calc(var(--menu-size) + var(--menu-gap)), 1fr);
```

Text zabírá druhý sloupec, menu je u pravého okraje třetího. První sloupec je prázdný. Při dostatku místa mají krajní sloupce stejnou šířku a text je uprostřed celé hlavičky. Na úzké obrazovce pravý sloupec zachová 82 px, levý se zmenší až na nulu a text se zalomí. `min-width: 0` a `overflow-wrap: anywhere` brání přetékání dlouhého textu.

`ResizeObserver` sleduje výšku vnitřního `<header>` a zapisuje ji do `--site-header-height` na `<body>`. Společné CSS používá `padding-top: var(--site-header-height, 100px)`. Odsazení reaguje na zalomení textu, změnu atributů nebo písma. JavaScript nepřepočítává vodorovné rozložení.

Komponenty vytvoří vnitřní DOM jen jednou. Změna atributu hlavičky upraví pouze příslušný text nebo obrázek; změna šířky neobnovuje menu. Při změně šířky nebo nadpisu zůstávají otevřený panel, tlačítko tématu i listenery zachované. Při odpojení hlavičky se pozorování ukončí a proměnná výšky odstraní. Menu při odpojení zavře panel a odebere listenery dokumentu; po opětovném připojení zachová své uzly a obsluhu ovládacích prvků. Hlavička při opětovném připojení znovu použije své atributy, včetně počátečního `image`; zdroj obrázku menu tedy může přepsat i ve světlém motivu.

Staré skripty `responsivni-nav.js` a `responzivni-pro-pocitacV2.js` ani styly `menu2.css` a `menu-mobil.css` v repozitáři nejsou; nevracej jejich importy.

## Menu a téma

- Panel má šířku 250 px. Zavřený má `right: -250px`, otevřený třídu `.side-menu-open` a `right: 0`. Začíná pod hlavičkou podle `--site-header-height`; jeho výška je `calc(100dvh - var(--site-header-height, 100px))` a `overflow-y: auto` umožňuje posouvat delší nabídku v krátkém okně. Horní odsazení 60 px je součástí této výšky díky společnému `box-sizing: border-box`. Hlavička vytváří `<site-menu>` s atributem `inert`; komponenta přidá roli navigace a přístupný název.
- Globální `toggleMenu()` jen zavolá `toggle()` komponenty. Její `setOpen()` sjednocuje třídu, `inert`, `aria-expanded` spouštěče a listenery pro kliknutí mimo panel i Escape. Při zavření s fokusem uvnitř panelu vrátí fokus na spouštěč. Kliknutí na odkaz panel také zavře.
- Podnabídky mají tlačítka `.menu-sipka` s `aria-controls` a `aria-expanded`. Kliknutí je přepne a ponechá otevřené i po odjetí myši; funguje dotykem i klávesami Enter/mezerník. `pointerenter` s `pointerType="mouse"` nabídku otevře. Po opuštění skupiny nebo odchodu fokusu se zavře, pokud není připnutá kliknutím ani používaná myší či fokusem. Rozhodování podle `userAgent` se nepoužívá.
- DOM odkazů, tlačítek a SVG vzniká přes `createElement`, `createElementNS` a `append`, bez `innerHTML`. Devět odkazů menu se odvozuje od kořene modulu přes `import.meta.url`, včetně správné složky `Odehrane LARPy/Z.Popelu.kalicha/`. Na místním serveru vedou na místní stránky a při nasazení pod `/Chynicky_LARP/` zachovají tento prefix. Menu nyní neobsahuje odkazy na Návody, samostatnou galerii ani Přes hřebeny.
- Modul tématu nejprve použije `dark`. Po připojení obsluhy odpovědí zavolá `requestTheme()` ihned a také při události `load` iframe. Odešle `get-theme` na `https://burthgulash.github.io`, i když iframe dokončil načtení před spuštěním modulu; odpověď `{ type: "theme", value: "dark" | "light" }` aplikuje třídou na `<body>`.
- Tlačítko odešle `{ type: "set-theme", value: ... }` iframe a ihned změní místní vzhled. Iframe ukládá klíč `theme` do `localStorage`. Nejde o backend ani o průběžnou synchronizaci otevřených karet.
- `updateIcons()` přepíše zdroj obrázku `.menu-btn` uvnitř spouštěče a všechny prvky `#icon-img`. Název bere z `data-name`, příponu z `getImageFormat()` v `scripts/utilities/imgformat.js`. Světlá varianta musí mít název `<data-name>-light.<přípona>`.
- `updateThemeIcon()` mění zdroj stávajícího obrázku v `#button-theme-switch` a přístupný popisek tlačítka. Obrázky slunce a měsíce odvozuje od umístění modulu; tlačítko, obrázek i listener zůstávají stejné.
- Pozadí hlavičky vybírá CSS přes `--nav-img`. Tmavé používá `Nav.panel/temný les 3.jpg`, světlé `Nav.panel/IMG_6357.webp`; obě adresy jsou produkční i v místním náhledu.

## Známá omezení

- Více obsahových ikon na stránce má opakované `id="icon-img"`.
- Obrázek spouštěče menu, pozadí hlavičky a obsahové ikony přepínané motivem stále směřují na produkci i při místním náhledu. Ikony samotného tlačítka motivu se načítají místně.
- Iframe tématu se načítá z produkce. Bez odpovědi zůstane počáteční tmavý vzhled; tlačítko stále mění místní vzhled. Iframe nekontroluje původ zprávy ani hodnotu tématu; hlavní stránka kontroluje pouze původ, nikoli `event.source` ani povolenou hodnotu. Neočekávaná hodnota proto odstraní obě třídy motivu z `<body>`. Pouhé přepsání `src` iframe na místní cestu nestačí, protože cílový origin zpráv i kontrola původu zůstávají nastavené na `https://burthgulash.github.io`.

## Malé návrhy na další úklid

Tento návrh zatím není implementovaný:

1. **Prověřit potřebu iframe tématu.** Pokud preference platí jen pro stránky na jednom původu, přímý `localStorage` v modulu odstraní iframe i protokol zpráv. Lokální server by měl vlastní preferenci. Pokud musí sdílet produkční nastavení, most zachovat a doplnit kontrolu odesílatele i povolených hodnot.

## Jak změnu ověřit

Složka `tests/` byla záměrně odstraněna v commitu `ecd710e`. Dřívější příkaz pro `tests/menu.test.mjs` nyní není použitelný; pro tuto dokumentační aktualizaci se testy neobnovují.

Změněný JavaScript ověř pomocí `node --check cesta/k/souboru.js` a diff v kořeni pomocí `git diff --check`. Potom na místním HTTP serveru zkontroluj kalendář a vnořený detail akce:

- úzké i široké okno, dlouhý nadpis a menu ponechané otevřené při změně šířky;
- otevření a zavření panelu, Escape, kliknutí mimo, návrat fokusu a ovládání podnabídek myší i klávesnicí;
- v nízkém okně posouvání panelu až k tlačítku motivu;
- přepnutí obou motivů, přechod na další stránku a načtení obrázků;
- místní adresy odkazů, chybějící soubory a chyby v konzoli.

Při této aktualizaci bylo čtením souborů potvrzeno použití hlavičky na 12 stránkách, právě jeden iframe motivu a import jeho modulu na každé, pořadí společných skriptů a existence jejich místních cest. Popis rozložení a obsluh odpovídá společným skriptům a CSS.

Dne 13. 10. 2026 při této aktualizaci proběhla také kontrola na místním HTTP serveru v prohlížeči Codex. Všech 12 stránek bylo otevřeno při 320 × 800 a 1440 × 900 px; šířka obsahu nepřesáhla okno a ve širokém zobrazení odpovídalo horní odsazení výšce hlavičky. Na všech stránkách při 320 px fungovalo otevření menu a zavření klávesou Escape s obnovením `inert` a `aria-expanded`. V kalendáři byla vyzkoušena podnabídka klávesou Enter, otevřený panel zůstal otevřený při změně šířky a profil Kvida se otevřel. Přepnutí na světlý motiv přežilo přechod přes menu do Z Popelu Kalicha i následný průchod všemi 12 stránkami; produkční iframe tedy při této kontrole odpovídal. Nakonec byl obnoven původní tmavý motiv. Filtrovaná galerie vytvořila 29 fotek pro OS2 a 17 pro OS1; lightbox OS2 otevřel první originál, přešel na druhý a zavřel se klávesou Escape. Živé mapy, všechny vzdálené obrázky, Safari, Firefox, fyzický dotyk, najetí myší a produkční nasazení nebyly touto kontrolou ověřeny.

## Historické záznamy kontrol

Následující údaje pocházejí z dřívějšího textu tohoto dokumentu. Při této aktualizaci nebyly zopakovány ani nezávisle doloženy; nepotvrzují nynější běh webu.

- **19. 9. 2026:** tehdejší dokument uváděl kontrolu všech 12 stránek v Chromium/Chrome při šířkách 320–1440 px, včetně rozložení, odsazení, zachování DOM při resize, změn atributů, menu, podnabídek a světlého motivu. Externí služby byly blokované a úložiště motivu nahrazovalo testovací iframe.
- **1. 10. 2026:** předchozí text uváděl porovnání dokumentace se společnými skripty, CSS a 12 HTML stránkami bez nové kontroly chování v prohlížeči.
- **13. 10. 2026 před touto aktualizací:** text uváděl kontrolu všech 12 stránek na místním HTTP serveru, menu a jeho zavírání, `inert`, počtů iframe a tlačítka motivu, devíti místních odkazů, klávesy Enter, šířek 320, 360 a 1440 px a zachování světlého motivu při přechodu mezi stránkami. U detailu Z Popelu Kalicha při 320 × 600 px uváděl posouvání obou otevřených podnabídek až k funkčnímu přepínači motivu, odpověď produkčního iframe a konzoli bez chyb či varování. Safari, Firefox a fyzický dotyk či najetí myší tehdy uvedené kontroly nepokrývaly.

Dřívější Node test používal náhradní DOM a iframe. Jeho tehdejší výsledky ani uvedené historické kontroly nedokládají dnešní chování v Safari/Firefox nebo dnešní dostupnost produkčních služeb.
