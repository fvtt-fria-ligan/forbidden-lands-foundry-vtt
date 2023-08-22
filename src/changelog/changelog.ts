import { transform } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";

declare namespace CONST {
	const SHOWDOWN_OPTIONS: {};
}

declare namespace game {
	const i18n: {
		localize(arg0: string): unknown;
		lang: string;
	};
}

type PromiseFullfilled<T> = { status: "fulfilled"; value: T };

export class Changelog extends FormApplication {
	SOURCE: string;
	#converter: showdown.Converter;

	protected _updateObject(): Promise<unknown> {
		throw new Error("Method not implemented.");
	}

	constructor(object?: object, options?: FormApplicationOptions) {
		super(object, options);

		this.SOURCE = "https://api.github.com/repos/fvtt-fria-ligan/forbidden-lands-foundry-vtt/releases?per_page=10";

		this.#converter = (() => {
			Object.entries({
				...CONST.SHOWDOWN_OPTIONS,
				headerLevelStart: 2,
				simplifiedAutoLink: true,
				excludeTrailingPunctuationFromURLs: true,
				ghCodeBlocks: true,
				ghMentions: true,
				strikethrough: true,
				literalMidWordUnderscores: true,
			}).forEach(([k, v]) => globalThis.showdown.setOption(k, v));
			const converter = new globalThis.showdown.Converter();
			converter.setFlavor("github");
			return converter;
		})();
	}

	async #sanitizeHtml(html: string) {
		return transform(html, [
			sanitize({
				allowElements: [
					"details",
					"summary",
					"pre",
					"code",
					"h2",
					"h3",
					"h4",
					"h5",
					"h6",
					"p",
					"strong",
					"b",
					"em",
					"u",
					"s",
					"a",
					"ul",
					"ol",
					"li",
					"br",
					"img",
				],
				allowAttributes: {
					a: ["href"],
					img: ["src", "alt"],
				},
			}),
		]);
	}

	async #generateChangelog() {
		const response = await fetch(this.SOURCE);
		const data = await response.json();
		const localizedDate = new Intl.DateTimeFormat(game.i18n.lang, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const changelog = await Promise.allSettled(
			data.map(async (release: any, index: number) => {
				const version = release.tag_name;
				const date = localizedDate.format(new Date(release.published_at));
				const raw = release.body;
				const html = this.#converter.makeHtml(raw);
				const cleanHtml = await this.#sanitizeHtml(html);
				return `<details ${index === 0 ? "open" : ""} >
				<summary><i class="fas fa-square-caret-right"></i><h2>${version} – <span>${date}</span></h2></summary>
				${cleanHtml}
				</details>`;
			}),
		);

		return changelog
			.filter((entry): entry is PromiseFullfilled<string> => entry.status === "fulfilled")
			.map((entry) => entry.value)
			.join("<hr>");
	}

	async render() {
		const content = await this.#generateChangelog();
		Dialog.prompt({
			title: "Changelog",
			content: `<h1>${game.i18n.localize("CONFIG.CHANGELOG")}</h1>${content}`,
			options: {
				width: 600,
				resizable: true,
				classes: ["fbl", "changelog"],
			},
			render: (html) => {
				html.find(".dialog-content").scrollTop(0);
			},
			callback: () => {},
		});
	}
}
