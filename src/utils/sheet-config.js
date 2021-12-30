export class ActorSheetConfig extends EntitySheetConfig {
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
		if (formData.sheetClass !== original.sheetClass || formData.defaultClass !== original.defaultClass)
			return super._updateObject(event, formData);
		this.object.update(formData);
	}
}
