export class AdventureSitesSheet extends JournalSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["journal-sheet", "adventure-sites"],
			scrollY: [".editor-content"],
		});
	}

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
		html.find(".add-room").on("click", async () => {
			const type = this.object.type;
			const path = CONFIG.fbl.adventureSites.types[type];
			const room = await CONFIG.fbl.adventureSites?.generate(path, type + "_rooms");
			await this.object.update({ content: this.object.data.content.concat(room) });
			console.log(this);
			const editor = this.element.find(".editor-content");
			editor.animate({ scrollTop: editor.prop("scrollHeight") }, 500);
		});

		const rooms = html.find(".room");

		rooms.on("mouseover", (event) => {
			const el = event.currentTarget;
			if (el.classList.contains("selected")) return;
			const index = Array.from(rooms).indexOf(el);
			const indexTip = document.createElement("div");
			indexTip.classList.add("index-tip");
			indexTip.innerHTML = `${index + 1}`;
			el.appendChild(indexTip);
		});
		rooms.on("mouseout", (event) => {
			const el = event.currentTarget;
			if (el.classList.contains("selected")) return;
			$(el).find(".index-tip").remove();
		});
	}
}
