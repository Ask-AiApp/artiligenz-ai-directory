// views/utils.js
(function(){
  // PRNG
  function rng(seed){ let t = seed>>>0; return ()=>{ t+=0x6D2B79F5; let r=Math.imul(t^t>>>15, t|1); r^=r+Math.imul(r^r>>>7, r|61); return ((r^r>>>14)>>>0)/4294967296; }; }

  // Simple dart-throwing (blue-noise-ish) within ellipse to avoid overlaps
  function blueNoiseEllipse(count, a, b, minDist, seed=42){
    const R=rng(seed), pts=[]; let attempts=0, maxAttempts=count*80;
    while(pts.length<count && attempts<maxAttempts){
      attempts++;
      const th=R()*Math.PI*2, rr=Math.sqrt(R());
      const x=a*rr*Math.cos(th), y=b*rr*Math.sin(th);
      let ok=true; for(const p of pts){ const dx=x-p.x, dy=y-p.y; if(Math.hypot(dx,dy)<minDist){ ok=false;break; } }
      if(ok) pts.push({x,y});
    }
    // if undersampled, jitter existing
    while(pts.length<count){ const i=(pts.length)%Math.max(1,pts.length); const p=pts[i]; pts.push({x:p.x+(R()-0.5)*minDist*0.4, y:p.y+(R()-0.5)*minDist*0.4}); }
    return pts;
  }

  // Pairwise post-pass collision relax
  function resolveCollisions(nodes, pos, radii, {iterations=6, strength=0.6}={}){
    const ids = nodes.map(n=> n.id());
    for(let it=0; it<iterations; it++){
      for(let i=0;i<ids.length;i++){
        for(let j=i+1;j<ids.length;j++){
          const a=ids[i], b=ids[j]; const pa=pos[a], pb=pos[b]; if(!pa||!pb) continue;
          const dx=pb.x-pa.x, dy=pb.y-pa.y; const d=Math.hypot(dx,dy)||1e-6;
          const minD=(radii[a]||12)+(radii[b]||12)+12;
          if(d<minD){ const push=(minD-d)*strength*0.5, ux=dx/d, uy=dy/d; pa.x-=ux*push; pa.y-=uy*push; pb.x+=ux*push; pb.y+=uy*push; }
        }
      }
    }
    return pos;
  }

  // Smart viewport fit
  function smartFit(cy, eles, pad=30){
    if(!eles || eles.length===0){ cy.fit(); return; }
    const bb=eles.boundingBox(), w=cy.width(), h=cy.height();
    const sx=(w-pad*2)/Math.max(bb.w,1), sy=(h-pad*2)/Math.max(bb.h,1), z=Math.min(sx,sy);
    const cx=(bb.x1+bb.x2)/2, cyy=(bb.y1+bb.y2)/2;
    cy.viewport({ zoom:z, pan:{ x:w/2-cx*z, y:h/2-cyy*z } });
  }

  window.ViewUtils = { rng, blueNoiseEllipse, resolveCollisions, smartFit };
})();