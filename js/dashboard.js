/**
 * OnePlace Enterprise v3.0 — Dashboard Module
 * Vanilla JavaScript (ES6+)
 */

class DashboardApp {
  constructor() {
    this.storage = new DashboardStorage();
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.sidebarOpen = false;
    this.init();
  }

  init() {
    this.renderSidebar();
    this.renderHeader();
    this.bindEvents();
    this.updateNotifications();
  }

  // ============================================
  // Sidebar Rendering
  // ============================================
  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const userRole = 'Admin';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    let currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'main-dashboard';
    // Handle unified inbox and its sub-pages
    if (currentPage === 'unified-inbox') {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      if (filter) currentPage = filter === 'all' ? 'all-conversations' : filter;
    }

    const unreadCount = this.storage.getConversations('unread').length;

    const navItems = [
      { section: 'Core', items: [
        { id: 'main-dashboard', label: 'Dashboard', icon: 'ph-squares-four', href: 'main-dashboard.html' },
        { id: 'unified-inbox', label: 'Unified Inbox', icon: 'ph-inbox', href: 'unified-inbox.html', badge: unreadCount },
      ]},
      { section: 'Inbox', items: [
        { id: 'all-conversations', label: 'All Conversations', icon: 'ph-chat-circle-text', href: 'unified-inbox.html?filter=all' },
        { id: 'unread', label: 'Unread', icon: 'ph-envelope-open', href: 'unified-inbox.html?filter=unread', badge: unreadCount },
        { id: 'assigned-to-me', label: 'Assigned to Me', icon: 'ph-user-check', href: 'unified-inbox.html?filter=assigned' },
        { id: 'starred', label: 'Starred', icon: 'ph-star', href: 'unified-inbox.html?filter=starred' },
        { id: 'archived', label: 'Archived', icon: 'ph-archive', href: 'unified-inbox.html?filter=archived' },
        { id: 'spam', label: 'Spam', icon: 'ph-warning-circle', href: 'unified-inbox.html?filter=spam' },
        { id: 'trash', label: 'Trash', icon: 'ph-trash', href: 'unified-inbox.html?filter=trash' },
      ]},
      { section: 'Platforms', items: [
        { id: 'gmail', label: 'Gmail', icon: 'ph-envelope-simple', href: '../gmail/index.html', platform: true },
        { id: 'whatsapp', label: 'WhatsApp', icon: 'ph-chat-circle-text', href: '../whatsapp/index.html', platform: true },
        { id: 'instagram', label: 'Instagram', icon: 'ph-camera', href: '../instagram/index.html', platform: true },
        { id: 'tiktok', label: 'TikTok', icon: 'ph-tiktok-logo', href: '../tiktok/index.html', platform: true },
        { id: 'x', label: 'X (Twitter)', icon: 'ph-x-logo', href: '../x/index.html', platform: true },
        { id: 'linkedin', label: 'LinkedIn', icon: 'ph-linkedin-logo', href: '../linkedin/index.html', platform: true },
      ]},
      { section: 'Business', items: [
        { id: 'crm', label: 'CRM', icon: 'ph-users', href: '../crm/index.html' },
        { id: 'calendar', label: 'Calendar', icon: 'ph-calendar', href: '../calendar/index.html' },
        { id: 'tasks', label: 'Tasks', icon: 'ph-check-circle', href: '../tasks/index.html' },
        { id: 'workflow', label: 'Workflow', icon: 'ph-arrows-left-right', href: '../workflow/index.html' },
      ]},
      { section: 'Insights', items: [
        { id: 'ai-assistant', label: 'AI Assistant', icon: 'ph-sparkle', href: '../ai/index.html' },
        { id: 'reports', label: 'Reports', icon: 'ph-chart-bar', href: '../reports/index.html' },
        { id: 'analytics-dashboard', label: 'Analytics', icon: 'ph-chart-line-up', href: 'analytics-dashboard.html' },
      ]},
      { section: 'System', items: [
        { id: 'settings', label: 'Settings', icon: 'ph-gear', href: '../settings/index.html' },
        { id: 'help', label: 'Help Center', icon: 'ph-question', href: '../help/index.html' },
      ]}
    ];

    let html = `
      <div class="sidebar-header">
        <a href="../index.html" class="logo">
          <div class="logo-mark"><i class="ph ph-chat-centered-text"></i></div>
          <div class="logo-text">
            <span class="logo-brand">OnePlace</span>
            <span class="logo-sub">Enterprise</span>
          </div>
        </a>
      </div>
      <nav class="sidebar-nav" aria-label="Dashboard navigation">
    `;

    navItems.forEach(section => {
      html += `<div class="sidebar-section">`;
      html += `<div class="sidebar-section-title">${section.section}</div>`;
      section.items.forEach(item => {
        const isActive = currentPage === item.id || (currentPage === 'main-dashboard' && item.id === 'main-dashboard');
        const activeClass = isActive ? 'active' : '';
        const badgeHtml = item.badge ? `<span class="sidebar-badge ${item.badge > 0 ? 'unread' : ''}">${item.badge}</span>` : '';
        const platformClass = item.platform ? item.id : '';

        html += `
          <a href="${item.href}" class="sidebar-item ${activeClass}" data-page="${item.id}">
            ${item.platform 
              ? `<span class="sidebar-platform-icon ${platformClass}"><i class="ph ${item.icon}"></i></span>`
              : `<i class="ph ${item.icon}"></i>`
            }
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
          <div class="sidebar-user-avatar">${initials}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${userName}</div>
            <div class="sidebar-user-role">${userRole}</div>
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
    const header = document.querySelector('.dashboard-header');
    if (!header) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const unreadCount = this.storage.getConversations('unread').length;

    header.innerHTML = `
      <div class="header-left">
        <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
          <i class="ph ph-list"></i>
        </button>
        <div class="header-search">
          <i class="ph ph-magnifying-glass"></i>
          <input type="text" id="global-search" placeholder="Search conversations, contacts..." autocomplete="off">
        </div>
      </div>
      <div class="header-right">
        <button class="header-btn" id="notifications-btn" aria-label="Notifications">
          <i class="ph ph-bell"></i>
          ${unreadCount > 0 ? '<span class="notification-dot"></span>' : ''}
        </button>
        <button class="header-btn" id="theme-toggle-header" aria-label="Toggle theme">
          <i class="ph ph-moon"></i>
        </button>
        <div class="header-avatar" id="user-menu-btn" title="${userName}">
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
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

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
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value;
        this.handleSearch();
      });
    }

    // Theme toggle in header
    const themeBtn = document.getElementById('theme-toggle-header');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        OP.theme.toggle();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = `<i class="ph ${isDark ? 'ph-sun' : 'ph-moon'}"></i>`;
      });
    }

    // Notifications
    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        OP.toast.show('Notifications panel would open here', 'info');
      });
    }

    // User menu
    const userBtn = document.getElementById('user-menu-btn');
    if (userBtn) {
      userBtn.addEventListener('click', () => {
        if (confirm('Sign out of OnePlace Enterprise?')) {
          OP.auth.signOut();
          window.location.href = '../auth/signin.html';
        }
      });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        if (filter) {
          this.currentFilter = filter;
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.handleFilter();
        }
      });
    });
  }

  handleSearch() {
    // Override in page-specific scripts
    const event = new CustomEvent('dashboard:search', { detail: this.currentSearch });
    document.dispatchEvent(event);
  }

  handleFilter() {
    const event = new CustomEvent('dashboard:filter', { detail: this.currentFilter });
    document.dispatchEvent(event);
  }

  updateNotifications() {
    const unreadCount = this.storage.getConversations('unread').length;
    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      const dot = notifBtn.querySelector('.notification-dot');
      if (unreadCount > 0 && !dot) {
        notifBtn.innerHTML = `<i class="ph ph-bell"></i><span class="notification-dot"></span>`;
      } else if (unreadCount === 0 && dot) {
        dot.remove();
      }
    }
  }

  // ============================================
  // Chart Helpers
  // ============================================
  createDonutChart(containerId, data, totalLabel) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<div class="chart-empty">No chart data available.</div>';
      return;
    }

    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total <= 0) {
      container.innerHTML = '<div class="chart-empty">No chart data available.</div>';
      return;
    }

    let cumulativePercent = 0;
    const segments = [];

    data.forEach((d, i) => {
      const percent = (d.value / total) * 100;
      const startAngle = cumulativePercent * 3.6;
      const endAngle = (cumulativePercent + percent) * 3.6;
      cumulativePercent += percent;

      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      const r = 70;
      const cx = 75;
      const cy = 75;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = percent > 50 ? 1 : 0;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`);
      path.setAttribute('fill', d.color);
      path.setAttribute('stroke', 'white');
      path.setAttribute('stroke-width', '2');
      segments.push(path);
    });

    // Create inner circle for donut effect
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '150');
    svg.setAttribute('height', '150');
    svg.setAttribute('viewBox', '0 0 150 150');
    svg.style.transform = 'rotate(-90deg)';

    segments.forEach(seg => svg.appendChild(seg));

    // Inner circle
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', '75');
    innerCircle.setAttribute('cy', '75');
    innerCircle.setAttribute('r', '45');
    innerCircle.setAttribute('fill', 'var(--gray-0)');
    svg.appendChild(innerCircle);

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'donut-chart-container';
    wrapper.appendChild(svg);

    const centerDiv = document.createElement('div');
    centerDiv.className = 'donut-chart-center';
    centerDiv.innerHTML = `
      <div class="donut-chart-value">${total.toLocaleString()}</div>
      <div class="donut-chart-label">${totalLabel}</div>
    `;
    wrapper.appendChild(centerDiv);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'donut-legend';
    data.forEach(d => {
      const percent = Math.round((d.value / total) * 100);
      legend.innerHTML += `
        <div class="donut-legend-item">
          <span class="donut-legend-dot" style="background: ${d.color}"></span>
          <span class="donut-legend-label">${d.label}</span>
          <span class="donut-legend-value">${percent}%</span>
        </div>
      `;
    });
    wrapper.appendChild(legend);

    container.appendChild(wrapper);
  }

  createLineChart(containerId, data, platforms) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const colors = {
      gmail: '#EA4335',
      whatsapp: '#25D366',
      instagram: '#E4405F',
      tiktok: '#000000',
      x: '#1DA1F2',
      linkedin: '#0A66C2'
    };

    const width = container.clientWidth || 600;
    const height = 200;
    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.flatMap(d => platforms.map(p => d[p] || 0)));

    let svgHtml = `<svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;

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
      svgHtml += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--gray-400)">${d.date}</text>`;
    });

    // Lines
    platforms.forEach(platform => {
      const color = colors[platform];
      let pathD = '';
      data.forEach((d, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartHeight - ((d[platform] || 0) / maxValue) * chartHeight;
        pathD += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
      });
      svgHtml += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`;

      // Dots
      data.forEach((d, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartHeight - ((d[platform] || 0) / maxValue) * chartHeight;
        svgHtml += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" stroke="white" stroke-width="2"/>`;
      });
    });

    svgHtml += '</svg>';
    container.innerHTML = svgHtml;
  }

  createBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const maxValue = Math.max(...data.map(d => d.value));
    let html = '<div class="bar-chart-container">';

    data.forEach(d => {
      const height = (d.value / maxValue) * 100;
      html += `
        <div class="bar-chart-item">
          <div class="bar-chart-bar ${d.platform}" style="height: ${height}%"></div>
          <span class="bar-chart-label">${d.label}</span>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
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

  getPlatformColor(platform) {
    const colors = {
      gmail: '#EA4335',
      whatsapp: '#25D366',
      instagram: '#E4405F',
      tiktok: '#000000',
      x: '#1DA1F2',
      linkedin: '#0A66C2'
    };
    return colors[platform] || '#6366f1';
  }

  getPlatformIcon(platform) {
    const icons = {
      gmail: 'ph-envelope-simple',
      whatsapp: 'ph-chat-circle-text',
      instagram: 'ph-camera',
      tiktok: 'ph-tiktok-logo',
      x: 'ph-x-logo',
      linkedin: 'ph-linkedin-logo'
    };
    return icons[platform] || 'ph-chat';
  }
}

// Initialize dashboard app
window.DashboardApp = DashboardApp;