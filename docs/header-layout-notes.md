# Jak funguje společná hlavička a menu

Aktualizováno 1. 10. 2026 podle místního kódu. Tento dokument doplňuje [README](../README.md) podrobnostmi pro úpravy hlavičky. Současný stav a návrhy na další úklid jsou oddělené.

## Rozdělení práce

| Soubor | Úloha |
| --- | --- |
| `components/site-header.js` | Definuje `<site-header>`, vytvoří hlavičku a prázdné `#sideMenu`, měří výšku hlavičky. |
| `css/sdilene/menu/menu.css` | Rozložení hlavičky, obrázek menu, vysouvání panelu a podnabídky. |
| `css/sdilene/obecne-sdilene.css` | Odsazení obsahu pod pevnou hlavičkou a proměnné pro témata. |
| `scripts/generace-menu.js` | Jednou naplní panel odkazy a tlačítkem tématu, připojí obsluhu šipek. |
| `scripts/obecny.js` | Globální `toggleMenu()`, zavření mimo panel, volitelná minimapa a easter egg. |
| `scripts/light-modV2.js` | Modul pro přepínání tématu, obrázků ikon a komunikaci s iframe. |
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
<script src="../scripts/generace-menu.js"></script>
<script type="module" src="../scripts/light-modV2.js"></script>
```

Komponenta musí běžet před generováním menu, aby existovalo `#sideMenu`. Modul tématu potřebuje iframe a vygenerované `#button-theme-switch`. `obecny.js` ponech jako klasický skript: inline `onclick="toggleMenu()"` hledá globální funkci. Samotný `obecny.js` může běžet před komponentou, protože menu hledá až při kliknutí.

Existující stránky mají bloky v různém pořadí. Moduly se vykonávají po zpracování HTML, takže mohou v souboru předcházet pozdějším klasickým skriptům nebo iframe. Na Ozvěnách stínů 2 je i `generace-menu.js` modulem. Pro nové stránky používej ukázku výše, aby závislosti byly zřejmé.

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

Komponenta vytvoří vnitřní DOM jen jednou. Změna atributu upraví pouze příslušný text nebo obrázek; změna šířky neobnovuje menu. Otevřený panel, tlačítko tématu i listenery zůstávají zachované. Při odpojení komponenty se pozorování ukončí a proměnná výšky odstraní.

Staré skripty `responsivni-nav.js` a `responzivni-pro-pocitacV2.js` ani styly `menu2.css` a `menu-mobil.css` už toto řešení nepoužívá; nevracej jejich importy.

## Menu a téma

- Panel má šířku 250 px. Zavřený má `right: -250px`, otevřený třídu `.side-menu-open` a `right: 0`. Z komponenty vzniká s atributem `inert`.
- `toggleMenu()` přepíná třídu i `inert` a přidá/odebere obsluhu kliknutí mimo panel. `menuOutsideClick()` nyní odebere pouze třídu a listener; `inert` neobnoví.
- `runArrowCode()` běží jednou po naplnění menu. Pokud `navigator.userAgent` obsahuje `Mobile`, šipky reagují na kliknutí; jinak na hover. Po opuštění šipky se zavření odloží o 200 ms, aby šlo přejet na podnabídku.
- Modul tématu nejprve použije `dark`. V `iframe.onload` odešle `get-theme` na `https://burthgulash.github.io`; odpověď `{ type: "theme", value: "dark" | "light" }` aplikuje třídou na `<body>`.
- Tlačítko odešle `{ type: "set-theme", value: ... }` iframe a ihned změní místní vzhled. Iframe ukládá klíč `theme` do `localStorage`. Nejde o backend ani o průběžnou synchronizaci otevřených karet.
- `updateIcons()` přepíše obrázek menu a všechny prvky `#icon-img`. Název bere z `data-name`, příponu z `getImageFormat()` v `scripts/utilities/imgformat.js`. Světlá varianta musí mít název `<data-name>-light.<přípona>`.

## Známá omezení

- Spouštěč menu je klikací `<img>` a šipky jsou SVG bez klávesnicového ovládání. Chybí obsluha Escape, správa fokusu a přístupný název tlačítka tématu. Zavření mimo panel nechává skryté odkazy bez `inert`.
- Detekce podle `Mobile` nepopisuje spolehlivě dostupné vstupy. Šipky mají opakované `id="menu-sipka"`; více ikon na stránce má opakované `id="icon-img"`.
- Odkazy menu a obrázky tématu směřují na produkci i při místním náhledu. Odkaz na Z Popelu Kalicha stále míří do `/Chynicky_LARP/Z.Popelu.kalicha/`, ale místní stránka leží v `Odehrane LARPy/Z.Popelu.kalicha/`.
- Iframe tématu se načítá z produkce. Bez odpovědi zůstane počáteční tmavý vzhled; tlačítko stále mění místní vzhled. Již dokončené načtení iframe před připojením `onload` může být zmeškáno. Iframe nekontroluje původ zprávy ani hodnotu tématu; hlavní stránka kontroluje pouze původ, nikoli `event.source`.
- Přes hřebeny obsahuje dva iframe `#theme-sync` i dva importy modulu tématu. `getElementById()` pracuje s prvním iframe; modul stejného URL se vyhodnotí jen jednou.
- Hlavička je omezena šířkou viewportu, ale panel takové omezení nemá. Přetékání obsahu kalendáře může ovlivnit jeho polohu; úprava hlavičky tento problém neřešila.

## Malé návrhy na další úklid

Tyto návrhy nejsou v dokumentační úpravě implementované:

1. **Sjednotit blok importů a odstranit duplicity.** Na Přes hřebeny ponechat jediný iframe a import tématu; další stránky upravovat podle ukázky výše. Kvůli čtyřem skriptům není potřeba build systém.
2. **Mít jednu cestu pro stav panelu.** Otevření i obě možnosti zavření mohou sdílet krátkou funkci nastavující třídu, `inert` a stav přístupného tlačítka. Obrázek vložit do běžného `<button>` pro klávesnicové ovládání bez knihovny.
3. **Smazat nepoužívaný kód a ladicí výpisy.** `arrowSvg` v `generace-menu.js` nemá čtenáře, `menuBtn` v `toggleMenu()` se nepoužívá a `runArrowCode()` opakovaně loguje DOM. Jejich smazání nemění potřebné chování.
4. **Prověřit potřebu iframe tématu.** Pokud preference platí jen pro stránky na jednom původu, přímý `localStorage` v modulu odstraní iframe i protokol zpráv. Lokální server by měl vlastní preferenci. Pokud musí sdílet produkční nastavení, most zachovat a opravit načítání a kontrolu zpráv.

## Ověření

Dne 1. 10. 2026 byl popis porovnán s celými společnými skripty, souvisejícím CSS a všemi 12 HTML stránkami s hlavičkou. Tato aktualizace mění pouze dokumentaci; chování v prohlížeči nebylo znovu testováno.

Předchozí verze dokumentu z 19. 9. 2026 zaznamenávala testy v Chromium/Chrome na všech 12 stránkách při šířkách 320–1440 px: rozložení a odsazení, zachování DOM při resize, změny atributů, otevření/zavření menu, hover/touch podnabídky a světlé téma. Externí služby byly blokované a úložiště tématu nahrazovalo testovací iframe. Tyto historické výsledky nepotvrzují živou synchronizaci s produkcí ani chování v Safari/Firefox.
