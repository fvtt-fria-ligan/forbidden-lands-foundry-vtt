import { ForbiddenLandsCharacterSheet } from "@actor/character/character-sheet.js";
import { ForbiddenLandsMonsterSheet } from "@actor/monster/monster-sheet.js";
import { ForbiddenLandsStrongholdSheet } from "@actor/stronghold/stronghold-sheet.js";
import { ForbiddenLandsPartySheet } from "@actor/party/party-sheet.js";
import { ForbiddenLandsWeaponSheet } from "@item/weapon/weapon-sheet.js";
import { ForbiddenLandsArmorSheet } from "@item/armor/armor-sheet.js";
import { ForbiddenLandsGearSheet } from "@item/gear/gear-sheet.js";
import { ForbiddenLandsRawMaterialSheet } from "@item/raw-material/raw-material-sheet.js";
import { ForbiddenLandsSpellSheet } from "@item/spell/spell-sheet.js";
import { ForbiddenLandsTalentSheet } from "@item/talent/talent-sheet.js";
import { ForbiddenLandsCriticalInjurySheet } from "@item/critical-injury/critical-injury-sheet.js";
import { ForbiddenLandsMonsterAttackSheet } from "@item/monster-attack/monster-attack-sheet.js";
import { ForbiddenLandsBuildingSheet } from "@item/building/building-sheet.js";
import { ForbiddenLandsHirelingSheet } from "@item/hireling/hireling-sheet.js";
import { AdventureSitesSheet } from "@journal/adventure-sites/adventure-site-sheet.js";

export function registerSheets() {
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("forbidden-lands", ForbiddenLandsCharacterSheet, {
		types: ["character"],
		makeDefault: true,
	});
	Actors.registerSheet("forbidden-lands", ForbiddenLandsMonsterSheet, {
		types: ["monster"],
		makeDefault: true,
	});
	Actors.registerSheet("forbidden-lands", ForbiddenLandsStrongholdSheet, {
		types: ["stronghold"],
		makeDefault: true,
	});
	Actors.registerSheet("forbidden-lands", ForbiddenLandsPartySheet, {
		types: ["party"],
		makeDefault: true,
	});
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("forbidden-lands", ForbiddenLandsWeaponSheet, {
		types: ["weapon"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsArmorSheet, {
		types: ["armor"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsGearSheet, {
		types: ["gear"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsRawMaterialSheet, {
		types: ["rawMaterial"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsSpellSheet, {
		types: ["spell"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsTalentSheet, {
		types: ["talent"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsCriticalInjurySheet, {
		types: ["criticalInjury"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsMonsterAttackSheet, {
		types: ["monsterAttack"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsBuildingSheet, {
		types: ["building"],
		makeDefault: true,
	});
	Items.registerSheet("forbidden-lands", ForbiddenLandsHirelingSheet, {
		types: ["hireling"],
		makeDefault: true,
	});
	CONFIG.fbl.adventureSites.sheetClass = AdventureSitesSheet;
}
