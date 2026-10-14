# Pokyny pro práci v tomto repozitáři

Platí pro celý repozitář. Piš vysvětlení a dokumentaci česky, srozumitelně i pro člověka, který web nezná.

## Nejdřív pochop současný stav

1. Přečti [README.md](README.md). Obsahuje spuštění, mapu souborů, postupy úprav a konkrétní návrhy zjednodušení.
2. Přečti celou dotčenou funkci, její volající, HTML stránku, importy, datový soubor a příslušné CSS. Před úpravou sdíleného kódu vyhledej všechna jeho použití, například pomocí `rg --no-ignore -n 'site-header' --glob '*.html' .`.
3. Rozlišuj skutečné chování od rozpracovaného obsahu a návrhů v README. Návrhy nejsou automatickým zadáním k přepsání projektu.
4. Zkontroluj `git status --short` a zachovej cizí rozpracované změny.

## Základ projektu

- Jde o statický web z HTML, CSS a běžného JavaScriptu. Není tu framework, backend, databáze, `package.json`, správce balíčků ani build.
- Vstup je `kalendar-akci/index.html`, nikoli `index.html` v kořeni. Web je určený pro GitHub Pages pod `/Chynicky_LARP/`.
- Pro náhled použij HTTP server; `file://` nefunguje spolehlivě s moduly. Příkaz a omezení lokálního náhledu jsou v README.
- Node.js 22+ je volitelný pro kontrolu syntaxe. Pro běh webu ho návštěvník nepotřebuje. Složka `tests/` byla na přání autora odstraněna; bez nového zadání testy neobnovuj.

## Smlouvy, které při úpravách zachovej

### Hlavička, menu a motiv

- `<site-header>` a `components/site-header.js` vytvářejí hlavičku i `<site-menu id="sideMenu" class="side-menu" inert>`. Atributy hlavičky jsou `title`, `subtitle`, `image`; `.menu-btn` zůstává obrázek uvnitř tlačítka `.menu-toggle`.
- `site-header.js` se musí načíst před ES modulem `scripts/generace-menu.js`, který definuje `<site-menu>`. Menu vytváří DOM jednou přes `createElement` bez `innerHTML`; jeho odkazy odvozuje od `import.meta.url`.
- Komponenta menu spravuje stav panelu, kliknutí mimo, Escape, `inert` a `aria-expanded`; spouštěč je do jejího načtení vypnutý. Podnabídky ovládají tlačítka kliknutím či klávesnicí a najetím myši přes pointer události; nepřidávej detekci podle `userAgent` ani opakovaná ID šipek.
- `scripts/obecny.js` musí zůstat klasický skript: inline `onclick` používá globální `toggleMenu()`, který pouze deleguje na komponentu menu. Jeho dalšími funkcemi jsou minimapa v detailech akcí a easter egg.
- `scripts/light-modV2.js` je modul a importuje menu jako závislost. Při spuštění potřebuje tlačítko `#button-theme-switch` vytvořené komponentou; jeho obrázek i listener zachovej při změně motivu. Na stránce má být jen jeden import motivu; iframe motivu se nepoužívá a iframe map jsou samostatné.
- Motiv čte a ukládá klíč `theme` přímo v `localStorage`. Při načtení přijme pouze `light`, jinak použije `dark`; chyba úložiště nesmí zablokovat přepínání na současné stránce. Po `DOMContentLoaded` znovu aktualizuje ikony vykreslených karet. Volba se sdílí při načtení stránek stejného originu v daném prohlížeči, nikoli průběžně mezi otevřenými záložkami; lokální server má vlastní volbu oddělenou od produkce. Pro lokální náhled počítej s produkčními obrázky a některými odkazy v obsahu; odkazy menu respektují místní adresu.
- Současné přepínání ikon hledá `#icon-img` s `data-name="název"` a skládá produkční adresy `název.přípona` a `název-light.přípona` ve složce `Ikony-img`. Při změně tematické ikony ověř obě varianty; u nynějšího `jidlo-icon.webp` světlá varianta chybí. Ikony tlačítka motivu používají místní adresy odvozené od modulu.
- Hlavička používá CSS Grid v `css/sdilene/menu/menu.css`: menu 70 × 70 px, mezera alespoň 12 px, zalamování podle dostupného místa. `ResizeObserver` měří pouze výšku pro `--site-header-height`.
- Zachovej stabilní DOM menu a jeho listenery při změně šířky či nadpisu i opětovném připojení komponenty. Při odpojení menu odeber jeho listenery dokumentu. Nepřidávej druhé měření kolizí, resize loader ani znovuvytváření hlavičky. Podrobnosti jsou v [poznámkách k hlavičce](docs/header-layout-notes.md).

### Data a obsah

- Kalendář importuje `data` z `scripts/kalendar/kalendar-data.js` a zapisuje karty jednou do `.kalendar-akci2`. Pořadí určuje pole, `datum` je pole textů. `misto` je text nebo `{ misto, mapyLink? }`; `mapyLink` je `src` vložené mapy z Mapy.com.
- Návody mají svůj datový soubor a krátký renderer ve `scripts/navody/`. Jejich současná pole `datum` a `organizatori` neodpovídají popiskům nákladů a doby výroby; tato část ještě není hotová.
- Archiv `Odehrane LARPy/Odehrane LARPy.html` a texty detailů jsou ruční HTML. Úprava kalendáře je automaticky nemění.
- Organizátoři a mapy používají nativní `popover`/`popovertarget`. Jméno organizátora musí přesně odpovídat profilu v `components/organizator-popovers.js` a elementu na stránce. Hodnota `Již brzy` v poli `organizatori` je text bez popoveru; současné `a další` tuto výjimku nemá a jeho tlačítku chybí cíl.
- `foto-galerie-data.js` obsahuje `{ src, akce }`; nová akce potřebuje i odpovídající `<option>` v samostatné galerii. Fotky detailů jsou ručně v jejich HTML.
- `foto-lightbox.js` patří jen na stránky s náhledy `.per-foto-obrazek` a celou strukturou `#zvetsene`, `#zvetsene-img`, `#closeBtn`, `#prev`, `#next`. Samostatná filtrovaná galerie ho zatím nepoužívá. Její dynamické fotky samotný import lightboxu nepropojí.
- Renderery i komponenty spouštějí práci hned při načtení; přidávej je jen na stránky s požadovanými prvky. Nevytvářej obecný loader funkcí.

### Cesty, styly a vstupy

- Nezpracované relativní HTML URL a URL vložené rendererem se vyhodnocují vůči HTML stránce; modulové `import` vůči JS souboru a CSS `url(...)` vůči CSS souboru. Menu, galerie a obrázky profilů používají `new URL(..., import.meta.url)` a cesty odvozují od modulu.
- Počítej s mezerami, diakritikou, velikostí písmen a různě hlubokými složkami. Na GitHub Pages záleží na přesné cestě. Před přesunem nebo mazáním souboru vyhledej odkazy v HTML, JS i CSS.
- Vlastní nové odkazy preferuj relativní a ověř je i z vnořené stránky. Nepřidávej produkční adresy pro import lokálního kódu. Existující absolutní URL neopravuj plošně bez kontroly jejich významu.
- Sdílené styly patří do `css/sdilene/`, styly konkrétní stránky do `css/`. Hlavička i boční menu mají jeden soubor `css/sdilene/menu/menu.css`. Role stylů jsou v [css/css.md](css/css.md).
- `subtitle` záměrně přijímá autorské HTML odkazy a datové renderery používají `innerHTML`. Tyto hodnoty nyní pocházejí z repozitáře. Nepřipojuj sem neošetřený uživatelský vstup ani cizí data; na nové hranici zajisti bezpečné vložení textu a ověření URL.
- Zachovej základní přístupnost: ovládací prvky jako tlačítka, smysluplný `alt`, popisky a ovládání klávesnicí.

## Jak zjednodušovat

- Vyřeš konkrétní potřebu nejmenší změnou v místě příčiny. Oprava sdílené funkce je lepší než stejné záplaty v jejích volajících.
- Nejdřív použij existující kód, potom běžný JavaScript a nativní HTML/CSS. Novou závislost nebo build přidávej jen pro doloženou potřebu.
- Nevytvářej obecný renderer, konfigurační systém, továrnu či další komponentu jen pro možnost budoucího rozšíření. Dva krátké renderery mohou zůstat samostatné.
- Karty generuj podle existujícího vzoru `map(...).join("")` s jedním zápisem do cílového kontejneru. Pro navigaci použij odkaz; nevkládej tlačítko do odkazu.
- Odstraňuj prokazatelně nepoužívaný kód, debug výpisy a zakomentované pokusy. Nemaž obsah jen podle názvu; na `LALOK/` skutečně vedou odkazy.
- Nespojuj malou opravu s plošným přeformátováním, přejmenováním složek nebo přepisem architektury.
- Skutečný vědomý kompromis s omezením označ krátkým `ponytail:` komentářem, který řekne omezení a kdy ho změnit. Běžný jednoduchý kód nepotřebuje obhajobu.

## Ověření a předání

V aktuálním repozitáři nejsou automatizované testy. Historické soubory pro renderery, menu a obrázky byly odstraněny v commitu `ecd710e` („odstranit testy TESTY NECHCI“). Neodkazuj na ně jako na existující kontroly a bez nového zadání je neobnovuj.

- Změněný JS ověř přes `node --check cesta/k/souboru.js` a diff přes `git diff --check`. Kontrola syntaxe neověřuje běh v prohlížeči.
- U změn rendererů, dat nebo archivu ručně ověř počet a obsah karet, cíle odkazů a popoverů. Po změně obrázků ověř všechny odkazy na soubory a obě varianty tematických ikon.
- Pro novou netriviální logiku nebo opravu chyby ověř konkrétní případ, který změnu vyžadoval, a zapiš postup a skutečný výsledek; nezakládej kvůli tomu sadu testů bez výslovného požadavku.
- Změněnou funkci ověř na místním HTTP serveru. Sdílenou změnu zkontroluj na hlavní stránce a vnořeném detailu, v úzkém i širokém okně. Menu vyzkoušej také po změně šířky, téma při přechodu mezi stránkami; ostatní funkce podle zásahu.
- Při změně chování aktualizuj příslušnou část README a dotčené specializované poznámky. Aktuální popis odděluj od plánů i historických výsledků testování.
- Při předání stručně uveď změnu, provedené kontroly a konkrétní neověřené části. Netvrď, že kontrola syntaxe nebo čtení zdrojů ověřily prohlížeč či produkční nasazení.
