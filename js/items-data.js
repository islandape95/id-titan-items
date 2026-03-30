// ============================================================
//  ITEMS DATA  –  source of truth for the item tree
//  Edit this file (or use editor.html) to modify items.
//  changelog.html will diff any two saved snapshots.
// ============================================================

const ITEMS_DATA = {
  version: "1.0",
  label: "Current",
  items: [

    // ─── CONSUMABLES ────────────────────────────────────────
    {
      id: "beast-scroll",
      name: "Beast Scroll",
      tier: "consumable",
      cost: 30,
      category: "offensive",
      stats: [],
      use: "Increases attack damage of allied units within range 500 by 10% for 10 seconds.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "potion-of-recovery",
      name: "Potion of Recovery",
      tier: "consumable",
      cost: 25,
      category: "defensive",
      stats: [],
      use: "Replenishes 1000 hit points and 750 mana over 7.5 seconds. Only works out of combat.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "wand-of-wind",
      name: "Wand of the Wind",
      tier: "consumable",
      cost: 50,
      category: "utility",
      stats: [],
      use: "Cyclone a non-allied unit within range 500 for 5 seconds. For the duration, unit cannot be interacted with.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "watcher-eye",
      name: "Watcher Eye",
      tier: "consumable",
      cost: 30,
      category: "utility",
      stats: [],
      use: "Mark a non-allied target within range 800. You have vision of the marked target. Can be dispelled.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "floating-eye",
      name: "Floating Eye",
      tier: "consumable",
      cost: 75,
      category: "utility",
      stats: [],
      use: "Spawn a fragile invisible flying entity that provides vision for 240 seconds. The entity can move, but is very slow.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "healing-ward",
      name: "Healing Ward",
      tier: "consumable",
      cost: 35,
      category: "defensive",
      stats: [],
      use: "Drop a healing ward up to range 500, healing all allied units within same range for next 30 seconds.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "wand-of-neutralization",
      name: "Wand of Neutralization",
      tier: "consumable",
      cost: 100,
      category: "utility",
      stats: [],
      use: "Sends out a chain of dispelling magic that neutralizes the target unit and up to 5 additional nearby targets, killing summoned units. Bounces focus on units on the same side as the primary target.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "staff-of-teleportation",
      name: "Staff of Teleportation",
      tier: "consumable",
      cost: 50,
      category: "utility",
      stats: [],
      use: "Teleports you to the allied target structure after 3 seconds of channeling.",
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "manual-of-health",
      name: "Manual of Health",
      tier: "consumable",
      cost: 150,
      category: "defensive",
      stats: ["+100 Hit Points"],
      use: null,
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "manual-of-power",
      name: "Manual of Power",
      tier: "consumable",
      cost: 200,
      category: "offensive",
      stats: ["+15 Damage"],
      use: null,
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "manual-of-retraining",
      name: "Manual of Retraining",
      tier: "consumable",
      cost: 50,
      category: "utility",
      stats: [],
      use: "Unlearns all hero abilities and returns the skill points.",
      active: null,
      passives: [],
      requires: []
    },

    // ─── TIER 1 ─────────────────────────────────────────────
    {
      id: "pearl-of-vision",
      name: "Pearl of Vision",
      tier: "t1",
      cost: 90,
      category: "utility",
      stats: [],
      active: { name: "Reveal", cooldown: "25s", description: "Reveal a 2250 area for 10 seconds." },
      passives: [],
      requires: []
    },
    {
      id: "chimera-pendant",
      name: "Chimera Pendant",
      tier: "t1",
      cost: 95,
      category: "utility",
      stats: [],
      active: { name: "Summon Chimera Scout", cooldown: null, description: "Summon a chimera scout. Lasts 450 seconds." },
      passives: [
        { name: "Scout Efficiency", description: "Scouting ability refunds 25% mana cost and 10% of cooldown." }
      ],
      requires: []
    },
    {
      id: "webbed-feet",
      name: "Webbed Feet",
      tier: "t1",
      cost: 100,
      category: "utility",
      stats: ["+60 Movement Speed"],
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "shadow-shard",
      name: "Shadow Shard",
      tier: "t1",
      cost: 85,
      category: "utility",
      stats: [],
      active: { name: "Invisibility", cooldown: "25s", description: "Invisibility for 3 seconds. For the duration, move through units and damage is reduced by 50% for slightly longer." },
      passives: [],
      requires: []
    },
    {
      id: "reef-shield",
      name: "Reef Shield",
      tier: "t1",
      cost: 85,
      category: "defensive",
      stats: ["+2 Armor"],
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "regenerative-spines",
      name: "Regenerative Spines",
      tier: "t1",
      cost: 70,
      category: "defensive",
      stats: ["+3 HP Regeneration"],
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "tides-heart",
      name: "Tide's Heart",
      tier: "t1",
      cost: 100,
      category: "defensive",
      stats: ["+150 Hit Points"],
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "magic-coral",
      name: "Magic Coral",
      tier: "t1",
      cost: 100,
      category: "utility",
      stats: ["+150 Mana Points", "+4 Mana Regeneration/s"],
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "surge-trident",
      name: "Surge Trident",
      tier: "t1",
      cost: 85,
      category: "offensive",
      stats: ["+10 Attack Damage"],
      active: null,
      passives: [],
      requires: []
    },
    {
      id: "rune-fragment",
      name: "Rune Fragment",
      tier: "t1",
      cost: 70,
      category: "offensive",
      stats: [],
      active: null,
      passives: [
        { name: "Runic Mark", description: "Basic attacks apply a runic mark on the target for 2.5 seconds, causing them to deal 10 bonus magic damage on-hit consuming the mark." }
      ],
      requires: []
    },
    {
      id: "gem-of-haste",
      name: "Gem of Haste",
      tier: "t1",
      cost: 85,
      category: "offensive",
      stats: ["+10% Attack Speed"],
      active: null,
      passives: [],
      requires: []
    },

    // ─── TIER 2 ─────────────────────────────────────────────
    {
      id: "reef-armor",
      name: "Reef Armor",
      tier: "t2",
      cost: 65,
      category: "defensive",
      stats: ["+4 Armor", "+150 Hit Points"],
      active: null,
      passives: [
        { name: "Tidal Fortitude", description: "Reduce incoming damage by 1%. Holder also gains 1 extra armor." }
      ],
      requires: [
        { id: "reef-shield", count: 2 },
        { id: "tides-heart", count: 1 }
      ]
    },
    {
      id: "super-regenerative-spines",
      name: "Super Regenerative Spines",
      tier: "t2",
      cost: 80,
      category: "defensive",
      stats: ["+3 Armor", "+8 HP Regeneration/s"],
      active: null,
      passives: [
        { name: "Crisis Regen", description: "When below 50% health, regeneration granted by this item is doubled." }
      ],
      requires: [
        { id: "regenerative-spines", count: 2 },
        { id: "reef-shield", count: 1 }
      ]
    },
    {
      id: "heart-of-the-sea",
      name: "Heart of the Sea",
      tier: "t2",
      cost: 70,
      category: "both",
      stats: ["+250 Mana Points", "+4 Mana Regen/s", "+250 Hit Points", "+4 HP Regen/s"],
      active: null,
      passives: [
        { name: "Tidal Aura", description: "Allied units within range 800 regenerate 5 mana and 5 hit points per second." }
      ],
      requires: [
        { id: "magic-coral", count: 1 },
        { id: "regenerative-spines", count: 1 },
        { id: "tides-heart", count: 1 }
      ]
    },
    {
      id: "stormrider-cloak",
      name: "Stormrider Cloak",
      tier: "t2",
      cost: 75,
      category: "utility",
      stats: ["+10% Attack Speed", "+60 Movement Speed"],
      active: { name: "Shadow Walk", cooldown: "120s", description: "Turn the holder invisible and grant 20% movement speed for (15 + hero level) seconds over 0.5 seconds. For the duration the holder can move through units." },
      passives: [
        { name: "Nightsight", description: "The holder's vision is not reduced during night time." }
      ],
      requires: [
        { id: "gem-of-haste", count: 1 },
        { id: "shadow-shard", count: 1 },
        { id: "webbed-feet", count: 1 }
      ]
    },
    {
      id: "casque-of-valor",
      name: "Casque of Valor",
      tier: "t2",
      cost: 80,
      category: "defensive",
      stats: ["+200 Hit Points", "+2 Armor"],
      active: { name: "Bond", cooldown: null, description: "Select an allied unit. For the next 7.5 seconds, 15% of the damage both units take is shared as pure damage, and both gain 2 bonus armor." },
      passives: [],
      requires: [
        { id: "reef-shield", count: 1 },
        { id: "regenerative-spines", count: 1 },
        { id: "tides-heart", count: 1 }
      ]
    },
    {
      id: "caster-scroll",
      name: "Caster Scroll",
      tier: "t2",
      cost: 45,
      category: "both",
      stats: ["+250 Hit Points"],
      active: null,
      passives: [
        { name: "Arcane Surge", description: "Casting a scouting or healing ability heals you for 200% vitality hit points and grants 25% movement speed for 3.5 seconds." }
      ],
      requires: [
        { id: "chimera-pendant", count: 1 },
        { id: "rune-fragment", count: 1 },
        { id: "tides-heart", count: 1 }
      ]
    },
    {
      id: "enchantress-fluid",
      name: "Enchantress' Fluid",
      tier: "t2",
      cost: 120,
      category: "utility",
      stats: ["+250 Mana Points", "+4 Mana Regen/s"],
      active: { name: "Abysmal Drink", cooldown: "60s", description: "Replenishes 650 mana points over 2.75 seconds. For the duration, the user is invulnerable." },
      passives: [],
      requires: [
        { id: "potion-of-recovery", count: 1 },
        { id: "magic-coral", count: 1 },
        { id: "rune-fragment", count: 1 }
      ]
    },
    {
      id: "ethereal-mirror",
      name: "Ethereal Mirror",
      tier: "t2",
      cost: 265,
      category: "utility",
      stats: ["+300 Mana Points"],
      active: { name: "Ethernity", cooldown: "90s", description: "Turns units and structures within the target area ethereal for 5 seconds. Structures briefly lose collision after cast, but this ends if attacked. Nearby towers increase the delay. While ethereal, units take 15% increased magic damage." },
      passives: [
        { name: "Nightsight", description: "The holder's vision is not reduced during night time." }
      ],
      requires: [
        { id: "shadow-shard", count: 1 },
        { id: "magic-coral", count: 1 }
      ]
    },
    {
      id: "blasting-wand",
      name: "Blasting Wand",
      tier: "t2",
      cost: 120,
      category: "offensive",
      stats: ["+250 Mana Points"],
      active: { name: "Energy Blast", cooldown: "120s", description: "Sends lightning to a non-allied unit within range 650, dealing 195 magic damage to the target and nearby units within range 250. Titan hunters take additional damage equal to 15% of their max health. Builder units take 50% reduced damage. Killing a target refunds 40% of the cooldown." },
      passives: [],
      requires: [
        { id: "magic-coral", count: 1 },
        { id: "rune-fragment", count: 1 }
      ]
    },
    {
      id: "magic-armor",
      name: "Magic Armor",
      tier: "t2",
      cost: 50,
      category: "defensive",
      stats: ["15% Magic Damage Reduction", "+150 Mana Points"],
      active: null,
      passives: [
        { name: "Healing Amplification", description: "Upon casting a healing spell, you get healed for an additional 15%." }
      ],
      requires: [
        { id: "magic-coral", count: 1 },
        { id: "rune-fragment", count: 1 },
        { id: "reef-shield", count: 1 }
      ]
    },
    {
      id: "pearl-of-grand-vision",
      name: "Pearl of Grand Vision",
      tier: "t2",
      cost: 95,
      category: "utility",
      stats: [],
      active: { name: "Grand Reveal", cooldown: "25s", description: "Reveal a circular area on the map with radius 3000, granting true sight for 12.5 seconds." },
      passives: [],
      requires: [
        { id: "pearl-of-vision", count: 1 }
      ]
    },
    {
      id: "farseers-staff",
      name: "Farseer's Staff",
      tier: "t2",
      cost: 75,
      category: "utility",
      stats: ["+300 Mana Points", "+3 Mana Regen/s"],
      active: { name: "Apparition", cooldown: "15s", description: "All enemy units within range 2500 are marked with apparition for 10 seconds." },
      passives: [
        { name: "Windsom Restoration", description: "Killing an enemy restores 100% windsom mana. If the enemy is marked with apparition, your maximum mana is also increased by 10." }
      ],
      requires: [
        { id: "pearl-of-vision", count: 1 },
        { id: "magic-coral", count: 1 }
      ]
    },
    {
      id: "tidal-guardians-grace",
      name: "Tidal Guardian's Grace",
      tier: "t2",
      cost: 155,
      category: "utility",
      stats: ["+15% Attack Speed"],
      active: null,
      passives: [
        { name: "Shallow Spawns", description: "Killing critters spawns shallow spawns for 45 seconds. These fragile mobile units can be used for scouting. You may control up to 1 at a time." }
      ],
      requires: [
        { id: "chimera-pendant", count: 1 },
        { id: "gem-of-haste", count: 1 }
      ]
    },
    {
      id: "voodoo-doll",
      name: "Voodoo Doll",
      tier: "t2",
      cost: 55,
      category: "offensive",
      stats: ["+15 Attack Damage"],
      active: { name: "Voodoo Ward", cooldown: "30s", description: "Create a fragile voodoo ward at the target point within range 1000, lasting 150 seconds." },
      passives: [
        { name: "Voodoo Power", description: "Each voodoo ward grants 5 extra attack damage and causes basic attacks to heal you for 20 + 25% vitality." }
      ],
      requires: [
        { id: "surge-trident", count: 1 },
        { id: "watcher-eye", count: 3 }
      ]
    },
    {
      id: "gauntlets-of-embers",
      name: "Gauntlets of Embers",
      tier: "t2",
      cost: 55,
      category: "offensive",
      stats: ["+15% Attack Speed"],
      active: null,
      passives: [
        { name: "Structure Burn", description: "Attacks burn enemy structures for 5 seconds, dealing 20 damage per second." },
        { name: "Emberhearth", description: "Attacks on structures reveal the immediate surroundings for (10 + 10% celerity) seconds. 20s cooldown." }
      ],
      requires: [
        { id: "gem-of-haste", count: 1 },
        { id: "watcher-eye", count: 3 },
        { id: "rune-fragment", count: 1 }
      ]
    },
    {
      id: "runic-axe",
      name: "Runic Axe",
      tier: "t2",
      cost: 75,
      category: "offensive",
      stats: ["+10 Attack Damage"],
      active: null,
      passives: [
        { name: "Runic Mark", description: "Basic attacks apply a runic mark for 2.5 seconds. Attacking a marked target consumes the mark and deals 25 magic damage (200 magic damage to hunters)." }
      ],
      requires: [
        { id: "watcher-eye", count: 1 },
        { id: "rune-fragment", count: 1 },
        { id: "surge-trident", count: 1 }
      ]
    },
    {
      id: "spectral-blade",
      name: "Spectral Blade",
      tier: "t2",
      cost: 90,
      category: "offensive",
      stats: ["+20 Attack Damage"],
      active: { name: "Transmute", cooldown: "5s", description: "Instantly transmutes scrap items within the target area and grants gold equal to 100% of their value." },
      passives: [
        { name: "Spectral Gold", description: "Harvesters yield 1 gold upon dying." }
      ],
      requires: [
        { id: "staff-of-teleportation", count: 1 },
        { id: "rune-fragment", count: 1 },
        { id: "surge-trident", count: 1 }
      ]
    },
    {
      id: "titanic-tridents",
      name: "Titanic Tridents",
      tier: "t2",
      cost: 100,
      category: "offensive",
      stats: ["+35 Attack Damage"],
      active: null,
      passives: [
        { name: "Structure Crusher", description: "Basic attacks on structures deal 10 + 2×Level bonus pure damage on hit, up to a maximum of 30 bonus damage." }
      ],
      requires: [
        { id: "surge-trident", count: 3 }
      ]
    },
    {
      id: "warbanner",
      name: "Warbanner",
      tier: "t2",
      cost: 100,
      category: "offensive",
      stats: ["+15 Attack Damage", "+10% Attack Speed"],
      active: null,
      passives: [
        { name: "Aura of War", description: "Increase attack damage of nearby allied units within range 750 by 10%. After killing an enemy, gain an additional 5% attack damage bonus for 2.5 seconds." }
      ],
      requires: [
        { id: "beast-scroll", count: 1 },
        { id: "gem-of-haste", count: 1 },
        { id: "surge-trident", count: 1 }
      ]
    },
    {
      id: "eternal-wards",
      name: "Eternal Wards",
      tier: "t2",
      cost: 80,
      category: "defensive",
      stats: ["+5 HP Regen/s"],
      active: { name: "Eternal Wards", cooldown: "60s", description: "Spawn a healing ward at the target location for 30 seconds. The ward recovers lost hit points to all friendly units within range 600." },
      passives: [],
      requires: [
        { id: "healing-ward", count: 2 },
        { id: "regenerative-spines", count: 1 }
      ]
    },

    // ─── TIER 3 ─────────────────────────────────────────────
    {
      id: "mystic-staff-of-gods",
      name: "Mystic Staff of Gods",
      tier: "t3",
      cost: 70,
      category: "both",
      stats: ["+250 Hit Points", "+10 HP Regen/s", "+350 Mana Points", "+10 Mana Regen/s"],
      active: { name: "Farsight", cooldown: "Passable (resets cd)", description: "Point target. Reveals a circular area on the map within radius (3000 + 30% windsom), granting vision for 12.5 seconds. Also reveals invisible units." },
      passives: [
        { name: "True Sight", description: "While Farsight is ready, the holder has true sight, seeing invisible units within range 1100." }
      ],
      requires: [
        { id: "heart-of-the-sea", count: 1 },
        { id: "pearl-of-grand-vision", count: 1 }
      ]
    },
    {
      id: "tidal-scepter",
      name: "Tidal Scepter",
      tier: "t3",
      cost: 250,
      category: "offensive",
      stats: ["+500 Mana Points", "+10 Mana Regen/s"],
      active: { name: "Energy Blast", cooldown: "90s", description: "Sends lightning to a non-allied unit within range 750, dealing 200 magic damage to the target and nearby enemies within range 250. Titan hunters take 15% max health bonus damage. Builder units take 50% reduced damage." },
      passives: [
        { name: "Windsom Restoration", description: "Killing an enemy restores 100% windsom mana. If the enemy is marked with apparition, your maximum mana is increased by 10." },
        { name: "Nukemaster", description: "Titan's nuke deals 20% bonus damage." }
      ],
      requires: [
        { id: "blasting-wand", count: 1 },
        { id: "farseers-staff", count: 1 }
      ]
    },
    {
      id: "mace-of-mortality",
      name: "Mace of Mortality",
      tier: "t3",
      cost: 105,
      category: "both",
      stats: ["+40 Attack Damage", "+400 Hit Points", "+40 Movement Speed"],
      active: null,
      passives: [
        { name: "Warlord's Fury", description: "Casting a summoning spell grants 15% bonus attack damage for 15 seconds and reduces enemy armor for 3 seconds." },
        { name: "Scout's Focus", description: "Casting a scouting ability refunds 50% of its mana cost and 50% of its cooldown." },
        { name: "Battle Surge", description: "Casting a scouting or healing ability heals you for 250% vitality + 10% of your missing health, and grants 35% movement speed for 3.5 seconds." }
      ],
      requires: [
        { id: "caster-scroll", count: 1 },
        { id: "tidal-guardians-grace", count: 1 },
        { id: "warbanner", count: 1 }
      ]
    },
    {
      id: "essence-of-pure-magic",
      name: "Essence of Pure Magic",
      tier: "t3",
      cost: 195,
      category: "both",
      stats: ["+400 Mana Points", "+400 Hit Points"],
      active: { name: "Mana Surge", cooldown: "60s", description: "Regenerate (1500 + 500% windsom) mana and health over 4 seconds." },
      passives: [
        { name: "Unstable Magic", description: "Allied units within range 800 regenerate 8 bonus mana and hit points per second." }
      ],
      requires: [
        { id: "enchantress-fluid", count: 1 },
        { id: "heart-of-the-sea", count: 1 }
      ]
    },
    {
      id: "armor-of-tides",
      name: "Armor of Tides",
      tier: "t3",
      cost: 200,
      category: "defensive",
      stats: ["+4 Armor", "+300 Hit Points", "+8 HP Regen/s"],
      active: null,
      passives: [
        { name: "Tidal Fortitude", description: "Damage taken is reduced by 2%. The holder also gains 4 bonus armor." },
        { name: "Crisis Regen", description: "When below 50% health, regeneration granted by this item is doubled." }
      ],
      requires: [
        { id: "reef-armor", count: 1 },
        { id: "super-regenerative-spines", count: 1 }
      ]
    },
    {
      id: "robe-of-spellcraft",
      name: "Robe of Spellcraft",
      tier: "t3",
      cost: 105,
      category: "both",
      stats: ["+6 Armor", "+300 Hit Points", "+500 Mana Points"],
      active: { name: "Realmshift", cooldown: "80s", description: "Turn ethereal for up to 10 seconds, broken once you cast a spell. While ethereal, incoming healing is increased by 10% + 25% windsom." },
      passives: [
        { name: "Spell Armor", description: "Spellcasts heal you for 10% max mana and increase your armor by 2 for 5 seconds. Stacks up to 3 times, renewing on each spell cast." }
      ],
      requires: [
        { id: "ethereal-mirror", count: 1 },
        { id: "reef-armor", count: 1 }
      ]
    },
    {
      id: "dawnkeeper",
      name: "Dawnkeeper",
      tier: "t3",
      cost: 220,
      category: "defensive",
      stats: ["+5 Armor", "+500 Hit Points"],
      active: { name: "Call of Valor", cooldown: "45s", description: "Select a target allied unit within range 1000. For the next 10 seconds the two units share 25% of the damage they take as pure damage, and both gain 5 bonus armor." },
      passives: [
        { name: "Scout's Resolve", description: "Casting a scouting ability refunds 50% of its mana cost and 25% of its cooldown." },
        { name: "Aegis Surge", description: "Casting a scouting or healing ability heals you for 200% vitality hit points and grants 10% movement speed for 2.5 seconds." }
      ],
      requires: [
        { id: "casque-of-valor", count: 1 },
        { id: "caster-scroll", count: 1 }
      ]
    },
    {
      id: "highseer-slippers",
      name: "Highseer Slippers",
      tier: "t3",
      cost: 140,
      category: "offensive",
      stats: ["+25 Attack Damage", "+15% Attack Speed", "+40 Movement Speed"],
      active: null,
      passives: [
        { name: "Spellblade", description: "Unique spell casts grant 8% stacking attack speed for 8 seconds (up to 6 stacks). When fully stacked, the item becomes overcharged. While overcharged, dealing magic damage releases the charge, healing you for 35% windsom percent of your max mana." },
        { name: "Cleansing Scout", description: "Casting a scouting ability refunds 50% of mana cost and cooldown, and repeatedly cleanses you of all negative effects for the next 8 seconds." }
      ],
      requires: [
        { id: "tidal-guardians-grace", count: 1 },
        { id: "runic-axe", count: 1 },
        { id: "gem-of-haste", count: 1 }
      ]
    },
    {
      id: "enchanted-druid-leaf",
      name: "Enchanted Druid Leaf",
      tier: "t3",
      cost: 100,
      category: "defensive",
      stats: [],
      active: { name: "Enchanted Wards", cooldown: "75s (passable, resets cd)", description: "Place a healing ward without consuming this item. The ward lasts 30 seconds, healing all friendly units within range 600." },
      passives: [],
      requires: [
        { id: "eternal-wards", count: 1 }
      ]
    },
    {
      id: "enchanted-magic-armor",
      name: "Enchanted Magic Armor",
      tier: "t3",
      cost: 100,
      category: "defensive",
      stats: ["30% Magic Damage Reduction", "+400 Mana Points"],
      active: null,
      passives: [
        { name: "Healing Amplification", description: "Upon casting a healing spell, you get healed for an additional 30%." }
      ],
      requires: [
        { id: "magic-armor", count: 1 },
        { id: "caster-scroll", count: 1 }
      ]
    },
    {
      id: "endelune",
      name: "Endelune",
      tier: "t3",
      cost: 120,
      category: "offensive",
      stats: ["+10 Attack Damage"],
      active: { name: "Transmute", cooldown: "5s", description: "Transmute scrap items within the target area and grant gold equal to 100% of their value." },
      passives: [
        { name: "Runic Mark", description: "Basic attacks apply a runic mark for 2.5 seconds. Attacking a marked target consumes the mark and deals 50 magic damage (300 magic damage to hunters)." },
        { name: "Spectral Gold", description: "Upon dying, harvesters yield 1 gold." }
      ],
      requires: [
        { id: "runic-axe", count: 1 },
        { id: "spectral-blade", count: 1 }
      ]
    },
    {
      id: "foretellers-sickle",
      name: "Foreteller's Sickle",
      tier: "t3",
      cost: 325,
      category: "offensive",
      stats: ["+20 Attack Damage", "+250 Mana Points", "+5 Mana Regen/s"],
      active: null,
      passives: [
        { name: "Runic Wrath", description: "Attacks deal bonus magic damage equal to 30% windsom + 2% max mana to structures. Spell casts grant an additional 3% windsom and 1% max mana ratio for 5 seconds." }
      ],
      requires: [
        { id: "farseers-staff", count: 1 },
        { id: "runic-axe", count: 1 }
      ]
    },
    {
      id: "helmet-of-the-damned",
      name: "Helmet of the Damned",
      tier: "t3",
      cost: 275,
      category: "offensive",
      stats: ["+30 Attack Damage"],
      active: { name: "Voodoo Wards", cooldown: "30s", description: "Create a fragile voodoo ward at the target point within range 1000, lasting 200 seconds." },
      passives: [
        { name: "Aura of War", description: "Increases attack damage of nearby allied units within range 950 by 15%. After killing an enemy, gain an additional 5% attack damage bonus for 5 seconds." },
        { name: "Voodoo", description: "Each voodoo ward grants 10 extra attack damage and causes basic attacks to heal you for 20 + 40% vitality." }
      ],
      requires: [
        { id: "voodoo-doll", count: 1 },
        { id: "warbanner", count: 1 }
      ]
    },
    {
      id: "mistlords-cape",
      name: "Mistlord's Cape",
      tier: "t3",
      cost: 100,
      category: "both",
      stats: ["+3 Armor", "+15% Attack Speed", "+8 HP Regen/s", "+60 Movement Speed"],
      active: { name: "Shadow Walk", cooldown: null, description: "Turns the holder invisible and grants 20% bonus movement speed for (20 + hero level×2) seconds over 0.5 seconds. For the duration the holder can move through units." },
      passives: [
        { name: "Nightsight", description: "The holder's vision is not reduced during night time." },
        { name: "Unseen Regeneration", description: "When unseen, regenerate 45% vitality hit points and 25% windsom mana per second." }
      ],
      requires: [
        { id: "stormrider-cloak", count: 1 },
        { id: "super-regenerative-spines", count: 1 }
      ]
    },
    {
      id: "molten-blade",
      name: "Molten Blade",
      tier: "t3",
      cost: 180,
      category: "offensive",
      stats: ["+25 Attack Damage", "+20% Attack Speed"],
      active: null,
      passives: [
        { name: "Emberhearth", description: "Attacks on structures reveal the immediate surroundings for (15 + 25% vitality) seconds." },
        { name: "Fiery Touch", description: "Attacks burn enemy structures for 5 seconds, dealing 40 damage per second." },
        { name: "Spectral Fire", description: "Killing an enemy causes a fiery explosion dealing 49 damage to nearby enemies and structures. Harvesters yield 2 gold upon dying." }
      ],
      requires: [
        { id: "gauntlets-of-embers", count: 1 },
        { id: "spectral-blade", count: 1 }
      ]
    },
    {
      id: "poseidons-trident",
      name: "Poseidon's Trident",
      tier: "t3",
      cost: 180,
      category: "offensive",
      stats: ["+40 Attack Damage", "+10% Attack Speed", "+30 Movement Speed"],
      active: { name: "Unleashed Rage", cooldown: "60s", description: "Gain 25% bonus attack damage for (1 × hero level) seconds." },
      passives: [
        { name: "Titan Crusher", description: "Basic attacks on structures deal 20 + (5 × hero level) bonus damage on hit, up to a maximum of 50 bonus damage." }
      ],
      requires: [
        { id: "titanic-tridents", count: 1 },
        { id: "stormrider-cloak", count: 1 }
      ]
    },
    {
      id: "spear-of-fervor",
      name: "Spear of Fervor",
      tier: "t3",
      cost: 255,
      category: "offensive",
      stats: ["+30 Attack Damage", "+20% Attack Speed"],
      active: null,
      passives: [
        { name: "Fervor", description: "Basic attacks grant bonus attack speed for 2.5 seconds, stacking up to 10 times for up to 33% bonus attack speed." },
        { name: "Lifesteal", description: "Basic attacks heal you for 20 + 35% vitality." }
      ],
      requires: [
        { id: "gauntlets-of-embers", count: 1 },
        { id: "voodoo-doll", count: 1 }
      ]
    },
    {
      id: "ankh-of-superiority",
      name: "Ankh of Superiority",
      tier: "t3",
      cost: 180,
      category: "both",
      stats: ["+20 Attack Damage", "+5 Vitality", "+5 Celerity", "+5 Windsom"],
      active: { name: "Consume Ankh", cooldown: null, description: "Consume the ankh, gaining the bonuses granted by this item." },
      passives: [
        { name: "Reincarnation", description: "Upon death, respawn with 2500 hit points, activating Superiority." }
      ],
      requires: []
    }
  ]
};

// ─── Helpers ───────────────────────────────────────────────

function getItemById(id) {
  return ITEMS_DATA.items.find(i => i.id === id);
}

function getItemsByTier(tier) {
  return ITEMS_DATA.items.filter(i => i.tier === tier);
}

function getItemsByCategory(category) {
  if (category === 'all') return ITEMS_DATA.items;
  return ITEMS_DATA.items.filter(i => i.category === category);
}

function computeTotalCost(itemId, visited = new Set()) {
  if (visited.has(itemId)) return 0;
  visited.add(itemId);
  const item = getItemById(itemId);
  if (!item) return 0;
  const childCost = item.requires.reduce((sum, req) => {
    return sum + req.count * computeTotalCost(req.id, new Set(visited));
  }, 0);
  return item.cost + childCost;
}

// Pre-compute total costs
ITEMS_DATA.items.forEach(item => {
  item.totalCost = computeTotalCost(item.id);
});

// Category metadata
const CATEGORIES = {
  all:       { label: "All Items",  color: "#94a3b8", icon: "⬡" },
  offensive: { label: "Offensive",  color: "#f87171", icon: "⚔" },
  defensive: { label: "Defensive",  color: "#60a5fa", icon: "🛡" },
  both:      { label: "Hybrid",     color: "#a78bfa", icon: "⚡" },
  utility:   { label: "Utility",    color: "#34d399", icon: "✦" }
};

const TIERS = {
  consumable: { label: "Consumables", order: 0 },
  t1:         { label: "Tier 1",      order: 1 },
  t2:         { label: "Tier 2",      order: 2 },
  t3:         { label: "Tier 3",      order: 3 }
};
