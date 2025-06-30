// 1. Get all the small gallery images
const images = document.querySelectorAll(".per-foto-obrazek");

// 2. Get the lightbox elements
const lightbox = document.getElementById("zvetsene");
const lightboxImg = document.getElementById("zvetsene-img");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// 3. Track which image is currently being shown
let currentIndex = 1;

// 4. This function shows the image in the lightbox
function showImage(index, direction = null) {
    if (!images || images.length === 0) return; // Prevent errors if images are not loaded
    let lightboxImgSrc = ""
    // Remove any old animation class
    lightboxImg.classList.remove("slide-left", "slide-right");

    // replace the webp img with a jpg or jpeg version based on the funtion + make sure its not null
    if (getImageFormat(images[index].src)) {
        lightboxImgSrc = images[index].src.replace("webp", getImageFormat(images[index].src))
    } else {
        console.error("Image format not found or something went wrong");
    }

    // Set the image source
    lightboxImgSrc = lightboxImg.src

    // If a direction was provided, add animation class
    if (direction === "left") {
        lightboxImg.classList.add("slide-left");
    } else if (direction === "right") {
        lightboxImg.classList.add("slide-right");
    }

    // Update the current index
    currentIndex = index;

    // Show the lightbox
    lightbox.classList.remove("hidden");
}

// 5. When someone clicks a thumbnail, show that image in the lightbox
images.forEach((img, index) => {
    img.addEventListener("click", () => {
        showImage(index); // open the lightbox with the correct image
    });
});

// 6. Close the lightbox when the ❌ button is clicked
closeBtn.addEventListener("click", () => {
    lightbox.classList.add("hidden"); // add "hidden" class to hide it
});

// 7. Also close the lightbox if user clicks the background (but NOT the image)
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        lightbox.classList.add("hidden");
    }
});

// 8. Show the previous image when ← arrow is clicked
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex, "right");
});

// 9. Show the next image when → arrow is clicked
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex, "left");
});

// These will store the X position where the user touched
let touchStartX = 0;
let touchEndX = 0;

// Listen for when the user first touches the screen
lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX; // Where finger touched
});

// Listen for when the user lifts their finger
lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX; // Where finger left

    // Check how far the user swiped (positive = right, negative = left)
    let distance = touchEndX - touchStartX;

    // Only respond to significant swipes (e.g., more than 50 pixels)
    if (Math.abs(distance) > 50) {
        if (distance < 0) {
            // Swiped left → next image
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex, "left");
        } else {
            // Swiped right → previous image
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex, "right");
        }
    }
});

// Add a listener for the "Escape" key to close the lightbox
window.addEventListener("keydown", (event) => {
    escapeLightbox(event)
})

function escapeLightbox(event) {
    if (event.key === "Escape") {
        lightbox.classList.add("hidden");
    }
}
// Add a listener for the Arrows key to switch the lightbox
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex, "right");
    } else if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex, "left");
    }
});

export function getImageFormat(src) {
    const match = src.match(/\.([a-zA-Z0-9]+)(?=\?|$)/);
    return match ? match[1].toLowerCase() : null;
}