import t from "$utils/localize-string";

let ALL_TABLES = {};

// Utilities
const getTables = async (path, fileName) => {
	fileName = fileName.replace("_rooms", "");
	const tables = await fetch(`modules/${path}/manifests/${fileName}.json`)
		.then((res) => res.json())
		.catch((err) => {
			ui.notifications.error("Error fetching tables.");
			throw new Error(`Error fetching tables: ${err}`);
		});
	return tables;
};

const getNumber = (string) => {
	switch (true) {
		case /one/i.test(string):
			return 1;
		case /two/i.test(string):
			return 2;
		case /three/i.test(string):
			return 3;
		case /four/i.test(string):
			return 4;
		case /five/i.test(string):
			return 5;
		default:
			return 0;
	}
};

const cheapRoll = (roll) => {
	let [dice, sides, modifier] = roll.split(/d|\+/i);
	dice = Number.parseInt(dice) || 1;
	sides = Number.parseInt(sides) || 6;
	modifier = modifier ? Number.parseInt(modifier) : 0;
	let result = 0;
	for (let i = 0; i <= dice; i++) {
		result += Math.floor(Math.random() * sides) + 1;
	}
	return result + modifier;
};

const inlineRolls = (text) => {
	const regex = /\[\[(.*?)\]\]/g;
	return text.replace(regex, (_, match) => {
		return cheapRoll(match);
	});
};

const parseReRolls = (result) => {
	for (const value of Object.values(result)) {
		if (typeof value === "string") {
			const parsedResults = value.split(":");
			if (parsedResults[0] === "reroll") {
				return Number.parseInt(parsedResults[1]);
			}
		}
	}
	return 0;
};

const parseStrings = (result) => {
	return Object.entries(result).reduce((obj, [key, value]) => {
		if (typeof value === "string") {
			const randomizedString = (string) => {
				const array = string
					.split("|")
					.map((entry) => entry.split(":"))
					.reduce((arr, [num, entry]) => {
						for (let i = 0; i < num; i++) {
							arr.push(entry);
						}
						return arr;
					}, []);
				return array[Math.floor(Math.random() * array.length)];
			};
			obj[key] = value.replace(/\{\{(.*?)\}\}/g, (_, p1) =>
				randomizedString(p1),
			);
		} else obj[key] = value;
		return obj;
	}, {});
};

const parseRollStrings = (results) => {
	const parsedResults = results.split(":");
	if (parsedResults.length === 3)
		return rollOnTable(
			ALL_TABLES[parsedResults[2]],
			fns("all_results"),
			Number.parseInt(parsedResults[1]),
		);
	return [];
};

// Result transformers applied based on the type of result
const fns = (type) => {
	const types = {
		all_results: (results) => results.map((result) => parseStrings(result)),
		some_results: (results, variable = "None") =>
			results.filter(
				(result) =>
					!Object.values(result).some(
						(value) => typeof value === "string" && value.match(variable),
					),
			),
		hybrid: (results) => {
			// The more results the higher the chance we go for unique columns
			if (Math.random() < 1 / results.length) return [results[0]];

			const newResult = results.reduce((obj, cur, i) => {
				cur = Object.entries(cur);
				obj[cur[i][0]] = cur[i][1];
				return obj;
			}, {});
			return [newResult];
		},
		inn_name_string: (results) => {
			if (Math.random() > 0.5)
				return [
					{
						the_name_of_the_inn: `The ${results[0].first_word} ${results[1].second_word}`,
					},
				];

			return [
				{
					the_name_of_the_inn: `The ${results[0].second_word} & ${results[0].second_word}`,
				},
			];
		},
	};
	return types[type] ?? types.all_results;
};

// Rolls on all tables pertaining to a given adventure site
const getRolledData = (adventureSite) => {
	const tablesToRoll = CONFIG.fbl.adventureSites.tables[adventureSite];
	const results = {};
	for (const { name: tableName, type, roll } of tablesToRoll) {
		const rollCount = roll ?? 1;
		const table = ALL_TABLES[tableName];
		const result = rollOnTable(table, fns(type), rollCount);
		results[tableName] = result;
		if (ALL_TABLES[`${tableName}_description`]) {
			results[`${tableName}_description`] =
				ALL_TABLES[`${tableName}_description`];
		}
	}
	return results;
};

// Rolls on a table and returns the results
const rollOnTable = (table, fn, count = 1, modifier = 0) => {
	const results = [];
	// Loop over the number of times we want to roll
	for (let i = 0; i < count; i++) {
		let resultCount = 0;
		const dieRoll = Math.floor(
			Math.random() * table.reduce((acc, cur) => acc + cur.weight, 0) +
				modifier +
				1,
		);
		// Loop over the table until we find the rolled result, accounting for the weight of each result
		for (const result of table) {
			resultCount += result.weight;
			if (dieRoll <= resultCount) {
				// Look for rerolls in each result
				const rerolls = parseReRolls(result);
				// If there are rerolls, roll again
				count += rerolls;
				if (rerolls === 0) results.push(result);
				break;
			}
		}
	}
	return fn(results, table);
};

// Transforms the results to suite a given adventure site
const moldData = (data, type) => {
	const types = CONFIG.fbl.adventureSites?.transformers;
	const typeFn = types?.[type] ?? ((d, _) => d);
	return typeFn(data, ALL_TABLES);
};

export const adventureSiteCreateDialog = async () => {
	const titleCase = (string) => {
		const i18nKey = `ADVENTURE_SITE.TYPE.${string.toUpperCase()}`;
		const translated = t(i18nKey);

		// if translation key is found...
		if (translated !== i18nKey) return translated;
		// else replace underscores and capitalize string
		return string
			.replace(/_/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	const types = Object.entries(CONFIG.fbl.adventureSites.types);

	let type;
	try {
		type = await Dialog.wait({
			title: t("ADVENTURE_SITE.CREATE_TITLE"),
			content: `<form style="margin-block:12px;">
				<p>${t("ADVENTURE_SITE.CREATE_DESCRIPTION")}</p>
				<div class="form-group">
					<div class="form-fields">
						<label>${t("Type")}</label>
						<select name="type">
							${types
								.map(([key, value]) => {
									return `<option value="${value}:${key}">${titleCase(key)}</option>`;
								})
								.join("")}
						</select>
					</div>
				</div>
			</form>`,
			buttons: {
				ok: {
					icon: '<i class="fas fa-check"></i>',
					label: t("Create"),
					callback: (jqhtml) => jqhtml.find("form")[0].type.value,
				},
			},
		});
	} catch (err) {
		// User closed the dialog without confirming
		console.warn("Adventure Site creation dialog was cancelled.");
		return;
	}

	const [path, adventureSite] = type.split(":");

	const content = await CONFIG.fbl.adventureSites.generate(
		path,
		adventureSite,
	);
	const title = titleCase(adventureSite);

	const entry = await JournalEntry.create({
		name: `${t("ADVENTURE_SITE.LABEL")}: ${title}`,
		pages: [
			{
				name: title,
				text: { content: `<div class="adventure-site">${content}</div>` },
				title: { show: false },
			},
		],
		flags: {
			"forbidden-lands": {
				adventureSiteType: adventureSite,
			},
		},
	});
	entry.sheet.render(true);
};

// Initialize random generation
export const init = async (path, adventureSite) => {
	const registeredSites = Object.keys(CONFIG.fbl.adventureSites.types);
	if (!registeredSites.includes(adventureSite.replace("_rooms", ""))) return "";
	ALL_TABLES = await getTables(path, adventureSite);
	// initiate final data object with rolled data
	let data = getRolledData(adventureSite);
	data = moldData(data, adventureSite);
	// construct the html
	const html = await foundry.applications.handlebars.renderTemplate(
		`modules/${path}/templates/${adventureSite}.hbs`,
		data,
	);
	const content = inlineRolls(html);
	return content;
};

export const utilities = {
	inlineRolls,
	parseRollStrings,
	parseStrings,
	parseReRolls,
	rollOnTable,
	getRolledData,
	getNumber,
	cheapRoll,
	fns,
};
