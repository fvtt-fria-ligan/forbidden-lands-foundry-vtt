export class ForbiddenLandsGearSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["forbidden-lands", "sheet", "item"],
      template: "systems/forbidden-lands/model/gear.html",
      width: 400,
      height: 350,
      resizable: false,
    });
  }

  getData() {
    const data = super.getData();
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
