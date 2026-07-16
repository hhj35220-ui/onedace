/* ============================================
   OnePlace Enterprise v3.0 — Instagram Module JS
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // DATA STORE
  // ============================================
  const IGStore = {
    conversations: [
      { id: 1, name: 'sarah.johnson', avatar: '#E4405F', avatarText: 'SJ', preview: 'Hi! I have a question about your latest collection.', time: '10:24 AM', unread: true, priority: 'high', messages: [
        { type: 'incoming', text: 'Hi! I have a question about your latest collection.', time: '10:24 AM' },
        { type: 'outgoing', text: 'Hello Sarah! We\'d love to help. What would you like to know?', time: '10:25 AM' },
        { type: 'incoming', text: 'Do you have the pink dress in size M?', time: '10:26 AM' },
        { type: 'outgoing', text: 'Yes! We have it available in size M. Would you like me to send you the link?', time: '10:27 AM' },
        { type: 'incoming', text: 'Yes please! That would be great.', time: '10:28 AM' },
      ]},
      { id: 2, name: 'michael_brown', avatar: '#8B5CF6', avatarText: 'MB', preview: 'When will the new collection drop?', time: '9:41 AM', unread: true, priority: 'medium', messages: [
        { type: 'incoming', text: 'When will the new collection drop?', time: '9:41 AM' },
      ]},
      { id: 3, name: 'olivia.rodriguez', avatar: '#F97316', avatarText: 'OR', preview: 'Thank you so much! Can\'t wait.', time: 'Yesterday', unread: true, priority: 'low', messages: [
        { type: 'incoming', text: 'Thank you so much! Can\'t wait.', time: 'Yesterday' },
      ]},
      { id: 4, name: 'james_wilson', avatar: '#10B981', avatarText: 'JW', preview: 'Do you ship internationally?', time: 'Yesterday', unread: false, priority: 'medium', messages: [
        { type: 'incoming', text: 'Do you ship internationally?', time: 'Yesterday' },
        { type: 'outgoing', text: 'Yes, we ship to over 50 countries worldwide!', time: 'Yesterday' },
      ]},
      { id: 5, name: 'emma.davis', avatar: '#EC4899', avatarText: 'ED', preview: 'Hello, I have a question about...', time: 'May 27', unread: false, priority: 'low', messages: [
        { type: 'incoming', text: 'Hello, I have a question about my recent order.', time: 'May 27' },
      ]},
      { id: 6, name: 'daniel.thomas', avatar: '#6366F1', avatarText: 'DT', preview: 'Love your new post!', time: 'May 26', unread: false, priority: 'low', messages: [
        { type: 'incoming', text: 'Love your new post!', time: 'May 26' },
      ]},
      { id: 7, name: 'sophia.martinez', avatar: '#14B8A6', avatarText: 'SM', preview: 'Can I get a discount code?', time: 'May 25', unread: false, priority: 'medium', messages: [
        { type: 'incoming', text: 'Can I get a discount code?', time: 'May 25' },
      ]},
    ],

    comments: [
      { id: 1, author: 'lisa.park', avatar: '#E4405F', avatarText: 'LP', text: 'Amazing collection! I love the summer vibes.', post: 'Summer Collection 2024 is here!', time: '11:45 AM', sentiment: 'positive', replied: false, priority: 'high' },
      { id: 2, author: 'john.doe', avatar: '#8B5CF6', avatarText: 'JD', text: 'Do you ship to Canada? I really want that jacket.', post: 'New product launch! What do you think?', time: '8 min', sentiment: 'neutral', replied: false, priority: 'medium' },
      { id: 3, author: 'anna.roberts', avatar: '#F97316', avatarText: 'AR', text: 'The quality is amazing! Will definitely order again.', post: 'Behind the scenes', time: '1 hr', sentiment: 'positive', replied: true, priority: 'low' },
      { id: 4, author: 'mike.williams', avatar: '#10B981', avatarText: 'MW', text: 'So beautiful! How much is the dress?', post: 'Summer Collection 2024 is here!', time: '2 hr', sentiment: 'positive', replied: false, priority: 'high' },
      { id: 5, author: 'chloe.kim', avatar: '#EC4899', avatarText: 'CK', text: 'Not impressed with the customer service lately.', post: 'Behind the scenes', time: '3 hr', sentiment: 'negative', replied: false, priority: 'high' },
      { id: 6, author: 'david.lee', avatar: '#6366F1', avatarText: 'DL', text: 'Can you make this in blue?', post: 'New product launch! What do you think?', time: '5 hr', sentiment: 'neutral', replied: false, priority: 'medium' },
      { id: 7, author: 'rachel.green', avatar: '#14B8A6', avatarText: 'RG', text: 'Just placed my order! So excited!', post: 'Summer Collection 2024 is here!', time: '6 hr', sentiment: 'positive', replied: true, priority: 'low' },
      { id: 8, author: 'tom.hardy', avatar: '#F59E0B', avatarText: 'TH', text: 'When is the restock?', post: 'New product launch! What do you think?', time: '8 hr', sentiment: 'neutral', replied: false, priority: 'medium' },
      { id: 9, author: 'nina.patel', avatar: '#EF4444', avatarText: 'NP', text: 'This is exactly what I was looking for!', post: 'Behind the scenes', time: '10 hr', sentiment: 'positive', replied: false, priority: 'low' },
      { id: 10, author: 'alex.chen', avatar: '#3B82F6', avatarText: 'AC', text: 'Can you do custom orders?', post: 'Summer Collection 2024 is here!', time: '12 hr', sentiment: 'neutral', replied: false, priority: 'medium' },
    ],

    mentions: [
      { id: 1, author: 'fashion.daily', avatar: '#E4405F', avatarText: 'FD', text: 'Great quality! @acmesolutions new collection is a must-have.', type: 'post', time: '10:24 AM', replied: false },
      { id: 2, author: 'style.inspo', avatar: '#8B5CF6', avatarText: 'SI', text: 'Mentioned you in a story! Check out @acmesolutions new collection.', type: 'story', time: 'Yesterday', replied: true },
      { id: 3, author: 'trendy.looks', avatar: '#F97316', avatarText: 'TL', text: 'Loving @acmesolutions latest drop!', type: 'reel', time: 'May 27', replied: false },
      { id: 4, author: 'outfit.of.the.day', avatar: '#10B981', avatarText: 'OD', text: 'Mentioned you in a comment: Where did you get that? @acmesolutions', type: 'comment', time: 'May 26', replied: false },
      { id: 5, author: 'beauty.guru', avatar: '#EC4899', avatarText: 'BG', text: 'Collaboration with @acmesolutions coming soon!', type: 'post', time: 'May 25', replied: false },
      { id: 6, author: 'lifestyle.blog', avatar: '#6366F1', avatarText: 'LB', text: 'Featured @acmesolutions in our latest blog post.', type: 'story', time: 'May 24', replied: true },
      { id: 7, author: 'street.style', avatar: '#14B8A6', avatarText: 'SS', text: '@acmesolutions is killing it this season!', type: 'reel', time: 'May 23', replied: false },
      { id: 8, author: 'luxury.finds', avatar: '#F59E0B', avatarText: 'LF', text: 'Just discovered @acmesolutions and I\'m obsessed.', type: 'post', time: 'May 22', replied: false },
    ],

    savedReplies: [
      { id: 1, title: 'Welcome Message', shortcut: '/welcome', content: 'Hi there! Thanks for reaching out to us. How can we help you today?', category: 'general', usageCount: 156, lastUsed: '2 hours ago' },
      { id: 2, title: 'Order Status', shortcut: '/order', content: 'Sure! Let me check your order status for you. Could you please provide your order number?', category: 'orders', usageCount: 89, lastUsed: '5 hours ago' },
      { id: 3, title: 'Shipping Information', shortcut: '/shipping', content: 'We offer worldwide shipping. Delivery usually takes 3-5 business days.', category: 'shipping', usageCount: 67, lastUsed: '1 day ago' },
      { id: 4, title: 'Return Policy', shortcut: '/return', content: 'We accept returns within 30 days of purchase. Please check our return policy for more details.', category: 'returns', usageCount: 45, lastUsed: '2 days ago' },
      { id: 5, title: 'Pricing Inquiry', shortcut: '/price', content: 'Our prices are competitive and we often have promotions. Check our website for current deals!', category: 'pricing', usageCount: 34, lastUsed: '3 days ago' },
      { id: 6, title: 'Thank You', shortcut: '/thanks', content: 'Thank you so much for your support! We really appreciate it.', category: 'general', usageCount: 234, lastUsed: '30 min ago' },
      { id: 7, title: 'Size Guide', shortcut: '/size', content: 'You can find our size guide on the product page. If you need help choosing, just let us know!', category: 'general', usageCount: 78, lastUsed: '4 hours ago' },
    ],

    posts: [
      { id: 1, title: 'Summer Collection 2024 is here!', date: 'May 20, 2024 10:30 AM', likes: 1204, comments: 48, shares: 12, image: null },
      { id: 2, title: 'New product launch! What do you think?', date: 'May 18, 2024 09:15 AM', likes: 890, comments: 36, shares: 8, image: null },
      { id: 3, title: 'Behind the scenes', date: 'May 15, 2024 04:20 PM', likes: 756, comments: 42, shares: 28, image: null },
    ],

    aiRecommendations: [
      { id: 1, title: 'High Intent Conversations', desc: '12 conversations need immediate attention. Potential buyers asking about pricing and availability.', priority: 'high', icon: 'ph-warning' },
      { id: 2, title: 'Smart Replies Available', desc: '24 conversations can use AI replies. Quick responses to common questions detected.', priority: 'medium', icon: 'ph-lightning' },
      { id: 3, title: 'New Lead Opportunities', desc: '8 potential leads found in recent conversations. Consider following up within 24 hours.', priority: 'low', icon: 'ph-users' },
      { id: 4, title: 'Engagement Booster', desc: 'Best time to post is 2:00 PM - 4:00 PM based on your audience activity.', priority: 'medium', icon: 'ph-clock' },
    ],

    stats: {
      totalConversations: 128,
      responseRate: '92.6%',
      unreadDMs: 24,
      comments: 56,
      mentions: 18,
      newFollowers: 128,
      engagement: '1,248',
    },

    settings: {
      notifications: true,
      autoReply: false,
      messageSync: true,
      markAsRead: false,
      aiSuggestions: true,
      autoAssign: true,
      timezone: 'UTC-05:00 Eastern Time (US & Canada)',
      defaultAccount: '@acmesolutions',
    },

    permissions: [
      { label: 'Read Messages', desc: 'Access to read direct messages', allowed: true },
      { label: 'Manage Messages', desc: 'Send and manage messages', allowed: true },
      { label: 'Read Comments', desc: 'Access to read post comments', allowed: true },
      { label: 'Manage Comments', desc: 'Reply to and manage comments', allowed: true },
      { label: 'Read Insights', desc: 'Access to account analytics', allowed: true },
      { label: 'Read Mentions', desc: 'Access to mentions and tags', allowed: true },
    ],

    account: {
      name: '@acmesolutions',
      type: 'Business Account',
      connectedDate: 'May 12, 2024',
      followers: '12.4K',
      following: 245,
      posts: 342,
      health: 100,
    }
  };

  // ============================================
  // CHART UTILITIES
  // ============================================
  const Charts = {
    renderLineChart(containerId, data, colors) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const width = container.clientWidth || 500;
      const height = 200;
      const padding = { top: 10, right: 10, bottom: 30, left: 40 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const allValues = data.flatMap(d => d.values);
      const maxVal = Math.max(...allValues) * 1.1;
      const minVal = 0;

      const xStep = chartWidth / (data[0].values.length - 1);

      let svg = `<svg class="ig-line-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`;

      // Grid lines
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        const val = Math.round(maxVal - (maxVal / 4) * i);
        svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--gray-200)" stroke-width="1" stroke-dasharray="4"/>`;
        svg += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" fill="var(--gray-400)" font-size="10">${val}</text>`;
      }

      // X axis labels
      const labels = ['May 22', 'May 23', 'May 24', 'May 25', 'May 26', 'May 27', 'May 28'];
      labels.forEach((label, i) => {
        const x = padding.left + i * xStep;
        svg += `<text x="${x}" y="${height - 8}" text-anchor="middle" fill="var(--gray-400)" font-size="10">${label}</text>`;
      });

      // Lines
      data.forEach((series, si) => {
        const color = colors[si];
        let pathD = '';
        series.values.forEach((val, i) => {
          const x = padding.left + i * xStep;
          const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
          pathD += (i === 0 ? 'M' : 'L') + `${x},${y} `;
        });
        svg += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

        // Dots
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

      let legend = '<div class="ig-donut-legend">';
      data.forEach(item => {
        legend += `<div class="ig-donut-legend-item"><span class="ig-donut-legend-dot" style="background:${item.color}"></span><span class="ig-donut-legend-label">${item.label}</span><span class="ig-donut-legend-value">${item.value}%</span></div>`;
      });
      legend += '</div>';

      container.innerHTML = `
        <div class="ig-donut-chart-container">
          <div class="ig-donut-chart">${svg}
            <div class="ig-donut-chart-center">
              <div class="ig-donut-chart-value">${total.toLocaleString()}</div>
              <div class="ig-donut-chart-label">Total</div>
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
      return `
        <div class="ig-page-header">
          <div class="ig-page-header-left">
            <div class="ig-page-header-icon"><i class="ph ph-instagram-logo"></i></div>
            <div>
              <div class="ig-page-header-title">Instagram Overview</div>
              <div class="ig-page-header-subtitle">Monitor your Instagram performance and engage with your audience</div>
            </div>
          </div>
          <div class="ig-page-header-right">
            <button class="ig-date-picker"><i class="ph ph-calendar"></i> May 22 - May 28, 2024 <i class="ph ph-caret-down"></i></button>
            <button class="ig-export-btn"><i class="ph ph-download-simple"></i> Export Report</button>
          </div>
        </div>

        <div class="ig-stats-row">
          <div class="ig-stat-card">
            <div class="ig-stat-card-header">
              <span class="ig-stat-card-label">Total Conversations</span>
              <div class="ig-stat-card-icon pink"><i class="ph ph-chat-circle-text"></i></div>
            </div>
            <div class="ig-stat-card-value">${IGStore.stats.totalConversations}</div>
            <div class="ig-stat-card-trend up"><i class="ph ph-trend-up"></i> 12.4%</div>
            <div class="ig-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="ig-stat-card">
            <div class="ig-stat-card-header">
              <span class="ig-stat-card-label">Response Rate</span>
              <div class="ig-stat-card-icon purple"><i class="ph ph-check-circle"></i></div>
            </div>
            <div class="ig-stat-card-value">${IGStore.stats.responseRate}</div>
            <div class="ig-stat-card-trend up"><i class="ph ph-trend-up"></i> 6.7%</div>
            <div class="ig-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="ig-stat-card">
            <div class="ig-stat-card-header">
              <span class="ig-stat-card-label">Unread DMs</span>
              <div class="ig-stat-card-icon blue"><i class="ph ph-envelope-simple"></i></div>
            </div>
            <div class="ig-stat-card-value">${IGStore.stats.unreadDMs}</div>
            <div class="ig-stat-card-trend up"><i class="ph ph-trend-up"></i> 18.5%</div>
            <div class="ig-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="ig-stat-card">
            <div class="ig-stat-card-header">
              <span class="ig-stat-card-label">Comments</span>
              <div class="ig-stat-card-icon orange"><i class="ph ph-chat-teardrop-text"></i></div>
            </div>
            <div class="ig-stat-card-value">${IGStore.stats.comments}</div>
            <div class="ig-stat-card-trend up"><i class="ph ph-trend-up"></i> 8.3%</div>
            <div class="ig-stat-card-sub">vs last 7 days</div>
          </div>
          <div class="ig-stat-card">
            <div class="ig-stat-card-header">
              <span class="ig-stat-card-label">Mentions</span>
              <div class="ig-stat-card-icon green"><i class="ph ph-at"></i></div>
            </div>
            <div class="ig-stat-card-value">${IGStore.stats.mentions}</div>
            <div class="ig-stat-card-trend up"><i class="ph ph-trend-up"></i> 15.3%</div>
            <div class="ig-stat-card-sub">vs last 7 days</div>
          </div>
        </div>

        <div class="ig-dashboard-grid">
          <div class="ig-col-5">
            <div class="ig-widget-card">
              <div class="ig-widget-header">
                <span class="ig-widget-title">Conversations Trend</span>
                <div class="ig-widget-actions">
                  <button class="ig-widget-action-btn"><i class="ph ph-dots-three"></i></button>
                </div>
              </div>
              <div class="ig-widget-body">
                <div class="ig-chart-legend">
                  <div class="ig-chart-legend-item"><span class="ig-chart-legend-dot" style="background:#E4405F"></span> Conversations</div>
                  <div class="ig-chart-legend-item"><span class="ig-chart-legend-dot" style="background:#8B5CF6"></span> Responses</div>
                </div>
                <div class="ig-line-chart-container" id="overview-chart"></div>
              </div>
            </div>
          </div>

          <div class="ig-col-4">
            <div class="ig-widget-card">
              <div class="ig-widget-header">
                <span class="ig-widget-title">Engagement Overview</span>
                <a href="#" class="ig-view-all">View Details</a>
              </div>
              <div class="ig-widget-body">
                <div class="ig-donut-chart-container" id="engagement-chart"></div>
              </div>
            </div>
          </div>

          <div class="ig-col-3">
            <div class="ig-widget-card">
              <div class="ig-widget-header">
                <span class="ig-widget-title">AI Recommendations</span>
                <span class="ig-beta-badge">Beta</span>
              </div>
              <div class="ig-widget-body">
                <div class="ig-ai-list">
                  ${IGStore.aiRecommendations.map(rec => `
                    <div class="ig-ai-item priority-${rec.priority}">
                      <div class="ig-ai-icon"><i class="ph ${rec.icon}"></i></div>
                      <div class="ig-ai-content">
                        <div class="ig-ai-title">${rec.title}</div>
                        <div class="ig-ai-desc">${rec.desc}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top:var(--space-3);text-align:center;">
                  <a href="#" class="ig-view-all">View All Recommendations</a>
                </div>
              </div>
            </div>
          </div>

          <div class="ig-col-5">
            <div class="ig-widget-card">
              <div class="ig-widget-header">
                <span class="ig-widget-title">Recent Conversations</span>
                <a href="#conversations" class="ig-view-all" data-nav="conversations">View All</a>
              </div>
              <div class="ig-widget-body">
                <div class="ig-conversation-list">
                  ${IGStore.conversations.slice(0, 5).map(conv => `
                    <div class="ig-conversation-item ${conv.unread ? 'unread' : ''}">
                      <div class="ig-conv-avatar" style="background:${conv.avatar}">${conv.avatarText}
                        <div class="ig-conv-platform-badge"><i class="ph ph-instagram-logo"></i></div>
                      </div>
                      <div class="ig-conv-content">
                        <div class="ig-conv-name ${conv.unread ? 'unread' : ''}">${conv.name}</div>
                        <div class="ig-conv-preview">${conv.preview}</div>
                      </div>
                      <div class="ig-conv-meta">
                        <span class="ig-conv-time">${conv.time}</span>
                        <span class="ig-conv-badge priority-${conv.priority}">${conv.priority}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="ig-col-4">
            <div class="ig-widget-card">
              <div class="ig-widget-header">
                <span class="ig-widget-title">Top Performing Posts</span>
                <a href="#" class="ig-view-all">View All</a>
              </div>
              <div class="ig-widget-body">
                <div class="ig-post-list">
                  ${IGStore.posts.map(post => `
                    <div class="ig-post-item">
                      <div class="ig-post-thumb"><i class="ph ph-image"></i></div>
                      <div class="ig-post-content">
                        <div class="ig-post-title">${post.title}</div>
                        <div class="ig-post-date">${post.date}</div>
                        <div class="ig-post-stats">
                          <span class="ig-post-stat"><i class="ph ph-heart"></i> ${post.likes}</span>
                          <span class="ig-post-stat"><i class="ph ph-chat-circle"></i> ${post.comments}</span>
                          <span class="ig-post-stat"><i class="ph ph-share-fat"></i> ${post.shares}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="ig-col-3">
            <div class="ig-widget-card">
              <div class="ig-widget-header">
                <span class="ig-widget-title">Account Status</span>
                <span class="ig-account-status-badge connected">Connected</span>
              </div>
              <div class="ig-widget-body ig-account-status-card">
                <div class="ig-account-status-header">
                  <div class="ig-account-status-avatar"><i class="ph ph-instagram-logo"></i></div>
                  <div class="ig-account-status-info">
                    <div class="ig-account-status-name">${IGStore.account.name}</div>
                    <div class="ig-account-status-type">${IGStore.account.type}</div>
                  </div>
                </div>
                <div class="ig-account-status-detail">Connected on ${IGStore.account.connectedDate}</div>
                <div class="ig-account-metrics">
                  <div class="ig-account-metric">
                    <div class="ig-account-metric-value">${IGStore.account.followers}</div>
                    <div class="ig-account-metric-label">Followers</div>
                    <div class="ig-account-metric-change"><i class="ph ph-trend-up"></i> 234</div>
                  </div>
                  <div class="ig-account-metric">
                    <div class="ig-account-metric-value">${IGStore.account.following}</div>
                    <div class="ig-account-metric-label">Following</div>
                    <div class="ig-account-metric-change down"><i class="ph ph-trend-down"></i> 4</div>
                  </div>
                  <div class="ig-account-metric">
                    <div class="ig-account-metric-value">${IGStore.account.posts}</div>
                    <div class="ig-account-metric-label">Posts</div>
                    <div class="ig-account-metric-change"><i class="ph ph-trend-up"></i> 12</div>
                  </div>
                </div>
                <div class="ig-connection-health">
                  <div class="ig-connection-health-label"><span>Connection Health</span><span>${IGStore.account.health}%</span></div>
                  <div class="ig-connection-health-bar"><div class="ig-connection-health-fill" style="width:${IGStore.account.health}%"></div></div>
                </div>
                <button class="ig-view-integration-btn">View Integration</button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    conversations() {
      return `
        <div class="ig-page-header">
          <div class="ig-page-header-left">
            <div class="ig-page-header-icon"><i class="ph ph-chat-circle-text"></i></div>
            <div>
              <div class="ig-page-header-title">Conversations</div>
              <div class="ig-page-header-subtitle">Manage and respond to your Instagram DMs</div>
            </div>
          </div>
          <div class="ig-page-header-right">
            <button class="ig-date-picker"><i class="ph ph-funnel"></i> Filters <i class="ph ph-caret-down"></i></button>
          </div>
        </div>

        <div class="ig-conversations-layout">
          <div class="ig-conversations-sidebar">
            <div class="ig-conv-search">
              <input type="text" class="ig-conv-search-input" placeholder="Search conversations..." id="conv-search">
            </div>
            <div class="ig-conv-filters">
              <button class="ig-conv-filter-btn active">All</button>
              <button class="ig-conv-filter-btn">Unread</button>
              <button class="ig-conv-filter-btn">Assigned to me</button>
            </div>
            <div class="ig-conv-list-scroll" id="conv-list">
              ${IGStore.conversations.map((conv, idx) => `
                <div class="ig-conversation-item ${conv.unread ? 'unread' : ''}" data-conv-id="${conv.id}">
                  <div class="ig-conv-avatar" style="background:${conv.avatar}">${conv.avatarText}
                    <div class="ig-conv-platform-badge"><i class="ph ph-instagram-logo"></i></div>
                  </div>
                  <div class="ig-conv-content">
                    <div class="ig-conv-name ${conv.unread ? 'unread' : ''}">${conv.name}</div>
                    <div class="ig-conv-preview">${conv.preview}</div>
                  </div>
                  <div class="ig-conv-meta">
                    <span class="ig-conv-time">${conv.time}</span>
                    <span class="ig-conv-badge priority-${conv.priority}">${conv.priority}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="ig-conversation-chat" id="chat-area">
            <div class="ig-chat-header">
              <div class="ig-chat-header-left">
                <div class="ig-chat-header-avatar" style="background:#E4405F">SJ</div>
                <div class="ig-chat-header-info">
                  <div class="ig-chat-header-name">sarah.johnson</div>
                  <div class="ig-chat-header-status"><span class="ig-chat-header-status-dot"></span> Active now</div>
                </div>
              </div>
              <div class="ig-chat-header-right">
                <button class="ig-chat-action-btn"><i class="ph ph-user"></i></button>
                <button class="ig-chat-action-btn"><i class="ph ph-tag"></i></button>
                <button class="ig-chat-action-btn"><i class="ph ph-dots-three-vertical"></i></button>
              </div>
            </div>
            <div class="ig-chat-messages" id="chat-messages">
              ${IGStore.conversations[0].messages.map(msg => `
                <div class="ig-chat-message ${msg.type}">
                  <div class="ig-chat-message-avatar" style="background:${msg.type === 'incoming' ? '#E4405F' : '#8B5CF6'}">${msg.type === 'incoming' ? 'SJ' : 'ME'}</div>
                  <div>
                    <div class="ig-chat-message-bubble">${msg.text}</div>
                    <div class="ig-chat-message-time">${msg.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="ig-chat-input-area">
              <div class="ig-chat-tools">
                <button class="ig-chat-tool-btn"><i class="ph ph-paperclip"></i></button>
                <button class="ig-chat-tool-btn"><i class="ph ph-image"></i></button>
                <button class="ig-chat-tool-btn"><i class="ph ph-smiley"></i></button>
              </div>
              <input type="text" class="ig-chat-input" placeholder="Type your message..." id="chat-input">
              <button class="ig-chat-send-btn" id="chat-send"><i class="ph ph-paper-plane-right"></i></button>
            </div>
          </div>
        </div>
      `;
    },

    comments() {
      return `
        <div class="ig-page-header">
          <div class="ig-page-header-left">
            <div class="ig-page-header-icon"><i class="ph ph-chat-teardrop-text"></i></div>
            <div>
              <div class="ig-page-header-title">Comments Manager</div>
              <div class="ig-page-header-subtitle">Review and respond to comments on your posts</div>
            </div>
          </div>
          <div class="ig-page-header-right">
            <button class="ig-date-picker"><i class="ph ph-funnel"></i> Filters <i class="ph ph-caret-down"></i></button>
          </div>
        </div>

        <div class="ig-comments-toolbar">
          <div class="ig-comments-filters">
            <button class="ig-comments-filter-btn active">All</button>
            <button class="ig-comments-filter-btn">Unread</button>
            <button class="ig-comments-filter-btn">Replied</button>
            <button class="ig-comments-filter-btn">Mentioned</button>
            <button class="ig-comments-filter-btn">Priority</button>
          </div>
          <span style="font-size:11px;color:var(--gray-400);">Showing 1 to 10 of 56 comments</span>
        </div>

        <div class="ig-comments-list">
          ${IGStore.comments.map(comment => `
            <div class="ig-comment-item">
              <div class="ig-comment-avatar" style="background:${comment.avatar}">${comment.avatarText}</div>
              <div class="ig-comment-body">
                <div class="ig-comment-header">
                  <span class="ig-comment-author">${comment.author}</span>
                  <span class="ig-comment-handle">@${comment.author}</span>
                  <span class="ig-comment-sentiment ${comment.sentiment}">${comment.sentiment}</span>
                  <span class="ig-comment-time">${comment.time}</span>
                </div>
                <div class="ig-comment-text">${comment.text}</div>
                <div class="ig-comment-post-ref">On post: <a href="#">${comment.post}</a></div>
                <div class="ig-comment-actions">
                  <button class="ig-comment-action-btn"><i class="ph ph-arrow-u-up-left"></i> Reply</button>
                  <button class="ig-comment-action-btn"><i class="ph ph-heart"></i> Like</button>
                  <button class="ig-comment-action-btn"><i class="ph ph-share-fat"></i> Share</button>
                  ${!comment.replied ? '<button class="ig-comment-action-btn primary"><i class="ph ph-lightning"></i> AI Reply</button>' : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="ig-comments-pagination">
          <button class="ig-page-btn" disabled><i class="ph ph-caret-left"></i></button>
          <button class="ig-page-btn active">1</button>
          <button class="ig-page-btn">2</button>
          <button class="ig-page-btn">3</button>
          <button class="ig-page-btn">4</button>
          <button class="ig-page-btn">5</button>
          <button class="ig-page-btn"><i class="ph ph-caret-right"></i></button>
        </div>
      `;
    },

    mentions() {
      return `
        <div class="ig-page-header">
          <div class="ig-page-header-left">
            <div class="ig-page-header-icon"><i class="ph ph-at"></i></div>
            <div>
              <div class="ig-page-header-title">Mentions</div>
              <div class="ig-page-header-subtitle">Track when your account is mentioned across Instagram</div>
            </div>
          </div>
          <div class="ig-page-header-right">
            <button class="ig-date-picker"><i class="ph ph-funnel"></i> Filters <i class="ph ph-caret-down"></i></button>
          </div>
        </div>

        <div class="ig-comments-toolbar">
          <div class="ig-comments-filters">
            <button class="ig-comments-filter-btn active">All</button>
            <button class="ig-comments-filter-btn">Unread</button>
            <button class="ig-comments-filter-btn">Replied</button>
            <button class="ig-comments-filter-btn">Newest</button>
          </div>
          <span style="font-size:11px;color:var(--gray-400);">Showing 1 to 10 of 18 mentions</span>
        </div>

        <div class="ig-mentions-list">
          ${IGStore.mentions.map(mention => `
            <div class="ig-mention-item">
              <div class="ig-mention-avatar" style="background:${mention.avatar}">${mention.avatarText}</div>
              <div class="ig-mention-body">
                <div class="ig-mention-header">
                  <span class="ig-mention-author">${mention.author}</span>
                  <span class="ig-mention-handle">@${mention.author}</span>
                  <span class="ig-mention-type-badge ${mention.type}">${mention.type}</span>
                  <span class="ig-mention-time">${mention.time}</span>
                </div>
                <div class="ig-mention-text">${mention.text.replace('@acmesolutions', '<span class="mention-tag">@acmesolutions</span>')}</div>
                <div class="ig-mention-source"><i class="ph ph-instagram-logo"></i> Instagram ${mention.type.charAt(0).toUpperCase() + mention.type.slice(1)}</div>
                <div class="ig-mention-actions">
                  <button class="ig-mention-action-btn"><i class="ph ph-arrow-u-up-left"></i> Reply</button>
                  <button class="ig-mention-action-btn"><i class="ph ph-heart"></i> Like</button>
                  <button class="ig-mention-action-btn"><i class="ph ph-share-fat"></i> Repost</button>
                  ${!mention.replied ? '<button class="ig-mention-action-btn primary"><i class="ph ph-lightning"></i> AI Reply</button>' : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="ig-comments-pagination">
          <button class="ig-page-btn" disabled><i class="ph ph-caret-left"></i></button>
          <button class="ig-page-btn active">1</button>
          <button class="ig-page-btn">2</button>
          <button class="ig-page-btn"><i class="ph ph-caret-right"></i></button>
        </div>
      `;
    },

    'saved-replies'() {
      return `
        <div class="ig-page-header">
          <div class="ig-page-header-left">
            <div class="ig-page-header-icon"><i class="ph ph-lightning"></i></div>
            <div>
              <div class="ig-page-header-title">Saved Replies</div>
              <div class="ig-page-header-subtitle">Create and manage quick response templates</div>
            </div>
          </div>
          <div class="ig-page-header-right">
            <button class="ig-new-reply-btn" id="new-reply-btn"><i class="ph ph-plus"></i> New Reply</button>
          </div>
        </div>

        <div class="ig-reply-categories">
          <button class="ig-reply-category-btn active">All</button>
          <button class="ig-reply-category-btn">General</button>
          <button class="ig-reply-category-btn">Orders</button>
          <button class="ig-reply-category-btn">Shipping</button>
          <button class="ig-reply-category-btn">Returns</button>
          <button class="ig-reply-category-btn">Pricing</button>
        </div>

        <div class="ig-replies-list">
          ${IGStore.savedReplies.map(reply => `
            <div class="ig-reply-item">
              <div class="ig-reply-header">
                <span class="ig-reply-title">${reply.title}</span>
                <div class="ig-reply-actions">
                  <button class="ig-reply-action-btn" title="Copy"><i class="ph ph-copy"></i></button>
                  <button class="ig-reply-action-btn" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                  <button class="ig-reply-action-btn" title="Delete"><i class="ph ph-trash"></i></button>
                </div>
              </div>
              <div class="ig-reply-shortcut">Shortcut: <code>${reply.shortcut}</code></div>
              <div class="ig-reply-content">${reply.content}</div>
              <div class="ig-reply-footer">
                <div class="ig-reply-meta">
                  <span class="ig-reply-meta-item"><i class="ph ph-tag"></i> ${reply.category}</span>
                  <span class="ig-reply-meta-item"><i class="ph ph-chart-bar"></i> Used ${reply.usageCount} times</span>
                  <span class="ig-reply-meta-item"><i class="ph ph-clock"></i> ${reply.lastUsed}</span>
                </div>
                <div class="ig-reply-tags">
                  <span class="ig-reply-tag ${reply.category}">${reply.category}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },

    integration() {
      return `
        <div class="ig-page-header">
          <div class="ig-page-header-left">
            <div class="ig-page-header-icon"><i class="ph ph-plugs-connected"></i></div>
            <div>
              <div class="ig-page-header-title">Instagram Integration</div>
              <div class="ig-page-header-subtitle">Manage your Instagram account connection</div>
            </div>
          </div>
        </div>

        <div class="ig-integration-layout">
          <div class="ig-integration-card">
            <div class="ig-integration-header">
              <span class="ig-integration-title">Connection Status</span>
              <span class="ig-integration-status connected"><i class="ph ph-check-circle"></i> Connected</span>
            </div>
            <div class="ig-integration-info">
              <div class="ig-integration-avatar"><i class="ph ph-instagram-logo"></i></div>
              <div class="ig-integration-details">
                <div class="ig-integration-name">${IGStore.account.name}</div>
                <div class="ig-integration-handle">${IGStore.account.type}</div>
                <div class="ig-integration-date">Connected on ${IGStore.account.connectedDate}</div>
              </div>
            </div>
            <div class="ig-connection-health">
              <div class="ig-connection-health-label"><span>Connection Health</span><span>${IGStore.account.health}%</span></div>
              <div class="ig-connection-health-bar"><div class="ig-connection-health-fill" style="width:${IGStore.account.health}%"></div></div>
            </div>
          </div>

          <div class="ig-integration-card">
            <div class="ig-integration-header">
              <span class="ig-integration-title">Permissions</span>
            </div>
            <div class="ig-permissions-grid">
              ${IGStore.permissions.map(perm => `
                <div class="ig-permission-item">
                  <div class="ig-permission-icon ${perm.allowed ? 'allowed' : 'denied'}"><i class="ph ${perm.allowed ? 'ph-check' : 'ph-x'}"></i></div>
                  <div class="ig-permission-info">
                    <div class="ig-permission-label">${perm.label}</div>
                    <div class="ig-permission-desc">${perm.desc}</div>
                  </div>
                  <span class="ig-permission-status ${perm.allowed ? 'allowed' : 'denied'}">${perm.allowed ? 'Allowed' : 'Denied'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="ig-integration-card">
            <div class="ig-integration-header">
              <span class="ig-integration-title">Actions</span>
            </div>
            <div class="ig-integration-actions">
              <button class="ig-integration-btn primary"><i class="ph ph-arrows-clockwise"></i> Sync Now</button>
              <button class="ig-integration-btn secondary"><i class="ph ph-gear"></i> Configure</button>
              <button class="ig-integration-btn danger"><i class="ph ph-plugs"></i> Disconnect</button>
            </div>
          </div>
        </div>
      `;
    },

    settings() {
      return `
        <div class="ig-page-header">
          <div class="ig-page-header-left">
            <div class="ig-page-header-icon"><i class="ph ph-gear"></i></div>
            <div>
              <div class="ig-page-header-title">Instagram Settings</div>
              <div class="ig-page-header-subtitle">Configure your Instagram integration preferences</div>
            </div>
          </div>
        </div>

        <div class="ig-settings-layout">
          <div class="ig-settings-card">
            <div class="ig-settings-card-header">
              <div class="ig-settings-card-icon pink"><i class="ph ph-bell"></i></div>
              <div>
                <div class="ig-settings-card-title">Notifications</div>
                <div class="ig-settings-card-subtitle">Manage how you receive alerts</div>
              </div>
            </div>
            <div class="ig-settings-card-body">
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Push Notifications</div>
                  <div class="ig-setting-desc">Receive push notifications for new messages</div>
                </div>
                <div class="ig-toggle ${IGStore.settings.notifications ? 'active' : ''}" data-setting="notifications"></div>
              </div>
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Email Notifications</div>
                  <div class="ig-setting-desc">Get email alerts for important activities</div>
                </div>
                <div class="ig-toggle active" data-setting="emailNotifications"></div>
              </div>
            </div>
          </div>

          <div class="ig-settings-card">
            <div class="ig-settings-card-header">
              <div class="ig-settings-card-icon blue"><i class="ph ph-chat-circle-text"></i></div>
              <div>
                <div class="ig-settings-card-title">Message Sync</div>
                <div class="ig-settings-card-subtitle">Control how messages are synchronized</div>
              </div>
            </div>
            <div class="ig-settings-card-body">
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Auto Sync</div>
                  <div class="ig-setting-desc">Automatically sync new messages</div>
                </div>
                <div class="ig-toggle ${IGStore.settings.messageSync ? 'active' : ''}" data-setting="messageSync"></div>
              </div>
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Mark as Read</div>
                  <div class="ig-setting-desc">Automatically mark messages as read</div>
                </div>
                <div class="ig-toggle ${IGStore.settings.markAsRead ? 'active' : ''}" data-setting="markAsRead"></div>
              </div>
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Auto Replies</div>
                  <div class="ig-setting-desc">Send automatic responses when away</div>
                </div>
                <div class="ig-toggle ${IGStore.settings.autoReply ? 'active' : ''}" data-setting="autoReply"></div>
              </div>
            </div>
          </div>

          <div class="ig-settings-card">
            <div class="ig-settings-card-header">
              <div class="ig-settings-card-icon purple"><i class="ph ph-sparkle"></i></div>
              <div>
                <div class="ig-settings-card-title">AI Features</div>
                <div class="ig-settings-card-subtitle">Configure AI-powered assistance</div>
              </div>
            </div>
            <div class="ig-settings-card-body">
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">AI Suggestions</div>
                  <div class="ig-setting-desc">Show AI reply suggestions</div>
                </div>
                <div class="ig-toggle ${IGStore.settings.aiSuggestions ? 'active' : ''}" data-setting="aiSuggestions"></div>
              </div>
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Auto Assignment</div>
                  <div class="ig-setting-desc">Automatically assign new conversations</div>
                </div>
                <div class="ig-toggle ${IGStore.settings.autoAssign ? 'active' : ''}" data-setting="autoAssign"></div>
              </div>
            </div>
          </div>

          <div class="ig-settings-card">
            <div class="ig-settings-card-header">
              <div class="ig-settings-card-icon green"><i class="ph ph-globe"></i></div>
              <div>
                <div class="ig-settings-card-title">General</div>
                <div class="ig-settings-card-subtitle">Basic account preferences</div>
              </div>
            </div>
            <div class="ig-settings-card-body">
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Default Instagram Account</div>
                  <div class="ig-setting-desc">Primary account for this integration</div>
                </div>
                <input type="text" class="ig-setting-input" value="${IGStore.settings.defaultAccount}" readonly>
              </div>
              <div class="ig-setting-row">
                <div class="ig-setting-info">
                  <div class="ig-setting-label">Timezone</div>
                  <div class="ig-setting-desc">Set your local timezone</div>
                </div>
                <select class="ig-setting-select">
                  <option>${IGStore.settings.timezone}</option>
                  <option>UTC-08:00 Pacific Time</option>
                  <option>UTC-06:00 Central Time</option>
                  <option>UTC+00:00 GMT</option>
                  <option>UTC+01:00 Central European Time</option>
                </select>
              </div>
            </div>
          </div>

          <div class="ig-settings-save-bar">
            <button class="ig-cancel-btn">Cancel</button>
            <button class="ig-save-btn">Save Changes</button>
          </div>
        </div>
      `;
    }
  };

  // ============================================
  // APP STATE
  // ============================================
  let currentPage = 'overview';
  let activeConversationId = 1;

  // ============================================
  // NAVIGATION
  // ============================================
  function navigateTo(page) {
    currentPage = page;
    const main = document.getElementById('ig-main');
    if (!main) return;

    // Update nav active state
    document.querySelectorAll('.ig-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Render page
    if (Pages[page]) {
      main.innerHTML = Pages[page]();
      initPage(page);
    }
  }

  function initPage(page) {
    if (page === 'overview') {
      setTimeout(() => {
        Charts.renderLineChart('overview-chart', [
          { values: [45, 52, 38, 65, 48, 72, 58] },
          { values: [30, 42, 35, 50, 40, 60, 45] }
        ], ['#E4405F', '#8B5CF6']);

        Charts.renderDonutChart('engagement-chart', [
          { label: 'Direct Messages', value: 40, color: '#E4405F' },
          { label: 'Comments', value: 30, color: '#8B5CF6' },
          { label: 'Mentions', value: 18, color: '#F97316' },
          { label: 'Story Replies', value: 10, color: '#10B981' },
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
  }

  // ============================================
  // CHAT FUNCTIONALITY
  // ============================================
  function initChat() {
    const convItems = document.querySelectorAll('[data-conv-id]');
    convItems.forEach(item => {
      item.addEventListener('click', () => {
        const convId = parseInt(item.dataset.convId);
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
  }

  function loadConversation(convId) {
    const conv = IGStore.conversations.find(c => c.id === convId);
    if (!conv) return;

    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return;

    // Update header
    const headerName = chatArea.querySelector('.ig-chat-header-name');
    const headerAvatar = chatArea.querySelector('.ig-chat-header-avatar');
    if (headerName) headerName.textContent = conv.name;
    if (headerAvatar) {
      headerAvatar.style.background = conv.avatar;
      headerAvatar.textContent = conv.avatarText;
    }

    // Update messages
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = conv.messages.map(msg => `
        <div class="ig-chat-message ${msg.type}">
          <div class="ig-chat-message-avatar" style="background:${msg.type === 'incoming' ? conv.avatar : '#8B5CF6'}">${msg.type === 'incoming' ? conv.avatarText : 'ME'}</div>
          <div>
            <div class="ig-chat-message-bubble">${msg.text}</div>
            <div class="ig-chat-message-time">${msg.time}</div>
          </div>
        </div>
      `).join('');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Highlight active conversation
    document.querySelectorAll('[data-conv-id]').forEach(el => {
      el.style.background = el.dataset.convId == convId ? 'var(--gray-100)' : '';
    });
  }

  function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input?.value.trim();
    if (!text) return;

    const conv = IGStore.conversations.find(c => c.id === activeConversationId);
    if (!conv) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    conv.messages.push({ type: 'outgoing', text, time: timeStr });
    input.value = '';
    loadConversation(activeConversationId);
  }

  // ============================================
  // SETTINGS FUNCTIONALITY
  // ============================================
  function initSettings() {
    document.querySelectorAll('.ig-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        const setting = toggle.dataset.setting;
        if (setting) {
          IGStore.settings[setting] = toggle.classList.contains('active');
        }
      });
    });

    const saveBtn = document.querySelector('.ig-save-btn');
    const cancelBtn = document.querySelector('.ig-cancel-btn');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        showToast('Settings saved successfully!');
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        navigateTo('settings');
        showToast('Changes discarded');
      });
    }
  }

  // ============================================
  // TOAST NOTIFICATION
  // ============================================
  function showToast(message) {
    let toast = document.getElementById('ig-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ig-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 12px 20px;
        background: var(--gray-900);
        color: white;
        border-radius: var(--radius-lg);
        font-size: var(--text-sm);
        font-weight: var(--font-medium);
        z-index: 9999;
        box-shadow: var(--shadow-lg);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 3000);
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Nav click handlers
    document.querySelectorAll('.ig-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) navigateTo(page);
      });
    });

    // Load initial page
    navigateTo('overview');

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

})();