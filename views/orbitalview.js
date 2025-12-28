// views/orbitalview.js
(function () {
  // Tilted orbital drill-in view
  function placeOrbital(center, children, opts = {}) {
    const tilt = (opts.tiltDeg ?? 24) * Math.PI / 180;
    const r = opts.radius ?? 260;

    // Anchor orbit around the selected center node's current position (V1 behavior)
    const cpos = center.position();
    const cx = cpos.x;
    const cy = cpos.y;

    const pos = {};
    pos[center.id()] = { x: cx, y: cy };

    const n = Math.max(children.length, 1);
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang) * Math.cos(tilt);
      const nd = children[i];
      if (nd) pos[nd.id()] = { x, y };
    }
    return pos;
  }

  window.OrbitalView = { placeOrbital };
})();
