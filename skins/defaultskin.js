// defaultskin.js — Artiligenz-Galaxy skin (Category ring + neutral fill)
// Exposes: Skin.styles() and Skin.apply(cy)

(function () {
  function styles() {
    const isDark = document.documentElement.classList.contains('dark');

    // Canvas + text palette
    const baseBg      = isDark ? '#111827' : '#ffffff';   // match sidebar in dark mode
    const nodeFill    = isDark ? '#95ddf0' : '#7cb8c9';
    const nodeLabel   = isDark ? '#e5e7eb' : '#111827';
    const textOutline = isDark ? '#111827' : '#ffffff';
    const fallbackRing= isDark ? '#b6f8e0' : '#d2dee0';
    const edgeColor   = isDark ? '#2df3aa' : '#9b9e9e';
    const edgeOpacity = isDark ? 0.50 : 0.50;

    // Uniform ring width
    const RING_WIDTH = 1.5;

    // Base node style (sizing handled in scripts/layouts)
    const baseNode = {
      shape: 'ellipse',
      'background-color': nodeFill,
      'background-opacity': 1,

      // neutral ring by default
      'border-width': RING_WIDTH,
      'border-color': fallbackRing,

      // AURORA: base style does NOT auto-label nodes.
      // Labels are fully controlled in scripts.js (Universe + Orbit).
      label: '',
      color: nodeLabel,
      'font-size': 20,
      'text-wrap': 'wrap',
      'text-max-width': '110px',
      'text-halign': 'center',
      'text-valign': 'center',
      'text-outline-color': textOutline,
      'text-outline-width': .9,

      // interaction
      'overlay-opacity': 0,
      'z-index': 10
    };

    return [
      // Canvas hints
      { selector: 'core', style: {
          'selection-box-color': edgeColor,
          'selection-box-opacity': 0.12
        }
      },

      // All nodes (neutral fill + neutral ring)
      { selector: 'node', style: baseNode },

      // AURORA: category color & glow only when hovered
      { selector: 'node.hovered', style: {
          // if bucket_color exists, use it; otherwise this falls back to the neutral ring
          'border-color': 'data(bucket_color)',
          'shadow-blur': 16,
          'shadow-color': 'data(bucket_color)',
          'shadow-opacity': 0.85,
          'shadow-offset-x': 0,
          'shadow-offset-y': 0
        }
      },

      // Selected emphasis
      { selector: 'node:selected', style: {
          'border-width': RING_WIDTH + 1,
          'z-index': 20
        }
      },

      // Edges
      { selector: 'edge', style: {
          width: 1,
          opacity: edgeOpacity,
          'line-color': edgeColor,
          'curve-style': 'bezier',
          'target-arrow-shape': 'none'
        }
      },

      // Utility
      { selector: '.hidden', style: { display: 'none' } }
    ];
  }

  function apply(cy) {
    if (!cy) return;
    cy.style(styles()).update();

    // Ensure canvas background matches theme
    const isDark = document.documentElement.classList.contains('dark');
    const baseBg = isDark ? '#111827' : '#ffffff';
    cy.container().style.backgroundColor = baseBg;
  }

  // Export
  window.Skin = { styles, apply };
})();
