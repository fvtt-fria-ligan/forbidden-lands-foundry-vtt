
import { ForbiddenLandsPartySheet } from "./party-sheet.js";
import { initializeHandlebars } from "./handlebars.js";
import { TravelActionsConfig } from "./travel-actions.js";

Hooks.once("init", () => {
    Actors.registerSheet("forbidden-lands", ForbiddenLandsPartySheet, { types: ["character"], makeDefault: false });
    initializeHandlebars();

    game.settings.register("forbidden-lands-party-sheet", "allowTravelRollPush", {
        name: game.i18n.localize("FLPS.SETTINGS.ALLOW_PUSH"),
        hint: game.i18n.localize("FLPS.SETTINGS.ALLOW_PUSH_HINT"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });
});

Hooks.on("renderActorSheet", async (app, html, data) => {
    if (!(app instanceof ForbiddenLandsPartySheet)) return; // not our thing

    let actor = game.actors.get(data.entity._id);
    if (actor.data.flags.partyMembers !== undefined) return; // everything is already initialized

    console.log("Forbidden Lands Party Sheet: initializing sheet");
    let initialData = {
        "flags.partyMembers": [],
    };
    
    for(let key in TravelActionsConfig) {
        initialData[`flags.travel.${key}`] = [];
    }
    await actor.update(initialData);
});