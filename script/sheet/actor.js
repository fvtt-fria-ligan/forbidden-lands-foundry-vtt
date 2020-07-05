export class ForbiddenLandsActorSheet extends ActorSheet {
  activateListeners(html) {
    super.activateListeners(html);

    // Attribute markers
    html.find("a.change-attribute").on("click contextmenu", (ev) => {
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
    // Item bonus markers
    html.find("a.change-item-bonus").on("click contextmenu", (ev) => {
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
    // Damage skulls
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

    // Rolls
    html.find("button.roll-attribute").click((ev) => {
      const attributeName = $(ev.currentTarget).data("attribute");
      const attribute = this.actor.data.data.attribute[attributeName];
      let testName = game.i18n.localize(attribute.label).toUpperCase();
      this.prepareRollDialog(testName, attribute.value, 0, 0, "", 0, 0);
    });
    html.find("button.roll-skill").click((ev) => {
      const skillName = $(ev.currentTarget).data("skill");
      const skill = this.actor.data.data.skill[skillName];
      const attribute = this.actor.data.data.attribute[skill.attribute];
      let testName = game.i18n.localize(skill.label).toUpperCase();
      this.prepareRollDialog(testName, attribute.value, skill.value, 0, "", 0, 0);
    });
  }
}
