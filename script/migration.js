export const migrateWorld = async () => {
  const schemaVersion = game.system.data.version;
  const worldSchemaVersion = Number(
    game.settings.get("forbidden-lands", "worldSchemaVersion")
  );
  if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
    ui.notifications.info("Upgrading the world, please wait...");
    for (let actor of game.actors.entities) {
      try {
        await migrateActor(actor, worldSchemaVersion);
      } catch (e) {
        console.error(e);
      }
    }
    for (let item of game.items.entities) {
      try {
        await migrateItem(item, worldSchemaVersion);
      } catch (e) {
        console.error(e);
      }
    }
    game.settings.set("forbidden-lands", "worldSchemaVersion", schemaVersion);
    ui.notifications.info("Upgrade complete!");
  }
};

const migrateActor = async (actor, worldSchemaVersion) => {
  if (worldSchemaVersion <= 2) {
    const update = {};
    if (actor.type === "character") {
      if (!actor.data.data.conditions.sleepy) {
        update["data.conditions.sleepy"] = actor.data.data.conditions.sleepless;
      }
    }
    if (!isObjectEmpty(update)) {
      update["_id"] = actor._id;
      await actor.update(update);
    }
  }
};

const migrateItem = async (item, worldSchemaVersion) => {
  if (worldSchemaVersion <= 2) {
    const update = {};
    if (item.type === "armor") {
      update["data.bonus"] = item.data.rating;
    }
    if (typeof item.data.bonus !== "Object") {
      update["data.bonus"] = {
        value: item.data.bonus,
        max: item.data.bonus,
      };
    }
    if (!isObjectEmpty(update)) {
      update["_id"] = item._id;
      await item.update(update);
    }
  }
};
