import { ForbiddenLandsCharacterSheet } from "../sheet/character.js";
import { ForbiddenLandsMonsterSheet } from "../sheet/monster.js";
import { ForbiddenLandsStrongholdSheet } from "../sheet/stronghold.js";
import { ForbiddenLandsWeaponSheet } from "../sheet/weapon.js";
import { ForbiddenLandsArmorSheet } from "../sheet/armor.js";
import { ForbiddenLandsGearSheet } from "../sheet/gear.js";
import { ForbiddenLandsRawMaterialSheet } from "../sheet/raw-material.js";
import { ForbiddenLandsSpellSheet } from "../sheet/spell.js";
import { ForbiddenLandsTalentSheet } from "../sheet/talent.js";
import { ForbiddenLandsCriticalInjurySheet } from "../sheet/critical-injury.js";
import { ForbiddenLandsMonsterTalentSheet } from "../sheet/monster-talent.js";
import { ForbiddenLandsMonsterAttackSheet } from "../sheet/monster-attack.js";
import { ForbiddenLandsBuildingSheet } from "../sheet/building.js";
import { ForbiddenLandsHirelingSheet } from "../sheet/hireling.js";

export function registerSheets() {
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("forbidden-lands", ForbiddenLandsCharacterSheet, { types: ["character"], makeDefault: true });
	Actors.registerSheet("forbidden-lands", ForbiddenLandsMonsterSheet, { types: ["monster"], makeDefault: true });
	Actors.registerSheet("forbidden-lands", ForbiddenLandsStrongholdSheet, {
		types: ["stronghold"],
		makeDefault: true,
	});
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("forbidden-lands", ForbiddenLandsWeaponSheet, { types: ["weapon"], makeDefault: true });
	Items.registerSheet("forbidden-lands", ForbiddenLandsArmorSheet, { types: ["armor"], makeDefault: true });
	Items.registerSheet("forbidden-lands", ForbiddenLandsGearSheet, { types: ["gear"], makeDefault: true });
	Items.registerSheet("forbidden-lands", ForbiddenLandsRawMaterialSheet, {
		types: ["rawMaterial"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsSpellSheet, { types: ["spell"], makeDefault: true });
	Items.registerSheet("forbidden-lands", ForbiddenLandsTalentSheet, { types: ["talent"], makeDefault: true });
	Items.registerSheet("forbidden-lands", ForbiddenLandsCriticalInjurySheet, {
		types: ["criticalInjury"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsMonsterTalentSheet, {
		types: ["monsterTalent"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsMonsterAttackSheet, {
		types: ["monsterAttack"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsBuildingSheet, { types: ["building"], makeDefault: true });
	Items.registerSheet("forbidden-lands", ForbiddenLandsHirelingSheet, { types: ["hireling"], makeDefault: true });
}
