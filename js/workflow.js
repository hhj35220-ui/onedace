/**
 * OnePlace Enterprise v3.0 — Workflow Automation Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const WORKFLOW_STORAGE_KEYS = {
  WORKFLOWS: 'op_workflows',
  TEMPLATES: 'op_workflow_templates',
  EXECUTIONS: 'op_workflow_executions',
  ANALYTICS: 'op_workflow_analytics',
  BUILDER_STATE: 'op_workflow_builder_state',
  SETTINGS: 'op_workflow_settings'
};

// ============================================
// Sample Data
// ============================================
const SAMPLE_WORKFLOWS = [
  {
    id: 'wf_1',
    name: 'New Lead Automation',
    description: 'Automatically capture new leads and assign tasks to sales team',
    status: 'active',
    category: 'crm',
    trigger: 'new_lead',
    executions: 1284,
    successRate: 98.5,
    team: ['AM', 'JC', 'CF', 'GH'],
    teamColors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-user-plus', name: 'New Lead', app: 'CRM' },
      { type: 'action', icon: 'ph-gear', name: 'Lead Score', app: 'CRM' },
      { type: 'action', icon: 'ph-check-square', name: 'Create Task', app: 'Tasks' },
      { type: 'action', icon: 'ph-envelope-simple', name: 'Send Email', app: 'Gmail' }
    ]
  },
  {
    id: 'wf_2',
    name: 'Support Ticket Routing',
    description: 'Route support tickets to the right team based on priority and category',
    status: 'active',
    category: 'support',
    trigger: 'ticket_created',
    executions: 856,
    successRate: 94.2,
    team: ['AM', 'SK'],
    teamColors: ['#6366f1', '#10b981'],
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-ticket', name: 'Ticket Created', app: 'Support' },
      { type: 'condition', icon: 'ph-git-branch', name: 'Priority Check', app: 'Logic' },
      { type: 'action', icon: 'ph-users', name: 'Assign Agent', app: 'Support' },
      { type: 'action', icon: 'ph-chat-circle-text', name: 'Notify Team', app: 'WhatsApp' }
    ]
  },
  {
    id: 'wf_3',
    name: 'Instagram Comment Auto-Reply',
    description: 'Automatically reply to comments on Instagram posts with personalized messages',
    status: 'active',
    category: 'marketing',
    trigger: 'new_message',
    executions: 2341,
    successRate: 99.1,
    team: ['JC'],
    teamColors: ['#8b5cf6'],
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-chat-circle-text', name: 'New Comment', app: 'Instagram' },
      { type: 'condition', icon: 'ph-git-branch', name: 'Sentiment Check', app: 'AI' },
      { type: 'action', icon: 'ph-chat-circle-text', name: 'Auto Reply', app: 'Instagram' },
      { type: 'action', icon: 'ph-tag', name: 'Add Tag', app: 'CRM' }
    ]
  },
  {
    id: 'wf_4',
    name: 'Appointment Reminder',
    description: 'Send appointment reminders via WhatsApp and email 24 hours before',
    status: 'paused',
    category: 'calendar',
    trigger: 'appointment_booked',
    executions: 567,
    successRate: 97.8,
    team: ['AM', 'CF'],
    teamColors: ['#6366f1', '#ec4899'],
    updatedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-calendar', name: 'Appointment Booked', app: 'Calendar' },
      { type: 'action', icon: 'ph-clock', name: 'Wait 24h', app: 'Timer' },
      { type: 'action', icon: 'ph-chat-circle-text', name: 'WhatsApp Reminder', app: 'WhatsApp' },
      { type: 'action', icon: 'ph-envelope-simple', name: 'Email Reminder', app: 'Gmail' }
    ]
  },
  {
    id: 'wf_5',
    name: 'Lead Nurturing Campaign',
    description: 'Send a series of follow-up emails to leads based on engagement',
    status: 'draft',
    category: 'sales',
    trigger: 'tag_added',
    executions: 0,
    successRate: 0,
    team: ['AM', 'JC', 'SK'],
    teamColors: ['#6366f1', '#8b5cf6', '#10b981'],
    updatedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-tag', name: 'Tag Added', app: 'CRM' },
      { type: 'action', icon: 'ph-envelope-simple', name: 'Welcome Email', app: 'Gmail' },
      { type: 'action', icon: 'ph-clock', name: 'Wait 3 Days', app: 'Timer' },
      { type: 'action', icon: 'ph-envelope-simple', name: 'Follow-up Email', app: 'Gmail' }
    ]
  },
  {
    id: 'wf_6',
    name: 'TikTok DM Auto-Response',
    description: 'Auto-respond to TikTok DMs during business hours',
    status: 'active',
    category: 'marketing',
    trigger: 'new_message',
    executions: 1892,
    successRate: 95.6,
    team: ['GH'],
    teamColors: ['#f43f5e'],
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-chat-circle-text', name: 'New DM', app: 'TikTok' },
      { type: 'condition', icon: 'ph-git-branch', name: 'Business Hours', app: 'Logic' },
      { type: 'action', icon: 'ph-chat-circle-text', name: 'Auto Reply', app: 'TikTok' }
    ]
  },
  {
    id: 'wf_7',
    name: 'LinkedIn Lead Sync',
    description: 'Sync LinkedIn leads to CRM and create follow-up tasks',
    status: 'completed',
    category: 'sales',
    trigger: 'form_submitted',
    executions: 445,
    successRate: 99.5,
    team: ['AM', 'SK'],
    teamColors: ['#6366f1', '#10b981'],
    updatedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-linkedin-logo', name: 'Form Submitted', app: 'LinkedIn' },
      { type: 'action', icon: 'ph-users', name: 'Add to CRM', app: 'CRM' },
      { type: 'action', icon: 'ph-check-square', name: 'Create Task', app: 'Tasks' }
    ]
  },
  {
    id: 'wf_8',
    name: 'X (Twitter) Mention Alert',
    description: 'Alert team when brand is mentioned on X and create support ticket',
    status: 'active',
    category: 'support',
    trigger: 'new_message',
    executions: 723,
    successRate: 96.3,
    team: ['JC', 'GH'],
    teamColors: ['#8b5cf6', '#f43f5e'],
    updatedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    flow: [
      { type: 'trigger', icon: 'ph-x-logo', name: 'Mention Detected', app: 'X' },
      { type: 'action', icon: 'ph-ticket', name: 'Create Ticket', app: 'Support' },
      { type: 'action', icon: 'ph-chat-circle-dots', name: 'Notify Team', app: 'Inbox' }
    ]
  }
];

const SAMPLE_TEMPLATES = [
  {
    id: 'tmpl_1',
    name: 'Welcome Email Sequence',
    description: 'Send automated welcome emails to new subscribers',
    icon: 'ph-envelope-simple',
    iconClass: 'wf-template-icon-green',
    category: 'marketing'
  },
  {
    id: 'tmpl_2',
    name: 'Lead Scoring & Routing',
    description: 'Score leads and route high-value ones to sales',
    icon: 'ph-users',
    iconClass: 'wf-template-icon-orange',
    category: 'sales'
  },
  {
    id: 'tmpl_3',
    name: 'Abandoned Cart Recovery',
    description: 'Recover abandoned carts with WhatsApp reminders',
    icon: 'ph-shopping-cart',
    iconClass: 'wf-template-icon-purple',
    category: 'marketing'
  },
  {
    id: 'tmpl_4',
    name: 'Customer Onboarding',
    description: 'Guide new customers through onboarding steps',
    icon: 'ph-hand-waving',
    iconClass: 'wf-template-icon-pink',
    category: 'support'
  },
  {
    id: 'tmpl_5',
    name: 'Social Media Auto-Reply',
    description: 'Auto-reply to comments and DMs across platforms',
    icon: 'ph-chat-circle-text',
    iconClass: 'wf-template-icon-blue',
    category: 'marketing'
  },
  {
    id: 'tmpl_6',
    name: 'Meeting Follow-up',
    description: 'Send follow-up emails and create tasks after meetings',
    icon: 'ph-calendar-check',
    iconClass: 'wf-template-icon-teal',
    category: 'calendar'
  }
];

const SAMPLE_EXECUTIONS = [
  {
    id: 'exec_1',
    workflowName: 'New Lead Automation',
    status: 'success',
    icon: 'ph-check-circle',
    time: '2 min ago',
    duration: '1.2s'
  },
  {
    id: 'exec_2',
    workflowName: 'Support Ticket Routing',
    status: 'success',
    icon: 'ph-check-circle',
    time: '5 min ago',
    duration: '0.8s'
  },
  {
    id: 'exec_3',
    workflowName: 'Instagram Comment Auto-Reply',
    status: 'failed',
    icon: 'ph-x-circle',
    time: '12 min ago',
    duration: '3.1s'
  },
  {
    id: 'exec_4',
    workflowName: 'TikTok DM Auto-Response',
    status: 'success',
    icon: 'ph-check-circle',
    time: '18 min ago',
    duration: '0.5s'
  },
  {
    id: 'exec_5',
    workflowName: 'X (Twitter) Mention Alert',
    status: 'success',
    icon: 'ph-check-circle',
    time: '24 min ago',
    duration: '1.5s'
  },
  {
    id: 'exec_6',
    workflowName: 'Appointment Reminder',
    status: 'success',
    icon: 'ph-check-circle',
    time: '31 min ago',
    duration: '2.3s'
  }
];

const SAMPLE_ANALYTICS = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  executions: [145, 189, 234, 198, 267, 156, 178],
  successRate: [94, 95, 96, 95, 97, 96, 97]
};

// ============================================
// State Management
// ============================================
class WorkflowState {
  constructor() {
    this.workflows = this.loadFromStorage(WORKFLOW_STORAGE_KEYS.WORKFLOWS, [...SAMPLE_WORKFLOWS]);
    this.templates = this.loadFromStorage(WORKFLOW_STORAGE_KEYS.TEMPLATES, [...SAMPLE_TEMPLATES]);
    this.executions = this.loadFromStorage(WORKFLOW_STORAGE_KEYS.EXECUTIONS, [...SAMPLE_EXECUTIONS]);
    this.analytics = this.loadFromStorage(WORKFLOW_STORAGE_KEYS.ANALYTICS, { labels: [], executions: [], successRate: [] });
    this.settings = this.loadFromStorage(WORKFLOW_STORAGE_KEYS.SETTINGS, { viewMode: 'grid', activeTab: 'all' });
    this.builderState = this.loadFromStorage(WORKFLOW_STORAGE_KEYS.BUILDER_STATE, { nodes: [] });
    this.currentFilter = 'all';
    this.currentView = this.settings.viewMode;
    this.searchQuery = '';
    this.sortBy = 'updatedAt';
    this.sortOrder = 'desc';
    this.deleteTargetId = null;
  }

  loadFromStorage(key, defaultValue) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.warn(`Failed to load ${key} from storage`, e);
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to save ${key} to storage`, e);
    }
  }

  saveAll() {
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.WORKFLOWS, this.workflows);
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.TEMPLATES, this.templates);
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.EXECUTIONS, this.executions);
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.ANALYTICS, this.analytics);
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.SETTINGS, this.settings);
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.BUILDER_STATE, this.builderState);
  }

  getFilteredWorkflows() {
    let filtered = [...this.workflows];

    // Filter by tab
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(wf => wf.status === this.currentFilter);
    }

    // Filter by search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(wf =>
        wf.name.toLowerCase().includes(query) ||
        wf.description.toLowerCase().includes(query) ||
        wf.category.toLowerCase().includes(query) ||
        wf.trigger.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (this.sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'executions':
          aVal = a.executions;
          bVal = b.executions;
          break;
        case 'successRate':
          aVal = a.successRate;
          bVal = b.successRate;
          break;
        default:
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
      }
      return this.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }

  addWorkflow(workflow) {
    const newWorkflow = {
      id: `wf_${Date.now()}`,
      ...workflow,
      executions: 0,
      successRate: 0,
      team: ['AM'],
      teamColors: ['#6366f1'],
      updatedAt: new Date().toISOString(),
      flow: []
    };
    this.workflows.unshift(newWorkflow);
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.WORKFLOWS, this.workflows);
    return newWorkflow;
  }

  deleteWorkflow(id) {
    this.workflows = this.workflows.filter(wf => wf.id !== id);
    this.saveToStorage(WORKFLOW_STORAGE_KEYS.WORKFLOWS, this.workflows);
  }

  toggleWorkflowStatus(id) {
    const workflow = this.workflows.find(wf => wf.id === id);
    if (workflow) {
      const statusOrder = { active: 'paused', paused: 'active', draft: 'active', completed: 'active' };
      workflow.status = statusOrder[workflow.status] || 'active';
      workflow.updatedAt = new Date().toISOString();
      this.saveToStorage(WORKFLOW_STORAGE_KEYS.WORKFLOWS, this.workflows);
    }
  }

  duplicateWorkflow(id) {
    const original = this.workflows.find(wf => wf.id === id);
    if (original) {
      const duplicate = {
        ...original,
        id: `wf_${Date.now()}`,
        name: `${original.name} (Copy)`,
        status: 'draft',
        executions: 0,
        successRate: 0,
        updatedAt: new Date().toISOString()
      };
      this.workflows.unshift(duplicate);
      this.saveToStorage(WORKFLOW_STORAGE_KEYS.WORKFLOWS, this.workflows);
      return duplicate;
    }
    return null;
  }
}

// ============================================
// DOM Utilities
// ============================================
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

function formatTimeAgo(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// Chart Rendering
// ============================================
function renderAnalyticsChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 10, right: 10, bottom: 30, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.executions) * 1.1;
  const barWidth = (chartWidth / data.labels.length) * 0.6;
  const barGap = (chartWidth / data.labels.length) * 0.4;

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Draw bars
  data.labels.forEach((label, i) => {
    const x = padding.left + i * (chartWidth / data.labels.length) + barGap / 2;
    const barHeight = (data.executions[i] / maxValue) * chartHeight;
    const y = padding.top + chartHeight - barHeight;

    // Bar gradient
    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 4);
    ctx.fill();

    // Label
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gray-500') || '#6b7280';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barWidth / 2, height - 8);
  });

  // Draw line for success rate
  ctx.beginPath();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  
  data.successRate.forEach((rate, i) => {
    const x = padding.left + i * (chartWidth / data.labels.length) + barGap / 2 + barWidth / 2;
    const y = padding.top + chartHeight - (rate / 100) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw points
  data.successRate.forEach((rate, i) => {
    const x = padding.left + i * (chartWidth / data.labels.length) + barGap / 2 + barWidth / 2;
    const y = padding.top + chartHeight - (rate / 100) * chartHeight;
    
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ============================================
// UI Rendering
// ============================================
class WorkflowUI {
  constructor(state) {
    this.state = state;
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderAll();
    this.initTheme();
  }

  renderAll() {
    this.renderWorkflowCards();
    this.renderTemplates();
    this.renderExecutions();
    this.renderAnalytics();
    this.updateStats();
  }

  renderWorkflowCards() {
    const container = $('#workflowCards');
    if (!container) return;

    const workflows = this.state.getFilteredWorkflows();

    if (workflows.length === 0) {
      container.innerHTML = `
        <div class="wf-create-card" style="grid-column: 1 / -1;">
          <div class="wf-create-icon"><i class="ph ph-magnifying-glass"></i></div>
          <span class="wf-create-text">No workflows found</span>
          <span class="wf-create-sub">Try adjusting your filters or search query</span>
        </div>
      `;
      return;
    }

    container.innerHTML = workflows.map(wf => this.createWorkflowCard(wf)).join('');
    
    // Re-bind card events
    this.bindCardEvents();
  }

  createWorkflowCard(workflow) {
    const statusClass = `wf-status-${workflow.status}`;
    const flowHtml = workflow.flow.slice(0, 3).map(step => `
      <div class="wf-flow-step">
        <i class="ph ${step.icon}"></i>
        <span>${step.name}</span>
      </div>
    `).join('') + (workflow.flow.length > 3 ? `<span class="wf-flow-more">+${workflow.flow.length - 3} more</span>` : '');

    const teamHtml = workflow.team.slice(0, 3).map((member, i) => `
      <div class="wf-team-avatar" style="background: ${workflow.teamColors[i] || '#6366f1'}">${member}</div>
    `).join('') + (workflow.team.length > 3 ? `<div class="wf-team-more">+${workflow.team.length - 3}</div>` : '');

    return `
      <div class="wf-card" data-id="${workflow.id}">
        <div class="wf-card-header">
          <div class="wf-card-title-group">
            <span class="wf-card-title">${escapeHtml(workflow.name)}</span>
            <span class="wf-card-status ${statusClass}">${workflow.status}</span>
          </div>
          <button class="wf-card-menu" data-action="menu" aria-label="Menu">
            <i class="ph ph-dots-three-vertical"></i>
          </button>
        </div>
        <p class="wf-card-desc">${escapeHtml(workflow.description)}</p>
        <div class="wf-card-flow">
          ${flowHtml}
        </div>
        <div class="wf-card-stats">
          <div class="wf-card-stat">
            <span class="wf-card-stat-value">${workflow.executions.toLocaleString()}</span>
            <span class="wf-card-stat-label">Executions</span>
          </div>
          <div class="wf-card-stat">
            <span class="wf-card-stat-value">${workflow.successRate}%</span>
            <span class="wf-card-stat-label">Success</span>
          </div>
          <div class="wf-card-team">
            ${teamHtml}
          </div>
        </div>
        <div class="wf-card-footer">
          <span class="wf-card-time"><i class="ph ph-clock"></i> ${formatTimeAgo(workflow.updatedAt)}</span>
          <button class="btn btn-ghost btn-sm" data-action="edit">Edit</button>
        </div>
        <div class="wf-card-dropdown" id="dropdown-${workflow.id}">
          <div class="wf-dropdown-item" data-action="edit"><i class="ph ph-pencil-simple"></i> Edit</div>
          <div class="wf-dropdown-item" data-action="duplicate"><i class="ph ph-copy"></i> Duplicate</div>
          <div class="wf-dropdown-item" data-action="toggle">
            <i class="ph ${workflow.status === 'active' ? 'ph-pause' : 'ph-play'}"></i> 
            ${workflow.status === 'active' ? 'Pause' : 'Activate'}
          </div>
          <div class="wf-dropdown-divider"></div>
          <div class="wf-dropdown-item danger" data-action="delete"><i class="ph ph-trash"></i> Delete</div>
        </div>
      </div>
    `;
  }

  renderTemplates() {
    const container = $('#templatesList');
    if (!container) return;

    container.innerHTML = this.state.templates.map(tmpl => `
      <div class="wf-template-item" data-template-id="${tmpl.id}">
        <div class="wf-template-icon ${tmpl.iconClass}">
          <i class="ph ${tmpl.icon}"></i>
        </div>
        <div class="wf-template-content">
          <div class="wf-template-name">${escapeHtml(tmpl.name)}</div>
          <div class="wf-template-desc">${escapeHtml(tmpl.description)}</div>
        </div>
      </div>
    `).join('');

    // Bind template clicks
    $$('.wf-template-item').forEach(item => {
      item.addEventListener('click', () => {
        const templateId = item.dataset.templateId;
        const template = this.state.templates.find(t => t.id === templateId);
        if (template) {
          $('#wfNameInput').value = template.name;
          $('#wfDescInput').value = template.description;
          $('#wfCategoryInput').value = template.category;
          this.openModal('createWorkflowModal');
        }
      });
    });
  }

  renderExecutions() {
    const container = $('#executionsList');
    if (!container) return;

    container.innerHTML = this.state.executions.map(exec => `
      <div class="wf-execution-item">
        <div class="wf-execution-icon wf-execution-icon-${exec.status}">
          <i class="ph ${exec.icon}"></i>
        </div>
        <div class="wf-execution-content">
          <div class="wf-execution-name">${escapeHtml(exec.workflowName)}</div>
          <div class="wf-execution-meta">
            <span class="wf-execution-status wf-execution-status-${exec.status}">${exec.status}</span>
            <span>${exec.duration}</span>
          </div>
        </div>
        <span class="wf-execution-time">${exec.time}</span>
      </div>
    `).join('');
  }

  renderAnalytics() {
    requestAnimationFrame(() => {
      renderAnalyticsChart('wfChartCanvas', this.state.analytics);
    });
  }

  updateStats() {
    const workflows = this.state.workflows;
    const activeCount = workflows.filter(wf => wf.status === 'active').length;
    const totalExecutions = workflows.reduce((sum, wf) => sum + wf.executions, 0);
    const avgSuccess = workflows.filter(wf => wf.executions > 0).length > 0
      ? (workflows.filter(wf => wf.executions > 0).reduce((sum, wf) => sum + wf.successRate, 0) / workflows.filter(wf => wf.executions > 0).length).toFixed(1)
      : 0;
    const tasksAutomated = Math.floor(totalExecutions * 0.72);
    const timeSaved = Math.floor(totalExecutions * 0.1);

    const statActive = $('#statActiveWorkflows');
    const statExec = $('#statExecutions');
    const statSuccess = $('#statSuccessRate');
    const statTasks = $('#statTasksAutomated');
    const statTime = $('#statTimeSaved');

    if (statActive) statActive.textContent = activeCount;
    if (statExec) statExec.textContent = totalExecutions.toLocaleString();
    if (statSuccess) statSuccess.textContent = `${avgSuccess}%`;
    if (statTasks) statTasks.textContent = tasksAutomated.toLocaleString();
    if (statTime) statTime.textContent = `${timeSaved}h`;
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // Tab switching
    $$('.wf-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.wf-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.state.currentFilter = tab.dataset.tab;
        this.renderWorkflowCards();
      });
    });

    // View toggle
    $$('.wf-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.wf-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.currentView = btn.dataset.view;
        this.state.settings.viewMode = btn.dataset.view;
        this.state.saveToStorage(WORKFLOW_STORAGE_KEYS.SETTINGS, this.state.settings);
        // In a real app, this would switch between grid and list views
      });
    });

    // Search
    const searchInput = $('#globalSearch');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.state.searchQuery = e.target.value;
          this.renderWorkflowCards();
        }, 300);
      });
    }

    // Sort button
    const sortBtn = $('#sortBtn');
    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        const sortOptions = ['updatedAt', 'name', 'executions', 'successRate'];
        const currentIndex = sortOptions.indexOf(this.state.sortBy);
        this.state.sortBy = sortOptions[(currentIndex + 1) % sortOptions.length];
        this.state.sortOrder = this.state.sortOrder === 'desc' ? 'asc' : 'desc';
        this.renderWorkflowCards();
      });
    }

    // Create workflow card
    const createCard = $('#createWorkflowCard');
    if (createCard) {
      createCard.addEventListener('click', () => this.openModal('createWorkflowModal'));
    }

    // Create workflow modal
    const saveWorkflowBtn = $('#saveWorkflowBtn');
    if (saveWorkflowBtn) {
      saveWorkflowBtn.addEventListener('click', () => this.handleCreateWorkflow());
    }

    const cancelCreateBtn = $('#cancelCreateBtn');
    if (cancelCreateBtn) {
      cancelCreateBtn.addEventListener('click', () => this.closeModal('createWorkflowModal'));
    }

    const closeCreateModal = $('#closeCreateModal');
    if (closeCreateModal) {
      closeCreateModal.addEventListener('click', () => this.closeModal('createWorkflowModal'));
    }

    // Builder modal
    const openBuilderBtn = $('#openBuilderBtn');
    if (openBuilderBtn) {
      openBuilderBtn.addEventListener('click', () => this.openModal('builderModal'));
    }

    const closeBuilderModal = $('#closeBuilderModal');
    if (closeBuilderModal) {
      closeBuilderModal.addEventListener('click', () => this.closeModal('builderModal'));
    }

    const builderSaveDraft = $('#builderSaveDraft');
    if (builderSaveDraft) {
      builderSaveDraft.addEventListener('click', () => {
        this.showToast('Draft saved successfully');
        this.closeModal('builderModal');
      });
    }

    const builderActivate = $('#builderActivate');
    if (builderActivate) {
      builderActivate.addEventListener('click', () => {
        this.showToast('Workflow activated successfully');
        this.closeModal('builderModal');
      });
    }

    // Delete modal
    const closeDeleteModal = $('#closeDeleteModal');
    if (closeDeleteModal) {
      closeDeleteModal.addEventListener('click', () => this.closeModal('deleteModal'));
    }

    const cancelDeleteBtn = $('#cancelDeleteBtn');
    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => this.closeModal('deleteModal'));
    }

    const confirmDeleteBtn = $('#confirmDeleteBtn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => this.handleDeleteConfirm());
    }

    // Modal overlays
    $$('.wf-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        const modal = e.target.closest('.wf-modal');
        if (modal) this.closeModal(modal.id);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = $('#globalSearch');
        if (searchInput) searchInput.focus();
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        $$('.wf-modal.active').forEach(modal => this.closeModal(modal.id));
      }
    });

    // Builder drag and drop
    this.initBuilderDragDrop();

    // Sidebar mobile toggle
    const menuToggleBtn = $('#menuToggleBtn');
    if (menuToggleBtn) {
      menuToggleBtn.addEventListener('click', () => {
        const sidebar = $('#appSidebar');
        if (sidebar) sidebar.classList.toggle('open');
      });
    }

    // Theme toggle
    const themeToggleSidebar = $('#themeToggleSidebar');
    if (themeToggleSidebar) {
      themeToggleSidebar.addEventListener('click', () => this.toggleTheme());
    }

    // Window resize for chart
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.renderAnalytics(), 250);
    });
  }

  bindCardEvents() {
    // Card menu buttons
    $$('.wf-card-menu').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.wf-card');
        const id = card.dataset.id;
        const dropdown = $(`#dropdown-${id}`);
        
        // Close all other dropdowns
        $$('.wf-card-dropdown.active').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });

        if (dropdown) {
          dropdown.classList.toggle('active');
        }
      });
    });

    // Dropdown actions
    $$('.wf-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = item.closest('.wf-card');
        const id = card.dataset.id;
        const action = item.dataset.action;

        // Close dropdown
        const dropdown = item.closest('.wf-card-dropdown');
        if (dropdown) dropdown.classList.remove('active');

        switch (action) {
          case 'edit':
            this.showToast('Opening workflow editor...');
            break;
          case 'duplicate':
            this.state.duplicateWorkflow(id);
            this.renderWorkflowCards();
            this.updateStats();
            this.showToast('Workflow duplicated');
            break;
          case 'toggle':
            this.state.toggleWorkflowStatus(id);
            this.renderWorkflowCards();
            this.updateStats();
            this.showToast('Workflow status updated');
            break;
          case 'delete':
            this.state.deleteTargetId = id;
            const workflow = this.state.workflows.find(wf => wf.id === id);
            $('#deleteWorkflowName').textContent = workflow ? workflow.name : '';
            this.openModal('deleteModal');
            break;
        }
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      $$('.wf-card-dropdown.active').forEach(d => d.classList.remove('active'));
    });
  }

  initBuilderDragDrop() {
    const builderItems = $$('.wf-builder-item[draggable="true"]');
    const canvasDropzone = $('#canvasDropzone');

    builderItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.setData('value', item.dataset.value);
        item.style.opacity = '0.5';
      });

      item.addEventListener('dragend', () => {
        item.style.opacity = '1';
      });
    });

    if (canvasDropzone) {
      canvasDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvasDropzone.style.background = 'var(--primary-50)';
      });

      canvasDropzone.addEventListener('dragleave', () => {
        canvasDropzone.style.background = '';
      });

      canvasDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        canvasDropzone.style.background = '';
        
        const type = e.dataTransfer.getData('type');
        const value = e.dataTransfer.getData('value');
        
        // Remove placeholder if present
        const placeholder = $('.wf-canvas-placeholder');
        if (placeholder) placeholder.remove();

        // Add node to canvas
        this.addBuilderNode(type, value, canvasDropzone);
      });
    }
  }

  addBuilderNode(type, value, container) {
    const nodeConfigs = {
      new_lead: { name: 'New Lead', icon: 'ph-user-plus', app: 'CRM', label: 'Trigger' },
      new_message: { name: 'New Message', icon: 'ph-chat-circle-text', app: 'Inbox', label: 'Trigger' },
      ticket_created: { name: 'Ticket Created', icon: 'ph-ticket', app: 'Support', label: 'Trigger' },
      appointment: { name: 'Appointment', icon: 'ph-calendar', app: 'Calendar', label: 'Trigger' },
      if_else: { name: 'If / Else', icon: 'ph-git-branch', app: 'Logic', label: 'Condition' },
      wait: { name: 'Wait / Delay', icon: 'ph-clock', app: 'Timer', label: 'Condition' },
      send_email: { name: 'Send Email', icon: 'ph-envelope-simple', app: 'Gmail', label: 'Action' },
      send_message: { name: 'Send Message', icon: 'ph-chat-circle-text', app: 'WhatsApp', label: 'Action' },
      create_task: { name: 'Create Task', icon: 'ph-check-square', app: 'Tasks', label: 'Action' },
      add_to_crm: { name: 'Add to CRM', icon: 'ph-users', app: 'CRM', label: 'Action' },
      update_status: { name: 'Update Status', icon: 'ph-arrows-clockwise', app: 'CRM', label: 'Action' },
      add_tag: { name: 'Add Tag', icon: 'ph-tag', app: 'CRM', label: 'Action' }
    };

    const config = nodeConfigs[value] || { name: value, icon: 'ph-question', app: 'Unknown', label: type };
    const nodeClass = type === 'trigger' ? 'wf-node-trigger' : type === 'condition' ? 'wf-node-condition' : 'wf-node-action';

    const nodeHtml = `
      <div class="wf-builder-node ${nodeClass}" style="margin: 8px;">
        <div class="wf-node-icon"><i class="ph ${config.icon}"></i></div>
        <div class="wf-node-content">
          <span class="wf-node-label">${config.label}</span>
          <span class="wf-node-name">${config.name}</span>
          <span class="wf-node-app">${config.app}</span>
        </div>
        <button class="wf-card-menu" style="margin-left: auto;" onclick="this.closest('.wf-builder-node').remove()">
          <i class="ph ph-x"></i>
        </button>
      </div>
    `;

    // If container is empty or has placeholder, clear it first
    if ($('.wf-canvas-placeholder', container)) {
      container.innerHTML = '';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'flex-start';
    }

    // Add arrow if not first node
    if (container.children.length > 0) {
      const arrow = document.createElement('div');
      arrow.className = 'wf-builder-arrow-down';
      arrow.innerHTML = '<i class="ph ph-arrow-down"></i>';
      arrow.style.marginLeft = '70px';
      container.appendChild(arrow);
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = nodeHtml;
    container.appendChild(wrapper.firstElementChild);
  }

  // ============================================
  // Modal Management
  // ============================================
  openModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // Clear form inputs
    if (modalId === 'createWorkflowModal') {
      $('#wfNameInput').value = '';
      $('#wfDescInput').value = '';
    }
  }

  // ============================================
  // Actions
  // ============================================
  handleCreateWorkflow() {
    const name = $('#wfNameInput').value.trim();
    const description = $('#wfDescInput').value.trim();
    const category = $('#wfCategoryInput').value;
    const trigger = $('#wfTriggerInput').value;

    if (!name) {
      this.showToast('Please enter a workflow name', 'error');
      return;
    }

    const newWorkflow = this.state.addWorkflow({
      name,
      description: description || 'No description provided',
      category,
      trigger,
      status: 'draft'
    });

    this.closeModal('createWorkflowModal');
    this.renderWorkflowCards();
    this.updateStats();
    this.showToast('Workflow created successfully');
  }

  handleDeleteConfirm() {
    if (this.state.deleteTargetId) {
      this.state.deleteWorkflow(this.state.deleteTargetId);
      this.state.deleteTargetId = null;
      this.closeModal('deleteModal');
      this.renderWorkflowCards();
      this.updateStats();
      this.showToast('Workflow deleted');
    }
  }

  // ============================================
  // Theme
  // ============================================
  initTheme() {
    const savedTheme = localStorage.getItem('op_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('op_theme', newTheme);
    this.updateThemeIcon(newTheme);
    
    // Re-render chart with new colors
    setTimeout(() => this.renderAnalytics(), 100);
  }

  updateThemeIcon(theme) {
    const icon = $('#themeIcon');
    const text = icon?.nextElementSibling;
    if (icon) {
      icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    }
    if (text) {
      text.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
  }

  // ============================================
  // Toast Notifications
  // ============================================
  showToast(message, type = 'success') {
    // Remove existing toasts
    const existing = $('.workflow-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'workflow-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: ${type === 'error' ? '#ef4444' : '#10b981'};
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      z-index: 9999;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    toast.innerHTML = `<i class="ph ${type === 'error' ? 'ph-warning-circle' : 'ph-check-circle'}"></i> ${escapeHtml(message)}`;
    
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const state = new WorkflowState();
  const ui = new WorkflowUI(state);

  // Expose to global for debugging
  window.workflowApp = { state, ui };
});