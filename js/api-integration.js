/* OnePlace Enterprise — API Integration Layer
   Centralized API architecture for backend-ready enterprise services.
*/
(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.apiInstance) return;

  const STORAGE_KEYS = {
    API_QUEUE: 'op_api_request_queue',
    AUTH_TOKENS: 'op_api_auth_tokens',
    API_CONFIG: 'op_api_config'
  };

  const DEFAULT_CONFIG = {
    environments: {
      development: { name: 'development', baseUrl: '/api', timeout: 15000, retryCount: 3, debug: true },
      testing: { name: 'testing', baseUrl: '/api/test', timeout: 15000, retryCount: 3, debug: true },
      production: { name: 'production', baseUrl: '/api', timeout: 15000, retryCount: 3, debug: false }
    },
    environment: 'development',
    backendEnabled: false,
    defaultTimeout: 15000,
    maxRetryAttempts: 3,
    cacheTTL: 300000,
    requestBatchWindow: 30,
    maxConcurrentRequests: 8,
    featureFlags: {},
    endpointGroups: [
      'authentication','users','organizations','crm','inbox','messages','files','notifications',
      'calendar','tasks','reports','ai','billing','payments','integrations','search','automation','settings'
    ]
  };

  function createUuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  class ConfigManager {
    constructor() {
      this.settings = Object.assign({}, DEFAULT_CONFIG);
      this.environment = this.settings.environment;
      this.config = Object.assign({}, this.settings.environments[this.environment]);
      this.featureFlags = Object.assign({}, this.settings.featureFlags);
      this.backendEnabled = this.settings.backendEnabled;
      this.queueKey = STORAGE_KEYS.API_QUEUE;
      this.authKey = STORAGE_KEYS.AUTH_TOKENS;
    }

    init() {
      this._loadPersistentConfig();
      this.setEnvironment(this.environment);
    }

    _loadPersistentConfig() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEYS.API_CONFIG);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          if (parsed.environment) this.environment = parsed.environment;
          if (parsed.backendEnabled !== undefined) this.backendEnabled = parsed.backendEnabled;
          if (parsed.featureFlags) this.featureFlags = Object.assign(this.featureFlags, parsed.featureFlags);
        }
      } catch (err) {
        // If parse fails, ignore and continue with defaults.
      }
    }

    persist() {
      try {
        window.localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify({
          environment: this.environment,
          backendEnabled: this.backendEnabled,
          featureFlags: this.featureFlags
        }));
      } catch (err) {
        // ignore persistence failures
      }
    }

    setEnvironment(environment) {
      if (!this.settings.environments[environment]) {
        environment = this._detectEnvironment();
      }
      this.environment = environment;
      this.config = Object.assign({}, this.settings.environments[this.environment]);
      this.persist();
      return this;
    }

    _detectEnvironment() {
      const hostname = window.location.hostname || 'localhost';
      if (hostname === 'localhost' || hostname === '127.0.0.1') return 'development';
      if (hostname.includes('staging') || hostname.includes('test')) return 'testing';
      return 'production';
    }

    getEnvironment() {
      return this.environment;
    }

    getBaseUrl() {
      return this.config.baseUrl;
    }

    isBackendEnabled() {
      return !!this.backendEnabled;
    }

    enableBackend() {
      this.backendEnabled = true;
      this.persist();
      return this;
    }

    disableBackend() {
      this.backendEnabled = false;
      this.persist();
      return this;
    }

    getTimeout() {
      return this.config.timeout || this.settings.defaultTimeout;
    }

    getRetryCount() {
      return this.config.retryCount || this.settings.maxRetryAttempts;
    }

    getFeatureFlag(key) {
      return Boolean(this.featureFlags[key]);
    }

    setFeatureFlag(key, enabled) {
      this.featureFlags[key] = !!enabled;
      this.persist();
      return this;
    }

    getEndpointGroups() {
      return Array.from(this.settings.endpointGroups);
    }
  }

  class EnvironmentManager {
    constructor(config) {
      this.config = config;
      this.environment = config.getEnvironment();
      this.host = window.location.hostname || 'localhost';
      this.origin = window.location.origin || '';
    }

    isProduction() {
      return this.environment === 'production';
    }

    isTesting() {
      return this.environment === 'testing';
    }

    isDevelopment() {
      return this.environment === 'development';
    }

    getRuntimeInfo() {
      return {
        environment: this.environment,
        host: this.host,
        origin: this.origin,
        online: navigator.onLine
      };
    }
  }

  class Logger {
    constructor(config) {
      this.config = config;
      this.enabled = !config.isProduction();
      this.prefix = '[OP.API]';
    }

    _format(args) {
      return [this.prefix, ...args];
    }

    debug(...args) {
      if (!this.enabled) return;
      console.debug(...this._format(args));
    }

    info(...args) {
      if (!this.enabled) return;
      console.info(...this._format(args));
    }

    warn(...args) {
      if (!this.enabled) return;
      console.warn(...this._format(args));
    }

    error(...args) {
      console.error(...this._format(args));
    }
  }

  class ErrorManager {
    constructor(config, logger) {
      this.config = config;
      this.logger = logger;
    }

    normalize(error) {
      const normalized = {
        code: 'UNKNOWN_ERROR',
        status: null,
        message: 'An unknown error occurred.',
        detail: null,
        retryable: false,
        offline: false,
        timeout: false
      };

      if (!error) return normalized;

      if (error instanceof Response) {
        normalized.status = error.status;
        normalized.retryable = this._isRetryableStatus(error.status);
        normalized.message = error.statusText || `HTTP ${error.status}`;
        normalized.code = `HTTP_${error.status}`;
        if (error.status >= 500) normalized.detail = 'Server error. Try again later.';
        if (error.status === 401) normalized.message = 'Authentication required.';
        if (error.status === 403) normalized.message = 'Access forbidden.';
        if (error.status === 404) normalized.message = 'Resource not found.';
        if (error.status === 429) normalized.message = 'Rate limit exceeded.';
        return normalized;
      }

      if (error instanceof Error) {
        normalized.message = error.message || normalized.message;
        if (error.name === 'AbortError') {
          normalized.code = 'REQUEST_ABORTED';
          normalized.timeout = true;
          normalized.retryable = false;
        }
        if (error.message && /timeout/i.test(error.message)) {
          normalized.timeout = true;
          normalized.retryable = true;
          normalized.code = 'TIMEOUT';
        }
        if (error.message && /network/i.test(error.message)) {
          normalized.offline = true;
          normalized.retryable = true;
          normalized.code = 'NETWORK_ERROR';
        }
        return normalized;
      }

      if (typeof error === 'object' && error !== null) {
        normalized.status = error.status || null;
        normalized.message = error.message || normalized.message;
        normalized.detail = error.detail || null;
        normalized.code = error.code || normalized.code;
        normalized.retryable = !!error.retryable || this._isRetryableStatus(normalized.status);
        if (normalized.status === 401) normalized.code = 'UNAUTHORIZED';
        return normalized;
      }

      return normalized;
    }

    _isRetryableStatus(status) {
      return [429, 500, 502, 503, 504].includes(status);
    }

    shouldRetry(error, attempt) {
      const normalized = this.normalize(error);
      if (normalized.offline || normalized.retryable) {
        return attempt < this.config.getRetryCount();
      }
      return false;
    }
  }

  class CacheManager {
    constructor(config, logger) {
      this.config = config;
      this.logger = logger;
      this.memoryCache = new Map();
      this.inFlight = new Map();
    }

    makeCacheKey(request) {
      const url = request.url || '';
      const method = (request.method || 'GET').toUpperCase();
      const params = request.params ? JSON.stringify(request.params) : '';
      const body = request.body ? JSON.stringify(request.body) : '';
      return `${method}:${url}:${params}:${body}`;
    }

    get(request) {
      const key = this.makeCacheKey(request);
      const item = this.memoryCache.get(key);
      if (!item) return null;
      if (item.expiresAt && item.expiresAt < Date.now()) {
        this.memoryCache.delete(key);
        return null;
      }
      return item.value;
    }

    set(request, value, ttl = this.config.cacheTTL) {
      const key = this.makeCacheKey(request);
      const expiresAt = Date.now() + ttl;
      this.memoryCache.set(key, { value, expiresAt });
      this.logger.debug('Cache set', key, value);
      return key;
    }

    invalidate(request) {
      const key = this.makeCacheKey(request);
      this.memoryCache.delete(key);
      this.logger.debug('Cache invalidated', key);
    }

    clear() {
      this.memoryCache.clear();
      this.logger.debug('Cache cleared');
    }

    dedupe(request, createRequest) {
      const key = this.makeCacheKey(request);
      if (this.inFlight.has(key)) {
        this.logger.debug('Returning deduped in-flight request', key);
        return this.inFlight.get(key);
      }
      const promise = Promise.resolve().then(() => createRequest());
      this.inFlight.set(key, promise);
      promise.finally(() => this.inFlight.delete(key));
      return promise;
    }
  }

  class RetryManager {
    constructor(config, logger) {
      this.config = config;
      this.logger = logger;
      this.baseDelay = 400;
      this.maxDelay = 30000;
    }

    getDelay(attempt) {
      const delay = Math.min(this.baseDelay * Math.pow(2, attempt), this.maxDelay);
      this.logger.debug('Retry delay for attempt', attempt, delay);
      return delay;
    }

    async attempt(fn, shouldRetryFn) {
      let attempt = 0;
      while (true) {
        try {
          return await fn();
        } catch (error) {
          attempt += 1;
          if (!shouldRetryFn(error, attempt) || attempt > this.config.getRetryCount()) {
            throw error;
          }
          const delay = this.getDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          this.logger.warn('Retrying request after delay', attempt, delay);
        }
      }
    }
  }

  class RequestQueue {
    constructor(config, errorManager, logger) {
      this.config = config;
      this.errorManager = errorManager;
      this.logger = logger;
      this.storageKey = config.queueKey;
      this.queue = [];
      this.isProcessing = false;
      this._loadQueue();
    }

    _loadQueue() {
      try {
        const raw = window.localStorage.getItem(this.storageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.queue = parsed;
        }
      } catch (err) {
        this.logger.warn('Unable to load offline queue from storage', err);
      }
    }

    _persistQueue() {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
      } catch (err) {
        this.logger.warn('Unable to persist offline queue', err);
      }
    }

    enqueue(requestConfig) {
      const item = {
        id: createUuid(),
        createdAt: new Date().toISOString(),
        request: Object.assign({}, requestConfig)
      };
      this.queue.push(item);
      this._persistQueue();
      this.logger.info('Queued offline request', item.id, item.request.url);
      return item.id;
    }

    dequeue(requestId) {
      const index = this.queue.findIndex(item => item.id === requestId);
      if (index === -1) return null;
      const [item] = this.queue.splice(index, 1);
      this._persistQueue();
      this.logger.info('Dequeued request', requestId);
      return item;
    }

    peek() {
      return this.queue.length ? this.queue[0] : null;
    }

    clear() {
      this.queue = [];
      this._persistQueue();
      this.logger.info('Offline queue cleared');
    }

    hasPending() {
      return this.queue.length > 0;
    }

    async process(processor) {
      if (this.isProcessing || !this.hasPending()) return;
      this.isProcessing = true;
      this.logger.info('Processing offline queue', this.queue.length);
      while (this.queue.length) {
        const item = this.peek();
        try {
          await processor(item.request);
          this.dequeue(item.id);
        } catch (error) {
          const normalized = this.errorManager.normalize(error);
          if (normalized.offline || normalized.timeout || normalized.retryable) {
            this.logger.warn('Offline queue processing paused due to network/error', normalized);
            break;
          }
          this.logger.error('Failed to process queued request', item.id, normalized);
          this.dequeue(item.id);
        }
      }
      this.isProcessing = false;
    }
  }

  class OfflineQueue {
    constructor(requestQueue, config, logger) {
      this.requestQueue = requestQueue;
      this.config = config;
      this.logger = logger;
      this.online = navigator.onLine;
      this.started = false;
      this.resumeHandler = this._handleOnline.bind(this);
      this.pauseHandler = this._handleOffline.bind(this);
    }

    init() {
      if (this.started) return;
      window.addEventListener('online', this.resumeHandler);
      window.addEventListener('offline', this.pauseHandler);
      this.started = true;
      if (navigator.onLine && this.requestQueue.hasPending()) {
        this.requestQueue.process(request => window.OP.api._executeRequest(request));
      }
    }

    _handleOnline() {
      this.online = true;
      this.logger.info('Browser returned online, resuming queued requests');
      if (this.requestQueue.hasPending()) {
        this.requestQueue.process(request => window.OP.api._executeRequest(request));
      }
    }

    _handleOffline() {
      this.online = false;
      this.logger.warn('Browser is offline, switching to offline queue mode');
    }

    enqueue(requestConfig) {
      return this.requestQueue.enqueue(requestConfig);
    }

    getPending() {
      return this.requestQueue.queue.slice();
    }

    clear() {
      this.requestQueue.clear();
    }
  }

  class AuthService {
    constructor(config, logger, errorManager) {
      this.config = config;
      this.logger = logger;
      this.errorManager = errorManager;
      this.tokens = {
        accessToken: null,
        refreshToken: null,
        tokenType: 'Bearer',
        apiKey: null,
        oauthToken: null,
        expiresAt: null
      };
      this.refreshPromise = null;
      this._loadTokens();
    }

    init() {
      this._loadTokens();
    }

    _loadTokens() {
      try {
        const stored = window.localStorage.getItem(this.config.authKey);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          this.tokens = Object.assign(this.tokens, parsed);
        }
      } catch (err) {
        this.logger.warn('Unable to load auth tokens from storage', err);
      }
    }

    _persistTokens() {
      try {
        window.localStorage.setItem(this.config.authKey, JSON.stringify(this.tokens));
      } catch (err) {
        this.logger.warn('Unable to persist auth tokens', err);
      }
    }

    getAccessToken() {
      return this.tokens.accessToken;
    }

    getRefreshToken() {
      return this.tokens.refreshToken;
    }

    getApiKey() {
      return this.tokens.apiKey;
    }

    getOAuthToken() {
      return this.tokens.oauthToken;
    }

    getAuthHeaders() {
      const headers = {};
      if (this.tokens.apiKey) {
        headers['x-api-key'] = this.tokens.apiKey;
      }
      if (this.tokens.oauthToken) {
        headers.Authorization = `Bearer ${this.tokens.oauthToken}`;
      } else if (this.tokens.accessToken) {
        headers.Authorization = `${this.tokens.tokenType || 'Bearer'} ${this.tokens.accessToken}`;
      }
      return headers;
    }

    isAuthenticated() {
      if (!this.tokens.accessToken) return false;
      if (this.tokens.expiresAt && new Date(this.tokens.expiresAt) <= new Date()) {
        return false;
      }
      return true;
    }

    setTokenPayload(payload) {
      if (!payload || typeof payload !== 'object') return;
      this.tokens = Object.assign(this.tokens, payload);
      if (payload.expiresIn && !payload.expiresAt) {
        const expiresAt = new Date(Date.now() + payload.expiresIn * 1000).toISOString();
        this.tokens.expiresAt = expiresAt;
      }
      this._persistTokens();
      return this.tokens;
    }

    clearTokens() {
      this.tokens = {
        accessToken: null,
        refreshToken: null,
        tokenType: 'Bearer',
        apiKey: null,
        oauthToken: null,
        expiresAt: null
      };
      this._persistTokens();
    }

    refreshTokenIfNeeded() {
      if (!this.tokens.refreshToken) {
        return Promise.resolve(this.tokens);
      }
      if (this.isAuthenticated()) {
        return Promise.resolve(this.tokens);
      }
      if (this.refreshPromise) {
        return this.refreshPromise;
      }
      this.refreshPromise = this._refreshTokenFlow().finally(() => {
        this.refreshPromise = null;
      });
      return this.refreshPromise;
    }

    _refreshTokenFlow() {
      this.logger.info('Starting token refresh flow');
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!this.tokens.refreshToken) {
            const error = new Error('No refresh token available');
            this.logger.error(error);
            reject(error);
            return;
          }
          const refreshed = {
            accessToken: `refreshed-${createUuid()}`,
            tokenType: 'Bearer',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
          };
          this.setTokenPayload(refreshed);
          this.logger.info('Token refresh completed');
          resolve(this.tokens);
        }, 600);
      });
    }

    signOut() {
      this.clearTokens();
      window.dispatchEvent(new CustomEvent('op-api-logged-out'));
    }

    setApiKey(apiKey) {
      this.tokens.apiKey = apiKey;
      this._persistTokens();
      return this.tokens;
    }

    setOAuthToken(token) {
      this.tokens.oauthToken = token;
      this._persistTokens();
      return this.tokens;
    }

    setRefreshToken(refreshToken) {
      this.tokens.refreshToken = refreshToken;
      this._persistTokens();
      return this.tokens;
    }
  }

  class HTTPService {
    constructor(config, auth, errorManager, logger) {
      this.config = config;
      this.auth = auth;
      this.errorManager = errorManager;
      this.logger = logger;
      this.requestInterceptors = [];
      this.responseInterceptors = [];
      this.errorInterceptors = [];
      this.abortControllers = new Map();
      this.defaultHeaders = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    }

    init() {
      this.addRequestInterceptor(this._authInterceptor.bind(this));
      this.addRequestInterceptor(this._loggingRequestInterceptor.bind(this));
      this.addResponseInterceptor(this._loggingResponseInterceptor.bind(this));
      this.addErrorInterceptor(this._loggingErrorInterceptor.bind(this));
    }

    _authInterceptor(request) {
      const headers = Object.assign({}, request.headers || {}, this.auth.getAuthHeaders());
      return Object.assign({}, request, { headers });
    }

    _loggingRequestInterceptor(request) {
      this.logger.debug('HTTP request', request.method, request.url, request);
      return request;
    }

    _loggingResponseInterceptor(response) {
      this.logger.debug('HTTP response', response);
      return response;
    }

    _loggingErrorInterceptor(error) {
      const normalized = this.errorManager.normalize(error);
      this.logger.warn('HTTP error intercepted', normalized);
      return Promise.reject(normalized);
    }

    addRequestInterceptor(interceptor) {
      if (typeof interceptor === 'function') {
        this.requestInterceptors.push(interceptor);
      }
    }

    addResponseInterceptor(interceptor) {
      if (typeof interceptor === 'function') {
        this.responseInterceptors.push(interceptor);
      }
    }

    addErrorInterceptor(interceptor) {
      if (typeof interceptor === 'function') {
        this.errorInterceptors.push(interceptor);
      }
    }

    _applyRequestInterceptors(request) {
      return this.requestInterceptors.reduce((acc, interceptor) => interceptor(acc), request);
    }

    _applyResponseInterceptors(response) {
      return this.responseInterceptors.reduce((acc, interceptor) => interceptor(acc), response);
    }

    _applyErrorInterceptors(error) {
      return this.errorInterceptors.reduce((acc, interceptor) => interceptor(acc), error);
    }

    _createAbortSignal(requestId, timeout) {
      const controller = new AbortController();
      this.abortControllers.set(requestId, controller);
      if (timeout > 0) {
        setTimeout(() => {
          if (this.abortControllers.has(requestId)) {
            controller.abort();
            this.logger.warn('Request timed out and was aborted', requestId);
          }
        }, timeout);
      }
      return controller.signal;
    }

    cancel(requestId) {
      const controller = this.abortControllers.get(requestId);
      if (controller) {
        controller.abort();
        this.abortControllers.delete(requestId);
      }
    }

    _buildUrl(url, params) {
      const baseUrl = this.config.getBaseUrl();
      const absolute = /^https?:\/\//i.test(url);
      const requestUrl = absolute ? url : `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
      if (!params || Object.keys(params).length === 0) return requestUrl;
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      return `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${queryString}`;
    }

    async request(options) {
      const requestId = options.requestId || `${options.method || 'GET'}:${options.url}:${createUuid()}`;
      const requestOptions = Object.assign({
        method: 'GET',
        headers: Object.assign({}, this.defaultHeaders, options.headers),
        params: options.params || {},
        body: options.body === undefined ? null : options.body,
        timeout: options.timeout || this.config.getTimeout(),
        requestId,
        credentials: options.credentials || 'same-origin'
      }, options);

      let finalRequest = this._applyRequestInterceptors(requestOptions);
      const url = this._buildUrl(finalRequest.url, finalRequest.params);
      const signal = this._createAbortSignal(requestId, finalRequest.timeout);

      const fetchOptions = {
        method: finalRequest.method.toUpperCase(),
        headers: finalRequest.headers,
        credentials: finalRequest.credentials,
        signal
      };

      if (finalRequest.body !== null && finalRequest.body !== undefined) {
        if (finalRequest.body instanceof FormData || finalRequest.body instanceof Blob) {
          delete fetchOptions.headers['Content-Type'];
          fetchOptions.body = finalRequest.body;
        } else if (typeof finalRequest.body === 'object') {
          fetchOptions.body = JSON.stringify(finalRequest.body);
        } else {
          fetchOptions.body = finalRequest.body;
        }
      }

      try {
        const response = await fetch(url, fetchOptions);
        this.abortControllers.delete(requestId);
        if (!response.ok) {
          const normalizedError = this.errorManager.normalize(response);
          throw normalizedError;
        }
        const contentType = response.headers.get('Content-Type') || '';
        const parsedResponse = contentType.includes('application/json') ? await response.json() : await response.text();
        const result = { status: response.status, headers: response.headers, data: parsedResponse, requestId, url };
        return this._applyResponseInterceptors(result);
      } catch (error) {
        this.abortControllers.delete(requestId);
        const normalized = this.errorManager.normalize(error);
        return this._applyErrorInterceptors(normalized);
      }
    }

    get(url, options = {}) {
      return this.request(Object.assign({}, options, { method: 'GET', url }));
    }

    post(url, body, options = {}) {
      return this.request(Object.assign({}, options, { method: 'POST', url, body }));
    }

    put(url, body, options = {}) {
      return this.request(Object.assign({}, options, { method: 'PUT', url, body }));
    }

    patch(url, body, options = {}) {
      return this.request(Object.assign({}, options, { method: 'PATCH', url, body }));
    }

    delete(url, options = {}) {
      return this.request(Object.assign({}, options, { method: 'DELETE', url }));
    }

    upload(url, file, options = {}) {
      const formData = new FormData();
      formData.append('file', file);
      return this.request(Object.assign({}, options, { method: 'POST', url, body: formData, headers: Object.assign({}, options.headers || {}, { 'Accept': 'application/json' }) }));
    }

    async download(url, options = {}) {
      const requestOptions = Object.assign({}, options, { method: 'GET', url, timeout: options.timeout || this.config.getTimeout() });
      const requestId = requestOptions.requestId || createUuid();
      const signal = this._createAbortSignal(requestId, requestOptions.timeout);
      const fullUrl = this._buildUrl(requestOptions.url, requestOptions.params || {});
      try {
        const response = await fetch(fullUrl, { method: 'GET', headers: requestOptions.headers || {}, signal, credentials: requestOptions.credentials || 'same-origin' });
        this.abortControllers.delete(requestId);
        if (!response.ok) {
          throw this.errorManager.normalize(response);
        }
        const blob = await response.blob();
        return { status: response.status, headers: response.headers, data: blob, requestId, url: fullUrl };
      } catch (error) {
        this.abortControllers.delete(requestId);
        const normalized = this.errorManager.normalize(error);
        return this._applyErrorInterceptors(normalized);
      }
    }
  }

  class APIClient {
    constructor(config, auth, http, cache, queue, retry, offlineQueue, errorManager, logger) {
      this.config = config;
      this.auth = auth;
      this.http = http;
      this.cache = cache;
      this.queue = queue;
      this.retry = retry;
      this.offline = offlineQueue;
      this.errorManager = errorManager;
      this.logger = logger;
      this.initialized = false;
      this.endpointGroups = {};
      this._registerEndpointGroups();
    }

    init() {
      if (this.initialized) return;
      this.initialized = true;
      this.config.init();
      this.auth.init();
      this.http.init();
      this.offline.init();
      this._registerDefaultInterceptors();
      this.logger.info('API client initialized', this.config.getEnvironment());
    }

    _registerEndpointGroups() {
      const groups = this.config.getEndpointGroups();
      groups.forEach(group => {
        this.endpointGroups[group] = {
          list: (params = {}) => this.get(`/${group}`, { params }),
          get: (id, params = {}) => this.get(`/${group}/${id}`, { params }),
          create: (body = {}) => this.post(`/${group}`, body),
          update: (id, body = {}) => this.put(`/${group}/${id}`, body),
          patch: (id, body = {}) => this.patch(`/${group}/${id}`, body),
          remove: (id) => this.delete(`/${group}/${id}`)
        };
      });
    }

    _registerDefaultInterceptors() {
      this.http.addRequestInterceptor(request => {
        if (!this.config.isBackendEnabled()) {
          return request;
        }
        return request;
      });
      this.http.addErrorInterceptor(error => {
        if (error.status === 401) {
          this.logger.warn('Authentication failure detected, triggering refresh');
          return this.auth.refreshTokenIfNeeded().then(() => Promise.reject(error));
        }
        return Promise.reject(error);
      });
    }

    async request(options) {
      if (!this.config.isBackendEnabled()) {
        const message = 'API backend is not connected. Enable the backend before making API requests.';
        this.logger.warn(message);
        return Promise.reject(new Error(message));
      }

      const requestOptions = Object.assign({
        method: 'GET',
        headers: {},
        params: {},
        timeout: this.config.getTimeout(),
        cache: true,
        dedupe: true,
        queueOffline: true
      }, options);

      if (requestOptions.method.toUpperCase() === 'GET' && requestOptions.cache) {
        const cached = this.cache.get(requestOptions);
        if (cached) {
          this.logger.debug('Returning cached response for', requestOptions.url);
          return Promise.resolve(cached);
        }
      }

      if (requestOptions.dedupe) {
        return this.cache.dedupe(requestOptions, () => this._executeRequest(requestOptions));
      }

      return this._executeRequest(requestOptions);
    }

    async _executeRequest(requestOptions) {
      if (!navigator.onLine && requestOptions.queueOffline) {
        const queuedId = this.offline.enqueue(requestOptions);
        return Promise.reject(new Error(`Offline mode: request queued (${queuedId})`));
      }

      const attemptRequest = () => this.http.request(requestOptions);

      try {
        const response = await this.retry.attempt(attemptRequest, (error, attempt) => this.errorManager.shouldRetry(error, attempt));
        if (requestOptions.method.toUpperCase() === 'GET' && requestOptions.cache) {
          this.cache.set(requestOptions, response, requestOptions.ttl);
        }
        return response;
      } catch (error) {
        const normalized = this.errorManager.normalize(error);
        if (normalized.offline && requestOptions.queueOffline) {
          this.offline.enqueue(requestOptions);
        }
        return Promise.reject(normalized);
      }
    }

    get(url, options = {}) {
      return this.request(Object.assign({}, options, { method: 'GET', url }));
    }

    post(url, body, options = {}) {
      return this.request(Object.assign({}, options, { method: 'POST', url, body }));
    }

    put(url, body, options = {}) {
      return this.request(Object.assign({}, options, { method: 'PUT', url, body }));
    }

    patch(url, body, options = {}) {
      return this.request(Object.assign({}, options, { method: 'PATCH', url, body }));
    }

    delete(url, options = {}) {
      return this.request(Object.assign({}, options, { method: 'DELETE', url }));
    }

    upload(url, file, options = {}) {
      return this.request(Object.assign({}, options, { method: 'POST', url, body: file, isUpload: true }));
    }

    download(url, options = {}) {
      return this.request(Object.assign({}, options, { method: 'GET', url, isDownload: true }));
    }

    cancel(requestId) {
      this.http.cancel(requestId);
    }

    isBackendReady() {
      return this.config.isBackendEnabled();
    }
  }

  const config = new ConfigManager();
  const environment = new EnvironmentManager(config);
  const logger = new Logger(config);
  const errorManager = new ErrorManager(config, logger);
  const cache = new CacheManager(config, logger);
  const retry = new RetryManager(config, logger);
  const requestQueue = new RequestQueue(config, errorManager, logger);
  const offlineQueue = new OfflineQueue(requestQueue, config, logger);
  const auth = new AuthService(config, logger, errorManager);
  const http = new HTTPService(config, auth, errorManager, logger);
  const api = new APIClient(config, auth, http, cache, requestQueue, retry, offlineQueue, errorManager, logger);

  window.OP.api = api;
  window.OP.apiAuth = auth;
  window.OP.authApi = auth;

  const legacyAuth = window.OP.auth || null;
  if (legacyAuth && legacyAuth !== auth) {
    window.OP.authLegacy = legacyAuth;
    window.OP.auth = new Proxy(auth, {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        }
        if (legacyAuth && prop in legacyAuth) {
          const value = legacyAuth[prop];
          return typeof value === 'function' ? value.bind(legacyAuth) : value;
        }
        return undefined;
      },
      has(target, prop) {
        return prop in target || (legacyAuth && prop in legacyAuth);
      }
    });
    window.OP.auth.api = auth;
  } else {
    window.OP.auth = auth;
  }

  window.OP.http = http;
  window.OP.cache = cache;
  window.OP.queue = offlineQueue;
  window.OP.config = config;
  window.OP.apiInstance = api;
  window.OP.apiEnvironment = environment;
})();