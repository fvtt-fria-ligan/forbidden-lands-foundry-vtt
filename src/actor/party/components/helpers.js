import { InfoDialog } from "./info-dialog.js";

export class Helpers {
	static getCharacterDiceRoller(character) {
		character = character instanceof Actor ? character : game.user.character;
		if (!character) return;

		let charSheetClass = function () {};
		for (const chName in CONFIG.Actor.sheetClasses.character) {
			if (chName === "forbidden-lands.ForbiddenLandsCharacterSheet") {
				charSheetClass = CONFIG.Actor.sheetClasses.character[chName].cls;
				break;
			}
		}
		let charSheet;
		for (const key in character.apps) {
			if (character.apps[key] instanceof charSheetClass) {
				charSheet = character.apps[key];
				break;
			}
		}
		if (!charSheet) {
			InfoDialog.show(
				game.i18n.localize("FLPS.UI.ATTENTION"),
				game.i18n.localize("FLPS.UI.ERROR.OPEN_SHEET"),
			);
			return null;
		}

		return charSheet.diceRoller;
	}

	static getOwnedCharacters(characterIds) {
		characterIds =
			typeof characterIds !== "object" && characterIds !== ""
				? [characterIds]
				: characterIds;
		const characters = [];
		for (let i = 0; i < characterIds.length; i++) {
			const actor = game.actors.get(characterIds[i]);
			if (actor?.isOwner) characters.push(game.actors.get(characterIds[i]));
		}

		return characters;
	}
}
