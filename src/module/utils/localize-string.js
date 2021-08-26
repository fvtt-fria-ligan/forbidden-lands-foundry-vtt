export default function localizeString(string) {
	if (!string) console.log(`No string passed`);
	try {
		const dict = CONFIG.fbl.i18n;
		let localeString = dict[string];
		if (!localeString) localeString = string;

		return game.i18n.localize(localeString);
	} catch (error) {
		console.log(`Failed to localize string: ${string}. Error: `, error);

		return string;
	}
}
