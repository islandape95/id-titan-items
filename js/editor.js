// ============================================================
//  Item Editor  –  version-aware
// ============================================================

const TIER_ORDER  = ['consumable', 't1', 't2', 't3'];
const TIER_LABELS = { consumable: 'Consumables', t1: 'Tier 1', t2: 'Tier 2', t3: 'Tier 3' };

// ── State ─────────────────────────────────────────────────

let workingItems  = [];   // mutable copy for the current session
let selectedId    = null;
let sidebarFilter = '';
let unsaved       = false;

function loadWorkingItems() {
  workingItems = versions.getActiveItems();
  unsaved = false;
}

// ── Sidebar ───────────────────────────────────────────────

function renderSidebar() {
  const list = document.getElementById('editorItemList');
  const q    = sidebarFilter.toLowerCase();
  const changedIds = versions.getChangedIds(versions.getActiveId());
  const changeTypes = versions.getChangeTypes(versions.getActiveId());

  list.innerHTML = '';

  TIER_ORDER.forEach(tier => {
    const tierItems = workingItems
      .filter(i => i.tier === tier)
      .filter(i => !q || i.name.toLowerCase().includes(q));

    if (!tierItems.length) return;

    const hdr = document.createElement('div');
    hdr.className = 'sidebar-tier-header';
    hdr.textContent = TIER_LABELS[tier];
    list.appendChild(hdr);

    tierItems.forEach(item => {
      const entry = document.createElement('div');
      entry.className = 'editor-item-entry' + (item.id === selectedId ? ' selected' : '');
      entry.dataset.category = item.category;
      entry.dataset.id = item.id;

      const isAdded = changeTypes.added.has(item.id);
      const isModified = changeTypes.modified.has(item.id);
      const indicator = isAdded
        ? '<span class="entry-added-dot" title="New item">★</span>'
        : isModified
        ? '<span class="entry-changed-dot" title="Modified">●</span>'
        : '';
      entry.innerHTML = `
        <span class="dot"></span>
        <span class="entry-name">${item.name}</span>
        ${indicator}
        <span class="entry-cost">${item.cost}g</span>
      `;
      entry.addEventListener('click', () => selectItem(item.id));
      list.appendChild(entry);
    });
  });
}

// ── Select & render form ──────────────────────────────────

function selectItem(id) {
  if (unsaved && selectedId && !confirm('You have unsaved changes. Discard?')) return;
  selectedId = id;
  unsaved = false;
  renderSidebar();
  renderForm();
  const url = new URL(window.location.href);
  url.searchParams.set('id', id);
  history.replaceState(null, '', url);
}

function renderForm() {
  const main = document.getElementById('editorMain');
  const item = workingItems.find(i => i.id === selectedId);
  if (!item) { main.innerHTML = `<div class="empty-state"><h3>Item not found</h3></div>`; return; }

  const isReadOnly = versions.isBase(versions.getActiveId());
  const catColors  = { offensive:'#f87171', defensive:'#60a5fa', both:'#a78bfa', utility:'#34d399' };

  const readonlyBanner = isReadOnly ? `
    <div class="base-readonly-banner">
      ⚠ Base version is read-only.
      <button id="brCreateVersionBtn">Create new version to edit</button>
    </div>` : '';

  const disabledAttr = isReadOnly ? 'disabled' : '';

  main.innerHTML = `
    <div class="editor-form">
      <h2>
        <span style="color:${catColors[item.category]||'#94a3b8'}" id="formCatDot">●</span>
        <span id="formTitle">${esc(item.name)}</span>
      </h2>
      ${readonlyBanner}

      <!-- Basic -->
      <div class="form-row">
        <div class="form-group" style="flex:2">
          <label>Name</label>
          <input type="text" id="f-name" value="${esc(item.name)}" ${disabledAttr}>
        </div>
        <div class="form-group">
          <label>Recipe Cost (g)</label>
          <input type="number" id="f-cost" value="${item.cost}" min="0" ${disabledAttr}>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Tier</label>
          <select id="f-tier" ${disabledAttr}>
            ${['consumable','t1','t2','t3'].map(t =>
              `<option value="${t}" ${item.tier===t?'selected':''}>${TIER_LABELS[t]}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="f-category" ${disabledAttr}>
            ${['offensive','defensive','both','utility'].map(c =>
              `<option value="${c}" ${item.category===c?'selected':''}>${c.charAt(0).toUpperCase()+c.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
      </div>

      <!-- Stats -->
      <div class="form-section-title">Stats</div>
      <div id="statsList">
        ${(item.stats||[]).map((s,i)=>statRow(s,i,isReadOnly)).join('')}
      </div>
      ${isReadOnly?'': '<button class="add-btn" id="addStatBtn">+ Stat</button>'}

      <!-- Use -->
      <div class="form-section-title">Use (consumable)</div>
      <div class="form-group">
        <textarea id="f-use" rows="2" ${disabledAttr}>${esc(item.use||'')}</textarea>
      </div>

      <!-- Active -->
      <div class="form-section-title">Active Ability</div>
      <div class="form-row">
        <div class="form-group" style="flex:2">
          <label>Name</label>
          <input type="text" id="f-active-name" value="${esc(item.active?.name||'')}" ${disabledAttr}>
        </div>
        <div class="form-group">
          <label>Cooldown</label>
          <input type="text" id="f-active-cd" value="${esc(item.active?.cooldown||'')}" ${disabledAttr}>
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="f-active-desc" rows="3" ${disabledAttr}>${esc(item.active?.description||'')}</textarea>
      </div>

      <!-- Passives -->
      <div class="form-section-title">Passives</div>
      <div id="passivesList">
        ${(item.passives||[]).map((p,i)=>passiveRow(p,i,isReadOnly)).join('')}
      </div>
      ${isReadOnly?'':'<button class="add-btn" id="addPassiveBtn">+ Passive</button>'}

      <!-- Comment / Note -->
      <div class="form-section-title">Comment / Note</div>
      <div class="form-group">
        <textarea id="f-comment" rows="3" placeholder="Add a note about this item or why it was changed…" ${disabledAttr}>${esc(item.comment||'')}</textarea>
      </div>

      <!-- Requires -->
      <div class="form-section-title">Components (Requires)</div>
      <div id="requiresList">
        ${(item.requires||[]).map((r,i)=>requireRow(r,i,isReadOnly)).join('')}
      </div>
      ${isReadOnly?'':'<button class="add-btn" id="addRequireBtn">+ Component</button>'}

      <!-- Actions -->
      ${isReadOnly ? '' : `
        <div class="action-row">
          <button class="btn-primary"   id="saveBtn">Save</button>
          <button class="btn-secondary" id="revertBtn">Revert to Base</button>
          <button class="btn-danger"    id="deleteBtn">Delete Item</button>
          <span class="save-indicator" id="saveIndicator"></span>
        </div>
      `}
    </div>
  `;

  wireFormButtons(item, isReadOnly);
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function statRow(val, idx, readOnly) {
  return `
    <div class="list-item-row" data-idx="${idx}">
      <input type="text" value="${esc(val)}" class="stat-input" placeholder="+10 Attack Damage" ${readOnly?'disabled':''}>
      ${readOnly?'':'<button class="remove-btn stat-remove">×</button>'}
    </div>`;
}

function passiveRow(p, idx, readOnly) {
  return `
    <div class="list-item-row" style="flex-direction:column;align-items:stretch;gap:4px" data-idx="${idx}">
      <div style="display:flex;gap:5px;align-items:center">
        <input type="text" value="${esc(p.name)}" class="passive-name-input" placeholder="Passive name" ${readOnly?'disabled':''} style="flex:1">
        ${readOnly?'':'<button class="remove-btn passive-remove">×</button>'}
      </div>
      <textarea class="passive-desc-input" rows="2" placeholder="Description…" ${readOnly?'disabled':''}>${esc(p.description)}</textarea>
    </div>`;
}

function requireRow(r, idx, readOnly) {
  const options = workingItems.map(i =>
    `<option value="${i.id}" ${i.id===r.id?'selected':''}>${i.name} (${i.tier})</option>`
  ).join('');
  return `
    <div class="list-item-row" data-idx="${idx}">
      <select class="req-id-select" style="flex:1;padding:5px 7px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;outline:none;font-family:inherit" ${readOnly?'disabled':''}>
        <option value="">— Select —</option>${options}
      </select>
      <input type="number" value="${r.count||1}" min="1" max="9" class="req-count-input"
        style="width:44px;padding:5px 5px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;outline:none;font-family:inherit;text-align:center" ${readOnly?'disabled':''}>
      ${readOnly?'':'<button class="remove-btn req-remove">×</button>'}
    </div>`;
}

// ── Wire buttons ──────────────────────────────────────────

function wireFormButtons(item, isReadOnly) {
  if (isReadOnly) {
    document.getElementById('brCreateVersionBtn')?.addEventListener('click', () => {
      const name = prompt('Name for the new version:', 'Version ' + versions.getAll().length);
      if (!name) return;
      const v = versions.create(name, versions.getActiveId());
      versions.setActive(v.id);
    });
    return;
  }

  // Remove buttons
  wireRemoveBtns();

  document.getElementById('addStatBtn')?.addEventListener('click', () => {
    document.getElementById('statsList')
      .insertAdjacentHTML('beforeend', statRow('', 99, false));
    wireRemoveBtns();
    markUnsaved();
  });
  document.getElementById('addPassiveBtn')?.addEventListener('click', () => {
    document.getElementById('passivesList')
      .insertAdjacentHTML('beforeend', passiveRow({name:'',description:''}, 99, false));
    wireRemoveBtns();
    markUnsaved();
  });
  document.getElementById('addRequireBtn')?.addEventListener('click', () => {
    document.getElementById('requiresList')
      .insertAdjacentHTML('beforeend', requireRow({id:'',count:1}, 99, false));
    wireRemoveBtns();
    markUnsaved();
  });

  document.getElementById('saveBtn').addEventListener('click',   () => saveItem(item.id));
  document.getElementById('revertBtn').addEventListener('click', () => revertItem(item.id));
  document.getElementById('deleteBtn').addEventListener('click', () => deleteItem(item.id));

  // Live title & color
  document.getElementById('f-name').addEventListener('input', e => {
    document.getElementById('formTitle').textContent = e.target.value || 'Unnamed';
    markUnsaved();
  });
  document.getElementById('f-category').addEventListener('change', e => {
    const colors = { offensive:'#f87171', defensive:'#60a5fa', both:'#a78bfa', utility:'#34d399' };
    document.getElementById('formCatDot').style.color = colors[e.target.value] || '#94a3b8';
    markUnsaved();
  });

  // Mark unsaved on any input change
  document.getElementById('editorMain').querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('change', markUnsaved);
  });
}

function wireRemoveBtns() {
  document.querySelectorAll('.stat-remove').forEach(b    => { b.onclick = () => { b.closest('.list-item-row').remove(); markUnsaved(); }; });
  document.querySelectorAll('.passive-remove').forEach(b => { b.onclick = () => { b.closest('.list-item-row').remove(); markUnsaved(); }; });
  document.querySelectorAll('.req-remove').forEach(b     => { b.onclick = () => { b.closest('.list-item-row').remove(); markUnsaved(); }; });
}

function markUnsaved() {
  unsaved = true;
  const el = document.getElementById('saveIndicator');
  if (el && !el.textContent.startsWith('Saved')) {
    el.textContent = '● unsaved';
    el.style.color = '#fbbf24';
  }
}

// ── Collect form values ───────────────────────────────────

function collectForm() {
  return {
    name:     document.getElementById('f-name').value.trim(),
    cost:     parseInt(document.getElementById('f-cost').value) || 0,
    tier:     document.getElementById('f-tier').value,
    category: document.getElementById('f-category').value,
    use:      document.getElementById('f-use').value.trim() || null,
    comment:  document.getElementById('f-comment').value.trim() || null,
    active: (() => {
      const n = document.getElementById('f-active-name').value.trim();
      const d = document.getElementById('f-active-desc').value.trim();
      const c = document.getElementById('f-active-cd').value.trim();
      return n ? { name: n, cooldown: c || null, description: d } : null;
    })(),
    stats: Array.from(document.querySelectorAll('.stat-input')).map(i => i.value.trim()).filter(Boolean),
    passives: Array.from(document.querySelectorAll('#passivesList .list-item-row')).map(row => ({
      name:        row.querySelector('.passive-name-input')?.value.trim() || '',
      description: row.querySelector('.passive-desc-input')?.value.trim() || ''
    })).filter(p => p.name),
    requires: Array.from(document.querySelectorAll('#requiresList .list-item-row')).map(row => ({
      id:    row.querySelector('.req-id-select')?.value || '',
      count: parseInt(row.querySelector('.req-count-input')?.value) || 1
    })).filter(r => r.id)
  };
}

// ── Save / revert / delete ────────────────────────────────

function saveItem(id) {
  const updates = collectForm();
  const idx = workingItems.findIndex(i => i.id === id);
  if (idx === -1) return;
  workingItems[idx] = { ...workingItems[idx], ...updates };
  versions.saveItems(versions.getActiveId(), workingItems);
  unsaved = false;
  flash('Saved ✓', 'var(--c-utility)');
  renderSidebar();
}

function revertItem(id) {
  const orig = ITEMS_DATA.items.find(i => i.id === id);
  if (!orig) { flash('Not in Base data', 'var(--c-offensive)'); return; }
  if (!confirm(`Revert "${orig.name}" to Base?`)) return;
  const idx = workingItems.findIndex(i => i.id === id);
  if (idx !== -1) workingItems[idx] = JSON.parse(JSON.stringify(orig));
  versions.saveItems(versions.getActiveId(), workingItems);
  unsaved = false;
  flash('Reverted ✓', 'var(--c-defensive)');
  renderForm();
  renderSidebar();
}

function deleteItem(id) {
  const item = workingItems.find(i => i.id === id);
  if (!confirm(`Delete "${item?.name}"? This removes it from this version.`)) return;
  workingItems = workingItems.filter(i => i.id !== id);
  versions.saveItems(versions.getActiveId(), workingItems);
  selectedId = null;
  unsaved = false;
  renderSidebar();
  document.getElementById('editorMain').innerHTML =
    `<div class="empty-state"><h3>Item deleted</h3><p>Select another item.</p></div>`;
}

function flash(msg, color) {
  const el = document.getElementById('saveIndicator');
  if (!el) return;
  el.textContent = msg;
  el.style.color = color;
  setTimeout(() => { if(el && el.textContent === msg) el.textContent = ''; }, 2500);
}

// ── Add new item ──────────────────────────────────────────

document.getElementById('addItemBtn').addEventListener('click', () => {
  if (versions.isBase(versions.getActiveId())) {
    alert('Create a new version first to add items.');
    return;
  }
  const name = prompt('New item name:');
  if (!name) return;
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (workingItems.find(i => i.id === id)) {
    alert('An item with that ID already exists.');
    return;
  }
  const newItem = { id, name, tier: 't1', cost: 0, category: 'utility', stats: [], use: null, active: null, passives: [], requires: [], totalCost: 0 };
  workingItems.push(newItem);
  versions.saveItems(versions.getActiveId(), workingItems);
  renderSidebar();
  selectItem(id);
});

// ── Sidebar search ────────────────────────────────────────

document.getElementById('sidebarSearch').addEventListener('input', e => {
  sidebarFilter = e.target.value.trim();
  renderSidebar();
});

// ── Version change ────────────────────────────────────────

document.addEventListener('versionchange', () => {
  loadWorkingItems();
  selectedId = null;
  renderSidebar();
  document.getElementById('editorMain').innerHTML =
    `<div class="empty-state"><h3>Version changed</h3><p>Select an item to edit.</p></div>`;
});

// ── Init ─────────────────────────────────────────────────

versions.initPicker('versionPicker');
loadWorkingItems();

const params = new URLSearchParams(window.location.search);
const initId = params.get('id');
if (initId && workingItems.find(i => i.id === initId)) {
  selectedId = initId;
  renderSidebar();
  renderForm();
} else {
  renderSidebar();
}
