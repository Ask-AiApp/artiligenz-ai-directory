// HedronLayout.js
// Search / Filter spatial layout (polyhedron rule)
// NO knowledge of edges, parents, views, or filters

(function () {
  function apply(cy, nodes) {
    if (!cy || !nodes || nodes.length === 0) return;

    const w = cy.width();
    const h = cy.height();
    const cx = w / 2;
    const cyy = h / 2;
    const minDim = Math.min(w, h);

    const count = nodes.length;

    // Tunable constants
    const baseRadius = minDim * 0.18;
    const ringGap = minDim * 0.16;

    // Build rings dynamically (works from 1 → 10,000+)
    const rings = [];
    if (count === 1) {
      rings.push({ count: 1, radius: 0 });
    } else {
      let remaining = count;
      let ringIndex = 0;

      while (remaining > 0) {
        const capacity = ringIndex === 0 ? 6 : 6 + ringIndex * 6;
        const n = Math.min(remaining, capacity);
        rings.push({
          count: n,
          radius: baseRadius + ringIndex * ringGap
        });
        remaining -= n;
        ringIndex++;
      }
    }

    const positions = {};
    let i = 0;

    rings.forEach((ring, ringIndex) => {
      if (ring.radius === 0) {
        const node = nodes[i++];
        if (node) positions[node.id()] = { x: cx, y: cyy };
        return;
      }

      const step = (Math.PI * 2) / ring.count;
      const phase = ringIndex % 2 ? step / 2 : 0;

      for (let j = 0; j < ring.count; j++) {
        const node = nodes[i++];
        if (!node) break;

        const angle = phase + j * step;
        positions[node.id()] = {
          x: cx + ring.radius * Math.cos(angle),
          y: cyy + ring.radius * Math.sin(angle)
        };
      }
    });

    cy.layout({
      name: 'preset',
      positions: (n) => positions[n.id()] || n.position(),
      animate: false,
      fit: false
    }).run();

    cy.animate(
      { fit: { eles: nodes, padding: 80 } },
      { duration: 400, easing: 'ease' }
    );
  }

  // Export
  window.HedronLayout = { apply };
})();
