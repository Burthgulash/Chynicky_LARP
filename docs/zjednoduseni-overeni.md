# Ověření zjednodušení 14. 10. 2026

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
