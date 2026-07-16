/**
 * OnePlace Enterprise v3.0 — Gmail Module
 * Vanilla JavaScript (ES6+)
 */

class GmailApp {
  constructor() {
    this.storage = new GmailStorage();
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.sidebarOpen = false;
    this.currentPage = this.detectCurrentPage();
    this.init();
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
  }

  init() {
    this.renderSidebar();
    this.renderHeader();
    this.bindEvents();
    this.initPageSpecific();
  }

  // ============================================
  // Sidebar Rendering
  // ============================================
  renderSidebar() {
    const sidebar = document.querySelector('.gmail-sidebar');
    if (!sidebar) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const userRole = 'Admin';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const unreadCount = this.storage.getUnreadCount();

    const navItems = [
      { section: 'Gmail', items: [
        { id: 'index', label: 'Gmail Overview', icon: 'ph-chart-line-up', href: 'index.html' },
        { id: 'conversations', label: 'Gmail Conversations', icon: 'ph-chat-circle-text', href: 'conversations.html', badge: unreadCount },
        { id: 'compose', label: 'Compose Email', icon: 'ph-pencil-simple', href: 'compose.html' },
        { id: 'templates', label: 'Email Templates', icon: 'ph-files', href: 'templates.html' },
      ]},
      { section: 'Configuration', items: [
        { id: 'integration', label: 'Gmail Integration', icon: 'ph-plugs-connected', href: 'integration.html' },
        { id: 'settings', label: 'Gmail Settings', icon: 'ph-gear', href: 'settings.html' },
      ]}
    ];

    let html = `
      <div class="gmail-sidebar-header">
        <a href="../index.html" class="logo">
          <div class="logo-mark"><i class="ph ph-chat-centered-text"></i></div>
          <div class="logo-text">
            <span class="logo-brand">OnePlace</span>
            <span class="logo-sub">Enterprise</span>
          </div>
        </a>
      </div>
      <a href="../dashboard/main-dashboard.html" class="gmail-back-link">
        <i class="ph ph-arrow-left"></i>
        <span>Back to Dashboard</span>
      </a>
      <nav class="gmail-sidebar-nav" aria-label="Gmail navigation">
    `;

    navItems.forEach(section => {
      html += `<div class="gmail-sidebar-section">`;
      html += `<div class="gmail-sidebar-section-title">${section.section}</div>`;
      section.items.forEach(item => {
        const isActive = this.currentPage === item.id;
        const activeClass = isActive ? 'active' : '';
        const badgeHtml = item.badge ? `<span class="gmail-sidebar-badge ${item.badge > 0 ? 'unread' : ''}">${item.badge}</span>` : '';

        html += `
          <a href="${item.href}" class="gmail-sidebar-item ${activeClass}" data-page="${item.id}">
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
      <div class="gmail-sidebar-footer">
        <div class="gmail-sidebar-user">
          <div class="gmail-sidebar-user-avatar">${initials}</div>
          <div class="gmail-sidebar-user-info">
            <div class="gmail-sidebar-user-name">${userName}</div>
            <div class="gmail-sidebar-user-role">${userRole}</div>
          </div>
        </div>
      </div>
    `;

    sidebar.innerHTML = html;
  }

  // ============================================
  // Header Rendering
  // ============================================
  renderHeader() {
    const header = document.querySelector('.gmail-header');
    if (!header) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const unreadCount = this.storage.getUnreadCount();

    const pageTitles = {
      'index': { title: 'Gmail Overview', subtitle: 'Monitor your Gmail performance and account health' },
      'conversations': { title: 'Gmail Conversations', subtitle: 'Manage all your Gmail conversations' },
      'compose': { title: 'Compose Email', subtitle: 'Create and send new emails' },
      'details': { title: 'Email Details', subtitle: 'View conversation thread' },
      'templates': { title: 'Email Templates', subtitle: 'Manage your email templates' },
      'integration': { title: 'Gmail Integration', subtitle: 'Connect and manage your Gmail account' },
      'settings': { title: 'Gmail Settings', subtitle: 'Configure your Gmail preferences' }
    };

    const pageInfo = pageTitles[this.currentPage] || pageTitles['index'];

    header.innerHTML = `
      <div class="gmail-header-left">
        <button class="sidebar-toggle" id="gmail-sidebar-toggle" aria-label="Toggle sidebar">
          <i class="ph ph-list"></i>
        </button>
        <div>
          <div class="gmail-header-title">${pageInfo.title}</div>
          <div class="gmail-header-subtitle">${pageInfo.subtitle}</div>
        </div>
      </div>
      <div class="gmail-header-search">
        <i class="ph ph-magnifying-glass"></i>
        <input type="text" id="gmail-search" placeholder="Search emails..." autocomplete="off">
      </div>
      <div class="gmail-header-right">
        <button class="gmail-header-btn" id="gmail-notifications-btn" aria-label="Notifications">
          <i class="ph ph-bell"></i>
          ${unreadCount > 0 ? '<span class="notification-dot"></span>' : ''}
        </button>
        <button class="gmail-header-btn" id="gmail-theme-toggle" aria-label="Toggle theme">
          <i class="ph ph-moon"></i>
        </button>
        <div class="gmail-header-avatar" id="gmail-user-menu" title="${userName}">
          ${initials}
        </div>
      </div>
    `;
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // Sidebar toggle
    const toggleBtn = document.getElementById('gmail-sidebar-toggle');
    const sidebar = document.querySelector('.gmail-sidebar');
    const overlay = document.querySelector('.gmail-sidebar-overlay');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.sidebarOpen = !this.sidebarOpen;
        sidebar?.classList.toggle('open', this.sidebarOpen);
        overlay?.classList.toggle('active', this.sidebarOpen);
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.sidebarOpen = false;
        sidebar?.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Search
    const searchInput = document.getElementById('gmail-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value;
        this.handleSearch();
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('gmail-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        OP.theme.toggle();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = `<i class="ph ${isDark ? 'ph-sun' : 'ph-moon'}"></i>`;
      });
    }

    // Notifications
    const notifBtn = document.getElementById('gmail-notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        OP.toast.show('Notifications panel', 'info');
      });
    }

    // User menu
    const userBtn = document.getElementById('gmail-user-menu');
    if (userBtn) {
      userBtn.addEventListener('click', () => {
        if (confirm('Sign out of OnePlace Enterprise?')) {
          OP.auth.signOut();
          window.location.href = '../auth/signin.html';
        }
      });
    }
  }

  handleSearch() {
    const event = new CustomEvent('gmail:search', { detail: this.currentSearch });
    document.dispatchEvent(event);
  }

  initPageSpecific() {
    switch (this.currentPage) {
      case 'index':
        this.initOverviewPage();
        break;
      case 'conversations':
        this.initConversationsPage();
        break;
      case 'compose':
        this.initComposePage();
        break;
      case 'details':
        this.initDetailsPage();
        break;
      case 'templates':
        this.initTemplatesPage();
        break;
      case 'integration':
        this.initIntegrationPage();
        break;
      case 'settings':
        this.initSettingsPage();
        break;
    }
  }

  // ============================================
  // Overview Page
  // ============================================
  initOverviewPage() {
    this.renderStatsCards();
    this.renderEmailAnalytics();
    this.renderTopCategories();
    this.renderAISuggestions();
    this.renderRecentConversations();
    this.renderGmailActivity();
    this.renderAccountPanel();
  }

  renderStatsCards() {
    const stats = this.storage.getGmailStats();
    const container = document.getElementById('gmail-stats');
    if (!container) return;

    const cards = [
      { 
        icon: 'gmail', 
        iconClass: 'gmail', 
        value: 'alex.morgan@oneplace.com', 
        label: 'Connected Account',
        sublabel: 'View Integration',
        isAccount: true
      },
      { 
        icon: 'ph-envelope', 
        iconClass: 'primary', 
        value: stats.messagesReceived.toLocaleString(), 
        label: 'Messages Received',
        sublabel: 'Today',
        trend: '+12.5%',
        trendUp: true
      },
      { 
        icon: 'ph-paper-plane-right', 
        iconClass: 'success', 
        value: stats.messagesSent.toLocaleString(), 
        label: 'Messages Sent',
        sublabel: 'Today',
        trend: '+8.3%',
        trendUp: true
      },
      { 
        icon: 'ph-chart-line-up', 
        iconClass: 'info', 
        value: stats.responseRate + '%', 
        label: 'Response Rate',
        sublabel: 'Today',
        trend: '+4.7%',
        trendUp: true
      },
      { 
        icon: 'ph-clock', 
        iconClass: 'warning', 
        value: stats.avgResponseTime, 
        label: 'Avg. Response Time',
        sublabel: 'Today',
        trend: '+6.2%',
        trendUp: false
      }
    ];

    let html = '';
    cards.forEach(card => {
      if (card.isAccount) {
        html += `
          <div class="gmail-stat-card">
            <div class="gmail-stat-header">
              <div class="gmail-account-card" style="padding: 0; margin: 0; background: transparent;">
                <div class="gmail-account-avatar"><i class="ph ph-envelope-simple"></i></div>
                <div class="gmail-account-info">
                  <div class="gmail-account-name">${card.value}</div>
                  <div class="gmail-account-email">Connected</div>
                </div>
              </div>
            </div>
            <div class="gmail-stat-sublabel" style="color: var(--primary-600); cursor: pointer;" onclick="window.location.href='integration.html'">${card.sublabel} <i class="ph ph-arrow-right" style="font-size: 10px;"></i></div>
          </div>
        `;
      } else {
        const trendClass = card.trendUp ? 'up' : 'down';
        const trendIcon = card.trendUp ? 'ph-trend-up' : 'ph-trend-down';
        html += `
          <div class="gmail-stat-card">
            <div class="gmail-stat-header">
              <div class="gmail-stat-icon ${card.iconClass}"><i class="ph ${card.icon}"></i></div>
              <span class="gmail-stat-trend ${trendClass}"><i class="ph ${trendIcon}"></i> ${card.trend}</span>
            </div>
            <div class="gmail-stat-value">${card.value}</div>
            <div class="gmail-stat-label">${card.label}</div>
            <div class="gmail-stat-sublabel">${card.sublabel}</div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  }

  renderEmailAnalytics() {
    const container = document.getElementById('gmail-analytics-chart');
    if (!container) return;

    const data = this.storage.getEmailAnalytics();
    const width = container.clientWidth || 500;
    const height = 220;
    const padding = { top: 10, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => Math.max(d.received, d.sent)));

    let svgHtml = `<svg class="gmail-chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxValue * (1 - i / 4));
      svgHtml += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--gray-200)" stroke-dasharray="4" stroke-width="1"/>`;
      svgHtml += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--gray-400)">${val}</text>`;
    }

    // X axis labels
    const stepX = chartWidth / (data.length - 1);
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      svgHtml += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--gray-400)">${d.day}</text>`;
    });

    // Received line (blue)
    let receivedPath = '';
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.received / maxValue) * chartHeight;
      receivedPath += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
    });
    svgHtml += `<path d="${receivedPath}" fill="none" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Sent line (green)
    let sentPath = '';
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.sent / maxValue) * chartHeight;
      sentPath += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
    });
    svgHtml += `<path d="${sentPath}" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Dots for received
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.received / maxValue) * chartHeight;
      svgHtml += `<circle cx="${x}" cy="${y}" r="4" fill="#4F46E5" stroke="white" stroke-width="2"/>`;
    });

    // Dots for sent
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (d.sent / maxValue) * chartHeight;
      svgHtml += `<circle cx="${x}" cy="${y}" r="4" fill="#10B981" stroke="white" stroke-width="2"/>`;
    });

    svgHtml += '</svg>';
    container.innerHTML = svgHtml;
  }

  renderTopCategories() {
    const container = document.getElementById('gmail-categories-chart');
    if (!container) return;

    const data = [
      { label: 'Customer Support', value: 35, color: '#4F46E5' },
      { label: 'Sales', value: 28, color: '#10B981' },
      { label: 'Partnership', value: 18, color: '#F59E0B' },
      { label: 'Billing', value: 10, color: '#EF4444' },
      { label: 'Others', value: 9, color: '#8B5CF6' }
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercent = 0;
    const segments = [];

    // Create SVG donut
    let svgHtml = `<svg width="160" height="160" viewBox="0 0 160 160" style="transform: rotate(-90deg);">`;

    data.forEach((d) => {
      const percent = (d.value / total) * 100;
      const startAngle = cumulativePercent * 3.6;
      const endAngle = (cumulativePercent + percent) * 3.6;
      cumulativePercent += percent;

      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      const r = 70;
      const cx = 80;
      const cy = 80;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = percent > 50 ? 1 : 0;

      svgHtml += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${d.color}" stroke="white" stroke-width="2"/>`;
    });

    // Inner circle
    svgHtml += `<circle cx="80" cy="80" r="50" fill="var(--gray-0)"/>`;
    svgHtml += `<text x="80" y="75" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--gray-900)" transform="rotate(90 80 80)">${total}</text>`;
    svgHtml += `<text x="80" y="90" text-anchor="middle" font-size="10" fill="var(--gray-500)" transform="rotate(90 80 80)">Total</text>`;
    svgHtml += '</svg>';

    let legendHtml = '<div class="gmail-donut-legend">';
    data.forEach(d => {
      legendHtml += `
        <div class="gmail-donut-legend-item">
          <span class="gmail-donut-legend-dot" style="background: ${d.color}"></span>
          <span class="gmail-donut-legend-label">${d.label}</span>
          <span class="gmail-donut-legend-value">${d.value}%</span>
        </div>
      `;
    });
    legendHtml += '</div>';

    container.innerHTML = `
      <div class="gmail-donut-container">
        <div class="gmail-donut-chart">${svgHtml}</div>
        ${legendHtml}
      </div>
    `;
  }

  renderAISuggestions() {
    const container = document.getElementById('gmail-ai-suggestions');
    if (!container) return;

    const suggestions = this.storage.getAISuggestions();

    let html = '';
    suggestions.forEach(s => {
      const iconMap = {
        'high_priority': 'ph-warning',
        'smart_reply': 'ph-lightning',
        'follow_up': 'ph-clock-counter-clockwise',
        'summary': 'ph-sparkle'
      };
      const icon = iconMap[s.type] || 'ph-sparkle';

      html += `
        <div class="gmail-ai-item priority-${s.priority}">
          <div class="gmail-ai-icon priority-${s.priority}"><i class="ph ${icon}"></i></div>
          <div class="gmail-ai-content">
            <div class="gmail-ai-title">${s.title}</div>
            <div class="gmail-ai-text">${s.message}</div>
          </div>
          <span class="gmail-ai-count">${s.count}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderRecentConversations() {
    const container = document.getElementById('gmail-recent-conversations');
    if (!container) return;

    const conversations = this.storage.getConversations('gmail').slice(0, 5);

    let html = '';
    conversations.forEach(conv => {
      const timeAgo = this.formatTimeAgo(conv.timestamp);
      const unreadClass = conv.unread ? 'unread' : '';
      const nameClass = conv.unread ? 'unread' : '';

      html += `
        <a href="details.html?id=${conv.id}" class="gmail-conversation-item ${unreadClass}">
          <div class="gmail-conversation-avatar" style="background: ${conv.customer.color}">${conv.customer.avatar}</div>
          <div class="gmail-conversation-content">
            <div class="gmail-conversation-name ${nameClass}">${conv.customer.name}</div>
            <div class="gmail-conversation-preview">${conv.message}</div>
          </div>
          <div class="gmail-conversation-meta">
            <span class="gmail-conversation-time">${timeAgo}</span>
            <span class="gmail-conversation-status ${conv.status}"></span>
          </div>
        </a>
      `;
    });

    container.innerHTML = html;
  }

  renderGmailActivity() {
    const container = document.getElementById('gmail-activity');
    if (!container) return;

    const activities = this.storage.getGmailActivity().slice(0, 6);

    let html = '';
    activities.forEach(act => {
      const timeAgo = this.formatTimeAgo(act.timestamp);
      const iconMap = {
        'received': 'ph-arrow-down-left',
        'sent': 'ph-arrow-up-right',
        'archived': 'ph-archive-box'
      };
      const iconClass = act.type;

      html += `
        <div class="gmail-activity-item">
          <div class="gmail-activity-icon ${iconClass}"><i class="ph ${iconMap[act.type] || 'ph-envelope'}"></i></div>
          <div class="gmail-activity-content">
            <div class="gmail-activity-title"><strong>${act.title}</strong></div>
            <div class="gmail-activity-desc">${act.description}</div>
          </div>
          <span class="gmail-activity-time">${timeAgo}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderAccountPanel() {
    const container = document.getElementById('gmail-account-panel');
    if (!container) return;

    const stats = this.storage.getGmailStats();

    container.innerHTML = `
      <div class="gmail-account-panel">
        <div class="gmail-account-panel-header">
          <div class="gmail-account-panel-avatar"><i class="ph ph-envelope-simple"></i></div>
          <div class="gmail-account-panel-info">
            <div class="gmail-account-panel-name">Gmail Account</div>
            <div class="gmail-account-panel-email">alex.morgan@oneplace.com</div>
          </div>
          <span class="gmail-account-panel-status">Connected</span>
        </div>

        <div class="gmail-sync-status">
          <div class="gmail-sync-label">Sync Status</div>
          <div class="gmail-sync-bar">
            <div class="gmail-sync-bar-fill" style="width: 100%"></div>
          </div>
          <div class="gmail-sync-meta">
            <span>Last synced: 2 min ago</span>
            <span>100%</span>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top: var(--space-2);">Sync Now</button>
        </div>

        <div class="gmail-widget" style="margin-top: var(--space-4);">
          <div class="gmail-widget-header">
            <span class="gmail-widget-title">Account Health</span>
          </div>
          <div class="gmail-widget-body">
            <div class="gmail-health-item">
              <div class="gmail-health-icon excellent"><i class="ph ph-check-circle"></i></div>
              <div class="gmail-health-info">
                <div class="gmail-health-label">Status</div>
                <div class="gmail-health-value excellent">Excellent</div>
              </div>
            </div>
            <div class="gmail-health-item">
              <div class="gmail-health-icon good"><i class="ph ph-shield-check"></i></div>
              <div class="gmail-health-info">
                <div class="gmail-health-label">Security</div>
                <div class="gmail-health-value good">No issues detected</div>
              </div>
            </div>
          </div>
        </div>

        <div class="gmail-widget" style="margin-top: var(--space-4);">
          <div class="gmail-widget-header">
            <span class="gmail-widget-title">CRM Overview</span>
          </div>
          <div class="gmail-widget-body">
            <div class="gmail-crm-item">
              <div class="gmail-crm-avatar" style="background: #6366f1;">SB</div>
              <div class="gmail-crm-info">
                <div class="gmail-crm-name">Sophia Bennett</div>
                <div class="gmail-crm-role">Active Subscriber</div>
              </div>
              <span class="gmail-crm-action">View Profile</span>
            </div>
            <div class="gmail-crm-item">
              <div class="gmail-crm-avatar" style="background: #f97316;">DM</div>
              <div class="gmail-crm-info">
                <div class="gmail-crm-name">David Miller</div>
                <div class="gmail-crm-role">3 Active Deals</div>
              </div>
              <span class="gmail-crm-action">View Deals</span>
            </div>
          </div>
        </div>

        <div class="gmail-widget" style="margin-top: var(--space-4);">
          <div class="gmail-widget-header">
            <span class="gmail-widget-title">Recent Activity</span>
          </div>
          <div class="gmail-widget-body">
            <div class="gmail-recent-activity-item">
              <div class="gmail-recent-activity-icon email"><i class="ph ph-envelope"></i></div>
              <div class="gmail-recent-activity-content">
                <div class="gmail-recent-activity-text">New email from <strong>Sophia Bennett</strong></div>
              </div>
              <span class="gmail-recent-activity-time">10:24 AM</span>
            </div>
            <div class="gmail-recent-activity-item">
              <div class="gmail-recent-activity-icon reply"><i class="ph ph-arrow-u-up-left"></i></div>
              <div class="gmail-recent-activity-content">
                <div class="gmail-recent-activity-text">Replied to <strong>Michael Thompson</strong></div>
              </div>
              <span class="gmail-recent-activity-time">9:41 AM</span>
            </div>
            <div class="gmail-recent-activity-item">
              <div class="gmail-recent-activity-icon archive"><i class="ph ph-archive-box"></i></div>
              <div class="gmail-recent-activity-content">
                <div class="gmail-recent-activity-text">Email archived from <strong>Olivia Parker</strong></div>
              </div>
              <span class="gmail-recent-activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // Conversations Page
  // ============================================
  initConversationsPage() {
    this.renderConversationsList();
    this.renderConversationDetail();

    document.addEventListener('gmail:search', () => {
      this.renderConversationsList();
    });
  }

  renderConversationsList() {
    const container = document.getElementById('gmail-conversations-list-items');
    if (!container) return;

    const conversations = this.storage.getConversations('gmail', this.currentSearch);

    let html = '';
    conversations.forEach(conv => {
      const timeAgo = this.formatTimeAgo(conv.timestamp);
      const unreadClass = conv.unread ? 'unread' : '';
      const nameClass = conv.unread ? 'unread' : '';

      html += `
        <a href="details.html?id=${conv.id}" class="gmail-conversation-row ${unreadClass}">
          <div class="gmail-conversation-row-avatar" style="background: ${conv.customer.color}">${conv.customer.avatar}</div>
          <div class="gmail-conversation-row-content">
            <div class="gmail-conversation-row-name ${nameClass}">${conv.customer.name}</div>
            <div class="gmail-conversation-row-preview">${conv.message}</div>
          </div>
          <div class="gmail-conversation-row-meta">
            <span class="gmail-conversation-row-time">${timeAgo}</span>
            ${conv.unread ? `<span class="gmail-conversation-row-badge unread">${conv.unreadMessages || 1}</span>` : ''}
          </div>
        </a>
      `;
    });

    container.innerHTML = html;
  }

  renderConversationDetail() {
    const container = document.getElementById('gmail-conversation-detail');
    if (!container) return;

    // Default empty state
    container.innerHTML = `
      <div class="empty-state" style="height: 100%; justify-content: center;">
        <div class="empty-state-icon"><i class="ph ph-envelope"></i></div>
        <div class="empty-state-title">Select a conversation</div>
        <div class="empty-state-desc">Choose an email from the list to view details</div>
      </div>
    `;
  }

  // ============================================
  // Compose Page
  // ============================================
  initComposePage() {
    const form = document.getElementById('gmail-compose-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const to = document.getElementById('compose-to').value;
      const subject = document.getElementById('compose-subject').value;
      const body = document.getElementById('compose-body').innerHTML;

      if (!to || !subject) {
        OP.toast.show('Please fill in all required fields', 'error');
        return;
      }

      this.storage.saveDraft({ to, subject, body, timestamp: new Date().toISOString() });
      OP.toast.show('Email sent successfully!', 'success');

      setTimeout(() => {
        window.location.href = 'conversations.html';
      }, 1500);
    });

    // Toolbar buttons
    document.querySelectorAll('.gmail-compose-toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const command = btn.dataset.command;
        if (command) {
          document.execCommand(command, false, null);
          btn.classList.toggle('active');
        }
      });
    });

    // Schedule send
    const scheduleBtn = document.getElementById('schedule-send-btn');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        const date = prompt('Enter date and time (e.g., 2024-12-25 09:00):');
        if (date) {
          OP.toast.show(`Email scheduled for ${date}`, 'success');
        }
      });
    }

    // Save draft
    const draftBtn = document.getElementById('save-draft-btn');
    if (draftBtn) {
      draftBtn.addEventListener('click', () => {
        const to = document.getElementById('compose-to').value;
        const subject = document.getElementById('compose-subject').value;
        const body = document.getElementById('compose-body').innerHTML;
        this.storage.saveDraft({ to, subject, body, timestamp: new Date().toISOString() });
        OP.toast.show('Draft saved', 'success');
      });
    }
  }

  // ============================================
  // Details Page
  // ============================================
  initDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
      window.location.href = 'conversations.html';
      return;
    }

    const conv = this.storage.getConversationById(id);
    if (!conv) {
      window.location.href = 'conversations.html';
      return;
    }

    this.renderEmailDetails(conv);
    this.bindDetailsEvents(id);
  }

  renderEmailDetails(conv) {
    const container = document.getElementById('gmail-email-details');
    if (!container) return;

    const timeAgo = this.formatTimeAgo(conv.timestamp);

    let tagsHtml = '';
    if (conv.tags && conv.tags.length > 0) {
      tagsHtml = `<div class="gmail-message-tags">`;
      conv.tags.forEach(tag => {
        const tagClass = tag.toLowerCase().replace(' ', '-');
        tagsHtml += `<span class="gmail-message-tag ${tagClass}">${tag}</span>`;
      });
      tagsHtml += `</div>`;
    }

    container.innerHTML = `
      <div class="gmail-thread">
        <div class="gmail-thread-header">
          <div class="gmail-thread-subject">${conv.message}</div>
          <div class="gmail-thread-actions">
            <button class="gmail-thread-action-btn" title="Reply"><i class="ph ph-arrow-u-up-left"></i></button>
            <button class="gmail-thread-action-btn" title="Forward"><i class="ph ph-share-fat"></i></button>
            <button class="gmail-thread-action-btn" title="Archive" id="archive-btn"><i class="ph ph-archive-box"></i></button>
            <button class="gmail-thread-action-btn" title="Delete" id="delete-btn"><i class="ph ph-trash"></i></button>
          </div>
        </div>
        <div class="gmail-message">
          <div class="gmail-message-header">
            <div class="gmail-message-sender">
              <div class="gmail-message-sender-avatar" style="background: ${conv.customer.color}">${conv.customer.avatar}</div>
              <div class="gmail-message-sender-info">
                <div class="gmail-message-sender-name">${conv.customer.name}</div>
                <div class="gmail-message-sender-email">${conv.customer.email}</div>
              </div>
            </div>
            <span class="gmail-message-time">${timeAgo}</span>
          </div>
          <div class="gmail-message-body">
            <p>Hi there,</p>
            <p>${conv.message}</p>
            <p>Let me know if you need any further information.</p>
            <p>Best regards,<br>${conv.customer.name}</p>
          </div>
          ${tagsHtml}
        </div>
        <div class="gmail-reply-box">
          <textarea class="gmail-reply-textarea" placeholder="Write a reply..."></textarea>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: var(--space-2);">
              <button class="btn btn-primary btn-sm" id="send-reply-btn"><i class="ph ph-paper-plane-right"></i> Send</button>
              <button class="btn btn-ghost btn-sm"><i class="ph ph-paperclip"></i></button>
            </div>
            <button class="btn btn-ghost btn-sm" id="ai-suggest-btn"><i class="ph ph-sparkle"></i> AI Suggest</button>
          </div>
        </div>
      </div>
    `;
  }

  bindDetailsEvents(id) {
    const archiveBtn = document.getElementById('archive-btn');
    if (archiveBtn) {
      archiveBtn.addEventListener('click', () => {
        this.storage.archiveConversation(id);
        OP.toast.show('Conversation archived', 'success');
        setTimeout(() => window.location.href = 'conversations.html', 1000);
      });
    }

    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this conversation?')) {
          this.storage.deleteConversation(id);
          OP.toast.show('Conversation moved to trash', 'success');
          setTimeout(() => window.location.href = 'conversations.html', 1000);
        }
      });
    }

    const sendReplyBtn = document.getElementById('send-reply-btn');
    if (sendReplyBtn) {
      sendReplyBtn.addEventListener('click', () => {
        const textarea = document.querySelector('.gmail-reply-textarea');
        if (textarea && textarea.value.trim()) {
          OP.toast.show('Reply sent successfully', 'success');
          textarea.value = '';
        } else {
          OP.toast.show('Please write a reply first', 'error');
        }
      });
    }

    const aiSuggestBtn = document.getElementById('ai-suggest-btn');
    if (aiSuggestBtn) {
      aiSuggestBtn.addEventListener('click', () => {
        const textarea = document.querySelector('.gmail-reply-textarea');
        if (textarea) {
          textarea.value = "Thank you for reaching out! I'd be happy to help you with this. Let me look into it and get back to you shortly.";
          OP.toast.show('AI suggestion applied', 'success');
        }
      });
    }
  }

  // ============================================
  // Templates Page
  // ============================================
  initTemplatesPage() {
    this.renderTemplates();

    const newTemplateBtn = document.getElementById('new-template-btn');
    if (newTemplateBtn) {
      newTemplateBtn.addEventListener('click', () => {
        const name = prompt('Template name:');
        if (name) {
          this.storage.addTemplate({
            name,
            category: 'Custom',
            content: 'Start writing your template...',
            createdAt: new Date().toISOString()
          });
          OP.toast.show('Template created', 'success');
          this.renderTemplates();
        }
      });
    }
  }

  renderTemplates() {
    const container = document.getElementById('gmail-templates-grid');
    if (!container) return;

    const templates = this.storage.getTemplates();

    let html = '';
    templates.forEach(template => {
      html += `
        <div class="gmail-template-card">
          <div class="gmail-template-card-header">
            <span class="gmail-template-card-title">${template.name}</span>
            <span class="gmail-template-card-badge">${template.category}</span>
          </div>
          <div class="gmail-template-card-preview">${template.content}</div>
          <div class="gmail-template-card-footer">
            <span class="gmail-template-card-meta">Last edited ${this.formatTimeAgo(template.updatedAt || template.createdAt)}</span>
            <button class="btn btn-primary btn-sm" onclick="window.location.href='compose.html?template=${template.id}'">Use Template</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ============================================
  // Integration Page
  // ============================================
  initIntegrationPage() {
    const toggle = document.getElementById('gmail-integration-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        const isActive = toggle.classList.contains('active');
        OP.toast.show(isActive ? 'Gmail integration connected' : 'Gmail integration disconnected', 'success');
      });
    }

    const syncBtn = document.getElementById('sync-now-btn');
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        OP.toast.show('Syncing Gmail...', 'info');
        setTimeout(() => {
          OP.toast.show('Sync completed successfully', 'success');
        }, 2000);
      });
    }
  }

  // ============================================
  // Settings Page
  // ============================================
  initSettingsPage() {
    // Tab switching
    document.querySelectorAll('.gmail-settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        document.querySelectorAll('.gmail-settings-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.gmail-settings-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`panel-${target}`)?.classList.add('active');
      });
    });

    // Toggle switches
    document.querySelectorAll('.gmail-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
    });

    // Save settings
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        OP.toast.show('Settings saved successfully', 'success');
      });
    }
  }

  // ============================================
  // Utility
  // ============================================
  formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// ============================================
// Gmail Storage
// ============================================
class GmailStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('gmail_stats')) {
      this.seedGmailData();
    }
    if (!localStorage.getItem('gmail_templates')) {
      this.seedTemplates();
    }
    if (!localStorage.getItem('gmail_activity')) {
      this.seedActivity();
    }
  }

  seedGmailData() {
    const stats = {
      messagesReceived: 1243,
      messagesSent: 842,
      responseRate: 94.6,
      avgResponseTime: '18m 32s',
      unreadCount: 8
    };
    localStorage.setItem('gmail_stats', JSON.stringify(stats));
  }

  seedTemplates() {
    const templates = [
      { id: 't1', name: 'Sales Follow Up', category: 'Sales', content: 'Hi {{name}},\n\nThank you for your interest in our product. I wanted to follow up on our previous conversation...\n\nBest regards,\n{{sender}}', createdAt: new Date().toISOString() },
      { id: 't2', name: 'Welcome Email', category: 'Onboarding', content: 'Welcome to OnePlace!\n\nWe\'re excited to have you on board. Here\'s how to get started...\n\nCheers,\nThe OnePlace Team', createdAt: new Date().toISOString() },
      { id: 't3', name: 'Product Demo Invite', category: 'Sales', content: 'Hi {{name}},\n\nI\'d love to show you a personalized demo of our platform. Would you be available for a 30-minute call?\n\nBest,\n{{sender}}', createdAt: new Date().toISOString() },
      { id: 't4', name: 'Support Response', category: 'Support', content: 'Hi {{name}},\n\nThank you for contacting support. We\'ve received your request and are working on it...\n\nRegards,\nSupport Team', createdAt: new Date().toISOString() },
      { id: 't5', name: 'Thank You Email', category: 'General', content: 'Hi {{name}},\n\nThank you for your time today. It was great speaking with you...\n\nBest,\n{{sender}}', createdAt: new Date().toISOString() },
      { id: 't6', name: 'Support Response', category: 'Support', content: 'Hi {{name}},\n\nWe have resolved your issue. Please let us know if you need any further assistance...\n\nRegards,\nSupport Team', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem('gmail_templates', JSON.stringify(templates));
  }

  seedActivity() {
    const activities = [
      { id: 'a1', type: 'received', title: 'Email received from Sophia Bennett', description: 'Partnership Discussion', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
      { id: 'a2', type: 'sent', title: 'Email sent to Michael Thompson', description: 'Project Update', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
      { id: 'a3', type: 'received', title: 'Email received from Olivia Parker', description: 'Invoice for Services', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
      { id: 'a4', type: 'archived', title: 'Email archived', description: 'Old Newsletter', timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
      { id: 'a5', type: 'sent', title: 'Email sent to Daniel Martinez', description: 'Re: Quick Question', timestamp: new Date(Date.now() - 8 * 3600000).toISOString() }
    ];
    localStorage.setItem('gmail_activity', JSON.stringify(activities));
  }

  getGmailStats() {
    return JSON.parse(localStorage.getItem('gmail_stats') || '{}');
  }

  getEmailAnalytics() {
    return [
      { day: 'Mon', received: 120, sent: 85 },
      { day: 'Tue', received: 145, sent: 98 },
      { day: 'Wed', received: 180, sent: 120 },
      { day: 'Thu', received: 165, sent: 110 },
      { day: 'Fri', received: 140, sent: 95 },
      { day: 'Sat', received: 90, sent: 60 },
      { day: 'Sun', received: 80, sent: 55 }
    ];
  }

  getAISuggestions() {
    return [
      { id: 'ai1', type: 'high_priority', title: 'High Priority', message: '3 emails need immediate attention', priority: 'high', count: 3 },
      { id: 'ai2', type: 'smart_reply', title: 'Smart Reply', message: '12 emails can be replied using AI', priority: 'medium', count: 12 },
      { id: 'ai3', type: 'follow_up', title: 'Follow Up', message: '8 conversations need follow up', priority: 'medium', count: 8 },
      { id: 'ai4', type: 'summary', title: 'Summary', message: 'Daily email summary is ready', priority: 'low', count: 1 }
    ];
  }

  getGmailActivity() {
    return JSON.parse(localStorage.getItem('gmail_activity') || '[]');
  }

  getConversations(platform = 'gmail', search = '') {
    // Use dashboard storage for conversations
    const ds = new DashboardStorage();
    let convs = ds.getConversations('gmail', search);
    return convs;
  }

  getConversationById(id) {
    const ds = new DashboardStorage();
    return ds.getConversationById(id);
  }

  getUnreadCount() {
    const ds = new DashboardStorage();
    return ds.getConversations('unread').filter(c => c.platform === 'gmail').length;
  }

  getTemplates() {
    return JSON.parse(localStorage.getItem('gmail_templates') || '[]');
  }

  addTemplate(template) {
    const templates = this.getTemplates();
    template.id = `t_${Date.now()}`;
    templates.push(template);
    localStorage.setItem('gmail_templates', JSON.stringify(templates));
  }

  saveDraft(draft) {
    const drafts = JSON.parse(localStorage.getItem('gmail_drafts') || '[]');
    drafts.push({ ...draft, id: `draft_${Date.now()}` });
    localStorage.setItem('gmail_drafts', JSON.stringify(drafts));
  }

  archiveConversation(id) {
    const ds = new DashboardStorage();
    ds.archiveConversation(id);
  }

  deleteConversation(id) {
    const ds = new DashboardStorage();
    ds.deleteConversation(id);
  }
}

// Initialize Gmail app
window.GmailApp = GmailApp;
window.GmailStorage = GmailStorage;