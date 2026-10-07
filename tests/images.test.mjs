import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fotoGalerieData } from "../scripts/galerie/foto-galerie-data.js";
import { data as calendarData } from "../scripts/kalendar/kalendar-data.js";
import { data as guideData } from "../scripts/navody/navody-hlavni-data.js";

assert.ok(fotoGalerieData.length, "Galerie musí obsahovat fotografie.");
for (const { src } of fotoGalerieData) {
  const image = new URL(src);
  assert.equal(image.protocol, "file:", `Galerie musí používat místní soubor: ${src}`);
  assert.ok(existsSync(image), `Chybějící fotografie galerie: ${src}`);
}

const root = new URL("../", import.meta.url);
for (const [data, page] of [
  [calendarData, "kalendar-akci/index.html"],
  [guideData, "navody/navody-hlavni.html"],
]) {
  for (const { obrazek } of data) {
    const image = new URL(obrazek, new URL(page, root));
    if (image.protocol === "file:" && /\.webp$/i.test(image.pathname)) {
      assert.ok(existsSync(image), `Chybějící WebP v datech pro ${page}: ${obrazek}`);
    }
  }
}

let OrganizerPopover;
globalThis.HTMLElement = class {};
globalThis.customElements = {
  get() {},
  define(name, component) {
    assert.equal(name, "organizator-popover");
    OrganizerPopover = component;
  },
};
await import("../components/organizator-popovers.js");
for (const name of ["Hugo Redl", "Kvido Redl", "Kristián Páca", "Julie Redlová"]) {
  const popover = new OrganizerPopover();
  popover.getAttribute = attribute => attribute === "name" ? name : null;
  popover.connectedCallback();
  const src = popover.innerHTML.match(/<img[^>]*src="([^"]+)"/)?.[1];
  assert.ok(src, `Chybějící fotografie profilu: ${name}`);
  const image = new URL(src);
  assert.equal(image.protocol, "file:", src);
  assert.ok(existsSync(image), `Chybějící fotografie profilu ${name}: ${src}`);
}

for (const file of readdirSync(root, { recursive: true })) {
  if (/^LALOK[\\/]/.test(file) || !/\.(html|css)$/.test(file)) continue;
  const source = new URL(file.replaceAll("\\", "/"), root);
  const content = readFileSync(source, "utf8");
  const references = file.endsWith(".html")
    ? [...content.matchAll(/\b(?:src|image)\s*=\s*["']([^"']+)["']/g)].map(match => match[1])
    : [...content.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/g)]
      .map(match => match[1] || match[2] || match[3]);

  for (const reference of references) {
    const image = new URL(reference, source);
    if (image.protocol === "file:" && /\.webp$/i.test(image.pathname)) {
      assert.ok(existsSync(image), `Chybějící WebP v ${file}: ${reference}`);
    }
  }
}
