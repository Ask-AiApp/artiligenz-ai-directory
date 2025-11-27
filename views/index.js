// views/index.js
(function(){
  const { placeUniverse } = window.UniverseView;
  const { placeOrbital } = window.OrbitalView;
  const { smartFit } = window.ViewUtils;

  window.Views = { placeUniverse, placeOrbital, smartFit };
})();