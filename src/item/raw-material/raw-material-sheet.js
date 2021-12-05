import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsRawMaterialSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/item/raw-material/raw-material-sheet.hbs",
		});
	}
}
