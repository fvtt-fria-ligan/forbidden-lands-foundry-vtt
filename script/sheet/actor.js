import { RollDialog } from "../dialog/roll-dialog.js";
import DiceRoller from "../components/dice-roller.js";

export class ForbiddenLandsActorSheet extends ActorSheet {
  diceRoller = new DiceRoller();

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
    html.find(".item-post").click((ev) => {
      const div = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(div.data("itemId"));
      item.sendToChat();
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
      RollDialog.prepareRollDialog(testName, attribute.value, 0, 0, "", 0, 0, this.diceRoller);
    });
    html.find(".roll-skill").click((ev) => {
      const skillName = $(ev.currentTarget).data("skill");
      const skill = this.actor.data.data.skill[skillName];
      const attribute = this.actor.data.data.attribute[skill.attribute];
      let testName = game.i18n.localize(skill.label).toUpperCase();
      RollDialog.prepareRollDialog(testName, attribute.value, skill.value, 0, "", 0, 0, this.diceRoller);
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
      RollDialog.prepareRollDialog(testName, base, skill, bonus, weapon.data.data.artifactBonus || "", weapon.data.data.skillBonus, weapon.data.data.damage, this.diceRoller);
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
}