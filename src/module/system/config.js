/**
 * @description This acts as a configuration utility for the system. Everything that doesn't need to go in template.json, but is still referenced throughout the system is gathered here.
 */

const FBL = {};

FBL.attributes = {
	agility: "ATTRIBUTE.AGILITY",
	empathy: "ATTRIBUTE.EMPATHY",
	strength: "ATTRIBUTE.STRENGTH",
	wits: "ATTRIBUTE.WITS",
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

FBL.skills = {
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
};

FBL.weaponFeatures = ["blunt", "edged", "hook", "parrying", "pointed", "slowReload"];

export default FBL;
