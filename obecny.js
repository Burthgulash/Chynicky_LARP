// pro side menu
function toggleMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const menuBtn = document.querySelector(".menu-btn")
    if (sideMenu.classList.contains("side-menu-open")) {
        sideMenu.setAttribute("inert", "")
    } else {
        sideMenu.removeAttribute("inert", "")
    }

    sideMenu.classList.toggle("side-menu-open");
    //  menuButton.classList.toggle("menu-open");


    // Add or remove the outside click listener depending on menu state
    if (sideMenu.classList.contains("side-menu-open")) {
        document.addEventListener("click", menuOutsideClick);
    } else {
        document.removeEventListener("click", menuOutsideClick);
    }
}

// Move this function OUTSIDE toggleMenu!
function menuOutsideClick(event) {
    const sideMenu = document.getElementById("sideMenu");
    const menuBtn = document.querySelector(".menu-btn")
    if (!sideMenu.contains(event.target) && !menuBtn.contains(event.target)/*neodstranovat menu.contains(event.target) pak to z nejakyho duvodu nefunguje */) {
        // Clicked outside the menu and button, so close the menu
        sideMenu.classList.remove("side-menu-open");
        //menuButton.classList.remove("menu-open");
        document.removeEventListener("click", menuOutsideClick);
    }
}
/* */

// pro nav bar
function updatePadding() {
    let nav = document.querySelector("header");
    if (!nav) {
    nav = document.querySelector("nav");
    }
    const body = document.querySelector("body"); // Adjust selector for your page content
    body.style.paddingTop = `${nav.offsetHeight}px`;
}

// Run on page load & window resize
window.addEventListener("responsivniNav", updatePadding) // je to k tomu aby responsivni nav mohl se nacist a az pak padding podle nej
window.addEventListener("resize", updatePadding);

/* */


// pro easter egg

let activeTime = 0; // Track time spent actively on the page
let lastActiveTime = Date.now();
const delayTime = 20 * 60 * 1000; // 20 minutes

// Function to update active time
function updateActiveTime() {
    if (!document.hidden) {
        activeTime += Date.now() - lastActiveTime;
    }
    lastActiveTime = Date.now();
}

// Check every second if the user has reached the required time
const checkTime = setInterval(() => {
    updateActiveTime();
    if (activeTime >= delayTime) {
        clearInterval(checkTime); // Stop checking
        activateEasterEgg();
    }
}, 1000);

// Detect when user switches tabs or returns
document.addEventListener("visibilitychange", updateActiveTime);

// Easter Egg function
function activateEasterEgg() {
    alert("ORB ORB ORB ORB, ORB ORB ORB ORB ORB Gratuluji nasel jsi easterEgg!");
    // You can replace this with animations, sounds, or secret messages
}

/* */
// pro minimap
const minimapBtn = document.getElementById("toggle-minimap");
// just check if the btn exists on the page to prevent errors on pages without the btn
if (minimapBtn) {
    minimapBtn.addEventListener("click", toggleMinimap);
}

function toggleMinimap() {
    const miniMap = document.getElementById("mini-map");
    console.log(miniMap)
    miniMap.classList.toggle("show")
    miniMap.src = miniMap.src; // Reload the iframe to ensure proper rendering
    if (miniMap.classList.contains("show")) {
        minimapBtn.innerHTML = `Skrýt mapu
                        <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 -960 960 960" width="1.25em"
                            fill="white">
                            <path
                                d="M480-80q-106 0-173-33.5T240-200q0-24 14.5-44.5T295-280l63 59q-9 4-19.5 9T322-200q13 16 60 28t98 12q51 0 98.5-12t60.5-28q-7-8-18-13t-21-9l62-60q28 16 43 36.5t15 45.5q0 53-67 86.5T480-80Zm1-220q99-73 149-146.5T680-594q0-102-65-154t-135-52q-70 0-135 52t-65 154q0 67 49 139.5T481-300Zm-1 100Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z" />
                        </svg>`;
    } else {
        minimapBtn.innerHTML = `Zobrazit mapu
                        <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 -960 960 960" width="1.25em"
                            fill="white">
                            <path
                                d="M480-80q-106 0-173-33.5T240-200q0-24 14.5-44.5T295-280l63 59q-9 4-19.5 9T322-200q13 16 60 28t98 12q51 0 98.5-12t60.5-28q-7-8-18-13t-21-9l62-60q28 16 43 36.5t15 45.5q0 53-67 86.5T480-80Zm1-220q99-73 149-146.5T680-594q0-102-65-154t-135-52q-70 0-135 52t-65 154q0 67 49 139.5T481-300Zm-1 100Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z" />
                        </svg>`;
    }
}