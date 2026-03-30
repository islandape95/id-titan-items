// ============================================================
//  SUGGESTIONS DATA  –  auto-imported from Titan Items Suggestions.xlsx
//  Creates a pre-loaded "decent version" version
//  on first load if it doesn't already exist.
// ============================================================

(function() {

  const SUGGESTIONS_KEY = 'suggestions_v1_imported';
  if (localStorage.getItem(SUGGESTIONS_KEY)) return; // already imported

  // Deep copy base items
  const items = JSON.parse(JSON.stringify(ITEMS_DATA.items));
  const byId = new Map(items.map(i => [i.id, i]));

  function get(id) { return byId.get(id); }

  // ── New Items ──────────────────────────────────────────────

  // Berserker's Gem (T2, offensive)
  const berserkersGem = {
    id: "berserkers-gem",
    name: "Berserker's Gem",
    tier: "t2",
    cost: 80,
    category: "offensive",
    stats: ["+25% Attack Speed"],
    use: null,
    active: null,
    passives: [],
    requires: [
      { id: "gem-of-haste", count: 2 }
    ],
    comment: "Classic attack speed stat stick Tier 2 item that is usable for several builds."
  };
  items.push(berserkersGem);
  byId.set(berserkersGem.id, berserkersGem);

  // Vampiric Mask (T2, offensive)
  const vampiricMask = {
    id: "vampiric-mask",
    name: "Vampiric Mask",
    tier: "t2",
    cost: 60,
    category: "offensive",
    stats: [],
    use: null,
    active: null,
    passives: [
      { name: "Vampirism", description: "Basic attacks heal you for 30." }
    ],
    requires: [
      { id: "regenerative-spines", count: 2 }
    ],
    comment: "We are lacking a pure \"Lifesteal\" TIER-2 item."
  };
  items.push(vampiricMask);
  byId.set(vampiricMask.id, vampiricMask);

  // ── Modified Items ─────────────────────────────────────────

  // 1. Chimaera Pendant — simplify to just scout summon
  const chimaera = get("chimera-pendant");
  if (chimaera) {
    chimaera.cost = 50;
    chimaera.passives = []; // Remove Scout Efficiency
    chimaera.comment = "Item without an identity and breaks the \"rules\" of items. Only use case is grabbing \"stolen items\" in seeds and should be kept simply for that.";
  }

  // 2. Farseer's Staff — fix stat regression
  const farseers = get("farseers-staff");
  if (farseers) {
    farseers.stats = ["+300 Mana Points", "+4 Mana Regen/s"]; // 3 -> 4
    farseers.comment = "To match the rule of no stat decrease.";
  }

  // 3. Caster Scroll — remove Chimera Pendant, add 2nd Tide's Heart, adjust stats
  const caster = get("caster-scroll");
  if (caster) {
    caster.cost = 40; // 45 -> 40
    caster.stats = ["+300 Hit Points"]; // 250 -> 300
    caster.requires = [
      { id: "rune-fragment", count: 1 },
      { id: "tides-heart", count: 2 } // was 1x chimera + 1x rune + 1x tides
    ];
    caster.comment = "Removing Chimaera Pendant for build path and replacing it with another HP component.";
  }

  // 4. Tidal Guardian's Grace — standalone utility item
  const tidalGuardian = get("tidal-guardians-grace");
  if (tidalGuardian) {
    tidalGuardian.cost = 215; // 155 -> 215
    tidalGuardian.stats = []; // Remove +15% Attack Speed
    tidalGuardian.requires = []; // Remove Chimera Pendant + Gem of Haste
    tidalGuardian.comment = "Should be considered a pure utility item pre first mini kill and therefore should be easier to invest into and sell later. Also removing Chimaera Pendant from build path.";
  }

  // 5. Gauntlets of Embers — simplify to wall farmer
  const gauntlets = get("gauntlets-of-embers");
  if (gauntlets) {
    gauntlets.cost = 130; // 55 -> 130
    gauntlets.stats = []; // Remove +15% Attack Speed
    gauntlets.passives = [
      { name: "Structure Burn", description: "Attacks burn enemy structures for 5 seconds, dealing 25 damage per second." } // 20 -> 25
    ]; // Remove Emberhearth
    gauntlets.requires = [
      { id: "rune-fragment", count: 1 }
    ]; // Remove Watcher Eyes and Gem of Haste
    gauntlets.comment = "Should have a simple identity as the wall farmer. Reducing gold costs makes the item easier to access and replace later if the Titan wishes.";
  }

  // 6. Voodoo Doll — replace Watcher Eyes with Healing Wards
  const voodoo = get("voodoo-doll");
  if (voodoo) {
    voodoo.cost = 75; // 55 -> 75
    voodoo.requires = [
      { id: "surge-trident", count: 1 },
      { id: "healing-ward", count: 2 }
    ]; // Remove 3x Watcher Eye, add 2x Healing Ward
  }

  // 7. Poseidon's Trident — new build path with Berserker's Gem
  const poseidon = get("poseidons-trident");
  if (poseidon) {
    poseidon.cost = 275; // 180 -> 275
    poseidon.stats = ["+40 Attack Damage", "+25% Attack Speed"]; // Remove MS 30, change AS 10->25
    poseidon.active = { name: "Unleashed Rage", cooldown: "60s", description: "Gain 25% bonus attack damage for (4 + 1 \u00d7 hero level) seconds." };
    poseidon.passives = [
      { name: "Titan Crusher", description: "Basic attacks on structures deal 10 + (5 \u00d7 hero level) bonus pure damage on hit, up to a maximum of 50 bonus damage." } // 20 -> 10 base
    ];
    poseidon.requires = [
      { id: "titanic-tridents", count: 1 },
      { id: "berserkers-gem", count: 1 }
    ]; // Remove Stormrider Cloak, add Berserker's Gem
    poseidon.comment = "Move speed should not be on this item, weird build path + regaining its identity as a high burst option.";
  }

  // 8. Highseer Slippers — new build path
  const highseer = get("highseer-slippers");
  if (highseer) {
    highseer.cost = 240; // 140 -> 240
    highseer.stats = ["+25 Attack Damage", "+25% Attack Speed"]; // Remove MS 40, change AS 15->25
    highseer.requires = [
      { id: "runic-axe", count: 1 },
      { id: "berserkers-gem", count: 1 }
    ]; // Remove Tidal Guardian's Grace + Gem of Haste, add Berserker's Gem
  }

  // 9. Spear of Fervor — pure on-hit item
  const spear = get("spear-of-fervor");
  if (spear) {
    spear.cost = 150; // 255 -> 150
    spear.stats = ["+50% Attack Speed"]; // Remove AD 30, change AS 20->50
    spear.passives = [
      { name: "Fervor", description: "Basic attacks grant bonus attack speed for 2.5 seconds, stacking up to 6 times for up to 30% bonus attack speed." }, // 10->6 stacks, 33->30%
      { name: "Vampirism", description: "Basic attacks heal you for 20 + 35% Primary Stat." }
    ]; // Remove Lifesteal, add Vampirism
    spear.requires = [
      { id: "berserkers-gem", count: 2 },
      { id: "vampiric-mask", count: 1 }
    ]; // Remove Gauntlets + Voodoo, add 2x Berserker's + Vampiric
    spear.comment = "Pure on hit item. Trying to create more distinct identities between the pure damage TIER-3 items.";
  }

  // 10. Helmet of the Damned — add Vampiric Mask, adjust passives
  const helmet = get("helmet-of-the-damned");
  if (helmet) {
    helmet.cost = 75; // 275 -> 75
    helmet.passives = [
      { name: "Aura of War", description: "Increases attack damage of nearby allied units within range 950 by 15%. After killing an enemy, gain an additional 5% attack damage bonus for 5 seconds." },
      { name: "Voodoo", description: "Each voodoo ward grants 10 extra attack damage and causes basic attacks to heal you for 20 + 40% vitality." },
      { name: "Vampirism", description: "Basic attacks heal you for 20 + 40% Primary Stat." }
    ];
    helmet.requires = [
      { id: "voodoo-doll", count: 1 },
      { id: "warbanner", count: 1 },
      { id: "vampiric-mask", count: 1 }
    ]; // Add Vampiric Mask
    helmet.comment = "Smoothing out the build path - is it possible to heal based on Primary Stat instead of Vitality?";
  }

  // 11. Molten Blade — add Berserker's Gem, adjust stats
  const molten = get("molten-blade");
  if (molten) {
    molten.cost = 55; // 180 -> 55
    molten.stats = ["+20 Attack Damage", "+25% Attack Speed"]; // AD 25->20, AS 20->25
    molten.requires = [
      { id: "gauntlets-of-embers", count: 1 },
      { id: "spectral-blade", count: 1 },
      { id: "berserkers-gem", count: 1 }
    ]; // Add Berserker's Gem
    molten.comment = "Should this even be an attack speed item? Make it way cheaper and remove attack speed to have a clearer identity (less Spear-like)?";
  }

  // 12. Mace of Mortality — remove Tidal Guardian, add Tide's Heart
  const mace = get("mace-of-mortality");
  if (mace) {
    mace.cost = 290; // 105 -> 290
    mace.stats = ["+40 Attack Damage", "+400 Hit Points"]; // Remove MS 40
    mace.requires = [
      { id: "caster-scroll", count: 1 },
      { id: "warbanner", count: 1 },
      { id: "tides-heart", count: 1 }
    ]; // Remove Tidal Guardian's Grace, add Tide's Heart
  }

  // 13. Essence of Pure Magic — stat and active tweaks
  const essence = get("essence-of-pure-magic");
  if (essence) {
    essence.stats = ["+500 Mana Points", "+400 Hit Points"]; // Mana 400 -> 500
    essence.active = { name: "Mana Surge", cooldown: "60s", description: "Regenerate (1500 + 500% windsom) mana and health over 3 seconds. For the duration, the user is invulnerable." }; // 4 -> 3 seconds + invulnerable
  }

  // 14. Enchanted Magic Armor — swap Mana for HP
  const ema = get("enchanted-magic-armor");
  if (ema) {
    ema.stats = ["30% Magic Damage Reduction", "+300 Hit Points"]; // Remove +400 Mana, add +300 HP
    ema.comment = "Changing from mana to hit points to follow the rules.";
  }

  // ── Recompute total costs ──────────────────────────────────

  const itemMap = new Map(items.map(i => [i.id, i]));
  function computeTotal(id, visited) {
    if (!visited) visited = new Set();
    if (visited.has(id)) return 0;
    visited.add(id);
    const item = itemMap.get(id);
    if (!item) return 0;
    const childCost = (item.requires || []).reduce((sum, req) => {
      return sum + req.count * computeTotal(req.id, new Set(visited));
    }, 0);
    return item.cost + childCost;
  }
  items.forEach(item => { item.totalCost = computeTotal(item.id); });

  // ── Create the version ─────────────────────────────────────

  const v = versions.create('decent version', versions.BASE_ID);
  v.items = items;
  // Persist by re-saving through the versions API
  versions.saveItems(v.id, items);
  localStorage.setItem(SUGGESTIONS_KEY, '1');

  console.log('[Suggestions] Created "decent version" version with', items.length, 'items');
})();
