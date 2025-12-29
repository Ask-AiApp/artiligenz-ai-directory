// components/header.js — Artiligenz Glass header
// Modes:
//   default (no mode / mode="full")  -> main directory header with nav + gateway + both toggles
//   mode="simple"                    -> About/Explore header: logo + Home button + dark toggle only

class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    const mode = this.getAttribute('mode') || '';
    const simple = mode === 'simple';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        /* Header shell: match canvas glass panel */
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          padding: 0.7rem 1.5rem;

          /* Artiligenz Clear – frosted white glass */
          background: linear-gradient(
            90deg,
            rgba(248,250,252,0.96),
            rgba(241,245,249,0.96)
          );
          border-bottom: 1px solid rgba(226,232,240,0.95); /* slate-200 */
          color: #0f172a; /* slate-900 */
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 18px 40px rgba(15,23,42,0.06);
        }

        /* Dark mode */
        :host-context(.dark) header {
          /* Artiligenz Dark – frosted dark glass */
          background: linear-gradient(
            90deg,
            rgba(15,23,42,0.96),
            rgba(30,41,59,0.96)
          );
          border-bottom: 1px solid rgba(45,63,89,0.85); /* slate-800 */
          color: #e0f6ff; /* sky-50 */
          box-shadow: 0 18px 40px rgba(0,0,0,0.4);
        }

        /* Left stack */
        .left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        /* Logo */
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0ea5e9; /* sky-600 */
          text-decoration: none;
          white-space: nowrap;
        }
        :host-context(.dark) .logo {
          color: #38bdf8; /* sky-400 */
        }

        /* Nav (main header only) */
        nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.875rem; /* sm */
          font-weight: 500;
        }
        nav a {
          text-decoration: none;
          color: inherit;
          padding: 0.3rem 0;
          position: relative;
          transition: color .2s ease;
          opacity: 0.8;
        }
        nav a:hover {
          opacity: 1;
          color: #06b6d4; /* sky-500 */
        }
        nav a.active {
          opacity: 1;
          font-weight: 600;
          color: #0ea5e9; /* sky-600 */
        }
        nav a.active::after {
          content: '';
          position: absolute;
          bottom: -0.1rem;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #0ea5e9;
        }
        :host-context(.dark) nav a.active {
          color: #38bdf8; /* sky-400 */
        }
        :host-context(.dark) nav a.active::after {
          background-color: #38bdf8; /* sky-400 */
        }

        /* Right side */
        .right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .toggle-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Toggle buttons */
        .toggle-btn,
        .menu-btn {
          width: 2.25rem;
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background-color: rgba(255, 255, 255, 0.85);
          color: #64748b; /* slate-500 */
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .toggle-btn:hover,
        .menu-btn:hover {
          background-color: rgba(241, 245, 249, 0.95);
          color: #0f172a; /* slate-900 */
        }
        .toggle-btn.on {
          color: #0ea5e9; /* sky-600 */
          border-color: rgba(14, 165, 233, 0.5);
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
        }

        :host-context(.dark) .toggle-btn,
        :host-context(.dark) .menu-btn {
          border-color: rgba(45, 63, 89, 0.8); /* slate-800 */
          background-color: rgba(15, 23, 42, 0.85); /* slate-900 */
          color: #94a3b8; /* slate-400 */
        }
        :host-context(.dark) .toggle-btn:hover,
        :host-context(.dark) .menu-btn:hover {
          background-color: rgba(30, 41, 59, 0.95); /* slate-800 */
          color: #e2e8f0; /* slate-200 */
        }
        :host-context(.dark) .toggle-btn.on {
          color: #38bdf8; /* sky-400 */
          border-color: rgba(56, 189, 248, 0.5);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
        }

        /* Back to Gateway button (main header only) */
        .gateway-btn,
        .home-btn {
          padding: 0.45rem 1rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          color: #0f172a;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(0, 199, 255, 0.45);
          box-shadow: 0 0 14px rgba(0,199,255,0.25);
          backdrop-filter: blur(12px);
          transition: all .2s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .gateway-btn:hover,
        .home-btn:hover {
          background: rgba(255,255,255,0.85);
          border-color: rgba(0,199,255,0.7);
          box-shadow: 0 0 22px rgba(0,199,255,0.35);
        }
        /* Dark mode */
        :host-context(.dark) .gateway-btn,
        :host-context(.dark) .home-btn {
          color: #e0f6ff;
          background: rgba(15,23,42,0.66);
          border-color: rgba(34,211,238,0.5);
          box-shadow: 0 0 16px rgba(34,211,238,0.25);
        }
        :host-context(.dark) .gateway-btn:hover,
        :host-context(.dark) .home-btn:hover {
          background: rgba(15,23,42,0.85);
          border-color: rgba(34,211,238,0.8);
          box-shadow: 0 0 28px rgba(34,211,238,0.45);
        }

        /* Dropdown (mobile menu) — hidden by default (desktop layout unchanged) */
        .menu-btn { display: none; }
        .menu-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.35);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          display: none;
          z-index: 60;
        }
        .menu-panel {
          position: fixed;
          top: 64px;
          right: 12px;
          width: min(92vw, 320px);
          border-radius: 16px;
          padding: 10px;
          display: none;
          z-index: 61;

          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148,163,184,0.45);
          box-shadow: 0 18px 50px rgba(15,23,42,0.20);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        :host-context(.dark) .menu-panel {
          background: rgba(15,23,42,0.88);
          border-color: rgba(56,189,248,0.25);
          box-shadow: 0 18px 55px rgba(0,0,0,0.55);
        }
        .menu-panel .menu-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          opacity: 0.7;
          padding: 8px 10px 6px;
        }
        .menu-panel a,
        .menu-panel button.linkish {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          font-weight: 600;
          font-size: 14px;
          background: transparent;
          border: 0;
          cursor: pointer;
        }
        .menu-panel a:hover,
        .menu-panel button.linkish:hover {
          background: rgba(226,232,240,0.7);
        }
        :host-context(.dark) .menu-panel a:hover,
        :host-context(.dark) .menu-panel button.linkish:hover {
          background: rgba(30,41,59,0.9);
        }

        .menu-panel .menu-row {
          display: flex;
          gap: 8px;
          padding: 10px 10px 6px;
        }
        .menu-panel .menu-row .mini {
          flex: 1 1 auto;
          justify-content: center;
          font-weight: 700;
        }

        /* ========= Mobile ========= */
        @media (max-width: 640px) {
          header {
            flex-wrap: nowrap;
            gap: 0.6rem;
            padding: 0.55rem 0.75rem;
          }

          .left {
            gap: 0.75rem;
            min-width: 0;
            flex: 1 1 auto;
          }

          .logo {
            font-size: 1.05rem;
            max-width: 62vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          /* Hide desktop nav; use hamburger */
          nav { display: none; }

          .right {
            width: auto;
            justify-content: flex-end;
            gap: 0.5rem;
            flex-wrap: nowrap;
          }

          /* Compact gateway/back button: icon only */
          .gateway-text { display: none; }
          .gateway-btn {
            padding: 0.35rem 0.6rem;
            font-size: 0.75rem;
          }

          .toggle-btn,
          .menu-btn {
            width: 2rem;
            height: 2rem;
            box-shadow: none;
          }

          .menu-btn { display: inline-flex; }

          a, button {
            touch-action: manipulation;
          }

          /* Keep dropdown positioned under smaller header */
          .menu-panel { top: 56px; }
        }
      </style>

      <header>
        <div class="left">
          <!-- Targeted: make this stable for static hosting -->
          <a href="index.html" class="logo">Artiligenz Ai Directory</a>

          ${!simple ? `
            <nav class="nav" aria-label="Primary navigation">
              <a href="index.html" data-link="home">Home</a>
              <a href="about.html" data-link="about">About</a>
              <a href="explore.html" data-link="explore">Explore</a>
            </nav>
          ` : ''}
        </div>

        <div class="right">
          ${simple ? `
            <!-- Simple header: About / Explore -->
            <a href="index.html" class="home-btn">Home</a>

            <button
              id="toggle-dark"
              class="toggle-btn"
              aria-label="Toggle dark mode"
              aria-checked="false"
              role="switch"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>
          ` : `
            <!-- Full header: main directory -->
            <a href="http://artiligenz.ai" class="gateway-btn" aria-label="Back to Gateway">
              <span class="gateway-icon" aria-hidden="true">←</span>
              <span class="gateway-text">Back to Gateway</span>
            </a>

            <div class="toggle-group">
              <button
                id="toggle-dark"
                class="toggle-btn"
                aria-label="Toggle dark mode"
                aria-checked="false"
                role="switch"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </button>

              <button
                id="toggle-nav"
                class="toggle-btn"
                aria-label="Toggle navigation controls"
                aria-checked="false"
                role="switch"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l16 0"/><path d="M4 12l16 0"/><path d="M4 18l16 0"/></svg>
              </button>

              <!-- Mobile hamburger (desktop stays unchanged via CSS) -->
              <button
                id="menu-btn"
                class="menu-btn"
                aria-label="Open menu"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>
                </svg>
              </button>
            </div>
          `}
        </div>
      </header>

      ${!simple ? `
        <!-- Mobile dropdown -->
        <div class="menu-backdrop" id="menu-backdrop"></div>
        <div class="menu-panel" id="menu-panel" role="menu" aria-label="Header menu">
          <div class="menu-title">Menu</div>

          <a role="menuitem" href="index.html" data-link="home">Home</a>
          <a role="menuitem" href="about.html" data-link="about">About</a>
          <a role="menuitem" href="explore.html" data-link="explore">Explore</a>

          <div class="menu-title">Quick</div>
          <div class="menu-row">
            <a class="home-btn mini" href="http://artiligenz.ai" role="menuitem" aria-label="Back to Gateway">Gateway</a>
          </div>
        </div>
      ` : ''}
    `;

    // =========================
    // Active link highlighting
    // =========================
    // Targeted: support both conventions:
    // - active-link="home"
    // - data-active="home"
    const active =
      this.getAttribute('active-link') ||
      this.getAttribute('data-active') ||
      '';

    if (active) {
      const links = this.shadowRoot.querySelectorAll('nav a, .menu-panel a');
      links.forEach(link => {
        if (link.dataset.link === active) link.classList.add('active');
      });
    }

    // Only wire up toggles if they exist
    const darkBtn = this.shadowRoot.querySelector('#toggle-dark');
    const navBtn  = this.shadowRoot.querySelector('#toggle-nav');

    // ---- Dark mode toggle ----
    if (darkBtn) {
      const syncDarkState = () => {
        const isDark = document.documentElement.classList.contains('dark');
        darkBtn.classList.toggle('on', isDark);
        darkBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');
      };

      darkBtn.addEventListener('click', () => {
        // Prefer shared theme.js function; fallback if not present
        if (typeof window.toggleTheme === 'function') {
          window.toggleTheme();
        } else {
          document.documentElement.classList.toggle('dark');
          try {
            localStorage.setItem(
              'theme',
              document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            );
          } catch (e) {}
        }
        syncDarkState();
      });

      // Targeted: keep header synced if theme changes elsewhere
      const themeSyncHandler = () => syncDarkState();
      window.addEventListener('storage', themeSyncHandler);

      // initial sync
      syncDarkState();
    }

    // ---- Nav controls toggle (main header only) ----
    if (navBtn) {
      let navVisible = false;

      const applyNavState = () => {
        navBtn.classList.toggle('on', navVisible);
        navBtn.setAttribute('aria-checked', navVisible ? 'true' : 'false');

        document.dispatchEvent(
          new CustomEvent('nav-controls-visibility', {
            detail: { visible: navVisible }
          })
        );
      };

      navBtn.addEventListener('click', () => {
        navVisible = !navVisible;
        applyNavState();
      });

      applyNavState();
    }

    // ---- Mobile menu (full header only) ----
    const menuBtn = this.shadowRoot.querySelector('#menu-btn');
    const menuPanel = this.shadowRoot.querySelector('#menu-panel');
    const menuBackdrop = this.shadowRoot.querySelector('#menu-backdrop');

    const isMenuOpen = () => menuPanel && menuPanel.style.display === 'block';

    const openMenu = () => {
      if (!menuBtn || !menuPanel || !menuBackdrop) return;
      menuPanel.style.display = 'block';
      menuBackdrop.style.display = 'block';
      menuBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      if (!menuBtn || !menuPanel || !menuBackdrop) return;
      menuPanel.style.display = 'none';
      menuBackdrop.style.display = 'none';
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => (isMenuOpen() ? closeMenu() : openMenu());

    // Store handlers so we can clean up if needed
    this._menuClose = closeMenu;
    this._onGlobalPointer = (e) => {
      if (!isMenuOpen()) return;
      const path = e.composedPath ? e.composedPath() : [];
      if (path.includes(menuPanel) || path.includes(menuBtn)) return;
      closeMenu();
    };
    this._onGlobalKey = (e) => {
      if (e.key === 'Escape' && isMenuOpen()) closeMenu();
    };

    if (menuBtn && menuPanel && menuBackdrop) {
      menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });

      menuBackdrop.addEventListener('click', () => closeMenu());

      // Close menu after selection
      menuPanel.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => closeMenu());
      });

      document.addEventListener('pointerdown', this._onGlobalPointer, true);
      document.addEventListener('keydown', this._onGlobalKey);
    }
  }

  disconnectedCallback() {
    // Cleanup global listeners (safe even if they were never attached)
    if (this._onGlobalPointer) document.removeEventListener('pointerdown', this._onGlobalPointer, true);
    if (this._onGlobalKey) document.removeEventListener('keydown', this._onGlobalKey);
  }
}

customElements.define('custom-header', CustomHeader);
