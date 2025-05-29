const noop = () => {};

export class CharacterPickerDialog extends Application {
	constructor(actors, title, callback, onCancel = noop) {
		super();
		this.actors = actors;
		this.titleText = title;
		this.callback = callback;
		this.onCancel = onCancel;
	}

	/**
	 * Launch the character picker dialog.
	 */
	static async show(title, characters, onSelect = noop, onCancel = noop) {
		const actors = characters.map((c) =>
			c instanceof Actor ? c : game.actors.get(c),
		);
		const dialog = new CharacterPickerDialog(actors, title, onSelect, onCancel);
		dialog.render(true);
	}

	/**
	 * Foundry VTT options for this Application.
	 */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "character-picker-dialog",
			classes: ["forbidden-lands", "dialog"],
			template:
				"systems/forbidden-lands/templates/actor/party/components/character-picker-dialog.hbs",
			width: 400,
			height: "auto",
			resizable: false,
		});
	}

	/**
	 * Sets the dialog title.
	 */
	get title() {
		return this.titleText;
	}

	/**
	 * Supplies data to the template.
	 */
	getData() {
		return {
			title: this.titleText,
			actors: this.actors,
		};
	}

	/**
	 * Handles user interaction with actor selections.
	 */
	activateListeners(html) {
		super.activateListeners(html);
		for (const el of html[0].querySelectorAll(".select-actor")) {
			el.addEventListener("click", async (event) => {
				event.preventDefault();
				event.stopPropagation();
				const uuid = el.dataset.uuid;
				const actor = await fromUuid(uuid);
				this.callback(actor);
				this.close();
			});
		}
	}

	/**
	 * When closed without selection.
	 */
	close(options) {
		this.onCancel?.();
		return super.close(options);
	}
}
