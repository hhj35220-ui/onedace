/* Lightweight Icon manager (category-based) */
(function(){
  if (!window.OP) window.OP = {};
  if (window.OP.iconsManager) return;

  const SPRITE_ID = 'op-icons-sprite';
  class IconsManager {
    constructor(){ this._loaded = !!document.getElementById(SPRITE_ID); }
    ensureLoaded(){ if (this._loaded) return Promise.resolve(); return fetch('/assets/icons.svg').then(r=>r.text()).then(svg=>{ if (!document.getElementById(SPRITE_ID)){ const div=document.createElement('div');div.id=SPRITE_ID;div.style.display='none';div.innerHTML=svg;document.body.insertBefore(div,document.body.firstChild);} this._loaded=true; }).catch(()=>{}); }
    icon(name, cls){ return `<svg class="icon ${cls||''}" aria-hidden="true"><use xlink:href="#icon-${name}"></use></svg>`; }
  }
  window.OP.icons = new IconsManager();
})();
