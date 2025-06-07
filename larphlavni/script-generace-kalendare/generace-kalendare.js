import { data } from "https://burthgulash.github.io/Chynicky_LARP/larphlavni/script-generace-kalendare/kalendar-data.js"

let htmlRendered = ""

data.forEach((data, index) => {

    /*let datumLongerThan1;
    // zjisti na array jestli je 1 dlouhy nebo vic
    if (data.datum.lenght < 1 ) {
        datumLongerThan1 = true
    }*/
    let htmlRenderedOrganizatori = "";
    data.organizatori.forEach(organizator => {
        htmlRenderedOrganizatori += `
    <p class="organizatori-text">${organizator}</p>
    `
    });

    let htmlRenderedDatum = ""
    data.datum.forEach(datum => {
        htmlRenderedDatum += `
    <p class="datum-left">${datum}</p>
    `
    });
    htmlRendered += `
<div class="ozveny-stinu2-navrat">
    <div class="ozveny2-popis">
        <a href="${data.link}">
            <button id="akce-tlacitko" class="akce-tlacitko">${data.nazev}</button>
        </a>
        <div class="datumy">
            <div style="margin: 0 0 10px 0;">
                <p class="datum-right">Datum :</p>
            </div>
            <div class="moznost">
                ${htmlRenderedDatum}
            </div>
        </div>
        <div class="organizatori">
            <p class="organizatori-text">Organizátoři :</p>
            ${htmlRenderedOrganizatori}
        </div>
    </div>
    <div class="ozveny2-img">
        <img style="width: 100%; justify-content: center; margin: 5px 0 5px 0;" src="${data.obrazek}">
    </div>
</div>
`

    document.querySelector(".kalendar-akci2").innerHTML = htmlRendered
});