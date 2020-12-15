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
  Actors.registerSheet("forbidden-lands-rpg", ForbiddenLandsCharacterSheet, { types: ["character"], makeDefault: true });
  Actors.registerSheet("forbidden-lands-rpg", ForbiddenLandsMonsterSheet, { types: ["monster"], makeDefault: true });
  Actors.registerSheet("forbidden-lands-rpg", ForbiddenLandsStrongholdSheet, { types: ["stronghold"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsWeaponSheet, { types: ["weapon"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsArmorSheet, { types: ["armor"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsGearSheet, { types: ["gear"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsRawMaterialSheet, { types: ["rawMaterial"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsSpellSheet, { types: ["spell"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsTalentSheet, { types: ["talent"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsCriticalInjurySheet, { types: ["criticalInjury"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsMonsterTalentSheet, { types: ["monsterTalent"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsMonsterAttackSheet, { types: ["monsterAttack"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsBuildingSheet, { types: ["building"], makeDefault: true });
  Items.registerSheet("forbidden-lands-rpg", ForbiddenLandsHirelingSheet, { types: ["hireling"], makeDefault: true });
}
