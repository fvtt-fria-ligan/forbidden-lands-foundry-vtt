export class ForbiddenLandsActor extends Actor {
	createEmbeddedEntity(embeddedName, data, options): any /*this will eventually be ironed out */ {
		// Replace randomized attributes like "[[d6]] days" with a roll
		let newData = duplicate(data);
		const inlineRoll = /\[\[(\/[a-zA-Z]+\s)?([^\]]+)\]\]/gi;
		if (newData.data) {
			for (let key of Object.keys(newData.data)) {
				if (typeof newData.data[key] === "string") {
					newData.data[key] = newData.data[key].replace(
						inlineRoll,
						(match, contents, formula) => new Roll(formula).roll().total,
					);
				}
			}
		}
		return super.createEmbeddedEntity(embeddedName, newData, options);
	}
}

export class ForbiddenLandsItem extends Item {
	async sendToChat() {
		const itemData: any /*this will eventually be ironed out */ = duplicate(this.data);
		if (itemData.img.includes("/mystery-man")) {
			itemData.img = null;
		}
		itemData.isArmor = itemData.type === "armor";
		itemData.isBuilding = itemData.type === "building";
		itemData.isCriticalInjury = itemData.type === "criticalInjury";
		itemData.isGear = itemData.type === "gear";
		itemData.isHireling = itemData.type === "hireling";
		itemData.isMonsterAttack = itemData.type === "monsterAttack";
		itemData.isMonsterTalent = itemData.type === "monsterTalent";
		itemData.isRawMaterial = itemData.type === "rawMaterial";
		itemData.isSpell = itemData.type === "spell";
		itemData.isTalent = itemData.type === "talent";
		itemData.isWeapon = itemData.type === "weapon";
		itemData.hasRollModifiers =
			itemData.data.rollModifiers && Object.values(itemData.data.rollModifiers).length > 0;
		const html = await renderTemplate("systems/forbidden-lands/template/chat/item.hbs", itemData);
		const chatData: any /* this will eventually be ironed out */ = {
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
