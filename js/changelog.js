// ============================================================
//  Changelog  –  version-aware diff viewer (full-card view)
// ============================================================

function populateSelects() {
  const all    = versions.getAll();
  const fromSel = document.getElementById('fromSelect');
  const toSel   = document.getElementById('toSelect');

  [fromSel, toSel].forEach(sel => {
    sel.innerHTML = all.map(v => {
      const label = v.isBase ? `${v.name} (read-only)` : v.name;
      return `<option value="${v.id}">${label}</option>`;
    }).join('');
  });

  fromSel.value = versions.BASE_ID;
  const active = versions.getActiveId();
  const firstUser = all.find(v => !v.isBase);
  toSel.value = (!versions.isBase(active)) ? active : (firstUser?.id || versions.BASE_ID);
}

function getItemsForVersion(id) {
  const v = versions.getById(id);
  if (!v) return [];
  return v.isBase ? JSON.parse(JSON.stringify(ITEMS_DATA.items)) : JSON.parse(JSON.stringify(v.items || []));
}

// ── Helpers ───────────────────────────────────────────────

const TIER_DISPLAY = { consumable: 'Consumables', t1: 'Tier 1', t2: 'Tier 2', t3: 'Tier 3' };
const CAT_COLORS   = { offensive: '#f87171', defensive: '#60a5fa', both: '#a78bfa', utility: '#34d399' };

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Render full-card diff ─────────────────────────────────

function renderDiff(results, fromLabel, toLabel, fromItems, toItems) {
  const output = document.getElementById('changelogOutput');

  if (results.length === 0) {
    output.innerHTML = `<div class="empty-state">
      <h3>No differences found</h3>
      <p>These two versions are identical.</p>
    </div>`;
    return;
  }

  // Name resolver for component ids
  const nameMap = new Map();
  (fromItems || []).forEach(i => nameMap.set(i.id, i.name));
  (toItems   || []).forEach(i => nameMap.set(i.id, i.name));
  const itemName = id => nameMap.get(id) || id;

  const summary = `
    <div class="cl-summary">
      <div class="cl-summary-label">
        Comparing <b>${esc(fromLabel)}</b> &rarr;<b>${esc(toLabel)}</b>
      </div>
      <div class="cl-summary-counts">
        <span class="cl-count-added"><b>${results.filter(r => r.type === 'added').length}</b> added</span>
        <span class="cl-count-changed"><b>${results.filter(r => r.type === 'changed').length}</b> changed</span>
        <span class="cl-count-removed"><b>${results.filter(r => r.type === 'removed').length}</b> removed</span>
      </div>
    </div>
  `;

  const entries = results.map(r => {
    if (r.type === 'added')   return renderAddedItem(r.item, itemName);
    if (r.type === 'removed') return renderRemovedItem(r.fromItem, itemName);
    return renderChangedItem(r.fromItem, r.item, r.changes, itemName);
  }).join('');

  output.innerHTML = summary + entries;
}

// ── Added item: full card in green ────────────────────────

function costLabel(item) {
  const hasReqs = item.requires && item.requires.length > 0;
  return hasReqs && item.totalCost && item.totalCost !== item.cost
    ? `${item.totalCost}g (${item.cost}g recipe)`
    : `${item.cost}g`;
}

function renderAddedItem(item, itemName) {
  return `
    <div class="cl-entry cl-entry-added">
      <div class="cl-entry-header">
        <span class="cl-badge added">NEW</span>
        <span class="cl-item-name">${esc(item.name)}</span>
        <span class="cl-tier">${TIER_DISPLAY[item.tier] || item.tier}</span>
        <span class="cl-cat" style="color:${CAT_COLORS[item.category] || '#94a3b8'}">${item.category}</span>
        <span class="cl-cost">${costLabel(item)}</span>
      </div>
      <div class="cl-card cl-card-new">
        ${renderItemBody(item, itemName)}
      </div>
      ${item.comment ? `<div class="cl-comment"><span class="cl-comment-label">Comment:</span> ${esc(item.comment)}</div>` : ''}
    </div>`;
}

// ── Removed item: header only, no body ───────────────────

function renderRemovedItem(item, itemName) {
  return `
    <div class="cl-entry cl-entry-removed">
      <div class="cl-entry-header">
        <span class="cl-badge removed">REMOVED</span>
        <span class="cl-item-name cl-strike">${esc(item.name)}</span>
        <span class="cl-tier">${TIER_DISPLAY[item.tier] || item.tier}</span>
        <span class="cl-cat" style="color:${CAT_COLORS[item.category] || '#94a3b8'}">${item.category}</span>
        <span class="cl-cost">${costLabel(item)}</span>
      </div>
    </div>`;
}

// ── Changed item: side-by-side-ish inline diff ────────────

function renderChangedItem(fromItem, toItem, changes, itemName) {
  // Build sets for quick lookup
  const changedFields = new Set(changes.map(c => c.field));

  // Filter out Comment field (shown separately below the card)
  changes = changes.filter(c => c.field !== 'Comment');

  // Group changes by category
  const statAdded    = changes.filter(c => c.field === 'Stat added');
  const statRemoved  = changes.filter(c => c.field === 'Stat removed');
  const compAdded    = changes.filter(c => c.field === 'Component added');
  const compRemoved  = changes.filter(c => c.field === 'Component removed');

  const fromStats = fromItem.stats || [];
  const toStats   = toItem.stats || [];
  const removedStatSet = new Set(statRemoved.map(c => c.from));
  const addedStatSet   = new Set(statAdded.map(c => c.to));

  // Build diff for header fields
  const toHasReqs   = toItem.requires && toItem.requires.length > 0;
  const fromHasReqs = fromItem.requires && fromItem.requires.length > 0;
  let costHtml;
  if (fromItem.cost !== toItem.cost || fromItem.totalCost !== toItem.totalCost) {
    const fromLabel = fromHasReqs && fromItem.totalCost ? `${fromItem.totalCost}g (${fromItem.cost}g)` : `${fromItem.cost}g`;
    const toLabel   = toHasReqs && toItem.totalCost ? `${toItem.totalCost}g (${toItem.cost}g)` : `${toItem.cost}g`;
    costHtml = `<span class="cl-cost"><span class="cl-old">${fromLabel}</span> &rarr;<span class="cl-new">${toLabel}</span></span>`;
  } else {
    costHtml = toHasReqs && toItem.totalCost
      ? `<span class="cl-cost">${toItem.totalCost}g (${toItem.cost}g recipe)</span>`
      : `<span class="cl-cost">${toItem.cost}g</span>`;
  }

  // Stats diff
  let statsHtml = '';
  const allStats = [];
  // Kept stats (in toStats and not added)
  toStats.forEach(s => {
    if (addedStatSet.has(s)) {
      allStats.push(`<span class="cl-stat cl-stat-added">+ ${esc(s)}</span>`);
    } else {
      allStats.push(`<span class="cl-stat">${esc(s)}</span>`);
    }
  });
  // Removed stats (in fromStats but not in toStats)
  fromStats.forEach(s => {
    if (removedStatSet.has(s)) {
      allStats.push(`<span class="cl-stat cl-stat-removed"><s>${esc(s)}</s></span>`);
    }
  });
  if (allStats.length) {
    statsHtml = `<div class="cl-section">
      <div class="cl-section-title">Stats</div>
      <div class="cl-stats">${allStats.join('')}</div>
    </div>`;
  }

  // Active diff
  let activeHtml = '';
  const activeChange = changes.find(c => c.field === 'Active added' || c.field === 'Active removed' ||
    c.field === 'Active name' || c.field === 'Active cooldown' || c.field === 'Active description');
  if (toItem.active || fromItem.active) {
    const wasRemoved = changes.some(c => c.field === 'Active removed');
    const wasAdded   = changes.some(c => c.field === 'Active added');

    if (wasRemoved && fromItem.active) {
      activeHtml = `<div class="cl-section">
        <div class="cl-section-title">Active</div>
        <div class="cl-ability cl-ability-removed"><s><b>${esc(fromItem.active.name)}</b>${fromItem.active.cooldown ? ` [${esc(fromItem.active.cooldown)}]` : ''} — ${esc(fromItem.active.description)}</s></div>
      </div>`;
    } else if (wasAdded && toItem.active) {
      activeHtml = `<div class="cl-section">
        <div class="cl-section-title">Active</div>
        <div class="cl-ability cl-ability-added"><b>${esc(toItem.active.name)}</b>${toItem.active.cooldown ? ` [${esc(toItem.active.cooldown)}]` : ''} — ${esc(toItem.active.description)}</div>
      </div>`;
    } else if (toItem.active) {
      // Show with inline diffs
      const a = fromItem.active || {};
      const b = toItem.active;
      const nameChanged = a.name !== b.name;
      const cdChanged   = a.cooldown !== b.cooldown;
      const descChanged = a.description !== b.description;
      const anyChange   = nameChanged || cdChanged || descChanged;

      let parts = '';
      if (nameChanged) {
        parts += `<span class="cl-old">${esc(a.name)}</span> &rarr;<b class="cl-new">${esc(b.name)}</b>`;
      } else {
        parts += `<b>${esc(b.name)}</b>`;
      }
      if (b.cooldown || a.cooldown) {
        if (cdChanged) {
          parts += ` <span class="cl-old">[${esc(a.cooldown || '—')}]</span> &rarr;<span class="cl-new">[${esc(b.cooldown || '—')}]</span>`;
        } else {
          parts += ` [${esc(b.cooldown)}]`;
        }
      }
      parts += ' — ';
      if (descChanged) {
        parts += `<span class="cl-old">${esc(a.description)}</span><br>&rarr; <span class="cl-new">${esc(b.description)}</span>`;
      } else {
        parts += esc(b.description);
      }
      activeHtml = `<div class="cl-section">
        <div class="cl-section-title">Active${anyChange ? ' <span class="cl-modified-tag">modified</span>' : ''}</div>
        <div class="cl-ability">${parts}</div>
      </div>`;
    }
  }

  // Passives diff
  let passivesHtml = '';
  const fromPassMap = new Map((fromItem.passives || []).map(p => [p.name, p.description]));
  const toPassMap   = new Map((toItem.passives || []).map(p => [p.name, p.description]));
  const passiveEntries = [];

  // Show all passives in toItem
  (toItem.passives || []).forEach(p => {
    if (!fromPassMap.has(p.name)) {
      // Added
      passiveEntries.push(`<div class="cl-ability cl-ability-added"><b>${esc(p.name)}</b> — ${esc(p.description)}</div>`);
    } else if (fromPassMap.get(p.name) !== p.description) {
      // Modified
      passiveEntries.push(`<div class="cl-ability"><b>${esc(p.name)}</b> <span class="cl-modified-tag">modified</span><br>
        <span class="cl-old">${esc(fromPassMap.get(p.name))}</span><br>
        &rarr;<span class="cl-new">${esc(p.description)}</span></div>`);
    } else {
      // Unchanged
      passiveEntries.push(`<div class="cl-ability"><b>${esc(p.name)}</b> — ${esc(p.description)}</div>`);
    }
  });
  // Show removed passives
  (fromItem.passives || []).forEach(p => {
    if (!toPassMap.has(p.name)) {
      passiveEntries.push(`<div class="cl-ability cl-ability-removed"><s><b>${esc(p.name)}</b> — ${esc(p.description)}</s></div>`);
    }
  });
  if (passiveEntries.length) {
    passivesHtml = `<div class="cl-section">
      <div class="cl-section-title">Passives</div>
      ${passiveEntries.join('')}
    </div>`;
  }

  // Components diff
  let compsHtml = '';
  const fromReqs = (fromItem.requires || []).map(r => ({ key: `${r.id}×${r.count}`, name: itemName(r.id), count: r.count, id: r.id }));
  const toReqs   = (toItem.requires || []).map(r => ({ key: `${r.id}×${r.count}`, name: itemName(r.id), count: r.count, id: r.id }));
  const fromReqKeys = new Set(fromReqs.map(r => r.key));
  const toReqKeys   = new Set(toReqs.map(r => r.key));

  const compEntries = [];
  toReqs.forEach(r => {
    const label = r.count > 1 ? `${r.name} ×${r.count}` : r.name;
    if (!fromReqKeys.has(r.key)) {
      compEntries.push(`<span class="cl-comp cl-comp-added">+ ${esc(label)}</span>`);
    } else {
      compEntries.push(`<span class="cl-comp">${esc(label)}</span>`);
    }
  });
  fromReqs.forEach(r => {
    const label = r.count > 1 ? `${r.name} ×${r.count}` : r.name;
    if (!toReqKeys.has(r.key)) {
      compEntries.push(`<span class="cl-comp cl-comp-removed"><s>${esc(label)}</s></span>`);
    }
  });
  if (compEntries.length) {
    compsHtml = `<div class="cl-section">
      <div class="cl-section-title">Components</div>
      <div class="cl-comps">${compEntries.join('')}</div>
    </div>`;
  }

  // Use (consumable) diff
  let useHtml = '';
  if (fromItem.use || toItem.use) {
    if (fromItem.use && !toItem.use) {
      useHtml = `<div class="cl-section"><div class="cl-section-title">Use</div>
        <div class="cl-ability cl-ability-removed"><s>${esc(fromItem.use)}</s></div></div>`;
    } else if (!fromItem.use && toItem.use) {
      useHtml = `<div class="cl-section"><div class="cl-section-title">Use</div>
        <div class="cl-ability cl-ability-added">${esc(toItem.use)}</div></div>`;
    } else if (fromItem.use !== toItem.use) {
      useHtml = `<div class="cl-section"><div class="cl-section-title">Use <span class="cl-modified-tag">modified</span></div>
        <div class="cl-ability"><span class="cl-old">${esc(fromItem.use)}</span><br>&rarr; <span class="cl-new">${esc(toItem.use)}</span></div></div>`;
    }
  }

  const commentItem = toItem.comment ? toItem : (fromItem.comment ? fromItem : null);
  const commentHtml = commentItem?.comment
    ? `<div class="cl-comment"><span class="cl-comment-label">Comment:</span> ${esc(commentItem.comment)}</div>` : '';

  // Build the changes-only section
  const hasChanges = statsHtml || useHtml || activeHtml || passivesHtml || compsHtml;

  return `
    <div class="cl-entry cl-entry-changed">
      <div class="cl-entry-header">
        <span class="cl-badge changed">CHANGED</span>
        <span class="cl-item-name">${esc(toItem.name)}</span>
        <span class="cl-tier">${TIER_DISPLAY[toItem.tier] || toItem.tier}</span>
        <span class="cl-cat" style="color:${CAT_COLORS[toItem.category] || '#94a3b8'}">${toItem.category}</span>
        ${costHtml}
      </div>
      <div class="cl-card cl-card-current">
        ${renderItemBody(toItem, itemName)}
      </div>
      ${hasChanges ? `<div class="cl-changes-title">Changes</div>
      <div class="cl-card cl-card-diff">
        ${statsHtml}${useHtml}${activeHtml}${passivesHtml}${compsHtml}
      </div>` : ''}
      ${commentHtml}
    </div>`;
}

// ── Render a full item body (for added/removed) ──────────

function renderItemBody(item, itemName) {
  let html = '';

  if (item.stats?.length) {
    html += `<div class="cl-section"><div class="cl-section-title">Stats</div>
      <div class="cl-stats">${item.stats.map(s => `<span class="cl-stat">${esc(s)}</span>`).join('')}</div></div>`;
  }

  if (item.use) {
    html += `<div class="cl-section"><div class="cl-section-title">Use</div>
      <div class="cl-ability">${esc(item.use)}</div></div>`;
  }

  if (item.active) {
    html += `<div class="cl-section"><div class="cl-section-title">Active</div>
      <div class="cl-ability"><b>${esc(item.active.name)}</b>${item.active.cooldown ? ` [${esc(item.active.cooldown)}]` : ''} — ${esc(item.active.description)}</div></div>`;
  }

  if (item.passives?.length) {
    html += `<div class="cl-section"><div class="cl-section-title">Passives</div>`;
    item.passives.forEach(p => {
      html += `<div class="cl-ability"><b>${esc(p.name)}</b> — ${esc(p.description)}</div>`;
    });
    html += `</div>`;
  }

  if (item.requires?.length) {
    html += `<div class="cl-section"><div class="cl-section-title">Components</div>
      <div class="cl-comps">${item.requires.map(r => {
        const name = itemName(r.id);
        const label = r.count > 1 ? `${name} ×${r.count}` : name;
        return `<span class="cl-comp">${esc(label)}</span>`;
      }).join('')}</div></div>`;
  }

  return html;
}

// ── Export ────────────────────────────────────────────────

function exportItemText(item, itemName, indent) {
  let text = '';
  if (item.stats?.length)
    text += `${indent}Stats: ${item.stats.join(', ')}\n`;
  if (item.use)
    text += `${indent}Use: ${item.use}\n`;
  if (item.active)
    text += `${indent}Active: ${item.active.name}${item.active.cooldown ? ` [${item.active.cooldown}]` : ''} — ${item.active.description}\n`;
  if (item.passives?.length)
    item.passives.forEach(p => { text += `${indent}Passive: ${p.name} — ${p.description}\n`; });
  if (item.requires?.length) {
    const comps = item.requires.map(r => {
      const name = itemName(r.id);
      return r.count > 1 ? `${name} ×${r.count}` : name;
    });
    text += `${indent}Components: ${comps.join(', ')}\n`;
  }
  return text;
}

function exportText(results, fromLabel, toLabel) {
  // Build name lookup from results
  const nameMap = new Map();
  results.forEach(r => {
    [r.item, r.fromItem].forEach(it => {
      if (!it) return;
      nameMap.set(it.id, it.name);
      (it.requires || []).forEach(req => { if (!nameMap.has(req.id)) nameMap.set(req.id, req.id); });
    });
  });
  const itemName = id => nameMap.get(id) || id;

  let text = `ITEM TREE CHANGELOG\n`;
  text += `From: ${fromLabel}  -->  To: ${toLabel}\n`;
  text += `Generated: ${new Date().toLocaleString()}\n`;
  text += `${'-'.repeat(50)}\n\n`;

  results.forEach(r => {
    const item = r.item || r.fromItem;
    const tier = TIER_DISPLAY[item?.tier] || item?.tier;
    const cost = item?.totalCost && item?.totalCost !== item?.cost
      ? `${item.totalCost}g (${item.cost}g recipe)` : `${item?.cost}g`;

    if (r.type === 'added') {
      text += `[NEW] ${item.name} — ${tier} | ${item.category} | ${cost}\n`;
      text += exportItemText(item, itemName, '  ');
    } else if (r.type === 'removed') {
      text += `[REMOVED] ${item.name} — ${tier} | ${item.category} | ${cost}\n`;
    } else {
      text += `[CHANGED] ${item.name} — ${tier} | ${item.category} | ${cost}\n`;
      text += exportItemText(r.item, itemName, '  ');
      text += `  -- Changes --\n`;
      r.changes.forEach(c => {
        if (c.from === null)    text += `    + ${c.field}: ${c.to}\n`;
        else if (c.to === null) text += `    - ${c.field}: ${c.from}\n`;
        else                    text += `    ~ ${c.field}: "${c.from}" --> "${c.to}"\n`;
      });
    }
    if (item?.comment) text += `  Note: ${item.comment}\n`;
    text += '\n';
  });
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `changelog_${Date.now()}.txt`;
  a.click();
}

// ── Events ────────────────────────────────────────────────

document.getElementById('diffBtn').addEventListener('click', () => {
  const fromId  = document.getElementById('fromSelect').value;
  const toId    = document.getElementById('toSelect').value;

  if (fromId === toId) {
    document.getElementById('changelogOutput').innerHTML =
      `<div class="empty-state"><h3>Same version selected</h3><p>Choose two different versions to compare.</p></div>`;
    return;
  }

  const fromItems = getItemsForVersion(fromId);
  const toItems   = getItemsForVersion(toId);
  const results   = versions.diffItemSets(fromItems, toItems);

  const fromLabel = versions.getById(fromId)?.name || fromId;
  const toLabel   = versions.getById(toId)?.name   || toId;
  renderDiff(results, fromLabel, toLabel, fromItems, toItems);
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const fromId  = document.getElementById('fromSelect').value;
  const toId    = document.getElementById('toSelect').value;
  const fromItems = getItemsForVersion(fromId);
  const toItems   = getItemsForVersion(toId);
  const results   = versions.diffItemSets(fromItems, toItems);
  const fromLabel = versions.getById(fromId)?.name || fromId;
  const toLabel   = versions.getById(toId)?.name   || toId;
  exportText(results, fromLabel, toLabel);
});

// Update when version changes
document.addEventListener('versionchange', populateSelects);

// ── Init ─────────────────────────────────────────────────

versions.initPicker('versionPicker');
populateSelects();
