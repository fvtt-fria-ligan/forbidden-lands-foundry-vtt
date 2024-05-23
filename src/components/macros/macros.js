import localizeString from "@utils/localize-string.js";

const handlers = {
	Actor: handleActorMacro,
	Item: handleItemMacro,
};

const itemHandlers = {
	spell: handleSpellMacro,
	weapon: handleWeaponMacro,
	armor: handleWeaponMacro,
};

function handleSpellMacro(actor, item) {
	return {
		command: `game.actors.get("${actor.id}").sheet.rollSpell("${item._id}")`,
		img: item.img,
		name: item.name,
		type: "script",
	};
}

async function handleWeaponMacro(actor, item) {
	const type =
		/* eslint-disable no-nested-ternary */
		item.system.part === "shield" || item.system.category === "melee"
			? await Dialog.prompt({
					title: game.i18n.localize("MACRO.CHOOSE_TYPE"),
					content: `
						<form class="macro-select">
						<h3>${game.i18n.localize("MACRO.CHOOSE_TYPE")}</h3>
							<label>
							<input type="radio" name="type" value="gear" checked />
							${game.i18n.localize("MACRO.TYPE.ATTACK")}</label>
							<label>
							<input type="radio" name="type" value="parry" />
							${game.i18n.localize("ACTION.PARRY")}</label>
							${
								item.system.part === "shield"
									? `<label>
							<input type="radio" name="type" value="shove" />
							${game.i18n.localize("ACTION.SHOVE")}</label>`
									: ""
							}
							${
								item.system.category === "melee"
									? `<label>
							<input type="radio" name="type" value="disarm" />
							${game.i18n.localize("ACTION.DISARM")}</label>`
									: ""
							}
						</form>
					`,
					callback: (html) => {
						const form = html.find("form")[0];
						const data = new FormData(form);
						return data.get("type");
					},
					rejectClose: true,
				})
			: item.type === "armor"
				? "armor"
				: "gear";
	const command =
		type === "gear"
			? `game.actors.get("${actor.id}").sheet.rollGear("${item._id}")`
			: type === "armor"
				? `game.actors.get("${actor.id}").sheet.rollSpecificArmor("${item._id}")`
				: `game.actors.get("${actor.id}").sheet.rollAction("${type}","${item._id}")`;
	/* eslint-enable no-nested-ternary */
	// eslint-disable-next-line no-shadow
	const name =
		type === "gear" ? item.name : `${item.name}: ${localizeString(type)}`;
	return {
		command,
		name,
		img: item.img,
		type: "script",
	};
}

async function handleActorMacro(data) {
	const actor = game.actors.get(data.id);
	const imgs = await actor.getTokenImages();
	return {
		command: `game.actors.get("${data.id}").sheet.render(true)`,
		img: imgs[0],
		name: actor.name,
		type: "script",
	};
}

async function handleItemMacro(data) {
	const handler = itemHandlers[data.system.type];
	if (!handler) return {};
	const actor = game.actors.get(data.actorId);
	const item = data.data;
	return handler(actor, item);
}

export async function handleHotbarDrop(data, slot) {
	const handler = handlers[data.type];
	if (!handler) return;
	// eslint-disable-next-line no-shadow
	const { command, img, name, type } = await handler(data);
	if (!name || !command) return;
	let macro = game.macros.contents.find(
		(m) => m.name === name && m.command === command,
	);
	if (!macro) {
		macro = await Macro.create({
			command,
			img,
			name,
			type,
		});
	}
	game.user.assignHotbarMacro(macro, slot);
}

export async function importMacros() {
	if (game.packs.get("world.forbidden-lands-macros")) return;
	const pack = await CompendiumCollection.createCompendium({
		name: "forbidden-lands-macros",
		label: game.i18n.localize("MACRO.COMPENDIUM_NAME"),
		type: "Macro",
		system: "forbidden-lands",
	});
	const macros = await foundry.utils.fetchJsonWithTimeout(
		"/systems/forbidden-lands/assets/datasets/macros/macros.json",
	);
	const localizedMacros = macros.map((m) => ({
		...m,
		name: game.i18n.localize(m.name),
	}));
	Macro.create(localizedMacros, { pack: pack.collection });
}
