import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsHirelingSheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/hireling.html",
      width: 400,
      height: 400,
    });
  }
}
