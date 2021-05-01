export class ForbiddenLandsActor extends Actor {
	createEmbeddedEntity(embeddedName, data, options) {
		// Replace randomized attributes like "[[d6]] days" with a roll
		const newData = duplicate(data);
		const inlineRoll = /\[\[(\/[a-zA-Z]+\s)?([^\]]+)\]\]/gi;
		if (newData.data) {
			for (const key of Object.keys(newData.data)) {
				if (typeof newData.data[key] === "string") {
					newData.data[key] = newData.data[key].replace(
						inlineRoll,
						(_match, _contents, formula) => new Roll(formula).roll().total,
					);
				}
			}
		}
		return super.createEmbeddedEntity(embeddedName, newData, options);
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
		const itemData = duplicate(this.data);
		if (itemData.img.includes("/mystery-man")) {
			itemData.img = null;
		}
		if (game.fbl.config.itemTypes.includes(itemData.type)) itemData[`is${itemData.type.capitalize()}`] = true;
		itemData.hasRollModifiers =
			itemData.data.rollModifiers && Object.values(itemData.data.rollModifiers).length > 0;
		const html = await renderTemplate("systems/forbidden-lands/templates/chat/item.hbs", itemData);
		const chatData = {
			user: game.user._id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
			["flags.forbidden-lands.itemData"]: this.data, // Adds posted item data to chat message flags for item drag/drop
		};
		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		} else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		ChatMessage.create(chatData);
	}
}
