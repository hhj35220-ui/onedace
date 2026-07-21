/**
 * OnePlace Enterprise v3.0 — LinkedIn Module
 * Vanilla JavaScript (ES6+)
 */

const LINKEDIN_STORAGE_KEYS = {
  LINKEDIN_DATA: 'op_linkedin_data',
  LINKEDIN_MESSAGES: 'op_linkedin_messages',
  LINKEDIN_CONNECTIONS: 'op_linkedin_connections',
  LINKEDIN_MENTIONS: 'op_linkedin_mentions',
  LINKEDIN_ENGAGEMENTS: 'op_linkedin_engagements',
  LINKEDIN_SETTINGS: 'op_linkedin_settings',
  LINKEDIN_INTEGRATION: 'op_linkedin_integration'
};

// ============================================
// Sample Data
// ============================================

const LINKEDIN_CONTACTS = [
  { id: 'lc1', name: 'Jennifer Martinez', title: 'Marketing Director at Tech Solutions Inc.', avatar: 'https://ui-avatars.com/api/?name=Jennifer+Martinez&background=ec4899&color=fff&size=128', initials: 'JM', color: '#ec4899', unread: true, time: '9:21 AM', preview: 'Hi Alex, I\'d like to connect and discuss potential opportunities.', type: 'inmail' },
  { id: 'lc2', name: 'Robert Taylor', title: 'Senior Manager at InnovateCo', avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=6366f1&color=fff&size=128', initials: 'RT', color: '#6366f1', unread: true, time: '8:45 AM', preview: 'Thanks for reaching out! Let\'s schedule a call next week.', type: 'message' },
  { id: 'lc3', name: 'Lisa Anderson', title: 'Product Manager at DesignStudio', avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=22c55e&color=fff&size=128', initials: 'LA', color: '#22c55e', unread: false, time: 'Yesterday', preview: 'Can we schedule a quick call?', type: 'connection' },
  { id: 'lc4', name: 'William Thomas', title: 'CEO at StartupXYZ', avatar: 'https://ui-avatars.com/api/?name=William+Thomas&background=f97316&color=fff&size=128', initials: 'WT', color: '#f97316', unread: true, time: 'Yesterday', preview: 'We\'re looking for a solution that can help us improve our customer engagement.', type: 'inmail' },
  { id: 'lc5', name: 'Maria Garcia', title: 'HR Director at GlobalCorp', avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=8b5cf6&color=fff&size=128', initials: 'MG', color: '#8b5cf6', unread: false, time: 'May 27', preview: 'I\'d be happy to share how we can help.', type: 'message' },
  { id: 'lc6', name: 'Christopher Lee', title: 'Sales Lead at Enterprise Inc.', avatar: 'https://ui-avatars.com/api/?name=Christopher+Lee&background=06b6d4&color=fff&size=128', initials: 'CL', color: '#06b6d4', unread: true, time: 'May 27', preview: 'That sounds great! Can we schedule a demo?', type: 'inmail' },
  { id: 'lc7', name: 'Amanda White', title: 'VP of Marketing at BrandCo', avatar: 'https://ui-avatars.com/api/?name=Amanda+White&background=f43f5e&color=fff&size=128', initials: 'AW', color: '#f43f5e', unread: false, time: 'May 26', preview: 'Would you be open to a partnership discussion?', type: 'message' },
  { id: 'lc8', name: 'Daniel Harris', title: 'Founder at TechVentures', avatar: 'https://ui-avatars.com/api/?name=Daniel+Harris&background=eab308&color=fff&size=128', initials: 'DH', color: '#eab308', unread: true, time: 'May 25', preview: 'Perfect! See you then.', type: 'connection' }
];

const LINKEDIN_CONNECTION_REQUESTS = [
  { id: 'cr1', name: 'Christopher Lee', title: 'Senior Manager at InnovateCo', avatar: 'https://ui-avatars.com/api/?name=Christopher+Lee&background=06b6d4&color=fff&size=128', preview: 'I\'d like to add you to my professional network on LinkedIn. I came across your profile and was impressed by your work in marketing...', status: 'pending' },
  { id: 'cr2', name: 'Amanda White', title: 'Marketing Director at BrandCo', avatar: 'https://ui-avatars.com/api/?name=Amanda+White&background=f43f5e&color=fff&size=128', preview: 'Hi Alex, I\'d like to connect with you. I\'ve been following your company\'s growth and would love to explore potential collaboration opportunities...', status: 'pending' },
  { id: 'cr3', name: 'Daniel Harris', title: 'Product Manager at TechVentures', avatar: 'https://ui-avatars.com/api/?name=Daniel+Harris&background=eab308&color=fff&size=128', preview: 'Hello Alex, I came across your profile and was impressed by your experience. I\'d love to connect and potentially discuss how our companies could work together...', status: 'pending' },
  { id: 'cr4', name: 'Jessica Clark', title: 'Operations Manager at ScaleUp', avatar: 'https://ui-avatars.com/api/?name=Jessica+Clark&background=6366f1&color=fff&size=128', preview: 'Hi Alex, I\'d like to connect. I\'m always looking to expand my network with professionals in the tech industry...', status: 'pending' },
  { id: 'cr5', name: 'Matthew Allen', title: 'Recruiter at TalentHub', avatar: 'https://ui-avatars.com/api/?name=Matthew+Allen&background=8b5cf6&color=fff&size=128', preview: 'Hello Alex, I have an exciting opportunity that aligns with your background. Would you be open to a brief conversation?', status: 'pending' },
  { id: 'cr6', name: 'Sarah Johnson', title: 'Business Development at GrowthCo', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=ec4899&color=fff&size=128', preview: 'Hi Alex, I\'d love to connect and learn more about your work at Tech Solutions Inc. Let\'s stay in touch!', status: 'pending' }
];

const LINKEDIN_MENTIONS_DATA = [
  { id: 'mn1', name: 'Tech Solutions Inc.', title: 'Company Page', avatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0A66C2&color=fff&size=128', post: 'The Future of Customer Engagement', content: 'Great insights on customer engagement! @Alex Morgan has been leading the charge on this initiative.', likes: 24, comments: 8, shares: 3, time: '9:21 AM' },
  { id: 'mn2', name: 'LinkedIn Business', title: 'Official Account', avatar: 'https://ui-avatars.com/api/?name=LinkedIn&background=0A66C2&color=fff&size=128', post: '5 Ways to Improve Response Time', content: 'Excellent point about automation! @Alex Morgan shared some great strategies in the comments.', likes: 156, comments: 23, shares: 12, time: 'May 27' },
  { id: 'mn3', name: 'Marketing Professionals', title: 'Group', avatar: 'https://ui-avatars.com/api/?name=Marketing+Pro&background=f97316&color=fff&size=128', post: 'Why Automation Matters in 2024', content: '@Alex Morgan made an excellent point about the importance of personalized automation...', likes: 89, comments: 15, shares: 7, time: 'May 25' },
  { id: 'mn4', name: 'SaaS Growth Hub', title: 'Community', avatar: 'https://ui-avatars.com/api/?name=SaaS+Growth&background=22c55e&color=fff&size=128', post: 'Customer Communication Best Practices', content: 'Thanks @Alex Morgan for sharing your insights on customer communication strategies!', likes: 67, comments: 12, shares: 5, time: 'May 24' },
  { id: 'mn5', name: 'Digital Leaders', title: 'Group', avatar: 'https://ui-avatars.com/api/?name=Digital+Leaders&background=8b5cf6&color=fff&size=128', post: 'Building Stronger Customer Relationships', content: '@Alex Morgan what are your thoughts on @OnePlace for customer engagement?', likes: 45, comments: 9, shares: 2, time: 'May 23' },
  { id: 'mn6', name: 'Tech Innovators', title: 'Community', avatar: 'https://ui-avatars.com/api/?name=Tech+Innovators&background=06b6d4&color=fff&size=128', post: 'The State of CRM in 2024', content: 'Great discussion! @Alex Morgan your perspective on CRM integration was spot on.', likes: 112, comments: 18, shares: 8, time: 'May 22' }
];

const LINKEDIN_ENGAGEMENTS_DATA = [
  { id: 'en1', name: 'The Future of Customer Engagement', author: 'Tech Solutions Inc.', avatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0A66C2&color=fff&size=128', type: 'like', user: 'Jennifer Martinez', userAvatar: 'https://ui-avatars.com/api/?name=Jennifer+Martinez&background=ec4899&color=fff&size=128', likes: 24, comments: 8, shares: 3, time: '9:21 AM' },
  { id: 'en2', name: '5 Ways to Improve Response Time', author: 'LinkedIn Business', avatar: 'https://ui-avatars.com/api/?name=LinkedIn&background=0A66C2&color=fff&size=128', type: 'comment', user: 'Robert Taylor', userAvatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=6366f1&color=fff&size=128', comment: 'Great insights! We implemented similar strategies and saw a 40% improvement.', likes: 156, comments: 23, shares: 12, time: 'May 27' },
  { id: 'en3', name: 'Why Automation Matters in 2024', author: 'Marketing Professionals', avatar: 'https://ui-avatars.com/api/?name=Marketing+Pro&background=f97316&color=fff&size=128', type: 'share', user: 'Lisa Anderson', userAvatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=22c55e&color=fff&size=128', likes: 89, comments: 15, shares: 7, time: 'May 25' },
  { id: 'en4', name: 'Customer Communication Best Practices', author: 'SaaS Growth Hub', avatar: 'https://ui-avatars.com/api/?name=SaaS+Growth&background=22c55e&color=fff&size=128', type: 'like', user: 'William Thomas', userAvatar: 'https://ui-avatars.com/api/?name=William+Thomas&background=f97316&color=fff&size=128', likes: 67, comments: 12, shares: 5, time: 'May 24' },
  { id: 'en5', name: 'Building Stronger Customer Relationships', author: 'Digital Leaders', avatar: 'https://ui-avatars.com/api/?name=Digital+Leaders&background=8b5cf6&color=fff&size=128', type: 'comment', user: 'Maria Garcia', userAvatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=8b5cf6&color=fff&size=128', comment: 'This is exactly what our team needed. Thank you for sharing!', likes: 45, comments: 9, shares: 2, time: 'May 23' },
  { id: 'en6', name: 'The State of CRM in 2024', author: 'Tech Innovators', avatar: 'https://ui-avatars.com/api/?name=Tech+Innovators&background=06b6d4&color=fff&size=128', type: 'share', user: 'Christopher Lee', userAvatar: 'https://ui-avatars.com/api/?name=Christopher+Lee&background=06b6d4&color=fff&size=128', likes: 112, comments: 18, shares: 8, time: 'May 22' }
];

const SAMPLE_CONVERSATION_MESSAGES = {
  lc1: [
    { type: 'incoming', text: 'Hi Alex, I\'d like to connect and discuss potential opportunities.', time: '9:15 AM' },
    { type: 'outgoing', text: 'Hi Jennifer! Thanks for reaching out. I\'d love to hear more about what you have in mind.', time: '9:18 AM' },
    { type: 'incoming', text: 'Great! I\'m looking for a solution that can help us improve our customer engagement. Do you have time for a quick call this week?', time: '9:21 AM' }
  ],
  lc2: [
    { type: 'incoming', text: 'Thanks for reaching out! Let\'s schedule a call next week.', time: '8:30 AM' },
    { type: 'outgoing', text: 'Sounds good! How about Tuesday at 2 PM?', time: '8:35 AM' },
    { type: 'incoming', text: 'Tuesday works for me. Looking forward to it!', time: '8:45 AM' }
  ],
  lc3: [
    { type: 'incoming', text: 'Can we schedule a quick call?', time: 'Yesterday' },
    { type: 'outgoing', text: 'Sure! What time works for you?', time: 'Yesterday' },
    { type: 'incoming', text: 'How about tomorrow at 10 AM?', time: 'Yesterday' }
  ],
  lc4: [
    { type: 'incoming', text: 'We\'re looking for a solution that can help us improve our customer engagement.', time: 'Yesterday' },
    { type: 'outgoing', text: 'I\'d be happy to show you how OnePlace can help with that!', time: 'Yesterday' },
    { type: 'incoming', text: 'That sounds great! Can we schedule a demo?', time: 'Yesterday' }
  ],
  lc5: [
    { type: 'outgoing', text: 'Hi Maria, thanks for connecting!', time: 'May 27' },
    { type: 'incoming', text: 'You\'re welcome! I\'d be happy to share how we can help.', time: 'May 27' }
  ],
  lc6: [
    { type: 'incoming', text: 'That sounds great! Can we schedule a demo?', time: 'May 27' },
    { type: 'outgoing', text: 'Absolutely! How about next Monday?', time: 'May 27' },
    { type: 'incoming', text: 'Monday works. What time?', time: 'May 27' }
  ],
  lc7: [
    { type: 'incoming', text: 'Would you be open to a partnership discussion?', time: 'May 26' },
    { type: 'outgoing', text: 'Definitely! Let\'s set up a meeting.', time: 'May 26' }
  ],
  lc8: [
    { type: 'outgoing', text: 'Looking forward to our call tomorrow!', time: 'May 25' },
    { type: 'incoming', text: 'Perfect! See you then.', time: 'May 25' }
  ]
};

const AI_SUGGESTIONS = [
  { text: 'I\'d be happy to show you how OnePlace can help with that!', label: 'Reply' },
  { text: 'That sounds great! Can we schedule a demo for next week?', label: 'Reply' },
  { text: 'Absolutely! How does Monday at 2 PM work for you?', label: 'Reply' },
  { text: 'Thanks for your interest! Let me send you some more information.', label: 'Reply' }
];

const AI_INSIGHTS_DATA = [
  { type: 'high_priority', title: 'High Response Rate', desc: 'Your response rate is 15% higher than last week', icon: 'ph-trend-up', priority: 'high' },
  { type: 'best_time', title: 'Best Time to Message', desc: 'You get the highest engagement on Tue-Thu, 9-11 AM', icon: 'ph-clock', priority: 'medium' },
  { type: 'profile', title: 'Profile Optimization', desc: 'Your profile is 85% complete. Add skills to reach 100%', icon: 'ph-user', priority: 'medium' },
  { type: 'growth', title: 'Connection Growth', desc: 'You gained 47 new connections this week (+23.6%)', icon: 'ph-users', priority: 'low' }
];

// ============================================
// LinkedIn Storage
// ============================================

class LinkedInStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(LINKEDIN_STORAGE_KEYS.LINKEDIN_DATA)) {
      this.seedData();
    }
  }

  seedData() {
    const data = {
      contacts: LINKEDIN_CONTACTS,
      connections: LINKEDIN_CONNECTION_REQUESTS,
      mentions: LINKEDIN_MENTIONS_DATA,
      engagements: LINKEDIN_ENGAGEMENTS_DATA,
      messages: SAMPLE_CONVERSATION_MESSAGES,
      stats: {
        totalConversations: 128,
        connectionRequests: 47,
        messagesReceived: 89,
        inMailMessages: 35,
        profileViews: 246,
        postEngagements: 312
      }
    };
    localStorage.setItem(LINKEDIN_STORAGE_KEYS.LINKEDIN_DATA, JSON.stringify(data));
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(LINKEDIN_STORAGE_KEYS.LINKEDIN_DATA)) || {};
    } catch {
      return {};
    }
  }

  saveData(data) {
    localStorage.setItem(LINKEDIN_STORAGE_KEYS.LINKEDIN_DATA, JSON.stringify(data));
  }

  getContacts() {
    return this.getData().contacts || [];
  }

  getConnections() {
    return this.getData().connections || [];
  }

  getMentions() {
    return this.getData().mentions || [];
  }

  getEngagements() {
    return this.getData().engagements || [];
  }

  getMessages(contactId) {
    const data = this.getData();
    return data.messages?.[contactId] || [];
  }

  addMessage(contactId, message) {
    const data = this.getData();
    if (!data.messages) data.messages = {};
    if (!data.messages[contactId]) data.messages[contactId] = [];
    data.messages[contactId].push(message);
    this.saveData(data);
  }

  markContactRead(contactId) {
    const data = this.getData();
    const contact = data.contacts?.find(c => c.id === contactId);
    if (contact) {
      contact.unread = false;
      this.saveData(data);
    }
  }

  updateConnectionStatus(id, status) {
    const data = this.getData();
    const conn = data.connections?.find(c => c.id === id);
    if (conn) {
      conn.status = status;
      this.saveData(data);
    }
  }

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(LINKEDIN_STORAGE_KEYS.LINKEDIN_SETTINGS)) || this.getDefaultSettings();
    } catch {
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      defaultResponseTime: '2h',
      timezone: 'UTC-5',
      emailNotifications: true,
      autoMarkRead: true,
      aiSuggestions: true,
      autoConnect: false,
      typingIndicator: true,
      syncCrm: true,
      autoLeads: true,
      twoFactor: true,
      sessionTimeout: true
    };
  }

  saveSettings(settings) {
    localStorage.setItem(LINKEDIN_STORAGE_KEYS.LINKEDIN_SETTINGS, JSON.stringify(settings));
  }
}

// ============================================
// LinkedIn App
// ============================================

class LinkedInApp {
  constructor() {
    this.storage = new LinkedInStorage();
    this.dashboard = new DashboardApp();
    this.currentFilter = 'all';
    this.currentContact = null;
    this.init();
  }

  init() {
    this.renderSidebar();
    this.bindEvents();
    this.initOverviewPage();
  }

  // ============================================
  // Sidebar Rendering (reuse dashboard pattern)
  // ============================================
  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;
    this.dashboard.renderSidebar();
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

    // Theme toggle
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
        OP.toast.show('Notifications panel', 'info');
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

    // Search
    const searchInput = document.getElementById('linkedin-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }

  handleSearch(query) {
    const lower = query.toLowerCase();
    // Filter visible lists based on search
    document.querySelectorAll('.message-list-item, .connection-request-item, .mention-item, .engagement-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(lower) ? '' : 'none';
    });
  }

  // ============================================
  // Overview Page
  // ============================================
  initOverviewPage() {
    this.renderConversationTrendChart();
    this.renderTopConversations();
    this.renderAIInsights();
    this.renderRecentConversations();
    this.renderConnectionRequests();
  }

  renderConversationTrendChart() {
    const container = document.getElementById('conversation-trend-chart');
    if (!container) return;

    const days = ['May 22', 'May 23', 'May 24', 'May 25', 'May 26', 'May 27', 'May 28'];
    const messagesData = [45, 52, 48, 61, 55, 67, 58];
    const inmailsData = [12, 15, 18, 14, 20, 22, 19];

    const width = container.clientWidth || 500;
    const height = 180;
    const padding = { top: 10, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...messagesData, ...inmailsData);

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const val = Math.round(maxVal * (1 - i / 4));
      svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--gray-200)" stroke-dasharray="3" stroke-width="1"/>`;
      svg += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--gray-400)">${val}</text>`;
    }

    // X labels
    const stepX = chartW / (days.length - 1);
    days.forEach((d, i) => {
      const x = padding.left + i * stepX;
      svg += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--gray-400)">${d}</text>`;
    });

    // Messages line
    let msgPath = '';
    messagesData.forEach((v, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (v / maxVal) * chartH;
      msgPath += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
    });
    svg += `<path d="${msgPath}" fill="none" stroke="#0A66C2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

    // InMails line
    let inmailPath = '';
    inmailsData.forEach((v, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (v / maxVal) * chartH;
      inmailPath += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
    });
    svg += `<path d="${inmailPath}" fill="none" stroke="#7B68EE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Dots
    messagesData.forEach((v, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (v / maxVal) * chartH;
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="#0A66C2" stroke="white" stroke-width="2"/>`;
    });

    inmailsData.forEach((v, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (v / maxVal) * chartH;
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="#7B68EE" stroke="white" stroke-width="2"/>`;
    });

    svg += '</svg>';
    container.innerHTML = svg;
  }

  renderTopConversations() {
    const container = document.getElementById('top-conversations');
    if (!container) return;

    const contacts = this.storage.getContacts().slice(0, 5);
    container.innerHTML = contacts.map(c => `
      <div class="top-conversation-item">
        <img src="${c.avatar}" alt="${c.name}" class="top-conv-avatar">
        <div class="top-conv-info">
          <div class="top-conv-name">${c.name}</div>
          <div class="top-conv-role">${c.title}</div>
        </div>
        <div class="top-conv-actions">
          <button class="top-conv-action" title="Message"><i class="ph ph-chat-circle-text"></i></button>
          <button class="top-conv-action" title="Call"><i class="ph ph-phone"></i></button>
          <button class="top-conv-action" title="More"><i class="ph ph-dots-three"></i></button>
        </div>
      </div>
    `).join('');
  }

  renderAIInsights() {
    const container = document.getElementById('ai-insights');
    if (!container) return;

    container.innerHTML = AI_INSIGHTS_DATA.map(insight => `
      <div class="ai-insight-item priority-${insight.priority}">
        <div class="ai-insight-icon"><i class="ph ${insight.icon}"></i></div>
        <div class="ai-insight-content">
          <div class="ai-insight-title">${insight.title}</div>
          <div class="ai-insight-desc">${insight.desc}</div>
          <div class="ai-insight-action">
            <button class="btn btn-sm btn-primary">View Details</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderRecentConversations() {
    const container = document.getElementById('recent-conversations');
    if (!container) return;

    const contacts = this.storage.getContacts().slice(0, 5);
    container.innerHTML = contacts.map(c => `
      <div class="recent-conversation-item" data-id="${c.id}">
        <img src="${c.avatar}" alt="${c.name}" class="recent-conv-avatar">
        <div class="recent-conv-info">
          <div class="recent-conv-name">
            ${c.name}
            ${c.unread ? '<span class="unread-dot"></span>' : ''}
          </div>
          <div class="recent-conv-preview">${c.preview}</div>
        </div>
        <div class="recent-conv-meta">
          <span class="recent-conv-time">${c.time}</span>
          ${c.unread ? '<span class="recent-conv-badge unread">New</span>' : ''}
        </div>
      </div>
    `).join('');

    // Click handlers
    container.querySelectorAll('.recent-conversation-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.href = `messages.html?contact=${item.dataset.id}`;
      });
    });
  }

  renderConnectionRequests() {
    const container = document.getElementById('connection-requests-list');
    if (!container) return;

    const connections = this.storage.getConnections().slice(0, 5);
    container.innerHTML = connections.map(c => `
      <div class="connection-request-item" data-id="${c.id}">
        <img src="${c.avatar}" alt="${c.name}" class="conn-req-avatar">
        <div class="conn-req-info">
          <div class="conn-req-name">${c.name}</div>
          <div class="conn-req-title">${c.title}</div>
        </div>
        <div class="conn-req-actions">
          <button class="conn-req-btn accept" data-action="accept" data-id="${c.id}">Accept</button>
          <button class="conn-req-btn ignore" data-action="ignore" data-id="${c.id}">Ignore</button>
        </div>
      </div>
    `).join('');

    // Action handlers
    container.querySelectorAll('.conn-req-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === 'accept') {
          this.storage.updateConnectionStatus(id, 'accepted');
          OP.toast.show('Connection request accepted', 'success');
        } else {
          this.storage.updateConnectionStatus(id, 'ignored');
          OP.toast.show('Connection request ignored', 'info');
        }
        btn.closest('.connection-request-item').remove();
      });
    });
  }

  // ============================================
  // Messages Page
  // ============================================
  initMessagesPage() {
    this.renderMessageList('messages-list', LINKEDIN_CONTACTS);
    this.bindMessageFilters();

    const firstConversation = document.querySelector('.message-list-item');
    if (firstConversation) {
      firstConversation.classList.add('active');
      this.openConversation(firstConversation.dataset.id);
    }
  }

  initCompanyInboxPage() {
    // Company inbox uses a subset of contacts
    const companyContacts = LINKEDIN_CONTACTS.slice(0, 6);
    this.renderMessageList('company-messages-list', companyContacts);
    this.bindMessageFilters();
  }

  renderMessageList(containerId, contacts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = contacts.map(c => `
      <div class="message-list-item ${c.unread ? 'unread' : ''}" data-id="${c.id}">
        <img src="${c.avatar}" alt="${c.name}" class="msg-list-avatar">
        <div class="msg-list-info">
          <div class="msg-list-name">
            ${c.name}
            ${c.unread ? '<span class="unread-indicator"></span>' : ''}
          </div>
          <div class="msg-list-preview">${c.preview}</div>
          <div class="msg-list-meta">
            <span class="msg-list-time">${c.time}</span>
            <div class="msg-list-badges">
              ${c.type === 'inmail' ? '<span class="msg-list-badge inmail">InMail</span>' : ''}
              ${c.type === 'connection' ? '<span class="msg-list-badge connection">Connection</span>' : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Click handlers
    container.querySelectorAll('.message-list-item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.message-list-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.openConversation(item.dataset.id);
      });
    });
  }

  bindMessageFilters() {
    document.querySelectorAll('.msg-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.msg-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        this.filterMessages(filter);
      });
    });
  }

  filterMessages(filter) {
    const items = document.querySelectorAll('.message-list-item');
    items.forEach(item => {
      const id = item.dataset.id;
      const contact = LINKEDIN_CONTACTS.find(c => c.id === id);
      if (!contact) return;

      let show = true;
      if (filter === 'unread') show = contact.unread;
      else if (filter === 'inmail') show = contact.type === 'inmail';
      else if (filter === 'connections') show = contact.type === 'connection';

      item.style.display = show ? '' : 'none';
    });
  }

  openConversation(contactId) {
    const contact = LINKEDIN_CONTACTS.find(c => c.id === contactId);
    if (!contact) return;

    this.currentContact = contact;
    this.storage.markContactRead(contactId);

    const emptyEl = document.getElementById('detail-empty') || document.getElementById('company-detail-empty');
    const contentEl = document.getElementById('detail-content') || document.getElementById('company-detail-content');

    if (emptyEl) emptyEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'flex';

      const avatarEl = contentEl.querySelector('#detail-avatar') || contentEl.querySelector('#company-detail-avatar');
      const nameEl = contentEl.querySelector('#detail-name') || contentEl.querySelector('#company-detail-name');
      const titleEl = contentEl.querySelector('#detail-title') || contentEl.querySelector('#company-detail-title');

      if (avatarEl) avatarEl.src = contact.avatar;
      if (nameEl) nameEl.textContent = contact.name;
      if (titleEl) titleEl.textContent = contact.title;

      this.renderMessages(contactId);
      this.renderAISuggestions();
      this.renderProfilePanel(contact);
    }
  }

  renderProfilePanel(contact) {
    const emptyProfile = document.getElementById('profile-empty');
    const profileDetails = document.getElementById('profile-details');

    if (emptyProfile) emptyProfile.style.display = 'none';
    if (!profileDetails) return;

    profileDetails.style.display = 'flex';

    const avatarEl = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-name');
    const titleEl = document.getElementById('profile-title');
    const typeEl = document.getElementById('profile-type');
    const stageEl = document.getElementById('profile-stage');
    const lastContactedEl = document.getElementById('profile-last-contacted');
    const locationEl = document.getElementById('profile-location');
    const connectionTypeEl = document.getElementById('profile-connection-type');
    const notesEl = document.getElementById('profile-notes');

    if (avatarEl) avatarEl.src = contact.avatar;
    if (nameEl) nameEl.textContent = contact.name;
    if (titleEl) titleEl.textContent = contact.title;
    if (typeEl) typeEl.textContent = contact.type === 'inmail' ? 'InMail' : contact.type === 'connection' ? 'Connection' : 'Message';
    if (stageEl) stageEl.textContent = contact.unread ? 'New' : 'Active';
    if (lastContactedEl) lastContactedEl.textContent = contact.time || '—';
    if (locationEl) locationEl.textContent = contact.location || 'Remote';
    if (connectionTypeEl) connectionTypeEl.textContent = contact.type === 'inmail' ? 'InMail' : contact.type === 'connection' ? 'Connection' : 'Message';
    if (notesEl) notesEl.textContent = contact.notes || 'No notes yet. Add follow-up details to capture next steps.';
  }

  renderMessages(contactId) {
    const container = document.getElementById('detail-messages') || document.getElementById('company-detail-messages');
    if (!container) return;

    const messages = this.storage.getMessages(contactId);
    container.innerHTML = messages.map(m => `
      <div class="message-bubble ${m.type}">
        <div>${this.escapeHtml(m.text)}</div>
        <div class="message-bubble-time">${m.time}</div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }

  renderAISuggestions() {
    const container = document.getElementById('ai-suggestions-bar') || document.getElementById('company-ai-suggestions');
    if (!container) return;

    container.innerHTML = AI_SUGGESTIONS.map(s => `
      <button class="ai-suggestion-chip" data-text="${this.escapeHtml(s.text)}">${s.label}: ${this.escapeHtml(s.text.substring(0, 40))}...</button>
    `).join('');

    container.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('message-input') || document.getElementById('company-message-input');
        if (input) {
          input.value = chip.dataset.text;
          input.focus();
        }
      });
    });
  }

  // ============================================
  // Connection Requests Page
  // ============================================
  initConnectionRequestsPage() {
    this.renderConnectionRequestsList();

    const firstRequest = document.querySelector('.connection-request-item');
    if (firstRequest) {
      firstRequest.classList.add('active');
      this.openConnectionDetail(firstRequest.dataset.id);
    }
  }

  renderConnectionRequestsList() {
    const container = document.getElementById('connection-list');
    if (!container) return;

    const connections = this.storage.getConnections();
    container.innerHTML = connections.map(c => `
      <div class="connection-request-item" data-id="${c.id}">
        <img src="${c.avatar}" alt="${c.name}" class="conn-req-avatar">
        <div class="conn-req-info">
          <div class="conn-req-name">${c.name}</div>
          <div class="conn-req-title">${c.title}</div>
          <div class="conn-req-preview">${c.preview}</div>
        </div>
        <div class="conn-req-meta">
          <span class="msg-list-badge connection">${c.status === 'pending' ? 'New' : c.status}</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.connection-request-item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.connection-request-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.openConnectionDetail(item.dataset.id);
      });
    });
  }

  openConnectionDetail(id) {
    const conn = this.storage.getConnections().find(c => c.id === id);
    if (!conn) return;

    const emptyEl = document.getElementById('connection-detail-empty');
    const contentEl = document.getElementById('connection-detail-content');

    if (emptyEl) emptyEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'flex';

      document.getElementById('conn-detail-avatar').src = conn.avatar;
      document.getElementById('conn-detail-name').textContent = conn.name;
      document.getElementById('conn-detail-title').textContent = conn.title;

      const preview = document.getElementById('connection-preview');
      preview.innerHTML = `
        <div class="connection-preview-text">
          <p><strong>${conn.name}</strong> would like to add you to their professional network.</p>
          <p>${conn.preview}</p>
        </div>
      `;

      const acceptBtn = document.getElementById('accept-btn');
      const ignoreBtn = document.getElementById('ignore-btn');
      const listItem = document.querySelector(`.connection-request-item[data-id="${id}"]`);

      if (acceptBtn) {
        acceptBtn.onclick = () => {
          this.storage.updateConnectionStatus(id, 'accepted');
          OP.toast.show(`Connected with ${conn.name}`, 'success');
          if (listItem) listItem.remove();
        };
      }
      if (ignoreBtn) {
        ignoreBtn.onclick = () => {
          this.storage.updateConnectionStatus(id, 'ignored');
          OP.toast.show('Request ignored', 'info');
          if (listItem) listItem.remove();
        };
      }
    }
  }

  // ============================================
  // Mentions Page
  // ============================================
  initMentionsPage() {
    this.renderMentionsList();

    const firstMention = document.querySelector('.mention-item');
    if (firstMention) {
      firstMention.classList.add('active');
      this.openMentionDetail(firstMention.dataset.id);
    }
  }

  renderMentionsList() {
    const container = document.getElementById('mentions-list');
    if (!container) return;

    const mentions = this.storage.getMentions();
    container.innerHTML = mentions.map(m => `
      <div class="message-list-item mention-item" data-id="${m.id}">
        <img src="${m.avatar}" alt="${m.name}" class="msg-list-avatar">
        <div class="msg-list-info">
          <div class="msg-list-name">${m.name}</div>
          <div class="msg-list-preview">${m.post}</div>
          <div class="msg-list-meta">
            <span class="msg-list-time">${m.time}</span>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.mention-item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.mention-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.openMentionDetail(item.dataset.id);
      });
    });
  }

  openMentionDetail(id) {
    const mention = LINKEDIN_MENTIONS_DATA.find(m => m.id === id);
    if (!mention) return;

    const emptyEl = document.getElementById('mention-detail-empty');
    const contentEl = document.getElementById('mention-detail-content');

    if (emptyEl) emptyEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'flex';

      document.getElementById('mention-detail-avatar').src = mention.avatar;
      document.getElementById('mention-detail-name').textContent = mention.name;
      document.getElementById('mention-detail-title').textContent = mention.title;

      const postEl = document.getElementById('mention-post');
      postEl.innerHTML = `
        <div class="post-card">
          <div class="post-header">
            <img src="${mention.avatar}" alt="${mention.name}" class="post-author-avatar">
            <div class="post-author-info">
              <h4>${mention.name}</h4>
              <p>${mention.title}</p>
            </div>
          </div>
          <div class="post-content">${mention.content}</div>
          <div class="post-image"><i class="ph ph-image"></i></div>
          <div class="post-stats">
            <span class="post-stat"><i class="ph ph-heart"></i> ${mention.likes} Likes</span>
            <span class="post-stat"><i class="ph ph-chat-circle"></i> ${mention.comments} Comments</span>
            <span class="post-stat"><i class="ph ph-share-network"></i> ${mention.shares} Shares</span>
          </div>
        </div>
      `;
    }
  }

  // ============================================
  // Post Engagements Page
  // ============================================
  initPostEngagementsPage() {
    this.renderEngagementsList();

    const firstEngagement = document.querySelector('.engagement-item');
    if (firstEngagement) {
      firstEngagement.classList.add('active');
      this.openEngagementDetail(firstEngagement.dataset.id);
    }
  }

  renderEngagementsList() {
    const container = document.getElementById('engagements-list');
    if (!container) return;

    const engagements = this.storage.getEngagements();
    container.innerHTML = engagements.map(e => `
      <div class="message-list-item engagement-item" data-id="${e.id}">
        <img src="${e.userAvatar}" alt="${e.user}" class="msg-list-avatar">
        <div class="msg-list-info">
          <div class="msg-list-name">${e.user} ${e.type === 'like' ? 'liked' : e.type === 'comment' ? 'commented on' : 'shared'} your post</div>
          <div class="msg-list-preview">${e.name}</div>
          <div class="msg-list-meta">
            <span class="msg-list-time">${e.time}</span>
            <span class="msg-list-badge inmail">${e.type}</span>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.engagement-item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.engagement-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.openEngagementDetail(item.dataset.id);
      });
    });
  }

  openEngagementDetail(id) {
    const engagement = LINKEDIN_ENGAGEMENTS_DATA.find(e => e.id === id);
    if (!engagement) return;

    const emptyEl = document.getElementById('engagement-detail-empty');
    const contentEl = document.getElementById('engagement-detail-content');

    if (emptyEl) emptyEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'flex';

      document.getElementById('engagement-detail-avatar').src = engagement.userAvatar;
      document.getElementById('engagement-detail-name').textContent = engagement.user;
      document.getElementById('engagement-detail-title').textContent = engagement.type === 'like' ? 'Liked your post' : engagement.type === 'comment' ? 'Commented on your post' : 'Shared your post';

      const postEl = document.getElementById('engagement-post');
      postEl.innerHTML = `
        <div class="post-card">
          <div class="post-header">
            <img src="${engagement.avatar}" alt="${engagement.author}" class="post-author-avatar">
            <div class="post-author-info">
              <h4>${engagement.author}</h4>
              <p>Original Post</p>
            </div>
          </div>
          <div class="post-content"><strong>${engagement.name}</strong></div>
          ${engagement.comment ? `<div class="post-content" style="background: var(--gray-50); padding: var(--space-3); border-radius: var(--radius-lg); margin-top: var(--space-2);"><strong>${engagement.user}:</strong> ${engagement.comment}</div>` : ''}
          <div class="post-stats">
            <span class="post-stat"><i class="ph ph-heart"></i> ${engagement.likes} Likes</span>
            <span class="post-stat"><i class="ph ph-chat-circle"></i> ${engagement.comments} Comments</span>
            <span class="post-stat"><i class="ph ph-share-network"></i> ${engagement.shares} Shares</span>
          </div>
        </div>
      `;
    }
  }

  // ============================================
  // Integration Page
  // ============================================
  initIntegrationPage() {
    const syncBtn = document.getElementById('sync-now-btn');
    const syncBtnBottom = document.getElementById('sync-now-btn-bottom');
    const disconnectBtn = document.getElementById('disconnect-btn');

    const doSync = () => {
      OP.loading.show();
      setTimeout(() => {
        OP.loading.hide();
        OP.toast.show('LinkedIn data synced successfully', 'success');
      }, 1500);
    };

    if (syncBtn) syncBtn.addEventListener('click', doSync);
    if (syncBtnBottom) syncBtnBottom.addEventListener('click', doSync);

    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to disconnect LinkedIn?')) {
          OP.toast.show('LinkedIn disconnected', 'warning');
          setTimeout(() => {
            window.location.href = '../integrations/index.html';
          }, 1000);
        }
      });
    }
  }

  // ============================================
  // Settings Page
  // ============================================
  initSettingsPage() {
    const settings = this.storage.getSettings();

    // Load settings into form
    document.getElementById('default-response-time').value = settings.defaultResponseTime;
    document.getElementById('timezone').value = settings.timezone;
    document.getElementById('email-notifs').checked = settings.emailNotifications;
    document.getElementById('auto-read').checked = settings.autoMarkRead;
    document.getElementById('ai-suggestions').checked = settings.aiSuggestions;
    document.getElementById('auto-connect').checked = settings.autoConnect;
    document.getElementById('typing-indicator').checked = settings.typingIndicator;
    document.getElementById('sync-crm').checked = settings.syncCrm;
    document.getElementById('auto-leads').checked = settings.autoLeads;
    document.getElementById('2fa').checked = settings.twoFactor;
    document.getElementById('session-timeout').checked = settings.sessionTimeout;

    // Save handler
    document.getElementById('save-settings-btn').addEventListener('click', () => {
      const newSettings = {
        defaultResponseTime: document.getElementById('default-response-time').value,
        timezone: document.getElementById('timezone').value,
        emailNotifications: document.getElementById('email-notifs').checked,
        autoMarkRead: document.getElementById('auto-read').checked,
        aiSuggestions: document.getElementById('ai-suggestions').checked,
        autoConnect: document.getElementById('auto-connect').checked,
        typingIndicator: document.getElementById('typing-indicator').checked,
        syncCrm: document.getElementById('sync-crm').checked,
        autoLeads: document.getElementById('auto-leads').checked,
        twoFactor: document.getElementById('2fa').checked,
        sessionTimeout: document.getElementById('session-timeout').checked
      };
      this.storage.saveSettings(newSettings);
      OP.toast.show('Settings saved successfully', 'success');
    });

    // Reset handler
    document.getElementById('reset-settings-btn').addEventListener('click', () => {
      if (confirm('Reset all LinkedIn settings to default?')) {
        this.storage.saveSettings(this.storage.getDefaultSettings());
        OP.toast.show('Settings reset to default', 'info');
        setTimeout(() => location.reload(), 500);
      }
    });
  }

  // ============================================
  // Utilities
  // ============================================
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Expose
window.LinkedInApp = LinkedInApp;
window.LinkedInStorage = LinkedInStorage;