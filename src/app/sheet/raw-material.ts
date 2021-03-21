import { ForbiddenLandsItemSheet } from "./item.js";

export class ForbiddenLandsRawMaterialSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/template/raw-material.hbs",
		});
	}
}
