import os, re
root = r'c:\Users\speed\Desktop\OnePlace Enterprise'
for dirpath, _, files in os.walk(root):
    for f in files:
        if not f.endswith('.html'):
            continue
        p = os.path.join(dirpath, f)
        try:
            text = open(p, encoding='utf-8').read()
        except Exception:
            continue
        if not re.search(r'<nav|<aside|sidebar|help-sidebar', text, re.I):
            continue
        if 'nav-item' not in text and 'sidebar-item' not in text and 'help-sidebar-link' not in text:
            continue
        if all(k in text for k in ['../support/index.html','../notifications/notifications.html','../search/index.html','../files/index.html','../billing/index.html']):
            continue
        print(p)
