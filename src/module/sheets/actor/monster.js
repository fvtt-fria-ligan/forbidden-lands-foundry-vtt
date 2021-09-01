/* eslint-disable no-unused-vars */
import { ForbiddenLandsActorSheet } from "./actor.js";
import { FBLRoll } from "../../components/roll-engine/engine.js";
import localizeString from "../../utils/localize-string.js";
export class ForbiddenLandsMonsterSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			classes: ["forbidden-lands", "sheet", "actor"],
			template: "systems/forbidden-lands/templates/monster.hbs",
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
		const options = {
			name: attack.name,
			maxPush: "0",
			...this.getRollOptions(),
		};
		const roll = FBLRoll.create(`${attack.data.data.dice}ds[${attack.name}]`, {}, options);
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
			item.isMonsterAttack = item.type === "monsterAttack";
			item.isMonsterTalent = item.type === "monsterTalent";
			item.isWeapon = item.type === "weapon";
			item.isArmor = item.type === "armor";
			item.isGear = item.type === "gear";
			item.isRawMaterial = item.type === "rawMaterial";
		}
	}

	onItemCreate(event) {
		event.preventDefault();
		let header = event.currentTarget;
		let data = duplicate(header.dataset);
		data.name = `New ${data.type.capitalize()}`;
		this.actor.createEmbeddedDocuments("Item", data, { renderSheet: true });
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
			].concat(buttons);
		}

		return buttons;
	}
}
