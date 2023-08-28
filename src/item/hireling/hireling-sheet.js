import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsHirelingSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template:
				"systems/forbidden-lands/templates/item/hireling/hireling-sheet.hbs",
		});
	}
}
