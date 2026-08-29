/**
 * OnePlace Enterprise — WhatsApp Inbox Bridge (WPPConnect Server)
 * Bridges live WhatsApp sessions into the Unified Inbox.
 */

(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.whatsappInboxBridge) return;

  const POLL_INTERVAL_MS = 5000;
  const MAX_INBOX_ENTRIES = 500;

  function generateId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  function normalizePhone(chatId) {
    return String(chatId || '').replace(/@.*$/, '');
  }

  function formatWhatsAppInboxEntry(message, session) {
    const chatId = message.chatId || message.from || message.to;
    const name = (message.sender && (message.sender.name || message.sender.pushname)) || normalizePhone(chatId);
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=25D366&color=fff&size=80`;
    const timestamp = message.timestamp || Date.now();
    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateKey = date.toISOString().split('T')[0];

    return {
      id: generateId('wa_inbox'),
      channel: 'whatsapp',
      channelIcon: '<i class="ph ph-whatsapp-logo"></i>',
      channelColor: '#25D366',
      senderName: name,
      senderAvatar: avatar,
      preview: message.body || (message.hasMedia ? `[${message.filename || 'media'}]` : ''),
      time: timeString,
      timestamp: timestamp,
      dateKey: dateKey,
      sourceId: chatId,
      sourceMessageId: message.id,
      unread: !message.fromMe,
      status: 'delivered',
      metadata: {
        phone: normalizePhone(chatId),
        isGroup: message.isGroupMsg,
        sender: message.sender
      }
    };
  }

  async function fetchWhatsAppInboxEntries() {
    if (!window.OP || !window.OP.whatsappService) return [];
    try {
      const status = await window.OP.whatsappService.status();
      if (!status.connected) return [];

      const chatsResp = await window.OP.whatsappService.chats();
      const chats = chatsResp.chats || [];
      const entries = [];

      for (const chat of chats) {
        if (!chat.id) continue;
        const lastMsg = chat.lastMessage || {};
        const body = lastMsg.body || chat.lastMessagePreview || '';
        if (!body) continue;

        const timestamp = chat.t
          ? chat.t * 1000
          : (lastMsg.timestamp ? lastMsg.timestamp * 1000 : Date.now());

        const name = chat.name || (chat.contact && (chat.contact.name || chat.contact.pushname)) || normalizePhone(chat.id);
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=25D366&color=fff&size=80`;

        entries.push({
          id: generateId('wa_inbox'),
          channel: 'whatsapp',
          channelIcon: '<i class="ph ph-whatsapp-logo"></i>',
          channelColor: '#25D366',
          senderName: name,
          senderAvatar: avatar,
          preview: body,
          time: new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: timestamp,
          dateKey: new Date(timestamp).toISOString().split('T')[0],
          sourceId: chat.id,
          sourceMessageId: lastMsg.id,
          unread: (chat.unreadCount || 0) > 0,
          status: 'delivered',
          metadata: {
            phone: normalizePhone(chat.id),
            isGroup: chat.isGroup,
            sender: lastMsg.sender
          }
        });
      }

      return entries;
    } catch (error) {
      return [];
    }
  }

  function mergeIntoInbox(entries) {
    if (!entries || !entries.length) return;
    const inbox = window.OP.inbox || (window.OP.inbox = { entries: [] });
    const existingIds = new Set(inbox.entries.map(e => e.sourceId));

    entries.forEach(entry => {
      const existing = inbox.entries.find(e => e.sourceId === entry.sourceId && e.channel === 'whatsapp');
      if (existing) {
        if (entry.timestamp > existing.timestamp) {
          existing.preview = entry.preview;
          existing.time = entry.time;
          existing.timestamp = entry.timestamp;
          existing.unread = entry.unread;
          existing.status = entry.status;
        }
      } else {
        inbox.entries.push(entry);
      }
    });

    inbox.entries.sort((a, b) => b.timestamp - a.timestamp);
    if (inbox.entries.length > MAX_INBOX_ENTRIES) {
      inbox.entries.splice(MAX_INBOX_ENTRIES);
    }

    if (typeof window.OP === 'object' && typeof window.OP.inboxUpdated === 'function') {
      window.OP.inboxUpdated();
    }
  }

  async function poll() {
    const entries = await fetchWhatsAppInboxEntries();
    mergeIntoInbox(entries);
  }

  let intervalId = null;

  function start() {
    if (intervalId) return;
    poll();
    intervalId = setInterval(poll, POLL_INTERVAL_MS);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  window.OP.whatsappInboxBridge = { start, stop, poll };
})();