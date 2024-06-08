import localizeString from "../utils/localize-string.js";
import { objectSearch } from "../utils/object-search.js";

export class ForbiddenLandsItem extends Item {
	get ammo() {
		return this.itemProperties.ammo;
	}
	get artifactDie() {
		return this.itemProperties.artifactBonus;
	}

	get bonus() {
		return this.itemProperties.bonus?.value;
	}

	get damage() {
		return this.itemProperties.damage;
	}

	get category() {
		return this.itemProperties.category;
	}

	get itemProperties() {
		return this.system;
	}

	get isBroken() {
		return this.bonus <= 0 && this.itemProperties.bonus.max > 0;
	}

	get parryPenalty() {
		if (
			this.category === "melee" &&
			!this.itemProperties.features?.parrying &&
			!this.itemProperties.features?.shield
		)
			return CONFIG.fbl.actionModifiers.parry;
		return 0;
	}

	get range() {
		return this.itemProperties.range;
	}

	get rollModifiers() {
		return this.itemProperties.rollModifiers;
	}

	get state() {
		return this.getFlag("forbidden-lands", "state") || "";
	}

	/* Override */
	getRollData() {
		return {
			ammo: this.ammo,
			artifactDie: this.artifactDie,
			value: this.bonus || 0,
			category: this.category,
			damage: this.damage || 0,
			isBroken: this.isBroken,
			itemId: this.id,
			label: this.name,
			name: this.name,
			range: this.range,
			type: this.type,
		};
	}

	getRollModifier(...rollIdentifiers) {
		if (foundry.utils.getType(this.rollModifiers) !== "Object") return;
		const modifiers = Object.values(this.rollModifiers).reduce((array, mod) => {
			const match = rollIdentifiers.includes(
				objectSearch(CONFIG.fbl.i18n, mod.name),
			);
			const state = this.getFlag("forbidden-lands", "state");
			const isCarriedOrTalent =
				state === "equipped" ||
				state === "carried" ||
				!CONFIG.fbl.carriedItemTypes.includes(this.type);
			if (match && isCarriedOrTalent) {
				let value;

				if (mod.gearBonus) value = Number(this.bonus);
				else if (mod.value.match(/\d*d(?:8|10|12)/i))
					value = mod.value.replace(/^\+/, "");
				else value = Number(mod.value);

				if (value)
					array.push({
						name: this.name,
						value: typeof value === "number" ? value.toFixed() : value,
						id: this.id,
						type: this.type,
						gearBonus: mod.gearBonus,
						active: value < 0,
					});
			}
			return array;
		}, []);

		if (
			rollIdentifiers.includes("parry") &&
			rollIdentifiers.includes(this.id)
		) {
			if (this.parryPenalty)
				modifiers.push({
					name: localizeString("WEAPON.FEATURES.PARRYING"),
					value: this.parryPenalty,
					active: true,
				});
			if (this.itemProperties.features?.shield) {
				modifiers.push({
					name: localizeString("ROLL.PARRY_NON_SLASH"),
					value: 2,
				});
			} else {
				modifiers.push({
					name: localizeString("ROLL.PARRY_STAB"),
					value: -2,
				});
				modifiers.push({
					name: localizeString("ROLL.PARRY_PUNCH"),
					value: 2,
				});
			}
		}

		return modifiers;
	}

	async sendToChat() {
		const itemData = this.toObject();
		if (itemData.img.includes("/mystery-man")) {
			itemData.img = null;
		}
		if (CONFIG.fbl.itemTypes.includes(itemData.type))
			itemData[`is${itemData.type.capitalize()}`] = true;
		itemData.showField = {};
		for (const field of ["Appearance", "Description", "Drawback", "Effect"]) {
			if (
				itemData.system[field.toLowerCase()] &&
				!this.getFlag("forbidden-lands", field)
			)
				itemData.showField[field.toLowerCase()] = true;
		}
		itemData.hasRollModifiers =
			itemData.system.rollModifiers &&
			Object.values(itemData.system.rollModifiers).filter(
				(mod) => !mod.gearBonus,
			).length > 0;
		const html = await renderTemplate(
			"systems/forbidden-lands/templates/components/item-chatcard.hbs",
			itemData,
		);
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
		if (itemData.isCriticalInjury) {
			const content = $(message.data.content);
			const limit = content.find("[data-type='limit']").text().trim();
			const healingTime = content.find("[data-type='healtime']").text().trim();
			itemData.system.limit = limit;
			itemData.system.healingTime = healingTime;
		}
		await message.setFlag("forbidden-lands", "itemData", itemData); // Adds posted item data to chat message flags for item drag/drop
	}

	/**
	 * Override initializing a character to set default portraits.
	 * @param {object} data object of an initialized character.
	 * @param {object?} options optional object of options.
	 */
	static async create(data, options) {
		if (!data.img) {
			switch (data.type) {
				case "building":
					data.img = "icons/svg/castle.svg";
					break;
			}
		}
		return super.create(data, options);
	}
}
