import { ForbiddenLandsItemSheet } from "./item.js";
export class ForbiddenLandsGearSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/gear.hbs",
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
