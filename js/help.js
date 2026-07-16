/**
 * OnePlace Enterprise v3.0 — Help Center Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const HELP_STORAGE_KEYS = {
  TICKETS: 'op_help_tickets',
  CHAT_MESSAGES: 'op_help_chat_messages',
  FEATURE_VOTES: 'op_help_feature_votes',
  FAQ_FEEDBACK: 'op_help_faq_feedback',
  DOC_FEEDBACK: 'op_help_doc_feedback',
  SETTINGS: 'op_help_settings',
  SEARCH_HISTORY: 'op_help_search_history'
};

// ============================================
// Help Center Data
// ============================================
const HELP_DATA = {
  categories: [
    { id: 'getting-started', title: 'Getting Started', desc: 'Learn the basics and set up your workspace', icon: 'ph-rocket-launch', color: 'getting-started' },
    { id: 'integrations', title: 'Integrations', desc: 'Connect and manage your channels', icon: 'ph-plugs', color: 'integrations' },
    { id: 'billing', title: 'Billing & Plans', desc: 'Manage subscriptions and payments', icon: 'ph-credit-card', color: 'billing' },
    { id: 'api', title: 'API & Developer', desc: 'API docs and developer resources', icon: 'ph-code', color: 'api' }
  ],
  
  quickActions: [
    { id: 'contact', title: 'Contact Support', desc: 'Send us a message and our team will get back to you as soon as possible.', icon: 'ph-envelope', link: 'contact-support.html' },
    { id: 'ticket', title: 'Submit a Ticket', desc: 'Create a support ticket for technical issues.', icon: 'ph-ticket', link: 'submit-ticket.html' },
    { id: 'status', title: 'System Status', desc: 'Check our current system status and uptime.', icon: 'ph-activity', link: 'system-status.html' },
    { id: 'feature', title: 'Feature Requests', desc: 'Suggest and vote on new features.', icon: 'ph-lightbulb', link: 'feature-requests.html' }
  ],

  documentation: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      articles: [
        { id: 'intro', title: 'Introduction to OnePlace', readTime: '5 min' },
        { id: 'account', title: 'Create Your Account', readTime: '3 min' },
        { id: 'workspace', title: 'Create Your Workspace', readTime: '4 min' },
        { id: 'channel', title: 'Connect Your First Channel', readTime: '6 min' },
        { id: 'inbox', title: 'Understanding the Inbox', readTime: '7 min' }
      ]
    },
    {
      id: 'workspace',
      title: 'Workspace',
      articles: [
        { id: 'settings', title: 'Workspace Settings', readTime: '4 min' },
        { id: 'members', title: 'Managing Members', readTime: '5 min' },
        { id: 'roles', title: 'Role Permissions', readTime: '6 min' }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      articles: [
        { id: 'gmail', title: 'Gmail Integration', readTime: '5 min' },
        { id: 'whatsapp', title: 'WhatsApp Business', readTime: '7 min' },
        { id: 'instagram', title: 'Instagram Setup', readTime: '6 min' },
        { id: 'slack', title: 'Slack Connection', readTime: '4 min' }
      ]
    },
    {
      id: 'ai',
      title: 'AI & Automation',
      articles: [
        { id: 'assistant', title: 'Using AI Assistant', readTime: '8 min' },
        { id: 'automation', title: 'Building Automations', readTime: '10 min' },
        { id: 'analytics', title: 'AI Analytics', readTime: '6 min' }
      ]
    },
    {
      id: 'crm',
      title: 'CRM',
      articles: [
        { id: 'contacts', title: 'Managing Contacts', readTime: '5 min' },
        { id: 'pipelines', title: 'Sales Pipelines', readTime: '7 min' },
        { id: 'deals', title: 'Tracking Deals', readTime: '6 min' }
      ]
    },
    {
      id: 'billing',
      title: 'Billing',
      articles: [
        { id: 'plans', title: 'Subscription Plans', readTime: '4 min' },
        { id: 'invoices', title: 'Viewing Invoices', readTime: '3 min' },
        { id: 'upgrade', title: 'Upgrading Your Plan', readTime: '5 min' }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      articles: [
        { id: '2fa', title: 'Two-Factor Authentication', readTime: '4 min' },
        { id: 'api-keys', title: 'Managing API Keys', readTime: '5 min' },
        { id: 'privacy', title: 'Data Privacy', readTime: '6 min' }
      ]
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      articles: [
        { id: 'setup', title: 'Webhook Setup', readTime: '7 min' },
        { id: 'events', title: 'Event Types', readTime: '5 min' },
        { id: 'security', title: 'Webhook Security', readTime: '6 min' }
      ]
    }
  ],

  tutorials: [
    { id: 1, title: 'Getting Started with OnePlace', category: 'getting-started', duration: '12:45', views: '2.4k', date: '2 days ago', icon: 'ph-play-circle' },
    { id: 2, title: 'Connecting WhatsApp Business', category: 'integrations', duration: '8:30', views: '1.8k', date: '5 days ago', icon: 'ph-whatsapp-logo' },
    { id: 3, title: 'Using AI Assistant', category: 'ai', duration: '15:20', views: '3.1k', date: '1 week ago', icon: 'ph-sparkle' },
    { id: 4, title: 'Building Your First Automation', category: 'automation', duration: '22:10', views: '1.2k', date: '2 weeks ago', icon: 'ph-gear' },
    { id: 5, title: 'Managing Your Team', category: 'team', duration: '10:15', views: '980', date: '3 weeks ago', icon: 'ph-users' },
    { id: 6, title: 'CRM Fundamentals', category: 'crm', duration: '18:45', views: '2.7k', date: '1 month ago', icon: 'ph-address-book' }
  ],

  faq: [
    { id: 1, question: 'What is OnePlace Enterprise?', answer: 'OnePlace Enterprise is an all-in-one platform to manage every conversation, automate workflows and grow your business. It integrates Gmail, WhatsApp, Instagram, Slack, X (Twitter), LinkedIn and more into a single unified inbox.', category: 'general' },
    { id: 2, question: 'How do I connect a channel?', answer: 'Navigate to Integrations in your sidebar, select the channel you want to connect (e.g., Gmail, WhatsApp), and follow the authentication steps. Each integration has a step-by-step setup guide.', category: 'integrations' },
    { id: 3, question: 'Can I use OnePlace on mobile?', answer: 'Yes! OnePlace is fully responsive and works on all devices. We also offer native mobile apps for iOS and Android with push notifications.', category: 'general' },
    { id: 4, question: 'How does billing work?', answer: 'We offer flexible monthly and annual billing. You can upgrade, downgrade, or cancel your subscription at any time from the Billing & Subscription page.', category: 'billing' },
    { id: 5, question: 'Can I cancel my subscription?', answer: 'Yes, you can cancel your subscription at any time from Settings > Billing. Your access will continue until the end of your current billing period.', category: 'billing' },
    { id: 6, question: 'Is my data secure?', answer: 'Absolutely. We use enterprise-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We are SOC 2 Type II certified and GDPR compliant.', category: 'security' },
    { id: 7, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual enterprise plans.', category: 'billing' },
    { id: 8, question: 'How do I invite team members?', answer: 'Go to Team Management in your workspace settings, click "Invite Member," enter their email address, and select their role. They will receive an invitation email.', category: 'team' },
    { id: 9, question: 'What are automation workflows?', answer: 'Automation workflows allow you to create rules that trigger actions automatically. For example, you can auto-assign conversations based on keywords, send auto-replies, or create CRM entries.', category: 'automation' },
    { id: 10, question: 'How do I export my data?', answer: 'You can export your data from Settings > Data Export. We support CSV, JSON, and PDF formats. Enterprise plans also support automated scheduled exports.', category: 'general' }
  ],

  faqCategories: [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'billing', label: 'Billing' },
    { id: 'security', label: 'Security' },
    { id: 'team', label: 'Team' },
    { id: 'automation', label: 'Automation' }
  ],

  chatConversations: [
    { id: 1, name: 'AI Assistant', type: 'ai', avatar: 'AI', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)', status: 'online', preview: 'How can I help you today?', time: '10:30 AM', unread: 0 },
    { id: 2, name: 'Support Agent', type: 'agent', avatar: 'SA', color: 'linear-gradient(135deg, #10b981, #059669)', status: 'online', preview: 'I\'d be happy to help you with that!', time: 'Yesterday', unread: 2 },
    { id: 3, name: 'Billing Support', type: 'billing', avatar: 'BS', color: 'linear-gradient(135deg, #f59e0b, #d97706)', status: 'away', preview: 'Your invoice has been generated.', time: 'Jul 10', unread: 0 }
  ],

  chatMessages: {
    1: [
      { id: 1, sender: 'ai', text: 'Hello Alex! 👋\n\nHow can I help you today?', time: '10:30 AM' },
      { id: 2, sender: 'user', text: 'I need help connecting my Instagram account.', time: '10:31 AM' },
      { id: 3, sender: 'ai', text: 'I\'d be happy to help you with that! Let me guide you through the steps.\n\nHere\'s a quick guide:\n1. Go to Integrations\n2. Click on Instagram\n3. Authorize your account\n\nWould you like me to walk you through each step?', time: '10:31 AM' }
    ],
    2: [
      { id: 1, sender: 'agent', text: 'Hi Alex, this is Sarah from support. How can I assist you today?', time: 'Yesterday' },
      { id: 2, sender: 'user', text: 'I\'m having trouble with my WhatsApp Business connection.', time: 'Yesterday' },
      { id: 3, sender: 'agent', text: 'I can help with that. Could you tell me what error message you\'re seeing?', time: 'Yesterday' },
      { id: 4, sender: 'user', text: 'It says "Authentication failed" when I try to connect.', time: 'Yesterday' },
      { id: 5, sender: 'agent', text: 'That usually happens when the WhatsApp Business API credentials have expired. Let me guide you through refreshing them.', time: 'Yesterday' }
    ],
    3: [
      { id: 1, sender: 'billing', text: 'Hello! This is the Billing Support team.', time: 'Jul 10' },
      { id: 2, sender: 'user', text: 'I have a question about my invoice.', time: 'Jul 10' },
      { id: 3, sender: 'billing', text: 'Your invoice #INV-2026-0710 has been generated for $149.00. It will be charged on July 15, 2026.', time: 'Jul 10' }
    ]
  },

  systemStatus: [
    { name: 'API', status: 'operational', uptime: '99.99%' },
    { name: 'Messaging Services', status: 'operational', uptime: '99.97%' },
    { name: 'Integrations', status: 'operational', uptime: '99.95%' },
    { name: 'AI Services', status: 'operational', uptime: '99.98%' },
    { name: 'Website', status: 'operational', uptime: '100%' }
  ],

  incidents: [
    { id: 1, title: 'API Response Time Degradation', description: 'We experienced elevated API response times for 15 minutes. Issue has been resolved.', status: 'resolved', date: 'Jul 8, 2026', time: '14:30 UTC', type: 'resolved' },
    { id: 2, title: 'WhatsApp Integration Maintenance', description: 'Scheduled maintenance for WhatsApp Business API upgrade.', status: 'planned', date: 'Jul 15, 2026', time: '02:00 AM UTC', type: 'maintenance' },
    { id: 3, title: 'Gmail Sync Delay', description: 'Some users experienced delays in Gmail synchronization. All messages have been synced.', status: 'resolved', date: 'Jul 5, 2026', time: '09:15 UTC', type: 'resolved' }
  ],

  features: [
    { id: 1, title: 'Custom Dashboard Widgets', description: 'Add more customization options for dashboards with drag-and-drop widgets.', votes: 42, status: 'planned', author: 'Alex Morgan', date: '2 days ago' },
    { id: 2, title: 'WhatsApp Message Templates', description: 'Create and manage message templates for WhatsApp Business API.', votes: 38, status: 'in-progress', author: 'Sarah Chen', date: '5 days ago' },
    { id: 3, title: 'Bulk Contact Import', description: 'Import contacts in bulk via CSV with field mapping.', votes: 35, status: 'planned', author: 'Mike Ross', date: '1 week ago' },
    { id: 4, title: 'Advanced Analytics', description: 'More advanced reporting and analytics features.', votes: 29, status: 'under-review', author: 'Emma Wilson', date: '2 weeks ago' },
    { id: 5, title: 'Mobile App Dark Mode', description: 'Add dark mode for mobile apps.', votes: 24, status: 'completed', author: 'James Lee', date: '3 weeks ago' }
  ],

  featureFilters: [
    { id: 'trending', label: 'Trending' },
    { id: 'top-voted', label: 'Top Voted' },
    { id: 'newest', label: 'Newest' },
    { id: 'planned', label: 'Planned' },
    { id: 'completed', label: 'Completed' }
  ],

  releases: [
    {
      version: 'v3.2.0',
      type: 'major',
      date: 'May 20, 2026',
      title: 'Smart Automations',
      changes: [
        { type: 'new', text: 'Introducing Smart Automations - enhanced AI capabilities and improved analytics.' },
        { type: 'improved', text: 'AI Auto-Summarization for long conversations.' },
        { type: 'improved', text: 'Enhanced Analytics Dashboard.' },
        { type: 'new', text: 'News Inbox Filters.' },
        { type: 'improved', text: 'Performance improvements.' }
      ]
    },
    {
      version: 'v3.1.0',
      type: 'minor',
      date: 'April 28, 2026',
      title: 'AI Assistant',
      changes: [
        { type: 'new', text: 'New AI Assistant with GPT-4 integration.' },
        { type: 'improved', text: 'Faster response times.' },
        { type: 'fixed', text: 'Fixed issue with WhatsApp message threading.' }
      ]
    },
    {
      version: 'v3.0.0',
      type: 'major',
      date: 'April 01, 2026',
      title: 'Major Release',
      changes: [
        { type: 'new', text: 'Complete UI redesign with dark mode support.' },
        { type: 'new', text: 'Unified Inbox for all channels.' },
        { type: 'improved', text: 'New CRM with pipeline management.' },
        { type: 'new', text: 'Workflow Automation builder.' }
      ]
    }
  ],

  apiEndpoints: [
    {
      method: 'GET',
      path: '/api/v1/conversations',
      description: 'Retrieve all conversations for the authenticated workspace.',
      section: 'conversations'
    },
    {
      method: 'POST',
      path: '/api/v1/conversations',
      description: 'Create a new conversation.',
      section: 'conversations'
    },
    {
      method: 'GET',
      path: '/api/v1/contacts',
      description: 'List all contacts in the workspace CRM.',
      section: 'contacts'
    },
    {
      method: 'POST',
      path: '/api/v1/contacts',
      description: 'Create a new contact.',
      section: 'contacts'
    },
    {
      method: 'PUT',
      path: '/api/v1/contacts/{id}',
      description: 'Update an existing contact.',
      section: 'contacts'
    },
    {
      method: 'DELETE',
      path: '/api/v1/contacts/{id}',
      description: 'Delete a contact.',
      section: 'contacts'
    },
    {
      method: 'GET',
      path: '/api/v1/messages',
      description: 'Retrieve messages for a specific conversation.',
      section: 'messages'
    },
    {
      method: 'POST',
      path: '/api/v1/messages',
      description: 'Send a new message.',
      section: 'messages'
    },
    {
      method: 'GET',
      path: '/api/v1/webhooks',
      description: 'List all configured webhooks.',
      section: 'webhooks'
    },
    {
      method: 'POST',
      path: '/api/v1/webhooks',
      description: 'Register a new webhook endpoint.',
      section: 'webhooks'
    }
  ],

  keyboardShortcuts: [
    {
      category: 'General',
      shortcuts: [
        { keys: ['Ctrl', 'K'], description: 'Open Global Search' },
        { keys: ['Ctrl', '/'], description: 'Open Help Center' },
        { keys: ['Ctrl', 'Shift', 'D'], description: 'Toggle Dark Mode' },
        { keys: ['Esc'], description: 'Close Modal / Go Back' }
      ]
    },
    {
      category: 'Navigation',
      shortcuts: [
        { keys: ['G', 'I'], description: 'Go to Inbox' },
        { keys: ['G', 'C'], description: 'Go to CRM' },
        { keys: ['G', 'T'], description: 'Go to Tasks' },
        { keys: ['G', 'A'], description: 'Go to Automations' }
      ]
    },
    {
      category: 'Inbox',
      shortcuts: [
        { keys: ['J'], description: 'Next Conversation' },
        { keys: ['K'], description: 'Previous Conversation' },
        { keys: ['R'], description: 'Reply' },
        { keys: ['A'], description: 'Assign' },
        { keys: ['M'], description: 'Mark as Resolved' },
        { keys: ['Shift', 'R'], description: 'Mark as Unread' }
      ]
    },
    {
      category: 'CRM',
      shortcuts: [
        { keys: ['N'], description: 'New Contact' },
        { keys: ['E'], description: 'Edit Contact' },
        { keys: ['Shift', 'D'], description: 'Delete Contact' },
        { keys: ['Ctrl', 'S'], description: 'Save Changes' }
      ]
    }
  ],

  discussions: [
    { id: 1, title: 'Best practices for managing multiple inboxes', author: 'Alex Morgan', avatar: 'AM', color: '#6366f1', time: '2 hours ago', tag: 'popular', tagLabel: 'Popular', preview: 'I\'ve been using OnePlace for 6 months now and wanted to share some tips on organizing multiple channel inboxes...', replies: 24, views: 342, likes: 45 },
    { id: 2, title: 'How to use AI for customer support', author: 'Sarah Chen', avatar: 'SC', color: '#10b981', time: '5 hours ago', tag: 'answered', tagLabel: 'Answered', preview: 'Has anyone successfully implemented the AI Assistant for handling common support queries? Looking for workflow examples...', replies: 18, views: 256, likes: 32 },
    { id: 3, title: 'WhatsApp Business API limits', author: 'Mike Ross', avatar: 'MR', color: '#f59e0b', time: '1 day ago', tag: 'unanswered', tagLabel: 'Unanswered', preview: 'I\'m hitting rate limits with the WhatsApp Business API. What are the current limits and how can I request an increase?', replies: 3, views: 89, likes: 8 },
    { id: 4, title: 'Automation workflow examples', author: 'Emma Wilson', avatar: 'EW', color: '#ec4899', time: '2 days ago', tag: 'popular', tagLabel: 'Popular', preview: 'Sharing some automation workflows that have saved our team 10+ hours per week. Includes auto-tagging, routing, and follow-ups...', replies: 31, views: 512, likes: 67 }
  ]
};

// ============================================
// Help Center Manager
// ============================================
class HelpCenterManager {
  constructor() {
    this.toast = window.OP?.toast || new ToastManager();
    this.initStorage();
    this.bindGlobalEvents();
  }

  initStorage() {
    if (!localStorage.getItem(HELP_STORAGE_KEYS.TICKETS)) {
      localStorage.setItem(HELP_STORAGE_KEYS.TICKETS, JSON.stringify([]));
    }
    if (!localStorage.getItem(HELP_STORAGE_KEYS.CHAT_MESSAGES)) {
      localStorage.setItem(HELP_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify({}));
    }
    if (!localStorage.getItem(HELP_STORAGE_KEYS.FEATURE_VOTES)) {
      localStorage.setItem(HELP_STORAGE_KEYS.FEATURE_VOTES, JSON.stringify({}));
    }
  }

  bindGlobalEvents() {
    // Sidebar toggle
    const toggle = document.querySelector('.help-sidebar-toggle');
    const sidebar = document.querySelector('.help-sidebar');
    const overlay = document.querySelector('.help-sidebar-overlay');

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

    // Close sidebar on link click (mobile)
    document.querySelectorAll('.help-sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          sidebar?.classList.remove('open');
          overlay?.classList.remove('active');
        }
      });
    });

    // Header search
    const headerSearch = document.querySelector('.help-header-search input');
    if (headerSearch) {
      headerSearch.addEventListener('input', (e) => this.handleSearch(e.target.value));
      headerSearch.addEventListener('focus', () => {
        const results = document.querySelector('.help-search-results');
        if (results && headerSearch.value.length > 0) results.classList.add('active');
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.help-header-search')) {
          document.querySelector('.help-search-results')?.classList.remove('active');
        }
      });
    }

    // Theme sync
    this.syncTheme();
    document.addEventListener('themechange', () => this.syncTheme());
  }

  syncTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    document.querySelectorAll('.help-header-btn[data-theme-toggle]').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
    });
  }

  handleSearch(query) {
    const resultsContainer = document.querySelector('.help-search-results');
    if (!resultsContainer) return;

    if (query.length < 2) {
      resultsContainer.classList.remove('active');
      return;
    }

    const results = this.searchAll(query);
    this.renderSearchResults(results, resultsContainer);
    resultsContainer.classList.add('active');
  }

  searchAll(query) {
    const lower = query.toLowerCase();
    const results = [];

    // Search documentation
    HELP_DATA.documentation.forEach(section => {
      section.articles.forEach(article => {
        if (article.title.toLowerCase().includes(lower)) {
          results.push({
            title: article.title,
            desc: `In ${section.title}`,
            category: 'Documentation',
            link: `documentation.html?article=${article.id}`
          });
        }
      });
    });

    // Search FAQ
    HELP_DATA.faq.forEach(item => {
      if (item.question.toLowerCase().includes(lower) || item.answer.toLowerCase().includes(lower)) {
        results.push({
          title: item.question,
          desc: item.answer.substring(0, 100) + '...',
          category: 'FAQ',
          link: `faq.html#faq-${item.id}`
        });
      }
    });

    // Search tutorials
    HELP_DATA.tutorials.forEach(tutorial => {
      if (tutorial.title.toLowerCase().includes(lower)) {
        results.push({
          title: tutorial.title,
          desc: `${tutorial.duration} • ${tutorial.views} views`,
          category: 'Tutorials',
          link: `tutorials.html?tutorial=${tutorial.id}`
        });
      }
    });

    return results.slice(0, 8);
  }

  renderSearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="help-search-result"><div class="help-search-result-title">No results found</div><div class="help-search-result-desc">Try a different search term</div></div>';
      return;
    }

    container.innerHTML = results.map(r => `
      <a href="${r.link}" class="help-search-result">
        <div class="help-search-result-title">${this.highlightText(r.title)}</div>
        <div class="help-search-result-desc">${r.desc}</div>
        <div class="help-search-result-category">${r.category}</div>
      </a>
    `).join('');
  }

  highlightText(text) {
    const query = document.querySelector('.help-header-search input')?.value;
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: var(--primary-100); color: var(--primary-700); border-radius: 2px; padding: 0 2px;">$1</mark>');
  }

  // Tickets
  getTickets() {
    try {
      return JSON.parse(localStorage.getItem(HELP_STORAGE_KEYS.TICKETS)) || [];
    } catch {
      return [];
    }
  }

  saveTickets(tickets) {
    localStorage.setItem(HELP_STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }

  createTicket(data) {
    const tickets = this.getTickets();
    const ticket = {
      id: `TICKET-${Date.now()}`,
      ...data,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tickets.unshift(ticket);
    this.saveTickets(tickets);
    return ticket;
  }

  updateTicketStatus(id, status) {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      this.saveTickets(tickets);
    }
    return ticket;
  }

  // Chat
  getChatMessages(conversationId) {
    const all = JSON.parse(localStorage.getItem(HELP_STORAGE_KEYS.CHAT_MESSAGES) || '{}');
    return all[conversationId] || HELP_DATA.chatMessages[conversationId] || [];
  }

  saveChatMessage(conversationId, message) {
    const all = JSON.parse(localStorage.getItem(HELP_STORAGE_KEYS.CHAT_MESSAGES) || '{}');
    if (!all[conversationId]) all[conversationId] = [];
    all[conversationId].push({
      id: Date.now(),
      ...message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem(HELP_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(all));
  }

  // Feature Votes
  getVotes() {
    try {
      return JSON.parse(localStorage.getItem(HELP_STORAGE_KEYS.FEATURE_VOTES)) || {};
    } catch {
      return {};
    }
  }

  toggleVote(featureId) {
    const votes = this.getVotes();
    const hasVoted = votes[featureId];

    if (hasVoted) {
      delete votes[featureId];
      this.toast.show('Vote removed', 'success');
    } else {
      votes[featureId] = true;
      this.toast.show('Vote added!', 'success');
    }

    localStorage.setItem(HELP_STORAGE_KEYS.FEATURE_VOTES, JSON.stringify(votes));
    return !hasVoted;
  }

  hasVoted(featureId) {
    return !!this.getVotes()[featureId];
  }

  // Copy to clipboard
  async copyToClipboard(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check"></i> Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 2000);
      }
      this.toast.show('Copied to clipboard!', 'success');
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.toast.show('Copied to clipboard!', 'success');
    }
  }

  // Modal
  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Pagination
  paginate(items, page, perPage = 10) {
    const total = items.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const paginated = items.slice(start, start + perPage);
    return { items: paginated, total, totalPages, page, perPage };
  }

  renderPagination(container, currentPage, totalPages, callback) {
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    
    // Prev
    html += `<button class="help-pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
      <i class="ph ph-caret-left"></i>
    </button>`;

    // Pages
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += `<button class="help-pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        html += `<span class="help-pagination-btn" style="cursor: default;">...</span>`;
      }
    }

    // Next
    html += `<button class="help-pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
      <i class="ph ph-caret-right"></i>
    </button>`;

    container.innerHTML = html;

    container.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page >= 1 && page <= totalPages) callback(page);
      });
    });
  }
}

// Initialize
const helpManager = new HelpCenterManager();
window.OPHelp = helpManager;

// Expose for inline handlers
window.openModal = (id) => helpManager.openModal(id);
window.closeModal = (id) => helpManager.closeModal(id);
window.copyCode = (btn) => {
  const pre = btn.closest('.code-block')?.querySelector('pre') || btn.closest('.help-api-endpoint')?.querySelector('pre');
  if (pre) helpManager.copyToClipboard(pre.textContent, btn);
};