# Komprese fotografií – 14. 10. 2026

Bylo vyzkoušeno 68 existujících WebP fotografií a převedeno všech 13 JPEG fotografií Per1 až Per13 z `assets/O.S.2-img/`. Vyměnilo se 63 existujících WebP; pět dalších zůstalo původních, protože nová verze byla větší nebo ušetřila méně než 5 %. Ikony, ilustrace, `LALOK/` a ostatní obrázky v jiných formátech se neměnily.

## Výsledek

MB zde znamená 1 000 000 bajtů. Tabulka porovnává soubory fotografií před úpravou a jejich výsledné WebP. U PER je výchozí hodnota součet JPEG; JPEG originály se navíc zachovaly pro lightbox.

| Sada | Počet | Před | Po | Úspora |
| --- | ---: | ---: | ---: | ---: |
| OS1 | 17 | 11,73 MB | 8,42 MB | 28,25 % |
| OS2 | 29 | 13,97 MB | 9,66 MB | 30,89 % |
| PER (`O.S.2-img`) | 13 | 2,26 MB | 1,20 MB | 46,84 % |
| Ostatní WebP fotografie | 22 | 7,73 MB | 5,25 MB | 32,09 % |
| Celkem | 81 | 35,70 MB | 24,53 MB | 31,29 % |

Existující WebP fotografie samotné ušetřily 10,11 MB. Po přidání PER náhledů a zachování všech JPEG originálů je čistá úspora obrazových souborů v pracovním stromu 8,91 MB. Historické verze v Gitu tato změna nezmenšuje.

Přesné bajty a výsledek každého souboru jsou v [CSV měření](webp-compression-results.csv). Sloupce `bajtu_po` a `uspora_procent` popisují skutečně použitý výsledek; sloupce `kandidat_*` zahrnují i pět odmítnutých pokusů. PSNR je rozdíl kandidáta proti dekódovanému zdroji, nikoli záruka vizuální kvality. Měření zahrnuje i fotografie, které web právě nezobrazuje.

## Proč byly staré WebP větší

- OS1/OS2 obsahují 46 skutečných WebP fotografií. Všechny používají ztrátový obrazový blok `VP8 `, bez ICC, EXIF či jiných dodatečných bloků. Příčinou tedy není přejmenovaný JPEG, bezeztrátový režim ani metadata.
- U 43 fotografií existuje JPEG protějšek ve stejném rozlišení. Před změnou bylo 27 WebP větších; celkem měly 23 293 586 bajtů proti 20 798 880 bajtům JPEG. Všech 43 párů má rozdílné dekódované pixely.
- U tří vzorků (`WhatsApp Image 2025-03-08 at 11.21.23 (1)`, `OS2-1`, `OS2-24`) převod jejich JPEG přes Pillow/libwebp s `quality=85, method=4` vytvořil soubor shodný se starým WebP bajt po bajtu, ověřeno SHA-256. To prokazuje reprodukovatelné běžné nastavení těchto vzorků; původní online službu ani nastavení všech ostatních souborů nelze určit.
- Pouhé zvýšení kompresního úsilí na `method=6` při zachování kvality 85 u prvních dvou vzorků ušetřilo jen 2,36 % a 2,11 %. Výsledek byl stále větší než JPEG. Výrazná úspora tedy vyžadovala snížení kvality, nikoli jen opakování stejného převodu.

Číslo kvality není společná stupnice JPEG a WebP. WebP s vyšším nastavením kvality může uložit větší soubor než už komprimovaný JPEG, aniž by obnovilo ztracený detail. Tento případ popisuje také [oficiální FAQ WebP](https://developers.google.com/speed/webp/faq#can_a_webp_image_grow_larger_than_its_source_image).

Po úpravě mají tyto 43 WebP celkem 16 605 834 bajtů; každý je menší než svůj JPEG protějšek. JPEG originály zůstaly beze změny.

## Použitý postup a kvalita

Použit byl Pillow 12.3.0 s libwebp 1.6.0, ztrátové `quality=75, method=6`. Všechna rozlišení, orientace a přítomné ICC, EXIF a XMP se zachovaly. U 43 spárovaných OS1/OS2 se kódovalo přímo z JPEG, aby se nekumulovaly předchozí ztráty WebP. U dalších fotografií bez odpovídajícího originálu byl zdrojem existující WebP. Žádná fotografie se nezmenšovala v pixelech.

Příklad jednorázového převodu v Pythonu s Pillow:

```python
from PIL import Image

with Image.open("Per9.jpg") as image:
    metadata = {key: image.info[key] for key in ("icc_profile", "exif", "xmp") if key in image.info}
    image.convert("RGB").save("Per9.webp", quality=75, method=6, **metadata)
```

Tento příklad je pro neprůhlednou fotografii, nikoli pro ikonu s průhledností. Před nahrazením vždy porovnej velikost i výřezy v měřítku 1:1. `method=6` znamená více práce enkodéru při přípravě souboru; návštěvník webu nic nekomprimuje.

Nová komprese je ztrátová. Vizuálně byly porovnány výřezy OS1, OS2 a PER a další reprezentativní fotografie. Na jemných texturách je při zvětšení patrná další ztráta detailu; rozlišení zůstalo stejné. Původní JPEG jsou dál dostupné přes lightbox. Pět již dobře komprimovaných WebP portrétů s malou či zápornou úsporou nebylo nahrazeno.

## Ověření

Každý kandidát byl znovu plně dekódován, zkontroloval se skutečný formát, rozměry, orientace a metadata. Při aplikaci se ověřily kontrolní součty zdrojů i kandidátů. Katalog má dál 59 záznamů a 51 veřejných fotografií; změnilo se pouze 13 cest `src` u PER. `original`, `alt`, rozměry a `usedOnSite` se zachovaly.

- Všech 59 cest `src` i `original` existuje a rozměry odpovídají katalogu. Všech 81 výsledných souborů se plně dekóduje. Kontrolní součty potvrdily zachování všech JPEG, ikon a ostatních souborů mimo uvedenou změnu.
- `node --check scripts/galerie/foto-galerie-data.js` a `git diff --check` prošly. Nebyla přidána sada testů ani závislost projektu.
- Místní HTTP náhled: ve společné galerii se skutečně načetlo všech 17 OS1 a 29 OS2 náhledů bez chyb a filtr PER vykreslil pět nových WebP. Lightbox PER otevřel zachovaný JPEG 1600 × 1200; lightbox OS2-27 otevřel nově komprimovaný WebP 4000 × 3000.
- Byly otevřeny všechny tři vnořené galerie, ověřeny počty 17/29/5, mobilní detail PER při šířce 390 px a společná galerie při 1440 px. Na hlavní stránce bylo ověřeno komprimované pozadí světlé hlavičky, menu po změně šířky a motiv po přechodu na O nás. Všech pět portrétů na O nás se načetlo.
- Ručně byly porovnány výřezy 1:1 z OS1, OS2 (včetně fotografie s nejnižší naměřenou PSNR), PER, portrétu, hlavičky a fotografie z příběhů. Každý jednotlivý výřez, produkční nasazení, jiné prohlížeče a skutečná doba načítání na pomalé síti nebyly ověřeny.
