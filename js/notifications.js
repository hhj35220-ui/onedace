/**
 * OnePlace Enterprise v3.0 — Notifications Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const NOTIFICATION_STORAGE_KEYS = {
  NOTIFICATIONS: 'op_notifications_data',
  NOTIFICATION_SETTINGS: 'op_notifications_settings',
  NOTIFICATION_PREFERENCES: 'op_notifications_preferences',
  NOTIFICATION_HISTORY: 'op_notifications_history',
  NOTIFICATION_READ_STATE: 'op_notifications_read_state',
  NOTIFICATION_FILTERS: 'op_notifications_filters'
};

// ============================================
// Sample Data — matches reference image
// ============================================
const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'mention',
    category: 'mention',
    tag: 'Mentions',
    tagClass: 'mentions',
    title: 'You were mentioned by Sarah Johnson',
    body: '@alex Please review the new campaign proposal when you have a moment.',
    priority: 'high',
    source: 'mentions',
    sourceName: 'Mentions',
    timestamp: Date.now() - 120000,
    read: false,
    sender: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', initials: 'SJ', color: '#8b5cf6' },
    actionUrl: '../inbox/unified-inbox.html',
    actionLabel: 'View'
  },
  {
    id: 'notif_2',
    type: 'assignment',
    category: 'assignment',
    tag: 'Assignments',
    tagClass: 'assignments',
    title: 'Task assigned to you',
    body: 'Sarah Johnson assigned you "Follow up with leads" task.',
    priority: 'high',
    source: 'tasks',
    sourceName: 'Tasks',
    timestamp: Date.now() - 900000,
    read: false,
    sender: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', initials: 'SJ', color: '#10b981' },
    actionUrl: '../tasks/index.html',
    actionLabel: 'View Task'
  },
  {
    id: 'notif_3',
    type: 'email',
    category: 'email',
    tag: 'Gmail',
    tagClass: 'gmail',
    title: 'New email received',
    body: 'You have received a new email from Michael Brown.',
    priority: 'medium',
    source: 'gmail',
    sourceName: 'Gmail',
    timestamp: Date.now() - 1500000,
    read: false,
    sender: { name: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', initials: 'MB', color: '#ef4444' },
    actionUrl: '../gmail/index.html',
    actionLabel: 'View Email'
  },
  {
    id: 'notif_4',
    type: 'message',
    category: 'message',
    tag: 'WhatsApp',
    tagClass: 'whatsapp',
    title: 'New WhatsApp message',
    body: 'You have a new message from John Smith.',
    priority: 'medium',
    source: 'whatsapp',
    sourceName: 'WhatsApp',
    timestamp: Date.now() - 2700000,
    read: false,
    sender: { name: 'John Smith', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=64&h=64&fit=crop&crop=face', initials: 'JS', color: '#16a34a' },
    actionUrl: '../whatsapp/index.html',
    actionLabel: 'Reply'
  },
  {
    id: 'notif_5',
    type: 'event',
    category: 'calendar',
    tag: 'Calendar',
    tagClass: 'calendar',
    title: 'Upcoming event reminder',
    body: 'Team Standup meeting starts in 30 minutes.',
    priority: 'medium',
    source: 'calendar',
    sourceName: 'Calendar',
    timestamp: Date.now() - 3600000,
    read: true,
    sender: { name: 'Calendar', avatar: null, initials: 'CA', color: '#2563eb' },
    actionUrl: '../calendar/index.html',
    actionLabel: 'Join Meeting'
  },
  {
    id: 'notif_6',
    type: 'workflow',
    category: 'workflow',
    tag: 'Workflow',
    tagClass: 'workflow',
    title: 'Workflow execution completed',
    body: 'Lead Nurture Workflow has completed successfully.',
    priority: 'low',
    source: 'workflow',
    sourceName: 'Workflow',
    timestamp: Date.now() - 7200000,
    read: true,
    sender: { name: 'Workflow', avatar: null, initials: 'WF', color: '#a855f7' },
    actionUrl: '../workflow/index.html',
    actionLabel: 'View'
  },
  {
    id: 'notif_7',
    type: 'ai',
    category: 'ai',
    tag: 'AI',
    tagClass: 'ai',
    title: 'AI insight generated',
    body: 'New customer insights are ready to view.',
    priority: 'low',
    source: 'ai',
    sourceName: 'AI',
    timestamp: Date.now() - 10800000,
    read: true,
    sender: { name: 'AI Assistant', avatar: null, initials: 'AI', color: '#0ea5e9' },
    actionUrl: '../ai/index.html',
    actionLabel: 'View Insights'
  },
  {
    id: 'notif_8',
    type: 'support',
    category: 'support',
    tag: 'Customer Support',
    tagClass: 'customer-support',
    title: 'New support ticket',
    body: 'A new support ticket has been created by Emily Davis.',
    priority: 'medium',
    source: 'support',
    sourceName: 'Customer Support',
    timestamp: Date.now() - 14400000,
    read: true,
    sender: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', initials: 'ED', color: '#ea580c' },
    actionUrl: '../support/index.html',
    actionLabel: 'View Ticket'
  },
  {
    id: 'notif_9',
    type: 'mention',
    category: 'mention',
    tag: 'Mentions',
    tagClass: 'mentions',
    title: 'You were mentioned by Emily Davis',
    body: '@alex in Marketing Campaign — great work on the latest design!',
    priority: 'medium',
    source: 'mentions',
    sourceName: 'Mentions',
    timestamp: Date.now() - 18000000,
    read: true,
    sender: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', initials: 'ED', color: '#8b5cf6' },
    actionUrl: '../inbox/unified-inbox.html',
    actionLabel: 'View'
  },
  {
    id: 'notif_10',
    type: 'assignment',
    category: 'assignment',
    tag: 'Assignments',
    tagClass: 'assignments',
    title: 'Michael Brown assigned you a task',
    body: 'Follow up with leads',
    priority: 'high',
    source: 'tasks',
    sourceName: 'Tasks',
    timestamp: Date.now() - 21600000,
    read: true,
    sender: { name: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', initials: 'MB', color: '#10b981' },
    actionUrl: '../tasks/index.html',
    actionLabel: 'View Task'
  }
];

const SAMPLE_ACTIVITY = [
  { id: 'act_1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', initials: 'SJ', color: '#8b5cf6', text: 'Sarah Johnson mentioned you', desc: '@alex in Marketing Campaign', time: Date.now() - 120000 },
  { id: 'act_2', name: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', initials: 'MB', color: '#f59e0b', text: 'Michael Brown assigned you a task', desc: 'Follow up with leads', time: Date.now() - 900000 },
  { id: 'act_3', name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', initials: 'ED', color: '#ef4444', text: 'Emily Davis created a new ticket', desc: 'Issue with login', time: Date.now() - 14400000 }
];

// ============================================
// Notifications Module Class
// ============================================
class NotificationsModule {
  constructor() {
    this.currentTab = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.selectedItems = new Set();
    this.currentSort = 'newest';
    this.searchQuery = '';
    this.notifications = [];
    this.activity = [];
    this.settings = {};
    this.currentModalNotification = null;
    this.init();
  }

  init() {
    try {
      this.loadData();
      this.bindEvents();
      this.renderAll();
      this.updateStats();
      this.syncFromBackend();
    } catch (err) {
      console.error('Failed to initialize notifications module:', err);
      // Fallback: render empty state
      this.notifications = [];
      this.activity = [];
      this.settings = { emailNotifications: true, browserNotifications: true, soundAlerts: true };
      this.renderAll();
      this.updateStats();
    }
  }

  // ============================================
  // Data Management
  // ============================================
  loadData() {
    try {
      const savedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
    } catch (e) {
      console.warn('Failed to load notifications from localStorage, using defaults.', e);
      this.notifications = [];
    }

    try {
      const savedActivity = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_HISTORY);
      this.activity = savedActivity ? JSON.parse(savedActivity) : [];
    } catch (e) {
      console.warn('Failed to load activity from localStorage, using defaults.', e);
      this.activity = [];
    }

    try {
      const savedSettings = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_SETTINGS);
      this.settings = savedSettings ? JSON.parse(savedSettings) : {
        emailNotifications: true,
        browserNotifications: true,
        soundAlerts: true
      };
    } catch (e) {
      console.warn('Failed to load settings from localStorage, using defaults.', e);
      this.settings = {
        emailNotifications: true,
        browserNotifications: true,
        soundAlerts: true
      };
    }

    this.saveData();
  }

  async syncFromBackend() {
    if (!window.OP || !window.OP.apiIntegration) return;

    try {
      window.OP.apiIntegration.init();
      const response = await window.OP.apiIntegration.get('/notifications?limit=100').catch(() => null);
      const payload = response ? window.OP.apiIntegration.extractData(response) : null;
      const rows = Array.isArray(payload?.notifications)
        ? payload.notifications
        : window.OP.apiIntegration.extractArray(response);

      if (!rows.length) {
        this.renderAll();
        this.updateStats();
        this.updateBadges();
        return;
      }

      this.notifications = rows.map((item) => ({
        id: item.id,
        type: item.type || 'system',
        category: item.type || 'system',
        tag: item.type || 'System',
        tagClass: (item.type || 'system').toLowerCase(),
        title: item.title || 'Notification',
        body: item.message || item.body || '',
        priority: item.priority || 'medium',
        source: 'notifications',
        sourceName: 'Notifications',
        timestamp: new Date(item.createdAt || Date.now()).getTime(),
        read: !!item.isRead,
        sender: { name: 'System', avatar: null, initials: 'OP', color: '#4f46e5' },
        actionUrl: null,
        actionLabel: 'Open'
      }));

      this.activity = this.notifications.slice(0, 10).map((n) => ({
        id: `act_${n.id}`,
        name: n.sender.name,
        avatar: n.sender.avatar,
        initials: n.sender.initials,
        color: n.sender.color,
        text: n.title,
        desc: n.body,
        time: n.timestamp
      }));

      this.saveData();
      this.renderAll();
      this.updateStats();
      this.updateBadges();
    } catch (error) {
      console.warn('Notifications backend sync skipped:', error);
    }
  }

  saveData() {
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_HISTORY, JSON.stringify(this.activity));
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(this.settings));
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // Tab switching
    document.querySelectorAll('.notification-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Mark all read
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', () => this.markAllRead());
    }

    // Quick action: mark all read
    const qaMarkRead = document.getElementById('qaMarkRead');
    if (qaMarkRead) {
      qaMarkRead.addEventListener('click', () => this.markAllRead());
    }

    // Quick action: view mentions
    const qaMentions = document.getElementById('qaMentions');
    if (qaMentions) {
      qaMentions.addEventListener('click', () => this.switchTab('mentions'));
    }

    // Quick action: view assignments
    const qaAssignments = document.getElementById('qaAssignments');
    if (qaAssignments) {
      qaAssignments.addEventListener('click', () => this.switchTab('assignments'));
    }

    // Quick action: settings
    const qaSettings = document.getElementById('qaSettings');
    if (qaSettings) {
      qaSettings.addEventListener('click', () => {
        this.showToast('Notification settings opened', 'success');
      });
    }

    // Search
    const headerSearch = document.getElementById('headerSearch');
    if (headerSearch) {
      headerSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.renderNotificationList();
      });
    }

    // Pagination
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => this.prevPage());
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => this.nextPage());

    // Page number buttons
    document.querySelectorAll('.pagination-btn.page-num').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.renderNotificationList();
      });
    });

    // Settings toggles
    const toggleEmail = document.getElementById('toggleEmail');
    const toggleBrowser = document.getElementById('toggleBrowser');
    const toggleSound = document.getElementById('toggleSound');

    if (toggleEmail) {
      toggleEmail.checked = this.settings.emailNotifications;
      toggleEmail.addEventListener('change', (e) => {
        this.settings.emailNotifications = e.target.checked;
        this.saveData();
        this.showToast('Email notifications ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
      });
    }

    if (toggleBrowser) {
      toggleBrowser.checked = this.settings.browserNotifications;
      toggleBrowser.addEventListener('change', (e) => {
        this.settings.browserNotifications = e.target.checked;
        this.saveData();
        this.showToast('Browser notifications ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
      });
    }

    if (toggleSound) {
      toggleSound.checked = this.settings.soundAlerts;
      toggleSound.addEventListener('change', (e) => {
        this.settings.soundAlerts = e.target.checked;
        this.saveData();
        this.showToast('Sound alerts ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
      });
    }

    // Modals
    const closeNotificationModal = document.getElementById('closeNotificationModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const modalMarkUnreadBtn = document.getElementById('modalMarkUnreadBtn');
    const modalActionBtn = document.getElementById('modalActionBtn');

    if (closeNotificationModal) closeNotificationModal.addEventListener('click', () => this.closeModal('notificationModal'));
    if (closeDeleteModal) closeDeleteModal.addEventListener('click', () => this.closeModal('deleteConfirmModal'));
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => this.closeModal('deleteConfirmModal'));
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
    if (modalMarkUnreadBtn) modalMarkUnreadBtn.addEventListener('click', () => this.modalMarkUnread());
    if (modalActionBtn) modalActionBtn.addEventListener('click', () => this.modalAction());

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
      });
    });

    // View all links
    const viewAllActivity = document.getElementById('viewAllActivity');
    if (viewAllActivity) {
      viewAllActivity.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('View all activity', 'success');
      });
    }

    const viewAllOverview = document.getElementById('viewAllOverview');
    if (viewAllOverview) {
      viewAllOverview.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('View all notifications', 'success');
      });
    }

    // Manage preferences
    const managePreferencesBtn = document.getElementById('managePreferencesBtn');
    if (managePreferencesBtn) {
      managePreferencesBtn.addEventListener('click', () => {
        this.showToast('Manage preferences', 'success');
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const headerSearch = document.getElementById('headerSearch');
        if (headerSearch) headerSearch.focus();
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
      }
    });

    // Theme toggle
    const themeToggleSidebar = document.getElementById('themeToggleSidebar');
    if (themeToggleSidebar) {
      themeToggleSidebar.addEventListener('click', () => {
        if (window.OP && window.OP.theme) {
          window.OP.theme.toggle();
        }
      });
    }

    // Header notification button
    const headerNotificationsBtn = document.getElementById('headerNotificationsBtn');
    if (headerNotificationsBtn) {
      headerNotificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleHeaderDropdown(e.currentTarget);
      });
    }
  }

  // ============================================
  // Header dropdown (compact preview)
  // ============================================
  toggleHeaderDropdown(btnEl) {
    const existing = document.getElementById('headerNotificationDropdown');
    if (existing) {
      existing.remove();
      document.removeEventListener('click', this._headerDropdownDocClick);
      return;
    }

    const rect = btnEl.getBoundingClientRect();
    const dropdown = document.createElement('div');
    dropdown.id = 'headerNotificationDropdown';
    dropdown.className = 'header-notification-dropdown';
    dropdown.setAttribute('role', 'dialog');
    dropdown.setAttribute('aria-label', 'Notifications preview');
    dropdown.innerHTML = `
      <div class="hdr-notif-header">
        <strong>Notifications</strong>
        <button class="hdr-view-all" aria-label="View all notifications">View all</button>
      </div>
      <div class="hdr-notif-list">${this.notifications.slice().sort((a,b)=>b.timestamp-a.timestamp).slice(0,5).map(n=>`
        <button class="hdr-notif-item" data-id="${n.id}">
          <div class="hdr-item-title">${this.escapeHtml(n.title)}</div>
          <div class="hdr-item-meta">${this.formatTimeAgo(n.timestamp)}</div>
        </button>
      `).join('')}</div>
    `;

    document.body.appendChild(dropdown);
    dropdown.style.top = `${rect.bottom + 8 + window.scrollY}px`;
    dropdown.style.left = `${Math.max(8, rect.left + window.scrollX - 200)}px`;

    dropdown.querySelectorAll('.hdr-notif-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        this.openNotificationDetail(id);
        dropdown.remove();
      });
    });

    const viewAll = dropdown.querySelector('.hdr-view-all');
    if (viewAll) viewAll.addEventListener('click', () => {
      dropdown.remove();
    });

    this._headerDropdownDocClick = (ev) => {
      if (!dropdown.contains(ev.target) && ev.target !== btnEl) {
        dropdown.remove();
        document.removeEventListener('click', this._headerDropdownDocClick);
      }
    };
    document.addEventListener('click', this._headerDropdownDocClick);
  }

  // ============================================
  // Tab Switching
  // ============================================
  switchTab(tabName) {
    this.currentTab = tabName;
    this.currentPage = 1;

    document.querySelectorAll('.notification-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    this.renderNotificationList();
  }

  // ============================================
  // Rendering
  // ============================================
  renderAll() {
    try {
      this.renderNotificationList();
      this.renderActivityTimeline();
      this.updateStats();
      this.updateBadges();
    } catch (err) {
      console.error('Error in renderAll:', err);
    }
  }

  getFilteredNotifications() {
    let filtered = [...this.notifications];

    if (this.currentTab !== 'all') {
      if (this.currentTab === 'unread') {
        filtered = filtered.filter(n => !n.read);
      } else {
        filtered = filtered.filter(n => n.category === this.currentTab || n.tagClass === this.currentTab);
      }
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.sender.name.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  renderNotificationList() {
    const list = document.getElementById('notificationList');
    if (!list) {
      console.warn('Notification list container not found');
      return;
    }

    try {

    let filtered = this.getFilteredNotifications();

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Math.min(start + this.itemsPerPage, totalItems);
    const paginated = filtered.slice(start, end);

    // Update pagination UI
    const paginationStart = document.getElementById('paginationStart');
    const paginationEnd = document.getElementById('paginationEnd');
    const paginationTotal = document.getElementById('paginationTotal');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    if (paginationStart) paginationStart.textContent = totalItems > 0 ? start + 1 : 0;
    if (paginationEnd) paginationEnd.textContent = end;
    if (paginationTotal) paginationTotal.textContent = totalItems;
    if (prevPageBtn) prevPageBtn.disabled = this.currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = this.currentPage >= totalPages;

    // Update page number buttons
    document.querySelectorAll('.pagination-btn.page-num').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.page) === this.currentPage);
    });

    if (paginated.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="ph ph-bell-slash"></i>
          <h3>No notifications found</h3>
          <p>Try adjusting your filters or search query</p>
        </div>
      `;
      return;
    }

    list.innerHTML = paginated.map(notif => this.renderNotificationItem(notif)).join('');

    // Bind item events
    list.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.notification-checkbox') || e.target.closest('.notification-actions-btn')) return;
        this.openNotificationDetail(item.dataset.id);
      });
    });

    list.querySelectorAll('.notification-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.closest('.notification-item').dataset.id;
        if (e.target.checked) {
          this.selectedItems.add(id);
        } else {
          this.selectedItems.delete(id);
        }
      });
    });

    list.querySelectorAll('.notification-actions-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.closest('.notification-item').dataset.id;
        this.confirmDeleteSingle(id);
      });
    });
    } catch (err) {
      console.error('Error rendering notification list:', err);
      list.innerHTML = `
        <div class="empty-state">
          <i class="ph ph-warning-circle"></i>
          <h3>Error loading notifications</h3>
          <p>Please refresh the page to try again</p>
        </div>
      `;
    }
  }

  renderNotificationItem(notif) {
    const timeAgo = this.formatTimeAgo(notif.timestamp);
    const avatarHtml = notif.sender.avatar
      ? `<img src="${notif.sender.avatar}" alt="${this.escapeHtml(notif.sender.name)}">`
      : notif.sender.initials;

    return `
      <div class="notification-item ${!notif.read ? 'unread' : ''}" data-id="${notif.id}">
        <div class="notification-checkbox-wrap">
          <input type="checkbox" class="notification-checkbox">
        </div>
        <div class="notification-avatar" style="background: ${notif.sender.color};">
          ${avatarHtml}
        </div>
        <div class="notification-content-wrap">
          <div class="notification-title">${this.escapeHtml(notif.title)}</div>
          <div class="notification-body">${this.escapeHtml(notif.body)}</div>
          <div class="notification-meta-row">
            <span class="notification-tag ${notif.tagClass}">${this.escapeHtml(notif.tag || notif.sourceName)}</span>
            <span class="notification-time">${timeAgo}</span>
          </div>
        </div>
        ${!notif.read ? '<div class="notification-unread-indicator"></div>' : ''}
        <button class="notification-actions-btn" title="More options">
          <i class="ph ph-dots-three-vertical"></i>
        </button>
      </div>
    `;
  }

  renderActivityTimeline() {
    const timeline = document.getElementById('recentActivityList');
    if (!timeline) return;

    timeline.innerHTML = this.activity.map(act => {
      const avatarHtml = act.avatar
        ? `<img src="${act.avatar}" alt="${this.escapeHtml(act.name)}">`
        : act.initials;
      return `
        <div class="activity-item">
          <div class="activity-avatar" style="background: ${act.color};">
            ${avatarHtml}
          </div>
          <div class="activity-content">
            <div class="activity-text"><strong>${this.escapeHtml(act.name)}</strong> ${this.escapeHtml(act.text.replace(act.name, '').trim())}</div>
            <div class="activity-desc">${this.escapeHtml(act.desc)}</div>
          </div>
          <span class="activity-time">${this.formatTimeAgo(act.time)}</span>
        </div>
      `;
    }).join('');
  }

  // ============================================
  // Actions
  // ============================================
  markAsRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (!notif) return;

    notif.read = !notif.read;
    this.saveData();
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();

    this.showToast(notif.read ? 'Marked as read' : 'Marked as unread', 'success');

    if (window.OP && window.OP.apiIntegration) {
      window.OP.apiIntegration
        .patch(`/notifications/${id}/read`, { isRead: notif.read })
        .catch(() => {});
    }
  }

  markAllRead() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    this.notifications.forEach(n => n.read = true);
    this.saveData();
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();
    this.showToast(`${unreadCount} notifications marked as read`, 'success');

    if (window.OP && window.OP.apiIntegration) {
      window.OP.apiIntegration.patch('/notifications/read-all', { isRead: true }).catch(() => {});
    }
  }

  confirmDeleteSingle(id) {
    this.currentModalNotification = id;
    this.openModal('deleteConfirmModal');
  }

  confirmDelete() {
    const deletedId = this.currentModalNotification;
    if (this.currentModalNotification) {
      this.notifications = this.notifications.filter(n => n.id !== this.currentModalNotification);
      this.currentModalNotification = null;
    }
    this.saveData();
    this.closeModal('deleteConfirmModal');
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();
    this.showToast('Notification deleted', 'success');

    if (deletedId && window.OP && window.OP.apiIntegration) {
      window.OP.apiIntegration.delete(`/notifications/${deletedId}`).catch(() => {});
    }
  }

  // ============================================
  // Modal Actions
  // ============================================
  openNotificationDetail(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (!notif) return;

    this.currentModalNotification = id;

    // Auto-mark as read
    if (!notif.read) {
      notif.read = true;
      this.saveData();
      this.updateStats();
      this.updateBadges();
    }

    const modalBody = document.getElementById('notificationModalBody');
    if (!modalBody) return;

    const tagColors = {
      mentions: { bg: '#eef2ff', color: '#4f46e5' },
      assignments: { bg: '#fef3c7', color: '#d97706' },
      gmail: { bg: '#fef2f2', color: '#dc2626' },
      whatsapp: { bg: '#f0fdf4', color: '#16a34a' },
      calendar: { bg: '#eff6ff', color: '#2563eb' },
      workflow: { bg: '#fdf4ff', color: '#a855f7' },
      ai: { bg: '#f0f9ff', color: '#0ea5e9' },
      'customer-support': { bg: '#fff7ed', color: '#ea580c' },
      system: { bg: '#f8fafc', color: '#64748b' },
      instagram: { bg: '#fdf2f8', color: '#db2777' },
      tiktok: { bg: '#f8fafc', color: '#0f172a' },
      linkedin: { bg: '#eff6ff', color: '#0a66c2' },
      x: { bg: '#f1f5f9', color: '#0f172a' }
    };

    const colors = tagColors[notif.tagClass] || tagColors.system;

    modalBody.innerHTML = `
      <div class="notification-detail">
        <div class="notification-detail-header">
          <div class="notification-detail-icon" style="background: ${colors.bg}; color: ${colors.color};">
            <i class="ph ${this.getCategoryIcon(notif.category)}"></i>
          </div>
          <div class="notification-detail-meta">
            <div class="notification-detail-title">${this.escapeHtml(notif.title)}</div>
            <div class="notification-detail-time">${this.formatTimeAgo(notif.timestamp)} · ${this.escapeHtml(notif.sourceName)}</div>
          </div>
        </div>
        <div class="notification-detail-body">
          ${this.escapeHtml(notif.body)}
        </div>
        <div class="notification-detail-tags">
          <span class="detail-tag" style="background: ${colors.bg}; color: ${colors.color};">${notif.tag || notif.sourceName}</span>
          <span class="detail-tag">From: ${this.escapeHtml(notif.sender.name)}</span>
        </div>
      </div>
    `;

    const actionBtn = document.getElementById('modalActionBtn');
    if (actionBtn) {
      actionBtn.textContent = notif.actionLabel || 'Take Action';
      actionBtn.style.display = notif.actionUrl ? 'inline-flex' : 'none';
    }

    const markUnreadBtn = document.getElementById('modalMarkUnreadBtn');
    if (markUnreadBtn) {
      markUnreadBtn.textContent = notif.read ? 'Mark as Unread' : 'Mark as Read';
    }

    this.openModal('notificationModal');
    this.renderNotificationList();
  }

  modalMarkUnread() {
    if (!this.currentModalNotification) return;
    const notif = this.notifications.find(n => n.id === this.currentModalNotification);
    if (!notif) return;

    notif.read = !notif.read;
    this.saveData();
    this.closeModal('notificationModal');
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();

    this.showToast(notif.read ? 'Marked as read' : 'Marked as unread', 'success');
  }

  modalAction() {
    const notif = this.notifications.find(n => n.id === this.currentModalNotification);
    if (notif && notif.actionUrl) {
      window.location.href = notif.actionUrl;
    }
  }

  // ============================================
  // Pagination
  // ============================================
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderNotificationList();
    }
  }

  nextPage() {
    const filtered = this.getFilteredNotifications();
    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderNotificationList();
    }
  }

  // ============================================
  // Stats & Badges
  // ============================================
  updateStats() {
    const total = this.notifications.length;
    const unread = this.notifications.filter(n => !n.read).length;
    const mentions = this.notifications.filter(n => n.category === 'mention').length;
    const assignments = this.notifications.filter(n => n.category === 'assignment').length;
    const system = this.notifications.filter(n => n.category === 'system').length;
    const crm = this.notifications.filter(n => n.category === 'crm').length;
    const calendar = this.notifications.filter(n => n.category === 'calendar').length;
    const workflow = this.notifications.filter(n => n.category === 'workflow').length;
    const ai = this.notifications.filter(n => n.category === 'ai').length;

    this.updateElement('overviewTotal', total.toString());
    this.updateElement('tabBadgeAll', total.toString());
    this.updateElement('tabBadgeUnread', unread.toString());
    this.updateElement('tabBadgeMentions', mentions.toString());
    this.updateElement('tabBadgeAssignments', assignments.toString());
    this.updateElement('tabBadgeSystem', system.toString());
    this.updateElement('tabBadgeCRM', crm.toString());
    this.updateElement('tabBadgeCalendar', calendar.toString());
    this.updateElement('tabBadgeWorkflow', workflow.toString());
    this.updateElement('tabBadgeAI', ai.toString());

    // Header dot
    const headerDot = document.getElementById('headerNotificationDot');
    if (headerDot) {
      headerDot.style.display = unread > 0 ? 'block' : 'none';
    }

    // Sidebar badge
    const sidebarBadge = document.getElementById('sidebarNotifBadge');
    if (sidebarBadge) {
      sidebarBadge.textContent = unread.toString();
      sidebarBadge.style.display = unread > 0 ? 'inline-block' : 'none';
    }
  }

  updateBadges() {
    // Already handled in updateStats
  }

  updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // ============================================
  // Utilities
  // ============================================
  getCategoryIcon(category) {
    const icons = {
      message: 'ph-chat-circle-text',
      mention: 'ph-at',
      assignment: 'ph-user-plus',
      system: 'ph-warning-circle',
      email: 'ph-envelope',
      calendar: 'ph-calendar-blank',
      workflow: 'ph-git-branch',
      ai: 'ph-sparkle',
      support: 'ph-headset',
      crm: 'ph-users-three'
    };
    return icons[category] || 'ph-bell';
  }

  formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  }

  showToast(message, type = 'success') {
    if (window.OP && window.OP.toast) {
      window.OP.toast.show(message, type);
    } else {
      const toast = document.createElement('div');
      toast.className = 'action-toast';
      toast.innerHTML = `<i class="ph ${type === 'success' ? 'ph-check-circle' : 'ph-warning'}"></i> ${message}`;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // ============================================
  // Public API
  // ============================================
  pushNotification(payload = {}) {
    const id = payload.id || `notif_${Date.now()}`;
    const notif = Object.assign({
      id,
      title: payload.title || 'Notification',
      body: payload.body || '',
      priority: payload.priority || 'low',
      category: payload.category || 'system',
      tag: payload.tag || payload.sourceName || 'System',
      tagClass: payload.tagClass || 'system',
      source: payload.source || 'system',
      sourceName: payload.sourceName || 'System',
      timestamp: payload.timestamp || Date.now(),
      read: !!payload.read,
      sender: payload.sender || { name: payload.sourceName || 'System', initials: 'OP', color: '#4f46e5' },
      actionUrl: payload.actionUrl || null,
      actionLabel: payload.actionLabel || 'Open'
    }, payload);

    this.notifications.unshift(notif);
    this.saveData();
    this.updateStats();
    this.updateBadges();
    this.renderNotificationList();

    if (this.settings.soundAlerts) this._playSound();
    this.showToast(notif.title, notif.priority === 'high' ? 'error' : 'success');

    return notif;
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  _playSound() {
    try {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01);
      o.start();
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        setTimeout(() => { try { o.stop(); ctx.close(); } catch (e) {} }, 200);
      }, 120);
    } catch (e) { /* ignore audio errors */ }
  }
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const nm = new NotificationsModule();
  window.notificationsModule = nm;
  if (!window.OP) window.OP = {};
  window.OP.notifications = nm;
});

// Standalone theme toggle fallback (if app.js is not loaded)
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggleSidebar');
  if (themeToggle && (!window.OP || !window.OP.theme)) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      const span = themeToggle.querySelector('span');
      const icon = themeToggle.querySelector('i');
      if (span) span.textContent = next === 'light' ? 'Light Mode' : 'Dark Mode';
      if (icon) icon.className = next === 'light' ? 'ph ph-moon' : 'ph ph-sun';
    });
  }
});