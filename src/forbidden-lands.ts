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
	const statusEffects: Array<StatusEffect> = [
		{
			id: "sleepy",
			icon: "icons/svg/unconscious.svg",
			label: "CONDITION.SLEEPY",
			changes: [
				{
					key: "system.condition.sleepy.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["sleepy"],
		},
		{
			id: "thirsty",
			icon: "icons/svg/tankard.svg",
			label: "CONDITION.THIRSTY",
			changes: [
				{
					key: "system.condition.thirsty.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["thirsty"],
		},
		{
			id: "hungry",
			icon: "icons/svg/sun.svg",
			label: "CONDITION.HUNGRY",
			changes: [
				{
					key: "system.condition.hungry.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["hungry"],
		},
		{
			id: "cold",
			icon: "icons/svg/frozen.svg",
			label: "CONDITION.COLD",
			changes: [
				{
					key: "system.condition.cold.value",
					mode: 5,
					value: true,
				},
			],
			statuses: ["cold"],
		},
		{
			id: "fastAction",
			icon: "modules/yze-combat/assets/icons/fast-action.svg",
			label: "COMBAT.TOGGLE_FAST",
			flags: {
				"forbidden-lands": {
					fast: true,
				},
			},
		},
		{
			id: "slowAction",
			icon: "modules/yze-combat/assets/icons/slow-action.svg",
			label: "COMBAT.TOGGLE_SLOW",
			flags: {
				"forbidden-lands": {
					slow: true,
				},
			},
		},
	];
	CONFIG.Actor.documentClass = ForbiddenLandsActor;
	CONFIG.Combat.documentClass = FBLCombat;
	// @ts-expect-error - PF2 types Internal Type Error
	CONFIG.Combatant.documentClass = FBLCombatant;
	CONFIG.Item.documentClass = ForbiddenLandsItem;
	// @ts-expect-error - PF2 types Internal Type Error
	CONFIG.JournalEntry.documentClass = ForbiddenLandsJournalEntry;
	// @ts-expect-error - PF2 types Internal Type Error
	CONFIG.ui.combat = FBLCombatTracker;
	CONFIG.statusEffects = statusEffects;
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
		Hooks.on("getChatLogEntryContext", function (_html, options) {
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
