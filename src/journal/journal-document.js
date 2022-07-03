export class ForbiddenLandsJournalEntry extends JournalEntry {
	// static async create(data, options) {
	// 	if (!data.type || data.type === "base") return super.create(data, options);
	// 	data.flags = {
	// 		"forbidden-lands": { type: data.type },
	// 	};
	// 	const path = CONFIG.fbl.adventureSites?.types[data.type];
	// 	data.content = await CONFIG.fbl.adventureSites?.generate(path, data.type);
	// 	super.create(data, options);
	// }
	// get type() {
	// 	if (!super._getSheetClass()) return "base";
	// 	return this.getFlag("forbidden-lands", "type") || "base";
	// }
}
