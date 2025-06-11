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
        // for each button change the class
        akceTlacitko.forEach((button) => {
            button.classList.remove("akce-tlacitko-light");
            button.classList.add("akce-tlacitko-dark");
        });

        navBar.style.setProperty("background-image","url(https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/temný%20les%203.jpg;")
    } else if (theme === "light") {
        // for each button change the class
        akceTlacitko.forEach(button => {
            button.classList.remove("akce-tlacitko-dark");
            button.classList.add("akce-tlacitko-light");
        })
        document.body.classList.toggle("light");
        navBar.style.setProperty("background-image","url(https://burthgulash.github.io/Chynicky_LARP/kvido%20html-img/foto/Nav.panel/IMG_6357.jpg;")
    }
}