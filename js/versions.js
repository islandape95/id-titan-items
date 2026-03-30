// ============================================================
//  VERSION MANAGER  –  shared by all pages
//  Wraps all localStorage access for versioned item sets.
// ============================================================

const VERSIONS_STORE_KEY = 'item_tree_versions_v2';
const BASE_ID = 'base';

const versions = (() => {

  // ── Persistence ────────────────────────────────────────────

  function persist(store) {
    localStorage.setItem(VERSIONS_STORE_KEY, JSON.stringify(store));
  }

  function newId() {
    return 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function deepCopy(x) {
    return JSON.parse(JSON.stringify(x));
  }

  // ── Bootstrap ──────────────────────────────────────────────

  function loadStore() {
    let store = null;

    // Try loading existing store
    try {
      const raw = localStorage.getItem(VERSIONS_STORE_KEY);
      if (raw) store = JSON.parse(raw);
    } catch(e) {}

    // If no valid store, build one (migrating old data if present)
    if (!store || !Array.isArray(store.versions)) {
      store = {
        activeVersionId: BASE_ID,
        versions: [
          { id: BASE_ID, name: 'Base (4.4.3)', createdAt: new Date().toISOString(), isBase: true, items: null }
        ]
      };

      // Migrate old working copy
      try {
        const oldWorking = localStorage.getItem('item_tree_working');
        if (oldWorking) {
          const oldItems = JSON.parse(oldWorking);
          if (Array.isArray(oldItems) && oldItems.length > 0) {
            const migId = newId();
            store.versions.push({
              id: migId,
              name: 'Imported Working Copy',
              createdAt: new Date().toISOString(),
              isBase: false,
              items: deepCopy(oldItems)
            });
            store.activeVersionId = migId;
          }
          localStorage.removeItem('item_tree_working');
          localStorage.removeItem('item_tree_snapshots');
        }
      } catch(e) {}

      persist(store);
    }

    // Ensure Base version always exists
    if (!store.versions.find(v => v.id === BASE_ID)) {
      store.versions.unshift(
        { id: BASE_ID, name: 'Base (4.4.3)', createdAt: new Date().toISOString(), isBase: true, items: null }
      );
      persist(store);
    }

    return store;
  }

  let _store = loadStore();

  // ── Load community versions from manifest ────────────────
  // To add a new shared version:
  //   1. Place the exported .json file in the /versions/ folder
  //   2. Add an entry to /versions/manifest.json:
  //      { "file": "my_version.json", "name": "My Version" }
  //   3. The version will auto-load for all users on next page load

  function loadManifestVersions() {
    return fetch('versions/manifest.json')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(manifest => {
        if (!Array.isArray(manifest) || !manifest.length) return;
        const loads = manifest.map(entry =>
          fetch('versions/' + entry.file)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(data => {
              if (data._format !== 'item-tree-version' || !Array.isArray(data.items)) return;
              const tag = 'manifest:' + entry.file;
              // Skip if already loaded (by tag)
              if (_store.versions.find(v => v._manifestTag === tag)) return;
              const v = create(entry.name || data.name || entry.file, BASE_ID);
              v.items = deepCopy(data.items);
              v._manifestTag = tag;
              persist(_store);
            })
            .catch(() => {})  // silently skip broken files
        );
        return Promise.all(loads);
      })
      .then(() => {
        // Re-render picker if versions were added
        renderPickerDropdown();
      })
      .catch(() => {});  // manifest not found — no-op
  }

  function reload() {
    _store = loadStore();
  }

  // ── Public API ─────────────────────────────────────────────

  function getAll() {
    const base  = _store.versions.filter(v => v.isBase);
    const users = _store.versions.filter(v => !v.isBase)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...base, ...users];
  }

  function getById(id) {
    return _store.versions.find(v => v.id === id) || null;
  }

  function getActive() {
    return getById(_store.activeVersionId) || getById(BASE_ID);
  }

  function getActiveId() {
    return getActive().id;
  }

  function getActiveItems() {
    const v = getActive();
    return v.isBase
      ? deepCopy(ITEMS_DATA.items)
      : deepCopy(v.items || ITEMS_DATA.items);
  }

  function isBase(id) {
    return id === BASE_ID || !!(getById(id)?.isBase);
  }

  function setActive(id) {
    if (!getById(id)) return;
    _store.activeVersionId = id;
    persist(_store);
    document.dispatchEvent(new CustomEvent('versionchange', { detail: { id } }));
  }

  function create(name, sourceId) {
    const source = getById(sourceId || BASE_ID);
    const sourceItems = source?.isBase
      ? deepCopy(ITEMS_DATA.items)
      : deepCopy(source?.items || ITEMS_DATA.items);

    const v = {
      id:        newId(),
      name:      name || 'New Version',
      createdAt: new Date().toISOString(),
      isBase:    false,
      items:     sourceItems
    };
    _store.versions.push(v);
    persist(_store);
    return v;
  }

  function rename(id, newName) {
    if (isBase(id)) return;
    const v = getById(id);
    if (!v) return;
    v.name = newName || v.name;
    persist(_store);
  }

  function del(id) {
    if (isBase(id)) return;
    _store.versions = _store.versions.filter(v => v.id !== id);
    if (_store.activeVersionId === id) _store.activeVersionId = BASE_ID;
    persist(_store);
  }

  function saveItems(id, items) {
    if (isBase(id)) return false;
    const v = getById(id);
    if (!v) return false;
    v.items = deepCopy(items);
    persist(_store);
    return true;
  }

  // ── Diff helpers ───────────────────────────────────────────

  function getBaseItems() {
    return deepCopy(ITEMS_DATA.items);
  }

  function getChangedIds(versionId) {
    if (isBase(versionId)) return new Set();
    const v = getById(versionId);
    if (!v || !v.items) return new Set();

    const baseMap = new Map(ITEMS_DATA.items.map(i => [i.id, i]));
    const vMap    = new Map(v.items.map(i => [i.id, i]));
    const changed = new Set();

    // Added
    v.items.forEach(item => { if (!baseMap.has(item.id)) changed.add(item.id); });
    // Removed
    ITEMS_DATA.items.forEach(item => { if (!vMap.has(item.id)) changed.add(item.id); });
    // Changed
    v.items.forEach(item => {
      const b = baseMap.get(item.id);
      if (!b) return;
      if (JSON.stringify(item) !== JSON.stringify(b)) changed.add(item.id);
    });

    return changed;
  }

  /** Returns { added: Set, removed: Set, modified: Set } */
  function getChangeTypes(versionId) {
    const result = { added: new Set(), removed: new Set(), modified: new Set() };
    if (isBase(versionId)) return result;
    const v = getById(versionId);
    if (!v || !v.items) return result;

    const baseMap = new Map(ITEMS_DATA.items.map(i => [i.id, i]));
    const vMap    = new Map(v.items.map(i => [i.id, i]));

    v.items.forEach(item => { if (!baseMap.has(item.id)) result.added.add(item.id); });
    ITEMS_DATA.items.forEach(item => { if (!vMap.has(item.id)) result.removed.add(item.id); });
    v.items.forEach(item => {
      const b = baseMap.get(item.id);
      if (!b) return;
      if (JSON.stringify(item) !== JSON.stringify(b)) result.modified.add(item.id);
    });

    return result;
  }

  function diffFromBase(versionId) {
    const from = ITEMS_DATA.items;
    const to   = isBase(versionId) ? ITEMS_DATA.items : (getById(versionId)?.items || ITEMS_DATA.items);
    return diffItemSets(from, to);
  }

  // Full diff between two item arrays (used by changelog)
  function diffItemSets(fromItems, toItems) {
    const fromMap = new Map(fromItems.map(i => [i.id, i]));
    const toMap   = new Map(toItems.map(i  => [i.id, i]));
    const results = [];

    // Build a combined name lookup from both sets
    const nameMap = new Map();
    fromItems.forEach(i => nameMap.set(i.id, i.name));
    toItems.forEach(i => nameMap.set(i.id, i.name));
    const resolveName = id => nameMap.get(id) || id;

    toItems.forEach(item  => { if (!fromMap.has(item.id)) results.push({ type: 'added',   item, fromItem: null, changes: [] }); });
    fromItems.forEach(item => { if (!toMap.has(item.id))  results.push({ type: 'removed',  item, fromItem: item, changes: [] }); });

    fromItems.forEach(fromItem => {
      const toItem = toMap.get(fromItem.id);
      if (!toItem) return;
      const changes = diffSingleItem(fromItem, toItem, resolveName);
      if (changes.length > 0) results.push({ type: 'changed', item: toItem, fromItem, changes });
    });

    const tierOrder = { consumable: 0, t1: 1, t2: 2, t3: 3 };
    const typeOrder = { added: 0, changed: 1, removed: 2 };
    results.sort((a, b) => {
      const td = typeOrder[a.type] - typeOrder[b.type];
      if (td !== 0) return td;
      const i1 = a.item || a.fromItem, i2 = b.item || b.fromItem;
      return (tierOrder[i1?.tier] || 0) - (tierOrder[i2?.tier] || 0);
    });
    return results;
  }

  function diffSingleItem(a, b, nameResolver) {
    const changes = [];
    const scalar = (field, label) => {
      if (JSON.stringify(a[field]) !== JSON.stringify(b[field]))
        changes.push({ field: label || field, from: fmt(a[field]), to: fmt(b[field]) });
    };
    scalar('name', 'Name');
    scalar('cost', 'Recipe Cost');
    scalar('tier', 'Tier');
    scalar('category', 'Category');
    scalar('use', 'Use');
    scalar('comment', 'Comment');

    const aStats = a.stats || [], bStats = b.stats || [];
    if (JSON.stringify(aStats) !== JSON.stringify(bStats)) {
      bStats.filter(s => !aStats.includes(s)).forEach(s  => changes.push({ field: 'Stat added',   from: null, to: s }));
      aStats.filter(s => !bStats.includes(s)).forEach(s  => changes.push({ field: 'Stat removed', from: s, to: null }));
    }

    const aA = JSON.stringify(a.active || null), bA = JSON.stringify(b.active || null);
    if (aA !== bA) {
      if (!a.active && b.active) {
        changes.push({ field: 'Active added', from: null, to: `${b.active.name} — ${b.active.description}` });
      } else if (a.active && !b.active) {
        changes.push({ field: 'Active removed', from: `${a.active.name} — ${a.active.description}`, to: null });
      } else {
        if (a.active.name !== b.active.name)   changes.push({ field: 'Active name',   from: a.active.name, to: b.active.name });
        if (a.active.cooldown !== b.active.cooldown) changes.push({ field: 'Active cooldown', from: a.active.cooldown, to: b.active.cooldown });
        if (a.active.description !== b.active.description) changes.push({ field: 'Active description', from: a.active.description, to: b.active.description });
      }
    }

    const aPassMap = new Map((a.passives||[]).map(p => [p.name, p.description]));
    const bPassMap = new Map((b.passives||[]).map(p => [p.name, p.description]));
    bPassMap.forEach((desc, name) => {
      if (!aPassMap.has(name))            changes.push({ field: 'Passive added',   from: null, to: `${name} — ${desc}` });
      else if (aPassMap.get(name) !== desc) changes.push({ field: `Passive "${name}"`, from: aPassMap.get(name), to: desc });
    });
    aPassMap.forEach((desc, name) => {
      if (!bPassMap.has(name)) changes.push({ field: 'Passive removed', from: `${name} — ${desc}`, to: null });
    });

    // Resolve component ids to names
    const resolveName = nameResolver || (id => id);
    function reqLabel(r) {
      const name = resolveName(r.id);
      return r.count > 1 ? `${name} \u00d7${r.count}` : name;
    }

    const aReqs = (a.requires||[]).map(r => ({ key: `${r.id}×${r.count}`, label: reqLabel(r) }));
    const bReqs = (b.requires||[]).map(r => ({ key: `${r.id}×${r.count}`, label: reqLabel(r) }));
    const aReqKeys = new Set(aReqs.map(r => r.key));
    const bReqKeys = new Set(bReqs.map(r => r.key));

    bReqs.forEach(r => { if (!aReqKeys.has(r.key)) changes.push({ field: 'Component added',   from: null, to: r.label }); });
    aReqs.forEach(r => { if (!bReqKeys.has(r.key)) changes.push({ field: 'Component removed', from: r.label, to: null }); });

    return changes;
  }

  function fmt(v) {
    return (v === null || v === undefined) ? '—' : String(v);
  }

  // ── Version Picker UI  (shared init for all pages) ─────────

  function initPicker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <button class="version-picker-btn" id="versionPickerBtn">
        <span class="version-picker-icon">⬡</span>
        <span class="version-picker-label" id="versionPickerLabel"></span>
        <span class="version-picker-caret">▾</span>
      </button>
      <div class="version-picker-dropdown" id="versionPickerDropdown" hidden>
        <div class="vpd-section-title">Versions</div>
        <ul class="vpd-list" id="vpdList"></ul>
        <div class="vpd-divider"></div>
        <button class="vpd-action" id="vpdNewBtn">+ New version from current…</button>
        <div class="vpd-divider"></div>
        <div class="vpd-section-title">Share</div>
        <button class="vpd-action" id="vpdExportBtn">↓ Export current version (.json)</button>
        <button class="vpd-action" id="vpdImportBtn">↑ Import version from file…</button>
      </div>
    `;

    renderPickerDropdown();

    document.getElementById('versionPickerBtn').addEventListener('click', e => {
      e.stopPropagation();
      const dd = document.getElementById('versionPickerDropdown');
      dd.hidden = !dd.hidden;
      if (!dd.hidden) renderPickerDropdown();
    });

    document.addEventListener('click', () => {
      const dd = document.getElementById('versionPickerDropdown');
      if (dd) dd.hidden = true;
    });

    document.getElementById('vpdNewBtn').addEventListener('click', e => {
      e.stopPropagation();
      const name = prompt('Name for the new version:', 'Version ' + (getAll().length));
      if (!name) return;
      const v = create(name, getActiveId());
      setActive(v.id);
      renderPickerDropdown();
    });

    document.getElementById('vpdExportBtn').addEventListener('click', e => {
      e.stopPropagation();
      exportVersion(getActiveId());
    });

    document.getElementById('vpdImportBtn').addEventListener('click', e => {
      e.stopPropagation();
      importVersion().then(v => {
        if (v) {
          setActive(v.id);
          renderPickerDropdown();
        }
      });
    });

    document.addEventListener('versionchange', () => {
      renderPickerDropdown();
    });

    // Auto-load community versions from manifest
    loadManifestVersions();
  }

  function renderPickerDropdown() {
    const labelEl = document.getElementById('versionPickerLabel');
    const listEl  = document.getElementById('vpdList');
    const btnEl   = document.getElementById('versionPickerBtn');
    if (!labelEl || !listEl) return;

    const active = getActive();
    labelEl.textContent = active.name;
    btnEl.classList.toggle('version-active-user', !active.isBase);

    listEl.innerHTML = getAll().map(v => {
      const isActive = v.id === getActiveId();
      const changedCount = isBase(v.id) ? 0 : getChangedIds(v.id).size;
      const meta = v.isBase
        ? '<span class="vpd-item-meta">read-only</span>'
        : changedCount > 0
          ? `<span class="vpd-item-meta changed">${changedCount} change${changedCount!==1?'s':''}</span>`
          : '<span class="vpd-item-meta">no changes</span>';
      const actions = v.isBase
        ? `<button class="vpd-export-btn" data-id="${v.id}" title="Export">↓</button>`
        : `<button class="vpd-export-btn" data-id="${v.id}" title="Export">↓</button>
           <button class="vpd-rename-btn" data-id="${v.id}" title="Rename">✎</button>
           <button class="vpd-delete-btn" data-id="${v.id}" title="Delete">×</button>`;
      return `
        <li class="vpd-item${isActive?' active':''}${v.isBase?' base':''}" data-id="${v.id}">
          <span class="vpd-item-name">${esc(v.name)}</span>
          ${meta}
          ${actions}
        </li>
      `;
    }).join('');

    // Wire version click
    listEl.querySelectorAll('.vpd-item').forEach(li => {
      li.addEventListener('click', e => {
        if (e.target.closest('.vpd-rename-btn, .vpd-delete-btn')) return;
        setActive(li.dataset.id);
        document.getElementById('versionPickerDropdown').hidden = true;
      });
    });

    // Wire per-row export
    listEl.querySelectorAll('.vpd-export-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        exportVersion(btn.dataset.id);
      });
    });

    // Wire rename
    listEl.querySelectorAll('.vpd-rename-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const v  = getById(id);
        const newName = prompt('Rename version:', v.name);
        if (newName && newName.trim()) {
          rename(id, newName.trim());
          renderPickerDropdown();
        }
      });
    });

    // Wire delete
    listEl.querySelectorAll('.vpd-delete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const v  = getById(id);
        if (!confirm(`Delete version "${v.name}"? This cannot be undone.`)) return;
        del(id);
        renderPickerDropdown();
        document.dispatchEvent(new CustomEvent('versionchange', { detail: { id: getActiveId() } }));
      });
    });
  }

  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Export / Import (for sharing with others) ────────────

  function exportVersion(id) {
    const v = getById(id);
    if (!v) return;
    const items = v.isBase ? deepCopy(ITEMS_DATA.items) : deepCopy(v.items);
    const payload = {
      _format: 'item-tree-version',
      _version: 1,
      name: v.name,
      exportedAt: new Date().toISOString(),
      items: items
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (v.name || 'version').replace(/[^a-z0-9_\-\s]/gi, '').replace(/\s+/g, '_') + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importVersion() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            if (data._format !== 'item-tree-version' || !Array.isArray(data.items)) {
              alert('Invalid file format. Expected an Item Tree version export (.json).');
              resolve(null);
              return;
            }
            const name = data.name ? data.name + ' (imported)' : 'Imported ' + new Date().toLocaleString();
            const v = create(name, BASE_ID);
            v.items = deepCopy(data.items);
            persist(_store);
            resolve(v);
          } catch (e) {
            alert('Failed to parse file: ' + e.message);
            resolve(null);
          }
        };
        reader.readAsText(file);
      });
      input.click();
    });
  }

  // ── Expose ─────────────────────────────────────────────────

  return {
    BASE_ID,
    reload,
    getAll,
    getById,
    getActive,
    getActiveId,
    getActiveItems,
    isBase,
    setActive,
    create,
    rename,
    del,
    saveItems,
    getChangedIds,
    getChangeTypes,
    diffFromBase,
    diffItemSets,
    getBaseItems,
    initPicker,
    exportVersion,
    importVersion,
    loadManifestVersions
  };

})();
