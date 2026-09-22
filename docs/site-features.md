# Funkce stránky

Každá běžná stránka načítá jen `scripts/site.js`. Funkce se vybírají přes
`<site-features>`. Žádný build ani instalace balíčků nejsou potřeba.

## Nová stránka

Zkopíruj podobnou stránku a uprav obsah. Pro stránku jednu složku pod kořenem:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="../css/sdilene/obecne-sdilene.css">
  <link rel="stylesheet" href="../css/sdilene/menu/menu.css">
  <script type="module" src="../scripts/site.js"></script>
</head>
<body>
  <site-features fotky></site-features>
  <site-header title="Název akce" subtitle="Datum a místo"></site-header>

  <div class="per-foto">
    <img class="per-foto-obrazek" src="foto.webp" data-full="foto.jpg" alt="Popis fotografie">
  </div>
</body>
```

Ve stránce dvě složky pod kořenem použij `../../scripts/site.js` a stejným
způsobem uprav cesty k základním stylům. Cesty k souborům jednotlivých funkcí
řeší loader automaticky. `data-full` je nepovinné; bez něj prohlížeč fotek
hledá originál v datech galerie, případně použije obrázek ze stránky.

## Dostupné funkce

| Atribut | Co zapne | Přidává automaticky |
| --- | --- | --- |
| `fotky` | Zvětšení fotek, šipky, klávesnice a přejetí prstem | Lightbox HTML a `obrazky.css` |
| `galerie` | Filtrování fotek podle akce | `fotky` a `foto-galerie.css` |
| `kalendar` | Kalendář z `kalendar-data.js` | `organizatori` a `kalendar-akci.css` |
| `navody` | Seznam návodů z `navody-hlavni-data.js` | `organizatori` a `kalendar-akci.css` |
| `organizatori` | Popovery organizátorů | Sdílené HTML se čtyřmi organizátory |

Menu, přepínání tématu a obecné chování (mapa a easter egg) jsou zapnuté
automaticky. Na běžné textové stránce stačí:

```html
<site-features></site-features>
```

Více funkcí můžeš kombinovat: `<site-features fotky organizatori></site-features>`.
`fotky` a `fotky="true"` znamenají totéž. `fotky="false"` funkci nevybere.
Výchozí téma lze vypnout pomocí `tema="false"`; tlačítko potom zůstane skryté.
Závislosti se vždy zapínají s funkcí, která je potřebuje: například `galerie`
potřebuje `fotky` i při `fotky="false"`. Pro stránku bez menu vypni také
téma (`menu="false" tema="false"`), které menu potřebuje.

Ponech obsah stránky v HTML: galerie potřebuje filtr `#filtr-akci`, tlačítko
`#filtrovat-fotky` a kontejner `#foto-galerie`; kalendář i návody potřebují
`.kalendar-akci2`. Příklady jsou v příslušných stránkách. Do stránky už
nekopíruj lightbox, popovery organizátorů, theme iframe ani jednotlivé skripty.
Základní CSS a styly samotného obsahu (například `info.css`) zůstávají v `<head>`.

## Přidání nové funkce do registru

Uprav `scripts/site-features.json`. Cesty jsou vždy relativní k tomuto JSON
souboru, nikoli k otevřené HTML stránce. Například nová funkce:

```json
"ukazka": {
  "module": "./features/ukazka.js",
  "template": "../components/templates/ukazka.html",
  "styles": ["../css/ukazka.css"]
}
```

Vytvoř odkazované soubory. Modul musí exportovat `init()`:

```js
export function init() {
  // HTML šablony už je ve stránce a CSS je načtené.
  document.querySelector("#ukazka-button").addEventListener("click", () => {
    // Chování funkce.
  });
}
```

Potom stačí `<site-features ukazka></site-features>`. Loader kvůli nové funkci
neměníš. Pole `template`, `styles` i `module` jsou nepovinná. `dependsOn`
obsahuje názvy funkcí, které musí být připravené předem. `default: true` zapne
funkci na všech stránkách. Šablony obsahují důvěryhodné HTML projektu;
JavaScript patří do modulu, nikoli do `<script>` uvnitř šablony.

Loader načítá každou funkci, její HTML a CSS jen jednou za stránku, i při
opakovaném `<site-features>` nebo jeho odpojení a připojení. Atributy se čtou
při prvním připojení komponenty; jejich pozdější změny funkce nevypínají ani
nezapínají. Pro běžné statické stránky stačí upravit HTML a obnovit stránku.

Při chybě vypíše loader název funkce do konzole a pokračuje ostatními funkcemi.
Na komponentě nastaví `data-state="ready"` nebo `data-state="error"`.
Pro testy je dostupný `await element.ready`, který vrací `{ errors }`.

## Téma a lokální vývoj

Téma se ukládá přímo do `localStorage` pod klíčem `theme`. Stránky na stejném
originu sdílejí nastavení a otevřené panely reagují na jeho změnu. Iframe již
není potřeba. Localhost a GitHub Pages mají vlastní nastavení. Pokud prohlížeč
úložiště zakáže, přepínač funguje alespoň na aktuální stránce.

Spusť z kořene projektu `python -m http.server 8000` a otevři
`http://localhost:8000/larphlavni/index.html`. Otevření přes `file://` nestačí:
ES moduly a načítání JSON/HTML šablon vyžadují HTTP server.
