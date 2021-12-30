export class CharacterPickerDialog extends Dialog {
	/**
	 * Show dialog that allows to pick a character from a list
	 *
	 */
	static async show(title, characters = [], onSelect, onCancel) {
		onSelect = onSelect || function () {};
		onCancel = onCancel || function () {};

		const characterSelector = await this.buildCharacterSelector(characters);

		let d = new CharacterPickerDialog({
			title: title,
			content: this.buildDivHtmlDialog(characterSelector),
			buttons: {
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: "Cancel",
					callback: onCancel,
				},
			},
			select: onSelect,
			default: "cancel",
			close: onCancel,
		});
		d.render(true);
	}

	/**
	 * @param  {string} html Dialog content
	 */
	activateListeners(html) {
		super.activateListeners(html);
		html.find(".party-member").click(this.handleCharacterSelect.bind(this));
	}

	handleCharacterSelect(event) {
		this.data.select($(event.currentTarget).data("entity-id"));
		this.close();
	}

	/**
	 * @param  {Array} characters Array with character IDs
	 */
	static async buildCharacterSelector(characters) {
		let html = "";
		let actor;
		for (let i = 0; i < characters.length; i++) {
			actor = characters[i] instanceof Actor ? characters[i].data : game.actors.get(characters[i]).data;
			html += await renderTemplate(
				"systems/forbidden-lands/templates/actor/party/components/member-component.hbs",
				{
					partyMember: actor,
					noCharSheetLink: true,
				},
			);
		}
		return `<ol>${html}</ol>`;
	}

	/**
	 * @param  {string} divContent
	 */
	static buildDivHtmlDialog(divContent) {
		return "<div class='flex row roll-dialog'>" + divContent + "</div>";
	}
}
