function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/forbidden-lands/model/character.html",
    "systems/forbidden-lands/model/monster.html",
    "systems/forbidden-lands/model/weapon.html",
    "systems/forbidden-lands/model/armor.html",
    "systems/forbidden-lands/model/monster-talent.html",
    "systems/forbidden-lands/model/monster-attack.html",
    "systems/forbidden-lands/model/artifact.html",
    "systems/forbidden-lands/model/gear.html",
    "systems/forbidden-lands/model/raw-material.html",
    "systems/forbidden-lands/model/talent.html",
    "systems/forbidden-lands/model/spell.html",
    "systems/forbidden-lands/model/critical-injury.html",
    "systems/forbidden-lands/model/tab/main.html",
    "systems/forbidden-lands/model/tab/combat.html",
    "systems/forbidden-lands/model/tab/combat-monster.html",
    "systems/forbidden-lands/model/tab/talent.html",
    "systems/forbidden-lands/model/tab/spell.html",
    "systems/forbidden-lands/model/tab/gear.html",
    "systems/forbidden-lands/model/tab/gear-monster.html",
    "systems/forbidden-lands/model/tab/bio.html",
    "systems/forbidden-lands/model/tab/building-stronghold.html",
    "systems/forbidden-lands/model/tab/hireling-stronghold.html",
    "systems/forbidden-lands/model/tab/gear-stronghold.html",
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
}

export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};
