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
│   ├── light-modV2.js             # přepínání tématu
│   ├── site.js                  # jediný vstupní modul stránky
│   ├── site-features.json        # registry funkcí, šablon a CSS
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
├── obecny.js                    # obecné chování stránky
├── components/
│   ├── templates/                # HTML lightboxu a organizátorů
│   ├── site-header.js
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

### 2) Jeden import a výběr funkcí

Každá běžná stránka načítá `scripts/site.js` a používá `<site-features>`.
Menu a téma se zapínají automaticky. Volitelné atributy jsou `fotky`, `galerie`,
`kalendar`, `navody` a `organizatori`. Loader načte potřebné moduly, HTML šablony
a styly podle `scripts/site-features.json`, ve správném pořadí a jen jednou.

Návod pro úpravu stránek i přidávání dalších funkcí: [Funkce stránky](docs/site-features.md).

### 3) Sdílená hlavička a responzivní rozložení

Hlavičku vytváří web component `components/site-header.js`; rozložení řídí `css/sdilene/menu/menu.css`.

- Menu má vždy 70 × 70 px a od textu ho dělí alespoň 12 px.
- CSS Grid má prázdný levý sloupec, text a pravý sloupec s menu. Když je dost místa, jsou krajní sloupce stejně široké a text je uprostřed stránky.
- Při zmenšování prostoru se nejprve zmenší prázdný levý sloupec, poté se text zalomí. Rozhoduje skutečná šířka nadpisu a podnadpisu, nikoli pevný mobilní breakpoint.
- `ResizeObserver` v komponentě aktualizuje `--site-header-height`, podle kterého má tělo stránky horní odsazení. Reaguje i na změnu textu nebo fontu bez změny velikosti okna.
- Změny atributů nadpisu a podnadpisu aktualizují jen text. Boční menu a jeho listenery se při změně rozložení nevytvářejí znovu.

Starý skript pro měření kolizí a přepisování HTML hlavičky byl odstraněn. Sdílené styly hlavičky a bočního menu jsou v `menu.css`.

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
- přepisuje `innerHTML` kontejneru několikrát během iterace

Funguje to, ale je to citlivé na údržbu a na časování při načítání stránky.

---

### B) Systém témat (dark/light mode)

`scripts/light-modV2.js` načítá funkce `tema` automaticky. Téma se ukládá přímo
do `localStorage` pod klíčem `theme`. Všechny stránky na stejném originu sdílejí
nastavení; událost `storage` aktualizuje i ostatní otevřené panely. Iframe byl
odstraněn. Localhost a GitHub Pages mají oddělené nastavení.

Téma aktualizuje ikony i po dokončení volitelných funkcí, například kalendáře.
Pokud prohlížeč úložiště zablokuje, přepínač stále funguje na aktuální stránce.

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

Po vygenerování se jednou zavolá `runArrowCode()`, který připojí existující hover/click obsluhu šipek. Inicializace už nezávisí na událostech hlavičky a při změně velikosti okna se neopakuje.

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

Zkopíruj podobnou stránku. Ponech jeden import `scripts/site.js` a uprav atributy
`<site-features>` podle potřeb. Například `<site-features fotky></site-features>`
vloží prohlížeč fotek včetně HTML, CSS a obsluhy. Jednotlivé skripty, lightbox
ani popovery organizátorů už do stránky nekopíruj.

[Příklady, seznam funkcí a formát registru](docs/site-features.md).

---

## Lokální vývoj a testování

Projekt nepotřebuje build. Z kořene spusť HTTP server:

```bash
python -m http.server 8000
```

Otevři `http://localhost:8000/larphlavni/index.html`. Stránky neotvírej přes
`file://`: moduly, JSON registr a HTML šablony potřebují HTTP server.

Automatické kontroly funkcí lze spustit pomocí `node tests/site-features.cjs`
v prostředí s nainstalovaným Playwright a Chromium/Chrome. Test si spouští vlastní
lokální server; běžný web tyto vývojové závislosti nepotřebuje.

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
- generování bočního menu musí následovat po vytvoření hlavičky
- generování HTML přes template stringy je náročné na údržbu
- některé skripty spoléhají na změnu `innerHTML` v runtime, což může být nestabilní při velkém rozvoji projektu

### Prakticky

Nejproblematičtější části jsou:

- `scripts/generace-menu.js`
- `components/site-header.js`
- `scripts/light-modV2.js`
- `scripts/script-generace-kalendare/generace-kalendare.js`

Tyto soubory jsou “dvojí” – funkční, ale zároveň místem, kde je nejvíce pravděpodobné, že po úpravách nastanou problémy s načítáním nebo rozložením.

---

## Shrnutí

Tento projekt je statický web s několika dynamickými vrstvami, které jsou pro běžného návštěvníka prakticky neviditelné, ale zásadně ovlivňují fungování stránky.

Nejdůležitější logické systémy jsou:

- generované menu pro všechny stránky
- responzivní CSS rozložení sdílené hlavičky
- přepínání tématu přes localStorage
- generování kalendáře z datového souboru
- filtrování fotografií dle akce

Pokud se bude web rozšiřovat, je vhodné tyto systémy postupně refaktorovat do stabilnější architektury, protože v současné podobě jsou funkční, ale citlivé na změny a ne vždy přehledné pro další údržbu.

---

## Licence

Projekt je distribuován pod licencí uvedenou v souboru LICENSE.
