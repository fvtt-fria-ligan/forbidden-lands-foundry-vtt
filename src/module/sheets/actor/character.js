import { ForbiddenLandsActorSheet } from "./actor.js";
import { RollDialog } from "../../components/roll-dialog.js";
import { ForbiddenLandsCharacterGenerator } from "../../components/character-generator/character-generator.js";
export class ForbiddenLandsCharacterSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands", "sheet", "actor"],
			width: 700,
			height: 780,
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

	get template() {
		if (!game.user.isGM && this.actor.limited) return "systems/forbidden-lands/templates/limited-character.hbs";
		return "systems/forbidden-lands/templates/character.hbs";
	}

	getData() {
		const superData = super.getData();
		const actorData = superData.data;
		this.computeSkills(actorData);
		this.computeItems(actorData);
		this.computeEncumbrance(actorData);
		return actorData;
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.find(".item-create").click((ev) => {
			this.onItemCreate(ev);
		});
		html.find(".condition").click(async (ev) => {
			const conditionName = $(ev.currentTarget).data("condition");
			const conditionValue = this.actor.data.data.condition[conditionName].value;
			if (game.fbl.config.conditions.includes(conditionName))
				this.actor.update({ [`data.condition.${conditionName}.value`]: !conditionValue });
			this._render();
		});
		html.find(".roll-armor.specific").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			const armor = this.actor.items.get(itemId);
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
				this.diceRoller,
				null,
			);
		});
		html.find(".roll-armor.total").click(() => {
			let armorTotal = 0;
			const items = this.actor.items;
			items.forEach((item) => {
				if (item.type === "armor" && item.data.data.part !== "shield") {
					armorTotal += parseInt(item.data.data.bonus.value, 10);
				}
			});
			RollDialog.prepareRollDialog("HEADER.ARMOR", 0, 0, armorTotal, "", 0, 0, this.diceRoller, null);
		});
		html.find(".roll-consumable").click((ev) => {
			const consumable = this.actor.data.data.consumable[$(ev.currentTarget).data("consumable")];
			const consumableName = game.i18n.localize(consumable.label);
			if (consumable.value === 6) {
				this.diceRoller.roll(consumableName, 0, 1, 0, [], 0);
			} else if (consumable.value > 6) {
				this.diceRoller.roll(consumableName, 0, 0, 0, [{ dice: 1, face: consumable.value }], 0);
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
			skill[`has${skill?.attribute?.capitalize()}`] = false;
			if (Object.keys(game.fbl.config.attributes).includes(skill.attribute))
				skill[`has${skill.attribute.capitalize()}`] = true;
		}
	}

	computeItems(data) {
		for (let item of Object.values(data.items)) {
			if (game.fbl.config.itemTypes.includes(item.type)) item[`is${item.type.capitalize()}`] = true;
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
		let modifiers = this.getRollModifiers("CARRYING_CAPACITY", null);
		const weightAllowed = data.data.attribute.strength.max * 2 + modifiers.modifier;
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
		data.name = `New ${data.type.capitalize()}`;
		this.actor.createEmbeddedDocuments("Item", data, {
			renderSheet: true,
		});
	}

	async _charGen() {
		const chargen = await new ForbiddenLandsCharacterGenerator(
			await ForbiddenLandsCharacterGenerator.loadDataset(),
			this.actor,
		);
		return chargen.render(true);
	}

	_getHeaderButtons() {
		let buttons = super._getHeaderButtons();

		if (this.actor.isOwner) {
			buttons = [
				{
					label: game.i18n.localize("SHEET.HEADER.ROLL"),
					class: "custom-roll",
					icon: "fas fa-dice",
					onclick: () => RollDialog.prepareRollDialog("DICE.ROLL", 0, 0, 0, "", 0, 0, this.diceRoller, null),
				},
				{
					label: game.i18n.localize("SHEET.HEADER.PUSH"),
					class: "push-roll",
					icon: "fas fa-skull",
					onclick: () => this.diceRoller.push(this.diceRoller),
				},
				{
					label: game.i18n.localize("SHEET.HEADER.CHAR_GEN"),
					class: "char-gen",
					icon: "fas fa-leaf",
					onclick: async () => {
						const hasFilledAttributes = Object.values(this.actor.data.data.attribute)
							.flatMap((a) => a.value + a.max)
							.some((v) => v > 0);

						if (hasFilledAttributes) {
							Dialog.confirm({
								title: game.i18n.localize("FLCG.TITLE"),
								content: `
									<h1 style="text-align: center;font-weight: 600; border:none;">${game.i18n.localize("FLCG.WARNING")}</h1>
									<p>${game.i18n.localize("FLCG.WARNING_DESTRUCTIVE_EDIT")}</p><hr/>
									<p>${game.i18n.localize("FLCG.WARNING_HINT")}</p>
									<p style="text-align: center;"><b>${game.i18n.localize("FLCG.WARNING_ARE_YOU_SURE")}</b></p>
									<br/>`,
								yes: async () => await this._charGen(),
								no: () => {},
								defaultYes: false,
							});
						} else {
							await this._charGen();
						}
					},
				},
			].concat(buttons);
		}

		return buttons;
	}
}
