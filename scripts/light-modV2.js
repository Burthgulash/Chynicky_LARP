import { getImageFormat } from "./utilities/imgformat.js";

const iframe = document.getElementById("theme-sync");
const btn = document.getElementById("button-theme-switch");
const navBar = document.querySelector("nav")
const iconContainer = document.getElementById("icon-img-container")

applyTheme("dark")// Default theme
// 1. Ask iframe for theme on load
iframe.onload = () => {
    iframe.contentWindow.postMessage("get-theme", "https://burthgulash.github.io");
};

// 2. Receive the theme and apply it
window.addEventListener("message", (event) => {
    // console.log("Mesage", event)
    if (event.origin !== "https://burthgulash.github.io") return;
    if (event.data?.type === "theme") {
        applyTheme(event.data.value);
    }
});

// 3. User changes theme
btn.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    // Save to iframe
    iframe.contentWindow.postMessage({ type: "set-theme", value: newTheme }, "https://burthgulash.github.io");
    applyTheme(newTheme);
});

function applyTheme(theme) {
    document.body.classList.remove("dark", "light");
    const akceTlacitko = document.querySelectorAll(".akce-tlacitko");
    const akceContainer = document.querySelectorAll(".akce-container")

    // info card clases
    // const info = document.querySelectorAll(".info2")
    // const info21 = document.querySelectorAll(".info2-1")
    // const info22 = document.querySelectorAll(".info2-2")
    if (theme === "dark") {
        document.body.classList.toggle("dark");

        updateIcons();
    } else if (theme === "light") {
        document.body.classList.toggle("light");

        updateIcons();
    }
    updateThemeIcon()
}

function updateIcons() {
    const isLight = document.querySelector("body").classList.contains("light")
    const hamburgerSwords = document.querySelector(".menu-btn")
    // pocitat s responsivnim nav ktery ma jiny class
    if (hamburgerSwords) {
        if (isLight) {
            hamburgerSwords.src = "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/tri%20mece%20final%20final-light.png"
        } else {
            hamburgerSwords.src = "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/tri%20mece%20final%20final.png"
        }
    } else {
        const divnyFlexMenuhamburgerSwords = document.querySelector(".divny-flex-menu-mece-img")
            if (isLight) {
            divnyFlexMenuhamburgerSwords.src = "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/tri%20mece%20final%20final-light.png"
        } else {
            divnyFlexMenuhamburgerSwords.src = "https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/tri%20mece%20final%20final.png"
        }
    }
    document.querySelectorAll("#icon-img").forEach(image => {
        if (!image) return;
        const imgFormat = getImageFormat(image.src) // Get the image format is correct
        const name = image.dataset.name;
        if (isLight) {
            image.src = `https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Ikony-img/${name}-light.${imgFormat}`;
        }
        else {
            image.src = `https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Ikony-img/${name}.${imgFormat}`;
        }
    });
}

function updateThemeIcon() {
    const themebtn = document.getElementById("button-theme-switch")

    if (document.body.classList.contains("dark")) {
        themebtn.innerHTML = `
            <img src="https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Ikony-img/slunce-icon.png">
        `
    } else {
        themebtn.innerHTML = `
            <img style="margin-left: 8px;" src="https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Ikony-img/Mesic-icon.png">
        `
    }
}


