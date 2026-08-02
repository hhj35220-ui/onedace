/**
 * OnePlace Enterprise v3.0 — Authentication Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const STORAGE_KEYS = {
  SESSION: 'op_session',
  AUTH_TOKENS: 'op_api_auth_tokens',
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
const APP_CACHE_BUSTER = 'op-v20260722-2';

function forceFreshAssetHeaders() {
  try {
    if (!document.head) return;
    const metas = [
      { httpEquiv: 'Cache-Control', content: 'no-store, no-cache, must-revalidate, max-age=0' },
      { httpEquiv: 'Pragma', content: 'no-cache' },
      { httpEquiv: 'Expires', content: '0' }
    ];
    metas.forEach(meta => {
      let el = document.head.querySelector(`meta[http-equiv="${meta.httpEquiv}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('http-equiv', meta.httpEquiv);
        document.head.appendChild(el);
      }
      el.setAttribute('content', meta.content);
    });
  } catch (e) {}
}

function clearStaleServiceState() {
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => {
          try { reg.unregister(); } catch (e) {}
        });
      }).catch(() => {});
    }
  } catch (e) {}

  try {
    if (window.caches && typeof window.caches.keys === 'function') {
      window.caches.keys().then(keys => Promise.all(keys.map(k => window.caches.delete(k)))).catch(() => {});
    }
  } catch (e) {}
}

forceFreshAssetHeaders();
clearStaleServiceState();

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
    this._apiLoadPromise = null;
  }

  async ensureApiIntegration() {
    if (window.OP && window.OP.apiIntegration) {
      return window.OP.apiIntegration;
    }

    if (typeof loadAPIIntegration === 'function') {
      loadAPIIntegration();
    }

    if (!this._apiLoadPromise) {
      this._apiLoadPromise = new Promise((resolve, reject) => {
        const startedAt = Date.now();
        const maxWaitMs = 10000;

        const checkReady = () => {
          if (window.OP && window.OP.apiIntegration) {
            resolve(window.OP.apiIntegration);
            return;
          }
          if (Date.now() - startedAt > maxWaitMs) {
            reject(new Error('Backend API integration is unavailable.'));
            return;
          }
          setTimeout(checkReady, 50);
        };

        checkReady();
      }).finally(() => {
        this._apiLoadPromise = null;
      });
    }

    return this._apiLoadPromise;
  }

  getAuthTokens() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_TOKENS) || 'null');
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
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
    const normalizedSession = session && typeof session === 'object' ? session : {};
    if (normalizedSession.user) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(normalizedSession.user));
    }
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(normalizedSession));
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }

  clearAuthStorage() {
    this.clearSession();
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    localStorage.removeItem('op_remembered_email');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKSPACE);
    localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.VERIFICATION_CODE);
    sessionStorage.removeItem('op_verification_code_display');
  }

  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      this.clearSession();
      return false;
    }

    const tokens = this.getAuthTokens();
    if (!tokens) {
      this.clearSession();
      return false;
    }

    const hasAccessToken = !!tokens.accessToken;
    const hasRefreshToken = !!tokens.refreshToken;
    if (!hasAccessToken && !hasRefreshToken) {
      this.clearSession();
      return false;
    }

    if (tokens.expiresAt && new Date(tokens.expiresAt) < new Date() && !hasRefreshToken) {
      this.clearSession();
      return false;
    }

    return true;
  }

  // --- Sign Up ---
  async signUp(fullName, email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedName = String(fullName || '').trim();
    const parts = normalizedName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || normalizedEmail.split('@')[0] || 'User';
    const lastName = parts.slice(1).join(' ') || 'User';

    try {
      await this.ensureApiIntegration();

      const response = await window.OP.apiIntegration.post('/auth/register', {
        firstName,
        lastName,
        email: normalizedEmail,
        password,
        confirmPassword: password
      });

      const payload = response && response.data ? response.data : {};
      if (!payload.success) {
        return {
          success: false,
          message: payload.message || 'Unable to create account.'
        };
      }

      return {
        success: true,
        message: payload.message || 'Account created successfully. Please sign in.'
      };
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to create account.';
      return { success: false, message };
    }
  }

  // --- Sign In ---
  async signIn(email, password, rememberMe = false) {
    const normalizedEmail = String(email || '').trim().toLowerCase();

    try {
      await this.ensureApiIntegration();

      const payload = await (window.OP && window.OP.apiIntegration
        ? window.OP.apiIntegration.login(normalizedEmail, password)
        : Promise.reject(new Error('Backend API integration is unavailable.')));

      const authData = payload && payload.data ? payload.data : {};
      if (!authData || !authData.user) {
        throw new Error(payload && payload.message ? payload.message : 'Unable to sign in.');
      }
      const user = authData.user || {};
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || normalizedEmail;

      const session = {
        userId: user.id || `user_${Math.random().toString(36).slice(2, 12)}`,
        email: user.email || normalizedEmail,
        fullName,
        role: user.role || 'USER',
        verified: true,
        rememberMe,
        expiresAt: rememberMe
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      const sessionPayload = {
        ...session,
        user
      };

      this.setSession(sessionPayload);
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe);
      localStorage.setItem('op_remembered_email', rememberMe ? normalizedEmail : '');

      try {
        await this.syncCurrentUser();
      } catch (syncError) {
        // Keep the login response session and fall back to the user payload if /auth/me is unavailable.
      }

      return {
        success: true,
        message: payload && payload.message ? payload.message : 'Signed in successfully.'
      };
    } catch (error) {
      const message = error && error.message ? error.message : 'Invalid email or password.';
      return { success: false, message };
    }
  }

  async syncCurrentUser() {
    try {
      await this.ensureApiIntegration();
      const response = await window.OP.apiIntegration.get('/auth/me');
      const payload = response && response.data ? response.data : {};
      const user = payload && payload.data ? payload.data : null;

      if (!user || typeof user !== 'object') {
        return { success: false, message: 'Unable to load current user.' };
      }

      const session = this.getSession() || {};
      const mergedSession = {
        ...session,
        userId: user.id || session.userId,
        email: user.email || session.email,
        fullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || session.fullName,
        role: user.role || session.role,
        organizationId: user.organizationId || session.organizationId || null,
        verified: typeof user.emailVerified === 'boolean' ? user.emailVerified : session.verified,
        user
      };

      this.setSession(mergedSession);
      return { success: true, data: user };
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to load current user.';
      return { success: false, message };
    }
  }

  // --- Sign Out ---
  async signOut() {
    try {
      await this.ensureApiIntegration();
      if (window.OP && window.OP.apiIntegration) {
        await window.OP.apiIntegration.logout();
      }
    } catch (error) {
      // Ignore remote logout errors and continue local sign-out.
    }
    this.clearAuthStorage();
    return { success: true };
  }

  // --- Password Reset ---
  async requestPasswordReset(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, message: 'Email is required.' };
    }

    try {
      await this.ensureApiIntegration();
      const response = await window.OP.apiIntegration.post('/auth/forgot-password', { email: normalizedEmail });
      const payload = response && response.data ? response.data : {};
      const token = payload && payload.data && payload.data.resetToken ? payload.data.resetToken : null;

      return {
        success: !!payload.success,
        message: payload.message || 'If the email exists, password reset instructions have been generated.',
        token
      };
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to process password reset request.';
      return { success: false, message };
    }
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      return { success: false, message: 'Invalid password reset request.' };
    }

    try {
      await this.ensureApiIntegration();
      const response = await window.OP.apiIntegration.post('/auth/reset-password', {
        token,
        password: newPassword,
        confirmPassword: newPassword
      });
      const payload = response && response.data ? response.data : {};
      return {
        success: !!payload.success,
        message: payload.message || 'Password reset successfully.'
      };
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to reset password.';
      return { success: false, message };
    }
  }

  // --- Email Verification ---
  async verifyEmail(token) {
    if (!token) {
      return { success: false, message: 'Verification token is required.' };
    }

    try {
      await this.ensureApiIntegration();
      const response = await window.OP.apiIntegration.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
      const payload = response && response.data ? response.data : {};
      return {
        success: !!payload.success,
        message: payload.message || 'Email verified successfully.'
      };
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to verify email.';
      return { success: false, message };
    }
  }

  resendVerificationCode() {
    return { success: false, message: 'Email verification resend is not available from the current backend API.' };
  }

  // --- Current User ---
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return {
      id: session.userId,
      email: session.email,
      fullName: session.fullName,
      role: session.role,
      verified: session.verified
    };
  }

  async updateCurrentUserProfile(payload = {}) {
    const session = this.getSession();
    if (!session) {
      return { success: false, message: 'Not authenticated.' };
    }

    const fullName = String(payload.fullName || '').trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const firstName = payload.firstName || nameParts[0] || '';
    const lastName = payload.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

    const updatePayload = {};
    if (firstName) updatePayload.firstName = firstName;
    if (lastName) updatePayload.lastName = lastName;
    if (typeof payload.phone === 'string') updatePayload.phone = payload.phone.trim();
    if (typeof payload.avatarUrl === 'string' && payload.avatarUrl.trim().length <= 500) {
      updatePayload.avatarUrl = payload.avatarUrl.trim();
    }

    try {
      await this.ensureApiIntegration();
      const response = await window.OP.apiIntegration.patch('/users/me', updatePayload);
      const result = response && response.data ? response.data : {};

      if (result.success) {
        const updatedData = result.data || {};
        const mergedSession = Object.assign({}, session, {
          fullName: [updatedData.firstName, updatedData.lastName].filter(Boolean).join(' ').trim() || session.fullName,
          email: updatedData.email || session.email,
          role: updatedData.role || session.role
        });
        this.setSession(mergedSession);
      }

      return {
        success: !!result.success,
        message: result.message || 'Profile updated successfully.',
        data: result.data || null
      };
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to update profile.';
      return { success: false, message };
    }
  }

  async changePassword(currentPassword, newPassword) {
    const normalizedCurrentPassword = String(currentPassword || '').trim();
    const normalizedNewPassword = String(newPassword || '').trim();

    if (!normalizedCurrentPassword || !normalizedNewPassword) {
      return { success: false, message: 'Current password and new password are required.' };
    }

    try {
      await this.ensureApiIntegration();
      const response = await window.OP.apiIntegration.patch('/users/me/password', {
        currentPassword: normalizedCurrentPassword,
        newPassword: normalizedNewPassword
      });
      const payload = response && response.data ? response.data : {};

      return {
        success: !!payload.success,
        message: payload.message || 'Password updated successfully.'
      };
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to change password.';
      return { success: false, message };
    }
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

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!isPublicEntryPage()) {
      navGuard.requireAuth();
    }
  } catch (e) {
    // Ignore guard initialization errors to avoid blocking render.
  }
});

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
    const baseUrl = window.location.href || 'https://example.com/';
    const resolvedUrl = new URL(`../${normalized}`, baseUrl);
    resolvedUrl.searchParams.set('v', APP_CACHE_BUSTER);
    return resolvedUrl.toString();
  } catch (e) {
    return `/${normalized}?v=${APP_CACHE_BUSTER}`;
  }
}

const SHARED_NAV_ITEMS = [
  { title: 'Dashboard', href: '/dashboard/main-dashboard.html', icon: 'ph-squares-four' },
  { title: 'All Inbox', href: '/inbox/unified-inbox.html', icon: 'ph-envelope' },
  { title: 'Reports', href: '/reports/index.html', icon: 'ph-chart-bar' },
  { title: 'CRM', href: '/crm/index.html', icon: 'ph-users' },
  { title: 'Customer Support', href: '/support/index.html', icon: 'ph-headset' },
  { title: 'Calendar', href: '/calendar/index.html', icon: 'ph-calendar-blank' },
  { title: 'Tasks', href: '/tasks/index.html', icon: 'ph-check-square' },
  { title: 'Team', href: '/team/index.html', icon: 'ph-users-three' },
  { title: 'Workflow', href: '/workflow/index.html', icon: 'ph-flow-arrow' },
  { title: 'AI', href: '/ai/index.html', icon: 'ph-sparkle' },
  { title: 'Files', href: '/files/index.html', icon: 'ph-folder' },
  { title: 'Integrations', href: '/integrations/index.html', icon: 'ph-plugs-connected' },
  { title: 'Billing', href: '/billing/index.html', icon: 'ph-credit-card' },
  { title: 'Settings', href: '/settings/index.html', icon: 'ph-gear' },
  { title: 'Search', href: '/search/index.html', icon: 'ph-magnifying-glass' },
  { title: 'Notifications', href: '/notifications/notifications.html', icon: 'ph-bell' },
  { title: 'Help & Support', href: '/help/index.html', icon: 'ph-question' },
  { title: 'Gmail', href: '/gmail/index.html', icon: 'ph-envelope-simple' },
  { title: 'WhatsApp', href: '/whatsapp/index.html', icon: 'ph-chat-circle-text' },
  { title: 'Instagram', href: '/instagram/index.html', icon: 'ph-instagram-logo' },
  { title: 'TikTok', href: '/tiktok/index.html', icon: 'ph-tiktok-logo' },
  { title: 'X', href: '/x/index.html', icon: 'ph-x-logo' },
  { title: 'LinkedIn', href: '/linkedin/index.html', icon: 'ph-linkedin-logo' }
];

function getRelativeSiteUrl(targetPath) {
  const normalizedTarget = (targetPath || '').replace(/^\/+/, '');
  if (!normalizedTarget) return './';

  const currentPath = (window.location.pathname || '/').replace(/\\/g, '/');
  const segments = currentPath.split('/').filter(Boolean);
  const directoryDepth = segments.length > 1 ? segments.length - 1 : 0;
  const prefix = '../'.repeat(directoryDepth);
  return `${prefix}${normalizedTarget}`;
}

function getSharedNavClassNames(sidebar) {
  if (sidebar && sidebar.classList.contains('help-sidebar')) {
    return {
      section: 'help-sidebar-section',
      sectionTitle: 'help-sidebar-section-title',
      item: 'help-sidebar-link',
      activeItem: 'help-sidebar-link active'
    };
  }

  return {
    section: 'sidebar-section',
    sectionTitle: 'sidebar-section-title',
    item: 'sidebar-item',
    activeItem: 'sidebar-item active'
  };
}

function isAuthFlowPage() {
  const pathname = (window.location.pathname || '/').replace(/\\/g, '/').toLowerCase();
  return pathname.includes('/auth/') || pathname.endsWith('/auth');
}

function applySharedNavigation() {
  if (isAuthFlowPage()) {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname.replace(/\/$/, '');

  let sidebar = document.querySelector('.dashboard-sidebar, .help-sidebar, aside.sidebar, .app-sidebar');
  let navContainer = null;

  if (sidebar) {
    navContainer = sidebar.querySelector('.sidebar-nav, .help-sidebar-nav, nav');
    if (!navContainer && sidebar.tagName === 'ASIDE') {
      navContainer = document.createElement('nav');
      navContainer.className = 'sidebar-nav';
      sidebar.appendChild(navContainer);
    }
  }

  if (!sidebar && !navContainer) {
    const existingNav = document.querySelector('.sidebar-nav, .help-sidebar-nav, aside nav');
    if (existingNav) {
      navContainer = existingNav;
      sidebar = existingNav.closest('aside');
    }
  }

  if (!sidebar && !navContainer) {
    sidebar = document.createElement('aside');
    sidebar.className = 'dashboard-sidebar';
    sidebar.setAttribute('role', 'navigation');
    sidebar.setAttribute('aria-label', 'Main navigation');
    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon"><i class="ph ph-chat-centered-text"></i></div>
        <div class="sidebar-brand-text">OnePlace</div>
      </div>
      <div class="sidebar-nav"></div>
    `;
    document.body.prepend(sidebar);
    navContainer = sidebar.querySelector('.sidebar-nav');
  }

  if (!navContainer) return;

  let sharedSection = navContainer.querySelector('[data-nav-section="global"]');
  const sharedNavClasses = getSharedNavClassNames(sidebar);
  if (!sharedSection) {
    sharedSection = document.createElement('div');
    sharedSection.className = sharedNavClasses.section;
    sharedSection.setAttribute('data-nav-section', 'global');
    const firstChild = navContainer.firstElementChild;
    if (firstChild) {
      navContainer.insertBefore(sharedSection, firstChild);
    } else {
      navContainer.appendChild(sharedSection);
    }
  }

  sharedSection.innerHTML = `
    <div class="${sharedNavClasses.sectionTitle}">Navigation</div>
    ${SHARED_NAV_ITEMS.map(item => `
      <a href="${getRelativeSiteUrl(item.href)}" class="${sharedNavClasses.item}" data-nav-target="${item.href}">
        <i class="ph ${item.icon}"></i>
        <span>${item.title}</span>
      </a>
    `).join('')}
  `;

  sharedSection.querySelectorAll('a').forEach(link => {
    try {
      const href = link.getAttribute('href') || '';
      const resolved = new URL(href, currentUrl.href);
      const targetPath = resolved.pathname.replace(/\/$/, '');
      const isActive = targetPath === currentPath ||
        (targetPath === '/dashboard/main-dashboard.html' && currentPath.startsWith('/dashboard/')) ||
        (targetPath.endsWith('/index.html') && currentPath.startsWith(targetPath.replace(/\/index\.html$/, '/'))) ||
        (currentPath.startsWith(`${targetPath}/`) || currentPath.startsWith(`${targetPath.replace(/\/index\.html$/, '')}/`));
      link.classList.toggle('active', isActive);
    } catch (e) {
      link.classList.remove('active');
    }
  });

  const hasStructuredLayout = document.querySelector('.dashboard-layout') || document.querySelector('.dashboard-main') || document.querySelector('.help-layout') || document.querySelector('.help-main');
  if (!hasStructuredLayout && !document.body.classList.contains('has-global-nav')) {
    document.body.classList.add('has-global-nav');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    applySharedNavigation();
  } catch (e) {
    // Ignore navigation injection errors to preserve page behavior.
  }
});

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
