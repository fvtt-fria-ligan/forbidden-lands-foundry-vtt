export class ForbiddenLandsItemSheet extends ItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands", "sheet", "item"],
			width: window.innerWidth * 0.15 + 150,
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
				onclick: (ev) => this.item.sendToChat(),
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
		const data = super.getData();
		this._computeQuality(data);
		return data;
	}

	_onChangeTab() {
		$(`#${this.id} textarea`).each(function () {
			if (this.value) {
				this.readOnly = true;
				this.setAttribute(
					"style",
					"height:" + this.scrollHeight + "px;overflow-y:hidden;"
				);
			}
		});
		return super._onChangeTab();
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.find(".add-modifier").click(async (ev) => {
			ev.preventDefault();
			let data = this.getData();
			let rollModifiers = data.data.rollModifiers || {};
			// To preserve order, make sure the new index is the highest
			let modifierId =
				Math.max(-1, ...Object.getOwnPropertyNames(rollModifiers)) + 1;
			let update = {};
			update[`data.rollModifiers.${modifierId}`] = {
				name: "",
				value: "",
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
			const altInteraction = game.settings.get(
				"forbidden-lands",
				"alternativeSkulls"
			);
			if (
				(ev.type === "click" && !altInteraction) ||
				(ev.type === "contextmenu" && altInteraction)
			) {
				value = Math.max(value - 1, 0);
			} else if (
				(ev.type === "contextmenu" && !altInteraction) ||
				(ev.type === "click" && altInteraction)
			) {
				value = Math.min(value + 1, bonus.max);
			}
			this.object.update({
				["data.bonus.value"]: value,
			});
		});
		html.find(".feature").click(async (ev) => {
			const featureName = $(ev.currentTarget).data("feature");
			const features = this.object.data.data.features;
			switch (featureName) {
				case "parrying":
					this.object.update({
						"data.features.parrying": !features.parrying,
					});
					break;
				case "hook":
					this.object.update({
						"data.features.hook": !features.hook,
					});
					break;
				case "edged":
					this.object.update({
						"data.features.edged": !features.edged,
					});
					break;
				case "pointed":
					this.object.update({
						"data.features.pointed": !features.pointed,
					});
					break;
				case "blunt":
					this.object.update({
						"data.features.blunt": !features.blunt,
					});
					break;
				case "slowReload":
					this.object.update({
						"data.features.slowReload": !features.slowReload,
					});
					break;
			}
			this._render();
		});
		html.find("textarea").on(
			"input blur contextmenu dblclick mouseover mouseout",
			(ev) => {
				if (game.user.isGM || this.object.isOwned) {
					const element = ev.currentTarget;
					const legend = document.createElement("legend");
					legend.classList.add("legend");
					legend.innerText = game.i18n.localize("SHEET.TEXTAREA_EDIT");
					switch (ev.type) {
						case "mouseover":
							if (element.readOnly) {
								element.after(legend);
								setTimeout(
									() => (legend.style.opacity = 1),
									100
								);
							}
							break;
						case "mouseout":
							$("textarea ~ legend").remove();
							break;
						case "input":
							element.style.height = element.scrollHeight + "px";
							break;
						case "blur":
							element.readOnly = true;
							break;
						case "contextmenu":
						case "dblclick":
							element.readOnly = false;
							$("textarea ~ legend").remove();
							break;
					}
				}
			}
		);
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
		data.alternativeSkulls = game.settings.get(
			"forbidden-lands",
			"alternativeSkulls"
		);
		data.data.customRollModifiers = await this.getCustomRollModifiers();
		data.showCraftingFields = game.settings.get(
			"forbidden-lands",
			"showCraftingFields"
		);
		data.showCostField = game.settings.get(
			"forbidden-lands",
			"showCostField"
		);
		data.showSupplyField = game.settings.get(
			"forbidden-lands",
			"showSupplyField"
		);
		data.showEffectField = game.settings.get(
			"forbidden-lands",
			"showEffectField"
		);
		data.showDescriptionField = game.settings.get(
			"forbidden-lands",
			"showDescriptionField"
		);
		data.showDrawbackField = game.settings.get(
			"forbidden-lands",
			"showDrawbackField"
		);
		data.showAppearanceField = game.settings.get(
			"forbidden-lands",
			"showAppearanceField"
		);
		return super._renderInner(data, options);
	}
}
