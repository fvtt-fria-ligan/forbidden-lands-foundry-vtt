import localize from "@utils/localize-string.js";

export class ForbiddenLandsActor extends Actor {
	get actorProperties() {
		return this.system;
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

	get canAct() {
		return Object.entries(this.attributes).every(
			([key, attribute]) => attribute.value > 0 || attribute.max <= 0 || key === "empathy",
		);
	}

	get skills() {
		return this.actorProperties.skill;
	}

	get willpower() {
		return this.actorProperties.bio?.willpower;
	}

	get unlimitedPush() {
		return this.getFlag("forbidden-lands", "unlimitedPush") ?? false;
	}

	/* Override */
	getRollData() {
		return {
			alias: this.token?.name || this.name,
			actorId: this.id,
			actorType: this.system.type,
			canAct: this.canAct,
			sceneId: this.token?.parent.id,
			tokenId: this.token?.id,
			unlimitedPush: this.unlimitedPush,
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

				// We only want to touch flags of items that are considered "gear"
				if (!CONFIG.fbl.carriedItemTypes.includes(data.type)) continue;
				entity.flags["forbidden-lands"] = {
					state: "carried",
					...entity.flags["forbidden-lands"],
				};
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

	toggleCondition(conditionName) {
		const conditionValue = this.conditions[conditionName].value;
		const conditionLabel = this.conditions[conditionName].label;
		const effect = this.effects.find((condition) => condition.getFlag("core", "statusId") === conditionName);
		if (CONFIG.fbl.conditions.includes(conditionName)) {
			this.update({ [`system.condition.${conditionName}.value`]: !conditionValue });
			if (conditionValue && effect) this.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
			else if (!conditionValue && !effect)
				this.createEmbeddedDocuments("ActiveEffect", {
					...CONFIG.fbl.activeEffects[conditionName],
					label: localize(conditionLabel),
				});
		}
	}

	rest() {
		const activeConditions = Object.entries(this.conditions ?? {}).filter(([_, value]) => value?.value);
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
		if (this.conditions?.sleepy.value) this.toggleCondition("sleepy");
		this.update({ data });
		const sleepyIndex = activeConditions.map(([key, _]) => key).indexOf("sleepy");
		const wasSleepy = sleepyIndex > -1;
		if (wasSleepy) activeConditions.splice(sleepyIndex, 1);
		const formatter = new Intl.ListFormat(game.i18n.lang, { style: "long" });
		ChatMessage.create({
			content: `<div class="forbidden-lands chat-item"><h3>${this.name}</h3><h4>${localize("ACTION.REST")}</h4>${
				wasSleepy ? `<p>${this.name} ${localize("CONDITION.IS_NO_LONGER_SLEEPY")}.</p>` : ""
			}${
				activeConditions.length
					? `<p>${this.name} ${localize("CONDITION.SUFFERING_FROM")} ${formatter.format(
							activeConditions
								.filter(([key, _]) => key !== "sleepy")
								.map(([_, value]) => `<b>${localize(value.label)}</b>`),
					  )}.</p>`
					: ""
			}</div>`,
			speaker: { actor: this },
			whisper: game.user.isGM ? [game.user.id] : [],
		});
	}
}
