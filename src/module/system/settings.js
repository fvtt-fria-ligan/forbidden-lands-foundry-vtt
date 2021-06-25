Hooks.on("renderSettingsConfig", (_app, html, _user) => {
	const target = html.find('input[name="forbidden-lands.datasetDir"]')[0];
	if (!target) return;

	const targetParent = target.previousElementSibling;

	const resetButton = $(
		`<button type="button" class="file-picker" title="Reset to default dataset"><i class="fas fa-undo"></i></button>`,
	);
	resetButton.on("click", function () {
		target.value = "";
		this.blur();
	});
	const experimentalButton = $(
		`<button type="button" class="file-picker" title="Generator from Reforged Power | Experimental"><i class="fas fa-flask"></i></button>`,
	);
	experimentalButton.on("click", function () {
		target.value = "systems/forbidden-lands/assets/datasets/chargen/dataset-experimental.json";
		this.blur();
	});

	targetParent.before(resetButton[0], experimentalButton[0]);
});

const debouncedReload = foundry.utils.debounce(window.location.reload, 100);

export default function registerSettings() {
	game.settings.register("forbidden-lands", "worldSchemaVersion", {
		name: "World Version",
		hint: "Used to automatically upgrade worlds data when the system is upgraded.",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});
	game.settings.register("forbidden-lands", "messages", {
		name: "Displayed Messages",
		hint: "Used to track which messages have been displayed.",
		scope: "world",
		config: false,
		default: [],
		type: Array,
	});
	game.settings.register("forbidden-lands", "allowUnlimitedPush", {
		name: game.i18n.localize("FLPS.SETTINGS.ALLOW_PUSH"),
		hint: game.i18n.localize("FLPS.SETTINGS.ALLOW_PUSH_HINT"),
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "alternativeSkulls", {
		name: "CONFIG.ALTERNATIVESKULLS",
		hint: "CONFIG.ALTERNATIVESKULLS_DESC",
		scope: "client",
		config: true,
		default: false,
		onChange: debouncedReload,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "datasetDir", {
		name: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR"),
		hint: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR_HINT"),
		scope: "world",
		config: true,
		default: "",
		filePicker: "folder",
		type: String,
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
