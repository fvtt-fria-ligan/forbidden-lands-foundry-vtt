export class ForbiddenLandsItemSheet extends foundry.appv1.sheets.ItemSheet {
	get itemData() {
		return this.item.data;
	}

	get itemProperties() {
		return this.item.system;
	}

	get config() {
		return CONFIG.fbl;
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			classes: ["forbidden-lands", "sheet", "item"],
			width: window.innerWidth * 0.08 + 350,
			resizable: false,
		});
	}

	static async enrichContent(content, isOwner) {
		return foundry.applications.ux.TextEditor.implementation.enrichHTML(
			content,
			{
				async: true,
				secrets: isOwner,
			},
		);
	}

	_getHeaderButtons() {
		let buttons = super._getHeaderButtons();
		buttons = [
			{
				label: game.i18n.localize("SHEET.HEADER.POST_ITEM"),
				class: "item-post",
				icon: "fas fa-comment",
				onclick: () => {
					this.item.sendToChat();
				},
			},
		].concat(buttons);
		return buttons;
	}

	#computeQuality(data) {
		data.artifact = !!data.system.artifactBonus;
		data.lethal = data.system.lethal === "yes";
		data.ranks =
			data.system.type === "general" || data.system.type === "profession";
		return data;
	}

	async #enrichTextEditorFields(data) {
		const fields = CONFIG.fbl.enrichedItemFields;

		for (const field of fields) {
			const [key, subKey] = field.split(".");
			if (subKey && data.system[key]?.[subKey]) {
				data.system[key][subKey] = await ForbiddenLandsItemSheet.enrichContent(
					data.system[key][subKey],
					game.user.isGM,
				);
			} else if (data.system[key]) {
				data.system[field] = await ForbiddenLandsItemSheet.enrichContent(
					data.system[field],
					game.user.isGM,
				);
			}
		}
		return data;
	}

	async getData() {
		const superData = super.getData();
		let data = superData.data;
		data.editable = this.isEditable;
		data.flags = this.item.flags["forbidden-lands"];
		data.encumbranceValues = this.config.encumbrance;
		data.isGM = game.user.isGM;
		data = this.#computeQuality(data);
		data = await this.#enrichTextEditorFields(data);
		data.system.customRollModifiers = await this.getCustomRollModifiers();

		data.artifactBonusOptions = [
			{ value: "", label: "ARTIFACT.REGULAR" },
			{ value: "0", label: "ARTIFACT.DICELESS" },
			{ value: "d8", label: "ARTIFACT.MIGHTY" },
			{ value: "d10", label: "ARTIFACT.EPIC" },
			{ value: "d12", label: "ARTIFACT.LEGENDARY" },
		];

		const customRollModifierHeader = game.i18n.localize("ITEM.CUSTOM_ROLL_MODIFIERS").toUpperCase();
		const customModifiers = data.system.customRollModifiers?.map((key) => ({
					value: key,
					label: key,
					group: customRollModifierHeader,
			  }));

		data.modifierOptions = [
			{ value: "", label: "ROLL_MODIFIER.SELECT", disabled: true },
			{ value: "ATTRIBUTE.STRENGTH", label: "ATTRIBUTE.STRENGTH", group: "HEADER.ATTRIBUTES" },
			{ value: "ATTRIBUTE.AGILITY", label: "ATTRIBUTE.AGILITY", group: "HEADER.ATTRIBUTES" },
			{ value: "ATTRIBUTE.WITS", label: "ATTRIBUTE.WITS", group: "HEADER.ATTRIBUTES" },
			{ value: "ATTRIBUTE.EMPATHY", label: "ATTRIBUTE.EMPATHY", group: "HEADER.ATTRIBUTES" },
			{ value: "SKILL.MIGHT", label: "SKILL.MIGHT", group: "HEADER.SKILLS" },

			{ value: "SKILL.ENDURANCE", label: "SKILL.ENDURANCE", group: "HEADER.SKILLS" },
			{ value: "SKILL.MELEE", label: "SKILL.MELEE", group: "HEADER.SKILLS" },
			{ value: "SKILL.CRAFTING", label: "SKILL.CRAFTING", group: "HEADER.SKILLS" },
			{ value: "SKILL.STEALTH", label: "SKILL.STEALTH", group: "HEADER.SKILLS" },
			{ value: "SKILL.SLEIGHT_OF_HAND", label: "SKILL.SLEIGHT_OF_HAND", group: "HEADER.SKILLS" },
			{ value: "SKILL.MOVE", label: "SKILL.MOVE", group: "HEADER.SKILLS" },
			{ value: "SKILL.MARKSMANSHIP", label: "SKILL.MARKSMANSHIP", group: "HEADER.SKILLS" },
			{ value: "SKILL.SCOUTING", label: "SKILL.SCOUTING", group: "HEADER.SKILLS" },
			{ value: "SKILL.LORE", label: "SKILL.LORE", group: "HEADER.SKILLS" },
			{ value: "SKILL.SURVIVAL", label: "SKILL.SURVIVAL", group: "HEADER.SKILLS" },
			{ value: "SKILL.INSIGHT", label: "SKILL.INSIGHT", group: "HEADER.SKILLS" },
			{ value: "SKILL.MANIPULATION", label: "SKILL.MANIPULATION", group: "HEADER.SKILLS" },
			{ value: "SKILL.PERFORMANCE", label: "SKILL.PERFORMANCE", group: "HEADER.SKILLS" },
			{ value: "SKILL.HEALING", label: "SKILL.HEALING", group: "HEADER.SKILLS" },
			{ value: "SKILL.ANIMAL_HANDLING", label: "SKILL.ANIMAL_HANDLING", group: "HEADER.SKILLS" },
			{ value: "ACTION.BREAK_FREE", label: "ACTION.BREAK_FREE", group: "HEADER.ACTIONS" },
			{ value: "ACTION.DISARM", label: "ACTION.DISARM", group: "HEADER.ACTIONS" },
			{ value: "ACTION.DODGE", label: "ACTION.DODGE", group: "HEADER.ACTIONS" },
			{ value: "ACTION.GRAPPLE", label: "ACTION.GRAPPLE", group: "HEADER.ACTIONS" },
			{ value: "ACTION.GRAPPLE_ATTACK", label: "ACTION.GRAPPLE_ATTACK", group: "HEADER.ACTIONS" },
			{ value: "ACTION.PARRY", label: "ACTION.PARRY", group: "HEADER.ACTIONS" },
			{ value: "ACTION.SHOVE", label: "ACTION.SHOVE", group: "HEADER.ACTIONS" },
			{ value: "ACTION.RETREAT", label: "ACTION.RETREAT", group: "HEADER.ACTIONS" },
			{ value: "ACTION.UNARMED_STRIKE", label: "ACTION.UNARMED_STRIKE", group: "HEADER.ACTIONS" },
			{ value: "CARRYING_CAPACITY", label: "CARRYING_CAPACITY", group: "OTHER" },
			{ value: "ITEM.TypeArmor", label: "ITEM.TypeArmor", group: "OTHER" },
			...customModifiers
		];

		return data;
	}

	_onChangeTab(event, tabs, active) {
		$(`#${this.id} textarea`).each(function () {
			if (this.value) {
				this.readOnly = true;
				this.setAttribute(
					"style",
					`height:${this.scrollHeight}px;overflow-y:hidden;`,
				);
			}
		});
		return super._onChangeTab(event, tabs, active);
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.find(".add-modifier").click(async (ev) => {
			ev.preventDefault();
			const data = await this.getData();
			const rollModifiers = data.system.rollModifiers || {};
			// To preserve order, make sure the new index is the highest
			const modifierId =
				Math.max(-1, ...Object.getOwnPropertyNames(rollModifiers)) + 1;
			const update = {};
			// Using a default value of Strength and 1 in order NOT to create an empty modifier.
			update[`system.rollModifiers.${modifierId}`] = {
				name: "ATTRIBUTE.STRENGTH",
				value: "+1",
			};
			await this.item.update(update);
		});
		html.find(".delete-modifier").click(async (ev) => {
			ev.preventDefault();
			const data = await this.getData();
			const rollModifiers = duplicate(data.system.rollModifiers || {});
			const modifierId = $(ev.currentTarget).data("modifier-id");
			delete rollModifiers[modifierId];
			// Safety cleanup of null modifiers
			for (const key in Object.keys(rollModifiers)) {
				if (!rollModifiers[key]) {
					delete rollModifiers[key];
				}
			}
			// There seems to be some issue replacing an existing object, if we set
			// it to null first it works better.
			await this.item.update({ "system.rollModifiers": null });
			if (Object.keys(rollModifiers).length > 0) {
				await this.item.update({ "system.rollModifiers": rollModifiers });
			}
		});
		html.find(".change-bonus").on("click contextmenu", (ev) => {
			const bonus = this.itemProperties.bonus;
			let value = bonus.value;
			const altInteraction = game.settings.get(
				"forbidden-lands",
				"alternativeSkulls",
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
				["system.bonus.value"]: value,
			});
		});
		html.find(".feature").click(async (ev) => {
			const featureName = $(ev.currentTarget).data("feature");
			const features = this.object.itemProperties.features;
			if (CONFIG.fbl.weaponFeatures.includes(featureName))
				this.object.update({
					[`system.features.${featureName}`]: !features[featureName],
				});
			this._render();
		});
		html.find(".hide-field").click((ev) => {
			const fieldName = $(ev.currentTarget).data("fieldname");
			const currentValue = this.object.getFlag("forbidden-lands", fieldName);
			this.object.setFlag("forbidden-lands", fieldName, !currentValue);
		});
	}

	async getCustomRollModifiers() {
		const pack = game.packs.get("world.customrollmodifiers");
		if (pack) {
			const customRollModifier = await pack.getDocuments();
			return customRollModifier.map((item) => item.name);
		}
		return [];
	}

	async _renderInner(data, options) {
		const showField = (field) => {
			const enabledInSettings = game.settings.get(
				"forbidden-lands",
				`show${field}Field`,
			);
			const isVisibleToPlayer =
				game.user.isGM || !this.object.getFlag("forbidden-lands", field);
			return enabledInSettings && isVisibleToPlayer;
		};
		data = {
			...data,
			alternativeSkulls: game.settings.get(
				"forbidden-lands",
				"alternativeSkulls",
			),
			showCraftingFields: game.settings.get(
				"forbidden-lands",
				"showCraftingFields",
			),
			showCostField: game.settings.get("forbidden-lands", "showCostField"),
			showSupplyField: game.settings.get("forbidden-lands", "showSupplyField"),
			showEffectField: showField("Effect"),
			showDescriptionField: showField("Description"),
			showDrawbackField: showField("Drawback"),
			showAppearanceField: showField("Appearance"),
		};
		return super._renderInner(data, options);
	}
}
