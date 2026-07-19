from pathlib import Path

root = Path(r'c:\Users\speed\Desktop\OnePlace Enterprise')

# Billing pages
for path in sorted((root / 'billing').glob('*.html')):
    text = path.read_text(encoding='utf-8', errors='ignore')
    if '../support/index.html' in text and '../search/index.html' in text:
        continue
    old = '        <div class="nav-section">\n          <span class="nav-section-label">Settings</span>'
    new = '''        <div class="nav-section">\n          <span class="nav-section-label">More</span>\n          <a href="../support/index.html" class="nav-item"><i class="ph ph-headset"></i><span>Support</span></a>\n          <a href="../billing/index.html" class="nav-item"><i class="ph ph-credit-card"></i><span>Billing</span></a>\n          <a href="../files/index.html" class="nav-item"><i class="ph ph-folder"></i><span>Files</span></a>\n          <a href="../search/index.html" class="nav-item"><i class="ph ph-magnifying-glass"></i><span>Search</span></a>\n          <a href="../notifications/notifications.html" class="nav-item"><i class="ph ph-bell"></i><span>Notifications</span></a>\n          <a href="../workflow/index.html" class="nav-item"><i class="ph ph-flow-arrow"></i><span>Workflow</span></a>\n        </div>\n\n        <div class="nav-section">\n          <span class="nav-section-label">Settings</span>'''
    if old in text:
        text = text.replace(old, new, 1)
        path.write_text(text, encoding='utf-8')

# Settings pages
for path in sorted((root / 'settings').glob('*.html')):
    text = path.read_text(encoding='utf-8', errors='ignore')
    if '../support/' in text and '../notifications/notifications.html' in text and '../billing/' in text:
        continue
    old = '        <div class="nav-section">\n          <span class="nav-section-label">System</span>'
    new = '''        <div class="nav-section">\n          <span class="nav-section-label">Workspace</span>\n          <a href="../support/" class="nav-item"><i class="ph ph-headset"></i><span>Support</span></a>\n          <a href="../calendar/" class="nav-item"><i class="ph ph-calendar"></i><span>Calendar</span></a>\n          <a href="../tasks/" class="nav-item"><i class="ph ph-check-circle"></i><span>Tasks</span></a>\n          <a href="../team/" class="nav-item"><i class="ph ph-users-three"></i><span>Team</span></a>\n          <a href="../workflow/" class="nav-item"><i class="ph ph-git-branch"></i><span>Automation</span></a>\n          <a href="../ai/" class="nav-item"><i class="ph ph-sparkle"></i><span>AI</span></a>\n        </div>\n\n        <div class="nav-section">\n          <span class="nav-section-label">System</span>'''
    if old in text:
        text = text.replace(old, new, 1)
        path.write_text(text, encoding='utf-8')

# CRM pages
for path in sorted((root / 'crm').glob('*.html')):
    text = path.read_text(encoding='utf-8', errors='ignore')
    if '../support/index.html' in text and '../billing/index.html' in text and '../files/index.html' in text:
        continue
    old = '      <div class="sidebar-section">\n        <div class="sidebar-section-title">Settings</div>'
    new = '''      <div class="sidebar-section">\n        <div class="sidebar-section-title">Workspace</div>\n        <a href="../support/index.html" class="sidebar-item"><i class="ph ph-headset"></i><span>Support</span></a>\n        <a href="../billing/index.html" class="sidebar-item"><i class="ph ph-credit-card"></i><span>Billing</span></a>\n        <a href="../files/index.html" class="sidebar-item"><i class="ph ph-folder"></i><span>Files</span></a>\n        <a href="../search/index.html" class="sidebar-item"><i class="ph ph-magnifying-glass"></i><span>Search</span></a>\n        <a href="../notifications/notifications.html" class="sidebar-item"><i class="ph ph-bell"></i><span>Notifications</span></a>\n      </div>\n\n      <div class="sidebar-section">\n        <div class="sidebar-section-title">Settings</div>'''
    if old in text:
        text = text.replace(old, new, 1)
        path.write_text(text, encoding='utf-8')

# Integrations pages
for path in sorted((root / 'integrations').glob('*.html')):
    text = path.read_text(encoding='utf-8', errors='ignore')
    if '../support/index.html' in text and '../billing/index.html' in text and '../search/index.html' in text:
        continue
    old = '        <div class="nav-section">\n          <span class="nav-section-label">Settings</span>'
    new = '''        <div class="nav-section">\n          <span class="nav-section-label">More</span>\n          <a href="../support/index.html" class="nav-item"><i class="ph ph-headset"></i><span>Support</span></a>\n          <a href="../billing/index.html" class="nav-item"><i class="ph ph-credit-card"></i><span>Billing</span></a>\n          <a href="../files/index.html" class="nav-item"><i class="ph ph-folder"></i><span>Files</span></a>\n          <a href="../search/index.html" class="nav-item"><i class="ph ph-magnifying-glass"></i><span>Search</span></a>\n          <a href="../notifications/notifications.html" class="nav-item"><i class="ph ph-bell"></i><span>Notifications</span></a>\n        </div>\n\n        <div class="nav-section">\n          <span class="nav-section-label">Settings</span>'''
    if old in text:
        text = text.replace(old, new, 1)
        path.write_text(text, encoding='utf-8')

# Help pages
for path in sorted((root / 'help').glob('*.html')):
    text = path.read_text(encoding='utf-8', errors='ignore')
    if '../dashboard/main-dashboard.html' in text and '../support/index.html' in text and '../files/index.html' in text:
        continue
    if '</nav>' in text:
        insert = '''        <div class="help-sidebar-section">\n          <div class="help-sidebar-section-title">Workspace</div>\n          <a href="../dashboard/main-dashboard.html" class="help-sidebar-link"><i class="ph ph-squares-four"></i>Dashboard</a>\n          <a href="../support/index.html" class="help-sidebar-link"><i class="ph ph-headset"></i>Support</a>\n          <a href="../billing/index.html" class="help-sidebar-link"><i class="ph ph-credit-card"></i>Billing</a>\n          <a href="../files/index.html" class="help-sidebar-link"><i class="ph ph-folder"></i>Files</a>\n          <a href="../search/index.html" class="help-sidebar-link"><i class="ph ph-magnifying-glass"></i>Search</a>\n          <a href="../notifications/notifications.html" class="help-sidebar-link"><i class="ph ph-bell"></i>Notifications</a>\n        </div>\n\n'''
        text = text.replace('</nav>', insert + '</nav>', 1)
        path.write_text(text, encoding='utf-8')
