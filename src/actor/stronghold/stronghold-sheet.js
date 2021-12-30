import { ForbiddenLandsActorSheet } from "../actor-sheet.js";
export class ForbiddenLandsStrongholdSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			classes: ["forbidden-lands", "sheet", "actor"],
			template: "systems/forbidden-lands/templates/actor/stronghold/stronghold-sheet.hbs",
			width: 650,
			height: 700,
			resizable: false,
			scrollY: [".buildings.item-list .items", ".hirelings.item-list .items", ".gears.item-listing .items"],
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "building",
				},
			],
		});
	}

	getData() {
		const actorData = super.getData();
		this._computeItems(actorData);
		return actorData;
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.find(".item-create").click((ev) => {
			this.onItemCreate(ev);
		});
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
					(CONFIG.fbl.encumbrance[item.data.weight] ?? item.data.weight ?? 1) * (item.data.quantity ?? 1);
			}
		}
	}

	onItemCreate(event) {
		event.preventDefault();
		let header = event.currentTarget;
		let data = duplicate(header.dataset);
		data.name = `New ${data.type.capitalize()}`;
		this.actor.createEmbeddedDocuments("Item", data, { renderSheet: true });
	}
}
