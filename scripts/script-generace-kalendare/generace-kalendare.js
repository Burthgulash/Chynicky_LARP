import { data } from "./kalendar-data.js";

let htmlRendered = ""

data.forEach((data, index) => {

    /*let datumLongerThan1;
    // zjisti na array jestli je 1 dlouhy nebo vic
    if (data.datum.lenght < 1 ) {
        datumLongerThan1 = true
    }*/
    let htmlRenderedOrganizatori = "";
    let jizBrzycode = ""
    data.organizatori.forEach(organizator => {
        if (organizator === "Již brzy") {
            htmlRenderedOrganizatori += `
            <p class="organizatori-text">${organizator}</p>`
            jizBrzycode = `id=icon-img data-name="questionmark2.2"`
            return
        }
        htmlRenderedOrganizatori += `
    <button class="organizatori-text" popovertarget="${organizator}">${organizator}</button>
    `
    });

    let htmlRenderedDatum = ""
    data.datum.forEach(datum => {
        htmlRenderedDatum += `
    <p class="datum-left">${datum}</p>
    `
    })

    let htmlRenderedMisto = ""
    const isOsmLinkHtmlRenderedMisto = data.misto.osmLink ? true : false
    const htmlTagRenderedMisto = isOsmLinkHtmlRenderedMisto ? "button" : "p"
    if (isOsmLinkHtmlRenderedMisto) {
        const htmlPopoverRenderedMisto = `
            <div class="popover" popover id="Školní Farma (Chýnice 29)">
                <h2>Místo</h2>
                <p>${data.misto.misto}</p>
                <br>
                <iframe class="mini-map" id="mini-map"
                    src="${data.misto.osmLink}"
                    style="border: 1px solid black"></iframe>
                <br>
                <a href="${data.link}">Více info na stránce ${data.nazev}</a>
            </div>
        `

        let htmlPopoverRenderedMistoDomNode = document.createElement("div")
        htmlPopoverRenderedMistoDomNode.innerHTML = htmlPopoverRenderedMisto
        document.body.appendChild(htmlPopoverRenderedMistoDomNode)
        window.addEventListener("DOMContentLoaded", () => {
            document.querySelector(".misto-btn").addEventListener("click", () => {
                const miniMap = document.getElementById("mini-map")
                miniMap.src = miniMap.src; // Reload the iframe to ensure proper rendering
            })
        })
    }
    htmlRenderedMisto = `
        ${ data.misto.misto || typeof data.misto === "string" ? 
            `
            <p class="datum-right">Místo :</p>
            <${htmlTagRenderedMisto} class="datum-left misto-btn" ${isOsmLinkHtmlRenderedMisto ? `popovertarget="${data.misto.misto}"` : ""}>
                ${data.misto.misto ? data.misto.misto : data.misto}
            </${htmlTagRenderedMisto}>
            `
            :
            ""
        }
    `

    htmlRendered += `
<div class="akce-container">
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
            ${ data.misto.misto || typeof data.misto === "string" ? 
            `
            <div class="misto">
                ${htmlRenderedMisto}
            </div>
            `
            :
            ""
        }
        <div class="organizatori">
            <p class="organizatori-text">Organizátoři :</p>
            ${htmlRenderedOrganizatori}
        </div>
    </div>
    <div class="ozveny2-img">
        <img style="" class="akce-obrazek" src="${data.obrazek}" ${jizBrzycode}>
    </div>
</div>
`// TODO: udelat qestion mark light mod

    document.querySelector(".kalendar-akci2").innerHTML = htmlRendered
});