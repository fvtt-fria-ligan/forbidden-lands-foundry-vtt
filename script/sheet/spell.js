import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsSpellSheet extends ForbiddenLandsItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/forbidden-lands/model/spell.html",
            width: 400,
            height: 470,
        });
    }
}
