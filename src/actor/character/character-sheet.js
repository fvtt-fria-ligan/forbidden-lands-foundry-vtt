/* eslint-disable no-unused-vars */
import { ForbiddenLandsCharacterGenerator } from "@components/character-generator/character-generator.js";
import { FBLRoll, FBLRollHandler } from "@components/roll-engine/engine.js";
import localizeString from "@utils/localize-string";
import { ActorSheetConfig } from "@utils/sheet-config.js";
import { ForbiddenLandsActorSheet } from "../actor-sheet.js";

export class ForbiddenLandsCharacterSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		const useHealthAndResolve = game.settings.get(
			"forbidden-lands",
			"useHealthAndResolve",
		);
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands", "sheet", "actor"],
			width: 660,
			height: useHealthAndResolve ? 790 : 740,
			resizable: true,
			scrollY: [
				".armors .item-list .items",
				".critical-injuries .item-list .items",
				".gears .item-list .items",
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
		if (!game.user.isGM && this.actor.limited)
			return "systems/forbidden-lands/templates/actor/character/character-limited-sheet.hbs";
		if (this.actorProperties.subtype?.type === "npc")
			return "systems/forbidden-lands/templates/actor/character/npc-sheet.hbs";
		return "systems/forbidden-lands/templates/actor/character/character-sheet.hbs";
	}

	async getData() {
		let actorData = await super.getData();
		actorData = this.computeSkills(actorData);
		actorData = this.computeEncumbrance(actorData);

		return actorData;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find(".condition").click(async (ev) => {
			const conditionName = $(ev.currentTarget).data("condition");
			this.actor.toggleCondition(conditionName);
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

		html.find(".roll-reputation").click(() => this.rollReputation());

		html.find(".roll-pride").click(() => this.rollPride());

		html.find(".currency-button").on("click contextmenu", (ev) => {
			const currency = $(ev.currentTarget).data("currency");
			const operator = $(ev.currentTarget).data("operator");
			const modifier = ev.type === "contextmenu" ? 5 : 1;
			const coins = [
				this.actor.actorProperties.currency.gold.value,
				this.actor.actorProperties.currency.silver.value,
				this.actor.actorProperties.currency.copper.value,
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
					"system.currency.gold.value": coins[0],
					"system.currency.silver.value": coins[1],
					"system.currency.copper.value": coins[2],
				});
			}
		});
	}

	/************************************************/
	/***        Character Specific Rolls          ***/
	/************************************************/

	async rollConsumable(identifier) {
		const consumable = this.actor.consumables[identifier];
		if (!consumable.value)
			return ui.notifications.warn("WARNING.NO_CONSUMABLE", { localize: true });
		const rollName = localizeString(consumable.label);
		const dice = CONFIG.fbl.consumableDice[consumable.value];
		const options = {
			name: rollName.toLowerCase(),
			maxPush: "0",
			consumable: identifier,
			type: "consumable",
			...this.getRollOptions(),
		};
		const roll = FBLRoll.create(`${dice}[${rollName}]`, {}, options);
		await roll.roll({ async: true });
		const message = await roll.toMessage();
		if (
			Number(message.rolls[0].result) <=
			(game.settings.get("forbidden-lands", "autoDecreaseConsumable") || 0)
		) {
			FBLRollHandler.decreaseConsumable(message.id);
		}
	}

	async rollPride() {
		if (!this.actor.canAct) throw this.broken();
		const pride = this.actor.actorProperties.bio.pride;
		const rollName = localizeString(pride.label);
		const options = {
			name: rollName,
			flavor: `<span class="chat-flavor">${pride.value}</span>`,
			maxPush: "0",
			...this.getRollOptions(),
		};
		const roll = FBLRoll.create(
			`${CONFIG.fbl.prideDice}[${rollName}]`,
			{},
			options,
		);
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	async rollReputation() {
		const reputation = this.actor.actorProperties.bio.reputation;
		const rollName = localizeString(reputation.label);
		const options = {
			name: rollName,
			flavor: `<span class="chat-flavor">${reputation.value}</span>`,
			maxPush: "0",
			...this.getRollOptions(),
		};
		const roll = FBLRoll.create(
			`${reputation.value}db[${rollName}]`,
			{},
			options,
		);
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

	/* Override */
	_onConfigureSheet(event) {
		event.preventDefault();
		new ActorSheetConfig(this.actor, {
			top: this.position.top + 40,
			left: this.position.left + (this.position.width - 400) / 2,
		}).render(true);
	}

	_getHeaderButtons() {
		let buttons = super._getHeaderButtons();

		if (this.actor.isOwner) {
			buttons = [
				{
					label: game.i18n.localize("SHEET.HEADER.REST"),
					class: "rest-up",
					icon: "fas fa-bed",
					onclick: () => this.actor.rest(),
				},
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
						const hasFilledAttributes = Object.values(
							this.actor.actorProperties.attribute,
						)
							.flatMap((a) => a.value + a.max)
							.some((v) => v > 0);

						if (hasFilledAttributes) {
							Dialog.confirm({
								title: game.i18n.localize("FLCG.TITLE"),
								content: `
									<h2 style="text-align: center;font-weight: 600; border:none;">${game.i18n.localize(
										"FLCG.WARNING",
									)}</h2>
									<p>${game.i18n.localize("FLCG.WARNING_DESTRUCTIVE_EDIT")}</p><hr/>
									<p>${game.i18n.localize("FLCG.WARNING_HINT")}</p>
									<p style="text-align: center;"><b>${game.i18n.localize(
										"FLCG.WARNING_ARE_YOU_SURE",
									)}</b></p>
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
