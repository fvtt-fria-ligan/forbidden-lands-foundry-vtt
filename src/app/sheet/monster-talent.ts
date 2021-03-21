import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsMonsterTalentSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/template/monster-talent.hbs",
		});
	}
}
