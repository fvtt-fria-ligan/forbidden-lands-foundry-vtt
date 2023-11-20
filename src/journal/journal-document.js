export class ForbiddenLandsJournalEntry extends JournalEntry {
	static async create(data, options) {
		if (!data.type || data.type === "base") return super.create(data, options);
		data.flags = {
			"forbidden-lands": { type: data.type },
		};
		const path = CONFIG.fbl.adventureSites?.types[data.type];
		const content = await CONFIG.fbl.adventureSites?.generate(path, data.type);
		data.pages = [
			{ name: "Overview", title: { show: false }, text: { content } },
		];
		return super.create(data, options);
	}

	get type() {
		const type = this.getFlag("forbidden-lands", "type");
		if (type) return type;
		else return CONST.BASE_DOCUMENT_TYPE;
	}

	// Lifted straight out of Foundry because in V11 it removes the base type from the list of types
	static async createDialog(
		data = {},
		{ parentFolder = null, pack = null, ...options } = {},
	) {
		// Collect data
		const documentName = this.metadata.name;
		const types = game.documentTypes[documentName];
		let folders = [];
		if (!parentFolder) {
			if (pack) folders = game.packs.get(pack).folders.contents;
			else
				folders = game.folders.filter(
					(f) => f.type === documentName && f.displayed,
				);
		}
		const label = game.i18n.localize(this.metadata.label);
		const title = game.i18n.format("DOCUMENT.Create", { type: label });

		// Render the document creation form
		const html = await renderTemplate(
			"templates/sidebar/document-create.html",
			{
				folders,
				name: data.name || game.i18n.format("DOCUMENT.New", { type: label }),
				folder: data.folder,
				hasFolders: folders.length >= 1,
				type: data.type || CONFIG[documentName]?.defaultType || types[0],
				types: types.reduce((obj, t) => {
					const typeLabel = CONFIG[documentName]?.typeLabels?.[t] ?? t;
					obj[t] = game.i18n.has(typeLabel) ? game.i18n.localize(typeLabel) : t;
					return obj;
				}, {}),
				hasTypes: types.length > 1,
			},
		);

		// Render the confirmation dialog window
		return Dialog.prompt({
			title: title,
			content: html,
			label: title,
			callback: (JQhtml) => {
				const form = JQhtml[0].querySelector("form");
				const fd = new FormDataExtended(form);
				foundry.utils.mergeObject(data, fd.object, { inplace: true });
				if (!data.folder) data.folder = undefined;
				if (types.length === 1) data.type = types[0];
				if (!data.name?.trim()) data.name = this.defaultName();
				return this.create(data, {
					parent: parentFolder,
					pack,
					renderSheet: true,
				});
			},
			rejectClose: false,
			options,
		});
	}
}
