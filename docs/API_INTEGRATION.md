# OnePlace Enterprise — API Integration Layer

## Files modified
- `OnePlace Enterprise/js/app.js`
- `OnePlace Enterprise/js/api-integration.js`
- `OnePlace Enterprise/docs/API_INTEGRATION.md`

## Public APIs
- `window.OP.api`
- `window.OP.auth`
- `window.OP.http`
- `window.OP.cache`
- `window.OP.queue`
- `window.OP.config`

## Service architecture
- `ConfigManager` — environment, base URLs, feature flags, backend toggle, persistent API config
- `EnvironmentManager` — runtime environment detection and host/origin metadata
- `Logger` — debug/info/warn/error logging with environment awareness
- `ErrorManager` — normalization of network and HTTP errors, retry eligibility, offline detection
- `CacheManager` — memory cache, response caching, expiration, invalidation, request deduplication
- `RetryManager` — exponential backoff, retry count, retry orchestration
- `RequestQueue` — persistent offline request queue stored in `localStorage`
- `OfflineQueue` — online/offline event handling, queue recovery, automatic processing
- `AuthService` — JWT/bearer/API key/OAuth token support, token persistence, refresh flow stub, logout
- `HTTPService` — fetch wrapper, request/response/error interceptors, cancellation, timeout handling
- `APIClient` — centralized request methods, endpoint group scaffolding, request pipeline, cache integration, offline queue integration

## Request lifecycle
1. `window.OP.api.init()` initializes config, auth, HTTP service, offline queue, and default interceptors.
2. A request enters through `APIClient.request()`.
3. If backend is disabled, the request rejects immediately with a warning.
4. GET requests may return cached responses from `CacheManager`.
5. Requests are deduplicated using `CacheManager.dedupe()`.
6. `HTTPService` applies request interceptors, then performs a `fetch()`.
7. On success, response interceptors run and successful GET responses are cached.
8. On failure, error interceptors normalize and reject errors.
9. Offline or retryable failures enqueue requests to `OfflineQueue`.

## Authentication flow
- `AuthService` persists auth tokens in `localStorage` under `op_api_auth_tokens`.
- Supports bearer tokens, JWT, refresh tokens, API keys, OAuth tokens in a unified payload.
- `HTTPService` adds auth headers automatically via request interceptors.
- When a 401 occurs, `ErrorManager` flags it and the default error interceptor triggers `AuthService.refreshTokenIfNeeded()`.
- Refresh logic is stubbed with a delayed token refresh simulation.
- `AuthService.signOut()` clears tokens and emits a logout event.

## Cache strategy
- `CacheManager` provides memory-only caching.
- Keys are generated from method, URL, params, and body.
- Expiration is supported via TTL.
- In-flight deduplication prevents duplicate concurrent requests.
- Invalidating cache clears specific entries or all data.

## Offline strategy
- `RequestQueue` persists queued requests in `localStorage` under `op_api_request_queue`.
- Requests can queue while offline.
- `OfflineQueue` listens for `online` and `offline` browser events.
- When connectivity returns, queued requests are replayed automatically.
- Failed queued requests remain until recoverable or manually cleared.

## Retry strategy
- `RetryManager` performs exponential backoff delays between attempts.
- Retry eligibility is decided by `ErrorManager` for statuses `429, 500, 502, 503, 504` and transient network/timeouts.
- Retry count is configurable via environment config.

## Error handling
- Handles network errors, request timeouts, offline conditions, and HTTP statuses `401, 403, 404, 409, 422, 429, 500, 503`.
- Errors are normalized into a consistent shape with `code`, `status`, `message`, `retryable`, `offline`, and `timeout`.
- Graceful recovery continues background queue processing after connectivity returns.

## Backend migration plan
1. Enable backend mode by calling `window.OP.config.enableBackend()`.
2. Wire modules to use `window.OP.api` endpoint groups and request methods.
3. Preserve existing Local Storage logic until new backend integration is completed.
4. Gradually replace `localStorage`-based persistence with backend endpoints and keep fallback support during migration.
5. Use `window.OP.queue` to ensure offline-capable write operations remain safe.
6. Extend `APIClient.endpointGroups` with concrete backend path mappings.

## Notes
- The API layer is loaded lazily from `app.js`.
- Existing frontend Local Storage behavior is not modified.
- The layer initializes only once and exposes a production-ready architecture for future backend integration.
