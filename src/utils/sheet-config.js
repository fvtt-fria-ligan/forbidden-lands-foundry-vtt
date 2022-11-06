// eslint-disable-next-line no-undef
export class ActorSheetConfig extends DocumentSheetConfig {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "Configure Actor",
			template: "systems/forbidden-lands/templates/components/sheet-config-modal.hbs",
		});
	}

	getData() {
		return {
			...super.getData(),
			types: CONFIG.fbl.characterSubtype,
		};
	}

	async _updateObject(event, formData) {
		event.preventDefault();
		const original = this.getData({});
		this.object.update(formData);
		if (formData.sheetClass !== original.sheetClass || formData.defaultClass !== original.defaultClass)
			return super._updateObject(event, formData);
	}
}
