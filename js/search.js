/**
 * OnePlace Enterprise v3.0 — Global Search Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const SEARCH_STORAGE_KEYS = {
  SEARCH_INDEX: 'op_search_index',
  SEARCH_HISTORY: 'op_search_history',
  SAVED_SEARCHES: 'op_saved_searches',
  SEARCH_ANALYTICS: 'op_search_analytics',
  SEARCH_SETTINGS: 'op_search_settings',
  RECENT_SEARCHES: 'op_recent_searches',
  TRENDING_SEARCHES: 'op_trending_searches'
};

// ============================================
// Platform Configuration
// ============================================
const PLATFORM_CONFIG = {
  gmail: { name: 'Gmail', icon: 'ph-envelope-simple', color: '#EA4335', bg: '#FDECEA' },
  whatsapp: { name: 'WhatsApp', icon: 'ph-chat-circle-text', color: '#25D366', bg: '#E8F5E9' },
  instagram: { name: 'Instagram', icon: 'ph-camera', color: '#E4405F', bg: '#FCE4EC' },
  tiktok: { name: 'TikTok', icon: 'ph-music-note', color: '#000000', bg: '#F5F5F5' },
  x: { name: 'X (Twitter)', icon: 'ph-x-logo', color: '#1DA1F2', bg: '#E3F2FD' },
  linkedin: { name: 'LinkedIn', icon: 'ph-linkedin-logo', color: '#0A66C2', bg: '#E3F2FD' },
  crm: { name: 'CRM', icon: 'ph-users', color: '#F97316', bg: '#FFF3E0' },
  calendar: { name: 'Calendar', icon: 'ph-calendar-blank', color: '#EC4899', bg: '#FCE4EC' },
  tasks: { name: 'Tasks', icon: 'ph-check-circle', color: '#0EA5E9', bg: '#E0F2FE' },
  files: { name: 'Files', icon: 'ph-folder', color: '#EAB308', bg: '#FEF9C3' },
  ai: { name: 'AI', icon: 'ph-sparkle', color: '#A855F7', bg: '#F3E8FF' },
  reports: { name: 'Reports', icon: 'ph-chart-bar', color: '#10B981', bg: '#ECFDF5' }
};

const CONTENT_TYPES = {
  email: { label: 'Email', badgeClass: 'badge-email' },
  message: { label: 'Message', badgeClass: 'badge-message' },
  file: { label: 'File', badgeClass: 'badge-file' },
  contact: { label: 'Contact', badgeClass: 'badge-contact' },
  task: { label: 'Task', badgeClass: 'badge-task' },
  event: { label: 'Event', badgeClass: 'badge-event' }
};

// ============================================
// Sample Data Generator
// ============================================
class SearchDataGenerator {
  constructor() {
    this.sampleQueries = [
      'Q2 Business Report', 'Marketing Strategy', 'John Smith', 'Product Launch',
      'Meeting Notes', 'Invoice #INV-2025-001', 'Customer Feedback', 'Sales Pipeline',
      'Team Update', 'Budget Review', 'Contract Draft', 'Feature Request',
      'Bug Report #4821', 'Design Mockups', 'API Documentation', 'User Onboarding',
      'Quarterly Review', 'Campaign Analytics', 'Support Ticket', 'Lead Qualification'
    ];

    this.sampleTitles = [
      'Q2 Business Report - Final Draft', 'Marketing Strategy Q2 2025',
      'Re: Marketing Strategy Implementation', 'Marketing Strategy Presentation.pdf',
      'Marketing Strategy Review Meeting', 'Acme Corp - Marketing Strategy',
      'Create Marketing Strategy Report', 'Marketing Strategy Brainstorm',
      'Product Launch Timeline', 'Invoice #INV-2025-001',
      'Customer Feedback Summary', 'Sales Pipeline Update',
      'Team Weekly Update', 'Budget Review Q2',
      'Contract Draft v2', 'Feature Request: Dark Mode',
      'Bug Report #4821: Login Issue', 'Design Mockups - Homepage',
      'API Documentation v3.0', 'User Onboarding Flow'
    ];

    this.sampleDescriptions = [
      'Hi team, please find attached our comprehensive marketing strategy for Q2 2025. This includes...',
      'Let\'s discuss the new marketing strategy for our upcoming product launch. What are your thoughts...',
      'Thank you for sharing the marketing strategy. I have some suggestions that could improve...',
      'PDF • 2.4 MB • Updated by Sarah Johnson',
      'Review and discuss the new marketing strategy for Q2 2025...',
      'Discussion about the new marketing strategy and digital transformation...',
      'Create comprehensive report on marketing strategy performance...',
      'Help me brainstorm innovative marketing strategies for our new product launch...',
      'Project Updates & Requirements', 'Order Confirmation',
      'Collaboration Opportunity', 'Question about your product',
      'Feature Request', 'Great video! 🔥',
      'Partnership Inquiry', 'Need help with my order',
      'Feedback on the new update', 'Booking inquiry',
      'Support ticket #4821', 'Invoice question'
    ];

    this.sampleAuthors = [
      { name: 'Sarah Johnson', email: 'sarah.johnson@company.com', avatar: 'SJ', color: '#6366f1' },
      { name: 'David Wilson', email: 'david.wilson@company.com', avatar: 'DW', color: '#8b5cf6' },
      { name: 'Marketing Team Group', email: 'marketing@company.com', avatar: 'MT', color: '#ec4899' },
      { name: 'John Smith', email: 'john.smith@acme.com', avatar: 'JS', color: '#f43f5e' },
      { name: 'Acme Corporation', email: 'contact@acme.com', avatar: 'AC', color: '#f97316' },
      { name: 'Alex Morgan', email: 'alex@company.com', avatar: 'AM', color: '#22c55e' },
      { name: 'Jake Cooper', email: 'jake@company.com', avatar: 'JC', color: '#06b6d4' },
      { name: 'Cody Fisher', email: 'cody@company.com', avatar: 'CF', color: '#6366f1' },
      { name: 'AI Chat - GPT-4', email: 'ai@company.com', avatar: 'AI', color: '#a855f7' }
    ];

    this.sampleTags = ['Project', 'Proposal', 'Support', 'Sales', 'Urgent', 'Follow-up', 'Bug', 'Feature Request', 'Q2', 'Marketing'];
  }

  generateSearchIndex(count = 500) {
    const platforms = Object.keys(PLATFORM_CONFIG);
    const types = Object.keys(CONTENT_TYPES);
    const items = [];

    for (let i = 0; i < count; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const title = this.sampleTitles[Math.floor(Math.random() * this.sampleTitles.length)];
      const description = this.sampleDescriptions[Math.floor(Math.random() * this.sampleDescriptions.length)];
      const author = this.sampleAuthors[Math.floor(Math.random() * this.sampleAuthors.length)];
      const query = this.sampleQueries[Math.floor(Math.random() * this.sampleQueries.length)];

      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const numTags = Math.floor(Math.random() * 3);
      const tags = [];
      for (let t = 0; t < numTags; t++) {
        const tag = this.sampleTags[Math.floor(Math.random() * this.sampleTags.length)];
        if (!tags.includes(tag)) tags.push(tag);
      }

      items.push({
        id: `search_${i}`,
        platform,
        type,
        title,
        description,
        author,
        date: date.toISOString(),
        dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tags,
        relevance: Math.random(),
        query
      });
    }

    return items;
  }

  generateRecentSearches(count = 8) {
    const searches = [];
    const queries = ['Q2 Report', 'Marketing Strategy', 'John Smith', 'Product Launch', 'Meeting Notes', 'Invoice #INV-2025-001', 'Customer Feedback', 'Sales Pipeline'];
    const platforms = ['All Platforms', 'Gmail', 'WhatsApp', 'CRM', 'Files'];

    for (let i = 0; i < count; i++) {
      const minutesAgo = [2, 15, 60, 120, 180, 300, 480, 720][i] || i * 60;
      searches.push({
        id: `recent_${i}`,
        query: queries[i % queries.length],
        platform: platforms[i % platforms.length],
        results: Math.floor(Math.random() * 200) + 10,
        timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
        timeAgo: this.getTimeAgo(minutesAgo * 60000)
      });
    }

    return searches;
  }

  generateSavedSearches(count = 9) {
    const searches = [];
    const configs = [
      { name: 'Important Emails', icon: 'ph-envelope-simple', platform: 'gmail', results: 45, updated: '2 days ago', favorite: true },
      { name: 'High Priority Messages', icon: 'ph-chat-circle-text', platform: 'whatsapp', results: 128, updated: '1 day ago', favorite: false },
      { name: 'Client Documents', icon: 'ph-folder', platform: 'files', results: 86, updated: '3 days ago', favorite: false },
      { name: 'Unread Conversations', icon: 'ph-tray', platform: 'all', results: 64, updated: '1 day ago', favorite: false },
      { name: 'Q2 Reports', icon: 'ph-chart-bar', platform: 'reports', results: 24, updated: '5 days ago', favorite: true },
      { name: 'Unread Messages', icon: 'ph-chat-circle-dots', platform: 'whatsapp', results: 42, updated: '2 days ago', favorite: false },
      { name: 'Q2 Reports', icon: 'ph-file-text', platform: 'reports', results: 18, updated: '5 days ago', favorite: false },
      { name: 'Meeting Notes', icon: 'ph-notebook', platform: 'all', results: 32, updated: '2 days ago', favorite: false },
      { name: 'John Smith', icon: 'ph-user', platform: 'all', results: 78, updated: '3 days ago', favorite: false },
      { name: 'Invoices', icon: 'ph-receipt', platform: 'files', results: 34, updated: '1 week ago', favorite: false },
      { name: 'Marketing Strategy', icon: 'ph-strategy', platform: 'all', results: 156, updated: '6 days ago', favorite: false }
    ];

    for (let i = 0; i < Math.min(count, configs.length); i++) {
      searches.push({
        id: `saved_${i}`,
        ...configs[i],
        query: configs[i].name
      });
    }

    return searches;
  }

  generateTrendingSearches(count = 5) {
    const queries = [
      { query: 'Q2 Business Report', count: 156 },
      { query: 'Marketing Strategy', count: 142 },
      { query: 'Product Launch', count: 98 },
      { query: 'Customer Feedback', count: 76 },
      { query: 'Invoice', count: 65 }
    ];

    return queries.slice(0, count).map((q, i) => ({
      id: `trending_${i}`,
      rank: i + 1,
      ...q,
      percent: Math.round((q.count / 156) * 100)
    }));
  }

  generateSearchHistory(count = 10) {
    const history = [];
    const queries = ['marketing strategy', 'Q2 report', 'product launch', 'client meeting', 'invoice 2025', 'team update', 'budget review', 'design mockups', 'API docs', 'support ticket'];
    const platforms = ['All Platforms', 'Gmail', 'WhatsApp', 'CRM', 'Files', 'Calendar', 'Tasks'];

    for (let i = 0; i < count; i++) {
      const hoursAgo = (i + 1) * 2;
      history.push({
        id: `hist_${i}`,
        query: queries[i % queries.length],
        platform: platforms[i % platforms.length],
        results: Math.floor(Math.random() * 150) + 5,
        timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
        timeAgo: this.getTimeAgo(hoursAgo * 3600000)
      });
    }

    return history;
  }

  getTimeAgo(ms) {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(ms / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  }
}

// ============================================
// Search Storage Manager
// ============================================
class SearchStorage {
  constructor() {
    this.generator = new SearchDataGenerator();
    this.init();
  }

  init() {
    if (!localStorage.getItem(SEARCH_STORAGE_KEYS.SEARCH_INDEX)) {
      const index = this.generator.generateSearchIndex(500);
      localStorage.setItem(SEARCH_STORAGE_KEYS.SEARCH_INDEX, JSON.stringify(index));
    }

    if (!localStorage.getItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES)) {
      const recent = this.generator.generateRecentSearches();
      localStorage.setItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recent));
    }

    if (!localStorage.getItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES)) {
      const saved = this.generator.generateSavedSearches();
      localStorage.setItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(saved));
    }

    if (!localStorage.getItem(SEARCH_STORAGE_KEYS.SEARCH_HISTORY)) {
      const history = this.generator.generateSearchHistory();
      localStorage.setItem(SEARCH_STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
    }

    if (!localStorage.getItem(SEARCH_STORAGE_KEYS.TRENDING_SEARCHES)) {
      const trending = this.generator.generateTrendingSearches();
      localStorage.setItem(SEARCH_STORAGE_KEYS.TRENDING_SEARCHES, JSON.stringify(trending));
    }

    if (!localStorage.getItem(SEARCH_STORAGE_KEYS.SEARCH_ANALYTICS)) {
      this.initAnalytics();
    }
  }

  initAnalytics() {
    const analytics = {
      totalSearches: 1248,
      uniqueUsers: 342,
      avgResponseTime: 0.28,
      successRate: 96.8,
      volumeData: this.generateVolumeData(7),
      keywords: [
        { keyword: 'marketing strategy', count: 156 },
        { keyword: 'Q2 report', count: 142 },
        { keyword: 'product launch', count: 98 },
        { keyword: 'customer feedback', count: 76 },
        { keyword: 'invoice', count: 65 }
      ],
      platformData: [
        { platform: 'gmail', count: 356, percent: 28.5 },
        { platform: 'whatsapp', count: 298, percent: 23.7 },
        { platform: 'files', count: 208, percent: 16.7 },
        { platform: 'crm', count: 162, percent: 13.3 },
        { platform: 'linkedin', count: 98, percent: 7.8 },
        { platform: 'others', count: 126, percent: 10.0 }
      ],
      aiInsights: [
        { title: 'AI searches this week', value: '342', change: '+18.3%', icon: 'ph-sparkle' },
        { title: 'Accuracy improvement', value: '4.2%', change: '+1.1%', icon: 'ph-chart-line-up' },
        { title: 'Related suggestions used', value: '78%', change: '+13.1%', icon: 'ph-lightbulb' }
      ],
      userData: [
        { name: 'Alex Morgan', avatar: 'AM', color: '#6366f1', searches: 342, avgTime: '0.24s', successRate: 98.2, topPlatform: 'Gmail', trend: 'up' },
        { name: 'Jake Cooper', avatar: 'JC', color: '#8b5cf6', searches: 298, avgTime: '0.31s', successRate: 95.4, topPlatform: 'WhatsApp', trend: 'up' },
        { name: 'Cody Fisher', avatar: 'CF', color: '#ec4899', searches: 256, avgTime: '0.28s', successRate: 97.1, topPlatform: 'CRM', trend: 'down' },
        { name: 'Guy Hawkins', avatar: 'GH', color: '#f43f5e', searches: 198, avgTime: '0.35s', successRate: 94.8, topPlatform: 'Files', trend: 'up' },
        { name: 'Darlene Robertson', avatar: 'DR', color: '#f97316', searches: 154, avgTime: '0.29s', successRate: 96.5, topPlatform: 'LinkedIn', trend: 'up' }
      ]
    };
    localStorage.setItem(SEARCH_STORAGE_KEYS.SEARCH_ANALYTICS, JSON.stringify(analytics));
  }

  generateVolumeData(days) {
    const data = [];
    const labels = ['May 19', 'May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25'];
    for (let i = 0; i < days; i++) {
      data.push({
        label: labels[i] || `Day ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 50 + (i % 2 === 0 ? 50 : 0)
      });
    }
    return data;
  }

  getSearchIndex() {
    return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEYS.SEARCH_INDEX) || '[]');
  }

  getRecentSearches() {
    return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES) || '[]');
  }

  getSavedSearches() {
    return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES) || '[]');
  }

  getSearchHistory() {
    return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEYS.SEARCH_HISTORY) || '[]');
  }

  getTrendingSearches() {
    return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEYS.TRENDING_SEARCHES) || '[]');
  }

  getAnalytics() {
    return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEYS.SEARCH_ANALYTICS) || '{}');
  }

  addToHistory(query, platform, results) {
    const history = this.getSearchHistory();
    history.unshift({
      id: `hist_${Date.now()}`,
      query,
      platform,
      results,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now'
    });
    localStorage.setItem(SEARCH_STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history.slice(0, 50)));
  }

  addRecentSearch(query, platform, results) {
    const recent = this.getRecentSearches();
    const existing = recent.findIndex(r => r.query.toLowerCase() === query.toLowerCase());
    if (existing !== -1) recent.splice(existing, 1);

    recent.unshift({
      id: `recent_${Date.now()}`,
      query,
      platform,
      results,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now'
    });

    localStorage.setItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recent.slice(0, 20)));
  }

  saveSearch(name, query, filters) {
    const saved = this.getSavedSearches();
    saved.unshift({
      id: `saved_${Date.now()}`,
      name,
      query,
      filters,
      results: 0,
      updated: 'Just now',
      favorite: false,
      icon: 'ph-magnifying-glass',
      platform: 'all'
    });
    localStorage.setItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(saved));
  }

  toggleFavorite(id) {
    const saved = this.getSavedSearches();
    const idx = saved.findIndex(s => s.id === id);
    if (idx !== -1) {
      saved[idx].favorite = !saved[idx].favorite;
      localStorage.setItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(saved));
      return saved[idx].favorite;
    }
    return false;
  }

  deleteSavedSearch(id) {
    const saved = this.getSavedSearches().filter(s => s.id !== id);
    localStorage.setItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(saved));
  }

  search(query, filters = {}) {
    let results = this.getSearchIndex();

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.author.name.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters.platform && filters.platform !== 'all') {
      results = results.filter(item => item.platform === filters.platform);
    }

    if (filters.type && filters.type !== 'all') {
      results = results.filter(item => item.type === filters.type);
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      results = results.filter(item => new Date(item.date) >= from);
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      results = results.filter(item => new Date(item.date) <= to);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(item => filters.tags.some(t => item.tags.includes(t)));
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return results;
  }
}

// ============================================
// Chart Renderer (Canvas)
// ============================================
class ChartRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawLineChart(data, options = {}) {
    this.setupCanvas();
    this.clear();

    const padding = options.padding || { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = this.width - padding.left - padding.right;
    const chartH = this.height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map(d => d.value)) * 1.1;
    const minVal = 0;

    // Draw grid
    this.ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--gray-200').trim() || '#e5e7eb';
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left, y);
      this.ctx.lineTo(padding.left + chartW, y);
      this.ctx.stroke();

      // Y labels
      const val = Math.round(maxVal - (maxVal / 4) * i);
      this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gray-400').trim() || '#9ca3af';
      this.ctx.font = '11px Inter, sans-serif';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }

    // Draw line
    const stepX = chartW / (data.length - 1);

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#6366f1';
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    data.forEach((d, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + chartH - ((d.value / maxVal) * chartH);
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    });

    this.ctx.stroke();

    // Draw area
    this.ctx.beginPath();
    this.ctx.moveTo(padding.left, padding.top + chartH);
    data.forEach((d, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + chartH - ((d.value / maxVal) * chartH);
      this.ctx.lineTo(x, y);
    });
    this.ctx.lineTo(padding.left + chartW, padding.top + chartH);
    this.ctx.closePath();

    const gradient = this.ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw points
    data.forEach((d, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + chartH - ((d.value / maxVal) * chartH);

      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#6366f1';
      this.ctx.fill();
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });

    // X labels
    data.forEach((d, i) => {
      const x = padding.left + stepX * i;
      this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gray-500').trim() || '#6b7280';
      this.ctx.font = '11px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(d.label, x, this.height - 10);
    });
  }

  drawDonutChart(data, options = {}) {
    this.setupCanvas();
    this.clear();

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.6;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -Math.PI / 2;

    const colors = options.colors || ['#EA4335', '#25D366', '#EAB308', '#F97316', '#0A66C2', '#94a3b8'];

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * Math.PI * 2;

            this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      this.ctx.closePath();

      this.ctx.fillStyle = colors[i % colors.length];
      this.ctx.fill();

      currentAngle += sliceAngle;
    });
  }

  drawRingChart(percent, options = {}) {
    this.setupCanvas();
    this.clear();

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    const lineWidth = options.lineWidth || 12;

    // Background ring
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--gray-200').trim() || '#e5e7eb';
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();

    // Progress ring
    const endAngle = -Math.PI / 2 + (Math.PI * 2 * (percent / 100));
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
    this.ctx.strokeStyle = options.color || '#6366f1';
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
  }
}

// ============================================
// Search Module Controller
// ============================================
class SearchModule {
  constructor() {
    this.storage = new SearchStorage();
    this.currentView = 'dashboard';
    this.currentQuery = '';
    this.currentFilters = {};
    this.currentResults = [];
    this.currentPage = 1;
    this.resultsPerPage = 12;
    this.selectedTags = [];
    this.selectedPlatforms = ['all'];

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.renderDashboard();
    this.initCharts();
    this.updateThemeToggle();
  }

  cacheElements() {
    // Views
    this.views = {
      dashboard: document.getElementById('viewDashboard'),
      results: document.getElementById('viewResults'),
      advanced: document.getElementById('viewAdvanced'),
      saved: document.getElementById('viewSaved'),
      analytics: document.getElementById('viewAnalytics')
    };

    // Dashboard elements
    this.recentSearchesList = document.getElementById('recentSearchesList');
    this.savedSearchesList = document.getElementById('savedSearchesList');
    this.trendingSearchesList = document.getElementById('trendingSearchesList');
    this.heroSearchInput = document.getElementById('heroSearchInput');
    this.globalSearchInput = document.getElementById('globalSearchInput');
    this.searchSuggestionsDropdown = document.getElementById('searchSuggestionsDropdown');

    // Results elements
    this.resultsTitle = document.getElementById('resultsTitle');
    this.resultsCount = document.getElementById('resultsCount');
    this.searchResultsList = document.getElementById('searchResultsList');
    this.resultsPagination = document.getElementById('resultsPagination');
    this.filtersSidebar = document.getElementById('filtersSidebar');

    // Advanced elements
    this.advancedTabs = document.querySelectorAll('.search-advanced-tab');
    this.advancedPanels = document.querySelectorAll('.search-advanced-panel');
    this.searchTemplatesList = document.getElementById('searchTemplatesList');
    this.searchHistoryList = document.getElementById('searchHistoryList');

    // Saved elements
    this.savedSearchesGrid = document.getElementById('savedSearchesGrid');
    this.savedTabs = document.querySelectorAll('.search-saved-tab');

    // Analytics elements
    this.analyticsTabs = document.querySelectorAll('.search-analytics-tab');
    this.analyticsPanels = document.querySelectorAll('.search-analytics-panel');
    this.analyticsKeywordsList = document.getElementById('analyticsKeywordsList');
    this.analyticsPlatformLegend = document.getElementById('analyticsPlatformLegend');
    this.analyticsAIList = document.getElementById('analyticsAIList');
    this.analyticsUsersTable = document.getElementById('analyticsUsersTable');

    // Modals
    this.saveSearchModal = document.getElementById('saveSearchModal');
    this.previewModal = document.getElementById('previewModal');

    // Header
    this.sidebarToggle = document.getElementById('sidebarToggle');
    this.appSidebar = document.getElementById('appSidebar');
    this.headerProfile = document.getElementById('headerProfile');
    this.profileDropdown = document.getElementById('profileDropdown');
    this.themeToggleSidebar = document.getElementById('themeToggleSidebar');
    this.themeIconSidebar = document.getElementById('themeIconSidebar');
  }

  bindEvents() {
    // Sidebar toggle
    this.sidebarToggle?.addEventListener('click', () => {
      this.appSidebar.classList.toggle('open');
    });

    // Profile dropdown
    this.headerProfile?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      this.profileDropdown?.classList.remove('active');
      this.searchSuggestionsDropdown?.classList.remove('active');
    });

    // Theme toggle
    this.themeToggleSidebar?.addEventListener('click', () => {
      OP.theme.toggle();
      this.updateThemeToggle();
    });

    // Hero search
    this.heroSearchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.performSearch(this.heroSearchInput.value);
      }
    });

    // Global search input
    this.globalSearchInput?.addEventListener('focus', () => {
      this.showSearchSuggestions();
    });

    this.globalSearchInput?.addEventListener('input', (e) => {
      if (e.target.value.length > 0) {
        this.showSearchSuggestions(e.target.value);
      } else {
        this.showSearchSuggestions();
      }
    });

    this.globalSearchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.performSearch(this.globalSearchInput.value);
        this.searchSuggestionsDropdown.classList.remove('active');
      }
      if (e.key === 'Escape') {
        this.searchSuggestionsDropdown.classList.remove('active');
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const first = this.searchSuggestionsDropdown?.querySelector('.search-suggestion-item');
        if (first) first.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const items = this.searchSuggestionsDropdown?.querySelectorAll('.search-suggestion-item');
        if (items && items.length) items[items.length - 1].focus();
      }
    });

    // Popular chips
    document.querySelectorAll('.search-hero-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.performSearch(chip.dataset.query);
      });
    });

    // Quick search buttons
    document.querySelectorAll('.search-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.performSearch('', { type: btn.dataset.type });
      });
    });

    // View all buttons
    document.getElementById('viewAllRecent')?.addEventListener('click', () => this.switchView('advanced'));
    document.getElementById('viewAllSaved')?.addEventListener('click', () => this.switchView('saved'));
    document.getElementById('viewAllTrending')?.addEventListener('click', () => this.switchView('analytics'));

    // Results back button
    document.getElementById('resultsBackBtn')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('advancedBackBtn')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('savedBackBtn')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('analyticsBackBtn')?.addEventListener('click', () => this.switchView('dashboard'));

    // Save search
    document.getElementById('saveSearchBtn')?.addEventListener('click', () => {
      this.openModal('saveSearchModal');
    });

    document.getElementById('closeSaveModal')?.addEventListener('click', () => {
      this.closeModal('saveSearchModal');
    });

    document.getElementById('cancelSaveSearch')?.addEventListener('click', () => {
      this.closeModal('saveSearchModal');
    });

    document.getElementById('confirmSaveSearch')?.addEventListener('click', () => {
      this.confirmSaveSearch();
    });

    // Preview modal
    document.getElementById('closePreviewModal')?.addEventListener('click', () => {
      this.closeModal('previewModal');
    });

    document.getElementById('previewCloseBtn')?.addEventListener('click', () => {
      this.closeModal('previewModal');
    });

    // Results sort
    document.getElementById('resultsSort')?.addEventListener('change', () => {
      this.sortResults();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Filter toggles
    document.querySelectorAll('.search-filter-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.closest('.search-filter-group').classList.toggle('collapsed');
      });
    });

    // Clear filters
    document.getElementById('clearAllFilters')?.addEventListener('click', () => {
      this.clearFilters();
    });

    document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
      this.applyFilters();
    });

    // Advanced tabs
    this.advancedTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.advancedTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        this.advancedPanels.forEach(p => {
          p.classList.toggle('active', p.id === `tab${target.charAt(0).toUpperCase() + target.slice(1)}`);
        });
      });
    });

    // Platform chips
    document.querySelectorAll('.platform-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.dataset.platform === 'all') {
          document.querySelectorAll('.platform-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        } else {
          document.querySelector('.platform-chip[data-platform="all"]')?.classList.remove('active');
          chip.classList.toggle('active');
        }
      });
    });

    // Advanced search buttons
    document.getElementById('clearAdvancedBtn')?.addEventListener('click', () => {
      this.clearAdvancedSearch();
    });

    document.getElementById('runAdvancedSearchBtn')?.addEventListener('click', () => {
      this.runAdvancedSearch();
    });

    // Saved search tabs
    this.savedTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.savedTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderSavedSearches(tab.dataset.tab);
      });
    });

    document.getElementById('newSavedSearchBtn')?.addEventListener('click', () => {
      this.switchView('advanced');
    });

    // Analytics tabs
    this.analyticsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.analyticsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        this.analyticsPanels.forEach(p => {
          p.classList.toggle('active', p.id === `analytics${target.charAt(0).toUpperCase() + target.slice(1)}`);
        });
        if (target === 'overview') {
          setTimeout(() => this.renderAnalyticsCharts(), 100);
        }
      });
    });

    // Chart period filter
    document.getElementById('chartPeriodFilter')?.addEventListener('change', (e) => {
      this.updateChartPeriod(parseInt(e.target.value));
    });

    // Sign out
    document.getElementById('signOutLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      OP.auth.signOut();
      window.location.href = '../signin.html';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Prefer global command palette if present
        if (window.OP && window.OP.command && typeof window.OP.command.open === 'function') {
          try { window.OP.command.open(); } catch (err) { this.globalSearchInput?.focus(); }
        } else {
          this.globalSearchInput?.focus();
        }
      }
    });

    // Window resize for charts
    window.addEventListener('resize', () => {
      if (this.currentView === 'dashboard') {
        this.initCharts();
      } else if (this.currentView === 'analytics') {
        this.renderAnalyticsCharts();
      }
    });
  }

  updateThemeToggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (this.themeIconSidebar) {
      this.themeIconSidebar.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
    }
    const themeLabel = this.themeToggleSidebar?.querySelector('span');
    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
  }

  switchView(viewName) {
    Object.values(this.views).forEach(view => view?.classList.remove('active'));
    this.views[viewName]?.classList.add('active');
    this.currentView = viewName;

    if (viewName === 'dashboard') {
      this.renderDashboard();
      setTimeout(() => this.initCharts(), 100);
    } else if (viewName === 'saved') {
      this.renderSavedSearches('all');
    } else if (viewName === 'advanced') {
      this.renderAdvancedSearch();
    } else if (viewName === 'analytics') {
      setTimeout(() => this.renderAnalyticsCharts(), 100);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================
  // Dashboard Rendering
  // ============================================
  renderDashboard() {
    this.renderRecentSearches();
    this.renderSavedSearchesPreview();
    this.renderTrendingSearches();
  }

  renderRecentSearches() {
    if (!this.recentSearchesList) return;
    const recent = this.storage.getRecentSearches().slice(0, 5);

    this.recentSearchesList.innerHTML = recent.map(item => `
      <div class="search-recent-item" data-query="${this.escapeHtml(item.query)}">
        <div class="search-recent-icon"><i class="ph ph-clock-counter-clockwise"></i></div>
        <div class="search-recent-info">
          <div class="search-recent-query">${this.escapeHtml(item.query)}</div>
          <div class="search-recent-meta">${item.platform} • ${item.timeAgo}</div>
        </div>
        <div class="search-recent-actions">
          <button class="search-recent-run" title="Search again"><i class="ph ph-arrow-right"></i></button>
          <button class="search-recent-delete" title="Remove"><i class="ph ph-x"></i></button>
        </div>
      </div>
    `).join('');

    this.recentSearchesList.querySelectorAll('.search-recent-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.search-recent-delete')) {
          e.stopPropagation();
          item.remove();
        } else if (e.target.closest('.search-recent-run')) {
          e.stopPropagation();
          this.performSearch(item.dataset.query);
        } else {
          this.performSearch(item.dataset.query);
        }
      });
    });
  }

  renderSavedSearchesPreview() {
    if (!this.savedSearchesList) return;
    const saved = this.storage.getSavedSearches().slice(0, 5);

    this.savedSearchesList.innerHTML = saved.map(item => `
      <div class="search-saved-item" data-id="${item.id}">
        <div class="search-saved-icon"><i class="ph ${item.icon || 'ph-magnifying-glass'}"></i></div>
        <div class="search-saved-info">
          <div class="search-saved-name">${this.escapeHtml(item.name)}</div>
          <div class="search-saved-meta">${PLATFORM_CONFIG[item.platform]?.name || item.platform} • Updated ${item.updated}</div>
        </div>
        <div class="search-saved-count">${item.results} results</div>
      </div>
    `).join('');

    this.savedSearchesList.querySelectorAll('.search-saved-item').forEach(item => {
      item.addEventListener('click', () => {
        const savedItem = this.storage.getSavedSearches().find(s => s.id === item.dataset.id);
        if (savedItem) {
          this.performSearch(savedItem.query);
        }
      });
    });
  }

  renderTrendingSearches() {
    if (!this.trendingSearchesList) return;
    const trending = this.storage.getTrendingSearches();

    this.trendingSearchesList.innerHTML = trending.map(item => `
      <div class="search-trending-item">
        <div class="search-trending-rank">${item.rank}</div>
        <div class="search-trending-info">
          <div class="search-trending-query">${this.escapeHtml(item.query)}</div>
          <div class="search-trending-bar">
            <div class="search-trending-fill" style="width: ${item.percent}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ============================================
  // Search Functionality
  // ============================================
  performSearch(query, filters = {}) {
    this.currentQuery = query;
    this.currentFilters = filters;
    this.currentPage = 1;

    const startTime = performance.now();
    this.currentResults = this.storage.search(query, filters);
    const duration = ((performance.now() - startTime) / 1000).toFixed(2);

    // Add to history
    if (query) {
      this.storage.addToHistory(query, filters.platform || 'All Platforms', this.currentResults.length);
      this.storage.addRecentSearch(query, filters.platform || 'All Platforms', this.currentResults.length);
    }

    this.switchView('results');
    this.renderResults(query, duration);
  }

  renderResults(query, duration) {
    const total = this.currentResults.length;
    const start = (this.currentPage - 1) * this.resultsPerPage;
    const end = start + this.resultsPerPage;
    const pageResults = this.currentResults.slice(start, end);

    this.resultsTitle.textContent = query ? `Results for "${this.escapeHtml(query)}"` : 'Search Results';
    this.resultsCount.textContent = `About ${total} results found${query ? ` for "${this.escapeHtml(query)}"` : ''} (${duration} seconds)`;

    if (pageResults.length === 0) {
      this.searchResultsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="ph ph-magnifying-glass"></i></div>
          <div class="empty-state-title">No results found</div>
          <div class="empty-state-desc">Try adjusting your search terms or filters to find what you're looking for.</div>
        </div>
      `;
    } else {
      this.searchResultsList.innerHTML = pageResults.map(item => this.renderResultItem(item)).join('');
    }

    this.renderPagination(total);
    this.bindResultEvents();
  }

  renderResultItem(item) {
    const platform = PLATFORM_CONFIG[item.platform] || { name: item.platform, icon: 'ph-circle', color: '#666' };
    const type = CONTENT_TYPES[item.type] || { label: item.type, badgeClass: '' };

    return `
      <div class="search-result-item" data-id="${item.id}">
        <div class="search-result-platform platform-${item.platform}">
          <i class="ph ${platform.icon}"></i>
        </div>
        <div class="search-result-content">
          <div class="search-result-title">
            ${this.escapeHtml(item.title)}
            <span class="result-type-badge ${type.badgeClass}">${type.label}</span>
          </div>
          <div class="search-result-desc">${this.escapeHtml(item.description)}</div>
          <div class="search-result-meta">
            <span><i class="ph ph-user"></i> ${this.escapeHtml(item.author.name)}</span>
            <span><i class="ph ph-calendar"></i> ${item.dateFormatted}</span>
            <span><i class="ph ph-tag"></i> ${item.tags.join(', ') || 'No tags'}</span>
          </div>
        </div>
        <div class="search-result-actions">
          <button class="result-preview-btn" title="Preview"><i class="ph ph-eye"></i></button>
          <button class="result-star-btn" title="Star"><i class="ph ph-star"></i></button>
          <button class="result-more-btn" title="More"><i class="ph ph-dots-three-vertical"></i></button>
        </div>
      </div>
    `;
  }

  bindResultEvents() {
    this.searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.search-result-actions')) return;
        this.openPreview(item.dataset.id);
      });
    });

    this.searchResultsList.querySelectorAll('.result-preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.closest('.search-result-item').dataset.id;
        this.openPreview(id);
      });
    });

    this.searchResultsList.querySelectorAll('.result-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        icon.classList.toggle('ph-star');
        icon.classList.toggle('ph-star-fill');
      });
    });
  }

  renderPagination(total) {
    const totalPages = Math.ceil(total / this.resultsPerPage);
    if (totalPages <= 1) {
      this.resultsPagination.innerHTML = '';
      return;
    }

    let html = `
      <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="prev">
        <i class="ph ph-caret-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += `<span class="pagination-info">...</span>`;
      }
    }

    html += `
      <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="next">
        <i class="ph ph-caret-right"></i>
      </button>
      <span class="pagination-info">${this.currentPage} of ${totalPages}</span>
    `;

    this.resultsPagination.innerHTML = html;

    this.resultsPagination.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page === 'prev' && this.currentPage > 1) {
          this.currentPage--;
        } else if (page === 'next' && this.currentPage < totalPages) {
          this.currentPage++;
        } else if (page !== 'prev' && page !== 'next') {
          this.currentPage = parseInt(page);
        }
        this.renderResults(this.currentQuery, '0.00');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  sortResults() {
    const sort = document.getElementById('resultsSort')?.value;
    if (!sort) return;

    if (sort === 'date-desc') {
      this.currentResults.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'date-asc') {
      this.currentResults.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === 'name') {
      this.currentResults.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      this.currentResults.sort((a, b) => b.relevance - a.relevance);
    }

    this.currentPage = 1;
    this.renderResults(this.currentQuery, '0.00');
  }

  // ============================================
  // Filters
  // ============================================
  clearFilters() {
    this.filtersSidebar?.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = cb.value === 'all';
    });
    this.filtersSidebar?.querySelectorAll('input[type="date"]').forEach(input => {
      input.value = '';
    });
  }

  applyFilters() {
    const filters = {};

    // Platform filters
    const platformCheckboxes = this.filtersSidebar?.querySelectorAll('input[data-filter="platform"]:checked');
    const platforms = Array.from(platformCheckboxes).map(cb => cb.value);
    if (platforms.length === 1 && platforms[0] !== 'all') {
      filters.platform = platforms[0];
    }

    // Type filters
    const typeCheckboxes = this.filtersSidebar?.querySelectorAll('input[data-filter="type"]:checked');
    const types = Array.from(typeCheckboxes).map(cb => cb.value);
    if (types.length === 1 && types[0] !== 'all') {
      filters.type = types[0];
    }

    // Date range
    const dateFrom = document.getElementById('filterDateFrom')?.value;
    const dateTo = document.getElementById('filterDateTo')?.value;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    this.currentFilters = filters;
    this.currentPage = 1;
    this.currentResults = this.storage.search(this.currentQuery, filters);
    this.renderResults(this.currentQuery, '0.00');
  }

  // ============================================
  // Advanced Search
  // ============================================
  renderAdvancedSearch() {
    this.renderSearchTemplates();
    this.renderSearchHistory();
  }

  renderSearchTemplates() {
    if (!this.searchTemplatesList) return;
    const saved = this.storage.getSavedSearches();

    this.searchTemplatesList.innerHTML = saved.slice(0, 6).map(item => `
      <div class="search-template-item" data-id="${item.id}">
        <div class="search-template-icon"><i class="ph ${item.icon || 'ph-magnifying-glass'}"></i></div>
        <div class="search-template-info">
          <div class="search-template-name">${this.escapeHtml(item.name)}</div>
          <div class="search-template-meta">${PLATFORM_CONFIG[item.platform]?.name || item.platform} • ${item.results} results</div>
        </div>
        <div class="search-template-actions">
          <button class="template-run" title="Run search"><i class="ph ph-play"></i></button>
          <button class="template-edit" title="Edit"><i class="ph ph-pencil-simple"></i></button>
        </div>
      </div>
    `).join('');

    this.searchTemplatesList.querySelectorAll('.search-template-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.template-run')) {
          const savedItem = this.storage.getSavedSearches().find(s => s.id === item.dataset.id);
          if (savedItem) this.performSearch(savedItem.query);
        }
      });
    });
  }

  renderSearchHistory() {
    if (!this.searchHistoryList) return;
    const history = this.storage.getSearchHistory();

    this.searchHistoryList.innerHTML = history.map(item => `
      <div class="search-history-item" data-query="${this.escapeHtml(item.query)}">
        <div class="search-history-icon"><i class="ph ph-clock-counter-clockwise"></i></div>
        <div class="search-history-info">
          <div class="search-history-query">${this.escapeHtml(item.query)}</div>
          <div class="search-history-meta">${item.platform} • ${item.timeAgo}</div>
        </div>
        <div class="search-history-results">${item.results} results</div>
      </div>
    `).join('');

    this.searchHistoryList.querySelectorAll('.search-history-item').forEach(item => {
      item.addEventListener('click', () => {
        this.performSearch(item.dataset.query);
      });
    });
  }

  clearAdvancedSearch() {
    document.getElementById('advancedQuery').value = '';
    document.getElementById('advancedDateFrom').value = '';
    document.getElementById('advancedDateTo').value = '';
    document.getElementById('advancedContentType').value = 'all';
    document.getElementById('advancedAssignedTo').value = 'all';
    document.getElementById('advancedWorkspace').value = 'all';
    document.getElementById('aiSemanticSearch').checked = false;
    document.getElementById('includeArchived').checked = false;
    document.getElementById('onlyFavorites').checked = false;

    document.querySelectorAll('.platform-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.platform-chip[data-platform="all"]')?.classList.add('active');
  }

  runAdvancedSearch() {
    const query = document.getElementById('advancedQuery')?.value || '';
    const filters = {};

    const activePlatforms = Array.from(document.querySelectorAll('.platform-chip.active')).map(c => c.dataset.platform);
    if (activePlatforms.length === 1 && activePlatforms[0] !== 'all') {
      filters.platform = activePlatforms[0];
    }

    const contentType = document.getElementById('advancedContentType')?.value;
    if (contentType && contentType !== 'all') filters.type = contentType;

    const dateFrom = document.getElementById('advancedDateFrom')?.value;
    const dateTo = document.getElementById('advancedDateTo')?.value;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    this.performSearch(query, filters);
  }

  // ============================================
  // Saved Searches
  // ============================================
  renderSavedSearches(filter = 'all') {
    if (!this.savedSearchesGrid) return;
    let saved = this.storage.getSavedSearches();

    if (filter === 'favorites') {
      saved = saved.filter(s => s.favorite);
    } else if (filter === 'shared') {
      saved = saved.filter(s => s.shared);
    } else if (filter === 'scheduled') {
      saved = saved.filter(s => s.scheduled);
    }

    if (saved.length === 0) {
      this.savedSearchesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"><i class="ph ph-bookmark-simple"></i></div>
          <div class="empty-state-title">No saved searches</div>
          <div class="empty-state-desc">Create a saved search to quickly access your favorite queries.</div>
        </div>
      `;
      return;
    }

    this.savedSearchesGrid.innerHTML = saved.map(item => `
      <div class="saved-search-card ${item.favorite ? 'favorite' : ''}" data-id="${item.id}">
        <div class="saved-search-header">
          <div class="saved-search-icon"><i class="ph ${item.icon || 'ph-magnifying-glass'}"></i></div>
          <div class="saved-search-actions">
            <button class="saved-favorite-btn ${item.favorite ? 'favorited' : ''}" title="Favorite">
              <i class="ph ${item.favorite ? 'ph-star-fill' : 'ph-star'}"></i>
            </button>
            <button class="saved-more-btn" title="More"><i class="ph ph-dots-three-vertical"></i></button>
          </div>
        </div>
        <div class="saved-search-name">${this.escapeHtml(item.name)}</div>
        <div class="saved-search-desc">Search across ${PLATFORM_CONFIG[item.platform]?.name || item.platform}</div>
        <div class="saved-search-meta">
          <span><i class="ph ph-magnifying-glass"></i> ${item.results} results</span>
          <span><i class="ph ph-clock"></i> ${item.updated}</span>
        </div>
        <div class="saved-search-footer">
          <span class="saved-search-count">${item.results} results</span>
          <button class="saved-search-run">Run Search</button>
        </div>
      </div>
    `).join('');

    this.savedSearchesGrid.querySelectorAll('.saved-search-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.saved-favorite-btn')) {
          e.stopPropagation();
          const id = card.dataset.id;
          const isFav = this.storage.toggleFavorite(id);
          const btn = e.target.closest('.saved-favorite-btn');
          btn.classList.toggle('favorited', isFav);
          btn.querySelector('i').className = isFav ? 'ph ph-star-fill' : 'ph ph-star';
        } else if (e.target.closest('.saved-search-run')) {
          const item = this.storage.getSavedSearches().find(s => s.id === card.dataset.id);
          if (item) this.performSearch(item.query);
        }
      });
    });
  }

  // ============================================
  // Search Suggestions
  // ============================================
  showSearchSuggestions(query = '') {
    if (!this.searchSuggestionsDropdown) return;

    const recent = this.storage.getRecentSearches().slice(0, 3);
    const saved = this.storage.getSavedSearches().slice(0, 3);

    let html = '';

    if (query) {
      const index = this.storage.getSearchIndex();
      const matches = index.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      if (matches.length > 0) {
        html += `<div class="search-suggestion-section">
          <div class="search-suggestion-label">Results</div>
          ${matches.map(m => `
            <div class="search-suggestion-item" data-query="${this.escapeHtml(m.title)}">
              <i class="ph ${PLATFORM_CONFIG[m.platform]?.icon || 'ph-circle'}"></i>
              <span class="search-suggestion-text">${this.highlightMatch(this.escapeHtml(m.title), query)}</span>
              <span class="search-suggestion-type">${PLATFORM_CONFIG[m.platform]?.name || m.platform}</span>
            </div>
          `).join('')}
        </div>`;
      }
    }

    if (recent.length > 0) {
      html += `<div class="search-suggestion-section">
        <div class="search-suggestion-label">Recent</div>
        ${recent.map(r => `
          <div class="search-suggestion-item" data-query="${this.escapeHtml(r.query)}">
            <i class="ph ph-clock-counter-clockwise"></i>
            <span class="search-suggestion-text">${this.escapeHtml(r.query)}</span>
            <span class="search-suggestion-type">${r.platform}</span>
          </div>
        `).join('')}
      </div>`;
    }

    if (saved.length > 0) {
      html += `<div class="search-suggestion-section">
        <div class="search-suggestion-label">Saved Searches</div>
        ${saved.map(s => `
          <div class="search-suggestion-item" data-query="${this.escapeHtml(s.name)}">
            <i class="ph ph-bookmark-simple"></i>
            <span class="search-suggestion-text">${this.escapeHtml(s.name)}</span>
            <span class="search-suggestion-type">Saved</span>
          </div>
        `).join('')}
      </div>`;
    }

    this.searchSuggestionsDropdown.innerHTML = html;
    this.searchSuggestionsDropdown.classList.add('active');

    this.searchSuggestionsDropdown.querySelectorAll('.search-suggestion-item').forEach(item => {
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', () => {
        const query = item.dataset.query;
        this.globalSearchInput.value = query;
        this.performSearch(query);
        this.searchSuggestionsDropdown.classList.remove('active');
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = item.dataset.query;
          this.globalSearchInput.value = query;
          this.performSearch(query);
          this.searchSuggestionsDropdown.classList.remove('active');
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = item.nextElementSibling || null;
          if (next && next.classList.contains('search-suggestion-item')) next.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = item.previousElementSibling || null;
          if (prev && prev.classList.contains('search-suggestion-item')) prev.focus();
          else this.globalSearchInput?.focus();
        }
      });
    });
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--primary-600);">$1</strong>');
  }

  // ============================================
  // Preview Modal
  // ============================================
  openPreview(id) {
    const item = this.storage.getSearchIndex().find(i => i.id === id);
    if (!item) return;

    const platform = PLATFORM_CONFIG[item.platform] || { name: item.platform, icon: 'ph-circle', color: '#666' };
    const type = CONTENT_TYPES[item.type] || { label: item.type };

    document.getElementById('previewTitle').textContent = item.title;
    document.getElementById('previewBody').innerHTML = `
      <div class="preview-content">
        <div class="preview-header">
          <div class="preview-platform platform-${item.platform}">
            <i class="ph ${platform.icon}"></i>
          </div>
          <div>
            <div class="preview-title">${this.escapeHtml(item.title)}</div>
            <div class="preview-meta">${platform.name} • ${type.label} • ${item.dateFormatted}</div>
          </div>
        </div>
        <div class="preview-body-text">${this.escapeHtml(item.description)}</div>
        <div class="preview-tags">
          ${item.tags.map(t => `<span class="preview-tag">${this.escapeHtml(t)}</span>`).join('')}
        </div>
        <div style="margin-top: var(--space-4);">
          <strong>From:</strong> ${this.escapeHtml(item.author.name)} (${this.escapeHtml(item.author.email)})
        </div>
      </div>
    `;

    this.openModal('previewModal');
  }

  // ============================================
  // Save Search Modal
  // ============================================
  confirmSaveSearch() {
    const name = document.getElementById('saveSearchName')?.value.trim();
    if (!name) {
      OP.toast.show('Please enter a search name', 'error');
      return;
    }

    this.storage.saveSearch(name, this.currentQuery, this.currentFilters);
    this.closeModal('saveSearchModal');
    OP.toast.show('Search saved successfully', 'success');
    document.getElementById('saveSearchName').value = '';
    document.getElementById('saveSearchDesc').value = '';
  }

  // ============================================
  // Modals
  // ============================================
  openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================
  // Charts
  // ============================================
  initCharts() {
    const analytics = this.storage.getAnalytics();
    const volumeChart = new ChartRenderer('searchActivityChart');
    volumeChart.drawLineChart(analytics.volumeData || []);
  }

  updateChartPeriod(days) {
    const data = this.storage.generator.generateVolumeData(days);
    const chart = new ChartRenderer('searchActivityChart');
    chart.drawLineChart(data);
  }

  renderAnalyticsCharts() {
    const analytics = this.storage.getAnalytics();

    // Volume chart
    const volumeChart = new ChartRenderer('analyticsVolumeChart');
    volumeChart.drawLineChart(analytics.volumeData || []);

    // Keywords
    if (this.analyticsKeywordsList) {
      const maxCount = Math.max(...analytics.keywords.map(k => k.count));
      this.analyticsKeywordsList.innerHTML = analytics.keywords.map((k, i) => `
        <div class="analytics-keyword-item">
          <div class="analytics-keyword-rank">${i + 1}</div>
          <div class="analytics-keyword-info">
            <div class="analytics-keyword-name">${this.escapeHtml(k.keyword)}</div>
            <div class="analytics-keyword-bar">
              <div class="analytics-keyword-fill" style="width: ${(k.count / maxCount) * 100}%"></div>
            </div>
          </div>
          <div class="analytics-keyword-count">${k.count}</div>
        </div>
      `).join('');
    }

    // Platform donut
    const platformChart = new ChartRenderer('analyticsPlatformChart');
    const platformColors = ['#EA4335', '#25D366', '#EAB308', '#F97316', '#0A66C2', '#94a3b8'];
    platformChart.drawDonutChart(analytics.platformData.map(p => ({ value: p.count })), { colors: platformColors });

    // Platform legend
    if (this.analyticsPlatformLegend) {
      this.analyticsPlatformLegend.innerHTML = analytics.platformData.map((p, i) => `
        <div class="platform-legend-item">
          <div class="platform-legend-dot" style="background: ${platformColors[i % platformColors.length]}"></div>
          <span>${PLATFORM_CONFIG[p.platform]?.name || p.platform}</span>
          <span class="platform-legend-value">${p.percent}% (${p.count})</span>
        </div>
      `).join('');
    }

    // Success ring
    const successChart = new ChartRenderer('analyticsSuccessChart');
    successChart.drawRingChart(analytics.successRate, { color: '#6366f1' });

    // AI insights
    if (this.analyticsAIList) {
      this.analyticsAIList.innerHTML = (analytics.aiInsights || []).map(item => `
        <div class="analytics-ai-item">
          <div class="analytics-ai-icon"><i class="ph ${item.icon}"></i></div>
          <div class="analytics-ai-info">
            <div class="analytics-ai-title">${this.escapeHtml(item.title)}</div>
            <div class="analytics-ai-desc">${this.escapeHtml(item.change)}</div>
          </div>
          <div class="analytics-ai-value">${item.value}</div>
        </div>
      `).join('');
    }

    // Users table
    if (this.analyticsUsersTable) {
      this.analyticsUsersTable.innerHTML = (analytics.userData || []).map(user => `
        <tr>
          <td>
            <div class="analytics-user-cell">
              <div class="analytics-user-avatar" style="background: ${user.color}">${user.avatar}</div>
              <span class="analytics-user-name">${this.escapeHtml(user.name)}</span>
            </div>
          </td>
          <td>${user.searches}</td>
          <td>${user.avgTime}</td>
          <td>${user.successRate}%</td>
          <td>${user.topPlatform}</td>
          <td>
            <span class="trend-indicator ${user.trend}">
              <i class="ph ph-trend-${user.trend}"></i>
            </span>
          </td>
        </tr>
      `).join('');
    }

    // Trends chart
    const trendsChart = new ChartRenderer('analyticsTrendsChart');
    const trendsData = this.storage.generator.generateVolumeData(30);
    trendsChart.drawLineChart(trendsData, { padding: { top: 20, right: 30, bottom: 40, left: 50 } });
  }

  // ============================================
  // Utilities
  // ============================================
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Auth guard
  if (!OP.auth.isAuthenticated()) {
    window.location.href = '../signin.html';
    return;
  }

  window.searchModule = new SearchModule();
});

// ============================================
// Search Index Manager — Global API (window.OP.search)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    const storage = window.searchModule?.storage;

    class SearchIndexManager {
      constructor(storage) {
        this.storage = storage;
        this.moduleKey = 'op_search_index_modules';
        this.metaKey = 'op_search_index_meta';
        this.mergedKey = SEARCH_STORAGE_KEYS.SEARCH_INDEX;
        this.moduleIndices = this._loadModuleIndices();
        this.mergedIndex = null; // lazy
        this.meta = this._loadMeta();
        this._saveTimer = null;
        this._rebuildTimer = null;
        this._debounceMs = 250;
        this.recentQueryCache = [];
        this.queryCache = new Map();
        this.modulePriority = { crm: 30, messages: 40, tasks: 25, files: 20, billing: 15, ai: 35, reports: 18, calendar: 22, users: 10 };
      }

      // ---------- Persistence ----------
      _loadModuleIndices() {
        try {
          return JSON.parse(localStorage.getItem(this.moduleKey) || '{}');
        } catch (e) { return {}; }
      }

      _saveModuleIndices() {
        if (this._saveTimer) clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => {
          localStorage.setItem(this.moduleKey, JSON.stringify(this.moduleIndices));
        }, 500);
      }

      _loadMeta() {
        try { return JSON.parse(localStorage.getItem(this.metaKey) || '{}'); } catch (e) { return {}; }
      }

      _saveMeta() {
        localStorage.setItem(this.metaKey, JSON.stringify(this.meta));
      }

      // ---------- Index Management ----------
      registerIndex(moduleName, records = []) {
        if (!moduleName) throw new Error('moduleName required');
        // normalize and dedupe by id
        const map = new Map();
        (records || []).forEach(r => {
          if (!r || !r.id) return;
          map.set(r.id, Object.assign(this._normalizeRecord(r), { sourceModule: moduleName }));
        });
        this.moduleIndices[moduleName] = Array.from(map.values());
        this._saveModuleIndices();
        this._scheduleRebuild();
      }

      updateRecord(moduleName, record) {
        if (!this.moduleIndices[moduleName]) this.moduleIndices[moduleName] = [];
        const idx = this.moduleIndices[moduleName].findIndex(r => r.id === record.id);
        const rec = this._normalizeRecord(record);
        rec.sourceModule = moduleName;
        if (idx === -1) this.moduleIndices[moduleName].push(rec);
        else this.moduleIndices[moduleName][idx] = Object.assign({}, this.moduleIndices[moduleName][idx], rec);
        this._saveModuleIndices();
        this._scheduleRebuild();
      }

      removeRecord(moduleName, id) {
        if (!this.moduleIndices[moduleName]) return false;
        const before = this.moduleIndices[moduleName].length;
        this.moduleIndices[moduleName] = this.moduleIndices[moduleName].filter(r => r.id !== id);
        this._saveModuleIndices();
        this._scheduleRebuild();
        return before !== this.moduleIndices[moduleName].length;
      }

      removeIndex(moduleName) {
        if (this.moduleIndices[moduleName]) {
          delete this.moduleIndices[moduleName];
          this._saveModuleIndices();
          this._scheduleRebuild(true);
        }
      }

      rebuildIndex(force = false) {
        if (this._rebuildTimer) clearTimeout(this._rebuildTimer);
        if (!force) {
          // debounce rebuilds
          this._rebuildTimer = setTimeout(() => this._doRebuild(), this._debounceMs);
        } else {
          this._doRebuild();
        }
      }

      _scheduleRebuild(immediate = false) { this.rebuildIndex(immediate); }

      _doRebuild() {
        // merge all module indices into one, detect duplicates
        const merged = [];
        const seen = new Map();
        Object.entries(this.moduleIndices).forEach(([moduleName, arr]) => {
          const mprio = this.modulePriority[moduleName] || 10;
          (arr || []).forEach(rec => {
            const id = rec.id;
            if (!id) return;
            if (!seen.has(id)) {
              const r = Object.assign({}, rec, { modulePriority: mprio });
              merged.push(r); seen.set(id, r);
            } else {
              // duplicate: choose by newer timestamp or higher module priority
              const existing = seen.get(id);
              if ((rec.timestamp || 0) > (existing.timestamp || 0) || mprio > (existing.modulePriority || 0)) {
                const r = Object.assign({}, rec, { modulePriority: mprio });
                const idx = merged.findIndex(x => x.id === id);
                if (idx !== -1) merged[idx] = r;
                seen.set(id, r);
              }
            }
          });
        });
        // write merged index
        this.mergedIndex = merged;
        try { localStorage.setItem(this.mergedKey, JSON.stringify(merged)); } catch (e) { /* ignore quota errors */ }
        this.meta.version = (this.meta.version || 0) + 1;
        this.meta.lastRebuilt = new Date().toISOString();
        this.meta.total = merged.length;
        this._saveMeta();
      }

      getIndexStats() {
        const stats = { version: this.meta.version || 0, lastRebuilt: this.meta.lastRebuilt || null, total: this.meta.total || 0, modules: {} };
        Object.entries(this.moduleIndices).forEach(([k, v]) => stats.modules[k] = v.length);
        return stats;
      }

      // ---------- Search ----------
      async search(query, options = {}) {
        const q = (query || '').trim();
        const cacheKey = `${q}::${JSON.stringify(options || {})}`;
        if (this.queryCache.has(cacheKey)) return this.queryCache.get(cacheKey);

        if (!this.mergedIndex) {
          // lazy build from modules or storage
          const fromStorage = this.storage.getSearchIndex();
          this.mergedIndex = (fromStorage && fromStorage.length) ? fromStorage : (Object.values(this.moduleIndices).flat() || []);
        }

        const now = Date.now();
        const items = this.mergedIndex.slice();

        if (!q) {
          const results = this._paginate(items, options);
          this._rememberQuery(query);
          this.queryCache.set(cacheKey, results);
          return results;
        }

        const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);

        const scored = items.map(item => {
          let score = 0;
          const title = (item.title || '').toLowerCase();
          const desc = (item.description || '').toLowerCase();

          // exact / prefix / contains
          if (title === q.toLowerCase()) score += 200;
          else if (title.startsWith(q.toLowerCase())) score += 120;
          else if (title.includes(q.toLowerCase())) score += 80;

          if (desc.includes(q.toLowerCase())) score += 40;

          // token matches
          tokens.forEach(t => {
            if (title.includes(t)) score += 8;
            if (desc.includes(t)) score += 4;
            if ((item.tags || []).some(tag => tag.toLowerCase().includes(t))) score += 6;
            if ((item.keywords || []).some(k => k.toLowerCase().includes(t))) score += 6;
          });

          // fuzzy trigram similarity
          score += Math.round(this._trigramSimilarity(title, q) * 40);

          // recency boost (30 days window)
          const ts = item.timestamp ? (new Date(item.timestamp)).getTime() : 0;
          const age = Math.max(0, now - ts);
          const thirtyDays = 30 * 24 * 3600 * 1000;
          const recencyBoost = Math.max(0, 1 - (age / thirtyDays)) * 30;
          score += recencyBoost;

          // access/favorite
          score += (item.favorite ? 40 : 0);
          score += (item.accessCount || 0) * 1.5;

          // module priority
          score += (item.modulePriority || 0) * 0.5;

          return { item, score };
        });

        // apply filters
        let filtered = scored;
        if (options.filter && Array.isArray(options.filter) && options.filter.length) {
          filtered = filtered.filter(r => options.filter.includes(r.item.category) || options.filter.includes(r.item.sourceModule));
        }

        // sort
        filtered.sort((a, b) => b.score - a.score);

        const results = filtered.map(r => ({
          id: r.item.id,
          title: r.item.title,
          description: r.item.description,
          category: r.item.category,
          sourceModule: r.item.sourceModule,
          url: r.item.url,
          icon: r.item.icon,
          timestamp: r.item.timestamp,
          tags: r.item.tags,
          score: r.score,
          highlights: this._highlight(r.item, tokens)
        }));

        const paged = this._paginate(results, options);
        this._rememberQuery(query);
        this.queryCache.set(cacheKey, paged);
        return paged;
      }

      _paginate(arr, options) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const perPage = options.perPage || 12;
        const total = arr.length;
        const start = (page - 1) * perPage;
        const end = Math.min(start + perPage, total);
        return { total, page, perPage, results: arr.slice(start, end) };
      }

      _normalizeRecord(r) {
        return {
          id: r.id,
          title: r.title || r.name || '',
          description: r.description || r.body || r.summary || '',
          category: r.category || r.type || 'unknown',
          sourceModule: r.sourceModule || r.module || 'unknown',
          url: r.url || r.link || null,
          icon: r.icon || null,
          timestamp: r.timestamp || r.date || new Date().toISOString(),
          tags: r.tags || [],
          keywords: r.keywords || [],
          priority: r.priority || 'low',
          favorite: !!r.favorite,
          lastAccessed: r.lastAccessed || null,
          accessCount: r.accessCount || 0
        };
      }

      _trigramSimilarity(a, b) {
        if (!a || !b) return 0;
        const ta = this._trigrams(a);
        const tb = this._trigrams(b);
        const inter = ta.filter(x => tb.includes(x)).length;
        const uniq = new Set([...ta, ...tb]).size;
        return uniq === 0 ? 0 : inter / uniq;
      }

      _trigrams(s) {
        const str = `  ${s.toLowerCase()}  `;
        const grams = [];
        for (let i = 0; i < str.length - 2; i++) grams.push(str.substr(i, 3));
        return grams;
      }

      _highlight(item, tokens) {
        const h = {};
        h.title = this._highlightText(item.title || '', tokens);
        h.description = this._highlightText(item.description || '', tokens);
        return h;
      }

      _highlightText(text, tokens) {
        if (!text || !tokens || tokens.length === 0) return text;
        let out = text;
        tokens.slice(0,5).forEach(t => {
          const r = new RegExp('(' + this._escapeRegex(t) + ')', 'ig');
          out = out.replace(r, '<mark>$1</mark>');
        });
        return out;
      }

      _escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

      _rememberQuery(q) {
        if (!q) return;
        const recent = this.storage.getRecentSearches();
        const idx = recent.findIndex(r => r.query.toLowerCase() === q.toLowerCase());
        if (idx !== -1) recent.splice(idx, 1);
        recent.unshift({ id: `recent_${Date.now()}`, query: q, platform: 'all', results: 0, timestamp: new Date().toISOString(), timeAgo: 'Just now' });
        localStorage.setItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recent.slice(0, 20)));
      }

      // ---------- Convenience / Storage wrappers ----------
      getRecentSearches() { return this.storage.getRecentSearches(); }
      clearHistory() { localStorage.removeItem(SEARCH_STORAGE_KEYS.SEARCH_HISTORY); }
      getSavedSearches() { return this.storage.getSavedSearches(); }
      saveSearch(name, query, filters) { return this.storage.saveSearch(name, query, filters); }
      removeSavedSearch(id) {
        try {
          const saved = this.getSavedSearches();
          const filtered = saved.filter(s => s.id !== id);
          localStorage.setItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(filtered));
          return true;
        } catch (e) { return false; }
      }
      clearSavedSearches() { localStorage.removeItem(SEARCH_STORAGE_KEYS.SAVED_SEARCHES); }
    }

    // instantiate and expose
    const manager = new SearchIndexManager(storage);
    // ensure OP namespace
    if (!window.OP) window.OP = {};
    window.OP.search = manager;

    // initial lazy rebuild if no merged index
    if (!localStorage.getItem(SEARCH_STORAGE_KEYS.SEARCH_INDEX)) manager.rebuildIndex(true);
  } catch (e) {
    console.error('SearchIndexManager init error', e);
  }
});