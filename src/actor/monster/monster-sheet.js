/* eslint-disable no-unused-vars */
import { ForbiddenLandsActorSheet } from "../actor-sheet.js";
import { FBLRoll } from "@components/roll-engine/engine.js";
import localizeString from "@utils/localize-string.js";
import { ActorSheetConfig } from "@utils/sheet-config.js";
export class ForbiddenLandsMonsterSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			classes: ["forbidden-lands", "sheet", "actor"],
			template: "systems/forbidden-lands/templates/actor/monster/monster-sheet.hbs",
			width: 700,
			height: 770,
			resizable: false,
			scrollY: [
				".monster-talents .item-list .items",
				".monster-attacks .item-list .items",
				".gears.item-list .items",
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
		const actorData = super.getData();
		this.computeSkills(actorData);
		this.computeItems(actorData);
		this.computeEncumbrance(actorData);
		return actorData;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find(".roll-armor").click(() => this.rollArmor());
		html.find("#monster-attack-btn").click(() => this.rollAttack());
		html.find(".roll-attack").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			return this.rollSpecificAttack(itemId);
		});
		html.find(".change-mounted").click(() => {
			const boolean = this.actor.data.data.isMounted;
			this.actor.update({ "data.isMounted": !boolean });
		});
	}

	/************************************************/
	/***         Monster Specific Rolls           ***/
	/************************************************/

	async rollAttack() {
		const attacks = this.actor.itemTypes.monsterAttack;
		const roll = await new Roll(`1d${attacks.length}`).roll({ async: true });
		const attack = attacks[parseInt(roll.result) - 1];
		attack.sendToChat();
		this.rollSpecificAttack(attack.id);
	}

	async rollSpecificAttack(attackId) {
		if (this.actor.isBroken) throw this.broken();
		const attack = this.actor.items.get(attackId);
		const gear = attack.getRollData();
		const rollOptions = this.getRollOptions();
		const options = {
			name: attack.name,
			maxPush: rollOptions.unlimitedPush ? 10000 : "0",
			isAttack: true,
			isMonsterAttack: true,
			damage: Number(attack.damage || 0),
			gear,
			...rollOptions,
		};
		const roll = FBLRoll.create(`${attack.data.data.dice}db[${attack.name}]`, {}, options);
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	/* Override Actor Roll */
	async rollArmor() {
		const armor = this.actorProperties.armor;
		const rollName = `${localizeString("ITEM.TypeArmor")}: ${this.actor.name}`;
		const options = {
			name: rollName,
			maxPush: "0",
			...this.getRollOptions(),
		};
		const roll = FBLRoll.create(`${armor.value}dg[${rollName}]`, {}, options);
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	/************************************************/
	/************************************************/

	computeEncumbrance(data) {
		let weightCarried = 0;
		for (let item of Object.values(data.items)) {
			weightCarried += this.computeItemEncumbrance(item);
		}
		const weightAllowed = data.data.attribute.strength.max * 2 * (data.data.isMounted ? 1 : 2);
		data.data.encumbrance = {
			value: weightCarried,
			max: weightAllowed,
			over: weightCarried > weightAllowed,
		};
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
			].concat(buttons);
		}

		return buttons;
	}
}
