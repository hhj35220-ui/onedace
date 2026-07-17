/**
 * OnePlace Enterprise v3.0 — CRM Module
 * Vanilla JavaScript (ES6+)
 */

const CRM_STORAGE_KEYS = {
  CRM_DATA: 'op_crm_data',
  CRM_SETTINGS: 'op_crm_settings',
  CRM_LEADS: 'op_crm_leads',
  CRM_CONTACTS: 'op_crm_contacts',
  CRM_COMPANIES: 'op_crm_companies',
  CRM_DEALS: 'op_crm_deals',
  CRM_OPPORTUNITIES: 'op_crm_opportunities'
};

// ============================================
// Sample Data
// ============================================

const SAMPLE_LEADS = [
  { id: 'l1', name: 'Tech Solutions Inc.', source: 'Website', status: 'new', created: 'May 28, 2024', owner: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0A66C2&color=fff&size=64' },
  { id: 'l2', name: 'Growth Marketing Co.', source: 'Referral', status: 'contacted', created: 'May 28, 2024', owner: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Growth+Marketing&background=22c55e&color=fff&size=64' },
  { id: 'l3', name: 'InnovateTech Systems', source: 'LinkedIn', status: 'qualified', created: 'May 27, 2024', owner: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=InnovateTech&background=f97316&color=fff&size=64' },
  { id: 'l4', name: 'Bright Future Ltd.', source: 'Email Campaign', status: 'new', created: 'May 27, 2024', owner: 'Olivia Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Bright+Future&background=8b5cf6&color=fff&size=64' },
  { id: 'l5', name: 'NextGen Apps', source: 'Website', status: 'contacted', created: 'May 26, 2024', owner: 'James Wilson', avatar: 'https://ui-avatars.com/api/?name=NextGen+Apps&background=ec4899&color=fff&size=64' },
  { id: 'l6', name: 'Digital Dynamics', source: 'Referral', status: 'converted', created: 'May 26, 2024', owner: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Digital+Dynamics&background=06b6d4&color=fff&size=64' },
  { id: 'l7', name: 'CloudTech Solutions', source: 'LinkedIn', status: 'new', created: 'May 25, 2024', owner: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=CloudTech&background=eab308&color=fff&size=64' },
  { id: 'l8', name: 'Smart Marketing', source: 'Website', status: 'qualified', created: 'May 25, 2024', owner: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=Smart+Marketing&background=f43f5e&color=fff&size=64' }
];

const SAMPLE_CONTACTS = [
  { id: 'c1', name: 'John Smith', company: 'Tech Solutions Inc.', email: 'john.smith@techsolutions.com', owner: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=6366f1&color=fff&size=64' },
  { id: 'c2', name: 'Sarah Johnson', company: 'Growth Marketing Co.', email: 'sarah.j@growthmarketing.com', owner: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=22c55e&color=fff&size=64' },
  { id: 'c3', name: 'Michael Brown', company: 'InnovateTech Systems', email: 'm.brown@innovatetech.com', owner: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=f97316&color=fff&size=64' },
  { id: 'c4', name: 'Emily Davis', company: 'Bright Future Ltd.', email: 'emily@brightfuture.com', owner: 'Olivia Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=8b5cf6&color=fff&size=64' },
  { id: 'c5', name: 'David Wilson', company: 'NextGen Apps', email: 'david@nextgenapps.com', owner: 'James Wilson', avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=ec4899&color=fff&size=64' },
  { id: 'c6', name: 'Lisa Anderson', company: 'Digital Dynamics', email: 'lisa@digitaldynamics.com', owner: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=06b6d4&color=fff&size=64' },
  { id: 'c7', name: 'Robert Taylor', company: 'CloudTech Solutions', email: 'robert@cloudtech.com', owner: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=eab308&color=fff&size=64' },
  { id: 'c8', name: 'Jennifer Martinez', company: 'Smart Marketing', email: 'jen@smartmarketing.com', owner: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=Jennifer+Martinez&background=f43f5e&color=fff&size=64' }
];

const SAMPLE_COMPANIES = [
  { id: 'co1', name: 'Tech Solutions Inc.', industry: 'Technology', contacts: 12, deals: 5, owner: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0A66C2&color=fff&size=64' },
  { id: 'co2', name: 'Growth Marketing Co.', industry: 'Marketing', contacts: 8, deals: 3, owner: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Growth+Marketing&background=22c55e&color=fff&size=64' },
  { id: 'co3', name: 'InnovateTech Systems', industry: 'Software', contacts: 15, deals: 4, owner: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=InnovateTech&background=f97316&color=fff&size=64' },
  { id: 'co4', name: 'Bright Future Ltd.', industry: 'Consulting', contacts: 6, deals: 2, owner: 'Olivia Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Bright+Future&background=8b5cf6&color=fff&size=64' },
  { id: 'co5', name: 'NextGen Apps', industry: 'Technology', contacts: 10, deals: 3, owner: 'James Wilson', avatar: 'https://ui-avatars.com/api/?name=NextGen+Apps&background=ec4899&color=fff&size=64' },
  { id: 'co6', name: 'Digital Dynamics', industry: 'IT Services', contacts: 7, deals: 2, owner: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Digital+Dynamics&background=06b6d4&color=fff&size=64' },
  { id: 'co7', name: 'CloudTech Solutions', industry: 'Cloud Services', contacts: 9, deals: 4, owner: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=CloudTech&background=eab308&color=fff&size=64' },
  { id: 'co8', name: 'Smart Marketing', industry: 'Advertising', contacts: 5, deals: 1, owner: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=Smart+Marketing&background=f43f5e&color=fff&size=64' }
];

const SAMPLE_DEALS = [
  { id: 'd1', name: 'Tech Solutions Inc. - Enterprise Deal', company: 'Tech Solutions Inc.', value: '$45,000', stage: 'negotiation', probability: '75%', closeDate: 'Jun 15, 2024', owner: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0A66C2&color=fff&size=64' },
  { id: 'd2', name: 'Global Corp - Annual Contract', company: 'Global Corp', value: '$32,500', stage: 'proposal', probability: '60%', closeDate: 'Jun 20, 2024', owner: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Global+Corp&background=22c55e&color=fff&size=64' },
  { id: 'd3', name: 'InnovateTech - Platform License', company: 'InnovateTech Systems', value: '$28,750', stage: 'negotiation', probability: '80%', closeDate: 'Jun 10, 2024', owner: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=InnovateTech&background=f97316&color=fff&size=64' },
  { id: 'd4', name: 'Bright Future - Consulting Project', company: 'Bright Future Ltd.', value: '$18,600', stage: 'contact', probability: '40%', closeDate: 'Jul 1, 2024', owner: 'Olivia Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Bright+Future&background=8b5cf6&color=fff&size=64' },
  { id: 'd5', name: 'NextGen - Mobile App Development', company: 'NextGen Apps', value: '$15,000', stage: 'proposal', probability: '55%', closeDate: 'Jun 25, 2024', owner: 'James Wilson', avatar: 'https://ui-avatars.com/api/?name=NextGen+Apps&background=ec4899&color=fff&size=64' }
];

const SAMPLE_OPPORTUNITIES = [
  { id: 'o1', name: 'Enterprise Software License', company: 'Tech Solutions Inc.', value: '$45,000', stage: 'Negotiation', probability: '75%', closeDate: 'Jun 15, 2024', owner: 'Alex Morgan' },
  { id: 'o2', name: 'Annual Support Contract', company: 'Global Corp', value: '$32,500', stage: 'Proposal Sent', probability: '60%', closeDate: 'Jun 20, 2024', owner: 'Sophia Martinez' },
  { id: 'o3', name: 'Platform Integration', company: 'InnovateTech Systems', value: '$28,750', stage: 'Negotiation', probability: '80%', closeDate: 'Jun 10, 2024', owner: 'Daniel Harris' },
  { id: 'o4', name: 'Consulting Engagement', company: 'Bright Future Ltd.', value: '$18,600', stage: 'Contact Made', probability: '40%', closeDate: 'Jul 1, 2024', owner: 'Olivia Rodriguez' },
  { id: 'o5', name: 'Mobile Development Project', company: 'NextGen Apps', value: '$15,000', stage: 'Proposal Sent', probability: '55%', closeDate: 'Jun 25, 2024', owner: 'James Wilson' },
  { id: 'o6', name: 'Cloud Migration', company: 'CloudTech Solutions', value: '$52,000', stage: 'New Lead', probability: '20%', closeDate: 'Aug 15, 2024', owner: 'Daniel Harris' }
];

const TOP_SALES = [
  { name: 'Alex Morgan', avatar: 'https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff&size=64', value: '$28,450', trend: '+18.2%' },
  { name: 'Sophia Martinez', avatar: 'https://ui-avatars.com/api/?name=Sophia+Martinez&background=ec4899&color=fff&size=64', value: '$22,180', trend: '+15.7%' },
  { name: 'Daniel Harris', avatar: 'https://ui-avatars.com/api/?name=Daniel+Harris&background=f97316&color=fff&size=64', value: '$18,920', trend: '+12.5%' },
  { name: 'James Wilson', avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=22c55e&color=fff&size=64', value: '$16,340', trend: '+10.3%' },
  { name: 'Olivia Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Olivia+Rodriguez&background=8b5cf6&color=fff&size=64', value: '$12,860', trend: '+8.1%' }
];

const TASKS_OVERVIEW = [
  { name: 'Follow Ups', icon: 'ph-arrow-u-up-left', type: 'follow-up', count: 24, color: '#0A66C2' },
  { name: 'Calls', icon: 'ph-phone', type: 'call', count: 18, color: '#22c55e' },
  { name: 'Meetings', icon: 'ph-calendar', type: 'meeting', count: 8, color: '#f97316' },
  { name: 'Emails', icon: 'ph-envelope', type: 'email', count: 34, color: '#6366f1' },
  { name: 'Overdue Tasks', icon: 'ph-warning', type: 'overdue', count: 5, color: '#ef4444' }
];

const LEAD_SOURCES = [
  { label: 'Website', value: 40, color: '#6366f1' },
  { label: 'Social Media', value: 25, color: '#8b5cf6' },
  { label: 'Referral', value: 18, color: '#ec4899' },
  { label: 'Email Campaign', value: 10, color: '#f43f5e' },
  { label: 'Other', value: 7, color: '#9ca3af' }
];

const PIPELINE_STAGES = [
  { name: 'New Lead', count: 1248, percent: 100, color: '#6366f1', width: 200 },
  { name: 'Contact Made', count: 986, percent: 79.2, color: '#8b5cf6', width: 170 },
  { name: 'Proposal Sent', count: 642, percent: 51.4, color: '#ec4899', width: 140 },
  { name: 'Negotiation', count: 312, percent: 25.0, color: '#f43f5e', width: 110 },
  { name: 'Won', count: 68, percent: 5.4, color: '#22c55e', width: 80 }
];

const DEALS_BY_STAGE = [
  { label: 'New Lead', value: 1248, percent: 40.0, color: '#6366f1' },
  { label: 'Contact Made', value: 986, percent: 31.6, color: '#8b5cf6' },
  { label: 'Proposal Sent', value: 642, percent: 20.5, color: '#ec4899' },
  { label: 'Negotiation', value: 312, percent: 10.0, color: '#f43f5e' },
  { label: 'Won', value: 68, percent: 2.2, color: '#22c55e' }
];

// ============================================
// CRM Storage
// ============================================

class CRMStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(CRM_STORAGE_KEYS.CRM_DATA)) {
      this.seedData();
    }
  }

  seedData() {
    const data = {
      leads: SAMPLE_LEADS,
      contacts: SAMPLE_CONTACTS,
      companies: SAMPLE_COMPANIES,
      deals: SAMPLE_DEALS,
      opportunities: SAMPLE_OPPORTUNITIES,
      stats: {
        totalLeads: 1248,
        totalContacts: 986,
        totalDeals: 312,
        wonDeals: 68,
        revenue: 124850,
        conversionRate: 24.6
      }
    };
    localStorage.setItem(CRM_STORAGE_KEYS.CRM_DATA, JSON.stringify(data));
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(CRM_STORAGE_KEYS.CRM_DATA)) || {};
    } catch {
      return {};
    }
  }

  saveData(data) {
    localStorage.setItem(CRM_STORAGE_KEYS.CRM_DATA, JSON.stringify(data));
  }

  getLeads() { return this.getData().leads || []; }
  getContacts() { return this.getData().contacts || []; }
  getCompanies() { return this.getData().companies || []; }
  getDeals() { return this.getData().deals || []; }
  getOpportunities() { return this.getData().opportunities || []; }

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(CRM_STORAGE_KEYS.CRM_SETTINGS)) || this.getDefaultSettings();
    } catch {
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      defaultPipeline: 'sales',
      currency: 'USD',
      autoAssign: true,
      leadScoring: true,
      duplicateDetection: true,
      autoProbability: true,
      revenueForecast: true,
      notifyStage: true,
      notifyLeads: true,
      notifyTasks: true
    };
  }

  saveSettings(settings) {
    localStorage.setItem(CRM_STORAGE_KEYS.CRM_SETTINGS, JSON.stringify(settings));
  }
}

// ============================================
// CRM App
// ============================================

class CRMApp {
  constructor() {
    this.storage = new CRMStorage();
    this.dashboard = new DashboardApp();
    this.init();
  }

  init() {
    this.renderSidebar();
    this.bindEvents();
  }

  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;
    this.dashboard.renderSidebar();
  }

  bindEvents() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        overlay?.classList.toggle('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar?.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    const themeBtn = document.getElementById('theme-toggle-header');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        OP.theme.toggle();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = `<i class="ph ${isDark ? 'ph-sun' : 'ph-moon'}"></i>`;
      });
    }

    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        OP.toast.show('Notifications panel', 'info');
      });
    }

    const userBtn = document.getElementById('user-menu-btn');
    if (userBtn) {
      userBtn.addEventListener('click', () => {
        if (confirm('Sign out of OnePlace Enterprise?')) {
          OP.auth.signOut();
          window.location.href = '../auth/signin.html';
        }
      });
    }

    const searchInput = document.getElementById('crm-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }

  handleSearch(query) {
    const lower = query.toLowerCase();
    document.querySelectorAll('.crm-table tbody tr, .kanban-card, .sales-item, .recent-lead-item, .task-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(lower) ? '' : 'none';
    });
  }

  // ============================================
  // Dashboard Page
  // ============================================
  initDashboardPage() {
    this.renderPipelineFunnel();
    this.renderDealsDonut();
    this.renderRevenueChart();
    this.renderTopSales();
    this.renderRecentLeads();
    this.renderTasksOverview();
    this.renderLeadSources();
  }

  renderPipelineFunnel() {
    const container = document.getElementById('pipeline-funnel');
    if (!container) return;

    const funnelHtml = PIPELINE_STAGES.map((stage, i) => {
      const top = i * 36;
      return `<div class="funnel-segment" style="top:${top}px;width:${stage.width}px;height:32px;background:${stage.color};">${stage.count}</div>`;
    }).join('');

    container.innerHTML = funnelHtml;

    const legend = document.getElementById('pipeline-legend');
    if (legend) {
      legend.innerHTML = PIPELINE_STAGES.map(stage => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${stage.color}"></span>
          <span class="legend-label">${stage.name}</span>
          <span class="legend-value">${stage.count}</span>
        </div>
      `).join('');
    }
  }

  renderDealsDonut() {
    const container = document.getElementById('deals-donut');
    if (!container) return;

    const total = DEALS_BY_STAGE.reduce((sum, s) => sum + s.value, 0);
    let accumulated = 0;
    const segments = DEALS_BY_STAGE.map(stage => {
      const pct = (stage.value / total) * 100;
      const start = accumulated;
      accumulated += pct;
      return { ...stage, pct, start };
    });

    const size = 160;
    const radius = size / 2;
    const center = radius;
    const r = radius - 12;

    let svg = `<svg viewBox="0 0 ${size} ${size}" class="donut-svg">`;
    segments.forEach(seg => {
      const startAngle = (seg.start / 100) * Math.PI * 2 - Math.PI / 2;
      const endAngle = ((seg.start + seg.pct) / 100) * Math.PI * 2 - Math.PI / 2;
      const x1 = center + r * Math.cos(startAngle);
      const y1 = center + r * Math.sin(startAngle);
      const x2 = center + r * Math.cos(endAngle);
      const y2 = center + r * Math.sin(endAngle);
      const largeArc = seg.pct > 50 ? 1 : 0;
      svg += `<path d="M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${seg.color}" opacity="0.85"/>`;
    });
    svg += '</svg>';
    container.innerHTML = svg;

    const legend = document.getElementById('deals-legend');
    if (legend) {
      legend.innerHTML = segments.map(s => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${s.color}"></span>
          <span class="legend-label">${s.label}</span>
          <span class="legend-value">${s.value}</span>
        </div>
      `).join('');
    }
  }

  renderRevenueChart() {
    const container = document.getElementById('revenue-chart');
    if (!container) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenue = [18500, 22400, 19800, 31200, 28600, 124850];
    const max = Math.max(...revenue);
    const barWidth = 40;
    const gap = 24;
    const chartHeight = 200;
    const totalWidth = months.length * (barWidth + gap) + gap;

    let svg = `<svg viewBox="0 0 ${totalWidth} ${chartHeight + 40}" class="revenue-svg">`;
    months.forEach((month, i) => {
      const h = (revenue[i] / max) * chartHeight;
      const x = gap + i * (barWidth + gap);
      const y = chartHeight - h;
      svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="#6366f1" opacity="0.85"/>`;
      svg += `<text x="${x + barWidth/2}" y="${chartHeight + 20}" text-anchor="middle" fill="var(--text-secondary)" font-size="12">${month}</text>`;
      svg += `<text x="${x + barWidth/2}" y="${y - 8}" text-anchor="middle" fill="var(--text-primary)" font-size="11" font-weight="600">$${(revenue[i]/1000).toFixed(1)}k</text>`;
    });
    svg += '</svg>';
    container.innerHTML = svg;
  }

  renderTopSales() {
    const container = document.getElementById('top-sales');
    if (!container) return;

    container.innerHTML = TOP_SALES.map((person, i) => `
      <div class="sales-item">
        <span class="sales-rank">${i + 1}</span>
        <img src="${person.avatar}" alt="${person.name}" class="sales-avatar">
        <div class="sales-info">
          <span class="sales-name">${person.name}</span>
          <span class="sales-value">${person.value}</span>
        </div>
        <span class="sales-trend up">${person.trend}</span>
      </div>
    `).join('');
  }

  renderRecentLeads() {
    const container = document.getElementById('recent-leads');
    if (!container) return;

    const leads = this.storage.getLeads().slice(0, 5);
    container.innerHTML = leads.map(lead => `
      <div class="recent-lead-item">
        <img src="${lead.avatar}" alt="${lead.name}" class="recent-lead-avatar">
        <div class="recent-lead-info">
          <span class="recent-lead-name">${lead.name}</span>
          <span class="recent-lead-source">${lead.source} · ${lead.created}</span>
        </div>
        <span class="lead-status-badge ${lead.status}">${lead.status}</span>
      </div>
    `).join('');
  }

  renderTasksOverview() {
    const container = document.getElementById('tasks-overview');
    if (!container) return;

    container.innerHTML = TASKS_OVERVIEW.map(task => `
      <div class="task-item" data-type="${task.type}">
        <div class="task-icon" style="background:${task.color}20;color:${task.color}">
          <i class="ph ${task.icon}"></i>
        </div>
        <div class="task-info">
          <span class="task-name">${task.name}</span>
          <span class="task-count">${task.count} pending</span>
        </div>
        <span class="task-arrow"><i class="ph ph-caret-right"></i></span>
      </div>
    `).join('');
  }

  renderLeadSources() {
    const chartContainer = document.getElementById('lead-sources-chart');
    const legendContainer = document.getElementById('lead-sources-legend');
    if (!chartContainer || !legendContainer) return;

    const total = LEAD_SOURCES.reduce((sum, s) => sum + s.value, 0);
    let accumulated = 0;
    const segments = LEAD_SOURCES.map(source => {
      const pct = (source.value / total) * 100;
      const start = accumulated;
      accumulated += pct;
      return { ...source, pct, start };
    });

    const size = 140;
    const center = size / 2;
    const r = center - 10;

    let svg = `<svg viewBox="0 0 ${size} ${size}" class="sources-svg">`;
    segments.forEach(seg => {
      const startAngle = (seg.start / 100) * Math.PI * 2 - Math.PI / 2;
      const endAngle = ((seg.start + seg.pct) / 100) * Math.PI * 2 - Math.PI / 2;
      const x1 = center + r * Math.cos(startAngle);
      const y1 = center + r * Math.sin(startAngle);
      const x2 = center + r * Math.cos(endAngle);
      const y2 = center + r * Math.sin(endAngle);
      const largeArc = seg.pct > 50 ? 1 : 0;
      svg += `<path d="M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${seg.color}" opacity="0.9"/>`;
    });
    svg += `<circle cx="${center}" cy="${center}" r="${r * 0.55}" fill="var(--bg-primary)"/>`;
    svg += `<text x="${center}" y="${center - 2}" text-anchor="middle" fill="var(--text-primary)" font-size="14" font-weight="700">${total}%</text>`;
    svg += `<text x="${center}" y="${center + 14}" text-anchor="middle" fill="var(--text-secondary)" font-size="10">Sources</text>`;
    svg += '</svg>';
    chartContainer.innerHTML = svg;

    legendContainer.innerHTML = segments.map(s => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${s.color}"></span>
        <span class="legend-label">${s.label}</span>
        <span class="legend-value">${s.value}%</span>
      </div>
    `).join('');
  }

  // ============================================
  // Leads Page
  // ============================================
  initLeadsPage() {
    this.renderLeadsTable();
    this.bindLeadFilters();
    this.bindLeadActions();
  }

  renderLeadsTable(filter = 'all') {
    const tbody = document.getElementById('leads-tbody');
    if (!tbody) return;

    let leads = this.storage.getLeads();
    if (filter !== 'all') {
      leads = leads.filter(l => l.status === filter);
    }

    tbody.innerHTML = leads.map(lead => `
      <tr data-id="${lead.id}">
        <td><input type="checkbox" class="table-checkbox row-checkbox"></td>
        <td>
          <div class="lead-cell">
            <img src="${lead.avatar}" alt="${lead.name}" class="table-avatar">
            <span class="table-name">${lead.name}</span>
          </div>
        </td>
        <td><span class="source-badge">${lead.source}</span></td>
        <td><span class="status-badge ${lead.status}">${lead.status}</span></td>
        <td>${lead.created}</td>
        <td>
          <div class="owner-cell">
            <span class="owner-name">${lead.owner}</span>
          </div>
        </td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn" title="View"><i class="ph ph-eye"></i></button>
            <button class="row-action-btn" title="Edit"><i class="ph ph-pencil"></i></button>
            <button class="row-action-btn" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  bindLeadFilters() {
    document.querySelectorAll('.list-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.list-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderLeadsTable(btn.dataset.filter || 'all');
      });
    });

    const selectAll = document.getElementById('select-all');
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }
  }

  bindLeadActions() {
    const addBtn = document.getElementById('add-lead-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        OP.toast.show('Add Lead modal would open here', 'info');
      });
    }

    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        OP.toast.show('Import leads feature coming soon', 'info');
      });
    }
  }

  // ============================================
  // Contacts Page
  // ============================================
  initContactsPage() {
    this.renderContactsTable();
    this.bindContactFilters();
    this.bindContactActions();
  }

  renderContactsTable(filter = 'all') {
    const tbody = document.getElementById('contacts-tbody');
    if (!tbody) return;

    let contacts = this.storage.getContacts();

    tbody.innerHTML = contacts.map(contact => `
      <tr data-id="${contact.id}">
        <td><input type="checkbox" class="table-checkbox row-checkbox"></td>
        <td>
          <div class="contact-cell">
            <img src="${contact.avatar}" alt="${contact.name}" class="table-avatar">
            <span class="table-name">${contact.name}</span>
          </div>
        </td>
        <td>${contact.company}</td>
        <td><a href="mailto:${contact.email}" class="table-email">${contact.email}</a></td>
        <td>
          <div class="owner-cell">
            <span class="owner-name">${contact.owner}</span>
          </div>
        </td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn" title="View"><i class="ph ph-eye"></i></button>
            <button class="row-action-btn" title="Edit"><i class="ph ph-pencil"></i></button>
            <button class="row-action-btn" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  bindContactFilters() {
    document.querySelectorAll('.list-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.list-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const selectAll = document.getElementById('select-all');
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }
  }

  bindContactActions() {
    const addBtn = document.getElementById('add-contact-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        OP.toast.show('Add Contact modal would open here', 'info');
      });
    }

    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        OP.toast.show('Import contacts feature coming soon', 'info');
      });
    }
  }

  // ============================================
  // Companies Page
  // ============================================
  initCompaniesPage() {
    this.renderCompaniesTable();
    this.bindCompanyFilters();
    this.bindCompanyActions();
  }

  renderCompaniesTable(filter = 'all') {
    const tbody = document.getElementById('companies-tbody');
    if (!tbody) return;

    let companies = this.storage.getCompanies();

    tbody.innerHTML = companies.map(company => `
      <tr data-id="${company.id}">
        <td><input type="checkbox" class="table-checkbox row-checkbox"></td>
        <td>
          <div class="company-cell">
            <img src="${company.avatar}" alt="${company.name}" class="table-avatar">
            <span class="table-name">${company.name}</span>
          </div>
        </td>
        <td><span class="industry-badge">${company.industry}</span></td>
        <td>${company.contacts}</td>
        <td>${company.deals}</td>
        <td>
          <div class="owner-cell">
            <span class="owner-name">${company.owner}</span>
          </div>
        </td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn" title="View"><i class="ph ph-eye"></i></button>
            <button class="row-action-btn" title="Edit"><i class="ph ph-pencil"></i></button>
            <button class="row-action-btn" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  bindCompanyFilters() {
    document.querySelectorAll('.list-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.list-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const selectAll = document.getElementById('select-all');
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }
  }

  bindCompanyActions() {
    const addBtn = document.getElementById('add-company-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        OP.toast.show('Add Company modal would open here', 'info');
      });
    }

    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        OP.toast.show('Import companies feature coming soon', 'info');
      });
    }
  }

  // ============================================
  // Deals Page (Kanban)
  // ============================================
  initDealsPage() {
    this.renderDealsKanban();
    this.bindDealActions();
  }

  renderDealsKanban() {
    const deals = this.storage.getDeals();
    const stages = {
      new: document.getElementById('kanban-new'),
      contact: document.getElementById('kanban-contact'),
      proposal: document.getElementById('kanban-proposal'),
      negotiation: document.getElementById('kanban-negotiation'),
      won: document.getElementById('kanban-won')
    };

    Object.values(stages).forEach(el => { if (el) el.innerHTML = ''; });

    deals.forEach(deal => {
      const container = stages[deal.stage];
      if (!container) return;

      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.innerHTML = `
        <div class="kanban-card-header">
          <img src="${deal.avatar}" alt="${deal.company}" class="kanban-card-avatar">
          <span class="kanban-card-value">${deal.value}</span>
        </div>
        <h4 class="kanban-card-title">${deal.name}</h4>
        <div class="kanban-card-meta">
          <span class="kanban-probability">${deal.probability}</span>
          <span class="kanban-close-date"><i class="ph ph-calendar"></i> ${deal.closeDate}</span>
        </div>
        <div class="kanban-card-footer">
          <span class="kanban-owner">${deal.owner}</span>
          <div class="kanban-card-actions">
            <button class="kanban-action-btn" title="Edit"><i class="ph ph-pencil"></i></button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  bindDealActions() {
    const addBtn = document.getElementById('add-deal-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        OP.toast.show('Add Deal modal would open here', 'info');
      });
    }

    const filterBtn = document.getElementById('filter-deals-btn');
    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        OP.toast.show('Filter deals feature coming soon', 'info');
      });
    }
  }

  // ============================================
  // Opportunities Page
  // ============================================
  initOpportunitiesPage() {
    this.renderOpportunitiesTable();
    this.bindOpportunityFilters();
    this.bindOpportunityActions();
  }

  renderOpportunitiesTable() {
    const tbody = document.getElementById('opportunities-tbody');
    if (!tbody) return;

    const opportunities = this.storage.getOpportunities();

    tbody.innerHTML = opportunities.map(opp => `
      <tr data-id="${opp.id}">
        <td><input type="checkbox" class="table-checkbox row-checkbox"></td>
        <td>
          <div class="opp-cell">
            <span class="table-name">${opp.name}</span>
          </div>
        </td>
        <td>${opp.company}</td>
        <td><span class="value-badge">${opp.value}</span></td>
        <td><span class="stage-badge">${opp.stage}</span></td>
        <td><span class="probability-badge">${opp.probability}</span></td>
        <td>${opp.closeDate}</td>
        <td>
          <div class="owner-cell">
            <span class="owner-name">${opp.owner}</span>
          </div>
        </td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn" title="View"><i class="ph ph-eye"></i></button>
            <button class="row-action-btn" title="Edit"><i class="ph ph-pencil"></i></button>
            <button class="row-action-btn" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  bindOpportunityFilters() {
    document.querySelectorAll('.list-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.list-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const selectAll = document.getElementById('select-all');
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
      });
    }
  }

  bindOpportunityActions() {
    const addBtn = document.getElementById('add-opp-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        OP.toast.show('Add Opportunity modal would open here', 'info');
      });
    }
  }

  // ============================================
  // Pipelines Page
  // ============================================
  initPipelinesPage() {
    this.renderPipelinesList();
    this.bindPipelineActions();
  }

  renderPipelinesList() {
    const container = document.getElementById('pipeline-list');
    if (!container) return;

    const pipelines = [
      { id: 'sales', name: 'Sales Pipeline', stages: 5, deals: 312, value: '$124,850', color: '#6366f1' },
      { id: 'marketing', name: 'Marketing Pipeline', stages: 4, deals: 86, value: '$45,200', color: '#ec4899' },
      { id: 'support', name: 'Support Pipeline', stages: 3, deals: 24, value: '$12,400', color: '#22c55e' }
    ];

    container.innerHTML = pipelines.map(pipe => `
      <div class="pipeline-card" data-id="${pipe.id}">
        <div class="pipeline-card-header" style="border-left-color:${pipe.color}">
          <div class="pipeline-card-info">
            <h4 class="pipeline-card-name">${pipe.name}</h4>
            <span class="pipeline-card-stages">${pipe.stages} stages</span>
          </div>
          <div class="pipeline-card-stats">
            <span class="pipeline-card-deals">${pipe.deals} deals</span>
            <span class="pipeline-card-value">${pipe.value}</span>
          </div>
        </div>
        <div class="pipeline-card-bar">
          ${Array.from({length: pipe.stages}, (_, i) => `
            <div class="pipeline-bar-segment" style="width:${100/pipe.stages}%;background:${pipe.color};opacity:${1 - i * 0.15}"></div>
          `).join('')}
        </div>
        <div class="pipeline-card-actions">
          <button class="pipeline-action-btn" title="Edit"><i class="ph ph-pencil"></i> Edit</button>
          <button class="pipeline-action-btn" title="View"><i class="ph ph-eye"></i> View</button>
          <button class="pipeline-action-btn danger" title="Delete"><i class="ph ph-trash"></i> Delete</button>
        </div>
      </div>
    `).join('');
  }

  bindPipelineActions() {
    const addBtn = document.getElementById('add-pipeline-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        OP.toast.show('Create Pipeline modal would open here', 'info');
      });
    }

    document.querySelectorAll('.pipeline-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.title;
        OP.toast.show(`${action} pipeline action triggered`, 'info');
      });
    });
  }

  // ============================================
  // Settings Page
  // ============================================
  initSettingsPage() {
    this.loadSettings();
    this.bindSettingsActions();
  }

  loadSettings() {
    const settings = this.storage.getSettings();

    const defaultPipeline = document.getElementById('default-pipeline');
    if (defaultPipeline) defaultPipeline.value = settings.defaultPipeline;

    const currency = document.getElementById('currency');
    if (currency) currency.value = settings.currency;

    const toggles = [
      { id: 'auto-assign', key: 'autoAssign' },
      { id: 'lead-scoring', key: 'leadScoring' },
      { id: 'duplicate-detection', key: 'duplicateDetection' },
      { id: 'auto-probability', key: 'autoProbability' },
      { id: 'revenue-forecast', key: 'revenueForecast' },
      { id: 'notify-stage', key: 'notifyStage' },
      { id: 'notify-leads', key: 'notifyLeads' },
      { id: 'notify-tasks', key: 'notifyTasks' }
    ];

    toggles.forEach(t => {
      const el = document.getElementById(t.id);
      if (el) el.checked = settings[t.key];
    });
  }

  bindSettingsActions() {
    const saveBtn = document.getElementById('save-crm-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const settings = {
          defaultPipeline: document.getElementById('default-pipeline')?.value || 'sales',
          currency: document.getElementById('currency')?.value || 'USD',
          autoAssign: document.getElementById('auto-assign')?.checked ?? true,
          leadScoring: document.getElementById('lead-scoring')?.checked ?? true,
          duplicateDetection: document.getElementById('duplicate-detection')?.checked ?? true,
          autoProbability: document.getElementById('auto-probability')?.checked ?? true,
          revenueForecast: document.getElementById('revenue-forecast')?.checked ?? true,
          notifyStage: document.getElementById('notify-stage')?.checked ?? true,
          notifyLeads: document.getElementById('notify-leads')?.checked ?? true,
          notifyTasks: document.getElementById('notify-tasks')?.checked ?? true
        };
        this.storage.saveSettings(settings);
        OP.toast.show('CRM settings saved successfully', 'success');
      });
    }

    const resetBtn = document.getElementById('reset-crm-settings');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all CRM settings to default?')) {
          this.storage.saveSettings(this.storage.getDefaultSettings());
          this.loadSettings();
          OP.toast.show('Settings reset to default', 'success');
        }
      });
    }
  }

  // ============================================
  // Contact Profile Page
  // ============================================
  initContactProfilePage() {
    this.bindProfileTabs();
  }

  bindProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    const content = document.getElementById('profile-content');
    if (!content) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabName = tab.dataset.tab;
        this.renderProfileTab(tabName, content);
      });
    });
  }

  renderProfileTab(tabName, container) {
    const tabContent = {
      overview: `
        <div class="profile-section" id="tab-overview">
          <h3>About</h3>
          <p>John Smith is the CTO at Tech Solutions Inc., a leading technology company specializing in cloud infrastructure and enterprise software solutions. He has over 15 years of experience in software engineering and technical leadership.</p>
          <h3>Company</h3>
          <div class="company-card-mini">
            <img src="https://ui-avatars.com/api/?name=Tech+Solutions&background=0A66C2&color=fff&size=64" alt="Tech Solutions" class="company-mini-logo">
            <div>
              <span class="company-mini-name">Tech Solutions Inc.</span>
              <span class="company-mini-industry">Technology</span>
            </div>
            <a href="#" class="view-company-link">View Company</a>
          </div>
        </div>
      `,
      timeline: `
        <div class="profile-section" id="tab-timeline">
          <h3>Activity Timeline</h3>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-date">Today, 10:30 AM</span>
                <p class="timeline-text">Email sent to john.smith@techsolutions.com</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-date">Yesterday, 2:15 PM</span>
                <p class="timeline-text">Call completed — discussed enterprise licensing options</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-date">May 28, 2024</span>
                <p class="timeline-text">Lead created from website inquiry</p>
              </div>
            </div>
          </div>
        </div>
      `,
      deals: `
        <div class="profile-section" id="tab-deals">
          <h3>Associated Deals</h3>
          <div class="deals-mini-list">
            <div class="deal-mini-item">
              <span class="deal-mini-name">Enterprise Software License</span>
              <span class="deal-mini-value">$45,000</span>
              <span class="deal-mini-stage negotiation">Negotiation</span>
            </div>
          </div>
        </div>
      `,
      tasks: `
        <div class="profile-section" id="tab-tasks">
          <h3>Tasks</h3>
          <div class="tasks-mini-list">
            <div class="task-mini-item">
              <input type="checkbox" class="task-checkbox">
              <span class="task-mini-name">Follow up on proposal</span>
              <span class="task-mini-due">Due tomorrow</span>
            </div>
            <div class="task-mini-item">
              <input type="checkbox" class="task-checkbox" checked>
              <span class="task-mini-name completed">Schedule demo call</span>
              <span class="task-mini-due">Completed</span>
            </div>
          </div>
        </div>
      `,
      notes: `
        <div class="profile-section" id="tab-notes">
          <h3>Notes</h3>
          <div class="notes-list">
            <div class="note-item">
              <span class="note-date">May 28, 2024</span>
              <p class="note-text">Initial contact made. John expressed interest in enterprise licensing. Follow-up scheduled for next week.</p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm"><i class="ph ph-plus"></i> Add Note</button>
        </div>
      `,
      files: `
        <div class="profile-section" id="tab-files">
          <h3>Files</h3>
          <div class="files-list">
            <div class="file-item">
              <i class="ph ph-file-pdf"></i>
              <span class="file-name">Proposal_TechSolutions.pdf</span>
              <span class="file-size">2.4 MB</span>
            </div>
          </div>
          <button class="btn btn-outline btn-sm"><i class="ph ph-upload-simple"></i> Upload File</button>
        </div>
      `
    };

    container.innerHTML = tabContent[tabName] || tabContent.overview;
  }
}

// ============================================
// DashboardApp (stub for sidebar rendering)
// ============================================
class DashboardApp {
  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    const currentPath = window.location.pathname;
    const isActive = (page) => currentPath.includes(page) ? 'active' : '';

    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <div class="brand-logo">
          <i class="ph ph-squares-four"></i>
        </div>
        <span class="brand-name">OnePlace</span>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-section-title">Main</span>
          <a href="../dashboard/main-dashboard.html" class="nav-link ${isActive('dashboard/index')}">
            <i class="ph ph-house"></i>
            <span>Dashboard</span>
          </a>
          <a href="../tasks/index.html" class="nav-link ${isActive('tasks')}">
            <i class="ph ph-check-circle"></i>
            <span>Tasks</span>
          </a>
          <a href="../calendar/index.html" class="nav-link ${isActive('calendar')}">
            <i class="ph ph-calendar"></i>
            <span>Calendar</span>
          </a>
        </div>
        <div class="nav-section">
          <span class="nav-section-title">Sales</span>
          <a href="../crm/index.html" class="nav-link ${isActive('crm')}">
            <i class="ph ph-users"></i>
            <span>CRM</span>
          </a>
          <a href="../workflow/index.html" class="nav-link ${isActive('projects')}">
            <i class="ph ph-kanban"></i>
            <span>Projects</span>
          </a>
        </div>
        <div class="nav-section">
          <span class="nav-section-title">System</span>
          <a href="../settings/index.html" class="nav-link ${isActive('settings')}">
            <i class="ph ph-gear"></i>
            <span>Settings</span>
          </a>
          <a href="../auth/signin.html" class="nav-link">
            <i class="ph ph-sign-out"></i>
            <span>Sign Out</span>
          </a>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <img src="https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff&size=64" alt="Alex Morgan" class="sidebar-avatar">
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">Alex Morgan</span>
            <span class="sidebar-user-role">Admin</span>
          </div>
        </div>
      </div>
    `;
  }
}