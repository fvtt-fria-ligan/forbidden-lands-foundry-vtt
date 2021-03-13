import { ForbiddenLandsActorSheet } from "./actor.js";
import { RollDialog } from "../dialog/roll-dialog.js";

export class ForbiddenLandsCharacterSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands", "sheet", "actor"],
			template: "systems/forbidden-lands/model/character.html",
			width: 620,
			height: 770,
			resizable: false,
			scrollY: [
				".armors .item-list .items",
				".critical-injuries .item-list .items",
				".gears.item-list .items",
				".spells .item-list .items",
				".talents .item-list .items",
				".weapons .item-list .items",
			],
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "main",
				},
			],
		});
	}

	getData() {
		const data = super.getData();
		this.computeSkills(data);
		this.computeItems(data);
		this.computeEncumbrance(data);
		return data;
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.find(".item-create").click((ev) => {
			this.onItemCreate(ev);
		});
		html.find(".condition").click(async (ev) => {
			const conditionName = $(ev.currentTarget).data("condition");
			const conditionValue = this.actor.data.data.condition[conditionName]
				.value;
			if (conditionName === "sleepy") {
				this.actor.update({
					"data.condition.sleepy.value": !conditionValue,
				});
			} else if (conditionName === "thirsty") {
				this.actor.update({
					"data.condition.thirsty.value": !conditionValue,
				});
			} else if (conditionName === "hungry") {
				this.actor.update({
					"data.condition.hungry.value": !conditionValue,
				});
			} else if (conditionName === "cold") {
				this.actor.update({
					"data.condition.cold.value": !conditionValue,
				});
			}
			this._render();
		});
		html.find(".roll-armor.specific").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			const armor = this.actor.getOwnedItem(itemId);
			let testName = armor.data.name;
			let base;
			let skill;
			if (armor.data.data.part === "shield") {
				base = {
					name: this.actor.data.data.attribute.strength.label,
					value: this.actor.data.data.attribute.strength.value,
				};
				skill = {
					name: this.actor.data.data.skill.melee.label,
					value: this.actor.data.data.skill.melee.value,
				};
			} else {
				base = 0;
				skill = 0;
			}
			RollDialog.prepareRollDialog(
				testName,
				base,
				skill,
				armor.data.data.bonus.value,
				"",
				0,
				0,
				this.diceRoller
			);
		});
		html.find(".roll-armor.total").click((ev) => {
			let armorTotal = 0;
			const items = this.actor.items;
			items.forEach((item) => {
				if (item.type === "armor" && item.data.data.part !== "shield") {
					armorTotal += parseInt(item.data.data.bonus.value, 10);
				}
			});
			RollDialog.prepareRollDialog(
				"HEADER.ARMOR",
				0,
				0,
				armorTotal,
				"",
				0,
				0,
				this.diceRoller
			);
		});
		html.find(".roll-consumable").click((ev) => {
			const consumable = this.actor.data.data.consumable[
				$(ev.currentTarget).data("consumable")
			];
			const consumableName = game.i18n.localize(consumable.label);
			if (consumable.value == 6) {
				this.diceRoller.roll(consumableName, 0, 1, 0, [], 0);
			} else if (consumable.value > 6) {
				this.diceRoller.roll(
					consumableName,
					0,
					0,
					0,
					[{ dice: 1, face: consumable.value }],
					0
				);
			}
		});
		html.find(".currency-button").on("click contextmenu", (ev) => {
			const currency = $(ev.currentTarget).data("currency");
			const operator = $(ev.currentTarget).data("operator");
			const modifier = ev.type === "contextmenu" ? 5 : 1;
			let coins = [
				this.actor.data.data.currency.gold.value,
				this.actor.data.data.currency.silver.value,
				this.actor.data.data.currency.copper.value,
			];
			let i = { gold: 0, silver: 1, copper: 2 }[currency];
			if (operator === "plus") {
				coins[i] += modifier;
			} else {
				coins[i] -= modifier;
				for (; i >= 0; --i) {
					if (coins[i] < 0 && i > 0) {
						coins[i - 1] -= 1;
						coins[i] += 10;
					}
				}
			}
			if (coins[0] >= 0) {
				this.actor.update({
					"data.currency.gold.value": coins[0],
					"data.currency.silver.value": coins[1],
					"data.currency.copper.value": coins[2],
				});
			}
		});
	}

	computeSkills(data) {
		for (let skill of Object.values(data.data.skill)) {
			skill.hasStrength = skill.attribute === "strength";
			skill.hasAgility = skill.attribute === "agility";
			skill.hasWits = skill.attribute === "wits";
			skill.hasEmpathy = skill.attribute === "empathy";
		}
	}

	computeItems(data) {
		for (let item of Object.values(data.items)) {
			item.isTalent = item.type === "talent";
			item.isWeapon = item.type === "weapon";
			item.isArmor = item.type === "armor";
			item.isGear = item.type === "gear";
			item.isRawMaterial = item.type === "rawMaterial";
			item.isSpell = item.type === "spell";
			item.isCriticalInjury = item.type === "criticalInjury";
		}
	}
	computeEncumbrance(data) {
		let weightCarried = 0;
		for (let item of Object.values(data.items)) {
			weightCarried += this.computerItemEncumbrance(item);
		}
		for (let consumable of Object.values(data.data.consumable)) {
			if (consumable.value > 0) {
				weightCarried += 1;
			}
		}
		const coinsCarried =
			parseInt(data.data.currency.gold.value) +
			parseInt(data.data.currency.silver.value) +
			parseInt(data.data.currency.copper.value);
		weightCarried += Math.floor(coinsCarried / 100) * 0.5;
		let modifiers = this.getRollModifiers("CARRYING_CAPACITY");
		const weightAllowed =
			data.data.attribute.strength.max * 2 + modifiers.modifier;
		data.data.encumbrance = {
			value: weightCarried,
			max: weightAllowed,
			over: weightCarried > weightAllowed,
		};
	}

	onItemCreate(event) {
		event.preventDefault();
		let header = event.currentTarget;
		let data = duplicate(header.dataset);
		data["name"] = `New ${data.type.capitalize()}`;
		this.actor.createEmbeddedEntity("OwnedItem", data, {
			renderSheet: true,
		});
	}

	_getHeaderButtons() {
		let buttons = super._getHeaderButtons();

		if (this.actor.owner) {
			buttons = [
				{
					label: game.i18n.localize("SHEET.HEADER.ROLL"),
					class: "custom-roll",
					icon: "fas fa-dice",
					onclick: (ev) =>
						RollDialog.prepareRollDialog(
							"DICE.ROLL",
							0,
							0,
							0,
							"",
							0,
							0,
							this.diceRoller
						),
				},
				{
					label: game.i18n.localize("SHEET.HEADER.PUSH"),
					class: "push-roll",
					icon: "fas fa-skull",
					onclick: (ev) => this.diceRoller.push(),
				},
			].concat(buttons);
		}

		return buttons;
	}
}
