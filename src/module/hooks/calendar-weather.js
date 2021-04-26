export function initializeCalendar() {
	// Init support for the Calendar/Weather module
	if (!game.modules.get("calendar-weather")?.active) {
		if (game.settings.get("forbidden-lands", "worldSchemaVersion") === 0)
			ui.notifications.notify(
				"Install the Calendar/Weather module for calendar support: https://foundryvtt.com/packages/calendar-weather/",
			);
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
