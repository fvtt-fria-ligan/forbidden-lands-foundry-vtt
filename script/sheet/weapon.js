import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsWeaponSheet extends ForbiddenLandsItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/forbidden-lands/model/weapon.html",
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Weapon bonus markers
    html.find(".change-bonus").on("click contextmenu", (ev) => {
      const bonus = this.object.data.data.bonus;
      let value = bonus.value;
      if (ev.type === "click") {
        value = Math.max(value - 1, 0);
      } else if (ev.type === "contextmenu") {
        value = Math.min(value + 1, bonus.max);
      }
      this.object.update({
        ["data.bonus.value"]: value,
      });
    });
  }

}
