import json
import os
from pathlib import Path

base = Path(r"c:\Users\speed\Desktop\OnePlace Enterprise")
api_file = base / 'js' / 'api-integration.js'
app_file = base / 'js' / 'app.js'

summary = {
    'files': [],
    'public_apis': [],
    'findings': [],
    'errors': []
}

if not api_file.exists():
    summary['errors'].append('api-integration.js is missing')
if not app_file.exists():
    summary['errors'].append('app.js is missing')

summary['files'] = ['js/app.js', 'js/api-integration.js', 'docs/API_INTEGRATION.md']

with api_file.open('r', encoding='utf-8') as f:
    api_text = f.read()
with app_file.open('r', encoding='utf-8') as f:
    app_text = f.read()

for api_name in ['window.OP.api', 'window.OP.apiAuth', 'window.OP.authApi', 'window.OP.http', 'window.OP.cache', 'window.OP.queue', 'window.OP.config']:
    if api_name not in api_text and api_name not in app_text:
        summary['errors'].append(f'{api_name} not found in source files')
    else:
        summary['public_apis'].append(api_name)

# Initialization checks
if 'if (window.OP && window.OP.apiLoaded) return;' not in app_text:
    summary['findings'].append('App loader missing single-init guard for API layer')
else:
    summary['findings'].append('API loader has single-init guard')

if 'window.OP.apiInstance' not in api_text:
    summary['errors'].append('API instance singleton marker missing')
else:
    summary['findings'].append('API instance singleton marker present')

# Event listener duplicates
online_count = app_text.count("addEventListener('online'") + app_text.count('addEventListener("online"') + api_text.count("addEventListener('online'") + api_text.count('addEventListener("online"')
offline_count = app_text.count("addEventListener('offline'") + app_text.count('addEventListener("offline"') + api_text.count("addEventListener('offline'") + api_text.count('addEventListener("offline"')
if online_count > 1:
    summary['findings'].append(f'Online listener count: {online_count} (expected 1 or 0)')
else:
    summary['findings'].append(f'Online listener count: {online_count}')
if offline_count > 1:
    summary['findings'].append(f'Offline listener count: {offline_count} (expected 1 or 0)')
else:
    summary['findings'].append(f'Offline listener count: {offline_count}')

# Request cancellation
if 'cancel(requestId)' in api_text and 'this.abortControllers' in api_text:
    summary['findings'].append('Request cancellation implementation exists')
else:
    summary['errors'].append('Request cancellation implementation missing')

# Deduplication
if 'dedupe' in api_text and 'this.inFlight' in api_text:
    summary['findings'].append('Request deduplication implementation exists')
else:
    summary['errors'].append('Request deduplication implementation missing')

# Retry manager
if 'class RetryManager' in api_text and 'getDelay' in api_text and 'attempt' in api_text:
    summary['findings'].append('Retry manager implementation exists')
else:
    summary['errors'].append('Retry manager implementation missing')

# Cache manager
if 'class CacheManager' in api_text and 'memoryCache' in api_text and 'set' in api_text and 'get' in api_text:
    summary['findings'].append('Cache manager implementation exists')
else:
    summary['errors'].append('Cache manager implementation missing')

# Offline queue
if 'class OfflineQueue' in api_text and 'class RequestQueue' in api_text:
    summary['findings'].append('Offline queue implementation exists')
else:
    summary['errors'].append('Offline queue implementation missing')

# Config manager
if 'class ConfigManager' in api_text and 'setEnvironment' in api_text and 'getBaseUrl' in api_text:
    summary['findings'].append('Config manager implementation exists')
else:
    summary['errors'].append('Config manager implementation missing')

# Logger
if 'class Logger' in api_text and 'debug' in api_text and 'warn' in api_text and 'error' in api_text:
    summary['findings'].append('Logger implementation exists')
else:
    summary['errors'].append('Logger implementation missing')

# Error manager
if 'class ErrorManager' in api_text and 'normalize(error)' in api_text and 'shouldRetry' in api_text:
    summary['findings'].append('Error manager implementation exists')
else:
    summary['errors'].append('Error manager implementation missing')

# Existing auth preservation
if 'window.OP.authLegacy' in api_text or 'window.OP.auth = new Proxy' in api_text:
    summary['findings'].append('Existing window.OP.auth preservation logic exists')
else:
    summary['errors'].append('Existing window.OP.auth preservation logic missing')

# Additional sanity
if 'window.OP.apiLoaded = true' in app_text:
    summary['findings'].append('API loader flag set in app.js')
else:
    summary['errors'].append('API loader flag missing in app.js')

with open(base / 'scripts' / 'api_integration_audit_results.json', 'w', encoding='utf-8') as out:
    json.dump(summary, out, indent=2)
print(json.dumps(summary, indent=2))
