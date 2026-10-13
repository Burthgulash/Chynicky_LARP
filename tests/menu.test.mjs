import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("scripts/generace-menu.js", root), "utf8");
let SiteMenu;
globalThis.HTMLElement = class {};
globalThis.customElements = {
  define(name, constructor) {
    assert.equal(name, "site-menu");
    SiteMenu = constructor;
  },
};
await import("../scripts/generace-menu.js");

test("Všech 12 stránek načítá menu před motivem a jen jeden iframe", () => {
  let pages = 0;
  for (const file of readdirSync(root, { recursive: true }).filter((file) => file.endsWith(".html"))) {
    const html = readFileSync(join(fileURLToPath(root), file), "utf8");
    const scripts = [...html.matchAll(/<script\b([^>]*)>\s*<\/script>/gi)].map((match) => match[1]);
    const menu = scripts.filter((script) => /src=["'][^"']*scripts\/generace-menu\.js["']/i.test(script));
    if (!html.includes("<site-header")) {
      assert.equal(menu.length, 0, file);
      continue;
    }
    pages++;
    assert.equal(menu.length, 1, file);
    assert.match(menu[0], /type=["']module["']/i, file);
    const theme = scripts.filter((script) => /src=["'][^"']*scripts\/light-modV2\.js["']/i.test(script));
    assert.equal(theme.length, 1, file);
    assert.match(theme[0], /type=["']module["']/i, file);
    assert.ok(scripts.indexOf(menu[0]) < scripts.indexOf(theme[0]), file);
    assert.equal((html.match(/<iframe\b[^>]*\bid=["']theme-sync["']/gi) || []).length, 1, file);
    for (const script of [menu[0], theme[0]]) {
      const src = script.match(/src=["']([^"']+)["']/i)[1];
      assert.ok(existsSync(new URL(src, new URL(file.replaceAll("\\", "/"), root))), `${file}: ${src}`);
    }
  }
  assert.equal(pages, 12);
});

test("Menu vytváří existující odkazy od kořene modulu bez innerHTML", () => {
  assert.doesNotMatch(source, /\binnerHTML\b/);
  const paths = [];
  const menu = new SiteMenu();
  menu.append = () => {};
  menu.createLink = (_label, path) => paths.push(path);
  menu.createGroup = (_label, path, _id, links) => paths.push(path, ...links.map((link) => link[1]));
  globalThis.document = {
    createElement() { return { setAttribute() {}, append() {}, addEventListener() {} }; },
  };
  menu.render();
  assert.equal(paths.length, 9);
  for (const path of paths) {
    const link = SiteMenu.prototype.createLink.call(menu, "Odkaz", path);
    assert.equal(link.href, new URL(path, root).href);
    assert.ok(existsSync(new URL(link.href)), path);
  }
});

test("Spouštěč je do načtení komponenty vypnutý a brzké volání nevyhodí chybu", () => {
  const header = readFileSync(new URL("components/site-header.js", root), "utf8");
  const button = header.match(/<button\b[^>]*class="menu-toggle"[^>]*>/)?.[0];
  assert.ok(button);
  assert.match(button, /\bdisabled\b/);
  const common = readFileSync(new URL("scripts/obecny.js", root), "utf8");
  const toggle = common.match(/function toggleMenu\(\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(toggle);
  let calls = 0;
  for (const target of [null, {}, { toggle() { calls++; } }]) {
    runInNewContext(`${toggle}\ntoggleMenu();`, { document: { getElementById() { return target; } } });
  }
  assert.equal(calls, 1);
});

function menuFixture() {
  const listeners = new Map();
  globalThis.document = {
    activeElement: null,
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener); },
  };
  const attributes = new Map();
  const classes = new Set();
  const triggerIcon = {};
  const child = {};
  const trigger = {
    disabled: true,
    setAttribute(name, value) { attributes.set(name, value); },
    contains(target) { return target === this || target === triggerIcon; },
    focus() { document.activeElement = this; },
  };
  const menu = new SiteMenu();
  Object.assign(menu, {
    childElementCount: 0,
    classList: {
      contains(name) { return classes.has(name); },
      toggle(name, force = !classes.has(name)) {
        if (force) classes.add(name); else classes.delete(name);
        return force;
      },
    },
    setAttribute() {},
    closest() { return { querySelector() { return trigger; } }; },
    contains(target) { return target === menu || target === child; },
    render() { this.childElementCount = 1; this.renderedChild = child; },
  });
  const check = (open) => {
    assert.equal(menu.classList.contains("side-menu-open"), open);
    assert.equal(menu.inert, !open);
    assert.equal(attributes.get("aria-expanded"), String(open));
    for (const type of ["click", "keydown"]) assert.equal(listeners.get(type)?.size || 0, Number(open));
  };
  const dispatch = (type, event) => {
    for (const listener of listeners.get(type) || []) listener(event);
  };
  return { menu, trigger, triggerIcon, child, check, dispatch };
}

test("Otevření, kliknutí mimo a Escape sjednocují inert, fokus a listenery", () => {
  const { menu, trigger, triggerIcon, child, check, dispatch } = menuFixture();
  assert.equal(trigger.disabled, true);
  menu.connectedCallback();
  assert.equal(trigger.disabled, false);
  check(false);
  menu.toggle();
  check(true);
  menu.setOpen(true);
  check(true);
  dispatch("click", { target: child });
  check(true);
  dispatch("click", { target: triggerIcon });
  check(true);
  dispatch("click", { target: {} });
  check(false);
  menu.toggle();
  document.activeElement = child;
  dispatch("keydown", { key: "Enter" });
  check(true);
  let prevented = false;
  dispatch("keydown", { key: "Escape", preventDefault() { prevented = true; } });
  check(false);
  assert.equal(prevented, true);
  assert.equal(document.activeElement, trigger);
});

test("Odpojení zavře panel a opětovné připojení zachová vytvořené uzly", () => {
  const { menu, child, check, dispatch } = menuFixture();
  menu.connectedCallback();
  menu.toggle();
  menu.disconnectedCallback();
  check(false);
  dispatch("keydown", { key: "Escape", preventDefault() { assert.fail("Listener po odpojení zůstal aktivní"); } });
  menu.render = () => assert.fail("Menu se při opětovném připojení znovu vykreslilo");
  menu.connectedCallback();
  assert.equal(menu.renderedChild, child);
  check(false);
  menu.toggle();
  check(true);
  menu.toggle();
  check(false);
});

test("Podnabídka sjednocuje kliknutí, myš, dotyk a odchod fokusu s aria-expanded", () => {
  const element = () => ({
    children: [],
    attributes: new Map(),
    listeners: new Map(),
    append(...children) { this.children.push(...children); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    addEventListener(type, listener) { this.listeners.set(type, listener); },
  });
  globalThis.document = {
    activeElement: null,
    createElement: element,
    createElementNS: element,
  };
  const menu = new SiteMenu();
  menu.createLink = element;
  const group = menu.createGroup("Akce", "kalendar-akci/index.html", "test-podnabidka", [["Detail", "detail.html"]]);
  const arrow = group.children[0].children[1];
  const child = group.children[1].children[0];
  const classes = new Set();
  group.classList = {
    contains(name) { return classes.has(name); },
    toggle(name, force = !classes.has(name)) {
      if (force) classes.add(name); else classes.delete(name);
      return force;
    },
  };
  group.contains = (target) => target === arrow || target === child;
  let hovered = false;
  group.matches = () => hovered;
  const dispatch = (target, type, event = {}) => target.listeners.get(type)(event);
  const check = (open) => {
    assert.equal(classes.has("submenu-open"), open);
    assert.equal(arrow.attributes.get("aria-expanded"), String(open));
  };
  assert.equal(arrow.type, "button");
  assert.equal(arrow.attributes.get("aria-controls"), "test-podnabidka");
  check(false);
  dispatch(arrow, "pointerenter", { pointerType: "touch" });
  check(false);
  dispatch(arrow, "pointerenter", { pointerType: "mouse" });
  check(true);
  dispatch(group, "pointerleave", { pointerType: "touch" });
  check(true);
  dispatch(group, "pointerleave", { pointerType: "mouse" });
  check(false);
  dispatch(arrow, "pointerenter", { pointerType: "mouse" });
  dispatch(arrow, "click");
  check(true);
  dispatch(group, "pointerleave", { pointerType: "mouse" });
  dispatch(group, "focusout", { relatedTarget: null });
  check(true);
  dispatch(arrow, "click");
  check(false);
  dispatch(arrow, "pointerenter", { pointerType: "mouse" });
  document.activeElement = arrow;
  dispatch(group, "pointerleave", { pointerType: "mouse" });
  dispatch(group, "focusout", { relatedTarget: child });
  check(true);
  hovered = true;
  dispatch(group, "focusout", { relatedTarget: null });
  check(true);
  hovered = false;
  document.activeElement = null;
  dispatch(group, "focusout", { relatedTarget: null });
  check(false);
  dispatch(arrow, "click");
  check(true);
  dispatch(arrow, "click");
  check(false);
});

test("Motiv požádá hotový i právě načtený iframe a zachová obrázek tlačítka", async () => {
  const messages = [];
  const classes = new Set();
  const attributes = new Map();
  const image = { style: {} };
  let onMessage;
  let onLoad;
  let onClick;
  const body = {
    classList: {
      contains(name) { return classes.has(name); },
      remove(...names) { names.forEach((name) => classes.delete(name)); },
      toggle(name) { if (classes.has(name)) classes.delete(name); else classes.add(name); },
    },
  };
  const iframe = {
    contentWindow: {
      postMessage(data, origin) {
        assert.equal(typeof onMessage, "function", "Odpověď musí být obsloužena i při okamžitém dotazu");
        messages.push([data, origin]);
      },
    },
    addEventListener(type, listener) { assert.equal(type, "load"); onLoad = listener; },
  };
  const button = {
    querySelector(selector) { assert.equal(selector, "img"); return image; },
    setAttribute(name, value) { attributes.set(name, value); },
    addEventListener(type, listener) { assert.equal(type, "click"); onClick = listener; },
    set innerHTML(_value) { assert.fail("Motiv nesmí znovu vytvářet obrázek tlačítka"); },
  };
  globalThis.document = {
    body,
    getElementById(id) {
      if (id === "theme-sync") return iframe;
      assert.equal(id, "button-theme-switch");
      return button;
    },
    querySelector(selector) {
      if (selector === "body") return body;
      assert.equal(selector, ".menu-btn");
      return null;
    },
    querySelectorAll(selector) { assert.equal(selector, "#icon-img"); return []; },
  };
  globalThis.window = {
    addEventListener(type, listener) { assert.equal(type, "message"); onMessage = listener; },
  };
  await import("../scripts/light-modV2.js");
  assert.deepEqual(messages, [["get-theme", "https://burthgulash.github.io"]]);
  onLoad();
  assert.deepEqual(messages[1], ["get-theme", "https://burthgulash.github.io"]);
  const check = (theme) => {
    const dark = theme === "dark";
    assert.equal(classes.has("dark"), dark);
    assert.equal(classes.has("light"), !dark);
    assert.equal(button.querySelector("img"), image);
    assert.equal(image.src, new URL(`kvido html-img/foto/Ikony-img/${dark ? "slunce-icon" : "Mesic-icon"}.webp`, root).href);
    assert.equal(image.style.marginLeft, dark ? "0" : "8px");
    assert.equal(attributes.get("aria-label"), `Přepnout na ${dark ? "světlý" : "tmavý"} motiv`);
  };
  check("dark");
  onMessage({ origin: "https://burthgulash.github.io", data: { type: "theme", value: "light" } });
  check("light");
  onMessage({ origin: "https://burthgulash.github.io", data: { type: "theme", value: "dark" } });
  check("dark");
  onClick();
  assert.deepEqual(messages.at(-1), [{ type: "set-theme", value: "light" }, "https://burthgulash.github.io"]);
  check("light");
  onClick();
  assert.deepEqual(messages.at(-1), [{ type: "set-theme", value: "dark" }, "https://burthgulash.github.io"]);
  check("dark");
});
