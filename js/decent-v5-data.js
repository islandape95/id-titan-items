// Auto-generated: decent v5 version data for simulator
(function() {
  try {
    const data = {
  "_format": "item-tree-version",
  "_version": 1,
  "name": "decent v5",
  "exportedAt": "2026-04-02T14:49:44.923Z",
  "items": [
    {
      "id": "beast-scroll",
      "name": "Beast Scroll",
      "tier": "consumable",
      "cost": 30,
      "category": "offensive",
      "stats": [],
      "use": "Increases attack damage of allied units within range 500 by 10% for 10 seconds.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 30
    },
    {
      "id": "potion-of-recovery",
      "name": "Potion of Recovery",
      "tier": "consumable",
      "cost": 25,
      "category": "defensive",
      "stats": [],
      "use": "Replenishes 1000 hit points and 750 mana over 7.5 seconds. Only works out of combat.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 25
    },
    {
      "id": "wand-of-wind",
      "name": "Wand of the Wind",
      "tier": "consumable",
      "cost": 50,
      "category": "utility",
      "stats": [],
      "use": "Cyclone a non-allied unit within range 500 for 5 seconds. For the duration, unit cannot be interacted with.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 50
    },
    {
      "id": "watcher-eye",
      "name": "Watcher Eye",
      "tier": "consumable",
      "cost": 30,
      "category": "utility",
      "stats": [],
      "use": "Mark a non-allied target within range 800. You have vision of the marked target. Can be dispelled.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 30
    },
    {
      "id": "floating-eye",
      "name": "Floating Eye",
      "tier": "consumable",
      "cost": 15,
      "category": "utility",
      "stats": [],
      "use": "Spawn a fragile invisible flying entity that provides vision for 240 seconds. The entity can move, but is very slow.",
      "active": null,
      "passives": [],
      "requires": [
        {
          "id": "watcher-eye",
          "count": 2
        }
      ],
      "totalCost": 75,
      "comment": null
    },
    {
      "id": "healing-ward",
      "name": "Healing Ward",
      "tier": "consumable",
      "cost": 35,
      "category": "defensive",
      "stats": [],
      "use": "Drop a healing ward up to range 500, healing all allied units within same range for next 30 seconds.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 35
    },
    {
      "id": "wand-of-neutralization",
      "name": "Wand of Neutralization",
      "tier": "consumable",
      "cost": 100,
      "category": "utility",
      "stats": [],
      "use": "Sends out a chain of dispelling magic that neutralizes the target unit and up to 5 additional nearby targets, killing summoned units. Bounces focus on units on the same side as the primary target.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 100
    },
    {
      "id": "staff-of-teleportation",
      "name": "Staff of Teleportation",
      "tier": "consumable",
      "cost": 50,
      "category": "utility",
      "stats": [],
      "use": "Teleports you to the allied target structure after 3 seconds of channeling.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 50
    },
    {
      "id": "manual-of-health",
      "name": "Manual of Health",
      "tier": "consumable",
      "cost": 150,
      "category": "defensive",
      "stats": [
        "+100 Hit Points"
      ],
      "use": null,
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 150
    },
    {
      "id": "manual-of-power",
      "name": "Manual of Power",
      "tier": "consumable",
      "cost": 200,
      "category": "offensive",
      "stats": [
        "+15 Damage"
      ],
      "use": null,
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 200
    },
    {
      "id": "manual-of-retraining",
      "name": "Manual of Retraining",
      "tier": "consumable",
      "cost": 50,
      "category": "utility",
      "stats": [],
      "use": "Unlearns all hero abilities and returns the skill points.",
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 50
    },
    {
      "id": "pearl-of-vision",
      "name": "Pearl of Vision",
      "tier": "t1",
      "cost": 90,
      "category": "utility",
      "stats": [],
      "active": {
        "name": "Reveal",
        "cooldown": "25s",
        "description": "Reveal a circular area on the map with radius 2250, granting true sight for 8 seconds."
      },
      "passives": [],
      "requires": [],
      "totalCost": 90,
      "use": null,
      "comment": "Added true sight but reduced duration"
    },
    {
      "id": "chimera-pendant",
      "name": "Chimera Pendant",
      "tier": "t1",
      "cost": 50,
      "category": "utility",
      "stats": [],
      "active": {
        "name": "Summon Chimera Scout",
        "cooldown": null,
        "description": "Summon a chimera scout. Lasts 40 seconds."
      },
      "passives": [],
      "requires": [],
      "totalCost": 50,
      "comment": "Item without an identity and breaks the \"rules\" of items. Only use case is grabbing \"stolen items\" in seeds and should be kept simply for that.",
      "use": null
    },
    {
      "id": "webbed-feet",
      "name": "Webbed Feet",
      "tier": "t1",
      "cost": 100,
      "category": "utility",
      "stats": [
        "+60 Movement Speed"
      ],
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 100
    },
    {
      "id": "shadow-shard",
      "name": "Shadow Shard",
      "tier": "t1",
      "cost": 85,
      "category": "utility",
      "stats": [],
      "active": {
        "name": "Invisibility",
        "cooldown": "25s",
        "description": "Invisibility for 3 seconds. For the duration, move through units and damage is reduced by 50% for slightly longer."
      },
      "passives": [],
      "requires": [],
      "totalCost": 85
    },
    {
      "id": "reef-shield",
      "name": "Reef Shield",
      "tier": "t1",
      "cost": 85,
      "category": "defensive",
      "stats": [
        "+2 Armor"
      ],
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 85
    },
    {
      "id": "regenerative-spines",
      "name": "Regenerative Spines",
      "tier": "t1",
      "cost": 70,
      "category": "defensive",
      "stats": [
        "+3 HP Regeneration"
      ],
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 70
    },
    {
      "id": "tides-heart",
      "name": "Tide's Heart",
      "tier": "t1",
      "cost": 100,
      "category": "defensive",
      "stats": [
        "+200 Hit Points"
      ],
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 100,
      "use": null,
      "comment": null
    },
    {
      "id": "magic-coral",
      "name": "Magic Coral",
      "tier": "t1",
      "cost": 100,
      "category": "utility",
      "stats": [
        "+200 Mana Points"
      ],
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 100,
      "use": null,
      "comment": "Removing mana regen to make tier 2 feel more unique (and easier to follow item rules). Buffing mana to make up for it."
    },
    {
      "id": "surge-trident",
      "name": "Surge Trident",
      "tier": "t1",
      "cost": 85,
      "category": "offensive",
      "stats": [
        "+10 Attack Damage"
      ],
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 85
    },
    {
      "id": "rune-fragment",
      "name": "Rune Fragment",
      "tier": "t1",
      "cost": 70,
      "category": "offensive",
      "stats": [],
      "active": null,
      "passives": [
        {
          "name": "Runic Mark",
          "description": "Basic attacks apply a runic mark on the target for 2.5 seconds, causing them to deal 10 bonus magic damage on-hit consuming the mark."
        }
      ],
      "requires": [],
      "totalCost": 70
    },
    {
      "id": "gem-of-haste",
      "name": "Gem of Haste",
      "tier": "t1",
      "cost": 85,
      "category": "offensive",
      "stats": [
        "+10% Attack Speed"
      ],
      "active": null,
      "passives": [],
      "requires": [],
      "totalCost": 85
    },
    {
      "id": "reef-armor",
      "name": "Reef Armor",
      "tier": "t2",
      "cost": 65,
      "category": "defensive",
      "stats": [
        "+4 Armor",
        "+200 Hit Points"
      ],
      "active": null,
      "passives": [
        {
          "name": "Tidal Fortitude",
          "description": "+1 armor\nReduce incoming damage by 1%."
        }
      ],
      "requires": [
        {
          "id": "reef-shield",
          "count": 2
        },
        {
          "id": "tides-heart",
          "count": 1
        }
      ],
      "totalCost": 335,
      "use": null,
      "comment": null
    },
    {
      "id": "super-regenerative-spines",
      "name": "Super Regenerative Spines",
      "tier": "t2",
      "cost": 40,
      "category": "defensive",
      "stats": [
        "+12 HP Regeneration/s"
      ],
      "active": null,
      "passives": [
        {
          "name": "Crisis Regen",
          "description": "When below 50% health, regeneration granted by this item is doubled."
        }
      ],
      "requires": [
        {
          "id": "regenerative-spines",
          "count": 3
        }
      ],
      "totalCost": 250,
      "use": null,
      "comment": null
    },
    {
      "id": "heart-of-the-sea",
      "name": "Heart of the Sea",
      "tier": "t2",
      "cost": 70,
      "category": "both",
      "stats": [
        "+250 Mana Points",
        "+4 Mana Regen/s",
        "+250 Hit Points",
        "+4 HP Regen/s"
      ],
      "active": null,
      "passives": [
        {
          "name": "Tidal Aura",
          "description": "Allied units within range 800 regenerate 5 mana and 5 hit points per second."
        }
      ],
      "requires": [
        {
          "id": "magic-coral",
          "count": 1
        },
        {
          "id": "regenerative-spines",
          "count": 1
        },
        {
          "id": "tides-heart",
          "count": 1
        }
      ],
      "totalCost": 340
    },
    {
      "id": "stormrider-cloak",
      "name": "Stormrider Cloak",
      "tier": "t2",
      "cost": 75,
      "category": "utility",
      "stats": [
        "+10% Attack Speed",
        "+60 Movement Speed"
      ],
      "active": {
        "name": "Shadow Walk",
        "cooldown": "120s",
        "description": "Turn the holder invisible and grant 20% movement speed for (15 + hero level) seconds over 0.5 seconds. For the duration the holder can move through units."
      },
      "passives": [
        {
          "name": "Nightsight",
          "description": "The holder's vision is not reduced during night time."
        }
      ],
      "requires": [
        {
          "id": "gem-of-haste",
          "count": 1
        },
        {
          "id": "shadow-shard",
          "count": 1
        },
        {
          "id": "webbed-feet",
          "count": 1
        }
      ],
      "totalCost": 345,
      "use": null,
      "comment": null
    },
    {
      "id": "casque-of-valor",
      "name": "Casque of Valor",
      "tier": "t2",
      "cost": 80,
      "category": "defensive",
      "stats": [
        "+200 Hit Points",
        "+2 Armor"
      ],
      "active": {
        "name": "Bond",
        "cooldown": "60",
        "description": "Select an allied unit. For the next 7.5 seconds, 15% of the damage both units take is shared as pure damage, and both gain 2 bonus armor."
      },
      "passives": [],
      "requires": [
        {
          "id": "reef-shield",
          "count": 1
        },
        {
          "id": "regenerative-spines",
          "count": 1
        },
        {
          "id": "tides-heart",
          "count": 1
        }
      ],
      "totalCost": 335,
      "use": null,
      "comment": null
    },
    {
      "id": "caster-scroll",
      "name": "Caster Scroll",
      "tier": "t2",
      "cost": 50,
      "category": "both",
      "stats": [
        "400 Mana Points",
        "6 Mana Regeneration / second"
      ],
      "active": null,
      "passives": [
        {
          "name": "Swift Casting",
          "description": "All spells receive 10% Cooldown Reduction"
        }
      ],
      "requires": [
        {
          "id": "magic-coral",
          "count": 1
        },
        {
          "id": "magic-coral",
          "count": 1
        }
      ],
      "totalCost": 250,
      "comment": "Removing Chimaera Pendant for build path and replacing it with another HP component.",
      "use": null
    },
    {
      "id": "enchantress-fluid",
      "name": "Enchantress' Fluid",
      "tier": "t2",
      "cost": 150,
      "category": "utility",
      "stats": [
        "400 Hit Points"
      ],
      "active": {
        "name": "Abysmal Drink",
        "cooldown": "60s",
        "description": "Replenishes 300 hit points over 2.5 seconds."
      },
      "passives": [],
      "requires": [
        {
          "id": "potion-of-recovery",
          "count": 1
        },
        {
          "id": "tides-heart",
          "count": 2
        }
      ],
      "totalCost": 375,
      "use": null,
      "comment": null
    },
    {
      "id": "ethereal-mirror",
      "name": "Ethereal Mirror",
      "tier": "t2",
      "cost": 215,
      "category": "utility",
      "stats": [
        "+300 Mana Points"
      ],
      "active": {
        "name": "Ethernity",
        "cooldown": "90s",
        "description": "Turns units and structures within the target area ethereal for 5 seconds. Structures briefly lose collision after cast, but this ends if attacked. Nearby towers increase the delay. While ethereal, units take 15% increased magic damage."
      },
      "passives": [
        {
          "name": "Nightsight",
          "description": "The holder's vision is not reduced during night time."
        }
      ],
      "requires": [
        {
          "id": "shadow-shard",
          "count": 1
        },
        {
          "id": "magic-coral",
          "count": 1
        }
      ],
      "totalCost": 400,
      "use": null,
      "comment": "Removed from build paths: considered like Tidal Guardian's Grace"
    },
    {
      "id": "blasting-wand",
      "name": "Blasting Wand",
      "tier": "t2",
      "cost": 120,
      "category": "offensive",
      "stats": [
        "+250 Mana Points"
      ],
      "active": {
        "name": "Energy Blast",
        "cooldown": "120s",
        "description": "Sends lightning to a non-allied unit within range 650, dealing 195 magic damage to the target and nearby units within range 250. Titan hunters take additional damage equal to 15% of their max health. Builder units take 50% reduced damage. Killing a target refunds 40% of the cooldown."
      },
      "passives": [],
      "requires": [
        {
          "id": "magic-coral",
          "count": 1
        },
        {
          "id": "rune-fragment",
          "count": 1
        }
      ],
      "totalCost": 290
    },
    {
      "id": "magic-armor",
      "name": "Magic Armor",
      "tier": "t2",
      "cost": 100,
      "category": "defensive",
      "stats": [
        "200 Mana Points"
      ],
      "active": null,
      "passives": [
        {
          "name": "Healing Amplification",
          "description": "Upon casting a healing spell, you get healed for an additional 15%."
        },
        {
          "name": "Magic Resist",
          "description": "+15% Magic Damage Reduction"
        }
      ],
      "requires": [
        {
          "id": "magic-coral",
          "count": 1
        },
        {
          "id": "reef-shield",
          "count": 1
        }
      ],
      "totalCost": 285,
      "use": null,
      "comment": null
    },
    {
      "id": "pearl-of-grand-vision",
      "name": "Pearl of Grand Vision",
      "tier": "t2",
      "cost": 95,
      "category": "utility",
      "stats": [],
      "active": {
        "name": "Grand Reveal",
        "cooldown": "25s",
        "description": "Reveal a circular area on the map with radius 3000, granting true sight for 12.5 seconds."
      },
      "passives": [],
      "requires": [
        {
          "id": "pearl-of-vision",
          "count": 1
        }
      ],
      "totalCost": 185
    },
    {
      "id": "tidal-guardians-grace",
      "name": "Tidal Guardian's Grace",
      "tier": "t2",
      "cost": 215,
      "category": "utility",
      "stats": [],
      "active": null,
      "passives": [
        {
          "name": "Shallow Spawns",
          "description": "Killing critters spawns shallow spawns for 45 seconds. These fragile mobile units can be used for scouting. You may control up to 1 at a time."
        }
      ],
      "requires": [],
      "totalCost": 215,
      "comment": "Should be considered a pure utility item pre first mini kill and therefore should be easier to invest into and sell later. Also removing Chimaera Pendant from build path."
    },
    {
      "id": "voodoo-doll",
      "name": "Voodoo Doll",
      "tier": "t2",
      "cost": 75,
      "category": "offensive",
      "stats": [
        "+15 Attack Damage"
      ],
      "active": {
        "name": "Voodoo Ward",
        "cooldown": "30s",
        "description": "Create a fragile voodoo ward at the target point within range 1000, lasting 150 seconds."
      },
      "passives": [
        {
          "name": "Voodoo Decay",
          "description": "Voodoo ward reduces enemy armor by 3 within 300 range."
        }
      ],
      "requires": [
        {
          "id": "surge-trident",
          "count": 1
        },
        {
          "id": "healing-ward",
          "count": 2
        }
      ],
      "totalCost": 230,
      "use": null,
      "comment": null
    },
    {
      "id": "gauntlets-of-embers",
      "name": "Gauntlets of Embers",
      "tier": "t2",
      "cost": 130,
      "category": "offensive",
      "stats": [],
      "active": null,
      "passives": [
        {
          "name": "Structure Burn",
          "description": "Attacks burn enemy structures for 10 seconds, dealing 5% maximum hit point of the structure per second."
        }
      ],
      "requires": [
        {
          "id": "rune-fragment",
          "count": 1
        }
      ],
      "totalCost": 200,
      "comment": "Should have a simple identity as the wall farmer. Reducing gold costs makes the item easier to access and replace later if the Titan wishes.",
      "use": null
    },
    {
      "id": "runic-axe",
      "name": "Runic Axe",
      "tier": "t2",
      "cost": 160,
      "category": "offensive",
      "stats": [],
      "active": null,
      "passives": [
        {
          "name": "Runic Mark",
          "description": "Basic attacks apply a runic mark for 2.5 seconds. Attacking a marked target consumes the mark and deals 35 magic damage"
        }
      ],
      "requires": [
        {
          "id": "watcher-eye",
          "count": 1
        },
        {
          "id": "rune-fragment",
          "count": 1
        }
      ],
      "totalCost": 260,
      "use": null,
      "comment": null
    },
    {
      "id": "titanic-tridents",
      "name": "Titanic Tridents",
      "tier": "t2",
      "cost": 100,
      "category": "offensive",
      "stats": [
        "+35 Attack Damage"
      ],
      "active": null,
      "passives": [
        {
          "name": "Structure Crusher",
          "description": "Basic attacks on structures deal 10 + 2×Level bonus pure damage on hit, up to a maximum of 30 bonus damage."
        }
      ],
      "requires": [
        {
          "id": "surge-trident",
          "count": 3
        }
      ],
      "totalCost": 355
    },
    {
      "id": "warbanner",
      "name": "Warbanner",
      "tier": "t2",
      "cost": 100,
      "category": "offensive",
      "stats": [
        "+20 Attack Damage",
        "+10% Attack Speed"
      ],
      "active": {
        "name": "War Shout",
        "cooldown": "30",
        "description": "Gain 25% bonus attack damage for 8 seconds"
      },
      "passives": [],
      "requires": [
        {
          "id": "beast-scroll",
          "count": 1
        },
        {
          "id": "gem-of-haste",
          "count": 1
        },
        {
          "id": "surge-trident",
          "count": 1
        }
      ],
      "totalCost": 300,
      "use": null,
      "comment": null
    },
    {
      "id": "eternal-wards",
      "name": "Eternal Wards",
      "tier": "t2",
      "cost": 80,
      "category": "defensive",
      "stats": [
        "+5 HP Regen/s"
      ],
      "active": {
        "name": "Eternal Wards",
        "cooldown": "60s",
        "description": "Spawn a healing ward at the target location for 30 seconds. The ward recovers lost hit points to all friendly units within range 600."
      },
      "passives": [],
      "requires": [
        {
          "id": "healing-ward",
          "count": 2
        },
        {
          "id": "regenerative-spines",
          "count": 1
        }
      ],
      "totalCost": 220
    },
    {
      "id": "mystic-staff-of-gods",
      "name": "Mystic Staff of Gods",
      "tier": "t3",
      "cost": 70,
      "category": "both",
      "stats": [
        "+250 Hit Points",
        "+10 HP Regen/s",
        "+350 Mana Points",
        "+10 Mana Regen/s"
      ],
      "active": {
        "name": "Farsight",
        "cooldown": "Passable (resets cd)",
        "description": "Reveals a circular area on the map within radius (3000 + 30% windsom), granting true sight for 12.5 seconds."
      },
      "passives": [
        {
          "name": "True Sight",
          "description": "While Farsight is ready, the holder has true sight, seeing invisible units within range 1100."
        }
      ],
      "requires": [
        {
          "id": "heart-of-the-sea",
          "count": 1
        },
        {
          "id": "pearl-of-grand-vision",
          "count": 1
        }
      ],
      "totalCost": 595,
      "use": null,
      "comment": null
    },
    {
      "id": "tidal-scepter",
      "name": "Tidal Scepter",
      "tier": "t3",
      "cost": 250,
      "category": "offensive",
      "stats": [
        "+650 Mana Points",
        "+8 Mana Regen/s"
      ],
      "active": {
        "name": "Energy Blast",
        "cooldown": "90s",
        "description": "Sends lightning to a non-allied unit within range 750, dealing 200 magic damage to the target and nearby enemies within range 250. Titan hunters take 15% max health bonus damage. \nBuilder units take 50% reduced damage."
      },
      "passives": [
        {
          "name": "Nuke Master",
          "description": "Nuke deals 20% bonus damage."
        },
        {
          "name": "Nuke Enjoyer",
          "description": "Nuke receives 20% Cooldown Reduction"
        }
      ],
      "requires": [
        {
          "id": "blasting-wand",
          "count": 1
        },
        {
          "id": "caster-scroll",
          "count": 1
        }
      ],
      "totalCost": 790,
      "use": null,
      "comment": null
    },
    {
      "id": "mace-of-mortality",
      "name": "Mace of Mortality",
      "tier": "t3",
      "cost": 145,
      "category": "both",
      "stats": [
        "+55 Attack Damage",
        "+400 Hit Points",
        "10% Attack Speed"
      ],
      "active": {
        "name": "War Cry",
        "cooldown": "60",
        "description": "For 10 seconds, gain bonus attack damage equal to 5% of your maximum hit points. Allies within range 1000 gain 15% bonus damage. \nColossus damage is doubled during War Cry."
      },
      "passives": [
        {
          "name": "Colossus",
          "description": "Basic attacks deal bonus physical damage equal to 2% of your maximum Hit Points."
        },
        {
          "name": "Smash",
          "description": "Basic attacks heal you for 2% of your maximum Hit Points over 2 seconds."
        }
      ],
      "requires": [
        {
          "id": "warbanner",
          "count": 1
        },
        {
          "id": "titanic-tridents",
          "count": 1
        },
        {
          "id": "tides-heart",
          "count": 2
        }
      ],
      "totalCost": 1000,
      "use": null,
      "comment": "Not sure if the buff should refresh on AA (maybe the tick is gonna work instantly and it just ends up being on hit or it should not be refreshable)"
    },
    {
      "id": "essence-of-pure-magic",
      "name": "Essence of Pure Magic",
      "tier": "t3",
      "cost": 195,
      "category": "both",
      "stats": [
        "+400 Mana Points",
        "+600 Hit Points"
      ],
      "active": {
        "name": "Immortality",
        "cooldown": "90s",
        "description": "Regenerate 1500 mana and health over 2.5 seconds. For the duration, the user is invulnerable."
      },
      "passives": [
        {
          "name": "Unstable Magic",
          "description": "Allied units within range 1000 regenerate 8 bonus mana and hit points per second."
        }
      ],
      "requires": [
        {
          "id": "enchantress-fluid",
          "count": 1
        },
        {
          "id": "heart-of-the-sea",
          "count": 1
        }
      ],
      "totalCost": 910,
      "use": null,
      "comment": null
    },
    {
      "id": "armor-of-tides",
      "name": "Armor of Tides",
      "tier": "t3",
      "cost": 200,
      "category": "defensive",
      "stats": [
        "+4 Armor",
        "+300 Hit Points",
        "+12 HP Regen/s"
      ],
      "active": null,
      "passives": [
        {
          "name": "Tidal Fortitude",
          "description": "Gain +3 armor.\nPhysical Damage taken is reduced by 2%."
        },
        {
          "name": "Crisis Regen",
          "description": "When below 50% health, regeneration granted by this item is doubled."
        }
      ],
      "requires": [
        {
          "id": "reef-armor",
          "count": 1
        },
        {
          "id": "super-regenerative-spines",
          "count": 1
        }
      ],
      "totalCost": 785,
      "use": null,
      "comment": null
    },
    {
      "id": "robe-of-spellcraft",
      "name": "Robe of Spellcraft",
      "tier": "t3",
      "cost": 200,
      "category": "both",
      "stats": [
        "+5 Armor",
        "+300 Hit Points",
        "+400 Mana Points"
      ],
      "active": {
        "name": "Realm Shift",
        "cooldown": "90",
        "description": "Turn ethereal for up to 10 seconds, broken once you cast a spell. While ethereal, incoming healing is increased by 15%."
      },
      "passives": [
        {
          "name": "Spell Armor",
          "description": "Spell Casts heal you for 10% max mana and ALL damage taken is reduced by 1% for 5 seconds. Stacks up to 3 times, renewing on each Spell Cast."
        },
        {
          "name": "Magic Resist",
          "description": "+15% Magic Damage Reduction"
        }
      ],
      "requires": [
        {
          "id": "reef-armor",
          "count": 1
        },
        {
          "id": "magic-armor",
          "count": 1
        },
        {
          "id": "magic-coral",
          "count": 1
        }
      ],
      "totalCost": 920,
      "use": null,
      "comment": null
    },
    {
      "id": "dawnkeeper",
      "name": "Dawnkeeper",
      "tier": "t3",
      "cost": 150,
      "category": "defensive",
      "stats": [
        "+5 Armor",
        "+500 Hit Points"
      ],
      "active": {
        "name": "Call of Valor",
        "cooldown": "45s",
        "description": "Select a target allied unit within range 1000. For the next 10 seconds the two units share 25% of the damage they take as pure damage, and both gain 5 bonus armor.\nWhile bonded, both units regenerate 50 hit points per second."
      },
      "passives": [],
      "requires": [
        {
          "id": "casque-of-valor",
          "count": 1
        },
        {
          "id": "enchantress-fluid",
          "count": 1
        }
      ],
      "totalCost": 860,
      "use": null,
      "comment": null
    },
    {
      "id": "highseer-slippers",
      "name": "Highseer Slippers",
      "tier": "t3",
      "cost": 240,
      "category": "offensive",
      "stats": [
        "+400 Mana Points",
        "+10 Mana Regeneration / second"
      ],
      "active": null,
      "passives": [
        {
          "name": "Spellblade",
          "description": "Spell Casts cleanse you of all negative effects for 2 seconds. Every 4th Spell Cast amplifies your next Basic Attack to apply and consume Runic Exposure dealing double the damage in an AoE arcane explosion."
        },
        {
          "name": "Runic Exposure",
          "description": "Basic attacks apply a runic mark for 2.5 seconds. Attacking a marked target consumes the mark and deals 50 magic damage."
        },
        {
          "name": "Swift Casting",
          "description": "All spells receive 10% Cooldown Reduction"
        }
      ],
      "requires": [
        {
          "id": "runic-axe",
          "count": 1
        },
        {
          "id": "caster-scroll",
          "count": 1
        }
      ],
      "totalCost": 750,
      "use": null,
      "comment": "idk if i like this yet; too complicated?"
    },
    {
      "id": "enchanted-druid-leaf",
      "name": "Enchanted Druid Leaf",
      "tier": "t3",
      "cost": 100,
      "category": "defensive",
      "stats": [],
      "active": {
        "name": "Enchanted Wards",
        "cooldown": "75s (passable, resets cd)",
        "description": "Place a healing ward without consuming this item. The ward lasts 30 seconds, healing all friendly units within range 600."
      },
      "passives": [],
      "requires": [
        {
          "id": "eternal-wards",
          "count": 1
        }
      ],
      "totalCost": 320
    },
    {
      "id": "enchanted-magic-armor",
      "name": "Enchanted Magic Armor",
      "tier": "t3",
      "cost": 180,
      "category": "defensive",
      "stats": [
        "+400 Mana Points",
        "+12 Health Regeneration / second"
      ],
      "active": null,
      "passives": [
        {
          "name": "Healing Amplification",
          "description": "Upon casting a healing spell, you get healed for an additional 30%."
        },
        {
          "name": "Crisis Regen",
          "description": "When below 50% health, regeneration granted by this item is doubled."
        },
        {
          "name": "Magic Resist",
          "description": "+30% Magic Damage Reduction"
        }
      ],
      "requires": [
        {
          "id": "magic-armor",
          "count": 1
        },
        {
          "id": "super-regenerative-spines",
          "count": 1
        }
      ],
      "totalCost": 715,
      "comment": "moved magic resist to passive, i think its more fitting down here and can make it unstackable if needed",
      "use": null
    },
    {
      "id": "foretellers-sickle",
      "name": "Foreteller's Sickle",
      "tier": "t3",
      "cost": 250,
      "category": "offensive",
      "stats": [
        "+200 Mana Points",
        "+25% Attack Speed"
      ],
      "active": null,
      "passives": [
        {
          "name": "Runic Wrath",
          "description": "Attacks deal bonus magic damage equal to 3% max mana (Max 100 vs Units). Spell Casts grant an additional 5% max mana for 5 seconds."
        }
      ],
      "requires": [
        {
          "id": "runic-axe",
          "count": 1
        },
        {
          "id": "magic-coral",
          "count": 1
        },
        {
          "id": "berserkers-gem",
          "count": 1
        }
      ],
      "totalCost": 860,
      "use": null,
      "comment": "Runic Wrath to be simplified probably. \nMax value to units?"
    },
    {
      "id": "helmet-of-the-damned",
      "name": "Helmet of the Damned",
      "tier": "t3",
      "cost": 200,
      "category": "offensive",
      "stats": [
        "+30 Attack Damage",
        "25% Attack Speed"
      ],
      "active": {
        "name": "Voodoo Wards",
        "cooldown": "30s",
        "description": "Create a fragile voodoo ward at the target point within range 1000, lasting 200 seconds."
      },
      "passives": [
        {
          "name": "Voodoo Decay",
          "description": "Voodoo Ward reduces enemy armor by 5 within 500 range."
        },
        {
          "name": "Voodoo Magic",
          "description": "Voodoo Ward causes allied units to heal for 25% of the physical damage they deal within 500 range"
        }
      ],
      "requires": [
        {
          "id": "voodoo-doll",
          "count": 1
        },
        {
          "id": "berserkers-gem",
          "count": 1
        },
        {
          "id": "surge-trident",
          "count": 1
        }
      ],
      "totalCost": 765,
      "comment": null,
      "use": null
    },
    {
      "id": "mistlords-cape",
      "name": "Mistlord's Cape",
      "tier": "t3",
      "cost": 150,
      "category": "both",
      "stats": [
        "+15% Attack Speed",
        "+12 HP Regen/s",
        "+60 Movement Speed"
      ],
      "active": {
        "name": "Shadow Walk",
        "cooldown": "120",
        "description": "Turns the holder invisible and grants 20% bonus movement speed for (15 + hero level×2) seconds over 0.5 seconds. For the duration the holder can move through units."
      },
      "passives": [
        {
          "name": "Nightsight",
          "description": "The holder's vision is not reduced during night time."
        },
        {
          "name": "Crisis Regen",
          "description": "When below 50% health, regeneration granted by this item is doubled."
        }
      ],
      "requires": [
        {
          "id": "stormrider-cloak",
          "count": 1
        },
        {
          "id": "super-regenerative-spines",
          "count": 1
        }
      ],
      "totalCost": 745,
      "use": null,
      "comment": "Crisis Regen replacing the C4NC3R invis passive (it builds from super regen anyway).\nMAYBE FOG GEN??"
    },
    {
      "id": "molten-blade",
      "name": "Molten Blade",
      "tier": "t3",
      "cost": 40,
      "category": "offensive",
      "stats": [],
      "active": null,
      "passives": [
        {
          "name": "Emberhearth",
          "description": "Attacks on structures reveal the immediate surroundings for 15 seconds."
        },
        {
          "name": "Fiery Touch",
          "description": "Attacks burn enemy structures for 5 seconds, dealing 10% of the maximum hit point of the structure + 25 damage per second."
        },
        {
          "name": "Spectral Fire",
          "description": "Killing an enemy causes a fiery explosion dealing 49 damage to nearby enemies and structures. Harvesters yield 2 gold upon dying."
        }
      ],
      "requires": [
        {
          "id": "gauntlets-of-embers",
          "count": 1
        },
        {
          "id": "runic-axe",
          "count": 1
        }
      ],
      "totalCost": 500,
      "comment": "Removed attack speed and followed yokola95 ideas of %dmg. Way worse for sieging, way better for farming walls, way cheaper.",
      "use": null
    },
    {
      "id": "poseidons-trident",
      "name": "Poseidon's Trident",
      "tier": "t3",
      "cost": 275,
      "category": "offensive",
      "stats": [
        "+55 Attack Damage",
        "+10% Attack Speed"
      ],
      "active": {
        "name": "Unleashed Rage",
        "cooldown": "30",
        "description": "Gain 35% bonus attack damage for 10 seconds"
      },
      "passives": [
        {
          "name": "Titan",
          "description": "Basic attacks on structures deal 10 + (5 × hero level) bonus damage on hit."
        }
      ],
      "requires": [
        {
          "id": "titanic-tridents",
          "count": 1
        },
        {
          "id": "warbanner",
          "count": 1
        }
      ],
      "totalCost": 930,
      "comment": "Move speed should not be on this item, weird build path + regaining its identity as a high burst option.",
      "use": null
    },
    {
      "id": "spear-of-fervor",
      "name": "Spear of Fervor",
      "tier": "t3",
      "cost": 250,
      "category": "offensive",
      "stats": [
        "+50% Attack Speed"
      ],
      "active": null,
      "passives": [
        {
          "name": "Fervor",
          "description": "Basic attacks grant bonus attack speed for 2.5 seconds, stacking up to 6 times for up to 20% bonus attack speed."
        }
      ],
      "requires": [
        {
          "id": "berserkers-gem",
          "count": 2
        }
      ],
      "totalCost": 750,
      "use": null,
      "comment": "Change to Berserker's Gem + Gem of Haste then make base AS lower but increase the stacking AS?"
    },
    {
      "id": "ankh-of-superiority",
      "name": "Ankh of Superiority",
      "tier": "t3",
      "cost": 180,
      "category": "both",
      "stats": [
        "+20 Attack Damage",
        "+5 Vitality",
        "+5 Celerity",
        "+5 Windsom"
      ],
      "active": {
        "name": "Consume Ankh",
        "cooldown": null,
        "description": "Consume the ankh, gaining the bonuses granted by this item."
      },
      "passives": [
        {
          "name": "Reincarnation",
          "description": "Upon death, respawn with 2500 hit points, activating Superiority."
        }
      ],
      "requires": [],
      "totalCost": 180,
      "use": null,
      "comment": "Make the sell value 90 g:)"
    },
    {
      "id": "berserkers-gem",
      "name": "Berserker's Gem",
      "tier": "t2",
      "cost": 80,
      "category": "offensive",
      "stats": [
        "+25% Attack Speed"
      ],
      "use": null,
      "active": null,
      "passives": [],
      "requires": [
        {
          "id": "gem-of-haste",
          "count": 2
        }
      ],
      "comment": "Classic attack speed stat stick Tier 2 item that is usable for several builds.",
      "totalCost": 250
    },
    {
      "id": "cyclone-staff",
      "name": "Cyclone Staff",
      "tier": "t2",
      "cost": 100,
      "category": "utility",
      "stats": [],
      "use": null,
      "active": {
        "name": "Cyclone",
        "cooldown": "30",
        "description": "Cyclone a non-allied unit within range 500 for 5 seconds. For the duration, unit cannot be interacted with."
      },
      "passives": [],
      "requires": [
        {
          "id": "wand-of-wind",
          "count": 2
        }
      ],
      "totalCost": 200,
      "comment": null
    }
  ]
};
    if (!versions.getAll().find(v => v.name === data.name)) {
      const v = versions.create(data.name, "base");
      versions.saveItems(v.id, data.items);
      versions.reload();
    }
  } catch(e) { console.warn("v5 load:", e); }
})();
