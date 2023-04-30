export class ForbiddenLandsJournalEntry extends JournalEntry {
	static async create(data, options) {
		if (!data.type || data.type === "base") return super.create(data, options);
		data.flags = {
			"forbidden-lands": { type: data.type },
		};
		const path = CONFIG.fbl.adventureSites?.types[data.type];
		const content = await CONFIG.fbl.adventureSites?.generate(path, data.type);
		data.pages = [{ name: "Overview", title: { show: false }, text: { content } }];
		super.create(data, options);
	}
	get type() {
		const type = this.getFlag("forbidden-lands", "type");
		if (type) return type;
		else return CONST.BASE_DOCUMENT_TYPE;
	}
}
