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
		},
		options,
	) {
		super({}, options);
		this.roll = {};
		this.base = attribute;
		this.skill = skill;
		this.gear = gear;
		this.artifact = gear?.artifactDie;
		this.modifier =
			options.modifiers.reduce((sum, mod) => (mod.value < 0 ? (sum += Number(mod.value)) : sum), 0) || 0;
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

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands"],
			template: "systems/forbidden-lands/templates/dice/dialog.hbs",
			width: "450",
			height: "auto",
			resizable: false,
		});
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
			options,
		};
	}

	getRollData() {
		const unlimitedPush = game.settings.get("forbidden-lands", "allowUnlimitedPush");
		// eslint-disable-next-line no-nested-ternary
		const maxPush = unlimitedPush ? Infinity : this.options.actorType === "monster" ? "0" : 1;
		return {
			name: this.title,
			maxPush: this.options.maxPush || maxPush,
		};
	}

	getRollOptions() {
		return {
			actorId: this.options.actorId,
			actorType: this.options.actorType,
			alias: this.options.alias,
			attribute: this.base.name,
			damage: this.gear.damage,
			tokenId: this.options.tokenId,
			sceneId: this.options.sceneId,
			item: this.gear.name,
			itemId: this.gear.itemId,
			willpower: this.options.willpower,
		};
	}

	static getSpeaker({ actor, scene, token }) {
		if (scene && token) return game.scenes.get(scene)?.tokens.get(token);
		else return game.actors.get(actor);
	}

	async _updateObject(event, formData) {
		this._validateForm(event, formData);
		this.b = formData.base;
		this.s = formData.skill;
		this.g = formData.gear;
		this.a = formData.artifact;
		if (formData.modifier) this.modifyRoll(formData.skill, formData.modifier);
		return this.executeRoll();
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

	async executeRoll() {
		const formula = Object.values(this.roll)
			.filter((term) => term)
			.join("+");
		const roll = FBLRoll.create(formula, this.getRollData(), this.getRollOptions());
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	static isValidArtifact(input) {
		const isEmpty = !input;
		const containsArtifactDice = !!input.match(/[\d]*[d]8|10|12/i);
		const isDiceFormula = !input.match(/[^\dd+, ]/i);
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
		if (speaker?.object instanceof Token) speaker = speaker.actor;

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
		await this.addWillpower(speaker, attributeTrauma);

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

	static async addWillpower(speaker, add) {
		let willpower = speaker.willpower;
		if (!willpower) return;

		willpower = Math.min(willpower.value + add, willpower.max);
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
