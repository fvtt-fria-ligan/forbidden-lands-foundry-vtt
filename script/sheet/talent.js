import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsTalentSheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/talent.html",
      width: 400,
      height: 425,
    });
  }
}
