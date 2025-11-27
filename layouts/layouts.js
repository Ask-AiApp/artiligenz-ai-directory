// Artiligenz-Galaxy v2 — Layout helpers
(function () {
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));

  function rng(seed){ // mulberry32
    let t = seed >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), t | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function distributeEllipse(n, a, b, seed=42, jitter=0){
    const R = rng(seed);
    const pts = [];
    for (let i=0;i<n;i++){
      const t = (i / Math.max(1,n)) * 2 * Math.PI + (R()*0.5);
      const X = a * Math.cos(t);
      const Y = b * Math.sin(t);
      pts.push({ x: X + (R()-0.5)*jitter, y: Y + (R()-0.5)*jitter });
    }
    return pts;
  }

  // Universe panoramic clusters
  function universePanoramic(cy, suns, planetsBySun, moonsByPlanet, opts={}){
    const rect = cy.container().getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const a = (opts.a ?? 0.42) * W;
    const b = (opts.b ?? 0.24) * H;
    const R = rng(opts.seed ?? 42);

    const positions = {};
    // scatter suns
    suns.forEach((s, i) => {
      const th = R()*Math.PI*2;
      const r = Math.sqrt(R());
      const x = a * r * Math.cos(th);
      const y = b * r * Math.sin(th);
      positions[s.id()] = { x, y };
    });

    const sunRadius = Math.min(W, H) * 0.08;
    suns.forEach((s, i) => {
      const center = positions[s.id()];
      const kids = planetsBySun[s.id()] || [];
      const pts = distributeEllipse(Math.max(kids.length,1), sunRadius, sunRadius*0.6, 100+i, 8);
      kids.forEach((p, kIdx) => {
        positions[p.id()] = { x: center.x + pts[kIdx].x, y: center.y + pts[kIdx].y };
        const moons = (moonsByPlanet[p.id()] || []);
        if (moons.length){
          const mR = sunRadius * 0.45;
          const mpts = distributeEllipse(moons.length, mR, mR*0.55, 300+i*13+kIdx, 6);
          moons.forEach((m, mIdx) => {
            positions[m.id()] = { x: positions[p.id()].x + mpts[mIdx].x, y: positions[p.id()].y + mpts[mIdx].y };
          });
        }
      });
    });

    return positions;
  }

  // Galaxy concentric: Suns center, Planets middle, Moons outer
  function galaxyConcentric(cy, suns, planets, moons, opts={}){
    const rect = cy.container().getBoundingClientRect();
    const base = Math.min(rect.width, rect.height) * 0.38;
    const a1 = base * 0.55, b1 = a1 * (opts.tilt ? 0.72 : 1);
    const a2 = base * 0.85, b2 = a2 * (opts.tilt ? 0.72 : 1);
    const a3 = base * 1.10, b3 = a3 * (opts.tilt ? 0.72 : 1);

    const pos = {};
    distributeEllipse(Math.max(suns.length,1), a1, b1, 11).forEach((p, i)=> { if(suns[i]) pos[suns[i].id()] = p; });
    distributeEllipse(Math.max(planets.length,1), a2, b2, 22).forEach((p, i)=> { if(planets[i]) pos[planets[i].id()] = p; });
    distributeEllipse(Math.max(moons.length,1), a3, b3, 33).forEach((p, i)=> { if(moons[i]) pos[moons[i].id()] = p; });
    return pos;
  }

  // DEFAULT GRID: 6 columns, 20% tighter gaps, top-left padding
  function gridPositions(list, options = {}) {
    const cols   = options.cols   ?? 6;
    const gapX   = Math.round((options.gapX ?? 140) * 0.8); // 112
    const gapY   = Math.round((options.gapY ?? 110) * 0.8); // 88
    const startX = options.startX ?? 40;
    const startY = options.startY ?? 40;

    const pos = {};
    for (let i = 0; i < list.length; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      pos[list[i].id()] = { x: startX + c * gapX, y: startY + r * gapY };
    }
    return pos;
  }

  function smartFit(cy, eles){
    if (!eles || eles.length === 0) { cy.fit(); return; }
    const bb = eles.boundingBox();
    const w = cy.width(), h = cy.height();
    const pad = 30;
    const sx = (w - pad * 2) / Math.max(bb.w, 1);
    const sy = (h - pad * 2) / Math.max(bb.h, 1);
    const zoom = Math.min(sx, sy);
    const cx = (bb.x1 + bb.x2) / 2, cyy = (bb.y1 + bb.y2) / 2;
    cy.viewport({ zoom, pan: { x: w/2 - cx*zoom, y: h/2 - cyy*zoom } });
  }

  // merge into existing namespace instead of overwriting it
  window.Layouts = Object.assign(window.Layouts || {}, {
    universePanoramic,
    galaxyConcentric,
    gridPositions,
    smartFit
  });
})();
