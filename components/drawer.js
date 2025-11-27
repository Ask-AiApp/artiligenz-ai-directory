// components/drawer.js
// <info-drawer> — right-hand drawer used by "More 📄" in microcard.
// Uses window.CompanySummaries for 100–150 word summaries.

class InfoDrawer extends HTMLElement {
  constructor() {
    super();
    this._data = null;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 60;
        }

        .scrim {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .panel {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: min(520px, 92vw);
          background: rgba(15,23,42,0.96); /* slate-900 glass */
          color: #e5e7eb;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: -16px 0 40px rgba(0,0,0,0.7);
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
          top: 1.35rem;
          right: 1.35rem;
          border: none;
          background: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.35rem;
        }
        .close-btn:hover {
          color: #e5e7eb;
        }

        .scroll {
          flex: 1;
          overflow-y: auto;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 5;
          padding: 1.5rem 1.7rem 1rem 1.7rem;
          background: rgba(15,23,42,0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
        }

        .favicon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          object-fit: contain;
          flex-shrink: 0;
        }
        .favicon-fallback {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: #1f2937;
          flex-shrink: 0;
        }

        .name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .chip {
          padding: 0.25rem 0.8rem;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.6);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #e5e7eb;
          background: rgba(15,23,42,0.9);
        }
        .chip.primary {
          border-color: rgba(56,189,248,0.7);
          color: #7dd3fc;
          background: rgba(15,23,42,0.95);
        }

        .body {
          padding: 1.25rem 1.7rem 2.2rem 1.7rem;
        }

        .section-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #94a3b8;
          margin-bottom: 0.3rem;
        }

        .summary-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #cbd5e1;
          margin-bottom: 1.5rem;
        }

        .visit-btn {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0.5rem 1.1rem;
          border: 1px solid rgba(125,211,252,0.6);
          color: #7dd3fc;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        .visit-btn:hover {
          background: rgba(56,189,248,0.12);
          border-color: rgba(125,211,252,0.9);
        }
      </style>

      <div class="scrim"></div>
      <div class="panel">
        <button class="close-btn" title="Close">
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

  // attribute-backed "open" flag
  get open() {
    return this.hasAttribute("open");
  }
  set open(val) {
    if (val) {
      this.setAttribute("open", "");
      document.body.style.overflow = "hidden";
    } else {
      this.removeAttribute("open");
      document.body.style.overflow = "";
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

    const name = data.name || "";
    const id = data.id || data.node_id || null;
    const bucketLabel = data.bucket_label || data.category || "";
    const favicon = data.favicon || "";
    const nodeUrl = (data.url || "").trim();

    const meta = this._lookupMeta(name, id) || {};
    const category = meta.category || bucketLabel;
    const org = meta.org || meta.owner || "";
    const region = meta.region || "";

    const summary =
      meta.overview ||
      meta.summary ||
      data.summary ||
      "Summary not available.";

    const website = (meta.website || nodeUrl || "").trim();

    // ---- header ----
    const faviconHtml = favicon
      ? `<img src="${favicon}" alt="${name} logo" class="favicon"
             onerror="this.onerror=null;this.replaceWith(document.createElement('span'));this.nextSibling?.classList?.add('favicon-fallback');" />`
      : `<span class="favicon-fallback"></span>`;

    const chips = [];
    if (category) chips.push(`<span class="chip primary">${category}</span>`);
    if (org) chips.push(`<span class="chip">${org}</span>`);
    if (region) chips.push(`<span class="chip">${region}</span>`);

    this.$header.innerHTML = `
      <div class="title-row">
        ${faviconHtml}
        <div class="name">${name}</div>
      </div>
      <div class="chips">
        ${chips.join("")}
      </div>
    `;

    // ---- body ----
    this.$body.innerHTML = `
      <div>
        <div class="section-label">Overview</div>
        <p class="summary-text">${summary}</p>
      </div>
      ${
        website
          ? `<a href="${website}" target="_blank" rel="noopener noreferrer" class="visit-btn">
               Visit Website ↗
             </a>`
          : ""
      }
    `;

    // reset scroll to top
    this.shadowRoot.querySelector(".scroll").scrollTop = 0;

    this.open = true;
  }
}

customElements.define("info-drawer", InfoDrawer);