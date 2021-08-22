import { YearZeroRoll, YearZeroDie, YearZeroRollManager } from "foundry-year-zero-roller/lib/yzur";
import localizeString from "../../utils/localize-string";

/**
 * @extends FormApplication
 * @description RollDialog class that is intended as a base class for various types of roll.
 *
 */

export class FBLRollHandler extends FormApplication {
	constructor(
		{
			attribute = { label: "DICE.BASE", value: 0 },
			skill = { label: "DICE.SKILL", value: 0 },
			gear = { label: "DICE.GEAR", value: 0, artifactDie: "" },
			spell = {},
		},
		options,
	) {
		super({}, options);
		this.roll = {};
		this.base = attribute;
		this.skill = skill;
		this.gear = gear;
		this.damage = options.damage || gear.damage;
		this.artifact = gear?.artifactDie;
		this.modifier =
			options.modifiers?.reduce((sum, mod) => (mod.value < 0 ? (sum += Number(mod.value)) : sum), 0) || 0;
		this.spell = { safecast: 0, ...spell };
	}

	/**
	 * Base (Attribute) Dice formula
	 */
	get b() {
		return this.roll._b;
	}
	set b(val) {
		this.roll._b = this.generateTermFormula(val, "b", localizeString(this.base?.name));
	}
	/**
	 * Skill Dice formula
	 */
	get s() {
		return this.roll._s;
	}
	set s(val) {
		this.roll._s = this.generateTermFormula(val, "s", localizeString(this.skill?.name));
	}
	/**
	 * Gear Dice formula
	 */
	get g() {
		return this.roll._g;
	}
	set g(val) {
		this.roll._g = this.generateTermFormula(val, "g", localizeString(this.gear?.name));
	}
	/**
	 * Artifact Dice formula
	 */
	get a() {
		return this.roll._a;
	}
	set a(val) {
		this.roll._a = this.parseArtifacts(val, localizeString(this.gear?.name));
	}
	/**
	 * Negative Dice formula
	 */
	get n() {
		return this.roll._n;
	}
	set n(val) {
		this.roll._n = this.generateTermFormula(val, "n", localizeString("DICE.NEGATIVE"));
	}

	get isAttack() {
		return !!this.damage;
	}

	get spellDice() {
		let sum = this.base.value;
		if (this.spell.psych) ++sum;
		if (this.spell.safecast) sum -= this.spell.safecast;
		if (sum < 0) sum = 0;
		return sum;
	}

	get powerLevel() {
		let sum;
		sum = this.spellDice;
		if (this.spell.ingredient) ++sum;
		if (this.spell.safecast) sum += this.spell.safecast;
		return sum;
	}

	get safecastMax() {
		return this.spell.psych || this.base.value > 1 ? 2 : 1;
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands"],
			width: "450",
			height: "auto",
			resizable: false,
		});
	}

	get template() {
		return this.options.template || "systems/forbidden-lands/templates/dice/dialog.hbs";
	}

	activateListeners(html) {
		super.activateListeners(html);
		const totalModifierInput = html[0].querySelector("input#modifier");
		const artifactInput = html[0].querySelector("input#artifact");

		html.find("#base").focus();
		html.find("input").focus((ev) => ev.currentTarget.select());

		html.find(".inc-dec-btns").click((ev) => {
			const type = $(ev.currentTarget).data("type");
			const operator = $(ev.currentTarget).data("operator");
			const input = html.find("#" + type);
			let value = parseInt(input.val(), 10) || 0;
			value += operator === "plus" ? 1 : -1;
			input.val(value > 0 ? value : 0);
		});

		html.find("input.option").on("change", function () {
			//Handle artifact modifiers
			if (FBLRollHandler.isValidArtifact(this.dataset.value.slice(1))) {
				if (this.checked) artifactInput.value += this.dataset.value;
				else artifactInput.value = artifactInput.value.replace(this.dataset.value, "");
				return;
			}
			// Handle normal modifiers
			let currentValue = Number(totalModifierInput.value);
			if (this.checked) currentValue += Number(this.dataset.value);
			else currentValue -= Number(this.dataset.value);
			totalModifierInput.value = currentValue;
		});

		html.find(".spend-willpower").on("click contextmenu", (ev) => {
			if (foundry.utils.isObjectEmpty(this.spell)) return;

			const type = this.options.skulls ? "contextmenu" : "click";

			let value = this.base.value;
			if (ev.type === type && this.spell.willpower.value < this.spell.willpower.max) {
				value = Math.max(--value, 1);
				++this.spell.willpower.value;
			} else if (ev.type !== type && this.spell.willpower.value > 0) {
				--this.spell.willpower.value;
				value++;
			}

			this.base.value = value;
			this.render(true);
		});

		html.find(".spell-option").on("change", (ev) => {
			const el = ev.currentTarget;
			switch (el.name) {
				case "chance":
					this.spell.safecast = 0;
				// eslint-disable-next-line no-fallthrough
				case "psych":
				case "ingredient":
					this.spell[el.name] = !!el.checked;
					break;
				case "safecast": {
					this.spell.safecast = Number(el.value);
					break;
				}
			}
			if (!this.spell.psych && this.spell.safecast === 2) this.spell.safecast = 1;
			this.render(true);
		});

		html.find("#cancel").click(() => {
			this.close();
		});
	}

	getData(options = {}) {
		return {
			title: this.title,
			dice: {
				base: this.base,
				skill: this.skill,
				gear: this.gear,
			},
			artifact: this.gear.artifactDie,
			modifier: this.modifier,
			safecastMax: this.safecastMax,
			spellDice: this.spellDice,
			powerLevel: this.powerLevel,
			spell: this.spell,
			options,
		};
	}

	static getSpeaker({ actor, scene, token }) {
		if (scene && token) return game.scenes.get(scene)?.tokens.get(token)?.actor;
		else return game.actors.get(actor);
	}

	async _updateObject(event, formData) {
		this._validateForm(event, formData);
		if (this.options.type === "spell") return this._handleRollSpell(formData);
		else return this._handleYZRoll(formData);
	}

	_validateForm(event, formData) {
		const isEmpty = Object.values(formData).every((value) => !value);
		const invalidArtifactField = !this.constructor.isValidArtifact(formData.artifact);
		if (isEmpty) {
			ui.notifications.error("No Dice Values input");
			event.target.base.focus();
			throw new Error("No Dice Values input");
		}
		if (invalidArtifactField) {
			event.target.artifact.focus();
			ui.notifications.error("Artifact Die input not recognized");
			throw new Error("Artifact Die input not recognized");
		}
		return;
	}

	async _handleRollSpell({ base, power }) {
		this.b = base;
		this.damage = power;
		const actor = FBLRollHandler.getSpeaker({
			actor: this.options.actorId,
			scene: this.options.sceneId,
			token: this.options.tokenId,
		});
		const subtractValue = this.spell.willpower.max + 1 - this.spell.willpower.value;
		await FBLRollHandler.modifyWillpower(actor, subtractValue, "subtract");
		return this.executeRoll();
	}

	_handleYZRoll({ base, skill, gear, artifact, modifier }) {
		this.b = base;
		this.s = skill;
		this.g = gear;
		this.a = artifact;
		if (modifier) this.modifyRoll(skill, modifier);
		return this.executeRoll();
	}

	generateTermFormula(number, term, flavor = "") {
		if (!number) return;
		return `${number}d${term}${flavor ? `[${flavor}]` : ""}`;
	}

	parseArtifacts(string = "", artifactName = "") {
		const artifacts = string.split(/[+, ]/).filter((term) => !!term);
		const terms = artifacts
			.reduce((array, artifact) => {
				let [num, term] = artifact.split(/d/);
				num = Number(num) || 1;
				const existTermIndex = array.findIndex((termVal) => termVal[0] === term);
				if (existTermIndex > -1) array[existTermIndex][1] += num;
				else array.push([term, num]);
				return array;
			}, [])
			.map(([term, num]) => this.generateTermFormula(num, term, artifactName));
		return terms.join("+");
	}

	modifyRoll(skill, modifier) {
		const modifiedSkill = parseInt(skill) + parseInt(modifier);
		if (modifiedSkill < 0) {
			this.s = 0;
			this.n = modifiedSkill;
		} else {
			this.s = modifiedSkill;
		}
	}

	getRollData() {
		const unlimitedPush = game.settings.get("forbidden-lands", "allowUnlimitedPush");
		// eslint-disable-next-line no-nested-ternary
		const maxPush = unlimitedPush ? Infinity : this.options.actorType === "monster" ? "0" : 1;
		return {
			name: this.title,
			maxPush: this.options.maxPush || maxPush,
			type: this.options.type,
		};
	}

	getRollOptions() {
		return {
			actorId: this.options.actorId,
			actorType: this.options.actorType,
			alias: this.options.alias,
			attribute: this.base.name,
			chance: this.spell.chance,
			isAttack: this.isAttack,
			damage: this.damage,
			tokenId: this.options.tokenId,
			sceneId: this.options.sceneId,
			item: this.gear.name,
			itemId: this.gear.itemId,
			willpower: this.options.willpower,
		};
	}

	static async rollConsumable(actor, identifier, options) {
		const consumable = actor.consumables[identifier];
		if (!consumable.value) return ui.notifications.warn(localizeString("WARNING.NO_CONSUMABLE"));
		const rollName = localizeString(consumable.label);
		const dice = CONFIG.fbl.consumableDice[consumable.value];
		const data = {
			name: rollName.toLowerCase(),
			maxPush: "0",
			type: "consumable",
		};
		const roll = FBLRoll.create(dice + `[${rollName}]`, data, options);
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	async rollConsumableArrowDice() {
		const { itemId, actorId, tokenId } = this.getRollOptions();
		const item = game.actors.get(actorId).items.get(itemId) || game.actors.tokens[tokenId].items.get(itemId);
		const isRangedGear = item.data.data.category === "ranged";
		const hasArrows = item.data.data.rangeItem === "arrows";

		if (isRangedGear && hasArrows) {
			const options = this.getRollOptions();
			const message = await FBLRollHandler.rollConsumable(game.actors.get(actorId), "arrows", options);
			const {
				data: { roll },
			} = message;
			const { terms } = JSON.parse(roll);
			const { result } = terms.shift().results.shift();
			return result <= 2 ? FBLRollHandler.decreaseConsumable(message.id) : message;
		}

		return null;
	}

	async executeRoll() {
		const formula = Object.values(this.roll)
			.filter((term) => term)
			.join("+");
		const roll = FBLRoll.create(formula, this.getRollData(), this.getRollOptions());
		// If Safe casting we might roll 0 dice.
		if (!roll.dice.length && roll.type === "spell") {
			roll._evaluated = true;
			return roll.toMessage();
		}
		// Roll the dice!
		await roll.roll({ async: true });
		this.rollConsumableArrowDice();
		return roll.toMessage();
	}

	static isValidArtifact(input) {
		const isEmpty = !input;
		const containsArtifactDice = !!input?.match(/[\d]*[d]8|10|12/i);
		const isDiceFormula = !input?.match(/[^\dd+, ]/i);
		return isEmpty || (isDiceFormula && containsArtifactDice);
	}

	static createRoll(data = {}, options = {}) {
		if (!data) console.warn("No roll data passed. Executing generic roll.");
		return new FBLRollHandler(data, { ...options, title: localizeString(data.title) || "ACTION.GENERIC" }).render(
			true,
		);
	}

	static async pushRoll(msg) {
		const push = async () => {
			await msg.roll.push({ async: true });
			return msg.roll.toMessage();
		};

		let speaker = this.getSpeaker(msg.data.speaker);

		if (!speaker) return push();
		else push();

		if (msg.roll.pushed) return await this.updateActor(msg.roll, speaker);
		else throw ui.notifications.error(localizeString("ERROR.NOT_PUSHED"));
	}

	static async updateActor(roll, speaker) {
		if (roll.gearDamage) await this.applyGearDamage(roll, speaker);
		if (roll.attributeTrauma) await this.applyAttributDamage(roll, speaker);
	}

	static async applyAttributDamage({ attributeTrauma, options: { attribute } = "" }, speaker) {
		let value = speaker?.attributes[attribute]?.value;
		if (!value) return;
		await this.modifyWillpower(speaker, attributeTrauma);

		value = Math.max(value - attributeTrauma, 0);

		if (value === 0) ui.notifications.notify(localizeString("NOTIFY.YOU_ARE_BROKEN"));
		if (value >= 0) return await speaker.update({ [`data.attribute.${attribute}.value`]: value });
	}

	static async applyGearDamage({ gearDamage, options: { itemId } = "" }, speaker) {
		const item = speaker.items.get(itemId);
		if (!item) return;

		const value = Math.max(item?.bonus - gearDamage, 0);

		if (value === 0) ui.notifications.notify(localizeString("NOTIFY.YOUR_ITEM_BROKE"));
		if (value >= 0)
			return await speaker.updateEmbeddedDocuments("Item", [{ _id: itemId, "data.bonus.value": value }]);
	}

	static async modifyWillpower(speaker, value, operation = "add") {
		let willpower = speaker.willpower;
		if (!willpower) return;

		willpower =
			operation === "add" ? Math.min(willpower.value + value, willpower.max) : Math.max(willpower.value - value);
		return await speaker.update({ "data.bio.willpower.value": willpower });
	}

	static async decreaseConsumable(messageId) {
		let {
			data: { speaker },
			roll: { name: consumable },
		} = game.messages.get(messageId);

		speaker = this.getSpeaker(speaker);
		if (speaker?.object instanceof Token) speaker = speaker.actor;

		let value = speaker.consumables[consumable].value;
		if (value <= 6) value = 0;
		else value -= 2;

		await speaker.update({ [`data.consumable.${consumable}.value`]: value });
	}
}

/**************************************************/
/*                                                */
/*                 YZUR OVERRIDES                 */
/*                                                */
/**************************************************/
YearZeroRollManager.registerRoll = function (cls = FBLRoll, i = 0) {
	CONFIG.Dice.rolls[i] = cls;
	CONFIG.Dice.rolls[i].CHAT_TEMPLATE = CONFIG.YZUR.ROLL.chatTemplate;
	CONFIG.Dice.rolls[i].TOOLTIP_TEMPLATE = CONFIG.YZUR.ROLL.tooltipTemplate;
	CONFIG.YZUR.ROLL.index = i;
};

export class FBLRoll extends YearZeroRoll {
	constructor(formula, data = {}, options = {}) {
		super(formula, data);
		this.options = options;
		this.type = data.type || "yz";
	}

	get damage() {
		return (this.options.damage || 0) + this.successCount;
	}

	getRollInfos(template = null) {
		template = template ?? CONFIG.YZUR?.ROLL?.infosTemplate;
		const context = {
			roll: this,
			attributeLabel: localizeString(this.options.attribute),
			gearLabel: localizeString(this.options.item),
		};
		return renderTemplate(template, context);
	}

	async toMessage(messageData = {}, { rollMode = null, create = true } = {}) {
		// Getting our own speaker data.
		const speaker = {
			alias: this.options.alias,
			actor: this.options.actorId,
			token: this.options.tokenId,
			scene: this.options.sceneId,
		};
		messageData = foundry.utils.mergeObject(
			{
				user: game.user.id,
				flavor: this.data.flavor,
				speaker: speaker,
				content: this.total,
				type: CONST.CHAT_MESSAGE_TYPES.ROLL,
			},
			messageData,
		);
		return await super.toMessage(messageData, { rollMode, create });
	}
}

YearZeroDie.prototype.getTooltipData = function () {
	return {
		formula: this.expression,
		banes: this.failure,
		total: this.success,
		faces: this.faces,
		number: this.number,
		type: this.type,
		isYearZeroDie: this.isYearZeroDie,
		flavor:
			this.options.flavor ??
			(CONFIG.YZUR?.DICE?.localizeDieTypes ? game.i18n.localize(`YZUR.DIETYPES.${this.constructor.name}`) : null),
		rolls: this.results.map((r) => {
			return {
				result: this.getResultLabel(r),
				classes: this.getResultCSS(r).filterJoin(" "),
				row: r.indexPush,
				col: r.indexResult,
			};
		}),
	};
};
