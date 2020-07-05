export class ForbiddenLandsActorSheet extends ActorSheet {
  activateListeners(html) {
    super.activateListeners(html);

    // Attribute markers
    html.find(".change-attribute").on("click contextmenu", (ev) => {
      const attributeName = $(ev.currentTarget).data("attribute");
      const attribute = this.actor.data.data.attribute[attributeName];
      let value = attribute.value;
      if (ev.type === "click") {
        value = Math.max(value - 1, 0);
      } else if (ev.type === "contextmenu") {
        value = Math.min(value + 1, attribute.max);
      }
      this.actor.update({
        ["data.attribute." + attributeName + ".value"]: value,
      });
    });

    // Items
    html.find(".item-edit").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(div.data("itemId"));
      item.sheet.render(true);
    });
    html.find(".item-delete").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(div.data("itemId"));
      div.slideUp(200, () => this.render(false));
    });
    html.find(".change-item-bonus").on("click contextmenu", (ev) => {
      const itemId = $(ev.currentTarget).data("itemId");
      const item = this.actor.getOwnedItem(itemId);
      let value = item.data.data.bonus.value;
      if (ev.type === "click") {
        value = Math.max(value - 1, 0);
      } else if (ev.type === "contextmenu") {
        value = Math.min(value + 1, item.data.data.bonus.max);
      }
      item.update({
        "data.bonus.value": value,
      });
    });

    // Rolls
    html.find(".roll-attribute").click((ev) => {
      const attributeName = $(ev.currentTarget).data("attribute");
      const attribute = this.actor.data.data.attribute[attributeName];
      let testName = game.i18n.localize(attribute.label).toUpperCase();
      this.prepareRollDialog(testName, attribute.value, 0, 0, "", 0, 0);
    });
    html.find(".roll-skill").click((ev) => {
      const skillName = $(ev.currentTarget).data("skill");
      const skill = this.actor.data.data.skill[skillName];
      const attribute = this.actor.data.data.attribute[skill.attribute];
      let testName = game.i18n.localize(skill.label).toUpperCase();
      this.prepareRollDialog(testName, attribute.value, skill.value, 0, "", 0, 0);
    });
    html.find(".roll-weapon").click((ev) => {
      const itemId = $(ev.currentTarget).data("itemId");
      const weapon = this.actor.getOwnedItem(itemId);
      let testName = weapon.name;
      let base;
      let skill;
      if (weapon.data.data.category === "melee") {
        base = this.actor.data.data.attribute.strength.value;
        skill = this.actor.data.data.skill.melee.value;
      } else {
        base = this.actor.data.data.attribute.agility.value;
        skill = this.actor.data.data.skill.marksmanship.value;
      }
      let bonus = this.parseBonus(weapon.data.data.bonus.value);
      let artifact = this.prepareArtifactString(weapon.data.data.bonus.value);
      this.prepareRollDialog(testName, base, skill, bonus, artifact, 0, weapon.data.data.damage);
    });
  }

  parseBonus(bonus) {
    let regex = /([0-9]*[^d+-])/;
    let regexMatch = regex.exec(bonus);
    if (regexMatch != null) {
      return regex.exec(bonus)[1];
    } else {
      return 0;
    }
  }

  parseArtifact(artifact) {
    let regex = /([0-9]*)d([0-9]*)/g;
    let regexMatch;
    let artifacts = [];
    while ((regexMatch = regex.exec(artifact))) {
      artifacts.push({ dice: regexMatch[1], face: regexMatch[2] });
    }
    return artifacts;
  }

  prepareRollDialog(testName, baseDefault, skillDefault, gearDefault, artifactDefault, modifierDefault, damage) {
    let baseHtml = this.buildInputHtmlDialog("Base", baseDefault);
    let skillHtml = this.buildInputHtmlDialog("Skill", skillDefault);
    let gearHtml = this.buildInputHtmlDialog("Gear", gearDefault);
    let artifactHtml = this.buildInputHtmlDialog("Artifacts", artifactDefault);
    let modifierHtml = this.buildInputHtmlDialog("Modifier", modifierDefault);
    let d = new Dialog({
      title: "Test: " + testName,
      content: this.buildDivHtmlDialog(baseHtml + skillHtml + gearHtml + artifactHtml + modifierHtml),
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll",
          callback: (html) => {
            let base = html.find("#base")[0].value;
            let skill = html.find("#skill")[0].value;
            let gear = html.find("#gear")[0].value;
            let artifact = this.parseArtifact(html.find("#artifacts")[0].value);
            let modifier = html.find("#modifier")[0].value;
            this.roll(testName, parseInt(base, 10), parseInt(skill, 10), parseInt(gear, 10), artifact, parseInt(modifier, 10), parseInt(damage, 10));
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => {},
        },
      },
      default: "roll",
      close: () => {},
    });
    d.render(true);
  }

  buildDivHtmlDialog(divContent) {
    return "<div class='flex row roll-dialog'>" + divContent + "</div>";
  }

  buildInputHtmlDialog(diceName, diceValue) {
    return "<b>" + diceName + "</b><input id='" + diceName.toLowerCase() + "' style='text-align: center' type='text' value='" + diceValue + "'/>";
  }

  roll(testName, base, skill, gear, artifacts, modifier, damage) {
    this.dices = [];
    this.lastTestName = testName;
    let computedSkill = skill + modifier;
    let computedSkillType;
    if (computedSkill > 0) {
      computedSkillType = "skill";
    } else {
      computedSkill = -computedSkill;
      computedSkillType = "skill-penalty";
    }
    this.rollDice(base, "base", 6);
    this.rollDice(computedSkill, computedSkillType, 6);
    this.rollDice(gear, "gear", 6);
    artifacts.forEach((artifact) => {
      this.rollDice(artifact.dice, "artifact", artifact.face);
    });
    let computedDamage = damage;
    if (damage > 0) {
      computedDamage = computedDamage - 1;
    }
    this.lastDamage = computedDamage;
    this.sendRollToChat(false);
  }

  rollDice(numberOfDice, typeOfDice, numberOfFaces) {
    if (numberOfDice > 0) {
      let die = new Die(numberOfFaces);
      die.roll(numberOfDice);
      die.results.forEach((result) => {
        let successAndWeight = this.getSuccessAndWeight(result, typeOfDice);
        this.dices.push({
          value: result,
          type: typeOfDice,
          success: successAndWeight.success,
          weight: successAndWeight.weight,
          face: numberOfFaces,
        });
      });
    }
  }

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

  sendRollToChat(isPushed) {
    this.dices.sort(function (a, b) {
      return b.weight - a.weight;
    });
    let numberOfSword = this.countSword();
    let numberOfSkull = this.countSkull();
    let resultMessage;
    if (isPushed) {
      if (numberOfSword > 0) {
        resultMessage =
          "<b style='color:green'>" +
          this.lastTestName +
          "</b> (PUSHED) <b>" +
          (numberOfSword + this.lastDamage) +
          "⚔️ | " +
          numberOfSkull +
          " 💀</b></br>";
      } else {
        resultMessage = "<b style='color:red'>" + this.lastTestName + "</b> (PUSHED) <b>" + numberOfSword + "⚔️ | " + numberOfSkull + " 💀</b></br>";
      }
    } else {
      if (numberOfSword > 0) {
        resultMessage =
          "<b style='color:green'>" + this.lastTestName + "</b> <b>" + (numberOfSword + this.lastDamage) + "⚔️ | " + numberOfSkull + " 💀</b></br>";
      } else {
        resultMessage = "<b style='color:red'>" + this.lastTestName + "</b> <b>" + numberOfSword + "⚔️ | " + numberOfSkull + " 💀</b></br>";
      }
    }
    let diceMessage = this.printDices() + "</br>";
    let chatData = {
      user: game.user._id,
      content: resultMessage + diceMessage,
    };
    ChatMessage.create(chatData, {});
  }

  countSword() {
    let numberOfSword = 0;
    this.dices.forEach((dice) => {
      numberOfSword = numberOfSword + dice.success;
    });
    return numberOfSword;
  }

  countSkull() {
    let numberOfSkull = 0;
    this.dices.forEach((dice) => {
      if (dice.value === 1 && (dice.type === "base" || dice.type === "gear")) {
        numberOfSkull++;
      }
    });
    return numberOfSkull;
  }

  printDices() {
    let message = "";
    this.dices.forEach((dice) => {
      message =
        message +
        "<img width='25px' height='25px' style='border:none;margin-right:2px;margin-top:2px' src='systems/forbidden-lands/asset/" +
        dice.type +
        "-dice-" +
        dice.value +
        ".png'/>";
    });
    return message;
  }
}
