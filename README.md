# Chýnické LARP akce

Malý informační web pro naše LARPy: termíny akcí, informace pro hráče, příběhy a fotky. LARP je hra, ve které účastníci naživo hrají své postavy.

**Web tvoří obyčejné HTML, CSS a JavaScript.** Nemá framework, databázi, backend, `package.json` ani build. Obsah upravíš v souborech a prohlížeč je rovnou načte. Node.js je volitelný pro kontrolu syntaxe; web ho pro běh nepotřebuje a automatizované testy v repozitáři nejsou.

Produkční adresa používaná v kódu je [GitHub Pages](https://burthgulash.github.io/Chynicky_LARP/kalendar-akci/index.html). Vstupní stránka v repozitáři je `kalendar-akci/index.html`; v kořeni žádný `index.html` není.

Staré adresy `larphlavni/index.html` a `larphlavni/index-mobil.html` automaticky přesměrují na současný kalendář. Mobilní adresy stránky O nás, archivu a obou Ozvěn stínů přesměrují na odpovídající současnou stránku. Všechna tato přesměrování zachovávají také ruční odkaz pro případ, že prohlížeč automatické přesměrování nepovolí.

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

**Obrázky, vlastní skripty a styly i odkazy menu respektují místní adresu.** Některé odkazy v obsahu stále míří na GitHub Pages. Pro kontrolu vlastní změny otevři podstránku na `localhost`. Google Fonts, mapy a externí dokumenty potřebují síť. Motiv se ukládá místně; `localhost` má vlastní volbu nezávislou na produkci.

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
| Společná hlavička a boční menu | `components/site-header.js`, `scripts/generace-menu.js`, `css/sdilene/menu/menu.css` |
| Barvy a přepínání motivu | `css/sdilene/obecne-sdilene.css`, `scripts/light-modV2.js` |
| Profily organizátorů v rozbalovacích oknech | `components/organizator-popovers.js` |
| Seznam návodů | `scripts/navody/navody-hlavni-data.js` — zatím rozpracované |
| Fotky pro samostatnou galerii a velké náhledy | `scripts/galerie/foto-galerie-data.js`; náhledy v detailech akcí jsou v jejich HTML |
| Obrázky a ikony | `assets/` |

`assets/` obsahuje přímo původní podsložky obrázků, například `Ikony-img`, `Nav.panel`, `O nás-img` a `Odehrane LARPy`. Názvy a obsah souborů zůstaly zachované; mezisložka `foto/` se nepoužívá.

Další orientace:

- `scripts/galerie/foto-galerie.js` filtruje samostatnou galerii; `foto-lightbox.js` ovládá zvětšení fotek v detailech akcí.
- `scripts/utilities/imgformat.js` zjišťuje příponu obrázku pro přepínání ikon.
- Postup ručního ověření je v části [Kontrola změn](#kontrola-změn); složka `tests/` už v projektu není.
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
  image="../assets/Nav.panel/tri mece final final.png">
</site-header>
```

`components/site-header.js` zaregistruje vlastní HTML element, vytvoří nadpis, tlačítko `.menu-toggle` s obrázkem `.menu-btn` a `<site-menu id="sideMenu">`. ES modul `scripts/generace-menu.js` definuje tuto webovou komponentu. Odkazy, podnabídky a tlačítko motivu sestaví jednou přes `createElement` a `append`, bez `innerHTML`. Vlastní adresy odvozuje od `import.meta.url`, takže menu funguje z různě hlubokých stránek na místním serveru i pod `/Chynicky_LARP/`. Odkaz Z Popelu Kalicha míří do `Odehrane LARPy/Z.Popelu.kalicha/`.

Komponenta spravuje otevření, zavření kliknutím mimo panel nebo klávesou Escape, atribut `inert` a `aria-expanded` spouštěcího tlačítka. Spouštěč je do načtení komponenty vypnutý. Pokud byl fokus uvnitř zavíraného panelu, vrátí ho na spouštěč. Podnabídky mají skutečná tlačítka: myš je může otevřít najetím na šipku, kliknutí funguje i dotykem a z klávesnice. `scripts/obecny.js` poskytuje globální `toggleMenu()`, který pouze zavolá metodu komponenty; obsahuje také přepínání mapy v detailech akcí a easter egg po 20 minutách viditelného zobrazení stránky. Časovač sleduje `document.hidden`, nikoli klikání nebo jinou aktivitu uživatele, a po obnovení stránky začíná znovu.

Hlavičku rozkládá CSS Grid. Obrázek menu má 70 × 70 px a od textu alespoň 12 px odstup. Když ubývá místo, nejprve se zmenší prázdný levý sloupec a poté se zalomí text. Tato hlavička nemá pevný mobilní breakpoint. `ResizeObserver` měří jen její výšku a nastavuje `--site-header-height` pro horní odsazení stránky. Při změně šířky, nadpisu ani opětovném připojení se DOM menu nevytváří znovu; při odpojení se panel zavře a odebere listenery dokumentu.

Pro novou stránku jednu složku pod kořenem použij na konci `<body>` toto pořadí společných částí:

```html
<script src="../components/site-header.js"></script>
<script src="../scripts/obecny.js"></script>
<script type="module" src="../scripts/generace-menu.js"></script>
<script type="module" src="../scripts/light-modV2.js"></script>
```

Hlavička musí existovat před registrací menu; přepínání motivu potřebuje tlačítko `#button-theme-switch`, které vznikne v menu. Modul motivu navíc importuje menu jako závislost, aby tlačítko existovalo před jeho použitím. `obecny.js` ponech jako klasický skript, protože `onclick` volá jeho globální funkci. Menu, datové renderery a motiv jsou moduly. Všech 12 stránek se společnou hlavičkou používá toto pořadí a jediný import motivu, včetně Přes hřebeny. Motiv iframe nepotřebuje; iframe map jsou samostatné. V hlubších složkách uprav `../` na odpovídající cestu. Skripty funkcí přidávej jen tam, kde stránka obsahuje jejich cílové HTML prvky.

### Kalendář a návody

Kalendářový modul importuje pole `data` ze sousedního `kalendar-data.js`. Z každé položky vytvoří kartu; výsledné HTML vloží jednou do `.kalendar-akci2` pomocí `map(...).join("")`. Pořadí karet určuje pořadí v poli. `datum` je pole zobrazovaných textů, nikoli automaticky zpracovávané datum. Současné dvě položky jsou „Již brzy“ a „Poslední ortel“; obě mají dočasný odkaz `#`.

Obal obrázku používá třídu `akce-img`, samotný obrázek `akce-obrazek`, která ho přizpůsobuje šířce obalu.

Mapy a profily organizátorů používají nativní HTML `popover` a tlačítka s `popovertarget`. Organizátor potřebuje přesně stejné jméno v datech, profilu i elementu `<organizator-popover name="…">` na stránce. Hodnota `Již brzy` v poli `organizatori` se vykreslí jako text bez tlačítka; ostatní jména potřebují odpovídající popover, jinak tlačítko nemá co otevřít. Současné `a další` u první karty žádný profil ani popover nemá.

Mapy míst používají vložené iframe Mapy.com. V kalendáři se otevírají kliknutím na místo, v detailech Z Popelu kalicha, Návrat mocného a Přes hřebeny tlačítkem „Zobrazit mapu“. Přepnutí mění jen text ve `<span>` a `aria-expanded`; SVG ikona zůstává stejná. Kalendář a Návrat mocného používají pro školní farmu adresu `https://mapy.com/s/hufumuzega`, Z Popelu kalicha `https://mapy.com/s/fotehegoro`; Pernink používá `https://mapy.com/s/pejegocono`. Mapy mají výšku 280 px a šířku podle dostupného prostoru; jejich načtení vyžaduje připojení k internetu. Správný bod a ovládání mapy ověř přímo v iframe v prohlížeči, samotná adresa ve zdroji je nezaručuje.

Návody používají vlastní data a vlastní krátký renderer, ale stejné CSS karet. **Zatím jde o nedokončenou část:** pole `datum` se zobrazuje pod „Přibližné náklady“ a `organizatori` pod „Doba výroby“, přesto v datech stále obsahují termíny a jména organizátorů. První karta navíc odkazuje na detail Z Popelu kalicha v nesprávné složce, ne na hotový návod. Neber tuto strukturu jako hotový vzor návodu. Stránka návodů zatím není ve společném menu.

### Světlý a tmavý motiv

`light-modV2.js` při spuštění přečte klíč `theme` přímo z `localStorage`. Hodnota `light` zapne světlý motiv; chybějící nebo jiná hodnota a chyba čtení použijí tmavý. Při kliknutí okamžitě změní motiv a uloží novou volbu. Pokud prohlížeč úložiště zablokuje, přepínání dál funguje na právě otevřené stránce, ale volba se neuloží. Třída `dark` nebo `light` na `<body>` ovládá CSS proměnné; skript navíc mění obrázky ikon. Ikonu tlačítka motivu mění na stávajícím `<img>` a aktualizuje jeho přístupný popisek, takže DOM tlačítka a jeho listener zůstávají zachované.

Volba platí pro všechny stránky na stejném originu v daném prohlížeči; origin tvoří protokol, doména a port. Produkční stránky pod `https://burthgulash.github.io` tedy sdílejí stejnou volbu bez ohledu na složku. Klíč `theme` zůstal stejný, takže dosavadní produkční volba se zachová. Lokální server nebo jiný hosting má samostatnou volbu. Motiv se načítá při otevření či obnovení stránky; již otevřené záložky se průběžně nepřepínají. Pomocný iframe ani `postMessage` se nepoužívají a nic se neukládá do databáze nebo uživatelského účtu.

Tematické ikony mají `id="icon-img"` a `data-name`; modul z názvu a přípony skládá adresy běžné a `-light` varianty v `assets/Ikony-img/` podle svého umístění. V místních souborech jsou obě varianty ikon `bagpack`, `cena`, `hodiny`, `pin`, `popis-akce`, `questionmark`, `warrior-transparent` a `worker` i obrázku mečů v menu. U `jidlo-icon.webp` použitého v Z Popelu kalicha světlá varianta chybí. Také obrázky tlačítka motivu `slunce-icon.webp` a `Mesic-icon.webp` a meče v menu se načítají podle adresy modulu; pozadí hlavičky podle adresy CSS.

Renderery kalendáře a návodů označují obrázek pro přepínání motivu jen podle hodnoty `Již brzy` v poli `organizatori`, nikoli podle názvu karty. První karta kalendáře tedy svůj otazník nepřepíná. Renderery se na stránkách načítají až po modulu motivu; ten proto při `DOMContentLoaded` znovu aktualizuje ikony, aby zahrnul také vykreslené karty.

### Galerie a zvětšování fotek

Samostatná stránka `foto-galerie/foto-galerie.html` ukáže obrázky z pole `fotoGalerieData` až po výběru akce a kliknutí na „Filtrovat“. Záznam má tvar `{ src: "adresa fotky", akce: "OS2" }`; kód akce musí odpovídat hodnotě v `<select>`. Současný výběr nabízí jen `OS1` a `OS2`. Placeholder se odstraní při prvním zaměření výběru kliknutím nebo klávesou Tab; komentář v kódu uvádí Safari/iOS jako důvod, nikoli výsledek ověření na těchto zařízeních.

Galerie zatím nemá odkaz ve společném menu ani zapojený lightbox. Zvětšování funguje samostatně v detailech Ozvěny stínů, Ozvěny stínů 2 a Přes hřebeny. Každý náhled `.per-foto-obrazek` je uvnitř odkazu `<a href="adresa originálu">`; tuto adresu používá `foto-lightbox.js` pro zvětšení i přednačítání, bez hledání v datech galerie. Běžné kliknutí nebo Enter otevře lightbox, modifikované kliknutí zachová běžné chování odkazu a bez JavaScriptu odkaz otevře samotný obrázek. Skript dále potřebuje prvky `#zvetsene`, `#zvetsene-img`, `#closeBtn`, `#prev`, `#next`. Podporuje Escape a přejetí prstem; klávesové šipky reagují pouze při otevřeném lightboxu. Na stránku bez tohoto HTML ho nepřidávej.

## Běžné úpravy

### Přidat akci do kalendáře

Do pole `data` v `scripts/kalendar/kalendar-data.js` přidej položku, například:

```js
{
  nazev: "Název akce",
  datum: ["12.–14. června 2027"],
  organizatori: ["Kvido Redl", "Hugo Redl"],
  obrazek: "../assets/Ikony-img/questionmark.png",
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

Texty a obrázky upravuj přímo v jejím HTML. Pro novou stránku vezmi strukturu jednoduché stránky jako `pribehy/pribehy.html`, nahraď obsah a nastav `<title>`, `lang="cs"` a atributy `<site-header>`. Načti `css/sdilene/obecne-sdilene.css`, `css/sdilene/menu/menu.css` a jen potřebné další styly. Společné skripty vlož jednou podle ukázky výše.

Chceš-li stránku zpřístupnit, doplň odkaz v `generace-menu.js`, kalendářových datech nebo ručním archivu podle účelu. Nový soubor se do menu automaticky nepřidává. Při přesouvání akce do archivu uprav kalendář a archiv zvlášť; žádný automatický přesun podle data tu není.

### Přidat fotografie

Ulož soubory do `assets/` a doplň `{ src, akce }` do `foto-galerie-data.js`. Pro novou akci přidej také `<option>` do výběru samostatné galerie. Náhledy v detailu akce se přidávají ručně do jejího HTML; pouhé doplnění dat je tam nezobrazí. Každý náhled pro lightbox vlož jako `<a href="cesta/k/originálu.jpg"><img class="per-foto-obrazek" src="cesta/k/náhledu.webp" alt="Popis fotografie"></a>`. Pokud nemá samostatný originál, obě adresy mohou být stejné. Zachovej existující lightbox prvky a obrázkům dej smysluplný `alt`.

**Doporučení pro další optimalizaci:** větší obrázky převáděj na **WebP**, které má širší podporu na starších zařízeních než AVIF ([přehled podpory](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)). Menší nebo už dobře komprimované JPEG/PNG mohou zůstat. Porovnej velikost i vzhled: doporučená úspora je alespoň 20 % a 50 kB při zachování rozlišení. Pro fotky a texturované ilustrace použij ztrátovou kompresi, pro průhledné ikony bezeztrátovou. Existující vhodný WebP lze použít znovu. Obrázky v `LALOK/` ponech při této optimalizaci stranou. Tyto podmínky žádný skript automaticky nevynucuje.

Galerie a profily organizátorů odvozují adresy obrázků od umístění svého modulu přes `new URL(..., import.meta.url)`. Náhledy fotek v ručním HTML používají relativní cesty do `assets/`. Cesty tedy respektují hlavní i vnořenou stránku, místní náhled a nasazení pod `/Chynicky_LARP/`. Při výměně formátu uprav všechna použití a původní soubor odstraň až poté; originál pro lightbox může být i WebP se zachovaným rozlišením. Světlá hlavička nyní používá `Nav.panel/IMG_6357.webp`; vedlejší soubor `IMG_6357.avif` zůstává v úložišti obrázků.

## Kontrola změn

**Automatizované testy v aktuálním repozitáři nejsou.** Historicky existovaly kontroly rendererů, menu a obrázků, ale všechny tři soubory byly na přání autora odstraněny v commitu `ecd710e` („odstranit testy TESTY NECHCI“). Staré příkazy `node --test tests/…` proto nefungují a dřívější výsledky nevypovídají o současném stavu. Bez nového zadání testy neobnovuj.

Pro změněný JavaScript lze s Node.js 22 nebo novějším použít `node --check cesta/k/souboru.js`. Jde pouze o kontrolu syntaxe, nikoli chování stránky. Před předáním zkontroluj `git diff --check` a vyhledej všechna použití změněných cest v HTML, JS i CSS.

V prohlížeči ověř změněnou stránku a při zásahu do společného kódu také hlavní stránku a jeden detail akce:

- úzké i široké okno, dlouhý nadpis a otevřené menu při změně šířky;
- otevření/zavření menu, podmenu, oba motivy, obnovení stránky a přechod na další stránku; při změně ukládání motivu také chybějící či neplatnou hodnotu a zablokované úložiště;
- podle změny mapu včetně bodu a ovládání, organizátory, filtr galerie nebo lightbox;
- po změně obrázků jejich vzhled, místní soubory a obě varianty tematických ikon;
- konzoli a chybějící soubory v panelu Network; ověřovaná stránka a vlastní skripty musí ukazovat na tvůj lokální náhled, známé vzdálené zdroje jsou popsané výše.

Tyto body jsou postup kontroly, ne záznam už provedeného ověření. V předání vždy napiš, co bylo skutečně vyzkoušeno a co zůstalo neověřené.

## Co zlepšit a zjednodušit dál

Následující body jsou **návrhy podle současného kódu, nikoli již provedené opravy**. Postupuj po malých změnách a u každé ověř skutečné chování.

| Pořadí | Konkrétní problém | Nejmenší rozumná změna |
| --- | --- | --- |
| 1 | Odkaz v datech návodů a odkaz na rozpočet Z Popelu kalicha používají cestu mimo skutečnou složku `Odehrane LARPy/`. Odkaz na O nás z Návratu mocného a Z Popelu kalicha má nedostatečné `../`. | Opravit tyto cesty proti skutečným souborům; další absolutní odkazy v obsahu postupně měnit na relativní podle významu. |
| 2 | Návody mají názvy polí i hodnoty převzaté z kalendáře; kalendář vytváří také tlačítko `a další` bez cílového profilu. | Nejprve určit skutečné údaje návodu a dořešit text bez profilu, potom v jeho dvou souborech pojmenovat náklady a dobu výroby. Dva krátké renderery zatím nepotřebují obecný systém karet. |
| 3 | Motiv pro `jidlo-icon.webp` sestaví neexistující světlou variantu. | Doplnit zamýšlenou ikonu nebo změnit konkrétní použití na existující soubor a ověřit načtení obou motivů. |

Při běžných úpravách lze také odstranit zbytečné debug výpisy a zakomentované pokusy. Před mazáním CSS, obrázků nebo `LALOK/` nejdřív vyhledej všechny odkazy; část zdánlivě vedlejšího obsahu je skutečně používaná.

Pro současný rozsah stačí statické soubory, CSS Grid, nativní popovery a krátké JS moduly. Framework, databázi, nový loader nebo velký společný renderer přidávej až pro konkrétní potřebu, kterou tento postup nepokryje.

## Předání kamarádovi nebo AI

Kamarádovi pošli celý repozitář nebo odkaz na něj; samotné README nemůže nahradit kód. AI můžeš dát například:

> Přečti README.md a AGENTS.md, potom soubory související s mým úkolem. Jde o statický web bez buildu. Vysvětli stručně, kudy vede aktuální chování, a udělej nejmenší změnu, která řeší zadání. Zachovej společnou hlavičku a nativní popovery. Návrhy v README nejsou hotové opravy ani zadání přepsat celý web. Nakonec uveď, co jsi změnil a skutečně ověřil. Můj úkol: …

## Publikování a licence

Web je určený pro GitHub Pages a publikuje přímo soubory bez buildu. Zdrojovou větev a složku ověř v nastavení repozitáře **Settings → Pages**; v tomto repozitáři není vlastní nasazovací workflow. Při nasazení pod `/Chynicky_LARP/` zkontroluj zejména cesty a odkazy z vnořených stránek.

Soubor [LICENSE](LICENSE) obsahuje CC0 1.0 Universal. Převzaté ikony mají uvedené autory v HTML detailech; SVG šipka menu má v `scripts/generace-menu.js` samostatnou poznámku Font Awesome Free 7, CC BY 4.0.
