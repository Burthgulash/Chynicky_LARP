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
assert.match(html, /popovertarget="misto-0"/);
assert.match(html, /popover id="misto-0"/);
assert.match(html, /popovertarget="misto-1"/);
assert.match(html, /popover id="misto-1"/);
assert.match(html, /Pernink, kostelní 11 - apartmánová chalupa/);
assert.equal((html.match(/<iframe class="mini-map"/g) || []).length, 2);
assert.match(html, /src="https:\/\/mapy\.com\/s\/pejegocono"/);
assert.match(html, /src="https:\/\/mapy\.com\/s\/hufumuzega"/);
assert.doesNotMatch(html, /openstreetmap/i);
assert.doesNotMatch(html, /<a[^>]*>\s*<button/);

for (const [file, mapLink] of [
  ["Navrat-mocneho/Navrat-mocneho.html", "hufumuzega"],
  ["Pres.hrebeny/Pres.hrebeny.html", "pejegocono"],
  ["Z.Popelu.kalicha/Z.Popelu.kalicha.html", "fotehegoro"],
]) {
  const detail = readFileSync(new URL(`../Odehrane LARPy/${file}`, import.meta.url), "utf8");
  assert.match(detail, /<button id="toggle-minimap">Zobrazit mapu/);
  const map = detail.match(/<iframe class="mini-map" id="mini-map"[^>]*>/)?.[0];
  assert.ok(map, file);
  assert.ok(map.includes(`src="https://mapy.com/s/${mapLink}"`), file);
  assert.match(map, /title="Mapa [^"]+"/);
  assert.doesNotMatch(detail, /openstreetmap/i);
}

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
