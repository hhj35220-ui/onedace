/**
 * OnePlace Enterprise v3.0 — Unified Inbox Module
 * Vanilla JavaScript (ES6+)
 */

class UnifiedInbox {
  constructor() {
    this.storage = new DashboardStorage();
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.currentSort = 'newest';
    this.selectedConversationId = null;
    this.currentReplyTab = 'reply';
    this.detailsOpen = true;
    this.dropdownOpen = null;
    this.conversations = [];
    this.teamMembers = [];
    this.init();
  }

  init() {
    this.teamMembers = this.storage.getTeamMembers();
    this.conversations = this.storage.getConversations();

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    const validFilters = ['all', 'unread', 'starred', 'assigned', 'archived', 'spam', 'trash', 'gmail', 'whatsapp', 'instagram', 'tiktok', 'x', 'linkedin'];
    if (filter && validFilters.includes(filter)) {
      this.currentFilter = filter;
    }

    this.bindEvents();
    this.renderConversationList();

    // Select first unread or first conversation
    const firstUnread = this.conversations.find(c => c.unread);
    if (firstUnread) {
      this.selectConversation(firstUnread.id);
    } else if (this.conversations.length > 0) {
      this.selectConversation(this.conversations[0].id);
    }
  }

  // ============================================
  // Data Operations
  // ============================================
  getFilteredConversations() {
    let filtered = [...this.conversations];

    // Apply filter
    if (this.currentFilter !== 'all') {
      const filterMap = {
        'unread': c => c.unread,
        'starred': c => c.starred,
        'assigned': c => c.assignedTo === this.getCurrentUserId(),
        'archived': c => c.status === 'archived',
        'spam': c => c.status === 'spam',
        'trash': c => c.status === 'trash'
      };

      if (filterMap[this.currentFilter]) {
        filtered = filtered.filter(filterMap[this.currentFilter]);
      } else if (['gmail', 'whatsapp', 'instagram', 'tiktok', 'x', 'linkedin'].includes(this.currentFilter)) {
        filtered = filtered.filter(c => c.platform === this.currentFilter);
      }
    } else {
      // Default 'all' excludes archived, spam, trash
      filtered = filtered.filter(c => !['archived', 'spam', 'trash'].includes(c.status));
    }

    // Apply search
    if (this.currentSearch) {
      const q = this.currentSearch.toLowerCase();
      filtered = filtered.filter(c =>
        c.customer.name.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        (c.messages && c.messages.some(m => m.text.toLowerCase().includes(q)))
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (this.currentSort) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'unread':
          return (b.unread ? 1 : 0) - (a.unread ? 1 : 0);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    return filtered;
  }

  getCurrentUserId() {
    const session = OP.auth.getSession();
    return session?.userId || 'tm1';
  }

  getConversationById(id) {
    return this.conversations.find(c => c.id === id);
  }

  getTeamMemberById(id) {
    return this.teamMembers.find(m => m.id === id);
  }

  // ============================================
  // Render Conversation List
  // ============================================
  renderConversationList() {
    this.updateActiveFilterTab();
    const container = document.getElementById('inbox-conversation-list');
    const filtered = this.getFilteredConversations();

    // Update count
    const countEl = document.getElementById('inbox-list-count');
    if (countEl) {
      countEl.textContent = `${filtered.length} conversation${filtered.length !== 1 ? 's' : ''}`;
    }

    // Update tab counts
    this.updateTabCounts();

    if (filtered.length === 0) {
      container.innerHTML = this.renderEmptyState();
      return;
    }

    container.innerHTML = filtered.map(conv => this.renderConversationItem(conv)).join('');

    // Bind click events
    container.querySelectorAll('.inbox-conversation-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.inbox-conversation-star')) return;
        this.selectConversation(item.dataset.id);
      });
    });

    // Bind star events
    container.querySelectorAll('.inbox-conversation-star').forEach(star => {
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleStar(star.dataset.id);
      });
    });
  }

  renderConversationItem(conv) {
    const timeAgo = this.formatTimeAgo(conv.timestamp);
    const member = this.getTeamMemberById(conv.assignedTo);
    const isActive = this.selectedConversationId === conv.id;
    const unreadCount = conv.unreadMessages || (conv.unread ? 1 : 0);

    return `
      <div class="inbox-conversation-item ${conv.unread ? 'unread' : ''} ${isActive ? 'active' : ''}" data-id="${conv.id}">
        <div class="inbox-conversation-avatar" style="background: ${conv.customer.color}">
          ${conv.customer.avatar}
          <span class="inbox-conversation-platform-badge ${conv.platform}">
            <i class="ph ${this.getPlatformIcon(conv.platform)}"></i>
          </span>
        </div>
        <div class="inbox-conversation-body">
          <div class="inbox-conversation-top">
            <div class="inbox-conversation-name">
              ${conv.customer.name}
              ${conv.unread ? '<span class="unread-dot"></span>' : ''}
            </div>
            <span class="inbox-conversation-time">${timeAgo}</span>
          </div>
          <div class="inbox-conversation-preview">${this.escapeHtml(conv.message)}</div>
          <div class="inbox-conversation-meta">
            <span class="inbox-conversation-badge priority-${conv.priority}">${conv.priority}</span>
            <span class="inbox-conversation-badge status-${conv.status}">${conv.status.replace('-', ' ')}</span>
            ${member ? `
              <span class="inbox-conversation-assigned">
                <span class="assigned-avatar" style="background: ${member.color}">${member.avatar}</span>
                <span>${member.name.split(' ')[0]}</span>
              </span>
            ` : ''}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          ${unreadCount > 0 ? `<span class="inbox-conversation-unread-badge">${unreadCount}</span>` : ''}
          <span class="inbox-conversation-star ${conv.starred ? 'starred' : ''}" data-id="${conv.id}">
            <i class="ph ${conv.starred ? 'ph-star-fill' : 'ph-star'}"></i>
          </span>
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    const filterLabels = {
      all: 'No conversations yet',
      unread: 'No unread conversations',
      starred: 'No starred conversations',
      assigned: 'No conversations assigned to you',
      archived: 'No archived conversations',
      spam: 'No spam conversations',
      trash: 'No deleted conversations',
      gmail: 'No Gmail conversations',
      whatsapp: 'No WhatsApp conversations',
      instagram: 'No Instagram conversations',
      tiktok: 'No TikTok conversations',
      x: 'No X conversations',
      linkedin: 'No LinkedIn conversations'
    };

    return `
      <div class="inbox-empty-state">
        <div class="inbox-empty-state-icon"><i class="ph ph-inbox"></i></div>
        <div class="inbox-empty-state-title">${filterLabels[this.currentFilter] || 'No conversations'}</div>
        <div class="inbox-empty-state-desc">Try adjusting your filters or search terms.</div>
      </div>
    `;
  }

  updateTabCounts() {
    const allConvs = this.conversations;
    const counts = {
      all: allConvs.filter(c => !['archived', 'spam', 'trash'].includes(c.status)).length,
      unread: allConvs.filter(c => c.unread).length,
      starred: allConvs.filter(c => c.starred).length,
      assigned: allConvs.filter(c => c.assignedTo === this.getCurrentUserId()).length,
      gmail: allConvs.filter(c => c.platform === 'gmail').length,
      whatsapp: allConvs.filter(c => c.platform === 'whatsapp').length,
      instagram: allConvs.filter(c => c.platform === 'instagram').length,
      tiktok: allConvs.filter(c => c.platform === 'tiktok').length,
      x: allConvs.filter(c => c.platform === 'x').length,
      linkedin: allConvs.filter(c => c.platform === 'linkedin').length
    };

    document.querySelectorAll('.inbox-filter-tab').forEach(tab => {
      const filter = tab.dataset.filter;
      const countEl = tab.querySelector('.tab-count');
      if (countEl && counts[filter] !== undefined) {
        countEl.textContent = counts[filter];
      }
    });
  }

  updateActiveFilterTab() {
    document.querySelectorAll('.inbox-filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === this.currentFilter);
    });
  }

  // ============================================
  // Select & Render Conversation
  // ============================================
  selectConversation(id) {
    const conv = this.getConversationById(id);
    if (!conv) return;

    this.selectedConversationId = id;

    // Mark as read
    if (conv.unread) {
      conv.unread = false;
      conv.unreadMessages = 0;
      this.saveConversations();
      this.updateNotifications();
    }

    // Update active state in list
    document.querySelectorAll('.inbox-conversation-item').forEach(item => {
      item.classList.toggle('active', item.dataset.id === id);
      if (item.dataset.id === id) {
        item.classList.remove('unread');
      }
    });

    // Render conversation view
    this.renderConversationView(conv);
    this.renderDetailsPanel(conv);
  }

  renderConversationView(conv) {
    const container = document.getElementById('conversation-view');
    const member = this.getTeamMemberById(conv.assignedTo);

    container.innerHTML = `
      <!-- Header -->
      <div class="conversation-view-header">
        <div class="conversation-view-header-left">
          <div class="conversation-view-avatar" style="background: ${conv.customer.color}">
            ${conv.customer.avatar}
          </div>
          <div class="conversation-view-info">
            <div class="conversation-view-name">${conv.customer.name}</div>
            <div class="conversation-view-email">${conv.customer.email || conv.customer.name.toLowerCase().replace(' ', '.') + '@example.com'}</div>
            <span class="conversation-view-status status-${conv.status}">
              <span class="conversation-view-status-dot"></span>
              ${conv.status.replace('-', ' ')}
            </span>
          </div>
        </div>
        <div class="conversation-view-header-right">
          <button class="conversation-view-action" id="action-star" title="${conv.starred ? 'Unstar' : 'Star'}">
            <i class="ph ${conv.starred ? 'ph-star-fill' : 'ph-star'}"></i>
          </button>
          <button class="conversation-view-action" id="action-archive" title="Archive">
            <i class="ph ph-archive"></i>
          </button>
          <button class="conversation-view-action" id="action-spam" title="Mark as Spam">
            <i class="ph ph-warning-circle"></i>
          </button>
          <button class="conversation-view-action" id="action-more" title="More actions">
            <i class="ph ph-dots-three-vertical"></i>
          </button>
          <button class="conversation-view-action" id="action-toggle-details" title="Toggle details">
            <i class="ph ph-sidebar-simple"></i>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="conversation-messages" id="conversation-messages">
        ${this.renderMessages(conv)}
      </div>

      <!-- Reply Area -->
      <div class="conversation-reply">
        <button class="ai-reply-btn" id="ai-reply-btn">
          <i class="ph ph-sparkle"></i>
          <span>Generate AI Reply</span>
        </button>
        <div class="reply-tabs">
          <button class="reply-tab active" data-tab="reply">
            <i class="ph ph-chat-circle-text"></i> Reply
          </button>
          <button class="reply-tab" data-tab="note">
            <i class="ph ph-notebook"></i> Internal Note
          </button>
        </div>
        <div class="reply-input-wrapper">
          <textarea class="reply-textarea" id="reply-textarea" placeholder="Type your message..." rows="1"></textarea>
          <div class="reply-actions">
            <button class="reply-action-btn" title="Add attachment">
              <i class="ph ph-paperclip"></i>
            </button>
            <button class="reply-action-btn" title="Add emoji">
              <i class="ph ph-smiley"></i>
            </button>
            <button class="reply-send-btn" id="reply-send-btn" title="Send">
              <i class="ph ph-paper-plane-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Scroll to bottom
    const messagesContainer = document.getElementById('conversation-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Bind reply events
    this.bindReplyEvents(conv);
    this.bindHeaderActions(conv);
  }

  renderMessages(conv) {
    const messages = conv.messages || this.generateMessages(conv);
    if (!conv.messages) {
      conv.messages = messages;
      this.saveConversations();
    }

    let html = '';
    let lastDate = null;

    messages.forEach(msg => {
      const msgDate = new Date(msg.timestamp).toDateString();
      if (msgDate !== lastDate) {
        html += `<div class="conversation-date-divider"><span>${this.formatDateDivider(msg.timestamp)}</span></div>`;
        lastDate = msgDate;
      }

      html += this.renderMessageBubble(msg);
    });

    return html;
  }

  renderMessageBubble(msg) {
    const time = this.formatMessageTime(msg.timestamp);
    const isInternal = msg.type === 'internal';
    const isOutgoing = msg.sender === 'agent' || msg.sender === 'me';
    const bubbleClass = isInternal ? 'internal' : (isOutgoing ? 'outgoing' : 'incoming');

    let avatar = '';
    if (!isInternal) {
      const bg = isOutgoing ? 'linear-gradient(135deg, var(--primary-500), var(--primary-700))' : msg.avatarColor || '#6366f1';
      const text = isOutgoing ? 'SM' : msg.avatar || 'C';
      avatar = `<div class="message-avatar" style="background: ${bg}">${text}</div>`;
    }

    let attachmentsHtml = '';
    if (msg.attachments && msg.attachments.length > 0) {
      attachmentsHtml = `<div class="message-attachments">${msg.attachments.map(att => `
        <div class="message-attachment">
          <div class="message-attachment-icon"><i class="ph ${att.icon || 'ph-file'}"></i></div>
          <div class="message-attachment-info">
            <div class="message-attachment-name">${att.name}</div>
            <div class="message-attachment-size">${att.size}</div>
          </div>
          <div class="message-attachment-download"><i class="ph ph-download-simple"></i></div>
        </div>
      `).join('')}</div>`;
    }

    const readStatus = isOutgoing ? `
      <span class="message-status ${msg.read ? 'read' : ''}">
        <i class="ph ${msg.read ? 'ph-checks' : 'ph-check'}"></i>
      </span>
    ` : '';

    return `
      <div class="message-bubble ${bubbleClass}">
        ${avatar}
        <div class="message-content">
          <div class="message-text">${this.escapeHtml(msg.text)}</div>
          ${attachmentsHtml}
          <div class="message-meta">
            <span>${time}</span>
            ${readStatus}
          </div>
        </div>
      </div>
    `;
  }

  generateMessages(conv) {
    const messages = [];
    const baseTime = new Date(conv.timestamp);
    const customerName = conv.customer.name;
    const customerInitials = conv.customer.avatar;
    const customerColor = conv.customer.color;

    // Generate a realistic conversation thread
    const threadTemplates = [
      {
        incoming: [
          { text: `Hi, I wanted to follow up on the project proposal we discussed yesterday. Please let me know if you need any additional information.`, delay: -3600000 },
          { text: `Sure, happy to help. What would you like to know?`, delay: -3000000, sender: 'agent' },
          { text: `Can you please share the timeline and estimated cost breakdown?`, delay: -2400000 },
          { text: `Absolutely! I'll send that over in a few minutes.`, delay: -1800000, sender: 'agent' }
        ]
      },
      {
        incoming: [
          { text: `Thanks! That works for me.`, delay: -7200000 },
          { text: `Great! I'll send over the confirmation shortly.`, delay: -6600000, sender: 'agent' }
        ]
      },
      {
        incoming: [
          { text: `Can you send me the details?`, delay: -10800000 },
          { text: `Of course! Here is the document you requested.`, delay: -10200000, sender: 'agent', attachments: [{ name: 'Project_Details.pdf', size: '2.4 MB', icon: 'ph-file-pdf' }] },
          { text: `Got it, thank you!`, delay: -9600000 }
        ]
      },
      {
        incoming: [
          { text: `I loved your recent post! 🔥`, delay: -14400000 },
          { text: `Thank you so much! We really appreciate the support.`, delay: -13800000, sender: 'agent' }
        ]
      },
      {
        incoming: [
          { text: `Question about your product`, delay: -18000000 },
          { text: `Hi! I'd be happy to help. What would you like to know?`, delay: -17400000, sender: 'agent' },
          { text: `Does it support team collaboration features?`, delay: -16800000 },
          { text: `Yes, absolutely! You can invite unlimited team members and assign conversations. Would you like a demo?`, delay: -16200000, sender: 'agent' }
        ]
      }
    ];

    const template = threadTemplates[Math.floor(Math.random() * threadTemplates.length)];

    template.incoming.forEach((msg, i) => {
      const msgTime = new Date(baseTime.getTime() + msg.delay + (i * 300000));
      messages.push({
        id: `msg_${conv.id}_${i}`,
        text: msg.text,
        sender: msg.sender || 'customer',
        timestamp: msgTime.toISOString(),
        type: 'message',
        read: true,
        avatar: customerInitials,
        avatarColor: customerColor,
        attachments: msg.attachments || []
      });
    });

    // Add an internal note
    messages.push({
      id: `msg_${conv.id}_note`,
      text: `Internal note: Customer is interested in upgrading to Pro plan. Follow up next week.`,
      sender: 'agent',
      timestamp: new Date(baseTime.getTime() - 900000).toISOString(),
      type: 'internal',
      read: true
    });

    // Add a final agent message
    messages.push({
      id: `msg_${conv.id}_final`,
      text: `Is there anything else I can help you with today?`,
      sender: 'agent',
      timestamp: new Date(baseTime.getTime() - 600000).toISOString(),
      type: 'message',
      read: false
    });

    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // ============================================
  // Details Panel
  // ============================================
  renderDetailsPanel(conv) {
    const panel = document.getElementById('details-panel');
    const member = this.getTeamMemberById(conv.assignedTo);
    const tags = conv.tags || ['Project', 'Proposal'];
    const notes = conv.notes || [
      { author: 'Sophia Moore', text: 'Discussing project proposal for Q2 marketing campaign. Client is interested and requested timeline and cost breakdown.', time: new Date(Date.now() - 86400000).toISOString() }
    ];
    const prevConvs = conv.previousConversations || [
      { title: 'Project Kickoff Discussion', date: 'Apr 28, 2024', platform: conv.platform },
      { title: 'Budget Discussion', date: 'Apr 20, 2024', platform: conv.platform }
    ];
    const attachments = conv.attachments || [
      { name: 'Project_Proposal.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Timeline.xlsx', size: '1.1 MB', type: 'xlsx' }
    ];

    panel.innerHTML = `
      <!-- Customer Profile -->
      <div class="details-section">
        <div class="details-customer-header">
          <div class="details-customer-avatar" style="background: ${conv.customer.color}">
            ${conv.customer.avatar}
          </div>
          <div class="details-customer-info">
            <div class="details-customer-name">${conv.customer.name}</div>
            <div class="details-customer-email">${conv.customer.email || conv.customer.name.toLowerCase().replace(' ', '.') + '@example.com'}</div>
            <div class="details-customer-platform">
              <i class="ph ${this.getPlatformIcon(conv.platform)}"></i>
              ${this.getPlatformName(conv.platform)}
            </div>
          </div>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ph-envelope"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Email</div>
            <div class="details-info-value">${conv.customer.email || conv.customer.name.toLowerCase().replace(' ', '.') + '@example.com'}</div>
          </div>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ph-phone"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Phone</div>
            <div class="details-info-value">+1 (555) 123-4567</div>
          </div>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ph-map-pin"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Location</div>
            <div class="details-info-value">San Francisco, CA</div>
          </div>
        </div>
      </div>

      <!-- Conversation Info -->
      <div class="details-section">
        <div class="details-section-title">
          <span>About this conversation</span>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ${this.getPlatformIcon(conv.platform)}"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Platform</div>
            <div class="details-info-value">${this.getPlatformName(conv.platform)}</div>
          </div>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ph-envelope"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Channel</div>
            <div class="details-info-value">${conv.platform === 'gmail' ? 'Email' : 'Direct Message'}</div>
          </div>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ph-calendar"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Date</div>
            <div class="details-info-value">${new Date(conv.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
          </div>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ph-hash"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Conversation ID</div>
            <div class="details-info-value">COV-2024-0512-001</div>
          </div>
        </div>
        <div class="details-info-row">
          <div class="details-info-icon"><i class="ph ph-circle"></i></div>
          <div class="details-info-content">
            <div class="details-info-label">Status</div>
            <div class="details-info-value">
              <select class="status-select" id="status-select" data-id="${conv.id}">
                <option value="open" ${conv.status === 'open' ? 'selected' : ''}>Open</option>
                <option value="in-progress" ${conv.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="pending" ${conv.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="resolved" ${conv.status === 'resolved' ? 'selected' : ''}>Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="details-section">
        <div class="details-section-title">
          <span>Tags</span>
          <button class="edit-btn" id="edit-tags-btn">Edit</button>
        </div>
        <div class="details-tags" id="details-tags">
          ${tags.map(tag => `
            <span class="details-tag" style="background: var(--primary-50); color: var(--primary-700);">
              ${tag}
              <span class="tag-remove" data-tag="${tag}"><i class="ph ph-x"></i></span>
            </span>
          `).join('')}
          <button class="details-tag-add" id="add-tag-btn">
            <i class="ph ph-plus"></i> Add Tag
          </button>
        </div>
      </div>

      <!-- Assigned Agent -->
      <div class="details-section">
        <div class="details-section-title">
          <span>Assigned to</span>
        </div>
        <div class="details-assigned">
          <div class="details-assigned-avatar" style="background: ${member ? member.color : '#6366f1'}">
            ${member ? member.avatar : '?'}
          </div>
          <div class="details-assigned-info">
            <div class="details-assigned-name">${member ? member.name : 'Unassigned'}</div>
            <div class="details-assigned-role">${member ? member.role : 'No agent assigned'}</div>
          </div>
          <button class="details-assigned-change" id="change-assignee-btn">Change</button>
        </div>
      </div>

      <!-- Conversation Notes -->
      <div class="details-section">
        <div class="details-section-title">
          <span>Conversation notes</span>
          <button class="edit-btn" id="edit-notes-btn"><i class="ph ph-pencil-simple"></i></button>
        </div>
        <div class="details-notes-list" id="details-notes-list">
          ${notes.map(note => `
            <div class="details-note-item">
              <div class="details-note-header">
                <span class="details-note-author">${note.author}</span>
                <span class="details-note-time">${this.formatTimeAgo(note.time)}</span>
              </div>
              <div class="details-note-text">${note.text}</div>
            </div>
          `).join('')}
        </div>
        <textarea class="details-note-input" id="note-input" placeholder="Add a note..."></textarea>
        <button class="details-note-add-btn" id="add-note-btn">Add Note</button>
      </div>

      <!-- Previous Conversations -->
      <div class="details-section">
        <div class="details-section-title">
          <span>Previous conversations</span>
        </div>
        <div class="details-prev-list">
          ${prevConvs.map(pc => `
            <div class="details-prev-item">
              <div class="details-prev-icon ${pc.platform}"><i class="ph ${this.getPlatformIcon(pc.platform)}"></i></div>
              <div class="details-prev-info">
                <div class="details-prev-title">${pc.title}</div>
                <div class="details-prev-date">${pc.date}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="details-prev-viewall">View all conversations (5)</div>
      </div>

      <!-- Attachments -->
      <div class="details-section">
        <div class="details-section-title">
          <span>Attachments</span>
        </div>
        <div class="details-attachments-list">
          ${attachments.map(att => `
            <div class="details-attachment-item">
              <div class="details-attachment-icon"><i class="ph ${att.type === 'pdf' ? 'ph-file-pdf' : 'ph-file-xls'}"></i></div>
              <div class="details-attachment-info">
                <div class="details-attachment-name">${att.name}</div>
                <div class="details-attachment-size">${att.size}</div>
              </div>
              <div class="details-attachment-download"><i class="ph ph-download-simple"></i></div>
            </div>
          `).join('')}
        </div>
        <div class="details-prev-viewall">View all attachments (3)</div>
      </div>
    `;

    this.bindDetailsEvents(conv);
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // Filter tabs
    document.querySelectorAll('.inbox-filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        this.currentFilter = filter;
        document.querySelectorAll('.inbox-filter-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderConversationList();
      });
    });

    // Search
    const searchInput = document.getElementById('inbox-search');
    const clearBtn = document.getElementById('inbox-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value;
        this.renderConversationList();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.currentSearch = '';
        this.renderConversationList();
      });
    }

    // Sort dropdown
    const sortBtn = document.getElementById('sort-dropdown-btn');
    if (sortBtn) {
      sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSortDropdown();
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      this.closeAllDropdowns();
    });

    // Bulk actions
    document.getElementById('mark-all-read-btn')?.addEventListener('click', () => this.markAllRead());
    document.getElementById('refresh-btn')?.addEventListener('click', () => this.refreshConversations());
  }

  bindReplyEvents(conv) {
    // Reply tabs
    document.querySelectorAll('.reply-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.currentReplyTab = tabName;
        document.querySelectorAll('.reply-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const textarea = document.getElementById('reply-textarea');
        if (tabName === 'note') {
          textarea.placeholder = 'Add an internal note (only visible to team)...';
        } else {
          textarea.placeholder = 'Type your message...';
        }
      });
    });

    // Auto-resize textarea
    const textarea = document.getElementById('reply-textarea');
    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      });

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendReply(conv);
        }
      });
    }

    // Send button
    document.getElementById('reply-send-btn')?.addEventListener('click', () => {
      this.sendReply(conv);
    });

    // AI reply
    document.getElementById('ai-reply-btn')?.addEventListener('click', () => {
      this.generateAIReply(conv);
    });
  }

  bindHeaderActions(conv) {
    // Star
    document.getElementById('action-star')?.addEventListener('click', () => {
      this.toggleStar(conv.id);
      const btn = document.getElementById('action-star');
      const isStarred = this.getConversationById(conv.id)?.starred;
      btn.innerHTML = `<i class="ph ${isStarred ? 'ph-star-fill' : 'ph-star'}"></i>`;
      btn.classList.toggle('active', isStarred);
    });

    // Archive
    document.getElementById('action-archive')?.addEventListener('click', () => {
      this.archiveConversation(conv.id);
    });

    // Spam
    document.getElementById('action-spam')?.addEventListener('click', () => {
      this.markSpam(conv.id);
    });

    // More dropdown
    document.getElementById('action-more')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showMoreDropdown(e.currentTarget, conv);
    });

    // Toggle details
    document.getElementById('action-toggle-details')?.addEventListener('click', () => {
      this.toggleDetailsPanel();
    });
  }

  bindDetailsEvents(conv) {
    // Status change
    document.getElementById('status-select')?.addEventListener('change', (e) => {
      conv.status = e.target.value;
      this.saveConversations();
      this.renderConversationList();
      OP.toast.show(`Status updated to ${conv.status}`, 'success');
    });

    // Add note
    document.getElementById('add-note-btn')?.addEventListener('click', () => {
      const input = document.getElementById('note-input');
      const text = input.value.trim();
      if (!text) return;

      if (!conv.notes) conv.notes = [];
      conv.notes.unshift({
        author: OP.auth.getSession()?.fullName || 'Sophia Moore',
        text,
        time: new Date().toISOString()
      });
      this.saveConversations();
      input.value = '';
      this.renderDetailsPanel(conv);
      OP.toast.show('Note added', 'success');
    });

    // Remove tag
    document.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = btn.dataset.tag;
        if (conv.tags) {
          conv.tags = conv.tags.filter(t => t !== tag);
          this.saveConversations();
          this.renderDetailsPanel(conv);
        }
      });
    });

    // Add tag
    document.getElementById('add-tag-btn')?.addEventListener('click', () => {
      const tag = prompt('Enter tag name:');
      if (tag && tag.trim()) {
        if (!conv.tags) conv.tags = [];
        if (!conv.tags.includes(tag.trim())) {
          conv.tags.push(tag.trim());
          this.saveConversations();
          this.renderDetailsPanel(conv);
        }
      }
    });

    // Change assignee
    document.getElementById('change-assignee-btn')?.addEventListener('click', () => {
      this.showAssigneeDropdown(conv);
    });
  }

  // ============================================
  // Actions
  // ============================================
  sendReply(conv) {
    const textarea = document.getElementById('reply-textarea');
    const text = textarea.value.trim();
    if (!text) return;

    if (!conv.messages) conv.messages = [];

    conv.messages.push({
      id: `msg_${conv.id}_${Date.now()}`,
      text,
      sender: this.currentReplyTab === 'note' ? 'agent' : 'me',
      timestamp: new Date().toISOString(),
      type: this.currentReplyTab === 'note' ? 'internal' : 'message',
      read: false
    });

    conv.timestamp = new Date().toISOString();
    conv.message = text;

    this.saveConversations();

    // Re-render
    this.renderConversationView(conv);
    this.renderConversationList();

    OP.toast.show(this.currentReplyTab === 'note' ? 'Note added' : 'Message sent', 'success');
  }

  generateAIReply(conv) {
    const aiReplies = [
      "Thank you for reaching out! I'd be happy to help you with that. Let me look into this for you.",
      "I understand your concern. Here's what I can do to resolve this for you right away.",
      "Great question! Yes, we do support that feature. Let me walk you through how it works.",
      "I appreciate your patience. I've reviewed your request and here's the update.",
      "Thanks for the feedback! We'll definitely take that into consideration for our next update."
    ];

    const reply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
    const textarea = document.getElementById('reply-textarea');
    textarea.value = reply;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    textarea.focus();

    OP.toast.show('AI reply generated', 'success');
  }

  toggleStar(id) {
    const conv = this.getConversationById(id);
    if (!conv) return;

    conv.starred = !conv.starred;
    this.saveConversations();
    this.renderConversationList();

    if (this.selectedConversationId === id) {
      this.renderConversationView(conv);
    }

    OP.toast.show(conv.starred ? 'Conversation starred' : 'Conversation unstarred', 'success');
  }

  archiveConversation(id) {
    const conv = this.getConversationById(id);
    if (!conv) return;

    conv.status = conv.status === 'archived' ? 'open' : 'archived';
    this.saveConversations();
    this.renderConversationList();

    if (this.selectedConversationId === id) {
      this.renderConversationView(conv);
    }

    OP.toast.show(conv.status === 'archived' ? 'Conversation archived' : 'Conversation restored', 'success');
  }

  markSpam(id) {
    const conv = this.getConversationById(id);
    if (!conv) return;

    conv.status = conv.status === 'spam' ? 'open' : 'spam';
    this.saveConversations();
    this.renderConversationList();

    if (this.selectedConversationId === id) {
      this.renderConversationView(conv);
    }

    OP.toast.show(conv.status === 'spam' ? 'Marked as spam' : 'Restored from spam', 'success');
  }

  deleteConversation(id) {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    const conv = this.getConversationById(id);
    if (!conv) return;

    conv.status = 'trash';
    this.saveConversations();
    this.renderConversationList();

    if (this.selectedConversationId === id) {
      this.selectedConversationId = null;
      document.getElementById('conversation-view').innerHTML = this.renderEmptyConversationView();
    }

    OP.toast.show('Conversation moved to trash', 'warning');
  }

  markAllRead() {
    this.conversations.forEach(c => {
      c.unread = false;
      c.unreadMessages = 0;
    });
    this.saveConversations();
    this.renderConversationList();
    this.updateNotifications();
    OP.toast.show('All conversations marked as read', 'success');
  }

  refreshConversations() {
    this.conversations = this.storage.getConversations();
    this.renderConversationList();
    OP.toast.show('Conversations refreshed', 'success');
  }

  // ============================================
  // Dropdowns
  // ============================================
  toggleSortDropdown() {
    this.closeAllDropdowns();

    const btn = document.getElementById('sort-dropdown-btn');
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    dropdown.style.top = (btn.offsetTop + btn.offsetHeight + 4) + 'px';
    dropdown.style.right = '16px';
    dropdown.innerHTML = `
      <button class="dropdown-item ${this.currentSort === 'newest' ? 'active' : ''}" data-sort="newest">
        <i class="ph ph-clock"></i> Newest First
      </button>
      <button class="dropdown-item ${this.currentSort === 'oldest' ? 'active' : ''}" data-sort="oldest">
        <i class="ph ph-clock-counter-clockwise"></i> Oldest First
      </button>
      <button class="dropdown-item ${this.currentSort === 'unread' ? 'active' : ''}" data-sort="unread">
        <i class="ph ph-envelope-open"></i> Unread First
      </button>
      <button class="dropdown-item ${this.currentSort === 'priority' ? 'active' : ''}" data-sort="priority">
        <i class="ph ph-flag"></i> Priority
      </button>
    `;

    btn.parentElement.appendChild(dropdown);
    this.dropdownOpen = dropdown;

    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentSort = item.dataset.sort;
        this.renderConversationList();
        this.closeAllDropdowns();
      });
    });
  }

  showMoreDropdown(target, conv) {
    this.closeAllDropdowns();

    const rect = target.getBoundingClientRect();
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    dropdown.style.top = (rect.bottom + 4) + 'px';
    dropdown.style.left = rect.left + 'px';

    const isArchived = conv.status === 'archived';
    const isSpam = conv.status === 'spam';

    dropdown.innerHTML = `
      <button class="dropdown-item" id="dropdown-assign">
        <i class="ph ph-user-check"></i> Assign to...
      </button>
      <button class="dropdown-item" id="dropdown-star">
        <i class="ph ${conv.starred ? 'ph-star-fill' : 'ph-star'}"></i> ${conv.starred ? 'Unstar' : 'Star'}
      </button>
      <div class="dropdown-divider"></div>
      <button class="dropdown-item" id="dropdown-archive">
        <i class="ph ${isArchived ? 'ph-arrow-counter-clockwise' : 'ph-archive'}"></i> ${isArchived ? 'Restore' : 'Archive'}
      </button>
      <button class="dropdown-item" id="dropdown-spam">
        <i class="ph ${isSpam ? 'ph-arrow-counter-clockwise' : 'ph-warning-circle'}"></i> ${isSpam ? 'Not Spam' : 'Mark as Spam'}
      </button>
      <div class="dropdown-divider"></div>
      <button class="dropdown-item danger" id="dropdown-delete">
        <i class="ph ph-trash"></i> Delete
      </button>
    `;

    document.body.appendChild(dropdown);
    this.dropdownOpen = dropdown;

    document.getElementById('dropdown-assign')?.addEventListener('click', () => {
      this.showAssigneeDropdown(conv);
      this.closeAllDropdowns();
    });

    document.getElementById('dropdown-star')?.addEventListener('click', () => {
      this.toggleStar(conv.id);
      this.closeAllDropdowns();
    });

    document.getElementById('dropdown-archive')?.addEventListener('click', () => {
      this.archiveConversation(conv.id);
      this.closeAllDropdowns();
    });

    document.getElementById('dropdown-spam')?.addEventListener('click', () => {
      this.markSpam(conv.id);
      this.closeAllDropdowns();
    });

    document.getElementById('dropdown-delete')?.addEventListener('click', () => {
      this.deleteConversation(conv.id);
      this.closeAllDropdowns();
    });
  }

  showAssigneeDropdown(conv) {
    this.closeAllDropdowns();

    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    dropdown.style.position = 'fixed';
    dropdown.style.top = '50%';
    dropdown.style.left = '50%';
    dropdown.style.transform = 'translate(-50%, -50%)';
    dropdown.style.minWidth = '240px';
    dropdown.style.maxHeight = '300px';
    dropdown.style.overflowY = 'auto';

    dropdown.innerHTML = `
      <div style="padding: var(--space-3); font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--gray-800); border-bottom: 1px solid var(--gray-100); margin-bottom: var(--space-1);">
        Assign to Agent
      </div>
      ${this.teamMembers.map(m => `
        <button class="dropdown-item ${conv.assignedTo === m.id ? 'active' : ''}" data-member="${m.id}">
          <span class="assigned-avatar" style="background: ${m.color}; width: 24px; height: 24px; font-size: 10px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: white; font-weight: var(--font-bold);">${m.avatar}</span>
          ${m.name}
        </button>
      `).join('')}
    `;

    // Add overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:199;backdrop-filter:blur(2px);';
    overlay.addEventListener('click', () => {
      dropdown.remove();
      overlay.remove();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(dropdown);
    this.dropdownOpen = dropdown;

    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const memberId = item.dataset.member;
        if (memberId) {
          conv.assignedTo = memberId;
          this.saveConversations();
          this.renderConversationList();
          this.renderDetailsPanel(conv);
          OP.toast.show('Conversation assigned', 'success');
        }
        dropdown.remove();
        overlay.remove();
      });
    });
  }

  closeAllDropdowns() {
    if (this.dropdownOpen) {
      this.dropdownOpen.remove();
      this.dropdownOpen = null;
    }
  }

  toggleDetailsPanel() {
    const panel = document.getElementById('details-panel');
    const overlay = document.getElementById('details-panel-overlay');

    this.detailsOpen = !this.detailsOpen;
    panel.classList.toggle('collapsed', !this.detailsOpen);
    panel.classList.toggle('open', this.detailsOpen);

    if (overlay) {
      overlay.classList.toggle('active', this.detailsOpen && window.innerWidth <= 1280);
    }
  }

  // ============================================
  // Helpers
  // ============================================
  saveConversations() {
    localStorage.setItem(DASHBOARD_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
  }

  updateNotifications() {
    const unreadCount = this.conversations.filter(c => c.unread).length;
    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      const dot = notifBtn.querySelector('.notification-dot');
      if (unreadCount > 0 && !dot) {
        notifBtn.innerHTML = `<i class="ph ph-bell"></i><span class="notification-dot"></span>`;
      } else if (unreadCount === 0 && dot) {
        dot.remove();
      }
    }
  }

  renderEmptyConversationView() {
    return `
      <div class="inbox-empty-state" style="flex:1;">
        <div class="inbox-empty-state-icon"><i class="ph ph-chat-circle-text"></i></div>
        <div class="inbox-empty-state-title">Select a conversation</div>
        <div class="inbox-empty-state-desc">Choose a conversation from the list to start messaging.</div>
      </div>
    `;
  }

  formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatMessageTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  formatDateDivider(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  getPlatformIcon(platform) {
    const icons = {
      gmail: 'ph-envelope-simple',
      whatsapp: 'ph-chat-circle-text',
      instagram: 'ph-camera',
      tiktok: 'ph-tiktok-logo',
      x: 'ph-x-logo',
      linkedin: 'ph-linkedin-logo'
    };
    return icons[platform] || 'ph-chat';
  }

  getPlatformName(platform) {
    const names = {
      gmail: 'Gmail',
      whatsapp: 'WhatsApp Business',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      x: 'X (Twitter)',
      linkedin: 'LinkedIn'
    };
    return names[platform] || platform;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize
window.UnifiedInbox = UnifiedInbox;