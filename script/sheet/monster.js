import { ForbiddenLandsActorSheet } from "./actor.js";

export class ForbiddenLandsMonsterSheet extends ForbiddenLandsActorSheet {
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
      this.prepareRollDialog(testName, weapon.data.data.dice, 0, 0, "", 0, weapon.data.data.damage);
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
      item.isGear = item.type !== "monsterAttack" && item.type !== "monsterTalent";
    }
  }

  onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget;
    let data = duplicate(header.dataset);
    data["name"] = `New ${data.type.capitalize()}`;
    this.actor.createEmbeddedEntity("OwnedItem", data);
  }

  sendTalentToChat(talent) {
    let message =
      "<b>" + talent.name.toUpperCase() + "</b></br>" + "<b>" + game.i18n.localize("TALENT.DESCRIPTION") + ": </b>" + talent.data.data.description;
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
      ].concat(buttons);
    }

    return buttons;
  }
}
