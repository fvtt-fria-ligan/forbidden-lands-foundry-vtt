import {ForbiddenLandsActor} from "./actor/forbidden-lands.js";
import {ForbiddenLandsCharacterSheet} from "./sheet/character.js";
import {ForbiddenLandsWeaponSheet} from "./sheet/weapon.js";
import {ForbiddenLandsSpellSheet} from "./sheet/spell.js";
import {ForbiddenLandsTalentSheet} from "./sheet/talent.js";

Hooks.once("init", async function () {
    CONFIG.Combat.initiative = {formula: "1d10", decimals: 0};
    CONFIG.Actor.entityClass = ForbiddenLandsActor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("forbidden-lands", ForbiddenLandsCharacterSheet, {types: ["character"], makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("forbidden-lands", ForbiddenLandsWeaponSheet, {types: ["weapon"], makeDefault: true});
    Items.registerSheet("forbidden-lands", ForbiddenLandsSpellSheet, {types: ["spell"], makeDefault: true});
    Items.registerSheet("forbidden-lands", ForbiddenLandsTalentSheet, {types: ["talent"], makeDefault: true});
    preloadHandlebarsTemplates()
});

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/forbidden-lands/model/character.html",
        "systems/forbidden-lands/model/weapon.html",
        "systems/forbidden-lands/model/talent.html",
        "systems/forbidden-lands/model/spell.html",
        "systems/forbidden-lands/model/tab/main.html",
        "systems/forbidden-lands/model/tab/combat.html",
        "systems/forbidden-lands/model/tab/talent.html",
        "systems/forbidden-lands/model/tab/spell.html",
        "systems/forbidden-lands/model/tab/gear.html",
        "systems/forbidden-lands/model/tab/bio.html"
    ];
    return loadTemplates(templatePaths);
}