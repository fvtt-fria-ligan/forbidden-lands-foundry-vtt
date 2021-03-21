import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsBuildingSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/template/building.hbs",
		});
	}
}
