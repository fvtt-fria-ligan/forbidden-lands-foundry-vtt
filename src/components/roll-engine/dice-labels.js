export function registerYZURLabels() {
	CONFIG.YZUR.Icons.getLabel = (type, result) =>
		`<img src="systems/forbidden-lands/assets/dice/${type}-${result}.png" alt="${result}" title="${result}" />`;
}

export class ForbiddenLandsD6 extends Die {
	constructor(termData) {
		termData.faces = 6;
		super(termData);
	}

	static DENOMINATION = 6;

	static getResultLabel(result) {
		return `<img src="systems/forbidden-lands/assets/dice/skill-${result}.png" alt="${result}" title="${result}" />`;
	}
}
