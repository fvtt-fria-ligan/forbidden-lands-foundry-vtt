import localizeString from "@utils/localize-string.js";

function preloadHandlebarsTemplates() {
	// eslint-disable-next-line no-undef
	const templatePaths = GLOBALPATHS;
	return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
	Handlebars.registerHelper("skulls", function (current, max, block) {
		let acc = "";
		for (let i = 0; i < max; ++i) {
			block.data.index = i;
			block.data.damaged = i >= current;
			acc += block.fn(this);
		}
		return acc;
	});
	Handlebars.registerHelper("flps_enrich", (content) => {
		// Enrich the content
		content = TextEditor.enrichHTML(content, { documents: true, async: false });
		return new Handlebars.SafeString(content);
	});
	Handlebars.registerHelper("flps_capitalize", (value) =>
		typeof value === "string" && value.length > 0
			? value[0].toUpperCase() + value.slice(1)
			: value,
	);
	Handlebars.registerHelper("flps_strconcat", (...args) => {
		args.pop();
		return args.join("");
	});

	Handlebars.registerHelper("damageType", (type) => {
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
	Handlebars.registerHelper("armorPart", (part) => {
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
	Handlebars.registerHelper("itemWeight", (weight) => {
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
	Handlebars.registerHelper("weaponCategory", (category) => {
		category = normalize(category, "melee");
		switch (category) {
			case "melee":
				return game.i18n.localize("WEAPON.MELEE");
			case "ranged":
				return game.i18n.localize("WEAPON.RANGED");
		}
	});
	Handlebars.registerHelper("weaponGrip", (grip) => {
		grip = normalize(grip, "1h");
		switch (grip) {
			case "1h":
				return game.i18n.localize("WEAPON.1H");
			case "2h":
				return game.i18n.localize("WEAPON.2H");
		}
	});
	Handlebars.registerHelper("weaponRange", (range) => {
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
	Handlebars.registerHelper("talentType", (type) => {
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
	Handlebars.registerHelper("isBroken", (item) => {
		if (
			parseInt(item.system.bonus.max, 10) > 0 &&
			parseInt(item.system.bonus.value, 10) === 0
		)
			return "broken";
		return "";
	});
	Handlebars.registerHelper("formatRollModifiers", (rollModifiers) => {
		const output = [];
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.values(rollModifiers)
			.filter((mod) => !mod.gearBonus)
			.forEach((mod) => {
				const modName = game.i18n.localize(mod.name);
				output.push(`${modName} ${mod.value}`);
			});
		return output.join(", ");
	});

	Handlebars.registerHelper("hasWeaponFeatures", (weaponType, features) => {
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

	Handlebars.registerHelper("formatWeaponFeatures", (weaponType, features) => {
		const output = [];
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

	Handlebars.registerHelper("plaintextToHTML", (value) => {
		// strip tags, add <br/> tags
		return new Handlebars.SafeString(
			value.replace(/(<([^>]+)>)/gi, "").replace(/(?:\r\n|\r|\n)/g, "<br/>"),
		);
	});

	Handlebars.registerHelper("toUpperCase", (str) => str.toUpperCase());

	Handlebars.registerHelper("eq", (...args) => {
		args.pop();
		return args.every((expression) => args[0] === expression);
	});

	Handlebars.registerHelper("or", (...args) => {
		args.pop();
		return args.reduce((x, y) => x || y);
	});

	Handlebars.registerHelper("and", (...args) => {
		args.pop();
		return args.reduce((x, y) => x && y);
	});

	Handlebars.registerHelper("chargenLoc", (item) => {
		let localizedString = CONFIG.fbl.i18n[item];
		if (!localizedString) {
			const SKILL_NAME = item.toUpperCase().replace(/[\s-]/g, "_");
			localizedString = `SKILL.${SKILL_NAME}`;
		}
		return localizedString;
	});

	Handlebars.registerHelper("getType", (item) => typeof (Number(item) || item));

	Handlebars.registerHelper("randomize", (items) => {
		return items[Math.floor(Math.random() * items.length)];
	});

	Handlebars.registerHelper("fblLocalize", (...args) => {
		args.pop();
		return localizeString(args.join("."));
	});

	Handlebars.registerHelper("ternary", (conditional, string1, string2) =>
		conditional ? string1 : string2,
	);
	Handlebars.registerHelper("count", (array = []) => {
		if (!Array.isArray(array)) return 0;
		return array.length;
	});
}

function normalize(data, defaultValue) {
	if (data) return data.toLowerCase();
	return defaultValue;
}

export const initializeHandlebars = () => {
	registerHandlebarsHelpers();
	preloadHandlebarsTemplates();
};
