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
    this.lastRollName = rollName;
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
    let computedDamage = damage;
    this.hasDamage = damage > 0;
    if (this.hasDamage) {
      computedDamage = computedDamage - 1;
    }
    this.lastDamage = computedDamage;
    this.sendRollToChat(false);
  }

  /**
   * Push the last roll
   */
  push() {
    this.dices.forEach((dice) => {
      if ((dice.value < 6 && dice.value > 1 && dice.type !== "skill") || (dice.value < 6 && ["artifact", "skill"].includes(dice.type))) {
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
    if (this.lastType === "spell") {
      this.sendRollSpellToChat(true);
    } else {
      this.sendRollToChat(true);
    }
  }

  /**
   * @param  {object} consumable {label: consumable name, value: number of die faces}
   */
  async rollConsumable(consumable) {
    let consumableName = game.i18n.localize(consumable.label);
    let result;
    if (!consumable.value) {
      result = "FAILED";
    } else {
      let die = new Die({ faces: consumable.value, number: 1 });
      die.evaluate();
      if (die.total > 2) {
        result = "SUCCEED";
      } else {
        result = "FAILED";
      }
    }
    let consumableData = {
      name: consumableName,
      result: game.i18n.localize(result),
    };
    const html = await renderTemplate("systems/forbidden-lands/chat/consumable.html", consumableData);
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
    ChatMessage.create(chatData);
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
  async sendRollToChat(isPushed) {
    this.dices.sort(function (a, b) {
      return b.weight - a.weight;
    });
    let numberOfSword = this.countSword();
    let numberOfSkull = this.countSkull();
    let rollData = {
      name: this.lastRollName,
      isPushed: isPushed,
      isSpell: false,
      sword: numberOfSword,
      skull: numberOfSkull,
      damage: numberOfSword + this.lastDamage,
      hasDamage: this.lastDamage > 0,
      dices: this.dices,
    };
    const html = await renderTemplate("systems/forbidden-lands/chat/roll.html", rollData);
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
    const roll = this.synthetizeFakeRoll(this.dices);
    chatData.roll = JSON.stringify(roll);
    ChatMessage.create(chatData);
  }

  async sendRollSpellToChat(isPushed) {
    this.dices.sort(function (a, b) {
      return b.weight - a.weight;
    });
    let numberOfSword = this.countSword();
    let numberOfSkull = this.countSkull();
    let rollData = {
      name: this.lastTestName,
      isPushed: isPushed,
      isSpell: true,
      sword: numberOfSword,
      skull: numberOfSkull,
      powerLevel: numberOfSword + this.dices.length,
      hadDamage: false,
      dices: this.dices,
    };
    const html = await renderTemplate("systems/forbidden-lands/chat/roll.html", rollData);
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
    ChatMessage.create(chatData);
  }

  rollSpell(testName, base, success) {
    this.dices = [];
    this.lastType = "spell";
    this.lastTestName = testName;
    this.rollDice(base, "base", 6, success);
    this.lastDamage = 0;
    this.sendRollSpellToChat(false);
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
  countSword() {
    let numberOfSword = 0;
    this.dices.forEach((dice) => {
      numberOfSword = numberOfSword + dice.success;
    });
    return numberOfSword;
  }

  /**
   * Count total failures
   */
  countSkull() {
    let numberOfSkull = 0;
    this.dices.forEach((dice) => {
      if (dice.value === 1 && (dice.type === "base" || dice.type === "gear")) {
        numberOfSkull++;
      }
    });
    return numberOfSkull;
  }
}
