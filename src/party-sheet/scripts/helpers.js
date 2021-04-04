import { InfoDialog } from "./dialog/info-dialog.js";

export class Helpers {
    static getCharacterDiceRoller(character) {
        character = character instanceof Actor ? character : game.user.character;
        if (!character) return;

        let charSheetClass = function(){};
        for (let name in CONFIG.Actor.sheetClasses.character) {
            if (name === 'forbidden-lands.ForbiddenLandsCharacterSheet') {
                charSheetClass = CONFIG.Actor.sheetClasses.character[name].cls;
                break;
            }
        }
        let charSheet;
        for (let key in character.apps) {
            if (character.apps[key] instanceof charSheetClass) {
                charSheet = character.apps[key];
                break;
            }
        }
        if (!charSheet) {
            InfoDialog.show(game.i18n.localize('FLPS.UI.ATTENTION'), game.i18n.localize('FLPS.UI.ERROR.OPEN_SHEET'));
            return null;
        }

        return charSheet.diceRoller;
    }

    static getOwnedCharacters(characterIds) {
        characterIds = typeof characterIds !== 'object' && characterIds !== '' ? [characterIds] : characterIds;
        let characters = [];
        for (let i = 0; i < characterIds.length; i++) {
            characters.push(game.actors.get(characterIds[i]));
        }
        characters = characters.filter((character) => character.owner);

        return characters;
    }
}