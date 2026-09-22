import "../components/site-header.js";

// Modules can also be imported after DOMContentLoaded (for example by a preview).
if (document.readyState === "loading") {
  await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
}

const registryURL = new URL("./site-features.json", import.meta.url);
const registry = fetch(registryURL).then(async response => {
  if (!response.ok) throw new Error(`Registry: HTTP ${response.status}`);
  return response.json();
});
const loadedFeatures = new Map();
const loadedStyles = new Map();

function loadStyle(path) {
  const href = new URL(path, registryURL).href;
  if (!loadedStyles.has(href)) {
    loadedStyles.set(href, new Promise((resolve, reject) => {
      const existing = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .find(link => link.href === href);
      if (existing?.sheet) return resolve();
      const link = existing || document.createElement("link");
      link.addEventListener("load", resolve, { once: true });
      link.addEventListener("error", () => reject(new Error(`Stylesheet: ${href}`)), { once: true });
      if (!existing) {
        link.rel = "stylesheet";
        link.href = href;
        document.head.append(link);
      }
    }));
  }
  return loadedStyles.get(href);
}

function loadFeature(name, definitions, ancestors = []) {
  if (ancestors.includes(name)) throw new Error(`Circular feature dependency: ${[...ancestors, name].join(" → ")}`);
  if (!Object.hasOwn(definitions, name)) throw new Error(`Unknown feature: ${name}`);
  if (!loadedFeatures.has(name)) {
    const definition = definitions[name];
    loadedFeatures.set(name, (async () => {
      for (const dependency of definition.dependsOn || []) {
        await loadFeature(dependency, definitions, [...ancestors, name]);
      }
      // Append styles in registry order so the cascade is predictable.
      await Promise.all((definition.styles || []).map(loadStyle));
      if (definition.template) {
        const response = await fetch(new URL(definition.template, registryURL));
        if (!response.ok) throw new Error(`Template for ${name}: HTTP ${response.status}`);
        const template = document.createElement("template");
        template.innerHTML = await response.text();
        // Templates are trusted files in this repository, not visitor input.
        document.body.append(template.content.cloneNode(true));
      }
      if (definition.module) {
        const feature = await import(new URL(definition.module, registryURL).href);
        await feature.init();
      }
      document.dispatchEvent(new CustomEvent("site-feature-ready", { detail: { name } }));
    })());
  }
  return loadedFeatures.get(name);
}

class SiteFeatures extends HTMLElement {
  connectedCallback() {
    this.hidden = true;
    // Features belong to the page: reconnecting the element must not reinitialize them.
    this.ready ??= this.start();
  }

  async start() {
    const errors = [];
    try {
      const definitions = await registry;
      const selected = Object.keys(definitions).filter(name => {
        const value = this.getAttribute(name);
        return value === null ? definitions[name].default === true : value !== "false";
      });
      for (const { name } of this.attributes) {
        if (!Object.hasOwn(definitions, name) && !["hidden", "id", "class", "style", "title"].includes(name)
            && !name.startsWith("data-") && !name.startsWith("aria-")) {
          console.warn(`[site-features] Unknown feature attribute: ${name}`);
        }
      }
      for (const name of selected) {
        try {
          await loadFeature(name, definitions);
        } catch (error) {
          errors.push({ name, message: error.message });
          console.error(`[site-features] ${name}`, error);
        }
      }
    } catch (error) {
      errors.push({ name: "registry", message: error.message });
      console.error("[site-features]", error);
    }
    this.dataset.state = errors.length ? "error" : "ready";
    this.dispatchEvent(new CustomEvent("site-features-ready", { bubbles: true, detail: { errors } }));
    return { errors };
  }
}

customElements.define("site-features", SiteFeatures);
