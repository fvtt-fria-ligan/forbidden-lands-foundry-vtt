import { ForbiddenLandsItemSheet } from "./item.js";
export class ForbiddenLandsTalentSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/talent.hbs",
		});
	}
}
