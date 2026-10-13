const siteRoot = new URL("../", import.meta.url);

class SiteMenu extends HTMLElement {
  connectedCallback() {
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "Hlavní nabídka");
    if (!this.childElementCount) this.render();
    const trigger = this.closest("site-header")?.querySelector(".menu-toggle");
    if (trigger) trigger.disabled = false;
    this.setOpen(this.classList.contains("side-menu-open"));
  }

  disconnectedCallback() {
    this.setOpen(false);
  }

  render() {
    this.append(
      this.createGroup(
        "Kalendář akcí",
        "kalendar-akci/index.html",
        "menu-kalendar",
        [
          [
            "Z Popelu Kalicha",
            "Odehrane LARPy/Z.Popelu.kalicha/Z.Popelu.kalicha.html",
          ],
        ],
      ),
      this.createLink("O nás", "O nas/O nás.html"),
      this.createLink("Příběhy", "pribehy/pribehy.html"),
      this.createGroup(
        "Odehrané LARPy",
        "Odehrane LARPy/Odehrane LARPy.html",
        "menu-archiv",
        [
          [
            "Návrat mocného",
            "Odehrane LARPy/Navrat-mocneho/Navrat-mocneho.html",
          ],
          [
            "Ozvěny Stínů 2",
            "Odehrane LARPy/Ozveny stinu2/Ozvěny stínů 2.html",
          ],
          ["Ozvěny stínů", "Odehrane LARPy/Ozveny stinu/Ozvěny stínů.html"],
          ["Hraniční tvrz", "Odehrane LARPy/Hranicni tvrz/Hranicni tvrz.html"],
        ],
      ),
    );

    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "darkXlight";
    themeButton.id = "button-theme-switch";
    themeButton.setAttribute("aria-label", "Přepnout na světlý motiv");
    const themeImage = document.createElement("img");
    themeImage.alt = "";
    themeImage.src = new URL(
      "kvido html-img/foto/Ikony-img/slunce-icon.webp",
      siteRoot,
    ).href;
    themeButton.append(themeImage);
    this.append(themeButton);
  }

  createLink(label, path) {
    const link = document.createElement("a");
    link.textContent = label;
    link.href = new URL(path, siteRoot).href;
    link.addEventListener("click", () => this.setOpen(false));
    return link;
  }

  createGroup(label, path, id, links) {
    const group = document.createElement("div");
    group.className = "menu-item-s-submenu";
    const row = document.createElement("div");
    row.className = "menu-link";
    const arrow = document.createElement("button");
    arrow.type = "button";
    arrow.className = "menu-sipka";
    arrow.setAttribute("aria-label", `Podnabídka: ${label}`);
    arrow.setAttribute("aria-controls", id);
    arrow.setAttribute("aria-expanded", "false");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 640 640");
    svg.setAttribute("aria-hidden", "true");
    const svgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    // Font Awesome Free 7, CC BY 4.0: https://fontawesome.com/license/free
    svgPath.setAttribute(
      "d",
      "M480 224C492.9 224 504.6 231.8 509.6 243.8C514.6 255.8 511.8 269.5 502.7 278.7L342.7 438.7C330.2 451.2 309.9 451.2 297.4 438.7L137.4 278.7C128.2 269.5 125.5 255.8 130.5 243.8C135.5 231.8 147.1 224 160 224L480 224z",
    );
    svg.append(svgPath);
    arrow.append(svg);

    const submenu = document.createElement("div");
    submenu.className = "submenu";
    submenu.id = id;
    submenu.append(...links.map(([text, url]) => this.createLink(text, url)));
    row.append(this.createLink(label, path), arrow);
    group.append(row, submenu);

    const setExpanded = (open) => {
      group.classList.toggle("submenu-open", open);
      arrow.setAttribute("aria-expanded", String(open));
    };
    arrow.addEventListener("click", () => {
      const open = group.classList.toggle("submenu-clicked");
      setExpanded(open);
    });
    arrow.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") setExpanded(true);
    });
    group.addEventListener("pointerleave", (event) => {
      if (
        event.pointerType === "mouse" &&
        !group.classList.contains("submenu-clicked") &&
        !group.contains(document.activeElement)
      ) {
        setExpanded(false);
      }
    });
    group.addEventListener("focusout", (event) => {
      if (
        !group.contains(event.relatedTarget) &&
        !group.matches(":hover") &&
        !group.classList.contains("submenu-clicked")
      ) {
        setExpanded(false);
      }
    });
    return group;
  }

  toggle() {
    this.setOpen(!this.classList.contains("side-menu-open"));
  }

  setOpen(open) {
    const trigger = this.closest("site-header")?.querySelector(".menu-toggle");
    if (!open && this.contains(document.activeElement)) trigger?.focus();
    this.classList.toggle("side-menu-open", open);
    this.inert = !open;
    trigger?.setAttribute("aria-expanded", String(open));
    if (open) {
      document.addEventListener("click", this.onOutsideClick);
      document.addEventListener("keydown", this.onKeyDown);
    } else {
      document.removeEventListener("click", this.onOutsideClick);
      document.removeEventListener("keydown", this.onKeyDown);
    }
  }

  onOutsideClick = (event) => {
    const trigger = this.closest("site-header")?.querySelector(".menu-toggle");
    if (!this.contains(event.target) && !trigger?.contains(event.target))
      this.setOpen(false);
  };

  onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      this.setOpen(false);
    }
  };
}

customElements.define("site-menu", SiteMenu);
