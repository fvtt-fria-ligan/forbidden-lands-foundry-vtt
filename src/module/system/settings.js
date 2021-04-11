export default function registerSettings() {
	game.settings.register("forbidden-lands", "worldSchemaVersion", {
		name: "World Version",
		hint: "Used to automatically upgrade worlds data when the system is upgraded.",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});
	game.settings.register("forbidden-lands", "allowTravelRollPush", {
		name: game.i18n.localize("FLPS.SETTINGS.ALLOW_PUSH"),
		hint: game.i18n.localize("FLPS.SETTINGS.ALLOW_PUSH_HINT"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "datasetDir", {
		name: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR"),
		hint: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR_HINT"),
		scope: "world",
		config: true,
		default: "systems/forbidden-lands/assets",
		type: window.Azzu.SettingsTypes.DirectoryPicker,
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
}
