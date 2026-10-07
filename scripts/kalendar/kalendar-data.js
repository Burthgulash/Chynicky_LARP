export const data = [
  {
    nazev: "Již brzy",
    datum: ["Již brzy"],
    organizatori: ["Kvido Redl", "Hugo Redl", "a další"],
    obrazek:
      "https://burthgulash.github.io/kvido html-img/foto/Ikony-img/questionmark.png",
    link: "#",
    misto: {
      misto: "Pernink, kostelní 11 - apartmánová chalupa",
      mapyLink: "https://mapy.com/s/pejegocono",
    },
  },
  {
    nazev: "Poslední ortel",
    datum: ["Někdy v červnu 2027"],
    organizatori: ["Kvido Redl", "Hugo Redl", "Kristián Páca"],
    obrazek:
      "../kvido html-img/foto/Z.Popelu.kalicha-img/Prapor-chatgpt.webp",
    link: "#",
    misto: {
      misto: "Školní Farma (Chýnice 29)",
      mapyLink: "https://mapy.com/s/hufumuzega",
    },
  },
];

/*
Pole "misto" může být text nebo objekt { misto: string, mapyLink?: string }.
"mapyLink" je adresa z atributu src v kódu Mapy.com → Sdílet → Vložit mapu
do vlastních stránek. Běžný odkaz ke sdílení není odkaz pro vloženou mapu.
S mapyLink se místo zobrazí jako tlačítko s mapovým popoverem, bez něj jen jako text.
*/
