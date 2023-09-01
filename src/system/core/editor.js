import localizeString from "@utils/localize-string.js";

export function initializeEditorEnrichers() {
	CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
		{
			pattern: /\$big\[(.+?)\]/gim,
			enricher: async (match) => {
				const doc = document.createElement("span");
				doc.className = "big-first-char";
				doc.innerHTML = match[1];
				return doc;
			},
		},
		{
			pattern: /\[(x)\]/gim,
			enricher: async (match) => {
				const doc = document.createElement("span");
				doc.className = "fbl-swords";
				doc.innerHTML = match[1];
				return doc;
			},
		},
		{
			pattern: /\[(l)\]/gim,
			enricher: async (match) => {
				const doc = document.createElement("span");
				doc.className = "fbl-skull";
				doc.innerHTML = match[1];
				return doc;
			},
		},
		{
			pattern: /\$branded\[(.+?)\]/gim,
			enricher: async (match) => {
				const doc = document.createElement("span");
				doc.className = "fbl-branding-bold";
				doc.innerHTML = match[1];
				return doc;
			},
		},
		{
			pattern: /\$capital\[(.+?)\]/gim,
			enricher: async (match) => {
				const doc = document.createElement("span");
				doc.className = "fbl-uppercase";
				doc.innerHTML = match[1];
				return doc;
			},
		},
		{
			pattern: /\$example\[(.+?)\]/gim,
			enricher: async (match) => {
				const doc = document.createElement("span");
				doc.className = "fbl-example";
				doc.innerHTML = match[1];
				return doc;
			},
		},
		{
			pattern: /\$iheading\[(.+?)\]/gim,
			enricher: async (match) => {
				const doc = document.createElement("span");
				doc.className = "fbl-uppercase fbl-inline-heading";
				doc.innerHTML = match[1];
				return doc;
			},
		},
		{
			pattern: /@Draw\[(.+?)\]/gim,
			enricher: async (match) => {
				const table =
					game.tables.get(match[1]) ?? game.tables.getName(match[1]);
				const html = table
					? /* html */ `<a
					class="inline-table"
					data-id="${table.id}"
					onclick="game.tables.get('${table.id}').draw();"
					data-tooltip="${localizeString("TABLE.DRAW")} ${table.name}"
					><i class="fas fa-cards" ></i>${table.name}</a>
				`
					: /* html */ `<span class="broken"><i class="fas fa-broken"></i>${match[1]}</span>`;
				return $(html)[0];
			},
		},
		{
			pattern: /@ToggleScene\[(.+?)\]/gim,
			enricher: async (match) => {
				const scene =
					game.scenes.get(match[1]) ?? game.scenes.getName(match[1]);
				const html = scene
					? /* html */ `<a
					class="inline-scene"
					data-id="${scene.id}"
					onclick="game.scenes.get('${scene.id}').view();"
					data-tooltip="${localizeString("SCENE.RENDER")} ${scene.name}"
					><i class="fas fa-map" ></i>${scene.name}</a>
				`
					: /* html */ `<span class="broken"><i class="fas fa-broken"></i>${match[1]}</span>`;
				return $(html)[0];
			},
		},
		{
			pattern: fblrRegEx,
			enricher: fblrEnricher,
		},
	]);

	// Add event listener to body tag. It reacts on the generated HTML buttons with class fblroll
	document.querySelector("body").addEventListener("click", async (event) => {
		if (event.target.closest(".fblroll")) {
			event.preventDefault();
			event.stopPropagation();

			return fblrListener(event);
		}
	});
}

const fblrRegEx =
	/\[\[\/fblr (?:(\d+)db\s?)?(?:(\d+)ds\s?)?(?:(\d+)dg\s?)?(?:1d(6|8|10|12)\s?)?(?:([+|-]\d+)\s?)?(\d)?\]\](?:{([^}]+)})?/gi;

/**
 * The "fblr" text enricher that creates a deferred inline roll button.
 * @param {RegExpMatchArray} match the pattern match for this enricher
 * @param {EnrichmentOptions} options the options passed to the enrich function
 * @returns {Promise<HTMLElement>} the deferred inline roll button
 */
function fblrEnricher(match /*, options*/) {
	const span = document.createElement("span");
	span.classList.add("fas");
	span.classList.add("fa-dice-d20");

	const button = document.createElement("button");
	// add attributes
	button.type = "button";
	// add classes
	button.classList.add("fblroll");
	button.classList.add("roll");
	button.classList.add("inline-roll");
	// add dataset
	button.dataset.fblBase = match[1] || 1;
	button.dataset.fblSkill = match[2] || 0;
	button.dataset.fblGear = match[3] || 0;
	button.dataset.fblArtifact = match[4] || "";
	button.dataset.fblModifier = match[5] || "";
	button.dataset.fblDamage = match[6] || "";
	// the text inside
	button.innerHTML = match[7] || localizeString("ACTION.GENERIC");
	button.prepend(span);
	return button;
}

/**
 * A event listener for click events on /fblr enrichers in editors.
 *
 * @param {ClickEvent} event The Click Event.
 * @returns A Promise
 */
function fblrListener(event) {
	const button = event.target;
	const data = {
		attribute: {
			label: "DICE.BASE",
			value: button.dataset.fblBase,
		},
		skill: {
			label: "DICE.SKILL",
			value: button.dataset.fblSkill,
		},
		gear: {
			label: "DICE.GEAR",
			value: button.dataset.fblGear,
			artifactDie: button.dataset.fblArtifact
				? `1d${button.dataset.fblArtifact}`
				: "",
			damage: Number(button.dataset.fblDamage),
		},
		/* title: "inline Roll", */
	};
	const options = {};
	if (button.dataset.fblModifier) {
		options.modifiers = [
			{
				name: localizeString("DICE.MODIFIER"),
				value: button.dataset.fblModifier,
				active: true,
			},
		];
	}
	return game.fbl.roll(data, options).catch((error) => console.log(error));
}
