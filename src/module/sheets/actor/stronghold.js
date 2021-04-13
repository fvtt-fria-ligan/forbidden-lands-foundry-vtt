import { ForbiddenLandsActorSheet } from "./actor.js";
export class ForbiddenLandsStrongholdSheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			classes: ["forbidden-lands", "sheet", "actor"],
			template: "systems/forbidden-lands/templates/stronghold.hbs",
			width: 600,
			height: 700,
			resizable: false,
			scrollY: [".buildings.item-list .items", ".hirelings.item-list .items", ".gears.item-list .items"],
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
		const data = super.getData();
		this._computeItems(data);
		return data;
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
					game.fbl.config.encumbrance[item.data.weight] ?? item.data.weight ?? 1 * item.data.quantity ?? 1;
			}
		}
	}

	onItemCreate(event) {
		event.preventDefault();
		let header = event.currentTarget;
		let data = duplicate(header.dataset);
		data.name = `New ${data.type.capitalize()}`;
		this.actor.createEmbeddedEntity("OwnedItem", data, { renderSheet: true });
	}
}
