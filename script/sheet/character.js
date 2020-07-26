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
    this.actor.createEmbeddedEntity("OwnedItem", data, { renderSheet: true });
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
