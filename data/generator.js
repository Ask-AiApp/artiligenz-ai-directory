// /data/generator.js
// Deterministic synthetic dataset for stress testing templates & fit.

(function (global) {
  // Simple seeded PRNG (mulberry32)
  function mulberry32(seed) {
    return function() {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const CATEGORIES = [
    'Foundation','Infrastructure','Creative','Developer',
    'Application','Hardware','Enterprise'
  ];
  const COUNTRIES = [
    ['United States','🇺🇸'], ['United Kingdom','🇬🇧'],
    ['Canada','🇨🇦'], ['France','🇫🇷'], ['Germany','🇩🇪'],
    ['China','🇨🇳'], ['Israel','🇮🇱'], ['Japan','🇯🇵']
  ];
  const RELATIONS = ['competes-with','partners-with','uses-infra'];
  const STATUSES  = ['active','emerging','breakthrough'];

  function make(N = 50, opts = {}) {
    const seed = Number.isFinite(opts.seed) ? opts.seed : 42;
    const rnd = mulberry32(seed);

    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const nodes = [];
    for (let i = 1; i <= N; i++) {
      const id = 'g' + i;
      const [country, flag] = pick(COUNTRIES);
      const category = pick(CATEGORIES);
      const pagerank = Math.round((0.05 + rnd() * 0.95) * 100) / 100;
      const status = pick(STATUSES);
      nodes.push({
        data: {
          id,
          name: `Synth ${i}`,
          category,
          community_id: `${category.toLowerCase().replace(/\s+/g,'-')}-grp`,
          pagerank,
          status,
          country,
          flag,
          summary: `Generated node ${i} in ${category}`
        }
      });
    }

    // Connect in a small-world-ish way:
    // - each node links to k nearest ids, plus a few random long edges
    const k = opts.k ?? Math.max(2, Math.round(Math.log2(N)));
    const longEdges = Math.max(1, Math.round(N * 0.1));
    const edges = [];
    const idOf = (i) => 'g' + i;

    // local neighbors (ring-like)
    for (let i = 1; i <= N; i++) {
      for (let d = 1; d <= k; d++) {
        const j = ((i - 1 + d) % N) + 1;
        const weight = Math.round((0.4 + rnd() * 0.6) * 100) / 100;
        edges.push({
          data: {
            id: `e_${i}_${d}`,
            source: idOf(i),
            target: idOf(j),
            relation: pick(RELATIONS),
            weight
          }
        });
      }
    }

    // random long-range edges
    for (let e = 0; e < longEdges; e++) {
      const a = Math.floor(rnd() * N) + 1;
      let b = Math.floor(rnd() * N) + 1;
      if (b === a) b = (b % N) + 1;
      edges.push({
        data: {
          id: `el_${e}`,
          source: idOf(a),
          target: idOf(b),
          relation: pick(RELATIONS),
          weight: Math.round((0.3 + rnd() * 0.7) * 100) / 100
        }
      });
    }

    return { nodes, edges };
  }

  global.DirectoryGenerator = { make };
})(window);
