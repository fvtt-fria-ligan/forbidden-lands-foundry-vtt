export const migrateWorld = async () => {
	let systemVersion;
	let worldSchemaVersion;
	try {
		systemVersion = Number(
			game.system.version.split(".")[0], //Get Major release version
		);
		// In older instances of the system the worldSchemaVersion was user-changeable. We therefore need to make sure we get a number.
		worldSchemaVersion = Number(
			game.settings.get("forbidden-lands", "worldSchemaVersion") || 0,
		);
	} catch (error) {
		ui.notifications.error(
			"Failed getting version numbers. Backup your files and contact support.",
		);
		throw new Error(`Failed getting version numbers: ${error}`);
	}
	if (worldSchemaVersion < systemVersion && game.user.isGM) {
		ui.notifications.info("Upgrading the world, please wait...");
		for (const actor of game.actors) {
			try {
				const update = migrateActorData(actor.toObject(), worldSchemaVersion);
				if (!foundry.utils.isEmpty(update)) {
					const updated = await actor.update(update, { enforceTypes: false });
					console.log(`Migrated Actor entity ${actor.name}`, updated);
				}
			} catch (e) {
				ui.notifications.error("Migration of actors failed.");
				console.error(e);
			}
		}
		for (const item of game.items) {
			try {
				const update = migrateItemData(item.toObject(), worldSchemaVersion);
				if (!foundry.utils.isEmpty(update)) {
					const updated = await item.update(update, { enforceTypes: false });
					console.log(`Migrated Item entity ${item.name}`, updated);
				}
			} catch (e) {
				ui.notifications.error("Migration of items failed.");
			}
		}
		for (const scene of game.scenes) {
			try {
				const updateData = migrateSceneData(scene.data);
				if (!foundry.utils.isEmpty(updateData)) {
					console.log(`Migrating Scene entity ${scene.name}`);
					await scene.update(updateData, { enforceTypes: false });
					// If we do not do this, then synthetic token actors remain in cache
					// with the un-updated actorData.
					for (const token of scene.tokens) {
						token._actor = null;
					}
				}
			} catch (err) {
				err.message = `Failed migration for Scene ${scene.name}: ${err.message}`;
				console.error(err);
			}
		}
		for (const pack of game.packs.filter(
			(p) =>
				p.metadata.package === "world" &&
				["Actor", "Item", "Scene"].includes(p.metadata.type),
		)) {
			await migrateCompendium(pack, worldSchemaVersion);
		}
		migrateSettings(worldSchemaVersion);
		ui.notifications.info("Upgrade complete!");
	}
	game.settings.set("forbidden-lands", "worldSchemaVersion", systemVersion);
};

const migrateActorData = (actor, worldSchemaVersion) => {
	const update = {};

	// Sleepless -> Sleepy
	if (worldSchemaVersion < 3)
		if (actor.type === "character")
			if (!actor.system.condition.sleepy)
				update["system.condition.sleepy"] = actor.system.condition.sleepless;

	// Improve consumable values
	if (worldSchemaVersion < 7)
		if (actor.type === "character") {
			for (const [key, data] of Object.entries(actor.system.consumable)) {
				const map = {
					0: 0,
					6: 1,
					8: 2,
					10: 3,
					12: 4,
				};
				update[`system.consumable.${key}.value`] = map[data.value];
			}
		}

	// Migrate Owned Items
	if (!actor.items) return update;
	const items = actor.items.reduce((arr, i) => {
		// Migrate the Owned Item
		const itemData = i instanceof CONFIG.Item.documentClass ? i.toObject() : i;
		const itemUpdate = migrateItemData(itemData, worldSchemaVersion);

		// Update the Owned Item
		if (!foundry.utils.isEmpty(itemUpdate)) {
			itemUpdate._id = itemData._id;
			arr.push(expandObject(itemUpdate));
		}

		return arr;
	}, []);
	if (items.length > 0) update.items = items;

	return update;
};

const migrateItemData = (item, worldSchemaVersion) => {
	const update = {};

	if (worldSchemaVersion < 3) {
		if (item.type === "artifact") update.type = "weapon";

		if (item.type === "armor") update["system.bonus"] = item.system.rating;
		else {
			let baseBonus = 0;
			let artifactBonus = "";
			if (item.system.bonus) {
				const parts = item.system.bonus.split("+").map((p) => p.trim());
				for (const part of parts) {
					if (Number.isNumeric(part)) baseBonus += +part;
					else if (artifactBonus.length)
						artifactBonus = `${artifactBonus} + ${part}`;
					else artifactBonus = part;
				}
			}
			update["system.bonus"] = {
				value: baseBonus,
				max: baseBonus,
			};
			update["system.artifactBonus"] = artifactBonus;
		}
	}

	if (worldSchemaVersion < 4) {
		if (item.type === "spell" && !item.system.spellType)
			update["system.spellType"] = "SPELL.SPELL";
	}

	if (worldSchemaVersion < 5) {
		if (item.type === "weapon" && typeof item.system.features === "string") {
			// Change features from string to object
			const features = item.system.features
				.replace(".", "")
				.replace(/loading is a slow action/i, "slowReload")
				.replace(/slow reload/i, "slowReload")
				.split(", ");
			update["system.features"] = {
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
				const lcFeature =
					feature === "slowReload" ? feature : feature.toLowerCase();
				if (lcFeature in update["system.features"])
					update["system.features"][lcFeature] = true;
				else otherFeatures += `${feature}, `;
			}
			update["system.features"].others = otherFeatures.substr(
				0,
				otherFeatures.length - 2,
			);
		}
	}

	if (worldSchemaVersion < 7) {
		if (item.type === "monsterTalent") {
			update.type = "talent";
			update["system.type"] = "monster";
		}
		if (item.type === "weapon") update["system.ammo"] = "other";
	}

	return update;
};

const migrateSceneData = (scene) => {
	const tokens = scene.tokens.map((token) => {
		const t = token.toJSON();
		if (!t.actorId || t.actorLink) {
			t.actorData = {};
		} else if (!game.actors.has(t.actorId)) {
			t.actorId = null;
			t.actorData = {};
		} else if (!t.actorLink) {
			const actorData = duplicate(t.actorData);
			actorData.type = token.actor?.type;
			const update = migrateActorData(actorData);

			for (const embeddedName of ["items", "effects"]) {
				if (!update[embeddedName]?.length) continue;
				const updates = new Map(update[embeddedName].map((u) => [u._id, u]));
				for (const embedded of actorData[embeddedName]) {
					const toUpdate = updates.get(embedded._id);
					if (toUpdate) foundry.utils.mergeObject(embedded, toUpdate);
				}
				delete update[embeddedName];
			}

			mergeObject(t.actorData, update);
		}
		return t;
	});
	return { tokens };
};

/**
 * Borrowed from 5e system. I don't have time to look at the intricacies of this.
 */
const migrateCompendium = async (pack, worldSchemaVersion) => {
	const entity = pack.metadata.entity;
	if (!["Actor", "Item", "Scene"].includes(entity)) return;

	// Unlock the pack for editing
	const wasLocked = pack.locked;
	await pack.configure({ locked: false });

	// Begin by requesting server-side data model migration and get the migrated content
	await pack.migrate();
	const documents = await pack.getDocuments();

	// Iterate over compendium entries - applying fine-tuned migration functions
	for (const doc of documents) {
		let updateData = {};
		try {
			switch (entity) {
				case "Actor":
					updateData = migrateActorData(doc.toObject(), worldSchemaVersion);
					break;
				case "Item":
					updateData = migrateItemData(doc.toObject(), worldSchemaVersion);
					break;
				case "Scene":
					updateData = migrateSceneData(doc.data, worldSchemaVersion);
					break;
			}

			// Save the entry, if data was changed
			if (foundry.utils.isEmpty(updateData)) continue;
			await doc.update(updateData);
			console.log(
				`Migrated ${entity} entity ${doc.name} in Compendium ${pack.collection}`,
			);
		} catch (err) {
			// Handle migration failures
			err.message = `Failed migration for entity ${doc.name} in pack ${pack.collection}: ${err.message}`;
			console.error(err);
		}
	}

	// Apply the original locked status for the pack
	await pack.configure({ locked: wasLocked });
	console.log(
		`Migrated all ${entity} entities from Compendium ${pack.collection}`,
	);
};

const migrateSettings = async (worldSchemaVersion) => {
	if (worldSchemaVersion < 4) {
		game.settings.set("forbidden-lands", "showCraftingFields", true);
		game.settings.set("forbidden-lands", "showCostField", true);
		game.settings.set("forbidden-lands", "showSupplyField", true);
		game.settings.set("forbidden-lands", "showEffectField", true);
		game.settings.set("forbidden-lands", "showDescriptionField", true);
		game.settings.set("forbidden-lands", "showDrawbackField", true);
		game.settings.set("forbidden-lands", "showAppearanceField", true);
	}
	if (worldSchemaVersion < 5)
		game.settings.set("forbidden-lands", "alternativeSkulls", false);
};
