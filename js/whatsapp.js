/**
 * OnePlace Enterprise v3.0 — WhatsApp Business Module (WPPConnect Server)
 * Vanilla JavaScript (ES6+)
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

class WhatsAppStorage {
  constructor() { this.init(); }

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

  getContacts() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CONTACTS) || '[]'); }
  getContactById(id) { return this.getContacts().find(c => c.id === id); }

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
    return this.getConversations().find(c => c.id === id);
  }

  getMessages(conversationId) {
    const allMessages = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES) || '{}');
    return allMessages[conversationId] || [];
  }

  addMessage(conversationId, message) {
    const allMessages = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES) || '{}');
    if (!allMessages[conversationId]) allMessages[conversationId] = [];
    message.id = message.id || 'm_' + Date.now();
    message.time = message.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    allMessages[conversationId].push(message);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES, JSON.stringify(allMessages));

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

  upsertMessage(conversationId, message) {
    const allMessages = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES) || '{}');
    if (!allMessages[conversationId]) allMessages[conversationId] = [];
    const list = allMessages[conversationId];
    if (message.id && list.some(m => m.id === message.id)) return null;
    if (!message.id) message.id = 'm_' + Date.now();
    if (!message.time) message.time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    list.push(message);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES, JSON.stringify(allMessages));

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

  upsertConversation(conversation) {
    const conversations = JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS) || '[]');
    const idx = conversations.findIndex(c => c.id === conversation.id);
    if (idx !== -1) {
      conversations[idx] = { ...conversations[idx], ...conversation };
    } else {
      conversations.push(conversation);
    }
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS, JSON.stringify(conversations));
  }

  upsertContact(contact) {
    const contacts = this.getContacts();
    const idx = contacts.findIndex(c => c.id === contact.id);
    if (idx !== -1) {
      contacts[idx] = { ...contacts[idx], ...contact };
    } else {
      contacts.push(contact);
    }
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONTACTS, JSON.stringify(contacts));
  }

  getTemplates() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_TEMPLATES) || '[]'); }

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

  getQuickReplies() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_QUICK_REPLIES) || '[]'); }

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

  getCatalog() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_CATALOG) || '[]'); }

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

  getSettings() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_SETTINGS) || '{}'); }

  updateSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_SETTINGS, JSON.stringify(updated));
    return updated;
  }

  getIntegration() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_INTEGRATION) || '{}'); }

  updateIntegration(data) {
    const current = this.getIntegration();
    const updated = { ...current, ...data };
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_INTEGRATION, JSON.stringify(updated));
    return updated;
  }

  getLabels() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_LABELS) || '[]'); }

  addLabel(label) {
    const labels = this.getLabels();
    label.id = 'lbl_' + Date.now();
    labels.push(label);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_LABELS, JSON.stringify(labels));
    return label;
  }

  getBroadcasts() { return JSON.parse(localStorage.getItem(WA_STORAGE_KEYS.WHATSAPP_BROADCASTS) || '[]'); }

  addBroadcast(broadcast) {
    const broadcasts = this.getBroadcasts();
    broadcast.id = 'wa_b' + Date.now();
    broadcast.sentAt = new Date().toISOString();
    broadcast.status = 'sent';
    broadcasts.unshift(broadcast);
    localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_BROADCASTS, JSON.stringify(broadcasts));
    return broadcast;
  }

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

class WhatsAppApp {
  constructor() {
    this.storage = new WhatsAppStorage();
    this.currentConversation = null;
    this.currentFilter = '';
    this.currentSearch = '';
    this.sidebarOpen = false;
    this.session = null;
    this.lastEventSeq = 0;
    this.statusPollTimer = null;
    this.eventPollTimer = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    this.renderConversations();
    await this.loadBackendStatus();

    if (this.session?.connected) {
      await this.fetchAndStoreLiveData();
      this.renderConversations();
      const conversations = this.storage.getConversations();
      if (conversations.length > 0) {
        this.selectConversation(conversations[0].id);
      }
      this.startEventPolling();
    } else {
      this.renderConversations();
      if (this.session?.qr) this.displayQr(this.session.qr);
    }
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
        this.renderConversations();
      });
    }

    const convSearch = document.getElementById('conversation-search');
    if (convSearch) {
      convSearch.addEventListener('input', (e) => {
        this.currentSearch = e.target.value;
        this.renderConversations();
      });
    }

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

    const createBtn = document.getElementById('create-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const menu = document.getElementById('create-menu');
        if (menu) menu.classList.toggle('active');
      });
    }

    const connectBtn = document.querySelector('.wa-view-integration-btn');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        if (this.session?.connected) {
          this.disconnectSession();
        } else if (this.session?.connectionStatus === 'qrReadSuccess' || this.session?.connectionStatus === 'connecting') {
          this.reconnectSession();
        } else {
          this.connectSession();
        }
      });
    }

    const attachBtn = document.querySelector('.wa-input-action[title="Attachment"]');
    if (attachBtn) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.style.display = 'none';
      fileInput.id = 'wa-attachment-input';
      document.body.appendChild(fileInput);

      attachBtn.addEventListener('click', () => {
        if (!this.currentConversation) {
          if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('Select a conversation first.', 'info');
          return;
        }
        fileInput.click();
      });
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        fileInput.value = '';
        if (file) this.sendMediaMessage(file);
      });
    }

    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('Notifications panel would open here', 'info');
      });
    }

    const userBtn = document.getElementById('user-menu-btn');
    if (userBtn) {
      userBtn.addEventListener('click', () => {
        if (confirm('Sign out of OnePlace Enterprise?')) {
          if (typeof OP !== 'undefined' && OP.auth) OP.auth.signOut();
          window.location.href = '../auth/signin.html';
        }
      });
    }

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

    document.querySelectorAll('.wa-chat-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.wa-chat-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#create-btn') && !e.target.closest('#create-menu')) {
        const menu = document.getElementById('create-menu');
        if (menu) menu.classList.remove('active');
      }
    });
  }

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
    list.querySelectorAll('.wa-conversation-item').forEach(item => {
      item.addEventListener('click', () => this.selectConversation(item.dataset.id));
    });
  }

  selectConversation(id) {
    this.currentConversation = id;
    this.storage.markConversationRead(id);
    document.querySelectorAll('.wa-conversation-item').forEach(item => {
      item.classList.toggle('active', item.dataset.id === id);
      item.classList.remove('unread');
    });
    this.renderChatHeader(id);
    this.renderChatMessages(id);
    this.renderContactPanel(id);
  }

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
            ${msg.media ? this.renderMediaAttachment(msg) : ''}
            <div class="wa-message-text">${this.escapeHtml(msg.text || '').replace(/\n/g, '<br>')}</div>
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
    this.hydrateMediaAttachments(container);
  }

  renderMediaAttachment(msg) {
    const media = msg.media || {};
    const isImage = (media.mimetype || '').startsWith('image/') || media.type === 'image';
    const isAudio = (media.mimetype || '').startsWith('audio/') || media.type === 'ptt';

    if (!media.messageId) {
      return `<div class="wa-media-attachment"><i class="ph ph-file"></i> ${this.escapeHtml(media.filename || 'Attachment')}</div>`;
    }
    if (isImage) {
      return `<div class="wa-media-attachment wa-media-image" data-media-id="${this.escapeHtml(media.messageId)}" data-media-kind="image"><i class="ph ph-image"></i> Loading image...</div>`;
    }
    if (isAudio) {
      return `<div class="wa-media-attachment" data-media-id="${this.escapeHtml(media.messageId)}" data-media-kind="audio"><i class="ph ph-microphone"></i> Loading voice message...</div>`;
    }
    return `<div class="wa-media-attachment" data-media-id="${this.escapeHtml(media.messageId)}" data-media-kind="file"><i class="ph ph-file-arrow-down"></i> ${this.escapeHtml(media.filename || 'Download attachment')}</div>`;
  }

  hydrateMediaAttachments(container) {
    if (!window.OP || !window.OP.whatsappService) return;
    container.querySelectorAll('[data-media-id]').forEach(el => {
      const messageId = el.getAttribute('data-media-id');
      const kind = el.getAttribute('data-media-kind');
      window.OP.whatsappService.downloadMedia(messageId)
        .then(resp => {
          const dataUrl = resp && resp.dataUrl;
          if (!dataUrl) return;
          if (kind === 'image') {
            el.innerHTML = `<img src="${dataUrl}" alt="image" style="max-width:240px; border-radius:8px; display:block;" />`;
          } else if (kind === 'audio') {
            el.innerHTML = `<audio controls src="${dataUrl}" style="max-width:240px;"></audio>`;
          } else {
            el.innerHTML = `<a href="${dataUrl}" download class="wa-media-download"><i class="ph ph-file-arrow-down"></i> Download attachment</a>`;
          }
        })
        .catch(() => {
          el.innerHTML = '<i class="ph ph-warning"></i> Media unavailable';
        });
    });
  }

  renderContactPanel(conversationId) {
    const panel = document.getElementById('contact-panel');
    if (!panel) return;
    const conv = this.storage.getConversationById(conversationId);
    if (!conv) return;
    const contact = conv.contact || {};
    const labels = this.storage.getLabels();
    const contactLabels = contact.tags || [];
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

  resolveChatId(conversationId) {
    const conv = this.storage.getConversationById(conversationId);
    return conv?.chatId || conv?.contact?.phone || conversationId;
  }

  async sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !this.currentConversation) return;
    const text = input.value.trim();
    if (!text) return;

    if (!this.session?.connected) {
      if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('WhatsApp is not connected.', 'error');
      return;
    }

    const to = this.resolveChatId(this.currentConversation);
    input.value = '';

    this.storage.upsertMessage(this.currentConversation, {
      id: 'local_' + Date.now(),
      type: 'sent',
      text: text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    });
    this.renderChatMessages(this.currentConversation);
    this.renderConversations();

    try {
      await window.OP.whatsappService.sendText(to, text);
    } catch (error) {
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show(error?.message || 'Failed to send WhatsApp message.', 'error');
      }
    }
  }

  async sendMediaMessage(file) {
    if (!this.session?.connected) {
      if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('WhatsApp is not connected.', 'error');
      return;
    }

    const to = this.resolveChatId(this.currentConversation);
    const caption = (document.getElementById('chat-input')?.value || '').trim();
    const input = document.getElementById('chat-input');
    if (input) input.value = '';

    try {
      if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('Uploading attachment...', 'info');
      const media = await window.OP.whatsappService.fileToMedia(file);
      await window.OP.whatsappService.sendMedia(to, { ...media, caption });

      this.storage.upsertMessage(this.currentConversation, {
        id: 'local_' + Date.now(),
        type: 'sent',
        text: caption || `[${file.name}]`,
        media: { mimetype: file.type, filename: file.name, type: media.kind },
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      });
      this.renderChatMessages(this.currentConversation);
      this.renderConversations();
    } catch (error) {
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show(error?.message || 'Failed to send attachment.', 'error');
      }
    }
  }

  async loadBackendStatus() {
    try {
      if (!window.OP || !window.OP.whatsappService) {
        this.renderConnectionStatus(null);
        return;
      }
      const status = await window.OP.whatsappService.status();
      this.session = status;
      this.renderConnectionStatus(status);
    } catch (error) {
      this.session = null;
      this.renderConnectionStatus(null);
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show('Unable to reach the WhatsApp service. Make sure the service is running.', 'error');
      }
    }
  }

  mapChatToConversation(chat) {
    const chatId = chat.id || String(chat.chatId || '');
    const contact = chat.contact || {};
    const name = chat.name || contact.name || contact.pushname || contact.shortName || chatId.replace(/@.*$/, '');
    const lastMsg = chat.lastMessage || {};
    const timestamp = chat.t
      ? new Date(chat.t * 1000).toISOString()
      : (lastMsg.timestamp ? new Date(lastMsg.timestamp * 1000).toISOString() : new Date().toISOString());

    return {
      id: chatId,
      chatId,
      contactId: chatId,
      unread: chat.unreadCount || 0,
      tag: chat.isGroup ? 'group' : '',
      lastMessage: lastMsg.body || chat.lastMessagePreview || '',
      timestamp,
      status: 'open',
      contact: {
        id: chatId,
        name,
        phone: chatId.replace(/@.*$/, ''),
        color: '#25D366'
      }
    };
  }

  mapServiceMessage(m) {
    return {
      id: m.id,
      type: m.fromMe ? 'sent' : 'received',
      text: m.body || (m.hasMedia ? `[${m.filename || m.type || 'media'}]` : ''),
      media: m.hasMedia ? { messageId: m.id, mimetype: m.mimetype, filename: m.filename, type: m.type } : null,
      time: new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: m.fromMe ? 'delivered' : 'read'
    };
  }

  async fetchAndStoreLiveData() {
    try {
      const chatsResp = await window.OP.whatsappService.chats();
      const chats = chatsResp.chats || [];
      const conversations = chats
        .map(chat => this.mapChatToConversation(chat))
        .filter(c => c.id);

      const contacts = conversations.map(c => c.contact);
      localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONTACTS, JSON.stringify(contacts));
      localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_CONVERSATIONS, JSON.stringify(conversations));

      const messagesStore = {};
      for (const conv of conversations) {
        try {
          const resp = await window.OP.whatsappService.chatMessages(conv.chatId, 50);
          messagesStore[conv.id] = (resp.messages || []).map(m => this.mapServiceMessage(m));
        } catch (err) {
          messagesStore[conv.id] = [];
        }
      }
      localStorage.setItem(WA_STORAGE_KEYS.WHATSAPP_MESSAGES, JSON.stringify(messagesStore));
    } catch (err) {
      if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('Failed to load WhatsApp data from the service.', 'error');
    }
  }

  startEventPolling() {
    this.stopEventPolling();
    this.eventPollTimer = setInterval(async () => {
      try {
        const resp = await window.OP.whatsappService.events(this.lastEventSeq);
        this.lastEventSeq = resp.lastSeq || this.lastEventSeq;

        if (resp.connected === false && this.session?.connected) {
          this.session.connected = false;
          this.renderConnectionStatus(this.session);
          this.stopEventPolling();
        }

        if (Array.isArray(resp.events) && resp.events.length) {
          this.handleServiceEvents(resp.events);
        }
      } catch (error) {
        // transient failure
      }
    }, 4000);
  }

  stopEventPolling() {
    if (this.eventPollTimer) {
      clearInterval(this.eventPollTimer);
      this.eventPollTimer = null;
    }
  }

  handleServiceEvents(events) {
    let listChanged = false;

    events.filter(e => e && e.type === 'message' && e.message).forEach(e => {
      const m = e.message;
      const chatId = m.chatId;
      if (!chatId) return;

      let conv = this.storage.getConversationById(chatId);
      if (!conv) {
        const name = (m.sender && (m.sender.name || m.sender.pushname)) || chatId.replace(/@.*$/, '');
        this.storage.upsertContact({ id: chatId, name, phone: chatId.replace(/@.*$/, ''), color: '#25D366' });
        this.storage.upsertConversation({
          id: chatId,
          chatId,
          contactId: chatId,
          unread: 0,
          tag: m.isGroupMsg ? 'group' : '',
          lastMessage: '',
          timestamp: new Date().toISOString(),
          status: 'open'
        });
      }

      const stored = this.storage.upsertMessage(chatId, this.mapServiceMessage(m));
      if (stored) {
        listChanged = true;
        if (this.currentConversation === chatId) {
          this.storage.markConversationRead(chatId);
          this.renderChatMessages(chatId);
        } else if (stored.type === 'received' && typeof OP !== 'undefined' && OP.toast) {
          OP.toast.show(`New WhatsApp message from ${(m.sender && (m.sender.name || m.sender.pushname)) || chatId.replace(/@.*$/, '')}`, 'info');
        }
      }
    });

    if (listChanged) this.renderConversations();
  }

  async connectSession() {
    try {
      if (!window.OP || !window.OP.whatsappService) {
        throw new Error('WhatsApp service client is unavailable.');
      }
      // Quick health check so network errors surface instantly
      try {
        await window.OP.whatsappService.status();
      } catch (healthErr) {
        if (healthErr.code === 'WHATSAPP_SERVICE_UNREACHABLE') throw healthErr;
      }

      this.renderConnectionStatus({ connectionStatus: 'connecting', connected: false });
      await window.OP.whatsappService.connect();
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show('WhatsApp connection started. Scan the QR code when it appears.', 'success');
      }
      this.startStatusPolling();
    } catch (error) {
      this.renderConnectionStatus(null);
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show(error?.message || 'Unable to connect WhatsApp.', 'error');
      }
    }
  }

  async reconnectSession() {
    try {
      if (!window.OP || !window.OP.whatsappService) {
        throw new Error('WhatsApp service client is unavailable.');
      }
      this.renderConnectionStatus({ connectionStatus: 'connecting', connected: false });
      await window.OP.whatsappService.reconnect();
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show('Reconnecting WhatsApp...', 'info');
      }
      this.startStatusPolling();
    } catch (error) {
      this.renderConnectionStatus(null);
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show(error?.message || 'Unable to reconnect WhatsApp.', 'error');
      }
    }
  }

  async disconnectSession() {
    try {
      await window.OP.whatsappService.disconnect();
      this.session = null;
      this.stopEventPolling();
      this.stopStatusPolling();
      this.renderConnectionStatus(null);
      if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('WhatsApp disconnected.', 'success');
    } catch (error) {
      if (typeof OP !== 'undefined' && OP.toast) {
        OP.toast.show(error?.message || 'Unable to disconnect WhatsApp.', 'error');
      }
    }
  }

  startStatusPolling() {
    this.stopStatusPolling();
    this.statusPollTimer = setInterval(async () => {
      try {
        const status = await window.OP.whatsappService.status();
        this.session = status;
        this.renderConnectionStatus(status);

        if (status.qr) this.displayQr(status.qr);

        if (status.connected) {
          this.stopStatusPolling();
          await this.fetchAndStoreLiveData();
          this.renderConversations();
          const conversations = this.storage.getConversations();
          if (conversations.length > 0 && !this.currentConversation) {
            this.selectConversation(conversations[0].id);
          }
          this.startEventPolling();
          if (typeof OP !== 'undefined' && OP.toast) OP.toast.show('WhatsApp connected.', 'success');
        }
      } catch (error) {
        // keep polling
      }
    }, 3000);
  }

  stopStatusPolling() {
    if (this.statusPollTimer) {
      clearInterval(this.statusPollTimer);
      this.statusPollTimer = null;
    }
  }

  displayQr(qrData) {
    const accountCard = document.querySelector('.wa-account-card');
    if (!accountCard) return;
    let container = accountCard.querySelector('.wa-qr-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'wa-qr-container';
      container.style.marginTop = '12px';
      accountCard.appendChild(container);
    }
    let src = qrData;
    if (!/^data:/.test(qrData) && qrData && qrData.length > 0) {
      if (/^([A-Za-z0-9+/=\n])+$/.test(qrData.replace(/\s+/g, ''))) {
        src = 'data:image/png;base64,' + qrData.replace(/\s+/g, '');
      }
    }
    container.innerHTML = `<img src="${src}" alt="WhatsApp QR" style="width:160px;height:160px;object-fit:contain;border-radius:6px;" />`;
  }

  renderConnectionStatus(status) {
    const accountStatus = document.querySelector('.wa-account-status span:last-child');
    const accountName = document.querySelector('.wa-account-name');
    const accountPhone = document.querySelector('.wa-account-phone');
    const statusDot = document.querySelector('.wa-account-status .wa-status-dot');
    const connectBtn = document.querySelector('.wa-view-integration-btn');

    const connected = !!(status && status.connected);
    const connecting = !!(status && !status.connected && status.connectionStatus &&
      !['notLogged', 'disconnected'].includes(String(status.connectionStatus)));
    const label = connected ? 'Connected' : connecting ? (status.statusText || 'Connecting') : 'Disconnected';

    if (accountStatus) accountStatus.textContent = label;
    if (statusDot) statusDot.style.background = connected ? '#22c55e' : connecting ? '#f59e0b' : '#ef4444';

    if (accountName) {
      const profile = status && status.account && (status.account.profile || status.account.device);
      accountName.textContent = connected
        ? (profile && (profile.pushname || profile.name || profile.displayName)) || 'WhatsApp account'
        : 'Not connected';
    }

    if (accountPhone) {
      const wid = status && status.account && status.account.wid;
      const widStr = wid ? String(wid._serialized || wid.user || wid) : '';
      accountPhone.textContent = connected && widStr ? widStr.replace(/@.*$/, '') : (connected ? '' : 'Connect a WhatsApp account to begin');
    }

    if (connectBtn) {
      connectBtn.textContent = connected ? 'Disconnect' : (connecting ? 'Reconnect' : 'Connect WhatsApp');
    }

    if (connected) {
      const qrContainer = document.querySelector('.wa-qr-container');
      if (qrContainer) qrContainer.remove();
    }
  }

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

window.WhatsAppApp = WhatsAppApp;
window.WhatsAppStorage = WhatsAppStorage;

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.whatsapp-layout')) {
    if (typeof OP !== 'undefined' && OP.nav && OP.nav.requireAuth) {
      if (!OP.nav.requireAuth()) return;
    }
    window.waApp = new WhatsAppApp();
  }
});