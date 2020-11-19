import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsWeaponSheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/weapon.html",
    });
  }
}
