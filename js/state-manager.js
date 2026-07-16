/* OnePlace Enterprise — State Manager
   Centralized frontend state with LocalStorage adapter and event bus.
*/
(function(){
  if (!window.OP) window.OP = {};
  if (window.OP.stateInstance) return;

  const SCHEMA_VERSION = 2;
  const BACKUP_KEY = 'op_state_backup';
  const MODULE_KEY_PREFIX = 'op_';
  const DEFAULT_MODULES = [
    'user','workspace','authentication','theme','language','notifications','billing','subscription',
    'crm','contacts','messages','inbox','calendar','tasks','files','reports','ai','integrations','team',
    'search','onboarding','settings','analytics','automation'
  ];

  const EVENT_MAP = {
    user:'user:updated', workspace:'workspace:updated', crm:'crm:updated', calendar:'calendar:updated',
    task:'task:updated', tasks:'task:updated', notification:'notification:added', notifications:'notification:added',
    billing:'billing:updated', theme:'theme:changed', search:'search:updated', settings:'settings:updated',
    automation:'automation:updated'
  };

  class LocalStorageAdapter {
    constructor(){ this.type='localStorage'; }

    getKey(module){ return module.startsWith(MODULE_KEY_PREFIX) ? module : `${MODULE_KEY_PREFIX}${module}`; }

    get(module){
      const key = this.getKey(module);
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      try { return JSON.parse(raw); } catch (e) { throw new Error('CORRUPTED_JSON'); }
    }

    set(module, value){
      const key = this.getKey(module);
      const payload = JSON.stringify(value);
      try { localStorage.setItem(key, payload); return true; } catch (err) { throw new Error('STORAGE_QUOTA'); }
    }

    remove(module){ localStorage.removeItem(this.getKey(module)); }
    clear(){ DEFAULT_MODULES.forEach(m=>localStorage.removeItem(this.getKey(m))); localStorage.removeItem(BACKUP_KEY); }
    keys(){ return Object.keys(localStorage).filter(k=>k.startsWith(MODULE_KEY_PREFIX)); }
    export(){ const result={version:SCHEMA_VERSION, exportedAt:new Date().toISOString(), modules:{}}; this.keys().forEach(k=>{ try{ result.modules[k]=JSON.parse(localStorage.getItem(k)); }catch(e){ result.modules[k]=null; }}); return result; }
    import(state){ if (!state || typeof state !== 'object' || !state.modules) throw new Error('INVALID_STATE'); Object.keys(state.modules).forEach(k=>{ if (state.modules[k] !== null) localStorage.setItem(k, JSON.stringify(state.modules[k])); }); }
    backup(data){ localStorage.setItem(BACKUP_KEY, JSON.stringify({createdAt:new Date().toISOString(), state:data})); }
    restore(){ try { return JSON.parse(localStorage.getItem(BACKUP_KEY)); } catch { return null; } }
  }

  class RemoteStorageAdapter {
    constructor(endpoint){ this.type='remoteStorage'; this.endpoint = endpoint; }
    get(module){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    set(module,value){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    remove(module){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    clear(){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    keys(){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    export(){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    import(state){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    backup(data){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
    restore(){ throw new Error('REMOTE_ADAPTER_NOT_IMPLEMENTED'); }
  }

  class StateManager {
    constructor(){
      if (window.OP.stateInstance) return window.OP.stateInstance;
      this.adapter = new LocalStorageAdapter();
      this.cache = {};
      this.eventListeners = new Map();
      this.pendingWrites = new Map();
      this.flushTimer = null;
      this.initialized = false;
      this.version = SCHEMA_VERSION;
      window.OP.stateInstance = this;
    }

    init(){
      if (this.initialized) return;
      this.initialized = true;
      this._loadAllModules();
      this.migrate();
      this.emit('state:changed',{source:'init'});
    }

    get(module){
      const key = this._normalize(module);
      if (this.cache[key]) return this.cache[key].data;
      const stored = this._safeRead(key);
      if (!stored) return null;
      this.cache[key] = stored;
      return stored.data;
    }

    set(module,data){
      const key = this._normalize(module);
      const payload = this._wrapPayload(data);
      this.cache[key] = payload;
      this._scheduleWrite(key,payload);
      this.emit('state:changed',{module:key});
      this._emitModuleEvent(key,'updated');
      return payload;
    }

    update(module, callback){
      const key = this._normalize(module);
      const current = this.get(key) || {};
      const updated = callback(Object.assign({}, current)) || current;
      return this.set(key, updated);
    }

    remove(module){
      const key = this._normalize(module);
      delete this.cache[key];
      this.adapter.remove(key);
      this.emit('state:changed',{module:key, action:'remove'});
      this._emitModuleEvent(key,'removed');
    }

    clear(module){ this.remove(module); }

    clearAll(){
      this.cache = {};
      this.adapter.clear();
      this.emit('state:changed',{action:'clearAll'});
    }

    exists(module){ const key = this._normalize(module); return this.get(key) !== null; }

    export(){ return this.adapter.export(); }

    import(state){ this.validateStatePayload(state); this.adapter.import(state); this.cache = {}; this._loadAllModules(); this.emit('state:changed',{action:'import'}); }

    backup(){ const snapshot = this.export(); this.adapter.backup(snapshot); return snapshot; }

    restore(){ const backup = this.adapter.restore(); if (!backup || !backup.state) return null; this.import(backup.state); return backup; }

    validate(){
      const invalid = [];
      this.adapter.keys().forEach(key=>{
        const value = this._safeRead(key);
        if (!value || !this._isValidSchema(value)) invalid.push(key);
      });
      return {valid: invalid.length===0, invalid};
    }

    migrate(){
      const migrated = [];
      this.adapter.keys().forEach(key=>{
        const item = this._safeRead(key);
        if (!item) return;
        if (!item.version){
          const migratedItem = {version:1,updatedAt:new Date().toISOString(),data:item};
          this.adapter.set(key,migratedItem);
          this.cache[key] = migratedItem;
          migrated.push(key);
        }
        if (item.version < this.version){
          const migratedItem = this._migratePayload(item);
          this.adapter.set(key,migratedItem);
          this.cache[key] = migratedItem;
          migrated.push(key);
        }
      });
      if (migrated.length) this.emit('state:migrated',{modules:migrated});
    }

    getVersion(){ return this.version; }

    setAdapter(adapter){ if (!adapter || typeof adapter.get !== 'function') throw new Error('INVALID_ADAPTER'); this.adapter = adapter; this.cache = {}; this.initialized=false; this.init(); }

    getAdapter(){ return this.adapter; }

    subscribe(event, callback){ if (!event||typeof callback!=='function') return; const listeners=this.eventListeners.get(event)||new Set(); listeners.add(callback); this.eventListeners.set(event,listeners); }

    unsubscribe(event, callback){ const listeners=this.eventListeners.get(event); if (!listeners) return; listeners.delete(callback); }

    emit(event,payload){ const listeners=this.eventListeners.get(event); if (listeners){ listeners.forEach(fn=>{ try{ fn(payload); }catch(e){} }); } }

    _normalize(module){ if (!module) throw new Error('MISSING_MODULE'); return module.toString().trim().toLowerCase().replace(/^op_/, ''); }

    _wrapPayload(data){ return {version:this.version, updatedAt:new Date().toISOString(), data: data===undefined ? null : data}; }

    _loadAllModules(){
      DEFAULT_MODULES.forEach(module=>{
        const key = this._normalize(module);
        const stored = this._safeRead(key);
        if (stored) this.cache[key] = stored;
      });
    }

    _safeRead(key){
      try {
        const raw = this.adapter.get(key);
        if (!raw) return null;
        if (!this._isValidSchema(raw)) return this._recoverSchema(raw,key);
        return raw;
      } catch (err){
        if (err.message==='CORRUPTED_JSON'){
          localStorage.removeItem(this.adapter.getKey ? this.adapter.getKey(key): key);
          return null;
        }
        return null;
      }
    }

    _isValidSchema(payload){ return payload && typeof payload==='object' && typeof payload.version==='number' && typeof payload.updatedAt==='string' && ('data' in payload); }

    _recoverSchema(payload,key){
      const recovered = {version:1, updatedAt:new Date().toISOString(), data:payload};
      this.adapter.set(key,recovered);
      return recovered;
    }

    _migratePayload(payload){
      if (!payload || !payload.version) return this._wrapPayload(payload);
      if (payload.version === 1) {
        return {version:this.version, updatedAt:new Date().toISOString(), data:payload.data};
      }
      return payload;
    }

    _scheduleWrite(key,payload){
      this.pendingWrites.set(key,payload);
      if (this.flushTimer) clearTimeout(this.flushTimer);
      this.flushTimer = setTimeout(()=>{
        this.pendingWrites.forEach((value,module)=>{ try{ this.adapter.set(module,value); }catch(e){} });
        this.pendingWrites.clear();
      },120);
    }

    validateStatePayload(state){ if (!state || typeof state !== 'object' || !state.modules) throw new Error('INVALID_STATE'); }

    _emitModuleEvent(key, action){
      const moduleName = this._normalize(key);
      const event = EVENT_MAP[moduleName] || `${moduleName}:updated`;
      this.emit(event,{module:moduleName, action});
    }
  }

  const state = new StateManager();
  window.OP.state = {
    init: ()=>state.init(), get: (m)=>state.get(m), set:(m,d)=>state.set(m,d), update:(m,cb)=>state.update(m,cb),
    remove:(m)=>state.remove(m), clear:(m)=>state.clear(m), clearAll:()=>state.clearAll(), exists:(m)=>state.exists(m),
    export:()=>state.export(), import:(s)=>state.import(s), backup:()=>state.backup(), restore:()=>state.restore(), validate:()=>state.validate(),
    migrate:()=>state.migrate(), getVersion:()=>state.getVersion(), setAdapter:(a)=>state.setAdapter(a), getAdapter:()=>state.getAdapter(),
    subscribe:(e,c)=>state.subscribe(e,c), unsubscribe:(e,c)=>state.unsubscribe(e,c), emit:(e,p)=>state.emit(e,p),
    _internal: state
  };
})();
