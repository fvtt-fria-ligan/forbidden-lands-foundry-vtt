export class ForbiddenLandsJournalEntry extends JournalEntry {
	constructor(data, options) {
		super(data, options);
		this.data.type = this.type;
	}

	static async create(data, options) {
		data.flags = {
			"forbidden-lands": { type: data.type },
		};
		const path = CONFIG.fbl.adventureSites?.types[data.type];
		data.content = await CONFIG.fbl.adventureSites?.generate(path, data.type);
		super.create(data, options);
	}

	get type() {
		return this.getFlag("forbidden-lands", "type");
	}
}
