// components/nav-controls.js
class NavControls extends HTMLElement {
  constructor() {
    super();
    this._minPanY = null;           // legacy (grid clamp removed, kept harmlessly)
    this._currentMode = 'universe'; // default
    this._modeListener = null;
    this._visListener = null;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 50px;          /* just under header – tweak if needed */
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          pointer-events: none; /* only buttons receive events */
        }

        /* Mobile: inline nested placement (between search + canvas) */
        @media (max-width: 640px) {
          :host {
            position: relative;
            top: auto;
            left: auto;
            transform: none;
            display: block;
            margin: 10px auto 12px;
            z-index: 1;
          }
        }

        /* Base (light – Artiligenz Clear) */
        .dock {
          display: flex;
          flex-direction: row;            /* horizontal bar */
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.95);
          border-radius: 999px;
          padding: 8px 10px;
          border: 1px solid rgba(148,163,184,0.6); /* slate-400 */
          box-shadow: 0 10px 24px rgba(15,23,42,0.18);
          pointer-events: auto;
          backdrop-filter: blur(18px);
        }

        button {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.7);
          background: rgba(248,250,252,0.98);      /* slate-50 */
          color: #0f172a;                          /* slate-900 */
          font-size: 14px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition:
            background 150ms ease,
            border-color 150ms ease,
            box-shadow 150ms ease,
            transform 120ms ease;
        }

        button:hover {
          background: rgba(226,232,240,0.98);      /* slate-200 */
          box-shadow: 0 0 0 1px rgba(148,163,184,0.5);
        }

        button:active {
          transform: scale(0.96);
          background: rgba(59,130,246,0.98);       /* blue-500 */
          border-color: rgba(59,130,246,1);
          color: #ffffff;
          box-shadow: 0 0 0 1px rgba(59,130,246,0.6);
        }

        .sep {
          width: 8px;
        }

        /* DARK – Artiligenz Glass */
        :host-context(html.dark) .dock {
          background: rgba(15,23,42,0.82);              /* slate-900 glass */
          border-color: rgba(56,189,248,0.4);           /* cyan-400 */
          box-shadow:
            0 0 40px rgba(56,189,248,0.35),
            0 18px 40px rgba(15,23,42,0.75);
        }

        :host-context(html.dark) button {
          background: rgba(15,23,42,0.95);
          border-color: rgba(56,189,248,0.35);
          color: rgba(226,232,240,0.98);
        }

        :host-context(html.dark) button:hover {
          background: rgba(30,41,59,0.96);
          box-shadow: 0 0 0 1px rgba(56,189,248,0.25);
        }

        :host-context(html.dark) button:active {
          background: rgba(56,189,248,0.92);
          border-color: rgba(56,189,248,1);
          color: #0b1220;
          box-shadow: 0 0 0 1px rgba(56,189,248,0.55);
        }
      </style>

      <div class="dock">
        <button data-act="up" aria-label="Pan up">↑</button>
        <button data-act="down" aria-label="Pan down">↓</button>
        <button data-act="left" aria-label="Pan left">←</button>
        <button data-act="right" aria-label="Pan right">→</button>
        <span class="sep"></span>
        <button data-act="zoom-in" aria-label="Zoom in">＋</button>
        <button data-act="zoom-out" aria-label="Zoom out">－</button>
        <span class="sep"></span>
        <button data-act="reset" aria-label="Reset view">⟲</button>
      </div>
    `;

    const dock = this.shadowRoot.querySelector('.dock');
    const buttons = dock.querySelectorAll('button');

    const PAN_STEP = 70;
    const ZOOM_STEP = 0.12;

    const actions = {
      'up':       () => this.panBy(0, -PAN_STEP),
      'down':     () => this.panBy(0,  PAN_STEP),
      'left':     () => this.panBy(-PAN_STEP, 0),
      'right':    () => this.panBy( PAN_STEP, 0),
      'zoom-in':  () => this.zoomBy(ZOOM_STEP),
      'zoom-out': () => this.zoomBy(-ZOOM_STEP),
      'reset':    () => this.resetView()
    };

    const attachPressRepeat = (btn, fn) => {
      let timer = null;

      const start = (ev) => {
        ev.preventDefault();
        fn();
        if (timer) clearInterval(timer);
        timer = setInterval(fn, 110);
      };

      const stop = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };

      btn.addEventListener('mousedown', start);
      btn.addEventListener('touchstart', start, { passive: false });

      ['mouseup', 'mouseleave'].forEach(ev =>
        btn.addEventListener(ev, stop)
      );
      ['touchend', 'touchcancel'].forEach(ev =>
        btn.addEventListener(ev, stop)
      );

      window.addEventListener('mouseup', stop);
      window.addEventListener('blur', stop);
    };

    buttons.forEach(btn => {
      const act = btn.dataset.act;
      const fn = actions[act];
      if (!fn) return;
      attachPressRepeat(btn, fn);
    });

    // Track current mode (universe / grid / orbit) — kept for compatibility
    this._modeListener = (e) => {
      const mode = e.detail && e.detail.mode;
      if (mode) this._currentMode = mode;
    };
    document.addEventListener('mode-changed', this._modeListener);

    // Visibility from header toggle
    this._visListener = (e) => {
      const v = !!(e.detail && e.detail.visible);
      this._applyVisibility(v);
    };
    document.addEventListener('nav-controls-visibility', this._visListener);

    // Mobile default: visible. Desktop default: hidden (header toggle controls).
    const isCoarsePointer =
      (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);

    this._applyVisibility(isCoarsePointer);
  }

  disconnectedCallback() {
    if (this._modeListener) {
      document.removeEventListener('mode-changed', this._modeListener);
      this._modeListener = null;
    }
    if (this._visListener) {
      document.removeEventListener('nav-controls-visibility', this._visListener);
      this._visListener = null;
    }
  }

  // ✅ Use the app’s actual Cytoscape handle (scripts.js exposes window.__cy)
  get cy() {
    return window.__cy || window.cy || null;
  }

  show() { this._applyVisibility(true); }
  hide() { this._applyVisibility(false); }
  toggle() {
    const isHidden = this.style.display === 'none';
    this._applyVisibility(isHidden);
  }

  _applyVisibility(visible) {
    this.style.display = visible ? 'block' : 'none';
  }

  // ✅ Free motion pan (grid clamp removed)
  panBy(dx, dy) {
    const cy = this.cy;
    if (!cy) return;

    const p = cy.pan();
    cy.pan({ x: p.x + dx, y: p.y + dy });
  }

  zoomBy(delta) {
    const cy = this.cy;
    if (!cy) return;
    const current = cy.zoom();
    const target = Math.max(cy.minZoom(), Math.min(cy.maxZoom(), current + delta));
    const center = { x: cy.width() / 2, y: cy.height() / 2 };
    cy.zoom({
      level: target,
      renderedPosition: center
    });
  }

  // ✅ Grid view is redundant → reset always returns to universe
  resetView() {
    const cy = this.cy;
    const targetMode = 'universe';

    const sidebar = document.querySelector('custom-sidebar');
    if (sidebar && sidebar.shadowRoot) {
      const sr = sidebar.shadowRoot;

      const viewChips = sr.querySelectorAll('.chip[data-mode]');
      viewChips.forEach(c => c.classList.remove('active'));
      const targetChip = sr.querySelector(`.chip[data-mode="${targetMode}"]`);
      if (targetChip) targetChip.classList.add('active');

      sr.querySelectorAll('.filter-chip.active').forEach(c => c.classList.remove('active'));

      const searchBox = sr.querySelector('.search-box');
      if (searchBox) searchBox.value = '';
    }

    document.dispatchEvent(
      new CustomEvent('filters-changed', {
        detail: { categories: [], search: '' }
      })
    );

    document.dispatchEvent(
      new CustomEvent('mode-changed', {
        detail: { mode: targetMode }
      })
    );

    if (cy) {
      // no manual camera reset; main scripts handle fit
    }
  }
}

customElements.define('nav-controls', NavControls);
