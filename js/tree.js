// ============================================================
//  Tree Visualizer  –  barycenter column layout
// ============================================================

const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const CARD_W      = 148;
const COL_W       = 164;
const PAD_X       = 28;
const PAD_Y       = 20;
const TIER_HDR_H  = 34;
const ROW_GAP     = 60;
const CARD_H_EST  = 100;

const TIER_ORDER   = ['consumable', 't1', 't2', 't3'];
const TIER_LABELS  = { consumable: 'Consumables', t1: 'Tier 1', t2: 'Tier 2', t3: 'Tier 3' };
const TIER_DISPLAY = { consumable: 'Consumable', t1: 'Tier 1', t2: 'Tier 2', t3: 'Tier 3' };

let activeCategory  = 'all';
let searchTerm      = '';
let showChangesOnly = false;
let selectedItemId  = null;

// ── Loadout state ─────────────────────────────────────────
const loadoutSlots = [null, null, null, null, null, null];
let loadoutOpen = false;

// Cached items for the current render — avoids repeated deep copies
let _cachedItems = [];
let _cachedChangedIds = new Set();
let _cachedChangeTypes = { added: new Set(), removed: new Set(), modified: new Set() };
let _reorderTimer = 0;

function refreshCache() {
  _cachedItems = versions.getActiveItems();
  _cachedChangedIds = versions.getChangedIds(versions.getActiveId());
  _cachedChangeTypes = versions.getChangeTypes(versions.getActiveId());

  // Include removed items as ghosts (from base) so they show in tree
  if (_cachedChangeTypes.removed.size > 0) {
    const baseItems = versions.getBaseItems();
    baseItems.forEach(bi => {
      if (_cachedChangeTypes.removed.has(bi.id)) {
        bi._removed = true;
        _cachedItems.push(bi);
      }
    });
  }
}

function cachedGetItem(id) {
  return _cachedItems.find(i => i.id === id);
}

// ── Barycenter layout ─────────────────────────────────────

function mean(arr) {
  if (!arr.length) return Infinity;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function computeColumnLayout(items) {
  // Reverse dependency: id → [ids of items that REQUIRE it]
  const usedBy = new Map();
  items.forEach(i => usedBy.set(i.id, []));
  items.forEach(item => {
    (item.requires || []).forEach(req => {
      const list = usedBy.get(req.id);
      if (list) list.push(item.id);
    });
  });

  const colOf = new Map();

  function assignTier(tierItems, refMap) {
    if (!tierItems.length) return;
    const withBC = tierItems.map(item => {
      const consumers = (usedBy.get(item.id) || [])
        .filter(cid => refMap.has(cid))
        .map(cid => refMap.get(cid));
      return { item, bc: mean(consumers) };
    });
    withBC.sort((a, b) => {
      if (a.bc === Infinity && b.bc === Infinity) return a.item.name.localeCompare(b.item.name);
      return a.bc - b.bc;
    });
    withBC.forEach(({ item }, i) => {
      refMap.set(item.id, i);
      colOf.set(item.id, i);
    });
  }

  // T3: sorted by category then name
  const catOrd = { offensive: 0, both: 1, defensive: 2, utility: 3 };
  const t3 = items.filter(i => i.tier === 't3')
    .sort((a, b) => (catOrd[a.category] - catOrd[b.category]) || a.name.localeCompare(b.name));
  const refMap = new Map();
  t3.forEach((item, i) => { refMap.set(item.id, i); colOf.set(item.id, i); });

  // T2 pulled by T3
  assignTier(items.filter(i => i.tier === 't2'), refMap);
  // T1 pulled by T2
  assignTier(items.filter(i => i.tier === 't1'), refMap);
  // Consumables pulled by T2
  assignTier(items.filter(i => i.tier === 'consumable'), refMap);

  return colOf;
}

// ── Build tree ────────────────────────────────────────────

function buildTree() {
  refreshCache();

  const container = document.getElementById('treeContainer');
  const svg       = document.getElementById('connectorsSvg');
  container.innerHTML = '';
  svg.innerHTML = '';

  const items = getVisibleItems();

  if (items.length === 0) {
    container.style.width  = '100%';
    container.style.height = '200px';
    container.innerHTML = '<div class="empty-state" style="padding-top:60px"><h3>No items match</h3><p>Try a different filter or search.</p></div>';
    updateStatusBar(0);
    return;
  }

  const colOf = computeColumnLayout(items);

  // Max column across all tiers
  let maxCol = 0;
  items.forEach(item => {
    const c = colOf.get(item.id);
    if (c !== undefined && c > maxCol) maxCol = c;
  });

  const totalW = PAD_X * 2 + (maxCol + 1) * COL_W;

  // Compute Y for each active tier
  const activeTiers = TIER_ORDER.filter(t => items.some(i => i.tier === t));
  const tierYMap = {};
  let curY = PAD_Y;
  activeTiers.forEach(tier => {
    tierYMap[tier] = curY;
    curY += TIER_HDR_H + CARD_H_EST + ROW_GAP;
  });
  const totalH = curY + PAD_Y;

  container.style.position = 'relative';
  container.style.width  = totalW + 'px';
  container.style.height = totalH + 'px';

  // Render each tier
  activeTiers.forEach(tier => {
    const tierItems = items.filter(i => i.tier === tier);
    const baseY = tierYMap[tier];
    const cardY = baseY + TIER_HDR_H;

    // Tier header
    const hdr = document.createElement('div');
    hdr.className = 'tier-header-abs';
    hdr.dataset.tier = tier;
    hdr.style.cssText = `position:absolute; top:${baseY}px; left:${PAD_X}px; height:${TIER_HDR_H}px; display:flex; align-items:center; gap:8px; pointer-events:none; z-index:2;`;
    hdr.innerHTML = `
      <span class="tier-label" data-tier="${tier}">${TIER_LABELS[tier]}</span>
      <span style="font-size:10px;color:var(--text-muted)">${tierItems.length} item${tierItems.length !== 1 ? 's' : ''}</span>
    `;
    container.appendChild(hdr);

    // Divider line
    const line = document.createElement('div');
    line.style.cssText = `position:absolute; top:${baseY + TIER_HDR_H - 1}px; left:${PAD_X}px; right:${PAD_X}px; height:1px; background:var(--border); opacity:0.25; pointer-events:none;`;
    container.appendChild(line);

    // Cards
    tierItems.forEach(item => {
      const col = colOf.get(item.id) || 0;
      const x = PAD_X + col * COL_W;
      const card = buildItemCard(item);
      card.style.position = 'absolute';
      card.style.left = x + 'px';
      card.style.top  = cardY + 'px';
      card.style.zIndex = '5';
      card.dataset.baseLeft = x + 'px';
      container.appendChild(card);
    });
  });

  updateStatusBar(items.length);

  // Draw connectors after layout settles
  requestAnimationFrame(() => {
    requestAnimationFrame(() => drawConnectors());
  });
}

// ── Visible items ─────────────────────────────────────────

function getVisibleItems() {
  let items = _cachedItems.slice();

  if (activeCategory !== 'all')
    items = items.filter(i => i.category === activeCategory);

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.stats || []).some(s => s.toLowerCase().includes(q)) ||
      (i.passives || []).some(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) ||
      (i.active?.name || '').toLowerCase().includes(q)
    );
  }

  if (showChangesOnly && !versions.isBase(versions.getActiveId())) {
    items = items.filter(i => _cachedChangedIds.has(i.id) || i._removed);
  }

  return items;
}

// ── Build a card ──────────────────────────────────────────

function buildItemCard(item) {
  const card = document.createElement('div');
  card.className = 'item-card';
  card.dataset.id = item.id;
  card.dataset.category = item.category;

  const isRemoved = !!item._removed;

  if (isRemoved) card.classList.add('item-removed');
  else if (_cachedChangeTypes.added.has(item.id)) card.classList.add('item-added');
  else if (_cachedChangeTypes.modified.has(item.id)) card.classList.add('item-changed');

  if (isRemoved) {
    card.innerHTML = `
      <div class="item-card-top">
        <span class="item-name">${item.name}</span>
      </div>
      <div class="item-removed-label">REMOVED</div>
    `;
    if (IS_TOUCH) {
      card.addEventListener('click', e => { e.stopPropagation(); showTooltip(item, e); });
    } else {
      card.addEventListener('mouseenter', e  => { showTooltip(item, e); });
      card.addEventListener('mouseleave', () => { hideTooltip(); });
      card.addEventListener('mousemove',  e  => positionTooltip(e));
    }
    return card;
  }

  const stats = (item.stats || []).slice(0, 3);
  const statsHtml = stats.length
    ? `<div class="item-stats">${stats.map(s => `<div class="item-stat">${s}</div>`).join('')}</div>`
    : '';

  const hasTags = item.use || item.active || (item.passives && item.passives.length) || item.comment;
  const tagsHtml = hasTags ? `<div class="item-tags">
    ${item.use ? '<span class="item-tag use">Use</span>' : ''}
    ${item.active ? `<span class="item-tag active">${item.active.name}</span>` : ''}
    ${(item.passives || []).slice(0, 2).map(p => `<span class="item-tag passive">${p.name}</span>`).join('')}
    ${item.comment ? '<span class="item-tag comment">Comment</span>' : ''}
  </div>` : '';

  const hasReqs = item.requires && item.requires.length > 0;
  const costLabel = hasReqs && item.totalCost && item.totalCost !== item.cost
    ? `${item.totalCost}g <span class="item-recipe-cost">(${item.cost}g)</span>`
    : `${item.cost}g`;

  card.innerHTML = `
    <div class="item-card-top">
      <span class="item-name">${item.name}</span>
      <span class="item-cost">${costLabel}</span>
    </div>
    ${statsHtml}${tagsHtml}
    <button class="add-loadout-btn" title="Add to Loadout">+</button>
    <button class="edit-btn" title="Edit">Edit</button>
  `;

  if (IS_TOUCH) {
    card.addEventListener('click', e => {
      if (e.target.closest('.edit-btn, .add-loadout-btn')) return;
      const wasSelected = selectedItemId === item.id;
      if (wasSelected) {
        selectedItemId = null;
        clearHighlights();
        hideTooltip();
      } else {
        selectedItemId = item.id;
        highlightTree(item.id);
        showTooltip(item, e);
      }
    });
  } else {
    card.addEventListener('mouseenter', e  => {
      showTooltip(item, e);
      if (!selectedItemId) highlightTree(item.id);
    });
    card.addEventListener('mouseleave', () => {
      hideTooltip();
      if (!selectedItemId) clearHighlights();
    });
    card.addEventListener('mousemove',  e  => positionTooltip(e));
    card.addEventListener('click',      () => {
      selectedItemId = selectedItemId === item.id ? null : item.id;
      if (selectedItemId) highlightTree(selectedItemId); else clearHighlights();
    });
  }

  card.querySelector('.add-loadout-btn').addEventListener('click', e => {
    e.stopPropagation();
    addToLoadout(item.id);
  });

  card.querySelector('.edit-btn').addEventListener('click', e => {
    e.stopPropagation();
    window.location.href = `editor.html?id=${item.id}`;
  });

  return card;
}

// ── Tree highlight ────────────────────────────────────────

function getAncestors(id, visited) {
  if (!visited) visited = new Set();
  if (visited.has(id)) return visited;
  visited.add(id);
  const item = cachedGetItem(id);
  if (item) (item.requires || []).forEach(r => getAncestors(r.id, visited));
  return visited;
}

function getDescendants(id, visited) {
  if (!visited) visited = new Set();
  if (visited.has(id)) return visited;
  visited.add(id);
  _cachedItems.forEach(i => {
    if ((i.requires || []).some(r => r.id === id)) getDescendants(i.id, visited);
  });
  return visited;
}

function getRelatedSet(id) {
  if (!id) return null;
  return new Set([...getAncestors(id), ...getDescendants(id)]);
}

function _animateConnectors(highlightedSet) {
  // Redraw connectors every frame during the slide animation
  cancelAnimationFrame(_reorderTimer);
  const start = performance.now();
  const duration = 380; // slightly longer than the 350ms CSS transition
  function tick() {
    drawConnectors(highlightedSet);
    if (performance.now() - start < duration) {
      _reorderTimer = requestAnimationFrame(tick);
    }
  }
  _reorderTimer = requestAnimationFrame(tick);
}

function reorderForSelection(selectedId) {
  const related = getRelatedSet(selectedId);
  // Group cards by their top value (i.e. by tier row)
  const tierGroups = new Map();
  document.querySelectorAll('.item-card').forEach(card => {
    const top = card.style.top;
    if (!tierGroups.has(top)) tierGroups.set(top, []);
    tierGroups.get(top).push(card);
  });

  tierGroups.forEach(cards => {
    // Sort each group by original baseLeft so relative order is preserved
    cards.sort((a, b) => parseFloat(a.dataset.baseLeft) - parseFloat(b.dataset.baseLeft));
    const relatedCards = cards.filter(c => related.has(c.dataset.id));
    const unrelatedCards = cards.filter(c => !related.has(c.dataset.id));
    const ordered = [...relatedCards, ...unrelatedCards];
    ordered.forEach((card, i) => {
      card.style.left = (PAD_X + i * COL_W) + 'px';
    });
  });

  _animateConnectors(related);
}

function restoreBasePositions() {
  document.querySelectorAll('.item-card').forEach(card => {
    if (card.dataset.baseLeft) card.style.left = card.dataset.baseLeft;
  });
  _animateConnectors(null);
}

function catColor(cat) {
  return { offensive: '#f87171', defensive: '#60a5fa', both: '#a78bfa', utility: '#34d399' }[cat] || '#58a6ff';
}

function highlightTree(id) {
  const related = getRelatedSet(id);
  document.querySelectorAll('.item-card').forEach(card => {
    const cid = card.dataset.id;
    card.classList.remove('selected');
    if (related.has(cid)) {
      card.classList.remove('dimmed');
      card.classList.add('highlighted');
      const item = cachedGetItem(cid);
      card.style.setProperty('--highlight-color', catColor(item?.category));
      if (cid === selectedItemId) card.classList.add('selected');
    } else {
      card.classList.add('dimmed');
      card.classList.remove('highlighted');
    }
  });
  // If there's a click-selection, reorder cards and let the timer redraw connectors
  // after the slide animation finishes. Skip immediate drawConnectors to avoid the
  // "snap then jump" glitch. On hover (no selection), draw connectors immediately.
  if (selectedItemId) {
    reorderForSelection(id);
  } else {
    drawConnectors(related);
  }
}

function clearHighlights() {
  document.querySelectorAll('.item-card').forEach(c => {
    c.classList.remove('highlighted', 'dimmed', 'selected');
    c.style.removeProperty('--highlight-color');
  });
  restoreBasePositions();
}

// ── Connectors ────────────────────────────────────────────

function drawConnectors(highlightedSet) {
  const wrapper = document.getElementById('canvasWrapper');
  const svg     = document.getElementById('connectorsSvg');
  svg.innerHTML = '';

  const sw = wrapper.scrollWidth;
  const sh = wrapper.scrollHeight;
  svg.style.width  = sw + 'px';
  svg.style.height = sh + 'px';

  const wRect = wrapper.getBoundingClientRect();
  const sl = wrapper.scrollLeft;
  const st = wrapper.scrollTop;

  // Gather card positions
  const rects = {};
  document.querySelectorAll('.item-card').forEach(card => {
    const r = card.getBoundingClientRect();
    rects[card.dataset.id] = {
      cx:     r.left - wRect.left + sl + r.width / 2,
      top:    r.top  - wRect.top  + st,
      bottom: r.bottom - wRect.top + st
    };
  });

  const visibleIds = new Set(Object.keys(rects));

  _cachedItems.forEach(item => {
    if (!visibleIds.has(item.id)) return;
    const to = rects[item.id];
    if (!to) return;

    (item.requires || []).forEach(req => {
      if (!visibleIds.has(req.id)) return;
      const from = rects[req.id];
      if (!from) return;

      const isHl = highlightedSet && highlightedSet.has(item.id) && highlightedSet.has(req.id);
      const x1 = from.cx, y1 = from.bottom;
      const x2 = to.cx,   y2 = to.top;
      const my = (y1 + y2) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`);
      path.classList.add('connector-line');
      if (isHl) {
        path.classList.add('highlighted');
        path.style.stroke = catColor(cachedGetItem(item.id)?.category);
      }
      svg.appendChild(path);
    });
  });
}

// ── Tooltip ───────────────────────────────────────────────

function showTooltip(item, e) {
  const tt = document.getElementById('tooltip');
  const isChanged = _cachedChangedIds.has(item.id);

  let html = '';
  if (item._removed)
    html += `<div class="tt-removed-banner">✕ Removed in this version</div>`;
  else if (_cachedChangeTypes.added.has(item.id))
    html += `<div class="tt-added-banner">★ New item in this version</div>`;
  else if (isChanged)
    html += `<div class="tt-changed-banner">◑ Modified in this version</div>`;

  // Inline diff for modified items
  if (_cachedChangeTypes.modified.has(item.id)) {
    const baseItem = versions.getBaseItems().find(i => i.id === item.id);
    if (baseItem) {
      const diffResults = versions.diffItemSets([baseItem], [item]);
      const diff = diffResults[0];
      const realChanges = (diff?.changes || []).filter(c => c.from !== c.to);
      if (realChanges.length > 0) {
        html += `<div class="tt-diff">`;
        realChanges.forEach(c => {
          html += `<div class="tt-diff-row">`;
          html += `<span class="tt-diff-field">${c.field}</span>`;
          if (c.from && c.to) {
            html += `<span class="tt-diff-old">${c.from}</span>`;
            html += `<span class="tt-diff-arrow">→</span>`;
            html += `<span class="tt-diff-new">${c.to}</span>`;
          } else if (c.to) {
            html += `<span class="tt-diff-new">${c.to}</span>`;
          } else if (c.from) {
            html += `<span class="tt-diff-old">${c.from}</span>`;
          }
          html += `</div>`;
        });
        html += `</div>`;
      }
    }
  }

  html += `
    <div class="tt-header">
      <span class="tt-name">${item.name}</span>
      <div class="tt-cost-block">
        ${item.totalCost && item.totalCost !== item.cost
          ? `<div class="tt-cost">${item.totalCost}g total</div><div class="tt-total-cost">(${item.cost}g recipe)</div>`
          : `<div class="tt-cost">${item.cost}g</div>`}
      </div>
    </div>
    <div class="tt-badges">
      <span class="tt-badge tier">${TIER_DISPLAY[item.tier] || item.tier}</span>
      <span class="tt-badge cat-${item.category}">${item.category}</span>
    </div>`;

  if (item.stats?.length) {
    html += `<div class="tt-section"><div class="tt-section-title">Stats</div><div class="tt-stats">
      ${item.stats.map(s => `<span class="tt-stat">${s}</span>`).join('')}</div></div>`;
  }
  if (item.use) {
    html += `<div class="tt-section"><div class="tt-section-title">Use</div><div class="tt-desc tt-use">${item.use}</div></div>`;
  }
  if (item.active) {
    const cd = item.active.cooldown ? `<span class="tt-cooldown">[${item.active.cooldown}]</span>` : '';
    html += `<div class="tt-section"><div class="tt-section-title">Active</div>
      <div class="tt-desc"><span class="tt-active-name">${item.active.name}</span>${cd} — ${item.active.description}</div></div>`;
  }
  if (item.passives?.length) {
    html += `<div class="tt-section"><div class="tt-section-title">Passives</div>`;
    item.passives.forEach(p => { html += `<div class="tt-desc" style="margin-bottom:4px"><span class="tt-passive-name">${p.name}</span> — ${p.description}</div>`; });
    html += `</div>`;
  }
  if (item.requires?.length) {
    html += `<div class="tt-divider"></div><div class="tt-section"><div class="tt-section-title">Requires</div><div class="tt-requires">`;
    item.requires.forEach(req => {
      const r = cachedGetItem(req.id);
      html += `<span class="tt-req-chip">${r ? r.name : req.id}${req.count > 1 ? ` ×${req.count}` : ''}</span>`;
    });
    html += `</div></div>`;
  }

  if (item.comment) {
    html += `<div class="tt-divider"></div><div class="tt-section"><div class="tt-section-title">Comment</div>
      <div class="tt-comment">${item.comment}</div></div>`;
  }

  tt.innerHTML = html;
  positionTooltip(e);
  tt.classList.add('visible');
}

function positionTooltip(e) {
  const tt = document.getElementById('tooltip');
  const w = tt.offsetWidth || 320, h = tt.offsetHeight || 200;
  const cx = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
  const cy = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
  let x = cx + 18, y = cy + 18;
  if (x + w > window.innerWidth  - 14) x = cx - w - 18;
  if (y + h > window.innerHeight - 14) y = cy - h - 18;
  tt.style.left = Math.max(14, x) + 'px';
  tt.style.top  = Math.max(14, y) + 'px';
}

function hideTooltip() {
  document.getElementById('tooltip').classList.remove('visible');
}

// Tap-elsewhere-to-dismiss on touch devices
if (IS_TOUCH) {
  document.addEventListener('click', e => {
    if (!e.target.closest('#tooltip') && !e.target.closest('.item-card')) {
      hideTooltip();
      if (selectedItemId) { selectedItemId = null; clearHighlights(); }
    }
  });
}

// ── Loadout functions ─────────────────────────────────────

function addToLoadout(itemId) {
  if (!loadoutOpen) toggleLoadoutPanel(true);

  const idx = loadoutSlots.indexOf(null);
  if (idx === -1) {
    const panel = document.getElementById('loadoutPanel');
    panel.classList.remove('flash');
    void panel.offsetWidth;
    panel.classList.add('flash');
    return;
  }
  loadoutSlots[idx] = itemId;
  renderLoadout();
}

function removeFromSlot(index) {
  loadoutSlots[index] = null;
  renderLoadout();
}

function resetLoadout() {
  for (let i = 0; i < loadoutSlots.length; i++) loadoutSlots[i] = null;
  renderLoadout();
}

function renderLoadout() {
  const container = document.getElementById('loadoutSlots');
  if (!container) return;
  container.innerHTML = '';

  const catColors = { offensive: 'var(--c-offensive)', defensive: 'var(--c-defensive)', both: 'var(--c-both)', utility: 'var(--c-utility)' };

  let totalCost = 0;

  for (let i = 0; i < loadoutSlots.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'loadout-slot';

    const itemId = loadoutSlots[i];
    if (itemId) {
      const item = cachedGetItem(itemId);
      if (!item) {
        // Item no longer exists in cache (version changed, etc)
        loadoutSlots[i] = null;
        slot.textContent = i + 1;
        container.appendChild(slot);
        continue;
      }

      slot.classList.add('loadout-slot-filled');
      slot.style.setProperty('--slot-cat-color', catColors[item.category] || 'var(--border)');

      const cost = item.totalCost || item.cost || 0;
      totalCost += cost;

      slot.innerHTML = `
        <span class="loadout-slot-name">${item.name}</span>
        <span class="loadout-slot-cost">${cost}g</span>
        <span class="loadout-slot-tier">${TIER_DISPLAY[item.tier] || item.tier}</span>
        <button class="loadout-slot-remove" title="Remove">✕</button>
      `;

      slot.querySelector('.loadout-slot-remove').addEventListener('click', () => removeFromSlot(i));
    } else {
      slot.textContent = i + 1;
    }

    container.appendChild(slot);
  }

  document.getElementById('loadoutTotal').textContent = totalCost.toLocaleString();
}

function toggleLoadoutPanel(open) {
  const panel = document.getElementById('loadoutPanel');
  const btn = document.getElementById('loadoutToggle');
  if (open === undefined) open = !loadoutOpen;
  loadoutOpen = open;
  panel.classList.toggle('open', loadoutOpen);
  btn.classList.toggle('active', loadoutOpen);
  if (loadoutOpen) renderLoadout();
}

// ── Status bar ────────────────────────────────────────────

function updateStatusBar(count) {
  document.getElementById('statVisible').textContent = count;
  document.getElementById('statVersion').textContent = versions.getActive().name;
  const isBase = versions.isBase(versions.getActiveId());
  const cc = _cachedChangedIds.size;
  const el = document.getElementById('statChanges');
  el.hidden = isBase || cc === 0;
  if (!isBase) document.getElementById('statChangesCount').textContent = cc;
}

// ── Changes toggle ────────────────────────────────────────

function updateChangesToggle() {
  const btn = document.getElementById('changesToggle');
  const isBase = versions.isBase(versions.getActiveId());
  if (isBase) { btn.hidden = true; showChangesOnly = false; btn.classList.remove('active'); return; }
  btn.hidden = false;
  const ct = _cachedChangeTypes;
  const parts = [];
  if (ct.added.size)    parts.push(`${ct.added.size} new`);
  if (ct.modified.size) parts.push(`${ct.modified.size} modified`);
  if (ct.removed.size)  parts.push(`${ct.removed.size} removed`);
  btn.querySelector('.changes-count').textContent = parts.length ? parts.join(', ') : '0';
}

document.getElementById('changesToggle').addEventListener('click', () => {
  showChangesOnly = !showChangesOnly;
  document.getElementById('changesToggle').classList.toggle('active', showChangesOnly);
  selectedItemId = null;
  buildTree();
});

// ── Category tabs ─────────────────────────────────────────

document.querySelectorAll('.cat-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    activeCategory = btn.dataset.cat;
    selectedItemId = null;
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildTree();
  });
});

// ── Search ────────────────────────────────────────────────

document.getElementById('searchInput').addEventListener('input', e => {
  searchTerm = e.target.value.trim();
  selectedItemId = null;
  buildTree();
});

// ── Redraw on scroll/resize ───────────────────────────────

const wrapper = document.getElementById('canvasWrapper');
let scrollRaf = 0;
wrapper.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollRaf);
  scrollRaf = requestAnimationFrame(() => drawConnectors(selectedItemId ? getRelatedSet(selectedItemId) : null));
});
window.addEventListener('resize', () => drawConnectors(selectedItemId ? getRelatedSet(selectedItemId) : null));

// Click empty space to deselect
wrapper.addEventListener('mousedown', e => {
  if (!selectedItemId) return;
  if (e.target.closest('.item-card')) return;
  selectedItemId = null;
  clearHighlights();
});

// ── Version change ────────────────────────────────────────

document.addEventListener('versionchange', () => {
  selectedItemId  = null;
  showChangesOnly = false;
  document.getElementById('changesToggle').classList.remove('active');
  buildTree();
  updateChangesToggle();
});

// ── Loadout panel wiring ──────────────────────────────────

document.getElementById('loadoutToggle').addEventListener('click', () => toggleLoadoutPanel());
document.getElementById('loadoutClose').addEventListener('click', () => toggleLoadoutPanel(false));
document.getElementById('loadoutReset').addEventListener('click', () => resetLoadout());

// ── Init ─────────────────────────────────────────────────

versions.initPicker('versionPicker');
buildTree();
updateChangesToggle();
