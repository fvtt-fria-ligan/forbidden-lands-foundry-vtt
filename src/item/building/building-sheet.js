import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsBuildingSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template:
				"systems/forbidden-lands/templates/item/building/building-sheet.hbs",
		});
	}
}
