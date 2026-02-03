// tady ten script je jen kvuli tomu ze jsme lini vydz urpavit side menu na vsech strankach tak to upravime jen jednou
document.querySelector("#sideMenu").innerHTML = `
<div class="menu-item-s-submenu">
    <div class="menu-link">
        <a href="https://burthgulash.github.io/Chynicky_LARP/larphlavni/index.html" class="ma-submenu"
            onclick="toggleMenu()">Kalendář akcí</a>
            <svg class="menu-sipka" id="menu-sipka" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"><!--Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path
                    d="M480 224C492.9 224 504.6 231.8 509.6 243.8C514.6 255.8 511.8 269.5 502.7 278.7L342.7 438.7C330.2 451.2 309.9 451.2 297.4 438.7L137.4 278.7C128.2 269.5 125.5 255.8 130.5 243.8C135.5 231.8 147.1 224 160 224L480 224z" />
            </svg>
    </div>
    <div class="submenu">
        <a href="https://burthgulash.github.io/Chynicky_LARP/Z.Popelu.kalicha/Z.Popelu.kalicha.html" onclick="toggleMenu()">Z Popelu Kalicha</a>
    </div>
</div>
<a href="https://burthgulash.github.io/Chynicky_LARP/O%20nas/O%20nás.html" onclick="toggleMenu()">O nás</a>
<a href="https://burthgulash.github.io/Chynicky_LARP/pribehy/pribehy.html" onclick="toggleMenu()">Příběhy</a>

<div class="menu-item-s-submenu">
    <div class="menu-link">
        <a href="https://burthgulash.github.io/Chynicky_LARP/Odehrane%20LARPy/Odehrane%20LARPy.html">Odehrané LARPy</a>
        <svg class="menu-sipka" id="menu-sipka" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"><!--Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path
                d="M480 224C492.9 224 504.6 231.8 509.6 243.8C514.6 255.8 511.8 269.5 502.7 278.7L342.7 438.7C330.2 451.2 309.9 451.2 297.4 438.7L137.4 278.7C128.2 269.5 125.5 255.8 130.5 243.8C135.5 231.8 147.1 224 160 224L480 224z" />
        </svg>
    </div>   
    <div class="submenu">
        <a href="https://burthgulash.github.io/Chynicky_LARP/Odehrane%20LARPy/Navrat-mocneho/Navrat-mocneho.html" onclick="toggleMenu()">Návrat mocného</a>
        <a href="https://burthgulash.github.io/Chynicky_LARP/Odehrane%20LARPy/Ozveny%20stinu2/Ozvěny%20stínů%202.html" onclick="toggleMenu()">Ozvěny Stínů 2</a>
        <a href="https://burthgulash.github.io/Chynicky_LARP/Odehrane%20LARPy/Ozveny%20stinu/Ozvěny%20stínů.html" onclick="toggleMenu()">Ozvěny stínů</a>
        <a href="https://burthgulash.github.io/Chynicky_LARP/Odehrane%20LARPy/Hranicni%20tvrz/Hranicni%20tvrz.html" onclick="toggleMenu()">Hraniční tvrz</a>
    </div>
</div>
<button class="darkXlight" id="button-theme-switch"></button>
`
window.dispatchEvent(new Event("side-menu"))

function runArrowCode() {
    const arrows = document.querySelectorAll(".menu-sipka")
    console.log(arrows)
    arrows.forEach(arrow => {
        const menuItem = arrow.closest(".menu-item-s-submenu")
        const submenu = menuItem.querySelector(".submenu")
        console.log(menuItem, submenu)
        if (navigator.userAgent.includes("Mobile")) {
            console.log("mobile")
            console.log(arrow)
            arrow.addEventListener("click", (e) => {
                const menuItem = e.target.closest(".menu-item-s-submenu")
                console.log(menuItem)
                if (menuItem.classList.contains("submenu-clicked")) {
                    menuItem.classList.remove("submenu-open")
                    menuItem.classList.remove("submenu-clicked")
                    return;
                }
                menuItem.classList.add("submenu-open")
                menuItem.classList.add("submenu-clicked")
            })
            console.log("listen")
            return
        }
        arrow.addEventListener("mouseover", (e) => {
            const menuItem = e.target.closest(".menu-item-s-submenu")
            menuItem.classList.add("submenu-open")
        })
        submenu.addEventListener("mouseleave", (e) => {
            const menuItem = e.target.closest(".menu-item-s-submenu")
            menuItem.classList.remove("submenu-open")
        })
        arrow.addEventListener("mouseleave", (e) => {
            setTimeout(() => {
                if (submenu.matches(":hover")) return;
                menuItem.classList.remove("submenu-open")
            }, 200)
        })
    });
}

window.addEventListener("responsivniNav", runArrowCode) // je to k tomu aby responsivni nav mohl se nacist a az pak se nacetly DOM elementy do JS
const arrowSvg = `
<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
    <path
        d="M480 224C492.9 224 504.6 231.8 509.6 243.8C514.6 255.8 511.8 269.5 502.7 278.7L342.7 438.7C330.2 451.2 309.9 451.2 297.4 438.7L137.4 278.7C128.2 269.5 125.5 255.8 130.5 243.8C135.5 231.8 147.1 224 160 224L480 224z" />
</svg>
`