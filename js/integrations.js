/**
 * OnePlace Enterprise v3.0 — Integrations Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const INTEGRATION_KEYS = {
  INTEGRATIONS: 'op_integrations',
  API_KEYS: 'op_api_keys',
  WEBHOOKS: 'op_webhooks',
  OAUTH_APPS: 'op_oauth_apps',
  INTEGRATION_LOGS: 'op_integration_logs',
  SYNC_HISTORY: 'op_sync_history',
  INTEGRATION_SETTINGS: 'op_integration_settings'
};

// ============================================
// Integration Data
// ============================================
const INTEGRATION_DATA = {
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    icon: 'ph-envelope-simple',
    color: '#EA4335',
    bgColor: '#FDECEA',
    category: 'communication',
    description: 'Connect your Gmail account to sync emails and manage conversations.',
    email: 'google@gmail.com',
    permissions: ['Read emails', 'Send emails', 'Manage labels'],
    rating: 4.8,
    users: '12,240'
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: 'ph-whatsapp-logo',
    color: '#25D366',
    bgColor: '#E8F5E9',
    category: 'communication',
    description: 'Connect WhatsApp Business to manage messages and customer conversations.',
    email: '+1 (555) 123-4567',
    permissions: ['Read messages', 'Send messages', 'Manage templates'],
    rating: 4.7,
    users: '8,360'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: 'ph-instagram-logo',
    color: '#E4405F',
    bgColor: '#FCE4EC',
    category: 'social',
    description: 'Connect Instagram to manage DMs, comments, and mentions.',
    email: '@oneplace.enterprise',
    permissions: ['Read DMs', 'Read comments', 'Post content'],
    rating: 4.5,
    users: '6,580'
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'ph-tiktok-logo',
    color: '#000000',
    bgColor: '#F5F5F5',
    category: 'social',
    description: 'Connect TikTok to manage comments, mentions, and messages.',
    email: '@oneplace.enterprise',
    permissions: ['Read comments', 'Read mentions', 'Post videos'],
    rating: 4.3,
    users: '3,240'
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    icon: 'ph-x-logo',
    color: '#1DA1F2',
    bgColor: '#E3F2FD',
    category: 'social',
    description: 'Connect X to manage mentions, DMs, and tweets.',
    email: '@oneplace',
    permissions: ['Read tweets', 'Read DMs', 'Post tweets'],
    rating: 4.6,
    users: '5,420'
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'ph-linkedin-logo',
    color: '#0A66C2',
    bgColor: '#E3F2FD',
    category: 'social',
    description: 'Connect LinkedIn to manage messages and company page interactions.',
    email: 'oneplace@company.com',
    permissions: ['Read messages', 'Read company updates', 'Post updates'],
    rating: 4.4,
    users: '4,120'
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    icon: 'ph-slack-logo',
    color: '#4A154B',
    bgColor: '#F3E5F5',
    category: 'communication',
    description: 'Connect Slack to sync messages and manage team communications.',
    email: 'oneplace.slack.com',
    permissions: ['Read messages', 'Send messages', 'Manage channels'],
    rating: 4.7,
    users: '9,850'
  },
  google_calendar: {
    id: 'google_calendar',
    name: 'Google Calendar',
    icon: 'ph-calendar',
    color: '#4285F4',
    bgColor: '#E8EAF6',
    category: 'productivity',
    description: 'Sync your Google Calendar events and manage schedules.',
    email: 'calendar@gmail.com',
    permissions: ['Read events', 'Create events', 'Manage calendars'],
    rating: 4.6,
    users: '7,230'
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    icon: 'ph-users',
    color: '#FF7A59',
    bgColor: '#FFF3E0',
    category: 'crm',
    description: 'Connect HubSpot CRM to sync contacts, deals, and activities.',
    email: 'hubspot@oneplace.com',
    permissions: ['Read contacts', 'Read deals', 'Manage pipelines'],
    rating: 4.5,
    users: '3,680'
  },
  mailchimp: {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: 'ph-envelope',
    color: '#FFE01B',
    bgColor: '#FFFDE7',
    category: 'marketing',
    description: 'Connect Mailchimp to sync email campaigns and subscriber lists.',
    email: 'mailchimp@oneplace.com',
    permissions: ['Read campaigns', 'Manage lists', 'Send emails'],
    rating: 4.3,
    users: '2,940'
  },
  zapier: {
    id: 'zapier',
    name: 'Zapier',
    icon: 'ph-lightning',
    color: '#FF4A00',
    bgColor: '#FFF3E0',
    category: 'productivity',
    description: 'Connect Zapier to automate workflows between apps.',
    email: 'zapier@oneplace.com',
    permissions: ['Read triggers', 'Create zaps', 'Manage workflows'],
    rating: 4.4,
    users: '5,120'
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    icon: 'ph-notepad',
    color: '#000000',
    bgColor: '#F5F5F5',
    category: 'productivity',
    description: 'Connect Notion to sync pages, databases, and collaborate.',
    email: 'notion@oneplace.com',
    permissions: ['Read pages', 'Write pages', 'Manage databases'],
    rating: 4.6,
    users: '4,560'
  },
  airtable: {
    id: 'airtable',
    name: 'Airtable',
    icon: 'ph-table',
    color: '#18BFFF',
    bgColor: '#E1F5FE',
    category: 'productivity',
    description: 'Connect Airtable to sync bases, tables, and records.',
    email: 'airtable@oneplace.com',
    permissions: ['Read records', 'Create records', 'Manage bases'],
    rating: 4.5,
    users: '3,210'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: 'ph-facebook-logo',
    color: '#1877F2',
    bgColor: '#E3F2FD',
    category: 'social',
    description: 'Connect Facebook to manage page messages and comments.',
    email: 'facebook@oneplace.com',
    permissions: ['Read messages', 'Read comments', 'Post updates'],
    rating: 4.2,
    users: '6,780'
  },
  google_drive: {
    id: 'google_drive',
    name: 'Google Drive',
    icon: 'ph-hard-drives',
    color: '#4285F4',
    bgColor: '#E8EAF6',
    category: 'file-storage',
    description: 'Connect Google Drive to sync and manage files.',
    email: 'drive@gmail.com',
    permissions: ['Read files', 'Upload files', 'Manage folders'],
    rating: 4.7,
    users: '10,240'
  },
  dropbox: {
    id: 'dropbox',
    name: 'Dropbox',
    icon: 'ph-dropbox-logo',
    color: '#0061FF',
    bgColor: '#E3F2FD',
    category: 'file-storage',
    description: 'Connect Dropbox to sync and share files.',
    email: 'dropbox@oneplace.com',
    permissions: ['Read files', 'Upload files', 'Manage folders'],
    rating: 4.4,
    users: '4,890'
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    icon: 'ph-credit-card',
    color: '#635BFF',
    bgColor: '#EDE7F6',
    category: 'other',
    description: 'Connect Stripe to manage payments and invoices.',
    email: 'stripe@oneplace.com',
    permissions: ['Read payments', 'Manage invoices', 'Read customers'],
    rating: 4.8,
    users: '2,340'
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: 'ph-github-logo',
    color: '#181717',
    bgColor: '#F5F5F5',
    category: 'developer',
    description: 'Connect GitHub to manage repositories and issues.',
    email: 'github@oneplace.com',
    permissions: ['Read repos', 'Read issues', 'Manage webhooks'],
    rating: 4.7,
    users: '3,560'
  },
  jira: {
    id: 'jira',
    name: 'Jira',
    icon: 'ph-kanban',
    color: '#0052CC',
    bgColor: '#E3F2FD',
    category: 'developer',
    description: 'Connect Jira to sync issues, projects, and sprints.',
    email: 'jira@oneplace.com',
    permissions: ['Read issues', 'Create issues', 'Manage projects'],
    rating: 4.3,
    users: '2,890'
  },
  asana: {
    id: 'asana',
    name: 'Asana',
    icon: 'ph-check-square',
    color: '#F06A6A',
    bgColor: '#FFEBEE',
    category: 'productivity',
    description: 'Connect Asana to sync tasks, projects, and teams.',
    email: 'asana@oneplace.com',
    permissions: ['Read tasks', 'Create tasks', 'Manage projects'],
    rating: 4.4,
    users: '3,120'
  }
};

// ============================================
// Integration Manager
// ============================================
class IntegrationManager {
  constructor() {
    this.toast = new ToastManager();
    this.init();
  }

  init() {
    this.seedData();
    this.setupEventListeners();
    this.renderAll();
  }

  // --- Data Management ---
  getIntegrations() {
    try {
      return JSON.parse(localStorage.getItem(INTEGRATION_KEYS.INTEGRATIONS)) || {};
    } catch {
      return {};
    }
  }

  saveIntegrations(data) {
    localStorage.setItem(INTEGRATION_KEYS.INTEGRATIONS, JSON.stringify(data));
  }

  getApiKeys() {
    try {
      return JSON.parse(localStorage.getItem(INTEGRATION_KEYS.API_KEYS)) || [];
    } catch {
      return [];
    }
  }

  saveApiKeys(keys) {
    localStorage.setItem(INTEGRATION_KEYS.API_KEYS, JSON.stringify(keys));
  }

  getWebhooks() {
    try {
      return JSON.parse(localStorage.getItem(INTEGRATION_KEYS.WEBHOOKS)) || [];
    } catch {
      return [];
    }
  }

  saveWebhooks(webhooks) {
    localStorage.setItem(INTEGRATION_KEYS.WEBHOOKS, JSON.stringify(webhooks));
  }

  getOAuthApps() {
    try {
      return JSON.parse(localStorage.getItem(INTEGRATION_KEYS.OAUTH_APPS)) || [];
    } catch {
      return [];
    }
  }

  saveOAuthApps(apps) {
    localStorage.setItem(INTEGRATION_KEYS.OAUTH_APPS, JSON.stringify(apps));
  }

  getLogs() {
    try {
      return JSON.parse(localStorage.getItem(INTEGRATION_KEYS.INTEGRATION_LOGS)) || [];
    } catch {
      return [];
    }
  }

  saveLogs(logs) {
    localStorage.setItem(INTEGRATION_KEYS.INTEGRATION_LOGS, JSON.stringify(logs));
  }

  addLog(log) {
    const logs = this.getLogs();
    logs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    });
    this.saveLogs(logs.slice(0, 500));
  }

  // --- Seed Data ---
  seedData() {
    if (!localStorage.getItem(INTEGRATION_KEYS.INTEGRATIONS)) {
      const defaultIntegrations = {
        gmail: {
          connected: true,
          status: 'healthy',
          lastSync: new Date(Date.now() - 2 * 60000).toISOString(),
          autoSync: true,
          syncCount: 1245,
          dataSync: '+18%'
        },
        whatsapp: {
          connected: true,
          status: 'healthy',
          lastSync: new Date(Date.now() - 5 * 60000).toISOString(),
          autoSync: true,
          syncCount: 892,
          dataSync: '+12%'
        },
        instagram: {
          connected: true,
          status: 'healthy',
          lastSync: new Date(Date.now() - 10 * 60000).toISOString(),
          autoSync: true,
          syncCount: 156,
          dataSync: '+10%'
        },
        tiktok: {
          connected: true,
          status: 'healthy',
          lastSync: new Date(Date.now() - 15 * 60000).toISOString(),
          autoSync: true,
          syncCount: 432,
          dataSync: '+15%'
        },
        x: {
          connected: true,
          status: 'healthy',
          lastSync: new Date(Date.now() - 8 * 60000).toISOString(),
          autoSync: true,
          syncCount: 1023,
          dataSync: '+7%'
        },
        linkedin: {
          connected: true,
          status: 'healthy',
          lastSync: new Date(Date.now() - 25 * 60000).toISOString(),
          autoSync: true,
          syncCount: 664,
          dataSync: '+11%'
        },
        slack: {
          connected: true,
          status: 'attention',
          lastSync: new Date(Date.now() - 60 * 60000).toISOString(),
          autoSync: true,
          syncCount: 32,
          dataSync: '-4%'
        },
        google_calendar: {
          connected: true,
          status: 'healthy',
          lastSync: new Date(Date.now() - 3 * 60000).toISOString(),
          autoSync: true,
          syncCount: 120,
          dataSync: '+9%'
        },
        hubspot: {
          connected: true,
          status: 'error',
          lastSync: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
          autoSync: false,
          syncCount: 0,
          dataSync: '0%'
        },
        mailchimp: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        zapier: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        notion: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        airtable: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        facebook: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        google_drive: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        dropbox: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        stripe: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        github: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        jira: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        },
        asana: {
          connected: false,
          status: 'disconnected',
          lastSync: null,
          autoSync: false,
          syncCount: 0,
          dataSync: '-'
        }
      };
      this.saveIntegrations(defaultIntegrations);
    }

    if (!localStorage.getItem(INTEGRATION_KEYS.API_KEYS)) {
      const defaultApiKeys = [
        {
          id: 'key_prod_001',
          name: 'Production API Key',
          key: 'op_live_xxxxxxxxxxxxxxxxxxxxxxxx',
          environment: 'production',
          permissions: ['read', 'write'],
          status: 'active',
          createdAt: '2025-05-20T10:30:00Z',
          lastUsed: '2 hours ago'
        },
        {
          id: 'key_dev_001',
          name: 'Development API Key',
          key: 'op_dev_xxxxxxxxxxxxxxxxxxxxxxxx',
          environment: 'development',
          permissions: ['read', 'write', 'delete'],
          status: 'active',
          createdAt: '2025-05-18T14:15:00Z',
          lastUsed: '1 day ago'
        },
        {
          id: 'key_test_001',
          name: 'Test Environment Key',
          key: 'op_test_xxxxxxxxxxxxxxxxxxxxxxxx',
          environment: 'testing',
          permissions: ['read'],
          status: 'inactive',
          createdAt: '2025-05-15T09:00:00Z',
          lastUsed: '1 week ago'
        }
      ];
      this.saveApiKeys(defaultApiKeys);
    }

    if (!localStorage.getItem(INTEGRATION_KEYS.WEBHOOKS)) {
      const defaultWebhooks = [
        {
          id: 'wh_user_001',
          name: 'User Events',
          url: 'https://api.oneplace.com/webhooks/users',
          event: 'user.created',
          status: 'active',
          secret: 'whsec_xxxxxxxxxxxxxxxx'
        },
        {
          id: 'wh_msg_001',
          name: 'Message Events',
          url: 'https://api.oneplace.com/webhooks/messages',
          event: 'message.received',
          status: 'active',
          secret: 'whsec_xxxxxxxxxxxxxxxx'
        },
        {
          id: 'wh_int_001',
          name: 'Integration Events',
          url: 'https://api.oneplace.com/webhooks/integrations',
          event: 'integration.connected',
          status: 'active',
          secret: 'whsec_xxxxxxxxxxxxxxxx'
        }
      ];
      this.saveWebhooks(defaultWebhooks);
    }

    if (!localStorage.getItem(INTEGRATION_KEYS.OAUTH_APPS)) {
      const defaultOAuthApps = [
        {
          id: 'oauth_google',
          name: 'Google',
          icon: 'ph-google-logo',
          color: '#EA4335',
          connected: true,
          scopes: ['email', 'profile', 'calendar']
        },
        {
          id: 'oauth_microsoft',
          name: 'Microsoft',
          icon: 'ph-microsoft-logo',
          color: '#00A4EF',
          connected: true,
          scopes: ['email', 'profile', 'onedrive']
        },
        {
          id: 'oauth_github',
          name: 'GitHub',
          icon: 'ph-github-logo',
          color: '#181717',
          connected: false,
          scopes: []
        }
      ];
      this.saveOAuthApps(defaultOAuthApps);
    }

    if (!localStorage.getItem(INTEGRATION_KEYS.INTEGRATION_LOGS)) {
      this.seedLogs();
    }
  }

  seedLogs() {
    const integrations = ['gmail', 'whatsapp', 'instagram', 'tiktok', 'x', 'linkedin', 'slack', 'google_calendar', 'hubspot'];
    const events = [
      { name: 'Email Sync', detail: 'emails synced' },
      { name: 'Messages Sync', detail: 'messages synced' },
      { name: 'Comments Sync', detail: 'comments synced' },
      { name: 'Mentions Sync', detail: 'mentions synced' },
      { name: 'Connections Sync', detail: 'connections synced' },
      { name: 'Events Sync', detail: 'events synced' },
      { name: 'Contacts Sync', detail: 'contacts synced' }
    ];
    const statuses = ['success', 'success', 'success', 'success', 'success', 'failed', 'pending'];

    const logs = [];
    for (let i = 0; i < 50; i++) {
      const integration = integrations[Math.floor(Math.random() * integrations.length)];
      const event = events[Math.floor(Math.random() * events.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const count = Math.floor(Math.random() * 1000) + 50;
      const duration = (Math.random() * 30 + 0.5).toFixed(1);

      const hoursAgo = Math.floor(Math.random() * 168);
      const timestamp = new Date(Date.now() - hoursAgo * 3600000);

      logs.push({
        id: `log_${i}`,
        integration,
        event: event.name,
        status,
        details: `${count} ${event.detail} were ${status === 'success' ? 'successfully' : status} ${status === 'failed' ? 'due to connection timeout' : ''}`,
        duration: `${duration}s`,
        timestamp: timestamp.toISOString(),
        requestId: `req_${Math.random().toString(36).substr(2, 10)}`
      });
    }

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    this.saveLogs(logs);
  }

  // --- Event Listeners ---
  setupEventListeners() {
    // Subnav tabs
    document.querySelectorAll('.int-subnav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.switchTab(tabId);
      });
    });

    // Card links that trigger tab switch
    document.querySelectorAll('[data-tab-trigger]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = e.currentTarget.dataset.tabTrigger;
        this.switchTab(tabId);
      });
    });

    // Marketplace categories
    document.querySelectorAll('.int-marketplace-cat').forEach(cat => {
      cat.addEventListener('click', (e) => {
        document.querySelectorAll('.int-marketplace-cat').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.filterMarketplace(e.currentTarget.dataset.category);
      });
    });

    // API tabs
    document.querySelectorAll('.int-api-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const panelId = e.currentTarget.dataset.apiTab;
        this.switchApiTab(panelId);
      });
    });

    // Search
    const connectedSearch = document.getElementById('connectedSearch');
    if (connectedSearch) {
      connectedSearch.addEventListener('input', (e) => {
        this.filterConnected(e.target.value);
      });
    }

    const marketplaceSearch = document.getElementById('marketplaceSearch');
    if (marketplaceSearch) {
      marketplaceSearch.addEventListener('input', (e) => {
        this.filterMarketplaceSearch(e.target.value);
      });
    }

    const logsSearch = document.getElementById('logsSearch');
    if (logsSearch) {
      logsSearch.addEventListener('input', (e) => {
        this.filterLogs(e.target.value);
      });
    }

    // Modals
    document.getElementById('closeConnectModal')?.addEventListener('click', () => this.closeModal('connectModal'));
    document.getElementById('connectModalCancel')?.addEventListener('click', () => this.closeModal('connectModal'));
    document.getElementById('connectModalAction')?.addEventListener('click', () => this.confirmConnect());

    document.getElementById('closeDisconnectModal')?.addEventListener('click', () => this.closeModal('disconnectModal'));
    document.getElementById('disconnectModalCancel')?.addEventListener('click', () => this.closeModal('disconnectModal'));
    document.getElementById('disconnectModalConfirm')?.addEventListener('click', () => this.confirmDisconnect());

    document.getElementById('closeSyncModal')?.addEventListener('click', () => this.closeModal('syncModal'));
    document.getElementById('syncModalCancel')?.addEventListener('click', () => this.closeModal('syncModal'));
    document.getElementById('syncModalConfirm')?.addEventListener('click', () => this.confirmSync());

    // API Key form
    document.getElementById('createApiKeyBtn')?.addEventListener('click', () => this.showApiKeyForm());
    document.getElementById('cancelApiKeyBtn')?.addEventListener('click', () => this.hideApiKeyForm());
    document.getElementById('saveApiKeyBtn')?.addEventListener('click', () => this.createApiKey());

    // Webhook form
    document.getElementById('addWebhookBtn')?.addEventListener('click', () => this.showWebhookForm());
    document.getElementById('cancelWebhookBtn')?.addEventListener('click', () => this.hideWebhookForm());
    document.getElementById('saveWebhookBtn')?.addEventListener('click', () => this.createWebhook());

    // Log details
    document.getElementById('closeLogDetails')?.addEventListener('click', () => this.closeLogDetails());
    document.getElementById('retryLogBtn')?.addEventListener('click', () => this.retryLog());

    // Mobile menu
    document.getElementById('menuToggle')?.addEventListener('click', () => this.toggleSidebar());

    // Theme toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
      OP.theme.toggle();
      this.updateThemeIcon();
    });

    // Logs filters
    document.getElementById('logsStatusFilter')?.addEventListener('change', () => this.applyLogFilters());
    document.getElementById('logsIntegrationFilter')?.addEventListener('change', () => this.applyLogFilters());

    // Quick connect buttons
    document.querySelectorAll('.int-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const integration = e.currentTarget.dataset.integration;
        if (integration === 'more') {
          this.switchTab('marketplace');
        } else {
          this.openConnectModal(integration);
        }
      });
    });
  }

  // --- Rendering ---
  renderAll() {
    this.renderDashboardStats();
    this.renderDashboardConnectedApps();
    this.renderRecentActivity();
    this.renderConnectedTable();
    this.renderMarketplace();
    this.renderApiKeys();
    this.renderWebhooks();
    this.renderOAuthApps();
    this.renderLogs();
    this.renderLogFilters();
    this.updateThemeIcon();
  }

  renderDashboardStats() {
    const integrations = this.getIntegrations();
    const connected = Object.values(integrations).filter(i => i.connected).length;
    const active = Object.values(integrations).filter(i => i.connected && i.status === 'healthy').length;
    const failed = Object.values(integrations).filter(i => i.connected && i.status === 'error').length;
    const totalSyncs = Object.values(integrations).reduce((sum, i) => sum + (i.syncCount || 0), 0);

    const statConnected = document.getElementById('statConnectedApps');
    const statActive = document.getElementById('statActiveIntegrations');
    const statSyncs = document.getElementById('statSuccessfulSyncs');
    const statFailed = document.getElementById('statFailedSyncs');

    if (statConnected) statConnected.textContent = connected;
    if (statActive) statActive.textContent = active;
    if (statSyncs) statSyncs.textContent = totalSyncs.toLocaleString();
    if (statFailed) statFailed.textContent = failed;
  }

  renderDashboardConnectedApps() {
    const container = document.getElementById('dashboardConnectedApps');
    if (!container) return;

    const integrations = this.getIntegrations();
    const connected = Object.entries(integrations)
      .filter(([, data]) => data.connected)
      .slice(0, 6);

    container.innerHTML = connected.map(([id, data]) => {
      const info = INTEGRATION_DATA[id];
      if (!info) return '';
      return `
        <div class="int-connected-app" data-integration="${id}">
          <div class="int-connected-app-icon" style="background: ${info.bgColor}; color: ${info.color};">
            <i class="ph ${info.icon}"></i>
          </div>
          <span class="int-connected-app-name">${info.name}</span>
          <span class="int-connected-app-status ${data.status === 'healthy' ? 'connected' : 'disconnected'}">
            ${data.status === 'healthy' ? 'Connected' : data.status}
          </span>
          <span class="int-connected-app-manage">Manage</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.int-connected-app').forEach(app => {
      app.addEventListener('click', () => {
        this.switchTab('connected');
      });
    });
  }

  renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;

    const logs = this.getLogs().slice(0, 5);
    const activities = logs.map(log => {
      const info = INTEGRATION_DATA[log.integration];
      const time = this.formatTime(log.timestamp);
      return `
        <div class="int-activity-item">
          <div class="int-activity-icon" style="background: ${info?.bgColor || 'var(--gray-100)'}; color: ${info?.color || 'var(--gray-600)'};">
            <i class="ph ${info?.icon || 'ph-plug'}"></i>
          </div>
          <div class="int-activity-content">
            <span class="int-activity-title">${log.event} — ${info?.name || log.integration}</span>
            <span class="int-activity-desc">${log.details}</span>
          </div>
          <span class="int-activity-time">${time}</span>
        </div>
      `;
    });

    container.innerHTML = activities.join('');
  }

  renderConnectedTable() {
    const tbody = document.getElementById('connectedTableBody');
    if (!tbody) return;

    const integrations = this.getIntegrations();
    const entries = Object.entries(integrations);

    tbody.innerHTML = entries.map(([id, data]) => {
      const info = INTEGRATION_DATA[id];
      if (!info) return '';

      const statusClass = data.status === 'healthy' ? 'success' : data.status === 'attention' ? 'warning' : data.status === 'error' ? 'error' : 'pending';
      const statusText = data.status === 'healthy' ? 'Healthy' : data.status === 'attention' ? 'Attention' : data.status === 'error' ? 'Error' : 'Disconnected';
      const lastSync = data.lastSync ? this.formatTime(data.lastSync) : 'Never';
      const trendClass = data.dataSync?.startsWith('+') ? 'up' : data.dataSync?.startsWith('-') ? 'down' : '';
      const trendIcon = data.dataSync?.startsWith('+') ? 'ph-trend-up' : data.dataSync?.startsWith('-') ? 'ph-trend-down' : 'ph-minus';

      return `
        <tr data-integration="${id}">
          <td>
            <div class="int-table-integration">
              <div class="int-table-integration-icon" style="background: ${info.bgColor}; color: ${info.color};">
                <i class="ph ${info.icon}"></i>
              </div>
              <div class="int-table-integration-info">
                <span class="int-table-integration-name">${info.name}</span>
                <span class="int-table-integration-email">${info.email}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="int-status-badge int-status-${statusClass}">${statusText}</span>
          </td>
          <td>${lastSync}</td>
          <td>
            <div class="int-sync-info">
              <span class="int-sync-trend ${trendClass}">
                <i class="ph ${trendIcon}"></i> ${data.dataSync}
              </span>
            </div>
          </td>
          <td>
            <div class="int-table-actions">
              ${data.connected ? `
                <button class="int-table-action-btn" onclick="integrationManager.syncIntegration('${id}')">
                  <i class="ph ph-arrows-clockwise"></i> Sync Now
                </button>
                <button class="int-table-action-btn danger" onclick="integrationManager.openDisconnectModal('${id}')">
                  <i class="ph ph-plugs"></i> Disconnect
                </button>
              ` : `
                <button class="int-table-action-btn primary" onclick="integrationManager.openConnectModal('${id}')">
                  <i class="ph ph-plug"></i> Connect
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderMarketplace() {
    this.renderMarketplaceSection('popularIntegrations', this.getPopularIntegrations());
    this.renderMarketplaceSection('recentlyConnected', this.getRecentlyConnected());
    this.renderMarketplaceSection('newIntegrations', this.getNewIntegrations());
  }

  renderMarketplaceSection(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(([id, data]) => {
      const info = INTEGRATION_DATA[id];
      if (!info) return '';

      const isConnected = data.connected;
      const btnClass = isConnected ? 'connected' : 'connect';
      const btnText = isConnected ? 'Connected' : 'Connect';

      return `
        <div class="int-marketplace-item" data-integration="${id}" data-category="${info.category}">
          <div class="int-marketplace-item-header">
            <div class="int-marketplace-item-icon" style="background: ${info.bgColor}; color: ${info.color};">
              <i class="ph ${info.icon}"></i>
            </div>
            <div class="int-marketplace-item-rating">
              <i class="ph ph-star"></i> ${info.rating} <span>(${info.users})</span>
            </div>
          </div>
          <div class="int-marketplace-item-info">
            <h4>${info.name}</h4>
            <p>${info.description}</p>
          </div>
          <div class="int-marketplace-item-footer">
            <span class="int-marketplace-item-users">${info.users} users</span>
            <button class="int-marketplace-item-btn ${btnClass}" onclick="integrationManager.${isConnected ? 'openDisconnectModal' : 'openConnectModal'}('${id}')">
              ${isConnected ? '<i class="ph ph-check"></i> ' : ''}${btnText}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  getPopularIntegrations() {
    const integrations = this.getIntegrations();
    const popularIds = ['gmail', 'whatsapp', 'instagram', 'slack', 'google_drive', 'facebook'];
    return popularIds.map(id => [id, integrations[id] || { connected: false }]);
  }

  getRecentlyConnected() {
    const integrations = this.getIntegrations();
    return Object.entries(integrations)
      .filter(([, data]) => data.connected && data.lastSync)
      .sort((a, b) => new Date(b[1].lastSync) - new Date(a[1].lastSync))
      .slice(0, 3);
  }

  getNewIntegrations() {
    const integrations = this.getIntegrations();
    const newIds = ['notion', 'airtable', 'stripe', 'github', 'jira', 'asana'];
    return newIds.map(id => [id, integrations[id] || { connected: false }]);
  }

  renderApiKeys() {
    const container = document.getElementById('apiKeysList');
    if (!container) return;

    const keys = this.getApiKeys();

    container.innerHTML = keys.map(key => {
      const envColors = {
        production: '#ef4444',
        development: '#6366f1',
        testing: '#f59e0b'
      };

      return `
        <div class="int-api-key-item">
          <div class="int-api-key-icon">
            <i class="ph ph-key"></i>
          </div>
          <div class="int-api-key-info">
            <div class="int-api-key-name">${key.name}</div>
            <div class="int-api-key-meta">
              <span style="color: ${envColors[key.environment] || 'var(--gray-500)'};">
                <i class="ph ph-circle" style="font-size: 8px;"></i> ${key.environment}
              </span>
              <span><i class="ph ph-clock"></i> ${key.lastUsed}</span>
              <span class="int-api-key-badge ${key.status}">${key.status}</span>
            </div>
            <div class="int-api-key-value">
              <code>${key.key}</code>
              <button class="int-api-key-copy" onclick="integrationManager.copyToClipboard('${key.key}')">
                <i class="ph ph-copy"></i>
              </button>
            </div>
          </div>
          <div class="int-api-key-actions">
            <button class="int-table-action-btn" onclick="integrationManager.toggleApiKey('${key.id}')">
              <i class="ph ph-${key.status === 'active' ? 'pause' : 'play'}"></i>
            </button>
            <button class="int-table-action-btn danger" onclick="integrationManager.deleteApiKey('${key.id}')">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderWebhooks() {
    const container = document.getElementById('webhooksList');
    if (!container) return;

    const webhooks = this.getWebhooks();

    container.innerHTML = webhooks.map(wh => `
      <div class="int-webhook-item">
        <div class="int-webhook-icon">
          <i class="ph ph-webhooks-logo"></i>
        </div>
        <div class="int-webhook-info">
          <div class="int-webhook-name">${wh.name}</div>
          <div class="int-webhook-url">${wh.url}</div>
          <div class="int-webhook-meta">
            <span class="int-status-badge int-status-${wh.status === 'active' ? 'success' : 'warning'}">${wh.status}</span>
            <span><i class="ph ph-lightning"></i> ${wh.event}</span>
          </div>
        </div>
        <div class="int-api-key-actions">
          <button class="int-table-action-btn" onclick="integrationManager.toggleWebhook('${wh.id}')">
            <i class="ph ph-${wh.status === 'active' ? 'pause' : 'play'}"></i>
          </button>
          <button class="int-table-action-btn danger" onclick="integrationManager.deleteWebhook('${wh.id}')">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  renderOAuthApps() {
    const container = document.getElementById('oauthAppsList');
    if (!container) return;

    const apps = this.getOAuthApps();

    container.innerHTML = apps.map(app => `
      <div class="int-oauth-app-item">
        <div class="int-oauth-app-icon" style="background: ${app.color}20; color: ${app.color};">
          <i class="ph ${app.icon}"></i>
        </div>
        <div class="int-oauth-app-info">
          <div class="int-oauth-app-name">${app.name}</div>
          <div class="int-oauth-app-desc">
            ${app.connected ? `Connected • ${app.scopes.join(', ')}` : 'Not connected'}
          </div>
        </div>
        <div class="int-api-key-actions">
          ${app.connected ? `
            <button class="int-table-action-btn danger" onclick="integrationManager.disconnectOAuth('${app.id}')">
              <i class="ph ph-plugs"></i> Disconnect
            </button>
          ` : `
            <button class="int-table-action-btn primary" onclick="integrationManager.connectOAuth('${app.id}')">
              <i class="ph ph-plug"></i> Connect
            </button>
          `}
        </div>
      </div>
    `).join('');
  }

  renderApiActivity() {
    const tbody = document.getElementById('apiActivityBody');
    if (!tbody) return;

    const activities = [
      { event: 'GET /api/v1/messages', key: 'op_live_xxx', status: 'success', ip: '192.168.1.1', time: '2 min ago' },
      { event: 'POST /api/v1/integrations/sync', key: 'op_live_xxx', status: 'success', ip: '192.168.1.1', time: '5 min ago' },
      { event: 'GET /api/v1/reports', key: 'op_dev_xxx', status: 'success', ip: '192.168.1.1', time: '10 min ago' },
      { event: 'POST /api/v1/webhooks', key: 'op_live_xxx', status: 'failed', ip: '192.168.1.1', time: '15 min ago' },
      { event: 'GET /api/v1/teams', key: 'op_dev_xxx', status: 'success', ip: '192.168.1.1', time: '20 min ago' }
    ];

    tbody.innerHTML = activities.map(act => `
      <tr>
        <td><span class="int-log-detail-mono" style="background: transparent; padding: 0;">${act.event}</span></td>
        <td>${act.key}</td>
        <td><span class="int-status-badge int-status-${act.status}">${act.status}</span></td>
        <td>${act.ip}</td>
        <td>${act.time}</td>
      </tr>
    `).join('');
  }

  renderLogs() {
    const tbody = document.getElementById('logsTableBody');
    if (!tbody) return;

    const logs = this.getFilteredLogs();

    tbody.innerHTML = logs.map(log => {
      const info = INTEGRATION_DATA[log.integration];
      const time = this.formatDateTime(log.timestamp);
      const statusClass = log.status;

      return `
        <tr data-log-id="${log.id}">
          <td>${time}</td>
          <td>
            <div class="int-log-integration">
              <i class="ph ${info?.icon || 'ph-plug'}" style="color: ${info?.color || 'var(--gray-500)'};"></i>
              <span>${info?.name || log.integration}</span>
            </div>
          </td>
          <td>${log.event}</td>
          <td><span class="int-status-badge int-status-${statusClass}">${log.status}</span></td>
          <td>${log.details}</td>
          <td>${log.duration}</td>
          <td>
            <button class="int-log-details-btn" onclick="integrationManager.openLogDetails('${log.id}')">
              View
            </button>
          </td>
        </tr>
      `;
    }).join('');

    this.updateLogStats();
  }

  renderLogFilters() {
    const select = document.getElementById('logsIntegrationFilter');
    if (!select) return;

    const integrations = Object.keys(INTEGRATION_DATA);
    const options = integrations.map(id => {
      const info = INTEGRATION_DATA[id];
      return `<option value="${id}">${info.name}</option>`;
    }).join('');

    select.innerHTML = '<option value="all">All Integrations</option>' + options;
  }

  getFilteredLogs() {
    let logs = this.getLogs();

    const search = document.getElementById('logsSearch')?.value.toLowerCase() || '';
    const integration = document.getElementById('logsIntegrationFilter')?.value || 'all';
    const status = document.getElementById('logsStatusFilter')?.value || 'all';

    if (search) {
      logs = logs.filter(l =>
        l.event.toLowerCase().includes(search) ||
        l.details.toLowerCase().includes(search) ||
        l.integration.toLowerCase().includes(search)
      );
    }

    if (integration !== 'all') {
      logs = logs.filter(l => l.integration === integration);
    }

    if (status !== 'all') {
      logs = logs.filter(l => l.status === status);
    }

    return logs.slice(0, 25);
  }

  updateLogStats() {
    const logs = this.getLogs();
    const total = logs.length;
    const successful = logs.filter(l => l.status === 'success').length;
    const failed = logs.filter(l => l.status === 'failed').length;
    const pending = logs.filter(l => l.status === 'pending').length;

    const elTotal = document.getElementById('logsTotalEvents');
    const elSuccess = document.getElementById('logsSuccessful');
    const elFailed = document.getElementById('logsFailed');
    const elPending = document.getElementById('logsPending');

    if (elTotal) elTotal.textContent = total.toLocaleString();
    if (elSuccess) elSuccess.textContent = successful.toLocaleString();
    if (elFailed) elFailed.textContent = failed.toLocaleString();
    if (elPending) elPending.textContent = pending.toLocaleString();
  }

  // --- Tab Switching ---
  switchTab(tabId) {
    document.querySelectorAll('.int-subnav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.int-subnav-tab[data-tab="${tabId}"]`)?.classList.add('active');

    document.querySelectorAll('.int-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tabId}`)?.classList.add('active');

    if (tabId === 'apikeys') {
      this.renderApiActivity();
    }
  }

  switchApiTab(panelId) {
    document.querySelectorAll('.int-api-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.int-api-tab[data-api-tab="${panelId}"]`)?.classList.add('active');

    document.querySelectorAll('.int-api-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`apiPanel-${panelId}`)?.classList.add('active');
  }

  // --- Filtering ---
  filterConnected(query) {
    const rows = document.querySelectorAll('#connectedTableBody tr');
    const q = query.toLowerCase();

    rows.forEach(row => {
      const name = row.querySelector('.int-table-integration-name')?.textContent.toLowerCase() || '';
      row.style.display = name.includes(q) ? '' : 'none';
    });
  }

  filterMarketplace(category) {
    const items = document.querySelectorAll('.int-marketplace-item');
    items.forEach(item => {
      if (category === 'all' || category === 'popular') {
        item.style.display = '';
      } else {
        item.style.display = item.dataset.category === category ? '' : 'none';
      }
    });
  }

  filterMarketplaceSearch(query) {
    const items = document.querySelectorAll('.int-marketplace-item');
    const q = query.toLowerCase();

    items.forEach(item => {
      const name = item.querySelector('h4')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('p')?.textContent.toLowerCase() || '';
      item.style.display = (name.includes(q) || desc.includes(q)) ? '' : 'none';
    });
  }

  filterLogs(query) {
    this.renderLogs();
  }

  applyLogFilters() {
    this.renderLogs();
  }

  // --- Modal Actions ---
  openConnectModal(integrationId) {
    this.pendingIntegration = integrationId;
    const info = INTEGRATION_DATA[integrationId];
    if (!info) return;

    document.getElementById('connectModalTitle').textContent = 'Connect Integration';
    document.getElementById('connectModalIcon').innerHTML = `<i class="ph ${info.icon}"></i>`;
    document.getElementById('connectModalIcon').style.background = info.bgColor;
    document.getElementById('connectModalIcon').style.color = info.color;
    document.getElementById('connectModalName').textContent = info.name;
    document.getElementById('connectModalDesc').textContent = info.description;
    document.getElementById('connectModalAction').textContent = `Connect ${info.name}`;

    const permList = document.querySelector('.int-modal-permissions ul');
    if (permList) {
      permList.innerHTML = info.permissions.map(p => `
        <li><i class="ph ph-check"></i> ${p}</li>
      `).join('');
    }

    document.getElementById('connectModalForm').style.display = 'block';
    document.getElementById('connectModalLoading').style.display = 'none';
    document.getElementById('connectModalSuccess').style.display = 'none';
    document.getElementById('connectModalAction').style.display = 'inline-flex';

    this.openModal('connectModal');
  }

  confirmConnect() {
    const integrationId = this.pendingIntegration;
    if (!integrationId) return;

    document.getElementById('connectModalForm').style.display = 'none';
    document.getElementById('connectModalLoading').style.display = 'flex';
    document.getElementById('connectModalAction').style.display = 'none';

    setTimeout(() => {
      const integrations = this.getIntegrations();
      integrations[integrationId] = {
        connected: true,
        status: 'healthy',
        lastSync: new Date().toISOString(),
        autoSync: true,
        syncCount: 0,
        dataSync: '+0%'
      };
      this.saveIntegrations(integrations);

      this.addLog({
        integration: integrationId,
        event: 'Integration Connected',
        status: 'success',
        details: `${INTEGRATION_DATA[integrationId]?.name || integrationId} was successfully connected.`,
        duration: '1.2s'
      });

      document.getElementById('connectModalLoading').style.display = 'none';
      document.getElementById('connectModalSuccess').style.display = 'flex';

      setTimeout(() => {
        this.closeModal('connectModal');
        this.renderAll();
        this.toast.show(`${INTEGRATION_DATA[integrationId]?.name || integrationId} connected successfully!`, 'success');
      }, 1500);
    }, 2000);
  }

  openDisconnectModal(integrationId) {
    this.pendingIntegration = integrationId;
    const info = INTEGRATION_DATA[integrationId];
    document.getElementById('disconnectModalName').textContent = info?.name || integrationId;
    this.openModal('disconnectModal');
  }

  confirmDisconnect() {
    const integrationId = this.pendingIntegration;
    if (!integrationId) return;

    const integrations = this.getIntegrations();
    integrations[integrationId] = {
      connected: false,
      status: 'disconnected',
      lastSync: null,
      autoSync: false,
      syncCount: 0,
      dataSync: '-'
    };
    this.saveIntegrations(integrations);

    this.addLog({
      integration: integrationId,
      event: 'Integration Disconnected',
      status: 'success',
      details: `${INTEGRATION_DATA[integrationId]?.name || integrationId} was disconnected.`,
      duration: '0.3s'
    });

    this.closeModal('disconnectModal');
    this.renderAll();
    this.toast.show(`${INTEGRATION_DATA[integrationId]?.name || integrationId} disconnected.`, 'warning');
  }

  syncIntegration(integrationId) {
    this.pendingIntegration = integrationId;
    this.openModal('syncModal');
  }

  confirmSync() {
    const integrationId = this.pendingIntegration;
    const syncType = document.querySelector('input[name="syncType"]:checked')?.value || 'incremental';

    this.closeModal('syncModal');

    const integrations = this.getIntegrations();
    if (integrations[integrationId]) {
      integrations[integrationId].lastSync = new Date().toISOString();
      integrations[integrationId].syncCount += Math.floor(Math.random() * 100) + 10;
      integrations[integrationId].dataSync = `+${Math.floor(Math.random() * 20)}%`;
      this.saveIntegrations(integrations);
    }

    this.addLog({
      integration: integrationId,
      event: syncType === 'full' ? 'Full Sync' : 'Incremental Sync',
      status: 'success',
      details: `Sync completed for ${INTEGRATION_DATA[integrationId]?.name || integrationId}.`,
      duration: '2.5s'
    });

    this.renderAll();
    this.toast.show(`Sync completed for ${INTEGRATION_DATA[integrationId]?.name || integrationId}`, 'success');
  }

  // --- API Key Management ---
  showApiKeyForm() {
    document.getElementById('apiKeyCreateForm').style.display = 'block';
  }

  hideApiKeyForm() {
    document.getElementById('apiKeyCreateForm').style.display = 'none';
    document.getElementById('apiKeyName').value = '';
  }

  createApiKey() {
    const name = document.getElementById('apiKeyName')?.value.trim();
    const env = document.getElementById('apiKeyEnv')?.value || 'production';
    const perms = Array.from(document.querySelectorAll('#apiKeyCreateForm input[type="checkbox"]:checked')).map(cb => cb.value);

    if (!name) {
      this.toast.show('Please enter a key name.', 'error');
      return;
    }

    const keys = this.getApiKeys();
    const prefix = env === 'production' ? 'op_live_' : env === 'development' ? 'op_dev_' : 'op_test_';
    const newKey = {
      id: `key_${env}_${Date.now()}`,
      name,
      key: prefix + Array(24).fill(0).map(() => Math.random().toString(36).charAt(2)).join(''),
      environment: env,
      permissions: perms.length ? perms : ['read'],
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: 'Just now'
    };

    keys.push(newKey);
    this.saveApiKeys(keys);

    this.hideApiKeyForm();
    this.renderApiKeys();
    this.toast.show('API key created successfully!', 'success');
  }

  toggleApiKey(keyId) {
    const keys = this.getApiKeys();
    const key = keys.find(k => k.id === keyId);
    if (key) {
      key.status = key.status === 'active' ? 'inactive' : 'active';
      this.saveApiKeys(keys);
      this.renderApiKeys();
      this.toast.show(`API key ${key.status === 'active' ? 'activated' : 'deactivated'}.`, 'success');
    }
  }

  deleteApiKey(keyId) {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    const keys = this.getApiKeys().filter(k => k.id !== keyId);
    this.saveApiKeys(keys);
    this.renderApiKeys();
    this.toast.show('API key deleted.', 'warning');
  }

  // --- Webhook Management ---
  showWebhookForm() {
    document.getElementById('webhookCreateForm').style.display = 'block';
  }

  hideWebhookForm() {
    document.getElementById('webhookCreateForm').style.display = 'none';
    document.getElementById('webhookUrl').value = '';
  }

  createWebhook() {
    const url = document.getElementById('webhookUrl')?.value.trim();
    const event = document.getElementById('webhookEvent')?.value || 'user.created';
    const secret = document.getElementById('webhookSecret')?.value.trim();

    if (!url) {
      this.toast.show('Please enter a webhook URL.', 'error');
      return;
    }

    const webhooks = this.getWebhooks();
    const newWebhook = {
      id: `wh_${Date.now()}`,
      name: event.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + 's',
      url,
      event,
      status: 'active',
      secret: secret || `whsec_${Array(24).fill(0).map(() => Math.random().toString(36).charAt(2)).join('')}`
    };

    webhooks.push(newWebhook);
    this.saveWebhooks(webhooks);

    this.hideWebhookForm();
    this.renderWebhooks();
    this.toast.show('Webhook added successfully!', 'success');
  }

  toggleWebhook(whId) {
    const webhooks = this.getWebhooks();
    const wh = webhooks.find(w => w.id === whId);
    if (wh) {
      wh.status = wh.status === 'active' ? 'inactive' : 'active';
      this.saveWebhooks(webhooks);
      this.renderWebhooks();
      this.toast.show(`Webhook ${wh.status === 'active' ? 'activated' : 'deactivated'}.`, 'success');
    }
  }

  deleteWebhook(whId) {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    const webhooks = this.getWebhooks().filter(w => w.id !== whId);
    this.saveWebhooks(webhooks);
    this.renderWebhooks();
    this.toast.show('Webhook deleted.', 'warning');
  }

  // --- OAuth Management ---
  connectOAuth(appId) {
    const apps = this.getOAuthApps();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.connected = true;
      app.scopes = ['email', 'profile'];
      this.saveOAuthApps(apps);
      this.renderOAuthApps();
      this.toast.show(`${app.name} connected successfully!`, 'success');
    }
  }

  disconnectOAuth(appId) {
    const apps = this.getOAuthApps();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.connected = false;
      app.scopes = [];
      this.saveOAuthApps(apps);
      this.renderOAuthApps();
      this.toast.show(`${app.name} disconnected.`, 'warning');
    }
  }

  // --- Log Details ---
  openLogDetails(logId) {
    const logs = this.getLogs();
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    const info = INTEGRATION_DATA[log.integration];

    document.getElementById('detailEvent').textContent = log.event;
    document.getElementById('detailIntegration').textContent = info?.name || log.integration;
    document.getElementById('detailStatus').innerHTML = `<span class="int-status-badge int-status-${log.status}">${log.status}</span>`;
    document.getElementById('detailTime').textContent = this.formatDateTime(log.timestamp);
    document.getElementById('detailDuration').textContent = log.duration;
    document.getElementById('detailDetails').textContent = log.details;
    document.getElementById('detailRequestId').textContent = log.requestId;

    document.getElementById('logDetailsPanel').classList.add('open');
  }

  closeLogDetails() {
    document.getElementById('logDetailsPanel').classList.remove('open');
  }

  retryLog() {
    this.toast.show('Retrying sync operation...', 'success');
    setTimeout(() => {
      this.toast.show('Sync retry completed successfully!', 'success');
    }, 2000);
  }

  // --- Modal Utilities ---
  openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
  }

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
  }

  // --- Sidebar ---
  toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!overlay) {
      const newOverlay = document.createElement('div');
      newOverlay.className = 'sidebar-overlay';
      newOverlay.addEventListener('click', () => this.toggleSidebar());
      document.body.appendChild(newOverlay);
    }

    sidebar?.classList.toggle('open');
    document.querySelector('.sidebar-overlay')?.classList.toggle('active');
  }

  // --- Theme ---
  updateThemeIcon() {
    const icon = document.getElementById('themeIcon');
    const current = document.documentElement.getAttribute('data-theme');
    if (icon) {
      icon.className = current === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    }
  }

  // --- Utilities ---
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  copyToClipboard(text) {
    navigator.clipboard?.writeText(text).then(() => {
      this.toast.show('Copied to clipboard!', 'success');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.toast.show('Copied to clipboard!', 'success');
    });
  }
}

// ============================================
// Initialize
// ============================================
let integrationManager;

document.addEventListener('DOMContentLoaded', () => {
  // Auth check
  if (typeof OP !== 'undefined' && OP.nav && !OP.nav.requireAuth()) {
    return;
  }

  integrationManager = new IntegrationManager();

  // Close modals on overlay click
  document.querySelectorAll('.int-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.int-modal-overlay.active').forEach(m => m.classList.remove('active'));
      document.getElementById('logDetailsPanel')?.classList.remove('open');
    }
  });
});