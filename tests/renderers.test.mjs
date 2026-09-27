import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

let html = "";
let writes = 0;
globalThis.document = {
  querySelector(selector) {
    assert.equal(selector, ".kalendar-akci2");
    return { set innerHTML(value) { html = value; writes++; } };
  },
};

await import("../scripts/kalendar/generace-kalendare.js");
assert.equal(writes, 1);
assert.equal((html.match(/class="akce-container"/g) || []).length, 2);
assert.match(html, /popovertarget="misto-1"/);
assert.match(html, /popover id="misto-1"/);
assert.match(html, /Pernink, kostelní 11 - apartmánová chalupa/);
assert.doesNotMatch(html, /<a[^>]*>\s*<button/);

const archive = readFileSync(new URL("../Odehrane LARPy/Odehrane LARPy.html", import.meta.url), "utf8");
assert.equal((archive.match(/class="akce-tlacitko"/g) || []).length, 5);
assert.doesNotMatch(archive, /<a[^>]*>\s*<button/);
assert.match(archive, /href="Pres\.hrebeny\/Pres\.hrebeny\.html" class="akce-tlacitko">Přes hřebeny/);

writes = 0;
await import("../scripts/navody/generace-navody-hlavni.js");
assert.equal(writes, 1);
assert.equal((html.match(/class="akce-container"/g) || []).length, 2);
assert.match(html, /Přibližné náklady/);
assert.doesNotMatch(html, /<a[^>]*>\s*<button/);
