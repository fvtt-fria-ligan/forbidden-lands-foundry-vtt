export class ForbiddenLandsTokenHUD extends TokenHUD {
	_getStatusEffectChoices(params) {
		const actor = this.object.document.actor;

		const ret = super._getStatusEffectChoices();

		if (actor.type === "character") {
			return ret;
		}

		console.log(ret);

		for (const [key] of Object.entries(ret)) {
			if (!key.startsWith("module")) delete ret[key];
		}

		return ret;
	}
}
