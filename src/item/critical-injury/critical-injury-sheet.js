import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsCriticalInjurySheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template:
				"systems/forbidden-lands/templates/item/critical-injury/critical-injury-sheet.hbs",
			width: 400,
			height: 310,
		});
	}
}
