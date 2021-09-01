import { ForbiddenLandsCharacterSheet } from "../sheets/actor/character.js";
import { ForbiddenLandsMonsterSheet } from "../sheets/actor/monster.js";
import { ForbiddenLandsStrongholdSheet } from "../sheets/actor/stronghold.js";
import { ForbiddenLandsPartySheet } from "../sheets/actor/party-sheet.js";
import { ForbiddenLandsWeaponSheet } from "../sheets/item/weapon.js";
import { ForbiddenLandsArmorSheet } from "../sheets/item/armor.js";
import { ForbiddenLandsGearSheet } from "../sheets/item/gear.js";
import { ForbiddenLandsRawMaterialSheet } from "../sheets/item/raw-material.js";
import { ForbiddenLandsSpellSheet } from "../sheets/item/spell.js";
import { ForbiddenLandsTalentSheet } from "../sheets/item/talent.js";
import { ForbiddenLandsCriticalInjurySheet } from "../sheets/item/critical-injury.js";
import { ForbiddenLandsMonsterAttackSheet } from "../sheets/item/monster-attack.js";
import { ForbiddenLandsBuildingSheet } from "../sheets/item/building.js";
import { ForbiddenLandsHirelingSheet } from "../sheets/item/hireling.js";

export function registerSheets() {
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("forbidden-lands", ForbiddenLandsCharacterSheet, { types: ["character"], makeDefault: true });
	Actors.registerSheet("forbidden-lands", ForbiddenLandsMonsterSheet, { types: ["monster"], makeDefault: true });
	Actors.registerSheet("forbidden-lands", ForbiddenLandsStrongholdSheet, {
		types: ["stronghold"],
		makeDefault: true,
	});
	Actors.registerSheet("forbidden-lands", ForbiddenLandsPartySheet, { types: ["party"], makeDefault: true });
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
	Items.registerSheet("forbidden-lands", ForbiddenLandsMonsterAttackSheet, {
		types: ["monsterAttack"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsBuildingSheet, { types: ["building"], makeDefault: true });
	Items.registerSheet("forbidden-lands", ForbiddenLandsHirelingSheet, { types: ["hireling"], makeDefault: true });
}
