import {
	ForbiddenLandsActor,
	ForbiddenLandsItem,
} from "./actor/forbidden-lands.js";
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
		hint:
			"Used to automatically upgrade worlds data when the system is upgraded.",
		scope: "world",
		config: true,
		default: 0,
		type: Number,
	});
	game.settings.register("forbidden-lands", "alternativeSkulls", {
		name: "Alternative Sheet Interaction",
		hint:
			"Changes the look and interaction of Attribute/Bonus/Willpower radio buttons in the Character, Monster and Item sheets.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showCraftingFields", {
		name: "Show crafting fields",
		hint: "Used to show or hide crafting related fields on item sheets.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showCostField", {
		name: "Show cost field",
		hint: "Used to show or hide the cost field on item sheets.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showSupplyField", {
		name: "Show supply field",
		hint: "Used to show or hide the supply field on item sheets.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showEffectField", {
		name: "Show effect field",
		hint: "Used to show or hide the effect field on item sheets.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showDescriptionField", {
		name: "Show description field",
		hint: "Used to show or hide the description field on item sheets.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showDrawbackField", {
		name: "Show drawback field",
		hint: "Used to show or hide the drawback field on item sheets.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "showAppearanceField", {
		name: "Show appearance field",
		hint: "Used to show or hide the appearance field on item sheets.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
});

Hooks.once("ready", () => {
	migrateWorld();
	initializeCalendar();
});

Hooks.once("diceSoNiceReady", (dice3d) => {
	registerDiceSoNice(dice3d);
});

Hooks.on("renderItemSheet", function (app, html) {
	html.find("textarea").each(function () {
		if (this.value) {
			this.setAttribute(
				"style",
				"height:" + this.scrollHeight + "px;overflow-y:hidden;"
			);
			this.readOnly = true;
		}
	});
	app._element[0].style.height = "auto";
});

Hooks.on("renderChatMessage", async (app, html, msg) => {
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
				})
			);
		});
	}
});
