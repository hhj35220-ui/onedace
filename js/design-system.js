/* OnePlace Enterprise — Design System Manager
   Exposes window.OP.design
*/
(function(){
  if (!window.OP) window.OP = {};
  if (window.OP.designInstance) return;

  const DS_KEY = 'op_theme';
  const ICON_SPRITE_ID = 'op-icons-sprite';

  class DesignSystem {
    constructor(){
      if (window.OP.designInstance) return window.OP.designInstance;
      this._components = new Map();
      this._inited = false;
      this._iconsInjected = false;
      window.OP.designInstance = this;
    }

    init(){
      if (this._inited) return;
      this._inited = true;
      this._applyStoredTheme();
      document.documentElement.style.colorScheme = this.getCurrentTheme();
      this._injectIcons();

      // register built-in base components (modal, toast, dropdown)
      try {
        // Modal factory
        const modalFactory = (function(){
          let root = null;
          function ensure(){ if (root) return root; root = document.createElement('div'); root.className = 'ds-modal sr-only'; root.innerHTML = '<div class="ds-modal-panel" role="dialog" aria-modal="true"></div>'; document.body.appendChild(root); return root; }
          return {
            show(contentHtml){ const r=ensure(); r.classList.remove('sr-only'); r.querySelector('.ds-modal-panel').innerHTML = contentHtml || ''; r.addEventListener('click', (e)=>{ if (e.target===r) this.hide(); }); },
            hide(){ if (!root) return; root.classList.add('sr-only'); },
            refresh(){}
          };
        })();

        // Toast factory
        const toastFactory = (function(){
          let container = null;
          function ensure(){ if (container) return container; container = document.createElement('div'); container.className = 'ds-toast-container'; document.body.appendChild(container); return container; }
          return {
            show(msg, opts={type:'default',duration:4000}){ const c=ensure(); const t=document.createElement('div'); t.className='ds-toast'; t.textContent=msg; c.appendChild(t); setTimeout(()=>t.remove(), opts.duration||4000); },
            refresh(){}
          };
        })();

        // Dropdown (simple) factory
        const dropdownFactory = (function(){
          return {
            create(triggerEl, menuHtml){ if (!triggerEl) return; let menu=document.createElement('div'); menu.className='ds-dropdown'; menu.innerHTML=menuHtml; document.body.appendChild(menu); const rect=triggerEl.getBoundingClientRect(); menu.style.position='absolute'; menu.style.top=(rect.bottom+window.scrollY)+'px'; menu.style.left=(rect.left+window.scrollX)+'px'; function hide(){ menu.remove(); }
              triggerEl.addEventListener('blur', hide, {once:true}); return { el:menu, hide };
            },
            refresh(){}
          };
        })();

        this.registerComponent('modal', modalFactory);
        this.registerComponent('toast', toastFactory);
        this.registerComponent('dropdown', dropdownFactory);
      } catch(e) { /* ignore */ }
    }

    destroy(){
      this._components.clear();
      this._inited = false;
    }

    refresh(){
      // placeholder for future refresh hooks
      document.documentElement.style.setProperty('--ds-refresh-ts', Date.now());
    }

    registerComponent(name, factory){
      if (!name || this._components.has(name)) return;
      this._components.set(name, factory);
    }

    unregisterComponent(name){
      if (!name) return; this._components.delete(name);
    }

    getComponent(name){
      return this._components.get(name) || null;
    }

    getComponents(){
      return Array.from(this._components.keys());
    }

    getTokens(){
      // return a snapshot of CSS custom properties
      const styles = getComputedStyle(document.documentElement);
      const tokens = {};
      for (let i=0;i<styles.length;i++){
        const key = styles[i];
        if (key.startsWith('--')) tokens[key] = styles.getPropertyValue(key).trim();
      }
      return tokens;
    }

    theme(){ return this.getCurrentTheme(); }

    setTheme(theme){
      if (!theme) return;
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem(DS_KEY, theme);
    }

    toggleTheme(){
      const cur = this.getCurrentTheme();
      const next = cur === 'dark' ? 'light' : 'dark';
      this.setTheme(next);
    }

    getCurrentTheme(){
      const stored = localStorage.getItem(DS_KEY);
      if (stored) {
        if (stored === 'system') {
          return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return stored;
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    refreshComponents(){
      // call factory refresh if provided
      this._components.forEach((factory,name)=>{
        try{ if (factory && typeof factory.refresh === 'function') factory.refresh(); }catch(e){}
      });
    }

    _applyStoredTheme(){ const t = this.getCurrentTheme(); if (t) document.documentElement.setAttribute('data-theme', t); }

    _injectIcons(){
      if (this._iconsInjected) return;
      if (document.getElementById(ICON_SPRITE_ID)) { this._iconsInjected = true; return; }
      // lazy fetch sprite
      fetch('/assets/icons.svg').then(res=>{ if (!res.ok) throw new Error('no-sprite'); return res.text(); }).then(svg=>{
        const div = document.createElement('div'); div.id = ICON_SPRITE_ID; div.style.display='none'; div.innerHTML = svg; document.body.insertBefore(div, document.body.firstChild); this._iconsInjected = true;
      }).catch(()=>{ /* ignore if sprite missing */ });
    }
  }

  const ds = new DesignSystem();
  window.OP.design = {
    init: ()=>ds.init(), destroy: ()=>ds.destroy(), refresh: ()=>ds.refresh(),
    registerComponent: (n,f)=>ds.registerComponent(n,f), unregisterComponent: (n)=>ds.unregisterComponent(n),
    getComponent: (n)=>ds.getComponent(n), getComponents: ()=>ds.getComponents(), getTokens: ()=>ds.getTokens(),
    theme: ()=>ds.theme(), setTheme: (t)=>ds.setTheme(t), toggleTheme: ()=>ds.toggleTheme(), getCurrentTheme: ()=>ds.getCurrentTheme(),
    refreshComponents: ()=>ds.refreshComponents(),
    _internal: ds
  };
})();
