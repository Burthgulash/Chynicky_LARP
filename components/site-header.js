class SiteHeader extends HTMLElement {
  static observedAttributes = ["title", "subtitle", "image"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute("title") || "LARP";
    const subtitle = this.getAttribute("subtitle") || "";
    const image = this.getAttribute("image") || "";

    this.innerHTML = `
<header>
    <div class="header-container">
        <div class="info-container">
            <div class="nadpis-container">
                <h1 class="nadpis">${this.escapeHtml(title)}</h1>
            </div>
            <h4 class="podnadpis-container nadpis">${subtitle}</h4>
        </div>
        <div class="menu-container">
            <img class="menu-btn menu" src="${this.escapeHtml(image)}" data-src="${this.escapeHtml(image)}"
                alt="Klikni na hamburger menu pro zobrazení nabídky" onclick="toggleMenu()">
        </div>
    </div>
    <div class="side-menu" id="sideMenu" inert></div>
</header>`;
  }

  escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
  }
}

customElements.define("site-header", SiteHeader);
