import { ForbiddenLandsActor } from "@actor/actor-document.js";
import { importMacros } from "@components/macros/macros.js";
import displayMessages from "@components/message-system.js";
import {
	ForbiddenLandsD6,
	registerYZURLabels,
} from "@components/roll-engine/dice-labels";
import { FBLRollHandler } from "@components/roll-engine/engine.js";
import { ForbiddenLandsItem } from "@item/item-document.js";
import {
	init,
	utilities,
} from "@journal/adventure-sites/adventure-site-generator.js";
import FBL, { modifyConfig } from "@system/core/config.js";
import { initializeEditorEnrichers } from "@system/core/editor.js";
import { registerFonts } from "@system/core/fonts.js";
import FoundryOverrides from "@system/core/foundry-overrides.js";
import { initializeHandlebars } from "@system/core/handlebars.js";
import registerHooks from "@system/core/hooks.js";
import { migrateWorld } from "@system/core/migration.js";
import registerSettings from "@system/core/settings.js";
import { registerSheets } from "@system/core/sheets.js";
import localizeString from "@utils/localize-string.js";
import { YearZeroRollManager } from "foundry-year-zero-roller";
import { ForbiddenLandsTokenHUD } from "@system/core/hud.js";

/**
 * We use this label to remove the debug option in production builds.
 * @See rollup.config.js
 */
/* @__PURE__ */ (async () => {
	CONFIG.debug.hooks = true;
	const tests = await import("./tests/foundry-scripts");
	CONFIG.tests = tests.default;
	console.warn("HOOKS DEBUG ENABLED: ", CONFIG.debug.hooks);
})();

Hooks.once("init", () => {
	FoundryOverrides(); // Initialize Foundry Overrides
	registerSettings();
	registerHooks();
	game.fbl = {
		config: FBL,
		roll: FBLRollHandler.createRoll,
	};

	CONFIG.Actor.documentClass = ForbiddenLandsActor;
	CONFIG.Item.documentClass = ForbiddenLandsItem;
	CONFIG.statusEffects = [
		...CONFIG.statusEffects.filter(
			(effect) => !["sleep", "frozen", "curse"].includes(effect.id),
		),
		...FBL.statusEffects,
	];
	CONFIG.fbl = FBL;
	CONFIG.fbl.adventureSites.utilities = utilities;
	CONFIG.fbl.adventureSites.generate = (path: string, adventureSite: unknown) =>
		init(path, adventureSite);
	YearZeroRollManager.register("fbl", {
		"ROLL.chatTemplate":
			"systems/forbidden-lands/templates/components/roll-engine/roll.hbs",
		"ROLL.tooltipTemplate":
			"systems/forbidden-lands/templates/components/roll-engine/tooltip.hbs",
		"ROLL.infosTemplate":
			"systems/forbidden-lands/templates/components/roll-engine/infos.hbs",
	});
	CONFIG.Dice.terms["6"] = ForbiddenLandsD6;
	registerYZURLabels();
	registerSheets();
	initializeHandlebars();
	initializeEditorEnrichers();
	registerFonts();
	modifyConfig();

	// Remove borders if the setting is enabled
	if (game.settings.get("forbidden-lands", "removeBorders"))
		$("html").addClass("no-borders");

	if (game.settings.get("forbidden-lands", "darkmode"))
		$("body").addClass("theme-dark");
});

Hooks.once("ready", () => {
	migrateWorld();
	displayMessages();
	importMacros();

	// Only add the context menu to decrease consumables if consumables aren't automatically handled.
	if (game.settings.get("forbidden-lands", "autoDecreaseConsumable") === 0)
		Hooks.on("getChatLogEntryContext", (_html, options) => {
			const isConsumableRoll: ContextOptionCondition = (li) =>
				!!li.find(".consumable-result").length;

			options.push({
				name: localizeString("CONTEXT.REDUCE_CONSUMABLE"),
				icon: "<i class='fas fa-arrow-down'></i>",
				condition: isConsumableRoll,
				callback: (li) =>
					FBLRollHandler.decreaseConsumable(li.attr("data-message-id") || ""),
			});
		});
});

Hooks.on("canvasReady", (canvas) => {
	canvas.hud.token = new ForbiddenLandsTokenHUD();
});
