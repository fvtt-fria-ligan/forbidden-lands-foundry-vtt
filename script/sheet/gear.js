import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsGearSheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/gear.html",
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "attributes",
        },
      ],
    });
  }

  computeQuality(data) {
    data.artifact = data.data.artifactBonus !== "";
  }

  getData() {
    const data = super.getData();
    this.computeQuality(data);
    return data;
  }

  async _renderInner(data, options) {
    data.showAppearanceField = game.settings.get("forbidden-lands", "showAppearanceField");
    return super._renderInner(data, options);
  }
}
