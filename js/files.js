/**
 * OnePlace Enterprise v3.0 — File Manager Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const FILE_STORAGE_KEYS = {
  FILES: 'op_files',
  FOLDERS: 'op_folders',
  TRASH: 'op_files_trash',
  ACTIVITIES: 'op_files_activities',
  SETTINGS: 'op_files_settings',
  CURRENT_FOLDER: 'op_current_folder'
};

// ============================================
// File Type Helpers
// ============================================
const FILE_TYPES = {
  pdf: { icon: 'ph-file-pdf', color: '#ef4444', bg: '#fef2f2', label: 'PDF' },
  doc: { icon: 'ph-file-doc', color: '#3b82f6', bg: '#dbeafe', label: 'Word' },
  docx: { icon: 'ph-file-doc', color: '#3b82f6', bg: '#dbeafe', label: 'Word' },
  xls: { icon: 'ph-file-xls', color: '#10b981', bg: '#ecfdf5', label: 'Excel' },
  xlsx: { icon: 'ph-file-xls', color: '#10b981', bg: '#ecfdf5', label: 'Excel' },
  ppt: { icon: 'ph-file-ppt', color: '#f97316', bg: '#fff7ed', label: 'PowerPoint' },
  pptx: { icon: 'ph-file-ppt', color: '#f97316', bg: '#fff7ed', label: 'PowerPoint' },
  png: { icon: 'ph-file-image', color: '#a855f7', bg: '#f3e8ff', label: 'Image' },
  jpg: { icon: 'ph-file-image', color: '#a855f7', bg: '#f3e8ff', label: 'Image' },
  jpeg: { icon: 'ph-file-image', color: '#a855f7', bg: '#f3e8ff', label: 'Image' },
  gif: { icon: 'ph-file-image', color: '#a855f7', bg: '#f3e8ff', label: 'Image' },
  svg: { icon: 'ph-file-image', color: '#a855f7', bg: '#f3e8ff', label: 'Image' },
  mp4: { icon: 'ph-file-video', color: '#f59e0b', bg: '#fef3c7', label: 'Video' },
  mov: { icon: 'ph-file-video', color: '#f59e0b', bg: '#fef3c7', label: 'Video' },
  avi: { icon: 'ph-file-video', color: '#f59e0b', bg: '#fef3c7', label: 'Video' },
  zip: { icon: 'ph-file-zip', color: '#6b7280', bg: '#f3f4f6', label: 'ZIP' },
  rar: { icon: 'ph-file-zip', color: '#6b7280', bg: '#f3f4f6', label: 'Archive' },
  sketch: { icon: 'ph-diamond', color: '#eab308', bg: '#fef9c3', label: 'Sketch' },
  txt: { icon: 'ph-file-text', color: '#0ea5e9', bg: '#f0f9ff', label: 'Text' },
  md: { icon: 'ph-file-text', color: '#0ea5e9', bg: '#f0f9ff', label: 'Markdown' }
};

const FOLDER_COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];

// ============================================
// Sample Data
// ============================================
const SAMPLE_FOLDERS = [
  { id: 'folder_1', name: 'Documents', parentId: 'root', fileCount: 124, color: 0, createdAt: '2025-01-15T10:00:00Z' },
  { id: 'folder_2', name: 'Marketing', parentId: 'root', fileCount: 86, color: 1, createdAt: '2025-01-20T14:30:00Z' },
  { id: 'folder_3', name: 'Designs', parentId: 'root', fileCount: 64, color: 0, createdAt: '2025-02-01T09:00:00Z' },
  { id: 'folder_4', name: 'Projects', parentId: 'root', fileCount: 53, color: 2, createdAt: '2025-02-10T11:00:00Z' },
  { id: 'folder_5', name: 'Reports', parentId: 'root', fileCount: 42, color: 1, createdAt: '2025-02-15T16:00:00Z' },
  { id: 'folder_6', name: 'Invoices', parentId: 'root', fileCount: 28, color: 3, createdAt: '2025-03-01T08:00:00Z' }
];

const SAMPLE_FILES = [
  { id: 'file_1', name: 'Q2 Business Report.pdf', type: 'pdf', size: 2457600, folderId: 'root', starred: false, shared: false, trashed: false, createdAt: '2025-05-25T10:30:00Z', modifiedAt: '2025-05-25T10:30:00Z', owner: 'Alex Morgan' },
  { id: 'file_2', name: 'Sales Data.xlsx', type: 'xlsx', size: 1887436, folderId: 'root', starred: false, shared: true, trashed: false, createdAt: '2025-05-24T14:00:00Z', modifiedAt: '2025-05-24T14:00:00Z', owner: 'Sarah Johnson' },
  { id: 'file_3', name: 'Project Proposal.docx', type: 'docx', size: 3355443, folderId: 'root', starred: true, shared: false, trashed: false, createdAt: '2025-05-24T09:00:00Z', modifiedAt: '2025-05-24T09:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_4', name: 'Marketing Strategy.pptx', type: 'pptx', size: 5872025, folderId: 'root', starred: false, shared: true, trashed: false, createdAt: '2025-05-23T16:00:00Z', modifiedAt: '2025-05-23T16:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_5', name: 'Brand Logo.png', type: 'png', size: 1363148, folderId: 'root', starred: true, shared: true, trashed: false, createdAt: '2025-05-23T11:00:00Z', modifiedAt: '2025-05-23T11:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_6', name: 'Banner Design.jpg', type: 'jpg', size: 2621440, folderId: 'root', starred: false, shared: false, trashed: false, createdAt: '2025-05-22T13:00:00Z', modifiedAt: '2025-05-22T13:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_7', name: 'Client Assets.zip', type: 'zip', size: 13421772, folderId: 'root', starred: false, shared: false, trashed: false, createdAt: '2025-05-22T10:00:00Z', modifiedAt: '2025-05-22T10:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_8', name: 'Invoice_001.pdf', type: 'pdf', size: 1153433, folderId: 'root', starred: false, shared: false, trashed: false, createdAt: '2025-05-21T15:00:00Z', modifiedAt: '2025-05-21T15:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_9', name: 'App Design.sketch', type: 'sketch', size: 9017753, folderId: 'root', starred: true, shared: true, trashed: false, createdAt: '2025-05-20T09:00:00Z', modifiedAt: '2025-05-20T09:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_10', name: 'Product Demo.mp4', type: 'mp4', size: 25669140, folderId: 'root', starred: false, shared: false, trashed: false, createdAt: '2025-05-20T08:00:00Z', modifiedAt: '2025-05-20T08:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_11', name: 'Meeting Notes.txt', type: 'txt', size: 2048, folderId: 'root', starred: false, shared: true, trashed: false, createdAt: '2025-05-19T17:00:00Z', modifiedAt: '2025-05-19T17:00:00Z', owner: 'Alex Morgan' },
  { id: 'file_12', name: 'Contract Signed.pdf', type: 'pdf', size: 1782579, folderId: 'root', starred: true, shared: true, trashed: false, createdAt: '2025-05-19T14:00:00Z', modifiedAt: '2025-05-19T14:00:00Z', owner: 'Alex Morgan' }
];

const SAMPLE_ACTIVITIES = [
  { id: 'act_1', type: 'upload', title: 'Q2 Business Report.pdf', desc: 'Uploaded by you', time: '2m ago', timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: 'act_2', type: 'upload', title: 'Sales Data.xlsx', desc: 'Uploaded by Sarah Johnson', time: '15m ago', timestamp: new Date(Date.now() - 900000).toISOString() },
  { id: 'act_3', type: 'share', title: 'Brand Logo.png', desc: 'Shared by Michael Brown', time: '1h ago', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'act_4', type: 'upload', title: 'Project Proposal.docx', desc: 'Uploaded by you', time: '2h ago', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'act_5', type: 'edit', title: 'Marketing Strategy.pptx', desc: 'Edited by Emily Davis', time: '3h ago', timestamp: new Date(Date.now() - 10800000).toISOString() }
];

// ============================================
// File Manager Class
// ============================================
class FileManager {
  constructor() {
    this.currentFolder = 'root';
    this.currentTab = 'my-files';
    this.currentView = 'grid';
    this.currentSort = 'name';
    this.currentPage = 1;
    this.pageSize = 12;
    this.selectedItems = new Set();
    this.searchQuery = '';
    this.contextMenuTarget = null;
    this.renameTarget = null;
    this.moveTargets = null;
    this.shareTarget = null;
    this.deleteTargets = null;
    
    this.init();
  }

  init() {
    this.seedData();
    this.loadSettings();
    this.bindEvents();
    this.render();
    this.renderActivities();
    this.updateStats();
  }

  // --- Data Management ---

  seedData() {
    if (!localStorage.getItem(FILE_STORAGE_KEYS.FOLDERS)) {
      localStorage.setItem(FILE_STORAGE_KEYS.FOLDERS, JSON.stringify(SAMPLE_FOLDERS));
    }
    if (!localStorage.getItem(FILE_STORAGE_KEYS.FILES)) {
      localStorage.setItem(FILE_STORAGE_KEYS.FILES, JSON.stringify(SAMPLE_FILES));
    }
    if (!localStorage.getItem(FILE_STORAGE_KEYS.TRASH)) {
      localStorage.setItem(FILE_STORAGE_KEYS.TRASH, JSON.stringify([]));
    }
    if (!localStorage.getItem(FILE_STORAGE_KEYS.ACTIVITIES)) {
      localStorage.setItem(FILE_STORAGE_KEYS.ACTIVITIES, JSON.stringify(SAMPLE_ACTIVITIES));
    }
  }

  getFolders() {
    try {
      return JSON.parse(localStorage.getItem(FILE_STORAGE_KEYS.FOLDERS)) || [];
    } catch {
      return [];
    }
  }

  getFiles() {
    try {
      return JSON.parse(localStorage.getItem(FILE_STORAGE_KEYS.FILES)) || [];
    } catch {
      return [];
    }
  }

  getTrash() {
    try {
      return JSON.parse(localStorage.getItem(FILE_STORAGE_KEYS.TRASH)) || [];
    } catch {
      return [];
    }
  }

  getActivities() {
    try {
      return JSON.parse(localStorage.getItem(FILE_STORAGE_KEYS.ACTIVITIES)) || [];
    } catch {
      return [];
    }
  }

  saveFolders(folders) {
    localStorage.setItem(FILE_STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }

  saveFiles(files) {
    localStorage.setItem(FILE_STORAGE_KEYS.FILES, JSON.stringify(files));
  }

  saveTrash(trash) {
    localStorage.setItem(FILE_STORAGE_KEYS.TRASH, JSON.stringify(trash));
  }

  saveActivities(activities) {
    localStorage.setItem(FILE_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }

  // --- Settings ---

  loadSettings() {
    const settings = JSON.parse(localStorage.getItem(FILE_STORAGE_KEYS.SETTINGS) || '{}');
    this.currentView = settings.view || 'grid';
    this.currentSort = settings.sort || 'name';
    this.pageSize = settings.pageSize || 12;
    this.currentFolder = localStorage.getItem(FILE_STORAGE_KEYS.CURRENT_FOLDER) || 'root';
  }

  saveSettings() {
    localStorage.setItem(FILE_STORAGE_KEYS.SETTINGS, JSON.stringify({
      view: this.currentView,
      sort: this.currentSort,
      pageSize: this.pageSize
    }));
    localStorage.setItem(FILE_STORAGE_KEYS.CURRENT_FOLDER, this.currentFolder);
  }

  // --- Helpers ---

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getFileType(ext) {
    return FILE_TYPES[ext] || { icon: 'ph-file', color: '#6b7280', bg: '#f3f4f6', label: 'File' };
  }

  getFileExtension(name) {
    return name.split('.').pop().toLowerCase();
  }

  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  addActivity(type, title, desc) {
    const activities = this.getActivities();
    activities.unshift({
      id: `act_${Date.now()}`,
      type,
      title,
      desc,
      time: 'Just now',
      timestamp: new Date().toISOString()
    });
    this.saveActivities(activities.slice(0, 50));
    this.renderActivities();
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '<i class="ph ph-check-circle"></i>',
      error: '<i class="ph ph-x-circle"></i>',
      warning: '<i class="ph ph-warning"></i>'
    };

    toast.innerHTML = `
      <span class="alert-icon">${icons[type]}</span>
      <span>${message}</span>
      <button class="toast-close" aria-label="Close notification">
        <i class="ph ph-x"></i>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // --- Filtering & Sorting ---

  getFilteredFolders() {
    let folders = this.getFolders();
    
    if (this.currentTab === 'trash') return [];
    if (this.currentTab === 'starred') return folders.filter(f => f.starred);
    if (this.currentTab === 'shared') return [];
    if (this.currentTab === 'recent') return [];
    
    if (this.currentFolder !== 'root') {
      folders = folders.filter(f => f.parentId === this.currentFolder);
    } else {
      folders = folders.filter(f => f.parentId === 'root');
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      folders = folders.filter(f => f.name.toLowerCase().includes(q));
    }

    return this.sortItems(folders);
  }

  getFilteredFiles() {
    let files = this.getFiles();
    const trash = this.getTrash();

    if (this.currentTab === 'trash') {
      return this.sortItems(trash);
    }
    
    if (this.currentTab === 'starred') {
      files = files.filter(f => f.starred && !f.trashed);
    } else if (this.currentTab === 'shared') {
      files = files.filter(f => f.shared && !f.trashed);
    } else if (this.currentTab === 'recent') {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      files = files.filter(f => new Date(f.modifiedAt) > cutoff && !f.trashed);
    } else {
      if (this.currentFolder !== 'root') {
        files = files.filter(f => f.folderId === this.currentFolder && !f.trashed);
      } else {
        files = files.filter(f => f.folderId === 'root' && !f.trashed);
      }
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      files = files.filter(f => f.name.toLowerCase().includes(q));
    }

    return this.sortItems(files);
  }

  sortItems(items) {
    return [...items].sort((a, b) => {
      switch (this.currentSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.modifiedAt || b.createdAt) - new Date(a.modifiedAt || a.createdAt);
        case 'size':
          return (b.size || 0) - (a.size || 0);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        default:
          return 0;
      }
    });
  }

  // --- Rendering ---

  render() {
    this.renderFolders();
    this.renderFiles();
    this.renderBreadcrumb();
    this.renderPagination();
    this.updateToolbar();
    this.updateViewToggle();
  }

  renderFolders() {
    const grid = document.getElementById('foldersGrid');
    const folders = this.getFilteredFolders();
    
    if (folders.length === 0 && this.currentTab === 'my-files' && this.currentFolder === 'root' && !this.searchQuery) {
      grid.innerHTML = '';
      return;
    }

    let html = '';
    
    if (this.currentTab === 'my-files') {
      html += `
        <div class="new-folder-card" id="newFolderCard">
          <i class="ph ph-plus"></i>
          <span>New Folder</span>
        </div>
      `;
    }

    folders.forEach(folder => {
      const isSelected = this.selectedItems.has(folder.id);
      const color = FOLDER_COLORS[folder.color % FOLDER_COLORS.length];
      html += `
        <div class="folder-card ${isSelected ? 'selected' : ''} ${folder.starred ? 'starred' : ''}" data-id="${folder.id}" data-type="folder">
          <label class="folder-checkbox" onclick="event.stopPropagation()">
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-id="${folder.id}" data-type="folder">
          </label>
          <button class="folder-menu" onclick="event.stopPropagation(); fileManager.showContextMenu(event, '${folder.id}', 'folder')">
            <i class="ph ph-dots-three-vertical"></i>
          </button>
          <div class="folder-icon">
            <i class="ph ph-folder" style="color: ${color};"></i>
          </div>
          <span class="folder-name">${this.escapeHtml(folder.name)}</span>
          <span class="folder-count">${folder.fileCount} files</span>
        </div>
      `;
    });

    grid.innerHTML = html || '';
    
    grid.querySelectorAll('.folder-card[data-type="folder"]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.folder-checkbox') || e.target.closest('.folder-menu')) return;
        this.openFolder(card.dataset.id);
      });
    });

    grid.querySelectorAll('.folder-checkbox input').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.toggleSelection(e.target.dataset.id, e.target.checked);
      });
    });

    const newFolderCard = document.getElementById('newFolderCard');
    if (newFolderCard) {
      newFolderCard.addEventListener('click', () => this.openModal('newFolderModal'));
    }
  }

  renderFiles() {
    const grid = document.getElementById('filesGrid');
    const files = this.getFilteredFiles();
    const emptyState = document.getElementById('emptyState');

    if (files.length === 0) {
      grid.innerHTML = '';
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';
    grid.className = `files-grid ${this.currentView === 'list' ? 'list-view' : ''}`;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedFiles = files.slice(start, end);

    let html = '';
    paginatedFiles.forEach(file => {
      const isSelected = this.selectedItems.has(file.id);
      const ext = this.getFileExtension(file.name);
      const typeInfo = this.getFileType(ext);
      const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext);
      
      html += `
        <div class="file-card ${isSelected ? 'selected' : ''} ${file.starred ? 'starred' : ''}" data-id="${file.id}" data-type="file">
          <label class="file-checkbox" onclick="event.stopPropagation()">
            <input type="checkbox" ${isSelected ? 'checked' : ''} data-id="${file.id}" data-type="file">
          </label>
          <button class="file-menu" onclick="event.stopPropagation(); fileManager.showContextMenu(event, '${file.id}', 'file')">
            <i class="ph ph-dots-three-vertical"></i>
          </button>
          <div class="file-thumbnail ${ext}">
            ${isImage ? 
              `<img src="https://placehold.co/160x160/${typeInfo.color.replace('#', '')}/white?text=${ext.toUpperCase()}" alt="${this.escapeHtml(file.name)}">` :
              `<i class="ph ${typeInfo.icon} file-thumbnail-icon"></i>`
            }
          </div>
          <div class="file-info">
            <span class="file-name">${this.escapeHtml(file.name)}</span>
            <div class="file-meta">
              <span>${ext.toUpperCase()} • ${this.formatSize(file.size)}</span>
              <span>${this.formatDate(file.modifiedAt)}</span>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    grid.querySelectorAll('.file-card[data-type="file"]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.file-checkbox') || e.target.closest('.file-menu')) return;
        this.previewFile(card.dataset.id);
      });
    });

    grid.querySelectorAll('.file-checkbox input').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.toggleSelection(e.target.dataset.id, e.target.checked);
      });
    });
  }

  renderBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    if (this.currentFolder === 'root') {
      breadcrumb.innerHTML = '<span class="breadcrumb-item" data-folder="root">My Files</span>';
      return;
    }

    const folders = this.getFolders();
    const path = [];
    let current = folders.find(f => f.id === this.currentFolder);
    
    while (current) {
      path.unshift(current);
      current = folders.find(f => f.id === current.parentId);
    }

    let html = '<span class="breadcrumb-item" data-folder="root">My Files</span>';
    path.forEach(folder => {
      html += ` / <span class="breadcrumb-item" data-folder="${folder.id}">${this.escapeHtml(folder.name)}</span>`;
    });

    breadcrumb.innerHTML = html;

    breadcrumb.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentFolder = item.dataset.folder;
        this.saveSettings();
        this.render();
      });
    });
  }

  renderPagination() {
    const files = this.getFilteredFiles();
    const total = files.length;
    const totalPages = Math.ceil(total / this.pageSize) || 1;
    const start = Math.min((this.currentPage - 1) * this.pageSize + 1, total);
    const end = Math.min(this.currentPage * this.pageSize, total);

    document.getElementById('showingStart').textContent = total > 0 ? start : 0;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalItems').textContent = total;

    const controls = document.querySelector('.pagination-controls');
    let html = '';
    
    html += `<button class="pagination-btn" id="prevPage" ${this.currentPage <= 1 ? 'disabled' : ''}><i class="ph ph-caret-left"></i></button>`;
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (totalPages > 5) {
      html += `<span class="pagination-ellipsis">...</span>`;
      html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    html += `<button class="pagination-btn" id="nextPage" ${this.currentPage >= totalPages ? 'disabled' : ''}><i class="ph ph-caret-right"></i></button>`;
    
    controls.innerHTML = html;

    controls.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.render();
      });
    });

    document.getElementById('prevPage').addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.render();
      }
    });

    document.getElementById('pageSize').value = this.pageSize;
  }

  renderActivities() {
    const list = document.getElementById('activityList');
    const activities = this.getActivities().slice(0, 5);

    const icons = {
      upload: 'ph-upload-simple',
      share: 'ph-share-network',
      edit: 'ph-pencil-simple',
      delete: 'ph-trash'
    };

    let html = '';
    activities.forEach(act => {
      html += `
        <div class="activity-item">
          <div class="activity-icon ${act.type}"><i class="ph ${icons[act.type] || 'ph-circle'}"></i></div>
          <div class="activity-content">
            <div class="activity-title">${this.escapeHtml(act.title)}</div>
            <div class="activity-desc">${this.escapeHtml(act.desc)}</div>
          </div>
          <span class="activity-time">${act.time}</span>
        </div>
      `;
    });

    list.innerHTML = html;
  }

  updateStats() {
    const files = this.getFiles();
    const folders = this.getFolders();
    const trash = this.getTrash();

    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const usedGB = (totalSize / (1024 * 1024 * 1024)).toFixed(1);
    
    document.getElementById('totalStorage').textContent = `${usedGB} GB`;
    document.getElementById('myFilesCount').textContent = files.filter(f => !f.trashed).length.toLocaleString();
    document.getElementById('foldersCount').textContent = folders.length.toString();
    document.getElementById('sharedFilesCount').textContent = files.filter(f => f.shared && !f.trashed).length.toString();
    
    const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    document.getElementById('recentFilesCount').textContent = files.filter(f => new Date(f.modifiedAt) > recentCutoff && !f.trashed).length.toString();
    document.getElementById('trashCount').textContent = trash.length.toString();
  }

  updateToolbar() {
    const actions = document.getElementById('toolbarActions');
    const selectAll = document.getElementById('selectAll');
    
    if (this.selectedItems.size > 0) {
      actions.classList.add('visible');
      selectAll.checked = true;
    } else {
      actions.classList.remove('visible');
      selectAll.checked = false;
    }
  }

  updateViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === this.currentView);
    });
  }

  // --- Actions ---

  openFolder(folderId) {
    this.currentFolder = folderId;
    this.currentPage = 1;
    this.selectedItems.clear();
    this.saveSettings();
    this.render();
  }

  toggleSelection(id, selected) {
    if (selected) {
      this.selectedItems.add(id);
    } else {
      this.selectedItems.delete(id);
    }
    this.updateToolbar();
    this.render();
  }

  selectAll(checked) {
    if (checked) {
      const folders = this.getFilteredFolders();
      const files = this.getFilteredFiles();
      folders.forEach(f => this.selectedItems.add(f.id));
      files.forEach(f => this.selectedItems.add(f.id));
    } else {
      this.selectedItems.clear();
    }
    this.render();
  }

  createFolder(name, parentId = 'root') {
    const folders = this.getFolders();
    const newFolder = {
      id: this.generateId('folder'),
      name: name.trim(),
      parentId: parentId,
      fileCount: 0,
      color: Math.floor(Math.random() * FOLDER_COLORS.length),
      createdAt: new Date().toISOString(),
      starred: false
    };
    
    folders.push(newFolder);
    this.saveFolders(folders);
    this.addActivity('upload', `Created folder "${name}"`, 'Created by you');
    this.showToast('Folder created successfully', 'success');
    this.render();
    this.updateStats();
  }

  renameItem(id, type, newName) {
    if (type === 'folder') {
      const folders = this.getFolders();
      const folder = folders.find(f => f.id === id);
      if (folder) {
        folder.name = newName.trim();
        this.saveFolders(folders);
      }
    } else {
      const files = this.getFiles();
      const file = files.find(f => f.id === id);
      if (file) {
        file.name = newName.trim();
        file.modifiedAt = new Date().toISOString();
        this.saveFiles(files);
      }
    }
    
    this.addActivity('edit', `Renamed to "${newName}"`, 'Edited by you');
    this.showToast('Renamed successfully', 'success');
    this.render();
  }

  moveItems(ids, targetFolderId) {
    const files = this.getFiles();
    const folders = this.getFolders();
    
    ids.forEach(id => {
      const file = files.find(f => f.id === id);
      if (file) {
        file.folderId = targetFolderId;
        file.modifiedAt = new Date().toISOString();
      }
      
      const folder = folders.find(f => f.id === id);
      if (folder) {
        folder.parentId = targetFolderId;
      }
    });
    
    this.saveFiles(files);
    this.saveFolders(folders);
    this.selectedItems.clear();
    this.showToast('Items moved successfully', 'success');
    this.render();
  }

  deleteItems(ids) {
    const files = this.getFiles();
    const folders = this.getFolders();
    const trash = this.getTrash();
    
    ids.forEach(id => {
      const fileIndex = files.findIndex(f => f.id === id);
      if (fileIndex !== -1) {
        const file = { ...files[fileIndex], deletedAt: new Date().toISOString() };
        trash.push(file);
        files.splice(fileIndex, 1);
      }
      
      const folderIndex = folders.findIndex(f => f.id === id);
      if (folderIndex !== -1) {
        const folderId = folders[folderIndex].id;
        files.forEach(f => {
          if (f.folderId === folderId) f.folderId = 'root';
        });
        folders.splice(folderIndex, 1);
      }
    });
    
    this.saveFiles(files);
    this.saveFolders(folders);
    this.saveTrash(trash);
    this.selectedItems.clear();
    this.addActivity('delete', `Moved ${ids.length} item(s) to trash`, 'Deleted by you');
    this.showToast('Moved to trash', 'success');
    this.render();
    this.updateStats();
  }

  restoreItems(ids) {
    const trash = this.getTrash();
    const files = this.getFiles();
    
    ids.forEach(id => {
      const index = trash.findIndex(f => f.id === id);
      if (index !== -1) {
        const item = { ...trash[index] };
        delete item.deletedAt;
        item.trashed = false;
        files.push(item);
        trash.splice(index, 1);
      }
    });
    
    this.saveFiles(files);
    this.saveTrash(trash);
    this.selectedItems.clear();
    this.showToast('Items restored', 'success');
    this.render();
    this.updateStats();
  }

  permanentlyDelete(ids) {
    const trash = this.getTrash();
    this.saveTrash(trash.filter(f => !ids.includes(f.id)));
    this.selectedItems.clear();
    this.showToast('Items permanently deleted', 'success');
    this.render();
    this.updateStats();
  }

  toggleStar(id, type) {
    if (type === 'folder') {
      const folders = this.getFolders();
      const folder = folders.find(f => f.id === id);
      if (folder) {
        folder.starred = !folder.starred;
        this.saveFolders(folders);
      }
    } else {
      const files = this.getFiles();
      const file = files.find(f => f.id === id);
      if (file) {
        file.starred = !file.starred;
        this.saveFiles(files);
      }
    }
    
    this.render();
  }

  shareFile(id, emails, permission) {
    const files = this.getFiles();
    const file = files.find(f => f.id === id);
    if (file) {
      file.shared = true;
      file.sharedWith = file.sharedWith || [];
      emails.split(',').forEach(email => {
        const trimmed = email.trim();
        if (trimmed && !file.sharedWith.includes(trimmed)) {
          file.sharedWith.push(trimmed);
        }
      });
      file.permission = permission;
      this.saveFiles(files);
    }
    
    this.addActivity('share', `Shared "${file.name}"`, `Shared with ${emails.split(',').length} people`);
    this.showToast('File shared successfully', 'success');
  }

  // --- Upload Simulation ---

  simulateUpload(files) {
    const list = document.getElementById('uploadProgressList');
    
    Array.from(files).forEach((file, index) => {
      const ext = this.getFileExtension(file.name);
      const typeInfo = this.getFileType(ext);
      const id = this.generateId('file');
      
      const progressItem = document.createElement('div');
      progressItem.className = 'upload-progress-item';
      progressItem.id = `upload_${id}`;
      progressItem.innerHTML = `
        <div class="upload-progress-icon" style="background: ${typeInfo.bg}; color: ${typeInfo.color};">
          <i class="ph ${typeInfo.icon}"></i>
        </div>
        <div class="upload-progress-info">
          <div class="upload-progress-name">${this.escapeHtml(file.name)}</div>
          <div class="upload-progress-bar">
            <div class="upload-progress-fill" style="width: 0%;"></div>
          </div>
        </div>
        <span class="upload-progress-size">0%</span>
      `;
      list.appendChild(progressItem);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          const newFile = {
            id: id,
            name: file.name,
            type: ext,
            size: file.size,
            folderId: this.currentFolder,
            starred: false,
            shared: false,
            trashed: false,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            owner: 'Alex Morgan'
          };
          
          const existingFiles = this.getFiles();
          existingFiles.push(newFile);
          this.saveFiles(existingFiles);
          
          this.addActivity('upload', `Uploaded "${file.name}"`, 'Uploaded by you');
          
          setTimeout(() => {
            progressItem.remove();
            if (list.children.length === 0) {
              this.closeModal('uploadModal');
              this.render();
              this.updateStats();
            }
          }, 500);
        }
        
        const fill = progressItem.querySelector('.upload-progress-fill');
        const size = progressItem.querySelector('.upload-progress-size');
        if (fill) fill.style.width = `${progress}%`;
        if (size) size.textContent = `${Math.round(progress)}%`;
      }, 200 + index * 100);
    });
  }

  // --- Preview ---

  previewFile(id) {
    const files = this.getFiles();
    const trash = this.getTrash();
    const file = files.find(f => f.id === id) || trash.find(f => f.id === id);
    
    if (!file) return;
    
    const ext = this.getFileExtension(file.name);
    const typeInfo = this.getFileType(ext);
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext);
    
    document.getElementById('previewFileName').textContent = file.name;
    document.getElementById('previewFileDetails').textContent = `${this.formatSize(file.size)} • ${typeInfo.label} • ${this.formatDate(file.modifiedAt)}`;
    document.getElementById('previewFileIcon').innerHTML = `<i class="ph ${typeInfo.icon}" style="color: ${typeInfo.color}; font-size: 32px;"></i>`;
    document.getElementById('previewFileIcon').style.background = typeInfo.bg;
    
    document.getElementById('previewType').textContent = `${typeInfo.label} Document`;
    document.getElementById('previewSize').textContent = this.formatSize(file.size);
    document.getElementById('previewCreated').textContent = this.formatDate(file.createdAt);
    document.getElementById('previewModified').textContent = this.formatDate(file.modifiedAt);
    
    const content = document.getElementById('previewContent');
    if (isImage) {
      content.innerHTML = `<img src="https://placehold.co/600x400/${typeInfo.color.replace('#', '')}/white?text=${ext.toUpperCase()}" alt="${this.escapeHtml(file.name)}">`;
    } else {
      content.innerHTML = `
        <div class="preview-placeholder">
          <i class="ph ${typeInfo.icon}"></i>
          <p>Preview not available for this file type</p>
          <button class="btn btn-primary btn-sm" style="margin-top: var(--space-4);">
            <i class="ph ph-download-simple"></i> Download
          </button>
        </div>
      `;
    }
    
    const sharedList = document.getElementById('previewSharedList');
    if (file.sharedWith && file.sharedWith.length > 0) {
      sharedList.innerHTML = file.sharedWith.map(email => `
        <div class="preview-shared-item">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random&size=32" class="preview-shared-avatar" alt="">
          <div class="preview-shared-info">
            <div class="preview-shared-name">${this.escapeHtml(email)}</div>
            <div class="preview-shared-role">${file.permission === 'edit' ? 'Can edit' : 'Can view'}</div>
          </div>
        </div>
      `).join('');
    } else {
      sharedList.innerHTML = '<p style="font-size: var(--text-sm); color: var(--gray-500);">Not shared</p>';
    }
    
    this.openModal('previewModal');
  }

  // --- Context Menu ---

  showContextMenu(event, id, type) {
    event.preventDefault();
    this.contextMenuTarget = { id, type };
    
    const menu = document.getElementById('contextMenu');
    const x = Math.min(event.clientX, window.innerWidth - 220);
    const y = Math.min(event.clientY, window.innerHeight - 300);
    
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.add('show');
    
    const isTrash = this.currentTab === 'trash';
    menu.querySelectorAll('.context-item').forEach(item => {
      const action = item.dataset.action;
      if (isTrash) {
        item.style.display = (action === 'delete' || action === 'open') ? 'none' : 'flex';
        if (action === 'delete') {
          item.innerHTML = '<i class="ph ph-trash"></i><span>Delete Permanently</span>';
          item.classList.add('danger');
        }
      } else {
        item.style.display = 'flex';
        if (action === 'delete') {
          item.innerHTML = '<i class="ph ph-trash"></i><span>Move to Trash</span>';
        }
      }
    });
  }

  hideContextMenu() {
    document.getElementById('contextMenu').classList.remove('show');
    this.contextMenuTarget = null;
  }

  handleContextAction(action) {
    if (!this.contextMenuTarget) return;
    const { id, type } = this.contextMenuTarget;
    
    switch (action) {
      case 'open':
        if (type === 'folder') this.openFolder(id);
        else this.previewFile(id);
        break;
      case 'preview':
        this.previewFile(id);
        break;
      case 'share':
        this.shareTarget = id;
        this.openModal('shareModal');
        break;
      case 'download':
        this.showToast('Download started', 'success');
        break;
      case 'rename':
        const item = type === 'folder' 
          ? this.getFolders().find(f => f.id === id)
          : this.getFiles().find(f => f.id === id);
        if (item) {
          document.getElementById('renameInput').value = item.name;
          this.renameTarget = { id, type };
          this.openModal('renameModal');
        }
        break;
      case 'copy':
        this.showToast('Copied to clipboard', 'success');
        break;
      case 'move':
        this.renderMoveTree();
        this.moveTargets = [id];
        this.openModal('moveModal');
        break;
      case 'star':
        this.toggleStar(id, type);
        this.showToast(type === 'folder' ? 'Folder starred' : 'File starred', 'success');
        break;
      case 'delete':
        if (this.currentTab === 'trash') {
          this.permanentlyDelete([id]);
        } else {
          this.deleteItems([id]);
        }
        break;
    }
    
    this.hideContextMenu();
  }

  // --- Modals ---

  openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    const modal = document.getElementById(modalId);
    modal.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    modal.querySelectorAll('.upload-progress-item').forEach(item => item.remove());
  }

  renderMoveTree() {
    const tree = document.getElementById('moveFolderTree');
    const folders = this.getFolders().filter(f => f.id !== this.currentFolder);
    
    let html = `
      <div class="folder-tree-item selected" data-folder="root">
        <i class="ph ph-house"></i>
        <span>My Files (Root)</span>
      </div>
    `;
    
    folders.forEach(folder => {
      html += `
        <div class="folder-tree-item" data-folder="${folder.id}">
          <i class="ph ph-folder"></i>
          <span>${this.escapeHtml(folder.name)}</span>
        </div>
      `;
    });
    
    tree.innerHTML = html;
    
    let selectedFolder = 'root';
    tree.querySelectorAll('.folder-tree-item').forEach(item => {
      item.addEventListener('click', () => {
        tree.querySelectorAll('.folder-tree-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        selectedFolder = item.dataset.folder;
      });
    });
    
    document.getElementById('confirmMove').onclick = () => {
      if (this.moveTargets) {
        this.moveItems(this.moveTargets, selectedFolder);
        this.closeModal('moveModal');
        this.moveTargets = null;
      }
    };
  }

  // --- Event Bindings ---

  bindEvents() {
    // Tabs
    document.querySelectorAll('.files-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.files-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.currentPage = 1;
        this.selectedItems.clear();
        this.render();
      });
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentView = btn.dataset.view;
        this.saveSettings();
        this.render();
      });
    });

    // Select all
    document.getElementById('selectAll').addEventListener('change', (e) => {
      this.selectAll(e.target.checked);
    });

    // Toolbar actions
    document.querySelectorAll('.toolbar-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const ids = Array.from(this.selectedItems);
        
        if (ids.length === 0) return;
        
        switch (action) {
          case 'move':
            this.renderMoveTree();
            this.moveTargets = ids;
            this.openModal('moveModal');
            break;
          case 'copy':
            this.showToast('Copied to clipboard', 'success');
            break;
          case 'share':
            if (ids.length === 1) {
              this.shareTarget = ids[0];
              this.openModal('shareModal');
            } else {
              this.showToast('Please select only one file to share', 'warning');
            }
            break;
          case 'download':
            this.showToast('Download started', 'success');
            break;
          case 'delete':
            this.deleteTargets = ids;
            document.getElementById('deleteMessage').textContent = 
              `${ids.length} item(s) will be moved to trash. You can restore them later.`;
            this.openModal('deleteModal');
            break;
          case 'rename':
            if (ids.length === 1) {
              const file = this.getFiles().find(f => f.id === ids[0]);
              const folder = this.getFolders().find(f => f.id === ids[0]);
              const item = file || folder;
              if (item) {
                document.getElementById('renameInput').value = item.name;
                this.renameTarget = { id: ids[0], type: file ? 'file' : 'folder' };
                this.openModal('renameModal');
              }
            } else {
              this.showToast('Please select only one item to rename', 'warning');
            }
            break;
        }
      });
    });

    // Sort dropdown
    document.getElementById('sortBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('sortMenu').classList.toggle('show');
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentSort = item.dataset.sort;
        document.getElementById('sortBtn').querySelector('span').textContent = `Sort by: ${item.textContent}`;
        document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('sortMenu').classList.remove('show');
        this.saveSettings();
        this.render();
      });
    });

    // Page size
    document.getElementById('pageSize').addEventListener('change', (e) => {
      this.pageSize = parseInt(e.target.value);
      this.currentPage = 1;
      this.saveSettings();
      this.render();
    });

    // Search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.render();
    });

    // Upload button
    document.getElementById('uploadBtn').addEventListener('click', () => {
      this.openModal('uploadModal');
    });

    // Quick actions
    document.getElementById('quickUpload').addEventListener('click', () => {
      this.openModal('uploadModal');
    });

    document.getElementById('quickFolder').addEventListener('click', () => {
      this.openModal('newFolderModal');
    });

    document.getElementById('quickShare').addEventListener('click', () => {
      this.showToast('Select a file to share', 'warning');
    });

    document.getElementById('quickRequest').addEventListener('click', () => {
      this.showToast('File request feature coming soon', 'warning');
    });

    document.getElementById('quickTrash').addEventListener('click', () => {
      document.querySelectorAll('.files-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('[data-tab="trash"]').classList.add('active');
      this.currentTab = 'trash';
      this.currentPage = 1;
      this.selectedItems.clear();
      this.render();
    });

    document.getElementById('quickSettings').addEventListener('click', () => {
      this.showToast('Storage settings coming soon', 'warning');
    });

    // New folder button
    document.getElementById('newFolderBtn').addEventListener('click', () => {
      this.openModal('newFolderModal');
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal || btn.closest('.modal-overlay').id;
        this.closeModal(modalId);
      });
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay.id);
        }
      });
    });

    // Create folder
    document.getElementById('createFolderBtn').addEventListener('click', () => {
      const name = document.getElementById('folderNameInput').value.trim();
      if (!name) {
        this.showToast('Please enter a folder name', 'error');
        return;
      }
      this.createFolder(name, this.currentFolder);
      this.closeModal('newFolderModal');
    });

    // Confirm rename
    document.getElementById('confirmRename').addEventListener('click', () => {
      const name = document.getElementById('renameInput').value.trim();
      if (!name) {
        this.showToast('Please enter a name', 'error');
        return;
      }
      if (this.renameTarget) {
        this.renameItem(this.renameTarget.id, this.renameTarget.type, name);
        this.closeModal('renameModal');
        this.renameTarget = null;
      }
    });

    // Confirm share
    document.getElementById('confirmShare').addEventListener('click', () => {
      const emails = document.getElementById('shareEmailInput').value.trim();
      if (!emails) {
        this.showToast('Please enter at least one email', 'error');
        return;
      }
      const permission = document.querySelector('input[name="permission"]:checked').value;
      if (this.shareTarget) {
        this.shareFile(this.shareTarget, emails, permission);
        this.closeModal('shareModal');
        this.shareTarget = null;
      }
    });

    // Confirm delete
    document.getElementById('confirmDelete').addEventListener('click', () => {
      if (this.deleteTargets) {
        this.deleteItems(this.deleteTargets);
        this.closeModal('deleteModal');
        this.deleteTargets = null;
      } else if (this.contextMenuTarget) {
        this.deleteItems([this.contextMenuTarget.id]);
        this.closeModal('deleteModal');
      }
    });

    // Upload dropzone
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('fileInput');

    dropzone.addEventListener('click', () => fileInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.simulateUpload(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.simulateUpload(e.target.files);
      }
    });

    document.getElementById('confirmUpload').addEventListener('click', () => {
      const list = document.getElementById('uploadProgressList');
      if (list.children.length === 0) {
        this.showToast('Please select files to upload', 'warning');
      }
    });

    // Context menu actions
    document.querySelectorAll('.context-item').forEach(item => {
      item.addEventListener('click', () => {
        this.handleContextAction(item.dataset.action);
      });
    });

    // Hide context menu on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.context-menu')) {
        this.hideContextMenu();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch').focus();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          this.closeModal(modal.id);
        });
        this.hideContextMenu();
      }
      
      // Delete key
      if (e.key === 'Delete' && this.selectedItems.size > 0) {
        this.deleteTargets = Array.from(this.selectedItems);
        document.getElementById('deleteMessage').textContent = 
          `${this.selectedItems.size} item(s) will be moved to trash. You can restore them later.`;
        this.openModal('deleteModal');
      }
    });

    // Sidebar toggle (mobile)
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.getElementById('appSidebar').classList.toggle('open');
    });

    // Theme toggle
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      if (window.OP && window.OP.theme) {
        window.OP.theme.toggle();
      }
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const icon = document.getElementById('themeIcon');
      const label = document.querySelector('.theme-toggle-btn span');
      if (icon) icon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
      if (label) label.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    });

    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.sort-dropdown')) {
        document.getElementById('sortMenu').classList.remove('show');
      }
    });
  }
}

// ============================================
// Initialize
// ============================================
let fileManager;

document.addEventListener('DOMContentLoaded', () => {
  fileManager = new FileManager();
});