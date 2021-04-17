import { RollDialog } from "./roll-dialog.js";
import { CharacterPickerDialog } from "./character-picker-dialog.js";
import { Helpers } from "../utils/helpers.js";

/**
 * Roll skill check to perform a travel action
 *
 * @param  {string}   rollName    Display name for the roll
 * @param  {string}   skillName   Unlocalized label
 * @param  {Function} onAfterRoll Callback that will be executed after roll is made
 */
function doRollTravelAction(character, rollName, skillName, onAfterRoll) {
	if (!character && game.user.character === null) return;

	character = character || game.user.character;
	const diceRoller = Helpers.getCharacterDiceRoller(character);
	if (diceRoller === null) return;

	const data = character.data.data;
	const skill = data.skill[skillName];

	RollDialog.prepareRollDialog(
		game.i18n.localize(rollName),
		{
			name: game.i18n.localize(data.attribute[skill.attribute].label),
			value: data.attribute[skill.attribute].value,
		},
		{ name: game.i18n.localize(skill.label), value: skill.value },
		0,
		"",
		0,
		0,
		diceRoller,
		onAfterRoll,
	);
}

/**
 * Roll skill check to perform a travel action
 *
 * @param  {Array}   assignedPartyMemberIds
 * @param  {string}   rollName             Display name for the roll
 * @param  {string}   skillName            Unlocalized label
 * @param  {Function} onAfterRoll          Callback that will be executed after roll is made
 */
function rollTravelAction(assignedPartyMemberIds, rollName, skillName, doRoll, onAfterRoll) {
	let assignedPartyMembers = Helpers.getOwnedCharacters(assignedPartyMemberIds);

	if (assignedPartyMembers.length === 1) {
		doRoll(assignedPartyMembers[0], rollName, skillName, onAfterRoll);
	} else if (assignedPartyMembers.length > 1) {
		CharacterPickerDialog.show(
			game.i18n.localize("FLPS.UI.WHO_ROLLS") + " " + game.i18n.localize(rollName),
			assignedPartyMembers,
			function (entityId) {
				doRoll(game.actors.get(entityId), rollName, skillName, onAfterRoll);
			},
		);
	}
}

export let TravelActionsConfig = {
	hike: {
		key: "hike",
		journalEntryName: "Hike",
		name: "FLPS.TRAVEL.HIKE",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.FORCED_MARCH",
				class: "travel-forced-march",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.hike,
						"FLPS.TRAVEL_ROLL.FORCED_MARCH",
						"endurance",
						doRollTravelAction,
					);
				},
			},
			{
				name: "FLPS.TRAVEL_ROLL.HIKE_IN_DARKNESS",
				class: "travel-hike-in-darkness",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.hike,
						"FLPS.TRAVEL_ROLL.HIKE_IN_DARKNESS",
						"scouting",
						doRollTravelAction,
					);
				},
			},
		],
	},
	lead: {
		key: "lead",
		journalEntryName: "Lead the Way",
		name: "FLPS.TRAVEL.LEAD",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.NAVIGATE",
				class: "travel-navigate",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.lead,
						"FLPS.TRAVEL_ROLL.NAVIGATE",
						"survival",
						doRollTravelAction,
					);
				},
			},
		],
	},
	watch: {
		key: "watch",
		journalEntryName: "Keep Watch",
		name: "FLPS.TRAVEL.WATCH",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.KEEP_WATCH",
				class: "travel-keep-watch",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.watch,
						"FLPS.TRAVEL_ROLL.KEEP_WATCH",
						"scouting",
						doRollTravelAction,
					);
				},
			},
		],
	},
	rest: {
		key: "rest",
		journalEntryName: "Rest",
		name: "FLPS.TRAVEL.REST",
		buttons: [],
	},
	sleep: {
		key: "sleep",
		journalEntryName: "Sleep",
		name: "FLPS.TRAVEL.SLEEP",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.FIND_GOOD_PLACE",
				class: "travel-find-good-place",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.sleep,
						"FLPS.TRAVEL_ROLL.FIND_GOOD_PLACE",
						"survival",
						doRollTravelAction,
					);
				},
			},
		],
	},
	forage: {
		key: "forage",
		journalEntryName: "Forage",
		name: "FLPS.TRAVEL.FORAGE",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.FIND_FOOD",
				class: "travel-find-food",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.forage,
						"FLPS.TRAVEL_ROLL.FIND_FOOD",
						"survival",
						doRollTravelAction,
					);
				},
			},
		],
	},
	hunt: {
		key: "hunt",
		journalEntryName: "Hunt",
		name: "FLPS.TRAVEL.HUNT",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.FIND_PREY",
				class: "travel-find-prey",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.hunt,
						"FLPS.TRAVEL_ROLL.FIND_PREY",
						"survival",
						doRollTravelAction,
						function (diceRoller) {
							// onAfterRoll
							const isSuccess = diceRoller.countSword() > 0;
							if (isSuccess) {
								let rolltable = game.tables.getName("Find a Prey");
								if (rolltable) {
									rolltable.draw();
								} else {
									let chatData = {
										user: game.user._id,
										content:
											"You've spotted a prey!<br><i>Create a roll table named 'Find a Prey' to automatically find out what creature have you spotted.<i>",
									};
									ChatMessage.create(chatData, {});
								}
							}
						},
					);
				},
			},
			{
				name: "FLPS.TRAVEL_ROLL.KILL_PREY",
				class: "travel-kill-prey",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.hunt,
						"FLPS.TRAVEL_ROLL.KILL_PREY",
						"survival",
						function (character, rollName, _skillName, onAfterRoll) {
							if (!character && game.user.character === null) return;
							character = character || game.user.character;
							const diceRoller = Helpers.getCharacterDiceRoller(character);
							if (diceRoller === null) return;

							const data = character.data.data;
							const skill = data.skill.marksmanship;

							RollDialog.prepareRollDialog(
								game.i18n.localize(rollName),
								data.attribute[skill.attribute].value,
								skill.value,
								0,
								"",
								0,
								0,
								diceRoller,
								onAfterRoll,
							);
						},
					);
				},
			},
		],
	},
	fish: {
		key: "fish",
		journalEntryName: "Fish",
		name: "FLPS.TRAVEL.FISH",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.CATCH_FISH",
				class: "travel-catch-fish",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.fish,
						"FLPS.TRAVEL_ROLL.CATCH_FISH",
						"survival",
						doRollTravelAction,
					);
				},
			},
		],
	},
	camp: {
		key: "camp",
		journalEntryName: "Make Camp",
		name: "FLPS.TRAVEL.CAMP",
		buttons: [
			{
				name: "FLPS.TRAVEL_ROLL.MAKE_CAMP",
				class: "travel-make-camp",
				handler: function (party) {
					rollTravelAction(
						party.actor.data.data.travel.camp,
						"FLPS.TRAVEL_ROLL.MAKE_CAMP",
						"survival",
						doRollTravelAction,
					);
				},
			},
		],
	},
	other: {
		key: "other",
		journalEntryName: "",
		name: "FLPS.TRAVEL.OTHER",
		buttons: [],
	},
};
