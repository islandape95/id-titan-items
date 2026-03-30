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
  recomputeTotalCosts();
  unsaved = false;
}

function editorComputeTotalCost(itemId, visited = new Set()) {
  if (visited.has(itemId)) return 0;
  visited.add(itemId);
  const item = workingItems.find(i => i.id === itemId);
  if (!item) return 0;
  const childCost = (item.requires || []).reduce((sum, req) => {
    return sum + (req.count || 1) * editorComputeTotalCost(req.id, new Set(visited));
  }, 0);
  return item.cost + childCost;
}

function recomputeTotalCosts() {
  workingItems.forEach(item => {
    item.totalCost = editorComputeTotalCost(item.id);
  });
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

    // Collect removed base items for this tier
    const removedInTier = !versions.isBase(versions.getActiveId())
      ? versions.getBaseItems()
          .filter(bi => bi.tier === tier && changeTypes.removed.has(bi.id))
          .filter(bi => !q || bi.name.toLowerCase().includes(q))
      : [];

    if (!tierItems.length && !removedInTier.length) return;

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

    // Show removed items as ghost entries with restore button
    removedInTier.forEach(bi => {
      const entry = document.createElement('div');
      entry.className = 'editor-item-entry entry-removed';
      entry.dataset.category = bi.category;
      entry.dataset.id = bi.id;
      entry.innerHTML = `
        <span class="dot"></span>
        <span class="entry-name">${bi.name}</span>
        <span class="entry-removed-dot" title="Removed in this version">✕</span>
        <button class="entry-restore-btn" title="Restore item">↩</button>
      `;
      entry.querySelector('.entry-restore-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        restoreItem(bi.id);
      });
      list.appendChild(entry);
    });
  });

  wireSidebarTooltips();
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
        ${item.totalCost && item.totalCost !== item.cost
          ? `<span class="editor-total-cost">${item.totalCost}g total <span class="editor-recipe-cost">(${item.cost}g recipe)</span></span>`
          : `<span class="editor-total-cost">${item.cost}g</span>`}
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

      <!-- Use (only for consumables) -->
      <div id="useSection" style="${item.tier === 'consumable' ? '' : 'display:none'}">
        <div class="form-section-title">Use (consumable)</div>
        <div class="form-group">
          <textarea id="f-use" rows="2" ${disabledAttr}>${esc(item.use||'')}</textarea>
        </div>
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

      <!-- Comment -->
      <div class="form-section-title">Comment</div>
      <div class="form-group">
        <textarea id="f-comment" rows="3" placeholder="Add a comment about this item or why it was changed…" ${disabledAttr}>${esc(item.comment||'')}</textarea>
      </div>

      <!-- Requires -->
      <div class="form-section-title">Components (Requires)</div>
      <div id="requiresList">
        ${(item.requires||[]).map((r,i)=>requireRow(r,i,isReadOnly)).join('')}
      </div>
      ${isReadOnly?'':'<button class="add-btn" id="addRequireBtn">+ Component</button>'}

      <!-- Mini Build Tree -->
      ${item.requires?.length ? `
        <div class="form-section-title">Build Tree</div>
        <div class="editor-build-tree" id="buildTree">
          ${buildTreeHtml(item, 0, new Set())}
        </div>
      ` : ''}

      <!-- Used By (reverse dependencies) -->
      ${renderUsedBy(item)}

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

function buildRequireOptions(selectedId) {
  const tierOrd = { consumable: 0, t1: 1, t2: 2, t3: 3 };
  const sorted = [...workingItems].sort((a, b) => (tierOrd[a.tier] || 0) - (tierOrd[b.tier] || 0) || a.name.localeCompare(b.name));
  let options = '';
  let lastTier = null;
  sorted.forEach(i => {
    if (i.tier !== lastTier) {
      if (lastTier !== null) options += '</optgroup>';
      options += `<optgroup label="${TIER_LABELS[i.tier] || i.tier}">`;
      lastTier = i.tier;
    }
    options += `<option value="${i.id}" ${i.id===selectedId?'selected':''}>${i.name}</option>`;
  });
  if (lastTier !== null) options += '</optgroup>';
  return options;
}

function requireRow(r, idx, readOnly) {
  const resolved = r.id ? workingItems.find(i => i.id === r.id) : null;

  // Item ID set but not found — show missing/removed chip in red
  if (r.id && !resolved) {
    const baseName = versions.getBaseItems().find(i => i.id === r.id);
    const displayName = baseName ? baseName.name : r.id;
    return `
      <div class="req-chip-row req-chip-missing" data-idx="${idx}" data-item-id="${r.id}">
        <span class="req-chip-dot" style="background:var(--c-offensive)"></span>
        <span class="req-chip-name">${esc(displayName)}</span>
        <span class="req-chip-removed-label">removed</span>
        <input type="number" value="${r.count||1}" min="1" max="9" class="req-count-input"
          style="width:40px;padding:3px 4px;border-radius:5px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;outline:none;font-family:inherit;text-align:center" ${readOnly?'disabled':''}>
        ${readOnly ? '' : '<button class="remove-btn req-remove">×</button>'}
      </div>`;
  }

  // No item selected yet — show dropdown
  if (!resolved) {
    return `
      <div class="list-item-row" data-idx="${idx}">
        <select class="req-id-select" style="flex:1;padding:5px 7px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;outline:none;font-family:inherit" ${readOnly?'disabled':''}>
          <option value="">— Select —</option>${buildRequireOptions('')}
        </select>
        <input type="number" value="${r.count||1}" min="1" max="9" class="req-count-input"
          style="width:44px;padding:5px 5px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;outline:none;font-family:inherit;text-align:center" ${readOnly?'disabled':''}>
        ${readOnly?'':'<button class="remove-btn req-remove">×</button>'}
      </div>`;
  }

  // Item selected — show chip
  const catColors = { offensive:'var(--c-offensive)', defensive:'var(--c-defensive)', both:'var(--c-both)', utility:'var(--c-utility)' };
  const catColor = catColors[resolved.category] || 'var(--border)';
  const tierDisplay = { consumable:'Consumable', t1:'T1', t2:'T2', t3:'T3' };
  const costDisplay = resolved.totalCost && resolved.totalCost !== resolved.cost
    ? `${resolved.totalCost}g` : `${resolved.cost}g`;

  return `
    <div class="req-chip-row" data-idx="${idx}" data-item-id="${resolved.id}" style="--chip-cat-color:${catColor}">
      <span class="req-chip-dot" style="background:${catColor}"></span>
      <span class="req-chip-name">${esc(resolved.name)}</span>
      <span class="req-chip-tier">${tierDisplay[resolved.tier] || resolved.tier}</span>
      <span class="req-chip-cost">${costDisplay}</span>
      <input type="number" value="${r.count||1}" min="1" max="9" class="req-count-input"
        style="width:40px;padding:3px 4px;border-radius:5px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;outline:none;font-family:inherit;text-align:center" ${readOnly?'disabled':''}>
      ${readOnly ? '' : `<button class="req-chip-change" title="Change component">&#9662;</button>`}
      ${readOnly ? '' : '<button class="remove-btn req-remove">×</button>'}
      <select class="req-id-select req-chip-hidden-select" ${readOnly?'disabled':''}>
        <option value="">— Select —</option>${buildRequireOptions(r.id)}
      </select>
    </div>`;
}

// ── Used By (reverse deps) ────────────────────────────────

function renderUsedBy(item) {
  const parents = workingItems.filter(i =>
    (i.requires || []).some(r => r.id === item.id)
  );
  if (!parents.length) return '';

  const catColors = { offensive:'var(--c-offensive)', defensive:'var(--c-defensive)', both:'var(--c-both)', utility:'var(--c-utility)' };
  const chips = parents.map(p => {
    const color = catColors[p.category] || 'var(--border)';
    return `<span class="used-by-chip" data-item-id="${p.id}" style="--chip-cat-color:${color}">
      <span class="used-by-dot" style="background:${color}"></span>
      ${esc(p.name)}
    </span>`;
  }).join('');

  return `
    <div class="form-section-title">Used By</div>
    <div class="used-by-list">${chips}</div>`;
}

// ── Mini Build Tree ──────────────────────────────────────

function buildTreeHtml(item, depth, visited) {
  if (!item.requires?.length || visited.has(item.id)) return '';
  visited.add(item.id);

  const catColors = { offensive:'var(--c-offensive)', defensive:'var(--c-defensive)', both:'var(--c-both)', utility:'var(--c-utility)' };
  let html = '<div class="build-tree-level">';

  item.requires.forEach(req => {
    const child = workingItems.find(i => i.id === req.id);
    if (!child) return;
    const color = catColors[child.category] || 'var(--border)';
    const countLabel = req.count > 1 ? ` ×${req.count}` : '';
    html += `<div class="build-tree-node" data-item-id="${child.id}">
      <span class="build-tree-connector"></span>
      <span class="build-tree-chip" style="--chip-cat-color:${color}">
        <span class="build-tree-dot" style="background:${color}"></span>
        ${esc(child.name)}${countLabel}
        <span class="build-tree-cost">${child.cost}g</span>
      </span>
      ${depth < 3 ? buildTreeHtml(child, depth + 1, visited) : ''}
    </div>`;
  });

  html += '</div>';
  return html;
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
    wireChipTooltips();
    wireNavigableChips();
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
    wireChipEvents();
    wireChipTooltips();
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
  document.getElementById('f-tier').addEventListener('change', e => {
    document.getElementById('useSection').style.display = e.target.value === 'consumable' ? '' : 'none';
    markUnsaved();
  });

  // Mark unsaved on any input change
  document.getElementById('editorMain').querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('change', markUnsaved);
  });

  // Wire chip change buttons and tooltips
  wireChipEvents();
  wireChipTooltips();
  wireNavigableChips();
}

function wireChipEvents() {
  document.querySelectorAll('.req-chip-change').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('.req-chip-row');
      const sel = row.querySelector('.req-chip-hidden-select');
      sel.style.display = 'block';
      sel.focus();
      sel.addEventListener('change', () => {
        // Re-render the row as a chip (or dropdown if cleared)
        const newId = sel.value;
        const countInput = row.querySelector('.req-count-input');
        const count = parseInt(countInput?.value) || 1;
        const idx = row.dataset.idx;
        const tmp = document.createElement('div');
        tmp.innerHTML = requireRow({ id: newId, count }, idx, false);
        row.replaceWith(tmp.firstElementChild);
        wireRemoveBtns();
        wireChipEvents();
        wireChipTooltips();
        markUnsaved();
      }, { once: true });
      sel.addEventListener('blur', () => {
        sel.style.display = '';
      }, { once: true });
    };
  });

  // When a bare dropdown (no chip yet) gets a selection, convert to chip
  document.querySelectorAll('#requiresList .list-item-row .req-id-select').forEach(sel => {
    sel.addEventListener('change', () => {
      if (!sel.value) return;
      const row = sel.closest('.list-item-row');
      const countInput = row.querySelector('.req-count-input');
      const count = parseInt(countInput?.value) || 1;
      const idx = row.dataset.idx;
      const tmp = document.createElement('div');
      tmp.innerHTML = requireRow({ id: sel.value, count }, idx, false);
      row.replaceWith(tmp.firstElementChild);
      wireRemoveBtns();
      wireChipEvents();
      wireChipTooltips();
      markUnsaved();
    });
  });
}

// ── Editor Tooltip ───────────────────────────────────────

const EDITOR_TIER_DISPLAY = { consumable: 'Consumable', t1: 'Tier 1', t2: 'Tier 2', t3: 'Tier 3' };

function showEditorTooltip(item, e) {
  const tt = document.getElementById('tooltip');
  if (!tt || !item) return;

  let html = `
    <div class="tt-header">
      <span class="tt-name">${esc(item.name)}</span>
      <div class="tt-cost-block">
        ${item.totalCost && item.totalCost !== item.cost
          ? `<div class="tt-cost">${item.totalCost}g total</div><div class="tt-total-cost">(${item.cost}g recipe)</div>`
          : `<div class="tt-cost">${item.cost}g</div>`}
      </div>
    </div>
    <div class="tt-badges">
      <span class="tt-badge tier">${EDITOR_TIER_DISPLAY[item.tier] || item.tier}</span>
      <span class="tt-badge cat-${item.category}">${item.category}</span>
    </div>`;

  if (item.stats?.length) {
    html += `<div class="tt-section"><div class="tt-section-title">Stats</div><div class="tt-stats">
      ${item.stats.map(s => `<span class="tt-stat">${esc(s)}</span>`).join('')}</div></div>`;
  }
  if (item.use) {
    html += `<div class="tt-section"><div class="tt-section-title">Use</div><div class="tt-desc tt-use">${esc(item.use)}</div></div>`;
  }
  if (item.active) {
    const cd = item.active.cooldown ? `<span class="tt-cooldown">[${esc(item.active.cooldown)}]</span>` : '';
    html += `<div class="tt-section"><div class="tt-section-title">Active</div>
      <div class="tt-desc"><span class="tt-active-name">${esc(item.active.name)}</span>${cd} — ${esc(item.active.description)}</div></div>`;
  }
  if (item.passives?.length) {
    html += `<div class="tt-section"><div class="tt-section-title">Passives</div>`;
    item.passives.forEach(p => {
      html += `<div class="tt-desc" style="margin-bottom:4px"><span class="tt-passive-name">${esc(p.name)}</span> — ${esc(p.description)}</div>`;
    });
    html += `</div>`;
  }
  if (item.requires?.length) {
    html += `<div class="tt-divider"></div><div class="tt-section"><div class="tt-section-title">Requires</div><div class="tt-requires">`;
    item.requires.forEach(req => {
      const r = workingItems.find(i => i.id === req.id);
      html += `<span class="tt-req-chip">${r ? esc(r.name) : esc(req.id)}${req.count > 1 ? ` ×${req.count}` : ''}</span>`;
    });
    html += `</div></div>`;
  }
  if (item.comment) {
    html += `<div class="tt-divider"></div><div class="tt-section"><div class="tt-section-title">Comment</div>
      <div class="tt-comment">${esc(item.comment)}</div></div>`;
  }

  tt.innerHTML = html;
  editorPositionTooltip(e);
  tt.classList.add('visible');
}

function editorPositionTooltip(e) {
  const tt = document.getElementById('tooltip');
  const w = tt.offsetWidth || 320, h = tt.offsetHeight || 200;
  let x = e.clientX + 18, y = e.clientY + 18;
  if (x + w > window.innerWidth  - 14) x = e.clientX - w - 18;
  if (y + h > window.innerHeight - 14) y = e.clientY - h - 18;
  tt.style.left = Math.max(14, x) + 'px';
  tt.style.top  = Math.max(14, y) + 'px';
}

function editorHideTooltip() {
  const tt = document.getElementById('tooltip');
  if (tt) tt.classList.remove('visible');
}

function wireChipTooltips() {
  // Component chip rows
  document.querySelectorAll('.req-chip-row').forEach(row => {
    const itemId = row.dataset.itemId;
    const item = workingItems.find(i => i.id === itemId);
    if (!item) return;
    row.addEventListener('mouseenter', e => showEditorTooltip(item, e));
    row.addEventListener('mousemove',  e => editorPositionTooltip(e));
    row.addEventListener('mouseleave', () => editorHideTooltip());
  });
}

function wireSidebarTooltips() {
  document.querySelectorAll('.editor-item-entry').forEach(entry => {
    const itemId = entry.dataset.id;
    const item = workingItems.find(i => i.id === itemId);
    if (!item) return;
    entry.addEventListener('mouseenter', e => showEditorTooltip(item, e));
    entry.addEventListener('mousemove',  e => editorPositionTooltip(e));
    entry.addEventListener('mouseleave', () => editorHideTooltip());
  });
}

function wireNavigableChips() {
  // Click component chip name to navigate to that item
  document.querySelectorAll('.req-chip-name').forEach(el => {
    const row = el.closest('.req-chip-row');
    if (!row) return;
    el.style.cursor = 'pointer';
    el.addEventListener('click', e => {
      e.stopPropagation();
      editorHideTooltip();
      const id = row.dataset.itemId;
      if (id) selectItem(id);
    });
  });

  // Click used-by chips to navigate
  document.querySelectorAll('.used-by-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      editorHideTooltip();
      selectItem(chip.dataset.itemId);
    });
  });

  // Click build tree chips to navigate
  document.querySelectorAll('.build-tree-chip').forEach(chip => {
    const node = chip.closest('.build-tree-node');
    if (!node) return;
    chip.addEventListener('click', () => {
      editorHideTooltip();
      selectItem(node.dataset.itemId);
    });
  });

  // Wire tooltips on build tree chips
  document.querySelectorAll('.build-tree-node').forEach(node => {
    const itemId = node.dataset.itemId;
    const item = workingItems.find(i => i.id === itemId);
    if (!item) return;
    const chip = node.querySelector('.build-tree-chip');
    if (!chip) return;
    chip.addEventListener('mouseenter', e => showEditorTooltip(item, e));
    chip.addEventListener('mousemove',  e => editorPositionTooltip(e));
    chip.addEventListener('mouseleave', () => editorHideTooltip());
  });

  // Wire tooltips on used-by chips
  document.querySelectorAll('.used-by-chip').forEach(chip => {
    const itemId = chip.dataset.itemId;
    const item = workingItems.find(i => i.id === itemId);
    if (!item) return;
    chip.addEventListener('mouseenter', e => showEditorTooltip(item, e));
    chip.addEventListener('mousemove',  e => editorPositionTooltip(e));
    chip.addEventListener('mouseleave', () => editorHideTooltip());
  });
}

function wireRemoveBtns() {
  document.querySelectorAll('.stat-remove').forEach(b    => { b.onclick = () => { b.closest('.list-item-row').remove(); markUnsaved(); }; });
  document.querySelectorAll('.passive-remove').forEach(b => { b.onclick = () => { b.closest('.list-item-row').remove(); markUnsaved(); }; });
  document.querySelectorAll('.req-remove').forEach(b     => { b.onclick = () => { const row = b.closest('.list-item-row') || b.closest('.req-chip-row'); if (row) row.remove(); markUnsaved(); }; });
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
    requires: Array.from(document.querySelectorAll('#requiresList .list-item-row, #requiresList .req-chip-row')).map(row => {
      if (row.classList.contains('req-chip-row')) {
        return {
          id:    row.dataset.itemId || row.querySelector('.req-id-select')?.value || '',
          count: parseInt(row.querySelector('.req-count-input')?.value) || 1
        };
      }
      return {
        id:    row.querySelector('.req-id-select')?.value || '',
        count: parseInt(row.querySelector('.req-count-input')?.value) || 1
      };
    }).filter(r => r.id)
  };
}

// ── Save / revert / delete ────────────────────────────────

function saveItem(id) {
  const updates = collectForm();
  const idx = workingItems.findIndex(i => i.id === id);
  if (idx === -1) return;
  workingItems[idx] = { ...workingItems[idx], ...updates };
  recomputeTotalCosts();
  versions.saveItems(versions.getActiveId(), workingItems);
  unsaved = false;
  flash('Saved ✓', 'var(--c-utility)');
  renderSidebar();
  renderForm();
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

function restoreItem(id) {
  const orig = versions.getBaseItems().find(i => i.id === id);
  if (!orig) return;
  workingItems.push(JSON.parse(JSON.stringify(orig)));
  recomputeTotalCosts();
  versions.saveItems(versions.getActiveId(), workingItems);
  flash('Restored ✓', 'var(--c-defensive)');
  renderSidebar();
  selectItem(id);
}

function deleteItem(id) {
  const item = workingItems.find(i => i.id === id);
  if (!confirm(`Delete "${item?.name}"? This removes it from this version and from all items that require it.`)) return;

  // Remove from all other items' requirements
  let cascadeCount = 0;
  workingItems.forEach(i => {
    const before = (i.requires || []).length;
    i.requires = (i.requires || []).filter(r => r.id !== id);
    if (i.requires.length < before) cascadeCount++;
  });

  workingItems = workingItems.filter(i => i.id !== id);
  versions.saveItems(versions.getActiveId(), workingItems);
  selectedId = null;
  unsaved = false;
  renderSidebar();

  const cascadeMsg = cascadeCount > 0
    ? `<p>Also removed from ${cascadeCount} item${cascadeCount !== 1 ? 's' : ''} that required it.</p>`
    : '';
  document.getElementById('editorMain').innerHTML =
    `<div class="empty-state"><h3>Item deleted</h3>${cascadeMsg}<p>Select another item.</p></div>`;
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

// ── Keyboard shortcut: Ctrl+S to save ────────────────────

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (selectedId && unsaved && !versions.isBase(versions.getActiveId())) {
      saveItem(selectedId);
    }
  }
});
