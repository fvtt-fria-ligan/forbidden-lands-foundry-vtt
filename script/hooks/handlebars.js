function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/forbidden-lands/chat/item.html",
    "systems/forbidden-lands/chat/roll.html",
    "systems/forbidden-lands/chat/consumable.html",
    "systems/forbidden-lands/model/character.html",
    "systems/forbidden-lands/model/monster.html",
    "systems/forbidden-lands/model/weapon.html",
    "systems/forbidden-lands/model/armor.html",
    "systems/forbidden-lands/model/monster-talent.html",
    "systems/forbidden-lands/model/monster-attack.html",
    "systems/forbidden-lands/model/gear.html",
    "systems/forbidden-lands/model/raw-material.html",
    "systems/forbidden-lands/model/talent.html",
    "systems/forbidden-lands/model/critical-injury.html",
    "systems/forbidden-lands/model/tab/main.html",
    "systems/forbidden-lands/model/tab/combat.html",
    "systems/forbidden-lands/model/tab/combat-monster.html",
    "systems/forbidden-lands/model/tab/talent.html",
    "systems/forbidden-lands/model/tab/gear.html",
    "systems/forbidden-lands/model/tab/gear-monster.html",
    "systems/forbidden-lands/model/tab/bio.html",
    "systems/forbidden-lands/model/tab/building-stronghold.html",
    "systems/forbidden-lands/model/tab/hireling-stronghold.html",
    "systems/forbidden-lands/model/tab/gear-stronghold.html",
    "systems/forbidden-lands/model/partial/roll-modifiers.html",
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
      case "helmet":
        return game.i18n.localize("ARMOR.HELMET");
      case "shield":
        return game.i18n.localize("ARMOR.SHIELD");
    }
  });
  Handlebars.registerHelper("itemWeight", function (weight) {
    weight = normalize(weight, "regular");
    switch (weight) {
      case "tiny":
        return game.i18n.localize("WEIGHT.TINY");
      case "light":
        return game.i18n.localize("WEIGHT.LIGHT");
      case "regular":
        return game.i18n.localize("WEIGHT.REGULAR");
      case "heavy":
        return game.i18n.localize("WEIGHT.HEAVY");
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
  Handlebars.registerHelper("isBroken", function (item) {
    if (parseInt(item.data.bonus.max, 10) > 0 && parseInt(item.data.bonus.value, 10) === 0) {
      return "broken";
    } else {
      return "";
    }
  });
  Handlebars.registerHelper("formatRollModifiers", function (rollModifiers) {
    let output = [];
    Object.values(rollModifiers).forEach(mod => {
      let name = game.i18n.localize(mod.name);
      output.push(`${name} ${mod.value}`);
    });
    return output.join(", ");
  });
  Handlebars.registerHelper('plaintextToHTML', function(value) {
    // strip tags, add <br/> tags
    return new Handlebars.SafeString(value.replace(/(<([^>]+)>)/gi, "").replace(/(?:\r\n|\r|\n)/g, '<br/>'));
  });
  Handlebars.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();
  });
  Handlebars.registerHelper('eq', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
      return args[0] === expression;
    });
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
