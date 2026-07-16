/* ============================================
   OnePlace Enterprise v3.0 — Support Module JavaScript
   ============================================ */

class SupportApp {
  constructor() {
    this.currentPage = '';
    this.tickets = [];
    this.customers = [];
    this.agents = [];
    this.savedReplies = [];
    this.kbArticles = [];
    this.slaPolicies = [];
    this.selectedTickets = new Set();
    this.currentFilter = 'all';
    this.currentPageNum = 1;
    this.pageSize = 10;
    this.currentTicketId = null;
    this.currentCustomerId = null;
    this.currentCategory = 'all';
    this.isInternalNote = false;
    this.searchQuery = '';
    
    this.initData();
  }

  /* ============================================
     Data Initialization
     ============================================ */
  initData() {
    // Agents
    this.agents = [
      { id: 'a1', name: 'Alex Morgan', email: 'alex@oneplace.com', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff&size=64', tickets: 156, rating: 4.9 },
      { id: 'a2', name: 'Sarah Johnson', email: 'sarah@oneplace.com', role: 'Agent', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff&size=64', tickets: 142, rating: 4.8 },
      { id: 'a3', name: 'Michael Brown', email: 'mike@oneplace.com', role: 'Agent', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=f59e0b&color=fff&size=64', tickets: 128, rating: 4.8 },
      { id: 'a4', name: 'Emily Davis', email: 'emily@oneplace.com', role: 'Agent', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=ec4899&color=fff&size=64', tickets: 115, rating: 4.7 },
      { id: 'a5', name: 'James Wilson', email: 'james@oneplace.com', role: 'Agent', avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=3b82f6&color=fff&size=64', tickets: 198, rating: 4.9 },
      { id: 'a6', name: 'David Wilson', email: 'david@oneplace.com', role: 'Agent', avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=8b5cf6&color=fff&size=64', tickets: 98, rating: 4.6 }
    ];

    // Customers
    this.customers = [
      { id: 'c1', name: 'John Smith', email: 'john.smith@example.com', phone: '+1 (555) 555-0101', company: 'Acme Corp', plan: 'Business', tickets: 12, joined: '2023-01-15', avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=e5e7eb&color=374151&size=64' },
      { id: 'c2', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 (555) 555-0102', company: 'TechStart', plan: 'Pro', tickets: 8, joined: '2023-03-22', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=e5e7eb&color=374151&size=64' },
      { id: 'c3', name: 'Michael Brown', email: 'm.brown@example.com', phone: '+1 (555) 555-0103', company: 'Global Inc', plan: 'Starter', tickets: 5, joined: '2023-05-10', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=e5e7eb&color=374151&size=64' },
      { id: 'c4', name: 'Emily Davis', email: 'emily.d@example.com', phone: '+1 (555) 555-0104', company: 'Design Co', plan: 'Business', tickets: 15, joined: '2022-11-05', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=e5e7eb&color=374151&size=64' },
      { id: 'c5', name: 'Robert Taylor', email: 'robert.t@example.com', phone: '+1 (555) 555-0105', company: 'BuildRight', plan: 'Pro', tickets: 7, joined: '2023-06-18', avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=e5e7eb&color=374151&size=64' },
      { id: 'c6', name: 'Lisa Anderson', email: 'lisa.a@example.com', phone: '+1 (555) 555-0106', company: 'MediaFlow', plan: 'Starter', tickets: 3, joined: '2023-08-01', avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=e5e7eb&color=374151&size=64' },
      { id: 'c7', name: 'Chris Martin', email: 'chris.m@example.com', phone: '+1 (555) 555-0107', company: 'CloudNine', plan: 'Business', tickets: 9, joined: '2023-02-14', avatar: 'https://ui-avatars.com/api/?name=Chris+Martin&background=e5e7eb&color=374151&size=64' },
      { id: 'c8', name: 'Amanda White', email: 'amanda.w@example.com', phone: '+1 (555) 555-0108', company: 'DataDriven', plan: 'Pro', tickets: 6, joined: '2023-04-30', avatar: 'https://ui-avatars.com/api/?name=Amanda+White&background=e5e7eb&color=374151&size=64' },
      { id: 'c9', name: 'Daniel Harris', email: 'daniel.h@example.com', phone: '+1 (555) 555-0109', company: 'SwiftDev', plan: 'Starter', tickets: 4, joined: '2023-07-12', avatar: 'https://ui-avatars.com/api/?name=Daniel+Harris&background=e5e7eb&color=374151&size=64' },
      { id: 'c10', name: 'Jessica Lee', email: 'jessica.l@example.com', phone: '+1 (555) 555-0110', company: 'PixelPerfect', plan: 'Business', tickets: 11, joined: '2023-01-28', avatar: 'https://ui-avatars.com/api/?name=Jessica+Lee&background=e5e7eb&color=374151&size=64' }
    ];

    // Tickets
    const subjects = [
      'Login issue on mobile app',
      'Payment not processing',
      'Feature request: Dark mode',
      'Unable to upload documents',
      'Account verification delay',
      'API integration failing',
      'Billing discrepancy',
      'Can\'t reset password',
      'Error on data export',
      'Two-factor auth issue',
      'App crashing on launch',
      'Slow page load times',
      'Missing invoice email',
      'Webhook not triggering',
      'Dashboard widgets broken',
      'User permissions error',
      'Export format incorrect',
      'Notification settings',
      'Team member access',
      'Custom domain setup'
    ];

    const statuses = ['open', 'pending', 'resolved', 'closed', 'on-hold'];
    const priorities = ['high', 'medium', 'low'];
    const categories = ['general', 'technical', 'billing', 'feature', 'bug'];

    this.tickets = [];
    for (let i = 1; i <= 50; i++) {
      const customer = this.customers[Math.floor(Math.random() * this.customers.length)];
      const agent = Math.random() > 0.3 ? this.agents[Math.floor(Math.random() * this.agents.length)] : null;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const created = new Date(Date.now() - daysAgo * 86400000 - hoursAgo * 3600000);
      const updated = new Date(created.getTime() + Math.floor(Math.random() * 86400000));
      
      this.tickets.push({
        id: `TKT-${1249 + i}`,
        subject: subject,
        customer: customer,
        status: status,
        priority: priority,
        category: categories[Math.floor(Math.random() * categories.length)],
        assignedTo: agent,
        createdAt: created,
        updatedAt: updated,
        tags: [],
        source: ['Email', 'Live Chat', 'WhatsApp', 'Social Media', 'Other'][Math.floor(Math.random() * 5)],
        description: `Customer reported: ${subject}. Please investigate and resolve as soon as possible.`,
        conversation: [
          {
            type: 'customer',
            author: customer.name,
            avatar: customer.avatar,
            content: `Hi, I'm having trouble with ${subject.toLowerCase()}. Could you please help me resolve this?`,
            timestamp: created
          }
        ],
        notes: [],
        attachments: [],
        timeline: [
          { type: 'ticket', text: `Ticket created by ${customer.name}`, date: created }
        ]
      });
    }

    // Add some conversation messages
    this.tickets.forEach(ticket => {
      if (Math.random() > 0.5 && ticket.assignedTo) {
        ticket.conversation.push({
          type: 'agent',
          author: ticket.assignedTo.name,
          avatar: ticket.assignedTo.avatar,
          content: `Hi ${ticket.customer.name.split(' ')[0]}, thanks for reaching out. I'm looking into your issue with ${ticket.subject.toLowerCase()} and will get back to you shortly.`,
          timestamp: new Date(ticket.createdAt.getTime() + 3600000)
        });
      }
      if (Math.random() > 0.7 && ticket.conversation.length > 1) {
        ticket.conversation.push({
          type: 'customer',
          author: ticket.customer.name,
          avatar: ticket.customer.avatar,
          content: `Thanks for the quick response. Let me know if you need any additional information.`,
          timestamp: new Date(ticket.createdAt.getTime() + 7200000)
        });
      }
    });

    // Saved Replies
    this.savedReplies = [
      { id: 'r1', title: 'Welcome Message', category: 'greetings', content: 'Hi {{customer_name}}, thank you for contacting our support team. We\'re here to help! How can I assist you today?' },
      { id: 'r2', title: 'Login Issue', category: 'account', content: 'Hi {{customer_name}}, I\'m sorry you\'re having trouble logging in. Let\'s try resetting your password first. Please follow these steps...' },
      { id: 'r3', title: 'Password Reset', category: 'account', content: 'Hi {{customer_name}}, you can reset your password by going to Settings > Security > Change Password. Let me know if you need further assistance.' },
      { id: 'r4', title: 'Billing Inquiry', category: 'billing', content: 'Hi {{customer_name}}, I\'d be happy to help with your billing question. Could you please provide more details about the specific charge or issue?' },
      { id: 'r5', title: 'Feature Request', category: 'technical', content: 'Hi {{customer_name}}, thank you for the feature suggestion! I\'ve forwarded this to our product team for consideration. We\'ll keep you updated on any developments.' },
      { id: 'r6', title: 'Closing Message', category: 'closing', content: 'Hi {{customer_name}}, I\'m glad we could resolve this for you. If you have any other questions, feel free to reach out. Have a great day!' },
      { id: 'r7', title: 'Escalation Notice', category: 'technical', content: 'Hi {{customer_name}}, I\'ve escalated your ticket #{{ticket_id}} to our senior technical team. They will contact you within 24 hours with an update.' },
      { id: 'r8', title: 'Refund Processing', category: 'billing', content: 'Hi {{customer_name}}, your refund has been processed and should appear in your account within 5-7 business days. Here is your reference number: REF-{{ticket_id}}.' }
    ];

    // Knowledge Base Articles
    this.kbArticles = [
      { id: 'kb1', title: 'How to reset your password', category: 'getting-started', views: 3240, updated: '2024-05-20', content: 'Step-by-step guide to resetting your account password...' },
      { id: 'kb2', title: 'Setting up two-factor authentication', category: 'account', views: 2150, updated: '2024-05-18', content: 'Learn how to enable 2FA for enhanced security...' },
      { id: 'kb3', title: 'How to integrate with WhatsApp Business', category: 'integrations', views: 1890, updated: '2024-05-15', content: 'Complete integration guide for WhatsApp Business API...' },
      { id: 'kb4', title: 'Understanding user roles and permissions', category: 'features', views: 1560, updated: '2024-05-12', content: 'Detailed explanation of available roles and permissions...' },
      { id: 'kb5', title: 'How to export your data', category: 'features', views: 1420, updated: '2024-05-10', content: 'Guide to exporting data in various formats...' },
      { id: 'kb6', title: 'Troubleshooting login issues', category: 'troubleshooting', views: 3890, updated: '2024-05-22', content: 'Common login problems and their solutions...' },
      { id: 'kb7', title: 'API rate limits and best practices', category: 'technical', views: 980, updated: '2024-05-08', content: 'Understanding API limits and optimization tips...' },
      { id: 'kb8', title: 'Customizing your dashboard', category: 'features', views: 1120, updated: '2024-05-05', content: 'Personalize your workspace with widgets and layouts...' },
      { id: 'kb9', title: 'Managing team members', category: 'account', views: 1340, updated: '2024-05-03', content: 'How to add, remove, and manage team access...' },
      { id: 'kb10', title: 'Webhook configuration guide', category: 'integrations', views: 760, updated: '2024-04-28', content: 'Setting up and testing webhooks for real-time events...' }
    ];

    // SLA Policies
    this.slaPolicies = [
      { id: 'sla1', name: 'High Priority Tickets', priority: 'high', responseTime: { hours: 1, minutes: 0 }, resolutionTime: { hours: 4, minutes: 0 }, status: 'active' },
      { id: 'sla2', name: 'Medium Priority Tickets', priority: 'medium', responseTime: { hours: 4, minutes: 0 }, resolutionTime: { hours: 24, minutes: 0 }, status: 'active' },
      { id: 'sla3', name: 'Low Priority Tickets', priority: 'low', responseTime: { hours: 8, minutes: 0 }, resolutionTime: { hours: 72, minutes: 0 }, status: 'active' },
      { id: 'sla4', name: 'General Inquiries', priority: 'all', responseTime: { hours: 24, minutes: 0 }, resolutionTime: { hours: 168, minutes: 0 }, status: 'active' }
    ];
  }

  /* ============================================
     Utility Functions
     ============================================ */
  formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDateFull(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  getStatusClass(status) {
    const map = { open: 'open', pending: 'pending', resolved: 'resolved', closed: 'closed', 'on-hold': 'on-hold' };
    return map[status] || 'open';
  }

  getPriorityClass(priority) {
    return priority || 'medium';
  }

  getStatusIcon(status) {
    const map = { open: 'ph-envelope-open', pending: 'ph-clock', resolved: 'ph-check-circle', closed: 'ph-check-circle', 'on-hold': 'ph-pause' };
    return map[status] || 'ph-envelope-open';
  }

  getPriorityIcon(priority) {
    const map = { high: 'ph-flag', medium: 'ph-flag', low: 'ph-flag' };
    return map[priority] || 'ph-flag';
  }

  highlightCurrentTab() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.support-tab').forEach(tab => {
      const href = tab.getAttribute('href');
      if (href === currentPath) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  updateBadgeCounts() {
    const total = this.tickets.length;
    const open = this.tickets.filter(t => t.status === 'open').length;
    const pending = this.tickets.filter(t => t.status === 'pending').length;
    const closed = this.tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length;
    
    const ticketsBadge = document.getElementById('tickets-badge');
    const openBadge = document.getElementById('open-badge');
    const pendingBadge = document.getElementById('pending-badge');
    const closedBadge = document.getElementById('closed-badge');
    
    if (ticketsBadge) ticketsBadge.textContent = total.toLocaleString();
    if (openBadge) openBadge.textContent = open.toLocaleString();
    if (pendingBadge) pendingBadge.textContent = pending.toLocaleString();
    if (closedBadge) closedBadge.textContent = closed.toLocaleString();
  }

  /* ============================================
     Dashboard Page
     ============================================ */
  initDashboardPage() {
    this.currentPage = 'dashboard';
    this.renderDashboardStats();
    this.renderLineChart();
    this.renderStatusDonut();
    this.renderPriorityBars();
    this.renderOpenTicketsList();
    this.renderSourcesDonut();
    this.renderSatisfactionGauge();
    this.renderUnassignedTickets();
    this.renderTopPerformers();
    this.renderSLADonut();
    this.renderRecentActivity();
    this.setupDashboardEvents();
    this.highlightCurrentTab();
    this.updateBadgeCounts();
  }

  renderDashboardStats() {
    const total = this.tickets.length;
    const open = this.tickets.filter(t => t.status === 'open').length;
    const pending = this.tickets.filter(t => t.status === 'pending').length;
    const closed = this.tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length;
    
    const statTotal = document.getElementById('stat-total');
    const statOpen = document.getElementById('stat-open');
    const statPending = document.getElementById('stat-pending');
    const statClosed = document.getElementById('stat-closed');
    
    if (statTotal) statTotal.textContent = total.toLocaleString();
    if (statOpen) statOpen.textContent = open.toLocaleString();
    if (statPending) statPending.textContent = pending.toLocaleString();
    if (statClosed) statClosed.textContent = closed.toLocaleString();
  }

  renderLineChart() {
    const container = document.getElementById('tickets-line-chart');
    if (!container) return;
    
    const days = ['May 22', 'May 23', 'May 24', 'May 25', 'May 26', 'May 27', 'May 28'];
    const newData = [45, 38, 52, 48, 55, 62, 58];
    const resolvedData = [32, 35, 40, 38, 45, 50, 48];
    
    const maxVal = Math.max(...newData, ...resolvedData);
    const height = 200;
    const width = container.clientWidth || 600;
    const padding = 20;
    
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const stepX = chartWidth / (days.length - 1);
    
    const pointsNew = newData.map((v, i) => ({
      x: padding + i * stepX,
      y: height - padding - (v / maxVal) * chartHeight
    }));
    
    const pointsResolved = resolvedData.map((v, i) => ({
      x: padding + i * stepX,
      y: height - padding - (v / maxVal) * chartHeight
    }));
    
    const linePath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = (pts) => `${linePath(pts)} L ${pts[pts.length-1].x} ${height-padding} L ${pts[0].x} ${height-padding} Z`;
    
    container.innerHTML = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaPath(pointsNew)}" fill="url(#gradNew)"/>
        <path d="${areaPath(pointsResolved)}" fill="url(#gradResolved)"/>
        <path d="${linePath(pointsNew)}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>
        <path d="${linePath(pointsResolved)}" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
        ${pointsNew.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#6366f1"/>`).join('')}
        ${pointsResolved.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#10b981"/>`).join('')}
        ${days.map((d, i) => `<text x="${padding + i * stepX}" y="${height - 2}" text-anchor="middle" font-size="10" fill="#9ca3af">${d}</text>`).join('')}
      </svg>
    `;
  }

  renderStatusDonut() {
    const svg = document.getElementById('status-donut-svg');
    const legend = document.getElementById('status-donut-legend');
    if (!svg || !legend) return;
    
    const counts = {
      open: this.tickets.filter(t => t.status === 'open').length,
      pending: this.tickets.filter(t => t.status === 'pending').length,
      'on-hold': this.tickets.filter(t => t.status === 'on-hold').length,
      resolved: this.tickets.filter(t => t.status === 'resolved').length,
      closed: this.tickets.filter(t => t.status === 'closed').length
    };
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    
    const colors = { open: '#6366f1', pending: '#f59e0b', 'on-hold': '#0ea5e9', resolved: '#10b981', closed: '#6b7280' };
    const labels = { open: 'Open', pending: 'Pending', 'on-hold': 'On Hold', resolved: 'Resolved', closed: 'Closed' };
    
    let currentAngle = -90;
    const radius = 60;
    const cx = 70;
    const cy = 70;
    let paths = '';
    
    Object.entries(counts).forEach(([status, count]) => {
      if (count === 0) return;
      const angle = (count / total) * 360;
      const startAngle = currentAngle * Math.PI / 180;
      const endAngle = (currentAngle + angle) * Math.PI / 180;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = angle > 180 ? 1 : 0;
      
      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[status]}"/>`;
      currentAngle += angle;
    });
    
    svg.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="1"/>${paths}<circle cx="${cx}" cy="${cy}" r="${radius * 0.6}" fill="white"/>`;
    
    legend.innerHTML = Object.entries(counts).map(([status, count]) => `
      <div class="donut-legend-item">
        <span class="donut-legend-dot" style="background:${colors[status]}"></span>
        <span class="donut-legend-label">${labels[status]}</span>
        <span class="donut-legend-value">${count}</span>
        <span class="donut-legend-percent">${((count/total)*100).toFixed(1)}%</span>
      </div>
    `).join('');
    
    const totalEl = document.getElementById('status-donut-total');
    if (totalEl) totalEl.textContent = total.toLocaleString();
  }

  renderPriorityBars() {
    const container = document.getElementById('priority-bars');
    if (!container) return;
    
    const counts = {
      high: this.tickets.filter(t => t.priority === 'high').length,
      medium: this.tickets.filter(t => t.priority === 'medium').length,
      low: this.tickets.filter(t => t.priority === 'low').length
    };
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const labels = { high: 'High', medium: 'Medium', low: 'Low' };
    
    container.innerHTML = Object.entries(counts).map(([priority, count]) => `
      <div class="priority-bar-item">
        <div class="priority-bar-header">
          <span class="priority-bar-label">${labels[priority]}</span>
          <span class="priority-bar-count">${count}</span>
        </div>
        <div class="priority-bar-track">
          <div class="priority-bar-fill ${priority}" style="width:${(count/total)*100}%"></div>
        </div>
      </div>
    `).join('');
  }

  renderOpenTicketsList() {
    const container = document.getElementById('open-tickets-list');
    if (!container) return;
    
    const openTickets = this.tickets.filter(t => t.status === 'open').slice(0, 5);
    
    container.innerHTML = openTickets.map(ticket => `
      <div class="ticket-list-item" data-id="${ticket.id}">
        <div class="ticket-list-icon ${ticket.priority}"><i class="ph ${this.getStatusIcon(ticket.status)}"></i></div>
        <div class="ticket-list-info">
          <div class="ticket-list-title">${this.escapeHtml(ticket.subject)}</div>
          <div class="ticket-list-meta">${ticket.id} · ${ticket.customer.name}</div>
        </div>
        <span class="ticket-list-priority ${ticket.priority}">${ticket.priority}</span>
      </div>
    `).join('');
    
    container.querySelectorAll('.ticket-list-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.href = `ticket-details.html?id=${item.dataset.id}`;
      });
    });
  }

  renderSourcesDonut() {
    const svg = document.getElementById('sources-donut-svg');
    const legend = document.getElementById('sources-donut-legend');
    if (!svg || !legend) return;
    
    const sources = {};
    this.tickets.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1; });
    const total = this.tickets.length;
    
    const colors = { 'Email': '#6366f1', 'Live Chat': '#10b981', 'WhatsApp': '#25d366', 'Social Media': '#f59e0b', 'Other': '#6b7280' };
    
    let currentAngle = -90;
    const radius = 60;
    const cx = 70;
    const cy = 70;
    let paths = '';
    
    Object.entries(sources).forEach(([source, count]) => {
      const angle = (count / total) * 360;
      const startAngle = currentAngle * Math.PI / 180;
      const endAngle = (currentAngle + angle) * Math.PI / 180;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = angle > 180 ? 1 : 0;
      
      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[source] || '#9ca3af'}"/>`;
      currentAngle += angle;
    });
    
    svg.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="1"/>${paths}<circle cx="${cx}" cy="${cy}" r="${radius * 0.6}" fill="white"/>`;
    
    legend.innerHTML = Object.entries(sources).map(([source, count]) => `
      <div class="donut-legend-item">
        <span class="donut-legend-dot" style="background:${colors[source] || '#9ca3af'}"></span>
        <span class="donut-legend-label">${source}</span>
        <span class="donut-legend-value">${count}</span>
        <span class="donut-legend-percent">${((count/total)*100).toFixed(0)}%</span>
      </div>
    `).join('');
  }

  renderSatisfactionGauge() {
    const container = document.getElementById('satisfaction-gauge');
    if (!container) return;
    
    const score = 4.8;
    const max = 5;
    const percentage = (score / max) * 100;
    const angle = (percentage / 100) * 180;
    
    container.innerHTML = `
      <svg class="gauge-svg" viewBox="0 0 160 100">
        <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="#e5e7eb" stroke-width="12" stroke-linecap="round"/>
        <path d="M 20 90 A 60 60 0 0 1 ${20 + 120 * Math.cos((180 - angle) * Math.PI / 180)} ${90 - 120 * Math.sin((180 - angle) * Math.PI / 180)}" 
              fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="round"/>
        <text x="80" y="75" text-anchor="middle" font-size="28" font-weight="bold" fill="#111827">${score}</text>
        <text x="80" y="92" text-anchor="middle" font-size="10" fill="#6b7280">Average Rating</text>
      </svg>
    `;
  }

  renderUnassignedTickets() {
    const container = document.getElementById('unassigned-tickets-list');
    if (!container) return;
    
    const unassigned = this.tickets.filter(t => !t.assignedTo).slice(0, 5);
    
    container.innerHTML = unassigned.map(ticket => `
      <div class="ticket-list-item" data-id="${ticket.id}">
        <div class="ticket-list-icon ${ticket.priority}"><i class="ph ${this.getStatusIcon(ticket.status)}"></i></div>
        <div class="ticket-list-info">
          <div class="ticket-list-title">${this.escapeHtml(ticket.subject)}</div>
          <div class="ticket-list-meta">${ticket.id} · ${ticket.customer.name}</div>
        </div>
        <span class="ticket-list-priority ${ticket.priority}">${ticket.priority}</span>
      </div>
    `).join('');
    
    container.querySelectorAll('.ticket-list-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.href = `ticket-details.html?id=${item.dataset.id}`;
      });
    });
  }

  renderTopPerformers() {
    const container = document.getElementById('top-performers');
    if (!container) return;
    
    const sorted = [...this.agents].sort((a, b) => b.tickets - a.tickets).slice(0, 5);
    
    container.innerHTML = sorted.map((agent, i) => `
      <div class="performer-item">
        <div class="performer-rank ${i < 3 ? 'top' : ''}">${i + 1}</div>
        <img src="${agent.avatar}" alt="${agent.name}" class="performer-avatar">
        <div class="performer-info">
          <div class="performer-name">${agent.name}</div>
          <div class="performer-tickets">${agent.tickets} tickets</div>
        </div>
        <div class="performer-rating">
          <i class="ph-fill ph-star"></i> ${agent.rating}
        </div>
      </div>
    `).join('');
  }

  renderSLADonut() {
    const container = document.getElementById('sla-donut');
    const legend = document.getElementById('sla-legend');
    if (!container || !legend) return;
    
    const data = { met: 92, breached: 6.6, warning: 1.4 };
    const colors = { met: '#10b981', breached: '#ef4444', warning: '#f59e0b' };
    
    let currentAngle = -90;
    const radius = 60;
    const cx = 70;
    const cy = 70;
    let paths = '';
    
    Object.entries(data).forEach(([key, value]) => {
      const angle = (value / 100) * 360;
      const startAngle = currentAngle * Math.PI / 180;
      const endAngle = (currentAngle + angle) * Math.PI / 180;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = angle > 180 ? 1 : 0;
      
      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[key]}"/>`;
      currentAngle += angle;
    });
    
    container.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="1"/>${paths}<circle cx="${cx}" cy="${cy}" r="${radius * 0.6}" fill="white"/>`;
    
    legend.innerHTML = Object.entries(data).map(([key, value]) => `
      <div class="sla-legend-item">
        <span class="sla-legend-dot ${key}"></span>
        <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
      </div>
    `).join('');
  }

  renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    if (!container) return;
    
    const activities = [
      { user: 'Sarah Johnson', action: 'Ticket #TKT-1249 has been updated', time: '10m ago', avatar: this.agents[1].avatar },
      { user: 'Michael Brown', action: 'Ticket #TKT-1248 has been resolved', time: '25m ago', avatar: this.agents[2].avatar },
      { user: 'Emily Davis', action: 'New ticket #TKT-1256 created', time: '1h ago', avatar: this.agents[3].avatar },
      { user: 'James Wilson', action: 'Commented on ticket #TKT-1250', time: '2h ago', avatar: this.agents[4].avatar },
      { user: 'Olivia Martinez', action: 'SLA breached on ticket #TKT-1247', time: '3h ago', avatar: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=ef4444&color=fff&size=64' },
      { user: 'Alex Morgan', action: 'Updated SLA policy for High Priority', time: '5h ago', avatar: this.agents[0].avatar }
    ];
    
    container.innerHTML = activities.map(act => `
      <div class="activity-item">
        <img src="${act.avatar}" alt="${act.user}" class="activity-avatar">
        <div class="activity-content">
          <div class="activity-text"><strong>${act.user}</strong> ${act.action}</div>
        </div>
        <span class="activity-time">${act.time}</span>
      </div>
    `).join('');
  }

  setupDashboardEvents() {
    const periodSelect = document.getElementById('tickets-period');
    if (periodSelect) {
      periodSelect.addEventListener('change', () => this.renderLineChart());
    }
  }

  /* ============================================
     Tickets Page (All, Open, Pending, Closed)
     ============================================ */
  initTicketsPage(filter = 'all') {
    this.currentPage = 'tickets';
    this.currentFilter = filter;
    this.currentPageNum = 1;
    this.selectedTickets.clear();
    
    this.renderTicketsTable();
    this.renderPagination();
    this.setupTicketEvents();
    this.highlightCurrentTab();
    this.updateFilterButtons();
    this.updateBadgeCounts();
  }

  getFilteredTickets() {
    let filtered = this.tickets;
    
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(t => t.status === this.currentFilter);
    }
    
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.subject.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.customer.name.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }

  renderTicketsTable() {
    const tbody = document.getElementById('tickets-tbody');
    if (!tbody) return;
    
    const filtered = this.getFilteredTickets();
    const start = (this.currentPageNum - 1) * this.pageSize;
    const pageTickets = filtered.slice(start, start + this.pageSize);
    
    tbody.innerHTML = pageTickets.map(ticket => `
      <tr data-id="${ticket.id}">
        <td><input type="checkbox" class="ticket-checkbox" data-id="${ticket.id}" ${this.selectedTickets.has(ticket.id) ? 'checked' : ''}></td>
        <td>
          <div class="ticket-cell">
            <div>
              <div class="ticket-subject"><a href="ticket-details.html?id=${ticket.id}">${this.escapeHtml(ticket.subject)}</a></div>
              <div class="ticket-id">${ticket.id}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="customer-cell">
            <img src="${ticket.customer.avatar}" alt="${ticket.customer.name}" class="customer-avatar">
            <span class="customer-name">${ticket.customer.name}</span>
          </div>
        </td>
        <td><span class="status-badge ${this.getStatusClass(ticket.status)}"><i class="ph ${this.getStatusIcon(ticket.status)}"></i> ${ticket.status}</span></td>
        <td><span class="priority-badge ${this.getPriorityClass(ticket.priority)}"><i class="ph ${this.getPriorityIcon(ticket.priority)}"></i> ${ticket.priority}</span></td>
        <td>
          ${ticket.assignedTo ? `
            <div class="assignee-cell">
              <img src="${ticket.assignedTo.avatar}" alt="${ticket.assignedTo.name}" class="assignee-avatar">
              <span class="assignee-name">${ticket.assignedTo.name}</span>
            </div>
          ` : '<span class="assignee-unassigned">Unassigned</span>'}
        </td>
        <td>${this.formatDate(ticket.updatedAt)}</td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn" title="View" onclick="window.location.href='ticket-details.html?id=${ticket.id}'"><i class="ph ph-eye"></i></button>
            <button class="table-action-btn" title="Edit"><i class="ph ph-pencil-simple"></i></button>
            <button class="table-action-btn" title="More"><i class="ph ph-dots-three-vertical"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
    
    this.setupCheckboxEvents();
  }

  renderPagination() {
    const container = document.getElementById('ticket-pagination');
    if (!container) return;
    
    const filtered = this.getFilteredTickets();
    const totalPages = Math.ceil(filtered.length / this.pageSize);
    
    if (totalPages <= 1) {
      container.innerHTML = `<div class="pagination-info">Showing ${filtered.length} of ${filtered.length} tickets</div>`;
      return;
    }
    
    let pages = '';
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPageNum - 1 && i <= this.currentPageNum + 1)) {
        pages += `<button class="pagination-btn ${i === this.currentPageNum ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === this.currentPageNum - 2 || i === this.currentPageNum + 2) {
        pages += `<span style="color:#9ca3af;padding:0 4px;">...</span>`;
      }
    }
    
    container.innerHTML = `
      <div class="pagination-info">Showing ${Math.min((this.currentPageNum - 1) * this.pageSize + 1, filtered.length)}-${Math.min(this.currentPageNum * this.pageSize, filtered.length)} of ${filtered.length} tickets</div>
      <div class="pagination-controls">
        <button class="pagination-btn" id="prev-page" ${this.currentPageNum === 1 ? 'disabled' : ''}><i class="ph ph-caret-left"></i></button>
        ${pages}
        <button class="pagination-btn" id="next-page" ${this.currentPageNum === totalPages ? 'disabled' : ''}><i class="ph ph-caret-right"></i></button>
      </div>
    `;
    
    container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPageNum = parseInt(btn.dataset.page);
        this.renderTicketsTable();
        this.renderPagination();
      });
    });
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (this.currentPageNum > 1) { this.currentPageNum--; this.renderTicketsTable(); this.renderPagination(); }});
    if (nextBtn) nextBtn.addEventListener('click', () => { if (this.currentPageNum < totalPages) { this.currentPageNum++; this.renderTicketsTable(); this.renderPagination(); }});
  }

  setupTicketEvents() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.currentPageNum = 1;
        this.renderTicketsTable();
        this.renderPagination();
      });
    });
    
    // Search
    const searchInput = document.getElementById('support-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPageNum = 1;
        this.renderTicketsTable();
        this.renderPagination();
      });
    }
    
    // New ticket modal
    const newTicketBtn = document.getElementById('new-ticket-btn');
    const modal = document.getElementById('new-ticket-modal');
    if (newTicketBtn && modal) {
      newTicketBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
      document.getElementById('modal-close')?.addEventListener('click', () => { modal.style.display = 'none'; });
      document.getElementById('modal-cancel')?.addEventListener('click', () => { modal.style.display = 'none'; });
      document.getElementById('modal-create')?.addEventListener('click', () => this.createNewTicket());
    }
    
    // Export
    document.getElementById('export-btn')?.addEventListener('click', () => {
      alert('Export functionality would download tickets as CSV');
    });
  }

  setupCheckboxEvents() {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.ticket-checkbox');
    const bulkBar = document.getElementById('bulk-actions-bar');
    
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        checkboxes.forEach(cb => {
          cb.checked = e.target.checked;
          if (e.target.checked) this.selectedTickets.add(cb.dataset.id);
          else this.selectedTickets.delete(cb.dataset.id);
        });
        this.updateBulkBar();
      });
    }
    
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) this.selectedTickets.add(e.target.dataset.id);
        else this.selectedTickets.delete(e.target.dataset.id);
        this.updateBulkBar();
      });
    });
    
    document.getElementById('bulk-clear')?.addEventListener('click', () => {
      this.selectedTickets.clear();
      checkboxes.forEach(cb => cb.checked = false);
      if (selectAll) selectAll.checked = false;
      this.updateBulkBar();
    });
    
    document.querySelectorAll('.bulk-actions .btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        alert(`Bulk ${action} applied to ${this.selectedTickets.size} tickets`);
      });
    });
  }

  updateBulkBar() {
    const bulkBar = document.getElementById('bulk-actions-bar');
    const count = document.getElementById('bulk-count');
    if (!bulkBar || !count) return;
    
    count.textContent = this.selectedTickets.size;
    bulkBar.style.display = this.selectedTickets.size > 0 ? 'flex' : 'none';
  }

  createNewTicket() {
    const subject = document.getElementById('ticket-subject')?.value;
    const customerName = document.getElementById('ticket-customer')?.value;
    const email = document.getElementById('ticket-email')?.value;
    const priority = document.getElementById('ticket-priority')?.value;
    const category = document.getElementById('ticket-category')?.value;
    const description = document.getElementById('ticket-description')?.value;
    
    if (!subject || !customerName) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newTicket = {
      id: `TKT-${1300 + this.tickets.length}`,
      subject: subject,
      customer: { name: customerName, email: email || '', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=e5e7eb&color=374151&size=64` },
      status: 'open',
      priority: priority || 'medium',
      category: category || 'general',
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      source: 'Email',
      description: description || '',
      conversation: [{
        type: 'customer',
        author: customerName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=e5e7eb&color=374151&size=64`,
        content: description || 'No description provided.',
        timestamp: new Date()
      }],
      notes: [],
      attachments: [],
      timeline: [{ type: 'ticket', text: `Ticket created by ${customerName}`, date: new Date() }]
    };
    
    this.tickets.unshift(newTicket);
    document.getElementById('new-ticket-modal').style.display = 'none';
    this.renderTicketsTable();
    this.renderPagination();
    this.updateBadgeCounts();
    
    // Reset form
    document.getElementById('ticket-subject').value = '';
    document.getElementById('ticket-customer').value = '';
    document.getElementById('ticket-email').value = '';
    document.getElementById('ticket-description').value = '';
  }

  updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
    });
  }

  /* ============================================
     Ticket Details Page
     ============================================ */
  initTicketDetailsPage() {
    this.currentPage = 'details';
    const urlParams = new URLSearchParams(window.location.search);
    this.currentTicketId = urlParams.get('id');
    
    if (!this.currentTicketId) {
      window.location.href = 'tickets.html';
      return;
    }
    
    const ticket = this.tickets.find(t => t.id === this.currentTicketId);
    if (!ticket) {
      window.location.href = 'tickets.html';
      return;
    }
    
    this.renderTicketHeader(ticket);
    this.renderConversation(ticket);
    this.renderTicketProperties(ticket);
    this.renderCustomerMini(ticket);
    this.renderTicketTags(ticket);
    this.renderRelatedTickets(ticket);
    this.renderCustomerInfo(ticket);
    this.renderTimeline(ticket);
    this.renderNotes(ticket);
    this.renderAttachments(ticket);
    this.setupDetailEvents(ticket);
    this.highlightCurrentTab();
  }

  renderTicketHeader(ticket) {
    const header = document.getElementById('ticket-detail-header');
    if (!header) return;
    
    header.innerHTML = `
      <div class="ticket-detail-title-row">
        <h2 class="ticket-detail-title">${this.escapeHtml(ticket.subject)}</h2>
        <div class="ticket-detail-badges">
          <span class="status-badge ${this.getStatusClass(ticket.status)}">${ticket.status}</span>
          <span class="priority-badge ${this.getPriorityClass(ticket.priority)}">${ticket.priority}</span>
        </div>
      </div>
      <div class="ticket-detail-meta">
        <div class="ticket-detail-meta-item"><i class="ph ph-hash"></i> ${ticket.id}</div>
        <div class="ticket-detail-meta-item"><i class="ph ph-user"></i> ${ticket.customer.name}</div>
        <div class="ticket-detail-meta-item"><i class="ph ph-calendar"></i> ${this.formatDateFull(ticket.createdAt)}</div>
        <div class="ticket-detail-meta-item"><i class="ph ph-clock"></i> ${this.formatDate(ticket.updatedAt)}</div>
      </div>
    `;
  }

  renderConversation(ticket) {
    const thread = document.getElementById('conversation-thread');
    if (!thread) return;
    
    thread.innerHTML = ticket.conversation.map(msg => `
      <div class="conversation-message ${msg.type}">
        <img src="${msg.avatar}" alt="${msg.author}" class="message-avatar">
        <div class="message-content">
          <div class="message-bubble ${msg.type === 'internal' ? 'internal' : ''}">
            ${msg.type === 'internal' ? '<div class="internal-label">Internal Note</div>' : ''}
            ${this.escapeHtml(msg.content)}
          </div>
          <div class="message-meta">
            <span>${msg.author}</span>
            <span>·</span>
            <span>${this.formatDate(msg.timestamp)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderTicketProperties(ticket) {
    const container = document.getElementById('ticket-properties');
    if (!container) return;
    
    container.innerHTML = `
      <div class="property-item">
        <span class="property-label">Status</span>
        <span class="property-value">
          <select id="prop-status">
            <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>Open</option>
            <option value="pending" ${ticket.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
            <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Closed</option>
            <option value="on-hold" ${ticket.status === 'on-hold' ? 'selected' : ''}>On Hold</option>
          </select>
        </span>
      </div>
      <div class="property-item">
        <span class="property-label">Priority</span>
        <span class="property-value">
          <select id="prop-priority">
            <option value="low" ${ticket.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${ticket.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${ticket.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
        </span>
      </div>
      <div class="property-item">
        <span class="property-label">Assigned To</span>
        <span class="property-value" id="prop-assignee">${ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</span>
      </div>
      <div class="property-item">
        <span class="property-label">Category</span>
        <span class="property-value">${ticket.category}</span>
      </div>
      <div class="property-item">
        <span class="property-label">Source</span>
        <span class="property-value">${ticket.source}</span>
      </div>
      <div class="property-item">
        <span class="property-label">Created</span>
        <span class="property-value">${this.formatDateFull(ticket.createdAt)}</span>
      </div>
    `;
  }

  renderCustomerMini(ticket) {
    const container = document.getElementById('customer-mini');
    if (!container) return;
    
    container.innerHTML = `
      <img src="${ticket.customer.avatar}" alt="${ticket.customer.name}" class="customer-mini-avatar">
      <div class="customer-mini-info">
        <div class="customer-mini-name">${ticket.customer.name}</div>
        <div class="customer-mini-email">${ticket.customer.email || 'No email'}</div>
      </div>
    `;
  }

  renderTicketTags(ticket) {
    const container = document.getElementById('ticket-tags');
    if (!container) return;
    
    const tags = ticket.tags.length > 0 ? ticket.tags : ['bug', 'urgent', 'mobile'];
    container.innerHTML = tags.map(tag => `
      <span class="tag-item">${tag} <i class="ph ph-x tag-remove" data-tag="${tag}"></i></span>
    `).join('');
    
    container.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        ticket.tags = ticket.tags.filter(t => t !== tag);
        this.renderTicketTags(ticket);
      });
    });
  }

  renderRelatedTickets(ticket) {
    const container = document.getElementById('related-tickets');
    if (!container) return;
    
    const related = this.tickets
      .filter(t => t.customer.id === ticket.customer.id && t.id !== ticket.id)
      .slice(0, 4);
    
    if (related.length === 0) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:12px;">No related tickets</p>';
      return;
    }
    
    container.innerHTML = related.map(t => `
      <div class="related-ticket-item" onclick="window.location.href='ticket-details.html?id=${t.id}'">
        <span class="related-ticket-id">${t.id}</span>
        <span>${this.escapeHtml(t.subject.substring(0, 30))}${t.subject.length > 30 ? '...' : ''}</span>
      </div>
    `).join('');
  }

  renderCustomerInfo(ticket) {
    const container = document.getElementById('customer-info-card');
    if (!container) return;
    
    container.innerHTML = `
      <div class="customer-info-header">
        <img src="${ticket.customer.avatar}" alt="${ticket.customer.name}" class="customer-info-avatar">
        <div class="customer-info-main">
          <h3>${ticket.customer.name}</h3>
          <p>${ticket.customer.email}</p>
        </div>
      </div>
      <div class="customer-info-details">
        <div class="info-detail">
          <span class="info-detail-label">Phone</span>
          <span class="info-detail-value">${ticket.customer.phone || 'N/A'}</span>
        </div>
        <div class="info-detail">
          <span class="info-detail-label">Company</span>
          <span class="info-detail-value">${ticket.customer.company || 'N/A'}</span>
        </div>
        <div class="info-detail">
          <span class="info-detail-label">Plan</span>
          <span class="info-detail-value">${ticket.customer.plan || 'N/A'}</span>
        </div>
        <div class="info-detail">
          <span class="info-detail-label">Member Since</span>
          <span class="info-detail-value">${ticket.customer.joined || 'N/A'}</span>
        </div>
        <div class="info-detail">
          <span class="info-detail-label">Total Tickets</span>
          <span class="info-detail-value">${ticket.customer.tickets || 0}</span>
        </div>
        <div class="info-detail">
          <span class="info-detail-label">Customer ID</span>
          <span class="info-detail-value">${ticket.customer.id}</span>
        </div>
      </div>
    `;
  }

  renderTimeline(ticket) {
    const container = document.getElementById('timeline-list');
    if (!container) return;
    
    const events = [
      { type: 'ticket', text: `Ticket created`, date: ticket.createdAt },
      ...ticket.conversation.map(c => ({ type: c.type === 'agent' ? 'email' : 'ticket', text: `${c.type === 'agent' ? 'Reply from' : 'Message from'} ${c.author}`, date: c.timestamp })),
      ...ticket.timeline
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = events.map(evt => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-date">${this.formatDateFull(evt.date)}</div>
          <div class="timeline-text">${evt.text}</div>
        </div>
      </div>
    `).join('');
  }

  renderNotes(ticket) {
    const container = document.getElementById('notes-list');
    if (!container) return;
    
    if (ticket.notes.length === 0) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:14px;text-align:center;padding:20px;">No internal notes yet</p>';
      return;
    }
    
    container.innerHTML = ticket.notes.map(note => `
      <div class="note-item">
        <div class="note-header">
          <span class="note-author">${note.author}</span>
          <span class="note-time">${this.formatDate(note.timestamp)}</span>
        </div>
        <div class="note-text">${this.escapeHtml(note.content)}</div>
      </div>
    `).join('');
  }

  renderAttachments(ticket) {
    const container = document.getElementById('attachments-grid');
    if (!container) return;
    
    if (ticket.attachments.length === 0) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:14px;text-align:center;padding:20px;">No attachments</p>';
      return;
    }
    
    container.innerHTML = ticket.attachments.map(att => `
      <div class="attachment-item">
        <div class="attachment-icon"><i class="ph ph-file-text"></i></div>
        <div class="attachment-info">
          <div class="attachment-name">${att.name}</div>
          <div class="attachment-size">${att.size}</div>
        </div>
      </div>
    `).join('');
  }

  setupDetailEvents(ticket) {
    // Tab switching
    document.querySelectorAll('.ticket-detail-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ticket-detail-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.detail-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
      });
    });
    
    // Reply send
    document.getElementById('reply-send')?.addEventListener('click', () => {
      const text = document.getElementById('reply-text')?.value;
      if (!text || !text.trim()) return;
      
      const currentAgent = this.agents[0];
      ticket.conversation.push({
        type: this.isInternalNote ? 'internal' : 'agent',
        author: currentAgent.name,
        avatar: currentAgent.avatar,
        content: text.trim(),
        timestamp: new Date()
      });
      
      ticket.updatedAt = new Date();
      document.getElementById('reply-text').value = '';
      this.renderConversation(ticket);
      this.renderTimeline(ticket);
    });
    
    // Internal note toggle
    document.getElementById('note-toggle')?.addEventListener('click', () => {
      this.isInternalNote = !this.isInternalNote;
      const btn = document.getElementById('note-toggle');
      btn.style.color = this.isInternalNote ? '#f59e0b' : '';
      btn.style.background = this.isInternalNote ? '#fffbeb' : '';
    });
    
    // Add note
    document.getElementById('add-note-btn')?.addEventListener('click', () => {
      const text = document.getElementById('new-note-text')?.value;
      if (!text || !text.trim()) return;
      
      ticket.notes.push({
        author: 'Alex Morgan',
        content: text.trim(),
        timestamp: new Date()
      });
      
      document.getElementById('new-note-text').value = '';
      this.renderNotes(ticket);
    });
    
    // Saved replies modal
    document.getElementById('saved-reply-btn')?.addEventListener('click', () => {
      this.renderSavedRepliesModal();
      document.getElementById('saved-replies-modal').style.display = 'flex';
    });
    
    document.getElementById('saved-replies-close')?.addEventListener('click', () => {
      document.getElementById('saved-replies-modal').style.display = 'none';
    });
    
    // Add tag
    document.getElementById('add-tag-btn')?.addEventListener('click', () => {
      const tag = prompt('Enter tag name:');
      if (tag && tag.trim()) {
        if (!ticket.tags.includes(tag.trim())) {
          ticket.tags.push(tag.trim());
          this.renderTicketTags(ticket);
        }
      }
    });
    
    // Property changes
    document.getElementById('prop-status')?.addEventListener('change', (e) => {
      ticket.status = e.target.value;
      this.renderTicketHeader(ticket);
    });
    
    document.getElementById('prop-priority')?.addEventListener('change', (e) => {
      ticket.priority = e.target.value;
      this.renderTicketHeader(ticket);
    });
  }

  renderSavedRepliesModal() {
    const container = document.getElementById('saved-replies-list-modal');
    if (!container) return;
    
    container.innerHTML = this.savedReplies.map(reply => `
      <div class="saved-reply-modal-item" data-id="${reply.id}">
        <div class="saved-reply-modal-title">${reply.title}</div>
        <div class="saved-reply-modal-preview">${reply.content.substring(0, 100)}...</div>
      </div>
    `).join('');
    
    container.querySelectorAll('.saved-reply-modal-item').forEach(item => {
      item.addEventListener('click', () => {
        const reply = this.savedReplies.find(r => r.id === item.dataset.id);
        if (reply) {
          const textarea = document.getElementById('reply-text');
          if (textarea) {
            let content = reply.content
              .replace(/{{customer_name}}/g, 'Customer')
              .replace(/{{ticket_id}}/g, this.currentTicketId || '')
              .replace(/{{agent_name}}/g, 'Alex Morgan');
            textarea.value = content;
          }
        }
        document.getElementById('saved-replies-modal').style.display = 'none';
      });
    });
  }

  /* ============================================
     Saved Replies Page
     ============================================ */
  initSavedRepliesPage() {
    this.currentPage = 'replies';
    this.currentCategory = 'all';
    this.renderReplyCategories();
    this.renderRepliesList();
    this.setupSavedRepliesEvents();
    this.highlightCurrentTab();
  }

  renderReplyCategories() {
    const container = document.getElementById('replies-categories-list');
    if (!container) return;
    
    const categories = [
      { id: 'all', name: 'All Replies', count: this.savedReplies.length },
      { id: 'greetings', name: 'Greetings', count: this.savedReplies.filter(r => r.category === 'greetings').length },
      { id: 'account', name: 'Account Issues', count: this.savedReplies.filter(r => r.category === 'account').length },
      { id: 'billing', name: 'Billing', count: this.savedReplies.filter(r => r.category === 'billing').length },
      { id: 'technical', name: 'Technical', count: this.savedReplies.filter(r => r.category === 'technical').length },
      { id: 'closing', name: 'Closing', count: this.savedReplies.filter(r => r.category === 'closing').length }
    ];
    
    container.innerHTML = categories.map(cat => `
      <div class="replies-category-item ${cat.id === this.currentCategory ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.name}</span>
        <span class="replies-category-count">${cat.count}</span>
      </div>
    `).join('');
    
    container.querySelectorAll('.replies-category-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentCategory = item.dataset.category;
        this.renderReplyCategories();
        this.renderRepliesList();
      });
    });
  }

  renderRepliesList() {
    const container = document.getElementById('replies-list');
    if (!container) return;
    
    let filtered = this.savedReplies;
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(r => r.category === this.currentCategory);
    }
    
    const searchInput = document.getElementById('replies-search');
    if (searchInput && searchInput.value) {
      const q = searchInput.value.toLowerCase();
      filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.content.toLowerCase().includes(q));
    }
    
    container.innerHTML = filtered.map(reply => `
      <div class="reply-item" data-id="${reply.id}">
        <div class="reply-item-header">
          <span class="reply-item-title">${reply.title}</span>
          <span class="reply-item-category">${reply.category}</span>
        </div>
        <div class="reply-item-preview">${reply.content}</div>
      </div>
    `).join('');
  }

  setupSavedRepliesEvents() {
    const searchInput = document.getElementById('replies-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.renderRepliesList());
    }
    
    const modal = document.getElementById('reply-modal');
    document.getElementById('new-reply-btn')?.addEventListener('click', () => {
      document.getElementById('reply-modal-title').textContent = 'New Saved Reply';
      modal.style.display = 'flex';
    });
    
    document.getElementById('reply-modal-close')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    document.getElementById('reply-cancel')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    document.getElementById('reply-save')?.addEventListener('click', () => {
      const title = document.getElementById('reply-title')?.value;
      const category = document.getElementById('reply-category')?.value;
      const message = document.getElementById('reply-message')?.value;
      
      if (!title || !message) {
        alert('Please fill in all fields');
        return;
      }
      
      this.savedReplies.push({
        id: `r${this.savedReplies.length + 1}`,
        title: title,
        category: category || 'general',
        content: message
      });
      
      modal.style.display = 'none';
      this.renderReplyCategories();
      this.renderRepliesList();
      
      document.getElementById('reply-title').value = '';
      document.getElementById('reply-message').value = '';
    });
  }

  /* ============================================
     Knowledge Base Page
     ============================================ */
  initKnowledgeBasePage() {
    this.currentPage = 'kb';
    this.currentCategory = 'all';
    this.renderKBCategories();
    this.renderKBArticles();
    this.renderKBArticlesList();
    this.setupKBEvents();
    this.highlightCurrentTab();
  }

  renderKBCategories() {
    const container = document.getElementById('kb-categories-list');
    if (!container) return;
    
    const categories = [
      { id: 'all', name: 'All Categories', count: this.kbArticles.length },
      { id: 'getting-started', name: 'Getting Started', count: this.kbArticles.filter(a => a.category === 'getting-started').length },
      { id: 'account', name: 'Account & Billing', count: this.kbArticles.filter(a => a.category === 'account').length },
      { id: 'technical', name: 'Technical Support', count: this.kbArticles.filter(a => a.category === 'technical').length },
      { id: 'features', name: 'Features', count: this.kbArticles.filter(a => a.category === 'features').length },
      { id: 'integrations', name: 'Integrations', count: this.kbArticles.filter(a => a.category === 'integrations').length },
      { id: 'troubleshooting', name: 'Troubleshooting', count: this.kbArticles.filter(a => a.category === 'troubleshooting').length }
    ];
    
    container.innerHTML = categories.map(cat => `
      <div class="kb-category-item ${cat.id === this.currentCategory ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.name}</span>
        <span class="kb-category-count">${cat.count}</span>
      </div>
    `).join('');
    
    container.querySelectorAll('.kb-category-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentCategory = item.dataset.category;
        this.renderKBCategories();
        this.renderKBArticles();
        this.renderKBArticlesList();
      });
    });
  }

  renderKBArticles() {
    const container = document.getElementById('kb-articles-grid');
    const titleEl = document.getElementById('kb-section-title');
    if (!container) return;
    
    let filtered = this.kbArticles;
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(a => a.category === this.currentCategory);
    }
    
    if (titleEl) {
      titleEl.textContent = this.currentCategory === 'all' ? 'Popular Articles' : 
        this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1).replace('-', ' ');
    }
    
    const displayArticles = filtered.slice(0, 6);
    
    container.innerHTML = displayArticles.map(article => `
      <div class="kb-article-card" data-id="${article.id}">
        <span class="kb-article-category">${article.category}</span>
        <h4 class="kb-article-title">${article.title}</h4>
        <div class="kb-article-meta">
          <span><i class="ph ph-eye"></i> ${article.views.toLocaleString()} views</span>
          <span>Updated ${article.updated}</span>
        </div>
      </div>
    `).join('');
  }

  renderKBArticlesList() {
    const container = document.getElementById('kb-articles-list');
    if (!container) return;
    
    let filtered = this.kbArticles;
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(a => a.category === this.currentCategory);
    }
    
    container.innerHTML = filtered.map(article => `
      <div class="kb-article-list-item" data-id="${article.id}">
        <div>
          <div class="kb-article-list-title">${article.title}</div>
        </div>
        <div class="kb-article-list-meta">
          <span>${article.category}</span>
          <span><i class="ph ph-eye"></i> ${article.views.toLocaleString()}</span>
          <span>${article.updated}</span>
        </div>
      </div>
    `).join('');
  }

  setupKBEvents() {
    const searchInput = document.getElementById('kb-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        if (q) {
          this.kbArticles = this.kbArticles.filter(a => 
            a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
          );
        }
        this.renderKBArticles();
        this.renderKBArticlesList();
      });
    }
    
    const modal = document.getElementById('article-modal');
    document.getElementById('new-article-btn')?.addEventListener('click', () => {
      document.getElementById('article-modal-title').textContent = 'New Article';
      modal.style.display = 'flex';
    });
    
    document.getElementById('article-modal-close')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    document.getElementById('article-cancel')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    document.getElementById('article-save')?.addEventListener('click', () => {
      const title = document.getElementById('article-title')?.value;
      const category = document.getElementById('article-category')?.value;
      const content = document.getElementById('article-content')?.value;
      
      if (!title || !content) {
        alert('Please fill in all fields');
        return;
      }
      
      this.kbArticles.unshift({
        id: `kb${this.kbArticles.length + 1}`,
        title: title,
        category: category || 'general',
        views: 0,
        updated: new Date().toISOString().split('T')[0],
        content: content
      });
      
      modal.style.display = 'none';
      this.renderKBCategories();
      this.renderKBArticles();
      this.renderKBArticlesList();
      
      document.getElementById('article-title').value = '';
      document.getElementById('article-content').value = '';
    });
  }

  /* ============================================
     SLA Management Page
     ============================================ */
  initSLAPage() {
    this.currentPage = 'sla';
    this.renderSLAPolicies();
    this.renderSLAPerformance();
    this.setupSLAEvents();
    this.highlightCurrentTab();
  }

  renderSLAPolicies() {
    const tbody = document.getElementById('sla-policies-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = this.slaPolicies.map(policy => `
      <tr data-id="${policy.id}">
        <td><strong>${policy.name}</strong></td>
        <td>${policy.priority === 'all' ? 'All Priorities' : policy.priority.charAt(0).toUpperCase() + policy.priority.slice(1)}</td>
        <td>${policy.responseTime.hours}h ${policy.responseTime.minutes}m</td>
        <td>${policy.resolutionTime.hours}h ${policy.resolutionTime.minutes}m</td>
        <td><span class="status-badge ${policy.status === 'active' ? 'open' : 'closed'}">${policy.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn" title="Edit"><i class="ph ph-pencil-simple"></i></button>
            <button class="table-action-btn" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderSLAPerformance() {
    const container = document.getElementById('sla-performance-chart');
    const legend = document.getElementById('sla-performance-legend');
    if (!container || !legend) return;
    
    const data = { met: 92, breached: 6.6, warning: 1.4 };
    const colors = { met: '#10b981', breached: '#ef4444', warning: '#f59e0b' };
    
    let currentAngle = -90;
    const radius = 60;
    const cx = 70;
    const cy = 70;
    let paths = '';
    
    Object.entries(data).forEach(([key, value]) => {
      const angle = (value / 100) * 360;
      const startAngle = currentAngle * Math.PI / 180;
      const endAngle = (currentAngle + angle) * Math.PI / 180;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = angle > 180 ? 1 : 0;
      
      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[key]}"/>`;
      currentAngle += angle;
    });
    
    container.innerHTML = `
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="1"/>
        ${paths}
        <circle cx="${cx}" cy="${cy}" r="${radius * 0.6}" fill="white"/>
        <text x="${cx}" y="${cy - 5}" text-anchor="middle" font-size="24" font-weight="bold" fill="#111827">92%</text>
        <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="10" fill="#6b7280">SLA Met</text>
      </svg>
    `;
    
    legend.innerHTML = Object.entries(data).map(([key, value]) => `
      <div class="sla-legend-item">
        <span class="sla-legend-dot ${key}"></span>
        <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
        <strong>${value}%</strong>
      </div>
    `).join('');
  }

  setupSLAEvents() {
    const modal = document.getElementById('policy-modal');
    document.getElementById('new-policy-btn')?.addEventListener('click', () => {
      document.getElementById('policy-modal-title').textContent = 'New SLA Policy';
      modal.style.display = 'flex';
    });
    
    document.getElementById('policy-modal-close')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    document.getElementById('policy-cancel')?.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    document.getElementById('policy-save')?.addEventListener('click', () => {
      const name = document.getElementById('policy-name')?.value;
      const priority = document.getElementById('policy-priority')?.value;
      const status = document.getElementById('policy-status')?.value;
      const respHours = parseInt(document.getElementById('policy-response-hours')?.value || 0);
      const respMinutes = parseInt(document.getElementById('policy-response-minutes')?.value || 0);
      const resHours = parseInt(document.getElementById('policy-resolution-hours')?.value || 0);
      const resMinutes = parseInt(document.getElementById('policy-resolution-minutes')?.value || 0);
      
      if (!name) {
        alert('Please enter a policy name');
        return;
      }
      
      this.slaPolicies.push({
        id: `sla${this.slaPolicies.length + 1}`,
        name: name,
        priority: priority,
        responseTime: { hours: respHours, minutes: respMinutes },
        resolutionTime: { hours: resHours, minutes: resMinutes },
        status: status
      });
      
      modal.style.display = 'none';
      this.renderSLAPolicies();
      
      document.getElementById('policy-name').value = '';
      document.getElementById('policy-response-hours').value = '';
      document.getElementById('policy-response-minutes').value = '';
      document.getElementById('policy-resolution-hours').value = '';
      document.getElementById('policy-resolution-minutes').value = '';
    });
  }

  /* ============================================
     Customer Timeline Page
     ============================================ */
  initCustomerTimelinePage() {
    this.currentPage = 'timeline';
    this.currentCustomerId = this.customers[0].id;
    this.renderTimelineCustomers();
    this.renderTimelineEvents();
    this.setupTimelineEvents();
    this.highlightCurrentTab();
  }

  renderTimelineCustomers() {
    const container = document.getElementById('timeline-customers-list');
    if (!container) return;
    
    container.innerHTML = this.customers.map(customer => `
      <div class="timeline-customer-item ${customer.id === this.currentCustomerId ? 'active' : ''}" data-id="${customer.id}">
        <img src="${customer.avatar}" alt="${customer.name}" class="timeline-customer-avatar">
        <div class="timeline-customer-info">
          <div class="timeline-customer-name">${customer.name}</div>
          <div class="timeline-customer-email">${customer.email}</div>
        </div>
        <span class="timeline-customer-count">${customer.tickets}</span>
      </div>
    `).join('');
    
    container.querySelectorAll('.timeline-customer-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentCustomerId = item.dataset.id;
        this.renderTimelineCustomers();
        this.renderTimelineEvents();
      });
    });
  }

  renderTimelineEvents() {
    const header = document.getElementById('timeline-customer-header');
    const container = document.getElementById('timeline-events');
    if (!header || !container) return;
    
    const customer = this.customers.find(c => c.id === this.currentCustomerId);
    if (!customer) return;
    
    header.innerHTML = `
      <img src="${customer.avatar}" alt="${customer.name}" class="timeline-customer-header-avatar">
      <div class="timeline-customer-header-info">
        <h3>${customer.name}</h3>
        <p>${customer.email} · ${customer.company} · ${customer.plan} Plan</p>
      </div>
    `;
    
    const customerTickets = this.tickets.filter(t => t.customer.id === customer.id);
    const events = [];
    
    customerTickets.forEach(ticket => {
      events.push({
        type: 'ticket',
        date: ticket.createdAt,
        text: `Created ticket <strong>${ticket.id}</strong>: ${ticket.subject}`,
        ticket: ticket
      });
      
      ticket.conversation.forEach(msg => {
        if (msg.type === 'agent') {
          events.push({
            type: 'email',
            date: msg.timestamp,
            text: `Received reply from <strong>${msg.author}</strong> on ${ticket.id}`
          });
        }
      });
    });
    
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = events.map(evt => `
      <div class="timeline-event">
        <div class="timeline-event-dot ${evt.type}"></div>
        <div class="timeline-event-content">
          <div class="timeline-event-header">
            <span class="timeline-event-type ${evt.type}">${evt.type}</span>
            <span class="timeline-event-date">${this.formatDateFull(evt.date)}</span>
          </div>
          <div class="timeline-event-text">${evt.text}</div>
        </div>
      </div>
    `).join('');
  }

  setupTimelineEvents() {
    const searchInput = document.getElementById('timeline-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        if (!q) {
          this.renderTimelineCustomers();
          return;
        }
        
        const filtered = this.customers.filter(c => 
          c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
        );
        
        const container = document.getElementById('timeline-customers-list');
        if (container) {
          container.innerHTML = filtered.map(customer => `
            <div class="timeline-customer-item ${customer.id === this.currentCustomerId ? 'active' : ''}" data-id="${customer.id}">
              <img src="${customer.avatar}" alt="${customer.name}" class="timeline-customer-avatar">
              <div class="timeline-customer-info">
                <div class="timeline-customer-name">${customer.name}</div>
                <div class="timeline-customer-email">${customer.email}</div>
              </div>
              <span class="timeline-customer-count">${customer.tickets}</span>
            </div>
          `).join('');
          
          container.querySelectorAll('.timeline-customer-item').forEach(item => {
            item.addEventListener('click', () => {
              this.currentCustomerId = item.dataset.id;
              this.renderTimelineCustomers();
              this.renderTimelineEvents();
            });
          });
        }
      });
    }
  }
}

/* ============================================
   Modal Close on Overlay Click
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });
  
  // Keyboard shortcut for search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('support-search');
      if (searchInput) searchInput.focus();
    }
    
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
});