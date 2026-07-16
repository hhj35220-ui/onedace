# OnePlace Enterprise — State & Local Storage Standardization

## Overview
This document describes the centralized frontend state manager for OnePlace Enterprise.

## Files
- `/js/state-manager.js` — centralized state manager with adapter pattern and event bus.
- `/js/app.js` — loads `state-manager.js` globally.

## Public API
`window.OP.state` exposes:
- `init()`
- `get(module)`
- `set(module, data)`
- `update(module, callback)`
- `remove(module)`
- `clear(module)`
- `clearAll()`
- `exists(module)`
- `export()`
- `import()`
- `backup()`
- `restore()`
- `validate()`
- `migrate()`
- `getVersion()`
- `setAdapter(adapter)`
- `getAdapter()`
- `subscribe(event, callback)`
- `unsubscribe(event, callback)`
- `emit(event, payload)`

## Storage Schema
Each module payload is stored as:
```
{
  version: <number>,
  updatedAt: <ISO timestamp>,
  data: <any>
}
```
Keys are namespaced with `op_`, e.g. `op_user`, `op_calendar`, `op_tasks`.

## Adapter Architecture
Default adapter: `LocalStorageAdapter`.
Future adapters can implement the same methods:
- `get(module)`
- `set(module, value)`
- `remove(module)`
- `clear()`
- `keys()`
- `export()`
- `import(state)`
- `backup(data)`
- `restore()`

Use `window.OP.state.setAdapter(newAdapter)` to swap adapters without changing APIs.

## Event Bus
Supported events:
- `state:changed`
- `state:migrated`
- `user:updated`
- `workspace:updated`
- `crm:updated`
- `calendar:updated`
- `task:updated`
- `notification:added`
- `billing:updated`
- `theme:changed`
- `search:updated`
- `settings:updated`
- `automation:updated`

## Versioning
Global schema version: 2.
Module payloads are migrated automatically if version mismatch is detected.

## Migration
When `init()` runs, the manager loads modules, validates schema, and migrates legacy payloads.
Migration logs are emitted via `state:migrated`.

## Performance
- In-memory cache minimizes repeated storage reads.
- Writes are debounced and batched (120ms).
- Validation prevents repeated invalid writes.

## Backend Compatibility
The adapter pattern allows LocalStorage to be replaced with remote storage without changing the public API.

## Notes
The manager is initialized once from `app.js` and does not modify HTML pages.
