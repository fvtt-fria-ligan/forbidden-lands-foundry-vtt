export const migrateWorld = async () => {
    const schemaVersion = 3.0;
    const worldSchemaVersion = Number(game.settings.get("forbidden-lands", "worldSchemaVersion"));
    if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
        ui.notifications.info("Upgrading the world, please wait...");
        for (let actor of game.actors.entities) {
            try {
                const update = migrateActorData(actor.data, worldSchemaVersion);
                if (!isObjectEmpty(update)) {
                    await actor.update(update, {enforceTypes: false});
                }
            } catch (e) {
                console.error(e);
            }
        }
        for (let item of game.items.entities) {
            try {
                const update = migrateItemData(item.data, worldSchemaVersion);
                if (!isObjectEmpty(update)) {
                    await item.update(update, {enforceTypes: false});
                }
            } catch (e) {
                console.error(e);
            }
        }
        for (let scene of game.scenes.entities) {
            try {
                const update = migrateSceneData(scene.data, worldSchemaVersion);
                if (!isObjectEmpty(update)) {
                    await scene.update(update, {enforceTypes: false});
                }
            } catch (err) {
                console.error(err);
            }
        }
        for (let pack of game.packs.filter((p) => p.metadata.package === "world" && ["Actor", "Item", "Scene"].includes(p.metadata.entity))) {
          await migrateCompendium(pack, worldSchemaVersion);
        }
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
            return mergeObject(item, itemUpdate, {enforceTypes: false, inplace: false});
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
    if (!isObjectEmpty(update)) {
        update._id = item._id;
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
            updateData["_id"] = ent._id;
            await pack.updateEntity(updateData);
        }
    }
};
