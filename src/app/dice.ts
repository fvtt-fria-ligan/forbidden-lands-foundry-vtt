export class ForbiddenLandsD6 extends Die {
	constructor(termData) {
		termData.faces = 6;
		super(termData);
	}

	static DENOMINATION: any = "6";

	static getResultLabel(result) {
		return `<img src="systems/forbidden-lands/assets/dice/skill-d6-${result}.png" alt="${result}" title="${result}" />`;
	}
}

export class BaseDie extends ForbiddenLandsD6 {
	static DENOMINATION = "b";

	static getResultLabel(result) {
		return `<img src="systems/forbidden-lands/assets/dice/base-d6-${result}.png" alt="${result}" title="${result}" />`;
	}
}

export class GearDie extends ForbiddenLandsD6 {
	static DENOMINATION = "g";

	static getResultLabel(result) {
		return `<img src="systems/forbidden-lands/assets/dice/gear-d6-${result}.png" alt="${result}" title="${result}" />`;
	}
}

export class SkillDie extends ForbiddenLandsD6 {
	static DENOMINATION = "s";
}

export class ArtifactD8 extends Die {
	constructor(termData) {
		termData.faces = 8;
		super(termData);
	}

	static DENOMINATION: any = "8";

	static getResultLabel(result) {
		return `<img src="systems/forbidden-lands/assets/dice/artifact-d8-${result}.png" alt="${result}" title="${result}" />`;
	}
}

export class ArtifactD10 extends Die {
	constructor(termData) {
		termData.faces = 10;
		super(termData);
	}

	static DENOMINATION: any = "10";

	static getResultLabel(result) {
		return `<img src="systems/forbidden-lands/assets/dice/artifact-d10-${result}.png" alt="${result}" title="${result}" />`;
	}
}

export class ArtifactD12 extends Die {
	constructor(termData) {
		termData.faces = 12;
		super(termData);
	}

	static DENOMINATION: any = "12";

	static getResultLabel(result) {
		return `<img src="systems/forbidden-lands/assets/dice/artifact-d12-${result}.png" alt="${result}" title="${result}" />`;
	}
}
