import { ForbiddenLandsActor, ForbiddenLandsItem } from "./actor/forbidden-lands.js";
import { initializeCalendar } from "./hooks/calendar-weather.js";
import { registerDice } from "./hooks/dice.js";
import { registerDiceSoNice } from "./hooks/dice-so-nice.js";
import { registerFonts } from "./hooks/fonts.js";
import { initializeHandlebars } from "./hooks/handlebars.js";
import { migrateWorld } from "./hooks/migration.js";
import { registerSheets } from "./hooks/sheets.js";
import { RollDialog } from "./dialog/roll-dialog.js";
import DiceRoller from "./components/dice-roller.js";

// CONFIG.debug.hooks = true;

Hooks.once("init", () => {
  CONFIG.Combat.initiative = { formula: "1d10", decimals: 0 };
  CONFIG.Actor.entityClass = ForbiddenLandsActor;
  CONFIG.Item.entityClass = ForbiddenLandsItem;
  CONFIG.rollDialog = RollDialog;
  CONFIG.diceRoller = new DiceRoller();
  registerFonts();
  registerSheets();
  registerDice();
  initializeHandlebars();
  game.settings.register("forbidden-lands", "worldSchemaVersion", {
    name: "World Version",
    hint: "Used to automatically upgrade worlds data when the system is upgraded.",
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });
});

Hooks.once("ready", () => {
  migrateWorld();
  initializeCalendar();
});

Hooks.once("diceSoNiceReady", (dice3d) => {
  registerDiceSoNice(dice3d);
});
