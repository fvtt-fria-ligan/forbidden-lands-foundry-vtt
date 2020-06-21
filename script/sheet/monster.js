export class ForbiddenLandsMonsterSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["forbidden-lands", "sheet", "actor"],
      template: "systems/forbidden-lands/model/monster.html",
      width: 620,
      height: 740,
      resizable: false,
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
    const data = super.getData();
    this.computeSkills(data);
    this.computeItems(data);
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-create").click((ev) => {
      this.onItemCreate(ev);
    });
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
    html.find("a.roll-attribute").click((ev) => {
      const attributeName = $(ev.currentTarget).data("attribute");
      const attribute = this.actor.data.data.attribute[attributeName];
      let testName = game.i18n.localize(attribute.label).toUpperCase();
      this.prepareRollDialog(testName, attribute.value, 0, 0, "", 0, 0);
    });
    html.find("a.skull").click((ev) => {
      const key = $(ev.currentTarget).data("key");
      const value = $(ev.currentTarget).data("value");
      const itemId = $(ev.currentTarget).data("itemId");
      if (itemId) {
        this.actor.updateOwnedItem({
          _id: itemId,
          [key]: value,
        });
      } else {
        this.actor.update({
          [key]: value,
        });
      }
    });
    html.find("a.roll-skill").click((ev) => {
      const skillName = $(ev.currentTarget).data("skill");
      const skill = this.actor.data.data.skill[skillName];
      const attribute = this.actor.data.data.attribute[skill.attribute];
      let testName = game.i18n.localize(skill.label).toUpperCase();
      this.prepareRollDialog(
        testName,
        attribute.value,
        skill.value,
        0,
        "",
        0,
        0
      );
    });
    html.find(".armor a").click((ev) => {
      let armorValue = this.actor.data.data.armor.value;
      let testName = game.i18n.localize("HEADER.ARMOR").toUpperCase();
      this.prepareRollDialog(testName, 0, 0, armorValue, "", 0, 0);
    });
    html.find(".monster-talent.item .name .name").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      const talent = this.actor.getOwnedItem(div.data("itemId"));
      this.sendTalentToChat(talent);
    });
    html.find("a.attack").click((ev) => {
      const itemId = $(ev.currentTarget).data("itemId");
      const weapon = this.actor.getOwnedItem(itemId);
      let testName = weapon.name;
      this.prepareRollDialog(
        testName,
        weapon.data.data.dice,
        0,
        0,
        "",
        0,
        weapon.data.data.damage
      );
    });
    html.find(".gear.item .name").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      const gear = this.actor.getOwnedItem(div.data("itemId"));
      if (gear.type === "weapon") {
        this.sendWeaponToChat(gear);
      } else if (gear.type === "armor") {
        this.sendArmorToChat(gear);
      } else if (gear.type === "artifact") {
        this.sendArtifactToChat(gear);
      } else if (gear.type === "rawMaterial") {
        this.sendRawMaterialToChat(gear);
      } else {
        this.sendGearToChat(gear);
      }
    });
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
      item.isGear =
        item.type !== "monsterAttack" && item.type !== "monsterTalent";
    }
  }

  onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget;
    let data = duplicate(header.dataset);
    data["name"] = `New ${data.type.capitalize()}`;
    this.actor.createEmbeddedEntity("OwnedItem", data);
  }

  prepareRollDialog(
    testName,
    baseDefault,
    skillDefault,
    gearDefault,
    artifactDefault,
    modifierDefault,
    damage
  ) {
    let baseHtml = this.buildInputHtmlDialog("Base", baseDefault);
    let skillHtml = this.buildInputHtmlDialog("Skill", skillDefault);
    let gearHtml = this.buildInputHtmlDialog("Gear", gearDefault);
    let artifactHtml = this.buildInputHtmlDialog("Artifacts", artifactDefault);
    let modifierHtml = this.buildInputHtmlDialog("Modifier", modifierDefault);
    let d = new Dialog({
      title: "Test : " + testName,
      content: this.buildDivHtmlDialog(
        baseHtml + skillHtml + gearHtml + artifactHtml + modifierHtml
      ),
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
            this.roll(
              testName,
              parseInt(base, 10),
              parseInt(skill, 10),
              parseInt(gear, 10),
              artifact,
              parseInt(modifier, 10),
              parseInt(damage, 10)
            );
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
    return (
      "<b>" +
      diceName +
      "</b><input id='" +
      diceName.toLowerCase() +
      "' style='text-align: center' type='text' value='" +
      diceValue +
      "'/>"
    );
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
    this.sendRollToChat(computedDamage, false);
  }

  sendRollToChat(damage, isPushed) {
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
          (numberOfSword + damage) +
          "⚔️ | " +
          numberOfSkull +
          " 💀</b></br>";
      } else {
        resultMessage =
          "<b style='color:red'>" +
          this.lastTestName +
          "</b> (PUSHED) <b>" +
          numberOfSword +
          "⚔️ | " +
          numberOfSkull +
          " 💀</b></br>";
      }
    } else {
      if (numberOfSword > 0) {
        resultMessage =
          "<b style='color:green'>" +
          this.lastTestName +
          "</b> <b>" +
          (numberOfSword + damage) +
          "⚔️ | " +
          numberOfSkull +
          " 💀</b></br>";
      } else {
        resultMessage =
          "<b style='color:red'>" +
          this.lastTestName +
          "</b> <b>" +
          numberOfSword +
          "⚔️ | " +
          numberOfSkull +
          " 💀</b></br>";
      }
    }
    let diceMessage = this.printDices() + "</br>";
    let chatData = {
      user: game.user._id,
      content: resultMessage + diceMessage,
    };
    ChatMessage.create(chatData, {});
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
    } else if (
      diceValue === 1 &&
      diceType !== "skill-penalty" &&
      diceType !== "skill"
    ) {
      return { success: 0, weight: -2 };
    } else {
      return { success: 0, weight: 0 };
    }
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

  sendTalentToChat(talent) {
    let message =
      "<b>" +
      talent.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("TALENT.DESCRIPTION") +
      ": </b>" +
      talent.data.data.description;
    let chatData = {
      user: game.user._id,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  sendGearToChat(gear) {
    let message =
      "<b>" +
      gear.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("GEAR.COST") +
      ": </b>" +
      gear.data.data.cost +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.SUPPLY") +
      ": </b>" +
      gear.data.data.supply +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.WEIGHT") +
      ": </b>" +
      gear.data.data.weight +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.RAW_MATERIAL") +
      ": </b>" +
      gear.data.data.rawMaterials +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.TIME") +
      ": </b>" +
      gear.data.data.time +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.TALENT") +
      ": </b>" +
      gear.data.data.talent +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.TOOLS") +
      ": </b>" +
      gear.data.data.tools +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.EFFECT") +
      ": </b>" +
      gear.data.data.effect;
    let chatData = {
      user: game.user._id,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  sendWeaponToChat(weapon) {
    let message =
      "<b>" +
      weapon.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("WEAPON.CATEGORY") +
      ": </b>" +
      weapon.data.data.category +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.GRIP") +
      ": </b>" +
      weapon.data.data.grip +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.BONUS") +
      ": </b>" +
      weapon.data.data.bonus +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.DAMAGE") +
      ": </b>" +
      weapon.data.data.damage +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.RANGE") +
      ": </b>" +
      weapon.data.data.range +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.FEATURE") +
      ": </b>" +
      weapon.data.data.features;
    let chatData = {
      user: game.user._id,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  sendArtifactToChat(artifact) {
    let message =
      "<b>" +
      artifact.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("WEAPON.CATEGORY") +
      ": </b>" +
      artifact.data.data.category +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.GRIP") +
      ": </b>" +
      artifact.data.data.grip +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.BONUS") +
      ": </b>" +
      artifact.data.data.bonus +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.DAMAGE") +
      ": </b>" +
      artifact.data.data.damage +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.RANGE") +
      ": </b>" +
      artifact.data.data.range +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.FEATURE") +
      ": </b>" +
      artifact.data.data.features +
      "</br>" +
      "<b>" +
      game.i18n.localize("ARTIFACT.APPEARANCE") +
      ": </b>" +
      artifact.data.data.appearance +
      "</br>" +
      "<b>" +
      game.i18n.localize("ARTIFACT.DESCRIPTION") +
      ": </b>" +
      artifact.data.data.description +
      "</br>" +
      "<b>" +
      game.i18n.localize("ARTIFACT.DRAWBACK") +
      ": </b>" +
      artifact.data.data.drawback;
    let chatData = {
      user: game.user._id,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  sendRawMaterialToChat(gear) {
    let message =
      "<b>" +
      gear.name.toUpperCase() +
      "</b></br></br>" +
      "<b>" +
      game.i18n.localize("GEAR.COST") +
      ": </b>" +
      gear.data.data.cost +
      "</br>" +
      "<b>" +
      game.i18n.localize("RAW_MATERIAL.SHELF_LIFE") +
      ": </b>" +
      gear.data.data.shelfLife +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.RAW_MATERIAL") +
      ": </b>" +
      gear.data.data.rawMaterials +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.TALENT") +
      ": </b>" +
      gear.data.data.talent +
      "</br>" +
      "<b>" +
      game.i18n.localize("GEAR.TOOLS") +
      ": </b>" +
      gear.data.data.tools;
    let chatData = {
      user: game.user._id,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  sendArmorToChat(artifact) {
    let message =
      "<b>" +
      artifact.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("ARMOR.RATING") +
      ": </b>" +
      artifact.data.data.rating.max +
      "</br>" +
      "<b>" +
      game.i18n.localize("ARMOR.PART") +
      ": </b>" +
      artifact.data.data.part +
      "</br>" +
      "<b>" +
      game.i18n.localize("WEAPON.FEATURE") +
      ": </b>" +
      artifact.data.data.features;
    let chatData = {
      user: game.user._id,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();

    if (this.actor.owner) {
      buttons = [
        {
          label: "Roll",
          class: "custom-roll",
          icon: "fas fa-dice",
          onclick: (ev) => this.prepareRollDialog("Roll", 0, 0, 0, "", 0, 0),
        },
      ].concat(buttons);
    }

    return buttons;
  }
}
