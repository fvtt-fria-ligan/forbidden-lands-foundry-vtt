export class ForbiddenLandsBuildingSheet extends ItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["forbidden-lands", "sheet", "item"],
            template: "systems/forbidden-lands/model/building.html",
            width: 400,
            height: 485,
            resizable: false
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
