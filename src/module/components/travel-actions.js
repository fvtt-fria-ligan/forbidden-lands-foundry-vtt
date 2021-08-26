/* eslint-disable no-unused-vars */
import { CharacterPickerDialog } from "./character-picker-dialog.js";
import { Helpers } from "../utils/helpers.js";
import localizeString from "../utils/localize-string.js";

/**
 * Roll skill check to perform a travel action
 * @param {object<Actor>} Character Actor Document used to identify who rolls.
 * @param  {string} rollName Display name for the roll
 */
function rollTravelAction(character, rollName) {
	if (!character && !character.owner) return;
	character.sheet.rollAction(rollName);
}

/**
 * Finds the correct character to roll travel action.
 * @param {string} assignedPartyMemberIds Ids of one or all characters assigned to the task (if multiple).
 * @param {string} rollName Used to identify roll.
 */
function handleTravelAction(assignedPartyMemberIds, rollName) {
	let assignedPartyMembers = Helpers.getOwnedCharacters(assignedPartyMemberIds);

	if (assignedPartyMembers.length === 1) {
		rollTravelAction(assignedPartyMembers[0], rollName);
	} else if (assignedPartyMembers.length > 1) {
		CharacterPickerDialog.show(
			localizeString("FLPS.UI.WHO_ROLLS") + " " + localizeString(rollName),
			assignedPartyMembers,
			function (entityId) {
				rollTravelAction(game.actors.get(entityId), rollName);
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
					handleTravelAction(party.actorProperties.travel.hike, "travel-forced-march");
				},
			},
			{
				name: "FLPS.TRAVEL_ROLL.HIKE_IN_DARKNESS",
				class: "travel-hike-in-darkness",
				handler: function (party) {
					handleTravelAction(party.actorProperties.travel.hike, "travel-hike-in-darkness");
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
					handleTravelAction(party.actorProperties.travel.lead, "travel-navigate");
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
					handleTravelAction(party.actorProperties.travel.watch, "travel-keep-watch");
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
					handleTravelAction(party.actorProperties.travel.sleep, "travel-find-good-place");
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
					handleTravelAction(party.actorProperties.travel.forage, "travel-find-food");
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
					handleTravelAction(party.actorProperties.travel.hunt, "travel-find-prey");
				},
			},
			{
				name: "FLPS.TRAVEL_ROLL.KILL_PREY",
				class: "travel-kill-prey",
				handler: function (party) {
					handleTravelAction(party.actorProperties.travel.hunt, "travel-kill-prey");
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
					handleTravelAction(party.actorProperties.travel.fish, "travel-catch-fish");
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
					handleTravelAction(party.actorProperties.travel.camp, "travel-make-camp");
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
