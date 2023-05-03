import localizeString from "@utils/localize-string.js";

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

const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);

export class TableConfigMenu extends FormApplication {
	#resolve = null;
	#promise = new Promise((resolve) => {
		this.#resolve = resolve;
	});

	constructor(options = {}) {
		super(options);
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			template: "systems/forbidden-lands/templates/components/tables-config.hbs",
			classes: ["tables-config"],
			title: "CONFIG.TABLE_CONFIG.TITLE",
			submitOnClose: false,
		});
	}

	async getData() {
		const data = await super.getData();
		const mishapConfig = game.settings.get("forbidden-lands", "mishapTables");
		const encounterConfig = game.settings.get("forbidden-lands", "encounterTables");
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
					folder.contents?.map((table) => `<option value="${table.id}">${table.name}</option>`) ?? null;
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
	game.settings.register("forbidden-lands", "alternativeSkulls", {
		name: "CONFIG.ALTERNATIVESKULLS",
		hint: "CONFIG.ALTERNATIVESKULLS_DESC",
		scope: "client",
		config: true,
		default: false,
		onChange: debouncedReload,
		type: Boolean,
	});
	game.settings.register("forbidden-lands", "collapseSheetHeaderButtons", {
		name: "CONFIG.COLLAPSE_SHEET_HEADER_BUTTONS",
		hint: "CONFIG.COLLAPSE_SHEET_HEADER_BUTTONS_DESC",
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
		onChange: debouncedReload,
	});
	game.settings.register("forbidden-lands", "datasetDir", {
		name: "FLCG.SETTINGS.DATASET_DIR",
		hint: "FLCG.SETTINGS.DATASET_DIR_HINT",
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
	game.settings.registerMenu("forbidden-lands", "tableConfigMenu", {
		name: "CONFIG.TABLE_CONFIG_MENU",
		hint: "CONFIG.TABLE_CONFIG_MENU_DESC",
		label: "CONFIG.TABLE_CONFIG_MENU_LABEL",
		icon: "fas fa-th-list",
		type: TableConfigMenu,
		restricted: true,
	});
}
