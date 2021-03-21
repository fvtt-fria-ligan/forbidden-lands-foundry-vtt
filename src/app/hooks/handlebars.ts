function preloadHandlebarsTemplates() {
	const templatePaths = [
		"systems/forbidden-lands/template/chat/item.hbs",
		"systems/forbidden-lands/template/chat/roll.hbs",
		"systems/forbidden-lands/template/chat/consumable.hbs",
		"systems/forbidden-lands/template/character.hbs",
		"systems/forbidden-lands/template/monster.hbs",
		"systems/forbidden-lands/template/weapon.hbs",
		"systems/forbidden-lands/template/armor.hbs",
		"systems/forbidden-lands/template/monster-talent.hbs",
		"systems/forbidden-lands/template/monster-attack.hbs",
		"systems/forbidden-lands/template/gear.hbs",
		"systems/forbidden-lands/template/raw-material.hbs",
		"systems/forbidden-lands/template/talent.hbs",
		"systems/forbidden-lands/template/critical-injury.hbs",
		"systems/forbidden-lands/template/tab/main.hbs",
		"systems/forbidden-lands/template/tab/combat.hbs",
		"systems/forbidden-lands/template/tab/combat-monster.hbs",
		"systems/forbidden-lands/template/tab/talent.hbs",
		"systems/forbidden-lands/template/tab/gear-character.hbs",
		"systems/forbidden-lands/template/tab/gear-monster.hbs",
		"systems/forbidden-lands/template/tab/bio.hbs",
		"systems/forbidden-lands/template/tab/building-stronghold.hbs",
		"systems/forbidden-lands/template/tab/hireling-stronghold.hbs",
		"systems/forbidden-lands/template/tab/gear-stronghold.hbs",
		"systems/forbidden-lands/template/partial/roll-modifiers.hbs",
		"systems/forbidden-lands/template/tab/gear/gear-artifact.hbs",
		"systems/forbidden-lands/template/tab/gear/gear-supply.hbs",
		"systems/forbidden-lands/template/tab/gear/armor-main.hbs",
		"systems/forbidden-lands/template/tab/gear/gear-main.hbs",
		"systems/forbidden-lands/template/tab/gear/weapon-main.hbs",
	];
	return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
	Handlebars.registerHelper("skulls", function (this: any, current: number, max: number, block) {
		var acc = "";
		for (var i = 0; i < max; ++i) {
			block.data.index = i;
			block.data.damaged = i >= current;
			acc += block.fn(this);
		}
		return acc;
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
		weight = normalize(weight, "regular");
		switch (weight) {
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
		Object.values(rollModifiers).forEach((mod: any) => {
			let name = game.i18n.localize(mod.name);
			output.push(`${name} ${mod.value}`);
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
		if (weaponType == "melee") {
			weaponFeatures = meleeFeatures;
		} else if (weaponType == "ranged") {
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
		}
		if (weaponType === "ranged") {
			if (features.slowReload) {
				output.push(game.i18n.localize("WEAPON.FEATURES.SLOW_RELOAD"));
			}
		}
		if (features.others !== "") {
			output.push(features.others);
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
	Handlebars.registerHelper("isMonsterTypeMount", function (type) {
		return type === "mount";
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
