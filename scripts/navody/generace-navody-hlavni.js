import { data } from "./navody-hlavni-data.js";

document.querySelector(".kalendar-akci2").innerHTML = data.map((item) => `
  <div class="akce-container">
    <div class="akce-popis">
      <a href="${item.link}" class="akce-tlacitko">${item.nazev}</a>
      <div class="datumy">
        <p class="datum-right">Přibližné náklady :</p>
        <div class="moznost">
          <p class="datum-left">${item.naklady}</p>
        </div>
      </div>
      <div class="organizatori">
        <p class="organizatori-text">Doba výroby:</p>
        <p class="organizatori-text">${item.dobaVyroby}</p>
      </div>
    </div>
    <div class="akce-img">
      <img class="akce-obrazek" src="${item.obrazek}" alt="${item.nazev}"
        ${item.obrazek.endsWith("/questionmark.png") ? 'id="icon-img" data-name="questionmark"' : ""}>
    </div>
  </div>`).join("");
