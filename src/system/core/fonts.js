export function registerFonts() {
	CONFIG.fontDefinitions.Author = {
		editor: true,
		fonts: [
			{ urls: ["systems/forbidden-lands/fonts/author-semibold.otf"], weight: 600 },
			{ urls: ["systems/forbidden-lands/fonts/author-semibold-italic.otf"], weight: 600, style: "italic" },
			{ urls: ["systems/forbidden-lands/fonts/author-medium.otf"] },
			{ urls: ["systems/forbidden-lands/fonts/author-medium-italic.otf"], style: "italic" },
		],
	};
	CONFIG.fontDefinitions["IM Fell Great Primer"] = {
		editor: true,
		fonts: [
			{ urls: ["systems/forbidden-lands/fonts/imfe-gprm.otf"] },
			{ urls: ["systems/forbidden-lands/fonts/imfe-gpit.otf"], style: "italic" },
		],
	};
}
