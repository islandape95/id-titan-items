// ============================================================
//  Simulator  –  titan stat & DPS calculator with buff states
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

// Tower database
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
let pickerTarget = 'A';
let compareMode = false;
let titanLinked = true;
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

function getBaseStats(titanKey, level) {
  titanKey = titanKey || currentTitan;
  level = level || currentLevel;
  const t = TITANS[titanKey];
  const g = level - 1;
  return {
    str: t.base_str + t.str_per_lvl * g,
    agi: t.base_agi + t.agi_per_lvl * g,
    int: t.base_int + t.int_per_lvl * g,
    baseDamage: 130 + (level - 2) * 10,
    armor: computeArmor(level),
    BAT: t.BAT
  };
}

// ── Item stat parsing ────────────────────────────────────

function parseItemStats(items, overrides) {
  overrides = overrides || itemOverrides;
  const s = { ad: 0, asPct: 0, hp: 0, mana: 0, hpRegen: 0, manaRegen: 0, armor: 0, mdr: 0, vit: 0, cel: 0, wis: 0 };
  items.forEach((item, si) => {
    if (!item?.stats) return;
    item.stats.forEach((str, idx) => {
      let val = parseNum(str);
      const ov = overrides[si]?.stats?.[idx];
      if (ov !== undefined) val = parseFloat(ov) || 0;
      if (/attack speed/i.test(str)) s.asPct += val;
      else if (/magic.*damage.*reduction/i.test(str)) s.mdr += val;
      else if (/hp regen|hp regeneration|health regeneration/i.test(str)) s.hpRegen += val;
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

// ── Passive recognition (v5-aware) ───────────────────────

function parsePassives(items, overrides, level) {
  overrides = overrides || itemOverrides;
  level = level || currentLevel;
  const p = {
    runicMarkDmg: 0, runicExposureDmg: 0, structCrusherDmg: 0, titanCrusherDmg: 0,
    titanBonusDmg: 0,
    burnPct: 0, burnFlatDPS: 0, infernalBonusDmg: 0,
    lifestealFlat: 0, lifestealPct: 0,
    colossus: false, colossusPct: 0,
    fervorMaxAS: 0, fervorStacks: 6,
    tidalFortPct: 0, tidalFortPhysPct: 0, tidalFortArmor: 0,
    crisisRegen: false, swiftCastingPct: 0, healAmpPct: 0,
    corrosiveArmor: 0, shadowRuneDmg: 0,
    voodooDecayArmor: 0,
    nukeBonus: 0, nukeCDR: 0,
    runicWrathBasePct: 0,
    runicWrathSpellPct: 0,
    spellbladeMaxAS: 0,
    auraWarPct: 0, battleTempoCDR: 0, spellStrikeAD: 0,
    spellArmorRedPct: 0,
    smashPct: 0,
    unstableMagicAura: 0,
    voodooADPerWard: 0,
    // Buff availability flags
    hasWarbanner: false,
    hasPoseidon: false,
    hasMace: false,
    hasForeteller: false,
    hasSpellArmor: false,
    hasFervor: false,
    hasVoodooDoll: false,
    hasVoodooHelmet: false,
    effects: []
  };

  items.forEach((item, si) => {
    if (!item) return;
    const all = [...(item.passives || [])];
    if (item.active) all.push({ name: item.active.name, description: item.active.description, _isActive: true });

    const iid = item.id || '';
    if (iid === 'warbanner') p.hasWarbanner = true;
    if (iid === 'poseidons-trident') p.hasPoseidon = true;
    if (iid === 'mace-of-mortality') p.hasMace = true;
    if (iid === 'foretellers-sickle') p.hasForeteller = true;
    if (iid === 'robe-of-spellcraft') p.hasSpellArmor = true;
    if (iid === 'spear-of-fervor') p.hasFervor = true;
    if (iid === 'voodoo-doll') p.hasVoodooDoll = true;
    if (iid === 'helmet-of-the-damned') p.hasVoodooHelmet = true;

    all.forEach((pas, pi) => {
      const name = pas.name || '';
      let desc = pas.description || '';
      const ov = overrides[si]?.passives?.[pi];
      if (ov !== undefined) desc = ov;
      const isActive = pas._isActive;
      const tag = isActive ? 'Active' : 'Passive';

      // Runic Exposure (Highseer T3)
      if (/^runic exposure$/i.test(name)) {
        const v = extractNum(desc, /deals?\s+(\d+)\s+(?:bonus\s+)?magic/i) || extractNum(desc, /(\d+)\s+magic damage/i);
        p.runicExposureDmg = Math.max(p.runicExposureDmg, v);
        p.runicMarkDmg = Math.max(p.runicMarkDmg, v);
        if (v) p.effects.push({ tag, name, val: `${v} magic/proc`, item: item.name, desc, slot: si, idx: pi });
      }
      // Runic Mark
      else if (/^runic mark$/i.test(name)) {
        const v = extractNum(desc, /deals?\s+(\d+)\s+(?:bonus\s+)?magic/i) || extractNum(desc, /(\d+)\s+magic damage/i);
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
        p.structCrusherDmg = Math.min(10 + 2 * level, 30);
        p.effects.push({ tag, name, val: `${p.structCrusherDmg}/hit`, item: item.name, desc, slot: si, idx: pi });
      }
      // Titan (Poseidon passive)
      else if (/^titan$/i.test(name)) {
        p.titanBonusDmg = 10 + 5 * level;
        p.effects.push({ tag, name, val: `${p.titanBonusDmg}/hit vs structures`, item: item.name, desc, slot: si, idx: pi });
      }
      // Titan Crusher (legacy)
      else if (/titan crusher/i.test(name)) {
        const baseM = extractNum(desc, /^.*?(\d+)\s*\+/);
        const perLvl = extractNum(desc, /\+\s*\(?(\d+)\s*[x\u00d7]/i);
        const cap = extractNum(desc, /maximum of (\d+)/i) || 50;
        p.titanCrusherDmg = Math.min((baseM || 20) + (perLvl || 5) * level, cap);
        p.effects.push({ tag, name, val: `${p.titanCrusherDmg}/hit`, item: item.name, desc, slot: si, idx: pi });
      }
      // Structure Burn / Infernal Siege
      else if (/structure burn|infernal siege/i.test(name)) {
        const pctV = extractNum(desc, /(\d+)%\s+(?:of|maximum)/i);
        const flatV = extractNum(desc, /dealing\s+(\d+)\s+damage per second/i);
        if (pctV) p.burnPct = Math.max(p.burnPct, pctV);
        if (flatV) p.burnFlatDPS += flatV;
        p.infernalBonusDmg = Math.max(p.infernalBonusDmg, extractNum(desc, /additional\s+(\d+)/i));
        p.effects.push({ tag, name, val: pctV ? `${pctV}% HP/s` : `${flatV} DPS`, item: item.name, desc, slot: si, idx: pi });
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
      // Voodoo Decay
      else if (/voodoo decay/i.test(name)) {
        const v = extractNum(desc, /armor by (\d+)/i) || extractNum(desc, /reduces?\s+.*?armor\s+by\s+(\d+)/i);
        p.voodooDecayArmor = Math.max(p.voodooDecayArmor, v);
        p.effects.push({ tag, name, val: `-${v} armor`, item: item.name, desc, slot: si, idx: pi });
      }
      // Voodoo Magic
      else if (/voodoo magic/i.test(name)) {
        p.effects.push({ tag, name, val: '25% phys lifesteal in ward', item: item.name, desc, slot: si, idx: pi });
      }
      // Voodoo Power / Voodoo (legacy)
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
      // Smash
      else if (/^smash$/i.test(name)) {
        p.smashPct = extractNum(desc, /([\d.]+)%/);
        p.effects.push({ tag, name, val: `${p.smashPct}% max HP heal/hit`, item: item.name, desc, slot: si, idx: pi });
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
        const dmgRedM = desc.match(/(\d+)%/i);
        if (dmgRedM) {
          const pct = parseInt(dmgRedM[1]);
          if (/physical/i.test(desc)) {
            p.tidalFortPhysPct += pct;
          } else {
            p.tidalFortPct += pct;
          }
        }
        const armM = extractNum(desc, /\+\s*(\d+)\s+armor/i);
        if (armM) p.tidalFortArmor += armM;
        p.effects.push({ tag, name, val: `-${p.tidalFortPct + p.tidalFortPhysPct}% dmg, +${p.tidalFortArmor} armor`, item: item.name, desc, slot: si, idx: pi });
      }
      // Crisis Regen
      else if (/crisis regen/i.test(name)) {
        p.crisisRegen = true;
        p.effects.push({ tag, name, val: '2x regen <50% HP', item: item.name, desc, slot: si, idx: pi });
      }
      // Swift Casting
      else if (/swift casting/i.test(name)) {
        p.swiftCastingPct += extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `${p.swiftCastingPct}% CDR`, item: item.name, desc, slot: si, idx: pi });
      }
      // Healing Amplification
      else if (/healing amplification/i.test(name)) {
        p.healAmpPct += extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${p.healAmpPct}% heal`, item: item.name, desc, slot: si, idx: pi });
      }
      // Magic Resist
      else if (/^magic resist$/i.test(name)) {
        const v = extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${v}% MDR`, item: item.name, desc, slot: si, idx: pi });
      }
      // Spell Armor
      else if (/spell armor/i.test(name)) {
        p.spellArmorRedPct = extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `-${p.spellArmorRedPct}%/stack (max 3)`, item: item.name, desc, slot: si, idx: pi });
      }
      // Corrosive Attack
      else if (/corrosive attack/i.test(name)) {
        p.corrosiveArmor = extractNum(desc, /by\s+(\d+)/i);
        p.effects.push({ tag, name, val: `-${p.corrosiveArmor} armor/hit (stacks)`, item: item.name, desc, slot: si, idx: pi });
      }
      // Nuke Master
      else if (/nuke\s*master/i.test(name)) {
        p.nukeBonus = extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${p.nukeBonus}% nuke`, item: item.name, desc, slot: si, idx: pi });
      }
      // Nuke Enjoyer
      else if (/nuke\s*enjoyer/i.test(name)) {
        p.nukeCDR = extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${p.nukeCDR}% nuke CDR`, item: item.name, desc, slot: si, idx: pi });
      }
      // Aura of War (removed in v5 but keep for base)
      else if (/aura of war/i.test(name)) {
        p.auraWarPct = Math.max(p.auraWarPct, extractNum(desc, /(\d+)%/));
        p.effects.push({ tag, name, val: `+${p.auraWarPct}% AD (allies)`, item: item.name, desc, slot: si, idx: pi });
      }
      // Runic Wrath (v5: 3% mana base, +5% with spell buff, max 100 vs units)
      else if (/runic wrath/i.test(name)) {
        p.runicWrathBasePct = extractNum(desc, /(\d+)%\s+max mana/i) || 3;
        const spellM = desc.match(/additional\s+(\d+)%/i);
        p.runicWrathSpellPct = spellM ? parseInt(spellM[1]) : 5;
        p.effects.push({ tag, name, val: `${p.runicWrathBasePct}% mana (${p.runicWrathBasePct + p.runicWrathSpellPct}% with spell)`, item: item.name, desc, slot: si, idx: pi });
      }
      // Spellblade (v5 Highseer — cleanse, not stacking AS)
      else if (/spellblade/i.test(name)) {
        p.effects.push({ tag, name, val: 'Cleanse + 4th spell AoE', item: item.name, desc, slot: si, idx: pi });
      }
      // Unstable Magic
      else if (/unstable magic/i.test(name)) {
        p.unstableMagicAura = extractNum(desc, /(\d+)\s+bonus/i) || extractNum(desc, /regenerate\s+(\d+)/i) || 8;
        p.effects.push({ tag, name, val: `+${p.unstableMagicAura} HP/MP aura`, item: item.name, desc, slot: si, idx: pi });
      }
      // War Shout
      else if (/war shout/i.test(name)) {
        const v = extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${v}% AD for 8s`, item: item.name, desc, slot: si, idx: pi });
      }
      // Unleashed Rage
      else if (/unleashed rage/i.test(name)) {
        const v = extractNum(desc, /(\d+)%/);
        p.effects.push({ tag, name, val: `+${v}% AD for 10s`, item: item.name, desc, slot: si, idx: pi });
      }
      // War Cry
      else if (/war cry/i.test(name)) {
        p.effects.push({ tag, name, val: '+5% HP as AD, 2x Colossus', item: item.name, desc, slot: si, idx: pi });
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
      // Everything else
      else if (name) {
        p.effects.push({ tag, name, val: '', item: item.name, desc, slot: si, idx: pi });
      }
    });
  });
  return p;
}

// ── Simulation over time ─────────────────────────────────

function simulateDPS(duration, totalAD, colossusDmg, BAT, bonusAS, runicMarkDmg, shadowRuneDmg, fervorMaxAS, fervorStacks, spellbladeAS, runicWrathDmg) {
  let totalPhys = 0, totalMagic = 0, time = 0, attacks = 0;
  let fervorCur = 0, runicUp = false, shadowUp = false;
  const sbAS = spellbladeAS || 0;

  while (time < duration) {
    const fervorBonusAS = fervorStacks > 0 ? (fervorCur / fervorStacks) * fervorMaxAS / 100 : 0;
    const curAS = bonusAS + fervorBonusAS + sbAS;
    const cd = BAT / (1 + curAS);
    time += cd;
    if (time > duration) break;
    attacks++;
    totalPhys += totalAD + colossusDmg;
    if (runicMarkDmg > 0) {
      if (runicUp) { totalMagic += runicMarkDmg; runicUp = false; }
      else { runicUp = true; }
    }
    if (shadowRuneDmg > 0) {
      if (shadowUp) { totalMagic += shadowRuneDmg; shadowUp = false; }
      else { shadowUp = true; }
    }
    if (runicWrathDmg > 0) totalMagic += runicWrathDmg;
    if (fervorMaxAS > 0 && fervorCur < fervorStacks) fervorCur++;
  }

  return { totalPhys, totalMagic, total: totalPhys + totalMagic,
    physDPS: totalPhys / duration, magicDPS: totalMagic / duration,
    totalDPS: (totalPhys + totalMagic) / duration, attacks };
}

// ── DPS Computation with buff states ────────────────────

function computeDPS(buffState, baseResult) {
  const s = baseResult;
  const pas = s.passives;
  const bs = buffState || {};

  let totalAD = s.totalAD;
  let colossusDmg = s.colossusDmg;
  let eqParts = [`base(${fmt(s.baseDamage,0)})`, `items(${fmt(s.iStats.ad,0)})`];

  if (s.auraADBonus > 0) eqParts.push(`Aura(${fmt(s.auraADBonus,0)})`);

  // War Shout: +25% of base AD
  if (bs.warShout && pas.hasWarbanner) {
    const bonus = s.baseDamage * 0.25;
    totalAD += bonus;
    eqParts.push(`WarShout(+25%base=${fmt(bonus,0)})`);
  }

  // Unleashed Rage: +35% of base AD
  if (bs.unleashedRage && pas.hasPoseidon) {
    const bonus = s.baseDamage * 0.35;
    totalAD += bonus;
    eqParts.push(`Rage(+35%base=${fmt(bonus,0)})`);
  }

  // War Cry: +5% maxHP as AD, Colossus doubled
  if (bs.warCry && pas.hasMace) {
    const bonus = s.totalHP * 0.05;
    totalAD += bonus;
    eqParts.push(`WarCry(+5%HP=${fmt(bonus,0)})`);
    if (pas.colossus) {
      colossusDmg = colossusDmg * 2;
      eqParts.push(`Colossus2x(${fmt(colossusDmg,0)})`);
    }
  } else if (colossusDmg > 0) {
    eqParts.push(`Colossus(${fmt(colossusDmg,0)})`);
  }

  const effectiveAD = totalAD + colossusDmg;

  // Attack speed with fervor stacks
  const fStacks = bs.fervorStacks !== undefined ? bs.fervorStacks : 0;
  const fervorAS = pas.fervorMaxAS > 0 && fStacks > 0 && pas.fervorStacks > 0
    ? (fStacks / pas.fervorStacks) * pas.fervorMaxAS / 100 : 0;
  const totalBonusAS = s.bonusAS + fervorAS;
  const aps = 1 / (s.BAT / (1 + totalBonusAS));

  // Magic DPS
  let runicWrathDmg = 0;
  let magicEqParts = [];

  if (pas.runicMarkDmg > 0) magicEqParts.push(`RunicMark(${pas.runicMarkDmg}/2hit)`);
  if (pas.shadowRuneDmg > 0) magicEqParts.push(`ShadowRune(${pas.shadowRuneDmg}/2hit)`);

  // Runic Wrath: 3% mana base, 8% mana with spell buff, cap 100 vs units
  if (pas.hasForeteller && pas.runicWrathBasePct > 0) {
    let rwPct = pas.runicWrathBasePct;
    if (bs.spellBuff) rwPct += pas.runicWrathSpellPct;
    const rwRaw = (rwPct / 100) * s.totalMana;
    runicWrathDmg = Math.min(rwRaw, 100);
    magicEqParts.push(`RunicWrath(${rwPct}%*${fmt(s.totalMana,0)}=${fmt(rwRaw,1)}, cap=${fmt(runicWrathDmg,0)})`);
  }

  const runicProcs = pas.runicMarkDmg > 0 ? aps / 2 : 0;
  const shadowProcs = pas.shadowRuneDmg > 0 ? aps / 2 : 0;
  const magicDPS = pas.runicMarkDmg * runicProcs + pas.shadowRuneDmg * shadowProcs + runicWrathDmg * aps;
  const physDPS = effectiveAD * aps;
  const totalDPS = physDPS + magicDPS;

  // Wall DPS computation
  const wArm = parseInt(el('structArmor')?.value) || 15;
  const wHP = parseInt(el('structHP')?.value) || 500;
  const wArmMult = 1 - 0.06 * wArm / (1 + 0.06 * wArm);
  const sFactor = 0.55;
  const wPhysPerHit = effectiveAD * sFactor * wArmMult;

  // Magic to structures: runic procs + runic wrath (UNCAPPED on structures)
  const wRunicPerHit = pas.runicMarkDmg > 0 ? pas.runicMarkDmg / 2 : 0;
  const wShadowPerHit = pas.shadowRuneDmg > 0 ? pas.shadowRuneDmg / 2 : 0;
  let wRunicWrath = 0;
  if (pas.hasForeteller && pas.runicWrathBasePct > 0) {
    let rwPct = pas.runicWrathBasePct;
    if (bs.spellBuff) rwPct += pas.runicWrathSpellPct;
    wRunicWrath = (rwPct / 100) * s.totalMana; // uncapped on structures
  }
  const wMagicPerHit = wRunicPerHit + wShadowPerHit + wRunicWrath;

  const wCrusher = pas.titanCrusherDmg || pas.structCrusherDmg || 0;
  const wTitanBonus = pas.titanBonusDmg || 0;
  const wBonusPerHit = wCrusher + wTitanBonus + pas.infernalBonusDmg;
  const wBurnDPS = (pas.burnPct / 100) * wHP + pas.burnFlatDPS;
  const wHitDPS = (wPhysPerHit + wMagicPerHit + wBonusPerHit) * aps;
  const wallDPS = wHitDPS + wBurnDPS;

  const equation = `AD = ${eqParts.join(' + ')} = ${fmt(effectiveAD,1)}` +
    `\nAPS = ${fmt(aps,2)}${fStacks > 0 ? ` (Fervor ${fStacks}/${pas.fervorStacks})` : ''}` +
    `\nPhys DPS = ${fmt(effectiveAD,1)} x ${fmt(aps,2)} = ${fmt(physDPS,1)}` +
    (magicEqParts.length ? `\nMagic: ${magicEqParts.join(' + ')}` : '') +
    `\nMagic DPS = ${fmt(magicDPS,1)}` +
    `\nTotal DPS = ${fmt(totalDPS,1)}` +
    `\nWall: (${fmt(wPhysPerHit,1)} phys + ${fmt(wMagicPerHit,1)} magic + ${fmt(wBonusPerHit,1)} pure) x ${fmt(aps,2)} + ${fmt(wBurnDPS,1)} burn = ${fmt(wallDPS,1)}`;

  return { physDPS, magicDPS, totalDPS, wallDPS, equation, effectiveAD, aps, colossusDmg, runicWrathDmg };
}


// ── Main computation ─────────────────────────────────────

function computeAll(items, overrides, titanKey, level) {
  items = items || equippedItems;
  overrides = overrides || itemOverrides;
  titanKey = titanKey || currentTitan;
  level = level || currentLevel;

  const titan = TITANS[titanKey];
  const base = getBaseStats(titanKey, level);
  const iStats = parseItemStats(items, overrides);
  const pas = parsePassives(items, overrides, level);

  const totalStr = base.str + iStats.vit;
  const totalAgi = base.agi + iStats.cel;
  const totalInt = base.int + iStats.wis;

  const totalHP = titan.base_hp + totalStr * 50 + iStats.hp;
  const totalMana = titan.base_mana + totalInt * 20 + iStats.mana;
  const totalHPRegen = titan.base_hp_regen + totalStr * 0.1 + iStats.hpRegen;
  const totalManaRegen = titan.base_mp_regen + totalInt * 0.1 + iStats.manaRegen;
  const totalArmor = base.armor + iStats.armor + pas.tidalFortArmor;
  const armorRed = 0.06 * totalArmor / (1 + 0.06 * totalArmor);
  const armorMult = 1 - armorRed;

  // MDR from stats + Magic Resist passives
  let totalMDR = iStats.mdr;
  items.forEach((item) => {
    if (!item) return;
    (item.passives || []).forEach(p => {
      if (/^magic resist$/i.test(p.name)) {
        totalMDR += extractNum(p.description, /(\d+)%/);
      }
    });
  });

  const auraADBonus = pas.auraWarPct > 0 ? base.baseDamage * (pas.auraWarPct / 100) : 0;
  const voodooWards = pas.voodooADPerWard > 0 ? 3 : 0;
  const totalAD = base.baseDamage + iStats.ad + auraADBonus + pas.voodooADPerWard * voodooWards;
  const colossusDmg = pas.colossus ? (pas.colossusPct / 100) * totalHP : 0;
  const effectiveAD = totalAD + colossusDmg;

  const bonusAS = 0.008 * totalAgi + iStats.asPct / 100;
  const fervorAS = pas.fervorMaxAS / 100;
  const cdBase = titan.BAT / (1 + bonusAS);
  const cdMax = titan.BAT / (1 + bonusAS + fervorAS);
  const apsBase = 1 / cdBase;
  const apsMax = 1 / cdMax;

  // Runic Wrath base DPS (vs units, capped at 100)
  let runicWrathBaseDmg = 0;
  if (pas.hasForeteller && pas.runicWrathBasePct > 0) {
    runicWrathBaseDmg = Math.min((pas.runicWrathBasePct / 100) * totalMana, 100);
  }

  const physDPS = effectiveAD * apsBase;
  const runicProcs = pas.runicMarkDmg > 0 ? apsBase / 2 : 0;
  const shadowProcs = pas.shadowRuneDmg > 0 ? apsBase / 2 : 0;
  const magicDPS = pas.runicMarkDmg * runicProcs + pas.shadowRuneDmg * shadowProcs + runicWrathBaseDmg * apsBase;
  const totalDPS = physDPS + magicDPS;

  const physDPSMax = effectiveAD * apsMax;
  const runicProcsMax = pas.runicMarkDmg > 0 ? apsMax / 2 : 0;
  const shadowProcsMax = pas.shadowRuneDmg > 0 ? apsMax / 2 : 0;
  const magicDPSMax = pas.runicMarkDmg * runicProcsMax + pas.shadowRuneDmg * shadowProcsMax + runicWrathBaseDmg * apsMax;
  const totalDPSMax = physDPSMax + magicDPSMax;

  const sim10 = simulateDPS(10, totalAD, colossusDmg, titan.BAT, bonusAS, pas.runicMarkDmg, pas.shadowRuneDmg, pas.fervorMaxAS, pas.fervorStacks, 0, runicWrathBaseDmg);
  const sim30 = simulateDPS(30, totalAD, colossusDmg, titan.BAT, bonusAS, pas.runicMarkDmg, pas.shadowRuneDmg, pas.fervorMaxAS, pas.fervorStacks, 0, runicWrathBaseDmg);
  const sim60 = simulateDPS(60, totalAD, colossusDmg, titan.BAT, bonusAS, pas.runicMarkDmg, pas.shadowRuneDmg, pas.fervorMaxAS, pas.fervorStacks, 0, runicWrathBaseDmg);

  const lifestealPerHit = pas.lifestealFlat + (pas.lifestealPct / 100) * totalStr;
  const lifestealPerSec = lifestealPerHit * apsBase;
  const cdr = pas.swiftCastingPct;
  const smashHealPerSec = pas.smashPct > 0 ? (pas.smashPct / 100) * totalHP * apsBase / 2 : 0;

  // Structure (walls are always Fortified)
  const sArm = parseInt(el('structArmor')?.value) || 15;
  const sHP = parseInt(el('structHP')?.value) || 500;
  const sArmMult = 1 - 0.06 * sArm / (1 + 0.06 * sArm);
  const sFactor = 0.55;
  const sPhysPerHit = effectiveAD * sFactor * sArmMult;

  const sRunicPerHit = pas.runicMarkDmg > 0 ? pas.runicMarkDmg / 2 : 0;
  const sShadowPerHit = pas.shadowRuneDmg > 0 ? pas.shadowRuneDmg / 2 : 0;
  let sRunicWrath = 0;
  if (pas.hasForeteller && pas.runicWrathBasePct > 0) {
    sRunicWrath = (pas.runicWrathBasePct / 100) * totalMana; // uncapped on structures
  }
  const sMagicPerHit = sRunicPerHit + sShadowPerHit + sRunicWrath;

  const sCrusher = pas.titanCrusherDmg || pas.structCrusherDmg || 0;
  const sTitanBonus = pas.titanBonusDmg || 0;
  const sBonusPerHit = sCrusher + sTitanBonus + pas.infernalBonusDmg;
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
    effTDPS = tDPS * tFactor * (1 - totalMDR / 100) * (1 - pas.tidalFortPct / 100);
  } else {
    effTDPS = tDPS * tFactor * armorMult * (1 - pas.tidalFortPct / 100) * (1 - pas.tidalFortPhysPct / 100);
  }
  const dmgMult = tType === 'magic'
    ? tFactor * (1 - totalMDR / 100) * (1 - pas.tidalFortPct / 100)
    : tFactor * armorMult * (1 - pas.tidalFortPct / 100) * (1 - pas.tidalFortPhysPct / 100);
  const effHP = dmgMult > 0 ? totalHP / dmgMult : Infinity;
  const totalSustain = totalHPRegen + lifestealPerSec + smashHealPerSec;
  const netHP = totalSustain - effTDPS;
  let ttd;
  if (effTDPS <= 0) ttd = Infinity;
  else if (netHP >= 0) ttd = Infinity;
  else ttd = totalHP / (-netHP);

  return {
    totalStr, totalAgi, totalInt,
    totalHP, totalMana, totalArmor, armorRed, armorMult, mdr: totalMDR,
    totalHPRegen, totalManaRegen,
    effectiveAD, totalAD, colossusDmg, auraADBonus, baseDamage: base.baseDamage,
    cdBase, cdMax, apsBase, apsMax, BAT: titan.BAT, bonusAS,
    physDPS, magicDPS, totalDPS, totalDPSMax,
    sim10, sim30, sim60,
    lifestealPerHit, lifestealPerSec, smashHealPerSec,
    crisisRegen: pas.crisisRegen, cdr,
    tidalFortPct: pas.tidalFortPct, tidalFortPhysPct: pas.tidalFortPhysPct,
    sPhysPerHit, sMagicPerHit, sBonusPerHit, sBurnDPS, sTotalDPS, sHTK, sTTK,
    effTDPS, dmgMult, effHP, ttd, netHP,
    passives: pas, iStats
  };
}

// ── Render DPS Breakdown Table ──────────────────────────

function buildScenarios(pas) {
  const scenarios = [];

  // Always show base
  scenarios.push({
    label: 'Base (no buffs)',
    state: { warShout: false, unleashedRage: false, warCry: false, spellBuff: false, fervorStacks: 0 }
  });

  // Fervor full stacks
  if (pas.hasFervor) {
    scenarios.push({
      label: 'Fervor (max stacks)',
      state: { warShout: false, unleashedRage: false, warCry: false, spellBuff: false, fervorStacks: pas.fervorStacks }
    });
  }

  // Individual buffs
  if (pas.hasWarbanner) {
    scenarios.push({
      label: '+ War Shout (Warbanner)',
      state: { warShout: true, unleashedRage: false, warCry: false, spellBuff: false, fervorStacks: pas.hasFervor ? pas.fervorStacks : 0 }
    });
  }
  if (pas.hasPoseidon) {
    scenarios.push({
      label: '+ Unleashed Rage (Poseidon)',
      state: { warShout: false, unleashedRage: true, warCry: false, spellBuff: false, fervorStacks: pas.hasFervor ? pas.fervorStacks : 0 }
    });
  }
  if (pas.hasMace) {
    scenarios.push({
      label: '+ War Cry (Mace)',
      state: { warShout: false, unleashedRage: false, warCry: true, spellBuff: false, fervorStacks: pas.hasFervor ? pas.fervorStacks : 0 }
    });
  }
  if (pas.hasForeteller) {
    scenarios.push({
      label: '+ Spell Buff (Foreteller)',
      state: { warShout: false, unleashedRage: false, warCry: false, spellBuff: true, fervorStacks: pas.hasFervor ? pas.fervorStacks : 0 }
    });
  }

  // All active
  const buffCount = [pas.hasWarbanner, pas.hasPoseidon, pas.hasMace, pas.hasForeteller, pas.hasFervor].filter(Boolean).length;
  if (buffCount >= 2) {
    scenarios.push({
      label: 'All Active',
      state: {
        warShout: pas.hasWarbanner,
        unleashedRage: pas.hasPoseidon,
        warCry: pas.hasMace,
        spellBuff: pas.hasForeteller,
        fervorStacks: pas.hasFervor ? pas.fervorStacks : 0
      }
    });
  }

  return scenarios;
}

function renderDPSTableBody(tbodyId, scenarios, baseResult) {
  const tbody = el(tbodyId);
  if (!tbody) return;
  let html = '';
  scenarios.forEach(sc => {
    const result = computeDPS(sc.state, baseResult);
    const cls = sc.label === 'All Active' ? ' class="sim-dps-row-highlight"' : '';
    html += `<tr${cls} title="${esc(result.equation)}">
      <td class="sim-dps-scenario">${esc(sc.label)}</td>
      <td>${fmt(result.physDPS, 1)}</td>
      <td>${fmt(result.magicDPS, 1)}</td>
      <td class="sim-dps-total">${fmt(result.totalDPS, 1)}</td>
      <td>${fmt(result.wallDPS, 1)}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

function renderDPSTable(s, b) {
  const scenariosA = buildScenarios(s.passives);
  renderDPSTableBody('dpsTableBody', scenariosA, s);

  const panelB = el('dpsPanelB');
  const labelA = el('dpsPanelLabelA');
  if (compareMode && b) {
    panelB.hidden = false;
    labelA.hidden = false;
    const scenariosB = buildScenarios(b.passives);
    renderDPSTableBody('dpsTableBodyB', scenariosB, b);
  } else {
    panelB.hidden = true;
    labelA.hidden = true;
  }
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
  setWithDiff('statASBase', s.cdBase, fmt(s.cdBase, 3) + 's', false, b?.cdBase, b ? fmt(b.cdBase, 3) + 's' : undefined);
  setWithDiff('statASMax', s.cdMax, s.apsMax !== s.apsBase ? fmt(s.cdMax, 3) + 's' : '&mdash;', false, b?.cdMax, b && b.apsMax !== b.apsBase ? fmt(b.cdMax, 3) + 's' : '&mdash;');
  setWithDiff('statAPSBase', s.apsBase, fmt(s.apsBase, 2), true, b?.apsBase, b ? fmt(b.apsBase, 2) : undefined);
  setWithDiff('statAPSMax', s.apsMax, s.apsMax !== s.apsBase ? fmt(s.apsMax, 2) : '&mdash;', true, b?.apsMax, b && b.apsMax !== b.apsBase ? fmt(b.apsMax, 2) : '&mdash;');
  setWithDiff('statPhysDPS', s.physDPS, fmt(s.physDPS, 1), true, b?.physDPS, b ? fmt(b.physDPS, 1) : undefined);
  setWithDiff('statMagicDPS', s.magicDPS, fmt(s.magicDPS, 1), true, b?.magicDPS, b ? fmt(b.magicDPS, 1) : undefined);
  setWithDiff('statTotalDPS', s.totalDPS, fmt(s.totalDPS, 1), true, b?.totalDPS, b ? fmt(b.totalDPS, 1) : undefined);
  setWithDiff('statTotalDPSMax', s.totalDPSMax, s.totalDPSMax!==s.totalDPS?fmt(s.totalDPSMax,1):'&mdash;', true, b?.totalDPSMax, b&&b.totalDPSMax!==b.totalDPS?fmt(b.totalDPSMax,1):'&mdash;');

  setWithDiff('statLifestealHit', s.lifestealPerHit, s.lifestealPerHit>0?fmt(s.lifestealPerHit,1):'&mdash;', true, b?.lifestealPerHit, b&&b.lifestealPerHit>0?fmt(b.lifestealPerHit,1):'&mdash;');
  setWithDiff('statLifestealSec', s.lifestealPerSec, s.lifestealPerHit>0?fmt(s.lifestealPerSec,1):'&mdash;', true, b?.lifestealPerSec, b&&b.lifestealPerHit>0?fmt(b.lifestealPerSec,1):'&mdash;');
  const totalRecov = s.totalHPRegen + s.lifestealPerSec + s.smashHealPerSec;
  const totalRecovB = b ? b.totalHPRegen + b.lifestealPerSec + b.smashHealPerSec : undefined;
  setWithDiff('statTotalRecovery', totalRecov, fmt(totalRecov, 1), true, totalRecovB, totalRecovB !== undefined ? fmt(totalRecovB, 1) : undefined);
  setHtml('statCrisis', s.crisisRegen ? 'Yes' : '&mdash;');
  setWithDiff('statCDR', s.cdr, s.cdr > 0 ? s.cdr + '%' : '&mdash;', true, b?.cdr, b && b.cdr > 0 ? b.cdr + '%' : '&mdash;');


  setWithDiff('statTowerEffDPS', s.effTDPS, fmt(s.effTDPS, 1), false, b?.effTDPS, b?fmt(b.effTDPS,1):undefined);
  setWithDiff('statEffHP', s.effHP, fmt(s.effHP, 0), true, b?.effHP, b?fmt(b.effHP,0):undefined);
  setWithDiff('statTTD', s.ttd, s.ttd===Infinity?'&infin;':fmt(s.ttd,1)+'s', true, b?.ttd, b?b.ttd===Infinity?'&infin;':fmt(b.ttd,1)+'s':undefined);
  const netEl = el('statNetHP');
  if (netEl) {
    if (compareMode && b) {
      const clsA = s.netHP >= 0 ? 'sim-diff-up' : 'sim-diff-down';
      const clsB = b.netHP >= 0 ? 'sim-diff-up' : 'sim-diff-down';
      netEl.innerHTML = `<span class="${clsA}">${fmt(s.netHP,1)}</span> <span class="sim-diff sim-diff-neutral">vs</span> <span class="${clsB}">${fmt(b.netHP,1)}</span>`;
    } else {
      netEl.innerHTML = fmt(s.netHP, 1);
      netEl.className = s.netHP >= 0 ? 'val-green' : 'val-red';
    }
  }

  // Tooltips
  const base = getBaseStats();
  const t = TITANS[currentTitan];
  const iS = s.iStats;
  const tip = (id, txt) => {
    const e = el(id);
    if (!e) return;
    e.title = txt;
    const row = e.closest('.sim-stat-row');
    if (row) row.title = txt;
  };
  tip('tipHP', `Base: ${t.base_hp} + VIT(${fmt(s.totalStr,1)}) x 50 = ${fmt(s.totalStr*50,0)} + items(${iS.hp})\n= ${fmt(s.totalHP,0)}`);
  tip('tipMana', `Base: ${t.base_mana} + WIS(${fmt(s.totalInt,1)}) x 20 = ${fmt(s.totalInt*20,0)} + items(${iS.mana})\n= ${fmt(s.totalMana,0)}`);
  tip('tipArmor', `Lv${currentLevel}: ${base.armor} + items(${iS.armor}) + passives(${s.totalArmor - base.armor - iS.armor})\n= ${fmt(s.totalArmor,1)}`);
  tip('tipArmorRed', `0.06 x ${fmt(s.totalArmor,1)} / (1 + 0.06 x ${fmt(s.totalArmor,1)})\n= ${fmt(s.armorRed*100,1)}%`);
  tip('tipMDR', `Items + Passives: ${s.mdr}%`);
  tip('tipHPRegen', `Base: ${fmt(t.base_hp_regen,1)} + VIT(${fmt(s.totalStr,1)}) x 0.1 + items(${fmt(iS.hpRegen,1)})\n= ${fmt(s.totalHPRegen,1)}/s`);
  tip('tipManaRegen', `Base: ${fmt(t.base_mp_regen,1)} + WIS(${fmt(s.totalInt,1)}) x 0.1 + items(${fmt(iS.manaRegen,1)})\n= ${fmt(s.totalManaRegen,1)}/s`);
  tip('tipAD', `Base(Lv${currentLevel}): ${base.baseDamage} + items(${iS.ad})${s.auraADBonus > 0 ? ` + Aura(${fmt(s.auraADBonus,0)} = ${s.passives.auraWarPct}% of ${base.baseDamage})` : ''}${s.colossusDmg > 0 ? ` + Colossus(${fmt(s.colossusDmg,0)})` : ''}\n= ${fmt(s.effectiveAD,1)}`);

  const tDPSv = parseFloat(el('towerDPS')?.value) || 100;
  const tTp = el('towerDmgType')?.value || 'ranged';
  const tF = DMG_VS_HERO[tTp] || 0.5;
  tip('statTowerEffDPS', tTp === 'magic'
    ? `${tDPSv} x ${tF} (magic) x (1 - ${fmt(s.mdr,0)}% MDR)${s.tidalFortPct > 0 ? ` x (1 - ${s.tidalFortPct}% Tidal Fort)` : ''}\n= ${fmt(s.effTDPS,1)}`
    : `${tDPSv} x ${tF} (ranged) x ${fmt(s.armorMult,3)} (armor ${fmt(s.totalArmor,1)})${s.tidalFortPct > 0 ? ` x (1 - ${s.tidalFortPct}% Tidal Fort)` : ''}${s.tidalFortPhysPct > 0 ? ` x (1 - ${s.tidalFortPhysPct}% phys)` : ''}\n= ${fmt(s.effTDPS,1)}`);
  tip('statEffHP', `HP(${fmt(s.totalHP,0)}) / dmg_mult(${fmt(s.dmgMult,4)})\n= ${fmt(s.effHP,0)}\nHow much raw damage needed to kill you`);
  tip('statTTD', s.netHP >= 0
    ? `Outhealing! Regen(${fmt(s.totalHPRegen,1)}) + Lifesteal(${fmt(s.lifestealPerSec,1)}) + Smash(${fmt(s.smashHealPerSec,1)}) >= Tower(${fmt(s.effTDPS,1)})`
    : `${fmt(s.totalHP,0)} HP / ${fmt(-s.netHP,1)} net DPS (${fmt(s.effTDPS,1)} tower - ${fmt(s.totalHPRegen+s.lifestealPerSec+s.smashHealPerSec,1)} sustain)\n= ${fmt(s.ttd,1)}s`);
  tip('statNetHP', `Regen(${fmt(s.totalHPRegen,1)}) + Lifesteal(${fmt(s.lifestealPerSec,1)}) + Smash(${fmt(s.smashHealPerSec,1)}) - Tower(${fmt(s.effTDPS,1)})\n= ${fmt(s.netHP,1)}/s`);

  setHtml('titanAttrs', `<span class="attr-vit">VIT ${fmt(s.totalStr,1)}</span> <span class="attr-cel">CEL ${fmt(s.totalAgi,1)}</span> <span class="attr-wis">WIS ${fmt(s.totalInt,1)}</span> <span class="attr-bcd">BAT ${t.BAT}</span>`);

  if (compareMode && !titanLinked && b) {
    const tB = TITANS[currentTitanB];
    setHtml('titanAttrsB', `<span class="attr-vit">VIT ${fmt(b.totalStr,1)}</span> <span class="attr-cel">CEL ${fmt(b.totalAgi,1)}</span> <span class="attr-wis">WIS ${fmt(b.totalInt,1)}</span> <span class="attr-bcd">BAT ${tB.BAT}</span>`);
  }

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

  const cost = equippedItems.reduce((sum, it) => sum + (it ? (it.totalCost || it.cost || 0) : 0), 0);
  setHtml('simTotalCost', cost + 'g');
  if (compareMode) {
    const costB = equippedItemsB.reduce((sum, it) => sum + (it ? (it.totalCost || it.cost || 0) : 0), 0);
    setHtml('simTotalCostB', costB + 'g');
  }

  renderDPSTable(s, b);
}

// ── Key value extraction for editable passives ───────────

function getKeyValue(name, desc) {
  if (/^runic mark$/i.test(name) || /^runic exposure$/i.test(name)) {
    const m = desc.match(/deals?\s+(\d+)\s+(?:bonus\s+)?magic/i) || desc.match(/(\d+)\s+(?:bonus\s+)?magic damage/i);
    return { val: m ? parseInt(m[1]) : null, label: 'magic dmg' };
  }
  if (/shadow rune/i.test(name)) {
    const m = desc.match(/deals?\s+(\d+)\s+magic/i);
    return { val: m ? parseInt(m[1]) : null, label: 'magic dmg' };
  }
  if (/structure crusher/i.test(name) || /^titan$/i.test(name)) return { val: null, label: '' };
  if (/titan crusher/i.test(name)) {
    const m = desc.match(/^.*?(\d+)\s*\+/);
    return { val: m ? parseInt(m[1]) : null, label: 'base bonus dmg' };
  }
  if (/structure burn|infernal siege/i.test(name)) {
    const m = desc.match(/(\d+)%\s+(?:of|maximum)/i) || desc.match(/dealing\s+(\d+)/i);
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
  if (/voodoo decay/i.test(name)) {
    const m = desc.match(/armor by (\d+)/i);
    return { val: m ? parseInt(m[1]) : null, label: 'armor reduction' };
  }
  if (/voodoo power|^voodoo$/i.test(name)) {
    const m = desc.match(/grants?\s+(\d+)/i);
    return { val: m ? parseInt(m[1]) : null, label: 'AD/ward' };
  }
  if (/colossus/i.test(name)) {
    const m = desc.match(/([\d.]+)%/);
    return { val: m ? parseFloat(m[1]) : null, label: '% max HP' };
  }
  if (/^smash$/i.test(name)) {
    const m = desc.match(/([\d.]+)%/);
    return { val: m ? parseFloat(m[1]) : null, label: '% max HP heal' };
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
  if (/^magic resist$/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'MDR %' };
  }
  if (/spell armor/i.test(name)) {
    const m = desc.match(/(\d+)%.*damage/i);
    return { val: m ? parseInt(m[1]) : null, label: 'dmg red %/stack' };
  }
  if (/aura of war/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'AD bonus %' };
  }
  if (/nuke\s*master/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'nuke bonus %' };
  }
  if (/nuke\s*enjoyer/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'nuke CDR %' };
  }
  if (/runic wrath/i.test(name)) {
    const m = desc.match(/(\d+)%\s+max mana/i);
    return { val: m ? parseInt(m[1]) : null, label: 'mana %' };
  }
  if (/spellblade/i.test(name)) return { val: null, label: '' };
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
  if (/war shout/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'AD bonus %' };
  }
  if (/unleashed rage/i.test(name)) {
    const m = desc.match(/(\d+)%/);
    return { val: m ? parseInt(m[1]) : null, label: 'AD bonus %' };
  }
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
        const ovVal = overrides[i]?.stats?.[si];
        const dv = ovVal !== undefined ? ovVal : origVal;
        const label = str.replace(/[\d.]+/, '').replace(/^\s*\+\s*/, '').trim();
        return `<div class="sim-slot-stat">
          <input type="number" class="sim-stat-input ${ovVal !== undefined && parseFloat(ovVal) !== origVal ? 'sim-overridden' : ''}"
            value="${dv}" data-slot="${i}" data-stat="${si}" data-orig="${origVal}" step="any">
          <span class="sim-stat-label">${esc(label)}</span>
        </div>`;
      }).join('');

      const allEffects = [...(item.passives || [])];
      if (item.active) allEffects.push({ name: item.active.name, description: item.active.description, _isActive: true });

      const effectsHtml = allEffects.map((ef, ei) => {
        const isActive = ef._isActive;
        const desc = ef.description || '';
        const kv = getKeyValue(ef.name, desc);
        const ovVal = overrides[i]?.passiveVals?.[ei];
        const displayVal = ovVal !== undefined ? ovVal : kv.val;
        const isOv = ovVal !== undefined && kv.val !== null && parseFloat(ovVal) !== kv.val;
        let numInput = '';
        if (kv.val !== null) {
          numInput = `<input type="number" class="sim-passive-num ${isOv ? 'sim-overridden' : ''}" value="${displayVal}" data-slot="${i}" data-eidx="${ei}" data-orig="${kv.val}" data-label="${esc(kv.label)}" title="${esc(kv.label)}" step="any">`;
        }
        const cls = isActive ? 'sim-slot-active' : 'sim-slot-passive';
        return `<div class="${cls}">${numInput}${esc(ef.name)}</div>`;
      }).join('');

      slot.innerHTML = `
        <div class="sim-slot-header">
          <span class="sim-slot-name">${esc(item.name)}</span>
          <button class="sim-slot-remove" data-idx="${i}">&times;</button>
        </div>
        <div class="sim-slot-cost">${item.totalCost || item.cost || 0}g</div>
        ${statsHtml}${effectsHtml}
      `;

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

// ── Find decent_v5 version ID ───────────────────────────

function findV5VersionId() {
  const allVersions = versions.getAll();
  const v5 = allVersions.find(v => v.name && /decent.v5/i.test(v.name));
  return v5 ? v5.id : null;
}

// ── Init ─────────────────────────────────────────────────

(function init() {
  const tSel = el('titanSelect');
  tSel.innerHTML = Object.entries(TITANS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
  tSel.value = currentTitan;
  tSel.addEventListener('change', () => { currentTitan = tSel.value; renderStats(); });

  const slider = el('levelSlider');
  const lvDisp = el('levelDisplay');
  slider.value = currentLevel;
  lvDisp.textContent = currentLevel;
  slider.addEventListener('input', () => { currentLevel = parseInt(slider.value); lvDisp.textContent = currentLevel; renderStats(); });

  // Version selector — populate with all versions, default to decent_v5
  const vSel = el('simVersionSelect');
  function populateVersionSelect() {
    const allVersions = versions.getAll();
    vSel.innerHTML = allVersions.map(v => `<option value="${v.id}">${esc(v.name)}</option>`).join('');
    const v5Id = findV5VersionId();
    if (v5Id) {
      currentVersionId = v5Id;
    } else {
      currentVersionId = 'base';
    }
    vSel.value = currentVersionId;
    versionItems = loadVersionItems();
  }

  populateVersionSelect();

  // Re-populate after delay for async community versions
  setTimeout(() => {
    const v5Id = findV5VersionId();
    if (v5Id && currentVersionId !== v5Id) {
      populateVersionSelect();
      renderSlots('A');
      renderStats();
    }
  }, 1500);

  vSel.addEventListener('change', () => {
    currentVersionId = vSel.value;
    versionItems = loadVersionItems();
    equippedItems = [null, null, null, null, null, null];
    itemOverrides = [{}, {}, {}, {}, {}, {}];
    equippedItemsB = [null, null, null, null, null, null];
    itemOverridesB = [{}, {}, {}, {}, {}, {}];
    renderSlots('A');
    if (compareMode) renderSlots('B');
    renderStats();
  });

  document.addEventListener('versionchange', () => {
    populateVersionSelect();
    renderSlots('A');
    if (compareMode) renderSlots('B');
    renderStats();
  });

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

  ['structArmor', 'structHP', 'towerDPS', 'towerDmgType'].forEach(id => {
    const e = el(id);
    if (e) { e.addEventListener('input', renderStats); e.addEventListener('change', renderStats); }
  });

  // Wall config in DPS table
  [].forEach(id => {
    const e = el(id);
    if (e) { e.addEventListener('input', renderStats); e.addEventListener('change', renderStats); }
  });

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

  el('compareModeBtn').addEventListener('click', () => {
    compareMode = !compareMode;
    el('compareModeBtn').classList.toggle('active', compareMode);
    el('simRightLoadout').hidden = !compareMode;
    if (compareMode) renderSlots('B');
    renderStats();
  });

  const tSelB = el('titanSelectB');
  tSelB.innerHTML = Object.entries(TITANS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
  tSelB.value = currentTitanB;
  tSelB.addEventListener('change', () => { currentTitanB = tSelB.value; renderStats(); });

  const sliderB = el('levelSliderB');
  const lvDispB = el('levelDisplayB');
  sliderB.value = currentLevelB;
  lvDispB.textContent = currentLevelB;
  sliderB.addEventListener('input', () => { currentLevelB = parseInt(sliderB.value); lvDispB.textContent = currentLevelB; renderStats(); });

  el('unlinkTitanBtn').addEventListener('click', () => {
    titanLinked = !titanLinked;
    el('unlinkTitanBtn').textContent = titanLinked ? 'Shared' : 'Independent';
    el('unlinkTitanBtn').classList.toggle('unlinked', !titanLinked);
    el('titanBPanel').hidden = titanLinked;
    if (!titanLinked) { currentTitanB = currentTitan; currentLevelB = currentLevel; tSelB.value = currentTitanB; sliderB.value = currentLevelB; lvDispB.textContent = currentLevelB; }
    renderStats();
  });

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
