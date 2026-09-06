# Chynicky_LARP

Toto je statický web projektu Chýnické LARP akce. Stránky slouží jako hlavní informační a prezentační web pro kalendář akcí, popisy příběhů, archiv odehraných LARPů, fotogalerii a základní navigaci mezi jednotlivými sekcemi.

Web je hostovaný přes GitHub Pages na adrese:

https://burthgulash.github.io/Chynicky_LARP/

## Obsah

- Přehled projektu
- Struktura složek
- Jak web funguje v praxi
- Komplexní systémy a jejich logika
- Jak přidat novou akci nebo stránku
- Lokální vývoj a testování
- Poznámky k aktuálnímu stavu projektu

---

## Přehled projektu

Jedná se o klasický front-end projekt bez build procesu, bez frameworku a bez databáze. Většina funkcionality je řešena přímo v HTML, CSS a JavaScriptu.

Hlavní části:

- hlavní kalendář akcí na stránce larphlavni/index.html
- sekce O nás, Příběhy, Odehrané LARPy a další podstránky
- generované menu pro všechny stránky
- responzivní navigace pro mobilní a desktop verzi
- systém tmavého/světlého režimu
- generování kalendáře ze souboru dat
- filtrování fotek v galerii podle akce

Tento projekt je typický “static content site”: obsah se mění hlavně úpravou jednotlivých HTML souborů a datových JS souborů.

---

## Struktura složek

```text
Chynicky_LARP/
├── larphlavni/
│   └── index.html                  # hlavní stránka s kalendářem akcí
├── navody/
│   ├── navody-hlavni.html
│   └── navody-js/
├── O nas/
│   └── O nás.html
├── Odehrane LARPy/
│   ├── Odehrane LARPy.html
│   ├── Hranicni tvrz/
│   ├── Navrat-mocneho/
│   ├── Ozveny stinu/
│   ├── Ozveny stinu2/
│   ├── Pres.hrebeny/
│   └── Z.Popelu.kalicha/
├── pribehy/
│   └── pribehy.html
├── foto-galerie/
│   └── foto-galerie.html
├── scripts/
│   ├── generace-menu.js           # generuje navigaci
│   ├── responsivni-nav.js         # responzivní menu a rozložení
│   ├── light-modV2.js             # přepínání tématu
│   ├── obecny.js                # má na starost zakladni veci jako otvirani menu aj.
│   ├── script-generace-kalendare/
│   │   ├── generate-kalendare.js
│   │   ├── kalendar-data.js
│   ├── script-foto-galerie/
│   │   ├── foto-galerie.js
│   │   └── foto-galerie-data.js
│   └── utilities/
│       └── imgformat.js
├── css/
│   ├── kalendar-akci.css
│   ├── foto-galerie.css
│   ├── o-nas.css
│   └── sdilene/
├── light-mod-cloud-web/
│   └── light-mod-cloud-web.html  # iframe pro ukládání motivu
├── components/
│   └── organizator-popovers.js
├── kvido html-img/
│   └── foto/
├── README.md
└── LICENSE
```

---

## Jak web funguje v praxi

### 1) HTML stránka je hlavní stavební jednotka

Každá stránka je samostatný HTML dokument. Na většině stránek se najde blok podobný tomuto:

- navigace v elementu nav
- logo / titul / nadpis stránky
- side-menu
- obsah stránky
- import stylů
- import JS skriptů na konci body

Příklady:

- larphlavni/index.html
- O nas/O nás.html
- pribehy/pribehy.html
- foto-galerie/foto-galerie.html

Většina stránek neobsahuje kompletní strukturu v JavaScriptu. CSS a HTML je zde hlavní. JavaScript se používá zejména pro dynamické generování obsahu a funkcionalitu.

### 2) Navigace je generovaná přes JS, ne ručně v každé stránce

Soubor:

- scripts/generace-menu.js

Tento skript vypíše do elementu `#sideMenu` kompletní menu. Díky tomu se menu aktualizuje na všech stránkách jedním místem a neřeší se ho ručně v každém HTML.

Co dělá:

- vytvoří sekce "Kalendář akcí"
- přidá podsekci "Z Popelu Kalicha"
- vytvoří odkaz na "O nás"
- vytvoří odkaz na "Příběhy"
- vytvoří rozbalovací submenu "Odehrané LARPy"
- přidá tlačítko pro přepnutí tématu

Důležitá část je také logika šipek a submenu:

- šipky mají event listener pro hover nebo click
- pro mobilní verzi se chování mění
- menu se po načtení DOM připojí přes událost `side-menu`

Tato funkce je velmi důležitá, protože menu se vytváří až po vytvoření DOM a po zavolání eventu.

### 3) Responzivní navigace řeší překrývání textu a mobilní layout

Soubor:

- scripts/responsivni-nav.js

Tento systém zjistí, zda název nebo podnadpis přesahuje prostor vedle hamburger menu. Pokud ano, změní layout navigace do “kompaktního” režimu:

- název se uloží do jiného HTML bloku
- zobrazuje se menší verze menu
- hamburger se posune do správné pozice
- `sideMenu` se znovu vykreslí

Proces je řízen přes eventy:

- `window.addEventListener("side-menu", handleListener())`
- `window.addEventListener("resize", handleListener())`
- při změně velikosti okna se spouští `handleListener()`
- ten pak vyvolá `window.dispatchEvent(new Event("responsivniNav"))`

Díky tomu se menu po změně velikosti okna přepočítává a přizpůsobuje.

#### Poznámka k implementaci

Tento kód je “zajímavý” a není úplně čistý. Využívá:

- přímé DOM manipulace
- měření textu pomocí `Range` a `getBoundingClientRect()`
- přemisťování HTML struktury v runtime
- eventy navázané na změnu velikosti okna

To je hlavní důvod, proč je tento systém v projektu poměrně komplikovaný a na údržbu citlivý.

---

## Komplexní systémy

### A) Kalendář akcí

Hlavní soubory:

- larphlavni/index.html
- scripts/script-generace-kalendare/generace-kalendare.js
- scripts/script-generace-kalendare/kalendar-data.js

Kalendář se nevytváří ručně v HTML, ale generuje z datového pole v `kalendar-data.js`.

#### Datová struktura

Každá akce má informace:

- `nazev`
- `datum` jako pole datumů
- `organizatori` jako pole jmen
- `obrazek`
- `link`
- `misto`

#### Možné formáty místa

V `kalendar-data.js` je dokumentováno, že `misto` může být:

1. jednoduchý string
   - zobrazí se jako obyčejný text
   - bez mapy a bez tlačítka

2. objekt `{ misto: string, osmLink?: string }`
   - `misto` se zobrazí vedle labelu "Místo :"
   - pokud je `osmLink` vyplněný, skript vytvoří tlačítko a popover s embedded mapou

To je důležité, protože v datech je rozdíl mezi:

- akce se známým místem, kde stačí text
- akce, kde má být vložená OpenStreetMap mapa

#### Jak se generuje HTML

Skript `generace-kalendare.js` projde všechny položky v `data`, vytvoří pro každou akci:

- název akce jako tlačítko
- pole datumů
- místo
- seznam organizátorů
- obrázek akce

Pro organizátory se vytváří rozbalovací nebo interaktivní popover. Pokud je jméno některého organizátora výjimečné, skript zvlášť rozpozná text "Již brzy" a nastaví speciální ikonku.

#### Důležitá poznámka

Tento skript má několik neoptimalit:

- používá string interpolation pro velké HTML bloky
- vytváří DOM elementy a přidává je do `document.body` dynamicky
- používá `window.addEventListener("DOMContentLoaded", ...)` uvnitř loopu
- přepisuje `innerHTML` kontejneru několikrát během iterace

Funguje to, ale je to citlivé na údržbu a na časování při načítání stránky.

---

### B) Systém témat (dark/light mode)

Hlavní soubory:

- scripts/light-modV2.js
- light-mod-cloud-web/light-mod-cloud-web.html

Téma je synchronizováno přes hidden iframe.

#### Proč je to tak složité

Web používá skrytý iframe, který ukládá aktuální motiv do `localStorage` a předává hodnotu zpět hlavnímu oknu přes `postMessage`.

Krok po kroku:

1. stránka načte iframe
2. iframe po `load` pošle zprávu "get-theme"
3. iframe načte z `localStorage` hodnotu "theme"
4. hodnota se vrátí zpět do rodičovského okna
5. rodičovské okno volá `applyTheme(theme)`
6. `body` dostane třídu `dark` nebo `light`
7. obrázky a ikony se přepnout podle aktuálního režimu

Jsou upravovány i obrázky v navigaci a ikony v článcích:

- hamburger menu obrázek
- ikony v sekcích
- tlačítko pro změnu režimu

Díky tomu se motiv udržuje konzistentně napříč stránkami.

#### Jak to funguje v praxi

Soubor `light-mod-cloud-web.html` obsahuje listener:

- pokud přijde `set-theme`, uloží se do `localStorage`
- pokud přijde `get-theme`, odešle se aktuální hodnota zpět

To je klíčové, protože bez tohoto mechanismu by se motiv nemusel synchronizovat mezi stránkami a přechody mezi adresami by byly nečekané.

---

### C) Fotogalerie

**Poznamka: FotoGaerie neni zatim hotová a pripojena ke zbytku webu**

Hlavní soubory:

- foto-galerie/foto-galerie.html
- scripts/script-foto-galerie/foto-galerie-data.js
- scripts/script-foto-galerie/foto-galerie.js

Galerie funguje tak, že:

- data o fotkách jsou uložena v JS poli
- každá fotografie má `src` a `akce`
- uživatel vybere akci v selectu
- po kliknutí na tlačítko se vyfiltrují fotky
- zobrazené obrázky se vloží do `#foto-galerie`

#### Důležitý detail

V `foto-galerie.js` se řeší zvláštní případ pro Safari / iOS: při focusu na select se odstraní placeholder a uvolní se první volba. Tím se vyhne chování, které u některých mobilních prohlížečů nefunguje správně.

To je jednoduché, ale velmi praktické, protože projekt má silnou závislost na mobilním prohlížení a iOS chování.

---

### D) Generované menu a šipky

Menu je v projektu důležitým dynamickým prvkem. Díky JS se vytváří v jediném místě. To je výhoda, protože všechny stránky mají stejnou navigaci.

V `generace-menu.js` se vygeneruje HTML pro:

- hlavní položky menu
- rozbalovací podmenu
- tlačítko pro přepnutí režimu

Po vygenerování se spustí `window.dispatchEvent(new Event("side-menu"))`.

Tím se spustí další logika, která zobrazuje správné chování pro hover/click a pro responzivní variantu. V podstatě to znamená, že menu se skládá z více vrstev:

1. HTML z JS
2. eventy po načtení DOM
3. responzivní přepnutí layoutu
4. hover/click rozbalovací podmenu

Toto je nejkomplikovanější část projektu, pokud se něco rozbije, většinou to souvisí právě s tímto mechanismem.

---

## Jak přidat novou akci

### Přidat akci do kalendáře

Edituj soubor:

- scripts/script-generace-kalendare/kalendar-data.js

Přidej novou položku do pole `data` ve formátu:

```js
{
  nazev: "Název akce",
  datum: ["14. září 2026"],
  organizatori: ["Kvido Redl", "Hugo Redl"],
  obrazek: "https://example.com/obrazek.jpg",
  link: "#",
  misto: {
    misto: "Místo konání",
    osmLink: "https://www.openstreetmap.org/export/embed.html?..."
  }
}
```

Pokud `misto` není potřeba jako mapový objekt, stačí prostý string:

```js
misto: "Pernink, kostelní 11";
```

### Přidat stránku

- vytvoř nový HTML soubor
- přidej stejnou navigaci a CSS importy jako u ostatních stránek
- na konec přidej relevantní skripty:
  - `scripts/responsivni-nav.js`
  - `scripts/generace-menu.js`
  - `scripts/light-modV2.js`

Věnuj pozornost tomu, že stránky používají absolutní GitHub Pages URL pro některé assety. Pokud měníš strukturu projektu, je dobré zkontrolovat cesty a odkazy, protože v projektu se používají jak relativní cesty, tak absolutní URL odkazy na GitHub Pages.

---

## Lokální vývoj a testování

Tento projekt neobsahuje build pipeline ani balíčkový manažer. Pro lokální práci stačí:

1. otevřít soubor HTML v prohlížeči
2. nebo spustit lokální server, například:

```bash
python -m http.server 8000
```

Potom otevřít:

```text
http://localhost:8000/
```

### Důležité

Protože některé skripty používají odkazy na GitHub Pages a externí assety, je vhodné testovat v podobném prostředí jako produkce. Pokud se mění cesty k obrázkům nebo adresy GitHub Pages, může se rozbít načítání obsahu.

---

## Deployment

Projekt je nasazen přes GitHub Pages. Většina URL má formát:

```text
https://burthgulash.github.io/Chynicky_LARP/...
```

Proto jsou některé cesty v JS a HTML psané přímo do GitHub Pages URL, ne jen relativně. Tato volba zjednodušuje funkčnost z produkčního hostingu, ale zároveň zvyšuje závislost na konkrétní doméně a složkové struktuře.

---

## Poznámky k aktuálnímu stavu projektu

### Co je v projektu dobře

- jednoduché statické hostování
- přehledné rozdělení obsahu do JS datových souborů
- centralizované menu
- systém s jednotným tématem napříč stránkami
- možnost snadno přidávat akce do kalendáře

### Na co je potřeba dávat pozor

- stránky jsou silně závislé na konkrétních URL cestách
- některé skripty jsou psané “na rychlo” a obsahují console.log, debug kódy a neoptimalizované konstrukce
- menu a responzivní navigace jsou citlivé na DOM a eventy
- generování HTML přes template stringy je náročné na údržbu
- některé skripty spoléhají na změnu `innerHTML` v runtime, což může být nestabilní při velkém rozvoji projektu

### Prakticky

Nejproblematičtější části jsou:

- `scripts/generace-menu.js`
- `scripts/responsivni-nav.js`
- `scripts/light-modV2.js`
- `scripts/script-generace-kalendare/generace-kalendare.js`

Tyto soubory jsou “dvojí” – funkční, ale zároveň místem, kde je nejvíce pravděpodobné, že po úpravách nastanou problémy s načítáním nebo rozložením.

---

## Shrnutí

Tento projekt je statický web s několika dynamickými vrstvami, které jsou pro běžného návštěvníka prakticky neviditelné, ale zásadně ovlivňují fungování stránky.

Nejdůležitější logické systémy jsou:

- generované menu pro všechny stránky
- responzivní navigace a přepínání layoutu
- přepínání tématu přes hidden iframe a localStorage
- generování kalendáře z datového souboru
- filtrování fotografií dle akce

Pokud se bude web rozšiřovat, je vhodné tyto systémy postupně refaktorovat do stabilnější architektury, protože v současné podobě jsou funkční, ale citlivé na změny a ne vždy přehledné pro další údržbu.

---

## Licence

Projekt je distribuován pod licencí uvedenou v souboru LICENSE.
