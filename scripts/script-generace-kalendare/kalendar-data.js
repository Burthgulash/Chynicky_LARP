export const data = [

    {
        nazev: "Z popelu kalicha",
        datum: [
            "5.6.-",
            "7.6 2026",
        ],
        organizatori: [
            "Kvido Redl",
            "Hugo Redl",
            "Kristián Páca",
        ],
        obrazek: "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/Z.Popelu.kalicha-foto/Prapor-chatgpt.png",
        link: "https://burthgulash.github.io/Chynicky_LARP/Z.Popelu.kalicha/Z.Popelu.kalicha.html",
        misto: {
            misto: "Školní Farma (Chýnice 29)",
            osmLink: "https://www.openstreetmap.org/export/embed.html?bbox=14.2695,49.9959,14.2705,49.9961&layer=mapnik&marker=49.996045,14.270132&zoom=14"
        }
    },
    {
        nazev: "Již brzy",
        datum: [
            "Již brzy",
        ],
        organizatori: [
            "Již brzy",
        ],
        obrazek: "https://burthgulash.github.io/kvido html-img/foto/Ikony-img/questionmark2.2.png",
        link: "#",
        misto: "Již Brzy"
    },
]

/*
PROSIM CIST POKUD ZADAVAS MISTO DO DAT!!!

Pole "misto" u kazde akce muze byt:
1) string -> generace-kalendare.js vykresli jen text (bez tlacitka, bez mapy).
2) object { misto: string, osmLink?: string }
   - "misto" je text zobrazeny vedle "Misto :".
   - "osmLink" pokud je vyplnen, vykresli se tlacitko s popoverem a iframe mapou.
   - "osmLink" najdes vzdy na akci v <iframu src="TADY"> a pokud to nemame tak si nejak porad
   - kdyz "osmLink" chybi nebo je prazdny, chova se to jako obycejny text.
Tato logika vychazi z toho, ze skript kontroluje "data.misto.osmLink" a zaroven akceptuje
primo string v "data.misto" aby pri jiz brzy tam nemusel byt zbutecny object.


Doufam ze to chapes.
*/
