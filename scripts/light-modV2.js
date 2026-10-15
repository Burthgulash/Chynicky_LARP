import "./generace-menu.js";
import { getImageFormat } from "./utilities/imgformat.js";

const btn = document.getElementById("button-theme-switch");
const imageRoot = new URL("../assets/", import.meta.url);

let theme = "dark";
try {
  theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
} catch {
  // Při blokovaném úložišti použijeme výchozí tmavý motiv.
}
applyTheme(theme);
// Renderery karet mohou vložit další ikony až po spuštění tohoto modulu.
document.addEventListener("DOMContentLoaded", updateIcons, { once: true });

btn.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
  try {
    localStorage.setItem("theme", newTheme);
  } catch {
    // Při blokovaném úložišti přepnutí platí jen pro aktuální stránku.
  }
});

function applyTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  updateIcons();
  updateThemeIcon();
}

function updateIcons() {
  const isLight = document.querySelector("body").classList.contains("light");
  const hamburgerSwords = document.querySelector(".menu-btn");
  if (hamburgerSwords) {
    if (isLight) {
      hamburgerSwords.src =
        new URL("Nav.panel/tri mece final final-light.png", imageRoot).href;
    } else {
      hamburgerSwords.src =
        new URL("Nav.panel/tri mece final final.png", imageRoot).href;
    }
  }
  document.querySelectorAll("img[data-name]").forEach((image) => {
    const imgFormat = getImageFormat(image.src); // Get the image format is correct
    const name = image.dataset.name;
    if (isLight) {
      image.src = new URL(`Ikony-img/${name}-light.${imgFormat}`, imageRoot).href;
    } else {
      image.src = new URL(`Ikony-img/${name}.${imgFormat}`, imageRoot).href;
    }
  });
}

function updateThemeIcon() {
  const themebtn = document.getElementById("button-theme-switch");
  const isDark = document.body.classList.contains("dark");
  const image = themebtn.querySelector("img");
  image.src = new URL(
    `Ikony-img/${isDark ? "slunce-icon" : "Mesic-icon"}.webp`,
    imageRoot,
  ).href;
  image.style.marginLeft = isDark ? "0" : "8px";
  themebtn.setAttribute("aria-label", `Přepnout na ${isDark ? "světlý" : "tmavý"} motiv`);
}
