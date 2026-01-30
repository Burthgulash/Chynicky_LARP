const nav = getHeader()

const title = document.querySelector(".nadpis").innerHTML;
const smallText = document.querySelectorAll(".nadpis")[1].innerHTML



window.addEventListener("side-menu", handleListener() )
window.addEventListener("resize", handleListener() )

function handleListener() {
    adjustNav()
    console.log("Nav")
    window.dispatchEvent(new Event("responsivniNav"))    
}

function adjustNav() {
    const nav = getHeader()

    const sideMenu = document.getElementById("sideMenu").innerHTML
        
    const titleElement = document.querySelector(".nadpis");
    const smallTextElement = document.querySelectorAll(".nadpis")[1]

    if (checkOverlap(titleElement) || checkOverlap(smallTextElement)) {
        const menuBtn = document.querySelector(".menu-btn")
        const meceSrc = menuBtn.dataset.src
        nav.innerHTML = `
        <div class="divny-flex-menu-container">
            <div class="divny-flex-menu-nadpis-a-mece">
                <div class="divny-flex-menu-nadpis-container">
                    <h1 class="">${title}</h1>
                </div>
                <div class="divny-flex-menu-mece-container">
                    <img class="divny-flex-menu-mece-img menu menu-btn"
                        src="${meceSrc}" height="100"
                        alt="Klikni na Hamburger Menu pro zobrazení nabídky" onclick="toggleMenu()">
                </div>
            </div>
            <h4 class="divny-flex-menu-podnadpis">
                ${smallText}
            </h4>
        </div>
        <div class="side-menu" id="sideMenu">
            ${sideMenu}
        </div>
        `
        console.log("uspesne jse menu nav udelalo")
    }
    // window.removeEventListener("resize", handleListener() )
}
/*
function getSmallTextWidth() {
    const tempH4 = document.createElement("h4");
    tempH4.innerText = smallText;
    tempH4.style.display = "inline-block";
    document.body.appendChild(tempH4);
    document.body.removeChild(tempH4);
    const width = tempH4.offsetWidth;
    return width;
}

function getTitileWidth() {
    const tempH1 = document.createElement("h1");
    tempH1.innerText = title;
    tempH1.style.display = "inline-block";
    document.body.appendChild(tempH1);
    const width = tempH1.offsetWidth;
    document.body.removeChild(tempH1);
    return width;
}
*/
function checkOverlap(element) {
    console.log(element)
    const hamburger = document.querySelector(".menu");
    console.log("pokud je tady error na selectnodecontents tak je to v pohode")
    const range = document.createRange();
    range.selectNodeContents(element); // only the text inside
    const textRect = range.getBoundingClientRect();

    const burgerRect = hamburger.getBoundingClientRect();

    const horizontalOverlap =
        textRect.right > burgerRect.left &&
        textRect.left < burgerRect.right;

    return horizontalOverlap;
}

function getHeader() {
    let header = document.querySelector("header");
    if (!header) {
        header = document.querySelector("nav");
    }
    return header
}