/**
 * OnePlace Enterprise v3.0 — Calendar Module
 * Vanilla JavaScript (ES6+)
 */

const CALENDAR_STORAGE_KEYS = {
  EVENTS: 'op_calendar_events',
  CALENDARS: 'op_calendar_calendars',
  SETTINGS: 'op_calendar_settings',
  REMINDERS: 'op_calendar_reminders',
  NOTIFICATIONS: 'op_calendar_notifications'
};

const EVENT_COLORS = {
  '#6366f1': { bg: '#6366f1', light: '#EEF2FF', text: '#4338ca' },
  '#10b981': { bg: '#10b981', light: '#ECFDF5', text: '#047857' },
  '#f59e0b': { bg: '#f59e0b', light: '#FFF7ED', text: '#B45309' },
  '#ef4444': { bg: '#ef4444', light: '#FEF2F2', text: '#B91C1C' },
  '#8b5cf6': { bg: '#8b5cf6', light: '#F5F3FF', text: '#6D28D9' },
  '#ec4899': { bg: '#ec4899', light: '#FDF2F8', text: '#BE185D' },
  '#06b6d4': { bg: '#06b6d4', light: '#ECFEFF', text: '#0E7490' },
  '#f97316': { bg: '#f97316', light: '#FFF7ED', text: '#C2410C' }
};

const EVENT_TYPES = {
  meeting: { icon: 'ph-video-camera', label: 'Meeting' },
  event: { icon: 'ph-calendar-blank', label: 'Event' },
  task: { icon: 'ph-check-square', label: 'Task' },
  reminder: { icon: 'ph-bell', label: 'Reminder' },
  personal: { icon: 'ph-user', label: 'Personal' }
};

const SAMPLE_EVENTS = [
  { id: 'evt_1', title: 'Team Offsite', type: 'event', calendar: 'my-calendar', start: '2024-05-19T00:00:00', end: '2024-05-19T23:59:59', allDay: true, color: '#10b981', location: 'Mountain Resort', description: 'Annual team offsite event', attendees: ['Alex Morgan', 'Jake Cooper', 'Cody Fisher'], reminder: true },
  { id: 'evt_2', title: 'Daily Standup', type: 'meeting', calendar: 'meetings', start: '2024-05-20T09:00:00', end: '2024-05-20T09:30:00', allDay: false, color: '#6366f1', location: 'Zoom Room A', description: 'Daily team standup meeting', attendees: ['Team'], reminder: true },
  { id: 'evt_3', title: 'Sales Meeting', type: 'meeting', calendar: 'meetings', start: '2024-05-21T10:00:00', end: '2024-05-21T11:00:00', allDay: false, color: '#6366f1', location: 'Conference Room B', description: 'Q2 sales review', attendees: ['Sales Team'], reminder: true },
  { id: 'evt_4', title: 'Strategy Planning', type: 'meeting', calendar: 'meetings', start: '2024-05-22T08:00:00', end: '2024-05-22T09:30:00', allDay: false, color: '#f59e0b', location: 'Board Room', description: 'Strategic planning session', attendees: ['Management'], reminder: true },
  { id: 'evt_5', title: 'Product Launch', type: 'event', calendar: 'my-calendar', start: '2024-05-22T00:00:00', end: '2024-05-22T23:59:59', allDay: true, color: '#8b5cf6', location: 'Main Auditorium', description: 'New product launch event', attendees: ['All Staff'], reminder: true },
  { id: 'evt_6', title: 'Customer Call', type: 'meeting', calendar: 'meetings', start: '2024-05-21T11:00:00', end: '2024-05-21T12:00:00', allDay: false, color: '#6366f1', location: 'Google Meet', description: 'Quarterly review with client', attendees: ['Sarah Johnson', 'Michael Brown'], reminder: true },
  { id: 'evt_7', title: 'Product Demo', type: 'meeting', calendar: 'meetings', start: '2024-05-21T13:00:00', end: '2024-05-21T14:00:00', allDay: false, color: '#ec4899', location: 'Tech Solutions Inc.', description: 'Product demonstration', attendees: ['James Wilson'], reminder: true },
  { id: 'evt_8', title: 'CRM Review', type: 'task', calendar: 'tasks', start: '2024-05-22T13:00:00', end: '2024-05-22T14:00:00', allDay: false, color: '#f59e0b', location: 'Product Team', description: 'Monthly CRM review', attendees: ['Product Team'], reminder: true },
  { id: 'evt_9', title: 'Partnership Call', type: 'meeting', calendar: 'meetings', start: '2024-05-22T09:30:00', end: '2024-05-22T10:15:00', allDay: false, color: '#6366f1', location: 'Zoom', description: 'Partnership discussion', attendees: ['Olivia Martinez'], reminder: true },
  { id: 'evt_10', title: 'Client Meeting', type: 'meeting', calendar: 'meetings', start: '2024-05-20T11:00:00', end: '2024-05-20T12:00:00', allDay: false, color: '#6366f1', location: 'Office', description: 'Client onboarding meeting', attendees: ['Sarah Johnson'], reminder: true },
  { id: 'evt_11', title: 'Project Review', type: 'meeting', calendar: 'meetings', start: '2024-05-20T14:00:00', end: '2024-05-20T15:00:00', allDay: false, color: '#10b981', location: 'Marketing Team', description: 'Q2 project review', attendees: ['Marketing Team'], reminder: true },
  { id: 'evt_12', title: 'Design Sync', type: 'meeting', calendar: 'meetings', start: '2024-05-21T15:00:00', end: '2024-05-21T16:00:00', allDay: false, color: '#06b6d4', location: 'Design Team', description: 'Design team sync', attendees: ['Design Team'], reminder: true },
  { id: 'evt_13', title: 'One-on-One', type: 'meeting', calendar: 'meetings', start: '2024-05-22T14:00:00', end: '2024-05-22T15:00:00', allDay: false, color: '#f97316', location: 'James Wilson', description: 'Weekly one-on-one', attendees: ['James Wilson'], reminder: true },
  { id: 'evt_14', title: 'Weekly Review', type: 'task', calendar: 'tasks', start: '2024-05-22T15:00:00', end: '2024-05-22T16:00:00', allDay: false, color: '#10b981', location: 'Management', description: 'Weekly team review', attendees: ['Management'], reminder: true },
  { id: 'evt_15', title: 'Team Retrospective', type: 'meeting', calendar: 'meetings', start: '2024-05-22T17:00:00', end: '2024-05-22T18:00:00', allDay: false, color: '#ef4444', location: 'All Team', description: 'Sprint retrospective', attendees: ['All Team'], reminder: true },
  { id: 'evt_16', title: 'Design Sprint', type: 'event', calendar: 'my-calendar', start: '2024-05-24T00:00:00', end: '2024-05-24T23:59:59', allDay: true, color: '#06b6d4', location: 'Design Studio', description: 'Design sprint day', attendees: ['Design Team'], reminder: true },
  { id: 'evt_17', title: 'Marketing Sync', type: 'meeting', calendar: 'meetings', start: '2024-05-23T10:00:00', end: '2024-05-23T11:00:00', allDay: false, color: '#f59e0b', location: 'Marketing Team', description: 'Marketing sync meeting', attendees: ['Marketing Team'], reminder: true },
  { id: 'evt_18', title: 'Design Workshop', type: 'meeting', calendar: 'meetings', start: '2024-05-23T11:00:00', end: '2024-05-23T13:00:00', allDay: false, color: '#06b6d4', location: 'Design Team', description: 'Design workshop session', attendees: ['Design Team'], reminder: true },
  { id: 'evt_19', title: 'Follow-up Call', type: 'meeting', calendar: 'meetings', start: '2024-05-20T16:00:00', end: '2024-05-20T16:30:00', allDay: false, color: '#6366f1', location: 'David Wilson', description: 'Follow-up call', attendees: ['David Wilson'], reminder: true },
  { id: 'evt_20', title: 'Client Check-in', type: 'meeting', calendar: 'meetings', start: '2024-05-22T08:00:00', end: '2024-05-22T08:30:00', allDay: false, color: '#10b981', location: 'John Smith', description: 'Client check-in call', attendees: ['John Smith'], reminder: true }
];

const DEFAULT_CALENDARS = [
  { id: 'my-calendar', name: 'My Calendar', color: '#6366f1', checked: true },
  { id: 'meetings', name: 'Meetings', color: '#10b981', checked: true },
  { id: 'tasks', name: 'Tasks', color: '#f59e0b', checked: true },
  { id: 'reminders', name: 'Reminders', color: '#ef4444', checked: true },
  { id: 'personal', name: 'Personal', color: '#ec4899', checked: true },
  { id: 'holidays', name: 'Holidays', color: '#8b5cf6', checked: false }
];

// ============================================
// Calendar Storage
// ============================================
class CalendarStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(CALENDAR_STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(CALENDAR_STORAGE_KEYS.EVENTS, JSON.stringify(SAMPLE_EVENTS));
    }
    if (!localStorage.getItem(CALENDAR_STORAGE_KEYS.CALENDARS)) {
      localStorage.setItem(CALENDAR_STORAGE_KEYS.CALENDARS, JSON.stringify(DEFAULT_CALENDARS));
    }
    if (!localStorage.getItem(CALENDAR_STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(CALENDAR_STORAGE_KEYS.SETTINGS, JSON.stringify({
        defaultView: 'week',
        firstDayOfWeek: 0,
        timeFormat: '12h',
        dateFormat: 'MM/DD/YYYY'
      }));
    }
  }

  getEvents() {
    return JSON.parse(localStorage.getItem(CALENDAR_STORAGE_KEYS.EVENTS) || '[]');
  }

  saveEvents(events) {
    localStorage.setItem(CALENDAR_STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  getEvent(id) {
    return this.getEvents().find(e => e.id === id);
  }

  addEvent(event) {
    const events = this.getEvents();
    event.id = event.id || `evt_${Date.now()}`;
    events.push(event);
    this.saveEvents(events);
    return event;
  }

  updateEvent(id, updates) {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...updates };
      this.saveEvents(events);
      return events[idx];
    }
    return null;
  }

  deleteEvent(id) {
    const events = this.getEvents().filter(e => e.id !== id);
    this.saveEvents(events);
  }

  getCalendars() {
    return JSON.parse(localStorage.getItem(CALENDAR_STORAGE_KEYS.CALENDARS) || '[]');
  }

  saveCalendars(calendars) {
    localStorage.setItem(CALENDAR_STORAGE_KEYS.CALENDARS, JSON.stringify(calendars));
  }

  toggleCalendar(id) {
    const calendars = this.getCalendars();
    const cal = calendars.find(c => c.id === id);
    if (cal) {
      cal.checked = !cal.checked;
      this.saveCalendars(calendars);
    }
    return cal;
  }

  getSettings() {
    return JSON.parse(localStorage.getItem(CALENDAR_STORAGE_KEYS.SETTINGS) || '{}');
  }

  saveSettings(settings) {
    localStorage.setItem(CALENDAR_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  getFilteredEvents() {
    const calendars = this.getCalendars();
    const activeCalendars = calendars.filter(c => c.checked).map(c => c.id);
    return this.getEvents().filter(e => activeCalendars.includes(e.calendar));
  }

  getEventsForDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    return this.getFilteredEvents().filter(e => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      return start < nextDay && end >= d;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  getEventsForRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    return this.getFilteredEvents().filter(ev => {
      const evStart = new Date(ev.start);
      const evEnd = new Date(ev.end);
      return evStart < e && evEnd >= s;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  getTodayEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getFilteredEvents().filter(e => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      return start < tomorrow && end >= today;
    });
  }

  getUpcomingMeetings() {
    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);
    return this.getFilteredEvents().filter(e => {
      const start = new Date(e.start);
      return start >= now && start <= weekLater && (e.type === 'meeting' || e.type === 'event');
    });
  }

  getPendingInvitations() {
    return this.getFilteredEvents().filter(e => e.invitationStatus === 'pending').length;
  }

  getCompletedEvents() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return this.getFilteredEvents().filter(e => {
      const end = new Date(e.end);
      return end < now && end >= yesterday;
    });
  }

  getThisWeekEvents() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    return this.getFilteredEvents().filter(e => {
      const start = new Date(e.start);
      return start >= startOfWeek && start < endOfWeek;
    });
  }

  searchEvents(query) {
    const q = query.toLowerCase();
    return this.getFilteredEvents().filter(e =>
      e.title.toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.attendees && e.attendees.some(a => a.toLowerCase().includes(q)))
    );
  }
}

// ============================================
// Calendar App
// ============================================
class CalendarApp {
  constructor() {
    this.storage = new CalendarStorage();
    this.currentDate = new Date(2024, 4, 21); // May 21, 2024 to match UI
    this.currentView = 'week';
    this.draggedEvent = null;
    this.selectedEvent = null;
    this.searchQuery = '';

    this.init();
  }

  init() {
    this.renderSidebar();
    this.renderHeader();
    this.bindEvents();
    this.render();
    this.renderMiniCalendar();
    this.renderMyCalendars();
    this.renderUpcomingEvents();
    this.renderTodayAgenda();
    this.renderNextMeeting();
    this.renderMeetingInsights();
    this.renderStats();
    this.startReminderCheck();
  }

  // ============================================
  // Sidebar & Header Rendering
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
          <a href="../calendar/index.html" class="sidebar-item active"><i class="ph ph-calendar-blank"></i> Calendar</a>
          <a href="../tasks/index.html" class="sidebar-item"><i class="ph ph-check-square"></i> Tasks</a>
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
        <h2 class="header-title">Calendar</h2>
      </div>
      <div class="header-right">
        <button class="header-btn" id="header-theme-toggle" title="Toggle theme">
          <i class="ph ph-moon"></i>
        </button>
      </div>
    `;

    document.getElementById('header-theme-toggle')?.addEventListener('click', () => OP.theme.toggle());
  }

  // ============================================
  // Stats
  // ============================================
  renderStats() {
    const todayEvents = this.storage.getTodayEvents();
    const upcomingMeetings = this.storage.getUpcomingMeetings();
    const pendingInvites = this.storage.getPendingInvitations();
    const completedEvents = this.storage.getCompletedEvents();
    const thisWeek = this.storage.getThisWeekEvents();

    document.getElementById('stat-today-events').textContent = todayEvents.length;
    document.getElementById('stat-upcoming-meetings').textContent = upcomingMeetings.length;
    document.getElementById('stat-pending-invites').textContent = pendingInvites;
    document.getElementById('stat-completed-events').textContent = completedEvents.length;
    document.getElementById('stat-this-week').textContent = thisWeek.length;
  }

  // ============================================
  // Main Calendar Rendering
  // ============================================
  render() {
    const container = document.getElementById('calendar-grid-container');
    if (!container) return;

    this.updateRangeDisplay();

    switch (this.currentView) {
      case 'day':
        container.innerHTML = this.renderDayView();
        break;
      case 'week':
        container.innerHTML = this.renderWeekView();
        break;
      case 'month':
        container.innerHTML = this.renderMonthView();
        break;
      case 'agenda':
        container.innerHTML = this.renderAgendaView();
        break;
    }

    this.bindCalendarEvents();
    this.highlightCurrentTime();
  }

  updateRangeDisplay() {
    const rangeEl = document.getElementById('cal-range');
    if (!rangeEl) return;

    const opts = { month: 'long', day: 'numeric', year: 'numeric' };

    switch (this.currentView) {
      case 'day': {
        rangeEl.textContent = this.currentDate.toLocaleDateString('en-US', opts);
        break;
      }
      case 'week': {
        const start = new Date(this.currentDate);
        start.setDate(start.getDate() - start.getDay());
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        if (start.getMonth() === end.getMonth()) {
          rangeEl.textContent = `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.getDate()}, ${end.getFullYear()}`;
        } else {
          rangeEl.textContent = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        break;
      }
      case 'month': {
        rangeEl.textContent = this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        break;
      }
      case 'agenda': {
        rangeEl.textContent = 'Upcoming Events';
        break;
      }
    }
  }

  // ============================================
  // Week View
  // ============================================
  renderWeekView() {
    const start = new Date(this.currentDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const events = this.storage.getEventsForRange(start, end);

    let html = '<div class="calendar-week-view">';

    // Header
    html += '<div class="calendar-week-header">';
    html += '<div class="week-header-cell"></div>';
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const isToday = this.isSameDay(d, new Date());
      const todayClass = isToday ? 'today' : '';
      html += `<div class="week-header-cell ${todayClass}">
        <div>${dayNames[i]}</div>
        <div class="day-number">${d.getDate()}</div>
      </div>`;
    }
    html += '</div>';

    // All-day row
    html += '<div class="week-all-day-row">';
    html += '<div class="all-day-label">All Day</div>';
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dayEvents = events.filter(e => e.allDay && this.isSameDay(new Date(e.start), d));
      html += '<div class="all-day-cell">';
      dayEvents.forEach(e => {
        html += `<div class="week-event-card all-day" style="background:${e.color}" data-id="${e.id}">${e.title}</div>`;
      });
      html += '</div>';
    }
    html += '</div>';

    // Time grid
    html += '<div class="week-time-grid">';
    for (let hour = 7; hour <= 18; hour++) {
      const timeLabel = hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
      html += `<div class="time-slot-label">${timeLabel}</div>`;
      for (let day = 0; day < 7; day++) {
        const d = new Date(start);
        d.setDate(d.getDate() + day);
        d.setHours(hour, 0, 0, 0);
        html += `<div class="time-slot-cell" data-day="${day}" data-hour="${hour}"></div>`;
      }
    }
    html += '</div>';

    // Current time line
    html += '<div class="current-time-line" id="current-time-line"></div>';

    // Event overlays
    for (let day = 0; day < 7; day++) {
      const d = new Date(start);
      d.setDate(d.getDate() + day);
      const dayEvents = events.filter(e => !e.allDay && this.isSameDay(new Date(e.start), d));

      dayEvents.forEach(e => {
        const startDate = new Date(e.start);
        const endDate = new Date(e.end);
        const startHour = startDate.getHours() + startDate.getMinutes() / 60;
        const endHour = endDate.getHours() + endDate.getMinutes() / 60;
        const top = (startHour - 7) * 48;
        const height = (endHour - startHour) * 48;
        const leftCalc = `calc(60px + ${day} * ((100% - 60px) / 7) + 2px)`;
        const widthCalc = `calc((100% - 60px) / 7 - 4px)`;

        html += `<div class="week-event-card" 
          style="background:${e.color};top:${top}px;left:${leftCalc};width:${widthCalc};height:${height - 2}px;" 
          data-id="${e.id}" draggable="true">
          <span class="event-time">${this.formatTime(startDate)} – ${this.formatTime(endDate)}</span>
          <span class="event-title">${e.title}</span>
        </div>`;
      });
    }

    html += '</div>';
    return html;
  }

  // ============================================
  // Month View
  // ============================================
  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const events = this.storage.getEventsForRange(
      new Date(year, month, 1 - startOffset),
      new Date(year, month + 1, 7 - lastDay.getDay())
    );

    let html = '<div class="calendar-month-view">';
    html += '<div class="month-header-row">';
    dayNames.forEach(d => html += `<div class="month-header-cell">${d}</div>`);
    html += '</div>';
    html += '<div class="month-grid">';

    // Previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      html += `<div class="month-day-cell other-month"><div class="month-day-number">${day}</div></div>`;
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = this.isSameDay(d, new Date());
      const todayClass = isToday ? 'today' : '';
      const dayEvents = events.filter(e => this.isSameDay(new Date(e.start), d));

      html += `<div class="month-day-cell ${todayClass}" data-date="${d.toISOString()}">`;
      html += `<div class="month-day-number">${day}</div>`;
      html += '<div class="month-day-events">';
      dayEvents.slice(0, 3).forEach(e => {
        html += `<div class="month-event-pill" style="background:${e.color}" data-id="${e.id}">${e.title}</div>`;
      });
      if (dayEvents.length > 3) {
        html += `<div class="month-more-events">+${dayEvents.length - 3} more</div>`;
      }
      html += '</div></div>';
    }

    // Next month days
    const remainingCells = (7 - ((startOffset + daysInMonth) % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      html += `<div class="month-day-cell other-month"><div class="month-day-number">${day}</div></div>`;
    }

    html += '</div></div>';
    return html;
  }

  // ============================================
  // Day View
  // ============================================
  renderDayView() {
    const events = this.storage.getEventsForDate(this.currentDate);

    let html = '<div class="calendar-day-view">';
    html += `<div class="day-view-header">
      <div class="day-view-date">
        <span class="day-name">${this.currentDate.toLocaleDateString('en-US', { weekday: 'long' })},</span>
        ${this.currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
      </div>
    </div>`;

    html += '<div class="day-time-grid">';
    for (let hour = 7; hour <= 18; hour++) {
      const timeLabel = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
      html += `<div class="day-time-label">${timeLabel}</div>`;
      html += `<div class="day-time-slot" data-hour="${hour}"></div>`;
    }
    html += '</div>';

    // Event overlays
    events.forEach(e => {
      if (e.allDay) return;
      const startDate = new Date(e.start);
      const endDate = new Date(e.end);
      const startHour = startDate.getHours() + startDate.getMinutes() / 60;
      const endHour = endDate.getHours() + endDate.getMinutes() / 60;
      const top = (startHour - 7) * 60 + 73; // +73 for header
      const height = (endHour - startHour) * 60;

      html += `<div class="day-event-card" 
        style="background:${e.color};top:${top}px;height:${height - 4}px;" 
        data-id="${e.id}" draggable="true">
        <div class="event-time">${this.formatTime(startDate)} – ${this.formatTime(endDate)}</div>
        <div class="event-title">${e.title}</div>
        ${e.location ? `<div class="event-location"><i class="ph ph-map-pin"></i> ${e.location}</div>` : ''}
      </div>`;
    });

    html += '</div>';
    return html;
  }

  // ============================================
  // Agenda View
  // ============================================
  renderAgendaView() {
    const now = new Date();
    const events = this.storage.getFilteredEvents()
      .filter(e => new Date(e.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    let html = '<div class="calendar-agenda-view">';
    let currentDateStr = '';

    events.forEach(e => {
      const startDate = new Date(e.start);
      const endDate = new Date(e.end);
      const dateStr = startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

      if (dateStr !== currentDateStr) {
        currentDateStr = dateStr;
        html += `<div class="agenda-date-header">
          <div class="agenda-day-badge">${startDate.getDate()}</div>
          ${dateStr}
        </div>`;
      }

      const duration = Math.round((endDate - startDate) / 60000);
      const durationStr = duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`;

      html += `<div class="agenda-item" data-id="${e.id}">
        <div class="agenda-time">
          <div class="agenda-time-start">${this.formatTime(startDate)}</div>
          <div class="agenda-time-end">${this.formatTime(endDate)}</div>
          <div class="agenda-duration">${durationStr}</div>
        </div>
        <div class="agenda-color-bar" style="background:${e.color}"></div>
        <div class="agenda-content">
          <div class="agenda-title">${e.title}</div>
          <div class="agenda-meta">
            <span class="agenda-type-badge" style="background:${EVENT_COLORS[e.color]?.light || '#f3f4f6'};color:${EVENT_COLORS[e.color]?.text || '#374151'}">${EVENT_TYPES[e.type]?.label || e.type}</span>
            ${e.location ? `<span class="agenda-meta-item"><i class="ph ph-map-pin"></i> ${e.location}</span>` : ''}
            ${e.attendees ? `<span class="agenda-meta-item"><i class="ph ph-users"></i> ${e.attendees.length} attendees</span>` : ''}
          </div>
        </div>
        <div class="agenda-actions">
          <button class="agenda-action-btn edit-event" data-id="${e.id}" title="Edit"><i class="ph ph-pencil-simple"></i></button>
          <button class="agenda-action-btn delete-event" data-id="${e.id}" title="Delete"><i class="ph ph-trash"></i></button>
        </div>
      </div>`;
    });

    if (events.length === 0) {
      html += `<div class="empty-state" style="padding:var(--space-12)">
        <div class="empty-state-icon"><i class="ph ph-calendar-x"></i></div>
        <div class="empty-state-title">No upcoming events</div>
        <div class="empty-state-desc">Create a new event to get started.</div>
      </div>`;
    }

    html += '</div>';
    return html;
  }

  // ============================================
  // Mini Calendar
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
      const day = daysInPrevMonth - i;
      html += `<div class="mini-cal-day other-month">${day}</div>`;
    }

    const events = this.storage.getEventsForRange(new Date(year, month, 1), new Date(year, month + 1, 0));

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = this.isSameDay(d, new Date());
      const isSelected = this.isSameDay(d, this.currentDate);
      const hasEvent = events.some(e => this.isSameDay(new Date(e.start), d));
      const classes = [
        'mini-cal-day',
        isToday ? 'today' : '',
        isSelected ? 'selected' : '',
        hasEvent ? 'has-event' : ''
      ].filter(Boolean).join(' ');

      html += `<div class="${classes}" data-date="${d.toISOString()}">${day}</div>`;
    }

    const remainingCells = (7 - ((startOffset + daysInMonth) % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      html += `<div class="mini-cal-day other-month">${day}</div>`;
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.mini-cal-day:not(.other-month)').forEach(cell => {
      cell.addEventListener('click', () => {
        this.currentDate = new Date(cell.dataset.date);
        this.currentView = 'day';
        this.updateViewTabs();
        this.render();
        this.renderMiniCalendar();
      });
    });
  }

  // ============================================
  // My Calendars
  // ============================================
  renderMyCalendars() {
    const container = document.getElementById('my-calendars');
    if (!container) return;

    const calendars = this.storage.getCalendars();
    let html = '';

    calendars.forEach(cal => {
      html += `<div class="calendar-item" data-id="${cal.id}">
        <div class="calendar-checkbox ${cal.checked ? 'checked' : 'unchecked'}"></div>
        <span class="calendar-item-name">${cal.name}</span>
        <div class="calendar-item-dots">
          <div class="calendar-item-dot" style="background:${cal.color}"></div>
        </div>
      </div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('.calendar-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        this.storage.toggleCalendar(id);
        this.renderMyCalendars();
        this.render();
        this.renderStats();
      });
    });
  }

  // ============================================
  // Upcoming Events Sidebar
  // ============================================
  renderUpcomingEvents() {
    const container = document.getElementById('upcoming-events-list');
    if (!container) return;

    const now = new Date();
    const events = this.storage.getFilteredEvents()
      .filter(e => new Date(e.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5);

    let html = '';
    events.forEach(e => {
      const startDate = new Date(e.start);
      const timeStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' • ' + this.formatTime(startDate);
      html += `<div class="upcoming-event-item" data-id="${e.id}">
        <div class="upcoming-event-dot" style="background:${e.color}"></div>
        <div class="upcoming-event-info">
          <div class="upcoming-event-title">${e.title}</div>
          <div class="upcoming-event-time">${timeStr}</div>
          <div class="upcoming-event-meta">
            <i class="ph ph-map-pin"></i>
            <span>${e.location || 'No location'}</span>
          </div>
        </div>
      </div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('.upcoming-event-item').forEach(item => {
      item.addEventListener('click', () => this.openEventDetails(item.dataset.id));
    });
  }

  // ============================================
  // Bottom Panels
  // ============================================
  renderTodayAgenda() {
    const container = document.getElementById('today-agenda');
    if (!container) return;

    const events = this.storage.getTodayEvents().sort((a, b) => new Date(a.start) - new Date(b.start));

    if (events.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:var(--space-6)"><div class="empty-state-desc">No events today</div></div>';
      return;
    }

    let html = '';
    events.forEach(e => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      const duration = Math.round((end - start) / 60000);
      const durationStr = duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`;

      html += `<div class="agenda-list-item" data-id="${e.id}">
        <div class="agenda-list-time">
          ${this.formatTime(start)}
          <div class="duration">${durationStr}</div>
        </div>
        <div class="agenda-list-bar" style="background:${e.color}"></div>
        <div class="agenda-list-info">
          <div class="agenda-list-title">${e.title}</div>
          <div class="agenda-list-meta">${e.location || 'No location'}</div>
        </div>
      </div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('.agenda-list-item').forEach(item => {
      item.addEventListener('click', () => this.openEventDetails(item.dataset.id));
    });
  }

  renderNextMeeting() {
    const container = document.getElementById('next-meeting');
    if (!container) return;

    const now = new Date();
    const events = this.storage.getFilteredEvents()
      .filter(e => new Date(e.start) > now && (e.type === 'meeting' || e.type === 'event'))
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    if (events.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:var(--space-6)"><div class="empty-state-desc">No upcoming meetings</div></div>';
      return;
    }

    const next = events[0];
    const start = new Date(next.start);
    const timeStr = start.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) + ' • ' + this.formatTime(start);

    container.innerHTML = `
      <div class="next-meeting-card">
        <div class="next-meeting-avatar" style="background:linear-gradient(135deg, var(--primary-400), var(--primary-600));display:flex;align-items:center;justify-content:center;color:white;font-weight:var(--font-bold);font-size:var(--text-xs);">
          ${next.attendees?.[0]?.split(' ').map(n => n[0]).join('').toUpperCase() || 'ME'}
        </div>
        <div class="next-meeting-info">
          <div class="next-meeting-title">${next.title}</div>
          <div class="next-meeting-time">${timeStr}</div>
        </div>
      </div>
      <div class="next-meeting-actions">
        <button class="btn btn-primary btn-sm" id="join-meeting-btn"><i class="ph ph-video-camera"></i> Join Meeting</button>
        <button class="btn btn-secondary btn-sm" id="view-details-btn">View Details</button>
      </div>
    `;

    document.getElementById('join-meeting-btn')?.addEventListener('click', () => {
      OP.toast.show('Joining meeting...', 'success');
    });

    document.getElementById('view-details-btn')?.addEventListener('click', () => {
      this.openEventDetails(next.id);
    });
  }

  renderMeetingInsights() {
    const container = document.getElementById('meeting-insights');
    if (!container) return;

    const events = this.storage.getFilteredEvents();
    const meetings = events.filter(e => e.type === 'meeting');
    const totalDuration = meetings.reduce((sum, e) => sum + (new Date(e.end) - new Date(e.start)), 0);
    const avgDuration = meetings.length > 0 ? Math.round(totalDuration / meetings.length / 60000) : 0;
    const productiveDay = 'Wednesdays';
    const completionRate = '92%';

    container.innerHTML = `
      <div class="insight-card">
        <div class="insight-card-icon green"><i class="ph ph-chart-line-up"></i></div>
        <div class="insight-card-label">Most Productive Day</div>
        <div class="insight-card-value">${productiveDay}</div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon blue"><i class="ph ph-clock"></i></div>
        <div class="insight-card-label">Average Meeting Time</div>
        <div class="insight-card-value">${avgDuration} minutes</div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon purple"><i class="ph ph-calendar-check"></i></div>
        <div class="insight-card-label">Most Meetings</div>
        <div class="insight-card-value">Tuesdays</div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon orange"><i class="ph ph-check-circle"></i></div>
        <div class="insight-card-label">Meeting Completion Rate</div>
        <div class="insight-card-value">${completionRate}</div>
      </div>
    `;
  }

  // ============================================
  // Event Modals
  // ============================================
  openEventModal(event = null) {
    const overlay = document.getElementById('event-modal-overlay');
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('modal-title');
    const deleteBtn = document.getElementById('modal-delete');
    const form = document.getElementById('event-form');

    this.selectedEvent = event;

    if (event) {
      title.textContent = 'Edit Event';
      deleteBtn.style.display = 'inline-flex';
      document.getElementById('event-id').value = event.id;
      document.getElementById('event-title').value = event.title;
      document.getElementById('event-start').value = this.toDatetimeLocal(new Date(event.start));
      document.getElementById('event-end').value = this.toDatetimeLocal(new Date(event.end));
      document.getElementById('event-location').value = event.location || '';
      document.getElementById('event-description').value = event.description || '';
      document.getElementById('event-attendees').value = event.attendees ? event.attendees.join(', ') : '';
      document.getElementById('event-all-day').checked = event.allDay || false;
      document.getElementById('event-reminder').checked = event.reminder !== false;
      document.getElementById('event-calendar').value = event.calendar || 'my-calendar';

      // Set type
      document.querySelectorAll('.event-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === event.type);
      });

      // Set color
      document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === event.color);
      });
    } else {
      title.textContent = 'New Event';
      deleteBtn.style.display = 'none';
      form.reset();
      document.getElementById('event-id').value = '';
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 3600000);
      document.getElementById('event-start').value = this.toDatetimeLocal(now);
      document.getElementById('event-end').value = this.toDatetimeLocal(oneHourLater);

      document.querySelectorAll('.event-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === 'meeting');
      });
      document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === '#6366f1');
      });
    }

    overlay.classList.add('active');
  }

  closeEventModal() {
    document.getElementById('event-modal-overlay')?.classList.remove('active');
    this.selectedEvent = null;
  }

  saveEvent() {
    const id = document.getElementById('event-id').value;
    const title = document.getElementById('event-title').value.trim();
    if (!title) {
      OP.toast.show('Please enter an event title', 'error');
      return;
    }

    const typeBtn = document.querySelector('.event-type-btn.active');
    const colorDot = document.querySelector('.color-dot.active');

    const eventData = {
      title,
      type: typeBtn ? typeBtn.dataset.type : 'event',
      calendar: document.getElementById('event-calendar').value,
      start: new Date(document.getElementById('event-start').value).toISOString(),
      end: new Date(document.getElementById('event-end').value).toISOString(),
      allDay: document.getElementById('event-all-day').checked,
      color: colorDot ? colorDot.dataset.color : '#6366f1',
      location: document.getElementById('event-location').value.trim(),
      description: document.getElementById('event-description').value.trim(),
      attendees: document.getElementById('event-attendees').value.split(',').map(a => a.trim()).filter(Boolean),
      reminder: document.getElementById('event-reminder').checked
    };

    if (id) {
      this.storage.updateEvent(id, eventData);
      OP.toast.show('Event updated successfully', 'success');
    } else {
      this.storage.addEvent(eventData);
      OP.toast.show('Event created successfully', 'success');
    }

    this.closeEventModal();
    this.render();
    this.renderMiniCalendar();
    this.renderUpcomingEvents();
    this.renderTodayAgenda();
    this.renderNextMeeting();
    this.renderStats();
  }

  deleteEvent() {
    if (!this.selectedEvent) return;
    if (confirm('Are you sure you want to delete this event?')) {
      this.storage.deleteEvent(this.selectedEvent.id);
      OP.toast.show('Event deleted', 'success');
      this.closeEventModal();
      this.render();
      this.renderMiniCalendar();
      this.renderUpcomingEvents();
      this.renderTodayAgenda();
      this.renderNextMeeting();
      this.renderStats();
    }
  }

  openEventDetails(id) {
    const event = this.storage.getEvent(id);
    if (!event) return;

    const overlay = document.getElementById('event-details-overlay');
    const body = document.getElementById('details-body');
    const start = new Date(event.start);
    const end = new Date(event.end);

    let html = `
      <div class="details-section">
        <div class="details-label">Title</div>
        <div class="details-value"><strong>${event.title}</strong></div>
      </div>
      <div class="details-section">
        <div class="details-label">Time</div>
        <div class="details-row"><i class="ph ph-clock"></i> ${start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <div class="details-row"><i class="ph ph-clock"></i> ${this.formatTime(start)} – ${this.formatTime(end)}</div>
      </div>
    `;

    if (event.location) {
      html += `<div class="details-section">
        <div class="details-label">Location</div>
        <div class="details-row"><i class="ph ph-map-pin"></i> ${event.location}</div>
      </div>`;
    }

    if (event.description) {
      html += `<div class="details-section">
        <div class="details-label">Description</div>
        <div class="details-value">${event.description}</div>
      </div>`;
    }

    if (event.attendees && event.attendees.length > 0) {
      html += `<div class="details-section">
        <div class="details-label">Attendees</div>
        <div class="details-attendees">`;
      event.attendees.forEach(att => {
        html += `<div class="details-attendee">
          <div class="details-attendee-avatar">${att.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
          ${att}
        </div>`;
      });
      html += `</div></div>`;
    }

    html += `<div class="details-section">
      <div class="details-label">Type</div>
      <div class="details-row"><i class="ph ${EVENT_TYPES[event.type]?.icon || 'ph-calendar-blank'}"></i> ${EVENT_TYPES[event.type]?.label || event.type}</div>
    </div>`;

    body.innerHTML = html;

    document.getElementById('details-edit-btn').onclick = () => {
      overlay.classList.remove('active');
      this.openEventModal(event);
    };

    overlay.classList.add('active');
  }

  closeDetailsModal() {
    document.getElementById('event-details-overlay')?.classList.remove('active');
  }

  // ============================================
  // Drag & Drop
  // ============================================
  handleDragStart(e, eventId) {
    this.draggedEvent = this.storage.getEvent(eventId);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.draggedEvent = null;
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.target.classList.add('drag-over');
  }

  handleDragLeave(e) {
    e.target.classList.remove('drag-over');
  }

  handleDrop(e, dayOffset, hour) {
    e.preventDefault();
    e.target.classList.remove('drag-over');

    if (!this.draggedEvent) return;

    const start = new Date(this.draggedEvent.start);
    const end = new Date(this.draggedEvent.end);
    const duration = end - start;

    const newStart = new Date(this.currentDate);
    if (this.currentView === 'week') {
      const weekStart = new Date(this.currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      newStart.setTime(weekStart.getTime());
      newStart.setDate(newStart.getDate() + dayOffset);
    }
    newStart.setHours(hour, 0, 0, 0);

    const newEnd = new Date(newStart.getTime() + duration);

    this.storage.updateEvent(this.draggedEvent.id, {
      start: newStart.toISOString(),
      end: newEnd.toISOString()
    });

    OP.toast.show('Event moved successfully', 'success');
    this.render();
    this.renderMiniCalendar();
    this.renderUpcomingEvents();
    this.renderTodayAgenda();
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    // View tabs
    document.querySelectorAll('.calendar-view-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentView = tab.dataset.view;
        this.updateViewTabs();
        this.render();
      });
    });

    // Navigation
    document.getElementById('cal-prev')?.addEventListener('click', () => this.navigate(-1));
    document.getElementById('cal-next')?.addEventListener('click', () => this.navigate(1));
    document.getElementById('cal-today')?.addEventListener('click', () => {
      this.currentDate = new Date();
      this.render();
      this.renderMiniCalendar();
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

    // New event
    document.getElementById('btn-new-event')?.addEventListener('click', () => this.openEventModal());
    document.querySelectorAll('.quick-create-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.openEventModal();
        setTimeout(() => {
          document.querySelectorAll('.event-type-btn').forEach(t => {
            t.classList.toggle('active', t.dataset.type === type);
          });
        }, 50);
      });
    });

    // Modal
    document.getElementById('modal-close')?.addEventListener('click', () => this.closeEventModal());
    document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeEventModal());
    document.getElementById('modal-save')?.addEventListener('click', () => this.saveEvent());
    document.getElementById('modal-delete')?.addEventListener('click', () => this.deleteEvent());
    document.getElementById('event-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeEventModal();
    });

    // Details modal
    document.getElementById('details-close')?.addEventListener('click', () => this.closeDetailsModal());
    document.getElementById('details-close-btn')?.addEventListener('click', () => this.closeDetailsModal());
    document.getElementById('event-details-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeDetailsModal();
    });

    // Event type selector
    document.querySelectorAll('.event-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.event-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Color picker
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });

    // Search
    document.getElementById('calendar-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      if (this.searchQuery) {
        this.currentView = 'agenda';
        this.updateViewTabs();
      }
      this.render();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('calendar-search')?.focus();
      }
      if (e.key === 'Escape') {
        this.closeEventModal();
        this.closeDetailsModal();
      }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        const active = document.activeElement;
        if (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
          this.openEventModal();
        }
      }
    });

    // Sidebar toggle
    document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.dashboard-sidebar')?.classList.toggle('open');
      document.querySelector('.sidebar-overlay')?.classList.toggle('active');
    });

    document.querySelector('.sidebar-overlay')?.addEventListener('click', () => {
      document.querySelector('.dashboard-sidebar')?.classList.remove('open');
      document.querySelector('.sidebar-overlay')?.classList.remove('active');
    });
  }

  bindCalendarEvents() {
    // Event cards click
    document.querySelectorAll('.week-event-card, .day-event-card, .month-event-pill').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEventDetails(card.dataset.id);
      });
    });

    // Drag and drop
    document.querySelectorAll('.week-event-card[draggable="true"], .day-event-card[draggable="true"]').forEach(card => {
      card.addEventListener('dragstart', (e) => this.handleDragStart(e, card.dataset.id));
      card.addEventListener('dragend', (e) => this.handleDragEnd(e));
    });

    document.querySelectorAll('.time-slot-cell, .day-time-slot').forEach(slot => {
      slot.addEventListener('dragover', (e) => this.handleDragOver(e));
      slot.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      slot.addEventListener('drop', (e) => {
        const day = parseInt(slot.dataset.day || 0);
        const hour = parseInt(slot.dataset.hour);
        this.handleDrop(e, day, hour);
      });
      slot.addEventListener('dblclick', () => {
        const hour = parseInt(slot.dataset.hour);
        const start = new Date(this.currentDate);
        if (this.currentView === 'week') {
          const weekStart = new Date(this.currentDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          start.setTime(weekStart.getTime());
          start.setDate(start.getDate() + parseInt(slot.dataset.day || 0));
        }
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start.getTime() + 3600000);
        this.openEventModal();
        setTimeout(() => {
          document.getElementById('event-start').value = this.toDatetimeLocal(start);
          document.getElementById('event-end').value = this.toDatetimeLocal(end);
        }, 50);
      });
    });

    // Month day cell click
    document.querySelectorAll('.month-day-cell:not(.other-month)').forEach(cell => {
      cell.addEventListener('click', () => {
        if (cell.dataset.date) {
          this.currentDate = new Date(cell.dataset.date);
          this.currentView = 'day';
          this.updateViewTabs();
          this.render();
        }
      });
    });

    // Agenda actions
    document.querySelectorAll('.edit-event').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const event = this.storage.getEvent(btn.dataset.id);
        if (event) this.openEventModal(event);
      });
    });

    document.querySelectorAll('.delete-event').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this event?')) {
          this.storage.deleteEvent(btn.dataset.id);
          OP.toast.show('Event deleted', 'success');
          this.render();
          this.renderMiniCalendar();
          this.renderUpcomingEvents();
          this.renderTodayAgenda();
          this.renderNextMeeting();
          this.renderStats();
        }
      });
    });
  }

  updateViewTabs() {
    document.querySelectorAll('.calendar-view-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === this.currentView);
    });
  }

  navigate(direction) {
    switch (this.currentView) {
      case 'day':
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        break;
      case 'week':
        this.currentDate.setDate(this.currentDate.getDate() + direction * 7);
        break;
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        break;
      case 'agenda':
        this.currentDate.setDate(this.currentDate.getDate() + direction * 7);
        break;
    }
    this.render();
    this.renderMiniCalendar();
  }

  // ============================================
  // Utilities
  // ============================================
  isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  toDatetimeLocal(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  highlightCurrentTime() {
    const line = document.getElementById('current-time-line');
    if (!line) return;

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    if (currentHour >= 7 && currentHour <= 18) {
      const top = (currentHour - 7) * 48;
      line.style.top = `${top}px`;
      line.style.display = 'block';
    } else {
      line.style.display = 'none';
    }
  }

  // ============================================
  // Reminders
  // ============================================
  startReminderCheck() {
    setInterval(() => this.checkReminders(), 60000);
    this.checkReminders();
  }

  checkReminders() {
    const now = new Date();
    const events = this.storage.getFilteredEvents().filter(e => e.reminder !== false);
    events.forEach(e => {
      const start = new Date(e.start);
      const diff = start - now;
      if (diff > 0 && diff <= 900000 && !e.reminderSent) { // 15 minutes
        OP.toast.show(`Reminder: ${e.title} starts at ${this.formatTime(start)}`, 'warning');
        this.storage.updateEvent(e.id, { reminderSent: true });
      }
    });
  }
}

window.CalendarApp = CalendarApp;