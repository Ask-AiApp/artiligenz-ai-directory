// views/universeview.js
// Ring-based Universe layout tuned for:
// - Suns on 1–2 rings, Foundation suns evenly scattered
// - Planets reasonably close to their suns (no huge edges)
// - Moons close to planets
// - Independents on a loose outer ring
// - Optional collision relax via ViewUtils.resolveCollisions

(function () {
  const { resolveCollisions } = window.ViewUtils || {};

  // Evenly spaced points on a circle
  function ringPositions(count, cx, cy, radius) {
    const out = [];
    if (count <= 0) return out;
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = step * i;
      out.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      });
    }
    return out;
  }

  function placeUniverse(cy, suns, planetsBySun, moonsByPlanet, opts = {}) {
    const rect = cy.container().getBoundingClientRect();
    const W = rect.width || cy.width();
    const H = rect.height || cy.height();
    const cx = W / 2;
    const cyCenter = H / 2;
    const minWH = Math.min(W, H);

    const positions = {};
    const radii = {};

    // --- Overall constellation radii (tuned for more breathing room) ---
    const outerSunRadius   = minWH * 0.42;  // was 0.38
const innerSunRadius   = minWH * 0.26;  // was 0.24
const outerIndepRadius = minWH * 0.56;  // was 0.50

    // ---------- SUNS: 1–2 rings, Foundation suns evenly scattered ----------
    const sunCount = suns.length;

    if (sunCount > 0) {
      // Separate foundation vs other suns
      const foundationSuns = [];
      const otherSuns = [];
      
      const foundationIds = new Set(foundationSuns.map((n) => n.id()));

      suns.forEach((n) => {
        let bucket = '';
        try {
          const d = typeof n.data === 'function' ? n.data() : {};
          bucket = (d.bucket || d.bucket_slug || '').toString().toLowerCase();
        } catch (e) {
          bucket = '';
        }
        if (bucket.includes('foundation')) {
          foundationSuns.push(n);
        } else {
          otherSuns.push(n);
        }
      });

      let ringInner = [];
      let ringOuter = [];

      if (sunCount <= 12) {
        // Single tidy ring
        ringOuter = ringPositions(sunCount, cx, cyCenter, outerSunRadius);
      } else {
        // Two rings: inner + outer
        const innerCount = Math.ceil(sunCount * 0.55);
        const outerCount = sunCount - innerCount;
        ringInner = ringPositions(innerCount, cx, cyCenter, innerSunRadius);
        ringOuter = ringPositions(outerCount, cx, cyCenter, outerSunRadius);
      }

      // Flatten ring slots into a single array of positions
      const ringSlots = [];
      if (ringInner.length) {
        ringSlots.push(...ringInner);
      }
      if (ringOuter.length) {
        ringSlots.push(...ringOuter);
      }
      if (!ringInner.length && ringOuter.length) {
        ringSlots.length = 0;
        ringSlots.push(...ringOuter);
      }

      const totalSlots = ringSlots.length;
      const foundationCount = foundationSuns.length;
      const orderedSuns = new Array(totalSlots).fill(null);

      // Sprinkle foundation suns evenly around ring slots
      if (foundationCount > 0) {
        const step = totalSlots / foundationCount;
        let pos = 0;
        for (let i = 0; i < foundationCount; i++) {
          const idx = Math.round(pos) % totalSlots;
          orderedSuns[idx] = foundationSuns[i];
          pos += step;
        }
      }

      // Fill remaining slots with other suns
      let oi = 0;
      for (let i = 0; i < totalSlots; i++) {
        if (!orderedSuns[i] && oi < otherSuns.length) {
          orderedSuns[i] = otherSuns[oi++];
        }
      }

      // If any slots still empty (unlikely), fill with whatever is left
      let fallbackIndex = 0;
      for (let i = 0; i < totalSlots; i++) {
        if (!orderedSuns[i]) {
          orderedSuns[i] = suns[fallbackIndex++ % suns.length];
        }
      }

      // Apply positions and radii
      orderedSuns.forEach((sun, i) => {
  if (!sun) return;
  const p = ringSlots[i];
  if (!p) return;

  const id = sun.id();
  const isFoundationSun = foundationIds.has(id);

  positions[id] = { x: p.x, y: p.y };

  // Foundation suns get a bigger "collision bubble"
  // so other nodes are pushed further away
  radii[id] = isFoundationSun ? minWH * 0.08 : minWH * 0.055;
});
    }

    // ---------- PLANETS: per-sun ring, closer to suns ----------
    const allPlanets = [];

    suns.forEach((sun) => {
      const kids = (planetsBySun[sun.id()] || []).filter(Boolean);
      if (!kids.length) return;

      const center = positions[sun.id()];
      if (!center) return;

      // Planets relatively close: edges not too long
      const planetRingRadius = Math.max(
        minWH * 0.14,
        Math.min(minWH * 0.24, minWH * 0.11 + kids.length * 6)
      );

      const ring = ringPositions(kids.length, center.x, center.y, planetRingRadius);
      kids.forEach((p, i) => {
        const pos = ring[i];
        if (!pos) return;
        positions[p.id()] = { x: pos.x, y: pos.y };
        radii[p.id()] = minWH * 0.04;
        allPlanets.push(p);
      });
    });

    // ---------- MOONS: close orbit around their planet ----------
    allPlanets.forEach((planet) => {
      const kids = (moonsByPlanet[planet.id()] || []).filter(Boolean);
      if (!kids.length) return;

      const center = positions[planet.id()] || planet.position();
      const moonRingRadius = Math.max(
        minWH * 0.05,
        Math.min(minWH * 0.09, minWH * 0.04 + kids.length * 5)
      );

      const ring = ringPositions(kids.length, center.x, center.y, moonRingRadius);
      kids.forEach((m, i) => {
        const pos = ring[i];
        if (!pos) return;
        positions[m.id()] = { x: pos.x, y: pos.y };
        radii[m.id()] = minWH * 0.028;
      });
    });

    // ---------- INDEPENDENT NODES: loose outer ring ----------
    const attached = new Set([
      ...suns.map((n) => n.id()),
      ...(planetsBySun ? Object.values(planetsBySun).flat().map((n) => n.id()) : []),
      ...(moonsByPlanet ? Object.values(moonsByPlanet).flat().map((n) => n.id()) : [])
    ]);

    const vis = cy.nodes(':visible').toArray();
    const independents = vis.filter((n) => !attached.has(n.id()));

    if (independents.length) {
      const ring = ringPositions(independents.length, cx, cyCenter, outerIndepRadius);
      independents.forEach((n, i) => {
        const pos = ring[i];
        if (!pos) return;
        positions[n.id()] = { x: pos.x, y: pos.y };
        radii[n.id()] = minWH * 0.04;
      });
    }

    // ---------- Clamp to canvas + relax ----------
    const pad = minWH * 0.04;
    Object.values(positions).forEach((p) => {
      p.x = Math.max(pad, Math.min(W - pad, p.x));
      p.y = Math.max(pad, Math.min(H - pad, p.y));
    });

    if (typeof resolveCollisions === 'function') {
      const relaxNodes = vis.filter((n) => positions[n.id()]);
      resolveCollisions(relaxNodes, positions, radii, {
  iterations: 11,
  strength: 1
});
    }

    return positions;
  }

  window.UniverseView = { placeUniverse };
})();
