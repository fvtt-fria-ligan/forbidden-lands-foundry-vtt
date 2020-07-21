import { ForbiddenLandsActor } from "./actor/forbidden-lands.js";
import { ForbiddenLandsCharacterSheet } from "./sheet/character.js";
import { ForbiddenLandsMonsterSheet } from "./sheet/monster.js";
import { ForbiddenLandsStrongholdSheet } from "./sheet/stronghold.js";
import { ForbiddenLandsWeaponSheet } from "./sheet/weapon.js";
import { ForbiddenLandsArmorSheet } from "./sheet/armor.js";
import { ForbiddenLandsGearSheet } from "./sheet/gear.js";
import { ForbiddenLandsRawMaterialSheet } from "./sheet/raw-material.js";
import { ForbiddenLandsSpellSheet } from "./sheet/spell.js";
import { ForbiddenLandsTalentSheet } from "./sheet/talent.js";
import { ForbiddenLandsCriticalInjurySheet } from "./sheet/critical-injury.js";
import { ForbiddenLandsMonsterTalentSheet } from "./sheet/monster-talent.js";
import { ForbiddenLandsMonsterAttackSheet } from "./sheet/monster-attack.js";
import { ForbiddenLandsBuildingSheet } from "./sheet/building.js";
import { ForbiddenLandsHirelingSheet } from "./sheet/hireling.js";
import { initializeHandlebars } from "./handlebars.js";
import { migrateWorld } from "./migration.js";

// CONFIG.debug.hooks = true;

Hooks.once("init", () => {
  CONFIG.Combat.initiative = { formula: "1d10", decimals: 0 };
  CONFIG.Actor.entityClass = ForbiddenLandsActor;
  CONFIG.fontFamilies.push("IM Fell Great Primer");
  CONFIG.defaultFontFamily = "IM Fell Great Primer";
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("forbidden-lands", ForbiddenLandsCharacterSheet, { types: ["character"], makeDefault: true });
  Actors.registerSheet("forbidden-lands", ForbiddenLandsMonsterSheet, { types: ["monster"], makeDefault: true });
  Actors.registerSheet("forbidden-lands", ForbiddenLandsStrongholdSheet, { types: ["stronghold"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("forbidden-lands", ForbiddenLandsWeaponSheet, { types: ["weapon"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsArmorSheet, { types: ["armor"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsGearSheet, { types: ["gear"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsRawMaterialSheet, { types: ["rawMaterial"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsSpellSheet, { types: ["spell"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsTalentSheet, { types: ["talent"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsCriticalInjurySheet, { types: ["criticalInjury"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsMonsterTalentSheet, { types: ["monsterTalent"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsMonsterAttackSheet, { types: ["monsterAttack"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsBuildingSheet, { types: ["building"], makeDefault: true });
  Items.registerSheet("forbidden-lands", ForbiddenLandsHirelingSheet, { types: ["hireling"], makeDefault: true });
  game.settings.register("forbidden-lands", "worldSchemaVersion", {
    name: "World Version",
    hint: "Used to automatically upgrade worlds data when the system is upgraded.",
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });
  initializeHandlebars();
});

Hooks.once("ready", () => {
  migrateWorld();
  initializeCalendar();
});

function initializeCalendar() {
  // Init support for the Calendar/Weather module
  if (!game.modules.has("calendar-weather")) {
    console.warn("Install the Calendar/Weather module for calendar support: https://foundryvtt.com/packages/calendar-weather/");
    return;
  }

  let calendarData = game.settings.get("calendar-weather", "dateTime");
  if (!calendarData) {
    calendarData = {};
  }

  if (!calendarData.default) {
    calendarData.default = {
      currentMonth: 2,
      day: 1,
      dayLength: 24,
      daysOfTheWeek: ["Sunday", "Moonday", "Bloodday", "Earthday", "Growthday", "Feastday", "Stillday"],
      era: "AS",
      events: [],
      months: [
        { isNumbered: true, length: 46, name: "Winterwane" },
        { isNumbered: true, length: 45, name: "Springrise" },
        { isNumbered: true, length: 46, name: "Springwane" },
        { isNumbered: true, length: 45, name: "Sumerrise" },
        { isNumbered: true, length: 46, name: "Summerwane" },
        { isNumbered: true, length: 45, name: "Fallrise" },
        { isNumbered: true, length: 46, name: "Fallwane" },
        { isNumbered: true, length: 45, name: "Winterrise" },
      ],
      moons: [
        {
          cycleLength: 30,
          cyclePercent: 70,
          isWaxing: false,
          name: "Moon",
          solarEclipseChance: 0.0005,
          lunarEclipseChance: 0.02,
        },
      ],
      reEvents: [
        { name: "Midwinter", date: { combined: "1-1", day: 1, month: "1" }, text: "" },
        { name: "Awakening Day", date: { combined: "2-1", day: 1, month: "2" }, text: "" },
        { name: "Springturn", date: { combined: "3-1", day: 1, month: "3" }, text: "" },
        { name: "Lushday", date: { combined: "4-1", day: 1, month: "4" }, text: "" },
        { name: "Midsummer", date: { combined: "5-1", day: 1, month: "5" }, text: "" },
        { name: "Harvest Day", date: { combined: "6-1", day: 1, month: "6" }, text: "" },
        { name: "Fallturn", date: { combined: "7-1", day: 1, month: "7" }, text: "" },
        { name: "Rotday", date: { combined: "8-1", day: 1, month: "8" }, text: "" },
      ],
      seasons: [
        {
          color: "green",
          date: { combined: "2-1", day: 1, month: "2" },
          dawn: 3,
          dusk: 15,
          humidity: "=",
          name: "Spring",
          rolltable: "",
          temp: "=",
        },
        {
          color: "red",
          date: { combined: "4-1", day: 1, month: "4" },
          dawn: 3,
          dusk: 21,
          humidity: "+",
          name: "Summer",
          rolltable: "",
          temp: "+",
        },
        {
          color: "orange",
          date: { combined: "6-1", day: 1, month: "6" },
          dawn: 3,
          dusk: 15,
          humidity: "=",
          name: "Fall",
          rolltable: "",
          temp: "=",
        },
        {
          color: "blue",
          date: { combined: "8-1", day: 1, month: "8" },
          dawn: 9,
          dusk: 15,
          humidity: "-",
          name: "Winter",
        },
      ],
      weather: {
        climate: "temperate",
        climateHumidity: 0,
        climateTemp: 0,
        cTemp: 21.11,
        dawn: 5,
        dusk: 19,
        doNightCycle: false,
        humidity: 0,
        isC: true,
        isVolcanic: false,
        lastTemp: 70,
        outputToChat: true,
        precipitation: "",
        season: "Spring",
        seasonColor: "green",
        seasonHumidity: 0,
        seasonRolltable: "",
        seasonTemp: 0,
        showFX: false,
        temp: 53,
        weatherFX: [],
      },
      year: 1165,
    };
    game.settings.set("calendar-weather", "dateTime", calendarData);
  }
}
