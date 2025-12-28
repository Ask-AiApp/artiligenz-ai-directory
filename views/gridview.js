// views/gridview.js
// Grid view: 6-across static grid + top-anchored + vertical scroll/pan only (Star Wars credits)

(function () {
  let state = {
    enabled: false,
    lockX: 0,
    minY: -999999,
    maxY: 0,
    prevZooming: true,
    prevPanning: true,
    wheelHandler: null,
    panHandler: null,
    container: null,
    cy: null
  };

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function computeBounds(cy, visible) {
    const bb = visible.boundingBox();
    const w = cy.width();
    const h = cy.height();
    const pad = 80;

    const centerX = (bb.x1 + bb.x2) / 2;
    const lockX = w / 2 - centerX;

    // Top anchor at maxY, allow scroll down through full content
    const maxY = 0 + pad;
    const contentH = bb.h;

    // If content taller than viewport, minY is negative so you can scroll down.
    // If content smaller, minY == maxY (no vertical movement needed).
    const minY = Math.min(maxY, h - (contentH + pad));

    return { lockX, minY, maxY };
  }

  function lockPanToGrid() {
    if (!state.enabled || !state.cy) return;
    const cy = state.cy;

    const p = cy.pan();
    const y = clamp(p.y, state.minY, state.maxY);

    if (p.x !== state.lockX || p.y !== y) {
      cy.pan({ x: state.lockX, y });
    }
  }

  function onWheel(evt) {
    if (!state.enabled || !state.cy) return;
    evt.preventDefault();

    const cy = state.cy;
    const p = cy.pan();

    // mousewheel deltaY: positive = scroll down
    const nextY = clamp(p.y - evt.deltaY, state.minY, state.maxY);
    cy.pan({ x: state.lockX, y: nextY });
  }

  function enable(cy) {
    if (state.enabled) return;

    state.enabled = true;
    state.cy = cy;
    state.container = cy.container();

    // store + constrain
    state.prevZooming = cy.userZoomingEnabled();
    state.prevPanning = cy.userPanningEnabled();

    cy.userZoomingEnabled(false);
    cy.userPanningEnabled(true);

    state.panHandler = lockPanToGrid;
    cy.on('pan', state.panHandler);

    state.wheelHandler = onWheel;
    state.container.addEventListener('wheel', state.wheelHandler, { passive: false });
  }

  function destroy() {
    if (!state.enabled || !state.cy) return;

    const cy = state.cy;

    if (state.panHandler) cy.off('pan', state.panHandler);
    if (state.container && state.wheelHandler) {
      state.container.removeEventListener('wheel', state.wheelHandler);
    }

    cy.userZoomingEnabled(state.prevZooming);
    cy.userPanningEnabled(state.prevPanning);

    state.enabled = false;
    state.lockX = 0;
    state.minY = -999999;
    state.maxY = 0;
    state.wheelHandler = null;
    state.panHandler = null;
    state.container = null;
    state.cy = null;
  }

  function apply(cy, opts = {}) {
    if (!cy) return;

    // Grid = nodes only, edges hidden
    cy.edges().style('display', 'none');

    const visible = cy.nodes(':visible');
    if (!visible.length) return;

    // Labels ON in grid
    visible.forEach((n) => n.style('label', n.data('name') || n.data('label') || ''));

    // Order for readability (match V1 feel): suns first, then everything else
    const suns = visible.filter((n) => String(n.id()).startsWith('parent:'));
    const rest = visible.difference(suns);
    const ordered = suns.union(rest).toArray();

    const gp = window.Layouts?.gridPositions;
    if (!gp) {
      console.error('[GridView] Layouts.gridPositions missing');
      return;
    }

    const pos = gp(ordered, {
      cols: opts.cols ?? 6,
      gapX: opts.gapX ?? 168,
      gapY: opts.gapY ?? 128,
      startX: opts.startX ?? 40,
      startY: opts.startY ?? 40
    });

    cy.layout({
      name: 'preset',
      positions: (node) => pos[node.id()] || node.position(),
      fit: false,
      animate: false
    }).run();

    // Compute bounds + set top-anchored camera
    const b = computeBounds(cy, visible);
    state.lockX = b.lockX;
    state.minY = b.minY;
    state.maxY = b.maxY;

    cy.viewport({ zoom: 1, pan: { x: state.lockX, y: state.maxY } });

    // Enable vertical scroll behavior
    enable(cy);

    // Immediately enforce lock
    lockPanToGrid();
  }

  window.GridView = { apply, destroy };
})();
