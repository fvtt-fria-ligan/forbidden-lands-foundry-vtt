import { ForbiddenLandsActorSheet } from "./actor.js";

export class ForbiddenLandsCharacterSheet extends ForbiddenLandsActorSheet {
  dices = [];
  lastTestName = "";
  lastDamage = 0;

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["forbidden-lands", "sheet", "actor"],
      template: "systems/forbidden-lands/model/character.html",
      width: 620,
      height: 740,
      resizable: false,
      scrollY: [
        ".armors .item-list .items",
        ".critical-injuries .item-list .items",
        ".gears.item-list .items",
        ".spells .item-list .items",
        ".talents .item-list .items",
        ".weapons .item-list .items",
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
    html.find(".condition").click(async (ev) => {
      const conditionName = $(ev.currentTarget).data("condition");
      const conditionValue = this.actor.data.data.condition[conditionName].value;
      if (conditionName === "sleepy") {
        this.actor.update({
          "data.condition.sleepy.value": !conditionValue,
        });
      } else if (conditionName === "thirsty") {
        this.actor.update({ "data.condition.thirsty.value": !conditionValue });
      } else if (conditionName === "hungry") {
        this.actor.update({ "data.condition.hungry.value": !conditionValue });
      } else if (conditionName === "cold") {
        this.actor.update({ "data.condition.cold.value": !conditionValue });
      }
      this._render();
    });
    html.find(".roll-armor.specific").click((ev) => {
      const itemId = $(ev.currentTarget).data("itemId");
      const armor = this.actor.getOwnedItem(itemId);
      let testName = armor.data.name;
      this.prepareRollDialog(testName, 0, 0, armor.data.data.bonus.value, "", 0, 0);
    });
    html.find(".roll-armor.total").click((ev) => {
      let armorTotal = 0;
      const items = this.actor.items;
      items.forEach((item) => {
        if (item.type == "armor") {
          armorTotal += item.data.data.bonus.value;
        }
      });
      let testName = game.i18n.localize("HEADER.ARMOR").toUpperCase();
      this.prepareRollDialog(testName, 0, 0, armorTotal, "", 0, 0);
    });
    html.find(".critical-injury.item .name .name").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      const criticalInjury = this.actor.getOwnedItem(div.data("itemId"));
      this.sendCriticalInjuryToChat(criticalInjury);
    });
    html.find(".talent.item .name .name").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      const talent = this.actor.getOwnedItem(div.data("itemId"));
      this.sendTalentToChat(talent);
    });
    html.find(".spell.item .name .name").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      const spell = this.actor.getOwnedItem(div.data("itemId"));
      this.sendSpellToChat(spell);
    });
    html.find(".gear.item .name .name").click((ev) => {
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
    html.find(".roll-consumable").click((ev) => {
      const consumableName = $(ev.currentTarget).data("consumable");
      const consumable = this.actor.data.data.consumable[consumableName];
      this.rollConsumable(consumable);
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
      item.isTalent = item.type === "talent";
      item.isWeapon = item.type === "weapon";
      item.isArmor = item.type === "armor";
      item.isGear = item.type === "gear";
      item.isRawMaterial = item.type === "rawMaterial";
      item.isSpell = item.type === "spell";
      item.isCriticalInjury = item.type === "criticalInjury";
    }
  }

  onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget;
    let data = duplicate(header.dataset);
    data["name"] = `New ${data.type.capitalize()}`;
    this.actor.createEmbeddedEntity("OwnedItem", data);
  }

  prepareArtifactString(bonus) {
    let regex = /([0-9]*)d([0-9]*)/g;
    let regexMatch;
    let artifact = "";
    while ((regexMatch = regex.exec(bonus))) {
      artifact = artifact + regexMatch[0] + " ";
    }
    return artifact;
  }

  push() {
    this.dices.forEach((dice) => {
      if ((dice.value < 6 && dice.value > 1 && dice.type !== "skill") || (dice.value < 6 && dice.type === "skill")) {
        dice.value = Math.floor(Math.random() * Math.floor(dice.face)) + 1;
        let successAndWeight = this.getSuccessAndWeight(dice.value, dice.type);
        dice.success = successAndWeight.success;
        dice.weight = successAndWeight.weight;
      }
    });
    this.sendRollToChat(true);
  }

  rollConsumable(consumable) {
    let consumableName = game.i18n.localize(consumable.label);
    let resultMessage;
    if (!consumable.value) {
      resultMessage = "<b>" + consumableName + "</b></br><b style='color:red'>Empty.</b>";
    } else {
      let die = new Die(consumable.value);
      die.roll(1);
      if (die.total > 1) {
        resultMessage = "<b>" + consumableName + "</b></br><b style='color:green'>Succeed</b>";
      } else if (parseInt(consumable.value, 10) === 6) {
        resultMessage = "<b>" + consumableName + "</b></br><b style='color:red'>Failed. No more " + consumableName.toLowerCase() + "!</b>";
      } else {
        resultMessage = "<b>" + consumableName + "</b></br><b style='color:red'>Failed. Downgrading to " + (consumable.value - 2) + "</b>";
      }
    }
    let chatData = {
      user: game.user._id,
      content: resultMessage,
    };
    ChatMessage.create(chatData, {});
  }

  sendCriticalInjuryToChat(criticalInjury) {
    let message =
      "<b>" +
      criticalInjury.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("CRITICAL_INJURY.LETHAL") +
      ": </b>" +
      criticalInjury.data.data.lethal +
      "</br>" +
      "<b>" +
      game.i18n.localize("CRITICAL_INJURY.LIMIT") +
      ": </b>" +
      criticalInjury.data.data.limit +
      "</br>" +
      "<b>" +
      game.i18n.localize("CRITICAL_INJURY.EFFECT") +
      ": </b>" +
      criticalInjury.data.data.effect +
      "</br>" +
      "<b>" +
      game.i18n.localize("CRITICAL_INJURY.HEALING_TIME") +
      ": </b>" +
      criticalInjury.data.data.healingTime;
    let chatData = {
      user: game.user._id,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  sendTalentToChat(talent) {
    let message =
      "<b>" +
      talent.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("TALENT.RANK") +
      ": </b>" +
      talent.data.data.rank +
      "</br>" +
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

  sendSpellToChat(spell) {
    let message =
      "<b>" +
      spell.name.toUpperCase() +
      "</b></br>" +
      "<b>" +
      game.i18n.localize("SPELL.RANK") +
      ": </b>" +
      spell.data.data.rank +
      "</br>" +
      "<b>" +
      game.i18n.localize("SPELL.RANGE") +
      ": </b>" +
      spell.data.data.range +
      "</br>" +
      "<b>" +
      game.i18n.localize("SPELL.DURATION") +
      ": </b>" +
      spell.data.data.duration +
      "</br>" +
      "<b>" +
      game.i18n.localize("SPELL.INGREDIENT") +
      ": </b>" +
      spell.data.data.ingredient +
      "</br>" +
      "<b>" +
      game.i18n.localize("SPELL.DESCRIPTION") +
      ": </b>" +
      spell.data.data.description;
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
      artifact.data.data.bonus.value +
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
        {
          label: "Push",
          class: "push-roll",
          icon: "fas fa-skull",
          onclick: (ev) => this.push(),
        },
      ].concat(buttons);
    }

    return buttons;
  }
}
