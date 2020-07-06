export class ForbiddenLandsArtifactSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["forbidden-lands", "sheet", "item"],
      template: "systems/forbidden-lands/model/artifact.html",
      width: 400,
      height: 700,
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
