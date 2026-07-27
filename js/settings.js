/**
 * OnePlace Enterprise v3.0 — Settings Module
 * Vanilla JavaScript (ES6+)
 */

const SETTINGS_STORAGE_KEYS = {
  SETTINGS_DATA: 'op_settings_data',
  WORKSPACE_SETTINGS: 'op_workspace_settings',
  PROFILE_SETTINGS: 'op_profile_settings',
  APPEARANCE_SETTINGS: 'op_appearance_settings',
  THEME_SETTINGS: 'op_theme_settings',
  LANGUAGE_SETTINGS: 'op_language_settings',
  SECURITY_SETTINGS: 'op_security_settings',
  NOTIFICATION_SETTINGS: 'op_notification_settings',
  INTEGRATION_SETTINGS: 'op_integration_settings',
  AI_SETTINGS: 'op_ai_settings',
  AUDIT_LOGS: 'op_audit_logs',
  BACKUPS: 'op_backups',
  DEVICES: 'op_devices',
  API_KEYS: 'op_api_keys',
  ROLES: 'op_roles',
  STORAGE_DATA: 'op_storage_data'
};

class SettingsApp {
  static init() {
    this.initSidebar();
    this.initUserData();
    this.initSearch();
    this.loadAllSettings();
  }

  /* ============================================
     Sidebar & Navigation
     ============================================ */
  static initSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const toggle = document.getElementById('sidebarToggle');
    
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && sidebar && !sidebar.contains(e.target) && !toggle?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* ============================================
     User Data
     ============================================ */
  static initUserData() {
    const session = OP.auth.getSession();
    if (!session) {
      window.location.href = '../auth/signin.html';
      return;
    }

    const profile = OP.profile.getProfile() || {};
    const fullName = profile.fullName || session.fullName || 'Alex Morgan';
    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const role = profile.jobTitle || 'Administrator';

    // Update all avatar elements
    document.querySelectorAll('#userMiniAvatar, #headerAvatar').forEach(el => {
      if (el) el.textContent = initials;
    });

    const nameEl = document.getElementById('userMiniName');
    if (nameEl) nameEl.textContent = fullName;

    const roleEl = document.getElementById('userMiniRole');
    if (roleEl) roleEl.textContent = role;

    // Update profile page if present
    const profileName = document.getElementById('profileFullName');
    if (profileName) profileName.textContent = fullName;

    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) profileEmail.textContent = session.email || 'alex.morgan@oneplace.com';

    const profileRole = document.getElementById('profileRole');
    if (profileRole) profileRole.textContent = role;

    const avatarFallback = document.querySelector('.profile-avatar-fallback');
    if (avatarFallback) avatarFallback.textContent = initials;
  }

  /* ============================================
     Search
     ============================================ */
  static initSearch() {
    const searchInput = document.getElementById('settingsSearch');
    if (!searchInput) return;

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInput.focus();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const tabs = document.querySelectorAll('.settings-tab');
      tabs.forEach(tab => {
        const text = tab.textContent.toLowerCase();
        tab.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /* ============================================
     Local Storage Helpers
     ============================================ */
  static getSettings(key, defaultValue = {}) {
    try {
      return JSON.parse(localStorage.getItem(key)) || defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static saveSettings(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static loadAllSettings() {
    // Initialize default settings if none exist
    Object.values(SETTINGS_STORAGE_KEYS).forEach(key => {
      if (!localStorage.getItem(key)) {
        this.saveSettings(key, {});
      }
    });
  }

  /* ============================================
     Toast Helper
     ============================================ */
  static showToast(message, type = 'success') {
    if (window.OP && OP.toast) {
      OP.toast.show(message, type);
    } else {
      // Fallback toast
      const container = document.querySelector('.toast-container') || (() => {
        const c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
      })();

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
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="ph ph-x"></i></button>
      `;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }
  }

  /* ============================================
     General Settings
     ============================================ */
  static initGeneralSettings() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS, {
      name: 'OnePlace HQ',
      email: 'hello@oneplace.com',
      industry: 'technology',
      website: 'https://oneplace.com',
      timezone: 'GMT+0100',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      firstDay: 'monday'
    });

    // Load saved values
    const fields = ['workspaceNameInput', 'workspaceEmailInput', 'workspaceIndustry', 'workspaceWebsite', 'workspaceTimezone', 'workspaceDateFormat', 'workspaceTimeFormat', 'workspaceFirstDay'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && settings[id.replace('workspace', '').replace('Input', '').toLowerCase()]) {
        el.value = settings[id.replace('workspace', '').replace('Input', '').toLowerCase()];
      }
    });

    // Logo upload
    const uploadBtn = document.getElementById('uploadLogoBtn');
    const fileInput = document.getElementById('logoFileInput');
    const removeBtn = document.getElementById('removeLogoBtn');
    const logoImg = document.getElementById('companyLogoImg');
    const logoPlaceholder = document.getElementById('logoPlaceholder');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (logoImg) {
              logoImg.src = event.target.result;
              logoImg.style.display = 'block';
              if (logoPlaceholder) logoPlaceholder.style.display = 'none';
            }
            this.showToast('Logo uploaded successfully');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (logoImg) {
          logoImg.src = '';
          logoImg.style.display = 'none';
        }
        if (logoPlaceholder) logoPlaceholder.style.display = 'flex';
        this.showToast('Logo removed');
      });
    }

    // Save
    const saveBtn = document.getElementById('saveGeneralSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newSettings = {
          name: document.getElementById('workspaceNameInput')?.value,
          email: document.getElementById('workspaceEmailInput')?.value,
          industry: document.getElementById('workspaceIndustry')?.value,
          website: document.getElementById('workspaceWebsite')?.value,
          timezone: document.getElementById('workspaceTimezone')?.value,
          dateFormat: document.getElementById('workspaceDateFormat')?.value,
          timeFormat: document.getElementById('workspaceTimeFormat')?.value,
          firstDay: document.getElementById('workspaceFirstDay')?.value
        };
        this.saveSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS, newSettings);
        this.showToast('General settings saved successfully');
      });
    }
  }

  /* ============================================
     Workspace Settings
     ============================================ */
  static initWorkspaceSettings() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS);

    // Logo upload
    const uploadBtn = document.getElementById('uploadWorkspaceLogo');
    const fileInput = document.getElementById('workspaceLogoInput');
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const preview = document.getElementById('workspaceLogoPreview');
            if (preview) {
              preview.innerHTML = `<img src="${event.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-xl);">`;
            }
            this.showToast('Workspace logo uploaded');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Delete workspace modal
    const deleteBtn = document.getElementById('deleteWorkspaceBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
          this.showToast('Workspace deleted', 'error');
        }
      });
    }

    // Save
    const saveBtn = document.getElementById('saveWorkspaceSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newSettings = {
          ...settings,
          name: document.getElementById('wsName')?.value,
          domain: document.getElementById('wsDomain')?.value,
          language: document.getElementById('wsLanguage')?.value,
          timezone: document.getElementById('wsTimezone')?.value,
          companySize: document.getElementById('wsCompanySize')?.value,
          defaultPermission: document.getElementById('wsDefaultPermission')?.value
        };
        this.saveSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS, newSettings);
        this.showToast('Workspace settings saved');
      });
    }
  }

  /* ============================================
     Profile Settings
     ============================================ */
  static initProfileSettings() {
    const session = OP.auth.getSession() || {};
    const profile = OP.profile.getProfile() || {};
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim()
      || profile.fullName
      || session.fullName
      || 'Alex Morgan';
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const firstName = profile.firstName || nameParts[0] || '';
    const lastName = profile.lastName || nameParts.slice(1).join(' ') || '';

    const nameInput = document.getElementById('profileNameInput');
    const emailInput = document.getElementById('profileEmailInput');
    const phoneInput = document.getElementById('profilePhoneInput');
    const jobTitleInput = document.getElementById('profileJobTitle');
    const departmentInput = document.getElementById('profileDepartment');
    const bioInput = document.getElementById('profileBio');

    if (nameInput) {
      nameInput.value = fullName;
    }

    if (emailInput) {
      emailInput.value = session.email || profile.email || 'alex.morgan@oneplace.com';
      emailInput.readOnly = true;
    }

    if (phoneInput) {
      phoneInput.value = profile.phone || '';
    }

    if (jobTitleInput) {
      jobTitleInput.value = profile.jobTitle || session.role || 'Administrator';
    }

    if (departmentInput) {
      departmentInput.value = profile.department || 'product';
    }

    if (bioInput) {
      bioInput.value = profile.bio || '';
    }

    // Photo upload
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const photoInput = document.getElementById('profilePhotoInput');
    const avatarImg = document.getElementById('profileAvatarImg');
    const avatarFallback = document.querySelector('.profile-avatar-fallback');

    if (changePhotoBtn && photoInput) {
      changePhotoBtn.addEventListener('click', () => photoInput.click());
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (avatarImg) {
              avatarImg.src = event.target.result;
              avatarImg.style.display = 'block';
              if (avatarFallback) avatarFallback.style.display = 'none';
            }
            this.showToast('Profile photo preview updated locally');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Save
    const saveBtn = document.getElementById('saveProfileSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const newFullName = nameInput?.value?.trim() || '';
        const nameParts = newFullName.split(/\s+/).filter(Boolean);
        const nextFirstName = nameParts[0] || firstName || '';
        const nextLastName = nameParts.slice(1).join(' ') || lastName || '';
        const nextPhone = phoneInput?.value?.trim() || '';

        const result = await OP.auth.updateCurrentUserProfile({
          firstName: nextFirstName,
          lastName: nextLastName,
          phone: nextPhone
        });

        if (result.success) {
          const updatedProfile = {
            ...(OP.profile.getProfile() || {}),
            firstName: nextFirstName,
            lastName: nextLastName,
            fullName: newFullName,
            phone: nextPhone,
            email: session.email || profile.email || emailInput?.value || '',
            jobTitle: jobTitleInput?.value || profile.jobTitle || '',
            department: departmentInput?.value || profile.department || '',
            bio: bioInput?.value || profile.bio || ''
          };
          OP.profile.saveProfile(updatedProfile);
          this.initUserData();
          this.showToast(result.message || 'Profile saved successfully');
        } else {
          this.showToast(result.message || 'Unable to save profile', 'error');
        }
      });
    }
  }

  /* ============================================
     Appearance Settings
     ============================================ */
  static initAppearanceSettings() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.APPEARANCE_SETTINGS, {
      displayMode: 'light',
      accentColor: 'indigo',
      layout: 'comfortable',
      fontSize: 'medium',
      reduceMotion: false
    });

    // Display mode
    document.querySelectorAll('.display-mode-option').forEach(opt => {
      const input = opt.querySelector('input');
      if (input && input.value === settings.displayMode) {
        input.checked = true;
      }
      opt.addEventListener('click', () => {
        document.querySelectorAll('.display-mode-option input').forEach(i => i.checked = false);
        input.checked = true;
        const mode = input.value;
        const theme = mode === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : mode;
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
        localStorage.setItem('op_theme', theme);
      });
    });

    // Accent color
    document.querySelectorAll('.accent-color-option').forEach(opt => {
      const input = opt.querySelector('input');
      if (input && input.value === settings.accentColor) {
        input.checked = true;
        opt.classList.add('active');
      }
      opt.addEventListener('click', () => {
        document.querySelectorAll('.accent-color-option').forEach(o => o.classList.remove('active'));
        document.querySelectorAll('.accent-color-option input').forEach(i => i.checked = false);
        opt.classList.add('active');
        input.checked = true;
      });
    });

    // Layout
    document.querySelectorAll('.layout-option').forEach(opt => {
      const input = opt.querySelector('input');
      if (input && input.value === settings.layout) {
        input.checked = true;
        opt.classList.add('active');
      }
      opt.addEventListener('click', () => {
        document.querySelectorAll('.layout-option').forEach(o => o.classList.remove('active'));
        document.querySelectorAll('.layout-option input').forEach(i => i.checked = false);
        opt.classList.add('active');
        input.checked = true;
      });
    });

    // Font size
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      if (btn.dataset.size === settings.fontSize) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Reduce motion
    const reduceMotionToggle = document.getElementById('reduceMotionToggle');
    if (reduceMotionToggle) {
      reduceMotionToggle.checked = settings.reduceMotion;
    }

    // Save
    const saveBtn = document.getElementById('saveAppearanceSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const displayMode = document.querySelector('.display-mode-option input:checked')?.value || 'light';
        const accentColor = document.querySelector('.accent-color-option input:checked')?.value || 'indigo';
        const layout = document.querySelector('.layout-option input:checked')?.value || 'comfortable';
        const fontSize = document.querySelector('.font-size-btn.active')?.dataset.size || 'medium';
        const reduceMotion = document.getElementById('reduceMotionToggle')?.checked || false;

        this.saveSettings(SETTINGS_STORAGE_KEYS.APPEARANCE_SETTINGS, {
          displayMode, accentColor, layout, fontSize, reduceMotion
        });
        this.showToast('Appearance settings saved');
      });
    }
  }

  /* ============================================
     Theme Settings
     ============================================ */
  static initThemeSettings() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.THEME_SETTINGS, {
      theme: 'default'
    });

    document.querySelectorAll('.theme-card').forEach(card => {
      const input = card.querySelector('input');
      if (input && input.value === settings.theme) {
        input.checked = true;
      }
      card.addEventListener('click', () => {
        document.querySelectorAll('.theme-card input').forEach(i => i.checked = false);
        input.checked = true;
      });
    });

    // Brand kit upload
    const uploadBrandBtn = document.getElementById('uploadBrandKit');
    if (uploadBrandBtn) {
      uploadBrandBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.zip,.json';
        input.onchange = () => this.showToast('Brand kit uploaded');
        input.click();
      });
    }

    // White label
    const configureWhiteLabel = document.getElementById('configureWhiteLabel');
    if (configureWhiteLabel) {
      configureWhiteLabel.addEventListener('click', () => {
        this.showToast('White label configuration coming soon', 'warning');
      });
    }

    // Save
    const saveBtn = document.getElementById('saveThemeSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const theme = document.querySelector('.theme-card input:checked')?.value || 'default';
        this.saveSettings(SETTINGS_STORAGE_KEYS.THEME_SETTINGS, { theme });
        this.showToast('Theme settings saved');
      });
    }
  }

  /* ============================================
     Language Settings
     ============================================ */
  static initLanguageSettings() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.LANGUAGE_SETTINGS, {
      language: 'en',
      currency: 'USD',
      numberFormat: '1,234.56',
      dateFormat: 'Aug 10, 2026',
      timeFormat: '12:00 PM',
      firstDay: 'monday',
      timezone: 'GMT+0100'
    });

    const fields = {
      'languageSelect': 'language',
      'currencySelect': 'currency',
      'numberFormat': 'numberFormat',
      'dateFormatLang': 'dateFormat',
      'timeFormatLang': 'timeFormat',
      'firstDayLang': 'firstDay',
      'timezoneLang': 'timezone'
    };

    Object.entries(fields).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el && settings[key]) el.value = settings[key];
    });

    const saveBtn = document.getElementById('saveLanguageSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newSettings = {};
        Object.entries(fields).forEach(([id, key]) => {
          newSettings[key] = document.getElementById(id)?.value;
        });
        this.saveSettings(SETTINGS_STORAGE_KEYS.LANGUAGE_SETTINGS, newSettings);
        this.showToast('Language settings saved');
      });
    }
  }

  /* ============================================
     Security Settings
     ============================================ */
  static initSecuritySettings() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.SECURITY_SETTINGS, {
      twoFactorEnabled: true,
      recoveryEmailSet: true,
      loginAlerts: true
    });

    // Change password modal
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const modal = document.getElementById('changePasswordModal');
    const closeModal = document.getElementById('closePasswordModal');
    const cancelBtn = document.getElementById('cancelPasswordChange');
    const confirmBtn = document.getElementById('confirmPasswordChange');

    if (changePasswordBtn && modal) {
      changePasswordBtn.addEventListener('click', () => modal.classList.add('active'));
    }

    [closeModal, cancelBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => modal?.classList.remove('active'));
    });

    if (confirmBtn) {
      confirmBtn.addEventListener('click', async () => {
        const current = document.getElementById('currentPassword')?.value;
        const newPass = document.getElementById('newPassword')?.value;
        const confirm = document.getElementById('confirmNewPassword')?.value;

        if (!current || !newPass || !confirm) {
          this.showToast('Please fill in all fields', 'error');
          return;
        }
        if (newPass !== confirm) {
          this.showToast('Passwords do not match', 'error');
          return;
        }

        const result = await OP.auth.changePassword(current, newPass);
        if (result.success) {
          modal.classList.remove('active');
          document.getElementById('currentPassword').value = '';
          document.getElementById('newPassword').value = '';
          document.getElementById('confirmNewPassword').value = '';
          this.showToast(result.message || 'Password changed successfully');
        } else {
          this.showToast(result.message || 'Unable to change password', 'error');
        }
      });
    }

    // Password strength
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
      newPasswordInput.addEventListener('input', (e) => {
        const strength = OP.validator.checkStrength(e.target.value);
        const segments = document.querySelectorAll('#passwordStrengthMeter .strength-segment');
        const label = document.getElementById('strengthLabel');
        
        segments.forEach((seg, i) => {
          seg.className = 'strength-segment';
          if (i < strength.score) {
            seg.classList.add(strength.class);
          }
        });
        
        if (label) {
          label.textContent = strength.label;
          label.className = `strength-label ${strength.class}`;
        }
      });
    }

    // Login alerts toggle
    const loginAlertsToggle = document.getElementById('loginAlertsToggle');
    if (loginAlertsToggle) {
      loginAlertsToggle.checked = settings.loginAlerts;
    }

    // Manage 2FA
    const manage2FABtn = document.getElementById('manage2FABtn');
    if (manage2FABtn) {
      manage2FABtn.addEventListener('click', () => {
        this.showToast('2FA management coming soon', 'warning');
      });
    }

    // Manage recovery
    const manageRecoveryBtn = document.getElementById('manageRecoveryBtn');
    if (manageRecoveryBtn) {
      manageRecoveryBtn.addEventListener('click', () => {
        this.showToast('Recovery email management coming soon', 'warning');
      });
    }

    // Save
    const saveBtn = document.getElementById('saveSecuritySettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings(SETTINGS_STORAGE_KEYS.SECURITY_SETTINGS, {
          ...settings,
          loginAlerts: loginAlertsToggle?.checked || false
        });
        this.showToast('Security settings saved');
      });
    }
  }

  /* ============================================
     Notification Settings
     ============================================ */
  static initNotificationSettings() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.NOTIFICATION_SETTINGS, {
      email: true,
      push: true,
      inApp: true,
      sms: false,
      newMessages: true,
      mentions: true,
      taskReminders: true,
      automationAlerts: false,
      weeklySummary: false
    });

    const toggles = {
      'emailNotifications': 'email',
      'pushNotifications': 'push',
      'inAppNotifications': 'inApp',
      'smsNotifications': 'sms',
      'newMessagesNotif': 'newMessages',
      'mentionsNotif': 'mentions',
      'taskRemindersNotif': 'taskReminders',
      'automationAlertsNotif': 'automationAlerts',
      'weeklySummaryNotif': 'weeklySummary'
    };

    Object.entries(toggles).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.checked = settings[key] !== undefined ? settings[key] : true;
    });

    const saveBtn = document.getElementById('saveNotificationSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newSettings = {};
        Object.entries(toggles).forEach(([id, key]) => {
          newSettings[key] = document.getElementById(id)?.checked || false;
        });
        this.saveSettings(SETTINGS_STORAGE_KEYS.NOTIFICATION_SETTINGS, newSettings);
        this.showToast('Notification settings saved');
      });
    }
  }

  /* ============================================
     Integrations Settings
     ============================================ */
  static initIntegrationsSettings() {
    // Tab switching
    document.querySelectorAll('.integration-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.integration-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.integration-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panelId = tab.dataset.tab + 'Panel';
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
      });
    });

    // Copy API keys
    const copyProdKey = document.getElementById('copyProdKey');
    const copyTestKey = document.getElementById('copyTestKey');
    
    [copyProdKey, copyTestKey].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          navigator.clipboard?.writeText('op_live_' + Math.random().toString(36).substring(2));
          this.showToast('API key copied to clipboard');
        });
      }
    });

    // Create API key
    const createApiKey = document.getElementById('createApiKey');
    if (createApiKey) {
      createApiKey.addEventListener('click', () => {
        this.showToast('New API key created');
      });
    }
  }

  /* ============================================
     Data Import
     ============================================ */
  static initDataImport() {
    const dropzone = document.getElementById('importDropzone');
    const fileInput = document.getElementById('importFileInput');
    const chooseFileBtn = document.getElementById('chooseFileBtn');

    if (chooseFileBtn && fileInput) {
      chooseFileBtn.addEventListener('click', () => fileInput.click());
    }

    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleImportFile(files[0]);
        }
      });

      dropzone.addEventListener('click', (e) => {
        if (e.target === dropzone || e.target.closest('.import-dropzone-icon') || e.target.closest('.import-dropzone-title')) {
          fileInput?.click();
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleImportFile(e.target.files[0]);
        }
      });
    }
  }

  static handleImportFile(file) {
    const historyList = document.getElementById('importHistoryList');
    const item = document.createElement('div');
    item.className = 'import-history-item';
    item.innerHTML = `
      <div class="import-history-icon"><i class="ph ph-file-csv"></i></div>
      <div class="import-history-info">
        <h4>${file.name}</h4>
        <p>${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Importing...</p>
      </div>
      <span class="import-history-status completed">Processing</span>
      <button class="import-history-menu"><i class="ph ph-dots-three-vertical"></i></button>
    `;
    historyList?.prepend(item);
    
    setTimeout(() => {
      const status = item.querySelector('.import-history-status');
      if (status) {
        status.textContent = 'Completed';
        status.className = 'import-history-status completed';
      }
      const info = item.querySelector('.import-history-info p');
      if (info) {
        info.textContent = `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${Math.floor(Math.random() * 500 + 50)} contacts`;
      }
      this.showToast('File imported successfully');
    }, 2000);
  }

  /* ============================================
     Data Export
     ============================================ */
  static initDataExport() {
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const checked = document.querySelectorAll('.export-checkbox:checked');
        if (checked.length === 0) {
          this.showToast('Please select at least one item to export', 'warning');
          return;
        }
        this.showToast(`Exporting ${checked.length} item(s)...`);
        setTimeout(() => {
          this.showToast('Export completed successfully');
        }, 2000);
      });
    }
  }

  /* ============================================
     Backup & Restore
     ============================================ */
  static initBackupRestore() {
    const autoBackupToggle = document.getElementById('autoBackupToggle');
    const createBackupBtn = document.getElementById('createBackupNow');

    if (createBackupBtn) {
      createBackupBtn.addEventListener('click', () => {
        this.showToast('Creating backup...');
        setTimeout(() => {
          this.showToast('Backup created successfully');
        }, 2000);
      });
    }

    const saveBtn = document.getElementById('saveBackupSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings(SETTINGS_STORAGE_KEYS.BACKUPS, {
          autoBackup: autoBackupToggle?.checked || false
        });
        this.showToast('Backup settings saved');
      });
    }
  }

  /* ============================================
     Audit Logs
     ============================================ */
  static initAuditLogs() {
    const searchInput = document.getElementById('auditLogSearch') || document.getElementById('logSearchInput');
    const tableBody = document.getElementById('auditLogTableBody');

    if (searchInput && tableBody) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    // Pagination
    document.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.disabled) {
          document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
          if (!btn.querySelector('i')) {
            btn.classList.add('active');
          }
        }
      });
    });
  }

  /* ============================================
     Connected Devices
     ============================================ */
  static initConnectedDevices() {
    const revokeButtons = document.querySelectorAll('.device-revoke');
    revokeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to revoke this device?')) {
          btn.closest('.device-item')?.remove();
          this.showToast('Device revoked successfully');
        }
      });
    });

    const logOutAllBtn = document.getElementById('logOutAllDevices');
    if (logOutAllBtn) {
      logOutAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out all other devices?')) {
          document.querySelectorAll('.device-item:not(.current)').forEach(item => item.remove());
          this.showToast('All other devices logged out');
        }
      });
    }
  }

  /* ============================================
     API & Developer
     ============================================ */
  static initApiDeveloper() {
    // Tab switching
    document.querySelectorAll('.developer-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.developer-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.developer-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panelId = tab.dataset.tab + 'Panel';
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
      });
    });

    // Copy keys
    ['copyProdKeyDev', 'copyTestKeyDev'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          navigator.clipboard?.writeText('op_' + (id.includes('Prod') ? 'live_' : 'test_') + Math.random().toString(36).substring(2, 18));
          this.showToast('API key copied to clipboard');
        });
      }
    });

    // Create new key
    const createNewKey = document.getElementById('createNewApiKey');
    if (createNewKey) {
      createNewKey.addEventListener('click', () => {
        this.showToast('New API key created');
      });
    }
  }

  /* ============================================
     Organization Settings
     ============================================ */
  static initOrganizationSettings() {
    const saveBtn = document.getElementById('saveOrgSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const organizationId = OP.auth.getSession()?.organizationId || null;
        const settings = {
          name: document.getElementById('orgName')?.value,
          regNumber: document.getElementById('orgRegNumber')?.value,
          industry: document.getElementById('orgIndustry')?.value,
          size: document.getElementById('orgSize')?.value,
          address: document.getElementById('orgAddress')?.value,
          website: document.getElementById('orgWebsite')?.value,
          taxId: document.getElementById('orgTaxId')?.value
        };

        if (!organizationId) {
          this.saveSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS, {
            ...this.getSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS),
            ...settings
          });
          this.showToast('Organization settings saved locally', 'warning');
          return;
        }

        try {
          await OP.apiIntegration.init();
          const response = await OP.apiIntegration.patch(`/organizations/${organizationId}`, {
            name: settings.name,
            description: [settings.industry, settings.address].filter(Boolean).join(' • ')
          });
          const payload = response && response.data ? response.data : {};
          if (payload.success) {
            this.saveSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS, {
              ...this.getSettings(SETTINGS_STORAGE_KEYS.WORKSPACE_SETTINGS),
              ...settings
            });
            this.showToast(payload.message || 'Organization settings saved');
          } else {
            this.showToast(payload.message || 'Unable to save organization settings', 'error');
          }
        } catch (error) {
          this.showToast(error?.message || 'Unable to save organization settings', 'error');
        }
      });
    }
  }

  /* ============================================
     Roles & Permissions
     ============================================ */
  static initRolesPermissions() {
    // Tab switching
    document.querySelectorAll('.roles-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.roles-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.roles-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panelId = tab.dataset.tab + 'Panel';
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
      });
    });

    // Create custom role
    const createCustomRole = document.getElementById('createCustomRole');
    if (createCustomRole) {
      createCustomRole.addEventListener('click', () => {
        this.showToast('Custom role creation coming soon', 'warning');
      });
    }

    // Save
    const saveBtn = document.getElementById('saveRolesSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.showToast('Roles & permissions saved');
      });
    }
  }

  /* ============================================
     AI Preferences
     ============================================ */
  static initAiPreferences() {
    const settings = this.getSettings(SETTINGS_STORAGE_KEYS.AI_SETTINGS, {
      model: 'gpt4',
      tone: 'professional',
      autoReply: true,
      autoSummarize: true,
      language: 'en'
    });

    const fields = {
      'aiModelSelect': 'model',
      'aiToneSelect': 'tone',
      'aiLanguageSelect': 'language'
    };

    Object.entries(fields).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el && settings[key]) el.value = settings[key];
    });

    const toggles = {
      'autoReplyToggle': 'autoReply',
      'aiSummarizeToggle': 'autoSummarize'
    };

    Object.entries(toggles).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.checked = settings[key] !== undefined ? settings[key] : true;
    });

    const saveBtn = document.getElementById('saveAiSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newSettings = { ...settings };
        Object.entries(fields).forEach(([id, key]) => {
          newSettings[key] = document.getElementById(id)?.value;
        });
        Object.entries(toggles).forEach(([id, key]) => {
          newSettings[key] = document.getElementById(id)?.checked || false;
        });
        this.saveSettings(SETTINGS_STORAGE_KEYS.AI_SETTINGS, newSettings);
        this.showToast('AI preferences saved');
      });
    }
  }

  /* ============================================
     Storage Management
     ============================================ */
  static initStorageManagement() {
    const upgradeBtn = document.getElementById('upgradeStorageBtn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        window.location.href = '../billing/';
      });
    }
  }
}

// Expose to window
window.SettingsApp = SettingsApp;