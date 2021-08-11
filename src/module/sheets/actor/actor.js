import { FBLRollHandler } from "../../components/roll-engine/engine";
import localizeString from "../../utils/localize-string";

/* eslint-disable no-unused-vars */
export class ForbiddenLandsActorSheet extends ActorSheet {
	altInteraction = game.settings.get("forbidden-lands", "alternativeSkulls");

	get actorData() {
		return this.actor.data;
	}

	get actorProperties() {
		return this.actorData.data;
	}

	get rollData() {
		return this.actor.getRollData();
	}

	/**
	 * @override
	 * Extends the sheet drop handler for system specific usages
	 */
	async _onDrop(event, data) {
		let dragData = JSON.parse(event.dataTransfer.getData("text/plain"));

		if (dragData.type === "itemDrop") {
			this.actor.createEmbeddedDocuments("Item", [dragData.item]);
		} else {
			super._onDrop(event, data);
		}
	}

	activateListeners(html) {
		super.activateListeners(html);
		if (!game.user.isGM && this.actor.limited) return;
		// Attribute markers
		html.find(".change-attribute").on("click contextmenu", (ev) => {
			const attributeName = $(ev.currentTarget).data("attribute");
			const attribute = this.actor.data.data.attribute[attributeName];
			let value = attribute.value;
			if ((ev.type === "click" && !this.altInteraction) || (ev.type === "contextmenu" && this.altInteraction)) {
				value = Math.max(value - 1, 0);
			} else if (
				(ev.type === "contextmenu" && !this.altInteraction) ||
				(ev.type === "click" && this.altInteraction)
			) {
				value = Math.min(value + 1, attribute.max);
			}
			this.actor.update({
				["data.attribute." + attributeName + ".value"]: value,
			});
		});

		// Willpower markers
		html.find(".change-willpower").on("click contextmenu", (ev) => {
			const attribute = this.actor.data.data.bio.willpower;
			let value = attribute.value;
			if ((ev.type === "click" && !this.altInteraction) || (ev.type === "contextmenu" && this.altInteraction)) {
				value = Math.max(value - 1, 0);
			} else if (
				(ev.type === "contextmenu" && !this.altInteraction) ||
				(ev.type === "click" && this.altInteraction)
			) {
				value = Math.min(value + 1, attribute.max);
			}
			this.actor.update({ "data.bio.willpower.value": value });
		});

		// Items
		html.find(".item-edit").click((ev) => {
			const div = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(div.data("itemId"));
			item.sheet.render(true);
		});
		html.find(".item-delete").click((ev) => {
			const div = $(ev.currentTarget).parents(".item");
			this.actor.deleteEmbeddedDocuments("Item", [div.data("itemId")]);
			div.slideUp(200, () => this.render(false));
		});
		html.find(".item-post").click((ev) => {
			const div = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(div.data("itemId"));
			item.sendToChat();
		});
		html.find(".change-item-bonus").on("click contextmenu", (ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			const item = this.actor.items.get(itemId);
			let value = item.data.data.bonus.value;
			if ((ev.type === "click" && !this.altInteraction) || (ev.type === "contextmenu" && this.altInteraction)) {
				value = Math.max(value - 1, 0);
			} else if (
				(ev.type === "contextmenu" && !this.altInteraction) ||
				(ev.type === "click" && this.altInteraction)
			) {
				value = Math.min(value + 1, item.data.data.bonus.max);
			}
			item.update({
				"data.bonus.value": value,
			});
		});

		// Rolls
		html.find(".roll-attribute").click((ev) => {
			const attributeName = $(ev.currentTarget).data("attribute");
			return this.rollAttribute(attributeName);
		});
		html.find(".roll-skill").click((ev) => {
			const skillName = $(ev.currentTarget).data("skill");
			return this.rollSkill(skillName);
		});
		html.find(".roll-weapon").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			return this.rollGear(itemId);
		});

		html.find(".roll-spell").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			return this.rollSpell(itemId);
		});

		html.find(".roll-action").click((ev) => {
			const rollName = $(ev.currentTarget).data("action");
			const itemId = $(ev.currentTarget).data("itemId");
			return this.rollAction(rollName, itemId ? itemId : null);
		});

		html.find(".quantity").on("blur", (ev) => {
			const itemId = ev.currentTarget.parentElement.dataset.itemId;
			this.actor.updateEmbeddedDocuments("Item", [
				{
					_id: itemId,
					"data.quantity": ev.currentTarget.value,
				},
			]);
		});
	}

	broken(type) {
		const msg = type === "item" ? "WARNING.ITEM_BROKEN" : "WARNING.ACTOR_BROKEN";
		const locmsg = localizeString(msg);
		ui.notifications.warn(locmsg);
		return new Error(locmsg);
	}

	getRollOptions(...rollIdentifiers) {
		return {
			...this.rollData,
			modifiers: this.actor.getRollModifierOptions(...rollIdentifiers),
		};
	}

	getAttribute(identifier) {
		const attributeName = CONFIG.fbl.skillAttributeMap[identifier] || identifier;
		const attribute = this.actor.attributes[attributeName];
		if (!attribute) return {};
		return {
			name: attributeName,
			...attribute,
		};
	}

	getSkill(identifier) {
		const skillName = CONFIG.fbl.actionSkillMap[identifier] || identifier;
		const skill = this.actor.skills[skillName];
		if (!skill) return {};
		const attribute = this.getAttribute(skillName);
		return {
			skill: { name: skillName, ...skill },
			attribute: { ...attribute },
		};
	}

	getGear(itemId) {
		const gear = this.actor.items.get(itemId).getRollData();
		if (gear.isBroken) throw this.broken("item");
		const properties = this.getSkill(CONFIG.fbl.actionSkillMap[gear.category] || "melee");
		return {
			gear: gear,
			...properties,
		};
	}

	/************************************************/
	/***               Actor Rolls                ***/
	/************************************************/

	rollAction(actionName, itemId = undefined) {
		if (this.actor.isBroken) throw this.broken();

		const properties = itemId ? this.getGear(itemId) : this.getSkill(actionName);
		const data = {
			title: actionName,
			...properties,
		};
		const options = {
			...this.getRollOptions(actionName, data.skill?.name, data.attribute?.name),
		};
		return FBLRollHandler.createRoll(data, options);
	}

	rollArmor() {
		const rollName = `${localizeString("ITEM.TypeArmor")}: ${localizeString("ARMOR.TOTAL")}`;
		const totalArmor = this.actor.itemTypes.armor.reduce((sum, armor) => {
			if (armor.itemProperties.part === "shield") return sum;
			const value = armor.itemProperties.bonus.value;
			return (sum += value);
		}, 0);
		if (!totalArmor) return ui.notifications.warn(localizeString("WARNING.NO_ARMOR"));

		const mainArmorData = this.actor.items.find((item) => item.itemProperties.part === "body").getRollData();
		if (mainArmorData.isBroken) throw this.broken("item");

		mainArmorData.value = totalArmor;
		mainArmorData.name = rollName;

		const data = {
			title: rollName,
			gear: mainArmorData,
		};
		const options = {
			maxPush: "0",
			...this.getRollOptions(),
		};

		return FBLRollHandler.createRoll(data, options);
	}

	rollSpecificArmor(armorId) {
		const rollData = this.actor.items.get(armorId).getRollData();
		const rollName = `${localizeString("ITEM.TypeArmor")}: ${rollData.name}`;
		if (rollData.isBroken) throw this.broken("item");

		const data = {
			title: rollName,
			gear: rollData,
		};
		const options = {
			maxPush: "0",
			...this.getRollOptions(),
		};
		return FBLRollHandler.createRoll(data, options);
	}

	rollAttribute(attrName) {
		if (this.actor.isBroken) throw this.broken();

		const data = {
			title: attrName,
			attribute: this.getAttribute(attrName),
		};
		const options = {
			...this.getRollOptions(attrName),
		};
		return FBLRollHandler.createRoll(data, options);
	}

	rollGear(itemId) {
		if (this.actor.isBroken) throw this.broken();

		const properties = this.getGear(itemId);
		const data = {
			title: properties.gear.name,
			...properties,
		};
		const options = {
			...this.getRollOptions(data.skill?.name, data.attribute?.name),
		};
		return FBLRollHandler.createRoll(data, options);
	}

	rollSkill(skillName) {
		if (this.actor.isBroken) throw this.broken();

		const data = {
			title: skillName,
			...this.getSkill(skillName),
		};
		const options = {
			...this.getRollOptions(skillName, data.attribute?.name),
		};
		return FBLRollHandler.createRoll(data, options);
	}

	rollSpell(spellId) {
		if (this.actor.isBroken) throw this.broken();
		if (!this.actor.willpower.value) throw ui.notifications.warn(localizeString("WARNING.NO_WILLPOWER"));

		const spell = this.actor.items.get(spellId);
		let { value } = duplicate(this.actor.willpower);
		const hasPsych = !!this.actor.items.getName("Psychic Power (Half-Elf)");

		const data = {
			title: spell.name,
			attribute: {
				name: spell.name,
				value: 1,
			},
			spell: {
				willpower: { max: --value, value: value },
				psych: hasPsych,
				item: spell,
			},
		};

		const options = {
			maxPush: "0",
			template: "systems/forbidden-lands/templates/dice/spell-dialog.hbs",
			type: "spell",
			skulls: this.altInteraction,
			...this.getRollOptions(),
		};
		return FBLRollHandler.createRoll(data, options);
	}

	/************************************************/
	/************************************************/

	parseModifiers(str) {
		let sep = /[\s+]+/;
		let artifacts = [];
		let modifier = 0;
		if (typeof str === "string") {
			str.split(sep).forEach((item) => {
				if (this.isArtifact(item)) {
					artifacts.push(item);
				} else {
					item = parseInt(item, 10);
					if (!isNaN(item)) {
						modifier += item;
					}
				}
			});
		} else if (typeof str === "number") {
			modifier = str;
		}
		return {
			artifacts: artifacts,
			modifier: modifier,
		};
	}

	isArtifact(artifact) {
		let regex = /([0-9]*)d([0-9]*)/i;
		return !!regex.exec(artifact);
	}

	parseBonus(bonus) {
		let regex = /([0-9]*[^d+-])/;
		let regexMatch = regex.exec(bonus);
		if (regexMatch != null) {
			return regex.exec(bonus)[1];
		} else {
			return 0;
		}
	}

	async _renderInner(data, options) {
		data.alternativeSkulls = this.altInteraction;
		return super._renderInner(data, options);
	}

	computeItemEncumbrance(data) {
		const config = CONFIG.fbl.encumbrance;
		const type = data.type;
		const weight = data.data?.weight;
		if (data.type === "rawMaterial") return 1 * Number(data.data.quantity);
		if (type !== "gear" && type !== "armor" && type !== "weapon") return null;
		return Number(config[weight] ?? 1) ?? Number(weight) ?? 1;
	}
}
