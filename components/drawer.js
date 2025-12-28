// components/drawer.js
// <info-drawer> — profile drawer used by "More 📄" in microcard / grid.
// Uses window.CompanySummaries for optional richer summaries.
//
// Required V2 edits applied:
// - Desktop: slides in from right
// - Mobile: slides up from bottom (full-width), scrollable
// - Theme: supports light + dark via :host-context(.dark)
// - Close: close button, scrim click, Esc
// - Data mapping: prefers bucket + favicon/logo + summary/url fallbacks

class InfoDrawer extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this._onKeyDown = (e) => {
      if (e.key === "Escape") this.close();
    };

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 60;
        }

        /* ---------- Theme tokens (default = light) ---------- */
        :host {
          --scrim: rgba(15, 23, 42, 0.45);

          --panel-bg: rgba(255,255,255,0.92);
          --panel-text: #0f172a;
          --panel-shadow: -16px 0 40px rgba(15,23,42,0.18);

          --header-bg: rgba(255,255,255,0.96);

          --muted: rgba(15,23,42,0.65);
          --subtle: rgba(15,23,42,0.55);

          --chip-bg: rgba(14,165,233,0.08);
          --chip-border: rgba(14,165,233,0.25);
          --chip-text: rgba(15,23,42,0.75);

          --chip2-bg: rgba(148,163,184,0.10);
          --chip2-border: rgba(148,163,184,0.30);
          --chip2-text: rgba(15,23,42,0.65);

          --btn-border: rgba(14,165,233,0.35);
          --btn-text: #0f172a;
          --btn-hover-bg: rgba(14,165,233,0.10);

          --favicon-bg: rgba(255,255,255,0.9);
        }

        :host-context(.dark) {
          --scrim: rgba(0,0,0,0.45);

          --panel-bg: rgba(15,23,42,0.96);  /* slate-900 glass */
          --panel-text: #e5e7eb;
          --panel-shadow: -16px 0 40px rgba(0,0,0,0.7);

          --header-bg: rgba(15,23,42,0.98);

          --muted: #cbd5e1;
          --subtle: #94a3b8;

          --chip-bg: rgba(15,23,42,0.95);
          --chip-border: rgba(56,189,248,0.70);
          --chip-text: #7dd3fc;

          --chip2-bg: rgba(15,23,42,0.90);
          --chip2-border: rgba(148,163,184,0.60);
          --chip2-text: #e5e7eb;

          --btn-border: rgba(125,211,252,0.60);
          --btn-text: #7dd3fc;
          --btn-hover-bg: rgba(56,189,248,0.12);

          --favicon-bg: rgba(2,6,23,0.55);
        }

        .scrim {
          position: absolute;
          inset: 0;
          background: var(--scrim);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .panel {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: min(520px, 92vw);
          background: var(--panel-bg);
          color: var(--panel-text);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: var(--panel-shadow);
          transform: translateX(100%);
          transition: transform 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        :host([open]) {
          pointer-events: auto;
        }
        :host([open]) .scrim {
          opacity: 1;
        }
        :host([open]) .panel {
          transform: translateX(0);
        }

        .close-btn {
          position: absolute;
          top: 1.1rem;
          right: 1.1rem;
          border: none;
          background: none;
          color: var(--subtle);
          cursor: pointer;
          padding: 0.35rem;
        }
        .close-btn:hover {
          color: var(--muted);
        }

        .scroll {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 5;
          padding: 1.5rem 1.7rem 1rem 1.7rem;
          background: var(--header-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(148,163,184,0.12);
        }
        :host-context(.dark) .header {
          border-bottom: 1px solid rgba(148,163,184,0.10);
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
          min-width: 0;
        }

        .favicon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          object-fit: contain;
          flex-shrink: 0;
          background: var(--favicon-bg);
          border: 1px solid rgba(148,163,184,0.20);
          padding: 4px;
          box-sizing: border-box;
        }
        .favicon-fallback {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: rgba(148,163,184,0.18);
          border: 1px solid rgba(148,163,184,0.22);
          flex-shrink: 0;
        }

        .name {
          font-size: 1.25rem;
          font-weight: 750;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .chip {
          padding: 0.25rem 0.8rem;
          border-radius: 999px;
          border: 1px solid var(--chip2-border);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--chip2-text);
          background: var(--chip2-bg);
        }
        .chip.primary {
          border-color: var(--chip-border);
          color: var(--chip-text);
          background: var(--chip-bg);
        }

        .body {
          padding: 1.25rem 1.7rem 2.2rem 1.7rem;
        }

        .section-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--subtle);
          margin-bottom: 0.3rem;
        }

        .summary-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--muted);
          margin-bottom: 1.4rem;
        }

        .visit-btn {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0.55rem 1.15rem;
          border: 1px solid var(--btn-border);
          color: var(--btn-text);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .visit-btn:hover {
          background: var(--btn-hover-bg);
          border-color: rgba(14,165,233,0.55);
          transform: translateY(-1px);
        }
        :host-context(.dark) .visit-btn:hover {
          border-color: rgba(125,211,252,0.9);
        }

        /* ---------- Mobile behavior: bottom sheet ---------- */
        @media (max-width: 640px) {
          .panel {
            top: auto;
            right: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            height: min(86vh, 720px);
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            transform: translateY(110%);
            box-shadow: 0 -18px 45px rgba(0,0,0,0.25);
          }
          :host([open]) .panel {
            transform: translateY(0);
          }
          .header {
            padding: 1.25rem 1.25rem 0.9rem 1.25rem;
          }
          .body {
            padding: 1.0rem 1.25rem 1.8rem 1.25rem;
          }
          .close-btn {
            top: 0.85rem;
            right: 0.85rem;
          }
        }
      </style>

      <div class="scrim"></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Company profile">
        <button class="close-btn" title="Close" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="scroll">
          <div class="header"></div>
          <div class="body"></div>
        </div>
      </div>
    `;

    this.$scrim = this.shadowRoot.querySelector(".scrim");
    this.$panel = this.shadowRoot.querySelector(".panel");
    this.$header = this.shadowRoot.querySelector(".header");
    this.$body = this.shadowRoot.querySelector(".body");

    this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => this.close());
    this.$scrim.addEventListener("click", () => this.close());
  }

  connectedCallback() {
    // If the element is inserted while already open, ensure Esc works.
    if (this.open) document.addEventListener("keydown", this._onKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._onKeyDown);
  }

  // attribute-backed "open" flag
  get open() {
    return this.hasAttribute("open");
  }
  set open(val) {
    if (val) {
      this.setAttribute("open", "");
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", this._onKeyDown);
    } else {
      this.removeAttribute("open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this._onKeyDown);
    }
  }

  close() {
    this.open = false;
  }

  // --- helper: lookup summary metadata ---
  _lookupMeta(name, id) {
    const map = window.CompanySummaries || {};
    if (!map) return null;

    // direct name / id
    if (name && map[name]) return map[name];
    if (id && map[id]) return map[id];

    const lower = (name || "").toLowerCase();
    if (!lower) return null;

    // case-insensitive
    for (const key in map) {
      const entry = map[key];
      if (!entry) continue;
      const keyLower = String(key).toLowerCase();
      const nameLower = String(entry.name || "").toLowerCase();
      if (keyLower === lower || nameLower === lower) return entry;
    }
    return null;
  }

  // called from scripts.js: drawer.update(d)
  update(data) {
    if (!data) return;
    this._data = data;

    const name = (data.name || data.label || "").trim();
    const id = data.id || data.node_id || null;

    // Contract mapping (V2): bucket + favicon/logo + summary/url
    const bucketLabel = (data.bucket_label || data.bucket || data.category || "").trim();
    const favicon = (data.favicon || data.logo || data.logoUrl || "").trim();
    const nodeUrl = (data.url || "").trim();

    const meta = this._lookupMeta(name, id) || {};
    const category = (meta.category || bucketLabel || "").trim();
    const org = (meta.org || meta.owner || "").trim();
    const region = (meta.region || "").trim();

    const summary =
      (meta.overview || meta.summary || data.overview || data.summary || "").trim() ||
      "Summary not available.";

    const website = (meta.website || nodeUrl || "").trim();

    // ---- header ----
    const faviconHtml = favicon
      ? `<img src="${escapeHtml(favicon)}" alt="${escapeHtml(name)} logo" class="favicon" />`
      : `<span class="favicon-fallback" aria-hidden="true"></span>`;

    const chips = [];
    if (category) chips.push(`<span class="chip primary">${escapeHtml(category)}</span>`);
    if (org) chips.push(`<span class="chip">${escapeHtml(org)}</span>`);
    if (region) chips.push(`<span class="chip">${escapeHtml(region)}</span>`);

    this.$header.innerHTML = `
      <div class="title-row">
        ${faviconHtml}
        <div class="name" title="${escapeHtml(name)}">${escapeHtml(name || "Unknown")}</div>
      </div>
      <div class="chips">
        ${chips.join("")}
      </div>
    `;

    // If favicon fails, swap to fallback safely (no inline onerror in shadow HTML)
    const favImg = this.$header.querySelector("img.favicon");
    if (favImg) {
      favImg.addEventListener(
        "error",
        () => {
          const fallback = document.createElement("span");
          fallback.className = "favicon-fallback";
          favImg.replaceWith(fallback);
        },
        { once: true }
      );
    }

    // ---- body ----
    this.$body.innerHTML = `
      <div>
        <div class="section-label">Overview</div>
        <p class="summary-text">${escapeHtml(summary)}</p>
      </div>
      ${
        website
          ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer" class="visit-btn">
               Visit website ↗
             </a>`
          : ""
      }
    `;

    // reset scroll to top
    const scrollEl = this.shadowRoot.querySelector(".scroll");
    if (scrollEl) scrollEl.scrollTop = 0;

    this.open = true;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

customElements.define("info-drawer", InfoDrawer);
