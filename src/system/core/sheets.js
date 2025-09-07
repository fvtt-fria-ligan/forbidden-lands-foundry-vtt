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

export function registerSheets() {
	foundry.documents.collections.Actors.unregisterSheet(
		"core",
		foundry.appv1.sheets.ActorSheet,
	);
	foundry.documents.collections.Actors.registerSheet(
		"forbidden-lands",
		ForbiddenLandsCharacterSheet,
		{
			types: ["character"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Actors.registerSheet(
		"forbidden-lands",
		ForbiddenLandsMonsterSheet,
		{
			types: ["monster"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Actors.registerSheet(
		"forbidden-lands",
		ForbiddenLandsStrongholdSheet,
		{
			types: ["stronghold"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Actors.registerSheet(
		"forbidden-lands",
		ForbiddenLandsPartySheet,
		{
			types: ["party"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.unregisterSheet(
		"core",
		foundry.appv1.sheets.ItemSheet,
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsWeaponSheet,
		{
			types: ["weapon"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsArmorSheet,
		{
			types: ["armor"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsGearSheet,
		{
			types: ["gear"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsRawMaterialSheet,
		{
			types: ["rawMaterial"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsSpellSheet,
		{
			types: ["spell"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsTalentSheet,
		{
			types: ["talent"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsCriticalInjurySheet,
		{
			types: ["criticalInjury"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsMonsterAttackSheet,
		{
			types: ["monsterAttack"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsBuildingSheet,
		{
			types: ["building"],
			makeDefault: true,
		},
	);
	foundry.documents.collections.Items.registerSheet(
		"forbidden-lands",
		ForbiddenLandsHirelingSheet,
		{
			types: ["hireling"],
			makeDefault: true,
		},
	);
}
