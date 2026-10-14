# CSS

Aktualizováno 13. 10. 2026 porovnáním se soubory CSS a jejich použitím v HTML a JavaScriptu. Tato kontrola sama neověřuje výsledný vzhled v prohlížeči.

Sdílené styly patří do `css/sdilene/`; styly pro jednu stránku nebo stejný typ karet jsou přímo v `css/`. Cesty v tabulce jsou relativní vůči této složce `css/`.

| Soubor | Co nyní styluje |
| --- | --- |
| `sdilene/obecne-sdilene.css` | Barvy a témata, `body`, společné `box-sizing: border-box`, základní text, tlačítka, odkazy, popovery a odkazy na pravidla. Importuje také Roboto z Google Fonts. |
| `sdilene/menu/menu.css` | Pevnou hlavičku `<site-header>`, vysouvací menu, submenu a přepínač tématu. |
| `sdilene/info.css` | Informační karty akcí, malé mapy a také karty a portréty na stránce O nás. |
| `sdilene/obrazky.css` | Náhledy fotek `.per-foto`, překryv `.zvetsene`, šipky a animace lightboxu. |
| `kalendar-akci.css` | Karty kalendáře, přehled odehraných LARPů a rozpracovanou stránku Návody. |
| `o-nas.css` | Úvodní text a úvodní obrázek stránky O nás. |
| `foto-galerie.css` | Výběr akce, tlačítko Filtrovat a rozestupy samostatné galerie. |

## Hlavička a mobilní zobrazení

Hlavičku i boční menu styluje `sdilene/menu/menu.css`. CSS Grid drží nadpis uprostřed, dokud menu nepotřebuje místo; delší text se zalomí. Obrázek menu má 70 × 70 px a od textu alespoň 12 px odstup. Hlavička nemá mobilní breakpoint ani samostatný mobilní CSS soubor. Podrobnosti jsou v [poznámkách k hlavičce](../docs/header-layout-notes.md).

`components/site-header.js` měří výšku hlavičky pomocí `ResizeObserver` a zapisuje `--site-header-height` do `body`. `obecne-sdilene.css` tuto hodnotu používá pro horní odsazení stránky; výchozí hodnota je `100px`. Při úpravě hlavičky nepřidávej další pevné horní odsazení jako náhradu za tento mechanismus.

Pro mobilní úpravy použij `@media` ve stejném souboru. Současná pravidla jsou:

| Obsah | Počet sloupců podle šířky okna |
| --- | --- |
| `.kalendar-akci2` v `kalendar-akci.css` | Dva; při šířce nejvýše 800 px jeden. Platí i pro archiv a návody. |
| `.info` v `sdilene/info.css` | Tři; od 1300 px čtyři, při nejvýše 650 px dva a při nejvýše 500 px jeden. |
| `.organizatori2` v `sdilene/info.css` | Tři; při nejvýše 650 px dva a při nejvýše 500 px jeden. |
| `.cepka2` v `sdilene/info.css` | Dva; při nejvýše 500 px jeden. |

Portréty `.foto` mají běžně šířku 150 px, při nejvýše 500 px 50 % a od 1400 px 40 % šířky svého kontejneru.

## Barvy a sdílené třídy

Téma nastavuje `scripts/light-modV2.js` třídou `body.dark` nebo `body.light`. Pro nové styly používej existující proměnné `--bg-clr`, `--bg-accent-clr` a `--text-clr`. Pozadí hlavičky používá `--nav-img`: tmavé odkazuje na `Nav.panel/temný les 3.jpg`, světlé na `Nav.panel/IMG_6357.webp`. Obě adresy jsou v CSS absolutní a načítají se z produkčních GitHub Pages i při místním náhledu. Ikony mění JavaScript, jejich zdroj neurčuje CSS.

HTML stránky načítají potřebné styly přímo pomocí `<link>`; není zde bundler ani kompilace CSS. Cestu uprav podle hloubky stránky (`../css/…` nebo `../../css/…`). Relativní `url(...)` uvnitř CSS se vyhodnocuje vůči souboru CSS, nikoli vůči HTML. Pořadí `<link>` může ovlivnit výsledný styl, proto ho při drobné změně bez důvodu nepřehazuj.

Pozor na široké selektory: `kalendar-akci.css` ruší okraje všech `p` na stránce a `foto-galerie.css` nastavuje všechny `h3`, včetně pevné bílé barvy i ve světlém motivu. `info.css` nastavuje `.mini-map` jako skrytou; její zobrazení na detailech akcí ovládá `scripts/obecny.js` přidáním `.show`. Mapy mají výšku 280 px a šířku 100 % kontejneru. Mapový popover kalendáře a jeho iframe styluje `kalendar-akci.css`, který omezuje šířku okna na `min(600px, 85vw)`. Kalendář `info.css` nenačítá, takže jeho mapy nemají výchozí `display: none`. Samotné načtení `obrazky.css` nezapíná lightbox, ten potřebuje také HTML prvky a `scripts/galerie/foto-lightbox.js`.

Po úpravě vzhledu ověř dotčenou stránku na místním HTTP serveru v úzkém i širokém okně a v obou tématech. Při změně sdíleného stylu zkontroluj hlavní stránku i vnořený detail. Menu otevři také při změně šířky a v nízkém okně ověř posouvání panelu. Před předáním spusť v kořeni `git diff --check`.

Složka `tests/` byla záměrně odstraněna v commitu `ecd710e`; dřívější příkazy `node --test tests/…` nyní nemají soubory, které by spustily. Kontrola dokumentace ani kontrola diffu nenahrazují ověření rozložení a barev v prohlížeči.
