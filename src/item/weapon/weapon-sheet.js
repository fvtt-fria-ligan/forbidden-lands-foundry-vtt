import { ForbiddenLandsItemSheet } from "@item/item-sheet";
export class ForbiddenLandsWeaponSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template:
				"systems/forbidden-lands/templates/item/weapon/weapon-sheet.hbs",
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

		data.categoryOptions = [
			{ value: "melee", label: "WEAPON.MELEE" },
			{ value: "ranged", label: "WEAPON.RANGED" },
		];

		data.gripOptions = [
			{ value: "1h", label: "WEAPON.1H" },
			{ value: "2h", label: "WEAPON.2H" },
		];

		data.rangeOptions = [
			{ value: "arm", label: "RANGE.ARM" },
			{ value: "near", label: "RANGE.NEAR" },
			{ value: "short", label: "RANGE.SHORT" },
			{ value: "long", label: "RANGE.LONG" },
			{ value: "distant", label: "RANGE.DISTANT" },
		];

		data.ammoOptions = [
			{ value: "other", label: "WEAPON.AMMO_OTHER" },
			{ value: "arrows", label: "WEAPON.AMMO_ARROWS" },
		];

		return data;
	}
}
