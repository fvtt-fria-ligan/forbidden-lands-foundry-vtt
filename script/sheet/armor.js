import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsArmorSheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/armor.html",
      width: 400,
      height: 400,
    });
  }
}
