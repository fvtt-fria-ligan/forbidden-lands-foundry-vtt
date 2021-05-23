import { RollDialog } from "../../components/roll-dialog.js";
import DiceRoller from "../../components/dice-roller.js";

export class ForbiddenLandsActorSheet extends ActorSheet {
	altInteraction = game.settings.get("forbidden-lands", "alternativeSkulls");
	diceRoller = new DiceRoller();

	/**
	 * @override
	 * Extends the sheet drop handler for system specific usages
	 */
	async _onDrop(event, data) {
		let dragData = JSON.parse(event.dataTransfer.getData("text/plain"));

		if (dragData.type === "itemDrop") {
			dragData.item.effects = []; //This is a workaround for a bug caused by Foundry VTT where this._source on effects is non-iterable.
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
			const attribute = this.actor.data.data.attribute[attributeName];
			let modifiers = this.getRollModifiers(attribute.label, null);
			RollDialog.prepareRollDialog(
				attribute.label,
				{ name: attribute.label, value: attribute.value },
				0,
				0,
				modifiers.artifacts.join(" "),
				modifiers.modifier,
				0,
				this.diceRoller,
				null,
			);
		});
		html.find(".roll-skill").click((ev) => {
			const skillName = $(ev.currentTarget).data("skill");
			const skill = this.actor.data.data.skill[skillName];
			const attribute = this.actor.data.data.attribute[skill.attribute];
			let modifiers = this.getRollModifiers(attribute.label, null);
			modifiers = this.getRollModifiers(skill.label, modifiers);
			RollDialog.prepareRollDialog(
				skill.label,
				{ name: attribute.label, value: attribute.value },
				{ name: skill.label, value: skill.value },
				0,
				modifiers.artifacts.join(" "),
				modifiers.modifier,
				0,
				this.diceRoller,
				null,
			);
		});
		html.find(".roll-weapon").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			const weapon = this.actor.items.get(itemId);
			const action = $(ev.currentTarget).data("action");
			let testName = action || weapon.name;
			let attribute;
			let skill;
			if (weapon.data.data.category === "melee") {
				attribute = this.actor.data.data.attribute.strength;
				skill = this.actor.data.data.skill.melee;
			} else {
				attribute = this.actor.data.data.attribute.agility;
				skill = this.actor.data.data.skill.marksmanship;
			}
			let bonus = this.parseBonus(weapon.data.data.bonus.value);
			let modifiers = this.parseModifiers(weapon.data.data.skillBonus);
			if (weapon.data.data.artifactBonus) {
				modifiers.artifacts.splice(0, 0, weapon.data.data.artifactBonus);
			}
			modifiers = this.getRollModifiers(attribute.label, modifiers);
			modifiers = this.getRollModifiers(skill.label, modifiers);
			if (action) {
				modifiers = this.getRollModifiers(action, modifiers);
			}

			if (weapon.data.data.category === "melee" && action === "ACTION.PARRY") {
				// Adjust parry action modifiers based on weapon features
				const parrying = weapon.data.data.features.parrying;
				if (!parrying) {
					modifiers.modifier -= 2;
				}
			}

			RollDialog.prepareRollDialog(
				testName,
				{ name: attribute.label, value: attribute.value },
				{ name: skill.label, value: skill.value },
				bonus,
				modifiers.artifacts.join(" "),
				modifiers.modifier,
				action ? 0 : weapon.data.data.damage,
				this.diceRoller,
				null,
			);
		});
		html.find(".roll-spell").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			const spell = this.actor.items.get(itemId);
			RollDialog.prepareSpellDialog(spell, null);
		});
		html.find(".roll-action").click((ev) => {
			const rollName = $(ev.currentTarget).data("action");
			const skillName = $(ev.currentTarget).data("skill");
			const skill = this.actor.data.data.skill[skillName];
			const attribute = this.actor.data.data.attribute[skill.attribute];
			let modifiers = this.getRollModifiers(attribute.label, null);
			modifiers = this.getRollModifiers(skill.label, modifiers);
			modifiers = this.getRollModifiers(rollName, modifiers);
			RollDialog.prepareRollDialog(
				rollName,
				{ name: attribute.label, value: attribute.value },
				{ name: skill.label, value: skill.value },
				0,
				modifiers.artifacts.join(" "),
				modifiers.modifier,
				0,
				this.diceRoller,
				null,
			);
		});
		html.find(".quantity").on("blur", (ev) => {
			const itemId = ev.currentTarget.parentElement.dataset.itemId;
			this.actor.updateOwnedItem({
				_id: itemId,
				"data.quantity": ev.currentTarget.value,
			});
		});
	}

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

	getRollModifiers(skillLabel, modifiers) {
		if (!modifiers) {
			modifiers = { modifier: 0, artifacts: [] };
		}
		this.actor.items.forEach((item) => {
			let rollModifiers = item.data.data.rollModifiers;
			if (rollModifiers) {
				Object.values(rollModifiers).forEach((mod) => {
					if (mod && mod.name === skillLabel) {
						let parsed = this.parseModifiers(mod.value);
						modifiers.modifier += parsed.modifier;
						modifiers.artifacts = modifiers.artifacts.concat(parsed.artifacts);
					}
				});
			}
		});
		return modifiers;
	}
	async _renderInner(data, options) {
		data.alternativeSkulls = this.altInteraction;
		return super._renderInner(data, options);
	}
	computerItemEncumbrance(data) {
		const config = game.fbl.config.encumbrance;
		const type = data.type;
		const weight = data.data?.weight;
		if (data.type === "rawMaterial") return 1 * Number(data.data.quantity);
		if (type !== "gear" && type !== "armor" && type !== "weapon") return null;
		return Number(config[weight] ?? 1) ?? Number(weight) ?? 1;
	}
}
