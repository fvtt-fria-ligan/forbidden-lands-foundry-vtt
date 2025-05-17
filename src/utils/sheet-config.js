const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ActorSheetConfig extends HandlebarsApplicationMixin(
	ApplicationV2,
) {
	constructor(options = {}) {
		super(options);
		this.document = options.document;

		// Set dynamic title based on actor name
		const actorName = this.document.name;
		const configTitle =
			game.i18n.localize("CONFIG.ACTOR_SHEET_CONFIG.TITLE") ||
			"Sheet Configuration";
		this.options.window.title = `${actorName}: ${configTitle}`;
	}

	static DEFAULT_OPTIONS = {
		tag: "form",
		classes: ["application", "sheet", "sheet-config"],
		form: {
			handler: ActorSheetConfig.myFormHandler,
			submitOnChange: false,
			closeOnSubmit: true,
		},
		window: {
			icon: "fa-solid fa-gear",
			contentClasses: ["standard-form"],
		},
		position: {
			width: 500,
			height: "auto",
		},
	};

	static PARTS = {
		body: {
			template:
				"systems/forbidden-lands/templates/components/sheet-config-modal.hbs",
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	};

	async _prepareContext(options) {
		const documentName = this.document.documentName;
		const allSheetClasses = CONFIG[documentName]?.sheetClasses || {};

		const actorType = this.document.type || "character";

		const relevantSheetClasses = allSheetClasses[actorType] || {};

		console.log("actorType:", actorType);
		console.log("relevantSheetClasses:", relevantSheetClasses);

		return {
			document: this.document,
			types: CONFIG.fbl.characterSubtype,
			sheetClasses: relevantSheetClasses,
			sheetClass: this.document._sheetClass,
			defaultClass: CONFIG[documentName]?.sheetClass,
			isGM: game.user.isGM,
			blankLabel: game.i18n.localize("None"),
			type: documentName,
			editable: true,
			buttons: [
				{
					type: "submit",
					icon: "fa-solid fa-save",
					label: "SHEETS.Save",
				},
			],
		};
	}

	static async myFormHandler(event, form, formData) {
		const updateData = foundry.utils.expandObject(formData.object);
		await this.document.update(updateData);
	}
}
