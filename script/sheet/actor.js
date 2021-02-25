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

    // Willpower markers
    html.find(".change-willpower").on("click contextmenu", (ev) => {
      const attribute = this.actor.data.data.bio.willpower;
      let value = attribute.value;
      if (ev.type === "click") {
        value = Math.max(value - 1, 0);
      } else if (ev.type === "contextmenu") {
        value = Math.min(value + 1, attribute.max);
      }
      this.actor.update({"data.bio.willpower.value": value});
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
      let modifiers = this.getRollModifiers(attribute.label);
      RollDialog.prepareRollDialog(
        attribute.label,
        {name: attribute.label, value: attribute.value},
        0,
        0,
        modifiers.artifacts.join(" "),
        modifiers.modifier,
        0,
        this.diceRoller
      );
    });
    html.find(".roll-skill").click((ev) => {
      const skillName = $(ev.currentTarget).data("skill");
      const skill = this.actor.data.data.skill[skillName];
      const attribute = this.actor.data.data.attribute[skill.attribute];
      let modifiers = this.getRollModifiers(attribute.label);
      modifiers = this.getRollModifiers(skill.label, modifiers);
      RollDialog.prepareRollDialog(
        skill.label, 
        {name: attribute.label, value: attribute.value}, 
        {name: skill.label, value: skill.value}, 
        0,
        modifiers.artifacts.join(" "),
        modifiers.modifier,
        0,
        this.diceRoller,
      );
    });
    html.find(".roll-weapon").click((ev) => {
      const itemId = $(ev.currentTarget).data("itemId");
      const weapon = this.actor.getOwnedItem(itemId);
      const action = $(ev.currentTarget).data("action");
      let testName =  action || weapon.name;
      let attribute;
      let skill;
      if (weapon.data.data.category === "melee") {
        attribute = this.actor.data.data.attribute.strength;
        skill = this.actor.data.data.skill.melee;
      } else {
        attribute = this.actor.data.data.attribute.agility;
        skill = this.actor.data.data.skill.marksmanship;
      }
      let bonus = this.parseBonus(weapon.data.data.bonus.value);
      let modifiers = this.parseModifiers(weapon.data.data.skillBonus);
      if (weapon.data.data.artifactBonus) {
        modifiers.artifacts.splice(0, 0, weapon.data.data.artifactBonus);
      }
      modifiers = this.getRollModifiers(attribute.label, modifiers);
      modifiers = this.getRollModifiers(skill.label, modifiers);
      if (action) {
        modifiers = this.getRollModifiers(action, modifiers);
      }
      RollDialog.prepareRollDialog(
        testName, 
        {name: attribute.label, value: attribute.value},
        {name: skill.label, value: skill.value},
        bonus, 
        modifiers.artifacts.join(" "),
        modifiers.modifier,
        action ? 0 : weapon.data.data.damage, 
        this.diceRoller
      );
    });
    html.find(".roll-spell").click((ev) => {
      const itemId = $(ev.currentTarget).data("itemId");
      const spell = this.actor.getOwnedItem(itemId);
      RollDialog.prepareSpellDialog(spell);
    });
    html.find(".roll-action").click((ev) => {
      const rollName = $(ev.currentTarget).data("action");
      const skillName = $(ev.currentTarget).data("skill");
      const skill = this.actor.data.data.skill[skillName];
      const attribute = this.actor.data.data.attribute[skill.attribute];
      let modifiers = this.getRollModifiers(attribute.label);
      modifiers = this.getRollModifiers(skill.label, modifiers);
      modifiers = this.getRollModifiers(rollName, modifiers);
      RollDialog.prepareRollDialog(
        rollName,
        {name: attribute.label, value: attribute.value},
        {name: skill.label, value: skill.value},
        0,
        modifiers.artifacts.join(" "),
        modifiers.modifier,
        0,
        this.diceRoller,
      );
    });
  }

  parseModifiers(str) {
    let sep = /[\s\+]+/;
    let artifacts = []
    let modifier = 0;
    if (typeof(str) === "string") {
      str.split(sep).forEach(item => {
        if (this.isArtifact(item)) {
          artifacts.push(item);
        } else {
          item = parseInt(item, 10);
          if (!isNaN(item)) {
            modifier += item;
          }
        }
      });
    } else if (typeof(str) === 'number') {
      modifier = str;
    }
    return {
      artifacts: artifacts,
      modifier: modifier
    }
  }

  isArtifact(artifact) {
    let regex = /([0-9]*)d([0-9]*)/i;
    return !!regex.exec(artifact);
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

  getRollModifiers(skillLabel, modifiers) {
    if (!modifiers) {
      modifiers = {modifier: 0, artifacts: []};
    }
    this.actor.items.forEach((item) => {
      let rollModifiers = item.data.data.rollModifiers;
      if (rollModifiers) {
        Object.values(rollModifiers).forEach((mod) => {
          if (mod && mod.name == skillLabel) {
            let parsed = this.parseModifiers(mod.value);
            modifiers.modifier += parsed.modifier;
            modifiers.artifacts = modifiers.artifacts.concat(parsed.artifacts);
          }
        });
      }
    });
    return modifiers;
  }
}
