import DiceRoller from "../components/dice-roller.js";

export class RollDialog {
	/**
	 * Display roll dialog and execute the roll.
	 *
	 * @param  {string}        rollName
	 * @param  {object|number} baseDefault     {name: "somename", value: 5} | 5
	 * @param  {object|number} skillDefault    {name: "somename", value: 5} | 5
	 * @param  {object|number} gearDefault     {name: "somename", value: 5} | 5
	 * @param  {string}        artifactDefault
	 * @param  {number}        modifierDefault
	 * @param  {number}        damage
	 * @param  {DiceRoller}    diceRoller
	 * @param  {callback}      [onAfterRoll]
	 */
	static prepareRollDialog(
		rollName,
		baseDefault,
		skillDefault,
		gearDefault,
		artifactDefault,
		modifierDefault,
		damage,
		diceRoller,
		onAfterRoll,
	) {
		if (!diceRoller) {
			throw new Error("DiceRoller object must be passed to prepareRollDialog()");
		}
		onAfterRoll = onAfterRoll || function () {};

		if (typeof baseDefault !== "object") baseDefault = { name: "DICE.BASE", value: baseDefault };
		if (typeof skillDefault !== "object") skillDefault = { name: "DICE.SKILL", value: skillDefault };
		if (typeof gearDefault !== "object") gearDefault = { name: "DICE.GEAR", value: gearDefault };

		let baseHtml = this.buildInputHtmlDialog(baseDefault.name, "base", baseDefault.value);
		let skillHtml = this.buildInputHtmlDialog(skillDefault.name, "skill", skillDefault.value);
		let gearHtml = this.buildInputHtmlDialog(gearDefault.name, "gear", gearDefault.value);
		let artifactHtml = this.buildInputHtmlDialog("DICE.ARTIFACTS", "artifacts", artifactDefault);
		let modifierHtml = this.buildInputHtmlDialog("DICE.MODIFIER", "modifier", modifierDefault);

		let d = new Dialog({
			title:
				rollName !== "DICE.ROLL"
					? game.i18n.localize("DICE.ROLL") + ": " + game.i18n.localize(rollName)
					: game.i18n.localize("DICE.ROLL"),
			content: this.buildDivHtmlDialog(baseHtml + skillHtml + gearHtml + artifactHtml + modifierHtml),
			buttons: {
				roll: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize("DICE.ROLL"),
					callback: (html: any) => {
						let base = html.find("#base")[0].value;
						let skill = html.find("#skill")[0].value;
						let gear = html.find("#gear")[0].value;
						let artifact = this.parseArtifact(html.find("#artifacts")[0].value);
						let modifier = html.find("#modifier")[0].value;
						diceRoller.roll(
							game.i18n.localize(rollName),
							parseInt(base, 10),
							parseInt(skill, 10),
							parseInt(gear, 10),
							artifact,
							parseInt(modifier, 10),
							parseInt(damage, 10),
						);
						onAfterRoll(diceRoller);
					},
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize("DICE.CANCEL"),
					callback: () => {},
				},
			},
			default: "roll",
			close: () => {},
			render: this.activateListeners,
		});
		d.render(true);
	}

	/**
	 * @param {object}   spell       Spell data
	 * @param {Function} onAfterRoll Callback that is executed after roll is made
	 */
	static prepareSpellDialog(spell, onAfterRoll) {
		const diceRoller = new DiceRoller();
		onAfterRoll = onAfterRoll || function () {};

		let baseHtml = this.buildInputHtmlDialog("DICE.BASE", "base", 1);
		let successHtml = this.buildInputHtmlDialog("DICE.AUTOMATIC_SUCCESS", "success", 0);
		let d = new Dialog({
			title: game.i18n.localize("ITEM.TypeSpell") + ": " + spell.name,
			content: this.buildDivHtmlDialog(baseHtml + successHtml),
			buttons: {
				roll: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize("DICE.ROLL"),
					callback: (html: any) => {
						let base = html.find("#base")[0].value;
						let success = html.find("#success")[0].value;
						diceRoller.rollSpell(spell.name, parseInt(base, 10), parseInt(success, 10));
						onAfterRoll(diceRoller);
					},
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize("DICE.CANCEL"),
					callback: () => {},
				},
			},
			default: "roll",
			close: () => {},
			render: this.activateListeners,
		});
		d.render(true);
	}

	/**
	 * @param  {string} divContent
	 */
	static buildDivHtmlDialog(divContent) {
		return "<div class='flex row roll-dialog'><table>" + divContent + "</table></div>";
	}

	/**
	 * @param  {string} diceName
	 * @param  {string} diceId
	 * @param  {number} diceValue
	 */
	static buildInputHtmlDialog(diceName, diceId, diceValue) {
		let row = "<tr>";
		row += "<td><b>" + game.i18n.localize(diceName) + "</b></td>";
		row += "<td style='text-align: center;'>";
		if (diceName !== "DICE.ARTIFACTS") {
			row +=
				"<a class='modifier-button' data-operator='minus' data-field='" +
				diceId +
				"'><i class='fas fa-minus-square'></i></a>";
		}
		row += "</td>";
		row += "<td style='text-align: center;'>";
		row += "<input id='" + diceId + "' style='text-align: center' type='text' value='" + diceValue + "'/>";
		row += "</td>";
		row += "<td style='text-align: center;'>";
		if (diceName !== "DICE.ARTIFACTS") {
			row +=
				"<a class='modifier-button' data-operator='plus' data-field='" +
				diceId +
				"'><i class='fas fa-plus-square'></i></a>";
		}
		row += "</td>";
		row += "</tr>";
		return row;
	}

	/**
	 * Parse artifact dice string
	 *
	 * @param  {string} artifact
	 */
	static parseArtifact(artifact) {
		let regex = /([0-9]*)d([0-9]*)/gi;
		let regexMatch;
		let artifacts = [];
		while ((regexMatch = regex.exec(artifact))) {
			artifacts.push({ dice: +regexMatch[1] || 1, face: +regexMatch[2] });
		}
		return artifacts;
	}

	static activateListeners(html) {
		html.find(".modifier-button").click((ev) => {
			const field = $(ev.currentTarget).data("field");
			const operator = $(ev.currentTarget).data("operator");
			const input = html.find("#" + field);
			let value = parseInt(input.val(), 10) || 0;
			value += operator === "plus" ? 1 : -1;
			input.val(value);
		});
	}
}
