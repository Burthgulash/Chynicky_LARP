export const data = [
  {
    nazev: "Poslední ortel",
    datum: ["Někdy v červnu 2027"],
    organizatori: ["Kvido Redl", "Hugo Redl", "Kristián Páca"],
    obrazek: "../assets/Z.Popelu.kalicha-img/Prapor-chatgpt.webp",
    link: "#",
    misto: {
      misto: "Školní Farma (Chýnice 29)",
      mapyLink: "https://mapy.com/s/hufumuzega",
    },
  },
  {
    nazev: "Již brzy",
    datum: ["Již brzy"],
    organizatori: ["Již brzy"],
    obrazek: "../assets/Ikony-img/questionmark.png",
    link: "#",
    misto: "Již brzy",
  },
];

/*
Pole "misto" může být text nebo objekt { misto: string, mapyLink?: string }.
"mapyLink" je adresa z atributu src v kódu Mapy.com → Sdílet → Vložit mapu
do vlastních stránek. Běžný odkaz ke sdílení není odkaz pro vloženou mapu.
S mapyLink se místo zobrazí jako tlačítko s mapovým popoverem, bez něj jen jako text.
*/
