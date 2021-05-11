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
import { BaseDie, GearDie } from "./components/dice.js";

/**
 * We use this label to remove the debug option in production builds. @See rollup.config.js
 */
// eslint-disable-next-line no-unused-labels
hookDebug: CONFIG.debug.hooks = true;
console.warn("HOOKS DEBUG ENABLED: ", CONFIG.debug.hooks);

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
	initializeCalendar();
	migrateWorld();
});

Hooks.once("diceSoNiceReady", (dice3d) => {
	registerDiceSoNice(dice3d);
});

/**
 * Override item sheets as they are rendered.
 */
Hooks.on("renderItemSheet", function (app, html) {
	/**
	 * Render item sheets with read-only textareas.
	 * Also add "height:auto" to container.
	 */
	html.find("textarea").each(function () {
		if (this.value) {
			this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
			this.readOnly = true;
		}
	});
	app._element[0].style.height = "auto";

	/**
	 * Localize sheet header-buttons. These are hardcoded in English in Foundry system.
	 */
	html.find(".close").html(`<i class="fas fa-times"></i>` + game.i18n.localize("SHEET.CLOSE"));
	html.find(".configure-sheet").html(`<i class="fas fa-cog"></i>` + game.i18n.localize("SHEET.CONFIGURE"));
	html.find(".configure-token").html(`<i class="fas fa-user-circle"></i>` + game.i18n.localize("SHEET.TOKEN"));
});

/**
 * Override Actor sheets as they are rendered.
 */
Hooks.on("renderActorSheet", (app, html) => {
	// set "height: auto" to sheet container if party sheet.
	if (app.actor.data.type === "party") app._element[0].style.height = "auto";

	/**
	 * Localize sheet header-buttons. These are hardcoded in English in Foundry system.
	 */
	html.find(".close").html(`<i class="fas fa-times"></i>` + game.i18n.localize("SHEET.CLOSE"));
	html.find(".configure-sheet").html(`<i class="fas fa-cog"></i>` + game.i18n.localize("SHEET.CONFIGURE"));
	html.find(".configure-token").html(`<i class="fas fa-user-circle"></i>` + game.i18n.localize("SHEET.TOKEN"));
});

/**
 * Override chat messages as they are rendered.
 */
Hooks.on("renderChatMessage", async (app, html) => {
	/**
	 * Add drag and drop functonality to posted items
	 */
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

	/**
	 * Add a push button to chat messages.
	 */
	const pushButton = html.find("button.push-roll");
	if (!app.roll) return;
	const rollData = app.data.flags["forbidden-lands"]?.rollData;
	const notPushable =
		app.data.flags["forbidden-lands"]?.pushed ||
		app.permission !== 3 ||
		!app.roll.dice.some((a) => a instanceof BaseDie || a instanceof GearDie) ||
		rollData.isSpell ||
		(rollData.isPushed && !game.settings.get("forbidden-lands", "allowUnlimitedPush"));
	if (notPushable) {
		pushButton.each((_i, b) => {
			b.style.display = "none";
		});
	} else {
		pushButton.on("click", () => {
			const diceRoller = new DiceRoller();
			diceRoller.push(rollData);
			app.update({ flags: { "forbidden-lands.pushed": true } });
		});
	}
});
