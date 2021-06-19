export class ForbiddenLandsActor extends Actor {
	async createEmbeddedDocuments(embeddedName, data, options) {
		// Replace randomized attributes like "[[d6]] days" with a roll
		const newData = deepClone(data);
		const inlineRoll = /\[\[(\/[a-zA-Z]+\s)?([^\]]+)\]\]/gi;
		for (let entity of newData) {
			if (entity.data.data) {
				entity.data.data = Object.entries(entity.data.data).reduce((obj, entries) => {
					let [key, value] = entries;
					let newValue;
					if (typeof value === "string") {
						newValue = value.replace(inlineRoll, (_match, _contents, formula) => {
							const roll = new Roll(formula);
							const result = roll.roll({ async: false }); // This refactor was an attempt at accommodating rolls becoming async. This will require a different solution.
							return result.total;
						});
					}
					return { ...obj, [key]: newValue };
				}, {});
			}
		}
		return super.createEmbeddedDocuments(embeddedName, newData, options);
	}

	/**
	 * Override initializing a character to set default portraits.
	 * @param {object} data object of an initialized character.
	 * @param {object?} options optional object of options.
	 */
	static async create(data, options) {
		if (!data.img) {
			switch (data.type) {
				case "party":
					data.img = "systems/forbidden-lands/assets/fbl-sun.webp";
					break;
				default:
					data.img = `systems/forbidden-lands/assets/fbl-${data.type}.webp`;
					break;
			}
		}
		super.create(data, options);
	}
}

export class ForbiddenLandsItem extends Item {
	async sendToChat() {
		const itemData = deepClone(this.data);
		if (itemData.img.includes("/mystery-man")) {
			itemData.img = null;
		}
		if (game.fbl.config.itemTypes.includes(itemData.type)) itemData[`is${itemData.type.capitalize()}`] = true;
		itemData.hasRollModifiers =
			itemData.data.rollModifiers && Object.values(itemData.data.rollModifiers).length > 0;
		const html = await renderTemplate("systems/forbidden-lands/templates/chat/item.hbs", itemData);
		const chatData = {
			user: game.userId,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
		};
		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		} else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		const message = await ChatMessage.create(chatData);
		await message.setFlag("forbidden-lands", "itemData", itemData); // Adds posted item data to chat message flags for item drag/drop
	}
}
