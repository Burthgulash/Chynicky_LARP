import { fotoGalerieData } from "./script-foto-galerie/foto-galerie-data.js";

export function init() {
  const lightbox = document.getElementById("zvetsene");
  const image = document.getElementById("zvetsene-img");
  const close = document.getElementById("closeBtn");
  const previous = document.getElementById("prev");
  const next = document.getElementById("next");
  let images = [];
  let currentIndex = 0;
  let opener;
  let oldOverflow;
  let touchStartX = 0;

  function fullSize(thumbnail) {
    if (thumbnail.dataset.full) return thumbnail.dataset.full;
    const filename = thumbnail.src.split("/").pop().replace(/\.[^.]+$/, "");
    const match = fotoGalerieData.find(photo =>
      photo.src.split("/").pop().replace(/\.[^.]+$/, "") === filename);
    return match?.src || thumbnail.src;
  }

  function show(index, direction) {
    if (!images.length) return;
    currentIndex = (index + images.length) % images.length;
    image.classList.remove("slide-left", "slide-right");
    image.src = fullSize(images[currentIndex]);
    image.alt = images[currentIndex].alt || "Zvětšená fotografie";
    if (direction) image.classList.add(`slide-${direction}`);
    for (const offset of [-1, 1]) {
      const preload = new Image();
      preload.src = fullSize(images[(currentIndex + offset + images.length) % images.length]);
    }
  }

  function hide() {
    if (lightbox.classList.contains("hidden")) return;
    lightbox.classList.add("hidden");
    document.body.style.overflow = oldOverflow;
    opener?.focus();
  }

  // Delegation also covers images created by the gallery filter after startup.
  document.addEventListener("click", event => {
    const thumbnail = event.target.closest(".per-foto-obrazek");
    if (!thumbnail) return;
    images = [...document.querySelectorAll(".per-foto-obrazek")];
    opener = document.activeElement;
    oldOverflow = document.body.style.overflow;
    show(images.indexOf(thumbnail));
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    close.focus();
  });
  close.addEventListener("click", hide);
  previous.addEventListener("click", () => show(currentIndex - 1, "right"));
  next.addEventListener("click", () => show(currentIndex + 1, "left"));
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) hide();
  });
  window.addEventListener("keydown", event => {
    if (lightbox.classList.contains("hidden")) return;
    if (["Escape", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key)) event.preventDefault();
    if (event.key === "Escape") hide();
    if (event.key === "ArrowLeft") show(currentIndex - 1, "right");
    if (event.key === "ArrowRight") show(currentIndex + 1, "left");
    if (event.key === "Tab") {
      const controls = [close, previous, next];
      const index = controls.indexOf(document.activeElement);
      controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
  });
  lightbox.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener("touchend", event => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 50) {
      show(currentIndex + (distance < 0 ? 1 : -1), distance < 0 ? "left" : "right");
    }
  }, { passive: true });
}
