import { ForbiddenLandsActor } from "@actor/actor-document.js";
import { importMacros } from "@components/macros/macros.js";
import displayMessages from "@components/message-system.js";
import {
	ForbiddenLandsD6,
	registerYZURLabels,
} from "@components/roll-engine/dice-labels";
import { FBLRollHandler } from "@components/roll-engine/engine.js";
import { YearZeroRollManager } from "@components/roll-engine/yzur";
import { ForbiddenLandsItem } from "@item/item-document.js";
import {
	init,
	utilities,
} from "@journal/adventure-sites/adventure-site-generator.js";
import { ForbiddenLandsJournalEntry } from "@journal/journal-document.js";
import {
	FBLCombat,
	FBLCombatTracker,
	FBLCombatant,
} from "@system/combat/combat.js";
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
	CONFIG.Combat.documentClass = FBLCombat;
	CONFIG.Combatant.documentClass = FBLCombatant;
	CONFIG.Item.documentClass = ForbiddenLandsItem;
	CONFIG.JournalEntry.documentClass = ForbiddenLandsJournalEntry;
	CONFIG.ui.combat = FBLCombatTracker;
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

	// Add dark mode class to html tag
	if (game.settings.get("forbidden-lands", "darkmode"))
		$("html").addClass("dark");
});

Hooks.once("ready", () => {
	migrateWorld();
	displayMessages();
	importMacros();

	// Hack to remove monsterTalents from System
	game.system.documentTypes.Item = game.system.documentTypes.Item.filter(
		(type) => type !== "monsterTalent",
	);

	// Only add the context menu to decrease consumables if consumables aren't automatically handled.
	if (game.settings.get("forbidden-lands", "autoDecreaseConsumable") === 0)
		Hooks.on(
			"getChatLogEntryContext",
			function (
				_html: JQuery<HTMLElement>,
				options: {
					name: string;
					icon: string;
					condition: (li: JQuery<HTMLElement>) => void;
					callback: (li: JQuery<HTMLElement>) => Promise<void>;
				}[],
			) {
				const isConsumableRoll = (li: JQuery<HTMLElement>) =>
					li.find(".consumable-result").length;
				options.push({
					name: localizeString("CONTEXT.REDUCE_CONSUMABLE"),
					icon: "<i class='fas fa-arrow-down'></i>",
					condition: isConsumableRoll,
					callback: (li) =>
						FBLRollHandler.decreaseConsumable(li.attr("data-message-id") || ""),
				});
			},
		);
});
