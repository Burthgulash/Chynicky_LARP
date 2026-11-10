# Ověření oprav rozhraní — 10. 11. 2026

## Změny

- Profily používají společný styl v css/sdilene/obecne-sdilene.css, pozadí --bg-accent-clr a text --text-clr. Šířka je nejvýše 600 px a jinak dostupná šířka minus okraje. Dlouhý obsah se posouvá, fotografie je omezena velikostí okna. Oprava platí pro všechny stránky s organizator-popover.
- Archiv má sedm akcí. Doplněný Návrat mocného má krátkou anotaci odvozenou ze stávajícího detailu a tematický otazník. Menu nově obsahuje Přes hřebeny; množina jeho sedmi akcí odpovídá archivu.
- Osm původních fotek Za linií má odkazy na JPEG originály a používá existující lightbox. HTML obsahuje data-gallery, odkazy .foto-link a rezervaci poměru stran 4:3. Stávající katalog galerie ani usedOnSite se nemění. Nepoužitý Kvidův popover a import jeho komponenty byly z této stránky odstraněné.
- questionmark-light.png má skutečný alfa kanál místo namalované šachovnice. Tmavá varianta questionmark.png již skutečnou průhlednost měla a zůstala zachovaná. Otazník v sekci Vaše nápady na Přes hřebeny se nyní také přepíná podle motivu.

## Skutečně provedené kontroly

Místní HTTP náhled: http://127.0.0.1:8777/. Prohlížeč Chrome. Původní server na portu 8766 zobrazoval starý obsah, proto se výsledky opravené verze ověřovaly až na novém serveru z explicitně určené složky repozitáře.

- Kalendář, archiv, návody a Přes hřebeny zkontrolovány při šířkách 320 a 1440 px v obou motivech; bez vodorovného přetékání. Všechny tematické otazníky načetly správnou variantu.
- Kvidův profil při šířce 320 px měl šířku 273 px (prostor zúžený také systémovým posuvníkem), při 1440 px měl 600 px; bez vodorovného přetékání uvnitř profilu. Světlý motiv: černý text a rgb(235,235,235) pozadí. Tmavý motiv: bílý text a rgb(26,26,26) pozadí. Při šířce 390 px měl profil 358 px a byl ověřen i snímkem.
- Profil na vnořené stránce Z popelu kalicha otevřen v obou motivech; stejný společný styl a zachovaná volba motivu při navigaci. Escape profil zavřel.
- Menu otevřeno klávesnicí, podnabídka obsahuje všech sedm akcí. Otevřené menu zachovalo stav při změně šířky. Odkaz Přes hřebeny skutečně otevřel správný detail s pěti fotkami.
- Archiv vykreslil sedm karet a dvě tematické zástupné ikony. Nový odkaz Návrat mocného skutečně otevřel odpovídající detail.
- Všech osm fotek Za linií otevřeno v lightboxu: Per6.jpg až Per13.jpg, všechny se dekódovaly v šířce 1600 px. Šipka vpravo přešla z Per6 na Per7; Shift+Tab z prvního tlačítka přešel na poslední, Escape zavřel dialog a vrátil fokus na původní odkaz. Obnovilo se také posouvání stránky. Na stránce je právě jeden lightbox.
- Po závěrečném odstranění nepoužité komponenty znovu ověřeno otevření fotky Za linií, mapa a původní galerie Přes hřebeny (stále 5 fotek, první originál Per9.jpg).
- Mapa v kalendáři a mapa na Za linií se otevřely; mapa na Za linií se také zavřela. V zachycené konzoli nejsou chyby.
- Obě PNG varianty mají alfa kanál s rozsahem 0–255 a průhledným rohovým pixelem; světlý výsledek byl zkontrolován také přímo v kalendáři, bez šachovnice.
- node --check scripts/generace-menu.js a git diff --check prošly. Cíle nových odkazů a všech osm náhledů/originálů existují.

Změny jsou místní, nic nebylo publikováno. LALOK byl podle zadání vynechán. Fyzické přejetí prstem, Safari a Firefox nebyly ověřovány. Nevznikla sada testů ani nová závislost projektu. Cizí úprava AGENTS.md zůstala zachovaná.

## Úprava obrázku

Výstup je uložený v assets/Ikony-img/questionmark-light.png. Použit vestavěný imagegen, režim background-extraction. Zadání: odstranit pouze namalovanou šedobílou šachovnici včetně prostoru uvnitř obrysu a kolečka, zachovat černý obrys otazníku a vyrobit skutečnou průhlednost bez nového pozadí, stínů nebo dalších prvků. Originální výstup nástroje zůstal zachovaný mimo repozitář; v projektu je finální PNG včetně alfa kanálu.
