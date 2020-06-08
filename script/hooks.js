import {ForbiddenLandsActor} from "./actor/forbidden-lands.js";
import {ForbiddenLandsCharacterSheet} from "./sheet/character.js";

Hooks.once("init", async function () {
    CONFIG.Combat.initiative = {formula: "1d10", decimals: 0};
    CONFIG.Actor.entityClass = ForbiddenLandsActor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("forbidden-lands", ForbiddenLandsCharacterSheet, {types: ["character"], makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    preloadHandlebarsTemplates()
});

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/forbidden-lands/model/character.html"
    ];
    return loadTemplates(templatePaths);
}