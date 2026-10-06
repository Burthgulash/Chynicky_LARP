# Chýnické LARP akce

Malý informační web pro naše LARPy: termíny akcí, informace pro hráče, příběhy a fotky. LARP je hra, ve které účastníci naživo hrají své postavy.

**Web tvoří obyčejné HTML, CSS a JavaScript.** Nemá framework, databázi, backend, `package.json` ani build. Obsah upravíš v souborech a prohlížeč je rovnou načte. Node.js je potřeba jen pro testy.

Produkční adresa používaná v kódu je [GitHub Pages](https://burthgulash.github.io/Chynicky_LARP/kalendar-akci/index.html). Vstupní stránka v repozitáři je `kalendar-akci/index.html`; v kořeni žádný `index.html` není.

## První spuštění

1. Otevři složku repozitáře v editoru.
2. Spusť z jejího kořene statický HTTP server. Pokud máš Python 3:

   ```sh
   python -m http.server 8000 --bind 127.0.0.1
   ```

   Na Windows lze použít `py -3 -m http.server 8000 --bind 127.0.0.1`. Stejně poslouží Live Server v editoru. Projekt nic neinstaluje přes npm.
3. Otevři [lokální hlavní stránku](http://localhost:8000/kalendar-akci/index.html).
4. Po úpravě souboru obnov stránku. Server ukončíš pomocí `Ctrl+C`.

HTML neotvírej dvojklikem jako `file://`: části webu používají JavaScriptové moduly a potřebují HTTP server.

**Lokální náhled zatím není úplně nezávislý na produkci.** Importy skriptů a stylů jsou relativní, ale menu odkazuje na veřejný web a řada obrázků i iframe pro motiv se načítá z GitHub Pages. Pro kontrolu vlastní změny otevři podstránku přímo na `localhost`; kliknutí v menu tě může odvést na produkci. Google Fonts, mapy a externí dokumenty také potřebují síť.

## Který soubor upravit

| Co chceš změnit | Kde začít |
| --- | --- |
| Termín, název, místo nebo obrázek akce v kalendáři | `scripts/kalendar/kalendar-data.js` |
| Vzhled karet kalendáře a jejich HTML | `css/kalendar-akci.css`, `scripts/kalendar/generace-kalendare.js` |
| Text konkrétní akce, pravidla, přihlášení | Příslušné HTML v `Odehrane LARPy/` |
| Seznam odehraných akcí | `Odehrane LARPy/Odehrane LARPy.html` — karty jsou ručně v HTML |
| O nás nebo příběhy | `O nas/O nás.html`, `pribehy/pribehy.html` |
| Odkazy a položky společného menu | `scripts/generace-menu.js` |
| Nadpis jedné stránky | Atributy jejího `<site-header>` |
| Společná hlavička a boční menu | `components/site-header.js`, `css/sdilene/menu/menu.css`, `scripts/obecny.js` |
| Barvy a přepínání motivu | `css/sdilene/obecne-sdilene.css`, `scripts/light-modV2.js`, `light-mod-cloud-web/light-mod-cloud-web.html` |
| Profily organizátorů v rozbalovacích oknech | `components/organizator-popovers.js` |
| Seznam návodů | `scripts/navody/navody-hlavni-data.js` — zatím rozpracované |
| Fotky pro samostatnou galerii a velké náhledy | `scripts/galerie/foto-galerie-data.js`; náhledy v detailech akcí jsou v jejich HTML |
| Obrázky a ikony | `kvido html-img/foto/` |

Další orientace:

- `scripts/galerie/foto-galerie.js` filtruje samostatnou galerii; `foto-lightbox.js` ovládá zvětšení fotek v detailech akcí.
- `scripts/utilities/imgformat.js` zjišťuje příponu obrázku pro přepínání ikon.
- `tests/renderers.test.mjs` je malá kontrola generovaných karet a ručně psaného archivu.
- [Pravidla a přehled CSS](css/css.md), [podrobnosti hlavičky](docs/header-layout-notes.md) a [pokyny pro AI](AGENTS.md) doplňují tento úvod.
- `LALOK/` jsou samostatné žertovné stránky, na které vedou odkazy z některých akcí. Nejsou vzorem společné hlavičky.
- `mista-akci/mista-akci.html` je zatím prázdný soubor.

## Jak se stránka skládá

### Hlavička a menu

HTML obsahuje například:

```html
<site-header
  title="Kalendář akcí"
  subtitle="Organizujeme malé LARPové akce"
  image="../kvido html-img/foto/Nav.panel/tri mece final final.png">
</site-header>
```

`components/site-header.js` zaregistruje vlastní HTML element, vytvoří nadpis, obrázkové tlačítko a prázdné boční menu `#sideMenu`. `scripts/generace-menu.js` menu naplní a jednou připojí ovládání šipek. `scripts/obecny.js` poskytuje globální `toggleMenu()` pro otevření a zavření; obsahuje také přepínání mapy v detailech akcí a easter egg po 20 minutách aktivního prohlížení stránky.

Hlavičku rozkládá CSS Grid. Obrázek menu má 70 × 70 px a od textu alespoň 12 px odstup. Když ubývá místo, nejprve se zmenší prázdný levý sloupec a poté se zalomí text. Tato hlavička nemá pevný mobilní breakpoint. `ResizeObserver` měří jen její výšku a nastavuje `--site-header-height` pro horní odsazení stránky. Při změně šířky ani nadpisu se menu nevytváří znovu.

Pro novou stránku jednu složku pod kořenem použij na konci `<body>` toto pořadí společných částí:

```html
<iframe id="theme-sync"
  src="https://burthgulash.github.io/Chynicky_LARP/light-mod-cloud-web/light-mod-cloud-web.html"
  style="display:none;"></iframe>
<script src="../components/site-header.js"></script>
<script src="../scripts/obecny.js"></script>
<script src="../scripts/generace-menu.js"></script>
<script type="module" src="../scripts/light-modV2.js"></script>
```

Hlavička musí existovat před generováním menu; přepínání motivu potřebuje iframe i tlačítko `#button-theme-switch`, které vznikne v menu. `obecny.js` ponech jako klasický skript, protože `onclick` volá jeho globální funkci. Datové renderery a motiv jsou moduly. V hlubších složkách uprav `../` na odpovídající cestu. Skripty funkcí přidávej jen tam, kde stránka obsahuje jejich cílové HTML prvky.

### Kalendář a návody

Kalendářový modul importuje pole `data` ze sousedního `kalendar-data.js`. Z každé položky vytvoří kartu; výsledné HTML vloží jednou do `.kalendar-akci2` pomocí `map(...).join("")`. Pořadí karet určuje pořadí v poli. `datum` je pole zobrazovaných textů, nikoli automaticky zpracovávané datum.

Mapy a profily organizátorů používají nativní HTML `popover` a tlačítka s `popovertarget`. Organizátor potřebuje přesně stejné jméno v datech, profilu i elementu `<organizator-popover name="…">` na stránce. `Již brzy` se vykreslí jako text bez tlačítka; ostatní jména potřebují odpovídající popover, jinak tlačítko nemá co otevřít.

Mapy míst používají vložené iframe Mapy.cz (nyní Mapy.com). V kalendáři se otevírají kliknutím na místo, v detailech akcí tlačítkem „Zobrazit mapu“. Školní farma i Pernink mají bod označující místo konání. Mapy mají výšku 280 px a šířku podle dostupného prostoru; jejich načtení vyžaduje připojení k internetu.

Návody používají vlastní data a vlastní krátký renderer, ale stejné CSS karet. **Zatím jde o nedokončenou část:** pole `datum` se zobrazuje pod „Přibližné náklady“ a `organizatori` pod „Doba výroby“, přesto v datech stále obsahují termíny a jména organizátorů. Neber tuto strukturu jako hotový vzor návodu. Stránka návodů zatím není ve společném menu.

### Světlý a tmavý motiv

`light-modV2.js` nejprve nastaví tmavý motiv, po načtení iframe požádá zprávou `get-theme` o uloženou hodnotu a při kliknutí odešle `set-theme`. Iframe ukládá klíč `theme` do svého `localStorage` a vrací zprávu typu `theme`. Třída `dark` nebo `light` na `<body>` ovládá CSS proměnné; skript navíc mění obrázky ikon.

Iframe je statická pomocná stránka na GitHub Pages. Motiv se neukládá do databáze ani uživatelského účtu. Rodičovský skript má napevno origin `https://burthgulash.github.io`; pouhé přepsání iframe na lokální cestu proto současnou synchronizaci neopraví. Přímé `localStorage` by stačilo pro stránky na stejném originu, pokud nechceme zachovat společný motiv i s lokálním náhledem nebo jiným hostingem.

### Galerie a zvětšování fotek

Samostatná stránka `foto-galerie/foto-galerie.html` ukáže obrázky z pole `fotoGalerieData` až po výběru akce a kliknutí na „Filtrovat“. Záznam má tvar `{ src: "adresa fotky", akce: "OS2" }`; kód akce musí odpovídat hodnotě v `<select>`. První otevření výběru odstraní placeholder kvůli chování Safari/iOS.

Galerie zatím nemá odkaz ve společném menu ani zapojený lightbox. Zvětšování funguje samostatně v detailech Ozvěny stínů, Ozvěny stínů 2 a Přes hřebeny. `foto-lightbox.js` tam pracuje s `.per-foto-obrazek` a prvky `#zvetsene`, `#zvetsene-img`, `#closeBtn`, `#prev`, `#next`. Podporuje šipky, Escape a přejetí prstem; pro velký obrázek hledá odpovídající originál v datech galerie, jinak použije náhled. Na stránku bez tohoto HTML ho nepřidávej.

## Běžné úpravy

### Přidat akci do kalendáře

Do pole `data` v `scripts/kalendar/kalendar-data.js` přidej položku, například:

```js
{
  nazev: "Název akce",
  datum: ["12.–14. června 2027"],
  organizatori: ["Kvido Redl", "Hugo Redl"],
  obrazek: "../kvido html-img/foto/Ikony-img/questionmark.png",
  link: "#",
  misto: "Místo konání"
},
```

Nahraď ukázkový obsah; `link: "#"` je jen dočasný odkaz. Cesty v těchto datech se vkládají do HTML a relativní URL se tedy vyhodnocují vůči **HTML stránce**, ne vůči datovému JS souboru.

Pro místo s mapou použij místo řetězce objekt:

```js
misto: {
  misto: "Školní Farma (Chýnice 29)",
  mapyLink: "https://mapy.com/s/hufumuzega"
}
```

`mapyLink` zkopíruj z atributu `src` v kódu **Sdílet → Vložit mapu do vlastních stránek** na Mapy.com, podle [oficiálního návodu](https://help.mapy.com/cs/nastroje/vlozeni-mapy/). Použij odkaz pro vloženou mapu, který zobrazuje mapu s bodem a ovládáním, nikoli běžný odkaz ke sdílení. Bez `mapyLink` se zobrazí pouze text. Nového organizátora přidej do `organizerData` v `components/organizator-popovers.js` a vlož jeho `<organizator-popover name="…">` do příslušné stránky.

### Upravit nebo vytvořit stránku

Texty a obrázky upravuj přímo v jejím HTML. Pro novou stránku vezmi strukturu jednoduché stránky jako `pribehy/pribehy.html`, nahraď obsah a nastav `<title>`, `lang="cs"` a atributy `<site-header>`. Načti `css/sdilene/obecne-sdilene.css`, `css/sdilene/menu/menu.css` a jen potřebné další styly. Společné skripty a iframe vlož jednou podle ukázky výše.

Chceš-li stránku zpřístupnit, doplň odkaz v `generace-menu.js`, kalendářových datech nebo ručním archivu podle účelu. Nový soubor se do menu automaticky nepřidává. Při přesouvání akce do archivu uprav kalendář a archiv zvlášť; žádný automatický přesun podle data tu není.

### Přidat fotografie

Ulož soubory do `kvido html-img/foto/` a doplň `{ src, akce }` do `foto-galerie-data.js`. Pro novou akci přidej také `<option>` do výběru samostatné galerie. Náhledy v detailu akce se přidávají ručně do jejího HTML; pouhé doplnění dat je tam nezobrazí. Zachovej existující lightbox prvky a obrázkům dej smysluplný `alt`.

## Kontrola změn

V kořeni repozitáře spusť s Node.js 22 nebo novějším:

```sh
node --test tests/renderers.test.mjs
```

Test kontroluje jeden zápis HTML do kalendáře a návodů, počet karet ve stávajících datech, mapové popovery kalendáře, adresy map v detailech, odkaz v archivu a nepřítomnost tlačítka vloženého do odkazu. Po záměrné změně počtu akcí uprav odpovídající očekávání. Test neověřuje rozložení, načítání obrázků či map v iframe, přístupnost ani skutečné klikání v prohlížeči.

Pro změněný JavaScript lze navíc použít `node --check cesta/k/souboru.js`. Před předáním zkontroluj `git diff --check`.

V prohlížeči ověř změněnou stránku a při zásahu do společného kódu také hlavní stránku a jeden detail akce:

- úzké i široké okno, dlouhý nadpis a otevřené menu při změně šířky;
- otevření/zavření menu, podmenu, oba motivy a přechod na další stránku;
- podle změny mapu, organizátory, filtr galerie nebo lightbox;
- konzoli a chybějící soubory v panelu Network; URL musí stále ukazovat na tvůj lokální náhled.

## Co zlepšit a zjednodušit dál

Následující body jsou **návrhy podle současného kódu, nikoli již provedené opravy**. Postupuj po malých změnách a u každé ověř skutečné chování.

| Pořadí | Konkrétní problém | Nejmenší rozumná změna |
| --- | --- | --- |
| 1 | Menu a data návodů odkazují na `Z.Popelu.kalicha/…` mimo skutečnou složku `Odehrane LARPy/`; některé URL ikon postrádají `/Chynicky_LARP/`. Absolutní odkazy navíc odvádějí lokální náhled na produkci. | Opravit odkazy proti skutečným souborům a vlastní obsah postupně odkazovat relativně. U společného JS zohlednit různé hloubky HTML stránek, například URL odvodit od umístění skriptu. |
| 2 | `Pres.hrebeny.html` obsahuje dvakrát iframe `#theme-sync` a import motivu. | Ponechat jednu instanci každého. Není potřeba zavádět nový systém načítání skriptů. |
| 3 | Hlavička otevírá menu klikacím obrázkem; zavření kliknutím mimo menu nevrací `inert`. Šipky rozlišují mobil podle `userAgent`. | Použít skutečné tlačítko, sjednotit nastavení zavřeného menu a umožnit ovládání klávesnicí i dotykem. Zachovat stávající CSS Grid. |
| 4 | Motiv vyžaduje vzdálený iframe a `postMessage`, přesto jsou produkční stránky na jednom originu. | Pokud není potřeba sdílení mezi originy, ukládat motiv přímo do `localStorage`. Pokud iframe zůstane, ověřovat také odesílatele a povolené hodnoty v jeho obsluze zpráv. |
| 5 | Návody mají názvy polí i hodnoty převzaté z kalendáře. | Nejprve určit skutečné údaje návodu, potom v jeho dvou souborech pojmenovat náklady a dobu výroby. Dva krátké renderery zatím nepotřebují obecný systém karet. |
| 6 | Lightbox hledá originál podle toho, zda název souboru obsahuje název náhledu; například `OS2-1` může odpovídat i `OS2-10`. | Použít přesnou shodu názvu nebo dát k náhledu přímo odkaz na originál. Současně omezit klávesové šipky na otevřený lightbox. |

Při běžných úpravách lze také odstranit zbytečné debug výpisy a zakomentované pokusy. Před mazáním CSS, obrázků nebo `LALOK/` nejdřív vyhledej všechny odkazy; část zdánlivě vedlejšího obsahu je skutečně používaná.

Pro současný rozsah stačí statické soubory, CSS Grid, nativní popovery a krátké JS moduly. Framework, databázi, nový loader nebo velký společný renderer přidávej až pro konkrétní potřebu, kterou tento postup nepokryje.

## Předání kamarádovi nebo AI

Kamarádovi pošli celý repozitář nebo odkaz na něj; samotné README nemůže nahradit kód. AI můžeš dát například:

> Přečti README.md a AGENTS.md, potom soubory související s mým úkolem. Jde o statický web bez buildu. Vysvětli stručně, kudy vede aktuální chování, a udělej nejmenší změnu, která řeší zadání. Zachovej společnou hlavičku a nativní popovery. Návrhy v README nejsou hotové opravy ani zadání přepsat celý web. Nakonec uveď, co jsi změnil a skutečně ověřil. Můj úkol: …

## Publikování a licence

Web je určený pro GitHub Pages a publikuje přímo soubory bez buildu. Zdrojovou větev a složku ověř v nastavení repozitáře **Settings → Pages**; v tomto repozitáři není vlastní nasazovací workflow. Při nasazení pod `/Chynicky_LARP/` zkontroluj zejména cesty a odkazy z vnořených stránek.

Licence je [CC0 1.0 Universal](LICENSE).
