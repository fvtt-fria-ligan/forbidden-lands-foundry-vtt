import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsMonsterAttackSheet extends ForbiddenLandsItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/forbidden-lands/model/monster-attack.html",
        });
    }
}
