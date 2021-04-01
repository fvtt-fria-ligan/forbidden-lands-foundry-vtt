import { ForbiddenLandsItemSheet } from "./item.js";
export class ForbiddenLandsMonsterAttackSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/monster-attack.hbs",
		});
	}
}
