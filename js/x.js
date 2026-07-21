/* ============================================
   OnePlace Enterprise v3.0 — X (Twitter) Module JS
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // STORAGE KEYS
  // ============================================
  const X_STORAGE_KEYS = {
    X_CONVERSATIONS: 'op_x_conversations',
    X_CONTACTS: 'op_x_contacts',
    X_TEMPLATES: 'op_x_templates',
    X_SAVED_REPLIES: 'op_x_saved_replies',
    X_MENTIONS: 'op_x_mentions',
    X_COMMENTS: 'op_x_comments',
    X_POSTS: 'op_x_posts',
    X_SETTINGS: 'op_x_settings',
    X_INTEGRATION: 'op_x_integration',
    X_MESSAGES: 'op_x_messages',
    X_AI_RECOMMENDATIONS: 'op_x_ai_recommendations'
  };

  // ============================================
  // SAMPLE DATA
  // ============================================
  const X_SAMPLE_CONTACTS = [
    { id: 'x_c1', name: 'Sarah Johnson', handle: '@sarah_johnson', avatar: '#E4405F', avatarText: 'SJ', location: 'New York, USA', timezone: 'EST', leadScore: 85, status: 'Active Customer', totalOrders: 12, totalSpent: 1245.00, tags: ['vip', 'customer-support'] },
    { id: 'x_c2', name: 'Michael Brown', handle: '@michael_brown', avatar: '#8B5CF6', avatarText: 'MB', location: 'Los Angeles, USA', timezone: 'PST', leadScore: 72, status: 'Active Customer', totalOrders: 8, totalSpent: 890.00, tags: ['sales'] },
    { id: 'x_c3', name: 'Olivia Rodriguez', handle: '@olivia_rodriguez', avatar: '#F97316', avatarText: 'OR', location: 'Chicago, USA', timezone: 'CST', leadScore: 91, status: 'Active Customer', totalOrders: 24, totalSpent: 3200.00, tags: ['vip', 'order-status'] },
    { id: 'x_c4', name: 'James Wilson', handle: '@james_wilson', avatar: '#10B981', avatarText: 'JW', location: 'Miami, USA', timezone: 'EST', leadScore: 68, status: 'Inactive', totalOrders: 3, totalSpent: 150.00, tags: ['returns'] },
    { id: 'x_c5', name: 'Emma Davis', handle: '@emma_davis', avatar: '#EC4899', avatarText: 'ED', location: 'Seattle, USA', timezone: 'PST', leadScore: 88, status: 'Active Customer', totalOrders: 15, totalSpent: 2100.00, tags: ['sales'] },
    { id: 'x_c6', name: 'Daniel Thomas', handle: '@daniel_thomas', avatar: '#6366F1', avatarText: 'DT', location: 'Austin, USA', timezone: 'CST', leadScore: 55, status: 'Lead', totalOrders: 0, totalSpent: 0, tags: ['support'] },
    { id: 'x_c7', name: 'Sophia Martinez', handle: '@sophia_martinez', avatar: '#14B8A6', avatarText: 'SM', location: 'Denver, USA', timezone: 'MST', leadScore: 79, status: 'Active Customer', totalOrders: 6, totalSpent: 540.00, tags: ['customer-support'] },
  ];

  const X_SAMPLE_CONVERSATIONS = [
    { id: 'x_conv_1', contactId: 'x_c1', unread: 2, tag: 'customer-support', lastMessage: 'Hi! I need help with my account.', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), status: 'open', assignedTo: 'tm1', priority: 'high' },
    { id: 'x_conv_2', contactId: 'x_c2', unread: 1, tag: 'sales', lastMessage: 'Do you have a business plan?', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), status: 'open', assignedTo: 'tm1', priority: 'medium' },
    { id: 'x_conv_3', contactId: 'x_c3', unread: 2, tag: 'order-status', lastMessage: 'I can\'t log into my account.', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'open', assignedTo: 'tm2', priority: 'high' },
    { id: 'x_conv_4', contactId: 'x_c4', unread: 1, tag: 'returns', lastMessage: 'Do you have a question about pricing?', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), status: 'open', assignedTo: 'tm1', priority: 'medium' },
    { id: 'x_conv_5', contactId: 'x_c5', unread: 0, tag: 'sales', lastMessage: 'Thank you! That worked.', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), status: 'resolved', assignedTo: 'tm3', priority: 'low' },
    { id: 'x_conv_6', contactId: 'x_c6', unread: 2, tag: 'support', lastMessage: 'I have a question about pricing.', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), status: 'open', assignedTo: 'tm1', priority: 'medium' },
        { id: 'x_conv_7', contactId: 'x_c7', unread: 0, tag: 'customer-support', lastMessage: 'Thank you so much for your help!', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), status: 'resolved', assignedTo: 'tm2', priority: 'low' },
  ];

  const X_SAMPLE_MESSAGES = {
    'x_conv_1': [
      { id: 'm1', type: 'incoming', text: 'Hi! I need help with my account.', time: '10:20 AM', status: 'read' },
      { id: 'm2', type: 'outgoing', text: 'Hello Sarah! 👋\n\nHow can we help you today?', time: '10:21 AM', status: 'read' },
      { id: 'm3', type: 'incoming', text: 'I can\'t seem to reset my password. The link isn\'t working.', time: '10:22 AM', status: 'read' },
      { id: 'm4', type: 'outgoing', text: 'I\'m sorry to hear that. Let me help you reset your password. Can you check your spam folder first?', time: '10:23 AM', status: 'read' },
      { id: 'm5', type: 'incoming', text: 'It was in spam! Thank you so much.', time: '10:24 AM', status: 'read' },
    ],
    'x_conv_2': [
      { id: 'm1', type: 'incoming', text: 'Do you have a business plan?', time: '9:41 AM', status: 'read' },
      { id: 'm2', type: 'outgoing', text: 'Yes! Our Business plan is $99/month and includes unlimited users, advanced analytics, and priority support.', time: '9:42 AM', status: 'delivered' },
    ],
    'x_conv_3': [
      { id: 'm1', type: 'incoming', text: 'I can\'t log into my account.', time: '8:15 AM', status: 'read' },
      { id: 'm2', type: 'outgoing', text: 'Hi Olivia! I can help with that. Are you getting an error message?', time: '8:16 AM', status: 'read' },
      { id: 'm3', type: 'incoming', text: 'It says "Invalid credentials" but I\'m sure my password is correct.', time: '8:17 AM', status: 'read' },
    ],
    'x_conv_4': [
      { id: 'm1', type: 'incoming', text: 'Do you have a question about pricing?', time: '8:32 AM', status: 'read' },
      { id: 'm2', type: 'outgoing', text: 'Our Starter plan is $29/month, Pro is $79/month, and Business is $99/month. All include a 14-day free trial!', time: '8:33 AM', status: 'read' },
    ],
    'x_conv_5': [
      { id: 'm1', type: 'incoming', text: 'The reset link worked! Thank you!', time: 'Yesterday', status: 'read' },
      { id: 'm2', type: 'outgoing', text: 'Great to hear, Emma! Let us know if you need anything else. 😊', time: 'Yesterday', status: 'read' },
    ],
    'x_conv_6': [
      { id: 'm1', type: 'incoming', text: 'I have a question about pricing for enterprise.', time: 'Yesterday', status: 'read' },
      { id: 'm2', type: 'outgoing', text: 'For Enterprise pricing, please contact our sales team at sales@acme.com or schedule a demo.', time: 'Yesterday', status: 'read' },
    ],
    'x_conv_7': [
      { id: 'm1', type: 'incoming', text: 'Thank you so much for your help!', time: 'Yesterday', status: 'read' },
      { id: 'm2', type: 'outgoing', text: 'You\'re very welcome, Sophia! Have a great day! 🎉', time: 'Yesterday', status: 'read' },
    ],
  };

  const X_SAMPLE_MENTIONS = [
    { id: 1, author: 'techcrunch', avatar: '#1DA1F2', avatarText: 'TC', text: 'Great thread on customer service automation by @acmesolutions. Worth a read!', type: 'post', time: '10:24 AM', replied: false, priority: 'high', sentiment: 'positive' },
    { id: 2, author: 'forbes', avatar: '#8B5CF6', avatarText: 'FB', text: '@acmesolutions is revolutionizing how businesses handle social media engagement.', type: 'post', time: '9:15 AM', replied: true, priority: 'medium', sentiment: 'positive' },
    { id: 3, author: 'startup_daily', avatar: '#F97316', avatarText: 'SD', text: 'Just tried @acmesolutions new feature. Mind-blowing stuff!', type: 'post', time: 'Yesterday', replied: false, priority: 'medium', sentiment: 'positive' },
    { id: 4, author: 'customer_first', avatar: '#10B981', avatarText: 'CF', text: 'Hey @acmesolutions, my support ticket has been open for 3 days. Any updates?', type: 'post', time: 'Yesterday', replied: false, priority: 'high', sentiment: 'negative' },
    { id: 5, author: 'marketing_pro', avatar: '#EC4899', avatarText: 'MP', text: 'Love the new dashboard update from @acmesolutions. So intuitive!', type: 'post', time: 'May 27', replied: false, priority: 'low', sentiment: 'positive' },
    { id: 6, author: 'sarah_dev', avatar: '#6366F1', avatarText: 'SD', text: 'Does @acmesolutions have an API? Looking to integrate with our CRM.', type: 'post', time: 'May 26', replied: true, priority: 'medium', sentiment: 'neutral' },
    { id: 7, author: 'business_insider', avatar: '#14B8A6', avatarText: 'BI', text: 'Exclusive: @acmesolutions raises $50M Series B. Read more:', type: 'post', time: 'May 25', replied: false, priority: 'high', sentiment: 'positive' },
    { id: 8, author: 'user_complaint', avatar: '#EF4444', avatarText: 'UC', text: '@acmesolutions your app keeps crashing on iOS. Please fix this!', type: 'post', time: 'May 24', replied: false, priority: 'high', sentiment: 'negative' },
  ];

  const X_SAMPLE_COMMENTS = [
    { id: 1, author: 'anna_smith', avatar: '#E4405F', avatarText: 'AS', text: 'This is exactly what I needed! Thank you for sharing.', post: 'How to automate your customer service', time: '11:45 AM', sentiment: 'positive', replied: false, priority: 'high' },
    { id: 2, author: 'john_doe', avatar: '#8B5CF6', avatarText: 'JD', text: 'Do you have a tutorial for beginners? I\'m new to this.', post: 'Getting Started with OnePlace', time: '10:30 AM', sentiment: 'neutral', replied: false, priority: 'medium' },
    { id: 3, author: 'maria_garcia', avatar: '#F97316', avatarText: 'MG', text: 'The new feature is amazing! Saved me so much time.', post: 'New Feature: AI Reply Suggestions', time: '9:15 AM', sentiment: 'positive', replied: true, priority: 'low' },
    { id: 4, author: 'tom_wilson', avatar: '#10B981', avatarText: 'TW', text: 'When will this be available on mobile?', post: 'Desktop App v3.0 Released', time: '8:42 AM', sentiment: 'neutral', replied: false, priority: 'medium' },
    { id: 5, author: 'lisa_chen', avatar: '#EC4899', avatarText: 'LC', text: 'Not happy with the recent price increase. Considering alternatives.', post: 'Pricing Update 2024', time: 'Yesterday', sentiment: 'negative', replied: false, priority: 'high' },
    { id: 6, author: 'mark_jones', avatar: '#6366F1', avatarText: 'MJ', text: 'Can you add integration with Slack?', post: 'New Integrations Available', time: 'Yesterday', sentiment: 'neutral', replied: false, priority: 'medium' },
    { id: 7, author: 'karen_white', avatar: '#14B8A6', avatarText: 'KW', text: 'Best customer support I\'ve ever experienced! Keep it up!', post: 'Customer Success Story', time: 'May 27', sentiment: 'positive', replied: true, priority: 'low' },
    { id: 8, author: 'david_lee', avatar: '#F59E0B', avatarText: 'DL', text: 'The API documentation needs improvement. Hard to follow.', post: 'API Documentation Update', time: 'May 26', sentiment: 'negative', replied: false, priority: 'high' },
    { id: 9, author: 'jessica_brown', avatar: '#EF4444', avatarText: 'JB', text: 'Love the dark mode! Finally!', post: 'Dark Mode is Here', time: 'May 25', sentiment: 'positive', replied: false, priority: 'low' },
    { id: 10, author: 'chris_martin', avatar: '#3B82F6', avatarText: 'CM', text: 'How do I export my data?', post: 'Data Export Guide', time: 'May 24', sentiment: 'neutral', replied: false, priority: 'medium' },
  ];

  const X_SAMPLE_SAVED_REPLIES = [
    { id: 1, title: 'Welcome Message', shortcut: '/welcome', content: 'Hi there! 👋 Thanks for reaching out to us. How can we help you today?', category: 'general', usageCount: 234, lastUsed: '30 min ago' },
    { id: 2, title: 'Password Reset', shortcut: '/reset', content: 'No problem! Please click this link to reset your password: [reset link]. Let us know if you need further assistance!', category: 'support', usageCount: 156, lastUsed: '2 hours ago' },
    { id: 3, title: 'Pricing Info', shortcut: '/pricing', content: 'Our plans: Starter $29/mo, Pro $79/mo, Business $99/mo. All include 14-day free trial. Enterprise pricing available on request.', category: 'sales', usageCount: 89, lastUsed: '5 hours ago' },
    { id: 4, title: 'Feature Request', shortcut: '/feature', content: 'Thanks for the suggestion! We\'ve added it to our roadmap. We\'ll notify you when it\'s available.', category: 'general', usageCount: 67, lastUsed: '1 day ago' },
    { id: 5, title: 'Bug Report', shortcut: '/bug', content: 'Sorry for the inconvenience! We\'re looking into this issue. Could you provide more details about when it occurs?', category: 'support', usageCount: 45, lastUsed: '2 days ago' },
    { id: 6, title: 'Thank You', shortcut: '/thanks', content: 'Thank you so much for your support! We really appreciate it. 🙏', category: 'general', usageCount: 312, lastUsed: '10 min ago' },
    { id: 7, title: 'Escalation', shortcut: '/escalate', content: 'I\'m escalating this to our senior support team. Someone will reach out within 2 hours.', category: 'support', usageCount: 78, lastUsed: '4 hours ago' },
  ];

  const X_SAMPLE_POSTS = [
    { id: 1, title: 'How to automate your customer service', date: 'May 28, 2024 10:30 AM', likes: 1204, comments: 48, retweets: 156, impressions: 45200, image: null },
    { id: 2, title: 'New Feature: AI Reply Suggestions', date: 'May 26, 2024 09:15 AM', likes: 890, comments: 36, retweets: 98, impressions: 32100, image: null },
    { id: 3, title: 'Customer Success Story: How @techcorp saved 20hrs/week', date: 'May 24, 2024 04:20 PM', likes: 756, comments: 42, retweets: 203, impressions: 38900, image: null },
    { id: 4, title: 'Dark Mode is Here 🌙', date: 'May 22, 2024 11:00 AM', likes: 2341, comments: 89, retweets: 445, impressions: 67800, image: null },
  ];

  const X_SAMPLE_AI_RECOMMENDATIONS = [
    { id: 1, title: 'High Engagement Opportunity', desc: '@techcrunch mentioned you in a trending post. Quick response could drive 500+ profile visits.', priority: 'high', icon: 'ph-trend-up' },
    { id: 2, title: 'Top Mentioned Topic', desc: 'Your pricing update is generating buzz. 23 mentions in the last hour with mixed sentiment.', priority: 'medium', icon: 'ph-chat-circle-text' },
    { id: 3, title: 'Response Time Alert', desc: 'Average response time is 45min. Target is 30min. Consider enabling auto-replies during peak hours.', priority: 'medium', icon: 'ph-clock' },
    { id: 4, title: 'Audience Sentiment', desc: 'Positive sentiment up 12% this week. Your customer success stories are resonating well.', priority: 'low', icon: 'ph-smiley' },
  ];

  const X_SAMPLE_SETTINGS = {
    notifications: true,
    emailNotifications: true,
    autoReply: false,
    messageSync: true,
    markAsRead: false,
    aiSuggestions: true,
    autoAssign: true,
    typingIndicator: true,
    readReceipts: true,
    timezone: 'UTC-05:00 Eastern Time (US & Canada)',
    defaultAccount: '@acmesolutions',
    defaultResponseTime: '1 hour',
  };

  const X_SAMPLE_INTEGRATION = {
    connected: true,
    handle: '@acmesolutions',
    accountType: 'Business Account',
    connectedDate: 'May 12, 2024',
    followers: '24.6K',
    following: 312,
    tweets: 2400,
    engagementRate: '4.8%',
    health: 100,
    apiKey: 'x_api_xxxxxxxxxxxx',
    webhookUrl: 'https://api.acme.com/webhooks/x',
    lastSync: new Date().toISOString(),
  };

  const X_SAMPLE_PERMISSIONS = [
    { label: 'Read Tweets', desc: 'Access to read tweets and timeline', allowed: true },
    { label: 'Send Tweets', desc: 'Post new tweets on behalf of account', allowed: true },
    { label: 'Read Messages', desc: 'Access to read direct messages', allowed: true },
    { label: 'Send Messages', desc: 'Send direct messages', allowed: true },
    { label: 'Manage Lists', desc: 'Create and manage lists', allowed: true },
    { label: 'Read Analytics', desc: 'Access to account analytics and insights', allowed: true },
  ];

  // ============================================
  // X Storage Manager
  // ============================================
  class XStorage {
    constructor() {
      this.init();
    }

    init() {
      Object.entries({
        [X_STORAGE_KEYS.X_CONTACTS]: X_SAMPLE_CONTACTS,
        [X_STORAGE_KEYS.X_CONVERSATIONS]: X_SAMPLE_CONVERSATIONS,
        [X_STORAGE_KEYS.X_MESSAGES]: X_SAMPLE_MESSAGES,
        [X_STORAGE_KEYS.X_MENTIONS]: X_SAMPLE_MENTIONS,
        [X_STORAGE_KEYS.X_COMMENTS]: X_SAMPLE_COMMENTS,
        [X_STORAGE_KEYS.X_SAVED_REPLIES]: X_SAMPLE_SAVED_REPLIES,
        [X_STORAGE_KEYS.X_POSTS]: X_SAMPLE_POSTS,
        [X_STORAGE_KEYS.X_AI_RECOMMENDATIONS]: X_SAMPLE_AI_RECOMMENDATIONS,
        [X_STORAGE_KEYS.X_SETTINGS]: X_SAMPLE_SETTINGS,
        [X_STORAGE_KEYS.X_INTEGRATION]: X_SAMPLE_INTEGRATION,
      }).forEach(([key, data]) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(data));
        }
      });
    }

    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
        return [];
      }
    }

    set(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }

    getContacts() { return this.get(X_STORAGE_KEYS.X_CONTACTS); }
    getConversations() { return this.get(X_STORAGE_KEYS.X_CONVERSATIONS); }
    getMessages(convId) { return this.get(X_STORAGE_KEYS.X_MESSAGES)[convId] || []; }
    getMentions() { return this.get(X_STORAGE_KEYS.X_MENTIONS); }
    getComments() { return this.get(X_STORAGE_KEYS.X_COMMENTS); }
    getSavedReplies() { return this.get(X_STORAGE_KEYS.X_SAVED_REPLIES); }
    getPosts() { return this.get(X_STORAGE_KEYS.X_POSTS); }
    getAIRecommendations() { return this.get(X_STORAGE_KEYS.X_AI_RECOMMENDATIONS); }
    getSettings() { return this.get(X_STORAGE_KEYS.X_SETTINGS); }
    getIntegration() { return this.get(X_STORAGE_KEYS.X_INTEGRATION); }

    getContactById(id) {
      return this.getContacts().find(c => c.id === id);
    }

    getConversationById(id) {
      const conv = this.getConversations().find(c => c.id === id);
      if (conv) {
        conv.contact = this.getContactById(conv.contactId);
      }
      return conv;
    }

    addMessage(convId, message) {
      const allMessages = this.get(X_STORAGE_KEYS.X_MESSAGES);
      if (!allMessages[convId]) allMessages[convId] = [];
      message.id = `m_${Date.now()}`;
      message.time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      allMessages[convId].push(message);
      this.set(X_STORAGE_KEYS.X_MESSAGES, allMessages);

      const conversations = this.getConversations();
      const idx = conversations.findIndex(c => c.id === convId);
      if (idx !== -1) {
        conversations[idx].lastMessage = message.text;
        conversations[idx].timestamp = new Date().toISOString();
        if (message.type === 'incoming') {
          conversations[idx].unread = (conversations[idx].unread || 0) + 1;
        }
        this.set(X_STORAGE_KEYS.X_CONVERSATIONS, conversations);
      }
      return message;
    }

    markConversationRead(id) {
      const conversations = this.getConversations();
      const idx = conversations.findIndex(c => c.id === id);
      if (idx !== -1) {
        conversations[idx].unread = 0;
        this.set(X_STORAGE_KEYS.X_CONVERSATIONS, conversations);
      }
    }

    updateSettings(settings) {
      const current = this.getSettings();
      this.set(X_STORAGE_KEYS.X_SETTINGS, { ...current, ...settings, updatedAt: new Date().toISOString() });
    }

    getStats() {
      const conversations = this.getConversations();
      const mentions = this.getMentions();
      const comments = this.getComments();
      const posts = this.getPosts();
      const integration = this.getIntegration();

      return {
        totalConversations: conversations.length,
        responseRate: '91.4%',
        mentions: mentions.length,
        comments: comments.length,
        profileVisits: '1.2K',
        likes: '3.6K',
        followers: integration.followers || '24.6K',
        following: integration.following || 312,
        tweets: integration.tweets || 2400,
        engagementRate: integration.engagementRate || '4.8%',
        unreadMessages: conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
      };
    }
  }

  // ============================================
  // CHART UTILITIES
  // ============================================
  const Charts = {
    renderLineChart(containerId, data, colors) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const width = container.clientWidth || 500;
      const height = 220;
      const padding = { top: 10, right: 10, bottom: 30, left: 40 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const allValues = data.flatMap(d => d.values);
      const maxVal = Math.max(...allValues) * 1.1;
      const xStep = chartWidth / (data[0].values.length - 1);

      let svg = `<svg class="x-line-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`;

      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        const val = Math.round(maxVal - (maxVal / 4) * i);
        svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--gray-200)" stroke-width="1" stroke-dasharray="4"/>`;
        svg += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" fill="var(--gray-400)" font-size="10">${val}</text>`;
      }

      const labels = ['May 22', 'May 23', 'May 24', 'May 25', 'May 26', 'May 27', 'May 28'];
      labels.forEach((label, i) => {
        const x = padding.left + i * xStep;
        svg += `<text x="${x}" y="${height - 8}" text-anchor="middle" fill="var(--gray-400)" font-size="10">${label}</text>`;
      });

      data.forEach((series, si) => {
        const color = colors[si];
        let pathD = '';
        series.values.forEach((val, i) => {
          const x = padding.left + i * xStep;
          const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
          pathD += (i === 0 ? 'M' : 'L') + `${x},${y} `;
        });
        svg += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
        series.values.forEach((val, i) => {
          const x = padding.left + i * xStep;
          const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
          svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" stroke="white" stroke-width="2"/>`;
        });
      });

      svg += '</svg>';
      container.innerHTML = svg;
    },

    renderDonutChart(containerId, data) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const size = 140;
      const strokeWidth = 16;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const total = data.reduce((sum, d) => sum + d.value, 0);

      let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
      let offset = 0;

      data.forEach(item => {
        const dash = (item.value / total) * circumference;
        const gap = circumference - dash;
        svg += `<circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="${item.color}" stroke-width="${strokeWidth}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"/>`;
        offset += dash;
      });

      svg += '</svg>';

      let legend = '<div class="x-donut-legend">';
      data.forEach(item => {
        legend += `<div class="x-donut-legend-item"><span class="x-donut-legend-dot" style="background:${item.color}"></span><span class="x-donut-legend-label">${item.label}</span><span class="x-donut-legend-value">${item.value}%</span></div>`;
      });
      legend += '</div>';

      container.innerHTML = `
        <div class="x-donut-chart-container">
          <div class="x-donut-chart">${svg}
            <div class="x-donut-chart-center">
              <div class="x-donut-chart-value">${total.toLocaleString()}</div>
              <div class="x-donut-chart-label">Total</div>
            </div>
          </div>
          ${legend}
        </div>
      `;
    }
  };

  // ============================================
  // PAGE RENDERERS
  // ============================================
  const Pages = {
    overview() {
      const stats = store.getStats();
      const aiRecs = store.getAIRecommendations();
      const conversations = store.getConversations().slice(0, 5);
      const posts = store.getPosts();
      const integration = store.getIntegration();

      return `
        <div class="x-page-header">
          <div class="x-page-header-left">
            <div class="x-page-header-icon"><i class="ph ph-x-logo"></i></div>
            <div>
              <div class="x-page-header-title">X (Twitter) Overview</div>
              <div class="x-page-header-subtitle">Track engagement and manage your X conversations</div>
            </div>
          </div>
          <div class="x-page-header-right">
            <button class="x-date-picker"><i class="ph ph-calendar"></i> May 22 - May 28, 2024 <i class="ph ph-caret-down"></i></button>
            <button class="x-export-btn"><i class="ph ph-download-simple"></i> Export Report</button>
          </div>
        </div>

        <div class="x-stats-row">
          <div class="x-stat-card">
            <div class="x-stat-card-header">
              <span class="x-stat-card-label">Total Conversations</span>
              <div class="x-stat-card-icon pink"><i class="ph ph-chat-circle-text"></i></div>
            </div>
            <div class="x-stat-card-value">${stats.totalConversations}</div>
            <div class="x-stat-card-trend up"><i class="ph ph-trend-up"></i> 12.4%</div>
            <div class="x-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="x-stat-card">
            <div class="x-stat-card-header">
              <span class="x-stat-card-label">Response Rate</span>
              <div class="x-stat-card-icon purple"><i class="ph ph-check-circle"></i></div>
            </div>
            <div class="x-stat-card-value">${stats.responseRate}</div>
            <div class="x-stat-card-trend up"><i class="ph ph-trend-up"></i> 5.1%</div>
            <div class="x-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="x-stat-card">
            <div class="x-stat-card-header">
              <span class="x-stat-card-label">Mentions</span>
              <div class="x-stat-card-icon blue"><i class="ph ph-at"></i></div>
            </div>
            <div class="x-stat-card-value">${stats.mentions}</div>
            <div class="x-stat-card-trend up"><i class="ph ph-trend-up"></i> 13.6%</div>
            <div class="x-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="x-stat-card">
            <div class="x-stat-card-header">
              <span class="x-stat-card-label">Comments & Replies</span>
              <div class="x-stat-card-icon orange"><i class="ph ph-chat-teardrop-text"></i></div>
            </div>
            <div class="x-stat-card-value">${stats.comments}</div>
            <div class="x-stat-card-trend up"><i class="ph ph-trend-up"></i> 22.5%</div>
            <div class="x-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="x-stat-card">
            <div class="x-stat-card-header">
              <span class="x-stat-card-label">Profile Visits</span>
              <div class="x-stat-card-icon green"><i class="ph ph-user"></i></div>
            </div>
            <div class="x-stat-card-value">${stats.profileVisits}</div>
            <div class="x-stat-card-trend up"><i class="ph ph-trend-up"></i> 18.5%</div>
            <div class="x-stat-card-sub">vs last 7 days</div>
          </div>
        </div>

        <div class="x-dashboard-grid">
          <div class="x-col-5">
            <div class="x-widget-card">
              <div class="x-widget-header">
                <span class="x-widget-title">Engagement Trend</span>
                <div class="x-widget-actions">
                  <button class="x-widget-action-btn"><i class="ph ph-dots-three"></i></button>
                </div>
              </div>
              <div class="x-widget-body">
                <div class="x-chart-legend">
                  <div class="x-chart-legend-item"><span class="x-chart-legend-dot" style="background:#1DA1F2"></span> Mentions</div>
                  <div class="x-chart-legend-item"><span class="x-chart-legend-dot" style="background:#8B5CF6"></span> Replies</div>
                  <div class="x-chart-legend-item"><span class="x-chart-legend-dot" style="background:#10B981"></span> Likes</div>
                </div>
                <div class="x-line-chart-container" id="overview-chart"></div>
              </div>
            </div>
          </div>

          <div class="x-col-4">
            <div class="x-widget-card">
              <div class="x-widget-header">
                <span class="x-widget-title">Engagement Overview</span>
                <a href="#" class="x-view-all">View Details</a>
              </div>
              <div class="x-widget-body">
                <div id="engagement-chart"></div>
              </div>
            </div>
          </div>

          <div class="x-col-3">
            <div class="x-widget-card">
              <div class="x-widget-header">
                <span class="x-widget-title">AI Insights</span>
                <span class="x-beta-badge">Beta</span>
              </div>
              <div class="x-widget-body">
                <div class="x-ai-list">
                  ${aiRecs.map(rec => `
                    <div class="x-ai-item priority-${rec.priority}">
                      <div class="x-ai-icon"><i class="ph ${rec.icon}"></i></div>
                      <div class="x-ai-content">
                        <div class="x-ai-title">${rec.title}</div>
                        <div class="x-ai-desc">${rec.desc}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top:var(--space-3);text-align:center;">
                  <a href="#" class="x-view-all">View All Insights</a>
                </div>
              </div>
            </div>
          </div>

          <div class="x-col-5">
            <div class="x-widget-card">
              <div class="x-widget-header">
                <span class="x-widget-title">Recent Conversations</span>
                <a href="#conversations" class="x-view-all" data-nav="conversations">View All</a>
              </div>
              <div class="x-widget-body">
                <div class="x-conversation-list">
                  ${conversations.map(conv => {
                    const contact = store.getContactById(conv.contactId);
                    const timeAgo = formatTimeAgo(conv.timestamp);
                    return `
                    <div class="x-conversation-item ${conv.unread > 0 ? 'unread' : ''}" data-conv-id="${conv.id}">
                      <div class="x-conv-avatar" style="background:${contact?.avatar || '#6366f1'}">${contact?.avatarText || '??'}
                        <div class="x-conv-platform-badge"><i class="ph ph-x-logo"></i></div>
                      </div>
                      <div class="x-conv-content">
                        <div class="x-conv-name ${conv.unread > 0 ? 'unread' : ''}">${contact?.name || 'Unknown'}</div>
                        <div class="x-conv-preview">${conv.lastMessage}</div>
                      </div>
                      <div class="x-conv-meta">
                        <span class="x-conv-time">${timeAgo}</span>
                        <span class="x-conv-badge priority-${conv.priority}">${conv.priority}</span>
                      </div>
                    </div>
                  `}).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="x-col-4">
            <div class="x-widget-card">
              <div class="x-widget-header">
                <span class="x-widget-title">Top Performing Posts</span>
                <a href="#" class="x-view-all">View All</a>
              </div>
              <div class="x-widget-body">
                <div class="x-post-list">
                  ${posts.map(post => `
                    <div class="x-post-item">
                      <div class="x-post-thumb"><i class="ph ph-file-text"></i></div>
                      <div class="x-post-content">
                        <div class="x-post-title">${post.title}</div>
                        <div class="x-post-date">${post.date}</div>
                        <div class="x-post-stats">
                          <span class="x-post-stat"><i class="ph ph-heart"></i> ${post.likes}</span>
                          <span class="x-post-stat"><i class="ph ph-chat-circle"></i> ${post.comments}</span>
                          <span class="x-post-stat"><i class="ph ph-repeat"></i> ${post.retweets}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="x-col-3">
            <div class="x-widget-card">
              <div class="x-widget-header">
                <span class="x-widget-title">Account Summary</span>
                <span class="x-account-status-badge connected">Connected</span>
              </div>
              <div class="x-widget-body x-account-status-card">
                <div class="x-account-status-header">
                  <div class="x-account-status-avatar"><i class="ph ph-x-logo"></i></div>
                  <div class="x-account-status-info">
                    <div class="x-account-status-name">${integration.handle}</div>
                    <div class="x-account-status-type">${integration.accountType}</div>
                  </div>
                </div>
                <div class="x-account-status-detail">Connected on ${integration.connectedDate}</div>
                <div class="x-account-metrics">
                  <div class="x-account-metric">
                    <div class="x-account-metric-value">${integration.followers}</div>
                    <div class="x-account-metric-label">Followers</div>
                    <div class="x-account-metric-change"><i class="ph ph-trend-up"></i> 234</div>
                  </div>
                  <div class="x-account-metric">
                    <div class="x-account-metric-value">${integration.following}</div>
                    <div class="x-account-metric-label">Following</div>
                    <div class="x-account-metric-change down"><i class="ph ph-trend-down"></i> 4</div>
                  </div>
                  <div class="x-account-metric">
                    <div class="x-account-metric-value">${integration.tweets}</div>
                    <div class="x-account-metric-label">Tweets</div>
                    <div class="x-account-metric-change"><i class="ph ph-trend-up"></i> 12</div>
                  </div>
                </div>
                <div class="x-connection-health">
                  <div class="x-connection-health-label"><span>Connection Health</span><span>${integration.health}%</span></div>
                  <div class="x-connection-health-bar"><div class="x-connection-health-fill" style="width:${integration.health}%"></div></div>
                </div>
                <button class="x-view-integration-btn" onclick="navigateTo('integration')">View Integration</button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    conversations() {
      const conversations = store.getConversations();
      const firstConv = conversations[0];
      const firstContact = firstConv ? store.getContactById(firstConv.contactId) : null;

      return `
        <div class="x-page-header">
          <div class="x-page-header-left">
            <div class="x-page-header-icon"><i class="ph ph-chat-circle-text"></i></div>
            <div>
              <div class="x-page-header-title">Conversations</div>
              <div class="x-page-header-subtitle">Manage and respond to your X DMs</div>
            </div>
          </div>
          <div class="x-page-header-right">
            <button class="x-date-picker"><i class="ph ph-funnel"></i> Filters <i class="ph ph-caret-down"></i></button>
          </div>
        </div>

        <div class="x-conversations-layout">
          <div class="x-conversations-sidebar">
            <div class="x-conv-search">
              <input type="text" class="x-conv-search-input" placeholder="Search conversations..." id="conv-search">
            </div>
            <div class="x-conv-filters">
              <button class="x-conv-filter-btn active" data-filter="all">All</button>
              <button class="x-conv-filter-btn" data-filter="unread">Unread</button>
              <button class="x-conv-filter-btn" data-filter="assigned">Assigned to me</button>
            </div>
            <div class="x-conv-list-scroll" id="conv-list">
              ${conversations.map(conv => {
                const contact = store.getContactById(conv.contactId);
                const timeAgo = formatTimeAgo(conv.timestamp);
                return `
                <div class="x-conversation-item ${conv.unread > 0 ? 'unread' : ''}" data-conv-id="${conv.id}">
                  <div class="x-conv-avatar" style="background:${contact?.avatar || '#6366f1'}">${contact?.avatarText || '??'}
                    <div class="x-conv-platform-badge"><i class="ph ph-x-logo"></i></div>
                  </div>
                  <div class="x-conv-content">
                    <div class="x-conv-name ${conv.unread > 0 ? 'unread' : ''}">${contact?.name || 'Unknown'}</div>
                    <div class="x-conv-preview">${conv.lastMessage}</div>
                  </div>
                  <div class="x-conv-meta">
                    <span class="x-conv-time">${timeAgo}</span>
                    <span class="x-conv-badge priority-${conv.priority}">${conv.priority}</span>
                  </div>
                </div>
              `}).join('')}
            </div>
          </div>
          <div class="x-conversation-chat" id="chat-area">
            <div class="x-chat-header">
              <div class="x-chat-header-left">
                <div class="x-chat-header-avatar" style="background:${firstContact?.avatar || '#E4405F'}">${firstContact?.avatarText || 'SJ'}</div>
                <div class="x-chat-header-info">
                  <div class="x-chat-header-name">${firstContact?.name || 'Sarah Johnson'}</div>
                  <div class="x-chat-header-status"><span class="x-chat-header-status-dot"></span> Active now</div>
                </div>
              </div>
              <div class="x-chat-header-right">
                <button class="x-chat-action-btn"><i class="ph ph-user"></i></button>
                <button class="x-chat-action-btn"><i class="ph ph-tag"></i></button>
                <button class="x-chat-action-btn"><i class="ph ph-dots-three-vertical"></i></button>
              </div>
            </div>
            <div class="x-chat-messages" id="chat-messages">
              ${firstConv ? store.getMessages(firstConv.id).map(msg => `
                <div class="x-chat-message ${msg.type}">
                  <div class="x-chat-message-avatar" style="background:${msg.type === 'incoming' ? (firstContact?.avatar || '#E4405F') : '#1DA1F2'}">${msg.type === 'incoming' ? (firstContact?.avatarText || 'SJ') : 'ME'}</div>
                  <div>
                    <div class="x-chat-message-bubble">${escapeHtml(msg.text).replace(/\n/g, '<br>')}</div>
                    <div class="x-chat-message-time">${msg.time}</div>
                  </div>
                </div>
              `).join('') : '<div class="x-empty-state"><div class="x-empty-state-icon"><i class="ph ph-chat-circle-text"></i></div><div class="x-empty-state-title">No messages</div></div>'}
            </div>
            <div class="x-chat-input-area">
              <div class="x-chat-tools">
                <button class="x-chat-tool-btn"><i class="ph ph-paperclip"></i></button>
                <button class="x-chat-tool-btn"><i class="ph ph-image"></i></button>
                <button class="x-chat-tool-btn"><i class="ph ph-smiley"></i></button>
              </div>
              <input type="text" class="x-chat-input" placeholder="Type your message..." id="chat-input">
              <button class="x-chat-send-btn" id="chat-send"><i class="ph ph-paper-plane-right"></i></button>
            </div>
          </div>
        </div>
      `;
    },

    mentions() {
      const mentions = store.getMentions();

      return `
        <div class="x-page-header">
          <div class="x-page-header-left">
            <div class="x-page-header-icon"><i class="ph ph-at"></i></div>
            <div>
              <div class="x-page-header-title">Mentions</div>
              <div class="x-page-header-subtitle">Track when your account is mentioned on X</div>
            </div>
          </div>
          <div class="x-page-header-right">
            <button class="x-date-picker"><i class="ph ph-funnel"></i> Filters <i class="ph ph-caret-down"></i></button>
          </div>
        </div>

        <div class="x-comments-toolbar">
          <div class="x-comments-filters">
            <button class="x-comments-filter-btn active" data-filter="all">All</button>
            <button class="x-comments-filter-btn" data-filter="unread">Unread</button>
            <button class="x-comments-filter-btn" data-filter="replied">Replied</button>
            <button class="x-comments-filter-btn" data-filter="newest">Newest</button>
          </div>
          <span style="font-size:11px;color:var(--gray-400);">Showing 1 to ${mentions.length} of ${mentions.length} mentions</span>
        </div>

        <div class="x-mentions-list">
          ${mentions.map(mention => `
            <div class="x-mention-item">
              <div class="x-mention-avatar" style="background:${mention.avatar}">${mention.avatarText}</div>
              <div class="x-mention-body">
                <div class="x-mention-header">
                  <span class="x-mention-author">${mention.author}</span>
                  <span class="x-mention-handle">@${mention.author}</span>
                  <span class="x-mention-type-badge ${mention.type}">${mention.type}</span>
                  <span class="x-mention-time">${mention.time}</span>
                </div>
                <div class="x-mention-text">${mention.text.replace('@acmesolutions', '<span class="mention-tag">@acmesolutions</span>')}</div>
                <div class="x-mention-source"><i class="ph ph-x-logo"></i> X ${mention.type.charAt(0).toUpperCase() + mention.type.slice(1)}</div>
                <div class="x-mention-actions">
                  <button class="x-mention-action-btn"><i class="ph ph-arrow-u-up-left"></i> Reply</button>
                  <button class="x-mention-action-btn"><i class="ph ph-heart"></i> Like</button>
                  <button class="x-mention-action-btn"><i class="ph ph-repeat"></i> Retweet</button>
                  ${!mention.replied ? '<button class="x-mention-action-btn primary"><i class="ph ph-lightning"></i> AI Reply</button>' : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="x-comments-pagination">
          <button class="x-page-btn" disabled><i class="ph ph-caret-left"></i></button>
          <button class="x-page-btn active">1</button>
          <button class="x-page-btn">2</button>
          <button class="x-page-btn"><i class="ph ph-caret-right"></i></button>
        </div>
      `;
    },

    replies() {
      const comments = store.getComments();

      return `
        <div class="x-page-header">
          <div class="x-page-header-left">
            <div class="x-page-header-icon"><i class="ph ph-chat-teardrop-text"></i></div>
            <div>
              <div class="x-page-header-title">Comments & Replies</div>
              <div class="x-page-header-subtitle">Review and respond to comments on your posts</div>
            </div>
          </div>
          <div class="x-page-header-right">
            <button class="x-date-picker"><i class="ph ph-funnel"></i> Filters <i class="ph ph-caret-down"></i></button>
          </div>
        </div>

        <div class="x-comments-toolbar">
          <div class="x-comments-filters">
            <button class="x-comments-filter-btn active" data-filter="all">All</button>
            <button class="x-comments-filter-btn" data-filter="unread">Unread</button>
            <button class="x-comments-filter-btn" data-filter="replied">Replied</button>
            <button class="x-comments-filter-btn" data-filter="priority">Priority</button>
          </div>
          <span style="font-size:11px;color:var(--gray-400);">Showing 1 to ${comments.length} of ${comments.length} comments</span>
        </div>

        <div class="x-comments-list">
          ${comments.map(comment => `
            <div class="x-comment-item">
              <div class="x-comment-avatar" style="background:${comment.avatar}">${comment.avatarText}</div>
              <div class="x-comment-body">
                <div class="x-comment-header">
                  <span class="x-comment-author">${comment.author}</span>
                  <span class="x-comment-handle">@${comment.author}</span>
                  <span class="x-comment-sentiment ${comment.sentiment}">${comment.sentiment}</span>
                  <span class="x-comment-time">${comment.time}</span>
                </div>
                <div class="x-comment-text">${comment.text}</div>
                <div class="x-comment-post-ref">On post: <a href="#">${comment.post}</a></div>
                <div class="x-comment-actions">
                  <button class="x-comment-action-btn"><i class="ph ph-arrow-u-up-left"></i> Reply</button>
                  <button class="x-comment-action-btn"><i class="ph ph-heart"></i> Like</button>
                  <button class="x-comment-action-btn"><i class="ph ph-repeat"></i> Retweet</button>
                  ${!comment.replied ? '<button class="x-comment-action-btn primary"><i class="ph ph-lightning"></i> AI Reply</button>' : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="x-comments-pagination">
          <button class="x-page-btn" disabled><i class="ph ph-caret-left"></i></button>
          <button class="x-page-btn active">1</button>
          <button class="x-page-btn">2</button>
          <button class="x-page-btn">3</button>
          <button class="x-page-btn"><i class="ph ph-caret-right"></i></button>
        </div>
      `;
    },

    'saved-replies'() {
      const replies = store.getSavedReplies();

      return `
        <div class="x-page-header">
          <div class="x-page-header-left">
            <div class="x-page-header-icon"><i class="ph ph-lightning"></i></div>
            <div>
              <div class="x-page-header-title">Saved Replies</div>
              <div class="x-page-header-subtitle">Create and manage quick response templates</div>
            </div>
          </div>
          <div class="x-page-header-right">
            <button class="x-new-reply-btn" id="new-reply-btn"><i class="ph ph-plus"></i> New Reply</button>
          </div>
        </div>

        <div class="x-reply-categories">
          <button class="x-reply-category-btn active" data-category="all">All</button>
          <button class="x-reply-category-btn" data-category="general">General</button>
          <button class="x-reply-category-btn" data-category="support">Support</button>
          <button class="x-reply-category-btn" data-category="sales">Sales</button>
        </div>

        <div class="x-replies-list">
          ${replies.map(reply => `
            <div class="x-reply-item">
              <div class="x-reply-header">
                <span class="x-reply-title">${reply.title}</span>
                <div class="x-reply-actions">
                  <button class="x-reply-action-btn" title="Copy"><i class="ph ph-copy"></i></button>
                  <button class="x-reply-action-btn" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                  <button class="x-reply-action-btn" title="Delete"><i class="ph ph-trash"></i></button>
                </div>
              </div>
              <div class="x-reply-shortcut">Shortcut: <code>${reply.shortcut}</code></div>
              <div class="x-reply-content">${reply.content}</div>
              <div class="x-reply-footer">
                <div class="x-reply-meta">
                  <span class="x-reply-meta-item"><i class="ph ph-tag"></i> ${reply.category}</span>
                  <span class="x-reply-meta-item"><i class="ph ph-chart-bar"></i> Used ${reply.usageCount} times</span>
                  <span class="x-reply-meta-item"><i class="ph ph-clock"></i> ${reply.lastUsed}</span>
                </div>
                <div class="x-reply-tags">
                  <span class="x-reply-tag ${reply.category}">${reply.category}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },

    integration() {
      const integration = store.getIntegration();

      return `
        <div class="x-page-header">
          <div class="x-page-header-left">
            <div class="x-page-header-icon"><i class="ph ph-plugs-connected"></i></div>
            <div>
              <div class="x-page-header-title">X (Twitter) Integration</div>
              <div class="x-page-header-subtitle">Manage your X account connection</div>
            </div>
          </div>
        </div>

        <div class="x-integration-layout">
          <div class="x-integration-card">
            <div class="x-integration-header">
              <span class="x-integration-title">Connection Status</span>
              <span class="x-integration-status connected"><i class="ph ph-check-circle"></i> Connected</span>
            </div>
            <div class="x-integration-info">
              <div class="x-integration-avatar"><i class="ph ph-x-logo"></i></div>
              <div class="x-integration-details">
                <div class="x-integration-name">${integration.handle}</div>
                <div class="x-integration-handle">${integration.accountType}</div>
                <div class="x-integration-date">Connected on ${integration.connectedDate}</div>
              </div>
            </div>
            <div class="x-connection-health">
              <div class="x-connection-health-label"><span>Connection Health</span><span>${integration.health}%</span></div>
              <div class="x-connection-health-bar"><div class="x-connection-health-fill" style="width:${integration.health}%"></div></div>
            </div>
          </div>

          <div class="x-integration-card">
            <div class="x-integration-header">
              <span class="x-integration-title">Permissions</span>
            </div>
            <div class="x-permissions-grid">
              ${X_SAMPLE_PERMISSIONS.map(perm => `
                <div class="x-permission-item">
                  <div class="x-permission-icon ${perm.allowed ? 'allowed' : 'denied'}"><i class="ph ${perm.allowed ? 'ph-check' : 'ph-x'}"></i></div>
                  <div class="x-permission-info">
                    <div class="x-permission-label">${perm.label}</div>
                    <div class="x-permission-desc">${perm.desc}</div>
                  </div>
                  <span class="x-permission-status ${perm.allowed ? 'allowed' : 'denied'}">${perm.allowed ? 'Allowed' : 'Denied'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="x-integration-card">
            <div class="x-integration-header">
              <span class="x-integration-title">Actions</span>
            </div>
            <div class="x-integration-actions">
              <button class="x-integration-btn primary" id="sync-btn"><i class="ph ph-arrows-clockwise"></i> Sync Now</button>
              <button class="x-integration-btn secondary"><i class="ph ph-gear"></i> Configure</button>
              <button class="x-integration-btn danger" id="disconnect-btn"><i class="ph ph-plugs"></i> Disconnect</button>
            </div>
          </div>
        </div>
      `;
    },

    settings() {
      const settings = store.getSettings();

      return `
        <div class="x-page-header">
          <div class="x-page-header-left">
            <div class="x-page-header-icon"><i class="ph ph-gear"></i></div>
            <div>
              <div class="x-page-header-title">X (Twitter) Settings</div>
              <div class="x-page-header-subtitle">Configure your X integration preferences</div>
            </div>
          </div>
        </div>

        <div class="x-settings-layout">
          <div class="x-settings-card">
            <div class="x-settings-card-header">
              <div class="x-settings-card-icon pink"><i class="ph ph-bell"></i></div>
              <div>
                <div class="x-settings-card-title">Notifications</div>
                <div class="x-settings-card-subtitle">Manage how you receive alerts</div>
              </div>
            </div>
            <div class="x-settings-card-body">
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Push Notifications</div>
                  <div class="x-setting-desc">Receive push notifications for new messages</div>
                </div>
                <div class="x-toggle ${settings.notifications ? 'active' : ''}" data-setting="notifications"></div>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Email Notifications</div>
                  <div class="x-setting-desc">Get email alerts for important activities</div>
                </div>
                <div class="x-toggle ${settings.emailNotifications ? 'active' : ''}" data-setting="emailNotifications"></div>
              </div>
            </div>
          </div>

          <div class="x-settings-card">
            <div class="x-settings-card-header">
              <div class="x-settings-card-icon blue"><i class="ph ph-chat-circle-text"></i></div>
              <div>
                <div class="x-settings-card-title">Message Sync</div>
                <div class="x-settings-card-subtitle">Control how messages are synchronized</div>
              </div>
            </div>
            <div class="x-settings-card-body">
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Auto Sync</div>
                  <div class="x-setting-desc">Automatically sync new messages</div>
                </div>
                <div class="x-toggle ${settings.messageSync ? 'active' : ''}" data-setting="messageSync"></div>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Mark as Read</div>
                  <div class="x-setting-desc">Automatically mark messages as read</div>
                </div>
                <div class="x-toggle ${settings.markAsRead ? 'active' : ''}" data-setting="markAsRead"></div>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Auto Replies</div>
                  <div class="x-setting-desc">Send automatic responses when away</div>
                </div>
                <div class="x-toggle ${settings.autoReply ? 'active' : ''}" data-setting="autoReply"></div>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Typing Indicator</div>
                  <div class="x-setting-desc">Show when you are typing</div>
                </div>
                <div class="x-toggle ${settings.typingIndicator ? 'active' : ''}" data-setting="typingIndicator"></div>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Read Receipts</div>
                  <div class="x-setting-desc">Show when messages are read</div>
                </div>
                <div class="x-toggle ${settings.readReceipts ? 'active' : ''}" data-setting="readReceipts"></div>
              </div>
            </div>
          </div>

          <div class="x-settings-card">
            <div class="x-settings-card-header">
              <div class="x-settings-card-icon purple"><i class="ph ph-sparkle"></i></div>
              <div>
                <div class="x-settings-card-title">AI Features</div>
                <div class="x-settings-card-subtitle">Configure AI-powered assistance</div>
              </div>
            </div>
            <div class="x-settings-card-body">
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">AI Suggestions</div>
                  <div class="x-setting-desc">Show AI reply suggestions</div>
                </div>
                <div class="x-toggle ${settings.aiSuggestions ? 'active' : ''}" data-setting="aiSuggestions"></div>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Auto Assignment</div>
                  <div class="x-setting-desc">Automatically assign new conversations</div>
                </div>
                <div class="x-toggle ${settings.autoAssign ? 'active' : ''}" data-setting="autoAssign"></div>
              </div>
            </div>
          </div>

          <div class="x-settings-card">
            <div class="x-settings-card-header">
              <div class="x-settings-card-icon green"><i class="ph ph-globe"></i></div>
              <div>
                <div class="x-settings-card-title">General</div>
                <div class="x-settings-card-subtitle">Basic account preferences</div>
              </div>
            </div>
            <div class="x-settings-card-body">
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Default X Account</div>
                  <div class="x-setting-desc">Primary account for this integration</div>
                </div>
                <input type="text" class="x-setting-input" value="${settings.defaultAccount}" readonly>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Default Response Time</div>
                  <div class="x-setting-desc">Target response time for conversations</div>
                </div>
                <select class="x-setting-select" id="response-time-select">
                  <option ${settings.defaultResponseTime === '15 minutes' ? 'selected' : ''}>15 minutes</option>
                  <option ${settings.defaultResponseTime === '30 minutes' ? 'selected' : ''}>30 minutes</option>
                  <option ${settings.defaultResponseTime === '1 hour' ? 'selected' : ''}>1 hour</option>
                  <option ${settings.defaultResponseTime === '2 hours' ? 'selected' : ''}>2 hours</option>
                  <option ${settings.defaultResponseTime === '4 hours' ? 'selected' : ''}>4 hours</option>
                </select>
              </div>
              <div class="x-setting-row">
                <div class="x-setting-info">
                  <div class="x-setting-label">Timezone</div>
                  <div class="x-setting-desc">Set your local timezone</div>
                </div>
                <select class="x-setting-select" id="timezone-select">
                  <option selected>${settings.timezone}</option>
                  <option>UTC-08:00 Pacific Time</option>
                  <option>UTC-06:00 Central Time</option>
                  <option>UTC+00:00 GMT</option>
                  <option>UTC+01:00 Central European Time</option>
                </select>
              </div>
            </div>
          </div>

          <div class="x-settings-save-bar">
            <button class="x-cancel-btn" id="settings-cancel">Cancel</button>
            <button class="x-save-btn" id="settings-save">Save Changes</button>
          </div>
        </div>
      `;
    }
  };

  // ============================================
  // APP STATE
  // ============================================
  let currentPage = 'overview';
  let activeConversationId = null;
  let store = new XStorage();

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function formatTimeAgo(timestamp) {
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

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message, type = 'success') {
    if (window.OP && OP.toast) {
      OP.toast.show(message, type);
    } else {
      alert(message);
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================
  function navigateTo(page) {
    currentPage = page;
    const main = document.getElementById('x-main');
    if (!main) return;

    document.querySelectorAll('.x-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    if (Pages[page]) {
      main.innerHTML = Pages[page]();
      initPage(page);
    }

    window.location.hash = page;
  }

  function initPage(page) {
    if (page === 'overview') {
      setTimeout(() => {
        Charts.renderLineChart('overview-chart', [
          { values: [45, 52, 38, 65, 48, 72, 58] },
          { values: [30, 42, 35, 50, 40, 60, 45] },
          { values: [80, 95, 75, 110, 90, 120, 100] }
        ], ['#1DA1F2', '#8B5CF6', '#10B981']);

        Charts.renderDonutChart('engagement-chart', [
          { label: 'Direct Messages', value: 40, color: '#1DA1F2' },
          { label: 'Mentions', value: 30, color: '#8B5CF6' },
          { label: 'Comments', value: 18, color: '#F97316' },
          { label: 'Retweets', value: 10, color: '#10B981' },
          { label: 'Others', value: 2, color: '#6B7280' },
        ]);
      }, 50);
    }

    if (page === 'conversations') {
      initChat();
    }

    if (page === 'settings') {
      initSettings();
    }

    if (page === 'integration') {
      initIntegration();
    }

    if (page === 'saved-replies') {
      initSavedReplies();
    }
  }

  // ============================================
  // CHAT FUNCTIONALITY
  // ============================================
  function initChat() {
    const convItems = document.querySelectorAll('[data-conv-id]');
    convItems.forEach(item => {
      item.addEventListener('click', () => {
        const convId = item.dataset.convId;
        activeConversationId = convId;
        loadConversation(convId);
      });
    });

    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    if (chatSend && chatInput) {
      chatSend.addEventListener('click', sendMessage);
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    const searchInput = document.getElementById('conv-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('[data-conv-id]').forEach(item => {
          const name = item.querySelector('.x-conv-name')?.textContent.toLowerCase() || '';
          const preview = item.querySelector('.x-conv-preview')?.textContent.toLowerCase() || '';
          item.style.display = (name.includes(term) || preview.includes(term)) ? '' : 'none';
        });
      });
    }

    document.querySelectorAll('.x-conv-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.x-conv-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  function loadConversation(convId) {
    const conv = store.getConversationById(convId);
    if (!conv) return;

    store.markConversationRead(convId);

    document.querySelectorAll('[data-conv-id]').forEach(el => {
      el.classList.toggle('unread', false);
      el.style.background = el.dataset.convId === convId ? 'var(--gray-100)' : '';
    });

    const contact = conv.contact;
    const messages = store.getMessages(convId);

    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return;

    const headerName = chatArea.querySelector('.x-chat-header-name');
    const headerAvatar = chatArea.querySelector('.x-chat-header-avatar');
    const messagesContainer = document.getElementById('chat-messages');

    if (headerName) headerName.textContent = contact?.name || 'Unknown';
    if (headerAvatar) {
      headerAvatar.style.background = contact?.avatar || '#6366f1';
      headerAvatar.textContent = contact?.avatarText || '??';
    }

    if (messagesContainer) {
      if (messages.length === 0) {
        messagesContainer.innerHTML = `
          <div class="x-empty-state">
            <div class="x-empty-state-icon"><i class="ph ph-chat-circle-text"></i></div>
            <div class="x-empty-state-title">No messages yet</div>
            <div class="x-empty-state-desc">Start the conversation by sending a message.</div>
          </div>
        `;
      } else {
        messagesContainer.innerHTML = messages.map(msg => `
          <div class="x-chat-message ${msg.type}">
            <div class="x-chat-message-avatar" style="background:${msg.type === 'incoming' ? (contact?.avatar || '#1DA1F2') : '#1DA1F2'}">${msg.type === 'incoming' ? (contact?.avatarText || '??') : 'ME'}</div>
            <div>
              <div class="x-chat-message-bubble">${escapeHtml(msg.text).replace(/\n/g, '<br>')}</div>
              <div class="x-chat-message-time">${msg.time}</div>
            </div>
          </div>
        `).join('');
      }
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !activeConversationId) return;

    const text = input.value.trim();
    if (!text) return;

    store.addMessage(activeConversationId, {
      type: 'outgoing',
      text: text,
      status: 'delivered'
    });

    input.value = '';
    loadConversation(activeConversationId);

    setTimeout(() => {
      const replies = [
        'Thanks for reaching out!',
        'That sounds great, let me check.',
        'I appreciate your patience.',
        'Could you provide more details?',
        'Perfect, thank you!',
        'I will look into this and get back to you.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      store.addMessage(activeConversationId, {
        type: 'incoming',
        text: randomReply,
        status: 'read'
      });

      loadConversation(activeConversationId);
      showToast('New message received', 'info');
    }, 2000);
  }

  // ============================================
  // SETTINGS FUNCTIONALITY
  // ============================================
  function initSettings() {
    document.querySelectorAll('.x-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
    });

    const saveBtn = document.getElementById('settings-save');
    const cancelBtn = document.getElementById('settings-cancel');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newSettings = {};
        document.querySelectorAll('.x-toggle').forEach(toggle => {
          const setting = toggle.dataset.setting;
          if (setting) {
            newSettings[setting] = toggle.classList.contains('active');
          }
        });

        const timezoneSelect = document.getElementById('timezone-select');
        const responseTimeSelect = document.getElementById('response-time-select');

        if (timezoneSelect) newSettings.timezone = timezoneSelect.value;
        if (responseTimeSelect) newSettings.defaultResponseTime = responseTimeSelect.value;

        store.updateSettings(newSettings);
        showToast('Settings saved successfully!');
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        navigateTo('settings');
        showToast('Changes discarded', 'info');
      });
    }
  }
  // ============================================
  // INTEGRATION FUNCTIONALITY
  // ============================================
  function initIntegration() {
    const syncBtn = document.getElementById('sync-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');

    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        syncBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Syncing...';
        syncBtn.disabled = true;
        
        setTimeout(() => {
          syncBtn.innerHTML = '<i class="ph ph-check"></i> Synced';
          syncBtn.style.background = 'var(--success-600)';
          showToast('Integration synced successfully!');
          
          setTimeout(() => {
            syncBtn.innerHTML = '<i class="ph ph-arrows-clockwise"></i> Sync Now';
            syncBtn.disabled = false;
            syncBtn.style.background = '';
          }, 2000);
        }, 2000);
      });
    }

    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to disconnect your X account? This will stop all syncing.')) {
          showToast('Account disconnected. Redirecting...', 'warning');
          setTimeout(() => {
            window.location.href = '../integrations/index.html';
          }, 1500);
        }
      });
    }
  }

  // ============================================
  // SAVED REPLIES FUNCTIONALITY
  // ============================================
  function initSavedReplies() {
    const newReplyBtn = document.getElementById('new-reply-btn');
    
    if (newReplyBtn) {
      newReplyBtn.addEventListener('click', () => {
        showToast('New reply template modal would open here', 'info');
      });
    }

    document.querySelectorAll('.x-reply-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.x-reply-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        document.querySelectorAll('.x-reply-item').forEach(item => {
          if (category === 'all') {
            item.style.display = '';
          } else {
            const tag = item.querySelector('.x-reply-tag')?.textContent || '';
            item.style.display = tag === category ? '' : 'none';
          }
        });
      });
    });

    document.querySelectorAll('.x-reply-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.title.toLowerCase();
        const replyItem = btn.closest('.x-reply-item');
        const title = replyItem?.querySelector('.x-reply-title')?.textContent || '';
        
        if (action === 'copy') {
          const content = replyItem?.querySelector('.x-reply-content')?.textContent || '';
          navigator.clipboard.writeText(content).then(() => {
            showToast(`Copied "${title}" to clipboard`);
          }).catch(() => {
            showToast('Failed to copy', 'error');
          });
        } else if (action === 'edit') {
          showToast(`Edit template: ${title}`, 'info');
        } else if (action === 'delete') {
          if (confirm(`Delete template "${title}"?`)) {
            replyItem?.remove();
            showToast(`Deleted "${title}"`);
          }
        }
      });
    });
  }

  // ============================================
  // SIDEBAR & HEADER RENDERING
  // ============================================
  function renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    let html = `
      <div class="sidebar-header">
        <a href="../dashboard/main-dashboard.html" class="logo">
          <div class="logo-mark"><i class="ph ph-chat-centered-text"></i></div>
          <div class="logo-text">
            <span class="logo-brand">OnePlace</span>
            <span class="logo-sub">Enterprise</span>
          </div>
        </a>
      </div>

      <div class="sidebar-nav">
        <div class="sidebar-section">
          <div class="sidebar-section-title">Main</div>
          <a href="../dashboard/main-dashboard.html" class="sidebar-item">
            <i class="ph ph-squares-four"></i>
            <span>Dashboard</span>
          </a>
          <a href="../inbox/unified-inbox.html" class="sidebar-item">
            <i class="ph ph-inbox"></i>
            <span>Unified Inbox</span>
            <span class="sidebar-badge">24</span>
          </a>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Channels</div>
          <a href="../gmail/index.html" class="sidebar-item">
            <div class="sidebar-platform-icon gmail"><i class="ph ph-envelope-simple"></i></div>
            <span>Gmail</span>
          </a>
          <a href="../whatsapp/index.html" class="sidebar-item">
            <div class="sidebar-platform-icon whatsapp"><i class="ph ph-whatsapp-logo"></i></div>
            <span>WhatsApp</span>
          </a>
          <a href="../instagram/index.html" class="sidebar-item">
            <div class="sidebar-platform-icon instagram"><i class="ph ph-instagram-logo"></i></div>
            <span>Instagram</span>
          </a>
          <a href="../tiktok/index.html" class="sidebar-item">
            <div class="sidebar-platform-icon tiktok"><i class="ph ph-music-note"></i></div>
            <span>TikTok</span>
          </a>
          <a href="../x/index.html" class="sidebar-item active">
            <div class="sidebar-platform-icon x"><i class="ph ph-x-logo"></i></div>
            <span>X (Twitter)</span>
            <span class="sidebar-badge unread">34</span>
          </a>
          <a href="../linkedin/index.html" class="sidebar-item">
            <div class="sidebar-platform-icon linkedin"><i class="ph ph-linkedin-logo"></i></div>
            <span>LinkedIn</span>
          </a>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Management</div>
          <a href="../crm/index.html" class="sidebar-item">
            <i class="ph ph-users"></i>
            <span>CRM</span>
          </a>
          <a href="../calendar/index.html" class="sidebar-item">
            <i class="ph ph-calendar"></i>
            <span>Calendar</span>
          </a>
          <a href="../tasks/index.html" class="sidebar-item">
            <i class="ph ph-check-square"></i>
            <span>Tasks</span>
          </a>
          <a href="../reports/index.html" class="sidebar-item">
            <i class="ph ph-chart-bar"></i>
            <span>Reports</span>
          </a>
          <a href="../ai/index.html" class="sidebar-item">
            <i class="ph ph-sparkle"></i>
            <span>AI</span>
          </a>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Settings</div>
          <a href="../settings/index.html" class="sidebar-item">
            <i class="ph ph-gear"></i>
            <span>Settings</span>
          </a>
          <a href="../integrations/index.html" class="sidebar-item">
            <i class="ph ph-plugs-connected"></i>
            <span>Integrations</span>
          </a>
          <a href="../help/index.html" class="sidebar-item">
            <i class="ph ph-question"></i>
            <span>Help & Support</span>
          </a>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">More</div>
          <a href="../support/index.html" class="sidebar-item">
            <i class="ph ph-headset"></i>
            <span>Support</span>
          </a>
          <a href="../billing/index.html" class="sidebar-item">
            <i class="ph ph-credit-card"></i>
            <span>Billing</span>
          </a>
          <a href="../files/index.html" class="sidebar-item">
            <i class="ph ph-folder"></i>
            <span>Files</span>
          </a>
          <a href="../search/index.html" class="sidebar-item">
            <i class="ph ph-magnifying-glass"></i>
            <span>Search</span>
          </a>
          <a href="../notifications/notifications.html" class="sidebar-item">
            <i class="ph ph-bell"></i>
            <span>Notifications</span>
          </a>
          <a href="../workflow/index.html" class="sidebar-item">
            <i class="ph ph-flow-arrow"></i>
            <span>Workflow</span>
          </a>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${initials}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${userName}</div>
            <div class="sidebar-user-role">Admin</div>
          </div>
        </div>
      </div>
    `;

    sidebar.innerHTML = html;
  }

  function renderHeader() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    header.innerHTML = `
      <div class="header-left">
        <div class="header-search">
          <i class="ph ph-magnifying-glass"></i>
          <input type="text" placeholder="Search anything..." id="global-search">
        </div>
      </div>
      <div class="header-right">
        <button class="header-btn" id="notifications-btn" title="Notifications">
          <i class="ph ph-bell"></i>
          <span class="notification-dot"></span>
        </button>
        <button class="header-btn" id="theme-toggle" title="Toggle theme">
          <i class="ph ph-moon"></i>
        </button>
        <div class="header-avatar" title="${userName}">${initials}</div>
      </div>
    `;

    // Bind header events
    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        showToast('Notifications panel would open here', 'info');
      });
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        OP.theme.toggle();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = `<i class="ph ${isDark ? 'ph-sun' : 'ph-moon'}"></i>`;
      });
    }

    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (term.length > 2) {
          showToast(`Searching for: ${term}`, 'info');
        }
      });
    }
  }

  // ============================================
  // MOBILE SIDEBAR TOGGLE
  // ============================================
  function initMobileSidebar() {
    const toggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
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

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Allow a local/dev bypass when `?debug=x` is present or running on localhost
    const canBypassAuth = window.location.search.includes('debug=x') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const hasAuthFn = !!(OP && OP.nav && typeof OP.nav.requireAuth === 'function');
    // If dev bypass is enabled, do not call OP.nav.requireAuth() because it may redirect.
    let isAuthed = false;
    if (canBypassAuth) {
      isAuthed = true;
    } else if (hasAuthFn) {
      isAuthed = OP.nav.requireAuth();
    }
    if (!isAuthed) return;

    store = new XStorage();
    
    renderSidebar();
    renderHeader();
    initMobileSidebar();

    // Nav click handlers
    document.querySelectorAll('.x-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) navigateTo(page);
      });
    });

    // Handle initial hash or default to overview
    const hash = window.location.hash.replace('#', '');
    if (hash && Pages[hash]) {
      navigateTo(hash);
    } else {
      navigateTo('overview');
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && Pages[hash]) navigateTo(hash);
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose navigateTo globally for inline onclick handlers
  window.navigateTo = navigateTo;

})();