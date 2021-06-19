export const migrateWorld = async () => {
	const schemaVersion = 5;
	const systemVersion = Number(
		game.system.data.version.split(".")[0], //Get the first whole integer in system version.
	);
	const trueWorldSchemaVersion = Number(game.settings.get("forbidden-lands", "worldSchemaVersion") || 0); //Moved to a separate variable due to this being an exposed setting that can be set to integer, float or string. This also sets 0 if it evaluates to NaN.
	const worldSchemaVersion = trueWorldSchemaVersion <= systemVersion ? trueWorldSchemaVersion : systemVersion; //Intention here is to prevent worldSchema from being larger than systemversion preventing a migration and potentially "corrupting" the World.
	if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
		ui.notifications.info("Upgrading the world, please wait...");
		for (let actor of game.actors.entities) {
			try {
				const update = migrateActorData(actor.data, worldSchemaVersion);
				if (!isObjectEmpty(update)) {
					await actor.update(update, { enforceTypes: false });
				}
			} catch (e) {
				ui.notifications.error("Migration of actors failed.");
			}
		}
		for (let item of game.items.entities) {
			try {
				const update = migrateItemData(item.data, worldSchemaVersion);
				if (!isObjectEmpty(update)) {
					await item.update(update, { enforceTypes: false });
				}
			} catch (e) {
				ui.notifications.error("Migration of items failed.");
			}
		}
		for (let scene of game.scenes.entities) {
			try {
				const update = migrateSceneData(scene.data, worldSchemaVersion);
				if (!isObjectEmpty(update)) {
					await scene.update(update, { enforceTypes: false });
				}
			} catch (e) {
				ui.notifications.error("Migration of scenes failed.");
			}
		}
		for (let pack of game.packs.filter(
			(p) => p.metadata.package === "world" && ["Actor", "Item", "Scene"].includes(p.metadata.entity),
		)) {
			await migrateCompendium(pack, worldSchemaVersion);
		}
		migrateSettings(worldSchemaVersion);
		game.settings.set("forbidden-lands", "worldSchemaVersion", schemaVersion);
		ui.notifications.info("Upgrade complete!");
	}
};

const migrateActorData = (actor, worldSchemaVersion) => {
	const update = {};
	if (worldSchemaVersion <= 2) {
		if (actor.type === "character") {
			if (!actor.data.condition.sleepy) {
				update["data.condition.sleepy"] = actor.data.condition.sleepless;
			}
		}
	}
	let itemsChanged = false;
	const items = actor.items.map((item) => {
		const itemUpdate = migrateItemData(item, worldSchemaVersion);
		if (!isObjectEmpty(itemUpdate)) {
			itemsChanged = true;
			return mergeObject(item, itemUpdate, {
				enforceTypes: false,
				inplace: false,
			});
		}
		return item;
	});
	if (itemsChanged) {
		update.items = items;
	}
	return update;
};

const migrateItemData = (item, worldSchemaVersion) => {
	const update = {};
	if (worldSchemaVersion <= 2) {
		if (item.type === "artifact") {
			update.type = "weapon";
		}
		if (item.type === "armor") {
			update["data.bonus"] = item.data.rating;
		} else {
			let baseBonus = 0;
			let artifactBonus = "";
			if (item.data.bonus) {
				const parts = item.data.bonus.split("+").map((p) => p.trim());
				parts.forEach((p) => {
					if (Number.isNumeric(p)) {
						baseBonus += +p;
					} else {
						if (artifactBonus.length) {
							artifactBonus = `${artifactBonus} + ${p}`;
						} else {
							artifactBonus = p;
						}
					}
				});
			}
			update["data.bonus"] = {
				value: baseBonus,
				max: baseBonus,
			};
			update["data.artifactBonus"] = artifactBonus;
		}
	}
	if (worldSchemaVersion <= 3) {
		if (item.type === "spell" && !item.data.spellType) {
			update["data.spellType"] = "SPELL.SPELL";
		}
	}
	if (worldSchemaVersion <= 4) {
		if (item.type === "weapon" && typeof item.data.features === "string") {
			// Change features from string to object
			const features = item.data.features
				.replace(".", "")
				.replace(/loading is a slow action/i, "slowReload")
				.replace(/slow reload/i, "slowReload")
				.split(", ");
			update["data.features"] = {
				edged: false,
				pointed: false,
				blunt: false,
				parrying: false,
				hook: false,
				slowReload: false,
				others: "",
			};
			let otherFeatures = "";
			for (const feature of features) {
				const lcFeature = feature === "slowReload" ? feature : feature.toLowerCase();
				if (lcFeature in update["data.features"]) {
					update["data.features"][lcFeature] = true;
				} else {
					otherFeatures += feature + ", ";
				}
			}
			update["data.features"].others = otherFeatures.substr(0, otherFeatures.length - 2);
		}
	}
	if (!isObjectEmpty(update)) {
		update.id = item.id;
	}
	return update;
};

const migrateSceneData = (scene, worldSchemaVersion) => {
	const tokens = duplicate(scene.tokens);
	return {
		tokens: tokens.map((tokenData) => {
			if (!tokenData.actorId || tokenData.actorLink || !tokenData.actorData.data) {
				tokenData.actorData = {};
				return tokenData;
			}
			const token = new Token(tokenData);
			if (!token.actor) {
				tokenData.actorId = null;
				tokenData.actorData = {};
			} else if (!tokenData.actorLink && token.data.actorData.items) {
				const update = migrateActorData(token.data.actorData, worldSchemaVersion);
				console.log("ACTOR CHANGED", token.data.actorData, update);
				tokenData.actorData = mergeObject(token.data.actorData, update);
			}
			return tokenData;
		}),
	};
};

export const migrateCompendium = async function (pack, worldSchemaVersion) {
	const entity = pack.metadata.entity;

	await pack.migrate();
	const content = await pack.getContent();

	for (let ent of content) {
		let updateData = {};
		if (entity === "Item") {
			updateData = migrateItemData(ent.data, worldSchemaVersion);
		} else if (entity === "Actor") {
			updateData = migrateActorData(ent.data, worldSchemaVersion);
		} else if (entity === "Scene") {
			updateData = migrateSceneData(ent.data, worldSchemaVersion);
		}
		if (!isObjectEmpty(updateData)) {
			expandObject(updateData);
			updateData.id = ent.id;
			await pack.updateEntity(updateData);
		}
	}
};

const migrateSettings = async function (worldSchemaVersion) {
	if (worldSchemaVersion <= 3) {
		game.settings.set("forbidden-lands", "showCraftingFields", true);
		game.settings.set("forbidden-lands", "showCostField", true);
		game.settings.set("forbidden-lands", "showSupplyField", true);
		game.settings.set("forbidden-lands", "showEffectField", true);
		game.settings.set("forbidden-lands", "showDescriptionField", true);
		game.settings.set("forbidden-lands", "showDrawbackField", true);
		game.settings.set("forbidden-lands", "showAppearanceField", true);
	}
	if (worldSchemaVersion <= 4) {
		game.settings.set("forbidden-lands", "alternativeSkulls", false);
	}
};
