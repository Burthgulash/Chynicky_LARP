// Run with Playwright available: node tests/site-features.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const prefix = "/Chynicky_LARP/";
const mime = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json",
  ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };
const placeholder = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#555"/></svg>';

async function htmlPages(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await htmlPages(filename));
    else if (entry.name.endsWith(".html") && (await fs.readFile(filename, "utf8")).includes("<site-features")) result.push(filename);
  }
  return result;
}

(async () => {
  const server = http.createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      if (pathname.startsWith(prefix)) pathname = pathname.slice(prefix.length);
      const filename = path.resolve(root, pathname.replace(/^\/+/, ""));
      if (!filename.startsWith(root + path.sep)) throw new Error("Outside root");
      const body = await fs.readFile(filename);
      response.writeHead(200, { "Content-Type": `${mime[path.extname(filename)] || "application/octet-stream"}; charset=utf-8` });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const launch = { headless: true };
  if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH;
  let browser;
  let checks = 0;
  const pass = message => { checks++; console.log(`PASS ${message}`); };
  try {
    browser = await chromium.launch(launch);
    const context = await browser.newContext();
    // Keep tests deterministic: external photos, fonts and maps are not under test.
    await context.route("**/*", route => {
      if (route.request().url().startsWith(origin)) return route.continue();
      return route.fulfill({ contentType: route.request().resourceType() === "image" ? "image/svg+xml" : "text/plain", body: route.request().resourceType() === "image" ? placeholder : "" });
    });
    const page = await context.newPage();
    const errors = [];
    const failedResources = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.url().startsWith(origin) && response.status() >= 400 && ["script", "stylesheet", "fetch"].includes(response.request().resourceType())) failedResources.push(response.url());
    });
    async function ready(target = page) {
      await target.waitForFunction(() => document.querySelector("site-features")?.dataset.state);
      const result = await target.evaluate(() => document.querySelector("site-features").ready);
      assert.deepEqual(result.errors, []);
    }
    const pages = await htmlPages(root);
    assert.ok(pages.length > 0);
    for (const filename of pages) {
      const relative = path.relative(root, filename).split(path.sep).join("/");
      await page.goto(origin + prefix + relative, { waitUntil: "domcontentloaded" });
      await ready();
      assert.equal(await page.locator('script[src]').count(), 1);
      assert.equal(await page.locator("#theme-sync").count(), 0);
      await page.locator(".menu-btn").click();
      assert.equal(await page.locator("#sideMenu").evaluate(node => node.classList.contains("side-menu-open") && !node.inert), true);
      const before = await page.locator("body").getAttribute("class");
      await page.locator("#button-theme-switch").click();
      assert.notEqual(await page.locator("body").getAttribute("class"), before);
      await page.locator(".menu-btn").click();
      assert.equal(await page.locator("#sideMenu").evaluate(node => node.inert), true);
      const feature = page.locator("site-features");
      if (await feature.getAttribute("galerie") !== null) {
        await page.locator("#filtr-akci").selectOption("OS1");
        await page.locator("#filtrovat-fotky").click();
      }
      if (await page.locator("#zvetsene").count()) {
        assert.equal(await page.locator("#zvetsene").count(), 1);
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#zvetsene").isVisible(), false);
        await page.locator(".per-foto-obrazek").first().click();
        assert.equal(await page.locator("#zvetsene").isVisible(), true);
        const source = await page.locator("#zvetsene-img").getAttribute("src");
        await page.keyboard.press("ArrowRight");
        assert.notEqual(await page.locator("#zvetsene-img").getAttribute("src"), source);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#zvetsene").isVisible(), false);
        assert.equal(await page.locator("body").evaluate(node => node.style.overflow), "");
      }
      if (await feature.getAttribute("kalendar") !== null || await feature.getAttribute("navody") !== null) {
        assert.ok(await page.locator(".akce-container").count() > 0);
        assert.equal(await page.locator("organizator-popover").count(), 4);
      }
      // Reconnecting and adding duplicate declarations must not double-bind anything.
      await page.evaluate(async () => {
        const feature = document.querySelector("site-features");
        feature.remove(); document.body.append(feature);
        const duplicate = feature.cloneNode();
        document.body.append(duplicate);
        await duplicate.ready;
        duplicate.remove();
      });
      assert.ok(await page.locator("#zvetsene").count() <= 1);
      const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(nodes => nodes.map(node => node.href));
      assert.equal(new Set(styles).size, styles.length);
      await page.locator(".menu-btn").click();
      assert.equal(await page.locator("#sideMenu").evaluate(node => node.classList.contains("side-menu-open")), true);
      pass(`page features, menu, theme and duplicate declarations: ${relative}`);
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(failedResources, []);

    // Persistence across pages and updates in another open tab.
    await page.goto(origin + "/larphlavni/index.html");
    await ready();
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload(); await ready();
    assert.equal(await page.locator("body").evaluate(node => node.classList.contains("light")), true);
    const other = await context.newPage();
    await other.goto(origin + prefix + "pribehy/pribehy.html"); await ready(other);
    await other.locator(".menu-btn").click();
    await other.locator("#button-theme-switch").click();
    await page.waitForFunction(() => document.body.classList.contains("dark"));
    await other.close();
    pass("root hosting, saved theme and cross-tab synchronization");

    // Map/organizer listeners must work even though modules load after DOMContentLoaded.
    const mapButton = page.locator(".misto-btn[popovertarget]").first();
    if (await mapButton.count()) {
      await mapButton.click();
      assert.equal(await page.locator(".popover:popover-open").count(), 1);
      await page.keyboard.press("Escape");
    }
    await page.locator('.organizatori-text[popovertarget="Hugo Redl"]').first().click();
    assert.equal(await page.locator("organizator-popover .popover:popover-open").count(), 1);
    pass("calendar map and organizer popovers");

    // A second filter replaces image nodes; delegated clicks must still open them.
    await page.goto(origin + prefix + "foto-galerie/foto-galerie.html"); await ready();
    for (const selection of ["OS1", "OS2"]) {
      await page.locator("#filtr-akci").selectOption(selection);
      await page.locator("#filtrovat-fotky").click();
      await page.locator(".per-foto-obrazek").first().click();
      assert.equal(await page.locator("#zvetsene").isVisible(), true);
      await page.keyboard.press("Escape");
    }
    pass("lightbox after repeated gallery filtering");

    const fixture = origin + prefix + "fixture.html";
    async function fixturePage(attributes, setup = async () => {}) {
      const target = await context.newPage();
      await setup(target);
      await target.route(fixture, route => route.fulfill({ contentType: "text/html", body: `<!doctype html><html><head><link rel="stylesheet" href="css/sdilene/menu/menu.css"><script type="module" src="scripts/site.js"></script></head><body><site-header title="Test"></site-header><site-features ${attributes}></site-features></body></html>` }));
      await target.goto(fixture, { waitUntil: "domcontentloaded" });
      return target;
    }
    let target = await fixturePage('fotky="false" tema="false"'); await ready(target);
    assert.equal(await target.locator("#zvetsene").count(), 0);
    assert.equal(await target.locator("#button-theme-switch").isVisible(), false);
    await target.close();
    target = await fixturePage('fotky="true"'); await ready(target);
    assert.equal(await target.locator("#zvetsene").count(), 1);
    await target.close();
    pass("explicit true/false attributes and disabled theme button");

    target = await fixturePage("", target => target.addInitScript(() => {
      Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } });
    }));
    await ready(target);
    await target.locator(".menu-btn").click();
    await target.locator("#button-theme-switch").click();
    assert.equal(await target.locator("body").evaluate(node => node.classList.contains("light")), true);
    await target.close();
    pass("theme switching without storage access");

    target = await fixturePage("fotky organizatori", target => target.route("**/components/templates/lightbox.html", route => route.fulfill({ status: 404, body: "Missing" })));
    await target.waitForFunction(() => document.querySelector("site-features")?.dataset.state);
    const failure = await target.evaluate(() => document.querySelector("site-features").ready);
    assert.equal(failure.errors[0].name, "fotky");
    assert.equal(await target.locator("organizator-popover .popover").count(), 4);
    await target.locator(".menu-btn").click();
    await target.locator("#button-theme-switch").click();
    await target.close();
    pass("missing template reports the feature without breaking menu/theme/organizers");

    target = await fixturePage("fotky", target => target.route("**/css/sdilene/obrazky.css", route => route.fulfill({ status: 404, body: "Missing" })));
    await target.waitForFunction(() => document.querySelector("site-features")?.dataset.state);
    const cssFailure = await target.evaluate(() => document.querySelector("site-features").ready);
    assert.equal(cssFailure.errors[0].name, "fotky");
    assert.equal(await target.locator("#zvetsene").count(), 0);
    await target.close();
    pass("missing feature stylesheet reports an error before mounting unstyled markup");

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 Mobile" });
    await mobile.route("**/*", route => route.request().url().startsWith(origin) ? route.continue() : route.fulfill({ contentType: "image/svg+xml", body: placeholder }));
    target = await mobile.newPage();
    await target.goto(origin + prefix + "Odehrane%20LARPy/Ozveny%20stinu/Ozvěny%20stínů.html"); await ready(target);
    await target.locator(".menu-btn").tap();
    await target.locator(".menu-sipka").first().tap();
    assert.equal(await target.locator(".menu-item-s-submenu").first().evaluate(node => node.classList.contains("submenu-open")), true);
    await target.locator(".menu-btn").tap();
    await target.locator(".per-foto-obrazek").first().tap();
    const initialImage = await target.locator("#zvetsene-img").getAttribute("src");
    await target.locator("#next").tap();
    assert.notEqual(await target.locator("#zvetsene-img").getAttribute("src"), initialImage);
    await target.locator("#closeBtn").tap();
    assert.equal(await target.locator("#zvetsene").isVisible(), false);
    await mobile.close();
    pass("mobile menu and photo controls");

    console.log(`All ${checks} browser checks passed.`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
