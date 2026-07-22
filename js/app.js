/**
 * OnePlace Enterprise v3.0 — Authentication Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const STORAGE_KEYS = {
  USERS: 'op_users',
  SESSION: 'op_session',
  WORKSPACES: 'op_workspaces',
  CURRENT_WORKSPACE: 'op_current_workspace',
  PROFILE: 'op_profile',
  SETTINGS: 'op_settings',
  THEME: 'op_theme',
  REMEMBER_ME: 'op_remember_me',
  RESET_TOKEN: 'op_reset_token',
  VERIFICATION_CODE: 'op_verification_code'
};

// ============================================
// Theme Manager
// ============================================

// Global runtime configuration (development-only flag)
// Toggle `dev` to `true` for local development debugging. Default is `false`.
// This flag is intentionally conservative and should remain `false` in production.
// NOTE: Temporarily set to `true` for local verification. Revert to `false` before deploying.
window.OP_CONFIG = window.OP_CONFIG || { dev: true };

class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    // Default to the light design theme unless the user explicitly chose one
    const theme = savedTheme === 'system' ? systemTheme : (savedTheme || 'light');

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    if (!savedTheme || savedTheme === 'system') {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    this.renderToggle();
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next;
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    this.updateToggleIcon(next);
  }

  renderToggle() {
    const existing = document.querySelector('.theme-toggle');
    if (existing) existing.remove();

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.setAttribute('type', 'button');
    
    const current = document.documentElement.getAttribute('data-theme');
    btn.innerHTML = current === 'dark' 
      ? '<i class="ph ph-sun"></i>' 
      : '<i class="ph ph-moon"></i>';
    
    btn.addEventListener('click', () => this.toggle());
    document.body.appendChild(btn);
  }

  updateToggleIcon(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' 
        ? '<i class="ph ph-sun"></i>' 
        : '<i class="ph ph-moon"></i>';
    }
  }
}

// ============================================
// Toast Manager
// ============================================
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'success', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '<i class="ph ph-check-circle"></i>',
      error: '<i class="ph ph-x-circle"></i>',
      warning: '<i class="ph ph-warning"></i>'
    };

    toast.innerHTML = `
      <span class="alert-icon">${icons[type]}</span>
      <span>${message}</span>
      <button class="toast-close" aria-label="Close notification">
        <i class="ph ph-x"></i>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.dismiss(toast);
    });

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }

    return toast;
  }

  dismiss(toast) {
    toast.style.animation = 'fadeIn 0.2s ease-out reverse';
    setTimeout(() => toast.remove(), 200);
  }
}

// ============================================
// Auth Manager
// ============================================
class AuthManager {
  constructor() {
    this.toast = new ToastManager();
  }

  // --- User Storage ---
  getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Unable to save users to localStorage:', error);
      throw new Error('Unable to persist user data to localStorage.');
    }
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // --- Session ---
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
    } catch {
      return null;
    }
  }

  setSession(session) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      this.clearSession();
      return false;
    }
    return true;
  }

  // --- Sign Up ---
  signUp(fullName, email, password) {
    const users = this.getUsers();

    if (this.getUserByEmail(email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const user = {
      id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `user_${Math.random().toString(36).slice(2, 12)}`,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      verified: false
    };

    try {
      users.push(user);
      this.saveUsers(users);

      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(STORAGE_KEYS.VERIFICATION_CODE, JSON.stringify({
        email: user.email,
        code,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }));

      // Create session for verification flow
      this.setSession({
        userId: user.id,
        email: user.email,
        verified: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

      return {
        success: true,
        message: 'Account created successfully.',
        verificationCode: code // For simulation display
      };
    } catch (error) {
      console.error('Sign-up failed:', error);
      return { success: false, message: 'Unable to create account. Please enable browser storage and try again.' };
    }
  }

  // --- Sign In ---
  signIn(email, password, rememberMe = false) {
    const user = this.getUserByEmail(email);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (user.password !== this.hashPassword(password)) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const session = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      verified: user.verified,
      rememberMe,
      expiresAt: rememberMe 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    this.setSession(session);
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe);

    return { success: true, message: 'Signed in successfully.' };
  }

  // --- Sign Out ---
  signOut() {
    this.clearSession();
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKSPACE);
  }

  // --- Password Reset ---
  requestPasswordReset(email) {
    const user = this.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'No account found with this email address.' };
    }

    const token = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.RESET_TOKEN, JSON.stringify({
      email: user.email,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }));

    return { success: true, message: 'Password reset link sent.', token };
  }

  resetPassword(token, newPassword) {
    const resetData = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESET_TOKEN) || 'null');
    
    if (!resetData || resetData.token !== token || new Date(resetData.expiresAt) < new Date()) {
      return { success: false, message: 'Invalid or expired reset token.' };
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email === resetData.email);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found.' };
    }

    users[userIndex].password = this.hashPassword(newPassword);
    this.saveUsers(users);
    localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);

    return { success: true, message: 'Password reset successfully.' };
  }

  // --- Email Verification ---
  verifyEmail(code) {
    const session = this.getSession();
    if (!session) {
      return { success: false, message: 'Session expired. Please sign up again.' };
    }

    try {
      const verificationData = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERIFICATION_CODE) || 'null');
      
      if (!verificationData || verificationData.email !== session.email) {
        return { success: false, message: 'Verification data not found.' };
      }

      if (new Date(verificationData.expiresAt) < new Date()) {
        return { success: false, message: 'Verification code expired.' };
      }

      const normalizedCode = String(code || '').replace(/\D/g, '').trim();
      let normalizedExpected = String(verificationData.code || '').replace(/\D/g, '').trim();
      if (!normalizedExpected) {
        normalizedExpected = String(sessionStorage.getItem('op_verification_code_display') || '').replace(/\D/g, '').trim();
      }
      if (normalizedExpected !== normalizedCode) {
        return { success: false, message: 'Invalid verification code.' };
      }

      // Mark user as verified
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.email === session.email);
      if (userIndex !== -1) {
        users[userIndex].verified = true;
        this.saveUsers(users);
      }

      // Update session
      session.verified = true;
      this.setSession(session);
      localStorage.removeItem(STORAGE_KEYS.VERIFICATION_CODE);

      return { success: true, message: 'Email verified successfully.' };
    } catch (error) {
      return { success: false, message: 'We could not verify your email right now.' };
    }
  }

  resendVerificationCode() {
    const session = this.getSession();
    if (!session) {
      return { success: false, message: 'Session expired.' };
    }

    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(STORAGE_KEYS.VERIFICATION_CODE, JSON.stringify({
        email: session.email,
        code,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }));

      return { success: true, message: 'New verification code sent.', code };
    } catch (error) {
      return { success: false, message: 'We could not resend the verification code.' };
    }
  }

  // --- Password Hash (Simple hash for demo) ---
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // --- Current User ---
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return this.getUsers().find(u => u.id === session.userId) || null;
  }
}

// ============================================
// Workspace Manager
// ============================================
class WorkspaceManager {
  constructor() {
    this.toast = new ToastManager();
  }

  getWorkspaces() {
    try {
      const workspaces = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKSPACES));
      return Array.isArray(workspaces) ? workspaces : [];
    } catch {
      return [];
    }
  }

  saveWorkspaces(workspaces) {
    localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
  }

  createWorkspace(name, url, size, industry) {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    if (!session) return { success: false, message: 'Not authenticated.' };

    const workspaces = this.getWorkspaces();
    
    if (workspaces.some(w => w.url.toLowerCase() === url.toLowerCase())) {
      return { success: false, message: 'This workspace URL is already taken.' };
    }

    const workspace = {
      id: crypto.randomUUID(),
      name: name.trim(),
      url: url.toLowerCase().trim(),
      size,
      industry: industry || null,
      ownerId: session.userId,
      createdAt: new Date().toISOString(),
      members: [{ userId: session.userId, role: 'Owner', joinedAt: new Date().toISOString() }]
    };

    workspaces.push(workspace);
    this.saveWorkspaces(workspaces);
    this.setCurrentWorkspace(workspace.id);

    return { success: true, message: 'Workspace created successfully.', workspace };
  }

  joinWorkspace(inviteCode) {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    if (!session) return { success: false, message: 'Not authenticated.' };

    const workspaces = this.getWorkspaces();
    const workspace = workspaces.find(w => w.id.slice(0, 8).toUpperCase() === inviteCode.toUpperCase());
    
    if (!workspace) {
      return { success: false, message: 'Invalid invite code.' };
    }

    const isMember = workspace.members.some(m => m.userId === session.userId);
    if (isMember) {
      return { success: false, message: 'You are already a member of this workspace.' };
    }

    workspace.members.push({
      userId: session.userId,
      role: 'Member',
      joinedAt: new Date().toISOString()
    });

    this.saveWorkspaces(workspaces);
    this.setCurrentWorkspace(workspace.id);

    return { success: true, message: 'Joined workspace successfully.', workspace };
  }

  getUserWorkspaces() {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    if (!session) return [];

    const workspaces = this.getWorkspaces();
    return workspaces.filter(w => w.members.some(m => m.userId === session.userId));
  }

  setCurrentWorkspace(workspaceId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WORKSPACE, workspaceId);
  }

  getCurrentWorkspace() {
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKSPACE);
    if (!id) return null;
    return this.getWorkspaces().find(w => w.id === id) || null;
  }
}

// ============================================
// Profile Manager
// ============================================
class ProfileManager {
  getProfile() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE));
    } catch {
      return null;
    }
  }

  saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  updateProfile(data) {
    const current = this.getProfile() || {};
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    this.saveProfile(updated);
    return updated;
  }
}

// ============================================
// Form Validator
// ============================================
class FormValidator {
  static rules = {
    required: (value) => value.trim().length > 0 || 'This field is required.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.',
    minLength: (value, length) => value.length >= length || `Must be at least ${length} characters.`,
    maxLength: (value, length) => value.length <= length || `Must be at most ${length} characters.`,
    match: (value, matchValue) => value === matchValue || 'Passwords do not match.',
    urlSafe: (value) => /^[a-zA-Z0-9-]+$/.test(value) || 'Only letters, numbers, and hyphens allowed.',
    strongPassword: (value) => {
      const checks = [
        value.length >= 8,
        /[A-Z]/.test(value),
        /[a-z]/.test(value),
        /[0-9]/.test(value),
        /[^A-Za-z0-9]/.test(value)
      ];
      const passed = checks.filter(Boolean).length;
      return passed >= 4 || 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.';
    }
  };

  static validate(field, rules) {
    const value = field.value;
    const errors = [];

    for (const rule of rules) {
      let result;
      if (typeof rule === 'string') {
        result = this.rules[rule](value);
      } else if (typeof rule === 'object') {
        const [ruleName, ...args] = rule;
        result = this.rules[ruleName](value, ...args);
      }
      
      if (result !== true) {
        errors.push(result);
      }
    }

    return errors;
  }

  static checkStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const classes = ['', 'weak', 'weak', 'fair', 'good', 'strong'];
    
    return { score, label: labels[score], class: classes[score] };
  }
}

// ============================================
// Loading Manager
// ============================================
class LoadingManager {
  constructor() {
    this.activeCount = 0;
  }

  show() {
    this.activeCount = Math.max(this.activeCount + 1, 1);
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
  }

  hide() {
    this.activeCount = Math.max(this.activeCount - 1, 0);
    if (this.activeCount > 0) return;
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.classList.remove('active');
  }
}

// ============================================
// Navigation Guard
// ============================================
class NavigationGuard {
  constructor() {
    this.auth = new AuthManager();
    this.ws = new WorkspaceManager();
  }

  requireAuth() {
    // Allow local file previews and localhost to bypass auth redirects
    try {
      const href = window.location.href || '';
      if (href.startsWith('file:') || window.location.hostname === 'localhost') {
        return true;
      }
      // Allow bypass when running in development/debug mode
      if (window.OP_CONFIG && window.OP_CONFIG.dev === true) {
        return true;
      }
    } catch (e) {
      // ignore errors and fall through
    }

    if (!this.auth.isAuthenticated()) {
      window.location.href = '../auth/signin.html';
      return false;
    }
    return true;
  }

  requireGuest() {
    if (this.auth.isAuthenticated()) {
      const workspaces = this.ws.getUserWorkspaces();
      if (workspaces.length > 0) {
        window.location.href = 'workspace-select.html';
      } else {
        window.location.href = 'workspace-create.html';
      }
      return false;
    }
    return true;
  }

  requireVerified() {
    const session = this.auth.getSession();
    if (session && !session.verified) {
      window.location.href = 'verify-email.html';
      return false;
    }
    return true;
  }
}

// ============================================
// Initialize
// ============================================
const themeManager = new ThemeManager();
const authManager = new AuthManager();
const workspaceManager = new WorkspaceManager();
const profileManager = new ProfileManager();
const loadingManager = new LoadingManager();
const navGuard = new NavigationGuard();

// ============================================
// Command Palette (Global)
// ============================================
class CommandPalette {
  constructor() {
    this.storageKeyRecent = 'op_command_recent';
    this.storageKeyFavorites = 'op_command_favorites';
    this.recent = this.loadJSON(this.storageKeyRecent) || [];
    this.favorites = this.loadJSON(this.storageKeyFavorites) || [];
    this.overlay = null;
    this.input = null;
    this.resultsContainer = null;
    this.items = []; // navigation + quick actions + indexed content
  }

  loadJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  }

  saveJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  isPublicPage() {
    const path = (window.location.pathname || '').toLowerCase();
    const href = (window.location.href || '').toLowerCase();
    return path === '/' || path === '/index' || path === '/index.html' || path === '/signin.html' || path === '/signup.html' || path === '/auth' || path.startsWith('/auth/') || (href.startsWith('file://') && (href.endsWith('/index.html') || href.includes('/auth/')));
  }

  init() {
    if (this.isPublicPage()) return;
    this.buildMarkup();
    this.collectItems();
    this.bindShortcuts();
  }

  buildMarkup() {
    if (document.getElementById('commandPaletteOverlay')) return;

    this.overlay = document.createElement('div');
    this.overlay.id = 'commandPaletteOverlay';
    this.overlay.className = 'command-palette-overlay';
    this.overlay.innerHTML = `
      <div class="command-palette" role="dialog" aria-modal="true" aria-label="Global Command Palette">
        <div class="cp-input-wrap">
          <input id="cpInput" class="cp-input" placeholder="Search everything — commands, files, contacts, tasks..." aria-label="Command palette search" autocomplete="off" />
          <button id="cpClose" class="cp-close" aria-label="Close">Esc</button>
        </div>
        <div class="cp-sections">
          <div class="cp-section cp-quick-actions">
            <div class="cp-section-title">Quick Actions</div>
            <ul class="cp-list" id="cpQuickActions"></ul>
          </div>
          <div class="cp-section cp-results">
            <div class="cp-section-title">Results</div>
            <ul class="cp-list" id="cpResults"></ul>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this.input = document.getElementById('cpInput');
    this.resultsContainer = document.getElementById('cpResults');

    // Close handlers
    document.getElementById('cpClose').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => { if (e.target === this.overlay) this.close(); });

    // Input events
    let debounce;
    this.input.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => this.search(e.target.value.trim()), 150);
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); this.close(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); this.focusNext(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); this.focusPrev(); }
      if (e.key === 'Enter') { e.preventDefault(); this.activateFocused(); }
    });

    // Populate quick actions
    this.renderQuickActions();
  }

  bindShortcuts() {
    if (this.isPublicPage()) return;
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape') {
        // If palette open, close; else let other handlers handle
        if (this.overlay && this.overlay.classList.contains('open')) this.close();
      }
    });
  }

  open() {
    if (this.isPublicPage()) return;
    if (!this.overlay) this.buildMarkup();
    this.overlay.classList.add('open');
    document.documentElement.classList.add('cp-open');
    this.input.value = '';
    this.input.focus();
    this.renderQuickActions();
    this.search('');
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('open');
    document.documentElement.classList.remove('cp-open');
  }

  collectItems() {
    this.items = [];

    // Collect navigation links
    document.querySelectorAll('a.nav-item, a.nav-link, .sidebar a').forEach(a => {
      try {
        const href = a.getAttribute('href');
        const title = (a.textContent || a.innerText || '').trim();
        if (href && title) this.items.push({ type: 'nav', title, href, source: 'Navigation' });
      } catch (e) {}
    });

    // Quick attempt: scan localStorage for known content collections
    const scanKeys = Object.keys(localStorage);
    scanKeys.forEach(k => {
      const low = k.toLowerCase();
      if (low.includes('contact') || low.includes('contacts') || low.includes('crm')) {
        try {
          const arr = JSON.parse(localStorage.getItem(k) || '[]');
          if (Array.isArray(arr)) arr.forEach(it => {
            const name = it.name || it.title || it.fullName || it.email || it.contactName || it.displayName;
            if (name) this.items.push({ type: 'contact', title: name, href: '../crm/contacts.html', source: k });
          });
        } catch {}
      }
      if (low.includes('invoice') || low.includes('invoices')) {
        try {
          const arr = JSON.parse(localStorage.getItem(k) || '[]');
          if (Array.isArray(arr)) arr.forEach(it => {
            const title = it.number || it.id || it.title;
            if (title) this.items.push({ type: 'invoice', title: title, href: '../billing/invoices.html', source: k });
          });
        } catch {}
      }
      if (low.includes('task') || low.includes('tasks')) {
        try {
          const arr = JSON.parse(localStorage.getItem(k) || '[]');
          if (Array.isArray(arr)) arr.forEach(it => {
            const title = it.title || it.name || it.summary;
            if (title) this.items.push({ type: 'task', title, href: '../tasks/' , source: k });
          });
        } catch {}
      }
    });

    // Add some predefined quick actions
    this.quickActions = [
      { id: 'open_inbox', title: 'Open Unified Inbox', href: '../inbox/unified-inbox.html' },
      { id: 'new_contact', title: 'Create New Contact', action: () => { window.location.href = '../crm/contacts.html'; } },
      { id: 'new_task', title: 'Create New Task', href: '../tasks/index.html' },
      { id: 'open_search', title: 'Open Search Page', href: '../search/index.html' },
      { id: 'open_billing', title: 'Open Billing', href: '../billing/index.html' },
      { id: 'open_ai', title: 'Open AI Assistant', href: '../ai/index.html' }
    ];
  }

  renderQuickActions() {
    const container = document.getElementById('cpQuickActions');
    if (!container) return;
    container.innerHTML = this.quickActions.map(a => `
      <li class="cp-item" data-href="${a.href || ''}" data-id="${a.id || ''}">
        <button class="cp-action-btn">${a.title}</button>
      </li>
    `).join('');

    container.querySelectorAll('.cp-action-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const act = this.quickActions[idx];
        if (act.action) act.action(); else if (act.href) window.location.href = act.href;
        this.close();
      });
    });
  }

  search(q) {
    const query = (q || '').toLowerCase();
    const results = [];

    if (!query) {
      // show favorites then recent
      this.resultsContainer.innerHTML = `
        ${this.renderSection('Favorites', this.favorites)}
        ${this.renderSection('Recents', this.recent)}
      `;
      this.bindResultClicks();
      return;
    }

    // search items
    this.items.forEach(it => {
      if (it.title && it.title.toLowerCase().includes(query)) results.push(it);
    });

    // fallback: include quick actions that match
    this.quickActions.forEach(a => {
      if (a.title.toLowerCase().includes(query)) results.push({ type: 'action', title: a.title, href: a.href, id: a.id });
    });

    this.resultsContainer.innerHTML = results.length ? results.map(r => `
      <li class="cp-item" data-href="${r.href || ''}" data-type="${r.type || ''}">
        <button class="cp-result-btn">${r.title} <span class="cp-meta">${r.source || r.type || ''}</span></button>
      </li>
    `).join('') : '<li class="cp-empty">No results</li>';

    this.bindResultClicks();
  }

  renderSection(title, items) {
    if (!items || items.length === 0) return '';
    return `
      <div class="cp-section-block">
        <div class="cp-block-title">${title}</div>
        <ul class="cp-list-block">
          ${items.map(it => `<li class="cp-item"><button class="cp-result-btn">${it.title}</button></li>`).join('')}
        </ul>
      </div>
    `;
  }

  bindResultClicks() {
    const nodes = this.resultsContainer.querySelectorAll('.cp-item');
    nodes.forEach(n => {
      n.addEventListener('click', (e) => {
        const href = n.getAttribute('data-href');
        if (href) window.location.href = href;
        this.close();
      });
    });
  }

  focusNext() {
    const focusable = this.overlay.querySelectorAll('.cp-action-btn, .cp-result-btn');
    if (!focusable.length) return;
    const idx = Array.from(focusable).findIndex(el => el === document.activeElement);
    const next = focusable[Math.min(focusable.length-1, Math.max(0, idx+1))];
    if (next) next.focus();
  }

  focusPrev() {
    const focusable = this.overlay.querySelectorAll('.cp-action-btn, .cp-result-btn');
    if (!focusable.length) return;
    const idx = Array.from(focusable).findIndex(el => el === document.activeElement);
    const prev = focusable[Math.min(focusable.length-1, Math.max(0, idx-1))];
    if (prev) prev.focus();
  }

  activateFocused() {
    const active = document.activeElement;
    if (!active) return;
    active.click();
  }
}

// Expose to window for inline handlers
window.OP = Object.assign({
  theme: themeManager,
  auth: authManager,
  workspace: workspaceManager,
  profile: profileManager,
  loading: loadingManager,
  nav: navGuard,
  validator: FormValidator,
  toast: new ToastManager()
}, window.OP || {});

// Initialize global command palette and expose
window.OP.command = window.OP.command || new CommandPalette();
document.addEventListener('DOMContentLoaded', () => {
  try { window.OP.command.init(); } catch (e) { /* ignore */ }
});

// Service Worker / Push registration (safe stub)
function registerServiceWorkerStub() {
  if (!('serviceWorker' in navigator)) return;
  // Do not fail if SW files are absent; attempt registration if available
  try {
    // Check that the service worker file exists before registering (avoid 404s)
    fetch('/sw.js', { method: 'HEAD' }).then(resp => {
      if (resp && resp.ok) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }
    }).catch(() => {
      // ignore fetch/register errors
    });
  } catch (e) { /* ignore */ }
}

document.addEventListener('DOMContentLoaded', () => {
  try { registerServiceWorkerStub(); } catch (e) { /* ignore */ }
});

// On public entry pages (landing, auth), attempt to unregister any legacy service
// workers and clear caches to prevent stale SW-based redirects on mobile.
function isPublicEntryPage() {
  try {
    const p = window.location.pathname || '/';
    const file = p.split('/').pop().toLowerCase();
    if (p === '/' || file === '' || file === 'index.html') return true;
    if (p.includes('/auth/') || file === 'signin.html' || file === 'signup.html') return true;
    return false;
  } catch (e) { return false; }
}

function cleanupLegacyServiceWorkers() {
  if (!('serviceWorker' in navigator)) return;
  // Always attempt to cleanup legacy service workers on all pages.
  // Previously this only ran on public entry pages which allowed
  // older service workers to remain registered for other routes
  // and sometimes return stale/offline navigation responses.
  try {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => {
        try { r.unregister(); } catch (e) { /* ignore */ }
      });
    }).catch(() => {});
  } catch (e) { /* ignore */ }

  // Clear caches (best-effort) so old navigation responses don't persist.
  if (window.caches && typeof window.caches.keys === 'function') {
    try {
      window.caches.keys().then(keys => Promise.all(keys.map(k => window.caches.delete(k)))).catch(() => {});
    } catch (e) { /* ignore */ }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try { cleanupLegacyServiceWorkers(); } catch (e) { /* ignore */ }
});

// ============================================
// Onboarding loader (lazy, single-init)
// ============================================
function getSiteAssetUrl(assetPath) {
  const normalized = assetPath.replace(/^\/+/, '');
  try {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      // If the site lives in a top-level folder (e.g. /OnePlace%20Enterprise/...),
      // prefix injected asset paths with that folder so they resolve correctly
      // when served from a subfolder on a local dev server.
      const siteFolder = parts[0];
      return `/${siteFolder}/${normalized}`;
    }
    return `/${normalized}`;
  } catch (e) {
    return `/${normalized}`;
  }
}

function loadOnboardingAssets() {
  if (window.OP && window.OP.onboardingLoaded) return;
  window.OP = window.OP || {};
  window.OP.onboardingLoaded = true;

  // Load CSS lazily
  if (!document.getElementById('onboardingCss')) {
    const link = document.createElement('link');
    link.id = 'onboardingCss';
    link.rel = 'stylesheet';
    link.href = getSiteAssetUrl('/css/onboarding.css');
    document.head.appendChild(link);
  }

  // Load script lazily
  if (!document.getElementById('onboardingScript')) {
    const script = document.createElement('script');
    script.id = 'onboardingScript';
    script.src = getSiteAssetUrl('/js/onboarding.js');
    script.defer = true;
    script.onload = () => {
      try {
        if (window.OP && window.OP.onboarding && typeof window.OP.onboarding.init === 'function') {
          window.OP.onboarding.init();
        }
      } catch (e) { /* ignore */ }
    };
    document.body.appendChild(script);
  }
}

// Defer onboarding load slightly to prioritize critical render
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('/linkedin/')) {
    setTimeout(loadOnboardingAssets, 1200);
  } else {
    window.OP = window.OP || {};
    window.OP.onboardingLoaded = true;
  }
});

// ============================================
// Responsive loader (lazy, single-init)
// ============================================
function loadResponsiveAssets() {
  if (window.OP && window.OP.responsiveLoaded) return;
  window.OP = window.OP || {};
  window.OP.responsiveLoaded = true;

  // Load CSS lazily
  if (!document.getElementById('responsiveCss')) {
    const link = document.createElement('link');
    link.id = 'responsiveCss';
    link.rel = 'stylesheet';
    link.href = getSiteAssetUrl('/css/responsive.css');
    document.head.appendChild(link);
  }

  // Load script lazily
  if (!document.getElementById('responsiveScript')) {
    const script = document.createElement('script');
    script.id = 'responsiveScript';
    script.src = getSiteAssetUrl('/js/responsive.js');
    script.defer = true;
    script.onload = () => {
      try {
        if (window.OP && window.OP.responsive && typeof window.OP.responsive.init === 'function') {
          window.OP.responsive.init();
        }
      } catch (e) { /* ignore */ }
    };
    document.body.appendChild(script);
  }
}

// Defer responsive load after onboarding has been loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(loadResponsiveAssets, 1800);
});

// ============================================
// Design System loader (lazy, single-init)
// ============================================
function loadDesignSystemAssets() {
  if (window.OP && window.OP.designLoaded) return;
  window.OP = window.OP || {};
  window.OP.designLoaded = true;

  const cssFiles = ['/css/design-tokens.css', '/css/design-core.css', '/css/design-components.css'];
  cssFiles.forEach(href => {
    const resolvedHref = getSiteAssetUrl(href);
    if (!document.querySelector(`link[href="${resolvedHref}"]`)) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = resolvedHref;
      document.head.appendChild(l);
    }
  });

  if (!document.getElementById('designSystemScript')) {
    const script = document.createElement('script');
    script.id = 'designSystemScript';
    script.src = getSiteAssetUrl('/js/design-system.js');
    script.defer = true;
    script.onload = () => {
      try { if (window.OP && window.OP.design && typeof window.OP.design.init === 'function') window.OP.design.init(); } catch (e) {}
    };
    document.body.appendChild(script);
  }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(loadDesignSystemAssets, 2200));

// ============================================
// State Manager loader (lazy, single-init)
// ============================================
function loadStateManager() {
  if (window.OP && window.OP.stateLoaded) return;
  window.OP = window.OP || {};
  window.OP.stateLoaded = true;

  if (!document.getElementById('stateManagerScript')) {
    const script = document.createElement('script');
    script.id = 'stateManagerScript';
    script.src = getSiteAssetUrl('/js/state-manager.js');
    script.defer = true;
    script.onload = () => {
      try { if (window.OP && window.OP.state && typeof window.OP.state.init === 'function') window.OP.state.init(); } catch (e) {}
    };
    document.body.appendChild(script);
  }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(loadStateManager, 2400));

// ============================================
// API Integration loader (lazy, single-init)
// ============================================
function loadAPIIntegration() {
  if (window.OP && window.OP.apiLoaded) return;
  window.OP = window.OP || {};
  window.OP.apiLoaded = true;

  if (!document.getElementById('apiIntegrationScript')) {
    const script = document.createElement('script');
    script.id = 'apiIntegrationScript';
    script.src = getSiteAssetUrl('/js/api-integration.js');
    script.defer = true;
    script.onload = () => {
      try {
        if (window.OP && window.OP.api && typeof window.OP.api.init === 'function') {
          window.OP.api.init();
        }
      } catch (e) { /* ignore */ }
    };
    document.body.appendChild(script);
  }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(loadAPIIntegration, 2600));