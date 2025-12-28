// components/starfield.js
// Canvas Starfield module extracted from scripts.js (behavior preserved)
// - Injects a <canvas> behind Cytoscape inside #cy container
// - Draws a subtle drifting starfield with a faint “nebula” haze
// - Responds to theme changes by adjusting opacity/contrast
// - Optionally adds gentle parallax based on cy pan/zoom
//
// Public API (attached to window.Starfield):
//   Starfield.mount(containerEl, cy)
//   Starfield.onViewportChange(cy)     // call on 'pan zoom'
//   Starfield.refreshTheme()           // call on 'theme-changed'
//   Starfield.destroy()                // optional cleanup

(function () {
  let canvas = null;
  let ctx = null;
  let rafId = null;

  let mounted = false;
  let container = null;
  let cyRef = null;

  // Visual config
  let stars = [];
  let lastT = 0;

  // Parallax state driven by cy pan/zoom (optional)
  let view = {
    panX: 0,
    panY: 0,
    zoom: 1
  };

  // Respect reduced motion
  const reduceMotion = (() => {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  })();

  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  function ensureCanvas() {
    if (canvas) return canvas;

    canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';

    ctx = canvas.getContext('2d', { alpha: true });

    return canvas;
  }

  function mount(containerEl, cy) {
    if (!containerEl) return;
    container = containerEl;
    cyRef = cy || null;

    const c = ensureCanvas();

    // Ensure container can position children
    const cs = window.getComputedStyle(container);
    if (cs.position === 'static') {
      container.style.position = 'relative';
    }

    // Insert behind Cytoscape rendering
    // Cytoscape uses its own canvas; by inserting first we keep starfield behind.
    if (!c.parentElement) {
      container.insertBefore(c, container.firstChild);
    }

    resize();
    seedStars();

    // Initialize viewport state
    if (cyRef) onViewportChange(cyRef);

    // Start loop
    if (!mounted) {
      mounted = true;
      lastT = performance.now();
      if (!reduceMotion) rafId = requestAnimationFrame(tick);
      else draw(performance.now()); // draw once
    }

    // Resize observer for robust sizing
    attachResizeHandlers();
  }

  function attachResizeHandlers() {
    // window resize
    window.addEventListener('resize', resize, { passive: true });

    // Observe container size changes (safer than relying on window resize alone)
    if (typeof ResizeObserver !== 'undefined' && container) {
      const ro = new ResizeObserver(() => resize());
      ro.observe(container);
      // stash for cleanup
      canvas.__az_ro = ro;
    }
  }

  function resize() {
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Avoid zero sizes
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Re-seed stars proportional to area (keeps density consistent)
    seedStars();
    draw(performance.now());
  }

  function seedStars() {
    if (!canvas) return;
    const w = canvas.clientWidth || (canvas.width / (window.devicePixelRatio || 1));
    const h = canvas.clientHeight || (canvas.height / (window.devicePixelRatio || 1));

    // Density: keep it subtle (launch-safe performance)
    // Scale slightly with area but clamp to avoid heavy mobile load.
    const area = w * h;
    const base = Math.round(area / 9000); // ~1 per 9k px
    const count = clamp(base, 80, 260);

    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.5, 1.8),
      a: rand(0.08, 0.35),
      tw: rand(0.002, 0.010), // twinkle speed
      ph: rand(0, Math.PI * 2) // phase
    }));
  }

  function themeParams() {
    // Tune opacity for each theme to match your earlier variable intent
    if (isDark()) {
      return {
        bg: 'rgba(11, 18, 32, 0.00)',
        starMul: 1.0,
        hazeMul: 1.0,
        hazeA: 0.10
      };
    }
    return {
      bg: 'rgba(255, 255, 255, 0.00)',
      starMul: 0.55,
      hazeMul: 0.25,
      hazeA: 0.02
    };
  }

  function tick(t) {
    if (!mounted) return;
    draw(t);
    rafId = requestAnimationFrame(tick);
  }

  function draw(t) {
    if (!canvas || !ctx) return;

    const w = canvas.clientWidth || (canvas.width / (window.devicePixelRatio || 1));
    const h = canvas.clientHeight || (canvas.height / (window.devicePixelRatio || 1));
    const dt = Math.max(0, t - lastT);
    lastT = t;

    const { starMul, hazeMul, hazeA } = themeParams();

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Subtle haze (nebula-ish), static and very light
    // Keep it cheap: 2 gradients.
    if (hazeA > 0) {
      const g1 = ctx.createRadialGradient(w * 0.25, h * 0.30, 0, w * 0.25, h * 0.30, Math.max(w, h) * 0.55);
      g1.addColorStop(0, `rgba(120,180,255,${hazeA * hazeMul})`);
      g1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.78, h * 0.70, 0, w * 0.78, h * 0.70, Math.max(w, h) * 0.48);
      g2.addColorStop(0, `rgba(60,120,255,${(hazeA * 0.85) * hazeMul})`);
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    }

    // Parallax from cy pan/zoom (very subtle)
    // Make it gentle and stable; don’t “swim” too much.
    const parallax = computeParallax(w, h);

    // Drift (slow) – only if not reduced motion
    const driftX = reduceMotion ? 0 : (t * 0.0006) % w;
    const driftY = reduceMotion ? 0 : (t * 0.00045) % h;

    // Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Gentle twinkle
      const tw = reduceMotion ? 1 : (0.85 + 0.15 * Math.sin(s.ph + t * s.tw));
      const alpha = clamp(s.a * tw * starMul, 0, 1);

      // Wrap movement
      let x = s.x - driftX + parallax.x;
      let y = s.y - driftY + parallax.y;

      x = wrap(x, w);
      y = wrap(y, h);

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function computeParallax(w, h) {
    // Use pan and zoom to create a slight parallax:
    // - pan moves the starfield slightly opposite direction (so it feels “deep”)
    // - zoom slightly increases parallax strength
    const z = clamp(view.zoom || 1, 0.2, 4);
    const strength = 0.02 * (1 + (z - 1) * 0.35);

    // If cy uses huge pan values, clamp to avoid runaway offsets
    const px = clamp(-(view.panX || 0) * strength, -w * 0.15, w * 0.15);
    const py = clamp(-(view.panY || 0) * strength, -h * 0.15, h * 0.15);

    return { x: px, y: py };
  }

  function onViewportChange(cy) {
    if (!cy) cy = cyRef;
    if (!cy) return;

    try {
      const p = cy.pan();
      const z = cy.zoom();
      view.panX = p?.x || 0;
      view.panY = p?.y || 0;
      view.zoom = z || 1;
    } catch (_) {
      // ignore
    }
  }

  function refreshTheme() {
    // Nothing to “apply” besides re-draw; palette responds to isDark()
    draw(performance.now());
  }

  function destroy() {
    mounted = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;

    window.removeEventListener('resize', resize);

    if (canvas && canvas.__az_ro) {
      try { canvas.__az_ro.disconnect(); } catch (_) {}
      canvas.__az_ro = null;
    }

    if (canvas && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }

    canvas = null;
    ctx = null;
    container = null;
    cyRef = null;
    stars = [];
  }

  // -------------------------
  // Small utilities
  // -------------------------
  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function wrap(v, max) {
    // Keep value in [0, max)
    v = v % max;
    if (v < 0) v += max;
    return v;
  }

  // Public API
  window.Starfield = {
    mount,
    onViewportChange,
    refreshTheme,
    destroy
  };
})();
