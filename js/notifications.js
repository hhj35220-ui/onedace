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
// Sample Data
// ============================================
const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'mention',
    category: 'mention',
    title: 'Sarah Williams mentioned you',
    body: '@alex Check out the Q2 sales report — numbers look great this quarter! We should discuss the strategy for next quarter.',
    priority: 'high',
    source: 'gmail',
    sourceName: 'Gmail',
    timestamp: Date.now() - 120000,
    read: false,
    sender: { name: 'Sarah Williams', avatar: 'SW', color: '#8b5cf6' },
    actionUrl: '../gmail/gmail.html',
    actionLabel: 'View Email'
  },
  {
    id: 'notif_2',
    type: 'assignment',
    category: 'assignment',
    title: 'New task assigned to you',
    body: 'You have been assigned to handle the enterprise client onboarding for Acme Corp. Due by Friday, July 17.',
    priority: 'high',
    source: 'tasks',
    sourceName: 'Tasks',
    timestamp: Date.now() - 900000,
    read: false,
    sender: { name: 'Jake Cooper', avatar: 'JC', color: '#8b5cf6' },
    actionUrl: '../tasks/index.html',
    actionLabel: 'View Task'
  },
  {
    id: 'notif_3',
    type: 'system',
    category: 'system',
    title: 'System maintenance scheduled',
    body: 'Scheduled maintenance will occur on July 15, 2026 at 02:00 UTC. Expected downtime: 30 minutes. Please save your work.',
    priority: 'medium',
    source: 'system',
    sourceName: 'System',
    timestamp: Date.now() - 1800000,
    read: false,
    sender: { name: 'System', avatar: 'SY', color: '#f59e0b' },
    actionUrl: null,
    actionLabel: 'Acknowledge'
  },
  {
    id: 'notif_4',
    type: 'message',
    category: 'message',
    title: 'New WhatsApp message',
    body: 'John Doe: "Hi Alex, just following up on our conversation about the product demo. Are you available tomorrow at 2pm?"',
    priority: 'medium',
    source: 'whatsapp',
    sourceName: 'WhatsApp',
    timestamp: Date.now() - 2700000,
    read: false,
    sender: { name: 'John Doe', avatar: 'JD', color: '#6366f1' },
    actionUrl: '../whatsapp/whatsapp.html',
    actionLabel: 'Reply'
  },
  {
    id: 'notif_5',
    type: 'email',
    category: 'email',
    title: 'Weekly digest available',
    body: 'Your weekly notification digest is ready. You have 24 unread notifications across all channels this week.',
    priority: 'low',
    source: 'email',
    sourceName: 'Email',
    timestamp: Date.now() - 3600000,
    read: true,
    sender: { name: 'OnePlace', avatar: 'OP', color: '#4f46e5' },
    actionUrl: null,
    actionLabel: 'View Digest'
  },
  {
    id: 'notif_6',
    type: 'mention',
    category: 'mention',
    title: 'Emily Davis mentioned you on X',
    body: '@alexmorgan Great insights from the team meeting today! Looking forward to implementing the new workflow.',
    priority: 'medium',
    source: 'x',
    sourceName: 'X (Twitter)',
    timestamp: Date.now() - 5400000,
    read: true,
    sender: { name: 'Emily Davis', avatar: 'ED', color: '#eab308' },
    actionUrl: '../x/x.html',
    actionLabel: 'View Post'
  },
  {
    id: 'notif_7',
    type: 'assignment',
    category: 'assignment',
    title: 'Conversation assigned to you',
    body: 'A high-priority conversation with Enterprise Client has been assigned to you. Response time target: 15 minutes.',
    priority: 'high',
    source: 'unified-inbox',
    sourceName: 'Unified Inbox',
    timestamp: Date.now() - 7200000,
    read: false,
    sender: { name: 'Auto Assign', avatar: 'AA', color: '#10b981' },
    actionUrl: '../inbox/unified-inbox.html',
    actionLabel: 'Open Conversation'
  },
  {
    id: 'notif_8',
    type: 'system',
    category: 'system',
    title: 'Security alert',
    body: 'New login detected from IP 192.168.1.45. If this was not you, please review your account security settings immediately.',
    priority: 'high',
    source: 'system',
    sourceName: 'Security',
    timestamp: Date.now() - 10800000,
    read: false,
    sender: { name: 'Security', avatar: 'SC', color: '#ef4444' },
    actionUrl: '../settings/index.html',
    actionLabel: 'Review Security'
  },
  {
    id: 'notif_9',
    type: 'message',
    category: 'message',
    title: 'Instagram DM received',
    body: 'laura_garcia: "Love the new product photos! Can we feature them in our next campaign?"',
    priority: 'low',
    source: 'instagram',
    sourceName: 'Instagram',
    timestamp: Date.now() - 14400000,
    read: true,
    sender: { name: 'Laura Garcia', avatar: 'LG', color: '#f43f5e' },
    actionUrl: '../instagram/instagram.html',
    actionLabel: 'Reply'
  },
  {
    id: 'notif_10',
    type: 'email',
    category: 'email',
    title: 'Invoice payment received',
    body: 'Payment of $4,500 for Invoice #4821 has been received. Thank you for your business!',
    priority: 'low',
    source: 'gmail',
    sourceName: 'Gmail',
    timestamp: Date.now() - 18000000,
    read: true,
    sender: { name: 'Billing', avatar: 'BI', color: '#10b981' },
    actionUrl: '../billing/billing.html',
    actionLabel: 'View Invoice'
  },
  {
    id: 'notif_11',
    type: 'mention',
    category: 'mention',
    title: 'Michael Brown mentioned you on LinkedIn',
    body: 'Alex Morgan — great article on customer engagement strategies. Would love to connect and discuss further.',
    priority: 'medium',
    source: 'linkedin',
    sourceName: 'LinkedIn',
    timestamp: Date.now() - 21600000,
    read: true,
    sender: { name: 'Michael Brown', avatar: 'MB', color: '#f97316' },
    actionUrl: '../linkedin/linkedin.html',
    actionLabel: 'View Message'
  },
  {
    id: 'notif_12',
    type: 'assignment',
    category: 'assignment',
    title: 'Review required: Q3 marketing plan',
    body: 'Please review and approve the Q3 marketing plan draft. 3 comments require your attention.',
    priority: 'medium',
    source: 'workflow',
    sourceName: 'Workflow',
    timestamp: Date.now() - 25200000,
    read: false,
    sender: { name: 'Cody Fisher', avatar: 'CF', color: '#ec4899' },
    actionUrl: '../workflow/workflow.html',
    actionLabel: 'Review'
  },
  {
    id: 'notif_13',
    type: 'system',
    category: 'system',
    title: 'Storage usage warning',
    body: 'You have used 85% of your storage quota. Consider upgrading your plan or cleaning up old files.',
    priority: 'medium',
    source: 'system',
    sourceName: 'System',
    timestamp: Date.now() - 28800000,
    read: true,
    sender: { name: 'System', avatar: 'SY', color: '#f59e0b' },
    actionUrl: '../billing/billing.html',
    actionLabel: 'Upgrade Plan'
  },
  {
    id: 'notif_14',
    type: 'message',
    category: 'message',
    title: 'TikTok comment reply',
    body: 'Your video "Product Demo 2026" received a new comment from @techreviewer: "This is exactly what we needed!"',
    priority: 'low',
    source: 'tiktok',
    sourceName: 'TikTok',
    timestamp: Date.now() - 32400000,
    read: true,
    sender: { name: 'TikTok', avatar: 'TT', color: '#000000' },
    actionUrl: '../tiktok/tiktok.html',
    actionLabel: 'View Comment'
  },
  {
    id: 'notif_15',
    type: 'email',
    category: 'email',
    title: 'Meeting reminder: Product Review',
    body: 'Reminder: Product Review meeting in 30 minutes (3:00 PM - 4:00 PM). Conference Room B.',
    priority: 'medium',
    source: 'calendar',
    sourceName: 'Calendar',
    timestamp: Date.now() - 36000000,
    read: false,
    sender: { name: 'Calendar', avatar: 'CA', color: '#6366f1' },
    actionUrl: '../calendar/calendar.html',
    actionLabel: 'Join Meeting'
  }
];

const SAMPLE_ACTIVITY = [
  { id: 'act_1', type: 'mention', text: 'Sarah Williams mentioned you in Gmail', time: Date.now() - 120000 },
  { id: 'act_2', type: 'assignment', text: 'New task assigned from Jake Cooper', time: Date.now() - 900000 },
  { id: 'act_3', type: 'system', text: 'System maintenance scheduled', time: Date.now() - 1800000 },
  { id: 'act_4', type: 'message', text: 'New WhatsApp message from John Doe', time: Date.now() - 2700000 },
  { id: 'act_5', type: 'email', text: 'Weekly digest generated', time: Date.now() - 3600000 },
  { id: 'act_6', type: 'mention', text: 'Emily Davis mentioned you on X', time: Date.now() - 5400000 },
  { id: 'act_7', type: 'assignment', text: 'Conversation assigned to you', time: Date.now() - 7200000 },
  { id: 'act_8', type: 'system', text: 'Security alert: New login detected', time: Date.now() - 10800000 }
];

// ============================================
// Notifications Module Class
// ============================================
class NotificationsModule {
  constructor() {
    this.currentTab = 'center';
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.selectedItems = new Set();
    this.currentSort = 'newest';
    this.activeFilters = {
      status: ['unread'],
      priority: [],
      category: []
    };
    this.currentCategory = 'all';
    this.notifications = [];
    this.activity = [];
    this.settings = {};
    this.preferences = {};
    this.currentModalNotification = null;
    this.init();
  }

  init() {
    this.loadData();
    this.bindEvents();
    this.renderAll();
    this.updateStats();
  }

  // ============================================
  // Data Management
  // ============================================
  loadData() {
    const savedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATIONS);
    this.notifications = savedNotifications ? JSON.parse(savedNotifications) : [...SAMPLE_NOTIFICATIONS];

    const savedActivity = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_HISTORY);
    this.activity = savedActivity ? JSON.parse(savedActivity) : [...SAMPLE_ACTIVITY];

    const savedSettings = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_SETTINGS);
    this.settings = savedSettings ? JSON.parse(savedSettings) : {
      enableAll: true,
      sound: true,
      desktop: true,
      autoRead: false,
      channelGmail: true,
      channelWhatsapp: true,
      channelInstagram: true,
      channelTiktok: true,
      channelX: true,
      channelLinkedin: true,
      preview: true,
      group: true,
      quiet: false,
      quietStart: '22:00',
      quietEnd: '07:00',
      dailyDigest: true,
      weeklyDigest: false,
      digestTime: '09:00',
      push: true,
      vibrate: true
    };

    const savedPreferences = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_PREFERENCES);
    this.preferences = savedPreferences ? JSON.parse(savedPreferences) : {
      realtime: true,
      emailSummary: true,
      browserAlerts: true,
      mentionAlerts: true,
      assignmentAlerts: true,
      systemAlerts: true
    };

    const savedFilters = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_FILTERS);
    if (savedFilters) {
      this.activeFilters = JSON.parse(savedFilters);
    }

    this.saveData();
  }

  saveData() {
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_HISTORY, JSON.stringify(this.activity));
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(this.settings));
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(this.preferences));
    localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_FILTERS, JSON.stringify(this.activeFilters));
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // Tab switching
    document.querySelectorAll('.notification-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
    });

    // Category list items
    document.querySelectorAll('.category-list-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.category-list-item').forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        this.currentCategory = item.dataset.category;
        this.currentPage = 1;
        this.renderNotificationList();
      });
    });

    // Filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => this.handleFilterChange(e));
    });

    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }

    // Search
    const notificationSearch = document.getElementById('notificationSearch');
    if (notificationSearch) {
      notificationSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.renderNotificationList();
      });
    }

    // Mark all read
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', () => this.markAllRead());
    }

    // Delete selected
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener('click', () => this.deleteSelected());
    }

    // Sort dropdown
    const sortBtn = document.getElementById('sortBtn');
    const sortMenu = document.getElementById('sortMenu');
    if (sortBtn && sortMenu) {
      sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortMenu.classList.toggle('active');
      });

      document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', () => {
          this.currentSort = option.dataset.sort;
          document.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
          option.classList.add('active');
          sortMenu.classList.remove('active');
          const sortLabel = this.getSortLabel(this.currentSort);
          sortBtn.querySelector('span').textContent = sortLabel;
          this.renderNotificationList();
        });
      });

      document.addEventListener('click', () => {
        sortMenu.classList.remove('active');
      });
    }

    // Pagination
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => this.prevPage());
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => this.nextPage());

    // Settings nav
    document.querySelectorAll('.settings-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const section = item.dataset.settings;
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
        const targetSection = document.querySelector(`.settings-section[data-settings-section="${section}"]`);
        if (targetSection) targetSection.classList.add('active');
      });
    });

    // Settings toggles
    document.querySelectorAll('.settings-section input[type="checkbox"]').forEach(toggle => {
      toggle.addEventListener('change', (e) => this.handleSettingChange(e));
    });

    // Quiet hours toggle
    const settingQuiet = document.getElementById('settingQuiet');
    const quietHoursRow = document.getElementById('quietHoursRow');
    if (settingQuiet && quietHoursRow) {
      settingQuiet.addEventListener('change', (e) => {
        quietHoursRow.style.display = e.target.checked ? 'flex' : 'none';
        this.settings.quiet = e.target.checked;
        this.saveData();
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

    // Preferences modal
    const openPreferencesBtn = document.getElementById('openPreferencesBtn');
    const closePreferencesModal = document.getElementById('closePreferencesModal');
    const cancelPreferencesBtn = document.getElementById('cancelPreferencesBtn');
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');

    if (openPreferencesBtn) openPreferencesBtn.addEventListener('click', () => this.openModal('preferencesModal'));
    if (closePreferencesModal) closePreferencesModal.addEventListener('click', () => this.closeModal('preferencesModal'));
    if (cancelPreferencesBtn) cancelPreferencesBtn.addEventListener('click', () => this.closeModal('preferencesModal'));
    if (savePreferencesBtn) savePreferencesBtn.addEventListener('click', () => this.savePreferences());

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
      });
    });

    // View all activity
    const viewAllActivity = document.getElementById('viewAllActivity');
    if (viewAllActivity) {
      viewAllActivity.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchTab('history');
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
    // Position
    dropdown.style.top = `${rect.bottom + 8 + window.scrollY}px`;
    dropdown.style.left = `${Math.max(8, rect.left + window.scrollX - 200)}px`;

    // Bind events
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
      this.switchTab('center');
    });

    // Close on outside click
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

    document.querySelectorAll('.notification-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.querySelectorAll('.notification-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === tabName);
    });

    // Render specific panel content
    if (tabName === 'mentions') this.renderMentions();
    if (tabName === 'assignments') this.renderAssignments();
    if (tabName === 'system') this.renderSystem();
    if (tabName === 'email') this.renderEmail();
    if (tabName === 'history') this.renderHistory();
    if (tabName === 'settings') this.renderSettings();

    // Scroll to top
    const content = document.querySelector('.notification-content');
    if (content) content.scrollTop = 0;
  }

  // ============================================
  // Rendering
  // ============================================
  renderAll() {
    this.renderNotificationList();
    this.renderActivityTimeline();
    this.updateStats();
    this.updateBadges();
  }

  renderNotificationList() {
    const list = document.getElementById('notificationList');
    if (!list) return;

    let filtered = this.getFilteredNotifications();

    // Apply search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.sender.name.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    filtered = this.sortNotifications(filtered);

    // Pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
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
    if (paginationTotal) paginationTotal.textContent = totalItems.toLocaleString();
    if (prevPageBtn) prevPageBtn.disabled = this.currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = this.currentPage >= totalPages;

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
        if (e.target.closest('.notification-checkbox') || e.target.closest('.notification-action-btn')) return;
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
        this.updateBatchActions();
      });
    });

    list.querySelectorAll('.notification-action-btn.mark-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.closest('.notification-item').dataset.id;
        this.markAsRead(id);
      });
    });

    list.querySelectorAll('.notification-action-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.closest('.notification-item').dataset.id;
        this.confirmDeleteSingle(id);
      });
    });
  }

  renderNotificationItem(notif) {
    const isSelected = this.selectedItems.has(notif.id);
    const timeAgo = this.formatTimeAgo(notif.timestamp);
    const sourceIcon = this.getSourceIcon(notif.source);
    const priorityClass = notif.priority || 'low';

    return `
      <div class="notification-item ${!notif.read ? 'unread' : ''} ${isSelected ? 'selected' : ''}" data-id="${notif.id}">
        <input type="checkbox" class="notification-checkbox" ${isSelected ? 'checked' : ''}>
        <div class="notification-icon-wrapper ${notif.category}">
          <i class="ph ${this.getCategoryIcon(notif.category)}"></i>
        </div>
        <div class="notification-content-wrap">
          <div class="notification-header-row">
            <span class="notification-title">${this.escapeHtml(notif.title)}</span>
            <span class="notification-priority ${priorityClass}">${notif.priority}</span>
          </div>
          <div class="notification-body">${this.escapeHtml(notif.body)}</div>
          <div class="notification-meta">
            <span class="notification-source">
              <i class="ph ${sourceIcon}"></i>
              ${this.escapeHtml(notif.sourceName)}
            </span>
            <span class="notification-time">${timeAgo}</span>
          </div>
        </div>
        <div class="notification-actions">
          <button class="notification-action-btn mark-read" title="${notif.read ? 'Mark as unread' : 'Mark as read'}">
            <i class="ph ${notif.read ? 'ph-envelope' : 'ph-envelope-open'}"></i>
          </button>
          <button class="notification-action-btn delete" title="Delete">
            <i class="ph ph-trash"></i>
          </button>
        </div>
        ${!notif.read ? '<div class="notification-unread-dot"></div>' : ''}
      </div>
    `;
  }

  renderActivityTimeline() {
    const timeline = document.getElementById('activityTimeline');
    if (!timeline) return;

    timeline.innerHTML = this.activity.slice(0, 8).map(act => `
      <div class="activity-item">
        <div class="activity-dot ${act.type}">
          <i class="ph ${this.getCategoryIcon(act.type)}"></i>
        </div>
        <div class="activity-info">
          <div class="activity-text">${this.escapeHtml(act.text)}</div>
          <div class="activity-time">${this.formatTimeAgo(act.time)}</div>
        </div>
      </div>
    `).join('');
  }

  renderMentions() {
    const content = document.getElementById('mentionsContent');
    if (!content) return;
    const mentions = this.notifications.filter(n => n.category === 'mention');
    this.renderSimpleList(content, mentions, 'No mentions yet');
  }

  renderAssignments() {
    const content = document.getElementById('assignmentsContent');
    if (!content) return;
    const assignments = this.notifications.filter(n => n.category === 'assignment');
    this.renderSimpleList(content, assignments, 'No assignments yet');
  }

  renderSystem() {
    const content = document.getElementById('systemContent');
    if (!content) return;
    const system = this.notifications.filter(n => n.category === 'system');
    this.renderSimpleList(content, system, 'No system alerts');
  }

  renderEmail() {
    const content = document.getElementById('emailContent');
    if (!content) return;
    const email = this.notifications.filter(n => n.category === 'email');
    this.renderSimpleList(content, email, 'No email notifications');
  }

  renderHistory() {
    const content = document.getElementById('historyContent');
    if (!content) return;
    const sorted = [...this.notifications].sort((a, b) => b.timestamp - a.timestamp);
    this.renderSimpleList(content, sorted, 'No history available');
  }

  renderSimpleList(container, items, emptyMessage) {
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="ph ph-bell-slash"></i>
          <h3>${emptyMessage}</h3>
          <p>Check back later for updates</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(notif => this.renderNotificationItem(notif)).join('');
    
    container.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.notification-checkbox') || e.target.closest('.notification-action-btn')) return;
        this.openNotificationDetail(item.dataset.id);
      });
    });

    container.querySelectorAll('.notification-action-btn.mark-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.closest('.notification-item').dataset.id;
        this.markAsRead(id);
      });
    });

    container.querySelectorAll('.notification-action-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.closest('.notification-item').dataset.id;
        this.confirmDeleteSingle(id);
      });
    });
  }

  renderSettings() {
    // Sync settings UI with current state
    const settingMap = {
      'settingEnableAll': 'enableAll',
      'settingSound': 'sound',
      'settingDesktop': 'desktop',
      'settingAutoRead': 'autoRead',
      'settingChannelGmail': 'channelGmail',
      'settingChannelWhatsapp': 'channelWhatsapp',
      'settingChannelInstagram': 'channelInstagram',
      'settingChannelTiktok': 'channelTiktok',
      'settingChannelX': 'channelX',
      'settingChannelLinkedin': 'channelLinkedin',
      'settingPreview': 'preview',
      'settingGroup': 'group',
      'settingQuiet': 'quiet',
      'settingDailyDigest': 'dailyDigest',
      'settingWeeklyDigest': 'weeklyDigest',
      'settingPush': 'push',
      'settingVibrate': 'vibrate'
    };

    Object.entries(settingMap).forEach(([elementId, settingKey]) => {
      const el = document.getElementById(elementId);
      if (el) el.checked = !!this.settings[settingKey];
    });

    const quietHoursRow = document.getElementById('quietHoursRow');
    if (quietHoursRow) {
      quietHoursRow.style.display = this.settings.quiet ? 'flex' : 'none';
    }

    const quietStart = document.getElementById('quietStart');
    const quietEnd = document.getElementById('quietEnd');
    const digestTime = document.getElementById('digestTime');
    if (quietStart) quietStart.value = this.settings.quietStart || '22:00';
    if (quietEnd) quietEnd.value = this.settings.quietEnd || '07:00';
    if (digestTime) digestTime.value = this.settings.digestTime || '09:00';
  }

  // ============================================
  // Filtering & Sorting
  // ============================================
  getFilteredNotifications() {
    let filtered = [...this.notifications];

    // Category filter from sidebar
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(n => n.category === this.currentCategory);
    }

    // Status filter
    if (this.activeFilters.status.length > 0) {
      const showUnread = this.activeFilters.status.includes('unread');
      const showRead = this.activeFilters.status.includes('read');
      if (showUnread && !showRead) {
        filtered = filtered.filter(n => !n.read);
      } else if (!showUnread && showRead) {
        filtered = filtered.filter(n => n.read);
      }
    }

    // Priority filter
    if (this.activeFilters.priority.length > 0) {
      filtered = filtered.filter(n => this.activeFilters.priority.includes(n.priority));
    }

    // Category filter from checkboxes
    if (this.activeFilters.category.length > 0) {
      filtered = filtered.filter(n => this.activeFilters.category.includes(n.category));
    }

    return filtered;
  }

  sortNotifications(notifications) {
    const sorted = [...notifications];
    switch (this.currentSort) {
      case 'newest':
        return sorted.sort((a, b) => b.timestamp - a.timestamp);
      case 'oldest':
        return sorted.sort((a, b) => a.timestamp - b.timestamp);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      default:
        return sorted;
    }
  }

  handleFilterChange(e) {
    const checkbox = e.target;
    const filterType = checkbox.dataset.filter;
    const value = checkbox.value;

    if (checkbox.checked) {
      if (!this.activeFilters[filterType].includes(value)) {
        this.activeFilters[filterType].push(value);
      }
    } else {
      this.activeFilters[filterType] = this.activeFilters[filterType].filter(v => v !== value);
    }

    this.saveData();
    this.currentPage = 1;
    this.renderNotificationList();
  }

  clearFilters() {
    this.activeFilters = {
      status: [],
      priority: [],
      category: []
    };
    this.currentCategory = 'all';
    this.searchQuery = '';

    // Reset UI
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.category-list-item').forEach(item => item.classList.remove('active'));
    const allCategory = document.querySelector('.category-list-item[data-category="all"]');
    if (allCategory) allCategory.classList.add('active');

    const searchInput = document.getElementById('notificationSearch');
    if (searchInput) searchInput.value = '';

    this.saveData();
    this.renderNotificationList();
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
  }

  markAllRead() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    this.notifications.forEach(n => n.read = true);
    this.saveData();
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();
    this.showToast(`${unreadCount} notifications marked as read`, 'success');
  }

  deleteSelected() {
    if (this.selectedItems.size === 0) {
      this.showToast('No notifications selected', 'warning');
      return;
    }
    this.openModal('deleteConfirmModal');
  }

  confirmDelete() {
    const idsToDelete = Array.from(this.selectedItems);
    this.notifications = this.notifications.filter(n => !idsToDelete.includes(n.id));
    this.selectedItems.clear();
    this.saveData();
    this.closeModal('deleteConfirmModal');
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();
    this.showToast(`${idsToDelete.length} notifications deleted`, 'success');
  }

  confirmDeleteSingle(id) {
    this.currentModalNotification = id;
    this.openModal('deleteConfirmModal');
  }

  confirmDelete() {
    if (this.currentModalNotification) {
      this.notifications = this.notifications.filter(n => n.id !== this.currentModalNotification);
      this.currentModalNotification = null;
    } else {
      const idsToDelete = Array.from(this.selectedItems);
      this.notifications = this.notifications.filter(n => !idsToDelete.includes(n.id));
      this.selectedItems.clear();
    }
    this.saveData();
    this.closeModal('deleteConfirmModal');
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();
    this.showToast('Notification deleted', 'success');
  }

  // ============================================
  // Modal Actions
  // ============================================
  openNotificationDetail(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (!notif) return;

    this.currentModalNotification = id;

    // Auto-mark as read if setting enabled
    if (this.settings.autoRead && !notif.read) {
      notif.read = true;
      this.saveData();
      this.updateStats();
      this.updateBadges();
    }

    const modalBody = document.getElementById('notificationModalBody');
    if (!modalBody) return;

    const categoryColors = {
      message: { bg: '#dbeafe', color: '#2563eb' },
      mention: { bg: '#fce7f3', color: '#db2777' },
      assignment: { bg: '#d1fae5', color: '#059669' },
      system: { bg: '#fef3c7', color: '#d97706' },
      email: { bg: '#e0e7ff', color: '#4f46e5' }
    };

    const colors = categoryColors[notif.category] || categoryColors.message;

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
          <span class="detail-tag" style="background: ${colors.bg}; color: ${colors.color};">${notif.category}</span>
          <span class="detail-tag" style="background: ${notif.priority === 'high' ? 'var(--error-50)' : notif.priority === 'medium' ? 'var(--warning-50)' : 'var(--gray-100)'}; color: ${notif.priority === 'high' ? 'var(--error-600)' : notif.priority === 'medium' ? 'var(--warning-600)' : 'var(--gray-600)'};">${notif.priority} priority</span>
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
  // Settings
  // ============================================
  handleSettingChange(e) {
    const settingMap = {
      'settingEnableAll': 'enableAll',
      'settingSound': 'sound',
      'settingDesktop': 'desktop',
      'settingAutoRead': 'autoRead',
      'settingChannelGmail': 'channelGmail',
      'settingChannelWhatsapp': 'channelWhatsapp',
      'settingChannelInstagram': 'channelInstagram',
      'settingChannelTiktok': 'channelTiktok',
      'settingChannelX': 'channelX',
      'settingChannelLinkedin': 'channelLinkedin',
      'settingPreview': 'preview',
      'settingGroup': 'group',
      'settingQuiet': 'quiet',
      'settingDailyDigest': 'dailyDigest',
      'settingWeeklyDigest': 'weeklyDigest',
      'settingPush': 'push',
      'settingVibrate': 'vibrate'
    };

    const settingKey = settingMap[e.target.id];
    if (settingKey) {
      this.settings[settingKey] = e.target.checked;
      this.saveData();
    }

    // Handle time inputs
    if (e.target.id === 'quietStart') this.settings.quietStart = e.target.value;
    if (e.target.id === 'quietEnd') this.settings.quietEnd = e.target.value;
    if (e.target.id === 'digestTime') this.settings.digestTime = e.target.value;
    this.saveData();
  }

  savePreferences() {
    const checkboxes = document.querySelectorAll('#preferencesModal input[type="checkbox"]');
    checkboxes.forEach((cb, index) => {
      const keys = ['realtime', 'emailSummary', 'browserAlerts', 'mentionAlerts', 'assignmentAlerts', 'systemAlerts'];
      if (keys[index]) {
        this.preferences[keys[index]] = cb.checked;
      }
    });
    this.saveData();
    this.closeModal('preferencesModal');
    this.showToast('Preferences saved', 'success');
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
    const email = this.notifications.filter(n => n.category === 'email').length;

    const today = new Date().toDateString();
    const todayCount = this.notifications.filter(n => new Date(n.timestamp).toDateString() === today).length;

    this.updateElement('statTotal', total.toLocaleString());
    this.updateElement('statUnread', unread.toString());
    this.updateElement('statMentions', mentions.toString());
    this.updateElement('statAssignments', assignments.toString());
    this.updateElement('statSystem', system.toString());
    this.updateElement('statEmail', email.toLocaleString());

    this.updateElement('quickStatToday', todayCount.toString());
    this.updateElement('quickStatWeek', Math.floor(total * 0.07).toString());
    this.updateElement('quickStatMonth', Math.floor(total * 0.27).toString());

    // Update filter counts
    this.updateElement('filterCountUnread', unread.toString());
    this.updateElement('filterCountRead', this.notifications.filter(n => n.read).length.toString());
    this.updateElement('filterCountHigh', this.notifications.filter(n => n.priority === 'high').length.toString());
    this.updateElement('filterCountMedium', this.notifications.filter(n => n.priority === 'medium').length.toString());
    this.updateElement('filterCountLow', this.notifications.filter(n => n.priority === 'low').length.toString());
    this.updateElement('filterCountMessages', this.notifications.filter(n => n.category === 'message').length.toString());
    this.updateElement('filterCountMentions', mentions.toString());
    this.updateElement('filterCountAssignments', assignments.toString());
    this.updateElement('filterCountSystem', system.toString());
    this.updateElement('filterCountEmailCat', email.toString());

    // Header dot
    const headerDot = document.getElementById('headerNotificationDot');
    if (headerDot) {
      headerDot.style.display = unread > 0 ? 'block' : 'none';
    }
  }

  updateBadges() {
    const unread = this.notifications.filter(n => !n.read).length;
    const mentions = this.notifications.filter(n => n.category === 'mention' && !n.read).length;
    const assignments = this.notifications.filter(n => n.category === 'assignment' && !n.read).length;
    const system = this.notifications.filter(n => n.category === 'system' && !n.read).length;
    const email = this.notifications.filter(n => n.category === 'email' && !n.read).length;

    this.updateElement('tabBadgeCenter', unread > 0 ? unread.toString() : '');
    this.updateElement('tabBadgeMentions', mentions > 0 ? mentions.toString() : '');
    this.updateElement('tabBadgeAssignments', assignments > 0 ? assignments.toString() : '');
    this.updateElement('tabBadgeSystem', system > 0 ? system.toString() : '');
    this.updateElement('tabBadgeEmail', email > 0 ? email.toString() : '');
  }

  updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  updateBatchActions() {
    // Could implement batch action bar here
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
      email: 'ph-envelope'
    };
    return icons[category] || 'ph-bell';
  }

  getSourceIcon(source) {
    const icons = {
      gmail: 'ph-envelope-simple',
      whatsapp: 'ph-chat-circle-text',
      instagram: 'ph-camera',
      tiktok: 'ph-tiktok-logo',
      x: 'ph-x-logo',
      linkedin: 'ph-linkedin-logo',
      system: 'ph-gear',
      email: 'ph-envelope',
      tasks: 'ph-check-square',
      calendar: 'ph-calendar-blank',
      workflow: 'ph-git-branch',
      'unified-inbox': 'ph-tray'
    };
    return icons[source] || 'ph-bell';
  }

  getSortLabel(sort) {
    const labels = {
      newest: 'Newest first',
      oldest: 'Oldest first',
      priority: 'Priority'
    };
    return labels[sort] || 'Newest first';
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
      // Fallback toast
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
  // Public API & Real-time simulation
  // ============================================
  pushNotification(payload = {}) {
    const id = payload.id || `notif_${crypto.randomUUID?.() || Date.now()}`;
    const notif = Object.assign({
      id,
      title: payload.title || 'Notification',
      body: payload.body || '',
      priority: payload.priority || 'low',
      category: payload.category || 'system',
      source: payload.source || 'system',
      sourceName: payload.sourceName || 'System',
      timestamp: payload.timestamp || Date.now(),
      read: !!payload.read,
      sender: payload.sender || { name: payload.sourceName || 'System', avatar: 'OP', color: '#4f46e5' },
      actionUrl: payload.actionUrl || null,
      actionLabel: payload.actionLabel || 'Open'
    }, payload);

    // Insert at top
    this.notifications.unshift(notif);
    this.activity.unshift({ id: `act_${id}`, type: notif.category, text: notif.title, time: notif.timestamp });
    this.saveData();
    this.updateStats();
    this.updateBadges();
    this.renderNotificationList();

    // Show toast if enabled
    if (this.settings.sound) this._playSound();
    this.showToast(notif.title, notif.priority === 'high' ? 'error' : 'success');

    // Browser notification (prepare only)
    try {
      if (this.preferences.browserAlerts && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notif.title, { body: notif.body, tag: notif.id });
      }
    } catch (e) { /* ignore */ }

    return notif;
  }

  removeNotification(id) {
    const before = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.id !== id);
    const after = this.notifications.length;
    this.saveData();
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();
    return before - after;
  }

  clearAllNotifications() {
    const count = this.notifications.length;
    this.notifications = [];
    this.saveData();
    this.renderNotificationList();
    this.updateStats();
    this.updateBadges();
    this.showToast('All notifications cleared', 'success');
    return count;
  }

  getNotifications() {
    return [...this.notifications];
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  simulateRealtime(interval = 15000) {
    if (this._realtimeInterval) return;
    this._realtimeInterval = setInterval(() => {
      const sample = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];
      const clone = JSON.parse(JSON.stringify(sample));
      clone.id = `sim_${Date.now()}`;
      clone.timestamp = Date.now();
      clone.read = false;
      this.pushNotification(clone);
    }, interval);
    this.showToast('Realtime notification simulation started', 'success');
  }

  stopRealtime() {
    if (this._realtimeInterval) {
      clearInterval(this._realtimeInterval);
      this._realtimeInterval = null;
      this.showToast('Realtime simulation stopped', 'warning');
    }
  }

  updatePreferences(prefs = {}) {
    this.preferences = Object.assign({}, this.preferences, prefs);
    // mirror some preferences into settings for convenience
    if (prefs.browserAlerts !== undefined) this.settings.desktop = !!prefs.browserAlerts;
    if (prefs.sound !== undefined) this.settings.sound = !!prefs.sound;
    this.saveData();
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
  // Backwards compat
  window.notificationsModule = nm;
  // Ensure global OP namespace exists
  if (!window.OP) window.OP = {};
  window.OP.notifications = nm;
});