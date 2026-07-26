/**
 * OnePlace Enterprise v3.0 — Reports & Analytics Module
 * Vanilla JavaScript (ES6+)
 */

const REPORTS_STORAGE_KEYS = {
  REPORTS_DATA: 'op_reports_data',
  SAVED_REPORTS: 'op_saved_reports',
  SCHEDULED_REPORTS: 'op_scheduled_reports',
  REPORT_SETTINGS: 'op_report_settings',
  EXPORT_HISTORY: 'op_export_history'
};

const SAMPLE_REPORTS = [
  { id: 'r1', name: 'Weekly Sales Summary', category: 'sales', generatedBy: 'Alex Morgan', generatedByAvatar: 'AM', generatedByColor: '#6366f1', generatedOn: '2025-05-25T09:30:00', status: 'completed' },
  { id: 'r2', name: 'Customer Engagement Report', category: 'customers', generatedBy: 'Sarah Johnson', generatedByAvatar: 'SJ', generatedByColor: '#8b5cf6', generatedOn: '2025-05-25T08:15:00', status: 'completed' },
  { id: 'r3', name: 'Messaging Performance Report', category: 'messaging', generatedBy: 'Michael Brown', generatedByAvatar: 'MB', generatedByColor: '#f97316', generatedOn: '2025-05-24T19:45:00', status: 'completed' },
  { id: 'r4', name: 'Team Productivity Report', category: 'team', generatedBy: 'Emily Davis', generatedByAvatar: 'ED', generatedByColor: '#eab308', generatedOn: '2025-05-24T18:20:00', status: 'completed' },
  { id: 'r5', name: 'System Activity Report', category: 'activity', generatedBy: 'Alex Morgan', generatedByAvatar: 'AM', generatedByColor: '#6366f1', generatedOn: '2025-05-24T17:10:00', status: 'completed' }
];

const SAMPLE_SCHEDULED = [
  { id: 's1', name: 'Weekly Sales Report', schedule: 'Every Monday at 09:00 AM', frequency: 'weekly', time: '09:00', active: true, icon: 'ph-chart-bar' },
  { id: 's2', name: 'Monthly Customer Report', schedule: '1st of every month at 09:00 AM', frequency: 'monthly', time: '09:00', active: true, icon: 'ph-users' },
  { id: 's3', name: 'Team Performance Report', schedule: 'Every Friday at 05:00 PM', frequency: 'weekly', time: '17:00', active: true, icon: 'ph-users-three' },
  { id: 's4', name: 'Messaging Summary', schedule: 'Every Sunday at 09:00 AM', frequency: 'weekly', time: '09:00', active: false, icon: 'ph-chat-circle-text' }
];

const SAMPLE_CAMPAIGNS = [
  { id: 'c1', name: 'Spring Promotion 2025', revenue: 28540, trend: 24.5, icon: 'promotion', iconClass: 'ph-plant' },
  { id: 'c2', name: 'New Customer Outreach', revenue: 21860, trend: 18.2, icon: 'outreach', iconClass: 'ph-user-plus' },
  { id: 'c3', name: 'Product Launch Campaign', revenue: 18450, trend: 16.8, icon: 'launch', iconClass: 'ph-rocket' },
  { id: 'c4', name: 'Re-engagement Campaign', revenue: 16230, trend: 14.3, icon: 'reengage', iconClass: 'ph-arrows-clockwise' },
  { id: 'c5', name: 'Welcome Series', revenue: 12680, trend: 12.7, icon: 'welcome', iconClass: 'ph-hand-waving' }
];

const SAMPLE_INSIGHTS = [
  { id: 'i1', title: 'Revenue increased by 18.6% this week', desc: 'Better performance than last week', type: 'revenue', iconClass: 'ph-trend-up' },
  { id: 'i2', title: 'WhatsApp messages show highest engagement', desc: '26.1% of total messages sent', type: 'engagement', iconClass: 'ph-chart-line-up' },
  { id: 'i3', title: 'Conversion rate improved by 8.7%', desc: 'Great job! Keep up the momentum', type: 'conversion', iconClass: 'ph-target' },
  { id: 'i4', title: 'Gmail open rate is trending up', desc: '9.4% improvement from last week', type: 'open-rate', iconClass: 'ph-envelope-open' }
];

const KPI_DATA = [
  { label: 'Total Revenue', value: '$124,580', trend: 18.6, trendUp: true, dateRange: 'May 12 - May 18', icon: 'revenue', iconClass: 'ph-currency-dollar', color: '#6366f1', sparkline: [45, 52, 48, 60, 55, 68, 72, 65, 78, 85] },
  { label: 'New Customers', value: '1,248', trend: 24.3, trendUp: true, dateRange: 'May 12 - May 18', icon: 'customers', iconClass: 'ph-users', color: '#10b981', sparkline: [30, 35, 32, 40, 38, 45, 42, 50, 48, 55] },
  { label: 'Messages Sent', value: '28,540', trend: 16.2, trendUp: true, dateRange: 'May 12 - May 18', icon: 'messages', iconClass: 'ph-chat-circle-text', color: '#0284c7', sparkline: [50, 55, 48, 60, 58, 65, 62, 70, 68, 75] },
  { label: 'Open Rate', value: '67.8%', trend: 9.4, trendUp: true, dateRange: 'May 12 - May 18', icon: 'open-rate', iconClass: 'ph-envelope', color: '#d97706', sparkline: [55, 58, 56, 60, 59, 62, 61, 64, 63, 67] },
  { label: 'Conversion Rate', value: '12.4%', trend: 8.7, trendUp: true, dateRange: 'May 12 - May 18', icon: 'conversion', iconClass: 'ph-target', color: '#db2777', sparkline: [8, 9, 8.5, 10, 9.5, 11, 10.5, 11.5, 11, 12.4] },
  { label: 'Active Deals', value: '342', trend: 15.1, trendUp: true, dateRange: 'May 12 - May 18', icon: 'deals', iconClass: 'ph-lock-key', color: '#9333ea', sparkline: [280, 290, 285, 300, 295, 310, 305, 320, 315, 342] }
];

const CHANNEL_DATA = [
  { name: 'Gmail', value: 8620, color: '#EA4335', percent: 30.2 },
  { name: 'WhatsApp', value: 7450, color: '#25D366', percent: 26.1 },
  { name: 'Instagram', value: 4820, color: '#E4405F', percent: 16.9 },
  { name: 'TikTok', value: 3620, color: '#000000', percent: 12.7 },
  { name: 'X (Twitter)', value: 2340, color: '#1DA1F2', percent: 8.2 },
  { name: 'LinkedIn', value: 1690, color: '#0A66C2', percent: 5.9 }
];

const REVENUE_CHART_DATA = [
  { date: 'May 19', value: 5000 },
  { date: 'May 20', value: 8500 },
  { date: 'May 21', value: 12000 },
  { date: 'May 22', value: 10500 },
  { date: 'May 23', value: 15000 },
  { date: 'May 24', value: 18000 },
  { date: 'May 25', value: 22000 }
];

const CONVERSION_CHART_DATA = [
  { date: 'May 19', value: 8 },
  { date: 'May 20', value: 12 },
  { date: 'May 21', value: 10 },
  { date: 'May 22', value: 14 },
  { date: 'May 23', value: 11 },
  { date: 'May 24', value: 13 },
  { date: 'May 25', value: 12.4 }
];

const REPORT_CATEGORIES = [
  { id: 'sales', name: 'Sales Reports', desc: 'Track revenue, deals and performance', count: 12, icon: 'sales', iconClass: 'ph-chart-bar' },
  { id: 'customers', name: 'Customer Reports', desc: 'Analyze customer trends and behavior', count: 15, icon: 'customers', iconClass: 'ph-users' },
  { id: 'messaging', name: 'Messaging Reports', desc: 'Monitor messaging and engagement', count: 18, icon: 'messaging', iconClass: 'ph-chat-circle-text' },
  { id: 'team', name: 'Team Performance', desc: 'Evaluate team productivity', count: 10, icon: 'team', iconClass: 'ph-users-three' },
  { id: 'activity', name: 'Activity Reports', desc: 'Track system and user activities', count: 14, icon: 'activity', iconClass: 'ph-clock' },
  { id: 'custom', name: 'Custom Reports', desc: 'Build custom reports and dashboards', count: 8, icon: 'custom', iconClass: 'ph-sliders-horizontal' }
];

const QUICK_ACTIONS = [
  { label: 'Create Report', icon: 'create', iconClass: 'ph-file-plus', action: 'create' },
  { label: 'Report Builder', icon: 'builder', iconClass: 'ph-squares-four', action: 'builder' },
  { label: 'Schedule Report', icon: 'schedule', iconClass: 'ph-calendar-check', action: 'schedule' },
  { label: 'Export Data', icon: 'export', iconClass: 'ph-download-simple', action: 'export' },
  { label: 'Share Report', icon: 'share', iconClass: 'ph-share-network', action: 'share' },
  { label: 'Manage Templates', icon: 'templates', iconClass: 'ph-layout', action: 'templates' }
];

class ReportsStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(REPORTS_STORAGE_KEYS.REPORTS_DATA)) {
      localStorage.setItem(REPORTS_STORAGE_KEYS.REPORTS_DATA, JSON.stringify({}));
      localStorage.setItem(REPORTS_STORAGE_KEYS.SAVED_REPORTS, JSON.stringify([]));
      localStorage.setItem(REPORTS_STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify([]));
      localStorage.setItem(REPORTS_STORAGE_KEYS.EXPORT_HISTORY, JSON.stringify([]));
      localStorage.setItem(REPORTS_STORAGE_KEYS.REPORT_SETTINGS, JSON.stringify({
        defaultDateRange: '7',
        defaultFormat: 'pdf',
        autoRefresh: true
      }));
    }
  }

  seedData() {
    localStorage.setItem(REPORTS_STORAGE_KEYS.REPORTS_DATA, JSON.stringify({
      kpiData: KPI_DATA,
      channelData: CHANNEL_DATA,
      revenueChartData: REVENUE_CHART_DATA,
      conversionChartData: CONVERSION_CHART_DATA,
      campaigns: SAMPLE_CAMPAIGNS,
      insights: SAMPLE_INSIGHTS,
      reportCategories: REPORT_CATEGORIES
    }));
    localStorage.setItem(REPORTS_STORAGE_KEYS.SAVED_REPORTS, JSON.stringify(SAMPLE_REPORTS));
    localStorage.setItem(REPORTS_STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify(SAMPLE_SCHEDULED));
    localStorage.setItem(REPORTS_STORAGE_KEYS.REPORT_SETTINGS, JSON.stringify({
      defaultDateRange: '7',
      defaultFormat: 'pdf',
      autoRefresh: true
    }));
    localStorage.setItem(REPORTS_STORAGE_KEYS.EXPORT_HISTORY, JSON.stringify([]));
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEYS.REPORTS_DATA)) || {};
    } catch {
      return {};
    }
  }

  getSavedReports() {
    try {
      return JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEYS.SAVED_REPORTS)) || [];
    } catch {
      return [];
    }
  }

  saveReport(report) {
    const reports = this.getSavedReports();
    report.id = 'r' + Date.now();
    report.generatedOn = new Date().toISOString();
    reports.unshift(report);
    localStorage.setItem(REPORTS_STORAGE_KEYS.SAVED_REPORTS, JSON.stringify(reports.slice(0, 100)));
    return report;
  }

  getScheduledReports() {
    try {
      return JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEYS.SCHEDULED_REPORTS)) || [];
    } catch {
      return [];
    }
  }

  updateScheduledReport(id, updates) {
    const reports = this.getScheduledReports();
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      reports[idx] = { ...reports[idx], ...updates };
      localStorage.setItem(REPORTS_STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify(reports));
    }
    return reports;
  }

  addExportHistory(exportItem) {
    const history = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEYS.EXPORT_HISTORY) || '[]');
    history.unshift({
      id: 'e' + Date.now(),
      ...exportItem,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(REPORTS_STORAGE_KEYS.EXPORT_HISTORY, JSON.stringify(history.slice(0, 50)));
  }

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEYS.REPORT_SETTINGS)) || {};
    } catch {
      return {};
    }
  }

  updateSettings(settings) {
    const current = this.getSettings();
    localStorage.setItem(REPORTS_STORAGE_KEYS.REPORT_SETTINGS, JSON.stringify({ ...current, ...settings }));
  }
}

class ReportsApp {
  constructor() {
    this.storage = new ReportsStorage();
    this.currentTab = 'overview';
    this.currentDateRange = { start: '2025-05-19', end: '2025-05-25', label: 'May 19 - May 25, 2025' };
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.renderSidebar();
    this.renderHeader();
    this.renderKPICards();
    this.renderCharts();
    this.renderReportCategories();
    this.renderRecentReports();
    this.renderQuickActions();
    this.renderCampaigns();
    this.renderInsights();
    this.renderScheduledReports();
    this.bindEvents();
    this.initSearch();
    this.syncFromBackend();
  }

  async syncFromBackend() {
    if (!window.OP || !window.OP.apiIntegration) return;

    try {
      window.OP.apiIntegration.init();
      const [tasksReport, projectsReport, timeReport, productivityReport] = await Promise.all([
        window.OP.apiIntegration.get('/reports/tasks').catch(() => null),
        window.OP.apiIntegration.get('/reports/projects').catch(() => null),
        window.OP.apiIntegration.get('/reports/time').catch(() => null),
        window.OP.apiIntegration.get('/reports/productivity').catch(() => null)
      ]);

      const reportData = {
        tasks: tasksReport ? window.OP.apiIntegration.extractData(tasksReport) : {},
        projects: projectsReport ? window.OP.apiIntegration.extractData(projectsReport) : {},
        time: timeReport ? window.OP.apiIntegration.extractData(timeReport) : {},
        productivity: productivityReport ? window.OP.apiIntegration.extractData(productivityReport) : {}
      };

      localStorage.setItem(REPORTS_STORAGE_KEYS.REPORTS_DATA, JSON.stringify(reportData));

      const savedReports = [];
      if (tasksReport) savedReports.push({ id: `r_tasks_${Date.now()}`, name: 'Tasks Report', category: 'tasks', generatedBy: 'System', status: 'completed', generatedOn: new Date().toISOString() });
      if (projectsReport) savedReports.push({ id: `r_projects_${Date.now()}`, name: 'Projects Report', category: 'projects', generatedBy: 'System', status: 'completed', generatedOn: new Date().toISOString() });
      if (timeReport) savedReports.push({ id: `r_time_${Date.now()}`, name: 'Time Report', category: 'time', generatedBy: 'System', status: 'completed', generatedOn: new Date().toISOString() });
      if (productivityReport) savedReports.push({ id: `r_productivity_${Date.now()}`, name: 'Productivity Report', category: 'productivity', generatedBy: 'System', status: 'completed', generatedOn: new Date().toISOString() });
      localStorage.setItem(REPORTS_STORAGE_KEYS.SAVED_REPORTS, JSON.stringify(savedReports));

      this.renderKPICards();
      this.renderCharts();
      this.renderRecentReports();
      this.renderCampaigns();
      this.renderInsights();
      this.renderScheduledReports();
    } catch (error) {
      console.warn('Reports backend sync skipped:', error);
    }
  }

  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'Alex Morgan';
    const userRole = 'Administrator';
    const userAvatar = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const navItems = [
      { section: 'MAIN', items: [
        { icon: 'ph-squares-four', label: 'Dashboard', href: '../dashboard/main-dashboard.html', badge: null },
        { icon: 'ph-inbox', label: 'Unified Inbox', href: '../inbox/unified-inbox.html', badge: 24 }
      ]},
      { section: 'CHANNELS', items: [
        { icon: 'ph-envelope-simple', label: 'Gmail', href: '../gmail/index.html', badge: null },
        { icon: 'ph-chat-circle-text', label: 'WhatsApp Business', href: '../whatsapp/index.html', badge: 8 },
        { icon: 'ph-camera', label: 'Instagram', href: '../instagram/index.html', badge: 16 },
        { icon: 'ph-music-notes', label: 'TikTok', href: '../tiktok/index.html', badge: 23 },
        { icon: 'ph-x-logo', label: 'X (Twitter)', href: '../x/index.html', badge: 34 },
        { icon: 'ph-linkedin-logo', label: 'LinkedIn', href: '../linkedin/index.html', badge: 26 }
      ]},
      { section: 'BUSINESS', items: [
        { icon: 'ph-users', label: 'CRM', href: '../crm/index.html', badge: null },
        { icon: 'ph-headset', label: 'Customer Support', href: '../support/index.html', badge: null },
        { icon: 'ph-calendar-blank', label: 'Calendar', href: '../calendar/index.html', badge: null },
        { icon: 'ph-check-square', label: 'Tasks', href: '../tasks/index.html', badge: null },
        { icon: 'ph-users-three', label: 'Team Management', href: '../team/index.html', badge: null },
        { icon: 'ph-git-branch', label: 'Workflow', href: '../workflow/index.html', badge: null }
      ]},
      { section: 'INTELLIGENCE', items: [
        { icon: 'ph-sparkle', label: 'AI', href: '../ai/index.html', badge: null },
        { icon: 'ph-bell', label: 'Notifications', href: '../notifications/notifications.html', badge: 12 }
      ]},
      { section: 'ANALYTICS', items: [
        { icon: 'ph-chart-bar', label: 'Reports', href: '../reports/index.html', badge: null, active: true }
      ]},
      { section: 'SETTINGS', items: [
        { icon: 'ph-gear', label: 'Settings', href: '../settings/index.html', badge: null },
        { icon: 'ph-puzzle-piece', label: 'Integrations', href: '../integrations/index.html', badge: null },
        { icon: 'ph-question', label: 'Help & Support', href: '../help/index.html', badge: null }
      ]},
      { section: 'MORE', items: [
        { icon: 'ph-headset', label: 'Support', href: '../support/index.html', badge: null },
        { icon: 'ph-credit-card', label: 'Billing', href: '../billing/index.html', badge: null },
        { icon: 'ph-folder', label: 'Files', href: '../files/index.html', badge: null },
        { icon: 'ph-magnifying-glass', label: 'Search', href: '../search/index.html', badge: null },
        { icon: 'ph-bell', label: 'Notifications', href: '../notifications/notifications.html', badge: null },
        { icon: 'ph-flow-arrow', label: 'Workflow', href: '../workflow/index.html', badge: null }
      ]}
    ];

    let html = `
      <div class="sidebar-header">
        <a href="../index.html" class="logo">
          <div class="logo-mark"><i class="ph ph-cube"></i></div>
          <div class="logo-text">
            <span class="logo-brand">OnePlace</span>
            <span class="logo-sub">Enterprise v3.0</span>
          </div>
        </a>
      </div>
      <nav class="sidebar-nav">
    `;

    navItems.forEach(section => {
      html += `<div class="sidebar-section"><span class="sidebar-section-label">${section.section}</span>`;
      section.items.forEach(item => {
        const activeClass = item.active ? 'active' : '';
        const badgeHtml = item.badge ? `<span class="sidebar-badge">${item.badge}</span>` : '';
        html += `
          <a href="${item.href}" class="sidebar-link ${activeClass}">
            <i class="ph ${item.icon}"></i>
            <span>${item.label}</span>
            ${badgeHtml}
          </a>
        `;
      });
      html += `</div>`;
    });

    html += `
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar" style="background: linear-gradient(135deg, #6366f1, #8b5cf6)">${userAvatar}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${userName}</div>
            <div class="sidebar-user-role">${userRole}</div>
          </div>
          <button class="sidebar-user-menu"><i class="ph ph-caret-down"></i></button>
        </div>
        <button class="sidebar-theme-toggle" id="sidebar-theme-toggle">
          <i class="ph ph-moon"></i>
          <span>Light Mode</span>
          <i class="ph ph-caret-right"></i>
        </button>
      </div>
    `;

    sidebar.innerHTML = html;

    const themeBtn = document.getElementById('sidebar-theme-toggle');
    if (themeBtn) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      themeBtn.querySelector('span').textContent = currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
      themeBtn.querySelector('.ph').className = currentTheme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';

      themeBtn.addEventListener('click', () => {
        OP.theme.toggle();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.querySelector('span').textContent = isDark ? 'Dark Mode' : 'Light Mode';
        themeBtn.querySelector('.ph').className = isDark ? 'ph ph-sun' : 'ph ph-moon';
      });
    }

    const toggleBtn = document.querySelector('.sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      });
    }

    if (overlay && sidebar) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }

  renderHeader() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'Alex Morgan';
    const userAvatar = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    header.innerHTML = `
      <div class="header-left">
        <button class="header-menu-btn" aria-label="Toggle menu">
          <i class="ph ph-list"></i>
        </button>
        <div class="header-breadcrumb">
          <span>Analytics</span>
          <i class="ph ph-caret-right"></i>
          <span class="active">Reports</span>
        </div>
      </div>
      <div class="header-right">
        <button class="header-icon-btn" id="header-search-btn" title="Search">
          <i class="ph ph-magnifying-glass"></i>
        </button>
        <button class="header-icon-btn" id="header-notifications-btn" title="Notifications">
          <i class="ph ph-bell"></i>
          <span class="header-badge">3</span>
        </button>
        <button class="header-icon-btn" id="header-messages-btn" title="Messages">
          <i class="ph ph-chat-circle-text"></i>
        </button>
        <div class="header-user">
          <div class="header-user-info">
            <div class="header-user-name">${userName}</div>
            <div class="header-user-role">Administrator</div>
          </div>
          <div class="header-user-avatar" style="background: linear-gradient(135deg, #6366f1, #8b5cf6)">
            ${userAvatar}
          </div>
          <button class="header-user-chevron"><i class="ph ph-caret-down"></i></button>
        </div>
      </div>
    `;

    const menuBtn = header.querySelector('.header-menu-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      });
    }
  }

  renderKPICards() {
    const container = document.getElementById('kpi-cards');
    if (!container) return;

    let html = '';
    KPI_DATA.forEach(kpi => {
      const trendClass = kpi.trendUp ? 'up' : 'down';
      const trendIcon = kpi.trendUp ? 'ph-trend-up' : 'ph-trend-down';
      const sparklineSvg = this.generateSparkline(kpi.sparkline, kpi.color);

      html += `
        <div class="kpi-card">
          <div class="kpi-card-header">
            <span class="kpi-card-label">${kpi.label}</span>
            <div class="kpi-card-icon ${kpi.icon}">
              <i class="ph ${kpi.iconClass}"></i>
            </div>
          </div>
          <div class="kpi-card-value">${kpi.value}</div>
          <div class="kpi-card-trend ${trendClass}">
            <i class="ph ${trendIcon}"></i>
            <span>${kpi.trend}%</span>
          </div>
          <div class="kpi-card-date">vs ${kpi.dateRange}</div>
          <div class="kpi-card-sparkline">
            ${sparklineSvg}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  generateSparkline(data, color) {
    const width = 200;
    const height = 40;
    const padding = 2;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    const safeColor = color.replace('#', '');

    return `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spark-gradient-${safeColor}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="${points} ${width - padding},${height} ${padding},${height}" 
          fill="url(#spark-gradient-${safeColor})"/>
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${points.split(' ').pop().split(',')[0]}" cy="${points.split(' ').pop().split(',')[1]}" r="3" fill="${color}" stroke="white" stroke-width="1.5"/>
      </svg>
    `;
  }

  renderCharts() {
    this.renderRevenueChart();
    this.renderDonutChart();
    this.renderConversionChart();
  }

  renderRevenueChart() {
    const container = document.getElementById('revenue-chart');
    if (!container) return;

    const data = REVENUE_CHART_DATA;
    const width = 400;
    const height = 160;
    const padding = { top: 10, right: 10, bottom: 30, left: 50 };

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight;
      return { x, y, value: d.value, date: d.date };
    });

    const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
    const areaPoints = `${points[0].x},${padding.top + chartHeight} ${linePoints} ${points[points.length - 1].x},${padding.top + chartHeight}`;

    const yLabels = [0, maxValue * 0.5, maxValue].map(v => {
      const y = padding.top + chartHeight - ((v - minValue) / range) * chartHeight;
      return `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#9ca3af">$${(v / 1000).toFixed(0)}K</text>`;
    }).join('');

    const xLabels = points.map((p, i) => {
      if (i % 2 !== 0 && points.length > 6) return '';
      return `<text x="${p.x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#9ca3af">${p.date}</text>`;
    }).join('');

    const circles = points.map((p, i) => 
      `<circle cx="${p.x}" cy="${p.y}" r="4" fill="white" stroke="#6366f1" stroke-width="2"/>`
    ).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:100%;">
        <defs>
          <linearGradient id="revenue-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <g class="chart-grid">
          <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#e5e7eb" stroke-dasharray="4"/>
          <line x1="${padding.left}" y1="${padding.top + chartHeight / 2}" x2="${width - padding.right}" y2="${padding.top + chartHeight / 2}" stroke="#e5e7eb" stroke-dasharray="4"/>
          <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#e5e7eb"/>
        </g>
        ${yLabels}
        ${xLabels}
        <polygon points="${areaPoints}" fill="url(#revenue-area-gradient)"/>
        <polyline points="${linePoints}" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${circles}
      </svg>
    `;
  }

  renderDonutChart() {
    const container = document.getElementById('channel-donut');
    const legendContainer = document.getElementById('channel-legend');
    if (!container || !legendContainer) return;

    const data = CHANNEL_DATA;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const size = 140;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let offset = 0;
    let svgContent = '';

    data.forEach(d => {
      const segmentLength = (d.value / total) * circumference;
      const gap = 2;
      const drawLength = Math.max(0, segmentLength - gap);

      svgContent += `
        <circle cx="${center}" cy="${center}" r="${radius}" 
          fill="none" stroke="${d.color}" stroke-width="${strokeWidth}"
          stroke-dasharray="${drawLength} ${circumference - drawLength}"
          stroke-dashoffset="${-offset}"
          stroke-linecap="butt"/>
      `;

      offset += segmentLength;
    });

    container.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${svgContent}
      </svg>
      <div class="donut-center-text">
        <div class="donut-center-value">${total.toLocaleString()}</div>
        <div class="donut-center-label">Total Messages</div>
      </div>
    `;

    let legendHtml = '';
    data.forEach(d => {
      legendHtml += `
        <div class="donut-legend-item">
          <div class="donut-legend-dot" style="background: ${d.color}"></div>
          <span class="donut-legend-name">${d.name}</span>
          <span class="donut-legend-value">${d.value.toLocaleString()}</span>
          <span class="donut-legend-percent">(${d.percent}%)</span>
        </div>
      `;
    });
    legendContainer.innerHTML = legendHtml;
  }

  renderConversionChart() {
    const container = document.getElementById('conversion-chart');
    if (!container) return;

    const data = CONVERSION_CHART_DATA;
    const width = 400;
    const height = 160;
    const padding = { top: 10, right: 10, bottom: 30, left: 40 };

    const maxValue = 20;
    const minValue = 0;

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight;
      return { x, y, value: d.value, date: d.date };
    });

    const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
    const areaPoints = `${points[0].x},${padding.top + chartHeight} ${linePoints} ${points[points.length - 1].x},${padding.top + chartHeight}`;

    const yLabels = [0, 10, 20].map(v => {
      const y = padding.top + chartHeight - ((v - minValue) / (maxValue - minValue)) * chartHeight;
      return `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#9ca3af">${v}%</text>`;
    }).join('');

    const xLabels = points.map((p, i) => {
      if (i % 2 !== 0 && points.length > 6) return '';
      return `<text x="${p.x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#9ca3af">${p.date}</text>`;
    }).join('');

    const circles = points.map((p, i) => 
      `<circle cx="${p.x}" cy="${p.y}" r="4" fill="white" stroke="#6366f1" stroke-width="2"/>`
    ).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:100%;">
        <defs>
          <linearGradient id="conversion-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <g class="chart-grid">
          <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#e5e7eb" stroke-dasharray="4"/>
          <line x1="${padding.left}" y1="${padding.top + chartHeight / 2}" x2="${width - padding.right}" y2="${padding.top + chartHeight / 2}" stroke="#e5e7eb" stroke-dasharray="4"/>
          <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#e5e7eb"/>
        </g>
        ${yLabels}
        ${xLabels}
        <polygon points="${areaPoints}" fill="url(#conversion-area-gradient)"/>
        <polyline points="${linePoints}" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${circles}
      </svg>
    `;
  }

  renderReportCategories() {
    const container = document.getElementById('report-categories');
    if (!container) return;

    let html = '';
    REPORT_CATEGORIES.forEach(cat => {
      html += `
        <a href="#" class="report-category-card" data-category="${cat.id}">
          <div class="report-category-icon ${cat.icon}">
            <i class="ph ${cat.iconClass}"></i>
          </div>
          <div class="report-category-info">
            <div class="report-category-name">${cat.name}</div>
            <div class="report-category-desc">${cat.desc}</div>
            <div class="report-category-count">${cat.count} Reports</div>
          </div>
        </a>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.report-category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const category = card.dataset.category;
        this.switchTab(category);
      });
    });
  }

  renderRecentReports() {
    const tbody = document.getElementById('recent-reports-body');
    if (!tbody) return;

    const reports = this.storage.getSavedReports();
    const filtered = this.searchQuery 
      ? reports.filter(r => r.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      : reports;

    let html = '';
    filtered.forEach(report => {
      const date = new Date(report.generatedOn);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      html += `
        <tr data-id="${report.id}">
          <td>
            <div class="report-name-cell">${report.name}</div>
          </td>
          <td>
            <span class="report-category-badge ${report.category}">${this.formatCategoryName(report.category)}</span>
          </td>
          <td>
            <div class="report-generated-by">
              <div class="report-avatar" style="background: ${report.generatedByColor}">${report.generatedByAvatar}</div>
              <span>${report.generatedBy}</span>
            </div>
          </td>
          <td>${dateStr} ${timeStr}</td>
          <td>
            <div class="report-actions">
              <button class="report-action-btn" title="View" data-action="view" data-id="${report.id}">
                <i class="ph ph-eye"></i>
              </button>
              <button class="report-action-btn" title="Download" data-action="download" data-id="${report.id}">
                <i class="ph ph-download-simple"></i>
              </button>
              <button class="report-action-btn" title="More" data-action="more" data-id="${report.id}">
                <i class="ph ph-dots-three-vertical"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    tbody.querySelectorAll('.report-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const report = reports.find(r => r.id === id);

        if (action === 'view') {
          this.openViewReportModal(report);
        } else if (action === 'download') {
          this.openExportModal(report);
        } else if (action === 'more') {
          OP.toast.show('More options coming soon', 'warning');
        }
      });
    });
  }

  formatCategoryName(category) {
    const names = {
      sales: 'Sales Reports',
      customers: 'Customer Reports',
      messaging: 'Messaging Reports',
      team: 'Team Performance',
      activity: 'Activity Reports',
      custom: 'Custom Reports'
    };
    return names[category] || category;
  }

  renderQuickActions() {
    const container = document.getElementById('quick-actions');
    if (!container) return;

    let html = '';
    QUICK_ACTIONS.forEach(action => {
      html += `
        <button class="quick-action-btn" data-action="${action.action}">
          <div class="quick-action-icon ${action.icon}">
            <i class="ph ${action.iconClass}"></i>
          </div>
          <span class="quick-action-label">${action.label}</span>
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleQuickAction(action);
      });
    });
  }

  handleQuickAction(action) {
    switch(action) {
      case 'create':
        this.openModal('modal-create-report');
        break;
      case 'builder':
        OP.toast.show('Report Builder opened', 'success');
        break;
      case 'schedule':
        this.openModal('modal-schedule');
        break;
      case 'export':
        this.openModal('modal-export');
        break;
      case 'share':
        OP.toast.show('Share dialog opened', 'success');
        break;
      case 'templates':
        OP.toast.show('Templates manager opened', 'success');
        break;
    }
  }

  renderCampaigns() {
    const container = document.getElementById('campaign-list');
    if (!container) return;

    let html = '';
    SAMPLE_CAMPAIGNS.forEach(campaign => {
      html += `
        <div class="campaign-item">
          <div class="campaign-icon ${campaign.icon}">
            <i class="ph ${campaign.iconClass}"></i>
          </div>
          <div class="campaign-info">
            <div class="campaign-name">${campaign.name}</div>
            <div class="campaign-trend">
              <i class="ph ph-trend-up"></i>
              <span>${campaign.trend}%</span>
            </div>
          </div>
          <div class="campaign-value">$${campaign.revenue.toLocaleString()}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderInsights() {
    const container = document.getElementById('insights-list');
    if (!container) return;

    let html = '';
    SAMPLE_INSIGHTS.forEach(insight => {
      html += `
        <div class="insight-item">
          <div class="insight-icon ${insight.type}">
            <i class="ph ${insight.iconClass}"></i>
          </div>
          <div class="insight-content">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-desc">${insight.desc}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderScheduledReports() {
    const container = document.getElementById('scheduled-list');
    if (!container) return;

    const scheduled = this.storage.getScheduledReports();

    let html = '';
    scheduled.forEach(item => {
      html += `
        <div class="scheduled-item">
          <div class="scheduled-icon">
            <i class="ph ${item.icon}"></i>
          </div>
          <div class="scheduled-info">
            <div class="scheduled-name">${item.name}</div>
            <div class="scheduled-time">${item.schedule}</div>
          </div>
          <button class="scheduled-toggle ${item.active ? 'active' : ''}" data-id="${item.id}" aria-label="Toggle schedule">
          </button>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.scheduled-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const id = toggle.dataset.id;
        const isActive = toggle.classList.contains('active');
        toggle.classList.toggle('active');
        this.storage.updateScheduledReport(id, { active: !isActive });
        OP.toast.show(`Schedule ${!isActive ? 'enabled' : 'disabled'}`, 'success');
      });
    });
  }

  bindEvents() {
    const tabs = document.querySelectorAll('.reports-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.onTabChange(this.currentTab);
      });
    });

    const createBtn = document.getElementById('btn-create-report');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        this.openModal('modal-create-report');
      });
    }

    const saveReportBtn = document.getElementById('btn-save-report');
    if (saveReportBtn) {
      saveReportBtn.addEventListener('click', () => {
        this.saveNewReport();
      });
    }

    const saveScheduleBtn = document.getElementById('btn-save-schedule');
    if (saveScheduleBtn) {
      saveScheduleBtn.addEventListener('click', () => {
        this.saveNewSchedule();
      });
    }

    document.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) this.closeModal(modal.id);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay.id);
        }
      });
    });

    document.querySelectorAll('.export-option').forEach(option => {
      option.addEventListener('click', () => {
        const format = option.dataset.format;
        this.handleExport(format);
      });
    });

    const datePicker = document.getElementById('date-range-picker');
    const dateDropdown = document.getElementById('date-range-dropdown');

    if (datePicker && dateDropdown) {
      datePicker.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = datePicker.getBoundingClientRect();
        dateDropdown.style.top = `${rect.bottom + 4}px`;
        dateDropdown.style.left = `${rect.left}px`;
        dateDropdown.classList.toggle('active');
      });

      dateDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const range = item.dataset.range;
          this.handleDateRangeChange(range);
          dateDropdown.classList.remove('active');
        });
      });

      document.addEventListener('click', () => {
        dateDropdown.classList.remove('active');
      });
    }

    const filtersBtn = document.getElementById('btn-filters');
    if (filtersBtn) {
      filtersBtn.addEventListener('click', () => {
        OP.toast.show('Filters panel opened', 'success');
      });
    }

    const moreBtn = document.getElementById('btn-more-options');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        OP.toast.show('More options', 'success');
      });
    }

    const viewAllReports = document.getElementById('view-all-reports');
    if (viewAllReports) {
      viewAllReports.addEventListener('click', (e) => {
        e.preventDefault();
        OP.toast.show('All reports view', 'success');
      });
    }

    const viewAllScheduled = document.getElementById('view-all-scheduled');
    const viewAllScheduledBtn = document.getElementById('view-all-scheduled-btn');

    [viewAllScheduled, viewAllScheduledBtn].forEach(el => {
      if (el) {
        el.addEventListener('click', (e) => {
          if (e.preventDefault) e.preventDefault();
          OP.toast.show('All scheduled reports', 'success');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('reports-search-input')?.focus();
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          this.closeModal(m.id);
        });
      }
    });
  }

  initSearch() {
    const searchInput = document.getElementById('reports-search-input');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.searchQuery = e.target.value.trim();
        this.renderRecentReports();
      }, 300);
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  onTabChange(tab) {
    OP.toast.show(`Switched to ${tab} tab`, 'success');
  }

  handleDateRangeChange(range) {
    const labels = {
      '7': 'Last 7 Days',
      '30': 'Last 30 Days',
      '90': 'Last 90 Days',
      'custom': 'Custom Range'
    };

    const labelEl = document.getElementById('date-range-label');
    if (labelEl) {
      if (range === 'custom') {
        labelEl.textContent = 'Select Range...';
      } else {
        labelEl.textContent = labels[range] || 'Last 7 Days';
      }
    }

    OP.toast.show(`Date range updated: ${labels[range] || range}`, 'success');
  }

  saveNewReport() {
    const nameInput = document.getElementById('report-name-input');
    const categorySelect = document.getElementById('report-category-select');
    const dateRangeSelect = document.getElementById('report-date-range');

    const name = nameInput?.value.trim();
    if (!name) {
      OP.toast.show('Please enter a report name', 'error');
      return;
    }

    const report = {
      name,
      category: categorySelect?.value || 'custom',
      dateRange: dateRangeSelect?.value || '7',
      generatedBy: OP.auth.getSession()?.fullName || 'Alex Morgan',
      generatedByAvatar: 'AM',
      generatedByColor: '#6366f1',
      status: 'completed'
    };

    this.storage.saveReport(report);
    this.renderRecentReports();
    this.closeModal('modal-create-report');

    if (nameInput) nameInput.value = '';

    OP.toast.show('Report created successfully', 'success');
  }

  saveNewSchedule() {
    const reportSelect = document.getElementById('schedule-report-select');
    const frequencySelect = document.getElementById('schedule-frequency');
    const timeInput = document.getElementById('schedule-time');

    const reportMap = {
      'weekly-sales': 'Weekly Sales Report',
      'monthly-customer': 'Monthly Customer Report',
      'team-performance': 'Team Performance Report',
      'messaging-summary': 'Messaging Summary'
    };

    const frequencyMap = {
      'daily': 'Every day',
      'weekly': 'Every week',
      'monthly': 'Every month'
    };

    const newSchedule = {
      id: 's' + Date.now(),
      name: reportMap[reportSelect?.value] || 'New Scheduled Report',
      schedule: `${frequencyMap[frequencySelect?.value] || 'Weekly'} at ${timeInput?.value || '09:00'}`,
      frequency: frequencySelect?.value || 'weekly',
      time: timeInput?.value || '09:00',
      active: true,
      icon: 'ph-chart-bar'
    };

    const schedules = this.storage.getScheduledReports();
    schedules.push(newSchedule);
    localStorage.setItem(REPORTS_STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify(schedules));

    this.renderScheduledReports();
    this.closeModal('modal-schedule');
    OP.toast.show('Report scheduled successfully', 'success');
  }

  handleExport(format) {
    const formats = { pdf: 'PDF', excel: 'Excel', csv: 'CSV' };
    this.storage.addExportHistory({ format, fileName: `report-${Date.now()}.${format}` });
    this.closeModal('modal-export');
    OP.toast.show(`Exporting as ${formats[format]}...`, 'success');

    setTimeout(() => {
      OP.toast.show(`${formats[format]} export complete`, 'success');
    }, 1500);
  }

  openViewReportModal(report) {
    const modal = document.getElementById('modal-view-report');
    const title = document.getElementById('view-report-title');
    const body = document.getElementById('view-report-body');

    if (!modal || !title || !body) return;

    title.textContent = report.name;
    body.innerHTML = `
      <div class="report-detail-view">
        <div class="report-detail-meta">
          <div class="report-detail-item">
            <span class="report-detail-label">Category</span>
            <span class="report-detail-value">${this.formatCategoryName(report.category)}</span>
          </div>
          <div class="report-detail-item">
            <span class="report-detail-label">Generated By</span>
            <span class="report-detail-value">${report.generatedBy}</span>
          </div>
          <div class="report-detail-item">
            <span class="report-detail-label">Generated On</span>
            <span class="report-detail-value">${new Date(report.generatedOn).toLocaleString()}</span>
          </div>
          <div class="report-detail-item">
            <span class="report-detail-label">Status</span>
            <span class="report-detail-value">
              <span class="badge badge-success">${report.status}</span>
            </span>
          </div>
        </div>
        <div class="report-detail-chart-placeholder">
          <div class="chart-placeholder">
            <i class="ph ph-chart-bar"></i>
            <p>Report visualization would render here</p>
          </div>
        </div>
        <div class="report-detail-data">
          <h4>Key Metrics</h4>
          <div class="report-metrics-grid">
            <div class="report-metric-card">
              <span class="report-metric-label">Total Revenue</span>
              <span class="report-metric-value">$124,580</span>
              <span class="report-metric-change up">+18.6%</span>
            </div>
            <div class="report-metric-card">
              <span class="report-metric-label">New Customers</span>
              <span class="report-metric-value">1,248</span>
              <span class="report-metric-change up">+24.3%</span>
            </div>
            <div class="report-metric-card">
              <span class="report-metric-label">Conversion Rate</span>
              <span class="report-metric-value">12.4%</span>
              <span class="report-metric-change up">+8.7%</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.openModal('modal-view-report');
  }

  openExportModal(report) {
    this.openModal('modal-export');
  }

  switchTab(tabName) {
    const tabs = document.querySelectorAll('.reports-tab');
    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabName);
    });
    this.currentTab = tabName;
    this.onTabChange(tabName);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!OP.nav.requireAuth()) return;
  window.reportsApp = new ReportsApp();
});