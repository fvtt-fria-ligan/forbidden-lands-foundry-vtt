import { ForbiddenLandsActorSheet } from "./actor.js";
import { RollDialog } from "../dialog/roll-dialog.js";

export class ForbiddenLandsCharacterSheet extends ForbiddenLandsActorSheet {
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
    this.computeEncumbrance(data);
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
        this.actor.update({ "data.condition.sleepy.value": !conditionValue });
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
      let base;
      let skill;
      if (armor.data.data.part === "shield") {
        base = {
          name: game.i18n.localize(game.i18n.localize(this.actor.data.data.attribute.strength.label)),
          value: this.actor.data.data.attribute.strength.value,
        };
        skill = {
          name: game.i18n.localize(game.i18n.localize(this.actor.data.data.skill.melee.label)),
          value: this.actor.data.data.skill.melee.value,
        };
      } else {
        base = 0;
        skill = 0;
      }
      RollDialog.prepareRollDialog(testName, base, skill, armor.data.data.bonus.value, "", 0, 0, this.diceRoller);
    });
    html.find(".roll-armor.total").click((ev) => {
      let armorTotal = 0;
      const items = this.actor.items;
      items.forEach((item) => {
        if (item.type === "armor" && item.data.data.part !== "shield") {
          armorTotal += parseInt(item.data.data.bonus.value, 10);
        }
      });
      let testName = game.i18n.localize("HEADER.ARMOR").toUpperCase();
      RollDialog.prepareRollDialog(testName, 0, 0, armorTotal, "", 0, 0, this.diceRoller);
    });
    html.find(".roll-consumable").click((ev) => {
      const consumableName = $(ev.currentTarget).data("consumable");
      const consumable = this.actor.data.data.consumable[consumableName];
      this.diceRoller.rollConsumable(consumable);
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

  _computerItemEncumbrance(data) {
    switch (data.type) {
      case "armor":
      case "gear":
      case "weapon":
        switch (data.data.weight) {
          case "tiny":
            return 0;
          case "light":
            return 0.5;
          case "heavy":
            return 2;
          default:
            return 1;
        }
      case "rawMaterial":
        return 1;
      default:
        return 0;
    }
  }

  computeEncumbrance(data) {
    let weightCarried = 0;
    for (let item of Object.values(data.items)) {
      weightCarried += this._computerItemEncumbrance(item);
    }
    for (let consumable of Object.values(data.data.consumable)) {
      if (consumable.value > 0) {
        weightCarried += 1;
      }
    }
    const coinsCarried = data.data.currency.gold.value + data.data.currency.silver.value + data.data.currency.copper.value;
    weightCarried += Math.floor(coinsCarried / 100) * 0.5;
    const weightAllowed = data.data.attribute.strength.max * 2;
    data.data.encumbrance = {
      value: weightCarried,
      max: weightAllowed,
      over: weightCarried > weightAllowed,
    };
  }

  onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget;
    let data = duplicate(header.dataset);
    data["name"] = `New ${data.type.capitalize()}`;
    this.actor.createEmbeddedEntity("OwnedItem", data, { renderSheet: true });
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();

    if (this.actor.owner) {
      buttons = [
        {
          label: "Roll",
          class: "custom-roll",
          icon: "fas fa-dice",
          onclick: (ev) => RollDialog.prepareRollDialog("Roll", 0, 0, 0, "", 0, 0, this.diceRoller),
        },
        {
          label: "Push",
          class: "push-roll",
          icon: "fas fa-skull",
          onclick: (ev) => this.diceRoller.push(),
        },
      ].concat(buttons);
    }

    return buttons;
  }
}
