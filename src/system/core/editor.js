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
			pattern: /@DisplayTable\[(.+?)\]/gim,
			enricher: async (match) => {
				const table = game.tables.get(match[1]) ?? game.tables.getName(match[1]);
				if (!table) return /* html */ `<span class="broken"><i class="fas fa-broken"></i>match[1]</span>`;
				const div = document.createElement("div");
				div.className = "fbl-table-display";
				const html = /* html */ `
						<h4>${table.name}</h4>
						<table>
							<thead>
								<tr>
									<th>${table.formula === "1d6*10+1d6" ? "D66" : table.formula}</th>
									<th>Result</th>
								</tr>
							</thead>
							<tbody>
								${table.results
									.map((result) => {
										const range =
											result.range[1] - result.range[0] === 0
												? result.range[0]
												: result.range.join("-");
										return /* html */ `
											<tr>
												<td>${range}</td>
												<td>${result.text}</td>
											</tr>
											`;
									})
									.join("")}
							</tbody>
						</table>
				`;
				div.innerHTML = html;
				return div;
			},
		},
	]);
}
