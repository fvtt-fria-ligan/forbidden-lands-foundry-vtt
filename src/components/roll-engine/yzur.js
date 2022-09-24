/**
 * ===============================================================================
 * YZUR:
 * YEAR ZERO UNIVERSAL DICE ROLLER FOR THE FOUNDRY VTT
 * ===============================================================================
 * Author: @Stefouch
 * Version: 5.0.0          for: Foundry VTT V9
 * Date: 2022-05-22
 * License: MIT
 * ===============================================================================
 * Content:
 *
 * - YearZeroRollManager: Interface for registering dice.
 *
 * - YearZeroRoll: Custom implementation of the default Foundry Roll class,
 * with many extra getters and utility functions.
 *
 * - YearZeroDie: Custom implementation of the default Foundry DieTerm class,
 * also with many extra getters.
 *
 * - (Base/Skill/Gear/etc..)Die: Extends of the YearZeroDie class with specific
 * DENOMINATION and LOCKED_VALUE constants.
 *
 * - CONFIG.YZUR.game: The name of the game stored in the Foundry config.
 *
 * - CONFIG.YZUR.Icons.{..}: The dice labels stored in the Foundry config.
 *
 * ===============================================================================
 */

/* -------------------------------------------- */
/*  Custom Dice classes                         */
/* -------------------------------------------- */

/**
 * Custom Die class for Year Zero games.
 * @extends {Die} The Foundry Die class
 */
class YearZeroDie extends Die {
	constructor(termData = {}) {
		termData.faces = termData.faces || 6;
		super(termData);

		if (this.maxPush == undefined) {
			this.maxPush = termData.maxPush ?? 1;
		}
	}

	/**
	 * The type of the die.
	 * @type {DieTypeString}
	 * @readonly
	 */
	get type() {
		return this.constructor.TYPE;
	}

	/**
	 * Whether the die can be pushed (according to its type).
	 * @type {boolean}
	 * @readonly
	 */
	get pushable() {
		if (this.pushCount >= this.maxPush) return false;
		for (const r of this.results) {
			if (!r.active || r.discarded) continue;
			if (!this.constructor.LOCKED_VALUES.includes(r.result)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Number of times this die has been pushed.
	 * @type {number}
	 * @readonly
	 */
	get pushCount() {
		return this.results.reduce((c, r) => Math.max(c, r.indexPush || 0), 0);
	}

	/**
	 * Whether this die has been pushed.
	 * @type {boolean}
	 * @readonly
	 */
	get pushed() {
		return this.pushCount > 0;
	}

	/**
	 * Tells if it's a YearZero Die.
	 * @type {boolean}
	 * @readonly
	 */
	get isYearZeroDie() {
		// return this instanceof YearZeroDie;
		return true;
	}

	/**
	 * Number of successes rolled.
	 * @type {number}
	 * @readonly
	 */
	get success() {
		if (!this._evaluated) return undefined;
		const s = this.results.reduce((tot, r) => {
			if (!r.active) return tot;
			if (r.count !== undefined) return tot + r.count;
			if (this.constructor.SUCCESS_TABLE) {
				return tot + this.constructor.SUCCESS_TABLE[r.result];
			}
			return tot + (r.result >= 6 ? 1 : 0);
		}, 0);
		return this.type === "neg" ? -s : s;
	}

	/**
	 * Number of banes rolled.
	 * @type {number}
	 * @readonly
	 */
	get failure() {
		if (!this._evaluated) return undefined;
		return this.results.reduce((tot, r) => {
			if (!r.active) return tot;
			return tot + (r.result <= 1);
		}, 0);
	}

	/* -------------------------------------------- */

	/**
	 * Rolls the DiceTerm by mapping a random uniform draw against the faces of the dice term.
	 * @param {Object}  [options={}]             Options which modify how a random result is produced
	 * @param {boolean} [options.minimize=false] Minimize the result, obtaining the smallest possible value
	 * @param {boolean} [options.maximize=false] Maximize the result, obtaining the smallest possible value
	 * @returns {YearZeroDieTermResult} The produced result
	 * @see (Foundry) {@link https://foundryvtt.com/api/DiceTerm.html#roll|DiceTerm.roll}
	 * @override
	 */
	roll(options = {}) {
		// Modifies the result.
		const roll = super.roll(options);

		// Stores indexes
		roll.indexResult = options.indexResult;
		if (roll.indexResult == undefined) {
			roll.indexResult =
				1 +
				this.results.reduce((c, r) => {
					let i = r.indexResult;
					if (i == undefined) i = -1;
					return Math.max(c, i);
				}, -1);
		}
		roll.indexPush = options.indexPush ?? this.pushCount;

		// Overwrites the result.
		this.results[this.results.length - 1] = roll;
		return roll;
	}

	/* -------------------------------------------- */

	/**
	 * Counts the number of times a single value appears.
	 * @param {number} n The single value to count
	 * @returns {number}
	 */
	count(n) {
		return this.values.filter((v) => v === n).length;
	}

	/* -------------------------------------------- */

	/**
	 * Pushes the dice.
	 * @returns {YearZeroDie} this dice, pushed
	 */
	push() {
		if (!this.pushable) return this;
		const indexPush = this.pushCount + 1;
		const indexesResult = [];
		for (const r of this.results) {
			if (!r.active) continue;
			if (!this.constructor.LOCKED_VALUES.includes(r.result)) {
				// Removes the die from the total score.
				r.active = false;
				// Greys-out the die in the chat tooltip.
				r.discarded = true;
				// Marks the die as pushed.
				r.pushed = true;
				// Hides the die for DsN.
				r.hidden = true;
				// Stores the die's index for the chat tooltip.
				indexesResult.push(r.indexResult);
			} else {
				// Hides the die for DsN.
				r.hidden = true;
			}
		}

		// Then, rolls a new die for each pushed die.
		// With the indexes as options.
		for (let i = 0; i < indexesResult.length; i++) {
			this.roll({
				indexResult: indexesResult[i],
				indexPush,
			});
		}
		return this;
	}

	/* -------------------------------------------- */
	/*  Term Modifiers                              */
	/* -------------------------------------------- */

	/**
	 * Roll Modifier method that blocks pushes.
	 */
	nopush() {
		this.maxPush = 0;
	}

	/**
	 * Roll modifier method that sets the max number of pushes.
	 * @param {string} modifier
	 */
	setpush(modifier) {
		const rgx = /p([0-9]+)?/i;
		const match = modifier.match(rgx);
		if (!match) return false;
		let [, max] = match;
		max = parseInt(max) ?? 1;
		this.maxPush = max;
	}

	/* -------------------------------------------- */
	/*  Dice Term Methods                           */
	/* -------------------------------------------- */

	/**
	 * Returns a string used as the label for each rolled result.
	 * @param {YearZeroDieTermResult} result The rolled result
	 * @returns {string} The result label
	 * @see (FoundryVTT) {@link https://foundryvtt.com/api/DiceTerm.html#getResultLabel|DiceTerm.getResultLabel}
	 * @override
	 */
	getResultLabel(result) {
		// Do not forget to stringify the label because
		// numbers return an error with DiceSoNice!
		return CONFIG.YZUR.Icons.getLabel(this.constructor.TYPE, result.result);
	}

	/**
	 * Gets the CSS classes that should be used to display each rolled result.
	 * @param {YearZeroDieTermResult} result The rolled result
	 * @returns {string[]} The desired classes
	 * @see (FoundryVTT) {@link https://foundryvtt.com/api/DiceTerm.html#getResultCSS|DiceTerm.getResultCSS}
	 * @override
	 */
	getResultCSS(result) {
		// This is copy-pasted from the source code,
		// with modified parts between ==> arrows <==.
		const hasSuccess = result.success !== undefined;
		const hasFailure = result.failure !== undefined;
		//* Refactors the isMin & isMax for YZE dice.
		// const isMax = result.result === this.faces;
		// const isMin = result.result === 1;
		let isMax = false,
			isMin = false;
		if (this.type === "neg") {
			isMax = false;
			isMin = result.result === 6;
		} else if (this instanceof YearZeroDie) {
			const noMin = ["skill", "arto", "loc"];
			isMax = result.result === this.faces || result.result >= 6;
			isMin = result.result === 1 && !noMin.includes(this.type);
		} else {
			isMax = result.result === this.faces;
			isMin = result.result === 1;
		}
		//* <==
		return [
			this.constructor.name.toLowerCase(),
			"d" + this.faces,
			//* ==>
			// result.success ? 'success' : null,
			// result.failure ? 'failure' : null,
			hasSuccess ? "success" : null,
			hasFailure ? "failure" : null,
			//* <==
			result.rerolled ? "rerolled" : null,
			result.exploded ? "exploded" : null,
			result.discarded ? "discarded" : null,
			//* ==>
			//* Adds a CSS property for pushed dice.
			result.pushed ? "pushed" : null,
			//* <==
			!(hasSuccess || hasFailure) && isMin ? "min" : null,
			!(hasSuccess || hasFailure) && isMax ? "max" : null,
		];
	}

	/**
	 * Renders the tooltip HTML for a Roll instance.
	 * @returns {Object} The data object used to render the default tooltip template for this DiceTerm
	 * @see (FoundryVTT) {@link https://foundryvtt.com/api/DiceTerm.html#getTooltipData|DiceTerm.getTooltipData}
	 * @override
	 */
	getTooltipData() {
		// This is copy-pasted from the source code,
		// with modified parts between ==> arrows <==.
		return {
			formula: this.expression,
			//* ==>
			// total: this.total,
			total: this.success,
			banes: this.failure,
			//* <==
			faces: this.faces,
			//* ==>
			//* Adds the number of dice, used in the chat for the pushed dice matrix.
			number: this.number,
			//* Adds the type, for sorting options.
			type: this.type,
			//* Adds whether its a YearZeroDie.
			isYearZeroDie: this.isYearZeroDie,
			//* Adds a default flavor for the die.
			// flavor: this.flavor,
			flavor:
				this.options.flavor ??
				(CONFIG.YZUR?.Dice?.localizeDieTerms
					? game.i18n.localize(`YZUR.DIETERMS.${this.constructor.name}`)
					: null),
			//* <==
			rolls: this.results.map((r) => {
				return {
					result: this.getResultLabel(r),
					classes: this.getResultCSS(r).filterJoin(" "),
					//* ==>
					//* Adds row and col indexes.
					row: r.indexPush,
					col: r.indexResult,
					//* <==
				};
			}),
		};
	}
}

/**
 * The type of the die.
 * @type {string}
 * @constant
 * @static
 */
YearZeroDie.TYPE = "blank";

/**
 * An array of values that disallow the die to be pushed.
 * @type {number[]}
 * @constant
 * @static
 */
YearZeroDie.LOCKED_VALUES = [6];

/**
 * An array of additional attributes which should be retained when the term is serialized.
 * Addition: **maxPush**
 * @type {string[]}
 * @constant
 * @static
 * @inheritdoc
 */
YearZeroDie.SERIALIZE_ATTRIBUTES.push("maxPush");

/** @inheritdoc */
YearZeroDie.MODIFIERS = foundry.utils.mergeObject(
	{
		p: "setpush",
		np: "nopush",
	},
	Die.MODIFIERS,
);

/* -------------------------------------------- */

/**
 * Base Die: 1 & 6 cannot be re-rolled.
 * @extends {YearZeroDie}
 * @category OTHER DICE
 */
class BaseDie extends YearZeroDie {}
BaseDie.TYPE = "base";
BaseDie.DENOMINATION = "b";
BaseDie.LOCKED_VALUES = [1, 6];

/**
 * Skill Die: 6 cannot be re-rolled.
 * @extends {YearZeroDie}
 * @category OTHER DICE
 */
class SkillDie extends YearZeroDie {}
SkillDie.TYPE = "skill";
SkillDie.DENOMINATION = "s";

/**
 * Gear Die: 1 & 6 cannot be re-rolled.
 * @extends {YearZeroDie}
 * @category OTHER DICE
 */
class GearDie extends YearZeroDie {}
GearDie.TYPE = "gear";
GearDie.DENOMINATION = "g";
GearDie.LOCKED_VALUES = [1, 6];

/**
 * Negative Die: 6 cannot be re-rolled.
 * @extends {SkillDie}
 * @category OTHER DICE
 */
class NegativeDie extends SkillDie {}
NegativeDie.TYPE = "neg";
NegativeDie.DENOMINATION = "n";

/* -------------------------------------------- */

/**
 * Stress Die: 1 & 6 cannot be re-rolled.
 * @extends {YearZeroDie}
 * @category OTHER DICE
 */
class StressDie extends YearZeroDie {}
StressDie.TYPE = "stress";
StressDie.DENOMINATION = "z";
StressDie.LOCKED_VALUES = [1, 6];

/* -------------------------------------------- */

/**
 * Artifact Die: 6+ cannot be re-rolled.
 * @extends {SkillDie}
 * @category OTHER DICE
 */
class ArtifactDie extends SkillDie {
	/** @override */
	getResultLabel(result) {
		return CONFIG.YZUR.Icons.getLabel(`d${this.constructor.DENOMINATION}`, result.result);
	}
}
ArtifactDie.TYPE = "arto";
ArtifactDie.SUCCESS_TABLE = [null, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4];
ArtifactDie.LOCKED_VALUES = [6, 7, 8, 9, 10, 11, 12];

class D8ArtifactDie extends ArtifactDie {
	constructor(termData = {}) {
		termData.faces = 8;
		super(termData);
	}
}
D8ArtifactDie.DENOMINATION = "8";

class D10ArtifactDie extends ArtifactDie {
	constructor(termData = {}) {
		termData.faces = 10;
		super(termData);
	}
}
D10ArtifactDie.DENOMINATION = "10";

class D12ArtifactDie extends ArtifactDie {
	constructor(termData = {}) {
		termData.faces = 12;
		super(termData);
	}
}
D12ArtifactDie.DENOMINATION = "12";

/* -------------------------------------------- */

/**
 * Twilight Die: 1 & 6+ cannot be re-rolled.
 * @extends {ArtifactDie} But LOCKED_VALUES are not the same
 * @category OTHER DICE
 */
class TwilightDie extends ArtifactDie {
	/** @override */
	getResultLabel(result) {
		return CONFIG.YZUR.Icons.getLabel("base", result.result);
	}
}
TwilightDie.TYPE = "base";
TwilightDie.SUCCESS_TABLE = [null, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2];
TwilightDie.LOCKED_VALUES = [1, 6, 7, 8, 9, 10, 11, 12];

class D6TwilightDie extends TwilightDie {
	constructor(termData = {}) {
		termData.faces = 6;
		super(termData);
	}
}
D6TwilightDie.DENOMINATION = "6";

class D8TwilightDie extends TwilightDie {
	constructor(termData = {}) {
		termData.faces = 8;
		super(termData);
	}
}
D8TwilightDie.DENOMINATION = "8";

class D10TwilightDie extends TwilightDie {
	constructor(termData = {}) {
		termData.faces = 10;
		super(termData);
	}
}
D10TwilightDie.DENOMINATION = "10";

class D12TwilightDie extends TwilightDie {
	constructor(termData = {}) {
		termData.faces = 12;
		super(termData);
	}
}
D12TwilightDie.DENOMINATION = "12";

/* -------------------------------------------- */

/**
 * Ammunition Die for Twilight 2000.
 * @extends {YearZeroDie}
 * @category OTHER DICE
 */
class AmmoDie extends YearZeroDie {
	constructor(termData = {}) {
		termData.faces = 6;
		super(termData);
	}
}
AmmoDie.TYPE = "ammo";
AmmoDie.DENOMINATION = "m";
AmmoDie.LOCKED_VALUES = [1, 6];

/* -------------------------------------------- */

/**
 * Location/Hit Die for Twilight 2000.
 * @extends {YearZeroDie}
 * @category OTHER DICE
 */
class LocationDie extends YearZeroDie {
	constructor(termData = {}) {
		termData.faces = 6;
		super(termData);
	}
	/** @override */
	get pushable() {
		return false;
	}

	/** @override */
	roll(options) {
		const roll = super.roll(options);
		roll.count = 0;
		this.results[this.results.length - 1] = roll;
		return roll;
	}
}
LocationDie.TYPE = "loc";
LocationDie.DENOMINATION = "l";
LocationDie.LOCKED_VALUES = [1, 2, 3, 4, 5, 6];

/* -------------------------------------------- */

/**
 * BladeRunner Die: 1 cannot be re-rolled.
 * @extends {ArtifactDie} But LOCKED_VALUES are not the same
 * @category OTHER DICE
 */
class BladeRunnerDie extends ArtifactDie {
	/** @override */
	getResultLabel(result) {
		return CONFIG.YZUR.Icons.getLabel("base", result.result);
	}
}
BladeRunnerDie.TYPE = "base";
BladeRunnerDie.SUCCESS_TABLE = [null, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2];
BladeRunnerDie.LOCKED_VALUES = [1];

class D6BladeRunnerDie extends BladeRunnerDie {
	constructor(termData = {}) {
		termData.faces = 6;
		super(termData);
	}
}
D6BladeRunnerDie.DENOMINATION = "6";
D6BladeRunnerDie.LOCKED_VALUES = [1, 6];

class D8BladeRunnerDie extends BladeRunnerDie {
	constructor(termData = {}) {
		termData.faces = 8;
		super(termData);
	}
}
D8BladeRunnerDie.DENOMINATION = "8";
D8BladeRunnerDie.LOCKED_VALUES = [1, 6, 7, 8];

class D10BladeRunnerDie extends BladeRunnerDie {
	constructor(termData = {}) {
		termData.faces = 10;
		super(termData);
	}
}
D10BladeRunnerDie.DENOMINATION = "10";
D10BladeRunnerDie.LOCKED_VALUES = [1, 10];

class D12BladeRunnerDie extends BladeRunnerDie {
	constructor(termData = {}) {
		termData.faces = 12;
		super(termData);
	}
}
D12BladeRunnerDie.DENOMINATION = "12";
D12BladeRunnerDie.LOCKED_VALUES = [1, 10, 11, 12];

var YearZeroDice = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	YearZeroDie: YearZeroDie,
	BaseDie: BaseDie,
	SkillDie: SkillDie,
	GearDie: GearDie,
	NegativeDie: NegativeDie,
	StressDie: StressDie,
	ArtifactDie: ArtifactDie,
	D8ArtifactDie: D8ArtifactDie,
	D10ArtifactDie: D10ArtifactDie,
	D12ArtifactDie: D12ArtifactDie,
	TwilightDie: TwilightDie,
	D6TwilightDie: D6TwilightDie,
	D8TwilightDie: D8TwilightDie,
	D10TwilightDie: D10TwilightDie,
	D12TwilightDie: D12TwilightDie,
	AmmoDie: AmmoDie,
	LocationDie: LocationDie,
	BladeRunnerDie: BladeRunnerDie,
	D6BladeRunnerDie: D6BladeRunnerDie,
	D8BladeRunnerDie: D8BladeRunnerDie,
	D10BladeRunnerDie: D10BladeRunnerDie,
	D12BladeRunnerDie: D12BladeRunnerDie,
});

/* -------------------------------------------- */

/**
 * All constants used by YZUR which are stored in Foundry's `CONFIG.YZUR`.
 * @constant
 * @global
 * @property {!string} game The identifier for the game
 * @property {Object}           Chat                 Options for the chat
 * @property {boolean}         [Chat.showInfos=true] Whether to show the additional information under the roll result
 * @property {DieTypeString[]} [Chat.diceSorting=['base', 'skill', 'neg', 'gear', 'arto', 'loc', 'ammo']]
 *   Defines the default order
 * @property {Object}  Roll                 Options for the YearZeroRoll class
 * @property {!string} Roll.chatTemplate    Path to the chat template
 * @property {!string} Roll.tooltipTemplate Path to the tooltip template
 * @property {!string} Roll.infosTemplate   Path to the infos template
 * @property {Object}          Dice     Options for the YearZeroDie class
 * @property {boolean}        [Dice.localizeDieTypes=true]
 *   Whether to localize the type of the die
 * @property {DieTypeString[]} Dice.DIE_TYPES
 *   An array of YearZeroDie types
 * @property {Object.<DieTermString, class>}  Dice.DIE_TERMS
 *   An enumeration of YearZeroDie classes
 * @property {Object}    Icons    Options for the icons and what's on the die faces
 * @property {function} [Icons.getLabel=getLabel( type: DieTypeString, result: number )]
 *   A customizable helper function for creating the labels of the die.
 *   Note: You must return a string or DsN will throw an error.
 * @property {Object.<DieTypeString, Object.<string, string|number>>} Icons.yzGame
 *   Defines the labels for your dice. Change `yzGame` with the game identifier
 */
const YZUR = {
	game: "",
	Chat: {
		showInfos: true,
		diceSorting: ["base", "skill", "neg", "gear", "arto", "loc", "ammo"],
	},
	Roll: {
		chatTemplate: "templates/dice/roll.html",
		tooltipTemplate: "templates/dice/tooltip.html",
		infosTemplate: "templates/dice/infos.hbs",
	},
	Dice: {
		localizeDieTerms: true,
		DIE_TYPES: ["base", "skill", "neg", "gear", "stress", "arto", "ammo", "loc"],
		DIE_TERMS: {
			base: BaseDie,
			skill: SkillDie,
			neg: NegativeDie,
			gear: GearDie,
			stress: StressDie,
			artoD8: D8ArtifactDie,
			artoD10: D10ArtifactDie,
			artoD12: D12ArtifactDie,
			a: D12TwilightDie,
			b: D10TwilightDie,
			c: D8TwilightDie,
			d: D6TwilightDie,
			ammo: AmmoDie,
			loc: LocationDie,
			brD12: D12BladeRunnerDie,
			brD10: D10BladeRunnerDie,
			brD8: D8BladeRunnerDie,
			brD6: D6BladeRunnerDie,
		},
	},
	Icons: {
		/**
		 * A customizable helper function for creating the labels of the die.
		 * Note: You must return a string or DsN will throw an error.
		 * @param {DieTypeString} type
		 * @param {number} result
		 * @returns {string}
		 */
		getLabel: function (type, result) {
			const arto = ["d8", "d10", "d12"];
			if (arto.includes(type)) type = "arto";
			return String(CONFIG.YZUR.Icons[CONFIG.YZUR.game][type][result]);
		},
		myz: {
			base: {
				1: "☣",
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "☢",
			},
			skill: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "☢",
			},
			neg: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "➖",
			},
			gear: {
				1: "💥",
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "☢",
			},
		},
		fbl: {
			base: {
				1: "☠",
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "⚔️",
			},
			skill: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "⚔️",
			},
			neg: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "➖",
			},
			gear: {
				1: "💥",
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "⚔️",
			},
			arto: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: 6,
				7: 7,
				8: 8,
				9: 9,
				10: 10,
				11: 11,
				12: 12,
			},
		},
		alien: {
			skill: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "💠", // '❇',
			},
			stress: {
				1: "😱", // '⚠',
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "💠",
			},
		},
		tales: {
			skill: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "⚛️", // '👑',
			},
		},
		cor: {
			skill: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "🐞",
			},
		},
		vae: {
			skill: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "🦋",
			},
		},
		t2k: {
			base: {
				1: "💥",
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: 6,
				7: 7,
				8: 8,
				9: 9,
				10: 10,
				11: 11,
				12: 12,
			},
			ammo: {
				1: "💥",
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: "🎯",
			},
			loc: {
				1: "L",
				2: "T",
				3: "T",
				4: "T",
				5: "A",
				6: "H",
			},
		},
		br: {
			base: {
				1: "🦄",
				2: 2,
				3: 3,
				4: 4,
				5: 5,
				6: 6,
				7: 7,
				8: 8,
				9: 9,
				10: 10,
				11: 11,
				12: 12,
			},
		},
	},
};

/* -------------------------------------------- */
/*  Definitions                                 */
/* -------------------------------------------- */

/**
 * Defines a Year Zero game.
 * - `myz`: Mutant Year Zero
 * - `fbl`: Forbidden Lands
 * - `alien`: Alien RPG
 * - `cor`: Coriolis The Third Horizon
 * - `tales`: Tales From the Loop & Things From the Flood
 * - `vae`: Vaesen
 * - `t2k`: Twilight 2000
 * - `br`: Blade Runner RPG
 * @typedef {string} GameTypeString
 */

/**
 * Defines a term of a YZ die. It's a shortcut to its class.
 * - `base`: Base Die (locked on 1 and 6, trauma on 1)
 * - `skill`: Skill Die (locked on 6)
 * - `gear`: Gear Die (locked on 1 and 6, gear damage on 1)
 * - `neg`: Negative Die (locked on 6, negative success)
 * - `stress`: Stress Die (locked on 1 and 6, stress, panic)
 * - `artoD8`: D8 Artifact Die (locked on 6+, multiple successes)
 * - `artoD10`: D10 Artifact Die (locked on 6+, multiple successes)
 * - `artoD12`: D12 Artifact Die (locked on 6+, multiple successes)
 * - `a`: Twilight 2000's D12 Die (locked on 1 and 6+, multiple successes)
 * - `b`: Twilight 2000's D10 Die (locked on 1 and 6+, multiple successes)
 * - `c`: Twilight 2000's D8 Die (locked on 1 and 6+)
 * - `d`: Twilight 2000's D6 Die (locked on 1 and 6+)
 * - `ammo`: Twilight 2000's Ammo Die (locked on 1 and 6, not success but hit)
 * - `loc`: Twilight 2000's Location Die
 * - `brD12`: Blade Runner's D12 Die (locked on 1 and 10+)
 * - `brD10`: Blade Runner's D10 Die (locked on 1 and 10)
 * - `brD8`: Blade Runner's D8 Die (locked on 1 and 6+)
 * - `brD6`: Blade Runner's D6 Die (locked on 1 and 6)
 * @typedef {string} DieTermString
 */

/**
 * Defines a type of a YZ die, its generic role and function.
 * - `base`: Base Die
 * - `skill`: Skill Die
 * - `gear`: Gear Die
 * - `neg`: Negative Die
 * - `stress`: Stress Die
 * - `arto`: Artifact Die
 * - `ammo`: Ammo Die
 * - `loc`: Location Die
 * @typedef {string} DieTypeString
 */

/**
 * Defines a YZ die's denomination.
 * @typedef {string} DieDeno
 */

/**
 * An object that is used to build a new class that extends the YearZeroDie class.
 * @typedef {Object} DieClassData
 * @property {!string}        name          The name of the new Die class
 * @property {!DieDeno}       denomination  The denomination of the new Die class
 * @property {!faces}         faces         The number of faces of the new Die class
 * @property {DieTypeString} [type]         The type of the new Die class
 * @property {number[]}      [lockedValues] An array of values that disallow the die to be pushed
 */

/**
 * An object that is used to define a YearZero DieTerm.
 * @typedef  {Object}   TermBlok
 * @property {!DieDeno} term     The denomination of the dice to create
 * @property {!number}  number   The quantity of those dice
 * @property {string}  [flavor]  (optional) Any flavor tied to those dice
 * @property {number}  [maxPush] (optional) Special maxPush modifier but only for the those dice
 */

/**
 * Result of a rolled YearZero DieTerm.
 * @typedef {Object} YearZeroDieTermResult
 * @property {!number} result      The numeric result
 * @property {boolean} active      Is this result active, contributing to the total?
 * @property {number}  count       A value that the result counts as, otherwise the result is not used directly as
 * @property {boolean} success     Does this result denote a success?
 * @property {boolean} failure     Does this result denote a failure?
 * @property {boolean} discarded   Was this result discarded?
 * @property {boolean} rerolled    Was this result rerolled?
 * @property {boolean} exploded    Was this result exploded?
 * @property {boolean} pushed      ✨ Was this result pushed?
 * @property {boolean} hidden      ✨ Hides the die for DsN
 * @property {number}  indexResult ✨ Index of the result, and column position in the chat tooltip
 * @property {number}  indexPush   ✨ Index of the push, and row position in the chat tooltip
 * @see ✨ Extra features added by the override.
 * @see (FoundryVTT) {@link https://foundryvtt.com/api/global.html#DiceTermResult|DieTermResult}
 */

/* -------------------------------------------- */

class GameTypeError extends TypeError {
	constructor(msg) {
		super(`Unknown game: "${msg}". Allowed games are: ${YearZeroRollManager.GAMES.join(", ")}.`);
		this.name = "YZUR | GameType Error";
	}
}

class DieTermError extends TypeError {
	constructor(msg) {
		super(`Unknown die term: "${msg}". Allowed terms are: ${Object.keys(CONFIG.YZUR.Dice.DIE_TERMS).join(", ")}.`);
		this.name = "YZUR | DieTerm Error";
	}
}

// class RollError extends SyntaxError {
//   constructor(msg, obj) {
//     super(msg);
//     this.name = 'YZUR | Roll Error';
//     if (obj) console.error(obj);
//   }
// }

/* -------------------------------------------- */

/**
 * Custom Roll class for Year Zero games.
 * @extends {Roll} The Foundry Roll class
 */
class YearZeroRoll extends Roll {
	/**
	 * @param {string} formula The string formula to parse
	 * @param {Object}         [data]         The data object against which to parse attributes within the formula
	 * @param {GameTypeString} [data.game]    The game used
	 * @param {string}         [data.name]    The name of the roll
	 * @param {number}         [data.maxPush] The maximum number of times the roll can be pushed
	 * @param {Object}         [options]         Additional data which is preserved in the database
	 * @param {GameTypeString} [options.game]    The game used
	 * @param {string}         [options.name]    The name of the roll
	 * @param {number}         [options.maxPush] The maximum number of times the roll can be pushed
	 * @param {boolean}        [options.yzur]    Forces the roll of a YearZeroRoll in Foundry
	 */
	constructor(formula, data = {}, options = {}) {
		if (options.name == undefined) options.name = data.name;
		if (options.game == undefined) options.game = data.game;
		if (options.maxPush == undefined) options.maxPush = data.maxPush;

		super(formula, data, options);

		if (!this.game) this.game = CONFIG.YZUR.game ?? "myz";
		if (options.maxPush != undefined) this.maxPush = options.maxPush;
	}

	/* -------------------------------------------- */

	/**
	 * The game used.
	 * @type {string}
	 * @readonly
	 */
	get game() {
		return this.options.game;
	}
	set game(yzGame) {
		this.options.game = yzGame;
	}

	/**
	 * The name of the roll.
	 * @type {string}
	 * @readonly
	 */
	get name() {
		return this.options.name;
	}
	set name(str) {
		this.options.name = str;
	}

	/**
	 * The maximum number of pushes.
	 * @type {number}
	 */
	set maxPush(n) {
		this.options.maxPush = n;
		for (const t of this.terms) {
			if (t instanceof YearZeroDie) {
				t.maxPush = n;
			}
		}
	}
	get maxPush() {
		// Note: Math.max(null, n) returns a number between [0, n[.
		return this.terms.reduce((max, t) => (t instanceof YearZeroDie ? Math.max(max, t.maxPush) : max), null);
	}

	/**
	 * The total number of dice in the roll.
	 * @type {number}
	 * @readonly
	 */
	get size() {
		return this.terms.reduce((s, t) => (t instanceof YearZeroDie ? s + t.number : s), 0);
	}

	/**
	 * The number of times the roll has been pushed.
	 * @type {number}
	 * @readonly
	 */
	get pushCount() {
		return this.terms.reduce((c, t) => Math.max(c, t.pushCount || 0), 0);
	}

	/**
	 * Whether the roll was pushed or not.
	 * @type {boolean}
	 * @readonly
	 */
	get pushed() {
		return this.pushCount > 0;
	}

	/**
	 * Tells if the roll is pushable.
	 * @type {boolean}
	 * @readonly
	 */
	get pushable() {
		return (
			this.pushCount < this.maxPush && this.terms.some((t) => t.pushable)
			// && !this.mishap
		);
	}

	/**
	 * The quantity of successes.
	 * @type {number}
	 * @readonly
	 */
	get successCount() {
		return this.terms.reduce((sc, t) => sc + (t.success ?? 0), 0);
	}

	/**
	 * The quantity of ones (banes).
	 * @type {number}
	 * @readonly
	 */
	get baneCount() {
		// return this.terms.reduce((bc, t) => bc + t.failure, 0);
		const banableTypes = ["base", "gear", "stress", "ammo"];
		let count = 0;
		for (const bt of banableTypes) {
			count += this.count(bt, 1);
		}
		return count;
	}

	/**
	 * The quantity of traumas ("1" on base dice).
	 * @type {number}
	 * @readonly
	 */
	get attributeTrauma() {
		return this.count("base", 1);
	}

	/**
	 * The quantity of gear damage ("1" on gear dice).
	 * @type {number}
	 * @readonly
	 */
	get gearDamage() {
		return this.count("gear", 1);
	}

	/**
	 * The quantity of stress dice.
	 * @type {number}
	 * @readonly
	 */
	get stress() {
		return this.count("stress");
	}

	/**
	 * The quantity of panic ("1" on stress dice).
	 * @type {number}
	 * @readonly
	 */
	get panic() {
		return this.count("stress", 1);
	}

	/**
	 * Tells if the roll is a mishap (double 1's).
	 * @type {boolean}
	 * @readonly
	 * @deprecated
	 */
	get mishap() {
		// if (this.game !== 't2k') return false;
		// return this.baneCount >= 2 || this.baneCount >= this.size;
		console.warn("YZUR | YearZeroRoll#mishap is deprecated.");
		return false;
	}

	/**
	 * The quantity of ammo spent. Equal to the sum of the ammo dice.
	 * @type {number}
	 * @readonly
	 */
	get ammoSpent() {
		const mt = this.getTerms("ammo");
		if (!mt.length) return 0;
		return mt.reduce((tot, t) => tot + t.values.reduce((a, b) => a + b, 0), 0);
	}

	/**
	 * The quantity of successes on ammo dice.
	 * @type {number}
	 * @readonly
	 */
	get hitCount() {
		return this.count("ammo", 6);
	}

	/**
	 * The quantity of ones (banes) on base dice and ammo dice.
	 * @type {number}
	 * @readonly
	 */
	get jamCount() {
		const n = this.count("ammo", 1);
		return n > 0 ? n + this.attributeTrauma : 0;
	}

	/**
	 * Tells if the roll caused a weapon jam.
	 * @type {boolean}
	 * @readonly
	 */
	get jammed() {
		return this.pushed ? this.jamCount >= 2 : false;
	}

	/**
	 * The total successes produced by base dice.
	 * @type {number}
	 * @readonly
	 */
	get baseSuccessQty() {
		return this.successCount - this.hitCount;
	}

	/**
	 * The rolled hit locations.
	 * @type {number[]}
	 * @readonly
	 */
	get hitLocations() {
		const lt = this.getTerms("loc");
		if (!lt.length) return [];
		return lt.reduce((tot, t) => tot.concat(t.values), []);
	}

	/**
	 * The best rolled hit location.
	 * @type {number}
	 * @readonly
	 */
	get bestHitLocation() {
		if (!this.hitLocations.length) return undefined;
		return Math.max(...this.hitLocations);
	}

	/* -------------------------------------------- */
	/*  Static Class Methods                        */
	/* -------------------------------------------- */

	/**
	 * A factory method which constructs a Roll instance using the default configured Roll class.
	 * @param {string}  formula     The formula used to create the Roll instance
	 * @param {Object} [data={}]    The data object which provides component data for the formula
	 * @param {Object} [options={}] Additional options which modify or describe this Roll
	 * @returns {YearZeroRoll} The constructed Roll instance
	 * @see (FoundryVTT) {@link https://foundryvtt.com/api/Roll.html#.create|Roll.create}
	 * @override
	 */
	static create(formula, data = {}, options = {}) {
		return new YearZeroRoll(formula, data, options);
	}

	/* -------------------------------------------- */

	/**
	 * Generates a roll based on the number of dice.
	 * @param {TermBlok|TermBlok[]} dice An array of objects that define the dice
	 * @param {Object}         [data={}]        Additional data to forge the dice
	 * @param {string}         [data.title]     The name of the roll
	 * @param {GameTypeString} [data.yzGame]    The game used
	 * @param {number}         [data.maxPush=1] The maximum number of pushes
	 * @param {Object}         [options]        Additional data which is preserved in the database
	 * @returns {YearZeroRoll}
	 * @static
	 */
	static forge(dice = [], { title, yzGame = null, maxPush = 1 } = {}, options = {}) {
		// Checks the game.
		yzGame = yzGame ?? options.game ?? CONFIG.YZUR?.game;
		if (!YearZeroRollManager.GAMES.includes(yzGame)) throw new GameTypeError(yzGame);

		// Converts old format DiceQuantities.
		// ? Was: {Object.<DieTermString, number>}
		// ! This is temporary support. @deprecated
		const isOldFormat = !Array.isArray(dice) && typeof dice === "object" && !Object.keys(dice).includes("term");
		if (isOldFormat) {
			// eslint-disable-next-line max-len
			console.warn(
				`YZUR | ${YearZeroRoll.name} | You are using an old "DiceQuanties" format which is deprecated and could be removed in a future release. Please refer to ".forge()" for the newer format.`,
			);
			const _dice = [];
			for (const [term, n] of Object.entries(dice)) {
				if (n <= 0) continue;
				let deno = CONFIG.YZUR.Dice.DIE_TERMS[term].DENOMINATION;
				const cls = CONFIG.Dice.terms[deno];
				deno = cls.DENOMINATION;
				_dice.push({ term: deno, number: n });
			}
			dice = _dice;
		}

		// Converts to an array.
		if (!Array.isArray(dice)) dice = [dice];

		// Builds the formula.
		const out = [];
		for (const d of dice) {
			out.push(YearZeroRoll._getTermFormulaFromBlok(d));
		}
		let formula = out.join(" + ");

		if (!YearZeroRoll.validate(formula)) {
			console.warn(`YZUR | ${YearZeroRoll.name} | Invalid roll formula: "${formula}"`);
			formula = yzGame === "t2k" ? "1d6" : "1ds";
		}

		// Creates the roll.
		if (options.name == undefined) options.name = title;
		if (options.game == undefined) options.game = yzGame;
		if (options.maxPush == undefined) options.maxPush = maxPush;
		const roll = YearZeroRoll.create(formula, {}, options);
		if (CONFIG.debug.dice) console.log(roll);
		return roll;
	}

	/* -------------------------------------------- */

	/** @deprecated */
	// eslint-disable-next-line no-unused-vars
	static createFromDiceQuantities(dice = {}, { title, yzGame = null, maxPush = 1, push = false } = {}) {
		// eslint-disable-next-line max-len
		console.warn(
			"YZUR | createFromDiceQuantities() is deprecated and will be removed in a future release. Use forge() instead.",
		);
		return YearZeroRoll.forge(dice, { title, yzGame, maxPush });
	}

	/* -------------------------------------------- */

	/**
	 * Creates a roll formula based on a TermBlok.
	 * @see YearZeroRoll.generateTermFormula
	 * @param {TermBlok} termBlok
	 * @returns {string}
	 * @private
	 * @static
	 */
	static _getTermFormulaFromBlok(termBlok) {
		const { term, number, flavor, maxPush } = termBlok;
		return YearZeroRoll.generateTermFormula(number, term, flavor, maxPush);
	}

	/**
	 * Creates a roll formula based on number of dice.
	 * @param {number}  number   The quantity of those dice
	 * @param {DieDeno} term     The denomination of the dice to create
	 * @param {string} [flavor]  (optional) Any flavor tied to those dice
	 * @param {number} [maxPush] (optional) Special maxPush modifier but only for those dice
	 * @returns {string}
	 * @static
	 */
	static generateTermFormula(number, term, flavor = "", maxPush = null) {
		let f = `${number}d${term}`;
		if (typeof maxPush === "number") f += `p${maxPush}`;
		if (flavor) f += `[${flavor}]`;
		return f;
	}

	/* -------------------------------------------- */
	/*  YearZeroRoll Utility Methods                */
	/* -------------------------------------------- */

	/**
	 * Gets all the dice terms of a certain type or that match an object of values.
	 * @param {DieTypeString|{}} search Die type to search or an object with comparison values
	 * @returns {YearZeroDie[]|DiceTerm[]}
	 *
	 * @example
	 * // Gets all terms with the type "skill".
	 * let terms = getTerms('skill');
	 *
	 * // Gets all terms that have exactly these specifications (it follows the structure of a DiceTerm).
	 * let terms = getTerms({
	 *   type: 'skill',
	 *   number: 1,
	 *   faces: 6,
	 *   options: {
	 *     flavor: 'Attack',
	 *     // ...etc...
	 *   },
	 *   results: {
	 *     result: 3,
	 *     active: true,
	 *     // ...etc...
	 *   },
	 * });
	 */
	getTerms(search) {
		if (typeof search === "string") return this.terms.filter((t) => t.type === search);
		return this.terms.filter((t) => {
			let f = true;
			if (search.type != undefined) f = f && search.type === t.type;
			if (search.number != undefined) f = f && search.number === t.number;
			if (search.faces != undefined) f = f && search.faces === t.faces;
			if (search.options) {
				for (const key in search.options) {
					f = f && search.options[key] === t.options[key];
				}
			}
			if (search.results) {
				for (const key in search.results) {
					f = f && t.results.some((r) => r[key] === search.results[key]);
				}
			}
			return f;
		});
	}

	/* -------------------------------------------- */

	/**
	 * Counts the values of a certain type in the roll.
	 * If `seed` is omitted, counts all the dice of a certain type.
	 * @param {DieTypeString} type  The type of the die
	 * @param {number}       [seed] The value to search, if any
	 * @param {string}       [comparison='='] The comparison to use against the seed: `>`, `>=`, `<`, `<=` or `=`
	 * @returns {number} Total count
	 */
	count(type, seed = null, comparison = "=") {
		return this.terms.reduce((c, t) => {
			if (t.type === type) {
				if (t.results.length) {
					for (const r of t.results) {
						if (!r.active) continue;
						if (seed != null) {
							if (comparison === ">") {
								if (r.result > seed) c++;
							} else if (comparison === ">=") {
								if (r.result >= seed) c++;
							} else if (comparison === "<") {
								if (r.result < seed) c++;
							} else if (comparison === "<=") {
								if (r.result <= seed) c++;
							} else if (r.result === seed) {
								c++;
							}
						} else {
							c++;
						}
					}
				} else if (seed != null) {
					c += 0;
				} else {
					c += t.number;
				}
			}
			return c;
		}, 0);
	}

	/* -------------------------------------------- */

	/**
	 * Adds a number of dice to the roll.
	 * Note: If a negative quantity is passed, instead it removes that many dice.
	 * @param {number}        qty      The quantity to add
	 * @param {DieTermString} type     The type of dice to add
	 * @param {number}       [range=6] The number of faces of the die
	 * @param {number}       [value]   The predefined value for the new dice
	 * @param {Object}       [options] Additional options that modify the term
	 * @returns {Promise.<YearZeroRoll>} This roll
	 * @async
	 */
	async addDice(qty, type, { range = 6, value = null, options } = {}) {
		if (!qty) return this;
		const search = { type, faces: range, options };
		if (qty < 0) return this.removeDice(-qty, search);
		if (value != undefined && !this._evaluated) await this.roll({ async: true });

		let term = this.getTerms(search)[0];
		if (term) {
			for (; qty > 0; qty--) {
				term.number++;
				if (this._evaluated) {
					term.roll();
					// TODO missing term._evaluateModifiers() for this new result only
					if (value != undefined) {
						term.results[term.results.length - 1].result = value;
					}
				}
			}
		}
		// If the DieTerm doesn't exist, creates it.
		else {
			const cls = CONFIG.YZUR.Dice.DIE_TERMS[type];
			term = new cls({
				number: qty,
				faces: range,
				maxPush: this.maxPush ?? 1,
				options,
			});
			if (this._evaluated) {
				await term.evaluate({ async: true });
				if (value != undefined) {
					term.results.forEach((r) => (r.result = value));
				}
			}
			if (this.terms.length > 0) {
				// eslint-disable-next-line no-undef
				this.terms.push(new OperatorTerm({ operator: type === "neg" ? "-" : "+" }));
			}
			this.terms.push(term);
		}
		// Updates the cache of the Roll.
		this._formula = this.constructor.getFormula(this.terms);
		if (this._evaluated) this._total = this._evaluateTotal();

		return this;
	}

	/* -------------------------------------------- */

	/**
	 * Removes a number of dice from the roll.
	 * @param {number}           qty      The quantity to remove
	 * @param {DieTypeString|{}} search   The type of dice to remove, or an object of values for comparison
	 * @param {boolean}         [discard] Whether the term should be marked as "discarded" instead of removed
	 * @param {boolean}         [disable] Whether the term should be marked as "active: false" instead of removed
	 * @returns {YearZeroRoll} This roll
	 */
	removeDice(qty, search, { discard = false, disable = false } = {}) {
		if (!qty) return this;

		for (; qty > 0; qty--) {
			const term = this.getTerms(search)[0];
			if (term) {
				term.number--;
				if (term.number <= 0) {
					const type = search.type ?? search;
					const index = this.terms.findIndex((t) => t.type === type && t.number === 0);
					this.terms.splice(index, 1);
					if (this.terms[index - 1]?.operator) {
						this.terms.splice(index - 1, 1);
					}
				} else if (this._evaluated) {
					const index = term.results.findIndex((r) => r.active);
					if (index < 0) break;
					if (discard || disable) {
						if (discard) term.results[index].discarded = discard;
						if (disable) term.results[index].active = !disable;
					} else {
						term.results.splice(index, 1);
					}
				}
			} else {
				break;
			}
		}
		// Updates the cache of the Roll.
		this._formula = this.constructor.getFormula(this.terms);
		if (this._evaluated) {
			if (this.terms.length) this._total = this._evaluateTotal();
			else this._total = 0;
		}

		return this;
	}

	/* -------------------------------------------- */
	/*  Push                                        */
	/* -------------------------------------------- */

	/**
	 * Pushes the roll, following the YZ rules.
	 * @param {Object}  [options={}]          Options which inform how the Roll is evaluated
	 * @param {boolean} [options.async=false] Evaluate the roll asynchronously, receiving a Promise as the returned value
	 * @returns {Promise.<YearZeroRoll>} The roll instance, pushed
	 * @async
	 */
	async push({ async } = {}) {
		if (!this._evaluated) await this.evaluate({ async });
		if (!this.pushable) return this;

		// Step 1 — Pushes the terms.
		this.terms.forEach((t) => (t instanceof YearZeroDie ? t.push() : t));

		// Step 2 — Re-evaluates all pushed terms.
		//   The evaluate() method iterates each terms and runs only
		//   the term's own evaluate() method on new (pushed) dice.
		this._evaluated = false;
		await this.evaluate({ async });

		return this;
	}

	/* -------------------------------------------- */
	/*  Modify                                      */
	/* -------------------------------------------- */

	/**
	 * Applies a difficulty modifier to the roll.
	 * @param {number} mod Difficulty modifier (bonus or malus)
	 * @returns {Promise.<YearZeroRoll>} This roll, modified
	 * @async
	 */
	async modify(mod = 0) {
		if (!mod) return this;
		// TWILIGHT 2000 & BLADE RUNNER
		// --------------------------------------------
		else if (this.game === "t2k" || this.game === "br") {
			const diceMap = [null, 6, 8, 10, 12, Infinity];
			const typesMap = ["d", "d", "c", "b", "a", "a"];
			const refactorRange = (range, n) => diceMap[diceMap.indexOf(range) + n];
			const getTypeFromRange = (range) => typesMap[diceMap.indexOf(range)];

			const _terms = this.getTerms("base");
			const dice = _terms.flatMap((t) => new Array(t.number).fill(t.faces));

			// BLADE RUNNER
			if (this.game === "br") {
				// Gets the lowest term.
				const lowest = Math.min(...dice);

				// A positive modifier means advantage.
				// An advantage adds a third base die, same value as lowest.
				if (mod > 0) {
					dice.push(lowest);
				}
				// A negative modifier means disadvantage.
				// A disadvantage removes the lowest die.
				else if (mod < 0) {
					const i = dice.indexOf(lowest);
					dice.splice(i, 1);
				}
				mod = 0;
			}

			// TWILIGHT 2000
			else {
				// 1 — Modifies the dice ranges.
				while (mod !== 0) {
					let i;
					// 1.1.1 — A positive modifier increases the lowest term.
					if (mod > 0) {
						i = dice.indexOf(Math.min(...dice));
						dice[i] = refactorRange(dice[i], 1);
						mod--;
					}
					// 1.1.2 — A negative modifier decreases the highest term.
					else {
						i = dice.indexOf(Math.max(...dice));
						dice[i] = refactorRange(dice[i], -1);
						mod++;
					}
					// 1.2 — Readjusts term faces.
					if (dice[i] === Infinity) {
						dice[i] = refactorRange(dice[i], -1);
						if (dice.length < 2) {
							dice.push(diceMap[1]);
						}
					} else if (dice[i] === null) {
						if (dice.length > 1) {
							dice.splice(i, 1);
						} else {
							dice[i] = refactorRange(dice[i], 1);
						}
					} else if (dice[i] === undefined) {
						throw new Error(`YZUR | YearZeroRoll#modify<T2K> | dice[${i}] is out of bounds (mod: ${mod})`);
					}
				}
			}
			// 2 — Filters out all the base terms.
			//       This way, it will also remove leading operator terms.
			this.removeDice(100, "base");

			// 3 — Reconstructs the base terms.
			const skilled = _terms.length > 1 && dice.length > 1;
			for (let index = 0; index < dice.length; index++) {
				const ti = Math.min(index, skilled ? 1 : 0);
				await this.addDice(1, getTypeFromRange(dice[index]), {
					range: dice[index],
					options: foundry.utils.deepClone(_terms[ti].options),
				});
			}
			// Note: reconstructed terms are evaluated
			// at the end of this method.
		}
		// MUTANT YEAR ZERO & FORBIDDEN LANDS
		// --------------------------------------------
		else if (["myz", "fbl"].includes(this.game)) {
			// Modifies skill & neg dice.
			const skill = this.count("skill");
			const neg = Math.max(0, -mod - skill);
			await this.addDice(mod, "skill");
			if (neg > 0) await this.addDice(neg, "neg");

			// Balances skill & neg dice.
			while (this.count("skill") > 0 && this.count("neg") > 0) {
				this.removeDice(1, "skill");
				this.removeDice(1, "neg");
			}
		}
		// ALL OTHER GAMES (ALIEN RPG, CORIOLIS, VAESEN, TFTL, etc.)
		// --------------------------------------------
		else {
			const skill = this.count("skill");
			if (mod < 0) {
				// Minimum of 1 skill die.
				mod = Math.max(-skill + 1, mod);
			}
			await this.addDice(mod, "skill");
		}

		// --------------------------------------------

		// Re-evaluates all terms that were left unevaluated.
		if (this._evaluated) {
			for (const t of this.terms) {
				if (!t._evaluated) await t.evaluate();
			}
		}

		return this;
	}

	/* -------------------------------------------- */
	/*  Templating                                  */
	/* -------------------------------------------- */

	/**
	 * Renders the tooltip HTML for a Roll instance.
	 * @returns {Promise.<string>} The rendered HTML tooltip as a string
	 * @see (FoundryVTT) {@link https://foundryvtt.com/api/Roll.html#getTooltip|Roll.getTooltip}
	 * @async
	 * @override
	 */
	async getTooltip() {
		const parts = this.dice
			.map((d) => d.getTooltipData())
			// ==>
			.sort((a, b) => {
				const sorts = CONFIG?.YZUR?.Chat?.diceSorting || YZUR.Chat.diceSorting || [];
				if (!sorts.length) return 0;
				const at = sorts.indexOf(a.type);
				const bt = sorts.indexOf(b.type);
				return at - bt;
			});
		// <==
		// START MODIFIED PART ==>
		if (this.pushed) {
			// Converts "parts.rolls" into a matrix.
			for (const part of parts) {
				// Builds the matrix;
				const matrix = [];
				const n = part.number;
				let p = this.pushCount;
				for (; p >= 0; p--) matrix[p] = new Array(n).fill(undefined);

				// Fills the matrix.
				for (const r of part.rolls) {
					const row = r.row || 0;
					const col = r.col || 0;
					matrix[row][col] = r;
				}
				part.rolls = matrix;
			}
		}
		// // return renderTemplate(this.constructor.TOOLTIP_TEMPLATE, { parts });
		return renderTemplate(this.constructor.TOOLTIP_TEMPLATE, {
			parts,
			pushed: this.pushed,
			pushCounts: this.pushed ? [...Array(this.pushCount + 1).keys()].sort((a, b) => b - a) : undefined,
			config: CONFIG.YZUR ?? {},
		});
		// <== END MODIFIED PART
	}

	/* -------------------------------------------- */

	/**
	 * Renders the infos of a Year Zero roll.
	 * @param {string} [template] The path to the template
	 * @returns {Promise.<string>}
	 * @async
	 */
	async getRollInfos(template = null) {
		template = template ?? CONFIG.YZUR?.Roll?.infosTemplate;
		const context = { roll: this };
		return renderTemplate(template, context);
	}

	/* -------------------------------------------- */

	/**
	 * Renders a Roll instance to HTML.
	 * @param {Object}  [chatOptions]               An object configuring the behavior of the resulting chat message,
	 *   which is also passed to the template
	 * @param {string}  [chatOptions.user]          The ID of the user that renders the roll
	 * @param {string}  [chatOptions.flavor]        The flavor of the message
	 * @param {string}  [chatOptions.template]      The path to the template
	 *   that renders the roll
	 * @param {string}  [chatOptions.infosTemplate] ✨ The path to the template
	 *   that renders the infos box under the roll tooltip
	 * @param {boolean} [chatOptions.blind]         Whether this is a blind roll
	 * @param {boolean} [chatOptions.isPrivate]     Whether this roll is private
	 *   (displays sensitive infos with `???` instead)
	 * @returns {Promise.<string>}
	 * @see ✨ Extra features added by the override.
	 * @see (FoundryVTT) {@link https://foundryvtt.com/api/Roll.html#render|Roll.render}
	 * @async
	 * @override
	 */
	async render(chatOptions = {}) {
		if (CONFIG.debug.dice) console.warn(this);

		chatOptions = foundry.utils.mergeObject(
			{
				user: game.user.id,
				flavor: this.name,
				template: this.constructor.CHAT_TEMPLATE,
				blind: false,
			},
			chatOptions,
		);
		const isPrivate = chatOptions.isPrivate;

		// Executes the roll, if needed.
		if (!this._evaluated) await this.evaluate({ async: true });

		// Defines chat data.
		const chatData = {
			formula: isPrivate ? "???" : this._formula,
			flavor: isPrivate ? null : chatOptions.flavor,
			user: chatOptions.user,
			tooltip: isPrivate ? "" : await this.getTooltip(),
			total: isPrivate ? "?" : Math.round(this.total * 100) / 100,
			success: isPrivate ? "?" : this.successCount,
			showInfos: isPrivate ? false : CONFIG.YZUR?.Chat?.showInfos,
			infos: isPrivate ? null : await this.getRollInfos(chatOptions.infosTemplate),
			pushable: isPrivate ? false : this.pushable,
			options: chatOptions,
			isPrivate,
			roll: this,
		};

		// Renders the roll display template.
		return renderTemplate(chatOptions.template, chatData);
	}

	/* -------------------------------------------- */

	/**
	 * Transform a Roll instance into a ChatMessage, displaying the roll result.
	 * This function can either create the ChatMessage directly, or return the data object that will be used to create.
	 * @param {Object}  [messageData]         The data object to use when creating the message
	 * @param {string}  [messageData.user]    The ID of the user that sends the message
	 * @param {Object}  [messageData.speaker] ✨ The identified speaker data
	 * @param {string}  [messageData.content] The HTML content of the message,
	 *   overriden by the `roll.render()`'s returned content if left unchanged
	 * @param {number}  [messageData.type=5]    The type to use for the message from `CONST.CHAT_MESSAGE_TYPES`
	 * @param {string}  [messageData.sound]   The path to the sound played with the message (WAV format)
	 * @param {options} [options]             Additional options which modify the created message.
	 * @param {string}  [options.rollMode]    The template roll mode to use for the message from CONFIG.Dice.rollModes
	 * @param {boolean} [options.create=true] Whether to automatically create the chat message,
	 *   or only return the prepared chatData object.
	 * @return {Promise.<ChatMessage|ChatMessageData>} A promise which resolves to the created ChatMessage entity
	 *   if create is true
	 *   or the Object of prepared chatData otherwise.
	 * @see ✨ Extra features added by the override.
	 * @see (FoundryVTT) {@link https://foundryvtt.com/api/Roll.html#toMessage|Roll.toMessage}
	 * @async
	 * @override
	 */
	async toMessage(messageData = {}, { rollMode = null, create = true } = {}) {
		messageData = foundry.utils.mergeObject(
			{
				user: game.user.id,
				speaker: ChatMessage.getSpeaker(),
				// "content" is overwritten by ChatMessage.create() (called in super)
				// with the HTML returned by roll.render(), but only if content is left unchanged.
				// So you can overwrite it here with a custom content in messageData.
				content: this.total,
				type: CONST.CHAT_MESSAGE_TYPES.ROLL,
				// sound: CONFIG.sounds.dice, // Already added in super.
			},
			messageData,
		);
		// messageData.roll = this; // Already added in super.
		return await super.toMessage(messageData, { rollMode, create });
	}

	/* -------------------------------------------- */
	/*  JSON                                        */
	/* -------------------------------------------- */

	/**
	 * Creates a deep clone copy of the roll.
	 * @returns {YearZeroRoll} A copy of this roll instance
	 */
	duplicate() {
		return this.constructor.fromData(this.toJSON());
	}
}

/* -------------------------------------------- */
/*  Custom Dice Registration                    */
/* -------------------------------------------- */

/**
 * Interface for registering Year Zero dice.
 *
 * To register the game and its dice,
 * call the static `YearZeroRollManager.register()` method
 * at the start of the `init` Hooks.
 *
 * @abstract
 *
 * @throws {SyntaxError} When instanciated
 *
 * @example
 * import { YearZeroRollManager } from './lib/yzur.js';
 * Hooks.once('init', function() {
 *   YearZeroRollManager.register('yourgame', config, options);
 *   ...
 * });
 *
 */
class YearZeroRollManager {
	constructor() {
		throw new SyntaxError(`YZUR | ${this.constructor.name} cannot be instanciated!`);
	}

	/**
	 * Registers the Year Zero dice for the specified game.
	 *
	 * You must call this method in `Hooks.once('init')`.
	 *
	 * @param {GameTypeString} yzGame  The game used (for the choice of die types to register)
	 * @param {Object}        [config] Custom config to merge with the initial config
	 * @param {Object} [options]       Additional options
	 * @param {number} [options.index] Index of the registration
	 * @see YearZeroRollManager.registerConfig
	 * @see YearZeroRollManager.registerDice
	 * @see YearZeroRollManager.registerDie
	 * @static
	 */
	static register(yzGame, config, options = {}) {
		// Registers the config.
		YearZeroRollManager.registerConfig(config);
		// Registers the YZ game.
		YearZeroRollManager._initialize(yzGame);
		// Registers the dice.
		YearZeroRollManager.registerDice(yzGame, options?.index);
		console.log("YZUR | Registration complete!");
	}

	/* -------------------------------------------- */

	/**
	 * Registers the Year Zero Universal Roller config.
	 * *(See the config details at the very bottom of this file.)*
	 * @param {string} [config] Custom config to merge with the initial config
	 * @static
	 */
	static registerConfig(config) {
		CONFIG.YZUR = foundry.utils.mergeObject(YZUR, config);
	}

	/* -------------------------------------------- */

	/**
	 * Registers all the Year Zero Dice of the chosen game.
	 * @param {GameTypeString} [yzGame] The game used (for the choice of die types to register)
	 * @param {number}         [i=0]    Index of the registration
	 * @see YearZeroRollManager.registerDie
	 * @static
	 */
	static registerDice(yzGame, i) {
		// Exists early if `game` is omitted.
		if (!yzGame || typeof yzGame !== "string") {
			throw new SyntaxError("YZUR | A game must be specified for the registration.");
		}

		// Checks the game validity.
		if (!YearZeroRollManager.GAMES.includes(yzGame)) {
			console.warn(`YZUR | Unsupported game identifier "${yzGame}"`);
			if (!YearZeroRollManager.DIE_TERMS_MAP[yzGame]) {
				YearZeroRollManager.DIE_TERMS_MAP[yzGame] = [];
			}
		}

		// Registers the game's dice.
		const diceTypes = YearZeroRollManager.DIE_TERMS_MAP[yzGame];
		for (const type of diceTypes) YearZeroRollManager.registerDie(type);

		// Finally, registers our custom Roll class for Year Zero games.
		YearZeroRollManager.registerRoll(undefined, i);
	}

	/* -------------------------------------------- */

	/**
	 * Registers the roll.
	 * @param {class}  [cls] The roll class to register
	 * @param {number} [i=0] Index of the registration
	 * @static
	 */
	static registerRoll(cls = YearZeroRoll, i = 0) {
		CONFIG.Dice.rolls[i] = cls;
		CONFIG.Dice.rolls[i].CHAT_TEMPLATE = CONFIG.YZUR.Roll.chatTemplate;
		CONFIG.Dice.rolls[i].TOOLTIP_TEMPLATE = CONFIG.YZUR.Roll.tooltipTemplate;
		CONFIG.YZUR.Roll.index = i;
		if (i > 0) YearZeroRollManager._overrideRollCreate(i);
	}

	/* -------------------------------------------- */

	/**
	 * Registers a die in Foundry.
	 * @param {DieTermString} term Class identifier of the die to register
	 * @static
	 */
	static registerDie(term) {
		const cls = CONFIG.YZUR.Dice.DIE_TERMS[term];
		if (!cls) throw new DieTermError(term);

		const deno = cls.DENOMINATION;
		if (!deno) {
			throw new SyntaxError(`YZUR | Undefined DENOMINATION for "${cls.name}".`);
		}

		// Registers the die in the Foundry CONFIG.
		const reg = CONFIG.Dice.terms[deno];
		if (reg) {
			console.warn(`YZUR | Die Registration: "${deno}" | Overwritting ${reg.name} with "${cls.name}".`);
		} else {
			console.log(`YZUR | Die Registration: "${deno}" with ${cls.name}.`);
		}
		CONFIG.Dice.terms[deno] = cls;
	}

	/* -------------------------------------------- */

	/**
	 * Registers a custom die in Foundry.
	 * @param {DieTermString} term Class identifier of the die to register
	 * @param {DieClassData}  data Data for creating the custom die class
	 * @see YearZeroRollManager.createDieClass
	 * @see YearZeroRollManager.registerDie
	 */
	static registerCustomDie(term, data) {
		if (!YearZeroRollManager.GAMES.includes(CONFIG.YZUR.game)) {
			throw new GameTypeError(
				"YZUR | Unregistered game. Please register a game before registering a custom die.",
			);
		}

		const cls = YearZeroRollManager.createDieClass(data);

		if (CONFIG.YZUR.Dice.DIE_TERMS[term]) {
			console.warn(`YZUR | Overwriting an existing die "${CONFIG.YZUR.Dice.DIE_TERMS[term]}" with: "${term}"`);
		}
		CONFIG.YZUR.Dice.DIE_TERMS[term] = cls;

		YearZeroRollManager.DIE_TERMS_MAP[CONFIG.YZUR.game].push(term);
		YearZeroRollManager.registerDie(term);
	}
	/* -------------------------------------------- */

	/**
	 * @param {GameTypeString} yzGame The game used (for the choice of die types to register)
	 * @private
	 * @static
	 */
	static _initialize(yzGame) {
		if (!CONFIG.YZUR) throw new ReferenceError("YZUR | CONFIG.YZUR does not exists!");
		if (CONFIG.YZUR.game) {
			console.warn(`YZUR | Overwriting the default Year Zero game "${CONFIG.YZUR.game}" with: "${yzGame}"`);
		}
		CONFIG.YZUR.game = yzGame;
		console.log(`YZUR | The name of the Year Zero game is: "${yzGame}".`);
	}

	/* -------------------------------------------- */

	/**
	 * Overrides the default Foundry Roll prototype to inject our own create() function.
	 * When creating a roll, the Roll prototype will now check if the formula has a YZE pattern.
	 * If so, it uses our method, otherwise it returns to the Foundry defaults.
	 * @param {number} [index=1] What index of our own Roll class in the Foundry CONFIG.Dice.rolls array.
	 * @returns {YearZerRoll|Roll}
	 * @private
	 * @static
	 */
	static _overrideRollCreate(index = 1) {
		Roll.prototype.constructor.create = function (formula, data = {}, options = {}) {
			const isYZURFormula =
				options.yzur ??
				("game" in data ||
					"maxPush" in data ||
					"game" in options ||
					"maxPush" in options ||
					formula.match(/\d*d(:?[bsngzml]|6|8|10|12)/i));
			const n = isYZURFormula ? index : 0;
			const cls = CONFIG.Dice.rolls[n];
			return new cls(formula, data, options);
		};
	}

	/* -------------------------------------------- */

	/**
	 * Creates a new custom Die class that extends the {@link YearZeroDie} class.
	 * @param {DieClassData} data An object with
	 * @returns {class}
	 * @see YearZeroDie
	 * @static
	 *
	 * @example
	 * YZUR.YearZeroRollManager.createDieClass({
	 *   name: 'D6SpecialDie',
	 *   denomination: 's',
	 *   faces: 6,
	 *   type: 'gear',
	 *   lockedValues: [4, 5, 6],
	 * });
	 */
	static createDieClass(data) {
		if (!data || typeof data !== "object") {
			throw new SyntaxError("YZUR | To create a Die class, you must pass a DieClassData object!");
		}

		// eslint-disable-next-line no-shadow
		const { name, denomination: deno, faces, type, lockedValues } = data;

		if (typeof faces !== "number" || faces <= 0) {
			throw new DieTermError(`YZUR | Invalid die class faces "${faces}"`);
		}

		const YearZeroCustomDie = class extends YearZeroDie {
			constructor(termData = {}) {
				termData.faces = faces;
				super(termData);
			}
		};

		// Defines the name of the new die class.
		if (!name | (typeof name !== "string")) {
			throw new DieTermError(`YZUR | Invalid die class name "${name}"`);
		}
		Object.defineProperty(YearZeroCustomDie, "name", { value: name });

		// Defines the denomination of the new die class.
		if (!deno || typeof deno !== "string") {
			throw new DieTermError(`YZUR | Invalid die class denomination "${deno}"`);
		}
		YearZeroCustomDie.DENOMINATION = deno;

		// Defines the type of the new die class, if any.
		if (type != undefined) {
			if (typeof type !== "string") {
				throw new DieTermError(`YZUR | Invalid die class type "${type}"`);
			}
			if (!CONFIG.YZUR.Dice.DIE_TYPES.includes(type)) {
				console.warn(`YZUR | Unsupported DieTypeString: "${type}"`);
			}
			if (!CONFIG.YZUR.Icons[CONFIG.YZUR.game][type]) {
				console.warn(`YZUR | No icons defined for type "${type}"`);
			}
			YearZeroCustomDie.TYPE = type;
		}

		// Defines the locked values of the new die class, if any.
		if (lockedValues != undefined) {
			if (!Array.isArray(lockedValues)) {
				throw new DieTermError(`YZUR | Invalid die class locked values "${lockedValues}" (Not an Array)`);
			}
			for (const [i, v] of lockedValues.entries()) {
				if (typeof v !== "number") {
					throw new DieTermError(`YZUR | Invalid die class locked value "${v}" at [${i}] (Not a Number)`);
				}
			}
			YearZeroCustomDie.LOCKED_VALUES = lockedValues;
		}
		return YearZeroCustomDie;
	}
}

/* -------------------------------------------- */
/*  Members                                     */
/* -------------------------------------------- */

/**
 * Die Types mapped with Games.
 * Used by the register method to choose which dice to activate.
 * @enum {DieTermString[]}
 * @constant
 */
YearZeroRollManager.DIE_TERMS_MAP = {
	// Mutant Year Zero
	myz: ["base", "skill", "gear", "neg"],
	// Forbidden Lands
	fbl: ["base", "skill", "gear", "neg", "artoD8", "artoD10", "artoD12"],
	// Alien RPG
	alien: ["skill", "stress"],
	// Tales From the Loop
	tales: ["skill"],
	// Coriolis
	cor: ["skill"],
	// Vaesen
	vae: ["skill"],
	// Twilight 2000
	t2k: ["a", "b", "c", "d", "ammo", "loc"],
	// Blade Runner
	br: ["brD12", "brD10", "brD8", "brD6"],
};

/**
 * List of identifiers for the games.
 * @enum {GameTypeString}
 * @constant
 * @readonly
 */
YearZeroRollManager.GAMES;
Object.defineProperty(YearZeroRollManager, "GAMES", {
	get: () => Object.keys(YearZeroRollManager.DIE_TERMS_MAP),
});
// YearZeroRollManager.GAMES = Object.keys(YearZeroRollManager.DIE_TERMS_MAP);

export { YZUR, YearZeroDice, YearZeroRoll, YearZeroRollManager };
