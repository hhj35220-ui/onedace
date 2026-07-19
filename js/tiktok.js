/**
 * OnePlace Enterprise v3.0 — TikTok Module
 * Vanilla JavaScript (ES6+)
 */

const TIKTOK_STORAGE_KEYS = {
  CONVERSATIONS: 'op_tiktok_conversations',
  COMMENTS: 'op_tiktok_comments',
  MENTIONS: 'op_tiktok_mentions',
  VIDEO_INTERACTIONS: 'op_tiktok_video_interactions',
  SETTINGS: 'op_tiktok_settings',
  INTEGRATION: 'op_tiktok_integration',
  SAVED_REPLIES: 'op_tiktok_saved_replies',
  CUSTOMERS: 'op_tiktok_customers',
  MESSAGES: 'op_tiktok_messages',
  NOTIFICATIONS: 'op_tiktok_notifications'
};

// Sample Data
const TIKTOK_SAMPLE_CUSTOMERS = [
  { id: 'tc1', name: 'Sarah Johnson', handle: '@sarahjohnson', avatar: 'SJ', color: '#fe2c55', status: 'online', email: 'sarah.j@example.com', location: 'Canada', leadScore: 85, customerStatus: 'Active', totalOrders: 12, totalSpent: 1245.00, tags: ['VIP Customer', 'New Customer'] },
  { id: 'tc2', name: 'Michael Brown', handle: '@michaelbrown', avatar: 'MB', color: '#25f4ee', status: 'offline', email: 'michael.b@example.com', location: 'United States', leadScore: 72, customerStatus: 'Active', totalOrders: 8, totalSpent: 890.50, tags: ['New Customer'] },
  { id: 'tc3', name: 'Olivia Rodriguez', handle: '@oliviarodriguez', avatar: 'OR', color: '#f59e0b', status: 'online', email: 'olivia.r@example.com', location: 'Mexico', leadScore: 91, customerStatus: 'Active', totalOrders: 24, totalSpent: 2340.00, tags: ['VIP Customer'] },
  { id: 'tc4', name: 'James Wilson', handle: '@jameswilson', avatar: 'JW', color: '#8b5cf6', status: 'away', email: 'james.w@example.com', location: 'United Kingdom', leadScore: 68, customerStatus: 'Inactive', totalOrders: 3, totalSpent: 345.00, tags: ['New Customer'] },
  { id: 'tc5', name: 'Emma Davis', handle: '@emmadavis', avatar: 'ED', color: '#10b981', status: 'online', email: 'emma.d@example.com', location: 'Australia', leadScore: 78, customerStatus: 'Active', totalOrders: 15, totalSpent: 1560.75, tags: ['Returning'] },
  { id: 'tc6', name: 'Daniel Thomas', handle: '@danielthomas', avatar: 'DT', color: '#f43f5e', status: 'offline', email: 'daniel.t@example.com', location: 'Germany', leadScore: 55, customerStatus: 'Active', totalOrders: 5, totalSpent: 520.00, tags: ['New Customer'] },
  { id: 'tc7', name: 'Sophia Martinez', handle: '@sophiamartinez', avatar: 'SM', color: '#06b6d4', status: 'online', email: 'sophia.m@example.com', location: 'Spain', leadScore: 88, customerStatus: 'Active', totalOrders: 18, totalSpent: 1890.25, tags: ['VIP Customer', 'Returning'] },
  { id: 'tc8', name: 'Lucas Park', handle: '@lucaspark', avatar: 'LP', color: '#eab308', status: 'away', email: 'lucas.p@example.com', location: 'South Korea', leadScore: 62, customerStatus: 'Inactive', totalOrders: 2, totalSpent: 180.00, tags: ['New Customer'] }
];

const TIKTOK_SAMPLE_CONVERSATIONS = [
  { id: 'tconv1', customerId: 'tc1', lastMessage: 'Hi! Do you ship to Canada?', unread: true, unreadCount: 2, priority: 'high', status: 'open', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), assignedTo: 'tm1' },
  { id: 'tconv2', customerId: 'tc2', lastMessage: 'Love your products!', unread: true, unreadCount: 1, priority: 'medium', status: 'open', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), assignedTo: 'tm1' },
  { id: 'tconv3', customerId: 'tc3', lastMessage: 'Can you tell me the price?', unread: true, unreadCount: 3, priority: 'high', status: 'open', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), assignedTo: 'tm2' },
  { id: 'tconv4', customerId: 'tc4', lastMessage: 'When will this be back in stock?', unread: false, unreadCount: 0, priority: 'low', status: 'open', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), assignedTo: 'tm1' },
  { id: 'tconv5', customerId: 'tc5', lastMessage: "Great! I'll place an order today.", unread: false, unreadCount: 0, priority: 'medium', status: 'resolved', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), assignedTo: 'tm3' },
  { id: 'tconv6', customerId: 'tc6', lastMessage: 'Do you have size M?', unread: true, unreadCount: 1, priority: 'medium', status: 'open', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), assignedTo: 'tm2' },
  { id: 'tconv7', customerId: 'tc7', lastMessage: 'Thanks for the new collection!', unread: false, unreadCount: 0, priority: 'low', status: 'resolved', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), assignedTo: 'tm1' },
  { id: 'tconv8', customerId: 'tc8', lastMessage: 'Is there a discount code?', unread: true, unreadCount: 2, priority: 'high', status: 'open', timestamp: new Date(Date.now() - 30 * 3600000).toISOString(), assignedTo: 'tm3' }
];

const TIKTOK_SAMPLE_MESSAGES = {
  tconv1: [
    { id: 'tm1', sender: 'customer', text: 'Hi there! I saw your TikTok video about the summer collection.', time: new Date(Date.now() - 45 * 60000).toISOString() },
    { id: 'tm2', sender: 'customer', text: 'Do you ship to Canada?', time: new Date(Date.now() - 43 * 60000).toISOString() },
    { id: 'tm3', sender: 'agent', text: 'Yes! We ship to Canada', time: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: 'tm4', sender: 'customer', text: 'What are the shipping fees?', time: new Date(Date.now() - 20 * 60000).toISOString() },
    { id: 'tm5', sender: 'customer', text: 'And how long does delivery take?', time: new Date(Date.now() - 15 * 60000).toISOString() }
  ],
  tconv2: [
    { id: 'tm6', sender: 'customer', text: 'Love your products! Just ordered the blue hoodie.', time: new Date(Date.now() - 60 * 60000).toISOString() },
    { id: 'tm7', sender: 'agent', text: 'Thank you so much! We appreciate your support.', time: new Date(Date.now() - 55 * 60000).toISOString() },
    { id: 'tm8', sender: 'customer', text: 'When can I expect it to arrive?', time: new Date(Date.now() - 45 * 60000).toISOString() }
  ],
  tconv3: [
    { id: 'tm9', sender: 'customer', text: 'Hey! Can you tell me the price of the limited edition sneakers?', time: new Date(Date.now() - 3 * 3600000).toISOString() },
    { id: 'tm10', sender: 'customer', text: 'And do you have them in size 9?', time: new Date(Date.now() - 2.5 * 3600000).toISOString() },
    { id: 'tm11', sender: 'customer', text: "I really want to get them before they sell out!", time: new Date(Date.now() - 2 * 3600000).toISOString() }
  ],
  tconv4: [
    { id: 'tm12', sender: 'customer', text: 'Hi, when will the black jacket be back in stock?', time: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: 'tm13', sender: 'agent', text: 'Hi James! We expect it back in stock next week.', time: new Date(Date.now() - 3.5 * 3600000).toISOString() },
    { id: 'tm14', sender: 'customer', text: "Can you notify me when it's available?", time: new Date(Date.now() - 3 * 3600000).toISOString() }
  ],
  tconv5: [
    { id: 'tm15', sender: 'customer', text: "Thanks for the help! I'll place an order today.", time: new Date(Date.now() - 6 * 3600000).toISOString() },
    { id: 'tm16', sender: 'agent', text: "You're welcome! Let us know if you need anything else.", time: new Date(Date.now() - 5.5 * 3600000).toISOString() },
    { id: 'tm17', sender: 'customer', text: "Great! I'll place an order today.", time: new Date(Date.now() - 5 * 3600000).toISOString() }
  ],
  tconv6: [
    { id: 'tm18', sender: 'customer', text: 'Do you have the summer dress in size M?', time: new Date(Date.now() - 10 * 3600000).toISOString() },
    { id: 'tm19', sender: 'agent', text: 'Yes, we have it in stock! Would you like me to reserve one?', time: new Date(Date.now() - 9 * 3600000).toISOString() },
    { id: 'tm20', sender: 'customer', text: 'Yes please! How do I complete the purchase?', time: new Date(Date.now() - 8 * 3600000).toISOString() }
  ],
  tconv7: [
    { id: 'tm21', sender: 'customer', text: 'Thanks for the new collection! Everything looks amazing.', time: new Date(Date.now() - 30 * 3600000).toISOString() },
    { id: 'tm22', sender: 'agent', text: "We're so glad you like it! Use code NEW20 for 20% off.", time: new Date(Date.now() - 28 * 3600000).toISOString() },
    { id: 'tm23', sender: 'customer', text: 'Awesome, thanks!', time: new Date(Date.now() - 24 * 3600000).toISOString() }
  ],
  tconv8: [
    { id: 'tm24', sender: 'customer', text: 'Hi! Is there a discount code I can use?', time: new Date(Date.now() - 35 * 3600000).toISOString() },
    { id: 'tm25', sender: 'agent', text: 'Yes! Use TIKTOK15 for 15% off your first order.', time: new Date(Date.now() - 34 * 3600000).toISOString() },
    { id: 'tm26', sender: 'customer', text: 'Does it work on sale items too?', time: new Date(Date.now() - 32 * 3600000).toISOString() },
    { id: 'tm27', sender: 'customer', text: 'And is there free shipping?', time: new Date(Date.now() - 30 * 3600000).toISOString() }
  ]
};

const TIKTOK_SAMPLE_COMMENTS = [
  { id: 'tcmt1', author: 'lisa_park', authorHandle: '@lisa_park', authorAvatar: 'LP', authorColor: '#fe2c55', text: 'Love this collection! 🔥', videoTitle: 'New Product Unboxing!', videoId: 'v1', likes: 24, replies: 3, time: new Date(Date.now() - 30 * 60000).toISOString(), priority: 'high', status: 'unread', aiReply: "Thank you so much! We're glad you love it. ❤️" },
  { id: 'tcmt2', author: 'john_doe', authorHandle: '@johndoe', authorAvatar: 'JD', authorColor: '#25f4ee', text: 'How much is this?', videoTitle: 'How to Get More Views', videoId: 'v2', likes: 12, replies: 1, time: new Date(Date.now() - 2 * 3600000).toISOString(), priority: 'medium', status: 'unread', aiReply: 'Hi! This item is $49.99. Let us know if you have any other questions!' },
  { id: 'tcmt3', author: 'emily_chen', authorHandle: '@emilychen', authorAvatar: 'EC', authorColor: '#f59e0b', text: 'Can you ship worldwide?', videoTitle: 'Behind the Scenes', videoId: 'v3', likes: 8, replies: 0, time: new Date(Date.now() - 4 * 3600000).toISOString(), priority: 'medium', status: 'replied', aiReply: null },
  { id: 'tcmt4', author: 'mike_williams', authorHandle: '@mikewilliams', authorAvatar: 'MW', authorColor: '#8b5cf6', text: 'Does it come in black?', videoTitle: 'Q&A with the Team', videoId: 'v4', likes: 5, replies: 2, time: new Date(Date.now() - 6 * 3600000).toISOString(), priority: 'low', status: 'unread', aiReply: "Yes! It's available in black, white, and navy blue." },
  { id: 'tcmt5', author: 'sarah_kim', authorHandle: '@sarahkim', authorAvatar: 'SK', authorColor: '#10b981', text: 'Just ordered mine! So excited 🎉', videoTitle: 'New Product Unboxing!', videoId: 'v1', likes: 45, replies: 6, time: new Date(Date.now() - 8 * 3600000).toISOString(), priority: 'high', status: 'replied', aiReply: null },
  { id: 'tcmt6', author: 'alex_turner', authorHandle: '@alexturner', authorAvatar: 'AT', authorColor: '#f43f5e', text: 'What sizes do you have?', videoTitle: 'Summer Lookbook 2024', videoId: 'v5', likes: 15, replies: 1, time: new Date(Date.now() - 12 * 3600000).toISOString(), priority: 'medium', status: 'unread', aiReply: 'We have sizes XS through XXL available!' },
  { id: 'tcmt7', author: 'jessica_lee', authorHandle: '@jessicalee', authorAvatar: 'JL', authorColor: '#06b6d4', text: 'This is exactly what I was looking for!', videoTitle: 'How to Get More Views', videoId: 'v2', likes: 32, replies: 4, time: new Date(Date.now() - 18 * 3600000).toISOString(), priority: 'low', status: 'replied', aiReply: null },
  { id: 'tcmt8', author: 'david_brown', authorHandle: '@davidbrown', authorAvatar: 'DB', authorColor: '#eab308', text: 'Any restock updates?', videoTitle: 'Behind the Scenes', videoId: 'v3', likes: 7, replies: 0, time: new Date(Date.now() - 24 * 3600000).toISOString(), priority: 'medium', status: 'unread', aiReply: "We're restocking next week! Sign up for notifications to be the first to know." },
  { id: 'tcmt9', author: 'rachel_green', authorHandle: '@rachelgreen', authorAvatar: 'RG', authorColor: '#6366f1', text: 'Thanks for the tips! 🙏', videoTitle: 'Q&A with the Team', videoId: 'v4', likes: 22, replies: 3, time: new Date(Date.now() - 36 * 3600000).toISOString(), priority: 'low', status: 'replied', aiReply: null },
  { id: 'tcmt10', author: 'tom_harris', authorHandle: '@tomharris', authorAvatar: 'TH', authorColor: '#ec4899', text: 'Is this waterproof?', videoTitle: 'Summer Lookbook 2024', videoId: 'v5', likes: 9, replies: 1, time: new Date(Date.now() - 48 * 3600000).toISOString(), priority: 'medium', status: 'unread', aiReply: "Yes, it's water-resistant up to 50 meters!" }
];

const TIKTOK_SAMPLE_MENTIONS = [
  { id: 'tmen1', author: 'fashion_daily', authorHandle: '@fashiondaily', authorAvatar: 'FD', authorColor: '#fe2c55', text: '@acmesolutions love this collection! 🔥', videoTitle: 'Fashion Week Highlights', videoId: 'v6', likes: 156, time: new Date(Date.now() - 20 * 60000).toISOString(), status: 'unread' },
  { id: 'tmen2', author: 'style_inspo', authorHandle: '@styleinspo', authorAvatar: 'SI', authorColor: '#25f4ee', text: 'Just tried your product! @acmesolutions', videoTitle: 'Product Review', videoId: 'v7', likes: 89, time: new Date(Date.now() - 3 * 3600000).toISOString(), status: 'unread' },
  { id: 'tmen3', author: 'trendy_looks', authorHandle: '@trendylooks', authorAvatar: 'TL', authorColor: '#f59e0b', text: 'Any restock updates? @acmesolutions', videoTitle: 'Trend Alert', videoId: 'v8', likes: 45, time: new Date(Date.now() - 8 * 3600000).toISOString(), status: 'read' },
  { id: 'tmen4', author: 'outfit_of_the_day', authorHandle: '@ootd', authorAvatar: 'OD', authorColor: '#8b5cf6', text: 'Thanks @acmesolutions for the feature! 🙏', videoTitle: 'OOTD Challenge', videoId: 'v9', likes: 234, time: new Date(Date.now() - 15 * 3600000).toISOString(), status: 'read' },
  { id: 'tmen5', author: 'beauty_guru', authorHandle: '@beautyguru', authorAvatar: 'BG', authorColor: '#10b981', text: 'Collaboration with @acmesolutions was amazing!', videoTitle: 'Brand Collaboration', videoId: 'v10', likes: 567, time: new Date(Date.now() - 24 * 3600000).toISOString(), status: 'unread' },
  { id: 'tmen6', author: 'tech_reviewer', authorHandle: '@techreviewer', authorAvatar: 'TR', authorColor: '#f43f5e', text: 'Full review of @acmesolutions new line coming soon!', videoTitle: 'Tech Review', videoId: 'v11', likes: 123, time: new Date(Date.now() - 36 * 3600000).toISOString(), status: 'read' },
  { id: 'tmen7', author: 'lifestyle_vibes', authorHandle: '@lifestylevibes', authorAvatar: 'LV', authorColor: '#06b6d4', text: 'Obsessed with @acmesolutions latest drop 😍', videoTitle: 'Lifestyle Update', videoId: 'v12', likes: 78, time: new Date(Date.now() - 48 * 3600000).toISOString(), status: 'unread' },
  { id: 'tmen8', author: 'daily_deals', authorHandle: '@dailydeals', authorAvatar: 'DD', authorColor: '#eab308', text: 'Best deal alert: @acmesolutions sale is live!', videoTitle: 'Deal Alert', videoId: 'v13', likes: 445, time: new Date(Date.now() - 72 * 3600000).toISOString(), status: 'read' }
];

const TIKTOK_SAMPLE_VIDEOS = [
  { id: 'v1', title: 'New Product Unboxing!', views: '12.4K', likes: '2.1K', comments: 89, shares: 156, thumbnail: 'unboxing', date: 'May 28' },
  { id: 'v2', title: 'How to Get More Views', views: '8.7K', likes: '1.5K', comments: 67, shares: 98, thumbnail: 'tutorial', date: 'May 27' },
  { id: 'v3', title: 'Behind the Scenes', views: '5.2K', likes: '890', comments: 45, shares: 67, thumbnail: 'bts', date: 'May 26' },
  { id: 'v4', title: 'Q&A with the Team', views: '3.8K', likes: '650', comments: 34, shares: 45, thumbnail: 'qa', date: 'May 25' },
  { id: 'v5', title: 'Summer Lookbook 2024', views: '15.3K', likes: '3.2K', comments: 123, shares: 234, thumbnail: 'lookbook', date: 'May 24' },
  { id: 'v6', title: 'Fashion Week Highlights', views: '22.1K', likes: '4.5K', comments: 189, shares: 345, thumbnail: 'fashion', date: 'May 23' }
];

const TIKTOK_SAVED_REPLIES = [
  { id: 'tsr1', title: 'Welcome Message', text: 'Hi there! Thanks for reaching out. How can we help you today?', category: 'General', usageCount: 34 },
  { id: 'tsr2', title: 'Shipping Information', text: 'We ship worldwide! Shipping usually takes 3-5 business days domestically and 7-14 days internationally.', category: 'Shipping', usageCount: 18 },
  { id: 'tsr3', title: 'Order Status', text: 'Sure! Let me check your order status for you. Could you please provide your order number?', category: 'Orders', usageCount: 16 },
  { id: 'tsr4', title: 'Return Policy', text: 'We accept returns within 30 days of purchase. Please check our return policy for more details.', category: 'Returns', usageCount: 12 },
  { id: 'tsr5', title: 'Discount Code', text: 'Use code TIKTOK15 for 15% off your first order! Valid for new customers only.', category: 'Promotions', usageCount: 9 }
];

const TIKTOK_DEFAULT_SETTINGS = {
  general: {
    defaultResponseTime: '1 Hour',
    timezone: '(GMT-05:00) Eastern Time (US & Canada)',
    autoMarkAsRead: true,
    enableAI: true,
    showTypingIndicator: true
  },
  notifications: {
    newMessages: true,
    newComments: true,
    newMentions: true,
    newFollowers: true,
    emailNotifications: false,
    pushNotifications: true
  },
  autoReplies: {
    enabled: true,
    welcomeMessage: "Thanks for messaging us! We'll get back to you shortly.",
    awayMessage: "We're currently away. We'll respond during business hours (9 AM - 6 PM EST)."
  },
  savedReplies: TIKTOK_SAVED_REPLIES,
  labels: [
    { id: 'lbl1', name: 'VIP Customer', color: '#fe2c55' },
    { id: 'lbl2', name: 'New Customer', color: '#10b981' },
    { id: 'lbl3', name: 'Returning', color: '#6366f1' },
    { id: 'lbl4', name: 'High Priority', color: '#f59e0b' }
  ],
  teamMembers: [
    { id: 'tm1', name: 'Alex Morgan', role: 'Admin', avatar: 'AM', color: '#6366f1' },
    { id: 'tm2', name: 'Jake Cooper', role: 'Editor', avatar: 'JC', color: '#8b5cf6' },
    { id: 'tm3', name: 'Cody Fisher', role: 'Moderator', avatar: 'CF', color: '#ec4899' }
  ]
};

// ============================================
// TikTok Storage Manager
// ============================================

class TikTokStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.CUSTOMERS, JSON.stringify(TIKTOK_SAMPLE_CUSTOMERS));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.CONVERSATIONS)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(TIKTOK_SAMPLE_CONVERSATIONS));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.MESSAGES, JSON.stringify(TIKTOK_SAMPLE_MESSAGES));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.COMMENTS)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.COMMENTS, JSON.stringify(TIKTOK_SAMPLE_COMMENTS));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.MENTIONS)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.MENTIONS, JSON.stringify(TIKTOK_SAMPLE_MENTIONS));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.VIDEO_INTERACTIONS)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.VIDEO_INTERACTIONS, JSON.stringify(TIKTOK_SAMPLE_VIDEOS));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.SETTINGS, JSON.stringify(TIKTOK_DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.INTEGRATION)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.INTEGRATION, JSON.stringify({
        connected: true,
        accountName: '@acmesolutions',
        accountHandle: '@acmesolutions',
        followers: '24.6K',
        following: '312',
        likes: '128K',
        connectedDate: 'May 12, 2024',
        health: 100,
        permissions: {
          readMessages: true,
          readComments: true,
          readMentions: true,
          readVideoInteractions: true,
          sendMessages: true,
          manageReplies: true
        }
      }));
    }
    if (!localStorage.getItem(TIKTOK_STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(TIKTOK_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
  }

  getCustomers() {
    return JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.CUSTOMERS) || '[]');
  }

  getCustomer(id) {
    return this.getCustomers().find(c => c.id === id);
  }

  getConversations(filter = 'all') {
    let conversations = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.CONVERSATIONS) || '[]');
    const customers = this.getCustomers();
    conversations = conversations.map(conv => ({
      ...conv,
      customer: customers.find(c => c.id === conv.customerId)
    }));
    if (filter === 'unread') conversations = conversations.filter(c => c.unread);
    if (filter === 'assigned') conversations = conversations.filter(c => c.assignedTo === 'tm1');
    return conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getConversation(id) {
    return this.getConversations().find(c => c.id === id);
  }

  getMessages(conversationId) {
    const messages = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.MESSAGES) || '{}');
    return messages[conversationId] || [];
  }

  addMessage(conversationId, message) {
    const messages = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.MESSAGES) || '{}');
    if (!messages[conversationId]) messages[conversationId] = [];
    messages[conversationId].push({
      id: 'tm_' + Date.now(),
      ...message,
      time: new Date().toISOString()
    });
    localStorage.setItem(TIKTOK_STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    const conversations = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.CONVERSATIONS) || '[]');
    const idx = conversations.findIndex(c => c.id === conversationId);
    if (idx !== -1) {
      conversations[idx].lastMessage = message.text;
      conversations[idx].timestamp = new Date().toISOString();
      conversations[idx].unread = false;
      conversations[idx].unreadCount = 0;
      localStorage.setItem(TIKTOK_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
    return messages[conversationId];
  }

  markConversationRead(id) {
    const conversations = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.CONVERSATIONS) || '[]');
    const idx = conversations.findIndex(c => c.id === id);
    if (idx !== -1) {
      conversations[idx].unread = false;
      conversations[idx].unreadCount = 0;
      localStorage.setItem(TIKTOK_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
  }

  getComments(filter = 'all') {
    let comments = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.COMMENTS) || '[]');
    if (filter === 'unread') comments = comments.filter(c => c.status === 'unread');
    if (filter === 'replied') comments = comments.filter(c => c.status === 'replied');
    if (filter === 'high') comments = comments.filter(c => c.priority === 'high');
    return comments.sort((a, b) => new Date(b.time) - new Date(a.time));
  }

  updateComment(id, updates) {
    const comments = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.COMMENTS) || '[]');
    const idx = comments.findIndex(c => c.id === id);
    if (idx !== -1) {
      comments[idx] = { ...comments[idx], ...updates };
      localStorage.setItem(TIKTOK_STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    }
    return comments[idx];
  }

  getMentions(filter = 'all') {
    let mentions = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.MENTIONS) || '[]');
    if (filter === 'unread') mentions = mentions.filter(m => m.status === 'unread');
    if (filter === 'read') mentions = mentions.filter(m => m.status === 'read');
    return mentions.sort((a, b) => new Date(b.time) - new Date(a.time));
  }

  updateMention(id, updates) {
    const mentions = JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.MENTIONS) || '[]');
    const idx = mentions.findIndex(m => m.id === id);
    if (idx !== -1) {
      mentions[idx] = { ...mentions[idx], ...updates };
      localStorage.setItem(TIKTOK_STORAGE_KEYS.MENTIONS, JSON.stringify(mentions));
    }
    return mentions[idx];
  }

  getVideos() {
    return JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.VIDEO_INTERACTIONS) || '[]');
  }

  getSettings() {
    return JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.SETTINGS) || '{}');
  }

  updateSettings(section, data) {
    const settings = this.getSettings();
    settings[section] = { ...settings[section], ...data };
    localStorage.setItem(TIKTOK_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }

  getIntegration() {
    return JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.INTEGRATION) || '{}');
  }

  updateIntegration(data) {
    const integration = this.getIntegration();
    const updated = { ...integration, ...data };
    localStorage.setItem(TIKTOK_STORAGE_KEYS.INTEGRATION, JSON.stringify(updated));
    return updated;
  }

  getStats() {
    const conversations = this.getConversations();
    const comments = this.getComments();
    const mentions = this.getMentions();
    const videos = this.getVideos();
    return {
      totalConversations: conversations.length,
      unreadMessages: conversations.filter(c => c.unread).length,
      totalComments: comments.length,
      unreadComments: comments.filter(c => c.status === 'unread').length,
      totalMentions: mentions.length,
      unreadMentions: mentions.filter(m => m.status === 'unread').length,
      totalVideos: videos.length,
      totalVideoViews: videos.reduce((sum, v) => sum + parseFloat(v.views.replace('K', '')) * 1000, 0),
      totalVideoLikes: videos.reduce((sum, v) => sum + parseFloat(v.likes.replace('K', '')) * 1000, 0)
    };
  }

  getNotifications() {
    return JSON.parse(localStorage.getItem(TIKTOK_STORAGE_KEYS.NOTIFICATIONS) || '[]');
  }

  addNotification(notification) {
    const notifications = this.getNotifications();
    notifications.unshift({
      id: 'tn_' + Date.now(),
      ...notification,
      time: new Date().toISOString(),
      read: false
    });
    localStorage.setItem(TIKTOK_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications.slice(0, 50)));
  }

  clearNotifications() {
    localStorage.setItem(TIKTOK_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
}

// ============================================
// TikTok App Class
// ============================================

class TikTokApp {
  constructor() {
    this.storage = new TikTokStorage();
    this.currentPage = 'overview';
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.selectedConversation = null;
    this.sidebarOpen = false;
    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) this.currentPage = page;
    const convId = urlParams.get('conv');
    if (convId) this.selectedConversation = convId;
    this.renderSidebar();
    this.renderHeader();
    this.bindEvents();
    this.renderCurrentPage();
  }

  navigateTo(page, param) {
    let url = 'index.html?page=' + page;
    if (param) url += '&conv=' + param;
    window.location.href = url;
  }

  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;
    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const stats = this.storage.getStats();
    const unreadTotal = stats.unreadMessages + stats.unreadComments + stats.unreadMentions;

    const navItems = [
      { section: 'Core', items: [
        { id: 'main-dashboard', label: 'Dashboard', icon: 'ph-squares-four', href: '../dashboard/main-dashboard.html' },
        { id: 'unified-inbox', label: 'Unified Inbox', icon: 'ph-inbox', href: '../inbox/unified-inbox.html' },
      ]},
      { section: 'TikTok', items: [
        { id: 'tiktok-overview', label: 'Overview', icon: 'ph-chart-pie-slice', href: 'index.html?page=overview', badge: 0 },
        { id: 'tiktok-conversations', label: 'Conversations', icon: 'ph-chat-circle-text', href: 'index.html?page=conversations', badge: stats.unreadMessages },
        { id: 'tiktok-comments', label: 'Comments', icon: 'ph-chat-teardrop-text', href: 'index.html?page=comments', badge: stats.unreadComments },
        { id: 'tiktok-mentions', label: 'Mentions', icon: 'ph-at', href: 'index.html?page=mentions', badge: stats.unreadMentions },
        { id: 'tiktok-video-interactions', label: 'Video Interactions', icon: 'ph-video', href: 'index.html?page=video-interactions', badge: 0 },
        { id: 'tiktok-integration', label: 'Integration', icon: 'ph-plugs-connected', href: 'index.html?page=integration', badge: 0 },
        { id: 'tiktok-settings', label: 'Settings', icon: 'ph-gear', href: 'index.html?page=settings', badge: 0 },
      ]},
      { section: 'Platforms', items: [
        { id: 'gmail', label: 'Gmail', icon: 'ph-envelope-simple', href: '../gmail/index.html', platform: true },
        { id: 'whatsapp', label: 'WhatsApp', icon: 'ph-chat-circle-text', href: '../whatsapp/index.html', platform: true },
        { id: 'instagram', label: 'Instagram', icon: 'ph-camera', href: '../instagram/index.html', platform: true },
        { id: 'x', label: 'X (Twitter)', icon: 'ph-x-logo', href: '../x/index.html', platform: true },
        { id: 'linkedin', label: 'LinkedIn', icon: 'ph-linkedin-logo', href: '../linkedin/index.html', platform: true },
      ]},
      { section: 'Business', items: [
        { id: 'crm', label: 'CRM', icon: 'ph-users', href: '../crm/index.html' },
        { id: 'calendar', label: 'Calendar', icon: 'ph-calendar', href: '../calendar/index.html' },
        { id: 'tasks', label: 'Tasks', icon: 'ph-check-circle', href: '../tasks/index.html' },
        { id: 'reports', label: 'Reports', icon: 'ph-chart-bar', href: '../reports/index.html' },
      ]},
      { section: 'System', items: [
        { id: 'settings', label: 'Settings', icon: 'ph-gear', href: '../settings/index.html' },
        { id: 'help', label: 'Help Center', icon: 'ph-question', href: '../help/index.html' },
      ]},
      { section: 'More', items: [
        { id: 'support', label: 'Support', icon: 'ph-headset', href: '../support/index.html' },
        { id: 'billing', label: 'Billing', icon: 'ph-credit-card', href: '../billing/index.html' },
        { id: 'files', label: 'Files', icon: 'ph-folder', href: '../files/index.html' },
        { id: 'search', label: 'Search', icon: 'ph-magnifying-glass', href: '../search/index.html' },
        { id: 'notifications', label: 'Notifications', icon: 'ph-bell', href: '../notifications/notifications.html' },
        { id: 'workflow', label: 'Workflow', icon: 'ph-git-merge', href: '../workflow/index.html' },
      ]}
    ];

    let html = '<div class="sidebar-header"><a href="../index.html" class="logo"><div class="logo-mark"><i class="ph ph-chat-centered-text"></i></div><div class="logo-text"><span class="logo-brand">OnePlace</span><span class="logo-sub">Enterprise</span></div></a></div><nav class="sidebar-nav" aria-label="TikTok navigation">';

    navItems.forEach(section => {
      html += '<div class="sidebar-section"><div class="sidebar-section-title">' + section.section + '</div>';
      section.items.forEach(item => {
        const isActive = item.id.startsWith('tiktok-') && item.id.replace('tiktok-', '') === this.currentPage;
        const activeClass = isActive ? 'active' : '';
        const badgeHtml = item.badge ? '<span class="sidebar-badge ' + (item.badge > 0 ? 'unread' : '') + '">' + item.badge + '</span>' : '';
        const platformClass = item.platform ? item.id : '';
        html += '<a href="' + item.href + '" class="sidebar-item ' + activeClass + '" data-page="' + item.id + '">';
        html += item.platform ? '<span class="sidebar-platform-icon ' + platformClass + '"><i class="ph ' + item.icon + '"></i></span>' : '<i class="ph ' + item.icon + '"></i>';
        html += '<span>' + item.label + '</span>' + badgeHtml + '</a>';
      });
      html += '</div>';
    });

    html += '</nav><div class="sidebar-footer"><div class="sidebar-user"><div class="sidebar-user-avatar">' + initials + '</div><div class="sidebar-user-info"><div class="sidebar-user-name">' + userName + '</div><div class="sidebar-user-role">Admin</div></div></div></div>';
    sidebar.innerHTML = html;
  }

  renderHeader() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;
    const session = OP.auth.getSession();
    const userName = session?.fullName || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const stats = this.storage.getStats();
    const unreadTotal = stats.unreadMessages + stats.unreadComments + stats.unreadMentions;

    header.innerHTML = '<div class="header-left"><button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar"><i class="ph ph-list"></i></button><div class="header-search"><i class="ph ph-magnifying-glass"></i><input type="text" id="global-search" placeholder="Search conversations, comments, mentions..." autocomplete="off"></div></div><div class="header-right"><button class="header-btn" id="notifications-btn" aria-label="Notifications"><i class="ph ph-bell"></i>' + (unreadTotal > 0 ? '<span class="notification-dot"></span>' : '') + '</button><button class="header-btn" id="theme-toggle-header" aria-label="Toggle theme"><i class="ph ph-moon"></i></button><div class="header-avatar" id="user-menu-btn" title="' + userName + '">' + initials + '</div></div>';
  }

  bindEvents() {
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
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value;
        this.renderCurrentPage();
      });
    }
    const themeBtn = document.getElementById('theme-toggle-header');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        OP.theme.toggle();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = '<i class="ph ' + (isDark ? 'ph-sun' : 'ph-moon') + '"></i>';
      });
    }
    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        const notifications = this.storage.getNotifications();
        if (notifications.length === 0) {
          OP.toast.show('No new notifications', 'info');
        } else {
          notifications.slice(0, 5).forEach(n => {
            OP.toast.show(n.message, n.type || 'info', 3000);
          });
        }
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
  }

  renderCurrentPage() {
    const container = document.getElementById('tiktok-content');
    if (!container) return;
    switch (this.currentPage) {
      case 'overview': this.renderOverview(container); break;
      case 'conversations': this.renderConversations(container); break;
      case 'comments': this.renderComments(container); break;
      case 'mentions': this.renderMentions(container); break;
      case 'video-interactions': this.renderVideoInteractions(container); break;
      case 'integration': this.renderIntegration(container); break;
      case 'settings': this.renderSettings(container); break;
      default: this.renderOverview(container);
    }
  }

  // ============================================
  // Overview Page
  // ============================================
  renderOverview(container) {
    const stats = this.storage.getStats();
    const conversations = this.storage.getConversations().slice(0, 5);
    const videos = this.storage.getVideos().slice(0, 4);
    const integration = this.storage.getIntegration();

    const trends = [
      { label: 'Total Conversations', value: stats.totalConversations, change: 16.5, icon: 'ph-chat-circle-text', color: 'conversations' },
      { label: 'Unread Messages', value: stats.unreadMessages, change: 21.3, icon: 'ph-envelope', color: 'messages' },
      { label: 'Comments', value: stats.totalComments, change: 15.2, icon: 'ph-chat-teardrop-text', color: 'comments' },
      { label: 'Mentions', value: stats.totalMentions, change: 10.4, icon: 'ph-at', color: 'mentions' },
      { label: 'Video Interactions', value: stats.totalVideoLikes, change: 34.7, icon: 'ph-heart', color: 'interactions' }
    ];

    let html = '<div class="tiktok-overview-header"><div class="tiktok-overview-title"><div class="sidebar-platform-icon tiktok" style="width:36px;height:36px;font-size:18px;"><i class="ph ph-tiktok-logo"></i></div><div><h1>TikTok Overview</h1><p>Monitor and engage with your TikTok audience</p></div></div><div class="tiktok-overview-actions"><div class="tiktok-date-picker"><i class="ph ph-calendar-blank"></i><span>May 22 - May 28, 2024</span><i class="ph ph-caret-down"></i></div><button class="tiktok-export-btn" onclick="tiktokApp.exportReport()"><i class="ph ph-export"></i><span>Export Report</span></button></div></div>';

    html += '<div class="tiktok-stats-grid">';
    trends.forEach(t => {
      html += '<div class="tiktok-stat-card"><div class="tiktok-stat-header"><div class="tiktok-stat-icon ' + t.color + '"><i class="ph ' + t.icon + '"></i></div><span class="tiktok-stat-trend ' + (t.change >= 0 ? 'up' : 'down') + '"><i class="ph ' + (t.change >= 0 ? 'ph-trend-up' : 'ph-trend-down') + '"></i>' + Math.abs(t.change) + '%</span></div><div class="tiktok-stat-value">' + (t.value >= 1000 ? (t.value / 1000).toFixed(1) + 'K' : t.value) + '</div><div class="tiktok-stat-label">vs last 7 days</div></div>';
    });
    html += '</div>';

    html += '<div class="tiktok-grid">';

    // Conversations Trend
    html += '<div class="tiktok-col-6"><div class="tiktok-widget-card"><div class="tiktok-widget-header"><span class="tiktok-widget-title">Conversations Trend</span><div class="tiktok-widget-actions"><span style="font-size:11px;color:var(--gray-400);">Last 7 Days</span><button class="tiktok-widget-action-btn"><i class="ph ph-dots-three"></i></button></div></div><div class="tiktok-widget-body"><div id="conversations-trend-chart" style="height:200px;"></div></div></div></div>';

    // Top Video Interactions
    html += '<div class="tiktok-col-3"><div class="tiktok-widget-card"><div class="tiktok-widget-header"><span class="tiktok-widget-title">Top Video Interactions</span><div class="tiktok-widget-actions"><button class="tiktok-widget-action-btn" onclick="tiktokApp.navigateTo(&quot;video-interactions&quot;)">View All</button></div></div><div class="tiktok-widget-body">';
    videos.forEach(v => {
      html += '<div class="tiktok-video-item"><div class="tiktok-video-thumb" style="background:linear-gradient(135deg,#fe2c55,#25f4ee);"><i class="ph ph-video" style="color:white;"></i></div><div class="tiktok-video-info"><div class="tiktok-video-title">' + v.title + '</div><div class="tiktok-video-meta">' + v.views + ' views &middot; ' + v.date + '</div></div><div class="tiktok-video-stats"><span class="tiktok-video-stat"><i class="ph ph-heart"></i> ' + v.likes + '</span><span class="tiktok-video-stat"><i class="ph ph-chat-circle"></i> ' + v.comments + '</span></div></div>';
    });
    html += '</div></div></div>';

    // AI Recommendations
    html += '<div class="tiktok-col-3"><div class="tiktok-widget-card"><div class="tiktok-widget-header"><span class="tiktok-widget-title">AI Recommendations</span><span style="font-size:10px;background:var(--primary-100);color:var(--primary-700);padding:2px 6px;border-radius:var(--radius-full);font-weight:var(--font-semibold);">BETA</span></div><div class="tiktok-widget-body"><div class="tiktok-ai-list">';
    html += '<div class="tiktok-ai-item priority-high"><div class="tiktok-ai-icon"><i class="ph ph-warning"></i></div><div class="tiktok-ai-content"><div class="tiktok-ai-text"><strong>High Intent Conversations</strong></div><div class="tiktok-ai-meta">12 users showing purchase intent</div><div class="tiktok-ai-action"><button class="btn btn-primary btn-sm" onclick="tiktokApp.navigateTo(&quot;conversations&quot;)">Review</button></div></div></div>';
    html += '<div class="tiktok-ai-item priority-medium"><div class="tiktok-ai-icon"><i class="ph ph-lightning"></i></div><div class="tiktok-ai-content"><div class="tiktok-ai-text"><strong>Response Rate</strong></div><div class="tiktok-ai-meta">Your avg response time is 22 min (target: 15 min)</div><div class="tiktok-ai-action"><button class="btn btn-primary btn-sm">Optimize</button></div></div></div>';
    html += '<div class="tiktok-ai-item priority-low"><div class="tiktok-ai-icon"><i class="ph ph-users"></i></div><div class="tiktok-ai-content"><div class="tiktok-ai-text"><strong>Engagement Opportunity</strong></div><div class="tiktok-ai-meta">3 videos need responses</div><div class="tiktok-ai-action"><button class="btn btn-primary btn-sm" onclick="tiktokApp.navigateTo(&quot;comments&quot;)">Engage</button></div></div></div>';
    html += '<div class="tiktok-ai-item priority-low"><div class="tiktok-ai-icon"><i class="ph ph-trend-up"></i></div><div class="tiktok-ai-content"><div class="tiktok-ai-text"><strong>New Followers</strong></div><div class="tiktok-ai-meta">162 new followers this week</div><div class="tiktok-ai-action"><button class="btn btn-primary btn-sm">Welcome</button></div></div></div>';
    html += '</div><div style="text-align:center;margin-top:var(--space-4);"><a href="#" style="font-size:var(--text-xs);color:var(--primary-600);font-weight:var(--font-medium);">View All Insights</a></div></div></div></div>';

    // Recent Conversations
    html += '<div class="tiktok-col-4"><div class="tiktok-widget-card"><div class="tiktok-widget-header"><span class="tiktok-widget-title">Recent Conversations</span><div class="tiktok-widget-actions"><button class="tiktok-widget-action-btn" onclick="tiktokApp.navigateTo(&quot;conversations&quot;)"><i class="ph ph-arrow-right"></i></button></div></div><div class="tiktok-widget-body">';
    conversations.forEach(conv => {
      const timeAgo = this.formatTimeAgo(conv.timestamp);
      const unreadClass = conv.unread ? 'unread' : '';
      html += '<div class="conversation-item ' + unreadClass + '" style="cursor:pointer;" onclick="tiktokApp.navigateTo(&quot;conversations&quot;, ' + conv.id + ')"><div class="conversation-avatar" style="background:' + conv.customer.color + '">' + conv.customer.avatar + '<span class="conversation-platform-badge tiktok"><i class="ph ph-tiktok-logo"></i></span></div><div class="conversation-content"><div class="conversation-name ' + (conv.unread ? 'unread' : '') + '">' + conv.customer.name + '</div><div class="conversation-preview">' + conv.lastMessage + '</div></div><div class="conversation-meta"><span class="conversation-time">' + timeAgo + '</span>' + (conv.unread ? '<span class="conversation-badge priority-' + conv.priority + '">' + conv.priority + '</span>' : '') + '</div></div>';
    });
    html += '</div></div></div>';

    // Engagement Overview (Donut Chart)
    html += '<div class="tiktok-col-4"><div class="tiktok-widget-card"><div class="tiktok-widget-header"><span class="tiktok-widget-title">Engagement Overview</span></div><div class="tiktok-widget-body"><div style="display:flex;align-items:center;justify-content:center;gap:var(--space-6);"><div style="position:relative;width:140px;height:140px;"><svg viewBox="0 0 150 150" width="140" height="140" style="transform:rotate(-90deg);"><circle cx="75" cy="75" r="60" fill="none" stroke="var(--gray-100)" stroke-width="20"/><circle cx="75" cy="75" r="60" fill="none" stroke="#fe2c55" stroke-width="20" stroke-dasharray="283" stroke-dashoffset="70" stroke-linecap="round"/><circle cx="75" cy="75" r="60" fill="none" stroke="#25f4ee" stroke-width="20" stroke-dasharray="283" stroke-dashoffset="200" stroke-linecap="round" style="opacity:0.6"/></svg><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;"><div style="font-size:var(--text-xl);font-weight:var(--font-bold);color:var(--gray-900);">1,248</div><div style="font-size:var(--text-xs);color:var(--gray-500);">Total</div></div></div><div style="display:flex;flex-direction:column;gap:var(--space-3);">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);"><span style="width:8px;height:8px;border-radius:var(--radius-full);background:#fe2c55;"></span><span style="color:var(--gray-600);flex:1;">Direct Messages</span><span style="font-weight:var(--font-semibold);color:var(--gray-800);">40%</span></div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);"><span style="width:8px;height:8px;border-radius:var(--radius-full);background:#25f4ee;"></span><span style="color:var(--gray-600);flex:1;">Comments</span><span style="font-weight:var(--font-semibold);color:var(--gray-800);">28%</span></div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);"><span style="width:8px;height:8px;border-radius:var(--radius-full);background:#f59e0b;"></span><span style="color:var(--gray-600);flex:1;">Mentions</span><span style="font-weight:var(--font-semibold);color:var(--gray-800);">18%</span></div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);"><span style="width:8px;height:8px;border-radius:var(--radius-full);background:#8b5cf6;"></span><span style="color:var(--gray-600);flex:1;">Video Interactions</span><span style="font-weight:var(--font-semibold);color:var(--gray-800);">12%</span></div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);"><span style="width:8px;height:8px;border-radius:var(--radius-full);background:#10b981;"></span><span style="color:var(--gray-600);flex:1;">Shares</span><span style="font-weight:var(--font-semibold);color:var(--gray-800);">5%</span></div>';
    html += '</div></div></div></div></div>';

    // Account Status
    html += '<div class="tiktok-col-4"><div class="tiktok-widget-card"><div class="tiktok-widget-header"><span class="tiktok-widget-title">Account Status</span><span class="tiktok-account-badge connected"><i class="ph ph-check-circle"></i> Connected</span></div><div class="tiktok-widget-body"><div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);"><div style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--tiktok-black);display:flex;align-items:center;justify-content:center;color:white;font-size:var(--text-xl);"><i class="ph ph-tiktok-logo"></i></div><div><div style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--gray-900);">' + integration.accountName + '</div><div style="font-size:var(--text-xs);color:var(--gray-500);">Connected on ' + integration.connectedDate + '</div></div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3);text-align:center;"><div><div style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--gray-900);">' + integration.followers + '</div><div style="font-size:10px;color:var(--gray-500);">Followers</div></div><div><div style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--gray-900);">' + integration.following + '</div><div style="font-size:10px;color:var(--gray-500);">Following</div></div><div><div style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--gray-900);">' + integration.likes + '</div><div style="font-size:10px;color:var(--gray-500);">Likes</div></div></div><div style="margin-top:var(--space-4);"><div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--gray-500);margin-bottom:var(--space-2);"><span>Connection Health</span><span>' + integration.health + '%</span></div><div style="height:6px;background:var(--gray-200);border-radius:var(--radius-full);overflow:hidden;"><div style="height:100%;width:' + integration.health + '%;border-radius:var(--radius-full);background:linear-gradient(90deg,var(--success-500),var(--success-400));transition:width var(--transition-slow);"></div></div></div></div></div></div>';

    html += '</div>';
    container.innerHTML = html;
    this.renderLineChart('conversations-trend-chart');
  }

  renderLineChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const days = ['May 22', 'May 23', 'May 24', 'May 25', 'May 26', 'May 27', 'May 28'];
    const conversations = [35, 42, 55, 48, 62, 58, 89];
    const responses = [30, 38, 50, 45, 55, 52, 78];
    const width = container.clientWidth || 500;
    const height = 200;
    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...conversations, ...responses);

    let svgHtml = '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" height="100%">';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxValue * (1 - i / 4));
      svgHtml += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="var(--gray-200)" stroke-dasharray="4" stroke-width="1"/>';
      svgHtml += '<text x="' + (padding.left - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="10" fill="var(--gray-400)">' + val + '</text>';
    }
    const stepX = chartWidth / (days.length - 1);
    days.forEach((d, i) => {
      const x = padding.left + i * stepX;
      svgHtml += '<text x="' + x + '" y="' + (height - 8) + '" text-anchor="middle" font-size="10" fill="var(--gray-400)">' + d + '</text>';
    });

    let convPath = '';
    conversations.forEach((val, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
      convPath += (i === 0 ? 'M' : 'L') + ' ' + x + ' ' + y;
    });
    svgHtml += '<path d="' + convPath + '" fill="none" stroke="#fe2c55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';

    let respPath = '';
    responses.forEach((val, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
      respPath += (i === 0 ? 'M' : 'L') + ' ' + x + ' ' + y;
    });
    svgHtml += '<path d="' + respPath + '" fill="none" stroke="#25f4ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>';

    conversations.forEach((val, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
      svgHtml += '<circle cx="' + x + '" cy="' + y + '" r="3" fill="#fe2c55" stroke="white" stroke-width="2"/>';
    });

    svgHtml += '</svg>';
    container.innerHTML = svgHtml;
  }

  // ============================================
  // Conversations Page
  // ============================================
  renderConversations(container) {
    const conversations = this.storage.getConversations(this.currentFilter);
    const filteredConversations = this.currentSearch
      ? conversations.filter(c => c.customer.name.toLowerCase().includes(this.currentSearch.toLowerCase()) || c.lastMessage.toLowerCase().includes(this.currentSearch.toLowerCase()))
      : conversations;

    const stats = this.storage.getStats();

    let html = '<div class="tiktok-conversations-layout">';

    // Sidebar
    html += '<div class="tiktok-conversations-sidebar"><div class="tiktok-conversations-header"><div class="tiktok-conversations-title">TikTok Conversations</div><div class="tiktok-conversations-search"><i class="ph ph-magnifying-glass"></i><input type="text" id="conv-search" placeholder="Search conversations..." value="' + this.currentSearch + '"></div></div>';
    html += '<div class="tiktok-conversations-filters">';
    html += '<button class="tiktok-filter-chip ' + (this.currentFilter === 'all' ? 'active' : '') + '" data-filter="all">All <span class="badge-count">' + stats.totalConversations + '</span></button>';
    html += '<button class="tiktok-filter-chip ' + (this.currentFilter === 'unread' ? 'active' : '') + '" data-filter="unread">Unread <span class="badge-count">' + stats.unreadMessages + '</span></button>';
    html += '<button class="tiktok-filter-chip ' + (this.currentFilter === 'assigned' ? 'active' : '') + '" data-filter="assigned">Assigned to me</button>';
    html += '<button class="tiktok-filter-chip">More Filters <i class="ph ph-caret-down"></i></button>';
    html += '<button class="tiktok-filter-chip">Newest <i class="ph ph-caret-down"></i></button>';
    html += '</div>';

    html += '<div class="tiktok-conversations-list">';
    if (filteredConversations.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon"><i class="ph ph-chat-circle-text"></i></div><div class="empty-state-title">No conversations</div><div class="empty-state-desc">No conversations match your current filter.</div></div>';
    } else {
      filteredConversations.forEach(conv => {
        const timeAgo = this.formatTimeAgo(conv.timestamp);
        const isActive = this.selectedConversation === conv.id;
        const activeClass = isActive ? 'active' : '';
        const unreadClass = conv.unread ? 'unread' : '';
        html += '<div class="tiktok-conversation-item ' + activeClass + ' ' + unreadClass + '" data-id="' + conv.id + '"><div class="tiktok-conversation-avatar" style="background:' + conv.customer.color + '">' + conv.customer.avatar + '<span class="status-dot ' + conv.customer.status + '"></span></div><div class="tiktok-conversation-content"><div class="tiktok-conversation-name">' + conv.customer.name + (conv.unread ? '<span class="unread-dot"></span>' : '') + '</div><div class="tiktok-conversation-preview">' + conv.lastMessage + '</div></div><div class="tiktok-conversation-meta"><span class="tiktok-conversation-time">' + timeAgo + '</span><span class="tiktok-conversation-badge priority-' + conv.priority + '">' + conv.priority + '</span></div></div>';
      });
    }
    html += '</div></div>';

    // Chat Area
    if (this.selectedConversation) {
      const conv = this.storage.getConversation(this.selectedConversation);
      const messages = this.storage.getMessages(this.selectedConversation);
      const customer = conv.customer;

      html += '<div class="tiktok-chat-area"><div class="tiktok-chat-header"><div class="tiktok-chat-header-left"><div class="conversation-avatar" style="background:' + customer.color + ';width:40px;height:40px;">' + customer.avatar + '</div><div class="tiktok-chat-header-info"><h3>' + customer.name + '</h3><p>' + customer.handle + ' &middot; ' + (customer.status === 'online' ? 'Online' : 'Offline') + '</p></div></div><div class="tiktok-chat-header-actions"><button class="tiktok-chat-header-btn" title="View Profile"><i class="ph ph-user"></i></button><button class="tiktok-chat-header-btn" title="More"><i class="ph ph-dots-three-vertical"></i></button></div></div>';

      // AI Reply Suggestions
      html += '<div class="tiktok-ai-replies"><span class="tiktok-ai-reply-chip" onclick="tiktokApp.useAIReply(&quot;Shipping to Canada is $7.99 and free on orders over $100 🎉&quot;)"><i class="ph ph-sparkle"></i> Shipping Info</span><span class="tiktok-ai-reply-chip" onclick="tiktokApp.useAIReply(&quot;Let me check the order status for you&quot;)"><i class="ph ph-sparkle"></i> Order Status</span><span class="tiktok-ai-reply-chip" onclick="tiktokApp.useAIReply(&quot;Thank you for your message!&quot;)"><i class="ph ph-sparkle"></i> Thank You</span></div>';

      // Messages
      html += '<div class="tiktok-chat-messages" id="chat-messages">';
      messages.forEach(msg => {
        const msgTime = this.formatTimeAgo(msg.time);
        html += '<div class="tiktok-message ' + msg.sender + '"><div class="tiktok-message-avatar" style="background:' + (msg.sender === 'agent' ? 'var(--primary-500)' : customer.color) + '">' + (msg.sender === 'agent' ? 'AM' : customer.avatar) + '</div><div><div class="tiktok-message-bubble">' + msg.text + '</div><div class="tiktok-message-time">' + msgTime + '</div></div></div>';
      });
      html += '</div>';

      // Input
      html += '<div class="tiktok-chat-input-area"><div class="tiktok-chat-input-wrapper"><button class="tiktok-chat-input-btn"><i class="ph ph-paperclip"></i></button><input type="text" id="chat-input" placeholder="Type your message..." onkeypress="if(event.key===&quot;Enter&quot;)tiktokApp.sendMessage()"><button class="tiktok-chat-input-btn"><i class="ph ph-smiley"></i></button></div><button class="tiktok-chat-send-btn" onclick="tiktokApp.sendMessage()"><i class="ph ph-paper-plane-right"></i></button></div></div>';

      // Profile Panel
      html += '<div class="tiktok-profile-panel"><div class="tiktok-profile-header"><div class="tiktok-profile-avatar" style="background:' + customer.color + '">' + customer.avatar + '</div><div class="tiktok-profile-name">' + customer.name + '</div><div class="tiktok-profile-handle">' + customer.handle + '</div><button class="tiktok-profile-view-btn">View Profile</button></div>';

      html += '<div class="tiktok-profile-section"><div class="tiktok-profile-section-title">CRM Information</div><div class="tiktok-profile-info-row"><span class="tiktok-profile-info-label">Lead Score</span><span class="tiktok-profile-info-value">' + customer.leadScore + '/100</span></div><div class="tiktok-profile-info-row"><span class="tiktok-profile-info-label">Customer Status</span><span class="tiktok-profile-info-value status-' + (customer.customerStatus === 'Active' ? 'active' : 'inactive') + '">' + customer.customerStatus + '</span></div><div class="tiktok-profile-info-row"><span class="tiktok-profile-info-label">Total Orders</span><span class="tiktok-profile-info-value">' + customer.totalOrders + '</span></div><div class="tiktok-profile-info-row"><span class="tiktok-profile-info-label">Total Spent</span><span class="tiktok-profile-info-value">$' + customer.totalSpent.toFixed(2) + '</span></div></div>';

      html += '<div class="tiktok-profile-section"><div class="tiktok-profile-section-title">Labels</div><div class="tiktok-profile-tags">';
      customer.tags.forEach(tag => {
        const tagClass = tag.includes('VIP') ? 'vip' : (tag.includes('New') ? 'new' : 'returning');
        html += '<span class="tiktok-profile-tag ' + tagClass + '">' + tag + '</span>';
      });
      html += '<button class="tiktok-profile-add-tag">+ Add Label</button></div></div>';

      html += '<div class="tiktok-profile-section"><div class="tiktok-profile-section-title">Notes</div><div class="tiktok-profile-notes"><textarea placeholder="Add a note about this customer...">Interested in new summer collection.</textarea></div></div>';

      html += '<div class="tiktok-profile-section"><div class="tiktok-profile-section-title">Recent Orders</div><div class="tiktok-profile-orders"><div class="tiktok-profile-order-thumb" style="background:linear-gradient(135deg,#fe2c55,#25f4ee);"><i class="ph ph-tshirt" style="color:white;font-size:20px;"></i></div><div class="tiktok-profile-order-thumb" style="background:linear-gradient(135deg,#8b5cf6,#6366f1);"><i class="ph ph-sneaker" style="color:white;font-size:20px;"></i></div><div class="tiktok-profile-order-thumb" style="background:linear-gradient(135deg,#f59e0b,#eab308);"><i class="ph ph-bag" style="color:white;font-size:20px;"></i></div></div><div style="text-align:right;margin-top:var(--space-2);"><a href="#" style="font-size:var(--text-xs);color:var(--primary-600);">View All Orders</a></div></div>';

      html += '</div>';
    } else {
      html += '<div class="tiktok-chat-area" style="display:flex;align-items:center;justify-content:center;"><div class="empty-state"><div class="empty-state-icon"><i class="ph ph-chat-circle-text"></i></div><div class="empty-state-title">Select a conversation</div><div class="empty-state-desc">Choose a conversation from the list to start chatting.</div></div></div>';
    }

    html += '</div>';
    container.innerHTML = html;

    // Bind conversation clicks
    document.querySelectorAll('.tiktok-conversation-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        this.selectedConversation = id;
        this.storage.markConversationRead(id);
        this.renderConversations(container);
      });
    });

    // Bind filter clicks
    document.querySelectorAll('.tiktok-filter-chip[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        this.currentFilter = chip.dataset.filter;
        this.renderConversations(container);
      });
    });

    // Scroll to bottom of messages
    const msgContainer = document.getElementById('chat-messages');
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim() || !this.selectedConversation) return;
    this.storage.addMessage(this.selectedConversation, { sender: 'agent', text: input.value.trim() });
    input.value = '';
    this.renderConversations(document.getElementById('tiktok-content'));
    OP.toast.show('Message sent', 'success');
  }

  useAIReply(text) {
    const input = document.getElementById('chat-input');
    if (input) input.value = text;
  }

  // ============================================
  // Comments Page
  // ============================================
  renderComments(container) {
    const comments = this.storage.getComments(this.currentFilter);
    const stats = this.storage.getStats();

    let html = '<div class="dashboard-page-title"><h1>Comments Manager</h1><p>Manage and respond to TikTok comments</p></div>';

    html += '<div class="filter-bar">';
    html += '<button class="filter-btn ' + (this.currentFilter === 'all' ? 'active' : '') + '" data-filter="all">All</button>';
    html += '<button class="filter-btn ' + (this.currentFilter === 'unread' ? 'active' : '') + '" data-filter="unread">Unread <span class="badge-count">' + stats.unreadComments + '</span></button>';
    html += '<button class="filter-btn ' + (this.currentFilter === 'replied' ? 'active' : '') + '" data-filter="replied">Replied</button>';
    html += '<button class="filter-btn ' + (this.currentFilter === 'high' ? 'active' : '') + '" data-filter="high">High Priority</button>';
    html += '<button class="filter-btn">More Filters <i class="ph ph-caret-down"></i></button>';
    html += '<button class="filter-btn">Newest <i class="ph ph-caret-down"></i></button>';
    html += '</div>';

    html += '<div class="tiktok-widget-card"><div class="tiktok-widget-body"><div class="tiktok-comments-list">';
    if (comments.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon"><i class="ph ph-chat-teardrop-text"></i></div><div class="empty-state-title">No comments</div><div class="empty-state-desc">No comments match your current filter.</div></div>';
    } else {
      comments.forEach(comment => {
        const timeAgo = this.formatTimeAgo(comment.time);
        html += '<div class="tiktok-comment-item"><div class="tiktok-comment-avatar" style="background:' + comment.authorColor + '">' + comment.authorAvatar + '</div><div class="tiktok-comment-content"><div class="tiktok-comment-header"><span class="tiktok-comment-author">' + comment.author + '</span><span class="tiktok-comment-handle">' + comment.authorHandle + '</span><span class="tiktok-comment-time">' + timeAgo + '</span></div><div class="tiktok-comment-text">' + comment.text + '</div><div class="tiktok-comment-video"><i class="ph ph-video"></i> On: ' + comment.videoTitle + '</div><div class="tiktok-comment-actions">';
        if (comment.status === 'unread') {
          html += '<button class="tiktok-comment-action-btn primary" onclick="tiktokApp.replyToComment(' + comment.id + ')"><i class="ph ph-arrow-u-up-left"></i> Use Reply</button>';
        }
        html += '<button class="tiktok-comment-action-btn"><i class="ph ph-heart"></i> Like</button><button class="tiktok-comment-action-btn"><i class="ph ph-share-network"></i> Share</button><div class="tiktok-comment-priority"><span class="tiktok-comment-priority-badge priority-' + comment.priority + '">' + comment.priority + '</span></div></div>';
        if (comment.aiReply && comment.status === 'unread') {
          html += '<div class="tiktok-ai-suggested-reply"><div class="tiktok-ai-suggested-reply-label"><i class="ph ph-sparkle"></i> AI Suggested Reply</div><div class="tiktok-ai-suggested-reply-text">' + comment.aiReply + '</div><div class="tiktok-ai-suggested-reply-actions"><button class="btn btn-primary btn-sm" onclick="tiktokApp.useAICommentReply(' + comment.id + ', ' + JSON.stringify(comment.aiReply) + ')"><i class="ph ph-sparkle"></i> Use Reply</button><button class="btn btn-ghost btn-sm">Edit</button></div></div>';
        }
        html += '</div></div>';
      });
    }
    html += '</div></div></div>';

    // Pagination
    html += '<div class="tiktok-pagination"><button class="tiktok-pagination-btn" disabled><i class="ph ph-caret-left"></i></button><button class="tiktok-pagination-btn active">1</button><button class="tiktok-pagination-btn">2</button><button class="tiktok-pagination-btn">3</button><button class="tiktok-pagination-btn">4</button><button class="tiktok-pagination-btn">5</button><button class="tiktok-pagination-btn"><i class="ph ph-caret-right"></i></button><span class="tiktok-pagination-info">Showing 1 to 10 of 89 comments</span></div>';

    container.innerHTML = html;

    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        this.renderComments(container);
      });
    });
  }

  replyToComment(commentId) {
    this.storage.updateComment(commentId, { status: 'replied' });
    OP.toast.show('Comment marked as replied', 'success');
    this.renderComments(document.getElementById('tiktok-content'));
  }

  useAICommentReply(commentId, text) {
    this.storage.updateComment(commentId, { status: 'replied' });
    OP.toast.show('AI reply sent: ' + text, 'success');
    this.renderComments(document.getElementById('tiktok-content'));
  }

  // ============================================
  // Mentions Page
  // ============================================
  renderMentions(container) {
    const mentions = this.storage.getMentions(this.currentFilter);
    const stats = this.storage.getStats();

    let html = '<div class="dashboard-page-title"><h1>Mentions</h1><p>Track and respond to TikTok mentions</p></div>';

    html += '<div class="filter-bar">';
    html += '<button class="filter-btn ' + (this.currentFilter === 'all' ? 'active' : '') + '" data-filter="all">All</button>';
    html += '<button class="filter-btn ' + (this.currentFilter === 'unread' ? 'active' : '') + '" data-filter="unread">Unread <span class="badge-count">' + stats.unreadMentions + '</span></button>';
    html += '<button class="filter-btn ' + (this.currentFilter === 'read' ? 'active' : '') + '" data-filter="read">Read</button>';
    html += '<button class="filter-btn">More Filters <i class="ph ph-caret-down"></i></button>';
    html += '<button class="filter-btn">Newest <i class="ph ph-caret-down"></i></button>';
    html += '</div>';

    html += '<div class="tiktok-widget-card"><div class="tiktok-widget-body"><div class="tiktok-comments-list">';
    if (mentions.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon"><i class="ph ph-at"></i></div><div class="empty-state-title">No mentions</div><div class="empty-state-desc">No mentions match your current filter.</div></div>';
    } else {
      mentions.forEach(mention => {
        const timeAgo = this.formatTimeAgo(mention.time);
        const textWithHighlight = mention.text.replace('@acmesolutions', '<span class="mention-highlight">@acmesolutions</span>');
        html += '<div class="tiktok-mention-item"><div class="tiktok-comment-avatar" style="background:' + mention.authorColor + '">' + mention.authorAvatar + '</div><div class="tiktok-mention-details"><div class="tiktok-mention-header"><span class="tiktok-mention-author">' + mention.author + '</span><span class="tiktok-mention-handle">' + mention.authorHandle + '</span><span class="tiktok-mention-time">' + timeAgo + '</span></div><div class="tiktok-mention-text">' + textWithHighlight + '</div><div class="tiktok-mention-video"><i class="ph ph-video"></i> On: ' + mention.videoTitle + '</div><div class="tiktok-mention-actions"><button class="tiktok-comment-action-btn primary" onclick="tiktokApp.replyToMention(' + mention.id + ')"><i class="ph ph-arrow-u-up-left"></i> Reply</button><button class="tiktok-comment-action-btn"><i class="ph ph-heart"></i> Like (' + mention.likes + ')</button><button class="tiktok-comment-action-btn"><i class="ph ph-share-network"></i> Share</button><button class="tiktok-comment-action-btn" onclick="tiktokApp.viewMentionProfile(' + mention.id + ')"><i class="ph ph-user"></i> View Profile</button></div></div></div>';
      });
    }
    html += '</div></div></div>';

    // Pagination
    html += '<div class="tiktok-pagination"><button class="tiktok-pagination-btn" disabled><i class="ph ph-caret-left"></i></button><button class="tiktok-pagination-btn active">1</button><button class="tiktok-pagination-btn">2</button><button class="tiktok-pagination-btn">3</button><button class="tiktok-pagination-btn">4</button><button class="tiktok-pagination-btn"><i class="ph ph-caret-right"></i></button><span class="tiktok-pagination-info">Showing 1 to 10 of 34 mentions</span></div>';

    container.innerHTML = html;

    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        this.renderMentions(container);
      });
    });
  }

  replyToMention(mentionId) {
    this.storage.updateMention(mentionId, { status: 'read' });
    OP.toast.show('Reply sent to mention', 'success');
    this.renderMentions(document.getElementById('tiktok-content'));
  }

  viewMentionProfile(mentionId) {
    const mention = this.storage.getMentions().find(m => m.id === mentionId);
    OP.toast.show('Viewing profile of ' + mention.author, 'info');
  }

  // ============================================
  // Video Interactions Page
  // ============================================
  renderVideoInteractions(container) {
    const videos = this.storage.getVideos();

    let html = '<div class="dashboard-page-title"><h1>Video Interactions</h1><p>Monitor engagement across your TikTok videos</p></div>';

    html += '<div class="tiktok-video-interactions-grid">';
    videos.forEach(video => {
      html += '<div class="tiktok-video-interaction-card"><div class="tiktok-video-interaction-thumb" style="background:linear-gradient(135deg,#fe2c55,#25f4ee);"><i class="ph ph-video" style="color:white;font-size:48px;"></i><div class="tiktok-video-interaction-overlay"><div class="tiktok-video-interaction-title">' + video.title + '</div><div class="tiktok-video-interaction-meta">' + video.date + '</div></div></div><div class="tiktok-video-interaction-body"><div class="tiktok-video-interaction-stats"><div class="tiktok-video-interaction-stat"><div class="tiktok-video-interaction-stat-value">' + video.views + '</div><div class="tiktok-video-interaction-stat-label">Views</div></div><div class="tiktok-video-interaction-stat"><div class="tiktok-video-interaction-stat-value">' + video.likes + '</div><div class="tiktok-video-interaction-stat-label">Likes</div></div><div class="tiktok-video-interaction-stat"><div class="tiktok-video-interaction-stat-value">' + video.comments + '</div><div class="tiktok-video-interaction-stat-label">Comments</div></div><div class="tiktok-video-interaction-stat"><div class="tiktok-video-interaction-stat-value">' + video.shares + '</div><div class="tiktok-video-interaction-stat-label">Shares</div></div></div></div></div>';
    });
    html += '</div>';

    container.innerHTML = html;
  }

  // ============================================
  // Integration Page
  // ============================================
  renderIntegration(container) {
    const integration = this.storage.getIntegration();
    const permissions = integration.permissions || {};

    let html = '<div class="dashboard-page-title"><h1>TikTok Integration</h1><p>Manage your TikTok account connection</p></div>';

    html += '<div class="tiktok-integration-card"><div class="tiktok-integration-header"><div class="tiktok-integration-icon"><i class="ph ph-tiktok-logo"></i></div><div class="tiktok-integration-title">TikTok Business Account</div><div class="tiktok-integration-subtitle">Connected as ' + integration.accountName + '</div></div>';

    html += '<div class="tiktok-integration-status ' + (integration.connected ? 'connected' : 'disconnected') + '"><i class="ph ph-' + (integration.connected ? 'check-circle' : 'x-circle') + '"></i><span>' + (integration.connected ? 'Connected on ' + integration.connectedDate : 'Disconnected') + '</span></div>';

    html += '<div class="tiktok-integration-permissions"><div class="tiktok-widget-title" style="margin-bottom:var(--space-4);">Permissions</div>';
    const permList = [
      { key: 'readMessages', label: 'Read Messages', desc: 'Access to direct messages' },
      { key: 'readComments', label: 'Read Comments', desc: 'Access to video comments' },
      { key: 'readMentions', label: 'Read Mentions', desc: 'Access to mentions' },
      { key: 'readVideoInteractions', label: 'Read Video Interactions', desc: 'Access to video analytics' },
      { key: 'sendMessages', label: 'Send Messages', desc: 'Send direct messages' },
      { key: 'manageReplies', label: 'Manage Replies', desc: 'Reply to comments and messages' }
    ];
    permList.forEach(perm => {
      const isAllowed = permissions[perm.key];
      html += '<div class="tiktok-integration-permission-item"><div class="tiktok-integration-permission-info"><div class="tiktok-integration-permission-icon"><i class="ph ph-' + (isAllowed ? 'check' : 'x') + '"></i></div><div><div class="tiktok-integration-permission-text"><strong>' + perm.label + '</strong></div><div class="tiktok-integration-permission-text" style="font-size:var(--text-xs);color:var(--gray-500);">' + perm.desc + '</div></div></div><span class="tiktok-integration-permission-status ' + (isAllowed ? 'allowed' : 'denied') + '">' + (isAllowed ? 'Allowed' : 'Denied') + '</span></div>';
    });
    html += '</div>';

    html += '<div class="tiktok-integration-actions"><button class="btn btn-primary" onclick="tiktokApp.syncIntegration()"><i class="ph ph-arrows-clockwise"></i> Sync Now</button><button class="btn btn-outline" onclick="tiktokApp.disconnectIntegration()" style="color:var(--error-600);border-color:var(--error-300);"><i class="ph ph-plugs"></i> Disconnect</button></div></div>';

    container.innerHTML = html;
  }

  syncIntegration() {
    OP.loading.show();
    setTimeout(() => {
      OP.loading.hide();
      OP.toast.show('TikTok integration synced successfully', 'success');
      const integration = this.storage.getIntegration();
      integration.health = 100;
      this.storage.updateIntegration(integration);
      this.renderIntegration(document.getElementById('tiktok-content'));
    }, 1500);
  }

  disconnectIntegration() {
    if (confirm('Are you sure you want to disconnect TikTok?')) {
      this.storage.updateIntegration({ connected: false });
      OP.toast.show('TikTok disconnected', 'warning');
      this.renderIntegration(document.getElementById('tiktok-content'));
    }
  }

  // ============================================
  // Settings Page
  // ============================================
  renderSettings(container) {
    const settings = this.storage.getSettings();
    const general = settings.general || {};
    const notifications = settings.notifications || {};
    const autoReplies = settings.autoReplies || {};
    const savedReplies = settings.savedReplies || [];
    const labels = settings.labels || [];
    const teamMembers = settings.teamMembers || [];

    let html = '<div class="dashboard-page-title"><h1>TikTok Settings</h1><p>Configure your TikTok module preferences</p></div>';

    html += '<div class="tiktok-settings-layout">';

    // Settings Nav
    html += '<div class="tiktok-settings-nav">';
    html += '<a href="#general" class="tiktok-settings-nav-item active" onclick="tiktokApp.showSettingsSection(&quot;general&quot;, this);return false;"><i class="ph ph-gear"></i> General</a>';
    html += '<a href="#notifications" class="tiktok-settings-nav-item" onclick="tiktokApp.showSettingsSection(&quot;notifications&quot;, this);return false;"><i class="ph ph-bell"></i> Notifications</a>';
    html += '<a href="#auto-replies" class="tiktok-settings-nav-item" onclick="tiktokApp.showSettingsSection(&quot;auto-replies&quot;, this);return false;"><i class="ph ph-robot"></i> Auto Replies</a>';
    html += '<a href="#saved-replies" class="tiktok-settings-nav-item" onclick="tiktokApp.showSettingsSection(&quot;saved-replies&quot;, this);return false;"><i class="ph ph-chat-circle-text"></i> Saved Replies</a>';
    html += '<a href="#labels" class="tiktok-settings-nav-item" onclick="tiktokApp.showSettingsSection(&quot;labels&quot;, this);return false;"><i class="ph ph-tag"></i> Labels</a>';
    html += '<a href="#team" class="tiktok-settings-nav-item" onclick="tiktokApp.showSettingsSection(&quot;team&quot;, this);return false;"><i class="ph ph-users"></i> Team Members</a>';
    html += '<a href="#security" class="tiktok-settings-nav-item" onclick="tiktokApp.showSettingsSection(&quot;security&quot;, this);return false;"><i class="ph ph-shield"></i> Security</a>';
    html += '</div>';

    // Settings Content
    html += '<div class="tiktok-settings-content">';

    // General Section
    html += '<div id="settings-general" class="tiktok-settings-section">';
    html += '<div class="tiktok-settings-section-title">General Settings</div>';
    html += '<div class="tiktok-settings-section-desc">Configure basic TikTok module settings</div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Default Response Time</div><div class="tiktok-setting-desc">Set the target response time for conversations</div></div><select class="tiktok-select" id="setting-response-time"><option ' + (general.defaultResponseTime === '15 minutes' ? 'selected' : '') + '>15 minutes</option><option ' + (general.defaultResponseTime === '30 minutes' ? 'selected' : '') + '>30 minutes</option><option ' + (general.defaultResponseTime === '1 Hour' ? 'selected' : '') + '>1 Hour</option><option ' + (general.defaultResponseTime === '2 Hours' ? 'selected' : '') + '>2 Hours</option></select></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Timezone</div><div class="tiktok-setting-desc">Set your local timezone</div></div><select class="tiktok-select" id="setting-timezone"><option ' + (general.timezone === '(GMT-05:00) Eastern Time (US & Canada)' ? 'selected' : '') + '>(GMT-05:00) Eastern Time (US & Canada)</option><option>(GMT-08:00) Pacific Time (US & Canada)</option><option>(GMT+00:00) London</option><option>(GMT+01:00) Berlin</option></select></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Auto Mark as Read</div><div class="tiktok-setting-desc">Automatically mark messages as read when opened</div></div><div class="tiktok-toggle ' + (general.autoMarkAsRead ? 'active' : '') + '" id="toggle-auto-read" onclick="tiktokApp.toggleSetting(&quot;general&quot;, &quot;autoMarkAsRead&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Enable AI Suggestions</div><div class="tiktok-setting-desc">Show AI-powered reply suggestions</div></div><div class="tiktok-toggle ' + (general.enableAI ? 'active' : '') + '" id="toggle-ai" onclick="tiktokApp.toggleSetting(&quot;general&quot;, &quot;enableAI&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Show Typing Indicator</div><div class="tiktok-setting-desc">Display typing indicator to customers</div></div><div class="tiktok-toggle ' + (general.showTypingIndicator ? 'active' : '') + '" id="toggle-typing" onclick="tiktokApp.toggleSetting(&quot;general&quot;, &quot;showTypingIndicator&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '</div>';

    // Notifications Section
    html += '<div id="settings-notifications" class="tiktok-settings-section" style="display:none;">';
    html += '<div class="tiktok-settings-section-title">Notifications</div>';
    html += '<div class="tiktok-settings-section-desc">Choose which notifications you want to receive</div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">New Messages</div><div class="tiktok-setting-desc">Get notified when you receive new messages</div></div><div class="tiktok-toggle ' + (notifications.newMessages ? 'active' : '') + '" onclick="tiktokApp.toggleSetting(&quot;notifications&quot;, &quot;newMessages&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">New Comments</div><div class="tiktok-setting-desc">Get notified about new comments</div></div><div class="tiktok-toggle ' + (notifications.newComments ? 'active' : '') + '" onclick="tiktokApp.toggleSetting(&quot;notifications&quot;, &quot;newComments&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">New Mentions</div><div class="tiktok-setting-desc">Get notified when mentioned</div></div><div class="tiktok-toggle ' + (notifications.newMentions ? 'active' : '') + '" onclick="tiktokApp.toggleSetting(&quot;notifications&quot;, &quot;newMentions&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">New Followers</div><div class="tiktok-setting-desc">Get notified about new followers</div></div><div class="tiktok-toggle ' + (notifications.newFollowers ? 'active' : '') + '" onclick="tiktokApp.toggleSetting(&quot;notifications&quot;, &quot;newFollowers&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Email Notifications</div><div class="tiktok-setting-desc">Receive email notifications</div></div><div class="tiktok-toggle ' + (notifications.emailNotifications ? 'active' : '') + '" onclick="tiktokApp.toggleSetting(&quot;notifications&quot;, &quot;emailNotifications&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Push Notifications</div><div class="tiktok-setting-desc">Receive browser push notifications</div></div><div class="tiktok-toggle ' + (notifications.pushNotifications ? 'active' : '') + '" onclick="tiktokApp.toggleSetting(&quot;notifications&quot;, &quot;pushNotifications&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '</div>';

    // Auto Replies Section
    html += '<div id="settings-auto-replies" class="tiktok-settings-section" style="display:none;">';
    html += '<div class="tiktok-settings-section-title">Auto Replies</div>';
    html += '<div class="tiktok-settings-section-desc">Configure automatic responses</div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Enable Auto Replies</div><div class="tiktok-setting-desc">Automatically send replies when unavailable</div></div><div class="tiktok-toggle ' + (autoReplies.enabled ? 'active' : '') + '" onclick="tiktokApp.toggleSetting(&quot;autoReplies&quot;, &quot;enabled&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="form-group" style="margin-top:var(--space-4);"><label class="form-label">Welcome Message</label><textarea class="form-input" rows="3" id="welcome-msg">' + (autoReplies.welcomeMessage || '') + '</textarea></div>';

    html += '<div class="form-group"><label class="form-label">Away Message</label><textarea class="form-input" rows="3" id="away-msg">' + (autoReplies.awayMessage || '') + '</textarea></div>';

    html += '</div>';

    // Saved Replies Section
    html += '<div id="settings-saved-replies" class="tiktok-settings-section" style="display:none;">';
    html += '<div class="tiktok-settings-section-title">Saved Replies</div>';
    html += '<div class="tiktok-settings-section-desc">Manage your quick reply templates</div>';
    html += '<button class="btn btn-primary" style="margin-bottom:var(--space-4);" onclick="tiktokApp.addSavedReply()"><i class="ph ph-plus"></i> New Reply</button>';

    html += '<div class="tiktok-saved-replies-list">';
    savedReplies.forEach(reply => {
      html += '<div class="tiktok-saved-reply-item"><div class="tiktok-saved-reply-icon"><i class="ph ph-chat-circle-text"></i></div><div class="tiktok-saved-reply-content"><div class="tiktok-saved-reply-title">' + reply.title + '</div><div class="tiktok-saved-reply-text">' + reply.text + '</div><div class="tiktok-saved-reply-meta"><span>' + reply.category + '</span><span>Used ' + reply.usageCount + ' times</span></div></div><div class="tiktok-saved-reply-actions"><button class="tiktok-saved-reply-action-btn" title="Edit"><i class="ph ph-pencil-simple"></i></button><button class="tiktok-saved-reply-action-btn" title="Delete"><i class="ph ph-trash"></i></button></div></div>';
    });
    html += '</div></div>';

    // Labels Section
    html += '<div id="settings-labels" class="tiktok-settings-section" style="display:none;">';
    html += '<div class="tiktok-settings-section-title">Labels</div>';
    html += '<div class="tiktok-settings-section-desc">Manage conversation labels</div>';
    html += '<button class="btn btn-primary" style="margin-bottom:var(--space-4);" onclick="tiktokApp.addLabel()"><i class="ph ph-plus"></i> Add Label</button>';

    html += '<div class="tiktok-profile-tags">';
    labels.forEach(label => {
      html += '<span class="tiktok-profile-tag" style="background:' + label.color + '20;color:' + label.color + ';">' + label.name + '</span>';
    });
    html += '</div></div>';

    // Team Members Section
    html += '<div id="settings-team" class="tiktok-settings-section" style="display:none;">';
    html += '<div class="tiktok-settings-section-title">Team Members</div>';
    html += '<div class="tiktok-settings-section-desc">Manage team access to TikTok module</div>';

    html += '<div class="team-member-list">';
    teamMembers.forEach(member => {
      html += '<div class="team-member-item"><div class="team-member-avatar" style="background:' + member.color + '">' + member.avatar + '</div><div class="team-member-info"><div class="team-member-name">' + member.name + '</div><div class="team-member-role">' + member.role + '</div></div><span class="workspace-role">' + member.role + '</span></div>';
    });
    html += '</div></div>';

    // Security Section
    html += '<div id="settings-security" class="tiktok-settings-section" style="display:none;">';
    html += '<div class="tiktok-settings-section-title">Security</div>';
    html += '<div class="tiktok-settings-section-desc">Manage security settings for TikTok integration</div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Two-Factor Authentication</div><div class="tiktok-setting-desc">Require 2FA for TikTok actions</div></div><div class="tiktok-toggle" onclick="this.classList.toggle(&quot;active&quot;)"><div class="tiktok-toggle-knob"></div></div></div>';

    html += '<div class="tiktok-setting-row"><div class="tiktok-setting-info"><div class="tiktok-setting-label">Session Timeout</div><div class="tiktok-setting-desc">Automatically log out after inactivity</div></div><select class="tiktok-select"><option>15 minutes</option><option selected>30 minutes</option><option>1 hour</option><option>Never</option></select></div>';

    html += '</div>';

    html += '<div style="margin-top:var(--space-6);text-align:right;"><button class="btn btn-primary" onclick="tiktokApp.saveSettings()"><i class="ph ph-floppy-disk"></i> Save Changes</button></div>';

    html += '</div></div>';

    container.innerHTML = html;
  }

  showSettingsSection(section, el) {
    document.querySelectorAll('.tiktok-settings-nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.tiktok-settings-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById('settings-' + section);
    if (target) target.style.display = 'block';
  }

  toggleSetting(section, key) {
    const settings = this.storage.getSettings();
    if (settings[section]) {
      settings[section][key] = !settings[section][key];
      this.storage.updateSettings(section, settings[section]);
    }
    this.renderSettings(document.getElementById('tiktok-content'));
  }

  saveSettings() {
    const responseTime = document.getElementById('setting-response-time')?.value;
    const timezone = document.getElementById('setting-timezone')?.value;
    const welcomeMsg = document.getElementById('welcome-msg')?.value;
    const awayMsg = document.getElementById('away-msg')?.value;

    if (responseTime) this.storage.updateSettings('general', { defaultResponseTime: responseTime });
    if (timezone) this.storage.updateSettings('general', { timezone: timezone });
    if (welcomeMsg) this.storage.updateSettings('autoReplies', { welcomeMessage: welcomeMsg });
    if (awayMsg) this.storage.updateSettings('autoReplies', { awayMessage: awayMsg });

    OP.toast.show('Settings saved successfully', 'success');
  }

  addSavedReply() {
    const title = prompt('Enter reply title:');
    if (!title) return;
    const text = prompt('Enter reply text:');
    if (!text) return;
    const settings = this.storage.getSettings();
    settings.savedReplies.push({
      id: 'tsr_' + Date.now(),
      title: title,
      text: text,
      category: 'General',
      usageCount: 0
    });
    this.storage.updateSettings('savedReplies', settings.savedReplies);
    OP.toast.show('Saved reply added', 'success');
    this.renderSettings(document.getElementById('tiktok-content'));
  }

  addLabel() {
    const name = prompt('Enter label name:');
    if (!name) return;
    const settings = this.storage.getSettings();
    settings.labels.push({
      id: 'lbl_' + Date.now(),
      name: name,
      color: '#6366f1'
    });
    this.storage.updateSettings('labels', settings.labels);
    OP.toast.show('Label added', 'success');
    this.renderSettings(document.getElementById('tiktok-content'));
  }

  exportReport() {
    OP.toast.show('Report exported successfully', 'success');
  }

  // ============================================
  // Utility Methods
  // ============================================
  formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return minutes + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 7) return days + 'd ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// Initialize
let tiktokApp;
document.addEventListener('DOMContentLoaded', () => {
  if (!OP.nav.requireAuth()) return;
  tiktokApp = new TikTokApp();
});