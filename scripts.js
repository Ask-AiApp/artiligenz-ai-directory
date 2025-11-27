// Artiligenz-Galaxy v5 — Universe | Grid + Orbit, Microcard, Drawer, Breadcrumb
// Updated: Hover, Drawer wiring, Blue-noise Universe, No Galaxy, Correct Orbit exit

window.addEventListener('error', (e) => {
  const b = document.createElement('div');
  b.style.cssText =
    'position:fixed;left:0;right:0;top:0;z-index:99999;background:#ef4444;color:#fff;padding:8px;font:12px system-ui';
  b.textContent = 'JS error: ' + (e.message || 'unknown');
  document.body.appendChild(b);
});

// theme toggle (will also refresh cytoscape + microcard once cy exists)
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  if (window.Skin?.apply && window.cy) Skin.apply(window.cy);
  if (window.__applyMicroStyle) window.__applyMicroStyle();
  if (window.__refreshStarfieldTheme) window.__refreshStarfieldTheme();
};
window.toggleTheme = toggleTheme;

// initial theme
if (
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.feather?.replace) feather.replace();
  if (!window.cytoscape) throw new Error('Cytoscape not loaded');
  if (!window.Skin) throw new Error('Skin module not loaded');
  if (!window.Views) throw new Error('Views module not loaded'); // universe / orbital / smartFit
  if (!window.Layouts?.gridPositions) console.warn('gridPositions missing (Grid view)');

  const cy = (window.cy = cytoscape({
    container: document.getElementById('cy'),
    pixelRatio: 1,
    minZoom: 0.35,
    maxZoom: 2.0,
    style: Skin.styles(),
    layout: { name: 'preset' }
  }));

  // Ensure #cy can host overlays relative to it
  const cyContainer = cy.container();
  if (getComputedStyle(cyContainer).position === 'static') cyContainer.style.position = 'relative';

  // =========================
  // VIEW ADD: STARFIELD BG
  // =========================
  (function initStarfield() {
    try {
      const star = document.createElement('canvas');
      star.id = 'starfield';
      Object.assign(star.style, {
        position: 'absolute',
        inset: '0',
        zIndex: '0',
        pointerEvents: 'none'
      });
      cyContainer.style.background = 'transparent';
      cyContainer.prepend(star);

      const ctx = star.getContext('2d');
      const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      function themeColors() {
        const dark = document.documentElement.classList.contains('dark');
        return {
          bg: dark ? '#0b1020' : '#f8fafc',
          white: dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.35)',
          blue: dark ? 'rgba(170,210,255,0.85)' : 'rgba(80,120,180,0.40)'
        };
      }
      let COL = themeColors();

      let stars = [],
        W = 0,
        H = 0;
      function makeStars(w, h, density) {
        const count = Math.min(900, Math.round(w * h * density));
        const arr = new Array(count);
        for (let i = 0; i < count; i++) {
          arr[i] = {
            x: Math.random() * w,
            y: Math.random() * h,
            r: (Math.random() * 1.2 + 0.4) * DPR,
            a: 0.25 + Math.random() * 0.45,
            tint: Math.random() < 0.25 ? 'blue' : 'white'
          };
        }
        return arr;
      }
      function resize() {
        const rect = cyContainer.getBoundingClientRect();
        W = Math.max(1, Math.floor(rect.width * DPR));
        H = Math.max(1, Math.floor(rect.height * DPR));
        star.width = W;
        star.height = H;
        star.style.width = rect.width + 'px';
        star.style.height = rect.height + 'px';
        const density = document.documentElement.classList.contains('dark') ? 0.00012 : 0.00006;
        stars = makeStars(W, H, density);
        draw(0, 0);
      }
      function draw(panX, panY) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = COL.bg;
        ctx.fillRect(0, 0, W, H);

        const ox = (panX || 0) * DPR * 0.05;
        const oy = (panY || 0) * DPR * 0.05;

        for (const s of stars) {
          let x = (s.x + ox) % W;
          if (x < 0) x += W;
          let y = (s.y + oy) % H;
          if (y < 0) y += H;
          ctx.beginPath();
          ctx.fillStyle = s.tint === 'blue' ? COL.blue : COL.white;
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 4 * DPR;
          ctx.globalAlpha = s.a;
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      const redraw = () => {
        const p = cy.pan();
        draw(p.x, p.y);
      };
      cy.on('pan zoom', redraw);
      window.addEventListener('resize', resize);
      window.__refreshStarfieldTheme = () => {
        COL = themeColors();
        resize();
      };
      resize();
    } catch (e) {
      console.warn('Starfield init failed:', e);
    }
  })();
  // =========================
  // END VIEW ADD: STARFIELD
  // =========================

  // ---------- camera helpers ----------
  function computeFitViewport(cy, eles, pad = 30) {
    if (!eles || eles.length === 0) return null;
    const bb = eles.boundingBox();
    const w = cy.width(),
      h = cy.height();
    const sx = (w - pad * 2) / Math.max(bb.w, 1);
    const sy = (h - pad * 2) / Math.max(bb.h, 1);
    const zoom = Math.min(sx, sy);
    const cx = (bb.x1 + bb.x2) / 2,
      cyy = (bb.y1 + bb.y2) / 2;
    return { zoom, pan: { x: w / 2 - cx * zoom, y: h / 2 - cyy * zoom } };
  }
  function smoothFit(cy, eles, duration = 450) {
    const vp = computeFitViewport(cy, eles);
    if (!vp) return;
    cy.animate({ fit: { eles, padding: 30 } }, { duration, easing: 'ease' });
    setTimeout(() => cy.viewport(vp), duration + 10);
  }

  // ---------- data + tiers ----------
  let currentView = 'universe'; // 'universe' | 'grid' | {type:'orbit', focusId:'...'}
  let lastHighLevel = 'universe';
  const savedCameras = {}; // { universe: {zoom,pan}, grid: {…} }
  const orbitPath = [];
  let hasActiveFilter = false;
  let orbitPrevVisibleIds = null;

  const USE_GENERATOR = false;
  let nodes = [],
    edges = [];
  if (USE_GENERATOR && window.DirectoryGenerator?.make) {
    const gen = window.DirectoryGenerator.make(150);
    nodes = gen.nodes || [];
    edges = gen.edges || [];
  } else if (window.Directory) {
    nodes = window.Directory.nodes || [];
    edges = window.Directory.edges || [];
  }
  cy.add(nodes);
  cy.add(edges);

  function massOf(n) {
    const v = Number(n.data('valuation_usd') || n.data('market_cap_usd') || 0);
    return isNaN(v) ? 0 : v;
  }
  function recomputeTiers() {
    const arr = cy
      .nodes()
      .toArray()
      .sort((a, b) => massOf(b) - massOf(a));
    const n = arr.length;
    const sunsCount = Math.min(Math.max(8, Math.round(n * 0.06)), 24);
    const planetsCount = Math.min(Math.max(20, Math.round(n * 0.15)), 160);
    arr.forEach((el, i) => {
      let tier = 'moon';
      if (i < sunsCount) tier = 'sun';
      else if (i < sunsCount + planetsCount) tier = 'planet';
      el.data('auto_tier', tier);
    });
    cy.nodes().forEach((nd) => {
      const t = nd.data('override_tier') || nd.data('auto_tier');
      let size = 7.2;
      if (t === 'sun') size = 21.6;
      else if (t === 'planet') size = 12;
      nd.style('width', size);
      nd.style('height', size);
    });
  }
  recomputeTiers();

  const tierOf = (n) => n.data('override_tier') || n.data('auto_tier') || '';
  const isSun = (n) => tierOf(n) === 'sun';
  const isPlanet = (n) => tierOf(n) === 'planet';
  const isMoon = (n) => tierOf(n) === 'moon';
  const parentIdOf = (n) => n.data('parent_id') || null;
  const hasChildren = (id) => cy.nodes().some((x) => (x.data('parent_id') || '') === id);
  const childrenOf = (id) => cy.nodes().filter((x) => (x.data('parent_id') || '') === id);

  // ---------- drawer ----------
  const drawer =
    document.querySelector('info-drawer') ||
    (() => {
      const el = document.createElement('info-drawer');
      document.body.appendChild(el);
      return el;
    })();

  // ---------- microcard ----------
  const micro = document.createElement('div');
  micro.style.cssText = `
    position:absolute; pointer-events:auto; z-index:5;
    left:0; top:0; transform:translate(-9999px,-9999px);
    border-radius:12px; padding:10px 12px; font:12px/1.25 system-ui;
    box-shadow:0 8px 24px rgba(0,0,0,.14); max-width:260px
  `;
  cyContainer.appendChild(micro);
  let microNodeId = null;

  const isDark = () => document.documentElement.classList.contains('dark');
  function applyMicroStyle() {
    micro.style.background = isDark() ? 'rgba(17,24,39,.96)' : '#ffffff';
    micro.style.color = isDark() ? '#e5e7eb' : '#111827';
    micro.style.border = isDark()
      ? '1px solid rgba(255,255,255,.08)'
      : '1px solid rgba(0,0,0,.08)';
    micro.style.boxShadow = isDark()
      ? '0 12px 28px rgba(0,0,0,.45)'
      : '0 8px 24px rgba(0,0,0,.12)';
  }
  applyMicroStyle();
  window.__applyMicroStyle = applyMicroStyle;

  function anchorPos(node) {
    const rp = node.renderedPosition();
    const rect = cyContainer.getBoundingClientRect();
    const pad = 8;
    const x = Math.max(pad, Math.min(rp.x, rect.width - pad));
    const y = Math.max(pad, Math.min(rp.y, rect.height - pad));
    return { x, y };
  }

  function renderMicrocard(node) {
    applyMicroStyle();
    const d = node.data();
    const canExplore = hasChildren(node.id());

    const favicon = d.favicon || '';
    const name = d.name || '';
    const bucket = d.bucket_label || '';

    micro.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div style="font-weight:700;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${name}
        </div>
        <div>
          ${
            favicon
              ? `<img src="${favicon}" alt="${name} favicon" width="20" height="20"
                 style="width:20px;height:20px;border-radius:50%;object-fit:cover;"
                 onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><circle cx=%2210%22 cy=%2210%22 r=%2210%22 fill=%22%23CBD5E1%22/></svg>';" />`
              : `<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#CBD5E1;"></span>`
          }
        </div>
      </div>

      <div style="opacity:.8;font-size:11px;margin-bottom:8px">${bucket}</div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${
          canExplore
            ? `<button id="btn-explore" style="padding:6px 10px;border-radius:8px;background:#2563eb;color:#fff;border:none">Explore 🪐</button>`
            : ``
        }
        <button id="btn-more" style="padding:6px 10px;border-radius:8px;background:#10b981;color:#0b1;border:none">More 📄</button>
      </div>
    `;

    micro.querySelector('#btn-more')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof drawer.update === 'function') {
        drawer.update(d);
      }
      drawer.open = true;
    });

    micro.querySelector('#btn-explore')?.addEventListener('click', (e) => {
      e.stopPropagation();

      // extra safety: only call if everything we need exists
      const focusId = node && typeof node.id === 'function' ? node.id() : null;
      if (!focusId) return;

      if (typeof promoteToOrbit === 'function') {
        promoteToOrbit(focusId);
      }
    });

    const p = anchorPos(node);
    micro.style.transform = `translate(${p.x + 10}px, ${p.y - 12}px)`;
    microNodeId = node.id();
  }

  function hideMicro() {
    micro.style.transform = 'translate(-9999px,-9999px)';
    microNodeId = null;
  }
  cy.on('pan zoom', hideMicro);
  cy.on('tap', (e) => {
    if (e.target === cy) hideMicro();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (microNodeId) hideMicro();
      else if (isInOrbit()) exitOrbit();
    }
  });

  // ---------- breadcrumb ----------
  const crumb = document.createElement('div');
  crumb.style.cssText = `
    position:absolute; left:8px; top:8px; z-index:6;
    display:none; gap:6px; align-items:center; flex-wrap:wrap;
    font:12px/1.2 system-ui; background:rgba(17,24,39,.5);
    color:#e5e7eb; padding:4px 8px; border-radius:999px; border:1px solid rgba(255,255,255,.12)
  `;
  cyContainer.appendChild(crumb);

  const orbitClose = document.createElement('button');
  orbitClose.textContent = 'Close';
  orbitClose.style.cssText = `
    position:absolute; right:8px; top:8px; z-index:6;
    display:none; padding:4px 10px; border-radius:999px;
    background:#111827; color:#e5e7eb; border:1px solid rgba(255,255,255,.15);
    font:12px/1.2 system-ui; cursor:pointer
  `;
  orbitClose.addEventListener('click', () => exitOrbit());
  cyContainer.appendChild(orbitClose);

  function updateBreadcrumb() {
    if (!isInOrbit()) {
      crumb.style.display = 'none';
      crumb.innerHTML = '';
      orbitClose.style.display = 'none';
      return;
    }
    const names = orbitPath.map((id) => cy.getElementById(id).data('name') || '…');
    crumb.innerHTML = names
      .map(
        (nm, i) =>
          `<a data-i="${i}" style="cursor:pointer;text-decoration:none;color:#e5e7eb">${nm}</a>`
      )
      .join('<span style="opacity:.6;margin:0 4px">›</span>');
    crumb.style.display = 'flex';
    orbitClose.style.display = 'inline-block';
    [...crumb.querySelectorAll('a')].forEach((a) => {
      a.addEventListener('click', () => {
        const idx = Number(a.getAttribute('data-i'));
        const targetId = orbitPath[idx];
        orbitPath.splice(idx + 1);
        enterOrbit(targetId, { keepPath: true });
      });
    });
  }

  // ---------- views ----------
  function applyUniverse() {
  cy.nodes().removeClass('grid-colored');  // keep grid styles out of Universe

  const visible = cy.nodes(':visible');

  if (hasActiveFilter) {
    // Filtered Universe: labels on for all, compact polyhedron layout
    visible.forEach((n) => {
      n.style('label', n.data('name') || '');
    });
    applyPolyhedronLayout(visible);
  } else {
    // Baseline Universe: only Foundation Models have persistent labels
    visible.forEach((n) => {
  // bucket might be "foundation_models" or similar
  const rawBucket =
    (n.data('bucket') || n.data('bucket_slug') || '')
      .toString()
      .toLowerCase();

  const isFoundationBucket =
    rawBucket.includes('foundation'); // catches "foundation_models", "foundation-models", etc.

  const isFoundationSun = isSun(n) && isFoundationBucket;

  // Only foundation suns get their name as a base label
  n.style('label', isFoundationSun ? (n.data('name') || '') : '');
});

    const suns = visible.filter((n) => isSun(n)).toArray();
    const planets = visible.filter((n) => isPlanet(n)).toArray();
    const moons = visible.filter((n) => isMoon(n)).toArray();

    const planetsBySun = {};
    suns.forEach((s) => {
      planetsBySun[s.id()] = planets.filter((p) => parentIdOf(p) === s.id());
    });

    const moonsByPlanet = {};
    planets.forEach((p) => {
      moonsByPlanet[p.id()] = moons.filter((m) => parentIdOf(m) === p.id());
    });

    let positions = {};
    if (window.Views && typeof Views.placeUniverse === 'function') {
      // This now uses your NEW ring-based Universe layout
      positions = Views.placeUniverse(cy, suns, planetsBySun, moonsByPlanet, {});
    }

    cy.layout({
      name: 'preset',
      positions: (node) => positions[node.id()] || node.position(),
      fit: false,
      animate: false
    }).run();

    const set = cy.collection(visible);
    if (set.size()) {
      cy.animate(
        { fit: { eles: set, padding: 70 } },
        { duration: 350 }
      );
    }
  }

  // Edges:
  // - full Universe: edges ON
  // - filtered/polyhedron: edges OFF
  cy.edges().style('display', hasActiveFilter ? 'none' : 'element');

  crumb.style.display = 'none';
  orbitClose.style.display = 'none';
}

  function applyGrid() {
    cy.stop(true);

    // Grid view presentation:
    // - labels always on
    // - neutral fill from skin
    // - bucket-coloured outline always on
    cy.nodes().removeClass('grid-colored'); // Clear any polyhedron/grid flags carried over from Universe
    cy.nodes().removeClass('filtered');

    const visible = cy.nodes(':visible');

    visible.forEach((node) => {
      node.style('label', node.data('name') || '');

      const bucketColor = node.data('bucket_color');
      if (bucketColor) {
        node.style('border-color', bucketColor);
      } else {
        // fall back to whatever the base skin uses
        node.style('border-color', undefined);
      }
    });

    const suns = visible.filter(isSun);
    const planets = visible.filter(isPlanet);
    const moons = visible.filter(isMoon);
    const rest = visible.difference(suns).difference(planets).difference(moons);
    const ordered = suns.union(planets).union(moons).union(rest).toArray();

    const gp = window.Layouts?.gridPositions;
    if (!gp) return console.error('gridPositions missing');

    const pos = gp(ordered, {
      cols: 6,
      gapX: 168,
      gapY: 128,
      startX: 40,
      startY: 40
    });

    cy.layout({
      name: 'preset',
      positions: (node) => pos[node.id()],
      fit: false,
      animate: false
    }).run();

    const set = cy.collection(visible);
    if (set.size()) {
      const bb = set.boundingBox();
      const w = cy.width();
      const centerX = (bb.x1 + bb.x2) / 2;
      cy.viewport({
        zoom: 1,
        pan: {
          x: w / 2 - centerX,
          y: 0
        }
      });
    } else {
      cy.viewport({ zoom: 1, pan: { x: 0, y: 0 } });
    }

    // Grid = nodes only, no edges
    cy.edges().style('display', 'none');

    crumb.style.display = 'none';
    orbitClose.style.display = 'none';
  }

  // ---------- orbit ----------
  function isInOrbit() {
    return typeof currentView === 'object' && currentView?.type === 'orbit';
  }
  function orbitEles(focusId) {
    return { center: cy.getElementById(focusId), children: childrenOf(focusId) };
  }

  function enterOrbit(focusId, opts = {}) {
    // snapshot camera + visible nodes only when first entering orbit
    if (!isInOrbit()) {
      savedCameras[lastHighLevel] = { zoom: cy.zoom(), pan: cy.pan() };
      if (!hasActiveFilter) {
        orbitPrevVisibleIds = cy.nodes(':visible').map((n) => n.id());
      } else {
        orbitPrevVisibleIds = null;
      }
    }
    currentView = { type: 'orbit', focusId };
    hideMicro();

    if (!opts.keepPath) {
      const idx = orbitPath.indexOf(focusId);
      if (idx >= 0) orbitPath.splice(idx + 1);
      else orbitPath.push(focusId);
    }

    const { center, children } = orbitEles(focusId);
    cy.startBatch();
    cy.nodes().style('display', 'none');
    center.style('display', 'element');
    children.style('display', 'element');
    cy.edges().style('display', 'none');
    cy.endBatch();

    const map = Views.placeOrbital(center, children.toArray(), { tiltDeg: 22, radius: 260 });
    cy.layout({
      name: 'preset',
      positions: (node) => map[node.id()],
      fit: false,
      animate: false
    }).run();
    smoothFit(cy, center.union(children));
    updateBreadcrumb();
  }
    function promoteToOrbit(focusId) {
    if (!focusId) return;
    enterOrbit(focusId);
  }

  function exitOrbit() {
    if (!isInOrbit()) return;
    hideMicro();
    orbitPath.pop();
    if (orbitPath.length) {
      enterOrbit(orbitPath[orbitPath.length - 1], { keepPath: true });
    } else {
      // final exit → restore previously visible nodes if no filters were active
      if (!hasActiveFilter && orbitPrevVisibleIds && orbitPrevVisibleIds.length) {
        cy.startBatch();
        const idSet = new Set(orbitPrevVisibleIds);
        cy.nodes().forEach((n) => {
          n.style('display', idSet.has(n.id()) ? 'element' : 'none');
        });
        cy.endBatch();
      }
      orbitPrevVisibleIds = null;

      currentView = lastHighLevel;
      applyMode();
      const cam = savedCameras[lastHighLevel];
      if (cam) cy.viewport(cam);
    }
  }

  // ---------- mode switching ----------
  function applyMode() {
    hideMicro();
    if (currentView === 'universe') {
      lastHighLevel = 'universe';
      orbitPath.length = 0;
      applyUniverse();
    } else if (currentView === 'grid') {
      lastHighLevel = 'grid';
      orbitPath.length = 0;
      applyGrid();
    } else if (isInOrbit()) {
      enterOrbit(currentView.focusId, { keepPath: true });
    }
  }
  document.addEventListener('mode-changed', (e) => {
    const m = e.detail?.mode || 'universe';
    currentView = m;
    applyMode();
  });

// Compact “polyhedron” layout for filtered views.
// Shape adapts to node count: 1 centre, then 1–N concentric rings.
function applyPolyhedronLayout(activeNodes) {
  const collection =
    activeNodes && typeof activeNodes.size === 'function'
      ? activeNodes
      : cy.nodes(':visible');

  if (!collection || collection.size() === 0) return;

  const nodes = collection.toArray();
  const count = nodes.length;

  const w = cy.width();
  const h = cy.height();
  const cx = w / 2;
  const cyy = h / 2;
  const minDim = Math.min(w, h);

  const baseRadius = minDim * 0.16;
  const ringGap    = minDim * 0.16;

  // Decide how many rings & how many nodes per ring
  const rings = [];

  if (count === 1) {
    rings.push({ count: 1, radius: 0 });
  } else {
    let remaining = count;
    let ringIndex = 0;

    while (remaining > 0) {
      // Inner ring small, outer rings can host more nodes
      const cap =
        ringIndex === 0
          ? 6                 // up to 6 on the first ring
          : 6 + ringIndex * 6; // 12, 18, ... as we go outwards

      const num = Math.min(remaining, cap);
      rings.push({
        count: num,
        radius: baseRadius + ringGap * ringIndex
      });

      remaining -= num;
      ringIndex++;
    }
  }

  // Assign positions
  const positions = {};
  let idx = 0;

  rings.forEach((ring, ringIndex) => {
    // Single-node centre
    if (ring.radius === 0) {
      const n = nodes[idx++];
      if (!n) return;
      positions[n.id()] = { x: cx, y: cyy };
      return;
    }

    const step  = (Math.PI * 2) / ring.count;
    const phase = ringIndex % 2 === 0 ? 0 : step / 2; // stagger rings a bit

    for (let i = 0; i < ring.count; i++) {
      const n = nodes[idx++];
      if (!n) break;

      const angle = phase + step * i;
      positions[n.id()] = {
        x: cx + ring.radius * Math.cos(angle),
        y: cyy + ring.radius * Math.sin(angle)
      };
    }
  });

  // Apply positions without touching labels/colours/edges
  cy.layout({
    name: 'preset',
    positions: (node) => positions[node.id()] || node.position(),
    fit: false,
    animate: false
  }).run();

  // Then gently fit camera around the constellation
  cy.animate(
    { fit: { eles: collection, padding: 80 } },
    { duration: 450, easing: 'ease' }
  );
}

  // ---------- Sidebar → Filters + Search ----------
  document.addEventListener('filters-changed', (e) => {
    const { categories = [], search = '' } = e.detail || {};
    applyFilters({ categories, search });

    // After filtering, if we're in Universe with an active filter,
    // reshape the visible nodes into a compact “polyhedron” layout.
    const q = (search || '').trim();
    const hasFilter = (categories && categories.length > 0) || q !== '';

    if (currentView === 'universe' && hasFilter && !isInOrbit()) {
      const visible = cy.nodes(':visible');
      applyPolyhedronLayout(visible);
    }
  });
  // Show/hide by bucket + name; re-run current layout (preserv

  function applyFilters({ categories = [], search = '' } = {}) {
    const q = (search || '').trim().toLowerCase();
    const allNodes = cy.nodes();
    const allEdges = cy.edges();
    const hasCat = categories && categories.length > 0;
    const hasText = q !== '';
    hasActiveFilter = hasCat || hasText;

    // No filters → full universe
    if (!hasActiveFilter) {
      cy.startBatch();
      allNodes.style('display', 'element');
      allNodes.removeClass('filtered');  // clear polyhedron flag
      allEdges.style('display', 'element');
      cy.endBatch();

      if (isInOrbit()) {
        exitOrbit();
      } else {
        applyMode();
      }
      return;
    }

    // Some filter active → polyhedron mode
    cy.startBatch();
    allNodes.style('display', 'none');
    allNodes.removeClass('filtered');

    const active = allNodes.filter((n) => {
      const bucket = String(n.data('bucket') || '').toLowerCase();
      const name = String(n.data('name') || '').toLowerCase();
      const okBucket = !hasCat || categories.includes(bucket);
      const okText = !hasText || name.includes(q);
      return okBucket && okText;
    });

    active.style('display', 'element');
    active.addClass('filtered');       // used by skin for bucket ring/fill
    allEdges.style('display', 'none'); // polyhedron = nodes only
    cy.endBatch();

    if (isInOrbit()) {
      // we don't want to stay in orbit when filtering
      exitOrbit();
    }

    applyMode();
  }

  // ---------- click behavior ----------
  cy.on('tap', 'node', (evt) => {
    const n = evt.target;
    const d = n.data();
    d.url = d.url || '';
    d.favicon = d.favicon || '';

    if (currentView === 'grid') {
      renderMicrocard(n);
      return;
    }

    if (!isInOrbit() && currentView === 'universe') {
      renderMicrocard(n);
      return;
    }

    if (isInOrbit()) {
      const { center, children } = orbitEles(currentView.focusId);
      if (n.id() === center.id() || children.some((x) => x.id() === n.id())) {
        renderMicrocard(n);
      }
    }
  });

  // ---------- hover highlight ----------
  let highlightedNode = null;

  function resetNodeHighlight(n) {
    if (!n) return;
    if (typeof n.removed === 'function' && n.removed()) return;

    n.removeClass('hovered');

    if (currentView === 'universe') {
      if (hasActiveFilter) {
        // Polyhedron: labels always on when filtered
        n.style('label', n.data('name') || '');
      } else {
        const bucket = String(n.data('bucket') || '').toLowerCase();
        const isFoundation = bucket === 'foundation_models';
        n.style('label', isFoundation ? (n.data('name') || '') : '');
      }
    } else if (currentView === 'grid') {
      // In grid, labels are always on
      n.style('label', n.data('name') || '');
    } else {
      // Orbit and any other views can clear label on mouse out
      n.style('label', undefined);
    }
  }

  cy.on('mouseover', 'node', (evt) => {
    const n = evt.target;

    if (highlightedNode && highlightedNode.id() !== n.id()) {
      resetNodeHighlight(highlightedNode);
    }
    highlightedNode = n;

    n.addClass('hovered');
    n.style('label', n.data('name') || '');
  });

  cy.on('mouseout', 'node', (evt) => {
    const n = evt.target;
    resetNodeHighlight(n);
    if (highlightedNode && highlightedNode.id() === n.id()) {
      highlightedNode = null;
    }
  });

  // ---------- init + secondary recenter ----------
  applyMode();

  setTimeout(() => {
    if (currentView === 'universe' && !isInOrbit()) {
      const visible = cy.nodes(':visible');
      if (visible.size()) {
        if (window.Views && Views.smartFit) {
          Views.smartFit(cy, visible, 70);
        } else {
          cy.fit(visible, 70);
        }
      }
    }
  }, 650);
});