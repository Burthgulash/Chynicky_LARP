import { fotoGalerieData } from "https://burthgulash.github.io/Chynicky_LARP/scripts/script-foto-galerie/foto-galerie-data.js";
console.log(fotoGalerieData)
// kod pro one time placeholder v selectu pro ios a safari
const select = document.getElementById("filtr-akci");
let hasBeenOpened = false;

select.addEventListener('focus', () => {
    if (!hasBeenOpened) {
        const firstOption = select.options[0];
        if (firstOption.disabled) {
            select.remove(0);  // Remove "Select an option"
        }
        hasBeenOpened = true;
    }
});
/**/

const filtrovat = document.getElementById("filtrovat-fotky");
filtrovat.addEventListener("click", () => {
    // ziskani vybrane akce z selectu
    const vybratAkci = document.getElementById("filtr-akci");
    const vybranaAkce = vybratAkci.value;

    const fotoGalerie = document.getElementById("foto-galerie")
    console.log(vybranaAkce)

    // odstraneni strarzch fotek
    fotoGalerie.innerHTML = ""

    // filtr fotek podle vybrane akce
    const vyfiltrovaneFotky = fotoGalerieData.filter(foto => foto.akce === vybranaAkce)
    console.log(vyfiltrovaneFotky)
    // zobrazeni vyfiltrovanych fotek
    let vyfiltrovaneFotkyHTML = ""
    vyfiltrovaneFotky.forEach(foto => {
        vyfiltrovaneFotkyHTML += `
                <img src="${foto.src}" alt="Foto z akce ${foto.akce}" class="per-foto-obrazek">

        `;
        // const img = document.createElement("img");
        // img.src = foto.src;
        // img.alt = `Foto z akce ${foto.akce}`;
        // img.classList.add("foto-galerie-img");
    })
    fotoGalerie.innerHTML = vyfiltrovaneFotkyHTML;
})