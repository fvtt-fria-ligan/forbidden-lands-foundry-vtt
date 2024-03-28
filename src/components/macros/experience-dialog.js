(async () => {
	const gamePlayers = game.users.players;
	const characters = {};
	const players = {};
	const playersName = [];

	for (const player of gamePlayers) {
		const playerName = player.name;
		const character = player.character;
		characters[playerName] = character;
		players[playerName] = player;
		playersName.push(playerName);
	}

	function createTemplate() {
		let form_html = `<form>
		<h2>${game.i18n.localize("EXPERIENCE.TITLE.PLAYERS")}</h2>
		<multi-checkbox name="players" class="players-choices">`;
		playersName.forEach((playerName) => {
			const isActive = players[playerName].active;
			const selected = isActive ? "selected" : "";
			form_html += `<option value="${playerName}" ${selected}>${playerName}</option>`;
		});
		form_html += `</multi-checkbox><br>`;

		form_html += `<h2>${game.i18n.localize("EXPERIENCE.TITLE.ACTIONS")}</h2>
		<multi-checkbox name="actions" class="actions-choices">`;
		const actions = [
			"SESSION",
			"MAP",
			"SITE",
			"MONSTERS",
			"TREASURE",
			"FORTRESS",
			"PRIDE",
			"DARK_SECRET",
			"LIFE",
			"EXPLOIT",
		];
		for (const action of actions) {
			const actionLabel = game.i18n.localize(
				`EXPERIENCE.ACTIONS.${action}`,
			);
			form_html += `<option value="${action}">${actionLabel}</option>`;
		}
		form_html += `</multi-checkbox></form><br>`;

		form_html += `
		<style>
			multi-checkbox.actions-choices {
				grid-template-columns: repeat(2, 1fr);
			}

			multi-checkbox label.checkbox {
				align-items: center;
				display: flex;
				line-height: 16px;
				margin-bottom: 4px;
				word-break: break-word;
			}

			label.checkbox > input[type="checkbox"] {
				top: inherit;
			}
		</style>
		`;

		return form_html;
	}

	function assignExperience(html) {
		const xpGains = html.querySelectorAll(
			"form .actions-choices input:checked",
		).length;
		const selectedPlayers = html.querySelectorAll(
			"form .players-choices input:checked",
		);

		selectedPlayers.forEach((input) => {
			const player = input.value;
			const playerCharacter = characters[player];
			if (!playerCharacter) return;

			const currentXp = parseInt(
				playerCharacter?.system?.bio?.experience?.value || 0,
			);
			const newXp = currentXp + xpGains;
			playerCharacter.update({
				"system.bio.experience.value": newXp,
			});

			ChatMessage.create(
				{
					user: game.user.id,
					speaker: ChatMessage.getSpeaker(),
					content: game.i18n.localize("EXPERIENCE.CHAT.MESSAGE", {
						name: playerCharacter.name,
						xpGains: xpGains,
						newXp: newXp,
					}),
				},
				{},
			);
		});
	}

	new Dialog(
		{
			title: game.i18n.localize("EXPERIENCE.TITLE.DIALOG"),
			content: createTemplate(),
			buttons: {
				ok: {
					label: game.i18n.localize("EXPERIENCE.BUTTON.OK"),
					icon: `<i class="fas fa-check"></i>`,
					callback: (html) => {
						assignExperience(html[0]);
					},
				},
				cancel: {
					label: game.i18n.localize("EXPERIENCE.BUTTON.CANCEL"),
					icon: `<i class="fas fa-times"></i>`,
					callback: () => {},
				},
			},
			default: "cancel",
			close: () => {},
		},
		{ width: 600 },
	).render(true);
})();
