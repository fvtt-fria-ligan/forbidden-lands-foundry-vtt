export class ForbiddenLandsItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["forbidden-lands", "sheet", "item"],
      width: 400,
      height: "auto",
      resizable: false,
    });
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: "Post Item",
        class: "item-post",
        icon: "fas fa-comment",
        onclick: (ev) => this.item.sendToChat(),
      }
    ].concat(buttons);
    return buttons;
  }

  getData() {
    const data = super.getData();
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".add-modifier").click(async (ev) => {
      ev.preventDefault();
      let data = this.getData();
      let rollModifiers = data.data.rollModifiers || {};
      // To preserve order, make sure the new index is the highest
      let modifierId = Math.max(-1, ...Object.getOwnPropertyNames(rollModifiers)) + 1;
      let update = {};
      update[`data.rollModifiers.${modifierId}`] = {
        name: "",
        value: ""
      };
      await this.item.update(update);
    });
    html.find(".delete-modifier").click(async (ev) => {
      ev.preventDefault();
      let data = this.getData();
      let rollModifiers = duplicate(data.data.rollModifiers || {});
      let modifierId = $(ev.currentTarget).data("modifier-id");
      delete rollModifiers[modifierId];
      // Safety cleanup of null modifiers
      for (let key in Object.keys(rollModifiers)) {
        if (!rollModifiers[key]) {
          delete rollModifiers[key];
        }
      }
      // There seems to be some issue replacing an existing object, if we set
      // it to null first it works better.
      await this.item.update({"data.rollModifiers": null});
      if (Object.keys(rollModifiers).length > 0) {
        await this.item.update({"data.rollModifiers": rollModifiers});
      }
    });
  }

  async getCustomRollModifiers() {
    let pack = game.packs.get("world.customrollmodifiers");
    if (pack) {
      let customRollModifier = await pack.getContent();
      return customRollModifier.map(item => item.name);
    }
    return [];
  }

  async _renderInner(data, options) {
    data.data.customRollModifiers = await this.getCustomRollModifiers();
    data.showCraftingFields = game.settings.get("forbidden-lands", "showCraftingFields");
    data.showCostField = game.settings.get("forbidden-lands", "showCostField");
    data.showSupplyField = game.settings.get("forbidden-lands", "showSupplyField");
    data.showEffectField = game.settings.get("forbidden-lands", "showEffectField");
    data.showDescriptionField = game.settings.get("forbidden-lands", "showDescriptionField");
    data.showDrawbackField = game.settings.get("forbidden-lands", "showDrawbackField");
    data.showAppearanceField = game.settings.get("forbidden-lands", "showAppearanceField");
    return super._renderInner(data, options);
  }
}
