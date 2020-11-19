import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsSpellSheet extends ForbiddenLandsItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/forbidden-lands/model/spell.html",
        });
    }
}
