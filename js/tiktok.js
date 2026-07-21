/**
 * OnePlace Enterprise — TikTok Module
 * Pixel-perfect recreation of design reference.
 */

const TIKTOK_STORAGE_KEYS = {
  CONVERSATIONS: 'op_tiktok_conversations',
  COMMENTS: 'op_tiktok_comments',
  MENTIONS: 'op_tiktok_mentions',
  VIDEO_INTERACTIONS: 'op_tiktok_video_interactions',
  INTEGRATION: 'op_tiktok_integration',
  SETTINGS: 'op_tiktok_settings'
};

// ============================================
// Sample Data — Matches Design Reference Exactly
// ============================================

const TIKTOK_SAMPLE_CUSTOMERS = [
  { id: 'tc1', name: 'sarah.johnson', handle: '@sarahjohnson', avatar: 'SJ', color: '#fe2c55', status: 'online', leadScore: 85, customerStatus: 'Active', totalOrders: 8, totalSpent: '$1,245.00', location: 'Canada', localTime: '10:34 AM', labels: ['VIP Customer', 'New Customer'] },
  { id: 'tc2', name: 'michael_brown', handle: '@michaelbrown', avatar: 'MB', color: '#25f4ee', status: 'offline', leadScore: 62, customerStatus: 'Active', totalOrders: 3, totalSpent: '$450.00', location: 'USA', localTime: '1:34 PM', labels: ['New Customer'] },
  { id: 'tc3', name: 'olivia.rodriguez', handle: '@oliviarodriguez', avatar: 'OR', color: '#f59e0b', status: 'away', leadScore: 91, customerStatus: 'Active', totalOrders: 15, totalSpent: '$2,890.00', location: 'Mexico', localTime: '12:34 PM', labels: ['VIP Customer'] },
  { id: 'tc4', name: 'james.wilson', handle: '@jameswilson', avatar: 'JW', color: '#8b5cf6', status: 'online', leadScore: 45, customerStatus: 'Inactive', totalOrders: 1, totalSpent: '$89.00', location: 'UK', localTime: '6:34 PM', labels: [] },
  { id: 'tc5', name: 'emma.davis', handle: '@emmadavis', avatar: 'ED', color: '#10b981', status: 'online', leadScore: 78, customerStatus: 'Active', totalOrders: 5, totalSpent: '$780.00', location: 'Australia', localTime: '2:34 AM', labels: ['Returning'] },
  { id: 'tc6', name: 'david.thomas', handle: '@davidthomas', avatar: 'DT', color: '#6366f1', status: 'offline', leadScore: 55, customerStatus: 'Active', totalOrders: 2, totalSpent: '$234.00', location: 'Germany', localTime: '7:34 PM', labels: [] },
  { id: 'tc7', name: 'sophia.martinez', handle: '@sophiamartinez', avatar: 'SM', color: '#ec4899', status: 'away', leadScore: 88, customerStatus: 'Active', totalOrders: 12, totalSpent: '$1,890.00', location: 'Spain', localTime: '7:34 PM', labels: ['VIP Customer'] }
];

const TIKTOK_SAMPLE_CONVERSATIONS = [
  { id: 'tconv1', customerId: 'tc1', lastMessage: 'Hi! Do you ship to Canada?', unread: true, timestamp: new Date(Date.now() - 2 * 60000).toISOString(), priority: 'high' },
  { id: 'tconv2', customerId: 'tc2', lastMessage: 'Love your products! 🔥', unread: true, timestamp: new Date(Date.now() - 5 * 60000).toISOString(), priority: 'medium' },
  { id: 'tconv3', customerId: 'tc3', lastMessage: 'Can you tell me the price?', unread: false, timestamp: new Date(Date.now() - 10 * 60000).toISOString(), priority: 'low' },
  { id: 'tconv4', customerId: 'tc4', lastMessage: 'When will it be back in stock?', unread: false, timestamp: new Date(Date.now() - 15 * 60000).toISOString(), priority: 'medium' },
  { id: 'tconv5', customerId: 'tc5', lastMessage: 'Thank you so much! 💜', unread: false, timestamp: new Date(Date.now() - 25 * 60000).toISOString(), priority: 'low' },
  { id: 'tconv6', customerId: 'tc6', lastMessage: 'Is this product still valid?', unread: true, timestamp: new Date(Date.now() - 30 * 60000).toISOString(), priority: 'high' },
  { id: 'tconv7', customerId: 'tc7', lastMessage: 'I love your new collection!', unread: false, timestamp: new Date(Date.now() - 60 * 60000).toISOString(), priority: 'medium' }
];

const CHAT_MESSAGES = {
  tconv1: [
    { id: 'm1', sender: 'customer', text: 'Hi! Do you ship to Canada?', time: '10:20 AM' },
    { id: 'm2', sender: 'agent', text: 'Yes! We ship to Canada 🇨🇦', time: '10:21 AM' },
    { id: 'm3', sender: 'customer', text: 'What are the shipping fees?', time: '10:22 AM' },
    { id: 'm4', sender: 'agent', text: 'Shipping to Canada is $7.99 and free on orders over $100 🎉', time: '10:23 AM' },
    { id: 'm5', sender: 'customer', text: 'Great! I\'ll place an order today.', time: '10:24 AM' }
  ],
  tconv2: [
    { id: 'm1', sender: 'customer', text: 'Love your products! 🔥', time: '9:15 AM' },
    { id: 'm2', sender: 'agent', text: 'Thanks so much! Your order #12345 is confirmed. 🎉', time: '9:16 AM' }
  ],
  tconv6: [
    { id: 'm1', sender: 'customer', text: 'Is this product still valid?', time: '10:00 AM' }
  ]
};

const AI_REPLY_CHIPS = [
  'Thanks for reaching out! How can we help you today?',
  'Shipping Information: We ship worldwide! Shipping usually takes 3-5 business days.',
  'Order Status: Sure! Let me check your order status for you.',
  'Return Policy: We accept returns within 30 days of purchase. Please check our return policy.'
];

const TIKTOK_SAMPLE_COMMENTS = [
  { id: 'tcmt1', author: 'lisa_park', authorHandle: '@lisa_park', authorAvatar: 'LP', authorColor: '#fe2c55', text: 'Love this collection! 🔥', videoTitle: 'New Product Unboxing!', likes: 24, time: new Date(Date.now() - 30 * 60000).toISOString(), priority: 'high', aiReply: 'Thank you so much! We\'re glad you love it. Which item is your favorite? 🔥' },
  { id: 'tcmt2', author: 'john_doe', authorHandle: '@johndoe', authorAvatar: 'JD', authorColor: '#25f4ee', text: 'How much is this?', videoTitle: 'How to Get More Views', likes: 12, time: new Date(Date.now() - 2 * 3600000).toISOString(), priority: 'medium', aiReply: 'Hi! The price varies by item. Check our bio link for current pricing! 💰' },
  { id: 'tcmt3', author: 'emma_roberts', authorHandle: '@emmaroberts', authorAvatar: 'ER', authorColor: '#f59e0b', text: 'This is exactly what I needed! 💯', videoTitle: 'Behind the Scenes', likes: 8, time: new Date(Date.now() - 4 * 3600000).toISOString(), priority: 'low', aiReply: null },
  { id: 'tcmt4', author: 'mike_wilson', authorHandle: '@mikewilliams', authorAvatar: 'MW', authorColor: '#8b5cf6', text: 'Can I become a reseller?', videoTitle: 'Q&A with the Team', likes: 15, time: new Date(Date.now() - 5 * 3600000).toISOString(), priority: 'high', aiReply: 'Yes! It comes in black, white, and navy. Check our store! 🖤' }
];

const TIKTOK_SAMPLE_MENTIONS = [
  { id: 'tmen1', author: 'fashion.daily', authorHandle: '@fashiondaily', authorAvatar: 'FD', authorColor: '#fe2c55', text: 'Mentioned you in their story collection! 🔥', videoTitle: 'Fashion Week Highlights', likes: 156, time: new Date(Date.now() - 2 * 60000).toISOString(), followers: '12.4K' },
  { id: 'tmen2', author: 'style.inspo', authorHandle: '@styleinspo', authorAvatar: 'SI', authorColor: '#25f4ee', text: 'Just tried your product! @acmesolutions', videoTitle: 'Product Review', likes: 89, time: new Date(Date.now() - 10 * 60000).toISOString(), followers: '8.2K' },
  { id: 'tmen3', author: 'trendy.looks', authorHandle: '@trendylooks', authorAvatar: 'TL', authorColor: '#f59e0b', text: '@acmesolutions any restock update?', videoTitle: 'Outfit of the Day', likes: 45, time: new Date(Date.now() - 15 * 60000).toISOString(), followers: '24.1K' },
  { id: 'tmen4', author: 'outfit_of_the_day', authorHandle: '@outfitoftheday', authorAvatar: 'OD', authorColor: '#8b5cf6', text: 'Thanks @acmesolutions! 🙌', videoTitle: 'Styling Tips', likes: 67, time: new Date(Date.now() - 20 * 60000).toISOString(), followers: '45.6K' }
];

const TIKTOK_SAMPLE_VIDEOS = [
  { id: 'v1', title: 'New Product Unboxing!', date: 'May 26, 2024', views: '2.3K', comments: 172, likes: '1.7K' },
  { id: 'v2', title: 'How to Get More Views', date: 'May 24, 2024', views: '1.8K', comments: 156, likes: '1.6K' },
  { id: 'v3', title: 'Behind the Scenes', date: 'May 23, 2024', views: '1.2K', comments: 108, likes: '1.1K' },
  { id: 'v4', title: 'Q&A with the Team', date: 'May 22, 2024', views: '1.5K', comments: 133, likes: '982' }
];

const TIKTOK_AI_RECOMMENDATIONS = [
  { id: 'ai1', type: 'High Intent Conversations', count: 12, desc: '12 conversations need attention', priority: 'high', icon: 'ph-warning-circle', iconColor: '#ef4444', bgColor: '#fef2f2' },
  { id: 'ai2', type: 'Response Rate', count: 8, desc: 'Your response rate is excellent', priority: 'medium', icon: 'ph-check-circle', iconColor: '#fe2c55', bgColor: '#fff0f3' },
  { id: 'ai3', type: 'Engagement Opportunity', count: 3, desc: '5 videos can get more reach', priority: 'low', icon: 'ph-trend-up', iconColor: '#10b981', bgColor: '#ecfdf5' },
  { id: 'ai4', type: 'New Followers', count: 142, desc: '142 new followers this week', priority: 'low', icon: 'ph-users', iconColor: '#f59e0b', bgColor: '#fffbeb' }
];

const ENGAGEMENT_DATA = [
  { label: 'Direct Messages', value: 499, color: '#6366f1', percent: 40 },
  { label: 'Comments', value: 324, color: '#f59e0b', percent: 25 },
  { label: 'Mentions', value: 200, color: '#10b981', percent: 20 },
  { label: 'Video Interactions', value: 162, color: '#ef4444', percent: 10 },
  { label: 'Shares', value: 63, color: '#8b5cf6', percent: 5 }
];

const ACCOUNT_STATUS = {
  handle: '@acmesolutions',
  followers: '24.6K',
  following: 312,
  likes: '128K',
  connectedDate: 'May 13, 2024',
  connectionHealth: 100,
  followerTrend: '+ 12.5%',
  followingTrend: '+ 5.1%',
  likesTrend: '+ 15.3%'
};

const SAVED_REPLIES = [
  { id: 'sr1', title: 'Welcome Message', category: 'General', text: 'Hi there! Thanks for reaching out. How can we help you today?', usage: 34 },
  { id: 'sr2', title: 'Shipping Information', category: 'General', text: 'We offer worldwide shipping! Shipping usually takes 3-5 business days.', usage: 245 },
  { id: 'sr3', title: 'Order Status', category: 'Orders', text: 'Sure! Let me check your order status for you.', usage: 18 },
  { id: 'sr4', title: 'Return Policy', category: 'Returns', text: 'You can return within 30 days of purchase.', usage: 82 }
];

const SAVED_REPLY_CATEGORIES = [
  { id: 'all', label: 'All Replies', count: 12 },
  { id: 'welcome', label: 'Welcome Message', count: 4 },
  { id: 'shipping', label: 'Shipping', count: 3 },
  { id: 'orders', label: 'Order Status', count: 2 },
  { id: 'products', label: 'Products', count: 1 },
  { id: 'returns', label: 'Returns', count: 2 },
  { id: 'payment', label: 'Payment', count: 1 }
];

const DEFAULT_INTEGRATION = {
  connected: true,
  accountName: 'acmesolutions_official',
  connectedDate: 'May 13, 2024',
  permissions: {
    readMessages: true,
    readComments: true,
    readMentions: true,
    readVideoInteractions: true,
    sendMessages: true,
    manageReplies: true
  }
};

const DEFAULT_SETTINGS = {
  general: {
    defaultResponseTime: '1 Hour',
    timezone: '(GMT-05:00) Eastern Time (US & Canada)',
    autoMarkAsRead: true,
    aiSuggestions: true,
    showTypingIndicator: true
  },
  notifications: {
    newMessages: true,
    newComments: true,
    newMentions: true,
    emailDigest: false
  }
};

// ============================================
// Utility Functions
// ============================================

function safeParseStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) return Array.isArray(parsed) ? parsed : fallback;
    if (fallback && typeof fallback === 'object') return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
    return parsed;
  } catch (_error) {
    return fallback;
  }
}

function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================
// Main App Class
// ============================================

class TikTokApp {
  constructor() {
    this.currentView = 'overview';
    this.container = document.getElementById('tiktok-content');
    this.sidebar = document.querySelector('.tiktok-nav');
    this.selectedConversation = null;
    this.conversationFilter = 'all';
    this.savedReplyFilter = 'all';
    this.settingsTab = 'general';
    this.init();
  }

  init() {
    if (!this.container || !this.sidebar) return;
    if (!(window.OP?.nav?.requireAuth && OP.nav.requireAuth())) {
      this.showError('Authentication required to load the TikTok workspace.');
      return;
    }
    this.renderSidebar();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.sidebar.addEventListener('click', event => {
      const button = event.target.closest('[data-view]');
      if (!button) return;
      this.currentView = button.dataset.view;
      this.selectedConversation = null;
      this.renderSidebar();
      this.render();
    });

    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });

    document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });

    document.getElementById('exportReport')?.addEventListener('click', () => {
      OP.toast.show('Exporting TikTok report...', 'info');
    });

    this.container.addEventListener('click', event => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      const itemId = target.dataset.id;

      if (action === 'select-conversation') this.selectConversation(itemId);
      if (action === 'mark-read') this.markConversationRead(itemId);
      if (action === 'back-to-list') { this.selectedConversation = null; this.renderConversations(); }
      if (action === 'sync-integration') this.syncIntegration();
      if (action === 'disconnect-integration') this.disconnectIntegration();
      if (action === 'save-settings') this.saveSettings();
      if (action === 'use-ai-reply') this.useAiReply(target.dataset.reply);
      if (action === 'send-message') this.sendMessage();
      if (action === 'use-saved-reply') this.useSavedReply(itemId);
      if (action === 'toggle-permission') this.togglePermission(itemId);
      if (action === 'filter-conversations') this.filterConversations(target.dataset.filter);
      if (action === 'filter-saved-replies') this.filterSavedReplies(target.dataset.filter);
      if (action === 'settings-tab') this.switchSettingsTab(target.dataset.tab);
    });

    this.container.addEventListener('keydown', event => {
      if (event.key === 'Enter' && event.target.id === 'chatInput') {
        this.sendMessage();
      }
    });
  }

  // ============================================
  // Sidebar
  // ============================================

  renderSidebar() {
    const stats = this.computeStats();
    const sections = [
      { view: 'overview', label: 'Overview', icon: 'ph-chart-bar', badge: null },
      { view: 'conversations', label: 'Conversations', icon: 'ph-chat-centered-text', badge: stats.unreadMessages },
      { view: 'comments', label: 'Comments', icon: 'ph-chat-teardrop-text', badge: stats.totalComments },
      { view: 'mentions', label: 'Mentions', icon: 'ph-at', badge: stats.totalMentions },
      { view: 'saved-replies', label: 'Saved Replies', icon: 'ph-chat-circle-text', badge: null },
      { view: 'integration', label: 'Integration', icon: 'ph-plugs', badge: null },
      { view: 'settings', label: 'Settings', icon: 'ph-gear', badge: null }
    ];

    this.sidebar.innerHTML = sections.map(section => `
      <button class="tiktok-sidebar-link ${this.currentView === section.view ? 'active' : ''}" data-view="${section.view}">
        <i class="ph ${section.icon}"></i>
        <span>${section.label}</span>
        ${section.badge ? `<span class="sidebar-badge ${section.badge > 0 ? 'unread' : ''}">${section.badge}</span>` : ''}
      </button>
    `).join('');
  }

  // ============================================
  // Router
  // ============================================

  render() {
    switch (this.currentView) {
      case 'conversations': return this.selectedConversation ? this.renderChat() : this.renderConversations();
      case 'comments': return this.renderComments();
      case 'mentions': return this.renderMentions();
      case 'saved-replies': return this.renderSavedRepliesPage();
      case 'integration': return this.renderIntegration();
      case 'settings': return this.renderSettings();
      default: return this.renderOverview();
    }
  }

  // ============================================
  // 1. OVERVIEW (Panel 1)
  // ============================================

  renderOverview() {
    const videos = TIKTOK_SAMPLE_VIDEOS.slice(0, 4);
    const recent = TIKTOK_SAMPLE_CONVERSATIONS.slice(0, 5);

    this.container.innerHTML = `
      <div class="tiktok-overview-header">
        <div class="tiktok-overview-title">
          <div class="sidebar-platform-icon tiktok"><i class="ph ph-tiktok-logo"></i></div>
          <div>
            <h1>TikTok Overview</h1>
            <p>Monitor and engage with your TikTok audience</p>
          </div>
        </div>
        <div class="tiktok-overview-actions">
          <div class="tiktok-date-picker"><i class="ph ph-calendar-blank"></i> May 20 – May 26, 2024 <i class="ph ph-caret-down" style="margin-left:4px;"></i></div>
          <button class="header-btn" id="exportReportButton"><i class="ph ph-export"></i> Export Report</button>
        </div>
      </div>

      <div class="tiktok-stats-grid">
        <div class="tiktok-stat-card">
          <div class="tiktok-stat-header">
            <div class="tiktok-stat-icon conversations"><i class="ph ph-chat-centered-text"></i></div>
            <span class="tiktok-stat-trend up"><i class="ph ph-trend-up"></i> 12.5%</span>
          </div>
          <div class="tiktok-stat-value">156</div>
          <div class="tiktok-stat-label">Total Conversations</div>
          <div class="tiktok-stat-vs">vs last 7 days</div>
        </div>
        <div class="tiktok-stat-card">
          <div class="tiktok-stat-header">
            <div class="tiktok-stat-icon messages"><i class="ph ph-envelope-simple"></i></div>
            <span class="tiktok-stat-trend up"><i class="ph ph-trend-up"></i> 4.3%</span>
          </div>
          <div class="tiktok-stat-value">23</div>
          <div class="tiktok-stat-label">Unread Messages</div>
          <div class="tiktok-stat-vs">vs last 7 days</div>
        </div>
        <div class="tiktok-stat-card">
          <div class="tiktok-stat-header">
            <div class="tiktok-stat-icon resolved"><i class="ph ph-check-circle"></i></div>
            <span class="tiktok-stat-trend up"><i class="ph ph-trend-up"></i> 8.7%</span>
          </div>
          <div class="tiktok-stat-value">89</div>
          <div class="tiktok-stat-label">Resolved</div>
          <div class="tiktok-stat-vs">vs last 7 days</div>
        </div>
        <div class="tiktok-stat-card">
          <div class="tiktok-stat-header">
            <div class="tiktok-stat-icon leads"><i class="ph ph-users"></i></div>
            <span class="tiktok-stat-trend up"><i class="ph ph-trend-up"></i> 15.2%</span>
          </div>
          <div class="tiktok-stat-value">34</div>
          <div class="tiktok-stat-label">New Leads</div>
          <div class="tiktok-stat-vs">vs last 7 days</div>
        </div>
        <div class="tiktok-stat-card">
          <div class="tiktok-stat-header">
            <div class="tiktok-stat-icon mentions"><i class="ph ph-at"></i></div>
            <span class="tiktok-stat-trend up"><i class="ph ph-trend-up"></i> 18.3%</span>
          </div>
          <div class="tiktok-stat-value">248</div>
          <div class="tiktok-stat-label">Total Mentions</div>
          <div class="tiktok-stat-vs">vs last 7 days</div>
        </div>
      </div>

      <div class="tiktok-dashboard-grid">
        <!-- Conversations Trend -->
        <section class="tiktok-widget-card tiktok-col-6">
          <div class="tiktok-widget-header">
            <h3 class="tiktok-widget-title">Conversations Trend</h3>
            <span class="tiktok-widget-subtitle">Last 7 Days</span>
          </div>
          <div class="tiktok-widget-body">
            <div class="trend-chart-legend">
              <span class="trend-legend-item"><span class="trend-dot purple"></span>Conversations</span>
              <span class="trend-legend-item"><span class="trend-dot cyan"></span>Responses</span>
            </div>
            <svg class="trend-chart" viewBox="0 0 500 200" width="100%" height="200" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="40" y1="20" x2="460" y2="20" stroke="#e2e8f0" stroke-dasharray="4"/>
              <line x1="40" y1="60" x2="460" y2="60" stroke="#e2e8f0" stroke-dasharray="4"/>
              <line x1="40" y1="100" x2="460" y2="100" stroke="#e2e8f0" stroke-dasharray="4"/>
              <line x1="40" y1="140" x2="460" y2="140" stroke="#e2e8f0" stroke-dasharray="4"/>
              <!-- Y labels -->
              <text x="35" y="24" text-anchor="end" font-size="10" fill="#94a3b8">100</text>
              <text x="35" y="64" text-anchor="end" font-size="10" fill="#94a3b8">75</text>
              <text x="35" y="104" text-anchor="end" font-size="10" fill="#94a3b8">50</text>
              <text x="35" y="144" text-anchor="end" font-size="10" fill="#94a3b8">25</text>
              <text x="35" y="184" text-anchor="end" font-size="10" fill="#94a3b8">0</text>
              <!-- X labels -->
              <text x="40" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">May 20</text>
              <text x="110" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">May 21</text>
              <text x="180" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">May 22</text>
              <text x="250" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">May 23</text>
              <text x="320" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">May 24</text>
              <text x="390" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">May 25</text>
              <text x="460" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">May 26</text>
              <!-- Conversations line (purple) -->
              <path d="M 40 132 Q 75 116, 110 92 T 180 44 T 250 76 T 320 84 T 390 60 T 460 28" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="40" cy="132" r="3" fill="#6366f1"/><circle cx="110" cy="92" r="3" fill="#6366f1"/><circle cx="180" cy="44" r="3" fill="#6366f1"/>
              <circle cx="250" cy="76" r="3" fill="#6366f1"/><circle cx="320" cy="84" r="3" fill="#6366f1"/><circle cx="390" cy="60" r="3" fill="#6366f1"/>
              <circle cx="460" cy="28" r="3" fill="#6366f1"/>
              <!-- Responses line (cyan) -->
              <path d="M 40 148 Q 75 140, 110 132 T 180 116 T 250 100 T 320 116 T 390 108 T 460 92" fill="none" stroke="#25f4ee" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="40" cy="148" r="3" fill="#25f4ee"/><circle cx="110" cy="132" r="3" fill="#25f4ee"/><circle cx="180" cy="116" r="3" fill="#25f4ee"/>
              <circle cx="250" cy="100" r="3" fill="#25f4ee"/><circle cx="320" cy="116" r="3" fill="#25f4ee"/><circle cx="390" cy="108" r="3" fill="#25f4ee"/>
              <circle cx="460" cy="92" r="3" fill="#25f4ee"/>
            </svg>
          </div>
        </section>

        <!-- Top Video Interactions -->
        <section class="tiktok-widget-card tiktok-col-6">
          <div class="tiktok-widget-header">
            <h3 class="tiktok-widget-title">Top Video Interactions</h3>
            <a href="#" class="widget-link">View All</a>
          </div>
          <div class="tiktok-widget-body">
            ${videos.map(video => `
              <div class="tiktok-video-item">
                <div class="tiktok-video-thumb"><i class="ph ph-play-circle"></i></div>
                <div class="tiktok-video-info">
                  <div class="tiktok-video-title">${escapeHtml(video.title)}</div>
                  <div class="tiktok-video-meta">
                    <span>${escapeHtml(video.date)}</span>
                    <span class="video-meta-stat"><i class="ph ph-eye"></i> ${escapeHtml(video.views)}</span>
                    <span class="video-meta-stat"><i class="ph ph-chat-teardrop-text"></i> ${video.comments}</span>
                    <span class="video-meta-stat"><i class="ph ph-heart"></i> ${escapeHtml(video.likes)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- AI Recommendations -->
        <section class="tiktok-widget-card tiktok-col-6">
          <div class="tiktok-widget-header">
            <h3 class="tiktok-widget-title">AI Recommendations</h3>
            <span class="badge-beta">BETA</span>
          </div>
          <div class="tiktok-widget-body">
            <div class="tiktok-ai-list">
              ${TIKTOK_AI_RECOMMENDATIONS.map(rec => `
                <div class="tiktok-ai-item">
                  <div class="tiktok-ai-icon" style="background:${rec.bgColor};color:${rec.iconColor};">
                    <i class="ph ${rec.icon}"></i>
                  </div>
                  <div class="tiktok-ai-content">
                    <div class="tiktok-ai-title">${escapeHtml(rec.type)} <span class="tiktok-ai-count">${rec.count}</span></div>
                    <div class="tiktok-ai-text">${escapeHtml(rec.desc)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <a href="#" class="widget-link" style="display:block;margin-top:16px;text-align:center;">View All Insights</a>
          </div>
        </section>

        <!-- Recent Conversations -->
        <section class="tiktok-widget-card tiktok-col-6">
          <div class="tiktok-widget-header">
            <h3 class="tiktok-widget-title">Recent Conversations</h3>
            <a href="#" class="widget-link" data-action="switch-view" data-view="conversations">View All</a>
          </div>
          <div class="tiktok-widget-body">
            ${recent.map(item => {
              const customer = this.getCustomer(item.customerId);
              return `
                <div class="conversation-item ${item.unread ? 'unread' : ''}" data-action="select-conversation" data-id="${item.id}" style="cursor:pointer;">
                  <div class="conversation-avatar" style="background:${customer.color};">${escapeHtml(customer.avatar)}</div>
                  <div class="conversation-content">
                    <div class="conversation-name ${item.unread ? 'unread' : ''}">${escapeHtml(customer.name)}</div>
                    <div class="conversation-preview">${escapeHtml(item.lastMessage)}</div>
                  </div>
                  <div class="conversation-meta">
                    <div class="conversation-time">${formatTimeAgo(item.timestamp)}</div>
                    ${item.priority === 'high' ? '<span class="conversation-badge priority-high">High</span>' : item.priority === 'medium' ? '<span class="conversation-badge priority-medium">Medium</span>' : '<span class="conversation-badge priority-low">Low</span>'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Engagement Overview -->
        <section class="tiktok-widget-card tiktok-col-6">
          <div class="tiktok-widget-header">
            <h3 class="tiktok-widget-title">Engagement Overview</h3>
          </div>
          <div class="tiktok-widget-body">
            <div class="donut-chart-container">
              <div class="donut-visual">
                <svg width="168" height="168" viewBox="0 0 168 168">
                  <circle cx="84" cy="84" r="70" fill="none" stroke="#6366f1" stroke-width="20" stroke-dasharray="175.93 263.89" stroke-dashoffset="0" transform="rotate(-90 84 84)"/>
                  <circle cx="84" cy="84" r="70" fill="none" stroke="#f59e0b" stroke-width="20" stroke-dasharray="109.96 329.86" stroke-dashoffset="-175.93" transform="rotate(-90 84 84)"/>
                  <circle cx="84" cy="84" r="70" fill="none" stroke="#10b981" stroke-width="20" stroke-dasharray="87.96 351.86" stroke-dashoffset="-285.89" transform="rotate(-90 84 84)"/>
                  <circle cx="84" cy="84" r="70" fill="none" stroke="#ef4444" stroke-width="20" stroke-dasharray="43.98 395.84" stroke-dashoffset="-373.85" transform="rotate(-90 84 84)"/>
                  <circle cx="84" cy="84" r="70" fill="none" stroke="#8b5cf6" stroke-width="20" stroke-dasharray="21.99 417.83" stroke-dashoffset="-417.83" transform="rotate(-90 84 84)"/>
                </svg>
                <div class="donut-chart-center">
                  <div class="donut-chart-value">1,248</div>
                  <div class="donut-chart-label">Total</div>
                </div>
              </div>
              <div class="donut-legend">
                ${ENGAGEMENT_DATA.map(d => `
                  <div class="donut-legend-item">
                    <span class="donut-legend-dot" style="background:${d.color}"></span>
                    <span class="donut-legend-label">${d.label}</span>
                    <span class="donut-legend-value">${d.percent}%</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- Account Status -->
        <section class="tiktok-widget-card tiktok-col-6">
          <div class="tiktok-widget-header">
            <h3 class="tiktok-widget-title">Account Status</h3>
            <span class="tiktok-account-badge connected"><i class="ph ph-check-circle"></i> Connected</span>
          </div>
          <div class="tiktok-widget-body">
            <div class="account-info">
              <div class="account-handle"><i class="ph ph-tiktok-logo"></i> ${escapeHtml(ACCOUNT_STATUS.handle)}</div>
              <div class="account-meta">Connected on ${escapeHtml(ACCOUNT_STATUS.connectedDate)}</div>
            </div>
            <div class="account-stats-row">
              <div class="account-stat">
                <div class="account-stat-value">${escapeHtml(ACCOUNT_STATUS.followers)}</div>
                <div class="account-stat-label">Followers</div>
                <div class="account-stat-trend up"><i class="ph ph-trend-up"></i> ${ACCOUNT_STATUS.followerTrend}</div>
              </div>
              <div class="account-stat">
                <div class="account-stat-value">${ACCOUNT_STATUS.following}</div>
                <div class="account-stat-label">Following</div>
                <div class="account-stat-trend up"><i class="ph ph-trend-up"></i> ${ACCOUNT_STATUS.followingTrend}</div>
              </div>
              <div class="account-stat">
                <div class="account-stat-value">${escapeHtml(ACCOUNT_STATUS.likes)}</div>
                <div class="account-stat-label">Likes</div>
                <div class="account-stat-trend up"><i class="ph ph-trend-up"></i> ${ACCOUNT_STATUS.likesTrend}</div>
              </div>
            </div>
            <div class="connection-health">
              <div class="connection-health-header">
                <span>Connection Health</span>
                <span class="connection-health-pct">${ACCOUNT_STATUS.connectionHealth}%</span>
              </div>
              <div class="connection-health-bar">
                <div class="connection-health-fill" style="width:${ACCOUNT_STATUS.connectionHealth}%"></div>
              </div>
            </div>
            <a href="#" class="widget-link" style="display:block;margin-top:12px;">View Integration</a>
          </div>
        </section>
      </div>
    `;

    this.container.querySelector('[data-action="switch-view"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.currentView = 'conversations';
      this.renderSidebar();
      this.render();
    });
  }

  // ============================================
  // 2. CONVERSATIONS INBOX (Panel 2)
  // ============================================

  renderConversations() {
    const filtered = this.getFilteredConversations();
    
    this.container.innerHTML = `
      <div class="tiktok-conversations-layout">
        <!-- Left Sidebar -->
        <div class="tiktok-conversations-sidebar">
          <div class="tiktok-conversations-header">
            <div class="tiktok-conversations-title">TikTok</div>
            <div class="tiktok-conversations-search">
              <i class="ph ph-magnifying-glass"></i>
              <input type="text" placeholder="Search conversations...">
            </div>
          </div>
          <div class="tiktok-conversations-filters">
            <button class="tiktok-filter-chip ${this.conversationFilter === 'all' ? 'active' : ''}" data-action="filter-conversations" data-filter="all">All <span class="badge-count">${TIKTOK_SAMPLE_CONVERSATIONS.length}</span></button>
            <button class="tiktok-filter-chip ${this.conversationFilter === 'unread' ? 'active' : ''}" data-action="filter-conversations" data-filter="unread">Unread</button>
            <button class="tiktok-filter-chip ${this.conversationFilter === 'assigned' ? 'active' : ''}" data-action="filter-conversations" data-filter="assigned">Assigned to me</button>
          </div>
          <div class="tiktok-conversations-list">
            ${filtered.map(item => {
              const customer = this.getCustomer(item.customerId);
              return `
                <div class="tiktok-conversation-item ${item.unread ? 'unread' : ''} ${this.selectedConversation === item.id ? 'active' : ''}" data-action="select-conversation" data-id="${item.id}">
                  <div class="tiktok-conversation-avatar" style="background:${customer.color};">
                    ${escapeHtml(customer.avatar)}
                    <span class="status-dot ${customer.status}"></span>
                  </div>
                  <div class="tiktok-conversation-content">
                    <div class="tiktok-conversation-name">
                      ${escapeHtml(customer.name)}
                      ${item.unread ? '<span class="unread-dot"></span>' : ''}
                    </div>
                    <div class="tiktok-conversation-preview">${escapeHtml(item.lastMessage)}</div>
                  </div>
                  <div class="tiktok-conversation-meta">
                    <div class="tiktok-conversation-time">${formatTimeAgo(item.timestamp)}</div>
                    ${item.priority === 'high' ? '<span class="tiktok-conversation-badge priority-high">High</span>' : item.priority === 'medium' ? '<span class="tiktok-conversation-badge priority-medium">Medium</span>' : '<span class="tiktok-conversation-badge priority-low">Low</span>'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="tiktok-conversations-footer">
            <span class="tiktok-conversations-count">Showing 1 to ${filtered.length} of ${filtered.length} conversations</span>
          </div>
        </div>

        <!-- Empty State (no selection) -->
        <div class="tiktok-chat-area empty">
          <div class="empty-state">
            <div class="empty-state-icon"><i class="ph ph-chat-centered-text"></i></div>
            <div class="empty-state-title">Select a conversation</div>
            <div class="empty-state-desc">Choose a conversation from the list to start chatting</div>
          </div>
        </div>
      </div>
    `;
  }

  renderChat() {
    const conversation = TIKTOK_SAMPLE_CONVERSATIONS.find(c => c.id === this.selectedConversation);
    if (!conversation) { this.selectedConversation = null; return this.renderConversations(); }
    
    const customer = this.getCustomer(conversation.customerId);
    const messages = CHAT_MESSAGES[this.selectedConversation] || [];
    const hasAiReplies = AI_REPLY_CHIPS.length > 0;

    this.container.innerHTML = `
      <div class="tiktok-conversations-layout">
        <!-- Left Sidebar -->
        <div class="tiktok-conversations-sidebar">
          <div class="tiktok-conversations-header">
            <div class="tiktok-conversations-title">TikTok</div>
            <div class="tiktok-conversations-search">
              <i class="ph ph-magnifying-glass"></i>
              <input type="text" placeholder="Search conversations...">
            </div>
          </div>
          <div class="tiktok-conversations-filters">
            <button class="tiktok-filter-chip active">All <span class="badge-count">${TIKTOK_SAMPLE_CONVERSATIONS.length}</span></button>
            <button class="tiktok-filter-chip">Unread</button>
            <button class="tiktok-filter-chip">Assigned to me</button>
          </div>
          <div class="tiktok-conversations-list">
            ${TIKTOK_SAMPLE_CONVERSATIONS.map(item => {
              const c = this.getCustomer(item.customerId);
              return `
                <div class="tiktok-conversation-item ${item.unread ? 'unread' : ''} ${this.selectedConversation === item.id ? 'active' : ''}" data-action="select-conversation" data-id="${item.id}">
                  <div class="tiktok-conversation-avatar" style="background:${c.color};">
                    ${escapeHtml(c.avatar)}
                    <span class="status-dot ${c.status}"></span>
                  </div>
                  <div class="tiktok-conversation-content">
                    <div class="tiktok-conversation-name">
                      ${escapeHtml(c.name)}
                      ${item.unread ? '<span class="unread-dot"></span>' : ''}
                    </div>
                    <div class="tiktok-conversation-preview">${escapeHtml(item.lastMessage)}</div>
                  </div>
                  <div class="tiktok-conversation-meta">
                    <div class="tiktok-conversation-time">${formatTimeAgo(item.timestamp)}</div>
                    ${item.priority === 'high' ? '<span class="tiktok-conversation-badge priority-high">High</span>' : item.priority === 'medium' ? '<span class="tiktok-conversation-badge priority-medium">Medium</span>' : '<span class="tiktok-conversation-badge priority-low">Low</span>'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Chat Area -->
        <div class="tiktok-chat-area">
          <div class="tiktok-chat-header">
            <div class="tiktok-chat-header-left">
              <div class="tiktok-conversation-avatar" style="background:${customer.color};width:36px;height:36px;">
                ${escapeHtml(customer.avatar)}
                <span class="status-dot ${customer.status}"></span>
              </div>
              <div class="tiktok-chat-header-info">
                <h3>${escapeHtml(customer.name)}</h3>
                <p>${escapeHtml(customer.handle)} • ${customer.status}</p>
              </div>
            </div>
            <div class="tiktok-chat-header-actions">
              <button class="tiktok-chat-header-btn"><i class="ph ph-phone"></i></button>
              <button class="tiktok-chat-header-btn"><i class="ph ph-video-camera"></i></button>
              <button class="tiktok-chat-header-btn"><i class="ph ph-dots-three-vertical"></i></button>
            </div>
          </div>

          <div class="tiktok-chat-messages" id="chatMessages">
            ${messages.map(msg => `
              <div class="tiktok-message ${msg.sender}">
                ${msg.sender === 'customer' ? `<div class="tiktok-message-avatar" style="background:${customer.color};">${escapeHtml(customer.avatar)}</div>` : ''}
                <div class="tiktok-message-content">
                  <div class="tiktok-message-bubble">${escapeHtml(msg.text)}</div>
                  <div class="tiktok-message-time">${msg.time}</div>
                </div>
              </div>
            `).join('')}
          </div>

          ${hasAiReplies ? `
            <div class="tiktok-ai-replies">
              ${AI_REPLY_CHIPS.map((reply, i) => `
                <button class="tiktok-ai-reply-chip" data-action="use-ai-reply" data-reply="${escapeHtml(reply)}">
                  <i class="ph ph-sparkle"></i> ${escapeHtml(reply.substring(0, 40))}...
                </button>
              `).join('')}
            </div>
          ` : ''}

          <div class="tiktok-chat-input-area">
            <div class="tiktok-chat-input-wrapper">
              <button class="tiktok-chat-input-btn"><i class="ph ph-paperclip"></i></button>
              <input type="text" id="chatInput" placeholder="Type your message...">
              <button class="tiktok-chat-input-btn"><i class="ph ph-smiley"></i></button>
            </div>
            <button class="tiktok-chat-send-btn" data-action="send-message"><i class="ph ph-paper-plane-right"></i></button>
          </div>
        </div>

        <!-- Profile Panel -->
        <div class="tiktok-profile-panel">
          <div class="tiktok-profile-header">
            <div class="tiktok-profile-avatar" style="background:${customer.color};">${escapeHtml(customer.avatar)}</div>
            <div class="tiktok-profile-name">${escapeHtml(customer.name)}</div>
            <div class="tiktok-profile-handle">${escapeHtml(customer.handle)}</div>
            <button class="tiktok-profile-view-btn">View Profile</button>
          </div>

          <div class="tiktok-profile-section">
            <div class="tiktok-profile-section-title">Customer Profile</div>
            <div class="tiktok-profile-info-row">
              <span class="tiktok-profile-info-label">Name</span>
              <span class="tiktok-profile-info-value">${escapeHtml(customer.name)}</span>
            </div>
            <div class="tiktok-profile-info-row">
              <span class="tiktok-profile-info-label">Email</span>
              <span class="tiktok-profile-info-value">alex@oneplace.com</span>
            </div>
            <div class="tiktok-profile-info-row">
              <span class="tiktok-profile-info-label">Phone</span>
              <span class="tiktok-profile-info-value">+1 (555) 123-4567</span>
            </div>
          </div>

          <div class="tiktok-profile-section">
            <div class="tiktok-profile-section-title">CRM Information</div>
            <div class="tiktok-profile-info-row">
              <span class="tiktok-profile-info-label">Lead Score</span>
              <span class="tiktok-profile-info-value" style="color:#10b981;">${customer.leadScore}</span>
            </div>
            <div class="tiktok-profile-info-row">
              <span class="tiktok-profile-info-label">Customer Status</span>
              <span class="tiktok-profile-info-value status-active">${customer.customerStatus}</span>
            </div>
            <div class="tiktok-profile-info-row">
              <span class="tiktok-profile-info-label">Total Orders</span>
              <span class="tiktok-profile-info-value">${customer.totalOrders}</span>
            </div>
            <div class="tiktok-profile-info-row">
              <span class="tiktok-profile-info-label">Total Spent</span>
              <span class="tiktok-profile-info-value">${customer.totalSpent}</span>
            </div>
          </div>

          <div class="tiktok-profile-section">
            <div class="tiktok-profile-section-title">Labels</div>
            <div class="tiktok-profile-tags">
              ${customer.labels.map(label => `<span class="tiktok-profile-tag ${label.toLowerCase().replace(' ', '-')}">${escapeHtml(label)}</span>`).join('')}
              <button class="tiktok-profile-add-tag">+ Add Label</button>
            </div>
          </div>

          <div class="tiktok-profile-section">
            <div class="tiktok-profile-section-title">Notes</div>
            <div class="tiktok-profile-notes">
              <textarea placeholder="Add a note...">Interested in new summer collection</textarea>
            </div>
          </div>

          <div class="tiktok-profile-section">
            <div class="tiktok-profile-section-title">Recent Orders</div>
            <div class="tiktok-profile-orders">
              <div class="tiktok-profile-order-thumb"><i class="ph ph-t-shirt"></i></div>
              <div class="tiktok-profile-order-thumb"><i class="ph ph-sneaker"></i></div>
              <div class="tiktok-profile-order-thumb"><i class="ph ph-bag"></i></div>
            </div>
            <a href="#" class="widget-link" style="display:block;margin-top:8px;">View All Orders</a>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const msgContainer = document.getElementById('chatMessages');
      if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 0);
  }

  // ============================================
  // 3. COMMENTS MANAGER (Panel 3)
  // ============================================

  renderComments() {
    this.container.innerHTML = `
      <div class="dashboard-page-title">
        <h1>Comments Manager</h1>
        <p>Manage and respond to TikTok comments</p>
      </div>

      <div class="filter-bar">
        <div class="tiktok-conversations-search" style="flex:1;max-width:300px;">
          <i class="ph ph-magnifying-glass"></i>
          <input type="text" placeholder="Search comments...">
        </div>
        <button class="tiktok-filter-chip active">All</button>
        <button class="tiktok-filter-chip">Unread</button>
        <button class="tiktok-filter-chip">Replied</button>
        <button class="tiktok-filter-chip">High Priority</button>
        <button class="tiktok-filter-chip">More Filters <i class="ph ph-caret-down"></i></button>
        <button class="tiktok-filter-chip" style="margin-left:auto;"><i class="ph ph-arrows-clockwise"></i> Newest</button>
      </div>

      <div class="tiktok-comments-list">
        ${TIKTOK_SAMPLE_COMMENTS.map(comment => `
          <div class="tiktok-comment-item">
            <div class="tiktok-comment-avatar" style="background:${comment.authorColor};">${escapeHtml(comment.authorAvatar)}</div>
            <div class="tiktok-comment-content">
              <div class="tiktok-comment-header">
                <span class="tiktok-comment-author">${escapeHtml(comment.author)}</span>
                <span class="tiktok-comment-handle">${escapeHtml(comment.authorHandle)}</span>
                <span class="tiktok-comment-time">${formatTimeAgo(comment.time)}</span>
              </div>
              <div class="tiktok-comment-text">${escapeHtml(comment.text)}</div>
              <div class="tiktok-comment-video"><i class="ph ph-video"></i> On: ${escapeHtml(comment.videoTitle)}</div>
              
              ${comment.aiReply ? `
                <div class="tiktok-ai-suggested-reply">
                  <div class="tiktok-ai-suggested-reply-label"><i class="ph ph-sparkle"></i> AI Suggested Reply</div>
                  <div class="tiktok-ai-suggested-reply-text">${escapeHtml(comment.aiReply)}</div>
                  <div class="tiktok-ai-suggested-reply-actions">
                    <button class="btn btn-sm btn-primary" data-action="use-saved-reply" data-id="${comment.id}">Use Reply</button>
                    <button class="btn btn-sm btn-ghost">Edit</button>
                  </div>
                </div>
              ` : ''}

              <div class="tiktok-comment-actions">
                <button class="tiktok-comment-action-btn"><i class="ph ph-arrow-u-up-left"></i> Reply</button>
                <button class="tiktok-comment-action-btn"><i class="ph ph-heart"></i> Like</button>
                <div class="tiktok-comment-priority">
                  <span class="tiktok-comment-priority-badge ${comment.priority}">${comment.priority}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="tiktok-pagination">
        <button class="tiktok-pagination-btn" disabled><i class="ph ph-caret-left"></i></button>
        <button class="tiktok-pagination-btn active">1</button>
        <button class="tiktok-pagination-btn">2</button>
        <button class="tiktok-pagination-btn">3</button>
        <button class="tiktok-pagination-btn">4</button>
        <button class="tiktok-pagination-btn">5</button>
        <button class="tiktok-pagination-btn">6</button>
        <button class="tiktok-pagination-btn">7</button>
        <button class="tiktok-pagination-btn"><i class="ph ph-caret-right"></i></button>
        <span class="tiktok-pagination-info">Showing 1 to 10 of 68 comments</span>
      </div>
    `;
  }

  // ============================================
  // 4. MENTIONS (Panel 4)
  // ============================================

  renderMentions() {
    this.container.innerHTML = `
      <div class="dashboard-page-title">
        <h1>Mentions</h1>
        <p>Track and respond to brand mentions on TikTok</p>
      </div>

      <div class="filter-bar">
        <div class="tiktok-conversations-search" style="flex:1;max-width:300px;">
          <i class="ph ph-magnifying-glass"></i>
          <input type="text" placeholder="Search mentions...">
        </div>
        <button class="tiktok-filter-chip active">All</button>
        <button class="tiktok-filter-chip">Unread</button>
        <button class="tiktok-filter-chip">Resolved</button>
        <button class="tiktok-filter-chip">More Filters <i class="ph ph-caret-down"></i></button>
        <button class="tiktok-filter-chip" style="margin-left:auto;"><i class="ph ph-arrows-clockwise"></i> Newest</button>
      </div>

      <div class="tiktok-mentions-layout">
        <div class="tiktok-mentions-list">
          ${TIKTOK_SAMPLE_MENTIONS.map(mention => `
            <div class="tiktok-mention-item">
              <div class="tiktok-comment-avatar" style="background:${mention.authorColor};">${escapeHtml(mention.authorAvatar)}</div>
              <div class="tiktok-mention-details">
                <div class="tiktok-mention-header">
                  <span class="tiktok-mention-author">${escapeHtml(mention.author)}</span>
                  <span class="tiktok-mention-handle">${escapeHtml(mention.authorHandle)}</span>
                  <span class="tiktok-mention-time">${formatTimeAgo(mention.time)}</span>
                </div>
                <div class="tiktok-mention-text">${escapeHtml(mention.text)}</div>
                <div class="tiktok-mention-video"><i class="ph ph-video"></i> ${escapeHtml(mention.videoTitle)}</div>
                <div class="tiktok-mention-actions">
                  <button class="tiktok-comment-action-btn primary"><i class="ph ph-arrow-u-up-left"></i> Reply</button>
                  <button class="tiktok-comment-action-btn"><i class="ph ph-user"></i> View Profile</button>
                </div>
              </div>
              <div class="tiktok-mention-side">
                <div class="tiktok-mention-likes"><i class="ph ph-heart"></i> ${mention.likes}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Mention Details Panel -->
        <div class="tiktok-mention-detail-panel">
          <div class="mention-detail-header">
            <div class="tiktok-comment-avatar" style="background:#fe2c55;width:48px;height:48px;font-size:18px;">FD</div>
            <div>
              <div style="font-weight:600;color:#0f172a;">fashion.daily</div>
              <div style="font-size:12px;color:#94a3b8;">@fashiondaily</div>
            </div>
          </div>
          <div class="mention-detail-stats">
            <div class="mention-detail-stat">
              <div class="mention-detail-stat-value">12.4K</div>
              <div class="mention-detail-stat-label">Followers</div>
            </div>
          </div>
          <div class="mention-detail-video">
            <div class="tiktok-video-thumb" style="width:100%;height:120px;"><i class="ph ph-play-circle" style="font-size:32px;"></i></div>
            <div style="font-size:12px;color:#64748b;margin-top:8px;">Fashion Week Highlights</div>
          </div>
          <button class="btn btn-primary" style="width:100%;margin-top:16px;"><i class="ph ph-user"></i> View Profile</button>
        </div>
      </div>

      <div class="tiktok-pagination">
        <button class="tiktok-pagination-btn" disabled><i class="ph ph-caret-left"></i></button>
        <button class="tiktok-pagination-btn active">1</button>
        <button class="tiktok-pagination-btn">2</button>
        <button class="tiktok-pagination-btn">3</button>
        <button class="tiktok-pagination-btn">4</button>
        <button class="tiktok-pagination-btn">5</button>
        <button class="tiktok-pagination-btn"><i class="ph ph-caret-right"></i></button>
        <span class="tiktok-pagination-info">Showing 1 to 10 of 34 mentions</span>
      </div>
    `;
  }

  // ============================================
  // 5. SAVED REPLIES (Panel 5)
  // ============================================

  renderSavedRepliesPage() {
    const filtered = this.savedReplyFilter === 'all' 
      ? SAVED_REPLIES 
      : SAVED_REPLIES.filter(r => r.category.toLowerCase() === this.savedReplyFilter);

    this.container.innerHTML = `
      <div class="dashboard-page-title">
        <h1>Saved Replies</h1>
        <p>Manage your quick reply templates</p>
      </div>

      <div class="tiktok-saved-replies-layout">
        <div class="tiktok-saved-replies-categories">
          ${SAVED_REPLY_CATEGORIES.map(cat => `
            <button class="tiktok-saved-reply-category ${this.savedReplyFilter === cat.id ? 'active' : ''}" data-action="filter-saved-replies" data-filter="${cat.id}">
              ${escapeHtml(cat.label)} <span class="category-count">${cat.count}</span>
            </button>
          `).join('')}
        </div>

        <div class="tiktok-saved-replies-main">
          <div class="tiktok-saved-replies-header">
            <h3>${escapeHtml(SAVED_REPLY_CATEGORIES.find(c => c.id === this.savedReplyFilter)?.label || 'All Replies')}</h3>
            <button class="btn btn-primary"><i class="ph ph-plus"></i> New Reply</button>
          </div>
          <div class="tiktok-saved-replies-list">
            ${filtered.map(reply => `
              <div class="tiktok-saved-reply-item">
                <div class="tiktok-saved-reply-icon"><i class="ph ph-chat-circle-text"></i></div>
                <div class="tiktok-saved-reply-content">
                  <div class="tiktok-saved-reply-title">${escapeHtml(reply.title)}</div>
                  <div class="tiktok-saved-reply-text">${escapeHtml(reply.text)}</div>
                  <div class="tiktok-saved-reply-meta">
                    <span><i class="ph ph-tag"></i> ${escapeHtml(reply.category)}</span>
                    <span><i class="ph ph-clock"></i> Used ${reply.usage} times</span>
                  </div>
                </div>
                <div class="tiktok-saved-reply-actions">
                  <button class="tiktok-saved-reply-action-btn"><i class="ph ph-pencil-simple"></i></button>
                  <button class="tiktok-saved-reply-action-btn"><i class="ph ph-trash"></i></button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // 6. TIKTOK INTEGRATION (Panel 6)
  // ============================================

  renderIntegration() {
    const integration = safeParseStorage(TIKTOK_STORAGE_KEYS.INTEGRATION, DEFAULT_INTEGRATION);
    
    this.container.innerHTML = `
      <div class="dashboard-page-title">
        <h1>TikTok Integration</h1>
        <p>Manage your TikTok account connection</p>
      </div>

      <div class="tiktok-integration-card">
        <div class="tiktok-integration-header">
          <div class="tiktok-integration-icon"><i class="ph ph-tiktok-logo"></i></div>
          <div class="tiktok-integration-title">TikTok Business Account</div>
          <div class="tiktok-integration-subtitle">${escapeHtml(integration.accountName)}</div>
        </div>

        <div class="tiktok-integration-status connected">
          <i class="ph ph-check-circle"></i> Connected on ${escapeHtml(integration.connectedDate)}
        </div>

        <div class="connection-health" style="margin-bottom:24px;">
          <div class="connection-health-header">
            <span>Connection Health</span>
            <span class="connection-health-pct">100%</span>
          </div>
          <div class="connection-health-bar">
            <div class="connection-health-fill" style="width:100%"></div>
          </div>
        </div>

        <div class="tiktok-integration-permissions">
          <div class="tiktok-integration-permission-item">
            <div class="tiktok-integration-permission-info">
              <div class="tiktok-integration-permission-icon"><i class="ph ph-chat-centered-text"></i></div>
              <div class="tiktok-integration-permission-text"><strong>Read Messages</strong><br>Access to direct messages</div>
            </div>
            <span class="tiktok-integration-permission-status allowed">Allowed</span>
          </div>
          <div class="tiktok-integration-permission-item">
            <div class="tiktok-integration-permission-info">
              <div class="tiktok-integration-permission-icon"><i class="ph ph-chat-teardrop-text"></i></div>
              <div class="tiktok-integration-permission-text"><strong>Read Comments</strong><br>Access to video comments</div>
            </div>
            <span class="tiktok-integration-permission-status allowed">Allowed</span>
          </div>
          <div class="tiktok-integration-permission-item">
            <div class="tiktok-integration-permission-info">
              <div class="tiktok-integration-permission-icon"><i class="ph ph-at"></i></div>
              <div class="tiktok-integration-permission-text"><strong>Read Mentions</strong><br>Access to brand mentions</div>
            </div>
            <span class="tiktok-integration-permission-status allowed">Allowed</span>
          </div>
          <div class="tiktok-integration-permission-item">
            <div class="tiktok-integration-permission-info">
              <div class="tiktok-integration-permission-icon"><i class="ph ph-video"></i></div>
              <div class="tiktok-integration-permission-text"><strong>Read Video Interactions</strong><br>Access to video analytics</div>
            </div>
            <span class="tiktok-integration-permission-status allowed">Allowed</span>
          </div>
          <div class="tiktok-integration-permission-item">
            <div class="tiktok-integration-permission-info">
              <div class="tiktok-integration-permission-icon"><i class="ph ph-arrows-clockwise"></i></div>
              <div class="tiktok-integration-permission-text"><strong>Sync conversations and tags</strong><br>Automatically sync conversations</div>
            </div>
            <span class="tiktok-integration-permission-status allowed">Allowed</span>
          </div>
          <div class="tiktok-integration-permission-item">
            <div class="tiktok-integration-permission-info">
              <div class="tiktok-integration-permission-icon"><i class="ph ph-upload-simple"></i></div>
              <div class="tiktok-integration-permission-text"><strong>Post Video Interactions</strong><br>Sync likes, shares and views</div>
            </div>
            <span class="tiktok-integration-permission-status allowed">Allowed</span>
          </div>
          <div class="tiktok-integration-permission-item">
            <div class="tiktok-integration-permission-info">
              <div class="tiktok-integration-permission-icon"><i class="ph ph-arrow-u-up-left"></i></div>
              <div class="tiktok-integration-permission-text"><strong>Manage Replies</strong><br>Automatically send saved replies</div>
            </div>
            <span class="tiktok-integration-permission-status allowed">Allowed</span>
          </div>
        </div>

        <div class="tiktok-integration-actions">
          <button class="btn btn-primary" data-action="sync-integration" style="background:linear-gradient(135deg,#fe2c55,#d91a3e);"><i class="ph ph-arrows-clockwise"></i> Sync Now</button>
          <button class="btn btn-outline" data-action="disconnect-integration"><i class="ph ph-plugs"></i> Disconnect</button>
        </div>
      </div>
    `;
  }

  // ============================================
  // 7. TIKTOK SETTINGS
  // ============================================

  renderSettings() {
    const settings = safeParseStorage(TIKTOK_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    
    const tabs = [
      { id: 'general', label: 'General', icon: 'ph-gear' },
      { id: 'notifications', label: 'Notifications', icon: 'ph-bell' },
      { id: 'auto-replies', label: 'Auto Replies', icon: 'ph-robot' },
      { id: 'saved-replies', label: 'Saved Replies', icon: 'ph-chat-circle-text' },
      { id: 'labels', label: 'Labels', icon: 'ph-tag' },
      { id: 'team', label: 'Team Members', icon: 'ph-users' },
      { id: 'security', label: 'Security', icon: 'ph-shield' }
    ];

    let contentHtml = '';
    
    if (this.settingsTab === 'general') {
      contentHtml = `
        <div class="tiktok-settings-section">
          <div class="tiktok-settings-section-title">General Settings</div>
          <div class="tiktok-settings-section-desc">Configure your TikTok workspace preferences</div>
          
          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">Default Response Time</div>
              <div class="tiktok-setting-desc">Set the expected response time for conversations</div>
            </div>
            <select class="tiktok-select">
              <option selected>1 Hour</option>
              <option>2 Hours</option>
              <option>4 Hours</option>
              <option>24 Hours</option>
            </select>
          </div>

          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">Timezone</div>
              <div class="tiktok-setting-desc">Set your local timezone for accurate timestamps</div>
            </div>
            <select class="tiktok-select">
              <option selected>(GMT-05:00) Eastern Time (US & Canada)</option>
              <option>(GMT-08:00) Pacific Time</option>
              <option>(GMT+00:00) UTC</option>
              <option>(GMT+01:00) Central European Time</option>
            </select>
          </div>
        </div>

        <div class="tiktok-settings-section">
          <div class="tiktok-settings-section-title">Automation</div>
          
          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">Auto Mark As Read</div>
              <div class="tiktok-setting-desc">Automatically mark messages as read when opened</div>
            </div>
            <button class="tiktok-toggle active" data-action="toggle-permission" data-id="autoMarkAsRead"><div class="tiktok-toggle-knob"></div></button>
          </div>

          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">AI Suggestions</div>
              <div class="tiktok-setting-desc">Show AI reply suggestions in conversations</div>
            </div>
            <button class="tiktok-toggle active" data-action="toggle-permission" data-id="aiSuggestions"><div class="tiktok-toggle-knob"></div></button>
          </div>

          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">Show Typing Indicator</div>
              <div class="tiktok-setting-desc">Show typing indicator to customers</div>
            </div>
            <button class="tiktok-toggle active" data-action="toggle-permission" data-id="showTyping"><div class="tiktok-toggle-knob"></div></button>
          </div>
        </div>
      `;
    } else if (this.settingsTab === 'notifications') {
      contentHtml = `
        <div class="tiktok-settings-section">
          <div class="tiktok-settings-section-title">Notifications</div>
          <div class="tiktok-settings-section-desc">Choose what notifications you receive</div>
          
          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">New Messages</div>
              <div class="tiktok-setting-desc">Get notified when you receive new messages</div>
            </div>
            <button class="tiktok-toggle active"><div class="tiktok-toggle-knob"></div></button>
          </div>
          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">New Comments</div>
              <div class="tiktok-setting-desc">Get notified about new comments</div>
            </div>
            <button class="tiktok-toggle active"><div class="tiktok-toggle-knob"></div></button>
          </div>
          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">New Mentions</div>
              <div class="tiktok-setting-desc">Get notified when your brand is mentioned</div>
            </div>
            <button class="tiktok-toggle"><div class="tiktok-toggle-knob"></div></button>
          </div>
          <div class="tiktok-setting-row">
            <div class="tiktok-setting-info">
              <div class="tiktok-setting-label">Email Digest</div>
              <div class="tiktok-setting-desc">Receive daily email summary</div>
            </div>
            <button class="tiktok-toggle"><div class="tiktok-toggle-knob"></div></button>
          </div>
        </div>
      `;
    } else if (this.settingsTab === 'saved-replies') {
      contentHtml = this.renderSavedRepliesInline();
    } else {
      contentHtml = `
        <div class="empty-state" style="padding:64px 24px;">
          <div class="empty-state-icon"><i class="ph ph-gear"></i></div>
          <div class="empty-state-title">${escapeHtml(this.settingsTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}</div>
          <div class="empty-state-desc">This section is coming soon.</div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="dashboard-page-title">
        <h1>Settings</h1>
        <p>Configure your TikTok workspace preferences</p>
      </div>

      <div class="tiktok-settings-layout">
        <div class="tiktok-settings-nav">
          ${tabs.map(tab => `
            <button class="tiktok-settings-nav-item ${this.settingsTab === tab.id ? 'active' : ''}" data-action="settings-tab" data-tab="${tab.id}">
              <i class="ph ${tab.icon}"></i>
              <span>${tab.label}</span>
            </button>
          `).join('')}
        </div>

        <div class="tiktok-settings-content">
          ${contentHtml}
          <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f1f5f9;">
            <button class="btn btn-primary" data-action="save-settings" style="background:linear-gradient(135deg,#fe2c55,#d91a3e);">
              <i class="ph ph-floppy-disk"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderSavedRepliesInline() {
    return `
      <div class="tiktok-saved-replies-header">
        <h3>Saved Replies</h3>
        <button class="btn btn-primary"><i class="ph ph-plus"></i> New Reply</button>
      </div>
      <div class="tiktok-saved-replies-list">
        ${SAVED_REPLIES.map(reply => `
          <div class="tiktok-saved-reply-item">
            <div class="tiktok-saved-reply-icon"><i class="ph ph-chat-circle-text"></i></div>
            <div class="tiktok-saved-reply-content">
              <div class="tiktok-saved-reply-title">${escapeHtml(reply.title)}</div>
              <div class="tiktok-saved-reply-text">${escapeHtml(reply.text)}</div>
              <div class="tiktok-saved-reply-meta">
                <span><i class="ph ph-tag"></i> ${escapeHtml(reply.category)}</span>
                <span><i class="ph ph-clock"></i> Used ${reply.usage} times</span>
              </div>
            </div>
            <div class="tiktok-saved-reply-actions">
              <button class="tiktok-saved-reply-action-btn"><i class="ph ph-pencil-simple"></i></button>
              <button class="tiktok-saved-reply-action-btn"><i class="ph ph-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ============================================
  // Actions
  // ============================================

  selectConversation(id) {
    this.selectedConversation = id;
    const conv = TIKTOK_SAMPLE_CONVERSATIONS.find(c => c.id === id);
    if (conv) conv.unread = false;
    this.renderSidebar();
    this.renderChat();
  }

  getFilteredConversations() {
    if (this.conversationFilter === 'unread') {
      return TIKTOK_SAMPLE_CONVERSATIONS.filter(c => c.unread);
    }
    if (this.conversationFilter === 'assigned') {
      return TIKTOK_SAMPLE_CONVERSATIONS.filter(c => c.priority === 'high');
    }
    return TIKTOK_SAMPLE_CONVERSATIONS;
  }

  filterConversations(filter) {
    this.conversationFilter = filter;
    this.selectedConversation = null;
    this.renderConversations();
  }

  filterSavedReplies(filter) {
    this.savedReplyFilter = filter;
    this.renderSavedRepliesPage();
  }

  switchSettingsTab(tab) {
    this.settingsTab = tab;
    this.renderSettings();
  }

  markConversationRead(id) {
    const item = TIKTOK_SAMPLE_CONVERSATIONS.find(conv => conv.id === id);
    if (item) item.unread = false;
    this.renderConversations();
    OP.toast.show('Marked conversation as read.', 'success');
  }

  useAiReply(reply) {
    const input = document.getElementById('chatInput');
    if (input) input.value = reply;
  }

  sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;
    
    const msg = {
      id: `m${Date.now()}`,
      sender: 'agent',
      text: input.value.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
    
    if (!CHAT_MESSAGES[this.selectedConversation]) {
      CHAT_MESSAGES[this.selectedConversation] = [];
    }
    CHAT_MESSAGES[this.selectedConversation].push(msg);
    
    const conv = TIKTOK_SAMPLE_CONVERSATIONS.find(c => c.id === this.selectedConversation);
    if (conv) {
      conv.lastMessage = msg.text;
      conv.timestamp = new Date().toISOString();
    }
    
    input.value = '';
    this.renderChat();
  }

  useSavedReply(id) {
    const reply = SAVED_REPLIES.find(r => r.id === id);
    if (reply) {
      OP.toast.show(`Using saved reply: ${reply.title}`, 'success');
    }
  }

  togglePermission(id) {
    const toggle = document.querySelector(`[data-id="${id}"]`);
    if (toggle) toggle.classList.toggle('active');
  }

  syncIntegration() {
    OP.loading.show?.();
    setTimeout(() => {
      OP.loading.hide?.();
      OP.toast.show('TikTok integration synced successfully.', 'success');
    }, 900);
  }

  disconnectIntegration() {
    if (!confirm('Are you sure you want to disconnect TikTok?')) return;
    OP.toast.show('TikTok disconnected', 'warning');
  }

  saveSettings() {
    OP.toast.show('Settings saved successfully.', 'success');
  }

  computeStats() {
    return {
      totalConversations: TIKTOK_SAMPLE_CONVERSATIONS.length,
      unreadMessages: TIKTOK_SAMPLE_CONVERSATIONS.filter(item => item.unread).length,
      totalComments: TIKTOK_SAMPLE_COMMENTS.length,
      totalMentions: TIKTOK_SAMPLE_MENTIONS.length
    };
  }

  getCustomer(id) {
    return TIKTOK_SAMPLE_CUSTOMERS.find(item => item.id === id) || { name: 'Unknown', avatar: 'U', color: '#94a3b8', status: 'offline', leadScore: 0, customerStatus: 'Unknown', totalOrders: 0, totalSpent: '$0', labels: [] };
  }

  showError(message) {
    this.container.innerHTML = `<div class="tiktok-error">${escapeHtml(message)}</div>`;
  }
}

window.tiktokApp = null;

document.addEventListener('DOMContentLoaded', () => {
  window.tiktokApp = new TikTokApp();
});