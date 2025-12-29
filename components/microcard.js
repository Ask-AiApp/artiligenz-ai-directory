// components/microcard.js
// Microcard = determinator of Explore vs Profile
// Uses data.parent_id + global cy graph truth (NOT edges)

(function () {
  let microEl = null;
  let state = {
    cy: null,
    container: null,
    node: null,
    onViewEcosystem: null,
    onOpenProfile: null,
    visible: false
  };

  // -------------------------
  // Helpers
  // -------------------------
  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function ensureEl() {
    if (microEl) return microEl;

    microEl = document.createElement('div');
    microEl.id = 'microcard';
    microEl.style.position = 'absolute';
    microEl.style.zIndex = '30';
    microEl.style.display = 'none';
    microEl.style.pointerEvents = 'auto';
    microEl.style.transformOrigin = 'top left';

    (state.container || document.body).appendChild(microEl);
    
    // CRITICAL: Stop touch events at the microcard root
    microEl.addEventListener(
      'pointerdown',
      (e) => e.stopPropagation(),
      true
    );
    
    applyMicroStyle();
    return microEl;
  }

  function applyMicroStyle() {
    if (!microEl) return;

    const dark = isDark();
    microEl.style.maxWidth = '280px';
    microEl.style.minWidth = '240px';
    microEl.style.borderRadius = '14px';
    microEl.style.padding = '10px 12px';
    microEl.style.backdropFilter = 'blur(18px)';
    microEl.style.webkitBackdropFilter = 'blur(18px)';
    microEl.style.boxSizing = 'border-box';

    // Use CSS variables from style.css
    const glassBg = getCssVar('--glass-bg');
    const borderLight = getCssVar('--border-light');
    const borderNeon = getCssVar('--border-neon');
    const shadowMd = getCssVar('--shadow-md');
    const accentGlow = getCssVar('--accent-glow');
    const textPrimary = getCssVar('--text-primary');
    const textSecondary = getCssVar('--text-secondary');

    if (dark) {
      microEl.style.background = glassBg || 'rgba(2, 6, 23, 0.78)';
      microEl.style.border = `1px solid ${borderNeon || 'rgba(34, 211, 238, 0.28)'}`;
      microEl.style.boxShadow = `0 0 26px ${accentGlow || 'rgba(56, 189, 248, 0.16)'}`;
      microEl.style.color = textPrimary || '#e2e8f0';
    } else {
      microEl.style.background = 'rgba(255, 255, 255, 0.92)';
      microEl.style.border = `1px solid ${borderLight || 'rgba(226, 232, 240, 0.95)'}`;
      microEl.style.boxShadow = shadowMd || '0 14px 30px rgba(15, 23, 42, 0.10)';
      microEl.style.color = textPrimary || '#0f172a';
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function anchorPos() {
    const pad = 12;
    const offset = 18;
    const rp = state.node.renderedPosition();
    const rect = (state.container || state.cy?.container()).getBoundingClientRect();

    microEl.style.visibility = 'hidden';
    microEl.style.display = 'block';
    const w = microEl.offsetWidth || 260;
    const h = microEl.offsetHeight || 120;
    microEl.style.visibility = 'visible';

    return {
      left: clamp(rp.x + offset, pad, rect.width - w - pad),
      top: clamp(rp.y + offset, pad, rect.height - h - pad)
    };
  }

  // -------------------------
  // ECOSYSTEM DETERMINATOR (KEY CHANGE)
  // -------------------------
  function hasEcosystem(node) {
    if (!node || !state.cy) return false;
    const d = node.data();

    // Case 1: Orbit node → belongs to a sun
    if (d.parent_id) return true;

    // Case 2: Sun node → has children
    const isSun = typeof node.id === 'function' && node.id().startsWith('parent:');
    if (!isSun) return false;

    return state.cy.nodes().some(n => n.data('parent_id') === node.id());
  }

  function renderMicrocard() {
    const el = ensureEl();
    const node = state.node;
    if (!node) return;

    const d = node.data();
    const name = d.name || d.label || 'Unknown';
    const category = d.bucket_label || d.bucket || '';
    const logo = d.favicon || d.logo || '';

    const ecosystem = hasEcosystem(node);
    const dark = isDark();

    // Use CSS variables from style.css
    const accentPrimary = getCssVar('--accent-primary');
    const accentGlow = getCssVar('--accent-glow');
    const borderLight = getCssVar('--border-light');
    const borderNeon = getCssVar('--border-neon');
    const textPrimary = getCssVar('--text-primary');
    const textSecondary = getCssVar('--text-secondary');
    const glassBg = getCssVar('--glass-bg');

    const chipBg = dark 
      ? (accentPrimary ? accentPrimary.replace(')', ', 0.12)').replace('rgb', 'rgba') : 'rgba(56,189,248,0.12)')
      : (accentPrimary ? accentPrimary.replace(')', ', 0.10)').replace('rgb', 'rgba') : 'rgba(14,165,233,0.10)');
    
    const chipBorder = dark 
      ? (accentPrimary ? accentPrimary.replace(')', ', 0.28)').replace('rgb', 'rgba') : 'rgba(56,189,248,0.28)')
      : (accentPrimary ? accentPrimary.replace(')', ', 0.22)').replace('rgb', 'rgba') : 'rgba(14,165,233,0.22)');
    
    const subColor = dark ? (textSecondary || 'rgba(226,232,240,0.78)') : 'rgba(15,23,42,0.65)';
    const btnBg = glassBg || (dark ? 'rgba(15,23,42,0.66)' : 'rgba(255,255,255,0.72)');
    const btnBorder = dark 
      ? (borderNeon || 'rgba(34,211,238,0.45)')
      : (accentPrimary ? accentPrimary.replace(')', ', 0.35)').replace('rgb', 'rgba') : 'rgba(14,165,233,0.35)');
    const btnText = dark ? '#e0f6ff' : textPrimary;

    el.innerHTML = `
      <div style="display:flex; gap:10px;">
        ${logo
          ? `<img src="${logo}" style="width:42px;height:42px;border-radius:10px;border:1px solid ${chipBorder};padding:4px;" />`
          : `<div style="width:42px;height:42px;border-radius:10px;background:${chipBg};border:1px solid ${chipBorder};display:flex;align-items:center;justify-content:center;font-weight:700;">AI</div>`
        }
        <div>
          <div style="font-weight:800;font-size:14px;">${name}</div>
          <div style="margin-top:4px;display:flex;gap:6px;">
            ${category ? `<span style="font-size:11px;padding:2px 8px;border-radius:999px;background:${chipBg};border:1px solid ${chipBorder};color:${subColor};">${category}</span>` : ''}
            <span style="font-size:11px;padding:2px 8px;border-radius:999px;background:${chipBg};border:1px solid ${chipBorder};color:${subColor};">
              ${ecosystem ? 'Ecosystem' : 'Profile'}
            </span>
          </div>
        </div>
      </div>

      <div style="margin-top:10px;display:flex;gap:10px;">
        ${ecosystem ? `
          <button id="mcExplore" style="flex:1;padding:8px;border-radius:999px;border:1px solid ${btnBorder};background:${btnBg};color:${btnText};font-weight:700;">
            Explore 🪐
          </button>` : ''
        }
        <button id="mcMore" style="flex:1;padding:8px;border-radius:999px;border:1px solid ${btnBorder};background:${btnBg};color:${btnText};font-weight:700;">
          More 📄
        </button>
      </div>
    `;

    // Add touch-action to buttons and change click to pointerup
    const exploreBtn = el.querySelector('#mcExplore');
    const moreBtn = el.querySelector('#mcMore');
    
    if (exploreBtn) {
      exploreBtn.style.touchAction = 'manipulation';
      exploreBtn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.onViewEcosystem?.(node);
        hide();
      });
    }

    if (moreBtn) {
      moreBtn.style.touchAction = 'manipulation';
      moreBtn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.onOpenProfile?.(node);
        hide();
      });
    }
  }

  function show(node, opts) {
    state.cy = opts.cy;
    state.container = opts.container || state.cy.container();
    state.node = node;
    state.onViewEcosystem = opts.onViewEcosystem;
    state.onOpenProfile = opts.onOpenProfile;
    state.visible = true;

    const el = ensureEl();
    renderMicrocard();
    el.style.display = 'block';

    const { left, top } = anchorPos();
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }

  function hide() {
    state.visible = false;
    state.node = null;
    if (microEl) microEl.style.display = 'none';
  }

  function refreshTheme() {
    if (microEl) {
      applyMicroStyle();
      if (state.visible && state.node) {
        renderMicrocard();
      }
    }
  }

  // Theme toggle sync
  document.addEventListener('theme-changed', refreshTheme);

  // Also listen for dark mode class changes as a fallback
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        refreshTheme();
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });

  window.Microcard = { show, hide, refreshTheme };
})();