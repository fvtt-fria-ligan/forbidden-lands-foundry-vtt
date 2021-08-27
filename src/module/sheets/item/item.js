export class ForbiddenLandsItemSheet extends ItemSheet {
	get itemData() {
		return this.item.data;
	}

	get itemProperties() {
		return this.itemData.data;
	}

	get config() {
		return CONFIG.fbl;
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			classes: ["forbidden-lands", "sheet", "item"],
			width: window.innerWidth * 0.08 + 350,
			resizable: false,
		});
	}

	_getHeaderButtons() {
		let buttons = super._getHeaderButtons();
		buttons = [
			{
				label: game.i18n.localize("SHEET.HEADER.POST_ITEM"),
				class: "item-post",
				icon: "fas fa-comment",
				onclick: () => {
					const item = this.item;
					item.sendToChat();
				},
			},
		].concat(buttons);
		return buttons;
	}

	_computeQuality(data) {
		data.artifact = !!data.data.artifactBonus;
		data.lethal = data.data.lethal === "yes";
		data.ranks = !data.data.type || data.data.type !== "kin";
	}

	getData() {
		const superData = super.getData();
		const data = superData.data;
		this._computeQuality(data);
		return data;
	}

	_onChangeTab(event, tabs, active) {
		$(`#${this.id} textarea`).each(function () {
			if (this.value) {
				this.readOnly = true;
				this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
			}
		});
		return super._onChangeTab(event, tabs, active);
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.find(".add-modifier").click(async (ev) => {
			ev.preventDefault();
			let data = this.getData();
			let rollModifiers = data.data.rollModifiers || {};
			// To preserve order, make sure the new index is the highest
			let modifierId = Math.max(-1, ...Object.getOwnPropertyNames(rollModifiers)) + 1;
			let update = {};
			// Using a default value of Strength and 1 in order NOT to create an empty modifier.
			update[`data.rollModifiers.${modifierId}`] = {
				name: "ATTRIBUTE.STRENGTH",
				value: "+1",
			};
			await this.item.update(update);
		});
		html.find(".delete-modifier").click(async (ev) => {
			ev.preventDefault();
			let data = this.getData();
			let rollModifiers = duplicate(data.data.rollModifiers || {});
			let modifierId = $(ev.currentTarget).data("modifier-id");
			delete rollModifiers[modifierId];
			// Safety cleanup of null modifiers
			for (let key in Object.keys(rollModifiers)) {
				if (!rollModifiers[key]) {
					delete rollModifiers[key];
				}
			}
			// There seems to be some issue replacing an existing object, if we set
			// it to null first it works better.
			await this.item.update({ "data.rollModifiers": null });
			if (Object.keys(rollModifiers).length > 0) {
				await this.item.update({ "data.rollModifiers": rollModifiers });
			}
		});
		html.find(".change-bonus").on("click contextmenu", (ev) => {
			const bonus = this.object.data.data.bonus;
			let value = bonus.value;
			const altInteraction = game.settings.get("forbidden-lands", "alternativeSkulls");
			if ((ev.type === "click" && !altInteraction) || (ev.type === "contextmenu" && altInteraction)) {
				value = Math.max(value - 1, 0);
			} else if ((ev.type === "contextmenu" && !altInteraction) || (ev.type === "click" && altInteraction)) {
				value = Math.min(value + 1, bonus.max);
			}
			this.object.update({
				["data.bonus.value"]: value,
			});
		});
		html.find(".feature").click(async (ev) => {
			const featureName = $(ev.currentTarget).data("feature");
			const features = this.object.data.data.features;
			if (CONFIG.fbl.weaponFeatures.includes(featureName))
				this.object.update({ [`data.features.${featureName}`]: !features[featureName] });
			this._render();
		});
	}

	async getCustomRollModifiers() {
		let pack = game.packs.get("world.customrollmodifiers");
		if (pack) {
			let customRollModifier = await pack.getContent();
			return customRollModifier.map((item) => item.name);
		}
		return [];
	}

	async _renderInner(data, options) {
		data = {
			...data,
			alternativeSkulls: game.settings.get("forbidden-lands", "alternativeSkulls"),
			showCraftingFields: game.settings.get("forbidden-lands", "showCraftingFields"),
			showCostField: game.settings.get("forbidden-lands", "showCostField"),
			showSupplyField: game.settings.get("forbidden-lands", "showSupplyField"),
			showEffectField: game.settings.get("forbidden-lands", "showEffectField"),
			showDescriptionField: game.settings.get("forbidden-lands", "showDescriptionField"),
			showDrawbackField: game.settings.get("forbidden-lands", "showDrawbackField"),
			showAppearanceField: game.settings.get("forbidden-lands", "showAppearanceField"),
		};
		data.data.customRollModifiers = await this.getCustomRollModifiers();
		return super._renderInner(data, options);
	}
}
