import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsCriticalInjurySheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/critical-injury.html",
      width: 400,
      height: 250,
    });
  }
}
