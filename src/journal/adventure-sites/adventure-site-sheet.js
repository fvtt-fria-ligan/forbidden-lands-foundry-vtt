export class AdventureSitesSheet extends JournalSheet {
	get template() {
		return "systems/forbidden-lands/templates/journal/adventure-sites/adventure-site-sheet.hbs";
	}

	getData() {
		const data = super.getData();
		data.type = this.object.type;
		return data;
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.find('[data-action="add-room"]').on("click", async () => {
			const type = this.object.type;
			const path = CONFIG.fbl.adventureSites.types[type];
			const room = await CONFIG.fbl.adventureSites?.generate(path, type + "_rooms");
			const pageName = $(room).find("strong").first().text().replace(/\W+/, " ").trim();
			await this.object.createEmbeddedDocuments("JournalEntryPage", [
				{ name: pageName, title: { level: 2, show: false }, text: { content: room } },
			]);
		});
	}
}
