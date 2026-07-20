/**
 * OnePlace Enterprise — TikTok Module
 * Clean rewrite for stable rendering and no syntax errors.
 */

const TIKTOK_STORAGE_KEYS = {
  CONVERSATIONS: 'op_tiktok_conversations',
  COMMENTS: 'op_tiktok_comments',
  MENTIONS: 'op_tiktok_mentions',
  VIDEO_INTERACTIONS: 'op_tiktok_video_interactions',
  INTEGRATION: 'op_tiktok_integration'
};

const TIKTOK_SAMPLE_CUSTOMERS = [
  { id: 'tc1', name: 'Sarah Johnson', handle: '@sarahjohnson', avatar: 'SJ', color: '#fe2c55' },
  { id: 'tc2', name: 'Michael Brown', handle: '@michaelbrown', avatar: 'MB', color: '#25f4ee' },
  { id: 'tc3', name: 'Olivia Rodriguez', handle: '@oliviarodriguez', avatar: 'OR', color: '#f59e0b' },
  { id: 'tc4', name: 'James Wilson', handle: '@jameswilson', avatar: 'JW', color: '#8b5cf6' }
];

const TIKTOK_SAMPLE_CONVERSATIONS = [
  { id: 'tconv1', customerId: 'tc1', lastMessage: 'Hi there! Do you ship to Canada?', unread: true, timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'tconv2', customerId: 'tc2', lastMessage: 'Love your products! Just ordered the blue hoodie.', unread: true, timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'tconv3', customerId: 'tc3', lastMessage: 'Can you tell me the price?', unread: false, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'tconv4', customerId: 'tc4', lastMessage: 'When will this be back in stock?', unread: false, timestamp: new Date(Date.now() - 6 * 3600000).toISOString() }
];

const TIKTOK_SAMPLE_COMMENTS = [
  { id: 'tcmt1', author: 'lisa_park', authorHandle: '@lisa_park', authorAvatar: 'LP', authorColor: '#fe2c55', text: 'Love this collection! 🔥', videoTitle: 'New Product Unboxing!', likes: 24, time: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'tcmt2', author: 'john_doe', authorHandle: '@johndoe', authorAvatar: 'JD', authorColor: '#25f4ee', text: 'How much is this?', videoTitle: 'How to Get More Views', likes: 12, time: new Date(Date.now() - 2 * 3600000).toISOString() }
];

const TIKTOK_SAMPLE_MENTIONS = [
  { id: 'tmen1', author: 'fashion_daily', authorHandle: '@fashiondaily', authorAvatar: 'FD', authorColor: '#fe2c55', text: '@acmesolutions love this collection! 🔥', videoTitle: 'Fashion Week Highlights', likes: 156, time: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'tmen2', author: 'style_inspo', authorHandle: '@styleinspo', authorAvatar: 'SI', authorColor: '#25f4ee', text: 'Just tried your product! @acmesolutions', videoTitle: 'Product Review', likes: 89, time: new Date(Date.now() - 3 * 3600000).toISOString() }
];

const TIKTOK_SAMPLE_VIDEOS = [
  { id: 'v1', title: 'New Product Unboxing!', views: '12.4K', likes: '2.1K', date: 'May 28' },
  { id: 'v2', title: 'How to Get More Views', views: '8.7K', likes: '1.5K', date: 'May 27' },
  { id: 'v3', title: 'Behind the Scenes', views: '5.2K', likes: '890', date: 'May 26' }
];

const DEFAULT_INTEGRATION = {
  connected: true,
  accountName: 'acmesolutions_official',
  connectedDate: 'May 20, 2024',
  permissions: {
    readMessages: true,
    readComments: true,
    readMentions: true,
    readVideoInteractions: true,
    sendMessages: true,
    manageReplies: true
  }
};

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
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
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

class TikTokApp {
  constructor() {
    this.currentView = 'overview';
    this.container = document.getElementById('tiktok-content');
    this.sidebar = document.getElementById('tiktokSidebarNav');
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
      this.renderSidebar();
      this.render();
    });

    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });

    document.getElementById('exportReport')?.addEventListener('click', () => {
      OP.toast.show('Exporting TikTok report...', 'info');
    });

    this.container.addEventListener('click', event => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      const itemId = target.dataset.id;
      if (action === 'mark-read') this.markConversationRead(itemId);
      if (action === 'back-to-list') this.renderConversations();
      if (action === 'sync-integration') this.syncIntegration();
      if (action === 'disconnect-integration') this.disconnectIntegration();
      if (action === 'save-settings') this.saveSettings();
    });
  }

  renderSidebar() {
    const sections = [
      { view: 'overview', label: 'Overview', icon: 'ph-chart-bar' },
      { view: 'conversations', label: 'Conversations', icon: 'ph-chat-centered-text' },
      { view: 'comments', label: 'Comments', icon: 'ph-chat-teardrop-text' },
      { view: 'mentions', label: 'Mentions', icon: 'ph-at' },
      { view: 'videos', label: 'Videos', icon: 'ph-video' },
      { view: 'integration', label: 'Integration', icon: 'ph-plugs' },
      { view: 'settings', label: 'Settings', icon: 'ph-gear' }
    ];

    this.sidebar.innerHTML = sections.map(section => `
      <button class="tiktok-sidebar-link ${this.currentView === section.view ? 'active' : ''}" data-view="${section.view}">
        <i class="ph ${section.icon}"></i>
        <span>${section.label}</span>
      </button>
    `).join('');
  }

  render() {
    switch (this.currentView) {
      case 'conversations': return this.renderConversations();
      case 'comments': return this.renderComments();
      case 'mentions': return this.renderMentions();
      case 'videos': return this.renderVideos();
      case 'integration': return this.renderIntegration();
      case 'settings': return this.renderSettings();
      default: return this.renderOverview();
    }
  }

  renderOverview() {
    const stats = this.computeStats();
    const recent = TIKTOK_SAMPLE_CONVERSATIONS.slice(0, 4);
    const videos = TIKTOK_SAMPLE_VIDEOS.slice(0, 4);
    this.container.innerHTML = `
      <div class="tiktok-overview-header">
        <div class="tiktok-overview-title"><div class="sidebar-platform-icon tiktok"><i class="ph ph-tiktok-logo"></i></div><div><h1>TikTok Overview</h1><p>Monitor and engage with your TikTok audience</p></div></div>
        <div class="tiktok-overview-actions"><div class="tiktok-date-picker"><i class="ph ph-calendar-blank"></i> May 22 - May 28, 2024</div><button class="btn" id="exportReportButton">Export Report</button></div>
      </div>
      <div class="tiktok-stats-grid">
        <div class="tiktok-stat-card"><strong>${stats.totalConversations}</strong><span>Conversations</span></div>
        <div class="tiktok-stat-card"><strong>${stats.unreadMessages}</strong><span>Unread</span></div>
        <div class="tiktok-stat-card"><strong>${stats.totalComments}</strong><span>Comments</span></div>
        <div class="tiktok-stat-card"><strong>${stats.totalMentions}</strong><span>Mentions</span></div>
      </div>
      <div class="tiktok-dashboard-grid">
        <section class="tiktok-widget-card"><div class="tiktok-widget-header"><h3>Conversations Trend</h3></div><div class="tiktok-widget-empty">Trend visualization goes here.</div></section>
        <section class="tiktok-widget-card"><div class="tiktok-widget-header"><h3>Top Video Interactions</h3>${videos.map(video => `<div class="tiktok-video-item"><div class="tiktok-video-thumb"></div><div><strong>${escapeHtml(video.title)}</strong><span>${escapeHtml(video.views)} views</span></div></div>`).join('')}</div></section>
        <section class="tiktok-widget-card"><div class="tiktok-widget-header"><h3>AI Recommendations</h3><span class="badge">BETA</span></div><div class="tiktok-widget-empty">No recommendations available yet.</div></section>
      </div>
      <div class="tiktok-overview-grid">
        <section class="tiktok-widget-card"><div class="tiktok-widget-header"><h3>Recent Conversations</h3></div>${recent.map(item => {
          const customer = this.getCustomer(item.customerId);
          return `<div class="tiktok-recent-item"><span class="tiktok-recent-avatar" style="background:${customer.color};">${escapeHtml(customer.avatar)}</span><div><strong>${escapeHtml(customer.name)}</strong><p>${escapeHtml(item.lastMessage)}</p></div></div>`;
        }).join('')}</section>
        <section class="tiktok-widget-card"><div class="tiktok-widget-header"><h3>Engagement Overview</h3></div><div class="tiktok-widget-empty">Summary statistics and campaign health.</div></section>
        <section class="tiktok-widget-card"><div class="tiktok-widget-header"><h3>Account Status</h3></div><div class="tiktok-widget-empty">TikTok is connected.</div></section>
      </div>
    `;
  }

  renderConversations() {
    this.container.innerHTML = `
      <div class="dashboard-page-title"><h1>Conversations</h1><p>View customer messages from TikTok.</p></div>
      <div class="tiktok-conversations-list">
        ${TIKTOK_SAMPLE_CONVERSATIONS.map(item => {
          const customer = this.getCustomer(item.customerId);
          return `<div class="tiktok-conversation-card ${item.unread ? 'unread' : ''}"><div class="tiktok-conversation-avatar" style="background:${customer.color};">${escapeHtml(customer.avatar)}</div><div class="tiktok-conversation-content"><div><strong>${escapeHtml(customer.name)}</strong><span>${formatTimeAgo(item.timestamp)}</span></div><p>${escapeHtml(item.lastMessage)}</p></div><div class="tiktok-conversation-actions">${item.unread ? `<button class="btn btn-sm" data-action="mark-read" data-id="${item.id}">Mark read</button>` : ''}</div></div>`;
        }).join('')}
      </div>
    `;
  }

  renderComments() {
    this.container.innerHTML = `
      <div class="dashboard-page-title"><h1>Comments</h1><p>Respond to the latest TikTok comments.</p></div>
      <div class="tiktok-comments-section">
        ${TIKTOK_SAMPLE_COMMENTS.map(comment => `<div class="tiktok-comment-card"><div class="tiktok-comment-meta"><span class="tiktok-comment-avatar" style="background:${comment.authorColor};">${escapeHtml(comment.authorAvatar)}</span><div><strong>${escapeHtml(comment.author)}</strong><div>${escapeHtml(comment.authorHandle)}</div></div><span>${formatTimeAgo(comment.time)}</span></div><div class="tiktok-comment-text">${escapeHtml(comment.text)}</div><div class="tiktok-comment-footer"><span>${escapeHtml(comment.videoTitle)}</span><span>${comment.likes} likes</span></div></div>`).join('')}
      </div>
    `;
  }

  renderMentions() {
    this.container.innerHTML = `
      <div class="dashboard-page-title"><h1>Mentions</h1><p>Track brand mentions on TikTok.</p></div>
      <div class="tiktok-comments-section">
        ${TIKTOK_SAMPLE_MENTIONS.map(mention => `<div class="tiktok-comment-card"><div class="tiktok-comment-meta"><span class="tiktok-comment-avatar" style="background:${mention.authorColor};">${escapeHtml(mention.authorAvatar)}</span><div><strong>${escapeHtml(mention.author)}</strong><div>${escapeHtml(mention.authorHandle)}</div></div><span>${formatTimeAgo(mention.time)}</span></div><div class="tiktok-comment-text">${escapeHtml(mention.text)}</div><div class="tiktok-comment-footer"><span>${escapeHtml(mention.videoTitle)}</span><span>${mention.likes} likes</span></div></div>`).join('')}
      </div>
    `;
  }

  renderVideos() {
    this.container.innerHTML = `
      <div class="dashboard-page-title"><h1>Video Interactions</h1><p>Monitor engagement across your TikTok videos.</p></div>
      <div class="tiktok-videos-grid">
        ${TIKTOK_SAMPLE_VIDEOS.map(video => `<div class="tiktok-video-card"><div class="tiktok-video-thumb"></div><div class="tiktok-video-card-body"><strong>${escapeHtml(video.title)}</strong><span>${escapeHtml(video.date)}</span></div><div class="tiktok-video-card-stats"><span>${escapeHtml(video.views)} views</span><span>${escapeHtml(video.likes)} likes</span></div></div>`).join('')}
      </div>
    `;
  }

  renderIntegration() {
    const integration = safeParseStorage(TIKTOK_STORAGE_KEYS.INTEGRATION, DEFAULT_INTEGRATION);
    this.container.innerHTML = `
      <div class="dashboard-page-title"><h1>Integration</h1><p>Manage your TikTok account connection.</p></div>
      <div class="tiktok-integration-panel"><div class="tiktok-integration-summary"><strong>TikTok Business Account</strong><p>${escapeHtml(integration.accountName)}</p><p>${integration.connected ? 'Connected on ' + escapeHtml(integration.connectedDate) : 'Disconnected'}</p></div><div class="tiktok-permissions-list">${Object.entries(integration.permissions || {}).map(([key, allowed]) => `<div class="tiktok-permission-row"><span>${escapeHtml(key.replace(/([A-Z])/g, ' $1'))}</span><span class="permission-status ${allowed ? 'allowed' : 'denied'}">${allowed ? 'Allowed' : 'Denied'}</span></div>`).join('')}</div><div class="tiktok-integration-actions"><button class="btn btn-primary" data-action="sync-integration">Sync Now</button><button class="btn btn-outline" data-action="disconnect-integration">Disconnect</button></div></div>
    `;
  }

  renderSettings() {
    this.container.innerHTML = `
      <div class="dashboard-page-title"><h1>Settings</h1><p>Configure your TikTok workspace preferences.</p></div>
      <div class="tiktok-settings-preview"><div class="tiktok-settings-row"><span>Default response time</span><strong>1 Hour</strong></div><div class="tiktok-settings-row"><span>Timezone</span><strong>(GMT-05:00) Eastern Time</strong></div><div class="tiktok-settings-row"><span>Auto Mark As Read</span><strong>Enabled</strong></div><div class="tiktok-settings-row"><span>AI Suggestions</span><strong>Enabled</strong></div><button class="btn btn-primary" data-action="save-settings">Save Settings</button></div>
    `;
  }

  showError(message) {
    this.container.innerHTML = `<div class="tiktok-error">${escapeHtml(message)}</div>`;
  }

  markConversationRead(id) {
    const item = TIKTOK_SAMPLE_CONVERSATIONS.find(conv => conv.id === id);
    if (item) item.unread = false;
    this.renderConversations();
    OP.toast.show('Marked conversation as read.', 'success');
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
    this.renderIntegration();
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
    return TIKTOK_SAMPLE_CUSTOMERS.find(item => item.id === id) || { name: 'Unknown', avatar: 'U', color: '#94a3b8' };
  }
}

window.tiktokApp = null;

document.addEventListener('DOMContentLoaded', () => {
  window.tiktokApp = new TikTokApp();
});
