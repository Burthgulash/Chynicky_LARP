# CSS

Sdílené styly patří do `css/sdilene/`; styly pro jednu stránku jsou přímo v `css/`.

| Soubor | Co nyní styluje |
| --- | --- |
| `sdilene/obecne-sdilene.css` | Barvy a témata, `body`, základní text, tlačítka, odkazy, popovery a odkazy na pravidla. |
| `sdilene/menu/menu.css` | Pevnou hlavičku `<site-header>`, vysouvací menu, submenu a přepínač tématu. |
| `sdilene/info.css` | Informační karty akcí, malé mapy a také karty a portréty na stránce O nás. |
| `sdilene/obrazky.css` | Náhledy fotek `.per-foto`, překryv `.zvetsene`, šipky a animace lightboxu. |
| `kalendar-akci.css` | Karty kalendáře, přehled odehraných LARPů a rozpracovanou stránku Návody. |
| `o-nas.css` | Úvodní text a úvodní obrázek stránky O nás. |
| `foto-galerie.css` | Výběr akce, tlačítko Filtrovat a rozestupy samostatné galerie. |

## Hlavička a mobilní zobrazení

Hlavičku i mobilní menu styluje `sdilene/menu/menu.css`. CSS grid drží nadpis uprostřed, dokud menu nepotřebuje místo; delší text se zalomí. Není zde samostatná mobilní hlavička ani mobilní CSS soubor.

`components/site-header.js` měří výšku hlavičky pomocí `ResizeObserver` a zapisuje `--site-header-height` do `body`. `obecne-sdilene.css` tuto hodnotu používá pro horní odsazení stránky; výchozí hodnota je `100px`. Při úpravě hlavičky nepřidávej další pevné horní odsazení jako náhradu za tento mechanismus.

Pro mobilní úpravy použij `@media` ve stejném souboru. Nyní má kalendář při šířce do `800px` jeden sloupec. Informační karty mění počet sloupců na hranicích `1300px`, `650px` a `500px`; karty organizátorů mají vlastní pravidla v `info.css`.

## Barvy a sdílené třídy

Téma nastavuje `scripts/light-modV2.js` třídou `body.dark` nebo `body.light`. Pro nové styly používej existující proměnné `--bg-clr`, `--bg-accent-clr` a `--text-clr`. Pozadí hlavičky používá `--nav-img`. Ikony mění JavaScript, jejich zdroj neurčuje CSS.

Styly načítá každá HTML stránka pomocí `<link>`; není zde bundler ani kompilace CSS. Cestu uprav podle hloubky stránky (`../css/…` nebo `../../css/…`). Pořadí `<link>` může ovlivnit výsledný styl, proto ho při drobné změně bez důvodu nepřehazuj.

Pozor na široké selektory: `kalendar-akci.css` nastavuje všechny `p` na stránce a `foto-galerie.css` všechny `h3`. `info.css` nastavuje `.mini-map` jako skrytou; její zobrazení na detailech akcí ovládá `scripts/obecny.js`. Samotné načtení `obrazky.css` nezapíná lightbox, ten potřebuje také HTML prvky a `scripts/galerie/foto-lightbox.js`.

Po úpravě vzhledu ověř dotčenou stránku v úzkém i širokém okně a v obou tématech. Test `node --test tests/renderers.test.mjs` kontroluje generované HTML, nikoli rozložení a barvy.
