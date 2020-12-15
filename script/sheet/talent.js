export class ForbiddenLandsTalentSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["forbidden-lands", "sheet", "item"],
      template: "systems/forbidden-lands-rpg/model/talent.html",
      width: 400,
      height: 425,
      resizable: false,
    });
  }

  getData() {
    const data = super.getData();
    return data;
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: "Post Item",
        class: "item-post",
        icon: "fas fa-comment",
        onclick: (ev) => this.item.sendToChat(),
      }
    ].concat(buttons);
    return buttons;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
