import { ForbiddenLandsItemSheet } from "./item.js";
export class ForbiddenLandsCriticalInjurySheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/critical-injury.hbs",
			width: 400,
			height: 310,
		});
	}
}
