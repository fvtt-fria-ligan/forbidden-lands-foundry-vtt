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
};

FBL.attributes = ["agility", "empathy", "strength", "wits"];

FBL.consumableDice = {
	6: "1db",
	8: "1d8",
	10: "1d10",
	12: "1d12",
};

FBL.conditions = ["cold", "hungry", "sleepy", "thirsty"];

FBL.dataSetConfig = {
	en: "dataset",
	"pt-BR": "dataset-pt-br",
	es: "dataset-es",
};

FBL.encumbrance = {
	tiny: 0,
	none: 0,
	light: 0.5,
	regular: 1,
	heavy: 2,
};

FBL.i18n = {
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
	unarmed: "ACTION.UNARMED",
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
};

FBL.itemTypes = [
	"armor",
	"building",
	"criticalInjury",
	"gear",
	"hireling",
	"monsterAttack",
	"monsterTalent",
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

export default FBL;
