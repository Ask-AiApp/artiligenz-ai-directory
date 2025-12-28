// views/index.js
(function(){
  const { placeUniverse } = window.UniverseView;
  const { placeOrbital } = window.OrbitalView;
  const { smartFit } = window.ViewUtils;

  // ✅ Grid view module
  const placeGrid = (cy) => window.GridView?.apply?.(cy);
  const destroyGrid = () => window.GridView?.destroy?.();

  window.Views = { placeUniverse, placeOrbital, smartFit, placeGrid, destroyGrid };
})();