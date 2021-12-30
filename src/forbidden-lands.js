import { ForbiddenLandsActor } from "./actor/actor-document.js";
import { ForbiddenLandsItem } from "./item/item-document.js";
import { registerDiceSoNice } from "./external-api/dice-so-nice.js";
import { initializeHandlebars } from "./system/core/handlebars.js";
import { migrateWorld } from "./system/core/migration.js";
import { registerSheets } from "./system/core/sheets.js";
import FBL from "./system/core/config.js";
import registerSettings from "./system/core/settings.js";
import displayMessages from "./components/message-system.js";
import FoundryOverrides from "./system/core/foundry-overrides.js";
import { YearZeroRollManager } from "./components/roll-engine/yzur";
import { ForbiddenLandsD6, registerYZURLabels } from "./components/roll-engine/dice-labels";
import { FBLRollHandler } from "./components/roll-engine/engine.js";
import localizeString from "./utils/localize-string.js";

/**
 * We use this label to remove the debug option in production builds.
 * @See rollup.config.js
 */
hookDebug: {
	CONFIG.debug.hooks = true;
	const tests = await import("./tests/foundry-scripts");
	CONFIG.debug.tests = tests.default;
}
console.warn("HOOKS DEBUG ENABLED: ", CONFIG.debug.hooks);

Hooks.once("init", () => {
	FoundryOverrides(); // Initialize Foundry Overrides
	game.fbl = {
		config: FBL,
		roll: FBLRollHandler.createRoll,
	};
	CONFIG.Actor.documentClass = ForbiddenLandsActor;
	CONFIG.Combat.initiative = { formula: "1d10", decimals: 0 };
	CONFIG.fbl = FBL;
	CONFIG.Item.documentClass = ForbiddenLandsItem;
	YearZeroRollManager.register("fbl", {
		"ROLL.chatTemplate": "systems/forbidden-lands/templates/components/roll-engine/roll.hbs",
		"ROLL.tooltipTemplate": "systems/forbidden-lands/templates/components/roll-engine/tooltip.hbs",
		"ROLL.infosTemplate": "systems/forbidden-lands/templates/components/roll-engine/infos.hbs",
	});
	CONFIG.Dice.terms["6"] = ForbiddenLandsD6;
	registerYZURLabels();
	registerSheets();
	initializeHandlebars();
	registerSettings();
});

Hooks.on("renderPause", (_app, html) => {
	html.find("img").attr("src", "systems/forbidden-lands/assets/fbl-sun.webp");
});

Hooks.once("ready", () => {
	migrateWorld();
	displayMessages();

	// Hack to remove monsterTalents from System
	game.system.documentTypes.Item = game.system.documentTypes.Item.filter((type) => type !== "monsterTalent");

	// Only add the context menu to decrease consumables if consumables aren't automatically handled.
	if (game.settings.get("forbidden-lands", "autoDecreaseConsumable") === 0)
		Hooks.on("getChatLogEntryContext", function (_html, options) {
			const isConsumableRoll = (li) => li.find(".consumable-result").length;
			options.push({
				name: localizeString("CONTEXT.REDUCE_CONSUMABLE"),
				icon: "<i class='fas fa-arrow-down'></i>",
				condition: isConsumableRoll,
				callback: (li) => FBLRollHandler.decreaseConsumable(li.attr("data-message-id")),
			});
		});
});

Hooks.once("diceSoNiceReady", (dice3d) => {
	registerDiceSoNice(dice3d);
});

/**
 * Registers a custom chat command that lets us listen for either "/fblroll" or "/fblr".
 * The commands take arguments like "2db" or "4ds"
 */
Hooks.on("chatMessage", (_html, content, _msg) => {
	const commandR = new RegExp("^\\/fblr(?:oll)?", "i");
	if (content.match(commandR)) {
		const diceR = new RegExp("(\\d+d(?:[bsng]|8|10|12))", "gi");
		// eslint-disable-next-line no-unused-vars
		const dice = content.match(diceR);
		const data = {
			attribute: { label: "DICE.BASE", value: 0 },
			skill: { label: "DICE.SKILL", value: 0 },
			gear: { label: "DICE.GEAR", value: 0, artifactDie: "" },
		};
		if (dice) {
			for (const term of dice) {
				const [num, deno] = term.split("d");
				const map = {
					b: "attribute",
					s: "skill",
					g: "gear",
				};
				if (map[deno]) data[map[deno]].value += Number(num);
				else data.gear.artifactDie += term;
			}
		}
		FBLRollHandler.createRoll(data);
		return false;
	} else return true;
});

Hooks.on("renderItemSheet", function (app, html) {
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

	if (app.cellId?.match(/#gm-screen.+/)) {
		const buttons = html.find("button");
		buttons.each((_i, button) => {
			button.disabled = false;
		});
	}
});

Hooks.on("renderChatMessage", async (app, html) => {
	const postedItem = html.find(".chat-item")[0];
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

	const pushButton = html.find(".fbl-button.push")[0];
	if (pushButton) {
		pushButton.addEventListener("click", async () => {
			if (app.roll.pushable) {
				await FBLRollHandler.pushRoll(app);

				// If the roll is pushed, we want to remove the button.
				if (game.modules.get("dice-so-nice").active)
					Hooks.once("diceSoNiceRollComplete", () => {
						app.delete();
					});
				else app.delete();
			}
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
