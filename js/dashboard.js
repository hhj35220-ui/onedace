/**
 * OnePlace Enterprise v3.0 — Dashboard Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Brand Icons (inline SVG — real platform logos)
// ============================================
const OP_BRAND_PATHS = {
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  instagram: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  x: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
};

const OP_BRAND_COLORS = {
  gmail: '#EA4335',
  whatsapp: '#25D366',
  instagram: '#E4405F',
  tiktok: '#000000',
  x: '#000000',
  linkedin: '#0A66C2'
};

let opGradientCounter = 0;

/**
 * Returns an inline SVG string for a platform brand icon.
 * variant 'glyph' → brand-colored (or multicolor) logo on transparent bg
 * variant 'tile'  → white glyph on brand-colored rounded square
 */
function opBrandIcon(platform, variant = 'glyph', size = 20) {
  const p = platform === 'twitter' ? 'x' : platform;

  if (p === 'gmail') {
    // Multicolor Gmail "M" envelope
    return `<svg class="brand-svg brand-gmail" width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Gmail"><path fill="#4CAF50" d="M45 16.2l-5 2.75-5 4.75V40h7c1.657 0 3-1.343 3-3V16.2z"/><path fill="#1E88E5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"/><polygon fill="#E53935" points="35 11.2 24 19.45 13 11.2 12 17 13 23.7 24 31.95 35 23.7 36 17"/><path fill="#C62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8h-.298C4.668 8 3 9.668 3 12.298z"/><path fill="#FBC02D" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8h.298C43.332 8 45 9.668 45 12.298z"/></svg>`;
  }

  const path = OP_BRAND_PATHS[p];
  if (!path) return '';

  if (p === 'instagram') {
    opGradientCounter++;
    const gid = `op-ig-grad-${opGradientCounter}`;
    if (variant === 'tile') {
      return `<svg class="brand-svg brand-instagram" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Instagram"><defs><linearGradient id="${gid}" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#FD5"/><stop offset=".5" stop-color="#FF543E"/><stop offset="1" stop-color="#C837AB"/></linearGradient></defs><rect width="24" height="24" rx="5.5" fill="url(#${gid})"/><g fill="#fff"><path d="M12 7.2c-2.65 0-4.8 2.15-4.8 4.8s2.15 4.8 4.8 4.8 4.8-2.15 4.8-4.8-2.15-4.8-4.8-4.8zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2z"/><circle cx="16.9" cy="7.1" r="1.15"/></g></svg>`;
    }
    return `<svg class="brand-svg brand-instagram" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Instagram"><defs><linearGradient id="${gid}" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#FD5"/><stop offset=".5" stop-color="#FF543E"/><stop offset="1" stop-color="#C837AB"/></linearGradient></defs><rect width="24" height="24" rx="5.5" fill="url(#${gid})"/><g fill="#fff"><path d="M12 7.2c-2.65 0-4.8 2.15-4.8 4.8s2.15 4.8 4.8 4.8 4.8-2.15 4.8-4.8-2.15-4.8-4.8-4.8zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2z"/><circle cx="16.9" cy="7.1" r="1.15"/></g></svg>`;
  }

  if (p === 'linkedin') {
    // LinkedIn glyph already includes the rounded square
    return `<svg class="brand-svg brand-linkedin" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="LinkedIn"><path fill="#0A66C2" d="${path}"/></svg>`;
  }

  if (variant === 'tile') {
    const bg = OP_BRAND_COLORS[p] || '#111827';
    return `<svg class="brand-svg brand-${p}" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="${p}"><rect width="24" height="24" rx="5.5" fill="${bg}"/><g transform="translate(3.6 3.6) scale(0.7)"><path fill="#fff" d="${path}"/></g></svg>`;
  }

  const color = OP_BRAND_COLORS[p] || '#111827';
  return `<svg class="brand-svg brand-${p}" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="${p}"><path fill="${color}" d="${path}"/></svg>`;
}

// ============================================
// Seeded PRNG (deterministic demo data)
// ============================================
function opMulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================
// Dashboard App
// ============================================
class DashboardApp {
  constructor() {
    this.storage = new DashboardStorage();
    this.currentFilter = 'all';
    this.currentSearch = '';
    this.sidebarOpen = false;
    this.init();
  }

  init() {
    this.renderSidebar();
    this.renderHeader();
    this.bindEvents();
  }

  // ============================================
  // Sidebar Rendering (matches design mockup)
  // ============================================
  renderSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    const session = OP.auth.getSession();
    const userName = session?.fullName || 'Sophia Moore';
    const userRole = 'Admin';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    let currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'main-dashboard';
    const searchParams = new URLSearchParams(window.location.search);
    const selectedPlatform = searchParams.get('platform');

    const stats = this.storage.getPlatformStats();
    const totalMessages = Object.values(stats).reduce((sum, s) => sum + (s.messages || 0), 0);

    const platforms = [
      { id: 'gmail', label: 'Gmail' },
      { id: 'whatsapp', label: 'WhatsApp Business' },
      { id: 'instagram', label: 'Instagram' },
      { id: 'tiktok', label: 'TikTok' },
      { id: 'x', label: 'X (Twitter)' },
      { id: 'linkedin', label: 'LinkedIn' }
    ];

    let html = `
      <div class="sidebar-header">
        <a href="../index.html" class="logo">
          <div class="logo-mark"><i class="ph ph-chat-centered-text"></i></div>
          <div class="logo-text">
            <span class="logo-brand">OnePlace</span>
            <span class="logo-sub">Enterprise</span>
          </div>
        </a>
      </div>
      <nav class="sidebar-nav" aria-label="Dashboard navigation">
        <div class="sidebar-section">
          <a href="../dashboard/main-dashboard.html" class="sidebar-item ${currentPage === 'main-dashboard' ? 'active' : ''}" data-page="main-dashboard">
            <i class="ph ph-squares-four"></i>
            <span>Dashboard</span>
          </a>
          <a href="../inbox/unified-inbox.html" class="sidebar-item ${currentPage === 'unified-inbox' && !selectedPlatform ? 'active' : ''}" data-page="unified-inbox">
            <i class="ph ph-inbox"></i>
            <span>All Inbox</span>
            <span class="sidebar-badge">${totalMessages}</span>
          </a>
          <a href="../inbox/unified-inbox.html?filter=all" class="sidebar-item" data-page="conversations">
            <i class="ph ph-chat-circle-text"></i>
            <span>Conversations</span>
          </a>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Platforms</div>
    `;

    platforms.forEach(p => {
      const unread = stats[p.id]?.unread || 0;
      const isPlatformActive = currentPage === 'unified-inbox' && selectedPlatform === p.id;
      html += `
        <a href="../inbox/unified-inbox.html?platform=${p.id}" class="sidebar-item sidebar-platform ${isPlatformActive ? 'active' : ''}" data-page="${p.id}">
          <span class="sidebar-brand-icon">${opBrandIcon(p.id, 'tile', 20)}</span>
          <span>${p.label}</span>
          <span class="sidebar-badge">${unread}</span>
        </a>
      `;
    });

    html += `
        </div>
        <div class="sidebar-section">
          <a href="../crm/contacts.html" class="sidebar-item" data-page="crm">
            <i class="ph ph-users"></i>
            <span>CRM</span>
          </a>
          <a href="../ai/index.html" class="sidebar-item" data-page="ai-assistant">
            <i class="ph ph-sparkle"></i>
            <span>AI Assistant</span>
          </a>
          <a href="../reports/index.html" class="sidebar-item" data-page="reports">
            <i class="ph ph-chart-bar"></i>
            <span>Reports</span>
          </a>
          <a href="../settings/profile.html" class="sidebar-item" data-page="settings">
            <i class="ph ph-gear"></i>
            <span>Settings</span>
          </a>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <img class="sidebar-user-photo" src="https://randomuser.me/api/portraits/women/44.jpg" alt="${userName}"
               onerror="this.outerHTML='<div class=&quot;sidebar-user-avatar&quot;>${initials}</div>'">
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${userName}</div>
            <div class="sidebar-user-role">${userRole}</div>
          </div>
          <button class="sidebar-user-menu" aria-label="Account menu"><i class="ph ph-dots-three-vertical"></i></button>
        </div>
      </div>
    `;

    sidebar.innerHTML = html;

    sidebar.querySelector('.sidebar-user-menu')?.addEventListener('click', () => {
      if (confirm('Sign out of OnePlace Enterprise?')) {
        OP.auth.signOut();
        window.location.href = '../auth/signin.html';
      }
    });
  }

  // ============================================
  // Header — design has no top bar; mobile keeps
  // the floating toggle button from the page HTML
  // ============================================
  renderHeader() {
    const header = document.querySelector('.dashboard-header');
    if (header) header.remove();
  }

  // ============================================
  // Event Binding
  // ============================================
  bindEvents() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.sidebarOpen = !this.sidebarOpen;
        sidebar?.classList.toggle('open', this.sidebarOpen);
        overlay?.classList.toggle('active', this.sidebarOpen);
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.sidebarOpen = false;
        sidebar?.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        if (filter) {
          this.currentFilter = filter;
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.handleFilter();
        }
      });
    });
  }

  handleSearch() {
    const event = new CustomEvent('dashboard:search', { detail: this.currentSearch });
    document.dispatchEvent(event);
  }

  handleFilter() {
    const event = new CustomEvent('dashboard:filter', { detail: this.currentFilter });
    document.dispatchEvent(event);
  }

  // ============================================
  // Chart Helpers
  // ============================================
  createDonutChart(containerId, data, totalLabel, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<div class="chart-empty">No chart data available.</div>';
      return;
    }

    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total <= 0) {
      container.innerHTML = '<div class="chart-empty">No chart data available.</div>';
      return;
    }

    const size = opts.size || 168;
    const stroke = opts.stroke || 24;
    const cx = size / 2, cy = size / 2, r = (size - stroke) / 2 - 2;
    const circumference = 2 * Math.PI * r;

    let offset = 0;
    let rings = '';
    data.forEach(d => {
      const frac = d.value / total;
      const len = Math.max(frac * circumference - 2, 0.5);
      rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${stroke}"
        stroke-dasharray="${len} ${circumference - len}" stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`;
      offset += frac * circumference;
    });

    const legend = data.map(d => {
      const percent = Math.round((d.value / total) * 100);
      const valueText = opts.showCounts
        ? `${d.value.toLocaleString()} (${percent}%)`
        : `${percent}%`;
      return `
        <div class="donut-legend-item">
          <span class="donut-legend-dot" style="background: ${d.color}"></span>
          <span class="donut-legend-label">${d.label}</span>
          <span class="donut-legend-value">${valueText}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="donut-chart-container">
        <div class="donut-visual" style="width:${size}px;height:${size}px;">
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${rings}</svg>
          <div class="donut-chart-center">
            <div class="donut-chart-value">${total.toLocaleString()}</div>
            <div class="donut-chart-label">${totalLabel}</div>
          </div>
        </div>
        <div class="donut-legend">${legend}</div>
      </div>
    `;
  }

  createLineChart(containerId, data, platforms, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const colors = opts.colors || {
      gmail: '#EA4335',
      whatsapp: '#25D366',
      instagram: '#E4405F',
      tiktok: '#111827',
      x: '#1DA1F2',
      linkedin: '#0A66C2'
    };
    const names = opts.names || {
      gmail: 'Gmail', whatsapp: 'WhatsApp', instagram: 'Instagram',
      tiktok: 'TikTok', x: 'X (Twitter)', linkedin: 'LinkedIn'
    };

    const width = container.clientWidth || 600;
    const height = opts.height || 220;
    const padding = { top: 14, right: 14, bottom: 28, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.flatMap(d => platforms.map(p => d[p] || 0)), 1);
    const niceMax = Math.ceil(maxValue / 100) * 100 || maxValue;

    let svgHtml = `<svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(niceMax * (1 - i / 4));
      svgHtml += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--gray-200)" stroke-dasharray="4" stroke-width="1"/>`;
      svgHtml += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--gray-400)">${val}</text>`;
    }

    // X axis labels
    const stepX = chartWidth / Math.max(data.length - 1, 1);
    data.forEach((d, i) => {
      const x = padding.left + i * stepX;
      svgHtml += `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--gray-400)">${d.date}</text>`;
    });

    // Smooth lines + dots
    platforms.forEach(platform => {
      const color = colors[platform];
      const pts = data.map((d, i) => ({
        x: padding.left + i * stepX,
        y: padding.top + chartHeight - ((d[platform] || 0) / niceMax) * chartHeight
      }));

      let pathD = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1], p1 = pts[i];
        const mx = (p0.x + p1.x) / 2;
        pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
      }
      svgHtml += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`;
      pts.forEach(pt => {
        svgHtml += `<circle cx="${pt.x}" cy="${pt.y}" r="2.6" fill="${color}" stroke="white" stroke-width="1.5"/>`;
      });
    });

    svgHtml += '</svg>';

    const legend = platforms.map(p => `
      <span class="chart-legend-item"><span class="chart-legend-dot" style="background:${colors[p]}"></span>${names[p]}</span>
    `).join('');

    container.innerHTML = `${svgHtml}<div class="chart-legend">${legend}</div>`;
  }

  createAreaChart(containerId, data, platforms, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const colors = opts.colors || {
      linkedin: '#3B82F6', x: '#14B8A6', whatsapp: '#22C55E',
      instagram: '#EC4899', tiktok: '#6366F1', gmail: '#A855F7'
    };
    const names = opts.names || {
      gmail: 'Gmail', whatsapp: 'WhatsApp', instagram: 'Instagram',
      tiktok: 'TikTok', x: 'X (Twitter)', linkedin: 'LinkedIn'
    };

    const width = container.clientWidth || 600;
    const height = opts.height || 220;
    const padding = { top: 14, right: 14, bottom: 28, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Stack order: first platform at the bottom
    const totals = data.map(d => platforms.reduce((s, p) => s + (d[p] || 0), 0));
    const maxTotal = Math.max(...totals, 1);
    const niceMax = Math.ceil(maxTotal / 1000) * 1000;

    const stepX = chartWidth / Math.max(data.length - 1, 1);
    const yFor = v => padding.top + chartHeight - (v / niceMax) * chartHeight;
    const xFor = i => padding.left + i * stepX;

    let svgHtml = `<svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(niceMax * (1 - i / 4) / 1000);
      svgHtml += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--gray-200)" stroke-dasharray="4" stroke-width="1"/>`;
      svgHtml += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--gray-400)">${val}K</text>`;
    }

    const labelEvery = Math.ceil(data.length / 6);
    data.forEach((d, i) => {
      if (i % labelEvery === 0) {
        svgHtml += `<text x="${xFor(i)}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--gray-400)">${d.date}</text>`;
      }
    });

    // Stacked layers
    let baseline = data.map(() => 0);
    platforms.forEach(platform => {
      const top = baseline.map((b, i) => b + (data[i][platform] || 0));
      const topPts = top.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`);
      const basePts = baseline.map((v, i) => `L ${xFor(i)} ${yFor(v)}`).reverse();
      const pathD = `${topPts.join(' ')} ${basePts.join(' ')} Z`;
      svgHtml += `<path d="${pathD}" fill="${colors[platform]}" opacity="0.85"/>`;
      baseline = top;
    });

    svgHtml += '</svg>';

    const legend = platforms.map(p => `
      <span class="chart-legend-item"><span class="chart-legend-dot" style="background:${colors[p]}"></span>${names[p]}</span>
    `).join('');

    container.innerHTML = `${svgHtml}<div class="chart-legend">${legend}</div>`;
  }

  createBarChart(containerId, data, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const trackHeight = opts.trackHeight || 150;

    let html = `<div class="bar-chart-container" style="height:auto;">`;
    data.forEach(d => {
      const heightPct = Math.max((d.value / maxValue) * 100, 6);
      const display = d.display !== undefined ? d.display : d.value;
      const icon = d.platform ? opBrandIcon(d.platform, 'glyph', 22) : '';
      html += `
        <div class="bar-chart-item">
          <span class="bar-chart-value">${display}</span>
          <div class="bar-chart-track" style="height:${trackHeight}px;">
            <div class="bar-chart-bar ${d.platform || ''}" style="height: ${heightPct}%; ${d.color ? `background:${d.color};` : ''}"></div>
          </div>
          <span class="bar-chart-icon">${icon || `<span class="bar-chart-label">${d.label}</span>`}</span>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // ============================================
  // Utility
  // ============================================
  formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatClockTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  getPlatformColor(platform) {
    return OP_BRAND_COLORS[platform] || '#6366f1';
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

  brandIcon(platform, variant = 'glyph', size = 20) {
    return opBrandIcon(platform, variant, size);
  }
}

// Initialize dashboard app
window.DashboardApp = DashboardApp;
window.opBrandIcon = opBrandIcon;