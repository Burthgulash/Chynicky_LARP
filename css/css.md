# Rozdělení CSS složek a souborů

Styly jsou rozdělené podle toho, které části webu je používají. Rozhoduje účel a společné použití, aby se stejný vzhled nemusel upravovat na více místech.

## Složky

| Umístění | Co sem patří a proč |
| --- | --- |
| Přímo `css/` | Styly konkrétní stránky nebo jednoho typu obsahu. Zůstávají oddělené od společného základu, protože je ostatní stránky nepotřebují. |
| `css/sdilene/` | Společný základ a obsahové části používané napříč různými stránkami. Jejich změna se má projevit všude, kde se daná část používá. |
| `css/sdilene/menu/` | Společná hlavička a boční menu. Tvoří jeden celek, proto mají jeden soubor a vlastní podsložku oddělenou od stylů obsahu. |

## Kam patří jednotlivé styly

Cesty v tabulce jsou relativní vůči `css/`.

| Soubor | Odpovědnost a důvod umístění |
| --- | --- |
| `kalendar-akci.css` | Karty kalendáře, archivu a návodů. Tyto přehledy používají stejný typ karet, proto mají jeden společný soubor přímo v `css/`. |
| `o-nas.css` | Úvod a karty organizátorů a CP na stránce O nás, včetně jejich mobilního rozložení. |
| `foto-galerie.css` | Výběr alba a uspořádání samostatné stránky galerie. Je oddělený od společných stylů fotografií, které používají i detaily akcí. |
| `sdilene/obecne-sdilene.css` | Základní vzhled webu, motivy a společné prvky. Patří sem to, co má být stejné napříč stránkami. |
| `sdilene/info.css` | Opakované informační bloky, mapy a společné rozměry portrétů. Načítají ho detaily akcí a stránka O nás; galerie a příběhy ho nepotřebují. |
| `sdilene/obrazky.css` | Fotogalerie a zobrazení zvětšené fotografie (lightbox). Používají je samostatná galerie i galerie v detailech akcí. |
| `sdilene/menu/menu.css` | Celá společná hlavička, boční menu a jeho ovládací prvky. Jejich styly zůstávají na jednom místě. |

Při úpravě použij soubor odpovídající dané části webu. Mobilní úpravy patří do stejného souboru jako běžný vzhled. Nový soubor nebo podsložku přidávej, až když vznikne samostatná část, která se do současného rozdělení nehodí.

Mimo tuto strukturu je `LALOK/styly/stryle.css` ve složce žertovných stránek. Současné HTML ho nenačítají; není součástí společných stylů webu.
