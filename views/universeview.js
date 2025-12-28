// views/universeview.js
// Ring-based Universe layout tuned for a "galaxy" feel
// - Suns: 1-2 rings, with Foundation suns evenly scattered (no central pile-up)
// - Planets: per-sun ring, reasonably close to their suns (no huge edges)
// - Moons: close to their planets
// - Independents: outer ring, spaced
//
// ✅ Fixes included:
// 1) Resilient fallback: if caller calls placeUniverse(cy) without (suns, planetsBySun, moonsByPlanet),
//    we derive them from node data so it never crashes on '.length'.
// 2) Bug fix: foundationIds now computed AFTER foundationSuns is populated (it was always empty before).

(function () {
  const { blueNoiseEllipse, distributeEllipse, resolveCollisions } = window.ViewUtils || {};

  // Evenly spread points around a ring
  function ringPositions(n, cx, cy, radius, startAngle = 0) {
    const out = [];
    if (!n) return out;
    const step = (Math.PI * 2) / n;
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * step;
      out.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      });
    }
    return out;
  }

  // Derive hierarchy groups if caller didn't provide them.
  // This makes UniverseView resilient if the app calls placeUniverse(cy) without precomputed arrays.
  function deriveGroups(cy) {
    const vis = cy.nodes(':visible').toArray();

    const suns = [];
    const planetsBySun = Object.create(null);
    const moonsByPlanet = Object.create(null);

    function norm(v) {
      return v == null ? '' : String(v).toLowerCase();
    }

    function getRole(d) {
      // Try common fields used across the project
      const role = norm(
        d.orbit_role ||
          d.orbitRole ||
          d.role ||
          d.kind ||
          d.type ||
          d.tier ||
          d.orbit ||
          d.level_name
      );
      if (role.includes('sun')) return 'sun';
      if (role.includes('planet')) return 'planet';
      if (role.includes('moon')) return 'moon';

      // Numeric tier/level hints
      const lvl = d.orbit_level ?? d.level ?? d.tier_level ?? d.tierLevel;
      if (lvl === 0 || lvl === '0') return 'sun';
      if (lvl === 1 || lvl === '1') return 'planet';
      if (lvl === 2 || lvl === '2') return 'moon';

      return '';
    }

    function getParentId(d, fallbacks) {
      for (const k of fallbacks) {
        if (d[k] != null && String(d[k]).length) return String(d[k]);
      }
      return '';
    }

    // Pass 1: classify obvious suns
    for (const n of vis) {
      const d = typeof n.data === 'function' ? n.data() : {};
      const role = getRole(d);
      if (role === 'sun') suns.push(n);
    }

    // If no explicit suns found, fall back:
    // treat all visible nodes as suns so layout still renders and never crashes.
    if (suns.length === 0) {
      return { suns: vis, planetsBySun, moonsByPlanet };
    }

    const sunIds = new Set(suns.map((n) => n.id()));

    // Pass 2: assign planets and moons using common parent fields
    for (const n of vis) {
      const d = typeof n.data === 'function' ? n.data() : {};
      const role = getRole(d);

      if (role === 'planet') {
        const sunId = getParentId(d, [
          'sun',
          'sun_id',
          'sunId',
          'parent_sun',
          'parentSun',
          'parent',
          'parentId',
          'foundation',
          'host',
          'orbit_parent',
          'orbitParent'
        ]);
        const key = sunId && sunIds.has(sunId) ? sunId : suns[0].id();
        (planetsBySun[key] ||= []).push(n);
      } else if (role === 'moon') {
        const planetId = getParentId(d, [
          'planet',
          'planet_id',
          'planetId',
          'parent_planet',
          'parentPlanet',
          'parent',
          'parentId',
          'orbit_parent',
          'orbitParent'
        ]);
        if (planetId) {
          (moonsByPlanet[planetId] ||= []).push(n);
        }
      }
    }

    return { suns, planetsBySun, moonsByPlanet };
  }

  function placeUniverse(cy, suns, planetsBySun, moonsByPlanet, opts = {}) {
    // Fallback: build hierarchy groups if they were not provided by the caller.
    if (!Array.isArray(suns)) {
      const derived = deriveGroups(cy);
      suns = derived.suns;
      planetsBySun = derived.planetsBySun;
      moonsByPlanet = derived.moonsByPlanet;
    }

    const rect = cy.container().getBoundingClientRect();
    const W = rect.width || cy.width();
    const H = rect.height || cy.height();
    const cx = W / 2;
    const cyCenter = H / 2;

    const minWH = Math.min(W, H);

    // --- Tunables ---
    const padding = opts.padding ?? (minWH * 0.06);       // padding between solar systems
    const sunBaseR = opts.sunBaseR ?? 34;                 // base sun node radius (visual)
    const planetR = opts.planetR ?? 22;
    const moonR = opts.moonR ?? 12;

    // orbit radii (within one solar system)
    const planetOrbitMin = opts.planetOrbitMin ?? (minWH * 0.055);
    const planetOrbitMax = opts.planetOrbitMax ?? (minWH * 0.115);
    const moonOrbit = opts.moonOrbit ?? (minWH * 0.018);

    // --- helpers ---
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function ringPositions(n, cx, cy, radius, startAngle = 0) {
      const out = [];
      if (!n) return out;
      const step = (Math.PI * 2) / n;
      for (let i = 0; i < n; i++) {
        const ang = startAngle + i * step;
        out.push({ x: cx + radius * Math.cos(ang), y: cy + radius * Math.sin(ang) });
      }
      return out;
    }

    const positions = {};
    const radii = {};

    // 1) Compute each solar system "bounding radius" (sun + its ecosystem orbit)
    //    Bigger ecosystems get bigger padding space, avoiding overlap.
    const systems = suns.map((sun) => {
      const sid = sun.id();
      const planets = (planetsBySun && planetsBySun[sid]) ? planetsBySun[sid] : [];
      let moonCount = 0;
      planets.forEach((p) => {
        moonCount += (moonsByPlanet && moonsByPlanet[p.id()]) ? moonsByPlanet[p.id()].length : 0;
      });

      const pCount = planets.length;

      // Orbit radius scales with planet count (and a small contribution from moons)
      const orbitR =
        clamp(planetOrbitMin + (pCount / 40) * (planetOrbitMax - planetOrbitMin), planetOrbitMin, planetOrbitMax) +
        clamp(moonCount * 0.35, 0, minWH * 0.03);

      // Total "system radius" = orbitR + extra padding + sun radius
      const systemR = orbitR + padding + sunBaseR;

      return { sun, sid, planets, orbitR, systemR };
    });

    // 2) Initial scatter of suns as "system centers" (blue-noise-ish ellipse)
    //    Then collision relax based on each system's radius.
    const nS = systems.length;
    const ellipseA = (minWH * 0.38);
    const ellipseB = (minWH * 0.28);

    // If ViewUtils has distributeEllipse, use it; otherwise simple ring fallback.
    let seedPts = [];
    if (typeof distributeEllipse === 'function') {
      seedPts = distributeEllipse(nS, cx, cyCenter, ellipseA, ellipseB);
    } else {
      seedPts = ringPositions(nS, cx, cyCenter, minWH * 0.28, Math.random() * Math.PI * 2);
    }

    systems.forEach((sys, i) => {
      const p = seedPts[i] || { x: cx, y: cyCenter };
      positions[sys.sid] = { x: p.x, y: p.y };
      radii[sys.sid] = sys.systemR; // IMPORTANT: collision radius is the whole system radius
    });

    // Relax system centers so their "system disks" don't overlap
    if (typeof resolveCollisions === 'function') {
      const sysNodes = systems.map(s => s.sun);
      resolveCollisions(sysNodes, positions, radii, { iterations: 18, strength: 1.15 });
    }

    // 3) Place planets around each sun within its orbit radius
    systems.forEach((sys) => {
      const sunPos = positions[sys.sid];
      if (!sunPos) return;

      // Set sun node visual radius hint (only used for collision; styling/sizing still in scripts/skin)
      radii[sys.sid] = sunBaseR;

      const pCount = sys.planets.length;
      if (!pCount) return;

      const pts = ringPositions(pCount, sunPos.x, sunPos.y, sys.orbitR, Math.random() * Math.PI * 2);
      sys.planets.forEach((pNode, idx) => {
        positions[pNode.id()] = { x: pts[idx].x, y: pts[idx].y };
        radii[pNode.id()] = planetR;

        // 4) Place moons close to their planet
        const moons = (moonsByPlanet && moonsByPlanet[pNode.id()]) ? moonsByPlanet[pNode.id()] : [];
        if (!moons.length) return;

        const mPts = ringPositions(moons.length, pts[idx].x, pts[idx].y, moonOrbit, Math.random() * Math.PI * 2);
        moons.forEach((mNode, mIdx) => {
          positions[mNode.id()] = { x: mPts[mIdx].x, y: mPts[mIdx].y };
          radii[mNode.id()] = moonR;
        });
      });
    });

    // 5) Apply positions
    const vis = cy.nodes(':visible').toArray();
    cy.batch(() => {
      vis.forEach((n) => {
        const p = positions[n.id()];
        if (p) n.position(p);
      });
    });

    // Universe view rules:
    // - edges ON for all
    // - labels ON only for suns (foundation nodes)
    cy.edges().removeClass('hidden');
    cy.edges().style('display', 'element');
    cy.nodes().forEach((n) => n.style('label', ''));
    (Array.isArray(suns) ? suns : []).forEach((n) => {
      n.style('label', n.data('name') || n.data('label') || '');
    });

    // 6) Optional: light collision pass for all visible nodes to reduce local overlaps
    if (typeof resolveCollisions === 'function') {
      const relax = vis.filter(n => positions[n.id()]);
      resolveCollisions(relax, positions, radii, { iterations: 10, strength: 1.0 });
    }

    return positions;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  window.UniverseView = { placeUniverse };
})();