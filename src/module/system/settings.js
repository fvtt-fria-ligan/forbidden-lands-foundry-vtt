Hooks.on("renderSettingsConfig", (_app, html, _user) => {
	const filePickerButton = $(
		`<button type="button" class="file-picker" title="Select Custom Dataset" data-type="json" data-target="forbidden-lands.datasetDir"><i class="fas fa-file-import fa-fw"></i></button>`,
	);
	filePickerButton.on("click", function () {
		const picker = FilePicker.fromButton(this);
		return picker.render(true);
	});
	const resetButton = $(
		`<button type="button" class="file-picker" title="Reset to default dataset"><i class="fas fa-undo"></i></button>`,
	);
	resetButton.on("click", function () {
		this.previousElementSibling.value = "";
		this.blur();
	});

	const target = html.find("input[data-dtype='String'");
	const { name } = target[0];
	const parent = target.parent();

	if (name !== "forbidden-lands.datasetDir") return;

	parent.append([resetButton, filePickerButton]);
});

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
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "datasetDir", {
		name: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR"),
		hint: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR_HINT"),
		scope: "world",
		config: true,
		default: "",
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
