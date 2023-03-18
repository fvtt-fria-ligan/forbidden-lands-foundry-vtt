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
	]);
}
