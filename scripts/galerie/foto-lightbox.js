const lightbox = document.getElementById("zvetsene");
const lightboxImg = document.getElementById("zvetsene-img");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
let images = [];
let currentIndex = 0;
let returnFocus;
let previousOverflow = "";

function showImage(index, direction = null) {
    if (images.length === 0) return;
    const wasHidden = lightbox.classList.contains("hidden");
    lightboxImg.classList.remove("slide-left", "slide-right");
    lightboxImg.src = images[index].parentElement.href;
    lightboxImg.alt = images[index].alt;
    if (direction === "left") lightboxImg.classList.add("slide-left");
    if (direction === "right") lightboxImg.classList.add("slide-right");
    currentIndex = index;
    lightbox.classList.remove("hidden");
    if (wasHidden) {
        previousOverflow = document.body.style.overflow;
        closeBtn.focus();
    }
    document.body.style.overflow = "hidden";
    preloadImages(index);
}

// Delegace funguje i po vytvoření náhledů a po změně filtru.
document.addEventListener("click", event => {
    const link = event.target.closest(".foto-link");
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    images = Array.from(link.closest("[data-gallery]").querySelectorAll(".per-foto-obrazek"));
    const index = images.indexOf(link.querySelector(".per-foto-obrazek"));
    if (index < 0) return;
    event.preventDefault();
    returnFocus = link;
    showImage(index);
});

function moveImage(step) {
    if (images.length === 0) return;
    showImage((currentIndex + step + images.length) % images.length, step > 0 ? "left" : "right");
}

closeBtn.addEventListener("click", hideLightbox);
prevBtn.addEventListener("click", () => moveImage(-1));
nextBtn.addEventListener("click", () => moveImage(1));
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) hideLightbox();
});

let touchStartX = 0;
lightbox.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener("touchend", event => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 50) moveImage(distance < 0 ? 1 : -1);
}, { passive: true });

window.addEventListener("keydown", event => {
    if (lightbox.classList.contains("hidden")) return;
    if (event.key === "Escape") hideLightbox();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        moveImage(event.key === "ArrowLeft" ? -1 : 1);
    }
    if (event.key === "Tab") {
        const controls = [closeBtn, prevBtn, nextBtn];
        const index = controls.indexOf(document.activeElement);
        event.preventDefault();
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
});

function preloadImages(index) {
    for (let i = Math.max(0, index - 3); i <= Math.min(images.length - 1, index + 3); i++) {
        const img = new Image();
        img.src = images[i].parentElement.href;
    }
}

export function hideLightbox() {
    if (lightbox.classList.contains("hidden")) return;
    lightbox.classList.add("hidden");
    document.body.style.overflow = previousOverflow;
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
}
