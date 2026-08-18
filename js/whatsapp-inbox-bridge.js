/* OnePlace Enterprise — WhatsApp ↔ Unified Inbox Bridge
   Mirrors live WhatsApp conversations (from the WPPConnect-backed
   whatsapp-service) into the unified inbox storage, and routes replies
   for WhatsApp conversations back out through the service.

   Requires: app.js, storage.js (DashboardStorage), whatsapp-service-client.js
   Load AFTER unified-inbox.js on the inbox page.
*/
(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.whatsappInboxBridge) return;

  const POLL_INTERVAL_MS = 5000;
  const AVATAR_COLORS = ['#25D366', '#128C7E', '#34B7F1', '#6366f1', '#f59e0b'];

  let pollTimer = null;
  let lastEventSeq = 0;
  let inboxInstance = null;

  function initials(name) {
    return String(name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('') || '?';
  }

  function colorFor(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  }

  function conversationIdForChat(chatId) {
    return `wa_${chatId}`;
  }

  function mapServiceMessage(m) {
    return {
      direction: m.fromMe ? 'outbound' : 'inbound',
      text: m.body || (m.hasMedia ? `[${m.filename || m.type || 'media'}]` : ''),
      timestamp: new Date(m.timestamp).toISOString(),
      serviceMessageId: m.id
    };
  }

  function readConversations() {
    try {
      return JSON.parse(localStorage.getItem('op_conversations') || '[]');
    } catch (e) {
      return [];
    }
  }

  function writeConversations(list) {
    localStorage.setItem('op_conversations', JSON.stringify(list));
  }

  function upsertWhatsAppConversation(chat, messages) {
    const chatId = (chat.id && (chat.id._serialized || chat.id.id)) || String(chat.id || chat.chatId || '');
    if (!chatId) return null;

    const id = conversationIdForChat(chatId);
    const name = chat.name || (chat.contact && (chat.contact.name || chat.contact.pushname)) || chatId.replace(/@.*$/, '');
    const lastMsg = chat.lastMessage || {};
    const timestamp = chat.t ? new Date(chat.t * 1000).toISOString()
      : (lastMsg.timestamp ? new Date(lastMsg.timestamp * 1000).toISOString() : new Date().toISOString());

    const conversations = readConversations();
    const idx = conversations.findIndex(c => c.id === id);
    const existing = idx !== -1 ? conversations[idx] : null;

    const merged = {
      id,
      platform: 'whatsapp',
      chatId,
      customer: {
        name,
        avatar: initials(name),
        color: (existing && existing.customer && existing.customer.color) || colorFor(chatId)
      },
      message: lastMsg.body || (existing && existing.message) || '',
      status: (existing && existing.status) || 'open',
      priority: (existing && existing.priority) || 'medium',
      unread: (chat.unreadCount || 0) > 0,
      unreadMessages: chat.unreadCount || 0,
      starred: !!(existing && existing.starred),
      assignedTo: (existing && existing.assignedTo) || null,
      timestamp,
      messages: messages || (existing && existing.messages) || []
    };

    if (idx !== -1) conversations[idx] = merged;
    else conversations.unshift(merged);
    writeConversations(conversations);
    return merged;
  }

  function appendMessageToConversation(chatId, message) {
    const id = conversationIdForChat(chatId);
    const conversations = readConversations();
    const idx = conversations.findIndex(c => c.id === id);
    if (idx === -1) return null;

    const conv = conversations[idx];
    conv.messages = Array.isArray(conv.messages) ? conv.messages : [];
    if (message.serviceMessageId && conv.messages.some(m => m.serviceMessageId === message.serviceMessageId)) {
      return conv;
    }

    conv.messages.push(message);
    conv.message = message.text;
    conv.timestamp = message.timestamp;
    if (message.direction === 'inbound') {
      conv.unread = true;
      conv.unreadMessages = (conv.unreadMessages || 0) + 1;
    }
    conversations[idx] = conv;
    writeConversations(conversations);
    return conv;
  }

  function refreshInboxUI() {
    if (inboxInstance && typeof inboxInstance.renderConversationList === 'function') {
      inboxInstance.renderConversationList();
      if (inboxInstance.selectedId) {
        const conv = inboxInstance.storage.getConversationById(inboxInstance.selectedId);
        if (conv && conv.platform === 'whatsapp') {
          inboxInstance.renderConversationView(conv);
        }
      }
    }
  }

  async function syncNow() {
    if (!window.OP.whatsappService) return false;

    const status = await window.OP.whatsappService.status();
    if (!status.connected) return false;

    const chatsResp = await window.OP.whatsappService.chats();
    const chats = chatsResp.chats || [];

    for (const chat of chats.slice(0, 50)) {
      const chatId = (chat.id && (chat.id._serialized || chat.id.id)) || String(chat.id || '');
      if (!chatId) continue;

      let messages = null;
      try {
        const resp = await window.OP.whatsappService.chatMessages(chatId, 30);
        messages = (resp.messages || []).map(mapServiceMessage);
      } catch (e) {
        messages = null;
      }
      upsertWhatsAppConversation(chat, messages);
    }

    return true;
  }

  async function pollEvents() {
    try {
      const resp = await window.OP.whatsappService.events(lastEventSeq);
      lastEventSeq = resp.lastSeq || lastEventSeq;

      let changed = false;
      (resp.events || []).forEach(event => {
        if (!event || event.type !== 'message' || !event.message) return;
        const m = event.message;
        if (!m.chatId) return;

        let conv = appendMessageToConversation(m.chatId, mapServiceMessage(m));
        if (!conv) {
          // Unknown chat: create a minimal conversation entry
          conv = upsertWhatsAppConversation({
            id: m.chatId,
            name: (m.sender && (m.sender.name || m.sender.pushname)) || m.chatId.replace(/@.*$/, ''),
            t: Math.floor(m.timestamp / 1000),
            unreadCount: m.fromMe ? 0 : 1,
            lastMessage: { body: m.body, timestamp: Math.floor(m.timestamp / 1000) }
          }, [mapServiceMessage(m)]);
        }
        if (conv) changed = true;
      });

      if (changed) refreshInboxUI();
    } catch (e) {
      // transient — next tick retries
    }
  }

  async function start(instance) {
    inboxInstance = instance || window.unifiedInbox || inboxInstance;
    if (!window.OP.whatsappService) return;

    try {
      const synced = await syncNow();
      if (synced) {
        refreshInboxUI();
        if (!pollTimer) {
          pollTimer = setInterval(pollEvents, POLL_INTERVAL_MS);
        }
      } else {
        // WhatsApp not connected yet — retry periodically until it is.
        setTimeout(() => start(instance), 15000);
      }
    } catch (e) {
      // service unreachable — retry later; inbox keeps working with local data
      setTimeout(() => start(instance), 30000);
    }
  }

  window.OP.whatsappInboxBridge = {
    start,

    /** Called by UnifiedInbox when replying to a WhatsApp conversation. */
    async sendReply(conversation, text) {
      if (!window.OP.whatsappService) throw new Error('WhatsApp service client is unavailable.');
      const chatId = conversation.chatId || String(conversation.id || '').replace(/^wa_/, '');
      if (!chatId) throw new Error('This conversation is not linked to a WhatsApp chat.');
      return window.OP.whatsappService.sendText(chatId, text);
    },

    isWhatsApp(conversation) {
      return !!(conversation && conversation.platform === 'whatsapp');
    }
  };

  // Auto-start on the unified inbox page once the inbox instance exists.
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('inbox-conversation-list')) return;
    // The page's inline script constructs UnifiedInbox on DOMContentLoaded;
    // defer slightly so we can observe the same storage it renders from.
    setTimeout(() => start(null), 800);
  });
})();