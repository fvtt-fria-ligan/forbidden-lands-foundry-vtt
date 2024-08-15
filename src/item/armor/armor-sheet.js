import { ForbiddenLandsItemSheet } from "@item/item-sheet";

export class ForbiddenLandsArmorSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/item/armor/armor-sheet.hbs",
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "main",
				},
			],
		});
	}
}
