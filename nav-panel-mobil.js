document.addEventListener("DOMContentLoaded", () => {
    const submenuToggle = document.querySelector(".ma-submenu");
    const menuItem = document.querySelector(".menu-item-s-submenu");

    submenuToggle.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent jumping if href="#"
        menuItem.classList.toggle("open");
    });
});