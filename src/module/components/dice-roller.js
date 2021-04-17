/** This class is responsible for rolling dice */
export default class DiceRoller {
	dices = [];
	lastType = "";
	lastRollName = "";
	lastDamage = 0;

	/**
	 * @param  {string} rollName   Display name for the roll
	 * @param  {number} base       Number of Base dice
	 * @param  {number} skill      Number of Skill dice
	 * @param  {number} gear       Number of Gear dice
	 * @param  {Array}  artifacts  Array of artifact dice objects: [{dice: number of dice, face: number of faces}]
	 * @param  {number} modifier   Increase/decrease amount of skill dice
	 * @param  {number} [damage=0] Weapon damage
	 */
	roll(rollName, base, skill, gear, artifacts, modifier, damage = 0) {
		this.dices = [];
		this.lastType = "skill";
		this.name = rollName;
		let computedSkill = skill + modifier;
		let computedSkillType;
		if (computedSkill > 0) {
			computedSkillType = "skill";
		} else {
			computedSkill = -computedSkill;
			computedSkillType = "skill-penalty";
		}
		this.rollDice(base, "base", 6, 0);
		this.rollDice(computedSkill, computedSkillType, 6, 0);
		this.rollDice(gear, "gear", 6, 0);
		artifacts.forEach((artifact) => {
			this.rollDice(artifact.dice, "artifact", artifact.face);
		});
		this.weaponDamage = damage;
		this.damage = this.weaponDamage;
		this.hasDamage = damage > 0;
		if (this.hasDamage) {
			this.damage = damage - 1;
		}
		this.sendRollToChat(this, false);
	}

	/**
	 * Push the last roll
	 */
	push(data) {
		data.dices.forEach((dice) => {
			if (
				(dice.value < 6 && dice.value > 1) ||
				(dice.value < 6 && ["artifact", "skill", "skill-penalty"].includes(dice.type))
			) {
				let die = new Die({ faces: dice.face, number: 1 });
				die.evaluate();
				dice.value = die.total;
				let successAndWeight = this.getSuccessAndWeight(dice.value, dice.type);
				dice.success = successAndWeight.success;
				dice.weight = successAndWeight.weight;
				dice.rolled = true;
			} else {
				dice.rolled = false;
			}
		});
		if (data.lastType === "spell") {
			this.sendRollSpellToChat(data, true);
		} else {
			this.sendRollToChat(data, true);
		}
	}

	synthetizeFakeRoll(dice) {
		const terms = [];
		for (let die of dice) {
			if (!die.rolled) {
				continue;
			}
			let term = "Die";
			switch (die.type) {
				case "artifact":
					term = `ArtifactD${die.face}`;
					break;
				case "base":
					term = "BaseDie";
					break;
				case "gear":
					term = "GearDie";
					break;
				case "skill":
					term = "SkillDie";
					break;
			}
			terms.push({
				class: term,
				faces: die.face,
				number: 1,
				results: [{ result: die.value, active: true }],
			});
		}
		return { class: "Roll", dice: [], formula: "", terms: terms };
	}

	/**
	 * Display roll in chat
	 *
	 * @param  {boolean} isPushed Whether roll was pushed
	 */
	async sendRollToChat(data, isPushed) {
		data.dices.sort(function (a, b) {
			return b.weight - a.weight;
		});
		let numberOfSword = this.countSword(data);
		let numberOfSkull = this.countSkull(data);
		let rollData = {
			name: data.name,
			isPushed: isPushed,
			isSpell: false,
			sword: numberOfSword,
			skull: numberOfSkull,
			damage: numberOfSword > 0 ? numberOfSword + data.weaponDamage - 1 : 0,
			weaponDamage: data.weaponDamage,
			hasDamage: data.hasDamage,
			dices: data.dices,
			user: game.userId,
		};
		const html = await renderTemplate("systems/forbidden-lands/templates/chat/roll.hbs", rollData);
		let chatData = {
			type: CHAT_MESSAGE_TYPES.ROLL,
			user: game.user._id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
		};
		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		} else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		chatData["flags.forbidden-lands.rollData"] = rollData;
		const roll = this.synthetizeFakeRoll(data.dices);
		chatData.roll = JSON.stringify(roll);
		ChatMessage.create(chatData);
	}

	async sendRollSpellToChat(data, isPushed) {
		data.dices.sort(function (a, b) {
			return b.weight - a.weight;
		});
		let numberOfSword = this.countSword(data);
		let numberOfSkull = this.countSkull(data);
		let rollData = {
			name: data.name,
			isPushed: isPushed,
			isSpell: true,
			sword: numberOfSword,
			skull: numberOfSkull,
			powerLevel: numberOfSword + this.dices.length,
			hadDamage: false,
			dices: data.dices,
			user: game.userId,
		};
		const html = await renderTemplate("systems/forbidden-lands/templates/chat/roll.hbs", rollData);
		let chatData = {
			user: game.user._id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
		};
		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		} else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		chatData["flags.forbidden-lands.rollData"] = rollData;
		const roll = this.synthetizeFakeRoll(data.dices);
		chatData.roll = JSON.stringify(roll);
		ChatMessage.create(chatData);
	}

	rollSpell(testName, base, success) {
		this.dices = [];
		this.lastType = "spell";
		this.name = testName;
		this.rollDice(base, "base", 6, success);
		this.damage = 0;
		this.sendRollSpellToChat(this, false);
	}

	/**
	 * Roll a set of dice
	 *
	 * @param  {number} numberOfDice     How many dice to roll
	 * @param  {string} typeOfDice       Base/skill/gear
	 * @param  {number} numberOfFaces    What dice to roll
	 * @param  {number} automaticSuccess For spells
	 */
	rollDice(numberOfDice, typeOfDice, numberOfFaces, automaticSuccess) {
		if (numberOfDice > 0) {
			let die = new Die({ faces: numberOfFaces, number: numberOfDice });
			die.evaluate();
			die.results.forEach((roll) => {
				let result = roll.result;
				let rolled = true;
				if (automaticSuccess > 0) {
					result = numberOfFaces;
					rolled = false;
					automaticSuccess -= 1;
				}
				let successAndWeight = this.getSuccessAndWeight(result, typeOfDice);
				this.dices.push({
					value: result,
					type: typeOfDice,
					success: successAndWeight.success,
					weight: successAndWeight.weight,
					face: numberOfFaces,
					rolled: rolled,
				});
			});
		}
	}

	/**
	 * Retrieves amount of successes from a single die
	 * and weight for ordering during display
	 *
	 * @param  {number} diceValue
	 * @param  {string} diceType
	 */
	getSuccessAndWeight(diceValue, diceType) {
		if (diceValue === 12) {
			return { success: 4, weight: 4 };
		} else if (diceValue >= 10) {
			return { success: 3, weight: 3 };
		} else if (diceValue >= 8) {
			return { success: 2, weight: 2 };
		} else if (diceValue >= 6) {
			if (diceType === "skill-penalty") {
				return { success: -1, weight: -1 };
			} else {
				return { success: 1, weight: 1 };
			}
		} else if (diceValue === 1 && diceType !== "skill-penalty" && diceType !== "skill") {
			return { success: 0, weight: -2 };
		} else {
			return { success: 0, weight: 0 };
		}
	}

	/**
	 * Count total successes
	 */
	countSword(data) {
		if (!data) data = this;
		let numberOfSword = 0;
		data.dices.forEach((dice) => {
			numberOfSword = numberOfSword + dice.success;
		});
		return numberOfSword;
	}

	/**
	 * Count total failures
	 */
	countSkull(data) {
		if (!data) data = this;
		let numberOfSkull = 0;
		data.dices.forEach((dice) => {
			if (dice.value === 1 && (dice.type === "base" || dice.type === "gear")) {
				numberOfSkull++;
			}
		});
		return numberOfSkull;
	}
}
