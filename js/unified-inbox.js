/**
 * OnePlace Enterprise v3.0 — Unified Inbox Module
 * Vanilla JavaScript (ES6+)
 * Requires: app.js (OP), storage.js (DashboardStorage), dashboard.js (opBrandIcon)
 */

function opTimeAgo(timestamp) {
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

class UnifiedInbox {
  constructor() {
    this.storage = new DashboardStorage();
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.selectedId = null;
    this.replyMode = 'reply';
    this.init();
  }

  init() {
    this.applyQueryParams();
    this.renderConversationList();
    this.renderEmptyView();
    this.bindEvents();
  }

  applyQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    const platform = params.get('platform');
    if (filter && ['all', 'unread', 'starred', 'assigned'].includes(filter)) {
      this.currentFilter = filter;
    }
    if (platform) {
      this.currentFilter = platform;
    }
    document.querySelectorAll('.inbox-filter-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.filter === this.currentFilter);
    });
  }

  bindEvents() {
    document.querySelectorAll('.inbox-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.inbox-filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.dataset.filter;
        this.renderConversationList();
      });
    });

    const searchInput = document.getElementById('inbox-search');
    const searchClear = document.getElementById('inbox-search-clear');
    searchInput?.addEventListener('input', () => {
      this.currentSearch = searchInput.value.trim();
      if (searchClear) searchClear.style.display = this.currentSearch ? 'flex' : 'none';
      this.renderConversationList();
    });
    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      this.currentSearch = '';
      searchClear.style.display = 'none';
      this.renderConversationList();
    });

    document.getElementById('mark-all-read-btn')?.addEventListener('click', () => {
      this.storage.getConversations('all').forEach(c => this.storage.markConversationRead(c.id));
      this.renderConversationList();
      OP.toast.show('All conversations marked as read', 'success');
    });
    document.getElementById('refresh-btn')?.addEventListener('click', () => {
      this.renderConversationList();
      OP.toast.show('Inbox refreshed', 'info');
    });

    document.getElementById('details-panel-overlay')?.addEventListener('click', () => {
      document.getElementById('details-panel')?.classList.remove('open');
      document.getElementById('details-panel-overlay')?.classList.remove('active');
    });
  }

  customerEmail(customer) {
    return customer.name.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/\s+/g, '.') + '@example.com';
  }

  updateTabCounts() {
    const counts = {
      all: this.storage.getConversations('all').length,
      unread: this.storage.getConversations('unread').length,
      starred: this.storage.getConversations('starred').length,
      assigned: this.storage.getConversations('assigned').length
    };
    document.querySelectorAll('.inbox-filter-tab').forEach(tab => {
      const countEl = tab.querySelector('.tab-count');
      if (countEl && counts[tab.dataset.filter] !== undefined) {
        countEl.textContent = counts[tab.dataset.filter];
      }
    });
  }

  renderConversationList() {
    const conversations = this.storage.getConversations(this.currentFilter, this.currentSearch);
    const container = document.getElementById('inbox-conversation-list');
    const countEl = document.getElementById('inbox-list-count');
    this.updateTabCounts();

    countEl.textContent = `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`;

    if (conversations.length === 0) {
      container.innerHTML = `
        <div class="inbox-empty-state">
          <div class="inbox-empty-state-icon"><i class="ph ph-inbox"></i></div>
          <div class="inbox-empty-state-title">No conversations</div>
          <div class="inbox-empty-state-desc">Try a different filter or search term.</div>
        </div>`;
      return;
    }

    container.innerHTML = conversations.map(c => `
      <div class="inbox-conversation-item ${c.unread ? 'unread' : ''} ${c.id === this.selectedId ? 'active' : ''}" data-id="${c.id}">
        <div class="inbox-conversation-avatar" style="background: ${c.customer.color}">
          ${c.customer.avatar}
          <span class="inbox-conversation-platform-badge" style="background:#fff; padding:1px; border-radius:4px; display:flex;">${opBrandIcon(c.platform, 'glyph', 10)}</span>
        </div>
        <div class="inbox-conversation-body">
          <div class="inbox-conversation-top">
            <span class="inbox-conversation-name">${c.customer.name}</span>
            <span class="inbox-conversation-time">${opTimeAgo(c.timestamp)}</span>
          </div>
          <div class="inbox-conversation-preview">${c.message}</div>
          <div class="inbox-conversation-meta">
            ${c.assignedTo ? '<span class="inbox-conversation-assigned"><i class="ph ph-user-check"></i> Assigned</span>' : ''}
            ${c.priority === 'high' ? '<span class="inbox-conversation-assigned" style="color:var(--error-500);"><i class="ph ph-flag"></i> High</span>' : ''}
            <span class="inbox-conversation-star ${c.starred ? 'starred' : ''}" data-star="${c.id}" role="button" aria-label="Toggle star">
              <i class="ph ${c.starred ? 'ph-star-fill' : 'ph-star'}"></i>
            </span>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.inbox-conversation-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('[data-star]')) return;
        this.selectConversation(item.dataset.id);
      });
    });

    container.querySelectorAll('[data-star]').forEach(star => {
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        this.storage.toggleStarConversation(star.dataset.star);
        this.renderConversationList();
      });
    });
  }

  renderEmptyView() {
    document.getElementById('conversation-view').innerHTML = `
      <div class="inbox-empty-state" style="margin: auto;">
        <div class="inbox-empty-state-icon"><i class="ph ph-chat-circle-text"></i></div>
        <div class="inbox-empty-state-title">Select a conversation</div>
        <div class="inbox-empty-state-desc">Choose a conversation from the list to view messages.</div>
      </div>`;
    document.getElementById('details-panel').innerHTML = '';
  }

  // Deterministic demo thread built from the conversation seed
  buildThread(conv) {
    // Live WhatsApp conversations carry their real message history —
    // never mix it with generated demo messages.
    if (conv.platform === 'whatsapp' && Array.isArray(conv.messages) && conv.messages.length) {
      return conv.messages.map(m => ({
        direction: m.direction || 'outbound',
        text: m.text,
        timestamp: m.timestamp,
        note: m.note
      }));
    }

    const rand = opSeededRandom(conv.id.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0));
    const inbound = [
      'Hi! I need some help with my recent order.',
      'Could you also send me the invoice when you get a chance?',
      'One more thing — is there an update on the shipping date?'
    ];
    const outbound = [
      'Hi ' + conv.customer.name.split(' ')[0] + ', thanks for reaching out! Looking into it now.',
      'Sure, I have just sent it over. Let me know if you need anything else.',
      'You are welcome! Have a great day.'
    ];

    const count = 2 + Math.floor(rand() * 3);
    const thread = [];
    const base = new Date(conv.timestamp).getTime() - count * 12 * 60000;
    for (let i = 0; i < count; i++) {
      const isInbound = i % 2 === 0;
      const pool = isInbound ? inbound : outbound;
      thread.push({
        direction: isInbound ? 'inbound' : 'outbound',
        text: pool[Math.floor(rand() * pool.length)],
        timestamp: new Date(base + i * 12 * 60000).toISOString()
      });
    }
    thread.push({ direction: 'inbound', text: conv.message, timestamp: conv.timestamp });

    // Persisted replies/notes
    (conv.messages || []).forEach(m => {
      thread.push({ direction: m.direction || 'outbound', text: m.text, timestamp: m.timestamp, note: m.note });
    });

    return thread;
  }

  selectConversation(id) {
    this.selectedId = id;
    const conv = this.storage.getConversationById(id);
    if (!conv) return;

    this.storage.markConversationRead(id);
    this.renderConversationList();
    this.renderConversationView(conv);
    this.renderDetailsPanel(conv);
  }

  renderConversationView(conv) {
    const thread = this.buildThread(conv);
    const view = document.getElementById('conversation-view');
    const statusLabel = conv.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const statusColor = conv.status === 'resolved' ? 'var(--success-500)' : conv.status === 'pending' ? 'var(--warning-500)' : 'var(--primary-500)';

    view.innerHTML = `
      <div class="conversation-view-header">
        <div class="conversation-view-header-left">
          <div class="conversation-view-avatar" style="background: ${conv.customer.color}">${conv.customer.avatar}</div>
          <div class="conversation-view-info">
            <div class="conversation-view-name">${conv.customer.name}</div>
            <div class="conversation-view-email">${this.customerEmail(conv.customer)}</div>
          </div>
          <span style="display:flex; align-items:center;">${opBrandIcon(conv.platform, 'glyph', 20)}</span>
        </div>
        <div class="conversation-view-header-right">
          <span class="conversation-view-status">
            <span class="conversation-view-status-dot" style="background:${statusColor}"></span>
            ${statusLabel}
          </span>
          <button class="conversation-view-action" data-action="star" title="Star">
            <i class="ph ${conv.starred ? 'ph-star-fill' : 'ph-star'}"></i>
          </button>
          <button class="conversation-view-action" data-action="details" title="Details">
            <i class="ph ph-info"></i>
          </button>
        </div>
      </div>

      <div class="conversation-messages" id="conversation-messages">
        <div class="conversation-date-divider"><span>Conversation</span></div>
        ${thread.map(m => `
          <div class="message-item ${m.direction}">
            ${m.direction === 'inbound' ? `<div class="message-avatar" style="background:${conv.customer.color}">${conv.customer.avatar}</div>` : ''}
            <div class="message-content">
              <div class="message-bubble"><div class="message-text">${m.text}</div></div>
              <div class="message-meta">
                <span>${opTimeAgo(m.timestamp)}</span>
                ${m.direction === 'outbound' ? `<span class="message-status"><i class="ph ph-checks"></i></span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="conversation-reply">
        <div class="reply-tabs">
          <button class="reply-tab ${this.replyMode === 'reply' ? 'active' : ''}" data-mode="reply">Reply</button>
          <button class="reply-tab ${this.replyMode === 'note' ? 'active' : ''}" data-mode="note">Internal Note</button>
        </div>
        <div class="reply-input-wrapper">
          <textarea class="reply-textarea" id="reply-textarea" rows="2"
            placeholder="${this.replyMode === 'reply' ? `Reply to ${conv.customer.name}...` : 'Add an internal note...'}"></textarea>
          <div class="reply-actions">
            <button class="reply-action-btn" title="Attach"><i class="ph ph-paperclip"></i></button>
            <button class="reply-action-btn" title="Emoji"><i class="ph ph-smiley"></i></button>
            <button class="reply-action-btn ai-reply-btn" title="AI suggestion"><i class="ph ph-sparkle"></i></button>
            <button class="reply-send-btn" id="reply-send-btn" title="Send">
              <i class="ph ph-paper-plane-tilt"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    const messagesEl = view.querySelector('#conversation-messages');
    messagesEl.scrollTop = messagesEl.scrollHeight;

    view.querySelectorAll('.reply-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.replyMode = tab.dataset.mode;
        view.querySelectorAll('.reply-tab').forEach(t => t.classList.toggle('active', t === tab));
        view.querySelector('#reply-textarea').placeholder =
          this.replyMode === 'reply' ? `Reply to ${conv.customer.name}...` : 'Add an internal note...';
      });
    });

    const send = () => {
      const textarea = view.querySelector('#reply-textarea');
      const text = textarea.value.trim();
      if (!text) return;

      const persist = () => {
        this.storage.addMessage(conv.id, {
          direction: 'outbound',
          text,
          timestamp: new Date().toISOString(),
          author: 'Sophia Moore',
          note: this.replyMode === 'note'
        });
        this.storage.updateConversation(conv.id, { message: text, timestamp: new Date().toISOString() });
        textarea.value = '';
        this.renderConversationList();
        this.selectConversation(conv.id);
      };

      // WhatsApp conversations reply through the WPPConnect-backed service.
      if (this.replyMode === 'reply' && conv.platform === 'whatsapp' && window.OP.whatsappInboxBridge) {
        window.OP.whatsappInboxBridge.sendReply(conv, text)
          .then(() => {
            persist();
            OP.toast.show('WhatsApp reply sent', 'success');
          })
          .catch((error) => {
            OP.toast.show(error?.message || 'Failed to send WhatsApp reply.', 'error');
          });
        return;
      }

      persist();
      OP.toast.show(this.replyMode === 'reply' ? 'Reply sent' : 'Note added', 'success');
    };

    view.querySelector('#reply-send-btn').addEventListener('click', send);
    view.querySelector('#reply-textarea').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    view.querySelector('[data-action="star"]').addEventListener('click', () => {
      this.storage.toggleStarConversation(conv.id);
      this.renderConversationList();
      this.selectConversation(conv.id);
    });

    view.querySelector('[data-action="details"]').addEventListener('click', () => {
      document.getElementById('details-panel')?.classList.toggle('open');
      document.getElementById('details-panel-overlay')?.classList.toggle('active');
    });
  }

  renderDetailsPanel(conv) {
    const panel = document.getElementById('details-panel');
    const platformLabels = {
      gmail: 'Gmail', whatsapp: 'WhatsApp', instagram: 'Instagram',
      tiktok: 'TikTok', x: 'X (Twitter)', linkedin: 'LinkedIn'
    };
    const assignedMember = this.storage.getTeamMembers().find(m => m.id === conv.assignedTo);
    const statusLabel = conv.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    panel.innerHTML = `
      <div class="details-section">
        <div class="details-customer-header">
          <div class="details-customer-avatar" style="background:${conv.customer.color}">${conv.customer.avatar}</div>
          <div class="details-customer-info">
            <div class="details-customer-name">${conv.customer.name}</div>
            <div class="details-customer-email">${this.customerEmail(conv.customer)}</div>
            <div class="details-customer-platform" style="display:flex; align-items:center; gap:6px;">
              ${opBrandIcon(conv.platform, 'glyph', 14)} ${platformLabels[conv.platform] || conv.platform}
            </div>
          </div>
        </div>
      </div>

      <div class="details-section">
        <div class="details-section-title">Conversation Info</div>
        <div class="details-info-row">
          <span class="details-info-label">Status</span>
          <span class="details-info-value">${statusLabel}</span>
        </div>
        <div class="details-info-row">
          <span class="details-info-label">Priority</span>
          <span class="details-info-value">${conv.priority.charAt(0).toUpperCase() + conv.priority.slice(1)}</span>
        </div>
        <div class="details-info-row">
          <span class="details-info-label">Last activity</span>
          <span class="details-info-value">${opTimeAgo(conv.timestamp)}</span>
        </div>
      </div>

      <div class="details-section">
        <div class="details-section-title">Assigned To</div>
        <div class="details-assigned">
          ${assignedMember
            ? `<img class="details-assigned-avatar" src="${assignedMember.photo}" alt="${assignedMember.name}"
                 onerror="this.outerHTML='<div class=&quot;details-assigned-avatar&quot; style=&quot;background:${assignedMember.color};color:#fff;display:flex;align-items:center;justify-content:center;&quot;>${assignedMember.avatar}</div>'">
               <div class="details-assigned-info">
                 <div class="details-assigned-name">${assignedMember.name}</div>
                 <div class="details-assigned-role">${assignedMember.role}</div>
               </div>`
            : `<div class="details-assigned-info"><div class="details-assigned-name">Unassigned</div></div>`}
          <button class="details-assigned-change">Change</button>
        </div>
      </div>

      <div class="details-section">
        <div class="details-section-title">Tags</div>
        <div class="details-tags">
          <span class="details-tag">Customer</span>
          <span class="details-tag">${platformLabels[conv.platform] || conv.platform}</span>
          ${conv.priority === 'high' ? '<span class="details-tag" style="background:var(--error-50); color:var(--error-600);">High Priority</span>' : ''}
          <button class="details-tag-add"><i class="ph ph-plus"></i> Add</button>
        </div>
      </div>

      <div class="details-section">
        <div class="details-section-title">Notes</div>
        <div class="details-notes-list" id="details-notes-list">
          ${(conv.notes || []).map(n => `
            <div class="details-note-item">
              <div class="details-note-header">
                <span class="details-note-author">${n.author || 'Sophia Moore'}</span>
                <span class="details-note-time">${opTimeAgo(n.timestamp || n.time)}</span>
              </div>
              <div class="details-note-text">${n.text}</div>
            </div>
          `).join('') || '<div style="font-size:12px; color:var(--gray-400);">No notes yet.</div>'}
        </div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <input class="details-note-input" id="details-note-input" placeholder="Add a note...">
          <button class="details-note-add-btn" id="details-note-add-btn"><i class="ph ph-plus"></i></button>
        </div>
      </div>
    `;

    const addNote = () => {
      const input = panel.querySelector('#details-note-input');
      const text = input.value.trim();
      if (!text) return;
      if (typeof this.storage.addNote === 'function') {
        this.storage.addNote(conv.id, { author: 'Sophia Moore', text, timestamp: new Date().toISOString() });
      }
      input.value = '';
      this.renderDetailsPanel(this.storage.getConversationById(conv.id));
    };

    panel.querySelector('#details-note-add-btn').addEventListener('click', addNote);
    panel.querySelector('#details-note-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addNote();
    });
  }
}

window.UnifiedInbox = UnifiedInbox;