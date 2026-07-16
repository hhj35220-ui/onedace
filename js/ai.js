/**
 * OnePlace Enterprise v3.0 — AI Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const AI_STORAGE_KEYS = {
  CONVERSATIONS: 'op_ai_conversations',
  PROMPTS: 'op_ai_prompts',
  FAVORITE_PROMPTS: 'op_ai_favorite_prompts',
  RECENT_PROMPTS: 'op_ai_recent_prompts',
  AI_SETTINGS: 'op_ai_settings',
  AI_STATS: 'op_ai_stats',
  USAGE_DATA: 'op_ai_usage_data',
  SEARCH_HISTORY: 'op_ai_search_history'
};

// ============================================
// Sample Data
// ============================================
const SAMPLE_PROMPTS = [
  {
    id: 'p1',
    name: 'Professional Email',
    category: 'email',
    description: 'Write a professional business email for any occasion',
    icon: 'ph-envelope-simple',
    iconColor: '#6366f1',
    bgColor: '#eef2ff',
    text: 'Write a professional email to {recipient} about {topic}. Keep it concise and formal.',
    favorite: false,
    usageCount: 45
  },
  {
    id: 'p2',
    name: 'Social Media Post',
    category: 'social',
    description: 'Generate engaging social media content',
    icon: 'ph-share-network',
    iconColor: '#ec4899',
    bgColor: '#fdf2f8',
    text: 'Create an engaging {platform} post about {topic} that will drive engagement.',
    favorite: true,
    usageCount: 32
  },
  {
    id: 'p3',
    name: 'Marketing Copy',
    category: 'marketing',
    description: 'Compelling marketing copy for campaigns',
    icon: 'ph-megaphone',
    iconColor: '#f59e0b',
    bgColor: '#fffbeb',
    text: 'Write compelling marketing copy for {product} targeting {audience}.',
    favorite: false,
    usageCount: 28
  },
  {
    id: 'p4',
    name: 'Sales Pitch',
    category: 'sales',
    description: 'Persuasive sales pitch templates',
    icon: 'ph-currency-dollar',
    iconColor: '#10b981',
    bgColor: '#ecfdf5',
    text: 'Create a persuasive sales pitch for {product} highlighting key benefits.',
    favorite: false,
    usageCount: 19
  },
  {
    id: 'p5',
    name: 'Support Response',
    category: 'support',
    description: 'Professional customer support replies',
    icon: 'ph-headset',
    iconColor: '#3b82f6',
    bgColor: '#eff6ff',
    text: 'Write a helpful customer support response for: {issue}',
    favorite: true,
    usageCount: 67
  },
  {
    id: 'p6',
    name: 'Meeting Summary',
    category: 'general',
    description: 'Summarize meeting notes and action items',
    icon: 'ph-users',
    iconColor: '#8b5cf6',
    bgColor: '#f5f3ff',
    text: 'Summarize the following meeting notes and extract action items: {notes}',
    favorite: false,
    usageCount: 23
  },
  {
    id: 'p7',
    name: 'Blog Article',
    category: 'marketing',
    description: 'Generate blog post drafts',
    icon: 'ph-article',
    iconColor: '#f97316',
    bgColor: '#fff7ed',
    text: 'Write a blog article about {topic} with SEO-friendly structure.',
    favorite: false,
    usageCount: 15
  },
  {
    id: 'p8',
    name: 'Product Description',
    category: 'marketing',
    description: 'Compelling product descriptions',
    icon: 'ph-package',
    iconColor: '#06b6d4',
    bgColor: '#ecfeff',
    text: 'Write a compelling product description for {product} highlighting features and benefits.',
    favorite: false,
    usageCount: 21
  },
  {
    id: 'p9',
    name: 'Follow Up Email',
    category: 'email',
    description: 'Polite follow-up email templates',
    icon: 'ph-arrow-u-up-left',
    iconColor: '#6366f1',
    bgColor: '#eef2ff',
    text: 'Write a polite follow-up email to {recipient} regarding {topic}.',
    favorite: true,
    usageCount: 38
  }
];

const SAMPLE_CONVERSATIONS = [
  { id: 'conv1', title: 'Help me analyze Q2 sales data', timestamp: Date.now() - 120000, messages: [] },
  { id: 'conv2', title: 'Write a follow up email to client', timestamp: Date.now() - 3600000, messages: [] },
  { id: 'conv3', title: 'Summarize customer support tickets', timestamp: Date.now() - 10800000, messages: [] },
  { id: 'conv4', title: 'Create content calendar for May', timestamp: Date.now() - 18000000, messages: [] },
  { id: 'conv5', title: 'Generate Instagram post ideas', timestamp: Date.now() - 86400000, messages: [] },
  { id: 'conv6', title: 'Draft partnership proposal', timestamp: Date.now() - 172800000, messages: [] },
  { id: 'conv7', title: 'Analyze competitor strategy', timestamp: Date.now() - 259200000, messages: [] },
  { id: 'conv8', title: 'Write product launch copy', timestamp: Date.now() - 345600000, messages: [] }
];

const AI_RESPONSES = {
  email: "I've drafted a professional email for you. Here's the content:\n\nSubject: Follow-Up on Our Recent Discussion\n\nDear [Name],\n\nI hope this message finds you well. I wanted to follow up on our conversation from last week regarding [topic].\n\n[Body content tailored to your request]\n\nPlease let me know if you have any questions or need further clarification.\n\nBest regards,\nAlex Morgan",
  summarize: "Here's a summary of the key points:\n\n1. **Main Topic**: [Extracted main topic]\n2. **Key Findings**: [Key findings]\n3. **Action Items**: [Action items]\n4. **Next Steps**: [Recommended next steps]\n\nWould you like me to expand on any of these points?",
  social: "Here's a social media post for you:\n\n🚀 Exciting news! We're launching [feature/product] that will help you [benefit].\n\n✨ Key features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\nStay tuned for more updates! #innovation #business",
  feedback: "Based on the customer feedback analysis:\n\n**Sentiment**: Predominantly positive (78%)\n**Top Themes**:\n• Product quality (mentioned 45 times)\n• Customer service (mentioned 32 times)\n• Pricing (mentioned 28 times)\n\n**Key Insights**:\n• Customers love the new interface\n• Response time is a common concern\n• Feature requests focus on mobile experience",
  tasks: "Here's your organized task list:\n\n**High Priority**:\n□ [Task 1]\n□ [Task 2]\n\n**Medium Priority**:\n□ [Task 3]\n□ [Task 4]\n\n**Low Priority**:\n□ [Task 5]\n\n**Due Dates**:\n• [Task 1]: [Date]\n• [Task 2]: [Date]",
  brainstorm: "Here are some creative ideas:\n\n1. **Idea One**: [Detailed description]\n2. **Idea Two**: [Detailed description]\n3. **Idea Three**: [Detailed description]\n4. **Idea Four**: [Detailed description]\n5. **Idea Five**: [Detailed description]\n\nWould you like me to develop any of these further?",
  default: "I'd be happy to help with that! Let me process your request and provide a comprehensive response.\n\nBased on your input, here are my recommendations:\n\n1. **Analysis**: [Detailed analysis]\n2. **Recommendations**: [Actionable recommendations]\n3. **Next Steps**: [Suggested next steps]\n\nIs there anything specific you'd like me to elaborate on?"
};

const SEARCH_RESULTS = [
  { id: 'sr1', title: 'Q2 Sales Report 2026', source: 'documents', description: 'Comprehensive sales analysis for Q2 including revenue figures and growth metrics.', date: 'Jul 10, 2026', icon: 'ph-file-text', color: '#6366f1' },
  { id: 'sr2', title: 'Email from Sarah Williams', source: 'emails', description: 'Regarding the new marketing campaign proposal and budget allocation.', date: 'Jul 11, 2026', icon: 'ph-envelope-simple', color: '#ea4335' },
  { id: 'sr3', title: 'Customer Support Ticket #4821', source: 'conversations', description: 'Technical issue with dashboard loading times reported by enterprise client.', date: 'Jul 9, 2026', icon: 'ph-chat-circle-text', color: '#25d366' },
  { id: 'sr4', title: 'Project Alpha Timeline', source: 'tasks', description: 'Updated project timeline with milestones and deliverables for Q3.', date: 'Jul 8, 2026', icon: 'ph-check-square', color: '#f59e0b' },
  { id: 'sr5', title: 'John Doe - Enterprise Client', source: 'contacts', description: 'Contact information and interaction history for key enterprise account.', date: 'Jul 5, 2026', icon: 'ph-user', color: '#0a66c2' }
];

// ============================================
// AI Module Class
// ============================================
class AIModule {
  constructor() {
    this.currentTab = 'assistant';
    this.currentConversation = null;
    this.conversations = [];
    this.prompts = [];
    this.favorites = [];
    this.recentPrompts = [];
    this.settings = {};
    this.init();
  }

  init() {
    this.loadData();
    this.bindEvents();
    this.renderPrompts();
    this.updateStats();
  }

  loadData() {
    const savedConversations = localStorage.getItem(AI_STORAGE_KEYS.CONVERSATIONS);
    this.conversations = savedConversations ? JSON.parse(savedConversations) : [...SAMPLE_CONVERSATIONS];

    const savedPrompts = localStorage.getItem(AI_STORAGE_KEYS.PROMPTS);
    this.prompts = savedPrompts ? JSON.parse(savedPrompts) : [...SAMPLE_PROMPTS];

    const savedFavorites = localStorage.getItem(AI_STORAGE_KEYS.FAVORITE_PROMPTS);
    this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    const savedRecent = localStorage.getItem(AI_STORAGE_KEYS.RECENT_PROMPTS);
    this.recentPrompts = savedRecent ? JSON.parse(savedRecent) : [];

    const savedSettings = localStorage.getItem(AI_STORAGE_KEYS.AI_SETTINGS);
    this.settings = savedSettings ? JSON.parse(savedSettings) : {
      autoSave: true,
      showSuggestions: true,
      defaultTone: 'professional',
      defaultLength: 'medium'
    };
  }

  saveData() {
    localStorage.setItem(AI_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
    localStorage.setItem(AI_STORAGE_KEYS.PROMPTS, JSON.stringify(this.prompts));
    localStorage.setItem(AI_STORAGE_KEYS.FAVORITE_PROMPTS, JSON.stringify(this.favorites));
    localStorage.setItem(AI_STORAGE_KEYS.RECENT_PROMPTS, JSON.stringify(this.recentPrompts));
    localStorage.setItem(AI_STORAGE_KEYS.AI_SETTINGS, JSON.stringify(this.settings));
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // Tab switching
    document.querySelectorAll('.ai-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
    });

    // New Chat buttons
    const newChatBtn = document.getElementById('newChatBtn');
    const newChatSidebarBtn = document.getElementById('newChatSidebarBtn');
    if (newChatBtn) newChatBtn.addEventListener('click', () => this.startNewChat());
    if (newChatSidebarBtn) newChatSidebarBtn.addEventListener('click', () => this.startNewChat());

    // Chat input
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    if (chatSendBtn) chatSendBtn.addEventListener('click', () => this.sendMessage());

    // Quick action cards
    document.querySelectorAll('.quick-action-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.dataset.action;
        this.handleQuickAction(action);
      });
    });

    // Quick action small buttons
    document.querySelectorAll('.quick-action-small').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.switchTab(action === 'writer' ? 'writer' : action === 'email' ? 'email' : action === 'reply' ? 'reply' : 'search');
      });
    });

    // Suggested prompts
    document.querySelectorAll('.suggested-prompt-card').forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.dataset.prompt;
        this.handleSuggestedPrompt(prompt);
      });
    });

    // Category items
    document.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        this.filterPromptsByCategory(item.dataset.category);
      });
    });

    // Recent conversations
    document.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('click', () => {
        this.loadConversation(item.dataset.id);
      });
    });

    // View all links
    const viewAllConversations = document.getElementById('viewAllConversations');
    const viewAllCategories = document.getElementById('viewAllCategories');
    const viewAllRecentPrompts = document.getElementById('viewAllRecentPrompts');
    const viewAllSuggested = document.getElementById('viewAllSuggested');

    if (viewAllConversations) viewAllConversations.addEventListener('click', (e) => {
      e.preventDefault();
      this.openConversationModal();
    });
    if (viewAllCategories) viewAllCategories.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('prompts');
    });
    if (viewAllRecentPrompts) viewAllRecentPrompts.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('prompts');
    });
    if (viewAllSuggested) viewAllSuggested.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('prompts');
    });

    // Writer template selection
    document.querySelectorAll('#writerTemplates .template-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#writerTemplates .template-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Email template selection
    document.querySelectorAll('#emailTemplates .template-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#emailTemplates .template-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Reply template selection
    document.querySelectorAll('#replyTemplates .template-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#replyTemplates .template-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Generate buttons
    const writerGenerateBtn = document.getElementById('writerGenerateBtn');
    const emailGenerateBtn = document.getElementById('emailGenerateBtn');
    const replyGenerateBtn = document.getElementById('replyGenerateBtn');

    if (writerGenerateBtn) writerGenerateBtn.addEventListener('click', () => this.generateWriterContent());
    if (emailGenerateBtn) emailGenerateBtn.addEventListener('click', () => this.generateEmail());
    if (replyGenerateBtn) replyGenerateBtn.addEventListener('click', () => this.generateReply());

    // Copy buttons
    const writerCopyBtn = document.getElementById('writerCopyBtn');
    const emailCopyBtn = document.getElementById('emailCopyBtn');
    const replyCopyBtn = document.getElementById('replyCopyBtn');

    if (writerCopyBtn) writerCopyBtn.addEventListener('click', () => this.copyToClipboard('writerOutputContent'));
    if (emailCopyBtn) emailCopyBtn.addEventListener('click', () => this.copyToClipboard('emailPreview'));
    if (replyCopyBtn) replyCopyBtn.addEventListener('click', () => this.copyToClipboard('replyPreview'));

    // Regenerate buttons
    const writerRegenerateBtn = document.getElementById('writerRegenerateBtn');
    const emailRegenerateBtn = document.getElementById('emailRegenerateBtn');
    const replyRegenerateBtn = document.getElementById('replyRegenerateBtn');

    if (writerRegenerateBtn) writerRegenerateBtn.addEventListener('click', () => this.generateWriterContent());
    if (emailRegenerateBtn) emailRegenerateBtn.addEventListener('click', () => this.generateEmail());
    if (replyRegenerateBtn) replyRegenerateBtn.addEventListener('click', () => this.generateReply());

    // Search
    const knowledgeSearch = document.getElementById('knowledgeSearch');
    const knowledgeSearchBtn = document.getElementById('knowledgeSearchBtn');

    if (knowledgeSearch) {
      knowledgeSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.performSearch(knowledgeSearch.value);
      });
    }
    if (knowledgeSearchBtn) knowledgeSearchBtn.addEventListener('click', () => {
      if (knowledgeSearch) this.performSearch(knowledgeSearch.value);
    });

    // Search filters
    document.querySelectorAll('.search-filter').forEach(filter => {
      filter.addEventListener('click', () => {
        document.querySelectorAll('.search-filter').forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        if (knowledgeSearch && knowledgeSearch.value) {
          this.performSearch(knowledgeSearch.value, filter.dataset.filter);
        }
      });
    });

    // Prompts filters
    document.querySelectorAll('.prompts-filter').forEach(filter => {
      filter.addEventListener('click', () => {
        document.querySelectorAll('.prompts-filter').forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        this.filterPromptsGrid(filter.dataset.filter);
      });
    });

    // Prompts search
    const promptsSearch = document.getElementById('promptsSearch');
    if (promptsSearch) {
      promptsSearch.addEventListener('input', (e) => {
        this.searchPrompts(e.target.value);
      });
    }

    // Create prompt modal
    const createPromptBtn = document.getElementById('createPromptBtn');
    const closePromptModal = document.getElementById('closePromptModal');
    const cancelPromptBtn = document.getElementById('cancelPromptBtn');
    const savePromptBtn = document.getElementById('savePromptBtn');

    if (createPromptBtn) createPromptBtn.addEventListener('click', () => this.openModal('newPromptModal'));
    if (closePromptModal) closePromptModal.addEventListener('click', () => this.closeModal('newPromptModal'));
    if (cancelPromptBtn) cancelPromptBtn.addEventListener('click', () => this.closeModal('newPromptModal'));
    if (savePromptBtn) savePromptBtn.addEventListener('click', () => this.saveNewPrompt());

    // Conversation modal
    const closeConversationModal = document.getElementById('closeConversationModal');
    if (closeConversationModal) closeConversationModal.addEventListener('click', () => this.closeModal('conversationModal'));

    // AI Settings modal
    const closeAiSettingsModal = document.getElementById('closeAiSettingsModal');
    const cancelAiSettingsBtn = document.getElementById('cancelAiSettingsBtn');
    const saveAiSettingsBtn = document.getElementById('saveAiSettingsBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    if (closeAiSettingsModal) closeAiSettingsModal.addEventListener('click', () => this.closeModal('aiSettingsModal'));
    if (cancelAiSettingsBtn) cancelAiSettingsBtn.addEventListener('click', () => this.closeModal('aiSettingsModal'));
    if (saveAiSettingsBtn) saveAiSettingsBtn.addEventListener('click', () => this.saveSettings());
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => this.clearHistory());

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
      });
    });

    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const headerSearch = document.getElementById('headerSearch');
        if (headerSearch) headerSearch.focus();
      }
    });

    // Theme toggle in sidebar
    const themeToggleSidebar = document.getElementById('themeToggleSidebar');
    if (themeToggleSidebar) {
      themeToggleSidebar.addEventListener('click', () => {
        if (window.OP && window.OP.theme) {
          window.OP.theme.toggle();
        }
      });
    }
  }

  // ============================================
  // Tab Switching
  // ============================================
  switchTab(tabName) {
    this.currentTab = tabName;

    document.querySelectorAll('.ai-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.querySelectorAll('.ai-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === tabName);
    });

    if (tabName === 'prompts') {
      this.renderPrompts();
    }
  }

  // ============================================
  // Chat Functions
  // ============================================
  startNewChat() {
    this.currentConversation = null;
    const welcomeSection = document.getElementById('welcomeSection');
    const chatInterface = document.getElementById('chatInterface');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');

    if (welcomeSection) welcomeSection.style.display = 'flex';
    if (chatInterface) chatInterface.style.display = 'none';
    if (chatMessages) chatMessages.innerHTML = '';
    if (chatInput) chatInput.value = '';

    this.switchTab('assistant');
  }

  loadConversation(convId) {
    const conv = this.conversations.find(c => c.id === convId);
    if (!conv) return;

    this.currentConversation = conv;
    const welcomeSection = document.getElementById('welcomeSection');
    const chatInterface = document.getElementById('chatInterface');
    const chatMessages = document.getElementById('chatMessages');

    if (welcomeSection) welcomeSection.style.display = 'none';
    if (chatInterface) chatInterface.style.display = 'block';

    if (chatMessages) {
      chatMessages.innerHTML = '';
      if (conv.messages && conv.messages.length > 0) {
        conv.messages.forEach(msg => this.renderMessage(msg));
      } else {
        this.addAIMessage('I found our previous conversation about: ' + conv.title + '. How can I continue helping you?');
      }
    }

    this.switchTab('assistant');
  }

  sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const welcomeSection = document.getElementById('welcomeSection');
    const chatInterface = document.getElementById('chatInterface');

    if (!chatInput || !chatInput.value.trim()) return;

    const message = chatInput.value.trim();
    chatInput.value = '';

    if (welcomeSection) welcomeSection.style.display = 'none';
    if (chatInterface) chatInterface.style.display = 'block';

    this.addUserMessage(message);
    this.showTypingIndicator();

    // Simulate AI response
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addAIMessage(response);
      this.saveConversation(message, response);
    }, 1500);
  }

  addUserMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message user';
    msgDiv.innerHTML = `
      <div class="chat-message-avatar">AM</div>
      <div>
        <div class="chat-message-content">${this.escapeHtml(text)}</div>
        <div class="chat-message-time">${this.formatTime(new Date())}</div>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    this.scrollToBottom();
  }

  addAIMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message ai';
    msgDiv.innerHTML = `
      <div class="chat-message-avatar"><i class="ph ph-sparkle"></i></div>
      <div>
        <div class="chat-message-content">${this.formatMarkdown(text)}</div>
        <div class="chat-message-time">${this.formatTime(new Date())}</div>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai typing-indicator-container';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="chat-message-avatar"><i class="ph ph-sparkle"></i></div>
      <div class="chat-message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  renderMessage(msg) {
    if (msg.role === 'user') {
      this.addUserMessage(msg.content);
    } else {
      this.addAIMessage(msg.content);
    }
  }

  scrollToBottom() {
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
      chatInterface.scrollTop = chatInterface.scrollHeight;
    }
  }

  generateResponse(message) {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('email')) return AI_RESPONSES.email;
    if (lowerMsg.includes('summar')) return AI_RESPONSES.summarize;
    if (lowerMsg.includes('social') || lowerMsg.includes('post') || lowerMsg.includes('instagram')) return AI_RESPONSES.social;
    if (lowerMsg.includes('feedback') || lowerMsg.includes('analy')) return AI_RESPONSES.feedback;
    if (lowerMsg.includes('task') || lowerMsg.includes('list')) return AI_RESPONSES.tasks;
    if (lowerMsg.includes('idea') || lowerMsg.includes('brainstorm')) return AI_RESPONSES.brainstorm;
    return AI_RESPONSES.default;
  }

  saveConversation(userMessage, aiResponse) {
    if (!this.settings.autoSave) return;

    if (!this.currentConversation) {
      this.currentConversation = {
        id: 'conv_' + Date.now(),
        title: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
        timestamp: Date.now(),
        messages: []
      };
      this.conversations.unshift(this.currentConversation);
    }

    this.currentConversation.messages.push(
      { role: 'user', content: userMessage, timestamp: Date.now() },
      { role: 'ai', content: aiResponse, timestamp: Date.now() }
    );
    this.currentConversation.timestamp = Date.now();

    this.saveData();
    this.updateConversationList();
  }

  updateConversationList() {
    const container = document.getElementById('recentConversations');
    if (!container) return;

    const sorted = this.conversations.slice(0, 5).sort((a, b) => b.timestamp - a.timestamp);
    container.innerHTML = sorted.map(conv => `
      <div class="conversation-item" data-id="${conv.id}">
        <div class="conversation-text">${this.escapeHtml(conv.title)}</div>
        <div class="conversation-meta">${this.timeAgo(conv.timestamp)}</div>
      </div>
    `).join('');

    container.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('click', () => this.loadConversation(item.dataset.id));
    });
  }

  // ============================================
  // Quick Actions
  // ============================================
  handleQuickAction(action) {
    const chatInput = document.getElementById('chatInput');
    const prompts = {
      email: 'Write a professional email',
      summarize: 'Summarize this for me',
      social: 'Generate a social media post',
      feedback: 'Analyze customer feedback',
      tasks: 'Create a task list',
      brainstorm: 'Help me brainstorm ideas'
    };

    if (chatInput && prompts[action]) {
      chatInput.value = prompts[action];
      chatInput.focus();
    }
  }

  handleSuggestedPrompt(prompt) {
    const prompts = {
      'email-followup': 'Write a follow up email to a client about our recent meeting',
      'meeting-summary': 'Summarize the key points from our team meeting',
      'content-ideas': 'Generate content ideas for our company blog',
      'customer-insights': 'Analyze recent customer feedback and provide insights'
    };

    const welcomeSection = document.getElementById('welcomeSection');
    const chatInterface = document.getElementById('chatInterface');

    if (welcomeSection) welcomeSection.style.display = 'none';
    if (chatInterface) chatInterface.style.display = 'block';

    const message = prompts[prompt] || 'Help me with this task';
    this.addUserMessage(message);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addAIMessage(response);
      this.saveConversation(message, response);
    }, 1500);
  }

  // ============================================
  // Prompts
  // ============================================
  renderPrompts(filter = 'all') {
    const grid = document.getElementById('promptsGrid');
    if (!grid) return;

    let filtered = this.prompts;
    if (filter === 'favorites') {
      filtered = this.prompts.filter(p => this.favorites.includes(p.id));
    } else if (filter === 'recent') {
      const recentIds = this.recentPrompts.slice(0, 10);
      filtered = this.prompts.filter(p => recentIds.includes(p.id));
    } else if (filter !== 'all') {
      filtered = this.prompts.filter(p => p.category === filter);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="search-empty" style="grid-column: 1 / -1;">
          <i class="ph ph-books"></i>
          <h3>No prompts found</h3>
          <p>Try a different filter or create a new prompt.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(prompt => `
      <div class="prompt-card" data-id="${prompt.id}">
        <div class="prompt-card-header">
          <div class="prompt-card-icon" style="background: ${prompt.bgColor}; color: ${prompt.iconColor};">
            <i class="ph ${prompt.icon}"></i>
          </div>
          <button class="prompt-card-favorite ${this.favorites.includes(prompt.id) ? 'active' : ''}" data-id="${prompt.id}">
            <i class="ph ${this.favorites.includes(prompt.id) ? 'ph-star' : 'ph-star'}"></i>
          </button>
        </div>
        <h4>${this.escapeHtml(prompt.name)}</h4>
        <p>${this.escapeHtml(prompt.description)}</p>
        <div class="prompt-card-footer">
          <span class="prompt-card-category tag-${prompt.category}">${prompt.category}</span>
          <div class="prompt-card-actions">
            <button class="prompt-card-action" title="Use prompt" data-action="use" data-id="${prompt.id}">
              <i class="ph ph-play"></i>
            </button>
            <button class="prompt-card-action" title="Edit" data-action="edit" data-id="${prompt.id}">
              <i class="ph ph-pencil-simple"></i>
            </button>
            <button class="prompt-card-action" title="Delete" data-action="delete" data-id="${prompt.id}">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Bind prompt card events
    grid.querySelectorAll('.prompt-card-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(btn.dataset.id);
      });
    });

    grid.querySelectorAll('.prompt-card-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'use') this.usePrompt(id);
        if (action === 'edit') this.editPrompt(id);
        if (action === 'delete') this.deletePrompt(id);
      });
    });

    grid.querySelectorAll('.prompt-card').forEach(card => {
      card.addEventListener('click', () => {
        this.usePrompt(card.dataset.id);
      });
    });
  }

  filterPromptsByCategory(category) {
    this.switchTab('prompts');
    setTimeout(() => {
      document.querySelectorAll('.prompts-filter').forEach(f => f.classList.remove('active'));
      const filterBtn = document.querySelector(`.prompts-filter[data-filter="${category}"]`);
      if (filterBtn) filterBtn.classList.add('active');
      this.filterPromptsGrid(category);
    }, 100);
  }

  filterPromptsGrid(filter) {
    this.renderPrompts(filter);
  }

  searchPrompts(query) {
    const grid = document.getElementById('promptsGrid');
    if (!grid) return;

    if (!query.trim()) {
      this.renderPrompts();
      return;
    }

    const q = query.toLowerCase();
    const filtered = this.prompts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="search-empty" style="grid-column: 1 / -1;">
          <i class="ph ph-magnifying-glass"></i>
          <h3>No prompts found</h3>
          <p>No prompts match "${this.escapeHtml(query)}"</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(prompt => `
      <div class="prompt-card" data-id="${prompt.id}">
        <div class="prompt-card-header">
          <div class="prompt-card-icon" style="background: ${prompt.bgColor}; color: ${prompt.iconColor};">
            <i class="ph ${prompt.icon}"></i>
          </div>
          <button class="prompt-card-favorite ${this.favorites.includes(prompt.id) ? 'active' : ''}" data-id="${prompt.id}">
            <i class="ph ${this.favorites.includes(prompt.id) ? 'ph-star' : 'ph-star'}"></i>
          </button>
        </div>
        <h4>${this.escapeHtml(prompt.name)}</h4>
        <p>${this.escapeHtml(prompt.description)}</p>
        <div class="prompt-card-footer">
          <span class="prompt-card-category tag-${prompt.category}">${prompt.category}</span>
          <div class="prompt-card-actions">
            <button class="prompt-card-action" title="Use prompt" data-action="use" data-id="${prompt.id}">
              <i class="ph ph-play"></i>
            </button>
            <button class="prompt-card-action" title="Edit" data-action="edit" data-id="${prompt.id}">
              <i class="ph ph-pencil-simple"></i>
            </button>
            <button class="prompt-card-action" title="Delete" data-action="delete" data-id="${prompt.id}">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.prompt-card-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(btn.dataset.id);
      });
    });
  }

  toggleFavorite(promptId) {
    const idx = this.favorites.indexOf(promptId);
    if (idx > -1) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(promptId);
    }
    this.saveData();
    this.renderPrompts();
  }

  usePrompt(promptId) {
    const prompt = this.prompts.find(p => p.id === promptId);
    if (!prompt) return;

    // Add to recent
    this.recentPrompts = this.recentPrompts.filter(id => id !== promptId);
    this.recentPrompts.unshift(promptId);
    if (this.recentPrompts.length > 20) this.recentPrompts.pop();
    this.saveData();

    // Switch to assistant and use prompt
    this.switchTab('assistant');
    const chatInput = document.getElementById('chatInput');
    const welcomeSection = document.getElementById('welcomeSection');
    const chatInterface = document.getElementById('chatInterface');

    if (welcomeSection) welcomeSection.style.display = 'none';
    if (chatInterface) chatInterface.style.display = 'block';

    const message = `Use prompt: ${prompt.name}`;
    this.addUserMessage(message);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = `I'll help you with "${prompt.name}".\n\n${prompt.text}\n\nPlease provide the specific details you'd like me to fill in, and I'll generate the content for you.`;
      this.addAIMessage(response);
      this.saveConversation(message, response);
    }, 1200);
  }

  editPrompt(promptId) {
    const prompt = this.prompts.find(p => p.id === promptId);
    if (!prompt) return;

    const nameInput = document.getElementById('promptName');
    const categoryInput = document.getElementById('promptCategory');
    const textInput = document.getElementById('promptText');
    const descInput = document.getElementById('promptDescription');

    if (nameInput) nameInput.value = prompt.name;
    if (categoryInput) categoryInput.value = prompt.category;
    if (textInput) textInput.value = prompt.text;
    if (descInput) descInput.value = prompt.description;

    this.editingPromptId = promptId;
    this.openModal('newPromptModal');
  }

  deletePrompt(promptId) {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    this.prompts = this.prompts.filter(p => p.id !== promptId);
    this.favorites = this.favorites.filter(id => id !== promptId);
    this.recentPrompts = this.recentPrompts.filter(id => id !== promptId);
    this.saveData();
    this.renderPrompts();
  }

  saveNewPrompt() {
    const nameInput = document.getElementById('promptName');
    const categoryInput = document.getElementById('promptCategory');
    const textInput = document.getElementById('promptText');
    const descInput = document.getElementById('promptDescription');

    if (!nameInput || !nameInput.value.trim()) {
      alert('Please enter a prompt name');
      return;
    }
    if (!textInput || !textInput.value.trim()) {
      alert('Please enter prompt text');
      return;
    }

    const category = categoryInput ? categoryInput.value : 'general';
    const categoryColors = {
      email: { icon: 'ph-envelope-simple', color: '#6366f1', bg: '#eef2ff' },
      social: { icon: 'ph-share-network', color: '#ec4899', bg: '#fdf2f8' },
      marketing: { icon: 'ph-megaphone', color: '#f59e0b', bg: '#fffbeb' },
      sales: { icon: 'ph-currency-dollar', color: '#10b981', bg: '#ecfdf5' },
      support: { icon: 'ph-headset', color: '#3b82f6', bg: '#eff6ff' },
      general: { icon: 'ph-sparkle', color: '#8b5cf6', bg: '#f5f3ff' }
    };

    const colors = categoryColors[category] || categoryColors.general;

    if (this.editingPromptId) {
      const idx = this.prompts.findIndex(p => p.id === this.editingPromptId);
      if (idx > -1) {
        this.prompts[idx] = {
          ...this.prompts[idx],
          name: nameInput.value.trim(),
          category,
          text: textInput.value.trim(),
          description: descInput ? descInput.value.trim() : ''
        };
      }
      this.editingPromptId = null;
    } else {
      const newPrompt = {
        id: 'p_' + Date.now(),
        name: nameInput.value.trim(),
        category,
        description: descInput ? descInput.value.trim() : '',
        icon: colors.icon,
        iconColor: colors.color,
        bgColor: colors.bg,
        text: textInput.value.trim(),
        favorite: false,
        usageCount: 0
      };
      this.prompts.push(newPrompt);
    }

    this.saveData();
    this.closeModal('newPromptModal');
    this.renderPrompts();

    // Clear form
    if (nameInput) nameInput.value = '';
    if (textInput) textInput.value = '';
    if (descInput) descInput.value = '';
  }

  // ============================================
  // Writer / Email / Reply Generators
  // ============================================
  generateWriterContent() {
    const topic = document.getElementById('writerTopic');
    const tone = document.getElementById('writerTone');
    const length = document.getElementById('writerLength');
    const instructions = document.getElementById('writerInstructions');
    const output = document.getElementById('writerOutput');
    const outputContent = document.getElementById('writerOutputContent');

    if (!topic || !topic.value.trim()) {
      alert('Please enter a topic');
      return;
    }

    const topicVal = topic.value.trim();
    const toneVal = tone ? tone.value : 'professional';
    const lengthVal = length ? length.value : 'medium';
    const instrVal = instructions ? instructions.value.trim() : '';

    const wordCounts = { short: 200, medium: 500, long: 1000 };
    const wordCount = wordCounts[lengthVal] || 500;

    const content = `# ${topicVal}\n\nThis is a ${toneVal} piece of content about ${topicVal}. Written in approximately ${wordCount} words.\n\n${instrVal ? 'Additional instructions: ' + instrVal + '\n\n' : ''}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nKey points covered:\n• Main concept and overview\n• Detailed analysis and insights\n• Practical applications\n• Conclusion and next steps\n\nThis content has been generated with a ${toneVal} tone to match your requirements. You can edit, copy, or regenerate as needed.`;

    if (outputContent) outputContent.textContent = content;
    if (output) output.style.display = 'block';

    this.updateStats();
  }

  generateEmail() {
    const recipient = document.getElementById('emailRecipient');
    const sender = document.getElementById('emailSender');
    const subject = document.getElementById('emailSubject');
    const tone = document.getElementById('emailTone');
    const length = document.getElementById('emailLength');
    const points = document.getElementById('emailPoints');
    const output = document.getElementById('emailOutput');
    const preview = document.getElementById('emailPreview');

    if (!subject || !subject.value.trim()) {
      alert('Please enter a subject');
      return;
    }

    const recipientVal = recipient ? recipient.value.trim() : '[Recipient]';
    const senderVal = sender ? sender.value.trim() : 'Alex Morgan';
    const subjectVal = subject.value.trim();
    const toneVal = tone ? tone.value : 'professional';

    const email = `Subject: ${subjectVal}\n\nDear ${recipientVal},\n\nI hope this email finds you well. I am writing to you regarding ${subjectVal.toLowerCase()}.\n\n${points && points.value.trim() ? 'Key points to address:\n' + points.value.trim().split('\n').map(p => '• ' + p).join('\n') + '\n\n' : ''}Please let me know if you have any questions or require further information. I look forward to hearing from you.\n\nBest regards,\n${senderVal}`;

    if (preview) preview.textContent = email;
    if (output) output.style.display = 'block';

    this.updateStats();
  }

  generateReply() {
    const original = document.getElementById('replyOriginal');
    const tone = document.getElementById('replyTone');
    const length = document.getElementById('replyLength');
    const context = document.getElementById('replyContext');
    const output = document.getElementById('replyOutput');
    const preview = document.getElementById('replyPreview');

    if (!original || !original.value.trim()) {
      alert('Please paste the original message');
      return;
    }

    const originalVal = original.value.trim();
    const toneVal = tone ? tone.value : 'professional';

    const reply = `Thank you for your message.\n\n${context && context.value.trim() ? 'Context: ' + context.value.trim() + '\n\n' : ''}In response to your message regarding the above, I would like to provide the following:\n\n• Acknowledgment of your points\n• My perspective and thoughts\n• Proposed next steps\n\nPlease let me know if this works for you or if you need any clarification.\n\nBest regards`;

    if (preview) preview.textContent = reply;
    if (output) output.style.display = 'block';

    this.updateStats();
  }

  // ============================================
  // Search
  // ============================================
  performSearch(query, filter = 'all') {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer || !query.trim()) return;

    let results = SEARCH_RESULTS;
    if (filter !== 'all') {
      results = results.filter(r => r.source === filter);
    }

    // Simple text matching simulation
    const q = query.toLowerCase();
    results = results.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty">
          <i class="ph ph-magnifying-glass"></i>
          <h3>No results found</h3>
          <p>No matches for "${this.escapeHtml(query)}" in ${filter === 'all' ? 'all sources' : filter}</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = results.map(r => `
      <div class="search-result-item">
        <div class="search-result-icon" style="background: ${r.color}15; color: ${r.color};">
          <i class="ph ${r.icon}"></i>
        </div>
        <div class="search-result-content">
          <h4>${this.escapeHtml(r.title)}</h4>
          <p>${this.escapeHtml(r.description)}</p>
          <div class="search-result-meta">${r.source} • ${r.date}</div>
        </div>
      </div>
    `).join('');
  }

  // ============================================
  // Modals
  // ============================================
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  }

  openConversationModal() {
    const modal = document.getElementById('conversationModal');
    const list = document.getElementById('conversationListFull');
    if (!modal || !list) return;

    const sorted = [...this.conversations].sort((a, b) => b.timestamp - a.timestamp);

    list.innerHTML = sorted.map(conv => `
      <div class="conversation-full-item" data-id="${conv.id}">
        <div class="conversation-full-icon"><i class="ph ph-chat-circle-text"></i></div>
        <div class="conversation-full-info">
          <div class="conversation-full-title">${this.escapeHtml(conv.title)}</div>
          <div class="conversation-full-meta">${conv.messages ? conv.messages.length + ' messages' : 'New'} • ${this.timeAgo(conv.timestamp)}</div>
        </div>
        <div class="conversation-full-time">${this.formatDate(conv.timestamp)}</div>
      </div>
    `).join('');

    list.querySelectorAll('.conversation-full-item').forEach(item => {
      item.addEventListener('click', () => {
        this.loadConversation(item.dataset.id);
        this.closeModal('conversationModal');
      });
    });

    modal.style.display = 'flex';
  }

  // ============================================
  // Settings
  // ============================================
  saveSettings() {
    const autoSave = document.getElementById('autoSaveConversations');
    const showSuggestions = document.getElementById('showSuggestions');
    const defaultTone = document.getElementById('defaultTone');
    const defaultLength = document.getElementById('defaultLength');

    this.settings = {
      autoSave: autoSave ? autoSave.checked : true,
      showSuggestions: showSuggestions ? showSuggestions.checked : true,
      defaultTone: defaultTone ? defaultTone.value : 'professional',
      defaultLength: defaultLength ? defaultLength.value : 'medium'
    };

    this.saveData();
    this.closeModal('aiSettingsModal');

    if (window.OP && window.OP.toast) {
      window.OP.toast.show('Settings saved successfully', 'success');
    }
  }

  clearHistory() {
    if (!confirm('Are you sure you want to clear all conversation history? This cannot be undone.')) return;

    this.conversations = [...SAMPLE_CONVERSATIONS];
    this.saveData();
    this.updateConversationList();

    if (window.OP && window.OP.toast) {
      window.OP.toast.show('Conversation history cleared', 'success');
    }
  }

  // ============================================
  // Stats
  // ============================================
  updateStats() {
    const stats = {
      conversations: this.conversations.length + 1240,
      messagesGenerated: 2456 + Math.floor(Math.random() * 10),
      timeSaved: '24h 35m',
      tasksAssisted: 892,
      accuracyRate: '96.8%',
      creditsUsed: 78
    };

    localStorage.setItem(AI_STORAGE_KEYS.AI_STATS, JSON.stringify(stats));
  }

  // ============================================
  // Utilities
  // ============================================
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/• (.*)/g, '<li>$1</li>')
      .replace(/□ (.*)/g, '<li style="list-style: none;">☐ $1</li>')
      .replace(/\n/g, '<br>');
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    return this.formatDate(timestamp);
  }

  copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const text = element.textContent || element.innerText;
    navigator.clipboard.writeText(text).then(() => {
      if (window.OP && window.OP.toast) {
        window.OP.toast.show('Copied to clipboard', 'success');
      }
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (window.OP && window.OP.toast) {
        window.OP.toast.show('Copied to clipboard', 'success');
      }
    });
  }
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  window.aiModule = new AIModule();
});