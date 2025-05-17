import { ForbiddenLandsItemSheet } from "@item/item-sheet";

export class ForbiddenLandsTalentSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template:
				"systems/forbidden-lands/templates/item/talent/talent-sheet.hbs",
		});
	}

	async getData(options = {}) {
		const data = await super.getData(options);

		data.talentTypes = [
			{ value: "general", label: "TALENT.GENERAL" },
			{ value: "kin", label: "TALENT.KIN" },
			{ value: "profession", label: "TALENT.PROFESSION" },
			{ value: "monster", label: "TALENT.MONSTER" },
			{ value: "weakness", label: "TALENT.WEAKNESS" },
		];

		return data;
	}
}
