import { ForbiddenLandsActorSheet } from "../actor-sheet.js";
export class ForbiddenLandsStrongholdSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			classes: ["forbidden-lands", "sheet", "actor"],
			template:
				"systems/forbidden-lands/templates/actor/stronghold/stronghold-sheet.hbs",
			width: 650,
			height: 700,
			resizable: false,
			scrollY: [
				".buildings.item-list .items",
				".hirelings.item-list .items",
				".gears.item-listing .items",
			],
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "building",
				},
			],
		});
	}

	async getData() {
		const actorData = await super.getData();
		actorData.system.description = await TextEditor.enrichHTML(
			actorData.system.description,
			{ async: true },
		);
		this._computeItems(actorData);
		return actorData;
	}

	_computeItems(data) {
		for (let item of Object.values(data.items)) {
			item.isWeapon = item.type === "weapon";
			item.isArmor = item.type === "armor";
			item.isGear = item.type === "gear";
			item.isRawMaterial = item.type === "rawMaterial";
			item.isBuilding = item.type === "building";
			item.isHireling = item.type === "hireling";
			if (item.type !== "building" || item.type !== "hireling") {
				item.totalWeight =
					(CONFIG.fbl.encumbrance[item.system.weight] ??
						item.system.weight ??
						1) * (item.system.quantity ?? 1);
			}
		}
	}

	activateListeners(html) {
		super.activateListeners(html);

		const details = html.find("details");
		details.on("click", (e) => {
			const detail = $(e.target).closest("details");
			const content = detail.find("summary ~ *");
			if (detail.attr("open")) {
				e.preventDefault();
				content.slideUp(200);
				setTimeout(() => {
					detail.removeAttr("open");
				}, 200);
			} else content.slideDown(200);
		});
	}
}
