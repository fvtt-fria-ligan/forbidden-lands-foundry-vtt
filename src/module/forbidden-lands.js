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
import FBL from "./system/config.js";
import registerSettings from "./system/settings.js";

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
	registerSettings();
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
			this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
			this.readOnly = true;
		}
	});
	app._element[0].style.height = "auto";
});

Hooks.on("renderActorSheet", (app, _html) => {
	if (app.actor.data.type === "party") app._element[0].style.height = "auto";
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
	// Push rolls
	const pushButton = html.find("button.push-roll");
	if (app.data.flags["forbidden-lands"]?.pushed || app.permission !== 3) {
		pushButton.each((_i, b) => {
			b.style.display = "none";
		});
	} else {
		pushButton.on("click", () => {
			const diceRoller = new DiceRoller();
			const rollData = app.data.flags["forbidden-lands"].rollData;
			diceRoller.push(rollData);
			app.update({ flags: { "forbidden-lands.pushed": true } });
		});
	}
});
