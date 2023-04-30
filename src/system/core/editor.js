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
				const table = game.tables.get(match[1]) ?? game.tables.getName(match[1]);
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
				const scene = game.scenes.get(match[1]) ?? game.scenes.getName(match[1]);
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
	]);
}
