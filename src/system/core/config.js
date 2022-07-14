/**
 * @description This acts as a configuration utility for the system. Everything that doesn't need to go in template.json, but is still referenced throughout the system is gathered here.
 */

const FBL = {};

FBL.actionSkillMap = {
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
	"travel-keep-watch": "scouting",
	"travel-find-good-place": "survival",
	"travel-find-food": "survival",
	"travel-find-prey": "survival",
	"travel-kill-prey": "survival",
	"travel-catch-fish": "survival",
	"travel-make-camp": "survival",
};

FBL.actionModifiers = {
	parry: -2,
};

FBL.activeEffects = {
	cold: {
		"flags.core.statusId": "cold",
		icon: "icons/svg/frozen.svg",
	},
	hungry: {
		"flags.core.statusId": "hungry",
		icon: "icons/svg/sun.svg",
	},
	sleepy: {
		"flags.core.statusId": "sleepy",
		icon: "icons/svg/unconscious.svg",
	},
	thirsty: {
		"flags.core.statusId": "thirsty",
		icon: "icons/svg/tankard.svg",
	},
};

FBL.adventureSites = {
	tables: {},
	transformers: {},
	types: {},
	utilities: {},
};

FBL.attributes = ["agility", "empathy", "strength", "wits"];

FBL.carriedStates = ["carried", "equipped"];

FBL.characterSubtype = { pc: "ACTOR.SUBTYPE.PC", npc: "ACTOR.SUBTYPE.NPC" };

FBL.consumableDice = {
	1: "1db",
	2: "1d8",
	3: "1d10",
	4: "1d12",
};

FBL.conditions = ["cold", "hungry", "sleepy", "thirsty"];

FBL.dataSetConfig = {
	en: "dataset",
	"pt-BR": "dataset-pt-br",
	es: "dataset-es",
	fr: "dataset-fr",
};

FBL.encumbrance = {
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
};

FBL.i18n = {
	armor: "ITEM.TypeArmor",
	gear: "ITEM.TypeGear",
	weapon: "ITEM.TypeWeapon",
	rawMaterial: "ITEM.TypeRawmaterial",
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
	"travel-keep-watch": "FLPS.TRAVEL_ROLL.KEEP_WATCH",
	"travel-find-good-place": "FLPS.TRAVEL_ROLL.FIND_GOOD_PLACE",
	"travel-find-food": "FLPS.TRAVEL_ROLL.FIND_FOOD",
	"travel-find-prey": "FLPS.TRAVEL_ROLL.FIND_PREY",
	"travel-hike-in-darkness": "FLPS.TRAVEL_ROLL.HIKE_IN_DARKNESS",
	"travel-kill-prey": "FLPS.TRAVEL_ROLL.KILL_PREY",
	"travel-catch-fish": "FLPS.TRAVEL_ROLL.CATCH_FISH",
	"travel-make-camp": "FLPS.TRAVEL_ROLL.MAKE_CAMP",
	carryingCapacity: "CARRYING_CAPACITY",
};

FBL.itemTypes = [
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
];

FBL.prideDice = "1d12";

FBL.skillAttributeMap = {
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
};

FBL.weaponFeatures = ["blunt", "edged", "hook", "parrying", "pointed", "slowReload"];

export const modifyConfig = () => {
	const settings = ["maxInit"];
	for (const setting of settings) {
		const value = game.settings.get("forbidden-lands", setting);
		if (value) {
			FBL[setting] = value;
		}
	}
};
export default FBL;
