/**
 * OnePlace Enterprise v3.0 — WhatsApp Business Module
 * Vanilla JavaScript (ES6+)
 * Matches the design photo exactly
 */

const WA_STORAGE_KEYS = {
  WHATSAPP_CONVERSATIONS: 'op_wa_conversations',
  WHATSAPP_CONTACTS: 'op_wa_contacts',
  WHATSAPP_TEMPLATES: 'op_wa_templates',
  WHATSAPP_QUICK_REPLIES: 'op_wa_quick_replies',
  WHATSAPP_BROADCASTS: 'op_wa_broadcasts',
  WHATSAPP_CATALOG: 'op_wa_catalog',
  WHATSAPP_SETTINGS: 'op_wa_settings',
  WHATSAPP_INTEGRATION: 'op_wa_integration',
  WHATSAPP_MESSAGES: 'op_wa_messages',
  WHATSAPP_LABELS: 'op_wa_labels'
};

// ============================================
// Sample Data (matches the photo exactly)
// ============================================

const WA_SAMPLE_CONTACTS = [
  { id: 'wa_c1', name: 'Sarah Johnson', phone: '+1 (555) 987-6543', email: 'sarah.j@example.com', avatar: 'SJ', color: '#EC4899', location: 'New York, USA', timezone: 'EST', leadScore: 85, status: 'Active Customer', totalOrders: 12, totalSpent: 1250.00, tags: ['customer-support', 'vip'] },
  { id: 'wa_c2', name: 'Michael Brown', phone: '+1 (555) 234-5678', email: 'michael.b@example.com', avatar: 'MB', color: '#F97316', location: 'Los Angeles, USA', timezone: 'PST', leadScore: 72, status: 'Active Customer', totalOrders: 8, totalSpent: 890.00, tags: ['sales'] },
  { id: 'wa_c3', name: 'Emily Davis', phone: '+1 (555) 345-6789', email: 'emily.d@example.com', avatar: 'ED', color: '#EAB308', location: 'Chicago, USA', timezone: 'CST', leadScore: 91, status: 'Active Customer', totalOrders: 24, totalSpent: 3200.00, tags: ['order-status', 'vip'] },
  { id: 'wa_c4', name: 'David Wilson', phone: '+1 (555) 456-7890', email: 'david.w@example.com', avatar: 'DW', color: '#22C55E', location: 'Miami, USA', timezone: 'EST', leadScore: 68, status: 'Inactive', totalOrders: 3, totalSpent: 150.00, tags: ['returns'] },
  { id: 'wa_c5', name: 'Jessica Taylor', phone: '+1 (555) 567-8901', email: 'jessica.t@example.com', avatar: 'JT', color: '#06B6D4', location: 'Seattle, USA', timezone: 'PST', leadScore: 88, status: 'Active Customer', totalOrders: 15, totalSpent: 2100.00, tags: ['sales'] },
  { id: 'wa_c6', name: 'Daniel Martinez', phone: '+1 (555) 678-9012', email: 'daniel.m@example.com', avatar: 'DM', color: '#6366F1', location: 'Austin, USA', timezone: 'CST', leadScore: 55, status: 'Lead', totalOrders: 0, totalSpent: 0, tags: ['support'] },
  { id: 'wa_c7', name: 'Ashley Anderson', phone: '+1 (555) 789-0123', email: 'ashley.a@example.com', avatar: 'AA', color: '#8B5CF6', location: 'Denver, USA', timezone: 'MST', leadScore: 79, status: 'Active Customer', totalOrders: 6, totalSpent: 540.00, tags: ['customer-support'] },
  { id: 'wa_c8', name: 'Robert Thomas', phone: '+1 (555) 890-1234', email: 'robert.t@example.com', avatar: 'RT', color: '#F43F5E', location: 'Boston, USA', timezone: 'EST', leadScore: 62, status: 'Inactive', totalOrders: 2, totalSpent: 95.00, tags: ['support'] },
];

const WA_SAMPLE_CONVERSATIONS = [
  { id: 'wa_conv_1', contactId: 'wa_c1', unread: 2, tag: 'customer-support', lastMessage: 'Hi, I have a question about your product...', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), status: 'open', assignedTo: 'tm1' },
  { id: 'wa_conv_2', contactId: 'wa_c2', unread: 1, tag: 'sales', lastMessage: 'Thanks for the information!', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), status: 'open', assignedTo: 'tm1' },
  { id: 'wa_conv_3', contactId: 'wa_c3', unread: 2, tag: 'order-status', lastMessage: 'When will my order be delivered?', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'open', assignedTo: 'tm2' },
  { id: 'wa_conv_4', contactId: 'wa_c4', unread: 1, tag: 'returns', lastMessage: 'Can I return an item?', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), status: 'open', assignedTo: 'tm1' },
  { id: 'wa_conv_5', contactId: 'wa_c5', unread: 0, tag: 'sales', lastMessage: 'Do you have this in size M?', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), status: 'open', assignedTo: 'tm3' },
  { id: 'wa_conv_6', contactId: 'wa_c6', unread: 2, tag: 'support', lastMessage: 'Payment issue', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), status: 'open', assignedTo: 'tm1' },
  { id: 'wa_conv_7', contactId: 'wa_c7', unread: 0, tag: 'customer-support', lastMessage: 'Thank you so much!', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), status: 'resolved', assignedTo: 'tm2' },
  { id: 'wa_conv_8', contactId: 'wa_c8', unread: 1, tag: 'support', lastMessage: 'I need help with my account', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), status: 'open', assignedTo: 'tm1' },
];

const WA_SAMPLE_MESSAGES = {
  'wa_conv_1': [
    { id: 'm1', type: 'received', text: 'Hi! I have a question about your product.', time: '10:20 AM', status: 'read' },
    { id: 'm2', type: 'sent', text: 'Hello Sarah! 👋\n\nHow can I help you today?', time: '10:21 AM', status: 'read' },
    { id: 'm3', type: 'received', text: 'I would like to know if you have this in black color and what\'s the delivery time to New York?', time: '10:22 AM', status: 'read' },
    { id: 'm4', type: 'sent', text: 'Yes, we have it in black color ✅\nDelivery time to New York is 2-3 business days.', time: '10:23 AM', status: 'read' },
  ],
  'wa_conv_2': [
    { id: 'm1', type: 'received', text: 'Thanks for the information!', time: '9:41 AM', status: 'read' },
    { id: 'm2', type: 'sent', text: 'You\'re welcome! Let me know if you need anything else.', time: '9:42 AM', status: 'delivered' },
  ],
  'wa_conv_3': [
    { id: 'm1', type: 'received', text: 'When will my order be delivered?', time: '8:15 AM', status: 'read' },
    { id: 'm2', type: 'sent', text: 'Hi Emily! Your order #ORD-1024 is expected to arrive tomorrow.', time: '8:16 AM', status: 'read' },
    { id: 'm3', type: 'received', text: 'Great, thank you!', time: '8:17 AM', status: 'read' },
  ],
  'wa_conv_4': [
    { id: 'm1', type: 'received', text: 'Can I return an item?', time: '8:32 AM', status: 'read' },
    { id: 'm2', type: 'sent', text: 'Of course! You can return items within 30 days of purchase.', time: '8:33 AM', status: 'read' },
  ],
  'wa_conv_5': [
    { id: 'm1', type: 'received', text: 'Do you have this in size M?', time: 'Yesterday', status: 'read' },
    { id: 'm2', type: 'sent', text: 'Yes, size M is available! Would you like me to reserve one for you?', time: 'Yesterday', status: 'read' },
  ],
  'wa_conv_6': [
    { id: 'm1', type: 'received', text: 'I\'m having a payment issue with my order.', time: 'Yesterday', status: 'read' },
    { id: 'm2', type: 'sent', text: 'I\'m sorry to hear that. Can you share your order number so I can check?', time: 'Yesterday', status: 'read' },
  ],
  'wa_conv_7': [
    { id: 'm1', type: 'received', text: 'Thank you so much for your help!', time: 'Yesterday', status: 'read' },
    { id: 'm2', type: 'sent', text: 'You\'re very welcome, Ashley! Have a great day! 😊', time: 'Yesterday', status: 'read' },
  ],
  'wa_conv_8': [
    { id: 'm1', type: 'received', text: 'I need help with my account settings.', time: 'Apr 28', status: 'read' },
    { id: 'm2', type: 'sent', text: 'I\'d be happy to help. What specifically would you like to change?', time: 'Apr 28', status: 'read' },
  ],
};

const WA_SAMPLE_TEMPLATES = [
  { id: 'wa_t1', name: 'Welcome Message', category: 'Greeting', content: 'Hello {{name}}! 👋 Welcome to Acme Solutions. How can we help you today?', variables: ['name'] },
  { id: 'wa_t2', name: 'Order Confirmation', category: 'Transactional', content: 'Hi {{name}}, your order #{{orderId}} has been confirmed! Expected delivery: {{date}}.', variables: ['name', 'orderId', 'date'] },
  { id: 'wa_t3', name: 'Shipping Update', category: 'Transactional', content: 'Great news {{name}}! Your order #{{orderId}} has been shipped and will arrive on {{date}}.', variables: ['name', 'orderId', 'date'] },
  { id: 'wa_t4', name: 'Feedback Request', category: 'Engagement', content: 'Hi {{name}}, we hope you enjoyed your purchase! Would you mind leaving us a quick review?', variables: ['name'] },
  { id: 'wa_t5', name: 'Abandoned Cart', category: 'Marketing', content: 'Hey {{name}}, you left something in your cart! Complete your order now and get 10% off with code SAVE10.', variables: ['name'] },
  { id: 'wa_t6', name: 'Appointment Reminder', category: 'Transactional', content: 'Reminder: You have an appointment scheduled for {{date}} at {{time}}. See you then!', variables: ['date', 'time'] },
];

const WA_SAMPLE_QUICK_REPLIES = [
  { id: 'wa_qr1', shortcut: '/thanks', text: 'Thank you for reaching out! We appreciate your message and will get back to you shortly.' },
  { id: 'wa_qr2', shortcut: '/hours', text: 'Our business hours are Monday-Friday 9AM-6PM EST and Saturday 10AM-4PM EST.' },
  { id: 'wa_qr3', shortcut: '/shipping', text: 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.' },
  { id: 'wa_qr4', shortcut: '/return', text: 'You can return items within 30 days of purchase. Please ensure items are in original condition.' },
  { id: 'wa_qr5', shortcut: '/discount', text: 'Use code WELCOME15 for 15% off your first order!' },
  { id: 'wa_qr6', shortcut: '/support', text: 'For urgent support, please call us at +1 (555) 123-4567 or email support@acme.com' },
];

const WA_SAMPLE_CATALOG = [
  { id: 'wa_prod1', name: 'Premium Wireless Headphones', price: 149.99, stock: 45, category: 'Electronics', image: 'ph-headphones' },
  { id: 'wa_prod2', name: 'Smart Watch Pro', price: 299.99, stock: 23, category: 'Electronics', image: 'ph-watch' },
  { id: 'wa_prod3', name: 'Organic Cotton T-Shirt', price: 29.99, stock: 120, category: 'Clothing', image: 'ph-t-shirt' },
  { id: 'wa_prod4', name: 'Leather Wallet', price: 59.99, stock: 67, category: 'Accessories', image: 'ph-wallet' },
  { id: 'wa_prod5', name: 'Bluetooth Speaker', price: 79.99, stock: 34, category: 'Electronics', image: 'ph-speaker-high' },
  { id: 'wa_prod6', name: 'Running Shoes', price: 119.99, stock: 18, category: 'Footwear', image: 'ph-sneaker' },
];

const WA_SAMPLE_SETTINGS = {
  autoReply: true,
  readReceipts: true,
  typingIndicators: true,
  notifications: true,
  soundEnabled: true,
  businessHours: { start: '09:00', end: '18:00', timezone: 'EST' },
  awayMessage: 'Thank you for your message! We are currently away and will respond during business hours.',
  greetingMessage: 'Hello! Welcome to Acme Solutions. How can we help you today?',
};

const WA_SAMPLE_INTEGRATION = {
  connected: true,
  phoneNumber: '+1 (555) 123-4567',
  businessName: 'Acme Solutions',
  businessDescription: 'Your trusted partner for premium products',
  apiKey: 'wa_api_xxxxxxxxxxxx',
  webhookUrl: 'https://api.acme.com/webhooks/whatsapp',
  lastSync: new Date().toISOString(),
};

const WA_SAMPLE_LABELS = [
  { id: 'lbl_cs', name: 'Customer Support', color: '#DBEAFE', textColor: '#2563EB' },
  { id: 'lbl_vip', name: 'VIP Customer', color: '#FCE7F3', textColor: '#DB2777' },
  { id: 'lbl_sales', name: 'Sales', color: '#EEF2FF', textColor: '#4F46E5' },
  { id: 'lbl_urgent', name: 'Urgent', color: '#FEF2F2', textColor: '#DC2626' },
  { id: 'lbl_follow', name: 'Follow-up', color: '#FEF3C7', textColor: '#D97706' },
];

// ============================================
// WhatsApp Storage Manager
// ============================================

class WhatsAppStorage {
  constructor() {
    this.init();
  }

  init() {
    const emptyValues = {
      [WA_STORAGE_KEYS.WHATSAPP_CONTACTS]: [],
      [WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS]: [],
      [WA_STORAGE_KEYS.WHATSAPP_MESSAGES]: {},
      [WA_STORAGE_KEYS.WHATSAPP_TEMPLATES]: [],
      [WA_STORAGE_KEYS.WHATSAPP_QUICK_REPLIES]: [],
      [WA_STORAGE_KEYS.WHATSAPP_CATALOG]: [],
      [WA_STORAGE_KEYS.WHATSAPP_SETTINGS]: {},
      [WA_STORAGE_KEYS.WHATSAPP_INTEGRATION]: {},
      [WA_STORAGE_KEYS.WHATSAPP_LABELS]: [],
      [WA_STORAGE_KEYS.WHATSAPP_BROADCASTS]: []
    };
    Object.entries(emptyValues).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
    });
  }

  // Contacts
  getContacts() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CONTACTS) || '[]');
  }

  getContactById(id) {
    return this.getContacts().find(c => c.id === id);
  }

  addContact(contact) {
    const contacts = this.getContacts();
    contact.id = 'wa_c' + Date.now();
    contact.createdAt = new Date().toISOString();
    contacts.push(contact);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONTACTS, JSON.stringify(contacts));
    return contact;
  }

  updateContact(id, updates) {
    const contacts = this.getContacts();
    const idx = contacts.findIndex(c => c.id === id);
    if (idx !== -1) {
      contacts[idx] = { ...contacts[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONTACTS, JSON.stringify(contacts));
      return contacts[idx];
    }
    return null;
  }

  deleteContact(id) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONTACTS, JSON.stringify(contacts));
  }

  // Conversations
  getConversations(search = '', filter = '') {
    let conversations = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS) || '[]');
    const contacts = this.getContacts();

    conversations = conversations.map(conv => {
      const contact = contacts.find(c => c.id === conv.contactId);
      return { ...conv, contact: contact || {} };
    });

    if (search) {
      const q = search.toLowerCase();
      conversations = conversations.filter(c => 
        (c.contact?.name || '').toLowerCase().includes(q) ||
        (c.lastMessage || '').toLowerCase().includes(q)
      );
    }

    if (filter) {
      conversations = conversations.filter(c => c.tag === filter || c.status === filter);
    }

    return conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getConversationById(id) {
    const conversations = this.getConversations();
    return conversations.find(c => c.id === id);
  }

  // Messages
  getMessages(conversationId) {
    const allMessages = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES) || '{}');
    return allMessages[conversationId] || [];
  }

  addMessage(conversationId, message) {
    const allMessages = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES) || '{}');
    if (!allMessages[conversationId]) allMessages[conversationId] = [];

    message.id = 'm_' + Date.now();
    message.time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    allMessages[conversationId].push(message);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES, JSON.stringify(allMessages));

    // Update conversation last message
    const conversations = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS) || '[]');
    const idx = conversations.findIndex(c => c.id === conversationId);
    if (idx !== -1) {
      conversations[idx].lastMessage = message.text;
      conversations[idx].timestamp = new Date().toISOString();
      if (message.type === 'received') {
        conversations[idx].unread = (conversations[idx].unread || 0) + 1;
      }
      localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS, JSON.stringify(conversations));
    }

    return message;
  }

  markConversationRead(id) {
    const conversations = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS) || '[]');
    const idx = conversations.findIndex(c => c.id === id);
    if (idx !== -1) {
      conversations[idx].unread = 0;
      localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS, JSON.stringify(conversations));
    }
  }

  // Templates
  getTemplates() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_TEMPLATES) || '[]');
  }

  addTemplate(template) {
    const templates = this.getTemplates();
    template.id = 'wa_t' + Date.now();
    templates.push(template);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_TEMPLATES, JSON.stringify(templates));
    return template;
  }

  deleteTemplate(id) {
    const templates = this.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_TEMPLATES, JSON.stringify(templates));
  }

  // Quick Replies
  getQuickReplies() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_QUICK_REPLIES) || '[]');
  }

  addQuickReply(qr) {
    const qrs = this.getQuickReplies();
    qr.id = 'wa_qr' + Date.now();
    qrs.push(qr);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_QUICK_REPLIES, JSON.stringify(qrs));
    return qr;
  }

  deleteQuickReply(id) {
    const qrs = this.getQuickReplies().filter(q => q.id !== id);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_QUICK_REPLIES, JSON.stringify(qrs));
  }

  // Catalog
  getCatalog() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CATALOG) || '[]');
  }

  addProduct(product) {
    const catalog = this.getCatalog();
    product.id = 'wa_prod' + Date.now();
    catalog.push(product);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CATALOG, JSON.stringify(catalog));
    return product;
  }

  deleteProduct(id) {
    const catalog = this.getCatalog().filter(p => p.id !== id);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CATALOG, JSON.stringify(catalog));
  }

  // Settings
  getSettings() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_SETTINGS) || '{}');
  }

  updateSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // Integration
  getIntegration() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_INTEGRATION) || '{}');
  }

  updateIntegration(data) {
    const current = this.getIntegration();
    const updated = { ...current, ...data };
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_INTEGRATION, JSON.stringify(updated));
    return updated;
  }

  // Labels
  getLabels() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_LABELS) || '[]');
  }

  addLabel(label) {
    const labels = this.getLabels();
    label.id = 'lbl_' + Date.now();
    labels.push(label);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_LABELS, JSON.stringify(labels));
    return label;
  }

  // Broadcasts
  getBroadcasts() {
    return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_BROADCASTS) || '[]');
  }

  addBroadcast(broadcast) {
    const broadcasts = this.getBroadcasts();
    broadcast.id = 'wa_b' + Date.now();
    broadcast.sentAt = new Date().toISOString();
    broadcast.status = 'sent';
    broadcasts.unshift(broadcast);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_BROADCASTS, JSON.stringify(broadcasts));
    return broadcast;
  }

  // Stats
  getStats() {
    const conversations = this.getConversations();
    const contacts = this.getContacts();
    const messages = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES) || '{}');

    const today = new Date().toDateString();
    const messagesToday = Object.values(messages).flat().filter(m => {
      return new Date().toDateString() === today;
    }).length;

    return {
      activeConversations: conversations.filter(c => c.status === 'open').length,
      unreadMessages: conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
      newContacts: contacts.filter(c => {
        const created = new Date(c.createdAt || Date.now());
        return created.toDateString() === today;
      }).length,
      messagesSent: messagesToday,
      responseRate: 94.2,
      totalContacts: contacts.length,
      totalConversations: conversations.length,
    };
  }

  clearAllData() {
    Object.values(WA_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
  }
}

// ============================================
// WhatsApp App Controller
// ============================================

class WhatsAppApp {
  constructor() {
    this.storage = new WhatsAppStorage();
    this.currentConversation = null;
    this.currentFilter = '';
    this.currentSearch = '';
    this.sidebarOpen = false;
    this.session = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    this.renderConversations();

    await this.loadBackendStatus();

    // Select first conversation by default
    const conversations = this.storage.getConversations();
    if (conversations.length > 0) {
      this.selectConversation(conversations[0].id);
    }
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
        this.renderConversations();
      });
    }

    // Conversation search
    const convSearch = document.getElementById('conversation-search');
    if (convSearch) {
      convSearch.addEventListener('input', (e) => {
        this.currentSearch = e.target.value;
        this.renderConversations();
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-header');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        themeBtn.innerHTML = '<i class="ph ' + (next === 'dark' ? 'ph-sun' : 'ph-moon') + '"></i>';
      });
    }

    // Create button
    const createBtn = document.getElementById('create-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const menu = document.getElementById('create-menu');
        if (menu) menu.classList.toggle('active');
      });
    }

    const connectBtn = document.querySelector('.wa-view-integration-btn');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => this.connectSession());
    }

    // Notifications
    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        if (typeof OP !== 'undefined' && OP.toast) {
          OP.toast.show('Notifications panel would open here', 'info');
        }
      });
    }

    // User menu
    const userBtn = document.getElementById('user-menu-btn');
    if (userBtn) {
      userBtn.addEventListener('click', () => {
        if (confirm('Sign out of OnePlace Enterprise?')) {
          if (typeof OP !== 'undefined' && OP.auth) {
            OP.auth.signOut();
          }
          window.location.href = '../auth/signin.html';
        }
      });
    }

    // Send message
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    if (sendBtn && chatInput) {
      sendBtn.addEventListener('click', () => this.sendMessage());
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    // Chat tabs
    document.querySelectorAll('.wa-chat-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.wa-chat-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#create-btn') && !e.target.closest('#create-menu')) {
        const menu = document.getElementById('create-menu');
        if (menu) menu.classList.remove('active');
      }
    });
  }

  // ============================================
  // Conversation List Rendering
  // ============================================
  renderConversations() {
    const list = document.getElementById('conversation-list');
    if (!list) return;

    const conversations = this.storage.getConversations(this.currentSearch, this.currentFilter);

    if (conversations.length === 0) {
      list.innerHTML = `
        <div class="wa-empty-state">
          <div class="wa-empty-state-icon"><i class="ph ph-chat-circle-dots"></i></div>
          <div class="wa-empty-state-title">No conversations</div>
          <div class="wa-empty-state-desc">No conversations match your current search or filter.</div>
        </div>
      `;
      return;
    }

    let html = '';
    conversations.forEach(conv => {
      const contact = conv.contact || {};
      const timeAgo = this.formatTimeAgo(conv.timestamp);
      const activeClass = this.currentConversation === conv.id ? 'active' : '';
      const unreadClass = conv.unread > 0 ? 'unread' : '';

      html += `
        <div class="wa-conversation-item ${activeClass} ${unreadClass}" data-id="${conv.id}">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || 'U')}&background=${(contact.color || '#6366f1').replace('#', '')}&color=fff&size=88" 
               alt="${contact.name}" class="wa-conv-avatar">
          <div class="wa-conv-content">
            <div class="wa-conv-header">
              <span class="wa-conv-name">${contact.name || 'Unknown'}</span>
              <span class="wa-conv-time">${timeAgo}</span>
            </div>
            <div class="wa-conv-preview">${conv.lastMessage || 'No messages yet'}</div>
            <div class="wa-conv-meta">
              ${conv.tag ? '<span class="wa-conv-tag ' + conv.tag + '">' + conv.tag.replace('-', ' ') + '</span>' : ''}
              ${conv.unread > 0 ? '<span class="wa-conv-unread">' + conv.unread + '</span>' : ''}
            </div>
          </div>
        </div>
      `;
    });

    list.innerHTML = html;

    // Add click handlers
    list.querySelectorAll('.wa-conversation-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectConversation(item.dataset.id);
      });
    });
  }

  // ============================================
  // Select Conversation
  // ============================================
  selectConversation(id) {
    this.currentConversation = id;
    this.storage.markConversationRead(id);

    // Update active state in list
    document.querySelectorAll('.wa-conversation-item').forEach(item => {
      item.classList.toggle('active', item.dataset.id === id);
      item.classList.remove('unread');
    });

    this.renderChatHeader(id);
    this.renderChatMessages(id);
    this.renderContactPanel(id);
  }

  // ============================================
  // Chat Header Rendering
  // ============================================
  renderChatHeader(conversationId) {
    const header = document.getElementById('chat-header');
    if (!header) return;

    const conv = this.storage.getConversationById(conversationId);
    if (!conv) return;

    const contact = conv.contact || {};
    header.innerHTML = `
      <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || 'U')}&background=${(contact.color || '#6366f1').replace('#', '')}&color=fff&size=80" 
           alt="${contact.name}" class="wa-chat-header-avatar">
      <div class="wa-chat-header-info">
        <div class="wa-chat-header-name">${contact.name || 'Unknown'}</div>
        <div class="wa-chat-header-status">${contact.phone || ''}</div>
      </div>
      <span class="wa-chat-header-tag">Customer</span>
      <div class="wa-chat-header-actions">
        <button class="wa-chat-header-btn" title="Star conversation"><i class="ph ph-star"></i></button>
        <button class="wa-chat-header-btn" title="More options"><i class="ph ph-dots-three-vertical"></i></button>
      </div>
    `;
  }

  // ============================================
  // Chat Messages Rendering
  // ============================================
  renderChatMessages(conversationId) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const messages = this.storage.getMessages(conversationId);

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="wa-empty-state">
          <div class="wa-empty-state-icon"><i class="ph ph-chat-circle-text"></i></div>
          <div class="wa-empty-state-title">No messages yet</div>
          <div class="wa-empty-state-desc">Start the conversation by sending a message.</div>
        </div>
      `;
      return;
    }

    let html = '<div class="wa-message-date"><span>Today</span></div>';
    messages.forEach(msg => {
      const statusIcon = msg.status === 'read' 
        ? '<i class="ph ph-checks"></i>' 
        : '<i class="ph ph-check"></i>';

      html += `
        <div class="wa-message ${msg.type}">
          <div class="wa-message-bubble">
            <div class="wa-message-text">${this.escapeHtml(msg.text).replace(/\n/g, '<br>')}</div>
            <div class="wa-message-meta">
              <span class="wa-message-time">${msg.time}</span>
              ${msg.type === 'sent' ? '<span class="wa-message-status ' + msg.status + '">' + statusIcon + '</span>' : ''}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  }

  // ============================================
  // Contact Panel Rendering (matches photo exactly)
  // ============================================
  renderContactPanel(conversationId) {
    const panel = document.getElementById('contact-panel');
    if (!panel) return;

    const conv = this.storage.getConversationById(conversationId);
    if (!conv) return;

    const contact = conv.contact || {};
    const labels = this.storage.getLabels();
    const contactLabels = contact.tags || [];

    // Get current time for display
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

    panel.innerHTML = `
      <div class="wa-contact-section">
        <div class="wa-contact-header">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || 'U')}&background=${(contact.color || '#6366f1').replace('#', '')}&color=fff&size=160" 
               alt="${contact.name}" class="wa-contact-avatar">
          <div class="wa-contact-name-row">
            <span class="wa-contact-name">${contact.name || 'Unknown'}</span>
            <button class="wa-contact-edit-btn"><i class="ph ph-pencil-simple"></i></button>
          </div>
          <span class="wa-contact-phone">${contact.phone || ''}</span>
          <div class="wa-contact-location">
            <i class="ph ph-map-pin"></i>
            <span>${contact.location || 'Unknown location'}</span>
          </div>
          <div class="wa-contact-time">
            <i class="ph ph-clock"></i>
            <span>Local time: ${timeString}</span>
          </div>
          <a href="../crm/contacts.html?id=${contact.id}" class="wa-view-profile-link">View Full Profile →</a>
        </div>
      </div>

      <div class="wa-contact-section">
        <div class="wa-section-title">CRM Information</div>
        <div class="wa-crm-grid">
          <div class="wa-crm-item">
            <span class="wa-crm-label">Lead Score</span>
            <span class="wa-crm-value score">${contact.leadScore || 0}</span>
          </div>
          <div class="wa-crm-item">
            <span class="wa-crm-label">Customer Status</span>
            <span class="wa-crm-value status">${contact.status || 'Unknown'}</span>
          </div>
          <div class="wa-crm-item">
            <span class="wa-crm-label">Total Orders</span>
            <span class="wa-crm-value">${contact.totalOrders || 0}</span>
          </div>
          <div class="wa-crm-item">
            <span class="wa-crm-label">Total Spent</span>
            <span class="wa-crm-value money">$${(contact.totalSpent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <a href="../crm/index.html?contact=${contact.id}" class="wa-view-crm-link">View in CRM →</a>
      </div>

      <div class="wa-contact-section">
        <div class="wa-section-title">Labels</div>
        <div class="wa-labels-list">
          ${contactLabels.map(tag => {
            const label = labels.find(l => l.id === tag) || { name: tag, color: '#E8F5EE', textColor: '#128C7E' };
            return '<span class="wa-label" style="background: ' + label.color + '; color: ' + label.textColor + '">' + label.name + '</span>';
          }).join('')}
          <button class="wa-add-label-btn"><i class="ph ph-plus"></i> Add Label</button>
        </div>
      </div>

      <div class="wa-contact-section">
        <div class="wa-section-title">Recent Activity</div>
        <div class="wa-activity-list">
          <div class="wa-activity-item">
            <div class="wa-activity-icon order"><i class="ph ph-shopping-bag"></i></div>
            <div class="wa-activity-content">
              <div class="wa-activity-title">Order #ORD-1024</div>
              <div class="wa-activity-date">Apr 28, 2024</div>
            </div>
          </div>
          <div class="wa-activity-item">
            <div class="wa-activity-icon ticket"><i class="ph ph-ticket"></i></div>
            <div class="wa-activity-content">
              <div class="wa-activity-title">Ticket #SUP-2048</div>
              <div class="wa-activity-date">Apr 27, 2024</div>
            </div>
          </div>
          <div class="wa-activity-item">
            <div class="wa-activity-icon payment"><i class="ph ph-currency-dollar"></i></div>
            <div class="wa-activity-content">
              <div class="wa-activity-title">Payment Received</div>
              <div class="wa-activity-date">Apr 25, 2024</div>
            </div>
          </div>
        </div>
        <a href="#" class="wa-view-all-link">View All Activity →</a>
      </div>

      <div class="wa-contact-section">
        <div class="wa-section-title">Quick Actions</div>
        <div class="wa-quick-actions">
          <button class="wa-quick-action-btn"><i class="ph ph-ticket"></i> Create Ticket</button>
          <button class="wa-quick-action-btn"><i class="ph ph-shopping-bag"></i> Create Order</button>
          <button class="wa-quick-action-btn"><i class="ph ph-note"></i> Add Note</button>
          <button class="wa-quick-action-btn"><i class="ph ph-prohibit"></i> Block Contact</button>
        </div>
      </div>
    `;
  }

  // ============================================
  // Send Message
  // ============================================
  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !this.currentConversation) return;

    const text = input.value.trim();
    if (!text) return;

    this.storage.addMessage(this.currentConversation, {
      type: 'sent',
      text: text,
      status: 'delivered'
    });

    input.value = '';
    this.renderChatMessages(this.currentConversation);
    this.renderConversations();

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        'Thanks for the update!',
        'That sounds great!',
        'I appreciate your help.',
        'Could you provide more details?',
        'Perfect, thank you!',
        'I will check and get back to you.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      this.storage.addMessage(this.currentConversation, {
        type: 'received',
        text: randomReply,
        status: 'read'
      });

      this.renderChatMessages(this.currentConversation);
      this.renderConversations();
    }, 2000);
  }

  // ============================================
  // Backend integration
  // ============================================
  async loadBackendStatus() {
    try {
      if (!window.OP || !window.OP.apiIntegration) {
        return;
      }

      await window.OP.apiIntegration.init();
      const session = window.OP.auth?.getSession?.() || null;
      const organizationId = session?.user?.organizationId || session?.organizationId || null;
      const payload = organizationId
        ? await window.OP.apiIntegration.get(`/platforms/whatsapp/status?organizationId=${encodeURIComponent(organizationId)}`)
        : null;

      const responseData = payload && payload.data ? payload.data : null;
      const status = responseData && responseData.data ? responseData.data.status : 'DISCONNECTED';
      this.renderConnectionStatus(status);
      this.session = responseData && responseData.data ? responseData.data : null;
    } catch (error) {
      this.renderConnectionStatus('DISCONNECTED');
    }
  }

  async connectSession() {
    try {
      if (!window.OP || !window.OP.apiIntegration) {
        throw new Error('Backend API is unavailable.');
      }

      await window.OP.apiIntegration.init();
      const session = window.OP.auth?.getSession?.() || null;
      const organizationId = session?.user?.organizationId || session?.organizationId || null;
      if (!organizationId) {
        throw new Error('No organization selected.');
      }

      const response = await window.OP.apiIntegration.post('/platforms/whatsapp/connect', {
        organizationId,
        sessionKey: `oneplace-${session?.userId || 'default'}`
      });
      const payload = response && response.data ? response.data : null;
      const status = payload && payload.data ? payload.data.status : 'CONNECTING';
      this.renderConnectionStatus(status);
      this.session = payload && payload.data ? payload.data : null;
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show('WhatsApp connection request sent.', 'success');
      }
    } catch (error) {
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show(error?.message || 'Unable to connect WhatsApp.', 'error');
      }
    }
  }

  renderConnectionStatus(status) {
    const accountStatus = document.querySelector('.wa-account-status span:last-child');
    const accountName = document.querySelector('.wa-account-name');
    const accountPhone = document.querySelector('.wa-account-phone');
    const statusDot = document.querySelector('.wa-account-status .wa-status-dot');

    if (accountStatus) {
      accountStatus.textContent = status === 'CONNECTED' ? 'Connected' : status === 'CONNECTING' || status === 'RECONNECTING' ? 'Connecting' : 'Disconnected';
    }

    if (statusDot) {
      statusDot.style.background = status === 'CONNECTED' ? '#22c55e' : status === 'CONNECTING' || status === 'RECONNECTING' ? '#f59e0b' : '#ef4444';
    }

    if (accountName) {
      accountName.textContent = this.session?.organizationId ? 'Organization Session' : 'Acme Solutions';
    }

    if (accountPhone) {
      accountPhone.textContent = this.session?.sessionKey ? this.session.sessionKey : '+1 (555) 123-4567';
    }
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
    if (minutes < 60) return minutes + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 7) return days + 'd ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize
window.WhatsAppApp = WhatsAppApp;
window.WhatsAppStorage = WhatsAppStorage;

// Auto-initialize if on a WhatsApp page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.whatsapp-layout')) {
    if (typeof OP !== 'undefined' && OP.nav && OP.nav.requireAuth) {
      if (!OP.nav.requireAuth()) return;
    }
    window.waApp = new WhatsAppApp();
  }
});
