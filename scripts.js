// scripts.js
// Artiligenz Live Directory — App Orchestrator (data + views + interactions)

(function () {
  let cy = null;
  let currentView = 'universe';
  let orbitState = {
    active: false,
    fromNodeId: null,
    sunId: null,
    pan: null,
    zoom: null,
    hiddenIds: [],
    prevView: 'universe', // ✅ ADDED: remember where orbit was launched from
  };

  // B) Add filter state (near top)
  let filterState = { categories: [], search: '' };
  let hasActiveFilter = false;

  function isSunNode(node) {
    try { return node && typeof node.id === 'function' && String(node.id()).startsWith('parent:'); }
    catch { return false; }
  }

  function resolveSun(node) {
    if (!node || !cy) return null;
    if (isSunNode(node)) return node;
    const pid = node.data && node.data('parent_id');
    if (pid) {
      const sun = cy.getElementById(pid);
      if (sun && sun.nonempty && typeof sun.nonempty === 'function') {
        return sun.nonempty() ? sun : null;
      }
      return sun && sun.length ? sun : null;
    }
    return null;
  }

  function getOrbitChildren(sun) {
    if (!sun || !cy) return [];
    const sid = typeof sun.id === 'function' ? sun.id() : null;
    if (!sid) return [];
    return cy.nodes().filter(n => n.data('parent_id') === sid).toArray();
  }

  function ensureOrbitUi() {
    const host = cy?.container?.();
    if (!host) return;
    host.style.position = host.style.position || 'relative';

    // Breadcrumb pill (top-left)
    let crumb = host.querySelector('[data-orbit-crumb]');
    if (!crumb) {
      crumb = document.createElement('div');
      crumb.setAttribute('data-orbit-crumb', '1');
      crumb.style.position = 'absolute';
      crumb.style.top = '12px';
      crumb.style.left = '12px';
      crumb.style.zIndex = '40';
      crumb.style.padding = '6px 10px';
      crumb.style.borderRadius = '999px';
      crumb.style.fontSize = '12px';
      crumb.style.fontWeight = '600';
      crumb.style.background = 'rgba(15,23,42,0.72)';
      crumb.style.color = '#e2e8f0';
      crumb.style.border = '1px solid rgba(148,163,184,0.35)';
      crumb.style.backdropFilter = 'blur(10px)';
      crumb.style.webkitBackdropFilter = 'blur(10px)';
      host.appendChild(crumb);
    }

    // Close button (top-right)
    let btn = host.querySelector('[data-orbit-close]');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-orbit-close', '1');
      btn.textContent = 'Close';
      btn.style.position = 'absolute';
      btn.style.top = '12px';
      btn.style.right = '12px';
      btn.style.zIndex = '40';
      btn.style.padding = '6px 12px';
      btn.style.borderRadius = '999px';
      btn.style.fontSize = '12px';
      btn.style.fontWeight = '600';
      btn.style.background = 'rgba(15,23,42,0.82)';
      btn.style.color = '#e2e8f0';
      btn.style.border = '1px solid rgba(148,163,184,0.35)';
      btn.style.cursor = 'pointer';
      btn.style.backdropFilter = 'blur(10px)';
      btn.style.webkitBackdropFilter = 'blur(10px)';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        exitOrbit();
      });
      host.appendChild(btn);
    }
  }

  function setOrbitUiVisible(visible, sunName = '') {
    const host = cy?.container?.();
    if (!host) return;
    const crumb = host.querySelector('[data-orbit-crumb]');
    const btn = host.querySelector('[data-orbit-close]');
    if (crumb) {
      crumb.style.display = visible ? 'block' : 'none';
      crumb.textContent = visible ? sunName : '';
    }
    if (btn) btn.style.display = visible ? 'block' : 'none';
  }

  // --- ORBIT LABELS (Orbit-only) ---
  function ensureOrbitLabelStyle() {
    if (!cy) return;

    // Add an orbit-only selector without changing base styling
    cy.style()
      .selector('.orbitLabel')
      .style({
        'label': (ele) => {
          return ele.data('name') || ele.data('label') || ele.id();
        },
        'text-wrap': 'wrap',
        'text-max-width': 180,
        'font-size': 14,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-outline-width': 4,
        'text-outline-color': 'rgba(2, 6, 23, 0.90)',
        'color': '#e2e8f0'
      })
      .update();
  }

  function enterOrbit(fromNode) {
    if (!cy || !window.Views || typeof window.Views.placeOrbital !== 'function') return;

    const sun = resolveSun(fromNode);
    if (!sun) {
      console.warn('[Artiligenz] Orbit unavailable: no parent sun resolved');
      return;
    }

    const children = getOrbitChildren(sun);
    if (!children.length) {
      console.warn('[Artiligenz] Orbit unavailable: sun has no children');
      return;
    }

    // ✅ ADDED: remember where we came from (grid or universe)
    orbitState.prevView = currentView;

    // Save state for return
    orbitState.active = true;
    orbitState.fromNodeId = typeof fromNode.id === 'function' ? fromNode.id() : null;
    orbitState.sunId = typeof sun.id === 'function' ? sun.id() : null;
    orbitState.pan = cy.pan();
    orbitState.zoom = cy.zoom();

    currentView = 'orbit';

    // Hide everything outside this orbit set (nodes + edges among them)
    const orbitNodes = cy.collection([sun, ...children]);
    const orbitEdges = cy.edges().filter(e => orbitNodes.contains(e.source()) && orbitNodes.contains(e.target()));
    const keep = orbitNodes.union(orbitEdges);
    const hide = cy.elements().difference(keep);

    orbitState.hiddenIds = hide.map(el => el.id());

    hide.forEach(el => el.style('display', 'none'));
    keep.forEach(el => el.style('display', 'element'));

    // Apply orbit-only labels (sun + children)
    ensureOrbitLabelStyle();
    orbitNodes.addClass('orbitLabel');

    // Layout positions (V1 behavior) — now ellipse-capable via orbitalview opts
    const positions = window.Views.placeOrbital(sun, children, { ellipseRatio: 0.65 });
    if (positions) {
      if (positions[sun.id()]) sun.position(positions[sun.id()]);
      children.forEach(ch => {
        const p = positions[ch.id()];
        if (p) ch.position(p);
      });
    }

    // Fit view to orbit set
    if (typeof window.Views.smartFit === 'function') {
      window.Views.smartFit(cy, keep, 80);
    }

    ensureOrbitUi();
    setOrbitUiVisible(true, sun.data('name') || sun.data('label') || sun.id());
  }

  function exitOrbit() {
    if (!cy || !orbitState.active) return;

    // Remove orbit-only labels
    cy.nodes().removeClass('orbitLabel');

    // Restore hidden elements (bring everything back)
    if (orbitState.hiddenIds && orbitState.hiddenIds.length) {
      orbitState.hiddenIds.forEach(id => {
        const el = cy.getElementById(id);
        if (el && el.length) el.style('display', 'element');
      });
    }

    // Hide orbit UI
    setOrbitUiVisible(false);

    // ✅ CHANGED: return to the view that launched orbit
    const backTo = orbitState.prevView || 'universe';

    // Clear orbit state (keep pan/zoom until after view restore below)
    const savedPan = orbitState.pan;
    const savedZoom = orbitState.zoom;
    const savedFrom = orbitState.fromNodeId;

    orbitState.active = false;
    orbitState.fromNodeId = null;
    orbitState.sunId = null;
    orbitState.pan = null;
    orbitState.zoom = null;
    orbitState.hiddenIds = [];

    currentView = 'universe';

    // Universe: restore default layout + camera

      // Universe: restore default layout + camera
      if (window.Views && typeof window.Views.placeUniverse === 'function') {
        window.Views.placeUniverse(cy);
        window.Views.smartFit?.(cy, cy.elements());
      if (savedPan) cy.pan(savedPan);
      if (typeof savedZoom === 'number') cy.zoom(savedZoom);
    }

    // Reselect original node (best-effort)
    if (savedFrom) {
      const n = cy.getElementById(savedFrom);
      if (n && n.length) n.select();
    }
  }

  // -----------------------------
  // Element normalization
  // -----------------------------
  function isCytoscapeElement(el) {
    return el && typeof el === 'object' && 'data' in el;
  }

  function normalizeNodeData(raw, fallbackIdPrefix = 'node') {
    const d = raw && raw.data ? raw.data : raw;
    const id =
      (d && (d.id || d.ID || d._id)) ||
      `${fallbackIdPrefix}:${Math.random().toString(36).slice(2, 9)}`;

    return {
      data: {
        id: String(id),
        ...d,
        id: String(id),
      },
    };
  }

  function normalizeEdgeData(raw, idx = 0) {
    const d = raw && raw.data ? raw.data : raw;

    const source = d && (d.source || d.from);
    const target = d && (d.target || d.to);

    if (!source || !target) return null;

    const id = (d && d.id) || `edge:${source}->${target}:${idx}`;

    return {
      data: {
        id: String(id),
        source: String(source),
        target: String(target),
        ...d,
        id: String(id),
        source: String(source),
        target: String(target),
      },
    };
  }

  function normalizeElements(nodesRaw, edgesRaw) {
    const nodes = (nodesRaw || [])
      .map((n) => normalizeNodeData(n, 'node'))
      .filter(Boolean);

    const edges = (edgesRaw || [])
      .map((e, i) => normalizeEdgeData(e, i))
      .filter(Boolean);

    return { nodes, edges };
  }

  function getDirectoryData() {
    // Primary: window.Directory with {nodes, edges}
    if (window.Directory && Array.isArray(window.Directory.nodes)) {
      const edgesRaw = Array.isArray(window.Directory.edges)
        ? window.Directory.edges
        : (window.Directory.links || []);
      return normalizeElements(window.Directory.nodes, edgesRaw);
    }

    // If a single mixed array exists (legacy)
    if (Array.isArray(window.Directory)) {
      const mixed = window.Directory;
      const already = mixed.every(isCytoscapeElement);
      if (already) {
        // Try to split by edge signature
        const nodes = mixed.filter((el) => !el.data || (!el.data.source && !el.data.target));
        const edges = mixed.filter((el) => el.data && el.data.source && el.data.target);
        return { nodes, edges };
      }

      // If raw mixed, best-effort: classify by presence of source/target
      const nodes = [];
      const edges = [];
      for (const el of mixed) {
        if (el && (el.source || el.target || el.from || el.to)) edges.push(el);
        else nodes.push(el);
      }
      return normalizeElements(nodes, edges);
    }

    // Some builds used window.DirectoryData
    if (Array.isArray(window.DirectoryData)) {
      const mixed = window.DirectoryData;
      const already = mixed.every(isCytoscapeElement);
      if (already) {
        const nodes = mixed.filter((el) => !el.data || (!el.data.source && !el.data.target));
        const edges = mixed.filter((el) => el.data && el.data.source && el.data.target);
        return { nodes, edges };
      }
      const nodes = [];
      const edges = [];
      for (const el of mixed) {
        if (el && (el.source || el.target || el.from || el.to)) edges.push(el);
        else nodes.push(el);
      }
      return normalizeElements(nodes, edges);
    }

    console.warn('[Artiligenz] No directory data found on window.Directory / window.DirectoryData');
    return { nodes: [], edges: [] };
  }

  // -----------------------------
  // Cytoscape init
  // -----------------------------
  function initCytoscape() {
    const { nodes, edges } = getDirectoryData();

    if (!nodes.length) {
      console.warn('[Artiligenz] No nodes found. Check your data files are loaded.');
    }

    cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#38bdf8',
            'label': '',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 12,
            'width': 30,
            'height': 30,
          },
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#cbd5e1',
            'width': 1,
            'curve-style': 'haystack',
            'opacity': 0.55,
          },
        },
      ],
      layout: { name: 'preset' },
      wheelSensitivity: 0.2,
    });

    // Expose for debugging
    window.__cy = cy;

    // ✅ Ensure theme skin is applied after Cytoscape exists
    window.Skin?.apply?.(cy);

    // Initial view
    if (window.Views && typeof window.Views.placeUniverse === 'function') {
      window.Views.placeUniverse(cy);
      if (typeof window.Views.smartFit === 'function') {
        window.Views.smartFit(cy, cy.elements());
      }
    }

    return cy;
  }

  // -----------------------------
  // Filter application
  // -----------------------------
  function applyFilters() {
    if (!cy) return;

    const activeNodes = cy.nodes().filter((n) => {
      const name = String(n.data('name') || '').toLowerCase();
      const bucket = String(n.data('bucket') || '').toLowerCase();

      const q = filterState.search.toLowerCase();
      const hasText = q && name.includes(q);
      const hasCat =
        filterState.categories.length === 0 ||
        filterState.categories.includes(bucket);

      return (!q || hasText) && hasCat;
    });

    // Hide everything else
    cy.startBatch();
    cy.edges().style('display', 'none');
    cy.nodes().style('display', 'none');
    activeNodes.style('display', 'element');
    cy.endBatch();

    // Apply polyhedron rule
    if (window.HedronLayout && typeof window.HedronLayout.apply === 'function') {
      window.HedronLayout.apply(cy, activeNodes.toArray());
    }

    hasActiveFilter = filterState.search || filterState.categories.length > 0;
  }

  // -----------------------------
  // View switch
  // -----------------------------
  function initViewControls() {
    const universeBtn = document.getElementById('btnUniverse');if (universeBtn) {
      universeBtn.addEventListener('click', () => setView('universe'));
    }
    window.setView = function (mode) {
      if (!cy) return;
      try {
        mode = (mode === 'universe') ? 'universe' : 'universe';
        currentView = mode;        // Exiting orbit if user changes mode
        if (orbitState.active && mode !== 'orbit') {
          exitOrbit();
        }

        // Clear filters when switching views
        if (mode === 'universe') {
          filterState = { categories: [], search: '' };
          hasActiveFilter = false;
          cy.elements().style('display', 'element');

          if (mode === 'universe') {
            window.Views.placeUniverse(cy);
            window.Views.smartFit?.(cy, cy.elements());
          }}
        // Orbit view removed - enter orbit only via Explore button
      } catch (e) {
        console.error('[Artiligenz] setView failed:', e);
      }
    };
  }

  // -----------------------------
  // Interactions
  // -----------------------------
  function initInteractions() {
    if (!cy) return;

    const isCoarsePointer =
      (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);

    function showNodeMicrocard(node) {
      if (!node) return;

      if (window.Microcard && typeof window.Microcard.show === 'function') {
        window.Microcard.show(node, {
          cy,
          container: cy.container(),
          onViewEcosystem: () => {
            enterOrbit(node);
          },
          onOpenProfile: () => {
            document.querySelector('info-drawer')?.update(node.data());
          }
        });
      }
    }

    function nearestNodeForRenderedPoint(rp, maxDistPx) {
      if (!rp) return null;
      let best = null;
      let bestD = Infinity;

      // Only consider visible nodes (prevents grabbing hidden orbit sets / filters)
      const nodes = cy.nodes().filter(n => n.style('display') !== 'none');

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const nrp = n.renderedPosition();
        const dx = nrp.x - rp.x;
        const dy = nrp.y - rp.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < bestD) {
          bestD = d;
          best = n;
        }
      }

      return bestD <= maxDistPx ? best : null;
    }

    // Node interaction (support both Cytoscape 'tap' and DOM-like 'click' for mobile/webview quirks)
    const onNodeActivate = (evt) => {
      const node = evt.target;
      showNodeMicrocard(node);
    };

    cy.on('tap', 'node', onNodeActivate);
    cy.on('click', 'node', onNodeActivate);

    // Background interaction → hide microcard (or, on mobile, pick nearest node if the tap missed)
    const onBgActivate = (evt) => {
      if (evt.target !== cy) return;

      // Mobile: nodes can be tiny when zoomed out; allow a small "tap slop" to select nearest node
      if (isCoarsePointer) {
        const rp = evt.renderedPosition;
        const picked = nearestNodeForRenderedPoint(rp, 34);
        if (picked) {
          showNodeMicrocard(picked);
          return;
        }
      }

      window.Microcard?.hide?.();
    };

    cy.on('tap', onBgActivate);
    cy.on('click', onBgActivate);

    // Pan / zoom → keep overlays in sync
    cy.on('pan zoom', () => {
      window.Microcard?.reposition?.();
      window.Starfield?.onViewportChange?.(cy);
    });

    // Escape → exit orbit (if active), else close microcard + drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (orbitState.active) {
          exitOrbit();
          return;
        }
        window.Microcard?.hide?.();
        document.querySelector('info-drawer')?.close?.();
      }
    });
  }


  // -----------------------------
  // Theme reactivity
  // -----------------------------
  function initThemeReactivity() {
    const observer = new MutationObserver(() => {
      try {
        window.Microcard?.refreshTheme?.();
        window.Skin?.apply?.(window.__cy || cy);
      } catch (_) {}
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  // -----------------------------
  // Boot
  // -----------------------------
  function boot() {
    initCytoscape();
    initViewControls();
    initInteractions();
    initThemeReactivity();

    // ✅ Sidebar → Orchestrator wiring
    document.addEventListener('filters-changed', (e) => {
      const { categories = [], search = '' } = e.detail || {};
      filterState = { categories, search };
      applyFilters();
    });

    document.addEventListener('mode-changed', (e) => {
      let mode = e.detail?.mode || 'universe';
      if (mode !== 'universe') mode = 'universe';
      // Sidebar already resets filters before mode switch
      window.setView?.(mode);
    });

    // Expose filter functions globally
    window.FilterManager = {
      updateSearch: function(search) {
        filterState.search = search;
        applyFilters();
      },
      updateCategories: function(categories) {
        filterState.categories = categories;
        applyFilters();
      },
      clearFilters: function() {
        filterState = { categories: [], search: '' };
        hasActiveFilter = false;
        cy.elements().style('display', 'element');
        if (currentView === 'universe') {
          window.Views.placeUniverse(cy);
          window.Views.smartFit?.(cy, cy.elements());
        }},
      getState: function() {
        return { ...filterState, hasActiveFilter };
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
