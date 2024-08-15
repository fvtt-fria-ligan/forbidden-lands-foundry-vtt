import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsMonsterAttackSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template:
				"systems/forbidden-lands/templates/item/monster-attack/monster-attack-sheet.hbs",
		});
	}
}
