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
          display:block;
          position:sticky;
          top:0;
          z-index:40;
        }

        /* Header shell: match canvas glass panel */
        header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:1.5rem;
          padding:0.7rem 1.5rem;

          /* Artiligenz Clear – frosted white glass */
          background:linear-gradient(
            90deg,
            rgba(248,250,252,0.96),
            rgba(241,245,249,0.96)
          );
          border-bottom:1px solid rgba(226,232,240,0.95);     /* slate-200 */
          color:#0f172a;                                      /* slate-900 */
          backdrop-filter:blur(18px);
          -webkit-backdrop-filter:blur(18px);
          box-shadow:0 18px 40px rgba(15,23,42,0.06);
        }

        /* Dark mode */
        :host-context(.dark) header {
          /* Artiligenz Dark – frosted dark glass */
          background:linear-gradient(
            90deg,
            rgba(15,23,42,0.96),
            rgba(30,41,59,0.96)
          );
          border-bottom:1px solid rgba(45,63,89,0.85);       /* slate-800 */
          color:#e0f6ff;                                     /* sky-50 */
          box-shadow:0 18px 40px rgba(0,0,0,0.4);
        }

        /* Left stack */
        .left {
          display:flex;
          align-items:center;
          gap:1.5rem;
        }

        /* Logo */
        .logo {
          font-size:1.5rem;
          font-weight:700;
          color:#0ea5e9; /* sky-600 */
          text-decoration:none;
          white-space:nowrap;
        }
        :host-context(.dark) .logo {
          color:#38bdf8; /* sky-400 */
        }

        /* Nav (main header only) */
        nav {
          display:flex;
          align-items:center;
          gap:1.5rem;
          font-size:0.875rem; /* sm */
          font-weight:500;
        }
        nav a {
          text-decoration:none;
          color:inherit;
          padding:0.3rem 0;
          position:relative;
          transition:color .2s ease;
          opacity:0.8;
        }
        nav a:hover {
          opacity:1;
          color:#06b6d4; /* sky-500 */
        }
        nav a.active {
          opacity:1;
          font-weight:600;
          color:#0ea5e9; /* sky-600 */
        }
        nav a.active::after {
          content:'';
          position:absolute;
          bottom:-0.1rem;
          left:0;
          width:100%;
          height:2px;
          background-color:#0ea5e9; /* sky-600 */
          border-radius:2px;
        }
        :host-context(.dark) nav a:hover {
          color:#67e8f9; /* cyan-300 */
        }
        :host-context(.dark) nav a.active {
          color:#38bdf8; /* sky-400 */
        }
        :host-context(.dark) nav a.active::after {
          background-color:#38bdf8; /* sky-400 */
        }

        /* Right side */
        .right {
          display:flex;
          align-items:center;
          gap:1rem;
        }
        .toggle-group {
          display:flex;
          align-items:center;
          gap:0.75rem;
        }

        /* Toggle buttons */
        .toggle-btn {
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
        .toggle-btn:hover {
          background-color: rgba(241, 245, 249, 0.95);
          color: #0f172a; /* slate-900 */
        }
        .toggle-btn.on {
          color: #0ea5e9; /* sky-600 */
          border-color: rgba(14, 165, 233, 0.5);
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
        }

        :host-context(.dark) .toggle-btn {
          border-color: rgba(45, 63, 89, 0.8); /* slate-800 */
          background-color: rgba(15, 23, 42, 0.85); /* slate-900 */
          color: #94a3b8; /* slate-400 */
        }
        :host-context(.dark) .toggle-btn:hover {
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
      </style>

      <header>
        <div class="left">
          <a href="/" class="logo">Artiligenz</a>

          ${!simple ? `
            <nav class="nav">
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
            <a href="https://artiligenz.ai" class="gateway-btn">
              ← Back to Gateway
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
            </div>
          `}
        </div>
      </header>
    `;

    // Highlighting the active link (for full header)
    const active = this.getAttribute('active-link');
    if (active) {
      const links = this.shadowRoot.querySelectorAll('nav a');
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
        if (window.toggleTheme) {
          window.toggleTheme();
        } else {
          document.documentElement.classList.toggle('dark');
        }
        syncDarkState();
      });

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
  }
}

customElements.define('custom-header', CustomHeader);
