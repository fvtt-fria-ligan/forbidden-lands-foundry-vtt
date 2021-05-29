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

FBL.dataSetConfig = {
	en: "dataset",
	"pt-BR": "dataset-pt-br",
	es: "dataset-es",
};

FBL.weaponFeatures = ["blunt", "edged", "hook", "parrying", "pointed", "slowReload"];

export default FBL;
