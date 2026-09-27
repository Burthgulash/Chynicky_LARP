import { data } from "./navody-hlavni-data.js";

let htmlRendered = "";

data.forEach((data, index) => {
  /*let datumLongerThan1;
    // zjisti na array jestli je 1 dlouhy nebo vic
    if (data.datum.lenght < 1 ) {
        datumLongerThan1 = true
    }*/
  let htmlRenderedOrganizatori = "";
  let jizBrzycode = "";
  data.organizatori.forEach((organizator) => {
    if (organizator === "Již brzy") {
      htmlRenderedOrganizatori += `
            <p class="organizatori-text">${organizator}</p>`;
      jizBrzycode = `id=icon-img data-name="questionmark"`;
      return;
    }
    htmlRenderedOrganizatori += `
    <button class="organizatori-text" popovertarget="${organizator}">${organizator}</button>
    `;
  });

  let htmlRenderedDatum = "";
  data.datum.forEach((datum) => {
    htmlRenderedDatum += `
    <p class="datum-left">${datum}</p>
    `;
  });
  htmlRendered += `
<div class="akce-container">
    <div class="akce-popis">
        <a href="${data.link}">
            <button id="akce-tlacitko" class="akce-tlacitko">${data.nazev}</button>
        </a>
        <div class="datumy">
            <div style="margin: 0 0 10px 0;">
                <p class="datum-right">Přibližné náklady :</p>
            </div>
            <div class="moznost">
                ${htmlRenderedDatum}
            </div>
        </div>
        <div class="organizatori">
            <p class="organizatori-text">Doba výroby:</p>
            ${htmlRenderedOrganizatori}
        </div>
    </div>
    <div class="akce-img">
        <img style="width: 100%; justify-content: center; margin: 5px 0 5px 0;" src="${data.obrazek}" ${jizBrzycode}>
    </div>
</div>
`; // TODO: udelat qestion mark light mod

  document.querySelector(".kalendar-akci2").innerHTML = htmlRendered;
});
