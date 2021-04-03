import { ForbiddenLandsActor, ForbiddenLandsItem } from "./system/entities.js";
import { initializeCalendar } from "./hooks/calendar-weather.js";
import { registerDice } from "./hooks/dice.js";
import { registerDiceSoNice } from "./hooks/dice-so-nice.js";
import { registerFonts } from "./hooks/fonts.js";
import { initializeHandlebars } from "./hooks/handlebars.js";
import { migrateWorld } from "./hooks/migration.js";
import { registerSheets } from "./hooks/sheets.js";
import { RollDialog } from "./components/roll-dialog.js";
import DiceRoller from "./components/dice-roller.js";
import registerHooks from "./utils/hotbar-drop.js";
import FBL from "./system/config.js";

CONFIG.debug.hooks = true;

Hooks.once("init", () => {
	game.fbl = {
		config: FBL,
	};
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
		config: false,
		default: 0,
		type: Number,
	});
	game.settings.register("forbidden-lands", "alternativeSkulls", {
		name: "CONFIG.ALTERNATIVESKULLS",
		hint: "CONFIG.ALTERNATIVESKULLS_DESC",
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showCraftingFields", {
		name: "CONFIG.CRAFTINGFIELD",
		hint: "CONFIG.CRAFTINGFIELD_DESC",
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showCostField", {
		name: "CONFIG.COSTFIELD",
		hint: "CONFIG.COSTFIELD_DESC",
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showSupplyField", {
		name: "CONFIG.SUPPLYFIELD",
		hint: "CONFIG.SUPPLYFIELD_DESC",
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showEffectField", {
		name: "CONFIG.EFFECTFIELD",
		hint: "CONFIG.EFFECTFIELD_DESC",
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showDescriptionField", {
		name: "CONFIG.DESCRIPTIONFIELD",
		hint: "CONFIG.DESCRIPTIONFIELD_DESC",
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showDrawbackField", {
		name: "CONFIG.DRAWBACKFIELD",
		hint: "CONFIG.DRAWBACKFIELD_DESC",
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showAppearanceField", {
		name: "CONFIG.APPEARANCEFIELD",
		hint: "CONFIG.APPEARANCEFIELD_DESC",
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
});

Hooks.once("ready", () => {
	migrateWorld();
	initializeCalendar();
	registerHooks();
});

Hooks.once("diceSoNiceReady", (dice3d) => {
	registerDiceSoNice(dice3d);
});

Hooks.on("renderItemSheet", function (app, html) {
	html.find("textarea").each(function () {
		if (this.value) {
			this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
			this.readOnly = true;
		}
	});
	app._element[0].style.height = "auto";
});

Hooks.on("renderChatMessage", async (app, html) => {
	// Add drag and drop functonality to posted items
	let postedItem = html.find(".chat-item")[0];
	if (postedItem) {
		postedItem.classList.add("draggable");
		postedItem.setAttribute("draggable", true);
		postedItem.addEventListener("dragstart", (ev) => {
			ev.dataTransfer.setData(
				"text/plain",
				JSON.stringify({
					item: app.getFlag("forbidden-lands", "itemData"),
					type: "itemDrop",
				}),
			);
		});
	}
});
