
import { initializeHandlebars } from "./handlebars.js";
import { ForbiddenLandsCharacterGenerator } from "./character-generator.js";

Hooks.once("init", () => {
    initializeHandlebars();

    game.settings.register("forbidden-lands-character-generator", "datasetDir", {
        name: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR"),
        hint: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR_HINT"),
        scope: "world",
        config: true,
        default: "modules/forbidden-lands-character-generator/assets",
        type: window.Azzu.SettingsTypes.DirectoryPicker
      });
});

Hooks.on("generateCharacterForm", async (app, html, data) => {
    console.log("Forbidden Lands generateCharacterForm");

    let chargen = await ForbiddenLandsCharacterGenerator.getInstance();
    chargen.render(true);
});