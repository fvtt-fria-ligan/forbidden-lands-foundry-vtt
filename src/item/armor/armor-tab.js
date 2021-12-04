import { ForbiddenLandsItemSheet } from "../item.js";

export class ForbiddenLandsArmorSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/armor.hbs",
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
