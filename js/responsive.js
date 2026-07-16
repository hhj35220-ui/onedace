/* OnePlace Enterprise — Responsive Manager
   Handles breakpoints, sidebar, mobile nav, tables, cards, forms, accessibility
*/
(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.responsiveInstance) return;

  const BREAKPOINTS = {
    MOBILE_MAX: 767,
    TABLET_MIN: 768,
    TABLET_MAX: 1023,
    LAPTOP_MIN: 1024,
    LAPTOP_MAX: 1439,
    DESKTOP_MIN: 1440
  };

  // simple debounce util
  function debounce(fn, wait) {
    let t = null;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  class ResponsiveManager {
    constructor() {
      if (window.OP.responsiveInstance) return window.OP.responsiveInstance;
      this._inited = false;
      this._listenersBound = false;
      this._resizeTimer = null;
      this._notifyTimer = null;
      this._routeListenerBound = false;
      this._swipe = { startX:0, startY:0, active:false };
      window.OP.responsiveInstance = this;
    }

    init() {
      if (this._inited) return;
      this._inited = true;
      this._applyResponsiveClasses();
      this._injectMobileNav();
      this._bind();
      // bind a lightweight route-change listener once (supports dispatchEvent or manual calls)
      if (!this._routeListenerBound) {
        this._routeListenerBound = true;
        window.addEventListener('op:route:change', () => this.notifyRouteChange());
      }
    }

    destroy() {
      if (!this._inited) return;
      this._unbind();
      this._removeMobileNav();
      this._inited = false;
      window.OP.responsiveInstance = null;
    }

    refresh() { this._applyResponsiveClasses(); this._updateStickyTables(); }

    // notifyRouteChange: debounced entry point to refresh responsive state after navigation
    notifyRouteChange() {
      if (this._notifyTimer) clearTimeout(this._notifyTimer);
      this._notifyTimer = setTimeout(() => {
        try {
          this._applyResponsiveClasses();
          this._updateCardGrids();
          this._updateTableResponsiveness();
          this._updateStickyTables();
          this._highlightActiveMobileNav();
          // Keep drawer state aligned with breakpoint
          const sb = this._sidebar();
          if (sb) {
            if (this._current === 'mobile' || this._current === 'tablet') sb.classList.add('collapsed');
            else sb.classList.remove('collapsed');
          }
        } catch (e) { /* swallow errors */ }
      }, 120);
    }

    getCurrentBreakpoint() { return this._current; }
    isMobile() { return this._current === 'mobile'; }
    isTablet() { return this._current === 'tablet'; }
    isDesktop() { return this._current === 'desktop' || this._current === 'laptop'; }

    toggleSidebar() { const sb = this._sidebar(); if (!sb) return; sb.classList.toggle('collapsed'); }
    openSidebar() { const sb = this._sidebar(); if (!sb) return; sb.classList.remove('collapsed'); document.documentElement.classList.add('sidebar-open'); }
    closeSidebar() { const sb = this._sidebar(); if (!sb) return; sb.classList.add('collapsed'); document.documentElement.classList.remove('sidebar-open'); }

    // Internal
    _sidebar() {
      return document.querySelector('.sidebar') || document.querySelector('#sidebar') || document.querySelector('.app-sidebar');
    }

    _applyResponsiveClasses() {
      const w = window.innerWidth;
      let bp = 'desktop';
      if (w <= BREAKPOINTS.MOBILE_MAX) bp = 'mobile';
      else if (w >= BREAKPOINTS.TABLET_MIN && w <= BREAKPOINTS.TABLET_MAX) bp = 'tablet';
      else if (w >= BREAKPOINTS.LAPTOP_MIN && w <= BREAKPOINTS.LAPTOP_MAX) bp = 'laptop';
      else if (w >= BREAKPOINTS.DESKTOP_MIN) bp = 'desktop';
      this._current = bp;
      document.documentElement.setAttribute('data-breakpoint', bp);
      // Sidebar behavior
      const sb = this._sidebar();
      if (sb) {
        if (bp === 'desktop' || bp === 'laptop') { sb.classList.remove('collapsed'); document.documentElement.classList.remove('sidebar-collapsed'); }
        else { sb.classList.add('collapsed'); document.documentElement.classList.add('sidebar-collapsed'); }
      }
      this._updateCardGrids();
      this._updateTableResponsiveness();
    }

    _updateCardGrids() {
      // find common grid containers
      const grids = document.querySelectorAll('.card-grid, .cards, .widget-grid, .dashboard-widgets');
      grids.forEach(grid => {
        grid.style.display = 'grid';
        const bp = this._current;
        let cols = 4;
        if (bp === 'desktop') cols = 4;
        else if (bp === 'laptop') cols = 3;
        else if (bp === 'tablet') cols = 2;
        else cols = 1;
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gap = '12px';
      });
    }

    _updateTableResponsiveness() {
      // make tables horizontally scrollable and sticky headers
      const tables = document.querySelectorAll('table');
      tables.forEach(t => {
        const wrapperClass = 'op-table-wrap';
        if (!t.parentElement.classList.contains(wrapperClass)) {
          const wrap = document.createElement('div');
          wrap.className = wrapperClass;
          t.parentElement.insertBefore(wrap, t);
          wrap.appendChild(t);
        }
        // sticky headers
        const ths = t.querySelectorAll('thead th');
        ths.forEach(th => { th.style.position = 'sticky'; th.style.top = '0'; th.style.zIndex = '2'; th.style.background = 'var(--table-header-bg, var(--onb-panel, #fff))'; });
      });
      this._updateStickyTables();
    }

    _updateStickyTables() {
      // adjust sticky header widths when needed
      const wraps = document.querySelectorAll('.op-table-wrap');
      wraps.forEach(w => {
        w.style.overflowX = 'auto';
        w.style.webkitOverflowScrolling = 'touch';
      });
    }

    _injectMobileNav() {
      if (document.getElementById('op-mobile-nav')) return;
      const nav = document.createElement('nav');
      nav.id = 'op-mobile-nav';
      nav.className = 'op-mobile-nav';
      nav.innerHTML = `
        <button data-route="/" class="op-mobile-btn" aria-label="Home">Home</button>
        <button data-route="/inbox/" class="op-mobile-btn" aria-label="Inbox">Inbox</button>
        <button data-route="/crm/" class="op-mobile-btn" aria-label="CRM">CRM</button>
        <button data-route="/calendar/" class="op-mobile-btn" aria-label="Calendar">Calendar</button>
        <button data-route="/notifications/" class="op-mobile-btn" aria-label="Notifications">Notifications</button>
      `;
      document.body.appendChild(nav);
      this._highlightActiveMobileNav();
      nav.addEventListener('click', (e) => {
        const btn = e.target.closest('.op-mobile-btn');
        if (!btn) return;
        const route = btn.dataset.route;
        if (route) window.location.href = route;
      });
    }

    _removeMobileNav() { const n = document.getElementById('op-mobile-nav'); if (n) n.remove(); }

    _highlightActiveMobileNav() {
      const path = window.location.pathname.toLowerCase();
      const btns = document.querySelectorAll('#op-mobile-nav .op-mobile-btn');
      btns.forEach(b => b.classList.remove('active'));
      let matched = Array.from(btns).find(b => path.startsWith((b.dataset.route||'').toLowerCase()));
      if (!matched) matched = btns[0];
      if (matched) matched.classList.add('active');
    }

    _bind() {
      if (this._listenersBound) return;
      this._listenersBound = true;

      // Debounced resize
      const onResize = () => {
        clearTimeout(this._resizeTimer);
        this._resizeTimer = setTimeout(() => { this._applyResponsiveClasses(); this._highlightActiveMobileNav(); }, 120);
      };
      window.addEventListener('resize', onResize);

      // Orientation change
      window.addEventListener('orientationchange', () => { setTimeout(() => this._applyResponsiveClasses(), 200); });

      // Passive touch listeners for swipe gestures (mobile sidebar)
      const passiveOpt = { passive: true };
      document.addEventListener('touchstart', (e) => this._onTouchStart(e), passiveOpt);
      document.addEventListener('touchmove', (e) => this._onTouchMove(e), passiveOpt);
      document.addEventListener('touchend', (e) => this._onTouchEnd(e));

      // Listen to route changes to update active mobile nav (if SPA uses pushState)
      window.addEventListener('popstate', () => this._highlightActiveMobileNav());
      // Also intercept clicks on nav links to update highlight
      document.addEventListener('click', (e) => { if (e.target.closest('a')) setTimeout(()=>this._highlightActiveMobileNav(), 50); });
    }

    _unbind() {
      // best-effort removal; keep minimal messages
      this._listenersBound = false;
    }

    _onTouchStart(e) {
      if (!e.touches || e.touches.length > 1) return;
      this._swipe.startX = e.touches[0].clientX;
      this._swipe.startY = e.touches[0].clientY;
      this._swipe.active = true;
    }

    _onTouchMove(e) {
      if (!this._swipe.active) return;
      const dx = e.touches[0].clientX - this._swipe.startX;
      const dy = e.touches[0].clientY - this._swipe.startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        // horizontal swipe
        const bp = this._current;
        if (bp === 'mobile') {
          if (dx > 0) this.openSidebar(); else this.closeSidebar();
          this._swipe.active = false;
        }
      }
    }

    _onTouchEnd() { this._swipe.active = false; }
  }

  const manager = new ResponsiveManager();
  window.OP.responsive = {
    init: () => manager.init(),
    destroy: () => manager.destroy(),
    refresh: () => manager.refresh(),
    getCurrentBreakpoint: () => manager.getCurrentBreakpoint(),
    isMobile: () => manager.isMobile(),
    isTablet: () => manager.isTablet(),
    isDesktop: () => manager.isDesktop(),
    toggleSidebar: () => manager.toggleSidebar(),
    openSidebar: () => manager.openSidebar(),
    closeSidebar: () => manager.closeSidebar(),
    notifyRouteChange: () => manager.notifyRouteChange(),
    _internal: manager
  };

})();
