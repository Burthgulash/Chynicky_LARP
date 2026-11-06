const organizerImageRoot = new URL("../assets/", import.meta.url);
const organizerInfoUrl = new URL("../O nas/O nás.html", import.meta.url).href;

const organizerData = {
  "Hugo Redl": {
    id: "Hugo Redl",
    image:
      new URL("O nás-img/hugo-hrabe.webp", organizerImageRoot).href,
    title: "Hugo",
    description:
      "Řeší spoustu fyzických příprav, jako je výroba zbraní, herních předmětů a hlavně rozpočet a finance. Podílí se také na vytváření postav a jiných pilířů příběhu.",
  },
  "Kvido Redl": {
    id: "Kvido Redl",
    image:
      new URL("O nás-img/kvido-tulak-zpk.webp", organizerImageRoot).href,
    title: "Kvido, Ereth",
    description:
      "V jeho hlavě se rodí většina konceptů herních mechanik a samotných akcí. Má na starosti spoustu fází přípravy, jako psaní postav či pravidel, a také rozvrhuje čas a CP na místě.",
  },
  "Kristián Páca": {
    id: "Kristián Páca",
    image:
      new URL("O nás-img/kristian-jednoruk-zpk.webp", organizerImageRoot).href,
    title: "Kristian, Haakon",
    description:
      "Přispívá ke psaní postav a jiných dokumentů ke hře. Vymýšlí části příběhu a mechaniky pro jejich funkčnost. Mimo to komentuje pravidla, koncepty akcí a další.",
  },
  "Julie Redlová": {
    id: "Julie Redlová",
    image:
      new URL("O nás-img/IMG-20250112-WA0007.webp", organizerImageRoot).href,
    title: "Julie",
    description:
      "Jejím hlavním přispíváním k našim LARPům je koordinace a tvoření kostýmů i doplňků. To, že zde její práce na přípravách končí, je však dávná minulost. Orgnizuje hráče a je k ruce při jakékoli činnosti.",
  },
};

class OrganizatorPopover extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute("name") || this.getAttribute("data-name");
    const organizer =
      organizerData[name] || organizerData[this.getAttribute("id")];

    if (!organizer) {
      console.warn(`No organizer data found for: ${name}`);
      return;
    }

    this.innerHTML = `
      <div class="popover" popover id="${organizer.id}">
        <img class="foto" src="${organizer.image}" alt="icon" width="150px">
        <h2>${organizer.title}</h2>
        <h3>${organizer.description}</h3>
        <a href="${organizerInfoUrl}">Více info na O nás</a>
      </div>
    `;
  }
}

if (!customElements.get("organizator-popover")) {
  customElements.define("organizator-popover", OrganizatorPopover);
}
