/**
 * OnePlace Enterprise v3.0 — Tasks Module
 * Vanilla JavaScript (ES6+)
 */

const TASKS_STORAGE_KEYS = {
  TASKS: 'op_tasks',
  PROJECTS: 'op_tasks_projects',
  TASK_SETTINGS: 'op_tasks_settings',
  TASK_ACTIVITY: 'op_tasks_activity',
  TASK_FILTERS: 'op_tasks_filters'
};

const TASK_STATUSES = {
  todo: { label: 'To Do', color: '#6366f1', light: '#EEF2FF', text: '#4338CA' },
  'in-progress': { label: 'In Progress', color: '#f59e0b', light: '#FFF7ED', text: '#C2410C' },
  review: { label: 'Review', color: '#8b5cf6', light: '#F5F3FF', text: '#6D28D9' },
  done: { label: 'Done', color: '#10b981', light: '#ECFDF5', text: '#047857' }
};

const TASK_PRIORITIES = {
  high: { label: 'High', color: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low: { label: 'Low', color: '#10b981' }
};

const TASK_TAGS = {
  'UI/UX Design': { class: 'design', bg: '#EEF2FF', text: '#4338CA' },
  'Development': { class: 'development', bg: '#FFF7ED', text: '#C2410C' },
  'Marketing': { class: 'marketing', bg: '#FDF2F8', text: '#BE185D' },
  'Product': { class: 'product', bg: '#F0FDFA', text: '#0D9488' },
  'Content': { class: 'content', bg: '#ECFDF5', text: '#047857' },
  'Meeting': { class: 'meeting', bg: '#FEF3C7', text: '#B45309' }
};

const TEAM_MEMBERS = [
  { id: 'tm1', name: 'Alex Morgan', avatar: 'AM', color: '#6366f1', role: 'Administrator' },
  { id: 'tm2', name: 'Sarah Johnson', avatar: 'SJ', color: '#8b5cf6', role: 'Designer' },
  { id: 'tm3', name: 'Michael Brown', avatar: 'MB', color: '#ec4899', role: 'Developer' },
  { id: 'tm4', name: 'Jessica Wright', avatar: 'JW', color: '#f43f5e', role: 'Product Manager' },
  { id: 'tm5', name: 'David Wilson', avatar: 'DW', color: '#f97316', role: 'Marketing' },
  { id: 'tm6', name: 'Lisa Anderson', avatar: 'LA', color: '#22c55e', role: 'Support' }
];

const SAMPLE_PROJECTS = [
  { id: 'proj_1', name: 'Website Redesign', color: '#6366f1', progress: 75, tasks: 12, members: ['tm1', 'tm2', 'tm3', 'tm4'] },
  { id: 'proj_2', name: 'Mobile App Development', color: '#f59e0b', progress: 60, tasks: 18, members: ['tm1', 'tm3', 'tm5'] },
  { id: 'proj_3', name: 'Marketing Campaign', color: '#8b5cf6', progress: 40, tasks: 8, members: ['tm2', 'tm5', 'tm6'] },
  { id: 'proj_4', name: 'Product Launch', color: '#10b981', progress: 90, tasks: 15, members: ['tm1', 'tm4', 'tm3', 'tm2'] }
];

const SAMPLE_TASKS = [
  { id: 'task_1', title: 'Create onboarding flow', status: 'todo', priority: 'medium', project: 'proj_1', assignee: 'tm2', tags: ['UI/UX Design'], dueDate: '2024-05-24', subtasks: [{ text: 'Research competitors', done: true }, { text: 'Design wireframes', done: false }], comments: [], attachments: [], recurring: false, createdAt: '2024-05-18T10:00:00Z' },
  { id: 'task_2', title: 'Research competitors', status: 'todo', priority: 'low', project: 'proj_1', assignee: 'tm5', tags: ['Marketing'], dueDate: '2024-05-26', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-18T11:00:00Z' },
  { id: 'task_3', title: 'Write blog post', status: 'todo', priority: 'low', project: 'proj_3', assignee: 'tm6', tags: ['Content'], dueDate: '2024-05-27', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-18T12:00:00Z' },
  { id: 'task_4', title: 'Update documentation', status: 'todo', priority: 'medium', project: 'proj_4', assignee: 'tm3', tags: ['Product'], dueDate: '2024-05-28', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-18T13:00:00Z' },
  { id: 'task_5', title: 'Implement authentication', status: 'in-progress', priority: 'high', project: 'proj_2', assignee: 'tm3', tags: ['Development'], dueDate: '2024-05-22', subtasks: [{ text: 'Setup OAuth', done: true }, { text: 'JWT tokens', done: false }], comments: [], attachments: [], recurring: false, createdAt: '2024-05-17T09:00:00Z' },
  { id: 'task_6', title: 'Database optimization', status: 'in-progress', priority: 'medium', project: 'proj_2', assignee: 'tm3', tags: ['Development'], dueDate: '2024-05-23', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-17T10:00:00Z' },
  { id: 'task_7', title: 'API integration', status: 'in-progress', priority: 'medium', project: 'proj_2', assignee: 'tm3', tags: ['Development'], dueDate: '2024-05-24', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-17T11:00:00Z' },
  { id: 'task_8', title: 'Design system update', status: 'review', priority: 'medium', project: 'proj_1', assignee: 'tm2', tags: ['UI/UX Design'], dueDate: '2024-05-21', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-16T14:00:00Z' },
  { id: 'task_9', title: 'Security audit', status: 'review', priority: 'high', project: 'proj_2', assignee: 'tm1', tags: ['Product'], dueDate: '2024-05-22', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-16T15:00:00Z' },
  { id: 'task_10', title: 'Code review', status: 'review', priority: 'medium', project: 'proj_2', assignee: 'tm4', tags: ['Development'], dueDate: '2024-05-23', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-16T16:00:00Z' },
  { id: 'task_11', title: 'Project kickoff meeting', status: 'done', priority: 'low', project: 'proj_1', assignee: 'tm1', tags: ['Meeting'], dueDate: '2024-05-18', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-15T09:00:00Z' },
  { id: 'task_12', title: 'Requirements gathering', status: 'done', priority: 'medium', project: 'proj_4', assignee: 'tm4', tags: ['Product'], dueDate: '2024-05-18', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-15T10:00:00Z' },
  { id: 'task_13', title: 'Wireframe layout', status: 'done', priority: 'medium', project: 'proj_1', assignee: 'tm2', tags: ['UI/UX Design'], dueDate: '2024-05-19', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-15T11:00:00Z' },
  { id: 'task_14', title: 'Prepare monthly report', status: 'done', priority: 'low', project: 'proj_3', assignee: 'tm5', tags: ['Content'], dueDate: '2024-05-23', subtasks: [], comments: [], attachments: [], recurring: true, createdAt: '2024-05-15T12:00:00Z' },
  { id: 'task_15', title: 'Team standup', status: 'done', priority: 'low', project: 'proj_4', assignee: 'tm1', tags: ['Meeting'], dueDate: '2024-05-24', subtasks: [], comments: [], attachments: [], recurring: true, createdAt: '2024-05-15T13:00:00Z' },
  { id: 'task_16', title: 'Client meeting', status: 'todo', priority: 'high', project: 'proj_3', assignee: 'tm1', tags: ['Meeting'], dueDate: '2024-05-24', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-19T09:00:00Z' },
  { id: 'task_17', title: 'Fix login issue', status: 'in-progress', priority: 'high', project: 'proj_2', assignee: 'tm3', tags: ['Development'], dueDate: '2024-05-21', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-19T10:00:00Z' },
  { id: 'task_18', title: 'Design landing page', status: 'todo', priority: 'medium', project: 'proj_1', assignee: 'tm2', tags: ['UI/UX Design'], dueDate: '2024-05-25', subtasks: [], comments: [], attachments: [], recurring: false, createdAt: '2024-05-19T11:00:00Z' }
];

const SAMPLE_ACTIVITY = [
  { id: 'act_1', user: 'tm1', action: 'completed', taskTitle: 'Wireframe layout', time: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'act_2', user: 'tm2', action: 'moved', taskTitle: 'API integration to In Progress', time: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'act_3', user: 'tm3', action: 'created', taskTitle: 'Update user profile page', time: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'act_4', user: 'tm4', action: 'commented', taskTitle: 'Design system update', time: new Date(Date.now() - 120 * 60000).toISOString() },
  { id: 'act_5', user: 'tm5', action: 'completed', taskTitle: 'Prepare monthly report', time: new Date(Date.now() - 180 * 60000).toISOString() }
];

// ============================================
// Tasks Storage
// ============================================
class TasksStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(TASKS_STORAGE_KEYS.TASKS)) {
      localStorage.setItem(TASKS_STORAGE_KEYS.TASKS, JSON.stringify(SAMPLE_TASKS));
    }
    if (!localStorage.getItem(TASKS_STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(TASKS_STORAGE_KEYS.PROJECTS, JSON.stringify(SAMPLE_PROJECTS));
    }
    if (!localStorage.getItem(TASKS_STORAGE_KEYS.TASK_ACTIVITY)) {
      localStorage.setItem(TASKS_STORAGE_KEYS.TASK_ACTIVITY, JSON.stringify(SAMPLE_ACTIVITY));
    }
    if (!localStorage.getItem(TASKS_STORAGE_KEYS.TASK_SETTINGS)) {
      localStorage.setItem(TASKS_STORAGE_KEYS.TASK_SETTINGS, JSON.stringify({
        defaultView: 'kanban',
        sortBy: 'dueDate',
        sortOrder: 'asc'
      }));
    }
  }

  getTasks() {
    return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEYS.TASKS) || '[]');
  }

  saveTasks(tasks) {
    localStorage.setItem(TASKS_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  getTask(id) {
    return this.getTasks().find(t => t.id === id);
  }

  addTask(task) {
    const tasks = this.getTasks();
    task.id = task.id || `task_${Date.now()}`;
    task.createdAt = new Date().toISOString();
    task.comments = task.comments || [];
    task.attachments = task.attachments || [];
    task.subtasks = task.subtasks || [];
    tasks.push(task);
    this.saveTasks(tasks);
    this.addActivity('created', task.title);
    return task;
  }

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      const oldStatus = tasks[idx].status;
      tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveTasks(tasks);
      if (updates.status && updates.status !== oldStatus) {
        this.addActivity('moved', `${tasks[idx].title} to ${TASK_STATUSES[updates.status]?.label || updates.status}`);
      }
      return tasks[idx];
    }
    return null;
  }

  deleteTask(id) {
    const task = this.getTask(id);
    if (task) {
      this.addActivity('deleted', task.title);
    }
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  getProjects() {
    return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEYS.PROJECTS) || '[]');
  }

  saveProjects(projects) {
    localStorage.setItem(TASKS_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  getActivity() {
    return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEYS.TASK_ACTIVITY) || '[]');
  }

  addActivity(action, taskTitle) {
    const activity = this.getActivity();
    const session = OP.auth.getSession();
    const userId = session ? 'tm1' : 'tm1'; // Default to Alex Morgan
    activity.unshift({
      id: `act_${Date.now()}`,
      user: userId,
      action,
      taskTitle,
      time: new Date().toISOString()
    });
    localStorage.setItem(TASKS_STORAGE_KEYS.TASK_ACTIVITY, JSON.stringify(activity.slice(0, 50)));
  }

  getSettings() {
    return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEYS.TASK_SETTINGS) || '{}');
  }

  saveSettings(settings) {
    localStorage.setItem(TASKS_STORAGE_KEYS.TASK_SETTINGS, JSON.stringify(settings));
  }

  getFilteredTasks(filters = {}) {
    let tasks = this.getTasks();

    if (filters.status && filters.status !== 'all') {
      tasks = tasks.filter(t => t.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }

    if (filters.project && filters.project !== 'all') {
      tasks = tasks.filter(t => t.project === filters.project);
    }

    if (filters.assignee && filters.assignee !== 'all') {
      tasks = tasks.filter(t => t.assignee === filters.assignee);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    const settings = this.getSettings();
    const sortBy = filters.sortBy || settings.sortBy || 'dueDate';
    const sortOrder = filters.sortOrder || settings.sortOrder || 'asc';

    tasks.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'dueDate':
          valA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          valB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          valA = priorityOrder[a.priority] || 0;
          valB = priorityOrder[b.priority] || 0;
          break;
        case 'title':
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        default:
          valA = new Date(a.createdAt);
          valB = new Date(b.createdAt);
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return tasks;
  }

  getTasksByStatus(status) {
    return this.getTasks().filter(t => t.status === status);
  }

  getTasksByAssignee(assigneeId) {
    return this.getTasks().filter(t => t.assignee === assigneeId);
  }

  getMyTasks() {
    // For demo, return tasks assigned to tm1 (Alex Morgan)
    return this.getTasksByAssignee('tm1');
  }

  getTeamTasks() {
    return this.getTasks().filter(t => t.assignee !== 'tm1');
  }

  getCompletedTasks() {
    return this.getTasks().filter(t => t.status === 'done');
  }

  getTasksByProject(projectId) {
    return this.getTasks().filter(t => t.project === projectId);
  }

  getOverdueTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.getTasks().filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      const due = new Date(t.dueDate);
      return due < today;
    });
  }

  getUpcomingTasks(days = 7) {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + days);
    return this.getTasks().filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      const due = new Date(t.dueDate);
      return due >= now && due <= future;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  getTaskStats() {
    const tasks = this.getTasks();
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: this.getOverdueTasks().length,
      highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
    };
  }

  toggleSubtask(taskId, subtaskIndex) {
    const task = this.getTask(taskId);
    if (!task || !task.subtasks[subtaskIndex]) return null;
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    this.updateTask(taskId, { subtasks: task.subtasks });
    return task;
  }

  addComment(taskId, text) {
    const task = this.getTask(taskId);
    if (!task) return null;
    const comments = task.comments || [];
    comments.push({
      id: `comment_${Date.now()}`,
      text,
      author: 'tm1',
      time: new Date().toISOString()
    });
    this.updateTask(taskId, { comments });
    this.addActivity('commented', task.title);
    return task;
  }
}

// ============================================
// Tasks App
// ============================================
class TasksApp {
  constructor() {
    this.storage = new TasksStorage();
    this.currentView = 'kanban';
    this.currentDate = new Date(2024, 4, 21); // May 21, 2024
    this.draggedTask = null;
    this.selectedTask = null;
    this.searchQuery = '';
    this.filters = { status: 'all', priority: 'all', project: 'all', assignee: 'all' };
    this.sortBy = 'dueDate';
    this.sortOrder = 'asc';
    this.bulkSelected = new Set();
    this.currentPage = 1;
    this.itemsPerPage = 10;

    this.init();
  }

  init() {
    this.renderSidebar();
    this.renderHeader();
    this.bindEvents();
    this.render();
    this.renderStats();
    this.renderMiniCalendar();
    this.renderMyTasksSidebar();
    this.renderTaskOverview();
    this.renderUpcomingTasks();
    this.renderPriorityChart();
    this.renderRecentActivity();
    this.renderProjects();
  }

  // ============================================
  // Sidebar & Header
  // ============================================
  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'Alex Morgan';
    const userRole = session?.role || 'Administrator';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-mark"><i class="ph ph-chat-centered-text"></i></div>
          <div class="logo-text">
            <span class="logo-brand">OnePlace</span>
            <span class="logo-sub">Enterprise v3.0</span>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="sidebar-section">
          <div class="sidebar-section-title">Main</div>
          <a href="../dashboard/main-dashboard.html" class="sidebar-item"><i class="ph ph-squares-four"></i> Dashboard</a>
          <a href="../inbox/unified-inbox.html" class="sidebar-item"><i class="ph ph-envelope"></i> Unified Inbox <span class="sidebar-badge">24</span></a>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Channels</div>
          <a href="../gmail/index.html" class="sidebar-item"><i class="ph ph-envelope-simple"></i> Gmail</a>
          <a href="../whatsapp/index.html" class="sidebar-item"><i class="ph ph-chat-circle-text"></i> WhatsApp Business <span class="sidebar-badge unread">8</span></a>
          <a href="../instagram/index.html" class="sidebar-item"><i class="ph ph-camera"></i> Instagram <span class="sidebar-badge">16</span></a>
          <a href="../tiktok/index.html" class="sidebar-item"><i class="ph ph-music-note"></i> TikTok <span class="sidebar-badge">23</span></a>
          <a href="../x/index.html" class="sidebar-item"><i class="ph ph-x-logo"></i> X (Twitter) <span class="sidebar-badge">34</span></a>
          <a href="../linkedin/index.html" class="sidebar-item"><i class="ph ph-linkedin-logo"></i> LinkedIn <span class="sidebar-badge">25</span></a>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Business</div>
          <a href="../crm/index.html" class="sidebar-item"><i class="ph ph-users"></i> CRM</a>
          <a href="../support/index.html" class="sidebar-item"><i class="ph ph-headset"></i> Customer Support</a>
          <a href="../calendar/index.html" class="sidebar-item"><i class="ph ph-calendar-blank"></i> Calendar</a>
          <a href="../tasks/index.html" class="sidebar-item active"><i class="ph ph-check-square"></i> Tasks</a>
          <a href="../workflow/index.html" class="sidebar-item"><i class="ph ph-git-merge"></i> Workflow</a>
          <a href="../reports/index.html" class="sidebar-item"><i class="ph ph-chart-bar"></i> Reports</a>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Settings</div>
          <a href="../settings/index.html" class="sidebar-item"><i class="ph ph-gear"></i> Settings</a>
          <a href="../integrations/index.html" class="sidebar-item"><i class="ph ph-plugs-connected"></i> Integrations</a>
          <a href="../help/index.html" class="sidebar-item"><i class="ph ph-question"></i> Help & Support</a>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">More</div>
          <a href="../support/index.html" class="sidebar-item"><i class="ph ph-headset"></i> Support</a>
          <a href="../billing/index.html" class="sidebar-item"><i class="ph ph-credit-card"></i> Billing</a>
          <a href="../files/index.html" class="sidebar-item"><i class="ph ph-folder"></i> Files</a>
          <a href="../search/index.html" class="sidebar-item"><i class="ph ph-magnifying-glass"></i> Search</a>
          <a href="../notifications/notifications.html" class="sidebar-item"><i class="ph ph-bell"></i> Notifications</a>
          <a href="../workflow/index.html" class="sidebar-item"><i class="ph ph-git-merge"></i> Workflow</a>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${initials}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${userName}</div>
            <div class="sidebar-user-role">${userRole}</div>
          </div>
          <button class="sidebar-item" style="padding:4px;" id="sidebar-logout" title="Sign out"><i class="ph ph-sign-out"></i></button>
        </div>
      </div>
    `;

    document.getElementById('sidebar-logout')?.addEventListener('click', () => {
      OP.auth.signOut();
      window.location.href = '../auth/signin.html';
    });
  }

  renderHeader() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;

    header.innerHTML = `
      <div class="header-left">
        <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
          <i class="ph ph-list"></i>
        </button>
        <div class="header-search">
          <i class="ph ph-magnifying-glass"></i>
          <input type="text" id="global-search" placeholder="Search tasks, projects, people..." autocomplete="off">
        </div>
      </div>
      <div class="header-right">
        <button class="header-btn" id="header-theme-toggle" title="Toggle theme">
          <i class="ph ph-moon"></i>
        </button>
        <button class="header-btn" id="notifications-btn" title="Notifications">
          <i class="ph ph-bell"></i>
          <span class="notification-dot"></span>
        </button>
        <div class="header-avatar" id="user-menu-btn" title="Alex Morgan">AM</div>
      </div>
    `;

    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.dashboard-sidebar')?.classList.toggle('open');
      document.querySelector('.sidebar-overlay')?.classList.toggle('active');
    });

    document.querySelector('.sidebar-overlay')?.addEventListener('click', () => {
      document.querySelector('.dashboard-sidebar')?.classList.remove('open');
      document.querySelector('.sidebar-overlay')?.classList.remove('active');
    });

    document.getElementById('header-theme-toggle')?.addEventListener('click', () => OP.theme.toggle());

    document.getElementById('notifications-btn')?.addEventListener('click', () => {
      OP.toast.show('Notifications panel would open here', 'info');
    });

    document.getElementById('user-menu-btn')?.addEventListener('click', () => {
      if (confirm('Sign out of OnePlace Enterprise?')) {
        OP.auth.signOut();
        window.location.href = '../signin.html';
      }
    });

    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }
  }

  // ============================================
  // Stats
  // ============================================
  renderStats() {
    const stats = this.storage.getTaskStats();
    const container = document.getElementById('tasks-stats-row');
    if (!container) return;

    const statCards = [
      { label: 'My Tasks', value: stats.total, icon: 'ph-check-square', iconClass: 'blue', trend: 18, trendUp: true },
      { label: 'In Progress', value: stats.inProgress, icon: 'ph-clock', iconClass: 'orange', trend: 12, trendUp: true },
      { label: 'Completed', value: stats.done, icon: 'ph-check-circle', iconClass: 'green', trend: 25, trendUp: true },
      { label: 'Overdue', value: stats.overdue, icon: 'ph-warning-circle', iconClass: 'red', trend: 8, trendUp: false },
      { label: 'Due Today', value: stats.todo, icon: 'ph-calendar-check', iconClass: 'purple', trend: 20, trendUp: true },
      { label: 'Total Projects', value: this.storage.getProjects().length, icon: 'ph-folder', iconClass: 'teal', trend: 15, trendUp: true }
    ];

    container.innerHTML = statCards.map(s => `
      <div class="tasks-stat-card">
        <div class="tasks-stat-header">
          <span class="tasks-stat-label">${s.label}</span>
          <div class="tasks-stat-icon ${s.iconClass}"><i class="ph ${s.icon}"></i></div>
        </div>
        <div class="tasks-stat-value">${s.value}</div>
        <div class="tasks-stat-trend ${s.trendUp ? 'up' : 'down'}">
          <i class="ph ${s.trendUp ? 'ph-trend-up' : 'ph-trend-down'}"></i>
          ${s.trend}% <span>vs last 7 days</span>
        </div>
      </div>
    `).join('');
  }

  // ============================================
  // Main Render
  // ============================================
  render() {
    const container = document.getElementById('tasks-container');
    if (!container) return;

    switch (this.currentView) {
      case 'kanban':
        container.innerHTML = this.renderKanbanView();
        break;
      case 'list':
        container.innerHTML = this.renderListView();
        break;
      case 'calendar':
        container.innerHTML = this.renderCalendarView();
        break;
      case 'my-tasks':
        container.innerHTML = this.renderMyTasksView();
        break;
      case 'team':
        container.innerHTML = this.renderTeamTasksView();
        break;
      case 'completed':
        container.innerHTML = this.renderCompletedView();
        break;
    }

    this.bindViewEvents();
  }

  // ============================================
  // Kanban View
  // ============================================
  renderKanbanView() {
    const statuses = ['todo', 'in-progress', 'review', 'done'];
    let html = '<div class="kanban-board">';

    statuses.forEach(status => {
      const tasks = this.storage.getFilteredTasks({
        ...this.filters,
        status,
        search: this.searchQuery
      });

      html += `
        <div class="kanban-column" data-status="${status}">
          <div class="kanban-column-header">
            <div class="kanban-column-title">
              ${TASK_STATUSES[status].label}
              <span class="kanban-column-count ${status}">${tasks.length}</span>
            </div>
          </div>
          <div class="kanban-column-indicator ${status}"></div>
          <div class="kanban-column-body">
            ${tasks.map(task => this.renderTaskCard(task)).join('')}
            <button class="kanban-add-task" data-status="${status}">
              <i class="ph ph-plus"></i> Add Task
            </button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  renderTaskCard(task) {
    const assignee = TEAM_MEMBERS.find(m => m.id === task.assignee) || TEAM_MEMBERS[0];
    const project = this.storage.getProjects().find(p => p.id === task.project);
    const subtaskCount = task.subtasks?.length || 0;
    const completedSubtasks = task.subtasks?.filter(s => s.done).length || 0;
    const isOverdue = this.isOverdue(task.dueDate) && task.status !== 'done';

    let tagsHtml = '';
    task.tags.forEach(tag => {
      const tagStyle = TASK_TAGS[tag] || { class: 'product', bg: '#F0FDFA', text: '#0D9488' };
      tagsHtml += `<span class="task-tag ${tagStyle.class}">${tag}</span>`;
    });

    return `
      <div class="task-card" draggable="true" data-id="${task.id}">
        <div class="task-card-tags">${tagsHtml}</div>
        <div class="task-card-title">${task.title}</div>
        <div class="task-card-meta">
          <div class="task-card-date ${isOverdue ? 'overdue' : ''}">
            <i class="ph ph-calendar-blank"></i>
            ${this.formatDate(task.dueDate)}
          </div>
          <div class="task-card-priority ${task.priority}"></div>
        </div>
        <div class="task-card-footer">
          <div class="task-card-assignee">
            <div class="task-assignee-avatar" style="background:${assignee.color}" title="${assignee.name}">${assignee.avatar}</div>
          </div>
          ${subtaskCount > 0 ? `
            <div class="task-card-subtasks">
              <i class="ph ph-list-checks"></i>
              ${completedSubtasks}/${subtaskCount}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ============================================
  // List View
  // ============================================
  renderListView() {
    const tasks = this.storage.getFilteredTasks({
      ...this.filters,
      search: this.searchQuery,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const paginated = tasks.slice(start, start + this.itemsPerPage);
    const totalPages = Math.ceil(tasks.length / this.itemsPerPage);

    let html = `
      <div class="tasks-list-view">
        <div class="tasks-list-header">
          <div></div>
          <div>Task</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Assignee</div>
          <div>Due Date</div>
          <div>Project</div>
          <div></div>
        </div>
    `;

    paginated.forEach(task => {
      const assignee = TEAM_MEMBERS.find(m => m.id === task.assignee) || TEAM_MEMBERS[0];
      const project = this.storage.getProjects().find(p => p.id === task.project);
      const isOverdue = this.isOverdue(task.dueDate) && task.status !== 'done';

      let tagsHtml = '';
      task.tags.slice(0, 2).forEach(tag => {
        const tagStyle = TASK_TAGS[tag] || { class: 'product' };
        tagsHtml += `<span class="tasks-list-tag ${tagStyle.class}">${tag}</span>`;
      });

      html += `
        <div class="tasks-list-row" data-id="${task.id}">
          <div class="tasks-list-checkbox">
            <input type="checkbox" class="bulk-checkbox" data-id="${task.id}" ${this.bulkSelected.has(task.id) ? 'checked' : ''}>
          </div>
          <div class="tasks-list-title-cell">
            <div class="tasks-list-title">${task.title}</div>
            <div class="tasks-list-tags">${tagsHtml}</div>
          </div>
          <div>
            <span class="tasks-list-status ${task.status}">
              <span class="tasks-list-status-dot ${task.status}"></span>
              ${TASK_STATUSES[task.status].label}
            </span>
          </div>
          <div class="tasks-list-priority">
            <span class="tasks-list-priority-dot ${task.priority}"></span>
            ${TASK_PRIORITIES[task.priority].label}
          </div>
          <div class="tasks-list-assignee">
            <div class="tasks-list-assignee-avatar" style="background:${assignee.color}">${assignee.avatar}</div>
            <span class="tasks-list-assignee-name">${assignee.name}</span>
          </div>
          <div class="tasks-list-due ${isOverdue ? 'overdue' : ''}">${this.formatDate(task.dueDate)}</div>
          <div class="tasks-list-due">${project?.name || '—'}</div>
          <div class="tasks-list-actions">
            <button class="tasks-list-action-btn edit-task" data-id="${task.id}" title="Edit"><i class="ph ph-pencil-simple"></i></button>
            <button class="tasks-list-action-btn delete-task" data-id="${task.id}" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </div>
      `;
    });

    html += '</div>';

    // Pagination
    if (totalPages > 1) {
      html += '<div class="tasks-pagination">';
      html += `<button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}"><i class="ph ph-caret-left"></i></button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }
      html += `<button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}"><i class="ph ph-caret-right"></i></button>`;
      html += '</div>';
    }

    return html;
  }

  // ============================================
  // Calendar View
  // ============================================
  renderCalendarView() {
    const start = new Date(this.currentDate);
    start.setDate(start.getDate() - start.getDay());
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const tasks = this.storage.getFilteredTasks({
      ...this.filters,
      search: this.searchQuery
    }).filter(t => t.dueDate);

    let html = '<div class="tasks-calendar-view">';
    html += '<div class="tasks-calendar-header">';
    html += '<div class="tasks-cal-header-cell"></div>';
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const isToday = this.isSameDay(d, new Date());
      const todayClass = isToday ? 'today' : '';
      html += `<div class="tasks-cal-header-cell ${todayClass}">
        <div>${dayNames[i]}</div>
        <div class="day-number">${d.getDate()}</div>
      </div>`;
    }
    html += '</div>';

    html += '<div class="tasks-cal-grid">';
    for (let hour = 9; hour <= 17; hour++) {
      const timeLabel = hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
      html += `<div class="tasks-cal-time-label">${timeLabel}</div>`;
      for (let day = 0; day < 7; day++) {
        html += `<div class="tasks-cal-time-cell" data-day="${day}" data-hour="${hour}"></div>`;
      }
    }
    html += '</div>';

    // Task overlays
    for (let day = 0; day < 7; day++) {
      const d = new Date(start);
      d.setDate(d.getDate() + day);
      const dayTasks = tasks.filter(t => this.isSameDay(new Date(t.dueDate), d));

      dayTasks.forEach((task, idx) => {
        const top = 40 + (idx * 28);
        const color = TASK_STATUSES[task.status].color;
        html += `<div class="tasks-cal-event" 
          style="background:${color};top:${top}px;" 
          data-id="${task.id}">
          ${task.title}
        </div>`;
      });
    }

    html += '</div>';
    return html;
  }

  // ============================================
  // My Tasks View
  // ============================================
  renderMyTasksView() {
    const myTasks = this.storage.getMyTasks();
    const filtered = this.applySearch(myTasks);

    let html = '<div class="tasks-grouped-view">';
    html += this.renderTaskGroup('To Do', filtered.filter(t => t.status === 'todo'), 'todo');
    html += this.renderTaskGroup('In Progress', filtered.filter(t => t.status === 'in-progress'), 'in-progress');
    html += this.renderTaskGroup('Review', filtered.filter(t => t.status === 'review'), 'review');
    html += '</div>';
    return html;
  }

  // ============================================
  // Team Tasks View
  // ============================================
  renderTeamTasksView() {
    const teamTasks = this.storage.getTeamTasks();
    const filtered = this.applySearch(teamTasks);

    let html = '<div class="tasks-grouped-view">';
    TEAM_MEMBERS.forEach(member => {
      if (member.id === 'tm1') return;
      const memberTasks = filtered.filter(t => t.assignee === member.id);
      if (memberTasks.length > 0) {
        html += this.renderTaskGroup(member.name, memberTasks, member.id, member);
      }
    });
    html += '</div>';
    return html;
  }

  // ============================================
  // Completed View
  // ============================================
  renderCompletedView() {
    const completed = this.storage.getCompletedTasks();
    const filtered = this.applySearch(completed);

    let html = '<div class="tasks-grouped-view">';
    html += this.renderTaskGroup('Recently Completed', filtered.slice(0, 10), 'done');
    html += '</div>';
    return html;
  }

  renderTaskGroup(title, tasks, id, member = null) {
    if (tasks.length === 0) return '';

    return `
      <div class="tasks-group-section">
        <div class="tasks-group-header">
          <div class="tasks-group-title">
            ${member ? `<div class="task-assignee-avatar" style="background:${member.color};width:28px;height:28px;font-size:11px;">${member.avatar}</div>` : ''}
            ${title}
            <span class="tasks-group-count">(${tasks.length})</span>
          </div>
        </div>
        <div class="tasks-group-body">
          ${tasks.map(task => this.renderTaskCard(task)).join('')}
        </div>
      </div>
    `;
  }

  applySearch(tasks) {
    if (!this.searchQuery) return tasks;
    const q = this.searchQuery.toLowerCase();
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  // ============================================
  // Right Sidebar Components
  // ============================================
  renderMiniCalendar() {
    const grid = document.getElementById('mini-calendar-grid');
    const monthLabel = document.getElementById('mini-cal-month');
    if (!grid || !monthLabel) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    monthLabel.textContent = this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let html = '';

    dayNames.forEach(d => html += `<div class="mini-cal-day-label">${d}</div>`);

    for (let i = startOffset - 1; i >= 0; i--) {
      html += `<div class="mini-cal-day other-month">${daysInPrevMonth - i}</div>`;
    }

    const tasks = this.storage.getTasks();
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = this.isSameDay(d, today);
      const isSelected = this.isSameDay(d, this.currentDate);
      const hasTask = tasks.some(t => t.dueDate && this.isSameDay(new Date(t.dueDate), d));
      const classes = [
        'mini-cal-day',
        isToday ? 'today' : '',
        isSelected ? 'selected' : '',
        hasTask ? 'has-event' : ''
      ].filter(Boolean).join(' ');

      html += `<div class="${classes}" data-date="${d.toISOString()}">${day}</div>`;
    }

    const remaining = (7 - ((startOffset + daysInMonth) % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      html += `<div class="mini-cal-day other-month">${day}</div>`;
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.mini-cal-day:not(.other-month)').forEach(cell => {
      cell.addEventListener('click', () => {
        this.currentDate = new Date(cell.dataset.date);
        this.currentView = 'calendar';
        this.updateViewTabs();
        this.render();
        this.renderMiniCalendar();
      });
    });
  }

  renderMyTasksSidebar() {
    const container = document.getElementById('my-tasks-sidebar-list');
    if (!container) return;

    const myTasks = this.storage.getMyTasks()
      .filter(t => t.status !== 'done')
      .slice(0, 5);

    container.innerHTML = myTasks.map(task => {
      const isOverdue = this.isOverdue(task.dueDate) && task.status !== 'done';
      return `
        <div class="sidebar-task-item" data-id="${task.id}">
          <div class="sidebar-task-dot ${task.priority}"></div>
          <div class="sidebar-task-info">
            <div class="sidebar-task-title">${task.title}</div>
            <div class="sidebar-task-meta">
              <i class="ph ph-calendar-blank"></i>
              <span class="${isOverdue ? 'overdue' : ''}">${this.formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.sidebar-task-item').forEach(item => {
      item.addEventListener('click', () => this.openTaskDetails(item.dataset.id));
    });
  }

  renderTaskOverview() {
    const stats = this.storage.getTaskStats();
    const total = stats.total || 1;
    const data = [
      { label: 'To Do', value: stats.todo, color: '#6366f1' },
      { label: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
      { label: 'Review', value: stats.review, color: '#8b5cf6' },
      { label: 'Done', value: stats.done, color: '#10b981' }
    ];

    const chartContainer = document.getElementById('tasks-overview-chart');
    const legendContainer = document.getElementById('tasks-overview-legend');
    if (!chartContainer || !legendContainer) return;

    // Create SVG donut chart
    let svgHtml = `<svg width="140" height="140" viewBox="0 0 140 140">`;
    let cumulativePercent = 0;
    const r = 60;
    const cx = 70;
    const cy = 70;

    data.forEach(d => {
      const percent = (d.value / total) * 100;
      if (percent === 0) return;
      const startAngle = cumulativePercent * 3.6;
      const endAngle = (cumulativePercent + percent) * 3.6;
      cumulativePercent += percent;

      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = percent > 50 ? 1 : 0;

      svgHtml += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${d.color}" stroke="white" stroke-width="2"/>`;
    });

    // Inner circle
    svgHtml += `<circle cx="${cx}" cy="${cy}" r="38" fill="var(--gray-0)"/></svg>`;

    chartContainer.innerHTML = svgHtml + `
      <div class="tasks-overview-center">
        <div class="tasks-overview-value">${total}</div>
        <div class="tasks-overview-label">Total Tasks</div>
      </div>
    `;

    legendContainer.innerHTML = data.map(d => `
      <div class="overview-legend-item">
        <span class="overview-legend-dot" style="background:${d.color}"></span>
        <span class="overview-legend-label">${d.label}</span>
        <span class="overview-legend-value">${Math.round((d.value / total) * 100)}%</span>
      </div>
    `).join('');
  }

  renderUpcomingTasks() {
    const container = document.getElementById('upcoming-tasks-list');
    if (!container) return;

    const upcoming = this.storage.getUpcomingTasks(7).slice(0, 4);

    container.innerHTML = upcoming.map(task => {
      const assignee = TEAM_MEMBERS.find(m => m.id === task.assignee) || TEAM_MEMBERS[0];
      const due = new Date(task.dueDate);
      const timeStr = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const hour = due.getHours();
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

      return `
        <div class="upcoming-task-item" data-id="${task.id}">
          <div class="upcoming-task-time">
            ${displayHour}:00<span class="period">${period}</span>
          </div>
          <div class="upcoming-task-bar" style="background:${TASK_STATUSES[task.status].color}"></div>
          <div class="upcoming-task-info">
            <div class="upcoming-task-title">${task.title}</div>
            <div class="upcoming-task-type">${TASK_TAGS[task.tags[0]]?.class || 'task'}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.upcoming-task-item').forEach(item => {
      item.addEventListener('click', () => this.openTaskDetails(item.dataset.id));
    });
  }

  renderPriorityChart() {
    const stats = this.storage.getTaskStats();
    const total = stats.total || 1;
    const data = [
      { label: 'High', value: stats.highPriority, color: '#ef4444' },
      { label: 'Medium', value: this.storage.getTasks().filter(t => t.priority === 'medium').length, color: '#f59e0b' },
      { label: 'Low', value: this.storage.getTasks().filter(t => t.priority === 'low').length, color: '#10b981' }
    ];

    const chartContainer = document.getElementById('tasks-priority-chart');
    const legendContainer = document.getElementById('tasks-priority-legend');
    if (!chartContainer || !legendContainer) return;

    let svgHtml = `<svg width="120" height="120" viewBox="0 0 120 120">`;
    let cumulativePercent = 0;
    const r = 50;
    const cx = 60;
    const cy = 60;

    data.forEach(d => {
      const percent = (d.value / total) * 100;
      if (percent === 0) return;
      const startAngle = cumulativePercent * 3.6;
      const endAngle = (cumulativePercent + percent) * 3.6;
      cumulativePercent += percent;

      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = percent > 50 ? 1 : 0;

      svgHtml += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${d.color}" stroke="white" stroke-width="2"/>`;
    });

    svgHtml += `<circle cx="${cx}" cy="${cy}" r="32" fill="var(--gray-0)"/></svg>`;

    chartContainer.innerHTML = svgHtml + `
      <div class="tasks-priority-center">
        <div class="tasks-priority-value">${total}</div>
        <div class="tasks-priority-label">Total</div>
      </div>
    `;

    legendContainer.innerHTML = data.map(d => `
      <div class="priority-legend-item">
        <span class="priority-legend-dot" style="background:${d.color}"></span>
        <span class="priority-legend-label">${d.label}</span>
        <span class="priority-legend-value">${d.value} (${Math.round((d.value / total) * 100)}%)</span>
      </div>
    `).join('');
  }

  renderRecentActivity() {
    const container = document.getElementById('recent-activity-list');
    if (!container) return;

    const activities = this.storage.getActivity().slice(0, 5);

    container.innerHTML = activities.map(act => {
      const user = TEAM_MEMBERS.find(m => m.id === act.user) || TEAM_MEMBERS[0];
      const timeAgo = this.formatTimeAgo(act.time);

      return `
        <div class="activity-item">
          <div class="activity-avatar" style="background:${user.color}">${user.avatar}</div>
          <div class="activity-content">
            <div class="activity-text"><strong>${user.name}</strong> ${act.action} <strong>${act.taskTitle}</strong></div>
            <div class="activity-time">${timeAgo}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderProjects() {
    const container = document.getElementById('tasks-projects-grid');
    if (!container) return;

    const projects = this.storage.getProjects();

    container.innerHTML = projects.map(proj => {
      const memberAvatars = proj.members.slice(0, 3).map(mId => {
        const m = TEAM_MEMBERS.find(tm => tm.id === mId);
        return `<div class="project-avatar" style="background:${m.color}">${m.avatar}</div>`;
      }).join('');

      const moreCount = proj.members.length - 3;
      const moreHtml = moreCount > 0 ? `<div class="project-avatar-more">+${moreCount}</div>` : '';

      const colorClass = proj.color === '#6366f1' ? 'blue' : proj.color === '#f59e0b' ? 'orange' : proj.color === '#8b5cf6' ? 'purple' : 'green';

      return `
        <div class="project-card" data-id="${proj.id}">
          <div class="project-card-header">
            <div class="project-card-title">${proj.name}</div>
          </div>
          <div class="project-card-progress">
            <div class="project-progress-bar">
              <div class="project-progress-fill ${colorClass}" style="width:${proj.progress}%"></div>
            </div>
            <div class="project-progress-meta">
              <span>${proj.tasks} tasks</span>
              <span class="percent">${proj.progress}%</span>
            </div>
          </div>
          <div class="project-card-footer">
            <div class="project-avatars">${memberAvatars}${moreHtml}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        this.filters.project = card.dataset.id;
        this.currentView = 'list';
        this.updateViewTabs();
        this.render();
        OP.toast.show(`Showing tasks for ${this.storage.getProjects().find(p => p.id === card.dataset.id)?.name}`, 'success');
      });
    });
  }

  // ============================================
  // Task Modal
  // ============================================
  openTaskModal(task = null) {
    const overlay = document.getElementById('task-modal-overlay');
    const title = document.getElementById('modal-title');
    const deleteBtn = document.getElementById('modal-delete');
    const form = document.getElementById('task-form');

    this.selectedTask = task;

    // Populate assignee dropdown
    const assigneeSelect = document.getElementById('task-assignee');
    assigneeSelect.innerHTML = TEAM_MEMBERS.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    // Populate project dropdown
    const projectSelect = document.getElementById('task-project');
    projectSelect.innerHTML = this.storage.getProjects().map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    if (task) {
      title.textContent = 'Edit Task';
      deleteBtn.style.display = 'inline-flex';
      document.getElementById('task-id').value = task.id;
      document.getElementById('task-title').value = task.title;
      document.getElementById('task-status').value = task.status;
      document.getElementById('task-priority').value = task.priority;
      document.getElementById('task-due-date').value = task.dueDate || '';
      document.getElementById('task-assignee').value = task.assignee;
      document.getElementById('task-project').value = task.project;
      document.getElementById('task-tags').value = task.tags.join(', ');
      document.getElementById('task-description').value = task.description || '';
      document.getElementById('task-recurring').checked = task.recurring || false;

      // Render subtasks
      const subtasksContainer = document.getElementById('subtasks-container');
      subtasksContainer.innerHTML = (task.subtasks || []).map((st, idx) => `
        <div class="subtask-item">
          <input type="checkbox" ${st.done ? 'checked' : ''} data-idx="${idx}">
          <input type="text" value="${st.text}" data-idx="${idx}">
          <span class="subtask-delete" data-idx="${idx}"><i class="ph ph-x"></i></span>
        </div>
      `).join('');
    } else {
      title.textContent = 'New Task';
      deleteBtn.style.display = 'none';
      form.reset();
      document.getElementById('task-id').value = '';
      document.getElementById('task-due-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('subtasks-container').innerHTML = '';
    }

    overlay.classList.add('active');
  }

  closeTaskModal() {
    document.getElementById('task-modal-overlay')?.classList.remove('active');
    this.selectedTask = null;
  }

  saveTask() {
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value.trim();
    if (!title) {
      OP.toast.show('Please enter a task title', 'error');
      return;
    }

    const subtaskItems = document.querySelectorAll('#subtasks-container .subtask-item');
    const subtasks = [];
    subtaskItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const textInput = item.querySelector('input[type="text"]');
      if (textInput.value.trim()) {
        subtasks.push({ text: textInput.value.trim(), done: checkbox.checked });
      }
    });

    const taskData = {
      title,
      status: document.getElementById('task-status').value,
      priority: document.getElementById('task-priority').value,
      dueDate: document.getElementById('task-due-date').value,
      assignee: document.getElementById('task-assignee').value,
      project: document.getElementById('task-project').value,
      tags: document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      description: document.getElementById('task-description').value.trim(),
      subtasks,
      recurring: document.getElementById('task-recurring').checked
    };

    if (id) {
      this.storage.updateTask(id, taskData);
      OP.toast.show('Task updated successfully', 'success');
    } else {
      this.storage.addTask(taskData);
      OP.toast.show('Task created successfully', 'success');
    }

    this.closeTaskModal();
    this.refreshAll();
  }

  deleteTask() {
    if (!this.selectedTask) return;
    if (confirm('Are you sure you want to delete this task?')) {
      this.storage.deleteTask(this.selectedTask.id);
      OP.toast.show('Task deleted', 'success');
      this.closeTaskModal();
      this.refreshAll();
    }
  }

  openTaskDetails(id) {
    const task = this.storage.getTask(id);
    if (!task) return;

    const overlay = document.getElementById('task-details-overlay');
    const body = document.getElementById('details-body');
    const assignee = TEAM_MEMBERS.find(m => m.id === task.assignee) || TEAM_MEMBERS[0];
    const project = this.storage.getProjects().find(p => p.id === task.project);

    let html = `
      <div class="details-section">
        <div class="details-label">Title</div>
        <div class="details-value"><strong>${task.title}</strong></div>
      </div>
      <div class="details-section">
        <div class="details-label">Status</div>
        <div class="details-row">
          <span class="tasks-list-status ${task.status}">
            <span class="tasks-list-status-dot ${task.status}"></span>
            ${TASK_STATUSES[task.status].label}
          </span>
        </div>
      </div>
      <div class="details-section">
        <div class="details-label">Priority</div>
        <div class="details-row">
          <span class="tasks-list-priority-dot ${task.priority}"></span>
          ${TASK_PRIORITIES[task.priority].label}
        </div>
      </div>
      <div class="details-section">
        <div class="details-label">Due Date</div>
        <div class="details-row"><i class="ph ph-calendar-blank"></i> ${this.formatDate(task.dueDate)}</div>
      </div>
      <div class="details-section">
        <div class="details-label">Assignee</div>
        <div class="details-row">
          <div class="tasks-list-assignee-avatar" style="background:${assignee.color}">${assignee.avatar}</div>
          ${assignee.name}
        </div>
      </div>
    `;

    if (project) {
      html += `<div class="details-section">
        <div class="details-label">Project</div>
        <div class="details-row"><i class="ph ph-folder"></i> ${project.name}</div>
      </div>`;
    }

    if (task.tags.length > 0) {
      html += `<div class="details-section">
        <div class="details-label">Tags</div>
        <div class="details-tags">
          ${task.tags.map(tag => {
            const style = TASK_TAGS[tag] || { class: 'product', bg: '#F0FDFA', text: '#0D9488' };
            return `<span class="details-tag ${style.class}">${tag}</span>`;
          }).join('')}
        </div>
      </div>`;
    }

    if (task.description) {
      html += `<div class="details-section">
        <div class="details-label">Description</div>
        <div class="details-value">${task.description}</div>
      </div>`;
    }

    if (task.subtasks && task.subtasks.length > 0) {
      html += `<div class="details-section">
        <div class="details-label">Subtasks</div>
        <div class="details-subtasks">
          ${task.subtasks.map((st, idx) => `
            <div class="details-subtask ${st.done ? 'completed' : ''}">
              <input type="checkbox" ${st.done ? 'checked' : ''} data-task="${task.id}" data-idx="${idx}">
              <span>${st.text}</span>
            </div>
          `).join('')}
        </div>
      </div>`;
    }

    if (task.recurring) {
      html += `<div class="details-section">
        <div class="details-label">Recurring</div>
        <div class="details-row"><i class="ph ph-repeat"></i> Yes</div>
      </div>`;
    }

    body.innerHTML = html;

    // Bind subtask checkboxes
    body.querySelectorAll('.details-subtask input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.storage.toggleSubtask(cb.dataset.task, parseInt(cb.dataset.idx));
        this.refreshAll();
      });
    });

    document.getElementById('details-edit-btn').onclick = () => {
      overlay.classList.remove('active');
      this.openTaskModal(task);
    };

    overlay.classList.add('active');
  }

  closeDetailsModal() {
    document.getElementById('task-details-overlay')?.classList.remove('active');
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // View tabs
    document.querySelectorAll('.tasks-view-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentView = tab.dataset.view;
        this.updateViewTabs();
        this.render();
      });
    });

    // New task button
    document.getElementById('btn-new-task')?.addEventListener('click', () => this.openTaskModal());

    // Quick create buttons
    document.querySelectorAll('.quick-create-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openTaskModal();
      });
    });

    // Modal
    document.getElementById('modal-close')?.addEventListener('click', () => this.closeTaskModal());
    document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeTaskModal());
    document.getElementById('modal-save')?.addEventListener('click', () => this.saveTask());
    document.getElementById('modal-delete')?.addEventListener('click', () => this.deleteTask());
    document.getElementById('task-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeTaskModal();
    });

    // Add subtask
    document.getElementById('add-subtask-btn')?.addEventListener('click', () => {
      const container = document.getElementById('subtasks-container');
      const div = document.createElement('div');
      div.className = 'subtask-item';
      div.innerHTML = `
        <input type="checkbox">
        <input type="text" placeholder="Subtask title">
        <span class="subtask-delete"><i class="ph ph-x"></i></span>
      `;
      container.appendChild(div);

      div.querySelector('.subtask-delete').addEventListener('click', () => div.remove());
    });

    // Details modal
    document.getElementById('details-close')?.addEventListener('click', () => this.closeDetailsModal());
    document.getElementById('details-close-btn')?.addEventListener('click', () => this.closeDetailsModal());
    document.getElementById('task-details-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeDetailsModal();
    });

    // Mini calendar nav
    document.getElementById('mini-prev-month')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderMiniCalendar();
    });
    document.getElementById('mini-next-month')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderMiniCalendar();
    });

    // Search
    document.getElementById('tasks-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.render();
    });

    // Filters button
    document.getElementById('btn-filters')?.addEventListener('click', () => {
      OP.toast.show('Filters panel would open here', 'info');
    });

    // Sort button
    document.getElementById('btn-sort')?.addEventListener('click', () => {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.render();
      OP.toast.show(`Sorted ${this.sortOrder === 'asc' ? 'ascending' : 'descending'}`, 'success');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('tasks-search')?.focus();
      }
      if (e.key === 'Escape') {
        this.closeTaskModal();
        this.closeDetailsModal();
      }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        const active = document.activeElement;
        if (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
          this.openTaskModal();
        }
      }
    });
  }

  bindViewEvents() {
    // Task card click
    document.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.task-assignee-avatar')) {
          this.openTaskDetails(card.dataset.id);
        }
      });
    });

    // Drag and drop
    document.querySelectorAll('.task-card[draggable="true"]').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        this.draggedTask = this.storage.getTask(card.dataset.id);
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragend', (e) => {
        card.classList.remove('dragging');
        this.draggedTask = null;
      });
    });

    document.querySelectorAll('.kanban-column').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        if (this.draggedTask) {
          const newStatus = col.dataset.status;
          if (newStatus !== this.draggedTask.status)          if (newStatus !== this.draggedTask.status) {
            this.storage.updateTask(this.draggedTask.id, { status: newStatus });
            OP.toast.show(`Moved to ${TASK_STATUSES[newStatus].label}`, 'success');
            this.refreshAll();
          }
        }
      });
    });

    // Kanban add task buttons
    document.querySelectorAll('.kanban-add-task').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openTaskModal({ status: btn.dataset.status });
      });
    });

    // List view actions
    document.querySelectorAll('.tasks-list-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.tasks-list-action-btn')) return;
        if (e.target.closest('.tasks-list-checkbox')) return;
        this.openTaskDetails(row.dataset.id);
      });
    });

    document.querySelectorAll('.edit-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const task = this.storage.getTask(btn.dataset.id);
        if (task) this.openTaskModal(task);
      });
    });

    document.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
          this.storage.deleteTask(btn.dataset.id);
          OP.toast.show('Task deleted', 'success');
          this.refreshAll();
        }
      });
    });

    // Bulk checkboxes
    document.querySelectorAll('.bulk-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          this.bulkSelected.add(cb.dataset.id);
        } else {
          this.bulkSelected.delete(cb.dataset.id);
        }
      });
    });

    // Pagination
    document.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.render();
      });
    });
  }

  // ============================================
  // Utility Methods
  // ============================================
  updateViewTabs() {
    document.querySelectorAll('.tasks-view-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === this.currentView);
    });
  }

  refreshAll() {
    this.render();
    this.renderStats();
    this.renderMiniCalendar();
    this.renderMyTasksSidebar();
    this.renderTaskOverview();
    this.renderUpcomingTasks();
    this.renderPriorityChart();
    this.renderRecentActivity();
    this.renderProjects();
  }

  isOverdue(dateStr) {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }

  formatDate(dateStr) {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTimeAgo(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
}

// ============================================
// Initialize on DOM ready (fallback)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof OP !== 'undefined' && OP.auth && !OP.auth.getSession()) {
    // Not authenticated, handled by OP.nav.requireAuth in index.html
    return;
  }
  if (!window.tasksApp && typeof TasksApp !== 'undefined') {
    window.tasksApp = new TasksApp();
  }
});