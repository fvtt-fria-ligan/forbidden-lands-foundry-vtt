export class ForbiddenLandsTokenHUD extends TokenHUD {
	_getStatusEffectChoices() {
		const actor = this.object.document.actor;

		const data = super._getStatusEffectChoices();

		if (actor?.type === "character") return data;

		for (const [key, effect] of Object.entries(data)) {
			if (effect && CONFIG.fbl.conditions.includes(effect?.id))
				delete data[key];
		}

		return data;
	}
}
