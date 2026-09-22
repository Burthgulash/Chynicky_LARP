const organizerData = {
  "Hugo Redl": {
    id: "Hugo Redl",
    image:
      "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/O%20nás-img/20250309_090631.jpg",
    title: "Hugo",
    description:
      "Štítonoš, berserk. Svou sekerou rozmlátí vše, co se mu postaví do cesty. Na něj rozhodně neútočte, pokud nemáte dostatečnou početní převahu, a i tak si to pořádně rozmyslete. Často, mimo jiné, řeší rozpočet.",
    href: "https://burthgulash.github.io/Chynicky_LARP/O%20nas/O%20nás.html",
  },
  "Kvido Redl": {
    id: "Kvido Redl",
    image:
      "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/O%20nás-img/20250309_081702.jpg",
    title: "Kvido, Ereth",
    description:
      "Lukostřelec a obstojný šermíř. Střežte se jeho šípům, a hlavně si dávejte pozor na rychlá přepadení ze zálohy. Navíc je tvůrce většiny herních mechanik.",
    href: "https://burthgulash.github.io/Chynicky_LARP/O%20nas/O%20nás.html",
  },
  "Kristián Páca": {
    id: "Kristián Páca",
    image:
      "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/O%20nás-img/20250309_093520.jpg",
    title: "Kristian, Haakon",
    description:
      "Bard a čaroděj. Pokud s ním budete smlouvat, nikdy nezískáte přívětivou cenu. V boji zvládne přemoct většinu nepřátel. K tomu vytváří spoustu pravidel.",
    href: "https://burthgulash.github.io/Chynicky_LARP/O%20nas/O%20nás.html",
  },
  "Julie Redlová": {
    id: "Julie Redlová",
    image:
      "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/O%20nás-img/IMG-20250112-WA0007.jpg",
    title: "Julie",
    description:
      "Skupina CéPek by bez ní nebyla úplná. Střílí z luku a poradí si i s mečem, štítem někdy i s kopím.",
    href: "https://burthgulash.github.io/Chynicky_LARP/O%20nas/O%20nás.html",
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
        <a href="${organizer.href}">Více info na O nás</a>
      </div>
    `;
  }
}

if (!customElements.get("organizator-popover")) {
  customElements.define("organizator-popover", OrganizatorPopover);
}
