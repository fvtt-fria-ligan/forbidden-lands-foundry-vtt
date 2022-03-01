function preloadHandlebarsTemplates() {
	const templatePaths = [
		"systems/forbidden-lands/templates/actor/character/character-limited-sheet.hbs",
		"systems/forbidden-lands/templates/actor/character/character-sheet.hbs",
		"systems/forbidden-lands/templates/actor/character/npc-sheet.hbs",
		"systems/forbidden-lands/templates/actor/character/sheet-tabs/bio-tab.hbs",
		"systems/forbidden-lands/templates/actor/character/sheet-tabs/combat-tab.hbs",
		"systems/forbidden-lands/templates/actor/character/sheet-tabs/gear-tab.hbs",
		"systems/forbidden-lands/templates/actor/character/sheet-tabs/main-tab.hbs",
		"systems/forbidden-lands/templates/actor/character/sheet-tabs/talent-tab.hbs",
		"systems/forbidden-lands/templates/actor/monster/monster-sheet.hbs",
		"systems/forbidden-lands/templates/actor/monster/sheet-tabs/combat-tab.hbs",
		"systems/forbidden-lands/templates/actor/monster/sheet-tabs/gear-tab.hbs",
		"systems/forbidden-lands/templates/actor/party/party-sheet.hbs",
		"systems/forbidden-lands/templates/actor/party/components/action-component.hbs",
		"systems/forbidden-lands/templates/actor/party/components/member-component.hbs",
		"systems/forbidden-lands/templates/actor/party/sheet-tabs/main-tab.hbs",
		"systems/forbidden-lands/templates/actor/party/sheet-tabs/travel-tab.hbs",
		"systems/forbidden-lands/templates/actor/stronghold/stronghold-sheet.hbs",
		"systems/forbidden-lands/templates/actor/stronghold/sheet-tabs/building-tab.hbs",
		"systems/forbidden-lands/templates/actor/stronghold/sheet-tabs/gear-tab.hbs",
		"systems/forbidden-lands/templates/actor/stronghold/sheet-tabs/hireling-tab.hbs",
		"systems/forbidden-lands/templates/components/item-chatcard.hbs",
		"systems/forbidden-lands/templates/components/modifiers-component.hbs",
		"systems/forbidden-lands/templates/components/sheet-config-modal.hbs",
		"systems/forbidden-lands/templates/components/character-generator/generator-sheet.hbs",
		"systems/forbidden-lands/templates/components/character-generator/list-component.hbs",
		"systems/forbidden-lands/templates/components/roll-engine/dialog.hbs",
		"systems/forbidden-lands/templates/components/roll-engine/infos.hbs",
		"systems/forbidden-lands/templates/components/roll-engine/roll.hbs",
		"systems/forbidden-lands/templates/components/roll-engine/spell-dialog.hbs",
		"systems/forbidden-lands/templates/components/roll-engine/tooltip.hbs",
		"systems/forbidden-lands/templates/item/_shared-template-tabs/artifact-tab.hbs",
		"systems/forbidden-lands/templates/item/_shared-template-tabs/supply-tab.hbs",
		"systems/forbidden-lands/templates/item/armor/armor-sheet.hbs",
		"systems/forbidden-lands/templates/item/armor/main-tab.hbs",
		"systems/forbidden-lands/templates/item/building/building-sheet.hbs",
		"systems/forbidden-lands/templates/item/critical-injury/critical-injury-sheet.hbs",
		"systems/forbidden-lands/templates/item/gear/gear-sheet.hbs",
		"systems/forbidden-lands/templates/item/gear/main-tab.hbs",
		"systems/forbidden-lands/templates/item/hireling/hireling-sheet.hbs",
		"systems/forbidden-lands/templates/item/monster-attack/monster-attack-sheet.hbs",
		"systems/forbidden-lands/templates/item/raw-material/raw-material-sheet.hbs",
		"systems/forbidden-lands/templates/item/spell/spell-sheet.hbs",
		"systems/forbidden-lands/templates/item/talent/talent-sheet.hbs",
		"systems/forbidden-lands/templates/item/weapon/main-tab.hbs",
		"systems/forbidden-lands/templates/item/weapon/weapon-sheet.hbs",
		"systems/forbidden-lands/templates/journal/adventure-sites/adventure-site-sheet.hbs",
		"systems/forbidden-lands/templates/system/core/combat.hbs",
	];
	return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
	Handlebars.registerHelper("skulls", function (current, max, block) {
		var acc = "";
		for (var i = 0; i < max; ++i) {
			block.data.index = i;
			block.data.damaged = i >= current;
			acc += block.fn(this);
		}
		return acc;
	});
	Handlebars.registerHelper("flps_enrich", function (content) {
		// Enrich the content
		content = TextEditor.enrichHTML(content, { documents: true });
		return new Handlebars.SafeString(content);
	});
	Handlebars.registerHelper("flps_capitalize", function (value) {
		return typeof value === "string" && value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value;
	});
	Handlebars.registerHelper("flps_strconcat", function () {
		const args = Array.prototype.slice.call(arguments);
		args.pop(); // remove unrelated data
		return args.join("");
	});

	Handlebars.registerHelper("damageType", function (type) {
		type = normalize(type, "blunt");
		switch (type) {
			case "blunt":
				return game.i18n.localize("ATTACK.BLUNT");
			case "fear":
				return game.i18n.localize("ATTACK.FEAR");
			case "slash":
				return game.i18n.localize("ATTACK.SLASH");
			case "stab":
				return game.i18n.localize("ATTACK.STAB");
			case "other":
				return game.i18n.localize("ATTACK.OTHER");
		}
	});
	Handlebars.registerHelper("armorPart", function (part) {
		part = normalize(part, "body");
		switch (part) {
			case "body":
				return game.i18n.localize("ARMOR.BODY");
			case "head":
				return game.i18n.localize("ARMOR.HELMET");
			case "shield":
				return game.i18n.localize("ARMOR.SHIELD");
		}
	});
	Handlebars.registerHelper("itemWeight", function (weight) {
		const weightLowerCase = normalize(weight, "regular");
		switch (weightLowerCase) {
			case "none":
				return game.i18n.localize("WEIGHT.NONE");
			case "tiny":
				return game.i18n.localize("WEIGHT.TINY");
			case "light":
				return game.i18n.localize("WEIGHT.LIGHT");
			case "regular":
				return game.i18n.localize("WEIGHT.REGULAR");
			case "heavy":
				return game.i18n.localize("WEIGHT.HEAVY");
			default:
				return weight;
		}
	});
	Handlebars.registerHelper("weaponCategory", function (category) {
		category = normalize(category, "melee");
		switch (category) {
			case "melee":
				return game.i18n.localize("WEAPON.MELEE");
			case "ranged":
				return game.i18n.localize("WEAPON.RANGED");
		}
	});
	Handlebars.registerHelper("weaponGrip", function (grip) {
		grip = normalize(grip, "1h");
		switch (grip) {
			case "1h":
				return game.i18n.localize("WEAPON.1H");
			case "2h":
				return game.i18n.localize("WEAPON.2H");
		}
	});
	Handlebars.registerHelper("weaponRange", function (range) {
		range = normalize(range, "arm");
		switch (range) {
			case "arm":
				return game.i18n.localize("RANGE.ARM");
			case "near":
				return game.i18n.localize("RANGE.NEAR");
			case "short":
				return game.i18n.localize("RANGE.SHORT");
			case "long":
				return game.i18n.localize("RANGE.LONG");
			case "distant":
				return game.i18n.localize("RANGE.DISTANT");
		}
	});
	Handlebars.registerHelper("talentType", function (type) {
		type = normalize(type, "general");
		switch (type) {
			case "general":
				return game.i18n.localize("TALENT.GENERAL");
			case "kin":
				return game.i18n.localize("TALENT.KIN");
			case "profession":
				return game.i18n.localize("TALENT.PROFESSION");
		}
	});
	Handlebars.registerHelper("isBroken", function (item) {
		if (parseInt(item.data.bonus.max, 10) > 0 && parseInt(item.data.bonus.value, 10) === 0) {
			return "broken";
		} else {
			return "";
		}
	});
	Handlebars.registerHelper("formatRollModifiers", function (rollModifiers) {
		let output = [];
		Object.values(rollModifiers).forEach((mod) => {
			let modName = game.i18n.localize(mod.name);
			output.push(`${modName} ${mod.value}`);
		});
		return output.join(", ");
	});

	Handlebars.registerHelper("hasWeaponFeatures", function (weaponType, features) {
		const meleeFeatures = ["edged", "pointed", "blunt", "parry", "hook"];
		const rangedFeatures = ["slowReload"];

		if (features.others !== "") {
			return true;
		}

		let weaponFeatures = [];
		if (weaponType === "melee") {
			weaponFeatures = meleeFeatures;
		} else if (weaponType === "ranged") {
			weaponFeatures = rangedFeatures;
		}

		for (const feature in features) {
			if (weaponFeatures.includes(feature) && features[feature]) {
				return true;
			}
		}
		return false;
	});

	Handlebars.registerHelper("formatWeaponFeatures", function (weaponType, features) {
		let output = [];
		if (weaponType === "melee") {
			if (features.edged) {
				output.push(game.i18n.localize("WEAPON.FEATURES.EDGED"));
			}
			if (features.pointed) {
				output.push(game.i18n.localize("WEAPON.FEATURES.POINTED"));
			}
			if (features.blunt) {
				output.push(game.i18n.localize("WEAPON.FEATURES.BLUNT"));
			}
			if (features.parrying) {
				output.push(game.i18n.localize("WEAPON.FEATURES.PARRYING"));
			}
			if (features.hook) {
				output.push(game.i18n.localize("WEAPON.FEATURES.HOOK"));
			}
		} else if (weaponType === "ranged") {
			if (features.slowReload) {
				output.push(game.i18n.localize("WEAPON.FEATURES.SLOW_RELOAD"));
			}
		} else if (features.others) {
			output.push(features.others);
		} else if (features) {
			output.push(features);
		}
		return output.join(", ");
	});

	Handlebars.registerHelper("plaintextToHTML", function (value) {
		// strip tags, add <br/> tags
		return new Handlebars.SafeString(value.replace(/(<([^>]+)>)/gi, "").replace(/(?:\r\n|\r|\n)/g, "<br/>"));
	});

	Handlebars.registerHelper("toUpperCase", function (str) {
		return str.toUpperCase();
	});

	Handlebars.registerHelper("eq", function () {
		const args = Array.prototype.slice.call(arguments, 0, -1);
		return args.every(function (expression) {
			return args[0] === expression;
		});
	});

	Handlebars.registerHelper("or", function () {
		const args = Array.prototype.slice.call(arguments, 0, -1);
		return args.reduce((x, y) => x || y);
	});

	Handlebars.registerHelper("and", function () {
		const args = Array.prototype.slice.call(arguments, 0, -1);
		return args.reduce((x, y) => x && y);
	});

	Handlebars.registerHelper("isMonsterTypeMount", function (type) {
		return type === "mount";
	});

	Handlebars.registerHelper("chargenLoc", function (item) {
		let localizedString = CONFIG.fbl.i18n[item];
		if (!localizedString) {
			const SKILL_NAME = item.toUpperCase().replace(/[\s-]/g, "_");
			localizedString = `SKILL.${SKILL_NAME}`;
		}
		return localizedString;
	});

	Handlebars.registerHelper("getType", function (item) {
		return typeof (Number(item) || item);
	});

	Handlebars.registerHelper("randomize", (items) => {
		return items[Math.floor(Math.random() * items.length)];
	});
}

function normalize(data, defaultValue) {
	if (data) {
		return data.toLowerCase();
	} else {
		return defaultValue;
	}
}

export const initializeHandlebars = () => {
	registerHandlebarsHelpers();
	preloadHandlebarsTemplates();
};
