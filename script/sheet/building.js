import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsBuildingSheet extends ForbiddenLandsItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/forbidden-lands/model/building.html",
            width: 400,
            height: 522,
        });
    }
}
