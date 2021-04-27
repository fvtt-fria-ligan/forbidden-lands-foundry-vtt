class JSONPicker extends FilePicker {
	// Override
	_onSubmit(event) {
		game.settings.set("forbidden-lands", "datasetDirSet", true);
		super._onSubmit(event);
	}
	// Override
	static fromButton(button, _options) {
		if (!(button instanceof HTMLElement)) throw "You must pass an HTML button";
		let type = button.getAttribute("data-type");

		let form = button.form,
			target = form[button.getAttribute("data-target")];
		if (!target) return;

		return new JSONPicker({ field: target, type: type, current: target.value, button: button });
	}
}

Hooks.on("renderSettingsConfig", (_app, html, _user) => {
	const filePickerButton = $(
		`<button type="button" class="file-picker" title="Select Custom Dataset" data-type="JSON" data-target="forbidden-lands.datasetDir"><i class="fas fa-file-import fa-fw"></i></button>`,
	);
	filePickerButton.on("click", function () {
		const picker = JSONPicker.fromButton(this);
		return picker.render(true);
	});
	const resetButton = $(
		`<button type="button" class="file-picker" title="Reset to default dataset"><i class="fas fa-undo"></i></button>`,
	);
	resetButton.on("click", function () {
		game.settings.set("forbidden-lands", "datasetDirSet", false);
		ui.notifications.notify(game.i18n.localize("FLCG.SETTINGS.RESET_DIR"));
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
	game.settings.register("forbidden-lands", "datasetDirSet", {
		name: "Custom File Set",
		hint: "This is a boolean used to track whether a custom dir is set.",
		scope: "world",
		config: false,
		default: false,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "datasetDir", {
		name: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR"),
		hint: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR_HINT"),
		scope: "world",
		config: true,
		default: `/systems/forbidden-lands/assets/datasets/chargen/dataset.json`,
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
