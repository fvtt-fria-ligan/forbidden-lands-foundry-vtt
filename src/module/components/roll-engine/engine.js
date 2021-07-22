import { YearZeroRoll, YearZeroDie } from "foundry-year-zero-roller/lib/yzur";
import localizeString from "../../utils/localize-string";

/**
 * @extends FormApplication
 * @description RollDialog class that is intended as a base class for various types of roll.
 *
 */

export class FBLRollHandler extends FormApplication {
	constructor({ attribute = {}, skill = {}, gear = {} }, options) {
		super({}, options);
		this.roll = {};
		this.base = attribute;
		this.skill = skill;
		this.gear = gear;
		this.artifact = gear?.artifactDie;
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
			template: "systems/forbidden-lands/templates/dice/dialog.hbs",
			width: "400",
			height: "auto",
			resizable: false,
		});
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find("#base").focus();
		html.find("input").focus((ev) => ev.currentTarget.select());
		html.find("#cancel").click(() => {
			this.close();
		});
	}

	getData(options = {}) {
		return {
			title: this.title,
			base: Number(this.base?.value) || 0,
			skill: Number(this.skill?.value) || 0,
			gear: Number(this.gear?.bonus) || 0,
			artifact: this.gear?.artifactDie || "",
			modifier: Number(this.mod) || 0,
			options,
		};
	}

	getRollData() {
		const unlimitedPush = game.settings.get("forbidden-lands", "allowUnlimitedPush");
		// eslint-disable-next-line no-nested-ternary
		const maxPush = unlimitedPush ? 100 : this.options.type !== "monster" ? 0 : 1;
		return {
			name: this.title,
			maxPush: maxPush,
		};
	}

	async _updateObject(event, formData) {
		this._validateForm(event, formData);
		this.b = formData.b;
		this.s = formData.s;
		this.g = formData.g;
		this.a = formData.a;
		if (formData.modifier) this.modifyRoll(formData.s, formData.modifier);
		return this.executeRoll();
	}

	_validateForm(event, formData) {
		const isEmpty = Object.values(formData).every((value) => !value);
		const invalidArtifactField = !this.constructor.isValidArtifact(formData.a);
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
		const roll = new YearZeroRoll(formula, { ...this.getRollData() });
		await roll.roll({ async: true });
		return roll.toMessage();
	}

	static createRoll(data = {}, options = {}) {
		if (!data) console.warn("No roll data passed. Executing generic roll.");
		return new FBLRollHandler(data, { ...options, title: localizeString(data.title) || "ACTION.GENERIC" }).render(
			true,
		);
	}

	static isValidArtifact(input) {
		const isEmpty = !input;
		const containsArtifactDice = !!input.match(/[\d]*[d]8|10|12/i);
		const isDiceFormula = !input.match(/[^\dd+, ]/i);
		return isEmpty || (isDiceFormula && containsArtifactDice);
	}
}

YearZeroRoll.prototype.getRollInfos = function (template = null) {
	template = template ?? CONFIG.YZUR?.ROLL?.infosTemplate;
	const context = {
		roll: this,
		attributeLabel: localizeString(this.data.attributeName),
		gearLabel: localizeString(this.data.gearName),
	};
	return renderTemplate(template, context);
};

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
