/**
 * OnePlace Enterprise v3.0 — Billing & Subscription Module
 * Vanilla JavaScript (ES6+)
 */

// ============================================
// Storage Keys
// ============================================
const BILLING_KEYS = {
  TRIAL_START: 'op_billing_trial_start',
  TRIAL_DURATION: 'op_billing_trial_duration',
  CURRENT_PLAN: 'op_billing_current_plan',
  PLAN_STATUS: 'op_billing_plan_status',
  BILLING_CYCLE: 'op_billing_billing_cycle',
  PAYMENT_METHOD: 'op_billing_payment_method',
  INVOICES: 'op_billing_invoices',
  USAGE: 'op_billing_usage',
  UPGRADE_NOTICES: 'op_billing_upgrade_notices',
  PAYMENT_PROVIDER: 'op_billing_payment_provider',
  NEXT_BILLING_DATE: 'op_billing_next_billing_date'
};

// ============================================
// Default Data
// ============================================
const DEFAULT_INVOICES = [
  { id: 'INV-098', number: 'INV-098', date: '2026-04-25', amount: 29.00, status: 'paid', items: [{ description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 29.00 }] },
  { id: 'INV-099', number: 'INV-099', date: '2026-05-25', amount: 29.00, status: 'paid', items: [{ description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 29.00 }] },
  { id: 'INV-000', number: 'INV-000', date: '2026-06-25', amount: 29.00, status: 'paid', items: [{ description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 29.00 }] },
  { id: 'INV-001', number: 'INV-001', date: '2026-07-25', amount: 29.00, status: 'paid', items: [{ description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 29.00 }] },
  { id: 'INV-002', number: 'INV-002', date: '2026-08-25', amount: 29.00, status: 'upcoming', items: [{ description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 29.00 }] }
];

const DEFAULT_USAGE = {
  integrations: { used: 8, limit: 15, label: 'Connected Apps' },
  teamMembers: { used: 2, limit: 3, label: 'Team Members' },
  messages: { used: 18540, limit: 50000, label: 'Monthly Messages' },
  aiReplies: { used: 2486, limit: Infinity, label: 'AI Replies Generated' },
  automations: { used: 4320, limit: Infinity, label: 'Automation Runs' },
  storage: { used: 3.4, limit: 10, unit: 'GB', label: 'Storage' }
};

// ============================================
// Billing Application
// ============================================
class BillingApp {
  constructor() {
    this.toast = window.OP ? window.OP.toast : new ToastManager();
    this.initStorage();
  }

  // --- Initialize Local Storage ---
  initStorage() {
    const now = new Date();
    const trialStart = new Date(now);
    trialStart.setDate(trialStart.getDate() - 1); // Started yesterday = Day 1 of 14

    if (!localStorage.getItem(BILLING_KEYS.TRIAL_START)) {
      localStorage.setItem(BILLING_KEYS.TRIAL_START, trialStart.toISOString());
      localStorage.setItem(BILLING_KEYS.TRIAL_DURATION, '14');
      localStorage.setItem(BILLING_KEYS.CURRENT_PLAN, 'Starter');
      localStorage.setItem(BILLING_KEYS.PLAN_STATUS, 'trial');
      localStorage.setItem(BILLING_KEYS.BILLING_CYCLE, 'monthly');
      localStorage.setItem(BILLING_KEYS.PAYMENT_PROVIDER, 'Paystack');
      localStorage.setItem(BILLING_KEYS.INVOICES, JSON.stringify(SAMPLE_INVOICES));
      localStorage.setItem(BILLING_KEYS.USAGE, JSON.stringify(SAMPLE_USAGE));
      localStorage.setItem(BILLING_KEYS.NEXT_BILLING_DATE, '2026-08-25');
    }
  }

  // --- Getters ---
  getTrialStart() {
    return new Date(localStorage.getItem(BILLING_KEYS.TRIAL_START));
  }

  getTrialDuration() {
    return parseInt(localStorage.getItem(BILLING_KEYS.TRIAL_DURATION) || '14');
  }

  getTrialEndDate() {
    const start = this.getTrialStart();
    const duration = this.getTrialDuration();
    const end = new Date(start);
    end.setDate(end.getDate() + duration);
    return end;
  }

  getTrialProgress() {
    const start = this.getTrialStart();
    const end = this.getTrialEndDate();
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    const day = Math.floor(elapsed / (1000 * 60 * 60 * 24)) + 1;
    const remaining = this.getTrialDuration() - day + 1;
    const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100));

    return {
      day: Math.min(day, this.getTrialDuration()),
      remaining: Math.max(0, remaining),
      percentage,
      isExpired: now > end
    };
  }

  getCurrentPlan() {
    return localStorage.getItem(BILLING_KEYS.CURRENT_PLAN) || 'Starter';
  }

  getPlanStatus() {
    return localStorage.getItem(BILLING_KEYS.PLAN_STATUS) || 'trial';
  }

  getInvoices() {
    try {
      return JSON.parse(localStorage.getItem(BILLING_KEYS.INVOICES)) || [];
    } catch {
      return [];
    }
  }

  saveInvoices(invoices) {
    localStorage.setItem(BILLING_KEYS.INVOICES, JSON.stringify(invoices));
  }

  getUsage() {
    try {
      return JSON.parse(localStorage.getItem(BILLING_KEYS.USAGE)) || {};
    } catch {
      return {};
    }
  }

  // --- Formatting ---
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  // --- Render Trial Hero ---
  renderTrialHero() {
    const progress = this.getTrialProgress();
    const endDate = this.getTrialEndDate();

    const dayText = document.getElementById('trialDayText');
    const remainingText = document.getElementById('trialRemainingText');
    const progressFill = document.getElementById('trialProgressFill');
    const endDateEl = document.getElementById('trialEndDate');

    if (dayText) dayText.textContent = `Day ${progress.day} of ${this.getTrialDuration()}`;
    if (remainingText) remainingText.textContent = `${progress.remaining} days remaining`;
    if (progressFill) progressFill.style.width = `${progress.percentage}%`;
    if (endDateEl) endDateEl.textContent = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Hide hero if trial expired
    const hero = document.getElementById('trialHero');
    if (hero && progress.isExpired) {
      hero.style.display = 'none';
      this.updatePlanStatus('expired');
    }
  }

  // --- Render Current Subscription ---
  renderCurrentSubscription() {
    const plan = this.getCurrentPlan();
    const status = this.getPlanStatus();
    const progress = this.getTrialProgress();
    const endDate = this.getTrialEndDate();
    const cycle = localStorage.getItem(BILLING_KEYS.BILLING_CYCLE) || 'monthly';

    const planNameEl = document.getElementById('currentPlanName');
    const planStatusEl = document.getElementById('currentPlanStatus');
    const trialEndsEl = document.getElementById('currentTrialEnds');
    const afterTrialEl = document.getElementById('currentAfterTrial');
    const billingCycleEl = document.getElementById('currentBillingCycle');

    if (planNameEl) planNameEl.textContent = plan;

    if (planStatusEl) {
      if (status === 'trial') {
        planStatusEl.textContent = 'Trial Active';
        planStatusEl.className = 'badge badge-success';
      } else if (status === 'active') {
        planStatusEl.textContent = 'Active';
        planStatusEl.className = 'badge badge-success';
      } else if (status === 'expired') {
        planStatusEl.textContent = 'Expired';
        planStatusEl.className = 'badge badge-ghost';
      }
    }

    if (trialEndsEl) {
      const daysLeft = progress.remaining;
      trialEndsEl.innerHTML = `${this.formatDate(endDate)} <span class="sub-value-muted">(${daysLeft} days left)</span>`;
    }

    if (afterTrialEl) {
      const prices = { Starter: 29, Business: 79, Enterprise: 'Custom' };
      const price = prices[plan] || 29;
      afterTrialEl.textContent = typeof price === 'number' ? `$${price} / month` : price;
    }

    if (billingCycleEl) billingCycleEl.textContent = cycle.charAt(0).toUpperCase() + cycle.slice(1);
  }

  // --- Render Usage ---
  renderUsage() {
    const usage = this.getUsage();

    // Update usage list bars
    const usageItems = document.querySelectorAll('.usage-item');
    const usageMap = ['integrations', 'teamMembers', 'messages', 'storage'];
    
    usageItems.forEach((item, index) => {
      const key = usageMap[index];
      if (!key || !usage[key]) return;
      
      const data = usage[key];
      const percentage = data.limit === Infinity ? 0 : Math.min(100, (data.used / data.limit) * 100);
      const fill = item.querySelector('.usage-progress-fill');
      if (fill) fill.style.width = `${percentage}%`;
    });

    // Update stat cards
    const statCards = document.querySelectorAll('.usage-stat-card');
    const statMap = [
      { key: 'integrations', format: v => `${v.used} / ${v.limit}` },
      { key: 'messages', format: v => this.formatNumber(v.used) },
      { key: 'teamMembers', format: v => `${v.used} / ${v.limit}` },
      { key: 'aiReplies', format: v => this.formatNumber(v.used) },
      { key: 'automations', format: v => this.formatNumber(v.used) },
      { key: 'storage', format: v => `${v.used} ${v.unit || ''} / ${v.limit} ${v.unit || ''}` }
    ];

    statCards.forEach((card, index) => {
      const map = statMap[index];
      if (!map || !usage[map.key]) return;
      
      const data = usage[map.key];
      const valueEl = card.querySelector('.usage-stat-value');
      if (valueEl) valueEl.textContent = map.format(data);
    });
  }

  // --- Render Billing History ---
  renderBillingHistory() {
    const tbody = document.getElementById('billingHistoryBody');
    if (!tbody) return;

    const invoices = this.getInvoices();
    tbody.innerHTML = invoices.slice(0, 5).map(inv => `
      <tr>
        <td><span class="invoice-number">${inv.number}</span></td>
        <td>${this.formatDate(inv.date)}</td>
        <td>${this.formatCurrency(inv.amount)}</td>
        <td><span class="invoice-status invoice-${inv.status}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
        <td>
          <button class="invoice-action" aria-label="Download" onclick="billingApp.downloadInvoice('${inv.number}')">
            <i class="ph ph-download-simple"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // ============================================
  // Invoices Page Methods
  // ============================================
  initInvoicesPage() {
    this.renderInvoicesTable();
    this.initInvoiceFilters();
    this.initInvoiceSearch();
    this.initMobileMenu();
    this.initKeyboardShortcuts();
  }

  renderInvoicesTable(filterStatus = 'all', filterYear = 'all', searchQuery = '') {
    const tbody = document.getElementById('invoicesTableBody');
    const countEl = document.getElementById('invoiceCount');
    if (!tbody) return;

    let invoices = this.getInvoices();

    // Apply filters
    if (filterStatus !== 'all') {
      invoices = invoices.filter(inv => inv.status === filterStatus);
    }
    if (filterYear !== 'all') {
      invoices = invoices.filter(inv => inv.date.startsWith(filterYear));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      invoices = invoices.filter(inv => 
        inv.number.toLowerCase().includes(q) ||
        inv.date.includes(q) ||
        inv.amount.toString().includes(q)
      );
    }

    if (countEl) countEl.textContent = `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`;

    if (invoices.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="invoices-empty">
              <div class="invoices-empty-icon"><i class="ph ph-receipt"></i></div>
              <h4>No invoices found</h4>
              <p>Try adjusting your filters or search query.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = invoices.map(inv => `
      <tr>
        <td><input type="checkbox" class="invoice-checkbox-all"></td>
        <td><span class="invoice-number">${inv.number}</span></td>
        <td>${this.formatDate(inv.date)}</td>
        <td>${inv.items[0]?.description || 'Subscription'}</td>
        <td>${this.formatCurrency(inv.amount)}</td>
        <td><span class="invoice-status invoice-${inv.status}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
        <td>
          <button class="invoice-action" aria-label="Download" onclick="billingApp.downloadInvoice('${inv.number}')">
            <i class="ph ph-download-simple"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Update pagination info
    const showingStart = document.getElementById('showingStart');
    const showingEnd = document.getElementById('showingEnd');
    const showingTotal = document.getElementById('showingTotal');
    
    if (showingStart) showingStart.textContent = invoices.length > 0 ? '1' : '0';
    if (showingEnd) showingEnd.textContent = invoices.length;
    if (showingTotal) showingTotal.textContent = invoices.length;
  }

  initInvoiceFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const yearFilter = document.getElementById('yearFilter');

    const applyFilters = () => {
      const status = statusFilter?.value || 'all';
      const year = yearFilter?.value || 'all';
      const search = document.getElementById('invoiceSearch')?.value || '';
      this.renderInvoicesTable(status, year, search);
    };

    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
  }

  initInvoiceSearch() {
    const searchInput = document.getElementById('invoiceSearch');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const status = document.getElementById('statusFilter')?.value || 'all';
        const year = document.getElementById('yearFilter')?.value || 'all';
        this.renderInvoicesTable(status, year, searchInput.value);
      }, 300);
    });
  }

  // --- Plan Management ---
  updatePlanStatus(status) {
    localStorage.setItem(BILLING_KEYS.PLAN_STATUS, status);
    this.renderCurrentSubscription();
  }

  upgradeTo(plan) {
    const plans = {
      starter: { name: 'Starter', price: 29 },
      business: { name: 'Business', price: 79 },
      enterprise: { name: 'Enterprise', price: 'Custom' }
    };

    const selected = plans[plan];
    if (!selected) return;

    localStorage.setItem(BILLING_KEYS.CURRENT_PLAN, selected.name);
    localStorage.setItem(BILLING_KEYS.PLAN_STATUS, 'active');
    
    // Generate new invoice
    const invoices = this.getInvoices();
    const newInvoice = {
      id: `INV-${String(invoices.length).padStart(3, '0')}`,
      number: `INV-${String(invoices.length).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: typeof selected.price === 'number' ? selected.price : 0,
      status: 'upcoming',
      items: [{ description: `${selected.name} Plan - Monthly`, quantity: 1, unitPrice: typeof selected.price === 'number' ? selected.price : 0 }]
    };
    invoices.unshift(newInvoice);
    this.saveInvoices(invoices);

    this.toast.show(`Successfully upgraded to ${selected.name} plan!`, 'success');
    this.closeAllModals();
    this.renderCurrentSubscription();
    this.renderBillingHistory();
  }

  // --- Invoice Management ---
  downloadInvoice(invoiceNumber) {
    const invoices = this.getInvoices();
    const invoice = invoices.find(inv => inv.number === invoiceNumber);
    if (!invoice) {
      this.toast.show('Invoice not found.', 'error');
      return;
    }

    // Generate invoice content
    const content = this.generateInvoicePDF(invoice);
    
    // Create download
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OnePlace-${invoice.number}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.toast.show(`Invoice ${invoiceNumber} downloaded.`, 'success');
  }

  generateInvoicePDF(invoice) {
    const date = this.formatDate(invoice.date);
    return `<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.number}</title>
  <style>
    body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 40px auto; padding: 40px; color: #1f2937; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
    .invoice-title { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
    .invoice-meta { color: #6b7280; margin-bottom: 40px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    th { text-align: left; padding: 12px; background: #f9fafb; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    td { padding: 16px 12px; border-bottom: 1px solid #e5e7eb; }
    .total { display: flex; justify-content: flex-end; font-size: 20px; font-weight: bold; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .status-paid { background: #ecfdf5; color: #047857; }
    .status-upcoming { background: #eef2ff; color: #4338ca; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">OnePlace Enterprise</div>
    <div class="status status-${invoice.status}">${invoice.status.toUpperCase()}</div>
  </div>
  <div class="invoice-title">Invoice ${invoice.number}</div>
  <div class="invoice-meta">
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Billed to:</strong> Alex Morgan</p>
    <p><strong>Email:</strong> alex@oneplace.com</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${item.unitPrice.toFixed(2)}</td>
          <td>$${(item.quantity * item.unitPrice).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="total">Total: $${invoice.amount.toFixed(2)}</div>
  <p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
    Payment processed via Paystack.<br>
    Thank you for using OnePlace Enterprise.
  </p>
</body>
</html>`;
  }

  // --- Payment Method ---
  savePaymentMethod() {
    const cardNumber = document.getElementById('cardNumber')?.value;
    const expiry = document.getElementById('cardExpiry')?.value;
    const cvc = document.getElementById('cardCvc')?.value;
    const name = document.getElementById('cardName')?.value;

    if (!cardNumber || !expiry || !cvc || !name) {
      this.toast.show('Please fill in all card details.', 'error');
      return;
    }

    // Simple validation
    if (cardNumber.replace(/\s/g, '').length < 13) {
      this.toast.show('Please enter a valid card number.', 'error');
      return;
    }

    const paymentMethod = {
      last4: cardNumber.slice(-4),
      expiry,
      name,
      brand: this.detectCardBrand(cardNumber),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(BILLING_KEYS.PAYMENT_METHOD, JSON.stringify(paymentMethod));
    this.toast.show('Payment method updated successfully.', 'success');
    this.closeModal('paymentModal');
  }

  detectCardBrand(number) {
    const clean = number.replace(/\s/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^5[1-5]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'unknown';
  }

  // --- Contact Sales ---
  contactSales() {
    this.showModal('contactModal');
  }

  submitContact() {
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const company = document.getElementById('contactCompany')?.value;
    const message = document.getElementById('contactMessage')?.value;

    if (!name || !email || !message) {
      this.toast.show('Please fill in all required fields.', 'error');
      return;
    }

    // Store contact request
    const contacts = JSON.parse(localStorage.getItem('op_sales_contacts') || '[]');
    contacts.push({
      name, email, company, message,
      date: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('op_sales_contacts', JSON.stringify(contacts));

    this.toast.show('Message sent! Our sales team will contact you shortly.', 'success');
    this.closeModal('contactModal');

    // Clear form
    document.getElementById('contactCompany').value = '';
    document.getElementById('contactMessage').value = '';
  }

  // --- Modal Management ---
  showModal(modalId) {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    
    if (overlay) overlay.classList.add('active');
    if (modal) modal.classList.add('active');
    
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalId) {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    
    if (modal) modal.classList.remove('active');
    
    // Only hide overlay if no other modals are active
    const anyActive = document.querySelector('.modal.active');
    if (!anyActive && overlay) overlay.classList.remove('active');
    
    if (!anyActive) document.body.style.overflow = '';
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  showUpgradeModal() {
    this.showModal('upgradeModal');
  }

  showManageModal() {
    this.showModal('manageModal');
  }

  showPaymentModal() {
    this.showModal('paymentModal');
  }

  // --- Plans Toggle ---
  initPlansToggle() {
    const toggleBtns = document.querySelectorAll('.plans-toggle-btn');
    const priceNumbers = document.querySelectorAll('.plan-price-number');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cycle = btn.dataset.cycle;
        localStorage.setItem(BILLING_KEYS.BILLING_CYCLE, cycle);

        priceNumbers.forEach(el => {
          const price = el.dataset[cycle];
          if (price) {
            el.textContent = price;
            // Animate the change
            el.style.transition = 'opacity 0.2s';
            el.style.opacity = '0';
            setTimeout(() => {
              el.textContent = price;
              el.style.opacity = '1';
            }, 100);
          }
        });
      });
    });
  }

  // --- Modal Plan Selection ---
  initModalPlanSelection() {
    const modalPlans = document.querySelectorAll('.modal-plan');
    modalPlans.forEach(plan => {
      plan.addEventListener('click', () => {
        modalPlans.forEach(p => p.classList.remove('modal-plan-selected'));
        plan.classList.add('modal-plan-selected');
      });
    });
  }

  confirmUpgrade() {
    const selected = document.querySelector('.modal-plan-selected');
    if (!selected) {
      this.toast.show('Please select a plan.', 'warning');
      return;
    }
    const plan = selected.dataset.plan;
    this.upgradeTo(plan);
  }

  // --- Card Input Formatting ---
  initCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');

    if (cardNumber) {
      cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
          if (i > 0 && i % 4 === 0) formatted += ' ';
          formatted += value[i];
        }
        e.target.value = formatted.slice(0, 19);
      });
    }

    if (cardExpiry) {
      cardExpiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
        }
        e.target.value = value;
      });
    }
  }

  // --- Keyboard Shortcuts ---
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  // --- Mobile Menu ---
  initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('appSidebar');
    
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !toggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }
  }

  // --- Search ---
  initSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      // Simple highlight of matching content
      const cards = document.querySelectorAll('.billing-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (query && !text.includes(query)) {
          card.style.opacity = '0.3';
        } else {
          card.style.opacity = '1';
        }
      });
    });
  }

  // --- Initialize ---
  init() {
    this.renderTrialHero();
    this.renderCurrentSubscription();
    this.renderUsage();
    this.renderBillingHistory();
    this.initInvoicesPage();
    this.initPlansToggle();
    this.initModalPlanSelection();
    this.initCardFormatting();
    this.initKeyboardShortcuts();
    this.initMobileMenu();
    this.initSearch();

    // Start trial countdown timer
    setInterval(() => this.renderTrialHero(), 60000); // Update every minute

    // Check for trial expiry
    const progress = this.getTrialProgress();
    if (progress.isExpired && this.getPlanStatus() === 'trial') {
      this.updatePlanStatus('expired');
      this.toast.show('Your trial has expired. Please upgrade to continue.', 'warning', 0);
    }

    console.log('OnePlace Billing Module initialized.');
  }

  // ============================================
  // History Page Methods
  // ============================================
  initHistoryPage() {
    this.renderHistoryTable();
    this.initHistoryFilters();
    this.initMobileMenu();
    this.initKeyboardShortcuts();
  }

  renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    const invoices = this.getInvoices();
    tbody.innerHTML = invoices.map(inv => `
      <tr>
        <td><span class="invoice-number">${inv.number}</span></td>
        <td>${this.formatDate(inv.date)}</td>
        <td>${inv.items[0]?.description || 'Subscription'}</td>
        <td>${this.formatCurrency(inv.amount)}</td>
        <td><span class="invoice-status invoice-${inv.status}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
        <td>
          <button class="invoice-action" onclick="billingApp.downloadInvoice('${inv.number}')">
            <i class="ph ph-download-simple"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  initHistoryFilters() {
    const typeFilter = document.getElementById('historyTypeFilter');
    const statusFilter = document.getElementById('historyStatusFilter');
    const searchInput = document.getElementById('historySearch');

    const applyFilters = () => {
      let invoices = this.getInvoices();
      const type = typeFilter?.value || 'all';
      const status = statusFilter?.value || 'all';
      const query = searchInput?.value.toLowerCase() || '';

      if (status !== 'all') {
        invoices = invoices.filter(inv => inv.status === status);
      }
      if (query) {
        invoices = invoices.filter(inv => 
          inv.number.toLowerCase().includes(query) ||
          inv.date.includes(query)
        );
      }

      const tbody = document.getElementById('historyTableBody');
      const countEl = document.getElementById('historyCount');
      
      if (countEl) countEl.textContent = `${invoices.length} transaction${invoices.length !== 1 ? 's' : ''}`;
      
      if (tbody) {
        tbody.innerHTML = invoices.map(inv => `
          <tr>
            <td><span class="invoice-number">${inv.number}</span></td>
            <td>${this.formatDate(inv.date)}</td>
            <td>${inv.items[0]?.description || 'Subscription'}</td>
            <td>${this.formatCurrency(inv.amount)}</td>
            <td><span class="invoice-status invoice-${inv.status}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
            <td>
              <button class="invoice-action" onclick="billingApp.downloadInvoice('${inv.number}')">
                <i class="ph ph-download-simple"></i>
              </button>
            </td>
          </tr>
        `).join('');
      }
    };

    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 300);
      });
    }
  }

}

// ============================================
// Initialize
const billingApp = new BillingApp();
window.billingApp = billingApp;