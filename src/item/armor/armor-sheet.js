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

	async getData(options = {}) {
		const data = await super.getData(options);

		data.weightOptions = [
			{ value: "none", label: "WEIGHT.NONE" },
			{ value: "tiny", label: "WEIGHT.TINY" },
			{ value: "light", label: "WEIGHT.LIGHT" },
			{ value: "regular", label: "WEIGHT.REGULAR" },
			{ value: "heavy", label: "WEIGHT.HEAVY" },
		];

		data.partOptions = [
			{ value: "body", label: "ARMOR.BODY" },
			{ value: "head", label: "ARMOR.HELMET" },
			{ value: "other", label: "ARMOR.OTHER" },
		];

		return data;
	}
}
