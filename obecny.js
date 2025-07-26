// pro side menu
function toggleMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const menuButton = document.querySelector(".menu");

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
    const menuButton = document.querySelector(".menu");
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        // Clicked outside the menu and button, so close the menu
        sideMenu.classList.remove("side-menu-open");
        menuButton.classList.remove("menu-open");
        document.removeEventListener("click", menuOutsideClick);
    }
}

/* */

// pro nav bar
function updatePadding() {
    const nav = document.querySelector("nav");
    const body = document.querySelector("body"); // Adjust selector for your page content
    body.style.paddingTop = `${nav.offsetHeight}px`;
}

// Run on page load & window resize
window.addEventListener("load", updatePadding);
window.addEventListener("resize", updatePadding);

/* */


// pro easter egg

let activeTime = 0; // Track time spent actively on the page
let lastActiveTime = Date.now();
const delayTime = 15 * 60 * 1000; // 10 minutes

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
    alert("ORB ORB ORB ORB, ORB ORB ORB ORB ORB Gratuluji nasel jso easterEgg!");
    // You can replace this with animations, sounds, or secret messages
}

/* */