export function registerFonts() {
	CONFIG.fontDefinitions.Author = {
		editor: true,
		fonts: [
			{ urls: ["/system/forbidden-lands/fonts/Author-SemiBold.otf"], weight: 600 },
			{ urls: ["/system/forbidden-lands/fonts/Author-SemiBoldItalic.otf"], weight: 600, style: "italic" },
			{ urls: ["/system/forbidden-lands/fonts/Author-Medium.otf"] },
			{ urls: ["/system/forbidden-lands/fonts/Author-MediumItalic.otf"], style: "italic" },
		],
	};
	CONFIG.fontDefinitions["IM Fell Great Primer"] = {
		editor: true,
		fonts: [
			{ urls: ["/system/forbidden-lands/fonts/IMFeGPrm29C.otf"] },
			{ urls: ["/system/forbidden-lands/fonts/IMFeGPit29C.otf"], style: "italic" },
		],
	};
}
