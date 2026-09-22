import { getImageFormat } from "./utilities/imgformat.js";

const assetRoot = new URL("../kvido%20html-img/foto/", import.meta.url);

export function init() {
  const button = document.getElementById("button-theme-switch");
  let theme = "dark";
  try {
    theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
  applyTheme(theme);
  button?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // Keep the current page usable in private/restricted browser contexts.
    }
    applyTheme(nextTheme);
  });
  window.addEventListener("storage", event => {
    if (event.key === "theme" || event.key === null) {
      applyTheme(event.newValue === "light" ? "light" : "dark");
    }
  });
  // Calendar and other optional features can create icons after theme startup.
  document.addEventListener("site-feature-ready", updateIcons);
}

function applyTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  updateIcons();
}

function updateIcons() {
  const isLight = document.body.classList.contains("light");
  const suffix = isLight ? "-light" : "";
  const menuImage = document.querySelector(".menu-btn");
  if (menuImage) {
    menuImage.src = new URL(`Nav.panel/tri mece final final${suffix}.png`, assetRoot).href;
  }
  document.querySelectorAll('img[data-name]').forEach(image => {
    const format = getImageFormat(image.src);
    image.src = new URL(`Ikony-img/${image.dataset.name}${suffix}.${format}`, assetRoot).href;
  });
  const button = document.getElementById("button-theme-switch");
  if (button) {
    button.hidden = false;
    button.setAttribute("aria-label", isLight ? "Zapnout tmavý režim" : "Zapnout světlý režim");
    const image = document.createElement("img");
    image.src = new URL(`Ikony-img/${isLight ? "Mesic-icon" : "slunce-icon"}.png`, assetRoot).href;
    image.alt = "";
    if (isLight) image.style.marginLeft = "8px";
    button.replaceChildren(image);
  }
}
