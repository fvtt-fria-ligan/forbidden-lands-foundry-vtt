/**
 * @description This acts as a configuration utility for the system. Everything that doesn't need to go in template.json, but is still referenced throughout the system is gathered here.
 */

interface FBLConfig {
	actionSkillMap: Record<string, string>;
	actionModifiers: Record<string, number>;
	adventureSites: {
		tables: Record<string, string>;
		transformers: Record<string, string>;
		types: Record<string, string>;
		utilities: Record<string, string>;
		generate: (path: string, type: string) => Promise<void>;
	};
	attributes: string[];
	carriedStates: string[];
	carriedItemTypes: string[];
	characterSubtype: Record<string, string>;
	consumableDice: Record<string, string>;
	conditions: string[];
	dataSetConfig: Record<string, string>;
	encumbrance: Record<string, number>;
	enrichedActorFields: string[];
	enrichedItemFields: string[];
	i18n: Record<string, string>;
	itemTypes: string[];
	maxInit: number;
	mishapTables: string[];
	encounterTables: string[];
	otherTables: string[];
	prideDice: string;
	skillAttributeMap: Record<string, string>;
	statusEffects: StatusEffect[];
	weaponFeatures: string[];
}

const FBL = {
	actionSkillMap: {
		slash: "melee",
		stab: "melee",
		unarmed: "melee",
		grapple: "melee",
		"break-free": "melee",
		melee: "melee",
		ranged: "marksmanship",
		shoot: "marksmanship",
		persuade: "manipulation",
		taunt: "performance",
		flee: "move",
		heal: "heal",
		dodge: "move",
		parry: "melee",
		shove: "melee",
		disarm: "melee",
		run: "move",
		retreat: "move",
		"grapple-attack": "melee",
		"travel-forced-march": "endurance",
		"travel-hike-in-darkness": "scouting",
		"travel-navigate": "survival",
		"travel-sea-travel": "survival",
		"travel-keep-watch": "scouting",
		"travel-find-good-place": "survival",
		"travel-find-food": "survival",
		"travel-find-prey": "survival",
		"travel-kill-prey": "survival",
		"travel-catch-fish": "survival",
		"travel-make-camp": "survival",
	},
	actionModifiers: {
		parry: -2,
	},
	adventureSites: {
		tables: {},
		transformers: {},
		types: {},
		utilities: {},
		generate: async (_path: string, _type: string) => {},
	},
	attributes: ["agility", "empathy", "strength", "wits"],
	carriedStates: ["equipped", "carried"],
	carriedItemTypes: ["armor", "gear", "rawMaterial", "weapon"],
	characterSubtype: { pc: "ACTOR.SUBTYPE.PC", npc: "ACTOR.SUBTYPE.NPC" },
	consumableDice: {
		1: "1db",
		2: "1d8",
		3: "1d10",
		4: "1d12",
	},
	conditions: ["cold", "hungry", "sleepy", "thirsty"],
	dataSetConfig: {
		en: "dataset",
		"pt-BR": "dataset-pt-br",
		es: "dataset-es",
		fr: "dataset-fr",
		de: "dataset-de",
	},
	encumbrance: {
		tiny: 0,
		none: 0,
		light: 0.5,
		regular: 1,
		heavy: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
	},
	enrichedActorFields: [
		"note",
		"pride",
		"face",
		"body",
		"clothing",
		"darkSecret",
	],
	enrichedItemFields: [
		"description",
		"effect",
		"drawback",
		"appearance",
		"tools",
		"features.others",
	],
	i18n: {
		armor: "ITEM.TypeArmor",
		gear: "ITEM.TypeGear",
		weapon: "ITEM.TypeWeapon",
		rawMaterial: "ITEM.TypeRawmaterial",
		talent: "ITEM.TypeTalent",
		spell: "ITEM.TypeSpell",
		monsterAttack: "ITEM.TypeMonsterattack",
		criticalInjury: "ITEM.TypeCriticalinjury",
		building: "ITEM.TypeBuilding",
		hireling: "ITEM.TypeHireling",
		agility: "ATTRIBUTE.AGILITY",
		empathy: "ATTRIBUTE.EMPATHY",
		strength: "ATTRIBUTE.STRENGTH",
		wits: "ATTRIBUTE.WITS",
		"animal-handling": "SKILL.ANIMAL_HANDLING",
		crafting: "SKILL.CRAFTING",
		endurance: "SKILL.ENDURANCE",
		healing: "SKILL.HEALING",
		insight: "SKILL.INSIGHT",
		lore: "SKILL.LORE",
		manipulation: "SKILL.MANIPULATION",
		marksmanship: "SKILL.MARKSMANSHIP",
		melee: "SKILL.MELEE",
		might: "SKILL.MIGHT",
		move: "SKILL.MOVE",
		performance: "SKILL.PERFORMANCE",
		scouting: "SKILL.SCOUTING",
		"sleight-of-hand": "SKILL.SLEIGHT_OF_HAND",
		stealth: "SKILL.STEALTH",
		survival: "SKILL.SURVIVAL",
		slash: "ACTION.SLASH",
		stab: "ACTION.STAB",
		unarmed: "ACTION.UNARMED_STRIKE",
		grapple: "ACTION.GRAPPLE",
		"break-free": "ACTION.BREAK_FREE",
		ranged: "WEAPON.RANGED",
		shoot: "ACTION.SHOOT",
		persuade: "ACTION.PERSUADE",
		taunt: "ACTION.TAUNT",
		flee: "ACTION.FLEE",
		heal: "ACTION.HEAL",
		dodge: "ACTION.DODGE",
		parry: "ACTION.PARRY",
		shove: "ACTION.SHOVE",
		disarm: "ACTION.DISARM",
		run: "ACTION.RUN",
		retreat: "ACTION.RETREAT",
		"grapple-attack": "ACTION.GRAPPLE_ATTACK",
		spells: "MAGIC.SPELLS",
		activatedTalents: "TALENT.ANY_ACTIVATED",
		"travel-forced-march": "FLPS.TRAVEL_ROLL.FORCED_MARCH",
		"travel-navigate": "FLPS.TRAVEL_ROLL.NAVIGATE",
		"travel-sea-travel": "FLPS.TRAVEL_ROLL.SEA_TRAVEL",
		"travel-keep-watch": "FLPS.TRAVEL_ROLL.KEEP_WATCH",
		"travel-find-good-place": "FLPS.TRAVEL_ROLL.FIND_GOOD_PLACE",
		"travel-find-food": "FLPS.TRAVEL_ROLL.FIND_FOOD",
		"travel-find-prey": "FLPS.TRAVEL_ROLL.FIND_PREY",
		"travel-hike-in-darkness": "FLPS.TRAVEL_ROLL.HIKE_IN_DARKNESS",
		"travel-kill-prey": "FLPS.TRAVEL_ROLL.KILL_PREY",
		"travel-catch-fish": "FLPS.TRAVEL_ROLL.CATCH_FISH",
		"travel-make-camp": "FLPS.TRAVEL_ROLL.MAKE_CAMP",
		carryingCapacity: "CARRYING_CAPACITY",
		"dark-forest": "BIOME.DARK_FOREST",
		forest: "BIOME.FOREST",
		hills: "BIOME.HILLS",
		lake: "BIOME.LAKE",
		marshlands: "BIOME.MARSHLANDS",
		mountains: "BIOME.MOUNTAINS",
		plains: "BIOME.PLAINS",
		quagmire: "BIOME.QUAGMIRE",
		ruins: "BIOME.RUINS",
		"beneath-the-ice": "BIOME.BENEATH_THE_ICE",
		"ice-cap": "BIOME.ICE_CAP",
		"ice-forest": "BIOME.ICE_FOREST",
		"sea-ice": "BIOME.SEA_ICE",
		tundra: "BIOME.TUNDRA",
		"crimson-forest": "BIOME.CRIMSON_FOREST",
		ashlands: "BIOME.ASHLANDS",
		ocean: "BIOME.OCEAN",
		firelands: "BIOME.FIRELANDS",
	},
	itemTypes: [
		"armor",
		"building",
		"criticalInjury",
		"gear",
		"hireling",
		"monsterAttack",
		"rawMaterial",
		"spell",
		"talent",
		"weapon",
	],
	maxInit: 10,
	mishapTables: [
		"travel-make-camp",
		"travel-catch-fish",
		"travel-find-food",
		"travel-find-prey",
		"travel-navigate",
		"travel-sea-travel",
		"spell",
	],
	encounterTables: [
		"dark-forest",
		"forest",
		"hills",
		"lake",
		"marshlands",
		"mountains",
		"plains",
		"quagmire",
		"ruins",
		"beneath-the-ice",
		"ice-cap",
		"ice-forest",
		"sea-ice",
		"tundra",
		"ocean",
		"firelands",
		"crimson-forest",
		"ashlands",
	],
	otherTables: ["travel-find-prey"],
	prideDice: "1d12",
	skillAttributeMap: {
		"animal-handling": "empathy",
		crafting: "strength",
		endurance: "strength",
		healing: "empathy",
		insight: "wits",
		lore: "wits",
		manipulation: "empathy",
		marksmanship: "agility",
		melee: "strength",
		might: "strength",
		move: "agility",
		performance: "empathy",
		scouting: "wits",
		"sleight-of-hand": "agility",
		stealth: "agility",
		survival: "wits",
	},
	statusEffects: [
		{
			id: "sleepy",
			icon: "icons/svg/sleep.svg",
			label: "CONDITION.SLEEPY",
			changes: [
				{
					key: "system.condition.sleepy.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["sleepy"],
		},
		{
			id: "thirsty",
			icon: "icons/svg/tankard.svg",
			label: "CONDITION.THIRSTY",
			changes: [
				{
					key: "system.condition.thirsty.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["thirsty"],
		},
		{
			id: "hungry",
			icon: "icons/svg/sun.svg",
			label: "CONDITION.HUNGRY",
			changes: [
				{
					key: "system.condition.hungry.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["hungry"],
		},
		{
			id: "cold",
			icon: "icons/svg/frozen.svg",
			label: "CONDITION.COLD",
			changes: [
				{
					key: "system.condition.cold.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["cold"],
		},
	],
	weaponFeatures: [
		"blunt",
		"edged",
		"hook",
		"parrying",
		"shield",
		"pointed",
		"slowReload",
	],
} satisfies FBLConfig;

export const modifyConfig = () => {
	const settings = ["maxInit"] as const;
	for (const setting of settings) {
		const value = game.settings.get("forbidden-lands", setting) as number;
		if (value) {
			FBL[setting] = value;
		}
	}
};
export default FBL;
