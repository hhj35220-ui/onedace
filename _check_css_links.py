import os, re
root = r'c:\Users\speed\Desktop\OnePlace Enterprise'
html_files = []
for dirpath, _, files in os.walk(root):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(dirpath, f))

for html_path in sorted(html_files):
    try:
        text = open(html_path, encoding='utf-8').read()
    except Exception:
        continue
    for match in re.finditer(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', text, re.I):
        href = match.group(1)
        if href.startswith(('http://','https://','data:','mailto:')):
            continue
        path = href.split('#')[0].split('?')[0]
        resolved = os.path.normpath(os.path.join(os.path.dirname(html_path), path))
        if not os.path.exists(resolved):
            print(os.path.relpath(html_path, root), '->', href, '=>', os.path.relpath(resolved, root))
