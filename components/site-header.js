class SiteHeader extends HTMLElement {
  static observedAttributes = ["title", "subtitle", "image"];

  connectedCallback() {
    this.render();
    this.resizeObserver = new ResizeObserver(() => this.updatePageOffset());
    this.resizeObserver.observe(this.querySelector("header"));
    this.updatePageOffset();
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    document.body.style.removeProperty("--site-header-height");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && this.querySelector("header") && oldValue !== newValue) {
      this.updateContent(name);
    }
  }

  render() {
    // Keep the drawer and its listeners intact when the header reconnects.
    if (!this.querySelector("header")) {
      this.innerHTML = `
<header>
    <div class="header-container">
        <div class="info-container">
            <h1 class="nadpis"></h1>
            <h4 class="podnadpis-container nadpis"></h4>
        </div>
        <div class="menu-container">
            <img class="menu-btn menu"
                alt="Klikni na hamburger menu pro zobrazení nabídky">
        </div>
    </div>
    <div class="side-menu" id="sideMenu" inert></div>
</header>`;
    }
    this.updateContent();
  }

  updateContent(name) {
    if (!name || name === "title") {
      this.querySelector("h1").textContent = this.getAttribute("title") || "LARP";
    }
    if (!name || name === "subtitle") {
      const subtitle = this.getAttribute("subtitle") || "";
      const element = this.querySelector(".podnadpis-container");
      // Page-authored subtitles can contain links to related events.
      element.innerHTML = subtitle;
      element.hidden = !subtitle;
    }
    if (!name || name === "image") {
      this.querySelector(".menu-btn").src = this.getAttribute("image") ||
        new URL("../kvido%20html-img/foto/Nav.panel/tri%20mece%20final%20final.png", import.meta.url).href;
    }
  }

  updatePageOffset() {
    // CSS handles horizontal layout; only the fixed header's height needs JS.
    document.body.style.setProperty(
      "--site-header-height",
      `${this.querySelector("header").getBoundingClientRect().height}px`,
    );
  }
}

customElements.define("site-header", SiteHeader);
