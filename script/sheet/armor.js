import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsArmorSheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/armor.html",
    });
  }
}
