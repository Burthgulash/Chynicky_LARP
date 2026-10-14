import { fotoGalerieData } from "./foto-galerie-data.js";
import { hideLightbox } from "./foto-lightbox.js";

const galerie = document.querySelector("[data-gallery]");
const select = document.getElementById("filtr-akci");

// Data i popisky jsou autorský obsah tohoto repozitáře.
function zobrazitFotky(akce) {
    hideLightbox();
    const fotky = fotoGalerieData.filter(foto => foto.akce === akce && foto.usedOnSite);
    galerie.innerHTML = fotky.map((foto, index) => `
        <a class="foto-link" href="${foto.original}" style="aspect-ratio: ${foto.width} / ${foto.height}">
            <img class="per-foto-obrazek" src="${foto.src}" alt="${foto.alt}"
                width="${foto.width}" height="${foto.height}"
                loading="${index < 3 ? "eager" : "lazy"}" decoding="async">
        </a>
    `).join("");
    galerie.setAttribute("aria-busy", "false");
}

galerie.addEventListener("load", event => {
    if (event.target.matches(".per-foto-obrazek")) {
        event.target.classList.add("is-loaded");
    }
}, true);

galerie.addEventListener("error", event => {
    if (event.target.matches(".per-foto-obrazek")) {
        // Při chybě zobraz alt a ponech funkční odkaz na originál.
        event.target.classList.add("is-loaded");
    }
}, true);

if (select) {
    // Zachování jednorázového odstranění placeholderu pro Safari/iOS.
    select.addEventListener("focus", () => {
        if (select.options[0]?.disabled) select.remove(0);
    }, { once: true });

    document.getElementById("filtrovat-fotky").addEventListener("click", () => {
        zobrazitFotky(select.value);
    });
    galerie.replaceChildren();
    galerie.setAttribute("aria-busy", "false");
} else {
    zobrazitFotky(galerie.dataset.akce);
}
