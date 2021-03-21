import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsSpellSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/template/spell.hbs",
		});
	}
}
