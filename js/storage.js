/**
 * OnePlace Enterprise v3.0 — Storage & Data Module
 * Manages all LocalStorage data for the dashboard
 */

const DASHBOARD_STORAGE_KEYS = {
  CONVERSATIONS: 'op_conversations',
  ACTIVITIES: 'op_activities',
  TEAM_MEMBERS: 'op_team_members',
  PLATFORM_STATS: 'op_platform_stats',
  DASHBOARD_SETTINGS: 'op_dashboard_settings',
  QUICK_ACTIONS: 'op_quick_actions',
  NOTIFICATIONS: 'op_notifications',
  AI_SUGGESTIONS: 'op_ai_suggestions'
};

// ============================================
// Sample Data Generators
// ============================================

const PLATFORM_COLORS = {
  gmail: { bg: '#EA4335', light: '#FDECEA', text: '#EA4335' },
  whatsapp: { bg: '#25D366', light: '#E8F5E9', text: '#25D366' },
  instagram: { bg: '#E4405F', light: '#FCE4EC', text: '#E4405F' },
  tiktok: { bg: '#000000', light: '#F5F5F5', text: '#000000' },
  x: { bg: '#1DA1F2', light: '#E3F2FD', text: '#1DA1F2' },
  linkedin: { bg: '#0A66C2', light: '#E3F2FD', text: '#0A66C2' }
};

const PLATFORM_NAMES = {
  gmail: 'Gmail',
  whatsapp: 'WhatsApp Business',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  x: 'X (Twitter)',
  linkedin: 'LinkedIn'
};

const SAMPLE_CUSTOMERS = [
  { name: 'John Doe', avatar: 'JD', color: '#6366f1' },
  { name: 'Sarah Williams', avatar: 'SW', color: '#8b5cf6' },
  { name: 'Jessica Wright', avatar: 'JW', color: '#ec4899' },
  { name: 'Alex Johnson', avatar: 'AJ', color: '#f43f5e' },
  { name: 'Michael Brown', avatar: 'MB', color: '#f97316' },
  { name: 'Emily Davis', avatar: 'ED', color: '#eab308' },
  { name: 'David Miller', avatar: 'DM', color: '#22c55e' },
  { name: 'Lisa Anderson', avatar: 'LA', color: '#06b6d4' },
  { name: 'Robert Taylor', avatar: 'RT', color: '#6366f1' },
  { name: 'Amanda White', avatar: 'AW', color: '#8b5cf6' },
  { name: 'Chris Martin', avatar: 'CM', color: '#ec4899' },
  { name: 'Laura Garcia', avatar: 'LG', color: '#f43f5e' }
];

const SAMPLE_MESSAGES = [
  'Project Updates & Requirements',
  'Order Confirmation',
  'Collaboration Opportunity',
  'Question about your product',
  'Feature Request',
  'Great video! 🔥',
  'Partnership Inquiry',
  'Need help with my order',
  'Feedback on the new update',
  'Booking inquiry',
  'Support ticket #4821',
  'Invoice question',
  'Meeting reschedule request',
  'Contract review needed',
  'New lead from campaign'
];

const TEAM_MEMBERS_DATA = [
  { id: 'tm1', name: 'Alex Morgan', avatar: 'AM', color: '#6366f1', photo: 'https://randomuser.me/api/portraits/women/65.jpg', role: 'Support Lead', conversations: 215, resolved: 189, responseRate: 94, rating: 4.9, workload: 85 },
  { id: 'tm2', name: 'Jake Cooper', avatar: 'JC', color: '#8b5cf6', photo: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Sales Rep', conversations: 178, resolved: 142, responseRate: 92, rating: 4.7, workload: 72 },
  { id: 'tm3', name: 'Cody Fisher', avatar: 'CF', color: '#ec4899', photo: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'Support Agent', conversations: 156, resolved: 130, responseRate: 91, rating: 4.6, workload: 68 },
  { id: 'tm4', name: 'Guy Hawkins', avatar: 'GH', color: '#f43f5e', photo: 'https://randomuser.me/api/portraits/men/54.jpg', role: 'Customer Success', conversations: 134, resolved: 112, responseRate: 90, rating: 4.5, workload: 60 },
  { id: 'tm5', name: 'Darlene Robertson', avatar: 'DR', color: '#f97316', photo: 'https://randomuser.me/api/portraits/women/68.jpg', role: 'Account Manager', conversations: 98, resolved: 78, responseRate: 89, rating: 4.4, workload: 40 }
];

// Fixed "today" snapshot used by dashboard widgets (matches design mockup)
const PLATFORM_SNAPSHOT = [
  { key: 'gmail', name: 'Gmail', unread: 24, messages: 30, conversations: 1988, responseRate: 92, avgResponseTime: 14, engagement: 7.2 },
  { key: 'whatsapp', name: 'WhatsApp Business', unread: 18, messages: 28, conversations: 1901, responseRate: 95, avgResponseTime: 12, engagement: 9.8 },
  { key: 'instagram', name: 'Instagram', unread: 16, messages: 20, conversations: 1556, responseRate: 88, avgResponseTime: 16, engagement: 8.7 },
  { key: 'tiktok', name: 'TikTok', unread: 12, messages: 16, conversations: 1123, responseRate: 85, avgResponseTime: 19, engagement: 7.4 },
  { key: 'x', name: 'X (Twitter)', unread: 20, messages: 20, conversations: 1210, responseRate: 90, avgResponseTime: 20, engagement: 6.3 },
  { key: 'linkedin', name: 'LinkedIn', unread: 14, messages: 14, conversations: 864, responseRate: 93, avgResponseTime: 22, engagement: 6.1 }
];

function opSeededRandom(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================
// Data Initialization
// ============================================

class DashboardStorage {
  constructor() {
    this.init();
  }

  init() {
    // Bump DATA_VERSION whenever the seed shape changes — stale demo
    // data from older versions is cleared so pages always match design.
    const DATA_VERSION = '3.1';
    if (localStorage.getItem('op_data_version') !== DATA_VERSION) {
      Object.values(DASHBOARD_STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      localStorage.setItem('op_data_version', DATA_VERSION);
    }

    if (!localStorage.getItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS)) {
      this.seedConversations();
    }
    if (!localStorage.getItem(DASHBOARD_STORAGE_KEYS.ACTIVITIES)) {
      this.seedActivities();
    }
    if (!localStorage.getItem(DASHBOARD_STORAGE_KEYS.TEAM_MEMBERS)) {
      this.seedTeamMembers();
    }
    if (!localStorage.getItem(DASHBOARD_STORAGE_KEYS.PLATFORM_STATS)) {
      this.seedPlatformStats();
    }
    if (!localStorage.getItem(DASHBOARD_STORAGE_KEYS.AI_SUGGESTIONS)) {
      this.seedAISuggestions();
    }
  }

  seedConversations() {
    const platforms = ['gmail', 'whatsapp', 'instagram', 'tiktok', 'x', 'linkedin'];
    const statuses = ['open', 'in-progress', 'pending', 'resolved'];
    const priorities = ['high', 'medium', 'low'];
    const conversations = [];

    for (let i = 0; i < 120; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const customer = SAMPLE_CUSTOMERS[Math.floor(Math.random() * SAMPLE_CUSTOMERS.length)];
      const message = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const isUnread = Math.random() > 0.6;
      const isStarred = Math.random() > 0.85;
      const assignedTo = TEAM_MEMBERS_DATA[Math.floor(Math.random() * TEAM_MEMBERS_DATA.length)].id;

      const hoursAgo = Math.floor(Math.random() * 168);
      const timestamp = new Date(Date.now() - hoursAgo * 3600000).toISOString();

      conversations.push({
        id: `conv_${i}`,
        platform,
        customer: { ...customer },
        message,
        status,
        priority,
        unread: isUnread,
        starred: isStarred,
        assignedTo,
        timestamp,
        responseTime: Math.floor(Math.random() * 45) + 5
      });
    }

    // Sort by timestamp desc
    conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    localStorage.setItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }

  seedActivities() {
    // Fixed activity feed matching the design mockup (times are today)
    const at = (h, m) => {
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };

    const activities = [
      { id: 'act_1', platform: 'gmail', title: 'New email from John Doe', description: 'Project Update & Requirements', timestamp: at(10, 30), read: false },
      { id: 'act_2', platform: 'whatsapp', title: 'New WhatsApp message from +1 (555) 123-4567', description: 'Need help with my order', timestamp: at(10, 15), read: false },
      { id: 'act_3', platform: 'instagram', title: 'New Instagram DM from jessica._wright', description: 'Collaboration Opportunity', timestamp: at(10, 8), read: false },
      { id: 'act_4', platform: 'tiktok', title: 'New comment on TikTok from @creative.vibes', description: 'Great video! 🔥', timestamp: at(9, 56), read: true },
      { id: 'act_5', platform: 'x', title: 'New mention from @design_master', description: '@oneplace_app Can you guys add a dark mode?', timestamp: at(9, 45), read: true },
      { id: 'act_6', platform: 'linkedin', title: 'New LinkedIn message from Michael Brown', description: 'Partnership Inquiry', timestamp: at(9, 30), read: true },
      { id: 'act_7', platform: 'whatsapp', title: 'WhatsApp conversation assigned to you', description: 'From +1 (669) 987-6543', timestamp: at(9, 20), read: true }
    ];

    localStorage.setItem(DASHBOARD_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }

  seedTeamMembers() {
    localStorage.setItem(DASHBOARD_STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(TEAM_MEMBERS_DATA));
  }

  seedPlatformStats() {
    const stats = {};
    PLATFORM_SNAPSHOT.forEach(p => {
      stats[p.key] = {
        conversations: p.conversations,
        messages: p.messages,
        unread: p.unread,
        messagesToday: p.unread,
        responseRate: p.responseRate,
        avgResponseTime: p.avgResponseTime,
        engagement: p.engagement
      };
    });
    localStorage.setItem(DASHBOARD_STORAGE_KEYS.PLATFORM_STATS, JSON.stringify(stats));
  }

  seedAISuggestions() {
    const suggestions = [
      { id: 'ai1', color: 'green', message: '12 conversations need quick response', priority: 'high' },
      { id: 'ai2', color: 'purple', message: '7 high-priority conversations', priority: 'high' },
      { id: 'ai3', color: 'gray', message: '3 unread WhatsApp messages', priority: 'medium' },
      { id: 'ai4', color: 'red', message: '5 new leads from Instagram', priority: 'medium' }
    ];
    localStorage.setItem(DASHBOARD_STORAGE_KEYS.AI_SUGGESTIONS, JSON.stringify(suggestions));
  }

  // Fixed "Recent Conversations" list shown on the main dashboard
  getRecentConversations() {
    const at = (h, m) => {
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };
    return [
      { id: 'rc1', platform: 'gmail', name: 'John Doe', subject: 'Project Update & Requirements', preview: 'Hi Sophia, please find the updated requirements...', timestamp: at(10, 30), unreadCount: 3 },
      { id: 'rc2', platform: 'whatsapp', name: 'Sarah Williams', subject: 'Order Confirmation', preview: 'Thank you! I have received my order.', timestamp: at(10, 28), unreadCount: 1 },
      { id: 'rc3', platform: 'instagram', name: 'Jessica Wright', subject: 'Collaboration Opportunity', preview: "Hi! We love your content. Let's collaborate!", timestamp: at(10, 15), unreadCount: 1 },
      { id: 'rc4', platform: 'tiktok', name: 'Alex Johnson', subject: 'Question about your product', preview: 'I saw your video and I have a question...', timestamp: at(10, 10), unreadCount: 0 },
      { id: 'rc5', platform: 'x', name: 'Michael Brown', subject: 'Feature Request', preview: 'Can you guys add a dark mode to the app?', timestamp: at(9, 58), unreadCount: 0 }
    ];
  }

  // ============================================
  // Getters
  // ============================================

  getConversations(filter = 'all', search = '') {
    const data = JSON.parse(localStorage.getItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS) || '[]');
    let filtered = data;

    if (filter !== 'all') {
      if (filter === 'unread') {
        filtered = data.filter(c => c.unread);
      } else if (filter === 'starred') {
        filtered = data.filter(c => c.starred);
      } else if (filter === 'assigned') {
        const session = OP.auth.getSession();
        // For demo, filter by first team member
        filtered = data.filter(c => c.assignedTo === 'tm1');
      } else {
        filtered = data.filter(c => c.platform === filter);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.customer.name.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q)
      );
    }

    return filtered;
  }

  getActivities(filter = 'all') {
    const data = JSON.parse(localStorage.getItem(DASHBOARD_STORAGE_KEYS.ACTIVITIES) || '[]');
    if (filter === 'all') return data;
    return data.filter(a => a.platform === filter);
  }

  getTeamMembers() {
    return JSON.parse(localStorage.getItem(DASHBOARD_STORAGE_KEYS.TEAM_MEMBERS) || '[]');
  }

  getPlatformStats() {
    return JSON.parse(localStorage.getItem(DASHBOARD_STORAGE_KEYS.PLATFORM_STATS) || '{}');
  }

  getAISuggestions() {
    return JSON.parse(localStorage.getItem(DASHBOARD_STORAGE_KEYS.AI_SUGGESTIONS) || '[]');
  }

  getDashboardStats() {
    const conversations = this.getConversations();
    const stats = this.getPlatformStats();
    const team = this.getTeamMembers();

    const totalConversations = conversations.length;
    const unreadMessages = conversations.filter(c => c.unread).length;
    const messagesToday = conversations.filter(c => {
      const date = new Date(c.timestamp);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length;
    const openConversations = conversations.filter(c => c.status === 'open' || c.status === 'in-progress').length;
    const resolvedToday = conversations.filter(c => {
      const date = new Date(c.timestamp);
      const today = new Date();
      return c.status === 'resolved' && date.toDateString() === today.toDateString();
    }).length;

    const avgResponseTime = Math.round(
      Object.values(stats).reduce((sum, s) => sum + s.avgResponseTime, 0) / Object.values(stats).length
    );

    const responseRate = Math.round(
      Object.values(stats).reduce((sum, s) => sum + s.responseRate, 0) / Object.values(stats).length
    );

    return {
      totalConversations,
      unreadMessages,
      messagesToday,
      responseRate,
      avgResponseTime,
      openConversations,
      resolvedToday,
      teamSize: team.length,
      aiSuggestions: this.getAISuggestions().length
    };
  }

  getConversationTrends(days = 7) {
    // Deterministic series (seeded) so charts are stable between reloads
    const rand = opSeededRandom(42);
    const platforms = ['gmail', 'whatsapp', 'instagram', 'tiktok', 'x', 'linkedin'];
    const labels = ['May 12', 'May 13', 'May 14', 'May 15', 'May 16', 'May 17', 'May 18'];
    const trends = [];

    for (let i = 0; i < days; i++) {
      const dayData = { date: labels[i] || `Day ${i + 1}` };
      platforms.forEach(p => {
        dayData[p] = Math.floor(rand() * 650) + 50;
      });
      trends.push(dayData);
    }

    return trends;
  }

  getAreaTrends(days = 30) {
    // Deterministic stacked-area series for the analytics page
    const rand = opSeededRandom(7);
    const platforms = ['linkedin', 'x', 'whatsapp', 'instagram', 'tiktok', 'gmail'];
    const trends = [];
    const start = new Date(2024, 4, 12); // May 12, 2024

    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dayData = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      platforms.forEach(p => {
        dayData[p] = Math.floor(rand() * 900) + 400;
      });
      trends.push(dayData);
    }

    return trends;
  }

  markConversationRead(id) {
    const conversations = this.getConversations();
    const idx = conversations.findIndex(c => c.id === id);
    if (idx !== -1) {
      conversations[idx].unread = false;
      localStorage.setItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
  }

  toggleStarConversation(id) {
    const conversations = this.getConversations();
    const idx = conversations.findIndex(c => c.id === id);
    if (idx !== -1) {
      conversations[idx].starred = !conversations[idx].starred;
      localStorage.setItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      return conversations[idx].starred;
    }
    return false;
  }

  addActivity(activity) {
    const activities = this.getActivities();
    activities.unshift({
      id: `act_${Date.now()}`,
      ...activity,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem(DASHBOARD_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 100)));
  }

  clearAllData() {
    Object.values(DASHBOARD_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
  }
}

// Initialize
window.DashboardStorage = DashboardStorage;


// ============================================
// Unified Inbox Extended Methods
// ============================================

DashboardStorage.prototype.getConversationById = function(id) {
  const conversations = this.getConversations();
  return conversations.find(c => c.id === id);
};

DashboardStorage.prototype.updateConversation = function(id, updates) {
  const conversations = this.getConversations();
  const idx = conversations.findIndex(c => c.id === id);
  if (idx !== -1) {
    conversations[idx] = { ...conversations[idx], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    return conversations[idx];
  }
  return null;
};

DashboardStorage.prototype.addMessage = function(conversationId, message) {
  const conv = this.getConversationById(conversationId);
  if (!conv) return null;

  if (!conv.messages) conv.messages = [];
  conv.messages.push({
    id: `msg_${conversationId}_${Date.now()}`,
    ...message,
    timestamp: message.timestamp || new Date().toISOString()
  });

  // Update last message preview
  if (message.type !== 'internal') {
    conv.message = message.text;
    conv.timestamp = new Date().toISOString();
  }

  this.updateConversation(conversationId, { messages: conv.messages, message: conv.message, timestamp: conv.timestamp });
  return conv;
};

DashboardStorage.prototype.addNote = function(conversationId, note) {
  const conv = this.getConversationById(conversationId);
  if (!conv) return null;

  if (!conv.notes) conv.notes = [];
  conv.notes.unshift({
    id: `note_${Date.now()}`,
    ...note,
    time: note.time || new Date().toISOString()
  });

  this.updateConversation(conversationId, { notes: conv.notes });
  return conv;
};

DashboardStorage.prototype.addTag = function(conversationId, tag) {
  const conv = this.getConversationById(conversationId);
  if (!conv) return null;

  if (!conv.tags) conv.tags = [];
  if (!conv.tags.includes(tag)) {
    conv.tags.push(tag);
    this.updateConversation(conversationId, { tags: conv.tags });
  }
  return conv;
};

DashboardStorage.prototype.removeTag = function(conversationId, tag) {
  const conv = this.getConversationById(conversationId);
  if (!conv || !conv.tags) return null;

  conv.tags = conv.tags.filter(t => t !== tag);
  this.updateConversation(conversationId, { tags: conv.tags });
  return conv;
};

DashboardStorage.prototype.assignConversation = function(conversationId, memberId) {
  return this.updateConversation(conversationId, { assignedTo: memberId });
};

DashboardStorage.prototype.changeStatus = function(conversationId, status) {
  return this.updateConversation(conversationId, { status });
};

DashboardStorage.prototype.getConversationsByStatus = function(status) {
  return this.getConversations().filter(c => c.status === status);
};

DashboardStorage.prototype.archiveConversation = function(id) {
  const conv = this.getConversationById(id);
  if (!conv) return null;
  const newStatus = conv.status === 'archived' ? 'open' : 'archived';
  return this.updateConversation(id, { status: newStatus });
};

DashboardStorage.prototype.markSpam = function(id) {
  const conv = this.getConversationById(id);
  if (!conv) return null;
  const newStatus = conv.status === 'spam' ? 'open' : 'spam';
  return this.updateConversation(id, { status: newStatus });
};

DashboardStorage.prototype.deleteConversation = function(id) {
  const conv = this.getConversationById(id);
  if (!conv) return null;
  const newStatus = conv.status === 'trash' ? 'open' : 'trash';
  return this.updateConversation(id, { status: newStatus });
};

DashboardStorage.prototype.restoreConversation = function(id) {
  return this.updateConversation(id, { status: 'open' });
};

DashboardStorage.prototype.markAllRead = function() {
  const conversations = this.getConversations();
  conversations.forEach(c => {
    c.unread = false;
    c.unreadMessages = 0;
  });
  localStorage.setItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
};

// Update seedConversations to include richer data
const originalSeedConversations = DashboardStorage.prototype.seedConversations;
DashboardStorage.prototype.seedConversations = function() {
  const platforms = ['gmail', 'whatsapp', 'instagram', 'tiktok', 'x', 'linkedin'];
  const statuses = ['open', 'in-progress', 'pending', 'resolved'];
  const priorities = ['high', 'medium', 'low'];
  const conversations = [];

  for (let i = 0; i < 120; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const customer = SAMPLE_CUSTOMERS[Math.floor(Math.random() * SAMPLE_CUSTOMERS.length)];
    const message = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const isUnread = Math.random() > 0.6;
    const isStarred = Math.random() > 0.85;
    const assignedTo = TEAM_MEMBERS_DATA[Math.floor(Math.random() * TEAM_MEMBERS_DATA.length)].id;

    const hoursAgo = Math.floor(Math.random() * 168);
    const timestamp = new Date(Date.now() - hoursAgo * 3600000).toISOString();

    // Generate sample tags
    const allTags = ['Project', 'Proposal', 'Support', 'Sales', 'Urgent', 'Follow-up', 'Bug', 'Feature Request'];
    const numTags = Math.floor(Math.random() * 3);
    const tags = [];
    for (let t = 0; t < numTags; t++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    // Generate sample notes
    const notes = [];
    if (Math.random() > 0.5) {
      const noteTexts = [
        'Customer is interested in upgrading to Pro plan. Follow up next week.',
        'Discussing timeline for Q2 marketing campaign.',
        'Client requested demo of new features.',
        'High priority issue - escalate to engineering.',
        'Waiting for budget approval from finance team.'
      ];
      notes.push({
        id: `note_${i}`,
        author: TEAM_MEMBERS_DATA[Math.floor(Math.random() * TEAM_MEMBERS_DATA.length)].name,
        text: noteTexts[Math.floor(Math.random() * noteTexts.length)],
        time: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    }

    // Generate sample attachments
    const attachments = [];
    if (Math.random() > 0.7) {
      const fileNames = [
        { name: 'Project_Proposal.pdf', size: '2.4 MB', type: 'pdf' },
        { name: 'Timeline.xlsx', size: '1.1 MB', type: 'xlsx' },
        { name: 'Screenshot_01.png', size: '856 KB', type: 'image' },
        { name: 'Contract_Draft.docx', size: '340 KB', type: 'doc' },
        { name: 'Brand_Guidelines.pdf', size: '5.2 MB', type: 'pdf' }
      ];
      const att = fileNames[Math.floor(Math.random() * fileNames.length)];
      attachments.push(att);
    }

    // Generate previous conversations
    const prevConvs = [];
    const prevTitles = ['Project Kickoff Discussion', 'Budget Discussion', 'Initial Inquiry', 'Follow-up Call', 'Contract Review'];
    const numPrev = Math.floor(Math.random() * 3);
    for (let p = 0; p < numPrev; p++) {
      prevConvs.push({
        title: prevTitles[Math.floor(Math.random() * prevTitles.length)],
        date: new Date(Date.now() - (p + 1) * 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        platform
      });
    }

    conversations.push({
      id: `conv_${i}`,
      platform,
      customer: { 
        ...customer, 
        email: customer.name.toLowerCase().replace(' ', '.') + '@example.com' 
      },
      message,
      status,
      priority,
      unread: isUnread,
      unreadMessages: isUnread ? Math.floor(Math.random() * 5) + 1 : 0,
      starred: isStarred,
      assignedTo,
      timestamp,
      responseTime: Math.floor(Math.random() * 45) + 5,
      tags,
      notes,
      attachments,
      previousConversations: prevConvs,
      messages: null // Will be generated on first access
    });
  }

  // Sort by timestamp desc
  conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  localStorage.setItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
};