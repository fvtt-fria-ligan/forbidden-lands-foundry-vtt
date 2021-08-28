/* eslint-disable no-unused-vars */
import { ForbiddenLandsActorSheet } from "./actor.js";
import { ForbiddenLandsCharacterGenerator } from "../../components/character-generator/character-generator.js";
import localizeString from "../../utils/localize-string";
import { FBLRoll, FBLRollHandler } from "../../components/roll-engine/engine.js";
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
		const actorData = this.actorData.toObject();
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
			if (CONFIG.fbl.conditions.includes(conditionName))
				this.actor.update({ [`data.condition.${conditionName}.value`]: !conditionValue });
			this._render();
		});

		html.find(".roll-armor.specific").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			this.rollSpecificArmor(itemId);
		});

		html.find(".roll-armor.total").click(() => this.rollArmor());

		html.find(".roll-consumable").click((ev) => {
			const consumable = $(ev.currentTarget).data("consumable");
			return this.rollConsumable(consumable);
		});

		html.find("#pride-roll-btn").click(() => this.rollPride());

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
			if (CONFIG.fbl.attributes.includes(skill.attribute)) skill[`has${skill.attribute.capitalize()}`] = true;
		}
	}

	computeItems(data) {
		for (const item of Object.values(data.items)) {
			// Shields were long treated as armor. They are not. This is a workaround for that.
			if (item.data.part === "shield") item.isWeapon = true;
			else if (CONFIG.fbl.itemTypes.includes(item.type)) item[`is${item.type.capitalize()}`] = true;
		}
	}

	computeEncumbrance(data) {
		let weightCarried = 0;
		for (let item of Object.values(data.items)) {
			weightCarried += this.computeItemEncumbrance(item);
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
		/* Needs Fix */
		//let modifiers = this.getRollModifiers("CARRYING_CAPACITY", null);
		const weightAllowed = data.data.attribute.strength.max * 2; /* + modifiers.modifier; */
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

	/************************************************/
	/***        Character Specific Rolls          ***/
	/************************************************/

	async rollConsumable(identifier) {
		const consumable = this.actor.consumables[identifier];
		if (!consumable.value) return ui.notifications.warn(localizeString("WARNING.NO_CONSUMABLE"));
		const rollName = localizeString(consumable.label);
		const dice = CONFIG.fbl.consumableDice[consumable.value];
		const options = {
			name: rollName.toLowerCase(),
			maxPush: "0",
			type: "consumable",
			...this.getRollOptions(),
		};
		const roll = FBLRoll.create(dice + `[${rollName}]`, {}, options);
		await roll.roll({ async: true });
		const message = await roll.toMessage();
		if (Number(message.roll.result) <= (game.settings.get("forbidden-lands", "autoDecreaseConsumable") || 0)) {
			FBLRollHandler.decreaseConsumable(message.id);
		}
	}

	async rollPride() {
		if (this.actor.isBroken) throw this.broken();
		const pride = this.actor.actorProperties.bio.pride;
		const rollName = localizeString(pride.label);
		const options = {
			name: rollName,
			flavor: `<span class="chat-flavor">${pride.value}</span>`,
			maxPush: "0",
			...this.getRollOptions(),
		};
		const roll = FBLRoll.create(CONFIG.fbl.prideDice + `[${rollName}]`, {}, options);
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	/************************************************/
	/************************************************/

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
					onclick: () => this.rollAction("ACTION.GENERIC"),
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
