export function getImageFormat(src) {
    const match = src.match(/\.([a-zA-Z0-9]+)(?=\?|$)/);
    return match ? match[1].toLowerCase() : null;
}