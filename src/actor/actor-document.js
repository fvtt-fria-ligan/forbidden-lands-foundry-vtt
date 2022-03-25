import localize from "@utils/localize-string.js";

export class ForbiddenLandsActor extends Actor {
	get actorProperties() {
		return this.data.data;
	}

	get attributes() {
		return this.actorProperties.attribute;
	}

	get conditions() {
		return this.actorProperties.condition;
	}

	get consumables() {
		return this.actorProperties.consumable;
	}

	get isBroken() {
		return Object.values(this.attributes).some((attribute) => attribute.value <= 0 && attribute.max > 0);
	}

	get skills() {
		return this.actorProperties.skill;
	}

	get willpower() {
		return this.actorProperties.bio.willpower;
	}

	/* Override */
	getRollData() {
		return {
			alias: this.token?.name || this.name,
			actorId: this.id,
			actorType: this.data.type,
			isBroken: this.isBroken,
			sceneId: this.token?.parent.id,
			tokenId: this.token?.id,
		};
	}

	getRollModifierOptions(...rollIdentifiers) {
		if (!rollIdentifiers.length) return [];
		return this.items.reduce((array, item) => {
			const modifiers = item.getRollModifier(...rollIdentifiers);
			if (modifiers) array = [...array, ...modifiers];
			return array;
		}, []);
	}

	async createEmbeddedDocuments(embeddedName, data, options) {
		// Replace randomized Item.properties like "[[d6]] days" with a roll
		let newData = deepClone(data);
		if (!Array.isArray(newData)) newData = [newData]; // Small technical debt. During redesign of NPC sheet createEmbeddedDocuments needs to be passed an array.
		const inlineRoll = /\[\[([d\d+\-*]+)\]\]/i;
		const createRoll = async ([_match, group]) => {
			const roll = await new Roll(group).roll();
			return roll.total;
		};
		for await (const entity of newData) {
			if (entity.data) {
				entity.data = await Object.entries(entity.data).reduce(async (obj, [key, value]) => {
					if (typeof value === "string" && value.match(inlineRoll)) {
						const result = await createRoll(inlineRoll.exec(value));
						value = value.replace(inlineRoll, result);
					}
					const resolved = await obj;
					return { ...resolved, [key]: value };
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

	rest() {
		const activeConditions = Object.entries(this.conditions).filter(([_, value]) => value.value);
		const isBlocked = (...conditions) =>
			conditions.some((condition) => activeConditions.map(([key, _]) => key).includes(condition));
		const data = {
			attribute: {
				agility: {
					value: isBlocked("thirsty") ? this.attributes.strength.value : this.attributes.agility.max,
				},
				strength: {
					value: isBlocked("thirsty", "cold", "hungry")
						? this.attributes.strength.value
						: this.attributes.strength.max,
				},
				wits: {
					value: isBlocked("thirsty", "cold", "sleepy")
						? this.attributes.strength.value
						: this.attributes.wits.max,
				},
				empathy: {
					value: isBlocked("thirsty") ? this.attributes.empathy.value : this.attributes.empathy.max,
				},
			},
		};
		this.update({ data });
		const formatter = new Intl.ListFormat(game.i18n.lang, { style: "long" });
		ChatMessage.create({
			content: `<div class="forbidden-lands chat-item"><h3>${this.name}</h3><h4>${localize(
				"ACTION.REST",
			)}</h4><p>${this.name} ${localize("CONDITION.SUFFERING_FROM")} ${formatter.format(
				activeConditions.map(([_, value]) => `<b>${localize(value.label)}</b>`),
			)}</p>.</div>`,
			speaker: { actor: this },
		});
	}
}
