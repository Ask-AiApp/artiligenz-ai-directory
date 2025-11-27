// views/orbitalview.js
(function(){
  // Tilted orbital drill-in view
  function placeOrbital(center, children, opts={}){
    const tilt = (opts.tiltDeg ?? 24) * Math.PI/180;
    const r = opts.radius ?? 260;
    const pos = {};
    pos[center.id()] = { x: 0, y: 0 };
    const n = Math.max(children.length, 1);
    for(let i=0;i<n;i++){
      const ang = (i/n)*Math.PI*2;
      const x = r*Math.cos(ang);
      const y = r*Math.sin(ang)*Math.cos(tilt);
      const nd = children[i]; if(nd) pos[nd.id()] = { x, y };
    }
    return pos;
  }
  window.OrbitalView = { placeOrbital };

// add this ↓↓↓
window.Views = window.Views || {};
window.Views.placeOrbital = window.OrbitalView.placeOrbital;
})();