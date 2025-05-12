(function () {
    function TypUzivatele() {
        const uzivatel = navigator.userAgent;
        let device = "neznamy uzivatel";
        console.log(uzivatel)

        if (/iPhone/.test(uzivatel)) {
            const iosVersion = getIOSVersion();
            device = `Apple iPhone (iOS ${iosVersion})`;
        } else if (/Android/.test(uzivatel)) {
            let match = uzivatel.match(/\((.*?)\)/);
            device = match ? `Android Device (${match[1]})` : "Android Device";
        } else if (/Macintosh/.test(uzivatel) && !/iPhone/.test(uzivatel)) {
            device = "Apple Mac";
        } else if (/Windows/.test(uzivatel)) {
            device = "Windows PC";
        } else if (/CrOS/.test(uzivatel)) {
            device = "Chrome OS";
        } else if (/Linux/.test(uzivatel) && !/Android/.test(uzivatel)) {
            device = "Linux PC"; 
        }
        return device;
    }

    function getIOSVersion() {
        const uzivatel = navigator.userAgent;
        const match2 = uzivatel.match(/OS (\d+)_/);
        return match2 ? parseInt(match2[1]) : "Unknown"; // Fixed match2[1]
    }

    const device = TypUzivatele();

    if (device.includes("iPhone") || device.includes("Android")) {
        let currentPage = window.location.pathname;
        let correctPage = currentPage.replace(".html", "-mobil.html");

        if (currentPage !== correctPage) {
            console.log("Current page:", currentPage);
            console.log("Redirect to:", correctPage);
            window.location.href = correctPage;
        }
    }
    console.log("Detected Device:", device);
})();