import crudTest from "../helpers/crud-test";
const CLSName = "Item";
export const individual = {
	armor: () => crudTest(CLSName, "armor", "Armor1"),
	weapon: () => crudTest(CLSName, "weapon", "Weapon1"),
	spell: () => crudTest(CLSName, "spell", "Spell1"),
	talent: () => crudTest(CLSName, "talent", "Talent1"),
	gear: () => crudTest(CLSName, "gear", "Gear1"),
	rawMaterial: () => crudTest(CLSName, "rawMaterial", "RawMaterial1"),
	hireling: () => crudTest(CLSName, "hireling", "Hireling1"),
	building: () => crudTest(CLSName, "building", "Building1"),
	criticalInjury: () => crudTest(CLSName, "criticalInjury", "CriticalInjury1"),
	monsterAttack: () => crudTest(CLSName, "monsterAttack", "MonsterAttack1"),
};
// biome-ignore lint/complexity/noForEach: <explanation>
export const all = () => Object.values(individual).forEach((item) => item());
