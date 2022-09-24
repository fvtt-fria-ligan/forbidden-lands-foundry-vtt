import { YearZeroRoll, YearZeroRollManager } from "./yzur.js";
import localizeString from "@utils/localize-string.js";
import safeParse from "@utils/safe-parse.js";
/**
 * @extends FormApplication
 * @description A Form Application that mimics Dialog, but provides more functionality in terms of data binds and handling of a roll object. Supports Forbidden Lands standard rolls and spell rolls.
 * @see Dialog
 */
export class FBLRollHandler extends FormApplication {
	constructor(
		{
			attribute = { label: "DICE.BASE", value: 0 },
			skill = { label: "DICE.SKILL", value: 0 },
			gear = { label: "DICE.GEAR", value: 0, artifactDie: "" },
			spell = {},
		},
		options = {}, // This object includes information that may be required to create the roll instance but not the dice rolled.
	) {
		super({}, options);
		this.roll = {};
		this.base = attribute;
		this.skill = skill;
		this.gear = gear;
		this.damage = options.damage || gear.damage;
		this.artifact = gear?.artifactDie;
		this.gears = options.gears || [];
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
		this.roll._b = this.generateTermFormula(val, "b", this.base?.name);
	}
	/**
	 * Skill Dice formula
	 */
	get s() {
		return this.roll._s;
	}
	set s(val) {
		this.roll._s = this.generateTermFormula(val, "s", this.skill?.name);
	}
	/**
	 * Gear Dice formula
	 */
	get g() {
		return this.roll._g;
	}
	set g(val) {
		if (Array.isArray(val)) {
			const value = val.map((item) => this.generateTermFormula(item[2], "g", item[1])).join("+");
			this.roll._g = value;
		} else this.roll._g = this.generateTermFormula(val, "g", this.gear?.name);
	}
	/**
	 * Artifact Dice formula
	 */
	get a() {
		return this.roll._a;
	}
	set a(val) {
		this.roll._a = this.parseArtifacts(val, this.gear?.name);
	}
	/**
	 * Negative Dice formula
	 */
	get n() {
		return this.roll._n;
	}
	set n(val) {
		this.roll._n = this.generateTermFormula(val, "n", "DICE.NEGATIVE");
	}

	/**
	 * Used to determine whether to display the damage information on the chat card.
	 */
	get isAttack() {
		return !!this.damage;
	}

	/**
	 * Calculates the total number of dice to roll on a spell roll. This is to separate the value from the Willpower spent.
	 */
	get spellDice() {
		let sum = this.base.value;
		if (this.spell.psych) ++sum;
		if (this.spell.safecast) sum -= this.spell.safecast;
		if (sum < 0) sum = 0;
		return sum;
	}

	/**
	 * Calculates the power level, once again separated from dice rolled and willpower spent.
	 */
	get powerLevel() {
		let sum;
		sum = this.spellDice;
		if (this.spell.ingredient) ++sum;
		if (this.spell.safecast) sum += this.spell.safecast;
		return sum;
	}

	/**
	 * Safecast rules are rather complex, this getter intends to avoid rolling negative dice if someone safecasts a 1 willpower roll without Psychic talent.
	 */
	get safecastMax() {
		return this.spell.psych || this.base.value > 1 ? 2 : 1;
	}

	/**
	 * Foundry override intended to customize the window render.
	 */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands"],
			width: "450",
			height: "auto",
			resizable: false,
		});
	}

	/**
	 * Foundry override allowing custom Roll Dialog template (used for spell rolls only atm. but intended to be extensible).
	 */
	get template() {
		return this.options.template || "systems/forbidden-lands/templates/components/roll-engine/dialog.hbs";
	}

	/**
	 * Foundry override providing handlerbars template with data it needs to render.
	 * @param {Object<any>} options a native Foundry parameter.
	 * @returns {Object<any>} data object used in rendering handlebars template.
	 */
	getData(options = {}) {
		return {
			title: this.title,
			dice: {
				base: this.base,
				skill: this.skill,
				gear: this.gear,
			},
			artifact: this.artifact,
			modifier: this.modifier,
			safecastMax: this.safecastMax,
			spellDice: this.spellDice,
			powerLevel: this.powerLevel,
			spell: this.spell,
			options,
		};
	}

	/**
	 * Guesses the correct ActorData of the character making a roll.
	 * @param {Object<Actor.id<string>, Scene.id<string>, Token.id<string>>} data object containing id references to the character making a roll.
	 * @returns {ActorData}
	 */
	static getSpeaker({ actor, scene, token }) {
		if (scene && token) return game.scenes.get(scene)?.tokens.get(token)?.actor;
		else return game.actors.get(actor);
	}

	/**
	 * Foundry override of window eventlisteners.
	 * @param {JQuerySerializeArrayElement} html
	 */
	activateListeners(html) {
		super.activateListeners(html);

		//These are used only in standard or Year Zero roll instances to add or remove modifiers to either input.
		const totalModifierInput = html[0].querySelector("input#modifier");
		const totalGearInput = html[0].querySelector("input#gear");
		const artifactInput = html[0].querySelector("input#artifact");

		//Focuses the Attribute input on load.
		html.find("#base").focus();
		//Selects the input text when an input gains focus.
		html.find("input").focus((ev) => ev.currentTarget.select());

		//Increments or decrements the input values for Attributes, Skills, and Gear
		html.find(".inc-dec-btns").click((ev) => {
			const type = $(ev.currentTarget).data("type");
			const operator = $(ev.currentTarget).data("operator");
			const input = html.find("#" + type);
			let value = parseInt(input.val(), 10) || 0;
			value += operator === "plus" ? 1 : -1;
			input.val(value > 0 ? value : 0);
		});

		//This lets us modify the Total Modifier input or Artifact input when a user checks or unchecks the optional modifiers.
		html.find("input.option").on("change", function () {
			const artifactRegex = /(\d*d(?:8|10|12))/gi;
			const artifact = this.dataset.value.match(artifactRegex);
			const modifier = {
				value: this.dataset.value.match(/([+-]\d+(?!d)|^\d+$)/i),
				item: {
					id: this.dataset.id,
					name: this.dataset.name,
					gearBonus: safeParse(this.dataset.gearBonus),
				},
			};
			//Handle artifact modifiers
			if (artifact) {
				const artifacts = artifactInput.value.match(artifactRegex) || [];
				if (this.checked) artifacts.push(artifact[0]);
				else artifacts.splice(artifacts.indexOf(artifact[0]), 1);
				artifactInput.value = artifacts.join("+");
			}

			if (modifier.value) {
				const totalBonusInput = modifier.item.gearBonus ? totalGearInput : totalModifierInput;
				let currentValue = Number(totalBonusInput.value);
				if (this.checked) currentValue += Number(modifier.value[0]);
				else currentValue -= Number(modifier.value[0]);
				totalBonusInput.value = currentValue;
			}
		});

		//**Spell Rolls** Similar to the listener in the actor sheet, it lets us increment the dice rolled based on willpower spent.
		html.find(".spend-willpower").on("click contextmenu", (ev) => {
			if (foundry.utils.isEmpty(this.spell)) return;

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

		//**Spell Rolls** Handles the modifiers for spell rolls.
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

		//We need to bind the cancel button to the FormApplication's close method.
		html.find("#cancel").click(() => {
			this.close();
		});
	}

	/**
	 * Foundry override. **REQUIRED by FormApplications**. This method handles the data that is derived from the FormApplication on a submit event.
	 * Not overriding this method will result in a thrown error.
	 * @description In this method we pass the formData onto the correct internal rollHandler.
	 * @param {JQueryEventConstructor} event
	 * @param {Object<String | null>} formData
	 * @returns private RollHandler
	 */
	async _updateObject(event, formData) {
		this._validateForm(event, formData);
		if (this.options.type === "spell") return this._handleRollSpell(formData);
		else return this._handleYZRoll(formData);
	}

	/**
	 * Validates whether a form is empty and contains a valid artifact string (if any).
	 * @param {JQueryEventConstructor} event
	 * @param {Object<String | null>} formData
	 * @returns true
	 */
	_validateForm(event, formData) {
		const isEmpty = Object.values(formData).every((value) => !value);
		const invalidArtifactField = !this.constructor.isValidArtifact(formData.artifact);
		if (isEmpty) {
			const warning = localizeString("WARNING.NO_DICE_INPUT");
			event.target.base.focus();
			ui.notifications.warn(warning);
			throw new Error(warning);
		}
		if (invalidArtifactField) {
			const warning = localizeString("WARNING.INVALID_ARTIFACT");
			event.target.artifact.focus();
			ui.notifications.error(warning);
			throw new Error(warning);
		}
		return;
	}

	/**
	 * Handler for Spell roll. Takes total spelldice and powerlevel and stores in constructor then calls executeRoll.
	 * @param {Object<number>} data passed from formData.
	 * @returns method initiating roll.
	 */
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

	/**
	 * Handler for standard (Year Zero) rolls. Takes total amount of dice and stores in constructor then calls executeRoll.
	 * @param {Object<number} data passed from formData.
	 * @returns method initiating roll.
	 */
	_handleYZRoll({ base, skill, gear, artifact, modifier, ...modifierItems }) {
		// Handle optional gear
		if (Object.values(modifierItems).some((item) => item)) {
			const checkedItems = Object.entries(modifierItems)
				.filter((item) => item[1])
				.map((item) => item.shift());
			gear = this._getModifierGear(checkedItems, gear);
		}
		this.b = base;
		this.s = skill;
		this.g = gear;
		this.a = artifact;
		this.modifier = modifier;
		// Handle automatically rolling arrow dice on ranged attacks.
		this.handleRollArrows();
		return this.executeRoll();
	}

	_getModifierGear(modifierItemsArray, gear) {
		const modifierGearArray = modifierItemsArray
			.filter((string) => string.startsWith("true"))
			.map((string) => string.split("_"));
		if (this.gear.value) modifierGearArray.unshift([this.gear.itemId, this.gear.label, this.gear.value]);
		const modTotal = modifierGearArray.reduce((acc, [_, __, value]) => acc + Number(value), 0);
		if (Number(gear) - modTotal > 0) modifierGearArray.push(["", "YZUR.DIETYPES.GearDie", Number(gear) - modTotal]);
		return modifierGearArray;
	}
	/**
	 * Generates a roll formula based on number of dice.
	 * @param {number} number number of dice rolled.
	 * @param {string} term YZUR internal naming convention for DieTerms. E.g. "base".
	 * @param {string} flavor usually the name of the die term. E.g. "Strength".
	 * @returns {string} valid Roll formula.
	 * @see Roll
	 */
	generateTermFormula(number, term, flavor = "") {
		if (!number) return;
		flavor = localizeString(flavor);
		return `${number}d${term}${flavor ? `[${flavor}]` : ""}`;
	}

	/**
	 * Generates a roll formula for artifacts.
	 * @param {string} string Artifact string passed from formData.
	 * @param {string} artifactName Name of the Artifact, used for flavor.
	 * @returns valid Roll formula
	 * @see generateTermFormula
	 * @see Roll
	 */
	parseArtifacts(string = "", artifactName = "") {
		const artifacts = string.split(/[+, ]/).filter((term) => !!term && term !== "0");
		const terms = artifacts
			.reduce((array, artifact) => {
				let [num, term] = artifact.split(/d/i);
				num = Number(num) || 1;
				const existTermIndex = array.findIndex((termVal) => termVal[0] === term);
				if (existTermIndex > -1) array[existTermIndex][1] += num;
				else array.push([term, num]);
				return array;
			}, [])
			.map(([term, num]) => this.generateTermFormula(num, term, artifactName));
		return terms.join("+");
	}

	/**
	 * Generates an options object to pass on to YZUR. Useful for storing important information about the roll.
	 * @returns {Object<any>} catch-all options object. Contains all non-dice related options.
	 */
	getRollOptions() {
		const unlimitedPush = this.options.unlimitedPush;
		// Strictly speaking, unlimited push means 'Infinity' pushes,
		// however Infinity is finicky to serialize.
		// So we use a sufficiently large number instead.
		// eslint-disable-next-line no-nested-ternary
		const maxPush = unlimitedPush ? 10000 : this.options.actorType === "monster" ? "0" : 1;
		return {
			name: this.title,
			maxPush: this.options.maxPush || maxPush,
			type: this.options.type,
			actorId: this.options.actorId,
			actorType: this.options.actorType,
			alias: this.options.alias,
			attribute: this.base.name,
			chance: this.spell.chance,
			isAttack: this.isAttack,
			consumable: this.options.consumable,
			damage: this.damage,
			tokenId: this.options.tokenId,
			sceneId: this.options.sceneId,
			item: this.gear.name || this.gears.map((gear) => gear.name),
			itemId: this.gear.itemId || this.spell?.item?.id || this.gears.map((gear) => gear.id),
			willpower: this.options.willpower,
		};
	}

	async handleRollArrows() {
		const isCharacter = this.options.actorType === "character";
		const isRanged = this.gear.category === "ranged";
		const hasArrows = this.gear.ammo === "arrows";
		if (!(isCharacter && isRanged && hasArrows)) return;
		const actor = this.constructor.getSpeaker({
			actor: this.options.actorId,
			scene: this.options.sceneId,
			token: this.options.tokenId,
		});
		return setTimeout(() => actor.sheet.rollConsumable("arrows"), 500);
	}

	/**
	 * Takes rollData and rollOptions objects and produces a YZUR roll that is evaluated and sent to chat.
	 * @returns ChatMessage
	 * @see getRollOptions
	 * @see ChatMessage
	 */
	async executeRoll() {
		const formula = Object.values(this.roll)
			.filter((term) => term)
			.join("+");
		const roll = FBLRoll.create(
			formula,
			{} /* We pass no "data" for the roll to evaluate */,
			this.getRollOptions(),
		);
		// If Safe casting we might roll 0 dice.
		if (!roll.dice.length && roll.type === "spell") {
			roll._evaluated = true;
			return roll.toMessage();
		}
		// If roll is modified call modify Roll
		if (this.modifier) await roll.modify(this.modifier);
		// Roll the dice!
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	/* -------------------------------------- */
	/*           STATIC METHODS               */
	/* -------------------------------------- */

	/**
	 * Determines whether the input resolves to a valid artifact. Used to determine whether the user has input a valid Artifact string.
	 * @param {string} input
	 * @returns true
	 * @see _validateForm
	 */
	static isValidArtifact(input) {
		const isEmpty = !input || "0";
		const containsArtifactDice = !!input?.match(/(\d*d(?:8|10|12))/i);
		const isDiceFormula = !input?.match(/[^\dd+, ]/i);
		return isEmpty || (isDiceFormula && containsArtifactDice);
	}

	/**
	 *
	 * @param {Object<any>} data data object predominantly containing information about dice. See constructor.
	 * @param {Object<any>} options catch-all for other related information.
	 * @returns rendered instance of FBLRollHandler
	 * @see constructor
	 */
	static createRoll(data = {}, options = {}) {
		if (!data) console.warn("No roll data passed. Executing generic roll.");
		return new FBLRollHandler(data, { ...options, title: localizeString(data.title) || "ACTION.GENERIC" }).render(
			true,
		);
	}

	/**
	 * Handles pushing of a roll. Mainly by utilizing YZUR push method. Then updating the character pushing the roll with attribute, gear damage and willpower.
	 * @param {ChatMessage} msg the chat message that was clicked when pushing the roll.
	 * @returns pushes then updates actor or simply pushes the roll if no actor is presented.
	 */
	static async pushRoll(msg) {
		const roll = msg.roll;
		await roll.push({ async: true });

		let speaker = this.getSpeaker(msg.speaker);
		if (speaker) await this.updateActor(roll, speaker);

		return roll.toMessage();
	}

	/**
	 * Handles attribute and gear damage to actor.
	 * @param {FBLRoll} roll
	 * @param {ActorData} speaker
	 */
	static async updateActor(roll, speaker) {
		// We need to keep track of how much damage has been done to the actor in case it's a Dwarf and allowed unlimited pushes.
		if (!roll.options.characterDamage) roll.options.characterDamage = { gear: 0, attribute: 0 };
		if (roll.gearDamage) await this.applyGearDamage(roll, speaker);
		if (roll.attributeTrauma) await this.applyAttributDamage(roll, speaker);
		roll.options.characterDamage = { gear: roll.gearDamage || 0, attribute: roll.attributeTrauma || 0 };
	}

	/**
	 * Applies attribute damage and calls modify willpower.
	 * @param {Roll} roll
	 * @param {ActorData} speaker
	 * @returns updates actor with attribute trauma.
	 */
	static async applyAttributDamage({ attributeTrauma, options: { attribute, characterDamage } }, speaker) {
		let { attribute: appliedDamage } = characterDamage;
		const currentDamage = attributeTrauma - appliedDamage;

		let value = speaker?.attributes[attribute]?.value;
		if (!value) return;

		await this.modifyWillpower(speaker, currentDamage);

		value = Math.max(value - currentDamage, 0);

		if (value === 0) ui.notifications.notify(localizeString("NOTIFY.YOU_ARE_BROKEN"));
		await speaker.update({ [`system.attribute.${attribute}.value`]: value });
	}

	/**
	 * Applies gear damage.
	 * @param {Roll} roll
	 * @param {ActorData} speaker
	 * @returns updates actor with gear damage.
	 */
	static async applyGearDamage({ gearDamageByName }, speaker) {
		// This only gets the gear damage by name which is not resilient.
		const items = Object.keys(gearDamageByName).map((itemName) =>
			itemName ? speaker.items.getName(itemName) : null,
		);
		if (!items.length) return;
		const updatedItems = items
			.filter((item) => item)
			.map((item) => {
				const value = Math.max(item.bonus - gearDamageByName[item.name], 0);
				if (value === 0) ui.notifications.notify(localizeString("NOTIFY.YOUR_ITEM_BROKE"));
				return {
					_id: item.id,
					"system.bonus.value": value,
				};
			});
		await speaker.updateEmbeddedDocuments("Item", updatedItems);
	}

	/**
	 * Modifies willpower by either adding (default) or subtracting willpower from the Actor.
	 * @param {ActorData} speaker
	 * @param {number} value number of willpower to add or subtract.
	 * @param {string} operation essentially a boolean.
	 * @returns updates actor with willpower changes.
	 */
	static async modifyWillpower(speaker, value, operation = "add") {
		let willpower = speaker.willpower;
		if (!willpower) return;

		willpower =
			operation === "add"
				? Math.min(willpower.value + value, willpower.max)
				: Math.max(willpower.value - value, 0);
		return await speaker.update({ "data.bio.willpower.value": willpower });
	}

	/**
	 * Attempts to update the Actor with a new consumable value.
	 * @param {string} messageId
	 * @returns updates actor with changes to the consumable.
	 */
	static async decreaseConsumable(messageId) {
		let {
			data: { speaker },
			roll: {
				options: { consumable },
			},
		} = game.messages.get(messageId);

		speaker = this.getSpeaker(speaker);
		if (!speaker) return console.error("Could not decrease consumable: No actor found.");

		const currentValue = speaker?.consumables[consumable]?.value;
		const newValue = Math.max(currentValue - 1, 0);
		return await speaker.update({ [`data.consumable.${consumable}.value`]: newValue });
	}
}

/**************************************************/
/*                                                */
/*                 YZUR OVERRIDES                 */
/*                                                */
/**************************************************/

/**
 * @override Register FBLRoll as rollclass and remove chat templates to support normal dice rolls.
 */
YearZeroRollManager.registerRoll = function (cls = FBLRoll, i = 1) {
	CONFIG.Dice.rolls[i] = cls;
	CONFIG.Dice.rolls[i].CHAT_TEMPLATE = CONFIG.YZUR.ROLL.chatTemplate;
	CONFIG.Dice.rolls[i].TOOLTIP_TEMPLATE = CONFIG.YZUR.ROLL.tooltipTemplate;
	CONFIG.YZUR.ROLL.index = i;
};

export class FBLRoll extends YearZeroRoll {
	constructor(formula, data = {}, options = {}) {
		super(formula, data, options);
		this.type = options.type || "yz";
	}

	get isOwner() {
		return game.actors.get(this.options.actorId)?.isOwner ?? null;
	}

	get damage() {
		const modifier = this.type === "spell" ? 0 : -1;
		return (this.options.damage || 0) + Math.max(this.successCount + modifier, 0);
	}

	get gearDamageByName() {
		return this.getTerms("gear").reduce((obj, term) => {
			obj[term.flavor] = term.failure;
			return obj;
		}, {});
	}

	// Override the create method to use FBLRoll class
	static create(formula, data = {}, options = {}) {
		return new this(formula, data, options);
	}

	getRollInfos(template = null) {
		template = template ?? CONFIG.YZUR?.ROLL?.infosTemplate;
		const context = {
			roll: this,
			attributeLabel: localizeString(this.options.attribute),
			gears: Object.entries(this.gearDamageByName).map((gear) => ({
				name: localizeString(gear[0]),
				value: gear[1],
			})),
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
				flavor: this.flavor,
				speaker: speaker,
				content: this.total,
				type: CONST.CHAT_MESSAGE_TYPES.ROLL,
			},
			messageData,
		);
		return await super.toMessage(messageData, { rollMode, create });
	}
}
