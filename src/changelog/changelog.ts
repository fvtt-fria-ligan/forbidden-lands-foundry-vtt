import App from "./changelog.svelte";

export class Changelog extends FormApplication {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "changelog",
			template: "systems/forbidden-lands/templates/template.hbs",
			title: "Changelog",
			width: 450,
			height: 600,
			classes: ["changelog"],
			resizable: true,
		});
	}

	getData() {
		return super.getData();
	}

	protected async _render(
		force?: boolean,
		options?: Application.RenderOptions<FormApplicationOptions>,
	): Promise<void> {
		await super._render(force, options);
		const app = new App({
			target: this.form,
			props: {
				version: game.system.data.version,
			},
			intro: true,
		});
		console.log("Changelog | Rendered", app);
	}
}
