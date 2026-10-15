# Chýnické LARP akce

Informační web pro naše LARPy: termíny akcí, informace pro hráče, příběhy a fotky. LARP je hra, ve které účastníci naživo hrají své postavy.

Web tvoří obyčejné HTML, CSS a JavaScript, bez frameworku, backendu nebo buildu. Obsah upravíš přímo v souborech. Hlavní stránka je `kalendar-akci/index.html`; v kořeni `index.html` není.

[Otevřít web na GitHub Pages](https://burthgulash.github.io/Chynicky_LARP/kalendar-akci/index.html)

## První spuštění

1. Otevři složku repozitáře v editoru.
2. Spusť nad ní libovolný statický HTTP server, například rozšíření **Live Server ve VS Code**. Nic není potřeba instalovat přes npm ani sestavovat.
3. Na adrese svého serveru otevři `kalendar-akci/index.html`. Po úpravách stránku obnov, pokud to server nedělá automaticky.

HTML neotvírej dvojklikem jako `file://`, protože web používá JavaScriptové moduly. Interní odkazy zůstávají na adrese místního serveru; mapy, Google Fonts a externí dokumenty potřebují internet. Místní server má vlastní uloženou volbu světlého či tmavého motivu, oddělenou od produkce.

## Který soubor upravit

| Co chceš změnit | Kde začít |
| --- | --- |
| Termín, název, místo nebo obrázek akce v kalendáři | `scripts/kalendar/kalendar-data.js` |
| Vzhled karet kalendáře, archivu a návodů | `css/karty.css`; HTML kalendáře tvoří `scripts/kalendar/generace-kalendare.js` |
| Text konkrétní akce, pravidla, přihlášení | Příslušné HTML v `Odehrane LARPy/` |
| Seznam odehraných akcí | `Odehrane LARPy/Odehrane LARPy.html` — karty jsou ručně v HTML |
| O nás nebo příběhy | `O nas/O nás.html`, `pribehy/pribehy.html` |
| Odkazy a položky společného menu | `scripts/generace-menu.js` |
| Nadpis jedné stránky | Atributy jejího `<site-header>` |
| Společná hlavička a boční menu | `components/site-header.js`, `scripts/generace-menu.js`, `css/sdilene/menu/menu.css` |
| Barvy a přepínání motivu | `css/sdilene/obecne-sdilene.css`, `scripts/light-modV2.js` |
| Profily organizátorů v rozbalovacích oknech | `components/organizator-popovers.js` |
| Seznam návodů | `scripts/navody/navody-hlavni-data.js` — zatím rozpracované |
| Katalog fotek a vykreslení čtyř galerií | `scripts/galerie/foto-galerie-data.js`, `scripts/galerie/foto-galerie.js`; vzhled a lightbox: `css/sdilene/obrazky.css`, `scripts/galerie/foto-lightbox.js` |
| Obrázky a ikony | `assets/` |

Rozdělení stylů a důvody jejich umístění popisuje [přehled CSS složek](css/css.md).

## Běžné úpravy

- **Akce:** pořadí karet určuje pořadí v `kalendar-data.js`. Archiv a detaily upravuj zvlášť v HTML; změna kalendáře je automaticky neupraví. U místa s mapou patří do `mapyLink` adresa `src` z kódu pro vložení mapy na Mapy.com.
- **Organizátoři:** jméno v datech musí přesně odpovídat profilu v `organizator-popovers.js` a prvku `<organizator-popover name="…">` na stránce.
- **Nová stránka:** vyjdi například z `pribehy/pribehy.html`, uprav obsah, nadpis a cesty. Zachovej pořadí společných skriptů a načti jen styly a funkce, které stránka potřebuje. Menu načítá modul motivu; jeho samostatný import do HTML není potřeba. Odkaz do menu nebo kalendáře se přidává ručně; zapojení hlavičky popisují [samostatné poznámky](docs/header-layout-notes.md).
- **Fotografie:** soubor ulož do `assets/` a záznam přidej do `foto-galerie-data.js`. Cesty `src` a `original` jsou vůči `assets/`; doplň skutečné rozměry náhledu a popis `alt`. `usedOnSite: true` fotku zařadí do galerie, `false` ji ponechá jen v katalogu. Pro nové album doplň také volbu v samostatné galerii a odpovídající `data-akce` v detailu. Náhledy do HTML ručně nepřidávej.
- **Cesty:** relativní odkazy v HTML a kartách kalendáře či návodů vycházejí z HTML stránky, importy z JS souboru a `url(...)` z CSS souboru. Nové vlastní odkazy piš relativně a počítej s vnořenými složkami, diakritikou i velikostí písmen. Před přesunem nebo smazáním souboru vyhledej všechna použití.
- **Ikony motivu:** označ je atributem `data-name="název"`, bez společného ID. Při výměně ověř běžnou i světlou variantu `-light` v `assets/Ikony-img/`. Kalendář a návody označují otazník podle obrázku `questionmark.png`, nezávisle na textu karty.

`LALOK/` obsahuje samostatné žertovné stránky, na které vedou odkazy z akcí. Nejde o vzor společné hlavičky. Katalog galerie je určený pro fotografie alb; portréty, ikony a ilustrace do něj nepatří. Data a HTML podnadpisů jsou autorský obsah repozitáře; cizí nebo uživatelský vstup vyžaduje bezpečné vložení, protože renderery používají `innerHTML`.

## Co zlepšit a zjednodušit dál

Následující body jsou rozpracovaný obsah a známé nedostatky, nikoli hotové opravy:

- Doplnit skutečné údaje a detaily návodů; zatím používají „Zatím neuvedeno“ a odkaz `#`. `mista-akci/mista-akci.html` je prázdný soubor.
- Dořešit `a další` v kalendáři, jehož tlačítko nemá cílový profil organizátora.
- Doplnit chybějící světlou variantu `jidlo-icon-light.webp` použitou v Z Popelu kalicha.

## Kontrola změn

Automatizované testy v repozitáři nejsou. Pro změněný JavaScript můžeš s volitelným Node.js 22+ použít `node --check cesta/k/souboru.js`; ověří jen syntaxi. Diff zkontroluj pomocí `git diff --check`.

Na místním serveru vyzkoušej změněnou stránku v úzkém i širokém okně a v obou motivech. U společných úprav zkontroluj také kalendář a vnořený detail akce. Podle zásahu ověř menu a klávesnici, přechod mezi stránkami, karty, mapy, profily nebo galerii a zvětšování fotek. Zkontroluj cíle odkazů, načtení obrázků a chyby v konzoli. V předání rozlišuj skutečně provedené kontroly od neověřených částí.

## Další dokumentace a publikování

- [Rozdělení CSS složek a souborů](css/css.md)
- [Podrobnosti společné hlavičky a menu](docs/header-layout-notes.md)
- [Měření komprese fotografií](docs/webp-compression.md)
- [Pokyny pro práci v repozitáři a pro AI](AGENTS.md)

Web je určený pro GitHub Pages pod `/Chynicky_LARP/` a publikuje přímo soubory bez buildu. Zdrojovou větev a složku ověř v **Settings → Pages**; vlastní nasazovací workflow tu není. Před publikováním zkontroluj hlavně cesty z vnořených stránek.

[LICENSE](LICENSE) obsahuje CC0 1.0 Universal. U převzatých ikon zachovej uvedené autory a licenční poznámky v HTML a skriptech.
