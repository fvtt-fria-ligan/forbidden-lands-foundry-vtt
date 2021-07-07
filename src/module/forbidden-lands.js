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
import displayMessages from "./hooks/message-system.js";

/**
 * We use this label to remove the debug option in production builds.
 * @See rollup.config.js
 */
// eslint-disable-next-line no-unused-labels
hookDebug: CONFIG.debug.hooks = true;
console.warn("HOOKS DEBUG ENABLED: ", CONFIG.debug.hooks);

Hooks.once("init", () => {
	game.fbl = {
		config: FBL,
	};
	CONFIG.Combat.initiative = { formula: "1d10", decimals: 0 };
	CONFIG.Actor.documentClass = ForbiddenLandsActor;
	CONFIG.Item.documentClass = ForbiddenLandsItem;
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
	displayMessages();
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

	/**
	 * These are hardcoded in English in Foundry. Bad practice. Thus we fix.
	 */
	html.find(".close").html(`<i class="fas fa-times"></i>` + game.i18n.localize("SHEET.CLOSE"));
	html.find(".configure-sheet").html(`<i class="fas fa-cog"></i>` + game.i18n.localize("SHEET.CONFIGURE"));
	html.find(".configure-token").html(`<i class="fas fa-user-circle"></i>` + game.i18n.localize("SHEET.TOKEN"));
});

Hooks.on("renderActorSheet", (app, html) => {
	if (app.actor.data.type === "party") app._element[0].style.height = "auto";

	html.find(".close").html(`<i class="fas fa-times"></i>` + game.i18n.localize("SHEET.CLOSE"));
	html.find(".configure-sheet").html(`<i class="fas fa-cog"></i>` + game.i18n.localize("SHEET.CONFIGURE"));
	html.find(".configure-token").html(`<i class="fas fa-user-circle"></i>` + game.i18n.localize("SHEET.TOKEN"));
});

Hooks.on("renderChatMessage", async (app, html) => {
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

	const pushButton = html.find("button.push-roll");
	const rollData = app.data.flags["forbidden-lands"]?.rollData;
	if (!rollData) return;
	const notPushable =
		(rollData.isPushed && !game.settings.get("forbidden-lands", "allowUnlimitedPush")) ||
		!app.roll.dice.some((a) => a instanceof BaseDie || a instanceof GearDie) ||
		rollData.isSpell ||
		(!app.isAuthor && !game.user.isGM);
	if (notPushable) {
		pushButton.each((_i, b) => {
			b.style.display = "none";
		});
	} else {
		pushButton.on("click", () => {
			const diceRoller = new DiceRoller();
			diceRoller.push(rollData);
			rollData.isPushed = true;
			app.update({ flags: { "forbidden-lands.rollData": rollData } });
		});
	}
});

/**
 * GM screen module causes buttons in Actor sheets to disable.
 * Undo this, so its possible to roll Attributes, Skills, etc. from GM Screen.
 */
Hooks.on("gmScreenOpenClose", (app, _config) => {
	const html = app.element;
	const buttons = html.find("button");
	buttons.each((_i, button) => {
		button.disabled = false;
	});
});
Hooks.on("renderActorSheet", (app, form, _css) => {
	if (app.cellId?.match(/#gm-screen.+/)) {
		const buttons = form.find("button");
		buttons.each((_i, button) => {
			button.disabled = false;
		});
	}
});
