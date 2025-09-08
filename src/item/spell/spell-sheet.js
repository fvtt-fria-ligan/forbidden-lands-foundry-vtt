import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsSpellSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/item/spell/spell-sheet.hbs",
		});
	}

	async getData(options = {}) {
		const data = await super.getData(options);

		data.spellTypes = [
			{ value: "SPELL.SPELL", label: "SPELL.SPELL" },
			{ value: "SPELL.POWER_WORD", label: "SPELL.POWER_WORD" },
			{ value: "SPELL.RITUAL", label: "SPELL.RITUAL" },
		];

		return data;
	}
}
