// Globální funkce pro onclick v hlavičce; stav nabídky spravuje komponenta.
function toggleMenu() {
    document.getElementById("sideMenu")?.toggle?.();
}

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
    const isVisible = miniMap.classList.toggle("show");
    miniMap.src = miniMap.src; // Po zobrazení obnovíme vykreslení vložené mapy.
    minimapBtn.querySelector("span").textContent = isVisible ? "Skrýt mapu" : "Zobrazit mapu";
    minimapBtn.setAttribute("aria-expanded", String(isVisible));
}
