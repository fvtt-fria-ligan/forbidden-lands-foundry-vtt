import { Changelog } from "$changelog/changelog.js";
import localizeString from "@utils/localize-string.js";

// Add additional buttons to the Chargen dataset filepicker
Hooks.on("renderSettingsConfig", (_app, html, _user) => {
	const target = html.find('input[name="forbidden-lands.datasetDir"]')[0];
	if (!target) return;

	const targetParent = target.previousElementSibling;

	const resetButton = $(
		`<button type="button" class="file-picker" data-tooltip="${localizeString(
			"FLCG.SETTINGS.RESET",
		)}"><i class="fas fa-undo"></i></button>`,
	);
	resetButton.on("click", function () {
		target.value = "";
		this.blur();
	});
	const experimentalButton = $(
		`<button type="button" class="file-picker" data-tooltip="${localizeString(
			"FLCG.SETTINGS.RFP_SET",
		)}"><i class="fas fa-flask"></i></button>`,
	);
	experimentalButton.on("click", function () {
		target.value =
			"systems/forbidden-lands/assets/datasets/chargen/dataset-experimental.json";
		this.blur();
	});

	targetParent.after(experimentalButton[0], resetButton[0]);
});

export class TableConfigMenu extends FormApplication {
	#resolve = null;
	#promise = new Promise((resolve) => {
		this.#resolve = resolve;
	});

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template:
				"systems/forbidden-lands/templates/components/tables-config.hbs",
			classes: ["tables-config"],
			title: "CONFIG.TABLE_CONFIG.TITLE",
			submitOnClose: false,
		});
	}

	async getData() {
		const data = await super.getData();
		const mishapConfig = game.settings.get("forbidden-lands", "mishapTables");
		const encounterConfig = game.settings.get(
			"forbidden-lands",
			"encounterTables",
		);
		const otherConfig = game.settings.get("forbidden-lands", "otherTables");
		const mishapKeys = CONFIG.fbl.mishapTables;
		const encounterKeys = CONFIG.fbl.encounterTables;
		const otherKeys = CONFIG.fbl.otherTables;
		data.mishapTables = mishapKeys.map((key) => ({
			key,
			name: localizeString(key),
			id: mishapConfig[key],
		}));
		data.encounterTables = encounterKeys.map((key) => ({
			key,
			name: localizeString(key),
			id: encounterConfig[key],
		}));
		data.otherTables = otherKeys.map((key) => ({
			key,
			name: localizeString(key),
			id: otherConfig[key],
		}));

		data.tables = (() => {
			const selectOptions = {};
			const tree = game.tables.directory.folders;
			for (const folder of tree) {
				const options =
					folder.contents?.map(
						(table) => `<option value="${table.id}">${table.name}</option>`,
					) ?? null;
				if (options.length > 0) {
					if (selectOptions[folder.name]) {
						selectOptions[folder.name] += options;
					} else {
						const property = `<optgroup label="${folder.name}">${options}`;
						selectOptions[folder.name] = property;
					}
				}
			}
			return Object.values(selectOptions).join("");
		})();
		return data;
	}

	_updateObject(_event, formData) {
		const tables = Object.entries(formData).reduce((acc, [key, value]) => {
			const [tableType, tableKey] = key.split("_");
			if (!acc[tableType]) acc[tableType] = {};
			acc[tableType][tableKey] = value;
			return acc;
		}, {});

		game.settings.set("forbidden-lands", "mishapTables", tables.mishap);
		game.settings.set("forbidden-lands", "encounterTables", tables.encounter);
		game.settings.set("forbidden-lands", "otherTables", tables.other);
	}

	async render(force, context = {}) {
		await super.render(force, context);
		return this.#promise;
	}

	async close(...args) {
		await super.close(...args);
		this.#resolve();
	}
}

export class SheetConfigMenu extends FormApplication {
	#resolve = null;
	#promise = new Promise((resolve) => {
		this.#resolve = resolve;
	});

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "systems/forbidden-lands/templates/components/sheet-config.hbs",
			classes: ["sheet-config"],
			title: "CONFIG.SHEET_CONFIG.TITLE",
			submitOnClose: false,
		});
	}

	async getData() {
		const data = await super.getData();
		const config = {
			showCraftingFields: "CONFIG.CRAFTINGFIELD",
			showCostField: "CONFIG.COSTFIELD",
			showSupplyField: "CONFIG.SUPPLYFIELD",
			showEffectField: "CONFIG.EFFECTFIELD",
			showDescriptionField: "CONFIG.DESCRIPTIONFIELD",
			showDrawbackField: "CONFIG.DRAWBACKFIELD",
			showAppearanceField: "CONFIG.APPEARANCEFIELD",
		};
		data.config = Object.entries(config).map(([key, label]) => ({
			key,
			label: localizeString(label),
			description: localizeString(`${label}_DESC`),
			checked: game.settings.get("forbidden-lands", key),
		}));

		return data;
	}

	_updateObject(_event, formData) {
		for (const [key, value] of Object.entries(formData)) {
			game.settings.set("forbidden-lands", key, value);
		}
	}

	async render(force, context = {}) {
		await super.render(force, context);
		return this.#promise;
	}

	async close(...args) {
		await super.close(...args);
		this.#resolve();
	}
}

export default function registerSettings() {
	/* -------------------------------------------- */
	/*  Not Visible                                 */
	/* -------------------------------------------- */
	game.settings.register("forbidden-lands", "worldSchemaVersion", {
		name: "World Version",
		hint: "Used to automatically upgrade worlds data when the system is upgraded.",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register("forbidden-lands", "configuredYZEC", {
		name: "YZEC Configured",
		hint: "Used to track if the YZEC has been configured.",
		scope: "world",
		config: false,
		default: false,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "messages", {
		name: "Displayed Messages",
		hint: "Used to track which messages have been displayed.",
		scope: "world",
		config: false,
		default: [],
		type: Array,
	});

	game.settings.register("forbidden-lands", "showCraftingFields", {
		name: "CONFIG.CRAFTINGFIELD",
		hint: "CONFIG.CRAFTINGFIELD_DESC",
		scope: "client",
		config: false,
		default: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "showCostField", {
		name: "CONFIG.COSTFIELD",
		hint: "CONFIG.COSTFIELD_DESC",
		scope: "client",
		config: false,
		default: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "showSupplyField", {
		name: "CONFIG.SUPPLYFIELD",
		hint: "CONFIG.SUPPLYFIELD_DESC",
		scope: "client",
		config: false,
		default: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "showEffectField", {
		name: "CONFIG.EFFECTFIELD",
		hint: "CONFIG.EFFECTFIELD_DESC",
		scope: "client",
		config: false,
		default: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "showDescriptionField", {
		name: "CONFIG.DESCRIPTIONFIELD",
		hint: "CONFIG.DESCRIPTIONFIELD_DESC",
		scope: "client",
		config: false,
		default: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "showDrawbackField", {
		name: "CONFIG.DRAWBACKFIELD",
		hint: "CONFIG.DRAWBACKFIELD_DESC",
		scope: "client",
		config: false,
		default: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "showAppearanceField", {
		name: "CONFIG.APPEARANCEFIELD",
		hint: "CONFIG.APPEARANCEFIELD_DESC",
		scope: "client",
		config: false,
		default: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "mishapTables", {
		name: "Mishap Tables",
		scope: "world",
		config: false,
		default: {},
	});

	game.settings.register("forbidden-lands", "encounterTables", {
		name: "Encounter Tables",
		scope: "world",
		config: false,
		default: {},
	});

	game.settings.register("forbidden-lands", "otherTables", {
		name: "Other Tables",
		scope: "world",
		config: false,
		default: {},
	});

	/* -------------------------------------------- */
	/*  Menus (Always go on top)                    */
	/* -------------------------------------------- */
	game.settings.registerMenu("forbidden-lands", "changelog", {
		name: "CONFIG.CHANGELOG",
		hint: "CONFIG.CHANGELOG_DESC",
		label: "CONFIG.CHANGELOG_LABEL",
		icon: "fas fa-book",
		type: Changelog,
	});

	game.settings.registerMenu("forbidden-lands", "tableConfigMenu", {
		name: "CONFIG.TABLE_CONFIG_MENU",
		hint: "CONFIG.TABLE_CONFIG_MENU_DESC",
		label: "CONFIG.TABLE_CONFIG_MENU_LABEL",
		icon: "fas fa-th-list",
		type: TableConfigMenu,
		restricted: true,
	});

	game.settings.registerMenu("forbidden-lands", "sheetConfigMenu", {
		name: "CONFIG.SHEET_CONFIG_MENU",
		hint: "CONFIG.SHEET_CONFIG_MENU_DESC",
		label: "CONFIG.SHEET_CONFIG_MENU_LABEL",
		icon: "fas fa-scroll",
		type: SheetConfigMenu,
	});

	/* -------------------------------------------- */
	/*  Visible                                     */
	/* -------------------------------------------- */
	if (Number(game.version?.slice(0, 2)) < 12)
		game.settings.register("forbidden-lands", "darkmode", {
			name: "SETTINGS.DARKMODE",
			hint: "SETTINGS.DARKMODE_HINT",
			scope: "client",
			config: true,
			default: false,
			requiresReload: true,
			type: Boolean,
		});

	game.settings.register("forbidden-lands", "removeBorders", {
		name: "SETTINGS.REMOVEBORDERS",
		hint: "SETTINGS.REMOVEBORDERS_HINT",
		scope: "client",
		config: true,
		default: false,
		requiresReload: true,
		type: Boolean,
	});

	// Sheet Settings
	game.settings.register("forbidden-lands", "collapseSheetHeaderButtons", {
		name: "CONFIG.COLLAPSE_SHEET_HEADER_BUTTONS",
		hint: "CONFIG.COLLAPSE_SHEET_HEADER_BUTTONS_DESC",
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
		requiresReload: true,
	});

	game.settings.register("forbidden-lands", "alternativeSkulls", {
		name: "CONFIG.ALTERNATIVESKULLS",
		hint: "CONFIG.ALTERNATIVESKULLS_DESC",
		scope: "client",
		config: true,
		default: false,
		requiresReload: true,
		type: Boolean,
	});

	// Homebrew Settings
	game.settings.register("forbidden-lands", "useHealthAndResolve", {
		name: "CONFIG.HEALTHANDRESOLVE",
		hint: "CONFIG.HEALTHANDRESOLVE_DESC",
		scope: "client",
		config: true,
		default: false,
		requiresReload: true,
		type: Boolean,
	});

	game.settings.register("forbidden-lands", "maxInit", {
		name: "CONFIG.MAX_INIT",
		hint: "CONFIG.MAX_INIT_DESC",
		scope: "world",
		config: true,
		default: 10,
		onChange: (value) => {
			CONFIG.fbl.maxInit = value;
		},
		type: Number,
	});

	game.settings.register("forbidden-lands", "autoDecreaseConsumable", {
		name: "CONFIG.AUTO_DECREASE_CONSUMABLE",
		hint: "CONFIG.AUTO_DECREASE_CONSUMABLE_DESC",
		config: true,
		default: 2,
		type: Number,
	});

	game.settings.register("forbidden-lands", "datasetDir", {
		name: "FLCG.SETTINGS.DATASET",
		hint: "FLCG.SETTINGS.DATASET_HINT",
		scope: "world",
		config: true,
		default: "",
		filePicker: "json",
		type: String,
	});
}
