import { data } from "./kalendar-data.js";

document.querySelector(".kalendar-akci2").innerHTML = data.map((event, index) => {
  const dates = event.datum.map((date) => `<p class="datum-left">${date}</p>`).join("");
  const organizers = event.organizatori.map((name) => name === "Již brzy"
    ? `<p class="organizatori-text">${name}</p>`
    : `<button class="organizatori-text" popovertarget="${name}">${name}</button>`
  ).join("");
  const place = typeof event.misto === "string" ? event.misto : event.misto?.misto;
  const mapUrl = event.misto?.mapyLink;
  const placeId = `misto-${index}`;

  return `
    <div class="akce-container">
      <div class="akce-popis">
        <a href="${event.link}" class="akce-tlacitko">${event.nazev}</a>
        <div class="datumy">
          <p class="datum-right">Datum :</p>
          <div class="moznost">${dates}</div>
        </div>
        ${place ? `
          <div class="misto">
            <p class="datum-right">Místo :</p>
            ${mapUrl
              ? `<button class="datum-left misto-btn" popovertarget="${placeId}">${place}</button>
                 <div class="popover" popover id="${placeId}">
                   <h2>Místo</h2>
                   <p>${place}</p>
                   <iframe class="mini-map" src="${mapUrl}" title="Mapa místa ${place}" loading="lazy"></iframe>
                   <a href="${event.link}">Více info na stránce ${event.nazev}</a>
                 </div>`
              : `<p class="datum-left">${place}</p>`}
          </div>` : ""}
        <div class="organizatori">
          <p class="organizatori-text">Organizátoři :</p>
          ${organizers}
        </div>
      </div>
      <div class="akce-img">
        <img class="akce-obrazek" src="${event.obrazek}" alt="${event.nazev}"
          ${event.organizatori.includes("Již brzy") ? 'id="icon-img" data-name="questionmark"' : ""}>
      </div>
    </div>`;
}).join("");
