import { FBLRollHandler } from "@components/roll-engine/engine";
import localizeString from "@utils/localize-string";

/* eslint-disable no-unused-vars */
export class ForbiddenLandsActorSheet extends ActorSheet {
	altInteraction = game.settings.get("forbidden-lands", "alternativeSkulls");
	useHealthAndResolve = game.settings.get(
		"forbidden-lands",
		"useHealthAndResolve",
	);

	async getData() {
		let data = this.actor.toObject();
		data = await this.#enrichTextEditorFields(data);
		data.items = await Promise.all(
			this.actor.items.map((i) => i.sheet.getData()),
		);
		data.items?.sort((a, b) => (a.sort || 0) - (b.sort || 0));
		data = this.computeItems(data);
		data.carriedStates = this.#getCarriedStates();
		data.gear = this.#filterGear(data.items);
		data.system.useHealthAndResolve = this.useHealthAndResolve;
		data.system.condition = this.actor.system.condition;
		data.statuses = this.actor.statuses;

		return data;
	}

	get actorData() {
		return this.actor.data;
	}

	get actorProperties() {
		return this.actor.system;
	}

	get rollData() {
		return this.actor.getRollContext();
	}

	get config() {
		return CONFIG.fbl;
	}

	/**
	 * @override
	 * Extends the sheet drop handler for system specific usages
	 */
	async _onDrop(event, data) {
		const dragData = JSON.parse(event.dataTransfer.getData("text/plain"));
		if (dragData.type === "itemDrop")
			this.actor.createEmbeddedDocuments("Item", [dragData.item]);
		else super._onDrop(event, data);
	}

	async _onSortItem(event, itemData) {
		// Sorts items in the various containers by drag and drop
		const state = $(event.target).closest("[data-state]")?.data("state");
		if (state || state === "") {
			await this.actor.updateEmbeddedDocuments("Item", [
				{
					_id: itemData._id,
					flags: {
						"forbidden-lands": { state: state === "none" ? "" : state },
					},
				},
			]);
		}
		return super._onSortItem(event, itemData);
	}

	activateListeners(html) {
		super.activateListeners(html);
		if (!game.user.isGM && this.actor.limited) return;

		html.find(".item-create").click((ev) => this.#onItemCreate(ev));
		html.find(".create-dialog").click((ev) => {
			this.#onCreateDialog(ev);
		});

		// Attribute markers
		html.find(".change-attribute").on("click contextmenu", (ev) => {
			const attributeName = $(ev.currentTarget).data("attribute");
			const attribute = this.actorProperties.attribute[attributeName];
			let value = attribute.value;
			if (
				(ev.type === "click" && !this.altInteraction) ||
				(ev.type === "contextmenu" && this.altInteraction)
			) {
				value = Math.max(value - 1, 0);
			} else if (
				(ev.type === "contextmenu" && !this.altInteraction) ||
				(ev.type === "click" && this.altInteraction)
			) {
				value = Math.min(value + 1, attribute.max);
			}
			this.actor.update({
				[`system.attribute.${attributeName}.value`]: value,
			});
		});

		// Willpower markers
		html.find(".change-willpower").on("click contextmenu", (ev) => {
			const attribute = this.actorProperties.bio.willpower;
			let value = attribute.value;
			if (
				(ev.type === "click" && !this.altInteraction) ||
				(ev.type === "contextmenu" && this.altInteraction)
			) {
				value = Math.max(value - 1, 0);
			} else if (
				(ev.type === "contextmenu" && !this.altInteraction) ||
				(ev.type === "click" && this.altInteraction)
			) {
				value = Math.min(value + 1, attribute.max);
			}
			this.actor.update({ "system.bio.willpower.value": value });
		});

		html.find(".control-gear").click((ev) => {
			const direction = $(ev.currentTarget).data("direction");
			const oppositeDirection = direction === "carried" ? "" : "carried";
			const updates = this.actor.items
				.filter(
					(item) =>
						CONFIG.fbl.carriedItemTypes.includes(item.type) &&
						item.state === oppositeDirection,
				)
				.map((item) => {
					return {
						_id: item.id,
						flags: { "forbidden-lands": { state: direction } },
					};
				});
			this.actor.updateEmbeddedDocuments("Item", updates);
		});

		html.find(".collapse-table").click((ev) => {
			const state = $(ev.currentTarget).closest("[data-state]").data("state");
			this.actor.setFlag(
				"forbidden-lands",
				`${state}-collapsed`,
				!this.actor.getFlag("forbidden-lands", `${state ?? "none"}-collapsed`),
			);
		});

		html.find(".header-sort").click((ev) => {
			const state = $(ev.currentTarget).closest("[data-state]").data("state");
			const sort = $(ev.currentTarget).data("sort");
			this.actor.setFlag("forbidden-lands", `${state ?? "none"}-sort`, sort);
		});

		// Items
		html.find(".item-edit").click((ev) => {
			const div = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(div.data("itemId"));
			item.sheet.render(true);
		});

		html.find(".item-delete").click((ev) => {
			const div = $(ev.currentTarget).parents(".item");
			this.actor.deleteEmbeddedDocuments("Item", [div.data("itemId")]);
			div.slideUp(200, () => this.render(false));
		});

		html.find(".item-post").click((ev) => {
			const div = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(div.data("itemId"));
			item.sendToChat();
		});

		html.find(".change-item-bonus").on("click contextmenu", (ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			const item = this.actor.items.get(itemId);
			let value = item.system.bonus.value;
			if (
				(ev.type === "click" && !this.altInteraction) ||
				(ev.type === "contextmenu" && this.altInteraction)
			) {
				value = Math.max(value - 1, 0);
			} else if (
				(ev.type === "contextmenu" && !this.altInteraction) ||
				(ev.type === "click" && this.altInteraction)
			) {
				value = Math.min(value + 1, item.itemProperties.bonus.max);
			}
			item.update({
				"system.bonus.value": value,
			});
		});

		// Rolls
		html.find(".roll-attribute").click((ev) => {
			const attributeName = $(ev.currentTarget).data("attribute");
			return this.rollAttribute(attributeName);
		});

		html.find(".roll-skill").click((ev) => {
			const skillName = $(ev.currentTarget).data("skill");
			return this.rollSkill(skillName);
		});

		html.find(".roll-weapon").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			return this.rollGear(itemId);
		});

		html.find(".roll-spell").click((ev) => {
			const itemId = $(ev.currentTarget).data("itemId");
			return this.rollSpell(itemId);
		});

		html.find(".roll-action").click((ev) => {
			const rollName = $(ev.currentTarget).data("action");
			const itemId = $(ev.currentTarget).data("itemId");
			return this.rollAction(rollName, itemId ? itemId : null);
		});

		html.find(".quantity").on("blur", (ev) => {
			const itemId =
				ev.currentTarget.parentElement.parentElement.dataset.itemId ??
				ev.currentTarget.parentElement.dataset.itemId;
			if (!itemId) {
				ui.notifications.notify("ERROR.NO_ID", "error", { localize: true });
				throw new Error("No item id found");
			}
			this.actor.updateEmbeddedDocuments("Item", [
				{
					_id: itemId,
					"system.quantity": ev.currentTarget.value,
				},
			]);
		});
	}

	computeEncumbrance(data) {
		let weightCarried = 0;

		// Get the weight of all items
		for (const item of Object.values(data.items)) {
			weightCarried += this.computeItemEncumbrance(item);
		}

		if (this.actor.type === "character") {
			// Get the weight of all consumables
			for (const consumable of Object.values(data.system.consumable)) {
				if (consumable.value > 0) {
					weightCarried += 1;
				}
			}

			// Get the weight of all coins
			const coinsCarried =
				Number.parseInt(data.system.currency.gold.value) +
				Number.parseInt(data.system.currency.silver.value) +
				Number.parseInt(data.system.currency.copper.value);
			weightCarried += Math.floor(coinsCarried / 100) * 0.5;
		}

		// Calculate max encumbrance
		const baseEncumbrance = data.system.attribute.strength.max * 2;
		// eslint-disable-next-line no-nested-ternary
		const monsterEncumbranceMultiplier =
			this.actor.type === "monster" ? (data.system.isMounted ? 1 : 2) : 1;

		const modifiers = this.actor.getRollModifierOptions("carryingCapacity");
		const weightAllowed =
			baseEncumbrance * monsterEncumbranceMultiplier +
			// Moidifers
			modifiers.reduce((acc, m) => acc + Number.parseInt(m?.value || 0), 0);
		data.system.encumbrance = {
			value: weightCarried,
			max: weightAllowed,
			over: weightCarried > weightAllowed,
		};
		return data;
	}

	broken(type) {
		const msg =
			type === "item" ? "WARNING.ITEM_BROKEN" : "WARNING.ACTOR_BROKEN";
		ui.notifications.warn(msg, { localize: true });
		return new Error(locmsg);
	}

	getRollOptions(...rollIdentifiers) {
		return {
			...this.rollData,
			modifiers: this.actor.getRollModifierOptions(...rollIdentifiers),
		};
	}

	getAttribute(identifier) {
		const attributeName =
			CONFIG.fbl.skillAttributeMap[identifier] || identifier;
		const attribute = this.actor.attributes[attributeName];
		if (!attribute) return {};
		return {
			name: attributeName,
			...attribute,
		};
	}

	getSkill(identifier) {
		const skillName = CONFIG.fbl.actionSkillMap[identifier] || identifier;
		const skill = this.actor.skills[skillName];
		if (!skill) return {};
		const attribute = this.getAttribute(skillName);
		return {
			skill: { name: skillName, ...skill },
			attribute: { ...attribute },
		};
	}

	getGears() {
		return this.actor.items.filter(
			(item) => item.type === "gear" && !item.isBroken,
		);
	}

	getGear(itemId) {
		const gear = this.actor.items.get(itemId).getRollData();
		if (gear.isBroken) throw this.broken("item");
		const properties = this.getSkill(
			CONFIG.fbl.actionSkillMap[gear.category] || "melee",
		);

		return {
			gear: gear,
			...properties,
		};
	}

	/************************************************/
	/***               Actor Rolls                ***/
	/************************************************/

	rollAction(actionName, itemId = undefined) {
		if (!this.actor.canAct) throw this.broken();

		const properties = itemId
			? this.getGear(itemId)
			: this.getSkill(actionName);
		const data = {
			title: actionName,
			...properties,
		};
		if (itemId) data.gear.damage = undefined;
		const options = {
			...this.getRollOptions(
				actionName,
				data.skill?.name,
				data.attribute?.name,
				data.gear?.itemId,
			),
		};
		if (actionName === "unarmed") options.damage = 1;
		return FBLRollHandler.createRoll(data, {
			...options,
			gears: this.getGears(),
		});
	}

	rollArmor() {
		const rollName = `${localizeString("ITEM.TypeArmor")}: ${localizeString(
			"ARMOR.TOTAL",
		)}`;
		const identifiers = ["armor"];
		const artifactDies = [];
		const totalArmor = this.actor.itemTypes.armor.reduce((sum, armor) => {
			if (armor.itemProperties.part === "shield" || armor.state !== "equipped")
				return sum;
			const rollData = armor.getRollData();
			const value = armor.itemProperties.bonus.value;
			if (rollData.artifactDie) artifactDies.push(rollData.artifactDie);
			identifiers.push(armor.id);
			return sum + value;
		}, 0);

		const data = {
			title: rollName,
			gear: {
				label: localizeString("ITEM.TypeArmor"),
				name: localizeString("ITEM.TypeArmor"),
				value: totalArmor,
				artifactDie: artifactDies.join("+"),
			},
		};
		const options = {
			maxPush: "0",
			...this.getRollOptions(...identifiers),
		};

		const hasDice =
			!!totalArmor || !!artifactDies.length || !!options.modifiers.length;
		if (!hasDice)
			return ui.notifications.warn("WARNING.NO_ARMOR", { localize: true });

		return FBLRollHandler.createRoll(data, {
			...options,
			gears: this.getGears(),
		});
	}

	rollSpecificArmor(armorId) {
		const rollData = this.actor.items.get(armorId).getRollData();
		const rollName = `${localizeString("ITEM.TypeArmor")}: ${rollData.name}`;
		if (rollData.isBroken) throw this.broken("item");

		const data = {
			title: rollName,
			gear: rollData,
		};
		const options = {
			maxPush: "0",
			...this.getRollOptions("armor", armorId),
		};
		return FBLRollHandler.createRoll(data, {
			...options,
			gears: this.getGears(),
		});
	}

	rollAttribute(attrName) {
		if (!this.actor.canAct) throw this.broken();

		const data = {
			title: attrName,
			attribute: this.getAttribute(attrName),
		};
		const options = {
			...this.getRollOptions(attrName),
		};
		return FBLRollHandler.createRoll(data, {
			...options,
			gears: this.getGears(),
		});
	}

	rollGear(itemId) {
		if (!this.actor.canAct) throw this.broken();

		const properties = this.getGear(itemId);
		const data = {
			title: properties.gear.name,
			...properties,
		};
		const options = {
			...this.getRollOptions(
				data.skill?.name,
				data.attribute?.name,
				data.gear.itemId,
			),
		};
		return FBLRollHandler.createRoll(data, {
			...options,
			gears: this.getGears(),
		});
	}

	rollSkill(skillName) {
		if (!this.actor.canAct) throw this.broken();

		const data = {
			title: skillName,
			...this.getSkill(skillName),
		};
		const options = {
			...this.getRollOptions(skillName, data.attribute?.name),
		};
		return FBLRollHandler.createRoll(data, {
			...options,
			gears: this.getGears(),
		});
	}

	rollSpell(spellId) {
		if (!this.actor.canAct) throw this.broken();
		if (
			!this.actor.willpower.value &&
			!this.actorProperties.subtype?.type === "npc"
		)
			throw ui.notifications.warn("WARNING.NO_WILLPOWER", { localize: true });

		const spell = this.actor.items.get(spellId);
		let { value } = duplicate(this.actor.willpower);
		const hasPsych = !!this.actor.items.getName("Psychic Power (Half-Elf)");

		const data = {
			title: spell.name,
			attribute: {
				name: spell.name,
				value: 1,
			},
			spell: {
				willpower: { max: --value, value: value },
				psych: hasPsych,
				item: spell,
			},
		};

		// NPCs shouldn't have a restraint on willpower.
		if (this.actorProperties.subtype?.type === "npc")
			data.spell.willpower = {
				max: 9,
				value: 9,
			};

		const options = {
			maxPush: "0",
			template:
				"systems/forbidden-lands/templates/components/roll-engine/spell-dialog.hbs",
			type: "spell",
			skulls: this.altInteraction,
			...this.getRollOptions(),
		};
		return FBLRollHandler.createRoll(data, {
			...options,
			gears: this.getGears(),
		});
	}

	/************************************************/
	/************************************************/

	async _renderInner(data, options) {
		data.alternativeSkulls = this.altInteraction;
		return super._renderInner(data, options);
	}

	computeSkills(data) {
		const map = CONFIG.fbl.skillAttributeMap;
		for (const [key, skill] of Object.entries(data.system.skill)) {
			const connectedAttribute = map[key];
			skill[`has${connectedAttribute.capitalize()}`] = true;
		}
		return data;
	}

	computeItems(data) {
		for (const item of Object.values(data.items)) {
			// Shields were long treated as armor. They are not. This is a workaround for that.
			if (item.system.part === "shield") item.isWeapon = true;
			else if (CONFIG.fbl.itemTypes.includes(item.type))
				item[`is${item.type.capitalize()}`] = true;
			item.isEquipped = item.flags?.state === "equipped";
			item.isCarried = item.flags?.state === "carried";
		}
		return data;
	}

	computeItemEncumbrance(data) {
		const type = data.type;
		const weight = Number.isNaN(Number(data?.system.weight))
			? this.config.encumbrance[data?.system.weight] ?? 1
			: Number(data?.system.weight) ?? 1;
		// If the item isn't carried or equipped, don't count it.
		if (!data.flags?.state) return 0;
		// Only return weight for these types.
		if (type === "rawMaterial") return 1 * Number(data.system.quantity);
		if (["gear", "armor", "weapon"].includes(type)) return weight;
		// Talents, Spells, and the like dont have weight.
		return 0;
	}

	async #enrichTextEditorFields(data) {
		const fields = CONFIG.fbl.enrichedActorFields;
		for (const field of fields)
			if (data.system.bio?.[field]?.value)
				data.system.bio[field].value = await TextEditor.enrichHTML(
					data.system.bio[field].value,
					{
						async: true,
					},
				);
		return data;
	}

	#getCarriedStates() {
		const carrriedStates = CONFIG.fbl.carriedStates;
		return carrriedStates.map((state) => {
			return {
				name: state,
				collapsed: this.actor.getFlag("forbidden-lands", `${state}-collapsed`),
			};
		});
	}

	#getSortKey(state) {
		return (
			this.actor.getFlag("forbidden-lands", `${state ?? "none"}-sort`) || "name"
		);
	}

	#sortGear(a, b, key) {
		/* eslint-disable no-case-declarations, no-nested-ternary */
		switch (key) {
			case "name":
			case "type":
				return (
					a[key]
						?.toLocaleLowerCase()
						.localeCompare(b[key]?.toLocaleLowerCase()) ?? 0
				);
			case "attribute": {
				const aComp =
					a.type === "rawMaterial" ? a.system.quantity : a.system.bonus.value;
				const bComp =
					b.type === "rawMaterial" ? b.system.quantity : b.system.bonus.value;
				return Number(bComp) - Number(aComp);
			}
			case "weight": {
				const weightMap = CONFIG.fbl.encumbrance;
				const aWeight =
					a.type === "rawMaterial"
						? Number(a.system.quantity)
						: Math.floor(weightMap[a.system.weight] || 0);
				const bWeight =
					b.type === "rawMaterial"
						? Number(b.system.quantity)
						: Math.floor(weightMap[b.system.weight] || 0);
				return bWeight - aWeight;
			}
		}
		/* eslint-enable no-case-declarations, no-nested-ternary */
	}

	#filterGear(items) {
		const filteredItems = items
			?.filter(({ type }) => CONFIG.fbl.carriedItemTypes.includes(type))
			.map((item) => ({ ...item, state: item.flags?.state || "none" }));
		const reduced = filteredItems.reduce((acc, item) => {
			const { state } = item;
			if (!acc[state]) acc[state] = [];
			acc[state].push(item);
			return acc;
		}, {});
		return Object.fromEntries(
			Object.entries(reduced).map(([key, arr]) => [
				key,
				arr.sort((a, b) => this.#sortGear(a, b, this.#getSortKey(key))),
			]),
		);
	}

	#onItemCreate(event) {
		const itemType = $(event.currentTarget).data("type");
		const label = CONFIG.fbl.i18n[itemType];
		this.actor.createEmbeddedDocuments(
			"Item",
			{
				name: `${game.i18n.localize(label)}`,
				type: itemType,
			},
			{ renderSheet: true },
		);
	}

	async #onCreateDialog(event) {
		event.preventDefault();
		const state = $(event.target).closest("[data-state]")?.data("state");
		Hooks.once("renderDialog", (_, html) =>
			html
				.find("option")
				.filter((_i, el) =>
					[
						"criticalInjury",
						"building",
						"hireling",
						"monsterAttack",
						"monsterTalent",
						"spell",
						"talent",
					].includes(el.value),
				)
				.remove(),
		);
		const item = await Item.createDialog({}, { parent: this.actor });
		if (item)
			item.setFlag("forbidden-lands", "state", state === "none" ? "" : state);
	}
}
