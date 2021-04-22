class importDatasetDialog extends FormApplication {
	render() {
		new Dialog(
			{
				title: `Import Custom Dataset`,
				content: `<form autocomplete="off" onsubmit="event.preventDefault();">
					<p class="notes">You may import a dataset from a JSON file.</p>
					<p class="notes">This operation will configure the dataset used in the character generator.</p>
					<div class="form-group">
						<label for="data">Source Data</label>
						<input type="file" name="data" />
					</div>
				</form>`,
				buttons: {
					import: {
						icon: '<i class="fas fa-file-import"></i>',
						label: "Import",
						callback: async (html) => {
							const form = html.find("form")[0];
							if (!form.data.files.length)
								return ui.notifications.error("You did not upload a data file!");
							game.fbl.config.dataset = await readTextFromFile(form.data.files[0]).then((json) =>
								JSON.parse(json),
							);
							return true;
						},
					},
					reset: {
						icon: '<i class="fas fa-undo-alt"></i>',
						label: game.i18n.localize("DIALOG.RESET"),
						callback: () => {
							game.fbl.config.dataset = null;
							return false;
						},
					},
					no: {
						icon: '<i class="fas fa-times"></i>',
						label: "Cancel",
					},
				},
				default: "import",
			},
			{
				width: 400,
			},
		).render(true);
	}
}

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
		scope: "world",
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
	game.settings.registerMenu("forbidden-lands", "datasetDir", {
		name: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR"),
		hint: game.i18n.localize("FLCG.SETTINGS.DATASET_DIR_HINT"),
		icon: "fas fa-file-import",
		restricted: true,
		type: importDatasetDialog,
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
