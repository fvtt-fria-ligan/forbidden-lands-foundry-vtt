export class FBLCombatant extends Combatant {
	get fast() {
		return this.getFlag("forbidden-lands", "fast");
	}

	get slow() {
		return this.getFlag("forbidden-lands", "slow");
	}
}

export class FBLCombatTracker extends CombatTracker {
	get template() {
		return "systems/forbidden-lands/templates/system/combat/combat.hbs";
	}

	async _onCombatantControl(event) {
		super._onCombatantControl(event);
		const btn = event.currentTarget;
		const li = btn.closest(".combatant");
		const combat = this.viewed;
		const c = combat.combatants.get(li.dataset.combatantId);
		switch (btn.dataset.control) {
			case "toggleFast":
				return c.setFlag("forbidden-lands", "fast", !c.fast);
			case "toggleSlow":
				return c.setFlag("forbidden-lands", "slow", !c.slow);
		}
	}

	async getData(options) {
		const data = await super.getData(options);
		return {
			...data,
			turns: data.turns.map((turn) => {
				const c = this.viewed.combatants.get(turn.id);
				turn.fast = c.fast;
				turn.slow = c.slow;
				return turn;
			}),
		};
	}
}

export class FBLCombat extends Combat {
	constructor(data) {
		super(data);
		this.initiativeDeck = [];
	}

	_sortCombatants(a, b) {
		const initA = Number.isNumeric(a.initiative) ? a.initiative : -9999;
		const initB = Number.isNumeric(b.initiative) ? b.initiative : -9999;
		return initA - initB;
	}

	async rollInitiative(ids, { updateTurn = true, messageOptions = {} } = {}) {
		// Structure input data
		ids = typeof ids === "string" ? [ids] : ids;
		const currentId = this.combatant?.id;
		const rollMode =
			messageOptions.rollMode || game.settings.get("core", "rollMode");

		// Initialize finite initiative deck based on existing initiative values in Combat.
		this.initiativeDeck = Array.fromRange(CONFIG.fbl.maxInit ?? 10)
			.map((num) => ++num)
			.filter((num) => !this.turns.some((c) => c?.initiative === num));

		if (this.initiativeDeck.length === 0)
			return ui.notifications.warn("WARNING.NO_AVAILABLE_VALUES", {
				localize: true,
			});

		// Iterate over Combatants, performing an initiative roll for each
		const updates = [];
		const messages = [];
		for (const [i, id] of ids.entries()) {
			// Get Combatant data (non-strictly)
			const combatant = this.combatants.get(id);

			if (!combatant?.isOwner) {
				ui.notifications.error("ERROR.NOT_OWNER", { localize: true });
				break;
			}

			// Since we may be rolling more than X combatants, we need to check that we have values left
			if (this.initiativeDeck.length === 0) {
				ui.notifications.warn("WARNING.NO_AVAILABLE_VALUES", {
					localize: true,
				});
				break;
			}

			// Produce an initiative roll for the Combatant
			const roll = new Roll(`1d${this.initiativeDeck.length}`);
			await roll.evaluate({ async: true });

			// Remove the initiative from the deck.
			const result = this.initiativeDeck.splice(roll.total - 1, 1);
			updates.push({ _id: id, initiative: result[0] });

			// Foundry doesn't support custom dies like 1d{3,6,7}
			// so we alter the roll data to display the correct formula/results
			roll._formula = `1d${CONFIG.fbl.maxInit ?? 10}`;
			roll._total = result[0];
			roll.terms = [];

			// Construct chat message data
			const messageData = foundry.utils.mergeObject(
				{
					speaker: ChatMessage.getSpeaker({
						actor: combatant.actor,
						token: combatant.token,
						alias: combatant.name,
					}),
					flavor: game.i18n.format("COMBAT.RollsInitiative", {
						name: combatant.name,
					}),
					flags: { "core.initiativeRoll": true },
				},
				messageOptions,
			);
			const chatData = await roll.toMessage(messageData, {
				create: false,
				rollMode:
					combatant.hidden && ["roll", "publicroll"].includes(rollMode)
						? "gmroll"
						: rollMode,
			});

			// Play 1 sound for the whole rolled set
			if (i > 0) chatData.sound = null;
			messages.push(chatData);
		}
		if (!updates.length) return this;

		// Update multiple combatants
		await this.updateEmbeddedDocuments("Combatant", updates);

		// Ensure the turn order remains with the same combatant
		if (updateTurn && currentId) {
			await this.update({
				turn: this.turns.findIndex((t) => t.id === currentId),
			});
		}

		// Create multiple chat messages
		await ChatMessage.implementation.create(messages);
		return this;
	}

	async nextRound() {
		this.turns.forEach((c) => c.setFlag("forbidden-lands", "fast", false));
		this.turns.forEach((c) => c.setFlag("forbidden-lands", "slow", false));
		return super.nextRound();
	}
}
