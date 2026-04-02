// ============================================================
//  Simulator  –  titan stat & DPS calculator
// ============================================================

// Titan data from user's authoritative table
// VIT=STR, CEL=AGI, WIS=INT. Stats are at level 1.
const TITANS = {
  moltenious:  { name: 'Moltenious',  BAT: 0.810, base_agi: 1, base_str: 18, base_int: 16, agi_per_lvl: 2.0, str_per_lvl: 7.5, int_per_lvl: 6.5, base_hp: 2000, base_mana: 450, base_hp_regen: 8.5, base_mp_regen: 6.0 },
  arborius:    { name: 'Arborius',    BAT: 0.810, base_agi: 1, base_str: 16, base_int: 14, agi_per_lvl: 2.0, str_per_lvl: 7.0, int_per_lvl: 5.0, base_hp: 1900, base_mana: 450, base_hp_regen: 10.0, base_mp_regen: 5.5 },
  breezerious: { name: 'Breezerious', BAT: 0.810, base_agi: 1, base_str: 15, base_int: 20, agi_per_lvl: 2.0, str_per_lvl: 6.0, int_per_lvl: 6.0, base_hp: 2000, base_mana: 450, base_hp_regen: 7.0, base_mp_regen: 6.0 },
  granitacles: { name: 'Granitacles', BAT: 1.150, base_agi: 1, base_str: 20, base_int: 15, agi_per_lvl: 2.0, str_per_lvl: 9.0, int_per_lvl: 6.0, base_hp: 2000, base_mana: 450, base_hp_regen: 8.0, base_mp_regen: 6.0 },
  fossurious:  { name: 'Fossurious',  BAT: 0.860, base_agi: 1, base_str: 17, base_int: 15, agi_per_lvl: 2.0, str_per_lvl: 7.0, int_per_lvl: 6.0, base_hp: 2000, base_mana: 450, base_hp_regen: 7.0, base_mp_regen: 6.0 },
  lucidious:   { name: 'Lucidious',   BAT: 0.810, base_agi: 1, base_str: 18, base_int: 16, agi_per_lvl: 2.0, str_per_lvl: 7.5, int_per_lvl: 6.0, base_hp: 2000, base_mana: 450, base_hp_regen: 8.0, base_mp_regen: 6.0 },
  glacious:    { name: 'Glacious',    BAT: 0.961, base_agi: 1, base_str: 18, base_int: 17, agi_per_lvl: 2.0, str_per_lvl: 7.0, int_per_lvl: 9.0, base_hp: 1900, base_mana: 450, base_hp_regen: 7.0, base_mp_regen: 6.0 },
  bubonicus:   { name: 'Bubonicus',   BAT: 0.810, base_agi: 1, base_str: 20, base_int: 15, agi_per_lvl: 2.0, str_per_lvl: 8.0, int_per_lvl: 6.0, base_hp: 2000, base_mana: 450, base_hp_regen: 18.0, base_mp_regen: 6.0 },
  demonicus:   { name: 'Demonicus',   BAT: 0.961, base_agi: 1, base_str: 15, base_int: 18, agi_per_lvl: 2.0, str_per_lvl: 6.5, int_per_lvl: 8.5, base_hp: 2000, base_mana: 450, base_hp_regen: 8.0, base_mp_regen: 6.0 },
  noxious:     { name: 'Noxious',     BAT: 0.799, base_agi: 1, base_str: 17, base_int: 18, agi_per_lvl: 2.0, str_per_lvl: 8.0, int_per_lvl: 6.0, base_hp: 2000, base_mana: 450, base_hp_regen: 12.5, base_mp_regen: 6.0 },
  voltron:     { name: 'Voltron',     BAT: 0.810, base_agi: 1, base_str: 15, base_int: 15, agi_per_lvl: 2.0, str_per_lvl: 6.5, int_per_lvl: 6.0, base_hp: 2000, base_mana: 450, base_hp_regen: 7.0, base_mp_regen: 5.0 },
};

const TIER_LABELS = { consumable: 'Consumable', t1: 'Tier 1', t2: 'Tier 2', t3: 'Tier 3' };
const TIER_ORDER  = ['consumable', 't1', 't2', 't3'];
const DMG_VS_HERO = { ranged: 0.5, magic: 1.0 };
const DMG_FROM_HERO = { fortified: 0.55, heavy: 0.75 };

// Tower database from spreadsheet {builder: {tier: {name, dps, type}}}
const TOWERS = {
  murloc:    { base: {n:'Dart Tower',dps:29.4,t:'ranged'}, enhanced: {n:'Enhanced Dart',dps:41.2,t:'ranged'}, super: {n:'Super Dart',dps:52.9,t:'ranged'}, mega: {n:'Mega Dart (upgr)',dps:81.2,t:'ranged'} },
  gnoll:     { base: {n:'Axe Tower',dps:17.6,t:'ranged'}, enhanced: {n:'Enhanced Axe',dps:29.4,t:'ranged'}, super: {n:'Super Axe',dps:41.2,t:'ranged'}, mega: {n:'Deadly Axe',dps:58.8,t:'ranged'} },
  pirate:    { base: {n:'Frigate',dps:30,t:'ranged'}, enhanced: {n:'Enhanced Frigate',dps:39.5,t:'ranged'}, super: {n:'Super Frigate',dps:53.6,t:'ranged'}, mega: {n:'Mega Frigate (LN)',dps:75,t:'ranged'} },
  makrura:   { base: {n:'Tidal Guardian',dps:20,t:'ranged'}, enhanced: {n:'Enhanced Tidal',dps:33.3,t:'ranged'}, super: {n:'Enlarged Tidal',dps:46.7,t:'ranged'}, mega: {n:'Enraged Tidal (EC)',dps:66.7,t:'ranged'} },
  dryad:     { base: {n:'Feral Stage 2',dps:22.7,t:'ranged'}, enhanced: {n:'Feral Stage 5',dps:40.9,t:'ranged'}, super: {n:'Feral Stage 7',dps:54.5,t:'ranged'}, mega: {n:'Feral Stage 10',dps:72.7,t:'ranged'} },
  morphling: { base: {n:'Pulse Tower',dps:32,t:'ranged'}, enhanced: {n:'Enhanced Pulse',dps:44,t:'ranged'}, super: {n:'Super Pulse',dps:56,t:'ranged'}, mega: {n:'Mega Pulse',dps:88,t:'ranged'} },
  goblin:    { base: {n:'Cannon Tower',dps:35.3,t:'ranged'}, enhanced: {n:'Enhanced Cannon',dps:47.1,t:'ranged'}, super: {n:'Super Cannon',dps:58.8,t:'ranged'}, mega: {n:'Mega Cannon (ICT)',dps:94.1,t:'ranged'} },
  faerie:    { base: {n:'Energy Tower',dps:29.4,t:'ranged'}, enhanced: {n:'Enhanced Energy',dps:41.2,t:'ranged'}, super: {n:'Super Energy',dps:52.9,t:'ranged'}, mega: {n:'Mega Energy',dps:64.7,t:'ranged'} },
  nature:    { base: {n:'Protector Tree',dps:29.4,t:'ranged'}, enhanced: {n:'Enhanced Protector',dps:41.2,t:'ranged'}, super: {n:'Super Protector',dps:60,t:'ranged'}, mega: {n:'Mega Protector',dps:78.6,t:'ranged'} },
  troll:     { base: {n:'Spear Tower',dps:26.7,t:'ranged'}, enhanced: {n:'Enhanced Spear',dps:35.7,t:'ranged'}, super: {n:'Super Spear',dps:46.2,t:'ranged'}, mega: {n:'Mega Spear (Haste)',dps:115.4,t:'ranged'} },
  tauren:    { base: {n:'Totem Tower',dps:115.8,t:'ranged'}, enhanced: {n:'Enhanced Totem',dps:157.9,t:'ranged'}, super: {n:'Super Totem',dps:200,t:'ranged'}, mega: {n:'Mega Totem',dps:221.1,t:'ranged'} },
  radioactive:{base:{n:'Radon Tower',dps:23.5,t:'ranged'}, enhanced: {n:'Enhanced Radon',dps:35.3,t:'ranged'}, super: {n:'Super Radon',dps:47.1,t:'ranged'}, mega: {n:'Mega Rapid (full)',dps:129.6,t:'ranged'} },
  ogre:      { base: {n:'Catapult',dps:29.4,t:'ranged'}, enhanced: {n:'Catapult (upgr)',dps:64.7,t:'ranged'}, super: {n:'Catapult (upgr)',dps:64.7,t:'ranged'}, mega: {n:'Catapult (full)',dps:64.7,t:'ranged'} },
  arachnid:  { base: {n:'Webweaver',dps:50,t:'ranged'}, enhanced: {n:'Enhanced Webweaver',dps:61.1,t:'ranged'}, super: {n:'Super Webweaver',dps:72.2,t:'ranged'}, mega: {n:'Mega Webweaver',dps:83.3,t:'ranged'} },
  draenei:   { base: {n:'Arcane Construct',dps:25,t:'ranged'}, enhanced: {n:'Enhanced Arcane',dps:37.5,t:'ranged'}, super: {n:'Super Arcane',dps:50,t:'ranged'}, mega: {n:'Mega Arcane',dps:62.5,t:'ranged'} },
  panda:     { base: {n:'Arrow Tower',dps:17.6,t:'ranged'}, enhanced: {n:'Enhanced Arrow',dps:23.5,t:'ranged'}, super: {n:'Super Arrow',dps:29.4,t:'ranged'}, mega: {n:'Mega Arrow (SA3)',dps:58.8,t:'ranged'} },
};

// ── State ────────────────────────────────────────────────

let currentTitan = 'lucidious';
let currentLevel = 2;
let currentVersionId = 'base';
let equippedItems = [null, null, null, null, null, null];
let itemOverrides = [{}, {}, {}, {}, {}, {}];
let versionItems = [];
let pickerSlotIdx = -1;
let pickerTarget = 'A'; // 'A' or 'B'
let compareMode = false;
let titanLinked = true; // B uses same titan/level as A
let currentTitanB = 'lucidious';
let currentLevelB = 2;
let equippedItemsB = [null, null, null, null, null, null];
let itemOverridesB = [{}, {}, {}, {}, {}, {}];

// ── Helpers ──────────────────────────────────────────────

function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function fmt(n, d) {
  if (!isFinite(n)) return n > 0 ? '&infin;' : '-&infin;';
  return d !== undefined ? n.toFixed(d) : String(Math.round(n * 10) / 10);
}
function parseNum(str) { const m = str.match(/([\d.]+)/); return m ? parseFloat(m[1]) : 0; }
function extractNum(desc, rx) { const m = desc.match(rx); return m ? parseFloat(m[1]) : 0; }
function el(id) { return document.getElementById(id); }
function setHtml(id, val) { const e = el(id); if (e) e.innerHTML = val; }

// Show A vs B comparison
function setWithDiff(id, valA, fmtA, higherIsBetter, valB, fmtB) {
  const e = el(id);
  if (!e) return;
  if (!compareMode || valB === undefined || valB === null) {
    e.innerHTML = fmtA;
    return;
  }
  const diff = valA - valB;
  if (Math.abs(diff) < 0.05) {
    e.innerHTML = `${fmtA} <span class="sim-diff sim-diff-neutral">vs ${fmtB}</span>`;
    return;
  }
  const isGoodA = higherIsBetter ? diff > 0 : diff < 0;
  e.innerHTML = `<span class="${isGoodA ? 'sim-diff-up' : 'sim-diff-down'}">${fmtA}</span> <span class="sim-diff sim-diff-neutral">vs</span> <span class="${isGoodA ? 'sim-diff-down' : 'sim-diff-up'}">${fmtB}</span>`;
}

// ── Titan base stats ─────────────────────────────────────

function computeArmor(level) {
  let a = 6;
  for (let lv = 3; lv <= level; lv++) a += (lv % 2 === 1) ? 1 : 2;
  return a;
}

function getBaseStats() {
  const t = TITANS[currentTitan];
  const g = currentLevel - 1;
  return {
    str: t.base_str + t.str_per_lvl * g,
    agi: t.base_agi + t.agi_per_lvl * g,
    int: t.base_int + t.int_per_lvl * g,
    baseDamage: 130 + (currentLevel - 2) * 10,
    armor: computeArmor(currentLevel),
    BAT: t.BAT
  };
}

// ── Item stat parsing ────────────────────────────────────

function parseItemStats(items) {
  const s = { ad: 0, asPct: 0, hp: 0, mana: 0, hpRegen: 0, manaRegen: 0, armor: 0, mdr: 0, vit: 0, cel: 0, wis: 0 };
  items.forEach((item, si) => {
    if (!item?.stats) return;
    item.stats.forEach((str, idx) => {
      let val = parseNum(str);
      const ov = itemOverrides[si]?.stats?.[idx];
      if (ov !== undefined) val = parseFloat(ov) || 0;
      if (/attack speed/i.test(str)) s.asPct += val;
      else if (/magic.*damage.*reduction/i.test(str)) s.mdr += val;
      else if (/hp regen|hp regeneration/i.test(str)) s.hpRegen += val;
      else if (/mana regen/i.test(str)) s.manaRegen += val;
      else if (/hit point/i.test(str)) s.hp += val;
      else if (/mana point/i.test(str)) s.mana += val;
      else if (/damage/i.test(str) && !/structure|reduction/i.test(str)) s.ad += val;
      else if (/armor/i.test(str)) s.armor += val;
      else if (/vitality/i.test(str)) s.vit += val;
      else if (/celerity/i.test(str)) s.cel += val;
      else if (/windsom/i.test(str)) s.wis += val;
    });
  });
  return s;
}

// ── Passive recognition ──────────────────────────────────

function parsePassives(items) {
  const p = {
    runicMarkDmg: 0, structCrusherDmg: 0, titanCrusherDmg: 0,
    burnPct: 0, burnFlatDPS: 0, infernalBonusDmg: 0,
    lifestealFlat: 0, lifestealPct: 0,
    colossus: false, colossusPct: 0,
    fervorMaxAS: 0, fervorStacks: 6,
    tidalFortPct: 0, tidalFortArmor: 0,
    crisisRegen: false, swiftCastingPct: 0, healAmpPct: 0,
    corrosiveArmor: 0, shadowRuneDmg: 0,
    voodooADPerWard: 0, nukeBonus: 0,
    runicWrathWindsom: 0, runicWrathMana: 0, spellbladeMaxAS: 0,
    auraWarPct: 0, battleTempoCDR: 0, spellStrikeAD: 0,
    effects: []
  };

  items.forEach((item, si) => {
    if (!item) return;
    const all = [...(item.passives || [])];
    if (item.active) all.push({ name: item.active.name, description: item.active.description, _isActive: true });

    all.forEach((pas, pi) => {
      const name = pas.name || '';
      let desc = pas.description || '';
      // Apply overrides
      const ov = itemOverrides[si]?.passives?.[pi];
      if (ov !== undefined) desc = ov;

      const isActive = pas._isActive;
      const tag = isActive ? 'Active' : 'Passive';

      // Runic Mark
      if (/^runic mark$/i.test(name)) {
        const v = extractNum(desc, /deals?\s+(\d+)\s+(?:bonus\s+)?magic/i) || extractNum(desc, /(\d+)\s+bonus magic damage/i);
        p.runicMarkDmg = Math.max(p.runicMarkDmg, v);
        if (v) p.effects.push({ tag, name, val: `${v} magic/proc`, item: item.name, desc, slot: si, idx: pi });
      }
      // Shadow Rune
      else if (/shadow rune/i.test(name)) {
        const v = extractNum(desc, /deals?\s+(\d+)\s+magic/i);
        p.shadowRuneDmg = Math.max(p.shadowRuneDmg, v);
        if (v) p.effects.push({ tag, name, val: `${v} magic/proc`, item: item.name, desc, slot: si, idx: pi });
      }
      // Structure Crusher
      else if (/structure crusher/i.test(name)) {
        p.structCrusherDmg = Math.min(10 + 2 * currentLevel, 30);
        p.effects.push({ tag, name, val: `${p.structCrusherDmg}/hit`, item: item.name, desc, slot: si, idx: pi });
      }
      // Titan Crusher
      else if (/titan crusher/i.test(name)) {
        const baseM = extractNum(desc, /^.*?(\d+)\s*\+/);
        const perLvl = extractNum(desc, /\+\s*\(?(\d+)\s*[x×]/i);
        const cap = extractNum(desc, /maximum of (\d+)/i) || 50;
        p.titanCrusherDmg = Math.min((baseM || 20) + (perLvl || 5) * currentLevel, cap);
        p.effects.push({ tag, name, val: `${p.titanCrusherDmg}/hit`, item: item.name, desc, slot: si, idx: pi });
      }
      // Structure Burn / Infernal Siege
      else if (/structure burn|infernal siege/i.test(name)) {
        const pctV = extractNum(desc, /(\d+)%\s+of/i);
        const flatV = extractNum(desc, /dealing\s+(\d+)\s+damage per second/i);
        if (pctV) p.burnPct = Math.max(p.burnPct, pctV);
        if (flatV) p.burnFlatDPS += flatV;
        p.infernalBonusDmg = Math.max(p.infernalBonusDmg, extractNum(desc, /additional\s+(\d+)/i));
        p.effects.push({ tag, name, val: pctV ? `${pctV}% HP/10s` : `${flatV} DPS`, item: item.name, desc, slot: si, idx: pi });
      }
      // Fiery Touch
      else if (/fiery touch/i.test(name)) {
        const pctV = extractNum(desc, /(\d+)%\s+of/i);
        const flatV = extractNum(desc, /(\d+)\s+damage per second/i);
        if (pctV) p.burnPct = Math.max(p.burnPct, pctV);
        if (flatV) p.burnFlatDPS += flatV;
        p.effects.push({ tag, name, val: `${flatV} DPS${pctV ? ` + ${pctV}%` : ''}`, item: item.name, desc, slot: si, idx: pi });
      }
      // Vampirism / Lifesteal
      else if (/vampirism|^lifesteal$/i.test(name)) {
        p.lifestealFlat = Math.max(p.lifestealFlat, extractNum(desc, /heal.*?(\d+)/i));
        const pctM = desc.match(/(\d+)%\s+(?:of\s+)?(?:damage|vitality|primary)/i);
        if (pctM) p.lifestealPct = Math.max(p.lifestealPct, parseInt(pctM[1]));
        p.effects.push({ tag, name, val: `${p.lifestealFlat}${p.lifestealPct ? ` + ${p.lifestealPct}%` : ''}`, item: item.name, desc, slot: si, idx: pi });
      }
      // Voodoo Power / Voodoo
      else if (/voodoo power|^voodoo$/i.test(name)) {
        const adM = extractNum(desc, /grants?\s+(\d+)\s+(?:extra\s+)?attack damage/i);
        if (adM) p.voodooADPerWard = adM;
        p.lifestealFlat = Math.max(p.lifestealFlat, extractNum(desc, /heal.*?(\d+)/i));
        const vitM = extractNum(desc, /(\d+)%\s+vitality/i);
        if (vitM) p.lifestealPct = Math.max(p.lifestealPct, vitM);
        p.effects.push({ tag, name, val: `+${adM} AD/ward`, item: item.name, desc, slot: si, idx: pi });
      }
      // Colossus
      else if (/colossus/i.test(name)) {
        p.colossus = true;
        p.colossusPct = extractNum(desc, /([\d.]+)%/);
        p.effects.push({ tag, name, val: `${p.colossusPct}% max HP/hit`, item: item.name, desc, slot: si, idx: pi });
      }
      // Fervor
      else if (/^fervor$/i.test(name)) {
        const asMatches = [...desc.matchAll(/(\d+)%/gi)];
        if (asMatches.length) p.fervorMaxAS = Math.max(p.fervorMaxAS, parseInt(asMatches[asMatches.length - 1][1]));
        const stackM = desc.match(/up to (\d+) times/i);
        if (stackM) p.fervorStacks = parseInt(stackM[1]);
        p.effects.push({ tag, name, val: `+${p.fervorMaxAS}% AS max`, item: item.name, desc, slot: si, idx: pi });
      }
      // Tidal Fortitude
      else if (/tidal fortitude/i.test(name)) {
        p.tidalFortPct += extractNum(desc, /reduced by (\d+)%/i);
        p.tidalFortArmor += extractNum(desc, /gains?\s+(\d+)\s+(?:bonus\s+|extra\s+)?armor/i);
        p.effects.push({ tag, name, val: `-${p.tidalFortPct}% dmg, +${p.tidalFortArmor} armor`, item: item.name, desc, slot: si, idx: pi });
      }
      // Crisis Regen
      else if (/crisis regen/i.test(name)) {
        p.crisisRegen = true;
        p.effects.push({ tag, name, val: '2x regen <50% HP', item: item.name, desc, slot: si, idx: pi });
      }
      // Swift Casting
      else if (/swift casting/i.test(name)) {
        p.swiftCastingPct = Math.max(p.swiftCastingPct, extractNum(desc, /(\d+)%/));
        p.effects.push({ tag, name, val: `${p.swiftCastingPct}% CDR`, item: item.name, desc, slot: si, idx: pi });
      }
      // Healing Amplification
      else if (/healing amplification/i.test(name)) {
        p.healAmpPct += extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${p.healAmpPct}% heal`, item: item.name, desc, slot: si, idx: pi });
      }
      // Corrosive Attack
      else if (/corrosive attack/i.test(name)) {
        p.corrosiveArmor = extractNum(desc, /by\s+(\d+)/i);
        p.effects.push({ tag, name, val: `-${p.corrosiveArmor} armor/hit (stacks)`, item: item.name, desc, slot: si, idx: pi });
      }
      // Nukemaster
      else if (/nukemaster/i.test(name)) {
        p.nukeBonus = extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${p.nukeBonus}% nuke`, item: item.name, desc, slot: si, idx: pi });
      }
      // Aura of War
      else if (/aura of war/i.test(name)) {
        p.auraWarPct = Math.max(p.auraWarPct, extractNum(desc, /(\d+)%/));
        p.effects.push({ tag, name, val: `+${p.auraWarPct}% AD (allies)`, item: item.name, desc, slot: si, idx: pi });
      }
      // Runic Wrath (structure magic damage)
      else if (/runic wrath/i.test(name)) {
        // "bonus magic damage equal to 30% windsom + 2% max mana to structures"
        p.runicWrathWindsom = extractNum(desc, /(\d+)%\s+windsom/i);
        p.runicWrathMana = extractNum(desc, /(\d+)%\s+max mana/i);
        p.effects.push({ tag, name, val: `${p.runicWrathWindsom}% WIS + ${p.runicWrathMana}% mana`, item: item.name, desc, slot: si, idx: pi });
      }
      // Spellblade (stacking AS from spells)
      else if (/spellblade/i.test(name)) {
        const asPct = extractNum(desc, /(\d+)%\s+stacking attack speed/i);
        const maxStacks = extractNum(desc, /up to (\d+) stacks/i) || 6;
        p.spellbladeMaxAS = asPct * maxStacks;
        p.effects.push({ tag, name, val: `${asPct}% AS/spell, max ${maxStacks} stacks (${p.spellbladeMaxAS}%)`, item: item.name, desc, slot: si, idx: pi });
      }
      // Battle Tempo
      else if (/battle tempo/i.test(name)) {
        p.battleTempoCDR = extractNum(desc, /([\d.]+)\s+second/i);
        p.effects.push({ tag, name, val: `-${p.battleTempoCDR}s CD/atk`, item: item.name, desc, slot: si, idx: pi });
      }
      // Spell Strike
      else if (/spell strike/i.test(name)) {
        p.spellStrikeAD = extractNum(desc, /by\s+(\d+)/i);
        p.effects.push({ tag, name, val: `+${p.spellStrikeAD} AD/spell`, item: item.name, desc, slot: si, idx: pi });
      }
      // Everything else — display only
      else if (name) {
        p.effects.push({ tag, name, val: '', item: item.name, desc, slot: si, idx: pi });
      }
    });
  });
  return p;
}

// ── Simulation over time ─────────────────────────────────

function simulateDPS(duration, totalAD, colossusDmg, BAT, bonusAS, runicMarkDmg, shadowRuneDmg, fervorMaxAS, fervorStacks, spellbladeAS) {
  let totalPhys = 0, totalMagic = 0, time = 0, attacks = 0;
  let fervorCur = 0, runicUp = false, shadowUp = false;
  // Spellblade: assume spells are cast periodically (roughly every 10s with CDR)
  // and each spell grants spellbladeAS/(maxStacks) per cast, stacking
  const sbAS = spellbladeAS || 0;

  while (time < duration) {
    // Fervor ramp: each attack grants one stack
    const fervorBonusAS = fervorStacks > 0 ? (fervorCur / fervorStacks) * fervorMaxAS / 100 : 0;
    const curAS = bonusAS + fervorBonusAS + sbAS;
    const cd = BAT / (1 + curAS);
    time += cd;
    if (time > duration) break;
    attacks++;

    totalPhys += totalAD + colossusDmg;

    // Runic Mark: hit 1 applies mark, hit 2 consumes for damage, etc.
    if (runicMarkDmg > 0) {
      if (runicUp) { totalMagic += runicMarkDmg; runicUp = false; }
      else { runicUp = true; }
    }
    if (shadowRuneDmg > 0) {
      if (shadowUp) { totalMagic += shadowRuneDmg; shadowUp = false; }
      else { shadowUp = true; }
    }

    // Fervor: gain one stack per attack, up to max
    if (fervorMaxAS > 0 && fervorCur < fervorStacks) fervorCur++;
  }

  return { totalPhys, totalMagic, total: totalPhys + totalMagic,
    physDPS: totalPhys / duration, magicDPS: totalMagic / duration,
    totalDPS: (totalPhys + totalMagic) / duration, attacks };
}

// ── Main computation ─────────────────────────────────────

function computeAll(items, overrides, titanKey, level) {
  items = items || equippedItems;
  titanKey = titanKey || currentTitan;
  level = level || currentLevel;
  const savedOverrides = itemOverrides;
  const savedTitan = currentTitan;
  const savedLevel = currentLevel;
  if (overrides) itemOverrides = overrides;
  currentTitan = titanKey;
  currentLevel = level;
  const titan = TITANS[titanKey];
  const base = getBaseStats();
  const iStats = parseItemStats(items);
  const pas = parsePassives(items);
  currentTitan = savedTitan;
  currentLevel = savedLevel;
  if (overrides) itemOverrides = savedOverrides;

  const totalStr = base.str + iStats.vit;
  const totalAgi = base.agi + iStats.cel;
  const totalInt = base.int + iStats.wis;

  const totalHP = titan.base_hp + totalStr * 50 + iStats.hp;
  const totalMana = titan.base_mana + totalInt * 20 + iStats.mana;
  const totalHPRegen = titan.base_hp_regen + totalStr * 0.1 + iStats.hpRegen;
  const totalManaRegen = titan.base_mp_regen + totalInt * 0.1 + iStats.manaRegen;
  const totalArmor = base.armor + iStats.armor + pas.tidalFortArmor;
  const armorRed = 0.06 * totalArmor / (1 + 0.06 * totalArmor); // % blocked
  const armorMult = 1 - armorRed; // fraction that gets through

  const voodooWards = pas.voodooADPerWard > 0 ? 3 : 0;
  // Aura of War: +X% of BASE damage only (white damage)
  const auraADBonus = pas.auraWarPct > 0 ? base.baseDamage * (pas.auraWarPct / 100) : 0;
  const totalAD = base.baseDamage + iStats.ad + pas.voodooADPerWard * voodooWards + auraADBonus;
  const colossusDmg = pas.colossus ? (pas.colossusPct / 100) * totalHP : 0;
  const effectiveAD = totalAD + colossusDmg;

  const bonusAS = 0.008 * totalAgi + iStats.asPct / 100;
  const fervorAS = pas.fervorMaxAS / 100;
  const spellbladeAS = pas.spellbladeMaxAS / 100;
  const cdBase = titan.BAT / (1 + bonusAS);
  const cdMax = titan.BAT / (1 + bonusAS + fervorAS + spellbladeAS);
  const apsBase = 1 / cdBase;
  const apsMax = 1 / cdMax;

  // Instant DPS (no stacks)
  const physDPS = effectiveAD * apsBase;
  const runicProcs = pas.runicMarkDmg > 0 ? apsBase / 2 : 0;
  const shadowProcs = pas.shadowRuneDmg > 0 ? apsBase / 2 : 0;
  const magicDPS = pas.runicMarkDmg * runicProcs + pas.shadowRuneDmg * shadowProcs;
  const totalDPS = physDPS + magicDPS;

  // Ramped DPS (max Fervor + Spellblade stacks)
  const physDPSMax = effectiveAD * apsMax;
  const runicProcsMax = pas.runicMarkDmg > 0 ? apsMax / 2 : 0;
  const shadowProcsMax = pas.shadowRuneDmg > 0 ? apsMax / 2 : 0;
  const magicDPSMax = pas.runicMarkDmg * runicProcsMax + pas.shadowRuneDmg * shadowProcsMax;
  const totalDPSMax = physDPSMax + magicDPSMax;

  const sim10 = simulateDPS(10, totalAD, colossusDmg, titan.BAT, bonusAS, pas.runicMarkDmg, pas.shadowRuneDmg, pas.fervorMaxAS, pas.fervorStacks, spellbladeAS);
  const sim30 = simulateDPS(30, totalAD, colossusDmg, titan.BAT, bonusAS, pas.runicMarkDmg, pas.shadowRuneDmg, pas.fervorMaxAS, pas.fervorStacks, spellbladeAS);
  const sim60 = simulateDPS(60, totalAD, colossusDmg, titan.BAT, bonusAS, pas.runicMarkDmg, pas.shadowRuneDmg, pas.fervorMaxAS, pas.fervorStacks, spellbladeAS);

  const lifestealPerHit = pas.lifestealFlat + (pas.lifestealPct / 100) * totalStr;
  const lifestealPerSec = lifestealPerHit * apsBase;
  const cdr = pas.swiftCastingPct;

  // Structure (walls are always Fortified)
  const sArm = parseInt(el('structArmor')?.value) || 15;
  const sHP = parseInt(el('structHP')?.value) || 500;
  const sArmMult = 1 - 0.06 * sArm / (1 + 0.06 * sArm);
  const sFactor = 0.55; // Titanic vs Fortified = 55%
  const sPhysPerHit = effectiveAD * sFactor * sArmMult;

  // Magic damage to structures: Runic Mark procs + Runic Wrath
  const sRunicPerHit = pas.runicMarkDmg > 0 ? pas.runicMarkDmg / 2 : 0; // every other hit avg
  const sShadowPerHit = pas.shadowRuneDmg > 0 ? pas.shadowRuneDmg / 2 : 0;
  const sRunicWrath = (pas.runicWrathWindsom / 100) * totalInt + (pas.runicWrathMana / 100) * totalMana;
  const sMagicPerHit = sRunicPerHit + sShadowPerHit + sRunicWrath;

  const sCrusher = pas.titanCrusherDmg || pas.structCrusherDmg || 0;
  const sBonusPerHit = sCrusher + pas.infernalBonusDmg;
  const sBurnDPS = (pas.burnPct / 100) * sHP + pas.burnFlatDPS;
  const sHitDPS = (sPhysPerHit + sMagicPerHit + sBonusPerHit) * apsMax;
  const sTotalDPS = sHitDPS + sBurnDPS;
  const sTotalPerHit = sPhysPerHit + sMagicPerHit + sBonusPerHit;
  const sHTK = sTotalPerHit > 0 ? Math.ceil(sHP / (sTotalPerHit + sBurnDPS / Math.max(apsMax, 0.01))) : 999;
  const sTTK = sTotalDPS > 0 ? sHP / sTotalDPS : Infinity;

  // Tower
  const tDPS = parseFloat(el('towerDPS')?.value) || 100;
  const tType = el('towerDmgType')?.value || 'ranged';
  const tFactor = DMG_VS_HERO[tType] || 0.5;
  let effTDPS;
  if (tType === 'magic') {
    // Magic: 100% to hero, reduced by MDR, reduced by Tidal Fortitude
    effTDPS = tDPS * tFactor * (1 - iStats.mdr / 100) * (1 - pas.tidalFortPct / 100);
  } else {
    // Ranged: 50% to hero, reduced by armor, reduced by Tidal Fortitude
    effTDPS = tDPS * tFactor * armorMult * (1 - pas.tidalFortPct / 100);
  }
  // Effective HP = how much raw tower DPS you can absorb before dying
  const effHP = effTDPS > 0 ? totalHP / (effTDPS / tDPS) : Infinity;
  // Net HP/s = sustain minus damage taken
  const netHP = totalHPRegen + lifestealPerSec - effTDPS;
  // Time to die: if netHP >= 0, you outheal and never die
  // Otherwise, you lose (effTDPS - sustain) HP per second from totalHP pool
  let ttd;
  if (effTDPS <= 0) {
    ttd = Infinity;
  } else if (netHP >= 0) {
    ttd = Infinity; // outhealing
  } else {
    ttd = totalHP / (-netHP); // you lose |netHP| HP per second
  }

  return {
    totalStr, totalAgi, totalInt,
    totalHP, totalMana, totalArmor, armorRed, armorMult, mdr: iStats.mdr,
    totalHPRegen, totalManaRegen,
    effectiveAD, totalAD, colossusDmg, auraADBonus, baseDamage: base.baseDamage, cdBase, cdMax, apsBase, apsMax,
    physDPS, magicDPS, totalDPS, totalDPSMax,
    sim10, sim30, sim60,
    lifestealPerHit, lifestealPerSec, crisisRegen: pas.crisisRegen, cdr,
    tidalFortPct: pas.tidalFortPct,
    sPhysPerHit, sMagicPerHit, sBonusPerHit, sBurnDPS, sTotalDPS, sHTK, sTTK,
    effTDPS, effHP, ttd, netHP,
    passives: pas, iStats
  };
}

// ── Render ───────────────────────────────────────────────

function renderStats() {
  let s;
  try { s = computeAll(); } catch(e) { console.error('Sim error:', e); return; }
  let b = null;
  if (compareMode) {
    const tB = titanLinked ? currentTitan : currentTitanB;
    const lB = titanLinked ? currentLevel : currentLevelB;
    try { b = computeAll(equippedItemsB, itemOverridesB, tB, lB); } catch(e) {}
  }

  setWithDiff('statHP', s.totalHP, fmt(s.totalHP, 0), true, b?.totalHP, b ? fmt(b.totalHP, 0) : undefined);
  setWithDiff('statMana', s.totalMana, fmt(s.totalMana, 0), true, b?.totalMana, b ? fmt(b.totalMana, 0) : undefined);
  setWithDiff('statArmor', s.totalArmor, fmt(s.totalArmor, 1), true, b?.totalArmor, b ? fmt(b.totalArmor, 1) : undefined);
  setWithDiff('statArmorReduction', s.armorRed*100, fmt(s.armorRed*100,1)+'%', true, b?b.armorRed*100:undefined, b?fmt(b.armorRed*100,1)+'%':undefined);
  setWithDiff('statMDR', s.mdr, fmt(s.mdr,0)+'%', true, b?.mdr, b?fmt(b.mdr,0)+'%':undefined);
  setWithDiff('statHPRegen', s.totalHPRegen, fmt(s.totalHPRegen, 1), true, b?.totalHPRegen, b ? fmt(b.totalHPRegen, 1) : undefined);
  setWithDiff('statManaRegen', s.totalManaRegen, fmt(s.totalManaRegen, 1), true, b?.totalManaRegen, b ? fmt(b.totalManaRegen, 1) : undefined);

  setWithDiff('statAD', s.effectiveAD, fmt(s.effectiveAD, 1), true, b?.effectiveAD, b ? fmt(b.effectiveAD, 1) : undefined);
  setHtml('statASBase', fmt(s.cdBase, 3) + 's');
  setHtml('statASMax', s.apsMax !== s.apsBase ? fmt(s.cdMax, 3) + 's' : '&mdash;');
  setWithDiff('statAPSBase', s.apsBase, fmt(s.apsBase, 2), true, b?.apsBase, b ? fmt(b.apsBase, 2) : undefined);
  setHtml('statAPSMax', s.apsMax !== s.apsBase ? fmt(s.apsMax, 2) : '&mdash;');
  setWithDiff('statPhysDPS', s.physDPS, fmt(s.physDPS, 1), true, b?.physDPS, b ? fmt(b.physDPS, 1) : undefined);
  setWithDiff('statMagicDPS', s.magicDPS, fmt(s.magicDPS, 1), true, b?.magicDPS, b ? fmt(b.magicDPS, 1) : undefined);
  setWithDiff('statTotalDPS', s.totalDPS, fmt(s.totalDPS, 1), true, b?.totalDPS, b ? fmt(b.totalDPS, 1) : undefined);
  setWithDiff('statTotalDPSMax', s.totalDPSMax, s.totalDPSMax!==s.totalDPS?fmt(s.totalDPSMax,1):'&mdash;', true, b?.totalDPSMax, b&&b.totalDPSMax!==b.totalDPS?fmt(b.totalDPSMax,1):'&mdash;');

  // DPS over time (selected subtab)
  const selDur = parseInt(document.querySelector('.sim-subtab.active')?.dataset.dur) || 10;
  const selSim = selDur === 60 ? s.sim60 : selDur === 30 ? s.sim30 : s.sim10;
  setHtml('statSimDPS', fmt(selSim.totalDPS, 1));
  setHtml('statSimDmg', fmt(selSim.total, 0));

  setWithDiff('statLifestealHit', s.lifestealPerHit, s.lifestealPerHit>0?fmt(s.lifestealPerHit,1):'&mdash;', true, b?.lifestealPerHit, b&&b.lifestealPerHit>0?fmt(b.lifestealPerHit,1):'&mdash;');
  setWithDiff('statLifestealSec', s.lifestealPerSec, s.lifestealPerHit>0?fmt(s.lifestealPerSec,1):'&mdash;', true, b?.lifestealPerSec, b&&b.lifestealPerHit>0?fmt(b.lifestealPerSec,1):'&mdash;');
  const totalRecov = s.totalHPRegen + s.lifestealPerSec;
  const totalRecovB = b ? b.totalHPRegen + b.lifestealPerSec : undefined;
  setWithDiff('statTotalRecovery', totalRecov, fmt(totalRecov, 1), true, totalRecovB, totalRecovB !== undefined ? fmt(totalRecovB, 1) : undefined);
  setHtml('statCrisis', s.crisisRegen ? 'Yes (2x below 50%)' : '&mdash;');
  setHtml('statCDR', s.cdr > 0 ? s.cdr + '%' : '&mdash;');

  setWithDiff('statStructPhysHit', s.sPhysPerHit, fmt(s.sPhysPerHit, 1), true, b?.sPhysPerHit, b?fmt(b.sPhysPerHit,1):undefined);
  setHtml('statStructMagicHit', s.sMagicPerHit > 0 ? fmt(s.sMagicPerHit, 1) : '&mdash;');
  setHtml('statStructBonusHit', fmt(s.sBonusPerHit, 1));
  setHtml('statStructBurnDPS', fmt(s.sBurnDPS, 1));
  setWithDiff('statStructTotalDPS', s.sTotalDPS, fmt(s.sTotalDPS, 1), true, b?.sTotalDPS, b?fmt(b.sTotalDPS,1):undefined);
  setWithDiff('statStructHTK', s.sHTK, s.sHTK, false, b?.sHTK, b?.sHTK);
  setWithDiff('statStructTTK', s.sTTK, s.sTTK===Infinity?'&infin;':fmt(s.sTTK,1)+'s', false, b?.sTTK, b?b.sTTK===Infinity?'&infin;':fmt(b.sTTK,1)+'s':undefined);

  setWithDiff('statTowerEffDPS', s.effTDPS, fmt(s.effTDPS, 1), false, b?.effTDPS, b?fmt(b.effTDPS,1):undefined);
  setWithDiff('statEffHP', s.effHP, fmt(s.effHP, 0), true, b?.effHP, b?fmt(b.effHP,0):undefined);
  setWithDiff('statTTD', s.ttd, s.ttd===Infinity?'&infin;':fmt(s.ttd,1)+'s', true, b?.ttd, b?b.ttd===Infinity?'&infin;':fmt(b.ttd,1)+'s':undefined);
  const netEl = el('statNetHP');
  if (netEl) { netEl.innerHTML = fmt(s.netHP, 1); netEl.className = s.netHP >= 0 ? 'val-green' : 'val-red'; }

  // Tooltips
  const base = getBaseStats();
  const t = TITANS[currentTitan];
  const iS = s.iStats;
  const tip = (id, txt) => {
    const e = el(id);
    if (!e) return;
    // Set on the element and its parent row
    e.title = txt;
    const row = e.closest('.sim-stat-row');
    if (row) row.title = txt;
  };
  tip('tipHP', `Base: ${t.base_hp} + VIT(${fmt(s.totalStr,1)}) x 50 = ${fmt(s.totalStr*50,0)} + items(${iS.hp})\n= ${fmt(s.totalHP,0)}`);
  tip('tipMana', `Base: ${t.base_mana} + WIS(${fmt(s.totalInt,1)}) x 20 = ${fmt(s.totalInt*20,0)} + items(${iS.mana})\n= ${fmt(s.totalMana,0)}`);
  tip('tipArmor', `Lv${currentLevel}: ${base.armor} + items(${iS.armor}) + passives(${s.totalArmor - base.armor - iS.armor})\n= ${fmt(s.totalArmor,1)}`);
  tip('tipArmorRed', `0.06 x ${fmt(s.totalArmor,1)} / (1 + 0.06 x ${fmt(s.totalArmor,1)})\n= ${fmt(s.armorRed*100,1)}%`);
  tip('tipMDR', `Items: ${s.mdr}%`);
  tip('tipHPRegen', `Base: ${fmt(t.base_hp_regen,1)} + VIT(${fmt(s.totalStr,1)}) x 0.1 + items(${fmt(iS.hpRegen,1)})\n= ${fmt(s.totalHPRegen,1)}/s`);
  tip('tipManaRegen', `Base: ${fmt(t.base_mp_regen,1)} + WIS(${fmt(s.totalInt,1)}) x 0.1 + items(${fmt(iS.manaRegen,1)})\n= ${fmt(s.totalManaRegen,1)}/s`);
  tip('tipAD', `Base(Lv${currentLevel}): ${base.baseDamage} + items(${iS.ad})${s.auraADBonus > 0 ? ` + Aura(${fmt(s.auraADBonus,0)} = ${s.passives.auraWarPct}% of ${base.baseDamage})` : ''}${s.colossusDmg > 0 ? ` + Colossus(${fmt(s.colossusDmg,0)})` : ''}\n= ${fmt(s.effectiveAD,1)}`);

  // Structure & tower formula tooltips
  const sArmT = parseInt(el('structArmor')?.value) || 15;
  const sHPT = parseInt(el('structHP')?.value) || 500;
  const sART = 0.06 * sArmT / (1 + 0.06 * sArmT);
  const sAMT = 1 - sART;
  tip('statStructPhysHit', `${fmt(s.effectiveAD,1)} x 0.55 (fortified) x ${fmt(sAMT,3)} (1 - ${fmt(sART*100,1)}% from ${sArmT} armor)\n= ${fmt(s.sPhysPerHit,1)}`);
  tip('statStructBonusHit', `Crusher: ${s.passives.titanCrusherDmg || s.passives.structCrusherDmg}, Infernal: ${s.passives.infernalBonusDmg}\n= ${fmt(s.sBonusPerHit,1)} pure/hit`);
  tip('statStructBurnDPS', `${s.passives.burnPct}% of ${sHPT} HP = ${fmt(s.passives.burnPct/100*sHPT,1)} + ${s.passives.burnFlatDPS} flat\n= ${fmt(s.sBurnDPS,1)}/s`);
  tip('statStructMagicHit', `Runic Mark avg: ${fmt(s.passives.runicMarkDmg/2,1)}\nShadow Rune avg: ${fmt(s.passives.shadowRuneDmg/2,1)}\nRunic Wrath: ${fmt((s.passives.runicWrathWindsom/100)*s.totalInt + (s.passives.runicWrathMana/100)*s.totalMana,1)}\n= ${fmt(s.sMagicPerHit,1)}/hit`);
  tip('statStructTotalDPS', `(${fmt(s.sPhysPerHit,1)} phys + ${fmt(s.sMagicPerHit,1)} magic + ${fmt(s.sBonusPerHit,1)} pure) x ${fmt(s.apsMax,2)} APS + ${fmt(s.sBurnDPS,1)} burn\n= ${fmt(s.sTotalDPS,1)}`);
  tip('statStructHTK', `${sHPT} / (${fmt(s.sPhysPerHit+s.sBonusPerHit,1)} + burn/atk)\n= ${s.sHTK} hits`);
  tip('statStructTTK', `${sHPT} / ${fmt(s.sTotalDPS,1)} DPS = ${s.sTTK === Infinity ? 'inf' : fmt(s.sTTK,1) + 's'}`);

  const tDPSv = parseFloat(el('towerDPS')?.value) || 100;
  const tTp = el('towerDmgType')?.value || 'ranged';
  const tF = DMG_VS_HERO[tTp] || 0.5;
  tip('statTowerEffDPS', tTp === 'magic'
    ? `${tDPSv} x ${tF} (magic) x (1 - ${fmt(s.mdr,0)}% MDR)${s.tidalFortPct > 0 ? ` x (1 - ${s.tidalFortPct}% Tidal Fort)` : ''}\n= ${fmt(s.effTDPS,1)}`
    : `${tDPSv} x ${tF} (ranged) x ${fmt(s.armorMult,3)} (armor ${fmt(s.totalArmor,1)})${s.tidalFortPct > 0 ? ` x (1 - ${s.tidalFortPct}% Tidal Fort)` : ''}\n= ${fmt(s.effTDPS,1)}`);
  tip('statEffHP', `${fmt(s.totalHP,0)} / (${fmt(s.effTDPS,1)} / ${tDPSv})\n= ${fmt(s.effHP,0)}`);
  tip('statTTD', s.netHP >= 0
    ? `Outhealing! Regen(${fmt(s.totalHPRegen,1)}) + Lifesteal(${fmt(s.lifestealPerSec,1)}) >= Tower(${fmt(s.effTDPS,1)})`
    : `${fmt(s.totalHP,0)} HP / ${fmt(-s.netHP,1)} net DPS (${fmt(s.effTDPS,1)} tower - ${fmt(s.totalHPRegen+s.lifestealPerSec,1)} sustain)\n= ${fmt(s.ttd,1)}s`);
  tip('statNetHP', `Regen(${fmt(s.totalHPRegen,1)}) + Lifesteal(${fmt(s.lifestealPerSec,1)}) - Tower(${fmt(s.effTDPS,1)})\n= ${fmt(s.netHP,1)}/s`);

  // Titan attrs display
  setHtml('titanAttrs', `<span class="attr-vit">VIT ${fmt(s.totalStr,1)}</span> <span class="attr-cel">CEL ${fmt(s.totalAgi,1)}</span> <span class="attr-wis">WIS ${fmt(s.totalInt,1)}</span> <span class="attr-bcd">BAT ${t.BAT}</span>`);

  if (compareMode && !titanLinked && b) {
    const tB = TITANS[currentTitanB];
    setHtml('titanAttrsB', `<span class="attr-vit">VIT ${fmt(b.totalStr,1)}</span> <span class="attr-cel">CEL ${fmt(b.totalAgi,1)}</span> <span class="attr-wis">WIS ${fmt(b.totalInt,1)}</span> <span class="attr-bcd">BAT ${tB.BAT}</span>`);
  }

  // Passives summary with full descriptions
  function renderEffectsList(targetEl, effects) {
    if (!targetEl) return;
    if (effects.length === 0) {
      targetEl.innerHTML = '<div class="sim-passive-empty">Equip items to see effects</div>';
    } else {
      targetEl.innerHTML = effects.map(e =>
        `<div class="sim-effect-row">
          <div class="sim-effect-head">
            <span class="sim-effect-tag sim-effect-tag-${e.tag.toLowerCase()}">${e.tag}</span>
            <span class="sim-effect-name">${esc(e.name)}</span>
            <span class="sim-effect-val">${esc(e.val)}</span>
            <span class="sim-effect-item">${esc(e.item)}</span>
          </div>
          <div class="sim-effect-desc">${esc(e.desc)}</div>
        </div>`
      ).join('');
    }
  }
  renderEffectsList(el('statPassivesList'), s.passives.effects);

  // Compare mode: show B passives
  const passivesCardB = el('passivesCardB');
  const passivesRow = el('passivesRow');
  if (compareMode && b) {
    passivesCardB.hidden = false;
    passivesRow.style.gridTemplateColumns = '1fr 1fr';
    renderEffectsList(el('statPassivesListB'), b.passives.effects);
  } else {
    passivesCardB.hidden = true;
    passivesRow.style.gridTemplateColumns = '1fr';
  }

  // Total cost
  const cost = equippedItems.reduce((sum, it) => sum + (it ? (it.totalCost || it.cost || 0) : 0), 0);
  setHtml('simTotalCost', cost + 'g');
  if (compareMode) {
    const costB = equippedItemsB.reduce((sum, it) => sum + (it ? (it.totalCost || it.cost || 0) : 0), 0);
    setHtml('simTotalCostB', costB + 'g');
  }
}

// ── Key value extraction for editable passives ───────────

function getKeyValue(name, desc) {
  const n = (name || '').toLowerCase();
  // Return {val, label, regex} for the number that matters for computation
  if (/^runic mark$/i.test(name)) {
    const m = desc.match(/deals?\s+(\d+)\s+(?:bonus\s+)?magic/i) || desc.match(/(\d+)\s+bonus magic/i);
    return { val: m ? parseInt(m[1]) : null, label: 'magic dmg' };
  }
  if (/shadow rune/i.test(name)) {
    const m = desc.match(/deals?\s+(\d+)\s+magic/i);
    return { val: m ? parseInt(m[1]) : null, label: 'magic dmg' };
  }
  if (/structure crusher/i.test(name) || /titan crusher/i.test(name)) {
    const m = desc.match(/^.*?(\d+)\s*\+/);
    return { val: m ? parseInt(m[1]) : null, label: 'base bonus dmg' };
  }
  if (/structure burn|infernal siege/i.test(name)) {
    const m = desc.match(/(\d+)%\s+of/i) || desc.match(/dealing\s+(\d+)/i);
    return { val: m ? parseInt(m[1]) : null, label: m && m[0].includes('%') ? 'burn %' : 'burn DPS' };
  }
  if (/fiery touch/i.test(name)) {
    const m = desc.match(/(\d+)\s+damage per second/i);
    return { val: m ? parseInt(m[1]) : null, label: 'burn DPS' };
  }
  if (/vampirism|^lifesteal$/i.test(name)) {
    const m = desc.match(/heal.*?(\d+)/i);
    return { val: m ? parseInt(m[1]) : null, label: 'heal/hit' };
  }
  if (/voodoo power|^voodoo$/i.test(name)) {
    const m = desc.match(/grants?\s+(\d+)/i);
    return { val: m ? parseInt(m[1]) : null, label: 'AD/ward' };
  }
  if (/colossus/i.test(name)) {
    const m = desc.match(/([\d.]+)%/);
    return { val: m ? parseFloat(m[1]) : null, label: '% max HP' };
  }
  if (/^fervor$/i.test(name)) {
    const matches = [...desc.matchAll(/(\d+)%/gi)];
    return { val: matches.length ? parseInt(matches[matches.length-1][1]) : null, label: 'max AS%' };
  }
  if (/tidal fortitude/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'dmg reduction %' };
  }
  if (/swift casting/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'CDR %' };
  }
  if (/healing amplification/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'heal bonus %' };
  }
  if (/aura of war/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'AD bonus %' };
  }
  if (/nukemaster/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'nuke bonus %' };
  }
  if (/runic wrath/i.test(name)) {
    const m = desc.match(/(\d+)%\s+windsom/i);
    return { val: m ? parseInt(m[1]) : null, label: 'windsom %' };
  }
  if (/spellblade/i.test(name)) {
    const m = desc.match(/(\d+)%\s+stacking/i);
    return { val: m ? parseInt(m[1]) : null, label: 'AS%/spell' };
  }
  if (/battle tempo/i.test(name)) {
    const m = desc.match(/([\d.]+)\s+second/i);
    return { val: m ? parseFloat(m[1]) : null, label: 'CDR/atk' };
  }
  if (/spell strike/i.test(name)) {
    const m = desc.match(/by\s+(\d+)/i);
    return { val: m ? parseInt(m[1]) : null, label: 'AD/spell' };
  }
  if (/corrosive attack/i.test(name)) {
    const m = desc.match(/by\s+(\d+)/i);
    return { val: m ? parseInt(m[1]) : null, label: 'armor/hit' };
  }
  // Default: no editable number
  return { val: null, label: '' };
}

// ── Item slots ───────────────────────────────────────────

function renderSlots(target) {
  target = target || 'A';
  const isB = target === 'B';
  const items = isB ? equippedItemsB : equippedItems;
  const overrides = isB ? itemOverridesB : itemOverrides;
  const container = el(isB ? 'simSlotsB' : 'simSlots');
  if (!container) return;
  container.innerHTML = '';
  const catC = { offensive: 'var(--c-offensive)', defensive: 'var(--c-defensive)', both: 'var(--c-both)', utility: 'var(--c-utility)' };

  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'sim-slot';
    const item = items[i];

    if (item) {
      slot.classList.add('sim-slot-filled');
      slot.style.setProperty('--slot-cat-color', catC[item.category] || 'var(--border)');

      const statsHtml = (item.stats || []).map((str, si) => {
        const origVal = parseNum(str);
        const ovVal = itemOverrides[i]?.stats?.[si];
        const dv = ovVal !== undefined ? ovVal : origVal;
        const label = str.replace(/[\d.]+/, '').replace(/^\s*\+\s*/, '').trim();
        return `<div class="sim-slot-stat">
          <input type="number" class="sim-stat-input ${ovVal !== undefined && parseFloat(ovVal) !== origVal ? 'sim-overridden' : ''}"
            value="${dv}" data-slot="${i}" data-stat="${si}" data-orig="${origVal}" step="any">
          <span class="sim-stat-label">${esc(label)}</span>
        </div>`;
      }).join('');

      // Build passive/active rows with editable key numbers
      const allEffects = [...(item.passives || [])];
      if (item.active) allEffects.push({ name: item.active.name, description: item.active.description, _isActive: true });

      const effectsHtml = allEffects.map((ef, ei) => {
        const isActive = ef._isActive;
        const desc = ef.description || '';
        // Find the KEY number for this passive type (the one that matters for computation)
        const kv = getKeyValue(ef.name, desc);
        const ovVal = itemOverrides[i]?.passiveVals?.[ei];
        const displayVal = ovVal !== undefined ? ovVal : kv.val;
        const isOv = ovVal !== undefined && kv.val !== null && parseFloat(ovVal) !== kv.val;

        let numInput = '';
        if (kv.val !== null) {
          numInput = `<input type="number" class="sim-passive-num ${isOv ? 'sim-overridden' : ''}" value="${displayVal}" data-slot="${i}" data-eidx="${ei}" data-orig="${kv.val}" data-label="${esc(kv.label)}" title="${esc(kv.label)}" step="any">`;
        }
        const cls = isActive ? 'sim-slot-active' : 'sim-slot-passive';
        return `<div class="${cls}">${numInput}${esc(ef.name)}</div>`;
      }).join('');
      const passiveNames = effectsHtml;

      slot.innerHTML = `
        <div class="sim-slot-header">
          <span class="sim-slot-name">${esc(item.name)}</span>
          <button class="sim-slot-remove" data-idx="${i}">&times;</button>
        </div>
        <div class="sim-slot-cost">${item.totalCost || item.cost || 0}g</div>
        ${statsHtml}${passiveNames}
      `;

      // Wire passive number inputs
      slot.querySelectorAll('.sim-passive-num').forEach(inp => {
        inp.addEventListener('input', () => {
          const si = parseInt(inp.dataset.slot);
          const ei = parseInt(inp.dataset.eidx);
          const orig = parseFloat(inp.dataset.orig);
          if (!overrides[si].passiveVals) overrides[si].passiveVals = {};

          if (parseFloat(inp.value) === orig || inp.value === '') {
            delete overrides[si].passiveVals[ei];
            delete overrides[si].passives?.[ei];
            inp.classList.remove('sim-overridden');
          } else {
            overrides[si].passiveVals[ei] = parseFloat(inp.value);
            inp.classList.add('sim-overridden');
            const item = items[si];
            const allEf = [...(item?.passives || [])];
            if (item?.active) allEf.push({ name: item.active.name, description: item.active.description });
            const origDesc = allEf[ei]?.description || '';
            const kv = getKeyValue(allEf[ei]?.name, origDesc);
            if (kv.val !== null) {
              const newDesc = origDesc.replace(String(kv.val), String(parseFloat(inp.value)));
              if (!overrides[si].passives) overrides[si].passives = {};
              overrides[si].passives[ei] = newDesc;
            }
          }
          renderStats();
        });
        inp.addEventListener('click', e => e.stopPropagation());
      });

      slot.querySelector('.sim-slot-remove').addEventListener('click', e => {
        e.stopPropagation();
        items[i] = null;
        overrides[i] = {};
        renderSlots(target);
        renderStats();
      });

      slot.querySelectorAll('.sim-stat-input').forEach(inp => {
        inp.addEventListener('input', () => {
          const si = parseInt(inp.dataset.stat);
          const orig = parseFloat(inp.dataset.orig);
          if (!overrides[i].stats) overrides[i].stats = {};
          if (parseFloat(inp.value) === orig || inp.value === '') {
            delete overrides[i].stats[si];
            inp.classList.remove('sim-overridden');
          } else {
            overrides[i].stats[si] = parseFloat(inp.value);
            inp.classList.add('sim-overridden');
          }
          renderStats();
        });
        inp.addEventListener('click', e => e.stopPropagation());
      });

      slot.addEventListener('click', e => {
        if (e.target.closest('.sim-slot-remove, .sim-stat-input')) return;
        pickerTarget = target;
        openPicker(i);
      });
    } else {
      slot.innerHTML = '<div class="sim-slot-empty">+ Add Item</div>';
      slot.addEventListener('click', () => { pickerTarget = target; openPicker(i); });
    }
    container.appendChild(slot);
  }
}

// ── Item picker ──────────────────────────────────────────

function loadVersionItems() {
  const v = versions.getById(currentVersionId);
  if (!v) return JSON.parse(JSON.stringify(ITEMS_DATA.items));
  return v.isBase
    ? JSON.parse(JSON.stringify(ITEMS_DATA.items))
    : JSON.parse(JSON.stringify(v.items || ITEMS_DATA.items));
}

function openPicker(idx) {
  pickerSlotIdx = idx;
  el('simPickerOverlay').hidden = false;
  el('simPickerSearch').value = '';
  document.querySelectorAll('.sim-picker-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === 'all'));
  renderPickerList();
  el('simPickerSearch').focus();
}
function closePicker() { el('simPickerOverlay').hidden = true; pickerSlotIdx = -1; }

function renderPickerList() {
  const list = el('simPickerList');
  const q = (el('simPickerSearch')?.value || '').toLowerCase();
  const cat = document.querySelector('.sim-picker-tab.active')?.dataset.cat || 'all';
  const catC = { offensive: 'var(--c-offensive)', defensive: 'var(--c-defensive)', both: 'var(--c-both)', utility: 'var(--c-utility)' };

  let html = '';
  TIER_ORDER.forEach(tier => {
    const items = versionItems.filter(i => i.tier === tier && (!q || i.name.toLowerCase().includes(q)) && (cat === 'all' || i.category === cat));
    if (!items.length) return;
    html += `<div class="sim-picker-tier">${TIER_LABELS[tier]}</div>`;
    items.forEach(item => {
      const stats = (item.stats || []).join(', ');
      html += `<div class="sim-picker-item" data-id="${item.id}">
        <span class="sim-picker-dot" style="background:${catC[item.category] || 'var(--border)'}"></span>
        <span class="sim-picker-name">${esc(item.name)}</span>
        <span class="sim-picker-stats">${esc(stats)}</span>
        <span class="sim-picker-cost">${item.totalCost || item.cost || 0}g</span>
      </div>`;
    });
  });

  list.innerHTML = html || '<div class="sim-passive-empty">No items</div>';
  list.querySelectorAll('.sim-picker-item').forEach(row => {
    row.addEventListener('click', () => {
      const item = versionItems.find(i => i.id === row.dataset.id);
      if (item && pickerSlotIdx >= 0) {
        const tgt = pickerTarget === 'B' ? equippedItemsB : equippedItems;
        const ovr = pickerTarget === 'B' ? itemOverridesB : itemOverrides;
        tgt[pickerSlotIdx] = JSON.parse(JSON.stringify(item));
        ovr[pickerSlotIdx] = {};
        closePicker();
        renderSlots(pickerTarget);
        renderStats();
      }
    });
  });
}

// ── Init ─────────────────────────────────────────────────

(function init() {
  // Titan selector
  const tSel = el('titanSelect');
  tSel.innerHTML = Object.entries(TITANS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
  tSel.value = currentTitan;
  tSel.addEventListener('change', () => { currentTitan = tSel.value; renderStats(); });

  // Level slider
  const slider = el('levelSlider');
  const lvDisp = el('levelDisplay');
  slider.value = currentLevel;
  lvDisp.textContent = currentLevel;
  slider.addEventListener('input', () => { currentLevel = parseInt(slider.value); lvDisp.textContent = currentLevel; renderStats(); });

  // Version — locked to Base
  currentVersionId = 'base';
  el('simVersionSelect').innerHTML = `<option value="base">Base (4.4.3)</option>`;
  versionItems = loadVersionItems();

  // Tower builder selector
  const bSel = el('towerBuilder');
  bSel.innerHTML = Object.entries(TOWERS).map(([k, v]) =>
    `<option value="${k}">${k.charAt(0).toUpperCase() + k.slice(1)}</option>`
  ).join('');
  bSel.value = 'murloc';

  function updateTowerDPS() {
    const builder = el('towerBuilder').value;
    const tier = el('towerTier').value;
    const count = parseInt(el('towerCount').value) || 36;
    const tower = TOWERS[builder]?.[tier];
    if (tower) {
      const totalDPS = Math.round(tower.dps * count * 10) / 10;
      el('towerDPS').value = totalDPS;
      el('towerDmgType').value = tower.t;
      el('towerInfo').textContent = `${tower.n} — ${tower.dps} DPS/tower x ${count} = ${totalDPS} DPS`;
    }
    renderStats();
  }

  ['towerBuilder', 'towerTier', 'towerCount'].forEach(id => {
    const e = el(id);
    if (e) { e.addEventListener('change', updateTowerDPS); e.addEventListener('input', updateTowerDPS); }
  });
  updateTowerDPS();

  // Config inputs
  ['structArmor', 'structHP', 'towerDPS', 'towerDmgType'].forEach(id => {
    const e = el(id);
    if (e) { e.addEventListener('input', renderStats); e.addEventListener('change', renderStats); }
  });

  // Picker
  el('simPickerClose').addEventListener('click', closePicker);
  el('simPickerOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closePicker(); });
  el('simPickerSearch').addEventListener('input', renderPickerList);
  document.querySelectorAll('.sim-picker-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sim-picker-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPickerList();
    });
  });

  // Compare mode toggle
  el('compareModeBtn').addEventListener('click', () => {
    compareMode = !compareMode;
    el('compareModeBtn').classList.toggle('active', compareMode);
    el('simRightLoadout').hidden = !compareMode;
    if (compareMode) renderSlots('B');
    renderStats();
  });

  // Titan B selector
  const tSelB = el('titanSelectB');
  tSelB.innerHTML = Object.entries(TITANS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
  tSelB.value = currentTitanB;
  tSelB.addEventListener('change', () => { currentTitanB = tSelB.value; renderStats(); });

  const sliderB = el('levelSliderB');
  const lvDispB = el('levelDisplayB');
  sliderB.value = currentLevelB;
  lvDispB.textContent = currentLevelB;
  sliderB.addEventListener('input', () => { currentLevelB = parseInt(sliderB.value); lvDispB.textContent = currentLevelB; renderStats(); });

  // Unlink titan button
  el('unlinkTitanBtn').addEventListener('click', () => {
    titanLinked = !titanLinked;
    el('unlinkTitanBtn').textContent = titanLinked ? 'Shared' : 'Independent';
    el('unlinkTitanBtn').classList.toggle('unlinked', !titanLinked);
    el('titanBPanel').hidden = titanLinked;
    if (!titanLinked) { currentTitanB = currentTitan; currentLevelB = currentLevel; tSelB.value = currentTitanB; sliderB.value = currentLevelB; lvDispB.textContent = currentLevelB; }
    renderStats();
  });

  // DPS subtabs
  document.querySelectorAll('.sim-subtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sim-subtab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderStats();
    });
  });

  // Presets
  document.querySelectorAll('.sim-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el('towerDPS').value = btn.dataset.dps;
      el('towerDmgType').value = btn.dataset.type;
      document.querySelectorAll('.sim-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStats();
    });
  });

  renderSlots('A');
  renderStats();
})();
