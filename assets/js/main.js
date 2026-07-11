let CONFIG = {};

async function init() {
  const res = await fetch("/config.json");
  CONFIG = await res.json();
  customElements.define("p-card", Card);
}
init();

function safeJSON(val, fallback = []) {
  try {
    return JSON.parse(val || "[]");
  } catch {
    return fallback;
  }
}

function safeLinks(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((l) => l && (l.url || typeof l === "string"))
    .map((l) => (typeof l === "string" ? { url: l } : l))
    .filter((l) => l.url);
}

function getDomain(url) {
  try {
    if (url.startsWith("/")) return "internal";
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "internal";
  }
}

function sortLinks(links, host) {
  const priority = CONFIG.link_priority ?? [];
  const prio = (domain) => {
    if (domain === host || !domain.includes(".")) return 0;
    const i = priority.indexOf(domain);
    return i !== -1 ? i : 999;
  };
  return [...links].sort(
    (a, b) => prio(getDomain(a.url)) - prio(getDomain(b.url)),
  );
}

function btnHtml(l, length) {
  const domain = getDomain(l.url);
  const cfg = CONFIG.links?.[domain];
  const color = cfg?.color ?? "var(--muted)";
  const iconIMG = cfg?.icon ?? "";
  const icon = iconIMG
    ? `<img src="${iconIMG}" alt="" class="${length < 3 ? "c-icon-s" : "c-icon-b"}">`
    : "";
  const label = length < 3 ? cfg?.label : "";
  return `<a href="${l.url}" class="action-button" style="background-color:${color}">${icon}${label}</a>`;
}

function renderLinks(links) {
  const sorted = sortLinks(links, window.location.hostname);
  return sorted
    .slice(0, 5)
    .map((l) => btnHtml(l, sorted.length))
    .join("");
}
export function showTags(tags) {
  return renderTags(tags);
}
function renderTags(tags) {
  return tags
    .map((id) => {
      const cfg = CONFIG.tags?.[id];
      if (!cfg || !cfg.label) return `<span class="tag">${id}</span>`;
      return `<span class="tag" style="background:${cfg.bg};color:${cfg.color}">${cfg.label}</span>`;
    })
    .join("");
}

class Card extends HTMLElement {
  static get observedAttributes() {
    return ["name", "desc", "bg", "links", "tags"];
  }
  attributeChangedCallback() {
    this.render();
  }
  connectedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute("name") ?? "";
    const desc = this.getAttribute("desc") ?? "";
    const bg = this.getAttribute("bg") ?? "";
    const links = safeLinks(safeJSON(this.getAttribute("links")));
    const tags = safeJSON(this.getAttribute("tags"));

    this.innerHTML = `
    <div class="card" style="--card-bg-img:url('${bg}')">
      <img src="${bg}" alt="${name}" class="card-image">
      <div class="card-top">
        <h4>${name}</h4>
        <p class-"card-description">${desc}</p>
        <div class="tags">${renderTags(tags)}</div>
      </div>
      <div class="card-bottom">
        <div class="card-actions">${renderLinks(links)}</div>
      </div>
    </div>`;
  }
}
