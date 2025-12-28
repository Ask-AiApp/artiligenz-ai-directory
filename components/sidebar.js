class CustomSidebar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    // --- canonical buckets (snake keys → short labels + colors) ---
    const BUCKETS = {
      foundation_models:        { label: "Foundation Models",    color: "#FFB347" },
      education_ai:             { label: "Education & Learning", color: "#FDD835" },
      assistants_search:        { label: "Assistants & Search",  color: "#81C784" },
      creative_genmedia:        { label: "Creative Media",       color: "#9FA8DA" },
      productivity_collab:      { label: "Productivity",         color: "#80DEEA" },
      enterprise_apps:          { label: "Enterprise Apps",      color: "#F48FB1" },
      healthcare_biotech:       { label: "Healthcare",           color: "#AED581" },
      robotics_industrial_edge: { label: "Robotics & Edge",      color: "#B0BEC5" },
      dev_coding_tools:         { label: "Dev Tools",            color: "#c9a8cf" },
      data_vector_mlops:        { label: "Data & MLOps",         color: "#4DB6AC" },
      // NOTE: key aligned with graph bucket naming for filtering
      infra_cloud_edge:         { label: "Cloud & Infra",        color: "#9f22be" }
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display:block;
          /* no fixed height: sidebar shrinks with content */
          color:#111827;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        }

        .sidebar {
          display:flex;
          flex-direction:column;
          gap:0.75rem;
          /* no fixed height: let content drive height */
          padding:0.75rem 0.9rem 0.9rem 0.9rem;
          border-radius:1rem;
          border:1px solid rgba(148,163,184,0.45);
          background:linear-gradient(
            135deg,
            rgba(15,23,42,0.08),
            rgba(15,23,42,0.16)
          );
          backdrop-filter:blur(18px);
          box-shadow:
            0 18px 45px rgba(15,23,42,0.45),
            0 0 0 1px rgba(148,163,184,0.28);
        }

        :host-context(.dark) .sidebar {
          background:linear-gradient(
            135deg,
            rgba(15,23,42,0.85),
            rgba(15,23,42,0.92)
          );
          border-color:rgba(56,189,248,0.45);
          box-shadow:
            0 18px 50px rgba(15,23,42,0.85),
            0 0 0 1px rgba(56,189,248,0.25);
          color:#e5e7eb;
        }

        .title {
          display:flex;
          align-items:center;
          gap:0.4rem;
          font-size:0.78rem;
          font-weight:600;
          text-transform:uppercase;
          letter-spacing:0.08em;
          color:#4b5563;
        }

        :host-context(.dark) .title {
          color:#e5e7eb;
        }

        .scroll {
          margin-top:0.1rem;
          display:flex;
          flex-direction:column;
          gap:0.5rem;
          /* no flex:1 or fixed height; content defines height */
        }

        details {
          border-radius:0.75rem;
          padding:0.45rem 0.55rem 0.55rem 0.55rem;
          background:rgba(255,255,255,0.6);
          border:1px solid rgba(148,163,184,0.55);
        }

        details[open] {
          background:rgba(255,255,255,0.9);
        }

        :host-context(.dark) details {
          background:rgba(15,23,42,0.88);
          border-color:rgba(148,163,184,0.55);
        }

        :host-context(.dark) details[open] {
          background:rgba(15,23,42,0.96);
        }

        summary {
          cursor:pointer;
          outline:none;
          list-style:none;
          display:flex;
          align-items:center;
          gap:0.35rem;
          font-size:0.78rem;
          font-weight:600;
          color:#4b5563;
        }

        summary::-webkit-details-marker {
          display:none;
        }

        :host-context(.dark) summary {
          color:#e5e7eb;
        }

        .section-body {
          margin-top:0.4rem;
          display:flex;
          flex-direction:column;
          gap:0.4rem;
        }

        .chip-row {
          display:flex;
          flex-wrap:wrap;
          gap:0.35rem;
        }

        .chip,
        .filter-chip {
          padding:.3rem .6rem;
          border-radius:9999px;
          font-size:.72rem;
          font-weight:700;
          cursor:pointer;
          border:1px solid #E5E7EB;
          background:#ffffff;
          color:#334155;
          user-select:none;
          white-space:nowrap;
        }

        :host-context(.dark) .chip,
        :host-context(.dark) .filter-chip {
          border-color:#374151;
          background:#020617;
          color:#e5e7eb;
        }

        /* Active chips (View + Category): Artiligenz Glass cyan accent
           - same accent colour both themes
           - darker text in light theme
           - bright text in dark theme
        */
        .chip.active,
        .filter-chip.active {
          background:#e0f2fe;   /* light cyan glass */
          border-color:#0ea5e9; /* cyan edge */
          color:#0f172a;        /* dark text */
          box-shadow:0 0 0 1px rgba(148,163,184,0.6), 0 10px 20px rgba(15,23,42,0.15);
        }

        :host-context(.dark) .chip.active,
        :host-context(.dark) .filter-chip.active {
          background:#0ea5e9;   /* cyan-500 */
          border-color:#38bdf8; /* sky-400 */
          color:#f9fafb;        /* bright text */
          box-shadow:0 0 0 1px rgba(8,47,73,0.9), 0 12px 26px rgba(8,47,73,0.95);
        }

        .search-box {
          width: 92%;
          padding:.45rem .75rem;
          border:1px solid #E5E7EB;
          border-radius:.5rem;
          background:#ffffff;
          color:#111827;
          font-size:.78rem;
        }

        .search-box::placeholder {
          color:#9ca3af;
        }

        .search-box:focus {
          outline:none;
          border-color:#0ea5e9;
          box-shadow:0 0 0 1px rgba(14,165,233,0.55);
        }

        :host-context(.dark) .search-box {
          background:#020617;
          border-color:#374151;
          color:#e5e7eb;
        }

        :host-context(.dark) .search-box::placeholder {
          color:#6b7280;
        }

        .hint {
          font-size:0.68rem;
          color:#6b7280;
        }

        :host-context(.dark) .hint {
          color:#9ca3af;
        }

        .bucket-row {
          display:flex;
          flex-wrap:wrap;
          gap:0.35rem;
        }
      </style>

      <div class="sidebar">
        <div class="title"><i data-feather="sliders"></i> Filters & Controls</div>

        <div class="scroll">
          <details open>
            <summary><i data-feather="aperture"></i> View</summary>
            <div class="section-body">
              <div class="chip-row" role="group" aria-label="View mode">
                <div class="chip active" data-mode="universe">Universe</div>
              </div>
            </div>
          </details>

          <details open class="search-section">
            <summary><i data-feather="search"></i> Search</summary>
            <div class="section-body">
              <input type="text" class="search-box" placeholder="Search by name…" />
              <div class="hint">Filters work on the live map. Combine search + category.</div>
            </div>
          </details>

          <details open>
            <summary><i data-feather="layers"></i> Categories</summary>
            <div class="section-body">
              <div id="bucket-holder" class="bucket-row" role="group" aria-label="Category filter"></div>
              <div class="hint">Single-select. Tap again to clear.</div>
            </div>
          </details>
        </div>
      </div>
    `;

    // Safe check (no optional chaining)
    if (window.feather && typeof window.feather.replace === 'function') {
      window.feather.replace({ class: 'icon' });
    }

    // --- dynamic bucket chips (NO "All"; no default selection) ---
    const holder = this.shadowRoot.querySelector('#bucket-holder');
    for (const [key, v] of Object.entries(BUCKETS)) {
      // Hide "Productivity" chip for now
      if (key === 'productivity_collab') continue;

      const d = document.createElement('div');
      d.className = 'filter-chip';
      d.dataset.category = key; // snake key aligns with data.bucket
      d.textContent = v.label;
      holder.appendChild(d);
    }

    // View chips: Universe-only
    const viewChips = this.shadowRoot.querySelectorAll('.chip[data-mode]');
    viewChips.forEach(chip => {
      chip.addEventListener('click', () => {
        // visual toggle
        viewChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        // === MVP RESET BEHAVIOUR ===
        // 1) Clear category selections
        this.shadowRoot
          .querySelectorAll('.filter-chip.active')
          .forEach(c => c.classList.remove('active'));

        // 2) Clear search box
        const searchInput = this.shadowRoot.querySelector('.search-box');
        if (searchInput) searchInput.value = '';

        // 3) Emit reset filters BEFORE switching mode
        this.dispatchEvent(new CustomEvent('filters-changed', {
          bubbles: true,
          composed: true,
          detail: { categories: [], search: '' }
        }));

        // Note: mode-changed event is no longer emitted since there's only one mode
        // === END RESET BEHAVIOUR ===
      });
    });

    // Category chips: single-select with toggle-off (MVP)
    const categoryChips = this.shadowRoot.querySelectorAll('.filter-chip[data-category]');
    categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const wasActive = chip.classList.contains('active');

        // Single-select: clear all, then maybe set this one
        categoryChips.forEach(c => c.classList.remove('active'));
        if (!wasActive) chip.classList.add('active'); // tap again → clears all

        this.dispatchEvent(new CustomEvent('filters-changed', {
          bubbles: true,
          composed: true,
          detail: this._collect()
        }));
      });
    });

    // Search box → emits filters-changed on input
    const search = this.shadowRoot.querySelector('.search-box');
    if (search) {
      search.addEventListener('input', () => {
        this.dispatchEvent(new CustomEvent('filters-changed', {
          bubbles: true,
          composed: true,
          detail: this._collect()
        }));
      });
    }
  }

  _collect() {
    const sr = this.shadowRoot;
    const activeCat = sr.querySelector('.filter-chip.active[data-category]');
    let categories = [];
    if (activeCat) {
      const v = activeCat.getAttribute('data-category');
      if (v) categories = [v];
    }
    const search = sr.querySelector('.search-box')?.value || '';
    return { categories, search };
  }
}

customElements.define('custom-sidebar', CustomSidebar);