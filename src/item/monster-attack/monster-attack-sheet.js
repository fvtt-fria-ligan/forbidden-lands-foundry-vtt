import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsMonsterAttackSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template:
				"systems/forbidden-lands/templates/item/monster-attack/monster-attack-sheet.hbs",
		});
	}

	async getData(options = {}) {
		const data = await super.getData(options);

		data.rangeOptions = [
			{ value: "arm", label: "RANGE.ARM" },
			{ value: "near", label: "RANGE.NEAR" },
			{ value: "short", label: "RANGE.SHORT" },
			{ value: "long", label: "RANGE.LONG" },
			{ value: "distant", label: "RANGE.DISTANT" },
		];

		data.damageTypeOptions = [
			{ value: "stab", label: "ATTACK.STAB" },
			{ value: "slash", label: "ATTACK.SLASH" },
			{ value: "blunt", label: "ATTACK.BLUNT" },
			{ value: "fear", label: "ATTACK.FEAR" },
			{ value: "other", label: "ATTACK.OTHER" },
		];

		return data;
	}
}
