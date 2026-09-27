import { data } from "./navody-hlavni-data.js";

document.querySelector(".kalendar-akci2").innerHTML = data.map((item) => `
  <div class="akce-container">
    <div class="akce-popis">
      <a href="${item.link}" class="akce-tlacitko">${item.nazev}</a>
      <div class="datumy">
        <p class="datum-right">Přibližné náklady :</p>
        <div class="moznost">
          ${item.datum.map((date) => `<p class="datum-left">${date}</p>`).join("")}
        </div>
      </div>
      <div class="organizatori">
        <p class="organizatori-text">Doba výroby:</p>
        ${item.organizatori.map((name) => name === "Již brzy"
          ? `<p class="organizatori-text">${name}</p>`
          : `<button class="organizatori-text" popovertarget="${name}">${name}</button>`
        ).join("")}
      </div>
    </div>
    <div class="akce-img">
      <img class="akce-obrazek" src="${item.obrazek}" alt="${item.nazev}"
        ${item.organizatori.includes("Již brzy") ? 'id="icon-img" data-name="questionmark"' : ""}>
    </div>
  </div>`).join("");
