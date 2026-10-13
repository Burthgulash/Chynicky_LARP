# Jak funguje společná hlavička a menu

Aktualizováno 13. 10. 2026 podle místního kódu. Tento dokument doplňuje [README](../README.md) podrobnostmi pro úpravy hlavičky. Současný stav a návrhy na další úklid jsou oddělené.

## Rozdělení práce

| Soubor | Úloha |
| --- | --- |
| `components/site-header.js` | Definuje `<site-header>`, vytvoří hlavičku, tlačítko `.menu-toggle` a `<site-menu id="sideMenu">`, měří výšku hlavičky. |
| `css/sdilene/menu/menu.css` | Rozložení hlavičky, obrázek menu, vysouvání panelu a podnabídky. |
| `css/sdilene/obecne-sdilene.css` | Odsazení obsahu pod pevnou hlavičkou a proměnné pro témata. |
| `scripts/generace-menu.js` | ES modul definující `<site-menu>`; sestaví DOM bez `innerHTML` a spravuje panel i podnabídky. |
| `scripts/obecny.js` | Globální `toggleMenu()` delegující na komponentu, volitelná minimapa a easter egg. |
| `scripts/light-modV2.js` | Importuje menu a přepíná téma, obrázky ikon i komunikaci s iframe. |
| `light-mod-cloud-web/light-mod-cloud-web.html` | Stránka v iframe; ukládá `localStorage.theme` na produkční doméně. |

Hlavičku nyní používá 12 HTML stránek. Na jedné stránce má být právě jeden `<site-header>` a jeden iframe `#theme-sync`. Komponenta používá běžný DOM; společné CSS přímo styluje její obsah.

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

Komponenty vytvoří vnitřní DOM jen jednou. Změna atributu hlavičky upraví pouze příslušný text nebo obrázek; změna šířky neobnovuje menu. Otevřený panel, tlačítko tématu i listenery zůstávají zachované. Při odpojení hlavičky se pozorování ukončí a proměnná výšky odstraní. Menu při odpojení zavře panel a odebere listenery dokumentu; po opětovném připojení zachová své uzly a obsluhu ovládacích prvků.

Staré skripty `responsivni-nav.js` a `responzivni-pro-pocitacV2.js` ani styly `menu2.css` a `menu-mobil.css` už toto řešení nepoužívá; nevracej jejich importy.

## Menu a téma

- Panel má šířku 250 px. Zavřený má `right: -250px`, otevřený třídu `.side-menu-open` a `right: 0`. Začíná pod hlavičkou podle `--site-header-height`; jeho výška je `calc(100dvh - var(--site-header-height, 100px))` a `overflow-y: auto` umožňuje posouvat delší nabídku v krátkém okně. Hlavička vytváří `<site-menu>` s atributem `inert`; komponenta přidá roli navigace a přístupný název.
- Globální `toggleMenu()` jen zavolá `toggle()` komponenty. Její `setOpen()` sjednocuje třídu, `inert`, `aria-expanded` spouštěče a listenery pro kliknutí mimo panel i Escape. Při zavření s fokusem uvnitř panelu vrátí fokus na spouštěč. Kliknutí na odkaz panel také zavře.
- Podnabídky mají tlačítka `.menu-sipka` s `aria-controls` a `aria-expanded`. Kliknutí je přepne a ponechá otevřené i po odjetí myši; funguje dotykem i klávesami Enter/mezerník. `pointerenter` s `pointerType="mouse"` nabídku otevře. Po opuštění skupiny nebo odchodu fokusu se zavře, pokud není připnutá kliknutím ani používaná myší či fokusem. Rozhodování podle `userAgent` se nepoužívá.
- DOM odkazů, tlačítek a SVG vzniká přes `createElement`, `createElementNS` a `append`, bez `innerHTML`. Adresy menu se odvozují od kořene modulu přes `import.meta.url`, včetně správné složky `Odehrane LARPy/Z.Popelu.kalicha/`.
- Modul tématu nejprve použije `dark`. Po připojení obsluhy odpovědí zavolá `requestTheme()` ihned a také při události `load` iframe. Odešle `get-theme` na `https://burthgulash.github.io`, i když iframe dokončil načtení před spuštěním modulu; odpověď `{ type: "theme", value: "dark" | "light" }` aplikuje třídou na `<body>`.
- Tlačítko odešle `{ type: "set-theme", value: ... }` iframe a ihned změní místní vzhled. Iframe ukládá klíč `theme` do `localStorage`. Nejde o backend ani o průběžnou synchronizaci otevřených karet.
- `updateIcons()` přepíše zdroj obrázku `.menu-btn` uvnitř spouštěče a všechny prvky `#icon-img`. Název bere z `data-name`, příponu z `getImageFormat()` v `scripts/utilities/imgformat.js`. Světlá varianta musí mít název `<data-name>-light.<přípona>`.
- `updateThemeIcon()` mění zdroj stávajícího obrázku v `#button-theme-switch` a přístupný popisek tlačítka. Obrázky slunce a měsíce odvozuje od umístění modulu; tlačítko, obrázek i listener zůstávají stejné.

## Známá omezení

- Více obsahových ikon na stránce má opakované `id="icon-img"`.
- Obrázek spouštěče menu a obsahové ikony přepínané motivem stále směřují na produkci i při místním náhledu.
- Iframe tématu se načítá z produkce. Bez odpovědi zůstane počáteční tmavý vzhled; tlačítko stále mění místní vzhled. Iframe nekontroluje původ zprávy ani hodnotu tématu; hlavní stránka kontroluje pouze původ, nikoli `event.source`.

## Malé návrhy na další úklid

Tento návrh zatím není implementovaný:

1. **Prověřit potřebu iframe tématu.** Pokud preference platí jen pro stránky na jednom původu, přímý `localStorage` v modulu odstraní iframe i protokol zpráv. Lokální server by měl vlastní preferenci. Pokud musí sdílet produkční nastavení, most zachovat a opravit načítání a kontrolu zpráv.

## Ověření

Dne 1. 10. 2026 byl tehdejší popis porovnán s celými společnými skripty, souvisejícím CSS a všemi 12 HTML stránkami s hlavičkou. Šlo pouze o dokumentační kontrolu bez nového testu chování v prohlížeči.

Pro současné menu spusť `node --test tests/menu.test.mjs`. Kontroluje zapojení 12 stránek, místní cesty, tvorbu bez `innerHTML`, bezpečné spuštění před načtením komponenty a s náhradním DOM stav panelu, zavírání, fokus, listenery a zachování uzlů při opětovném připojení. Ověřuje i obsluhy podnabídek pro kliknutí, myš, dotyk a odchod fokusu. S náhradním iframe kontroluje dotaz na motiv ihned i při `load`, odpovědi, přepínání a zachování obrázku tlačítka. Nenahrazuje skutečný prohlížeč, rozložení ani živý iframe motivu.

Dne 13. 10. 2026 bylo na místním HTTP serveru v prohlížeči ověřeno všech 12 stránek: otevření menu, zavření Escape, `inert` a právě jeden iframe i tlačítko motivu. Ověřeno bylo také devět místních odkazů, ovládání Enter a kliknutí mimo panel, šířky 320, 360 a 1440 px a navigace přes menu z kalendáře na Z Popelu Kalicha a O nás. Po opravě spuštění modulu motivu bylo ověřeno zachování světlého motivu při kontrole všech 12 stránek. V detailu Z Popelu Kalicha při 320 × 600 px s oběma rozbalenými podnabídkami končil panel u dolního okraje okna, šel posouvat a spodní přepínač motivu byl dostupný a funkční. Produkční iframe při této kontrole odpovídal; konzole nehlásila chyby ani varování. Safari, Firefox a fyzické ovládání dotykem či najetím myši nebyly ověřeny; Node test kontroluje jen jejich obsluhy s náhradními událostmi.

Předchozí verze dokumentu z 19. 9. 2026 zaznamenávala testy v Chromium/Chrome na všech 12 stránkách při šířkách 320–1440 px: rozložení a odsazení, zachování DOM při resize, změny atributů, otevření/zavření menu, hover/touch podnabídky a světlé téma. Externí služby byly blokované a úložiště tématu nahrazovalo testovací iframe. Tyto historické výsledky nepotvrzují živou synchronizaci s produkcí ani chování v Safari/Firefox.
