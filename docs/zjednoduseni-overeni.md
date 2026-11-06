# Ověření zjednodušení 14.–15. 10. 2026

Kontroly probíhaly v prohlížeči Codex proti místnímu HTTP serveru na `127.0.0.1:8004`. Nejde o ověření produkčního nasazení ani dalších prohlížečů. Nevznikla nová sada automatizovaných testů.

## 1. Galerie bez Font Awesome

Odstraněn import knihovny a dekorativní ikona; tlačítko má dál popisek „Filtrovat“. V okně 1440 × 900 px filtr OS2 zobrazil a načetl všech 29 obrázků, při 320 × 800 px filtr OS1 všech 17. Ověřen tmavý i světlý motiv, žádné vodorovné přetečení a žádné chyby v konzoli při této kontrole. DOM již neobsahuje odkaz na Font Awesome.

## 2. Přepínání mapy bez přepisování SVG

Při šířce 320 px bylo na všech třech detailech ověřeno otevření kliknutím a zavření klávesou Enter, odpovídající text a `aria-expanded`, zachovaný obsah SVG a žádné vodorovné přetečení. Při 1440 px se mapa Perninku vykreslila s bodem a ovládáním při výšce 280 px. Samotné přiblížení a posouvání mapy nebylo zkoušeno. Hlavní kalendář dál vykreslil dvě karty a otevřel společné menu.

Prošly `node --check scripts/obecny.js`, `git diff --check` a jednorázové ověření obou stavů funkce v Node VM: přepnutí textu a ARIA, zachování SVG bez zápisu do `innerHTML` i dosavadní obnovení iframe.

## 3. Přímé odkazy na velké fotografie

Jednorázová kontrola ověřila přesné párování a existenci všech 51 náhledů i jejich cílů (17 + 29 + 5). V prohlížeči byl každý z těchto odkazů otevřen v lightboxu a zavřen klávesou Escape; zobrazená adresa vždy odpovídala odkazu. Při 320 px a pod prefixem `/Chynicky_LARP/` prošlo na všech třech detailech otevření Enterem, přechod šipkami mezi první a poslední fotkou a kontrola, že šipka neotevře zavřený lightbox. Náhledy i kontrolované originály se načetly bez vodorovného přetečení. Ctrl kliknutí otevřelo originál v nové kartě a lightbox ponechalo zavřený. Konzole kontrolované stránky nehlásila chyby ani varování.

Prošly kontrola syntaxe a diffu a jednorázový Node VM check: přímé href, přednačítání, modifikované kliknutí, oba směry včetně zacyklení, klávesnice, simulované přejetí prstem a zavření. Fyzický dotyk ani prohlížeč s vypnutým JavaScriptem nebyly zkoušeny. CSS zůstalo beze změn.

## 5. Společný styl obrázků archivu

Pět inline stylů nahradila existující třída `akce-obrazek`; žádný CSS soubor se neměnil. Při 1440 i 320 px zůstaly stejné zdroje i rozměry všech pěti obrázkových elementů jako před úpravou. Všechny fotky se načetly, archiv zachoval pět karet a nepřetékal. Společná třída navíc používá `object-fit: contain`, takže obsah fotografie zachovává poměr stran i ve vyšším obalu. Ověřeno také přepnutí na tmavý motiv a zavření menu klávesou Escape. Prošel `git diff --check`.

## 6. Jeden společný import Roboto

Odstraněny čtyři duplicitní HTML odkazy na Roboto (kalendář, archiv, návody, košík LALOK). Společný CSS import, `preconnect` i jiný font Open Sans zůstaly zachované. Kalendář, archiv a návody při 1440 i 320 px zachovaly 2, 5 a 2 karty, jejich vypočtené písmo Roboto a nepřetékal obsah; u širokého zobrazení byla ověřena i načtená fontová sada. Košík při 1440 px zachoval výchozí Times New Roman a dostupný společný import. Žádná ze čtyř stránek už nemá duplicitní HTML odkaz na Roboto. Prošel `git diff --check`.

## 8. Odstranění pozůstatku starého motivu

Po ověření nulového počtu odkazů ve zdrojích byl odstraněn jediný SVG soubor i prázdné adresáře `light-mod-cloud-web/`. Závěrečná kontrola na místním serveru ověřila přepnutí kalendáře na světlý motiv, otevřenou podnabídku zachovanou při změně 1440 → 320 px a přechod přes menu do Návratu mocného. Světlý motiv přežil obnovení detailu, všechny jeho obrázky se načetly a stránka nepřetékala. Potom byl ověřen návrat na tmavý motiv včetně obnovení stránky a načtení ikon menu i přepínače. Iframe motivu není přítomný a konzole tohoto detailu nehlásila chyby. Prošel `git diff --check`.

Nezávislá kontrola diffu 14. 10. potvrdila platné obrazové cesty a volající mapy. Tehdy vynechaný bod 4 (úklid CSS a jeho importů) a bod 7 (data a logika návodů) zůstaly nedotčené; v HTML návodů se měnil jen duplicitní font podle bodu 6.

## 7. Vlastní údaje návodů (15. 10. 2026)

Pole `datum` a `organizatori` nahradily textové hodnoty `naklady` a `dobaVyroby`. Na žádost autora se zatím zobrazuje „Zatím neuvedeno“. Odstraněny profily organizátorů i jejich import na stránce návodů; odkaz první karty na nesouvisející akci nahradil dočasný `#`. Otazník se označuje podle obrázku, nezávisle na názvu karty a údajích návodu. Sdílený renderer kalendáře, styly a modul motivu se touto úpravou neměnily.

V místním prohlížeči při 1440 × 900 i 320 × 800 px a v obou motivech zůstaly dvě karty se čtyřmi správnými výplňovými hodnotami. Všechny obrázky včetně obou variant otazníku se načetly a obsah nepřetékal. Byly ověřeny také cesty pod `/Chynicky_LARP/`, zachování motivu při obnovení, nulový počet profilů a jejich tlačítek v návodech a konzole bez chyb či varování. Přechod přes menu do kalendáře zachoval jeho dvě karty, čtyři profily a funkční otevření profilu Kvida.

Prošly `node --check` obou JS souborů návodů a `git diff --check` změněných souborů. Jednorázový Node VM check ověřil jeden zápis do kontejneru, počet karet a hodnot, nepřítomnost starých polí a popoverů, vykreslení odlišných ukázkových nákladů a doby výroby i označení otazníku po změně názvu karty. Oba obrázky návodů a obě varianty otazníku existují. Bez nové sady testů; produkce a další prohlížeče nebyly zkoušeny.
