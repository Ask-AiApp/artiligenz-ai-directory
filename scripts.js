// scripts.js
// Artiligenz Live Directory — App Orchestrator (data + views + interactions)
// Belt & braces: never crash on bad edges, always build hierarchy edges from parent_id

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
    prevView: 'universe',
  };

  // Filters
  let filterState = { categories: [], search: '' };
  let hasActiveFilter = false;

  // -----------------------------
  // Universe baseline positions
  // - HedronLayout.apply() writes node positions (preset layout persists them)
  // - Snapshot initial "natural" universe ONCE, restore on return-to-universe
  // -----------------------------
  let universeBaselinePositions = null;

  function snapshotUniverseBaselinePositionsOnce() {
    if (!cy || universeBaselinePositions) return;
    universeBaselinePositions = {};
    try {
      cy.nodes().forEach((n) => {
        universeBaselinePositions[n.id()] = { ...n.position() };
      });
    } catch (e) {
      console.warn('[Artiligenz] snapshotUniverseBaselinePositionsOnce failed:', e);
      universeBaselinePositions = null;
    }
  }

  function restoreUniverseBaselinePositions() {
    if (!cy || !universeBaselinePositions) return;
    try {
      cy.startBatch();
      cy.nodes().forEach((n) => {
        const p = universeBaselinePositions[n.id()];
        if (p) n.position(p);
      });
      cy.endBatch();
    } catch (e) {
      console.warn('[Artiligenz] restoreUniverseBaselinePositions failed:', e);
    }
  }

  // -----------------------------
  // Orbit helpers
  // -----------------------------
  function isSunNode(node) {
    try {
      return node && typeof node.id === 'function' && String(node.id()).startsWith('parent:');
    } catch {
      return false;
    }
  }

  function resolveSun(node) {
    if (!node || !cy) return null;
    if (isSunNode(node)) return node;
    const pid = node.data && node.data('parent_id');
    if (pid) {
      const sun = cy.getElementById(pid);
      return sun && sun.length ? sun : null;
    }
    return null;
  }

  function getOrbitChildren(sun) {
    if (!sun || !cy) return [];
    const sid = typeof sun.id === 'function' ? sun.id() : null;
    if (!sid) return [];
    return cy.nodes().filter((n) => n.data('parent_id') === sid).toArray();
  }

  function ensureOrbitUi() {
    const host = cy?.container?.();
    if (!host) return;
    host.style.position = host.style.position || 'relative';

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

  function ensureOrbitLabelStyle() {
    if (!cy) return;
    cy.style()
      .selector('.orbitLabel')
      .style({
        label: (ele) => ele.data('name') || ele.data('label') || ele.id(),
        'text-wrap': 'wrap',
        'text-max-width': 180,
        'font-size': 12,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-outline-width': 1,
        'text-outline-color': 'rgba(2, 6, 23, 0.90)',
        color: '#e2e8f0',
      })
      .update();
  }

  // -----------------------------
  // Universe label policy (belt & braces)
  // - Universe (landing): only Suns (id starts with "parent:") show labels
  // - Everything else: leave unchanged (orbit uses .orbitLabel)
  // NOTE: Skin.apply() can override styles; call this AFTER Skin.apply().
  // -----------------------------
  function enforceUniverseLabelPolicy() {
    if (!cy) return;

    try {
      cy.style()
        .selector('node')
        .style({ label: '' })
        .selector('node[id ^= "parent:"]')
        .style({ label: 'data(name)' })
        .update();
    } catch (e) {
      // Never crash for styling issues
      console.warn('[Artiligenz] enforceUniverseLabelPolicy failed:', e);
    }
  }

  function enterOrbit(fromNode) {
    if (!cy || !window.Views || typeof window.Views.placeOrbital !== 'function') return false;

    const sun = resolveSun(fromNode);
    if (!sun) return false;

    const children = getOrbitChildren(sun);
    if (!children.length) return false;

    orbitState.prevView = currentView;

    orbitState.active = true;
    orbitState.fromNodeId = typeof fromNode.id === 'function' ? fromNode.id() : null;
    orbitState.sunId = typeof sun.id === 'function' ? sun.id() : null;
    orbitState.pan = cy.pan();
    orbitState.zoom = cy.zoom();

    currentView = 'orbit';

    const orbitNodes = cy.collection([sun, ...children]);
    const orbitEdges = cy
      .edges()
      .filter((e) => orbitNodes.contains(e.source()) && orbitNodes.contains(e.target()));
    const keep = orbitNodes.union(orbitEdges);
    const hide = cy.elements().difference(keep);

    orbitState.hiddenIds = hide.map((el) => el.id());

    hide.forEach((el) => el.style('display', 'none'));
    keep.forEach((el) => el.style('display', 'element'));

    ensureOrbitLabelStyle();
    orbitNodes.addClass('orbitLabel');

    const positions = window.Views.placeOrbital(sun, children, { ellipseRatio: 0.65 });
    if (positions) {
      if (positions[sun.id()]) sun.position(positions[sun.id()]);
      children.forEach((ch) => {
        const p = positions[ch.id()];
        if (p) ch.position(p);
      });
    }

    if (typeof window.Views.smartFit === 'function') {
      window.Views.smartFit(cy, keep, 80);
    }

    ensureOrbitUi();
    setOrbitUiVisible(true, sun.data('name') || sun.data('label') || sun.id());

    return true;
  }

  function exitOrbit() {
    if (!cy || !orbitState.active) return;

    cy.nodes().removeClass('orbitLabel');

    if (orbitState.hiddenIds && orbitState.hiddenIds.length) {
      orbitState.hiddenIds.forEach((id) => {
        const el = cy.getElementById(id);
        if (el && el.length) el.style('display', 'element');
      });
    }

    setOrbitUiVisible(false);

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

    if (window.Views && typeof window.Views.placeUniverse === 'function') {
      window.Views.placeUniverse(cy);

      // ✅ Critical: restore the original "natural" universe (undo any HedronLayout position burn-in)
      restoreUniverseBaselinePositions();

      window.Views.smartFit?.(cy, cy.elements());

      enforceUniverseLabelPolicy();
      if (savedPan) cy.pan(savedPan);
      if (typeof savedZoom === 'number') cy.zoom(savedZoom);
    }

    if (savedFrom) {
      const n = cy.getElementById(savedFrom);
      if (n && n.length) n.select();
    }
  }

  // -----------------------------
  // Normalization helpers
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
        ...d,
        id: String(id),
        source: String(source),
        target: String(target),
      },
    };
  }

  function normalizeElements(nodesRaw, edgesRaw) {
    const nodes = (nodesRaw || []).map((n) => normalizeNodeData(n, 'node')).filter(Boolean);
    const edges = (edgesRaw || []).map((e, i) => normalizeEdgeData(e, i)).filter(Boolean);
    return { nodes, edges };
  }

  // -----------------------------
  // Data ingestion (supports window.Directory / window.DirectoryData)
  // -----------------------------
  function getDirectoryData() {
    if (window.Directory && Array.isArray(window.Directory.nodes)) {
      const edgesRaw = Array.isArray(window.Directory.edges)
        ? window.Directory.edges
        : Array.isArray(window.Directory.links)
          ? window.Directory.links
          : [];
      return normalizeElements(window.Directory.nodes, edgesRaw);
    }

    if (Array.isArray(window.Directory)) {
      const mixed = window.Directory;
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
  // Belts & braces edge strategy
  // 1) Always create hierarchy edges from node.parent_id (Sun -> orbit)
  // 2) Merge optional manual edges from Directory.edges
  // 3) Validate endpoints against actual node IDs
  // 4) Never crash the app if edges are bad
  // -----------------------------
  function buildNodeIdSet(nodes) {
    const set = new Set();
    nodes.forEach((n) => {
      const id = n?.data?.id;
      if (id) set.add(String(id));
    });
    return set;
  }

  function buildHierarchyEdges(nodes) {
    const edges = [];
    const seen = new Set();

    for (const n of nodes) {
      const childId = n?.data?.id ? String(n.data.id) : '';
      const parentId = n?.data?.parent_id ? String(n.data.parent_id) : '';

      if (!childId || !parentId) continue;

      const key = `${parentId}→${childId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      edges.push({
        data: {
          id: `edge:${key}`,
          source: parentId,
          target: childId,
          relation: 'has-orbit',
          weight: 1,
        },
      });
    }

    return edges;
  }

  function filterEdgesToExistingNodes(edges, nodeIdSet) {
    const valid = [];
    const invalid = [];
    const seen = new Set();

    for (const e of edges) {
      const s = e?.data?.source ? String(e.data.source) : '';
      const t = e?.data?.target ? String(e.data.target) : '';
      if (!s || !t) continue;

      // Dedup by endpoints (belts & braces)
      const key = `${s}→${t}`;
      if (seen.has(key)) continue;
      seen.add(key);

      if (nodeIdSet.has(s) && nodeIdSet.has(t)) {
        valid.push(e);
      } else {
        invalid.push(`${s} → ${t}`);
      }
    }

    if (invalid.length) {
      console.warn(
        '[Artiligenz] Skipped invalid edges:',
        invalid.slice(0, 12),
        invalid.length > 12 ? `(+${invalid.length - 12} more)` : ''
      );
    }

    console.log(`[Artiligenz] Edges: ${valid.length} valid (${invalid.length} skipped)`);
    return valid;
  }

  // -----------------------------
  // Cytoscape init
  // -----------------------------
  function initCytoscape() {
    const { nodes, edges } = getDirectoryData();

    if (!nodes.length) {
      console.warn('[Artiligenz] No nodes found. Check your data files are loaded.');
    }

    // ✅ Always synthesize hierarchy edges from parent_id
    const hierarchyEdges = buildHierarchyEdges(nodes);

    // ✅ Merge manual edges (optional) + hierarchy edges
    const mergedEdges = [...hierarchyEdges, ...(edges || [])];

    // ✅ Validate endpoints against actual node IDs (never crash)
    const nodeIdSet = buildNodeIdSet(nodes);
    const safeEdges = filterEdgesToExistingNodes(mergedEdges, nodeIdSet);

    cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [...nodes, ...safeEdges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#11b2f7',
            label: '',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 12,
            width: 30,
            height: 30,
          },
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#629eee',
            width: 1,
            'curve-style': 'haystack',
            opacity: 0.8,
          },
        },
      ],
      layout: { name: 'preset' },
      wheelSensitivity: 0.6,
    });

    // Expose for debugging
    window.__cy = cy;

    // ✅ Ensure theme skin is applied after Cytoscape exists
    window.Skin?.apply?.(cy);

    // Initial view
    if (window.Views && typeof window.Views.placeUniverse === 'function') {
      window.Views.placeUniverse(cy);

      // ✅ Snapshot the initial "natural" universe positions ONCE
      snapshotUniverseBaselinePositionsOnce();

      if (typeof window.Views.smartFit === 'function') {
        window.Views.smartFit(cy, cy.elements());
      }
    }

    // Re-assert Universe-only Sun labels AFTER any view/layout code that may overwrite styles
    enforceUniverseLabelPolicy();
    return cy;
  }

  // -----------------------------
  // Filters
  // -----------------------------
  function applyFilters() {
    if (!cy) return;

    const activeNodes = cy.nodes().filter((n) => {
      const name = String(n.data('name') || '').toLowerCase();
      const bucket = String(n.data('bucket') || '').toLowerCase();

      const q = String(filterState.search || '').toLowerCase();
      const hasText = q && name.includes(q);

      const hasCat =
        filterState.categories.length === 0 ||
        filterState.categories.includes(bucket);

      return (!q || hasText) && hasCat;
    });

    cy.startBatch();
    cy.edges().style('display', 'none');
    cy.nodes().style('display', 'none');
    activeNodes.style('display', 'element');
    cy.endBatch();

    if (window.HedronLayout && typeof window.HedronLayout.apply === 'function') {
      window.HedronLayout.apply(cy, activeNodes.toArray());
    }

    hasActiveFilter = !!filterState.search || filterState.categories.length > 0;
  }

  // -----------------------------
  // View controls
  // -----------------------------
  function initViewControls() {
    const universeBtn = document.getElementById('btnUniverse');
    if (universeBtn) {
      universeBtn.addEventListener('click', () => window.setView?.('universe'));
    }

    window.setView = function (mode) {
      if (!cy) return;

      try {
        mode = mode === 'universe' ? 'universe' : 'universe';

        if (orbitState.active && mode !== 'orbit') {
          exitOrbit();
        }

        currentView = mode;

        // Reset filters on universe
        filterState = { categories: [], search: '' };
        hasActiveFilter = false;
        cy.elements().style('display', 'element');

        if (window.Views?.placeUniverse) {
          window.Views.placeUniverse(cy);

          // ✅ Always return to the original baseline universe after any interaction
          restoreUniverseBaselinePositions();

          window.Views.smartFit?.(cy, cy.elements());

          enforceUniverseLabelPolicy();
        }
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

    // Mobile gesture behavior: let Cytoscape own touch gestures on touch devices
    try {
      const host = cy.container();
      if (host && isCoarsePointer) {
        host.style.touchAction = 'none';
      }
    } catch (_) {}

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
            customElements.whenDefined('info-drawer').then(() => {
              document.querySelector('info-drawer')?.update(node.data());
            });
          },
        });
      }
    }

    function nearestNodeForRenderedPoint(rp, maxDistPx) {
      if (!rp) return null;

      const maxD2 = maxDistPx * maxDistPx;
      let best = null;
      let bestD2 = Infinity;

      const nodes = cy.nodes().filter((n) => n.style('display') !== 'none');

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Cheap reject: if tap is far outside node rendered BB (+padding), skip
        let bb = null;
        try {
          bb = n.renderedBoundingBox();
        } catch (_) {
          bb = null;
        }
        if (bb) {
          const pad = maxDistPx;
          if (
            rp.x < bb.x1 - pad || rp.x > bb.x2 + pad ||
            rp.y < bb.y1 - pad || rp.y > bb.y2 + pad
          ) continue;
        }

        const nrp = n.renderedPosition();
        const dx = nrp.x - rp.x;
        const dy = nrp.y - rp.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD2) {
          bestD2 = d2;
          best = n;
        }
      }

      return bestD2 <= maxD2 ? best : null;
    }

    const onNodeActivate = (evt) => {
      const node = evt.target;

      // Mobile: allow direct orbit entry on first tap if not already in orbit
      if (isCoarsePointer && !orbitState.active) {
        const opened = enterOrbit(node);
        if (opened) return;
      }

      showNodeMicrocard(node);
    };

    const onBgActivate = (evt) => {
      if (evt.target !== cy) return;

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

    // ✅ Avoid duplicate firing: use tap on touch, click on desktop
    const nodeEvt = isCoarsePointer ? 'tap' : 'click';
    const bgEvt = isCoarsePointer ? 'tap' : 'click';

    cy.on(nodeEvt, 'node', onNodeActivate);
    cy.on(bgEvt, onBgActivate);

    // Escape closes microcard + exits orbit
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      window.Microcard?.hide?.();
      if (orbitState.active) exitOrbit();
    });

    // Global outside-tap close (belt & braces for mobile)
    document.addEventListener(
      'pointerdown',
      (e) => {
        const mc = document.getElementById('microcard');
        const drawer = document.querySelector('info-drawer');
        const headerMenu = document.querySelector('.mobile-menu-panel, [data-mobile-menu-panel]');
        const t = e.target;

        const inMicro = mc && mc.contains(t);
        const inDrawer = drawer && drawer.contains(t);
        const inHeader = headerMenu && headerMenu.contains(t);

        if (!inMicro && !inDrawer && !inHeader) {
          window.Microcard?.hide?.();
        }
      },
      true
    );
  }

  // -----------------------------
  // Theme reactivity
  // -----------------------------
  function initThemeReactivity() {
    const observer = new MutationObserver(() => {
      try {
        window.Microcard?.refreshTheme?.();
        window.Skin?.apply?.(window.__cy || cy);
        // Re-assert Universe-only Sun labels after skin overrides
        enforceUniverseLabelPolicy();
      } catch (_) {}
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  // -----------------------------
  // Resize / orientation handling (mobile-first)
  // -----------------------------
  function initResizeHandling() {
    let resizeTimer = null;
    window.addEventListener(
      'resize',
      () => {
        if (!cy) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          try {
            cy.resize();

            // Fit appropriately without changing layout rules
            if (orbitState.active) {
              window.Views?.smartFit?.(cy, cy.elements(), 80);
            } else {
              window.Views?.smartFit?.(cy, cy.elements());
            }
          } catch (_) {}
        }, 120);
      },
      { passive: true }
    );
  }

  // -----------------------------
  // Boot
  // -----------------------------
  function boot() {
    initCytoscape();
    initViewControls();
    initInteractions();
    initThemeReactivity();
    initResizeHandling();

    // Sidebar → Orchestrator wiring
    // Debounce filter application slightly to keep mobile typing responsive
    let filterTimer = null;
    document.addEventListener('filters-changed', (e) => {
      const { categories = [], search = '' } = e.detail || {};
      filterState = { categories, search };

      clearTimeout(filterTimer);
      filterTimer = setTimeout(() => {
        applyFilters();
      }, 80);
    });

    document.addEventListener('mode-changed', (e) => {
      let mode = e.detail?.mode || 'universe';
      if (mode !== 'universe') mode = 'universe';
      window.setView?.(mode);
    });

    window.FilterManager = {
      updateSearch(search) {
        filterState.search = search || '';
        applyFilters();
      },
      updateCategories(categories) {
        filterState.categories = Array.isArray(categories) ? categories : [];
        applyFilters();
      },
      clearFilters() {
        filterState = { categories: [], search: '' };
        hasActiveFilter = false;
        cy?.elements()?.style('display', 'element');
        if (currentView === 'universe') {
          window.Views?.placeUniverse?.(cy);

          // ✅ Restore the original baseline universe layout when clearing filters
          restoreUniverseBaselinePositions();

          window.Views?.smartFit?.(cy, cy.elements());

          enforceUniverseLabelPolicy();
        }
      },
      getState() {
        return { ...filterState, hasActiveFilter };
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
