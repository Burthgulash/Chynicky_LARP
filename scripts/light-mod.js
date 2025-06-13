const iframe = document.getElementById("theme-sync");
const btn = document.getElementById("button-theme-switch");
const navBar = document.querySelector("nav")
const iconContainer = document.getElementById("icon-img-container")

// 1. Ask iframe for theme on load
iframe.onload = () => {
    iframe.contentWindow.postMessage("get-theme", "https://burthgulash.github.io");
};

// 2. Receive the theme and apply it
window.addEventListener("message", (event) => {
    if (event.origin !== "https://burthgulash.github.io") return;
    if (event.data?.type === "theme") {
        applyTheme(event.data.value);
    }
});

// 3. User changes theme
btn.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(newTheme);
    // Save to iframe
    iframe.contentWindow.postMessage({ type: "set-theme", value: newTheme }, "https://burthgulash.github.io");
});

function applyTheme(theme) {
    document.body.classList.remove("dark", "light");
    const akceTlacitko = document.querySelectorAll(".akce-tlacitko");
    if (theme === "dark") {
        document.body.classList.toggle("dark");
        // for each button change the class + change random linear gradient
        akceTlacitko.style.setProperty("background", "linear-gradient(var(--background-color-dark)) padding-box,linear-gradient(-45deg, rgb(66, 66, 66), rgb(110, 110, 110)) border-box;")
        akceTlacitko.forEach((button) => {
            button.classList.remove("akce-tlacitko-light");
            button.classList.add("akce-tlacitko-dark");
        });
        // Change the background image of the navBar
        navBar.style.setProperty("background-image", "url(https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/temný%20les%203.jpg;")
        updateIcons();
    } else if (theme === "light") {
        // for each button change the class + change random linear gradient
        akceTlacitko.style.setProperty("background", "linear-gradient(var(--background-color-light)) padding-box,linear-gradient(-45deg, rgb(66, 66, 66), rgb(110, 110, 110)) border-box;")
        akceTlacitko.forEach(button => {
            button.classList.remove("akce-tlacitko-dark");
            button.classList.add("akce-tlacitko-light");
        })
        document.body.classList.toggle("light");
        // Change the background image of the navBar
        navBar.style.setProperty("background-image", "url(https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/IMG_6357.jpg;")
        updateIcons();
    }
}

function updateIcons() {
    const isLight = document.querySelector("body").classList.contains("light")

    document.querySelectorAll().forEach(image => {
        const name = image.dataset.name;
        if (isLight) {
            image.src = `https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Ikony-img/${name}-light.png`;
        }
        else {
            image.src = `https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Ikony-img/${name}.png`;
        }
    });
}