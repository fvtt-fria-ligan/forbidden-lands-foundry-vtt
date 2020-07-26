export const migrateWorld = async () => {
  const schemaVersion = game.system.data.version;
  const worldSchemaVersion = Number(game.settings.get("forbidden-lands", "worldSchemaVersion"));
  if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
    ui.notifications.info("Upgrading the world, please wait...");
    for (let actor of game.actors.entities) {
      try {
        const update = migrateActorData(actor.data, worldSchemaVersion);
        if (!isObjectEmpty(update)) {
          await actor.update(update, { enforceTypes: false });
        }
      } catch (e) {
        console.error(e);
      }
    }
    for (let item of game.items.entities) {
      try {
        const update = migrateItemData(item.data, worldSchemaVersion);
        if (!isObjectEmpty(update)) {
          await item.update(update, { enforceTypes: false });
        }
      } catch (e) {
        console.error(e);
      }
    }
    for (let scene of game.scenes.entities) {
      try {
        const update = migrateScene(scene.data, worldSchemaVersion);
        if (!isObjectEmpty(update)) {
          await scene.update(update, { enforceTypes: false });
        }
      } catch (err) {
        console.error(err);
      }
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
      return mergeObject(item, itemUpdate, { enforceTypes: false, inplace: false });
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
    } else if (typeof item.data.bonus !== "object") {
      if (item.type === "armor") {
        update["data.bonus"] = item.data.rating;
      } else if (item.data.bonus) {
        let baseBonus = 0;
        let artifactBonus = "";
        if (item.data.bonus) {
          const parts = item.data.bonus.split("+").map((p) => p.trim());
          parts.forEach((p) => {
            if (Number.isNumeric(p)) {
              baseBonus += +p;
            }
            if (p.toLowerCase().includes("d8")) {
              artifactBonus = "d8";
            }
            if (p.toLowerCase().includes("d10")) {
              artifactBonus = "d10";
            }
            if (p.toLowerCase().includes("d12")) {
              artifactBonus = "d12";
            }
          });
          update["data.bonus"] = {
            value: baseBonus,
            max: baseBonus,
          };
          update["data.artifactBonus"] = artifactBonus;
        }
      }
    }
  }
  if (!isObjectEmpty(update)) {
    update._id = item._id;
  }
  return update;
};

const migrateScene = (scene, worldSchemaVersion) => {
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
      } else if (!tokenData.actorLink) {
        const update = migrateActorData(token.data.actorData, worldSchemaVersion);
        console.log("ACTOR CHANGED", token.data.actorData, update);
        tokenData.actorData = mergeObject(token.data.actorData, update);
      }
      return tokenData;
    }),
  };
};
