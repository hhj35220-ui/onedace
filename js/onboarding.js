/* OnePlace Enterprise — Onboarding Manager
   Features: Welcome modal, product tour, workspace wizard, checklist, trial tracking
   Exposes: window.OP.onboarding
*/
(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.onboardingInstance) return; // singleton

  const ONB = {
    META: 'op_onboarding_meta',
    CHECKLIST: 'op_onboarding_checklist',
    WIZARD: 'op_onboarding_wizard',
    TOUR: 'op_onboarding_tour',
    TRIAL: 'op_onboarding_trial',
    DISMISSED: 'op_onboarding_dismissed',
    PREFS: 'op_onboarding_prefs'
  };

  class OnboardingManager {
    constructor() {
      if (window.OP.onboardingInstance) return window.OP.onboardingInstance;
      this.initialized = false;
      this.listenersBound = false;
      this.checklist = this._defaultChecklist();
      this.meta = this._loadMeta() || { started: false, completed: false };
      this.tourState = this._load(ONB.TOUR) || { step: 0, seen: false };
      this.wizardState = this._load(ONB.WIZARD) || { step: 0, data: {} };
      this.trial = this._load(ONB.TRIAL) || null;
      this._scanInterval = null;
      window.OP.onboardingInstance = this;
    }

    init() {
      if (this.initialized) return;
      this.initialized = true;
      this._ensureDOM();
      this._bindListeners();
      this.refreshChecklist();
      this._autoDetectState();
    }

    // Public API
    start() { this.meta.started = true; this._saveMeta(); this.showWelcome(); }
    resume() { this.showWizard(); }
    nextStep() { this._next(); }
    previousStep() { this._prev(); }
    skip() { this._skip(); }
    finish() { this._finish(); }
    reset() { localStorage.removeItem(ONB.META); localStorage.removeItem(ONB.CHECKLIST); localStorage.removeItem(ONB.WIZARD); localStorage.removeItem(ONB.TOUR); localStorage.removeItem(ONB.TRIAL); location.reload(); }
    getProgress() { return this._computeProgress(); }
    isCompleted() { return !!this.meta.completed; }
    refreshChecklist() { this._refreshChecklistFromState(); this._renderChecklist(); }
    showWelcome() { this._openWelcome(); }
    showChecklist() { this._openChecklist(); }
    showWizard() { this._openWizard(); }

    // Internal helpers
    _load(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
    _save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
    _loadMeta() { return this._load(ONB.META); }
    _saveMeta() { this._save(ONB.META, this.meta); }

    _defaultChecklist() {
      return [
        { id: 'profile', title: 'Complete profile', done: false, detect: () => !!window.OP.profile.getProfile() },
        { id: 'logo', title: 'Upload workspace logo', done: false, detect: () => { const w = window.OP.workspace.getCurrentWorkspace(); return !!(w && w.logo); } },
        { id: 'gmail', title: 'Connect Gmail', done: false, detect: () => this._detectIntegration('gmail') },
        { id: 'whatsapp', title: 'Connect WhatsApp', done: false, detect: () => this._detectIntegration('whatsapp') },
        { id: 'invite', title: 'Invite teammate', done: false, detect: () => this._detectInvite() },
        { id: 'crm_contact', title: 'Create first CRM contact', done: false, detect: () => this._detectCollectionHasItems(['contact','contacts','crm']) },
        { id: 'first_task', title: 'Create first task', done: false, detect: () => this._detectCollectionHasItems(['task','tasks']) },
        { id: 'calendar_event', title: 'Schedule first calendar event', done: false, detect: () => this._detectCollectionHasItems(['calendar','events']) },
        { id: 'ai', title: 'Enable AI Assistant', done: false, detect: () => !!this._load('op_ai_settings') }
      ];
    }

    _ensureDOM() {
      if (document.getElementById('op-onboarding-root')) return;
      const root = document.createElement('div');
      root.id = 'op-onboarding-root';
      root.innerHTML = `
        <div id="op-onboarding-welcome" class="op-onb-modal" role="dialog" aria-modal="true" aria-hidden="true">
          <div class="op-onb-panel">
            <button class="op-onb-close" aria-label="Close">×</button>
            <h2 class="op-onb-title">Welcome to OnePlace</h2>
            <p class="op-onb-sub">Let's get your workspace set up. You have a 14-day free trial.</p>
            <div class="op-onb-actions">
              <button class="op-onb-start primary">Get Started</button>
              <button class="op-onb-skip">Skip for now</button>
            </div>
          </div>
        </div>

        <div id="op-onboarding-wizard" class="op-onb-modal" role="dialog" aria-modal="true" aria-hidden="true">
          <div class="op-onb-panel op-wizard">
            <button class="op-onb-close" aria-label="Close">×</button>
            <div class="op-wizard-steps" aria-live="polite"></div>
            <div class="op-wizard-body"></div>
            <div class="op-wizard-footer">
              <button class="op-wiz-back">Back</button>
              <button class="op-wiz-next primary">Next</button>
            </div>
          </div>
        </div>

        <div id="op-onboarding-checklist" class="op-onb-panel-right" aria-hidden="true">
          <div class="op-checklist-head">
            <h3>Getting started</h3>
            <button class="op-checklist-close" aria-label="Close">×</button>
          </div>
          <div class="op-checklist-body"></div>
          <div class="op-checklist-footer"><div class="op-checklist-progress"><span class="op-progress-percent">0%</span></div></div>
        </div>

        <div id="op-onboarding-tour-overlay" class="op-onb-tour" aria-hidden="true"></div>
      `;
      document.body.appendChild(root);
    }

    _bindListeners() {
      if (this.listenersBound) return;
      this.listenersBound = true;

      // Welcome buttons
      document.addEventListener('click', (e) => {
        if (e.target.closest('.op-onb-start')) { this._startWizardFromWelcome(); }
        if (e.target.closest('.op-onb-skip')) { this._skip(); }
        if (e.target.closest('.op-onb-close') || e.target.closest('.op-checklist-close')) { this._closeAll(); }
      });

      // Wizard nav
      document.addEventListener('click', (e) => {
        if (e.target.closest('.op-wiz-next')) this._next();
        if (e.target.closest('.op-wiz-back')) this._prev();
      });

      // Keyboard accessibility
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._closeAll();
      });

      // Storage change detection (other tabs/modules)
      window.addEventListener('storage', (e) => {
        this.refreshChecklist();
      });

      // Periodic scan for changes in the app (detect actions)
      this._scanInterval = setInterval(() => this.refreshChecklist(), 3000);
    }

    _autoDetectState() {
      // Trial: start when workspace exists
      const ws = window.OP.workspace.getCurrentWorkspace();
      if (ws && !this.trial) {
        this.trial = { startDate: ws.createdAt || new Date().toISOString(), days: 14 };
        this._save(ONB.TRIAL, this.trial);
      }

      // First-time user welcome
      const dismissed = localStorage.getItem(ONB.DISMISSED);
      if (!dismissed && !this.meta.started) {
        // show welcome in small delay
        setTimeout(() => this._openWelcome(), 800);
      }
    }

    _openWelcome() {
      const el = document.getElementById('op-onboarding-welcome');
      if (!el) return;
      el.setAttribute('aria-hidden', 'false');
      el.classList.add('open');
      this._trapFocus(el);
    }

    _openChecklist() {
      const el = document.getElementById('op-onboarding-checklist');
      if (!el) return;
      el.setAttribute('aria-hidden', 'false');
      el.classList.add('open');
      this._renderChecklist();
      this._trapFocus(el);
    }

    _openWizard() {
      const el = document.getElementById('op-onboarding-wizard');
      if (!el) return;
      el.setAttribute('aria-hidden', 'false');
      el.classList.add('open');
      this._renderWizard();
      this._trapFocus(el);
    }

    _closeAll() {
      const nodes = document.querySelectorAll('#op-onboarding-welcome, #op-onboarding-wizard, #op-onboarding-checklist, #op-onboarding-tour-overlay');
      nodes.forEach(n => { n.setAttribute('aria-hidden', 'true'); n.classList.remove('open'); });
      document.activeElement?.blur();
    }

    _startWizardFromWelcome() {
      this.meta.started = true; this._saveMeta(); this._openWizard();
    }

    _next() {
      this.wizardState.step = (this.wizardState.step || 0) + 1;
      this._save(ONB.WIZARD, this.wizardState);
      this._renderWizard();
    }

    _prev() {
      this.wizardState.step = Math.max(0, (this.wizardState.step || 0) - 1);
      this._save(ONB.WIZARD, this.wizardState);
      this._renderWizard();
    }

    _skip() { localStorage.setItem(ONB.DISMISSED, '1'); this._closeAll(); }

    _finish() { this.meta.completed = true; this._saveMeta(); this._closeAll(); this._awardBadge(); }

    _awardBadge() {
      // Simple local badge flag that other UI may read
      localStorage.setItem('op_onboarding_badge', JSON.stringify({ awardedAt: new Date().toISOString() }));
    }

    _trapFocus(el) {
      const focusable = el.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length-1];
      if (first) first.focus();
      function handle(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      el.addEventListener('keydown', handle);
      // remove listener when closed
      const observer = new MutationObserver(() => {
        if (el.getAttribute('aria-hidden') === 'true') { el.removeEventListener('keydown', handle); observer.disconnect(); }
      });
      observer.observe(el, { attributes: true, attributeFilter: ['aria-hidden'] });
    }

    _renderChecklist() {
      const container = document.querySelector('#op-onboarding-checklist .op-checklist-body');
      if (!container) return;
      const loadedChecklist = this._load(ONB.CHECKLIST);
      const saved = Array.isArray(loadedChecklist) ? loadedChecklist : this.checklist;
      const percent = this._computeProgress();
      container.innerHTML = saved.map(it => `
        <div class="op-check-item" data-id="${it.id}">
          <label><input type="checkbox" ${it.done ? 'checked' : ''} disabled /> ${it.title}</label>
        </div>
      `).join('');
      document.querySelector('.op-progress-percent').textContent = `${percent}%`;
      if (percent === 100) {
        container.insertAdjacentHTML('beforeend', '<div class="op-complete-badge">🎉 Setup complete</div>');
      }
    }

    _computeProgress() {
      const loadedChecklist = this._load(ONB.CHECKLIST);
      const saved = Array.isArray(loadedChecklist) ? loadedChecklist : this.checklist;
      const total = saved.length || 1;
      const done = saved.filter(i => i.done).length;
      return Math.round((done / total) * 100);
    }

    _renderWizard() {
      const root = document.getElementById('op-onboarding-wizard');
      if (!root) return;
      const body = root.querySelector('.op-wizard-body');
      const stepsEl = root.querySelector('.op-wizard-steps');
      const step = this.wizardState.step || 0;
      const steps = [
        { id: 'workspace_info', title: 'Workspace information' },
        { id: 'upload_logo', title: 'Upload company logo' },
        { id: 'choose_theme', title: 'Choose theme' },
        { id: 'invite', title: 'Invite teammates' },
        { id: 'connect_integration', title: 'Connect integration' },
        { id: 'notifications', title: 'Enable notifications' },
        { id: 'ai_prefs', title: 'AI preferences' },
        { id: 'complete', title: 'Complete setup' }
      ];

      stepsEl.innerHTML = steps.map((s, idx) => `<div class="op-step ${idx===step?'active':''}">${s.title}</div>`).join('');

      const current = steps[step] || steps[steps.length-1];
      // Render minimal forms for each step
      switch (current.id) {
        case 'workspace_info':
          body.innerHTML = `
            <label>Workspace name<input id="op-wiz-workspace-name" type="text" value="${(window.OP.workspace.getCurrentWorkspace()||{}).name||''}" /></label>
            <label>Workspace URL<input id="op-wiz-workspace-url" type="text" value="${(window.OP.workspace.getCurrentWorkspace()||{}).url||''}" /></label>
          `;
          break;
        case 'upload_logo':
          body.innerHTML = `
            <label>Upload logo<input id="op-wiz-logo" type="file" accept="image/*" /></label>
            <div id="op-wiz-logo-preview"></div>
          `;
          body.querySelector('#op-wiz-logo')?.addEventListener('change', (e) => this._handleLogoUpload(e));
          break;
        case 'choose_theme':
          body.innerHTML = `
            <label><input type="radio" name="op-theme" value="light" ${document.documentElement.getAttribute('data-theme')==='light'?'checked':''} /> Light</label>
            <label><input type="radio" name="op-theme" value="dark" ${document.documentElement.getAttribute('data-theme')==='dark'?'checked':''} /> Dark</label>
          `;
          break;
        case 'invite':
          body.innerHTML = `
            <label>Invite teammate (email)<input id="op-wiz-invite-email" type="email" /></label>
            <button id="op-wiz-invite-send" class="primary">Send Invite</button>
            <div id="op-wiz-invite-result"></div>
          `;
          body.querySelector('#op-wiz-invite-send')?.addEventListener('click', () => this._sendInvite());
          break;
        case 'connect_integration':
          body.innerHTML = `
            <p>Connect an integration to get started.</p>
            <button id="op-wiz-connect-gmail">Connect Gmail</button>
            <button id="op-wiz-connect-whatsapp">Connect WhatsApp</button>
          `;
          body.querySelector('#op-wiz-connect-gmail')?.addEventListener('click', () => this._simulateConnect('gmail'));
          body.querySelector('#op-wiz-connect-whatsapp')?.addEventListener('click', () => this._simulateConnect('whatsapp'));
          break;
        case 'notifications':
          body.innerHTML = `
            <label><input type="checkbox" id="op-wiz-notifs" ${localStorage.getItem('op_notifications_enabled')==='1'?'checked':''} /> Enable browser notifications</label>
          `;
          break;
        case 'ai_prefs':
          body.innerHTML = `
            <label><input type="checkbox" id="op-wiz-ai" ${localStorage.getItem('op_ai_enabled')==='1'?'checked':''} /> Enable AI assistant</label>
          `;
          break;
        case 'complete':
          body.innerHTML = `<p>You're all set — finish to complete the setup.</p>`;
          break;
      }

      // Attach step footer behavior
      const back = document.querySelector('.op-wiz-back');
      const next = document.querySelector('.op-wiz-next');
      back.disabled = step === 0;
      next.textContent = step === steps.length-1 ? 'Finish' : 'Next';
      if (next && step === steps.length-1) {
        next.onclick = () => { this._finish(); };
      }
    }

    _handleLogoUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const ws = window.OP.workspace.getCurrentWorkspace();
        if (ws) { ws.logo = data; const wss = window.OP.workspace.getWorkspaces(); const i = wss.findIndex(w=>w.id===ws.id); if (i>-1) { wss[i]=ws; window.OP.workspace.saveWorkspaces(wss); } }
        const preview = document.getElementById('op-wiz-logo-preview'); if (preview) preview.innerHTML = `<img src="${data}" alt="logo" style="max-width:120px;" />`;
        this.refreshChecklist();
      };
      reader.readAsDataURL(file);
    }

    _sendInvite() {
      const email = document.getElementById('op-wiz-invite-email')?.value;
      if (!email) return;
      const ws = window.OP.workspace.getCurrentWorkspace();
      if (!ws) return;
      ws.members.push({ userId: email, role: 'Invited', joinedAt: new Date().toISOString() });
      const wss = window.OP.workspace.getWorkspaces();
      const i = wss.findIndex(w=>w.id===ws.id);
      if (i>-1) { wss[i]=ws; window.OP.workspace.saveWorkspaces(wss); }
      document.getElementById('op-wiz-invite-result').textContent = 'Invite sent.';
      this.refreshChecklist();
    }

    _simulateConnect(name) {
      // Mark an integration connected in localStorage for detection
      const key = `op_integration_${name}`;
      localStorage.setItem(key, JSON.stringify({ connectedAt: new Date().toISOString() }));
      this.refreshChecklist();
    }

    _detectIntegration(name) {
      try {
        const keys = Object.keys(localStorage);
        return keys.some(k => k.toLowerCase().includes(name));
      } catch { return false; }
    }

    _detectInvite() {
      try {
        const ws = window.OP.workspace.getCurrentWorkspace();
        return ws && Array.isArray(ws.members) && ws.members.length > 1;
      } catch { return false; }
    }

    _detectCollectionHasItems(keyFragments) {
      try {
        const keys = Object.keys(localStorage);
        for (const k of keys) {
          for (const frag of keyFragments) {
            if (k.toLowerCase().includes(frag)) {
              const val = JSON.parse(localStorage.getItem(k) || 'null');
              if (Array.isArray(val) && val.length > 0) return true;
            }
          }
        }
      } catch {}
      return false;
    }

    _refreshChecklistFromState() {
      const loadedChecklist = this._load(ONB.CHECKLIST);
      const saved = Array.isArray(loadedChecklist) ? loadedChecklist : this.checklist;
      // Update detection
      const updated = saved.map(item => ({ ...item, done: !!item.detect && !!item.detect() }));
      this._save(ONB.CHECKLIST, updated);
      this.checklist = updated;
    }

    _computeTrial() {
      if (!this.trial) return null;
      const start = new Date(this.trial.startDate);
      const end = new Date(start.getTime() + (this.trial.days * 24 * 60 * 60 * 1000));
      const now = new Date();
      const remaining = Math.max(0, Math.ceil((end - now) / (24*60*60*1000)));
      return { start: start.toISOString(), end: end.toISOString(), remaining, days: this.trial.days };
    }

    // Clean up on unload
    destroy() {
      if (this._scanInterval) clearInterval(this._scanInterval);
      this.initialized = false;
      this.listenersBound = false;
      window.OP.onboardingInstance = null;
    }
  }

  // Expose API
  const manager = new OnboardingManager();
  window.OP.onboarding = {
    init: () => manager.init(),
    start: () => manager.start(),
    resume: () => manager.resume(),
    nextStep: () => manager.nextStep(),
    previousStep: () => manager.previousStep(),
    skip: () => manager.skip(),
    finish: () => manager.finish(),
    reset: () => manager.reset(),
    getProgress: () => manager.getProgress(),
    isCompleted: () => manager.isCompleted(),
    refreshChecklist: () => manager.refreshChecklist(),
    showWelcome: () => manager.showWelcome(),
    showChecklist: () => manager.showChecklist(),
    showWizard: () => manager.showWizard(),
    _internal: manager
  };

})();
